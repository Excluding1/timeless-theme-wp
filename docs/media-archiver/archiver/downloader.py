"""yt-dlp integration for TikTok, YouTube and Instagram.

A profile is identified by a `key` = "<platform>:<username>". Downloads are
namespaced by platform so ids never collide across sites:
    data/downloads/<platform>/<username>/<id>.<ext>
"""
import http.cookiejar
import re
from pathlib import Path

import yt_dlp

from . import db

DOWNLOADS_DIR = db.DATA_DIR / "downloads"
COOKIE_FILE = db.DATA_DIR / "cookies.txt"

PLATFORMS = ("tiktok", "youtube", "instagram")
PLATFORM_LABELS = {"tiktok": "TikTok", "youtube": "YouTube", "instagram": "Instagram"}

VIDEO_EXTS = {".mp4", ".webm", ".mov", ".mkv", ".m4v"}
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp"}


class ProfileError(Exception):
    pass


def make_key(platform, username):
    return f"{platform}:{username}"


def split_key(key):
    platform, _, username = (key or "").partition(":")
    return platform, username


def video_url(platform, username, vid):
    if platform == "youtube":
        return f"https://www.youtube.com/watch?v={vid}"
    if platform == "instagram":
        return f"https://www.instagram.com/reel/{vid}/"
    return f"https://www.tiktok.com/@{username}/video/{vid}"


def _detect_platform(raw):
    low = raw.lower()
    if "tiktok.com" in low:
        return "tiktok"
    if "youtube.com" in low or "youtu.be" in low:
        return "youtube"
    if "instagram.com" in low:
        return "instagram"
    return None


def normalize_profile(raw, platform=None):
    """Accept a URL or a handle → (platform, username, canonical_list_url, key)."""
    raw = (raw or "").strip()
    platform = _detect_platform(raw) or platform
    if not platform:
        raise ProfileError("Pick a platform, or paste a full profile URL.")
    if platform not in PLATFORMS:
        raise ProfileError(f"Unsupported platform: {platform}")

    if platform == "tiktok":
        m = re.search(r"tiktok\.com/@([A-Za-z0-9_.\-]+)", raw)
        username = (m.group(1) if m else raw.lstrip("@").strip("/ ")).lower()
        if not re.fullmatch(r"[a-z0-9_.\-]+", username or ""):
            raise ProfileError("That doesn't look like a TikTok @username or URL.")
        url = f"https://www.tiktok.com/@{username}"

    elif platform == "youtube":
        username, url = _youtube_target(raw)

    else:  # instagram
        m = re.search(r"instagram\.com/([A-Za-z0-9_.]+)", raw)
        username = (m.group(1) if m else raw.lstrip("@").strip("/ ")).lower()
        if not re.fullmatch(r"[a-z0-9_.]+", username or "") or username in {"p", "reel", "reels"}:
            raise ProfileError("That doesn't look like an Instagram @username or URL.")
        url = f"https://www.instagram.com/{username}/"

    return platform, username, url, make_key(platform, username)


def _youtube_target(raw):
    """Return (display_username, uploads_url) for the various YouTube URL shapes."""
    m = re.search(r"youtube\.com/@([A-Za-z0-9_.\-]+)", raw)
    if m:
        u = m.group(1)
        return u, f"https://www.youtube.com/@{u}/videos"
    m = re.search(r"youtube\.com/channel/([A-Za-z0-9_\-]+)", raw)
    if m:
        return m.group(1), f"https://www.youtube.com/channel/{m.group(1)}/videos"
    m = re.search(r"youtube\.com/(?:c|user)/([A-Za-z0-9_.\-]+)", raw)
    if m:
        return m.group(1), f"https://www.youtube.com/{m.group(1)}/videos"
    u = raw.lstrip("@").strip("/ ")  # bare handle typed with YouTube selected
    if not re.fullmatch(r"[A-Za-z0-9_.\-]+", u or ""):
        raise ProfileError("That doesn't look like a YouTube @handle, channel URL, or /videos URL.")
    return u, f"https://www.youtube.com/@{u}/videos"


# ---------- cookies / login ----------

def _cookie_jar(mode):
    if mode == "file":
        if not COOKIE_FILE.exists():
            raise ProfileError("no cookies.txt has been saved yet")
        jar = http.cookiejar.MozillaCookieJar(str(COOKIE_FILE))
        jar.load(ignore_discard=True, ignore_expires=True)
        return jar
    from yt_dlp.cookies import extract_cookies_from_browser
    return extract_cookies_from_browser(db.get_setting("cookie_browser") or "chrome")


def check_login(platform="instagram"):
    """Verify a login cookie exists for the given platform (Instagram needs it)."""
    host = {"instagram": "instagram.com", "youtube": "youtube.com", "tiktok": "tiktok.com"}.get(platform, "")
    session_names = {"instagram": ("sessionid",), "youtube": ("SID", "SAPISID", "__Secure-1PSID"),
                     "tiktok": ("sessionid",)}.get(platform, ())
    mode = db.get_setting("cookie_mode")
    if mode == "none":
        return {"ok": False, "detail":
                "No login is set. Public YouTube/TikTok work without it, but Instagram needs a login — "
                "pick 'Use my browser login' or paste a cookies.txt, save, then re-check."}
    try:
        jar = _cookie_jar(mode)
    except Exception as e:
        return {"ok": False, "detail": f"Could not read cookies ({mode}): {e}"}
    if any(c.name in session_names and host in (c.domain or "") for c in jar):
        return {"ok": True, "detail": f"Logged in ✓ — a {PLATFORM_LABELS.get(platform, platform)} session cookie is present."}
    src = ("that browser" if mode == "browser" else "the pasted cookies.txt")
    return {"ok": False, "detail":
            f"No {PLATFORM_LABELS.get(platform, platform)} session cookie in {src}. "
            f"Log into {host} there first, then re-check."}


def _base_opts():
    opts = {
        "quiet": True, "no_warnings": True, "noprogress": True,
        "socket_timeout": 30, "retries": 3,
    }
    mode = db.get_setting("cookie_mode")
    if mode == "browser":
        opts["cookiesfrombrowser"] = (db.get_setting("cookie_browser") or "chrome",)
    elif mode == "file":
        if not COOKIE_FILE.exists():
            raise ProfileError(
                "Access is set to 'Pasted cookies.txt' but none are saved — "
                "paste them in Settings, or switch to Anonymous."
            )
        opts["cookiefile"] = str(COOKIE_FILE)
    return opts


def _friendly(msg, platform):
    low = msg.lower()
    if platform == "instagram" and ("unable to extract" in low or "login" in low or "rate" in low
                                    or "empty" in low or "403" in low):
        return ("Instagram blocked the request — it needs your login. In Settings set access to "
                "'Use my browser login' (or paste a cookies.txt from instagram.com), then retry. "
                f"(Original: {msg[:160]})")
    if "unable to extract" in low or "403" in low or "status code 10201" in low or "empty" in low:
        return (f"{PLATFORM_LABELS.get(platform, 'The site')} blocked the request. Try enabling login "
                f"cookies in Settings, or update yt-dlp. (Original: {msg[:160]})")
    return msg


# ---------- listing / downloading ----------

def list_profile(platform, url, limit=None):
    """Return [{id, url, title}] for a profile/channel, newest first. [] is valid."""
    entries = _list_one(platform, url, limit)
    # YouTube keeps Shorts on a separate tab — "all videos" should include them
    if platform == "youtube" and url.endswith("/videos"):
        try:
            shorts = _list_one(platform, url[: -len("/videos")] + "/shorts", limit)
        except ProfileError:
            shorts = []  # channel has no Shorts tab
        seen = {e["id"] for e in entries}
        entries += [s for s in shorts if s["id"] not in seen]
    return entries


def _list_one(platform, url, limit=None):
    opts = _base_opts() | {"extract_flat": "in_playlist", "skip_download": True}
    if limit:
        opts["playlistend"] = int(limit)
    try:
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url, download=False)
    except yt_dlp.utils.DownloadError as e:
        raise ProfileError(_friendly(str(e), platform))
    entries = list((info or {}).get("entries") or [])
    # YouTube channel pages can nest tabs → flatten one level of sub-playlists
    if entries and any(e.get("entries") is not None for e in entries):
        flat = []
        for e in entries:
            flat.extend(e.get("entries") or [e])
        entries = flat
    out = []
    for e in entries:
        vid = e.get("id")
        if not vid or e.get("_type") == "playlist":
            continue
        out.append({
            "id": str(vid),
            "url": e.get("url") or e.get("webpage_url") or vid,
            "title": (e.get("title") or "").strip(),
        })
    return out


def _fmt_for(platform):
    # single-file (no ffmpeg merge). Cap YouTube to <=720p so long videos stay reasonable.
    if platform == "youtube":
        return "b[height<=720]/b"
    return "b"


def _meta_fields(info, fallback_url):
    # `title` is yt-dlp's short (often truncated) heading; `description` is the FULL
    # post caption/description with all the hashtags — keep both.
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


def download_video(platform, username, vid, url):
    """Download one video → metadata + file paths. Raises on failure."""
    outdir = DOWNLOADS_DIR / platform / username
    outdir.mkdir(parents=True, exist_ok=True)

    existing = _find_media(outdir, vid)
    if existing:  # already on disk (e.g. DB reset) — reuse, never re-download
        meta = {"file_path": db.rel_path(existing), **_thumb(outdir, vid)}
        try:
            with yt_dlp.YoutubeDL(_base_opts() | {"skip_download": True}) as ydl:
                info = ydl.extract_info(url, download=False) or {}
            meta.update(_meta_fields(info, url))
        except Exception:
            pass
        return meta

    opts = _base_opts() | {
        "outtmpl": str(outdir / "%(id)s.%(ext)s"),
        "format": _fmt_for(platform),
        "format_sort": ["vcodec:h264", "res", "br"],
        "writethumbnail": True,
    }
    try:
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url, download=True)
    except yt_dlp.utils.DownloadError as e:
        raise RuntimeError(_friendly(str(e), platform))

    filepath = None
    rd = (info or {}).get("requested_downloads") or []
    if rd and rd[0].get("filepath"):
        filepath = Path(rd[0]["filepath"])
    if filepath is None or not filepath.exists():
        filepath = _find_media(outdir, vid)
    if filepath is None:
        raise RuntimeError("yt-dlp reported success but wrote no video file (usually a photo/image post).")

    return {"file_path": db.rel_path(filepath), **_meta_fields(info or {}, url), **_thumb(outdir, vid)}


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
        if suffix == ".image":  # TikTok hides the type — sniff and rename
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
