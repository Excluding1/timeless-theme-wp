# Where we are, what's left — 2026-08-22

**Written by Clifford.** Companion to `docs/STATE.md` (facts) and `docs/CEO.md` (decisions).
This file is scoped to the **August 2026 website + blog programme** and the **repo-wide audit run
on 2026-08-22**. When something here becomes a permanent fact, it moves to STATE.md and this
file loses the line.

---

## 1. The one-line summary

The blog programme has produced five finished articles and a working pipeline, and **not one word
of it is on the live site.** Live is theme v1.5.1; the repo is v1.5.2 with roughly six weeks of
work on top. The gap between "built" and "earning" is the whole story of this file.

---

## 2. Blog programme — actual state

Rule Allan set on 2026-08-22: **one article at a time, his confirmation is the gate.** Articles 4
and 5 are written but deliberately held back from even the localhost preview until he signs off
article 3.

| # | Slug | Audit | Local :8881 | Cover | What is left |
|---|---|---|---|---|---|
| 1 | `bathroom-resurfacing-rental-property` | **95**/100 | published | `cover-rental-property.jpg` | Media Library upload, then publish. Rule 8 ✅ (fixes applied) |
| 2 | `mouldy-shower-grout-fix` | **100**/100 | published | `cover-mould.jpg` | Media Library upload, then publish. Rule 8 ✅ (fixes applied) |
| 3 | `cracked-bath-basin-repair` | **93**/100 | published | `cover-crack.jpg`, plus `cover-crack-v2` awaiting Allan's pick | Allan sign-off; provenance confirmation on the 3 real photos; a before/after pair is the last 7 points |
| 4 | `can-you-paint-bathroom-tiles` | **97**/100 | published | ❌ none | cover only. Rule 8 ✅ (fixes applied) |
| 5 | `why-is-my-bathtub-peeling` | not scored | held back | ❌ none | same |

Parked: `resurface-or-replace-bathtub` (flagship, overlaps article 3's case study — revisit after 5).
Older July drafts still in the folder and never re-audited: `bathtub-chip-repair`,
`how-long-does-bath-resurfacing-last`, `regrout-or-retile-shower`,
`leaking-shower-repair-without-removing-tiles`.

Audit the rendered page, never the source file:

```bash
./scripts/audit-article.sh cracked-bath-basin-repair
```

### What the programme built alongside the articles
- `docs/content/blog/PIPELINE.md` — 5-phase runbook, trap table, and the ChatGPT image procedure
  that actually works (15s load wait, screenshot in a *separate* call, first generation always errors).
- `scripts/audit-article.sh` — scores an article /100 off the **rendered** page; blocks on
  house-rule failures and broken links regardless of score.
- `scripts/keyword-demand.sh` — tiered Google Trends chaining against a shared anchor term.
- `docs/content/blog/IDEAS-50.md` — 55 ideas ranked on measured demand, each with an edge column.
- `docs/content/blog/IMAGE-PACK.md` — the cover-illustration standard (two constraints only:
  navy/gold palette, no text; over-specifying produces lifeless covers).
- `docs/content/blog/SOURCE-chip-and-crack-method.md` — Allan's real method, customer identities stripped.

---

## 3. Blocked on Allan (nothing moves until these land)

1. **WordPress Application Password.** `scripts/publish-blogs.py` publishes straight to the live
   site over the REST API — no theme upload, no copy-paste, zero URL churn. It needs
   `.secrets/wp-app-password.key` (format `USERNAME:xxxx xxxx xxxx ...`, chmod 600), created at
   wp-admin → Users → Profile → Application Passwords. **The file does not exist.** Until it does,
   every article has to be pasted by hand.
2. **The seven real photos** for article 3 → `~/Downloads/timeless-photos/` (folder exists, empty).
   They arrive in chat as images, which I cannot write to disk. The basin before/after pair is the
   highest-value one: it gives article 3 a real slider instead of a stand-in.
3. **Sign-off on article 3**, which releases articles 4 and 5.
4. **Push the branch** (see §6) — 104 commits exist only on this Mac.

---

## 4. Audit findings — 2026-08-22 (new, not previously recorded)

### 4.1 `/services/` renders one word on live
`https://timelessresurfacing.com.au/services/` returns 200 but its `<main>` contains exactly
`Services`. There is **no `page-services.php` template** in `page-templates/`, so WordPress falls
through to `page.php` and renders an empty page body. Meanwhile **19 service pages emit a
breadcrumb pointing at it**, and the header nav links to it. Every one of those breadcrumbs
currently terminates in a dead hub. This is a live defect, not a repo one.

### 4.2 The blog is live and empty
`/blog/` returns 200 and renders the archive shell. Zero articles are published. `sitemap.xml`
carries 42 URLs and **not one `/blog/` entry**. The sitemap fix (articles + the `/blog/` archive,
and the 19 service pages lifted off priority 0.5) is committed in the repo and **not deployed**.

### 4.3 104 commits are unpushed
The working branch `feature/day8-react-form-ghl-wire-2026-05-20` is 104 commits ahead of its own
remote and 402 ahead of `origin/main`. All of July and August — suburb pages, the warranty legal
sweep, the mobile pass, the SEO fixes, the entire blog programme — exists on one machine.
Task Hub's `server.js` already vanished off this disk once and was never committed. Same failure
mode, larger blast radius.

### 4.4 Cockpit data is six weeks stale, the board is not
`cockpit/data/pipeline.json`, `business-map.json`, `journey.json` and `needs.json` were all last
written **2026-07-07**. `tasks.json` was refreshed 2026-08-21/22 and does carry the Website-v2
work. So the *board* is current; the *map*, *journey* and *pipeline* views are showing an
early-July business. They are not wrong so much as unaware of six weeks.

### 4.5 Localhost apps
| App | Port | State |
|---|---|---|
| CEO Cockpit | 4317 | ✅ running, `/api/health` ok, `/map` + `/journey` + `/api/board` all 200 |
| Task Hub | 4334 | ⚠️ running as a **static** server only — the AI assistant, Mac reminders, 8am brief, GHL SMS and Supabase sync are still gone (`memory/task-hub-built-2026-07-19.md` is the rebuild spec) |
| TikTok archiver | 8317 | ✅ running (7 files modified and uncommitted in the working tree) |
| wp-now preview | 8881 | ✅ running, 3 articles rendered |
| Quote Inbox | 4319 | ⏸ not running (on-demand launcher) |
| Media archiver | 8318 | ⏸ not running (on-demand) |
| Idea Lab | 8319 | ⏸ not running (on-demand) |
| Tradie lead tracker | 4321 | ⏸ not running (on-demand, separate venture) |

### 4.6 Rule 8 — RUN on articles 1-3, and it earned its keep
Cleo read the three articles against canonical independently on 2026-08-22 and found four real
errors, all now fixed (commit `c78d3f5`):

- The rental article told landlords they get **"up to 5 years on resurfacing"**. Rental
  resurfacing is **12 months**. It said so correctly in one section and contradicted itself in
  two others, including the FAQ answering exactly that question.
- Bath cure time was given as **"roughly 24 hours"** in two places. `BTH-01` and the live care
  page both say **48 to 72**. 24 hours is the silicone and fresh-grout number. A tenant using a
  bath a day early is how a coating fails and a warranty argument starts.
- The mould article described an **epoxy** regrout then said regrouting is covered for 2 years.
  Epoxy is **5**; cement is 2. We were understating our own work. It also called epoxy a
  permanent fix; our care page says more mould-resistant, not mould-proof.
- Article 3 promised **"chips of any size, on any fixture"**. `CHR-01` stops at 30mm and cannot
  repair a chip through an acrylic shell. It also gave only the resurfacing warranty when a spot
  repair carries 1 year.

Two of Cleo's findings did not survive checking: the Decina citation is used only for "acrylic
baths need full support", which is what Decina says, and the front-matter comments never reach
the browser. What *did* leak was in-body `<!-- TODO -->` comments, one naming the case-study
suburb in a filename, plus a headshot TODO in the theme itself. `publish-blogs.py` now strips
every comment from the body rather than trusting anyone to remember.

Articles 4 and 5 have NOT had a Rule 8 pass. Do not pass `--publish` on them before one.

---

### 4.7 ⚠️ The site publishes two different rental warranty periods

Surfaced by Cleo's Rule 8 pass on article 4, then verified in the theme. Three live surfaces
disagree, and one page disagrees with itself:

| Where | What it says |
|---|---|
| `page-warranty.php` matrix (top of the page) | Rental resurfacing — bath, wall tile, floor tile, vanity, benchtop — **6 months** |
| `page-warranty.php` landlord section (same page, further down) | "Resurfacing services: **12 months**" |
| `page-terms.php` warranty table | Bath / wall-tile / floor / vanity resurfacing — **6 months** rental |
| `page-tile-resurfacing.php` | Floor tiles **1 year** (the warranty matrix says 5 years owner-occupied) |

Commit `804f78e` moved rental resurfacing from 6 to 12 months and updated the landlord section,
but the matrix on the same page, the terms table, and the tile page were never brought with it.

**Not fixed, deliberately.** I do not know which number is the real policy, and inventing one on
a warranty page is the wrong kind of guess. Allan rules on the true figures, then it is one sweep
across four files. This is the "warranty copy audit — NOT a bulk replace" item that CLAUDE.md
already flags, now with exact locations.

Article 4 was written so it does not add a fifth version: it states the wall-tile owner-occupied
figure only, and sends floor and rental terms to the warranty page.

## 5. Standing items this audit did not resolve

Carried from STATE.md and the cockpit board, still open:

- **Deploy v1.5.2.** Live 1.5.1. Ships the sitemap fix, the curated `<title>` map, the GBP
  `sameAs`/`hasMap` schema, the `[bar_chart]` shortcode, the blog CSS, and the responsive-image work.
- **8 orphaned pages** and a duplicate `/sydney/` hub.
- **About page never mentions Marko** — half the founding team is absent from the About page.
- **No service page offers vanity / benchtop / basin installation** despite the business doing that
  work (surfaced while writing article 3; a real revenue gap, not a copy gap).
- **Suburb pages parked.** 66 were built at `/areas/{suburb}/` on 13–15 Aug, then reverted on 20 Aug
  to protect the live scheme. `/areas/` currently links to no suburb pages at all. Work preserved on
  branch `suburb-pages-wip`.
- **Google Search Console + GA4 + Bing Webmaster still not set up** — §B0 of
  `docs/research/seo-strategy-2026-07-08.md` calls these the foundation everything else compounds on.
  Without GSC we cannot see which pages get impressions, so the blog's effect will be unmeasurable.
- **Customer table is incomplete** — phone-booked jobs were never written up (Allan, 2026-08-22).
  Worth one sitting with Allan and Marko listing every completed job from memory.

---

## 6. What to do next, in order

1. **Push the branch.** One command, removes the single largest risk in this file.
2. **Build the `/services/` hub** so 19 breadcrumbs stop landing on an empty page. Pure upside,
   no dependency on Allan.
3. **Run Rule 8** on articles 1–3 via Cleo, against canonical.
4. **Article 3's new cover**, then covers for 4 and 5, when the Chrome extension recovers.
5. **Refresh the cockpit map/journey/pipeline** to August reality.
6. **Deploy v1.5.2**, purge both caches, verify in incognito.
7. **Publish article 1** via `publish-blogs.py` once the app password exists and Rule 8 has passed.

---

## 7. Alignment check — are we still building "Surface Care, for bathroom resurfacing"?

Yes, and the blog programme is on-model rather than a detour. Surface Care's architecture is
page-per-service plus problem-led pages; we already have both. What the 2026-07-08 SERP research
found is that Surface Care **never localised** — they rank for nothing in Sydney — while The Grout
Guy wins regrouting purely on suburb coverage. The stated play is *Surface Care's architecture plus
Grout Guy's localisation*, and the blog is the third leg: a cost-guide blog post already ranks
top-6 for a money term in this niche, and Bathroom Werx is the only Sydney player blogging at all.

The honest gap is not strategy, it is **shipping**. Every asset in §2 is worth nothing until §6.7
happens.
