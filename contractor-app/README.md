# Timeless Resurfacing — Contractor App

**Status:** 🔨 BUILDING (pulled forward 2026-06-08). The sub-facing PWA: subs see **name + address only** of offered jobs, accept/decline, capture before/after photos, complete. Our backend is the **sole ServiceM8 key-holder** (subs never touch the key). SM8 = system of record; this app = view + action layer.

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
