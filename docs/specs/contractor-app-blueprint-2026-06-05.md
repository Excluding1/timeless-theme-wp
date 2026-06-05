# Contractor-View App — BUILD BLUEPRINT (Path B)

**Status:** READY-TO-EXECUTE. Architect-produced 2026-06-05 (verified vs 2026 SM8 + Supabase + PWA docs). **Scheduled LAST** — built AFTER the internal backbone (Make/GHL/SM8/Slack/deploy) per Allan's 2026-06-05 resequence. Read with `decision-sm8-keep-vs-build-2026-06-05.md` (§VIABILITY STUDY).

**Scope:** React PWA giving subs a NAME+ADDRESS-only view of *offered* jobs, real ACCEPT/DECLINE (right of refusal), before/after photo capture, complete/problem actions — all mediated by OUR backend (sole SM8 key-holder). SM8 = system of record; app = view + action layer.

## 3 non-negotiable realities that force the design
1. **SM8 webhooks send only `{object, uuid, changed_fields}` — never the object** → backend must re-GET on every fire; subscriptions **auto-cancel after 72h of failures (410 = instant unsubscribe)** → **polling fallback is mandatory.**
2. **SM8 rate limit = 180/min + 20k/day (HTTP 429)** → backend needs a queue + throttle + backoff; photo bursts (2 calls/photo) are the spike.
3. **iOS PWA: no Background Sync, ~50MB cache, evicts storage when idle** → photo upload must be a **resumable foreground queue** (never assume a backgrounded upload finishes).

## 1. TECH STACK — LOCKED
| Layer | Choice | Why |
|---|---|---|
| Frontend | **React PWA — Vite + `vite-plugin-pwa` (Workbox)** | logged-in field tool, no SEO/SSR → Next is dead weight; Vite + PWA plugin = installable + offline precache OOTB |
| Backend | **Supabase** — Postgres + Auth(JWT) + Edge Functions(Deno) + **pgmq** + **pg_cron** | one box = auth, assignment DB+RLS, SM8 token-broker, rate-governor queue (pgmq), polling scheduler (pg_cron). No separate infra |
| Pattern | **BFF / token-broker** — Edge Functions are the ONLY code that sees the SM8 key | SM8 key = full-account, no per-sub scoping → server-side only, never on a phone. Stored as Supabase Edge **secret** |
| Push | **Web Push + VAPID via FCM HTTP v1** | iOS 16.4+ web push for installed PWAs (AU fine) |
| Hosting | **Vercel** (static PWA) + **Supabase** (backend) | CDN + auto-HTTPS; zero servers to patch |
| SMS fallback | **Reuse existing Make + (later) Twilio** — no new SMS stack | push-first; SMS = offer fallback. Day 1 = the Make "job assigned → SMS sub" scenario |

**iOS offline-photo handling:** capture → IndexedDB resumable queue (blob + job id + before/after + idempotency key) → drains on focus/online while app is OPEN → uploads to Supabase Storage first → a server-side worker does the SM8 2-step attach (decoupled from "complete"). Persistent "N photos waiting — keep app open" banner. Escape hatch: thin FlutterFlow/native capture wrapper ONLY if real testing shows iPhone offline photo loss.

## 2. PHASE PLAN (~3–4 weeks, AI-assisted)
**Thinnest spine slice first:** real SM8 job → webhook → backend mirrors (name+address only) → sub logs in → sees 1 job → taps **Accept** → backend flips assignment + moves SM8 queue/badge so Marko sees it. No photos/push/offline. Proves key-isolation + contact-filter + custom accept + SM8 write-back.

| Phase | Done = | Effort |
|---|---|---|
| **1. Foundation** | Supabase up; schema migrated; SM8 key as Edge secret; **Make strip-contact change shipped (§8)**; Edge Fn does authed SM8 `GET job.json`; webhook subscription → receiver re-GETs → writes `job_mirror` (contact filtered). Read path live. | 2–3 d |
| **2. App core** | Vite PWA installable; Supabase Auth (per-sub login); `GET /my/jobs` + detail w/ RLS; list + detail UI (name, address, map link, scope, photo checklist) | 3–4 d |
| **3. Accept/Decline (spine)** | state machine (§6); `/accept` `/decline`; audit_log; SM8 badge/queue mirror; decline re-routes; Fair-Work guardrails | 4–5 d |
| **4. Photos + Complete** | resumable IndexedDB→Storage; server worker does SM8 2-step attach via rate governor; `/photos` `/complete` `/problem` | 4–6 d |
| **5. Notifications** | Web Push (VAPID/FCM) on `offered`; Make SMS fallback; rate governor + polling fallback hardened (pgmq + pg_cron) | 3–4 d |
| **6. Test + Security** | E2E matrix; **automated contact-leak assertion** (no sub endpoint ever returns phone/email → fail build); webhook dedup/replay; rate-limit soak; JWT/RLS check; Fair-Work copy review | 3–4 d |

*Standing rec: prove on Path A / ~10 real jobs OR build Phase 1–3 in parallel so the UI is built against real workflow. Phase 1 (Make strip-contact + read path) is path-independent — worth doing as part of the internal backbone NOW.*

## 3. ALLAN SETUP CHECKLIST (in order, when we reach the app phase)
1. **Supabase project** (Sydney `ap-southeast-2`, **Pro $25/mo** — Free pauses when idle = unacceptable for a live field app) — the whole backend.
2. **Store SM8 key as Supabase Edge secret** (`supabase secrets set SM8_API_KEY=…`) — sole server-side home; never a DB row/client.
3. **Firebase project + Cloud Messaging + VAPID key pair** — push delivery.
4. **Subdomain `jobs.timelessresurfacing.com.au`** (DNS CNAME → Vercel) — PWA install target, isolated SW scope.
5. **Vercel project** → frontend repo + subdomain.
6. **Authorize the Make strip-contact change (§8)** — removes leak at source.
7. **(at scale) Twilio** for masked proxy calls.
8. **Agree the SM8 "Accepted/Declined/Re-offer" queue+badge convention with Marko** — the accept/decline state has no SM8 API, so we mirror it via queue/badge for his dispatch board.

## 4. DATA MODEL (Postgres/Supabase) — key rule: `job_mirror` physically has NO contact columns
```sql
create table subs ( id uuid pk default gen_random_uuid(), auth_user_id uuid unique references auth.users(id),
  full_name text not null, abn text, pl_insurance_expiry date, pl_insurance_verified bool default false,
  zone text, skills text[] default '{}', tier text default 'standard', active bool default true, created_at timestamptz default now() );

create table job_mirror ( sm8_job_uuid uuid pk, generated_job_id text, customer_name text,   -- NAME ONLY
  job_address text, job_category text, scope text, required_photos jsonb default '[]',
  sm8_status text, sm8_queue_uuid uuid, last_synced_at timestamptz, created_at timestamptz default now() );
  -- NO customer_phone, NO customer_email — ever (absence + CI leak-test).

create type assignment_status as enum ('offered','accepted','declined','in_progress','completed','expired','reoffered','cancelled');
create table job_assignments ( id uuid pk default gen_random_uuid(), sm8_job_uuid uuid not null references job_mirror,
  sub_id uuid not null references subs, status assignment_status not null default 'offered', offer_seq int default 1,
  offered_at timestamptz default now(), accepted_at timestamptz, declined_at timestamptz, decline_reason text,  -- OPTIONAL, never required
  completed_at timestamptz, expires_at timestamptz, created_at timestamptz default now() );
create unique index one_live_assignment_per_job on job_assignments (sm8_job_uuid) where status in ('offered','accepted','in_progress');

create type photo_upload_status as enum ('queued','uploaded','attaching','attached','failed');
create table photos ( id uuid pk default gen_random_uuid(), sm8_job_uuid uuid not null references job_mirror, sub_id uuid not null references subs,
  kind text not null, slot text, storage_path text, sm8_attachment_uuid uuid, upload_status photo_upload_status default 'queued',
  client_idem_key text unique, created_at timestamptz default now() );

create table audit_log ( id bigint generated always as identity pk, actor_type text not null, actor_id uuid, action text not null,
  sm8_job_uuid uuid, detail jsonb, created_at timestamptz default now() );  -- scrub PII; never log phone/email
```
**RLS:** assignments/photos → `sub_id = auth.uid()`'s sub; `job_mirror` readable only via join to the requesting sub's assignment; SM8 writes + contact filter only in service-role Edge Functions.

## 5. API CONTRACT (Edge Functions; auth = per-sub JWT; contact filter applied on every SM8 read)
| Endpoint | Does | SM8 call(s) |
|---|---|---|
| `GET /my/jobs` | this sub's assignments + mirror | none (reads mirror) |
| `GET /my/jobs/{id}` | job detail (name/address/scope/photo checklist/status) | optional `GET job.json` refresh → **strip contact** |
| `POST .../accept` | offered→accepted; SM8 queue/badge→"Accepted"; audit | `POST job.json` |
| `POST .../decline` | offered→declined (silent, no penalty, reason optional); re-route | `POST job.json` →"Re-offer" |
| `POST .../photos` | accept Storage ref; **enqueue** SM8 2-step attach on pgmq | enqueued (governor drains) |
| `POST .../complete` | require photos; in_progress→completed; SM8 `status:Completed` | `POST job.json` |
| `POST .../problem` | flag Job Issue; alert Marko | `POST job.json` |
| internal `POST /webhooks/sm8` | shared-secret+dedup; re-GET job; write mirror (filtered); push to sub | `GET job.json` |
| internal pg_cron reconcile | poll stale jobs + re-arm dead subscriptions (72h auto-cancel safety) | `GET job.json` throttled |

**Contact filter:** allowlist-map SM8 job → mirror copying only `{uuid, generated_job_id, customer_name, job_address, category, description→scope, status, queue}`. Drop `jobcontact/mobile/email/phone`. CI asserts no sub-facing JSON contains `@` or phone pattern.

## 6. ACCEPT/DECLINE STATE MACHINE (the one piece we truly build — no SM8 API)
`OFFERED → (accept) ACCEPTED → (start) IN_PROGRESS → (complete) COMPLETED`; `OFFERED → (decline, silent/no-penalty) DECLINED → REOFFERED (next sub)`; `OFFERED → (TTL) EXPIRED → REOFFERED`; no sub left → back to Marko's manual queue. Each transition mirrors to SM8 via **queue/badge move** so Marko sees it.
**Fair-Work guardrails (s15AA) baked in:** NO auto-assign (system offers, never silently allocates) · decline = silent + **zero penalty** (no counter, no gating, no coaching-trigger in code; reason optional) · re-route not re-assign · real delegation/hand-back path · offer-language UI ("New job available — Accept/Decline") · compliance gate (own ABN + ≥$10M PL) before any offer · no @company-email/uniform/"our team" for subs.

## 7. SM8 INTEGRATION
- **Webhooks:** Object webhook on `job` (fields `status`, `queue_uuid`, `active`) → `POST /webhooks/sm8`. Don't depend on flaky `job.created` (our Make creates the job → Make notifies backend / backend mirrors at offer time). Callback returns 200 ≤10s, re-GETs `resource_url`. pg_cron reconcile re-arms dead subs.
- **Photos (2-step):** ① `POST Attachment.json {related_object:"job", related_object_uuid, attachment_name, file_type:".jpg", active:1}` → capture `x-record-uuid`; ② `POST Attachment/{uuid}.file` raw multipart. Both via the governor.
- **Complete:** `POST job.json {status:"Completed", completion_date}` → feeds the existing Make Back-sync (SM8 Completed → GHL stage 15).
- **Rate governor:** all SM8 writes → pgmq → one drainer (pg_cron, token-bucket ≤150/min, daily <20k) + exp-backoff on 429/5xx (never retry 4xx) + webhook re-GET debounce (coalesce same job uuid in 2s) + pg_cron polling fallback.

## 8. THE MAKE CHANGE (Scenario 1 — internal-backbone item, do as part of finishing Make; path-independent)
Goal: customer phone/email **never lands on the SM8 job**.
1. **Delete the `Add Job Contact` module** (`POST jobcontact.json` — the thing that puts customer mobile/email on the job). *(Supersedes the v1 "on-my-way SMS off Job Contact" plan — customer comms move to GHL/Twilio.)*
2. **Strip contact from `job_description`** in Create SM8 Job: `{{full_name}}` + scope + GHL deep-link only (no `{{phone}}`/`{{email}}`).
3. **Keep** name + address + category + queue.
4. **Customer comms → GHL/Twilio** (keyed off the GHL opp, not an SM8 Job Contact). Find-or-create still attaches the *client* for invoicing (internal/Marko-only, never sub-facing).
5. **Access gap:** Marko relays now / masked proxy number at scale.

## Auditor lenses (architect)
Security ✅ (key in Edge secrets only; per-sub JWT+RLS; mirror has no contact cols + outbound filter + CI leak-test; audit scrubs PII) — residual: single full-access SM8 key → rotation runbook. Webhook-integrity ✅ (re-GET, polling-fallback first-class for 72h auto-cancel, debounce, idempotent, dedup). General-operational ✅ (one platform; reuse existing plumbing; thin-slice-first) — SPOF: Supabase + SM8 key (mitigated by SLA + reconcile loop + manual SM8-app fallback). Fair-Work ✅ (structurally offer-not-order, no-penalty decline, ABN/PL gate).

## Sources
ServiceM8 dev docs (webhooks-overview, attachments 2-step, http-response-codes/rate-limits, object-webhook) · Supabase (pricing, Edge Functions, pg_cron, queues) · vite-plugin-pwa · FCM HTTP v1 · PWA-iOS-limitations-2026.
