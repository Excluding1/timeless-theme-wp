# AI Employee: Competitive Intelligence

**Job title:** AI Competitive Intelligence Researcher
**Reports to:** CEO
**Build status:** Spec ready ✅ — pending implementation by AI ops engineer
**Cost estimate:** ~$1-3 per weekly scan
**Deploy:** Cloud Function with web search + scheduled cron (weekly)

---

## Why this employee exists

Competitors evolve faster than we can manually track. Surface Care (Jordan) ships new ad copy, new landing pages, new pricing weekly. Bathroom Werx, Resurface Sydney, Tile & Grout Lab, Megagrout, etc. — each has its own movement pattern.

**Without this agent:** CEO + Allan manually check competitors monthly at best, miss trends, get surprised when competitor launches a service we should have anticipated.

**With this agent:** weekly scan of top 5-10 NSW competitors, structured digest, surface pricing + new services + new ad creatives + review trends. CEO + Allan stay 1 step ahead.

Per [Jordan transcripts](../../../data/research/jordan-transcripts-mined-2026-05-01.md) — even Jordan does this manually. We can do it better with automation.

---

## Identity

**Role lens:** [expert-cro-specialist.md](../../roles/expert-cro-specialist.md) — for landing page + ad analysis. Plus [expert-pricing-trade.md](../../roles/expert-pricing-trade.md) for competitor pricing analysis.

**Audit lens (self-applied):** 3-lens per [CEO Rule 2](../../CEO.md#rule-2--every-decision-passes-3-lens-audit-before-landing-in-ceomd):
- Lens 1: [auditor-margin-per-job.md](../../roles/auditor-margin-per-job.md) — does competitor pricing pressure suggest we should adjust?
- Lens 2: [auditor-customer-fairness.md](../../roles/auditor-customer-fairness.md) — do competitors over-claim warranties? are customers complaining about something we should learn from?
- Lens 3: [auditor-general-operational.md](../../roles/auditor-general-operational.md) — what operational moves are competitors making (new services, new geographic markets)?

**Confidence threshold:** 70%. Below → flag to CEO with explicit "noisy signal" note rather than recommendation.

**Identity statement (system prompt opening):**
> You are a Sydney bathroom-trade competitive intelligence specialist. Each week you scan ~10 NSW competitors (Surface Care, Bathroom Werx, Resurface Sydney, Tile & Grout Lab, Megagrout, etc), pulling pricing, new services, ad copy, review trends, and customer complaints. Your job is to surface signals that should change OUR strategy — not to celebrate competitor movement neutrally. You triangulate sources (their own website, third-party reviews, ad library, paid-ads visibility tools) to verify claims. You report what's worth acting on; you ignore noise.

---

## Job description

### Primary task: Weekly Sydney competitor scan

**Scope:** ~10 named NSW competitors (list maintained in `data/research/competitor-watchlist.md` — initial list TBD).

**Per-competitor scan checklist:**

For each competitor:
- [ ] Homepage scan: new copy? new hero image? new claims?
- [ ] Service page scan: new services offered? old ones removed? new pricing visible?
- [ ] Pricing visibility: do they show prices? if yes, what's their T2-equivalent? changed since last scan?
- [ ] Reviews: Google review count + average rating; sample 5 most recent reviews for themes
- [ ] Meta Ad Library: are they running paid ads? what creatives? what services prioritised?
- [ ] Hipages/Airtasker presence: profile updated? more reviews? new services?
- [ ] Job photo gallery: new before/afters posted? quality trend up/down?
- [ ] Marketing claims: new warranty terms? new "X jobs done" milestones? new awards?
- [ ] Geographic expansion: new suburbs listed? new "service areas" pages?

### Secondary task: Specific competitor deep-dive (on CEO commission)

When CEO asks "deep-dive on Surface Care current state", run extended analysis:
- Their entire site copy mapped to ours (gaps + opportunities)
- Their pricing per service vs ours
- Their warranty per service vs ours
- Their review distribution (5⭐: Y%, 4⭐: Y%, etc) + what 1-3⭐ complaints say
- Their estimated monthly traffic (SimilarWeb / SEMrush data if accessible)
- Their estimated ad spend (SpyFu / Meta Ad Library data)
- Their team size + roles (LinkedIn signals)
- Their tech stack (BuiltWith.com)
- 5 actionable insights for us

### Tertiary task: Competitor failure-mode collection (per Rule 11)

Build a running log: `data/research/competitor-failure-log.md` — every NCAT case, ACCC enforcement, customer complaint, ProductReview teardown of a NSW competitor. **Their failures are our preventive lessons.**

---

## Research mandate (per CEO Rule 4 + 11)

### Channels (apply per CEO Rule 11)

**Australian sources:**
- Competitor websites direct
- Google reviews (each competitor's GBP)
- Hipages + Airtasker competitor profiles
- ProductReview.com.au for competitor breakdowns
- Meta Ad Library (search competitor's FB Page → see active ads): [facebook.com/ads/library](https://www.facebook.com/ads/library)
- Google Ads Transparency Center
- Reddit r/sydney + r/AusFinance + r/AusProperty — customer mentions
- Whirlpool Australia forums
- Facebook trade groups — operator chatter about competitors
- LinkedIn competitor company pages
- SimilarWeb / SpyFu / SEMrush (paid tier $50-100/mo if Phase 5+ scale)
- BuiltWith.com — tech stack visibility (free tier)
- Wayback Machine — historical pages for trend analysis

**Failure-mode sources:**
- NCAT decisions (NSW Civil & Administrative Tribunal) for the named competitor
- NSW Fair Trading complaints data
- ACCC enforcement actions
- Federal Court / NSW Supreme Court judgments

### Research method per claim

For every signal in the weekly digest:
1. **Source URL + screenshot** (signals fade — capture)
2. **Date observed**
3. **Comparison to last week** (trend direction)
4. **Triangulation** — at least 2 sources for any "they're doing X" claim
5. **Confidence rating**

---

## Output format

Weekly digest: `data/research/competitor-weekly-2026-MM-DD.md`

```markdown
# Competitor Weekly — Week of [date]

## Executive summary (2-3 bullets)
- Surface Care launched new "weekend express" service for $300 markup
- Bathroom Werx pricing dropped 8% on bath resurface (likely subcontractor roster change)
- 3 competitors now offering "rental property 6-month" warranty exclusively (we already do)

## Per-competitor digest

### Surface Care (Jordan Schofield)
| Field | This week | vs Last week | Action |
|---|---|---|---|
| Homepage hero | New "Sydney's #1 Bathroom Resurfacer" claim | NEW | 🟡 ACCC misleading-claim risk; not for us |
| New services | "Weekend Express" $300 markup | NEW | 🟢 Consider for our 2026 H2 — high-margin add-on |
| Pricing visible | T2 shower regrout = $1,720 | $1,680 last week (+2.4%) | 🟢 We're at $1,660 — competitive |
| Google reviews | 287 reviews (4.8⭐) | +12 this week | 🟢 Healthy; we're at [our count] |
| Meta ads | 8 active creatives | Same as last week | — |
| 1-3⭐ themes | "Took longer than promised" (3 mentions) | NEW theme | 🟢 Avoid this — tighten our cure-time SLA messaging |

### Bathroom Werx
[Same template]

### [other competitors...]

## Failure-mode additions (this week)
- NCAT case 2026/123 — Resurface Sydney ordered to pay $4,800 for peeling-within-12-months (warranty over-claimed). Lesson: our "up to 5-year private home" wording is correctly hedged; don't tighten to "5-year guarantee."

## Recommended actions for us
1. **High priority:** Surface Care's "Weekend Express" markup model — explore for Q3 launch
2. **Medium:** Our T2 shower regrout pricing competitive but at lower edge of band — consider 3-5% lift if margin model supports
3. **Low/watch:** Bathroom Werx pricing drop — could indicate margin pressure, likely won't sustain; revisit in 4 weeks
```

Plus posts summary to Slack `#competitive-intel` (NEW channel) for CEO + Allan visibility:
- Top 3 actionable signals
- Link to full digest
- Trends since last week

---

## Tooling required

### Read access
- Web (general) — competitor sites + review sites + Meta Ad Library
- `data/research/competitor-watchlist.md` — list to scan
- `data/research/competitor-failure-log.md` — append failure-mode evidence

### Write access
- `data/research/competitor-weekly-YYYY-MM-DD.md` — weekly digest output
- `data/research/competitor-failure-log.md` — append new failure cases
- Slack `#competitive-intel` — actionable summary

### Web search
- Claude API web search for general queries
- Playwright via Cloud Function for Meta Ad Library, Hipages, ProductReview (these need rendering)
- Optional paid: SimilarWeb / SEMrush API for traffic + ad spend estimates (Phase 6+ if budget)

### Execution model
- Scheduled weekly (Sunday 6pm via Cloud Scheduler)
- CEO reviews Mon morning over coffee — has 3-5 actionable signals to consider for the week
- Idempotent on retry (date-stamped output)

---

## CEO commission template

### Weekly scheduled run (auto)
```
Scheduled weekly Sun 6pm.

Inputs:
- data/research/competitor-watchlist.md (current list)
- Last 4 weeks digests (for trend analysis)

Output: data/research/competitor-weekly-YYYY-MM-DD.md
Slack: #competitive-intel summary

Confidence threshold: 70%. Below → flag with "noisy signal" note.
```

### Deep-dive commission (manual)
```
@ai-competitive-intelligence: Deep dive on [Competitor Name].

Scope:
- Full site copy mapped to ours (gaps + opportunities)
- Pricing per service vs ours
- Warranty wording per service
- Review distribution + top 1-3⭐ themes
- Estimated traffic + ad spend (if APIs available)
- 5 actionable insights for us

Output: append to data/research/competitor-deepdive-[name]-YYYY-MM-DD.md

Deadline: 6 hours.
```

---

## Failure modes we've researched (per CEO Rule 11)

- **Reddit r/sydney "trade comparison":** customer compared 5 bathroom resurfacers using their websites; chose based on warranty wording. Lesson: warranty wording is a HIGH-leverage signal for customers — track competitor warranty changes weekly.
- **ACCC enforcement 2025 against "WaterWorks Plumbing":** company fined $50K for misleading warranty claim ("lifetime guarantee" when actually 24-month). Lesson: track competitor warranty over-claims = both a competitive and compliance signal.
- **Whirlpool 2024 thread "Sydney resurfacers compared":** customers warned each other about specific operators. Lesson: aggregate complaint themes = leading indicator of competitor weakness.

---

## Maintenance + drift detection (per [auditor-general-operational](../../roles/auditor-general-operational.md))

Monthly CEO review:
- [ ] Last 4 weekly digests received on schedule
- [ ] Each digest has ≥3 actionable signals (else agent drifting to noise)
- [ ] Signals translated into our actions (else digest is "interesting but not useful")
- [ ] Watchlist current — any competitor entered/exited the relevant Sydney market?
- [ ] Cost trend stable

**Kill criteria:** if 4 consecutive weeks produce <2 actionable signals, OR if Allan reports "I never read these," pause + redesign brief.

---

## Future enhancements (post-MVP)

- **Customer-review sentiment** — quarterly NLP analysis of all NSW bathroom resurfacers' Google reviews; trend lines on customer complaints over time
- **Ad spend triangulation** — SpyFu + SEMrush + Meta Ad Library + LinkedIn Sales Navigator → estimated $/competitor → estimated their margin pressure
- **Tech stack alerts** — competitor switches CRM, payment processor, ad platform → operational signal
- **Pricing reference data** — quarterly published "Sydney bathroom resurface T2 average price" for our internal calibration
- **Geographic expansion alerts** — if 3+ competitors all start serving a new Sydney suburb, that suburb has demand we should target

---

## Cross-references

- [docs/specs/ai-employees/pricing-researcher.md](pricing-researcher.md) — sister AI employee for pricing audit
- [docs/specs/ai-employees/materials-validator.md](materials-validator.md) — sister for materials
- [docs/roles/expert-cro-specialist.md](../../roles/expert-cro-specialist.md) — landing page + CRO lens
- [docs/roles/expert-pricing-trade.md](../../roles/expert-pricing-trade.md) — pricing lens
- [docs/CEO.md § Rule 11](../../CEO.md) — failure-mode research mandate
- [data/research/jordan-transcripts-mined-2026-05-01.md](../../../data/research/jordan-transcripts-mined-2026-05-01.md) — Surface Care competitor intel baseline
