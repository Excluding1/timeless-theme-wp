# Subcontractor Lead Generator — Bathroom Resurfacing (Sydney / NSW)

**Goal:** Build a collated list of *independent / small* bathroom-surface refinishing contractors across Sydney & NSW that Timeless Resurfacing can recruit and onboard as subcontractors. Capture, per lead: **name, phone, email, website, ABN (if any), company/trading name (if any), services, whether they do the *correct* resurfacing, ratings, sole-trader signal, and "needs-more-jobs" / fair-price signals.**

Owner: internal (CEO). Not part of the WordPress theme — lives under `docs/` so it never ships in the deploy zip.

---

## 0. What counts as a real lead (scope lock)

### IN SCOPE — "correct" resurfacing (durable, looks like new, lasts years)
The trade we do and want to sub out. Durable **spray-applied 2-pack / polyurethane / epoxy** coatings, or grout renewal, usually with a **multi-year warranty**:

| Service | Also called | Our warranty benchmark |
|---|---|---|
| Bath / bathtub resurfacing | reglazing, re-enamelling, refinishing, respray, re-coating | up to 10 yrs / 5-yr warranty |
| Tile resurfacing (wall + floor) | tile reglazing, tile respray, tile refinishing, colour change | no-demo colour change |
| Vanity / benchtop resurfacing | respray, refinishing, benchtop coating | 900+ colours |
| Basin / sink resurfacing | chip repair + full resurface | porcelain/cast-iron/acrylic |
| Shower regrouting | regrout, epoxy regrout | 5-yr warranty |
| Shower sealing / silicone | re-silicone, leak fix | 12-mo |

### OUT OF SCOPE — the false-positive traps (must be filtered out)
The word "resurfacing" is heavily overloaded in Australia. **Reject / mark `out-of-scope`:**
- **Concrete / driveway / pool / garage-floor / spray-paver "resurfacing"** ← the single biggest false positive.
- **Wall / cement "rendering"** (Airtasker literally files it under "Rendering & Resurfacing").
- **DIY tile-paint sellers** (White Knight Tub & Tile tins, roller/brush kits) — that is *painting*, not resurfacing, and it does **not** last 5+ years.
- **Full bathroom renovation / demolition / tile-replacement builders** — unless they *also* explicitly offer refinishing.
- **Benchtop STONE / laminate replacement** (not a coating).
- **Auto / boat / bench-top epoxy-art** operators.

### Classification rubric (real vs fake)
**Strong "real resurfacing" signals:** words *reglazing, re-enamelling, resurfacing, respray, 2-pack, polyurethane, epoxy coating*; **warranty 3–10 yrs**; "cures overnight / next-day use"; surface prep ("acid etch", "sand", "chemical bond"); before/after gallery; names bath materials (cast iron, acrylic, fibreglass, enamel). 
**Weak / reject signals:** "tile paint", "DIY kit", "$xx tin", roller/brush, "we replace/renovate/demolish", generalist handyman, "concrete/driveway/pool/render".

### Sole-trader / "one person" signals (the target profile)
- ABR entity type = **Individual / Sole Trader** (authoritative — see §2).
- First-person copy ("I", "my", "owner-operator", "family-run", single personal name).
- **Personal mobile only**, no landline; gmail/hotmail/outlook email; **no ACN**; small/one-page site or no site.
- Low review count / recently-created Google Business Profile / few photos → **needs more jobs** (a warm recruit).

### Fair-price signals
Publishes low "from" pricing, "affordable/budget" branding, competitive Airtasker quotes, quotes fast. (Recorded when visible; most won't publish price.)

---

## 1. Method catalog — EVERY way to find them

Ranked roughly by yield-for-effort. ✅ = automated by our collector, ◐ = semi-auto (collector assists, human finishes), ✋ = manual/offline.

### A. Directories & marketplaces (names + ratings + often phone) — highest yield
| # | Source | What we get | Access |
|---|---|---|---|
| A1 | **Google Maps / Google Business Profiles** (map pack) | name, phone, website, rating, review count, area | ✅ search + fetch; richest phone source |
| A2 | **Airtasker** — `bath-resurfacing` category per region | tasker name, star rating, review count, completion count | ✅ category pages |
| A3 | **hipages** | business name, area, reviews | ◐ (bot-protected; search-indexed profiles) |
| A4 | **Oneflare** | name, rating, phone (some), suburb | ✅/◐ |
| A5 | **ServiceSeeking** | name, rating, quotes | ◐ |
| A6 | **Yellow Pages AU** (yellowpages.com.au) | name, phone, address, ABN sometimes | ✅ |
| A7 | **TrueLocal** | name, phone, reviews | ✅ |
| A8 | **Yelp Australia** | name, phone, reviews | ◐ |
| A9 | **Word of Mouth** (wordofmouth.com.au) | name, reviews, recommendations | ✅ |
| A10 | **ProductReview.com.au** | brand, reviews, Q&A | ✅ |
| A11 | Local Search (localsearch.com.au), StartLocal, Hotfrog, Cylex, dLook, Yalwa, Brownbook, PureLocal, AussieWeb, Fyple | name, phone, category | ✅ long-tail |
| A12 | **Houzz** | reno pros, photos, area | ◐ |
| A13 | Bing Places / Apple Maps | name, phone | ◐ |

### B. Government / registry data (authoritative ABN + sole-trader status)
| # | Source | What we get | Access |
|---|---|---|---|
| B1 | **ABR ABN Lookup** (abr.business.gov.au) | ABN, **entity type (Individual/Sole Trader vs Company)**, status, GST reg, state, trading names | ✅ name→ABN enrichment |
| B2 | **ABN Lookup Bulk Extract** (data.gov.au) | full national dataset; filter by state; no phone | ✋ big download, cross-ref only |
| B3 | **ASIC Connect** business/company name register | who holds a trading name | ◐ |
| B4 | NSW Fair Trading licence check | building/waterproofing licences (not required for resurfacing) | ✋ spot-check |

### C. Social & classifieds
| # | Source | What we get | Access |
|---|---|---|---|
| C1 | **Facebook** — business Pages | name, phone, reviews, area | ◐ public pages |
| C2 | Facebook **reno/tradie/suburb groups** ("Recommend a tradie Sydney", "Bathroom Renovations Australia") | word-of-mouth names, phones in comments | ✋/◐ |
| C3 | Facebook **Marketplace** services | listings + names | ✋ |
| C4 | **Instagram** business profiles + hashtags (#bathresurfacingsydney #reglazing #tileresurfacing) + geotags | handle, bio phone/website | ◐ |
| C5 | **Gumtree** → Services → Trades & construction | listing title, phone, name | ✅/◐ |
| C6 | **LinkedIn** company pages + people (title "resurfacing") | name, company | ◐ |
| C7 | **TikTok / YouTube** trade creators with contact in bio/description | handle, website | ✋ |
| C8 | Locanto / OZFreeAds / Nextdoor | listings | ✋ long-tail |

### D. Forums & community discussions (word-of-mouth mining)
| # | Source | What we get | Access |
|---|---|---|---|
| D1 | **Whirlpool** (whirlpool.net.au) home threads — "who resurfaced your bath in Sydney?" | recommended business names | ✅ search + fetch |
| D2 | **Reddit** — r/sydney, r/AusRenovation, r/DIYAustralia, r/AusPropertyChat | recommendations, warnings (who to avoid) | ✅ |
| D3 | **Renovate Forum** (renovateforum.com), Homeone, **Bunnings Workshop** | recommendations | ✅ |
| D4 | ProductReview Q&A / Google review threads | who people used | ◐ |

### E. Supply-chain / ecosystem (indirect, very high-signal)
Real resurfacers buy *specific* materials and often belong to networks. Mine the ecosystem:
| # | Source | Why | Access |
|---|---|---|---|
| E1 | **Franchise / network locator pages** — Bathroom Werx, Jim's Bathrooms & Resurfacing, Perfaced, Ultra-Glaze, Total Bathroom Resurfacing, Renu, Ecoglaze, etc. | each franchisee/operator = an owner-operator (recruit or note as competitor) | ✅ locator pages |
| E2 | **Coating / material distributors** (2-pack, polyurethane, tub-&-tile pro coatings, Luxapool, Trycol, Protec, Specialised Coatings) — "approved applicators"/trade lists | confirms they're real pros | ◐ |
| E3 | Resurfacing **training course** alumni/providers | new operators needing work | ✋ |
| E4 | HVLP / spray-equipment & abrasive suppliers | trade customers | ✋ |

### F. Search-footprint / OSINT techniques (creative — "even the ones we can't think of")
| # | Technique | How |
|---|---|---|
| F1 | **Google dorks** | `intext:"bath resurfacing" site:.com.au sydney`, `inurl:resurfacing sydney`, `"ABN" resurfacing sydney`, `"owner operator" (reglazing OR resurfacing) sydney`, `"0" (bath OR tile) resurfacing sydney phone` |
| F2 | **Competitor Google-Ads mining** | note "Sponsored" results = businesses actively spending → active operators |
| F3 | **Reviewer→business** | Google/ProductReview reviews name the operator ("thanks to *John* at…") |
| F4 | **Wayback Machine** | resurrect old directory listings & defunct-looking sites that still trade |
| F5 | **WHOIS on resurfacing domains** | registrant often a personal name for sole traders |
| F6 | **Reverse-image / logo search** | dedupe rebrands, find franchisee-of |
| F7 | **Common Crawl / web index** | bulk-find `.com.au` pages mentioning the trade (advanced) |

### G. Offline / real-world (the "impossible but" ideas)
| # | Idea | Notes |
|---|---|---|
| G1 | **Referral network** — ask plumbers, tilers, **strata & property managers, real-estate agents** who they use for turnarounds | highest-quality leads; they know the fair-priced reliable ones |
| G2 | Bunnings / Reece / tile-shop **trade-counter noticeboards** | photograph → OCR |
| G3 | **Vehicle signage / letterbox flyers** spotting (dashcam OCR) | the "impossible" one — feasible with phone photos + OCR |
| G4 | HIA / reno **trade expos**, home shows | badge-swap, business cards |

### G2. Terminology variants (people who don't call it "resurfacing")
Search ALL of these — many operators (esp. older/overseas-trained) use different words:
`bath enamelling / re-enamelling` · `bathtub refinishing` · `porcelain reglazing / re-porcelain` · `vitreous enamel repair` · `bath respray / spray a bath` · `bath relining / bath liner` · `ceramic restoration` · `enamel restoration` · `surface restoration` · `bath makeover (spray)` · `tub reglaze` · `sanitaryware refinishing` · `reglaze` · `re-coating bath`.

### G3. Multicultural / immigrant channels (the "did it back home" tier)
Bath **reglazing is a mainstream trade in the ex-USSR, China, Brazil, the Philippines, Korea & the Middle East** — migrants who did it overseas often advertise only in-community, in-language, invisible to English search. Mine:
- **Ethnic Facebook groups & classifieds** — "Russians/Ukrainians/Poles/Serbs/Brazilians/Filipinos/Chinese/Koreans/Arabic-speakers in Sydney" buy/sell/tradie groups.
- **In-language search terms** — RU/UA: `реставрация ванн Сидней`, `эмалировка ванны Сидней`, `наливная ванна`; PL: `renowacja wanny Sydney`; ZH: `浴缸翻新 悉尼`, `搪瓷修复`; PT: `restauração de banheira Sydney`; ES: `esmaltado de bañeras Sídney`; KO/VI/AR equivalents.
- **Community platforms** — WeChat / Xiaohongshu (小红书) / 悉尼同城, Sydney Today (今日悉尼), Nextdoor, Gumtree & FB Marketplace in other languages, ethnic newspapers (Единение, Puls Polonii, 1688).
- **ABR name-patterns** — sole-trader business names like "European Bath Resurfacing", "Euro Reglaze", personal-name + "reglazing/enamelling".

### G4. Creative / not-yet-standard channels (the "be creative" tier)
Untried nets to run after Maps-census + recommendation-threads:
- **LinkedIn** — individuals with "bath/tile resurfacing / reglazing / refinishing" in title, skills or *past experience* in NSW (strong for migrants who list it as a former overseas job).
- **Job ads** — Seek / Indeed / Jora / Gumtree Jobs for "bath resurfacing technician / reglazing applicator" → a company hiring = an active operator; a worker advertising = a recruitable tradesperson.
- **Bark.com** — lead-gen platform not in the earlier directory sweep.
- **Coating-supplier dealer/customer lists** — who buys the coatings: Hawk Research Labs, BC Coatings (BC100), Kott Koatings, Luxapool, Protec, Specialised Coatings — "authorised applicator / stockist NSW".
- **Google-Ads / competitor ad mining** — who's paying for "bath resurfacing sydney" ads (active spenders) via SpyFu/Ahrefs free snippets + "Sponsored" results.
- **WHOIS** on resurfacing .com.au domains → registrant name/phone (sole traders often use personal details).
- **Trade bodies / licences** — Master Painters, HIA/MBA member directories, NSW Fair Trading licence holders filtered for the trade.
- **Referral sources** (indirect) — strata & property managers, end-of-lease cleaners, real-estate agents who book resurfacers for turnarounds.
- **YouTube / TikTok** demo creators with a NSW contact in bio.

### H. Paid data (noted, not used — user chose free)
SEMrush/Ahrefs/SpyFu (ad mining), Apollo/Lusha/Clearbit (contact enrichment), purchased B2B trade lists. Cheapest high-quality shortcut if budget opens up later.

---

## 2. How the automated collector works

Pipeline (see `scripts/` + the workflow runs):

1. **Discovery (fan-out).** ~20 parallel agents each own a *(source × query-set)* slice (service-term sweeps, region sweeps, platform sweeps, forum sweeps). Each runs `WebSearch` + `WebFetch`, absorbs the noise, and returns clean lightweight candidates: `{business_name, url/profile_url, phone?, source_platform, rating?, review_count?, services_seen, real_resurfacing_signal, sole_trader_signal, evidence, source_url}`.
2. **Dedup / merge (barrier).** Collapse candidates by normalised phone → domain → business-name → ABN. Keep the richest merged record + all `source_urls`.
3. **Enrichment (pipeline, per unique business).** Fetch the business website/profile → pull **phone(s), email, ABN/ACN, full service list, warranty years, method (spray/2-pack = real; roller/DIY = fake), suburbs served, sole-trader copy signals**. Then **ABR lookup by name/ABN** → entity type (Individual vs Company), status, GST, registration date.
4. **Classify + score.** `is_real_resurfacing`, `is_sole_trader`, `needs_more_jobs`, `fair_price` → a 0–100 recruit-priority score.
5. **Output.** Deduped, scored table → `data/leads.csv` + `data/leads.xlsx` + a ranked markdown shortlist.

### Recruit-priority score (0–100)
- Real resurfacing verified (+40) · sole-trader / owner-operator (+20) · reachable phone (+15) · has ABN (+5) · rating ≥ 4.5 (+10) · "needs more jobs" (low reviews / new / gaps) (+5) · fair-price signal (+5). Penalties: franchise/large (−15), out-of-scope risk (−30), no contact method (−20).

---

## 3. Compliance & risk (READ before outreach)

- **Website / platform ToS.** Airtasker, hipages, Oneflare, Facebook, Instagram, Google all prohibit automated scraping in their ToS. We use **public, non-logged-in** pages only, at low rate, and treat platform data as *discovery hints* — the authoritative capture is the business's own published contact details + ABR. Risk = IP block / listing takedown, not usually legal action for public B2B facts, but flagged per-source.
- **Privacy Act 1988 (APPs).** A sole trader's mobile can be *personal* information. Collect only what's necessary for the legitimate purpose (recruiting subcontractors), from sources where they've *published it in a business context*, and be ready to state the purpose. Don't collect more than needed.
- **Spam Act 2003 (email/SMS outreach).** Commercial electronic messages need (a) consent — here **inferred consent** applies when a business has *conspicuously published* the address without a "no unsolicited email" note **and** the message relates to their business role; (b) **sender identification**; (c) a **functional unsubscribe**. Cold *phone calls* to published business numbers are the safer first-touch.
- **Do Not Call Register.** Has a business-number exception, but a sole-trader mobile is a grey area — prefer numbers published as business contacts; honour any opt-out immediately.
- Keep this list internal; don't resell it.

---

## 4. Outreach hook (for when the list is ready)
Angle that lands with the target profile (fair-priced owner-operators who want more work): *"We're Timeless Resurfacing (Sydney). We've got more resurfacing/regrouting jobs than we can cover and we're building a panel of reliable subbies. Fair per-job pay, we handle all the customer stuff and quoting — you just do the work. Keep your own ABN & insurance. Interested in overflow jobs?"* (No customer-contact model — matches our sub-engagement decision.)

---

## 5. Files
- `README.md` — this playbook.
- `data/leads.csv` / `data/leads.xlsx` — the collated lead list (generated).
- `data/leads-shortlist.md` — ranked recruit shortlist (generated).
- `data/raw-candidates.json` — full unfiltered discovery dump (generated, audit trail).
- `scripts/` — reusable helper scripts (ABR lookup, dedupe, CSV/XLSX build).

---

## 6. Results — Run 1 (2026-07-02)

**Sweep:** 22 discovery agents → **398 raw candidates** → **114 unique** (10 out-of-scope dropped at discovery) → 104 enriched + ABR-audited → cross-run consolidation (merged 6 duplicate businesses) → **91 unique businesses**.

**Verified NSW leads kept: 57** (34 rejected at audit as not-NSW / not-real-resurfacing / competitor-not-recruitable).
- **Tier A (score ≥75): 17** · Tier B (60–74): 11 · Tier C (40–59): 14 · Tier D (<40): 15
- **39 with phone · 36 with ABN · ~30 sole traders / owner-operators**

**Top recruit targets (Tier A, sole traders, ABR-verified):** Epoxy Grout Pro (Trent Moreland), AQ Resurfacing (Nick Loreggian), JS Pro Resurfacing (Jomedi Rollo), AB Resurfacing (Roni Korzits), Sydney Resurfacing Services (Bryan Bosquet), Resurfacing Projects (Paul Luozys), Rejuve Resurfacing (Gavin Hughes), iRegrout (Sam "Robbo" Robertson), Payless Bath Resurfacing (Cameron Atkins), Regrout-Regrout (Tim Leighton).

**Source notes / limits (honest):**
- WebFetch is hard-blocked on **hipages.com.au** (503) and **Oneflare** (301/bot-block) → those providers only surfaced via search snippets + own-site confirmation, so hipages/Oneflare-exclusive operators are under-represented. Manual login-based export is the only way to fully mine them.
- **Airtasker** category pages fetch, but most *featured* taskers are other states; only NSW-verified individuals were kept.
- **Facebook/Instagram/Gumtree** yielded little via automated fetch (login walls) — these remain a manual-follow-up channel (see §1 C).
- A **round-2 expansion** (deeper suburb-by-suburb Maps, forum threads, social manual) would add more, with diminishing returns.

## 6b. Results — Rounds 3 & 4 (2026-07-05) — CONVERGED

Ran two more expansion rounds tuned for price + review-recency + new sources:
- **Round 3** (price/recency focus): 355 raw → 123 new-unique → enriched 121. Added net-new leads + backfilled bathtub-price & 2026-review data.
- **Round 4** (gap-fill: Gumtree/FB Marketplace/ServiceSeeking/regional NSW + contact-fill): only **93 raw** candidates — the discovery well is drying up (398 → 355 → 93), the **loop-until-dry stop signal**. Filled 4 missing phones incl. the sub-$500 tub guy.

**FINAL workbook: ~110 usable NSW names** across 7 tabs:
- **All Leads: 58 verified** spray bath/tile resurfacers (Tier A ~20).
- **Potential (vet these): 52** NSW regrouters / shower-sealers / tile-restorers (adjacent trades Timeless offers; ~23 with phones).
- Shortlist (A+B), Sole Traders, Rejected+Out-of-scope (audit), How-To-Use, Summary.
- Full ~152-business universe of the NSW trade is mapped (kept + potential + rejected).

**Bathtub prices captured** (the boss's key ask — he'd only found $780): **Smart Solution $429** (📞 0488 030 919), **Bathroom Reglazing ~$450–500**, Super Resurfacing $650+GST, Fantastic Tub&Tile $875–1,175, Don R (Airtasker) ~$250–1,000.

**Tracker columns added** (gold, survive rebuilds): Outreach Status + Verdict dropdowns (colour-coded), Their Bathtub Quote ($), Date Contacted, My Notes. Preservation across rebuilds is tested.

**Conclusion:** after 4 rounds / ~850 searches the verified NSW spray-resurfacer universe is essentially exhausted (~58 real + ~52 adjacent). Further rounds would re-scan the same names. Re-run in a few months to catch new market entrants.

### How to re-run / expand
1. Resume/extend the workflow (adds only new work): `Workflow({scriptPath: ".../leadgen-full-scour-*.js", resumeFromRunId: "wf_8d6692e7-6a9"})`.
2. Rebuild the sheet from the latest task output:
   ```bash
   python3 docs/lead-gen/scripts/extract_result.py <task-output.json>   # merges + accumulates
   python3 docs/lead-gen/scripts/build_leads.py                          # consolidates + writes xlsx/csv/md
   ```
`extract_result.py` accumulates across runs; `build_leads.py` re-consolidates duplicates every time, so re-running is safe.
