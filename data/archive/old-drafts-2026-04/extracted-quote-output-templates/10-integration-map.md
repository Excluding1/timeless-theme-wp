# 10 INTEGRATION MAP

*Extracted from quote-output-templates-final.xlsx 2026-05-01 PM*

Sheet dimensions: 35 rows × 4 cols

---

**R2 C2**: FULL INTEGRATION MAP — HOW EVERYTHING CONNECTS

**R3 C2**: This shows how the quote output system connects to every other system you've built. Follow this to understand the full customer journey from ad click to Google review.

**R5 C2**: Stage

**R5 C3**: What Happens

**R5 C4**: Systems Involved

**R6 C2**: 1. AD CLICK
→ Landing Page

**R6 C3**: Customer searches "shower regrouting Sydney" → clicks Google Ad → lands on service-specific landing page.

Landing page has: hero image, 3-step process, before/after photos, Google reviews widget, quote form embed.

**R6 C4**: Google Ads → Landing Page (GHL Funnel)

📋 STILL TO BUILD:
• Landing pages (one per service)
• Google Ads campaign structure

**R7 C2**: 2. FORM SUBMIT
→ GHL Survey

**R7 C3**: Customer completes 4-step form (90 seconds):
Step 1: What area + what service
Step 2: Suburb, property type, customer type
Step 3: Photos uploaded
Step 4: Contact details

Submit → confirmation message on same page.

**R7 C4**: GHL Survey ("Bathroom Quote Form")

✅ BUILT: Quote Form Spec v4
• 37 custom fields
• 15 conditional logic rules
• 8 area paths

**R8 C2**: 3. INSTANT ACK
(Second 0)

**R8 C3**: GHL Workflow #1 fires:
• Contact created with all form data
• Opportunity created in "Bathroom Quotes" pipeline (stage: New Quote)
• Tags applied (area, customer type)
• SMS to customer: "We've got your photos, quote within 2 hours"
• Slack notification to #new-quote with photos + data

**R8 C4**: GHL Workflow #1 ("Instant Quote Ack")
GHL → Slack webhook

✅ BUILT: This file, Sheet 03 SMS #1
✅ BUILT: Quote Form Spec, Phase 5

**R9 C2**: 4. TEAM REVIEW
(0-120 minutes)

**R9 C3**: Team member opens contact in GHL:
• Reviews Photo 2 (rejection gate)
• Determines size from Photo 1
• Identifies service from form data
• Checks for upcharges (no lift, epoxy, commercial)
• Looks up price in Master Pricing spreadsheet
• Fills custom fields: service_summary, deposit_amount, balance_amount

IF Photo 2 fails rejection criteria → move stage to "Rejected" → triggers rejection SMS
IF OK → proceed to quoting.

**R9 C4**: GHL Contact Record (photos + form data)
Master Pricing spreadsheet (price lookup)

✅ BUILT: Master Pricing (135 services, 56 materials, 6 travel zones)
✅ BUILT: This file, Sheet 03 SMS #8 (rejection)
✅ BUILT: Quote Form Spec, Sheet 03 (photo specs + rejection gates)

**R10 C2**: 5. QUOTE CREATED
(team action)

**R10 C3**: Team creates proposal in GHL:
• Payments → Documents & Contracts → + New from template
• Selects "Bathroom Quote" template
• Sets price in product widget
• Inserts 2-3 customer photos into proposal
• Sets 10% deposit via Stripe
• Sets expiry (7 days)
• Clicks Send
• Moves opportunity stage to "Quoted"

Time: 3-5 minutes per quote.

**R10 C4**: GHL Documents & Contracts (proposal template)
Stripe (deposit payment)

✅ BUILT: This file, Sheet 05 (Quote Page content)
✅ BUILT: This file, Sheet 07 Steps 3-4

**R11 C2**: 6. QUOTE DELIVERED
(automated)

**R11 C3**: GHL Workflow #2 fires (triggered by stage → "Quoted"):
• SMS #2 sent: price + anchoring + proposal link
• Email #1 sent: full quote with their photo + summary + CTA
• Customer clicks link → opens quote page in browser
• Quote page shows: their photos, scope, price box with renovation anchor, deposit button, testimonial, guarantee

**R11 C4**: GHL Workflow #2 ("Quote Delivery Sequence")
GHL SMS + Email templates
GHL Proposal page (Documents & Contracts)

✅ BUILT: This file, Sheets 03-05

**R12 C2**: 7. FOLLOW-UP SEQUENCE
(automated, IF no deposit)

**R12 C3**: Workflow #2 continues:
• 24hrs: SMS nudge with price + link
• 48hrs: SMS with loss aversion frame + expiry reminder
• 72hrs: Email with before/after + testimonial (no SMS — fatigue ceiling)
• 7 days: Expired SMS + stage → "Lost"

At ANY point: customer pays deposit → Workflow #3 fires → sequence stops.

**R12 C4**: GHL Workflow #2 (continuation)

✅ BUILT: This file, Sheet 03 (SMS #3-6) + Sheet 04 (Email #2)

**R13 C2**: 8. DEPOSIT PAID
(customer action)

**R13 C3**: Customer clicks "Pay Deposit" on quote page:
• Stripe processes 10% payment
• GHL receives payment webhook
• Workflow #3 fires:
  - Stage → "Deposit Paid"
  - SMS: "Deposit confirmed! Pick your date: [booking form link]"
  - Email: confirmation + booking form link
  - Slack notification to #deposits

Follow-up sequence in Workflow #2 automatically stops (stage conditions no longer met).

**R13 C4**: Stripe (payment processing)
GHL Workflow #3 ("Deposit Confirmed")
GHL → Slack

✅ BUILT: This file, Sheet 03 SMS #7 + Sheet 07 Step 9

**R14 C2**: 9. BOOKING
(customer action)

**R14 C3**: Customer clicks booking form link:
• GHL Form (single page — not Survey):
  - Full street address (Google Places)
  - Preferred date + time
  - Access notes
  - Apartment details (conditional)
  - Special requests

• Submit → team receives notification
• Team dispatches via ServiceM8

**R14 C4**: GHL Form ("Booking Form")
ServiceM8 (dispatch + scheduling)

✅ BUILT: Quote Form Spec, Sheet 10 (Booking Form)
📋 STILL TO BUILD: ServiceM8 setup + integration

**R15 C2**: 10. JOB DISPATCH
(team action)

**R15 C3**: Dispatcher in your team:
• Creates job in ServiceM8 from GHL data
• Assigns subcontractor
• Sub receives job on ServiceM8 Lite app:
  - Schedule, address, photos, job details
  - GPS navigation to site
• Sub texts customer "On my way" (30 min before)
• Stage in GHL → "Booked"

**R15 C4**: ServiceM8 (job management)
ServiceM8 Lite app (sub's phone)
GHL pipeline (stage update)

📋 STILL TO BUILD:
• ServiceM8 setup
• Sub contractor agreement
• Job brief template

**R16 C2**: 11. JOB COMPLETE
+ FINAL PAYMENT

**R16 C3**: Sub completes work:
• Before/after photos taken (stored in ServiceM8)
• Job marked complete in ServiceM8
• Final invoice sent: remaining 90% balance
• Customer pays via Stripe/transfer/cash
• Stage in GHL → "Completed" → "Paid"

Payment: Sub gets paid their flat rate via Xero batch payment.

**R16 C4**: ServiceM8 → Xero (invoicing)
Stripe (final payment)
GHL pipeline (stage update)

📋 STILL TO BUILD:
• Final invoice template
• Sub payment process

**R17 C2**: 12. REVIEW REQUEST
(automated)

**R17 C3**: 2 hours after job marked complete:
• SMS: "How'd we go? Reply 1-10"
• 9-10 → auto-send Google review link
• 7-8 → no action (satisfied but not promoter)
• 1-6 → internal alert for callback

Google reviews feed back into social proof for future quote pages.

**R17 C4**: GHL Workflow (NPS + review request)
Google Business Profile

✅ SPEC'D: Quote Form Spec, automation timeline
📋 STILL TO BUILD: Review request workflow

**R20 C2**: SYSTEM STACK SUMMARY

**R21 C2**: System

**R21 C3**: Purpose

**R21 C4**: Status

**R22 C2**: GoHighLevel (GHL)

**R22 C3**: CRM, forms, pipeline, SMS, email, proposals, workflows, landing pages

**R22 C4**: ✅ Core — everything routes through here

**R23 C2**: Stripe

**R23 C3**: Payment processing — deposits + final payments

**R23 C4**: ✅ Connects via GHL Payments integration

**R24 C2**: ServiceM8

**R24 C3**: Job dispatch, scheduling, sub management, job cards

**R24 C4**: 📋 TO BUILD — connects via Zapier or manual

**R25 C2**: Xero

**R25 C3**: Invoicing, sub payments, GST BAS, bookkeeping

**R25 C4**: 📋 TO BUILD — connects via ServiceM8 integration

**R26 C2**: Slack

**R26 C3**: Internal notifications (#new-quote, #deposits, #jobs)

**R26 C4**: ✅ Connects via GHL webhook in workflows

**R27 C2**: Google Business

**R27 C3**: Reviews, Maps listing, local SEO

**R27 C4**: 📋 TO BUILD — review request workflow

**R28 C2**: Google Ads

**R28 C3**: Paid search — drives traffic to landing pages

**R28 C4**: 📋 TO BUILD — campaign structure

**R29 C2**: Zapier (optional)

**R29 C3**: Glue between systems. Photo auto-attach, ServiceM8 sync

**R29 C4**: 📋 PHASE 2 — automates manual steps

**R31 C2**: ADDITIONAL WORKFLOWS NEEDED (from Sheet 13):

**R32 C2**: Workflow #5

**R32 C3**: "Job Lifecycle"

**R32 C4**: Trigger: Stage → Booked. Sends: booking confirmed, day-before reminder. Trigger: Stage → Completed. Sends: balance due SMS, NPS (2hrs later), review request (if 9-10), referral (7 days later).

**R33 C2**: Workflow #6

**R33 C3**: "Payment Reminder"

**R33 C4**: Trigger: 48hrs after Stage → Completed, IF stage ≠ Paid. Sends: gentle balance reminder SMS.

**R34 C2**: Workflow #7

**R34 C3**: "PM/Builder Nurture"

**R34 C4**: Trigger: Job complete + customer_type = PM or builder. Sends: post-job SMS (1 day later). PM also enters 90-day email loop.

**R35 C2**: Workflow #8

**R35 C3**: "Win-Back"

**R35 C4**: Trigger: 30 days after Stage → Lost. Sends: 30-day SMS. Then 90-day email. Then stops.

