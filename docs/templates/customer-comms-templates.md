# Templates: Customer Communications — Full Lifecycle

**Source:** Migrated from `data/archive/old-drafts-2026-04/extracted-quote-output-templates/` (sheets 03 SMS, 04 Email, 13 post-deposit, 14 edge cases) — original Excel `quote-output-templates-final.xlsx`.
**Audited via:** [auditor-customer-fairness.md](../roles/auditor-customer-fairness.md) + [auditor-compliance-aus.md](../roles/auditor-compliance-aus.md) (Spam Act 2003 + Privacy Act 1988 + ACL s18 misleading conduct)
**Companion to:** [docs/specs/ghl-pipeline-13-stage.md](../specs/ghl-pipeline-13-stage.md) (workflows that fire these templates), [customer-aftercare-cards.md](customer-aftercare-cards.md)

---

## ⚠️ Read first

These templates are **drafts derived from old Excel + Jordan-style psychology research**. Before going live in GHL:

1. **Brand-voice audit** — replace `[Business Name]` with "Timeless Resurfacing" (or "Timeless" for short-form). Read each template aloud — does it sound like Allan/Marko's actual tone?
2. **Compliance audit** — every COMMERCIAL SMS includes "Reply STOP to opt out". Every email includes Unsubscribe link. Sender identity clear in every message.
3. **Custom field audit** — every `{{custom.X}}` placeholder must exist in GHL custom fields (per [ghl-pipeline-13-stage.md § Custom fields required](../specs/ghl-pipeline-13-stage.md))
4. **Variable consistency** — use `{{contact.first_name}}`, `{{opportunity.monetary_value}}`, `{{custom.deposit_amount}}` etc consistently across all templates

### Spam Act 2003 classification

Per ACMA guidance:

| Type | Examples | STOP required? |
|---|---|---|
| **TRANSACTIONAL** (no STOP) | Instant Acknowledgement, Quote Delivery, Booking Confirmation, On-the-Way, Job Complete, Payment Reminder, NPS Request, Day-Before Reminder | NO |
| **COMMERCIAL** (STOP required) | Quote Follow-Up Nudges (24h, 48h), Expired Quote, Referral Offer, Win-Back, PM/Builder Repeat Nurture, Landlord Standards | YES |

**Consent basis:** Customer's quote request = inferred consent for quote-related transactional follow-ups. Marketing-tagged comms (referral, win-back, nurture) require explicit consent + STOP.

---

## Section 1: Pre-quote phase

### 1A. Instant Acknowledgement (Stage 1, second 0)
**Type:** Transactional | **Workflow:** W1

```
Thanks {{contact.first_name}}! We've got your bathroom photos and we're reviewing them now. You'll have your quote within 2 hours. 📱

— Timeless Resurfacing
```

**Psychology:** Speed sets expectation + proves responsiveness. Commitment validates form effort immediately. (Industry data: 78% of leads choose first responder.)

---

### 1B. Photo Resend (manual — when photos are blurry/too dark/wrong angle)
**Type:** Transactional | **Source:** Manual SMS Snippet
**When:** Team reviews photos in Stage 2 Q&A and can't determine size or condition.

```
Hi {{contact.first_name}}, thanks for your bathroom photos!

We need a slightly better shot to give you an accurate quote. Could you resend:

📸 [specific photo needed — e.g. "a wider shot of the full shower from the doorway"]

Tip: Stand back, daylight on, flash off. 👍

— Timeless Resurfacing
```

**Important:** be specific. Don't say "better photos please." Say exactly which angle/which area. Customising costs ~30 seconds; saves the lead.

---

### 1C. Quote Delayed (manual — when team can't deliver within 2hr SLA)
**Type:** Transactional | **Source:** Manual SMS Snippet
**⚠️ CRITICAL:** Send BEFORE the 2hr expires, not after. Promise broken without comms = trust collapse.

```
Hi {{contact.first_name}}, just a heads up — we're working through a few quotes ahead of yours and need a bit more time.

You'll have your quote by [time/today/tomorrow morning]. Sorry for the wait!

— Timeless Resurfacing
```

---

## Section 2: Quote delivery + follow-up

### 2A. Quote Delivery SMS (0-2hr after submit, paired with Quote Email)
**Type:** Transactional | **Workflow:** W5 (after Stage 4 Quote Accepted) — wait, this fires earlier. Actually fires when Stage 3 (Quote Sent) entered.

```
Hi {{contact.first_name}}, your quote is ready 🎉

{{custom.service_summary}}
Your price: ${{opportunity.monetary_value}} inc GST

That's a fraction of the cost of a full reno. Lock in your date with a small ${{custom.deposit_amount}} deposit — pay the rest after the job's done:

{{documents.proposal_link}}
```

**Psychology:**
- ANCHORING: "fraction of the cost of a full reno" anchors against $15K-$30K full reno
- PAIN OF PAYING: Deposit is "small" + balance is "after the job's done"
- LOSS AVERSION: "Lock in your date" = they lose availability if they wait

---

### 2B. Quote Delivery Email (paired with 2A SMS)
**Type:** Transactional | **Workflow:** W5

**Subject:** `{{contact.first_name}}, your bathroom quote is ready — ${{opportunity.monetary_value}}`

**Preview text:** `View your fixed-price quote and lock in your date today`

**From:** `Timeless Resurfacing <hello@timelessresurfacing.com.au>`

**Body structure:**

```
[HEADER — above the fold]
Logo (left) + "Your Bathroom Quote" (centre)
Subline: "Fixed price. No surprises. Valid 7 days."

[THEIR PHOTO]
Display Photo 1 from their submission.
Caption: "Here's what you showed us 👇"

[QUOTE SUMMARY BOX — highlighted]
Service: {{custom.service_summary}}
Area: {{custom.area_selected}}
Location: {{custom.suburb}}

YOUR PRICE: ${{opportunity.monetary_value}} inc GST

[ VIEW FULL QUOTE & LOCK IN YOUR DATE → ]

[COST ANCHOR]
"A full bathroom renovation typically costs $15,000–$30,000.
Yours is done for a fraction of that — in just one day."

[3 BULLETS — what's included]
✅ All labour + professional-grade materials
✅ Ready to use within 24-48 hours
✅ Written guarantee on all work

[HOW IT WORKS — 3 steps]
1️⃣ Pay a small 10% deposit (${{custom.deposit_amount}})
2️⃣ Pick your preferred date
3️⃣ We do the work — you pay the rest after

[CTA BUTTON #2 — repeated above footer]
[ LOCK IN YOUR DATE — ${{custom.deposit_amount}} DEPOSIT → ]

[FOOTER]
"Questions? Just reply to this email or text us on [phone]"

Timeless Resurfacing | ABN [XXX XXX XXX] | [phone]
"This quote is valid for 7 days from today"
Your rights under Australian Consumer Law are not affected.
Unsubscribe | Privacy Policy
```

**Psychology layered through:**
- ENDOWMENT EFFECT: their actual photo = ownership of the process
- ANCHORING: $15-30K reno cost makes our price feel small
- PROCESSING FLUENCY: 3 bullets, 3 steps, 1 button per CTA section
- COMMITMENT LADDER: tiny deposit = small commitment, then the action
- CERTAINTY: "Fixed price, no surprises" + "Written guarantee" = risk reversal
- COMPLIANCE: ABN visible + ACL rights reference + Unsubscribe = Spam Act + ACCC

---

### 2C. Nudge #1 — 24h, no deposit
**Type:** Commercial (STOP required) | **Workflow:** W3

```
Hey {{contact.first_name}} — just checking you saw your bathroom quote (${{opportunity.monetary_value}})?

Here's the link again: {{documents.proposal_link}}

The deposit's only ${{custom.deposit_amount}} to lock in your date. The rest is after the job. Reply if you've got any Qs! 👍

Timeless Resurfacing | Reply STOP to opt out
```

**Psychology:** Soft, not pushy. "Just checking" + repeats "only $X" + "rest is after."

---

### 2D. Nudge #2 — 48h, no deposit
**Type:** Commercial (STOP required) | **Workflow:** (extension of W3)

```
Hi {{contact.first_name}}, quick heads up — your ${{opportunity.monetary_value}} bathroom quote expires in 5 days.

Every week grout crumbles a bit more and mould spreads a bit further. The good news: we can have it sorted in a day.

${{custom.deposit_amount}} deposit locks your spot: {{documents.proposal_link}}

Timeless Resurfacing | Reply STOP to opt out
```

**Psychology:**
- LOSS AVERSION: deterioration frame
- URGENCY: "Expires in 5 days" is REAL (per quote validity) — not fabricated
- GAIN FRAME: "Sorted in a day"

---

### 2E. 72hr Email-only (no SMS — avoid fatigue)
**Type:** Commercial (Unsubscribe required) | **Workflow:** W4 (email variant)

**Subject:** `{{contact.first_name}}, your bathroom quote expires soon — here's what we did in {{custom.suburb}} last week`

**Preview text:** `Before and after: the same service you're quoted for`

**Body structure:**

```
[BEFORE/AFTER PHOTO PAIR — hero]
Side-by-side before/after of a SIMILAR completed job.
Caption: "Here's a {{custom.area_selected}} we did in [nearby suburb] last week"

[SHORT BODY — 3-4 sentences max]
Hi {{contact.first_name}},

Just a reminder — your bathroom quote (${{opportunity.monetary_value}}) expires in a few days.

We know it's easy to put off, but the longer grout stays cracked, the more moisture gets in. The fix takes less than a day.

[CTA: VIEW YOUR QUOTE & LOCK IN YOUR DATE →]

[TESTIMONIAL — 1 quote, suburb-matched]
"Couldn't believe the difference — looks brand new. The tech was on time, clean, and the price was exactly what was quoted."
— [First name], [Suburb] ⭐⭐⭐⭐⭐

[FOOTER]
Unsubscribe | Privacy Policy
```

**Why email at 72h not SMS:** SMS fatigue — research shows >3 SMS in rapid succession triggers opt-outs. Email at 72h gives different channel + richer content (photos, testimonial). [auditor-customer-fairness](../roles/auditor-customer-fairness.md) lens approved.

**⚠️ Testimonial sourcing:** must be REAL. Per [CEO § Sketchy tactics killing list](../CEO.md#sketchy-tactics--im-killing-them-added-2026-05-01-pm) — no fabricated reviews. Use real customer testimonial from `data/customer-history/` once we have completed jobs.

---

### 2F. Expired SMS — 7 days, no deposit
**Type:** Commercial (STOP required) | **Workflow:** (after W4 + 4 days no movement)

```
Hi {{contact.first_name}}, your bathroom quote has expired — no stress at all.

If things change, just reply "QUOTE" and we'll send a fresh one. 👋

Timeless Resurfacing | Reply STOP to opt out
```

**Psychology:** No guilt. No pressure. Door stays open. "Reply QUOTE" = zero-effort re-engagement. Some customers come back weeks/months later.

---

### 2G. Rejection (when team can't take the job)
**Type:** Transactional | **Source:** Manual stage move
**When:** Pre-1990 asbestos suspect, scope outside our service, $10K+ full reno, customer in unworkable state.

```
Hi {{contact.first_name}}, thanks for sending through your bathroom photos.

After reviewing them, this one needs a different approach — we'd recommend a licensed bathroom renovator for a full assessment.

Sorry we couldn't help this time. If you need anything else down the track, we're here! 👋

— Timeless Resurfacing
```

**Why this matters (auditor-customer-fairness lens):** Turning away unsuitable work builds long-term credibility. We'd rather lose a job than do bad work.

---

## Section 3: Post-deposit job lifecycle

### 3A. Booking Confirmed (after team confirms date with subcontractor)
**Type:** Transactional | **Workflow:** Manual after Stage 10 (Job Booked)

```
Hi {{contact.first_name}}, you're booked in! ✅

📅 {{custom.job_date}}
⏰ {{custom.job_time}}
📍 {{custom.job_address}}

Our technician will text you 30 minutes before arrival. If anything changes, just reply to this text.

— Timeless Resurfacing
```

**Required custom fields:** `job_date` (Date), `job_time` (Single line text), `job_address` (Single line text). Team fills after confirming with subcontractor.

---

### 3B. Day-Before Reminder (24h before job)
**Type:** Transactional | **Workflow:** W8

```
Hey {{contact.first_name}}, quick reminder — your bathroom service is tomorrow!

📅 {{custom.job_date}} at {{custom.job_time}}

Please make sure the bathroom area is cleared of personal items. Our tech will text you 30 min before they arrive. 👍

— Timeless Resurfacing
```

**Why:** SMS reminders reduce no-shows by 30-50% across service industries. Pre-clearing instructions speed the job.

---

### 3C. On-My-Way (30min before subcontractor arrival)
**Type:** Transactional | **Source:** Subcontractor sends from SM8 OR team sends from GHL conversation

```
Hi {{contact.first_name}}, your technician is on the way — arriving in about 30 minutes! 🚗

— Timeless Resurfacing
```

**This is the single most impactful "wow" moment in the customer experience.** Trust-builder. Most tradies don't do it.

---

### 3D. Job Complete + Balance Due (subcontractor marks complete in SM8)
**Type:** Transactional | **Workflow:** Stage 11 → Stage 12 transition

```
All done, {{contact.first_name}}! Your bathroom's looking fresh ✨

Here's your invoice for the remaining balance:
${{custom.balance_amount}} — {{custom.invoice_link}}

Pay online, by phone ([phone]), or bank transfer (BSB [XX] ACC [XX] Ref: {{document.number}}).

Thanks for choosing Timeless Resurfacing! 🙏
```

**Send within 30min of completion** — while the "wow" is still fresh.

**Psychology:** ENDOWMENT ("your bathroom's looking fresh"), multiple payment options reduce friction, "Thanks for choosing" sets up referral/repeat.

**Required custom field:** `invoice_link` (Stripe payment link or SM8 invoice URL)

---

### 3E. Payment Reminder (48h, balance unpaid)
**Type:** Transactional (payment reminder for completed service = not marketing)
**Workflow:** Stage 12 ageing rule (7d/14d/30d cascade per [ghl-pipeline-13-stage.md § Stage 12](../specs/ghl-pipeline-13-stage.md))

```
Hi {{contact.first_name}}, just a gentle reminder — your bathroom service balance of ${{custom.balance_amount}} is outstanding.

Pay here: {{custom.invoice_link}}

Any questions, just reply. 👍

— Timeless Resurfacing
```

Most customers forget, not avoid. One reminder collects 80%+ of outstanding balances.

**Per [sub-sopa-protections § "When SOPA helps US"](../sop/sub-sopa-protections.md):** if unpaid >30 days → formal demand letter; >45 days → SOPA payment claim (faster + cheaper than small claims for $1K-3.5K bathroom jobs).

---

## Section 4: NPS → Google review → referral (the growth engine)

### 4A. NPS Request (2hr after Stage 11 Job Complete)
**Type:** Transactional | **Workflow:** W10

```
Hi {{contact.first_name}}, quick question — how'd we go today?

Reply with a number from 1-10 (10 = amazing). 📊

— Timeless Resurfacing
```

**Why 2hr:** "wow" still fresh + customer has had time to use the bathroom.
**Why NPS first (not direct review request):** Filters promoters (9-10) from detractors (1-6). Only happy customers get review request. Detractors get callback instead of 1-star review.

### NPS Score Routing

- **9-10 (Promoter)** → tag `nps_promoter` → fire 4B Google Review Request → 7 days later fire 4D Referral
- **7-8 (Passive)** → tag `nps_passive` → no review request, no referral
- **1-6 (Detractor)** → tag `nps_detractor` → 4C Internal Slack alert → Allan callback within 60min

---

### 4B. Google Review Request (NPS 9-10, fires immediately on promoter tag)
**Type:** Commercial (STOP required) | **Workflow:** W10 routing

```
That's awesome, thanks {{contact.first_name}}! 🎉

Would you mind leaving us a quick Google review? It really helps other homeowners find us.

Tap here: {{custom.google_review_link}}

(Takes 30 seconds — just a star rating and a sentence is perfect!) ⭐

— Timeless Resurfacing | Reply STOP to opt out
```

**Psychology:**
- RECIPROCITY: They just rated 9-10. Consistency bias = they want to act in line with that.
- FRICTION: "30 seconds" + "just a star rating and a sentence" = feels tiny.
- SOCIAL PROOF FLYWHEEL: Reviews → quote pages → higher conversion → more jobs → more reviews.

**Required custom field:** `google_review_link` — get from Google Business profile → "Write a review" → copy URL.

---

### 4C. Detractor Internal Alert (NPS 1-6 — INTERNAL ONLY, never customer-facing)
**Type:** Slack alert + GHL task

```
🚨 Low NPS alert
Contact: {{contact.first_name}} {{contact.last_name}}
Phone: {{contact.phone}}
Job: {{custom.service_summary}}
NPS score: [their reply]

Action: Call within 60 minutes. Listen. Fix if possible. Offer subcontractor return at no cost.
```

**Service Recovery Paradox:** A 1-6 customer who gets a personal callback often becomes a 9-10 after resolution. Without callback, they go straight to Google with 1-star.

**DO NOT auto-send any customer-facing SMS for low scores.** Allan/Marko handle by phone.

---

### 4D. Referral Request (7 days after Stage 11, IF NPS ≥7)
**Type:** Commercial (STOP required) | **Workflow:** W11

```
Hey {{contact.first_name}}, hope you're still loving the bathroom! 🛁

Know anyone who needs their bathroom freshened up? If they mention your name when they book, we'll send you a $50 gift card as a thank you. 🎁

Just have them text us on [phone] or go to [website]. Cheers!

— Timeless Resurfacing | Reply STOP to opt out
```

**Why 7 days:** They've shown the bathroom to friends/family ("look what we got done!").
**Why $50:** cheap acquisition vs $100-300 ad spend per lead. Word-of-mouth converts 3-5x higher than paid.

**Tracking:** customer mentions name → tag referred contact `referred_by_[firstname-suburb]`.

---

## Section 5: PM / Builder repeat-lead nurture (25-30% of revenue)

### 5A. PM Post-First-Job (day after Stage 11)
**Type:** Commercial (STOP required) | **Trigger:** `customer_type=property_mgr` + Stage 11 + 1-day wait

```
Hi {{contact.first_name}}, thanks for trying us on that {{custom.suburb}} bathroom — hope the tenant's happy!

Just so you know: we handle any number of properties. Send us photos of the next one anytime and we'll have a quote back within 2 hours. 📱

We also do annual maintenance packages if you've got a portfolio. Happy to chat anytime.

— Timeless Resurfacing | Reply STOP to opt out
```

**This one SMS can turn a $1,200 job into $12,000/year** (PM with 5-50 properties).

---

### 5B. PM Quarterly Check-In (every 90 days, email)
**Type:** Commercial (Unsubscribe required) | **Trigger:** tag `pm_lead` + Stage 11 + 90-day cycle

**Subject:** `Quick check-in — any bathrooms needing attention, {{contact.first_name}}?`

**Body:**

```
Hi {{contact.first_name}},

Just touching base — if any of your properties need bathroom maintenance (regrouting, resurfacing, mould treatment), we're here.

Remember: photos + 2-hour quote turnaround. No site visits needed.

[CTA: SEND US PHOTOS →]

Cheers,
[Your name]
Timeless Resurfacing

Unsubscribe
```

**Why email not SMS quarterly:** SMS quarterly feels random. Email is professional touchpoint. Mere-exposure effect keeps us top of mind.

**Trigger condition:** remove from sequence if customer submits a new quote form (they're active — don't need nurture).

---

### 5C. Builder Post-First-Job (day after Stage 11, builder customers)
**Type:** Commercial (STOP required) | **Trigger:** `customer_type=builder` + Stage 11 + 1-day wait

```
Thanks {{contact.first_name}} — that defect rectification in {{custom.suburb}} is done and dusted.

We're set up for ongoing builder work: batch pricing available for 3+ bathrooms, and we can turn most jobs around within the week.

Save this number — send photos anytime for a 2-hour quote. 📱

— Timeless Resurfacing | Reply STOP to opt out
```

**Trade language:** "defect rectification" speaks builders' language. "Batch pricing" signals volume discount.

---

### 5D. Self-Managing Landlord Standards Reminder (one-off, 30 days post-Stage 11)
**Type:** Commercial (Unsubscribe required) | **Trigger:** `customer_type=owner` + tag contains "landlord" + 30-day wait

**Subject:** `NSW rental standards reminder — is your bathroom compliant, {{contact.first_name}}?`

**Body:**

```
Hi {{contact.first_name}},

Since May 2025, NSW rental properties must meet minimum standards including functional, clean bathrooms in reasonable repair.

We fixed one of your bathrooms previously — if your other properties need attention, send us photos for a free 2-hour quote.

[CTA: CHECK MY OTHER PROPERTIES →]

No site visits needed. Just photos from your phone.

— Timeless Resurfacing

Unsubscribe
```

**⚠️ Compliance reality check:** NSW rental minimum standards (May 2025) ARE a real legal obligation, not manufactured urgency. Verify current applicability before sending — landlord standards may have updated since 2025.

**One-off only.** Not a sequence — single nudge 30 days after first job. Send only to customers who indicated they own rental properties.

---

## Section 6: Expired-lead win-back (free money)

Leads who didn't convert aren't dead. 15-20% convert within 6 months when nurtured. $0 in fresh ad spend.

### 6A. 30-day win-back SMS
**Type:** Commercial (STOP required) | **Trigger:** 30 days after Stage 3 → Lost (auto-cancel) status

```
Hey {{contact.first_name}}, it's Timeless Resurfacing. We quoted your bathroom a month ago.

Still thinking about it? Your price may have changed — reply "QUOTE" for a fresh one. No obligation. 📱

Reply STOP to opt out
```

If they reply "QUOTE": team reviews photos still on file → sends fresh quote → moves back to Stage 1.

---

### 6B. 90-day win-back email (final automated touchpoint)
**Type:** Commercial (Unsubscribe required) | **Trigger:** 90 days after Lost stage

**Subject:** `{{contact.first_name}}, your bathroom hasn't fixed itself yet 😉`

**Body:**

```
Hi {{contact.first_name}},

We quoted your {{custom.area_selected}} work back in [month]. If it's still on your list, we're still here.

Same deal: send us photos, get a quote within 2 hours, no obligation.

[CTA: GET A FRESH QUOTE →]

Cheers,
Timeless Resurfacing

Unsubscribe
```

After this, lead stays in DB for manual seasonal campaigns (handled by [maintenance-reminder.md](../specs/ai-employees/maintenance-reminder.md) AI agent eventually).

---

## Section 7: Edge case templates (manual SMS Snippets)

### 7A. Customer Asks a Question (no template — REPLY PERSONALLY)

Guidance for team:
- Reply within 15 minutes during business hours
- Use their first name
- Answer the specific question directly
- Don't paste a corporate response — personal conversation builds trust

### 7B. Customer Wants to Change Scope

```
Hi {{contact.first_name}}, no problem — we can adjust the quote for that.

Could you send me:
1. A photo of the [extra area/different scope]
2. What you'd like done with it

I'll come back with a revised quote within 2 hours. 👍

— Timeless Resurfacing
```

### 7C. Customer Pushes Back on Price

```
Hi {{contact.first_name}}, totally understand — happy to walk you through what's included.

Our $${{opportunity.monetary_value}} covers:
✅ All labour + professional-grade materials (Hawk Glass-Tech / cement grout)
✅ Up to [X-year] guarantee
✅ Insurance + ABN (no risk to you)
✅ Aftercare card + cure-time guidance

Anything specific I can clarify? Or did you want to talk on the phone — happy to call.

— Timeless Resurfacing
```

**Don't discount on first ask.** Per [CEO § Pricing, discount, and refund policy](../CEO.md#pricing-discount-and-refund-policy-added-2026-05-01-pm) — value justification first; discount is last resort, not first resort.

### 7D. Subcontractor Cancels Day-Of (customer comms)

```
Hi {{contact.first_name}}, quick update — we need to reschedule your bathroom service today. We're really sorry about the short notice.

Earliest reschedule we can offer: [next available]. Free to chat through options on [phone].

As a thank-you for the inconvenience, we'll [free silicone reseal at 6mo / $50 off / etc — small goodwill].

— Timeless Resurfacing
```

**Per [sub-risk-scenarios-playbook § Scenario 2](../sop/sub-risk-scenarios-playbook.md):** never blame the subcontractor publicly. Always say "we" — protects relationship + brand.

---

## Section 8: Compliance audit checklist (run before EVERY new template)

Per [auditor-compliance-aus.md](../roles/auditor-compliance-aus.md):

- [ ] Sender clearly identified ("Timeless Resurfacing" or similar)
- [ ] If COMMERCIAL → "Reply STOP to opt out" present (SMS) or Unsubscribe link (email)
- [ ] No misleading claims (don't promise what we can't deliver — ACL s18)
- [ ] No over-claiming on warranty ("up to 5-year" not "5-year guaranteed")
- [ ] ABN visible in email footers (legitimacy + ACCC requirement)
- [ ] ACL rights reference in email ("Your rights under Australian Consumer Law are not affected")
- [ ] Privacy Policy + Unsubscribe link in email footers
- [ ] Customer name personalisation works (template renders correctly with empty `{{contact.first_name}}`)
- [ ] All `{{custom.X}}` placeholders exist in GHL custom fields
- [ ] No fabricated reviews / testimonials (real or none — per CEO sketchy tactics killing list)

---

## Section 9: Total message count — full customer lifecycle

| Phase | Messages | Type | Touchpoints |
|---|---|---|---|
| Pre-quote | Instant ack SMS | Transactional | 1 |
| Quote delivery | Quote SMS + Quote Email | Transactional | 2 (simultaneous) |
| Follow-up | 24h + 48h SMS + 72h Email + Expired SMS | 3 Commercial + 1 Trans | 4 |
| Post-deposit | Booking confirm + Day-before + On-my-way | Transactional | 3 |
| Job complete | Balance due + Payment reminder | Transactional | 2 |
| Review engine | NPS + Google review + Referral | 2 Trans + 1 Comm | 3 |
| Repeat nurture | PM post-job + PM quarterly + Builder + Landlord | 4 Commercial | 4 (PM/builder only) |
| Win-back | 30-day SMS + 90-day Email | 2 Commercial | 2 (expired only) |

**Total: 21 templates covering complete lifecycle.**
- Homeowner sees ~12 touchpoints
- PM/builder sees ~16
- Every touchpoint has a specific job

---

## Required new custom fields (add to [ghl-pipeline-13-stage.md § Custom fields required](../specs/ghl-pipeline-13-stage.md))

| Field name | Type | Source |
|---|---|---|
| `job_date` | Date | Team sets after confirming with subcontractor |
| `job_time` | Single Line Text | Team sets — e.g. "2:00 PM" |
| `job_address` | Single Line Text | From booking form (full street address) |
| `invoice_link` | Single Line Text | Stripe/SM8 invoice URL |
| `google_review_link` | Single Line Text | Our Google Business review URL (constant) |
| `balance_amount` | Currency | calculated = `quote_amount_final` - `deposit_amount` |
| `service_summary` | Single Line Text | populated from form-to-SKU map |

Add these to [OPERATING-CONTEXT § 8.2](../OPERATING-CONTEXT.md) custom field list.

---

## Build sequence (in order)

When implementing in GHL post-Phase 1:

1. Add 7 new custom fields per Section 9 above
2. Build SMS templates as **GHL SMS Snippets** (for manual use) AND in workflows
3. Build email templates in GHL Email Builder using the structure
4. Build NPS routing as auto-respond rules
5. Build edge-case templates as **GHL SMS Snippets** library (manual send by team)
6. Audit each template per Section 8 compliance checklist BEFORE going live
7. Test each by sending to Allan's own number first

---

## Cross-references

- [docs/specs/ghl-pipeline-13-stage.md](../specs/ghl-pipeline-13-stage.md) — workflows that fire these templates
- [customer-aftercare-cards.md](customer-aftercare-cards.md) — physical cards left after job (companion to "Job Complete" SMS)
- [recruitment-ads.md](recruitment-ads.md) — sub-side templates
- [sub-risk-scenarios-playbook.md](../sop/sub-risk-scenarios-playbook.md) — operational SOPs that some templates support (no-show, scope mismatch, customer cancellation)
- [auditor-customer-fairness.md](../roles/auditor-customer-fairness.md) — customer-fairness lens
- [auditor-compliance-aus.md](../roles/auditor-compliance-aus.md) — Spam Act + ACCC + ACL lens
- [CEO § KPI definitions + funnel benchmarks](../CEO.md#kpi-definitions--funnel-benchmarks-added-2026-05-01-pm-after-jordan-transcripts-mining) — target close rate (28%+) these templates aim to hit
- [maintenance-reminder.md](../specs/ai-employees/maintenance-reminder.md) — long-term nudge agent (post 90-day win-back)

---

## Future enhancements

- **A/B test variants** — every template should have 2-3 variants tested for open/reply rate (GHL supports this natively)
- **Multi-language** — Mandarin / Cantonese / Arabic variants for Sydney's diverse market (Phase 7+)
- **AI personalisation** — Claude API drafts customer-specific subject lines based on photo content + suburb + service (pre-build approval flow)
- **Sentiment-aware follow-up** — read customer reply tone, adjust next nudge intensity
- **Integration with [maintenance-reminder.md](../specs/ai-employees/maintenance-reminder.md)** — long-term seasonal nudges layer on top of these short-term lifecycle templates
