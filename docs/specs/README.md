# Implementation Specs

**Purpose:** Detailed specs for things Allan, Marko, or experts execute. CEO designs the spec; whoever's in lane implements it.

**Pattern:** Each spec is self-contained — Allan opens 1 file and has everything needed (code, fields, copy, click-paths). No scrolling through 1,000-line playbooks.

---

## How specs differ from CEO.md / STATE.md / OPERATING-CONTEXT.md

| File | Contains | Read when |
|---|---|---|
| [CEO.md](../CEO.md) | Strategy, decisions, overrides, money plan, decision log | Starting any session, deciding anything |
| [STATE.md](../STATE.md) | Facts about the business (what's done, ❓ items) | Checking if X is set up yet |
| [OPERATING-CONTEXT.md](../OPERATING-CONTEXT.md) | Comprehensive reference doc | Need full context on a topic |
| [FUTURE-PLAN.md](../FUTURE-PLAN.md) | Phased task checklist | Planning multi-week work |
| **specs/*.md** | **Implementation detail — code, fields, copy, click-paths** | **Executing a specific decided task** |

---

## Index — every file in this directory (regenerated 2026-07-07 sync sweep)

> One line per file on disk. Status legend: **LIVE** (operating truth / built + running) · **LOCKED** (decision/spec locked, follow as written) · **SUPERSEDED** (in whole or part — read the banner inside) · **GATED** (blocked on an external gate) · **REF** (reference/artifact). For "is X live" the authority is always [STATE.md](../STATE.md). Superseded specs formerly here (master-setup-checklist, persistent-ceo-vps-deployment, dashboard-*) moved to [docs/archive/](../archive/README.md) 2026-07-07.

| File | What it is | Status |
|---|---|---|
| [COMPLETE-BUILD-PLAN-2026-06-12.md](COMPLETE-BUILD-PLAN-2026-06-12.md) | Completion-first master build plan v1.0 (phases 0-8), Cleo co-signed | LOCKED |
| [FINALIZATION-ROADMAP-2026-06-07.md](FINALIZATION-ROADMAP-2026-06-07.md) | Canonical human-readable finalization tracker (cockpit board mirrors it) | LIVE |
| [MASTER-FINALIZATION-MAP-2026-06-12.md](MASTER-FINALIZATION-MAP-2026-06-12.md) | The "everything" done/not-done map to a finalised full stack | LIVE |
| [agent-operating-principles.md](agent-operating-principles.md) | How the CEO/Manager/Expert/Auditor/AI-employee stack operates | LIVE (REF) |
| [ai-employees/](ai-employees/) | AI employee role specs (README + 6: competitive-intel, dm-handler, maintenance-reminder, materials-validator, pricing-researcher, trades-researcher) | REF (deploy per phases) |
| [bert-supplier.md](bert-supplier.md) | Bert Heynen / AUSTRS supplier relationship spec | LIVE |
| [contractor-app-blueprint-2026-06-05.md](contractor-app-blueprint-2026-06-05.md) | Contractor-VIEW app build blueprint (code in `contractor-app/`; Phases 1-4 deployed) | LIVE (building) |
| [decision-sm8-keep-vs-build-2026-06-05.md](decision-sm8-keep-vs-build-2026-06-05.md) | KEEP ServiceM8 + §SUB-ENGAGEMENT MODEL (single-account dispatch app; subs ≠ SM8 Staff) | LOCKED |
| [employee-transition-plan-2026-07-07.md](employee-transition-plan-2026-07-07.md) | Workforce plan: subbies now → Marko-trained employees when savings allow (ratified by Allan 2026-07-07) | LOCKED (canonical) |
| [ghl-pipeline-13-stage.md](ghl-pipeline-13-stage.md) | GHL pipeline + W-workflow specs (filename stale ×2 — canonical stage list = CEO.md Override 14 v4) | SUPERSEDED-IN-PART |
| [jordan-make-reference.md](jordan-make-reference.md) | Jordan/Surface Care Make blueprint as observed by Allan (primary source) | REF |
| [legal-review-brief-sub-engagement-2026-06-05.md](legal-review-brief-sub-engagement-2026-06-05.md) | Brief for the AU employment lawyer (Fair Work s15AA classification opinion) | GATED (⚖️ no sub signs until cleared) |
| [make-scenario-1-STATE-2026-06-04.md](make-scenario-1-STATE-2026-06-04.md) | Scenario 1 build-state handoff — wins over the build sheets where they differ | LIVE (Scenario 1 done + proven) |
| [make-scenario-1-datacapture-build.md](make-scenario-1-datacapture-build.md) | Per-job data-capture row (Google Sheet job log) | LOCKED + built |
| [make-scenario-1-findorcreate-build.md](make-scenario-1-findorcreate-build.md) | Find-or-create SM8 CLIENT (internal/invoicing-only) | SPEC READY — deferred |
| [make-scenario-1-main-build.md](make-scenario-1-main-build.md) | Scenario 1 "Main" build sheet v2 (GHL → SM8 job create) | Built (strip-contact banner overrides contact steps) |
| [make-scenario-1-safety-build.md](make-scenario-1-safety-build.md) | Scenario 1 SAFETY pass (secret gate, dedup, error→Slack) | LOCKED + built + verified |
| [make-scenario-2-3-backsync-build.md](make-scenario-2-3-backsync-build.md) | Completion loop: SM8 Completed → GHL Stage 15 (idempotent) | LOCKED; Scenario 3 built + proven |
| [make-scenario-4-5-accounts-build.md](make-scenario-4-5-accounts-build.md) | Financial close (Accounts pipeline; Xero invoices, GHL status, Stripe rail) | DESIGN — Scenario 4 buildable; 5 gated on Allan billing Qs |
| [multi-bathroom-fix-spec-2026-06-13.md](multi-bathroom-fix-spec-2026-06-13.md) | Option A: one GHL opp per bathroom (fixes the Mick overwrite bug) | LOCKED |
| [pricing-audit-2026-05-findings.md](pricing-audit-2026-05-findings.md) | Phase A pricing audit findings + applied changes (⚠️ its output `master-pricing-2026-05-01-audited.xlsx` is NOT on disk — flagged 2026-07-07 in data/README) | Done (REF) |
| [pricing-audit-2026-05.md](pricing-audit-2026-05.md) | Pricing audit methodology (⚠️ its 47% margin benchmark is superseded — honest ~25-44%, see memory/pricing-margin-calibration-2026-06-18) | SUPERSEDED-IN-PART |
| [quote-drafter-kit-2026-06-17.md](quote-drafter-kit-2026-06-17.md) | Manual quote-drafting kit + ideal-sub-rate costing rules (calibrated on a real job) | LIVE (quote WEB APP `docs/quote-app/` now does the drafting) |
| [scenario-matrix-2026-06-12.md](scenario-matrix-2026-06-12.md) | 64-scenario traceability matrix (appendix to the build plan) | REF |
| [servicem8-config-spec-2026-05-29.md](servicem8-config-spec-2026-05-29.md) | SM8 configuration (categories, queues, badges) | LOCKED (canonical) |
| [sim-report-2026-06-12.md](sim-report-2026-06-12.md) | 1,000-scenario coverage simulation report | REF (point-in-time) |
| [sim-results-2026-06-12.json](sim-results-2026-06-12.json) | Raw results for the sim report | REF (artifact) |
| [site-inspection-sub-led-spec.md](site-inspection-sub-led-spec.md) | Sub-led site inspections for big jobs (exception layer, not default) | GATED (Phase 2-3 sub density) |
| [sub-agreement-clauses.md](sub-agreement-clauses.md) | 32-clause Sprintlaw brief for the sub agreement (brief, NOT the contract) | GATED (⚖️ s15AA legal review before any signing) |
| [sub-rate-schedule.md](sub-rate-schedule.md) | Sub rate schedule + payment process | SUPERSEDED (cost figures — re-peg off Mick analysis + real quotes before ANY sub sees it) |
| [tech-stack-explainer.html](tech-stack-explainer.html) | Visual explainer of the tech stack | REF (artifact) |
| [timeless_job_log_template.csv](timeless_job_log_template.csv) | Column template for the per-job data-capture Sheet | REF (template) |

> **Planned-but-never-written specs** from the old index (form-auto-preselect, ghl-custom-fields, ghl-workflows, network-outreach-script, marko-first-job-prep, stripe-deposit-final-links, cloudinary-photo-upload, slack-channels-setup, dashboard-audit-and-connect, google-ads-campaign-structure, first-3-quotes-template, nps-routing-workflow, google-business-profile-posts, ai-quote-drafter-spec, plus the "future specs" list) were dropped from this index 2026-07-07 — most were absorbed into the build plan / roadmap / cockpit board or overtaken by shipped work (Cloudinary + Slack + form live; quote app built). If one becomes real, add it back as a file + row.

---

## Spec file template

Every spec follows this structure:

```markdown
# [Title]

**Purpose:** [one sentence]
**Owner:** [Allan / Marko / Coding expert / etc.]
**Phase:** [Phase 1 / 2 / etc.]
**Status:** Ready / In progress / Done
**Pairs with role:** [link to expert/auditor file]

## What I'm building
[One paragraph]

## Why
[One paragraph — links to CEO.md decision log if applicable]

## Steps (executable, click-by-click or code)
1. ...
2. ...

## Acceptance criteria
- [ ] X works when Y triggered
- [ ] Z passes audit

## Pitfalls / known issues
- ...

## References
- CEO.md decision log [link]
- Code path [link]
```

---

## How to use these specs

### As Allan (executor)
1. Read the spec end-to-end
2. Ask CEO if anything is unclear BEFORE starting
3. Tick acceptance criteria as you go
4. Tell CEO when done

### As CEO (designer)
1. Spec emerges from a decision in CEO.md
2. Build the spec file with full executable detail
3. Link spec from CEO.md decision log
4. Update STATE.md when execution complete

### As an expert (executor)
1. CEO sends the spec
2. Execute per the spec
3. Surface ambiguities back to CEO

---

*Specs are living. When reality differs from spec, update spec + tell CEO.*
