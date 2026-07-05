"""SQLite persistence for the TikTok archiver.

Single connection guarded by an RLock — the web handlers and the one
background job thread both go through these helpers. Mutating helpers run
inside `with conn:` so partial writes roll back on error.

Paths (file_path/thumb_path/transcript_path/srt_path) are stored relative to
DATA_DIR so the whole folder can be moved; abs_path() also accepts the
absolute paths older rows may contain.
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
    "whisper_model": "small",     # tiny | base | small | medium | large-v3 (small = better accuracy)
    "language": "auto",           # auto or an ISO code like "en"
    "auto_sync": "0",             # hours between automatic syncs of all profiles; 0 = off
    "visual_scan": "0",           # 1 = also OCR/scene-tag each video (on-screen text + what's showing)
}

SCHEMA = """
CREATE TABLE IF NOT EXISTS profiles (
    username     TEXT PRIMARY KEY,
    url          TEXT NOT NULL,
    added_at     TEXT NOT NULL DEFAULT (datetime('now')),
    last_sync_at TEXT
);
CREATE TABLE IF NOT EXISTS videos (
    id              TEXT PRIMARY KEY,
    username        TEXT NOT NULL,
    url             TEXT,
    title           TEXT,
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
CREATE INDEX IF NOT EXISTS idx_videos_username ON videos(username);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
"""

# guarded ALTERs for databases created before a column existed
MIGRATIONS = [
    "ALTER TABLE videos ADD COLUMN attempts INTEGER NOT NULL DEFAULT 0",
    "ALTER TABLE videos ADD COLUMN visual TEXT",
    "ALTER TABLE videos ADD COLUMN visual_path TEXT",
    "ALTER TABLE videos ADD COLUMN scanned_at TEXT",
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
            for stmt in MIGRATIONS:
                try:
                    _conn.execute(stmt)
                except sqlite3.OperationalError:
                    pass  # column already exists
            _conn.commit()
        return _conn


# ---------- path helpers ----------

def rel_path(p):
    """Store paths relative to data/ so the app folder can be moved."""
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
            for key, value in values.items():
                if key in DEFAULTS:
                    con.execute(
                        "INSERT INTO settings(key,value) VALUES(?,?) "
                        "ON CONFLICT(key) DO UPDATE SET value=excluded.value",
                        (key, str(value)),
                    )


# ---------- profiles ----------

def add_profile(username, url):
    with _lock:
        con = _db()
        with con:
            con.execute("INSERT OR IGNORE INTO profiles(username,url) VALUES(?,?)", (username, url))


def remove_profile(username):
    with _lock:
        con = _db()
        with con:
            con.execute("DELETE FROM videos WHERE username=?", (username,))
            con.execute("DELETE FROM profiles WHERE username=?", (username,))


def profiles():
    with _lock:
        rows = _db().execute(
            """
            SELECT p.username, p.url, p.last_sync_at,
                   COUNT(v.id) AS known,
                   COALESCE(SUM(CASE WHEN v.file_path IS NOT NULL THEN 1 ELSE 0 END), 0) AS downloaded,
                   COALESCE(SUM(CASE WHEN NULLIF(v.transcript,'') IS NOT NULL THEN 1 ELSE 0 END), 0) AS transcribed,
                   COALESCE(SUM(CASE WHEN v.status = 'no-speech' THEN 1 ELSE 0 END), 0) AS no_speech,
                   COALESCE(SUM(CASE WHEN v.status = 'error' THEN 1 ELSE 0 END), 0) AS errors
            FROM profiles p LEFT JOIN videos v ON v.username = p.username
            GROUP BY p.username ORDER BY p.added_at
            """
        ).fetchall()
        return [dict(r) for r in rows]


def profile_url(username):
    with _lock:
        row = _db().execute("SELECT url FROM profiles WHERE username=?", (username,)).fetchone()
        return row["url"] if row else None


def touch_profile(username):
    with _lock:
        con = _db()
        with con:
            con.execute(
                "UPDATE profiles SET last_sync_at=datetime('now','localtime') WHERE username=?",
                (username,),
            )


# ---------- videos ----------

def known_ids(username):
    with _lock:
        rows = _db().execute("SELECT id FROM videos WHERE username=?", (username,)).fetchall()
        return {r["id"] for r in rows}


def add_pending_video(vid, username, url, title):
    with _lock:
        con = _db()
        with con:
            # a TikTok video id belongs to exactly one profile — if the creator
            # renamed, re-attribute the existing row instead of silently dropping it
            con.execute(
                """
                INSERT INTO videos(id,username,url,title,status) VALUES(?,?,?,?,'pending')
                ON CONFLICT(id) DO UPDATE SET username=excluded.username, url=excluded.url
                WHERE videos.username != excluded.username
                """,
                (vid, username, url, title),
            )


_UPDATABLE = {
    "url", "title", "upload_date", "duration", "view_count", "like_count",
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


def to_download(username):
    """Known videos with no file yet. Fresh pendings first, then error retries."""
    with _lock:
        rows = _db().execute(
            "SELECT * FROM videos WHERE username=? AND file_path IS NULL AND status != 'unsupported' "
            "ORDER BY CASE WHEN status='pending' THEN 0 ELSE 1 END, rowid DESC",
            (username,),
        ).fetchall()
        return [dict(r) for r in rows]


def to_transcribe(username):
    # transcript IS NULL → not yet done; status != 'no-speech' → don't retry silent clips
    with _lock:
        rows = _db().execute(
            "SELECT * FROM videos WHERE username=? AND file_path IS NOT NULL "
            "AND transcript IS NULL AND status != 'no-speech'",
            (username,),
        ).fetchall()
        return [dict(r) for r in rows]


def to_visual(username):
    with _lock:
        rows = _db().execute(
            "SELECT * FROM videos WHERE username=? AND file_path IS NOT NULL AND visual IS NULL",
            (username,),
        ).fetchall()
        return [dict(r) for r in rows]


def video(vid):
    with _lock:
        row = _db().execute("SELECT * FROM videos WHERE id=?", (vid,)).fetchone()
        return dict(row) if row else None


def _search_clause(q, where, params):
    esc = q.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
    where.append("(title LIKE ? ESCAPE '\\' OR transcript LIKE ? ESCAPE '\\' "
                 "OR visual LIKE ? ESCAPE '\\')")
    params += [f"%{esc}%"] * 3


def videos(username=None, q=None):
    """List rows for the UI: full transcript is replaced by a short snippet."""
    sql = "SELECT * FROM videos"
    where, params = [], []
    if username:
        where.append("username=?")
        params.append(username)
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


def transcripts(username=None, q=None, ids=None):
    sql = ("SELECT id, username, url, title, upload_date, duration, view_count, "
           "status, transcript, visual FROM videos")
    where, params = [], []
    if ids:
        # explicit selection → include exactly those (even a no-speech pick)
        where.append(f"id IN ({','.join('?' * len(ids))})")
        params += list(ids)
    else:
        # bulk/filtered → only rows that actually have content
        where.append("(NULLIF(transcript,'') IS NOT NULL OR NULLIF(visual,'') IS NOT NULL)")
    if username:
        where.append("username=?")
        params.append(username)
    if q:
        _search_clause(q, where, params)
    sql += " WHERE " + " AND ".join(where) + " ORDER BY upload_date DESC, id DESC"
    with _lock:
        return [dict(r) for r in _db().execute(sql, params).fetchall()]
