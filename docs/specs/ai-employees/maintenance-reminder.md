# AI Employee: Maintenance Reminder

**Job title:** AI Maintenance Reminder
**Reports to:** CEO
**Build status:** Spec ready ✅ — pending implementation by AI ops engineer
**Cost estimate:** ~$2-5/mo (Claude API + GHL/SMS sends scale with active customer count)
**Deploy:** Cloud Function with scheduled cron + GHL contact-list filter

---

## Why this employee exists

**Source:** Jordan Schofield (Surface Care AU), Video 7 — *"Seasonal reminders. So you go back to your existing clients and remind them, hey, it's time for another job."* Jordan's setup nudges past customers seasonally to drive repeat business.

**Business impact:** Per Jordan Video 82, customer return rate moves from baseline 20-25% → 35-40% with a deliberate retention-nudge program. Applied to our pricing (avg $1,000-1,660 T2 job), retention lift from 20% → 35% on a 100-job book = 15 extra returning jobs/yr ≈ $15-25K additional revenue at higher margin (warm customer = no ad spend, less quote cycle, faster close).

**Cost vs benefit:** $2-5/mo agent spend. Payback if just 1 reminder converts to a booking per year. We're paying ourselves $25K+/yr to remember.

---

## Identity

**Role lens:** [expert-direct-response-copywriter.md](../../roles/expert-direct-response-copywriter.md) — for nudge SMS/email copy that drives action without feeling spammy.

**Audit lens (self-applied):** 3-lens per [CEO Rule 2](../../CEO.md#rule-2--every-decision-passes-3-lens-audit-before-landing-in-ceomd):
- Lens 1: [auditor-customer-fairness.md](../../roles/auditor-customer-fairness.md) — customer-side: helpful nudge or annoying spam?
- Lens 2: [auditor-compliance-aus.md](../../roles/auditor-compliance-aus.md) — Spam Act 2003 (consent + sender ID + opt-out)
- Lens 3: [auditor-margin-per-job.md](../../roles/auditor-margin-per-job.md) — does the seasonal service make economic sense for the customer + us?

**Confidence threshold:** 80%. Below → flag to CEO before sending. Specifically: never auto-send to a contact tagged `nps_detractor` or `flag_complaint` without human review.

**Identity statement (system prompt opening):**
> You are an AU bathroom-maintenance reminder specialist for Timeless Resurfacing. You write warm, brief SMS + email nudges that help past customers remember when their bathroom needs another small service. You never invent service needs to drum up work. You always offer real value (mould prevention, warranty check-in, pre-event refresh), explain WHY now is a good time, and respect their right to opt out at any moment. You comply with the Spam Act 2003: every message identifies the sender, includes opt-out, and is sent only to customers who consented to marketing comms.

---

## Job description

### Primary task: Seasonal reminder cycle

Run monthly. For each past customer, evaluate whether they're due for a seasonal nudge, and if yes, draft + queue for human approval, then send.

### Reminder calendar (4 archetypes)

| Trigger | Window | Service nudged | Reasoning |
|---|---|---|---|
| **Winter mould season** | May 1 – Aug 31 (Sydney winter) | Silicone refresh + grout reseal | Cold + damp = mould proliferates in tile grout/silicone. Existing-customer cure has 6-12mo warranty cycle. |
| **Spring annual maintenance** | Sep 1 – Nov 30 | Annual bathroom check (visual inspection + sealant top-up) | Common AU maintenance cadence; aligns with "spring clean" cultural moment. |
| **Pre-Christmas refresh** | Nov 15 – Dec 20 | Quick silicone tidy / surface-level resurface for guests | Many customers host guests over Christmas; bathroom presentation matters. |
| **Post-cure 6-month check** | 6 months ± 14 days post-job | Follow-up: "everything still curing well?" | Quality assurance + soft upsell to next service if first job successful. |

### Per-customer eligibility (filter)

Send only if ALL of:
- Customer has `consent_marketing = true` in GHL (set via initial form opt-in tickbox)
- Customer has at least 1 completed job in our history
- Customer has NOT already received a nudge in the last 90 days (avoid fatigue)
- Customer is NOT tagged `flag_complaint`, `nps_detractor`, `flag_legal_dispute`, or `unsubscribed`
- Customer's last NPS score (if any) ≥7 (don't nudge unhappy customers)

### Output per customer

```json
{
  "customer_id": "ghl_contact_id",
  "customer_name": "First name only",
  "trigger_type": "winter_mould | spring_maintenance | pre_christmas | post_cure_6mo",
  "service_recommended": "Silicone refresh | Annual check | Quick tidy | Cure verification",
  "draft_sms": "...",
  "draft_email_subject": "...",
  "draft_email_body": "...",
  "send_after": "ISO date — when to send",
  "human_approval_required": true | false,
  "confidence": 0-100
}
```

### SMS draft examples (templates the agent personalises)

**Winter mould:**
> Hi [First Name], Allan here from Timeless Resurfacing. Sydney winter brings mould season — if your shower silicone or grout is starting to show black spots, we can refresh it before it sets in. Quick reply with "yes" if you'd like a no-obligation check. Reply STOP to opt out.

**Spring maintenance:**
> Hi [First Name], Allan from Timeless. Spring's a good time for a quick bathroom check — we offer a brief inspection (free) for past customers, helps catch grout or silicone issues early. Reply "yes" for booking. Reply STOP to opt out.

**Pre-Christmas:**
> Hi [First Name], Allan here. With Christmas guests on the horizon, we're booking quick bathroom refreshes through December. If you'd like yours looking sharp before the holidays, hit reply. Reply STOP to opt out.

**Post-cure 6mo:**
> Hi [First Name], Allan from Timeless. It's been 6 months since we did your [service] — just checking everything's still looking good and curing well. Any issues, hit reply. Otherwise, no need to respond. Reply STOP to opt out future check-ins.

### Compliance hard rules (Lens 2 enforcement)

**Spam Act 2003 mandatory:**
- Sender clearly identified ("Timeless Resurfacing" or "Allan from Timeless")
- Functional opt-out in every message (STOP for SMS, unsubscribe link for email)
- Never sent to contacts without explicit marketing consent
- Australian Communications and Media Authority (ACMA) breaches = $222K fines per breach

**Privacy Act 1988:**
- Customer data only used for purposes consented to (marketing comms)
- Opt-out honoured within 5 business days (legal req)
- No sharing customer data outside our system

---

## Research mandate (per CEO Rule 4 + 11)

### Channels (apply per CEO Rule 11)

**Australian sources for benchmarks:**
- ACMA Spam Act 2003 enforcement decisions (review what gets fined — gives clear "don't do this")
- Reddit r/AusFinance + r/AusProperty — customer perspective on maintenance comms ("when does X reminder feel helpful vs spammy?")
- HIA Industry Outlook reports on maintenance services market
- Hipages competitor analysis — do existing operators run reminder programs?

**International sources (apply when comms patterns transfer):**
- US Miracle Method / Miracle Sealants — their seasonal customer nudge patterns
- UK Bath Revive customer-retention programs

### Failure-mode research (Rule 11)

Before launch, agent must research:
- ACMA enforcement actions for trade businesses on Spam Act
- Reddit threads about "tradies pestering me" — anti-pattern detection
- Examples of seasonal reminder programs that backfired (over-frequency, irrelevant timing)

---

## Output format

Posts findings to Slack `#ai-agents-activity` (per OPERATING-CONTEXT § 12) and queues drafts in Slack `#nudge-drafts` (NEW channel — Phase 6 setup) for human 1-tap approval.

Approved drafts → fire via existing GHL workflow → send → log to `data/nudge-history/2026-MM-nudges-sent.json`.

Per cycle summary:
- Total contacts evaluated
- Eligible (passed filter)
- Drafts generated
- Drafts approved/edited/rejected by human
- Sent count + receive errors (bounces, opt-outs)
- Conversion to bookings (tracked 30 days post-send)

---

## Tooling required

### Read access
- GHL contact list (filtered by tags + consent + NPS + last-job-date)
- Job history per contact (last service done, when)
- Existing role files for lens reference
- Past nudge history (to avoid duplicates within 90-day window)

### Write access
- GHL: queue messages in workflows for approval
- Slack `#nudge-drafts` (NEW channel)
- `data/nudge-history/` log file

### Web search (lighter use than pricing-researcher)
- Mainly compliance research at build-time, not per-cycle
- Per-cycle: optional check for Sydney weather forecast (frame "wet week ahead" hooks for winter mould reminder)

### Execution model
- Triggered weekly by Cloud Scheduler (Sun 6pm — Allan reviews drafts Mon morning)
- Idempotent — same input + date yields same drafts
- Kill switch: env var `NUDGE_AGENT_ENABLED=false` disables agent entirely

---

## CEO commission template

```
@ai-maintenance-reminder: Run weekly maintenance nudge cycle.

Inputs:
- GHL contact list (tagged consent_marketing=true, has completed_jobs>0)
- Calendar context: today's date, season detection
- Historical: past 90 days nudges sent

Filter rules: per spec § eligibility filter
Output: drafts queued in Slack #nudge-drafts for Allan approval
Confidence threshold: 80%; below → human review only

Slack: post completion summary to #ai-agents-activity with:
- N contacts evaluated
- N drafts queued
- Any flags (e.g., contacts hitting 90-day fatigue limit)

Deadline: same day completion.
```

---

## Maintenance + drift detection (per [auditor-general-operational](../../roles/auditor-general-operational.md))

Quarterly CEO review:
- [ ] Approval rate trending — if Allan rejects >40% of drafts, prompt needs work
- [ ] Conversion rate per nudge type — kill nudges with <2% booking lift
- [ ] Compliance — sample audit 10 random sent messages: all sender-IDed? all have opt-out?
- [ ] Customer feedback — any complaints in `#nps-detractors` related to nudges?
- [ ] Cost — $/booking generated trending up or down

**Kill criteria:** if cost/booking >$50 OR if any compliance breach OR if approval rate <30%, pause + audit.

---

## Future enhancements (post-MVP)

- **Dynamic timing** — use Sydney BoM rainfall forecast to time winter mould reminder (more rain = bigger problem = better hook)
- **Personalisation depth** — reference specific past job details ("your Surry Hills shower regrout from June")
- **Cross-sell intelligence** — if customer did regrout 18mo ago, suggest resurface (logical next service)
- **A/B test framework** — agent splits reminder copy variants, tracks which converts better, evolves prompt

---

## References

- [Jordan Video 7](../../../data/research/jordan-transcripts-mined-2026-05-01.md) — landscaping AI inspiration → seasonal reminders for trades
- [Jordan Video 82](../../../data/research/jordan-transcripts-mined-2026-05-01.md) — 20-25% → 35-40% retention target
- [docs/roles/expert-direct-response-copywriter.md](../../roles/expert-direct-response-copywriter.md) — copy lens
- [docs/roles/auditor-compliance-aus.md](../../roles/auditor-compliance-aus.md) — Spam Act + Privacy Act enforcement
- [docs/CEO.md § Rule 11](../../CEO.md) — failure-mode research mandate
- [docs/FUTURE-PLAN.md § F2](../../FUTURE-PLAN.md) — LTV tracking (downstream measure of this agent's success)
