# Blog publish runbook, 10 minutes per post

> **⚡ Update 2026-07-11 — AUTOMATED path now exists (recommended).** `scripts/publish-blogs.py`
> pushes these posts straight to the live site via the WordPress REST API — no theme upload,
> no copy-paste. Posts live in the WordPress DATABASE, not the theme zip: publishing content
> never re-deploys the website and never changes existing URLs (zero SEO risk). One-time setup:
> wp-admin → Users → Profile → Application Passwords → create "clifford-publisher" → save as
> `.secrets/wp-app-password.key` (format `USERNAME:xxxx xxxx xxxx...`, chmod 600). Then:
> `python3 scripts/publish-blogs.py --images ~/Downloads/blog-images` uploads everything as
> **DRAFTS** (+ heroes to the Media Library, auto-set as featured images); add `--publish` only
> after the Rule-8 pass. Manual paste path below still works and is unchanged.
> Hero images: all 12 AI-illustrative images are generated (`~/Downloads/blog-images/`) — the
> table below predates them; the current hero per post is the `HERO_MAP` in the script.

> **Update 2026-07-08 (engagement-visuals pass).** All 8 drafts in this folder were retrofitted with theme shortcodes at natural section breaks, and every broken image was resolved. Three things changed for publishing:
> - **Do NOT paste any inline FAQ `<script type="application/ld+json">` block.** The theme now auto-generates FAQ schema from each post's visible "Frequently asked questions" H3/P pairs, so the old inline scripts were removed (they were leaking as visible JSON text on the page). Just paste the visible FAQ H2/H3/P text as normal.
> - **The posts now contain shortcodes** such as `[compare_table ...]`, `[decision_flow ...]`, `[when_cards ...]`, `[process_step ...]` and `[stat_grid ...]`. Paste them exactly as written; WordPress renders them via `functions.php` into branded, responsive HTML/SVG. No extra action needed.
> - **`[MEDIA-LIBRARY: ...]` placeholders are gone.** Where a real photo was never uploaded (Claremont Meadows before/after pairs, `painted-tiles-peeling.jpg`, `neil-prout-bathtub.jpg`), the broken figure was replaced with a relevant table/flow/stat visual plus an HTML `<!-- TODO: ... -->` comment naming the file. Those TODO spots still need the real photos uploaded to the Media Library before publishing; once uploaded, you can swap the stand-in visual back for the photo (or a `[before_after ...]` slider) if you prefer.

How to publish the blog post drafts in this folder to timelessresurfacing.com.au.
Posts 1-4 in publish order:

| # | File | Slug | Featured image |
|---|------|------|----------------|
| 1 | `resurface-or-replace-bathtub.html` | `resurface-or-replace-bathtub` | `john-ziino-bath.jpg` |
| 2 | `how-long-does-bath-resurfacing-last.html` | `how-long-does-bath-resurfacing-last` | `painted-tiles-peeling.jpg` |
| 3 | `regrout-or-retile-shower.html` | `regrout-or-retile-shower` | copy of `images/services/shower-regrouting/hero.jpg` (see step 2) |
| 4 | `why-is-my-bathtub-peeling.html` | `why-is-my-bathtub-peeling` | `neil-prout-bathtub.jpg` |

Publish post 1 first, then 2, 3, 4. Each post's own metadata (title tag, meta description, slug, status) is in the HTML comment at the top of its file.

**All four are Status: DRAFT PENDING RULE-8 (Cleo). Do not publish until Cleo has independently checked the customer-facing copy against canonical (Rule 8).**

## Where the blog lives in this theme (verified in the code)

- The blog is a **custom post type called `article`**, NOT the default WordPress "Posts". In wp-admin the menu item is labelled **"Blog"** (pencil icon, near the top of the left menu). Do not use Posts → Add New; posts created there will not appear at /blog/.
- URLs: each article is served at **`/blog/{slug}/`** by `single-article.php`. The blog index is **https://timelessresurfacing.com.au/blog/** served by `archive-article.php`. Category archives work at `/blog/category/{slug}/`.
- The `article` CPT uses the standard WordPress categories and tags, so the "Guides" category works normally.
- The single template auto-builds a table of contents from the `<h2>` headings (shown when a post has 3 or more), auto-adds a quote CTA box in the sidebar, and auto-appends a full-width end-of-article CTA. Our pasted HTML also ends with its own small CTA section; that is intentional (in-content CTA plus the theme's closer). The theme also outputs BlogPosting JSON-LD automatically, and now auto-generates FAQPage JSON-LD from the visible FAQ H3/P questions, so the drafts no longer contain (and must not re-add) an inline FAQ `<script>` block.
- `.entry-content` styles in `style.css` already handle h2/h3, lists, blockquotes, figures and captions. No extra styling needed.

## Step-by-step (per post)

### 1. Upload the photos (once, before post 1)

Media Library → Add New. Upload the 4 real job photos from this repo folder:

```
docs/templates/quote-generator/photos/john-ziino-bath.jpg
docs/templates/quote-generator/photos/neil-prout-bathtub.jpg
docs/templates/quote-generator/photos/isabella-vanity.jpg   (not used in posts 1-4; used by later posts)
docs/templates/quote-generator/photos/painted-tiles-peeling.jpg
```

Posts 1 and 7 reference **Claremont Meadows before/after photos** that were never uploaded. Those `<figure>` blocks have been replaced with a `[stat_grid]` and an HTML `<!-- TODO: ... -->` comment naming the files. The posts publish fine as-is. To use real photos, pull them from the job records/phone, upload to the Media Library, and (optionally) swap the stat_grid back for a `[before_after before="URL" after="URL" alt="..."]` slider.

### 2. Create the article

wp-admin → **Blog → Add New Article** (not Posts).

1. **Title**: paste the "Post title (H1)" line from the file's metadata comment. The template renders this as the H1, so the pasted body correctly starts at `<h2>`.
2. **Body**: add a single **Custom HTML block** (or switch the whole editor to the Code Editor via the ⋮ menu, top right) and paste the entire file contents from after the closing `-->` of the metadata comment to the end of the file. This includes the `[shortcode]` markup, which the theme renders automatically. Do NOT add an inline FAQ `<script type="application/ld+json">` block: the theme now generates FAQ schema from the visible questions (see the 2026-07-08 note at the top).
3. **Media Library images / TODO photos**: the drafts no longer contain `[MEDIA-LIBRARY: ...]` placeholders. Where a real photo is still pending, an HTML `<!-- TODO: ... -->` comment names the file and a relevant table/flow/stat visual stands in for it (posts 1, 2, 4 and 7). Publishing works as-is. When you upload a named photo (Media Library → click the image → copy "File URL", it looks like `https://timelessresurfacing.com.au/wp-content/uploads/2026/07/filename.jpg`), you may replace the stand-in visual with a `<figure>` using that URL, or a `[before_after ...]` slider for the Claremont before/after pairs.
4. **Slug**: in the post sidebar under URL/Permalink, set the slug exactly as listed in the metadata comment. WordPress will default it from the title, which is wrong (too long), so set it manually.
5. **Excerpt**: paste the "Meta description" line from the metadata comment into the Excerpt field. It shows on the /blog/ index cards and in the BlogPosting schema.
6. **Category**: tick **Guides** (create it once via the Categories panel if it does not exist yet).
7. **Featured image**: set per the table above. For post 3, first upload a copy of `images/services/shower-regrouting/hero.jpg` from the repo to the Media Library (theme files cannot be selected as featured images).
8. **Publish.**

### 3. Meta title and description, what the theme actually does (verified)

There is no Yoast/SEO plugin. Two theme functions in `functions.php` handle it:

- **Title tag**: WordPress `title-tag` support generates it as `{Post title} – Timeless Resurfacing`. There is no per-post title-tag field, so the browser/Google title will be the post title, which is longer than the ideal ≤60-char "Title tag" in each file's metadata comment. That is acceptable at launch. To use the exact short title tags, add a `document_title_parts` filter (or slug-keyed map) in `functions.php`, a small dev task, not a publish-day task.
- **Meta description**: `timeless_seo_meta()` in `functions.php` (section 5b) looks up a hard-coded `$desc_map` by slug. Blog slugs are not in that map, so articles currently get the generic fallback description. To ship the per-post meta descriptions from the metadata comments, add the four slug→description pairs to `$desc_map` and redeploy the theme (again a dev task; the fallback is fine meanwhile). The Excerpt field does NOT feed the meta description in this theme, it only feeds the index cards and BlogPosting schema.

### 4. Verify (2 minutes per post)

- Open `https://timelessresurfacing.com.au/blog/{slug}/` **in Incognito** (never logged in, per the Cloudflare cache rule).
- Check the H1, the table of contents in the left sidebar, the images loading (no `[MEDIA-LIBRARY:...]` text visible), and the internal links.
- View source → confirm a FAQPage `application/ld+json` block is present (now emitted by the theme from the visible FAQ questions, not from the pasted HTML) and that no raw JSON is visible in the page body. Optionally paste the URL into Google's Rich Results Test.
- Confirm the shortcodes rendered (comparison tables, decision-flow SVGs, when-cards, process steps, stat grids) and that no literal `[compare_table ...]` / `[decision_flow ...]` text is visible.
- Check the post shows on https://timelessresurfacing.com.au/blog/ with its featured image and excerpt.

### 5. Purge caches (after each publishing session)

1. SpeedyCache: admin bar → SpeedyCache → Purge/Delete cache.
2. Cloudflare: dashboard → timelessresurfacing.com.au → Caching → Configuration → Purge Everything.

Without this, the /blog/ index keeps serving the cached "no articles yet" page for up to an hour.

## Notes

- No theme redeploy is needed to publish; articles are content, not theme files. Only the two optional meta upgrades in step 3 touch `functions.php`.
- Blog photos stay in the WordPress Media Library, never in the theme git repo (existing rule).
- Interlinking: post 1 links to post 2 (`/blog/how-long-does-bath-resurfacing-last/`), so publishing in order avoids a dead link window of more than a few minutes. If publishing on different days, publish 2 before 1 or add the link later.
