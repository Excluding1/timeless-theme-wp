# Make Scenario 1 — FIND-OR-CREATE CLIENT (verified click-by-click)

**Status:** SPEC READY (panel-built 2026-06-04: Make-engineer click-by-click + Cleo + field-ops). **Build = fast-follow AFTER the SAFETY pass** (panel unanimous — see STATE doc). **Still DEFERRED** — client-less jobs are fully operational (field-ops verified); Marko attaches the client at invoice meanwhile. Read with `make-scenario-1-STATE-2026-06-04.md`.

> 🔒 **The SM8 CLIENT record is INTERNAL / INVOICING-ONLY and NEVER sub-facing** (consistent with the NO-CONTACT rule — `decision-sm8-keep-vs-build-2026-06-05.md`). It exists so Marko/Allan can invoice via SM8/Xero/Stripe. The client's stored `email`/`mobile` (the `companycontact.json` BILLING contact in [8]) is fine **because subs never see the client record** — subs see only **their own job (name + address)**, with no customer phone/email on it. **Do NOT confuse the CLIENT contact (internal billing) with a JOB Contact (sub-facing) — the JOB Contact is CANCELLED** by the no-contact rule (so the final `Add Job Contact` step in this doc's module list is REMOVED — see [11] below). Customer comms run from GHL/Twilio, not SM8.

---

## MATCH KEY — LOCKED: **email-first** (`lower(trim(email))`)
**Panel: 2 of 3 → email** (Cleo + Make-engineer); **field-ops dissent → mobile** (more durable human identity). Clifford synthesis:
- **Match on EMAIL** — SM8 `$filter` is exact-`eq` only (no `or`/`not`/`$search`, max 10 `and`). Mobile suffers format drift (`04…`/`+61…`/spaces) → `eq` silently misses → **duplicate clients** (the exact failure find-or-create exists to prevent). Email after `lower(trim())` is a clean canonical string. Household-shared-email worst case = one client card with 2 jobs (Marko splits) — strictly better than minting duplicates.
- **Adopt field-ops' normalisation NOW on the WRITE side** (store `mobile` as canonical `+61…`) so a mobile-fallback leg is *data-ready* later.
- **DEFER the mobile-fallback leg** as a data-driven add: if real data shows many blank-email / different-email repeat leads, add it (revisit ~job 20-30). **Open business fact to confirm before then:** does our intake form *require* email? If yes, email-first covers the dominant channel cleanly.
- Belt: SM8 **unique client name** → a true-duplicate person with a new email throws `400 "Name must be unique"` on create → dead-letter → Marko merges. Same net Jordan relies on + the weekly "merge duplicate clients" sweep.

---

## FINAL MODULE ORDER (ordering decision RESOLVED)
**Find-or-create MUST move BEFORE Create SM8 Job** — the job needs `company_uuid` in its POST body (SM8 has no clean "add company to existing job"). New order:

```
[1] GHL Trigger - SM8 STAGE      (unchanged — Custom webhook)
[2] Map Category                 (unchanged — Set variable → category_uuid)
[3] Client Keys + Guard          (NEW — Tools › Set multiple variables)
[4] Find Client by Email         (NEW — HTTP GET  companycontact.json)
[5] Router: Client found?        (NEW — Router, 2 routes)
     ├─ Route A "FOUND"  → (no module; filter only) → rejoin
     └─ Route B "NOT FOUND" (fallback) →
            [6]  Create Client          (HTTP POST company.json)
            [7]  Sleep 3s               (Tools › Sleep — on link AFTER [6])
            [8]  Create Client Contact  (HTTP POST companycontact.json)
   ── both routes rejoin ──
[9] Resolve company_uuid          (NEW — Tools › Set variable, ifempty)
[10] Create SM8 Job               (was [3]; ADD "company_uuid"; job_description = name + address only — no phone/email)
[11] Add Job Contact              REMOVED (no-contact rule — decision-sm8-keep-vs-build-2026-06-05.md; chain ends at [10])
```
Make renumbers automatically as modules are inserted — Allan renames nothing; just re-point the pill in [10] via the picker. *(The old [11] Add Job Contact is gone — nothing to re-point there.)*

---

## STEP-BY-STEP

### [3] `Client Keys + Guard` — Tools › Set multiple variables (between [2] and [4])
- `email_key` = `{{lower(trim(1.email))}}`
- `mobile_clean` = canonical `+61…` (strip spaces/()/leading-0 → prefix +61); cosmetic for the contact record, NOT for matching
- `has_identity` = `{{if(length(trim(1.email)) > 0; "yes"; if(length(trim(1.phone)) > 0; "yes"; "no"))}}`
- **Guard filter on link [3]→[4]:** `{{3.has_identity}}` Equal to `yes`. The `no` branch (both email+phone blank) must NOT create a junk client → stop + Slack (wired in SAFETY ②).

### [4] `Find Client by Email` — HTTP GET (Parse response = Yes)
- URL: `https://api.servicem8.com/api_1.0/companycontact.json?$filter=email eq '{{3.email_key}}'` (type the `'`, insert pill, type closing `'`; Make URL-encodes — don't pre-encode)
- Headers: `X-API-Key` (paste from `.secrets/servicem8.key` locally) + `Accept: application/json`
- Returns a JSON **array**. First match's client link = `{{4.1.company_uuid}}`; count = `{{length(4)}}` (Make arrays 1-indexed).
- **Error handler:** Resume `{}` (empty result = valid "create new", NOT an error); Retry 3×/5-min only on 5xx/429.

### [5] `Router: Client found?` — Flow control › Router
- **Route A "FOUND":** filter `{{length(4)}}` **Greater than** `0` (no module — carries to [9]).
- **Route B "NOT FOUND" (set as Fallback route):** filter `{{length(4)}}` **Equal to** `0`.

### [6] `Create Client` — HTTP POST company.json (Route B; Parse = Yes)
- URL `https://api.servicem8.com/api_1.0/company.json` · Headers `X-API-Key` + `Content-Type: application/json`
- Body: `{ "name": "{{1.full_name}}", "active": 1 }` (`name` = only required + uniqueness key; address lives on the job, not the client)
- New client UUID = `{{6.`x-record-uuid` from Headers}}`
- **Error handler:** Retry 3×/5-min on 5xx/429; `400 "Name must be unique"` → dead-letter (never retry a 4xx).

### [7] `Sleep 3s` — Tools › Sleep (on link [6]→[8], Route B only)
- Delay `3`. SM8 is read-after-write eventually consistent — a brand-new `company_uuid` can briefly reject on the dependent write. Mirrors Jordan's `sleep 3s`. Route A reuses a persisted UUID → no sleep. One Sleep covers the contact write + downstream job write (sequential after it).

### [8] `Create Client Contact` — HTTP POST companycontact.json (Route B) — **INTERNAL BILLING contact, NOT sub-facing**
*(This is the `type:"BILLING"` contact on the internal CLIENT record — used for invoicing only; subs never see it. It is NOT the dropped JOB Contact. Storing email/mobile here is fine per the no-contact rule.)*
- URL `https://api.servicem8.com/api_1.0/companycontact.json` · `X-API-Key` + `Content-Type: application/json`
- Body:
```json
{ "company_uuid": "{{6.`x-record-uuid` from Headers}}",
  "first": "{{1.first_name}}", "last": "{{1.last_name}}",
  "email": "{{3.email_key}}", "mobile": "{{3.mobile_clean}}",
  "type": "BILLING", "is_primary_contact": "1" }
```
- If webhook sends only `full_name`: `"first":"{{1.full_name}}","last":""` or split via `{{first(split(1.full_name;" "))}}` / `{{join(slice(split(1.full_name;" ");1);" ")}}`. Confirm fields from one captured GHL bundle.
- **Error handler:** Retry 3×/5-min on 5xx/429; 4xx → dead-letter. **Resume (continue), don't Rollback** — a failed *contact* must not block the job (we still hold a valid `company_uuid` from [6]); Slack-note + Marko attaches the contact manually.

### [9] `Resolve company_uuid` — Tools › Set variable (both routes rejoin here)
- `company_uuid` = `{{ifempty(4.1.company_uuid; 6.`x-record-uuid` from Headers)}}` — found path → search UUID; created path → new UUID. One expression, both routes.

### [10] EDIT `Create SM8 Job` — add `company_uuid`; keep `job_description` contact-free:
```json
{ "status": "Work Order",
  "company_uuid": "{{9.company_uuid}}",   ← the new line (find-or-create resolves it)
  "category_uuid": "{{2.category_uuid}}",
  "queue_uuid": "7bbcd459-ccb6-46e0-abe3-243e55bbe33b",
  "job_address": "{{1.full_address}}",
  "job_description": "{{1.full_name}}" }
```
> ⚠️ **NO-CONTACT rule:** `job_description` is **name + address only** — `{{1.phone}}` / `{{1.email}}` are **removed** (the customer's contact must not live on the sub-facing job; it lives on the **internal CLIENT** record only). ~~old: `"{{1.full_name}} | {{1.phone}} | {{1.email}}"`~~. Everything else (X-API-Key, Parse=Yes, `x-record-uuid` capture) unchanged. (Add the GHL opp link/id here too if Marko dispatches from the SM8 job — internal link, allowed.)

### [11] ~~`Add Job Contact`~~ — **REMOVED (no-contact rule)**
The customer's phone/email must not reach the sub-facing SM8 job, so the Job Contact module is **dropped** (`decision-sm8-keep-vs-build-2026-06-05.md`). The chain ends at [10] `Create SM8 Job`. Customer comms (on-the-way SMS, reminders) run from **GHL/Twilio**. *(This is the JOB Contact — distinct from the internal CLIENT billing contact in [8], which stays.)*

---

## FILTER / ROUTER SUMMARY
| Link | Filter | Condition |
|---|---|---|
| [3]→[4] | Identity present | `{{3.has_identity}}` Equal `yes` |
| [3]→dead-letter | No identity | `{{3.has_identity}}` Equal `no` (stop/Slack per SAFETY ②) |
| Router A | FOUND | `{{length(4)}}` Greater than `0` |
| Router B (fallback) | NOT FOUND | `{{length(4)}}` Equal `0` |

**Ops cost:** found path +3 ops, not-found path +6 ops. Negligible at tens of jobs/mo.

---

## ⚠️ MUST CURL-TEST BEFORE BUILDING (this env can run with the SM8 key)
1. **Is `email` server-side filterable on `companycontact.json`?** `GET …/companycontact.json?$filter=email eq '<known-email>'` → expect 200 + that record. If 400 or returns everything → email isn't filterable → fall back to fetch-list + Make-filter (more ops). **Decide first.** *(READ-only — safe.)*
2. **`eq` value case-sensitivity.** Same email mixed-case vs lower. If case-sensitive, our `lower(trim())` only protects records WE write; legacy/manual clients at risk. *(READ-only.)*
3. **`x-record-uuid` header on `company.json` POST** (proven for job.json; assumed for company/companycontact). One create-then-delete confirms header name/case. *(WRITE — create+delete test record.)*
4. **`active` accepted on `company.json` create.** If rejected, drop the line — `name` alone suffices. *(WRITE — minimal `{"name":"Test Co"}`.)*
