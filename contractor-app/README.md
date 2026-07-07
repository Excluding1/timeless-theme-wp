# Timeless Resurfacing — Contractor App

**Status:** 🔨 BUILDING (pulled forward 2026-06-08). **A COMPLETELY SEPARATE, FRESH app for subcontractors** — its own codebase, Supabase project, and subdomain. NOT the `dashboard/` app (that's the CEO/admin tool with business/personal info — fully walled off; subs never see it). Our backend is the **sole ServiceM8 key-holder** (subs never touch the key). SM8 = system of record; this app = view + action layer.

## v1 FEATURE SET — LOCKED 2026-06-08 (both CEOs + research panel: competitor benchmark + our-pipeline/Jordan/NSW-compliance)
**Principle (Cleo's warning): this is NOT a workforce-management app.** It does **6 things** — see the offer · accept/decline without pressure · say when they can do it · get there · prove the work · escalate exceptions. Nothing else.

**The sub flow (the whole app):**
1. 🔔 **Push** "New job available" (+ SMS fallback).
2. 📋 **Job card:** photos · scope · address · category · **their pay** — NO customer phone/email.
3. ✅ **Accept** = a clear button → confirm sheet ("Accept this job?") + 5-sec **Undo** snackbar (**RESOLVED 2026-06-08:** button+confirm chosen over slide-to-accept — simpler/more familiar for a tradie; the non-negotiable is *never a bare single tap that commits*) · OR **Decline** (one tap, penalty-free, reason optional). **NO countdown timer** (gig-style timers cause panic-taps).
4. 🗓️ On accept → **submit ONE availability window** → Marko confirms the time.
5. 📋 Booked job → **"My Jobs"** list (today/upcoming) with date+time. *(NO `.ics` in v1 — Cleo cut it: update/cancel/timezone edge-cases aren't worth it. Native "Add to Calendar" = v2 nice-to-have.)*
6. 🧭 **Navigate** → deep-link to Maps.
7. 📸 On the day → **Before/After photos** (labelled slots) on a **resilient offline retry queue** (reception drops on-site — uploads must NEVER be lost) → **per-SKU minimum HARD-GATED** (can't complete without them; photos = quality + payment evidence, Clause 7).
8. ✅ **"Mark my part done"** → last part done → whole job **auto-completes** → Make back-sync → GHL Stage 15.
9. ⚠️ **"I have a problem"** → TYPED reason {no-access · **asbestos / pre-1990** · scope-bigger-than-quoted · substrate-damage} + mandatory photo → alerts Marko + **STOPS** progression. NEVER a "call customer" button (Marko relays).

**Pre-offer gate (backend, not in-app):** ABN present + **≥$10M PL verified + not expired** (+ asbestos cert for pre-1990) — a non-compliant sub is never in the offer pool (guardrail A7).

**CUT from v1 (deliberate — don't overload the sub):** customer contact · quoting/pricing/margin · invoicing/payment/payslip · time-clock/timesheet/roster · live 2-way calendar sync · `.ics` (v1) · decline-rate dashboard · SM8 fallback view · blank SWMS form · in-app chat.

**SWMS:** DEFERRED for v1 — bathroom resurfacing is NOT high-risk-construction by default; the asbestos STOP-flow (step 9) covers the danger. LATER = pre-filled, **badge-gated** (Pre-1990/Asbestos jobs only) review + e-sign, never blank.

**Multi-day jobs (FBP-class, 2-day):** Day1/Day2 phasing — Day 2 locked until Day 1 photos uploaded (Clause 31 continuity).

**Fair-Work in the UX (binding — guardrails A1–A9):** offer-language ("available", never "assigned/rostered") · decline = silent + zero penalty (no counter/score/quota in code; reason optional) · re-route never re-assign · no clock-in/timesheet/roster · **"Decline" (free) ≠ "Cancel after accept"** ($100 — customer's booked) · no "our team"/uniform/@company-email identity.

**Jordan alignment (Cleo, evidenced):** MIRROR — jobs visible in one place (his subs "weren't seeing jobs clearly" via SMS/email, `all-transcripts-2026-04-30.md:71`); system-matched by location/skill/availability (`:286`); before/after photos matter operationally (`:428`). DIVERGE (deliberate, our frame) — do NOT mirror the 15-stage pipeline / margin/pricing / payments / SM8-fallback UI in the sub app; one clean contractor surface.

**Canonical design:** `../docs/specs/contractor-app-blueprint-2026-06-05.md` (architect-produced + panel-verified). This README tracks BUILD progress.

## Stack (locked)
- **Frontend:** React PWA — Vite + `vite-plugin-pwa` (Workbox) → `/web`
- **Backend:** Supabase — Postgres + Auth(JWT) + Edge Functions(Deno) + pgmq + pg_cron → `/supabase`
- **Pattern:** BFF / token-broker — Edge Functions are the ONLY code that sees the SM8 key (Supabase Edge secret)
- **Push:** Web Push + VAPID via FCM HTTP v1 · **Hosting:** Vercel (PWA) + Supabase (backend)

## Build phases (~3–4 wk, AI-assisted)
- [x] **1. Foundation** — ✅ **DEPLOYED LIVE 2026-06-09** (`84a88f2`) — Supabase up · schema migrated · SM8 key as Edge secret · authed SM8 `GET job.json` · webhook receiver re-GETs → writes `job_mirror` (contact-filtered). *Read path live + verified e2e.*
- [x] **2. App core** — ✅ **DEPLOYED 2026-06-09** (`d7bb48e` backend + `59ee0ba` frontend) — PWA installable · per-sub Auth + RLS · `my-jobs` + detail · real login + real jobs proven.
- [x] **3. Accept/Decline (spine)** — ✅ **DEPLOYED 2026-06-09** (`ba71db1`) — accept/decline/availability/handback/complete state machine, ownership-isolated, Fair-Work guardrails. ⏳ Residual: **accept→SM8 queue-move write-back** waits ONLY on Marko's "which queue = booked" taxonomy.
- [x] **4. Photos + Complete** — ✅ **SM8 write-back LIVE 2026-06-09** (`7762bf4`: complete→SM8 Completed, atomic RPC + durable outbox + reconcile drain).
- [x] **5. Notifications** — ✅ **CODE-COMPLETE 2026-07-07** (`fe1bfb8`) — Web Push (VAPID) subscribe flow + service-worker `push`/`notificationclick` handlers + `push_subscriptions` table (migration `0006`) + send-push Edge Function. **Only remaining = Allan's console step: mint the VAPID key pair** (checklist #3) and set it as an Edge secret. Make→Twilio SMS stays as the interim/fallback path.
- [x] **5b. Masked job-chat relay + ETA** — ✅ **CODE-COMPLETE 2026-07-07** (`62cb11c`, migration `0007`) — `JobChat.tsx` preset-first chat (one-tap chips) + "On my way" ETA picker (15/30/45/60 min); DB guards: contact-leak block (phone/email, both directions), 10/hour + 30/day rate limit, per-job `chat_enabled` kill switch. Customer↔worker via GHL number ↔ Make ↔ app; nobody sees a number. Serves subs AND future employees (see `docs/specs/booking-coordination-plan-2026-07-07.md`). **Remaining = 2 GHL workflows + 2 Make scenarios** per the relay contract below.
- [x] **6. Test + Security** — ✅ **RLS hardening applied 2026-07-07** (`0008_rls_hardening.sql`): tightened per-sub ownership policies, storage-bucket access, message insert constraints. Contact-leak CI assertion in place. **Remaining before first real sub (legal-gated):** final E2E soak · webhook dedup/replay soak · Fair-Work copy review.

## Allan setup checklist (in order)
1. **Supabase project** — Sydney `ap-southeast-2`, **Pro $25/mo** (Free pauses when idle = unacceptable for a live field app). ← **DO THIS FIRST**
2. SM8 key as Supabase Edge secret (`supabase secrets set SM8_API_KEY=…`).
3. **VAPID key pair for push** (Phase 5, ~5 min): `npx web-push generate-vapid-keys` → set `VAPID_PUBLIC_KEY` in the web build env + `VAPID_PRIVATE_KEY`/`VAPID_SUBJECT` as Supabase Edge secrets. Code is done; this is the only push step left. (Firebase FCM is an alternative to raw VAPID if preferred.)
4. Subdomain `jobs.timelessresurfacing.com.au` (DNS CNAME → Vercel) (Phase 2+).
5. Vercel project → frontend (Phase 2+).
6. Make strip-contact change — ✅ already done.
7. Agree the SM8 Accepted/Declined/Re-offer queue+badge convention with Marko (Phase 3).

## Masked chat relay contract (for the GHL + Make build, later)

The app side is DONE. To go live, wire these (customer never sees the worker's number, worker
never sees the customer's — see `docs/specs/booking-coordination-plan-2026-07-07.md`):

**Inbound (customer SMS → app):**
1. GHL workflow, trigger "Customer Replied" (SMS), filter: contact has an active job tag.
2. → webhook to Make with `{ contact_id, message_body }`.
3. Make resolves the contact's current `sm8_job_uuid`, then INSERTs into `job_messages`:
   `{ sm8_job_uuid, sender: 'customer', kind: 'chat', body: message_body }`.
   The DB trigger strip/blocks any phone/email in `body` automatically.

**Outbound (worker reply → customer SMS):**
4. Make subscribes to new `job_messages` rows where `sender = 'sub'` (Supabase Realtime or a
   webhook on insert; index `job_messages_outbound` exists for polling).
5. → GHL API "send SMS" from the business number to the job's customer contact.
6. **Priority:** rows with `kind = 'eta'` relay IMMEDIATELY (the "on my way" promise).

**Never:** put a customer phone/email into any Make step that reaches the worker; the app only
ever exposes job + suburb + first name. Test the leak-block by trying to send a number in chat.
