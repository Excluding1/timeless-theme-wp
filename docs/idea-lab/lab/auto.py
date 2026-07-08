"""Always-on automation: periodic fetching + continuous scoring.

Two daemon loops start with the server and make Idea Lab self-sustaining:

  * auto-fetch  — every `auto_fetch_hours` (default 4h) run a full fetch across
    every source. Deduplication is inherent: upsert_idea() ON CONFLICT updates the
    existing row, so re-pulling never creates duplicates — it only refreshes metrics
    and adds genuinely new items (then auto-categorizes them).

  * auto-score  — continuously pick the next idea with no completed analysis and
    score it (scorecard-only by default = one LLM call = fastest), until every idea
    is scored. It yields to any manual analysis / pipeline / batch, and because
    "unscored" is computed from the database each time, it resumes seamlessly across
    restarts and never re-scores an idea that's already done.

Both are controlled by settings (auto_fetch / auto_score on-off, auto_fetch_hours,
auto_score_panel) and expose a status snapshot for the UI.
"""
import threading
import time
import traceback
from datetime import datetime

from . import analyst, batch, db, sources

_state = {
    "fetch_enabled": True, "score_enabled": True,
    "fetch_hours": 4.0, "last_fetch_at": "", "next_fetch_in_s": None,
    "scoring_now": "", "scored": 0, "total": 0, "remaining": 0,
}
_lock = threading.Lock()
_started = False


def _flag(key, default="1"):
    return (db.get_setting(key) or default) == "1"


def _hours():
    try:
        return max(0.25, float(db.get_setting("auto_fetch_hours") or 4))
    except (TypeError, ValueError):
        return 4.0


def _panel():
    try:
        return max(0, min(100, int(float(db.get_setting("auto_score_panel") or 0))))
    except (TypeError, ValueError):
        return 0


def status():
    with _lock:
        return dict(_state)


def _busy():
    """True if any manual analysis/pipeline OR the manual batch is running — the
    auto-scorer must never fight them for the single job slot."""
    j = analyst.job_status()
    if j and j.get("state") == "running":
        return True
    try:
        return bool(batch.status().get("running"))
    except Exception:
        return False


def _wait_idle(timeout=1800):
    waited = 0
    while waited < timeout:
        j = analyst.job_status()
        if not j or j.get("state") != "running":
            return
        time.sleep(4)
        waited += 4


def _auto_fetch_loop():
    while True:
        try:
            if not _flag("auto_fetch"):
                with _lock:
                    _state["fetch_enabled"] = False
                    _state["next_fetch_in_s"] = None
                time.sleep(60)
                continue
            with _lock:
                _state["fetch_enabled"] = True
            interval = _hours() * 3600
            last = db.get_setting("last_fetch_at") or ""
            due_in = 0.0
            if last:
                try:
                    elapsed = (datetime.now() - datetime.fromisoformat(last)).total_seconds()
                    due_in = max(0.0, interval - elapsed)
                except ValueError:
                    due_in = 0.0
            else:
                due_in = interval          # fresh boot: first auto-fetch one interval out
            # sleep toward the due time in short hops so on/off + interval changes apply
            slept = 0.0
            while slept < due_in:
                if not _flag("auto_fetch"):
                    break
                with _lock:
                    _state["next_fetch_in_s"] = int(due_in - slept)
                    _state["fetch_hours"] = _hours()
                time.sleep(min(60, due_in - slept))
                slept += 60
            if not _flag("auto_fetch"):
                continue
            if sources.fetch_all_bg():                 # dedup + categorize built in
                while sources.fetch_status().get("running"):
                    time.sleep(5)
            db.set_settings({"last_fetch_at": datetime.now().isoformat(timespec="seconds")})
            with _lock:
                _state["last_fetch_at"] = db.get_setting("last_fetch_at")
        except Exception:
            traceback.print_exc()
            time.sleep(120)


def _auto_score_loop():
    while True:
        try:
            scored, total = db.scoring_progress()
            with _lock:
                _state["scored"], _state["total"] = scored, total
                _state["remaining"] = max(0, total - scored)
                _state["score_enabled"] = _flag("auto_score")
            if not _flag("auto_score"):
                with _lock:
                    _state["scoring_now"] = ""
                time.sleep(30)
                continue
            if _busy():                                # yield to manual work / batch
                with _lock:
                    _state["scoring_now"] = ""
                time.sleep(12)
                continue
            row = db.next_unscored_idea()
            if not row:                                # everything scored — idle until new ideas arrive
                with _lock:
                    _state["scoring_now"] = ""
                time.sleep(120)
                continue
            with _lock:
                _state["scoring_now"] = row["title"][:70]
            try:
                analyst.start_analysis(row["id"], _panel())
            except analyst.Busy:
                time.sleep(8)
                continue
            _wait_idle()
        except Exception:
            traceback.print_exc()
            time.sleep(30)


def start():
    global _started
    with _lock:
        if _started:
            return
        _started = True
        _state["last_fetch_at"] = db.get_setting("last_fetch_at") or ""
    threading.Thread(target=_auto_fetch_loop, daemon=True).start()
    threading.Thread(target=_auto_score_loop, daemon=True).start()
