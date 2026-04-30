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

## Active specs (built ✅ / pending ⬜)

| Spec | Status | Purpose | Phase | Owner |
|---|---|---|---|---|
| ✅ [form-auto-preselect.md](form-auto-preselect.md) | Ready | Quote form pre-fills service based on landing page URL | Week 2-3 | Allan |
| ⬜ ghl-custom-fields.md | Pending | Click-by-click GHL setup for all 40+ custom fields | Week 1-2 | Allan (CEO designs) |
| ⬜ ghl-workflows.md | Pending | All 12 GHL automation workflow specs (triggers, actions, conditions) | Week 2-3 | Allan (CEO designs) |
| ⬜ ghl-pipeline.md | Pending | 17-stage pipeline setup spec | Week 1 | Allan (CEO designs) |
| ⬜ network-outreach-script.md | Pending | Exact SMS + DM scripts for Allan + Marko's network outreach | Week 1 | Both founders |
| ⬜ marko-first-job-prep.md | Pending | Checklist + materials list + customer comms for Marko's first solo jobs | Week 3-4 | Marko |
| ⬜ sub-onboarding-checklist.md | Pending | Per-sub onboarding executable checklist (per Override 9 timing) | Month 2 | Marko |
| ⬜ stripe-deposit-final-links.md | Pending | Stripe Checkout dynamic link configuration | Week 2-3 | Allan |
| ⬜ cloudinary-photo-upload.md | Pending | Quote form photo URL pipeline implementation | Week 2 | Allan |
| ⬜ slack-channels-setup.md | Pending | Channel creation + integration with GHL | Week 2 | Allan |
| ⬜ dashboard-audit-and-connect.md | Pending | Audit timeless-dash repo + plan GHL/Stripe → Supabase webhooks | After GitHub access | Coding expert (CEO directs) |
| ⬜ google-ads-campaign-structure.md | Pending | Campaign / ad group / keyword setup per Override 4 + 10 | Phase 2 | Allan |
| ⬜ first-3-quotes-template.md | Pending | 3-tier quote templates for shower regrout / bath resurface / full bathroom | Week 2-3 | Allan |
| ⬜ npS-routing-workflow.md | Pending | NPS detection + service recovery + review request workflow | Phase 4 | Allan |
| ⬜ google-business-profile-posts.md | Pending | Weekly GBP post template + content calendar | Week 2 onwards | Allan |
| ⬜ ai-quote-drafter-spec.md | Pending | Spec for the AI quote drafter agent | Week 4-5 | AI ops expert |

## Future specs (built when phase activates)

- bert-supplier-conversation-questions.md (after CEO learns what Bert supplies)
- pricing-tier-confirmation.md (after Allan provides T1/T2/T3 numbers)
- builder-licence-decision.md (after Fair Trading call outcome)
- subcontractor-agreement.md (engaged via Sprintlaw)
- ai-photo-quality-agent-spec.md (Phase 6)
- ai-multi-household-detector-spec.md (Phase 6)
- ai-ad-watchdog-spec.md (Phase 6)

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
