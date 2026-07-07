"""Background job runner — one job at a time. Profiles are keyed by
`key` = "<platform>:<username>"; downloads/transcripts/visual are namespaced
by "<platform>/<username>"."""
import threading
import time
import traceback
from datetime import datetime

from . import db, downloader, transcriber, visual

_lock = threading.Lock()
_job = None  # mutated only via _set/_log below


class Busy(Exception):
    pass


def status():
    with _lock:
        if not _job:
            return None
        snap = dict(_job)
        snap["log"] = list(_job["log"])[-8:]
        return snap


def request_cancel():
    with _lock:
        if _job and _job["state"] == "running":
            _job["cancel"] = True
            _job["log"].append("Stop requested — finishing the current item…")
            return True
        return False


def _cancelled():
    with _lock:
        return bool(_job and _job.get("cancel"))


def _new_job(kind, label):
    global _job
    with _lock:
        if _job and _job["state"] == "running":
            raise Busy("Another job is already running — wait for it to finish.")
        _job = {
            "kind": kind, "username": label, "state": "running",
            "phase": "starting", "message": "", "done": 0, "total": 0,
            "current": "", "errors": 0, "cancel": False, "log": [],
        }


def _set(**kw):
    with _lock:
        _job.update(kw)


def _log(msg):
    with _lock:
        _job["log"].append(msg)
        del _job["log"][:-200]


def _bump_errors():
    with _lock:
        _job["errors"] += 1


def _now():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def _subdir(v):
    return f"{v['platform']}/{v['username']}"


def _run_safe(fn, *args):
    try:
        fn(*args)
        _set(state="done", phase="done", current="")
    except Exception as e:
        traceback.print_exc()
        _log(f"FAILED: {e}")
        _set(state="error", phase="error", message=str(e))


# ---------- entry points ----------

def start_sync(key, limit=None, do_transcribe=True):
    p = db.profile(key)
    _new_job("sync", p["username"] if p else key)
    threading.Thread(
        target=_run_safe, args=(_run_sync, key, limit, do_transcribe), daemon=True
    ).start()


def start_sync_all(do_transcribe=True):
    if not db.profiles():
        raise ValueError("No profiles added yet.")
    _new_job("sync-all", "all profiles")
    threading.Thread(target=_run_safe, args=(_run_sync_all, do_transcribe), daemon=True).start()


def _run_sync_all(do_transcribe):
    profiles = db.profiles()
    for idx, p in enumerate(profiles):
        if _cancelled():
            _log("Stopped by user.")
            break
        _set(username=p["username"])
        _log(f"=== Syncing @{p['username']} ({p['platform']}, {idx + 1}/{len(profiles)}) ===")
        try:
            _run_sync(p["key"], None, do_transcribe)
        except transcriber.Cancelled:
            _log("Stopped by user.")
            break
        except Exception as e:  # one bad profile must not abort the rest
            _bump_errors()
            _log(f"@{p['username']} sync failed: {str(e)[:160]}")


def start_transcribe_one(vid):
    v = db.video(vid)
    if not v or not v.get("file_path"):
        raise ValueError("That video hasn't been downloaded yet.")
    _new_job("transcribe", v["username"])
    threading.Thread(target=_run_safe, args=(_transcribe_rows, [v], True), daemon=True).start()


def start_visual_one(vid):
    v = db.video(vid)
    if not v or not v.get("file_path"):
        raise ValueError("That video hasn't been downloaded yet.")
    if not visual.available():
        raise ValueError(visual.unavailable_reason())
    _new_job("visual", v["username"])
    threading.Thread(target=_run_safe, args=(_visual_rows, [v], True), daemon=True).start()


def start_retranscribe_all(key):
    rows = db.downloaded(key)
    if not rows:
        raise ValueError("No downloaded videos to transcribe yet.")
    p = db.profile(key)
    _new_job("transcribe", p["username"] if p else key)
    threading.Thread(target=_run_safe, args=(_transcribe_rows, rows, True), daemon=True).start()


def start_rescan_all(key):
    if not visual.available():
        raise ValueError(visual.unavailable_reason())
    rows = db.downloaded(key)
    if not rows:
        raise ValueError("No downloaded videos to scan yet.")
    p = db.profile(key)
    _new_job("visual", p["username"] if p else key)
    threading.Thread(target=_run_safe, args=(_visual_rows, rows, True), daemon=True).start()


# ---------- sync ----------

def _run_sync(key, limit, do_transcribe):
    p = db.profile(key)
    if not p:
        raise ValueError(f"Unknown profile {key}")
    platform, username, url = p["platform"], p["username"], p["url"]

    _set(phase="listing", username=username, current=f"Fetching video list for @{username}…")
    entries = []
    try:
        entries = downloader.list_profile(platform, url, limit=limit)
    except downloader.ProfileError as e:
        _bump_errors()
        _log(f"Listing failed — continuing with already-known videos: {e}")

    known = db.known_ids(key)
    fresh = [e for e in entries if e["id"] not in known]
    for e in fresh:
        db.add_pending_video(e["id"], key, platform, username, e["url"], e["title"])
    if entries:
        _log(f"Listed {len(entries)} videos — {len(fresh)} new, {len(entries) - len(fresh)} already known.")
    elif not known:
        _log(f"@{username} has no public videos yet (or needs a login).")

    _import_orphans(key, platform, username)

    queue = db.to_download(key)
    listed = {e["id"] for e in entries}
    queue.sort(key=lambda v: v["id"] not in listed)
    if limit:
        queue = queue[: int(limit)]
    _set(phase="downloading", total=len(queue), done=0)
    for i, v in enumerate(queue):
        if _cancelled():
            _log("Stopped by user.")
            break
        _set(current=f"Downloading {v['id']} ({i + 1}/{len(queue)})", done=i)
        try:
            meta = downloader.download_video(platform, username, v["id"], v["url"])
            db.update_video(v["id"], status="downloaded", error=None, downloaded_at=_now(), **meta)
            _log(f"Downloaded {v['id']} {meta.get('title', '')[:60]}")
        except Exception as e:
            msg = str(e)
            unsupported = "photo" in msg.lower() or "image post" in msg.lower() or "no video formats" in msg.lower()
            attempts = db.bump_attempts(v["id"])
            gave_up = attempts >= 5
            db.update_video(
                v["id"],
                status="unsupported" if (unsupported or gave_up) else "error",
                error=(f"gave up after {attempts} attempts: {msg[:400]}" if gave_up else msg[:500]),
            )
            _bump_errors()
            _log(f"{'Skipped (photo post)' if unsupported else 'ERROR'} {v['id']}: {msg[:160]}")
        else:
            _set(done=i + 1)

    if do_transcribe and not _cancelled():
        _transcribe_rows(db.to_transcribe(key), False)

    if db.get_setting("visual_scan") == "1" and visual.available() and not _cancelled():
        _visual_rows(db.to_visual(key), False)

    db.touch_profile(key)


def _import_orphans(key, platform, username):
    """Files on disk with no DB row (DB reset / profile re-added) re-enter the library."""
    outdir = downloader.DOWNLOADS_DIR / platform / username
    if not outdir.is_dir():
        return
    known = db.known_ids(key)
    found = 0
    for p in sorted(outdir.iterdir()):
        if p.suffix.lower() not in downloader.VIDEO_EXTS or p.stem in known:
            continue
        db.add_pending_video(p.stem, key, platform, username,
                             downloader.video_url(platform, username, p.stem), "")
        db.update_video(p.stem, status="downloaded", file_path=db.rel_path(p),
                        downloaded_at=_now(), **downloader._thumb(outdir, p.stem))
        found += 1
    if found:
        _log(f"Imported {found} already-downloaded videos found on disk.")


# ---------- transcription ----------

def _reuse_transcript(v):
    txt = transcriber.TRANSCRIPTS_DIR / _subdir(v) / f"{v['id']}.txt"
    if not txt.exists():
        return False
    srt = txt.with_suffix(".srt")
    db.update_video(v["id"], status="transcribed", error=None,
                    transcript=txt.read_text(encoding="utf-8").strip(),
                    transcript_path=db.rel_path(txt),
                    srt_path=db.rel_path(srt) if srt.exists() else None,
                    transcribed_at=_now())
    return True


def _transcribe_rows(rows, force):
    _set(phase="transcribing", total=len(rows), done=0,
         current="Loading Whisper model (first run downloads it)…" if rows else "")
    size = db.get_setting("whisper_model")
    language = db.get_setting("language")
    for i, v in enumerate(rows):
        if _cancelled():
            _log("Stopped by user.")
            break
        _set(current=f"Transcribing {v['id']} ({i + 1}/{len(rows)})", done=i)
        try:
            if not force and _reuse_transcript(v):
                _log(f"Reused existing transcript file for {v['id']}")
                _set(done=i + 1)
                continue
            text, txt_path, srt_path = transcriber.transcribe(
                db.abs_path(v["file_path"]), _subdir(v), v["id"],
                size=size, language=language, should_cancel=_cancelled,
            )
            status = "transcribed" if text.strip() else "no-speech"
            db.update_video(v["id"], status=status, error=None, transcript=text,
                            transcript_path=txt_path, srt_path=srt_path, transcribed_at=_now())
            _log(f"{'Transcribed' if text.strip() else 'No speech in'} {v['id']} ({len(text)} chars)")
            _set(done=i + 1)
        except transcriber.Cancelled:
            _log("Stopped by user (mid-transcription).")
            break
        except Exception as e:
            db.update_video(v["id"], error=f"transcribe: {e}"[:500])
            _bump_errors()
            _log(f"ERROR transcribing {v['id']}: {str(e)[:160]}")
    _set(current="")


# ---------- visual scan ----------

def _reuse_visual(v):
    path = visual.VISUAL_DIR / _subdir(v) / f"{v['id']}.txt"
    if not path.exists():
        return False
    db.update_video(v["id"], visual=path.read_text(encoding="utf-8").strip(),
                    visual_path=db.rel_path(path), scanned_at=_now())
    return True


def _visual_rows(rows, force):
    if not rows:
        return
    if not visual.available():
        _log(f"Visual Scan unavailable: {visual.unavailable_reason()}")
        return
    _set(phase="scanning", total=len(rows), done=0,
         current="Scanning frames for on-screen text + scene tags…")
    for i, v in enumerate(rows):
        if _cancelled():
            _log("Stopped by user.")
            break
        _set(current=f"Visual scan {v['id']} ({i + 1}/{len(rows)})", done=i)
        try:
            if not force and _reuse_visual(v):
                _log(f"Reused existing visual scan for {v['id']}")
                _set(done=i + 1)
                continue
            track, path = visual.analyse(db.abs_path(v["file_path"]), _subdir(v), v["id"])
            err = v.get("error") or ""
            db.update_video(v["id"], visual=track, visual_path=path, scanned_at=_now(),
                            error=None if err.startswith("visual") else (err or None))
            _log(f"Visual-scanned {v['id']} ({len(track)} chars)")
            _set(done=i + 1)
        except Exception as e:
            db.update_video(v["id"], error=f"visual: {e}"[:500],
                            visual=f"(visual scan failed: {e})"[:500], scanned_at=_now())
            _bump_errors()
            _log(f"ERROR visual-scanning {v['id']}: {str(e)[:160]}")
    _set(current="")


# ---------- auto-sync scheduler ----------

_attempts = {}  # key → epoch of last auto attempt


def start_auto_loop():
    threading.Thread(target=_auto_loop, daemon=True).start()


def _auto_loop():
    while True:
        time.sleep(60)
        try:
            hours = float(db.get_setting("auto_sync") or 0)
            if hours <= 0:
                continue
            with _lock:
                if _job and _job["state"] == "running":
                    continue
            for p in db.profiles():
                if not _due(p, hours):
                    continue
                try:
                    start_sync(p["key"], limit=None, do_transcribe=True)
                except Busy:
                    break
                _wait_until_idle()
        except Exception:
            traceback.print_exc()


def _due(p, hours):
    last = p.get("last_sync_at")
    if last:
        try:
            age = (datetime.now() - datetime.strptime(last, "%Y-%m-%d %H:%M:%S")).total_seconds()
            if age < hours * 3600:
                return False
        except ValueError:
            pass
    if time.time() - _attempts.get(p["key"], 0) < min(3600.0, hours * 3600):
        return False
    _attempts[p["key"]] = time.time()
    return True


def _wait_until_idle():
    while True:
        with _lock:
            if not _job or _job["state"] != "running":
                return
        time.sleep(5)
