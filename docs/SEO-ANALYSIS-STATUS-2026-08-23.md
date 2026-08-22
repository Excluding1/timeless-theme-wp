# The live-site SEO analysis — what got done, what did not

**Source:** `docs/research/seo-strategy-2026-07-08.md`, the analysis run against the live site
on 2026-07-08. **Status measured against live, 2026-08-23**, by curl rather than from memory.

**One correction to something I told Allan earlier today:** I said GA4 was not set up. It is.
`G-R7WXTLE2HD` is firing on the live site, and Microsoft Clarity is on there too. What is
genuinely unconfirmed is Google Search Console, which can be verified by DNS or file upload
and so leaves no trace in the page source.

---

## The P0 finding

| Item | Then | Now |
|---|---|---|
| `llms.txt` returned 404 while every doc claimed it was live | ❌ 404 | ✅ **200, fixed and verified** |

---

## B0. Foundations

| # | Item | Status |
|--:|---|---|
| 1 | Fix llms.txt 404 | ✅ **Done**, live 200 |
| 2 | Google Analytics 4 | ✅ **Done** — `G-R7WXTLE2HD` live (plus Clarity) |
| 3 | Google Search Console + submit sitemap | ❓ **Unconfirmed** — no verification meta tag, but DNS/file verification leaves none. **Allan to confirm.** This is the one that matters: without it we cannot see which pages get impressions, so the blog's effect will be unmeasurable |
| 4 | Bing Webmaster Tools | ❌ **Not done** — 5 minutes, and ChatGPT's browsing leans on Bing's index |
| 5 | Apple Business Connect | ❌ **Not done** — free, feeds Siri and Apple Maps |
| 6 | Rank-tracking baseline for the 12 terms | ❌ **Not done** — and the window is closing: a baseline taken after the blog publishes measures nothing |

## B1. On-page upgrades to existing pages

| Item | Status |
|---|---|
| Homepage title flip to keyword-first | ❌ Still `Timeless Resurfacing – Sydney Bathroom Resurfacing & Regrouting Specialists`. The recommendation was to lead with the keyword |
| Bath page title | ✅ Already `Bath Resurfacing Sydney`, which is why Werx ranks |
| Re-enamelling / reglazing synonyms on the bath page | ⚠️ Present once. The analysis wanted a section, since that is exactly how Werx owns that SERP |
| Tile page disambiguation (coating vs stone polishing) | ❌ Not done |
| Real job photos with descriptive alt on the 3 pillars | ⚠️ Partial — real photos exist in the gallery but are not embedded on the pillars |
| 2-3 extra PAA-phrased FAQs per pillar | ❌ Not done |
| Alt-text pass on every image | ⚠️ Partial |
| Curated per-page title tags | ✅ **Done in repo**, ships with v1.5.2 |
| Areas page converted into a real hub | ❌ **Not done** — `/areas/` links to zero suburb pages on live |

## B2. Suburb pages

| Item | Status |
|---|---|
| Wave 1: 6 genuinely local pages at 700-900 words | ❌ **Not done, and complicated.** 66 pages were built 13-15 Aug then reverted on 20 Aug to protect the live scheme. The 10 that ARE live sit at ~275 words each, well under the 700-900 floor the analysis set to avoid the doorway-page pattern. Work preserved on branch `suburb-pages-wip` |

## B3. Content — the blog cluster

| Item | Status |
|---|---|
| 8 briefs written | ✅ Done, in §C of the analysis |
| Articles written | ✅ **5 finished** at 95 / 100 / 96 / 100 / 100, Rule 8 passed, covers done |
| Articles **published** | ❌ **Zero live.** `/blog/` returns 200 and lists nothing. Blocked on the WordPress Application Password |
| Every post links 1 pillar + 1 problem page + quote form | ✅ Done, enforced by the audit script |

## B4. Google Business Profile

| Item | Status |
|---|---|
| GBP active | ✅ Done, and now wired into the site's schema as `sameAs` + `hasMap` |
| Categories set to "Bathtub refinishing service" primary | ❓ Unconfirmed — Allan to check |
| Services list mirroring all 19 | ❓ Unconfirmed |
| 3-5 real job photos per week | ❌ Not started |
| Q&A seeding from our own FAQs | ❌ Not started |
| Weekly GBP post | ❌ Not started |
| 24/7 hours question | ✅ **Answered:** do not fake it. Set true generous hours; the 24/7 asset is the form, said honestly |

## B5. Reviews

| Item | Status |
|---|---|
| Review count | ⏳ **10 live**, up from 7 when the analysis ran. Target was 20+ by day 90 |
| Same-day ask on every completed job | ❌ Not systematised |
| Respond to 100% within 48h | ❓ Unconfirmed |
| Never gate or incentivise | ✅ Held — no gating exists |

## B6. Citations — 15 directories

❌ **None confirmed claimed.** This is the largest untouched block in the whole analysis, and
it is 15 sittings of about 20 minutes each. Several of these directories currently outrank us
for our own suburb terms, so being listed on them is both a citation and a second shot at the
same SERP. Yellow Pages, TrueLocal, hipages, Oneflare, Airtasker, ServiceSeeking, Word of
Mouth, ProductReview, Localsearch, StartLocal, Yelp AU, Hotfrog, plus Bing Places and Apple
Business Connect from B0.

## B7. Internal linking

| Item | Status |
|---|---|
| `/services/` hub | ✅ **Built** — was a 1-word page that 19 breadcrumbs pointed at. Ships with v1.5.2 |
| Problem pages link up to pillars | ⚠️ Partial |
| `/areas/` hub → suburb pages | ❌ Zero links on live |
| Footer keeps pillars + areas, not all 19 | ❌ Not done |
| Blog → pillar + problem page | ✅ Done |

## B8. Technical / Core Web Vitals

| Item | Status |
|---|---|
| HTTPS redirect | ✅ **Live, 301** |
| robots.txt does not block GPTBot / ClaudeBot / PerplexityBot | ✅ **Confirmed not blocked** |
| `font-display: swap` | ✅ Present |
| Lazy-loading below the fold | ✅ 23 instances on the homepage |
| `preconnect` to fonts.gstatic.com | ❌ **Missing** — zero preconnect hints. Small, real LCP win |
| PageSpeed run on 3 pillars + homepage | ❌ Not run |
| Explicit width/height on slider images (CLS) | ✅ Done in the blog work |
| Cloudflare logged-in-cookie cache rule intact | ✅ Held |

## B9. AI search (GEO)

| Item | Status |
|---|---|
| llms.txt | ✅ Live |
| Direct-answer paragraphs sized for extraction | ✅ **Done and enforced** — the audit script requires 40-60 words under every heading, and all five articles pass |
| FAQPage + BlogPosting + BreadcrumbList schema | ✅ Auto-generated by the theme |
| Entity consolidation via `sameAs` / `hasMap` | ✅ Done, ships with v1.5.2 |
| Cited on third-party sources AI assistants read | ❌ Blocked on B6 citations |

## B10. What NOT to do

✅ **All held.** No prices published, no "written guarantee" language, no licence claim, no
review gating, no scaled doorway pages, warranties stated per material.

---

## The honest summary

**Done:** the technical and on-page foundations, which is the half that compounds. llms.txt,
HTTPS, AI-crawler access, schema, the answer-window discipline, the services hub, curated
titles, GA4, and five finished articles.

**Not done:** almost everything that requires an account being created or a person making
calls. Citations (15), Bing, Apple, GSC confirmation, the review engine, GBP photos and posts,
and the suburb pages.

That split is not an accident. Everything in the first list is work I can do; everything in the
second needs Allan in an account or on a phone. The two highest-leverage items outstanding are
**confirming Search Console** — because without it none of the rest is measurable — and
**publishing the five articles**, which is blocked on one Application Password.
