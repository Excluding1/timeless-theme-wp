# Timeless Resurfacing — FINALIZATION ROADMAP (canonical tracker)

**Created:** 2026-06-07 · **Owners:** Allan (CEO) + Marko (ops) · **Authors:** Clifford + Cleo (co-CEOs) from a 4-expert + 2-CEO panel.
**Status:** ACTIVE. This supersedes `cockpit/data/tasks.json` as the human-readable finalization tracker (the board mirrors it).
**Goal:** every system built, tested, and working together — *Surface Care quality for our context* — so we can run real jobs end-to-end with nothing pending. Last step = a full deep audit.

Owner tags: 🟦 Allan (accounts/credentials/clicks) · 🟩 Marko (ops decisions) · 🟨 Clifford-via-expert (build/config). **★ = critical path to first paying job.**

---

## 0. COHERENCE VERDICT — do we have Surface Care quality?
**YES — same spine as Jordan, three deliberate divergences, gaps are execution not design.**
- **Match Jordan 1:1:** GHL (lead/customer brain) · ServiceM8 (field dispatch) · Make (automation glue) · contractor app (job visibility) · BigQuery (data brain) · hyper-relevant landing pages.
- **Deliberate divergences (our context; NOT proven Jordan practice — honesty per Rule 6):** ① no customer contact to subs (anti-poaching) · ② custom accept/decline in our app · ③ single-account-via-app (subs ≠ SM8 seats).
- **Trim / don't gold-plate before job #1:** not all 140 SM8 SKUs · not all 12 GHL workflows · no BigQuery-heavy/AI agents yet. Minimum-viable per phase; the rest trail.
- **7 gaps to fix/add (all below):** dead-stub form · no Make dedup safety · strip-contact not live · no customer-comms layer · privacy sub-disclosure missing · legal gate · manual-recovery SOPs.

## Locked micro-decisions
- **SM8 `job_description` = NAME + SERVICE CATEGORY only** (Option B). No phone/email (no-contact rule). The GHL opp cross-ref lives in the Sheet (opp_id↔sm8_job_uuid), not on the sub-facing job. Category also shows natively via `category_uuid`; the text is explicit backup.

---

## ✅ DONE (verified live)
GHL paid + **15-stage Sales pipeline live** · 6 Slack channels · **Stripe + Xero live** · **SM8: 6 categories + ACT queue + write-path proven** (real Job #8, HTTP 200/errorCode 0) · Make Scenario 1 **core + safety + data-capture built** (fired a real SM8 job; secret-gate + opp_id dedup + Slack errors + Sheet log) · Cloudinary wired · **$10M PL active** · theme + ~37 pages live (non-www SSL + HTTPS redirect) · quote-form **source** wired to W1/W2 + secret_token *(dev-only verified)*.

## 🟡 BUILT — but NOT safe / NOT shipped
- ✅ Make **strip-contact DONE + verified live 2026-06-07** — SM8 API confirmed jobs show name + address only (no phone/email, no contact record). *(was pending; now shipped.)*
- ✅ **Quote form LIVE 2026-06-11** — theme v1.5 deployed (`timeless-theme-2` active), form on 13 pages, live e2e PASSED (test lead → Cloudinary + W1 webhook → GHL Contact + Opp Stage 1 + Slack #quotes-in). **First REAL customer within the first hour: Lisa V. COMPLETED the form (details + photos in GHL; Allan eyewitness 06-11), engaged via SMS, quote due 2026-06-12.** *(was: source-only/stub.)*
- ✅ GHL "Create Job on Stage 11" **PUBLISHED** (verified 2026-06-11 via Allan's workflow screenshot; W1/W2/W3/W6/W7 also published). Heartbeat drag-test pending.

---

# THE ROADMAP (numbered systems, execution-ordered)

## 1. MAKE — *the spine: turns a won quote into a dispatched job (Jordan's automation layer)*
- **★ Scenario 1 — GHL stage 11 "Job in ServiceM8" → create ONE SM8 job**
  - ★ **Strip-contact change** (Phase 1, active now)
    - confirm/screenshot the live module chain first (don't delete blind)
    - delete `Add Job Contact` module
    - delete the now-pointless `Sleep 3s` (it only gapped before the contact write)
    - set `Create SM8 Job` → `job_description` = `{{full_name}}` + service category only (no phone/email)
    - reconnect: chain ends `Create SM8 Job → Mark created → Log to Sheet`
  - ★ **Verify safety pass** is intact: secret-gate filter · `opp_id` dedup (Add-a-record overwrite-OFF) · Slack `#automation-errors` on error · Sequential processing ON
  - ★ **Data-capture** `Google Sheets → Add a Row` sits LAST (after `Mark created`), Resume-on-error, 15-col schema, KEEPS internal email/phone columns
  - ★ **6 smoke-tests:** secret gate · dup-key error text · dedup end-to-end · fail-then-recover · **SM8 shows name+address only (no contact leak)** · no-opp_id
- **Find-or-create CLIENT** (internal/invoicing only, email-first match; inserts before Create-Job; never sub-facing) — *after Scenario 1 green, ~job 5*
- **Photos → SM8 Attachment** (2-step binary, Cloudinary→GET→attach) — *fast-follow*
- ⚠️ **GHL PIT write-scope = ✅ VERIFIED PRESENT 2026-06-07** (tested a live opp update → HTTP 200; Scenarios 2-5 NOT blocked on a new PIT). *(STATE.md / earlier docs said "read-only, gates 2-5" — that was STALE.)* Still **security-rotate the PIT before go-live** (it was exposed in-session) — but that's hygiene, not a functional blocker.
- **Scenario 2 — Helper:** write SM8 job UUID back to the GHL opp
- **Scenario 3 — Back-sync:** SM8 "Completed" → GHL Stage 15 (via SM8 Object Webhook)
- **Scenario 4 — Accounts A:** GHL Job Complete → Accounts "Awaiting Invoice"
- **Scenario 5 — Accounts B:** Stripe final payment → Accounts "Paid"

## 2. GHL — *the customer brain: leads, comms, pipeline (Jordan's CRM)*
- ★ **Publish "SM8 — Create Job on Stage 11"** (DRAFT → live) — gated on Scenario 1 green; heartbeat-test = exactly one SM8 job
- ✅ **Twilio/SMS — DONE** (Twilio→GHL BYOT live since 2026-05-16; sends from +61 485 056 656; ACMA TimelessRsf approved 2026-05-17 — see STATE.md). ⚠️ **Email domain auth VERIFIED 2026-06-12 (dig):** SPF ✅ (Google+LeadConnector+Mailgun) · DMARC ✅ p=none · **Google DKIM ❌ not enabled · GHL dedicated sending domain ❌ none · quotes@ alias ❌** → quotes go by SMS until Allan flips DKIM + creates aliases (this-week task, see STATE.md §10)
- ★ **Minimum workflows for job #1:** W1 ack · deposit (Stripe link) · booking confirm · cure-time reminder
- **Full workflow set (trail after first job):** no-show/cancel-post-deposit · payment-fail/overdue chase (7/14/30d) · asbestos-found routing · sub-can't-attend reassign · damage/dispute · quote-expiry win-back · NPS (24h) · warranty · W2 abandoned-quote recovery
- **Custom fields/tags completeness check** + Accounts pipeline build

## 3. SERVICEM8 — *the field-ops backbone: dispatch, scheduling, job record (Jordan's ops tool)*
- ★ 🟩 **Marko as Staff** (invite + role) — genuine team member, NOT a sub seat
- ★ **First-service line-item SKUs** (the services we'll actually quote first — NOT all 140)
- ★ 🟩 **Purge leftover test jobs** (Job #8 + "by Make Integration" tests) before go-live
- Remaining queues (on-hold, scheduling) + badge taxonomy (strata / pre-1990 asbestos / no-lift / deposit-paid)
- 🟦 Rotate the SM8 API key — *after all 5 Make scenarios stable*

## 4. WEBSITE / QUOTE FORM — *the front door: no working form = no leads (the #1 current gap)*
- ★ **`npm run build`** the GHL-wired form (`cd quote-form && npm run build` → `assets/quote-form/`)
- ★ **Un-park the real shortcode** on the homepage — kill the `front-page.php` preview `alert()` stub
- ★ **Deploy theme** ($10M + audit fixes; bulletproof zip exclusions incl. `cockpit/*`, `.secrets/*`) → upload → **purge Cloudflare** → hard-refresh
- ★ **Live end-to-end test:** submit on the real page → GHL Contact + Opp Stage 1 + Slack `#quotes-in`
- 🟦 **Customizer:** real email + ABN; **licence LEFT BLANK** (never claim NSW Licensed); confirm phone
- **Warranty per-material copy audit** (grout 2yr / silicone 1yr / chip 1yr / resurface up-to-5yr — NOT a bulk replace; ACL)
- **Privacy policy:** add subcontractor-disclosure + data-storage/AI-use + retention; draft customer Terms

## 5. ANALYTICS / BIGQUERY — *own the data + prove attribution (Jordan's data brain)*
- **Tier 1 — NOW (cheap, capture is a one-way door):**
  - verify the capture Sheet logs every job correctly (post-strip placement)
  - 🟦 paste the real **GA4 ID** into Customizer (5 min, so traffic accrues pre-launch)
  - 🟦 verify **Google Search Console** + submit sitemap
- **Tier 2 — BEFORE the final audit (Cleo: attribution is part of *proving* the system):**
  - 🟦 GCP project `timeless-resurfacing-prod` + billing alerts · **BigQuery dataset (Sydney `australia-southeast1`)** + empty schema
  - external table over the `timeless_job_log` Sheet (zero-ETL)
  - GA4/GTM conversion events (form submit, deposit, final) · Google Ads conversion tag + linker (when ads launch)
- **Tier 3 — LATER (~50 jobs):** Looker Studio dashboard · weekly Slack digest · AI quote-drafter / analyst agents

## 6. LEGAL / COMPLIANCE — *parallel HARD GATE: no sub signs until Fair-Work-cleared (AU 2026 clampdown)*
- 🟦 **Employment-lawyer classification review** (s15AA whole-of-relationship; survives Mar-2026 ATO/FWO construction clampdown; not a Part-3A platform) — route via expand-Sprintlaw or a specialist
- 🟦 **Sprintlaw sub-agreement** draft + UCT/ACL (~$200 — drafting only, NOT the classification opinion)
- 🟦🟩 Sub onboarding gates: own ABN + **≥$10M PL cert sighted** + asbestos cert (per sub); confirm Marko's own ABN/PL/asbestos
- **Mitigation:** Marko self-performs jobs 1-3 so revenue runs while this gate clears in parallel

## 7. CONTRACTOR APP — *build LAST: clear job visibility + no-contact + accept/decline (Jordan built one too)*
- 🟦 Setup: Supabase (Sydney, Pro) + SM8 key as Edge secret · Firebase/FCM + VAPID · subdomain `jobs.timelessresurfacing.com.au` · Vercel
- Phase 1 Foundation (backend = sole key-holder, per-sub auth, `job_mirror` w/ contact filter, rate governor, webhook receiver)
- Phase 2 PWA core (install, per-sub login, My Jobs + detail = name+address only, one-tap nav)
- Phase 3 **Accept/Decline state machine** (the one genuinely-new build; no SM8 API; Fair-Work guardrails: real decline, no penalty, offer-language, delegation)
- Phase 4 Photos + complete (resumable IndexedDB→Storage→SM8 2-step)
- Phase 5 Notifications (Web Push + Make/Twilio SMS fallback + polling fallback)
- Phase 6 E2E test + automated contact-leak CI assertion + security review + onboard first real sub

## 8. FULL E2E DRY-RUN — *rehearse the entire pipeline with a fake customer + fake sub before real money*

## 9. 🔍 FINAL DEEP AUDIT — *the last gate; pass-bar = zero P0/P1 (run as a Pattern-C multi-agent audit)*
- **Data-flow reconciliation:** GHL→Make→SM8→Sheet→BQ row counts tie out by `opp_id` / `sm8_job_uuid` / status
- **No-contact-leak:** SM8 job + app JSON + logs + Slack + Sheet visibility — no customer phone/email on any sub-facing surface
- **Dedup/idempotency:** double-fire Stage 11 AND Stripe final-payment → exactly one transition each
- **Security:** PIT rotated · SM8 key server-only · `.secrets/` excluded from zip · webhook secrets valid · Slack leaks no secrets
- **Compliance:** Fair-Work guardrails + legal sign-off · ABN/PL/asbestos gates · privacy sub-disclosure · ACL warranty ladder · no licence claim
- **Billing:** Stripe deposit/final · Xero sync · Accounts pipeline · overdue/fail paths
- **Deploy:** live form works · HTTPS/www · Customizer · GA4/Ads events · mobile · Cloudinary photos · cache-bust
- **Ops:** Marko dispatch view · Slack alert coverage · manual-recovery SOPs

## 10. GO LIVE — *first real paying job*

---

## CRITICAL PATH (earliest real revenue)
**0 → 1(Scenario 1) → 2(publish + min comms; Twilio ✅ already live) → 4(form/site live) → 3(Marko Staff + first SKU + purge) → 6(legal in parallel; Marko self-performs jobs 1-3) → first job.**
Scenarios 2-5, BigQuery, and the app can trail the first internal job. *Full* finalization = all 10 sections + the audit.

## CLOSEABLE vs PERPETUAL
- **Closeable before go-live:** Make 1-5 · GHL workflows · SM8 config · form/theme deploy · BigQuery/GA4/Ads plumbing · the app · legal gate · the audit.
- **Perpetual (operating cadence — can't block "finalized"):** real before/after photos · testimonials · ongoing sub recruitment · quarterly pricing audit · annual insurance/legal refresh · ad optimisation.
