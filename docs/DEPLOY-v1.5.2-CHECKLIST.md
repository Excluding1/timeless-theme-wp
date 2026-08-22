# Website v1.5.2 — what is left

**Written 2026-08-22 by Clifford.** Live is **1.5.1**. The repo is **1.5.2** with roughly
seven weeks of work on it. This is everything standing between the two, ordered so that
nothing later depends on something earlier being skipped.

---

## A. Blocked on Allan — three things, all small

| # | Item | Why it blocks | Time |
|--:|---|---|---|
| A1 | **WordPress Application Password** → `.secrets/wp-app-password.key` | `publish-blogs.py` pushes the articles over the REST API. Without it, five articles get pasted by hand into wp-admin. wp-admin → Users → Profile → Application Passwords → name it `clifford-publisher` → save as `USERNAME:xxxx xxxx ...`, chmod 600 | 5 min |
| A2 | **Which rental warranty number is real** | The site publishes **6 months** in the warranty matrix and **12 months** in the landlord section of the same page, plus a third figure on the tile page. I will not guess on a warranty page. One word and it is a single sweep across four files | 2 min |
| A3 | **Provenance of the three real photos** in article 3 | Anonymous surface close-ups, captioned as damage types and never as our job. But if they came in through the quote form rather than for marketing, they need permission | 2 min |

**Not blocking, but worth a decision:** the branch is **130 commits ahead** and exists only on
this Mac. One command fixes it.

## B. Covers — all five done

`cover-rental-property` · `cover-mould` · `cover-crack` · `cover-paint-tiles` ·
`cover-peeling-bathtub`. All 1672x941, JPEG q88, in `images/blog/`, and every filename in
`publish-blogs.py`'s HERO_MAP resolves to a file that exists.

The last one took four attempts across the evening — the Chrome extension wedged three
times and then recovered. The pipeline already says to expect one recovery per cover; the
correction to make is that the recovery sometimes needs repeating, and giving up after two
tries was my error rather than the tool's.

## C. Deploy sequence, in order

1. **Build the zip** exactly per CLAUDE.md, named `timeless-theme-2.zip`. The name must
   match the ACTIVE theme folder or WordPress installs a suffixed copy and leaves the old
   theme running (the 2026-06-11 lesson).
2. **Upload** → Appearance → Themes → Upload → *Replace current with uploaded*.
3. **Verify the right theme is active.** Theme Details on each "Timeless Resurfacing" card;
   activate the newest `theme=` slug. Delete stale copies.
4. **Re-enter Customizer values** — they are stored PER theme folder. Phone, email, ABN, and
   the **Google Business Profile URL** (`https://maps.app.goo.gl/UehVcakarPjYkpKw5`), which
   feeds the LocalBusiness `sameAs` and `hasMap`.
5. **Purge SpeedyCache, then Cloudflare** (Purge Everything). Both, every time.
6. **Verify in incognito**, never logged in — the Cloudflare cache rule keys on the
   `wordpress_logged_in` cookie and an admin view can otherwise be cached for everyone.

### What to check after deploy
- `/services/` renders a real hub, not one word
- `/services/shower-resurfacing/` carries `noindex` and is gone from `sitemap.xml`
- `sitemap.xml` contains `/blog/` and the published articles
- `main.min.css?ver=` and `main.js?ver=` are timestamps, not `1.5.1`
- Theme Details reads **1.5.2**

---

## D. What v1.5.2 actually contains

44 changed theme files. The parts that matter:

**Live defects it fixes**
- `/services/` rendered a **1-word `<main>`** while all 19 service pages named it as position
  2 of their BreadcrumbList. Now a real 816-word hub, routed in code so it cannot revert to
  blank on a suffixed-theme upload.
- `/services/shower-resurfacing/` served a **2-word page at sitemap priority 0.8**. Now
  noindexed and dropped from the sitemap until it has content.
- **Sitemap omitted every blog article and the `/blog/` archive**, and had all 19 service
  pages at priority 0.5 — the same weight as the privacy policy.
- Social cards requested a large image and were handed a 1024px one.
- Curated `<title>` tags never reached the page.

**Additions**
- Google Business Profile wired into schema as `sameAs` + `hasMap`
- `llms.txt` served at the site root
- `[bar_chart]` shortcode, responsive `stat_grid`, blog CSS, before/after slider styling
- Warranty ladder corrected per material across the theme
- Mobile pass: service cards, chip-repair, tile-resurfacing scroll rows
- Property-manager page rebuilt
- Chat widget removed site-wide

---

## E. After the deploy — publishing the blog

Nothing here touches the theme. Posts live in the database, so publishing never re-deploys
the site and never changes an existing URL.

```bash
python3 scripts/publish-blogs.py --dry-run                    # check dates and heroes
python3 scripts/publish-blogs.py --images images/blog          # upload as DRAFTS
python3 scripts/publish-blogs.py --images images/blog --publish  # only after A1-A3
```

Posts are spaced **3 days apart** by default (`--spacing-days`), newest today, each earlier
one stepping back, so the blog reads as a cadence rather than a dump.

**The five are done:** 95 / 100 / 96 / 100 / 100, all Rule 8 passed.

---

## F. Known-open, NOT in v1.5.2

Recorded so they do not get lost while attention moves to the customer-journey work:

- **Google Search Console, GA4 and Bing Webmaster are still not set up.** §B0 of the SEO
  strategy calls these the foundation everything compounds on. Without GSC the blog's effect
  is unmeasurable and every title judgement stays reasoning rather than data.
- **10 suburb pages sit at ~275 words each** — under the 700-900 floor our own strategy sets
  to avoid the doorway-page pattern. `/areas/` links to none of them. Work preserved on
  branch `suburb-pages-wip`.
- **8 orphaned pages** and a duplicate `/sydney/` hub.
- **The About page never mentions Marko.**
- **No service page offers vanity, benchtop or basin installation** despite the business
  doing that work. A revenue gap, not a copy gap.
- **The customer table is incomplete** — phone-booked jobs were never written up. Worth one
  sitting listing every completed job from memory before more of them fade.

---

## G. Is the website work done? (2026-08-23)

**Yes, for everything I can finish without Allan.** Setting aside the service-page rewrite and
future articles, which Allan has parked for next time, what is left is three of his decisions
and one deploy.

**Finished this run**
- Five articles at 95 / 100 / 96 / 100 / 100, all Rule 8 passed, all five covers made, real
  job photos replacing AI renders, real author avatar on the byline
- `/services/` hub built — it was a 1-word page that 19 breadcrumbs pointed at
- `/services/shower-resurfacing/` noindexed and dropped from the sitemap until it has content
- Sitemap fixed: articles and `/blog/` were missing entirely, 19 service pages were at priority 0.5
- Curated title tags, GBP schema, `[bar_chart]`, blog CSS, responsive images
- Mid-page CTA rebuilt and made responsive, legible and centred on mobile
- Posted and Updated separated in the byline; publisher spaces posts 3 days apart
- Auditor now blocks the 24-hour cure error that shipped in three articles

**Left, in order**
1. Allan: app password, warranty ruling, photo permission (§A)
2. Push the branch
3. Deploy v1.5.2 (§C), purge both caches, verify in incognito
4. Publish the articles (§E)
5. Confirm Search Console — without it the blog's effect is unmeasurable

**Parked by Allan for next time:** service-page rewrite, articles 6-10, the 66 suburb pages on
`suburb-pages-wip`, and the nine remaining AI body images in articles 1-3.

**Still open but not website work:** the 15 citations, Bing Places, Apple Business Connect, the
review engine and GBP photos. All in `docs/SEO-ANALYSIS-STATUS-2026-08-23.md`.
