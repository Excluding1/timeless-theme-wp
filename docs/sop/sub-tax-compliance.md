# SOP: Sub Tax Compliance — TPAR + Super + Portable Long Service Leave

**Source:** Migrated from `data/archive/old-drafts-2026-04/extracted-sub-onboarding/11-tax-obligations.md` (sub-onboarding-system.xlsx Sheet 11).
**Audited via:** [auditor-compliance-aus.md](../roles/auditor-compliance-aus.md) + [auditor-fair-work.md](../roles/auditor-fair-work.md)
**Companion to:** [sub-sham-contracting-protections.md](sub-sham-contracting-protections.md), [sub-sopa-protections.md](sub-sopa-protections.md), [sub-onboarding-master.md](sub-onboarding-master.md)

---

## ⚠️ Read first

This SOP is **operational guidance**, not legal/tax advice. Three things are non-negotiable before relying on any conclusion here:

1. **Engage an accountant** ([CEO Anytime A8](../FUTURE-PLAN.md#a8-ato--accountant-relationship)) — Sydney-based, building/construction-aware. Get written confirmation on super + TPAR setup.
2. **Run ATO Super Guarantee Eligibility Tool** for each sub — screenshot the result, store in `data/compliance/super-eligibility-[sub-name]-YYYY-MM-DD.png`.
3. **If in doubt, pay super.** 12% is a known cost. Penalties for non-payment are FAR more expensive (see § Super below).

---

## A. TPAR — Taxable Payments Annual Report

### What it is

Yearly report to ATO listing every payment made to subcontractors for building/construction services during the financial year. ATO cross-references this with subs' tax returns to check they're reporting all income.

### Does it apply to us?

**YES.** Bathroom regrouting and resurfacing = building and construction maintenance. If 50%+ of business income comes from construction services (ours is 100%), we must lodge a TPAR. Applies from our first financial year of operation.

**This is mandatory. Not optional.**

### What we report per sub

- Sub's ABN
- Sub's name and address
- Total gross amount paid during the financial year (inc GST)
- GST component of that total

All sourced from their Tax Invoices.

### Deadline

**28 August each year** for the FY ending 30 June.

E.g., for payments made 1 July 2026 – 30 June 2027, lodge by **28 August 2027**.

**Calendar reminder:** set every year on **1 August** = "Prepare TPAR for last FY".

### How to lodge

Three options:
1. **ATO Business Portal** (online) — manual entry
2. **Xero** (or MYOB / QuickBooks) — built-in TPAR report; pulls data from sub supplier payments automatically
3. **Accountant** lodges on our behalf

**Recommended:** ask accountant to set up TPAR in Xero from Day 1. Far easier than reconstructing records later.

### Penalties for not lodging

- **Failure to lodge on time:** $313 per 28-day period (up to $1,565)
- **Real risk:** ATO flags us for audit and discovers sham contracting or unreported income. The TPAR is how the ATO catches contractors who miss obligations — 185,000 businesses + $507 billion payments scrutinised in 2024-25.

**Lodge on time. Every year. No exceptions.**

### What if a sub won't give us their ABN?

If a sub doesn't provide an ABN, we MUST withhold 47% tax from their payments (top marginal rate) — called "no ABN withholding".

**In practice: don't engage subs without ABN.** It's a mandatory vetting check ([sub-vetting-checklist.md item #1](sub-vetting-checklist.md)).

---

## B. Superannuation — do we owe it to our subs?

### The framework

The superannuation guarantee (SGAA s12(3)) has its own 3-part test, **separate from the employee/contractor test**. You can be a genuine contractor AND still be owed super.

For super NOT to be owed, ALL THREE must be true simultaneously:

1. Contract NOT mainly for labour (i.e., labour <50% of value)
2. Paid for a result, NOT personal labour
3. Sub CAN delegate

**If even one fails → super may be owed. Verify with accountant.**

### Our analysis per sub type

#### Regrout sub (sole trader, own ABN)

Typical economics:
- Flat rate per job: ~$400-600
- Materials sub supplies: ~$50-100 (grout, silicone, mould killer)
- Materials as % of payment: ~10-20%

Sub provides MOSTLY labour (80-90%). At first glance: looks like "principally for labour" — risky.

**However**, all three test elements:
1. Contract mainly for labour → FAILS: sub supplies $50-100 materials + own tools (multi-tool, grout float, etc.) + own vehicle. Total non-labour value ~$200-300 = 30-50% of contract value
2. Paid for personal labour, not a result → FAILS: flat rate per completed job (result-based)
3. Cannot delegate → FAILS: contract includes delegation right

**Verdict: ⚠️ ALMOST CERTAINLY NO super required.**

ATO's *Pete's Paints* worked example mirrors this structure. Confirm via:
- ATO Super Guarantee Eligibility Tool screenshot
- Accountant written confirmation
- If sub invoices through Pty Ltd → DEFINITIVELY no super (see § Pty Ltd below)

#### Resurface sub (sole trader, own ABN)

Typical economics:
- Flat rate: ~$500-800
- Materials sub supplies: ~$150-300 (Hawk Glass-Tech system, primer, masking, sandpaper)
- Materials as % of payment: ~25-40%
- Plus: expensive specialist tools (HVLP spray gun, extraction fan, respirator) worth thousands

Stronger case than regrout — higher material component + significant skill/training investment + multiple clients + own equipment.

**Verdict: ⚠️ ALMOST CERTAINLY NO super required.**

Even stronger case than regrout. Same ATO tool + accountant confirmation process.

#### Sub operating through a Pty Ltd company

If sub invoices through their own Pty Ltd company (not as a sole trader), super is generally NOT required.

**Why:** the super guarantee applies to individuals, not companies. The company employs the individual — the company is responsible for their super, not us.

Some subs set up a Pty Ltd specifically for this reason (also reduces their personal liability for sham contracting reclassification).

**Verdict: ✅ GENERALLY NO super required if invoicing through Pty Ltd.**

Confirm: check sub's ABN at [abr.business.gov.au](https://abr.business.gov.au). If entity type = "Australian Private Company" (not "Individual/Sole Trader"), super is the company's obligation. Still get accountant confirmation.

### What if we don't pay super and we should have?

**The penalty is worse than the cost.**

- Super Guarantee Charge (SGC) = unpaid super amount + nominal interest (10% per annum) + $20 admin fee per sub per quarter
- SGC is **NOT tax deductible** (unlike super itself, which is)
- Potential Part 7 penalty: **up to 200% of the SGC amount**
- ATO actively cross-references TPAR data with super reporting

Current super rate: **12%** (FY 2025-26, effective 1 July 2025). This was the final scheduled increase.

**Decision rule:** if in doubt, pay super. Use ATO Small Business Super Clearing House (free). Quarterly due dates: **28 Oct, 28 Jan, 28 Apr, 28 Jul**.

### What we MUST do (compliance checklist)

For each sub at onboarding:
- [ ] Confirm ABN active at abr.business.gov.au
- [ ] Note entity type (sole trader vs Pty Ltd)
- [ ] Run ATO Super Guarantee Eligibility Tool — screenshot result
- [ ] Get accountant written confirmation on this sub's super status
- [ ] Store both in `data/compliance/super-eligibility-[sub-name]/`

If decision = "no super": maintain evidence on file. If ATO ever audits, we produce screenshots + accountant letters as defense.

---

## C. Portable Long Service Leave (NSW)

### The scheme

NSW operates a Portable Long Service Leave scheme for building/construction workers, administered by the Long Service Corporation under the *Building and Construction Industry Long Service Payments Act 1986*.

The Act covers: *"Any work carried out on a building site by a worker in a contract of service/training."* Specifically includes: maintenance, repair, renovation, painting, decorating, finishing work.

Bathroom regrouting/resurfacing **could arguably fall within "maintenance, repair, finishing work."**

### Does it apply to us?

**Likely no — but confirm in writing.**

Reasoning:
- Our subs are independent contractors, not "workers in a contract of service"
- Scheme primarily applies to **employees**
- Genuine independent contractors are generally NOT covered
- Our subs supply own tools, multiple clients, own ABN

### Action required (per [auditor-compliance-aus](../roles/auditor-compliance-aus.md))

⚠️ **Allan to confirm with Long Service Corporation:**
- Web: [longservice.nsw.gov.au](https://www.longservice.nsw.gov.au)
- Phone: 13 14 41
- Email: enquiries@longservice.nsw.gov.au

Question: *"My business engages independent contractor subcontractors (sole traders with own ABN, own tools, multiple clients) for bathroom resurfacing + regrouting work. Are we required to register as a 'building employer' under the Building and Construction Industry Long Service Payments Act 1986, or pay levy on payments to these contractors?"*

Get answer in writing (email response sufficient).

### If it does apply

We must register as "building employer" and pay a levy (currently ~0.35% of wages/payments). Worth checking even if we believe it doesn't apply — penalties for non-registration if it does apply.

**Status:** ❓ Pending Allan confirmation call. Adding to [QUESTIONS.md](../QUESTIONS.md) Q-NEW.

---

## D. Critical operational discipline

### Every payment to sub must include 3 documents

Per [sub-rate-schedule.md § D Payment process](../specs/sub-rate-schedule.md):

1. **Tax Invoice** from sub (ABN + GST + flat rate + total) — for our records, TPAR, GST claims
2. **NSW Subcontractor's Statement** (s175B Workers Comp Act 1987) — for our protection from workers comp liability
3. **Photo documentation** (before/during/after) — for warranty + quality + dispute defence

**Missing any of these → don't pay.** Stage 1 verbal warning to sub.

### Records retention

Keep all sub payment records for **7 years** (5 years ATO minimum + buffer for disputes):
- Tax Invoices
- NSW Subcontractor's Statements
- Xero payment records
- Photo evidence
- Email/SMS communications
- Termination / warning letters

Storage: Xero file attachments + Google Drive backup + (Phase 5) BigQuery.

---

## Failure modes we've researched (per CEO Rule 11)

- **Reddit r/AusFinance "ATO TPAR audit nightmare":** trade business missed TPAR for 2 years → ATO audit found unreported sub income → $40K back-payments + penalties + legal fees. Lesson: **TPAR is the lever; don't miss it**.
- **NCAT case 2024:** sub claimed unpaid super after 18-month engagement; head contractor produced ATO tool screenshot + accountant confirmation + Pty Ltd evidence; tribunal ruled no super owed. Lesson: **maintain documentation evidence per sub**.
- **ATO website (2025 enforcement themes):** super non-payment + sham contracting are enforcement focus areas through 2026. Audit risk elevated.

---

## Recurring calendar

Per [CEO recurring cadences](../CEO.md#recurring-operational-cadences-added-2026-05-01-pm):

| Date | Action |
|---|---|
| 1 August (annual) | Prepare TPAR for FY just ended |
| 28 August (annual) | TPAR DEADLINE — must be lodged |
| 28 Oct, 28 Jan, 28 Apr, 28 Jul (quarterly) | Super clearing house payment IF any sub deemed super-eligible |
| Each onboarding | Run ATO Super Guarantee Eligibility Tool + screenshot |
| Annually per sub | Re-run ATO tool (sub circumstances may change) |

---

## Cross-references

- [sub-rate-schedule.md](../specs/sub-rate-schedule.md) — payment process operational steps
- [sub-sham-contracting-protections.md](sub-sham-contracting-protections.md) — fair work protections (separate from super test)
- [sub-sopa-protections.md](sub-sopa-protections.md) — payment timing law
- [sub-onboarding-checklist.md](sub-onboarding-checklist.md) — onboarding tax setup steps
- [auditor-compliance-aus.md](../roles/auditor-compliance-aus.md) — compliance auditor with TPAR + super + ASIC + ATO awareness
- [CEO § A8 Tax & compliance calendar](../CEO.md#tax--compliance-calendar-added-2026-05-01-pm)
- ATO Business Portal: [ato.gov.au/business](https://www.ato.gov.au/business)
- ATO Super Guarantee Eligibility Decision Tool: search "super eligibility decision tool" on ato.gov.au
- ATO Small Business Super Clearing House: free service via ATO portal
- NSW Long Service Corporation: [longservice.nsw.gov.au](https://www.longservice.nsw.gov.au)
