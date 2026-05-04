---
name: Master-repo backlog triage — 2026-05-04
description: Inventory + categorisation of the 90+ uncommitted/untracked files in master-repo before committing. Awaiting Allan's commit-bucket sign-off after Cleo's peer-review returns.
type: project
originSessionId: 2026-05-04-codex-integration
status: AWAITING ALLAN SIGN-OFF
---

# Master-repo backlog triage — 2026-05-04

**Context:** When Clifford pushed the partnership commits today (`2a8d445`, `50d015c`), 90+ other uncommitted/untracked files were already sitting in master-repo from prior sessions. Bundling them into atomic commits requires Allan's scope decision. This file is the analysis to make that decision easy.

**Total uncommitted state:** 62 modified files + 28 deleted (the PNG sweep) + 90+ untracked = roughly **180 file-level changes** across 6 logical buckets.

**Recommendation:** 6 atomic commits in the order below. Each is reverter-friendly. None should be combined.

---

## Bucket A — Quote form image migration (PNG → JPG, 70+ files)

**What:** Earlier this session, the React quote form's placeholder PNG images were swapped for Allan's official labelled JPG images (provided in `~/Downloads/Quote form areas images official 2/`). Includes 6 area picker images + 32 service before/after pairs.

**Files:**
- DELETE: 28 PNG files in `quote-form/public/images/services/{basin,bath,floor,shower,vanity}/*.png`
- ADD: 42+ JPG files in `quote-form/public/images/{areas,services}/{...}/`
- MODIFY: `quote-form/docs/FORM-TO-PRICING-MAP.md`
- ADD: `quote-form/docs/IMAGE-BRIEF.md`

**Suggested commit:** `feat(quote-form): replace placeholder images with official labelled JPGs`

**Risk:** Low. Pure content swap. UI tested locally per session work.

---

## Bucket B — Quote form WP shortcode integration (47 files, all new)

**What:** The BUILT/deployable React app embedded as WordPress shortcode. This is the artifact that ships with the theme so WP renders the form via `[timeless_quote_form]`.

**Files (all new):**
- `assets/quote-form/index.html`
- `assets/quote-form/quote-form.css`
- `assets/quote-form/quote-form.js`
- `assets/quote-form/favicon.svg`
- `assets/quote-form/icons.svg`
- `assets/quote-form/images/areas/*` (6 area JPGs)
- `assets/quote-form/images/services/{basin,bath,floor,shower,vanity,walls}/*` (~38 service JPGs)

**Suggested commit:** `feat(theme): bundle built quote-form React app for WP shortcode`

**Risk:** Medium. This is large + binary-heavy. Verify these are truly the production build artifacts before committing — or alternatively, gitignore them and produce them via a build step.

**Open question for Allan:** Should `assets/quote-form/` be committed (so WP install gets the built form out-of-box) OR gitignored + built on deploy?

---

## Bucket C — Quote form code changes (4 files)

**What:** The actual React source changes from this session — SVCS reorganization, full bathroom shower 2-photo prompts, per-area Custom basin/vanity dynamic prompts, photo prompt logic, validation tightening.

**Files:**
- MODIFY: `quote-form/src/QuoteForm.jsx` (+1156/-1128 lines — massive)
- MODIFY: `quote-form/src/main.jsx` (+15/-?)
- MODIFY: `quote-form/vite.config.js` (+26/-?)
- ADD: `quote-form/src/lib/pricing-resolver.js`

**Suggested commit:** `feat(quote-form): full bathroom shower 2-photo prompts + basin custom + pricing-resolver lib`

**Risk:** Medium-high. QuoteForm.jsx is the most-load-bearing file in the form. Should ideally have Cleo peer-review THIS code (separate from the GHL plan review) before committing.

**Action:** Hold this commit until after Cleo's findings on the GHL plan are integrated. The plan changes may force more form code edits.

---

## Bucket D — WP theme + page template updates (24 files)

**What:** Page-template + theme-core copy/style updates from prior sessions (warranty page, care instructions, page-template polishing).

**Modified (17 page-templates):**
- `page-templates/page-{about,areas,basin-restoration,bath-resurfacing,bathroom-tile-resurfacing,chipped-bathtub-repair,contact,faqs,full-bathroom-makeover,gallery,peeling-bathtub-resurfacing,privacy,property-manager-bathroom-services,shower-leak-repair,stained-bathtub-resurfacing,sydney,tile-resurfacing,vanity-refinishing,vanity-respray}.php`

**Modified (theme core):**
- `style.css`, `functions.php`, `header.php`, `footer.php`, `front-page.php`, `inc/service-data.php`

**New:**
- `page-templates/page-shower-resurfacing.php`

**Suggested commits (split this bucket):**
- `feat(wp): add /shower-resurfacing service page` (the new page)
- `chore(wp): cross-page copy + style polish from earlier sessions` (the rest)

**Risk:** Low-medium. Cross-cutting copy changes. Worth `git diff`-reviewing the page-templates to confirm they're all warranty-or-copy related (no surprises).

---

## Bucket E — Build pipeline / config (4 files)

**What:** Build pipeline + dependency updates.

**Files:**
- `assets/main.min.css` (build output — Tailwind v4 compiled CSS)
- `src/main.css` (+7 lines)
- `package.json` (deps)
- `postcss.config.js`

**Suggested commit:** `chore(build): refresh main.min.css + dep updates`

**Risk:** Low if build passes locally. The earlier cssnano `discardEmpty: false` fix is in postcss.config.js — keep that.

**Open question:** Should `assets/main.min.css` be in git (current pattern) OR gitignored + built on deploy? Currently in git, leaving as-is.

---

## Bucket F — Dev-only artifacts (DO NOT COMMIT)

**Files (untracked):**
- `live-hero-current.png`
- `live-mobile-menu-open.png`
- `live-mobile-slider.png`
- `localhost-8765-home.png`
- `localhost-home.png`
- `localhost-shower-resurfacing.png`
- `localhost-viewport.png`

**Action:** Add to `.gitignore` instead of committing. These are screenshots from local dev/preview testing. Polluting git history with them adds nothing.

**Suggested commit:** `chore: gitignore dev-only screenshots`

---

## Bucket G — Project config (1 file)

**File:**
- `.claude/launch.json`

**Action:** Optional. This is the local Claude Code project config — may contain machine-specific paths. Worth `git diff`-reviewing before committing.

---

## Recommended commit sequence

If Allan signs off, this is the order to ship:

1. ✅ `chore: gitignore dev-only screenshots` (Bucket F — ~30 sec)
2. ✅ `feat(quote-form): replace placeholder images with official labelled JPGs` (Bucket A — image migration)
3. ⏸ HOLD `feat(quote-form): full bathroom shower 2-photo prompts + basin custom + pricing-resolver lib` (Bucket C — QuoteForm.jsx code, hold until after Cleo's findings on plan are integrated)
4. ✅ `feat(theme): bundle built quote-form React app for WP shortcode` (Bucket B — only if "commit built artifacts" is the chosen pattern; needs Allan call)
5. ✅ `feat(wp): add /shower-resurfacing service page` (Bucket D part 1)
6. ✅ `chore(wp): cross-page copy + style polish` (Bucket D part 2)
7. ✅ `chore(build): refresh main.min.css + dep updates` (Bucket E)
8. (Skip Bucket G unless Allan wants it tracked)

Total commit time after sign-off: ~10-15 min including diff review per bucket.

---

## Decisions needed from Allan before commits

1. **Bucket B:** Commit `assets/quote-form/` built artifacts to git, or gitignore them and rely on a build step on deploy? (Affects long-term repo size + deploy workflow.)
2. **Bucket C timing:** Commit form code now, or hold until after Cleo's GHL plan findings are integrated (they may force more QuoteForm.jsx edits)? **My rec: HOLD.**
3. **Bucket D scope:** Quick pass to confirm the 17 page-template modifications are all copy-related (no surprises). I'll do this if approved.
4. **Bucket G:** Track `.claude/launch.json` or leave untracked?

---

<!-- Authored by Clifford 2026-05-04 — backlog inventory after partnership commits 2a8d445 + 50d015c. Awaiting Allan sign-off before bucket commits proceed. -->
