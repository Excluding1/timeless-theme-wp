"""SQLite persistence for Idea Lab: scraped ideas + analyst reports."""
import json
import re
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
CREATE TABLE IF NOT EXISTS custom_sources (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    kind    TEXT NOT NULL,          -- rss | archive-channel
    name    TEXT NOT NULL,
    ref     TEXT NOT NULL,          -- feed URL, or "<platform>:<username>" for archive
    enabled INTEGER NOT NULL DEFAULT 1,
    added_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
CREATE TABLE IF NOT EXISTS simulations (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    idea_id    TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    status     TEXT NOT NULL DEFAULT 'running',   -- running | done | error
    error      TEXT,
    trials     INTEGER,
    summary    TEXT,        -- JSON numeric aggregates (percentiles, outcome odds, exit)
    narrative  TEXT         -- markdown: data-analyst read + avoid/improve advice
);
CREATE INDEX IF NOT EXISTS idx_sims_idea ON simulations(idea_id);
"""

# guarded ALTERs for databases created before a column existed
MIGRATIONS = [
    "ALTER TABLE ideas ADD COLUMN category TEXT",
    "ALTER TABLE ideas ADD COLUMN polished TEXT",       # JSON refined spec
    "ALTER TABLE ideas ADD COLUMN momentum REAL",       # Google Trends interest 0-100
    "ALTER TABLE ideas ADD COLUMN trend_json TEXT",     # JSON {keyword,current,slope,direction}
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


def ideas(origin=None, q=None, limit=3000, category=None):
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
    # analyzed ideas rank first (by AI score); within a tier, a rising Google-Trends
    # momentum lifts an idea by boosting its traction weight — every variable counts.
    sql += (" ORDER BY COALESCE(a.composite,-1) DESC, "
            "(COALESCE(i.traction,0) * (1 + COALESCE(i.momentum,0)/100.0)) DESC LIMIT ?")
    params.append(limit)
    with _lock:
        return [dict(r) for r in _db().execute(sql, params).fetchall()]


def count_ideas(origin=None, q=None, category=None):
    sql = "SELECT COUNT(*) FROM ideas i"
    where, params = [], []
    if origin:
        where.append("i.origin=?"); params.append(origin)
    if category:
        where.append("i.category=?"); params.append(category)
    if q:
        esc = q.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
        where.append("(i.title LIKE ? ESCAPE '\\' OR i.description LIKE ? ESCAPE '\\')")
        params += [f"%{esc}%"] * 2
    if where:
        sql += " WHERE " + " AND ".join(where)
    with _lock:
        return _db().execute(sql, params).fetchone()[0]


def source_counts():
    with _lock:
        rows = _db().execute("SELECT origin, COUNT(*) n FROM ideas GROUP BY origin").fetchall()
        return {r["origin"]: r["n"] for r in rows}


def idea(idea_id):
    with _lock:
        row = _db().execute("SELECT * FROM ideas WHERE id=?", (idea_id,)).fetchone()
        return dict(row) if row else None


_STOP = set(("the a an and or for to of in on with your you our we is are be this that it "
             "how i my me app tool platform service business make build using based new "
             "get all can from at as by").split())


def _tokens(text):
    return {w for w in re.findall(r"[a-z0-9]{3,}", (text or "").lower()) if w not in _STOP}


def similar_ideas(idea_id, n=8):
    """Top-n ideas most similar to this one by keyword overlap (Jaccard)."""
    target = idea(idea_id)
    if not target:
        return []
    tt = _tokens(target["title"] + " " + (target.get("description") or ""))
    if not tt:
        return []
    with _lock:
        rows = _db().execute(
            "SELECT id, origin, title, description, url, traction, category FROM ideas "
            "WHERE id != ?", (idea_id,)).fetchall()
    scored = []
    for r in rows:
        ot = _tokens(r["title"] + " " + (r["description"] or ""))
        if not ot:
            continue
        inter = len(tt & ot)
        if inter < 2:
            continue
        score = inter / len(tt | ot)
        scored.append((score, dict(r)))
    scored.sort(key=lambda x: -x[0])
    out = []
    for score, r in scored[:n]:
        r.pop("description", None)
        r["similarity"] = round(score, 3)
        out.append(r)
    return out


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


def add_custom_source(kind, name, ref):
    with _lock:
        con = _db()
        with con:
            cur = con.execute(
                "INSERT INTO custom_sources(kind,name,ref) VALUES(?,?,?)", (kind, name, ref))
        return cur.lastrowid


def custom_sources(enabled_only=False):
    sql = "SELECT * FROM custom_sources"
    if enabled_only:
        sql += " WHERE enabled=1"
    sql += " ORDER BY id"
    with _lock:
        return [dict(r) for r in _db().execute(sql).fetchall()]


def remove_custom_source(sid):
    with _lock:
        con = _db()
        with con:
            con.execute("DELETE FROM custom_sources WHERE id=?", (sid,))


def set_idea_category(idea_id, category):
    with _lock:
        con = _db()
        with con:
            con.execute("UPDATE ideas SET category=? WHERE id=?", (category, idea_id))


def set_idea_trend(idea_id, momentum, trend):
    with _lock:
        con = _db()
        with con:
            con.execute("UPDATE ideas SET momentum=?, trend_json=? WHERE id=?",
                        (momentum,
                         json.dumps(trend) if isinstance(trend, (dict, list)) else trend,
                         idea_id))


def uncategorized_ideas(limit=100000):
    """id/title/description for every idea missing a category (for the bulk classifier)."""
    with _lock:
        rows = _db().execute(
            "SELECT id, title, description FROM ideas "
            "WHERE category IS NULL OR category='' LIMIT ?", (limit,)).fetchall()
        return [dict(r) for r in rows]


def bulk_set_categories(pairs):
    """pairs = [(idea_id, category), ...] — one transaction for the whole sweep."""
    with _lock:
        con = _db()
        with con:
            con.executemany("UPDATE ideas SET category=? WHERE id=?",
                            [(c, i) for i, c in pairs])
        return len(pairs)


# ---------- simulations ----------

def new_simulation(idea_id, trials):
    with _lock:
        con = _db()
        with con:
            cur = con.execute("INSERT INTO simulations(idea_id, trials) VALUES(?,?)",
                              (idea_id, trials))
        return cur.lastrowid


def update_simulation(sid, **fields):
    allowed = {"status", "error", "trials", "summary", "narrative"}
    cols = [k for k in fields if k in allowed]
    if not cols:
        return
    vals = [json.dumps(fields[c]) if isinstance(fields[c], (dict, list)) else fields[c]
            for c in cols]
    with _lock:
        con = _db()
        with con:
            con.execute(f"UPDATE simulations SET {', '.join(c + '=?' for c in cols)} WHERE id=?",
                        vals + [sid])


def simulation(sid):
    with _lock:
        row = _db().execute("SELECT * FROM simulations WHERE id=?", (sid,)).fetchone()
        return dict(row) if row else None


def simulations(limit=50):
    with _lock:
        rows = _db().execute(
            "SELECT s.*, i.title FROM simulations s JOIN ideas i ON i.id=s.idea_id "
            "ORDER BY s.id DESC LIMIT ?", (limit,)).fetchall()
        return [dict(r) for r in rows]


def latest_analysis(idea_id):
    """The most recent COMPLETED analysis for an idea (drives simulator priors)."""
    with _lock:
        row = _db().execute(
            "SELECT * FROM analyses WHERE idea_id=? AND status='done' "
            "ORDER BY id DESC LIMIT 1", (idea_id,)).fetchone()
        return dict(row) if row else None
