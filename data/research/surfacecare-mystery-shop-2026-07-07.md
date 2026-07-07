# Surface Care mystery shop #2 — FULL quote flow captured (2026-07-07)

Source: Allan's live mystery shops (verbatim SMS/email captures + their Quote Confirmation PDF,
`~/Downloads/Surface_Care_Quote_Confirmation.pdf`). Extends data/research/surfacecare-mystery-shop-2026-06-13.md.
Scenario 1 = stone benchtop restoration (81 Cumberland St Cabramatta) → quoted $3,330 + GST.
Scenario 2 = structural damage (86 Cardigan St) → honest rejection.

## Their funnel, in order (Scenario 1)

1. **Abandoned-form SMS** (James): "We noticed you have not completed your quote request for your
   job at 81 Cumberland St. Please complete the remaining steps here: [GHL survey link with
   email+phone prefilled] You'll be asked for: Photos of the damage / Brief description of what
   needs fixing. Once that's done, we'll get your quote sorted ASAP."
2. **Abandoned reminder #2** (James): "just a quick reminder… We still need a few details to
   complete your quote… Once that's in, we'll get your quote sent over as soon as possible."
3. **Ack SMS**: "Hi Allan, thank you for choosing Surface Care. If your quote at [full address] is
   urgent (to be completed within 7 days), reply 'Urgent' to prioritise your quote. One of our
   team members may call to clarify details regarding your quote."
4. **Ack EMAIL** (Jordan Hunt, Director, m: +61 483 944 570): "We've received your quote request.
   What's Next? We will review your quote request and send you a quote within 1-3 days, depending
   on the complexity… We may also give you a call to clarify details… If you have additional
   photos that would be helpful… please share them with me in this email."
5. **THE QUOTE — EMAIL ONLY, no SMS ping** (Kate Kuizon, Quotations Manager, same office mobile):
   recommendation sentence ("We recommend spot honing and polishing… cost-effective alternative to
   replacement, near-new with improved durability") → "Restoration Process – 4 Simple Steps"
   (Surface Preparation / Grinding & Honing (wet + dust extraction) / Polishing & Repairs /
   Sealing & Final Check) → "Our pricing for restoration to the: 1 x entire natural stone kitchen
   island benchtop. As per the photos you provided, the quoted amount includes labour, materials,
   and travel time. The total cost of the work is $3,330 plus GST." → "To Confirm: click and
   complete the quote confirmation link" → Please-note block (below).
6. **Expiry SMS** (day ~3 of 7): "Just a friendly reminder that your Surface Care quote expires in
   4 days. Would you like us to go ahead with the repair?"

## Their "Please note" conditions (quote email + confirmation PDF)
- Damage Visibility: deeper marks may remain visible depending on depth.
- Quote Validity: 7 days from email sent date.
- Bookings: "Once signed quote confirmation is received, you will receive job confirmation from
  our jobs management system Servicem8 via email. Your assigned technician will then reach out
  directly to you or the designated site contact to organise a date and time for your job."
  → CONFIRMS booking-coordination-plan-2026-07-07: SM8 job confirmation email + tech contacts the
  customer directly (they leak tech↔customer contact by design; we deliberately do not, for subs).
- Job Cancellation: 50% of quoted repair cost after confirmation (⚠️ see legal note).
- Payment: >$1,000 = 50% deposit upfront; deposit received → technician books; balance on
  completion, within 1 business day.

## The Quote Confirmation PDF (their acceptance mechanism)
GHL Document on their white-label domain (links.surfacescare.com.au). Structure: header w/ ABN,
phone, email, website → "Quote Confirmation Form — Please look over the details, sign, and submit
to confirm your quote." → Clients Details table (name / address / state / postcode / phone) →
the full recommendation + 4-step process + price REPEATED → Please-note conditions → certification
paragraph: "By signing this document, I certify that the above information is accurate and
correct. I have read Surface Care Pty Ltd's TERMS AND CONDITIONS OF TRADE (link), and warranty
information (link), which form part of and are intended to be read in conjunction with this Quote
Confirmation Form and agree to be bound by these conditions. I authorise the use of my personal
information as detailed in the Privacy Act Clause." → e-signature block.
Signing a GHL document fires a native workflow trigger → automatic opportunity stage move.

## Scenario 2 — rejection (Shermaine Lo, Quotations Manager)
Same ack SMS + email, then: "Based on our experience, these damages/cracks appear to be structural
and are not repairable to our standards. Your best option would be a replacement. We currently do
not offer replacement services and do not know who the best point of contact would be."
→ Honest (good) but a dead end: no referral, no future hook. Our 2G + referral pathway beats this.

## Verdict — copy / beat / avoid

**COPY (build):**
1. **GHL quote-confirmation document with e-sign** on our white-label link domain; signing →
   workflow trigger → auto-move opportunity to Quote Accepted + Slack + deposit request. Mirrors
   build-plan item 1.3 (quote-acceptance ACL trail); this capture is the concrete template. Fields:
   client details table, scope + price restated, conditions, certification paragraph linking OUR
   /terms/ + /warranty/, signature.
2. Ack additions: "one of our team may call to clarify" + "reply with any extra photos" (email).
3. Urgent-triage line (already adopted as board 1.17).
4. Expiry-countdown SMS with assumptive close ("expires in X days. Would you like us to go ahead
   with the repair?") — ours fires at day 10 of 14.
5. Role-signed comms (they rotate Director/Quotations Manager personas; we sign Allan, Director).

**BEAT (their gaps = our edge):**
- NO SMS ping when the quote sends (their biggest gap) → we send quote by EMAIL + SMS link ping.
- 1-3 day quote promise → ours 24h. 7-day validity → ours 14 + win-back day 15.
- Rejection dead-end → ours includes a referral pathway + future hook.

**AVOID (legal):**
- Blanket "50% of quoted cost" cancellation fee after confirmation: ACL penalty doctrine + unfair
  contract terms regime (illegal since Nov 2023 for standard-form consumer/small-biz contracts,
  with penalties) make a flat 50% pre-work fee a textbook challenge target. Ours should be
  deposit-based and scaled to genuine loss (e.g. deposit refundable until booking confirmed;
  within 48h of job date, reasonable costs retained). Add to the lawyer engagement.

**DECISION FOR ALLAN (pending):** adopt their deposit shape? Recommend: 50% deposit for jobs over
$1,000; flat $200 for under. Balance on completion within 1 business day. (Matches money-lane;
needs Allan yes + Cleo Rule-8 on the wording.)

All proposed customer-facing copy = PENDING Rule-8 (both CEOs verify) before anything is pasted
into GHL.
