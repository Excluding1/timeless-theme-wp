"""Product-Fit Test — the realistic replacement for the Monte Carlo simulator.

The old simulator answered "what are the 10-year odds?" with hundreds of variables
that mostly don't apply. This answers the questions that actually gate a build
decision, in TWO LLM calls:

  1. PRD call   — draft a lean fake PRD: the product as if it existed (features,
                  pricing, UI concept, differentiation-vs-competitors angle).
  2. Market call — cast ~12 REALISTIC target customers for THIS product (not a
                  generic persona bank), have each "use" it: would they adopt/pay,
                  which segment they represent, their favorite feature, and their
                  biggest complaint written like a real Reddit comment. Then
                  aggregate: who buys, what to fix before building, fit verdict.

Output = fit score, buying segments, top complaints + fixes, competitor angle.
Cheap, concrete, and every finding is actionable (fix the complaints, keep the
features people pay for)."""
import json
import threading
import traceback
from datetime import date

from . import analyst, db

_state = {"running": False, "idea_id": None, "title": "", "phase": "", "test_id": None}
_lock = threading.Lock()


def status():
    with _lock:
        return dict(_state) if _state["running"] or _state["test_id"] else None


def _prd_prompt(idea):
    return f"""You are a senior product manager. Draft a LEAN fake PRD for this business idea as if
we were building it — realistic and specific, today is {date.today().isoformat()}.

{analyst._idea_block(idea)}

Reply with ONLY this JSON:
{{
 "product": "<brand/product name>",
 "one_liner": "<what it is, for whom — one sentence>",
 "target_market": "<the specific market/vertical>",
 "core_features": ["<the 5-8 features v1 ships — concrete, not vague>"],
 "pricing": {{"model": "<subscription/usage/one-off>", "tiers": ["<e.g. Free / $29 / $99>"]}},
 "ui_concept": "<2-3 sentences: what the product looks/feels like to use>",
 "competitors": ["<2-4 real competitors or closest substitutes>"],
 "differentiation": "<the angle: differentiator OR cost-leader, and specifically how>"
}}"""


def _market_prompt(idea, prd):
    return f"""A product-market fit test. Below is a PRD for a product that does NOT exist yet.
Cast 12 REALISTIC potential customers for THIS specific product — a spread of the actual segments
that would encounter it (different roles, company sizes, use-cases; include 2-3 skeptics who love a
competitor or the status quo). Then simulate each one trying the product for a week.

PRD:
{json.dumps(prd, indent=1)[:3500]}

Honest human behaviour: most people churn, complain about price, or go back to spreadsheets.
Reply with ONLY this JSON:
{{
 "customers": [{{"who": "<short persona: role @ context>", "segment": "<segment name>",
   "adopts": true/false, "pays": true/false, "price_ok": "<what they'd pay, e.g. '$29/mo'>",
   "favorite": "<feature they'd actually use>",
   "complaint": "<their biggest gripe, written EXACTLY like a real Reddit comment, 1-2 sentences>"}} x12],
 "segments_that_buy": ["<the 1-3 segments where paying interest concentrated>"],
 "top_complaints": [{{"complaint": "<theme>", "fix": "<the concrete product/pricing fix BEFORE building>"}} x3-5],
 "killer_feature": "<the single feature that converts people>",
 "missing_feature": "<the most-requested thing NOT in the PRD>",
 "competitor_pull": "<why the skeptics stayed with competitors — what we must neutralise>",
 "fit_score": <0-100: strength of product-market fit signal>,
 "verdict": "<build|reshape|skip>",
 "verdict_reason": "<one blunt sentence>"
}}"""


def run_fit_test(idea_id):
    """Synchronous core: PRD call + market call, persisted. Returns test id."""
    idea = db.idea(idea_id)
    if not idea:
        raise ValueError("Unknown idea")
    tid = db.new_fit_test(idea_id)
    try:
        with _lock:
            _state["phase"] = "drafting the PRD"
        prd = analyst._llm_json(_prd_prompt(idea))
        if not isinstance(prd, dict) or not prd.get("core_features"):
            raise analyst.LLMError("PRD reply unusable")
        db.update_fit_test(tid, prd=prd)
        with _lock:
            _state["phase"] = "12 target customers trying it"
        res = analyst._llm_json(_market_prompt(idea, prd))
        if not isinstance(res, dict) or not isinstance(res.get("customers"), list):
            raise analyst.LLMError("market test reply unusable")
        fit = round(max(0.0, min(100.0, analyst._to_num(res.get("fit_score"), 0))), 1)
        verdict = res.get("verdict") if res.get("verdict") in ("build", "reshape", "skip") else "reshape"
        db.update_fit_test(tid, result=res, fit_score=fit, verdict=verdict, status="done")
        return tid
    except Exception as e:
        db.update_fit_test(tid, status="error", error=str(e)[:500])
        raise


def start_fit_test(idea_id):
    idea = db.idea(idea_id)
    if not idea:
        raise ValueError("Unknown idea")
    with _lock:
        if _state["running"]:
            raise analyst.Busy("A fit test is already running — wait for it.")
        _state.update(running=True, idea_id=idea_id, title=idea["title"][:80],
                      phase="starting", test_id=None)

    def go():
        try:
            tid = run_fit_test(idea_id)
            with _lock:
                _state.update(test_id=tid, phase="done")
        except Exception:
            traceback.print_exc()
            with _lock:
                _state["phase"] = "error"
        finally:
            with _lock:
                _state["running"] = False

    threading.Thread(target=go, daemon=True).start()
    return True
