"""Idea Lab — scrape launch platforms, rank ideas, stress-test with an AI panel.

Run:  .venv/bin/python server.py   →   http://127.0.0.1:8319
"""
import hashlib
import json
import re
from pathlib import Path

import uvicorn
from fastapi import Body, FastAPI, HTTPException
from fastapi.responses import HTMLResponse, PlainTextResponse

from lab import (analyst, auto, batch, categorize, db, ideagen, planner, simulator,
                 sources, trends)

BASE = Path(__file__).resolve().parent

app = FastAPI(title="Idea Lab")

analyst.start_engine_detection()   # probe engines in the background at boot
auto.start()                        # auto-fetch (every 4h) + auto-score loops


def _int(val, default, lo=None, hi=None):
    """Coerce a raw JSON value ('3', 3, '3.7', 'abc', None) to an int, clamped."""
    try:
        n = int(float(val))
    except (TypeError, ValueError):
        n = int(default)
    if lo is not None:
        n = max(lo, n)
    if hi is not None:
        n = min(hi, n)
    return n


def _panel_size(body):
    """Parse panel_size defensively: bad input falls back, always clamped 0-100."""
    try:
        n = int(float(body.get("panel_size")))
    except (TypeError, ValueError):
        try:
            n = int(float(db.get_setting("panel_size") or 20))
        except (TypeError, ValueError):
            n = 20
    return max(0, min(100, n))


@app.middleware("http")
async def no_cache(request, call_next):
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-store"
    return response


@app.get("/")
def index():
    static = BASE / "static"
    html = (static / "index.html").read_text(encoding="utf-8")
    ver = str(int(max((static / "app.css").stat().st_mtime, (static / "app.js").stat().st_mtime)))
    return HTMLResponse(html.replace("__V__", ver))


@app.get("/static/{name}")
def static_file(name: str):
    p = (BASE / "static" / name).resolve()
    if not str(p).startswith(str(BASE / "static")) or not p.exists():
        raise HTTPException(404)
    ctype = {"js": "text/javascript", "css": "text/css"}.get(p.suffix.lstrip("."), "text/plain")
    return PlainTextResponse(p.read_text(encoding="utf-8"), media_type=ctype)


@app.get("/api/state")
def state():
    return {
        "settings": db.all_settings(),
        "job": analyst.job_status(),
        "engine": analyst.engine_info(),
        "fetch": sources.fetch_status(),
        "batch": batch.status(),
        "categorize": categorize.status(),
        "generate": ideagen.status(),
        "simulate": simulator.status(),
        "auto": auto.status(),
    }


@app.post("/api/auto")
def set_auto(body: dict = Body(default={})):
    clean = {}
    if "auto_fetch" in body:
        clean["auto_fetch"] = "1" if body.get("auto_fetch") else "0"
    if "auto_score" in body:
        clean["auto_score"] = "1" if body.get("auto_score") else "0"
    if "auto_fetch_hours" in body:
        clean["auto_fetch_hours"] = str(_int(body.get("auto_fetch_hours"), 4, 1, 168))
    if "auto_score_panel" in body:
        clean["auto_score_panel"] = str(_int(body.get("auto_score_panel"), 0, 0, 100))
    for k, v in clean.items():
        db.set_settings({k: v})
    return {"ok": True, "auto": auto.status()}


@app.post("/api/batch")
def start_batch(body: dict = Body(default={})):
    origin = body.get("origin")
    category = body.get("category")
    q = body.get("q")
    mode = "analyze" if body.get("mode") == "analyze" else "pipeline"
    limit = _int(body.get("limit"), 10, 1, 500)
    panel = _int(body.get("panel_size"), db.get_setting("panel_size") or 10, 0, 100)
    rows = db.ideas(origin or None, q or None, limit=limit, category=category or None)
    ids = [r["id"] for r in rows][:limit]
    if not ids:
        raise HTTPException(400, "No ideas match — fetch or widen the filter first.")
    if not batch.start_batch(ids, panel, mode=mode):
        raise HTTPException(409, "A batch is already running.")
    return {"ok": True, "queued": len(ids), "mode": mode}


@app.post("/api/categorize")
def categorize_all(body: dict = Body(default={})):
    only_missing = body.get("only_missing", True) is not False
    if not categorize.categorize_all_bg(only_missing=only_missing):
        raise HTTPException(409, "Categorization already running.")
    return {"ok": True}


@app.post("/api/generate")
def generate(body: dict = Body(default={})):
    n = _int(body.get("n"), 10, 1, 20)
    theme = (body.get("theme") or "").strip() or None
    if not ideagen.start_generation(n, theme):
        raise HTTPException(409, "Idea generation already running.")
    return {"ok": True, "n": n}


@app.post("/api/trends/{idea_id:path}")
def refresh_trend(idea_id: str):
    if not db.idea(idea_id):
        raise HTTPException(404, "Unknown idea")
    return {"ok": True, "trend": trends.refresh_idea(idea_id)}


@app.post("/api/simulate/{idea_id:path}")
def simulate(idea_id: str, body: dict = Body(default={})):
    try:
        sid = simulator.start_simulation(idea_id)
    except analyst.Busy as e:
        raise HTTPException(409, str(e))
    except ValueError as e:
        raise HTTPException(404, str(e))
    return {"ok": True, "simulation_id": sid}


@app.get("/api/simulations")
def list_simulations():
    out = []
    for s in db.simulations():
        if s.get("summary"):
            try:
                s["summary"] = json.loads(s["summary"])
            except (TypeError, json.JSONDecodeError):
                pass
        out.append(s)
    return {"simulations": out}


@app.post("/api/batch/stop")
def stop_batch():
    batch.stop_batch()
    return {"ok": True}


@app.get("/api/sources")
def list_sources():
    return {
        "builtins": sources.BUILTINS,
        "custom": db.custom_sources(),
        "archive_channels": sources.archive_channels(),
    }


@app.post("/api/sources/custom")
def add_custom_source(body: dict = Body(...)):
    kind = body.get("kind")
    if kind == "rss":
        url = (body.get("url") or "").strip()
        if not re.match(r"^https?://", url):
            raise HTTPException(400, "Enter a valid RSS/Atom feed URL (http/https).")
        name = (body.get("name") or url.split("//")[-1].split("/")[0])[:60]
        sid = db.add_custom_source("rss", name, url)
    elif kind == "archive-channel":
        ref = (body.get("ref") or "").strip()   # "<platform>:<username>"
        if ":" not in ref:
            raise HTTPException(400, "Pick a channel to import.")
        name = (body.get("name") or ref)[:60]
        sid = db.add_custom_source("archive-channel", name, ref)
    else:
        raise HTTPException(400, "kind must be 'rss' or 'archive-channel'")
    return {"ok": True, "id": sid}


@app.delete("/api/sources/custom")
def del_custom_source(id: int):
    db.remove_custom_source(id)
    return {"ok": True}


@app.post("/api/fetch-all")
def fetch_all():
    if not sources.fetch_all_bg():
        raise HTTPException(409, "A full fetch is already running.")
    return {"ok": True}


@app.post("/api/prune")
def prune():
    return {"ok": True, "removed": sources.prune_junk()}


@app.post("/api/engine/refresh")
def engine_refresh():
    return analyst.reset_engine()


@app.post("/api/fetch/{source}")
def fetch(source: str, body: dict = Body(default={})):
    if source not in ("hn", "ph", "rd", "ss"):
        raise HTTPException(400, "Unknown source")
    try:
        days = max(1, min(365, int(float(body.get("days") or 30))))
    except (TypeError, ValueError):
        days = 30
    try:
        min_points = max(0, int(float(body.get("min_points") or 20)))
    except (TypeError, ValueError):
        min_points = 20
    try:
        if source == "hn":
            n = sources.fetch_show_hn(days=days, min_points=min_points)
        elif source == "rd":
            n = sources.fetch_reddit(days=days, min_score=min_points)
        elif source == "ss":
            n = sources.fetch_starterstory_local()
        else:
            n = sources.fetch_product_hunt()
    except Exception as e:
        raise HTTPException(502, f"Fetch failed: {str(e)[:200]}")
    return {"ok": True, "fetched": n}


@app.post("/api/polish/{idea_id:path}")
def polish(idea_id: str):
    idea = db.idea(idea_id)
    if not idea:
        raise HTTPException(404, "Unknown idea")
    j = analyst.job_status()
    if j and j["state"] == "running":
        raise HTTPException(409, "A job is already running — wait for it.")
    try:
        spec = analyst.polish_core(idea)
    except analyst.LLMError as e:
        raise HTTPException(502, str(e))
    return {"ok": True, "polished": spec}


@app.get("/api/ideas")
def ideas(origin: str = None, q: str = None, category: str = None,
          sort: str = "rank", direction: str = "desc"):
    return {"ideas": db.ideas(origin or None, q or None, category=category or None,
                              sort=sort or "rank", direction=direction or "desc"),
            "total": db.count_ideas(origin or None, q or None, category or None),
            "source_counts": db.source_counts(),
            "categories": db.categories()}


@app.post("/api/ideas")
def add_custom_idea(body: dict = Body(...)):
    title = (body.get("title") or "").strip()
    desc = (body.get("description") or "").strip()
    if not title:
        raise HTTPException(400, "Give the idea a one-line title.")
    iid = "custom:" + hashlib.sha1(f"{title}\x1f{desc}".encode()).hexdigest()[:16]
    db.upsert_idea({"id": iid, "origin": "custom", "title": title[:300],
                    "description": desc[:4000], "url": None, "points": None,
                    "comments": None, "posted_at": None, "traction": 0})
    return {"ok": True, "id": iid}


@app.post("/api/analyze/{idea_id:path}")
def analyze(idea_id: str, body: dict = Body(default={})):
    panel = _panel_size(body)
    try:
        aid = analyst.start_analysis(idea_id, panel)
    except analyst.Busy as e:
        raise HTTPException(409, str(e))
    except ValueError as e:
        raise HTTPException(404, str(e))
    return {"ok": True, "analysis_id": aid}


@app.get("/api/ideas/{idea_id:path}/similar")
def similar(idea_id: str):
    return {"similar": db.similar_ideas(idea_id)}


@app.post("/api/plan/{idea_id:path}")
def make_plan(idea_id: str):
    try:
        pid = planner.start_plan(idea_id)
    except analyst.Busy as e:
        raise HTTPException(409, str(e))
    except ValueError as e:
        raise HTTPException(404, str(e))
    return {"ok": True, "plan_id": pid}


@app.post("/api/pipeline/{idea_id:path}")
def run_pipeline(idea_id: str, body: dict = Body(default={})):
    panel = _panel_size(body)
    try:
        ids = planner.start_pipeline(idea_id, panel)
    except analyst.Busy as e:
        raise HTTPException(409, str(e))
    except ValueError as e:
        raise HTTPException(404, str(e))
    return {"ok": True, **ids}


@app.get("/api/plans")
def list_plans():
    out = []
    for p in db.plans():
        for k in ("candidates", "judge_scores"):
            if p.get(k):
                try:
                    p[k] = json.loads(p[k])
                except (TypeError, json.JSONDecodeError):
                    pass
        out.append(p)
    return {"plans": out}


@app.get("/api/plans/{pid}/download")
def download_plan(pid: int):
    p = db.plan(pid)
    if not p or not p.get("final_plan"):
        raise HTTPException(404, "No finished plan with that id")
    safe = "".join(c if c.isalnum() or c in "-_" else "-" for c in (p.get("idea_id") or "plan"))[:40]
    return PlainTextResponse(
        p["final_plan"], media_type="text/markdown",
        headers={"Content-Disposition": f'attachment; filename="plan-{safe}-{pid}.md"'},
    )


@app.get("/api/analyses")
def list_analyses():
    out = []
    for a in db.analyses():
        for k in ("scores", "risks", "objections", "panel"):
            if a.get(k):
                try:
                    a[k] = json.loads(a[k])
                except (TypeError, json.JSONDecodeError):
                    pass
        out.append(a)
    return {"analyses": out}


@app.post("/api/settings")
def set_settings(body: dict = Body(...)):
    clean = {}
    if "panel_size" in body:
        clean["panel_size"] = _panel_size(body)
    db.set_settings(clean)
    return {"ok": True, "settings": db.all_settings()}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8319)
