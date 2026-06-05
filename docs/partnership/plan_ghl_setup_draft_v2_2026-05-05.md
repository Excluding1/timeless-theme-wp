---
name: GHL setup plan v2 — synthesized from Clifford + Cleo peer-review
description: Canonical executable plan for wiring the React quote form into GoHighLevel, revised after Cleo's two peer-review passes + Allan's CEO calls. Supersedes plan_ghl_setup_draft_2026-05-04.md (v1).
type: project
originSessionId: 2026-05-04-codex-integration
status: CANONICAL — supersedes v1
authors: Clifford (Claude/Anthropic, orchestrator co-CEO) + Cleo (Codex/OpenAI, peer co-CEO)
date: 2026-05-05
---

# GHL Setup Plan v2

> ⚠️ **SUPERSEDED-IN-PART (2026-06-03).** This doc predates current locks. LIVE pipeline = 15 stages Jordan-EXACT, terminal "Job Complete" (no Job Invoiced/Paid — finance via `Payment Status` field + Accounts pipeline). Insurance = $10M. ServiceM8 = 6 categories. Owners = Allan + Marko. Canonical: `docs/CEO.md` Override 14 v4 + `memory/SESSION_RESUME_2026-06-03.md`. Body retained for historical/workflow reference only.

**Supersedes:** `plan_ghl_setup_draft_2026-05-04.md` (v1). v1 had 14 errors flagged by Cleo's two peer-review passes + Clifford's STATE.md/role-file reads.

**Goal:** Wire `quote-form/` into GoHighLevel so leads flow end-to-end (form → CRM → quote → deposit → ServiceM8 → invoice → paid → review request) with AU compliance, $130 USD/mo budget, and the 2-person partnership able to operate at 1-50 jobs/week without scaling labour.

**North star:** $1M revenue in year 1 (~400 jobs at $2.5K avg) with builder licence deferred = jobs under $5K via per-bathroom invoice splitting.

---

## 0. What changed from v1 (14 findings + Allan's NPS reversal)

| # | v1 said | v2 says | Source |
|---|---|---|---|
| 1 | GHL Starter $155 AUD/mo | $97 USD/mo (~$155 AUD; same price, currency confusion) — both founders signed up, 30-day trial expires 2026-05-27 | Cleo verified at gohighlevel.com/pricing |
| 2 | Stripe activated, in 1-3 day review | Stripe submitted, awaiting Marko ID verification — still needs metadata schema configured | Allan + STATE.md |
| 3 | "Use GHL native File Upload for photos" | Cloudinary signed upload → URLs stored in GHL as text fields | Cleo + STATE.md |
| 4 | Privacy Policy / Customer ToS exist (implied) | Both ❌ — must draft via Sprintlaw (~$200) before first quote | STATE.md + Cleo |
| 5 | Pipeline 15 stages, all-active | 15 stages KEEP; stages 3+4 hidden + workflow-bypassed Phase 1 (until first sub onboarded) | Cleo's stage-by-stage verdict |
| 6 | "We have no customers" | Marko's prior regrouting customer is soft-locked (STATE.md §8) — perfect first case study | STATE.md |
| 7 | Auto-reply email on form submit | **60-second SMS ack** (per OPERATING-CONTEXT.md §4) + email backup | OPERATING-CONTEXT.md |
| 8 | Cadence 48h/5d/12d/14d | **24h + 72h** for quote-sent (OPERATING-CONTEXT) + 4-5h for abandoned-quote (Jordan's exact timing — 30-40% lead recovery) | OPERATING-CONTEXT + Jordan |
| 9 | Channel names #leads-new, #leads-hot, etc. | `#quotes-in`, `#new-jobs`, `#job-issues`, `#hot-leads`, `#pipeline-feed` (per OPERATING-CONTEXT.md) | OPERATING-CONTEXT |
| 10 | Slack "native integration" | **GHL Workflow → outbound webhook → Slack incoming webhook URL** (no Zapier) | Cleo |
| 11 | Sender ID Registry "Dec 2025 reg, $220k breach from day 1" | **1 July 2026 regime; recommended apply-by 15 May 2026 (11 days from today)** | Cleo |
| 12 | NPS skip Phase 1 | **NPS Phase 1 with auto-filter** (Allan's call: minimize calls at scale; Promoter→review, Passive→silent, Detractor→Slack+call) | Allan |
| 13 | Cost ~$185 AUD/mo | **~$130 USD/mo (~$200 AUD)** total recurring; $1,500 AUD cash = 7-8 months runway | Synthesis |
| 14 | (missing entirely) | **Rollback plan if GHL is down** — leads route to `quotes@` inbox as failsafe | Cleo (from earlier 2026-04-28 plan) |

---

## 1. Locked decisions — never re-litigate

| Decision | Lock | Source |
|---|---|---|
| Pipeline = Jordan's 15 stages, all created day-0 | LOCKED | Allan + Cleo verdict |
| Stages 3+4 (sub-quote) hidden from view, no workflows Phase 1 | LOCKED | Cleo verdict |
| Phone via Twilio BYOT into GHL (AU mobile) | LOCKED | reference_twilio_ghl_byot.md |
| Photos = Cloudinary signed upload → URL fields in GHL | LOCKED | Cleo + STATE.md + Allan |
| Slack = GHL outbound webhook → Slack incoming webhook | LOCKED | Cleo |
| Email = admin@ + 5 aliases (hello/support/quotes/billing/marketing) | LOCKED | project_email_aliases_planned.md |
| NEVER personal Gmail on any business surface | LOCKED | feedback_business_email_only.md |
| ServiceM8 Phase 2 (Stage 9 = "ready to schedule" bucket Phase 1) | LOCKED | Cleo + Clifford |
| NPS Phase 1 with detector-only-call filter | LOCKED 2026-05-05 | Allan |
| Cure-time SMS Phase 2 | LOCKED | Allan |
| Builder Licence deferred indefinitely (jobs <$5k via per-bathroom split) | LOCKED | STATE.md |
| AU Sender ID Registry application by 15 May 2026 | LOCKED | Cleo |
| Quote response SLA = 24h (Jordan's framing) | LOCKED | Surface Care benchmark |
| Pricing: $97 USD/mo GHL + $30 Twilio + $0 Cloudinary + $0 Slack = ~$130 USD/mo | LOCKED | Synthesis |

---

## 2. Pipeline — Jordan's 15 stages with Cleo's tweaks

| # | Stage | Phase 1 Status | Tweak | Workflows triggered |
|---|---|---|---|---|
| 1 | **Quote Requested** | Active | Form → Cloudinary → GHL webhook → Slack ping #quotes-in | W1 New Lead |
| 2 | **Q&A (Clarification)** | Active | Auto-age >4h to prevent dump; Slack alert if stuck | (manual) |
| 3 | **Sub-quote Requested** | **HIDDEN** | Stage exists; filter view hides; no workflows | (none Phase 1) |
| 4 | **Sub-quote Received** | **HIDDEN** | Stage exists; filter view hides; no workflows | (none Phase 1) |
| 5 | **Quote Sent** | Active | 24h SMS nudge + 72h SMS last-call, then mark lost | W3 Quote-Sent Cadence |
| 6 | **Quote Accepted** | Active | Auto-route to deposit/inspection within minutes | (auto-advance to 7 or 8) |
| 7 | **Site Inspection** | Active | Only for strata/commercial/asbestos/high-value jobs | (manual) |
| 8 | **Prepayment** | Active | Stripe metadata: `payment_type=deposit` | (auto-advance to 9 on `invoice.paid`) |
| 9 | **Job in ServiceM8** | Active (bucket only) | "Ready to schedule" Phase 1; ServiceM8 hookup Phase 2 | (manual until Phase 2) |
| 10 | **Job on Hold** | Active | Require `hold_reason` field; weekly review | (manual) |
| 11 | **Job Issue** | Active | Slack alert to #job-issues on entry | (manual) |
| 12 | **Job Booked** | Active | GHL calendar Phase 1 (ServiceM8 calendar Phase 2) | (manual) |
| 13 | **Job Complete** | Active | Founder marks complete + after-photos required | W5 NPS triggers from here |
| 14 | **Job Invoiced** | Active | Stripe metadata: `payment_type=final` | (auto-advance to 15 on `invoice.paid`) |
| 15 | **Job Paid** | Active (terminal) | Warranty doc emailed; manual review window starts | W7 logger |

**Cleo's contrarian quote:** *"15 stages is not the problem. The problem is pretending all 15 are equally active."* The hide-stages-3-4 + bucket-stage-9 tweaks address exactly that.

---

## 3. Workflows — 7 total

### W1 — New Lead from Form
- **Trigger:** Inbound webhook from quote form
- **Actions:**
  1. Create or update contact (dedupe by email + phone)
  2. Create opportunity in **Stage 1 Quote Requested**
  3. Set custom fields from payload (60+ fields, see §5)
  4. Apply tags (`src-`, `svc-`, `area-`, `customer-`, `priority-`)
  5. Compute initial lead score → set `lead_score`
  6. Slack ping to `#quotes-in` with: name, suburb, services, score, photo count, tag summary
  7. Send customer **SMS within 60s** from AU mobile: *"Got your bathroom quote request, [name]! Allan or Marko will respond within 24h. Reply STOP to opt out. — Timeless Resurfacing"*
  8. Send customer auto-reply email from `support@` (backup to SMS)
  9. If `lead_score >= 30`, also fire W6 (Lead-score 30 trigger)

### W2 — Abandoned Quote SMS Recovery
- **Trigger:** Inbound webhook from form Step 1 → Step 2 transition (partial fire)
- **Conditions:** No full submit received within 4 hours; `transactional_optin=true`
- **Actions:**
  1. Create stub contact, tag `flag-abandoned-quote`
  2. Wait 4 hours
  3. Check: did full submit arrive? → if yes, exit
  4. Send SMS (Jordan's exact pattern — 30-40% lead recovery): *"Hi [name], Allan from Timeless Resurfacing — saw you started a quote but didn't finish. Want to text me a couple of photos and I'll quote you back within the hour? Reply STOP to opt out."*
  5. Wait 48h → if no reply, mark `lifecycle_stage=lost-cold`

### W3 — Quote-Sent Cadence (24h + 72h)
- **Trigger:** Opp moves to Stage 5 Quote Sent
- **Conditions:** Tenant excluded (can't approve work)
- **Actions:**
  1. Send quote PDF + Stripe deposit link via email AND SMS
  2. Wait 24h → if not Accepted: SMS *"Hi [name], just checking in on your bathroom quote — any questions? Reply STOP to opt out."*
  3. Wait 48h (cumulative 72h) → if not Accepted: SMS *"Last call on your bathroom quote — expires Friday. Want a quick text back? Reply STOP to opt out."*
  4. Wait 24h → if not Accepted: move to Lost, tag `flag-quote-expired`

### W4 — Missed-Call Text-Back
- **Trigger:** Twilio `voice.call.no-answer` webhook
- **Actions:**
  1. Find contact by inbound phone OR create stub
  2. Send SMS within 30 seconds: *"Sorry we missed you! This is Timeless Resurfacing. Allan or Marko will call back within the hour. Or text me what you need and we'll quote. Reply STOP to opt out."*
  3. Slack ping to `#hot-leads` with caller number

### W5 — NPS Request + Auto-Filter (NEW Phase 1)
- **Trigger:** Opp moves to Stage 13 Job Complete
- **Actions:**
  1. Wait 4 hours (cure window)
  2. Send SMS: *"Hi [name], how would you rate your experience with Timeless Resurfacing 0-10? Just reply with a number. — Allan & Marko"*
  3. Listen for SMS reply with number 0-10
  4. **If 9-10 (Promoter):** wait 24h → SMS *"Thanks [name]! If you've got 60 seconds, would you mind leaving us a Google review? [link]. Helps a lot. Reply STOP to opt out."*
  5. **If 7-8 (Passive):** no further action; tag `nps-passive`
  6. **If 0-6 (Detractor):** Slack alert to `#job-issues` with score + customer details + GHL deep link; Marko/Allan calls within 60min
  7. **If no reply within 7 days:** tag `nps-no-reply`, no further automation
- **Why this design:** auto-filters so founder calls are reserved for the ~10-15% who score low. Scales to 200+ jobs/week without scaling labour.

### W6 — Lead-score 30 trigger
- **Trigger:** Any update to `lead_score` field
- **Conditions:** `lead_score >= 30` AND `priority-hot` not yet applied
- **Actions:**
  1. Apply tag `priority-hot`
  2. Slack ping to `#hot-leads` with name, phone, suburb, score breakdown, GHL deep link
  3. SMS to Allan with one-tap call link: *"HOT LEAD — [name] in [suburb], score [N], [services]. Tap: tel:[phone]"*
  4. If business hours (8am-6pm Sydney): create GHL task assigned to Allan, due in 15min
  5. If outside hours: queue task for next 8am

### W7 — Stage Transition Logger
- **Trigger:** Any opp stage change
- **Actions:**
  1. Append to Slack `#pipeline-feed`: *"[customer] moved [old] → [new] at [time]"*
  2. Webhook to logging endpoint (BigQuery later, just log file Phase 1)

---

## 4. Photo upload — Cloudinary signed flow

### High level
```
Form (browser)
  ↓ fetch signed upload params from /api/cloudinary-signature (small Vercel function)
  ↓ POST file directly to Cloudinary (multipart, signed)
  ↓ receive { secure_url, public_id }
Form
  ↓ POST JSON to GHL webhook with photo URLs as text fields
GHL
  ↓ contact + opp created with photo URLs
```

### Why signed (not unsigned preset)
Unsigned presets can be abused for third-party uploads — anyone scraping our preset name can upload to our Cloudinary account. Signed uploads need a backend-generated signature; the signature is short-lived and per-upload.

### Implementation
- **Backend signer:** `/api/cloudinary-signature` (Vercel/Netlify function or WordPress AJAX endpoint). Reads CLOUDINARY_API_SECRET from env, returns signature for the request.
- **Frontend:** form fetches signature, then POSTs file with signature to `https://api.cloudinary.com/v1_1/{cloud_name}/image/upload`.
- **Storage:** both `secure_url` AND `public_id` saved in GHL custom fields (need both for deletion/cleanup later)
- **EXIF strip:** Cloudinary upload preset configured to strip EXIF GPS metadata (privacy)
- **Folder structure:** `customers/{contact_id_or_email_hash}/{job_or_opp_id}/{area}/{file}`
- **Retry logic:** form retries 3x with exponential backoff. On final failure: form still submits the lead WITHOUT photos + tags `flag-photo-upload-failed` so founder can chase.

### Custom fields per area (text fields holding URLs)
- `photos_bath_urls` (long text, JSON array)
- `photos_walls_urls` (long text, JSON array)
- `photos_floor_urls` (long text, JSON array)
- `photos_basin_vanity_urls` (long text, JSON array)
- `photos_regrouting_urls` (long text, JSON array)
- `photos_full_shower_urls` (long text, JSON array)
- `photos_other_urls` (long text, JSON array)

### AU residency disclosure
Cloudinary storage may route to US/EU regions depending on plan. **Privacy Policy must disclose:** *"Customer photos may be stored or processed by Cloudinary, a service provider that may transfer data outside Australia. By submitting photos you consent to this transfer."*

---

## 5. Slack — GHL outbound webhook → Slack incoming webhook

### Why this path (not Zapier)
- **Free** (Slack incoming webhook is in the free tier; no Zapier subscription)
- **Direct** (no middleware to break)
- **Simple** (5 lines of config in GHL workflow)

### Setup
1. In Slack: Apps → Incoming Webhooks → Create webhook for each channel (`#quotes-in`, `#new-jobs`, `#job-issues`, `#hot-leads`, `#pipeline-feed`)
2. Copy the webhook URL for each channel
3. In GHL workflow: add "Custom Webhook" action → POST to Slack URL → JSON body:
   ```json
   {
     "text": "🔔 New quote request from [name] in [suburb]",
     "blocks": [
       { "type": "section", "text": { "type": "mrkdwn", "text": "*[name]* — [services] — score [N]\n[suburb] — [phone]" }},
       { "type": "actions", "elements": [{ "type": "button", "text": { "type": "plain_text", "text": "Open in GHL" }, "url": "[ghl_deep_link]" }]}
     ]
   }
   ```
4. Test with one workflow before rolling out to all channels.

### Failure mode
If Slack webhook returns 5xx, GHL workflow logs and retries (built-in). If persistent failure, Allan notices via missing #pipeline-feed updates within a day → manual fix.

---

## 6. Pre-first-quote must-haves (CRITICAL — none of these can be skipped)

| # | Item | Owner | Status | Action |
|---|---|---|---|---|
| 1 | **AU Sender ID Registry application** | Allan | ⏸ ON HOLD pending Twilio approval | Apply when Twilio approves; pair with AU mobile purchase. Note: registry is best-applied with a real number; alphanumeric-only registration alone has limited value Phase 1 |
| 2 | **Privacy Policy** on website + linked from form | Allan | ❌ | Sprintlaw template ~$200, one-time |
| 3 | **Customer ToS** in quote PDF (scope, deposit, cancellation, photo use, warranty, ACL wording) | Allan | ❌ | Sprintlaw template ~$200, one-time |
| 4 | **Stripe metadata configured** (`payment_type`, `contact_id`, `opportunity_id`, `quote_id`, `job_id`) | Allan | ❌ | Stripe dashboard, ~30 min |
| 5 | **Stripe webhook idempotency** (use Stripe event ID as dedup key) | Clifford | ❌ | Webhook handler code, ~1 hour |
| 6 | **Cloudinary AU plan + folder structure + privacy disclosure** | Allan + Clifford | ❌ | Cloudinary signup ~10 min + Privacy Policy update |
| 7 | **GA4 conversion event** (full submit + partial submit) | Clifford | ❌ | Form code, ~30 min |
| 8 | **Manual fallback inbox `quotes@`** (rollback if GHL down) | Allan | ❌ | Google Workspace alias, ~10 min |
| 9 | **Quote form consent logs** (timestamp, IP, user agent, consent copy version) | Clifford | ❌ | Form code, ~1 hour |

---

## 7. AU Sender ID Registry — paired with Twilio approval

**Status (2026-05-05):** ⏸ ON HOLD. Allan's Twilio AU Regulatory Bundle is still pending approval. Sender ID Registry application is most useful with the actual Twilio AU mobile number in hand (registering an alphanumeric sender alone has limited Phase 1 value).

**When to action:** the day Twilio approves. Pair with Twilio AU mobile purchase + GHL number sync. ~30 minutes total.

**Recommended apply-by date:** 2026-05-15 (regime starts 2026-07-01). If Twilio approval lands AFTER 2026-05-15, Allan applies for Sender ID Registry as soon as Twilio number is live; the May 15 date is recommended-not-mandatory and the regime doesn't bite until July 1.

**Required when applying:**
- ABN: **30 412 161 602**
- Business name: **Timeless Resurfacing**
- Sender IDs to register:
  - The AU mobile number (`+61 4xx xxx xxx`) — only available post-Twilio approval
  - Optional: alphanumeric brand sender `TIMELESS` (for branded SMS later)
- Industry: Trade services / Renovations
- SMS volume estimate: <1000/mo Phase 1; <5000/mo Phase 2
- Business address: per ASIC registration

**Time to complete:** ~15 minutes once Twilio approval is in.

---

## 8. Form code changes (in `quote-form/src/`)

Files to modify:

### `QuoteForm.jsx`
1. **Replace REPLACE_ME constants:**
   ```js
   const GHL_WEBHOOK = "https://services.leadconnectorhq.com/hooks/{LOCATION_ID}/webhook-trigger/{WEBHOOK_ID}";
   const GHL_PARTIAL = "https://services.leadconnectorhq.com/hooks/{LOCATION_ID}/webhook-trigger/{PARTIAL_WEBHOOK_ID}";
   const CLOUDINARY_CLOUD_NAME = "timeless-resurfacing";
   const CLOUDINARY_SIGNATURE_ENDPOINT = "/api/cloudinary-signature";
   const FALLBACK_QUOTES_EMAIL = "quotes@timelessresurfacing.com.au";
   ```

2. **ACMA opt-in checkboxes** in Step 1 (after phone field):
   - **Marketing OK** (optional): consent for marketing SMS/email
   - **Transactional OK** (REQUIRED): consent for job-related SMS

3. **Cloudinary signed upload flow** (replaces v1's direct multipart to GHL):
   ```js
   async function uploadPhotoSigned(file, areaId) {
     const { signature, timestamp, api_key, folder } = await fetch(CLOUDINARY_SIGNATURE_ENDPOINT, {
       method: 'POST', body: JSON.stringify({ areaId, contactEmail: form.email })
     }).then(r => r.json());
     const fd = new FormData();
     fd.append('file', file);
     fd.append('signature', signature);
     fd.append('timestamp', timestamp);
     fd.append('api_key', api_key);
     fd.append('folder', folder);
     const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
       method: 'POST', body: fd
     });
     return res.json(); // { secure_url, public_id, ... }
   }
   ```

4. **Consent logs** to be sent in payload:
   ```js
   const consentMeta = {
     timestamp: new Date().toISOString(),
     consentCopyVersion: "v1.0-2026-05-05",
     userAgent: navigator.userAgent,
     // IP captured server-side from request headers
   };
   ```

5. **Abandoned-quote partial fire** at Step 1 → Step 2:
   ```js
   const firePartial = async () => {
     await fetch(GHL_PARTIAL, {
       method: 'POST', headers: {'Content-Type':'application/json'},
       body: JSON.stringify({ ...formStep1, ...consentMeta, ...utmData, partial_at: new Date().toISOString() })
     });
   };
   ```

6. **GA4 conversion event:**
   ```js
   gtag('event', 'quote_partial', { ... });  // on Step 1 → Step 2
   gtag('event', 'quote_submit', { ... });   // on full submit
   ```

7. **Fallback failure mode:** if GHL webhook fails after 3 retries:
   ```js
   await fetch('mailto-relay-endpoint', { ... toEmail: FALLBACK_QUOTES_EMAIL });
   showUser('Quote submitted — we\'ll respond within 24h');  // never block UX on tech failure
   ```

---

## 9. Cost stack (recurring monthly, USD)

| Item | Cost | Notes |
|---|---|---|
| GHL Starter | $97 USD/mo | After 2026-05-27 trial expires |
| Twilio AU mobile + SMS | ~$30 USD/mo | $1.20 number + ~$0.075/segment, ~300 SMS/mo Phase 1 |
| Cloudinary | $0 USD/mo | Free tier covers ~25k images/mo |
| Stripe | per-transaction | 1.75% + 30¢ AU; included in COGS |
| Slack | $0 USD/mo | Free tier + incoming webhooks |
| **Total recurring** | **~$130 USD/mo** | ~$200 AUD/mo |

Cash on hand: $1,500 AUD = 7-8 months runway at this burn (before any revenue).

---

## 10. Rollout sequence (revised)

```
TODAY (2026-05-05)
├─ Allan: AU Sender ID Registry application (deadline 2026-05-15) ★ urgent
├─ Allan: Sprintlaw Privacy Policy + Customer ToS engagement (~$200, ~1 week turnaround)
├─ Allan: Cloudinary AU signup with admin@ email
└─ Clifford: build form code changes (§8) on quote-form/feat/ghl-wiring branch

DAYS 1-3
├─ Allan: Twilio PAYG signup with admin@ + AU Regulatory Bundle submission (1-5 day approval)
├─ Allan: GHL Disable-LC-Phone form submission (1-3 day approval)
├─ Allan: GHL admin Day-1 — custom fields + pipeline (15 stages, hide 3+4) + tags
└─ Clifford: form code changes complete on staging; cleo-run.sh validates form payload structure

DAYS 4-6
├─ Allan: GHL admin Day-2 — workflows W1-W7 + email/SMS templates
├─ Allan: Cloudinary folder structure + signed upload preset
└─ Allan: Twilio approval lands → buy AU mobile

DAYS 7-9
├─ Allan: Twilio number syncs to GHL → set as default outbound
├─ Allan: Slack incoming webhook URLs configured per channel
├─ Allan: Stripe metadata fields configured (payment_type, contact_id, opportunity_id, quote_id, job_id)
├─ Allan: Privacy Policy + Customer ToS published on website (Sprintlaw delivery)
└─ Clifford: end-to-end tests on staging via cleo-run.sh validation

DAY 10
├─ Final smoke tests
├─ Cleo peer-review of form code changes (§8) — third Cleo pass
├─ Flip production form's GHL_WEBHOOK to live URL
└─ First live submission monitored

DAY 11+
├─ Allan: Marko's prior regrouting customer = first quote sent (real case study)
├─ Soft-launch Google Ads with $20/day on 1 ad group
└─ Monitor #quotes-in for first organic submissions

DAY 30
├─ Review: conversion rate, CPL, NPS distribution, cadence performance
├─ If patterns hold: scale Ads spend
└─ If first sub onboarded: flip Phase 2 toggles (sub stages, ServiceM8, BigQuery)
```

---

## 11. Failure modes / rollback (NEW — was missing in v1)

| Failure | Detection | Mitigation |
|---|---|---|
| GHL webhook 5xx on form submit | Form retry logic logs | After 3 retries, email lead to `quotes@` inbox; show user "submitted, we'll respond" |
| Cloudinary upload fails | Form catches | Submit lead WITHOUT photos + tag `flag-photo-upload-failed`; founder chases |
| Twilio SMS fails | GHL workflow logs | Email backup fires; Slack alert to `#pipeline-feed` |
| Stripe webhook missed | Daily reconciliation script | Manual stage-advance via GHL admin |
| Slack webhook 5xx | GHL workflow logs | Allan checks `#pipeline-feed` daily; missing → investigate |
| GHL trial expires before paid plan | Calendar reminder + Stripe payment method on file | 2026-05-27 = trial end; Allan pays on or before |
| Sender ID Registry not applied by 2026-05-15 | Calendar reminder | Apply immediately; risk = SMS deliverability degrades |

---

## 12. Open questions remaining (smaller than v1's 5)

1. **Twilio AU Regulatory Bundle approval timing** — is it 1-5 days as documented, or longer in practice? Allan to monitor + escalate if >5 days.
2. **Cloudinary AU residency** — verify exact data flow before promising in Privacy Policy. Allan to check Cloudinary plan settings post-signup.
3. **Sprintlaw Privacy Policy + ToS turnaround** — typically 5-7 days but holiday-dependent. Plan v2 assumes ~1 week.

---

## 13. Sign-off

This plan is the merged synthesis of:
- Clifford's v1 (initial draft, 2026-05-04)
- Cleo's two peer-review passes (2026-05-04, partial + 2026-05-05 follow-up)
- Allan's strategic calls: NPS Phase 1 (override Cleo), pipeline numbering = Jordan's 15 (with tweaks)
- Jordan Schofield's transcripts (Slack confirmation, abandoned-quote 4-5h cadence)
- STATE.md verified facts

— Clifford & Cleo, 2026-05-05

<!-- v2 supersedes v1 (plan_ghl_setup_draft_2026-05-04.md). v1 retained for historical reference; future Clifford reads v2 only. -->
