# Cleo follow-up pass — 2026-05-04

## Q1: Stage-by-stage verdict

| Stage | Job | Pro day-0 | Con day-0 | Tweak for us | Verdict |
|---|---|---|---|---|---|
| 1. Quote Requested | Capture every full/partial lead into CRM. | Non-negotiable source of truth. | None. | Form → Cloudinary → GHL webhook; Slack ping. | KEEP |
| 2. Q&A | Hold leads needing photos, scope, access, asbestos clarification. | Matches real quote-from-photos workflow. | Can become a dumping ground. | Use only when Allan/Marko need an answer; auto-age >4h. | KEEP |
| 3. Sub-quote Requested | Ask subcontractor/specialist for cost input. | Future-proofs sub network. | Dead stage now, visual clutter. | Create but hide from default Phase 1 view. | SKIP-PHASE-1 |
| 4. Sub-quote Received | Store sub price before customer quote. | Preserves Jordan’s margin-control model. | Useless until subs exist. | Hidden; no workflows until first sub. | SKIP-PHASE-1 |
| 5. Quote Sent | Customer has received price/terms. | Critical sales waiting state. | Follow-up spam risk if cadence too aggressive. | 24h/72h max SMS cadence, then stop. | KEEP |
| 6. Quote Accepted | Customer signs off before money. | Separates intent from deposit. | Can be transient. | Auto-route to deposit or site inspection within minutes. | KEEP |
| 7. Site Inspection | Complex job needs physical validation. | Prevents underquoting risky jobs. | Mostly unused at 1-2 jobs/week. | Only for strata/commercial/asbestos/unclear photos/high-value jobs. | KEEP |
| 8. Prepayment | Await deposit/payment link. | Cash discipline. | Needs Stripe webhook reliability. | Stripe metadata must distinguish deposit vs final. | KEEP |
| 9. Job in ServiceM8 | Job exists in field-service system. | Matches Jordan’s operating model. | No ServiceM8 day-0. | Use as “ready to schedule” bucket until ServiceM8 Phase 2. | KEEP, TWEAK |
| 10. Job on Hold | Pause for access, strata, customer delay, materials. | Prevents fake progress. | Manual misuse risk. | Require `hold_reason` and weekly review. | KEEP |
| 11. Job Issue | Escalation lane for defects/complaints/blockers. | Operationally vital even at low volume. | Can scare team if overused. | Only real exceptions; Slack alert. | KEEP |
| 12. Job Booked | Date is locked. | Needed for reminders and capacity. | GHL calendar is enough day-0. | Use GHL calendar now, ServiceM8 later. | KEEP |
| 13. Job Complete | Work finished, aftercare begins. | Needed before final invoice/review/warranty. | Manual update may be forgotten. | Founder marks complete; require after photos. | KEEP |
| 14. Job Invoiced | Final balance requested. | Financial visibility. | Stripe may make this feel redundant. | Keep because “done” is not “paid.” | KEEP |
| 15. Job Paid | Final money received; job closed. | Revenue truth. | None. | Terminal state; warranty/manual review follow-up starts. | KEEP |

Contrarian view: 15 stages is not the problem. The problem is pretending all 15 are equally active. Jordan can run 15 because each stage has a job. For Allan/Marko, stages 3/4 are dormant, stage 9 is renamed in practice, and Slack/ageing rules stop the board becoming theatre.

## Q3: Cloudinary flow validation

Yes: **browser form uploads photos to Cloudinary first, receives `secure_url` + `public_id`, then POSTs JSON to GHL with those URLs as text/long-text fields.** That is cleaner than trying to force GHL File Upload fields.

Gotchas:
- Use **signed uploads** via a small backend/serverless signer if possible. Unsigned presets work, but Cloudinary warns that exposed preset names can be abused for third-party uploads.
- Store both `secure_url` and `public_id`; URL alone is not enough for deletion, moderation, folder cleanup, or migration.
- Strip/avoid EXIF GPS metadata. Bathroom photos are personal information in practice.
- Add upload retry + “photo upload failed, still submit lead” fallback. Losing the lead is worse than missing a photo.
- Cloudinary CORS/direct browser upload is supported, but authenticated uploads need a backend-generated signature; don’t expose the API secret.
- AU residency: assume overseas processing/storage unless the specific Cloudinary account contract says otherwise. Disclose Cloudinary and overseas disclosure in Privacy Policy.

## Q4: SMS template compliance per workflow

Baseline ACMA position: commercial SMS needs consent, sender identification, contact details, and easy unsubscribe; unsubscribe must work for at least 30 days and be honoured within 5 working days. ACMA also distinguishes service/appointment/payment messages from marketing, but if you add promotional content, treat it as commercial. Sender ID registration is now a **1 July 2026** regime; businesses were told to apply early before **15 May 2026**, so Allan should do it now, but “Dec 2025 breach from day one” is not the exact current ACMA framing.

- **W1 acknowledgement:** Mostly transactional. Compliant if consent is logged. Add phone/contact path if using alphanumeric sender. Copy is fine.
- **W2 abandoned quote:** Commercial-ish recovery message. Needs explicit form consent or very defensible inferred consent from starting the quote form. Jordan’s 4-5h timing validates Clifford’s 4h wait. Copy is fine, but “within the hour” must be operationally true.
- **W4 missed-call text-back:** Transactional/service response to their call. Low spam risk. Copy is fine; STOP is conservative.
- **W5 review request:** Higher risk because it promotes reputation, but acceptable with consent and unsubscribe. Jordan’s review quote says don’t overbuild this Phase 1. Make it manual founder follow-up first.
- **Spam-trigger risk:** Long messages + links + “Google review” + alphanumeric sender can be filtered. Use real AU mobile for two-way STOP/replies where possible; avoid link shorteners.

## Q5: Re-verdict on the 5 open questions

- **Q5a ServiceM8 timing:** Phase 2. Jordan uses ServiceM8 because he has 70+ techs. Allan/Marko at 1-2 jobs/week need fewer systems, not more. Keep Stage 9 as “ready/scheduled ops bucket,” then wire ServiceM8 after 5-10 closed jobs or first sub.
- **Q5b Sub stages:** Create stages 3/4, hide them by filtered view, no workflows Phase 1. Clifford is right.
- **Q5c Lead-score 30:** Slack **and** SMS to Allan. Jordan uses Slack heavily; the plan should stop treating Slack as optional. Use Slack for context, SMS for interrupt.
- **Q5d GHL snapshot:** Build from scratch. Snapshot taxonomy will fight Jordan’s 15-stage model, AU consent, Cloudinary URLs, and Allan’s quoting logic.
- **Q5e Photo backend:** Cloudinary confirmed. Abandon GHL-native file upload as primary backend.

Slack wiring: the most credible MVP path is **GHL Workflow → Custom Webhook/Outbound Webhook → Slack incoming webhook**. HighLevel also has a Slack Premium Workflow Action, and Zapier/LeadConnector can bridge pipeline-stage events, but Zapier’s LeadConnector trigger surface is limited. Jordan’s AI-agent-to-Slack pattern suggests custom webhook/middleware, not a magical native GHL setup.

## Q6: Pre-first-quote must-haves

Must exist before Allan signs first quote:
- Privacy Policy on website and linked beside quote form consent.
- Quote form consent logs: timestamp, source URL, IP/user agent, exact consent copy version.
- Customer ToS/quote terms included in quote PDF/page: scope, exclusions, deposit, cancellation, access, photo use, warranty limits, ACL wording.
- Stripe metadata: `payment_type=deposit|final`, `contact_id`, `opportunity_id`, `quote_id`, `job_id`.
- Stripe webhook idempotency/logging so duplicate events don’t move stages twice.
- Cloudinary folder naming + deletion process + privacy disclosure.
- Sender ID / AU number readiness before automated SMS at scale.
- GA4 conversion event for full submit; partial event for abandoned quote; Google Ads enhanced conversion if consent allows.
- A manual fallback inbox: if GHL/Cloudinary fails, lead still lands at `quotes@`.

## Q7: Comparison with earlier plan

I read [QUOTE-FORM-GHL-MIGRATION-PLAN.md](/Users/excluding/codex-peer-workspace/master-repo/docs/QUOTE-FORM-GHL-MIGRATION-PLAN.md:1). Clifford built on it, but also drifted.

Kept correctly:
- GHL as CRM/nurture hub.
- ServiceM8 as ops layer later.
- BigQuery as eventual data brain.
- GA4 conversion tracking.
- Privacy/PII concern.
- Need to protect form speed and avoid heavy embedded GHL iframe.

Abandoned or underweighted and should restore:
- **Rollback/failure mode.** Old plan explicitly asks what happens if GHL is down. New plan needs this.
- **Performance.** The old plan was right to avoid iframe bloat. Custom React form + webhooks should stay.
- **Accessibility.** Keep labels/errors intact when adding consent/photo upload.
- **BigQuery.** Fine to defer, but don’t forget Jordan’s “own the data” point. At minimum keep webhook logs now.
- **Photo upload realism.** Old plan flagged GHL photo limitations; Cloudinary now solves it.

## Q8: Scale break points

- **33 jobs/month:** Architecture handles it if Slack noise is controlled and Allan/Marko actually move stages daily.
- **100 jobs/month:** Need ServiceM8 live, job assignment rules, standard quote templates, Stripe/Xero reconciliation, and someone owning pipeline hygiene.
- **400 jobs/month / $1M run-rate at $2.5k avg:** Need subs, ServiceM8 as source for field ops, BigQuery/Looker or Slack weekly analyst, QA photo review, formal complaints/warranty process, and role-based ownership. GHL alone becomes too opaque.
- **Single first thing that breaks with 50 leads in one day:** Human quote review, not the tech. Cloudinary/GHL can ingest; Allan/Marko cannot triage, inspect photos, price, and respond within SLA unless lead scoring + Slack hot-lead interrupt + quote templates are already working.

## TOP 3 ADDITIONS to Clifford's revised plan

1. Replace “native Slack integration” with explicit paths: **GHL Premium Slack Action** or **GHL Custom Webhook → Slack incoming webhook**. For day-0, webhook is simplest and least ambiguous.
2. Change photo plan to **Cloudinary signed upload → GHL URL fields**, with `public_id`, retry, folder cleanup, and privacy disclosure.
3. Downgrade automated NPS/review workflow to Phase 2. Jordan’s own quote says execution and fast communication matter more than review automation.

## Where I might be wrong

- HighLevel’s Slack Premium Action may be available cheaply enough that direct webhooks are unnecessary, but I would still document payload/channel routing explicitly.
- Cloudinary regional/data-residency options depend on Allan’s actual Cloudinary account/plan; verify before promising anything in the Privacy Policy.
- Some SMS messages may be treated as transactional rather than commercial, but ACMA enforcement risk rises the moment links, review asks, offers, or reactivation language appears.

Sources: HighLevel webhooks and Slack action docs; Zapier LeadConnector docs; Slack incoming webhook docs; ACMA Spam Act/Sender ID pages; Cloudinary upload/security/CORS docs; Stripe metadata docs.
