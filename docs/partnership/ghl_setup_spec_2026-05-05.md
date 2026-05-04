---
name: GHL Setup Spec — 15-stage pipeline + form hookup (DRAFT for Allan)
description: The complete executable setup for connecting the React quote form into GoHighLevel like Surface Care does. Stage-by-stage detail, end-to-end data flow, exact GHL admin steps. Status DRAFT — Allan reviews and signs off, then we lock as canonical.
type: project
originSessionId: 2026-05-05-ghl-setup-spec
status: DRAFT — awaiting Allan sign-off, then becomes canonical setup guide
authors: Clifford (Claude/Anthropic) + Cleo (Codex/OpenAI) — partnership co-CEOs
date: 2026-05-05
references:
  - memory/plan_ghl_setup_draft_v2_2026-05-05.md (parent plan)
  - memory/research_ghl_pipeline_2026-05-04.md (Jordan playbook source)
  - memory/cleo_followup_review_2026-05-04.md (Cleo's stage verdicts)
  - memory/feedback_form_is_intake_not_quoting.md (locked design rule)
  - master-repo/docs/CEO.md (CEO authority)
  - master-repo/docs/STATE.md (verified facts)
  - master-repo/docs/roles/expert-ghl-operator.md (the lens for this doc)
---

# GHL Setup Spec — 15-stage pipeline + form hookup

## 0. Read this first

**What this is:** The complete blueprint for how every customer flows through your GoHighLevel account, from the moment they hit submit on the quote form to the moment they pay the final invoice. It covers:
- The 15 pipeline stages, what each one means, who owns it, what fires automatically
- The end-to-end data flow from React form → GHL → Stripe → completion
- The exact custom fields, tags, workflows, and integrations needed
- A day-by-day setup checklist Allan can follow inside GHL admin

**Status:** DRAFT. Read it, mark up what doesn't fit, push back where Cleo or I missed your reality. Once you sign off, this becomes the canonical reference and we don't re-litigate.

**Length:** Long. Allan asked for "deeply and carefully" — the doc reflects that. Skim §1 for the stages, §8 for the setup steps. The detail in between is reference for when you're configuring or debugging.

**Locked context (from earlier work):**
- 15 stages, exact Jordan/Surface Care list (not 7, not 13, not 17 — exactly 15)
- Stages 3 + 4 (sub-quote) hidden Phase 1 until first sub onboarded
- Stage 9 (ServiceM8) = "ready to schedule" bucket Phase 1; ServiceM8 hookup is Phase 2
- GHL Starter ~$155 AUD/mo (~$97 USD), 30-day affiliate trial active until 2026-05-27
- Photos via Cloudinary signed upload → URLs stored as GHL text fields (not GHL native File Upload)
- Slack via GHL outbound webhook → Slack incoming webhook URL (NOT native, NOT Zapier)
- Anti-slip baked into shower floor resurface SKUs by default (no form question)
- NPS automated Phase 1 with auto-filter (Allan's reversal of Cleo's "skip" recommendation)
- Form submission IS the consent (no ACMA opt-in checkboxes, no consent_copy_version)

---

## 1. The 15 stages — detailed walkthrough

The pipeline is named **"Sales"** in GHL. Every customer enters at Stage 1 and exits at Stage 15 (or a "Lost" terminal). Each stage represents a state the customer/lead is in — what's happened, what's expected next.

For each stage below: **Purpose** (one-line), **In this stage** (what's true while a contact is here), **Entry** (how they got here), **Exit** (how they leave), **Automation** (what fires while they're here), **Owner** (who acts), **Customer-facing** (what they experience), **GHL-visible** (what Allan sees on the pipeline card), **SLA** (time expectation).

### Stage 1 — **Quote Requested**
- **Purpose:** Lead has just submitted the quote form. Raw lead, not yet triaged.
- **In this stage:** Contact created, opportunity created at Stage 1, all custom fields populated from form payload, photos uploaded to Cloudinary URLs, lead score computed, tags applied.
- **Entry:** Inbound webhook from React form (full submit) OR manual creation by Allan from a phone call.
- **Exit:** Allan's decision — move to Stage 2 (needs more info) OR Stage 5 (ready to send quote) OR Stage 7 (needs site inspection).
- **Automation:**
  - W1 fires: contact + opp created, fields set, tags applied, lead score computed
  - SMS to customer within 60s: *"Got your bathroom quote request, [name]! Allan or Marko will respond within 24h. Reply STOP to opt out. — Timeless Resurfacing"*
  - Email backup from `support@`
  - Slack ping to `#quotes-in` with name, suburb, services, score, photo count
  - If lead_score ≥ 30: also fires W6 (priority-hot SMS to Allan)
- **Owner:** System creates; Allan triages within 24h.
- **Customer-facing:** SMS arrives within 60 seconds confirming receipt.
- **GHL-visible:** Card shows contact name, suburb, service tags, photo thumbnails (from Cloudinary URLs), lead score, "Quote Requested 2h ago".
- **SLA:** Triage within 24h.

### Stage 2 — **Q&A (Clarification)**
- **Purpose:** Allan needs more info from the customer before he can quote. Photos unclear, scope ambiguous, asbestos clarification, access details.
- **In this stage:** A specific clarification question has been sent to the customer (via SMS or email). Waiting on their reply.
- **Entry:** Allan moves card from Stage 1 manually + types the clarification question into a custom field `qa_question` + sends via GHL conversation.
- **Exit:** Customer replies → Allan moves to Stage 5 (ready to quote) OR back to Stage 1 if reply re-opens scope.
- **Automation:**
  - When card enters Stage 2: SMS sent automatically with the clarification question (workflow reads `qa_question` field).
  - Auto-age timer: if 4h passes with no reply, Slack ping to `#quotes-in`: *"[name] has been in Q&A for 4h+ — chase needed."*
  - Customer reply detected (GHL conversation hook) → Slack ping to `#quotes-in`: *"[name] replied — back to Allan."*
- **Owner:** Allan owns the question; Marko helps if it's about access/scope.
- **Customer-facing:** Receives an SMS asking the specific question. Replies via SMS.
- **GHL-visible:** Card shows the question + waiting timer.
- **SLA:** Resolved within 24h ideally; auto-age at 4h.

### Stage 3 — **Sub-quote Requested** *(HIDDEN Phase 1)*
- **Purpose:** When we engage a subcontractor for specialist work (waterproofing, plumbing, demolition), we ask them for a sub-quote before quoting the customer.
- **Phase 1 status:** Stage exists in GHL but **filtered out of Allan's default view**. No workflows fire here. Will activate when first sub onboards.
- **Phase 2 entry:** Service mix flagged as "needs sub trade" (e.g. customer wants tile demolition + we don't do that).
- **Phase 2 exit:** Sub responds → Stage 4.
- **Why we keep the stage day-0:** Renumbering the pipeline later breaks every workflow + Slack message + report. Hide cheaply now, activate cheaply later.

### Stage 4 — **Sub-quote Received** *(HIDDEN Phase 1)*
- **Purpose:** Sub has come back with a price. We feed it into our customer quote.
- **Phase 1 status:** Same as Stage 3 — hidden, no workflows.
- **Phase 2 entry:** Sub-quote arrives via webhook from sub agreement form.
- **Phase 2 exit:** Numbers added to our resolved quote → Stage 5.

### Stage 5 — **Quote Sent**
- **Purpose:** Customer has received the formal quote (PDF or GHL document) + a Stripe payment link for the deposit. Awaiting their decision.
- **In this stage:** Quote document + Stripe deposit link sent via email AND SMS. Customer can accept (deposit pays) or ignore.
- **Entry:** Allan clicks "Send Quote" button (GHL action) → workflow fires. OR auto-routed from Stage 1 if all fields complete.
- **Exit:** Customer pays deposit (Stripe webhook) → Stage 6 → auto-advance to Stage 8. OR 14d cadence completes → moved to Lost terminal.
- **Automation (W3 — Quote-Sent Cadence):**
  - Email + SMS at Stage entry: quote PDF + deposit link
  - Wait 24h → if not Accepted: SMS *"Hi [name], just checking in on your bathroom quote — any questions? Reply STOP to opt out."*
  - Wait 48h (cumulative 72h) → if not Accepted: SMS *"Last call — your bathroom quote expires Friday. Want a quick text back? Reply STOP."*
  - Wait 7d (cumulative 10d) → if not Accepted: email *"Last chance — your quote expires in 2 days."*
  - Wait 4d (cumulative 14d) → if not Accepted: move to Lost, tag `flag-quote-expired`
  - **Tenant exclusion:** if `customer_type=tenant`, skip the 24h+72h SMS (tenant might not have authority to accept fast).
- **Owner:** Customer.
- **Customer-facing:** Quote PDF + payment link via email + SMS. Then 4 follow-up touches over 14 days.
- **GHL-visible:** Card shows "Quote Sent 2d ago", "Cadence step 2/4 fires in 22h".
- **SLA:** 14d total cadence, then move to Lost.

### Stage 6 — **Quote Accepted**
- **Purpose:** Customer has clicked Accept (or paid deposit). Brief transitional state — the system auto-advances them to either Stage 7 (site inspection needed) or Stage 8 (ready for prepayment processing).
- **In this stage:** ~5-15 minutes max.
- **Entry:** Stripe `checkout.session.completed` webhook OR Allan manually marks accepted.
- **Exit:** Auto-routes within minutes:
  - If quote total ≥ $3,000 OR strata/commercial OR asbestos flag: → Stage 7 (Site Inspection)
  - Otherwise: → Stage 8 (Prepayment)
- **Automation:**
  - Email + SMS to customer: *"Thanks [name] — we've got your acceptance. [Site inspection booked / Or proceed straight to deposit invoice]."*
  - Slack ping to `#new-jobs`: *"NEW SIGNED QUOTE: [name] in [suburb] — $[total] — [services] — Stage 6"* with link to GHL contact.
- **Owner:** System auto-routes.
- **Customer-facing:** Confirmation message of acceptance.
- **GHL-visible:** Brief flash; card auto-advances within minutes.
- **SLA:** Auto-route within 15 minutes.

### Stage 7 — **Site Inspection**
- **Purpose:** For complex / high-value / strata / commercial / asbestos jobs, we book a physical site inspection before locking the price.
- **In this stage:** Site inspection has been booked into GHL calendar. Either Allan or Marko will attend.
- **Entry:** Auto-route from Stage 6 OR manual move from Stage 1 (if Allan flags during triage).
- **Exit:** Inspection complete → Allan adjusts quote if needed → Stage 8 (Prepayment).
- **Automation:**
  - When stage entered: customer offered calendar booking link (GHL native calendar). Day-before reminder SMS.
  - Inspector marks "complete" → workflow advances to Stage 8.
- **Owner:** Allan or Marko.
- **Customer-facing:** Calendar invite + day-before reminder SMS + inspection appointment.
- **GHL-visible:** Card shows scheduled inspection time + assigned inspector.
- **SLA:** Inspection booked within 7 days of acceptance.

### Stage 8 — **Prepayment**
- **Purpose:** Awaiting the customer's deposit (10% of quote total per Surface Care model).
- **In this stage:** Stripe deposit invoice has been sent. Customer hasn't paid yet OR is in process.
- **Entry:** Auto-route from Stage 6 (small jobs) OR Stage 7 (after inspection) → workflow generates Stripe invoice with `metadata.payment_type=deposit`.
- **Exit:** Stripe webhook `invoice.paid` (matched by `metadata.payment_type=deposit`) → Stage 9.
- **Automation:**
  - Stripe deposit invoice generated automatically with metadata: `payment_type=deposit`, `contact_id=`, `opportunity_id=`, `quote_id=`, `job_id=` (if assigned).
  - Day-3 reminder SMS if not paid: *"Hi [name], your deposit secures your booking date. Pay here: [link]"*
  - Day-7 reminder + Slack ping if not paid: *"[name] hasn't paid deposit after 7d — chase or release."*
- **Owner:** Customer pays; system tracks.
- **Customer-facing:** Stripe payment link, reminders if delayed.
- **GHL-visible:** Card shows "Deposit invoice sent [date]", "Awaiting payment".
- **SLA:** Paid within 7 days; chase at 3, 7.

### Stage 9 — **Job in ServiceM8** *(Phase 1: "ready to schedule" bucket)*
- **Purpose Phase 1:** Bucket for jobs that are paid + ready to be scheduled but ServiceM8 isn't connected yet. Allan + Marko manually coordinate.
- **Purpose Phase 2:** Webhook creates the ServiceM8 job; ServiceM8 becomes the source of truth for field operations.
- **Phase 1 entry:** Stripe webhook `invoice.paid` on deposit invoice → auto-advance.
- **Phase 1 exit:** Allan/Marko schedules the date → manual move to Stage 12 (Job Booked).
- **Phase 2 entry:** Same trigger; webhook fires to ServiceM8 to create job.
- **Phase 2 exit:** ServiceM8 job marked scheduled → workflow auto-moves to Stage 12.
- **Automation:**
  - Phase 1: Slack ping to `#new-jobs`: *"DEPOSIT PAID, ready to schedule: [name] — [services] — [suburb]"*
  - Phase 2: Outbound webhook to ServiceM8 API → creates job with all relevant fields
- **Owner:** Marko (operations).
- **Customer-facing:** SMS *"Got your deposit — Marko will be in touch within 48h to lock in your date."*
- **GHL-visible:** Card shows "Ready to schedule" + day count waiting.
- **SLA:** Scheduled within 48h of deposit payment.

### Stage 10 — **Job on Hold**
- **Purpose:** Job paused for a defined reason — customer reschedule, awaiting access, materials backlog, weather (rare for indoor work).
- **In this stage:** A `hold_reason` custom field is required (dropdown: customer_reschedule, access_pending, materials_delay, other). Slack alert fires on entry.
- **Entry:** Manual move from any stage 9-12.
- **Exit:** Resolved → Allan/Marko manually move back to the appropriate stage.
- **Automation:**
  - On entry: Slack ping to `#job-issues`: *"[name] ON HOLD — reason: [hold_reason]"*
  - Weekly review: every Monday, Slack digest of all jobs in Stage 10 with days held
- **Owner:** Marko monitors; Allan resolves customer-side issues.
- **Customer-facing:** Depends on hold reason — usually SMS explaining the delay + new ETA.
- **GHL-visible:** Card highlighted in orange/yellow + hold reason visible.
- **SLA:** Reviewed weekly; max hold 30d before forced resolution.

### Stage 11 — **Job Issue**
- **Purpose:** Defect, callback, or complaint after work has commenced. Distinct from Stage 10 (planned hold) — Stage 11 is unplanned problems.
- **In this stage:** Issue logged in `issue_description` field. Slack alert is high-priority.
- **Entry:** Marko or customer reports issue (manual move OR customer SMS pattern-match triggers).
- **Exit:** Issue resolved → back to Stage 13 (Job Complete) OR Stage 12 (Job Booked) for re-attempt.
- **Automation:**
  - On entry: Slack ping to `#job-issues` (high priority): *"[name] JOB ISSUE: [description]"* — also SMS to Allan
  - Customer SMS to confirm we're addressing it: *"Hi [name], we've heard your concern about [job] — Allan will call you within 60min."*
- **Owner:** Allan (escalation point).
- **Customer-facing:** Direct call from Allan within 60 minutes.
- **GHL-visible:** Card highlighted in red. SLA timer prominent.
- **SLA:** Allan response within 60 minutes during business hours.

### Stage 12 — **Job Booked**
- **Purpose:** Date locked, crew assigned, calendar populated. Awaiting the work day.
- **In this stage:** Calendar event created, customer notified, day-of reminders set.
- **Entry:** From Stage 9 (Phase 1 manual) OR ServiceM8 schedule sync (Phase 2).
- **Exit:** Day-of: Marko/sub marks job started → Stage 13 (Job Complete) once finished.
- **Automation:**
  - Day-before SMS to customer: *"Hi [name], we're booked in for tomorrow [date] from [time]. Marko will call when he's 30 min out."*
  - Day-of: Marko marks "On site" via GHL action OR ServiceM8 push.
  - Job complete → Marko marks "Complete" + uploads after-photos → Stage 13.
- **Owner:** Marko (or sub Phase 2).
- **Customer-facing:** Booking confirmation + day-before reminder + arrival message.
- **GHL-visible:** Card shows scheduled date + assigned crew.
- **SLA:** Job day arrives as booked.

### Stage 13 — **Job Complete**
- **Purpose:** Work done. Quality checked. Customer signed off. Final invoice incoming.
- **In this stage:** After-photos uploaded, customer-acknowledgement received, NPS workflow scheduled.
- **Entry:** Marko/sub marks complete + uploads required after-photos.
- **Exit:** Allan reviews + final invoice generated → Stage 14.
- **Automation:**
  - On entry: customer SMS *"Hi [name], your bathroom is done! Cure time is [duration]. Final invoice on its way. Hope you love it 💎"*
  - Schedule W5 (NPS): trigger in 4h after entry
  - Slack ping to `#new-jobs`: *"COMPLETED: [name] — review after-photos"*
- **Owner:** Allan reviews quality + signs off.
- **Customer-facing:** Completion message + cure-time guidance.
- **GHL-visible:** Card shows "Complete [time]", after-photos thumbnails.
- **SLA:** Allan reviews within 24h.

### Stage 14 — **Job Invoiced**
- **Purpose:** Final invoice (90% balance) sent to customer. Awaiting payment.
- **In this stage:** Stripe final invoice sent with metadata `payment_type=final`.
- **Entry:** Allan signs off Stage 13 → workflow generates final invoice.
- **Exit:** Stripe webhook `invoice.paid` (matched by `metadata.payment_type=final`) → Stage 15.
- **Automation:**
  - Final invoice generated with metadata: `payment_type=final`, `contact_id`, `opportunity_id`, `quote_id`, `job_id`
  - Customer SMS + email with payment link
  - Day-3 reminder if unpaid
  - Day-7 reminder + Slack ping if unpaid
  - Day-14 escalation: Slack alert to Allan with subject *"OVERDUE — [name] $[balance] not paid 14d"*
- **Owner:** Customer pays.
- **Customer-facing:** Final invoice + reminders + escalation.
- **GHL-visible:** Card shows "Final invoice sent [date]", balance owed.
- **SLA:** Paid within 7 days; chase at 3, 7, 14.

### Stage 15 — **Job Paid** *(terminal)*
- **Purpose:** Final money in. Job closed. Warranty period begins. NPS workflow already in flight from Stage 13.
- **In this stage:** Customer is done. We're done. Warranty doc emailed automatically. NPS may have already returned a score by now.
- **Entry:** Stripe webhook on final invoice paid → auto-advance.
- **Exit:** Terminal — opportunity closed, contact remains in CRM for repeat business + warranty queries.
- **Automation:**
  - Customer email: warranty document + care instructions
  - Customer SMS: *"Thanks [name] 🙏 — warranty doc on its way. If anything comes up, reply here or call/text 0451 110 154. We'll check in around the 3-month mark."*
  - Tag `customer-completed` applied
  - Slack ping to `#new-jobs`: *"PAID + CLOSED: [name] — $[total] — [completion date]"*
  - Schedule reactivation outreach: 3-month check-in SMS, 12-month maintenance reminder (Phase 2 — manual until volume justifies)
- **Owner:** System (terminal).
- **Customer-facing:** Warranty doc + thank-you + future contact.
- **GHL-visible:** Card moves to "Won" terminal column.
- **SLA:** Closed within 24h of final payment.

### Lost terminal
- **Purpose:** Customer didn't proceed (quote expired, ghosted, declined).
- **Entry:** From Stage 5 cadence completion OR manual move.
- **Tags:** `flag-quote-expired` OR `flag-customer-declined` OR `flag-ghosted`
- **Future:** Reactivation campaign at 90d (Phase 2).

---

## 2. End-to-end data flow (the whole journey)

```
[CUSTOMER]                [REACT FORM]               [VERCEL/NETLIFY FN]      [CLOUDINARY]              [GHL]                   [STRIPE]                [SLACK]
   |                           |                            |                       |                       |                       |                       |
   |--Visits landing page------|                            |                       |                       |                       |                       |
   |                           |                            |                       |                       |                       |                       |
   |--Step 1: name+phone+email-|                            |                       |                       |                       |                       |
   |                           |--POST /partial-webhook-----|---POST GHL_PARTIAL------------------------------>|                       |                       |
   |                           |                            |                       |                       |--Tag flag-abandoned---|                       |
   |                           |                            |                       |                       |  ...if no full submit |                       |
   |                           |                            |                       |                       |  in 4h, fires W2 SMS  |                       |
   |--Step 2-4: fills areas----|                            |                       |                       |                       |                       |
   |                           |                            |                       |                       |                       |                       |
   |--Step 5: uploads photos---|                            |                       |                       |                       |                       |
   |                           |--GET /api/cloudinary-sig---|                       |                       |                       |                       |
   |                           |<--signed upload params-----|                       |                       |                       |                       |
   |                           |--POST file (multipart)---------------------------->|                       |                       |                       |
   |                           |<--{secure_url, public_id}------------------------|                       |                       |                       |
   |                           |  (loops per photo)                                                          |                       |                       |
   |--Hits Submit--------------|                            |                       |                       |                       |                       |
   |                           |--POST GHL_WEBHOOK----------|--POST--------------------------------------->|                       |                       |
   |                           |  (full payload incl photo URLs)                                            |--Create contact-------|                       |
   |                           |                            |                       |                       |--Create opportunity   |                       |
   |                           |                            |                       |                       |  at Stage 1           |                       |
   |                           |                            |                       |                       |--Set custom fields----|                       |
   |                           |                            |                       |                       |--Apply tags-----------|                       |
   |                           |                            |                       |                       |--Compute lead score---|                       |
   |                           |                            |                       |                       |--W1 fires-------------|                       |
   |                           |                            |                       |                       |  -> SMS to customer   |                       |
   |                           |                            |                       |                       |  -> Slack #quotes-in--------------------------->|
   |--SMS arrives (60s)<----------------------------------------------------------|                       |                       |                       |
   |                           |--Show success screen-------|                       |                       |                       |                       |
   |                           |--Fire GA4 quote_submit-----|                       |                       |                       |                       |
   |                           |                            |                       |                       |                       |                       |
   |  ====== ALLAN TRIAGES (Stage 1 -> 2/5/7) ======                                                       |                       |                       |
   |                           |                            |                       |                       |                       |                       |
   |  [If Stage 5 Quote Sent]                                                                               |                       |                       |
   |<-Quote PDF + Stripe link-(via email+SMS)-------------------------------------------------------------|--Generate Stripe invoice                       |
   |                           |                            |                       |                       |  with metadata.payment_type=deposit --------->|
   |                           |                            |                       |                       |                       |                       |
   |--Pay deposit------------------------------------------------------------------------>|--Stripe webhook |                       |                       |
   |                           |                            |                       |                       |<-payment_intent.succeeded-----------|         |
   |                           |                            |                       |                       |--Move to Stage 6 -> 8 -> 9 ---------|         |
   |                           |                            |                       |                       |--Slack #new-jobs ping ----------------------->|
   |                           |                            |                       |                       |                       |                       |
   |  ====== JOB EXECUTED ======                                                                            |                       |                       |
   |                           |                            |                       |                       |--Stage 12 -> 13      |                       |
   |--After photos uploaded by sub-------------------------------------|>(direct to GHL via app)             |                       |                       |
   |--Final invoice------------------------------------------------------------------------------>|--Stripe with metadata.payment_type=final ------->|
   |--Pay final---------------------------------------------------------------->|<-webhook------|--Move to Stage 14 -> 15 ---------|
   |                                                                                                        |--Warranty email------|                       |
   |                                                                                                        |--NPS SMS (W5)---------|                       |
   |--NPS reply 0-10---------------------------------------------------------------------------|--Branch on score:                |                       |
   |                                                                                                        |  9-10 -> Google review prompt                |
   |                                                                                                        |  7-8 -> silent                                |
   |                                                                                                        |  0-6 -> Slack #job-issues + Allan call ------>|
```

---

## 3. Custom field schema

GHL custom fields live at two levels: **Contact** (the person, persists across opps) and **Opportunity** (this specific quote/job). Build these BEFORE workflows reference them — renaming after = broken workflows.

### Contact-level fields

| Field name (use snake_case) | Type | Values / format | Purpose |
|---|---|---|---|
| `property_type` | Dropdown | `owner_occupier`, `rental_landlord`, `rental_tenant`, `strata_unit`, `commercial`, `unsure` | Drives warranty + pricing tier |
| `property_age` | Dropdown | `<5y`, `5-15y`, `15-30y`, `30y+`, `unsure` | Underwriting + asbestos screening cue |
| `built_before_1990` | Dropdown | `yes`, `no`, `unsure`, `not_asked` | Asbestos screening flag (Excel rejection #8) |
| `tenant_auth` | Dropdown | `self`, `send`, `n/a` | Tenant landlord-approval flow |
| `landlord_email` | Email | | Set when `tenant_auth=send` |
| `lead_source` | Dropdown | `google_ads`, `seo_organic`, `referral`, `social`, `direct`, `other` | Attribution baseline |
| `utm_source` | Text | | Per-channel attribution |
| `utm_medium` | Text | | |
| `utm_campaign` | Text | | |
| `utm_term` | Text | | |
| `utm_content` | Text | | |
| `gclid` | Text | | Google Ads click ID — ties lead to keyword |
| `gbraid` | Text | | iOS conversion tracking |
| `wbraid` | Text | | iOS conversion tracking |
| `landing_page` | Text | URL path | Which service page they came from |
| `lead_score` | Numeric | 0-100+ | See §10 lead scoring |
| `lifecycle_stage` | Dropdown | `lead`, `mql`, `sql`, `customer`, `lost` | High-level funnel state |
| `first_seen_at` | Datetime | ISO timestamp | Cohort analysis |
| `device_type` | Dropdown | `mobile`, `tablet`, `desktop` | UX iteration data |

### Opportunity-level fields

| Field name | Type | Values / format | Purpose |
|---|---|---|---|
| `quote_submitted_at` | Datetime | | SLA timing |
| `quote_partial_at` | Datetime | | When Step 1 fired (W2 abandoned-quote timing) |
| `bathroom_count` | Numeric | 1-5+ | |
| `bathroom_index` | Numeric | 1-5+ | When customer is on bathroom #2, #3 etc |
| `selected_areas` | Multi-select | `shower`, `bath`, `basin_vanity`, `walls`, `floor` | Comma-separated string — pipeline card visible |
| `full_bathroom_mode` | Dropdown | `yes`, `no` | |
| `full_bathroom_scope` | Dropdown | `regrout_only`, `resurface_only`, `both`, `n/a` | When full_bathroom_mode=yes |
| `service_shower` | Dropdown | `none`, `full_regrout`, `resurface`, `both` | Per-area service |
| `service_bath` | Dropdown | `none`, `resurface`, `chip_repair`, `both` | |
| `service_basin_vanity` | Dropdown | `none`, `top_only`, `full`, `chip_only`, `custom` | |
| `service_walls` | Dropdown | `none`, `regrout`, `resurface`, `both`, `chip_repair` | |
| `service_floor` | Dropdown | `none`, `regrout`, `resurface`, `both`, `chip_repair` | |
| `epoxy_mode` | Dropdown | `standard`, `epoxy` | Modifier R6 (+$250) |
| `prev_resurfaced` | Dropdown | `yes`, `no`, `unsure`, `not_asked` | Modifier R5 (+$250 strip-back) |
| `has_ventilation` | Dropdown | `yes`, `no`, `not_asked` | Modifier R19 (+$100) |
| `customer_notes` | Long text | | Free-text customer concerns |
| `pricing_tier_resolved` | Dropdown | `T1_premium`, `T2_standard`, `T3_budget` | Form-computed default = T2 |
| `quote_total_min` | Currency (AUD) | | Form-computed range |
| `quote_total_max` | Currency (AUD) | | Form-computed range |
| `quote_total_final` | Currency (AUD) | | Allan-set after photo review |
| `resolved_line_items` | Long text (JSON) | | Quote skeleton |
| `resolved_modifiers` | Long text (JSON) | | Modifiers (epoxy, multi-bathroom, strip-back, etc.) |
| `resolved_rejection_flags` | Long text (JSON) | | E.g. asbestos, hollow-tile concerns |
| `multi_bathroom_discount` | Currency | | -$200 for #2, -$300 for #3+ |
| `photo_count_total` | Numeric | | For lead scoring |
| `qa_question` | Long text | | Stage 2 clarification question |
| `hold_reason` | Dropdown | `customer_reschedule`, `access_pending`, `materials_delay`, `other` | Stage 10 |
| `issue_description` | Long text | | Stage 11 |
| `nps_score` | Numeric | 0-10 | Stage 13 NPS reply |
| `nps_replied_at` | Datetime | | |
| `prepayment_received_at` | Datetime | | Stage 8 -> 9 |
| `final_payment_received_at` | Datetime | | Stage 14 -> 15 |
| `submission_page_url` | Text | URL | Which landing page converted |
| `time_to_complete_sec` | Numeric | | Form completion time (UX iteration data) |
| `form_version` | Text | e.g. `v10.0` | For A/B test rollback |

### Photo URL fields (one per area + others)

These are **text fields** that hold Cloudinary URLs (NOT GHL native File Upload). Format: long-text holding JSON array of `{secure_url, public_id}` per photo.

| Field name | Purpose |
|---|---|
| `photos_bath_urls` | Bath area photos |
| `photos_walls_urls` | Walls photos |
| `photos_floor_urls` | Floor photos |
| `photos_basin_vanity_urls` | Basin/vanity photos |
| `photos_regrouting_urls` | Shower regrout-specific photos (when split from shower) |
| `photos_full_shower_urls` | Full shower (outside-screen + inside) |
| `photos_other_urls` | Catch-all extras |
| `photos_after_urls` | After-photos uploaded by sub at Stage 13 (separate from before) |

### Customer/contact info (use GHL built-in where possible)

| Field | GHL native | Notes |
|---|---|---|
| First Name | ✓ built-in | |
| Last Name | ✓ built-in | |
| Email | ✓ built-in | |
| Phone | ✓ built-in | E.164 format `+61...` — form normalises |
| Address | ✓ built-in (`address.line1`, `city`, `postal_code`) | Form provides via Google Places autocomplete |

---

## 4. Tag taxonomy

Use prefix discipline so the tag list is browsable. **Don't tag for things that have a custom field.**

| Prefix | Examples | Purpose |
|---|---|---|
| `src-` | `src-google-ads`, `src-organic`, `src-referral`, `src-social`, `src-direct` | Primary attribution |
| `svc-` | `svc-bath-resurface`, `svc-shower-regrout-epoxy`, `svc-vanity-respray`, `svc-full-makeover`, `svc-chip-repair` | Service mix (multi-tag if multi-area) |
| `area-` | `area-eastern-suburbs`, `area-inner-west`, `area-north-shore`, `area-northern-beaches`, `area-cbd`, `area-sutherland` | Sydney quadrant for crew routing |
| `customer-` | `customer-owner-occupier`, `customer-rental-landlord`, `customer-rental-tenant`, `customer-strata`, `customer-commercial` | Pricing tier + warranty offer |
| `priority-` | `priority-hot` (lead score ≥30), `priority-warm` (15-29), `priority-cold` (<15) | Visual prioritisation |
| `flag-` | `flag-asbestos-suspected`, `flag-no-photos`, `flag-bot-suspected`, `flag-vip-referral`, `flag-callback-requested`, `flag-abandoned-quote`, `flag-quote-expired`, `flag-customer-declined`, `flag-ghosted`, `flag-photo-upload-failed`, `flag-job-issue` | Manual review needed |
| `phase-` | `phase-quote-cadence-step-1` through `step-4` | Workflow state guards (prevents double-fires) |
| `nps-` | `nps-promoter` (9-10), `nps-passive` (7-8), `nps-detractor` (0-6), `nps-no-reply` | NPS bucketing post-W5 |

---

## 5. The 7 workflows — detailed

### W1 — New Lead from Form

**Trigger:** Inbound webhook `/api/webhooks/ghl-form-submit`
**Conditions:** None (always fire)
**Actions in order:**
1. Create or update contact (dedupe by email + phone match)
2. Create opportunity in Pipeline `Sales` at Stage 1 `Quote Requested`
3. Set all custom fields from payload
4. Apply tags (`src-{lead_source}`, `svc-{service per area}`, `area-{suburb quadrant}`, `customer-{property_type}`)
5. Compute `lead_score` per §10 → set field
6. Apply priority tag based on score (`priority-hot` / `priority-warm` / `priority-cold`)
7. Send Slack message to `#quotes-in` (outbound webhook → Slack incoming webhook URL)
8. Send customer SMS within 60s: *"Got your bathroom quote request, [name]! Allan or Marko will respond within 24h. Reply STOP to opt out. — Timeless Resurfacing"*
9. Send customer auto-reply email from `support@`
10. If `lead_score >= 30`: trigger W6 (Lead-score 30 trigger)
11. If `photo_count_total > 0`: schedule a 5-min retry job to verify Cloudinary URLs are reachable; if not, tag `flag-photo-upload-failed`

### W2 — Abandoned Quote SMS Recovery

**Trigger:** Inbound webhook `/api/webhooks/ghl-form-partial`
**Conditions:**
- No full submit received within 4 hours
- Customer provided phone number
**Actions in order:**
1. Create stub contact, lifecycle_stage=lead, tag `flag-abandoned-quote`
2. Wait 4 hours
3. Re-check: did full submit arrive (look for opportunity with same email)? → If yes, exit
4. Send SMS (Jordan's exact pattern): *"Hi [first_name], Allan from Timeless Resurfacing — saw you started a quote but didn't finish. Want to text me a couple of photos and I'll quote you back within the hour? Reply STOP to opt out."*
5. Wait 48h
6. If no reply: lifecycle_stage=lost-cold, no further automation

### W3 — Quote-Sent Cadence (24h + 72h)

**Trigger:** Opportunity moves to Stage 5 `Quote Sent`
**Conditions:** `customer_type != tenant` (tenants skip — no authority to accept fast)
**Actions in order:**
1. Send quote PDF + Stripe deposit link via email AND SMS
2. Wait 24h → if Stage != 6 (not yet accepted): SMS *"Hi [name], just checking in on your bathroom quote — any questions? Reply STOP to opt out."*
3. Tag `phase-quote-cadence-step-1`
4. Wait 48h (cumulative 72h) → if not Accepted: SMS *"Last call — your bathroom quote expires Friday. Want a quick text back? Reply STOP."*
5. Tag `phase-quote-cadence-step-2`
6. Wait 7d (cumulative 10d) → if not Accepted: email *"Last chance — quote expires in 2 days."*
7. Tag `phase-quote-cadence-step-3`
8. Wait 4d (cumulative 14d) → if not Accepted: move to Lost terminal, tag `flag-quote-expired`
9. The `phase-quote-cadence-step-N` tags prevent double-fires if customer briefly Accepts then reverts.

### W4 — Missed-Call Text-Back

**Trigger:** Twilio `voice.call.no-answer` webhook (Twilio sub-account routes to GHL)
**Conditions:** None
**Actions in order:**
1. Find contact by inbound phone OR create stub (just phone, mark as inbound-call lead)
2. Send SMS within 30 seconds: *"Sorry we missed you! This is Timeless Resurfacing. Allan or Marko will call back within the hour. Or text me what you need and we'll quote. Reply STOP to opt out."*
3. Slack ping to `#hot-leads` with caller phone + (if known) name + GHL contact link

### W5 — NPS Request + Auto-Filter

**Trigger:** Opportunity moves to Stage 13 `Job Complete`
**Conditions:** `customer_type != tenant` AND no `flag-job-issue` tag (those get skipped — they need direct call, not survey)
**Actions in order:**
1. Wait 4 hours (cure-time + customer arrives home + sees finished work)
2. Send SMS: *"Hi [name], how would you rate your experience with Timeless Resurfacing 0-10? Just reply with a number. — Allan & Marko"*
3. Wait for customer SMS reply with number 0-10 (use GHL conversation event detection)
4. Branch on score:
   - **9-10 (Promoter):** wait 24h → SMS *"Thanks [name]! If you've got 60 seconds, would you mind leaving us a Google review? [link]. Helps a lot. Reply STOP to opt out."*; tag `nps-promoter`
   - **7-8 (Passive):** no further action; tag `nps-passive`
   - **0-6 (Detractor):** Slack alert to `#job-issues` with score + customer details + GHL deep link; SMS to Allan: *"DETRACTOR: [name] gave [score] — call within 60min"*; tag `nps-detractor`; Allan calls within 60min
5. **No reply within 7 days:** tag `nps-no-reply`, no further automation

### W6 — Lead-score 30 Trigger (Founder Call Priority)

**Trigger:** Any update to `lead_score` field
**Conditions:** `lead_score >= 30` AND `priority-hot` tag NOT yet applied
**Actions in order:**
1. Apply tag `priority-hot`
2. Send Slack message to `#hot-leads` with: name, phone, suburb, score breakdown, GHL deep link
3. Send SMS to Allan with one-tap call link: *"HOT LEAD — [name] in [suburb], score [N], [services]. Tap: tel:[phone]"*
4. If business hours (8am-6pm Sydney): create GHL task assigned to Allan, due in 15min
5. If outside hours: queue task for next 8am, also send a more relaxed SMS to Allan

### W7 — Stage Transition Logger

**Trigger:** Any opportunity stage change
**Conditions:** None
**Actions in order:**
1. Append to Slack `#pipeline-feed` (outbound webhook): *"[customer] moved [old_stage] → [new_stage] at [time]"*
2. (Phase 2) Outbound webhook to BigQuery / Google Sheets / logging endpoint for daily analytics

---

## 6. Integrations setup

### Slack — incoming webhook (NOT native, NOT Zapier)

1. In Slack: Apps → Incoming Webhooks → Create new webhook for each channel:
   - `#quotes-in` (new submissions)
   - `#new-jobs` (deposit paid, completed, paid)
   - `#job-issues` (problems, callbacks, NPS detractors)
   - `#hot-leads` (lead score ≥30, missed-call text-backs)
   - `#pipeline-feed` (every stage change)
2. Copy each webhook URL (one per channel)
3. In each GHL workflow that posts to Slack: add "Custom Webhook" action → POST to the relevant Slack URL → JSON body:
   ```json
   {
     "text": "🔔 New quote request from [name] in [suburb]",
     "blocks": [
       { "type": "section", "text": { "type": "mrkdwn", "text": "*[name]* — [services] — score [N]\n[suburb] — [phone]" }},
       { "type": "actions", "elements": [{ "type": "button", "text": { "type": "plain_text", "text": "Open in GHL" }, "url": "[ghl_deep_link]" }]}
     ]
   }
   ```
4. Test each channel before going live.

### Stripe — webhook + metadata schema

**Stripe metadata on every invoice/payment_intent we create:**
```jsonc
{
  "payment_type": "deposit" | "final",
  "contact_id": "ghl_contact_id_xxx",
  "opportunity_id": "ghl_opp_id_yyy",
  "quote_id": "internal_quote_ref_zzz",
  "job_id": "ghl_or_servicem8_job_ref"  // empty until Stage 9
}
```

**Stripe → GHL webhook handlers (use Vercel/Netlify function as middleware OR GHL's native Stripe integration):**
- `payment_intent.succeeded` (deposit) → match `metadata.payment_type=deposit` → advance opp Stage 8 → 9, set `prepayment_received_at`
- `payment_intent.succeeded` (final) → match `metadata.payment_type=final` → advance opp Stage 14 → 15, set `final_payment_received_at`
- `payment_intent.payment_failed` → tag `flag-payment-failed`, Slack ping to `#new-jobs`

**Idempotency:** use Stripe's `event.id` as deduplication key. Same event ID processed twice should NOT double-advance stages.

### Cloudinary — signed upload (when account exists)

Backend signer endpoint (Vercel function): `/api/cloudinary-signature`
Reads `CLOUDINARY_API_SECRET` from env, returns signature for the requested upload.

Frontend (already in QuoteForm.jsx, currently stubbed): fetches signature, then POSTs file directly to Cloudinary with signed params.

### Twilio BYOT (when approved)

Per `memory/reference_twilio_ghl_byot.md`:
1. Twilio sub-account approved with AU Regulatory Bundle ✓
2. GHL Disable LC Phone form submitted ✓
3. Buy AU mobile in Twilio
4. Number auto-syncs to GHL → set as default outbound for Sales pipeline

---

## 7. AU compliance touchpoints

| Touchpoint | What | When |
|---|---|---|
| **ACMA Sender ID Registry** | Register AU mobile (and optional alphanumeric `TIMELESS`) | When Twilio approved + before Google Ads launch |
| **Privacy Policy** | Live on website at `/privacy/`, linked from form | Before first quote (Sprintlaw ~$200) |
| **Customer ToS** | In quote PDF, scope + cancellation + ACL clause | Before first quote (Sprintlaw) |
| **ACL warranty disclosure** | *"This warranty does not exclude or limit your rights under the Australian Consumer Law."* on every warranty doc, page, quote PDF | Always |
| **Spam Act inferred consent** | Submit-button line: *"By submitting, you agree we'll contact you about this quote..."* | Already in form |
| **STOP keyword honoring** | Every commercial SMS must respect STOP within 5 working days | Built into GHL workflows |
| **Sender identification** | Every SMS must identify business name | Already in templates |

---

## 8. The setup checklist — exact GHL admin steps

This is the day-by-day sequence. Each step is concrete. Allan can follow it as a recipe.

### Day 1 — Sub-account setup + custom fields (~45 min)

1. **GHL Settings → Business Profile:** Name `Timeless Resurfacing`, ABN `30 412 161 602`, Phone `0451 110 154` (placeholder — replace with AU mobile when Twilio approved), Address per ASIC, Timezone `Australia/Sydney`, Currency `AUD`.
2. **GHL Settings → Custom Fields → Contacts:** Create every contact-level field from §3 above. Use exact snake_case names.
3. **GHL Settings → Custom Fields → Opportunities:** Create every opp-level field from §3, including the photo URL fields.
4. **Settings → Tags:** Pre-seed top 20 tags from §4 for autocomplete; rest will be created automatically by workflows on first use.

### Day 2 — Pipeline + stages (~30 min)

1. **GHL Pipelines → Create new pipeline `Sales`**
2. Add all 15 stages in exact order from §1:
   - 1 Quote Requested
   - 2 Q&A (Clarification)
   - 3 Sub-quote Requested
   - 4 Sub-quote Received
   - 5 Quote Sent
   - 6 Quote Accepted
   - 7 Site Inspection
   - 8 Prepayment
   - 9 Job in ServiceM8
   - 10 Job on Hold
   - 11 Job Issue
   - 12 Job Booked
   - 13 Job Complete
   - 14 Job Invoiced
   - 15 Job Paid
3. **Pipeline → Stage Visibility:** Create a saved filter view "Active Phase 1" that hides stages 3 + 4. Set as Allan's default view.
4. Create terminal/Lost stage if GHL doesn't auto-create.

### Day 3 — Email + SMS templates (~45 min)

Create reusable templates used by workflows:

| Template name | Type | Body (concise) |
|---|---|---|
| `auto-reply-new-quote` | Email | "Got your quote request, [name]! Quote within 24h..." |
| `sms-ack-60s` | SMS | "Got your bathroom quote request, [name]! Allan or Marko will respond within 24h. Reply STOP to opt out. — Timeless Resurfacing" |
| `sms-abandoned-4h` | SMS | "Hi [name], Allan from Timeless Resurfacing..." (full text §5 W2) |
| `email-quote-sent` | Email | "Your bathroom quote — [services] — $[total]..." |
| `sms-quote-sent` | SMS | "Hi [name], your quote is ready: [link] — pay deposit to lock in your date." |
| `sms-cadence-day-1` | SMS | "Hi [name], just checking in on your bathroom quote..." (W3 step 1) |
| `sms-cadence-day-3` | SMS | "Last call — your bathroom quote expires Friday..." (W3 step 2) |
| `email-cadence-day-10` | Email | "Last chance — quote expires in 2 days." |
| `sms-deposit-thanks` | SMS | "Got your deposit — Marko will be in touch within 48h to lock in your date." |
| `sms-day-before` | SMS | "Hi [name], we're booked in for tomorrow [date] from [time]. Marko will call when 30 min out." |
| `sms-completion` | SMS | "Hi [name], your bathroom is done! Cure time is [duration]..." |
| `sms-nps-request` | SMS | "Hi [name], how would you rate your experience with Timeless Resurfacing 0-10? Just reply with a number. — Allan & Marko" |
| `sms-promoter-review` | SMS | "Thanks [name]! If you've got 60 seconds, would you mind leaving us a Google review? [link]" |
| `sms-missed-call` | SMS | "Sorry we missed you! This is Timeless Resurfacing. Allan or Marko will call back within the hour..." |
| `email-warranty` | Email | Warranty doc + ACL clause + care instructions |

### Day 4 — Workflow W1 (New Lead from Form) (~45 min)

This is the most critical workflow. Build it carefully.

1. **GHL Workflows → Create new workflow `W1 New Lead`**
2. **Trigger:** Inbound Webhook → copy the URL
3. Save URL → paste into form's `GHL_WEBHOOK` env var (Vercel env or hard-coded constant)
4. **Action 1:** Create or Update Contact (dedupe by email + phone)
5. **Action 2:** Create Opportunity in Pipeline `Sales` at Stage 1
6. **Action 3:** Set Custom Fields (loop through all the fields from the webhook payload)
7. **Action 4:** Apply Tags (programmatic per fields)
8. **Action 5:** Compute lead_score (use GHL formula or Vercel function — see §10)
9. **Action 6:** If/Else on lead_score: apply priority tag
10. **Action 7:** Custom Webhook → Slack `#quotes-in`
11. **Action 8:** Send SMS using `sms-ack-60s` template
12. **Action 9:** Send Email using `auto-reply-new-quote` template
13. **Action 10:** If lead_score >= 30: trigger W6
14. **Test:** submit a test form, verify contact + opp + tags + Slack ping all appear

### Day 5 — Workflows W2-W4 (~60 min)

1. **W2 Abandoned Quote** — trigger inbound webhook on partial endpoint, condition no full submit in 4h, send SMS
2. **W3 Quote-Sent Cadence** — trigger stage change to Stage 5, branching on tenant, scheduled SMS at 24h+72h+10d+14d
3. **W4 Missed-Call Text-Back** — trigger Twilio webhook, send SMS within 30s, Slack ping `#hot-leads`

### Day 6 — Workflows W5-W7 (~60 min)

4. **W5 NPS Request** — trigger stage entry to 13, wait 4h, branching on score reply
5. **W6 Lead-score 30** — trigger field update on lead_score, branching on score >=30
6. **W7 Stage Transition Logger** — trigger any stage change, post to Slack `#pipeline-feed`

### Day 7 — Integrations (~45 min)

1. **Slack Incoming Webhooks:** create webhooks for each channel, paste URLs into the workflows
2. **Stripe Connection:** GHL native Stripe integration OR Vercel webhook handler
3. **Email DNS:** SPF, DKIM, DMARC records for `timelessresurfacing.com.au` so emails don't go to spam (CRITICAL — without this, all cadence emails hit Gmail spam)
4. **Settings → Calendars:** create "Site Inspection" calendar, link to Allan's Google Calendar, set buffer + travel time

### Day 8 — End-to-end test + go-live (~60 min)

1. **Test 1 — Happy path:** submit form on staging, verify contact + opp + Stage 1, verify Slack ping, verify SMS arrives, verify lead_score computed
2. **Test 2 — Abandoned quote:** start form, abandon, wait 4h, verify SMS arrives
3. **Test 3 — Missed call:** call AU mobile, don't answer, verify text-back within 60s
4. **Test 4 — Stripe deposit:** manually create Stripe deposit invoice, mark as paid, verify Stage 8 → 9 transition
5. **Test 5 — NPS flow:** manually advance an opp to Stage 13, wait 4h, verify SMS arrives, reply with "10", verify branch to Promoter path
6. **Test 6 — Slack channels:** verify each channel receives its respective pings
7. **Flip live:** point production form's webhook URLs to live GHL endpoints
8. **First real submission:** monitor `#quotes-in` for first organic lead

---

## 9. What's pending vs ready

### Ready to wire up TODAY (no external dependencies)
- Form code: `quote_partial` + `quote_submit` GA4 events ✓ (committed)
- Form code: webhook fail UI ✓ (committed)
- Form code: Cloudinary signed upload (just needs Cloudinary account + backend signer)
- Pipeline + stages + custom fields + tags + workflows + email templates: all can be built in GHL admin **right now** during the trial

### Pending external dependencies
| Item | Blocked by | When |
|---|---|---|
| `GHL_WEBHOOK` real URL | GHL admin completes Day 4 (W1 trigger) | Day 4 of setup |
| Twilio AU mobile | Twilio AU Regulatory Bundle approval (in flight) | When approved |
| Sender ID Registry | Paired with Twilio | Same |
| Cloudinary signed upload | Allan signs up Cloudinary | When he does |
| Privacy Policy on website | Sprintlaw delivery | ~1 week after engagement |
| Customer ToS in quote PDF | Sprintlaw delivery | Same |
| ServiceM8 hookup | Phase 2 (after first sub onboarded + 5+ jobs) | Later |

---

## 10. Lead scoring rubric

```
+10  Photo uploaded (any)
+5   Photos uploaded (3+ across multiple areas) — cumulative with above
+15  urgency_signal=ready_to_book (from notes) — manual flag
+10  urgency_signal=fixing_for_sale — manual flag
+20  Quote total $2,000-$5,000 (AUD)
+30  Quote total ≥ $5,000 (full makeover) — replaces +20, not cumulative
+5   property_type=owner_occupier
+5   property_type=strata_unit
+15  lead_source=referral
+5   lead_source=google_ads
+15  SMS reply within 1h of first send
+10  Quote opened (email tracking pixel) 3+ times
+5   Time-to-complete form 90s-900s (engaged but not bot-fast)

NEGATIVE:
-10  property_type=rental_tenant (can't approve, deprioritise)
-5   built_before_1990=yes (legal complexity)
-20  Time-to-complete form <60s (likely bot)
-10  No phone provided
```

**Threshold:** `lead_score >= 30` triggers W6 (priority-hot SMS to Allan + Slack)

---

## 11. Comparison with Surface Care (the model)

| Aspect | Surface Care (Jordan) | Timeless (us, day-0) |
|---|---|---|
| CRM | GoHighLevel | GoHighLevel ✓ |
| Job mgmt | ServiceM8 | Phase 2 (Stage 9 = manual bucket Phase 1) |
| Accounting | Xero | Phase 2 (after first 3-5 sales) |
| Payments | Stripe | Stripe ✓ |
| Sub payouts | pay.com.au | Phase 2 (after first sub onboarded) |
| Internal comms | Slack | Slack ✓ (via webhook, not native) |
| Pipeline stages | 15 | 15 ✓ (3+4 hidden Phase 1) |
| Quote cadence | "automated SMS follow-ups" | 4-5h abandoned + 24h + 72h + 10d + 14d Lost |
| Abandoned-quote SMS | 4-5h, 30-40% lead recovery | Same timing ✓ |
| Slack lead alerts | "every quote signed pings Slack" | `#quotes-in` + `#new-jobs` ✓ |
| BigQuery sync | Yes — own the data | Phase 2 (webhook logs Phase 1) |
| AI agents | Daily Slack reports + DM handler + ad specialist | Phase 2 / 3 |
| Photo storage | Not specified | Cloudinary signed upload |

The pattern: we copy Jordan's STAGES + CADENCE + SLACK ALERTING, and defer the heavy ops infrastructure (ServiceM8, BigQuery, AI agents) to phases when volume justifies them.

---

## 12. Open questions for Allan to verify in GHL admin

| Q | Options | My rec |
|---|---|---|
| Does GHL Starter support custom-webhook actions in workflows? | If yes → all good. If no → need Pro tier for $297/mo. | Verify on first workflow build. If Starter doesn't support it, we use Make.com free tier as a bridge. |
| Does GHL Starter support conditional branching in workflows (`if/else`)? | If yes → all good. | Should be standard — verify in Day 4 build. |
| Does GHL allow inbound webhook auth (e.g. shared secret in payload)? | If yes → form passes a token, GHL validates. | Validate on Day 4 — if no validation possible, use a secret in URL path as defence-in-depth. |
| Custom field count limit on Starter? | If <50: we hit the cap (we have ~60). | If capped, consolidate some fields into JSON blobs. |
| Does GHL native Stripe sync set metadata on invoices, or do we need a custom Stripe → GHL middleware? | If native works: simpler. If not: Vercel function as middleware. | Test on Day 7. |

---

## 13. After setup — go-live steps

1. Configure form's `GHL_WEBHOOK` + `GHL_PARTIAL` env vars to live URLs (Day 8)
2. Submit a real test (use Allan's email/phone)
3. Verify lead lands in GHL, fields populated, Slack ping fires, SMS arrives
4. Send Marko's prior regrouting customer the FIRST real quote (the soft-locked customer per STATE.md §8 — perfect first case study)
5. Soft-launch Google Ads $20/day on 1 service ad group
6. Monitor `#quotes-in` for first organic lead from ads
7. Track conversion + iterate

---

## 14. Sign-off

This is the comprehensive setup spec. Once Allan reviews + signs off, this becomes the canonical reference: any future "how do we do X in GHL" question gets answered from this doc, not re-litigated.

— Clifford & Cleo, 2026-05-05

<!-- Status: DRAFT awaiting Allan sign-off. Once approved, change status to CANONICAL. -->
