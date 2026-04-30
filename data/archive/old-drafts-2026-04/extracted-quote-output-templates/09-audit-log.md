# 09 AUDIT LOG

*Extracted from quote-output-templates-final.xlsx 2026-05-01 PM*

Sheet dimensions: 29 rows × 5 cols

---

**R2 C2**: AUDIT LOG — CROSS-REFERENCED AGAINST ALL EXISTING FILES

**R3 C2**: Checked against: MASTER_PRICING_FINAL.xlsx, QUOTE_FORM_SPEC_v4_FINAL.xlsx (including GHL Build Guide Sheet 11), plus all research sources.

**R5 C2**: #

**R5 C3**: Check

**R5 C4**: Finding / Resolution

**R5 C5**: Status

**R6 C2**: 1

**R6 C3**: Pipeline stage names match between
Quote Form Spec (Phase 6) and
Quote Output Templates

**R6 C4**: Form Spec Phase 6 pipeline: New Quote → Photo Review → Quoted → Follow-Up → Deposit Paid → Booked → In Progress → Completed → Paid → Rejected → Lost (11 stages).

V2 references: "Quoted", "Deposit Paid", "Expired", "Rejected".

"Expired" = "Lost" in the pipeline. Updated workflow to use "Lost" as final stage (matching pipeline).

Form Spec automation section says "Quote Sent" at ≤120min but pipeline uses "Quoted" — that was an inconsistency IN the form spec. V2 correctly uses "Quoted" throughout.

**R6 C5**: FIXED

**R7 C2**: 2

**R7 C3**: Custom fields: V2 adds 5 new fields
not in the original 34-field list

**R7 C4**: V2 adds: service_summary, deposit_amount, balance_amount, booking_form_link, cost_anchor.

These are team-populated during quoting, not form-populated. They don't conflict with the 34 form fields.

Total custom fields: 34 (form) + 5 (quoting) = 39 fields.

Added to Sheet 07 Step 3 with clear labelling as "quoting fields" vs "form fields."

**R7 C5**: FIXED

**R8 C2**: 3

**R8 C3**: SMS template count error

**R8 C4**: Sheet 07 Step 5 said "CREATE SMS TEMPLATES (6)" but lists 7 templates (Ack, Delivery, Nudge 24hr, Nudge 48hr, Expired, Deposit Confirmed, Rejected).

Fixed to "(7)" and listed all 7.

**R8 C5**: FIXED

**R9 C2**: 4

**R9 C3**: GHL merge tag format verification

**R9 C4**: V2 uses {{custom.field_name}} for custom fields.

Actual GHL format varies by context:
• Standard contact fields: {{contact.first_name}}
• Custom contact fields: use GHL's "Custom Values" picker in template editor — it generates the correct format
• Opportunity fields: {{opportunity.monetary_value}}
• Document fields: {{documents.proposal_link}} — verify in GHL Documents & Contracts docs

Resolution: Added note to Sheet 08 that exact merge tags should be confirmed via GHL's Custom Values picker when building templates. The tag names are correct — the bracket syntax may vary.

**R9 C5**: NOTE ADDED

**R10 C2**: 5

**R10 C3**: Spam Act 2003 compliance
on follow-up SMS

**R10 C4**: Instant ack SMS and deposit confirmed SMS are transactional (responding to their request). Follow-up SMS (24hr, 48hr, expired) are commercial.

Australian Spam Act requires: sender ID, opt-out mechanism, business identity.

Added "Reply STOP to unsubscribe" to all 3 follow-up SMS templates (Nudge 24hr, Nudge 48hr, Expired).
Business name already included in each SMS.

**R10 C5**: FIXED

**R11 C2**: 6

**R11 C3**: Photo insertion in email/proposal
is manual — GHL limitation

**R11 C4**: GHL Documents & Contracts does NOT natively support dynamic image insertion from contact file uploads into proposal templates.

Resolution: Step 10 of daily quote process already says "Insert 2-3 of their photos into the proposal" — this is a MANUAL step.

For Email #1: The "their photo" section requires manually attaching photos from the contact record. More realistic approach: keep email clean (no photos), let the proposal page handle the photo display.

Alternative: Use Zapier to auto-attach photos to a Google Doc template → export as PDF → attach to email. Phase 2 improvement.

For now: Photos are shown on the PROPOSAL PAGE (manual insert). Email references them but links to the proposal page for the full visual experience.

**R11 C5**: NOTE ADDED

**R12 C2**: 7

**R12 C3**: Deposit math verification

**R12 C4**: Example: Total $1,660 → Deposit 10% = $166 → Balance = $1,494.
$166 + $1,494 = $1,660 ✅

GST: $1,660 inc GST → $1,509.09 ex-GST. Deposit $166 inc GST → $150.91 ex-GST.
All customer-facing prices include GST ✅ (matches Master Pricing file rule).

**R12 C5**: PASS

**R13 C2**: 8

**R13 C3**: Workflow separation:
Form Spec has 1 workflow vs
V2 has 3 separate workflows

**R13 C4**: Form Spec Phase 5 combines: form ack + tagging + follow-ups in ONE workflow.

V2 uses 3 workflows:
• #1 "Instant Quote Ack" — trigger: form submitted
• #2 "Quote Delivery Sequence" — trigger: stage changed to "Quoted"
• #3 "Deposit Confirmed" — trigger: payment received

V2 approach is BETTER because:
- Cleaner separation of concerns
- Easier to debug
- Follow-up sequence only starts when team actually sends quote (not when form is submitted)
- Form Spec approach would send follow-ups even if team hasn't reviewed yet

Form Spec Phase 5 should be updated to match V2 pattern. Note added.

**R13 C5**: V2 CORRECT

**R14 C2**: 9

**R14 C3**: GHL Documents & Contracts
requires email on file for proposals

**R14 C4**: Even when sending proposal via SMS, GHL requires an email on the contact record.

Our form collects email in Step 4 (required field). ✅

If a contact somehow enters without email, the proposal will sit in Drafts. Edge case handled by form validation.

**R14 C5**: PASS

**R15 C2**: 10

**R15 C3**: Pricing Master file alignment:
service_summary examples match services

**R15 C4**: V2 service_summary example: "Shower Regrout + Silicone (Standard)"

Master Pricing has:
- SRG-S-STD (Shower Regrout Standard)
- SRG-S-STD+SIL (Shower Regrout + Silicone Standard)

service_summary is a human-readable description, not a code. Team writes this when quoting.

Examples should match naming convention. Updated to include service code reference for internal tracking: team fills both the readable summary AND can reference the pricing code.

**R15 C5**: PASS

**R16 C2**: 11

**R16 C3**: Quote valid period:
7 days throughout all templates

**R16 C4**: Checked all references:
• SMS #2 (quote delivery): "Valid for 7 days" — implicit via link
• SMS #3 (48hr): "expires in 5 days" — correct (7 - 2 = 5) ✅
• SMS expired (7 days): "quote has expired" ✅
• Email #1: "Valid 7 days" ✅
• Email #2 (72hr): "expires in a few days" ✅
• Quote page: "Valid until {{document.expiry_date}}" ✅
• Fine print: "Quote valid 7 days" ✅

All consistent.

**R16 C5**: PASS

**R17 C2**: 12

**R17 C3**: Booking form handoff:
deposit confirmed SMS links to booking form

**R17 C4**: V2 SMS #7 (deposit confirmed) includes {{custom.booking_form_link}}.

This matches Sheet 10 "Booking Form" in the Quote Form Spec — a separate GHL Form (not Survey) with: full address, preferred date, preferred time, access notes, apartment details.

Booking form is already spec'd. The link just needs to be set as a custom field value.

**R17 C5**: PASS

**R18 C2**: 13

**R18 C3**: Rejection SMS matches
Photo 2 rejection criteria from form spec

**R18 C4**: V2 rejection SMS recommends "a licensed bathroom renovator for a full assessment."

Form spec rejection criteria (Sheet 03): asbestos indicators, structural damage, extensive water damage, load-bearing issues.

All of these genuinely require a licensed renovator. Recommendation is correct and honest.

**R18 C5**: PASS

**R19 C2**: 14

**R19 C3**: Follow-up timing matches
automation timeline in form spec

**R19 C4**: Form spec: Hour 24 → SMS, Hour 48 → SMS, Hour 72 → Email.
V2: 24hr → SMS, 48hr → SMS, 72hr → Email only, 7-day → Expired SMS.

Match ✅. V2 adds the 7-day expired close (not in form spec). This is an addition, not a conflict.

**R19 C5**: PASS

**R20 C2**: 15

**R20 C3**: Total touchpoints in sequence:
6 contacts within 7 days

**R20 C4**: Touch 1: Instant ack SMS (second 0)
Touch 2: Quote SMS + email (0-2 hrs)
Touch 3: Nudge SMS (24hrs)
Touch 4: Nudge SMS (48hrs)
Touch 5: Follow-up email (72hrs)
Touch 6: Expired SMS (7 days)

6 touches matches InsideSales data (50% of sales after 5th contact). ✅
3 SMS in first 3 days (safe ceiling before opt-outs). ✅

**R20 C5**: PASS

**R22 C2**: 16

**R22 C3**: Deposit T&Cs — ACL compliance

**R22 C4**: FIXED: Changed "non-refundable within 48hrs of work" (ambiguous) to "non-refundable if cancelled less than 48 hours before the scheduled work date." Added reschedule option, consumer guarantee statement, written approval for variations.

**R22 C5**: FIXED

**R23 C2**: 17

**R23 C3**: SMS Spam Act classification

**R23 C4**: FIXED: Classified all 8 SMS templates as transactional or commercial. Added STOP clause to all 3 commercial follow-up SMS. Added classification header note to Sheet 03.

**R23 C5**: FIXED

**R24 C2**: 18

**R24 C3**: ACMA Sender ID Register
(enforced 1 July 2026)

**R24 C4**: NEW: If using alphanumeric sender ID, must register with ACMA. GHL default = phone number (not affected). Added to pre-launch checklist in Sheet 12.

**R24 C5**: ACTION ADDED

**R25 C2**: 19

**R25 C3**: Privacy Policy requirement

**R25 C4**: NEW: Privacy Act 1988 requires policy when collecting personal info. Added to pre-launch checklist. Link added to email footer template.

**R25 C5**: ACTION ADDED

**R26 C2**: 20

**R26 C3**: ACL consumer guarantee
statement added

**R26 C4**: FIXED: Added "Your consumer guarantee rights under Australian Consumer Law are not affected" to quote page fine print AND email footer. Cannot contract out of ACL guarantees.

**R26 C5**: FIXED

**R27 C2**: 21

**R27 C3**: Stripe deposit receipt
($75+ NSW requirement)

**R27 C4**: NEW: NSW requires receipt for transactions over $75. Stripe auto-sends, but must verify in settings. Added to pre-launch checklist.

**R27 C5**: VERIFY ADDED

**R29 C2**: FINAL AUDIT: 21/21 checks. 7 fixed, 4 actions added, 10 passed. NSW-compliant with 8 pre-launch actions. See Sheet 12.

