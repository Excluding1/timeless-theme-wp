# v1.5.2 regression check against live 1.5.1

**Run 2026-08-23.** Every one of the 42 URLs in the live sitemap was fetched from
**live (1.5.1)** and from **local wp-now (1.5.2)**, and the rendered `<main>` word counts
compared. Allan's question was whether anything that works today breaks on the new version.

**Answer: no. Nothing regressed.** Four paths flagged and all four have benign explanations.

---

## The four flags

### 1. Homepage, /about/, /sydney/ and every service page read lower locally

Not a regression. **The entire gap is the Google reviews block**, which pulls from the Places
API using a key that lives in the Customizer on production. Locally the key is absent, the
guarded function returns false, and the block renders empty. Diffed the two renders word by
word to confirm: the missing text is the review cards and nothing else.

```
/services/tile-resurfacing/   live 1275   local 1044   diff = 3 review cards
/about/                       live  758   local  497   diff = the same 3 review cards
```

Reviews code was touched once since July (`dda81b2`, filtering to 4 and 5 stars) and the
guard that fails safe without a key is intact.

### 2. /services/bath-resurfacing/penrith/ reads 41 words locally

**404 in the local database.** That page simply does not exist in wp-now; the other nine
suburb pages do and match live exactly. Deploying a theme does not touch WordPress pages, so
the live page is unaffected. A local data gap, not a code one.

### 3. /services/ goes from 1 word to 816

This is the fix, not a break. It was an empty page that 19 breadcrumbs pointed at.

### 4. /services/shower-resurfacing/ stays at 2 words

Correct and deliberate. It is now `noindex` and dropped from the sitemap until it has content,
rather than being advertised at priority 0.8 while empty.

---

## What was checked and passed

| Check | Result |
|---|---|
| All 42 live URLs return 200 locally | ✅ 41/42 (Penrith absent from the local DB only) |
| PHP fatals / parse errors / warnings across 13 key pages | ✅ none |
| Quote form still mounts on every page that carries it | ✅ live and local match, plus the new hub |
| Reviews block guard still fails safe without a key | ✅ intact |
| Warranty figures consistent across all five surfaces | ✅ after this session's fix |
| Pages with identical content live and local | ✅ contact, gallery, areas, privacy, terms, warranty, faqs, care-instructions, 9 suburb pages |

## What ships that is new rather than changed

`/services/` hub · sitemap including articles and `/blog/` · empty pages noindexed and desitemapped ·
curated title tags · GBP `sameAs`/`hasMap` · `[bar_chart]` · blog CSS · responsive images ·
rebuilt mid-page CTA · Posted/Updated split in the byline · author avatar.

## One thing to watch after deploying

Customizer values are stored **per theme folder**. If the upload installs a suffixed copy, the
**Google Places API key** goes with everything else, and the reviews block will silently empty
out on live exactly as it does locally. Re-enter the Customizer values and check a service page
for review cards before calling the deploy done.
