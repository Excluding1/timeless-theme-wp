# Cleo Peer-Review of GHL Setup Spec — 2026-05-05

## Verdict
**rework-before-allan-reads.**

This is not ready to become canonical. The stage list is directionally right, but the spec is overconfident about day-0 feasibility, has schema/workflow mismatches, and treats unverified GHL Starter/Twilio/Stripe/Slack capabilities as executable facts.

**P0:** fix integration feasibility, workflow idempotency, field schema mismatches, compliance gates, and day-0 operating scope.

## Findings

### Finding 1: Day-0 setup sequence is not executable
- **Severity**: BLOCKER
- **Lens**: manager-business-orchestrator / expert-ghl-operator
- **Issue**: The checklist builds workflows before the integrations they depend on exist. Day 4 builds Slack/SMS/email actions, Day 5 builds Twilio missed-call flow, but Slack/Stripe/email DNS/calendar are not configured until Day 7.
- **Evidence**: workflows built at [spec lines 657-686](/Users/angelapham/codex-peer-workspace/master-repo/docs/partnership/ghl_setup_spec_2026-05-05.md:657); integrations only on [lines 688-693](/Users/angelapham/codex-peer-workspace/master-repo/docs/partnership/ghl_setup_spec_2026-05-05.md:688). `STATE.md` says Stripe, Slack, Cloudinary, Twilio are not started/pending at [lines 150-154](/Users/angelapham/codex-peer-workspace/master-repo/docs/STATE.md:150) and [229-230](/Users/angelapham/codex-peer-workspace/master-repo/docs/STATE.md:229).
- **Recommendation**: Reorder: domain email/DNS, Slack, Stripe, Twilio fallback decision, Cloudinary signer, then workflows. If dependency unavailable, workflow stays disabled or uses manual fallback.

### Finding 2: GHL Starter capability is unresolved but treated as guaranteed
- **Severity**: BLOCKER
- **Lens**: expert-ghl-operator
- **Issue**: §12 asks whether Starter supports outbound webhooks, if/else, inbound auth, custom-field count, and Stripe metadata. Those are not footnotes; they decide whether W1-W7 can exist as written.
- **Evidence**: open questions at [spec lines 783-787](/Users/angelapham/codex-peer-workspace/master-repo/docs/partnership/ghl_setup_spec_2026-05-05.md:783); workflows depend on those features throughout [lines 438-524](/Users/angelapham/codex-peer-workspace/master-repo/docs/partnership/ghl_setup_spec_2026-05-05.md:438).
- **Recommendation**: Make this a preflight gate, not an Allan “verify later” task. Canonical doc must say: “validated in this account on this plan” or “fallback = middleware/Make/manual.”

### Finding 3: Custom field schema does not match the existing operating model
- **Severity**: HIGH
- **Lens**: auditor-webhook-integrity
- **Issue**: The spec renames or omits fields already defined elsewhere. It uses `property_type` for owner/tenant/commercial categories, but `OPERATING-CONTEXT` uses `customer_type` for owner/PM/builder/tenant and `property_type` for house/apartment/commercial. W3 then references `customer_type`, which the spec does not define.
- **Evidence**: spec contact fields at [lines 332-350](/Users/angelapham/codex-peer-workspace/master-repo/docs/partnership/ghl_setup_spec_2026-05-05.md:332); W3 condition at [line 472](/Users/angelapham/codex-peer-workspace/master-repo/docs/partnership/ghl_setup_spec_2026-05-05.md:472); operating model fields at [OPERATING-CONTEXT lines 263-320](/Users/angelapham/codex-peer-workspace/master-repo/docs/OPERATING-CONTEXT.md:263).
- **Recommendation**: Restore canonical names: `customer_type`, `property_type`, `suburb`, `postcode`, `service_area_zone`, `lift_access`, `form_status`, `referrer`, `deposit_amount`, `servicem8_job_id`, `assigned_subcontractor`, `assigned_sub_tier`.

### Finding 4: Duplicate-submit idempotency is underbuilt
- **Severity**: HIGH
- **Lens**: expert-ghl-operator / auditor-webhook-integrity
- **Issue**: W1 dedupes contact, then creates a new opportunity every time. Same customer double-taps submit, refreshes, or fills twice and you get duplicate opps and possibly duplicate SMS.
- **Evidence**: W1 actions at [spec lines 443-452](/Users/angelapham/codex-peer-workspace/master-repo/docs/partnership/ghl_setup_spec_2026-05-05.md:443); webhook auditor requires event IDs/idempotency at [role lines 29-35](/Users/angelapham/codex-peer-workspace/master-repo/docs/roles/auditor-webhook-integrity.md:29).
- **Recommendation**: Add `submission_id`, `trace_id`, `payload_schema_version`, and “open opportunity lookup by contact + form_version/submitted_at window” before create. One customer can have multiple jobs, but not duplicate opps from one submit.

### Finding 5: Quote cadence copy is legally and operationally sloppy
- **Severity**: HIGH
- **Lens**: auditor-compliance-aus
- **Issue**: “Your quote expires Friday” is false whenever Friday is not the actual expiry. Also the spec sends multiple commercial follow-ups without a clean distinction between quote-service consent and marketing consent.
- **Evidence**: cadence copy at [spec lines 102-105](/Users/angelapham/codex-peer-workspace/master-repo/docs/partnership/ghl_setup_spec_2026-05-05.md:102) and [477-481](/Users/angelapham/codex-peer-workspace/master-repo/docs/partnership/ghl_setup_spec_2026-05-05.md:477). ACMA says commercial messages need consent, sender ID, contact details, and easy unsubscribe.
- **Recommendation**: Use dynamic `quote_expires_at`; copy says “expires on [date].” Add `quote_sent_at`, `quote_expires_at`, `marketing_consent`, `quote_contact_consent`, `stop_received_at`.

### Finding 6: NPS auto-filter is review gating risk
- **Severity**: HIGH
- **Lens**: auditor-compliance-aus
- **Issue**: W5 only sends Google review links to promoters. That is classic review gating. The role file explicitly says review requests should go to all customers, not only likely promoters.
- **Evidence**: W5 branches promoter-only review prompt at [spec lines 501-505](/Users/angelapham/codex-peer-workspace/master-repo/docs/partnership/ghl_setup_spec_2026-05-05.md:501); compliance role says review request goes to all customers at [role lines 90-94](/Users/angelapham/codex-peer-workspace/master-repo/docs/roles/auditor-compliance-aus.md:90).
- **Recommendation**: Either send review ask neutrally to all completed customers after issue window, or keep NPS private and do not call it Google review automation.

### Finding 7: Stage 6 → 7 threshold is wrong for day-0 cash and licensing risk
- **Severity**: HIGH
- **Lens**: auditor-margin-per-job / auditor-compliance-aus
- **Issue**: `$3K` site-inspection threshold is too high. Pre-1990, strata, commercial, no-lift, unclear photos, active leak, and margin-below-floor should route to inspection or manual hold regardless of quote total.
- **Evidence**: threshold at [spec lines 116-118](/Users/angelapham/codex-peer-workspace/master-repo/docs/partnership/ghl_setup_spec_2026-05-05.md:116); margin floor is non-negotiable at [CEO lines 1775-1789](/Users/angelapham/codex-peer-workspace/master-repo/docs/CEO.md:1775).
- **Recommendation**: Set default: Stage 7 if `quote_total_final >= $2K`, `built_before_1990 != no`, strata/commercial, no-lift, poor photos, strip-back, or estimated profit `< $300`.

### Finding 8: Job Issue owner contradicts CEO operating policy
- **Severity**: MEDIUM
- **Lens**: manager-business-orchestrator
- **Issue**: Spec says Allan owns Stage 11 and calls within 60 minutes. CEO policy says Marko owns NPS detractors and job issues within 60 minutes.
- **Evidence**: spec Stage 11 owner at [lines 188-193](/Users/angelapham/codex-peer-workspace/master-repo/docs/partnership/ghl_setup_spec_2026-05-05.md:188); CEO SLA table at [lines 1737-1738](/Users/angelapham/codex-peer-workspace/master-repo/docs/CEO.md:1737).
- **Recommendation**: Change Stage 11 owner to Marko first-response, Allan commercial escalation if refund/quote/pricing issue.

### Finding 9: Stage model has no home for “paid deposit but waiting on legal/customer docs”
- **Severity**: MEDIUM
- **Lens**: expert-trades-ops-contractor / auditor-compliance-aus
- **Issue**: Strata approval, landlord authority, asbestos assessment, SWMS, and material availability are not cleanly staged. Stage 10 says hold only from stages 9-12, but these blockers can arise before quote sent or before deposit.
- **Evidence**: Stage 10 entry limited to [spec line 172](/Users/angelapham/codex-peer-workspace/master-repo/docs/partnership/ghl_setup_spec_2026-05-05.md:172); compliance role requires strata/pre-1990 checks before booking at [role lines 95-100](/Users/angelapham/codex-peer-workspace/master-repo/docs/roles/auditor-compliance-aus.md:95).
- **Recommendation**: Add explicit blockers as fields/status reasons, or permit Stage 10 from stages 1-14 with `hold_reason` values including `strata_approval`, `landlord_authority`, `asbestos_assessment`, `margin_review`.

### Finding 10: Margin preservation is mostly absent
- **Severity**: HIGH
- **Lens**: auditor-margin-per-job
- **Issue**: Lead scoring prioritises revenue, but no workflow or field enforces profit floor, travel zone cost, materials, Stripe fees, or overhead. Automation can accelerate unprofitable jobs.
- **Evidence**: lead score at [spec lines 731-753](/Users/angelapham/codex-peer-workspace/master-repo/docs/partnership/ghl_setup_spec_2026-05-05.md:731); margin formula and $300 floor at [role lines 17-35](/Users/angelapham/codex-peer-workspace/master-repo/docs/roles/auditor-margin-per-job.md:17) and [CEO lines 1777-1789](/Users/angelapham/codex-peer-workspace/master-repo/docs/CEO.md:1777).
- **Recommendation**: Add `estimated_profit`, `estimated_margin_pct`, `travel_zone`, `materials_estimate`, `stripe_fee_estimate`, `margin_review_required`. No Stage 5 quote sent until margin floor passes.

### Finding 11: Mobile abandonment recovery assumes SMS is available
- **Severity**: MEDIUM
- **Lens**: auditor-mobile-abandonment
- **Issue**: W2 is SMS-only, but Twilio is pending. Also partial recovery checks “same email,” while Step 1 may include phone-only/no-phone variations.
- **Evidence**: W2 at [spec lines 455-467](/Users/angelapham/codex-peer-workspace/master-repo/docs/partnership/ghl_setup_spec_2026-05-05.md:455); Twilio pending at [STATE line 229](/Users/angelapham/codex-peer-workspace/master-repo/docs/STATE.md:229); mobile role emphasises state persistence/photo/network failure at [role lines 61-82](/Users/angelapham/codex-peer-workspace/master-repo/docs/roles/auditor-mobile-abandonment.md:61).
- **Recommendation**: W2 needs SMS-or-email fallback, `partial_session_id`, and resume URL. Do not depend on Twilio for launch recovery.

### Finding 12: Surface Care comparison copies scale, not constraint
- **Severity**: MEDIUM
- **Lens**: manager-business-orchestrator
- **Issue**: The spec copies Jordan’s 15-stage architecture but underweights the current Timeless reality: 0 customers, no subs, $1,500 cash, no Stripe/Slack/Cloudinary/Twilio. “Slack ✓” and “Stripe ✓” are not true.
- **Evidence**: comparison says Stripe and Slack are checked at [spec lines 764-767](/Users/angelapham/codex-peer-workspace/master-repo/docs/partnership/ghl_setup_spec_2026-05-05.md:764); `STATE.md` says they are not signed up/not created at [lines 150-154](/Users/angelapham/codex-peer-workspace/master-repo/docs/STATE.md:150).
- **Recommendation**: Split the spec into “canonical target state” and “day-0 minimum viable operating mode.” Allan needs the latter first.

## Per-axis verdicts

A. **Stage definitions**: Not complete. Stages are mostly sensible, but legal/documentary holds, manual Stripe fallback, duplicate/requote states, and margin-review states have no clean home.

B. **Workflow correctness**: Not safe. W1 duplicate opps; W2 weak identity matching; W3 bad expiry copy and guards; W4 blocked on Twilio; W5 review-gating risk; W6 trigger conflicts with W1 tag order; W7 noisy without error channel.

C. **Custom field schema**: Too many in some places, missing critical ones in others. Biggest issue is naming drift from existing docs.

D. **Tag taxonomy**: Mostly disciplined, but `phase-quote-cadence-step-*` are temporal state tags. Use timestamps/fields unless GHL forces tag guards. Mutual exclusion is not documented.

E. **Setup checklist**: Bad ordering. Dependencies after workflows. No disabled-workflow staging. No rollback or manual fallback.

F. **AU compliance**: Incomplete. Needs privacy collection notice, overseas disclosure, marketing vs transactional consent split, review-gating fix, strata/landlord/asbestos gates, accurate quote expiry.

G. **Surface Care comparison**: Directionally useful, but falsely marks unavailable tools as ready and copies scale defaults into a zero-customer business.

H. **§12 open questions**: Clifford’s recommendations are too relaxed. These are P0 preflight checks, not “verify while building.” I would not use Make as casual fallback until data/privacy/error handling is specified.

I. **Five pushback defaults**:
1. Stage 6→7 threshold `$3K`: lower to `$2K` plus risk flags.
2. Stage 10 hold timer `30d`: too long. Review weekly, force decision at 14d unless customer-dated delay.
3. Stage 11 Allan call SLA `60min`: SLA fine; owner should be Marko first, Allan commercial escalation.
4. Lead score threshold `30`: too low with current scoring. Use 40 until data exists, or trigger only if score >=30 and margin/risk flags clean.
5. W3 cadence `4 touches`: fine in principle, but rewrite copy, business-hours only, dynamic expiry, and pause on customer reply/Q&A.

J. **Missing entirely**: automation error channel, manual recovery SOP, schema contract with actual form payload, consent fields, profit/margin gate, Stripe chargeback evidence fields, privacy deletion/access SOP, Cloudinary retention/deletion rules, no-sub day-0 operating mode.

## TOP 5 P0 fixes Clifford should make before Allan signs off
1. Convert §12 capability questions into a hard preflight validation table with pass/fail evidence from Allan’s actual GHL Starter account.
2. Rebuild the field schema against the real form payload and existing `OPERATING-CONTEXT` names. Add `submission_id`, `trace_id`, consent fields, margin fields, and blocker fields.
3. Add idempotency and failure handling to every handoff: form→GHL, partial→GHL, Stripe→GHL, GHL→Slack, Twilio→GHL.
4. Fix compliance: review gating, dynamic quote expiry, privacy/overseas disclosure, STOP handling fields, strata/tenant/asbestos gates.
5. Rewrite setup checklist in dependency order and include manual fallback mode for no Twilio/no Stripe/no Cloudinary/no Slack.

## Where I might be wrong
GHL plan capabilities change fast. I checked current HighLevel support pages showing inbound and outbound webhook workflow features exist generally, but I did not verify them inside Allan’s actual Starter sub-account. AU compliance references are based on ACMA/OAIC guidance and the project’s role files; lawyer sign-off is still needed before first quote.

Sources used: HighLevel support on inbound/outbound webhooks, ACMA spam guidance, OAIC APP guidance.  
— Cleo
