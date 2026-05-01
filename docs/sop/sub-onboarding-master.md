# SOP: Subcontractor Onboarding — Master Orchestration

**Purpose:** Single end-to-end flow tying together every SOP, spec, tool, document, and decision gate for getting a high-quality NSW subcontractor from "first contact" to "fully operational." Designed for Marko + Allan to execute reliably + repeatably.

**Owner:** Marko (executes); CEO designs + signs off + handles edge cases.

**Status:** Master orchestration ✅ built 2026-05-01 PM. References all component SOPs/specs.

**3-lens audit verdict:**
- **Domain** ([expert-trades-ops-contractor](../roles/expert-trades-ops-contractor.md)): 🟢 Ties together all components + adds missing competitor-derived elements
- **Adversarial — Fair Work** ([auditor-fair-work](../roles/auditor-fair-work.md)): 🟢 Sham-contracting protections enforced at every stage
- **Adversarial — Operational** ([auditor-general-operational](../roles/auditor-general-operational.md)): 🟢 Each stage has owner, deliverable, decision gate

---

## The journey at a glance

```
Stage 0: SOURCING         Find candidate → outreach            (Marko, ~1-3 days/subcontractor)
   ↓
Stage 1: PRE-VETTING      First-call screen                   (Marko, 30 min)
   ↓ (qualified)
Stage 2: DOCUMENT VET     10 mandatory documents              (Marko, 2-3 days for subcontractor to compile)
   ↓ (all pass)
Stage 3: INTERVIEW        Phone/video, 30 min                 (Marko, 30 min + 30 min note-taking)
   ↓ (interview pass)
Stage 4: PAID TRIAL JOB   Real customer job, we inspect       (Marko + subcontractor, 1-3 days)
   ↓ (rubric ≥80%)
Stage 5: AGREEMENT        Sprintlaw-drafted, DocuSign         (Marko, 30 min)
   ↓ (signed)
Stage 6: SYSTEM SETUP     SM8, Slack, Xero, payment           (Marko, 1 hour)
   ↓
Stage 7: BRIEFINGS        6 critical-clause walkthroughs      (Marko, 1.5 hours)
   ↓
Stage 8: FIRST REAL JOB   Monitored, full inspection          (Marko + subcontractor, 1-2 days)
   ↓ (consistent quality)
Stage 9: TIER ASSIGNED    Live in roster (Tier 2 default)     (CEO confirms)
   ↓
ONGOING:
  - Spot-checks (~1 in 10 jobs)
  - Monthly tier review
  - Quarterly performance call
  - Annual insurance + cert refresh
```

**Total time end-to-end:** ~2-3 weeks per subcontractor from sourcing to fully live.

**Total CEO + Marko time invested per subcontractor:** ~12-16 hours (including trial + first-job inspections).

**Trial budget per subcontractor category:** ~$1,200-1,800 (cheap insurance vs $10K+ in callbacks/refunds from a bad subcontractor).

---

## Stage-by-stage flow

### Stage 0 — Sourcing candidates

**Owner:** Marko

**Channels** (use multiple; per Override 8 NO paid recruitment ads until Month 3):

#### Free / low-cost (use first)
| Channel | How to use |
|---|---|
| **Marko's existing network** | Direct DM/call to known subcontractors. Highest hit rate (warm referrals). |
| **Bert/AUSTRS contacts** | Bert won't share his customer subcontractors (they're our competition) but he's heard of others — ask. |
| **Hipages** ([hipages.com.au](https://hipages.com.au)) | Search "bathroom resurfacing Sydney" + "shower regrouting Sydney" + nearby suburbs. Message every active operator with our agency pitch. |
| **Airtasker** | Same as Hipages but for individual operators. Lower-tier on average. |
| **Facebook trades groups** | Sydney Tradies, NSW Tiles & Bathroom Renovations, Australian Tradies Network. Post once: "Looking for experienced bathroom resurfacing/regrouting techs in Sydney. Pre-quoted, pre-confirmed jobs. Payment within 7 business days. DM me." |
| **TAFE NSW** | Contact Cert III Surface Preparation & Coating Application coordinators — recent graduates looking for work pipeline. |
| **LinkedIn** | Search "bathroom resurfacing Sydney" + "tile regrouting" — established operators with own businesses. |
| **Whirlpool / Renovate Forum** | Post in trades-services threads. AU-specific community. |
| **Competitor audits** | Per Jordan Video 33: ongoing weekly competitor research. Some may have subcontractors we can recruit. |

#### Paid (defer to Month 3+ per Override 8)
| Channel | How |
|---|---|
| Meta ad ($7-15/day) | Target NSW + interests bathroom renovation, tiling. Link to GHL recruitment form. |
| Hipages premium | Direct lead acquisition. Defer until volume justifies. |

**Outreach message template** (Marko adapts to channel):

> Hi [Name], I run a bathroom resurfacing & regrouting agency in Sydney with my partner Allan. We coordinate jobs — customer comms, quoting, dispatch, photos, payment — and dispatch to vetted subcontractors. Your role: turn up, do the work, get paid within 7 business days (we use pay.com.au). Pre-quoted jobs, no admin on your end. Looking for experienced regrout/resurface operators with own ABN, $10M PL, and a portfolio. 10-min chat to see if it fits?

**Track in:** Google Sheet `Subcontractors/Pipeline` columns: Name | Source | First Contact Date | Status (Replied / In Conversation / Sent Brief / Vetting / Trial / Onboarding / Live / Declined) | Notes.

---

### Stage 1 — Pre-vetting (first call screen, 30 min)

**Owner:** Marko (CEO sign-off if borderline)

**Goal:** weed out tyre-kickers and obvious red flags BEFORE asking them for documents (saves both sides time).

**5 quick-screen questions:**
1. How long doing bathroom regrouting/resurfacing? *(Need ≥1 year full-time)*
2. Got your own ABN + own tools/vehicle? *(Both yes mandatory)*
3. Got current $10M Public Liability insurance? *(Mandatory)*
4. Doing work for any other companies/clients? *(YES required for sham-contracting protection)*
5. Comfortable with photo documentation + cure-time advice to customer? *(Both yes)*

**Pass criteria:** 5/5 yes = proceed to Stage 2 vetting. Any no on 1, 2, 3 → don't proceed (saves them prepping documents we won't accept).

---

### Stage 2 — Document vetting (10 mandatory items)

**Owner:** Marko

**Reference SOP:** [sub-vetting-checklist.md](sub-vetting-checklist.md)

**10 documents to collect** (per checklist Phase 1):

| # | Document | What we verify | Storage |
|---|---|---|---|
| 1 | ABN | Active on [ABR Lookup](https://abr.business.gov.au) in their name | `Subcontractors/{Name}/Documents/ABN-Verification.pdf` |
| 2 | GST status | Above $75K threshold = registered | Same |
| 3 | **PL Insurance Certificate of Currency ($10M)** | Current, covers bathroom resurfacing/regrouting | `Subcontractors/{Name}/Documents/PL-Cert-{date}.pdf` |
| 4 | Personal accident / income protection | Recommended (sole traders need this themselves) | `Subcontractors/{Name}/Documents/PersonalAccident-{date}.pdf` |
| 5 | Workers comp (if employees) | Via [iCare NSW](https://icare.nsw.gov.au) if applicable | `Subcontractors/{Name}/Documents/WC-Cert-{date}.pdf` |
| 6 | NSW Subcontractor's Statement template | Subcontractor will use this with every payment per s175B WCA 1987 | `Subcontractors/{Name}/Documents/Statement-Template-Acknowledged.pdf` |
| 7 | Australian driver's licence / passport | Confirms identity matches ABN | `Subcontractors/{Name}/Documents/ID-{lastname}.pdf` |
| 8 | Asbestos awareness training cert | SafeWork NSW free online course | `Subcontractors/{Name}/Documents/Asbestos-Awareness-{date}.pdf` |
| 9 | Portfolio (5-10 before/after photos) | Real bathroom resurfacing/regrouting work | `Subcontractors/{Name}/Documents/Portfolio.zip` |
| 10 | References (2-3, with phone numbers) | We CALL them | `Subcontractors/{Name}/Documents/References.pdf` |

**Plus 1 conditional:**
- 11 (conditional) **Safe Work Method Statement (SWMS)** for high-risk construction work per NSW WHS Reg 2017 § 297-299. Required if any pre-1990 ACM jobs OR work-at-heights OR confined-space jobs.

**Reference call template** (we ask these of subcontractor's references):
1. "How long did [Subcontractor Name] work for/with you?"
2. "What was the work like — quality?"
3. "Any callbacks or rework needed?"
4. "Did they show up on time?"
5. "Did they leave the property clean?"
6. "How was the customer interaction?"
7. "Any disputes, complaints, NCAT/Fair Trading involvement?"
8. "Would you use them again? Why or why not?"
9. "Anything I should know before engaging them?"

Document reference call notes: `Subcontractors/{Name}/Documents/Reference-Call-Notes.md`

**Decision gate:**
- All 10 mandatory pass + references positive → Stage 3 (interview)
- Any mandatory fail → STOP, polite decline, document why
- 🟠 flags (e.g., short trade history) → CEO judgement call

---

### Stage 3 — Interview (phone/video, 30 min)

**Owner:** Marko (record notes for CEO review on borderline candidates)

**Reference SOP:** [sub-vetting-checklist.md § Phase 2](sub-vetting-checklist.md#phase-2-interview-phone-or-video-30-min)

**10 interview questions** with good-answer / red-flag examples in the SOP.

**Cultural fit assessment** (CEO-added to original draft):
- How do they speak? Professional? Will they represent our brand to customers?
- What's their language about previous customers? Respectful or dismissive?
- Are they curious about our process, or just want jobs?
- Do they ask sensible questions about the agreement, payment terms, dispute resolution?
- Red flag: anyone who says "I just need work, whatever you want me to do" — this is a sham contracting setup AND signals they don't care about quality.

**Capacity planning** (added):
- "How many jobs per week can you realistically take given your other clients?"
- "What's your typical lead time when accepting a new job?"
- "Any periods you'll be unavailable in next 3 months?" (validates capacity planning)

**Decision gate:**
- Pass interview + answers solid + cultural fit good → Stage 4 (paid trial)
- Borderline → CEO reviews notes, may schedule a 2nd shorter interview
- Fail → polite decline

---

### Stage 4 — Paid trial job (real customer job, we inspect)

**Owner:** Marko (inspector); subcontractor (executor); CEO (escalation if borderline)

**Reference SOP:** [sub-trial-job-protocol.md](sub-trial-job-protocol.md)

**Reference rubric:** [sub-quality-rubric.md](sub-quality-rubric.md)

7-step protocol covered in component SOP. Key gate: rubric score 80%+ = PASS. 60-79% = CONDITIONAL (1 more trial). <60% = FAIL.

**MUST PAY regardless of outcome.** Trial budget ~$400-600 per attempt × 1-2 attempts.

**Customer treatment:** Optionally offer 10-15% discount on trial customer's quote as goodwill (per CEO refinement) — turns customer into willing trial participant + protects brand.

**Decision gate:**
- PASS (80%+) → Stage 5 (sign agreement)
- CONDITIONAL → second trial; same protocol
- FAIL → pay them, decline politely, document why, move on

---

### Stage 5 — Agreement signing

**Owner:** Marko (sends DocuSign); CEO (reviews if any negotiation)

**Reference spec:** [sub-agreement-clauses.md](../specs/sub-agreement-clauses.md)

**Process:**
1. Sprintlaw-drafted agreement (~$200 one-off, reused per subcontractor) — see [sub-agreement-clauses.md](../specs/sub-agreement-clauses.md) for the brief
2. Marko sends to subcontractor via DocuSign with attached schedules:
   - Schedule A: Rate Schedule (per pricing Excel + travel zones + callout/cancellation fees)
   - Schedule B: Approved Materials List ([sub-materials-standard.md](sub-materials-standard.md))
   - Schedule C: Coverage Zones + Travel Allowances
3. Subcontractor reads + asks questions
4. Marko walks through 1-page plain-English briefing notes
5. Subcontractor signs, Marko signs, DocuSign distributes copies
6. Store: `Subcontractors/{Name}/Agreement-Signed.pdf` + Xero supplier record

**Negotiation handling:**
- If subcontractor asks for higher rate → "Our rate card is fixed and reviewed quarterly. If you accept current rates and prove out, you'll be considered for Tier 1 with rate adjustments." Don't negotiate per-sub at signing.
- If subcontractor asks shorter non-solicit period → CEO judgement (default 12 months is fair; 6 months might be acceptable for high-value subcontractor)
- If subcontractor objects to NSW Subcontractor Statement → educate them (s175B is law, not our preference)

**Decision gate:**
- Signed → Stage 6 (system setup)
- Won't sign or wants major changes → CEO call; usually decline (red flag for sham contracting if they resist standard contract)

---

### Stage 6 — System access setup

**Owner:** Marko

**Reference SOP:** [sub-onboarding-checklist.md § Phase B + D](sub-onboarding-checklist.md)

**Tools to set up per subcontractor:**

| Tool | Action | Test |
|---|---|---|
| **ServiceM8** | Add as "Staff" member; subcontractor installs SM8 Lite app | Dispatch dummy job → subcontractor sees it on phone, can navigate, can submit photos |
| **Slack** | Add to `#sub-dispatch`, `#sub-quality`, `#sub-general` channels | Send test message → subcontractor receives + replies |
| **Xero** | Set up as supplier with bank details for EFT/pay.com.au routing | Dummy invoice payment test (low value, $10) |
| **Google Drive** | Sub-specific folder: `Subcontractors/{FullLegalName}/` | Confirm subcontractor can access shared folders if needed |
| **GHL** (when live) | Subcontractor appears in custom field dropdown for opportunity assignments | — |

**Insurance expiry reminders:**
- Calendar reminder 30 days + 7 days before PL renewal
- Calendar reminder 30 days before personal accident renewal
- Calendar reminder for asbestos cert renewal (annual)

**Decision gate:** All systems operational → Stage 7

---

### Stage 7 — Briefings (6 critical clause walkthroughs)

**Owner:** Marko delivers; CEO sits in if first time delivering

**Reference SOP:** [sub-onboarding-checklist.md § Phase E](sub-onboarding-checklist.md)

**6 mandatory briefings (~15 min each, 1.5 hours total):**

1. **Asbestos awareness** — pre-1990 properties, STOP-don't-disturb-call protocol
2. **Photo IP licence (Clause 20)** — all job photos owned by us; subcontractor doesn't post on own social
3. **Data + privacy (Clause 23)** — customer info confidential, not retained, not shared
4. **Variation / change orders (Clause 21)** — STOP, photo, notify, await approval before extra work
5. **Professional conduct (Clause 26)** — clean, on-time, no smoking/substances, restricted areas, pricing-redirect, no direct selling, leave clean
6. **Callout + cancellation (Clauses 28 + 32)** — $100 callout for customer-cancellations OR locked-out, $100 fee if subcontractor cancels <48hr, 3+ late cancels in 90 days = removal

Document each briefing date in `Subcontractors/{Name}/Briefings-Log.md`.

**Optional but recommended (CEO-added):**
- 7. **Subcontractor onboarding video** — pre-recorded 20-min walkthrough subcontractor watches BEFORE 1-on-1 briefings (saves Marko time when scaling). Record once, replay forever.

---

### Stage 8 — First real job (monitored)

**Owner:** Marko inspects; CEO reviews if borderline

Subcontractor's first dispatched real job post-trial. Marko inspects within 24hr using same rubric. Goal: confirm they perform consistently without "trial pressure."

**Customer feedback call** — same as trial.

**Decision gate:**
- Score ≥80% + customer happy → Stage 9 (live)
- Score 70-79% → coaching conversation, observe next 2-3 jobs closely
- Score <70% → escalate to CEO; may revoke onboarding

---

### Stage 9 — Tier assigned + live

**Owner:** CEO signs off; Marko documents

**Tier defaults:**
- New subcontractor starts at **Tier 2** unless trial + first job both 95%+ → Tier 1
- Tier 3 only if: brand new operator, less experienced, or recovering from prior issue

**Live in roster:**
- ServiceM8 tag updated: `tier_2` (or appropriate)
- Coverage tags + skill tags applied
- Subcontractor starts receiving real dispatched jobs

**Subcontractor onboarding sign-off** (Marko documents):

```
SUB ONBOARDED ✅
Name: ___________
Date: ___________
ABN: ___________
First job dispatched on: ___________
Tier assigned: Tier ___________
Marko sign-off: ___________
CEO acknowledgment: ___________
```

Stored: `Subcontractors/{Name}/Onboarding-Signoff.pdf`

---

## Ongoing — what happens after live

### Per-job
- Subcontractor completes job per dispatch (ServiceM8 workflow)
- Subcontractor uploads photos within job-day
- Marko reviews completion photos before customer sees (catches issues early)
- Customer NPS at 4hr post-completion
- Subcontractor paid within 3 business days of customer final payment cleared (per Clause 3 — 7 days max)

### Spot-checks (~1 in 10 jobs OR 1/month minimum per subcontractor)
- Marko visits site post-job, scores rubric
- Comparing to subcontractor's rolling 90-day average
- Documents any drift early

### Monthly tier review (1st of month)
- Per [OPERATING-CONTEXT § 9.5](../OPERATING-CONTEXT.md#95-subcontractor-tier-system) ageing rules
- Subcontractor's metrics: avg quality score, acceptance rate (% of offered jobs accepted), customer NPS contribution, time-to-complete vs estimate
- Tier movement:
  - Sustained 90%+ quality + 80%+ acceptance + 3+ months → Tier 1 promotion
  - Drop to <75% quality 2 months running → Tier 2 → Tier 3 demotion warning
  - Tier 3 with no improvement after 60 days → removal

### Quarterly performance call (1-on-1, ~30 min)
- Marko + subcontractor: discuss what's working, what's not, any adjustments needed
- Capacity planning: any change in availability?
- Insurance renewal status check
- Approved materials list updates if any
- Subcontractor's feedback on our process (we improve too)
- Document call notes: `Subcontractors/{Name}/Performance-Calls/{date}.md`

### Annual refresh
- PL Certificate of Currency renewal (sighted)
- Personal accident insurance renewal (sighted)
- Asbestos awareness cert renewal (sighted — annual SafeWork NSW)
- Workers comp renewal if applicable

### Subcontractor feedback survey (quarterly)
- Anonymous Google Form to all subcontractors
- 5 questions: pay timeliness, dispatch quality, customer issues, what's missing, what to improve
- CEO reviews + acts on patterns
- Per Jordan: "they're our partners, not just labour"

---

## Tools used end-to-end (consolidated)

| Tool | Stage(s) used | Purpose |
|---|---|---|
| **ABR Lookup** | Stage 2 | ABN verification |
| **iCare NSW** | Stage 2 | Workers comp verification |
| **SafeWork NSW** | Stage 2, ongoing | Asbestos training cert |
| **DocuSign** | Stage 5, ongoing | Agreement signing + amendments |
| **Sprintlaw** | One-off | Agreement template ($200) |
| **ServiceM8** | Stage 6 onwards | Job dispatch + photo upload + completion |
| **Slack** | Stage 6 onwards | Internal comms with subcontractors |
| **Google Drive** | All stages | Document storage per subcontractor |
| **Xero** | Stage 6 onwards | Supplier setup + payments + invoices |
| **pay.com.au** | Stage 6 onwards | Subcontractor payments via rewards card |
| **GHL** | When live | Subcontractor assignment to opportunities |
| **Calendar (Google/Apple)** | Stage 6 onwards | Insurance expiry reminders |
| **Hipages, Airtasker, Facebook, LinkedIn** | Stage 0 | Recruitment channels |
| **Whirlpool, Reddit, Renovate Forum** | Stage 0 + research | Industry community + failure-mode research |

---

## Documents collected per subcontractor (master list)

By end of onboarding, every subcontractor's folder `Subcontractors/{Name}/` contains:

```
Subcontractors/{LastName-FirstName}/
├── Documents/
│   ├── ABN-Verification.pdf
│   ├── PL-Cert-{date}.pdf
│   ├── PersonalAccident-{date}.pdf
│   ├── WC-Cert-{date}.pdf (if applicable)
│   ├── ID-{lastname}.pdf
│   ├── Asbestos-Awareness-{date}.pdf
│   ├── Portfolio.zip (5-10 before/afters)
│   ├── References.pdf
│   ├── Reference-Call-Notes.md
│   └── SWMS-Template-{date}.pdf (conditional)
├── Trials/
│   ├── Trial-1-{date}/
│   │   ├── Customer-Brief.pdf
│   │   ├── Sub-Photos.zip
│   │   ├── Inspection-Photos.zip
│   │   ├── Rubric-Score.pdf
│   │   └── Customer-Feedback-Notes.md
│   └── Trial-2-{date}/ (if applicable)
├── Agreement-Signed.pdf
├── Briefings-Log.md
├── Onboarding-Signoff.pdf
├── Performance-Calls/
│   ├── 2026-Q3.md
│   └── ...
└── Statements/
    ├── 2026-05-14-Statement.pdf
    ├── 2026-05-21-Statement.pdf
    └── ... (collected with EVERY payment per s175B WCA 1987)
```

**Retention**: 7 years per ATO + Fair Work record-keeping requirements.

---

## Quality assurance philosophy

> *"This is a tool, not a punishment. Subcontractors deserve clear standards before they're held to them. We share our quality rubric with subcontractors at onboarding so they know exactly how they'll be measured."* — [sub-quality-rubric.md](sub-quality-rubric.md)

Good subcontractors welcome standards. Bad subcontractors resist measurement. Our system is a self-selection mechanism.

---

## Common failure modes (per Rule 11 — what NOT to do)

Researched from NCAT decisions, AU/UK trade forum complaints, ACCC enforcement, Reddit AUTrades:

| Failure mode | Mitigation in our system |
|---|---|
| Subcontractor poaches customer for direct work | Non-solicit clause + customer comms always through us + Subcontractor doesn't have customer's phone/email pre-job |
| Subcontractor does 1 great trial then declines in quality | Spot-check ~1/10 jobs + monthly tier review catches drift early |
| Subcontractor uses cheap consumer-grade materials → finish fails | Approved Materials list + photo verification + subcontractor bears rectification cost (Clause 4) |
| Subcontractor injures self → claims against us | Personal accident insurance requirement + Clause 1 independent contractor status + insurance renewal reminders |
| Subcontractor disturbs asbestos in pre-1990 job | Asbestos awareness cert mandatory + Clause 19 stop-work protocol + immediate-termination consequence |
| Subcontractor no-shows day 2 of bath resurface | Clause 31 multi-day commitment + payment is single flat rate (not per-day) |
| Subcontractor solicits other subcontractors from our network | Confidentiality + non-solicit clauses |
| Subcontractor discovers our pricing → demands more | Clause 10 pricing prohibition + redirect script "all pricing through office" |
| Subcontractor at unsafe site (water damage, electrical) | Mutual indemnity Clause 25 protects subcontractor + Clause 21 stop-and-notify |
| Customer-sub direct sale around us | Non-solicit + subcontractor doesn't carry business cards on jobs (Clause 9) |
| Subcontractor claims "we directed how to work" → sham contracting tribunal | Stage 4 explicit "we don't supervise" + Clause 1 + subcontractor uses own tools/materials |
| Insurance lapse mid-engagement | Annual renewal reminders + auto-stand-down policy |
| Disputes over scope mid-job | Clause 21 variation process + photo-to-reality clause 30 |
| Subcontractor takes a customer's photos and posts on their socials | Clause 20 photo IP licence + briefing |

---

## What competitors / agencies do that we DO

| Agency practice | What we do |
|---|---|
| Single-page subcontractor agreement (low-friction) | We have 32 clauses but Sprintlaw + 1-page summary for subcontractors |
| Multi-day onboarding bootcamp | We deliver 6 briefings 1-on-1 over 1-2 weeks (more digestible) |
| Subcontractor portal with payment history | ServiceM8 + Xero subcontractor portal access (built into tools) |
| Tier-based dispatch | Tier 1/2/3 with clear progression criteria (per OPERATING-CONTEXT § 9.5) |
| Quality scoring rubric | Our 100-point rubric matches industry-best |
| Reference checks | We call all references, document responses |
| Trial job pre-engagement | We require it; pay for it; rubric-score it |
| Asbestos training requirement | Mandatory + cert sighted |
| Insurance verification with renewals | Calendar reminders 30/7 days |
| NSW Subcontractor Statement collection | Mandatory every payment per s175B (many agencies skip this — exposes them) |

## What competitors / agencies do that we DON'T (yet)

Decisions to make:

| Practice | Decision (CEO) |
|---|---|
| Subcontractor equipment lending program (premium subcontractors) | DEFER. Until we have $50K+ buffer. |
| Subcontractor recruitment ad spend | DEFER per Override 8 until Month 3 |
| Subcontractor bonuses for retention | DEFER. Once we have 5+ subcontractors, design quarterly perfect-attendance bonus |
| Subcontractor onboarding video (pre-recorded walkthrough) | BUILD when 3+ subcontractors onboarded (saves Marko time on briefings 7-12) |
| Subcontractor portal (custom dashboard) | DEFER — ServiceM8 + Slack covers most. Phase 6+. |
| In-house training program | NEVER per Override 12 — we recruit pre-trained. Don't train. |
| Multi-state expansion of subcontractor roster | Phase 7 (year 1+) |

---

## Subcontractor onboarding KPIs (CEO tracks)

| KPI | Target | Source |
|---|---|---|
| Time from first contact to "live" | <3 weeks | Marko's pipeline sheet |
| Trial pass rate | 60%+ | Subcontractor records |
| Subcontractor retention at 6 months | 80%+ | Subcontractor records |
| Avg subcontractor tenure | 18+ months | Subcontractor records |
| Sub-quality score (rolling 90 days) | 85%+ across all active subcontractors | Subcontractor records |
| Subcontractor pay-on-time rate (within 7 business days) | 100% | Xero |
| % subcontractors with current PL insurance | 100% | Subcontractor records |
| % subcontractors with current asbestos training | 100% | Subcontractor records |

---

## When CEO escalation needed

Marko escalates to CEO for:
- Borderline trial result (60-79% rubric)
- Subcontractor negotiating non-standard agreement terms
- Subcontractor failing first real job (revoke onboarding?)
- Insurance lapse + subcontractor doesn't immediately renew
- Customer complaint linked to subcontractor behavior (not just quality)
- Sham contracting flag (subcontractor shows employee-like patterns)
- Tier downgrade or removal decision

---

## References (component SOPs + specs)

### Pre-live (sourcing → first job)
| Component | What it covers |
|---|---|
| [sub-recruitment-channels.md](sub-recruitment-channels.md) | Stage 0 — 8 channels for finding subcontractors + compliance language |
| [recruitment-ads.md](../templates/recruitment-ads.md) | Stage 0 — ad copy templates per channel |
| [sub-vetting-checklist.md](sub-vetting-checklist.md) | Stages 1-3 documents + interview |
| [sub-trial-job-protocol.md](sub-trial-job-protocol.md) | Stage 4 paid trial protocol |
| [sub-quality-rubric.md](sub-quality-rubric.md) | Stage 4 + 8 + ongoing scoring |
| [sub-agreement-clauses.md](../specs/sub-agreement-clauses.md) | Stage 5 contract Sprintlaw brief |
| [sub-onboarding-checklist.md](sub-onboarding-checklist.md) | Stages 5-8 detailed steps |
| [sub-materials-standard.md](sub-materials-standard.md) | Approved materials referenced in agreement Schedule B |
| [sub-rate-schedule.md](../specs/sub-rate-schedule.md) | Stage 5 rate schedule attached to agreement (Clause 15) |
| [customer-aftercare-cards.md](../templates/customer-aftercare-cards.md) | Stage 7 — subcontractor leaves with every customer |

### Live (ongoing operations)
| Component | What it covers |
|---|---|
| [sub-ongoing-quality-monitoring.md](sub-ongoing-quality-monitoring.md) | 9 monitoring systems post-onboarding (NPS, photo review, inspections, callbacks, scorecard, insurance, offboarding) |
| [sub-risk-scenarios-playbook.md](sub-risk-scenarios-playbook.md) | 28 scenarios + action SOP for each |
| [sub-sham-contracting-protections.md](sub-sham-contracting-protections.md) | 9-indicator Fair Work compliance + super test |
| [sub-tax-compliance.md](sub-tax-compliance.md) | TPAR + super + portable long service leave |
| [sub-sopa-protections.md](sub-sopa-protections.md) | NSW Security of Payment Act 1999 |

### Lenses + identity
| Component | What it covers |
|---|---|
| [auditor-fair-work.md](../roles/auditor-fair-work.md) | Sham contracting protection lens applied throughout |
| [auditor-compliance-aus.md](../roles/auditor-compliance-aus.md) | NSW law compliance lens (s175B, SOPA, WHS, ACL) |
| [auditor-customer-fairness.md](../roles/auditor-customer-fairness.md) | Customer-side fairness lens (warranty wording, dispatch reliability) |
| [auditor-margin-per-job.md](../roles/auditor-margin-per-job.md) | Rate setting + margin floor enforcement |
| [auditor-general-operational.md](../roles/auditor-general-operational.md) | Quarterly ops audit lens |
| [expert-trades-ops-contractor.md](../roles/expert-trades-ops-contractor.md) | Domain expertise lens |
| [OPERATING-CONTEXT § 9.5 + 9.6](../OPERATING-CONTEXT.md) | Tier system + agreement essentials |

---

## Maintenance

Quarterly CEO review:
- [ ] Component SOPs still reflect current law/practice?
- [ ] Tools still appropriate (ServiceM8, Xero, Slack)?
- [ ] Insurance minimums still industry standard ($10M PL)?
- [ ] Any new failure modes from trade forums to add to mitigation list?
- [ ] Any new competitor practices to consider adopting?

Annually:
- [ ] Sprintlaw agreement re-review (NSW law changes)
- [ ] All subcontractor PL renewals + asbestos cert renewals
- [ ] Subcontractor feedback survey results acted upon
