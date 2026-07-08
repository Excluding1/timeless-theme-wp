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
import collections
import threading
import time
import traceback
from datetime import datetime

from . import analyst, db, sources

MAX_WORKERS = 20        # hard ceiling on parallel scoring subprocesses

_state = {
    "fetch_enabled": True, "score_enabled": True,
    "fetch_hours": 4.0, "last_fetch_at": "", "next_fetch_in_s": None,
    "scored": 0, "total": 0, "remaining": 0,
    "workers": 8, "active": 0, "rate_per_min": 0, "failed": 0,
    "last_error": "", "scoring_now": [],
}
_lock = threading.Lock()
_claimed = set()                       # idea ids currently being scored (in flight)
_done_ts = collections.deque(maxlen=400)  # completion timestamps for the rate meter
_active_titles = {}                    # worker_index -> title currently scoring
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


def _worker_count():
    try:
        return max(1, min(MAX_WORKERS, int(float(db.get_setting("auto_score_workers") or 8))))
    except (TypeError, ValueError):
        return 8


def status():
    with _lock:
        s = dict(_state)
        s["scoring_now"] = [t for t in _active_titles.values() if t][:8]
        s["active"] = len(s["scoring_now"])
        # rate = completions in the last 60s
        cutoff = time.time() - 60
        s["rate_per_min"] = sum(1 for t in _done_ts if t >= cutoff)
        return s


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


_candidates = collections.deque()      # buffer of unscored ideas to hand to workers


def _claim_next():
    """Return the next unscored idea to score, marking it in-flight. Refills the
    candidate buffer from the DB (best-signal first) when it runs low. Thread-safe."""
    with _lock:
        while _candidates:
            row = _candidates.popleft()
            if row["id"] not in _claimed:
                _claimed.add(row["id"])
                return row
    # buffer empty — refill outside the buffer-pop loop
    fresh = db.next_unscored_ideas(limit=80)
    with _lock:
        for row in fresh:
            if row["id"] not in _claimed:
                _candidates.append(row)
        while _candidates:
            row = _candidates.popleft()
            if row["id"] not in _claimed:
                _claimed.add(row["id"])
                return row
    return None


def _score_worker(idx):
    """One parallel scoring worker. Idle unless auto-score is on AND this worker's
    index is within the current worker-count setting (so the count is tunable live)."""
    while True:
        try:
            if not _flag("auto_score") or idx >= _worker_count():
                _active_titles.pop(idx, None)
                time.sleep(5)
                continue
            row = _claim_next()
            if not row:
                _active_titles.pop(idx, None)
                time.sleep(15)              # nothing to score — wait for new ideas
                continue
            _active_titles[idx] = row["title"][:70]
            try:
                analyst.score_idea_sync(row["id"], _panel())
                _done_ts.append(time.time())
            except Exception as e:
                with _lock:
                    _state["failed"] += 1
                    _state["last_error"] = f"{row['title'][:40]}: {str(e)[:120]}"
            finally:
                with _lock:
                    _claimed.discard(row["id"])
                _active_titles.pop(idx, None)
        except Exception:
            traceback.print_exc()
            time.sleep(10)


def _progress_monitor():
    """Refresh the scored/total counters + enabled flags for the UI every few sec."""
    while True:
        try:
            scored, total = db.scoring_progress()
            with _lock:
                _state["scored"], _state["total"] = scored, total
                _state["remaining"] = max(0, total - scored)
                _state["score_enabled"] = _flag("auto_score")
                _state["workers"] = _worker_count()
        except Exception:
            traceback.print_exc()
        time.sleep(4)


def start():
    global _started
    with _lock:
        if _started:
            return
        _started = True
        _state["last_fetch_at"] = db.get_setting("last_fetch_at") or ""
    threading.Thread(target=_auto_fetch_loop, daemon=True).start()
    threading.Thread(target=_progress_monitor, daemon=True).start()
    for i in range(MAX_WORKERS):            # spawn the full pool; each self-gates on the count
        threading.Thread(target=_score_worker, args=(i,), daemon=True).start()
