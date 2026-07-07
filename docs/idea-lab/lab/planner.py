"""Full-plan generator: candidates → blind judge panel → synthesized final plan.

Bias control: three plan candidates are generated from deliberately different
strategic postures, then judged as anonymous options A/B/C (posture labels
stripped) by three independent judge lenses on a fixed rubric. The final plan
synthesizes the winner plus the judges' criticisms — with the scoreboard kept
in the output so the choice is auditable.
"""
import json
import threading
import traceback
from datetime import date

from . import analyst, db

POSTURES = [
    ("lean", "Bootstrapped & lean",
     "Minimal build (no-code/low-code where sane), niche-first, fastest path to first "
     "paying customer, founder does sales, spend almost nothing."),
    ("product", "Product-led",
     "Proper engineered product, self-serve onboarding, free tier or trial, "
     "content/SEO/community-driven growth, optimise for scalable adoption."),
    ("vertical", "Sales-led vertical",
     "Go deep on ONE vertical, higher price point, white-glove onboarding, direct "
     "outbound + partnerships/integrations as the channel."),
]

JUDGE_LENSES = [
    ("cto", "a skeptical CTO who has shipped 20 products and watched most stacks rot; "
            "cares about feasibility, hidden complexity, and maintenance cost"),
    ("growth", "a growth strategist who has taken 30 SaaS products to market; cares "
               "about channel-economics, CAC reality, and whether the marketing plan "
               "survives contact with an ignored inbox"),
    ("founder", "a bootstrapped founder at $50k MRR who has also failed twice; cares "
                "about cash reality, time-to-revenue, and founder workload"),
]

RUBRIC = ["realism", "cost_accuracy", "speed_to_revenue", "gtm_strength",
          "pricing_soundness", "risk_management"]


def _candidate_prompt(idea, posture_brief):
    return f"""You are drafting ONE candidate execution plan for this business idea.
Today is {date.today().isoformat()}. Be concrete and realistic — numbers over adjectives.
Strategic posture you MUST follow for this candidate: {posture_brief}

{analyst._idea_block(idea)}

Reply with ONLY this JSON:
{{
 "summary": "<2 sentences: the plan in a nutshell>",
 "build_method": "<how to build it this way and why>",
 "stack": ["<specific tools/tech, e.g. 'Next.js + Supabase', 'Bubble', 'Twilio'>"],
 "mvp_scope": ["<the 3-6 things v1 does — and nothing else>"],
 "pricing": {{"model": "<subscription/usage/one-off/tiered>",
   "tiers": [{{"name": "<tier>", "price": "<e.g. $79/mo>", "for": "<who>"}}],
   "rationale": "<why these price points, anchored to value/alternatives>"}},
 "icp": {{"primary": "<the exact first customer profile>",
   "secondary": "<expansion profile>",
   "where_they_are": ["<specific channels/communities/places to reach them>"]}},
 "marketing": [{{"channel": "<channel>", "why": "<why it fits>",
   "first_step": "<the literal first action>", "expected_cac": "<$ guess>"}}],
 "roadmap_90d": [{{"weeks": "1-2", "goal": "<goal>", "steps": ["<step>", "..."]}}],
 "costs": {{"build_usd": <number>, "monthly_burn_usd": <number>}},
 "time_to_first_revenue_weeks": <number>,
 "metrics": ["<the 3-5 numbers to watch>"],
 "risks": ["<top 3 risks OF THIS APPROACH>"]
}}"""


def _judge_prompt(idea, lens_desc, anon_candidates):
    cands = json.dumps(anon_candidates, indent=1)[:14000]
    rubric = ", ".join(RUBRIC)
    return f"""You are {lens_desc}. Today is {date.today().isoformat()}.
Three anonymous execution plans (A, B, C) were proposed for the same idea. Judge them
on substance only — no option is "yours"; be ready to trash all three.

{analyst._idea_block(idea)}

PLANS:
{cands}

Score each plan 0-10 on each criterion: {rubric}.
Reply with ONLY this JSON:
{{
 "scores": {{"A": {{"realism": <0-10>, "cost_accuracy": <0-10>, "speed_to_revenue": <0-10>,
             "gtm_strength": <0-10>, "pricing_soundness": <0-10>, "risk_management": <0-10>}},
            "B": {{...}}, "C": {{...}}}},
 "notes": {{"A": "<one blunt sentence>", "B": "<...>", "C": "<...>"}},
 "pick": "<A|B|C>",
 "fix": "<the single biggest fix you'd demand of the winning plan>"
}}"""


def _synthesis_prompt(idea, winner_label, winner, others, judge_notes, scoreboard):
    return f"""You are the lead strategist writing the FINAL execution plan. Today is
{date.today().isoformat()}. A judged tournament already happened: plan {winner_label} won.
Synthesize the definitive plan: keep the winner's core, apply the judges' demanded fixes,
and steal any clearly-better elements from the losing plans. Stay realistic — this will
be executed by a small team with limited cash. No hype.

{analyst._idea_block(idea)}

WINNING PLAN:
{json.dumps(winner, indent=1)[:8000]}

LOSING PLANS (steal their best parts only):
{json.dumps(others, indent=1)[:6000]}

JUDGE VERDICTS:
{json.dumps(judge_notes, indent=1)[:3000]}

Write the final plan as clean Markdown with EXACTLY these sections:
# <idea title> — Execution Plan
## Executive summary
## Target customer
## Build method & stack   (state what was chosen over what, and why)
## MVP scope
## Pricing                (specific price points + rationale)
## Marketing plan         (channels in priority order, first actions, rough budget)
## 90-day roadmap         (week-by-week steps)
## Costs & break-even
## Metrics to watch
## Risks & mitigations
Keep it under ~1200 words. Concrete numbers wherever possible.
Reply with ONLY the Markdown (no JSON, no preamble)."""


# ---------- orchestration (shares the analyst's single job slot) ----------

def start_plan(idea_id):
    idea = db.idea(idea_id)
    if not idea:
        raise ValueError("Unknown idea")
    with analyst._lock:
        if analyst._job and analyst._job["state"] == "running":
            raise analyst.Busy("An analysis/plan is already running — wait for it.")
        analyst._job = {"state": "running", "idea_id": idea_id, "kind": "plan",
                        "title": idea["title"][:80], "phase": "starting", "plan_id": None}
    try:
        pid = db.new_plan(idea_id)
        analyst._set(plan_id=pid)
        threading.Thread(target=_run, args=(pid, idea), daemon=True).start()
        return pid
    except BaseException as e:   # never wedge the slot on a failed start
        analyst._set(state="error", phase=f"failed to start: {str(e)[:120]}")
        raise


def start_pipeline(idea_id, panel_size):
    """Start-to-finish: analysis (scorecard + panel) then the full plan, one job."""
    idea = db.idea(idea_id)
    if not idea:
        raise ValueError("Unknown idea")
    with analyst._lock:
        if analyst._job and analyst._job["state"] == "running":
            raise analyst.Busy("A job is already running — wait for it.")
        analyst._job = {"state": "running", "idea_id": idea_id, "kind": "pipeline",
                        "title": idea["title"][:80], "phase": "starting"}
    try:
        aid = db.new_analysis(idea_id, panel_size)
        pid = db.new_plan(idea_id)
        analyst._set(analysis_id=aid, plan_id=pid)

        def _go():
            try:
                analyst._analyze_core(aid, idea, panel_size)
                _plan_core(pid, idea)
                analyst._set(state="done", phase="done")
            except Exception as e:
                traceback.print_exc()
                analyst._set(state="error", phase=str(e)[:160])  # free slot FIRST
                try:
                    for fn, rid in ((db.update_analysis, aid), (db.update_plan, pid)):
                        row = db.analysis(rid) if fn is db.update_analysis else db.plan(rid)
                        if row and row.get("status") == "running":
                            fn(rid, status="error", error=str(e)[:500])
                except Exception:
                    traceback.print_exc()
            finally:
                with analyst._lock:
                    if analyst._job and analyst._job.get("state") == "running":
                        analyst._job.update(state="error", phase="worker exited unexpectedly")

        threading.Thread(target=_go, daemon=True).start()
        return {"analysis_id": aid, "plan_id": pid}
    except BaseException as e:   # never wedge the slot on a failed start
        analyst._set(state="error", phase=f"failed to start: {str(e)[:120]}")
        raise


def _run(pid, idea):
    try:
        _plan_core(pid, idea)
        analyst._set(state="done", phase="done")
    except Exception as e:
        traceback.print_exc()
        analyst._set(state="error", phase=str(e)[:160])  # free slot FIRST
        try:
            db.update_plan(pid, status="error", error=str(e)[:500])
        except Exception:
            traceback.print_exc()
    finally:
        with analyst._lock:
            if analyst._job and analyst._job.get("state") == "running":
                analyst._job.update(state="error", phase="worker exited unexpectedly")


def _plan_core(pid, idea):
    if True:  # keep original indentation of the tournament body below
        labels = ["A", "B", "C"]
        candidates = {}
        for i, (key, name, brief) in enumerate(POSTURES):
            analyst._set(phase=f"drafting candidate {i + 1}/3 ({name})")
            cand = analyst._llm_json(_candidate_prompt(idea, brief))
            if not isinstance(cand, dict):
                raise analyst.LLMError(f"candidate {labels[i]} was not a JSON object")
            cand["_posture"] = name
            candidates[labels[i]] = cand
            db.update_plan(pid, candidates=candidates)  # persist as we go — partial > nothing

        # judges see the plans anonymised — posture names stripped
        anon = {L: {k: v for k, v in c.items() if k != "_posture"}
                for L, c in candidates.items()}
        totals = {L: 0 for L in labels}
        judge_notes = {}
        picks = {}
        for j, (jkey, lens) in enumerate(JUDGE_LENSES):
            analyst._set(phase=f"judging {j + 1}/3 ({jkey})")
            try:
                verdict = analyst._llm_json(_judge_prompt(idea, lens, anon))
                if not isinstance(verdict, dict):
                    raise analyst.LLMError("judge reply was not a JSON object")
                vscores = verdict.get("scores") if isinstance(verdict.get("scores"), dict) else {}
                for L in labels:
                    s = vscores.get(L) if isinstance(vscores.get(L), dict) else {}
                    totals[L] += sum(
                        max(0.0, min(10.0, analyst._to_num(s.get(c), 0.0))) for c in RUBRIC
                    )
            except analyst.LLMError:
                continue  # one lost/malformed judge shouldn't kill the tournament
            judge_notes[jkey] = {"notes": verdict.get("notes"),
                                 "pick": verdict.get("pick"), "fix": verdict.get("fix")}
            picks[jkey] = verdict.get("pick")
        if not judge_notes:
            raise analyst.LLMError("all three judges failed")
        winner = max(totals, key=totals.get)
        db.update_plan(pid, judge_scores={"totals": totals, "judges": judge_notes,
                                          "picks": picks},
                       winner=f"{winner} — {candidates[winner]['_posture']}")

        analyst._set(phase="synthesizing final plan")
        others = {L: anon[L] for L in labels if L != winner}
        scoreboard = json.dumps(totals)
        final_md = analyst._run_llm(_synthesis_prompt(
            idea, winner, anon[winner], others, judge_notes, scoreboard))
        # append the auditable scoreboard so the choice is transparent
        audit = ["\n---\n## How this plan was chosen",
                 f"Three candidate plans were generated ({', '.join(n for _, n, _ in POSTURES)}), "
                 "judged blind (A/B/C) by three independent lenses on a fixed rubric "
                 f"({', '.join(RUBRIC)}; max {len(JUDGE_LENSES) * len(RUBRIC) * 10} points)."]
        for L in labels:
            mark = " ← winner" if L == winner else ""
            audit.append(f"- **{L} ({candidates[L]['_posture']})**: {round(totals[L], 1)} points{mark}")
        for jkey, jn in judge_notes.items():
            audit.append(f"- Judge *{jkey}* picked **{jn.get('pick')}** — fix demanded: {jn.get('fix')}")
        audit.append("\n*AI-generated estimate for planning — validate pricing and demand "
                     "with real customers before committing serious money.*")
        db.update_plan(pid, final_plan=final_md + "\n" + "\n".join(audit), status="done")
