"""Transcript → real product(s) extractor.

Video ideas carry a clickbait title and, for the lucky ones, a full interview
transcript in the media-archiver. This reads that transcript and asks the LLM what
the video is ACTUALLY about — the real business(es). Crucially, one video often
profiles SEVERAL founders/products (a roundup), so this returns a LIST and splits a
single video into one idea row PER business, each showing the real product name.

The first product updates the original row (keeping the video as its "source"); any
additional products become new rows `<origin>:<videoid>#2`, `#3`, … Everything then
flows through scoring / simulation like any other idea.
"""
import re
import sqlite3
import threading
import traceback

from . import analyst, categorize, db, rank, sources

_state = {"running": False, "phase": "", "done": 0, "total": 0, "products": 0}
_lock = threading.Lock()


def status():
    with _lock:
        return dict(_state)


def _transcribed_videos():
    """(videoid, username, platform, title, url, transcript, view_count) for every
    archived video that HAS a transcript — the only ones we can read."""
    ma = sources.MEDIA_ARCHIVER_DB
    if not ma.exists():
        return []
    con = sqlite3.connect(f"file:{ma}?mode=ro", uri=True)
    con.row_factory = sqlite3.Row
    rows = con.execute(
        "SELECT id, username, platform, title, url, transcript, view_count FROM videos "
        "WHERE transcript IS NOT NULL AND TRIM(transcript) != ''").fetchall()
    con.close()
    return [dict(r) for r in rows]


def _prompt(title, transcript):
    return f"""Read this video interview transcript and identify the ACTUAL business(es)/product(s)
it is about — the real companies discussed, NOT the video title and NOT the host's own
promotions (ignore Starter Story, newsletters, courses, "link in bio").

Most videos profile ONE business — return one object. But some are roundups that cover
SEVERAL distinct founders/products — in that case return ONE object PER real business.

VIDEO TITLE: {title}
TRANSCRIPT (may be partial):
{transcript[:6500]}

Reply with ONLY a JSON array (no prose):
[{{"product_name": "<the real business/product name, 2-6 words; if truly unnamed, a crisp descriptor>",
   "what_it_is": "<one sentence: what it is and who it's for>",
   "category": "<one of: saas, ai, ecommerce, physical-service, content, marketplace, game, fintech, agency, hardware, dev-tool, other>",
   "revenue": "<any revenue/scale figure actually stated, e.g. '$100k/mo', else ''>",
   "how_it_works": "<2-4 sentences of concrete detail from the transcript: the model, the wedge, how it makes money>"}}]"""


def _origin_for(username):
    return "ss" if username == "starterstory" else "vid"


def extract_from_video(v):
    """Extract product(s) from one transcribed video; create/update idea rows.
    Returns the number of products written."""
    products = analyst._llm_json(_prompt(v["title"], v["transcript"]))
    if isinstance(products, dict):
        products = [products]
    if not isinstance(products, list):
        return 0
    origin = _origin_for(v["username"])
    base_id = f"{origin}:{v['id']}"
    parent = db.idea(base_id)
    base_traction = (parent or {}).get("traction") or \
        sources._traction((v.get("view_count") or 0) // 100, 0, None)
    written = 0
    for i, p in enumerate(products):
        if not isinstance(p, dict):
            continue
        name = str(p.get("product_name") or "").strip()
        if not name:
            continue
        what = str(p.get("what_it_is") or "").strip()
        how = str(p.get("how_it_works") or "").strip()
        rev = str(p.get("revenue") or "").strip()
        cat = str(p.get("category") or "").strip().lower()
        if cat not in categorize._LABELS:
            cat = categorize.classify(name, what + " " + how)
        desc = " ".join(x for x in (what, how, (f"Reported: {rev}" if rev else "")) if x)[:2000]
        spec = {"polished_title": name[:120],
                "refined_description": (what or how)[:600],
                "from_extract": True, "source_title": v["title"][:200]}
        if i == 0 and parent:
            # keep the original row + its youtube title as "source"; just attach the product
            db.set_idea_polish(base_id, spec, cat)
            if desc:
                db.update_idea_description(base_id, desc)
        else:
            iid = f"{base_id}#{i + 1}"
            db.upsert_idea({
                "id": iid, "origin": origin, "title": name[:300], "description": desc,
                "url": v.get("url"), "points": None, "comments": None, "posted_at": None,
                "traction": round(base_traction * (1.0 if i == 0 else 0.85), 1),
            })
            db.set_idea_polish(iid, spec, cat)
        written += 1
    return written


def _already_extracted(v):
    """Skip a video whose primary row already has an extract-derived product."""
    row = db.idea(f"{_origin_for(v['username'])}:{v['id']}")
    if not row or not row.get("polished"):
        return False
    try:
        import json
        return bool((json.loads(row["polished"]) or {}).get("from_extract"))
    except Exception:
        return False


def extract_all_bg(force=False):
    with _lock:
        if _state["running"]:
            return False
        _state.update(running=True, phase="reading transcripts…", done=0, total=0, products=0)

    def go():
        try:
            vids = _transcribed_videos()
            todo = vids if force else [v for v in vids if not _already_extracted(v)]
            with _lock:
                _state["total"] = len(todo)
            for v in todo:
                with _lock:
                    _state["phase"] = f"reading: {v['title'][:50]}"
                try:
                    n = extract_from_video(v)
                    with _lock:
                        _state["products"] += n
                except Exception:
                    traceback.print_exc()
                with _lock:
                    _state["done"] += 1
            try:
                rank.compute_all()      # give the new split rows a Signal score
            except Exception:
                pass
            with _lock:
                _state["phase"] = "done"
        finally:
            with _lock:
                _state["running"] = False

    threading.Thread(target=go, daemon=True).start()
    return True
