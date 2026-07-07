"""The analyst engine: LLM-scored 12-factor scorecard + persona panel.

LLM calls go through the local Codex CLI in read-only mode (uses the Mac's
existing Codex login — no API keys stored here). One analysis job at a time.
"""
import json
import re
import subprocess
import tempfile
import threading
import traceback
from datetime import date
from pathlib import Path
from statistics import median

from . import db

BASE_DIR = Path(__file__).resolve().parent.parent
LLM_TIMEOUT = 300  # seconds per call

# ---------- scoring model ----------
# Weights sum to 100. Informed by how VCs / analysts actually triage:
# problem+market dominate; execution factors matter but rank lower.
FACTORS = [
    ("problem_severity",  12, "How painful/urgent is the problem? Painkiller vs vitamin."),
    ("market_size",       12, "Realistic TAM/SAM for this wedge, not the hype number."),
    ("timing",             8, "Why now — tech/regulatory/behaviour shift enabling it."),
    ("competition",       10, "Saturation & strength of incumbents (10 = open field)."),
    ("moat",               8, "Durable differentiation: data, network effects, switching costs."),
    ("monetization",      10, "Clarity of who pays, how, and willingness to pay."),
    ("profitability",      8, "Unit economics / margin structure at scale."),
    ("distribution",      10, "Go-to-market difficulty (10 = obvious cheap channel)."),
    ("build_complexity",   6, "Ease of building an MVP (10 = a weekend, 1 = years/deep-tech)."),
    ("solo_feasibility",   4, "Can a solo founder / tiny team realistically run this?"),
    ("vc_fundability",     6, "Would a competent seed VC take the meeting? Scale potential."),
    ("risk",               6, "Inverse of platform/regulatory/key-man risk (10 = low risk)."),
]

VERDICTS = ("strong", "promising", "average", "weak", "avoid")


# ---------- persona bank (100 viewpoints) ----------
def _mk(prefix, items):
    return [f"{prefix}{i}" for i in items]

PERSONAS = (
    # 40 small-business / operator customers
    _mk("Owner: ", [
        "bathroom-resurfacing trade business (2 crews, AU)", "plumbing company (8 staff)",
        "solo electrician who hates admin", "landscaping business (seasonal cashflow)",
        "cleaning company (20 casual staff)", "small cafe (thin margins)",
        "restaurant group (3 venues)", "boutique gym", "hair salon chain (4 sites)",
        "e-commerce store on Shopify ($40k/mo)", "Amazon FBA seller", "Etsy handmade seller",
        "digital marketing agency (6 people)", "SEO consultancy", "video production studio",
        "bookkeeping practice", "small accounting firm", "solo mortgage broker",
        "real-estate agency principal", "property manager (300 doors)",
        "dental practice", "physiotherapy clinic", "veterinary clinic",
        "childcare centre", "tutoring business", "driving school",
        "food truck", "wedding photographer", "event hire company",
        "commercial printer", "sign-writing shop", "auto repair workshop",
        "mobile mechanic", "pest control operator", "security installation firm",
        "pool maintenance route", "courier fleet (5 vans)", "removalist company",
        "custom furniture maker", "microbrewery",
    ]) +
    # 25 professionals / ICs
    _mk("Professional: ", [
        "senior backend engineer", "junior frontend dev", "staff data scientist",
        "DevOps/SRE lead", "product manager at a scale-up", "UX designer",
        "growth marketer", "content marketer", "paid-ads specialist",
        "sales rep (B2B SaaS)", "customer success manager", "recruiter",
        "HR manager (200-person co)", "CFO of a mid-market firm", "financial analyst",
        "lawyer at a small firm", "paralegal", "GP doctor", "nurse manager",
        "high-school teacher", "university lecturer", "research scientist",
        "journalist", "freelance copywriter", "virtual assistant",
    ]) +
    # 20 consumers
    _mk("Consumer: ", [
        "busy parent of three", "college student on a budget", "retiree learning tech",
        "fitness enthusiast", "home cook", "avid gamer", "frequent business traveller",
        "backpacker", "new homeowner renovating", "renter in a big city",
        "hobbyist photographer", "weekend DIYer", "dog owner", "language learner",
        "personal-finance nerd", "privacy-conscious user who avoids big tech",
        "creator with 50k TikTok followers", "podcast listener 2h/day",
        "person with ADHD who abandons apps", "non-technical 60-year-old",
    ]) +
    # 15 investors / experts / skeptics
    _mk("Expert: ", [
        "seed-stage VC partner", "angel investor (ex-founder)", "PE operator focused on margins",
        "growth-stage VC associate", "startup CTO who has seen 5 pivots",
        "serial founder (2 exits, 1 failure)", "indie hacker at $30k MRR",
        "YC-alum founder", "product-led-growth consultant",
        "churned SaaS buyer burned by tools that overpromise",
        "IT manager with a frozen budget", "security auditor",
        "regulatory compliance officer", "skeptical procurement lead",
        "small-business coach who's watched 100 clients fail",
    ])
)
assert len(PERSONAS) == 100, f"persona bank must be exactly 100, got {len(PERSONAS)}"


# ---------- codex runner ----------

class LLMError(Exception):
    pass


def _run_llm(prompt):
    """Run one codex call, return the final message text."""
    with tempfile.NamedTemporaryFile(suffix=".txt", delete=False) as f:
        out_path = f.name
    try:
        proc = subprocess.run(
            ["codex", "exec", "--sandbox", "read-only", "--skip-git-repo-check",
             "--output-last-message", out_path, prompt],
            stdin=subprocess.DEVNULL,           # codex hangs waiting on stdin otherwise
            capture_output=True, text=True, timeout=LLM_TIMEOUT, cwd=str(BASE_DIR),
        )
        text = Path(out_path).read_text(encoding="utf-8").strip()
        if proc.returncode != 0 and not text:
            raise LLMError(f"codex exited {proc.returncode}: {proc.stderr[-300:]}")
        if not text:
            raise LLMError("codex returned no output")
        return text
    except subprocess.TimeoutExpired:
        raise LLMError(f"codex timed out after {LLM_TIMEOUT}s")
    finally:
        Path(out_path).unlink(missing_ok=True)


def _json_from(text):
    """Extract the first JSON object/array from LLM output (tolerates fences/prose).

    Picks whichever bracket appears FIRST in the text — preferring '{' would
    truncate a JSON array to its first element.
    """
    text = re.sub(r"^```(?:json)?|```$", "", text.strip(), flags=re.M).strip()
    starts = [(pos, o, c) for o, c in (("{", "}"), ("[", "]"))
              if (pos := text.find(o)) != -1]
    for start, opener, closer in sorted(starts):
        depth = 0
        in_str = False
        esc = False
        for i in range(start, len(text)):
            ch = text[i]
            if esc:
                esc = False
                continue
            if ch == "\\":
                esc = True
            elif ch == '"':
                in_str = not in_str
            elif not in_str:
                if ch == opener:
                    depth += 1
                elif ch == closer:
                    depth -= 1
                    if depth == 0:
                        try:
                            return json.loads(text[start:i + 1])
                        except json.JSONDecodeError:
                            break
    raise LLMError(f"no parsable JSON in LLM output: {text[:200]}")


def _llm_json(prompt, retries=1):
    last = None
    for _ in range(retries + 1):
        try:
            return _json_from(_run_llm(prompt))
        except LLMError as e:
            last = e
    raise last


# ---------- prompts ----------

def _scorecard_prompt(idea_row):
    factor_lines = "\n".join(
        f'- "{k}" (weight {w}): {d}' for k, w, d in FACTORS
    )
    metrics = ""
    if idea_row.get("points") is not None:
        metrics = (f"Launch traction: {idea_row.get('points')} upvotes, "
                   f"{idea_row.get('comments')} comments, posted {idea_row.get('posted_at')}.")
    return f"""You are a brutally honest startup analyst combining the lenses of a seed VC,
a data analyst, and an experienced bootstrapped founder. Today is {date.today().isoformat()}.
Evaluate this business idea/product using your market knowledge. Be skeptical of hype;
reward evidence. Do NOT browse; reason from what you know.

IDEA: {idea_row['title']}
DESCRIPTION: {idea_row.get('description') or '(none provided)'}
URL: {idea_row.get('url') or '(none)'}
{metrics}

Score each factor 0-10 (10 = excellent for a new entrant building this TODAY):
{factor_lines}

Reply with ONLY this JSON (no prose, no markdown):
{{
 "scores": {{"<factor>": {{"score": <0-10>, "note": "<one sharp sentence>"}}, ...all 12...}},
 "composite": <0-100: the weighted sum — score/10 * weight, summed>,
 "verdict": "<one of: strong|promising|average|weak|avoid>",
 "thesis": "<3-4 sentence analyst thesis: what this is, who pays, why it wins or dies>",
 "risks": ["<top risk>", "<second>", "<third>"],
 "wedge": "<the single sharpest go-to-market wedge you'd recommend>"
}}"""


def _panel_prompt(idea_row, personas):
    plist = "\n".join(f"{i+1}. {p}" for i, p in enumerate(personas))
    return f"""Role-play each persona below INDEPENDENTLY and honestly react to this product idea.
Cynicism is allowed — most people ignore most products. Today is {date.today().isoformat()}.

IDEA: {idea_row['title']}
DESCRIPTION: {idea_row.get('description') or '(none)'}

PERSONAS:
{plist}

For EACH persona reply how they would genuinely react. Reply with ONLY a JSON array,
one object per persona, same order:
[{{"persona": "<short name>", "would_use": true/false, "would_pay": true/false,
  "price_month": <realistic USD/month they'd pay, 0 if none>,
  "objection": "<their biggest objection, one short sentence>"}}, ...]"""


# ---------- job orchestration (one at a time) ----------

_lock = threading.Lock()
_job = None


class Busy(Exception):
    pass


def job_status():
    with _lock:
        return dict(_job) if _job else None


def _set(**kw):
    with _lock:
        if _job is not None:
            _job.update(kw)


def start_analysis(idea_id, panel_size):
    global _job
    idea_row = db.idea(idea_id)
    if not idea_row:
        raise ValueError("Unknown idea")
    with _lock:
        if _job and _job["state"] == "running":
            raise Busy("An analysis is already running — wait for it to finish.")
        _job = {"state": "running", "idea_id": idea_id, "title": idea_row["title"][:80],
                "phase": "starting", "analysis_id": None}
    aid = db.new_analysis(idea_id, panel_size)
    _set(analysis_id=aid)
    threading.Thread(target=_run, args=(aid, idea_row, panel_size), daemon=True).start()
    return aid


def _run(aid, idea_row, panel_size):
    try:
        _set(phase="scorecard (expert analyst)")
        card = _llm_json(_scorecard_prompt(idea_row))
        scores = card.get("scores") or {}
        # recompute composite ourselves — don't trust LLM arithmetic
        composite = 0.0
        for key, weight, _ in FACTORS:
            s = scores.get(key, {})
            composite += max(0.0, min(10.0, float(s.get("score", 0)))) / 10.0 * weight
        verdict = card.get("verdict") if card.get("verdict") in VERDICTS else "average"
        db.update_analysis(aid, scores=scores, composite=round(composite, 1),
                           verdict=verdict, thesis=card.get("thesis") or "",
                           risks=card.get("risks") or [], wedge=card.get("wedge") or "")

        # persona panel, batched 10 per LLM call
        panel_size = max(0, min(100, int(panel_size)))
        picked = PERSONAS[:panel_size]
        results = []
        for i in range(0, len(picked), 10):
            batch = picked[i:i + 10]
            _set(phase=f"persona panel ({min(i + 10, len(picked))}/{len(picked)})")
            try:
                out = _llm_json(_panel_prompt(idea_row, batch))
                if isinstance(out, dict):   # model answered for a single persona
                    out = [out]
                if isinstance(out, list):
                    results.extend(out[:len(batch)])
            except LLMError:
                continue  # a lost batch shouldn't kill the run
        if results:
            users = [r for r in results if r.get("would_use")]
            payers = [r for r in results if r.get("would_pay")]
            prices = [float(r.get("price_month") or 0) for r in payers
                      if (r.get("price_month") or 0) > 0]
            objections = [r.get("objection", "").strip() for r in results
                          if not r.get("would_use") and r.get("objection")]
            db.update_analysis(
                aid, panel=results,
                adoption=round(100 * len(users) / len(results), 1),
                pay_rate=round(100 * len(payers) / len(results), 1),
                price_med=round(median(prices), 2) if prices else 0,
                objections=objections[:8],
            )
        db.update_analysis(aid, status="done")
        _set(state="done", phase="done")
    except Exception as e:
        traceback.print_exc()
        db.update_analysis(aid, status="error", error=str(e)[:500])
        _set(state="error", phase=str(e)[:160])
