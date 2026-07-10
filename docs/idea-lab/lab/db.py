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
    "panel_size": "20",       # personas consulted per manual analysis (10/25/50/100)
    "auto_fetch": "1",        # 1 = run a full fetch every auto_fetch_hours
    "auto_fetch_hours": "4",  # interval between automatic fetches
    "auto_score": "1",        # 1 = continuously score unscored ideas in the background
    "auto_score_panel": "0",  # personas for auto-scoring (0 = scorecard only = fastest)
    "auto_score_workers": "12",  # how many parallel scoring workers (1-40)
    "auto_score_batch": "6",     # ideas scored per LLM call (1 = deep 12-factor, >1 = fast batch)
    "last_fetch_at": "",      # ISO timestamp of the last automatic fetch (for status)
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
CREATE TABLE IF NOT EXISTS fit_tests (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    idea_id    TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    status     TEXT NOT NULL DEFAULT 'running',   -- running | done | error
    error      TEXT,
    prd        TEXT,        -- JSON lean PRD
    result     TEXT,        -- JSON market-test result (customers, complaints, fixes)
    fit_score  REAL,
    verdict    TEXT         -- build | reshape | skip
);
CREATE INDEX IF NOT EXISTS idx_fit_idea ON fit_tests(idea_id);
CREATE TABLE IF NOT EXISTS ventures (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    status     TEXT NOT NULL DEFAULT 'running',   -- running | done | error
    error      TEXT,
    spec       TEXT,        -- JSON shortlist entry (name/label/position/angle/seo…)
    prd        TEXT         -- full build-ready PRD markdown
);
"""

# guarded ALTERs for databases created before a column existed
MIGRATIONS = [
    "ALTER TABLE ideas ADD COLUMN category TEXT",
    "ALTER TABLE ideas ADD COLUMN polished TEXT",       # JSON refined spec
    "ALTER TABLE ideas ADD COLUMN momentum REAL",       # Google Trends interest 0-100
    "ALTER TABLE ideas ADD COLUMN trend_json TEXT",     # JSON {keyword,current,slope,direction}
    "ALTER TABLE ideas ADD COLUMN signal REAL",         # instant heuristic rank 0-100 (no LLM)
    "ALTER TABLE analyses ADD COLUMN estimates TEXT",   # JSON cost/revenue estimates
    "ALTER TABLE analyses ADD COLUMN effort_roi REAL",  # year-1 profit / effort cost
    "ALTER TABLE analyses ADD COLUMN hands_off REAL",       # 0-100: runs autonomously / passive-friendly
    "ALTER TABLE analyses ADD COLUMN startup_capital REAL", # rough $ to start
    "ALTER TABLE analyses ADD COLUMN is_online INTEGER",    # 1 = online/SaaS-type, 0 = physical
    "ALTER TABLE simulations ADD COLUMN route TEXT",        # best-route diagram + smart moves (markdown)
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


# Whitelisted sort columns (never interpolate raw user input into SQL). Each maps a
# UI sort key to a column expression; NULLs are always pushed last so "lowest ROI"
# shows the worst *scored* ideas, not the unscored ones.
_SORT_COL = {
    "score":    "a.composite",
    "roi":      "a.effort_roi",
    # "autonomy winner": reward hands-off AND viability together, so trivially-automated
    # novelty junk (high hands_off, low score) doesn't float to the top.
    "hands_off": "(a.hands_off * a.composite)",
    "signal":   "i.signal",
    "revenue":  "CASE WHEN i.origin='ih' THEN i.points END",
    "momentum": "i.momentum",
    "traction": "i.traction",
    "recent":   "i.fetched_at",
}


def ideas(origin=None, q=None, limit=3000, category=None, sort="rank", direction="desc",
          online=False):
    # score/verdict from the latest COMPLETED analysis; activity status from the latest of any
    sql = ("SELECT i.*, a.composite, a.verdict, a.effort_roi, a.hands_off, a.is_online, "
           "a.startup_capital, r.status AS an_status FROM ideas i "
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
    if online:
        where.append("a.is_online=1")
    if q:
        esc = q.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
        where.append("(i.title LIKE ? ESCAPE '\\' OR i.description LIKE ? ESCAPE '\\')")
        params += [f"%{esc}%"] * 2
    if where:
        sql += " WHERE " + " AND ".join(where)
    d = "ASC" if str(direction).lower() == "asc" else "DESC"
    if sort in _SORT_COL:
        col = _SORT_COL[sort]
        # non-null values first (IS NULL ASC), then by the chosen field/direction,
        # then a stable traction tiebreaker.
        order = f"({col}) IS NULL ASC, ({col}) {d}, i.traction DESC"
    else:
        # default "rank": AI-scored ideas first (by composite); everything not yet
        # scored falls back to the instant Signal score, then traction — so the list
        # is well-ordered even before the LLM has touched most of it.
        order = ("COALESCE(a.composite,-1) DESC, COALESCE(i.signal,0) DESC, "
                 "COALESCE(i.traction,0) DESC")
    sql += f" ORDER BY {order} LIMIT ?"
    params.append(limit)
    with _lock:
        return [dict(r) for r in _db().execute(sql, params).fetchall()]


def count_ideas(origin=None, q=None, category=None, online=False):
    # join the latest done analysis only when we need to filter on it (online)
    sql = ("SELECT COUNT(*) FROM ideas i LEFT JOIN analyses a ON a.id=("
           "SELECT id FROM analyses WHERE idea_id=i.id AND status='done' ORDER BY id DESC LIMIT 1)"
           if online else "SELECT COUNT(*) FROM ideas i")
    where, params = [], []
    if origin:
        where.append("i.origin=?"); params.append(origin)
    if category:
        where.append("i.category=?"); params.append(category)
    if online:
        where.append("a.is_online=1")
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


def scoring_progress():
    """(scored, total) — how many ideas have a completed analysis."""
    with _lock:
        total = _db().execute("SELECT COUNT(*) FROM ideas").fetchone()[0]
        scored = _db().execute(
            "SELECT COUNT(DISTINCT idea_id) FROM analyses WHERE status='done'").fetchone()[0]
        return scored, total


def next_unscored_idea(max_attempts=2):
    """The next idea with no completed analysis, BEST Signal score first (so the most
    promising ideas get AI-scored soonest). Ideas that already have >= max_attempts
    analyses are skipped so a persistently-failing one can't wedge the auto-scorer."""
    with _lock:
        row = _db().execute(
            "SELECT i.id, i.title FROM ideas i "
            "WHERE NOT EXISTS (SELECT 1 FROM analyses a WHERE a.idea_id=i.id AND a.status='done') "
            "AND (SELECT COUNT(*) FROM analyses a2 WHERE a2.idea_id=i.id) < ? "
            "ORDER BY COALESCE(i.signal,0) DESC, COALESCE(i.traction,0) DESC LIMIT 1",
            (max_attempts,)).fetchone()
        return dict(row) if row else None


def next_unscored_ideas(limit=50, max_attempts=2):
    """A batch of the best-signal unscored ideas, for the parallel scorer to claim
    from (workers filter out ids already in flight)."""
    with _lock:
        rows = _db().execute(
            "SELECT i.id, i.title FROM ideas i "
            "WHERE NOT EXISTS (SELECT 1 FROM analyses a WHERE a.idea_id=i.id AND a.status='done') "
            "AND (SELECT COUNT(*) FROM analyses a2 WHERE a2.idea_id=i.id) < ? "
            "ORDER BY COALESCE(i.signal,0) DESC, COALESCE(i.traction,0) DESC LIMIT ?",
            (max_attempts, limit)).fetchall()
        return [dict(r) for r in rows]


def all_ideas_for_signal():
    """Minimal columns for recomputing every idea's Signal score (no LLM)."""
    with _lock:
        rows = _db().execute(
            "SELECT id, origin, points, comments, traction, momentum FROM ideas").fetchall()
        return [dict(r) for r in rows]


def bulk_set_signal(pairs):
    """pairs = [(idea_id, signal), ...] — one transaction for the whole recompute."""
    with _lock:
        con = _db()
        with con:
            con.executemany("UPDATE ideas SET signal=? WHERE id=?",
                            [(s, i) for i, s in pairs])
        return len(pairs)


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


def category_stats():
    """Per-category landscape for the idea engine: how crowded, how strong on average,
    and the biggest proven revenue example in it."""
    with _lock:
        rows = _db().execute(
            "SELECT i.category, COUNT(*) n, "
            "ROUND(AVG(COALESCE(i.signal,0)),1) avg_signal, "
            "ROUND(AVG(a.composite),1) avg_score, "
            "MAX(CASE WHEN i.origin='ih' THEN i.points ELSE 0 END) top_rev "
            "FROM ideas i LEFT JOIN analyses a ON a.id=("
            "  SELECT id FROM analyses WHERE idea_id=i.id AND status='done' ORDER BY id DESC LIMIT 1) "
            "WHERE i.category IS NOT NULL AND i.category != '' "
            "GROUP BY i.category ORDER BY n DESC").fetchall()
        return [dict(r) for r in rows]


def top_scored(limit=12, online_only=False):
    """The highest AI-scored real businesses — exemplars for the idea engine."""
    sql = ("SELECT i.title, i.polished, i.category, a.composite, a.hands_off, a.is_online "
           "FROM analyses a JOIN ideas i ON i.id=a.idea_id "
           "WHERE a.status='done' AND a.composite IS NOT NULL")
    if online_only:
        sql += " AND a.is_online=1"
    sql += " ORDER BY a.composite DESC LIMIT ?"
    with _lock:
        return [dict(r) for r in _db().execute(sql, (limit,)).fetchall()]


def categories():
    with _lock:
        rows = _db().execute(
            "SELECT category, COUNT(*) n FROM ideas WHERE category IS NOT NULL "
            "GROUP BY category ORDER BY n DESC").fetchall()
        return [{"category": r["category"], "n": r["n"]} for r in rows]


def update_analysis(aid, **fields):
    allowed = {"status", "error", "composite", "verdict", "thesis", "wedge", "scores",
               "risks", "adoption", "pay_rate", "price_med", "objections", "panel",
               "estimates", "effort_roi", "hands_off", "startup_capital", "is_online"}
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


def update_idea_description(idea_id, description):
    with _lock:
        con = _db()
        with con:
            con.execute("UPDATE ideas SET description=? WHERE id=?", (description, idea_id))


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
    allowed = {"status", "error", "trials", "summary", "narrative", "route"}
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


# ---------- fit tests + ventures ----------

def new_fit_test(idea_id):
    with _lock:
        con = _db()
        with con:
            return con.execute("INSERT INTO fit_tests(idea_id) VALUES(?)", (idea_id,)).lastrowid


def update_fit_test(tid, **fields):
    allowed = {"status", "error", "prd", "result", "fit_score", "verdict"}
    cols = [k for k in fields if k in allowed]
    if not cols:
        return
    vals = [json.dumps(fields[c]) if isinstance(fields[c], (dict, list)) else fields[c]
            for c in cols]
    with _lock:
        con = _db()
        with con:
            con.execute(f"UPDATE fit_tests SET {', '.join(c + '=?' for c in cols)} WHERE id=?",
                        vals + [tid])


def fit_tests(limit=50):
    with _lock:
        rows = _db().execute(
            "SELECT f.*, i.title FROM fit_tests f JOIN ideas i ON i.id=f.idea_id "
            "ORDER BY f.id DESC LIMIT ?", (limit,)).fetchall()
        return [dict(r) for r in rows]


def new_venture(spec):
    with _lock:
        con = _db()
        with con:
            return con.execute("INSERT INTO ventures(spec) VALUES(?)",
                               (json.dumps(spec),)).lastrowid


def update_venture(vid, **fields):
    allowed = {"status", "error", "spec", "prd"}
    cols = [k for k in fields if k in allowed]
    if not cols:
        return
    vals = [json.dumps(fields[c]) if isinstance(fields[c], (dict, list)) else fields[c]
            for c in cols]
    with _lock:
        con = _db()
        with con:
            con.execute(f"UPDATE ventures SET {', '.join(c + '=?' for c in cols)} WHERE id=?",
                        vals + [vid])


def ventures(limit=60):
    with _lock:
        return [dict(r) for r in _db().execute(
            "SELECT * FROM ventures ORDER BY id DESC LIMIT ?", (limit,)).fetchall()]


def venture(vid):
    with _lock:
        row = _db().execute("SELECT * FROM ventures WHERE id=?", (vid,)).fetchone()
        return dict(row) if row else None


def revenue_exemplars(limit=14):
    """Top REAL-revenue businesses with their what-it-is label — the ground truth
    the Foundry learns pricing/mechanics from. Pure SQL."""
    with _lock:
        rows = _db().execute(
            "SELECT title, polished, category, points rev FROM ideas "
            "WHERE origin='ih' AND points > 0 AND points <= 2000000 "
            "ORDER BY points DESC LIMIT ?", (limit,)).fetchall()
    out = []
    for r in rows:
        name, label = r["title"], ""
        if r["polished"]:
            try:
                p = json.loads(r["polished"])
                name = p.get("polished_title") or name
                label = p.get("label") or p.get("refined_description") or ""
            except (TypeError, json.JSONDecodeError):
                pass
        out.append({"name": name, "label": label, "category": r["category"], "rev": r["rev"]})
    return out


def latest_analysis(idea_id):
    """The most recent COMPLETED analysis for an idea (drives simulator priors)."""
    with _lock:
        row = _db().execute(
            "SELECT * FROM analyses WHERE idea_id=? AND status='done' "
            "ORDER BY id DESC LIMIT 1", (idea_id,)).fetchone()
        return dict(row) if row else None
