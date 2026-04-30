# Timeless Resurfacing — Future Plan & Tickable Build Checklist

**Companion to:** [OPERATING-CONTEXT.md](OPERATING-CONTEXT.md)

**Purpose:** Every concrete task to go from current state (quote form 95% done, no GHL, no SM8, no subs) to fully streamlined automated business with AI agents catching edge cases. Each task has the best-fit expert who'd do it, the best-fit auditor who'd verify it, and the setup detail.

**How to use:** Tick `[x]` as completed. Don't skip phases — each phase is a dependency for the next.

**Last updated:** 2026-05-01

---

## Phase 0 — Foundation already done ✅

| Task | Status | Notes |
|---|---|---|
| ABN registered | ✅ | Per saved memory |
| Public liability insurance ($20M) | ✅ | Per saved memory |
| WordPress theme + 19 service landing pages | ✅ | `front-page.php` + `page-templates/page-*-sydney.php` |
| Pricing schedule (140 SKUs, T1/T2/T3) | ✅ | `MASTER_PRICING_UPDATED 111.xlsx` |
| Google Business Profile | ✅ | Set up |
| React quote form v9.x | ✅ (95%) | NSW gating, asbestos check, multi-mode, all flags wired |

**Pending from Phase 0:**
- [ ] Builder licence application submitted (still in process — DO NOT claim "NSW Licensed" anywhere)
- [ ] Pty Ltd structure (defer to Month 2-3 once revenue >$5k/mo consistent)

---

## Phase 1 — Lock the lead capture pipeline

**Goal:** Quote form + GHL inbound + Slack alert all working end-to-end with a real test lead.

**Why this is Phase 1:** Without this, every other system is downstream of a broken funnel. Every ad dollar pre-this-phase is wasted.

**Phase 1 expert lens:** GHL automation operator + CRO specialist
**Phase 1 auditor lens:** Privacy/Spam Act + signal integrity (does every event reach where it needs to?)

### 1.1 GHL business setup
- **Expert:** GHL automation operator
- **Auditor:** Compliance auditor (sender details, opt-out, sender domain auth)
- **Setup steps:**
  - [ ] Sign up GHL ($155/mo AUD)
  - [ ] Business profile: name, ABN, phone (0451 110 154), Sydney TZ, hours Mon–Sat 8am–6pm
  - [ ] Connect Google Workspace email (`hello@timelessresurfacing.com.au`)
  - [ ] Authenticate sending domain (DKIM, SPF, DMARC) — required for email deliverability
  - [ ] Buy Australian SMS-capable Twilio number through GHL
  - [ ] Add second co-founder as user
  - [ ] Set up brand colors + logo for email/SMS templates
- **Verify:** Send test email + SMS to your own number from GHL, both arrive within 30s.

### 1.2 Custom fields creation (build BEFORE workflows)
- **Expert:** Data architect (light)
- **Auditor:** Data integrity auditor — naming consistency, no duplicate fields
- **Setup steps:**
  - [ ] Create all 40+ custom fields per [OPERATING-CONTEXT § 8.2](OPERATING-CONTEXT.md#82-custom-fields-full-list)
  - [ ] Use snake_case consistently
  - [ ] Pre-populate dropdown options for `customer_type`, `property_type`, `mode`, `tier_chosen`
- **Verify:** Open a blank contact in GHL, every field exists, dropdowns work.

### 1.3 Tags library
- **Expert:** GHL operator
- **Auditor:** Maintenance auditor — will these tags scale or become a graveyard?
- **Setup steps:**
  - [ ] Create all tags per [OPERATING-CONTEXT § 8.3](OPERATING-CONTEXT.md#83-tags)
  - [ ] Group prefix: `service_*`, `flag_*`, `lead_*`, `stage_*`, `nps_*`
  - [ ] Document: "tags are for filtering, fields are for storing data"
- **Verify:** Tag a test contact with each prefix family, can filter contacts by each.

### 1.4 17-stage pipeline
- **Expert:** GHL operator + service business ops
- **Auditor:** Pipeline integrity auditor — is every transition triggered by a system event, not manual drag?
- **Setup steps:**
  - [ ] Create pipeline "Bathroom Quote → Job"
  - [ ] Add 17 stages per [OPERATING-CONTEXT § 8.4](OPERATING-CONTEXT.md#84-the-17-stage-pipeline)
  - [ ] Set default opportunity value field (will be filled by quote)
  - [ ] Each stage: who owns it (Auto / You / Co-founder)
- **Verify:** Drag a test opp through all 17 stages by hand — no missing transitions.

### 1.5 Connect quote form to GHL (the critical hop)
- **Expert:** Frontend dev (React) + GHL operator
- **Auditor:** Webhook integrity auditor — every required field arrives, no silent drops
- **Setup steps:**
  - [ ] In GHL: create Inbound Webhook — copy webhook URL
  - [ ] In GHL: create second Inbound Webhook for partial leads — copy that URL
  - [ ] In `/Users/angelapham/Downloads/timeless-quote-app/src/QuoteForm.jsx`:
    - [ ] Replace `GHL_WEBHOOK = "...REPLACE_ME"` with real URL ([line 633](../../timeless-quote-app/src/QuoteForm.jsx#L633))
    - [ ] Replace `GHL_PARTIAL = "...REPLACE_ME_PARTIAL"` with real URL ([line 634](../../timeless-quote-app/src/QuoteForm.jsx#L634))
  - [ ] In `.env.local`: store as `VITE_GHL_WEBHOOK` and `VITE_GHL_PARTIAL` (move out of source for repo safety)
  - [ ] Refactor code to read from env, not hardcode
  - [ ] In GHL: create workflow "Quote Form Inbound" → trigger = Inbound Webhook → actions = Create Contact + Map Custom Fields + Add Tags + Move to Stage 1
  - [ ] Test: submit a real form, check contact appears in GHL within 5s with all fields populated correctly
- **Verify:** End-to-end submission test → GHL contact created with name, phone, email, customer_type, property_type, areas_selected, services_selected, tracking fields all filled.

### 1.6 Quote form → Slack alert (`#quotes-in`)
- **Expert:** GHL operator
- **Auditor:** Signal-to-noise auditor — does the alert give enough info to act without opening GHL?
- **Setup steps:**
  - [ ] Create Slack workspace (free tier OK)
  - [ ] Create channels per [OPERATING-CONTEXT § 10.1](OPERATING-CONTEXT.md#101-channels)
  - [ ] In GHL: extend "Quote Form Inbound" workflow → add Slack action → post to `#quotes-in`
  - [ ] Use structured format per [OPERATING-CONTEXT § 10.2](OPERATING-CONTEXT.md#102-message-format-structured-not-chatty)
- **Verify:** Submit test form → Slack message appears within 10s with customer name, suburb, service, flags, photo count, GHL link.

### 1.7 Instant SMS acknowledgement workflow
- **Expert:** GHL operator + direct response copywriter
- **Auditor:** Spam Act 2003 auditor — message must include sender identification
- **Setup steps:**
  - [ ] Create workflow "Quote Acknowledgement"
  - [ ] Trigger: Stage 1 entered
  - [ ] Wait 0s → Send SMS:
    > "Hi [First Name]. Got your photos — we're on it right now. You'll have your quote within 15 minutes. — Timeless Resurfacing"
  - [ ] Add unsubscribe instruction in standard SMS footer (set in GHL settings, not per-message)
- **Verify:** Submit form → SMS received in <60s on your phone.

### 1.8 Abandoned form recovery workflow
- **Expert:** GHL operator + CRO specialist
- **Auditor:** Privacy auditor — must not contact people who never submitted
- **Setup steps:**
  - [ ] Create workflow "Abandoned Form"
  - [ ] Trigger: Contact created with phone + email but `form_status = "partial"` AND no event in 5h
  - [ ] Send SMS:
    > "Hey [First Name]. Looks like you didn't quite finish your bathroom quote. It only takes 30 seconds — just upload a couple of photos and we'll get your price sorted: [Form Link with their session ID]. — Timeless Resurfacing"
  - [ ] After 24h, if still partial, mark as `cold_partial` and stop touching
- **Note:** The React form already fires `sendPartialLead()` on Step 1 → 2 transition ([QuoteForm.jsx:638](../../timeless-quote-app/src/QuoteForm.jsx#L638)). This is the existing trigger.
- **Verify:** Open form, fill Step 1, click Next, then close tab. After 5 hours, get the recovery SMS.

### 1.9 Triple audit Phase 1
- [ ] **Expert audit (GHL operator):** All workflows fire reliably, no race conditions between webhook and SMS workflow
- [ ] **Customer audit:** From the customer's POV, are SMS messages friendly, clear, identifying the sender?
- [ ] **Compliance audit (adversarial):** Does every customer message comply with Spam Act 2003 (consent, sender ID, opt-out)? Privacy Act compliance — privacy policy linked from form, photos handled per policy?
- [ ] Reconcile: any conflicts logged + decided

**Phase 1 done when:** A real customer can submit the form and you receive contact + alert + customer gets SMS within 60 seconds, with zero manual touches. **Don't run a single ad dollar before this passes.**

---

## Phase 2 — Quoting + follow-up engine

**Goal:** From form-submitted to quote-accepted, fully automated except for the human quote-drafting step (which can later become AI agent-assisted).

**Phase 2 expert lens:** Quote operator + conversion copywriter
**Phase 2 auditor lens:** Margin auditor (every quote tier hits floor) + customer experience

### 2.1 Quote drafting templates
- **Expert:** Pricing-aware operator + copywriter
- **Auditor:** Margin per job auditor (Tier 2 must hit $300 profit floor at minimum)
- **Setup steps:**
  - [ ] Build 3-tier quote template per service in GHL document/email template:
    - **Tier 1 — Essential** (lowest sub time, highest margin %, lowest price)
    - **Tier 2 — Standard** (middle, this is the recommended pick)
    - **Tier 3 — Premium** (epoxy, full silicone, etc — highest price, highest margin $)
  - [ ] Each tier shows: scope, what's included, warranty, price, "click to accept"
  - [ ] Pricing math comes from `MASTER_PRICING_UPDATED 111.xlsx` — keep tier prices = T1/T2/T3 column values
- **Verify:** Manually draft a quote for a sample shower regrout in <5 min using the template.

### 2.2 Quote-sent workflow
- **Expert:** GHL operator
- **Auditor:** Customer experience auditor — does the customer understand the 3 options?
- **Setup steps:**
  - [ ] Workflow "Send Quote": triggered manually from contact (button) OR by Stage 4 → Stage 5 transition
  - [ ] Action: Send email with 3-tier quote PDF + SMS with summary + link
  - [ ] Tag: `quote_sent` + record `quote_amount` + `quote_amounts_per_tier`
- **Verify:** Send a test quote to your own email + phone → both arrive, links work, attachment opens.

### 2.3 Follow-up sequences (24h + 72h)
- **Expert:** GHL operator + direct response copywriter
- **Auditor:** Spam Act + customer-fatigue auditor
- **Setup steps:**
  - [ ] Workflow "24h Follow-Up": Stage 5 → wait 24h → if still Stage 5 → SMS "Hey [First Name]. Just checking in on your bathroom quote. Happy to answer any questions — just reply…"
  - [ ] Workflow "72h Final Follow-Up": 48h after first follow-up → if still Stage 5 → SMS "Last one from us [First Name]. Your quote is still saved if the timing works. We have availability this week if you'd like to lock something in…"
  - [ ] After 72h follow-up, stop messaging — never a 3rd attempt (Spam Act risk + brand damage)
- **Verify:** Mock test by setting timer to 5min instead of 24h for testing → both messages arrive at right intervals.

### 2.4 Quote acceptance → deposit request
- **Expert:** GHL + Stripe operator
- **Auditor:** Payment flow auditor — does deposit link work, fail gracefully if 4xx?
- **Setup steps:**
  - [ ] Stripe: create dynamic payment link template (use Stripe Checkout, $ amount = 10% of quote)
  - [ ] GHL workflow: Stage 7 (Quote Accepted) → calculate 10% → generate Stripe link → SMS to customer with link
  - [ ] Stripe webhook: on `payment_intent.succeeded` with metadata `type=deposit` → GHL contact moves to Stage 10 + Slack `#new-jobs` BOOM message
- **Verify:** Manually move test contact to Stage 7 → deposit SMS received → use Stripe test card 4242 4242 4242 4242 → Slack BOOM fires + Stage 10 entered.

### 2.5 Triple audit Phase 2
- [ ] **Expert audit (quote operator):** Tier prices align with Excel, tier descriptions match scope, no orphaned services without templates
- [ ] **Customer audit:** Reading the quote email cold, can a customer pick the right tier in 60 seconds?
- [ ] **Compliance audit (adversarial):** Quote validity period stated? Warranty terms clear and not over-claimed (max 5yr per pricing)? Cancellation/cooling-off period for customers > $750 mentioned per ACL?

**Phase 2 done when:** A test customer (you or co-founder) can submit form → receive quote → click accept → pay deposit → see BOOM in Slack, all without you touching anything except drafting the quote.

---

## Phase 3 — Sub recruitment + onboarding

**Goal:** 3 vetted, signed, test-job-passed subs ready to dispatch before any Phase 4 (booking) work.

**Phase 3 expert lens:** Trade ops + ABN/contractor lawyer
**Phase 3 auditor lens:** Fair Work compliance + insurance verification

### 3.1 Subcontractor agreement template
- **Expert:** Australian contracts lawyer (Sprintlaw or similar) + trade ops
- **Auditor:** Fair Work compliance auditor — sham contracting risk
- **Setup steps:**
  - [ ] Engage Sprintlaw (~$200) for subcontractor agreement template
  - [ ] Confirm clauses per [OPERATING-CONTEXT § 9.6](OPERATING-CONTEXT.md#96-subcontractor-agreement-must-be-signed-before-any-job)
  - [ ] Set up DocuSign for digital signing
- **Verify:** Lawyer reviews final template, you sign one as "test sub" and check signature flow.

### 3.2 Sub recruitment outreach
- **Expert:** Trade ops + B2B outreach
- **Auditor:** Brand consistency auditor (your messaging in DMs reflects business)
- **Setup steps:**
  - [ ] Hipages: search "bathroom resurfacing Sydney", "shower regrouting Sydney"
  - [ ] DM template per [the user's plan Day 11 message] — adapt to your voice
  - [ ] Airtasker same approach
  - [ ] Facebook groups: Sydney Tradies, NSW Tiles & Bathroom Renovations, Australian Tradies Network
  - [ ] Meta recruitment ad ($7/day, target NSW + interests bathroom renovation/tiling)
  - [ ] Recruitment Form (GHL): collects name, phone, ABN, years exp, suburb coverage, services, asbestos training
  - [ ] Track every contact in a Google Sheet "Sub Pipeline"
- **Verify:** First week → contact 30+ subs, 5 reply, 3 take a call, 1 signs.

### 3.3 Sub onboarding checklist
- **Expert:** Service business ops + insurance auditor
- **Auditor:** Documentation auditor (every sub has every cert before going live)
- **Setup steps:** Per sub:
  - [ ] Full legal name + ABN verified (ABN Lookup)
  - [ ] PL insurance certificate ≥$5M sighted (sub provides PDF, you store)
  - [ ] Portfolio reviewed (5+ real before/after bathroom jobs)
  - [ ] Suburb coverage confirmed (which postcodes they'll travel to)
  - [ ] Skill confirmation: shower regrout / bath resurface / silicone / epoxy / full bathroom (tick which)
  - [ ] Asbestos awareness training confirmed (cert sighted) — required for pre-1990 jobs
  - [ ] ServiceM8 Network invite sent + accepted
  - [ ] Subcontractor agreement signed via DocuSign
  - [ ] Bank details + pay.com.au setup
  - [ ] Tier 2 assigned by default (Tier 3 if green)
  - [ ] **Test job completed and approved** (low-risk, close-to-home, you review before/after photos)
- **Verify:** Every sub onboarded → all checklist items ticked in their Google Sheet tab.

### 3.4 Triple audit Phase 3
- [ ] **Expert audit (trade ops):** All 3 subs cover different geographic zones (CBD/west/north or similar)
- [ ] **Sub audit (their POV):** Is the agreement fair? Payment terms (3 business days) realistic from their POV?
- [ ] **Compliance audit (adversarial):** Every sub has ABN, own insurance, sets own work hours, supplies own tools — passes Fair Work independent contractor test?

**Phase 3 done when:** 3 subs signed, all certs sighted, all 3 passed test jobs. Until then, no real customer jobs go to subs (you'd be liable for unvetted work).

---

## Phase 4 — Job dispatch (ServiceM8) + completion

**Goal:** Deposit-paid job → SM8 → assigned to right sub → completed → photos reviewed → final payment → sub paid → review request.

**Phase 4 expert lens:** Service business ops + customer experience
**Phase 4 auditor lens:** Photo quality + timeliness

### 4.1 ServiceM8 setup
- **Expert:** Service ops manager
- **Auditor:** Field operations auditor (does it work on a sub's mobile in a bathroom with bad signal?)
- **Setup steps:**
  - [ ] Sign up SM8 Starter ($29/mo)
  - [ ] Company profile + branding
  - [ ] Add yourself + co-founder as admins
  - [ ] Add 3 onboarded subs with limited access (their assigned jobs only)
  - [ ] Build 5 job templates per [OPERATING-CONTEXT § 9.2](OPERATING-CONTEXT.md#92-job-templates-5-core)
  - [ ] Build SM8 custom fields per [OPERATING-CONTEXT § 9.3](OPERATING-CONTEXT.md#93-sm8-custom-fields)
  - [ ] Build job completion form per [OPERATING-CONTEXT § 9.4](OPERATING-CONTEXT.md#94-job-completion-form-sub-fills)
- **Verify:** Sub on their phone can open assigned job, see scope, upload before/after photos, fill completion form, mark complete.

### 4.2 GHL → SM8 job sync
- **Expert:** Integration architect
- **Auditor:** Data integrity (every required field arrives) + cost auditor (is Zapier necessary?)
- **Setup steps:**
  - [ ] Check GHL marketplace for native SM8 integration (preferred)
  - [ ] If no native: Zapier ($30/mo) — GHL Stage 10 trigger → SM8 Create Job action
  - [ ] Field mapping per [OPERATING-CONTEXT § 12.3](OPERATING-CONTEXT.md#123-ghl--servicem8)
  - [ ] Photo URL passing — requires Phase 4.5 (Cloudinary) first
- **Verify:** Test contact at Stage 10 → SM8 job appears within 30s with all fields.

### 4.3 SM8 → GHL completion sync
- **Expert:** Integration architect
- **Auditor:** Webhook reliability auditor
- **Setup steps:**
  - [ ] SM8 webhook on job marked complete → Zapier → GHL workflow
  - [ ] GHL action: move opportunity to Stage 15 (Job Complete) → fire NPS workflow
- **Verify:** Test sub marks job complete in SM8 → opp moves to Stage 15 in GHL within 30s.

### 4.4 Sub dispatch logic
- **Expert:** Service ops manager
- **Auditor:** Tier-fairness auditor (no Tier 3 sent to complex jobs)
- **Setup steps:**
  - [ ] In SM8: tag every sub with `coverage_<suburb>`, `skill_<service>`, `tier_<1|2|3>`
  - [ ] Co-founder dispatch SOP:
    1. Filter SM8 subs by suburb tag matching customer's suburb
    2. Filter by skill tag matching customer's service
    3. Offer to Tier 1 first via SMS through SM8
    4. If declined or no response in 2h → offer to Tier 2
    5. If both declined → Slack `#subs` alert "Need help in <suburb>"
  - [ ] **Hard rule:** Strata, commercial, full bathroom, pre-1990 → Tier 1 only
- **Verify:** Run dispatch SOP on first 3 booked jobs, document any friction.

### 4.5 Photo upload pipeline (Cloudinary)
- **Expert:** Mobile-first frontend dev
- **Auditor:** Performance auditor (does it work on 3G?) + privacy auditor (photos stored compliant)
- **Setup steps:**
  - [ ] Cloudinary account (free tier 25GB OK initially)
  - [ ] Add upload preset for unsigned uploads from React (named `quote_photos`, max file 10MB after compression)
  - [ ] In `QuoteForm.jsx`: replace TODO comment ([line 727](../../timeless-quote-app/src/QuoteForm.jsx#L727)) with actual Cloudinary upload
  - [ ] Submit photo URLs as `photo_urls` field in GHL webhook payload
  - [ ] Fallback: if Cloudinary fails, queue and retry; never block form submission
- **Verify:** Submit form with 5 photos on a 3G-throttled connection → all photos upload + URLs arrive in GHL within 60s.

### 4.6 Final payment workflow
- **Expert:** GHL + Stripe operator
- **Auditor:** Payment integrity auditor
- **Setup steps:**
  - [ ] Stripe: same dynamic payment link pattern as deposit, this time for 90% balance
  - [ ] GHL workflow: Stage 15 (Job Complete) → check before/after photos uploaded by sub → if yes → SMS final payment link to customer
  - [ ] Stripe webhook on success → GHL Stage 16 + warranty email fires
- **Verify:** Manually move test job to Stage 15 (with photos) → final SMS arrives → test card pays → Stage 16 + warranty email both fire.

### 4.7 Cure-time SMS + NPS routing
- **Expert:** CX specialist + GHL operator
- **Auditor:** Customer experience auditor
- **Setup steps:**
  - [ ] Cure-time workflow: Stage 15 → wait 0s → SMS "Don't use shower/bath 24-48h…"
  - [ ] NPS workflow: Stage 15 → wait 4h → SMS "How was your experience? Reply 1-10"
  - [ ] Score routing (parse SMS reply):
    - 9-10 → tag `nps_promoter`, fire Google review request workflow
    - 7-8 → tag `nps_passive`, no review request, internal note
    - 1-6 → tag `nps_detractor`, Slack alert + co-founder must call within 60min
- **Verify:** Test by sending fake reply numbers → each routes correctly + fires correct downstream.

### 4.8 Sub payment via pay.com.au
- **Expert:** Service ops + accounts
- **Auditor:** Cash flow auditor (3-business-day promise)
- **Setup steps:**
  - [ ] pay.com.au account active with rewards card connected
  - [ ] Per completed job: Co-founder schedules sub payment in pay.com.au within 3 business days of customer final payment clearing
  - [ ] Record sub payment in Google Sheet tracker (Phase 5: replaced by BigQuery)
  - [ ] Tag GHL opp `sub_paid` → moves to Stage 17 (closed)
- **Verify:** First sub paid within 3 business days as promised, points credited to your card.

### 4.9 Triple audit Phase 4
- [ ] **Expert audit (service ops):** Sub experience smooth, no SM8 confusion, completion form short enough to fill in 2 min
- [ ] **Customer audit:** Cure-time message arrived right after job, NPS request felt natural not pushy, final payment link was simple
- [ ] **Adversarial audit (data integrity):** Every Stage 10 in GHL has a corresponding SM8 job, no orphans either direction

**Phase 4 done when:** First 5 real jobs run end-to-end, customer ratings averaging 9+, no manual rescue interventions.

---

## Phase 5 — BigQuery + the data brain

**Goal:** Own your data outside CRM, enable POAS-driven decisions, prepare for AI agent layer.

**Phase 5 expert lens:** Analytics data engineer
**Phase 5 auditor lens:** Data quality + privacy

### 5.1 Google Cloud project setup
- **Expert:** Data engineer
- **Auditor:** Cost auditor (BigQuery pricing surprises)
- **Setup steps:**
  - [ ] Create Google Cloud project "timeless-resurfacing-prod"
  - [ ] Enable BigQuery API
  - [ ] Create dataset "ops" in `australia-southeast1` (Sydney region — data residency)
  - [ ] Set billing alerts at $30, $60, $100/mo
- **Verify:** Project active, dataset visible in BQ console, billing alert active.

### 5.2 Schema design
- **Expert:** Analytics data engineer
- **Auditor:** Data integrity auditor (foreign keys consistent)
- **Setup steps:**
  - [ ] Create tables per [OPERATING-CONTEXT § 11.2](OPERATING-CONTEXT.md#112-tables-when-built)
  - [ ] Each table: `created_at`, `updated_at`, primary key, foreign keys to related tables
  - [ ] `pipeline_events` table is the event log — append-only, never updated
- **Verify:** Schema exported to JSON, peer-reviewed (you can ask me to review), tables created.

### 5.3 GHL → BigQuery sync
- **Expert:** Data engineer
- **Auditor:** Reliability auditor (what if Zapier fails for an hour?)
- **Setup steps:**
  - [ ] Option A (simple): Zapier on GHL events → BigQuery `INSERT` rows
  - [ ] Option B (robust): GHL webhook → Cloud Function → BigQuery (handles retries)
  - [ ] Start with Option A, migrate to B once volume >100 events/day
  - [ ] Sync these events: contact_created, opportunity_stage_changed, payment_received, job_completed, nps_score_received
- **Verify:** Trigger each event manually, BQ row appears within 60s.

### 5.4 ServiceM8 → BigQuery sync
- **Expert:** Data engineer
- **Auditor:** Same
- **Setup steps:**
  - [ ] SM8 webhook → middleware → BQ
  - [ ] Sync: job_created, job_assigned, job_started, job_completed, completion_form_submitted
- **Verify:** SM8 job lifecycle event chain visible in BQ.

### 5.5 Google Ads → BigQuery sync
- **Expert:** Performance marketing + data engineer
- **Auditor:** Margin attribution auditor
- **Setup steps:**
  - [ ] Google Ads: enable daily export to BQ via native integration (free)
  - [ ] Daily spend by campaign, ad group, keyword arrives in `ad_spend_daily` table
  - [ ] Join key: `gclid` (already captured on GHL contact)
- **Verify:** After 1 day of ad spend, BQ has the row, joinable to converted leads.

### 5.6 Looker Studio dashboard
- **Expert:** BI analyst
- **Auditor:** Stakeholder usability auditor (will you actually look at this weekly?)
- **Setup steps:**
  - [ ] Looker Studio (free) connected to BQ
  - [ ] Build 1 dashboard with 6 tiles:
    - Leads this week vs last 4-week avg
    - Quote acceptance rate
    - Average profit per job
    - POAS by campaign
    - Top 5 jobs by margin
    - NPS distribution
- **Verify:** Dashboard accurate after 30 days of data, takes <30s to load.

### 5.7 Triple audit Phase 5
- [ ] **Expert audit (data engineer):** Schema normalised, no duplicate fields, foreign keys consistent
- [ ] **Operator audit (you):** Looker dashboard answers "is this week good or bad?" in <60s
- [ ] **Adversarial audit (privacy):** Customer PII handling complies with Privacy Act 1988 — data residency Sydney, retention period documented, deletion-on-request process exists

**Phase 5 done when:** Weekly Slack KPI digest pulls from BQ automatically, no manual tracker maintenance.

---

## Phase 6 — AI agents (the multiplier layer)

**Goal:** Replace manual work and catch edge cases automatically, per Jordan's roster of agents.

**Phase 6 expert lens:** AI ops engineer (Claude SDK / API)
**Phase 6 auditor lens:** AI safety + hallucination auditor + compliance

**Agent build philosophy:**
- Each agent has ONE job
- Each agent reports to Slack with what it did
- Each agent has a kill switch (toggle off without breaking system)
- Each agent has a confidence threshold below which it asks human before acting

### 6.1 Quote-Drafting Agent
- **Job:** Customer submits form → agent reads photos + form data → drafts 3-tier quote → posts to Slack `#quotes-in` for human review → human approves/edits → sends.
- **Expert:** AI ops + trades expert (training on Excel SKU map)
- **Auditor:** Hallucination auditor — does it ever recommend a service the customer didn't ask for?
- **Setup steps:**
  - [ ] Use Claude API with vision (photos) + form context
  - [ ] System prompt = pricing schedule + form-to-SKU map + tier framework
  - [ ] Output: structured 3-tier draft with reasoning per tier
  - [ ] Run on a VPS ($6/mo) or Cloud Function
  - [ ] Triggered by GHL webhook on form submit
  - [ ] Posts to Slack `#quotes-draft` (NEW channel) for human approval
  - [ ] Human approves → quote sent via existing GHL workflow
- **Verify:** Run on 20 historical jobs (after Phase 4 data exists), agent's draft within 10% of human draft 90%+ of the time.

### 6.2 Multi-Household Duplicate Detection Agent (the example you flagged)
- **Job:** New form submission → agent searches BigQuery for prior jobs at same address OR same customer → flags if found → posts context to Slack so quote stays consistent.
- **Why this matters:** Two people in same household submitting separately → agent ensures pricing is identical, prevents brand-damaging "different price for my wife than for me" scenarios. Per Jordan's "Quote Integrity Analyst" pattern.
- **Expert:** Trust & safety engineer + privacy lawyer
- **Auditor:** Privacy auditor — must not expose other household member's PII inappropriately
- **Setup steps:**
  - [ ] Run on every form submit
  - [ ] Query BigQuery: `SELECT * FROM contacts WHERE address = $new_address OR (last_name = $new_lastname AND suburb = $new_suburb)`
  - [ ] If match found:
    - [ ] Post Slack alert to `#quotes-in`: "⚠️ Potential same-household submit. Previous job: [link]. Verify scope is genuinely different OR coordinate with prior submitter."
    - [ ] Tag new contact `flag_potential_duplicate`
  - [ ] Human decides: combine quotes, mirror pricing, or treat as separate
- **Verify:** Synthetic test — submit 2 forms with same address, agent flags within 30s.

### 6.3 Ad Spend Watchdog Agent
- **Job:** Every morning at 5am, audit all Google Ads campaigns. Calculate POAS per keyword/campaign using BigQuery. Flag any keyword burning money with no completed-job profit.
- **Expert:** Performance marketing + AI ops
- **Auditor:** False-positive auditor (don't pause keywords with delayed conversions)
- **Setup steps:**
  - [ ] Daily scheduled job (Cloud Scheduler → Cloud Function)
  - [ ] Pull last 14 days of ad spend from BQ
  - [ ] Pull last 14 days of completed jobs with profit
  - [ ] Join on `gclid`
  - [ ] Calculate POAS per keyword/campaign
  - [ ] If keyword spent >$200 with POAS <1.0 → Slack alert with recommendation to pause
  - [ ] **Does not auto-pause** initially (human in loop) — graduate to auto-pause after 30 days of accurate flags
- **Verify:** Backtest on 30 days of data, agent's flags align with what you would have flagged manually.

### 6.4 Weekly Business Analyst Agent
- **Job:** Every Monday 7am, pull last week's performance from BQ + compare to 4-week rolling average. Post insights to Slack `#weekly-numbers`.
- **Expert:** AI ops + business operator
- **Auditor:** Insight quality auditor (Are insights actionable, or generic noise?)
- **Setup steps:**
  - [ ] Scheduled Claude API call (Cloud Scheduler weekly)
  - [ ] System prompt: "You are a business analyst for an Australian bathroom resurfacing business. Generate 5 specific insights with action items based on this data."
  - [ ] Input: BQ query results for last week + 4-week rolling avg
  - [ ] Output: Slack-formatted message with bullet insights
- **Verify:** First 4 weeks of insights manually graded — do they say something useful you didn't already know?

### 6.5 Review Response Agent
- **Job:** When a Google review is posted (positive or negative), draft a response. For positives, post to Slack for human review (1-click send). For negatives, alert immediately + draft response that's professional and non-defensive.
- **Expert:** Brand voice + customer service
- **Auditor:** Brand consistency auditor + ACCC auditor (no hidden incentives mentioned)
- **Setup steps:**
  - [ ] Webhook from Google My Business → Cloud Function
  - [ ] Claude API with system prompt = brand voice guide
  - [ ] Post drafts to Slack `#reviews-nps`
  - [ ] Human approves → posts via GMB API
- **Verify:** First 10 review responses sound human and on-brand; no auto-posts without human approval.

### 6.6 Sub Recruitment Agent
- **Job:** Browse Hipages / Airtasker daily, find new bathroom resurfacing operators in NSW, draft outreach DM, queue for human approval.
- **Expert:** B2B outreach + AI ops
- **Auditor:** Anti-spam auditor (don't message same sub repeatedly)
- **Setup steps:**
  - [ ] Web scraper (Playwright via Claude code) runs daily
  - [ ] Dedupe against existing sub list in BQ
  - [ ] Generate personalised DM per sub
  - [ ] Post to Slack `#sub-outreach` (NEW) for co-founder review
  - [ ] Co-founder approves → DM sent via Hipages/Airtasker manual paste
- **Verify:** First 7 days, agent finds 5+ new subs/day, DMs feel personal not template.

### 6.7 Photo Quality Agent
- **Job:** Sub uploads completion photos to SM8. Agent reviews — checks for: proper before/after, in focus, full surface visible, lighting adequate. Flags issues to Slack before customer ever sees the result.
- **Expert:** Computer vision + trade ops
- **Auditor:** False-rejection auditor
- **Setup steps:**
  - [ ] SM8 webhook on completion → Cloud Function
  - [ ] Claude API vision: rate photos on 4 criteria (composition, focus, lighting, completeness)
  - [ ] If any score <7 → Slack `#job-issues`
  - [ ] If all scores ≥7 → auto-approve, customer flow continues
- **Verify:** Backtest on 50 historical jobs, agent's flags align with what you'd reject.

### 6.8 Triple audit Phase 6 (per agent)
For **each** agent, run the audit:
- [ ] **Expert audit (AI ops):** Prompt is specific, output is structured, errors handled
- [ ] **Operator audit (Angela):** Does the agent's output save you time or create more cleanup?
- [ ] **Adversarial audit (AI safety):** What's the worst case if the agent hallucinates? Is there a kill switch?

**Phase 6 done when:** All 7 agents running, each posting to Slack daily, total time saved ≥10 hours/week vs manual equivalents.

---

## Phase 7 — Scale & expand (year 1+)

**Goal:** From 5-15 jobs/week → 50+ jobs/week without breaking the system.

**Phase 7 expert lens:** Service business scaler + ops architect
**Phase 7 auditor lens:** Quality-at-scale auditor

### 7.1 Pty Ltd structure
- [ ] Form Pty Ltd via Sprintlaw (~$600) — both founders 50/50 directors + shareholders
- [ ] Move ABN to company
- [ ] Update contracts, insurance, bank account, Stripe, GHL, SM8 to company name
- **When:** Once revenue >$5k/mo for 3 consecutive months

### 7.2 GST registration
- [ ] Register for GST when 12-month revenue forecast exceeds $75,000
- [ ] Update Xero to add GST to all invoices
- [ ] Update Stripe to handle GST
- [ ] Customer-facing prices on quote → "incl. GST" line item

### 7.3 Sub roster expansion
- [ ] From 3 → 10 → 20 subs over 12 months
- [ ] Recruitment agent (Phase 6.6) doing the heavy lifting
- [ ] Geographic coverage: CBD, North Shore, Eastern Suburbs, Inner West, South, West, Sutherland, Hills, Northern Beaches, Wollongong, Central Coast (~10 zones)
- [ ] Each zone needs ≥2 subs (redundancy)

### 7.4 New service expansion (only if data supports)
- [ ] Once 100+ bathroom jobs done, look at adjacent services with same sub pool:
  - Kitchen splashback regrout
  - Laundry resurfacing
  - Commercial bathroom resurfacing
- [ ] Each new service needs: landing page, pricing tier, sub skill expansion, SM8 template

### 7.5 Reviews & referral velocity
- [ ] Goal: 50+ Google reviews in first 12 months
- [ ] Referral program (Phase 4 NPS workflow already drafted) live from job 1
- [ ] Track referral source field — top 5 referrers get a thank-you call from Angela

### 7.6 Triple audit Phase 7
- [ ] **Expert audit (scaler):** No process is still "Angela does it manually" at 50 jobs/week
- [ ] **Sub audit:** Sub satisfaction surveys quarterly — they're getting paid on time, jobs are profitable for them, not getting overworked
- [ ] **Adversarial audit (compliance):** All compliance gates still hold at 10x volume — strata holds aren't being skipped, asbestos checks aren't being rushed

---

## Cross-phase non-negotiables

These rules apply across **every** phase. Violating them creates compounding pain.

| Rule | Why |
|---|---|
| One source of truth per data type | GHL = customer state, SM8 = job state, BQ = history. No duplicates. |
| Triple audit before any new phase ships | Catches blindspots from single-lens thinking. |
| Slack is alerts, not decisions | Decisions live in GHL notes, SM8 notes, or shared docs. |
| Compliance gates are non-skippable | Asbestos / strata / Tier 3 limits / fake review prohibition |
| POAS > ROAS always | Revenue without profit margin is an expensive vanity metric |
| Don't skip phases | Phase 6 needs Phase 5 data; Phase 5 needs Phase 2-4 events |
| Document trade-offs when audits conflict | Future-you will thank present-you |

---

## How I (Claude) work this checklist

For each task above:

1. **Before recommending action**: confirm prerequisite tasks are done (read this doc, verify file/code state, check memory).
2. **State the expert role** I'm taking before recommending.
3. **Build under that role** — concrete, file-referenced, tickable steps.
4. **Triple-audit** before declaring done — at least 3 lenses, one adversarial.
5. **Reconcile audit conflicts** with documented trade-off.
6. **Verify in browser/preview/code** when changes are observable.
7. **Update this doc** when reality diverges from plan.

---

## Quick navigation by next decision

| Question | Section |
|---|---|
| What do I do next on the quote form? | Phase 1.5 (replace REPLACE_ME webhooks) |
| When do I start ads? | After Phase 1.9 audit passes |
| When do I add subs? | Phase 3 — before any real customer jobs |
| When do I add BigQuery? | Phase 5 — once 50+ completed jobs exist |
| When do I add AI agents? | Phase 6 — only after Phase 5 data layer is real |
| Multi-household duplicate detection? | Phase 6.2 — needs BigQuery (Phase 5) first |

---

*This document is the living build plan. Tick tasks as completed. When something here is wrong, edit this — don't make exceptions in conversation that drift from the plan.*
