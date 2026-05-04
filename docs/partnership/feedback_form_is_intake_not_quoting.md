---
name: The form is INTAKE, not QUOTING — locked design philosophy
description: Allan's CEO call 2026-05-05. The quote form's job is to CAPTURE enough for the human quoter to make a quote — NOT to disambiguate every pricing variable. Photo-determinable details (spa, basin count, bathroom size, shower-over-bath, ensuite, efflorescence, etc.) belong to the QUOTER (Allan/Marko reviewing photos), NOT the form. Don't add conditional questions for things photos already show.
type: feedback
originSessionId: 2026-05-05-form-audit
status: LOCKED — never re-litigate
---

# The rule

**The form is LEAD INTAKE. The quoter is the human (Allan/Marko). The QUOTER picks the final SKU based on photos.**

This means:

- Photos do the disambiguation work. The form's job is to capture enough to ROUTE the lead, not to PRICE it.
- The resolver in `pricing-resolver.js` produces a starting SKU pool from form data; the human reviews photos and picks the final SKU.
- Don't add conditional questions for things the QUOTER can identify from photos.
- Customer time/friction is the most expensive currency. Every avoided question = better completion rate.

# What this kills (rejected conditional questions)

The 2026-05-03 + 2026-05-05 audits suggested adding many conditional questions. After Allan's CEO call 2026-05-05, the following are REJECTED — never re-add to the form:

| Question | Why rejected | Where the data comes from |
|---|---|---|
| "Is this a spa bath?" Y/N | Photo close-up shows jets | Quoter photo review |
| "Bathroom size — Std/Large/Master?" | Doorway-scale wide shot shows it | Quoter photo review |
| "How many basins — 1 or 2?" | Wide vanity shot shows it | Quoter photo review |
| "Is this an ensuite?" Y/N | Size + photos disambiguate | Quoter photo review |
| "Is this a shower-over-bath combo?" Y/N | Wide shot reveals bath at shower base | Quoter photo review |
| "White chalky residue on grout?" Y/N (efflorescence) | Close-up grout shot shows it | Quoter photo review |
| "Walk-in vs standard shower?" | Doorway photo shows door/screen presence | Quoter photo review |
| "Tile material — laminate/stone/moulded?" | Edge close-up disambiguates | Quoter photo review |

# What stays in the form (must be asked because photos can't show)

| Question | Why it must be asked |
|---|---|
| Property type (rental landlord / rental tenant / owner / strata / commercial) | Affects warranty terms + pricing tier |
| Pre-1990 asbestos screening | Triggers different process flow + sub safety requirements |
| Tenant landlord-authorization status | Legal authorization required |
| Customer's chosen SCOPE (resurface vs regrout vs both vs chip-only) | Customer's expressed intent — different from technical capability |
| Notes textarea | Free text where customer can add anything photos miss |

# Also REJECTED (Allan 2026-05-05) — items I had on a "must ask" list that don't belong

| Question | Why rejected | What replaces it |
|---|---|---|
| Anti-slip preference toggle (ASL-01) | **Anti-slip is now BUILT IN by default on every shower floor resurface.** Safety-first policy. Not a customer choice. | No form change. Quote line item shows "anti-slip included". Website advertises as trust signal. Pricing sheet bakes the cost into TSR-07/08/09 (Marko + Allan to discuss). |
| ACMA opt-in checkboxes (Marketing + Transactional) | The form is a **quote REQUEST**, not marketing. Submitting the completed form IS the consent. | No form change. If we ever add newsletter / promotional outreach, add a marketing checkbox THEN. |
| consent_copy_version audit trail field | **Submitting the form IS the consent.** The customer filled it all out and pressed submit. No version-tracking needed for inferred consent. | Dropped 2026-05-05 (was briefly added, reverted same day per Allan). Rely on git history for the consent line + form_version field already in payload. |

# How this rule prevents re-litigation

Future Clifford or Cleo audits may suggest adding conditional questions for SKU disambiguation. **Reject these proposals on first pass** with a reference to this file.

The pattern is recognisable: any audit recommendation that says *"form should ask X to disambiguate SKU Y vs Z"* should be evaluated against:
1. Does the photo prompt set capture this? → If yes, REJECT (quoter handles it)
2. Is this a customer preference / opt-in / consent? → If yes, FORM must ask
3. Is this a process-flow-changer (asbestos, tenant approval)? → If yes, FORM must ask
4. Otherwise → REJECT, leave to quoter

# Signal to the quoter (Allan/Marko)

Because the form is intake, the quoter sees:
1. Customer's chosen scope (e.g. "shower → full_regrout")
2. Photos (the disambiguation source)
3. Property type, customer type, suburb (pricing tier inputs)
4. Notes (free text)

The quoter THEN picks the specific SKU. Not the form. Not the resolver. The human.

# Trade-off accepted

The downside of this approach: quoter spends ~2 minutes reviewing photos per lead vs ~30 seconds with fully-disambiguated form data. At 1-50 jobs/week, that's 5-100 minutes of quoter time/week. Acceptable trade-off for higher form completion rates and lower friction.

When volume hits 200+ jobs/month, revisit: AI vision pre-screening (Jordan's "AI quoting estimator" — photo → AI → quote range) becomes the next leverage point. Until then, human quoter review is the design.

# How this rule applies to plan v2

`plan_ghl_setup_draft_v2_2026-05-05.md` has a §8 (form code changes) listing webhook wiring + ACMA opt-ins + Cloudinary + consent logs + GA4 + fallback inbox. **None of those are SKU-disambiguation questions.** All are kept.

The sections of plan v2 that recommended SKU-disambiguation conditional questions (e.g. bathroom_size, basin_count, ensuite, spa flag) are SUPERSEDED by this rule.

# The exception list (when to add a conditional question despite this rule)

Only add a question when:
1. Photo CANNOT show it (e.g. customer preference, history, opt-in)
2. The pricing or process delta is >$500 AND ambiguous from photos
3. The cost of mis-routing is high (legal/safety like asbestos)

Anything else: trust the photos, trust the quoter.

— Clifford & Cleo, 2026-05-05, locked by Allan's CEO call
