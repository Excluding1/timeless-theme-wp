"""Autonomous batch runner — analyze or fully plan MANY ideas, unattended.

Queues a set of ideas and processes each one at a time in the background,
surviving per-idea failures and stoppable mid-run. Two modes:
  - "analyze"  : polish → scorecard + Effort ROI → persona panel
  - "pipeline" : the above PLUS the judged plan tournament → final plan
Counts a run as failed if the underlying job ends in an error state.
"""
import threading
import time
import traceback

from . import analyst, db, planner

_state = {"running": False, "queue": [], "current": None, "current_title": "",
          "done": 0, "failed": 0, "total": 0, "panel": 10, "mode": "pipeline", "stop": False}
_lock = threading.Lock()


def status():
    with _lock:
        return {k: _state[k] for k in
                ("running", "current", "current_title", "done", "failed", "total", "mode")} | \
               {"queued": len(_state["queue"])}


def start_batch(idea_ids, panel_size=10, mode="pipeline"):
    with _lock:
        if _state["running"]:
            return False
        _state.update(running=True, queue=list(idea_ids), current=None, current_title="",
                      done=0, failed=0, total=len(idea_ids), panel=panel_size,
                      mode=("analyze" if mode == "analyze" else "pipeline"), stop=False)
    threading.Thread(target=_run, daemon=True).start()
    return True


def stop_batch():
    with _lock:
        _state["stop"] = True
        _state["queue"].clear()


def _wait_idle():
    """Block until no analyst/planner job is running; return its final state."""
    last = None
    while True:
        j = analyst.job_status()
        if not j or j["state"] != "running":
            return j["state"] if j else (last or "done")
        last = j["state"]
        time.sleep(4)


def _run():
    try:
        while True:
            with _lock:
                if _state["stop"] or not _state["queue"]:
                    break
                idea_id = _state["queue"].pop(0)
                panel, mode = _state["panel"], _state["mode"]
            row = db.idea(idea_id)
            with _lock:
                _state["current"] = idea_id
                _state["current_title"] = (row["title"][:70] if row else idea_id)
            _wait_idle()                      # let any manual job finish first
            try:
                if mode == "analyze":
                    analyst.start_analysis(idea_id, panel)
                else:
                    planner.start_pipeline(idea_id, panel)
            except Exception:
                traceback.print_exc()
                with _lock:
                    _state["failed"] += 1
                continue
            final = _wait_idle()              # block until THIS job completes
            with _lock:
                if final == "error":
                    _state["failed"] += 1
                else:
                    _state["done"] += 1
    finally:
        with _lock:
            _state.update(running=False, current=None, current_title="")
