"""Signal score — rank ideas WITHOUT any LLM call.

The 12-factor AI scorecard is the real evaluation, but it costs one LLM call per
idea, so scoring all ~18k is slow. The Signal score is the cheap complement: a
deterministic 0-100 number computed purely from evidence we already scraped, so
every idea is ranked instantly. It answers "which ideas are most worth the
expensive AI scoring / a human's attention?" — proven revenue and real traction
beat a catchy title.

Signal is a PRIORITISER, not a verdict: the auto-scorer works through ideas in
signal order (best first), and unscored ideas fall back to signal in the ranking.

Weights (sum 100):
  revenue proof   36  — IndieHackers reported $/mo: the strongest real signal
  traction        24  — velocity-weighted engagement (our scraped traction metric)
  momentum        14  — Google Trends interest, rising
  engagement      12  — raw upvotes (or followers for IndieHackers)
  source cred.    14  — how much the source itself implies a real business
"""
import math

from . import db

SOURCE_WEIGHT = {
    "ih": 1.00,   # real products WITH revenue
    "ss": 0.90,   # Starter Story — real businesses
    "hn": 0.85,   # Show HN launches
    "gen": 0.80,  # curated fresh ideas
    "ph": 0.80,   # Product Hunt launches
    "gh": 0.75,   # fast-growing repos
    "ahn": 0.70,  # Ask HN needs
    "lb": 0.70,   # Lobsters
    "custom": 0.70,
    "rd": 0.62,   # Reddit discussion
    "vid": 0.60,
    "dt": 0.60,   # Dev.to articles
    "v2": 0.55,   # V2EX discussion
    "feed": 0.45,  # generic RSS
}


def _nlog(x, cap):
    """0..1, log-scaled, saturating at cap (so $1M and $10M aren't wildly apart)."""
    if not x or x <= 0:
        return 0.0
    return min(1.0, math.log10(1 + x) / math.log10(1 + cap))


def signal_for(origin, points, comments, traction, momentum):
    rev = points if origin == "ih" else 0                 # IH stores $/mo in points
    eng = (comments if origin == "ih" else points) or 0   # IH: followers; else: upvotes
    revc = _nlog(rev, 500_000)
    trac = _nlog(traction or 0, 5000)
    mom = min(1.0, max(0.0, (momentum or 0) / 100.0))
    engc = _nlog(eng, 3000)
    sw = SOURCE_WEIGHT.get(origin, 0.5)
    return round(100 * (0.36 * revc + 0.24 * trac + 0.14 * mom + 0.12 * engc + 0.14 * sw), 1)


def compute_all():
    """(Re)compute the signal score for every idea. Pure Python + SQL, no LLM."""
    rows = db.all_ideas_for_signal()
    pairs = [(r["id"], signal_for(r["origin"], r["points"], r["comments"],
                                  r["traction"], r["momentum"])) for r in rows]
    return db.bulk_set_signal(pairs)
