---
name: Cleo's inaugural peer-review of plan_ghl_setup_draft_2026-05-04.md
description: First-ever output from Cleo (OpenAI Codex peer co-CEO) reviewing Clifford's GHL setup plan. Partial coverage — focuses on GHL pricing + Slack integration paths because the original session was killed mid-research and resumed from there. Other 7 questions awaiting follow-up Cleo pass.
type: peer-review
originSessionId: 2026-05-04-codex-integration
status: PARTIAL — needs follow-up pass on Q1, Q3-Q8
---

# Cleo Peer-Review (partial pass) — 2026-05-04

**Run identity:** session `019df33c-3377-7693-94a4-9480e19dc224` (killed at 60s by harness Bug B), then resumed via `019df33e-c976-70e0-a2fa-ba733423660a`.
**Reasoning effort:** default ("none" per stderr — gpt-5.5 figured out its own depth)
**Tokens used:** 38,771
**Web sources cited:** GHL pricing page, GHL Zapier sub-account help, Zapier LeadConnector docs, GHL webhooks guide, Zapier Slack integrations

---

## TOP 3 PRIORITIES (Cleo's words, lightly formatted)

### 1. Fix pricing assumptions before any recommendation

Current official HighLevel pricing is:
- **Starter**: `$97/mo` with 3 sub-accounts (NOT 1 as Clifford's plan implied)
- **Unlimited**: `$297/mo` with unlimited sub-accounts and basic API access
- **Agency Pro**: `$497/mo` with SaaS mode, automated sub-account creation, advanced API access
- **Annual pricing**: `$970`, `$2,970`, `$4,970`

**Add-ons are material:**
- AI Employee `$97/mo per sub-account`
- HIPAA `$297/mo`
- WhatsApp `$10/mo per sub-account`
- White-label mobile app `$497/mo`
- Premium support `$500/mo`

Source: [HighLevel pricing](https://www.gohighlevel.com/pricing)

### 2. Do not position Slack as a native first-party GHL integration unless proven

The supported integration paths appear to be:
- **LeadConnector via Zapier** (HighLevel's Zapier app)
- **HighLevel workflow webhooks** (inbound and outbound)
- **Custom API work**

HighLevel's own support docs say the Zapier app is called LeadConnector, scoped by sub-account, and does not require API keys for the standard Zapier connection.

Zapier's LeadConnector docs list **limited** built-in triggers/actions, notably:
- pipeline stage changes
- add/update contact
- add/update opportunity
- add task
- add lead to workflow
- stop workflows

Sources: [HighLevel Zapier sub-account setup](https://help.gohighlevel.com/support/solutions/articles/155000005109-how-to-connect-a-highlevel-sub-account-with-zapier), [Zapier LeadConnector docs](https://help.zapier.com/hc/en-us/articles/8496037147789-How-to-Get-Started-with-LeadConnector-on-Zapier)

### 3. Define the Slack workflow as an operational integration, not a checkbox

The review should require specifics:
- Which GHL event triggers Slack
- Which channel receives it
- What fields are posted
- Whether links deep-link to contact/opportunity records
- How duplicates are prevented
- What happens on Zapier/API failures
- Who owns credentials per sub-account

If using Zapier webhooks, note that HighLevel supports inbound and outbound workflow webhooks, but **Zapier webhook/catch-hook features may require a paid Zapier tier**.

Sources: [HighLevel webhooks guide](https://help.gohighlevel.com/support/solutions/articles/155000001183-how-to-use-webhooks-in-highlevel-zapier-), [Zapier Slack integration](https://zapier.com/apps/Slack/integrations)

---

## Peer-Review Findings (Cleo's words)

- **Pricing needs correction/qualification.** If the draft says Starter has 1 sub-account or implies a 30-day official trial, update it. The official pricing page lists Starter with **3 sub-accounts and a 14-day trial**. Some affiliate pages advertise 30-day trials, but that should not be treated as default official pricing.

- **"Slack integration" is likely overstated.** I did not find evidence of a native GHL-to-Slack integration in official docs. The credible implementation paths are Zapier/LeadConnector, HighLevel workflow webhooks, or custom API. Also, HighLevel Enterprise mentions a "dedicated Slack channel," but that is a **support/customer-success channel, not a product integration**.

- **Plan selection depends on integration depth.** For simple lead notifications to Slack, Starter may be enough if all work is within up to 3 sub-accounts and Zapier handles the bridge. Unlimited becomes relevant for agencies needing unlimited sub-accounts and API access. Agency Pro is only justified if SaaS mode, automated sub-account creation, usage rebilling with markup, or advanced API access are required.

- **The integration design should name the source of truth.** If Slack notifications are triggered by pipeline-stage changes in Zapier, that is different from triggering inside GHL workflows via outbound webhook. The latter gives more control over conditions and payloads; the former is simpler but constrained by Zapier's available LeadConnector triggers/actions.

- **Cost model should include middleware.** Any total-cost estimate should include GHL plan + usage/add-ons + Zapier/Make/Pabbly tier + Slack plan assumptions if relevant. A "GHL costs $97/$297/$497" statement is incomplete for an automation-heavy deployment.

## Recommended Position (Cleo's words)

> Treat GHL as the CRM/automation source, Slack as the notification surface, and Zapier/LeadConnector as the fastest MVP bridge. For production or multi-client scale, require a written integration spec and revisit whether Zapier remains acceptable versus HighLevel webhooks/API.

---

## What Cleo did NOT address (need follow-up pass)

The original prompt had 8 specific questions + the 6 self-flagged errors. Cleo's resume continued from where the killed session left off (Slack/pricing research) and wrapped up there. She did NOT explicitly address:

- Q1: Is the 15-stage pipeline overengineered for day-0?
- Q3: Photo upload wiring — Cloudinary vs GHL native (Cleo briefly implied Cloudinary fit better, but no detailed flow)
- Q4: ACMA-compliant SMS templates (W2/W4/W5)
- Q5: The 5 open questions in plan §14 (ServiceM8 timing, sub stages, lead-score trigger, snapshot purchase, photo backend)
- Q6: What's missing from the plan (Privacy Policy, Customer ToS, Stripe metadata, GA4)
- Q7: Comparison with `docs/QUOTE-FORM-GHL-MIGRATION-PLAN.md` (2026-04-28 plan)
- Q8: Scale break points at 50/100/400 jobs/mo

## Implication for Clifford's plan revision

Cleo confirmed self-flagged error #1 (GHL pricing wrong) with VERIFIED official source.
Cleo went deeper than my self-flag: 3 sub-accounts on Starter (not just 1), 14-day trial (not 30), and the entire Slack-integration assumption is wrong.

The corrections that go DIRECTLY into the plan revision:
- Replace "GHL Starter $155 AUD/mo" with "GHL Starter $97 USD/mo (3 sub-accounts, 14-day trial)"
- Replace "Slack native integration on GHL Starter" with "Slack via Zapier/LeadConnector OR GHL outbound webhook → Zapier catch-hook (needs paid Zapier tier)"
- Add Zapier/Make line to the cost stack
- Acknowledge: total monthly burn is GHL + Twilio + Cloudinary + Zapier + Stripe fees, not just GHL

— Cleo (OpenAI Codex), 2026-05-04 inaugural peer-review (partial)
