# Make Scenarios 2 + 3 — the COMPLETION LOOP (SM8 "Completed" → GHL Stage 15)

**Status:** SPEC LOCKED 2026-06-07 — expert-make-automation-engineer build + **Cleo adversarial verify** (both converged; Cleo refinements baked in). Builds on Scenario 1 (DONE + PROVEN). Owner of clicks: Allan (Make EU account). Secrets pasted locally, never in chat.

**Goal:** when a sub marks the job **Completed** in ServiceM8, GHL auto-advances the opportunity to **"Job Complete" (Stage 15)** — which later fires invoicing / NPS / warranty. Done **exactly once** (idempotent), and **survivable** (it can't silently stop).

## Architecture (verified decisions)
- **Match SM8 job ↔ GHL opp via a Make data-store index — NOT a field on the sub-facing SM8 job** (that would re-leak the cross-ref, breaking the no-contact rule) and **NOT** the GHL opp custom field (repeat customers can share/overwrite it — `ghl_starter_capabilities_verified_2026-05-05.md:28`).
- **Cleo refinement:** add a dedicated **`sm8_job_index`** store keyed by `sm8_job_uuid` → clean keyed lookup (vs searching `sm8_jobs` by a non-key field).
- **Helper (Scenario 2) = append to Scenario 1**, not standalone (the create path is the only moment both IDs are certain). The GHL opp-field write is **optional, human-visibility only**, never the join key.
- **Idempotency = two belts:** (1) atomic `sm8_completion_syncs` store (overwrite-OFF dedup on `sm8_job_uuid`); (2) GET the opp + skip if already at Stage 15.
- **Survivability (Cleo's #1 concern):** daily subscription health-check + a polling reconciliation fallback. **Not "proven" until both exist.**

## Stage 15 / pipeline IDs
- Pipeline "Sales" `YTgWxSeFt2oyd3zBe2Xr` · Stage 11 `f34407a6-0c54-47e6-b79f-4cb3ecdbe31d` · **Stage 15 "Job Complete" `4fe810e9-2aa4-4e5c-acf0-58b2634782dc`** (cross-checked `CEO.md:461` + `make-scenario-1-main-build.md:131` — confirm once against the live pipeline before go-live).
- GHL `PUT /opportunities/{id}` returns 200 today (verified) but is **marked deprecated** — re-verify live; fallback = `PUT /opportunities/{id}/status`.

---

## STAGE A — extend Scenario 1 (small, low-risk, build first)
**A1. New data store `sm8_job_index`:** Data stores → Add data store → fields `sm8_job_uuid` (Text), `opp_id` (Text), `created_at` (Date), `generated_job_id` (Text). **Record Key = `sm8_job_uuid`.**
**A2. Add one module to Scenario 1**, inserted after **`Mark created`** (before `Log to Sheet`):
- **Data stores → Add a record** (name `Index by SM8 uuid`): store `sm8_job_index` · Key `{{4.`x-record-uuid`}}` (the SM8 job UUID from Create SM8 Job) · **Overwrite = ON** (idempotent on re-fire) · fields: `sm8_job_uuid`={{4.`x-record-uuid`}}, `opp_id`={{1.opp_id}}, `created_at`={{now}}.
- **Error handler:** Resume/Skip (non-critical — the job is already created).
**A3. (Optional) GHL Helper field** — skip for now; add later for human visibility (a GHL opp custom field `SM8 Job UUID` + a PUT to populate it).

---

## STAGE B — Scenario 3 Back-sync (the real new build)
**B1. New scenario** `SM8 — Job Completed → GHL Stage 15`. First module: **Webhooks → Custom webhook** `sm8-job-status` → copy its URL.
**B2. Register the SM8 Object Webhook** (run once; SM8 key local):
```
POST https://api.servicem8.com/webhook_subscriptions/object   (X-API-Key; form-urlencoded)
  object=job
  fields=status
  callback_url=https://hook.eu1.make.com/<sm8-job-status URL>
  unique_id=timeless-ghl-job-complete-v1     ← Cleo: idempotent re-subscribe (daily re-assert won't dupe)
```
Handle the `challenge` handshake (temporary Webhook-response module echoing `{{1.challenge}}`). Save the subscription UUID.
**B3. Scenario settings:** Sequential processing ON · store incomplete ON · "immediately as data arrives."
**B4. Modules in order:**
```
[1] Webhook (SM8 object — UUID-only payload: object, entry[].uuid, changed_fields, resource_url)
[2] Webhook response 200  ← FIRST, before any work (SM8 needs 2xx within 10s or counts a failure → 72h cancel)
[3] Iterator over entry[]
[4] HTTP GET the job   ({{resource_url}} OR /api_1.0/job/{{uuid}}.json, X-API-Key) → live status + generated_job_id + completion_date
[5] Filter: lower(trim(status)) = "completed"   ← ignore all other status changes
[6] Idempotency belt 1: Data store ADD `sm8_completion_syncs` key={{job uuid}} status="processing", overwrite OFF
       └ duplicate-key error → Skip (already handled/in-progress) = stop silently
[7] Data store SEARCH `sm8_job_index` by sm8_job_uuid = {{job uuid}} → opp_id   (the MATCH)
       └ not found → Slack "unmatched SM8 completion" (manual job? Marko advances manually)
[8] Idempotency belt 2: HTTP GET GHL opp → if pipelineStageId already = Stage 15 → mark synced + stop
[9] HTTP PUT GHL opp → Stage 15   body {pipelineId, pipelineStageId}  (NO status field — Cleo: avoid side effects)
       └ retry 3×/15m on 5xx+429; 4xx → Slack (never retry)
[10] Data store UPDATE `sm8_completion_syncs` key={{job uuid}} status="completed", opp_id, ghl_synced_at={{now}}
[ERR] Slack #automation-errors on any routed failure (never the key/PIT/secret in the message)
```

---

## STAGE C — survivability (Cleo's gate — do before calling it "proven")
- **C1. Daily health-check** (tiny scheduled scenario): `GET https://api.servicem8.com/webhook_subscriptions?status=all` (X-API-Key) → if our `unique_id` subscription is inactive/missing → **re-POST the registration** (idempotent via `unique_id`) + Slack alert.
- **C2. Polling reconciliation fallback** (scheduled, e.g. hourly): GET recent SM8 jobs with `status=Completed` whose `sm8_job_uuid` is in `sm8_job_index` but NOT in `sm8_completion_syncs` (status=completed) → run them through the Stage-9 PUT path. Catches any webhook the live trigger missed. Throttle (Sleep) to respect 180/min.

---

## SMOKE-TESTS (before any real customer)
1. **Helper/index:** drag a test opp to Stage 11 → confirm `sm8_job_index` row exists (key=sm8_job_uuid, value=opp_id).
2. **Webhook + 200-in-time:** change a test job's status → Make run starts, [2] returns 200, SM8 log shows success (no timeout).
3. **Re-GET:** [4] pulls live `status=Completed` + `generated_job_id` (proves UUID-only payload expanded).
4. **Match:** [7] finds the opp_id from the index.
5. **Happy path (crux):** set test job → Completed → GHL opp moves to Stage 15 within ~30s, `sm8_completion_syncs` row = completed.
6. **Idempotency:** toggle SM8 status Completed→Work Order→Completed → run stops at belt 1 or 2 → **exactly ONE stage move, ever.**
7. **Non-completion ignored:** set to Work Order → [5] filters it out, no GHL change.
8. **Unmatched:** complete an SM8 job not in the index → [7] not-found → Slack, no crash.
9. **GHL fail loud:** break the PUT (bad stage id) → Slack fires, run is a resumable Incomplete Execution.
10. **Survivability:** confirm the subscription is active (`GET /webhook_subscriptions`), the daily health-check re-asserts it, and the polling fallback catches a deliberately-missed completion.

## Gotchas
- **72h auto-cancel** on failed deliveries → C1 is mandatory.
- **UUID-only payload** → must re-GET (B4 [4]).
- **2xx within 10s** → respond first (B4 [2]).
- **Never return 410 to SM8** (it unsubscribes you); always 200.
- **Rotate the PIT before go-live** (exposed in-session); re-paste into Stage A Helper + Stage B PUT.
- **Manual SM8 jobs** (created outside Scenario 1) have no index row → routed to Slack as "unmatched."

## Sources
expert-make-automation-engineer build + Cleo adversarial verify (2026-06-07). SM8 webhooks: developer.servicem8.com (object subscription, 2xx/10s, 72h cancel, challenge, 410/429). GHL: marketplace.gohighlevel.com Update-Opportunity (PUT /opportunities/:id, deprecated → fallback /status). Patterns reused from `make-scenario-1-{main,safety}-build.md`.
