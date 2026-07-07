"""Idea Lab — scrape launch platforms, rank ideas, stress-test with an AI panel.

Run:  .venv/bin/python server.py   →   http://127.0.0.1:8319
"""
import hashlib
import json
from pathlib import Path

import uvicorn
from fastapi import Body, FastAPI, HTTPException
from fastapi.responses import HTMLResponse, PlainTextResponse

from lab import analyst, db, sources

BASE = Path(__file__).resolve().parent

app = FastAPI(title="Idea Lab")


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
        "counts": {o: len(db.ideas(origin=o)) for o in ("hn", "ph", "custom")},
    }


@app.post("/api/fetch/{source}")
def fetch(source: str, body: dict = Body(default={})):
    try:
        if source == "hn":
            n = sources.fetch_show_hn(days=int(body.get("days", 30)),
                                      min_points=int(body.get("min_points", 20)))
        elif source == "ph":
            n = sources.fetch_product_hunt()
        else:
            raise HTTPException(400, "Unknown source")
    except Exception as e:
        raise HTTPException(502, f"Fetch failed: {str(e)[:200]}")
    return {"ok": True, "fetched": n}


@app.get("/api/ideas")
def ideas(origin: str = None, q: str = None):
    return {"ideas": db.ideas(origin or None, q or None)}


@app.post("/api/ideas")
def add_custom_idea(body: dict = Body(...)):
    title = (body.get("title") or "").strip()
    desc = (body.get("description") or "").strip()
    if not title:
        raise HTTPException(400, "Give the idea a one-line title.")
    iid = "custom:" + hashlib.sha1((title + desc).encode()).hexdigest()[:16]
    db.upsert_idea({"id": iid, "origin": "custom", "title": title[:300],
                    "description": desc[:4000], "url": None, "points": None,
                    "comments": None, "posted_at": None, "traction": 0})
    return {"ok": True, "id": iid}


@app.post("/api/analyze/{idea_id:path}")
def analyze(idea_id: str, body: dict = Body(default={})):
    panel = int(body.get("panel_size") or db.get_setting("panel_size") or 20)
    try:
        aid = analyst.start_analysis(idea_id, panel)
    except analyst.Busy as e:
        raise HTTPException(409, str(e))
    except ValueError as e:
        raise HTTPException(404, str(e))
    return {"ok": True, "analysis_id": aid}


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
    db.set_settings(body)
    return {"ok": True, "settings": db.all_settings()}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8319)
