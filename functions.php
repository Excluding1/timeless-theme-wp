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

/* ────��────────────────────��───────────────────
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
