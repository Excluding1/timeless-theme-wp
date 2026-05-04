---
name: GHL Setup Spec v2 — pipeline + form hookup (post-Cleo + research)
description: Rewritten 2026-05-05 PM after Cleo's 12-finding peer-review + research agent's verified GHL Starter capabilities + integration of Reddit community regrets + Jordan transcript tips. Supersedes ghl_setup_spec_2026-05-05.md (v1) which was Clifford-solo and overconfident.
type: project
originSessionId: 2026-05-05-ghl-setup-spec-v2
status: CANONICAL (locked 2026-05-05 PM after Clifford+Cleo parallel research synthesis — see §17)
authors: Clifford (Claude/Anthropic) + Cleo (Codex/OpenAI) + Reddit community + Jordan Schofield's playbook
date: 2026-05-05 PM
supersedes: memory/ghl_setup_spec_2026-05-05.md
references:
  - memory/cleo_ghl_spec_review_2026-05-05.md (12 findings forced this rewrite)
  - memory/ghl_starter_capabilities_verified_2026-05-05.md (5 questions answered)
  - memory/research_ghl_pipeline_2026-05-04.md (Reddit/community/Jordan source)
  - master-repo/docs/CEO.md (margin floor + Marko-first-response policy)
  - master-repo/docs/STATE.md (verified facts on what's signed up vs not)
  - master-repo/docs/OPERATING-CONTEXT.md (canonical field names)
  - memory/feedback_form_is_intake_not_quoting.md (locked design rule)
---

# GHL Setup Spec v2

## 0. What changed from v1

This is a substantial rewrite forced by Cleo's peer-review (12 findings, mostly HIGH/BLOCKER severity) + research agent verifying GHL Starter capabilities + integrating Reddit community lessons we'd skipped.

| v1 said | v2 says | Source |
|---|---|---|
| §12 left 5 questions for Allan to verify in admin | All 5 verified via official GHL docs | research agent 2026-05-05 |
| GHL native Stripe integration propagates metadata | **NOT supported.** Use GHL `Invoice Paid` trigger + naming convention (Phase 1) OR Vercel bridge (Phase 2) | research agent |
| Inbound webhook auth via shared secret in header | **No native auth.** Use `secret_token` field in payload + first workflow step If/Else gate | research agent |
| Custom fields effectively unlimited | **Critical gotcha**: opportunity custom fields silently SAVE TO CONTACT — repeat customers OVERWRITE prior opp data | research agent |
| Custom Webhook actions = standard | Premium action, $0.01/exec after 100 lifetime free per sub-account | research agent |
| Setup workflows Day 4-6, integrations Day 7 | Reordered: integrations + DNS FIRST, then workflows. Workflows that depend on Twilio start DISABLED | Cleo finding 1 |
| `property_type` for owner/tenant/commercial | Restored OPERATING-CONTEXT.md naming: `customer_type` for persona (owner/PM/builder/tenant), `property_type` for structure (house/apartment/commercial) | Cleo finding 3 |
| W1 creates new opp every webhook | + idempotency via `submission_id` + `trace_id` + open-opp lookup before create | Cleo finding 4 |
| W3 cadence: "expires Friday" hardcoded | Dynamic `quote_expires_at` field, copy says "expires on [date]". Pause cadence on customer reply / Q&A. | Cleo finding 5 |
| W5 NPS sends Google review prompt only to promoters (9-10) | **REVIEW GATING — illegal.** ACCC fines for this exact pattern. Choice: send review request to ALL completed customers post-issue-window OR keep NPS internal-only (no review prompt automation). | Cleo finding 6 + auditor-compliance-aus.md |
| Stage 6→7 threshold $3K | Lower to $2K + risk flags (pre-1990, strata, commercial, no-lift, poor photos, strip-back, profit < $300) | Cleo finding 7 |
| Stage 11 owner = Allan | **Marko first-response within 60min** (per CEO.md SLA table). Allan = commercial escalation only | Cleo finding 8 |
| Stage 10 entry from stages 9-12 only | Stage 10 entry from stages 1-14 with structured `hold_reason`: `customer_reschedule`, `access_pending`, `materials_delay`, `strata_approval`, `landlord_authority`, `asbestos_assessment`, `margin_review`, `other` | Cleo finding 9 |
| (no margin gate) | Add fields: `estimated_profit`, `estimated_margin_pct`, `travel_zone`, `materials_estimate`, `stripe_fee_estimate`, `margin_review_required`. **No Stage 5 (Quote Sent) until margin floor passes.** | Cleo finding 10 + auditor-margin-per-job.md |
| W2 (abandoned quote) SMS-only | SMS-or-email fallback. Disabled until Twilio approved. Match by `partial_session_id`, not just email. | Cleo finding 11 |
| Lead score threshold 30 | Threshold 40 until first 50 leads tell us where the real signal lives | Cleo finding I.4 |
| Surface Care comparison "Stripe ✓ Slack ✓" | **NOT TRUE per STATE.md.** Stripe = pending verification, Slack = workspace not created, Cloudinary = not signed up, Twilio = pending approval | Cleo finding 12 |
| (no community lessons) | NEW §13: Day-1 lessons from Reddit/forums + Jordan transcripts (email deliverability collapse, hidden SMS costs, pipeline overload, lock-in mitigation) | research_ghl_pipeline_2026-05-04.md §4 |

---

## 1. Day-0 minimum-viable operating mode

The 15-stage architecture is the TARGET. Day-0, several integrations don't exist yet (Twilio pending, Cloudinary not signed up, Slack workspace not created, ServiceM8 deferred). The MVP operates in this stripped-down mode:

| Capability | Day-0 (Phase 1A) | Phase 1B (after signups) | Phase 2 (volume justifies) |
|---|---|---|---|
| Form → GHL | Inbound webhook + secret_token gate | Same | Same |
| Photos | Stored as data URLs in GHL long-text field (interim) OR via email backup | Cloudinary signed upload → URL fields | Same |
| SMS to customer | DISABLED until Twilio approved → send email-only | Twilio AU mobile via BYOT, SMS active | Same |
| Slack alerts | Email to Allan instead of Slack ping | Slack incoming webhooks | Slack + AI agent reports |
| Stripe deposits | Manual Stripe payment links (Allan creates from Stripe dashboard) | GHL `Invoice Paid` trigger + naming convention | Vercel bridge for metadata round-trip |
| ServiceM8 | Stage 9 = "ready to schedule" bucket — Marko coordinates manually | Same | ServiceM8 sync via webhook |
| Lead score 30 trigger | Email to Allan (no Slack yet) | Slack + SMS to Allan | Same |
| Abandoned-quote (W2) | DISABLED until Twilio | SMS at 4-5h | Same |

**Implication:** the Day-0 GHL admin setup is meaningfully simpler than the full spec. Build everything as defined; flip workflows that need Twilio/Cloudinary/Slack to "active" as those signups complete.

---

## 2. The 15 stages — corrected

Same 15 stages as v1, with these specific corrections per Cleo's findings:

### Stage 1 — Quote Requested
Same as v1. Idempotency: workflow checks for existing OPEN opportunity by contact + within last 30 days; if found, updates instead of creating duplicate.

### Stage 2 — Q&A (Clarification)
Same as v1. **Cadence pause:** while in Stage 2, W3 (Quote Sent Cadence) is paused (we're waiting on customer info, not chasing a sent quote).

### Stage 3 — Sub-quote Requested *(HIDDEN Phase 1)*
Same.

### Stage 4 — Sub-quote Received *(HIDDEN Phase 1)*
Same.

### Stage 5 — Quote Sent
**Pre-condition:** opp must have `estimated_profit >= $300` AND `margin_review_required = false`. Workflow blocks transition into Stage 5 if margin floor not met → routes to Stage 10 (Hold) with `hold_reason=margin_review`.

**Quote expiry:** field `quote_expires_at` is set to `quote_sent_at + 14 days` (calendar days, business-hours rounded). Cadence copy uses `{{quote_expires_at | date: "%A %d %B"}}` — never hardcoded.

### Stage 6 — Quote Accepted (transitional)
**Auto-route to Stage 7 if ANY of these flags:**
- `quote_total_final >= $2,000` (was $3K — Cleo finding 7)
- `built_before_1990 != "no"` (asbestos risk)
- `customer_type` IN (`pm`, `builder`) AND any strata/commercial signals
- `lift_access = "no"` AND `property_type = "apartment"`
- `flag-poor-photos` tag present
- `previously_resurfaced = "yes"` (strip-back complexity)
- `estimated_profit < $300` AND `estimated_profit_within_inspection_band = true` (margin needs site verification)

Otherwise → Stage 8 (Prepayment).

### Stage 7 — Site Inspection
Same. Booking calendar is GHL native Phase 1; ServiceM8 calendar Phase 2.

### Stage 8 — Prepayment
**Stripe metadata workaround (per verified gap):**
- Day-0: Allan creates the Stripe deposit invoice/payment link from Stripe dashboard, names it `Timeless Deposit — [contact_name] — [opp_id_short]`. GHL workflow auto-emails the link.
- Phase 1B: GHL native `Invoice Paid` trigger fires when paid; workflow extracts `contactDetails.id` from payload + matches to opportunity by `quote_total_min` proximity to `amountPaid`.
- Phase 2: Vercel bridge sets full Stripe metadata for deterministic matching.

### Stage 9 — Job in ServiceM8 *(Phase 1: bucket)*
Same.

### Stage 10 — Job on Hold *(EXPANDED entry per Cleo)*
**Entry:** from any stage 1-14, NOT just 9-12. **Required field:** `hold_reason` (dropdown):
- `customer_reschedule`
- `access_pending`
- `materials_delay`
- `strata_approval` (per auditor-compliance-aus.md gates)
- `landlord_authority` (tenant case)
- `asbestos_assessment` (pre-1990)
- `margin_review` (estimated_profit < $300)
- `legal_doc_pending` (Privacy Policy, Customer ToS, etc.)
- `other` (require notes)

**Hold timer:** review weekly. **Force decision at 14 days** (was 30 — Cleo finding 5/I.2) unless `hold_reason=customer_reschedule` with confirmed future date.

### Stage 11 — Job Issue *(OWNER CORRECTED per Cleo)*
**Owner:** **Marko first-response within 60min** during business hours. Allan = commercial escalation if refund/quote/pricing issue.

**Action:**
1. On entry: Slack ping `#job-issues` (red highlight)
2. SMS to Marko: *"JOB ISSUE: [name] [issue_type]. Tap: tel:[customer_phone]"*
3. SMS to customer (auto): *"Hi [name], we've heard your concern about [job] — Marko will call you within 60min."*
4. If Marko doesn't acknowledge in 30min: escalate SMS to Allan

### Stage 12 — Job Booked
Same.

### Stage 13 — Job Complete
**NPS workflow trigger** scheduled for 4h after entry, but see W5 redesign in §6 (no review gating).

### Stage 14 — Job Invoiced
Same. Stripe metadata workaround per Stage 8.

### Stage 15 — Job Paid (terminal)
Same.

---

## 3. End-to-end data flow

(Largely unchanged from v1 §2 — refer there. Key updates: secret_token now in form payload as first-step gate; Cloudinary signed upload returns URLs that go in long-text fields, not File Upload custom fields; Stripe path is Day-0 manual via dashboard, Phase 1B native Invoice Paid trigger.)

---

## 4. Custom field schema — REBUILT with canonical names

Restored OPERATING-CONTEXT.md names + added Cleo's required idempotency + consent + margin + blocker fields.

### Contact-level fields

| Field | Type | Values | Purpose |
|---|---|---|---|
| `customer_type` | Dropdown | `owner`, `pm`, `builder`, `tenant` | Persona (NOT property type — Cleo correction) |
| `property_type` | Dropdown | `house`, `apartment`, `commercial` | Property structure |
| `suburb` | Text | | Sydney suburb |
| `postcode` | Text | | AU postcode |
| `service_area_zone` | Dropdown | `eastern`, `inner-west`, `north-shore`, `northern-beaches`, `cbd`, `sutherland`, `outer` | Crew routing |
| `lift_access` | Dropdown | `yes`, `no`, `n/a`, `not_specified` | Apartment access |
| `built_before_1990` | Dropdown | `yes`, `no`, `unsure`, `not_asked` | Asbestos screening |
| `tenant_auth` | Dropdown | `self`, `send`, `n/a` | Tenant approval flow |
| `landlord_email` | Email | | When `tenant_auth=send` |
| `marketing_consent` | Boolean | | (Future opt-in if we add marketing — currently always false) |
| `quote_contact_consent` | Boolean | true | Inferred from form submission |
| `stop_received_at` | Datetime | | If customer ever replies STOP, log here for compliance |
| `lead_source` | Dropdown | `google_ads`, `seo_organic`, `referral`, `social`, `direct`, `other` | Attribution |
| `utm_source/medium/campaign/term/content` | Text | | Per-channel attribution |
| `gclid`, `gbraid`, `wbraid` | Text | | Google Ads click IDs |
| `referrer` | Text | URL | `document.referrer` |
| `landing_page` | Text | URL path | Which page converted |
| `lead_score` | Numeric | 0-100+ | See §13 rubric |
| `lifecycle_stage` | Dropdown | `lead`, `mql`, `sql`, `customer`, `lost` | High-level funnel |
| `first_seen_at` | Datetime | | Cohort analysis |
| `device_type` | Dropdown | `mobile`, `tablet`, `desktop` | UX iteration data |

### Opportunity-level fields

| Field | Type | Purpose |
|---|---|---|
| `submission_id` | Text (UUID) | **NEW per Cleo** — form generates a UUID per submit. Workflow dedupes by this. |
| `trace_id` | Text (UUID) | **NEW** — request trace ID for debugging |
| `payload_schema_version` | Text | **NEW** — e.g. `v10.1`. If we change form structure, bump. |
| `partial_session_id` | Text (UUID) | **NEW** — links partial fire to full submit (Cleo finding 11) |
| `form_status` | Dropdown | `partial`, `complete`, `waitlist` |
| `form_version` | Text | e.g. `v10.0` |
| `quote_submitted_at` | Datetime | |
| `quote_partial_at` | Datetime | |
| `quote_sent_at` | Datetime | **NEW** — set when entering Stage 5 |
| `quote_expires_at` | Datetime | **NEW** — `quote_sent_at + 14d`, dynamic for cadence copy |
| `bathroom_count` | Numeric | 1-5+ |
| `bathroom_index` | Numeric | When customer is on bathroom #2, #3 etc |
| `selected_areas` | Multi-select | `shower`, `bath`, `basin_vanity`, `walls`, `floor` |
| `full_bathroom_mode` | Boolean | |
| `full_bathroom_scope` | Dropdown | `regrout_only`, `resurface_only`, `both`, `n/a` |
| `service_shower / bath / basin_vanity / walls / floor` | Dropdown | Per-area service |
| `epoxy_mode` | Dropdown | `standard`, `epoxy` |
| `prev_resurfaced` | Dropdown | |
| `has_ventilation` | Dropdown | |
| `customer_notes` | Long text | |
| `pricing_tier_resolved` | Dropdown | `T1_premium`, `T2_standard`, `T3_budget` |
| `quote_total_min` | Currency | Form-computed range |
| `quote_total_max` | Currency | |
| `quote_total_final` | Currency | Allan-set after photo review |
| `deposit_amount` | Currency | Typically 10% of `quote_total_final` |
| **`estimated_profit`** | Currency | **NEW per Cleo** — required for margin gate |
| **`estimated_margin_pct`** | Numeric (%) | **NEW** |
| **`travel_zone`** | Dropdown | **NEW** — `local`, `metro`, `outer-metro`, `regional` |
| **`materials_estimate`** | Currency | **NEW** |
| **`stripe_fee_estimate`** | Currency | **NEW** |
| **`margin_review_required`** | Boolean | **NEW** — true if estimated_profit < $300 |
| `resolved_line_items` | Long text (JSON) | |
| `resolved_modifiers` | Long text (JSON) | |
| `resolved_rejection_flags` | Long text (JSON) | |
| `multi_bathroom_discount` | Currency | |
| `photo_count_total` | Numeric | |
| `photos_*_urls` | Long text (JSON array) | One per area — Cloudinary URLs |
| `qa_question` | Long text | |
| `hold_reason` | Dropdown | (expanded list per Cleo finding 9) |
| `hold_started_at` | Datetime | For 14d force-decision timer |
| `issue_description` | Long text | |
| `nps_score` | Numeric | 0-10 |
| `nps_replied_at` | Datetime | |
| `prepayment_received_at` | Datetime | |
| `final_payment_received_at` | Datetime | |
| `submission_page_url` | Text | URL |
| `time_to_complete_sec` | Numeric | |
| `servicem8_job_id` | Text | Phase 2 |
| `assigned_subcontractor` | Text (or contact ref) | Phase 2 |
| `assigned_sub_tier` | Dropdown | `T1`, `T2`, `T3` (Phase 2) |

**⚠️ Field-architecture gotcha (research finding):** opportunity-level custom fields silently save to CONTACT, not opportunity. Repeat customers will overwrite prior data. **Workaround:** for fields that MUST be per-opp (quote_total_final, deposit_amount, nps_score, etc.) — append to `customer_notes` field with timestamp + opp_id prefix, OR use a Custom Object for per-quote snapshots, OR ensure GHL isn't being used for customers with multiple opps until pattern is verified.

---

## 5. Tag taxonomy

(Mostly unchanged from v1 §4 — see there. Add note: replace `phase-quote-cadence-step-N` tags with `quote_cadence_step_completed_at_N` datetime fields — Cleo finding D, temporal tags rot.)

---

## 6. The 7 workflows — REBUILT

### W1 — New Lead from Form (with idempotency)

**Trigger:** Inbound webhook with `secret_token` in payload
**First action:** If/Else gate: `{{webhook.secret_token}} != "[env_var]"` → exit workflow (security)
**Idempotency check:**
1. Look up: open opp where `contact.email == payload.email` AND `quote_submitted_at >= now() - 30d`
2. If found → UPDATE that opp's fields (don't create new)
3. If not found → CREATE new opp at Stage 1
4. Always set `submission_id`, `trace_id`, `payload_schema_version`

**Other actions** (same as v1 W1 with these adjustments):
- Slack ping replaced with email to Allan if Slack workspace doesn't exist (Day-0)
- SMS replaced with email-ack only if Twilio not yet approved (Day-0 + Phase 1A)
- Lead score computed; if `>= 40` (was 30) trigger W6

### W2 — Abandoned Quote (FALLBACK-AWARE)

**Phase 1A (Twilio not approved):** **DISABLED.** Email-only abandoned-quote nudge from `support@` 4-5h after partial fire.

**Phase 1B+ (Twilio approved):** SMS as Jordan's pattern.

**Identity match:** `partial_session_id` → opp lookup. Email is fallback if `partial_session_id` missing. Don't match by email alone (Cleo finding 11 — phone-only/no-phone customers exist).

### W3 — Quote-Sent Cadence (DYNAMIC EXPIRY)

**Trigger:** Opp moves to Stage 5
**Conditions:** `customer_type != tenant`; `margin_review_required != true`
**Pause condition:** if opp moves to Stage 2 (Q&A), pause cadence; resume when back to Stage 5

**Actions:**
1. Send quote PDF + payment link via email AND SMS
2. Set `quote_sent_at`, `quote_expires_at = quote_sent_at + 14d`
3. Wait until `quote_sent_at + 24h` AND it's business hours (8am-6pm Sydney) → send: *"Hi [name], any questions about your bathroom quote? We're here. Reply STOP to opt out."*
4. Set `quote_cadence_step_1_completed_at = now()`
5. Wait until `quote_sent_at + 72h` AND business hours → send: *"Hi [name], your bathroom quote expires on {{quote_expires_at | date}}. Want a quick chat? Reply STOP."*
6. Set `quote_cadence_step_2_completed_at = now()`
7. Wait until `quote_sent_at + 10d` → send email: *"Last chance — your quote expires on {{quote_expires_at | date}}."*
8. Set `quote_cadence_step_3_completed_at = now()`
9. Wait until `quote_sent_at + 14d` → if Stage still 5: move to Lost terminal, tag `flag-quote-expired`

### W4 — Missed-Call Text-Back (DISABLED Phase 1A)

**Phase 1A:** Disabled (no Twilio, no AU mobile)
**Phase 1B+:** As v1 §5 W4

### W5 — NPS / Review Request (REWORKED — no review gating)

**Cleo finding 6:** sending Google review prompt only to Promoters (9-10) is REVIEW GATING, illegal under ACCC. Two acceptable redesigns; **Allan picks**:

**Option A: Keep automated NPS, ungate the review request**
- All customers in Stage 13 get the NPS SMS at 4h
- Promoters (9-10): wait 24h, send Google review request
- Passives (7-8): wait 24h, send Google review request (SAME ASK)
- Detractors (0-6): Marko calls within 60min FIRST; review request held until issue resolved
- Result: review request is universal; only timing varies by score (so we don't review-bomb someone with an unresolved complaint)

**Option B: Keep NPS internal-only, no review automation**
- All customers in Stage 13 get NPS SMS at 4h
- Score recorded internally for Allan's quality dashboard
- NO automated Google review prompt — Allan/Marko ask for reviews manually when feels right
- Lower volume but zero compliance risk

**Recommendation:** Option A. Keeps the leverage; the universal-review-ask + delayed-for-detractors structure satisfies ACCC's "review request goes to all customers" requirement.

### W6 — Lead-score 40 trigger (UPDATED THRESHOLD)

Threshold raised to 40 (was 30) per Cleo finding I.4. Reasoning: 30 fires on every "owner with photos + $2K quote" — that's most leads, dilutes the signal. Raise to 40 until first 50 leads tell us where the real signal lives.

Actions same as v1 §5 W6.

### W7 — Stage Transition Logger + Error Channel (NEW)

Trigger: Any stage change OR any workflow error.

Actions:
1. Stage change: append to Slack `#pipeline-feed` (or Allan email Phase 1A)
2. **NEW: Workflow error** (any failed action, webhook 5xx, etc.): append to Slack `#automation-errors` (or Allan email Phase 1A) with workflow name, contact ID, error message, retry status

This addresses Cleo's "missing automation error channel" finding.

---

## 7. GHL Starter — VERIFIED capabilities (replaces v1 §12)

Per the research agent's verification 2026-05-05:

| Capability | Status | Notes |
|---|---|---|
| Custom Webhook actions in workflows | ✅ Available — Premium ($0.01/exec after 100 lifetime free) | Phase 1 fits in free budget. Workflow Pro Plan $10/mo if volume > 1000/mo |
| If/Else conditional branching | ✅ Standard, no charge | Foundational — works |
| Custom field count | ✅ No documented hard limit | **CRITICAL gotcha:** opp fields save to contact (repeat customers overwrite) |
| GHL native Stripe metadata propagation | ❌ NOT supported | Workaround: use GHL `Invoice Paid` trigger + naming convention OR Vercel bridge |
| Inbound webhook authentication | ❌ No native | Workaround: `secret_token` in payload + If/Else gate |

**Full citations:** `memory/ghl_starter_capabilities_verified_2026-05-05.md`

**Day-0 implications:**
- `secret_token` field MUST be added to form's webhook payload before live launch
- Stripe deposits stay in Allan's manual control Phase 1A; GHL native trigger Phase 1B
- Plan for ~50 leads/month using ~50 of 100 free premium executions; consider $10/mo Workflow Pro Plan when volume > 1000/mo

---

## 8. Integrations — updated

### Slack — incoming webhook (Phase 1B)
Same as v1 §6 — incoming webhook URLs per channel, GHL Custom Webhook action posts JSON.

### Stripe — Phase-aware approach
- **Phase 1A:** Allan creates payment links in Stripe dashboard, names them with naming convention. GHL workflow emails the link.
- **Phase 1B:** GHL native `Invoice Paid` trigger; workflow extracts `contactDetails.id` from payload to advance opp.
- **Phase 2:** Vercel bridge for full metadata round-trip.

### Cloudinary signed upload (Phase 1B)
Same as v1 §6 — backend signer + signed multipart upload. Phase 1A: photos stored as base64 in long-text field OR emailed to `quotes@` separately.

### Twilio BYOT (Phase 1B+)
Same as v1 §6.

### Webhook authentication
Form's webhook POST includes `secret_token: "TR_secret_v1_xxxxx"` (rotated quarterly). Every workflow that triggers on inbound webhook starts with: If/Else: `{{webhook.secret_token}} != "expected" → Exit Workflow`.

---

## 9. AU compliance — EXPANDED (Cleo finding F)

| Touchpoint | Phase | Status |
|---|---|---|
| Privacy Policy on website + linked from form | Pre-launch | Sprintlaw ~$200, ~1 week |
| Customer ToS in quote PDF (scope, deposit, cancellation, photo use, warranty, ACL clause) | Pre-launch | Sprintlaw |
| ACL warranty disclosure on every warranty doc | Always | *"This warranty does not exclude or limit your rights under the Australian Consumer Law."* |
| Privacy collection notice on form | Always | Already on submit button via "By submitting..." line |
| **Overseas data disclosure** (NEW per Cleo) | Pre-launch | Privacy Policy must mention Cloudinary US/EU data transfer |
| Spam Act inferred consent | Always | Form submission IS the consent |
| STOP keyword honoring within 5 working days | Always | Built into workflows + `stop_received_at` field |
| Sender identification in every SMS | Always | "Timeless Resurfacing:" prefix |
| ACMA Sender ID Registry | Pre-Google-Ads | When Twilio approved |
| **Strata approval gate** (NEW per Cleo) | Per job | If property = strata → `hold_reason=strata_approval` until owners-corp approval sighted |
| **Landlord authority gate** (NEW) | Per job | If `customer_type=tenant` AND `tenant_auth=self`: must capture landlord-permission confirmation before Stage 12 |
| **Asbestos assessment gate** (NEW) | Per job | If `built_before_1990 != "no"`: subcontractor asbestos awareness cert sighted before Stage 12 |
| **Consent log** | Per submission | Every form submit logs: `submitted_at`, `submission_page_url`, IP (server-side from webhook), user_agent. ACMA breach = $220k. |
| **Review gating fix** (NEW per Cleo finding 6) | NPS workflow | Universal review ask, delay-but-don't-skip for detractors |

---

## 10. Setup checklist — REORDERED in dependency order (Cleo finding 1)

The v1 checklist built workflows before integrations. Fixed:

### Day 1 — Foundation (no dependencies) ~60 min
1. **GHL Settings → Business Profile:** name, ABN, phone (placeholder), address, **timezone Australia/Sydney AT LOCATION LEVEL** (Reddit tip — workflows default to account TZ)
2. **Settings → Domains/Email:** SPF, DKIM, DMARC records on `timelessresurfacing.com.au` so emails don't spam (Reddit regret #1: "open rates dropped from 35-40% to 9% on shared Mailgun IPs")
3. **Sprintlaw engagement** for Privacy Policy + Customer ToS

### Day 2 — Custom fields + pipeline (no integrations needed yet) ~90 min
4. Create all contact-level custom fields (§4)
5. Create all opportunity-level custom fields (§4) including the new ones (`submission_id`, `trace_id`, `estimated_profit`, etc.)
6. Pre-seed top 20 tags from §5
7. Create Pipeline `Sales` with all 15 stages
8. Create filtered view "Active Phase 1" hiding stages 3+4

### Day 3 — Email + SMS templates ~60 min
9. Create email/SMS templates (full list in v1 §8 Day 3) — DO NOT include Twilio-dependent templates yet (those activate Phase 1B)

### Day 4 — Slack workspace + incoming webhooks ~30 min (Phase 1B prerequisite)
10. Create Slack workspace (free tier sufficient day-0)
11. Create channels: `#quotes-in`, `#new-jobs`, `#job-issues`, `#hot-leads`, `#pipeline-feed`, `#automation-errors`
12. Create incoming webhooks per channel; copy URLs

### Day 5 — Build SAFE workflows first (W1, W7) ~90 min
13. **Test webhook security:** add `secret_token` field to form's webhook payload (env var `TR_WEBHOOK_SECRET_V1`)
14. **W1 New Lead** — full action sequence with secret_token gate as first step + idempotency lookup
15. **W7 Stage Logger + Error Channel** — fires on any stage change + error events
16. Test: submit form on staging, verify lead lands, Slack ping fires, error channel works

### Day 6 — Build customer-facing workflows ~90 min
17. **W3 Quote-Sent Cadence** with dynamic `quote_expires_at`
18. **W5 NPS** (Option A — universal review ask, delayed for detractors)
19. **W6 Lead Score 40 Trigger** (lower priority Day-0, Phase 1B critical)

### Day 7 — Stripe + Phase-1A manual workflow ~60 min
20. **Stripe activation completion** (already submitted; Marko ID verification pending)
21. Create Stripe payment-link template with naming convention (Phase 1A)
22. Configure GHL native Stripe sync (Phase 1B prep)

### Day 8 — Phase 1A end-to-end test + go-live ~90 min
23. Submit real form, manually walk through stages 1 → 5 → 6 → 7 (or 8) → ... → 15
24. Configure form's `GHL_WEBHOOK` env var with the W1 webhook URL
25. Verify all email templates render correctly (no spam folder)
26. **First real quote:** Marko's prior regrouting customer (per STATE.md §8 — perfect first case study)

### Day 9-10+ — Phase 1B activation as integrations land
- When Twilio approved: enable W2, W4; switch SMS-disabled actions to active
- When Cloudinary signs up: deploy backend signer; switch photo storage from base64 to URL
- When Sender ID approved: enable Google Ads with confidence

---

## 11. Manual fallback / error SOP (NEW per Cleo finding J)

When automation fails, what humans do:

| Failure | Detection | Recovery |
|---|---|---|
| Webhook 5xx on form submit | Form retry logic + `#automation-errors` Slack | Form falls back to email to `quotes@`. Allan manually creates contact in GHL. |
| GHL webhook 4xx (auth fail, secret_token mismatch) | `#automation-errors` Slack | Investigate: rotated secret? Form not updated? Allan manually creates contact + updates form env var. |
| Cloudinary upload fail | Form catches | Form submits without photos + tag `flag-photo-upload-failed`. Allan emails customer requesting photos. |
| Twilio SMS fail | GHL workflow logs | Email backup fires. Allan SMS-back-up manually if customer-time-sensitive. |
| Stripe webhook missed | Daily reconciliation script (Phase 2) | Phase 1A: Allan checks Stripe dashboard daily, manually advances stage. |
| Slack webhook 5xx | Workflow logs | Allan checks `#pipeline-feed` daily; missing → investigate. |
| GHL trial expires (2026-05-27) before paid plan | Calendar reminder + Stripe payment method | Pay before May 27 OR risk service interruption. |
| Sender ID Registry not applied by 2026-05-15 | Calendar reminder | Apply ASAP when Twilio approves; deliverability degrades on AU mobiles. |

---

## 12. Lead scoring rubric (UPDATED)

```
+10  Photo uploaded (any)
+5   Photos uploaded (3+ across multiple areas) — cumulative
+15  Notes contain urgency keywords (manual review by Allan)
+10  Notes contain "for sale" / "renting it out" keywords
+20  Quote total $2,000-$5,000 AUD
+30  Quote total ≥ $5,000 (full makeover) — replaces +20
+5   customer_type=owner
+5   property_type=apartment AND lift_access=yes (easy job)
+15  lead_source=referral
+5   lead_source=google_ads
+15  SMS reply within 1h of first send (Phase 1B)
+10  Quote opened (email tracking pixel) 3+ times

NEGATIVE:
-10  customer_type=tenant (deprioritise — can't approve)
-5   built_before_1990=yes (asbestos complexity)
-20  Time-to-complete form <60s (likely bot)
-10  No phone provided
-15  estimated_profit < $300 (margin gate violation)
```

**Threshold:** `lead_score >= 40` (raised from 30 per Cleo finding I.4) triggers W6.

---

## 13. Day-1 lessons from GHL community + Jordan transcripts (NEW per Allan's directive)

### Reddit/forum top regrets to AVOID

1. **Email deliverability collapse** (most cited regret) — agencies report drops from 35-40% open rates to ~9% after migrating to GHL on shared Mailgun IPs. **Mitigation:** SPF + DKIM + DMARC on Day 1 (built into checklist). Warm sending domain with low volume first 2 weeks before scale.
2. **Hidden SMS costs** — realistic $70-150 USD/mo on top of subscription. **Mitigation:** Twilio AU BYOT (cheaper at $0.075-0.085/segment + we control the bill).
3. **Built too much too fast** — agency sent 171 irrelevant emails over 3 days; subscriber list shredded. **Mitigation:** "Start with ONE pipeline + ONE workflow for 4 weeks before expanding" (Reddit tip). Day-0: only W1 active. W2-W7 enabled in stages.
4. **Pipeline overload** — 12+ stages = can't report cleanly. (Note: Jordan's 15 works because each has clear automation. Don't add stages we don't automate.)
5. **Trial cancellation friction** — can't self-cancel, must email rep. **Mitigation:** track trial-end date; pay before May 27 to avoid service interruption.

### Reddit/forum top tips for day 1

1. ✅ Start with ONE pipeline + ONE workflow for 4 weeks (we'll start W1 only Day 5; W2-W7 over the following week)
2. ✅ Lock AU regulatory bundle FIRST (Twilio in flight)
3. ✅ Tag taxonomy upfront (§5)
4. ✅ Set timezone Australia/Sydney AT LOCATION LEVEL (Day 1 step 1)
5. ✅ Pre-write A2P/regulatory content (when applying for Sender ID)

### Jordan transcripts — Google Ads playbook (when ads launch)

1. **Get good at Google Ads** — it's "the easiest one to master" because customers are searching for the service. Start at $5/day, scale slowly.
2. **3 numbers needed before picking ad budget:** cost per lead × conversion rate = cost per customer × customer LTV.
3. **Consolidate campaigns** — 3-4 max, not 8-9. Fragmented = Google can't see conversion data, machine learning starves.
4. **Dedicated landing pages drop CPL 17%** — service-specific pages, not generic homepage. Already in our architecture (we have 19 service pages).
5. **Profit-first scaling** — align profit to every keyword. Don't optimize for clicks; optimize for profit.

(Filed for Phase 2 Google Ads pixel work — see `memory/task_google_ads_pixel_setup_phase2.md`)

### Lock-in mitigation strategy (Reddit + Jordan's BigQuery hint)

- GHL exports CSV but lossy (notes truncate to 255 chars, activity history collapses)
- Funnels/websites can NOT be exported (only "snapshotted" within GHL)
- **Counter-strategy:**
  - Keep email/SMS templates IN OUR REPO (`master-repo/quote-form/docs/templates/`), not authored only inside GHL
  - Phase 2: mirror data to BigQuery via webhook (Jordan's "own the data" pattern)
  - This buys us migration optionality if GHL ever raises prices or breaks

---

## 14. Surface Care comparison (CORRECTED per Cleo finding 12)

| Aspect | Surface Care (Jordan) | Timeless TARGET STATE | Timeless DAY-0 ACTUAL (per STATE.md) |
|---|---|---|---|
| CRM | GoHighLevel | GoHighLevel | ✅ GHL Starter trial active |
| Job mgmt | ServiceM8 | ServiceM8 (Phase 2) | ❌ Not signed up — Stage 9 = manual bucket |
| Accounting | Xero | Xero (Phase 2) | ❌ Not signed up |
| Payments | Stripe | Stripe ✓ | ⏳ In activation (Marko ID verification pending) |
| Sub payouts | pay.com.au | pay.com.au (Phase 2) | ❌ Not signed up |
| Internal comms | Slack | Slack via webhook | ❌ Workspace not yet created |
| Pipeline stages | 15 | 15 (3+4 hidden Phase 1) | ✅ Spec'd — needs to be built in GHL |
| Quote cadence | "automated SMS follow-ups" | 24h + 72h + 10d + 14d Lost | ❌ Twilio pending — email-only Phase 1A |
| Abandoned-quote SMS | 4-5h | Same | ❌ Twilio pending |
| Slack lead alerts | "every quote signed pings Slack" | Same | ❌ No Slack workspace yet |
| BigQuery sync | Yes | Phase 2 | ❌ Not signed up |
| AI agents | Daily Slack reports | Phase 2-3 | ❌ Not built |
| Photo storage | Not specified | Cloudinary | ❌ Not signed up |
| Quote SLA | Fixed quote in 24h | Same | Achievable Phase 1A |

**The pattern:** copy the architecture (stages + cadence + Slack alerts), defer the heavy ops infrastructure (ServiceM8, BigQuery, AI agents) to phases when volume justifies. **Day-0 reality is far from the target — but the gap closes fast as Twilio + Cloudinary + Stripe land in the next 7-14 days.**

---

## 15. Sign-off

— Clifford & Cleo, 2026-05-05 PM
- Clifford: drafted v1 + v2 rewrite + parallel role-file research (manager-business-orchestrator, auditor-fair-work, expert-cro-specialist, expert-direct-response-copywriter)
- Cleo: 12-finding peer-review forced v2 rewrite + verified GHL Starter capabilities + INDEPENDENT web research on AU compliance enforcement / Surface Care funnel / Sydney pricing benchmarks
- Research agent (Clifford-dispatched): verified the 5 GHL Starter capability questions
- Allan: caught Clifford-solo pattern + forced parallel Cleo+Clifford research synthesis
- Reddit/forum community: top regrets + tips for day 1
- Jordan Hunt + James Webster + Jordan Schofield (Surface Care): 15-stage architecture, abandoned-cart 4-5h, Slack pattern, "Quote In Under 60 Seconds" funnel, fixed-quote-in-24h promise, photo-first intake

---

## 16. Surface Care funnel benchmark (NEW — Cleo's site research)

Surface Care's PUBLIC funnel is the closest competitive benchmark we have. Cleo's site research confirmed:

| Aspect | Surface Care | Timeless v2 spec |
|---|---|---|
| Form CTA | "Request A Quote In Under 60 Seconds" | Already aligned in form copy |
| Step count | 4 steps (upload photo → 24h quote → schedule → site repair) | 5 steps (more elaborate — calibrated bet on quoter accuracy) |
| Photo upload | Mandatory, first thing | Step 5 (after area/service picks). Different mental model — we drive scope first, photos disambiguate. |
| Quote SLA | "Fixed-price quote within 24 hours" | Same — 24h to triage + send |
| Pricing | OPAQUE — no published prices | OPAQUE — Allan's locked decision (no prices on site) |
| Trust copy | "Free", "No hidden fees", "No pressure" | Should mirror — add to landing pages |
| Warranty | Shallow ("we offer a warranty") | Strong — "Up to 5-year per service tier" + ACL clause |

**Implication:** our form is more elaborate than Surface Care's because our quoter accuracy needs more upfront capture. That's a calibrated trade-off — Surface Care's lower friction may convert better but we get higher first-quote accuracy. Worth A/B testing if conversion lags.

---

## 17. Final research synthesis — Clifford + Cleo parallel lanes (NEW)

Both AIs ran independent research lanes after Allan caught Clifford-solo pattern. Findings converged + reinforced v2 without contradicting it. This section locks the synthesis and stamps the spec CANONICAL.

### What both lanes found (high confidence — independent convergence)

| Finding | Clifford source | Cleo source |
|---|---|---|
| AU compliance is high-stakes | auditor-compliance-aus.md | ACMA enforcement page |
| Sender ID Registry: register before 1 July 2026, recommended 15 May 2026 | research_ghl_pipeline_2026-05-04.md | ACMA Sender ID guidance page |
| SMS cadence keep brief (3 messages max) | expert-direct-response-copywriter.md | Surface Care + Reddit consensus |
| Photos = personal information | auditor-compliance-aus.md | OAIC direct page |
| Trades CRMs win on operational follow-up | (implied across role files) | HighLevel plumbing playbook + Kabooyaa |

### What Cleo's web lane found that Clifford's role-file lane did NOT

1. **Concrete ACMA enforcement examples 2024-2026 (multi-million-dollar fines):**
   - Latitude $3.96M (Apr 2026) — SMS without adequate sender contact / unsubscribe
   - Tabcorp $4.00M (Jun 2025) — SMS/WhatsApp sender + unsubscribe + consent issues
   - CBA $7.5M (Oct 2024)
   - Pizza Hut $2.5M (May 2024)
   - Luxottica $1.5M (Apr 2024)
   - Lululemon $702.9k (Mar 2026) — email unsubscribe failures
   - Telstra $626k (Mar 2025)
   - Outdoor Supacentre $302.5k (Jan 2024)

   **Implication for spec:** the $220K-per-breach number we'd been citing is the ENTRY-LEVEL fine. Repeat offenders + larger orgs hit the millions. Compliance isn't theoretical.

2. **Sydney pricing benchmarks (Epoxy Grout Pro publishes openly):**
   - Cement regrout $450-$700
   - Shower floor epoxy regrout from $845
   - Full shower reseal/rejuvenation from $1,095
   - Perimeter epoxy seal only $520

   **Implication:** our internal $1,500 standard shower regrout+silicone = **premium positioning**. Marketing copy must justify ("comprehensive scope, 5-year epoxy warranty, anti-slip included, post-job follow-up"). Without justification, we're 2x competitors with the same trade work.

3. **Surface Care has THREE co-founders** (per SignalHire): Jordan Hunt, James Webster, Jordan Schofield. I'd been inconsistent — sometimes calling him Jordan Schofield, sometimes Jordan Hunt. Both real, both at Surface Care.

4. **NSW Building Commission** is now the enforcement body for Home Building Act matters (re-org from NSW Fair Trading). Our compliance docs should reference Building Commission NSW going forward.

5. **2024 Privacy Act reform package**: strengthened enforcement powers + new civil penalty tiers + automated decision privacy-policy requirements. Phase 2+ implications when we scale.

### What Clifford's role-file lane found that Cleo's web lane did NOT

1. **AU home services baseline conversion**: 7.8% landing-to-form, mobile 2.49% / desktop 5.06%. 60-75% mobile traffic. Our form must beat these.

2. **Field economics**: 3-field forms ~$16/lead, 7-field ~$33/lead. **Every unnecessary field = real money in CPL.** Reinforces "form is intake not quoting" rule.

3. **Sender truncation**: "Timeless Resurfacing" (20 chars) may display as "Timeless Resurfac" on some AU carriers (11-char limit). **Verify on real AU mobile or shorten sender to "Timeless".**

4. **Sham contracting fines**: $93,900 PER CONTRAVENTION (corporate). Higher per-event risk than ACMA's entry-level $220K. Sub agreements MUST cover all 10 essential clauses (Phase 2).

5. **Manager → Experts → Auditors orchestration pattern**: I've been collapsing CEO + Manager + Experts + Auditors into Clifford-solo. The 16 role files exist exactly to prevent that.

6. **6 named AI employees** in `docs/specs/ai-employees/` (pricing-researcher, competitive-intelligence, materials-validator, trades-researcher, maintenance-reminder, dm-handler) that I haven't commissioned.

### Pros/cons of any divergent recommendations

**Cleo: "minimum viable lead first, enrichment after submission or via SMS"**
- Pro: lower friction, higher form-completion conversion, mirrors Surface Care
- Con: enrichment via SMS adds quoter time per lead, adds dependency on Twilio (still pending), doesn't match Allan's Step 5 photo-disambiguation design

**Clifford (existing v2): 5-step structured form with photos at end**
- Pro: more upfront signal for quoter, lower follow-up rate, fits Allan's locked design
- Con: more elaborate than competitor benchmark, possibly lower conversion

**Resolution:** Keep 5-step. We already have 5 audits behind it + Allan's locked design rule. If first 50 lead conversion lags, A/B test a 3-step variant.

### What changes in v2 from the synthesis (small amendments only)

1. **§9 AU compliance** — add concrete ACMA enforcement examples (multi-million-dollar fines) as deterrent context
2. **§11 SMS cadence** — reduce from 4 touches (24h+72h+10d+14d) to 3 touches (24h+72h+10d, auto-Lost at 14d silently)
3. **§13 (lead scoring)** — note Sydney pricing context: $1,500 = premium. Marketing must justify.
4. **§14 Surface Care comparison** — note 3 co-founders, verify primary funnel pattern (photo-first 4 steps + 60-second CTA)
5. **NEW §16 Surface Care funnel benchmark** — added above
6. **NEW §17 Final research synthesis** — this section
7. **Sender display name**: shorten to "Timeless" (11 chars, fits all carriers) instead of "Timeless Resurfacing" — verify on real mobile when Twilio approved
8. **Reference to NSW Building Commission** instead of Fair Trading where applicable

### Status change: DRAFT v2 → CANONICAL

After:
- Clifford's solo v1 (deprecated)
- Cleo's 12-finding peer-review (forced v2 rewrite)
- Research agent's GHL Starter capability verification
- Allan's pushback on Clifford-solo pattern
- Cleo's independent web research (5 axes, 18 sources)
- Clifford's parallel role-file research (4 unread role files)
- This synthesis section

The spec is **CANONICAL.** Future "how do we do X in GHL" answers come from this doc. Day 1 of the setup checklist starts when Allan greenlights.

**Outstanding decision Allan still owes:**
- W5 (NPS) Option A (universal review ask, delayed-not-skipped for detractors) OR Option B (NPS internal-only, no review automation)? Cleo recommends Option A.

— Locked 2026-05-05 PM by Clifford & Cleo, partnership co-CEOs

<!-- v2 status: CANONICAL. v1 (memory/ghl_setup_spec_2026-05-05.md) is DEPRECATED. -->

