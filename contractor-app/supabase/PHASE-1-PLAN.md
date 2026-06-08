# Contractor App — Supabase Backend, Phase 1 (Secure Read Path) — BUILD PLAN

**Status:** vetted 2026-06-08 — **both CEOs (Clifford + Cleo) + a security architect converge.** This is the canonical Phase-1 build spec. Sources: Cleo `/tmp/cleo-backend-phase1-2026-06-08-out.txt`, architect agent, `contractor-app-blueprint-2026-06-05.md` (§3/§5/§7/§8), `decision-sm8-keep-vs-build-2026-06-05.md` (no-contact), `0001_init_schema.sql`, `web/src/lib/api.ts`.

**Scope:** the **secure READ path only** — Supabase up · migration `0001` · SM8 key as Edge secret · authed SM8 `GET` · contact-filtered webhook receiver · **contact-leak CI that fails the build.** NO per-sub Auth/RLS policies (Phase 2), NO accept/decline (Phase 3), NO photos/push (Phases 4–5). This is the blueprint's "thinnest spine slice": prove **key-isolation + contact-filter** before any UI wiring.

## The 3 security non-negotiables (the build is GO only if all 3 hold)
1. **No SSRF on the webhook re-GET.** SM8 webhooks send only `{object, uuid, changed_fields, resource_url}` — we must re-fetch the job. **NEVER blindly fetch `resource_url`** (a spoofed webhook could point our authed fetch at an attacker host → leak the SM8 key). Mitigation: **reconstruct the URL from the validated UUID** (`https://api.servicem8.com/api_1.0/job/${uuid}.json`); if using `resource_url`, hard-assert `protocol==='https:' && hostname==='api.servicem8.com'` before attaching `X-API-Key`. *(Cleo + architect both rank this the #1 risk.)*
2. **Allowlist contact-filter, one chokepoint.** `_shared/contactFilter.ts → sm8JobToMirror()` is the ONLY code that builds a `job_mirror` row. It copies an **explicit allowlist** (never `...raw`, never a denylist). Customer `phone`/`email`/`mobile`/`jobcontact` are **never read**. Plus the destination `job_mirror` has **no contact columns** (physical guarantee). Plus `stripContact()` scrubs `scope`/`job_description` (defence-in-depth — makes us leak-proof even before the Make strip-contact change ships).
3. **Never return `410` to SM8.** `410` instantly unsubscribes the webhook. `webhooks-sm8` returns **`200` on every processing path** (validate → 200 → process async); failures go to `audit_log` for the reconcile poll. (Auth failure = `401`, not 410.)

## Architecture — Edge Functions (`supabase/functions/`)
| Function | Phase 1 | Job | Auth |
|---|---|---|---|
| **`webhooks-sm8`** | 🟢 LIVE | The centrepiece. SM8 Object-Webhook receiver → verify shared-secret → dedup → **return 200 ≤10s** → (waitUntil) re-GET job by UUID → `sm8JobToMirror` → upsert `job_mirror`. | shared-secret (`SM8_WEBHOOK_SECRET`); `verify_jwt=false` |
| **`sm8-get-job`** | 🟢 LIVE | Internal probe: prove the X-API-Key path + filter end-to-end. Returns the **filtered** mirror shape, never raw SM8. | admin token (`ADMIN_PROBE_TOKEN`) |
| **`my-jobs`** | ⚪ stub→Phase 2 | Read adapter for `ContractorApi.getAvailableJobs/getBookedJobs/getJobDetail/getProfile`. Reads `job_mirror`+`job_assignments`. Returns `501` now. | per-sub JWT+RLS (Phase 2) |
| **`job-actions`** | ⚪ stub→Phase 3 | accept/decline/availability/handback/complete/problem + SM8 write-back. `501` now. | per-sub JWT |
| **`reconcile`** | ⚪ stub→Phase 5 | pg_cron poll of stale jobs + re-arm dead webhook subs (72h auto-cancel safety). `501` now, wired to a disabled schedule. | service-role |

*Scaffold all 5 now* so the contact-leak CI's endpoint inventory is complete from day one. **Shared:** `_shared/{sm8Client, contactFilter, cors, dedup, respond}.ts`.

**Auth posture:** Phase 1 = **service-role Edge Functions only** (migration `0001` has RLS enabled + zero policies → client can't touch the DB by design). Per-sub JWT + RLS policies = Phase 2. **No real sub uses this until Phase 2 + the legal gate clears.**

## Contact-filter allowlist (the ONLY fields copied SM8 job → `job_mirror`)
`sm8_job_uuid · generated_job_id · customer_name` (name only) `· job_address · job_category · scope` (stripContact'd) `· required_photos` ([] in P1) `· sm8_status · sm8_queue_uuid · last_synced_at`.
**Never read:** `phone, mobile, email, customer_phone, customer_email, jobcontact, contacts, billing_*, client.email/phone`, raw SM8 JSON.

## Contact-leak CI (required check; build-blocking)
- **Layer A (unit):** feed `sm8JobToMirror()` poisoned fixtures (with mobile/email/jobcontact/"call 0451 110 154") → assert serialized output matches **no** email regex `/[\w.+-]+@[\w.-]+\.\w{2,}/`, **no** AU-phone regex `/(\+?61|0)[\s-]?4?\d[\s-]?\d{3}[\s-]?\d{3,4}/`, **no** forbidden keys; assert name/address/scope survive.
- **Layer B (endpoint):** local `supabase functions serve` + seeded poisoned mirror → scan every sub-facing response with the same regexes; assert `webhooks-sm8` returns **200 (never 410)** for valid/unknown-UUID/malformed/re-GET-fail.
- **CI:** `.github/workflows/contractor-backend.yml` (deno fmt/lint/test + `supabase start` integration) — **required**, non-zero = PR fails. (Repo has no CI yet; this establishes it.)

## Secrets (Edge secrets ONLY — never DB/client/logs/git)
`SM8_API_KEY` (the live SM8 key, currently `.secrets/servicem8.key`) · `SM8_WEBHOOK_SECRET` (random 32+) · `ADMIN_PROBE_TOKEN` (random) · `SUPABASE_SERVICE_ROLE_KEY` (auto-injected). Client (`web/`) gets ONLY `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (anon is RLS-gated, public-safe). One `respond.ts` error shaper → generic codes, never echoes SM8 bodies/headers/stack.

## Build steps
**Allan provisions (Supabase dashboard/CLI — A1–A4 block Clifford):**
1. Create project — **Sydney `ap-southeast-2`**. *(Free is fine for the build — no real subs yet/legal gate; flip to Pro before go-live. The architect recommends Pro now for a "live field app" — it isn't live yet, so Free saves $25/mo during the build.)* Record Project Ref + URL + anon + service-role keys (→ `.secrets/`, NOT chat/git).
2. `supabase secrets set SM8_API_KEY=…` (from `.secrets/servicem8.key`) · `SM8_WEBHOOK_SECRET=…` · `ADMIN_PROBE_TOKEN=…`.
3. Confirm the SM8 key is NOT in DB settings / client env / Vercel env / repo.
4. Give Clifford the project ref + `SUPABASE_ACCESS_TOKEN` (or run `supabase link`).
5. *(after Clifford deploys `webhooks-sm8`)* SM8 → create Object Webhook on `job` (fields status/queue_uuid/active) → callback = the deployed function URL + the shared secret. *(If SM8's UI can't send a custom header secret, note SM8's source IP range → Clifford adds an IP allowlist.)*
6. *(verify)* change a job's status in SM8 → confirm a name+address-only `job_mirror` row appears.

**Clifford codes (after A1–A4):**
1. Scaffold `supabase/config.toml` + functions + `_shared` + `_tests` + `import_map.json` (`verify_jwt=false` for webhooks-sm8/sm8-get-job).
2. `supabase db push` migration `0001`; confirm 6 tables + enums + index + RLS-on-no-policies.
3. **`contactFilter.ts` first** (the security core) — allowlist + `stripContact` + `scrubPii`.
4. `sm8Client.ts` — Edge-secret key, X-API-Key GET `job/{uuid}.json`, **SSRF host-validate**, `withBackoff` (never retry 4xx).
5. `cors.ts` (sub-facing = only `jobs.timelessresurfacing.com.au` + `localhost:3000`; webhook = no CORS) · `dedup.ts` · `respond.ts`.
6. `sm8-get-job` (LIVE, token-gated) · `webhooks-sm8` (LIVE — secret → dedup → **200 immediately** → waitUntil re-GET→filter→upsert; **never 410**).
7. Stub `my-jobs`/`job-actions`/`reconcile` (`501`; reconcile → disabled pg_cron).
8. `_tests/contact-leak.test.ts` (Layer A + B) + `.github/workflows/contractor-backend.yml` (required) + `test.sh`.
9. Deploy; hand Allan the `webhooks-sm8` URL (→ step A5). Verify e2e + grep new row/response for `@`/phone = zero hits.

## Phase-1 exit criteria
- Migration `0001` applied (RLS on, no policies). · `SM8_API_KEY` only as an Edge secret (repo+bundle+DB grep = 0 hits). · `sm8-get-job` returns a contact-filtered job via X-API-Key. · `webhooks-sm8` writes a contact-clean `job_mirror` row, responds 200 ≤10s, **never 410** on failure. · Contact-leak CI **green + required** — and demonstrably **red** if a contact column/field is added (verify once by breaking it).

## Deferred (justified) vs blueprint
Full pgmq rate-governor → Phase 4 (P1 is read-only; `withBackoff` + 2s same-UUID debounce suffices). Per-sub JWT+RLS → Phase 2. 2-step photo attach → Phase 4. `stripContact` on scope makes P1 **path-independent** of the Make strip-contact change.
