# Make Scenarios 2 + 3 — the COMPLETION LOOP (SM8 "Completed" → GHL Stage 15)

**Status:** SPEC LOCKED 2026-06-07 — expert-make-automation-engineer build + **Cleo adversarial verify** (both converged; Cleo refinements baked in). Builds on Scenario 1 (DONE + PROVEN). Owner of clicks: Allan (Make EU account). Secrets pasted locally, never in chat.

**Goal:** when a sub marks the job **Completed** in ServiceM8, GHL auto-advances the opportunity to **"Job Complete" (Stage 15)** — which later fires invoicing / NPS / warranty. Done **exactly once** (idempotent), and **survivable** (it can't silently stop).

## Architecture (verified decisions)
- **Match SM8 job ↔ GHL opp via a Make data-store index — NOT a field on the sub-facing SM8 job** (that would re-leak the cross-ref, breaking the no-contact rule) and **NOT** the GHL opp custom field (repeat customers can share/overwrite it — `ghl_starter_capabilities_verified_2026-05-05.md:28`).
- **Simplification (Allan, 2026-06-07):** reuse the existing **`sm8_jobs`** store — it already holds the `opp_id ↔ sm8_job_uuid` link (`sm8_job_uuid` field, written by "Mark created"). Back-sync **searches `sm8_jobs` by `sm8_job_uuid`** → opp_id. **No new store.** *(Cleo's dedicated `sm8_job_index` was a high-volume keyed-lookup optimization; at our scale a field-search is reliable + fewer moving parts to break. CEO override — add the index later only if volume demands.)*
- **Helper (Scenario 2) = append to Scenario 1**, not standalone (the create path is the only moment both IDs are certain). The GHL opp-field write is **optional, human-visibility only**, never the join key.
- **Idempotency = two belts (no new store):** (1) the matched `sm8_jobs` row's `status` field — if already `completed`, stop (Sequential-processing-ON serialises webhook runs → no concurrent race); (2) GET the opp + skip if already at Stage 15.
- **Survivability (Cleo's #1 concern):** daily subscription health-check + a polling reconciliation fallback. **Not "proven" until both exist.**

## Stage 15 / pipeline IDs
- Pipeline "Sales" `YTgWxSeFt2oyd3zBe2Xr` · Stage 11 `f34407a6-0c54-47e6-b79f-4cb3ecdbe31d` · **Stage 15 "Job Complete" `4fe810e9-2aa4-4e5c-acf0-58b2634782dc`** (cross-checked `CEO.md:461` + `make-scenario-1-main-build.md:131` — confirm once against the live pipeline before go-live).
- GHL `PUT /opportunities/{id}` returns 200 today (verified) but is **marked deprecated** — re-verify live; fallback = `PUT /opportunities/{id}/status`.

---

## STAGE A — NOT NEEDED ✅ (2026-06-07, Allan)
The existing **`sm8_jobs`** store already carries the `opp_id ↔ sm8_job_uuid` link (the `sm8_job_uuid` field, written by "Mark created" in Scenario 1) — so **no new store and no Scenario-1 change.** Back-sync just searches `sm8_jobs` by `sm8_job_uuid`. *(Optional, later: a GHL opp custom field `SM8 Job UUID` for CRM visibility — not load-bearing, skip for now.)*

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
[6] Data store SEARCH `sm8_jobs` where sm8_job_uuid = {{job uuid}} (limit 1) → opp_id + current status   (the MATCH)
       └ not found → Slack "unmatched SM8 completion" (manual job? Marko advances manually)
[7] Idempotency belt 1: Filter — continue only if {{6.status}} ≠ "completed"  (already synced → stop; Sequential-ON = no race)
[8] Idempotency belt 2: HTTP GET GHL opp → if pipelineStageId already = Stage 15 → stop
[9] HTTP PUT GHL opp → Stage 15   body {pipelineId, pipelineStageId}  (NO status field — avoid side effects)
       └ retry 3×/15m on 5xx+429; 4xx → Slack (never retry)
[10] Data store UPDATE `sm8_jobs` key={{6.opp_id}} status="completed", ghl_synced_at={{now}}
[ERR] Slack #automation-errors on any routed failure (never the key/PIT/secret in the message)
```

---

## STAGE C — survivability (Cleo's gate — do before calling it "proven")
- **C1. Daily health-check** (tiny scheduled scenario): `GET https://api.servicem8.com/webhook_subscriptions?status=all` (X-API-Key) → if our `unique_id` subscription is inactive/missing → **re-POST the registration** (idempotent via `unique_id`) + Slack alert.
- **C2. Polling reconciliation fallback** (scheduled, e.g. hourly): GET recent SM8 jobs with `status=Completed` whose `sm8_job_uuid` is in `sm8_job_index` but NOT in `sm8_completion_syncs` (status=completed) → run them through the Stage-9 PUT path. Catches any webhook the live trigger missed. Throttle (Sleep) to respect 180/min.

---

## SMOKE-TESTS (before any real customer)
1. **Link present:** drag a test opp to Stage 11 → confirm the `sm8_jobs` row has `sm8_job_uuid` populated (the field back-sync searches on).
2. **Webhook + 200-in-time:** change a test job's status → Make run starts, [2] returns 200, SM8 log shows success (no timeout).
3. **Re-GET:** [4] pulls live `status=Completed` + `generated_job_id` (proves UUID-only payload expanded).
4. **Match:** [7] finds the opp_id from the index.
5. **Happy path (crux):** set test job → Completed → GHL opp moves to Stage 15 within ~30s, the `sm8_jobs` row `status` = completed.
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

## Multi-contractor / multi-part jobs — LOCKED 2026-06-08 · UPDATED to FULLY-AUTOMATED 2026-06-08 (Allan's call)
**ONE SM8 job per customer job** (NOT two). Multi-trade work (e.g. glass-panel sub + resurface sub; or a hotel = 20 sinks / 3-4 subs) = N **`job_assignments` in the contractor app**, one per sub/part. **Completion = FULLY AUTOMATED — NO manual gate:** each sub self-completes THEIR part in the app, **gated by required before/after photos** (the photos are the evidence). When the LAST part completes — the app's live-assignment count for the job hits 0 — the **app auto-flips the SM8 job to `Completed`** → the existing Make Back-sync (this scenario) fires → GHL Stage 15. **Scenario 3 is UNCHANGED.** No Marko manual close (Allan: doesn't scale — endless follow-ups). **Risk bound:** the per-part photo-gate makes "done" require proof, and the customer **invoice is still sent by hand via Xero** (human-in-loop at the money step), so a premature stage-15 at worst fires an early cure/NPS text. **Dependency:** the per-sub roll-up lives in the contractor app (`/complete` checks live-count = 0) — SM8 alone can't track partial completion, so this is an app-phase capability; single-sub jobs already auto-complete today. Two sub payouts = one Xero supplier bill per sub + one aggregate `Sub Payout Status`. *(SUPERSEDES the earlier same-day "Marko final gate" version — Allan chose full-auto 2026-06-08.)*

## Sources
expert-make-automation-engineer build + Cleo adversarial verify (2026-06-07). SM8 webhooks: developer.servicem8.com (object subscription, 2xx/10s, 72h cancel, challenge, 410/429). GHL: marketplace.gohighlevel.com Update-Opportunity (PUT /opportunities/:id, deprecated → fallback /status). Patterns reused from `make-scenario-1-{main,safety}-build.md`.
