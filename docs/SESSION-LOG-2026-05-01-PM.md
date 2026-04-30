# Session Log — 2026-05-01 PM (Allan offline ~5hr)

**Started:** 2026-05-01 ~PM (after Jordan transcripts mining complete)
**Mode:** Allan offline 5hr → CEO works autonomous queue, follows Rules, commits audited batches, logs questions for return.
**Brief from Allan:** *"keep working on tasks until you dont know and have to ask and if you have to ask but it doesnt impact next part or process just keep working and add these infos of what you need and what you completed in a md file and collate all data after for me to see in the 5 hours ill be off and you can keep working - if not sure dont do , only do stuff you are confident and make sure to follow all rules and md files and refer to md files and commit when sure and audited ofc"*

**Operating principles (per this brief + CEO Rules):**
- Only do work I'm confident on. If not sure → don't do.
- Follow all Rules + MD files. Read fully per Rule 10.
- 3-lens audit per Rule 2 before each commit.
- Commit each audited batch (not one giant monolith).
- Questions that don't block next step → log here, keep working.
- Questions that block → log here as 🔴 BLOCKING, skip task, move on.

---

## Queue (planned for this 5hr block)

### A. Jordan transcripts integration (quick wins, ~30min)
1. [ ] Commit pending Rule 12 in CEO.md (already added pre-summary)
2. [ ] Add F11-F15 to FUTURE-PLAN.md with 3-lens audit
3. [ ] Add V56 funnel benchmark KPIs to CEO.md
4. [ ] Add maintenance-reminder + dm-handler to AI employee roster
5. [ ] Build maintenance-reminder.md spec (from V7 inspiration)
6. [ ] Build dm-handler.md spec (from V21 inspiration)
7. [ ] Commit batch A

### B. Sub-onboarding sheet migration (9 sheets — ~2hr)
8. [ ] Read all 9 extracted sheets (06, 07, 08, 09, 11, 12, 13, 14, 15)
9. [ ] Decide per sheet: full SOP / fold into existing / archive-only
10. [ ] Migrate with 3-lens audit (auditor-fair-work + auditor-compliance-aus + auditor-general-operational)
11. [ ] Commit batch B

### C. AI employee specs (~1hr)
12. [ ] Build materials-validator.md
13. [ ] Build competitive-intelligence.md
14. [ ] Build trades-researcher.md
15. [ ] Commit batch C

### D. GHL pipeline + workflow spec (~1hr)
16. [ ] Build ghl-pipeline-13-stage.md (from CEO.md Override 14 v2)
17. [ ] Document the 12 workflows + ageing rules
18. [ ] Commit batch D

### E. If time — QUOTE_OUTPUT_TEMPLATES migration
19. [ ] Read 14 sheets via openpyxl
20. [ ] Migrate to docs/specs/customer-templates-v1.md
21. [ ] Commit batch E

---

## Tasks I will NOT do (low confidence or blocked)

| Task | Reason for not doing |
|---|---|
| Execute pricing audit Phase A | Needs AI employee with web search tooling — spec is built, execution is a separate run that needs Allan to commission/run. Not autonomous via Claude Code. |
| Customer #1 quote draft | Blocked on Q14 (Marko's referrer customer details) — name, address, scope, photos all missing. |
| Build job-recipes/ folder per-SKU | Large effort + needs Allan input on which 5-10 SKUs to start with. Defer until Allan signals scope. |
| Modify actual GHL / Stripe / SM8 / live site | These are external configs, not Code-level edits I can make. |
| Approach legal questions (sham contracting test, SOPA application) without auditor confirmation | Have auditor-compliance-aus + auditor-fair-work files; will use them, but won't fabricate legal advice. Will cite NSW Acts + flag any uncertainty. |
| Edit sub-onboarding-master.md to include new SOPs without re-running its 3-lens audit | Master must be coherent — only update once new SOPs all done. |

---

## Open questions logged (non-blocking — keep working)

*Each: Question → Why I need it → What I'm assuming for now → Where I'd revise once Allan answers.*

### Q-NEW-1. NSW Long Service Corporation portable leave applicability
- **Why I need it:** Sub tax compliance — could trigger 0.35% levy obligation on all sub payments if applicable.
- **My assumption (per [sub-tax-compliance.md § C](sop/sub-tax-compliance.md)):** Likely doesn't apply to genuine independent contractors with own ABN + multiple clients + own tools.
- **Source for verification needed:** Allan calls **Long Service Corporation NSW** (13 14 41) or emails enquiries@longservice.nsw.gov.au with the question template I drafted in sub-tax-compliance.md.
- **Where I'd revise:** if applies → register as "building employer" + add 0.35% to sub cost calculation; rate schedule needs $X tagged for portable leave levy.
- **Blocking?** No — work continues; small calc adjustment if confirmed applies.

### Q-NEW-2. Sub rate validation against Marko's actual network
- **Why I need it:** [sub-rate-schedule.md](specs/sub-rate-schedule.md) numbers ($320-$650 regrout, $250-$800 resurface) are EXAMPLES from old draft Excel, not validated against Marko's real network.
- **My assumption:** Numbers are directionally reasonable based on Sydney market data, but need ±10-20% adjustment per actual sub conversations.
- **Source for verification needed:** Marko (already on QUESTIONS.md Q1).
- **Where I'd revise:** rate schedule + master pricing sub-labour column.
- **Blocking?** No — schedule marked DRAFT pending validation; no subs see it before Allan/Marko sign off.

### Q-NEW-3. Customizer ABN field for aftercare cards
- **Why I need it:** [customer-aftercare-cards.md](templates/customer-aftercare-cards.md) references `[ABN]` placeholder pulled from Customizer; current Customizer has phone + email + licence but not ABN field.
- **My assumption:** Allan adds ABN field to Customizer next time editing; until then, hardcode ABN in card variants.
- **Source for verification needed:** ABN is in [STATE.md](STATE.md) (already known); just needs Customizer field add.
- **Where I'd revise:** WordPress Customizer config in functions.php (small task — could do later in batch).
- **Blocking?** No — cards aren't being printed yet; add Customizer field when Allan ready.

---

## Commits made this session

*Append each commit hash + summary here for Allan's review.*

1. **9dee899** — `docs(jordan): integrate transcripts research — F11-F15 + V56 KPIs + 2 AI employees + Rule 12`
2. *(pending: Batch B — sub-onboarding sheets 06-09, 11-14 migration)*

---

## Files created / modified this session

### Batch A — Jordan transcripts integration (committed 9dee899)
- **NEW** `data/research/jordan-transcripts-mined-2026-05-01.md` — research output (already created pre-summary)
- **NEW** `docs/specs/ai-employees/maintenance-reminder.md` — full spec (V7 inspiration → seasonal nudge agent, $2-5/mo)
- **NEW** `docs/specs/ai-employees/dm-handler.md` — full spec (V21 inspiration → FB/IG DM-to-quote conversational agent, $5-10/mo)
- **NEW** `docs/SESSION-LOG-2026-05-01-PM.md` — this file
- **MODIFIED** `docs/FUTURE-PLAN.md` — added F11-F15 (AI Voice Driving, AI DM Handler, AI Voice Narration, Coordinator-model expansion, Franchise consideration) with failure modes + triggers
- **MODIFIED** `docs/CEO.md` — added Rule 12 (structured decisioning, pre-existing) + new section "KPI definitions + funnel benchmarks" with V56 Jordan benchmarks (13.7% form-fill, 72.3% quote-sent, 28.2% close)
- **MODIFIED** `docs/specs/ai-employees/README.md` — added 2 new employees to roster table

### Batch B — Sub-onboarding sheet migration (sheets 06-14, sheet 15 archive-only)
- **NEW** `docs/sop/sub-sham-contracting-protections.md` (sheet 06) — 9-indicator Fair Work + super test + audit cadence
- **NEW** `docs/sop/sub-ongoing-quality-monitoring.md` (sheet 07) — 9 monitoring systems + 3-stage removal + offboarding 10-step
- **NEW** `docs/sop/sub-risk-scenarios-playbook.md` (sheet 08) — 28 scenarios with action SOP + clause backing per scenario
- **NEW** `docs/sop/sub-recruitment-channels.md` (sheet 09) — 8 channels with compliance language + funnel benchmarks
- **NEW** `docs/sop/sub-tax-compliance.md` (sheet 11) — TPAR + super 3-part test + portable LSL
- **NEW** `docs/sop/sub-sopa-protections.md` (sheet 12) — NSW Security of Payment Act 1999 SOP + Clause 16 wording
- **NEW** `docs/specs/sub-rate-schedule.md` (sheet 13) — sub rate tables (DRAFT pending Marko validation) + 8-step payment SOP + callout/cancellation fees
- **NEW** `docs/templates/customer-aftercare-cards.md` (sheet 14 section A) — A5 card templates with ACCC-compliant warranty wording
- **NEW** `docs/templates/recruitment-ads.md` (sheet 14 section B) — ad copy per channel with Fair Work compliance audit checklist
- **MODIFIED** `docs/sop/sub-onboarding-master.md` — references table updated with all 9 new docs grouped pre-live / live / lenses
- Sheet 15 (audit log) → archive-only; verifies source Excel completeness; not migrated as ongoing operating doc

---

## Decisions made + reasoning (for Allan to override if disagrees)

### Decision A1: F14 "Stealth-expansion" reframed as "Coordinator-model expansion"
- **What Jordan said:** *"We literally just stole someone's business"*
- **What I wrote in our doc:** "We coordinate, specialist subs fulfil, fair margin to specialist sub. We add value via better customer experience + admin + lead gen."
- **Why I reframed:** Three reasons:
  1. ACCC misleading-conduct exposure if we describe ourselves as "stealing" externally
  2. Brand reputation — sub recruits read our docs once we hire; "ethics-flexible" framing damages us
  3. Operationally identical, ethically cleaner — our agency model already does this; we'd just extend it
- **Lens audit:** customer-fairness (cleaner narrative) + auditor-fair-work (sub gets fair share, not just used)
- **Alternative considered (Rule 12):** Keep Jordan's framing as-is, treat doc as private-only. Rejected because docs leak (employees, future hires, even legal discovery) — write nothing in writing you wouldn't want repeated.
- **Override path:** if Allan prefers Jordan's exact framing, easy edit. But CEO recommendation: keep coordinator-model framing.

### Decision A2: V56 funnel benchmarks set as Year 1 targets, not stretch
- **What:** 13% form-fill / 70% quote-sent / 28% close = our Year 1 targets, matching Jordan
- **Could have made them stretch:** "We should beat Jordan since we're new, optimised funnel, faster"
- **Why I didn't:** Jordan operates in mature market with brand recognition; first-year operator with no reviews/brand will struggle to match him. Setting Year 1 = match Jordan is realistic stretch; Year 2+ = beat Jordan is ambitious-but-fair
- **Lens:** auditor-margin-per-job (under-shooting Year 1 targets → quietly missing revenue without alarm; setting too high = constant fail-state demoralises)

### Decision A3: New AI employee specs follow same template as pricing-researcher.md
- **Template sections:** Identity / Job / Research mandate / Output / Tooling / CEO commission / Maintenance / Future enhancements / References
- **Why:** consistency makes them easier to reason about as a system; deviations get audited
- **Confidence:** HIGH — template proven on pricing-researcher build

### Decision A4: dm-handler.md AI disclosure rule = transparent
- **Customer asks "are you AI?" → reply truthfully**
- **Why:** ACCC misleading-conduct (ACL s18) exposure if we lie; customer trust collapses if found out; brand damage compounds. Transparent disclosure is also Meta's emerging best-practice.
- **Trade-off:** some customers will disengage on knowing it's AI. Acceptable cost for compliance + trust.

---

## Status when Allan returns

*Update at end of session — Batch A done, moving to Batch B sub-onboarding migration.*
