# Spec: GHL Pipeline — 13-Stage + 12 Workflows + Ageing Rules

**Source:** Derived from [CEO § Override 14 v2](../CEO.md#override-14-v2-revised-2026-05-01-pm-after-allan-challenged-jordan-does-2m-with-15-stages--there-must-be-a-reason-ghl-pipeline--13-stages-jordans-structure-minus-sub-quote-per-job) — Jordan Schofield's Surface Care 15-stage structure minus 2 sub-quote stages we don't need.
**Audited via:** [expert-ghl-operator.md](../roles/expert-ghl-operator.md) + [auditor-general-operational.md](../roles/auditor-general-operational.md) + [auditor-webhook-integrity.md](../roles/auditor-webhook-integrity.md) + [auditor-customer-fairness.md](../roles/auditor-customer-fairness.md)
**Replaces:** [OPERATING-CONTEXT § 8.4](../OPERATING-CONTEXT.md) 17-stage version (now historical — this doc is authoritative)
**Companion to:** [docs/CEO.md § Override 14 v2](../CEO.md), [FUTURE-PLAN Phase 1.4](../FUTURE-PLAN.md), [sub-rate-schedule.md § D Payment process](sub-rate-schedule.md), [sub-sopa-protections.md](../sop/sub-sopa-protections.md)

---

## ⚠️ Status

This spec is the **authoritative blueprint** for building our GHL pipeline. When Allan signs up for GHL ($155/mo from May 27, 2026), this is the doc the GHL operator (Allan + this CEO assistant) follows step-by-step.

If Allan has already done partial GHL setup using OPERATING-CONTEXT § 8.4 (17-stage), audit before applying this spec — may need stage migration.

---

## Pipeline overview

**Total stages:** 13
**Pipeline name in GHL:** "Bathroom Quote → Job"
**Default opportunity value field:** populated by quote drafting (T2 price unless tier upgraded)
**Default currency:** AUD
**Time zone:** Australia/Sydney

### Stage flow (happy path)

```
1. Quote Requested
        ↓ (auto on form submit)
2. Q&A / Pre-Check
        ↓ (auto: photos clear + flags resolved)
3. Quote Sent
        ↓ (customer clicks "accept" link)
4. Quote Accepted
        ↓ (auto: site-inspect-flag NO)
        ├──→ 5. Site Inspection (only if flag YES)
        │            ↓ (inspection complete, scope confirmed)
        ↓
6. Prepayment (Stripe link sent)
        ↓ (Stripe webhook: deposit cleared)
7. Job in ServiceM8 (job card created)
        ↓ (subcontractor assigned + date locked)
        ├──→ 8. Job On Hold (access/strata/asbestos blocker — pauses 7→10 transition)
        ├──→ 9. Job Issue (subcontractor reports problem mid-flow)
        ↓
10. Job Booked
        ↓ (SM8 webhook: completion form submitted)
11. Job Complete
        ↓ (auto: final invoice fires)
12. Job Invoiced (awaiting customer payment)
        ↓ (Stripe webhook: final payment cleared)
13. Job Paid (terminal)
        ↓ (subcontractor paid via pay.com.au within 72hr per SOPA)
        [closed]
```

**13 happy-path stages. Stages 5, 8, 9 = exception/branch states.**

---

## Stage-by-stage detail

### Stage 1 — Quote Requested

| Field | Value |
|---|---|
| Owner | Auto |
| Trigger to enter | Form submitted (full or partial — partial sets `form_status=partial`, full = `form_status=submitted`) |
| Trigger to exit | Auto progression to Stage 2 once form processed (5-15s) |
| Ageing rule | None (transient) |
| Escalation | If stuck >5min = webhook integrity issue → Slack `#system-alerts` |
| Custom fields written | All form fields per [OPERATING-CONTEXT § 8.2](../OPERATING-CONTEXT.md), `form_submit_ts`, `gclid` (if from Google Ads), `referrer` |
| Tags applied | `service_*`, `flag_*`, `lead_form` |
| Workflows triggered | W1 (Instant Acknowledgement), W2 (Abandoned form — only if partial), Slack `#quotes-in` |

### Stage 2 — Q&A / Pre-Check

| Field | Value |
|---|---|
| Owner | Allan (or AI Quote Drafter when live, Phase 6.1) |
| Trigger to enter | Auto on Stage 1 completion |
| Trigger to exit | Photos clear + scope flags resolved + property age confirmed (asbestos check) |
| Ageing rule | **Target: 4hr response. Hard SLA: 24hr.** Per [CEO Customer service SLAs](../CEO.md#customer-service-slas--escalation-added-2026-05-01-pm) |
| Escalation | >4hr = Slack reminder; >24hr = `#sla-breach` alert + Allan call |
| Custom fields written | `qa_complete_ts`, `qa_notes`, `flag_resolved` |
| Tags applied | `qa_complete`, `flag_*` (if any new flags found in pre-check) |
| Workflows triggered | None (manual progression) |

### Stage 3 — Quote Sent

| Field | Value |
|---|---|
| Owner | Auto (from Allan's quote action) |
| Trigger to enter | Allan sends quote via GHL (manual button or AI Quote Drafter approves) |
| Trigger to exit | Customer clicks "accept" link in quote email/SMS (any tier T1/T2/T3) |
| Ageing rule | **24hr → W3 follow-up; 72hr → W4 final follow-up; 14 days → auto-close to "stale" status** |
| Escalation | None auto; W3/W4 handle |
| Custom fields written | `quote_sent_ts`, `quote_amount_t1`, `quote_amount_t2`, `quote_amount_t3`, `quote_validity_until` (default +14 days) |
| Tags applied | `quote_sent` |
| Workflows triggered | W3 (24h follow-up), W4 (72h final follow-up) |

### Stage 4 — Quote Accepted

| Field | Value |
|---|---|
| Owner | Auto |
| Trigger to enter | Customer clicks tier link |
| Trigger to exit | Auto: if `flag_site_inspection=true` → Stage 5; else → Stage 6 |
| Ageing rule | None (transient — auto-progresses within 1min) |
| Escalation | Stuck >5min = webhook integrity issue |
| Custom fields written | `tier_chosen`, `quote_accepted_ts`, `quote_amount_final` |
| Tags applied | `quote_accepted`, `tier_t1`/`tier_t2`/`tier_t3` |
| Workflows triggered | W5 (Booking Fee Trigger) — only if Stage 6 next, NOT if Stage 5 |

### Stage 5 — Site Inspection (conditional branch)

| Field | Value |
|---|---|
| Owner | Allan (or Marko) |
| Trigger to enter | `flag_site_inspection=true` set in Stage 2 OR scope unclear OR commercial/strata/$2k+ |
| Trigger to exit | Inspection complete + final scope confirmed in GHL |
| Ageing rule | **Target: 5 business days from accept. Hard SLA: 10 business days.** |
| Escalation | >5 days = Slack reminder; >10 days = `#sla-breach` |
| Custom fields written | `site_inspection_date`, `site_inspection_notes`, `final_scope`, `final_quote_amount` |
| Tags applied | `site_inspected` |
| Workflows triggered | After inspection: re-runs W5 (Booking Fee Trigger) for confirmed amount |
| **Maintenance note** | Per [CEO Override 14 v2 audit refinement](../CEO.md): quarterly check — if no opps used Stage 5 in 90 days, audit whether trigger is broken or use case is dead |

### Stage 6 — Prepayment

| Field | Value |
|---|---|
| Owner | Auto (Stripe) |
| Trigger to enter | Stage 4/5 exit + Stripe deposit link generated + sent via W5 |
| Trigger to exit | Stripe webhook: `payment_intent.succeeded` with `metadata.type=deposit` |
| Ageing rule | **24hr reminder SMS, 72hr final reminder, 7 days auto-cancel** (per Override 14 v2 audit) |
| Escalation | After 7d cancel = move to "stale" status with `auto_cancelled_no_deposit` tag |
| Custom fields written | `stripe_deposit_link`, `deposit_amount` (10% of final quote), `deposit_link_sent_ts` |
| Tags applied | `deposit_link_sent` |
| Workflows triggered | W6 (BOOM Notification) on deposit paid; ageing reminders at 24/72hr |

### Stage 7 — Job in ServiceM8

| Field | Value |
|---|---|
| Owner | Marko (or AI Dashboard Connector when Phase 6.6a live) |
| Trigger to enter | Stripe webhook fires deposit-paid → GHL workflow creates SM8 job via Zapier → SM8 job ID returned to GHL |
| Trigger to exit | Subcontractor assigned in SM8 + date locked (auto via SM8 webhook back to GHL) |
| Ageing rule | **2hr alert if no subcontractor accepts; escalate to Marko** (per Override 14 v2 audit) |
| Escalation | >24hr without subcontractor assignment = `#dispatch-stuck` Slack alert |
| Custom fields written | `sm8_job_id`, `sm8_job_created_ts`, `assigned_sub_id` (once assigned) |
| Tags applied | `sm8_job_created`, `awaiting_sub` |
| Workflows triggered | None auto (SM8 dispatch is its own flow); ageing reminders |

### Stage 8 — Job On Hold (exception branch)

| Field | Value |
|---|---|
| Owner | Allan (manages customer comms) |
| Trigger to enter | Manual move on access/strata/asbestos blocker. NOT auto. |
| Trigger to exit | Manual move back to Stage 7 once blocker resolved |
| Ageing rule | **48hr Slack reminder; 7 days requires CEO review** (long holds = customer relationship risk) |
| Escalation | >14 days = considered "stalled" per [CEO Crisis playbook](../CEO.md#crisis-playbook--when-things-break-added-2026-05-01-pm); decision to refund deposit or extend |
| Custom fields written | `hold_reason`, `hold_started_ts`, `hold_resolved_ts` (when exits) |
| Tags applied | `on_hold`, `hold_reason_*` |
| Workflows triggered | None auto |

### Stage 9 — Job Issue (exception branch)

| Field | Value |
|---|---|
| Owner | Allan + Marko |
| Trigger to enter | Subcontractor reports problem mid-flow OR customer complaint mid-job OR photo review fails |
| Trigger to exit | Issue resolved (manual back to Stage 7 or Stage 10/11 depending on resolution) |
| Ageing rule | **30min Slack alert; 4hr CEO callback per SLA** |
| Escalation | If unresolved 24hr OR safety/legal angle → CEO crisis triage |
| Custom fields written | `issue_type`, `issue_described_ts`, `issue_resolved_ts`, `issue_resolution` |
| Tags applied | `job_issue`, `issue_type_*` |
| Workflows triggered | W7 (Job Issue Alert) — Slack `#job-issues` + customer SMS "Co-founder will call within 30min" |

### Stage 10 — Job Booked

| Field | Value |
|---|---|
| Owner | Marko |
| Trigger to enter | Subcontractor assigned + date locked + customer notified |
| Trigger to exit | SM8 webhook fires on job completion |
| Ageing rule | None (job has its own scheduled date — calendar-driven, not ageing-driven) |
| Escalation | If date passes without completion → Slack alert |
| Custom fields written | `job_booked_date`, `job_booked_ts`, `customer_confirmation_ts` |
| Tags applied | `job_booked` |
| Workflows triggered | W8 (Day-Before Reminder) — fires 24hr before booked date |

### Stage 11 — Job Complete

| Field | Value |
|---|---|
| Owner | Auto (from SM8 webhook) |
| Trigger to enter | SM8 completion form submitted with before/during/after photos |
| Trigger to exit | Auto progression to Stage 12 once final invoice fires |
| Ageing rule | None (transient) |
| Escalation | If photos missing → Stage 9 (Job Issue) auto-route |
| Custom fields written | `job_completed_ts`, `photos_url_before`, `photos_url_during`, `photos_url_after`, `sm8_completion_notes` |
| Tags applied | `job_complete` |
| Workflows triggered | W9 (Cure Time Warning), W10 (NPS Routing 4hr later) |

### Stage 12 — Job Invoiced (awaiting customer payment)

| Field | Value |
|---|---|
| Owner | Auto (Stripe) |
| Trigger to enter | Stage 11 + Stripe final-payment link generated + sent |
| Trigger to exit | Stripe webhook: `payment_intent.succeeded` with `metadata.type=final` |
| Ageing rule | **7d/14d/30d reminder cascade to customer** (per Override 14 v2 audit) |
| Escalation | >30d = formal demand letter; >45d = SOPA payment claim per [sub-sopa-protections § "When SOPA helps US"](../sop/sub-sopa-protections.md) |
| Custom fields written | `final_invoice_amount`, `final_invoice_sent_ts`, `final_invoice_link` |
| Tags applied | `final_invoice_sent` |
| Workflows triggered | Reminder cascade at 7/14/30 days |

### Stage 13 — Job Paid (terminal happy path)

| Field | Value |
|---|---|
| Owner | Marko (subcontractor payout); CEO (closed) |
| Trigger to enter | Stripe final-payment cleared |
| Trigger to exit | Subcontractor paid via pay.com.au + `sub_paid=true` flag set |
| Ageing rule | **Subcontractor MUST be paid within 72hr of customer payment clearing** (per Override 14 v2 audit + SOPA discipline) |
| Escalation | >72hr sub-unpaid = Slack `#sub-payouts-overdue` (cashflow + sub-loyalty risk) |
| Custom fields written | `final_payment_received_ts`, `sub_paid_ts`, `sub_paid_amount`, `pay_com_au_ref` |
| Tags applied | `final_payment_received`, `sub_paid` (when complete), `closed` (terminal flag) |
| Workflows triggered | W11 (Referral Offer — only if `nps_promoter`), W12 (Warranty Confirmation email) |

---

## Why we skipped 2 of Jordan's 15 stages

Jordan (Surface Care AU, ~$2M/yr) runs 15 stages. We adopt 13. The 2 we skip:

| Skipped stage | Why doesn't apply to us |
|---|---|
| Sub-quote Requested | We use fixed rate cards ([sub-rate-schedule.md](sub-rate-schedule.md)). Subcontractors don't bid per job; they accept rate-card pay or decline. No quote stage needed. |
| Sub-quote Received | Same reason — there's no sub-side quote to receive. |

If we ever switch to per-job subcontractor bidding (unlikely — fixed rates are simpler + sub-friendly), reactivate these 2 stages.

---

## Why we kept these 3 (corrects v1 mistake)

CEO v1 wanted to merge these 3 into other stages. Allan caught the mistake; v2 keeps them.

| Stage | Why it's distinct |
|---|---|
| Stage 5 (Site Inspection) | Distinct waiting state from "Quote Accepted." Customer agreed in principle, full quote depends on physical inspection. Even at low volume (rare flag), when triggered it's a real waiting state with own SLA. |
| Stage 6 vs Stage 7 (Prepayment vs Job in SM8) | 2 different waiting periods. Prepayment = waiting on customer to click Stripe link; Job in SM8 = waiting for subcontractor to accept job card. **Different alerts, different ageing thresholds.** Merging would lose escalation visibility. |
| Stage 12 vs Stage 13 (Invoiced vs Paid) | 2 different waiting periods. Invoice sent → waiting customer payment; Paid → waiting subcontractor payout via pay.com.au. **Cash flow visibility requires distinct stages** for KPI dashboard accuracy. |

---

## The 12 workflows (full spec)

### W1: Instant Quote Acknowledgement

| Field | Value |
|---|---|
| Trigger | Stage 1 entered (form submission complete, not partial) |
| Wait | 0s |
| Action 1 | Send SMS to customer: *"Hi [First Name]. Got your photos — we're on it right now. You'll have your quote within 15 minutes. — Timeless Resurfacing"* |
| Action 2 | Post to Slack `#quotes-in` with structured format per [OPERATING-CONTEXT § 10.2](../OPERATING-CONTEXT.md) |
| Action 3 | Tag `instant_ack_sent` |
| Compliance | Spam Act 2003 — sender ID + opt-out (in standard SMS footer) |

### W2: Abandoned Form Recovery

| Field | Value |
|---|---|
| Trigger | Contact created with phone+email but `form_status=partial` AND no event in 5h |
| Wait | 5h after partial-submit timestamp |
| Action 1 | Send SMS: *"Hey [First Name]. Looks like you didn't quite finish your bathroom quote. It only takes 30 seconds — just upload a couple of photos and we'll get your price sorted: [Form Link with their session ID]. — Timeless Resurfacing"* |
| Action 2 | After 24h, if still `form_status=partial`, mark as `cold_partial` and stop touching |
| Compliance | Privacy Act + Spam Act — only fires on contacts who STARTED the form (gave phone/email) |

### W3: 24h Quote Follow-Up

| Field | Value |
|---|---|
| Trigger | Stage 3 (Quote Sent) — no exit within 24h |
| Wait | 24h after Stage 3 entry |
| Action | Send SMS: *"Hey [First Name]. Just checking in on your bathroom quote. Happy to answer any questions — just reply…"* |
| Compliance | Spam Act — sender ID + STOP option |

### W4: 72h Final Follow-Up

| Field | Value |
|---|---|
| Trigger | Stage 3 — no exit AND W3 sent 48h+ ago |
| Wait | 48h after W3 fires |
| Action | Send SMS: *"Last one from us [First Name]. Your quote is still saved if the timing works. We have availability this week if you'd like to lock something in…"* |
| Note | After this, NO 3rd attempt. Spam Act + brand damage risk. |

### W5: Booking Fee Trigger (Stripe deposit link)

| Field | Value |
|---|---|
| Trigger | Stage 4 (Quote Accepted) entered, AND `flag_site_inspection=false`. OR Stage 5 (Site Inspection) exits with confirmed scope |
| Wait | 0s |
| Action 1 | Generate Stripe Checkout Session for 10% of `quote_amount_final` with metadata `{type:"deposit", contact_id:{{contact.id}}, opportunity_id:{{opp.id}}}` |
| Action 2 | Send SMS to customer with Stripe link + brief copy |
| Action 3 | Send email confirmation with full quote PDF |
| Action 4 | Move to Stage 6 (Prepayment) |

### W6: BOOM Notification (deposit paid)

| Field | Value |
|---|---|
| Trigger | Stripe webhook `payment_intent.succeeded` with `metadata.type=deposit` |
| Action 1 | Move to Stage 7 (Job in ServiceM8) |
| Action 2 | Post to Slack `#new-jobs` BOOM message: *"💥 [Customer name] [suburb] — [service] — $[amount] deposit paid. Stage 7 → SM8."* |
| Action 3 | Trigger Zapier (or native): create SM8 job from GHL contact + opportunity data |
| Action 4 | Tag `deposit_paid` + record `deposit_received_ts` |

### W7: Job Issue Alert

| Field | Value |
|---|---|
| Trigger | Stage 9 entered (Job Issue) |
| Wait | 0s |
| Action 1 | Slack alert to `#job-issues` with full context |
| Action 2 | SMS to customer: *"Hi [First Name], we've spotted an issue we need to talk through. A co-founder will call you within 30 minutes. Hold tight."* |
| Action 3 | Allan + Marko phone notification |
| Compliance | Customer service SLA (per [CEO § Customer service SLAs](../CEO.md)) |

### W8: Day-Before Reminder

| Field | Value |
|---|---|
| Trigger | Stage 10 (Job Booked) + 24h before `job_booked_date` |
| Action 1 | SMS to customer: *"Hi [First Name], reminder your bathroom job is booked for [date] [time]. Our tech will call ~30min before arrival. Need to reschedule? Reply or call [phone]. — Timeless"* |
| Action 2 | Slack ping to assigned subcontractor via SM8 |

### W9: Cure Time Warning

| Field | Value |
|---|---|
| Trigger | Stage 11 (Job Complete) entered |
| Wait | 0s |
| Action | SMS to customer: per service:
- Regrout: *"Job done! Please don't use the shower/bath for 24 HOURS to let everything fully set. Aftercare card left on your bench. Any issues? Hit reply."*
- Resurface: *"Job done! Please don't use the surface for 48-72 HOURS to fully cure. Aftercare card left on your bench. Any issues? Hit reply."*
- Variants per service per [aftercare cards templates](../templates/customer-aftercare-cards.md) |

### W10: NPS Routing

| Field | Value |
|---|---|
| Trigger | Stage 11 + 4h |
| Action 1 | SMS: *"Hi [First Name], how was your experience with us today? Reply 1 (terrible) – 10 (loved it). Helps us improve."* |
| Action 2 — score routing (parse SMS reply) | |
| **9-10 (promoter)** | Tag `nps_promoter`, fire W11 (referral offer), fire Google review request workflow |
| **7-8 (passive)** | Tag `nps_passive`, no review request, internal note |
| **1-6 (detractor)** | Tag `nps_detractor`, Slack alert `#nps-detractors`, Allan callback within 60min per [CEO SLAs](../CEO.md) |

### W11: Referral Offer

| Field | Value |
|---|---|
| Trigger | Tag `nps_promoter` set by W10 |
| Wait | 24h after promoter tag |
| Action | SMS: *"Glad you loved it! Refer a friend or family — when they book, you both get $50 off. Share this link: [referral link with their code]. Thanks for spreading the word!"* |
| Custom fields | `referral_code` generated; tracked downstream when used |

### W12: Warranty Confirmation

| Field | Value |
|---|---|
| Trigger | Stage 13 (Job Paid) entered |
| Wait | 0s |
| Action | Email customer: PDF warranty certificate with: service, date, subcontractor name (or "Timeless team"), warranty term per service (regrout 12mo / resurface up-to-5-year private / 6mo rental / etc), care instructions, our contact for any issues. |
| Compliance | ACCC — warranty in writing, in addition to ACL rights, no over-claiming |

---

## Custom fields required (build BEFORE workflows)

Per [FUTURE-PLAN Phase 1.2](../FUTURE-PLAN.md), all 40+ custom fields per [OPERATING-CONTEXT § 8.2](../OPERATING-CONTEXT.md). Key fields this pipeline depends on:

- `customer_type`, `property_type`, `service_requested`, `mode`
- `flag_site_inspection`, `flag_strata`, `flag_asbestos`, `flag_commercial`, `flag_*`
- `tier_chosen`, `quote_amount_t1/t2/t3`, `quote_amount_final`
- `deposit_amount`, `final_invoice_amount`, `sub_paid_amount`
- `gclid` (Google Ads), `referrer`, `referral_code`
- `qa_complete_ts`, `quote_sent_ts`, `quote_accepted_ts`, `deposit_received_ts`, `job_completed_ts`, `final_payment_received_ts`, `sub_paid_ts`
- `assigned_sub_id`, `sm8_job_id`, `pay_com_au_ref`
- `hold_reason`, `issue_type`, `nps_score`

---

## Tags library (per stage)

Per [OPERATING-CONTEXT § 8.3](../OPERATING-CONTEXT.md). Stage-aligned tag prefixes:

- `stage_*` (e.g., `stage_quote_sent`) — current stage marker (auto-removes on stage exit)
- `service_*` — service requested (`service_shower_regrout`, `service_bath_resurface`, etc)
- `flag_*` — flags (`flag_strata`, `flag_asbestos`, `flag_site_inspection`, etc)
- `nps_*` — NPS score family (`nps_promoter`, `nps_passive`, `nps_detractor`)
- `lead_*` — lead source (`lead_form`, `lead_phone`, `lead_referral`)
- `tier_t1` / `tier_t2` / `tier_t3` — tier chosen
- terminal flags: `closed`, `auto_cancelled_no_deposit`, `cold_partial`

---

## Slack channel architecture (per [OPERATING-CONTEXT § 10.1](../OPERATING-CONTEXT.md))

| Channel | What goes there |
|---|---|
| `#quotes-in` | W1 alerts (new form submissions) |
| `#new-jobs` | W6 BOOM alerts (deposit paid) |
| `#job-issues` | W7 Job Issue alerts |
| `#nps-detractors` | W10 NPS 1-6 alerts → Allan callback |
| `#sla-breach` | Stage 2 >24hr, Stage 5 >10 days, Stage 9 unresolved |
| `#dispatch-stuck` | Stage 7 no subcontractor assignment >24hr |
| `#sub-payouts-overdue` | Stage 13 subcontractor unpaid >72hr |
| `#system-alerts` | Webhook integrity (transient stages stuck >5min) |
| `#weekly-numbers` | Weekly KPI digest from BQ |
| `#ai-agents-activity` | All AI agent posts (per OPERATING-CONTEXT § 12) |

---

## Failure modes researched (per CEO Rule 11)

- **GHL forum threads:** common mistake — building workflows BEFORE custom fields exist → workflows reference non-existent fields → silent failures. Fix: always Phase 1.2 (fields) BEFORE Phase 1.5 (workflows).
- **Reddit r/AusBusiness:** trade business set up GHL pipeline with auto-stages but no ageing rules → opps stagnated for weeks invisible to founder → lost $20K in stale leads. Fix: every stage has ageing rule + escalation to Slack.
- **NCAT case 2025 (small bathroom renovator):** customer claimed never received quote; head contractor's GHL had `quote_sent_ts` empty (workflow misfired); tribunal sided with customer. Lesson: every stage transition must have audit-trail timestamps.
- **Stripe webhook race condition (multiple GHL forum reports):** dual-fire on retry creates duplicate Stage 6→7 transition → two SM8 jobs created. Fix: idempotency key on Stripe metadata + GHL workflow check `if already in Stage 7, skip`.

---

## Audit cadence (per [auditor-general-operational](../roles/auditor-general-operational.md))

### Pre-launch (before first paid job)
- [ ] Every stage exists in GHL with correct name + position
- [ ] Every workflow tested end-to-end with synthetic test contact
- [ ] Stripe webhooks tested with test cards (deposit + final)
- [ ] SM8 sync tested (Stage 7 entry → SM8 job appears)
- [ ] Slack alerts firing to correct channels
- [ ] Compliance audit per [auditor-compliance-aus](../roles/auditor-compliance-aus.md): SMS sender ID + STOP option in every customer message
- [ ] [auditor-webhook-integrity](../roles/auditor-webhook-integrity.md) full lens: every event reaches its destination, no silent drops

### Weekly (post-launch)
- [ ] Pipeline integrity: every Stage 7 has matching SM8 job; every Stage 13 has subcontractor paid <72hr
- [ ] Ageing alerts firing correctly (no stuck-stage opps invisible)
- [ ] Slack channel signal-to-noise — any alerts that aren't useful, mute or remove

### Monthly
- [ ] Stage-conversion rates trending — match V56 funnel benchmarks per [CEO § KPI definitions](../CEO.md#kpi-definitions--funnel-benchmarks-added-2026-05-01-pm-after-jordan-transcripts-mining)?
- [ ] Stage 5 (Site Inspection) usage — per Override 14 v2 audit refinement #3, if zero use in 90 days, audit
- [ ] Compliance: random-sample 5 customer messages — sender ID? opt-out present? warranty wording compliant?

### Quarterly
- [ ] Full pipeline review — stages still right? workflows still firing? any stage that should be split or merged?
- [ ] Custom fields hygiene — orphaned fields, unused fields, fields that should be tags
- [ ] Subcontractor Stripe payouts via pay.com.au still working + 72hr SLA met

---

## Build sequence (per FUTURE-PLAN Phase 1)

Phase 1.1 → 1.9, in order. Critical: build custom fields + tags BEFORE workflows.

1. **1.1 GHL business setup** — sign up, profile, domain auth, Twilio number
2. **1.2 Custom fields** — all 40+ per OPERATING-CONTEXT § 8.2
3. **1.3 Tags library** — all per § 8.3
4. **1.4 13-stage pipeline** — THIS spec (formerly 17-stage; OPERATING-CONTEXT § 8.4 historical)
5. **1.5 Connect quote form to GHL** — webhook, custom field mapping, tags
6. **1.6 Slack alert workflow** — `#quotes-in` first
7. **1.7 W1 SMS acknowledgement workflow**
8. **1.8 W2 Abandoned form recovery workflow**
9. Build remaining W3-W12 in priority order (W3, W4 next; W5+ when Stripe ready)
10. **1.9 Triple audit Phase 1** — pre-launch checklist above

---

## Cross-references

- [docs/CEO.md § Override 14 v2](../CEO.md) — strategic decision behind 13-stage
- [docs/OPERATING-CONTEXT.md § 8.4](../OPERATING-CONTEXT.md) — historical 17-stage version (deprecated by this spec)
- [docs/OPERATING-CONTEXT.md § 8.5](../OPERATING-CONTEXT.md) — 12-workflow original list (matched here with stage numbers updated)
- [docs/FUTURE-PLAN.md § Phase 1](../FUTURE-PLAN.md) — implementation phases (note: § 1.4 still references 17-stage; should be updated to 13)
- [docs/specs/sub-rate-schedule.md § D](sub-rate-schedule.md) — subcontractor payment process (Stage 13 sub-paid 72hr)
- [docs/sop/sub-sopa-protections.md](../sop/sub-sopa-protections.md) — payment timing law (backs Stage 12 + Stage 13 ageing)
- [docs/roles/expert-ghl-operator.md](../roles/expert-ghl-operator.md) — GHL operator lens
- [docs/roles/auditor-webhook-integrity.md](../roles/auditor-webhook-integrity.md) — webhook integrity lens
- [docs/roles/auditor-customer-fairness.md](../roles/auditor-customer-fairness.md) — customer-side messaging lens
