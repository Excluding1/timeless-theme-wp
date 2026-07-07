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
import threading
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


def _getj(url, timeout=25):
    return json.loads(_get(url, timeout))


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


def fetch_ask_hn(days=90, min_points=30, pages=2):
    """Ask HN threads — people describing problems/needs (great idea fuel)."""
    since = int((datetime.now() - timedelta(days=days)).timestamp())
    added = 0
    for page in range(pages):
        qs = urllib.parse.urlencode({
            "tags": "ask_hn",
            "numericFilters": f"created_at_i>{since},points>={min_points}",
            "hitsPerPage": 100, "page": page,
        })
        data = _getj(f"https://hn.algolia.com/api/v1/search_by_date?{qs}")
        hits = data.get("hits") or []
        for h in hits:
            title = re.sub(r"^Ask HN:\s*", "", (h.get("title") or "").strip(), flags=re.I)
            if not title:
                continue
            desc = re.sub(r"<[^>]+>", " ", h.get("story_text") or "")
            db.upsert_idea({
                "id": f"ahn:{h.get('objectID')}", "origin": "ahn",
                "title": ("Ask HN: " + title)[:300],
                "description": re.sub(r"\s+", " ", desc).strip()[:2000],
                "url": f"https://news.ycombinator.com/item?id={h.get('objectID')}",
                "points": h.get("points") or 0, "comments": h.get("num_comments") or 0,
                "posted_at": h.get("created_at"),
                "traction": _traction(h.get("points"), h.get("num_comments"), h.get("created_at")),
            })
            added += 1
        if len(hits) < 100:
            break
    return added


def fetch_github(days=45, min_stars=80):
    """New repos that gained traction fast — dev tools / OSS product signal."""
    since = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")
    qs = urllib.parse.urlencode({
        "q": f"created:>{since} stars:>={min_stars}", "sort": "stars",
        "order": "desc", "per_page": 80,
    })
    data = _getj(f"https://api.github.com/search/repositories?{qs}")
    added = 0
    for repo in data.get("items") or []:
        desc = (repo.get("description") or "").strip()
        if not desc:
            continue
        posted = repo.get("created_at")
        db.upsert_idea({
            "id": f"gh:{repo.get('id')}", "origin": "gh",
            "title": (repo.get("full_name") or "").strip()[:300],
            "description": (desc + (f" [lang: {repo.get('language')}]" if repo.get("language") else ""))[:2000],
            "url": repo.get("html_url"),
            "points": repo.get("stargazers_count") or 0,
            "comments": repo.get("open_issues_count"),
            "posted_at": posted,
            "traction": _traction(repo.get("stargazers_count"), 0, posted),
        })
        added += 1
    return added


def fetch_devto(tags=("startup", "saas", "indiehackers", "business")):
    """Dev.to articles (official free API) tagged with startup/business topics."""
    added = 0
    for tag in tags:
        try:
            arts = _getj(f"https://dev.to/api/articles?tag={tag}&top=30&per_page=40")
        except Exception:
            continue
        for a in arts:
            title = (a.get("title") or "").strip()
            if not title:
                continue
            db.upsert_idea({
                "id": f"dt:{a.get('id')}", "origin": "dt",
                "title": title[:300],
                "description": re.sub(r"\s+", " ", (a.get("description") or "")).strip()[:2000],
                "url": a.get("url"),
                "points": a.get("positive_reactions_count") or 0,
                "comments": a.get("comments_count") or 0,
                "posted_at": a.get("published_at"),
                "traction": _traction(a.get("positive_reactions_count"), a.get("comments_count"), a.get("published_at")),
            })
            added += 1
    return added


def fetch_lobsters(min_score=15):
    """Lobste.rs hottest (official JSON) — tech products & launches."""
    added = 0
    for story in _getj("https://lobste.rs/hottest.json"):
        if (story.get("score") or 0) < min_score:
            continue
        title = (story.get("title") or "").strip()
        if not title:
            continue
        db.upsert_idea({
            "id": f"lb:{story.get('short_id')}", "origin": "lb",
            "title": title[:300],
            "description": re.sub(r"<[^>]+>|\s+", " ", story.get("description") or "").strip()[:2000],
            "url": story.get("url") or story.get("comments_url"),
            "points": story.get("score") or 0, "comments": story.get("comment_count") or 0,
            "posted_at": story.get("created_at"),
            "traction": _traction(story.get("score"), story.get("comment_count"), story.get("created_at")),
        })
        added += 1
    return added


# ---------- generic + local sources ----------

MEDIA_ARCHIVER_DB = db.BASE_DIR.parent / "media-archiver" / "data" / "archive.db"


def fetch_rss(url, name=None, prefix=None):
    """Ingest any RSS 2.0 or Atom feed. Powers user-added custom sources."""
    raw = _get(url, timeout=30)
    root = ET.fromstring(raw)
    prefix = prefix or ("rss:" + hashlib.sha1(url.encode()).hexdigest()[:8])
    label = name or "feed"
    items = root.findall(".//item")  # RSS 2.0
    atom_ns = "{http://www.w3.org/2005/Atom}"
    if not items:
        items = root.findall(f".//{atom_ns}entry")  # Atom
    added = 0
    for it in items:
        def txt(*tags):
            for t in tags:
                e = it.find(t) if not t.startswith("{") else it.find(t)
                if e is not None and (e.text or "").strip():
                    return e.text.strip()
                if e is not None and e.get("href"):
                    return e.get("href")
            return ""
        title = txt("title", f"{atom_ns}title")
        if not title:
            continue
        link = txt("link", f"{atom_ns}link")
        body = txt("description", "summary", f"{atom_ns}summary", f"{atom_ns}content",
                   "{http://purl.org/rss/1.0/modules/content/}encoded")
        desc = re.sub(r"<[^>]+>|\s+", " ", body).strip()[:2000]
        posted = txt("pubDate", f"{atom_ns}published", f"{atom_ns}updated") or None
        uid = hashlib.sha1((link or title).encode()).hexdigest()[:16]
        db.upsert_idea({
            "id": f"{prefix}:{uid}", "origin": "feed",
            "title": (f"[{label}] {title}")[:300], "description": desc,
            "url": link, "points": None, "comments": None,
            "posted_at": None, "traction": 1.0,
        })
        added += 1
    return added


def fetch_archive_channel(platform, username):
    """Ingest business ideas from ANY channel archived in the media-archiver
    (titles, captions, transcript excerpts). Generalises the Starter Story import."""
    import sqlite3
    if not MEDIA_ARCHIVER_DB.exists():
        raise RuntimeError("media-archiver database not found — sync a channel there first")
    con = sqlite3.connect(f"file:{MEDIA_ARCHIVER_DB}?mode=ro", uri=True)
    con.row_factory = sqlite3.Row
    rows = con.execute(
        "SELECT id, title, caption, transcript, url, upload_date, view_count "
        "FROM videos WHERE username=? AND platform=? "
        "AND (caption IS NOT NULL OR transcript IS NOT NULL)",
        (username, platform)).fetchall()
    con.close()
    added = 0
    for r in rows:
        desc = (r["caption"] or "").strip()
        tr = (r["transcript"] or "").strip()
        if tr:
            desc = (desc + " | Transcript excerpt: " + re.sub(r"\s+", " ", tr)[:900]).strip(" |")
        if not desc and not (r["title"] or "").strip():
            continue
        posted = None
        if r["upload_date"] and len(r["upload_date"]) == 8:
            d = r["upload_date"]
            posted = f"{d[:4]}-{d[4:6]}-{d[6:]}T00:00:00"
        origin = "ss" if username == "starterstory" else "vid"
        db.upsert_idea({
            "id": f"{origin}:{r['id']}", "origin": origin,
            "title": (r["title"] or f"{username} video").strip()[:300],
            "description": desc[:2000], "url": r["url"],
            "points": r["view_count"], "comments": None, "posted_at": posted,
            "traction": _traction((r["view_count"] or 0) // 100, 0, posted),
        })
        added += 1
    return added


def fetch_starterstory_local(username="starterstory"):
    return fetch_archive_channel("youtube", username)


def archive_channels():
    """List channels available to import from the media-archiver."""
    import sqlite3
    if not MEDIA_ARCHIVER_DB.exists():
        return []
    con = sqlite3.connect(f"file:{MEDIA_ARCHIVER_DB}?mode=ro", uri=True)
    con.row_factory = sqlite3.Row
    rows = con.execute(
        "SELECT platform, username, COUNT(*) n, "
        "SUM(CASE WHEN caption IS NOT NULL OR transcript IS NOT NULL THEN 1 ELSE 0 END) usable "
        "FROM videos GROUP BY key HAVING usable > 0 ORDER BY usable DESC").fetchall()
    con.close()
    return [dict(r) for r in rows]


# ---------- registry + fetch-all ----------

BUILTINS = [
    {"id": "hn", "name": "Show HN", "desc": "Hacker News launches (official API)"},
    {"id": "ahn", "name": "Ask HN", "desc": "HN problem/need threads"},
    {"id": "ph", "name": "Product Hunt", "desc": "Daily launches (public feed)"},
    {"id": "gh", "name": "GitHub", "desc": "New fast-growing repos (dev tools/OSS)"},
    {"id": "dt", "name": "Dev.to", "desc": "Startup/SaaS articles (official API)"},
    {"id": "lb", "name": "Lobsters", "desc": "Tech launches (official JSON)"},
    {"id": "rd", "name": "Reddit", "desc": "Business subreddits (best-effort)"},
    {"id": "ss", "name": "Starter Story", "desc": "Your local video archive"},
]

_BUILTIN_FNS = {
    "hn": lambda: fetch_show_hn(), "ahn": lambda: fetch_ask_hn(), "ph": lambda: fetch_product_hunt(),
    "gh": lambda: fetch_github(), "dt": lambda: fetch_devto(), "lb": lambda: fetch_lobsters(),
    "rd": lambda: fetch_reddit(), "ss": lambda: fetch_starterstory_local(),
}


def fetch_all(progress=None):
    """Run every enabled source (built-ins + custom). Returns per-source counts."""
    results = {}
    for b in BUILTINS:
        if progress:
            progress(f"fetching {b['name']}")
        try:
            results[b["name"]] = _BUILTIN_FNS[b["id"]]()
        except Exception as e:
            results[b["name"]] = f"error: {str(e)[:80]}"
    for cs in db.custom_sources(enabled_only=True):
        if progress:
            progress(f"fetching {cs['name']}")
        try:
            if cs["kind"] == "rss":
                results[cs["name"]] = fetch_rss(cs["ref"], name=cs["name"], prefix=f"cs{cs['id']}")
            elif cs["kind"] == "archive-channel":
                plat, user = cs["ref"].split(":", 1)
                results[cs["name"]] = fetch_archive_channel(plat, user)
        except Exception as e:
            results[cs["name"]] = f"error: {str(e)[:80]}"
    return results


_fetch = {"running": False, "phase": "", "results": {}}
_fetch_lock = threading.Lock()


def fetch_status():
    with _fetch_lock:
        return dict(_fetch)


def fetch_all_bg():
    """Kick off a full fetch across every source in the background. Returns False if busy."""
    with _fetch_lock:
        if _fetch["running"]:
            return False
        _fetch.update(running=True, phase="starting", results={})

    def go():
        try:
            res = fetch_all(progress=lambda p: _fetch.update(phase=p))
            with _fetch_lock:
                _fetch.update(results=res)
        finally:
            with _fetch_lock:
                _fetch.update(running=False, phase="done")

    threading.Thread(target=go, daemon=True).start()
    return True


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
