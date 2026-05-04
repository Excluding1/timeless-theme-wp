---
name: GHL Starter Capabilities — Verified (the 5 §12 questions answered)
description: Research agent dispatched 2026-05-05 to answer the 5 GHL Starter capability questions Clifford had left open in the GHL setup spec. Web-verified against official GHL docs. These answers move §12 from "Allan to verify" to "verified — execute on this basis."
type: reference
status: VERIFIED via official GHL docs 2026-05-05 — re-verify in actual account if surprised
date: 2026-05-05
researcher: general-purpose research agent (Clifford-dispatched)
originSessionId: 04add9fa-fa52-416e-bc34-9d39692a49df
---
# GHL Starter — verified capability matrix

## Q1: Custom Webhook actions in workflows
- **Status:** ✅ AVAILABLE on Starter — but PREMIUM action with per-execution cost
- **Cost:** 100 lifetime free executions per sub-account, then $0.01/execution
- **Optional add-on:** Workflow Pro Plan ($10/mo for 10K execs @ $0.008 overage; $25 for 30K @ $0.006; $50 for 65K @ $0.004)
- **Authentication on outbound:** None / Basic Auth / Bearer Token / API Key in header — masked secret credential storage
- **Source:** [help.gohighlevel.com — Premium Features for Workflows](https://help.gohighlevel.com/support/solutions/articles/155000005678-how-to-enable-and-rebill-premium-features-for-workflows)
- **Implication for our setup:** Slack webhooks fire from workflows, no upgrade needed. Expected volume <100/mo for a long time, all free. Don't subscribe to Workflow Pro Plan add-on yet — revisit if executions exceed ~1,000/mo.

## Q2: Conditional branching (If/Else) in workflows
- **Status:** ✅ AVAILABLE on Starter — STANDARD action, NOT premium
- **Capabilities:** YES/NO branching on contact fields, tags, opportunity stage, custom values; AND/OR multi-condition grouping; Dynamic Custom Values (compare live values from earlier workflow steps); appointment filter options; Wait Until Condition action; trigger-level filters
- **Source:** [help.gohighlevel.com — Workflow Action: If/Else](https://help.gohighlevel.com/support/solutions/articles/155000002471-workflow-action-if-else)
- **Implication:** Foundational. All workflow branching needs covered. No risk.

## Q3: Custom field count limit on Starter
- **Status:** ✅ NO documented hard limit on contact OR opportunity custom fields, on any plan tier
- **HOWEVER — CRITICAL ARCHITECTURAL GOTCHA:** When you edit an opportunity custom field from inside an opportunity, **GHL saves it to the contact, NOT the opportunity.** If a contact has multiple opportunities, the field value is **shared across all of them**. This means "opportunity-level fields" aren't truly per-deal if a customer gets multiple quotes.
- **Custom Objects (different from custom fields)** are capped at 10 per location across all tiers (October 2025).
- **Source:** [help.gohighlevel.com — Custom Fields for Opportunities](https://help.gohighlevel.com/support/solutions/articles/155000000521-how-to-use-custom-fields-for-opportunities)
- **Implication for our setup:** ~60 fields is well within limits. **BUT** the gotcha breaks the "repeat customer" use case (Marko's referral customer gets a second quote 2 years later → fields overwrite). Architectural fix:
  1. **True opportunity-level data** → use opportunity name/value/stage (these ARE per-opportunity)
  2. **Per-quote snapshot data** → consider a Custom Object OR appended notes
  3. **Latest-state contact data** → custom fields are fine
  - **Verify in GHL:** test with 2 opps for 1 contact, edit field on one, check if other gets overwritten.

## Q4: GHL native Stripe integration metadata propagation
- **Status:** ❌ NOT SUPPORTED — biggest gap
- **Detail:** GHL's `InvoicePaid` webhook schema documents `_id`, `status`, `amountPaid`, `invoiceNumber`, `contactDetails`, `invoiceItems` — **no `metadata` field, no Stripe `payment_intent.metadata` passthrough**.
- **Open feature request:** [ideas.gohighlevel.com](https://ideas.gohighlevel.com/invoicing/p/contact-custom-values-in-invoice) — confirms this is a known gap, not yet implemented
- **PARTIAL workaround (Option A — simpler):** Trigger workflows from GHL's native `Invoice Paid` event (NOT a raw Stripe webhook). The `contactDetails.id` IS in the payload. Limitations: can't natively distinguish `payment_type=deposit` vs `final_payment` unless encoded in invoice name/description; no opportunity_id mapping.
- **FULL workaround (Option B — flexible):** Vercel function as middleware. Form/workflow → Stripe API directly with metadata → Stripe webhook → Vercel verifies signature → POSTs to GHL inbound webhook → GHL workflow updates opportunity. Cost: $0 (Vercel free tier).
- **Source:** [marketplace.gohighlevel.com — InvoicePaid webhook schema](https://marketplace.gohighlevel.com/docs/webhook/InvoicePaid/index.html), [help.gohighlevel.com — Connect Stripe](https://help.gohighlevel.com/support/solutions/articles/155000005073-getting-started-connect-stripe)
- **Implication for our setup:** Phase 1 use Option A (encode `deposit` vs `final` in invoice name like *"Timeless Deposit — [contact_name]"* or *"Timeless Final Balance — [contact_name]"*). Move to Option B (Vercel middleware) when we need deterministic per-opportunity tracking with multiple deposits or partial payments. **Stripe configuration MUST stay in GHL native scope Phase 1** — adding Vercel layer is added complexity for no day-0 benefit.

## Q5: Inbound webhook trigger authentication
- **Status:** ❌ NO BUILT-IN AUTHENTICATION
- **Detail:** GHL generates a unique URL with a random ID. **No header validation, no HMAC, no payload signing requirement.** The `X-GHL-Signature` headers (Ed25519 signing) are for OUTBOUND webhooks GHL sends TO you, NOT inbound triggers receiving requests (common confusion).
- **Inbound Webhook is a Premium Trigger** ($0.01/execution — same 100 free lifetime budget as Q1).
- **Workaround that DOES work:** Add a `secret_token` field to form payload → first workflow step is If/Else: `{{webhook.secret_token}} == "actual_secret"` → if false, exit workflow.
- **Source:** [help.gohighlevel.com — Workflow Trigger: Inbound Webhook](https://help.gohighlevel.com/support/solutions/articles/155000003147-workflow-trigger-inbound-webhook), [help.gohighlevel.com — Inbound Webhook Premium Trigger](https://help.gohighlevel.com/support/solutions/articles/48001237383-how-to-use-the-inbound-webhook-workflow-premium-trigger)
- **Implication for our setup:** Form must POST a `secret_token` field. First workflow step gates on it. Layer of defense, not bulletproof — secret WILL be visible to anyone inspecting form HTML. For higher security, route through Vercel function: form → Vercel (verifies origin + rate-limits) → GHL webhook with shared secret. ~50ms latency, prevents direct abuse.

---

# Cross-cutting findings

1. **Two-layer pricing trap:** Several "Starter" mentions in GHL docs refer to the **Workflow Pro Plan Starter ($10/mo add-on)**, NOT the Agency Starter ($97/mo). Don't conflate. Allan's $97 plan does NOT auto-include 10K premium executions — gets only 100 lifetime free per sub-account unless he subscribes to Workflow Pro Plan add-on.

2. **Inbound webhook IS a Premium Trigger** — every form submission consumes one of the 100 free executions. At ~50 leads/month we burn the lifetime free budget in 2 months. Then $0.01/submission is trivial ($0.50/mo at 50 leads).

3. **Starter plan is sufficient** for everything in our spec. No upgrade to Unlimited ($297/mo) required. The $200/mo delta only buys: unlimited sub-accounts, API access for SaaS Mode, rebilling — none of which we need as single-business operator.

4. **No Stripe metadata round-trip** is the most consequential constraint. Either we use GHL's native `Invoice Paid` trigger with naming convention OR we add Vercel middleware. We'll use native Phase 1.

---

# Action items — what changes in the spec

| Was in spec | Should be |
|---|---|
| §12 "Allan to verify these in admin" | Section deleted — verifications complete + documented here |
| Stripe metadata propagation assumed | Stripe Phase 1: GHL native Invoice Paid trigger + naming convention. Phase 2: Vercel bridge if needed. |
| Inbound webhook URL alone for security | Form payload includes `secret_token`; first workflow step gates on it |
| "Custom field count" assumed unlimited | Add note about opportunity-fields-overwrite-on-repeat-customer gotcha |
| 100 free premium executions assumed unlimited | Note the budget; revisit when monthly volume > 1,000 |
| Workflow Pro Plan add-on confusion | Clarified: $10/mo add-on is OPTIONAL, only needed if executions > 100 lifetime + simple math doesn't support manual top-ups |

---

# What we DO need Allan to verify in actual account (smaller list)

These ONLY confirmable in his actual GHL account:
1. **Opportunity-vs-contact custom field gotcha** — create 2 opps for 1 test contact, edit field on one, check if it overwrites the other
2. **Inbound webhook payload variable access** — confirm `{{inboundWebhookRequest.body.field_name}}` syntax works inside If/Else
3. **Workflow Pro Plan add-on availability on Agency Starter** — the doc was ambiguous; spec says it's available but verify
4. **Premium execution counter** — find the dashboard showing remaining free executions

These take ~15 minutes total when he's logged in. Do not block setup on them — start building, verify on the way.

---

# Sources (full citation list)

1. [help.gohighlevel.com — Workflow Action: Custom Webhook](https://help.gohighlevel.com/support/solutions/articles/155000003305-workflow-action-custom-webhook)
2. [help.gohighlevel.com — Premium Features for Workflows](https://help.gohighlevel.com/support/solutions/articles/155000005678-how-to-enable-and-rebill-premium-features-for-workflows)
3. [help.gohighlevel.com — Custom Webhook Action: Secure Credential Management](https://help.gohighlevel.com/support/solutions/articles/155000005047-custom-webhook-action-secure-credential-management)
4. [help.gohighlevel.com — Workflow Action: Webhook (Outbound)](https://help.gohighlevel.com/support/solutions/articles/155000003299-workflow-action-webhook-outbound-)
5. [help.gohighlevel.com — Workflow Trigger: Inbound Webhook](https://help.gohighlevel.com/support/solutions/articles/155000003147-workflow-trigger-inbound-webhook)
6. [help.gohighlevel.com — Inbound Webhook Premium Trigger](https://help.gohighlevel.com/support/solutions/articles/48001237383-how-to-use-the-inbound-webhook-workflow-premium-trigger)
7. [help.gohighlevel.com — Workflow Action: If/Else](https://help.gohighlevel.com/support/solutions/articles/155000002471-workflow-action-if-else)
8. [help.gohighlevel.com — Custom Fields](https://help.gohighlevel.com/support/solutions/articles/48001161579-how-to-use-custom-fields)
9. [help.gohighlevel.com — Custom Fields for Opportunities](https://help.gohighlevel.com/support/solutions/articles/155000000521-how-to-use-custom-fields-for-opportunities)
10. [help.gohighlevel.com — Custom Objects In All Plans + Higher Limit](https://help.gohighlevel.com/support/solutions/articles/155000006631-custom-objects-in-all-plans-higher-limit)
11. [help.gohighlevel.com — Connect Stripe to HighLevel](https://help.gohighlevel.com/support/solutions/articles/155000005073-getting-started-connect-stripe)
12. [marketplace.gohighlevel.com — InvoicePaid Webhook Schema](https://marketplace.gohighlevel.com/docs/webhook/InvoicePaid/index.html)
13. [marketplace.gohighlevel.com — Webhook Integration Guide](https://marketplace.gohighlevel.com/docs/webhook/WebhookIntegrationGuide/index.html)
14. [help.gohighlevel.com — Workflows Pro Plan Pricing Tiers](https://help.gohighlevel.com/support/solutions/articles/155000003971-workflows-pro-plan-new-pricing-tiers)
15. [help.gohighlevel.com — HighLevel Pricing & Billing Guide](https://help.gohighlevel.com/support/solutions/articles/155000001156-highlevel-pricing-guide)
16. [gohighlevel.com — Pricing](https://www.gohighlevel.com/pricing)
17. [ideas.gohighlevel.com — Contact custom values in Invoice](https://ideas.gohighlevel.com/invoicing/p/contact-custom-values-in-invoice)

— Researched 2026-05-05 by Clifford-dispatched general-purpose agent
