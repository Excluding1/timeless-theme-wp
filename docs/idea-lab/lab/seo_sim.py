"""SEO-business simulator — for programmatic-content ventures (Permitly-shaped).

The generic simulator modeled 'customers × churn', which says nothing about how an
organic-traffic business actually behaves. This models ONLY the variables that drive
a programmatic-SEO product, each with an honest uncertainty range:

  pages(t)       — launch batch + monthly publishing velocity (AI agent does the work)
  sandbox        — Google trust lag: effectiveness ramps 0→1 starting month ~3-6,
                   full strength ~month 8-14 (drawn per trial)
  traffic/page   — long-tail local queries; lognormal across trials, power-law-ish
                   in aggregate; capped by total search demand for the territory
  AI-overview    — a growing share of informational clicks never leave Google/ChatGPT;
                   partially offset by AEO citations bringing branded/direct visits
  conversion     — visits → $ via three real streams: one-off reports, pro (contractor)
                   subscriptions w/ churn, and display ads once sessions clear ad-network
                   minimums
  costs          — infra + LLM ingestion; labor ≈ $0 because the agent builds/writes

Outcomes over 36 months, 2,000 trials. No lawsuits, no clones, no exit multiples —
just: does this reach real money, when, and what kills it (traffic never materialising).
"""
import math
import random

MONTHS = 36
TRIALS = 2000


def _clamp(x, lo, hi):
    return max(lo, min(hi, x))


def simulate_permitly(seed=7, trials=TRIALS,
                      launch_pages=300, pages_per_month=120,
                      report_price=14.0, pro_price=39.0):
    random.seed(seed)
    results = []
    for _ in range(trials):
        # --- per-trial draws (the uncertainty that matters) ---
        # median mature visits per page per month for long-tail local how-to queries
        vpp = random.lognormvariate(math.log(14), 0.75)          # P50≈14, P90≈37, P10≈5
        # when Google starts trusting the site, and how long till full strength
        sandbox_start = random.uniform(2.5, 6.0)
        sandbox_full = sandbox_start + random.uniform(4.0, 8.0)
        # share of informational clicks eaten by AI overviews (grows over the horizon)
        ai_eat_start = random.uniform(0.25, 0.40)
        ai_eat_end = random.uniform(0.40, 0.60)
        # AEO win-back: if we ARE the cited source, some clicks/branded visits return
        aeo_factor = random.uniform(0.05, 0.25)
        # conversion rates
        report_cv = random.uniform(0.0015, 0.006)    # visits → $14 one-off report
        pro_cv = random.uniform(0.00008, 0.0004)     # visits → $39/mo contractor sub
        pro_churn = random.uniform(0.04, 0.09)
        ad_rpm = random.uniform(12.0, 26.0)          # $ per 1000 sessions once eligible
        # demand ceiling for the covered territory (grows as we add cities/projects)
        demand_cap0 = random.uniform(60_000, 220_000)  # monthly visits ceiling at launch coverage
        # THE catastrophic risk for programmatic sites: Google's helpful-content /
        # scaled-content systems classify the site as thin and suppress it site-wide.
        # Real base rate for template-generated sites is high; genuinely useful,
        # cited, interactive pages lower it — range reflects that spread.
        suppressed = random.random() < random.uniform(0.15, 0.35)
        suppress_month = random.uniform(4, 18) if suppressed else None
        suppress_mult = random.uniform(0.05, 0.30) if suppressed else 1.0

        pages = float(launch_pages)
        subs = 0.0
        cash = -random.uniform(300, 900)             # domain, tools, misc setup
        monthly_rev = [0.0] * MONTHS
        breakeven_m = None
        for m in range(MONTHS):
            pages += pages_per_month
            # sandbox ramp 0→1
            if m < sandbox_start:
                trust = 0.0
            elif m < sandbox_full:
                trust = (m - sandbox_start) / (sandbox_full - sandbox_start)
            else:
                trust = 1.0
            ai_eat = ai_eat_start + (ai_eat_end - ai_eat_start) * (m / MONTHS)
            demand_cap = demand_cap0 * (1 + 0.5 * m / MONTHS)
            raw = pages * vpp * trust
            if suppress_month is not None and m >= suppress_month:
                raw *= suppress_mult
            visits = min(raw, demand_cap) * (1 - ai_eat) * (1 + aeo_factor)
            # revenue streams
            rev_reports = visits * report_cv * report_price
            subs = subs * (1 - pro_churn) + visits * pro_cv
            rev_pro = subs * pro_price
            rev_ads = (visits / 1000.0) * ad_rpm if visits >= 30_000 else 0.0
            rev = rev_reports + rev_pro + rev_ads
            # costs: infra + LLM ingestion for new pages + email
            cost = 45 + pages_per_month * random.uniform(0.15, 0.45) + (25 if visits > 20000 else 0)
            cash += rev - cost
            monthly_rev[m] = rev
            if breakeven_m is None and cash > 0:
                breakeven_m = m + 1
        results.append({"rev": monthly_rev, "cash": cash, "breakeven": breakeven_m,
                        "visits_m12": min(pages, 0) or None})
    return results


def summarize(results):
    def pct(vals, q):
        vals = sorted(vals)
        k = (len(vals) - 1) * q
        f = math.floor(k)
        c = math.ceil(k)
        return vals[int(k)] if f == c else vals[f] * (c - k) + vals[c] * (k - f)

    out = {"checkpoints": {}}
    for m in (5, 11, 17, 23, 35):
        vals = [r["rev"][m] for r in results]
        out["checkpoints"][f"m{m+1}"] = {q: round(pct(vals, p))
                                         for q, p in (("p10", .1), ("p50", .5), ("p90", .9))}
    m12 = [r["rev"][11] for r in results]
    m24 = [r["rev"][23] for r in results]
    out["odds"] = {
        "dead_at_12mo (<$200/mo — PRD kill line)": round(100 * sum(1 for v in m12 if v < 200) / len(m12), 1),
        "side_income_24mo ($1k-5k/mo)": round(100 * sum(1 for v in m24 if 1000 <= v < 5000) / len(m24), 1),
        "target_hit_24mo (>$5k/mo)": round(100 * sum(1 for v in m24 if v >= 5000) / len(m24), 1),
        "smash_24mo (>$15k/mo)": round(100 * sum(1 for v in m24 if v >= 15000) / len(m24), 1),
        "breakeven_ever": round(100 * sum(1 for r in results if r["breakeven"]) / len(results), 1),
    }
    be = [r["breakeven"] for r in results if r["breakeven"]]
    out["median_breakeven_month"] = round(pct(be, .5)) if be else None
    out["p50_36mo_total_profit"] = round(pct([r["cash"] for r in results], .5))
    out["p90_36mo_total_profit"] = round(pct([r["cash"] for r in results], .9))
    return out


if __name__ == "__main__":
    import json
    res = simulate_permitly()
    print(json.dumps(summarize(res), indent=1))
