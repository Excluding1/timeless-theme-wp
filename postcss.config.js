/**
 * PostCSS pipeline (Tailwind v4):
 *   src/main.css
 *      → @tailwindcss/postcss (v4 — generates utility classes from content scan,
 *                              autoprefixer + container-queries are built-in)
 *      → cssnano (production-only minification: ~70% size reduction)
 *      → assets/main.min.css
 */
module.exports = (ctx) => ({
    plugins: [
        require('@tailwindcss/postcss')(),
        ctx.env === 'production'
            ? require('cssnano')({
                  preset: ['default', {
                      discardComments: { removeAll: true },
                      normalizeWhitespace: true,
                  }],
              })
            : false,
    ].filter(Boolean),
});
