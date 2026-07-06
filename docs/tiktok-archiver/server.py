"""TikTok Profile Archiver — local web app.

Run:  .venv/bin/python server.py   →   http://127.0.0.1:8317
"""
from pathlib import Path

import uvicorn
from fastapi import Body, FastAPI, HTTPException
from fastapi.responses import FileResponse, HTMLResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles

from archiver import db, downloader, jobs, transcriber, visual

BASE = Path(__file__).resolve().parent

app = FastAPI(title="TikTok Profile Archiver")


@app.middleware("http")
async def no_cache(request, call_next):
    """Localhost app — stale cached JS/HTML after an update is worse than no cache."""
    response = await call_next(request)
    if not request.url.path.startswith("/media"):
        response.headers["Cache-Control"] = "no-store"
    return response


downloader.DOWNLOADS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=BASE / "static"), name="static")
app.mount("/media", StaticFiles(directory=downloader.DOWNLOADS_DIR), name="media")

jobs.start_auto_loop()


def _publicize(v):
    """Map stored file paths to /media URLs; drop paths from the payload."""
    out = dict(v)
    for key, target in (("file_path", "media_url"), ("thumb_path", "thumb_url")):
        p = db.abs_path(out.pop(key, None))
        out[target] = None
        if p:
            try:
                out[target] = "/media/" + str(Path(p).relative_to(downloader.DOWNLOADS_DIR))
            except ValueError:
                pass
    out.pop("transcript_path", None)
    out.pop("srt_path", None)
    out.pop("visual_path", None)
    return out


@app.get("/")
def index():
    # stamp asset links with file mtimes so a changed app.css/app.js always busts
    # the browser cache (belt-and-braces alongside the no-store header)
    static = BASE / "static"
    html = (static / "index.html").read_text(encoding="utf-8")
    ver = str(int(max((static / "app.css").stat().st_mtime, (static / "app.js").stat().st_mtime)))
    return HTMLResponse(html.replace("__V__", ver))


@app.get("/api/state")
def state():
    return {
        "profiles": db.profiles(),
        "settings": db.all_settings(),
        "cookie_file_present": downloader.COOKIE_FILE.exists(),
        "whisper_models": list(transcriber.MODEL_CHOICES),
        "visual_available": visual.available(),
        "visual_reason": "" if visual.available() else visual.unavailable_reason(),
        "job": jobs.status(),
    }


@app.post("/api/profiles")
def add_profile(body: dict = Body(...)):
    try:
        username, url = downloader.normalize_profile(body.get("profile", ""))
    except downloader.ProfileError as e:
        raise HTTPException(400, str(e))
    db.add_profile(username, url)
    return {"ok": True, "username": username}


@app.delete("/api/profiles/{username}")
def delete_profile(username: str):
    j = jobs.status()
    if j and j["state"] == "running" and j["username"] == username:
        raise HTTPException(409, "A job is running for this profile — stop it first.")
    db.remove_profile(username)  # DB rows only — downloaded files stay on disk
    return {"ok": True}


@app.post("/api/sync")
def sync(body: dict = Body(...)):
    username = body.get("username")
    if not db.profile_url(username):
        raise HTTPException(404, "Unknown profile")
    limit = body.get("limit") or None
    if limit is not None:
        try:
            limit = max(1, int(limit))
        except (TypeError, ValueError):
            limit = None
    try:
        jobs.start_sync(username, limit=limit, do_transcribe=bool(body.get("transcribe", True)))
    except jobs.Busy as e:
        raise HTTPException(409, str(e))
    return {"ok": True}


@app.post("/api/sync-all")
def sync_all(body: dict = Body(default={})):
    try:
        jobs.start_sync_all(do_transcribe=bool(body.get("transcribe", True)))
    except jobs.Busy as e:
        raise HTTPException(409, str(e))
    except ValueError as e:
        raise HTTPException(400, str(e))
    return {"ok": True}


@app.post("/api/job/cancel")
def cancel_job():
    if not jobs.request_cancel():
        raise HTTPException(400, "No job is running.")
    return {"ok": True}


@app.post("/api/transcribe/{vid}")
def transcribe_one(vid: str):
    try:
        jobs.start_transcribe_one(vid)
    except jobs.Busy as e:
        raise HTTPException(409, str(e))
    except ValueError as e:
        raise HTTPException(400, str(e))
    return {"ok": True}


@app.post("/api/visual/{vid}")
def visual_one(vid: str):
    try:
        jobs.start_visual_one(vid)
    except jobs.Busy as e:
        raise HTTPException(409, str(e))
    except ValueError as e:
        raise HTTPException(400, str(e))
    return {"ok": True}


@app.post("/api/retranscribe/{username}")
def retranscribe_all(username: str):
    if not db.profile_url(username):
        raise HTTPException(404, "Unknown profile")
    try:
        jobs.start_retranscribe_all(username)
    except jobs.Busy as e:
        raise HTTPException(409, str(e))
    except ValueError as e:
        raise HTTPException(400, str(e))
    return {"ok": True}


@app.post("/api/rescan/{username}")
def rescan_all(username: str):
    if not db.profile_url(username):
        raise HTTPException(404, "Unknown profile")
    try:
        jobs.start_rescan_all(username)
    except jobs.Busy as e:
        raise HTTPException(409, str(e))
    except ValueError as e:
        raise HTTPException(400, str(e))
    return {"ok": True}


@app.get("/api/videos")
def videos(username: str = None, q: str = None):
    return {"videos": [_publicize(v) for v in db.videos(username or None, q or None)]}


@app.get("/api/videos/{vid}")
def video_detail(vid: str):
    v = db.video(vid)
    if not v:
        raise HTTPException(404, "Unknown video")
    return _publicize(v)


@app.get("/api/videos/{vid}/download/{kind}")
def transcript_file(vid: str, kind: str):
    v = db.video(vid)
    if not v:
        raise HTTPException(404, "Unknown video")
    path = db.abs_path({"txt": v.get("transcript_path"), "srt": v.get("srt_path")}.get(kind))
    if not path or not Path(path).exists():
        raise HTTPException(404, "No transcript file for this video yet")
    return FileResponse(path, filename=f"{v['username']}-{vid}.{kind}")


def _fmt_date(d):
    return f"{d[:4]}-{d[4:6]}-{d[6:]}" if d and len(d) == 8 else (d or "")


def _fmt_dur(s):
    if not s and s != 0:
        return ""
    s = int(s)
    return f"{s // 60}:{s % 60:02d}"


def _fmt_views(n):
    if n is None:
        return ""
    if n >= 1_000_000:
        return f"{n / 1e6:.1f}M views"
    if n >= 1000:
        return f"{n / 1e3:.1f}K views"
    return f"{n} views"


def _export_text(rows):
    blocks = []
    for r in rows:
        date = r.get("upload_date") or "no date"
        title = " ".join((r.get("title") or "").split())[:120] or "(no title)"
        body = ""
        if r.get("caption"):
            body += f"[caption]\n{r['caption']}\n\n"
        if r.get("transcript"):
            body += f"[transcript]\n{r['transcript']}\n"
        if r.get("visual"):
            body += f"\n[on-screen / visual]\n{r['visual']}\n"
        if not body.strip() and r.get("status") == "no-speech":
            body += "(no speech detected — music/text-only clip)\n"
        blocks.append(
            f"===== @{r['username']} — {date} — {title} (id {r['id']}) =====\n"
            f"{r.get('url') or ''}\n\n{body}"
        )
    return "\n".join(blocks) or "No transcripts yet.\n"


def _export_markdown(rows, scope_label):
    from datetime import datetime
    out = [f"# TikTok transcripts — {scope_label}", ""]
    out.append(f"*{len(rows)} video(s) · exported {datetime.now():%Y-%m-%d %H:%M}*")
    for r in rows:
        title = " ".join((r.get("title") or "").split()) or "(no title)"
        meta = [f"**@{r['username']}**"]
        for part in (_fmt_date(r.get("upload_date")), _fmt_dur(r.get("duration")),
                     _fmt_views(r.get("view_count"))):
            if part:
                meta.append(part)
        out += ["", "---", "", f"## {title}", "", " · ".join(meta)]
        if r.get("url"):
            out.append(f"[Watch on TikTok]({r['url']})")
        if r.get("caption"):
            out += ["", "**Caption**", "", r["caption"]]
        if r.get("transcript"):
            out += ["", "**Transcript**", "", r["transcript"]]
        elif r.get("status") == "no-speech":
            out += ["", "*No speech detected (music/text-only clip).*"]
        if r.get("visual"):
            out += ["", "**On-screen / scene**", "", "```", r["visual"], "```"]
    return "\n".join(out) + "\n"


@app.get("/api/export")
def export(username: str = None, q: str = None, format: str = "txt", ids: str = None):
    id_list = [i for i in (ids or "").split(",") if i] or None
    rows = db.transcripts(username or None, q or None, ids=id_list)
    scope = "selected" if id_list else (username or "all")
    if format == "md":
        label = (f"{len(id_list)} selected" if id_list
                 else (f"@{username}" if username else "all profiles"))
        return PlainTextResponse(
            _export_markdown(rows, label), media_type="text/markdown",
            headers={"Content-Disposition": f'attachment; filename="transcripts-{scope}.md"'},
        )
    return PlainTextResponse(
        _export_text(rows),
        headers={"Content-Disposition": f'attachment; filename="transcripts-{scope}.txt"'},
    )


@app.post("/api/settings")
def set_settings(body: dict = Body(...)):
    db.set_settings(body)
    return {"ok": True, "settings": db.all_settings()}


@app.get("/api/login-check")
def login_check():
    return downloader.check_login()


@app.post("/api/cookies")
def set_cookies(body: dict = Body(...)):
    content = (body.get("content") or "").strip()
    if not content:
        raise HTTPException(400, "Paste the contents of a cookies.txt export first.")
    downloader.COOKIE_FILE.write_text(content + "\n", encoding="utf-8")
    db.set_settings({"cookie_mode": "file"})
    return {"ok": True}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8317)
