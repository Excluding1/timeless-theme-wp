# Multi-bathroom fix — build spec (pipeline 3.3) · LOCKED 2026-06-13 (both CEOs, Option A)

**Why:** confirmed on a real lead (Mick Connolly, 1 Pearra Way) — multi-bathroom submissions collapse to ONE
GHL opp and bathroom 2 OVERWRITES bathroom 1's notes/scope/photos. Mechanism + recovery proven (see
`.claude/debug/ghl-opp-field-id-map-2026-06-13.md`; audit-log recovery = 60-day band-aid only).
**Decision:** OPTION A — separate opportunity per bathroom (matches the locked HBA per-invoice-<$5k strategy;
each bathroom's data/photos/scope/invoice/SM8-job is its own boundary). Cleo co-signed.

## The build (3 layers)

### 1. FORM (QuoteForm.jsx — ships next deploy)
- Generate a `property_submission_id` (UUID v4) ONCE at form session start (first render / first field touch),
  persist in localStorage with the rest of the funnel state, and CLEAR it only on a fully-fresh start (not on
  startNextBathroom — it must stay constant across all bathrooms of one property).
- Include `property_submission_id` in BOTH the W1 and W2 payloads (alongside the existing bathroom_index /
  bathroom_count at QuoteForm.jsx:1140-1141).
- No other form logic changes — the per-bathroom loop already computes each bathroom's scope/notes/photos
  correctly; we're only adding the link key + letting GHL keep them separate.

### 2. GHL (W1 workflow config)
- **Opp create/dedupe key = `property_submission_id` + `bathroom_index`** (external idempotency). Same key
  re-firing (a retry) updates; a new bathroom_index creates a NEW opp. This is the core change — today the
  create-opp action effectively keys by contact, which is why it collapsed to one.
- Opp NAME suffix: `"{{contact.name}} - {{address}} (Bathroom {{bathroom_index}} of {{bathroom_count}})"`.
- **Ack (ties to pipeline 1.0):** send the W1 ack SMS ONLY when `bathroom_index == 1`, count-aware
  ("quotes for your {{bathroom_count}} bathrooms"). Suppress on 2+. One ack per property.
- Store `property_submission_id` on each opp (custom field) so the bathrooms are findable as one job.

### 3. DOWNSTREAM (carry the link through — Cleo amendment)
- Make Scenario 1 + back-sync + the `#new-jobs` Slack ping: include `property_submission_id` + bathroom
  index/count + the opp-name suffix, so humans see "same property, separate bathroom." (opp_id stays the
  unique dedup key — two opps = two SM8 jobs BY DESIGN, not a double-fire.)

## Certified-flow safety (verified 2026-06-13)
- Make dedup keys on `opp_id` (unique per opp) → 2 bathrooms = 2 SM8 jobs, correct, no double-fire.
- stage-11 deposit gate stays per-opp → bathrooms can dispatch independently.
- #new-jobs ping fires per SM8 job = per bathroom, correct.
- Nothing in W1-ack / stage-11→Make→SM8 / back-sync breaks; W1 ack handled by the 1.0 condition.

## Customer-facing quote = ONE transparent package (ACL — Cleo + ACCC)
Present a SINGLE packaged quote with bathroom-level line items, the multi-bathroom discount, **the total
minimum payable, and GST shown** — and state that acceptance/payment is invoiced as Bathroom 1 + Bathroom 2
separately. Risk is opacity, not the split. (ACCC price-display guidance: accurate, not misleading, total
price shown — https://www.accc.gov.au/business/pricing/price-displays). The quote-drafter kit (1.16) must
support this "package quote → split invoice" shape.

## INTERIM (until this ships) — manual SOP
When `bathroom_count > 1` on a lead: immediately reconstruct bathroom 1 from the **opp audit log**
(before/after, 60-day window) + the customer note; only ask the customer if bathroom 1 can't be confidently
reconstructed. NEVER rely on the overwritten live opp fields or memory.

## Definition of Done
A 2-bathroom test submission = 2 linked opps (shared property_submission_id, named "Bathroom 1/2 of 2"),
each retaining its OWN notes/scope/photos (nothing overwritten), ONE ack mentioning the count, and 2 SM8
jobs on stage-11 drag. Audit-log no longer needed for recovery because nothing is lost.
