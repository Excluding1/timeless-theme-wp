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
