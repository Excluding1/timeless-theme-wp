# Timeless Resurfacing — Operating Context

**Purpose:** Single source of truth for how Angela's bathroom resurfacing & regrouting business runs. Modelled after Jordan Schofield's Surface Care system, adapted to NSW-only bathroom scope and a 2-person partnership.

**Audience:** Claude across sessions (so I don't drift), Angela and co-founder for shared alignment.

**Last verified:** 2026-05-01

---

## 1. Business in one paragraph

Two co-founders run a tech-operated bathroom resurfacing & regrouting **coordination** business across NSW. Neither touches a tool. Customers find service-specific landing pages via Google Ads, submit a photo-rich quote form, get a 3-tier quote within 15 minutes during business hours, pay a 10% deposit to lock in a date, the job is dispatched to a tier-matched subcontractor via ServiceM8, completion photos are reviewed, final payment is collected, NPS triggers Google review or recovery, and the sub is paid via pay.com.au within 3 business days. Target margin: 48–52% per job.

**The founders are the machine. Subcontractors are the workforce.**

---

## 2. Founders & lane split

**Lanes are non-negotiable.** Cross-laning is the #1 reason 2-founder businesses stall.

| Responsibility | Angela (You) | Co-Founder |
|---|---|---|
| Google Ads setup & management | ✅ | |
| Landing pages & website | ✅ | |
| GoHighLevel pipeline & automations | ✅ | |
| Claude-assisted quoting & 3-tier pricing | ✅ | |
| Weekly metrics: CPL, POAS, CPBJ | ✅ | |
| TikTok / Instagram content | ✅ | |
| Photo review & quote sending | ✅ | |
| Sub recruitment (Hipages, Meta, audit) | | ✅ |
| Sub onboarding, vetting, agreements | | ✅ |
| Sub dispatch & tier management | | ✅ |
| Before/after photo quality checks | | ✅ |
| Customer phone calls | | ✅ |
| NPS escalation calls (score < 7) | | ✅ |
| Strata / asbestos pre-job conversations | | ✅ |
| Property manager relationships | | ✅ |

**Rule:** When in doubt, the lane owner decides. Co-founder advises but doesn't override.

---

## 3. Current state (what's built, what's pending)

| Asset | State | Location |
|---|---|---|
| WordPress theme | ✅ Live | `/Users/angelapham/Downloads/timeless-theme-wp/` |
| Service landing pages (19) | ✅ Built, live | `page-templates/page-*-sydney.php` |
| Homepage hero + slider | ✅ Live | `front-page.php` |
| Google Business Profile | ✅ Set up | external |
| Pricing schedule (135+ SKUs) | ✅ Drafted | `MASTER_PRICING_UPDATED 111.xlsx` |
| Excel epoxy SKUs (BFR-03/04, BWR-02, FBR-03/04) | ✅ Added | same |
| Quote form (React, v9.x) | 🟡 In progress | `/Users/angelapham/Downloads/timeless-quote-app/src/QuoteForm.jsx` |
| Quote form NSW gating + asbestos check | ✅ Done | same |
| Quote form GHL webhook | ❌ `REPLACE_ME` placeholder | same file |
| ABN / PL Insurance ($20M) / Fair Trading | ✅ Active | per saved memory |
| Builder licence | ❌ Not yet — DO NOT CLAIM in copy | per saved memory |
| GoHighLevel CRM | ❌ Not set up | — |
| ServiceM8 | ❌ Not set up | — |
| Slack workspace | ❌ Not set up | — |
| Subcontractors signed | ❌ 0 vetted | — |
| BigQuery | ❌ Phase 5 only | — |

**Right now we are at:** quote form polish → GHL build → first subs → first ad spend.

---

## 4. The customer journey, end to end

```
Google search → service landing page → quote form (5 steps + photos) → submit
  → SMS ack within 60s + Slack #quotes-in alert
  → Angela reviews flags, drafts 3-tier quote in Claude (~5 min target)
  → Quote sent via SMS + email
  → 24h + 72h follow-ups if no response
  → Customer picks tier → 10% deposit Stripe link
  → Deposit paid → ServiceM8 job created + Slack #new-jobs alert
  → Co-founder dispatches tier-matched sub
  → Day-before reminder SMS to customer
  → Sub completes job + uploads before/after photos
  → Cure-time SMS to customer (don't use 24-48h)
  → 4h after completion: NPS request SMS
    → Score 9-10: Google review request + referral offer 24h later
    → Score 7-8: passive (no review ask)
    → Score 1-6: Slack alert + co-founder calls within 60min
  → Final payment Stripe link → 90% collected
  → Warranty confirmation email
  → Sub paid via pay.com.au within 3 business days
  → Job closed
```

---

## 5. Quote form (the front door)

### 5.1 Why it matters

The quote form is **the conversion gate** between ad spend and revenue. Per Jordan's model: if the quote form is too long → leads abandon → CPL spikes → POAS collapses. If too short → tradies can't quote without a callback → response time slips → conversion drops.

The current React form ([src/QuoteForm.jsx](../timeless-quote-app/src/QuoteForm.jsx)) is the v9.x lead-intake design — collects enough for tradie + photo review to assign a final SKU, but no more.

### 5.2 Current form structure (5 steps)

| Step | Section | Required fields |
|---|---|---|
| 1 | About you | First name, Last name, Phone OR "no phone", Email, Customer type (Owner/PM/Builder/Tenant), Tenant authorisation flow if applicable |
| 2 | Where | Address (Google Places autocomplete, NSW-restricted), Property type, Lift access if apartment, Asbestos screening (built before 1990?) |
| 3 | What does your bathroom need | Tick all areas that apply (Shower / Bath / Basin / Vanity / Silicone seals / Floor / Wall tiles / Full bathroom card) |
| 4 | Services | Single-area mode: SvcCard per service in selected area. Multi-area mode: MULTI_ITEMS broad picks per area + conditional flags (epoxy, basin count, spa) |
| 5 | Photos & submit | Per-area required photos + extra optional, Quick details (prev resurfaced / ventilation), Notes, Marketing consent, Submit |

### 5.3 Form-level rules

- **NSW only.** Google Places `locationRestriction` rectangle covers NSW; postcode + state-code + suburb-keyword fallback validates address. Out-of-NSW → waitlist capture (reuses entered email).
- **AU phone normalised** (`+61` → `0X`, format-as-you-type, mobile vs landline detected by leading digits).
- **No-phone path** (rare): elderly/overseas customers get email-only quote.
- **Tenant must authorise** (self vs send-to-landlord) before Next.
- **Asbestos question required** (Yes / No / Unsure) — Excel rejection #8.
- **Spa flag** triggers when bath resurface picked — BTV-05/06 vs BTH (~$440 delta).
- **Basin count** triggers when basin pick made — BSN-03 add-on for double basin.
- **Epoxy upgrade** triggers when any regrout pick made — different SKU series + +$50 sub bonus.
- **Honeypot anti-spam** + **spam phone pattern detection** (rejects 0411111111, 0412345678 etc).
- **localStorage persistence** for cheap-to-restore fields (name/phone/email/address only).
- **Image compression** client-side before upload (1920px max, JPEG q0.8).
- **AbortController + cache** on Places autocomplete (instant on re-typed queries).
- **Partial-lead webhook** fires on Step 1 → 2 transition (recovers ~30% of abandoners per Jordan benchmark).
- **Honest trust badges only**: "Sydney Local • $20M Insured • Up to 5yr Warranty" — NOT "NSW Licensed" until builder licence issued.

### 5.4 Hidden fields (must be wired before ad spend)

| Field | Source | Purpose |
|---|---|---|
| `gclid` | URL param | Google Ads click ID — ties lead to keyword |
| `gbraid` / `wbraid` | URL param | iOS conversion tracking |
| `utm_source` | URL param | Channel (google, facebook, instagram) |
| `utm_medium` | URL param | cpc, organic, email, social |
| `utm_campaign` | URL param | Specific campaign name |
| `utm_content` | URL param | Ad variant |
| `utm_term` | URL param | Keyword (search ads) |
| `landing_page` | `window.location.pathname` | Which service page they came from |
| `referrer` | `document.referrer` | External source |
| `form_version` | hardcoded | For A/B test rollback |
| `device_type` | UA sniff | mobile vs desktop split |

**These already exist** in [QuoteForm.jsx](../timeless-quote-app/src/QuoteForm.jsx) tracking object — confirmed.

### 5.5 Form → SKU mapping

Authoritative map: [docs/FORM-TO-PRICING-MAP.md](../../timeless-quote-app/docs/FORM-TO-PRICING-MAP.md). Updated each time form options or pricing change.

---

## 6. The tech stack — single-line ownership

| Tool | Role | Source-of-truth for | Cost |
|---|---|---|---|
| **WordPress + theme** | Public site, SEO, landing pages | Marketing content | Hosting only |
| **React quote form** | Lead intake | Form submission event | Free (Vercel/embed) |
| **GoHighLevel** | CRM, pipeline, customer comms, follow-ups | Contact + opportunity state | $155/mo AUD |
| **Stripe** | Deposit + final payment links | Payment events | 1.75% + 30c |
| **ServiceM8** | Job dispatch, sub assignment, completion photos | Job execution state | $29/mo Starter |
| **pay.com.au** | Sub payouts via rewards card | Outgoing sub payments | ~1.5–2% per txn (absorbed by margin) |
| **Xero** | Accounting, bank feed, invoices | Books of account | $35/mo Ignite |
| **Slack** | Internal alerts only (NOT customer-facing) | Real-time notifications | Free tier OK initially |
| **Zapier or Make** | Glue between systems for events not natively connected | (none — pure plumbing) | $30/mo AUD |
| **Google Sheets** | Phase 1 fallback tracker before BigQuery | Manual KPI tracking | Free |
| **BigQuery + Google Cloud** | Phase 5 — owned data layer for reporting | All historical event data | ~$50/mo |
| **Claude (paid)** | Quote drafting, agent automations later | (none — assistance) | $20–100/mo |

**Principle**: each tool has ONE role. Don't run customer comms in Slack. Don't track jobs in Sheets after GHL is live. Don't store reporting state inside the CRM.

---

## 7. System architecture — the data flow

```
                  ┌─────────────────┐
                  │  WP Landing Page│
                  │   (front-page,  │
                  │  service pages) │
                  └────────┬────────┘
                           │ form embed/iframe
                           ▼
                  ┌─────────────────┐
                  │  React Quote    │
                  │  Form (v9.x)    │──── Stripe (deposit/final links)
                  └────────┬────────┘
                           │ webhook (form submit)
                           ▼
              ┌──────────────────────────┐
              │  GoHighLevel             │
              │  ─ Contact created       │──── SMS / Email to customer
              │  ─ Opportunity Stage 1   │     (auto via workflows)
              │  ─ Custom fields filled  │
              │  ─ Tags applied          │
              └────┬──────────┬──────────┘
                   │          │
                   │          │ webhook on stage change
                   │          ▼
                   │   ┌──────────────┐
                   │   │  Slack       │
                   │   │  #quotes-in  │
                   │   │  #new-jobs   │
                   │   │  #job-issues │
                   │   │  ...         │
                   │   └──────────────┘
                   │
                   │ on Quote Accepted + Deposit Paid only
                   ▼
              ┌─────────────────┐
              │  ServiceM8      │
              │  ─ Job card     │──── Sub mobile app
              │  ─ Templates    │     (assigned sub gets job)
              │  ─ Photos       │
              │  ─ Completion   │
              └────────┬────────┘
                       │ webhook on completion
                       ▼
              ┌─────────────────┐
              │  GoHighLevel    │ ◄── job complete event closes loop
              │  Stage 15+      │     (NPS, final payment, warranty)
              └────────┬────────┘
                       │
                       │ daily/event sync (Phase 5)
                       ▼
              ┌─────────────────┐
              │  BigQuery       │ ◄── Google Ads spend (also synced)
              │  ─ leads        │
              │  ─ opps         │
              │  ─ payments     │
              │  ─ jobs         │
              │  ─ ad_spend     │
              └────────┬────────┘
                       │ Looker Studio / Slack report
                       ▼
              ┌─────────────────┐
              │  Weekly KPI     │
              │  Slack post     │
              └─────────────────┘
```

**The brain is the data layer above the tools** — not any one tool. BigQuery in Phase 5 is what makes you portable: if GHL goes down or you switch CRMs, the historical data lives.

---

## 8. GoHighLevel — detailed setup

### 8.1 Setup order (do not skip)

1. **Business profile** — name, logo, ABN, phone (0451 110 154), Sydney timezone, hours Mon–Sat 8am–6pm.
2. **Connect** Google Workspace email + Twilio SMS number (purchased through GHL).
3. **Custom fields** (build all before workflows — workflows reference them).
4. **Tags** library.
5. **Pipeline** — 17 stages (see 8.4 below).
6. **Workflows** — 12 core (see 8.5 below).
7. **Form** — only if quote form moves into GHL native (right now stays React for performance).
8. **Templates** — quote email, deposit SMS, follow-ups, warranty.

### 8.2 Custom fields (full list)

```
# Contact-level
- customer_type           (owner, pm, builder, tenant)
- company_name
- tenant_authorization    (self, send_to_landlord)
- landlord_email

# Property-level
- property_type           (house, apt, commercial)
- property_address
- suburb
- postcode
- service_area_zone       (cbd, north, south, west, etc — for routing)
- lift_access             (yes, no, n/a)
- built_before_1990       (yes, no, unsure)
- previous_resurfaced     (yes, no, unsure)
- has_ventilation         (yes, no)

# Job-level
- areas_selected          (csv: shower,bath,basin,...)
- services_selected       (csv: sh1,bt1,...)
- mode                    (single, multi, unsure)
- shower_over_bath        (yes, no, n/a)
- epoxy_preference        (csv per area: shower:epoxy,floor:standard,...)
- basin_count             (1, 2)
- bath_type               (standard, spa)
- customer_notes          (free text)
- photo_count
- photos_uploaded         (yes, no)
- photo_urls              (csv after Cloudinary upload)

# Quote-level
- quote_tier_chosen       (option1, option2, option3)
- quote_amount
- deposit_amount
- assigned_subcontractor
- assigned_sub_tier       (1, 2, 3)
- servicem8_job_id

# Tracking
- gclid
- utm_source / medium / campaign / content / term
- landing_page
- referrer

# Outcomes
- nps_score               (1-10)
- review_link_sent        (yes, no)
- google_review_left      (yes, no, unknown)
- referred_by             (contact ID if referral)
- referral_credit_owed    ($ amount)

# Meta
- form_version
- form_status             (partial, complete, waitlist)
- submitted_at
- device_type
```

### 8.3 Tags

```
service_shower_regrout
service_shower_recoat
service_bath_resurface
service_bath_chip
service_basin
service_vanity
service_silicone
service_floor
service_walls
service_full_bathroom

flag_strata
flag_asbestos_review
flag_leak
flag_stone
flag_previous_resurface
flag_unclear_photos
flag_multi_bathroom

lead_google
lead_facebook
lead_instagram
lead_tiktok
lead_referral
lead_repeat_customer
lead_property_manager

stage_quote_sent
stage_quote_accepted
stage_deposit_paid
stage_job_booked
stage_job_complete

nps_promoter      (9-10)
nps_passive       (7-8)
nps_detractor     (1-6)

customer_repeat
customer_referrer
```

### 8.4 The 17-stage pipeline

| # | Stage | Owner | Trigger to enter |
|---|---|---|---|
| 1 | Quote Requested | Auto | Form submitted |
| 2 | QA / Pre-Check | You | Auto on flag detection (strata/asbestos/leak/stone/multi) |
| 3 | Sub Availability Check | Co-founder | After QA cleared |
| 4 | Scope Confirmed | You | All info present, photos clear |
| 5 | Quote Sent | Auto | Quote dispatched via SMS+email |
| 6 | Follow-Up | Auto | 24h after Stage 5, no response |
| 7 | Quote Accepted | Auto | Customer clicks tier link |
| 8 | Site Inspection (optional) | Co-founder | Manual move for complex/$2k+/unclear |
| 9 | Deposit Requested | Auto | Stripe link sent |
| 10 | Deposit Paid | Auto | Stripe webhook fires |
| 11 | Job in ServiceM8 | Co-founder | SM8 job created |
| 12 | Job Booked | Co-founder | Date + sub locked in |
| 13 | Job On Hold | Manual | Access/strata/asbestos hold |
| 14 | Job Issue | Auto | Sub reports problem |
| 15 | Job Complete | Auto | SM8 completion form filled |
| 16 | Final Invoice / Payment | Auto | Final Stripe link → paid |
| 17 | Closed / Sub Paid | Co-founder | Sub paid via pay.com.au |

### 8.5 The 12 workflows (in priority order)

1. **Instant Quote Acknowledgement** — form submit → SMS within 60s + Stage 1 + Slack `#quotes-in`.
2. **Abandoned Form Recovery** — phone/email captured but no submit within 5h → SMS link to resume. (~30% recovery rate per Jordan.)
3. **24h Quote Follow-Up** — Stage 5, no movement → friendly check-in SMS.
4. **72h Final Follow-Up** — 48h after follow-up 1 → "Last one from us…" SMS.
5. **Booking Fee Trigger** — Stage 7 → 10% deposit Stripe link SMS.
6. **BOOM Notification** — Stripe deposit paid → Slack `#new-jobs` + Stage 10.
7. **Job Issue Alert** — Stage 14 → Slack alert + customer SMS "Co-founder will call within 30min".
8. **Day-Before Reminder** — Stage 12 + 24h before appointment → customer SMS + sub Slack ping.
9. **Cure Time Warning** — Stage 15 → SMS "Don't use shower/bath 24–48h".
10. **NPS Routing** — Stage 15 + 4h → SMS rating request → score routing.
11. **Referral Offer** — `nps_promoter` tag + 24h → SMS with referral code ($50/$50 split).
12. **Warranty Confirmation** — Stage 16 (final payment) → email PDF with 2-year (or up-to-5-year per service) warranty.

---

## 9. ServiceM8 — detailed setup

### 9.1 When jobs enter SM8

**Only after Stage 10 (Deposit Paid) in GHL.** Never create SM8 jobs from raw leads — fills SM8 with junk.

### 9.2 Job templates (5 core)

Each template includes scope checklist + materials notes + before/after photo requirement + colour used + cure-time reminder.

1. **Shower Regrout** (sh1/sh2 + multi `m_shower_regrout`)
2. **Bath Resurface** (bt1 + multi `m_bath_resurface`)
3. **Shower Over Bath Combo** (when `shower_over_bath = yes`)
4. **Silicone Replacement** (ml1/ml2/ml3 + bt4)
5. **Full Bathroom** (multi `m_full` + Full Bathroom card)

### 9.3 SM8 custom fields

```
- ghl_contact_id
- ghl_opportunity_id
- quote_tier_selected
- deposit_paid              (boolean)
- strata_approval_received  (boolean)
- asbestos_cleared          (boolean)
- stone_specialist_required (boolean)
- subcontractor_tier        (1, 2, 3)
- photo_folder_link         (Cloudinary or Drive)
- warranty_period_years
- job_profitability_estimate
```

### 9.4 Job completion form (sub fills)

- Before photos (required)
- After photos (required)
- Materials used
- Colour used
- Issues encountered
- Extra works required
- Customer present (yes/no)
- Strata approval sighted (if flag)
- Completion confirmation tick

### 9.5 Subcontractor tier system

| Tier | Quality score | Acceptance rate | Time active | Job complexity allowed |
|---|---|---|---|---|
| 1 | 4.5+ stars | 80%+ | 2+ months | Any incl. complex / strata / commercial |
| 2 | 3.5–4.4 | 65–79% | 1–2 months | Standard jobs only |
| 3 | New, on probation | n/a | 0–1 month | Test jobs only, heavy review |

**Dispatch rule:** Filter by suburb + skill → offer to Tier 1 first → Tier 2 if declined → Slack alert if both decline.

**Never** send Tier 3 to strata, commercial, full bathroom, or pre-1990 jobs.

**Monthly tier review.** Subs averaging <4/5 get a call before downgrade. Tier 3 with no improvement after 2 months → removed.

### 9.6 Subcontractor agreement (must be signed before any job)

- Non-solicitation: cannot contact your customers directly for 24 months
- Confidentiality: cannot share pricing, processes, customer data
- ABN confirmation (independent contractor, not employee — Fair Work compliance)
- $5M+ public liability insurance current, certificate annually
- Payment terms: within 3 business days of customer final payment clearing
- Photo requirement: before/after to SM8 before job marked complete
- Quality standard: rectify at own cost if work below standard
- Rate card acknowledgement
- Asbestos clause: no work on suspected ACM without independent assessment first
- Strata clause: owners corporation approval doc must be sighted before commencing

Use **DocuSign** to sign every agreement. Zero exceptions.

---

## 10. Slack — detailed setup

### 10.1 Channels

| Channel | Purpose | Notification |
|---|---|---|
| `#quotes-in` | Every form submission with all flags + suburb + source | Persistent on phone |
| `#quote-sent` | Every quote dispatched (visibility for co-founder) | Off |
| `#new-jobs` | Deposit paid → BOOM. The dopamine channel. | Persistent on phone |
| `#job-updates` | Booking, completion, reschedule, photo upload | On |
| `#job-issues` | Stage 14 alerts — needs response within 30min | Persistent |
| `#subs` | Coordination with subcontractors directly | On |
| `#reviews-nps` | NPS scores + Google review tracking | On |
| `#weekly-numbers` | Friday KPI digest (manual or auto from BigQuery in Phase 5) | On |
| `#automation-errors` | Failed Zaps, webhook errors, sync failures | Persistent — silent failures kill businesses |
| `#general` | Day-to-day between you two | On |

### 10.2 Message format (structured, not chatty)

`#quotes-in`:
```
🆕 NEW QUOTE | [First] [Last] | [Suburb] | [Service]
Flags: [strata, asbestos_review, ...]
Bathrooms: [N] · Mode: [single/multi/unsure]
Source: [google · campaign_X · landing /shower-regrouting-sydney]
Photos: [N uploaded]
→ GHL: [contact link]
```

`#new-jobs`:
```
💰 DEPOSIT PAID | [First] [Last] | [Suburb]
Service: [name] · Tier: [option_2]
Quote: $[total] · Deposit: $[10%]
Sub assigned: [name, tier]
Booking date: [TBC]
→ GHL: [link] · SM8: [link]
```

`#job-issues`:
```
🚨 JOB ISSUE | [Customer name] | [Sub name]
Issue: [from sub completion form]
Customer notified: ✅
[Co-founder] to call within 30min.
```

### 10.3 Decision rule

**Slack = alerts. NEVER decisions.** If a decision is being made in Slack DM, it must move to a GHL note, SM8 note, or shared doc. Slack messages disappear; documented decisions don't.

---

## 11. BigQuery — Phase 5 reporting layer

**Don't build this until Stage A (stable ops) is reached.** Per Jordan's transcript: BigQuery was added once the operational tools were humming, NOT before. Premature BigQuery = data plumbing for a business with no data yet.

### 11.1 When to start

When you have ≥50 completed jobs in GHL + SM8 history. Below that, Google Sheets tracker is fine.

### 11.2 Tables (when built)

```
leads_raw                  -- every form submission, even abandoned
contacts                   -- deduped customers
opportunities              -- one row per quote
pipeline_events            -- every stage change with timestamp
quotes                     -- quote details (tier, amount)
payments                   -- deposit + final, Stripe-sourced
jobs_sm8                   -- ServiceM8 job records
job_completion             -- completion form data + photos URLs
subcontractors             -- sub roster
sub_payouts                -- pay.com.au transactions
nps_reviews                -- NPS scores + review status
ad_spend_daily             -- Google Ads daily spend per campaign
landing_page_performance   -- WP analytics → BQ
```

### 11.3 KPIs the BigQuery layer must answer

| Metric | Calculated as |
|---|---|
| **CPL** (Cost per Lead) | ad_spend ÷ leads (per channel, per service page) |
| **CPBJ** (Cost per Booked Job) | ad_spend ÷ deposit_paid_jobs |
| **POAS** (Profit on Ad Spend) | (revenue − sub_cost − materials − pay.com.au_fees) ÷ ad_spend |
| **Average Profit per Job** | sum(profit) ÷ count(jobs) — Jordan's $362 number |
| **Quote-to-booking rate** | deposit_paid ÷ quote_sent |
| **Form completion rate** | submissions ÷ form_starts |
| **NPS distribution** | promoter / passive / detractor mix |
| **Sub utilisation** | jobs_per_sub_per_week, by tier |
| **Suburb profitability** | profit by suburb (some areas drag margins) |
| **Service profitability** | profit by service type (regrout vs resurface vs full) |

### 11.4 Sync pattern

Phase 5: GHL → Zapier/Make webhook → small middleware → BigQuery `INSERT`.
Phase 6+: replace middleware with Cloud Functions for reliability.

---

## 12. How everything connects — the wiring

### 12.1 Website → GHL

- React quote form's `GHL_WEBHOOK` and `GHL_PARTIAL` webhook URLs (currently `REPLACE_ME` in [QuoteForm.jsx:633-634](../timeless-quote-app/src/QuoteForm.jsx#L633)) get filled with real GHL Inbound Webhook URLs once GHL is set up.
- Submit → POST JSON to GHL → contact created → tags + custom fields applied → Stage 1.

### 12.2 GHL → Slack

Use **GHL native Slack action** in workflows (preferred) OR webhook → Zapier → Slack channel. Native is cleaner — fewer moving parts.

### 12.3 GHL → ServiceM8

Two options:
- **Native integration** if available (check GHL marketplace + SM8 API status).
- **Zapier**: GHL Stage 10 (Deposit Paid) → Zapier → SM8 Create Job, with all fields mapped.

Pass these fields from GHL to SM8:
```
customer_name, mobile, email, address, suburb, service_type,
scope_notes, quote_amount, tier_selected, photo_urls, flags,
preferred_date, internal_notes, ghl_opportunity_id
```

### 12.4 ServiceM8 → GHL (return path)

When SM8 job marked complete → SM8 webhook → GHL workflow → move opp to Stage 15 → fire NPS workflow.

### 12.5 Stripe → GHL

Stripe webhook on `payment_intent.succeeded` → identify deposit vs final by metadata → GHL workflow updates stage.

### 12.6 Google Ads → GHL → BigQuery

Google Ads conversion fires on quote form thank-you page (URL param: `gclid` already captured into custom field). Phase 5: BigQuery joins Ads spend table to GHL conversion table on `gclid`.

---

## 13. Decision rules (the operating logic)

### 13.1 POAS, not ROAS

**ROAS** = revenue ÷ ad_spend. Tells you nothing about profit.
**POAS** = (revenue − sub_cost − materials − fees) ÷ ad_spend. Tells you if the campaign actually made money.

**Target POAS: 2.5x.** Below that → kill the campaign or restructure.

### 13.2 Score every job before accepting

| Input | Source |
|---|---|
| Expected revenue | Quote tier customer picked |
| Expected cost | Sub rate card + materials + pay.com.au fee + travel zone |
| Margin | revenue − cost |

**If margin < $300 → don't accept.** Better to leave money on the table than carry a low-margin job.

Jordan's average profit per job: $362. Aim for $300+ as a floor.

### 13.3 Tier dispatch logic

```
if job.tier_required == "premium" or has_flag(strata|commercial|fullbath):
    require Tier 1 sub
elif job.standard:
    Tier 1 first, fallback Tier 2
elif test job, simple, low-risk:
    Tier 3 with heavy review
```

### 13.4 When to hold a job (Stage 13)

- Asbestos confirmation pending (pre-1990 build)
- Strata approval not sighted yet
- Active leak — plumber assessment first
- Customer access not arranged
- Photo retakes needed before sub commits

### 13.5 When to reject a job outright

- Travel zone outside NSW (waitlist instead)
- Bathroom in a property type we don't service (caravan, boat)
- Customer demands fixed $ before photos reviewed
- Customer wants warranty over what our pricing schedule allows

---

## 14. Compliance & non-negotiables

| Area | Rule | Why |
|---|---|---|
| **Builder licence claim** | DO NOT use "NSW Licensed" anywhere until licence issued | Fair Trading Act exposure (misleading conduct) |
| **Testimonials** | Never fabricate reviews | ACCC s18 — misleading conduct, fines per breach |
| **5-yr warranty** | Always say "Up to 5-year" — varies by service per pricing schedule | Same — accurate claims only |
| **Privacy Act 1988** | Privacy policy linked from form, photos handled per stated policy | Required by law for any business collecting personal info |
| **Spam Act 2003** | Marketing consent checkbox separate from quote consent, unsubscribe in every marketing email | Australian anti-spam law |
| **NSW Strata Schemes Management Act 2015** | Confirm owners corp approval before commencing strata jobs | Strata can demand reinstatement at sub's cost otherwise |
| **Asbestos pre-1990** | Always require independent assessment before commencing on suspected ACM | NSW WHS Reg 2017 — large fines, criminal liability |
| **Subcontractor independence** | Sub keeps own ABN, own insurance, own tools, sets own hours where possible | Fair Work — sham contracting fines + super back-pay risk |
| **GST registration** | Required once 12-month revenue forecast exceeds $75,000 | ATO law |

---

## 15. Phased build plan

### Phase 1 — Lead capture (CURRENT)
- ✅ Website + 19 service pages + GBP
- ✅ Pricing schedule (with epoxy SKUs added)
- 🟡 Quote form polished (in progress — currently passing audits)
- ⬜ Replace `REPLACE_ME` webhooks with real GHL URLs (blocks Phase 2)
- ⬜ Cloudinary upload integration for photos (placeholder right now)

### Phase 2 — GHL pipeline + quoting
- ⬜ GHL business setup
- ⬜ Custom fields + tags
- ⬜ 17-stage pipeline
- ⬜ All 12 workflows live and tested
- ⬜ Quote templates (3-tier good/better/best per service)
- ⬜ Stripe deposit + final links

### Phase 3 — Job handoff
- ⬜ ServiceM8 setup with 5 templates
- ⬜ GHL → SM8 job sync (Zapier or native)
- ⬜ SM8 → GHL completion sync
- ⬜ First 3 subcontractors signed (DocuSign'd, test job passed each)

### Phase 4 — Payment + closeout
- ⬜ Final payment workflow
- ⬜ NPS routing live
- ⬜ Google review request
- ⬜ Referral offer ($50/$50) workflow
- ⬜ Warranty email template
- ⬜ pay.com.au sub payment workflow

### Phase 5 — BigQuery + measurement
- ⬜ Google Cloud project + BigQuery dataset
- ⬜ GHL → BQ event sync
- ⬜ SM8 → BQ event sync
- ⬜ Google Ads → BQ daily spend sync
- ⬜ Looker Studio or Slack weekly KPI digest

### Phase 6 — AI agents (final)
- ⬜ Quote-draft agent (photos + form → 3-tier draft)
- ⬜ Duplicate-address detector (per Jordan's "quote integrity analyst")
- ⬜ Weekly business analyst agent (Monday Slack post)
- ⬜ Ads optimisation agent (POAS-based, not ROAS)
- ⬜ Sub recruitment outreach agent (Hipages auto-message)
- ⬜ Review responder agent

**Hard rule: don't skip phases.** Phase 6 needs Phase 5 data; Phase 5 needs Phase 2-4 events. Skipping creates "AI agents with no data" or "automations that fire into nothing."

---

## 16. Methodology — the multi-expert audit process (HOW I work, not just what)

This is the process I commit to applying on **every meaningful task** (form change, GHL workflow design, agent build, schema decision). It's the discipline behind the day-by-day work pattern Angela and I have settled into. Skipping this = drift = bad recommendations.

### 16.1 The 5-step loop

```
1. RESEARCH   →  2. EXPERT FRAME  →  3. BUILD  →  4. TRIPLE AUDIT  →  5. RECONCILE
                                                          ↑
                                                          └─ from 3+ angles
```

**1. Research** — before recommending, fetch current information (web search for benchmarks, Context7 for SDK docs, codebase for actual file state). Never default to training data on fast-moving topics (GHL features, AU compliance dates, AI agent patterns).

**2. Expert frame** — explicitly name the best-fit expert role for the task. Different tasks need different lenses; conflating them gives muddy advice.

**3. Build** — execute under that expert role. State the role I'm taking before recommending.

**4. Triple audit** — once built, audit from 3+ lenses chosen for the task. Always include at least one **adversarial** lens (compliance, customer abandonment, data integrity).

**5. Reconcile** — the 3 audits will conflict. The reconciliation step weighs marginal value vs. marginal cost across the lenses. Document the trade-off so future-me sees the reasoning.

### 16.2 Expert role library (best-fit per task)

| Task type | Expert role I take | Auditor lens |
|---|---|---|
| Quote form UX changes | CRO specialist for AU home services | Mobile abandonment auditor + WCAG auditor |
| Form copy / customer-facing text | Conversion copywriter (B2C trades) | Compliance auditor (ACCC, Spam Act) |
| GHL workflow design | GHL automation operator (agency archetype) | Privacy + Spam Act auditor |
| ServiceM8 setup | Field service ops manager | Sub independence (Fair Work) auditor |
| Slack channel architecture | Internal comms IA specialist | Noise / signal-to-noise auditor |
| BigQuery schema | Analytics data engineer | Data quality + GDPR/Privacy auditor |
| Google Ads structure | Performance marketing specialist (POAS-first) | Margin-per-channel auditor |
| AI agent design | AI ops engineer + service business operator | AI safety / hallucination auditor |
| Subcontractor agreement / dispatch | Trades ops + ABN/contractor lawyer | Fair Work compliance auditor |
| Photo upload pipeline | Mobile-first frontend dev | Performance + offline-tolerance auditor |
| Pricing / SKU decisions | NSW resurfacing trade expert | Margin/job auditor |
| Reviews / NPS | CX specialist | ACCC review-genuineness auditor |
| Email / SMS templates | Direct response copywriter | Spam Act 2003 auditor |
| Multi-household duplicate detection | Trust & safety engineer | Privacy + customer-fairness auditor |

### 16.3 Triple-audit rule: 3 lenses minimum, one must be adversarial

For any non-trivial recommendation:
- **Lens 1**: the domain expert (e.g. CRO specialist for form changes)
- **Lens 2**: the customer / end-user POV (real abandonment risk, real confusion)
- **Lens 3**: an adversarial lens (compliance, security, data integrity) — the one that says "this could blow up legally / financially / operationally"

If all 3 agree → ship it. If 2 of 3 → reconcile with documented trade-off. If only 1 → don't ship; rethink.

### 16.4 Verifying before recommending — trust but verify

Memory and prior decisions get stale. Before recommending action:
- File path mentioned → `Read` or `ls` to confirm it exists
- Function/flag mentioned → grep for it in current code
- "We decided X" → re-check current code/config matches
- Benchmark cited → confirm it's from research (Jordan transcript / WebSearch result), not invented

**Never** recommend from memory without verifying against current state when the user is about to act on it.

### 16.5 Output format conventions

When I deliver findings, I'll use:
- 🔴 **Must fix** (blocks safe operation / compliance)
- 🟠 **Should fix** (real conversion or margin lift)
- 🟢 **Nice to have** (polish, low-impact)
- ⚪ **Accept as-is** (recommended explicitly to NOT change — important to call out)

Tables for trade-offs. Concrete file:line references for code claims. No vague "this could be better."

### 16.6 When NOT to apply this loop

For trivial work (single file rename, typo fix, single boolean flip) — just do it. The full methodology is for decisions with consequences. Use judgement; over-applying it on tiny tasks wastes Angela's time as much as skipping it on big ones.

---

## 17. What I (Claude) should always remember

When advising on this business, I should:

✅ **Default to Jordan's principles** unless Angela explicitly diverges:
- Lane discipline (don't recommend cross-laning)
- POAS over ROAS (every metric I report should be profit-aware)
- Score jobs before accepting (margin floor > volume)
- One tool, one role (don't suggest tracking jobs in 2 places)
- BigQuery is Phase 5, not Phase 1

✅ **Honor saved memory** — specifically:
- No prices on website
- "Up to 5-yr warranty" not "5yr"
- No "NSW Licensed" claim
- /sydney/ URL = duplicate of /
- Suburbs are data-driven, not separate landing pages
- Quote form is isolated from WP theme — don't modify both at once

✅ **Stay within scope**:
- NSW only — Sydney + Wollongong + Central Coast
- Bathroom only (no kitchens, no commercial fitouts unless flagged)
- Coordination, not execution — never recommend Angela "go onsite"

❌ **Never**:
- Fabricate testimonials, reviews, or social proof numbers
- Recommend claims that exceed current legal/insurance scope
- Suggest tools that duplicate existing tool's role
- Push for AI agents before the data layer underneath them is real
- Bypass the asbestos / strata / leak holds for "speed"
- Recommend short-term tactics that compromise the long-term system

🔍 **Always verify before recommending**:
- File paths exist (`Read` or `Bash ls` first)
- Memory entries are still current (re-check current code state)
- Jordan-quoted numbers are inspirational benchmarks, NOT Angela's targets

---

## 18. References

| Doc | Purpose |
|---|---|
| [CLAUDE.md](../CLAUDE.md) | WP theme conventions, file structure, deploy workflow |
| [HANDOFF.md](../HANDOFF.md) | Active task list across the project |
| [docs/QUOTE-FORM-GHL-MIGRATION-PLAN.md](QUOTE-FORM-GHL-MIGRATION-PLAN.md) | Detailed plan for moving quote form into GHL native (if/when) |
| [../timeless-quote-app/docs/FORM-TO-PRICING-MAP.md](../../timeless-quote-app/docs/FORM-TO-PRICING-MAP.md) | Form picks → Excel SKU map, kept in sync with form changes |
| [../timeless-quote-app/docs/QUOTE-FORM-HARDENING-PLAN.md](../../timeless-quote-app/docs/QUOTE-FORM-HARDENING-PLAN.md) | 12-cycle audit log of quote form fixes |
| [../timeless-quote-app/docs/DEEP-AUDIT-2026-04-29.md](../../timeless-quote-app/docs/DEEP-AUDIT-2026-04-29.md) | Form gaps + Excel pricing review (the audit that found the epoxy SKU gap) |
| `/Users/angelapham/Downloads/MASTER_PRICING_UPDATED 111.xlsx` | Master pricing schedule, 140+ SKUs, T1/T2/T3 tiers |
| `~/.claude/projects/-Users-angelapham-Downloads-timeless-theme-wp/memory/MEMORY.md` | Saved memories (auto-loaded each session) |

---

## 19. Quick-recall summary (for the impatient)

- **Business**: 2-founder coordination biz; subs do work; aim 48–52% margin
- **Front door**: React quote form on WP service pages → GHL webhook
- **CRM**: GoHighLevel, 17-stage pipeline, 12 workflows
- **Job delivery**: ServiceM8 (only after deposit paid)
- **Internal alerts**: Slack (10 channels, structured messages, no decisions)
- **Money**: Stripe in (deposit + final), pay.com.au out (sub payments + rewards)
- **Reporting**: Google Sheets now → BigQuery in Phase 5
- **North-star metric**: POAS ≥ 2.5x, $300+ profit floor per job
- **Tone**: trades-business operator (Jordan model), not luxury services brand
- **Compliance gates**: no licence claim, no fake reviews, asbestos/strata holds enforced, sub agreements before any job

---

*This document is the operating bible. When something here is wrong, edit this — don't make exceptions in conversation that drift from the plan.*
