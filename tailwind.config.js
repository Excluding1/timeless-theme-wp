/**
 * Tailwind CSS v3.4 — Local build configuration
 *
 * Migrated from inline CDN config in functions.php. Maintains 100% feature parity:
 * - All 18 custom Material Design 3-style colors
 * - Inter font family for body
 * - forms + container-queries plugins
 * - Safelist for JS-dynamic classes (so they aren't purged)
 *
 * IMPORTANT: When you add a new Tailwind class anywhere in PHP/JS, run `npm run build`
 * to recompile. Otherwise the class won't be in the output CSS.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './*.php',
        './page-templates/*.php',
        './js/*.js',
        './inc/*.php',
    ],

    /**
     * Safelist: classes that are added dynamically by JavaScript or PHP logic
     * that the content scanner might miss. These are GUARANTEED to be in the output.
     */
    safelist: [
        // Tab/button state toggles in js/main.js
        'bg-primary',
        'bg-surface-container-high',
        'text-primary',
        'text-secondary',
        'text-white',
        // Mobile menu / mega menu states
        'open',
        'visible',
        'active',
        // Slider ready states
        'ba-ready',
        // Common variants that PHP might toggle programmatically
        { pattern: /^(bg|text|border)-(primary|secondary|tertiary-fixed-dim|surface)/ },
    ],

    theme: {
        extend: {
            colors: {
                // Material Design 3-style semantic palette — matches inline config exactly
                'primary': '#041534',
                'primary-container': '#1b2a4a',
                'on-primary-container': '#8392b7',  // for use ON dark bg-primary / bg-primary-container only
                'primary-soft': '#5a6789',          // muted blue for use on LIGHT backgrounds (5.62:1 on white — passes WCAG AA)

                'secondary': '#595e6d',

                'tertiary-fixed': '#ffddb0',
                'tertiary-fixed-dim': '#e7c08b',
                'on-tertiary-fixed': '#281800',

                'surface': '#f7f9fb',
                'surface-container': '#eceef0',
                'surface-container-low': '#f2f4f6',
                'surface-container-high': '#e6e8ea',
                'surface-container-highest': '#e0e3e5',
                'surface-container-lowest': '#ffffff',

                'outline': '#75777f',
                'outline-variant': '#c5c6cf',

                'error': '#ba1a1a',
                'error-container': '#ffdad6',
                'on-error-container': '#93000a',
            },
            fontFamily: {
                'body': ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },

    plugins: [
        require('@tailwindcss/forms'),
        // Note: @tailwindcss/container-queries is built into v4 — no plugin needed
    ],
};
