# COMPLETE BUILD PLAN — to the FINALISED full stack (2026-06-12, **v1.0 CO-SIGNED**)

**Cleo: "CO-SIGNED WITH AMENDMENTS" (all 5 merged below: W4/W7 + Q&A/sub-quote/hold workflows · sub
matching+recruitment · Terms+warranty-copy pass · before/after library automation · 4 DoDs tightened).
Completeness-critic merged: quote-acceptance flow · photo-marketing consent · insurance CoC verification ·
WordPress ops policy · AI-employee deployment phases · Marko pre-flight · uptime monitoring.**

**Allan's framing (2026-06-12):** do NOT sequence by revenue urgency — he runs jobs manually meanwhile
(texts subs, quotes, completes, invoices by hand using the money-lane SOP). This plan = COMPLETE the system:
every fix / improvement / addition / removal, all scenarios, to the 12-point pass-bar in
`MASTER-FINALIZATION-MAP-2026-06-12.md`. Social + blogs deliberately LAST (Allan). Owners: 🟦 Allan ·
🟩 Marko · 🟨 Clifford(+experts) · ⚖️ both-CEOs. Each item has a Definition of Done (DoD).
**Two hard gates survive any reordering:** ⚖️ no external sub before the lawyer clears · 💰 never drag an
opp to stage 11 before its deposit is paid (that drag fires the live SM8 pipeline).

**Direct answers to Allan's named examples:**
- **Multi-quotes (multi-bathroom):** PARTLY covered — pricing sheet has a Multi-Bathroom tab + locked
  discounts (10% 2nd / 15% 3rd) and the HBA rule = one opp + one invoice <$5k PER bathroom. The form
  already takes multiple AREAS in one submission. MISSING = the GHL convention (one opp per bathroom,
  linked by property) + a quoter SOP + an e2e test → Phase 1.3c.
- **Computer→mobile QR handoff:** BUILT + LIVE (confirmed re-uploaded). Remaining = a real-device pass
  (iPhone Safari + Android Chrome) → Phase 1.3a.
- **Finalise SMS + emails:** SMS pack is now complete for the core lifecycle (W1/W2 live, W3 ready-to-paste,
  M1-M8 approved). Emails are GATED on DKIM → Phase 2 builds the full email twin-set.
- **All GHL workflows / all Make scenarios:** Phase 1.1 + 1.2 below enumerate EVERY one with status.

---

## PHASE 0 — DONE (the certified base, for the record)
Site v1.5 live (13 form pages, handoff QR, polish) · pipeline certified ×5 (form→Cloudinary→W1→GHL→Slack→
stage-11→Make→SM8 name+address-only→Sheet→#new-jobs) · W2-misfire fix proven · Scenario 3 back-sync proven ·
contractor app Phases 1-4 deployed (contact-leak CI) · stages 01-15 · Stripe/Xero/Twilio-ACMA/Slack×6 live ·
GST registered · $10M PL · money-lane manual SOP + M1-M8 (Cleo-approved) · quote #1 sent-ready under gates ·
docs/board/memory drift-fixed (11 fixes) · master map + pass-bar locked.

## PHASE 1 — CORE PIPELINE COMPLETION (GHL workflows · Make scenarios · form hardening)
### 1.1 GHL workflow set — target = EVERY lifecycle moment automated
| # | Workflow | Status → DoD |
|---|---|---|
| a | W1 ack + disarm-W2 | ✅ live (DoD met: proven on TEST3) |
| b | W2 abandoned-quote recovery | ✅ live · DoD: one real partial recovers |
| c | W3 quote cadence d1/d3/d7 | 🟦 PASTE the 3 approved SMS (pending_copy_packs) · DoD: fires on a test opp, stops on reply |
| d | Quote-expiry win-back (day 15) | 🟨 draft copy ⚖️ → 🟦 build · DoD: expired test opp gets 1 win-back, then silence |
| e | Booking confirm (stage 14 entry) | 🟨 spec from M2 · DoD: stage-14 test fires once |
| f | Day-before reminder (appointment −1d) | 🟨 spec from M3 (needs GHL calendar/appointment field convention) · DoD: test appointment fires |
| g | Cure-time aftercare (stage 15 + same-day) | 🟨 spec from M4 · DoD: stage-15 test fires once, correct variant |
| h | NPS ask (stage 15 + 24h) + detractor route (≤6 → Slack #job-issues + Allan task) | spec exists (Decision 4) · DoD: test contact scores, routes both paths |
| i | Review ask (post-NPS, ALL customers — no gating, ACCC) | template exists · DoD: fires with real GBP link |
| j | Warranty certificate delivery (decision #4: emailed cert) | ⚖️ design artifact + 🟦 build (POST-DKIM) · DoD: stage-15 test delivers PDF/HTML cert |
| k | Payment chase M6/M7/M8 on Accounts ages | Phase 3 dependency (Accounts pipeline) · DoD: aged test invoice fires correct step, max 3 |
| l | Hot-lead alert (score ≥40 → #hot-leads, Decision 3 v2) | 🟦 verify built/published · DoD: high-score test pings |
| m | No-show / reschedule handling (tags + tasks + $100 callout SOP) | 🟨 spec · DoD: tag fires task + customer SMS |
| n | Asbestos-found / job-issue routing (stage 13 + #job-issues) | 🟨 spec (links app /problem) · DoD: test issue pings + holds stage |
| o | Custom-fields completeness audit vs form payload contract | 🟨 audit · DoD: every {{merge}} in every template resolves on a test contact |
| p | W4 missed-call text-back (ghl_setup_spec_v2:295) | 🟦 build · DoD: missed call to the business number triggers one text |
| q | W7 stage-transition logger → #pipeline-feed + workflow-error routing → #automation-errors (spec v2:325-331) | 🟦 verify/build · DoD: a stage drag posts to #pipeline-feed; a forced workflow error alerts |
| r | Stage-02 Q&A convention (snippets + SLA task) + Stage-03/04 sub-quote request/received tracking (Jordan runs these; spec v2:77-83) | ⚖️ convention + 🟦 snippets · DoD: a test opp moves 02→05 with Q&A logged; a sub-quote request is trackable |
| s | Stage-10 hold-reason taxonomy (strata approval / landlord authority / asbestos assessment / margin review — spec v2:115-127) | 🟦 field + values · DoD: hold reasons selectable + reportable |
### 1.2 Make scenarios — target = the full Jordan automation layer
| # | Scenario | Status → DoD |
|---|---|---|
| a | 1: stage-11 → SM8 job (+safety+capture) | ✅ live · DoD met ×5 |
| b | 2: job-UUID write-back | ✅ FOLDED into sm8_jobs data store (no build) |
| c | 3: SM8 Completed → stage 15 (+keep-alive) | ✅ live · DoD: idempotency re-proven in E2E |
| d | 4: stage 15 → Accounts "Awaiting Invoice" | 📋 spec exists · DoD: test completion creates ONE accounts opp |
| e | 5: payments → Accounts "Paid" (R2: deposit=payment-link event · final=Xero invoice.paid) | 📋 · DoD: test deposit + test final each move ONE stage, double-fire blocked |
| f | Photo-FILE attach (Cloudinary→SM8 2-step) | 📋 jordan-make-reference (v1 link ✅) · DoD: photos appear ON the SM8 job |
| g | Find-or-create CLIENT (invoicing only, ~job 5) | 📋 · DoD: repeat customer matches, no dupes |
| h | Heartbeat/monitor: daily scenario-health ping + toggle check | 🟨 NEW · DoD: forced-off scenario alerts within 24h |
### 1.3 Form / front-door hardening
a) 🟦 Real-device pass: QR handoff + submit on iPhone Safari + Android Chrome + one REAL-number ack-SMS proof · DoD: screenshots + SMS received.
b) 🟨 Abuse controls: honeypot + client rate-limit + E.164 phone validation + **Cloudinary SIGNED uploads** (Override 6 Phase 2) · DoD: bot-script blocked, bad phone blocked, unsigned preset disabled.
c) ⚖️ Multi-bathroom convention: one opp per bathroom linked by property field + quoter SOP + discounts auto-noted · DoD: 2-bathroom test = 2 opps, 2 quotes <$5k each, discount applied.
d) 🟨 Dedup e2e (re-submit within 30d updates, not duplicates) · DoD: test proves single opp.
e) 🟨 Out-of-area + photo-quality SOPs wired to templates (polite decline / photo-resend snippets in GHL) · DoD: snippets exist in GHL.
f) 🟨 Verify `main.min.css` filemtime cache-bust on live (SpeedyCache rewrite suspicion) · DoD: CSS change visibly busts.
g) ⚖️ **QUOTE-ACCEPTANCE FLOW (critic's #2 — ACL):** customer must formally accept scope + terms before money.
   V1 (manual, now): M1 carries "By paying the deposit you accept the quote as described and our terms:
   {{terms_link}}" — acceptance = the payment event, terms visible first. V2 (built): accept-link/checkout
   page with terms checkbox · DoD: every paid deposit has a terms-visible trail.

## PHASE 2 — COMMS COMPLETION (the email twin-set + channel hygiene)
a) 🟦 DKIM ON (admin.google.com→Gmail→Authenticate→TXT in Cloudflare) + quotes@/support@/billing@ aliases + GHL dedicated sending domain · DoD: DKIM pass on mail-tester, aliases deliver.
b) ⚖️ EMAIL versions of the full lifecycle set (ack · quote-delivery 2B [already re-aligned: 14-day/no-"written"] · booking · invoice cover · NPS · review · warranty cert) — Rule-8 each · DoD (Cleo-tightened): renders on Gmail + Outlook + mobile, SPF/DKIM/DMARC all pass, reply-route proven, screenshots archived.
c) 🟦 Inbox routing: quotes@→Allan + GHL conversation sync decision · DoD: a customer reply reaches one place.
d) 🟨 Snippet library complete in GHL (photo-resend, quote-delayed, PM/agency variant, strata variant, out-of-area) · DoD: all sendable in 2 clicks.
e) ⚖️🟦 **Customer TERMS finalisation (Cleo #3):** Allan's WIP page-terms.php → final, ACL-checked, linked
   from quote messages + invoice + footer; plus the warranty-copy contradiction pass (3yr vs "Up to 5-Year"
   per-material ladder — needs.json card) · DoD: terms live + every warranty claim on site matches the ladder.
f) ⚖️ **Photo-marketing CONSENT (critic #3):** GHL field `photo_consent_marketing` + a one-line consent ask
   at job completion (SMS template + later app prompt) — no before/after published without it · DoD: field
   exists, ask template approved, gallery SOP checks consent before posting.

## PHASE 3 — MONEY COMPLETION (automation on top of the manual SOP)
a) 🟦 Accounts pipeline build (AC stages incl. partial-payment) per Decision 12 v2 · DoD: stages exist + fields.
b) Scenario 4 + 5 live (1.2d/e) → GHL Payment Status auto · DoD: zero manual status edits on a test job.
c) ⚖️ Decide deposit mechanism v2: per-job Payment Links (current) vs GHL-native Stripe invoices · DoD: decision logged + built.
d) 🟦 Xero: verify Westpac feed ACTIVE · branding theme w/ tr-lockup logo · payment terms default 7d · DoD: feed rows reconcile, logo on invoice.
e) 🟨 Refund/credit-note + chargeback runbook drill (one test refund in Stripe test mode) · DoD: drill done.
f) 🟩 Sub payout SOP (sub invoices us → Westpac EFT + remittance text) + sub-rate-schedule FINALISED incl. the standalone-basin floor-clash fix + materials model decision (subs-supply vs we-supply) · DoD: Marko signs the schedule.
g) 🟨 Sheet job-log: add margin + lead-source columns (auditor-margin lens per job) · DoD: row shows net margin per job.

## PHASE 4 — FIELD OPS + SUB SYSTEM COMPLETION
a) 🟩 Marko SM8 Staff + first-service SKUs + queue taxonomy ("which queue = booked") · DoD: app queue-move write-back unblocked + built.
b) 🟨 Contractor app Phase 5: Web Push (VAPID/FCM) + SMS fallback + rate governor · DoD: test sub gets push on offer.
c) 🟨 Contractor app Phase 6: E2E + rate soak + JWT/RLS review + Fair-Work copy review + contact-leak CI green · DoD (Cleo-tightened): named checklist passes — RLS negative tests, JWT expiry behaviour, contact-leak CI green, exposed-token rotation confirmed, Fair-Work copy pass — archived as the PASS doc.
d) ⚖️ Legal gate: route (expand-Sprintlaw vs specialist) → engage → s15AA clearance · DoD: lawyer letter on file.
e) 🟩 Sub onboarding execution (SOPs exist): vetting → trial job → agreement signing (post-d) · DoD: first sub live in app.
f) 🟨 Job recipes: ADD BSN-01 basin recipe (gap found via Lisa) + any other launch-service gaps (vanity, tile) · DoD: recipe per launch SKU family (just-in-time per recipes README — NOT all 140).
g) 🟩 Aftercare cards printed (A5 ×100) + van checklist · DoD: cards in vehicle.
h) ⚖️🟩 **Sub matching + quality system (Cleo #2 — Jordan runs this):** sub profile fields (skills, suburbs,
   availability) + offer-order convention + quality benchmarks/check-ins wired to the existing rubric
   (sub-quality-rubric.md) post-job · DoD: a test job offers to the RIGHT sub first; rubric row per job.
i) 🟩 **Sub recruitment pipeline:** Hipages + Airtasker + Meta + business-audit sourcing accounts live +
   candidate tracking (channels doc exists: sub-recruitment-channels.md) · DoD: pipeline sheet with ≥5 candidates.
j) 🟩 **Marko pre-flight (critic):** asbestos awareness cert confirmed/booked + own ABN/PL verified + tools
   checklist doc (from "Tools - Sub Must Own" sheet) + vehicle check · DoD: all sighted + filed.
k) 🟨 **AI-employee deployments (phase-tagged, specs exist in docs/specs/ai-employees/):** quote-drafter
   (Clifford performs the role for jobs 1-5 → agent later) · photo-quality-reviewer (with 1.3e) · dm-handler
   (Phase 8 socials) · maintenance-reminder (post job #10, drives repeat rate) · business-analyst (Phase 5
   data) · DoD per agent: spec → build → one proven run.

## PHASE 5 — DATA / ANALYTICS COMPLETION
a) 🟦 GA4 ID into Customizer + GSC verify + sitemap submit · DoD: traffic + index visible.
b) 🟨 GA4/GTM conversion events (quote_submit already fires; add deposit + final-paid) + Google Ads tag pre-wiring (task doc exists) · DoD: events visible in GA4 DebugView.
c) 🟦🟨 GCP project + BigQuery dataset (australia-southeast1) + external table over the job-log Sheet · DoD: SQL over real rows.
d) 🟨 Reconciliation tie-out script (GHL↔Sheet↔SM8 by opp_id) → weekly Slack digest · DoD: weekly digest posts.
e) Looker Studio board (build-ready spec now, build ~50 jobs) · DoD: spec doc.

## PHASE 6 — HARDENING + OPS MATURITY (pass-bar enablers)
a) 🟦🟨 Rotate ALL 7 exposed credentials one-at-a-time w/ scenario verification + write rotation runbooks · DoD: zero old keys valid.
b) 🟨 Monitoring/alert SLAs + vendor-outage runbooks (GHL/Make/SM8/Stripe/Twilio/Cloudinary down → who notices how fast, manual fallback steps) + 1.2h heartbeat + **uptime monitor on / + the form asset URL (free tier, alerts → Slack)** · DoD (Cleo-tightened): one forced failure per vendor with owner, detection time, fallback used, recovery — all evidenced in a drill log.
c) 🟦🟨 Backup/restore drills: WP (cPanel auto-backup verified restorable), Supabase dump, Sheet copy, GHL+SM8 exports, **Xero export schedule** · DoD: one restore each proven.
d) ⚖️ Privacy paragraphs live (await Allan "privacy yes") + data-retention/delete policy + form data-handling note · DoD: page live + policy doc.
e) 🟨 Accessibility pass (keyboard, labels, contrast, reduced-motion) on form + key pages · DoD: axe scan + manual pass.
f) 🟨 Renewals/expiry calendar (domains 2027-03/04 · Workspace +$4 07-06 · Xero promo ends 11-26 · SM8 promo 2027-05 · insurance · ACMA · key ages) → cockpit/needs · DoD: calendar entries + board card.
g) 🟨 Theme zip rebuild + deploy (carries llms.txt fixes + privacy page) + post-deploy verify checklist run · DoD: live llms.txt clean.
h) 🟦🟨 **WordPress ops policy (critic #5):** minor-release auto-updates ON, major = manual after wp-now staging check · security plugin (free tier) · monthly plugin audit · rollback = previous theme zip retained · DoD: policy doc + settings screenshot.
i) 🟦 **Insurance Certificate of Currency (critic #4):** obtain from broker, VERIFY it covers resurfacing AND
   regrouting + sub-extension + statutory liability, archive; summary ready if a customer asks · DoD: CoC on file, coverage confirmed in writing from broker.
j) 🟦 ABN/ASIC/business-name renewal entries join the renewals calendar (6f) · DoD: calendar complete.

## PHASE 7 — VERIFICATION GATES (the finalised stamp)
a) ⚖️ FULL E2E DRY-RUN: fake customer end-to-end (Stripe TEST deposit + final) + fake sub (offer→accept→
photos→complete→back-sync→invoice→paid) + forced failure at EVERY handoff proving each runbook · DoD: script + log committed.
b) ⚖️ FINAL DEEP AUDIT (Pattern-C multi-agent) against the 12-point pass-bar · DoD: **zero P0/P1 → stamp FINALISED** in STATE.md.

## PHASE 8 — GROWTH LAYER (LAST per Allan)
a) 🟦🟨 GBP engine: weekly posts, photo uploads per job, Q&A seeding, review velocity tracking · DoD (Cleo-tightened): four DATED posts + photos + Q&A live, review count tracked, UTM/source log running.
b) 🟨 Before/after content loop **+ library automation (Cleo #4 — Jordan automates this):** photo capture at
   job complete → auto-categorised Drive/library (per-job folder via the app/Make) → consent-checked (2f) →
   swap site placeholders progressively · DoD: first real pair flows job→library→site without manual sorting.
c) 🟨 Blog activation: theme already has archive-article.php + single-article.php → enable, 5-post seed plan (suburb/service intents), llms.txt sync; AI-blog-automation re-scoped later · DoD: first post indexed.
d) 🟦 Socials: FB + IG business pages (existence ❓ in STATE) + cross-post cadence from the content loop · DoD: pages live + 4 posts.
e) 🟦🟨 Google Ads: conversion wiring (5b) → **landing-page policy compliance audit** (claims, pricing wording) → campaign per top-5 pages (CEO.md Override 4) at capped test budget · DoD: first conversion tracked end-to-end, zero policy flags.
f) ⚖️🟨 Referral + win-back programs: ⚖️ decide the referral INCENTIVE structure first (none exists — critic), then templates (commercial msgs, STOP required) · DoD: Rule-8 pass + live.
g) Suburb-page expansion (data-driven) + FAQ/schema refresh from real questions · DoD: batch 2 live.

## REMOVE / ARCHIVE / QUARANTINE (so future sessions can't be misled)
`dashboard/` → archive (superseded by cockpit) · `docs/QUOTE-FORM-GHL-MIGRATION-PLAN.md`,
`PERFORMANCE-AUDIT-FIX-PLAN.md`, old GHL drafts → `docs/archive/` · old TimelessDash quote-form branch →
archive tag · daemon/ stays parked (build trigger: 3+ concurrent jobs) · delete stale theme copies on WP
(done) · keep HANDOFF.md historical banner.
**Quarantine banners needed (Cleo):** CEO.md old stage-name passages (~:440/:460/:478 still read "14
Invoiced / 15 Paid" — current lock = 14 Job Booked / 15 Job Complete, finance via Custom Field + Accounts
pipeline) · `ghl-pipeline-13-stage.md` + spec-v2's old promoter-only review-gating line (current rule =
review ask to ALL customers, no gating).

## SEQUENCING LOGIC (completion-first, per Allan)
Phases 1→2→3 can run in PARALLEL lanes (GHL clicks 🟦, specs/copy 🟨⚖️, Marko items 🟩) — nothing in them
blocks manual operations. Phase 4d (legal) starts NOW in parallel (longest lead time). Phases 6→7 are the
gate sequence; 8 strictly last. Manual ops continue throughout via the money-lane SOP — every automated
piece REPLACES a manual step only after its DoD test passes (never mid-job).
