# Blog pipeline — how each article gets built and checked

**Written 2026-08-22, from what article one actually took.** It is a runbook, not a
description: every check below is a command you can run, and every trap listed is one
that silently broke something on article one and cost a round trip to find.

The point of writing it down is that article one took a long conversation to reach
92/100. Article two should reach it in a fraction of that, because nobody has to
rediscover that Tailwind purging eats generated classes or that the theme folder name
is baked into image paths.

Canonical inputs: the eight briefs in
[`research/seo-strategy-2026-07-08.md` §C](../../research/seo-strategy-2026-07-08.md),
the image rules in [`IMAGE-PACK.md`](IMAGE-PACK.md), and the publish steps in
[`README-PUBLISH.md`](README-PUBLISH.md).

---

## Phase 0 — pick the article

Pick from the §C briefs, not from scratch. Each already has the primary keyword,
secondaries, intent, H2 outline, FAQ questions, internal links and word count.

Order by likely volume **and** winnability, not volume alone. The brief header usually
says which: "huge Sydney search behaviour" and "a cost-guide blog already ranks top-6"
are evidence; "competitor-dense money SERP" is a warning.

**Before writing, check it does not repeat an article already published.** This is the
mistake made on article two: it re-used the same case study and repeated four sections
of article one. Overlapping *topics* are fine; overlapping *material* is not.

```bash
# concept overlap against everything already published
python3 - <<'PY'
import re,io,glob,html
def words(f):
    s=re.sub(r'\A\s*<!--.*?-->\s*','',io.open(f,encoding='utf-8').read(),flags=re.S)
    s=re.sub(r'\[[^\]]*\]',' ',s)
    return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',s))).lower()
def heads(f):
    s=io.open(f,encoding='utf-8').read()
    return [html.unescape(re.sub(r'<[^>]+>','',h)).strip() for h in re.findall(r'<h2[^>]*>.*?</h2>',s,re.S)]
new='NEW-ARTICLE.html'
for f in glob.glob('*.html'):
    if f==new: continue
    print(f, '->', heads(f))
PY
```

If two articles need the same supporting explanation, the second one **links to the
first** instead of repeating it. That is what makes a cluster rather than eight
overlapping essays.

---

## Phase 1 — draft

Follow the brief's H2 outline. House rules, all of which are enforced by the checks in
Phase 4:

| Rule | Why |
|---|---|
| **No em dashes** | Allan's rule. Commas, colons and full stops instead. |
| **"technician", never "contractor"** | Allan: contractor reads like gig work, technician reads like a company. |
| **No dollar figures, no prices** | Locked business decision. "A fraction of replacement", never a number. |
| **No "guarantee", no "written guarantee"** | ACL exposure. Warranty language only. |
| **Warranty per material, with "up to"** | grout 2yr, silicone 1yr, resurfacing up-to-5yr, epoxy 5yr, rental 12mo. Never a blanket figure. |
| **Every H2 opens with a 40-60 word direct answer** | This is the shape AI Overviews and Perplexity lift. Non-negotiable. |
| **Name the customer never; suburb at LGA level** | A case study is a customer-facing claim. |

**Original evidence is the differentiator, not the word count.** Article one carries
ABS Census and NSW Fair Trading figures computed by us, linked, dated, with an explicit
paragraph on what the data cannot show. That is what gets cited by an AI engine. If an
article has no honest original angle, a real job with real photos is the substitute.
Never invent a study, a survey or a statistic.

---

## Phase 2 — images

Read [`IMAGE-PACK.md`](IMAGE-PACK.md) first. In short:

- **Cover:** generated flat 2D editorial illustration, one per article, via ChatGPT.
  Two constraints only, navy-and-gold palette and no text. Everything else varies per
  article on purpose. An over-specified prompt returns something lifeless.
- **Body:** the photorealistic pack in `images/blog/`, chosen to match the section it
  sits in. Illustrative only, never captioned as our own work, never in a before/after
  slider.
- **Real job photos:** the strongest asset, and the only images that may be captioned
  as our work. They need the customer's permission first if the photo came in for
  quoting rather than marketing, and they must not show personal effects.
- **Naming:** `cover-<slug-fragment>.jpg`, 1672x941, JPEG quality 88.

```bash
# ChatGPT returns PNG at ~1.5 MB; the pack is 160-440 KB
sips -s format jpeg -s formatOptions 88 in.png --out images/blog/cover-x.jpg
```

**Driving ChatGPT through the Chrome extension:** it fails on a stale tab group. Create
a fresh group, expect the first screenshot to time out, take a second one, and it
works. Download via the image's own editor view, not the share dialog.

---

## Phase 3 — wire it into WordPress

Locally, use a one-shot mu-plugin that **updates by slug and never inserts**. The old
auto-importer re-imported on every page load and produced 120 duplicate posts.

```php
// ~/.wp-now/mu-plugins/zz-sync.php  — delete immediately after running
add_action('init', function () {
    if (!isset($_GET['sync'])) return;
    header('Content-Type: text/plain');
    foreach ((array) glob(get_template_directory().'/docs/content/blog/*.html') as $f) {
        $slug = basename($f, '.html');
        $post = get_page_by_path($slug, OBJECT, 'article');
        if (!$post) continue;                       // never insert
        wp_update_post(['ID' => $post->ID,
            'post_content' => preg_replace('/\A\s*<!--.*?-->\s*/s', '', file_get_contents($f), 1)]);
        echo "UPDATED: $slug\n";
    }
    exit;
});
```

Paths must be theme-relative (`get_template_directory()`): wp-now runs PHP in WASM and
only sees mounted directories.

**Add the curated title to the map in `functions.php`.** `timeless_seo_title_map()` is
keyed by slug. Without an entry, the page falls back to H1 plus site name, which runs
past 60 characters and gets truncated.

---

## Phase 4 — audit

Run all of it. Each check below caught a real defect on article one.

```bash
URL=http://localhost:8881/blog/SLUG/
curl -s "$URL" > /tmp/a.html
```

### 4.1 House rules

```bash
F=docs/content/blog/SLUG.html
echo -n "em dashes: ";  grep -o "—" $F | wc -l          # must be 0
echo -n "contractor: "; grep -ci contractor $F           # must be 0
echo -n "dollars: ";    grep -oE '\$[0-9]' $F | wc -l    # must be 0
echo -n "guarantee: ";  grep -ci guarantee $F            # must be 0
```

### 4.2 The 40-60 word answer window

```bash
python3 - <<'PY'
import re,html
t=open('/tmp/a.html',encoding='utf-8').read()
b=re.search(r'<div class="entry-content.*?>(.*)</div>\s*</article>',t,re.S).group(1)
parts=re.split(r'(<h[23][^>]*>.*?</h[23]>)',b,flags=re.S); cur=None; bad=0; tot=0
for p in parts:
    hm=re.match(r'<(h[23])[^>]*>(.*?)</\1>',p,re.S)
    if hm: cur=html.unescape(re.sub(r'<[^>]+>','',hm.group(2))).strip(); continue
    if cur is None: continue
    pm=re.search(r'<p[^>]*>(.*?)</p>',p,re.S)
    if not pm: cur=None; continue
    n=len(html.unescape(re.sub(r'<[^>]+>','',pm.group(1))).split()); tot+=1
    if not 35<=n<=70: bad+=1; print(f"  {n:>3}  {cur[:56]}  <-- OUT")
    cur=None
print(f"{tot-bad}/{tot} inside the window")
PY
```

Target is every single one. Article one shipped 16/16.

### 4.3 Keyword placement

The one that was missed: **the primary phrase was in the slug and title but appeared
zero times in 2,644 words.** Check the exact phrase, not just its parts.

```bash
python3 -c "
import re,html
t=open('/tmp/a.html',encoding='utf-8').read()
b=re.search(r'<div class=\"entry-content.*?>(.*)</div>\s*</article>',t,re.S).group(1)
c=re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',b))).lower()
for k in ['PRIMARY PHRASE','SECONDARY 1','SECONDARY 2']:
    print(f'{k!r}: {c.count(k.lower())}')
print('words:', len(c.split()))"
```

Wanted: primary phrase 2-4 times in ~2,000 words, each one natural. Never write a
sentence around a keyword.

Also confirm it appears in: title, H1, URL slug, first 100 words, at least one H2, and
the meta description.

### 4.4 Meta, schema, structure

```bash
python3 - <<'PY'
import re,html,json
t=open('/tmp/a.html',encoding='utf-8').read()
g=lambda p:(re.search(p,t,re.S).group(1).strip() if re.search(p,t,re.S) else '')
ti=html.unescape(g(r'<title>(.*?)</title>')); de=html.unescape(g(r'<meta name="description" content="(.*?)"'))
print(f"title {len(ti)} (<=60)  desc {len(de)} (<=160)")
print("canonical", 'yes' if 'rel="canonical"' in t else 'MISSING')
for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>',t,re.S):
    try:
        o=json.loads(b); print("  valid", o.get('@type'))
    except Exception as e: print("  INVALID", e)
body=g(r'<div class="entry-content.*?>(.*)</div>\s*</article>')
print("H1",len(re.findall(r'<h1',t)),"H2",len(re.findall(r'<h2',body)),"H3",len(re.findall(r'<h3',body)))
imgs=re.findall(r'<img[^>]*>',body)
print("images",len(imgs),"missing alt",sum(1 for i in imgs if 'alt=""' in i or 'alt=' not in i))
PY
```

Wanted: title ≤60, description ≤160, canonical present, **three** valid JSON-LD blocks
(BlogPosting, FAQPage, BreadcrumbList), exactly one H1, zero images missing alt.

### 4.5 Links, in both directions

Outbound is easy to remember. **Inbound is the one that gets missed** — article one
was nearly orphaned, reachable only from `/blog/`.

```bash
# outbound
grep -oE 'href="[^"]*"' docs/content/blog/SLUG.html | sort | uniq -c
# every internal link resolves?
for u in $(grep -oE 'href="(/[a-z0-9/-]+/)"' docs/content/blog/SLUG.html | sed 's/href="//;s/"//' | sort -u); do
  curl -s -o /dev/null -w "  $u -> %{http_code}\n" "http://localhost:8881$u"
done
# inbound: which templates link TO it?
grep -rln "SLUG" --include="*.php" . | grep -v node_modules
```

Wanted: one pillar link, one problem-page link, the quote form, at least one **external
citation to a primary source**, and **at least one service page linking back in**. Every
link 200, none 404. Never link to an article that is not published yet.

### 4.6 Mobile and visual

```bash
# at 375px: no orphaned card, no horizontal overflow
```

Check in the browser at 375px: card grids must not strand a last item alone, values
must sit beside their bars rather than wrapping under, and the page must not scroll
sideways.

### 4.7 Score it

| Area | Points | What earns them |
|---|--:|---|
| On-page fundamentals | 25 | title, description, slug, H1, heading tree, keyword placement, alt text |
| Depth and E-E-A-T | 25 | word count vs brief, original evidence, linked sources, an honest section, byline, readability |
| AI search / AEO | 25 | every answer in the window, three valid schema types, machine-readable tables |
| Internal architecture | 15 | outbound links, **inbound links**, CTA, breadcrumb |
| Media | 10 | cover, body images, real before/after |

Below 85, fix before publishing. Article one scored 92, losing 8 on media alone.

---

## Phase 5 — gates before publish

1. **Rule 8** — both CEOs grep canonical independently. Article status stays
   `DRAFT PENDING RULE-8` until that happens.
2. **Images uploaded to the Media Library**, and the article referencing
   `/wp-content/uploads/...`, never a theme path.
3. **Curated title added** to `timeless_seo_title_map()`.
4. **Deployed** — none of this is live until the theme zip ships. Check the live
   version against `style.css` before claiming anything is live.

---

## Traps that silently break things

Every one of these cost a round trip on article one.

| Trap | What you see | Rule |
|---|---|---|
| **Theme folder name in image paths** | Every blog image 404s at once, later | Media Library paths only. WordPress renames the folder on upload. |
| **Purged Tailwind** | A generated class does nothing, grid collapses, bars render at zero width | Classes used nowhere else must live in `style.css`, or be inline styles. |
| **Auto-importer that inserts** | 120 duplicate posts | Update by slug. Never insert. Delete the plugin after. |
| **`large` thumbnail on a hero** | Hero looks like 480p on retina | Hero needs srcset; og:image needs `full` (≥1200px for `summary_large_image`). |
| **Odd item count in a card grid** | Last card stranded alone, different height | Grid columns follow the item count; a trailing odd card spans full width. |
| **Forward-linking an unwritten article** | 404, plus a false "we wrote a guide" claim | Link only what is published. |
| **Reasoning in an HTML comment inside post content** | Customer name and address served in public HTML | Notes go in the front-matter block, which the importer strips. |
| **Trusting STATE.md as complete** | "No such job exists" when it does | Phone-booked jobs were never written up. Ask Allan. |
| **Chrome extension on a stale tab group** | Every screenshot times out | New tab group; first screenshot fails; second works. |

---

## The audit is a script

Everything in Phase 4 runs as one command. The blocks above are kept so you can see
what it checks and run a piece of it by hand when chasing something specific.

```bash
./scripts/audit-article.sh <slug> "primary keyword phrase"
```

It reads the RENDERED page, not the source file, because several defects only exist
after WordPress has run: purged CSS, shortcodes that fail, schema that does not parse.
It prints a scorecard out of 100 and refuses to bless anything with a house-rule
failure or a broken internal link, whatever the score.

Article one scores 95/100 (losing 5 on media, pending the real before/after photos).

Two things it deliberately does NOT do:

- **Dollar figures are reported, not blocked.** The locked rule bans OUR prices. A
  cited public statistic that happens to be a dollar amount, such as a median bond
  deduction from Fair Trading, is not a price. The script prints each match so a human
  decides which kind it is.
- **It cannot judge whether the writing is any good.** It measures structure, not
  quality. A 95 with dull copy is still dull copy.
