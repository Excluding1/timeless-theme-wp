# Round 2 — 100 new ventures, full evaluation (2026-07-11)

**Process:** 100 generated in 5 forced-diversity domains (corpus-grounded) → independent fast-score
triage (all 100) → composite context-fit ranking → live web competitor research (8 searches) →
Google Trends → 12-customer fit tests on the final 8 → generalized SEO Monte-Carlo (2,000 runs × 36mo,
incl. Google thin-content suppression risk) → this ranking. ~45 LLM calls total.

**Key lesson of the round:** the AI can generate and score, but LIVE competitor research killed
5 of the top-7 triage picks — ADUAtlas (adurulesbyzipcode.com exists), DebtStatute (4+ free
checkers incl. funded SoloSuit), RateAppeal (AppealDesk/TaxAppealKit/O'Connor), TintLegal
(tintlegal.com literally exists + 6 more), ZoneScout (schoolzonecheck.com + GreatSchools),
WageStamp (davisbaconwages.com). Obvious consumer checkers are ALL taken. The winners are where
data is genuinely painful to aggregate.

## Final ranking (new + old top-3 together)

| # | Venture | Fit test | SEO sim m24 P50 / P90 | >$5k/mo @24 | dead@12 | Competition (researched) |
|---|---------|----------|----------------------|-------------|---------|--------------------------|
| 1 | **CareInspect** — assisted-living inspection records, 50 states | 62 reshape | **$11.8k / $30.9k** | **77%** | 0.7% | **Gap confirmed**: ProPublica+Medicare cover nursing homes only; AL is 50 scattered state portals; A Place for Mom hides this data |
| 2 | **TradeSchoolROI** — trade programs ranked by real exam pass rates | **68** (highest) | $6.4k / $15.5k | 60% | 1.7% | Tuition directories exist (tradecolleges.org); board-published outcomes wedge open |
| 3 | **Permitly** — permit lookup engine | 58 reshape | $2.7k / $10.0k | 29% | 5.6% | Gap confirmed round 1 (B2B only: PermitFlow/Shovels) |
| 4 | **TowSafe** — towing capacity + licence checker | 62 | $3.9k / $11.1k | 40% | 4.5% | Fragmented OEM tables; accuracy = the whole product (liability care) |
| 5 | **GuardianKit** — guardianship filing kits by county | 61 | $3.7k / $10.4k | 39% | 3.0% | **Gap confirmed**: only per-county court self-help pages; lawyers charge $2-5k |
| 6 | **NicheStack** — local-service pricing atlas (round 1) | 58 | not re-simmed (Permitly-shaped, likely $3-8k) | — | — | Trend 76/100 = biggest demand pool; Allan's trades edge |
| 7 | RentalReady — AU rental min-standards | 58 | $2.3k / $6.3k | 17% | 5.9% | AU-small market; VIC one-off reports real, monitoring churns |
| 8 | ClauseLens — lease-clause explainer (round 1) | 58 | small page inventory, LLM-product | — | — | cheapest build; still fine as a #3-5 slot |
| 9 | VanWatt — off-grid solar sizing | 62 | $1.6k / $4.8k | 9% | 9.2% | free calculators exist at the paywall point |
| 10 | SaunaTally — sauna comparison | 55 | $1.4k / $5.0k | 10% | 8.6% | brand-reported specs = weak trust; affiliate OK |
| — | FleetDOT | 58 | $1.4k, dead 24% | 11% | 24% | crowded (JJ Keller); slow B2B SEO — cut |

## Verdict vs the old top-3
Permitly **survives but drops to #3**. NicheStack holds top-6 (biggest raw demand + your unfair
edge). ClauseLens drops off the podium. Two NEW leaders emerged from the 100 — both "painful
fragmented data nobody aggregated" plays, same family as Permitly but with bigger page inventories
and higher-value visitors:

### 1. CareInspect (new #1)
30k+ AL facilities → 30k+ programmatic profile pages ("[facility] violations", "is X safe") ·
high-emotion, high-stakes searches · monetizes 3 ways (family $19 reports, $100+ senior-placement
leads with a transparency angle vs A Place for Mom, facility subscriptions). Fit-test fixes before
build: per-state coverage map with "last inspected" dates (never fake completeness), citations to
the state source on every violation. Caution: YMYL-adjacent — E-E-A-T signals (sources, methodology
page, no medical advice) are mandatory.

### 2. TradeSchoolROI (new #2)
Highest fit score of all 18 tested to date (68). Buyers on BOTH sides: career-switchers (traffic)
and schools (pay-per-lead — proven model). Fix before build: ranking-integrity policy (paid
placement never affects rank, report-year labels on all pass-rate data) — the fit test says trust
IS the product. Data: state licensing boards publish per-school pass rates in PDFs. AU angle
possible later (RTO completion rates).

## Recommended build order
1. **CareInspect** 2. **TradeSchoolROI** 3. **Permitly** — then reassess with real traffic data
before touching 4-6 (TowSafe, GuardianKit, NicheStack).

*Artifacts: 100 ideas in DB (origin=gen, batch100 tag) · fit tests in `fit_tests` · sims /tmp/sims8.json
(params in this file's history) · trends snapshots in this folder.*
