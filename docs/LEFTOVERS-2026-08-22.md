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

| # | Slug | Audit | Local :8881 | Cover | Blocking |
|---|---|---|---|---|---|
| 1 | `bathroom-resurfacing-rental-property` | **95**/100 | published | `cover-rental-property.jpg` | nothing — ready |
| 2 | `mouldy-shower-grout-fix` | **100**/100 | published | `cover-mould.jpg` | nothing — ready |
| 3 | `cracked-bath-basin-repair` | **93**/100 | published | `cover-crack.jpg` ⚠️ | Allan wants a *different* cover (grid of damage types); 7 real photos not yet on disk |
| 4 | `can-you-paint-bathroom-tiles` | not scored (not rendered) | held back | ❌ none | article 3 sign-off, then cover |
| 5 | `why-is-my-bathtub-peeling` | not scored (not rendered) | held back | ❌ none | article 3 sign-off, then cover |

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

### 4.6 Rule 8 has not been run on any article
Every one of the five is customer-facing copy. **Rule 8 requires both CEOs to grep canonical
independently before anything is published.** Cleo has not seen a single article. The publisher
script defaults to DRAFT precisely so this gate stays enforceable — do not pass `--publish` before it.

---

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
