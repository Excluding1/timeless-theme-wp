# Spec: Sub-Led Site Inspections for Big Jobs (FUTURE — Phase 2-3)

**Status:** CAPTURED 2026-06-02 — Clifford + Cleo Pattern-C converged. **NOT operational yet** (0 subs signed; needs Sydney-wide sub density first). This is the ready-to-build spec; the operational build is gated on Phase 2-3 sub density.

## Decision (both CEOs agree)
Sub-led site inspections are a **future big-job EXCEPTION layer — not the default quoting path.** Photo-first quoting remains the operating doctrine (Jordan's model + Decision 1: mandatory site inspection only for asbestos `built_before_1990 != "no"`; everything else = quoter judgement from photos). For **big / ambiguous / high-risk jobs** where photos can't protect scope, margin, asbestos risk, or trust, a **nearby sub (<20 min drive)** does the inspection: measures, documents, reports scope back. **Timeless quotes**; if the customer accepts, the **same sub is handed the job**. This removes non-scalable cross-Sydney inspection travel for Allan/Marko.

**Jordan-fit:** extends, does not contradict. Jordan is photo-first (260 quote requests → 188 personalized quotes → 53 jobs, all photo-driven) but keeps a site-inspection stage. Sub-led inspection is a sound adaptation for the big-job segment only.

## Pipeline fit
Uses the existing 15-stage pipeline stages 8-9 (**"Organise Site Inspection" → "Site Inspection Organised"**). **No new stages.** Add these GHL opportunity fields inside those stages:
- `inspection_required_reason` (asbestos / big job / complex scope / access risk / substrate uncertainty / quoter judgement)
- `inspection_type` (Allan-Marko / subcontractor / specialist asbestos pathway)
- `assigned_inspection_sub`
- `estimated_drive_time`
- `inspection_due_date`
- `inspection_report_received` (yes/no)
- `same_sub_preferred_for_job` (yes/no)
- `inspection_fee_payable_if_no_conversion` (yes/no/amount)
- `asbestos_risk_rechecked` (yes/no)
- `quote_owner` (Allan/internal only)
- `customer_contact_rules_acknowledged` (yes/no)

## Required controls (build all of these into the workflow)
1. **Sub measures, Timeless quotes.** The sub NEVER sets the customer price — they collect facts only. Allan/internal owns scope, price, exclusions, payment terms, messaging.
2. **Standard inspection template** — mandatory checklist: photos + video, measurements, surface/substrate condition, failed grout/silicone areas, access/parking, ventilation, water-damage signs, mould, exclusions, customer expectations, "cannot assess" notes.
3. **Asbestos re-check at inspection** — re-verify property age/material; if suspected, pause into the asbestos pathway. No sub improvisation.
4. **Customer-facing framing** — "We're sending a Timeless-approved technician to measure and document the scope so Allan can prepare your quote." Sub presents as our technician (consistent with Decision 7/8); not a separate operator.
5. **Inspection fee logic** — if converts, absorb into job economics; if not, pay the sub a fair fixed inspection fee (else good subs stop accepting, or over-push customers to approve).
6. **No quote promises onsite** — sub may say "I'll send measurements/photos to the office; Allan will confirm the quote." No price ranges, discounts, timing, or technical guarantees unless approved.
7. **Anti-poaching** — sub agreement: non-solicit / no direct dealing with Timeless leads / no private quoting / no use of customer info outside allocated work / breach consequences.
8. **Consistency QA** — Marko/Allan audit the first 10-20 sub inspections against photos + final outcomes; track quote variance, missed scope, complaints, reliability.
9. **Sub suitability gate** — not every sub inspects; inspection-capable subs need strong comms, measurement accuracy, photo discipline, asbestos awareness, trustworthiness.

## Risks (manage explicitly)
Sham-contracting (use outcome-based briefs + ABN + $10M PL + right-to-decline + contractor payment structure); pricing leakage (ban subs quoting $); margin drift (templates + quote QA); customer trust (suitability gate); poaching (contract + monitoring + customer follow-up); operational drag (do NOT introduce while sub count is low).

## Rollout (capture now, build later — do NOT operationalize yet)
- **Phase 1 (now):** Marko/operator model. Site inspections Allan/Marko-led only when unavoidable (asbestos / very complex). Photo-first for everything else.
- **Phase 2:** Once 3-5 reliable subs exist — test the inspection template internally (Marko + maybe one trusted sub shadowing). NOT customer-facing yet.
- **Phase 3:** Pilot sub-led inspections only at **8-12 active vetted subs across Sydney**, with **2-3 inspection-capable subs per major region** so "<20 min" is real.
- **Phase 4:** Scale only after data proves: inspection reports complete, quote variance low, customers not confused, no poaching, big-job margin improves, Allan's customer voice intact.

**Build trigger:** Sydney sub density reaches ~8-12 active vetted subs. Until then this stays backlog.
