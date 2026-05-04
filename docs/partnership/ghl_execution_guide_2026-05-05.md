---
name: GHL Execution Guide — pipeline + form connection + Allan's setup checklist
description: Stripped-down practical view of the GHL setup spec v2. Cuts context. Just what Allan needs to SEE and DO. Companion to the full spec.
type: reference
status: companion to memory/ghl_setup_spec_v2_2026-05-05.md
date: 2026-05-05 PM
originSessionId: 04add9fa-fa52-416e-bc34-9d39692a49df
---
# GHL Execution Guide

This is the practical view. Read the full spec (`memory/ghl_setup_spec_v2_2026-05-05.md`) for context + reasoning; this doc is for action.

## 1. The pipeline at a glance

```
                              ┌─────────────────────────────────────┐
   FORM SUBMITTED             │       PIPELINE: SALES               │
   ↓                          │                                     │
   ┌────────────────┐         │  Stage 1   Quote Requested  ──┐    │
   │  Quote Form    │ ─────→  │     ↓                         │    │
   │  (React, on    │         │  Stage 2   Q&A (Clarification)│    │
   │   localhost    │         │     ↓                         │    │
   │   :5174 today, │         │  Stage 3   Sub-quote Req      │    │
   │   live WP soon)│         │  ┌───────  HIDDEN Phase 1     │    │
   └────────────────┘         │  Stage 4   Sub-quote Recvd    │    │
                              │  └───────  HIDDEN Phase 1     │    │
                              │     ↓                         │    │
                              │  Stage 5   Quote Sent         │    │
                              │     ↓                         │    │
                              │  Stage 6   Quote Accepted     │    │
                              │     ↓                         │    │
                              │  Stage 7   Site Inspection    │    │
                              │     ↓                         │    │
                              │  Stage 8   Prepayment         │    │
                              │     ↓                         │    │
                              │  Stage 9   Job in ServiceM8   │    │
                              │     │   (manual bucket Phase 1)    │
                              │     ↓                         │    │
                              │  Stage 10  Job on Hold (any)  │    │
                              │  Stage 11  Job Issue (any)    │    │
                              │     ↓                         │    │
                              │  Stage 12  Job Booked         │    │
                              │     ↓                         │    │
                              │  Stage 13  Job Complete       │    │
                              │     ↓                         │    │
                              │  Stage 14  Job Invoiced       │    │
                              │     ↓                         │    │
                              │  Stage 15  Job Paid (terminal)│    │
                              └─────────────────────────────────────┘
```

**One-line per stage:**

| # | Stage | What it means |
|---|---|---|
| 1 | Quote Requested | Lead just submitted, you triage in 24h |
| 2 | Q&A | You sent customer a clarifying question, awaiting reply |
| 3 | Sub-quote Requested | (Hidden Phase 1) When sub trade needed |
| 4 | Sub-quote Received | (Hidden Phase 1) Sub came back with price |
| 5 | Quote Sent | Customer has formal quote + Stripe deposit link, awaiting decision |
| 6 | Quote Accepted | Customer paid deposit OR signed acceptance — auto-route |
| 7 | Site Inspection | Quote ≥ $2K or strata/asbestos/etc — physical visit before locking price |
| 8 | Prepayment | Deposit invoice sent, awaiting payment |
| 9 | Job in ServiceM8 | Paid + ready to schedule (Phase 1 = manual bucket) |
| 10 | Job on Hold | Paused with reason (customer reschedule, materials, asbestos check, etc.) |
| 11 | Job Issue | Defect/complaint mid-job — Marko calls within 60min |
| 12 | Job Booked | Date locked in calendar |
| 13 | Job Complete | Work done + after-photos uploaded |
| 14 | Job Invoiced | Final 90% balance invoice sent |
| 15 | Job Paid | Money in. Warranty doc emailed. Done. |

---

## 2. How GHL connects to the quote form

```
┌────────────────────────────────────────────────────────────────────────┐
│                         QUOTE FORM (your React app)                     │
│                                                                         │
│   STEP 1  About you (name, email, phone, customer type)                │
│      │                                                                  │
│      │ ◄─── Step 1→2 transition: fires partial webhook                  │
│      │      (so abandoned quotes get followed up later)                 │
│      ↓                                                                  │
│   STEP 2  Where (address, property type, asbestos screening)           │
│      ↓                                                                  │
│   STEP 3  What (areas: shower / bath / basin / walls / floor)         │
│      ↓                                                                  │
│   STEP 4  Services per area                                            │
│      ↓                                                                  │
│   STEP 5  Photos (Cloudinary upload — Phase 1B) + notes + submit       │
│      │                                                                  │
│      │ Fires GA4 quote_partial event (already in code)                  │
│      │ On submit: Fires GA4 quote_submit event (already in code)        │
│      └──────────────────────────────────────────┐                      │
└──────────────────────────────────────────────────┼─────────────────────┘
                                                   │
                                                   ▼
                  ┌────────────────────────────────────────────────────┐
                  │  GHL INBOUND WEBHOOK (W1 trigger)                  │
                  │  https://services.leadconnectorhq.com/hooks/...   │
                  │                                                    │
                  │  STEP 0: secret_token gate (security)              │
                  │     If/Else: payload.secret_token == "TR_..."?     │
                  │       NO → exit workflow (rejects spam/abuse)      │
                  │       YES → continue                               │
                  │                                                    │
                  │  STEP 1: Idempotency check                         │
                  │     Look up open opp where contact.email matches  │
                  │     AND quote_submitted_at >= now() - 30d          │
                  │     If found → UPDATE that opp                    │
                  │     If not → CREATE new opp                       │
                  │                                                    │
                  │  STEP 2: Create or update Contact                  │
                  │     (dedupe by email + phone)                     │
                  │                                                    │
                  │  STEP 3: Set ~60 custom fields from payload        │
                  │                                                    │
                  │  STEP 4: Apply tags                                │
                  │     src-google-ads, svc-bath-resurface,           │
                  │     area-bondi, customer-owner, priority-warm     │
                  │                                                    │
                  │  STEP 5: Compute lead_score (formula)              │
                  │     If >= 40 → trigger W6 (hot lead alert)        │
                  │                                                    │
                  │  STEP 6: Send customer SMS within 60s              │
                  │     (Phase 1A: email-only until Twilio approved)  │
                  │                                                    │
                  │  STEP 7: Send email backup from support@           │
                  │                                                    │
                  │  STEP 8: Slack ping #quotes-in                     │
                  │     (Phase 1A: email to Allan until Slack workspace│
                  │      created)                                     │
                  └────────────────────────────────────────────────────┘
                                          │
                                          ▼
                  Lead lands at Stage 1 "Quote Requested"
                  You triage within 24 hours
                  → Stage 2 (need more info) OR Stage 5 (send quote) OR Stage 7 (need site visit)
```

**The 6 key wiring touchpoints between form and GHL:**

| # | Touchpoint | What fires | When you do this |
|---|---|---|---|
| 1 | `GHL_WEBHOOK` URL in form code | Customer submits → POST to GHL inbound webhook | Day 5 of setup (after building W1) |
| 2 | `GHL_PARTIAL` URL in form code | Customer fills Step 1, leaves → POST to partial webhook | Same day |
| 3 | `secret_token` env var in form | Validates legitimate form submits, blocks bots | Same day |
| 4 | Cloudinary signed upload (Phase 1B) | Photos go to Cloudinary, URLs into GHL | Once Cloudinary signed up |
| 5 | Stripe deposit link template | Allan creates payment link, named with convention | Day 7 of setup |
| 6 | Slack incoming webhook URLs | GHL workflow → Slack channel pings | Day 4 of setup (after Slack workspace created) |

---

## 3. The 8-day GHL admin checklist (your work, condensed)

Per spec §10. Each step is concrete. ~30-90 min per day, can compress if you're available.

### Day 1 — Foundation (60 min)

- [ ] **GHL Settings → Business Profile:** name `Timeless Resurfacing`, ABN `30 412 161 602`, address (per ASIC), **timezone `Australia/Sydney` AT LOCATION LEVEL** (Reddit gotcha — workflows default to account TZ otherwise)
- [ ] **GHL Settings → Domains/Email:** add SPF, DKIM, DMARC records on `timelessresurfacing.com.au` so emails don't go to spam (Reddit regret #1: shared Mailgun IPs drop open rates from 35-40% to 9% without these)
- [ ] **Engage Sprintlaw** (~$200) for Privacy Policy + Customer ToS templates (~1 week turnaround)

### Day 2 — Custom fields + pipeline (90 min)

- [ ] **GHL Settings → Custom Fields → Contacts:** create all contact-level fields per spec §4 (snake_case names)
- [ ] **GHL Settings → Custom Fields → Opportunities:** create all opp-level fields per spec §4 (including `submission_id`, `trace_id`, `estimated_profit`, `quote_expires_at`, etc.)
- [ ] **GHL Pipelines → Create new pipeline `Sales`** with all 15 stages (in exact order from §2)
- [ ] **Saved view:** "Active Phase 1" filter that hides stages 3 + 4
- [ ] **Tags:** seed top 20 tags from spec §5

### Day 3 — Email + SMS templates (60 min)

- [ ] Create email templates: `auto-reply-new-quote`, `email-quote-sent`, `email-warranty`, `email-cadence-day-10`
- [ ] Create SMS templates (Phase 1B — gate behind Twilio approval): `sms-ack-60s`, `sms-quote-sent`, `sms-cadence-day-1` (24h), `sms-cadence-day-3` (72h), `sms-deposit-thanks`, `sms-day-before`, `sms-completion`, `sms-nps-request`, `sms-promoter-review`, `sms-missed-call`
- [ ] **Sender display name in templates:** use `"Timeless"` (11 chars — fits AU carrier limits) NOT `"Timeless Resurfacing"` (would truncate to "Timeless Resurfac")

### Day 4 — Slack workspace + webhook URLs (30 min)

- [ ] Create free Slack workspace
- [ ] Channels: `#quotes-in`, `#new-jobs`, `#job-issues`, `#hot-leads`, `#pipeline-feed`, `#automation-errors`
- [ ] Apps → Incoming Webhooks → create webhook URL per channel; copy each URL

### Day 5 — Build SAFE workflows (W1, W7) (90 min)

- [ ] **W1 New Lead:** trigger = Inbound Webhook → copy URL → paste into form's `GHL_WEBHOOK` env var
- [ ] First action: If/Else gate on `secret_token` (security)
- [ ] Idempotency lookup BEFORE creating opp (Cleo's catch — prevents duplicate opps)
- [ ] All field-set actions, tag actions, lead-score formula
- [ ] Slack ping action → `#quotes-in` (Custom Webhook to incoming webhook URL)
- [ ] **W7 Stage Logger + Error Channel:** trigger = any stage change OR workflow failure → Slack `#pipeline-feed` / `#automation-errors`
- [ ] Test: submit on staging, verify lead lands, Slack pings fire

### Day 6 — Customer-facing workflows (90 min)

- [ ] **W3 Quote-Sent Cadence:** trigger = stage entered Stage 5; dynamic `quote_expires_at`; 24h SMS / 72h SMS / 10d email; auto-Lost at 14d silently. Pause when in Stage 2 (Q&A).
- [ ] **W5 NPS:** trigger = stage entered Stage 13; wait 4h; SMS request; branch by score. **Allan picks Option A (universal review ask delayed for detractors) OR Option B (NPS internal-only).** Cleo recommends A.
- [ ] **W6 Lead-Score 40 Trigger:** trigger = field update on `lead_score`; if >= 40 → priority-hot tag + Slack `#hot-leads` + SMS to Allan with one-tap call link

### Day 7 — Stripe + manual workflow (60 min)

- [ ] Stripe activation must be complete (Marko ID verification done)
- [ ] Create payment-link template: name like *"Timeless Deposit — [contact_name] — [opp_id_short]"*
- [ ] Phase 1B: configure GHL native `Invoice Paid` trigger to auto-advance Stage 8→9 and 14→15

### Day 8 — End-to-end test + go live (90 min)

- [ ] Submit a real form (yourself as customer, real phone/email)
- [ ] Walk through stages manually 1 → 5 → 6 → 8 → 9 → 12 → 13 → 14 → 15
- [ ] Verify each Slack channel receives the right pings
- [ ] Verify NPS workflow fires (advance to 13, wait 4h, see SMS arrive)
- [ ] **Configure form's `GHL_WEBHOOK` + `GHL_PARTIAL` env vars** to live URLs
- [ ] **First real quote:** Marko's prior regrouting customer (perfect first case study, soft-locked per STATE.md §8)

### Day 9-10+ — Phase 1B activation as integrations land

- [ ] When Twilio approved → buy AU mobile → sync to GHL → activate W2, W4, switch SMS-disabled actions to active
- [ ] When Cloudinary signs up → deploy backend signer → switch photo storage from base64 to URL
- [ ] When Sender ID approved → enable Google Ads with confidence

---

## 4. What's blocking what

| Blocker | Blocks | Owner | ETA |
|---|---|---|---|
| Twilio AU bundle approval | W2 (abandoned quote SMS), W4 (missed-call text-back), all customer-facing SMS | Allan (in flight) | 1-5 days |
| ACMA Sender ID Registry | Google Ads launch (not just SMS) | Allan, paired with Twilio | When Twilio approved |
| Cloudinary AU signup | Photo upload in form (Phase 1B); Phase 1A uses base64-in-text-field hack | Allan | 30 min when ready |
| Sprintlaw Privacy Policy + Customer ToS | First quote sent to a customer | Allan (~$200, ~1 week) | 1 week |
| Stripe activation completion | Stage 8 (Prepayment) automation; Phase 1A uses dashboard-manual | Marko ID verification | When verified |
| Marko PL Insurance + asbestos cert | First sub onboarded; Phase 1 jobs done by Marko himself | Marko | When done |

---

## 5. Allan's outstanding decisions

Before locking the spec canonical, you owe these:

1. **W5 NPS: Option A or B?**
   - **A:** all completed customers get NPS at 4h post-job; promoters (9-10) + passives (7-8) both get Google review request 24h later; detractors (0-6) get Marko call within 60min, review request HELD until issue resolved.
   - **B:** NPS internal-only — score recorded for your dashboard, no automated Google review prompt at all. You/Marko ask manually when feels right.
   - **Cleo's rec:** A. Avoids ACCC review-gating violation while preserving leverage.

2. **Stage 6→7 site-inspection threshold:** spec says $2K + risk flags (Cleo's call lower from $3K). Confirm or override?

3. **Stage 10 hold timer:** spec says 14d force-decision (was 30d in v1). Confirm or override?

4. **Lead score threshold:** spec says 40 (was 30). Confirm or override?

5. **Sender display name:** spec says `"Timeless"` (11 chars). Confirm or override (e.g. you'd rather use the AU mobile number as sender, no branded ID)?

---

## 6. After Cleo's final discussion pass

Cleo is doing the final discussion pass right now. When she returns:
- If she signs off → I lock spec as **CANONICAL**
- If she pushes back → I revise + re-iterate
- Either way, after that you start Day 1 of the setup checklist

---

## 7. Questions I still owe answers to (when in your GHL admin)

These ONLY confirmable in your actual account:

1. **Opportunity custom field overwrite gotcha** — research found that opp fields silently save to contact, so repeat customers overwrite. Verify by creating 2 test opps for 1 contact, edit a field on one, see if other gets overwritten. Architectural decision depends on this.
2. **Premium execution counter** — find the dashboard showing remaining free executions (we get 100 lifetime per sub-account)
3. **Inbound webhook payload variable syntax** — confirm `{{inboundWebhookRequest.body.field_name}}` works inside If/Else conditions

These take ~15 minutes. Do during Day 5 of setup, not blocking earlier days.

— Clifford, 2026-05-05 PM
