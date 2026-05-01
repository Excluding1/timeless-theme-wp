# 03 SMS TEMPLATES

*Extracted from quote-output-templates-final.xlsx 2026-05-01 PM*

Sheet dimensions: 13 rows × 5 cols

---

**R2 C2**: SMS TEMPLATES — PSYCHOLOGY-OPTIMISED QUOTE SEQUENCE

**R3 C2**: Each SMS is designed around specific psychological triggers. GHL custom values in {{brackets}}.

⚠️ SPAM ACT 2003 CLASSIFICATION:
• TRANSACTIONAL (no STOP needed): Instant Ack, Quote Delivery, Deposit Confirmed, Rejection
• COMMERCIAL (STOP required): Nudge 24hr, Nudge 48hr, Expired — include "Reply STOP to opt out"
• Consent basis: Customer's quote request = inferred consent for quote-related follow-ups

**R5 C2**: When / Trigger

**R5 C3**: SMS Text (paste into GHL)

**R5 C4**: Psychology Used

**R5 C5**: GHL Workflow Setup

**R6 C2**: INSTANT ACK
(Second 0 after submit)

**R6 C3**: Thanks {{contact.first_name}}! We've got your bathroom photos and we're reviewing them now. You'll have your quote within 2 hours. 📱

— [Your Business Name]

**R6 C4**: SPEED: Sets expectation + proves responsiveness. COMMITMENT: Validates their form effort immediately. 78% choose first responder.

**R6 C5**: Trigger: Form submitted
Action: Send SMS
No conditions

**R7 C2**: QUOTE DELIVERY
(0-2 hrs after submit)

**R7 C3**: Hi {{contact.first_name}}, your quote is ready 🎉

{{custom.service_summary}}
Your price: ${{opportunity.monetary_value}} inc GST

That's 1/10th the cost of a full reno. Lock in your date with a small ${{custom.deposit_amount}} deposit — pay the rest after the job's done:

{{documents.proposal_link}}

**R7 C4**: ANCHORING: "1/10th the cost of a full reno" anchors against $15K-$30K.
PAIN OF PAYING: Deposit is "small" + balance is "after the job's done."
LOSS AVERSION: "Lock in your date" = they lose availability if they wait.

**R7 C5**: Trigger: Opp stage → "Quoted"
Action: Send SMS + Send Email
Team sets custom fields first

**R8 C2**: NUDGE #1
(24hrs, no deposit)

**R8 C3**: Hey {{contact.first_name}} — just checking you saw your bathroom quote (${{opportunity.monetary_value}})?

Here's the link again: {{documents.proposal_link}}

The deposit's only ${{custom.deposit_amount}} to lock in your date. The rest is after the job. Reply if you've got any Qs! 👍

[Your Business Name] | Reply STOP to opt out

**R8 C4**: PROCESSING FLUENCY: Short, casual, easy to read.
COMMITMENT: "Just checking" = soft, not pushy.
PAIN OF PAYING: Repeats "only $X" + "rest is after."

**R8 C5**: Trigger: Wait 24hrs
Condition: IF stage ≠ Deposit Paid
Action: Send SMS

**R9 C2**: NUDGE #2
(48hrs, no deposit)

**R9 C3**: Hi {{contact.first_name}}, quick heads up — your ${{opportunity.monetary_value}} bathroom quote expires in 5 days.

Every week grout crumbles a bit more and mould spreads a bit further. The good news: we can have it sorted in a day.

${{custom.deposit_amount}} deposit locks your spot: {{documents.proposal_link}}

[Your Business Name] | Reply STOP to opt out

**R9 C4**: LOSS AVERSION: "Grout crumbles more, mould spreads further" = deterioration frame.
URGENCY: "Expires in 5 days" is real, not fake.
GAIN FRAME: "Sorted in a day" = easy win.

**R9 C5**: Trigger: Wait 24hrs after #1
Condition: IF stage ≠ Deposit Paid
Action: Send SMS

**R10 C2**: 72HR EMAIL ONLY
(no SMS — avoid fatigue)

**R10 C3**: (See Sheet 04 — Email Templates)

**R10 C4**: SMS FATIGUE: 3 texts in 3 days is the ceiling. Research shows >3 SMS in rapid succession triggers opt-outs. Email at 72hrs gives a different channel + allows richer content (photos, testimonial).

**R10 C5**: Trigger: Wait 24hrs after #2
Condition: IF stage ≠ Deposit Paid
Action: Send Email ONLY

**R11 C2**: EXPIRED
(7 days, no deposit)

**R11 C3**: Hi {{contact.first_name}}, your bathroom quote has expired — no stress at all.

If things change, just reply "QUOTE" and we'll send a fresh one. 👋

[Your Business Name] | Reply STOP to opt out

**R11 C4**: DOOR STAYS OPEN: No guilt, no pressure. "Reply QUOTE" = zero-effort re-engagement.
BRAND: Friendly close builds long-term trust. Some will come back weeks/months later.

**R11 C5**: Trigger: Wait 4 days after 72hr email
Condition: IF stage ≠ Deposit Paid
Action: Send SMS → Move to "Expired"

**R12 C2**: DEPOSIT CONFIRMED
(Stripe payment received)

**R12 C3**: Awesome {{contact.first_name}}! ✅ Deposit confirmed.

Pick your preferred date here and we'll get you booked in:
{{custom.booking_form_link}}

We'll confirm your exact time within 24hrs. Your bathroom's about to look brand new! 🛁

**R12 C4**: COMMITMENT: They've now paid — consistency drives them forward.
ENDOWMENT: "Your bathroom's about to look brand new" = they own the future state.
FLUENCY: One clear action — pick your date.

**R12 C5**: Trigger: Payment received
Action: Move stage → Deposit Paid
Action: Send SMS
Action: Send booking email
Action: Slack notification

**R13 C2**: REJECTION
(team moves to Rejected)

**R13 C3**: Hi {{contact.first_name}}, thanks for sending through your bathroom photos.

After reviewing them, this one needs a different approach — we'd recommend a licensed bathroom renovator for a full assessment.

Sorry we couldn't help this time. If you need anything else down the track, we're here! 👋

**R13 C4**: BRAND PROTECTION: Honest, no blame, helpful recommendation.
TRUST: Turning away work you can't do well builds massive long-term credibility.
FUTURE VALUE: "Down the track" keeps door open.

**R13 C5**: Trigger: Opp stage → Rejected
Action: Send SMS
Action: Tag "rejected"
Action: Add internal note

