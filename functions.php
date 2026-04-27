<?php
/**
 * Timeless Resurfacing Theme Functions
 *
 * @package Timeless
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/* ─────────────────────────────────────────────
   1. THEME SETUP
   ───────────────────────────────────────────── */
function timeless_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo' );
    add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption' ) );

    register_nav_menus( array(
        'primary' => __( 'Primary Navigation', 'timeless' ),
    ) );
}
add_action( 'after_setup_theme', 'timeless_setup' );

/* Auto-create all pages on theme activation (skips existing ones) */
function timeless_create_pages() {
    $pages = array(
        array( 'title' => 'About',   'slug' => 'about',   'template' => 'page-templates/page-about.php' ),
        array( 'title' => 'Contact', 'slug' => 'contact', 'template' => 'page-templates/page-contact.php' ),
        array( 'title' => 'Gallery', 'slug' => 'gallery', 'template' => 'page-templates/page-gallery.php' ),
        array( 'title' => 'Service Areas', 'slug' => 'areas', 'template' => 'page-templates/page-areas.php' ),
        array( 'title' => 'FAQs',    'slug' => 'faqs',    'template' => 'page-templates/page-faqs.php' ),
        array( 'title' => 'Privacy Policy', 'slug' => 'privacy', 'template' => 'page-templates/page-privacy.php' ),
        // Service pages
        array( 'title' => 'Shower Regrouting Sydney',  'slug' => 'services/shower-regrouting-sydney',  'template' => 'page-templates/page-shower-regrouting-sydney.php' ),
        array( 'title' => 'Bath Resurfacing Sydney',   'slug' => 'services/bath-resurfacing-sydney',   'template' => 'page-templates/page-bath-resurfacing-sydney.php' ),
        array( 'title' => 'Tile Resurfacing Sydney',   'slug' => 'services/tile-resurfacing-sydney',   'template' => 'page-templates/page-tile-resurfacing-sydney.php' ),
        array( 'title' => 'Vanity Refinishing Sydney',  'slug' => 'services/vanity-refinishing-sydney',  'template' => 'page-templates/page-vanity-refinishing-sydney.php' ),
        array( 'title' => 'Basin Restoration Sydney',   'slug' => 'services/basin-restoration-sydney',   'template' => 'page-templates/page-basin-restoration-sydney.php' ),
        array( 'title' => 'Shower Sealing Sydney',      'slug' => 'services/shower-leak-repair-sydney',  'template' => 'page-templates/page-shower-leak-repair-sydney.php' ),
        array( 'title' => 'Epoxy Grout Upgrade Sydney',  'slug' => 'services/epoxy-grout-upgrade-sydney',  'template' => 'page-templates/page-epoxy-grout-upgrade-sydney.php' ),
        array( 'title' => 'Floor Tile Regrouting Sydney', 'slug' => 'services/floor-tile-regrouting-sydney', 'template' => 'page-templates/page-floor-tile-regrouting-sydney.php' ),
        array( 'title' => 'Chip Repair Sydney',          'slug' => 'services/chipped-bathtub-repair-sydney', 'template' => 'page-templates/page-chipped-bathtub-repair-sydney.php' ),
        array( 'title' => 'Full Bathroom Makeover Sydney', 'slug' => 'services/full-bathroom-makeover-sydney', 'template' => 'page-templates/page-full-bathroom-makeover-sydney.php' ),
        array( 'title' => 'Property Manager Services Sydney', 'slug' => 'services/property-manager-bathroom-services-sydney', 'template' => 'page-templates/page-property-manager-bathroom-services-sydney.php' ),
        array( 'title' => 'Stained Bathtub Resurfacing Sydney', 'slug' => 'services/stained-bathtub-resurfacing-sydney', 'template' => 'page-templates/page-stained-bathtub-resurfacing-sydney.php' ),
        array( 'title' => 'Peeling Bathtub Resurfacing Sydney', 'slug' => 'services/peeling-bathtub-resurfacing-sydney', 'template' => 'page-templates/page-peeling-bathtub-resurfacing-sydney.php' ),
        array( 'title' => 'Bathroom Tile Resurfacing Sydney',   'slug' => 'services/bathroom-tile-resurfacing-sydney', 'template' => 'page-templates/page-bathroom-tile-resurfacing-sydney.php' ),
        array( 'title' => 'Mouldy Shower Grout Sydney',  'slug' => 'services/mouldy-shower-grout-sydney', 'template' => 'page-templates/page-mouldy-shower-grout-sydney.php' ),
        array( 'title' => 'Cracked Grout Repair Sydney', 'slug' => 'services/cracked-grout-repair-sydney', 'template' => 'page-templates/page-cracked-grout-repair-sydney.php' ),
        array( 'title' => 'Mouldy Silicone Replacement Sydney', 'slug' => 'services/mouldy-silicone-replacement-sydney', 'template' => 'page-templates/page-mouldy-silicone-replacement-sydney.php' ),
        array( 'title' => 'Basin Chip Repair Sydney',    'slug' => 'services/basin-chip-repair-sydney', 'template' => 'page-templates/page-basin-chip-repair-sydney.php' ),
        array( 'title' => 'Vanity Respray Sydney',       'slug' => 'services/vanity-respray-sydney', 'template' => 'page-templates/page-vanity-respray-sydney.php' ),
    );

    foreach ( $pages as $p ) {
        $slug_parts = explode( '/', $p['slug'] );
        $page_slug  = end( $slug_parts );
        $existing   = get_page_by_path( $p['slug'] );
        if ( $existing ) continue;

        $parent_id = 0;
        if ( count( $slug_parts ) > 1 ) {
            $parent = get_page_by_path( $slug_parts[0] );
            if ( ! $parent ) {
                $parent_id = wp_insert_post( array(
                    'post_title'  => 'Services',
                    'post_name'   => 'services',
                    'post_status' => 'publish',
                    'post_type'   => 'page',
                ) );
            } else {
                $parent_id = $parent->ID;
            }
        }

        wp_insert_post( array(
            'post_title'  => $p['title'],
            'post_name'   => $page_slug,
            'post_status' => 'publish',
            'post_type'   => 'page',
            'post_parent' => $parent_id,
            'meta_input'  => array( '_wp_page_template' => $p['template'] ),
        ) );
    }

    /**
     * SAFE: Only set pretty permalinks if WordPress is using DEFAULT (empty/plain).
     *
     * This protects existing sites with custom permalink structures (e.g. live site,
     * plugin-managed permalinks). Only fresh WP installs (wp-now, new staging) get
     * the auto-fix.
     *
     *   Live site (already /%postname%/): condition false → no change ✓
     *   Live site (custom plugin perms):  condition false → no change ✓ (preserved)
     *   Fresh wp-now (empty):             condition true  → set to /%postname%/ ✓
     */
    if ( get_option( 'permalink_structure' ) === '' ) {
        update_option( 'permalink_structure', '/%postname%/' );
    }

    flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'timeless_create_pages' );

/**
 * Self-healing: also run page creation on admin_init.
 *
 * Why: `after_switch_theme` doesn't fire when the user "Replace current
 * with uploaded" during a theme re-upload. That means new pages added
 * to the theme in updates (like FAQs) never get created.
 *
 * This runs on every wp-admin page load but only CREATES pages if they
 * don't exist. The check uses get_page_by_path() which is cached, so
 * the overhead is negligible (~1-2ms per admin page load).
 *
 * Only runs in wp-admin so frontend visitors never trigger it.
 */
function timeless_ensure_pages_exist() {
    // Only run in admin context, not AJAX, not cron
    if ( ! is_admin() || wp_doing_ajax() || wp_doing_cron() ) {
        return;
    }

    // Rate limit: only check once per hour via transient
    if ( get_transient( 'timeless_pages_checked' ) ) {
        return;
    }
    set_transient( 'timeless_pages_checked', 1, HOUR_IN_SECONDS );

    // Quick check: does the FAQs page exist? If yes, assume all pages OK.
    // If no, run the full creation routine (which skips existing pages anyway).
    if ( ! get_page_by_path( 'faqs' ) ) {
        timeless_create_pages();
    }

    // Self-heal permalinks ONLY if WordPress is using completely default (empty).
    // Never overrides custom permalink structures (e.g. live site, plugin-managed).
    if ( get_option( 'permalink_structure' ) === '' ) {
        update_option( 'permalink_structure', '/%postname%/' );
        flush_rewrite_rules();
    }
}

/**
 * Aggressive permalink self-heal — runs on every `init` until permalinks are set.
 *
 * Why a separate hook from after_switch_theme:
 * Some WordPress install methods (notably wp-now for local dev) bypass the
 * after_switch_theme hook by setting the active theme directly in the database.
 * This means our theme activation code never runs, and permalinks stay default.
 *
 * This hook fires on every WP request but exits in <1ms once permalinks are set
 * (single get_option call, which is cached). Negligible overhead.
 *
 * Like the other permalink fix: only acts on TRULY EMPTY structure.
 * Never overrides custom permalink configurations on production.
 */
function timeless_ensure_permalinks_pretty() {
    // Skip on AJAX/cron to avoid race conditions
    if ( wp_doing_ajax() || wp_doing_cron() ) {
        return;
    }

    // Only set if completely empty (default ugly URLs).
    // This protects custom permalink structures on production.
    if ( get_option( 'permalink_structure' ) === '' ) {
        update_option( 'permalink_structure', '/%postname%/' );
        flush_rewrite_rules( false );
    }
}
add_action( 'init', 'timeless_ensure_permalinks_pretty', 5 );
add_action( 'admin_init', 'timeless_ensure_pages_exist' );

/* ────��──────────────────────────────────────
   2. ENQUEUE SCRIPTS & STYLES
   ───────────────────────────────────────────── */
function timeless_scripts() {
    /**
     * COMPILED Tailwind CSS v4.2.4 — replaces the previous CDN runtime.
     * Source: src/main.css → built via `npm run build` → assets/main.min.css
     *
     * Performance gain vs CDN:
     *   - CDN runtime: 409 KB (uncompressed) / ~50 KB gzipped
     *   - Compiled v4: ~61 KB (uncompressed) / ~11 KB gzipped (85% smaller)
     *   - Plus: no JIT runtime in browser (eliminates ~250-500ms of parse/exec)
     *
     * Cache busting: file modification time so browsers re-fetch only when the file changes.
     */
    $tailwind_path = get_template_directory() . '/assets/main.min.css';
    $tailwind_url  = get_template_directory_uri() . '/assets/main.min.css';
    $tailwind_ver  = file_exists( $tailwind_path ) ? filemtime( $tailwind_path ) : '1.0.0';
    wp_enqueue_style( 'timeless-tailwind', $tailwind_url, array(), $tailwind_ver );

    /**
     * Inter — Self-hosted variable font subset (~99 KB, all weights via wght axis).
     *
     * Replaces Google Fonts CDN. Eliminates two third-party DNS+TLS lookups
     * (fonts.googleapis.com + fonts.gstatic.com) and 6+ separate weight requests
     * (~200-300 KB over the wire) with one local request to the same origin.
     *
     * The font is the official Inter Variable from rsms/inter v4, subset to
     * Latin (Basic Latin + Latin-1 + essential punctuation/currency). wght axis
     * preserved continuous 100..900, opsz axis preserved 14..32 for optical
     * sizing. No italic variant — theme has zero italic usage.
     *
     * Tailwind classes like `font-bold` (700), `font-extrabold` (800), etc. all
     * resolve to the correct visual weight via the variable axis.
     *
     * To regenerate (after font version bump or unicode-range change):
     *   1. curl -L -o /tmp/Inter-test.woff2 \
     *        "https://github.com/rsms/inter/raw/v4.0/docs/font-files/InterVariable.woff2"
     *   2. python3 scripts/subset-inter.py
     */
    $inter_font_path = get_template_directory() . '/assets/fonts/inter-variable-latin.woff2';
    if ( file_exists( $inter_font_path ) ) {
        $inter_font_url = get_template_directory_uri() . '/assets/fonts/inter-variable-latin.woff2';
        $inter_font_ver = filemtime( $inter_font_path );

        wp_register_style( 'inter-self-hosted', false );
        wp_enqueue_style( 'inter-self-hosted' );
        wp_add_inline_style( 'inter-self-hosted', "
            @font-face {
                font-family: 'Inter';
                font-style: normal;
                /* Variable axis covers all weights from 100 (thin) to 900 (black).
                   Browser auto-detects variations from the woff2 — no `format('woff2-variations')`
                   hint needed (that token was a 2016-era vendor proposal, never standardized). */
                font-weight: 100 900;
                font-display: swap;
                src: url(" . esc_url( $inter_font_url ) . "?v=$inter_font_ver) format('woff2');
            }
        " );
    }
    // If font file is missing, NO @font-face is emitted → tailwind config's
    // 'system-ui, sans-serif' fallback chain takes over silently. Prevents
    // a 404'd @font-face from blocking text rendering for `font-display: swap`'s
    // brief swap window.

    /**
     * Material Symbols — Self-hosted subset (96 icons, ~10 KB).
     *
     * Replaces Google Fonts CDN (1.06 MB shipped). 99.7% size reduction.
     * Variable font instanced at wght=400/GRAD=0/opsz=24, FILL axis kept as 0..1
     * so `font-variation-settings:'FILL' 1` still works for filled-icon variants.
     *
     * Implementation: subset font has only the icons we use, mapped to PUA codepoints
     * (no GSUB ligatures for icon names like "home" → glyph). The PHP filter
     * timeless_replace_icon_ligatures() converts
     * <span class="material-symbols-outlined">home</span> →
     * <span class="material-symbols-outlined">&#xe9b2;</span> at output time.
     *
     * Source markup stays the same (icon names) — easy to maintain. Browser receives
     * codepoints — works with the tiny font.
     *
     * To regenerate after adding/removing icons:
     *   1. bash scripts/audit-icons.sh
     *   2. python3 scripts/subset-material-symbols.py
     * See BUILD.md "Material Symbols Icon Subset Pipeline" for details.
     */
    $ms_font_path = get_template_directory() . '/assets/fonts/material-symbols-subset.woff2';
    if ( file_exists( $ms_font_path ) ) {
        $ms_font_url = get_template_directory_uri() . '/assets/fonts/material-symbols-subset.woff2';
        $ms_font_ver = filemtime( $ms_font_path );

        wp_register_style( 'material-symbols-subset', false );
        wp_enqueue_style( 'material-symbols-subset' );
        wp_add_inline_style( 'material-symbols-subset', "
        @font-face {
            font-family: 'Material Symbols Outlined';
            font-style: normal;
            font-weight: 400;
            font-display: block;
            src: url(" . esc_url( $ms_font_url ) . "?v=$ms_font_ver) format('woff2');
        }
        /* CRITICAL: bind the class to the @font-face. Without this, .material-symbols-outlined
           inherits the body font (Inter), which has no glyphs at the icon codepoints, so the
           browser falls back to system fonts and renders garbage at U+F0BE etc.
           (Google Fonts CDN CSS used to do this for us — when we self-hosted we dropped it.)

           Wrapped in @layer base so Tailwind v4 utility classes (text-2xl, text-base, etc.)
           still win for font-size. Without the layer, this would beat utilities and every
           icon would fall back to its parent's font-size. */
        @layer base {
            .material-symbols-outlined {
                font-family: 'Material Symbols Outlined', sans-serif;
                font-weight: normal;
                font-style: normal;
                font-size: 24px;
                line-height: 1;
                letter-spacing: normal;
                text-transform: none;
                display: inline-block;
                white-space: nowrap;
                word-wrap: normal;
                direction: ltr;
                -webkit-font-feature-settings: 'liga';
                -webkit-font-smoothing: antialiased;
            }
        }
    " );
    } // end Material Symbols file_exists guard
    // If MS font is missing, no @font-face is emitted — icons will render as
    // their literal codepoint chars in fallback fonts (notdef boxes), making
    // the missing-deploy state visually obvious instead of silently broken.

    // Theme stylesheet (animations, mobile menu, FAQ accordion)
    wp_enqueue_style( 'timeless-style', get_stylesheet_uri(), array(), '1.0.0' );

    // Theme JavaScript (mobile menu, FAQ toggle, scroll reveal, smooth scroll)
    wp_enqueue_script( 'timeless-main', get_template_directory_uri() . '/js/main.js', array(), '1.0.0', true );
}
add_action( 'wp_enqueue_scripts', 'timeless_scripts' );

/**
 * Material Symbols ligature → codepoint replacement (output buffer filter).
 *
 * Why: We use a ~10 KB icon font subset that contains ONLY the 96 icons we use,
 * stored at their Unicode codepoints (no GSUB ligature lookup table — dropping that
 * is most of the savings; the FILL variable axis is preserved for filled variants).
 *
 * The browser still receives <span class="material-symbols-outlined">home</span>
 * in source code (easier to maintain), but this filter converts it to
 * <span class="material-symbols-outlined">&#xe9b2;</span> on the way out.
 *
 * Performance: regex runs once per page render (~1-3ms). With cache plugins
 * (WP Rocket, etc.) this runs once per cache generation, then served from
 * cache for all subsequent visitors → effectively zero overhead.
 *
 * Failure mode: if an icon name isn't in the codepoints map, the original
 * span is preserved (will render as text — visible bug, easy to spot).
 */
function timeless_replace_icon_ligatures( $html ) {
    static $codepoints = null;
    if ( null === $codepoints ) {
        $codepoints = include get_template_directory() . '/inc/material-symbols-codepoints.php';
    }
    if ( ! is_array( $codepoints ) ) return $html;

    // Regex tolerates BOTH double-quoted and single-quoted class attributes.
    // The symmetric lookarounds `(?<![\w-])material-symbols-outlined(?![\w-])` prevent
    // false-matching prefixed/suffixed classes like `material-symbols-outlined-extra`
    // (the standard `\b` word-boundary doesn't help — `-` is non-word and matches `\b`,
    // so `\b` at end of token is satisfied by a following hyphen, e.g.
    // `class="my-material-symbols-outlined-rounded"` would falsely match without these).
    // Capture group 1: the opening <span ...>
    // Capture group 2: the icon name (must start with [a-z], may contain digits + underscores)
    // Capture group 3: the closing </span>
    return preg_replace_callback(
        '/(<span\b[^>]*\bclass=(?:"[^"]*(?<![\w-])material-symbols-outlined(?![\w-])[^"]*"|\'[^\']*(?<![\w-])material-symbols-outlined(?![\w-])[^\']*\')[^>]*>)([a-z][a-z0-9_]*)(<\/span>)/i',
        function ( $matches ) use ( $codepoints ) {
            $name = $matches[2];
            if ( isset( $codepoints[ $name ] ) ) {
                return $matches[1] . '&#x' . $codepoints[ $name ] . ';' . $matches[3];
            }
            return $matches[0]; // Icon name not in map — leave unchanged for visibility
        },
        $html
    );
}

/**
 * WebP picture-tag rewrite (output buffer filter).
 *
 * Why: images/** /*.webp companions exist alongside many JPG/PNG files
 * (generated by scripts/convert-images-to-webp.py — only when WebP beats the
 * source by size). This filter wraps `<img src="x.jpg" ...>` →
 * `<picture><source srcset="x.jpg.webp" type="image/webp"><img src="x.jpg" ...></picture>`
 * so WebP-capable browsers (96%+ of users) get the smaller file while older
 * browsers transparently fall through to the original JPG/PNG.
 *
 * Naming convention: `images/foo/bar.jpg` ↔ `images/foo/bar.jpg.webp` (double
 * extension). Originals untouched, easy rollback (delete the .webp files).
 *
 * Edge cases handled:
 *   - Skips <img> without a matching .webp companion file (graceful no-op).
 *   - Skips data: URIs and external URLs (only theme-relative paths).
 *   - Preserves all attributes on the original <img> (loading, srcset, alt, …).
 *   - Naturally won't double-wrap because the regex captures `<img...>` and
 *     wraps the WHOLE thing in <picture> — re-running the regex on already-
 *     wrapped output won't re-match (because the inner img is now inside
 *     <picture>...</picture> which makes the surrounding context different).
 *   - Cache-busted URLs (`?v=1`) currently fall through unwrapped — the regex
 *     requires the extension to immediately precede the closing quote. If the
 *     theme ever adds query strings to image URLs, extend the regex.
 *
 * Limitation: only handles theme-bundled images (`get_template_directory_uri()`).
 * Future WP Media Library uploads (`/wp-content/uploads/`) won't get WebP
 * delivery via this filter — would need a separate pipeline that runs on
 * `add_attachment` to generate companions, plus path-resolution extension here.
 */
function timeless_webp_picture_filter( $html ) {
    static $template_dir = null, $template_url = null;
    if ( null === $template_dir ) {
        $template_dir = get_template_directory();
        $template_url = get_template_directory_uri();
    }

    // Widths generated by scripts/generate-responsive-images.py — kept in sync.
    $RESPONSIVE_WIDTHS = array( 400, 800, 1600 );
    // Default sizes attribute. Tells the browser how WIDE the image renders at
    // each breakpoint so it can pick the right srcset variant. Hero images on
    // this theme render full-width on mobile, ~50vw on tablet, ~33vw on desktop.
    $DEFAULT_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

    return preg_replace_callback(
        '/<img\b(?<attrs_before>[^>]*?)\bsrc=(?<q>["\'])(?<src>[^"\']+\.(?:jpe?g|png))\k<q>(?<attrs_after>[^>]*)>/i',
        function ( $m ) use ( $template_dir, $template_url, $RESPONSIVE_WIDTHS, $DEFAULT_SIZES ) {
            $img_tag = $m[0];
            $src     = $m['src'];

            // Skip external URLs or data URIs
            if ( strpos( $src, 'data:' ) === 0 ) return $img_tag;
            if ( preg_match( '#^https?://#', $src ) && strpos( $src, $template_url ) !== 0 ) {
                return $img_tag;
            }

            // Resolve local path
            $local_path = $template_dir . '/' . ltrim( str_replace( $template_url, '', $src ), '/' );
            $webp_path  = $local_path . '.webp';

            // No webp companion = nothing we can do, leave original
            if ( ! file_exists( $webp_path ) ) {
                return $img_tag;
            }

            // ── Detect responsive variants (image-400w.jpg, -800w, -1600w + .webp companions)
            // If any exist, build a richer <picture> with srcset+sizes for browser to pick.
            $base_path = preg_replace( '/(\.(jpe?g|png))$/i', '', $local_path );  // strip extension
            $base_url  = preg_replace( '/(\.(jpe?g|png))$/i', '', $src );
            $ext       = '';
            if ( preg_match( '/(\.(jpe?g|png))$/i', $src, $ext_match ) ) {
                $ext = $ext_match[0];
            }

            $webp_srcset = array();
            $jpg_srcset  = array();
            foreach ( $RESPONSIVE_WIDTHS as $w ) {
                $variant_jpg  = $base_path . '-' . $w . 'w' . $ext;
                $variant_webp = $variant_jpg . '.webp';
                if ( file_exists( $variant_jpg ) && file_exists( $variant_webp ) ) {
                    $variant_jpg_url  = $base_url . '-' . $w . 'w' . $ext;
                    $variant_webp_url = $variant_jpg_url . '.webp';
                    $webp_srcset[] = esc_url( $variant_webp_url ) . ' ' . $w . 'w';
                    $jpg_srcset[]  = esc_url( $variant_jpg_url ) . ' ' . $w . 'w';
                }
            }

            // Branch 1: We have responsive variants → emit full <picture> with multi-source srcset.
            // IMPORTANT: every entry in srcset must have a `w` descriptor when using `sizes`. Mixing
            // descriptor-having and bare URLs leaves browsers free to ignore `sizes` entirely and
            // pick the bare URL (the largest/default), which defeats the whole optimization.
            // The original full-size image stays available as the <img src="..."> fallback for
            // browsers that don't support srcset (very old IE, etc.).
            if ( ! empty( $webp_srcset ) ) {
                $webp_srcset_str = implode( ', ', $webp_srcset );
                $jpg_srcset_str  = implode( ', ', $jpg_srcset );

                // Inject srcset+sizes into the original <img> for non-webp browsers
                $img_with_srcset = $img_tag;
                if ( ! preg_match( '/\bsrcset=/i', $img_with_srcset ) ) {
                    $img_with_srcset = preg_replace(
                        '/<img\b/i',
                        '<img srcset="' . $jpg_srcset_str . '" sizes="' . $DEFAULT_SIZES . '"',
                        $img_with_srcset,
                        1
                    );
                }

                return '<picture>'
                     . '<source type="image/webp" srcset="' . $webp_srcset_str . '" sizes="' . $DEFAULT_SIZES . '">'
                     . $img_with_srcset
                     . '</picture>';
            }

            // Branch 2: No responsive variants — fall back to single-source webp wrap (existing behavior)
            $webp_url = $src . '.webp';
            return '<picture><source srcset="' . esc_url( $webp_url ) . '" type="image/webp">' . $img_tag . '</picture>';
        },
        $html
    );
}

/** Combined output filter — runs all theme HTML transformations on flush. */
function timeless_combined_output_filter( $html ) {
    $html = timeless_replace_icon_ligatures( $html );
    $html = timeless_webp_picture_filter( $html );
    return $html;
}

/** Start output buffering early; chain icon + WebP filters on flush.
 *  Skip for non-HTML responses (admin, AJAX, cron, JSON, RSS/Atom feeds, REST API). */
function timeless_start_icon_buffer() {
    if ( is_admin() || wp_doing_ajax() || wp_doing_cron() || wp_is_json_request() || is_feed() ) {
        return;
    }
    ob_start( 'timeless_combined_output_filter' );
}
add_action( 'template_redirect', 'timeless_start_icon_buffer', 1 );

/* ────────────────────────────���────────────────
   3. CUSTOMIZER — Editable Business Settings
   ───────────────────────────────────────────── */
function timeless_customizer( $wp_customize ) {

    // Section: Business Details
    $wp_customize->add_section( 'timeless_business', array(
        'title'    => __( 'Business Details', 'timeless' ),
        'priority' => 30,
    ) );

    // Phone Number
    $wp_customize->add_setting( 'timeless_phone', array(
        'default'           => '0451 110 154',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'timeless_phone', array(
        'label'   => __( 'Phone Number (display)', 'timeless' ),
        'section' => 'timeless_business',
        'type'    => 'text',
    ) );

    // Phone Number (tel: link format)
    $wp_customize->add_setting( 'timeless_phone_link', array(
        'default'           => '+61451110154',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'timeless_phone_link', array(
        'label'       => __( 'Phone Number (tel: format, e.g. +61412345678)', 'timeless' ),
        'section'     => 'timeless_business',
        'type'        => 'text',
    ) );

    // NSW Licence Number — leave empty until you hold a contractor licence.
    // Under NSW Home Building Act 1989, residential work $5,000 or less does
    // not require a licence. Only display a licence number once you hold one.
    $wp_customize->add_setting( 'timeless_licence', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'timeless_licence', array(
        'label'       => __( 'NSW Licence Number (leave blank if unlicensed)', 'timeless' ),
        'description' => __( 'Only fill in once you hold a valid NSW contractor licence. Required for residential work over $5,000.', 'timeless' ),
        'section'     => 'timeless_business',
        'type'        => 'text',
    ) );

    // Email Address
    $wp_customize->add_setting( 'timeless_email', array(
        'default'           => 'info@timelessresurfacing.com.au',
        'sanitize_callback' => 'sanitize_email',
    ) );
    $wp_customize->add_control( 'timeless_email', array(
        'label'   => __( 'Business Email', 'timeless' ),
        'section' => 'timeless_business',
        'type'    => 'email',
    ) );

    // ABN
    $wp_customize->add_setting( 'timeless_abn', array(
        'default'           => '30 412 161 602',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'timeless_abn', array(
        'label'   => __( 'ABN', 'timeless' ),
        'section' => 'timeless_business',
        'type'    => 'text',
    ) );

    // ─── Google Reviews Section ────────────────────────────────────
    $wp_customize->add_section( 'timeless_google_reviews', array(
        'title'       => __( 'Google Reviews', 'timeless' ),
        'priority'    => 35,
        'description' => __( 'Self-hosted Google Places API integration. No third-party widgets, no paywall. <br><br><strong>Setup (one-time, ~10 min):</strong><br>1. Visit <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer">Google Cloud Console</a>, create a project, enable "Places API" (free tier: 100K requests/month).<br>2. Create an API key under "Credentials". Restrict it to your domain for security.<br>3. Find your Place ID at <a href="https://developers.google.com/maps/documentation/places/web-service/place-id" target="_blank" rel="noopener noreferrer">Google\'s Place ID Finder</a> by searching for your business.<br>4. Paste both below.<br><br>Reviews refresh every 24 hours via WordPress transients (cached, no per-request API calls).', 'timeless' ),
    ) );

    $wp_customize->add_setting( 'timeless_google_api_key', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
        'capability'        => 'manage_options', // Sensitive — admin only
    ) );
    $wp_customize->add_control( 'timeless_google_api_key', array(
        'label'       => __( 'Google Places API Key', 'timeless' ),
        'section'     => 'timeless_google_reviews',
        'type'        => 'text',
        'description' => __( 'Restrict this key to HTTP referrer = your domain in Google Cloud Console.', 'timeless' ),
    ) );

    $wp_customize->add_setting( 'timeless_google_place_id', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'timeless_google_place_id', array(
        'label'       => __( 'Business identifier (optional)', 'timeless' ),
        'section'     => 'timeless_google_reviews',
        'type'        => 'text',
        'description' => __( 'Accepts Place ID, business name, or Maps URL. Service-area businesses are often NOT yet indexed in the Places API — leave this blank and use the static reviews textarea below instead. We fall back to that when the API returns no results.', 'timeless' ),
    ) );

    // Public-facing GBP link — used for the "See all reviews on Google" CTA.
    // Works even when business isn't in Places API yet (most common case for trades).
    $wp_customize->add_setting( 'timeless_google_business_url', array(
        'default'           => '',
        'sanitize_callback' => 'esc_url_raw',
    ) );
    $wp_customize->add_control( 'timeless_google_business_url', array(
        'label'       => __( 'Google Business Profile URL', 'timeless' ),
        'section'     => 'timeless_google_reviews',
        'type'        => 'url',
        'description' => __( 'The public link to your reviews on Google. Visit your Google Business Profile or Maps listing → click "Share" → copy the link. Used for the "See all reviews on Google" button below the review cards.', 'timeless' ),
    ) );

    // Static curated reviews — most reliable path for service-area trades businesses.
    // Format: one review per line, pipe-separated:
    //   Author Name | Time label | Rating (1-5) | Review text
    $wp_customize->add_setting( 'timeless_reviews_static', array(
        'default'           => '',
        'sanitize_callback' => 'wp_kses_post',  // Allow basic HTML, strip script/onclick
    ) );
    $wp_customize->add_control( 'timeless_reviews_static', array(
        'label'       => __( 'Curated reviews (static)', 'timeless' ),
        'section'     => 'timeless_google_reviews',
        'type'        => 'textarea',
        'description' => __( '<strong>Format:</strong> one review per line, pipe-separated. Leave a single trailing space if the field looks like one column.<br><br><code>Author Name | Time label | Rating | Review text</code><br><br><strong>Example:</strong><br><code>Andy T. | 2 weeks ago | 5 | Marko came by and did a good job regrouting my shower tiles.</code><br><br>Render up to 6 reviews. If both this and Place ID are filled, the Places API takes priority and this is the fallback.', 'timeless' ),
    ) );

    // ─── Analytics Section ────────────────────────────────────────
    $wp_customize->add_section( 'timeless_analytics', array(
        'title'       => __( 'Analytics', 'timeless' ),
        'priority'    => 36,
        'description' => __( 'Tracking IDs for Google Analytics 4 and Microsoft Clarity. Both are free. Both skip logged-in admins automatically (so your own visits don\'t pollute the data).<br><br><strong>GA4 (Google Analytics 4):</strong> conversion + traffic dashboard. <a href="https://analytics.google.com" target="_blank" rel="noopener">analytics.google.com</a> → Admin → Data Streams → copy the <code>G-XXXXXXXXXX</code> ID.<br><br><strong>Microsoft Clarity:</strong> heatmaps + session replays. Way more useful for UX than GA4. <a href="https://clarity.microsoft.com" target="_blank" rel="noopener">clarity.microsoft.com</a> → New Project → Settings → copy the 10-character project ID.', 'timeless' ),
    ) );

    $wp_customize->add_setting( 'timeless_ga4_id', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
        'capability'        => 'manage_options',  // Admin-only field
    ) );
    $wp_customize->add_control( 'timeless_ga4_id', array(
        'label'       => __( 'Google Analytics 4 Measurement ID', 'timeless' ),
        'section'     => 'timeless_analytics',
        'type'        => 'text',
        'description' => __( 'Format: <code>G-XXXXXXXXXX</code> (starts with G- followed by 10 alphanumeric chars). Leave blank to disable.', 'timeless' ),
    ) );

    $wp_customize->add_setting( 'timeless_clarity_id', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
        'capability'        => 'manage_options',
    ) );
    $wp_customize->add_control( 'timeless_clarity_id', array(
        'label'       => __( 'Microsoft Clarity Project ID', 'timeless' ),
        'section'     => 'timeless_analytics',
        'type'        => 'text',
        'description' => __( '10-character lowercase alphanumeric ID (e.g. <code>p7q3k9z2x1</code>). Leave blank to disable.', 'timeless' ),
    ) );
}
add_action( 'customize_register', 'timeless_customizer' );

/* ─────────────────────────────────────────────
   3b. GOOGLE REVIEWS — Self-hosted Places API integration
   ─────────────────────────────────────────────
   Why custom (not Trustindex/Featurable):
     - Zero third-party CDN requests (matches our self-host-everything pattern)
     - Free (Google Places API has 100K-request/month free tier; with 24h cache
       on a small site we use ~30 requests/month total)
     - Full design control (renders with our Tailwind cards, Inter font, palette)
     - Privacy: no third-party trackers, no paywall surprise

   Strategy:
     - WordPress transient caches reviews for 24 hours (DAY_IN_SECONDS).
     - On cache miss, fetch from Google Places API server-side.
     - Render directly in PHP — no JS, no CLS, no async injection.
     - Graceful fallback: if API fails or keys not set, render a "See reviews
       on Google" link to the GBP listing instead of an empty section.
   ───────────────────────────────────────────── */

/**
 * Resolve a user-pasted business identifier to a real Google Place ID.
 *
 * Accepts:
 *   - Place ID directly (`ChIJ...`)        — passes through unchanged
 *   - Maps URL (`https://...maps/place/...`) — extracts business name segment
 *   - Plain business name text             — used as-is
 *
 * Non-Place-ID inputs go through Google's `findplacefromtext` API once,
 * then the resolved Place ID is cached in a long-lived transient so we
 * never re-query (saves the API call quota). Cache invalidates on
 * Customizer re-save.
 *
 * Returns Place ID string, or false on failure.
 */
function timeless_resolve_place_id( $input, $api_key ) {
    $input = trim( $input );
    if ( empty( $input ) || empty( $api_key ) ) {
        return false;
    }

    // Pass-through if already a Place ID (Google's documented prefix)
    if ( strpos( $input, 'ChIJ' ) === 0 ) {
        return $input;
    }

    // Try long-lived resolution cache (keyed by input hash so changes invalidate)
    $cache_key = 'timeless_resolved_place_id_' . md5( $input );
    $cached    = get_transient( $cache_key );
    if ( false !== $cached ) {
        return is_array( $cached ) && isset( $cached['_failed'] ) ? false : $cached;
    }

    // Extract business-name search term:
    //   - From Maps URL: `.../maps/place/Business+Name/data=...` → "Business Name"
    //   - From plain text: use as-is
    $query = $input;
    if ( preg_match( '#/maps/place/([^/]+)#', $input, $m ) ) {
        $query = str_replace( '+', ' ', rawurldecode( $m[1] ) );
    }

    $api_url = sprintf(
        'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=%s&inputtype=textquery&fields=place_id&key=%s',
        rawurlencode( $query ),
        rawurlencode( $api_key )
    );

    $response = wp_remote_get( $api_url, array(
        'timeout' => 5,
        // Send Referer header matching your domain so Google's HTTP-referrer
        // API key restriction accepts the call (server-side requests don't
        // automatically include Referer; without it, restricted keys are denied).
        'headers' => array( 'Referer' => home_url() ),
    ) );
    if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
        set_transient( $cache_key, array( '_failed' => true ), HOUR_IN_SECONDS );
        return false;
    }

    $body = json_decode( wp_remote_retrieve_body( $response ), true );
    $place_id = $body['candidates'][0]['place_id'] ?? '';

    if ( empty( $place_id ) ) {
        set_transient( $cache_key, array( '_failed' => true ), HOUR_IN_SECONDS );
        return false;
    }

    // Cache the resolved Place ID for 30 days — businesses don't change Place IDs
    set_transient( $cache_key, $place_id, 30 * DAY_IN_SECONDS );
    return $place_id;
}

/** Fetch Google reviews (cached). Returns array of reviews + rating + count, or false on failure. */
function timeless_get_google_reviews() {
    $cache_key = 'timeless_google_reviews_v1';
    $cached    = get_transient( $cache_key );
    if ( false !== $cached ) {
        // Distinguish "cached failure" sentinel from real success data
        if ( is_array( $cached ) && isset( $cached['_failed'] ) ) {
            return false;
        }
        return $cached;
    }

    $api_key      = trim( get_theme_mod( 'timeless_google_api_key', '' ) );
    $raw_place_id = trim( get_theme_mod( 'timeless_google_place_id', '' ) );
    if ( empty( $api_key ) || empty( $raw_place_id ) ) {
        return false;
    }

    // Resolve user input to a real Place ID (handles ChIJ-prefix, Maps URLs, business names)
    $place_id = timeless_resolve_place_id( $raw_place_id, $api_key );
    if ( ! $place_id ) {
        return false;
    }

    // ── NEW Places API (places.googleapis.com/v1/places/{id}) ──────────
    // The legacy Places API endpoint (maps.googleapis.com/maps/api/place/details)
    // returns NOT_FOUND for many newer service-area businesses even when the Place ID
    // is valid. The new Places API has those records — and is what Google is pushing
    // forward as the legacy one is deprecated.
    //
    // Differences vs legacy:
    //   - Endpoint: places.googleapis.com/v1/places/{place_id}
    //   - Auth via header (X-Goog-Api-Key) instead of ?key= query param
    //   - X-Goog-FieldMask header is REQUIRED (explicit field selection)
    //   - camelCase response: userRatingCount, googleMapsUri, displayName.text,
    //     authorAttribution.{displayName,uri,photoUri}, text.text, etc.
    $url = 'https://places.googleapis.com/v1/places/' . rawurlencode( $place_id );
    $field_mask = 'id,displayName,reviews,rating,userRatingCount,googleMapsUri';

    $response = wp_remote_get( $url, array(
        'timeout' => 5,
        'headers' => array(
            'X-Goog-Api-Key'    => $api_key,
            'X-Goog-FieldMask'  => $field_mask,
            'Referer'           => home_url(),
        ),
    ) );

    if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
        // Cache a failure SENTINEL (not literal false) for 1 hour so we don't hammer
        // the API on every page hit. We can't cache `false` because get_transient()
        // returns false for "not set" — same as our cached failure → no backoff.
        set_transient( $cache_key, array( '_failed' => true ), HOUR_IN_SECONDS );
        return false;
    }

    $body = json_decode( wp_remote_retrieve_body( $response ), true );
    if ( empty( $body ) || empty( $body['id'] ) ) {
        set_transient( $cache_key, array( '_failed' => true ), HOUR_IN_SECONDS );
        return false;
    }

    // Normalize the new API's nested response into the flat shape our render function expects.
    // Each review's `text` and `displayName` come back as objects ({text, languageCode}); flatten them.
    $reviews_normalized = array();
    foreach ( ( $body['reviews'] ?? array() ) as $r ) {
        // Format publishTime (ISO 8601 UTC) into:
        //   - relative_time_description: precise days ("3 days ago" not Google's vague "a week ago")
        //   - publish_full_label: full Sydney-local timestamp for hover tooltip
        $publish_iso        = $r['publishTime'] ?? '';
        $publish_full_label = '';
        $relative_label     = $r['relativePublishTimeDescription'] ?? '';  // Google's default fallback
        if ( ! empty( $publish_iso ) ) {
            try {
                $dt = new DateTime( $publish_iso );
                $dt->setTimezone( new DateTimeZone( 'Australia/Sydney' ) );

                // Full timestamp for hover tooltip (e.g. "April 22, 2026 at 1:58 PM GMT+10")
                $offset = $dt->format( 'P' );
                if ( substr( $offset, -3 ) === ':00' ) {
                    $offset = substr( $offset, 0, -3 );  // Strip ":00" for cleaner "+10"
                }
                $publish_full_label = $dt->format( 'F j, Y \a\t g:i A' ) . ' GMT' . $offset;

                // Precise days-based relative label — overrides Google's vague defaults.
                $now      = new DateTime( 'now', new DateTimeZone( 'Australia/Sydney' ) );
                $days_ago = (int) $now->diff( $dt )->days;
                $hours    = (int) ( ( $now->getTimestamp() - $dt->getTimestamp() ) / 3600 );

                if ( $hours < 1 ) {
                    $relative_label = __( 'just now', 'timeless' );
                } elseif ( $hours < 24 ) {
                    $relative_label = sprintf( _n( '%d hour ago', '%d hours ago', $hours, 'timeless' ), $hours );
                } elseif ( $days_ago === 1 ) {
                    $relative_label = __( 'yesterday', 'timeless' );
                } elseif ( $days_ago < 30 ) {
                    $relative_label = sprintf( _n( '%d day ago', '%d days ago', $days_ago, 'timeless' ), $days_ago );
                } elseif ( $days_ago < 365 ) {
                    $months = (int) round( $days_ago / 30 );
                    $relative_label = sprintf( _n( '%d month ago', '%d months ago', $months, 'timeless' ), $months );
                } else {
                    $years = (int) round( $days_ago / 365 );
                    $relative_label = sprintf( _n( '%d year ago', '%d years ago', $years, 'timeless' ), $years );
                }
            } catch ( Exception $e ) {
                $publish_full_label = '';
                // Fall through with Google's default $relative_label
            }
        }

        $reviews_normalized[] = array(
            'author_name'               => $r['authorAttribution']['displayName'] ?? 'Google User',
            'author_url'                => $r['authorAttribution']['uri'] ?? '',
            'author_photo'              => $r['authorAttribution']['photoUri'] ?? '',
            'rating'                    => intval( $r['rating'] ?? 5 ),
            'relative_time_description' => $relative_label,
            'publish_full'              => $publish_full_label,  // For hover tooltip
            'text'                      => $r['text']['text'] ?? ( $r['originalText']['text'] ?? '' ),
        );
    }

    $data = array(
        'reviews'      => array_slice( $reviews_normalized, 0, 6 ),
        'rating'       => isset( $body['rating'] ) ? floatval( $body['rating'] ) : 0,
        'total'        => isset( $body['userRatingCount'] ) ? intval( $body['userRatingCount'] ) : 0,
        'business_url' => isset( $body['googleMapsUri'] ) ? esc_url_raw( $body['googleMapsUri'] ) : '',
    );

    set_transient( $cache_key, $data, DAY_IN_SECONDS );
    return $data;
}

/**
 * Dynamic AggregateRating JSON-LD fragment.
 *
 * Uses the same 24h-cached Google Places API call that feeds the reviews
 * widget. Returns empty string when no real review data exists, so we
 * never claim ratings we don't have. Google penalizes false rating
 * signals via Search Console schema warnings.
 *
 * Usage in JSON-LD scripts (inside Service/LocalBusiness object):
 *
 *   Last property:
 *     "address": { ... }<?php echo timeless_aggregate_rating_jsonld(); ?>
 *
 *   Middle property (followed by another property):
 *     "priceRange": "$$",<?php echo timeless_aggregate_rating_jsonld('middle'); ?>
 *     "hasOfferCatalog": { ... }
 *
 * @param string $position 'last' (default) emits leading comma. 'middle' emits trailing comma.
 * @return string JSON-LD fragment, or empty string if no real review data.
 */
function timeless_aggregate_rating_jsonld( $position = 'last' ) {
    $data = timeless_get_google_reviews();
    if ( ! $data || empty( $data['total'] ) || empty( $data['rating'] ) ) {
        return '';
    }
    $body = sprintf(
        '"aggregateRating": { "@type": "AggregateRating", "ratingValue": "%s", "reviewCount": "%d", "bestRating": "5" }',
        number_format( (float) $data['rating'], 1 ),
        (int) $data['total']
    );
    return $position === 'middle' ? ' ' . $body . ',' : ', ' . $body;
}

/**
 * Parse the static curated reviews textarea from Customizer.
 * Format per line: `Author | Time label | Rating (1-5) | Review text`
 * Returns array of reviews matching the Places API shape so render code
 * doesn't need to know which source it came from.
 */
function timeless_parse_static_reviews() {
    $raw = trim( get_theme_mod( 'timeless_reviews_static', '' ) );
    if ( empty( $raw ) ) return array();

    $reviews = array();
    foreach ( preg_split( '/\r\n|\r|\n/', $raw ) as $line ) {
        $line = trim( $line );
        if ( empty( $line ) ) continue;

        $parts = array_map( 'trim', explode( '|', $line ) );
        if ( count( $parts ) < 4 ) continue; // Skip malformed lines silently

        $reviews[] = array(
            'author_name'               => $parts[0],
            'relative_time_description' => $parts[1],
            'rating'                    => intval( $parts[2] ),
            // Re-join any extra `|` characters that were inside the review text
            'text'                      => implode( ' | ', array_slice( $parts, 3 ) ),
        );
    }

    return array_slice( $reviews, 0, 6 );  // Show up to 6
}

/** Render the Google Reviews widget. Tries Places API first, falls back to static
 *  curated reviews from Customizer, then to a "see reviews on Google" link. */
function timeless_render_google_reviews() {
    $data = timeless_get_google_reviews();

    // FALLBACK 1: Places API didn't return reviews (no key, business not yet indexed,
    // API failure, etc.) — try static curated reviews from Customizer textarea.
    if ( ! is_array( $data ) || empty( $data['reviews'] ) ) {
        $static_reviews = timeless_parse_static_reviews();
        if ( ! empty( $static_reviews ) ) {
            $business_url = trim( get_theme_mod( 'timeless_google_business_url', '' ) );
            // Synthesize a $data structure matching what Places API would return
            $rating_avg = array_sum( array_column( $static_reviews, 'rating' ) ) / count( $static_reviews );
            $data = array(
                'reviews'      => $static_reviews,
                'rating'       => round( $rating_avg, 1 ),
                'total'        => count( $static_reviews ),
                'business_url' => esc_url_raw( $business_url ),
            );
            // Fall through to the rendering block below
        }
    }

    // FALLBACK 2: No Places API data AND no static reviews — show "see reviews on Google" link.
    // Note: $data may be `false` (not an array), so we can't subscript it directly —
    // PHP 8.1+ would warn "Trying to access array offset on value of type bool".
    if ( ! is_array( $data ) || empty( $data['reviews'] ) ) {
        $configured_url = trim( get_theme_mod( 'timeless_google_business_url', '' ) );
        $fallback_business = ! empty( $configured_url )
            ? $configured_url
            : 'https://www.google.com/maps/search/' . rawurlencode( get_bloginfo( 'name' ) . ' Sydney' );
        $business_url = ( is_array( $data ) && ! empty( $data['business_url'] ) ) ? $data['business_url'] : $fallback_business;
        ?>
        <div class="text-center py-8">
            <p class="text-sm text-secondary mb-4">Read our reviews directly on Google.</p>
            <a href="<?php echo esc_url( $fallback_business ); ?>" target="_blank" rel="noopener"
               class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all">
                See Our Google Reviews
                <span class="material-symbols-outlined text-base" aria-hidden="true">open_in_new</span>
            </a>
        </div>
        <?php
        return;
    }

    $rating  = number_format( $data['rating'], 1 );
    $total   = $data['total'];
    $reviews = $data['reviews'];
    ?>
    <div class="timeless-reviews-carousel relative">
        <!-- Prev arrow (hidden when at start, JS toggles) -->
        <button type="button" class="timeless-reviews-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-primary hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:cursor-not-allowed -ml-2 sm:-ml-4"
                aria-label="<?php esc_attr_e( 'Previous reviews', 'timeless' ); ?>" disabled>
            <span class="material-symbols-outlined text-2xl" aria-hidden="true">chevron_left</span>
        </button>

        <!-- Scroll track: snap-aligned, one card visible on mobile, three on desktop -->
        <div class="timeless-reviews-track flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth py-2 px-1">
            <?php foreach ( $reviews as $r ) :
                $author       = $r['author_name'] ?? 'Google User';
                $initial      = mb_substr( $author, 0, 1, 'UTF-8' );
                $time_label   = $r['relative_time_description'] ?? '';
                $time_full    = $r['publish_full'] ?? '';  // For hover tooltip
                $stars        = max( 1, min( 5, intval( $r['rating'] ?? 5 ) ) );
                $text         = $r['text'] ?? '';
                $author_url   = $r['author_url'] ?? '';
                $author_photo = $r['author_photo'] ?? '';
            ?>
            <article class="timeless-review-card snap-start shrink-0 w-[calc(100%-2rem)] sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] bg-surface-container-low rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                     data-author="<?php echo esc_attr( $author ); ?>"
                     data-time="<?php echo esc_attr( $time_label ); ?>"
                     data-time-full="<?php echo esc_attr( $time_full ); ?>"
                     data-rating="<?php echo esc_attr( $stars ); ?>"
                     data-photo="<?php echo esc_attr( $author_photo ); ?>"
                     data-text="<?php echo esc_attr( $text ); ?>">
                <header class="flex items-start gap-3 mb-3">
                    <?php if ( $author_photo ) : ?>
                        <img src="<?php echo esc_url( $author_photo ); ?>" alt=""
                             loading="lazy" decoding="async" referrerpolicy="no-referrer"
                             class="w-12 h-12 rounded-full object-cover bg-primary/10 shrink-0"
                             width="48" height="48" />
                    <?php else : ?>
                        <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0" aria-hidden="true">
                            <?php echo esc_html( $initial ); ?>
                        </div>
                    <?php endif; ?>
                    <div class="flex-1 min-w-0">
                        <p class="font-bold text-primary text-sm truncate"><?php echo esc_html( $author ); ?></p>
                        <?php // Time label with hover tooltip showing full timestamp ?>
                        <p class="text-xs text-secondary timeless-tooltip <?php echo $time_full ? 'cursor-help' : ''; ?>"
                           <?php if ( $time_full ) : ?>data-tooltip="<?php echo esc_attr( $time_full ); ?>"<?php endif; ?>>
                            <?php echo esc_html( $time_label ); ?>
                        </p>
                    </div>
                    <?php // Google G logo + "Posted on Google" hover tooltip ?>
                    <span class="timeless-tooltip cursor-help shrink-0" data-tooltip="<?php esc_attr_e( 'Posted on Google', 'timeless' ); ?>">
                    <svg class="w-6 h-6 block" viewBox="0 0 48 48" aria-hidden="true">
                        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                    </svg>
                    </span><?php // end Google logo tooltip wrapper ?>
                </header>

                <div class="flex items-center gap-1.5 mb-3">
                    <div class="flex text-amber-400 text-base" aria-hidden="true">
                        <?php for ( $i = 0; $i < $stars; $i++ ) echo '&#9733;'; ?>
                    </div>
                    <span class="sr-only"><?php echo esc_html( $stars ); ?> out of 5 stars</span>
                    <?php // Verified badge with "Verified Customer" hover tooltip ?>
                    <span class="timeless-tooltip cursor-help inline-flex" data-tooltip="<?php esc_attr_e( 'Verified Customer', 'timeless' ); ?>">
                        <span class="material-symbols-outlined text-blue-500 text-base" style="font-variation-settings:'FILL' 1;" aria-hidden="true">verified</span>
                    </span>
                </div>

                <div class="timeless-review-body relative">
                    <p class="timeless-review-text text-sm text-primary leading-relaxed line-clamp-3"><?php echo esc_html( $text ); ?></p>
                    <button type="button" class="timeless-read-more text-xs text-primary hover:text-primary-soft mt-2 font-bold hidden inline-flex items-center gap-1">
                        <span class="timeless-read-more-label"><?php esc_html_e( 'Read more', 'timeless' ); ?></span>
                        <span class="material-symbols-outlined text-sm timeless-read-more-icon transition-transform" aria-hidden="true">expand_more</span>
                    </button>
                </div>
            </article>
            <?php endforeach; ?>
        </div>

        <!-- Next arrow -->
        <button type="button" class="timeless-reviews-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-primary hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:cursor-not-allowed -mr-2 sm:-mr-4"
                aria-label="<?php esc_attr_e( 'Next reviews', 'timeless' ); ?>">
            <span class="material-symbols-outlined text-2xl" aria-hidden="true">chevron_right</span>
        </button>
    </div>

    <!-- Review modal (full text popup, JS-injected per-click) — single instance for all cards on this section -->
    <div class="timeless-review-modal fixed inset-0 z-[200] hidden items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="timeless-review-modal-author" aria-hidden="true">
        <!-- Overlay (click to close) -->
        <div class="modal-overlay absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" data-close-modal></div>

        <!-- Modal card -->
        <div class="modal-card relative bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl transition-transform">
            <!-- Close button -->
            <button type="button" class="absolute top-3 right-3 w-9 h-9 rounded-full hover:bg-surface-container-low flex items-center justify-center text-secondary hover:text-primary transition-colors" data-close-modal aria-label="<?php esc_attr_e( 'Close review', 'timeless' ); ?>">
                <span class="material-symbols-outlined" aria-hidden="true">close</span>
            </button>

            <!-- Header: avatar + author + time + Google logo -->
            <header class="flex items-start gap-3 mb-4 pr-10">
                <div class="modal-avatar shrink-0"></div>
                <div class="flex-1 min-w-0">
                    <p id="timeless-review-modal-author" class="modal-author font-bold text-primary text-base truncate"></p>
                    <p class="modal-time text-xs text-secondary"></p>
                </div>
                <svg class="w-6 h-6 shrink-0 mt-1" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                </svg>
            </header>

            <!-- Stars + verified -->
            <div class="flex items-center gap-1.5 mb-4">
                <div class="modal-stars flex text-amber-400 text-lg" aria-hidden="true"></div>
                <span class="modal-stars-sr sr-only"></span>
                <span class="material-symbols-outlined text-blue-500 text-base" style="font-variation-settings:'FILL' 1;" aria-hidden="true" title="<?php esc_attr_e( 'Verified review', 'timeless' ); ?>">verified</span>
            </div>

            <!-- Full review text (no clamp) -->
            <p class="modal-text text-sm sm:text-base text-primary leading-relaxed whitespace-pre-line"></p>
        </div>
    </div>

    <?php if ( ! empty( $data['business_url'] ) ) : ?>
    <div class="text-center mt-8">
        <a href="<?php echo esc_url( $data['business_url'] ); ?>" target="_blank" rel="noopener"
           class="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-soft transition-colors">
            <?php
            // Show review count only when Places API gave us a real count higher than what we display.
            // For static curated reviews, the count we have IS what we display, so just say "See all our reviews".
            $shown = count( $data['reviews'] );
            if ( $total > $shown ) {
                printf( esc_html__( 'See all %d reviews on Google', 'timeless' ), intval( $total ) );
            } else {
                esc_html_e( 'See all our reviews on Google', 'timeless' );
            }
            ?>
            <span class="material-symbols-outlined text-base" aria-hidden="true">open_in_new</span>
        </a>
    </div>
    <?php endif; ?>
    <?php
}

/** Clear the reviews cache (e.g. after Customizer save). The next page hit will
 *  refetch lazily — we deliberately don't refetch synchronously here because
 *  customize_save_after fires for ANY Customizer save (phone, email, etc.), and
 *  a 5-second wp_remote_get on every save would make the admin UX painful.
 *  Also clears any resolved-Place-ID caches so a changed business identifier
 *  takes effect immediately. */
function timeless_refresh_google_reviews() {
    delete_transient( 'timeless_google_reviews_v1' );
    // Clear all resolved Place ID caches (stored with md5-suffixed keys).
    // We don't know the hash without the input value, so use $wpdb to scan options.
    global $wpdb;
    if ( isset( $wpdb ) ) {
        $wpdb->query( $wpdb->prepare(
            "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
            '_transient_timeless_resolved_place_id_%',
            '_transient_timeout_timeless_resolved_place_id_%'
        ) );
    }
}
add_action( 'customize_save_after', 'timeless_refresh_google_reviews' );

/* ─────────────────────────────────────────────
   4. HELPER FUNCTIONS
   ───────────────────────────────────────────── */

/** Get phone display number */
function timeless_phone() {
    return esc_html( get_theme_mod( 'timeless_phone', '0451 110 154' ) );
}

/** Get phone tel: link */
function timeless_phone_link() {
    return esc_attr( get_theme_mod( 'timeless_phone_link', '+61451110154' ) );
}

/** Get NSW licence number (empty string if unlicensed) */
function timeless_licence() {
    return esc_html( get_theme_mod( 'timeless_licence', '' ) );
}

/** Check if business has a licence configured */
function timeless_has_licence() {
    return ! empty( trim( get_theme_mod( 'timeless_licence', '' ) ) );
}

/** Get business ABN */
function timeless_abn() {
    return esc_html( get_theme_mod( 'timeless_abn', '30 412 161 602' ) );
}

/** Get email */
function timeless_email() {
    return sanitize_email( get_theme_mod( 'timeless_email', 'info@timelessresurfacing.com.au' ) );
}

/* ─────────────────────────────────────────────
   5. SEO — Remove WordPress clutter + hide server fingerprinting
   ───────────────────────────────────────────── */
remove_action( 'wp_head', 'wp_generator' );
remove_action( 'wp_head', 'wlwmanifest_link' );
remove_action( 'wp_head', 'rsd_link' );
remove_action( 'wp_head', 'wp_shortlink_wp_head' );

/** Hide X-Powered-By header (security: don't reveal PHP version to attackers) */
function timeless_hide_powered_by() {
    if ( function_exists( 'header_remove' ) ) {
        header_remove( 'X-Powered-By' );
    }
}
add_action( 'send_headers', 'timeless_hide_powered_by', 1 );
add_action( 'init', 'timeless_hide_powered_by', 1 );

/* Self-referencing canonical URL — fixes "Duplicate without user-selected canonical" */
function timeless_canonical_url() {
    if ( is_front_page() ) {
        $url = home_url( '/' );
    } elseif ( is_singular() ) {
        $url = get_permalink();
    } else {
        $url = home_url( $_SERVER['REQUEST_URI'] );
    }
    $url = strtok( $url, '?' );
    $url = preg_replace( '#^http://#', 'https://', $url );
    $url = trailingslashit( $url );
    echo '<link rel="canonical" href="' . esc_url( $url ) . '" />' . "\n";
}
remove_action( 'wp_head', 'rel_canonical' );
add_action( 'wp_head', 'timeless_canonical_url', 1 );

/* Remove WordPress default robots meta — our timeless_seo_meta() outputs a more complete one */
remove_filter( 'wp_robots', 'wp_robots_max_image_preview_large' );

/* ─────────────────────────────────────────────
   5b. SEO — Meta descriptions + Open Graph tags
   ───────────────────────────────────────────── */
function timeless_seo_meta() {
    $site = 'Timeless Resurfacing';
    $tpl  = get_template_directory_uri();
    $img  = $tpl . '/images/homepage/after.jpg';

    /* Per-page meta descriptions — unique for each service page */
    $desc_map = array(
        'shower-regrouting-sydney'              => 'Professional shower regrouting in Sydney. Full grout removal and waterproof epoxy replacement. Same-day service, free quotes.',
        'bath-resurfacing-sydney'               => 'Bath resurfacing Sydney. Restore chipped or stained bathtubs to factory-new condition. One-day service, 80–90% cheaper than replacement.',
        'tile-resurfacing-sydney'               => 'Tile resurfacing Sydney. Transform outdated bathroom tiles with durable high-gloss finish. No demolition, one-day turnaround.',
        'vanity-refinishing-sydney'             => 'Vanity refinishing Sydney. Benchtop resurfacing and cabinet respray with 900+ colour options. Same-day service.',
        'basin-restoration-sydney'              => 'Basin restoration Sydney. Expert chip repair and full resurface for porcelain, acrylic, and cast iron basins.',
        'shower-leak-repair-sydney'             => 'Shower sealing and leak repair Sydney. Silicone replacement and waterproof epoxy regrouting to stop leaks permanently.',
        'epoxy-grout-upgrade-sydney'            => 'Epoxy grout upgrade Sydney. Waterproof, mould-resistant grout for showers, bathrooms, and wet areas.',
        'floor-tile-regrouting-sydney'          => 'Floor tile regrouting Sydney. Bathroom and laundry floor grout removal and replacement. Anti-slip finish available.',
        'chipped-bathtub-repair-sydney'         => 'Chipped bathtub repair Sydney. Professional chip repair for baths and basins. Same-day fix, invisible results.',
        'full-bathroom-makeover-sydney'         => 'Full bathroom makeover Sydney. Complete resurface package — bath, tiles, basin, and grout. 1-2 days, fraction of renovation cost.',
        'property-manager-bathroom-services-sydney' => 'Property manager bathroom services Sydney. Multi-unit turnarounds, rental refreshes, and strata work. Volume pricing available.',
        'stained-bathtub-resurfacing-sydney'    => 'Stained bathtub resurfacing Sydney. Remove yellow, brown, and rust stains permanently with professional recoating.',
        'peeling-bathtub-resurfacing-sydney'    => 'Peeling bathtub resurfacing Sydney. Fix failed DIY kits and peeling coatings with professional two-part acrylic system.',
        'bathroom-tile-resurfacing-sydney'      => 'Bathroom tile resurfacing Sydney. Fresh high-gloss white finish over your existing tiles. No demolition, 1-2 day service.',
        'mouldy-shower-grout-sydney'            => 'Mouldy shower grout removal Sydney. Strip black mould grout and replace with waterproof epoxy. Stops mould permanently.',
        'cracked-grout-repair-sydney'           => 'Cracked grout repair Sydney. Fix crumbling, cracked shower and bathroom grout before water damage occurs.',
        'mouldy-silicone-replacement-sydney'    => 'Mouldy silicone replacement Sydney. Remove old black silicone and reseal with premium anti-mould silicone.',
        'basin-chip-repair-sydney'              => 'Basin chip repair Sydney. Invisible repairs for chipped porcelain and ceramic basins. Same-day service.',
        'vanity-respray-sydney'                 => 'Vanity respray Sydney. Cabinet door and drawer front respray with 2-pack polyurethane. 900+ colours.',
        'about'    => 'About Timeless Resurfacing. Sydney\'s bathroom resurfacing specialists. Fully insured, experienced team, up to 3-year warranty on every job.',
        'contact'  => 'Contact Timeless Resurfacing for a free bathroom resurfacing quote in Sydney. Send photos, get a fixed-price quote next business day.',
        'gallery'  => 'Before and after bathroom resurfacing photos across Sydney. Real transformations by Timeless Resurfacing.',
        'areas'    => 'Bathroom resurfacing service areas across Greater Sydney, Wollongong, Central Coast, and Blue Mountains.',
        'faqs'     => 'Frequently asked questions about bathroom resurfacing in Sydney. Cost, timing, durability, warranty, and process explained.',
        'privacy'  => 'Privacy policy for Timeless Resurfacing. How we collect, use, and protect your personal information.',
    );

    if ( is_front_page() ) {
        $title = 'Bathroom Resurfacing Sydney | ' . $site;
        $desc  = 'Sydney\'s specialist bathroom resurfacing and shower regrouting service. One-day transformations, 80–90% cheaper than renovation. Free quotes.';
    } elseif ( is_singular() ) {
        $title = get_the_title() . ' | ' . $site;
        $slug  = get_post_field( 'post_name', get_post() );
        $desc  = isset( $desc_map[ $slug ] ) ? $desc_map[ $slug ] : get_the_title() . ' — professional bathroom resurfacing in Sydney. Free quotes. ' . $site;
    } else {
        $title = wp_title( '|', false, 'right' ) . $site;
        $desc  = 'Professional bathroom resurfacing and shower regrouting across Greater Sydney. Free photo-based quotes. ' . $site;
    }

    $desc = substr( $desc, 0, 160 );

    /* Build canonical-matching URL (HTTPS, trailing slash, no query params) */
    $url = is_front_page() ? home_url( '/' ) : get_permalink();
    $url = strtok( $url, '?' );
    $url = preg_replace( '#^http://#', 'https://', $url );
    $url = trailingslashit( $url );

    echo '<meta name="description" content="' . esc_attr( $desc ) . '" />' . "\n";
    echo '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />' . "\n";
    echo '<link rel="alternate" hreflang="en-au" href="' . esc_url( $url ) . '" />' . "\n";
    echo '<meta property="og:type" content="website" />' . "\n";
    echo '<meta property="og:title" content="' . esc_attr( $title ) . '" />' . "\n";
    echo '<meta property="og:description" content="' . esc_attr( $desc ) . '" />' . "\n";
    echo '<meta property="og:url" content="' . esc_url( $url ) . '" />' . "\n";
    echo '<meta property="og:image" content="' . esc_url( $img ) . '" />' . "\n";
    echo '<meta property="og:image:width" content="1200" />' . "\n";
    echo '<meta property="og:image:height" content="630" />' . "\n";
    echo '<meta name="twitter:card" content="summary_large_image" />' . "\n";
}
add_action( 'wp_head', 'timeless_seo_meta', 2 );

/* ─────────────────────────────────────────────
   5b. ANALYTICS — GA4 + Microsoft Clarity (Customizer-driven)
   ─────────────────────────────────────────────
   Both tracking scripts are gated by:
     - Empty ID → no script injected (clean source)
     - Logged-in admin → no script injected (admin's own browsing
       doesn't pollute the data Angela actually wants to see)
     - Strict format validation on the ID before echoing into HTML
       (defense against accidental XSS via Customizer)
   ───────────────────────────────────────────── */
function timeless_analytics_scripts() {
    // Skip for logged-in admins so their own page views don't pollute analytics
    if ( is_user_logged_in() && current_user_can( 'manage_options' ) ) {
        return;
    }

    $ga4 = trim( get_theme_mod( 'timeless_ga4_id', '' ) );
    if ( $ga4 && preg_match( '/^G-[A-Z0-9]{8,12}$/i', $ga4 ) ) {
        // Google Analytics 4 (gtag.js)
        $ga4_safe = esc_attr( $ga4 );
        ?>
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo $ga4_safe; ?>"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '<?php echo esc_js( $ga4 ); ?>', { 'anonymize_ip': true });
</script>
        <?php
    }

    $clarity = trim( get_theme_mod( 'timeless_clarity_id', '' ) );
    if ( $clarity && preg_match( '/^[a-z0-9]{8,15}$/i', $clarity ) ) {
        // Microsoft Clarity — heatmaps + session replays
        ?>
<!-- Microsoft Clarity -->
<script>
(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "<?php echo esc_js( $clarity ); ?>");
</script>
        <?php
    }
}
add_action( 'wp_head', 'timeless_analytics_scripts', 99 );  // Priority 99 = late in head, after most other tags

/* ─────────────────────────────────────────────
   5c. XML SITEMAP — Auto-generated at /sitemap.xml
   Defense in depth: runs via rewrite rule AND early URI check
   ───────────────────────────────────────────── */

/** Render the XML sitemap body and exit */
function timeless_output_sitemap() {
    // Prevent any buffered output from corrupting XML
    if ( ob_get_level() ) {
        ob_end_clean();
    }

    status_header( 200 );
    header( 'Content-Type: application/xml; charset=UTF-8' );
    header( 'X-Robots-Tag: noindex' );

    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    // Homepage
    echo '<url><loc>' . esc_url( home_url( '/' ) ) . '</loc><lastmod>' . current_time( 'Y-m-d' ) . '</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>' . "\n";

    // All published pages
    $pages = get_posts( array(
        'post_type'   => 'page',
        'post_status' => 'publish',
        'numberposts' => -1,
        'orderby'     => 'menu_order',
        'order'       => 'ASC',
    ) );

    foreach ( $pages as $page ) {
        $url      = get_permalink( $page );
        $modified = get_the_modified_date( 'Y-m-d', $page );
        $slug     = $page->post_name;

        // Skip if URL is empty or if this is the front page (already added above)
        if ( empty( $url ) ) continue;
        if ( (int) $page->ID === (int) get_option( 'page_on_front' ) ) continue;

        // Higher priority for service pages
        if ( strpos( $slug, 'sydney' ) !== false ) {
            $priority = '0.8';
            $freq     = 'monthly';
        } elseif ( in_array( $slug, array( 'about', 'contact', 'gallery', 'faqs', 'areas' ), true ) ) {
            $priority = '0.7';
            $freq     = 'monthly';
        } else {
            $priority = '0.5';
            $freq     = 'yearly';
        }

        echo '<url>';
        echo '<loc>' . esc_url( $url ) . '</loc>';
        echo '<lastmod>' . esc_html( $modified ) . '</lastmod>';
        echo '<changefreq>' . esc_html( $freq ) . '</changefreq>';
        echo '<priority>' . esc_html( $priority ) . '</priority>';
        echo '</url>' . "\n";
    }

    echo '</urlset>';
    exit;
}

/**
 * Intercept /sitemap.xml early — before WordPress tries to route it.
 * This runs on 'parse_request' which fires BEFORE template_redirect AND
 * before any 404 routing. Works even if rewrite rules haven't been flushed.
 */
function timeless_sitemap_early_intercept( $wp ) {
    // Match /sitemap.xml (with or without query string)
    $uri = isset( $_SERVER['REQUEST_URI'] ) ? $_SERVER['REQUEST_URI'] : '';
    $path = parse_url( $uri, PHP_URL_PATH );

    if ( $path === '/sitemap.xml' || $path === '/sitemap.xml/' ) {
        timeless_output_sitemap();
    }
}
add_action( 'parse_request', 'timeless_sitemap_early_intercept' );

/**
 * Secondary handler via rewrite rule for cache-friendly serving.
 * If rewrite rules were flushed, this is the primary path.
 */
function timeless_sitemap_via_rewrite() {
    if ( get_query_var( 'sitemap' ) === '1' ) {
        timeless_output_sitemap();
    }
}
add_action( 'template_redirect', 'timeless_sitemap_via_rewrite' );

/* Register /sitemap.xml rewrite rule */
function timeless_sitemap_rewrite() {
    add_rewrite_rule( '^sitemap\.xml$', 'index.php?sitemap=1', 'top' );
}
add_action( 'init', 'timeless_sitemap_rewrite' );

function timeless_sitemap_query_var( $vars ) {
    $vars[] = 'sitemap';
    return $vars;
}
add_filter( 'query_vars', 'timeless_sitemap_query_var' );

/* Flush rewrite rules on theme activation (so /sitemap.xml works immediately) */
function timeless_flush_rewrites_on_activation() {
    timeless_sitemap_rewrite();
    flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'timeless_flush_rewrites_on_activation' );

/* Disable WordPress default sitemaps (wp-sitemap.xml) to avoid duplicates */
add_filter( 'wp_sitemaps_enabled', '__return_false' );

/* Custom robots.txt — block crawl-budget-wasting URLs */
function timeless_robots_txt( $output, $public ) {
    $output  = "User-agent: *\n";
    $output .= "Disallow: /wp-admin/\n";
    $output .= "Allow: /wp-admin/admin-ajax.php\n";
    $output .= "Disallow: /?s=\n";
    $output .= "Disallow: /search/\n";
    $output .= "Disallow: /*?replytocom=\n";
    $output .= "Disallow: /*?preview=true\n";
    $output .= "Disallow: /wp-json/\n";
    $output .= "Disallow: /wp-includes/\n";
    $output .= "Disallow: /wp-content/plugins/\n";
    $output .= "Disallow: /wp-content/cache/\n";
    $output .= "Disallow: /author/\n";
    $output .= "Disallow: /tag/\n";
    $output .= "Disallow: /category/\n";
    $output .= "\nSitemap: " . home_url( '/sitemap.xml' ) . "\n";
    return $output;
}
add_filter( 'robots_txt', 'timeless_robots_txt', 10, 2 );

/* ─────────────────────────────────────────────
   5d. SEO — Related Services internal links (speeds up crawl discovery)
   ───────────────────────────────────────────── */
function timeless_related_services() {
    if ( ! is_singular( 'page' ) ) return;
    $slug = get_post_field( 'post_name', get_post() );
    if ( strpos( $slug, 'sydney' ) === false ) return; // Only on service pages

    $services = array(
        'shower-regrouting-sydney'     => array( 'label' => 'Shower Regrouting',  'icon' => 'shower' ),
        'bath-resurfacing-sydney'      => array( 'label' => 'Bath Resurfacing',   'icon' => 'bathtub' ),
        'tile-resurfacing-sydney'      => array( 'label' => 'Tile Resurfacing',   'icon' => 'grid_view' ),
        'vanity-refinishing-sydney'    => array( 'label' => 'Vanity Refinishing', 'icon' => 'countertops' ),
        'basin-restoration-sydney'     => array( 'label' => 'Basin Restoration',  'icon' => 'faucet' ),
        'shower-leak-repair-sydney'    => array( 'label' => 'Shower Sealing',     'icon' => 'water_damage' ),
    );

    // Remove current page from list
    unset( $services[ $slug ] );
    // Pick 3 random related services
    $keys = array_rand( $services, min( 3, count( $services ) ) );
    if ( ! is_array( $keys ) ) $keys = array( $keys );

    echo '<section class="py-12 sm:py-16 bg-surface-container-low">';
    echo '<div class="max-w-7xl mx-auto px-6 sm:px-8">';
    echo '<h2 class="text-2xl font-extrabold text-primary tracking-tighter mb-6 text-center">Other Services You Might Need</h2>';
    echo '<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">';
    foreach ( $keys as $k ) {
        $s = $services[ $k ];
        $url = home_url( '/services/' . $k . '/' );
        echo '<a href="' . esc_url( $url ) . '" class="flex items-center gap-3 bg-white rounded-xl p-4 hover:shadow-lg transition-all group">';
        echo '<span class="material-symbols-outlined text-2xl text-primary shrink-0" aria-hidden="true">' . esc_html( $s['icon'] ) . '</span>';
        echo '<div><span class="font-bold text-primary text-sm">' . esc_html( $s['label'] ) . '</span>';
        echo '<span class="text-xs text-secondary block">Sydney &amp; NSW</span></div>';
        echo '<span class="material-symbols-outlined text-primary text-sm ml-auto group-hover:translate-x-1 transition-transform" aria-hidden="true">arrow_forward</span>';
        echo '</a>';
    }
    echo '</div></div></section>';
}

/* ─────────────────────────────────────────────
   6. DISABLE COMMENTS (not needed for trades site)
   ────────────────────────────────────────────── */
function timeless_disable_comments() {
    remove_post_type_support( 'page', 'comments' );
    remove_post_type_support( 'post', 'comments' );
}
add_action( 'init', 'timeless_disable_comments' );

/* ──���──────────────────────────────────────────
   7. CUSTOM IMAGE SIZES
   ───────────────────────────────────────────── */
add_image_size( 'hero-image', 800, 600, true );
add_image_size( 'og-image', 1200, 630, true );
add_image_size( 'gallery-card', 600, 338, true );

/* ─────────────────────────────────────────────
   8. QUOTE FORM HANDLER — Processes form submissions + sends email
   ───────────────────────────────────────────── */

/** Register AJAX handler for quote form */
function timeless_handle_quote_form() {
    // Verify nonce for security
    if ( ! isset( $_POST['timeless_quote_nonce'] ) ||
         ! wp_verify_nonce( $_POST['timeless_quote_nonce'], 'timeless_quote_submit' ) ) {
        wp_send_json_error( array( 'message' => 'Security check failed. Please refresh and try again.' ) );
    }

    // Rate limiting — max 3 submissions per IP per hour
    $ip = $_SERVER['REMOTE_ADDR'];
    $rate_key = 'quote_rate_' . md5( $ip );
    $submissions = get_transient( $rate_key );
    if ( $submissions !== false && $submissions >= 3 ) {
        wp_send_json_error( array( 'message' => 'Too many submissions. Please try again in an hour.' ) );
    }

    // Sanitise inputs
    $name     = sanitize_text_field( $_POST['name'] ?? '' );
    $phone    = sanitize_text_field( $_POST['phone'] ?? '' );
    $email    = sanitize_email( $_POST['email'] ?? '' );
    $address  = sanitize_text_field( $_POST['address'] ?? '' );
    $suburb   = sanitize_text_field( $_POST['suburb'] ?? '' );
    $asbestos = sanitize_text_field( $_POST['asbestos'] ?? 'not specified' );
    $notes    = sanitize_textarea_field( $_POST['notes'] ?? '' );
    $page     = sanitize_text_field( $_POST['source_page'] ?? 'Unknown' );

    // Services (checkboxes — array of values)
    $services_raw = isset( $_POST['services'] ) ? (array) $_POST['services'] : array();
    $services = array_map( 'sanitize_text_field', $services_raw );

    // Validate required fields
    if ( empty( $name ) || empty( $phone ) ) {
        wp_send_json_error( array( 'message' => 'Please provide your name and phone number.' ) );
    }

    // Build email
    $to      = timeless_email();
    $subject = 'New Quote Request from ' . $name . ' — ' . $page;
    $body    = "NEW QUOTE REQUEST\n";
    $body   .= "═══════════════════════════\n\n";
    $body   .= "Name:      {$name}\n";
    $body   .= "Phone:     {$phone}\n";
    $body   .= "Email:     {$email}\n";
    $body   .= "Address:   {$address}\n";
    if ( ! empty( $suburb ) ) {
        $body .= "Suburb:    {$suburb}\n";
    }
    $body   .= "Asbestos:  {$asbestos}\n";
    $body   .= "Services:  " . ( ! empty( $services ) ? implode( ', ', $services ) : 'Not specified' ) . "\n";
    if ( ! empty( $notes ) ) {
        $body .= "\nNotes:\n{$notes}\n";
    }
    $body   .= "\n═══════════════════════════\n";
    $body   .= "Submitted from: {$page}\n";
    $body   .= "IP: {$ip}\n";
    $body   .= "Time: " . current_time( 'D j M Y, g:i a' ) . "\n";

    $headers = array( 'Content-Type: text/plain; charset=UTF-8' );
    if ( ! empty( $email ) ) {
        $headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
    }

    $sent = wp_mail( $to, $subject, $body, $headers );

    // Track rate limit
    if ( $submissions === false ) {
        set_transient( $rate_key, 1, HOUR_IN_SECONDS );
    } else {
        set_transient( $rate_key, $submissions + 1, HOUR_IN_SECONDS );
    }

    if ( $sent ) {
        wp_send_json_success( array( 'message' => 'Thanks! We\'ll have your quote ready within hours.' ) );
    } else {
        wp_send_json_error( array( 'message' => 'Something went wrong. Please call us directly.' ) );
    }
}
add_action( 'wp_ajax_timeless_quote', 'timeless_handle_quote_form' );
add_action( 'wp_ajax_nopriv_timeless_quote', 'timeless_handle_quote_form' );

/** Pass AJAX URL and nonce to frontend JavaScript */
function timeless_form_scripts() {
    wp_localize_script( 'timeless-main', 'timelessAjax', array(
        'url'   => admin_url( 'admin-ajax.php' ),
        'nonce' => wp_create_nonce( 'timeless_quote_submit' ),
    ) );
}
add_action( 'wp_enqueue_scripts', 'timeless_form_scripts' );

/* ─────────────────────────────────────────────
   8b. CHAT WIDGET — Floating "Have a Question?" bubble
   Separate from quote form so we can track widget leads
   distinctly in the inbox and tune each flow independently.
   ───────────────────────────────────────────── */

/** Valid customer types — validates against dropdown options */
function timeless_chat_widget_customer_types() {
    return array( 'Home Owner', 'Renter', 'Construction', 'Real Estate', 'Business' );
}

/** AJAX handler for chat widget submissions */
function timeless_handle_chat_widget() {
    // Nonce check
    if ( ! isset( $_POST['cw_nonce'] ) || ! wp_verify_nonce( $_POST['cw_nonce'], 'timeless_chat_widget' ) ) {
        wp_send_json_error( array( 'message' => 'Security check failed. Please refresh the page.' ) );
    }

    // Rate limit — max 5 submissions per IP per hour
    $ip = isset( $_SERVER['REMOTE_ADDR'] ) ? $_SERVER['REMOTE_ADDR'] : '0.0.0.0';
    $rate_key = 'cw_rate_' . md5( $ip );
    $submissions = get_transient( $rate_key );
    if ( $submissions !== false && $submissions >= 5 ) {
        wp_send_json_error( array( 'message' => 'Too many messages. Please try again in an hour.' ) );
    }

    // Sanitise inputs
    $name    = sanitize_text_field( $_POST['cw_name'] ?? '' );
    $phone   = sanitize_text_field( $_POST['cw_phone'] ?? '' );
    $email   = sanitize_email( $_POST['cw_email'] ?? '' );
    $ctype   = sanitize_text_field( $_POST['cw_customer_type'] ?? '' );
    $message = sanitize_textarea_field( $_POST['cw_message'] ?? '' );
    $consent = isset( $_POST['cw_consent'] ) && ! empty( $_POST['cw_consent'] );
    $page    = esc_url_raw( $_POST['cw_source_page'] ?? '' );

    // Validate required fields
    if ( empty( $name ) || empty( $phone ) || empty( $email ) || empty( $ctype ) || empty( $message ) ) {
        wp_send_json_error( array( 'message' => 'Please fill in all required fields.' ) );
    }
    if ( ! is_email( $email ) ) {
        wp_send_json_error( array( 'message' => 'Please provide a valid email address.' ) );
    }
    if ( ! in_array( $ctype, timeless_chat_widget_customer_types(), true ) ) {
        wp_send_json_error( array( 'message' => 'Invalid customer type.' ) );
    }
    if ( ! $consent ) {
        wp_send_json_error( array( 'message' => 'Please agree to the contact terms.' ) );
    }

    // Build email notification
    $to      = timeless_email();
    $subject = '[Chat Widget] ' . $name . ' — ' . $ctype;
    $body    = "NEW CHAT WIDGET MESSAGE\n";
    $body   .= "═══════════════════════════\n\n";
    $body   .= "Name:          {$name}\n";
    $body   .= "Phone:         {$phone}\n";
    $body   .= "Email:         {$email}\n";
    $body   .= "Customer Type: {$ctype}\n\n";
    $body   .= "Message:\n{$message}\n\n";
    $body   .= "═══════════════════════════\n";
    $body   .= "Submitted from: " . ( $page ?: 'Unknown page' ) . "\n";
    $body   .= "IP:             {$ip}\n";
    $body   .= "Time:           " . current_time( 'D j M Y, g:i a' ) . "\n";

    $headers = array(
        'Content-Type: text/plain; charset=UTF-8',
        'Reply-To: ' . $name . ' <' . $email . '>',
    );

    $sent = wp_mail( $to, $subject, $body, $headers );

    // Update rate limit counter regardless of mail success
    if ( $submissions === false ) {
        set_transient( $rate_key, 1, HOUR_IN_SECONDS );
    } else {
        set_transient( $rate_key, (int) $submissions + 1, HOUR_IN_SECONDS );
    }

    if ( $sent ) {
        wp_send_json_success( array( 'message' => 'Thanks! We\'ll reply shortly.' ) );
    } else {
        wp_send_json_error( array( 'message' => 'Something went wrong. Please try again or call us.' ) );
    }
}
add_action( 'wp_ajax_timeless_chat_widget', 'timeless_handle_chat_widget' );
add_action( 'wp_ajax_nopriv_timeless_chat_widget', 'timeless_handle_chat_widget' );

/**
 * Render the chat widget HTML at the end of every frontend page.
 * Hooked to wp_footer so it survives footer.php refactors.
 */
function timeless_render_chat_widget() {
    if ( is_admin() ) {
        return;
    }
    $customer_types = timeless_chat_widget_customer_types();
    ?>
    <!-- CHAT WIDGET — Floating "Have a Question?" bubble -->
    <div id="chat-widget-container">
        <button id="chat-widget-toggle" class="fixed bottom-24 md:bottom-6 right-6 z-60 w-14 h-14 rounded-full bg-teal-700 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-200" aria-label="<?php esc_attr_e( 'Open chat', 'timeless' ); ?>">
            <span class="material-symbols-outlined text-2xl" style="font-variation-settings:'FILL' 1;" aria-hidden="true">chat</span>
        </button>

        <div id="chat-widget-panel" class="fixed bottom-24 md:bottom-24 right-4 md:right-6 z-70 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden hidden transform origin-bottom-right transition-all duration-200" style="max-height: calc(100vh - 8rem);">
            <div class="bg-teal-700 text-white px-5 py-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                        <span class="material-symbols-outlined text-white" style="font-variation-settings:'FILL' 1;" aria-hidden="true">chat</span>
                    </div>
                    <div>
                        <p class="font-bold text-sm"><?php esc_html_e( 'Have a Question?', 'timeless' ); ?></p>
                        <p class="text-[0.65rem] text-white/70"><?php esc_html_e( 'We reply within hours', 'timeless' ); ?></p>
                    </div>
                </div>
                <button id="chat-widget-close" class="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors" aria-label="<?php esc_attr_e( 'Close chat', 'timeless' ); ?>">
                    <span class="material-symbols-outlined text-xl" aria-hidden="true">close</span>
                </button>
            </div>
            <div class="p-5 overflow-y-auto" style="max-height: calc(100vh - 16rem);">
                <div class="bg-surface-container-low rounded-2xl rounded-tl-sm p-3 mb-5 max-w-[85%]">
                    <p class="text-xs text-secondary leading-relaxed"><?php esc_html_e( "Hi! 👋 Share your contact details and we'll reply shortly with a quote.", 'timeless' ); ?></p>
                </div>
                <form id="chat-widget-form" class="space-y-3">
                    <input type="text" name="cw_name" placeholder="<?php esc_attr_e( 'Name *', 'timeless' ); ?>" required class="w-full px-4 py-3 text-sm border border-surface-container rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-hidden" />
                    <div class="flex gap-2">
                        <span class="flex items-center px-3 bg-surface-container-low border border-surface-container rounded-lg text-sm font-medium text-secondary">🇦🇺 +61</span>
                        <input type="tel" name="cw_phone" placeholder="<?php esc_attr_e( 'Phone *', 'timeless' ); ?>" required class="flex-1 px-4 py-3 text-sm border border-surface-container rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-hidden" />
                    </div>
                    <input type="email" name="cw_email" placeholder="<?php esc_attr_e( 'Email *', 'timeless' ); ?>" required class="w-full px-4 py-3 text-sm border border-surface-container rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-hidden" />
                    <select name="cw_customer_type" required class="w-full px-4 py-3 text-sm border border-surface-container rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-hidden bg-white">
                        <option value=""><?php esc_html_e( 'What customer are you? *', 'timeless' ); ?></option>
                        <?php foreach ( $customer_types as $type ) : ?>
                            <option value="<?php echo esc_attr( $type ); ?>"><?php echo esc_html( $type ); ?></option>
                        <?php endforeach; ?>
                    </select>
                    <textarea name="cw_message" placeholder="<?php esc_attr_e( 'Message *', 'timeless' ); ?>" required rows="3" class="w-full px-4 py-3 text-sm border border-surface-container rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-hidden resize-none"></textarea>
                    <label class="flex items-start gap-2 text-[0.65rem] text-secondary leading-relaxed cursor-pointer">
                        <input type="checkbox" name="cw_consent" required checked class="mt-0.5 text-teal-700 rounded-sm" />
                        <span><?php esc_html_e( 'By submitting you agree to receive SMS or emails for the provided channel. Rates may apply.', 'timeless' ); ?></span>
                    </label>
                    <?php wp_nonce_field( 'timeless_chat_widget', 'cw_nonce' ); ?>
                    <input type="hidden" name="action" value="timeless_chat_widget" />
                    <input type="hidden" name="cw_source_page" value="<?php echo esc_url( home_url( add_query_arg( null, null ) ) ); ?>" />
                    <button type="submit" id="cw-submit-btn" class="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2">
                        <?php esc_html_e( 'Send', 'timeless' ); ?> <span class="material-symbols-outlined text-base" aria-hidden="true">send</span>
                    </button>
                </form>
                <div id="cw-success" class="hidden text-center py-6">
                    <div class="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                        <span class="material-symbols-outlined text-3xl text-emerald-600" aria-hidden="true">check_circle</span>
                    </div>
                    <p class="font-bold text-primary mb-2"><?php esc_html_e( 'Message sent!', 'timeless' ); ?></p>
                    <p class="text-xs text-secondary"><?php esc_html_e( "We'll reply within hours during business hours.", 'timeless' ); ?></p>
                </div>
                <div id="cw-error" class="hidden p-3 mt-3 bg-red-50 border border-red-200 rounded-lg">
                    <p class="text-xs text-red-700 text-center" id="cw-error-message"></p>
                </div>
            </div>
        </div>
    </div>
    <?php
}
add_action( 'wp_footer', 'timeless_render_chat_widget', 5 );

/**
 * Inline JS for the chat widget — open/close behaviour + real AJAX submission.
 * Hooked after the HTML so DOM elements exist when the script runs.
 */
function timeless_chat_widget_script() {
    if ( is_admin() ) {
        return;
    }
    $ajax_url = esc_url( admin_url( 'admin-ajax.php' ) );
    ?>
    <script>
    (function() {
        var toggle  = document.getElementById('chat-widget-toggle');
        var closeBtn = document.getElementById('chat-widget-close');
        var panel   = document.getElementById('chat-widget-panel');
        var form    = document.getElementById('chat-widget-form');
        var success = document.getElementById('cw-success');
        var errorBox = document.getElementById('cw-error');
        var errorMsg = document.getElementById('cw-error-message');
        var submitBtn = document.getElementById('cw-submit-btn');

        if (!toggle || !panel || !form) return;

        // Clone original submit button state so we can safely restore it after submission
        var submitOriginal = submitBtn ? submitBtn.cloneNode(true) : null;

        function openPanel() {
            panel.classList.remove('hidden');
            panel.style.transform = 'scale(0.9) translateY(10px)';
            panel.style.opacity = '0';
            requestAnimationFrame(function() {
                panel.style.transform = 'scale(1) translateY(0)';
                panel.style.opacity = '1';
            });
            toggle.style.display = 'none';
        }

        function closePanel() {
            panel.style.transform = 'scale(0.9) translateY(10px)';
            panel.style.opacity = '0';
            setTimeout(function() {
                panel.classList.add('hidden');
                toggle.style.display = 'flex';
            }, 200);
        }

        function setSubmitSending() {
            if (!submitBtn) return;
            submitBtn.disabled = true;
            while (submitBtn.firstChild) submitBtn.removeChild(submitBtn.firstChild);
            submitBtn.textContent = 'Sending...';
        }

        function restoreSubmitBtn() {
            if (!submitBtn || !submitOriginal) return;
            submitBtn.disabled = false;
            while (submitBtn.firstChild) submitBtn.removeChild(submitBtn.firstChild);
            var clone = submitOriginal.cloneNode(true);
            while (clone.firstChild) submitBtn.appendChild(clone.firstChild);
        }

        function showError(msg) {
            if (!errorBox || !errorMsg) return;
            errorMsg.textContent = msg;
            errorBox.classList.remove('hidden');
            setTimeout(function() { errorBox.classList.add('hidden'); }, 5000);
        }

        toggle.addEventListener('click', openPanel);
        if (closeBtn) closeBtn.addEventListener('click', closePanel);

        // Close on outside click (desktop only)
        document.addEventListener('click', function(e) {
            if (panel.classList.contains('hidden')) return;
            if (!panel.contains(e.target) && !toggle.contains(e.target)) {
                if (window.innerWidth >= 640) closePanel();
            }
        });

        // Real AJAX submission to WordPress admin-ajax.php
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (errorBox) errorBox.classList.add('hidden');
            setSubmitSending();

            var formData = new FormData(form);

            fetch(<?php echo wp_json_encode( $ajax_url ); ?>, {
                method: 'POST',
                credentials: 'same-origin',
                body: formData
            })
            .then(function(response) { return response.json(); })
            .then(function(data) {
                if (data && data.success) {
                    form.classList.add('hidden');
                    if (success) success.classList.remove('hidden');
                    setTimeout(function() {
                        closePanel();
                        setTimeout(function() {
                            form.reset();
                            form.classList.remove('hidden');
                            if (success) success.classList.add('hidden');
                            restoreSubmitBtn();
                        }, 300);
                    }, 4000);
                } else {
                    var msg = (data && data.data && data.data.message) ? data.data.message : 'Something went wrong. Please try again.';
                    showError(msg);
                    restoreSubmitBtn();
                }
            })
            .catch(function() {
                showError('Network error. Please check your connection and try again.');
                restoreSubmitBtn();
            });
        });
    })();
    </script>
    <?php
}
add_action( 'wp_footer', 'timeless_chat_widget_script', 10 );

/* ─────────────────────────────────────────────
   9. SECURITY HARDENING — Anti brute-force + lockdown
   ───────────────────────────────────────────── */

/** Hide WordPress version from source code */
function timeless_remove_version() {
    return '';
}
add_filter( 'the_generator', 'timeless_remove_version' );

/** Disable XML-RPC (common brute-force attack vector) */
add_filter( 'xmlrpc_enabled', '__return_false' );

/** Remove XML-RPC from HTTP headers */
function timeless_remove_xmlrpc_headers( $headers ) {
    unset( $headers['X-Pingback'] );
    return $headers;
}
add_filter( 'wp_headers', 'timeless_remove_xmlrpc_headers' );

/** Disable REST API user enumeration (stops attackers finding admin usernames) */
function timeless_disable_user_rest( $endpoints ) {
    if ( isset( $endpoints['/wp/v2/users'] ) ) {
        unset( $endpoints['/wp/v2/users'] );
    }
    if ( isset( $endpoints['/wp/v2/users/(?P<id>[\d]+)'] ) ) {
        unset( $endpoints['/wp/v2/users/(?P<id>[\d]+)'] );
    }
    return $endpoints;
}
add_filter( 'rest_endpoints', 'timeless_disable_user_rest' );

/** Block author archive scans (?author=1 enumeration) */
function timeless_block_author_enum() {
    if ( is_admin() ) return;
    if ( isset( $_REQUEST['author'] ) && is_numeric( $_REQUEST['author'] ) ) {
        wp_redirect( home_url(), 301 );
        exit;
    }
}
add_action( 'init', 'timeless_block_author_enum' );

/** Add security headers */
function timeless_security_headers() {
    if ( ! is_admin() ) {
        header( 'X-Content-Type-Options: nosniff' );
        header( 'X-Frame-Options: SAMEORIGIN' );
        header( 'X-XSS-Protection: 1; mode=block' );
        header( 'Referrer-Policy: strict-origin-when-cross-origin' );
        header( "Permissions-Policy: camera=(), microphone=(), geolocation=()" );
    }
}
add_action( 'send_headers', 'timeless_security_headers' );

/** Disable file editing from WordPress dashboard (prevents hackers editing theme files if they get in) */
if ( ! defined( 'DISALLOW_FILE_EDIT' ) ) {
    define( 'DISALLOW_FILE_EDIT', true );
}

/** Limit login attempts — basic rate limiting via failed login tracking */
function timeless_limit_login_attempts( $user, $username, $password ) {
    $ip = $_SERVER['REMOTE_ADDR'];
    $transient_key = 'login_attempts_' . md5( $ip );
    $attempts = get_transient( $transient_key );

    if ( $attempts !== false && $attempts >= 5 ) {
        return new WP_Error( 'too_many_attempts',
            __( 'Too many failed login attempts. Please try again in 15 minutes.', 'timeless' )
        );
    }

    return $user;
}
add_filter( 'authenticate', 'timeless_limit_login_attempts', 30, 3 );

function timeless_track_failed_login( $username ) {
    $ip = $_SERVER['REMOTE_ADDR'];
    $transient_key = 'login_attempts_' . md5( $ip );
    $attempts = get_transient( $transient_key );

    if ( $attempts === false ) {
        set_transient( $transient_key, 1, 15 * MINUTE_IN_SECONDS );
    } else {
        set_transient( $transient_key, $attempts + 1, 15 * MINUTE_IN_SECONDS );
    }
}
add_action( 'wp_login_failed', 'timeless_track_failed_login' );

/** Reset failed login counter on successful login */
function timeless_reset_login_attempts( $user_login, $user ) {
    $ip = $_SERVER['REMOTE_ADDR'];
    delete_transient( 'login_attempts_' . md5( $ip ) );
}
add_action( 'wp_login', 'timeless_reset_login_attempts', 10, 2 );

/* ─────────────────────────────────────────────
   9. SPEED OPTIMISATION
   ───────────────────────────────────────────── */

/** Remove WordPress emoji scripts (saves ~50KB per page load) */
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
remove_action( 'admin_print_styles', 'print_emoji_styles' );

/** Remove jQuery Migrate (not needed for modern JS) */
function timeless_remove_jquery_migrate( $scripts ) {
    if ( ! is_admin() && isset( $scripts->registered['jquery'] ) ) {
        $script = $scripts->registered['jquery'];
        if ( $script->deps ) {
            $script->deps = array_diff( $script->deps, array( 'jquery-migrate' ) );
        }
    }
}
add_action( 'wp_default_scripts', 'timeless_remove_jquery_migrate' );

/** Remove Gutenberg block CSS on frontend (not using block editor for templates).
 *  Hooked at very late priority on BOTH wp_enqueue_scripts AND wp_print_styles
 *  because newer WP versions (6.4+) add some styles after the standard enqueue cycle. */
function timeless_remove_block_css() {
    wp_dequeue_style( 'wp-block-library' );
    wp_dequeue_style( 'wp-block-library-theme' );
    wp_dequeue_style( 'wc-blocks-style' );
    wp_dequeue_style( 'global-styles' );
    wp_dequeue_style( 'classic-theme-styles' );             // WP 6.4+
    wp_dequeue_style( 'wp-img-auto-sizes-contain' );        // WP 6.7+
    wp_deregister_style( 'global-styles' );                  // belt-and-suspenders for stubborn handle
    wp_deregister_style( 'classic-theme-styles' );
}
add_action( 'wp_enqueue_scripts', 'timeless_remove_block_css', 999 );
add_action( 'wp_print_styles', 'timeless_remove_block_css', 999 );

/** Remove oEmbed scripts */
remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );
remove_action( 'wp_head', 'wp_oembed_add_host_js' );

/** Remove DNS prefetch for WordPress.org */
remove_action( 'wp_head', 'wp_resource_hints', 2 );

/** Preload our self-hosted Inter font for faster first paint.
 *  Inter is the body font — without preload, the browser only discovers the
 *  @font-face URL after parsing the inline <style> tag, costing ~50-100ms.
 *  Preload tells the browser to fetch it in parallel with the HTML parse.
 *  (Google Fonts preconnects removed — Inter + Material Symbols are now local.) */
function timeless_preload_inter() {
    $url = get_template_directory_uri() . '/assets/fonts/inter-variable-latin.woff2';
    $path = get_template_directory() . '/assets/fonts/inter-variable-latin.woff2';
    if ( ! file_exists( $path ) ) {
        return; // No preload if font isn't deployed yet
    }
    $ver = filemtime( $path );
    echo '<link rel="preload" as="font" type="font/woff2" crossorigin href="' . esc_url( $url ) . '?v=' . $ver . '" />' . "\n";
}
add_action( 'wp_head', 'timeless_preload_inter', 1 );

/** Disable WordPress heartbeat on frontend (saves AJAX calls, reduces server load) */
function timeless_disable_heartbeat() {
    if ( ! is_admin() ) {
        wp_deregister_script( 'heartbeat' );
    }
}
add_action( 'init', 'timeless_disable_heartbeat', 1 );

/** Remove recent comments widget inline CSS */
function timeless_remove_recent_comments_css() {
    global $wp_widget_factory;
    if ( isset( $wp_widget_factory->widgets['WP_Widget_Recent_Comments'] ) ) {
        remove_action( 'wp_head', array( $wp_widget_factory->widgets['WP_Widget_Recent_Comments'], 'recent_comments_style' ) );
    }
}
add_action( 'widgets_init', 'timeless_remove_recent_comments_css' );

/* ─────────────────────────────────────────────
   10. CUSTOM .htaccess SECURITY RULES (for reference)
   ───────────────────────────────────────────── */
/*
 * Add these rules to your .htaccess file (above WordPress rules):
 *
 * # Block access to wp-config.php
 * <files wp-config.php>
 *   order allow,deny
 *   deny from all
 * </files>
 *
 * # Block access to xmlrpc.php
 * <files xmlrpc.php>
 *   order allow,deny
 *   deny from all
 * </files>
 *
 * # Block access to wp-includes
 * <IfModule mod_rewrite.c>
 *   RewriteEngine On
 *   RewriteBase /
 *   RewriteRule ^wp-admin/includes/ - [F,L]
 *   RewriteRule !^wp-includes/ - [S=3]
 *   RewriteRule ^wp-includes/[^/]+\.php$ - [F,L]
 *   RewriteRule ^wp-includes/js/tinymce/langs/.+\.php - [F,L]
 *   RewriteRule ^wp-includes/theme-compat/ - [F,L]
 * </IfModule>
 *
 * # Browser caching for speed
 * <IfModule mod_expires.c>
 *   ExpiresActive On
 *   ExpiresByType image/jpg "access plus 1 year"
 *   ExpiresByType image/jpeg "access plus 1 year"
 *   ExpiresByType image/webp "access plus 1 year"
 *   ExpiresByType image/png "access plus 1 year"
 *   ExpiresByType image/svg+xml "access plus 1 year"
 *   ExpiresByType text/css "access plus 1 month"
 *   ExpiresByType application/javascript "access plus 1 month"
 *   ExpiresByType text/html "access plus 1 hour"
 * </IfModule>
 *
 * # GZIP compression
 * <IfModule mod_deflate.c>
 *   AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css
 *   AddOutputFilterByType DEFLATE application/javascript application/json
 *   AddOutputFilterByType DEFLATE application/xml application/xhtml+xml
 * </IfModule>
 */
