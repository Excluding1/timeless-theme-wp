"""SQLite persistence for Idea Lab: scraped ideas + analyst reports."""
import json
import sqlite3
import threading
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "lab.db"

DEFAULTS = {
    "panel_size": "20",     # personas consulted per analysis (10/25/50/100)
    "ph_token": "",         # optional Product Hunt API token for richer data
}

SCHEMA = """
CREATE TABLE IF NOT EXISTS ideas (
    id         TEXT PRIMARY KEY,       -- "<origin>:<native id or hash>"
    origin     TEXT NOT NULL,          -- hn | ph | custom
    title      TEXT NOT NULL,
    description TEXT,
    url        TEXT,
    points     INTEGER,
    comments   INTEGER,
    posted_at  TEXT,
    fetched_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    traction   REAL                    -- quick heuristic score from source metrics
);
CREATE TABLE IF NOT EXISTS analyses (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    idea_id    TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    status     TEXT NOT NULL DEFAULT 'running',   -- running | done | error
    error      TEXT,
    composite  REAL,
    verdict    TEXT,
    thesis     TEXT,
    wedge      TEXT,
    scores     TEXT,        -- JSON {factor: {score, note}}
    risks      TEXT,        -- JSON [str]
    panel_size INTEGER,
    adoption   REAL,        -- % of panel who would use
    pay_rate   REAL,        -- % of panel who would pay
    price_med  REAL,        -- median monthly price the payers would pay
    objections TEXT,        -- JSON [str] top objections
    panel      TEXT         -- JSON raw persona verdicts
);
CREATE INDEX IF NOT EXISTS idx_analyses_idea ON analyses(idea_id);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
"""

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
            _conn.commit()
        return _conn


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
                    con.execute("INSERT INTO settings(key,value) VALUES(?,?) "
                                "ON CONFLICT(key) DO UPDATE SET value=excluded.value", (k, str(v)))


def upsert_idea(idea):
    with _lock:
        con = _db()
        with con:
            con.execute(
                """INSERT INTO ideas(id,origin,title,description,url,points,comments,posted_at,traction)
                   VALUES(:id,:origin,:title,:description,:url,:points,:comments,:posted_at,:traction)
                   ON CONFLICT(id) DO UPDATE SET points=excluded.points, comments=excluded.comments,
                       traction=excluded.traction, description=excluded.description""",
                idea,
            )


def ideas(origin=None, q=None, limit=300):
    sql = ("SELECT i.*, a.composite, a.verdict, a.status AS an_status FROM ideas i "
           "LEFT JOIN analyses a ON a.id = (SELECT id FROM analyses WHERE idea_id=i.id "
           "ORDER BY id DESC LIMIT 1)")
    where, params = [], []
    if origin:
        where.append("i.origin=?")
        params.append(origin)
    if q:
        esc = q.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
        where.append("(i.title LIKE ? ESCAPE '\\' OR i.description LIKE ? ESCAPE '\\')")
        params += [f"%{esc}%"] * 2
    if where:
        sql += " WHERE " + " AND ".join(where)
    sql += " ORDER BY COALESCE(a.composite,-1) DESC, i.traction DESC LIMIT ?"
    params.append(limit)
    with _lock:
        return [dict(r) for r in _db().execute(sql, params).fetchall()]


def idea(idea_id):
    with _lock:
        row = _db().execute("SELECT * FROM ideas WHERE id=?", (idea_id,)).fetchone()
        return dict(row) if row else None


def new_analysis(idea_id, panel_size):
    with _lock:
        con = _db()
        with con:
            cur = con.execute("INSERT INTO analyses(idea_id, panel_size) VALUES(?,?)",
                              (idea_id, panel_size))
        return cur.lastrowid


def update_analysis(aid, **fields):
    allowed = {"status", "error", "composite", "verdict", "thesis", "wedge", "scores",
               "risks", "adoption", "pay_rate", "price_med", "objections", "panel"}
    cols = [k for k in fields if k in allowed]
    if not cols:
        return
    vals = [json.dumps(fields[c]) if isinstance(fields[c], (dict, list)) else fields[c]
            for c in cols]
    with _lock:
        con = _db()
        with con:
            con.execute(f"UPDATE analyses SET {', '.join(c + '=?' for c in cols)} WHERE id=?",
                        vals + [aid])


def analysis(aid):
    with _lock:
        row = _db().execute("SELECT * FROM analyses WHERE id=?", (aid,)).fetchone()
        return dict(row) if row else None


def analyses(limit=100):
    with _lock:
        rows = _db().execute(
            "SELECT a.*, i.title, i.origin, i.url FROM analyses a "
            "JOIN ideas i ON i.id=a.idea_id ORDER BY a.id DESC LIMIT ?", (limit,)).fetchall()
        return [dict(r) for r in rows]
