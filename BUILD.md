# Build Documentation — Timeless Resurfacing Theme

This theme uses **Tailwind CSS v4** compiled locally via PostCSS.

The compiled output (`assets/main.min.css`) is committed to git and shipped in the theme zip. WordPress users (Angela) don't need Node/npm to use the live site — only when making CSS-affecting changes.

---

## Quick Reference

### When you DO need to rebuild:
- Added new Tailwind classes in any `.php` file
- Added new Tailwind classes in `js/main.js`
- Modified `tailwind.config.js` (colors, plugins, safelist)
- Modified `src/main.css` (custom CSS additions)

### When you DON'T need to rebuild:
- Editing existing classes in PHP files (already in compiled CSS)
- Editing PHP logic (`<?php ?>` code only)
- Adding/editing images
- Editing `style.css` (this is loaded separately as the WP theme stylesheet)

---

## Setup (one-time, on a new machine)

Requires **Node.js v20+** (we tested with v22.14.0).

```bash
cd /path/to/timeless-theme-wp
npm install
```

This installs:
- `tailwindcss` v4.2.4 (the framework)
- `@tailwindcss/postcss` (v4 PostCSS plugin)
- `@tailwindcss/forms` (form input reset utilities)
- `cssnano` (production CSS minifier)
- `postcss` + `postcss-cli` (CSS processing pipeline)

Container queries and autoprefixer are built into Tailwind v4 — no separate packages needed.

---

## Building

### Production build (one-shot, minified)
```bash
npm run build
```
Output: `assets/main.min.css` (~60KB raw, ~11KB gzipped)

### Watch mode (auto-rebuild on file change)
```bash
npm run watch
```
Use during development. Press Ctrl+C to stop.

### Development build (unminified, for debugging)
```bash
npm run build:dev
```
Output: `assets/main.css` (readable, ~150-200KB). Don't ship this file.

---

## File Structure

```
timeless-theme-wp/
├── src/
│   └── main.css                ← Tailwind entry (you edit here for custom CSS)
├── assets/
│   └── main.min.css            ← Compiled output (auto-generated, committed to git)
├── tailwind.config.js          ← Colors, plugins, safelist
├── postcss.config.js           ← Build pipeline config
├── package.json                ← npm scripts + dependencies
└── functions.php               ← Enqueues assets/main.min.css with cache-busting
```

---

## How the Build Works

1. **`src/main.css`** imports Tailwind via `@import 'tailwindcss';`
2. **`@config '../tailwind.config.js';`** pulls in your config (colors, safelist)
3. **Tailwind scans** all `*.php` and `js/*.js` files for class names
4. **PostCSS** processes the result through `@tailwindcss/postcss` then `cssnano`
5. **Output** is written to `assets/main.min.css`
6. **WordPress** (`functions.php`) enqueues the file with `filemtime()` cache busting
7. **Browser** receives the minified CSS once, caches via Cloudflare for repeat visits

---

## Deploy to WordPress

The theme zip workflow is unchanged. After making changes:

1. Run `npm run build` to recompile CSS
2. Verify the change locally if possible
3. Re-zip the theme:
   ```bash
   cd /Users/angelapham/Downloads/timeless-theme-wp
   zip -r ../timeless-theme.zip . -x ".git/*" "node_modules/*" "AUDIT.md" "BUILD.md" \
     "CLAUDE.md" "HANDOFF.md" ".DS_Store" ".claude/*" ".playwright-mcp/*" \
     "package*.json" "postcss.config.js" "tailwind.config.js" "src/*"
   ```
4. Upload via wp-admin → Appearance → Themes → Replace

**Important:** `node_modules/` and the `src/` folder are excluded from the zip. Only the compiled `assets/main.min.css` is shipped — WordPress doesn't need the build pipeline.

---

## Configuration

### Adding a new custom color

Edit `tailwind.config.js`:
```js
colors: {
    // ... existing
    'my-new-color': '#ff5733',
},
```

Then rebuild: `npm run build`

The class `bg-my-new-color`, `text-my-new-color`, `border-my-new-color`, etc. all become available.

### Adding a class that's only used dynamically (e.g. via JavaScript)

Add to safelist in `tailwind.config.js`:
```js
safelist: [
    // ... existing
    'my-dynamic-class',
],
```

This ensures Tailwind keeps the class in the build even though no PHP file contains it as a static string.

### Adding custom CSS (not Tailwind)

Edit `src/main.css`:
```css
@import 'tailwindcss';
@config '../tailwind.config.js';

/* Your custom CSS below */
.my-custom-class {
    background: linear-gradient(45deg, red, blue);
}
```

---

## Migration History

- **2026-04 — Tailwind v3 → v4** via `npx @tailwindcss/upgrade`
  - 27 files migrated automatically
  - 762 class renames (`shadow-sm` → `shadow-xs`, `rounded` → `rounded-sm`, etc.)
  - PostCSS plugin changed: `tailwindcss` → `@tailwindcss/postcss`
  - `autoprefixer` removed (built into v4)
  - `@tailwindcss/container-queries` removed (built into v4)
  - Output reduced from 84KB to 61KB (~25% smaller)

---

## Troubleshooting

### "My class isn't styled!"
1. Did you rebuild? `npm run build`
2. Is the file extension scanned? Check `content` array in `tailwind.config.js`
3. Is the class spelled correctly? Tailwind is strict — `bg-primary` works, `bg-Primary` doesn't.

### "I changed the config but nothing happened"
- Restart watch mode if running (`npm run watch`)
- Hard-refresh browser (Cmd+Shift+R) — the file might be cached
- Check `filemtime()` in functions.php updated the version query string

### "Build is failing"
- Check Node version: `node --version` (need v20+)
- Reinstall: `rm -rf node_modules package-lock.json && npm install`
- Look for syntax errors in `tailwind.config.js`

---

## Performance Reference

| Asset | v3 (CDN) | v4 (compiled) | Savings |
|-------|----------|---------------|---------|
| Raw CSS | 409 KB | 61 KB | -85% |
| Gzipped | ~50 KB | ~11 KB | -78% |
| Render-block time | High (JIT runtime) | Low (static CSS) | ~250-500ms faster |
| Lighthouse Perf | ~35 mobile | ~80+ mobile | +45 points |
