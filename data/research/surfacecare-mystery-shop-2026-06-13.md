# Surface Care mystery shop — PRIMARY SOURCE (Allan, 2026-06-13)

Allan ran two fake quote requests through Jordan's LIVE funnel and captured the real comms.
First direct observation of the competitor system we model on (everything before this was transcripts).
Scenario 3 (capturing their actual QUOTE artifact) still to run — playbook at the bottom.

## Captured sequence — Scenario 1 ("Allan", 81 Cumberland St, partial-then-complete)
1. **Abandoned-form recovery SMS ×2** ("James here from Surface Care… you have not completed your quote
   request… Please complete the remaining steps here: [GHL survey deep-link with email+phone PREFILLED]…
   You'll be asked for: Photos of the damage, Brief description"). Second SMS = "just a quick reminder",
   same link.
2. **Ack SMS** (after completing): "thank you for choosing Surface Care. **If your quote… is urgent (to be
   completed within 7 days), reply 'Urgent' to prioritise your quote.** One of our team members may call to
   clarify details."
3. **Ack EMAIL** from **Jordan Hunt, Director** (personal, founder-voiced): "We will review… send you a
   quote **within 1-3 days, depending on the complexity**. We may also give you a call… If you have
   additional photos… please share them with me in this email."
4. Then NOTHING (fake number — likely their call attempt died; no SMS quote followed).

## Captured sequence — Scenario 2 ("Anthony", 86 Cardigan St, structural-looking damage)
1. Same ack SMS + ack email.
2. **REJECTION EMAIL** from **"Shermaine Lo, Quotations Manager"** (NOT Jordan): "these damages/cracks
   appear to be **structural and are not repairable to our standards. Your best option would be a
   replacement. We currently do not offer replacement services and **do not know who the best point of
   contact would be**."

## What this confirms about their stack
- `links.surfacescare.com.au` = **white-labelled GHL** survey/widget — their form is GHL-native; ours is a
  custom React build (better UX = our moat at the front door).
- Same office mobile (+61 483 944 570) carries **multiple personas**: "James" (recovery SMS), "Jordan Hunt
  Director" (ack email), "Shermaine Lo Quotations Manager" (rejections). Persona layering on one channel —
  the founder's name never delivers bad news.
- They triage REJECTIONS from photos alone (no site visit) — validates our photo-triage rejection criteria.
- Their recovery cadence = TWO reminders with a STATE-RESUMING deep link (email+phone query params).
- They run dual-channel ack (SMS + email) from day one.

## Where WE are already ahead (keep)
- **Quote speed promise: ours "within 24 hours" vs their "1-3 days depending on complexity."** Real
  competitive edge — but it's a promise we must keep honouring (the quote-drafter v0, step 1.16, protects it).
- Our W3 cadence keeps SMSing after ack; their funnel went silent when the phone path failed.
- Custom form UX + desktop→mobile QR handoff vs their stock GHL survey.

## ADOPTED into the pipeline (2026-06-13)
1. **"Reply URGENT" triage** (their best idea — zero-friction urgency capture; our sim had urgency as an
   axis with no capture mechanism) → **step 1.17**.
2. **W2 recovery v2: resume link + a second reminder** (they send two; ours sends one with no link) →
   **step 1.18** (⚖️ cadence decision vs pester-risk).
3. **Rejection done BETTER than theirs:** their dead-end ("don't know who to refer") is the one weak moment
   in their funnel — our rejection snippet (in 1.13) will include a referral pathway (licensed renovator /
   hipages direction). Costs nothing, banks goodwill + reviews from people we never serve.

## OPEN DECISION for Allan (not adopted, flagged)
- **Persona layering:** Decision 7 locks Allan-voiced comms. Jordan shields the founder by routing
  rejections/collections through "Shermaine, Quotations Manager." Question for Allan when collections/
  rejections scale: keep everything Allan-voiced, or add an ops persona for negative-news messages?

## Scenario 3 playbook (to capture their actual QUOTE artifact — the thing we most want)
- Use a REAL receivable number (secondary/burner) so their call/SMS quote can land.
- Photos: clearly REPAIRABLE damage (surface chips, glaze wear, cosmetic grout) — nothing that looks
  structural, so it passes Shermaine's triage.
- Reply **"Urgent"** on one run to see the priority path timing vs the normal path.
- Capture: quote FORMAT (SMS? email? PDF? portal link?), tiering (do they 3-tier?), price presentation,
  deposit ask + %, validity window, payment mechanism, follow-up cadence after quote.
- Compare against our M1/quote artifact and adjust ours where theirs converts better.
