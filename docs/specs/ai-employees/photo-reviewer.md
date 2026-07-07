# AI Employee: Photo Reviewer (quote-request triage)

**Job title:** AI Photo Reviewer
**Build status:** Spec ready ✅ (2026-07-07) — deploy when quote volume > ~10/day makes manual review the bottleneck. Until then Allan's eyeball IS this employee (and stays the final gate regardless).
**Lineage:** David List's form→AI-photo-analysis build (diagnosed a pressure-relief valve fault from customer photos, unprompted — transcript L28440) + Jordan's photo-first quoting funnel (260 photo submissions/week).

## Why this employee exists
Every quote starts with customer photos. Today Allan reviews them manually (money-lane M1 / journey stage 2). At volume, a first-pass AI triage turns 10 minutes per lead into 1: it drafts what Allan confirms instead of Allan deriving everything from scratch.

## What it does (per new opportunity with photos)
1. Pull the photo URLs off the GHL opportunity (payload fields `photos_*_urls` — already structured per area by the form).
2. Vision pass per photo → structured output: surface type (bath/tile/vanity/benchtop/basin), material guess (enamel/acrylic/laminate/stone/tile), damage class (chip/crack/wear/mould/regrout candidate), severity (cosmetic/moderate/structural), photo-quality flag (blurry/dark/wrong angle → triggers the 1B photo-resend snippet), and RED FLAGS: possible asbestos-era substrate (pre-1990 field + wall sheeting visible), structural cracks (→ 2G rejection path like Surface Care's Scenario-2), previous failed resurfacing (strip-back line item).
3. Cross-check against the form's own claims (customer said "bath" but photos show a vanity → flag mismatch).
4. Output: a draft quote-app input line ("resurface the bath 1540, chip repair" style — the quote app's parser is the contract) + confidence + flags → posted to Slack #quotes-in as a reply to the lead card.
5. NEVER auto-sends anything to the customer. Allan reviews, adjusts, quotes via the quote app. Confidence < 75% or ANY red flag → the draft says "MANUAL REVIEW" in the first line.

## Audit lenses (Rule 2)
customer-fairness (no imagined damage, no upsell hallucination — every line must be visible in a photo) · compliance-aus (asbestos = stop + escalate, never a DIY note to the customer) · margin-per-job (flag likely-underquoted scope early, e.g. full-wall damage photographed but only bath requested).

## Implementation sketch (when triggered)
Local-first like the rest of the fleet: a `scripts/photo-reviewer/` Python job polling GHL for new opportunities (same client as ceo-brief/watchdog), pulling Cloudinary URLs, running a vision model (Claude API vision at ~$0.01/photo, or a local VLM later), posting to Slack. No customer-facing surface at all — pure internal triage.
