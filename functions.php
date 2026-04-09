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

    flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'timeless_create_pages' );

/* ────��──────────────────────────────────────
   2. ENQUEUE SCRIPTS & STYLES
   ───────────────────────────────────────────── */
function timeless_scripts() {
    // Tailwind CSS via CDN
    wp_enqueue_script( 'tailwindcss', 'https://cdn.tailwindcss.com?plugins=forms,container-queries', array(), null, false );

    // Tailwind config (inline after Tailwind loads)
    $tailwind_config = "
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'tertiary-fixed-dim': '#e7c08b', 'surface': '#f7f9fb', 'surface-container': '#eceef0',
                        'surface-container-low': '#f2f4f6', 'surface-container-highest': '#e0e3e5',
                        'primary': '#041534', 'primary-container': '#1b2a4a',
                        'on-primary-container': '#8392b7', 'secondary': '#595e6d',
                        'on-tertiary-fixed': '#281800', 'tertiary-fixed': '#ffddb0',
                        'outline': '#75777f', 'outline-variant': '#c5c6cf',
                        'surface-container-high': '#e6e8ea', 'error': '#ba1a1a',
                        'error-container': '#ffdad6', 'on-error-container': '#93000a',
                        'surface-container-lowest': '#ffffff'
                    },
                    fontFamily: { 'body': ['Inter', 'system-ui', 'sans-serif'] },
                },
            },
        }
    ";
    wp_add_inline_script( 'tailwindcss', $tailwind_config );

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

    // NSW Licence Number
    $wp_customize->add_setting( 'timeless_licence', array(
        'default'           => '345678C',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'timeless_licence', array(
        'label'   => __( 'NSW Licence Number', 'timeless' ),
        'section' => 'timeless_business',
        'type'    => 'text',
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
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'timeless_abn', array(
        'label'   => __( 'ABN (optional)', 'timeless' ),
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
    return esc_html( get_theme_mod( 'timeless_phone', '0400 000 000' ) );
}

/** Get phone tel: link */
function timeless_phone_link() {
    return esc_attr( get_theme_mod( 'timeless_phone_link', '+61400000000' ) );
}

/** Get NSW licence */
function timeless_licence() {
    return esc_html( get_theme_mod( 'timeless_licence', '345678C' ) );
}

/** Get email */
function timeless_email() {
    return sanitize_email( get_theme_mod( 'timeless_email', 'info@timelessresurfacing.com.au' ) );
}

/* ──��─────────────────────────────���────────────
   5. SEO — Remove WordPress clutter
   ────────────────────��──────────────────────── */
remove_action( 'wp_head', 'wp_generator' );
remove_action( 'wp_head', 'wlwmanifest_link' );
remove_action( 'wp_head', 'rsd_link' );
remove_action( 'wp_head', 'wp_shortlink_wp_head' );

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
        'about'    => 'About Timeless Resurfacing. Sydney\'s bathroom resurfacing specialists. Qualified, insured, up to 3-year warranty on every job.',
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
   ───────────────────────────────────────────── */
function timeless_sitemap_xml() {
    global $wp;
    $request = $wp->request;

    if ( $request !== 'sitemap.xml' ) return;

    header( 'Content-Type: application/xml; charset=UTF-8' );
    header( 'X-Robots-Tag: noindex' );

    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    // Homepage
    echo '<url><loc>' . esc_url( home_url( '/' ) ) . '</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>' . "\n";

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

        // Higher priority for service pages
        if ( strpos( $slug, 'sydney' ) !== false ) {
            $priority = '0.8';
            $freq     = 'monthly';
        } elseif ( in_array( $slug, array( 'about', 'contact', 'gallery', 'faqs' ), true ) ) {
            $priority = '0.7';
            $freq     = 'monthly';
        } else {
            $priority = '0.5';
            $freq     = 'monthly';
        }

        echo '<url>';
        echo '<loc>' . esc_url( $url ) . '</loc>';
        echo '<lastmod>' . $modified . '</lastmod>';
        echo '<changefreq>' . $freq . '</changefreq>';
        echo '<priority>' . $priority . '</priority>';
        echo '</url>' . "\n";
    }

    echo '</urlset>';
    exit;
}
add_action( 'template_redirect', 'timeless_sitemap_xml' );

/* Register /sitemap.xml rewrite rule */
function timeless_sitemap_rewrite() {
    add_rewrite_rule( 'sitemap\.xml$', 'index.php?sitemap=1', 'top' );
}
add_action( 'init', 'timeless_sitemap_rewrite' );

function timeless_sitemap_query_var( $vars ) {
    $vars[] = 'sitemap';
    return $vars;
}
add_filter( 'query_vars', 'timeless_sitemap_query_var' );

/* Disable WordPress default sitemaps (wp-sitemap.xml) to avoid duplicates */
add_filter( 'wp_sitemaps_enabled', '__return_false' );

/* Add sitemap link to robots.txt */
function timeless_robots_txt( $output, $public ) {
    $output .= "\nSitemap: " . home_url( '/sitemap.xml' ) . "\n";
    return $output;
}
add_filter( 'robots_txt', 'timeless_robots_txt', 10, 2 );

/* ─────────────────────────────────────────────
   6. DISABLE COMMENTS (not needed for trades site)
   ────────────────��──────────────────────────── */
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

/** Remove Gutenberg block CSS on frontend (not using block editor for templates) */
function timeless_remove_block_css() {
    wp_dequeue_style( 'wp-block-library' );
    wp_dequeue_style( 'wp-block-library-theme' );
    wp_dequeue_style( 'wc-blocks-style' );
    wp_dequeue_style( 'global-styles' );
}
add_action( 'wp_enqueue_scripts', 'timeless_remove_block_css', 100 );

/** Remove oEmbed scripts */
remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );
remove_action( 'wp_head', 'wp_oembed_add_host_js' );

/** Remove DNS prefetch for WordPress.org */
remove_action( 'wp_head', 'wp_resource_hints', 2 );

/** Add preconnect hints for Google Fonts + Tailwind CDN (speed up external resource loading) */
function timeless_preconnect_hints() {
    echo '<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />' . "\n";
    echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />' . "\n";
    echo '<link rel="dns-prefetch" href="https://cdn.tailwindcss.com" />' . "\n";
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
