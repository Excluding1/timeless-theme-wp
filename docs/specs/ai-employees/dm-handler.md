# AI Employee: DM Handler (Conversational Quote Gathering)

**Job title:** AI DM Handler
**Reports to:** CEO
**Build status:** Spec ready ✅ — pending implementation by AI ops engineer
**Cost estimate:** ~$5-10/mo (Claude API + Meta Graph API base; scales linearly with DM volume)
**Deploy:** Cloud Function with Meta webhook subscription + Claude API + GHL integration

---

## Why this employee exists

**Source:** Jordan Schofield (Surface Care AU), Video 21 — *"DM handler that actually collects quotes from customers in a conversation rather than sending them to a form."*

**Business impact:** Once we run paid Meta (FB/IG) ads, a meaningful fraction of inbound interest arrives via DM rather than form fill. Mobile-first social-media customers are 5-8x less likely to switch out of DM to a web form (industry mobile-abandonment data — see [auditor-mobile-abandonment.md](../../roles/auditor-mobile-abandonment.md)). Without this agent, those leads die. With it, conversational quote-gathering converts ~70%+ of engaged DM threads to GHL contacts.

---

## Identity

**Role lens:** [expert-conversion-copywriter.md](../../roles/expert-conversion-copywriter.md) — for warm, helpful conversational tone that builds trust within 3-5 exchanges.

**Audit lens (self-applied):** 3-lens per [CEO Rule 2](../../CEO.md#rule-2--every-decision-passes-3-lens-audit-before-landing-in-ceomd):
- Lens 1: [auditor-customer-fairness.md](../../roles/auditor-customer-fairness.md) — does the customer get a real answer, or feel manipulated?
- Lens 2: [auditor-compliance-aus.md](../../roles/auditor-compliance-aus.md) — Privacy Act + ACCC misleading-conduct + Meta Platform Terms compliance
- Lens 3: [auditor-mobile-abandonment.md](../../roles/auditor-mobile-abandonment.md) — friction reduction lens

**Confidence threshold:** 75%. Below → escalate to human (Allan/Marko) before replying. Specifically: if customer mentions complaint, dispute, asbestos, or anything legal → MUST escalate.

**Identity statement (system prompt opening):**
> You are a conversational quote assistant for Timeless Resurfacing, a Sydney bathroom resurfacing & regrouting business. You read incoming Facebook and Instagram direct messages, and your job is to gather just enough information to create a genuine quote: customer's name, suburb, what they want done, and ideally photos of the issue. You write like a helpful tradie's assistant — friendly, brief, no buzzwords, no bot-speak. You disclose that you're an AI assistant if asked directly. You never quote a price (that's the human team's job once they have full context). You're the lead-gathering layer; humans close.

### Persona disclosure rule (ACCC misleading-conduct compliance)

If customer asks "are you a person?" or "is this AI?" or "is this automated?" → reply truthfully:
> "Yes — I'm an AI assistant for Timeless. I'm helping gather your details so the team can come back with a proper quote within 15 minutes. Happy to keep chatting, or if you'd prefer a human, just say 'human' and I'll hand you over."

This avoids ACCC misleading-conduct exposure (Australian Consumer Law s18) and aligns with consumer expectations for AI transparency.

---

## Job description

### Primary task: DM-to-quote conversation

When a customer DMs our FB/IG, agent reads the message + thread history, decides what to say next.

### Conversation arc (target: 3-5 exchanges, max 10)

| Exchange | Goal | What agent gathers |
|---|---|---|
| 1 (initial reply) | Acknowledge + thank for reaching out | Customer's name (from FB profile if available; ask if not) |
| 2 | Understand what they want done | Service type (regrout / bath resurface / silicone / full bathroom) |
| 3 | Where are they | Suburb + property type (apartment / house / strata) |
| 4 | What's the situation | Photos request (essential — Allan/Marko need photos to quote) |
| 5 | Set expectation | "Team will come back with quote within 15 min, ok?" + handover to human |

### Hard rules per exchange

**DO:**
- Reply within 60 seconds of customer message (faster than human possible — that's the value)
- Use customer's name once they share it
- Ask one thing at a time (don't barrage with 5 questions)
- Confirm understanding ("Got it — Surry Hills apartment shower regrout. Have a couple of photos handy?")
- Hand over to human at exchange 4-5 OR sooner if customer says "human" or asks complex question

**DO NOT:**
- Quote prices, ever — even ranges. ("That depends — let our team check the photos and they'll have a real number for you in 15 min.")
- Promise dates without checking dispatch availability
- Diagnose problems beyond surface (no "that looks like asbestos" or "that needs full replacement")
- Engage with abusive / spam / off-topic messages — escalate or close politely
- Save DM contents to any non-GHL location without consent

### Photo handling

- Photos sent via DM auto-route to Cloudinary (signed upload, photo URLs stored in GHL contact)
- Per Privacy Act: photos may show identifiable bathrooms — treat as personal info; retention policy = "until job complete + 90 days" then archive
- Never re-share customer photos externally without explicit written consent (Facebook DM "yes" is sufficient consent for our internal use)

### Escalation triggers (immediate hand to human)

- Customer mentions: complaint, dispute, NCAT, lawyer, refund, "small claims"
- Customer mentions: asbestos, lead paint, mould health concerns, illness
- Customer says: "human", "person", "speak to someone", "real person"
- Confidence score <75% on understanding their need
- Conversation reaches 6+ exchanges without convergence
- Customer expresses frustration, anger, urgency

When escalating: send Slack alert to `#dm-escalations` (NEW channel) with full thread + reason. Stop replying until Allan/Marko picks up.

---

## Technical architecture

### Inbound flow

```
Customer DMs FB Page or IG Account
  ↓
Meta Graph API webhook → Cloud Function
  ↓
Cloud Function reads thread context from Meta
  ↓
Calls Claude API with system prompt + thread history
  ↓
Claude returns: { reply_text, action: continue | escalate | handover, gathered_data: {...} }
  ↓
If continue: Cloud Function sends reply via Meta Graph API
If escalate/handover: Slack alert to #dm-escalations + Cloud Function pauses agent on this thread
  ↓
Throughout: structured data accumulates in temp store (Redis/Firestore TTL 24h)
  ↓
At handover: data flushed to GHL as contact + tagged dm_handler_handover + form_status=completed_via_dm
```

### Compliance with Meta Platform Terms

Meta has specific rules for automated messaging (Messenger Platform Policy, Instagram Messaging API Terms):

- **24-hour messaging window**: agent can reply within 24h of last customer message; outside that, only "Message Tags" (e.g., HUMAN_AGENT, POST_PURCHASE_UPDATE) — agent must respect this
- **No mass unsolicited DMs**: agent only replies to inbound; never initiates
- **Quality filter**: Meta scores message quality; abusive/spammy patterns reduce delivery — keep replies on-topic, helpful, brief
- **Disclosure**: Meta does not yet require AI disclosure, but ACCC + customer expectations do — we disclose

Spec MUST be reviewed against Meta Platform Policies AT BUILD TIME and AT EACH QUARTERLY MAINTENANCE — Meta updates policies frequently.

---

## Output format

Per conversation:

```json
{
  "thread_id": "meta_thread_id",
  "platform": "facebook | instagram",
  "customer_meta_id": "...",
  "customer_name": "First name (from profile or asked)",
  "exchanges": 4,
  "outcome": "handover_to_human | escalated | abandoned | spam",
  "gathered_data": {
    "name": "...",
    "suburb": "...",
    "service_requested": "...",
    "property_type": "...",
    "photo_urls": ["..."]
  },
  "ghl_contact_created": true | false,
  "ghl_contact_id": "...",
  "duration_seconds": 720,
  "handover_reason": "natural_arc_complete | customer_requested | escalation_trigger | ...",
  "escalation_reason": "...",
  "slack_alerted": true | false,
  "ai_disclosed": true | false
}
```

Posts daily summary to Slack `#ai-agents-activity`:
- N DMs received
- N converted to GHL contacts
- N escalated to human (with reasons breakdown)
- N abandoned/spam
- Avg time-to-handover
- Cost estimate ($Claude + $Meta API for the day)

---

## Tooling required

### Read access
- Meta Graph API (FB Page Messenger + IG Business DM) — webhook subscription + message history read
- GHL: contact lookup (to detect returning customers — auto-skip greeting if recognised)

### Write access
- Meta Graph API: send replies (within 24h window)
- GHL: create contact + tags + custom fields
- Cloudinary: photo upload from DM attachment
- Slack: post escalations + daily summaries
- Temp store (Redis/Firestore): conversation state with 24h TTL

### Execution model
- Triggered by Meta webhook on inbound message
- Sub-second latency to first reply (target: <60s, hard floor: 5s)
- Idempotent on retry (Meta retries failed webhooks — must not double-reply)
- Kill switch: env var `DM_AGENT_ENABLED=false` → all DMs route directly to human via Slack

### Cost control

| Component | Cost basis | Estimate Year 1 |
|---|---|---|
| Claude API (input + output) | Per 1k tokens | ~$0.05 per conversation × ~20 DMs/week = $4/mo |
| Meta Graph API | Free tier sufficient at <100k msgs/day | $0 |
| Cloudinary | Free tier 25GB | $0 |
| Cloud Function invocations | First 2M free | $0 |
| Total | — | **~$5-10/mo** |

---

## Research mandate (per CEO Rule 4 + 11)

### At build time + quarterly maintenance

**Meta Platform Policy compliance:**
- Messenger Platform Policy (latest version)
- Instagram Messaging API Terms
- Recent Meta enforcement actions / API access revocations

**Australian compliance:**
- ACCC Misleading Conduct guidance (Australian Consumer Law s18) — AI persona disclosure
- Privacy Act 1988 — DM content as personal info
- Spam Act 2003 — does Spam Act apply to inbound-triggered Meta DM replies? (Per ACMA: Spam Act applies to *commercial electronic messages*; inbound-triggered conversational replies are generally treated as transactional, not commercial — but disclosure + opt-out preferred)

**Failure-mode research:**
- Reddit r/sysadmin + r/socialmedia — botched FB chatbot examples
- Meta Developer Forum — recent API breaks/changes
- ACCC misleading-conduct cases involving chatbots (2023-2026)

### Per-conversation research

Generally none — the agent doesn't research mid-conversation. It uses pre-cached context (suburb list, service catalog, FAQ).

---

## Build sequencing

**Pre-conditions before build:**
1. Phase 1 GHL custom fields exist (so handover can write to them)
2. Cloudinary configured per Phase 4.5
3. Meta Business Manager + FB Page + IG Business account verified (24-72hr Meta verification)
4. Meta App created + Page-level webhook permissions granted
5. Privacy Policy + ACCC-compliant AI disclosure language ratified

**Phase 6 timing:** Once we run Meta ads (Phase 4.x or later) AND DM volume >5/week, build agent. Earlier = no DMs to handle = wasted build effort.

---

## CEO commission template

```
@ai-dm-handler: Activate agent for FB Page + IG Business account.

Pre-conditions verified:
- [ ] Meta Business Manager + Page + IG Business linked
- [ ] Meta App with messaging permission approved
- [ ] GHL custom fields ready
- [ ] Cloudinary upload preset configured
- [ ] Privacy Policy + AI disclosure language live on website

Build:
- [ ] Cloud Function with Meta webhook subscription
- [ ] Claude API with system prompt per spec
- [ ] GHL handover integration
- [ ] Slack #dm-escalations + #ai-agents-activity channels
- [ ] Kill switch env var

Test mode for first 30 conversations:
- All replies queued for human approval before sending (NOT auto-send)
- After 30 successful auto-approved → switch to live auto-reply

Confidence threshold: 75%. Below → human escalation (no auto-reply).
```

---

## Maintenance + drift detection (per [auditor-general-operational](../../roles/auditor-general-operational.md))

Monthly CEO review:
- [ ] Conversion rate trend (target ≥60% of qualified DM threads → GHL contact)
- [ ] Escalation rate (target <20%; if >30% the agent is below skill threshold or scope is too broad)
- [ ] Customer feedback in escalated threads ("the bot was annoying" = signal)
- [ ] Compliance audit — random sample 5 conversations: AI disclosed when asked? Privacy respected? Photos handled correctly?
- [ ] Cost trend — $/converted-lead

Quarterly CEO review:
- [ ] Meta Platform Policy review (have terms changed?)
- [ ] ACCC enforcement decisions on chatbots in last quarter
- [ ] Prompt drift — re-baseline against successful conversations

**Kill criteria:** if escalation rate >40% for 2 consecutive months, OR any compliance breach (AI disclosure failure when asked), OR Meta sends warning email about message quality → pause + audit.

---

## Future enhancements (post-MVP)

- **Returning-customer detection** — if customer has prior GHL contact, agent uses warmer tone ("Welcome back, Sarah! Same bathroom or different?")
- **Photo quality pre-screen** — Claude Vision evaluates photos: too dark / too far / can we quote from this? — request better photo if needed
- **Multi-language** — Mandarin / Cantonese / Arabic for Sydney's diverse market (priority research at $30K/mo)
- **Voice-note transcription** — many DM users send voice notes; transcribe before processing
- **Sentiment monitoring** — if customer frustrated, agent adjusts tone + escalates faster

---

## References

- [Jordan Video 21](../../../data/research/jordan-transcripts-mined-2026-05-01.md) — DM handler concept
- [docs/FUTURE-PLAN.md § F12](../../FUTURE-PLAN.md) — future-plan entry
- [docs/roles/expert-conversion-copywriter.md](../../roles/expert-conversion-copywriter.md) — copy lens
- [docs/roles/auditor-mobile-abandonment.md](../../roles/auditor-mobile-abandonment.md) — friction lens
- [docs/roles/auditor-compliance-aus.md](../../roles/auditor-compliance-aus.md) — Spam Act + Privacy Act + ACCC
- [docs/CEO.md § Rule 11](../../CEO.md) — failure-mode research
- [Meta Messenger Platform Policy](https://developers.facebook.com/docs/messenger-platform/policy/policy-overview) — external (verify version at build time)
