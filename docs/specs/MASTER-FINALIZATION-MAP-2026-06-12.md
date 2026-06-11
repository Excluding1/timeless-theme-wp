# MASTER FINALIZATION MAP — 2026-06-12 (the "everything" map)

**Allan's order:** every task done/not-done + the next task, to a GUARANTEED-finalised production full stack
like Jordan's Surface Care — all scenarios, stack pros/cons + connections, visual/manual verification.
**Method (Pattern-C):** Cleo independent pass (re-read Jordan transcripts) + 2 expert panels (64-scenario
coverage matrix · component-by-component stack map) + Clifford first-hand reads + live-site spot-check.
**Extends** `FINALIZATION-ROADMAP-2026-06-07.md` (still the section-numbered tracker); this doc adds the
pass-bar, the scenario matrix, the stack map, and the audit-corrected state. STATE.md stays the authority.

**CONVERGED VERDICT (both CEOs): the stack is FIRST-JOB-CAPABLE with manual workarounds, NOT yet
guaranteed-finalised. The single biggest gap = the MONEY LANE (deposit link → booking confirm → invoice →
paid). Highest-leverage 7-day build = deposit→booking→Xero lane + failure/refund SOP, proven on Lisa
then one fake dry-run.** (Lisa = first QUOTE-FORM customer — first website-inbound; Marko's warm-referral
customer + McGrath PM enquiry pre-date her.)

---

## 1. THE PASS-BAR — "guaranteed finalised" = ALL 12 TRUE (Cleo-authored, both CEOs signed)
1. Data ties out GHL→Make→SM8→Sheet(→BQ) by `opp_id`/`sm8_job_uuid`/status — row counts reconcile.
2. Zero contact leaks on any sub-facing surface (SM8 job, app JSON, logs, Slack, Sheet visibility).
3. Idempotency proven: double-fire Stage-11 AND Stripe payment → exactly one transition each.
4. Secrets rotated + server-only (SM8, GHL PIT, Netlify, 3×Supabase, Make webhook secret) + `.secrets/` never ships.
5. Legal gates signed: Fair-Work s15AA review · ACL/warranty ladder · privacy additions live · no licence claims.
6. Money lane works end-to-end: Stripe deposit + final · Xero invoice (GST — we ARE registered) · fail/overdue chase · refund/dispute SOP.
7. Live form/HTTPS/mobile/cache/Cloudinary/GA4/GSC all pass on the REAL site (incognito).
8. Dispatch works: Marko/sub offer→accept→complete + manual-recovery SOPs rehearsed.
9. Visual QA passes desktop + mobile + iOS + a REAL-number SMS delivery test.
10. Accessibility (keyboard/contrast/labels) + form abuse controls (rate-limit/honeypot; Cloudinary preset currently UNSIGNED) pass.
11. Backups/restore drills done (WP, Supabase, Sheet, GHL/SM8 exports) + monitoring/alert SLAs defined.
12. Vendor-outage runbooks exist + rehearsed (GHL/Make/SM8/Stripe/Twilio/Cloudinary down).

## 2. ✅ DONE (verified live, eyewitness or API-proven)
- **Site + theme v1.5 LIVE** (`timeless-theme-2`), 62-URL audit pass, form on 13 pages, mobile handoff LIVE
  (zip re-upload confirmed by Allan 06-12), interaction polish, no "in writing" claims, logo strip/nav/footer brand set.
- **Lead pipeline CERTIFIED ×5:** form → Cloudinary → W1 (secret gate) → GHL Contact+Opp stage 01 → Slack
  #quotes-in → stage-11 drag → Make Scenario 1 (secret gate · `opp_id` dedup · category map · strip-contact)
  → SM8 job NAME+ADDRESS only → Sheet log → #new-jobs ping.
- **W2 misfire bug dead:** W1 disarms W2 + clears `form-partial-pending` (proven live, TEST3).
- **Scenario 3 back-sync proven:** SM8 Completed → GHL stage 15, idempotent, daily keep-alive. (Helper FOLDED
  into the `sm8_jobs` data store — the "can't find opp" risk in older notes is RESOLVED, not open.)
- **Contractor app Phases 1-4 DEPLOYED** (84a88f2 · d7bb48e · ba71db1 · 7762bf4): read path, per-sub auth+RLS,
  accept/decline/availability/handback/complete, SM8 write-back, contact-leak CI. Netlify PWA preview live.
- **Stages renamed 01–15** · all GHL workflows PUBLISHED · W1/W2 copy = approved 24-hour pack.
- **Stripe live** (Card+PayTo, Westpac payouts) · **Xero Grow live** (Stripe app; invoice template w/ virtual
  address + BSB) · **GST = REGISTERED** (Allan 06-12 — decision #3 closed) · Twilio BYOT + ACMA TimelessRsf.
- **Slack 6 channels** incl. #automation-errors dead-letter · job-log Sheet capture · cockpit board LIVE
  :4317 (Live/Crew-Map/Task-Board views) + refreshed 06-12 · $10M PL active · GBP 5+ reviews.
- **First quote-form customer captured** (Lisa, completed form + photos) · docs/board/memory all
  drift-patched (repo-audit-2026-06-12.md — 11 fixes).

## 3. ❌ NOT DONE — THE ORDER (both-CEOs amended; tags: 🔴 blocks-first-job · 🟡 blocks-scale · 🟢 later)
1. 🔴 **QUOTE LISA by SMS — TODAY.** Gates: <$5k inc-GST/bathroom · 3-tier T1/T2/T3 · $300 margin floor ·
   10% deposit · 14-day validity · no licence claims · margin-auditor lens on the price. Quote artifact =
   lean SMS (decision #1 resolves with it). NEEDS: Allan pastes her GHL form details/photos.
2. 🔴 **THE MONEY LANE (same-day + this week):** Stripe deposit link (10%) wired to "yes" → booking-confirm
   SMS → day-before reminder → cure-time SMS → manual Xero invoice SOP (GST) → payment-received check →
   fail/overdue chase (7/14/30d) → refund/partial/dispute SOP (CEO.md authority ladder). ← Cleo's 7-day build.
3. 🟡 Test-data purge: SM8 ~14 test jobs (Marko) · GHL TEST1-5 + Allan's self-test (Allan).
4. 🟡 GA4 + GSC + sitemap · W3 cadence 3 pastes + privacy "yes" → apply → rebuild `timeless-theme-2.zip`
   (carries the llms.txt overclaim fixes) → upload → BOTH cache purges · Customizer email/ABN ·
   real-number phone submit test.
5. 🟡 Email plumbing: Google DKIM ON (admin.google.com → Gmail → Authenticate; TXT in Cloudflare) ·
   quotes@/support@/billing@ aliases · GHL dedicated sending domain. (DNS verified 06-12: SPF ✅ DMARC ✅.)
6. 🟡 Marko: SM8 Staff invite · first-service SKUs · "which queue = booked" taxonomy (unblocks app queue-move).
7. 🟡 Credential rotation (7 keys, one at a time, verify scenarios after each) + SM8-key rotation runbook.
8. 🟡 Legal-gate routing (expand-Sprintlaw vs specialist; brief ready) — Marko self-performs jobs 1-3 meanwhile.
9. 🟡 App Phase 5 (push notifications; interim SMS OK) + Phase 6 final security review → first real sub (legal-gated).
10. 🔴(gate) **Full E2E dry-run** (fake customer + fake sub, money on Stripe test) → **FINAL DEEP AUDIT**
    (Pattern-C, pass-bar §1 = the checklist, zero P0/P1) → GO.
**NEW tasks the roadmap missed (Cleo, slotted):** monitoring/alert SLAs + escalation (→ before step 10) ·
backup/restore drills (→ before final audit) · vendor-outage runbooks (→ step 10 rehearsal) · data
retention/delete policy (→ privacy work, step 4) · Stripe dispute/credit-note SOP (→ step 2) · ACCC/ACL
review of quote artifact + "from" pricing + review-ask (→ step 2/4) · accessibility QA (→ step 10) ·
form abuse controls: honeypot/rate-limit/signed Cloudinary (→ step 4/9) · renewals+expiry calendar
(domains, Xero promo ends 2026-11-26, insurance, keys) (→ step 7).
**Open design decisions left: 2** — invoice trigger (manual jobs 1-5 → Scenario 4/5) · warranty-certificate
delivery (emailed cert; needs template + stage-15 step). *(Quote artifact resolves with Lisa; GST resolved.)*

## 4. SCENARIO COVERAGE (64 mapped: A leads · B quote · C book · D job · E money · F post · G failures)
**Counts: 11 ✅ built · 40 📋 spec'd (runbook/SOP exists, not automated) · 12 ❌ missing · 6 🔴 blocked.**
The worst five for a first paying job (all three panels agree):
1. **E1/E2 payment capture** — deposit + final are manual; Scenario 5's R2 decision open (Stripe-link event
   vs Xero-Pay-Now event). Interim SOP: Allan sends Stripe link by SMS → eyeballs paid → drags stage.
2. **C7/D4 day-before reminder + no-show/late alerts** — reputational firefighter; template exists, no automation.
3. **G1/G5 webhook/GHL-down lead loss** — form "succeeds" but nothing lands; mitigation = monitoring + the
   localStorage draft + manual recovery runbook (full automation later).
4. **E3-E6 overdue/failed-payment chase** — fine for job #1, fails at ~job 5+.
5. **A5/A7/A8 dedup-not-e2e-tested + no abuse controls + no phone validation** — before ads traffic.
Strong areas: D (job execution — app + SOP playbook) and the dedup/idempotency belts (G7 proven by smoke-test).
Full matrix retained in the 06-12 audit transcripts; SOP sources: sub-risk-scenarios-playbook (28 runbooks),
customer-comms-templates (lifecycle messages — now aligned to 24h/14-day/no-"written"), job recipes ×5.

## 5. TECH STACK — connections, SPOFs, cost (full per-component map in the 06-12 panel output)
**Happy path:** Form →(W1 webhook+secret)→ GHL →(stage-11 workflow webhook)→ Make →(API)→ SM8 →(webhook)→
Make →(PIT)→ GHL stage 15 · photos via Cloudinary · money via Stripe→Westpac→Xero(feed) · subs via
Supabase BFF (sole SM8-key-holder) → PWA · alerts via Slack · audit via Sheet.
**Known silent-failure traps (all bitten once, all in runbooks):** Make "Immediately as data arrives" OFF ·
Slack bot not /invited + Blocks-vs-Text · zip not named for active theme folder · CF cache without the
logged-in-cookie exclusion · GHL field renames breaking webhook payload contracts · stale form bundle.
**SPOF ranking:** GHL + SM8 = P0 (leads/dispatch) · Make + VentraIP + Supabase = P1 · Stripe/Twilio = P2
(queue+retry) · Slack/Cloudflare/Sheets = P3. None have redundancy — by design at this scale; the answer is
monitoring + manual runbooks (pass-bar #11/12), not multi-region.
**Jordan parity: ~95% mirror** (GHL·SM8·Make·Stripe·Xero·Sheets·Slack·landing pages·app). 3 deliberate,
decision-recorded divergences: single-account sub app (vs SM8 Network) · NO-CONTACT rule (name+address only)
· HBA <$5k/GST/no-licence posture. Still behind Jordan on: quote speed (his = minutes), payment follow-up
automation, BigQuery warehouse, content/photo loop — all on the order above.
**Run-rate:** ~$234/mo now (GHL $155 · Supabase $25 · VentraIP ~$19 · Workspace $19 · Make $9 · SM8 $7.25
promo) → ~$310/mo from 2026-11-26 (Xero promo ends) → ~$500/mo at 100 jobs/mo (Stripe fees scale with
revenue). Watch-items: Workspace +$4 from 07-06 · SM8 promo ends 2027-05 · Cloudinary unsigned quota.

## 6. VERIFICATION PLAN (the "visually test manually" half)
- **Done 06-11/12:** 62-URL crawl · buttons/sliders/menus/forms manual pass · console clean · live public
  spot-check (form root ✅ no admin-bar ✅ no "in writing" ✅ assets 200 ✅ CF HIT ✅).
- **Open manual checks:** real-number phone submit (ack SMS delivery) · iOS Safari + Android Chrome visual
  pass on form/handoff · Slack bot membership audit (all 6 channels) · Westpac feed actually ACTIVE in Xero ·
  `main.min.css?ver=1.5.0` on live vs filemtime locally (suspect SpeedyCache rewrite — verify before next
  CSS-only change) · GHL custom-field schema vs form payload contract re-check after any field edit.
- **E2E dry-run script (step 10):** fake customer end-to-end incl. Stripe TEST deposit + fake-sub
  accept→photos→complete→stage-15→invoice→paid + a forced failure at each handoff to prove every runbook.

## 7. NEXT TASK
**#1 = LISA'S QUOTE (now):** Allan pastes her GHL details/photos → price from
`data/pricing/master-pricing-2026-05-01-snapshot.xlsx` (extracted: `.claude/debug/pricing-*.tsv`) under the
gates → margin-auditor check → Rule-8 dual-CEO SMS copy → Allan sends. **#2 same-day = the money lane**
(deposit link + booking confirm + Xero SOP) so her "yes" lands somewhere.
