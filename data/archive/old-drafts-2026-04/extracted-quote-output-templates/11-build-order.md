# 11 BUILD ORDER

*Extracted from quote-output-templates-final.xlsx 2026-05-01 PM*

Sheet dimensions: 67 rows × 5 cols

---

**R2 C2**: BUILD ORDER — WHAT TO SET UP AND IN WHAT SEQUENCE

**R3 C2**: Each step depends on the one before it. Don't skip ahead. Estimated total build time: 6-8 hours across 2 days.

**R5 C2**: DAY 1 — CORE INFRASTRUCTURE (3-4 hours)

**R6 C2**: Step

**R6 C3**: Task

**R6 C4**: Details

**R6 C5**: Time

**R7 C2**: 1.1

**R7 C3**: GHL account setup

**R7 C4**: Sign up for GHL ($97/mo Starter plan).
Connect your domain for email sending.
Set up business profile: name, logo, ABN, phone, address.

**R7 C5**: 15 min

**R8 C2**: 1.2

**R8 C3**: Connect Stripe

**R8 C4**: Payments → Integrations → Stripe.
Connect your business Stripe account.
Set up as Australian account (AUD).

**R8 C5**: 10 min

**R9 C2**: 1.3

**R9 C3**: Create all 39 custom fields

**R9 C4**: Settings → Custom Fields → Contact.
Create 34 form fields (from Quote Form Spec, Sheet 11 Phase 1).
Then create 5 quoting fields: service_summary, deposit_amount, balance_amount, booking_form_link, cost_anchor.

**R9 C5**: 30 min

**R10 C2**: 1.4

**R10 C3**: Create pipeline + 11 stages

**R10 C4**: Opportunities → Pipelines → + Create.
Name: "Bathroom Quotes".
Stages: New Quote → Photo Review → Quoted → Follow-Up → Deposit Paid → Booked → In Progress → Completed → Paid → Rejected → Lost.

**R10 C5**: 10 min

**R11 C2**: 1.5

**R11 C3**: Build the quote survey
(4-step form)

**R11 C4**: Sites → Surveys → + Create.
Follow Quote Form Spec Sheet 11, Phases 2-3.
5 slides, 15 conditional logic rules, 8 area paths.

This is the biggest single build task.

**R11 C5**: 90 min

**R12 C2**: 1.6

**R12 C3**: Set up On Submit + tagging

**R12 C4**: Follow Quote Form Spec Sheet 11, Phase 4.
Confirmation message, opportunity creation, notifications.

**R12 C5**: 15 min

**R13 C2**: 1.7

**R13 C3**: Connect Slack

**R13 C4**: Create Slack workspace (free).
Channels: #new-quote, #deposits, #jobs.
In GHL workflow: use Webhook action → Slack incoming webhook URL.

**R13 C5**: 15 min

**R14 C2**: 1.8

**R14 C3**: Test form end-to-end

**R14 C4**: Submit a test entry for each of the 8 area paths.
Verify: contact created, tags applied, opportunity in pipeline, SMS received, Slack notification.

**R14 C5**: 30 min

**R16 C2**: DAY 2 — QUOTE DELIVERY SYSTEM (3-4 hours)

**R17 C2**: Step

**R17 C3**: Task

**R17 C4**: Details

**R17 C5**: Time

**R18 C2**: 2.1

**R18 C3**: Create 7 SMS templates

**R18 C4**: Marketing → Templates → SMS.
Copy text EXACTLY from this file, Sheet 03.
7 templates: Ack, Delivery, Nudge 24hr, Nudge 48hr, Expired, Deposit Confirmed, Rejected.
Add STOP clause to follow-up templates.

**R18 C5**: 20 min

**R19 C2**: 2.2

**R19 C3**: Create 2 email templates

**R19 C4**: Marketing → Emails → Templates.
Use drag-and-drop builder.
Email #1: Quote Delivery (content from Sheet 04).
Email #2: 72hr Follow-Up (content from Sheet 04).
Upload logo, brand colours, before/after photos.

**R19 C5**: 45 min

**R20 C2**: 2.3

**R20 C3**: Build proposal template

**R20 C4**: Payments → Documents & Contracts → Templates → + New.
Name: "Bathroom Quote".
Build page content from Sheet 05.
Enable product widget + 10% Stripe deposit.
Add expiry date, photo placeholders.

⚠️ TEST: Send yourself a test proposal. Open on mobile. Check Stripe button works.

**R20 C5**: 45 min

**R21 C2**: 2.4

**R21 C3**: Build Workflow #1:
Instant Quote Ack

**R21 C4**: Automation → Workflows → + Create.
Trigger: Survey Submitted ("Bathroom Quote Form").
Steps: tag contact → send SMS (Ack template) → create opportunity → Slack webhook.

3 actions — simple workflow.

**R21 C5**: 15 min

**R22 C2**: 2.5

**R22 C3**: Build Workflow #2:
Quote Delivery + Follow-Up

**R22 C4**: Trigger: Opportunity Stage Changed → "Quoted".
10 steps with wait timers + IF conditions:
SMS + Email → Wait 24hr → IF ≠ Paid → SMS → Wait 24hr → IF ≠ Paid → SMS → Wait 24hr → IF ≠ Paid → Email → Wait 4 days → IF ≠ Paid → SMS + move to Lost.

This is the most complex workflow.

**R22 C5**: 30 min

**R23 C2**: 2.6

**R23 C3**: Build Workflow #3:
Deposit Confirmed

**R23 C4**: Trigger: Payment Received.
Steps: move stage → Deposit Paid → SMS (Deposit Confirmed) → Email (confirmation) → Slack notification.

4 actions — simple workflow.

**R23 C5**: 15 min

**R24 C2**: 2.7

**R24 C3**: Build Workflow #4:
Rejection

**R24 C4**: Trigger: Opportunity Stage Changed → "Rejected".
Steps: send SMS (Rejection) → tag "rejected" → internal note.

3 actions — simple workflow.

**R24 C5**: 10 min

**R25 C2**: 2.8

**R25 C3**: Build booking form

**R25 C4**: Sites → Forms → + Create (Form, not Survey — single page).
Fields from Quote Form Spec Sheet 10: full address, preferred date, preferred time, access notes, apartment details.
Set booking_form_link custom field to this form's URL.

**R25 C5**: 20 min

**R26 C2**: 2.9

**R26 C3**: Full end-to-end test

**R26 C4**: Simulate complete customer journey:
1. Submit form (as customer)
2. Receive ack SMS ✓
3. Review photos (as team)
4. Create proposal + set price
5. Move stage to "Quoted"
6. Receive quote SMS + email ✓
7. Click proposal link → check quote page on mobile ✓
8. Pay test deposit via Stripe ✓
9. Receive deposit confirmed SMS + booking link ✓
10. Submit booking form ✓

Then wait 24hrs to verify follow-up sequence fires.

⚠️ Use Stripe TEST mode for deposit testing.

**R26 C5**: 30 min

**R27 C2**: 2.10

**R27 C3**: Go live checklist

**R27 C4**: □ Switch Stripe to LIVE mode
□ Embed quote form on landing page
□ Set booking_form_link to live URL
□ Update [Your Business Name] in all templates
□ Update phone number in all templates
□ Upload real before/after photos to email templates
□ Upload real testimonials with suburb names
□ Set Google Ads tracking pixel on form
□ Test one more time with real phone + email

**R27 C5**: 15 min

**R30 C2**: WHAT'S AUTOMATED vs WHAT'S MANUAL

**R31 C2**: Task

**R31 C3**: Automated or Manual

**R31 C4**: System

**R31 C5**: Notes

**R32 C2**: Form acknowledgment SMS

**R32 C3**: AUTOMATED

**R32 C4**: GHL Workflow #1

**R32 C5**: Fires instantly on submit. Zero human involvement.

**R33 C2**: Slack notification to team

**R33 C3**: AUTOMATED

**R33 C4**: GHL → Slack webhook

**R33 C5**: Team sees photos + data in Slack immediately.

**R34 C2**: Photo review + rejection check

**R34 C3**: MANUAL

**R34 C4**: Team reviews in GHL

**R34 C5**: 1-3 min per lead. Check Photo 2 for rejection criteria.

**R35 C2**: Price lookup

**R35 C3**: MANUAL

**R35 C4**: Master Pricing spreadsheet

**R35 C5**: Team determines service + size + upcharges → finds price.

**R36 C2**: Custom field population

**R36 C3**: MANUAL

**R36 C4**: GHL contact record

**R36 C5**: Team fills: service_summary, deposit_amount, balance_amount.

**R37 C2**: Proposal creation

**R37 C3**: MANUAL

**R37 C4**: GHL Documents & Contracts

**R37 C5**: Team creates from template, sets price, inserts photos. 3-5 min.

**R38 C2**: Quote SMS + email delivery

**R38 C3**: AUTOMATED

**R38 C4**: GHL Workflow #2

**R38 C5**: Fires when team moves stage to "Quoted." Both channels instantly.

**R39 C2**: Follow-up sequence (24/48/72hr)

**R39 C3**: AUTOMATED

**R39 C4**: GHL Workflow #2

**R39 C5**: Runs on autopilot. Stops automatically when deposit is paid.

**R40 C2**: Deposit collection

**R40 C3**: AUTOMATED

**R40 C4**: Stripe via GHL proposal

**R40 C5**: Customer clicks button → Stripe processes → webhook to GHL.

**R41 C2**: Deposit confirmation SMS + email

**R41 C3**: AUTOMATED

**R41 C4**: GHL Workflow #3

**R41 C5**: Fires on payment received. Includes booking form link.

**R42 C2**: Booking form delivery

**R42 C3**: AUTOMATED

**R42 C4**: GHL Workflow #3

**R42 C5**: Link sent in deposit confirmation. Customer self-schedules.

**R43 C2**: Job dispatch to sub

**R43 C3**: MANUAL

**R43 C4**: ServiceM8

**R43 C5**: Dispatcher assigns sub based on location + availability.

**R44 C2**: Sub notification

**R44 C3**: AUTOMATED

**R44 C4**: ServiceM8 Lite app

**R44 C5**: Sub gets job on phone: address, photos, schedule, GPS.

**R45 C2**: Final invoice

**R45 C3**: SEMI-AUTO

**R45 C4**: ServiceM8 → Xero

**R45 C5**: Generated from job data. Manual review before sending.

**R46 C2**: Review request

**R46 C3**: AUTOMATED

**R46 C4**: GHL Workflow

**R46 C5**: SMS 2hrs after job complete. Auto-routes 9-10 to Google review.

**R47 C2**: Quote expired close

**R47 C3**: AUTOMATED

**R47 C4**: GHL Workflow #2

**R47 C5**: Auto-moves to "Lost" at 7 days. No human action needed.

**R48 C2**: Rejection notification

**R48 C3**: AUTOMATED

**R48 C4**: GHL Workflow #4

**R48 C5**: Team moves to "Rejected" → SMS fires automatically.

**R50 C2**: AUTOMATION SCORE: 11 of 17 tasks fully automated. 1 semi-automated. 5 manual (all are judgment tasks that require human review).

**R51 C2**: The 5 manual tasks are the ones that SHOULD be manual — photo review, pricing, proposal creation, job dispatch, and invoice review. These require human judgment and are where your team adds value.

**R53 C2**: DAY 3 — POST-DEPOSIT + GROWTH ENGINE (2-3 hours)

**R54 C2**: Step

**R54 C3**: Task

**R54 C4**: Details

**R54 C5**: Time

**R55 C2**: 3.1

**R55 C3**: Create 5 new custom fields

**R55 C4**: job_date, job_time, job_address, invoice_link, google_review_link.
Settings → Custom Fields → Contact.

**R55 C5**: 10 min

**R56 C2**: 3.2

**R56 C3**: Create post-deposit SMS
templates (5)

**R56 C4**: Booking confirmed, day-before reminder, on my way, balance due, payment reminder.
Copy from Sheet 13 Section 1.

**R56 C5**: 15 min

**R57 C2**: 3.3

**R57 C3**: Create NPS + review
templates (3)

**R57 C4**: NPS request, Google review request, referral request.
Copy from Sheet 13 Section 2.

**R57 C5**: 10 min

**R58 C2**: 3.4

**R58 C3**: Create PM/builder
templates (4)

**R58 C4**: PM post-job SMS, PM quarterly email, builder post-job SMS, landlord standards email.
Copy from Sheet 13 Section 3.

**R58 C5**: 15 min

**R59 C2**: 3.5

**R59 C3**: Create win-back
templates (2)

**R59 C4**: 30-day SMS, 90-day email.
Copy from Sheet 13 Section 4.

**R59 C5**: 10 min

**R60 C2**: 3.6

**R60 C3**: Build Workflow #5:
Job Lifecycle

**R60 C4**: Trigger: Stage → Booked → Completed.
Booking confirmed + day-before + balance due + NPS + review + referral.
Most complex post-deposit workflow.

**R60 C5**: 30 min

**R61 C2**: 3.7

**R61 C3**: Build Workflow #6:
Payment Reminder

**R61 C4**: Simple: 48hrs after Completed, IF ≠ Paid → SMS.

**R61 C5**: 10 min

**R62 C2**: 3.8

**R62 C3**: Build Workflow #7:
PM/Builder Nurture

**R62 C4**: Trigger: Job complete + customer_type = PM/builder.
Post-job SMS + quarterly email loop.

**R62 C5**: 20 min

**R63 C2**: 3.9

**R63 C3**: Build Workflow #8:
Win-Back

**R63 C4**: Trigger: 30 days after Lost stage.
30-day SMS + 90-day email.

**R63 C5**: 15 min

**R64 C2**: 3.10

**R64 C3**: Get Google review link

**R64 C4**: Search your business on Google Maps → "Write a review" → copy URL.
Paste into google_review_link custom field as default.

**R64 C5**: 5 min

**R65 C2**: 3.11

**R65 C3**: Test full lifecycle

**R65 C4**: Simulate: deposit → booking confirmed → day-before → on my way → job complete → balance due → NPS → review → referral.
Then test: PM path, builder path, expired win-back.

**R65 C5**: 30 min

**R67 C2**: TOTAL BUILD TIME: Day 1 (3-4hrs) + Day 2 (3-4hrs) + Day 3 (2-3hrs) = 8-11 hours across 3 days. Complete system live.

