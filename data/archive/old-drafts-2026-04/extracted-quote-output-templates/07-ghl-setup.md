# 07 GHL SETUP

*Extracted from quote-output-templates-final.xlsx 2026-05-01 PM*

Sheet dimensions: 13 rows × 4 cols

---

**R2 C2**: GHL BUILD GUIDE — QUOTE DELIVERY SYSTEM

**R4 C2**: 1

**R4 C3**: CONNECT STRIPE

**R4 C4**: Payments → Integrations → Stripe
Use your business Stripe account. This enables the deposit button on proposal pages.

**R5 C2**: 2

**R5 C3**: CREATE GENERIC PRODUCT

**R5 C4**: Payments → Products → + Add
Name: "Bathroom Service"
Price: $0 (you override per quote)
One product, set exact price per proposal. Simpler than 20 products.

**R6 C2**: 3

**R6 C3**: CREATE CUSTOM FIELDS (5)

**R6 C4**: Settings → Custom Fields → Contact:
• service_summary (Single Line) — "Shower Regrout + Silicone"
• deposit_amount (Single Line) — "166"
• balance_amount (Single Line) — "1,494"
• booking_form_link (Single Line) — your booking form URL
• cost_anchor (Single Line) — "15,000–30,000" (default, rarely changed)

**R7 C2**: 4

**R7 C3**: BUILD PROPOSAL TEMPLATE

**R7 C4**: Payments → Documents & Contracts → Templates → + New
Name: "Bathroom Quote"
Build using content from Sheet 05 (Quote Page).

Key settings:
• Product widget → enable → set 10% deposit via Stripe
• Add expiry date (7 days)
• Mobile-responsive
• Brand colours + logo
• Photo placeholders for customer's photos

**R8 C2**: 5

**R8 C3**: CREATE SMS TEMPLATES (7)

**R8 C4**: Marketing → Templates → SMS:
1. "Quote Acknowledgment" (instant)
2. "Quote Delivery" (with proposal link)
3. "Quote Nudge 24hr"
4. "Quote Nudge 48hr"
5. "Quote Expired"
6. "Deposit Confirmed"
7. "Quote Rejected"

Copy text EXACTLY from Sheet 03. Add "Reply STOP to unsubscribe" to templates 3, 4, 5 (follow-up SMS).

**R9 C2**: 6

**R9 C3**: CREATE EMAIL TEMPLATES (2)

**R9 C4**: Marketing → Emails → Templates:
1. "Quote Delivery Email" — drag-and-drop builder, content from Sheet 04 Email #1
2. "72hr Follow-Up Email" — content from Sheet 04 Email #2

Upload: before/after photos, logo, brand colours.
Test: send to your own email first on mobile.

**R10 C2**: 7

**R10 C3**: BUILD WORKFLOW #1:
Quote Acknowledgment

**R10 C4**: Automation → Workflows → + Create
Name: "Instant Quote Ack"
Trigger: Form Submitted (your quote request form)

Step 1: Send SMS ("Quote Acknowledgment" template)
Step 2: Create Opportunity (stage: "New Quote")
Step 3: Internal notification → Slack #new-quote

**R11 C2**: 8

**R11 C3**: BUILD WORKFLOW #2:
Quote Delivery + Follow-Up

**R11 C4**: Name: "Quote Delivery Sequence"
Trigger: Opportunity Stage Changed → "Quoted"

Step 1: Send SMS ("Quote Delivery")
Step 2: Send Email ("Quote Delivery Email")
Step 3: Wait 24hrs
Step 4: IF stage ≠ "Deposit Paid" → Send SMS ("Nudge 24hr")
Step 5: Wait 24hrs
Step 6: IF stage ≠ "Deposit Paid" → Send SMS ("Nudge 48hr")
Step 7: Wait 24hrs
Step 8: IF stage ≠ "Deposit Paid" → Send Email ("72hr Follow-Up")
Step 9: Wait 4 days
Step 10: IF stage ≠ "Deposit Paid" → Send SMS ("Expired") → Move stage → "Expired"

**R12 C2**: 9

**R12 C3**: BUILD WORKFLOW #3:
Deposit Received

**R12 C4**: Name: "Deposit Confirmed"
Trigger: Payment Received

Step 1: Move stage → "Deposit Paid"
Step 2: Send SMS ("Deposit Confirmed")
Step 3: Send Email (booking form link)
Step 4: Internal notification → Slack #deposits

**R13 C2**: 10

**R13 C3**: DAILY QUOTE PROCESS
(your team's checklist)

**R13 C4**: 1. Open contact in GHL → review photos
2. Determine: service type + size + any upcharges
3. Look up price in Master Pricing spreadsheet
4. Fill custom fields: service_summary, deposit_amount, balance_amount
5. Create new Document from "Bathroom Quote" template
6. Set price in product widget
7. Insert 2-3 of their photos into the proposal
8. Set expiry (7 days)
9. Click Send → customer gets SMS + email
10. Move stage to "Quoted" (triggers follow-up workflow)

⏱️ Time per quote: 3-5 minutes once practised.

