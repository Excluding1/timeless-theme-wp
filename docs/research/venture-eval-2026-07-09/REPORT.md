# Venture Evaluation — the 10 Foundry candidates (2026-07-09)

**Process:** Foundry shortlist (corpus-mined from 18.5k ideas + real revenue data) → full PRD each →
🧪 Product-Fit Test each (fake PRD + 12 cast customers; 2 LLM calls) → Google Trends on each one's
head query → build-cost / Fable-5-buildability assessment (data-acquisition burden is the real cost;
every PRD's stack — Next.js + Supabase + Vercel — is fully AI-agent-buildable).

**Read this honestly:** every venture came back **RESHAPE** (none "build-as-is", none "skip"
except by trend). That's the test working — each has 1-2 named defects to fix in the PRD before
building. Fit scores cluster 41-63; separation comes from trend volume, data burden, and autonomy.

## Composite ranking

| # | Venture | Fit | Trend (head query) | Build cost / data burden | Autonomy | Verdict |
|---|---------|-----|--------------------|--------------------------|----------|---------|
| 1 | **Permitly** | 58 | **50/100 rising** ("building permit") | Medium — ingest municipal codes, start 20 metros × 15 projects, grow programmatically | High (content engine + pro tier) | **BUILD FIRST** |
| 2 | **NicheStack** | 58 | **76/100 rising** ("how much does it cost") — biggest volume of all 10 | Medium — pricing ranges from public data; **Allan's own trades business = unfair data + domain edge** | High | **BUILD #2** |
| 3 | **ClauseLens** | 58 | 19/100 rising fast (0.38) | **Lowest of all** — the LLM *is* the product; 50 states × ~30 clause types of programmatic pages | High | **BUILD #3** |
| 4 | GrantGraph | 58 | 33/100 rising | Medium — grants.gov API is free/public; foundations need crawling | Med-high | Bench |
| 5 | MenuMint | **63** | 31/100 rising fast (0.50) | Low tech, but GTM = restaurant-by-restaurant sales → **not hands-off**; dietary-tag liability | **Low** | Bench |
| 6 | ComplyCue | 58 | 19/100 rising | Heavy recurring monitoring infra per vertical | Med | Bench |
| 7 | DupeFinder | 44 | **67/100 rising** | Medium (beauty niche first); affiliate-native | High | Fix trust model first |
| 8 | TrialTrack | 47 | 15/100 rising | Low (clinicaltrials.gov free API) but YMYL = brutal for a new site + "qualified referral" objection | Med | Park |
| 9 | DisputeDesk | 41 | 39/100 rising | Low, but core value is replicable free in ChatGPT → weak moat | High | Park |
| 10 | SpecSniff | 44 | **3/100 FALLING** | Medium | Med | **Kill** |

## The top-3 build plan (what the fit tests say to fix)

### 1. Permitly — "do I need a permit for X in [city]?"
- Trend 50/100 and rising; perfect programmatic-SEO shape (project × city pages); AEO-friendly
  (AI assistants get asked this constantly and cite nothing authoritative).
- Paying segment found: DIY homeowners (deck/fence/shed, permit-anxious) + contractor pro tier.
- **Reshape before build:** kill the "depends — check with your local office" cop-out answers →
  confidence tiers citing the actual code section + one-click link/phone to the right office;
  answer decisively for the covered municipalities and say exactly which ones are covered.
- Start: 20 US metros × 15 common projects = 300 pages at launch, grow weekly.

### 2. NicheStack — local-service pricing atlas ("how much does X cost in [city]")
- Biggest search pool of all ten (76/100, evergreen, rising). Programmatic service × city pages.
- **Unfair advantage: Allan runs a real trades business** — real pricing intuition + T1/T2/T3 price
  architecture already exists; resurfacing/regrouting can be the seed vertical done credibly.
- Paying segment found: solo trade owner-operators (lead-gen / featured placement).
- **Reshape before build:** it's NOT a marketplace at launch (fit test's cold-start complaint) —
  launch as a pure pricing-content atlas with lead-capture; add tradie subscriptions only after traffic.

### 3. ClauseLens — lease-clause explainer
- Cheapest to build (no data corpus needed; LLM analysis + bounded programmatic pages
  state × clause). Trend base small (19) but rising fast; clear anxious-buyer intent.
- Paying segment found: first-time commercial tenants (retail/office build-outs).
- **Reshape before build:** scope to *explain + flag + negotiate-points* — NOT auto-redlining
  (the fit test's customers called the aggressive redlines unrealistic/dangerous); prominent
  not-legal-advice framing + "share with your lawyer" export as the pro feature.

## Portfolio note
Build in this order, 1-at-a-time to first organic signups (kill/scale criteria are in each PRD),
not all 10 at once. Expected shape stays power-law: these three are the best odds-adjusted shots,
the bench is a real second wave if a winner needs siblings, SpecSniff is dead (falling trend).

*Sources: fit tests in `docs/idea-lab` DB (`fit_tests` table, venture:1-10), PRDs in `ventures`
table (downloadable from the 🏭 Foundry tab), trends snapshot in this folder.*
