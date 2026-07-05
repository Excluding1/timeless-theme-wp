"""yt-dlp integration: list a TikTok profile and download individual videos."""
import re
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
    return {
        "title": (info.get("title") or info.get("description") or "").strip(),
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
