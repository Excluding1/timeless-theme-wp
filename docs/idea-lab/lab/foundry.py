"""The Foundry — the business-LLM that turns 18k ideas of training data into
ventures WE build.

Pipeline (deliberately cheap on LLM usage):
  briefing  — pure SQL over the corpus: which categories actually make money
              (real IndieHackers $/mo), proven pricing patterns, crowding, the
              top exemplars worth learning from. Zero LLM.
  shortlist — ONE LLM call: given the briefing + constraints ("buildable end-to-end
              by an AI coding agent, online, low capital, SEO/AEO-rankable"),
              propose N distinct ventures, each with a differentiation OR
              cost-leadership angle and a trend/breakout rationale.
  prd       — ONE LLM call per venture: the full build-ready PRD — features,
              pages, data model sketch, pricing, competitor table, SEO/AEO
              keyword map, launch checklist. Saved as downloadable markdown.

Ventures land in the `ventures` table and can then go through the Product-Fit
Test before any real building starts."""
import json
import threading
import traceback
from datetime import date

from . import analyst, db

_state = {"running": False, "phase": "", "made": 0, "error": ""}
_lock = threading.Lock()


def status():
    with _lock:
        return dict(_state)


def briefing():
    """What the corpus teaches us — pure SQL, no LLM."""
    stats = db.category_stats()
    rev_rows = db.revenue_exemplars(14)
    lines = ["WHAT 18K REAL IDEAS + REVENUE DATA TEACH US:"]
    lines.append("Category landscape (count = crowding):")
    for s in stats[:11]:
        rev = s.get("top_rev") or 0
        revs = f", best proven ${int(rev):,}/mo" if 0 < rev <= 2_000_000 else ""
        lines.append(f"  - {s['category']}: {s['n']} ideas, avg score {s.get('avg_score') or '?'}{revs}")
    lines.append("Proven money-makers (real self-reported revenue):")
    for r in rev_rows:
        lines.append(f"  - {r['name'][:44]} ({r.get('category')}): ${int(r['rev']):,}/mo — {r['label'][:60]}")
    return "\n".join(lines)


def _shortlist_prompt(n, theme, brief):
    focus = f"\nHARD CONSTRAINT: fit this theme — {theme}." if theme else ""
    return f"""You are the venture strategist of a two-person studio: one human founder + one elite AI
coding agent (Claude) that can fully build web apps, SaaS, and content sites end-to-end. Today is
{date.today().isoformat()}. Using the market intelligence below, propose {n} DISTINCT ventures for the
studio to build, each intended to reach ~$10k+/mo mostly via ORGANIC traffic (programmatic SEO +
AEO — being the answer AI assistants cite).

{brief}

RULES:
- Every venture must be fully buildable by the AI agent: web/SaaS/vertical-AI site/tool/content engine.
  No hardware, no local premises, minimal capital, automatable to run near hands-off.
- No copy-paste of an existing product: each must state its POSITION — "differentiator" (a specific
  angle/vertical/feature no one owns) or "cost-leader" (same job, radically cheaper because AI does
  the labor).
- Prefer spaces that are rising/breakout-flavored now but not yet crowded; use the landscape above to
  avoid saturated zones. Steal proven PRICING patterns from the money-makers.
- SEO-winnable: a clear keyword/topic territory where a new site can realistically rank.{focus}

Reply with ONLY a JSON array of exactly {n} objects:
[{{"name": "<brand name — short, memorable, domainable>",
   "label": "<what it IS, e.g. 'AI lease-audit SaaS' — 2-6 words>",
   "position": "<differentiator|cost-leader>",
   "angle": "<the specific differentiation or cost angle in one sharp sentence>",
   "why_now": "<the trend/shift/breakout making this timely>",
   "customer": "<the exact first customer>",
   "pricing": "<model + price point, stolen from what provably works>",
   "seo_territory": "<the keyword/topic cluster it can own, with 2-3 example queries>",
   "inspired_by": "<which proven business(es) from the data inspired the mechanics>",
   "est_mo_revenue_12mo": <realistic P50 $/mo at month 12>}}, ...]"""


def _prd_prompt(v):
    return f"""Write the FULL build-ready PRD for this venture, to be built end-to-end by an AI coding
agent (Claude) and ranked via organic search. Today is {date.today().isoformat()}. Be concrete — this
is the document the build starts from tomorrow.

VENTURE: {json.dumps(v, indent=1)[:2200]}

Write clean Markdown with EXACTLY these sections:
# {v.get('name')} — PRD
## What & who   (one-liner, exact target customer, the painful job-to-be-done)
## Position     (differentiator or cost-leader — and the moat that develops over time)
## Core features (v1: 5-8, each one line; then v2 parking lot)
## Pages & UX   (every page/screen the site needs, incl. the programmatic-SEO page templates)
## Data & stack (data model sketch; recommended stack an AI agent builds fastest, e.g. Next.js+Supabase or plain FastAPI)
## Pricing      (tiers with $ — anchored to proven comparables)
## SEO / AEO plan (keyword clusters + example titles for 20 programmatic pages; how to become the AI-cited answer; 3 link-earning assets)
## Competitors  (table: name — their strength — our counter)
## Launch checklist (the 10 steps from repo-init to first organic signup)
## Kill / scale criteria (the numbers at day 30/90 that say kill, keep, or scale)
Under ~1100 words. Reply with ONLY the Markdown."""


def run(n=10, theme=None):
    brief = briefing()
    with _lock:
        _state["phase"] = f"shortlisting {n} ventures from the corpus"
    out = analyst._llm_json(_shortlist_prompt(n, theme, brief), research=True)
    if isinstance(out, dict):
        out = out.get("ventures") if isinstance(out.get("ventures"), list) else [out]
    if not isinstance(out, list) or not out:
        raise analyst.LLMError("shortlist reply unusable")
    made = 0
    for v in out[:n]:
        if not isinstance(v, dict) or not v.get("name"):
            continue
        vid = db.new_venture(v)
        with _lock:
            _state["phase"] = f"writing PRD: {v['name'][:36]}"
            _state["made"] = made
        try:
            prd_md = analyst._run_llm(_prd_prompt(v))
            db.update_venture(vid, prd=prd_md, status="done")
        except analyst.LLMError as e:
            db.update_venture(vid, status="error", error=str(e)[:300])
        made += 1
    with _lock:
        _state["made"] = made
    return made


def start(n=10, theme=None):
    with _lock:
        if _state["running"]:
            return False
        _state.update(running=True, phase="reading the corpus", made=0, error="")

    def go():
        try:
            run(n, theme)
            with _lock:
                _state["phase"] = "done"
        except Exception as e:
            traceback.print_exc()
            with _lock:
                _state.update(error=str(e)[:200], phase="error")
        finally:
            with _lock:
                _state["running"] = False

    threading.Thread(target=go, daemon=True).start()
    return True
