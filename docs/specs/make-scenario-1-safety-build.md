# Make Scenario 1 — SAFETY PASS (lean, verified click-by-click)

**Status:** SPEC LOCKED 2026-06-04 (Make-engineer build + Cleo adversarial verify → **lean design**). This is the **next build** (before find-or-create, before any real customer). **GHL workflow "SM8 — Create Job on Stage 11" STAYS DRAFT until every step here is built + smoke-tested.** Read with `make-scenario-1-STATE-2026-06-04.md`.

> ⛔ **STRIP-CONTACT CHANGE (LOCKED 2026-06-05 — `decision-sm8-keep-vs-build-2026-06-05.md`).** Steps **[6] Sleep 3s** and **[7] Add Job Contact** below are **REMOVED** by the no-contact rule: customer **phone/email must never land on the SM8 job** (subs get name + address only; anti-poaching). The post-strip chain ends at **[5] Mark created** (the Sleep existed only to let SM8 settle before the Job Contact write — with no Job Contact, it's unneeded here; note find-or-create keeps its *own* Sleep for the client→contact write). **Customer on-the-way SMS / reminders fire from GHL/Twilio, NOT SM8.** Smoke-test **#5 (SMS / mobile-type)** is **dropped** — no customer number reaches SM8. The struck-through steps are kept for history; the no-contact rule wins.

## Why lean (Cleo verdict)
- **`Sequential processing = ON` is the real race guard** — Make serialises webhook runs, so two simultaneous fires can't interleave (no TOCTOU). Verified vs Make docs.
- Make's **"Add a record" (overwrite OFF) errors on a duplicate key** — verified, not speculative. So the data store gives persistent idempotency (GHL retries, stage-backflow 11→Hold→11) on top of Sequential.
- **DEFERRED as over-built for a non-technical hand-build:** the 3-route created/creating/stale reclaim router, automatic stale reprocessing, complex reserve branches. Revisit at scale.

## Locked lean flow
```
[1] Webhook (GHL Trigger - SM8 STAGE)
      └ filter "Secret gate": {{1.secret}} Equal-to <literal secret>  AND  {{1.opp_id}} not empty   (else → Slack dead-letter)
[2] Reserve opp_id            Data store · Add a record (overwrite OFF), key={{1.opp_id}}
      └ error handler → [filter: error is NOT duplicate-key] → Slack   (duplicate → filter blocks → bundle stops = dedup)
[3] Map Category              (unchanged — Set variable → category_uuid)
[4] Create SM8 Job            (unchanged; error handler: Break/retry 3×/15m on 5xx+429; 4xx → Slack)
[5] Mark created              Data store · Update a record: status=created, sm8_job_uuid={{4.`x-record-uuid`}}   ← post-strip-contact chain ENDS here
[6] Sleep 3s                  REMOVED (no-contact rule — only existed to gap before the Job Contact write)
[7] Add Job Contact           REMOVED (no-contact rule — customer comms via GHL/Twilio; see decision-sm8-keep-vs-build-2026-06-05.md)
Scenario Settings: Sequential processing ON · Store incomplete executions ON · Auto-commit ON
```

---

## PART 0 — GHL side (do first)
In the GHL workflow Action → **Webhook → Custom Data**, add/confirm two rows:
1. `secret` → the **literal secret string** typed by hand (NOT a merge field). Value lives in `.secrets/make-webhook-secret.key` (gitignored) — copy it from there. Same value goes in the Make filter (Step 2 below).
2. `opp_id` → via the merge-field **picker** → `{{opportunity.id}}`. **Confirm the live payload field name** against one captured bundle before relying on it.
Then **re-fire one test** from GHL so Make re-learns the payload.

## PART 1 — Make side (build in order)

### Step A — Scenario Settings (do early)
Bottom bar → scenario **Settings**: **Sequential processing = ON** · **Allow storing of incomplete executions = ON** · **Auto commit = ON** · schedule = "Immediately as data arrives."

### Step B — Secret gate (filter on link [1]→[2])
Click the spanner on the connector after **GHL Trigger - SM8 STAGE** → **Set up a filter**:
- Label: `Secret gate — reject forged`
- Condition 1: `{{1.secret}}` **Text: Equal to** `<paste literal secret>` (case-sensitive; type the raw string, NOT a pill — no trailing space).
- Condition 2 (AND): `{{1.opp_id}}` **Exists / not empty**.
- The fail branch (no/wrong secret, or blank opp_id) → route to the Slack dead-letter (Step F).

### Step C — Data store (one-time)
Left sidebar → **Data stores → Add data store**: name `sm8_jobs`; new structure `sm8_jobs_struct` with fields: `opp_id` (Text), `status` (Text), `created_at` (Date), `sm8_job_uuid` (Text), `source` (Text). **Record Key = `opp_id`.** **No secret, no PII in the store.**

### Step D — Reserve opp_id (NEW module, between [1]-filter and [2] Map Category)
**Data stores → Add a record**:
- Title: `Reserve opp_id (dedup)`
- Data store `sm8_jobs` · **Key = `{{1.opp_id}}`** · **Overwrite an existing record = NO/OFF** (this is what makes a duplicate error).
- Fields: `opp_id`={{1.opp_id}} · `created_at`={{now}} · `source`=`ghl_stage_11`.
- **Error handler** (right-click → Add error handler): add the **Slack** module (same as Step F) with a **filter** on its link: fire **only if** `{{error.message}}` does **NOT contain** the duplicate-key phrase (confirm exact phrase in smoke-test #2; until then it may over-alert on dupes, which is safe — the bundle still stops, no duplicate job). On a duplicate the filter blocks Slack → bundle stops silently = the dedup.

### Step E — Map Category → Create SM8 Job → Mark created  *(chain ends here post-strip-contact)*
- **Map Category** [3]: unchanged.
- **Create SM8 Job** [4]: unchanged headers/error-handling. **Error handler:** Break/retry **3× / 15 min** on **5xx + 429 only**; **4xx → Slack** (never retry a 4xx). ⚠️ **`job_description` carries name + address only** (no phone/email — no-contact rule; see `make-scenario-1-main-build.md` B4 post-strip body).
- **Mark created** [5] (NEW, right after Create SM8 Job): **Data stores → Update a record**, Key `{{1.opp_id}}`, set `status`=`created`, `sm8_job_uuid`={{4.`x-record-uuid` from Headers}}. **This is the last module in the post-strip-contact chain.**
- ~~**Sleep 3s** [6]~~ — **REMOVED** (no-contact rule). It only existed to let SM8 settle before the Job Contact write; with no Job Contact there's nothing downstream of [5] that needs the gap. *(Find-or-create keeps its own client→contact Sleep — that's a different write and stays.)*
- ~~**Add Job Contact** [7]~~ — **REMOVED** (no-contact rule, `decision-sm8-keep-vs-build-2026-06-05.md`). Customer phone/email must not reach the SM8 job. Customer comms = **GHL/Twilio**. Sub on-site needing the customer → **Marko relays / masked proxy** at scale.

### Step F — Slack dead-letter (#automation-errors, PRIVATE channel)
One Slack target reused by all error branches. Pick ONE:
- **Option A (recommended, simpler): Slack → Create a message** → "Add a connection" → sign into the workspace + authorise → channel `#automation-errors`.
- **Option B: HTTP POST** to a Slack **Incoming Webhook URL** (`https://hooks.slack.com/services/…`), body `{"text":"…"}`.
- Message text (NEVER include the API key or `secret`):
  ```
  :rotating_light: SM8 job sync FAILED
  opp_id: {{1.opp_id}} | contact: {{1.full_name}}
  failed: <module name> | HTTP: {{4.statusCode}} | error: {{error.message}}
  → Fix: inspect the failed run in Make history; resume it, OR manually create the SM8 job, OR delete this opp_id key in the sm8_jobs data store and re-fire (stage 11 → back → 11).
  ```
  (The "delete the opp_id key + re-fire" line is the runbook for the one failure mode: job-create failed AFTER the dedup key was written, so a plain retry would stop.)

---

## REQUIRED INPUTS FROM ALLAN
1. **Slack:** connect the Make Slack app to the workspace owning `#automation-errors` (Option A) **OR** supply a Slack Incoming Webhook URL (Option B). Channel must exist + be **private** (carries PII).
2. **Shared secret:** generated → `.secrets/make-webhook-secret.key` (gitignored). Copy the same value into the GHL Custom Data `secret` (Part 0) and the Make secret-gate filter (Step B).
3. **Confirm the GHL opp-id field name** in the live webhook bundle (expected `opp_id` from `{{opportunity.id}}`).

## SMOKE-TESTS BEFORE PUBLISHING THE GHL WORKFLOW
1. **Secret gate:** POST junk (no/wrong secret) to the webhook → run stops at the filter, zero SM8 jobs. Correct secret → proceeds.
2. **Duplicate-key error text:** in `sm8_jobs`, manually Add key `TESTOPP1`, then Add `TESTOPP1` again (overwrite OFF) → confirm it ERRORS; capture the exact error phrase → set the Step D filter to that phrase. (If it does NOT error → rely on Sequential-processing-ON; report back.)
3. **Dedup end-to-end (crux):** drag a test opp 11→back→11 (or fire 2 webhooks within ~2s) → assert exactly ONE SM8 job; 2nd run shows "stopped."
4. **Fail-then-recover:** break Create-job (bad category_uuid) → confirm Slack fires, no Sleep/contact runs; then per the runbook delete the opp_id key + re-fire → confirm it reprocesses.
5. ~~**SMS / read-after-write:** confirm Add Job Contact lands the number as *mobile*-type (send `+61…`) with no diary warning (also the v1 on-my-way-SMS check).~~ **DROPPED** — no-contact rule removes Add Job Contact; no customer number reaches SM8 so there is nothing to mobile-type-check. **Instead verify the SM8 job shows NAME + ADDRESS only (no phone/email anywhere on the job).** Customer SMS is tested on the **GHL/Twilio** side.
6. **No-opp_id:** valid secret, blank opp_id → routes to Slack, no job.

## FORWARD-COMPAT with find-or-create (`make-scenario-1-findorcreate-build.md`)
When find-or-create lands, its client modules insert **between Map Category and Create SM8 Job**, and Create-job moves later. **Reserve opp_id stays right after the secret gate** (reserve first, then all work). The find-or-create "no identity" branch routes to this **same** Slack dead-letter. Find-or-create keeps its **own** Sleep 3s (client-create→client-contact). *(There is no longer a job→contact Sleep — the no-contact rule removed both the Job Contact and its Sleep; find-or-create's client→contact Sleep is the only Sleep that remains. The CLIENT contact is internal/invoicing-only, never sub-facing — see the find-or-create doc.)*

## Sources (Cleo)
Make Data Stores · Make Webhooks (sequential processing) · Make Scenario Settings — help.make.com.
