"""yt-dlp integration: list a TikTok profile and download individual videos."""
import http.cookiejar
import json
import re
import urllib.request
from pathlib import Path

import yt_dlp

from . import db

DOWNLOADS_DIR = db.DATA_DIR / "downloads"
COOKIE_FILE = db.DATA_DIR / "cookies.txt"

VIDEO_EXTS = {".mp4", ".webm", ".mov", ".mkv", ".m4v"}
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp"}


class ProfileError(Exception):
    pass


def normalize_profile(raw):
    """Accept '@name', 'name', or a tiktok.com URL → (username, canonical url).

    Usernames are lowercased: TikTok URLs are case-insensitive, and mixed-case
    input would otherwise create a duplicate profile that can never sync.
    """
    raw = (raw or "").strip()
    if "tiktok.com" in raw:
        m = re.search(r"tiktok\.com/@([A-Za-z0-9_.\-]+)", raw)
        if not m:
            raise ProfileError("Could not find an @username in that TikTok URL.")
        username = m.group(1).lower()
    else:
        username = raw.lstrip("@").strip("/ ").lower()
        if not re.fullmatch(r"[a-z0-9_.\-]+", username or ""):
            raise ProfileError("That doesn't look like a TikTok @username or profile URL.")
    return username, f"https://www.tiktok.com/@{username}"


def _base_opts():
    opts = {
        "quiet": True,
        "no_warnings": True,
        "noprogress": True,
        "socket_timeout": 30,
        "retries": 3,
    }
    mode = db.get_setting("cookie_mode")
    if mode == "browser":
        opts["cookiesfrombrowser"] = (db.get_setting("cookie_browser") or "chrome",)
    elif mode == "file":
        if not COOKIE_FILE.exists():
            raise ProfileError(
                "TikTok access is set to 'Pasted cookies.txt' but no cookies have been "
                "saved — paste them in Settings, or switch back to Anonymous."
            )
        opts["cookiefile"] = str(COOKIE_FILE)
    return opts


def _cookie_jar(mode):
    if mode == "file":
        if not COOKIE_FILE.exists():
            raise ProfileError("no cookies.txt has been saved yet")
        jar = http.cookiejar.MozillaCookieJar(str(COOKIE_FILE))
        jar.load(ignore_discard=True, ignore_expires=True)
        return jar
    from yt_dlp.cookies import extract_cookies_from_browser
    return extract_cookies_from_browser(db.get_setting("cookie_browser") or "chrome")


def check_login():
    """Verify TikTok login for the current cookie settings. Returns {ok, detail}."""
    mode = db.get_setting("cookie_mode")
    if mode == "none":
        return {"ok": False, "detail":
                "TikTok access is set to Anonymous — no login is used. Downloads of public "
                "profiles still work until TikTok rate-limits you. To log in, pick "
                "'Use my browser login' or paste a cookies.txt, save, then re-check."}
    try:
        jar = _cookie_jar(mode)
    except Exception as e:
        return {"ok": False, "detail": f"Could not read cookies ({mode}): {e}"}
    if not any(c.name == "sessionid" and "tiktok.com" in (c.domain or "") for c in jar):
        src = ("that browser — log into tiktok.com there first"
               if mode == "browser" else
               "the pasted cookies.txt — re-export it while logged into tiktok.com")
        return {"ok": False, "detail": f"No TikTok session cookie found in {src}, then re-check."}
    # confirm the session is alive by asking TikTok who it belongs to
    try:
        opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
        req = urllib.request.Request(
            "https://www.tiktok.com/passport/web/account/info/",
            headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                                   "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"},
        )
        with opener.open(req, timeout=15) as resp:
            data = json.load(resp)
        info = data.get("data") or {}
        who = (info.get("username") or info.get("screen_name")
               or info.get("user_id_str") or info.get("user_id"))
        if who:
            return {"ok": True, "detail": f"Logged in ✓ — TikTok confirms this session (account: {who})."}
        return {"ok": False, "detail":
                "A session cookie exists but TikTok did not recognise it — the login is "
                "probably stale. Log into tiktok.com again, then re-check."}
    except Exception as e:
        return {"ok": True, "detail":
                f"Session cookie found ✓ — downloads will use it. "
                f"(Couldn't fully verify with TikTok: {str(e)[:120]})"}


def _friendly(msg):
    low = msg.lower()
    if "unable to extract" in low or "403" in low or "status code 10201" in low or "empty" in low:
        return (
            "TikTok blocked the request. Log into tiktok.com in your browser, set "
            "Settings → TikTok access to use your login cookies, and retry. "
            f"(Original error: {msg[:200]})"
        )
    return msg


def list_profile(url, limit=None):
    """Return [{id, url, title}] for a profile page, newest first.

    An empty list is a legitimate result (profile with no public videos yet) —
    blocked/failed requests raise ProfileError instead.
    """
    opts = _base_opts() | {"extract_flat": "in_playlist", "skip_download": True}
    if limit:
        opts["playlistend"] = int(limit)
    try:
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url, download=False)
    except yt_dlp.utils.DownloadError as e:
        raise ProfileError(_friendly(str(e)))
    entries = list((info or {}).get("entries") or [])
    out = []
    for e in entries:
        vid = e.get("id")
        if not vid:
            continue
        out.append({
            "id": str(vid),
            "url": e.get("url") or e.get("webpage_url") or f"{url}/video/{vid}",
            "title": (e.get("title") or "").strip(),
        })
    return out


def _meta_fields(info, fallback_url):
    # `title` is yt-dlp's short (often truncated) heading; `description` is the FULL
    # post caption with all the hashtags — keep both.
    caption = (info.get("description") or info.get("title") or "").strip()
    return {
        "title": (info.get("title") or info.get("description") or "").strip(),
        "caption": caption,
        "upload_date": info.get("upload_date"),
        "duration": info.get("duration"),
        "view_count": info.get("view_count"),
        "like_count": info.get("like_count"),
        "url": info.get("webpage_url") or fallback_url,
    }


def download_video(vid, url, username):
    """Download one video; returns metadata + file paths. Raises on failure."""
    outdir = DOWNLOADS_DIR / username
    outdir.mkdir(parents=True, exist_ok=True)

    existing = _find_media(outdir, vid)
    if existing:  # file already on disk (e.g. DB was reset) — reuse, never re-download
        meta = {"file_path": db.rel_path(existing), **_thumb(outdir, vid)}
        try:  # metadata is nice-to-have; the file is what matters
            with yt_dlp.YoutubeDL(_base_opts() | {"skip_download": True}) as ydl:
                info = ydl.extract_info(url, download=False) or {}
            meta.update(_meta_fields(info, url))
        except Exception:
            pass
        return meta

    opts = _base_opts() | {
        "outtmpl": str(outdir / "%(id)s.%(ext)s"),
        "format": "b",  # TikTok serves premuxed video+audio; no ffmpeg merge needed
        "format_sort": ["vcodec:h264", "res", "br"],
        "writethumbnail": True,
    }
    try:
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url, download=True)
    except yt_dlp.utils.DownloadError as e:
        raise RuntimeError(_friendly(str(e)))

    filepath = None
    rd = (info or {}).get("requested_downloads") or []
    if rd and rd[0].get("filepath"):
        filepath = Path(rd[0]["filepath"])
    if filepath is None or not filepath.exists():
        filepath = _find_media(outdir, vid)
    if filepath is None:
        raise RuntimeError(
            "yt-dlp reported success but wrote no media file "
            "(this is usually a photo/slideshow post)."
        )

    return {
        "file_path": db.rel_path(filepath),
        **_meta_fields(info or {}, url),
        **_thumb(outdir, vid),
    }


def _find_media(outdir, vid):
    for p in outdir.glob(f"{vid}.*"):
        if p.suffix.lower() in VIDEO_EXTS:
            return p
    return None


def _thumb(outdir, vid):
    for p in outdir.glob(f"{vid}.*"):
        suffix = p.suffix.lower()
        if suffix in IMAGE_EXTS:
            return {"thumb_path": db.rel_path(p)}
        if suffix == ".image":  # TikTok thumbnail URLs hide the type — sniff and rename
            renamed = p.with_suffix(_sniff_image_ext(p))
            p.rename(renamed)
            return {"thumb_path": db.rel_path(renamed)}
    return {}


def _sniff_image_ext(path):
    with path.open("rb") as f:
        head = f.read(12)
    if head.startswith(b"\x89PNG"):
        return ".png"
    if head[:4] == b"RIFF" and head[8:12] == b"WEBP":
        return ".webp"
    return ".jpg"
