# Website v1.5.2 — what is left

**Written 2026-08-22 by Clifford.** Live is **1.5.1**. The repo is **1.5.2** with roughly
seven weeks of work on it. This is everything standing between the two, ordered so that
nothing later depends on something earlier being skipped.

---

## A. Blocked on Allan (nothing ships until these land)

| # | Item | Why it blocks | Time |
|--:|---|---|---|
| A1 | **WordPress Application Password** → `.secrets/wp-app-password.key` | `publish-blogs.py` pushes articles over the REST API. Without it every article is a manual copy-paste into wp-admin, five times. wp-admin → Users → Profile → Application Passwords → name it `clifford-publisher` → save as `USERNAME:xxxx xxxx ...`, chmod 600. | 5 min |
| A2 | **Ruling on the rental warranty number** | The site currently publishes **6 months** in the warranty matrix and **12 months** in the landlord section of the same page, plus a third number on the tile page. I will not guess which is real on a warranty page. One word from you and it is a single sweep across four files. | 2 min to decide |
| A3 | **Provenance of the three real photos** in article 3 | They were in Downloads with Cloudinary-style names, so they may be customer quote-form uploads. They are anonymous surface close-ups and captioned as damage types, never as our job — but if they came in for quoting rather than marketing, they need permission. | 2 min |
| A4 | **Push the branch** | 118 commits exist only on this Mac. Task Hub's `server.js` already vanished off this disk once. | 1 command |

---

## B. The one job I could not finish

**Article 5's cover.** The Chrome extension wedged through three full recovery cycles. The
pipeline says to expect one recovery per cover; this went past that. Everything else on
article 5 is done. Run this in ChatGPT yourself and drop the PNG anywhere in Downloads:

> A flat 2D editorial illustration for a blog article header, 16:9 landscape. A person
> leaning over the edge of a bath, looking at a patch where the white coating has lifted
> and curled away from the surface, with a circular inset floating nearby showing the same
> bath stripped back and freshly resurfaced. Deep navy and warm gold, soft off-white,
> muted grey-blue. Calm and premium, the way a good fintech blog illustrates a story.
> No text anywhere.

Save as `images/blog/cover-peeling-bathtub.jpg`, 1672x941 — `publish-blogs.py` already
expects that filename.

---

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
