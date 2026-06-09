/**
 * PostCSS pipeline (Tailwind v4):
 *   src/main.css
 *      → @tailwindcss/postcss (v4 — generates utility classes from the content scan
 *                              defined via @config '../tailwind.config.js')
 *      → cssnano (production-only minification: comment/whitespace stripping)
 *      → assets/main.min.css
 *
 * ── CRITICAL: `optimize: false` on @tailwindcss/postcss ──────────────────────
 * Tailwind v4's PostCSS plugin runs its OWN internal Lightning CSS optimizer
 * whenever `optimize` is truthy OR `process.env.NODE_ENV === 'production'`.
 * postcss-cli's `--env production` (used by `npm run build`) sets NODE_ENV=production,
 * which silently switched Lightning CSS ON. Lightning CSS rewrites the navy-palette
 * opacity utilities — e.g. `color-mix(in oklab, #041534 10%, transparent)` (from
 * bg-primary/10, ring-primary/20, border-primary/10, etc.) — into pre-computed
 * `oklab(20.3058% ...)` literals. That:
 *   (a) dropped the literal `#041534` count in the output (33 → 24), and
 *   (b) emitted `oklab()` color literals that need a 2023+ browser, where the
 *       known-good live build (built WITHOUT NODE_ENV=production) kept the broadly
 *       supported hex `color-mix()` form.
 * Pinning `optimize: false` keeps Tailwind from running Lightning CSS, so cssnano
 * alone minifies — reproducing the live stylesheet's coverage and color representation.
 * Verified: with this flag the build emits 0 `oklab()` and 52 `#041534` (live = 33),
 * full custom-palette parity, and the object-cover/h-full/w-full service-card fix.
 *
 * cssnano notes:
 *   discardEmpty:false — preserve the `@layer name1, name2;` cascade-order declaration.
 *     cssnano's discardEmpty was stripping it as an "empty rule", causing Tailwind v4
 *     utilities to lose to the base layer's preflight reset (e.g. .py-4 silently beaten
 *     by `* { padding: 0 }`). 2026-05-04 bug.
 */
module.exports = (ctx) => ({
    plugins: [
        // optimize:false → do NOT run Tailwind's internal Lightning CSS pass.
        // (See the block comment above — this is what keeps the navy palette as hex
        //  instead of oklab() and matches the live build's output.)
        require('@tailwindcss/postcss')({ optimize: false }),
        ctx.env === 'production'
            ? require('cssnano')({
                  preset: ['default', {
                      discardComments: { removeAll: true },
                      normalizeWhitespace: true,
                      // CRITICAL: preserve `@layer name1, name2;` cascade order declarations.
                      // cssnano's discardEmpty was stripping them as "empty rules", causing
                      // Tailwind v4 utilities to lose to base layer's preflight reset (e.g.
                      // .py-4 silently beaten by `* { padding: 0 }`). 2026-05-04 bug.
                      discardEmpty: false,
                  }],
              })
            : false,
    ].filter(Boolean),
});
