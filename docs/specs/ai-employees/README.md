# AI Employee Specs

**Purpose:** Job descriptions for AI agents that work for the CEO. Per Override 13: CEO decides, AI employees gather + organise + research. Each spec is the definitive brief for building/commissioning that AI agent.

**Owner:** CEO designs spec; AI ops engineer (claudeable) builds; CEO reviews output + decides.

---

## How AI employees relate to roles/

**Roles** ([docs/roles/](../../roles/)) = identity + lens. They define who the expert IS (knowledge base, what they look for, audit pattern).

**AI employees** ([docs/specs/ai-employees/](.)) = job + tooling. They define what the agent DOES (input, process, output, schedule, cost).

An AI employee USES the roles. Example: AI Pricing Researcher takes on the [expert-pricing-trade](../../roles/expert-pricing-trade.md) identity when researching, then [auditor-margin-per-job](../../roles/auditor-margin-per-job.md) when auditing findings.

---

## Universal AI employee mandate

Every AI employee in this folder must have:

### Identity
- Clear ROLE name + responsibility
- Linked to expert + auditor role files (the lenses they wear)
- Confidence threshold (below which they escalate to CEO)

### Research capabilities
- Web search for current 2026 NSW Sydney data
- Failure-mode research (Reddit, Whirlpool, FB groups, NCAT, ACCC, court judgments, international where applicable)
- 3+ alternatives brainstormed before recommending
- Source-citation in every claim

### Audit capabilities
- Self-audit using 3-lens pattern (per [CEO Rule 2](../../CEO.md#rule-2--every-decision-passes-3-lens-audit-before-landing-in-ceomd))
- Flag low-confidence findings to CEO with reasoning
- Document what's verified vs assumed

### Output format
- Structured (JSON or Markdown table)
- Posted to Slack `#ai-agents-activity` (per OPERATING-CONTEXT § 12 architecture)
- Saved to designated folder for CEO review (Drive or `data/research/`)
- Cost transparency (which API calls, $/run estimate)

### Operational
- Kill switch (toggle off via env var)
- Activity logged with timestamp + reasoning
- Re-runnable (idempotent — same input yields same findings)
- Maintenance trigger (audit each AI employee quarterly for prompt drift)

---

## AI employee roster (built ✅ / pending ⬜)

### Phase 1-2 (research-focused, web access only — pull-forward per Override 13)

| Spec | Status | Job | Cost/run |
|---|---|---|---|
| ✅ [pricing-researcher.md](pricing-researcher.md) | Spec built | Audit each pricing SKU against real 2026 Sydney market data + Bert/Bunnings + Bert prices | ~$0.50-2 per audit cycle |
| ✅ [materials-validator.md](materials-validator.md) | Spec built | Validate approved-brand list against forums + reviews + recall data; quarterly + on-demand new-brand evaluation | ~$0.20-0.50 per brand |
| ✅ [competitive-intelligence.md](competitive-intelligence.md) | Spec built | Weekly Sydney competitor scan: pricing, services, reviews, marketing claims, Meta Ad Library + failure-mode log | ~$1-3/week |
| ✅ [trades-researcher.md](trades-researcher.md) | Spec built | Generic deep-research employee for any trades-domain question (industry benchmarks, compliance/law, tool comparison, geo expansion, subcontractor network) | ~$1-5 per task |

### Phase 4-5 (operational-data — when GHL/SM8/Stripe live)

| Spec | Status | Job |
|---|---|---|
| ⬜ quote-drafter.md | Pending | Form submit → draft 3-tier quote → post to Slack for human approval |
| ⬜ photo-quality-reviewer.md | Pending | Review subcontractor completion photos against quality criteria, flag issues before customer sees |
| ⬜ business-analyst.md | Pending | Monday morning KPI summary from GHL + Stripe + ad spend |

### Phase 6+ (when data layer mature)

| Spec | Status | Job |
|---|---|---|
| ⬜ ad-watchdog.md | Pending | Daily 5am POAS check on Google Ads, flag profit-negative keywords |
| ⬜ multi-household-detector.md | Pending | New form submit → check DB for prior jobs at same address → flag pricing-consistency risk |
| ⬜ review-responder.md | Pending | Draft replies to Google/Facebook reviews for human approval |
| ⬜ sub-recruitment-outreach.md | Pending | Hipages/Airtasker scrape → personalised DM drafts → Marko approval |
| ⬜ dashboard-connector.md | Pending | Read/write Supabase dashboard via Slack slash commands |
| ⬜ email-manager.md | Pending | Categorise inbox, draft replies, escalate critical |
| ✅ [maintenance-reminder.md](maintenance-reminder.md) | Spec built | Seasonal nudges to past customers (mould season, annual check, post-cure follow-up) — drives repeat rate from 20% to 35-40% |
| ✅ [dm-handler.md](dm-handler.md) | Spec built | FB/IG DMs from prospective customers → conversational quote gathering → GHL contact creation |

---

## Build sequencing rationale

**Pull-forward** (Phase 1-2 employees pulled before Phase 6 because):
- Don't need GHL/SM8/Stripe operational data
- Web access only
- Save CEO time on repetitive research immediately
- Per Override 13: CEO should NOT be doing manual price/competitor research

**Defer** (Phase 4-6 employees stay later because):
- Need real customer/job data to be useful
- Building agents with no data to analyse = building agents with no purpose
- Phase 5 BigQuery data layer is the prerequisite for several

**Maintenance discipline** (per [auditor-general-operational](../../roles/auditor-general-operational.md)):
- Each AI employee quarterly review: still useful? cost reasonable? prompt drifting?
- Kill agents that aren't earning their keep (single-purpose, single-metric ROI)

---

## When CEO commissions an AI employee task

CEO writes a specific commission like:

```
@ai-pricing-researcher: Run pricing audit Phase A (top 20 SKUs).
Input: data/pricing/master-pricing-2026-05-01-snapshot.xlsx +
       data/suppliers/austrs-bert-prices-2026-04-30.csv
Output: docs/specs/pricing-audit-2026-05-findings.md
Confidence threshold: 70%; below → flag to CEO for review.
Deadline: 24 hours.
```

AI executes, posts findings, CEO reviews + decides on Excel changes.

---

## References

- [CEO.md § Rule 1](../../CEO.md) — analyse not gather
- [CEO.md § Rule 11](../../CEO.md) — failure-mode research channels
- [OPERATING-CONTEXT § 12](../../OPERATING-CONTEXT.md) — AI agent architecture (5 layers)
- [docs/roles/](../../roles/) — role files AI employees use as lenses
