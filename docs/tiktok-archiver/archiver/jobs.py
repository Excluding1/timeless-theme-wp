"""Background job runner — one job at a time (a profile sync or a single transcribe)."""
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


def _new_job(kind, username):
    global _job
    with _lock:
        if _job and _job["state"] == "running":
            raise Busy("Another job is already running — wait for it to finish.")
        _job = {
            "kind": kind, "username": username, "state": "running",
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


def _run_safe(fn, *args):
    try:
        fn(*args)
        _set(state="done", phase="done", current="")
    except Exception as e:
        traceback.print_exc()
        _log(f"FAILED: {e}")
        _set(state="error", phase="error", message=str(e))


def start_sync(username, limit=None, do_transcribe=True):
    _new_job("sync", username)
    threading.Thread(
        target=_run_safe, args=(_run_sync, username, limit, do_transcribe), daemon=True
    ).start()


def start_transcribe_one(vid):
    v = db.video(vid)
    if not v or not v.get("file_path"):
        raise ValueError("That video hasn't been downloaded yet.")
    _new_job("transcribe", v["username"])
    # explicit per-video request → force re-transcription even if a transcript exists
    threading.Thread(target=_run_safe, args=(_transcribe_rows, [v], True), daemon=True).start()


def start_visual_one(vid):
    v = db.video(vid)
    if not v or not v.get("file_path"):
        raise ValueError("That video hasn't been downloaded yet.")
    if not visual.available():
        raise ValueError(visual.unavailable_reason())
    _new_job("visual", v["username"])
    threading.Thread(target=_run_safe, args=(_visual_rows, [v], True), daemon=True).start()


def start_retranscribe_all(username):
    rows = db.downloaded(username)
    if not rows:
        raise ValueError("No downloaded videos to transcribe yet.")
    _new_job("transcribe", username)
    threading.Thread(target=_run_safe, args=(_transcribe_rows, rows, True), daemon=True).start()


def start_rescan_all(username):
    if not visual.available():
        raise ValueError(visual.unavailable_reason())
    rows = db.downloaded(username)
    if not rows:
        raise ValueError("No downloaded videos to scan yet.")
    _new_job("visual", username)
    threading.Thread(target=_run_safe, args=(_visual_rows, rows, True), daemon=True).start()


def _run_sync(username, limit, do_transcribe):
    url = db.profile_url(username)
    if not url:
        raise ValueError(f"Unknown profile @{username}")

    _set(phase="listing", current=f"Fetching video list for @{username}…")
    entries = []
    try:
        entries = downloader.list_profile(url, limit=limit)
    except downloader.ProfileError as e:
        # keep going: retries + transcription are local work and shouldn't be
        # gated on TikTok being reachable
        _bump_errors()
        _log(f"Listing failed — continuing with already-known videos: {e}")

    known = db.known_ids(username)
    fresh = [e for e in entries if e["id"] not in known]
    for e in fresh:
        db.add_pending_video(e["id"], username, e["url"], e["title"])
    if entries:
        _log(f"Listed {len(entries)} videos — {len(fresh)} new, {len(entries) - len(fresh)} already known.")
    elif not known:
        _log(f"@{username} has no public videos yet.")

    _import_orphans(username)

    queue = db.to_download(username)
    listed = {e["id"] for e in entries}
    # a limited sync must cover this sync's listed (newest) videos before
    # spending slots on retries of older failures
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
            meta = downloader.download_video(v["id"], v["url"], username)
            db.update_video(v["id"], status="downloaded", error=None,
                            downloaded_at=_now(), **meta)
            _log(f"Downloaded {v['id']} {meta.get('title', '')[:60]}")
        except Exception as e:
            msg = str(e)
            unsupported = "photo" in msg.lower() or "no video formats" in msg.lower()
            attempts = db.bump_attempts(v["id"])
            gave_up = attempts >= 5  # deleted/private videos: stop retrying forever
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
        _transcribe_rows(db.to_transcribe(username), False)

    if db.get_setting("visual_scan") == "1" and visual.available() and not _cancelled():
        _visual_rows(db.to_visual(username), False)

    db.touch_profile(username)


def _import_orphans(username):
    """Files on disk with no DB row (DB reset / profile re-added) re-enter the library."""
    outdir = downloader.DOWNLOADS_DIR / username
    if not outdir.is_dir():
        return
    known = db.known_ids(username)
    found = 0
    for p in sorted(outdir.iterdir()):
        if p.suffix.lower() not in downloader.VIDEO_EXTS or p.stem in known:
            continue
        db.add_pending_video(p.stem, username,
                             f"https://www.tiktok.com/@{username}/video/{p.stem}", "")
        db.update_video(p.stem, status="downloaded", file_path=db.rel_path(p),
                        downloaded_at=_now(), **downloader._thumb(outdir, p.stem))
        found += 1
    if found:
        _log(f"Imported {found} already-downloaded videos found on disk.")


def _reuse_transcript(v):
    """A transcript file on disk (e.g. after a DB reset) is reused, not re-generated."""
    txt = transcriber.TRANSCRIPTS_DIR / v["username"] / f"{v['id']}.txt"
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
    # snapshot settings once so a mid-batch settings change can't mix models
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
                db.abs_path(v["file_path"]), v["username"], v["id"],
                size=size, language=language, should_cancel=_cancelled,
            )
            # a video with no spoken words (music/text-only hook) transcribes to ''
            # — mark it 'no-speech' so it reads honestly, not as an empty "transcribed"
            status = "transcribed" if text.strip() else "no-speech"
            db.update_video(v["id"], status=status, error=None, transcript=text,
                            transcript_path=txt_path, srt_path=srt_path, transcribed_at=_now())
            _log(f"{'Transcribed' if text.strip() else 'No speech in'} {v['id']} ({len(text)} chars)")
            _set(done=i + 1)
        except transcriber.Cancelled:
            _log("Stopped by user (mid-transcription).")
            break  # leave this video un-transcribed → redone on next sync
        except Exception as e:
            db.update_video(v["id"], error=f"transcribe: {e}"[:500])
            _bump_errors()
            _log(f"ERROR transcribing {v['id']}: {str(e)[:160]}")
    _set(current="")


def _reuse_visual(v):
    """A visual-scan file on disk (e.g. after a DB reset) is reused, not regenerated."""
    path = visual.VISUAL_DIR / v["username"] / f"{v['id']}.txt"
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
            track, path = visual.analyse(db.abs_path(v["file_path"]), v["username"], v["id"])
            # clear only a stale *visual* error — keep a transcribe error from this sync
            err = v.get("error") or ""
            db.update_video(v["id"], visual=track, visual_path=path, scanned_at=_now(),
                            error=None if err.startswith("visual") else (err or None))
            _log(f"Visual-scanned {v['id']} ({len(track)} chars)")
            _set(done=i + 1)
        except Exception as e:
            # visual scan is local & deterministic — a failure will recur, so mark it
            # scanned-with-error instead of retrying it on every sync forever
            db.update_video(v["id"], error=f"visual: {e}"[:500],
                            visual=f"(visual scan failed: {e})"[:500], scanned_at=_now())
            _bump_errors()
            _log(f"ERROR visual-scanning {v['id']}: {str(e)[:160]}")
    _set(current="")


# ---------- auto-sync scheduler ----------

_attempts = {}  # username → epoch of last auto attempt (backoff for failing syncs)


def start_auto_loop():
    """Daemon loop: when auto_sync (hours) is set, periodically sync every profile."""
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
                    start_sync(p["username"], limit=None, do_transcribe=True)
                except Busy:  # a manual job snuck in — try again next tick
                    break
                _wait_until_idle()
        except Exception:  # never let the scheduler thread die
            traceback.print_exc()


def _due(p, hours):
    """Due = persisted last_sync_at older than the interval (survives restarts)."""
    last = p.get("last_sync_at")
    if last:
        try:
            age = (datetime.now() - datetime.strptime(last, "%Y-%m-%d %H:%M:%S")).total_seconds()
            if age < hours * 3600:
                return False
        except ValueError:
            pass
    # a profile whose sync keeps failing before completion retries at most hourly
    if time.time() - _attempts.get(p["username"], 0) < min(3600.0, hours * 3600):
        return False
    _attempts[p["username"]] = time.time()
    return True


def _wait_until_idle():
    while True:
        with _lock:
            if not _job or _job["state"] != "running":
                return
        time.sleep(5)
