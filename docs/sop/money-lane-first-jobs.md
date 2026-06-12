# MONEY LANE — manual SOP for jobs 1–5 (deposit → booking → invoice → paid)

**Created 2026-06-12 (task #2 of the co-signed order; closes the "Lisa's yes has nowhere to land" gap).**
**Scope:** fully MANUAL for jobs 1–5 — no new automation gets built mid-first-job. Every message is sent by
Allan from the GHL conversation using the M1–M8 pack below (Rule-8 dual-CEO approved). Automation map for
later = §8. Authority refs: CEO.md SLAs :1805-1820 · refund authority :1834-1847 · refund policy :1874-1878 ·
sub-risk playbook §10 (non-payment) · GST = REGISTERED (STATE.md §1, 2026-06-12).

---

## 1. THE SEQUENCE (one glance)
Customer says YES → **M1 deposit link** → deposit PAID → **M2 booking confirm** (+ move GHL stages) →
**M3 day-before** → job day → done → **M4 cure-time** → **M5 Xero invoice by SMS** → paid → reconcile →
(if late: **M6** 7d → **M7** 14d → **M8** 30d → formal path).

**GHL stage mapping while doing it:**
| Moment | Drag opp to |
|---|---|
| Customer says yes | 07 Quote Accepted |
| M1 sent | 10 Prepayment Invoice Sent |
| Deposit paid | **11 Job in ServiceM8** ← ⚠️ this drag FIRES the certified Make pipeline (SM8 job + Sheet + #new-jobs). Deposit-paid is the gate; never drag to 11 before money is in. |
| Date agreed with customer | 14 Job Booked |
| Job finished (SM8 marked Completed) | 15 auto via back-sync — do not drag |

## 2. Stripe deposit link (~2 min, per job while volume is low)
1. dashboard.stripe.com → **Payment Links → + New**.
2. Product: **+ Add new** → name it `Deposit — <first name> <suburb> — <service>` (this name is your
   reconciliation breadcrumb) → price = the 10% figure ($59 / $68 / $76 for the basin tiers) → AUD.
3. After payment: show confirmation page with message "Deposit received. Allan will text you to lock in
   your day." → Create link → copy → paste into **M1**.
4. You'll get the Stripe app/email ping when it pays. Money lands in the Westpac payout cycle (2-3 days);
   the JOB proceeds on the Stripe notification, not the bank settlement.
*(Later, higher volume: one reusable "choose what you pay" deposit link, or GHL native Stripe invoices.
 Not for job #1.)*

## 3. Booking + day-before (M2, M3)
- Agree the date with Marko first (he self-performs jobs 1-3), then send **M2** with date + arrival window.
- Day before, send **M3**. For a basin job the prep ask = clear the benchtop + the cupboard under the sink.
- Morning-of "on the way" text (M3.5) = optional nicety; per Cleo keep v1 lean unless the window is wide.

## 4. Manual Xero invoice (after M4, same evening as the job — ~5 min)
1. Xero → **Business → Invoices → New invoice**.
2. Contact: create the customer (name, mobile, email from GHL).
3. Line item = the accepted tier scope in plain words, e.g.
   `Basin restoration (Recommended): hairline crack stabilisation, new chrome pop-up waste, full bowl
   resurface in gloss white, fresh silicone at benchtop junction. 3 year warranty on the new finish.`
4. Amount = the FULL quoted price **inc GST** (Xero shows the GST split automatically — we are registered;
   the amounts-are-tax-inclusive setting should be on for the line).
5. Due date = **7 days**. Online payments: **Stripe pay-now ON** (the app is installed). Approve.
6. **Record the deposit against it:** open the approved invoice → Add payment → amount = the deposit,
   date = the day it hit Stripe, paid to = Stripe Clearing Account. Balance due now shows price − deposit.
7. Copy the **online invoice link** → send **M5** by SMS (email stays off until DKIM is live).
8. When the balance pays: Stripe app posts it → reconcile both Stripe rows against the invoice when the
   bank feed shows them. (⚠️ Westpac feed activation still needs verifying — STATE.md §2.)
9. HBA guard: every invoice stays **under $5,000 inc GST**; multi-bathroom = separate invoice per bathroom.

## 5. Overdue cadence (Cleo-checked vs ASIC RG 96 — the debt-collection guideline binds CREDITORS like us,
not just agencies: business hours only, identify yourself, dispute path offered, no pressure beyond facts)
- Day 7 → **M6** friendly nudge · Day 14 → **M7** firmer + offer to sort issues · Day 30 → **M8** final
  notice (7-day warning of formal recovery).
- **This cadence is the MAXIMUM** — no extra chase messages between the steps.
- **M8 only if formal recovery is genuinely intended** (no bluffing — RG 96 treats empty threats as
  misleading conduct). After M8 + 7 days: formal letter of demand (template = sub-risk playbook §10), then
  NCAT/small-claims (NSW, <$20k) — Allan + Clifford draft together if it ever comes to that.

## 6. Refunds / disputes (CEO.md verbatim ladder)
- Authority: ≤$200 Marko alone · $200–500 Marko documents reason · $500–1,500 Marko + Allan ·
  >$1,500 Marko + Allan + CEO + insurance broker first (CEO.md:1836-1841).
- Deposit non-refundable once job booked + resourced; ALWAYS refunded if WE cancel (CEO.md:1844-1847).
- 100% refund if work doesn't match scope and rectification impossible; partials by agreement; all refunds
  via Stripe within 3 business days of approval (CEO.md:1874-1878).
- **Stripe chargeback:** respond in the Stripe dashboard within the deadline with: the quote SMS thread,
  the customer's photos, our completion photos, the invoice, and the booking confirmation. Never ignore one.

## 7. THE MESSAGE PACK (M1–M8, Cleo-approved 2026-06-12 — send from the GHL conversation; fill {{...}})
**M1 deposit** (Cleo amendment applied: scope + total restated for the record; link at end of line so SMS
clients don't break the URL):
> Great choice {{first_name}}. For {{service_summary}}, the total is {{total_price}} including GST, with a
> 10% deposit of {{deposit_amount}} to lock in your day. The rest is only due after the job is done, and as
> soon as the deposit is in I will text you our next available days. Secure card link: {{stripe_link}}

**M2 booking confirm:**
> Locked in {{first_name}}. Your {{service_summary}} is booked for {{date}}, arrival between {{window}}.
> It takes about {{duration}} on the day and the area is ready to use 24 hours after we finish. Deposit
> received, balance only due after the job. Anything changes, just reply here. Allan

**M3 day-before:**
> Hi {{first_name}}, quick reminder we are coming tomorrow, arriving between {{window}}, for your
> {{service_summary}}. If you can, please clear the area (for a basin job, just the benchtop and the
> cupboard underneath). If anything has changed reply here. See you tomorrow. Allan

**M3.5 on-the-way (optional, morning of — Cleo: worth it for job #1, manual only):**
> Morning {{first_name}}, Allan here. We are on the way and expect to arrive around {{eta}}. See you soon.

**M4 done + cure:**
> All done {{first_name}}! One care note: please give the new surface 24 hours before using it, then it is
> good to go. I will text your invoice shortly. Thanks for trusting us with the job. Allan
> *(bath/shower variant: "24 to 48 hours" — match what was said on the day)*

**M5 invoice:**
> Hi {{first_name}}, here is your invoice for the completed job. You can pay by card through the link or
> bank transfer using the details on it. The deposit you paid is already deducted. Any questions just
> reply. Thanks again, Allan: {{xero_invoice_link}}

**M6 — day 7:**
> Hi {{first_name}}, Allan here. Friendly nudge that your invoice is still open. The card link takes about
> a minute, and if anything on the invoice looks wrong tell me and I will fix it: {{xero_invoice_link}}

> **Decision 13 (2026-06-13): M7 and M8 send as "Accounts, Timeless Resurfacing" role-voice (not Allan's
> personal sign-off, never an invented name) and move to EMAIL once DKIM is live — formal record + keeps
> the SMS thread warm. M1-M6 stay Allan-voiced.**

**M7 — day 14:**
> Hi {{first_name}}, your invoice from {{job_date}} is now two weeks overdue. If something is holding
> things up, reply and we will sort it together. Otherwise I would appreciate it being settled this week.
> Allan: {{xero_invoice_link}}

**M8 — day 30 (final):**
> Hi {{first_name}}, final reminder about the unpaid invoice from {{job_date}}. If it is not paid or a plan
> agreed in the next 7 days I will need to start formal recovery, which I would much rather avoid. Reply
> here and we can still sort it out. Allan

All messages are TRANSACTIONAL under the Spam Act — no STOP line required — **provided they stay free of
any upsell, promo, review request, referral ask or marketing link** (Cleo, citing current ACMA enforcement:
sales content turns a service message into marketing). The review/NPS ask happens later via its own
workflow, never inside these. Send within business hours only (M6-M8 especially).

## 8. LATER — the automation map (build AFTER job #1 proves the sequence)
- M2/M3/M4 → GHL workflows triggered by stage 14 entry / appointment-1-day-before / stage 15 entry.
- Deposit: GHL native Stripe or keep Payment Links + a Make watcher (R2 decision: DEPOSIT via payment-link
  event; FINAL via Xero `invoice.paid` as the single source of truth) → Make Scenario 5 → GHL Payment
  Status field + Accounts pipeline (Scenario 4 spec: docs/specs/make-scenario-4-5-accounts-build.md).
- M6-M8 → GHL Accounts-pipeline auto-age workflows.
- Exit criteria for "money lane DONE" on the master map: one real job through M1→M5 + reconciliation, with
  every message sent on time and the deposit gate respected.
