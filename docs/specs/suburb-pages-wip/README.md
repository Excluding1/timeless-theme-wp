# Suburb hub pages — parked 2026-08-20, ready to resume

Allan's call: the `/areas/{suburb}/` rebuild is real work that deserves proper time, and it was
holding the v1.5.2 quote-form release hostage. So the theme is back on the live suburb scheme and
this work is parked here, complete and intact.

**Nothing was lost.** Two independent copies:

| where | what |
|---|---|
| `git branch suburb-pages-wip` | the full history — all 13 commits, at `868755e` |
| this folder | the finished files, as `.txt` so WordPress never loads them |

## What was reverted, and to what

Verified byte-identical against the live backup zip `~/Downloads/timeless-theme-2.zip`:

| file | reverted to |
|---|---|
| `inc/suburb-data.php` | the live 10 suburbs (Parramatta, Penrith, Castle Hill, Chatswood, Mosman, Hornsby, Bondi, Surry Hills, Manly, Strathfield) |
| `page-templates/page-areas.php` | live version — plain-text suburb lists, no links |
| `page-templates/page-suburb-service.php` | live version |
| `page-templates/page-area-suburb.php` | **deleted** — did not exist on live |
| `scripts/build-suburb-pages.php` | **deleted** — did not exist on live |

Also removed from `functions.php`, because after the revert nothing called them and dead code is
how the last three regressions started:

* `timeless_services()` · `timeless_comma_and()` · `timeless_link_suburbs()`
* **`timeless_suburb_url_redirect()`** — this one mattered most. It 301'd
  `/services/bath-resurfacing/{suburb}/` → `/areas/{suburb}/`. Left in place with the new pages
  gone, every live suburb URL would have redirected into a 404.

**One thing deliberately kept:** the suburb-page-creation sentinel now checks the LAST suburb in
the data file instead of only Parramatta. The old check meant suburbs added in a later theme
update were never created, because the Parramatta check passed and the generator never ran. It
works on the live `/services/bath-resurfacing/{slug}/` scheme and is a no-op while the 10 pages
exist. Revert it if you want the deploy to be a literal zero-diff.

## What is in here

| file | what it is |
|---|---|
| `page-area-suburb.php.txt` | the 454-line hub template — hero, trust bar, six full service sections with alternating image/text, job-type lists, local-conditions with a coastal branch, OpenStreetMap embed, five council-localised FAQs + FAQPage schema, quote form, nearby suburbs |
| `suburb-data-95.php.txt` | 95 suburbs, every one with all nine fields (council, housing era, four real neighbours, lat/lng, distance) — no filler |
| `build-suburb-pages.php.txt` | admin-gated batch creator, idempotent, batches of 8 |
| `page-areas-linked.php.txt` | `/areas/` index that links each suburb that has a page |

The rollout plan stays where it was: [`../suburb-pages-rollout.md`](../suburb-pages-rollout.md) —
batch order, the one-template-vs-three measurement, and the pre-publish checklist.

## To resume

```bash
git checkout suburb-pages-wip -- inc/suburb-data.php page-templates/ scripts/ functions.php
```

Then re-read the rollout doc. **Three pages were built and never signed off** — Marrickville,
Cronulla and Penrith. Start by looking at those before building more.

## The one constraint that keeps biting

The theme's Tailwind is **compiled and purged**: `assets/main.min.css` only contains classes used
somewhere in the theme. Any unfamiliar utility silently does nothing. This broke the layout three
separate times (`px-7`, `py-3.5`, `md:order-1`, `gap-x-5`, `decoration-dotted`). Copy markup from a
page that already works, or grep the compiled CSS first.
