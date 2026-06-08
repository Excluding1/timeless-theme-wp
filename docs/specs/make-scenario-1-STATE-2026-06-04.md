# Make.com Scenario 1 "Main" — BUILD STATE (2026-06-04)

**The handoff doc — read this to know exactly where the Make build is.**
Read with: `make-scenario-1-main-build.md` (full v2 spec) + `jordan-make-reference.md` (the Surface Care blueprint we replicate). This STATE doc **supersedes** the build sheet where they differ (esp. the find-or-create §B2 — corrected below).

> ✅ **STRIP-CONTACT CHANGE — DONE + VERIFIED LIVE 2026-06-07 (supersedes the v1 Job Contact plan).** *(Built + verified on the SM8 API this session: jobs show name + address only.)* Per `decision-sm8-keep-vs-build-2026-06-05.md` (LOCKED 2026-06-05): subs get **NAME + ADDRESS only**, NEVER the customer's phone/email (anti-poaching — the customer relationship is our #1 asset). **The `Add Job Contact` module below is to be DROPPED, and customer phone/email must never land on the SM8 job** (job description = name + address only; strip `phone`/`email` out of `job_description`). **Customer comms (on-the-way SMS, reminders) move to GHL/Twilio — NOT SM8's Job Contact.** This is a deliberate reversal: everything below describing a "structured Job Contact" + "customer auto-SMS off the Job Contact" is the **earlier v1 plan, now SUPERSEDED**. History retained below for traceability; the no-contact rule wins. Access-issue gap (sub on-site, no answer): Marko relays at low volume / masked proxy number at scale.

---

## ✅ v1 BUILT + WORKING — verified live 2026-06-04
Make scenario **"1st GHL Pipeline 'Job in Servicem8' → Add Client & Job to SM8"** (EU region). Chain, left→right:

**`GHL Trigger - SM8 STAGE` → `Map Category` → `Create SM8 Job` → ~~`Add Job Contact`~~ (DROP — strip-contact change, see banner above)**

> The chain below is the **as-built v1** (verified live). The **target chain post-strip-contact** ends at `Create SM8 Job` (no `Add Job Contact`), with `job_description` carrying **name + address only** — no phone/email. See `decision-sm8-keep-vs-build-2026-06-05.md`.

| Module (named) | Type | What it does | Status |
|---|---|---|---|
| **GHL Trigger - SM8 STAGE** | Webhooks · Custom webhook | Fires when a GHL opp enters stage 11 "Job in ServiceM8". URL `https://hook.eu1.make.com/y8keuzdsaoswgfrbk8mbn63g2omic3lm`. Receives ~55 fields incl. `Job Category`, `full_name`, `full_address`, `phone`, `email`. | ✅ |
| **Map Category** | Tools · Set variable | `category_uuid = {{switch(lower(trim(Job Category)); …6 UUIDs…; default Combo)}}` | ✅ dynamic — Resurfacing **and** Regrouting tested live |
| **Create SM8 Job** | HTTP POST `api_1.0/job.json` (X-API-Key) | body `{status:"Work Order", category_uuid:{{Map Category}}, queue_uuid:ACT, job_address:{{full_address}}, job_description:{{full_name | phone | email}}}` · Parse response = Yes · new job UUID in `x-record-uuid` header | ✅ (⚠️ **strip phone/email** → `job_description` = `{{full_name}}` + address only per no-contact rule; see banner) |
| ~~**Add Job Contact**~~ | ~~HTTP POST `api_1.0/jobcontact.json` (X-API-Key)~~ | ~~`{job_uuid:…, first, last, email, mobile, type:"JOB"}` → structured tap-to-call contact~~ | ❌ **DROP** — superseded by no-contact rule (`decision-sm8-keep-vs-build-2026-06-05.md`); customer comms move to GHL/Twilio |

**Proven (as-built v1):** real SM8 jobs created (Job #8 etc.) — correct **dynamic category**, **ACT queue**, **address**, ~~**structured Job Contact**~~, no 403, *"by Make com Integration (API Key)."* *(The Job Contact part is being removed by the strip-contact change — customer contact must not live on the sub-facing job.)*

---

## Connections / keys / IDs
- **SM8 auth:** `X-API-Key` header. Key (`smk-…`) in `.secrets/servicem8.key` (gitignored). FULL account access.
- **SM8 category + queue UUIDs:** `cockpit/data/config/servicem8.md` (6 categories + ACT queue `7bbcd459-ccb6-46e0-abe3-243e55bbe33b`).
- **GHL:** workflow **"SM8 — Create Job on Stage 11"** is **DRAFT** (publish before going live). Trigger = Pipeline-Stage-Changed · Pipeline **"Sales"** `YTgWxSeFt2oyd3zBe2Xr` · Stage **"Job in ServiceM8"** `f34407a6-0c54-47e6-b79f-4cb3ecdbe31d`.
- **GHL API:** host is **`services.leadconnectorHQ.com`** (NOT leadconnector.com — that was a hostname bug). Read-only PIT in `.secrets/ghl-pit.key`; locationId **`Uz8fQwDiUxAHVtlruspD`**. (This env can reach it via curl; verified GHL fields/pipeline/workflows.)
- **Job Category** = a GHL **Contact** dropdown (6 values: Resurfacing/Regrouting/Silicone & Sealing/Repairs/Specialist/Combo). Sends the **label** (e.g. "Resurfacing"); the switch handles label + value forms via `lower(trim())`.

---

## Key learnings (WHY it's built this way)
1. **Native SM8 Make module REJECTED.** It 403'd (`insufficient_scope` — the OAuth "Integromat" addon grants only 3 fixed scopes) **and** has no Category/Queue fields. → we use **all-HTTP with the X-API-Key** (full access). Both experts + Cleo confirmed; re-auth won't help (fixed scopes) and native can't do category/queue regardless.
2. **SM8 enforces UNIQUE client names** → "always create a client" fails with `400 "Name must be unique"`. → client must be **find-or-create** (deferred — see below).
3. **SM8 phone/email live on `companycontact.json`, NOT `company.json`** (company = `name` + address + badges only; `name` is the only required field). So find-or-create must search **`companycontact`** then walk up to `company_uuid`. (Make-expert correction 2026-06-04 — the old build-sheet B2 that filtered company.json by mobile/email was a bug.)
4. **Hardcoded category/queue UUIDs** (vs Jordan's dynamic "get list of categories/queues" lookups) — deliberate: we have the UUIDs, fewer ops.

---

## 🔜 DEFERRED — next-session work
**PANEL VERDICT 2026-06-04 (Make-engineer + field-ops + Cleo, UNANIMOUS): build SAFETY *before* find-or-create.** A double webhook-fire with no dedup creates duplicate REAL SM8 jobs on job #1 (operational integrity); a missing client link only bites at invoice time (Marko attaches manually for the first ~5 jobs). Operative order is now **SAFETY → find-or-create**.

**① SAFETY — PANEL'S NEXT BUILD (before ANY real customer + before find-or-create):** shared-secret filter on the webhook · **atomic dedup on `opp_id`** (Make Data store, unique key — write/check BEFORE Create SM8 Job so two simultaneous fires can't both pass) · error → Slack `#automation-errors`. + **Sleep 3s** before dependent reads (eventual-consistency; Jordan does it). **Keep the GHL workflow DRAFT until this is in.** → **LEAN design LOCKED (Cleo-verified): `Sequential processing = ON` = the atomicity guarantee; Data store (key=opp_id) for idempotency; Reserve = Add-overwrite-OFF (duplicate→stop); 3-route reclaim DEFERRED. Full click-by-click + 6 smoke-tests → `make-scenario-1-safety-build.md`. Shared secret generated → `.secrets/make-webhook-secret.key`.**
**①.5 DATA CAPTURE (job log) — NEW, build now** (Allan-raised 2026-06-05; Cleo + data-eng + Clifford converge): one **`Google Sheets → Add a Row`** at END of chain (after `Create SM8 Job` — the strip-contact change drops `Add Job Contact`, so the Sheets row is now the last module), Resume-on-error → private `timeless_job_log`. Per-job history for future BigQuery + AI household/repeat-pricing agent. **Capture = one-way door (unrecoverable if skipped); warehouse = reversible (Sheet→BQ external table anytime).** Jordan transcripts confirm household quote-integrity agent + BigQuery (all-transcripts-2026-04-30.md:161-163,321). Full spec → `make-scenario-1-datacapture-build.md`. Privacy-policy review spawned (AU $3M small-biz exemption removal ~Dec 2026).
**② Find-or-create CLIENT** (fast-follow, before ~job 5; **INVOICING-only** — field-ops verified client-less jobs fully dispatch/schedule/SMS; Marko attaches the client at invoice meanwhile). **Full verified click-by-click + match-key + 4 curl-gates → `make-scenario-1-findorcreate-build.md`.** Match key **LOCKED = email-first** (`lower(trim(email))`; panel 2/3; field-ops' normalise-mobile kept as a data-ready upgrade). Find-or-create moves **BEFORE** Create SM8 Job (job body needs `company_uuid`). + weekly "merge duplicate clients" sweep. (Rule 8 — customer data; built by panel.)
**③ Photos** (Cloudinary → SM8 Attachment, 2-step binary upload) — Jordan's image iterator; fast-follow.
**④ Scenarios 2-5** (ALL need the GHL PIT with WRITE scope — **rotate the exposed PIT first**): Helper (write SM8 UUID back to GHL opp), Back-sync (SM8 job "Completed" → GHL stage 15 `4fe810e9-…` via SM8 Object Webhook), Accounts A/B (→ Accounts pipeline / Stripe-paid).

## v1 CHECK — ⛔ SUPERSEDED by the no-contact rule (`decision-sm8-keep-vs-build-2026-06-05.md`)
~~Customer auto-SMS ("on-my-way" + booking reminders) fires off the **Job Contact** (`{job.contact_first}`) — which we set on every job → client-less v1 texts customers fine (verified vs SM8 support docs). **One live smoke-test before the first PAYING job:** create a test job via Make → confirm the contact number stores as *mobile*-type (send in `+61…`/`04…` format) → trigger on-my-way → confirm the SMS sends with no job-diary warning.~~

**WHY SUPERSEDED:** this plan routed customer comms through SM8's Job Contact, which requires the customer's mobile to live on the SM8 job — directly conflicting with the **NO-CONTACT rule** (subs see name + address only; no customer phone/email on the SM8 job). The Job Contact is being **dropped** (strip-contact change). **Customer on-the-way SMS + booking reminders now fire from GHL/Twilio (our side), NOT from SM8.** No SM8 mobile-type / job-diary smoke-test is needed because no customer number reaches SM8. (Historical text retained above for traceability.)

---

## Maps to Jordan (jordan-make-reference.md)
Ours = a **leaner version** of Jordan's "Add Client & Job to SM8." Same core (GHL Job-in-SM8 → client + job in SM8, categorised + queued). We **hardcode UUIDs** (he looks them up via 3 helper HTTP calls), **single-create** (he branches new/old contact in two lanes), and **defer** photos + spreadsheet-log + the error-handler "Breaks." **We deliberately DIVERGE from Jordan on the Job Contact: we DROP it** (no customer phone/email on the sub-facing SM8 job — no-contact rule per `decision-sm8-keep-vs-build-2026-06-05.md`; customer comms run via GHL/Twilio). To fully match his robustness on the rest: add the **safety/Breaks** (②) + **find-or-create** (①).
