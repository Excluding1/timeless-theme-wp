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

    // Google Fonts — Inter
    wp_enqueue_style( 'google-fonts-inter', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap', array(), null );

    // Material Symbols
    wp_enqueue_style( 'material-symbols', 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap', array(), null );

    // Theme stylesheet (animations, mobile menu, FAQ accordion)
    wp_enqueue_style( 'timeless-style', get_stylesheet_uri(), array(), '1.0.0' );

    // Theme JavaScript (mobile menu, FAQ toggle, scroll reveal, smooth scroll)
    wp_enqueue_script( 'timeless-main', get_template_directory_uri() . '/js/main.js', array(), '1.0.0', true );
}
add_action( 'wp_enqueue_scripts', 'timeless_scripts' );

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
}
add_action( 'customize_register', 'timeless_customizer' );

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
        'bathroom-tile-resurfacing-sydney'      => 'Bathroom tile resurfacing Sydney. Change tile colour without removal. High-gloss or matte finish options.',
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

/** Add preconnect hints for Google Fonts (speed up external resource loading).
 *  Tailwind is now compiled locally — no CDN preconnect needed. */
function timeless_preconnect_hints() {
    echo '<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />' . "\n";
    echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />' . "\n";
}
add_action( 'wp_head', 'timeless_preconnect_hints', 1 );

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
