# 13 POST-DEPOSIT TEMPLATES

*Extracted from quote-output-templates-final.xlsx 2026-05-01 PM*

Sheet dimensions: 56 rows × 5 cols

---

**R2 C2**: POST-DEPOSIT → JOB COMPLETE → REVIEW — FULL SEQUENCE

**R3 C2**: Everything that happens AFTER the customer pays their deposit. Covers: booking confirmation, day-before reminder, on-my-way, job complete, balance invoice, NPS, Google review, referral request, PM/builder repeat nurture, and expired lead win-back.

**R5 C2**: SECTION 1: JOB LIFECYCLE — DEPOSIT TO COMPLETION

**R6 C2**: When / Trigger

**R6 C3**: Message Text

**R6 C4**: Psychology / Why It Matters

**R6 C5**: GHL Workflow Setup

**R7 C2**: BOOKING CONFIRMED
(team confirms date
after booking form)

**R7 C3**: SMS:
Hi {{contact.first_name}}, you're booked in! ✅

📅 {{custom.job_date}}
⏰ {{custom.job_time}}
📍 {{custom.job_address}}

Our technician will text you 30 minutes before arrival. If anything changes, just reply to this text.

— [Your Business Name]

**R7 C4**: CERTAINTY: Date, time, address — zero ambiguity.
CONTROL: "Text you 30 min before" + "reply to this text" = they're never in the dark.
COMMITMENT: Seeing the confirmed booking makes cancellation psychologically harder (loss aversion — they'd lose their spot).

**R7 C5**: Trigger: Opp stage → "Booked"
Action: Send SMS

New custom fields needed:
• job_date (Date)
• job_time (Text)
• job_address (Text)

Team fills these after confirming with sub.

**R8 C2**: DAY-BEFORE REMINDER
(24hrs before job)

**R8 C3**: SMS:
Hey {{contact.first_name}}, quick reminder — your bathroom service is tomorrow!

📅 {{custom.job_date}} at {{custom.job_time}}

Please make sure the bathroom area is cleared of personal items. Our tech will text you 30 min before they arrive. 👍

— [Your Business Name]

**R8 C4**: NO-SHOW PREVENTION: Reminder SMS reduces no-shows by 30-50% across service industries.
PREP INSTRUCTION: "Cleared of personal items" prevents delays on site = faster job = happier sub.
TRANSACTIONAL: This is a service reminder, not marketing. No STOP needed.

**R8 C5**: Trigger: Wait until 24hrs before job_date
Action: Send SMS

⚠️ GHL limitation: "Wait until date" requires a Date custom field. Use GHL's "Wait until event" or schedule manually.

Alternative: Create as a separate mini-workflow triggered by stage "Booked" with a calculated wait.

**R9 C2**: ON MY WAY
(30 min before arrival)

**R9 C3**: SMS:
Hi {{contact.first_name}}, your technician is on the way — arriving in about 30 minutes! 🚗

— [Your Business Name]

**R9 C4**: CONTROL: Eliminates "when are they coming?" anxiety.
PROFESSIONALISM: This one text sets you apart from 90% of tradies.
TRUST: You said you'd text 30 min before. You did. Promise kept.

This is the single most impactful "wow" moment in the customer experience.

**R9 C5**: OPTION A: Sub sends manually from ServiceM8 Lite app (has template SMS feature).

OPTION B: Team sends from GHL when sub confirms departure.

OPTION C: Dispatcher sends from GHL conversation tab.

Start with Option C. Move to A when ServiceM8 is live.

**R10 C2**: JOB COMPLETE +
BALANCE DUE
(sub marks complete)

**R10 C3**: SMS:
All done, {{contact.first_name}}! Your bathroom's looking fresh ✨

Here's your invoice for the remaining balance:
${{custom.balance_amount}} — {{custom.invoice_link}}

Pay online, by phone ([phone]), or bank transfer (BSB [XX] ACC [XX] Ref: {{document.number}}).

Thanks for choosing [Your Business Name]! 🙏

**R10 C4**: ENDOWMENT: "Your bathroom's looking fresh" — they now OWN the result.
PAIN OF PAYING: Multiple payment options reduces friction. "Remaining balance" not "amount due" — softer language.
GRATITUDE: "Thanks for choosing" builds relationship for repeat/referral.

Send within 30 minutes of job completion — while the "wow" is still fresh.

**R10 C5**: Trigger: Opp stage → "Completed"
Action: Send SMS

New custom field:
• invoice_link (Text) — Stripe payment link or ServiceM8 invoice link

Team creates invoice, pastes link, moves stage.

**R11 C2**: PAYMENT REMINDER
(48hrs, balance unpaid)

**R11 C3**: SMS:
Hi {{contact.first_name}}, just a gentle reminder — your bathroom service balance of ${{custom.balance_amount}} is outstanding.

Pay here: {{custom.invoice_link}}

Any questions, just reply. 👍

— [Your Business Name]

**R11 C4**: SOFT NUDGE: Most customers simply forget, not avoid. One reminder collects 80%+ of outstanding balances.
TRANSACTIONAL: Payment reminder for completed service = not marketing. No STOP needed.

**R11 C5**: Trigger: Wait 48hrs after "Completed" stage
Condition: IF stage ≠ "Paid"
Action: Send SMS

**R13 C2**: SECTION 2: NPS → GOOGLE REVIEW → REFERRAL (the growth engine)

**R14 C2**: When / Trigger

**R14 C3**: Message Text

**R14 C4**: Psychology / Why It Matters

**R14 C5**: GHL Workflow Setup

**R15 C2**: NPS REQUEST
(2 hours after job complete)

**R15 C3**: SMS:
Hi {{contact.first_name}}, quick question — how'd we go today?

Reply with a number from 1-10 (10 = amazing). 📊

— [Your Business Name]

**R15 C4**: TIMING: 2 hours = "wow" is still fresh but they've had time to use the bathroom.
SIMPLICITY: One number. One reply. Zero effort.
Why NPS first (not direct review request): Filters promoters (9-10) from detractors (1-6). Only send review request to happy customers. Detractors get a callback instead of a 1-star review.

**R15 C5**: Trigger: Wait 2hrs after "Completed" stage
Action: Send SMS

GHL: Use "Reply triggers" or manual review of responses.

Routing:
• 9-10 → next SMS (review request)
• 7-8 → no action
• 1-6 → internal alert for callback

**R16 C2**: GOOGLE REVIEW REQUEST
(if NPS = 9 or 10)

**R16 C3**: SMS:
That's awesome, thanks {{contact.first_name}}! 🎉

Would you mind leaving us a quick Google review? It really helps other homeowners find us.

Tap here: {{custom.google_review_link}}

(Takes 30 seconds — just a star rating and a sentence is perfect!) ⭐

— [Your Business Name]

**R16 C4**: RECIPROCITY: They just said you were a 9-10. Consistency bias = they want to act in line with what they just said.
FRICTION REDUCTION: "30 seconds" + "just a star rating and a sentence" = feels tiny.
SOCIAL PROOF FLYWHEEL: Every review feeds back into quote pages → higher conversion → more jobs → more reviews.

This is the single most important long-term growth driver.

**R16 C5**: Trigger: Reply contains "9" or "10"
Action: Send SMS

New custom field:
• google_review_link (Text) — your Google Business review link

Get link: Search your business on Google → click "Write a review" → copy URL.

Alternative: Use GHL's review request feature (built-in).

**R17 C2**: DETRACTOR CALLBACK
(if NPS = 1-6)

**R17 C3**: INTERNAL ALERT (not sent to customer):

🚨 Low NPS alert
Contact: {{contact.first_name}} {{contact.last_name}}
Phone: {{contact.phone}}
Job: {{custom.service_summary}}
NPS score: [their reply]

Action: Call within 2 hours. Listen. Fix if possible. Offer to send sub back at no cost.

**R17 C4**: DAMAGE CONTROL: A 1-6 score that gets a personal callback often becomes a 9-10 after resolution. The customer feels heard.
REVIEW PREVENTION: Without callback, a 1-6 may go straight to Google and leave a 1-star review. The call intercepts this.
SERVICE RECOVERY PARADOX: Customers who have a problem resolved well are often MORE loyal than customers who never had a problem.

**R17 C5**: Trigger: Reply contains "1" through "6"
Action: Internal notification → Slack #urgent + email to team
Action: Create task: "Call {{contact.first_name}} — low NPS"

DO NOT auto-send any customer-facing message for low scores.

**R18 C2**: REFERRAL REQUEST
(7 days after job complete,
IF NPS ≥ 7)

**R18 C3**: SMS:
Hey {{contact.first_name}}, hope you're still loving the bathroom! 🛁

Know anyone who needs their bathroom freshened up? If they mention your name when they book, we'll send you a $50 gift card as a thank you. 🎁

Just have them text us on [phone] or go to [website]. Cheers!

— [Your Business Name]
Reply STOP to opt out

**R18 C4**: TIMING: 7 days = they've shown friends/family the bathroom ("look what we got done!").
INCENTIVE: $50 gift card is cheap acquisition cost ($50 vs $100-300 ad spend per lead).
SOCIAL PROOF: Word-of-mouth referrals convert 3-5x higher than paid ads.
MENTION NAME: Creates tracking without needing a referral code.

⚠️ COMMERCIAL SMS: STOP clause required.

**R18 C5**: Trigger: Wait 7 days after "Completed"
Condition: IF NPS reply ≥ 7 (or if no NPS reply — assume positive)
Action: Send SMS

⚠️ This is COMMERCIAL (promoting a referral offer). Include STOP clause.

Track referrals: Tag referred contacts with "referred_by_[name]"

**R20 C2**: SECTION 3: PM / BUILDER REPEAT LEAD NURTURE (25-30% of revenue)

**R21 C2**: Property managers and builders are your highest-LTV customers. One PM can send you 5-50 bathrooms per year. One builder can send defect rectification work monthly. These sequences keep you top-of-mind.

**R22 C2**: When / Trigger

**R22 C3**: Message Text

**R22 C4**: Psychology / Why It Matters

**R22 C5**: GHL Workflow Setup

**R23 C2**: PM: POST-FIRST-JOB
(day after job complete)

**R23 C3**: SMS:
Hi {{contact.first_name}}, thanks for trying us on that {{custom.suburb}} bathroom — hope the tenant's happy!

Just so you know: we handle any number of properties. Send us photos of the next one anytime and we'll have a quote back within 2 hours. 📱

We also do annual maintenance packages if you've got a portfolio. Happy to chat anytime.

— [Your Business Name]
Reply STOP to opt out

**R23 C4**: ANCHORING SPEED: "Quote back within 2 hours" — PMs manage 20+ tasks daily. Speed is their #1 selection criterion.
SCALE SIGNAL: "Any number of properties" tells them you can handle volume.
MAINTENANCE UPSELL: Annual maintenance = recurring revenue.
This one SMS can turn a $1,200 job into $12,000/year.

**R23 C5**: Trigger: Job complete + customer_type = "property_mgr"
Wait: 1 day
Action: Send SMS

⚠️ COMMERCIAL: STOP required.

**R24 C2**: PM: QUARTERLY CHECK-IN
(every 90 days)

**R24 C3**: Email:
Subject: Quick check-in — any bathrooms needing attention, {{contact.first_name}}?

Hi {{contact.first_name}},

Just touching base — if any of your properties need bathroom maintenance (regrouting, resurfacing, mould treatment), we're here.

Remember: photos + 2-hour quote turnaround. No site visits needed.

[CTA: SEND US PHOTOS →]

Cheers,
[Your name]
[Your Business Name]

**R24 C4**: MERE EXPOSURE EFFECT: Being seen every 90 days keeps you top-of-mind without being annoying.
EMAIL NOT SMS: Quarterly = too infrequent for SMS (feels random). Email = professional touchpoint.
ZERO PRESSURE: "If any of your properties need" — not pushy.
PMs typically rotate through their portfolio every 6-12 months for maintenance. Your email lands at the right time for ~25% of their properties each quarter.

**R24 C5**: Trigger: Tag = "pm_lead" + job complete
Action: Add to "PM Nurture" email sequence
Frequency: Every 90 days
Condition: Remove if they submit a new quote form (they're active — don't need nurture)

Build as GHL Email Campaign (not workflow) for easier management.

**R25 C2**: BUILDER: POST-FIRST-JOB
(day after job complete)

**R25 C3**: SMS:
Thanks {{contact.first_name}} — that defect rectification in {{custom.suburb}} is done and dusted.

We're set up for ongoing builder work: batch pricing available for 3+ bathrooms, and we can turn most jobs around within the week.

Save this number — send photos anytime for a 2-hour quote. 📱

— [Your Business Name]
Reply STOP to opt out

**R25 C4**: TRADE LANGUAGE: "Defect rectification" — speaks their language.
BATCH PRICING: Signals volume discount = they'll send you more.
SPEED: "Turn around within the week" — builders work to construction schedules.
"SAVE THIS NUMBER": Makes you a contact in their phone, not a Google search result.

**R25 C5**: Trigger: Job complete + customer_type = "builder"
Wait: 1 day
Action: Send SMS

⚠️ COMMERCIAL: STOP required.

**R26 C2**: SELF-MANAGING LANDLORD:
MINIMUM STANDARDS
REMINDER (if NSW)

**R26 C3**: Email:
Subject: NSW rental standards reminder — is your bathroom compliant, {{contact.first_name}}?

Hi {{contact.first_name}},

Since May 2025, NSW rental properties must meet minimum standards including functional, clean bathrooms in reasonable repair.

We fixed one of your bathrooms previously — if your other properties need attention, send us photos for a free 2-hour quote.

[CTA: CHECK MY OTHER PROPERTIES →]

No site visits needed. Just photos from your phone.

[Your Business Name]

**R26 C4**: REGULATORY TRIGGER: NSW minimum rental standards (May 2025) mean landlords MUST maintain bathrooms. This is a real compliance obligation, not manufactured urgency.
FEAR OF NON-COMPLIANCE: Landlords who've already used you for one property are the easiest upsell.
Send once. Not a sequence — just a one-off nudge 30 days after first job.

**R26 C5**: Trigger: Job complete + customer_type = "owner" + tag contains "landlord" or pm_bathroom_count exists
Wait: 30 days
Action: Send Email (one-off)

⚠️ Only send to customers who indicated they own rental properties. Don't send to owner-occupiers.

**R28 C2**: SECTION 4: EXPIRED LEAD WIN-BACK (free money)

**R29 C2**: Leads who didn't convert aren't dead — they just weren't ready. 15-20% of expired leads convert within 6 months when nurtured. These cost $0 in ad spend.

**R30 C2**: When / Trigger

**R30 C3**: Message Text

**R30 C4**: Psychology / Why It Matters

**R30 C5**: GHL Workflow Setup

**R31 C2**: 30-DAY WIN-BACK
(30 days after expired)

**R31 C3**: SMS:
Hey {{contact.first_name}}, it's [Your Business Name]. We quoted your bathroom a month ago.

Still thinking about it? Your price may have changed — reply "QUOTE" for a fresh one. No obligation. 📱

Reply STOP to opt out

**R31 C4**: TIMING: 30 days = enough time has passed that it doesn't feel pushy.
"PRICE MAY HAVE CHANGED": Creates reason to re-engage without discounting.
"REPLY QUOTE": One-word action = zero friction.
COST: $0 acquisition cost — you already paid for this lead.

**R31 C5**: Trigger: 30 days after stage → "Lost"
Condition: stage still = "Lost" (not re-engaged)
Action: Send SMS

⚠️ COMMERCIAL: STOP required.

If they reply "QUOTE": team reviews photos (still on file), sends fresh quote. Move back to "New Quote" stage.

**R32 C2**: 90-DAY WIN-BACK
(seasonal/trigger email)

**R32 C3**: Email:
Subject: {{contact.first_name}}, your bathroom hasn't fixed itself yet 😉

Hi {{contact.first_name}},

We quoted your {{custom.area_selected}} work back in [month]. If it's still on your list, we're still here.

Same deal: send us photos, get a quote within 2 hours, no obligation.

[CTA: GET A FRESH QUOTE →]

Cheers,
[Your Business Name]

Unsubscribe

**R32 C4**: HUMOUR: "Hasn't fixed itself yet" — light, memorable, non-threatening.
SPECIFICITY: References their exact service + area from the original quote.
LOSS AVERSION: The problem is still there. Maybe worse now.
Email not SMS at 90 days — SMS after 30 days of silence feels intrusive.

**R32 C5**: Trigger: 90 days after stage → "Lost"
Condition: stage still = "Lost"
Action: Send Email

This is the last automated touchpoint. After this, the lead stays in your database for manual campaigns (seasonal promos, etc).

**R35 C2**: COMPLETE MESSAGE COUNT — FULL CUSTOMER LIFECYCLE

**R36 C2**: Phase

**R36 C3**: Messages

**R36 C4**: Type

**R36 C5**: Total Touchpoints

**R37 C2**: PRE-QUOTE
(Sheet 03)

**R37 C3**: Instant ack SMS

**R37 C4**: Transactional

**R37 C5**: 1

**R38 C2**: QUOTE DELIVERY
(Sheets 03-04)

**R38 C3**: Quote SMS + Quote Email

**R38 C4**: Transactional

**R38 C5**: 2 (simultaneous)

**R39 C2**: FOLLOW-UP
(Sheets 03-04)

**R39 C3**: 24hr SMS + 48hr SMS + 72hr Email + Expired SMS

**R39 C4**: 3 Commercial + 1 Trans

**R39 C5**: 4

**R40 C2**: POST-DEPOSIT
(This sheet §1)

**R40 C3**: Booking confirmed + Day-before reminder + On my way

**R40 C4**: Transactional

**R40 C5**: 3

**R41 C2**: JOB COMPLETE
(This sheet §1)

**R41 C3**: Balance due SMS + Payment reminder SMS

**R41 C4**: Transactional

**R41 C5**: 2

**R42 C2**: REVIEW ENGINE
(This sheet §2)

**R42 C3**: NPS SMS + Google review SMS + Referral SMS

**R42 C4**: 2 Trans + 1 Commercial

**R42 C5**: 3

**R43 C2**: REPEAT NURTURE
(This sheet §3)

**R43 C3**: PM post-job + PM quarterly + Builder post-job + Landlord standards

**R43 C4**: 4 Commercial

**R43 C5**: 4 (PM/builder only)

**R44 C2**: WIN-BACK
(This sheet §4)

**R44 C3**: 30-day SMS + 90-day Email

**R44 C4**: 2 Commercial

**R44 C5**: 2 (expired only)

**R46 C2**: TOTAL: 21 message templates covering the complete lifecycle. Homeowner sees ~12 touchpoints. PM/builder sees ~16. Every touchpoint has a specific job to do.

**R48 C2**: NEW CUSTOM FIELDS NEEDED (add to Sheet 08):

**R49 C2**: Field Name

**R49 C3**: Type

**R49 C4**: Source

**R50 C2**: job_date

**R50 C3**: Date

**R50 C4**: Team sets after confirming with sub

**R51 C2**: job_time

**R51 C3**: Single Line Text

**R51 C4**: Team sets — e.g. "2:00 PM"

**R52 C2**: job_address

**R52 C3**: Single Line Text

**R52 C4**: From booking form (full street address)

**R53 C2**: invoice_link

**R53 C3**: Single Line Text

**R53 C4**: Stripe/ServiceM8 invoice URL

**R54 C2**: google_review_link

**R54 C3**: Single Line Text

**R54 C4**: Your Google Business review URL (same for all)

**R56 C2**: Total custom fields: 39 (form) + 5 (quoting) + 5 (post-deposit) = 49 fields.

