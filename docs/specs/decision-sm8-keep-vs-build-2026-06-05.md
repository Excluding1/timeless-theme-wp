# DECISION — Keep ServiceM8; do NOT build our own app (2026-06-05)

**Status:** LOCKED. **Unanimous:** field-service-ops expert + Cleo + Clifford. Triggered by Allan: *"do we even need ServiceM8 if we just make our own app?"*

## Decision
**KEEP ServiceM8 as the field-service backbone. Do NOT build a custom field-service platform** — not now, almost certainly not ever as a *replacement*. A custom **contractor-VIEW** app is a possible FUTURE layer **on top of** SM8, triggered by scale + specific pain — never a from-scratch replacement.

## Why
- **Pre-revenue, 0 jobs.** The bottleneck is customers/jobs/learning, not tooling. Building a platform now is the #1 way to not launch.
- **SM8 is a mature ops core out-of-the-box:** scheduling, dispatch, the on-site mobile app (nav, photos, complete, offline), customer auto-SMS, invoicing, Stripe/Xero, permissions, reliability, support. Rebuilding = PM + design + mobile/web eng + QA + support + security + maintenance, forever.
- **Jordan KEPT SM8** ("push all our work out to technicians… synced real-time" `2026-03-06:168`) and built a contractor-VIEW app only because SMS/email weren't clear for ~70 subs (`2026-04-30:71-73`). He did **not** rebuild dispatch/scheduling/invoicing. "Jordan has an app" ≠ "he replaced SM8."

## Subbie model = ServiceM8 NETWORK (not Staff)
- Subs on their **own SM8 account** (browser-link fallback). Send a **Network Request = an OFFER** → sub **ACCEPTS** ("Convert to Job") / **DECLINES** → route to next. Sub sees **only their job** (no pricing/margin/other customers). Photos/forms flow back real-time; **they invoice us**.
- **COST CORRECTION:** SM8 = **per-JOB, flat monthly, UNLIMITED users** (the old "per-staff" assumption is **STALE**). Network = **free add-on**. Subs cost nothing extra.
- **FAIR WORK (critical):** Aug-2024 Closing Loopholes **s15AA whole-of-relationship test** + **Mar-2026 ATO/FWO joint clampdown on building & construction**. Network accept/decline + own-ABN = genuine-contractor signal; Staff allocation (no right of refusal, sees dispatch board) = employee-leaning → **sham-contracting** (up to **$99k/contravention** small biz) + **super back-pay** (SGAA s.12(3), defeated by a real right-to-delegate). **Staff seats only for Marko/Allan/genuine employees.**
- **PRACTICE FIXES:** offer-language not orders · **NEVER penalise a decline** (reframe field-ops "decline >35% → coaching" as a capacity/fit conversation, not punishment — penalising refusal = employee indicator) · keep a real delegation right · verify ABN + PL (≥$10M) before dispatch · no `@timelessresurfacing.com.au` email / uniform / "our team" branding for subs · they invoice us · watch >80%-revenue exclusivity (PSI).

## Modularity (Cleo's nuance — don't assume SM8 is permanent)
Keep the layers **modular** so SM8 is swappable later: **GHL** = CRM/leads · **Make** = automation · **Sheets/DB** = captured data · **SM8** = ops backend. Today's GHL→Make→SM8 + data-capture is an **operating asset** that raises the switching threshold — but it's not the reason to stay (premature switching is value-destructive regardless).

## Future build trigger (NOT now)
Build a lightweight **contractor-view** layer (on top of SM8) ONLY when: **20–50+ active subs** + SM8/SMS workflows causing **missed jobs / admin drag** + a narrow custom view demonstrably reduces operational pain + the team has **repeatable process knowledge**. Start as a narrow contractor- or customer-view portal; **SM8 stays the system of record.**

## Doc corrections flagged (to fix)
- `docs/roles/auditor-fair-work.md` + `docs/OPERATING-CONTEXT.md §9`: stale **"SM8 per-staff"** → correct to **per-job / unlimited-users** (strengthens the Network case).
- `expert-field-service-ops.md` sub-management: reframe **"decline >35% → coaching"** as capacity/fit, never punishment.

**Sources:** ServiceM8 Help (Network, Job Allocations, Pricing) · Fair Work Ombudsman (whole-of-relationship test; Mar-2026 sham-contracting clampdown) · ATO (SG meaning-of-employee s.12(3); Virdis) · Jordan transcripts `2026-03-06:168`, `2026-04-30:71-73`.

---

## UPDATE 2026-06-05 — Customer-contact rule + build-now reframe (Allan)
**LOCKED business rule — subs get NAME + ADDRESS only, NEVER the customer's phone/email.** Timeless owns ALL customer comms; subs just show up + do the work. Rationale: **anti-poaching** (a sub with the customer's number can go direct next time → protect the relationship, our #1 asset); also cleaner for the sub (no admin).
**Build change required (Make Scenario 1):** `Add Job Contact` currently puts customer mobile/email on the SM8 job → **strip customer contact from the sub-facing job (name + address only).** Customer "on-the-way"/comms move to **GHL/Twilio (our side)**, NOT SM8's job-contact. (Cleaner — one home for customer comms. Note: this supersedes the earlier "SM8 auto-SMS off Job Contact" v1 plan.)
**Access-issue gap to plan for:** sub on-site, no answer → low volume: **Marko relays**; at scale: **masked/proxy number** (sub taps "call customer" → routes through a proxy → reaches them WITHOUT seeing the real number; Twilio/GHL).
**Build-now vs later (Allan wants it permanent, fears a messy migration once there are many subs + jobs):** REFRAME — a custom sub-app is a **VIEW on the same data (SM8 + GHL + Sheet), NOT a migration.** Adding it later = subs switch *screens*, not systems; nothing migrates. The permanent / hard-to-redo part is the **data + rules** (incl. this no-contact rule) — nail that now (we are). Recommendation: design the data now, run **5–10 real jobs** on SM8's own app/link, then build the sub-app on the *real* workflow (not a guess) — that's how you AVOID the rebuild. **Allan is weighing build-now; if he confirms, spec the build-now path (effort + time-before-first-dollar) so he decides with eyes open.**

---

## VIABILITY STUDY RESULT (2026-06-05 — 4-expert panel: SM8-integration eng + field-ops/Fair-Work + solution-architect + Cleo)
**Verdict: FEASIBLE. Unanimous panel rec = launch on the 3–5 day "Path A" first; build the custom app as a zero-migration screen-swap after ~10 real jobs (or in parallel via the AI team).**

**Can it connect to SM8 + do everything? YES** — 5 of 6 capabilities map to documented SM8 API (read jobs · webhook notify · nav · photo 2-step attach · mark complete). Accept/decline is the exception (no API — below).

**Two hard technical realities (shape ANY build):**
1. **SM8 key = full account access, NO per-sub scoping.** Can't hand subs a credential. → MANDATORY architecture: **sub-app → OUR backend (sole key-holder; per-sub auth e.g. Supabase JWT; sub↔job assignment table; contact-field filter; rate governor; webhook receiver; push) → SM8.** Subs never hold the key / never issue raw SM8 calls. This backend ALSO enforces the no-contact rule (strips phone/email from sub responses).
2. **Accept/Decline has NO API.** SM8 Network's native Convert-to-Job/decline is UI/email-only (Vendor object = read-only GET; Job Allocation API = staff-only/`staff_uuid`). → a custom app must **rebuild the accept/decline state machine** (custom status/badge + queue move). The only genuine "rebuild SM8 behaviour" piece.

**Tension between the two LOCKED rules — RESOLVED:** SM8 Network gives accept/decline FREE but CANNOT withhold customer contact (no field-level sender controls); a mediated custom app withholds contact but must rebuild accept/decline. **Belt-and-braces fix (do regardless of path): STOP writing customer phone/email onto the SM8 job (Make change) → contact physically absent from SM8 → no leak on either path. Customer comms → GHL/Twilio.**

**TWO PATHS:**
- **PATH A (3–5 days config, ~$0 — unanimous "do this first"):** SM8 Network (sub's own app/link → native accept/decline, Fair-Work-perfect) + the Make strip-contact change + ONE Make "job assigned → SMS to sub" scenario. Delivers no-contact + accept/decline + notifications + SM8's polished app (offline photos/nav/complete) immediately. Run ~10 jobs, learn the real workflow.
- **PATH B (≈2–4 wks PWA — the permanent view; build later OR in parallel):** React/Next **PWA on Supabase** + the backend (BFF/token-broker) + custom accept/decline engine. NOT no-code (Glide/Softr fail real push + offline). iOS PWA offline is weak (50MB cap, no Background Sync) → keep photo capture offline-tolerant/resumable; FlutterFlow only if iPhone offline photos prove mission-critical. It's a VIEW on the same SM8+GHL+Sheet data → **ZERO migration**; subs switch screens.

**Rate limits:** 180/min + 20k/day (HTTP 429). Backend MUST queue/throttle/backoff — photo-upload bursts (2 calls/photo) are the risk. Webhooks primary + **polling fallback** (SM8 webhooks auto-cancel after 72h of failures).

**DECISION (pending Allan):** Path A now + Path B later/parallel (panel rec) vs Path B first (delays launch ~2–4 wks, designs vs a guessed workflow).

**Sources:** ServiceM8 developer docs (webhooks-overview, attachments 2-step, getting-started/auth, http-response-codes/rate-limits, vendor read-only, job-allocations staff-only) · SM8 Network help · iOS-PWA-limitations · Supabase · Fair Work (s15AA).

---

## 🔒 SUB-ENGAGEMENT MODEL — LOCKED 2026-06-05 (single-account via the custom app)
**Unanimous: Cleo + field-ops/Fair-Work + Clifford, anchored on Allan's app-first decision. Resolves the §6-vs-06-05 "SM8 Network" tension.**

**LOCK:** subs engage via the **Timeless single-account dispatch app** — they authenticate to OUR app (Supabase Auth) → OUR one SM8 account (backend = sole SM8 key-holder); the app's built-in **accept/decline state machine = the right of refusal**. **SM8 Network (subs on their own accounts) is RETIRED as the canonical model** — retained ONLY as a documented **app-less interim (Path A)** if Allan ever launches before the app ships, and **NOT** as a layered model under the app (net-negative complexity). **Subs = app users, NOT SM8 "Staff"** (SM8 Staff seats = Marko/Allan/genuine employees only; the old §6 "subs-as-Staff" wording carries needless Fair-Work risk — dropped).

**Fair-Work — DEFENSIBLE (s15AA whole-of-relationship; Mar-2026 ATO/FWO construction clampdown):**
- App-provision is a **low-weight "tools" factor** — the high-cost load-bearing tools (grinder/coatings/abrasives/respirator/vehicle) are sub-supplied. The **high-weight factors** (own ABN, own tools+materials, ≥$10M PL, real no-penalty accept/decline, genuine delegation, self-scheduling, per-job invoicing) all point contractor and are **identical** on either model.
- The app's accept/decline is a **STRONGER evidence position** than Network's — it's **logged** (`audit_log`), so we can *prove* penalty-free declines to an auditor (Network's refusal is real but opaque/UI-only).
- The app is **NOT a "digital labour platform" (Part 3A / s15L)** — that regime catches two-sided marketplaces connecting contractors to the *public*; Timeless is the **principal/customer, not an intermediary**, so it does not bite.

**CANONICAL STATEMENT (use across all docs + the sub-agreement preamble):**
> Timeless engages each subcontractor as a genuine independent contractor. Work is **offered**, never assigned: the contractor receives job *offers* through Timeless's dispatch app and **accepts or declines each one at their sole discretion, with no penalty, ever, for declining**. Each contractor operates **their own business** — own ABN, own ≥$10M public-liability insurance, own tools/materials/vehicle, own commercial risk (rectifies substandard work at own cost) — sets their own booking within the customer's window, may delegate to a suitably qualified + insured substitute, is free to work for others, and **invoices Timeless per job**. The dispatch app is a convenience for offering and completing work; it is **not** the basis of the relationship and confers no employment. It is **not** a digital labour platform under Part 3A — Timeless is the principal/customer, not an intermediary. The contractor is **not** rostered, **not** paid for time, **not** on a timesheet/shift schedule, and is **not** held out as Timeless staff.

**BINDING GUARDRAILS (gate the app launch + the sub agreement on these):**
- **App guardrails (A1–A9):** **A1** offer-language only (never "assigned/rostered/your shift") · **A2** NO auto-assign (offer → decline → re-route, never re-assign) · **A3** decline **silent + zero-penalty** (no counter/score/throttle/coaching-trigger; reason optional) · **A4** NO roster/timesheet/clock-in UI (geofence may log job *duration* for ops, never as worked-hours) · **A5** NO "our team"/uniform/`@timelessresurfacing.com.au` identity · **A6** real **delegation/hand-back** path · **A7** **compliance gate** (ABN present + PL-verified + not expired) before any offer · **A8** per-job **sub invoice** (NOT an app-generated payslip) · **A9** **name + address only** to the sub.
- **Agreement clauses (B1–B11):** **B1** independent contractor (no PAYG/wage/leave language) · **B2** ABN listed · **B3** PL ≥$10M annual cert · **B4** own tools+materials · **B5** per-job pay vs **sub's invoice** (no timesheet) · **B6** express **penalty-free right to refuse** (no "must accept all") · **B7** **no exclusivity** · **B8** genuine **delegation** right · **B9** sub bears **rectification cost** · **B10** mutual 14-day termination · **B11** **rests on SUBSTANCE (own business/tools/ABN/risk), NOT "the app proves independence."**

**⚖️ LEGAL REVIEW — MANDATORY PRE-ENGAGEMENT GATE (owner: Allan; no sub is engaged until this clears):**
Have the sub agreement **and this engagement posture** reviewed by an **AU employment lawyer** (worker-classification specialist). This is a *Fair Work / sham-contracting classification* review — **distinct from** the Sprintlaw UCT/ACL contract-drafting in `sub-agreement-clauses.md` (drafting ≠ a classification opinion; do **not** assume the ~$200 Sprintlaw package covers it). Run the review on the *drafted* agreement (post-Sprintlaw), or have one firm both draft + opine.
Lawyer must confirm: **(1)** the posture rests on **substance** — own ABN · own ≥$10M PL · own tools/materials/vehicle · commercial risk (self-rectify) · penalty-free right to refuse · genuine delegation · no exclusivity · per-job invoicing — **not** on how the app is configured; **(2)** **zero** PAYG/wage/leave/timesheet/roster language; **(3)** it **survives the Mar-2026 ATO + FWO sham-contracting clampdown** on building & construction; **(4)** the app is **not** a Part-3A "digital labour platform" (Timeless = principal/customer, not an intermediary to the public).
**Exposure if mis-classified:** sham contracting **up to ~$99k/contravention** (small biz <15) + **super back-pay** + leave/PAYG + retrospective audit (`docs/sop/sub-sham-contracting-protections.md`).
**Ready-to-send brief:** `docs/specs/legal-review-brief-sub-engagement-2026-06-05.md`. *(Not legal advice — operational flag; get the professional review before any sub is engaged.)*

**Sources:** FWO whole-of-relationship (s15AA) + employee-like/Part-3A scope · ATO equipment/tools proportionality · Closing Loopholes No.2 (multi-factorial return) · blueprint §6 guardrails + data model.
