# Workflow & Rules — Timeless Resurfacing

This is a **living document**. Whenever we change a process, we update this file in the same commit. The goal: anyone (including future-you) can read this and understand exactly how this project operates.

**Last updated:** 2026-04-27 (v1.1.0 release)

---

## 🎯 Project Goals (the why)

Timeless Resurfacing is a Sydney-based bathroom resurfacing/regrouting business. The website's primary job is **lead generation to the quote form** — secondary is phone calls.

**Target audiences:**
- Older homeowners (phone-first, value-trust)
- Younger renters (mobile-first, photo-driven)
- Property managers / real estate agents (B2B)
- Sydney-wide + Wollongong + Central Coast + Blue Mountains + NSW

**Customer language must accommodate:**
- Trades terminology ("regrouting", "respray")
- Plain English ("bath painting", "fix chipped bath")
- Australian English ("colour" not "color")

---

## 📐 Architecture & Tech Stack

| Layer | Tech |
|---|---|
| CMS | WordPress (server-rendered, NOT React/SPA — for SEO) |
| Theme | Custom (`timeless-theme`) |
| Styling | Tailwind CSS v4.2.4, compiled locally via PostCSS |
| Build tool | PostCSS CLI (`npm run build`) |
| Local dev | wp-now (`localhost:8881`) |
| Hosting | VentraIP (cPanel) |
| CDN / DNS | Cloudflare |
| Database | MySQL (live), SQLite (local via wp-now) |
| PHP | 8.0+ |
| Node | v20+ |

---

## 🌳 Branch Strategy

We use **two long-lived branches** plus archived branches for retired work:

| Branch | Purpose | Version | Stability |
|---|---|---|---|
| `main` | Production-ready, deployable to live site | Current stable (e.g. `v1.1.0`) | ✅ Always works |
| `develop` | Active work, next version | Next minor (e.g. `v1.2.0`) | 🚧 May be temporarily broken |
| `archive/*` | Retired branches kept for history | n/a | 🗄 Read-only reference |

### Archive policy

When we retire a branch (no longer maintained), we **rename it to `archive/<name>-retired`** rather than delete it. This preserves history, makes the retirement explicit, and allows easy recovery if needed.

**Currently archived:**
- `archive/html-preview-retired` — Static HTML preview workflow (retired v1.1.0, April 2026, replaced by wp-now). Tag: `archive/html-preview-final-state`.

**To archive a branch:**
```bash
git fetch origin <branch>:archive/<branch>-retired
git push origin archive/<branch>-retired
git push origin --delete <branch>
git tag -a archive/<branch>-final-state archive/<branch>-retired -m "..."
git push origin archive/<branch>-final-state
```

### Optional later: feature branches
For big experiments, branch off `develop`:
```
git checkout develop
git checkout -b feature/programmatic-suburbs
# work, commit, when done:
git checkout develop
git merge feature/programmatic-suburbs
git branch -d feature/programmatic-suburbs
```

### Workflow per change

```
1. git checkout develop     # always start on develop
2. (make changes, commit atomically)
3. Run npm run build (if Tailwind classes added)
4. Test on http://localhost:8881 (wp-now)
5. Commit + push develop
6. When ready to ship a new version:
   a. git checkout main
   b. git merge develop
   c. Bump style.css version (e.g. 1.2.0)
   d. Update CHANGELOG.md (move "Unreleased" → "[1.2.0] — date")
   e. git commit
   f. git tag -a v1.2.0 -m "Release 1.2.0: <summary>"
   g. git push origin main --tags
   h. Build zip from main, upload to wp-admin
   i. Verify live, then back to step 1
```

---

## 🔢 Versioning (Semantic Versioning)

`MAJOR.MINOR.PATCH` (e.g. `1.1.0`)

| When to bump | Example |
|---|---|
| **MAJOR** (`X.0.0`) | Theme rewrites, breaking architecture changes, removed features |
| **MINOR** (`1.X.0`) | New features (added schema, added pages, new build tool) |
| **PATCH** (`1.1.X`) | Bug fixes, content tweaks, image swaps, no functional change |

**Examples:**
- `1.0.0` → `1.1.0` = added Tailwind build pipeline (new feature)
- `1.1.0` → `1.1.1` = fixed broken link in footer (bug fix)
- `1.1.1` → `1.2.0` = added GA4 analytics (new feature)
- `1.x.x` → `2.0.0` = full theme rebuild

**Version lives in 3 places (must stay in sync):**
1. `style.css` `Version:` header
2. `git tag` (e.g. `v1.1.0`)
3. `CHANGELOG.md` heading

---

## 📚 Documentation Files

| File | Purpose | Updated when |
|---|---|---|
| `WORKFLOW.md` (this file) | Rules, processes, expert defaults | Whenever we change how we work |
| `CHANGELOG.md` | Version history | Every release |
| `AUDIT.md` | Current state findings, recommendations | Quarterly or after big audits |
| `BUILD.md` | Build pipeline docs | When build process changes |
| `llms.txt` | AI search engine summary | When services / business info changes |

---

## 🧠 Rules of Engagement

### Rule 1: Expert lens per task
**Always identify the right specialist's perspective for each task.**

| Task type | Expert lens |
|---|---|
| SEO / indexing / schema | Senior SEO Specialist |
| Performance / Core Web Vitals | WordPress Performance Engineer |
| Build pipeline / Tailwind | Frontend Build Tools Specialist |
| Local SEO / GBP / suburbs | Sydney Trades Local SEO Specialist |
| Conversion / forms / CTAs | Conversion Rate Optimization Expert |
| Accessibility | WCAG Specialist |
| Analytics / tracking | GA4 / Analytics Specialist |
| Code quality / security | Senior PHP / WordPress Engineer |
| Visual design | UI/UX Designer |
| Content strategy | SEO Copywriter |

If unclear, ask: *"Whose advice would I want to hear on this specific question?"* That's the lens.

### Rule 2: Audit before action
For non-trivial changes (anything affecting >1 file or >1 page):
1. Read the current state
2. Identify what specifically needs to change
3. Plan the approach
4. Execute
5. Verify

Never start typing without reading the current code first.

### Rule 3: One task at a time (for complex work)
When a task is multi-faceted:
- Break it into discrete sub-tasks (use TodoWrite)
- Complete one fully before starting the next
- Commit between sub-tasks for clean rollback points

Don't batch unrelated changes into one commit.

### Rule 4: Verify before claiming done
Before saying "fixed" / "done" / "complete", verify with evidence:
- For HTML/PHP: hit the URL with curl, check response
- For CSS: visual diff, sample-test multiple pages (NOT just homepage)
- For SEO: schema validation, sitemap content, robots.txt
- For performance: Lighthouse / GTmetrix / curl headers
- For build: actual file sizes, class coverage

**Anti-pattern**: testing only the homepage. Service pages can break independently.
*(Lesson learned 2026-04-27: missed permalink bug because only tested homepage.)*

#### Rule 4a: The audit-fix-audit loop (every non-trivial task)
After completing any non-trivial task, run a deep audit on the work — then fix
what the audit finds — then audit AGAIN — and keep looping until an audit pass
finds zero new issues.

**Why**: Code-path verification (curl, file checks, regex tests) catches
different bugs than rendering verification (visual screenshot, browser
inspection). And both miss what only an outside reviewer would notice
(stale comments, regression hazards from your own fix, edge cases).

**The loop**:
1. **Do the task** (write code, verify works, commit).
2. **Audit pass** — spawn an audit agent OR self-audit with two hats:
   *(a) domain expert who knows the deep mechanics of this area*
   *(b) skeptical code reviewer who doesn't trust prior claims.*
3. **Triage findings** — by severity (critical → high → medium → low).
4. **Fix critical + high** (always). Fix medium where cheap. Defer low to
   debt log if needed.
5. **Re-audit** — focus the next audit on (i) "did the fixes work?" and
   (ii) "did the fixes introduce new issues?" plus broader scan.
6. **Repeat from step 3** until audit returns "no new issues found".
7. **Only then** mark the task done in TodoWrite + commit.

**Stopping criteria**: ONE audit pass that turns up nothing actionable
(only nits/deferred-debt). Two clean passes is even better but not required.

**Lesson logged 2026-04-27**: First Material Symbols subset shipped with
two latent bugs (`faucet` missed by audit script; `check_circle` injected
via JS bypassed PHP filter). The first audit caught both; the second audit
caught regressions FROM the fix (display-formatting in audit script,
stale comments). The third audit caught the regex word-boundary issue.
Each pass found real problems the previous didn't.

### Rule 5: Production safety first
Any code that modifies WordPress settings (options, permalinks, etc.) must:
- Use `=== ''` or similar strict checks (only act on truly default values)
- Never override user/admin preferences
- Be a no-op on production sites

If you're not sure whether a change is safe for production, run it through:
*"What if this fires on Angela's live site that's already configured?"*

### Rule 6: Preserve URL structure
**URLs are SEO equity. Never change a published URL without a 301 redirect plan.**

Before any change to slugs / permalinks / page names:
1. Check live site URLs (sitemap or curl)
2. Confirm theme code generates matching URLs
3. If a URL must change, document the redirect plan in CHANGELOG.md

### Rule 7: Commit messages tell the why
Format:
```
Short imperative title (max 72 chars)

Body explaining WHY this change, not just WHAT.
- Bullet list of specific changes
- Reference any tickets / issues
- Note any breaking changes

Co-Authored-By: ... (when applicable)
```

### Rule 8: Don't commit secrets, screenshots, or generated files
Already in `.gitignore`:
- `node_modules/`
- `.DS_Store`
- Stray screenshots (`*.png` at root)
- `.claude/` (dev tool artifacts)
- `.playwright-mcp/`

---

## 🛠 Build & Deploy

### Local development
```bash
# Start local WordPress (in your own Terminal — keeps running)
cd /Users/angelapham/Downloads/timeless-theme-wp
npx @wp-now/wp-now start --port=8881

# Open browser
open http://localhost:8881

# Login to admin
# Username: admin / Password: password
# (sandbox credentials — NOT your live site)
```

### CSS build
```bash
# One-shot production build
npm run build

# Watch mode (auto-rebuild on file changes)
npm run watch

# Development build (unminified for debugging)
npm run build:dev
```

### Theme zip for deploy
```bash
cd /Users/angelapham/Downloads/timeless-theme-wp
zip -r ../timeless-theme.zip . \
  -x ".git/*" -x ".gitignore" -x "node_modules/*" \
  -x "package*.json" -x "postcss.config.js" \
  -x "tailwind.config.js" -x "src/*" \
  -x "AUDIT.md" -x "BUILD.md" -x "WORKFLOW.md" -x "CHANGELOG.md" \
  -x "CLAUDE.md" -x "HANDOFF.md" -x ".DS_Store" \
  -x ".claude/*" -x ".playwright-mcp/*" \
  -x "homepage-mobile-full.png" -x "vanity-desktop-full.png" \
  -x "thesis-*.png"
```

### Deploy to live site
1. Always deploy from `main` branch (never `develop`)
2. wp-admin → Appearance → Themes → Add New → Upload → Replace
3. Verify live site loads correctly
4. Test 3-5 service URLs (not just homepage)
5. Check mobile + desktop

---

## 🔬 Verification Checklist (after any deploy)

```bash
# 1. PHP version hidden
curl -s -I https://timelessresurfacing.com.au/ | grep -i x-powered-by
# Expected: nothing

# 2. No CDN Tailwind
curl -s https://timelessresurfacing.com.au/ | grep -c cdn.tailwindcss.com
# Expected: 0

# 3. Compiled CSS loading
curl -s https://timelessresurfacing.com.au/ | grep -c 'main.min.css'
# Expected: 1

# 4. WP block bloat gone
curl -s https://timelessresurfacing.com.au/ | grep -c 'global-styles-inline\|wp-block'
# Expected: 0 (or low)

# 5. Service pages render correctly (not homepage)
for slug in bath-resurfacing-sydney shower-regrouting-sydney tile-resurfacing-sydney; do
    title=$(curl -s "https://timelessresurfacing.com.au/services/${slug}/" | grep -oE '<title>[^<]+</title>')
    echo "$slug: $title"
done
# Expected: each shows its proper service name in title

# 6. Sitemap valid
curl -s https://timelessresurfacing.com.au/sitemap.xml | grep -c '<loc>'
# Expected: 27 URLs
```

---

## 🗃 Decision Log

When we change a process or rule, we record it here so we know WHY in 6 months.

### 2026-04-27 — v1.1.0 baseline established
- **Adopted**: main + develop branch strategy (was: trunk-based main only)
- **Adopted**: Semantic versioning with git tags
- **Adopted**: Three living docs (WORKFLOW, CHANGELOG, AUDIT)
- **Retired**: HTML preview at `/tmp/timeless-preview/` (replaced by wp-now)
- **Retired**: Tailwind v3 + CDN (replaced by v4 + PostCSS local compile)
- **Adopted**: wp-now for local WordPress development (was: HTML static preview only)

### 2026-04-27 — Rule 4 added (verify before claiming done)
- Reason: caught a permalink routing bug only because Angela tested service pages
- New rule: always sample-test 3-5 different page URLs, not just homepage

### 2026-04-27 — Archive policy adopted (don't delete retired branches)
- Reason: branches are free to keep, deletion is irreversible
- New policy: rename `<branch>` → `archive/<branch>-retired` instead of deleting
- Also tag the final state for easy point-in-time recovery
- Applied to: `preview` branch (HTML preview era) → `archive/html-preview-retired`

---

## ❓ FAQ

### Q: I added a new Tailwind class but it's not showing up
**A:** You need to rebuild. `npm run build` then refresh browser.

### Q: My CSS changes aren't visible after upload
**A:** Browser cache. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Win). The `filemtime()` cache busting should auto-handle but browsers can be stubborn.

### Q: How do I add a new service page?
**A:**
1. On `develop` branch
2. Create `page-templates/page-NEW-SLUG.php` (copy an existing service page as starting point)
3. Add to `timeless_create_pages()` array in `functions.php`
4. Add to `desc_map` in `timeless_seo_meta()` for unique meta description
5. Add to mega menu in `header.php` if needed
6. Run `npm run build` if any new Tailwind classes
7. Test locally on wp-now
8. Commit + push develop
9. When ready: merge to main, bump version, tag, deploy

### Q: How do I add a new page that's NOT a service?
**A:** Same as above but slug is at root level (no `services/` prefix). Add to nav in `header.php`.

### Q: Something broke locally — how do I reset?
**A:**
```bash
pkill -f wp-now
rm -rf ~/.wp-now/wp-content/database
cd /Users/angelapham/Downloads/timeless-theme-wp
npx @wp-now/wp-now start --port=8881
```
Fresh WordPress install, theme auto-activates, all 27 pages recreated. No effect on live site.

### Q: I broke the live site — how do I rollback?
**A:**
1. `git log --oneline` — find the last known good commit (or last tag like `v1.1.0`)
2. `git checkout v1.1.0` (or specific commit hash)
3. Build zip from that state
4. Upload to wp-admin → Replace
5. Live site is back to that version

### Q: How do I see what was in the last release?
**A:** `CHANGELOG.md` has every version's changes documented.
