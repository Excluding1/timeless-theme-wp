"""Idea sources.

v1 sources were picked for reliability + terms-friendliness:
 - Hacker News "Show HN" via the official Algolia search API (free, no auth).
 - Product Hunt via its public RSS feed (name/tagline/link); an API token can be
   added in Settings later for votes/topics via the official GraphQL API.
IndieHackers is deliberately NOT scraped in v1: it has no public API and the site
is a JS app — scraping it is fragile and against their terms. Revisit if needed.
"""
import hashlib
import json
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta

from . import db

UA = {"User-Agent": "IdeaLab/1.0 (local personal research tool)"}


def _get(url, timeout=25):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def _traction(points, comments, posted_at):
    """Quick heuristic: engagement weighted by recency-normalised velocity."""
    points = points or 0
    comments = comments or 0
    days = 30.0
    if posted_at:
        try:
            dt = datetime.fromisoformat(posted_at.replace("Z", "+00:00"))
            days = max((datetime.now(dt.tzinfo) - dt).total_seconds() / 86400, 0.25)
        except ValueError:
            pass
    velocity = (points + 2 * comments) / days
    return round(points + 2 * comments + 10 * velocity, 1)


def fetch_show_hn(days=30, min_points=20, pages=3):
    """Show HN launches from the last N days with at least min_points."""
    since = int((datetime.now() - timedelta(days=days)).timestamp())
    added = 0
    for page in range(pages):
        qs = urllib.parse.urlencode({
            "tags": "show_hn",
            "numericFilters": f"created_at_i>{since},points>={min_points}",
            "hitsPerPage": 100, "page": page,
        })
        data = json.loads(_get(f"https://hn.algolia.com/api/v1/search_by_date?{qs}"))
        hits = data.get("hits") or []
        for h in hits:
            title = re.sub(r"^Show HN:\s*", "", (h.get("title") or "").strip(), flags=re.I)
            if not title:
                continue
            desc = (h.get("story_text") or "").strip()
            desc = re.sub(r"<[^>]+>", " ", desc)          # strip HTML tags
            desc = re.sub(r"\s+", " ", desc).strip()[:2000]
            posted = h.get("created_at")
            db.upsert_idea({
                "id": f"hn:{h.get('objectID')}",
                "origin": "hn",
                "title": title[:300],
                "description": desc,
                "url": h.get("url") or f"https://news.ycombinator.com/item?id={h.get('objectID')}",
                "points": h.get("points") or 0,
                "comments": h.get("num_comments") or 0,
                "posted_at": posted,
                "traction": _traction(h.get("points"), h.get("num_comments"), posted),
            })
            added += 1
        if len(hits) < 100:
            break
    return added


SUBREDDITS = ["SaaS", "Entrepreneur", "smallbusiness", "sidehustle", "sweatystartup",
              "indiehackers"]


_BROWSER_UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
               "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")


def fetch_reddit(days=30, min_score=20):
    """Top posts from business/startup subreddits (public read-only JSON).

    www.reddit.com 403s non-browser clients; old.reddit.com serves the same JSON."""
    added = 0
    window = "month" if days <= 31 else "year"
    for sub in SUBREDDITS:
        try:
            req = urllib.request.Request(
                f"https://old.reddit.com/r/{sub}/top.json?t={window}&limit=50",
                headers={"User-Agent": _BROWSER_UA})
            with urllib.request.urlopen(req, timeout=25) as r:
                data = json.load(r)
        except Exception:
            continue  # one blocked subreddit shouldn't kill the fetch
        for child in (data.get("data") or {}).get("children") or []:
            p = child.get("data") or {}
            if (p.get("score") or 0) < min_score or p.get("stickied"):
                continue
            title = (p.get("title") or "").strip()
            if not title:
                continue
            desc = re.sub(r"\s+", " ", (p.get("selftext") or "")).strip()[:2000]
            posted = None
            if p.get("created_utc"):
                posted = datetime.fromtimestamp(p["created_utc"]).isoformat()
            db.upsert_idea({
                "id": f"rd:{p.get('id')}",
                "origin": "rd",
                "title": f"[r/{sub}] {title}"[:300],
                "description": desc,
                "url": "https://www.reddit.com" + (p.get("permalink") or ""),
                "points": p.get("score") or 0,
                "comments": p.get("num_comments") or 0,
                "posted_at": posted,
                "traction": _traction(p.get("score"), p.get("num_comments"), posted),
            })
            added += 1
    return added


MEDIA_ARCHIVER_DB = db.BASE_DIR.parent / "media-archiver" / "data" / "archive.db"


def fetch_starterstory_local(username="starterstory"):
    """Ingest business ideas from the locally-archived Starter Story videos
    (the media-archiver's own downloads: titles, captions, transcript excerpts).
    Re-run any time — it picks up newly transcribed videos."""
    import sqlite3
    if not MEDIA_ARCHIVER_DB.exists():
        raise RuntimeError("media-archiver database not found — sync @starterstory there first")
    con = sqlite3.connect(f"file:{MEDIA_ARCHIVER_DB}?mode=ro", uri=True)
    con.row_factory = sqlite3.Row
    rows = con.execute(
        "SELECT id, title, caption, transcript, url, upload_date, view_count "
        "FROM videos WHERE username=? AND (caption IS NOT NULL OR transcript IS NOT NULL)",
        (username,)).fetchall()
    con.close()
    added = 0
    for r in rows:
        desc = (r["caption"] or "").strip()
        tr = (r["transcript"] or "").strip()
        if tr:  # a short excerpt is enough signal for the analyst
            desc = (desc + " | Transcript excerpt: " + re.sub(r"\s+", " ", tr)[:900]).strip(" |")
        if not desc and not (r["title"] or "").strip():
            continue
        posted = None
        if r["upload_date"] and len(r["upload_date"]) == 8:
            d = r["upload_date"]
            posted = f"{d[:4]}-{d[4:6]}-{d[6:]}T00:00:00"
        db.upsert_idea({
            "id": f"ss:{r['id']}",
            "origin": "ss",
            "title": (r["title"] or "Starter Story video").strip()[:300],
            "description": desc[:2000],
            "url": r["url"],
            "points": r["view_count"],
            "comments": None,
            "posted_at": posted,
            "traction": _traction((r["view_count"] or 0) // 100, 0, posted),
        })
        added += 1
    return added


def fetch_product_hunt():
    """Latest Product Hunt launches from the public RSS feed."""
    raw = _get("https://www.producthunt.com/feed")
    root = ET.fromstring(raw)
    ns = {"a": "http://www.w3.org/2005/Atom"}
    added = 0
    for entry in root.findall("a:entry", ns):
        title = (entry.findtext("a:title", "", ns) or "").strip()
        if not title:
            continue
        link_el = entry.find("a:link", ns)
        link = link_el.get("href") if link_el is not None else ""
        content = entry.findtext("a:content", "", ns) or ""
        desc = re.sub(r"<[^>]+>", " ", content)
        desc = re.sub(r"\s+", " ", desc).strip()[:2000]
        posted = (entry.findtext("a:published", "", ns) or "").strip() or None
        pid = hashlib.sha1((link or title).encode()).hexdigest()[:16]
        db.upsert_idea({
            "id": f"ph:{pid}",
            "origin": "ph",
            "title": title[:300],
            "description": desc,
            "url": link,
            "points": None,        # RSS feed carries no vote counts
            "comments": None,
            "posted_at": posted,
            "traction": _traction(0, 0, posted),
        })
        added += 1
    return added
