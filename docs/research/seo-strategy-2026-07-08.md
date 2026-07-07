# SEO Strategy — timelessresurfacing.com.au — 2026-07-08

**Goal:** Top 3 in Sydney for bathroom resurfacing + shower regrouting terms. Currently ~position 23 (page 2–3). Site live since 2026-06-11.

**Method notes (honesty):** SERP research run 2026-07-07/08 via web search + direct fetches of every ranking page. Searches were routed through a US datacenter, so **organic results are reliable but the Sydney map pack could not be directly observed** — map-pack items below are marked and come with a 10-minute phone verification checklist for Allan (§B4). Live-site state verified by direct `curl` of timelessresurfacing.com.au (title tags, JSON-LD, robots.txt, llms.txt, /blog/).

**Locked business rules respected throughout:** NO prices on site · quote within 24 hours · never "written"/"guarantee" in customer copy · warranties per-material (resurfacing up to 5yr / grout 2yr / silicone 12mo — never blanket, "up to 5-Year" only with qualifying text per ACL) · GST business · phone 0451 110 154.

---

## ⚠️ P0 FINDING — llms.txt is 404 on the live site

Memory/docs record llms.txt as "live for AI search". **It is not.** Verified 2026-07-08:

```
https://timelessresurfacing.com.au/llms.txt      -> 404
https://www.timelessresurfacing.com.au/llms.txt  -> 404
```

The file exists at the **theme root** (`/Users/excluding/Downloads/timeless-theme-wp/llms.txt`) but WordPress does not serve theme-folder files at the site root, and nothing in `functions.php` registers a rewrite for it. **Fix:** add a rewrite + template_redirect handler in `functions.php` (serve the theme file at `/llms.txt` with `Content-Type: text/plain`), or upload the file to `public_html/` via cPanel. Then verify with curl from outside Cloudflare cache.

Also verified live (good news): homepage + service pages already carry `HomeAndConstructionBusiness`, `FAQPage`, `AggregateRating`, `Service`, `OfferCatalog`, `BreadcrumbList`, `GeoCoordinates`, `OpeningHoursSpecification` JSON-LD. **Not one of the ranking competitors has any JSON-LD at all** (verified on Bathroom Werx, The Grout Guy, Apex, Fantastic, Surface Care). Our technical on-page is already ahead; the gap is authority, reviews, local signals, and topical/suburb coverage.

---

# A. SERP SNAPSHOT (2026-07-07/08)

Page-type legend: **[C]** dedicated city/service page · **[H]** homepage · **[S]** suburb page · **[D]** directory · **[B]** blog post

| Term | Top organic (observed order) | Page type | Map pack | Weakness notes |
|---|---|---|---|---|
| **bathroom resurfacing sydney** | 1. Bathroom Werx `/bathroom-resurfacing-sydney.html` · 2. Apex Resurfacing (apexresurfacingaus.com.au) · 3. Fantastic Resurfacing · then AB Resurfacing, Mr Tubs & Tiles, Prime Resurfacing, Jim's Bathrooms, All Class `/bathrooms/`, Fresher Bathrooms `/bathroom-resurfacing-sydney/` | [C], then mostly [H] | Not directly observable from US IP — verify per §B4; expect Bathroom Werx + a rotating set of owner-operators by proximity | Werx page ~1,200–1,400 words, **no schema**, dated .html URLs. Apex/Fantastic rank with homepages — Fantastic's is **~350 words, no schema, no blog**. Nobody has FAQ schema. Beatable on content quality; they win on domain age + brand + reviews. |
| **bath resurfacing sydney** | 1. Bathroom Werx (same page) · 2. Apex · 3. AB Resurfacing · Prime `/pages/baths` · Pour-a-Glaze `/sydney/` · Budget Baths · Fantastic · Jim's · Sydney Resurfacing Services | [C]/[H] | as above | Same cast. Werx wins partly because their page title/H1 is exactly "Bath Resurfacing Sydney". Our `/services/bath-resurfacing/` title is already "Bath Resurfacing Sydney" — good; needs authority + synonym coverage (re-enamelling, reglazing). |
| **bathtub resurfacing sydney** | Werx · Fantastic · Apex · Prime · Ultraglaze (Facebook page + `/west-sydney-bath-resurfacing/`) · AB · Aussie Resurfacing `/bath-tub/` · Airtasker [D] | mixed | as above | A **Facebook page** and a directory rank top-10 → weak SERP. "Bathtub" variant is under-served; our bath page should carry bathtub/tub variants in H2s + FAQ. |
| **shower regrouting sydney** | 1. The Grout Guy `/location/sydney/` · 2. tileregrouting.com.au [H] · 3. Epoxy Grout Pro · Airtasker [D] · Shower Repair Centre `/regrouting-sydney/` · **tileregrouting.com.au cost-guide blog post [B]** · Prestige Shower Repairs `/shower-regrouting-sydney/` · Sabaseal · Leaking Showers Sealed · SealRITE | [S]/[C]/[B] | verify — expect Grout Guy, Megasealed franchises, local regrouters | Different competitor set from resurfacing. Grout Guy's engine = **100+ suburb pages** (`/location/sydney/<suburb>/`, ~800–900 words, 40% genuinely local). A **blog post ranks top-6** for the money term → content ranks here. Nobody has schema. |
| **tile resurfacing sydney** | Sydney Tile Experts `/tile-resurfacing` · Thermoglaze `/tile-resurfacing-sydney/` · Budget Baths wall-tile page · Fantastic · Mr Tubs & Tiles · Empire Painting `/tile-resurfacing/` (a **painting** company) · Tile Cleaners Sydney · All Class · ServiceSeeking [D] | [C]/[H]/[D] | verify | Weakest money SERP of the set: a painter, a stone-polisher and a directory in the top 10. Intent is split (painted-tile resurfacing vs stone polishing) — our page should disambiguate ("spray/roll-applied coating over ceramic wall & floor tiles"). Fast win candidate. |
| **bath re-enamelling sydney** | Bathroom Werx owns it (3 of top 9 URLs: `/bath-re-enamelling.html`, city page, `/we-manufacture-our-own-enamel.html`) · Prime · Apex · Pour-a-Glaze | [C] | verify | Werx wins because they **use the word** everywhere ("re-enamelling", CSIRO-tested enamel). Our bath page barely uses it. Add re-enamelling/reglazing sections + FAQ to `/services/bath-resurfacing/` rather than a new page (same intent). |
| **bathroom resurfacing parramatta** | Jim's location page · generic reno builders · GlazeMaster `/parramatta-resurfacing/` · **Yellow Pages category page [D]** · Airtasker [D] · Oneflare [D] | [S]/[D] | verify | **Three directories on page 1 = very weak SERP.** No resurfacing specialist has a real Parramatta page. Suburb page = near-term page-1. |
| **bath resurfacing penrith** | #1 is an ancient one-page site on websyte.com.au · Yellow Pages [D] · Unique Resurfacing service-area page · then irrelevant Perth results | [D]/legacy | verify | **Weakest suburb SERP observed** — Google is padding with Perth pages (thin index). Our ONE real completed job is Claremont Meadows (Penrith LGA) → this page gets real photos + a real local case study. Highest-confidence quick win on the list. |
| **bathroom resurfacing inner west** | Alpha Bathroom Resurfacing [H] · homeimprovement2day directory [D] · Werx · Apex · Ultraglaze west-sydney page | [H]/[D] | verify | One small specialist (Alpha) + directories. Winnable with a genuine Inner West page (federation homes, cast-iron tubs, terrace bathrooms angle). |
| **shower regrouting sutherland shire** | Airtasker [D] · Regrout-Regrout (local one-pager) · Grout Guy Sydney + Miranda/Engadine/Oyster Bay suburb pages · Prestige `/shower-repairs/sutherland/` · Sydney Tile Experts suburb page · SealTech `/sydney/sutherland-shire/` | [S]/[D] | verify | Grout Guy's suburb engine owns it, but every page here is a template job (~60% boilerplate). A better suburb page (real reviews, real photos) competes. Lower priority than Western Sydney (no proof assets there yet). |
| **leaking shower repair sydney (no tile removal)** | Leaking Showers Sealed · Leaking Shower Repairs · Prestige · Shower Repair Centre · Epoxy Grout Pro · Grout Guy · Megasealed `/sydney/leaking-shower-sydney/` | [C] | verify | Adjacent high-value term. Megasealed (ISO-accredited franchise, teams of 12–32) plays HERE, not in resurfacing. Our `/services/shower-leak-repair/` page targets it; must be honest about scope (grout/silicone-level leaks, not membrane failure). |
| **resurface vs replace bathtub** (info) | Bathroom Werx **blog** · Inner Bath · buildsearch cost guide · Amazing Bathroom Solutions blog · US sites | [B] | n/a | Werx is the only Sydney player blogging. Every other AU result is thin. Blog cluster wins these (§C). |
| **cost of X** queries (bath resurfacing cost, regrouting cost) | refinishing.com.au price guide · servicetasker · Yellow Pages article · ecospecifier · tradeheroes · Oneflare cost guide | [B]/[D] | n/a | Cost SERPs are owned by directories/content sites. **We do not publish prices (locked rule)** → we deliberately cede exact-number cost SERPs and instead target "what determines the price / why quotes differ" intent without figures (§C brief 2 & 3 handle this compliantly). |

### Who is NOT in the organic game (useful intel)
- **Megasealed** — huge brand, but ranks only for *leaking shower / regrouting* terms, not resurfacing. Franchise suburb-team pages + ProductReview listings. Not a resurfacing competitor.
- **surfacescare.com.au (Surface Care)** — the business model we're copying does **not rank for any Sydney term**: their site is national ("Australia's Leading Surface Repair Specialists"), zero location pages, ~1,200-word homepage, no schema. Lesson: their *page-per-service* architecture is right (we already have it), but they never localised — **we win by doing Surface Care's architecture + Grout Guy's localisation.**

### Structural read of the whole SERP
1. Resurfacing SERPs = aging owner-operator sites (350–1,400 words, no schema, no FAQ markup, little/no blogging). They rank on domain age, brand searches, reviews and citations — all replicable.
2. Regrouting SERPs = suburb-page engines (Grout Guy, SealTech, Prestige). Coverage beats quality there.
3. Directories (Yellow, Airtasker, Oneflare, ServiceSeeking) rank page-1 for suburb and "best/near me" terms → (a) weak SERPs we can beat with real pages, (b) **being listed in them IS a ranking asset** — they're also what AI assistants cite.
4. Nobody in the niche has JSON-LD. We already do. Our fight is **prominence** (reviews, citations, links, brand searches), not markup.

---

# B. THE TOP-3 METHOD — ordered 90-day plan

**Honest expectation-setting:** the domain is <1 month old in Google's eyes. 90 days of this plan realistically delivers: top-3 for several suburb × service terms, page-1 (top 5–10) for the main city terms, and map-pack presence in the western-Sydney home radius. Top-3 *citywide organic* for "bathroom resurfacing sydney" against a 30-year brand (Werx) is a 6–12 month outcome — the plan below is the fastest legitimate path to it.

## B0. Week 1 — Foundations (do first, everything else compounds on these)
1. **Fix llms.txt 404** (see P0 above). Serve at site root, verify with curl, purge both caches.
2. **Google Search Console + GA4** — still listed as pending in CLAUDE.md. Without GSC we are flying blind on which of the 19 pages get impressions. Submit `sitemap.xml` (verified live, 200).
3. **Bing Webmaster Tools** — free, 5 minutes, and **ChatGPT's browsing/local answers lean on Bing's index**. Submit the same sitemap.
4. **Apple Business Connect** — free listing; Siri/Apple Maps + increasingly AI assistants.
5. **Rank-tracking baseline:** record positions for the 12 terms in §A from a Sydney location (see §B4 checklist) so day-90 movement is measurable.

## B1. On-page upgrades to the existing pages (weeks 1–4)
Current state (verified): service pages are 1,350–1,800 words — already longer than every ranking competitor — with FAQ + Service + Breadcrumb schema. Upgrades are surgical, not rewrites:

**Per-page-type playbook:**
| Page type | Exact upgrades |
|---|---|
| **Homepage** | Title currently "Timeless Resurfacing – Sydney Bathroom Resurfacing & Regrouting Specialists". Flip to keyword-first: **"Bathroom Resurfacing Sydney \| Timeless Resurfacing — Bath, Tile & Shower Regrouting"**. Keep H1 "Bathroom Resurfacing Sydney Specialists". Add a short "Areas we service" block linking the new suburb pages (§B2). |
| **3 pillar pages** (bath-resurfacing, shower-regrouting, tile-resurfacing) | (a) **Synonym coverage**: bath page gets an H2 "Bath re-enamelling & reglazing — what's the difference?" (+ "bathtub"/"tub" variants in H2s/FAQ) — this is precisely how Werx owns the re-enamelling SERP. Tile page gets a disambiguation block (coating over ceramic tiles vs stone grinding/polishing — we do the former). (b) **Real proof**: embed Claremont Meadows before/afters with descriptive alt text ("bath resurfacing Claremont Meadows — before" style) and a 2–3 sentence job story. (c) 2–3 extra FAQ items each, phrased as the People-Also-Ask questions ("How long does bath resurfacing last?", "Can you resurface a bath twice?", "Is regrouting worth it?"). (d) Cross-link the sibling problem pages in body copy. |
| **Problem pages** (stained/peeling/chipped bathtub, mouldy-shower-grout, mouldy-silicone, cracked-grout, shower-leak-repair) | These are the Surface Care play and almost nobody in Sydney has them — keep. Upgrade: each gets ONE in-body link up to its pillar ("fixed by our bath resurfacing service") and one to the matching blog post when published (§C). Ensure each targets the *symptom phrasing* in title/H1 (e.g. "Peeling Bathtub? Resurfacing Fixes It — Sydney"). |
| **Property-manager page** | Title-target "bathroom resurfacing for rental properties Sydney / property managers". Link from blog brief #7. This audience (PMs, landlords) is the repeat-revenue channel and a weak SERP. |
| **Areas page** (`page-areas.php`) | Convert into the **hub** for suburb pages: one paragraph per region + link to each suburb page. |
| **All 19 pages** | Alt-text pass on every image (descriptive, service + real suburb where truthful — never fabricate locations); unique meta descriptions with the 24-hour-quote promise and phone number. |

**Wording compliance check while editing:** competitors shout "7 Year Written Guarantee" — we must NOT copy this. Our copy stays per-material and qualified: "backed by warranties of up to 5 years on resurfacing (2 years grout, 12 months silicone — details per service)". Never "written", never "guarantee", never blanket.

## B2. Suburb pages — the Grout Guy play, done better (weeks 3–8)
The theme **already has `page-suburb-service.php`** — the infrastructure exists. Model observed on Grout Guy's Miranda page: ~800–900 words, 40% genuinely local (housing stock, landmarks, soil/climate), 10-yr warranty pitch, 3 CTAs.

**Wave 1 (6 pages, in this order — ordered by SERP weakness × proof assets):**
1. **Penrith & Western Sydney** — weakest SERP observed; our real job (Claremont Meadows) lives here. Real photos + job story = instantly the best page in the SERP.
2. **Parramatta** — directories rank page 1; no specialist has a real page.
3. **Inner West** — one small competitor (Alpha); angle: federation semis, original cast-iron baths, terrace-house bathrooms worth keeping.
4. **Hills District** — gallery image already exists (`images/gallery/hills-district.jpg`); angle: 90s–2000s project homes, pink/beige tile eras.
5. **Sutherland Shire** — regrouting-led page (that's the SERP there); coastal humidity/mould angle.
6. **Eastern Suburbs / Bondi** — gallery image exists (`bondi-beach.jpg`); apartments/strata + salt-air angle.

**Template rules (anti-doorway):** 700–900 words each, minimum 40% suburb-specific (housing stock, common bathroom eras, water quality, real landmarks), unique FAQ (1–2 suburb-specific Qs), embed any real review/job from that area, one set of before/afters, ONE H1 pattern: "Bathroom Resurfacing <Suburb> — Baths, Tiles & Regrouting". URL: `/areas/<suburb>/` hub-spoked from the Areas page. **Do not launch more than we can make genuinely unique — 6 good pages beat 100 templated ones for a new domain (Google's 2024+ scaled-content policies punish the Grout Guy pattern on young sites).** Expand wave 2 (Liverpool, Blacktown, Campbelltown, North Shore, Northern Beaches, Ryde) only as real jobs/reviews accumulate in those areas.

## B3. Content — the blog cluster (weeks 4–10)
`/blog/` is live but empty (verified: one placeholder heading). Evidence content ranks in this niche: a cost-guide **blog post ranks top-6 for "shower regrouting sydney"** (a money term), and Bathroom Werx's blog owns "resurface vs replace". Publish the 8 briefs in §C at 2/week for a month, then 1/week. Every post links to exactly one pillar + one problem page + the quote form.

## B4. Google Business Profile (weeks 1–2, then continuous)
GBP is the fastest visible win: map pack = proximity (~15% and falling) + relevance (~25%) + prominence (reviews, citations, links). A 7-review 4.9★ profile with weekly photos and correct categories can enter the pack in its home radius well before organic moves.

- **Categories:** Primary = **"Bathtub refinishing service"** (exact-match to our core; the most specific category available). Secondary = "Bathroom remodeler", "Tile contractor", "Grout cleaning service" (if offered in AU category list). Never more than 3–4 — dilution hurts relevance.
- **Services list:** mirror all 19 site services verbatim (bath resurfacing, shower regrouting, tile resurfacing, chip repair, mouldy silicone replacement, epoxy grout upgrade, …), each with a 1–2 sentence description. NO prices in the price fields (locked rule) — leave price blank, description says "free quote within 24 hours".
- **Photos:** 3–5 real job photos per week (before/afters, in-progress, ute/kit). Real photos of real jobs only. Geotagged uploads from the phone at the job site are ideal. This is a measured mover in 2025 studies.
- **Q&A seeding:** post (from a personal account) and answer (as the business) the 8–10 questions already in our FAQ ("Do you resurface over existing tiles?", "How soon can I shower after regrouting?"…). Honest, permitted, and pre-empts the AI-sourced answers.
- **Review velocity:** see B5.
- **Posts:** 1 GBP post/week recycling blog content (photo + 100 words + Learn More link).

### The 24/7 hours question (Allan's question — honest evaluation)
**Recommendation: do NOT set 24/7. Set true, generous hours (e.g. 7:00am–7:00pm, 7 days if that's when calls genuinely get answered).** Reasoning:
1. "Openness" IS a confirmed ranking/filtering factor — closed businesses rank lower at closed times, and the "open now" filter removes them entirely. So longer *true* hours genuinely help.
2. BUT bathroom resurfacing is a considered, non-emergency purchase. People *research* at 9–11pm and *book* in daytime. A night researcher doesn't apply "open now" — they submit a form. The trades where 24/7 wins pack clicks are emergency ones (plumbers, leak detection). Resurfacing gets near-zero "open now, 2am" commercial intent.
3. Cost of faking it: Google's guidance and every credible practitioner (Sterling Sky, BrightLocal) say hours must be accurate; a 2am caller reaching voicemail on an "Open" business is a 1-star risk and Google can flag/edit inaccurate hours. It also collides with our accuracy-over-parity rule.
4. The 24/7 asset we DO have is the quote form → say it, honestly: GBP description + first Q&A: "Request a quote online 24/7 — we respond within 24 hours." Same benefit, zero risk.
5. Verify what the pack incumbents do (see checklist next) — if the top 3 all run business hours (expected), this is confirmed a non-lever; spend the effort on reviews and photos instead.

### 10-minute Sydney verification checklist (map pack — do from Allan's phone, logged out or incognito)
1. Search each of: "bathroom resurfacing sydney", "bath resurfacing near me" (from home + from one job site), "shower regrouting sydney", "bath resurfacing penrith".
2. Record for the 3 pack listings each: name, review count, rating, primary category (shown under the name), whether hours show "Open/Closed", photo count.
3. Note whether Timeless appears at all and at what scroll depth.
4. Re-run monthly; that's our pack-tracking baseline.

## B5. Reviews velocity (continuous — the single biggest prominence lever)
Current: 4.9★, 7 reviews. Targets: **20+ by day 90, no gaps longer than 2 weeks** (recency matters as much as count).
- Every completed job → same-day review ask via the 4B ask engine (SMS with direct review link). Follow up once at day 3. Stop there.
- Ask customers (optional, natural): "feel free to mention the suburb and what we did" — keyword-rich reviews help relevance. **Never script the text for them.**
- Ask for a photo with the review — photo reviews are a measured 2025 mover.
- Respond to 100% of reviews within 48h, mentioning service + suburb naturally in the reply (owner replies are indexable).
- **Never incentivise, gate, or filter** ("only ask happy customers" flows are review-gating): Google ToS + ACL s18 misleading-conduct exposure. All asks go to all customers.
- Seed secondary platforms once Google is moving: ProductReview.com.au (AI assistants cite it heavily) and Word of Mouth — 1 ask per ~5 jobs alternated.

## B6. Citations — claim these 15 (weeks 2–4, one sitting each)
NAP must be **identical everywhere**: "Timeless Resurfacing" · 0451 110 154 · admin@ business email (Rule: business email only) · service-area business (Sydney, NSW) · site URL with https, no trailing variations. Track in a sheet.

| # | Directory | URL | Notes |
|---|---|---|---|
| 1 | Google Business Profile | business.google.com | Canonical. §B4. |
| 2 | Bing Places | bingplaces.com | Feeds ChatGPT-adjacent surfaces. |
| 3 | Apple Business Connect | businessconnect.apple.com | Free. |
| 4 | Yellow Pages AU | yellowpages.com.au | Their category pages rank page-1 for our suburb terms — be on them. |
| 5 | TrueLocal | truelocal.com.au | High-authority AU citation. |
| 6 | hipages | hipages.com.au | Lead-gen; profile alone is a citation. Paid leads optional/separate decision. |
| 7 | Oneflare | oneflare.com.au | Ranks for "parramatta" terms. |
| 8 | Airtasker (services profile) | airtasker.com.au | Ranks top-5 for regrouting terms. |
| 9 | ServiceSeeking | serviceseeking.com.au | Ranks for "tile resurfacing sydney". |
| 10 | Word of Mouth | wordofmouth.com.au | Review platform #2. |
| 11 | ProductReview.com.au | productreview.com.au | Heavily cited by AI assistants; Megasealed's listings rank. |
| 12 | Localsearch | localsearch.com.au | AU-wide. |
| 13 | StartLocal | startlocal.com.au | AU-wide. |
| 14 | Yelp AU | yelp.com.au | Feeds Apple Maps + some AI answers. |
| 15 | Hotfrog | hotfrog.com.au | Long-standing AU citation. |

Also (not directories but citation-grade): **HIA or Master Builders membership** (Fantastic Resurfacing displays an HIA badge — it's a trust + link signal), supplier "find an applicator" pages if our coating supplier has one, and the local chamber of commerce.

## B7. Internal linking architecture (week 4 pass, then maintained)
Hub-and-spoke, three layers:
```
Homepage
 ├─ PILLARS: /services/bath-resurfacing/ · /services/shower-regrouting/ · /services/tile-resurfacing/
 │    ├─ problem pages link UP to their pillar (peeling/stained/chipped-bathtub → bath; mouldy/cracked-grout, leak → regrouting)
 │    └─ pillars link DOWN to 2–3 problem pages + ACROSS to each other once each
 ├─ /areas/ hub → 6 suburb pages → each links to the 3 pillars only
 └─ /blog/ → each post links to exactly 1 pillar + 1 problem page + quote form
```
Rules: every page reachable in ≤3 clicks from home; footer keeps pillars + areas hub (not all 19 — dilution); anchor text = natural service phrases, varied ("bath resurfacing in Sydney", "our bath resurfacing service", "resurfacing a worn bath").

## B8. Technical / Core Web Vitals (week 2 audit, fixes as found)
The Tailwind-CDN, no-build-step architecture is deliberate — do not fight it. The deploy already ships compiled `assets/main.min.css`, `filemtime` cache-busting, webp variants auto-served, Cloudflare HTML caching. Remaining checklist:
- PageSpeed Insights on the 3 pillars + homepage (mobile). Chase **LCP < 2.5s** (preload the hero image; ensure hero uses the `-800w` webp on mobile) and **CLS < 0.1** (explicit width/height on slider images; reserve space for the sticky mobile CTA bar).
- `font-display: swap` on Inter + Material Symbols; preconnect to fonts.gstatic.com.
- Lazy-load below-fold images (`loading="lazy"`) — verify it's on gallery/transformation images.
- HTTPS redirect in .htaccess (still a pending CLAUDE.md item — also an SEO hygiene item, duplicate-host prevention).
- robots.txt verified sane; **does not block GPTBot/PerplexityBot/ClaudeBot — keep it that way** (AI search needs crawl access).
- Keep the Cloudflare cache rule's logged-in-cookie condition intact (known 2026-06-11 regression).

## B9. AI search (GEO) — winning "best bathroom resurfacing sydney" in ChatGPT/Perplexity/AI Overviews
Reality check from current research: AI assistants recommend very few local businesses (~1–7% of those visible in the local pack get cited), and they build answers from: Google/Bing business profiles, high-authority directories & review platforms, consistent entity data, and crawlable structured sites.
1. **Fix llms.txt** (P0) — table stakes, already written, just not served.
2. **Entity consistency:** identical name/phone/description across site schema, GBP, Bing, all 15 citations, and socials. Our `HomeAndConstructionBusiness` schema already carries NAP + geo — keep it in lockstep with GBP.
3. **Review corpus breadth:** Google + ProductReview + Word of Mouth (AI models cite ProductReview for AU trades constantly — see Megasealed's SERP presence via it).
4. **Answer-shaped content:** the FAQ schema on every page + §C blog posts written question-first is exactly what Perplexity/AI Overviews lift. Keep answers 40–60 words, direct, first paragraph under each H2.
5. **Recency signals:** Perplexity favours fresh, dated content — blog cadence + "last updated" dates on service pages.
6. **Bing coverage** (ChatGPT) — §B0.
7. **Reddit r/sydney policy:** genuine participation ONLY — if Allan personally answers a "who fixes grout?" thread with disclosure ("I run a resurfacing business"), fine. **Fake accounts, self-recommendation without disclosure, or paying others to recommend us = NOT ALLOWED** (ACL misleading conduct + platform bans + brand damage when unmasked). Same for Facebook groups. No exceptions.
8. Server-rendered WordPress = fully crawlable by AI bots already — an underrated structural advantage over JS-heavy competitors. Keep the theme server-rendered (existing rule).

## B10. What NOT to do (ACL + Google risk register)
| Banned tactic | Why |
|---|---|
| PBNs / bought links / link exchanges at scale | Google link-spam policies; a young domain gets burned fastest. |
| Fake or incentivised reviews, review gating | ACL s18 (misleading/deceptive conduct — ACCC has prosecuted fake-review cases) + Google suspension. |
| Templated suburb pages at scale (50+ thin pages) | 2024+ scaled-content/doorway policies; also why we cap wave 1 at 6 genuinely local pages. |
| Fake 24/7 hours or virtual offices for extra GBP pins | GBP suspension risk; accuracy rule. |
| Publishing prices "because cost pages rank" | Locked business decision — NO prices on site. We target cost-intent with factor/value content instead. |
| "Written guarantee" / blanket warranty copy (even though every competitor does it) | Locked wording rules + ACL: warranties stay per-material with qualifying text. |
| AI-spun bulk blog content | Quality signals; every post in §C is written for a real question with real job proof. |
| Reddit/forum astroturfing | See B9.7 — NOT allowed. |
| Keyword-stuffed anchor text / hidden text | Classic spam signals. |

## 90-day calendar (condensed)
| Weeks | Workstream |
|---|---|
| 1 | llms.txt fix · GSC/GA4/Bing/Apple · rank + pack baseline · GBP categories/services/Q&A/hours |
| 2–4 | 15 citations · on-page pass (titles, synonyms, alt text, FAQs, real-job proof) · CWV audit + fixes · HTTPS redirect |
| 3–6 | Suburb wave 1: Penrith/Western Sydney → Parramatta → Inner West |
| 4–10 | Blog: 8 posts (2/wk then 1/wk) · GBP post + 3–5 photos weekly |
| 6–8 | Suburb wave 1 continued: Hills → Sutherland → Eastern Suburbs · internal-linking pass |
| 6–12 | Review engine steady state (every job, same-day) · ProductReview/WOM seeding · HIA/MBA membership decision · PM/strata outreach (property-manager page as landing) |
| 12–13 | Re-measure everything vs baseline; decide suburb wave 2 by where jobs/reviews actually happened |

**Day-90 KPIs:** main-term positions (target: page 1), 3+ suburb terms in top 3, map-pack appearance in home radius, Google reviews 7 → 20+, GSC impressions trend, GBP calls/direction-requests/week, 8 posts + 6 suburb pages indexed.

---

# C. BLOG PLAN — 8 writer-ready briefs

Global rules for every post: NO prices or dollar figures anywhere (use "a fraction of replacement cost", "far less than a full renovation"); no "guarantee"/"written"; warranty mentions only per-material with "up to" + qualifying text; CTA is always the quote form ("free quote within 24 hours") + phone 0451 110 154; author = the business (real experience, real photos); add FAQPage schema using the listed questions; 1 pillar link + 1 problem-page link minimum. Blog photos go in the WordPress Media Library (NOT the theme git repo — existing rule). Real job photos available now: `docs/templates/quote-generator/photos/john-ziino-bath.jpg`, `neil-prout-bathtub.jpg`, `isabella-vanity.jpg`, `painted-tiles-peeling.jpg` (upload to Media Library), plus the Claremont Meadows before/afters.

---

### Post 1 — the flagship comparison
- **Primary keyword:** resurface or replace bathtub · **Secondaries:** bath resurfacing vs replacement Sydney, is bath resurfacing worth it, bathtub refinishing vs new bath
- **Intent:** commercial-investigation (highest-value informational term in the niche; Bathroom Werx's blog owns it today with a thin post)
- **H1:** Resurface or Replace Your Bathtub? An Honest Guide for Sydney Homes
- **Slug:** `/blog/resurface-or-replace-bathtub/`
- **H2 outline:** 1) The short answer (40-word direct answer for AI/snippets) · 2) What bath resurfacing actually involves · 3) When resurfacing is the right call (cosmetic damage, sound tub, keeping a cast-iron original) · 4) When replacement is genuinely better (structural cracks, rusted-through base, relocating plumbing) — honest section, builds trust · 5) Time & disruption compared (hours vs days-weeks of demolition) · 6) Cost compared — without numbers ("a fraction of the cost of replacement once you add demolition, plumbing, tiling and waterproofing") · 7) How long a professional resurface lasts (industry lifespan + our per-material warranty phrased correctly) · 8) A real Sydney example (Claremont Meadows two-bathroom job, before/afters) · 9) How to decide in 5 minutes (checklist)
- **FAQ schema:** Is it cheaper to resurface or replace a bath? · How long does a resurfaced bath last? · Can a cast-iron bath be resurfaced? · Can you resurface a bath twice? · How soon can I use the bath afterwards?
- **Internal links:** pillar `/services/bath-resurfacing/`; problem `/services/chipped-bathtub-repair/`; quote form
- **Images:** Media Library uploads of `john-ziino-bath.jpg` + Claremont Meadows before/after; theme fallback `images/homepage/before.jpg`/`after.jpg` (slider pair), `images/services/bath-resurfacing/hero.jpg`
- **Word count:** 1,800–2,200 · **CTA:** quote form

### Post 2 — durability (top PAA question)
- **Primary:** how long does bath resurfacing last · **Secondaries:** bath resurfacing durability, resurfaced bath peeling, bath resurfacing lifespan Australia
- **Intent:** informational, pre-purchase objection ("does it actually last?") — the #1 trust objection in this trade
- **H1:** How Long Does Bath Resurfacing Last? (And What Makes It Fail Early)
- **Slug:** `/blog/how-long-does-bath-resurfacing-last/`
- **H2 outline:** 1) The short answer (typical professional lifespan; distinguish lifespan from warranty — state ours per-material: up to 5 years on resurfacing, with care requirements) · 2) Why some resurfaced baths peel in a year (cheap DIY kits, no surface prep, moisture trapped) — uses `painted-tiles-peeling.jpg` as a cautionary real photo · 3) What professional preparation involves (the step nobody sees) · 4) Aftercare that doubles the life (non-abrasive cleaners, no suction mats, first-24-hours rules) — link the Care Instructions page · 5) Signs a previous resurface was done badly · 6) Can a peeling resurface be redone? · 7) What our warranty covers, per material (accurate ACL-safe phrasing)
- **FAQ schema:** How long does bath resurfacing last? · Why is my resurfaced bath peeling? · Can you resurface over an old resurface? · What cleaners are safe on a resurfaced bath?
- **Internal links:** pillar `/services/bath-resurfacing/`; problem `/services/peeling-bathtub-resurfacing/`; `/care-instructions/`; `/warranty/`
- **Images:** `painted-tiles-peeling.jpg` (Media Library), `images/services/peeling-bathtub/hero.jpg`, `images/about/process.jpg`
- **Word count:** 1,400–1,700 · **CTA:** quote form

### Post 3 — the regrouting decision post
- **Primary:** regrout or retile shower · **Secondaries:** shower regrouting vs retiling Sydney, is regrouting worth it, when to regrout
- **Intent:** commercial-investigation; a cost-guide blog already ranks top-6 for the money term — this SERP demonstrably rewards content
- **H1:** Regrout or Retile? How to Tell What Your Shower Actually Needs
- **Slug:** `/blog/regrout-or-retile-shower/`
- **H2 outline:** 1) The short answer · 2) The 3-minute self-check (tap test for drummy tiles, grout-line condition, silicone condition) · 3) When regrouting is enough (solid tiles, failed grout — most showers we see) · 4) When retiling is the honest answer (drummy/loose tiles, failed membrane, water damage behind walls) · 5) What professional regrouting involves (removal depth matters — surface skimming vs proper rake-out) · 6) Epoxy vs cement grout (link epoxy-grout-upgrade page) · 7) Time and mess compared · 8) What it means for a leaking shower (link leak page)
- **FAQ schema:** Is it cheaper to regrout than retile? · How do I know if my tiles need replacing? · How long does regrouting take? · How long before I can use the shower? · Does regrouting stop leaks?
- **Internal links:** pillar `/services/shower-regrouting/`; `/services/epoxy-grout-upgrade/`; `/services/shower-leak-repair/`
- **Images:** `images/gallery/shower-regrouting/`, `images/services/shower-regrouting/hero.jpg`, `images/gallery/regrouting/`
- **Word count:** 1,600–1,900 · **CTA:** quote form

### Post 4 — symptom post: peeling
- **Primary:** why is my bathtub peeling · **Secondaries:** bathtub paint peeling, flaking bath surface, badly resurfaced bath
- **Intent:** problem-aware informational → direct feeder to a service
- **H1:** Why Is My Bathtub Peeling? Causes and the Right Fix
- **Slug:** `/blog/why-is-my-bathtub-peeling/`
- **H2 outline:** 1) The short answer (a previous coating is failing — enamel doesn't peel, coatings do) · 2) DIY kit vs professional coating: why the difference shows at 12 months · 3) Other causes (wrong cleaners, suction mats, trapped moisture) · 4) Why you can't just paint over it · 5) The proper fix: strip, prep, professional resurface · 6) What it looks like done right (real before/after) · 7) How to keep it from happening again
- **FAQ schema:** Can I paint over a peeling bathtub? · Is a peeling bath dangerous? · Can a peeling bath be resurfaced again? · How long does the proper fix take?
- **Internal links:** problem `/services/peeling-bathtub-resurfacing/` (primary feeder); pillar `/services/bath-resurfacing/`
- **Images:** `images/services/peeling-bathtub/hero.jpg`, `neil-prout-bathtub.jpg` (Media Library), homepage before/after pair
- **Word count:** 1,200–1,500 · **CTA:** quote form

### Post 5 — chip repair
- **Primary:** bathtub chip repair · **Secondaries:** chipped bath repair Sydney, enamel chip repair, can a chipped bathtub be fixed
- **Intent:** problem-aware, high-conversion (small-job entry point that becomes whole-bath work)
- **H1:** Bathtub Chip Repair: Can a Chipped Bath Be Fixed Without Resurfacing?
- **Slug:** `/blog/bathtub-chip-repair/`
- **H2 outline:** 1) The short answer (yes — small chips can be spot-repaired; here's when) · 2) What causes chips (dropped shower heads, renovation accidents) · 3) Why to fix a chip fast (rust creep in steel baths, water ingress in acrylic) · 4) Spot repair vs full resurface — how we decide honestly · 5) Colour-matching: why white isn't just white · 6) What a professional repair involves · 7) Rental/strata angle: chips and end-of-lease (mini link to PM page) · 8) Aftercare
- **FAQ schema:** Can you repair a chip in an enamel bath? · Will the repair be visible? · How long does chip repair take? · What if there are multiple chips?
- **Internal links:** problem `/services/chipped-bathtub-repair/` + `/services/basin-chip-repair/`; pillar `/services/bath-resurfacing/`; `/services/property-manager-bathroom-services/`
- **Images:** `images/services/chip-repair/hero.jpg`, `images/services/chipped-bathtub/hero.jpg`, `images/gallery/basin-restoration/`
- **Word count:** 1,200–1,400 · **CTA:** quote form

### Post 6 — mould post (huge Sydney search behaviour)
- **Primary:** how to get rid of mouldy shower grout · **Secondaries:** mould in grout keeps coming back, black mould shower silicone, regrout mouldy shower
- **Intent:** informational with strong DIY-first behaviour — post captures them at the "DIY failed" moment
- **H1:** Mouldy Shower Grout: Clean It, Regrout It, or Reseal It?
- **Slug:** `/blog/mouldy-shower-grout-fix/`
- **H2 outline:** 1) The short answer (surface mould cleans off; mould that returns within weeks lives IN the grout/silicone and needs replacement) · 2) Why bleach only works for a fortnight · 3) The silicone rule: mould inside silicone = replace, always (link mouldy-silicone page) · 4) When cleaning is genuinely enough (honest DIY section — builds trust and AI-citability) · 5) When regrouting is the fix · 6) Sydney's humidity + ventilation problem (local angle) · 7) Preventing regrowth (ventilation, squeegee, silicone with mould inhibitors) · 8) What professional mould-proofing looks like (epoxy grout option)
- **FAQ schema:** Why does mould keep coming back in my shower? · Can mouldy grout make you sick? · Do I need to regrout or just clean? · How often should shower silicone be replaced?
- **Internal links:** problem `/services/mouldy-shower-grout/` + `/services/mouldy-silicone-replacement/`; pillar `/services/shower-regrouting/`
- **Images:** `images/services/mouldy-shower-grout/hero.jpg`, `images/services/mouldy-silicone/hero.jpg`, `images/gallery/shower-sealing/`
- **Word count:** 1,500–1,800 · **CTA:** quote form

### Post 7 — the property-manager/landlord post (revenue channel, weak SERP)
- **Primary:** bathroom resurfacing rental property · **Secondaries:** landlord bathroom refresh between tenants, end of lease bathroom repairs, property manager bathroom maintenance Sydney
- **Intent:** B2B commercial — PMs and landlords; almost zero specialist content exists in AU (verified: SERP is generic reno-builder content)
- **H1:** The Property Manager's Guide to Bathroom Resurfacing Between Tenants
- **Slug:** `/blog/bathroom-resurfacing-rental-property/`
- **H2 outline:** 1) The short answer (most tired rental bathrooms need surfaces, not renovation — and days matter when the property is vacant) · 2) The vacancy-period maths (rent lost per week of reno vs a 1–2 day resurface — framed without dollar figures: "weeks of lost rent vs one day of work") · 3) What can be done in a single vacancy window (bath, tiles, regrout, silicone, vanity) · 4) Photos that let a PM scope it remotely (our photo-quote workflow, quote within 24 hours) · 5) NSW tenancy notes (repairs/maintenance basics, entry notice if tenanted — general info, not legal advice) · 6) When to recommend the owner replaces instead (honesty section) · 7) Warranty handover per material (correct phrasing) · 8) Case study: two-bathroom refresh, Claremont Meadows
- **FAQ schema:** How long does a rental bathroom resurface take? · Can work be done while tenanted? · Can you quote from photos? · What warranty applies for landlords?
- **Internal links:** `/services/property-manager-bathroom-services/` (primary feeder); pillar `/services/bath-resurfacing/`; `/services/full-bathroom-makeover/`
- **Images:** `images/services/property-manager/hero.jpg`, `images/services/full-bathroom-makeover/hero.jpg`, Claremont Meadows before/afters (Media Library)
- **Word count:** 1,600–1,900 · **CTA:** quote form (plus "PMs: send photos for a 24-hour quote")

### Post 8 — leak post (adjacent high-volume cluster)
- **Primary:** leaking shower repair without removing tiles · **Secondaries:** shower leaking through grout, do I need to rip out my shower, shower leak fix Sydney
- **Intent:** urgent problem-aware; competitor-dense money SERP (Megasealed, SealTech) but blog-level answer content is thin
- **H1:** Leaking Shower? Why You Often Don't Need to Remove a Single Tile
- **Slug:** `/blog/leaking-shower-repair-without-removing-tiles/`
- **H2 outline:** 1) The short answer (most leaks start at failed grout/silicone, fixable from above; membrane failure is the exception) · 2) How to tell where your shower is leaking (grout lines vs screen seals vs drain vs membrane) · 3) The no-tile-removal fix: rake-out, epoxy regrout, reseal · 4) When tiles DO have to come up (honesty section — failed membrane, drummy floors; we say so in the quote) · 5) Why acting early is cheaper than waiting (subfloor/ceiling damage below — no dollar figures) · 6) Strata & apartment notes (leaks into the unit below) · 7) What our process looks like + per-material warranty phrasing · 8) Prevention (silicone lifespan, grout sealing)
- **FAQ schema:** Can a leaking shower be fixed without removing tiles? · How do I know if my shower membrane has failed? · How long does a shower leak repair take? · Does regrouting fix a leaking shower?
- **Internal links:** problem `/services/shower-leak-repair/` (primary feeder); pillar `/services/shower-regrouting/`; `/services/epoxy-grout-upgrade/`
- **Images:** `images/services/shower-leak-repair/hero.jpg`, `images/services/cracked-grout-repair/hero.jpg`, `images/gallery/shower-regrouting/`
- **Word count:** 1,600–2,000 · **CTA:** quote form

---

## Sources / evidence trail (primary observations, 2026-07-07/08)
- SERP observations: live web searches for all §A terms (US-routed; organic order as returned; map pack flagged for local verification).
- Page teardowns fetched directly: bathroomwerx.com.au `/bathroom-resurfacing-sydney.html` · thegroutguy.com.au `/location/sydney/` + `/location/sydney/miranda/` · surfacescare.com.au · apexresurfacingaus.com.au · fantasticresurfacing.com.au · timelessresurfacing.com.au (+ curl of title/meta/JSON-LD/robots/llms.txt/blog/sitemap).
- Local ranking factors: Google Business Profile Help (support.google.com/business/answer/7091 — relevance/distance/prominence; /answer/7249669 — categories); BrightLocal local-algorithm guide; Sterling Sky on hours & "openness" as ranking/filter factor; Local Falcon / practitioner 2025 studies on review recency & photos.
- AI-search: SOCi / Voixly / poweredbysearch GEO playbooks (AI cite-rates for local businesses; ChatGPT↔Bing/GBP dependency; Perplexity recency preference); verified our robots.txt doesn't block AI crawlers.
- Citations: BrightLocal Top AU Citation Sites; whitechalkroad free AU citations list.
- Cost/keyword landscape: refinishing.com.au, servicetasker, Yellow Pages cost article, Oneflare cost guide, tileregrouting.com.au 2025 regrouting cost guide (blog ranking for money term).

*Prepared by Clifford (Claude) — 2026-07-08. Next review: day-90 re-measurement (early October 2026).*
