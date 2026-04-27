/**
 * PostCSS pipeline:
 *   src/main.css
 *      → tailwindcss (generates utility classes from content scan)
 *      → autoprefixer (adds vendor prefixes for browser compatibility)
 *      → cssnano (production-only minification: ~70% size reduction)
 *      → assets/main.min.css
 */
module.exports = (ctx) => ({
    plugins: [
        require('tailwindcss')(),
        require('autoprefixer')(),
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
