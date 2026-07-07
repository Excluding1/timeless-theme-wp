"""Autonomous batch runner — the full start-to-finish pipeline over MANY ideas.

Queues N ideas and processes each through the complete pipeline (polish → score +
Effort ROI → persona panel → judged plan tournament → final plan) one at a time,
unattended. Survives per-idea failures; can be stopped mid-run.
"""
import threading
import time
import traceback

from . import analyst, db, planner

_state = {"running": False, "queue": [], "current": None, "current_title": "",
          "done": 0, "failed": 0, "total": 0, "panel": 10, "stop": False}
_lock = threading.Lock()


def status():
    with _lock:
        return {k: _state[k] for k in
                ("running", "current", "current_title", "done", "failed", "total")} | \
               {"queued": len(_state["queue"])}


def start_batch(idea_ids, panel_size=10):
    with _lock:
        if _state["running"]:
            return False
        _state.update(running=True, queue=list(idea_ids), current=None, current_title="",
                      done=0, failed=0, total=len(idea_ids), panel=panel_size, stop=False)
    threading.Thread(target=_run, daemon=True).start()
    return True


def stop_batch():
    with _lock:
        _state["stop"] = True
        _state["queue"].clear()


def _wait_idle():
    while True:
        j = analyst.job_status()
        if not j or j["state"] != "running":
            return
        time.sleep(4)


def _run():
    try:
        while True:
            with _lock:
                if _state["stop"] or not _state["queue"]:
                    break
                idea_id = _state["queue"].pop(0)
            row = db.idea(idea_id)
            with _lock:
                _state["current"] = idea_id
                _state["current_title"] = (row["title"][:70] if row else idea_id)
            _wait_idle()                      # let any manual job finish first
            with _lock:
                panel = _state["panel"]
            try:
                planner.start_pipeline(idea_id, panel)
            except Exception:
                traceback.print_exc()
                with _lock:
                    _state["failed"] += 1
                continue
            _wait_idle()                      # block until THIS pipeline completes
            with _lock:
                _state["done"] += 1
    finally:
        with _lock:
            _state.update(running=False, current=None, current_title="")
