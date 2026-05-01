# Role Library — Experts & Auditors

**Purpose:** Each file is a "skill" Claude (or Angela) loads when doing a specific task. Experts execute. Auditors verify. Every task in [FUTURE-PLAN.md](../FUTURE-PLAN.md) names which roles apply.

**Why separate files:** When Claude does a task, it should load ONLY that role's lens — not 26 lenses' worth of conflicting context. Single-role files = sharp recommendations.

**Universal mandate (every role):** Before any recommendation, **research current 2026 standards** — never default to training data on fast-moving topics. Brainstorm 3+ alternatives before recommending one.

**Proactive gap-flagging (added 2026-05-01 PM per Allan):** Each role is responsible for proactively identifying gaps in our current approach within their domain — not waiting for CEO to ask. Examples Allan flagged:
- **Compliance auditor**: SWMS (Safe Work Method Statement) requirements per NSW WHS Reg 2017 § 297-299 — was missing, now added to vetting checklist
- **Trades-ops expert**: how AU sub-onboarding agencies handle vetting at scale — should research industry best practices, surface anything we're missing
- **Pricing-trade expert**: digital tools / processes other AU resurfacing agencies use — surface tool/process gaps we should adopt
- **Materials validator** (when built): brand-specific quality issues + recalls — proactively monitor

**Pattern**: each role file should keep a "Gaps to research / surfaces back to CEO" running list at the bottom. When the role identifies something Angela's business should consider but doesn't currently, add it there + flag to CEO. The CEO decides whether to act.

This means:
- Experts don't just answer questions — they ask better ones
- Auditors don't just check what's there — they identify what's MISSING
- Roles are LIVING — they grow as the business + research uncovers gaps

---

## Expert roles (built ✅ / pending ⬜)

| File | Expert | Activates for | Pairs with auditor |
|---|---|---|---|
| ✅ [expert-cro-specialist.md](expert-cro-specialist.md) | CRO specialist for AU home services | Quote form UX changes | mobile-abandonment + compliance-aus |
| ✅ [expert-ghl-operator.md](expert-ghl-operator.md) | GoHighLevel automation operator | All workflow / pipeline / template work | webhook-integrity + compliance-aus |
| ✅ [expert-direct-response-copywriter.md](expert-direct-response-copywriter.md) | Direct response copywriter (SMS/email) | Customer-facing message copy | compliance-aus |
| ✅ [expert-conversion-copywriter.md](expert-conversion-copywriter.md) | Conversion copywriter (B2C trades) | Quote tier descriptions, landing page copy | compliance-aus + margin-per-job |
| ✅ [expert-field-service-ops.md](expert-field-service-ops.md) | Field service ops manager | ServiceM8 setup, subcontractor dispatch | photo-quality + fair-work |
| ✅ [expert-trades-ops-contractor.md](expert-trades-ops-contractor.md) | Trades ops + contractor lawyer | Subcontractor agreements, recruitment, onboarding | fair-work |
| ⬜ expert-analytics-data-engineer.md | Analytics data engineer | BigQuery schema, data sync | data-integrity + privacy |
| ⬜ expert-performance-marketing.md | Performance marketing (POAS-first) | Google Ads, campaign structure | margin-per-channel |
| ⬜ expert-ai-ops-engineer.md | AI ops engineer | Agent design, prompt engineering | ai-safety |
| ⬜ expert-cx-specialist.md | Customer experience specialist | NPS, reviews, retention | accc-review-genuineness |
| ⬜ expert-internal-comms-ia.md | Internal comms IA | Slack channel architecture | noise-signal |
| ⬜ expert-mobile-frontend.md | Mobile-first frontend dev | Photo upload, mobile UX | performance-offline |
| ⬜ expert-pricing-trade.md | NSW resurfacing trade expert | SKU pricing, Excel updates | margin-per-job |
| ⬜ expert-trust-safety.md | Trust & safety engineer | Multi-household detection, fraud | privacy + customer-fairness |

## Auditor roles (built ✅ / pending ⬜)

| File | Auditor | Activates for | What it catches |
|---|---|---|---|
| ✅ [auditor-compliance-aus.md](auditor-compliance-aus.md) | AU compliance (Spam Act, Privacy Act, ACCC) | Any customer-facing message or claim | Misleading conduct, opt-out missing, PII mishandled |
| ✅ [auditor-mobile-abandonment.md](auditor-mobile-abandonment.md) | Mobile abandonment auditor | Quote form changes | Excessive scroll, tap targets <44px, slow inputs |
| ✅ [auditor-webhook-integrity.md](auditor-webhook-integrity.md) | Webhook / data flow integrity | All system handoffs (form→GHL, GHL→SM8, etc) | Silent drops, race conditions, wrong field mapping |
| ✅ [auditor-margin-per-job.md](auditor-margin-per-job.md) | Margin-per-job auditor | Pricing decisions, quote templates | Quote that loses money once costs subtract |
| ✅ [auditor-fair-work.md](auditor-fair-work.md) | Fair Work / contractor independence | Subcontractor agreements, dispatch logic | Sham contracting, super back-pay risk |
| ✅ [auditor-general-operational.md](auditor-general-operational.md) | General operational (catch-all for internal/system) | Pipelines, workflows, file architecture, tool selection | Over/under-engineering, single-points-of-failure, maintenance rot |
| ✅ [auditor-customer-fairness.md](auditor-customer-fairness.md) | Customer-side stakeholder fairness | Pricing, terms, customer comms | Brand-damaging-but-legal practices |
| ⬜ auditor-data-integrity.md | Data integrity (sync correctness) | BigQuery sync, GHL↔SM8 | Mismatched records, lost events |
| ⬜ auditor-privacy.md | Privacy Act 1988 | Any storage/transfer of customer data | Data retention, deletion-on-request, residency |
| ⬜ auditor-margin-per-channel.md | POAS by channel | Google Ads campaigns | Profit-negative keywords running silently |
| ⬜ auditor-ai-safety.md | AI safety / hallucination | Every agent | False outputs, missing kill switch, bias |
| ⬜ auditor-accc-review-genuineness.md | ACCC review genuineness | Review request workflows | Incentivised reviews, fake testimonials |
| ⬜ auditor-noise-signal.md | Slack signal-to-noise | Slack channel design | Alert fatigue, important things buried |
| ⬜ auditor-photo-quality.md | Subcontractor completion photo quality | SM8 completion form | Bad lighting, missing angles, fake before/after |
| ⬜ auditor-performance-offline.md | Performance + offline tolerance | Photo upload, mobile flows | Hangs on 3G, no offline queue |
| ⬜ auditor-customer-fairness.md | Customer fairness (multi-household) | Duplicate detection, pricing consistency | Different price for same address, brand damage |

---

## How to use a role file

When working on a specific task in [FUTURE-PLAN.md](../FUTURE-PLAN.md):

1. Read the task's named expert + auditor role files
2. **Activate the expert lens** for the BUILD step
3. **Activate the auditor lens** for the AUDIT step
4. Apply triple audit per [OPERATING-CONTEXT § 16.3](../OPERATING-CONTEXT.md#163-triple-audit-rule-3-lenses-minimum-one-must-be-adversarial)

## When to add a new role file

When [FUTURE-PLAN.md](../FUTURE-PLAN.md) reaches a phase that uses a ⬜ pending role, build that file BEFORE starting the task.

## Common ground (every role file includes)

- **Role definition** — who they are, what they care about most
- **Knowledge base** — domain expertise + AU/NSW specifics
- **What they look for / audit for** — concrete checklist
- **NSW + Angela context** — how this role's lens shifts given NSW market + Angela's partnership / coordination-not-execution model
- **Alignment with our goals** — easy/streamlined/accurate, 48–52% margin, lane discipline
- **Research mandate** — must research current 2026 standards before recommending
- **Output format** — triple-audit findings tagged 🔴/🟠/🟢/⚪, file:line refs, trade-off docs

---

*The 26 roles cover every meaningful decision in the business. Built ones are immediately usable; pending ones get built when their phase activates.*
