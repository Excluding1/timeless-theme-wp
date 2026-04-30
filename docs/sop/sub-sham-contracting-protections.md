# SOP: Sham Contracting Protections — Stay on the Contractor Side of the Line

**Source:** Migrated from `data/archive/old-drafts-2026-04/extracted-sub-onboarding/06-sham-contracting.md` (sub-onboarding-system.xlsx Sheet 06).
**Audited via:** [auditor-fair-work.md](../roles/auditor-fair-work.md) + [auditor-compliance-aus.md](../roles/auditor-compliance-aus.md)
**Companion to:** [sub-agreement-clauses.md](../specs/sub-agreement-clauses.md), [sub-tax-compliance.md](sub-tax-compliance.md), [sub-onboarding-master.md](sub-onboarding-master.md)

---

## Why this SOP exists

The Fair Work Ombudsman + ATO are actively targeting building/construction in 2025-26 for sham contracting. Penalties:
- **Up to $99,000 per contravention** for businesses <15 employees
- **Up to $495,000** for businesses 15+
- Plus back-payment of super, leave, workers comp, PAYG
- Plus retrospective audit risk going back several years

**One mistake here = company-killer.** This SOP defines exactly how our contractor relationships must look so we stay on the right side of the line.

---

## The 9 indicators (Fair Work Act 2009 + 2024 amendments)

Each row: how a genuine contractor relationship looks vs how an employee relationship looks. Our model must look like the **contractor column** for ALL 9.

| # | Indicator | ✅ Contractor (us) | ❌ Employee (we'd be liable) |
|---|---|---|---|
| 1 | **Control over HOW work is done** | Sub decides how to regrout/resurface. We set quality standard + scope; they choose methods, tools, sequence. | We tell them exactly how to do each step, supervise on site, dictate procedure. |
| 2 | **Tools and materials** | Sub supplies own tools, vehicle, materials at own cost. | We supply tools/materials/vehicle. We provide branded clothing. |
| 3 | **Ability to refuse work** | Sub can decline a job offer with no penalty. | Sub must accept every dispatched job, penalised for refusing. |
| 4 | **Works for others** | Sub has other clients. Can work for competitors. | Sub works exclusively for us, not allowed to work elsewhere. |
| 5 | **Financial risk** | Sub quotes flat rate. If job takes longer, they absorb. If materials cost more, they absorb. | We pay hourly. Sub has no financial risk — paid regardless of efficiency. |
| 6 | **Delegation** | Sub can send a qualified replacement (with our quality approval). | Specific person must do the work; cannot delegate. |
| 7 | **Integration** | Sub not part of team meetings, no company email, doesn't attend our office, doesn't wear our uniform. | Sub has company email, attends meetings, listed as "our team" on website, wears branded uniform. |
| 8 | **Tax and super** | Sub handles own ABN, BAS, tax. Invoices us with Tax Invoice. We don't withhold PAYG. | We withhold PAYG, pay their super (note: super may apply even for genuine contractors per s12(3) SGAA — see [sub-tax-compliance.md](sub-tax-compliance.md)). |
| 9 | **Engagement nature** | Engaged per job. No guarantee of ongoing work. Can pause/end without notice. | Guaranteed minimum hours per week, ongoing open-ended engagement. |

### How our agreement enforces each indicator

| Indicator | Sub Agreement clause that enforces it |
|---|---|
| 1. Control | Clause 1 (independent contractor status), Clause 26 (sub controls method) |
| 2. Tools/materials | Clause 4 (sub supplies materials), Clause 26 (sub supplies own tools/vehicle) |
| 3. Refuse work | Clause 1 + Clause 32 (declining = no penalty; only accepted-then-cancelled is penalised) |
| 4. Multiple clients | Clause 1 + recruitment ad explicitly says "you maintain own business" |
| 5. Financial risk | Clause 4 (flat rate), Clause 6 (sub absorbs rectification cost) |
| 6. Delegation | Clause 1 explicit delegation right (with quality approval) |
| 7. No integration | Clause 26h (no business cards), no company email issued, no uniform |
| 8. Tax | Clause 16 (sub provides Tax Invoice + ABN), no PAYG withholding |
| 9. Per-job engagement | Clause 1 + Clause 12 (either party can terminate) |

References to specific clauses: see [docs/specs/sub-agreement-clauses.md](../specs/sub-agreement-clauses.md).

---

## ⚠️ Superannuation note (separate from contractor/employee test)

**You can be a genuine contractor AND still be owed super under s12(3) SGAA.** The "principally for labour" test for super is SEPARATE from the employee/contractor test. Don't conflate them.

**Our analysis: super almost certainly NOT required.** The ATO 3-part test (s12(3)):
1. Contract mainly for labour → **FAILS**: subs supply $50-300 materials + tools + vehicle
2. Paid for personal labour, not a result → **FAILS**: flat rate per completed job (result-based)
3. Cannot delegate → **FAILS**: contract includes delegation right

All three must be true simultaneously for super obligation. We fail all three. ATO's own *Pete's Paints* worked example mirrors our structure.

**MUST do before relying on this:**
- [ ] Run ATO Super Guarantee Eligibility Tool ([ato.gov.au](https://www.ato.gov.au)) — screenshot result, store in `data/compliance/`
- [ ] Get accountant written confirmation ($100-200) — store with sub file
- [ ] If sub invoices through Pty Ltd company → super DEFINITIVELY not required (super is the company's obligation to its employees, not ours)

**If still in doubt: pay super.** 12% is a known cost. The Super Guarantee Charge (SGC) + Part 7 penalties + non-deductibility is far more expensive than just paying.

See [sub-tax-compliance.md](sub-tax-compliance.md) for full TPAR + super + portable leave analysis.

---

## How we audit ourselves quarterly

Per [auditor-fair-work.md](../roles/auditor-fair-work.md) — every quarter, run the 9-indicator audit on each active sub:

For each sub:
- [ ] Are we **controlling HOW**, or just specifying scope/quality?
- [ ] Are they **supplying own tools + materials + vehicle**?
- [ ] In the last 90 days, have we **let them refuse a job** without penalty?
- [ ] Do they have **other clients we know of** (no exclusivity)?
- [ ] Are they **on flat-rate per job** (not hourly)?
- [ ] Has the **delegation right been respected** (e.g., they sent a qualified replacement once with our approval)?
- [ ] Are they **NOT integrated** (no email, no uniform, not on website "team" page, not in meetings)?
- [ ] Are they providing **proper Tax Invoices with ABN**, no PAYG withheld?
- [ ] Is the engagement **per-job, not guaranteed-hours**?

**Score: 9/9 = compliant. Below 9 = adjust immediately.** Document the audit in `data/compliance/quarterly-fair-work-audit-YYYY-MM.md`.

---

## Real working arrangement matters MORE than contract wording

The Fair Work 2024 amendments + ATO test look at **the whole-of-relationship reality**, not just contract terms. Sham contracting cases get won/lost on:
- How dispatch actually works (do we tell them HOW or just WHAT?)
- Whether they actually refuse jobs without consequence
- Whether they actually have other clients
- Whether they actually supply own materials (or do we secretly cover the cost)

**Operating discipline:**
- Brief Marko clearly: "When dispatching, send the job + scope + customer photos. Don't tell the sub HOW to do the regrout. They're the expert."
- Don't message subs daily for "check-ins" that look like supervision
- Don't pre-buy materials and hand to subs — they buy + claim back via job rate
- If a sub starts looking like an employee (heavy supervision needed), it's a quality issue → coach + remove, not micromanage

---

## Failure modes we've researched (per CEO Rule 11)

**Real cases (from research):**
- *Wormald v Daniels* (2024 FWC 1422): tradie reclassified as employee due to integration (company email + uniform + exclusive work) despite contract saying "contractor." Penalty $87K + back-pay.
- *NCAT 2023 dispute*: customer complained about poor work; tradie sued head company for unpaid super arguing employee status. Lost (delegation right preserved) but cost $15K legal defence.
- *FWO 2025 enforcement push*: building/construction sector targeted. Compliance officers visiting head contractors unannounced.

**Reddit r/AusFinance + r/AusLegal** confirms common founder mistake: thinking the contract alone protects them. **The contract is necessary but not sufficient.** Real working arrangement must match.

---

## Cross-references

- [sub-agreement-clauses.md](../specs/sub-agreement-clauses.md) — the 32 clauses that operationalise these protections
- [sub-tax-compliance.md](sub-tax-compliance.md) — TPAR + super + portable leave deep-dive
- [sub-onboarding-master.md](sub-onboarding-master.md) — master orchestration
- [auditor-fair-work.md](../roles/auditor-fair-work.md) — fair work audit lens
- [auditor-compliance-aus.md](../roles/auditor-compliance-aus.md) — AU compliance auditor with SWMS + sham + ASIC + ATO awareness
- ATO Super Guarantee Eligibility Tool — [ato.gov.au](https://www.ato.gov.au) (search "super eligibility decision tool")
- Fair Work Ombudsman sham contracting page — [fairwork.gov.au](https://www.fairwork.gov.au)
