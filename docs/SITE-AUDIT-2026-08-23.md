# Is the whole site up to agency standard?

**Measured, not asserted.** `scripts/audit-site.py` walks every URL in the sitemap and scores
the rendered page on the same dimensions the article auditor uses: title, meta description,
H1, canonical, Open Graph, valid schema, image alt, word-count floor by page type, and
internal links. Run against local **1.5.2** (what is about to ship) and against **live 1.5.1**.

```bash
python3 scripts/audit-site.py            # local, pre-deploy
python3 scripts/audit-site.py --live     # what customers see today
```

---

## The honest answer

**The articles are at that standard. The rest of the site is not yet, and the gap is measurable
rather than a matter of taste.**

| Page type | Clean | Median words | Verdict |
|---|--:|--:|---|
| **Articles** | **5 / 5** | 3,329 | ✅ At standard. 25/25 on-page, 25/25 depth and E-E-A-T, 25/25 AI search |
| Blog archive | 1 / 1 | 241 | ✅ Clean after today's schema fix |
| Services hub | 0 / 1 | 816 | New page, one thin-ish flag |
| Homepage | 0 / 1 | 644 | One flag |
| Service pages | 3 / 20 | 1,331 | ⚠️ Longer than every ranking competitor, but 24 fixable defects |
| Legal / info | 0 / 4 | 2,555 | ⚠️ Short meta descriptions, no schema |
| Suburb pages | 0 / 63 | 0 | ❌ Worst area. 10 live at ~280 words, 53 parked and redirecting |

Live 1.5.1 scores **2 of 42 pages clean**. Local 1.5.2 scores **9 clean** on the comparable set,
and fixes a schema bug that was silently killing rich results across the site.

---

## What today's audit caught that nobody had noticed

**`esc_js()` was producing invalid JSON-LD in 21 places.** It escapes an apostrophe as `\'`,
which is correct JavaScript and invalid JSON. Any schema block whose text contained a
contraction, a possessive, or the word "Sydney's" failed to parse entirely — no CollectionPage,
no BreadcrumbList, no rich result, and nothing visibly broken on the page to notice.

It affected `single-article.php`, `archive-article.php`, `archive.php` and
`page-suburb-service.php`: every article, both archives, and all 63 suburb pages. Fixed, and
JSON-LD now parses on every page type.

That is exactly why the auditor was worth building: the bug was invisible to a human reading
the page and had been shipping for months.

---

## The recurring defects, by frequency

| Count | Defect | Effort |
|--:|---|---|
| 10 | No valid schema (legal/info + `/areas/` children) | Small — extend the existing schema helper |
| 14 | Meta description 100-119 chars (want 120-160) | Small — 14 sentences to lengthen |
| 9 | Fewer than 3 internal links on a service page | Medium — the hub-and-spoke pass from §B7 of the SEO strategy |
| 10 | Live suburb pages at ~280 words (want 700+) | Large — this is the doorway-page risk |
| 54 | HTTP 302 on parked suburb pages | Not live; local-only artefacts of the parked rollout |

None of these are on the articles.

---

## What is genuinely at standard already

- **Every article**: original data no competitor holds, primary sources verified by fetching the
  actual pages, 40-60 word answer windows enforced, real job photos, per-material warranty
  accuracy, independent Rule 8 verification that caught real errors in all five
- **Technical**: HTTPS, AI crawlers unblocked, `llms.txt`, `font-display: swap`, lazy loading,
  explicit image dimensions, filemtime cache-busting, valid schema everywhere as of today
- **Entity graph**: GBP + Facebook + Instagram in `sameAs`, with the URLs baked into code so a
  suffixed-theme upload cannot silently empty it
- **Service pages**: 1,331 median words, longer than every competitor observed in the July SERP
  research, all carrying FAQ and Service schema that none of them have

## What is not, in priority order

1. **Nothing is published.** Five finished articles, zero live
2. **No Search Console.** Nothing above is measurable without it
3. **The 10 live suburb pages at ~280 words** — under our own 700-word floor and the clearest
   scaled-content risk on the site
4. **`/areas/` links to no suburb pages** — the hub-and-spoke architecture is broken at that node
5. **14 short meta descriptions and 9 under-linked service pages** — an afternoon's work, parked
   by Allan with the rest of the service-page pass
6. **0 of 15 citations claimed**
