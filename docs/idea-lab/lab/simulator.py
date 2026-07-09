"""Business simulator — run the whole life of a business, hundreds of times.

A Monte Carlo engine simulates the idea month-by-month for 10 years across many
independent trials. Each trial draws its own founder quality, growth, and churn,
and rolls the dice every month on the events that actually kill or make small
businesses: a competitor entering, a cheap overseas clone, a lawsuit, a viral
moment, platform/algorithm dependency, and acquisition offers. We then read the
distribution like a data analyst — probability of each outcome, P10/P50/P90
revenue per year, the realistic exit value and the "potential max", and which
events most often cause failure — and an LLM turns that into plain-English
"here's what to avoid or fix before you start" advice.

Priors come from category defaults, refined by the idea's own analysis (its
median willingness-to-pay, adoption rate, cost/revenue estimates) when one
exists. Everything here is a MODEL of an uncertain future, not a prophecy — the
output always says so.
"""
import json
import math
import random
import threading
import traceback

from . import analyst, db

YEARS = 10
MONTHS = YEARS * 12
TRIALS = 500

# Per-category priors. Opinionated but defensible starting assumptions; the idea's
# own analysis overrides price/growth/costs when available.
#   churn      : monthly customer churn
#   growth     : median monthly organic growth in customers (heavy-tailed per trial)
#   ceiling    : realistic max reachable customers for a small team
#   clone/comp/platform/lawsuit/viral : PER-YEAR probability of that event
#   exit_mult  : acquisition multiple applied to ARR
#   price      : default monthly revenue per customer if analysis has none
_DEF = {"churn": .05, "growth": .10, "ceiling": 3000, "clone": .12, "comp": .35,
        "platform": .08, "lawsuit": .03, "viral": .06, "exit_mult": 3.0, "price": 30}
_PRIORS = {
    "saas":     {"churn": .03, "growth": .12, "ceiling": 4000, "comp": .35, "exit_mult": 4.0, "price": 40},
    "ai":       {"churn": .05, "growth": .18, "ceiling": 6000, "clone": .20, "comp": .45, "platform": .12, "viral": .10, "exit_mult": 5.0, "price": 30},
    "ecommerce":{"churn": .10, "growth": .10, "ceiling": 20000, "clone": .30, "comp": .40, "platform": .10, "exit_mult": 2.5, "price": 25},
    "physical-service": {"churn": .04, "growth": .06, "ceiling": 600, "clone": .10, "comp": .30, "platform": .02, "lawsuit": .05, "viral": .02, "exit_mult": 1.5, "price": 300},
    "content":  {"churn": .03, "growth": .15, "ceiling": 15000, "clone": .15, "platform": .30, "viral": .18, "exit_mult": 2.0, "price": 8},
    "marketplace": {"churn": .06, "growth": .10, "ceiling": 8000, "clone": .18, "comp": .40, "platform": .12, "exit_mult": 3.5, "price": 20},
    "game":     {"churn": .12, "growth": .12, "ceiling": 30000, "comp": .45, "platform": .25, "viral": .20, "exit_mult": 2.0, "price": 6},
    "fintech":  {"churn": .03, "growth": .10, "ceiling": 5000, "comp": .40, "platform": .10, "lawsuit": .10, "exit_mult": 5.0, "price": 40},
    "agency":   {"churn": .05, "growth": .07, "ceiling": 120, "comp": .35, "platform": .03, "lawsuit": .04, "viral": .03, "exit_mult": 1.0, "price": 2500},
    "hardware": {"churn": .06, "growth": .07, "ceiling": 8000, "clone": .35, "comp": .40, "lawsuit": .06, "exit_mult": 2.0, "price": 120},
    "dev-tool": {"churn": .03, "growth": .14, "ceiling": 5000, "comp": .40, "platform": .08, "lawsuit": .01, "viral": .10, "exit_mult": 4.0, "price": 25},
}

_CAUSE_LABELS = {
    "no_traction": "Never found product-market fit — too few customers ever showed up",
    "abandoned": "Founder gave up — stuck below ramen profit with no momentum",
    "ran_out_of_cash": "Ran out of runway before reaching profitability",
    "shock": "Killed by an external shock (competitor / clone / lawsuit / platform)",
}
_SHOCK_LABELS = {
    "competitor": "a well-funded competitor entered and compressed growth & price",
    "clone": "a cheap overseas clone copied you and capped the market",
    "lawsuit": "a legal / regulatory / liability hit",
    "platform": "a platform or algorithm you depend on changed the rules",
    "viral": "a viral moment / lucky break",
}


def _priors_for(idea):
    cat = (idea.get("category") or "other").lower()
    p = dict(_DEF)
    p.update(_PRIORS.get(cat, {}))
    p["category"] = cat
    return p


def _yr_to_month_p(p_year):
    p_year = max(0.0, min(0.95, p_year))
    return 1 - (1 - p_year) ** (1 / 12)


def _percentile(sorted_vals, q):
    if not sorted_vals:
        return 0
    k = (len(sorted_vals) - 1) * q
    lo = math.floor(k)
    hi = math.ceil(k)
    if lo == hi:
        return sorted_vals[int(k)]
    return sorted_vals[lo] * (hi - k) + sorted_vals[hi] * (k - lo)


def _run_trial(p, price, monthly_cost, build_cost):
    """One life of the business, month by month. Demand-limited and honest: most
    ideas are duds (few customers ever show up) and most founders quit a business
    that stays stuck below ramen profit — so failure is the common outcome, as in
    reality. Returns that trial's outcome, revenue path, and how it ended."""
    # Product-market fit is the master variable and it's heavy-left: most ideas
    # land weak, a few are strong. This is what makes most trials fail.
    pmf = random.random() ** 2.4                              # 0..1, skewed low
    founder = random.lognormvariate(0, 0.5)                   # execution/luck multiplier
    ceiling = max(20, p["ceiling"] * random.uniform(0.3, 1.6) * (0.25 + pmf))
    base_leads = random.uniform(0.4, 7) * founder * pmf       # weak ideas get ~0 signups
    kfac = max(0.0, p["growth"] * founder * (0.3 + pmf))      # referral/word-of-mouth growth
    churn = max(0.006, random.gauss(p["churn"] * (1.5 - 0.7 * pmf), p["churn"] * 0.35))
    runway_floor = -random.uniform(6000, 40000) - build_cost  # how deep cash can go before quitting

    pm = {k: _yr_to_month_p(p[k]) for k in ("clone", "comp", "platform", "lawsuit", "viral")}
    fired = set()
    customers = 0.0
    cash = -build_cost
    arr_by_year = [0.0] * YEARS
    peak_arr = 0.0
    first_profit_month = None
    outcome, exit_value, cause = None, 0.0, None
    underwater = 0
    end_m = MONTHS - 1

    for m in range(MONTHS):
        # --- monthly shocks ---
        if "comp" not in fired and random.random() < pm["comp"]:
            fired.add("comp"); kfac *= 0.6; base_leads *= 0.7; price *= 0.9
        if "clone" not in fired and random.random() < pm["clone"]:
            fired.add("clone"); ceiling *= 0.5; kfac *= 0.7; price *= 0.75
        if "platform" not in fired and random.random() < pm["platform"]:
            fired.add("platform"); base_leads *= 0.4; kfac *= 0.5
        if "lawsuit" not in fired and random.random() < pm["lawsuit"]:
            fired.add("lawsuit"); cash -= random.uniform(5000, 70000)
            if random.random() < 0.25:                        # some legal hits are fatal
                outcome, cause, end_m = "failed", "shock", m; break
        if "viral" not in fired and random.random() < pm["viral"]:
            fired.add("viral"); customers += ceiling * random.uniform(0.05, 0.25)

        # --- demand-limited growth ---
        saturation = min(1.0, customers / ceiling)
        adds = base_leads * (1 - saturation) + customers * kfac * (1 - saturation)
        customers = max(0.0, customers * (1 - churn) + adds)
        mrr = customers * price
        arr = mrr * 12
        peak_arr = max(peak_arr, arr)
        cash += mrr - monthly_cost
        if mrr > monthly_cost and first_profit_month is None:
            first_profit_month = m + 1
        arr_by_year[m // 12] = arr

        # --- acquisition: rare, needs real scale, modest multiples ---
        if arr > 250_000:
            p_offer = _yr_to_month_p(min(0.12, 0.01 + (arr - 250_000) / 9_000_000))
            if random.random() < p_offer:
                mult = p["exit_mult"] * (0.6 if arr < 1_000_000 else 1.0) * random.uniform(0.5, 1.4)
                outcome, exit_value, cause, end_m = "acquired", arr * mult, None, m
                break

        # --- ran out of runway ---
        underwater = underwater + 1 if cash < runway_floor else 0
        if underwater >= 6 and m >= 6:
            outcome, cause, end_m = "failed", "ran_out_of_cash", m; break

        # --- founder abandons a stuck project (the dominant real-world outcome) ---
        if m >= 4:
            ramen = monthly_cost + 900
            if mrr < ramen:
                p_quit = 0.055 if m >= 10 else 0.03           # patience runs out over time
                if customers < 3:
                    p_quit += 0.03
                if random.random() < p_quit:
                    outcome, cause, end_m = "failed", ("no_traction" if peak_arr < 12000 else "abandoned"), m
                    break

    # zero out revenue after death/exit for the trajectory view
    if outcome in ("failed", "acquired"):
        for y in range(end_m // 12 + 1, YEARS):
            arr_by_year[y] = 0.0

    if outcome is None:
        arr10 = arr_by_year[-1]
        if arr10 >= 2_000_000:
            outcome = "breakout"
        elif arr10 >= 250_000:
            outcome = "scaling"
        elif arr10 >= 25_000:
            outcome = "lifestyle"
        else:
            outcome, cause = "failed", "no_traction"
        # notional terminal value only for a genuinely alive business
        if outcome != "failed":
            mult = p["exit_mult"] * (0.6 if arr10 < 1_000_000 else 1.0)
            exit_value = arr10 * mult * random.uniform(0.6, 1.2)

    if outcome == "failed" and cause is None:
        cause = "no_traction"

    return {"outcome": outcome, "exit_value": exit_value, "peak_arr": peak_arr,
            "arr_by_year": arr_by_year, "cause": cause, "shocks": sorted(fired),
            "first_profit_month": first_profit_month}


def simulate(idea, trials=TRIALS, seed=None):
    """Run the Monte Carlo and return the numeric summary (no LLM)."""
    if seed is not None:
        random.seed(seed)
    p = _priors_for(idea)

    an = db.latest_analysis(idea["id"])
    price = p["price"]
    monthly_cost = 300.0
    build_cost = 6000.0
    if an:
        try:
            est = json.loads(an["estimates"]) if an.get("estimates") else {}
        except (TypeError, json.JSONDecodeError):
            est = {}
        if an.get("price_med"):
            price = max(1.0, float(an["price_med"]))
        if est.get("monthly_cost_usd"):
            monthly_cost = max(0.0, float(est["monthly_cost_usd"]))
        if est.get("effort_cost_usd"):
            build_cost = max(500.0, float(est["effort_cost_usd"]))
        elif est.get("build_hours"):
            build_cost = max(500.0, float(est["build_hours"]) * 60)
        # a higher panel adoption rate lifts organic growth
        if an.get("adoption") is not None:
            p["growth"] *= 0.5 + float(an["adoption"]) / 100.0

    results = [_run_trial(p, price, monthly_cost, build_cost) for _ in range(trials)]

    buckets = ("breakout", "scaling", "lifestyle", "acquired", "failed")
    counts = {b: 0 for b in buckets}
    for r in results:
        counts[r["outcome"]] = counts.get(r["outcome"], 0) + 1
    odds = {b: round(100 * counts[b] / trials, 1) for b in buckets}

    def pctiles(year_idx):
        vals = sorted(r["arr_by_year"][year_idx] for r in results)
        return {"p10": round(_percentile(vals, 0.10)),
                "p50": round(_percentile(vals, 0.50)),
                "p90": round(_percentile(vals, 0.90))}
    revenue_curve = {f"y{y+1}": pctiles(y) for y in (0, 1, 2, 4, 9)}
    p50_by_year = [round(_percentile(sorted(r["arr_by_year"][y] for r in results), 0.5))
                   for y in range(YEARS)]
    p90_by_year = [round(_percentile(sorted(r["arr_by_year"][y] for r in results), 0.9))
                   for y in range(YEARS)]

    acquired = [r for r in results if r["outcome"] == "acquired"]
    exit_vals = sorted(r["exit_value"] for r in acquired)
    all_terminal = sorted(r["exit_value"] for r in results)
    survivors = [r for r in results if r["outcome"] in ("lifestyle", "scaling", "breakout", "acquired")]
    profit_months = sorted(r["first_profit_month"] for r in results if r["first_profit_month"])

    failed = [r for r in results if r["outcome"] == "failed"]
    cause_counts = {}
    for r in failed:
        cause_counts[r["cause"]] = cause_counts.get(r["cause"], 0) + 1
    failure_modes = [
        {"mode": cause, "label": _CAUSE_LABELS.get(cause, cause),
         "pct_of_all": round(100 * c / trials, 1)}
        for cause, c in sorted(cause_counts.items(), key=lambda x: -x[1])
    ]
    # how often each external shock happened across ALL trials — context, not blame:
    # over 10 years almost every long-lived business meets a competitor, so this is
    # base-rate exposure, reported separately from what actually ended each run.
    shock_map = {"comp": "competitor", "clone": "clone", "platform": "platform",
                 "lawsuit": "lawsuit", "viral": "viral"}
    shock_counts = {}
    for r in results:
        for e in r["shocks"]:
            k = shock_map.get(e)
            if k:
                shock_counts[k] = shock_counts.get(k, 0) + 1
    shocks = [{"shock": k, "label": _SHOCK_LABELS.get(k, k), "pct_of_all": round(100 * v / trials, 1)}
              for k, v in sorted(shock_counts.items(), key=lambda x: -x[1])]

    return {
        "trials": trials, "category": p["category"],
        "assumptions": {"price_per_customer_month": round(price, 2),
                        "monthly_cost": round(monthly_cost),
                        "upfront_build_cost": round(build_cost),
                        "exit_multiple_arr": p["exit_mult"],
                        "used_analysis": bool(an)},
        "odds": odds,
        "success_rate": round(100 * len(survivors) / trials, 1),
        "revenue_curve": revenue_curve,
        "p50_arr_by_year": p50_by_year,
        "p90_arr_by_year": p90_by_year,
        "exit": {
            "prob_acquisition": odds["acquired"],
            "median_exit_if_acquired": round(_percentile(exit_vals, 0.5)) if exit_vals else 0,
            "p90_exit_if_acquired": round(_percentile(exit_vals, 0.9)) if exit_vals else 0,
            "potential_max_value_p99": round(_percentile(all_terminal, 0.99)),
            "expected_value": round(sum(all_terminal) / trials),
        },
        "median_months_to_profit": round(_percentile(profit_months, 0.5)) if profit_months else None,
        "failure_modes": failure_modes,
        "shocks": shocks,
    }


# ---------- LLM narrative ----------

def _narrative_prompt(idea, summary):
    return f"""You are a data analyst presenting the results of a 500-run Monte Carlo simulation
of this business's first 10 years. Speak plainly and quantitatively — like reading a
probability distribution, not a pep talk. Do not invent numbers; use the ones given.

{analyst._idea_block(idea)}

SIMULATION RESULTS (JSON):
{json.dumps(summary, indent=1)[:6000]}

Write clean Markdown with EXACTLY these sections:
## The read
2-3 sentences: what the distribution says about this business's realistic future and odds.
## Most likely outcomes
Turn the `odds` and `success_rate` into a plain-English ranking (breakout / scaling / lifestyle /
acquired / failed) with the percentages.
## Biggest ways it dies
Take `failure_modes` (what actually ENDED each run) and, for the top 2-3, give the probability and
the ONE concrete thing to do early to reduce it. Then note the `shocks` (external events most runs
FACED — e.g. a competitor entering) as risks to plan for, keeping the distinction clear: facing a
shock is near-certain over 10 years; being killed by one is not.
## Levers that most improve the odds
The 3 highest-leverage moves (pricing, channel, retention, niche, moat) given these numbers.
## Money & time
Realistic revenue path (use P50 by year), median time to profit, realistic exit value, and the
rare-upside "potential max". Be honest about the gap between median and the dream.
## Before you start — do these first
A 4-6 item checklist to de-risk this specific idea before committing real money.
## Confidence
One sentence: how confident to be, and the biggest assumption this rests on.
Keep it under ~700 words. End with: *Simulation is a model of an uncertain future, not a
prediction — validate the key assumptions with real customers.*
Reply with ONLY the Markdown."""


def _route_prompt(idea, summary):
    odds = summary.get("odds", {})
    return f"""You are a sharp, slightly cheeky startup strategist. A 500-run Monte Carlo of this
business just finished — most runs failed ({odds.get('failed', '?')}%), the wins were concentrated.
Your job: chart the SINGLE best realistic route from zero to a good outcome — the path that the
winning runs would most likely have taken — and be smart about it, not generic.

{analyst._idea_block(idea)}

Simulation odds: {json.dumps(odds)}. Category: {summary.get('category')}.
Median months to profit: {summary.get('median_months_to_profit')}. Assumptions: {json.dumps(summary.get('assumptions', {}))}.

Write clean Markdown with EXACTLY these sections:
## Best realistic route
A fenced ```mermaid ``` block: `flowchart LR` of the smartest path (unfair wedge -> first 10 customers
-> cheapest working channel -> the differentiator -> monetise -> the ONE expansion that compounds ->
realistic exit). Under 12 nodes, labels under 5 words, concrete not generic.
## Why this route beats the default
2-3 sentences on why this path dodges the top failure mode from the sim.
## Smart / cheeky moves
3-4 NON-obvious, specific plays a clever founder would use here — unconventional wedges, a pricing
trick, a distribution hack, a "wedge then widen" pivot, arbitrage, or a way to make it more hands-off.
Not textbook advice; things most people miss.
## The one bet
The single highest-leverage decision this whole route hinges on.
Keep it under ~450 words. Reply with ONLY the Markdown."""


# ---------- orchestration (one simulation at a time) ----------

_state = {"running": False, "idea_id": None, "title": "", "phase": "", "sim_id": None}
_lock = threading.Lock()


def status():
    with _lock:
        return dict(_state) if _state["running"] or _state["sim_id"] else None


def start_simulation(idea_id, trials=TRIALS):
    idea = db.idea(idea_id)
    if not idea:
        raise ValueError("Unknown idea")
    with _lock:
        if _state["running"]:
            raise analyst.Busy("A simulation is already running — wait for it.")
        _state.update(running=True, idea_id=idea_id, title=idea["title"][:80],
                      phase="running Monte Carlo", sim_id=None)
    try:
        sid = db.new_simulation(idea_id, TRIALS)
        with _lock:
            _state["sim_id"] = sid
        threading.Thread(target=_run, args=(sid, idea, trials), daemon=True).start()
        return sid
    except BaseException as e:
        with _lock:
            _state.update(running=False, phase=f"failed to start: {str(e)[:120]}")
        raise


def _run(sid, idea, trials):
    try:
        summary = simulate(idea, trials=trials)
        db.update_simulation(sid, summary=summary, trials=summary["trials"])
        with _lock:
            _state["phase"] = "writing the analyst read"
        try:
            narrative = analyst._run_llm(_narrative_prompt(idea, summary))
        except analyst.LLMError as e:
            narrative = ("_(The numeric simulation succeeded; the written analysis needs an LLM "
                         f"engine — {e}. Log into the Claude CLI or Codex for the narrative.)_")
        db.update_simulation(sid, narrative=narrative)
        with _lock:
            _state["phase"] = "charting the best route"
        try:
            route = analyst._run_llm(_route_prompt(idea, summary))
        except analyst.LLMError:
            route = ""
        db.update_simulation(sid, route=route, status="done")
        with _lock:
            _state["phase"] = "done"
    except Exception as e:
        traceback.print_exc()
        with _lock:
            _state["phase"] = str(e)[:160]
        try:
            db.update_simulation(sid, status="error", error=str(e)[:500])
        except Exception:
            traceback.print_exc()
    finally:
        with _lock:
            _state["running"] = False
