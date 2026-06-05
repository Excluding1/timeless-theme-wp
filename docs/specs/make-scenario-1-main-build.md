# Make.com — Scenario 1 "Main" build sheet **v2** (GHL → ServiceM8 job create)

**Status:** Part A (GHL) corrected + ready to build. Part B (Make) = vetted v2 below. SM8 write-path PROVEN live. Gate now = your *published* GHL workflow, then we wire Make together.

> ⛔ **STRIP-CONTACT CHANGE (LOCKED 2026-06-05 — `decision-sm8-keep-vs-build-2026-06-05.md`).** The **NO-CONTACT rule** overrides the contact-handling in this build sheet: subs get **NAME + ADDRESS only** — customer **phone/email must NEVER land on the SM8 job** (anti-poaching). Concretely vs the steps below: **(1)** in **B4** `job_description`, **drop the phone/Call line and the `${{opp_value}}` quote line** that expose customer contact — keep name + address (+ the GHL deep-link for Marko, who is internal). **(2)** the **"Formal SM8 Job Contact"** fast-follow (deferred section) is **CANCELLED** — do NOT add `jobcontact.json`. **(3)** customer "on-the-way" SMS + reminders run from **GHL/Twilio**, NOT SM8. Wherever this doc says the description "carries phone" or plans a Job Contact, that is the **v1 plan, now SUPERSEDED**. (The GHL deep-link stays: Marko/Allan are internal and need the full record to dispatch — the rule blocks *sub-facing* contact, not internal links.)

> ✅ **2026-06-04 v2 — reviewed by expert-ghl-operator + expert-field-service-ops + auditor-webhook-integrity; judged by Clifford + Cleo.** The v1 draft was one happy-path chain with no dedup + no error path (auditor verdict: *"do not run a real paying customer through it as-is"*). v2 adds: **atomic dedup, error→Slack dead-letter, mobile-first client match, address guard, shared-secret**. Photos / badges / back-sync are deliberately **deferred fast-follow** (see end). ~~formal Job-Contact~~ → **NOT deferred — CANCELLED** by the no-contact rule (banner above). Staff find the source quote via the GHL deep-link in the description (Marko/Allan are internal), not a customer contact on the job.

> ✅ **SM8 SIDE PROVEN.** Key in `.secrets/servicem8.key`; the 6 category UUIDs + ACT queue UUID captured + filled below; live test job created → category + queue stuck → deleted (HTTP 200, `errorCode 0`, `x-record-uuid` returned).

**Owner of clicks:** Allan builds in Make (EU region); Clifford gives module-by-module steps. SM8 key pasted into the Make HTTP module *locally* — never into chat.
**Sources:** SM8 verified at developer.servicem8.com (createjobs/auth/http-codes/filtering); GHL trigger + token behaviour sourced to GHL help docs (panel); Make error-handling + `switch()` per Make docs (panel). Pipeline/stage IDs per `research_ghl_pipeline_2026-05-04.md` + Override 14 v4.

---

## What it does
When a GHL opportunity reaches **Stage 11 "Job in ServiceM8"** (`f34407a6-0c54-47e6-b79f-4cb3ecdbe31d`), Make creates the matching job in ServiceM8, sets it to the correct **one of 6 categories** (from the **Job Category** dropdown the quoter set), drops it in the **ACT / Ready-to-Dispatch queue** as a **Work Order**, and records the link for later sync — exactly once, with a loud alert if anything fails. This is the GHL→SM8 handoff Jordan runs: the moment a sold job becomes a dispatchable work order.

---

## PREREQUISITES
1. **SM8: 6 Job Categories + ACT queue** — ✅ DONE (created + UUIDs captured below).
2. **SM8 API key** — ✅ DONE (`.secrets/servicem8.key`).
3. **GHL: the "Job Category" Contact custom field + the published workflow** — Part A below (Allan).
4. **A Make Data store** named `sm8_jobs` with **`opp_id` as the primary/unique key** (used for dedup — see B1.5).
5. **A restricted Slack channel `#automation-errors`** (or email) for dead-letters — will contain customer PII, so keep it private.

---

## PART A — GHL side (the trigger)
1. GHL → Automation → **Workflows → + Create Workflow** (blank). Name: `SM8 — Create Job on Stage 11`.
2. **Trigger: "Pipeline Stage Changed"** — NOT "Opportunity Status Changed" (that fires only on Open→Won/Lost and would never fire on a stage move; sourced to GHL's trigger docs).
   - Filters: **In Pipeline = "Sales"** (id `YTgWxSeFt2oyd3zBe2Xr` — confirmed live via API 2026-06-04) · **Pipeline Stage = "Job in ServiceM8"** (id `f34407a6-0c54-47e6-b79f-4cb3ecdbe31d` — confirmed live).
   - Workflow Settings: leave **"Allow Multiple Opportunities" ON** so a repeat customer's 2nd job still fires. The duplicate-fire guard is Make-side (atomic dedup on opp_id), not a per-contact tag.
3. **Action: Webhook**
   - Method **POST**, URL = `https://hook.eu1.make.com/y8keuzdsaoswgfrbk8mbn63g2omic3lm` (the Make custom webhook, created 2026-06-04).
   - **Custom Header** (if available): `x-webhook-secret: <a long random string>` — Make drops any request without it (B0). If your GHL build can't add custom headers, add `secret` as a Custom-Data field instead.
   - **Custom Data** (key → value — insert each via the merge-field PICKER, don't hand-type):
     - `contact_name` → {{contact.name}}
     - `phone` → {{contact.phone}}
     - `email` → {{contact.email}}
     - `job_address` → **{{contact.full_address}}** (NOT `{{contact.address}}` — invalid/empty)
     - `job_category` → the **Job Category** Contact field (picker → `{{contact.job_category}}`). 6 values; pricing stays manual/freeform — this is the ONLY structured field we need.
     - `job_description` → the quote scope/notes field (or `{{opportunity.name}}` if that carries scope)
     - `opp_id` → {{opportunity.id}}
     - `opp_value` → likely **{{opportunity.lead_value}}** (verify in picker; NOT `monetary_value`)
     - `contact_id` → `{{contact.id}}` — Make builds the GHL deep-link (`…/location/Uz8fQwDiUxAHVtlruspD/contacts/detail/{contact_id}`) into the job description, so Marko (who has GHL access) opens the full record + photos when dispatching. Simpler for the quoter than typing a URL; the photo-files are the fast-follow. *(`phone`/`email` are still SENT to Make — needed for the internal CLIENT/billing record + GHL/Twilio comms — but per the no-contact rule they are NOT written onto the sub-facing SM8 job, and the formal Job Contact is CANCELLED, not a fast-follow.)*
4. Save + **Publish**. (Build a test opportunity you can drag to Stage 11 for the live test.)

> **Create the GHL custom field first:** Settings → Custom Fields → Add → type **Single Option / Dropdown**, name **"Job Category"** (on the **Contact** object), with exactly these 6 options (must match the B3 switch character-for-character): `Resurfacing`, `Regrouting`, `Silicone & Sealing`, `Repairs`, `Specialist`, `Combo`. The quoter picks it when preparing the quote. Blank/unmatched → defaults to Combo (never blocks a job); a *non-blank* unmatched value also pings Slack (config drift). Replaces the old SKU-prefix idea — Timeless prices manually, so the category is just the job *type* for SM8 reporting/dispatch.

---

## PART B — Make side (the scenario) — v2

**B0. Auth filter (security).** Right after the webhook, add a **Filter**: continue only if `x-webhook-secret` header (or `secret` field) == your secret; else stop (optionally low-alert). Closes the "anyone with the URL can forge a job" hole.

**B1. Trigger — Webhooks › Custom webhook** `ghl-stage11`. URL already in Part A.3. Click **Re-determine data structure**, fire one test from GHL so Make learns the payload.

**B1.5. DEDUP (atomic reservation) — Data store › "Add a record"** to `sm8_jobs`, key **`opp_id`**, payload `{ opp_id, status: "creating", created_at: now, contact_name, job_category }`.
   - Make this an **Add (insert)** so a **duplicate `opp_id` key FAILS** — that failure *is* the dedup (atomic; beats "search-then-add" which still races under drag-spam).
   - Attach an **error handler on B1.5**: if the add failed = duplicate → **Data store › Get** the existing record and route:
     - `status = created` → **stop silently** (already done — the real defence against stage backflow 11→Hold→11 + GHL's 6× retries).
     - `status = creating` AND recent (<10 min) → stop (a near-simultaneous run owns it).
     - `status = failed` OR stale `creating` (>10 min) → set `status = creating`, continue to B2 (lets a genuinely failed first attempt be reprocessed — NOT permanently tombstoned).

**B2. Client find-or-create (mobile-first).** Normalise `{{1.phone}}` to E.164 (`+61…`) in a Set-variable, then:
   - `GET company.json?$filter=mobile eq '<+61…>'` (header `X-API-Key`, local).
   - empty AND email present → `GET …?$filter=email eq '<lower/trim email>'`.
   - still empty → **POST** `company.json` `{ "name": "{{1.contact_name}}", "email": "{{1.email}}", "mobile": "<+61…>" }` → capture `company_uuid` from `x-record-uuid`.
   - **both phone AND email blank** → route to the dead-letter (B-ERR): can't identify a client; don't create a junk record.
   *(Mobile-first because phone/SMS is core to this business; email-first duplicated clients on the common blank-email lead.)*

**B3. Set variable `category_uuid`** — switch on the Job Category dropdown. ⚠️ **GHL stores option *Values* (lowercase, " & " → `silicone__sealing`) that differ from the labels, and the webhook may send either — so the switch uses `lower(trim())` and matches BOTH the value form and the label form.** Confirm the exact form by reading the first test webhook, then optionally trim. Switch:
```
{{ switch( lower(trim(1.job_category));
  "resurfacing"; "dde365f8-0ec9-4995-b813-243f9a427cdb";
  "regrouting"; "957eb098-e48e-4084-baef-243f9b153b4b";
  "silicone & sealing"; "e9f6c3eb-1c14-4766-850b-243f9c0d0f7b";
  "silicone__sealing"; "e9f6c3eb-1c14-4766-850b-243f9c0d0f7b";
  "repairs"; "0e59fc33-75fe-4b93-b6da-243f911b50fb";
  "specialist"; "189e430b-4e55-4e2e-815f-243f90f46bab";
  "combo"; "b3470e8f-b955-4fd4-9e0a-243f9c2d5eab";
  "b3470e8f-b955-4fd4-9e0a-243f9c2d5eab" ) }}
```
Final bare UUID = default → blank/unmatched lands in Combo (never blocks). **Add a Filter/branch:** if `job_category` is **non-blank AND** != the 6 values → low-priority Slack log ("job_category 'X' unmatched → Combo" = config drift). Blank may default silently. **Test case-sensitivity in the sandbox** (Make `switch` case behaviour is undocumented).

**B4. CREATE THE JOB — HTTP › POST** `https://api.servicem8.com/api_1.0/job.json` (headers `X-API-Key` local + `Content-Type: application/json`):
> ⚠️ **NO-CONTACT rule applies to `job_description`:** strip the **`Call: {{1.phone}}`** segment (and the customer-facing **`Quote: ${{1.opp_value}}`** if surfaced to subs) — keep name + address + category + the GHL opp link/id (the link is internal-only; Marko/Allan dispatch from it). Use the **post-strip body** below; the old contact-carrying line is kept struck-through for history.
```json
{
  "status": "Work Order",
  "company_uuid": "{{company_uuid from B2}}",
  "category_uuid": "{{category_uuid from B3}}",
  "queue_uuid": "7bbcd459-ccb6-46e0-abe3-243e55bbe33b",
  "job_address": "{{1.job_address}}",
  "job_description": "{{1.contact_name}}\n— Category: {{1.job_category}}\n— GHL opp: {{1.opp_id}} | {{1.ghl_link}}"
}
```
> ~~old (SUPERSEDED — leaked customer phone to the sub-facing job):~~ `"job_description": "{{1.job_description}}\n— Category: {{1.job_category}} | Quote: ${{1.opp_value}}\n— Call: {{1.phone}} | GHL opp: {{1.opp_id}} | {{1.ghl_link}}"`
   - If `job_address` is blank → still create (don't lose the job) but prepend `⚠️ ADDRESS MISSING` to the description AND fire B-ERR (so a dispatcher fills it). SM8 won't reject a blank address, so guard it ourselves.
   - **Parse response = Yes.** New job UUID returns in the **`x-record-uuid` header** → variable `sm8_job_uuid`; also grab `generated_job_id` (human job #).
   - **Error handler on B4:** **Break** with retry **3× / 15-min** on **5xx + 429** (transient); **do NOT retry 4xx** (400 validation / 401 auth — they won't succeed). On terminal failure → B-ERR.

**B5. Finalise reservation — Data store › Update** the `opp_id` record: `status = "created"`, `sm8_job_uuid`, `generated_job_id`, `company_uuid`, `category_uuid_used`, `updated_at`. (This is what Helper + Back-sync read.)

**B-ERR (dead-letter).** On any routed failure: set the reservation `status = "failed"` + `last_error`, then **Slack to the restricted `#automation-errors`** with `opp_id`, `contact_name`, SM8 HTTP status, `{{error.message}}` — **never include the API key/secret**. This converts "silent lost job" into "loud alert Marko can act on."

**B6.** Turn the scenario **ON**, schedule = "immediately as data arrives" (webhook = instant).

---

## TEST PLAN (do before any real customer)
1. Test opp with a real-looking address + **Job Category = Resurfacing** → drag to Stage 11. Expect: one SM8 **Work Order**, category **Resurfacing**, **ACT** queue, description shows phone + quote + GHL link; B4 = HTTP 200 + `x-record-uuid`.
2. **Dedup proof:** drag the SAME opp 11→back→11 (and/or fire twice within 2s). Assert **exactly ONE** SM8 job exists.
3. **Failed-then-retry:** force a B4 failure (temporarily bad category), confirm reservation = `failed` + Slack alert, then re-fire and confirm it **reprocesses** (not permanently blocked).
4. Category edges: **Regrouting**→Green; **Combo**→Yellow; blank→Combo (silent); a non-blank junk value→Combo **+ Slack log**.
5. Client edges: phone-only lead (no email) → matches/creates by mobile, no duplicate on repeat; both blank → B-ERR (no junk client).
6. Only after all green: one real lined-up customer.

---

## DEFERRED — fast-follow (NOT v1; build in this order)
**Immediate fast-follow (right after v1 is live + proven):**
- **Attach quote photos** to the SM8 job — ✅ **locked immediate fast-follow** (v1 carries the GHL photo LINK in the job description instead, zero added ops). (Cloudinary → Make HTTP-GET bytes → SM8 two-step: `POST Attachment.json` {related_object:"job", related_object_uuid, attachment_name, file_type, active:1} → `POST Attachment/{uuid}.file` raw multipart). ~3 modules/photo — the one place the build genuinely grows.
- ~~**Formal SM8 Job Contact** (`jobcontact.json` {job_uuid, first, last, mobile, type:"JOB"}) = tappable call button on the job card.~~ **CANCELLED — NO-CONTACT rule** (`decision-sm8-keep-vs-build-2026-06-05.md`): the customer's mobile must NOT live on the sub-facing SM8 job. Do not build this. Customer comms = GHL/Twilio. (Sub on-site needing the customer: Marko relays / masked proxy number at scale — not a Job Contact.)
- **Badges** (strata / pre-1990 asbestos / no-lift / deposit-paid) — multi-select, accepted on job-create as a `badges` array; auto-triggers SM8 checklist forms. Wire once the GHL flags are mapped.

**Then (need the GHL PIT — rotate it first):**
- **Helper:** write `sm8_job_uuid` back onto the GHL opportunity (per-opp dedup key) + maintain the map.
- **Back-sync:** SM8 **Object Webhook** on `job.status` (`POST /webhook_subscriptions/object` object=job, fields=status, callback must 2xx within 10s) → on `Completed`, advance GHL opp to **Stage 15 "Job Complete"** (`4fe810e9-2aa4-4e5c-acf0-58b2634782dc`); use SM8 `completion_date`. Also map SM8 `Unsuccessful` → a GHL lost/issue stage.
- **Accounts A / B:** Job Complete → Accounts pipeline "Awaiting Invoice"; Stripe final → Accounts "Paid" (finance = Payment Status field + Accounts pipeline per Decision 12 v2 — no Job Invoiced/Paid stages).

**Hardening (soon, not blocking):** deterministic UUIDv5 from opp_id as a 2nd dedup belt; nightly client-dedupe; daily "jobs-created today" heartbeat to Slack (catches a silently-unpublished workflow); privacy-register line for the US(GHL)→EU(Make)→AU(SM8) PII path.

## PIT note
Rotate the exposed GHL PIT **before** wiring Helper/Back-sync (the first Make→GHL auth uses). Main (v1) does not touch the PIT.
