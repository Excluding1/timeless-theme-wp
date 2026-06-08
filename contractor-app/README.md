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
- [ ] **1. Foundation** — Supabase up · schema migrated (`supabase/migrations/0001_init_schema.sql` ✅ written) · SM8 key as Edge secret · Edge Fn does authed SM8 `GET job.json` · webhook receiver re-GETs → writes `job_mirror` (contact-filtered). *Read path live.*
- [ ] **2. App core** — Vite PWA installable · Supabase Auth (per-sub login) · `GET /my/jobs` + detail w/ RLS · list+detail UI
- [ ] **3. Accept/Decline (spine)** — state machine · `/accept` `/decline` · audit_log · SM8 badge/queue mirror · Fair-Work guardrails · **multi-sub: N assignments per job**
- [ ] **4. Photos + Complete** — resumable IndexedDB→Storage · server worker SM8 2-step attach via rate governor · `/complete` (with the **all-parts-done roll-up** → SM8 Completed) · `/problem`
- [ ] **5. Notifications** — Web Push (VAPID/FCM) on `offered` · Make SMS fallback · pgmq + pg_cron rate governor + polling fallback
- [ ] **6. Test + Security** — E2E · **automated contact-leak assertion (no sub endpoint ever returns phone/email → fail build)** · webhook dedup/replay · rate soak · JWT/RLS · Fair-Work copy review

## Allan setup checklist (in order)
1. **Supabase project** — Sydney `ap-southeast-2`, **Pro $25/mo** (Free pauses when idle = unacceptable for a live field app). ← **DO THIS FIRST**
2. SM8 key as Supabase Edge secret (`supabase secrets set SM8_API_KEY=…`).
3. Firebase project + Cloud Messaging + VAPID pair (Phase 5).
4. Subdomain `jobs.timelessresurfacing.com.au` (DNS CNAME → Vercel) (Phase 2+).
5. Vercel project → frontend (Phase 2+).
6. Make strip-contact change — ✅ already done.
7. Agree the SM8 Accepted/Declined/Re-offer queue+badge convention with Marko (Phase 3).
