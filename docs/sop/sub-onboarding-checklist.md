# SOP: Subcontractor Onboarding Checklist (master)

**Purpose:** Complete every item before dispatching the sub regular work. 19 items total. Master onboarding flow that ties together vetting + trial + agreement + ServiceM8 setup + briefings.

**Owner:** Marko (executes); CEO designs + signs off.

**Source:** Migrated from `data/archive/old-drafts-2026-04/sub-onboarding-system.xlsx` sheet 10. 3-lens audited 2026-05-01 PM.

**Re-verification cadence:** Annually + when any clause/spec changes.

---

## 3-lens audit verdict

| Lens | Verdict | Notes |
|---|---|---|
| Domain ([expert-trades-ops-contractor](../roles/expert-trades-ops-contractor.md)) | 🟢 Approve | Comprehensive 19-step process. Covers documents, system access, briefings, monitoring. |
| Adversarial — Fair Work ([auditor-fair-work](../roles/auditor-fair-work.md)) | 🟢 Approve | Includes briefings on Clauses 20 (photo IP), 23 (data/privacy), 26 (conduct), 28/32 (callout/cancellation). All sham-protection awareness covered. |
| Adversarial — Customer Fairness ([auditor-customer-fairness](../roles/auditor-customer-fairness.md)) | 🟢 Approve with refinement | Customer-facing items present (Quality Standards card, Aftercare cards). Suggest: add "Marko walks new sub through 1 mock customer-interaction scenario" — verifies they can talk to customers professionally. |

**Decision:** ✅ Migrate as-is + add mock customer interaction step.

---

## Sequence prerequisite

Before this checklist begins:
1. ✅ Sub completed [vetting-checklist](sub-vetting-checklist.md) (all mandatory items pass)
2. ✅ Sub passed [trial-job-protocol](sub-trial-job-protocol.md) (80%+ rubric or conditional pass on 2nd trial)

If either incomplete, do NOT start onboarding.

---

## The 20 onboarding steps (added #20 mock customer interaction)

### Phase A — Legal + agreement (steps 1-2)

- [ ] **1. Sign Subcontractor Agreement**
  - Send via DocuSign for both parties to sign
  - Digital signatures legally valid in AU under Electronic Transactions Act 1999
  - Store signed copy: Google Drive `Subs/{SubName}/Agreement-Signed.pdf` + Xero supplier file
  - DocuSign automatically gives sub their copy
  - Use the agreement Sprintlaw drafts from [docs/specs/sub-agreement-clauses.md](../specs/sub-agreement-clauses.md)

- [ ] **2. Collect all onboarding documents**
  - ABN verification printout (from ABR lookup)
  - PL Certificate of Currency ($10M minimum)
  - Personal accident / income protection certificate (recommended)
  - Workers comp certificate (if sub has any employees)
  - Driver's licence copy (signed sub matches ABN holder)
  - Asbestos awareness training cert (SafeWork NSW)
  - Signed Agreement
  - **Store in**: `Subs/{SubName-FullLegalName}/Documents/`

### Phase B — System access (steps 3-4)

- [ ] **3. Set up sub in ServiceM8**
  - Create as "Staff" member (not employee — limited permissions)
  - Sub downloads ServiceM8 Lite app on their phone
  - **Test**: dispatch a dummy job → confirm sub receives notification → can see photos/details → can navigate to address → can submit completion photos
  - Document: which sub-tier tag (Tier 1 / 2 / 3 — start at Tier 2 default unless evidence supports Tier 1)
  - Add suburb coverage tags + skill tags per [field service ops expert](../roles/expert-field-service-ops.md)

- [ ] **4. Add to Slack**
  - Channels: `#sub-dispatch` (job alerts), `#sub-quality` (quality updates), `#sub-general` (general comms)
  - **Test**: send a message → confirm sub receives + can reply
  - Set up Slack notifications on their phone for #sub-dispatch (urgent alerts)

### Phase C — Reference materials (steps 5-7)

- [ ] **5. Share Quality Standards 1-pager**
  - 1-page reference extracted from [sub-quality-rubric.md](sub-quality-rubric.md)
  - Includes sample before/after photos showing "what good looks like"
  - Sub keeps in their van

- [ ] **6. Share Approved Materials list**
  - 1-page list per [sub-materials-standard.md](sub-materials-standard.md)
  - Resurface: Hawk Glass-Tech via ARS only
  - Regrout cement: Davco Sanitised / Ardex FG8 / Laticrete PermaColor
  - Regrout epoxy: Ardex EG15 / Davco K10 / Laticrete SpectraLOCK
  - Silicone: bathroom-grade mould-resistant brands
  - Include ARS supplier contact (Bert: 02 9098 0347 / info@austrs.com.au)

- [ ] **7. Share Aftercare instruction cards (printed)**
  - Sub leaves one at every job
  - Cover: cure time (24-48hr regrout, 48-72hr resurface), cleaning products to use/avoid, warranty period, our contact for issues
  - Sub carries stack in their van

### Phase D — Payment + insurance setup (steps 8-9)

- [ ] **8. Confirm payment method**
  - Set sub up as supplier in Xero
  - Confirm bank details for EFT (or pay.com.au routing)
  - Invoicing schedule: per job or weekly batch (Friday)
  - Sub provides Tax Invoice with ABN at each payment claim
  - Confirm pay.com.au sub-payment process if used

- [ ] **9. Set insurance expiry reminders**
  - Calendar reminders 30 days + 7 days before PL renewal
  - Calendar reminder 30 days before personal accident renewal
  - Calendar reminder for asbestos awareness cert renewal (annual)
  - **Standing rule**: sub stood down immediately if insurance lapses without renewal

### Phase E — Briefings on critical clauses (steps 10-15)

Each briefing: walk sub through plain-English version, get verbal acknowledgment, note date in their record.

- [ ] **10. Asbestos awareness briefing**
  - "Any property built before 1990 MAY contain asbestos. If you see anything suspicious during grout removal or surface prep — STOP WORK immediately. Do NOT disturb it. Take photos from a distance only. Call Marko within 5 minutes."
  - Document: send confirmation email after briefing

- [ ] **11. Photo policy + IP briefing (Clause 20)**
  - "All job photos belong to Timeless Resurfacing — they're licensed perpetually for our marketing/social media/training. You must NOT post customer photos on your own social media or use for your own marketing without written permission."
  - Document briefing date

- [ ] **12. Data + privacy briefing (Clause 23)**
  - "Customer details (name, address, phone, photos) are confidential. Used only for assigned jobs. Must not be retained after job. Must not be shared with anyone."
  - Document briefing date

- [ ] **13. Variation / change order briefing (Clause 21)**
  - "If you arrive and find something unexpected (hidden mould, worse condition, wrong scope), STOP work on the new scope. Notify Marko within 1 hour with photo + text. Wait for written approval before proceeding. No verbal approvals. Unapproved extra work = at your own cost."
  - Document briefing date

- [ ] **14. Professional conduct briefing (Clause 26)**
  - Walk through plain-language version:
    - Arrive clean + on time. Notify if >15 min late.
    - No smoking on customer property. No alcohol/substances ever. Zero tolerance.
    - Stay in work area only. Don't enter other rooms.
    - Don't discuss pricing — "All pricing goes through the office."
    - Don't offer additional services or hand out your own details.
    - Don't bring anyone else without approval (48hr notice + their ABN + PL Cert).
    - Leave bathroom cleaner than you found it.
  - Document briefing date

- [ ] **15. Callout + cancellation briefing (Clauses 28 + 32)**
  - "If customer cancels <24hrs before, you get $100 callout fee. Locked-out at site = $100 callout fee (wait 15 min + photo first). If YOU cancel <48hr before a committed job, $100 fee the other way. Fair's fair. 3+ late cancellations in 90 days = removal from roster."
  - Document briefing date

- [ ] **16. Photo-to-reality mismatch briefing (Clause 30)**
  - "We quote from customer photos. If actual scope differs materially: STOP, take photos, call Marko within 30 min. We'll requote the customer. You get paid for actual scope, not photo estimate. NEVER quote the customer yourself."
  - Document briefing date

- [ ] **17. Multi-day job commitment briefing (Clause 31)**
  - "Bath resurfaces are 2-day jobs. You're committed to both days. If something comes up + you can't make day 2, tell us before 6pm the night before so we can manage the customer. Just not turning up day 2 = unusable bathroom = serious problem."
  - Document briefing date

### Phase F — First real job + ongoing setup (steps 18-20)

- [ ] **18. First real job (monitored)**
  - First post-trial dispatch
  - Marko inspects within 24hr (not a re-trial — they're approved, but confirming consistency without "trial pressure")
  - Score on rubric same as trial
  - If anything below Tier 2 baseline (75%) → coaching conversation immediately

- [ ] **19. Collect first NSW Subcontractor's Statement**
  - With first invoice/payment claim
  - Then with EVERY subsequent payment (mandatory per s175B Workers Compensation Act 1987)
  - File in `Subs/{SubName}/Statements/{date}.pdf`
  - **Standing rule**: no statement = no payment

- [ ] **20. Mock customer interaction (added by CEO 2026-05-01 PM)**
  - Marko role-plays a customer scenario with new sub:
    - "Hi, you're here to do my regrout. How long will it take?"
    - "What products are you using?"
    - "Why does this cost X dollars?" (test pricing-redirect: "All pricing goes through the office")
    - "Can you also do my kitchen splashback?" (test no-direct-selling)
  - Sub responds; Marko coaches if needed
  - Validates sub can handle customer-facing moments before they're alone with our customers
  - Document: any concerns to flag before going live

---

## Onboarding sign-off

When all 20 items complete, Marko signs off:

```
SUB ONBOARDED ✅
Name: ___________
Date: ___________
ABN: ___________
First job dispatched on: ___________
Tier assigned: Tier ___________
Marko sign-off: ___________
```

Stored in `Subs/{SubName}/Onboarding-Signoff.pdf`.

---

## Time estimate

Total onboarding: **3-5 hours** spread over 1-2 weeks (post-trial-pass).

Phase A (legal): 30 min (DocuSign + doc collection)
Phase B (system): 30 min (SM8 + Slack + tests)
Phase C (reference): 1 hour (1-page docs + printed cards prep)
Phase D (payment): 30 min (Xero + reminders)
Phase E (briefings): 1.5 hours (6 briefings × 15 min each, Marko 1-on-1)
Phase F (first job + statement + mock): 1 hour spread over first week

---

## References

- [sub-vetting-checklist.md](sub-vetting-checklist.md) — predecessor (must pass before onboarding)
- [sub-trial-job-protocol.md](sub-trial-job-protocol.md) — predecessor (must pass before onboarding)
- [sub-quality-rubric.md](sub-quality-rubric.md) — used in step 18 (first real job inspection)
- [sub-materials-standard.md](sub-materials-standard.md) — referenced in step 6
- [sub-agreement-clauses.md](../specs/sub-agreement-clauses.md) — agreement signed in step 1
- [auditor-fair-work.md](../roles/auditor-fair-work.md) — sham-contracting protection awareness across briefings
