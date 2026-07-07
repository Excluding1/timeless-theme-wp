"""Fresh-idea generator — original, researched business ideas on demand.

Produces N genuinely-new ideas (not scraped) as first-class rows with
origin='gen', so each one flows through the exact same polish → scorecard →
persona panel → plan tournament → simulator pipeline as everything else. When
the Claude CLI is logged in, generation uses live web research; on Codex it uses
the model's own market knowledge. Runs in the background with a status feed.
"""
import hashlib
import json
import threading
from datetime import date

from . import analyst, categorize, db

_state = {"running": False, "phase": "", "made": 0, "theme": "", "error": ""}
_lock = threading.Lock()


def status():
    with _lock:
        return dict(_state)


def _prompt(n, theme):
    focus = (f"\nConstraint: every idea must fit this theme/niche — {theme}." if theme else "")
    return f"""You are a panel of three sharp operators — a bootstrapped founder, a seed VC,
and a market analyst — brainstorming brand-new business ideas worth building starting TODAY
({date.today().isoformat()}). Be serious, specific, and NON-obvious: no "Uber for X" clichés,
no vague "AI platform". Each idea should be something a small team could realistically start,
grounded in a real, current shift (tech, regulation, behaviour, cost curve).{focus}

Span a range of TYPES across the {n} ideas: software/SaaS, AI vertical tools, physical/local
services, real products (ecommerce/hardware), content/media (incl. faceless YouTube), and
marketplaces — don't return {n} variations of one thing.

For EACH idea give real substance. Reply with ONLY a JSON array of exactly {n} objects:
[{{
 "title": "<crisp product name + one-line what-it-is>",
 "description": "<5-7 sentences: the specific customer, the painful problem, how it works, the wedge, and the revenue model. Concrete, not hype.>",
 "category": "<one of: saas, ai, ecommerce, physical-service, content, marketplace, game, fintech, agency, hardware, dev-tool, other>",
 "why_now": "<the specific shift that makes this viable in {date.today().year}>",
 "target_customer": "<the exact first customer>",
 "revenue_model": "<how it makes money, with a rough price point>",
 "est_first_year_revenue_usd": <realistic P50 number, not a fantasy>,
 "build_difficulty": "<low|medium|high>",
 "example_or_analog": "<a real company/product that proves the shape of the market, if any>"
}}, ...]
Make them creative and distinct. Quality over safety — these should feel like ideas a smart
founder would actually get excited about."""


def generate(n=10, theme=None):
    """Generate n fresh ideas, store them, return the list of created idea rows."""
    n = max(1, min(20, int(n)))
    spec = analyst._llm_json(_prompt(n, (theme or "").strip()), research=True)
    if isinstance(spec, dict):
        spec = spec.get("ideas") if isinstance(spec.get("ideas"), list) else [spec]
    if not isinstance(spec, list):
        raise analyst.LLMError("generator did not return a list of ideas")
    made = []
    for item in spec:
        if not isinstance(item, dict):
            continue
        title = str(item.get("title") or "").strip()
        if not title:
            continue
        desc = str(item.get("description") or "").strip()
        extras = []
        for k in ("why_now", "target_customer", "revenue_model", "example_or_analog"):
            if item.get(k):
                extras.append(f"{k.replace('_', ' ').title()}: {item[k]}")
        if item.get("est_first_year_revenue_usd"):
            extras.append(f"Est. year-1 revenue: ${item['est_first_year_revenue_usd']}")
        if item.get("build_difficulty"):
            extras.append(f"Build difficulty: {item['build_difficulty']}")
        full = (desc + ("  ||  " + " · ".join(extras) if extras else ""))[:2000]
        cat = str(item.get("category") or "").strip().lower()
        if cat not in categorize._LABELS:
            cat = categorize.classify(title, desc)
        iid = "gen:" + hashlib.sha1(f"{title}\x1f{date.today().isoformat()}".encode()).hexdigest()[:16]
        db.upsert_idea({
            "id": iid, "origin": "gen", "title": title[:300], "description": full,
            "url": None, "points": None, "comments": None, "posted_at": None, "traction": 5.0,
        })
        db.set_idea_category(iid, cat)
        made.append({"id": iid, "title": title, "category": cat})
    if not made:
        raise analyst.LLMError("generator returned no usable ideas")
    return made


def start_generation(n=10, theme=None):
    """Background generation with a status feed. Returns False if one is already running."""
    with _lock:
        if _state["running"]:
            return False
        _state.update(running=True, phase="thinking up ideas…", made=0,
                      theme=(theme or ""), error="")

    def go():
        try:
            made = generate(n, theme)
            with _lock:
                _state.update(made=len(made), phase="done")
        except Exception as e:
            with _lock:
                _state.update(error=str(e)[:200], phase="error")
        finally:
            with _lock:
                _state["running"] = False

    threading.Thread(target=go, daemon=True).start()
    return True
