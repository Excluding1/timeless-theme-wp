# 14 EDGE CASES + EXCEPTIONS

*Extracted from quote-output-templates-final.xlsx 2026-05-01 PM*

Sheet dimensions: 56 rows × 4 cols

---

**R2 C2**: EDGE CASES + EXCEPTION TEMPLATES — THE STUFF THAT ACTUALLY HAPPENS

**R3 C2**: 13 scenarios that WILL occur. Without templates, your team improvises, sends inconsistent messages, and burns trust. These are copy-paste ready for GHL SMS Snippets.

**R5 C2**: A. PRE-QUOTE PROBLEMS

**R6 C2**: Scenario

**R6 C3**: Template Text

**R6 C4**: When to Use + Notes

**R7 C2**: PHOTO RESEND
(blurry / too dark /
wrong angle)

**R7 C3**: SMS:
Hi {{contact.first_name}}, thanks for your bathroom photos!

We need a slightly better shot to give you an accurate quote. Could you resend:

📸 [specific photo needed — e.g. "a wider shot of the full shower from the doorway"]

Tip: Stand back, daylight on, flash off. 👍

— [Your Business Name]

**R7 C4**: WHEN: Team reviews photos and can't determine size or condition.
HOW: Team sends manually from GHL conversation tab. Not automated — requires judgment.

Keep specific: don't say "better photos please." Say exactly which photo and what angle.

Save as GHL SMS Snippet: "Photo Resend" — team customises the [specific photo] part each time.

This happens on ~10-15% of submissions. Having a template saves 3 minutes per occurrence.

**R8 C2**: QUOTE DELAYED
(team can't deliver
within 2 hours)

**R8 C3**: SMS:
Hi {{contact.first_name}}, just a heads up — we're working through a few quotes ahead of yours and need a bit more time.

You'll have your quote by [time/today/tomorrow morning]. Sorry for the wait!

— [Your Business Name]

**R8 C4**: WHEN: Volume spike, team unavailable, complex job needs discussion.
HOW: Team sends manually when they realise 2hr promise will be missed.

⚠️ CRITICAL: You promised 2 hours. Breaking that promise without communication destroys trust instantly. This SMS is damage control — send it BEFORE the 2hrs expire, not after.

Save as GHL SMS Snippet: "Quote Delayed"

**R10 C2**: B. QUOTE QUESTIONS + CHANGES

**R11 C2**: Scenario

**R11 C3**: Template Text

**R11 C4**: When to Use + Notes

**R12 C2**: CUSTOMER ASKS
A QUESTION
(replies to quote SMS)

**R12 C3**: No template — REPLY PERSONALLY.

Guidance for team:
• Reply within 15 minutes during business hours
• Use their first name
• Answer the specific question directly
• End with a soft close: "Want me to lock in your date?"
• If pricing question: "The price is fixed — no surprises on the day."
• If timeline question: "Most jobs are done in [X] hours. Ready to use in 24-48 hours."
• If trust question: "Happy to send you more before/after photos of similar jobs."

**R12 C4**: WHY NO TEMPLATE: Questions are personal. A templated reply to a genuine question feels robotic and kills trust.

RULE: Every question reply ends with a soft close or links back to the proposal page.

GHL: All customer replies land in the Conversations tab. Set up a Slack alert for incoming replies so team responds fast.

Speed here matters as much as speed on the original quote.

**R13 C2**: CUSTOMER WANTS
DIFFERENT SERVICE
(change of scope)

**R13 C3**: SMS:
No worries {{contact.first_name}}, let me adjust that for you.

I'll update your quote to [new service] and send a revised version within the hour. 👍

— [Your Business Name]

**R13 C4**: WHEN: Customer replies saying they want a different service than quoted (e.g. they were quoted regrout but want full recoat).
HOW: Team manually.

1. Look up new price in Master Pricing
2. Update custom fields
3. Create new proposal (or clone + edit)
4. Send updated quote
5. Old proposal auto-expires

Save as GHL SMS Snippet: "Requote"

**R15 C2**: C. CANCELLATIONS, RESCHEDULES + NO-SHOWS

**R16 C2**: Scenario

**R16 C3**: Template Text

**R16 C4**: When to Use + Notes

**R17 C2**: CUSTOMER CANCELS
48+ HRS NOTICE
(deposit transfers)

**R17 C3**: SMS:
No worries {{contact.first_name}}, we've cancelled your booking for {{custom.job_date}}.

Your deposit is held as credit — just let us know when you'd like to rebook and we'll apply it to your new date. No expiry on the credit. 👍

Thanks for letting us know.

— [Your Business Name]

**R17 C4**: ACL COMPLIANT: 48+ hrs notice = deposit transfers to new date (per our T&Cs). Not forfeited.

"No expiry on the credit" = generous, builds goodwill, and most people rebook within 1-3 months.

GHL: Move stage → "On Hold". Tag: "deposit_credit". Note the credit amount.

Save as Snippet: "Cancel 48hrs+"

**R18 C2**: CUSTOMER CANCELS
WITHIN 48 HRS
(deposit non-refundable)

**R18 C3**: SMS:
Hi {{contact.first_name}}, we understand — things come up.

Unfortunately, as our technician and materials are already allocated for {{custom.job_date}}, we're unable to refund the deposit as per our terms.

However, we can reschedule to another date if that works better? Just let us know. 📅

— [Your Business Name]

**R18 C4**: ACL COMPLIANT: <48hrs = deposit non-refundable because sub is committed + materials allocated. This is a legitimate business cost (not a penalty).

⚠️ ALWAYS offer reschedule first. Most "cancellations" are actually "not this date" — offering to move the date saves the job 60%+ of the time.

If customer disputes: refer to T&Cs they accepted when paying deposit. If escalated: offer partial credit as goodwill (cheaper than an NCAT dispute).

GHL: Move stage → "On Hold". Tag: "late_cancel". Internal note with reason.

**R19 C2**: CUSTOMER REQUESTS
RESCHEDULE

**R19 C3**: SMS:
No problem {{contact.first_name}}! Let's find a better date. 📅

When works for you? Reply with your preferred day or tap here to pick a date:
{{custom.booking_form_link}}

— [Your Business Name]

**R19 C4**: EASY: No deposit implications. Just move the date.

GHL: Update job_date and job_time. Notify sub of change.

If this happens frequently (>15% of bookings), your day-before reminder is working — customers who would have no-showed are rescheduling instead. That's a win.

**R20 C2**: SUB CANCELS /
UNAVAILABLE
(you need to reschedule)

**R20 C3**: SMS:
Hi {{contact.first_name}}, apologies — our technician has had an unexpected issue and we need to reschedule your {{custom.job_date}} appointment.

We're really sorry about this. We can offer you:
📅 [Next available date] or [Alternative date]

Reply with which works best, or tap here to pick a new date:
{{custom.booking_form_link}}

— [Your Business Name]

**R20 C4**: ⚠️ THIS IS YOUR FAULT, NOT THE CUSTOMER'S. Own it. Apologise. Offer dates immediately.

DO NOT blame the sub ("our subcontractor cancelled"). Say "our technician" — the customer doesn't know or care about your sub model.

If the customer is annoyed: offer a small goodwill gesture (e.g. $50 off the balance). Cheaper than a bad review.

GHL: Update job_date. Internal note: sub cancellation reason. Track frequency — if a sub cancels repeatedly, replace them.

**R21 C2**: CUSTOMER NO-SHOWS
(not home on the day)

**R21 C3**: SMS:
Hi {{contact.first_name}}, our technician arrived at {{custom.job_address}} but wasn't able to access the property.

Are you nearby? We can wait 15 minutes. Otherwise, let's reschedule — reply with a better date and we'll get you sorted. 📅

— [Your Business Name]

(If no reply within 30 min):
Hi {{contact.first_name}}, our tech has had to move on to the next job. No stress — your deposit is still credited. Reply when you'd like to rebook. 👍

**R21 C4**: TWO-STAGE: First SMS gives them 15 min (maybe they're running late). Second SMS if no response.

Deposit stays credited — don't forfeit. The customer forgot, they didn't cancel. Punishing forgetfulness creates disputes.

Sub gets paid a callout fee (check your sub agreement for no-access terms).

Day-before reminder exists to prevent this. If no-shows happen often, add a morning-of reminder too.

GHL: Move stage → "No Access". Tag: "no_show". Internal note.

**R23 C2**: D. ON-SITE VARIATION (additional work found)

**R24 C2**: Scenario

**R24 C3**: Template Text

**R24 C4**: When to Use + Notes

**R25 C2**: ADDITIONAL WORK
FOUND ON-SITE
(variation quote)

**R25 C3**: SMS (sent by team, NOT sub):
Hi {{contact.first_name}}, our technician has started work and found something extra that needs attention:

[Description of additional work — e.g. "The silicone behind the bath is also deteriorated and should be replaced while we're here."]

Extra cost: $[amount] inc GST
If you'd like us to do it now, reply YES. If not, no worries — we'll finish the original job as quoted.

— [Your Business Name]

**R25 C4**: ⚠️ ACL REQUIREMENT: Additional work MUST be quoted and approved IN WRITING before proceeding. This SMS + their "YES" reply = written approval.

Sub should NEVER do extra work without team approval. Process:
1. Sub finds issue → photos + sends to team via Slack/ServiceM8
2. Team looks up additional price in Master Pricing
3. Team sends this SMS to customer
4. Customer replies YES → sub proceeds. Customer replies NO → sub finishes original scope only.
5. If YES: update opportunity value. Add variation to invoice.

Save as GHL Snippet: "On-Site Variation"

This protects you legally AND builds trust — the customer sees you won't surprise them with extra charges.

**R27 C2**: E. PAYMENT ESCALATION (balance overdue)

**R28 C2**: Scenario

**R28 C3**: Template Text

**R28 C4**: When to Use + Notes

**R29 C2**: 7-DAY OVERDUE
(after 48hr reminder
already sent)

**R29 C3**: SMS:
Hi {{contact.first_name}}, just following up on the remaining balance of ${{custom.balance_amount}} for your bathroom service.

If there's an issue with payment, please let us know — we're happy to work something out.

Pay here: {{custom.invoice_link}}

— [Your Business Name]

**R29 C4**: TONE: Helpful, not threatening. "Happy to work something out" opens the door for payment plans.

Most late payers (90%+) are simply busy or forgot. A third reminder collects most of them.

GHL: Wait 5 days after 48hr reminder (= 7 days total post-job).
Condition: IF stage ≠ "Paid"

**R30 C2**: 14-DAY OVERDUE
(final SMS before
formal notice)

**R30 C3**: SMS:
Hi {{contact.first_name}}, your balance of ${{custom.balance_amount}} is now 2 weeks overdue.

We'd really prefer to sort this out between us. Can you reply and let us know what's going on? We can arrange a payment plan if needed.

If we don't hear back, we'll need to send a formal notice. We'd rather not go down that path.

— [Your Business Name]

**R30 C4**: ESCALATION: This is the warning shot. "Formal notice" signals legal action without threatening it directly.

"Payment plan" offer = genuine. Some customers had unexpected expenses. A $1,494 balance split into 3x $498 is better than no payment.

GHL: Wait 7 days after 7-day reminder.
Condition: IF stage ≠ "Paid"

After this: if still unpaid, move to manual process — formal letter of demand (get a lawyer template), then NCAT small claims if under $40K.

**R31 C2**: PAYMENT PLAN
(customer requests
instalments)

**R31 C3**: SMS:
No worries {{contact.first_name}}, let's sort out a plan that works.

We can split your balance of ${{custom.balance_amount}} into [2/3] payments:
• $[amount] due [date]
• $[amount] due [date]
[• $[amount] due [date]]

Reply YES to confirm this plan and we'll send you the first payment link.

— [Your Business Name]

**R31 C4**: WHEN: Customer responds to overdue SMS asking for more time.
HOW: Team sends manually with specific amounts and dates.

KEEP IT SIMPLE: 2-3 instalments max. Weekly or fortnightly.

GHL: Tag "payment_plan". Create manual reminders for each instalment due date.

Stripe: Can set up recurring payment links. Or simply send a Text-To-Pay link on each due date.

**R33 C2**: F. POST-JOB ISSUES (warranty + reputation)

**R34 C2**: Scenario

**R34 C3**: Template Text

**R34 C4**: When to Use + Notes

**R35 C2**: WARRANTY CLAIM
(customer contacts
weeks/months later)

**R35 C3**: SMS:
Hi {{contact.first_name}}, thanks for letting us know. Sorry to hear about that.

Could you send us a photo of the issue? We'll review it and get back to you within 24 hours with a plan to sort it out.

📸 Just reply to this text with the photo.

— [Your Business Name]

**R35 C4**: PROCESS:
1. Customer contacts you (call, text, email)
2. Send this SMS requesting photo
3. Review photo — is this a warranty issue or wear/misuse?
4. If warranty: schedule sub to return at no cost. Send: "We'll send our tech back to fix this — no charge. When works for you?"
5. If not warranty: explain honestly, offer discounted re-service.

GHL: Create new opportunity from existing contact. Stage: "Warranty Claim". Tag: "warranty".

⚠️ ACL: Services must be delivered with "due care and skill." If the coating peels in 3 months, that's your problem. Fix it fast and without argument — warranty callbacks handled well actually INCREASE lifetime value and referrals.

**R36 C2**: NEGATIVE GOOGLE
REVIEW
(public response needed)

**R36 C3**: GOOGLE REVIEW REPLY (not SMS — this is public):

"Hi [Name], thanks for your feedback and sorry to hear about your experience. We take this seriously.

We'd love the chance to make it right — could you text or call us on [phone] so we can sort this out?

— [Your name], [Your Business Name]"

THEN — after contacting them privately and resolving:

Ask (via SMS, not publicly): "Thanks for chatting with us about that {{contact.first_name}}. If you feel we've sorted it out, would you mind updating your review? Totally understand if not. 🙏"

**R36 C4**: RULES FOR NEGATIVE REVIEW RESPONSES:
1. Reply within 24 hours — Google shows "owner response" and delays look bad.
2. NEVER argue publicly. NEVER explain what went wrong publicly. Take it offline.
3. Apologise. Don't blame the customer or the sub.
4. Offer to fix it.
5. After resolution: politely ask them to update the review. 40-50% will.
6. If they won't update: your professional public response speaks for itself to future readers.

A business with 50 five-star reviews and 2 one-star reviews with professional responses looks MORE trustworthy than a business with 50 five-star reviews and zero negatives (looks fake).

GHL: Tag: "negative_review". Internal note with resolution. Track which sub was involved — patterns = sub quality issue.

**R39 C2**: COMPLETE SCENARIO COVERAGE — FINAL COUNT

**R40 C2**: Category

**R40 C3**: Templates

**R40 C4**: Count

**R41 C2**: Sheet 03: Pre-deposit SMS

**R41 C3**: Instant ack, quote delivery, nudge x2, expired, deposit confirmed, rejection

**R41 C4**: 7

**R42 C2**: Sheet 04: Pre-deposit Email

**R42 C3**: Quote delivery, 72hr follow-up

**R42 C4**: 2

**R43 C2**: Sheet 05: Quote Page

**R43 C3**: Proposal template (11 sections)

**R43 C4**: 1

**R44 C2**: Sheet 13 §1: Job lifecycle

**R44 C3**: Booking confirmed, day-before, on my way, balance due, payment reminder

**R44 C4**: 5

**R45 C2**: Sheet 13 §2: Review engine

**R45 C3**: NPS, Google review, detractor alert, referral

**R45 C4**: 4

**R46 C2**: Sheet 13 §3: Repeat nurture

**R46 C3**: PM post-job, PM quarterly, builder post-job, landlord standards

**R46 C4**: 4

**R47 C2**: Sheet 13 §4: Win-back

**R47 C3**: 30-day SMS, 90-day email

**R47 C4**: 2

**R48 C2**: Sheet 14 A: Pre-quote problems

**R48 C3**: Photo resend, quote delayed

**R48 C4**: 2

**R49 C2**: Sheet 14 B: Quote questions

**R49 C3**: Reply guidance, requote/scope change

**R49 C4**: 2

**R50 C2**: Sheet 14 C: Cancellations

**R50 C3**: Cancel 48hrs+, cancel <48hrs, reschedule, sub cancels, no-show

**R50 C4**: 5

**R51 C2**: Sheet 14 D: On-site variation

**R51 C3**: Additional work approval

**R51 C4**: 1

**R52 C2**: Sheet 14 E: Payment escalation

**R52 C3**: 7-day overdue, 14-day overdue, payment plan

**R52 C4**: 3

**R53 C2**: Sheet 14 F: Post-job issues

**R53 C3**: Warranty claim, negative review response

**R53 C4**: 2

**R55 C2**: GRAND TOTAL: 40 templates/scenarios covering every stage of the customer journey.

**R56 C2**: 36 scenarios mapped. 23 covered in Sheets 03-13. 13 edge cases added in Sheet 14. Zero gaps remaining.

