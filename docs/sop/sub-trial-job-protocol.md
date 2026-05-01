# SOP: Subcontractor Paid Trial Job Protocol

**Purpose:** No subcontractor gets regular work until they pass a paid trial job we inspect. THE quality gate.

**Owner:** Marko (subcontractor recruitment lane); CEO advises on edge cases.

**Source:** Migrated from `data/archive/old-drafts-2026-04/sub-onboarding-system.xlsx` sheet 03. 3-lens audited 2026-05-01 PM.

**Re-verification cadence:** Quarterly (in case Fair Work guidance on supervision/sham-contracting evolves)

---

## 3-lens audit verdict

| Lens | Verdict | Notes |
|---|---|---|
| Domain expert ([expert-trades-ops-contractor](../roles/expert-trades-ops-contractor.md)) | 🟢 Approve | Pay-regardless-of-pass-fail is legally + ethically correct |
| Adversarial — Fair Work ([auditor-fair-work](../roles/auditor-fair-work.md)) | 🟢 Approve | "Don't supervise — set scope + quality, they choose how" is correct independent contractor framing per 2024 FW Act amendments |
| Adversarial — Customer fairness ([auditor-customer-fairness](../roles/auditor-customer-fairness.md)) | 🟢 Approve with refinement | Customer informed it's a new tech being quality-checked. Suggested addition: discount the trial job 10-15% to compensate customer for the small risk of being a pilot — turns trial into goodwill investment. |

**Decision:** ✅ Migrate as-is + add the 10-15% trial discount as Allan-decision flag.

---

## Why the trial job exists

> *"Skip it and you're gambling your business on trust."* — old draft

The #1 risk: subcontractor does a bad job → customer demands refund → we refund + still owe subcontractor → out double. Multiply by 5 bad jobs = bankrupt. **Quality control is the entire business model.**

Trial budget: $1,200-1,800 across 2-3 trial jobs per subcontractor category. Cheap insurance vs $10K+ in callbacks/refunds from a bad-fit subcontractor.

---

## The 7-step protocol

### Step 1 — Select a real trial job
- Pick a REAL customer job matching the subcontractor's claimed skill
- For regrout subcontractors: standard shower regrout + silicone
- For resurface subcontractors: standard bath resurface
- ❌ DO NOT use a practice piece or your own bathroom — real conditions reveal true skill
- ✅ Pick straightforward (single-area), not complex multi-area
- Tell customer: *"Our technician is new to our team and we'll be quality-checking the job ourselves."* Optionally offer 10-15% discount as goodwill (CEO recommends — turns customer into willing trial participant).

### Step 2 — Brief the subcontractor
Send standard job brief via ServiceM8 (or email pre-SM8):
- Customer name + address
- Service required + scope
- Photos from customer submission
- Expected completion timeframe
- Materials to use (Hawk Glass-Tech for resurface, approved grout brand for regrout per sub-materials-standard.md)
- Critical message: *"I'll be visiting the site to inspect the completed work before I confirm final payment."*

⚠️ Set inspection expectation upfront. Good subcontractors welcome it. Bad subcontractors get nervous.

### Step 3 — Subcontractor completes the job (we are NOT on site)
- Subcontractor arrives on time
- Subcontractor does the work using own tools + materials
- Subcontractor takes before/during/after photos
- Subcontractor sends photos via ServiceM8 or Slack

⚠️ **DO NOT supervise or direct work**. Standing over them = sham contracting risk under Fair Work Act. We're the principal contractor, not their supervisor. **We set scope + quality standards; they choose HOW to achieve it.** This is the legal line. Inspection AFTER the work is fine.

### Step 4 — We inspect (within 24 hours)
Visit the site post-completion. Use [sub-quality-rubric.md](sub-quality-rubric.md) (Sheet 04) to score.

Check:
- Grout lines (straight, consistent, no gaps, no haze)
- Silicone beads (smooth, even, no lifting, correct colour)
- Coating finish (smooth, even, no bubbles/runs/dust — for resurfaces)
- Masking (no overspray, no damage to surrounds — for resurfaces)
- Cleanup (clean bathroom, no debris)
- Customer interaction quality (separate phone call — Step 5)

Take our own photos.

### Step 5 — Customer feedback call (within 24 hours)
Phone the customer. Ask:
1. "How was the technician — on time, professional, friendly?"
2. "Are you happy with the result?"
3. "Was the bathroom left clean?"
4. "Anything that could have been better?"

Record feedback against the subcontractor's profile in our records (or GHL once live).

If customer unhappy → investigate. Sometimes work is technically perfect but the subcontractor was rude/late/messy. Sometimes the customer's expectations were misaligned (manage them better next time).

### Step 6 — Decision
| Outcome | Threshold | Action |
|---|---|---|
| **PASS** | 80%+ rubric score + customer feedback positive | Sign subcontractor agreement (see [sub-agreement-clauses spec](../specs/sub-agreement-clauses.md) when built). Add to active subcontractor roster. Start dispatching regular jobs. |
| **CONDITIONAL** | 60-79% OR mixed customer feedback | Specific written feedback ("Grout lines were good but silicone bead inconsistent in corners — here's what we expect [photo reference]"). Assign ONE more trial. |
| **FAIL** | Below 60% OR significant customer complaint | Pay them for the trial job (you owe them). Thank them. Do not engage further. Move on. |

⚠️ **MUST PAY regardless of pass/fail.** They did the work. Not paying = legal + reputation problems. Paying for a fail is part of the cost of vetting.

### Step 7 — Second trial (if conditional)
Same process with specific feedback from trial #1 to test improvement.
- Hit 80%+ on trial #2 → approve
- Still below 80% → don't engage

**Maximum 2 trials per subcontractor.** If they can't pass in 2 attempts, they're not right for our standard.

> *"Some subcontractors are good but sloppy until they understand your standard. The second trial catches these — they're often your best long-term subcontractors because they showed they can adapt."* — old draft

---

## Sham contracting protection during trials

Per [auditor-fair-work.md](../roles/auditor-fair-work.md):
- ✅ We set scope + quality standard + photo requirements (principal contractor behaviour)
- ✅ Subcontractor uses own tools, own materials, own vehicle
- ✅ Subcontractor chooses how to execute within our spec
- ✅ Subcontractor can decline the trial job (must accept voluntarily)
- ❌ We do NOT supervise on-site
- ❌ We do NOT instruct subcontractor on technique mid-job
- ❌ We do NOT require subcontractor to attend our office, meetings, or training (they're not employees)
- ❌ We do NOT pay them hourly — flat trial-job rate per service rate card

---

## Documentation per trial

For every trial job (pass, conditional, or fail), document:
- Subcontractor name + ABN + contact details
- Customer name + address (ANONYMISED in subcontractor's record after job — privacy)
- Job type + scope
- Date + duration
- Subcontractor's submitted photos (before/during/after)
- Our inspection photos
- Rubric score per criterion
- Customer feedback notes
- Final decision (PASS / CONDITIONAL / FAIL)
- Reason if fail (specific failures noted)

**Storage**: Google Drive `Subcontractors/{SubName-FullLegalName}/Trials/Trial-{1|2}-{date}/`

**Retention**: 7 years per ATO + Fair Work record-keeping.

---

## Pass triggers next steps

→ [sub-onboarding-checklist.md](sub-onboarding-checklist.md) (full onboarding — when migrated)
→ Sign agreement via DocuSign
→ Add to active dispatch roster

---

## References

- [sub-vetting-checklist.md](sub-vetting-checklist.md) — vetting steps before trial
- [sub-quality-rubric.md](sub-quality-rubric.md) — scoring criteria for inspection
- [auditor-fair-work.md](../roles/auditor-fair-work.md)
- [expert-trades-ops-contractor.md](../roles/expert-trades-ops-contractor.md)
