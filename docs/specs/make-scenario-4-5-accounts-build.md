# Make Scenarios 4 + 5 — FINANCIAL CLOSE (GHL Accounts pipeline · invoice→paid)

**Status:** DESIGN 2026-06-07 — expert-make-automation-engineer + expert-ghl-operator. **Cleo-verify PENDING. Two open questions (R1/R2) need Allan's real billing motion before Scenario 5 is built.** Builds on Scenario 1 + 3 (done).

## 0. THE LOCKED MODEL — who invoices?
**Xero invoices · GHL tracks status only · Stripe is the payment rail.** (Decision 12 v2, `memory/decisions_locked_ghl_2026-05-05.md:300-306`; STATE.md:46-50 — Xero LIVE, Stripe app + Westpac feed + Stripe Clearing Account already connected.)
- **Xero** = the actual tax invoice + accounting/GST/ledger. Stripe charges auto-reconcile in. Make does NOT write to Xero in v1.
- **GHL** = CRM **status** only (Accounts pipeline + `Payment Status` field). Make never creates an invoice or holds money.
- **Stripe** = the payment; fires the webhook Scenario 5 listens to.

## 1. GHL Accounts pipeline (repurpose Marketing pipeline `xNke29x2DT0T6rFpDNbl`, 6 stages — Decision 12 v2:262-273)
1. **Awaiting Invoice** ← Scenario 4 creates the opp here on Sales Stage 15 entry
2. **Invoice Sent** (AC1 auto-age 7d)
3. **Customer Pay 7d** (AC2 14d + SMS)
4. **Customer Pay 14d** (AC3 30d + escalation)
5. **Overdue** (Slack #finance-overdue + task for Allan)
6. **Paid** ← Scenario 5 advances here on payment (terminal)
- Scenario 4 **creates a NEW Accounts opp** (Sales opp stays at Stage 15). Cross-linked via custom fields `linked_sales_opp_id` (on Accounts) + `linked_accounts_opp_id` (on Sales). Business key = `sales_opp_id` (same key Sc 1 & 3 use).
- AC1/AC2/AC3 auto-age are **GHL-native workflows, not Make.**

## 2. Scenario 4 — Job Complete → Awaiting Invoice (settled, buildable)
GHL workflow on Sales Stage 15 → webhook → Make: `[1] webhook + secret gate → [2] Reserve dedup (new store accounts_opps, key=sales_opp_id, overwrite-OFF) → [3] GHL Create Opp in Accounts:Awaiting Invoice (+ linked_sales_opp_id) → [4] GHL Update Sales opp (linked_accounts_opp_id + Payment Status=not_invoiced) → [5] finalise reservation → [6] Slack #finance-summary`. Idempotent on `sales_opp_id`; Slack-on-error. Same proven pattern as Sc 1.

## 3. Scenario 5 — payment → Paid  ⚠️ GATED on R2 (see below)
Stripe webhook → Make: `[1] webhook (HMAC verify) → [2] respond 200 → [3] filter to the BALANCE event + type=final → [4] require metadata.sales_opp_id (else Slack unmatched) → [5] dedup on Stripe event id (store stripe_paid_events) → [6] find Accounts opp by linked_sales_opp_id → [7] skip if already Paid → [8] GHL move Accounts opp→Paid → [9] GHL Sales opp Payment Status=paid + Final Payment fields → [10] Slack #finance-summary`. Two-belt idempotency (event-id + stage check).

## ⚠️ OPEN QUESTIONS — resolve before building Scenario 5
- **R2 (make-or-break): WHICH Stripe event + HOW Allan bills the balance.** If balance = a **Stripe Checkout/payment link** → listen for `payment_intent.succeeded` + `metadata.type=final` (canonical FUTURE-PLAN:201). If balance = a **Xero invoice with "Pay now (Stripe)"** → listen for `invoice.paid` + `metadata.payment_type=final`. **Listening for the wrong one = Scenario 5 silently never fires.** Allan hasn't billed a real customer yet → UNDECIDED.
- **R1 (make-or-break): the Stripe→opp match needs `metadata.sales_opp_id` stamped at link/invoice creation.** If the balance link can't carry that metadata, every payment lands in the "unmatched" Slack queue. Must verify the metadata survives Allan's real billing path.
- **R3:** no double-count — GHL holds no money, Xero books cash once (Stripe Clearing Account). Guarded by type-filter + event-id dedup + stage-check.

## Prerequisites (Allan, GHL + Stripe)
Rename Marketing pipeline → Accounts + its 6 stages (capture stage-1 + stage-6 IDs) · create `linked_sales_opp_id` / `linked_accounts_opp_id` custom fields · build AC1/AC2/AC3 GHL workflows · **stamp `metadata.sales_opp_id` + `metadata.type` on the balance payment link/invoice** · create the Stripe webhook endpoint (LIVE key) + copy signing secret · create `#finance-summary` + `#finance-overdue` Slack channels · **rotate the exposed GHL PIT** (first Make→GHL writes).

## ⚠️ Payment methods + the 2026 surcharge ban (LOCKED 2026-06-08)
**AU bans card surcharges from 1 Oct 2026** (RBA, announced 31-Mar-2026): no surcharge on Visa / Mastercard / eftpos (debit OR credit). **Do NOT build a card-surcharge option** — it's illegal from Oct. Offset: interchange cut 0.8%→0.3% (merchant card cost DROPS). Stripe fees = not reclaimable from Stripe, but **tax-deductible + GST-creditable**. **Payment model: bank transfer (no fee → 100%) + card via Stripe (absorb the small/shrinking fee, NO surcharge).** **Scenario 5 impact:** only the **card (Stripe)** path auto-marks-paid via the webhook; a **bank transfer has no Stripe event** → "Paid" comes from **Xero / bank feed** (manual mark or a Xero-side trigger). Scenario 5 must handle BOTH paths — reinforces the R2 deferral.

**Source:** Decision 12 v2 (`memory/decisions_locked_ghl_2026-05-05.md:245-318`) · CEO.md Override 14 v4 · STATE.md:46-50 · FUTURE-PLAN §2.4/§4.6. Full expert build sheet in session transcript 2026-06-07.
