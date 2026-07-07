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
CREATE TABLE IF NOT EXISTS plans (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    idea_id      TEXT NOT NULL,
    created_at   TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    status       TEXT NOT NULL DEFAULT 'running',   -- running | done | error
    error        TEXT,
    candidates   TEXT,      -- JSON {A|B|C: candidate plan}
    judge_scores TEXT,      -- JSON {totals, judges, picks}
    winner       TEXT,
    final_plan   TEXT       -- markdown
);
CREATE INDEX IF NOT EXISTS idx_plans_idea ON plans(idea_id);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
"""

# guarded ALTERs for databases created before a column existed
MIGRATIONS = [
    "ALTER TABLE ideas ADD COLUMN category TEXT",
    "ALTER TABLE ideas ADD COLUMN polished TEXT",       # JSON refined spec
    "ALTER TABLE analyses ADD COLUMN estimates TEXT",   # JSON cost/revenue estimates
    "ALTER TABLE analyses ADD COLUMN effort_roi REAL",  # year-1 profit / effort cost
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


def ideas(origin=None, q=None, limit=300, category=None):
    # score/verdict from the latest COMPLETED analysis; activity status from the latest of any
    sql = ("SELECT i.*, a.composite, a.verdict, a.effort_roi, r.status AS an_status FROM ideas i "
           "LEFT JOIN analyses a ON a.id = (SELECT id FROM analyses WHERE idea_id=i.id "
           "AND status='done' ORDER BY id DESC LIMIT 1) "
           "LEFT JOIN analyses r ON r.id = (SELECT id FROM analyses WHERE idea_id=i.id "
           "ORDER BY id DESC LIMIT 1)")
    where, params = [], []
    if origin:
        where.append("i.origin=?")
        params.append(origin)
    if category:
        where.append("i.category=?")
        params.append(category)
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


def set_idea_polish(idea_id, polished, category=None):
    with _lock:
        con = _db()
        with con:
            con.execute("UPDATE ideas SET polished=?, category=COALESCE(?, category) WHERE id=?",
                        (json.dumps(polished) if isinstance(polished, (dict, list)) else polished,
                         category, idea_id))


def categories():
    with _lock:
        rows = _db().execute(
            "SELECT category, COUNT(*) n FROM ideas WHERE category IS NOT NULL "
            "GROUP BY category ORDER BY n DESC").fetchall()
        return [{"category": r["category"], "n": r["n"]} for r in rows]


def update_analysis(aid, **fields):
    allowed = {"status", "error", "composite", "verdict", "thesis", "wedge", "scores",
               "risks", "adoption", "pay_rate", "price_med", "objections", "panel",
               "estimates", "effort_roi"}
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


def new_plan(idea_id):
    with _lock:
        con = _db()
        with con:
            cur = con.execute("INSERT INTO plans(idea_id) VALUES(?)", (idea_id,))
        return cur.lastrowid


def update_plan(pid, **fields):
    allowed = {"status", "error", "candidates", "judge_scores", "winner", "final_plan"}
    cols = [k for k in fields if k in allowed]
    if not cols:
        return
    vals = [json.dumps(fields[c]) if isinstance(fields[c], (dict, list)) else fields[c]
            for c in cols]
    with _lock:
        con = _db()
        with con:
            con.execute(f"UPDATE plans SET {', '.join(c + '=?' for c in cols)} WHERE id=?",
                        vals + [pid])


def plan(pid):
    with _lock:
        row = _db().execute("SELECT * FROM plans WHERE id=?", (pid,)).fetchone()
        return dict(row) if row else None


def plans(limit=50):
    with _lock:
        rows = _db().execute(
            "SELECT p.*, i.title FROM plans p JOIN ideas i ON i.id=p.idea_id "
            "ORDER BY p.id DESC LIMIT ?", (limit,)).fetchall()
        return [dict(r) for r in rows]
