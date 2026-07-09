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


def _briefing():
    """A compact live market map from the whole corpus, so the engine invents into
    whitespace instead of repeating what's already crowded."""
    try:
        stats = db.category_stats()
    except Exception:
        stats = []
    if not stats:
        return ""
    stats.sort(key=lambda s: -(s.get("n") or 0))
    lines = []
    for s in stats[:12]:
        rev = s.get("top_rev") or 0
        revs = f", biggest proven ${int(rev):,}/mo" if 0 < rev <= 2_000_000 else ""
        lines.append(f"  - {s['category']}: {s['n']} ideas already, avg quality "
                     f"{s.get('avg_score') or '?'}/100{revs}")
    exemplars = []
    try:
        for t in db.top_scored(10):
            pol = t.get("polished")
            name = None
            if pol:
                try:
                    name = (json.loads(pol) if isinstance(pol, str) else pol).get("polished_title")
                except Exception:
                    name = None
            exemplars.append(f"  - {(name or t['title'])[:48]} ({t.get('category')}, {t.get('composite')}/100)")
    except Exception:
        pass
    out = ("CURRENT LANDSCAPE (what's already in the database — higher count = more crowded):\n"
           + "\n".join(lines))
    if exemplars:
        out += "\n\nTOP-SCORING EXISTING BUSINESSES (don't copy these — beat or avoid them):\n" + "\n".join(exemplars)
    return out


def _prompt(n, theme):
    focus = (f"\nHARD CONSTRAINT: every idea must fit this theme/niche — {theme}." if theme else "")
    brief = _briefing()
    brief_block = (f"\n\n{brief}\n\nUse this map: aim at UNDER-served or fast-shifting spaces, "
                   "and where a category is already crowded, only enter with a sharp differentiator "
                   "or a specific vertical no one owns.") if brief else ""
    return f"""You are a panel of three sharp operators — a bootstrapped founder, a contrarian seed VC,
and a market analyst — inventing brand-new businesses worth starting TODAY ({date.today().isoformat()}).
Be serious, specific, and NON-obvious. NO clichés ("Uber for X", vague "AI platform"), NO copy-paste of
existing companies — each must be a UNIQUE, differentiated, defensible play, ideally exploiting a gap,
a new regulation, a platform shift, or a trend that's rising but not yet crowded.{focus}{brief_block}

Bias toward businesses that can run LEAN and fairly HANDS-OFF: low starting capital, online/software
where possible, automatable, few staff — unless the theme demands otherwise. Still span a RANGE of types
across the {n} ideas (SaaS, AI vertical, productized service/agency, real product, content/faceless media,
marketplace) — don't return {n} clones of one thing.

For EACH idea reply in a JSON array of exactly {n} objects:
[{{
 "title": "<the brand/business name — inventive, memorable, 1-4 words>",
 "label": "<the what-it-IS tag, e.g. 'Telegram ad agency', 'AI lease-audit SaaS' — 2-6 words>",
 "description": "<5-7 sentences: the exact customer, the painful problem, how it works, the wedge, the revenue model. Concrete.>",
 "category": "<one of: saas, ai, ecommerce, physical-service, content, marketplace, game, fintech, agency, hardware, dev-tool, other>",
 "differentiation": "<why THIS is different from what already exists — the specific angle no one owns>",
 "unfair_advantage": "<the moat/edge that makes it defensible (data, distribution, niche depth, speed, community)>",
 "why_now": "<the specific {date.today().year} shift that opens this window>",
 "target_customer": "<the exact first customer>",
 "revenue_model": "<how it makes money + a rough price point>",
 "hands_off": <0-100: how autonomously it can run once built>,
 "is_online": <true if online/software/SaaS-type, false if physical>,
 "startup_capital_usd": <rough $ to start>,
 "est_first_year_revenue_usd": <realistic P50, not a fantasy>
}}, ...]
Make them genuinely clever — ideas a smart founder would get excited about and that a competitor
couldn't trivially copy."""


def generate(n=10, theme=None):
    """Generate n fresh ideas, store them, return the list of created idea rows."""
    n = max(1, min(20, int(n)))
    spec = analyst._llm_json(_prompt(n, (theme or "").strip()), research=True)
    if isinstance(spec, dict):
        spec = spec.get("ideas") if isinstance(spec.get("ideas"), list) else [spec]
    if not isinstance(spec, list):
        raise analyst.LLMError("generator did not return a list of ideas")
    made, rows = [], []
    for item in spec:
        if not isinstance(item, dict):
            continue
        title = str(item.get("title") or "").strip()
        if not title:
            continue
        desc = str(item.get("description") or "").strip()
        label = str(item.get("label") or "").strip()
        extras = []
        for k in ("differentiation", "unfair_advantage", "why_now", "target_customer", "revenue_model"):
            if item.get(k):
                extras.append(f"{k.replace('_', ' ').title()}: {item[k]}")
        if item.get("est_first_year_revenue_usd"):
            extras.append(f"Est. year-1 revenue: ${item['est_first_year_revenue_usd']}")
        full = (desc + ("  ||  " + " · ".join(extras) if extras else ""))[:2000]
        cat = str(item.get("category") or "").strip().lower()
        if cat not in categorize._LABELS:
            cat = categorize.classify(title, desc + " " + label)
        iid = "gen:" + hashlib.sha1(f"{title}\x1f{date.today().isoformat()}".encode()).hexdigest()[:16]
        db.upsert_idea({
            "id": iid, "origin": "gen", "title": title[:300], "description": full,
            "url": None, "points": None, "comments": None, "posted_at": None, "traction": 6.0,
        })
        db.set_idea_category(iid, cat)
        # keep the engine's brand name + what-it-is label as the display spec
        db.set_idea_polish(iid, {"polished_title": title[:120], "label": label[:80],
                                 "refined_description": label[:600], "from_generator": True}, cat)
        made.append({"id": iid, "title": title, "category": cat})
        # "polished" marker so the batch scorer keeps the engine's brand name + label
        rows.append({"id": iid, "title": title, "description": full, "polished": "1"})
    if not made:
        raise analyst.LLMError("generator returned no usable ideas")
    # score the fresh ideas right away so they appear graded (with autonomy) not blank
    for i in range(0, len(rows), 6):
        try:
            analyst.score_batch_sync(rows[i:i + 6])
        except Exception:
            pass
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
