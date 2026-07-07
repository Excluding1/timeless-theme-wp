"""SQLite persistence for the Media Archiver.

Profiles are keyed by `key` = "<platform>:<username>" so the same handle can
exist on TikTok, YouTube and Instagram independently. Videos carry that key plus
platform + username for path building and display. Paths are stored relative to
DATA_DIR so the whole folder can be moved.
"""
import os
import sqlite3
import threading
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "archive.db"

DEFAULTS = {
    "cookie_mode": "none",        # none | browser | file
    "cookie_browser": "chrome",   # chrome | safari | firefox | edge | brave
    "whisper_model": "small",     # tiny | base | small | medium | large-v3
    "language": "auto",           # auto or an ISO code like "en"
    "auto_sync": "0",             # hours between automatic syncs; 0 = off
    "visual_scan": "0",           # 1 = also OCR/scene-tag each video
}

SCHEMA = """
CREATE TABLE IF NOT EXISTS profiles (
    key          TEXT PRIMARY KEY,   -- "<platform>:<username>"
    platform     TEXT NOT NULL,
    username     TEXT NOT NULL,
    url          TEXT NOT NULL,
    added_at     TEXT NOT NULL DEFAULT (datetime('now')),
    last_sync_at TEXT
);
CREATE TABLE IF NOT EXISTS videos (
    id              TEXT PRIMARY KEY,
    key             TEXT NOT NULL,   -- owning profile
    platform        TEXT NOT NULL,
    username        TEXT NOT NULL,
    url             TEXT,
    title           TEXT,
    caption         TEXT,
    upload_date     TEXT,
    duration        REAL,
    view_count      INTEGER,
    like_count      INTEGER,
    file_path       TEXT,
    thumb_path      TEXT,
    status          TEXT NOT NULL DEFAULT 'pending',
    error           TEXT,
    transcript      TEXT,
    transcript_path TEXT,
    srt_path        TEXT,
    visual          TEXT,
    visual_path     TEXT,
    downloaded_at   TEXT,
    transcribed_at  TEXT,
    scanned_at      TEXT,
    attempts        INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_videos_key ON videos(key);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
"""

# Columns added after the first release — applied idempotently on connect so an
# archive.db created by an older build keeps working.
MIGRATIONS = [
    "ALTER TABLE videos ADD COLUMN caption TEXT",
]

_lock = threading.RLock()
_conn = None


def _db():
    global _conn
    with _lock:
        if _conn is None:
            DATA_DIR.mkdir(parents=True, exist_ok=True)
            _conn = sqlite3.connect(DB_PATH, check_same_thread=False)
            _conn.row_factory = sqlite3.Row
            _conn.executescript(SCHEMA)
            for mig in MIGRATIONS:
                try:
                    _conn.execute(mig)
                except sqlite3.OperationalError:
                    pass  # column already exists
            _conn.commit()
        return _conn


# ---------- path helpers ----------

def rel_path(p):
    try:
        return str(Path(p).resolve().relative_to(DATA_DIR.resolve()))
    except ValueError:
        return str(p)


def abs_path(p):
    if not p:
        return None
    return str(p) if os.path.isabs(str(p)) else str(DATA_DIR / p)


# ---------- settings ----------

def get_setting(key):
    with _lock:
        row = _db().execute("SELECT value FROM settings WHERE key=?", (key,)).fetchone()
        return row["value"] if row else DEFAULTS.get(key)


def all_settings():
    return {k: get_setting(k) for k in DEFAULTS}


def set_settings(values):
    with _lock:
        con = _db()
        with con:
            for k, v in values.items():
                if k in DEFAULTS:
                    con.execute(
                        "INSERT INTO settings(key,value) VALUES(?,?) "
                        "ON CONFLICT(key) DO UPDATE SET value=excluded.value",
                        (k, str(v)),
                    )


# ---------- profiles ----------

def add_profile(key, platform, username, url):
    with _lock:
        con = _db()
        with con:
            con.execute(
                "INSERT OR IGNORE INTO profiles(key,platform,username,url) VALUES(?,?,?,?)",
                (key, platform, username, url),
            )


def remove_profile(key):
    with _lock:
        con = _db()
        with con:
            con.execute("DELETE FROM videos WHERE key=?", (key,))
            con.execute("DELETE FROM profiles WHERE key=?", (key,))


def profiles():
    with _lock:
        rows = _db().execute(
            """
            SELECT p.key, p.platform, p.username, p.url, p.last_sync_at,
                   COUNT(v.id) AS known,
                   COALESCE(SUM(CASE WHEN v.file_path IS NOT NULL THEN 1 ELSE 0 END), 0) AS downloaded,
                   COALESCE(SUM(CASE WHEN NULLIF(v.transcript,'') IS NOT NULL THEN 1 ELSE 0 END), 0) AS transcribed,
                   COALESCE(SUM(CASE WHEN v.status = 'no-speech' THEN 1 ELSE 0 END), 0) AS no_speech,
                   COALESCE(SUM(CASE WHEN v.status = 'error' THEN 1 ELSE 0 END), 0) AS errors
            FROM profiles p LEFT JOIN videos v ON v.key = p.key
            GROUP BY p.key ORDER BY p.added_at
            """
        ).fetchall()
        return [dict(r) for r in rows]


def profile(key):
    with _lock:
        row = _db().execute("SELECT * FROM profiles WHERE key=?", (key,)).fetchone()
        return dict(row) if row else None


def touch_profile(key):
    with _lock:
        con = _db()
        with con:
            con.execute("UPDATE profiles SET last_sync_at=datetime('now','localtime') WHERE key=?", (key,))


# ---------- videos ----------

def known_ids(key):
    with _lock:
        rows = _db().execute("SELECT id FROM videos WHERE key=?", (key,)).fetchall()
        return {r["id"] for r in rows}


def add_pending_video(vid, key, platform, username, url, title):
    with _lock:
        con = _db()
        with con:
            con.execute(
                """
                INSERT INTO videos(id,key,platform,username,url,title,status)
                VALUES(?,?,?,?,?,?,'pending')
                ON CONFLICT(id) DO UPDATE SET key=excluded.key, url=excluded.url
                WHERE videos.key != excluded.key
                """,
                (vid, key, platform, username, url, title),
            )


_UPDATABLE = {
    "url", "title", "caption", "upload_date", "duration", "view_count", "like_count",
    "file_path", "thumb_path", "status", "error", "transcript",
    "transcript_path", "srt_path", "visual", "visual_path",
    "downloaded_at", "transcribed_at", "scanned_at",
}


def update_video(vid, **fields):
    cols = [k for k in fields if k in _UPDATABLE]
    if not cols:
        return
    with _lock:
        con = _db()
        with con:
            con.execute(
                f"UPDATE videos SET {', '.join(c + '=?' for c in cols)} WHERE id=?",
                [fields[c] for c in cols] + [vid],
            )


def bump_attempts(vid):
    with _lock:
        con = _db()
        with con:
            con.execute("UPDATE videos SET attempts = attempts + 1 WHERE id=?", (vid,))
        row = con.execute("SELECT attempts FROM videos WHERE id=?", (vid,)).fetchone()
        return row["attempts"] if row else 0


def to_download(key):
    with _lock:
        rows = _db().execute(
            "SELECT * FROM videos WHERE key=? AND file_path IS NULL AND status != 'unsupported' "
            "ORDER BY CASE WHEN status='pending' THEN 0 ELSE 1 END, rowid DESC",
            (key,),
        ).fetchall()
        return [dict(r) for r in rows]


def to_transcribe(key):
    with _lock:
        rows = _db().execute(
            "SELECT * FROM videos WHERE key=? AND file_path IS NOT NULL "
            "AND transcript IS NULL AND status != 'no-speech'",
            (key,),
        ).fetchall()
        return [dict(r) for r in rows]


def to_visual(key):
    with _lock:
        rows = _db().execute(
            "SELECT * FROM videos WHERE key=? AND file_path IS NOT NULL AND visual IS NULL",
            (key,),
        ).fetchall()
        return [dict(r) for r in rows]


def downloaded(key):
    with _lock:
        rows = _db().execute(
            "SELECT * FROM videos WHERE key=? AND file_path IS NOT NULL ORDER BY upload_date DESC, id DESC",
            (key,),
        ).fetchall()
        return [dict(r) for r in rows]


def video(vid):
    with _lock:
        row = _db().execute("SELECT * FROM videos WHERE id=?", (vid,)).fetchone()
        return dict(row) if row else None


def _search_clause(q, where, params):
    esc = q.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
    where.append("(title LIKE ? ESCAPE '\\' OR caption LIKE ? ESCAPE '\\' "
                 "OR transcript LIKE ? ESCAPE '\\' OR visual LIKE ? ESCAPE '\\')")
    params += [f"%{esc}%"] * 4


def videos(key=None, q=None):
    sql = "SELECT * FROM videos"
    where, params = [], []
    if key:
        where.append("key=?")
        params.append(key)
    if q:
        _search_clause(q, where, params)
    if where:
        sql += " WHERE " + " AND ".join(where)
    sql += " ORDER BY upload_date DESC, id DESC"
    with _lock:
        rows = [dict(r) for r in _db().execute(sql, params).fetchall()]
    for r in rows:
        t = r.pop("transcript", None)
        r["has_transcript"] = t is not None
        r["snippet"] = (t[:280] + "…") if t and len(t) > 280 else t
        v = r.pop("visual", None)
        r["has_visual"] = v is not None
        r["visual_snippet"] = (v[:280] + "…") if v and len(v) > 280 else v
    return rows


def transcripts(key=None, q=None, ids=None):
    sql = ("SELECT id, platform, username, url, title, caption, upload_date, duration, view_count, "
           "status, transcript, visual FROM videos")
    where, params = [], []
    if ids:
        where.append(f"id IN ({','.join('?' * len(ids))})")
        params += list(ids)
    else:
        where.append("(NULLIF(transcript,'') IS NOT NULL OR NULLIF(visual,'') IS NOT NULL)")
    if key:
        where.append("key=?")
        params.append(key)
    if q:
        _search_clause(q, where, params)
    sql += " WHERE " + " AND ".join(where) + " ORDER BY upload_date DESC, id DESC"
    with _lock:
        return [dict(r) for r in _db().execute(sql, params).fetchall()]
