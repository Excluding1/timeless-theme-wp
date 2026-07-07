# Booking coordination: customer ↔ field worker (2026-07-07)

Answers Allan's question "Surface Care make technician and customer talk to each other to book a
date and time — how, and should we?" Research: official ServiceM8/GHL docs (2026-07-07).

## How Surface Care does it (ranked by likelihood)
1. **ServiceM8 built-in Two-Way SMS from the tech's job card** (~90% of the answer). The tech
   messages the customer from the SM8 app; the SMS comes from a ServiceM8/branded sender (never
   the tech's personal number); the customer replies via a branded web link with photo support;
   replies land in the job diary and push-notify the tech who last messaged. Zero build, free to
   activate on Starter+ plans.
2. **SM8 SMS Booking Links** for the initial date: office (or automation) texts a single-use link;
   the customer self-picks a slot filtered to the assigned tech's availability; SM8 auto-schedules
   and sends confirmation + day-before reminder (free Automation add-on). One-tap On-the-Way SMS.
3. GHL Conversations with techs on the mobile app — possible but unlikely at 70 techs (paid seats,
   duplicate scheduling). They use GHL pre-acceptance, SM8 post-booking.

## The catch for US
ServiceM8 has **no permission that hides customer contact details** from a staff login on an
assigned job (Security Roles Reference; SM8 Phone FAQs: "will display customer numbers"). Surface
Care's tech-chat flow leaks the number by design. Fine for them; violates our sub no-contact rule
(decision-sm8-keep-vs-build-2026-06-05).

## Our plan
**Phase 1 — enable now (zero build, zero leak):**
1. SM8: enable free **Automation** + **Online Booking** add-ons; define the 6 service categories
   as bookable Services with durations + eligible workers.
2. On acceptance+deposit: office sends the **SMS Booking Link** filtered to the assigned worker's
   availability → customer self-picks → auto-schedule + auto-confirm + day-before reminder.
3. Sub security role: unassigned-jobs OFF, SMS/Email buttons OFF, dispatch board OFF. Day-of
   coordination goes sub → office → customer, or the office-triggered On-the-Way SMS (sends from
   the company sender; template shows first name only).
4. Residual-leak mitigation: keep the customer's mobile on the client/billing contact; blank the
   job-contact mobile via the SM8 API (`jobcontact` endpoint) after booking confirms.

**Phase 2 — masked two-way chat (build inside the contractor app, ~2-4 dev-days):**
Customer texts our GHL number → GHL workflow webhook → Make → SM8 job diary + contractor-app
in-app chat. Sub replies in-app → Make → GHL sends the SMS from the company number. Nobody sees
anybody's number; everything logged in GHL Conversations + SM8 diary. (This is the Twilio
"masked communications" pattern using GHL LC Phone as the mask — no new SaaS.)

**Employees (Phase E2+ of the employee plan):** full SM8 staff experience including Two-Way SMS
is fine — the no-contact rule was a sub-specific control.

## RATIFIED 2026-07-08 (Allan): the masked chat relay — canonical design
Diagram: `docs/specs/assets/masked-relay-flow.svg` (also in the vault, note "9 Masked chat relay").

**The five hops:** Customer ⇄ GHL business number (0485 056 656) ⇄ Make.com bridge ⇄ contractor
app job-chat (+push) ⇄ field worker. Sequence: (1) customer texts the business number like any
normal SMS → (2) GHL workflow (trigger "Customer Replied", contact tagged with an active job)
webhooks it to Make → (3) Make inserts it into that job's `job_messages` thread and the app
pushes the worker's phone → (4) the worker replies in-app → Make → GHL API sends it to the
customer as an SMS from the business number. Customer sees only the business number; the worker
sees job + suburb + first name only. Every thread is visible in GHL Conversations (audit trail).

**Safeguards (ratified, built into the app):** preset-first messaging (one-tap chips: on my way /
running 15 or 30 min late / arrived / job complete / could we start earlier / please confirm
someone is home); free text rate-limited (10/hour, 30/day per job) and contact-blocked BOTH
directions (any phone/email pattern rejected at app AND database level); per-job chat kill
switch. **ETA feature:** "On my way" button with a 15/30/45/60-minute picker → instant customer
SMS "arriving in about X minutes" + a status chip on the job card.

**⭐ NOT sub-only — this is the ONE comms system for every field worker, including future
EMPLOYEES (Phase E2+ of the employee-transition plan).** For employees the number-masking is a
choice rather than a legal control, but running everyone through the same relay keeps: one
consistent customer experience, one audit trail, one training story, presets + ETA for everyone,
and customer contact data centralised in GHL instead of on personal phones. If a lead employee
ever needs direct contact, that is an office-granted exception, not the default.

**Build state:** app side (chat + presets + guards + ETA) = in the contractor-app finalise pass.
Remaining after that: 2 GHL workflows + 2 Make scenarios per the contract in contractor-app/README.

## Costs
SM8 SMS bundled per plan (Starter $29/mo ≈100 SMS, Growing $79 ≈300, Premium $149 ≈1,000; overage
A$0.10). Booking/confirm/reminder = one credit each. Automation + Online Booking add-ons free.
GHL LC Phone ~US$0.05-0.08/SMS segment. No GHL seats for subs, ever.
