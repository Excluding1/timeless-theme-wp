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
    add_theme_support( 'wp-block-styles' );  // Gutenberg block default styles
    add_theme_support( 'align-wide' );        // Wide/full alignment for blocks

    register_nav_menus( array(
        'primary' => __( 'Primary Navigation', 'timeless' ),
    ) );
}

/* ─────────────────────────────────────────────
   1b. CUSTOM POST TYPE: ARTICLE (Blog)
   ─────────────────────────────────────────────
   Custom CPT "article" lives at /blog/{slug}/. Separate from default
   "page" so blog content stays organized in its own admin section.
   Gutenberg-enabled (show_in_rest=true) so users can compose flexible
   layouts with text + images + custom shortcodes for before/after etc.
   ───────────────────────────────────────────── */
function timeless_register_article_cpt() {
    register_post_type( 'article', array(
        'labels' => array(
            'name'               => 'Articles',
            'singular_name'      => 'Article',
            'add_new'            => 'Add New Article',
            'add_new_item'       => 'Add New Article',
            'edit_item'          => 'Edit Article',
            'new_item'           => 'New Article',
            'view_item'          => 'View Article',
            'search_items'       => 'Search Articles',
            'not_found'          => 'No articles found',
            'not_found_in_trash' => 'No articles in trash',
            'menu_name'          => 'Blog',
        ),
        'public'              => true,
        'has_archive'         => 'blog',
        'rewrite'             => array( 'slug' => 'blog', 'with_front' => false ),
        'supports'            => array( 'title', 'editor', 'thumbnail', 'excerpt', 'author' ),
        'show_in_rest'        => true,  // Gutenberg
        'menu_icon'           => 'dashicons-edit',
        'menu_position'       => 5,
        'taxonomies'          => array( 'category', 'post_tag' ),
    ) );
}
add_action( 'init', 'timeless_register_article_cpt' );

/* ─────────────────────────────────────────────
   1c. SHORTCODES FOR BLOG CONTENT
   ─────────────────────────────────────────────
   Custom shortcodes that authors can embed in articles via the Shortcode
   block in Gutenberg, OR by typing the [shortcode] markup directly in
   any text block. Each renders themed components matching the rest of
   the site (before/after, icon callouts, process steps).
   ───────────────────────────────────────────── */

/* [before_after before="url" after="url" alt="..."], interactive slider */
/**
 * Inline SVG icons for the blog shortcodes.
 *
 * WHY THIS EXISTS. Material Symbols is self-hosted as a ~10KB SUBSET containing only the
 * glyphs the main site pages use. The blog shortcodes call icons that are not in that
 * subset (lightbulb, swap_horiz, bolt, drag_indicator...), so the @font-face has no glyph,
 * the browser falls back, and the LIGATURE NAME renders as literal text: readers saw the
 * word "lightbulb" sitting next to "PRO TIP", and "swap_horiz" next to "Replace when".
 *
 * Patching the subset would fix today and break again the first time a new icon is used,
 * silently, in published content. Inline SVG cannot regress: no font to load, no subset to
 * keep in sync, renders identically everywhere, and the markup is crawlable.
 *
 * @param string $name  icon key
 * @param string $class Tailwind classes for sizing/colour (currentColor is inherited)
 * @param string $style optional inline style
 */
function timeless_icon( $name, $class = '', $style = '' ) {
    $paths = array(
        'lightbulb'       => 'M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z',
        'verified'        => 'M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z',
        'warning'         => 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
        'bolt'            => 'M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z',
        'arrow_forward'   => 'M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z',
        'swap_horiz'      => 'M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z',
        'check_circle'    => 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
        'drag_indicator'  => 'M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
        // stat-grid icons
        'bathtub'         => 'M7 7c0-1.1.9-2 2-2s2 .9 2 2c0 .37-.1.72-.28 1.02l1.26 1.26 1.06-1.06a2.5 2.5 0 0 1 3.54 0l.7.7-1.06 1.06-.7-.7a1 1 0 0 0-1.42 0l-1.06 1.06L20 15H4v-2h9.17l-3.9-3.9A2.98 2.98 0 0 1 7 7zM4 17h16v1a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-1z',
        'schedule'        => 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z',
        'home_repair'     => 'M12 3 2 12h3v8h6v-5h2v5h6v-8h3L12 3zm0 2.7 5 4.5V18h-2v-5H9v5H7v-7.8l5-4.5z',
    );
    $d = $paths[ $name ] ?? $paths['check_circle'];
    return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"'
        . ( $class ? ' class="' . esc_attr( $class ) . '"' : '' )
        . ( $style ? ' style="' . esc_attr( $style ) . '"' : '' )
        . '><path d="' . $d . '"/></svg>';
}

function timeless_shortcode_before_after( $atts ) {
    $a = shortcode_atts( array(
        'before' => '',
        'after'  => '',
        'alt'    => 'Before and after',
    ), $atts );
    if ( empty( $a['before'] ) || empty( $a['after'] ) ) {
        return '';
    }
    ob_start(); ?>
    <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none mx-auto w-full max-w-2xl my-8" style="aspect-ratio:3/2;cursor:ew-resize;">
        <div class="absolute inset-0 w-full h-full">
            <img src="<?php echo esc_url( $a['after'] ); ?>" alt="<?php echo esc_attr( $a['alt'] . ', after' ); ?>" class="w-full h-full object-cover absolute inset-0" />
        </div>
        <div class="ba-clip absolute inset-0 overflow-hidden" style="clip-path:inset(0 50% 0 0);">
            <div class="ba-before absolute inset-0">
                <img src="<?php echo esc_url( $a['before'] ); ?>" alt="<?php echo esc_attr( $a['alt'] . ', before' ); ?>" class="w-full h-full object-cover absolute inset-0" />
            </div>
        </div>
        <div class="ba-handle absolute top-0 bottom-0" style="left:50%;transform:translateX(-50%);cursor:ew-resize;">
            <div class="ba-knob absolute top-1/2 left-1/2 flex items-center justify-center" style="transform:translate(-50%,-50%);">
                <?php echo timeless_icon( 'drag_indicator', 'text-primary', 'width:20px;height:20px' ); ?>
            </div>
        </div>
        <span class="absolute top-3 left-3 bg-white/90 text-primary text-xs font-bold px-2 py-1 rounded">BEFORE</span>
        <span class="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded">AFTER</span>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'before_after', 'timeless_shortcode_before_after' );

/* [icon_callout type="tip|warning|fact" icon="..." title="..." content="..."], themed callout.
   Three variants, each with a small uppercase label above the title:
     tip     — gold wash, lightbulb, "PRO TIP"
     warning — red wash, warning, "WATCH OUT"
     fact    — original neutral style, verified, "GOOD TO KNOW"
   Backwards-compatible: no type = fact. An explicit icon="" attr overrides
   the variant icon. Variant colors are inline styles (arbitrary values may
   not exist in the compiled Tailwind set). */
function timeless_shortcode_icon_callout( $atts, $content = null ) {
    $a = shortcode_atts( array(
        'icon'    => '',
        'title'   => '',
        'content' => '',
        'type'    => 'fact',
    ), $atts );
    $types = array(
        'tip'     => array( 'icon' => 'lightbulb', 'label' => 'Pro tip',      'bg' => 'rgba(231,192,139,.12)', 'border' => '#e7c08b', 'accent' => '#7a5c10' ),
        'warning' => array( 'icon' => 'warning',   'label' => 'Watch out',    'bg' => 'rgba(186,26,26,.05)',   'border' => '#ba1a1a', 'accent' => '#ba1a1a' ),
        'fact'    => array( 'icon' => 'verified',  'label' => 'Good to know', 'bg' => '#f7f9fb',               'border' => '#041534', 'accent' => '#041534' ),
    );
    $t    = $types[ strtolower( $a['type'] ) ] ?? $types['fact'];
    $icon = $a['icon'] ?: $t['icon'];
    $body = $a['content'] ?: $content;
    ob_start(); ?>
    <div class="my-6 rounded-xl p-6 flex items-start gap-4" style="background:<?php echo esc_attr( $t['bg'] ); ?>;border-left:4px solid <?php echo esc_attr( $t['border'] ); ?>;">
        <?php echo timeless_icon( $icon, 'shrink-0', 'width:30px;height:30px;color:' . esc_attr( $t['accent'] ) ); ?>
        <div class="flex-1">
            <p class="text-[0.65rem] font-bold uppercase tracking-widest mb-1" style="color:<?php echo esc_attr( $t['accent'] ); ?>;"><?php echo esc_html( $t['label'] ); ?></p>
            <?php if ( $a['title'] ) : ?>
                <h4 class="font-bold text-primary mb-2 text-lg" style="margin-top:0;"><?php echo esc_html( $a['title'] ); ?></h4>
            <?php endif; ?>
            <div class="text-sm text-secondary leading-relaxed"><?php echo wp_kses_post( $body ); ?></div>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'icon_callout', 'timeless_shortcode_icon_callout' );

/* [process_step number="1" title="..." duration="..." content="..."], timeline step */
function timeless_shortcode_process_step( $atts, $content = null ) {
    $a = shortcode_atts( array(
        'number'   => '1',
        'title'    => '',
        'duration' => '',
        'content'  => '',
    ), $atts );
    $body = $a['content'] ?: $content;
    ob_start(); ?>
    <div class="tr-step flex gap-4">
        <div class="flex flex-col items-center shrink-0">
            <div class="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center">
                <div class="w-10 h-10 rounded-full bg-[#e7c08b]/20 flex items-center justify-center">
                    <span class="text-base font-black text-[#7a5c10]"><?php echo esc_html( $a['number'] ); ?></span>
                </div>
            </div>
        </div>
        <div class="flex-1">
            <?php if ( $a['duration'] ) : ?>
                <span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full inline-block mb-2"><?php echo esc_html( $a['duration'] ); ?></span>
            <?php endif; ?>
            <?php if ( $a['title'] ) : ?>
                <h4 class="font-bold text-primary mb-1 text-lg"><?php echo esc_html( $a['title'] ); ?></h4>
            <?php endif; ?>
            <div class="text-sm text-secondary leading-relaxed"><?php echo wp_kses_post( $body ); ?></div>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'process_step', 'timeless_shortcode_process_step' );

/* [stat_grid] for reusable stat blocks like the homepage hero counters
   Usage: [stat_grid stats="1 Day|Most jobs;Up to 80%|Save vs new;3yr|Warranty"] */
function timeless_shortcode_stat_grid( $atts ) {
    $a = shortcode_atts( array(
        'stats'   => '',
        'eyebrow' => '',   // small rule-flanked label above the grid
        'title'   => '',   // display heading
        'intro'   => '',   // one supporting line under the heading
        'cols'    => '',   // 2-4; defaults to the item count so a set never strands a card
        'compact' => '',   // yes = smaller cards, for a supporting block rather than a hero stat
    ), $atts );
    if ( empty( $a['stats'] ) ) return '';
    /* Rebuilt 2026-08-22. Was a bare card with a number in it and nothing else: no
       framing, no hierarchy, no reason for the eye to stop. The additions are all
       structural rather than decorative -- an optional rule-flanked eyebrow and heading
       so the block announces what it is, a gold hairline under each figure so the number
       and its caption read as one unit instead of two stacked lines, and real padding.
       Palette stays navy and gold; the layout idea came from a reference, the styling is
       the theme's own. Uses .tr-stat in style.css because the flanking rules need
       pseudo-elements. */
    $items = array_filter( array_map( 'trim', explode( ';', $a['stats'] ) ) );
    ob_start(); ?>
    <div class="my-10">
        <?php if ( $a['eyebrow'] || $a['title'] || $a['intro'] ) : ?>
            <div class="text-center mb-8">
                <?php if ( $a['eyebrow'] ) : ?>
                    <p class="tr-stat-eyebrow"><?php echo esc_html( $a['eyebrow'] ); ?></p>
                <?php endif; ?>
                <?php if ( $a['title'] ) : ?>
                    <p class="tr-stat-title"><?php echo esc_html( $a['title'] ); ?></p>
                <?php endif; ?>
                <?php if ( $a['intro'] ) : ?>
                    <p class="tr-stat-intro"><?php echo esc_html( $a['intro'] ); ?></p>
                <?php endif; ?>
            </div>
        <?php endif; ?>
        <?php
            /* Columns come from style.css via data-cols, not from Tailwind classes.
               Two reasons: a generated class such as sm:grid-cols-4 would be purged out
               of the compiled build and silently collapse the grid, and the hardwired
               3 columns left a 4-item set as 3 + 1 with the last card stranded alone. */
            $cols    = is_numeric( $a['cols'] ) ? max( 2, min( 4, (int) $a['cols'] ) ) : min( 4, max( 2, count( $items ) ) );
            $compact = in_array( strtolower( (string) $a['compact'] ), array( 'yes', 'true', '1' ), true );
            ?>
        <div class="tr-stat-grid<?php echo $compact ? ' is-compact' : ''; ?>" data-cols="<?php echo (int) $cols; ?>">
            <?php foreach ( $items as $item ) :
                $parts = explode( '|', $item );
                $value = trim( $parts[0] ?? '' );
                $label = trim( $parts[1] ?? '' );
                $icon  = trim( $parts[2] ?? '' );   // optional third field: value|label|icon
                if ( ! $value ) continue; ?>
                <div class="tr-stat">
                    <?php if ( $icon ) : ?>
                        <span class="tr-stat-badge"><?php echo timeless_icon( $icon, '', 'width:26px;height:26px' ); ?></span>
                    <?php endif; ?>
                    <p class="tr-stat-value"><?php echo esc_html( $value ); ?></p>
                    <span class="tr-stat-rule" aria-hidden="true"></span>
                    <p class="tr-stat-label"><?php echo esc_html( $label ); ?></p>
                    <svg class="tr-stat-wave" viewBox="0 0 240 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                        <path d="M0 22c34-14 62 12 96 4s52-22 88-14c22 5 40 2 56-4v32H0z"/>
                    </svg>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'stat_grid', 'timeless_shortcode_stat_grid' );

/* [compare_table left="Resurfacing" right="Replacement" rows="Time|About a day|1 to 2 weeks;Mess|None|Full demolition"]
   Two-option comparison table. Tables are highly AI-extractable and can win Google featured
   snippets. Each row = "Label|Left value|Right value". Semantic <table> with scope for a11y. */
function timeless_shortcode_compare_table( $atts ) {
    $a = shortcode_atts( array( 'left' => 'Option A', 'right' => 'Option B', 'rows' => '', 'caption' => '' ), $atts );
    if ( empty( $a['rows'] ) ) return '';
    ob_start(); ?>
    <figure class="my-8 not-prose overflow-x-auto">
        <table class="w-full text-sm border-collapse bg-white rounded-xl overflow-hidden border border-surface-container">
            <thead>
                <tr class="bg-primary text-white">
                    <th scope="col" class="text-left p-3 font-semibold"></th>
                    <th scope="col" class="text-left p-3 font-semibold"><?php echo esc_html( $a['left'] ); ?></th>
                    <th scope="col" class="text-left p-3 font-semibold"><?php echo esc_html( $a['right'] ); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ( explode( ';', $a['rows'] ) as $row ) :
                    $c = array_map( 'trim', explode( '|', $row ) );
                    if ( empty( $c[0] ) ) continue; ?>
                    <tr class="border-t border-surface-container">
                        <th scope="row" class="p-3 font-semibold text-primary text-left"><?php echo esc_html( $c[0] ); ?></th>
                        <td class="p-3 text-secondary"><?php echo esc_html( $c[1] ?? '' ); ?></td>
                        <td class="p-3 text-secondary"><?php echo esc_html( $c[2] ?? '' ); ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <?php if ( $a['caption'] ) : ?><figcaption class="text-xs text-secondary italic mt-2 text-center"><?php echo esc_html( $a['caption'] ); ?></figcaption><?php endif; ?>
    </figure>
    <?php
    return ob_get_clean();
}
add_shortcode( 'compare_table', 'timeless_shortcode_compare_table' );

/* [bar_chart eyebrow="ABS Census 2021" title="Rental share by suburb" unit="%"
              bars="Parramatta|74.9;Liverpool|69.6" highlight="Sydney average" caption="..."]

   A bar chart that is a REAL <table> underneath, with the bars drawn as CSS widths
   inside the value cell.

   Why not an SVG chart, or a JS charting library: a picture of a number cannot be read
   by anything. Google's AI Overviews, Perplexity and screen readers all extract tables,
   and the whole point of this article's data section is to be the source that gets
   quoted. A table also prints, survives CSS being unavailable, needs no build step
   (theme rule), and costs no JavaScript. So the markup is semantic and the bar is
   decoration layered on top, never the other way round.

   Bar widths are inline styles on purpose: Tailwind is compiled and purged here, so a
   generated class such as w-[74.9%] would be stripped and every bar would render at
   zero width. The palette lives in .tr-bar-* in style.css for the same reason.

   highlight = one label drawn in gold instead of navy, for the reference line (an
   average, a threshold) so the comparison has an anchor.
   max       = scale ceiling. Defaults to the largest value, or 100 when unit is %,
               so percentage charts are never silently rescaled to exaggerate a gap. */
function timeless_shortcode_bar_chart( $atts ) {
    $a = shortcode_atts( array(
        'eyebrow'   => '',
        'title'     => '',
        'intro'     => '',
        'bars'      => '',
        'unit'      => '',
        'highlight' => '',
        'max'       => '',
        'label_col' => 'Area',
        'value_col' => 'Value',
        'caption'   => '',
    ), $atts );

    if ( empty( $a['bars'] ) ) {
        return '';
    }

    $rows = array();
    foreach ( explode( ';', $a['bars'] ) as $bar ) {
        $parts = array_map( 'trim', explode( '|', $bar ) );
        if ( $parts[0] === '' || ! isset( $parts[1] ) || ! is_numeric( $parts[1] ) ) {
            continue;
        }
        $rows[] = array( 'label' => $parts[0], 'value' => (float) $parts[1] );
    }

    if ( ! $rows ) {
        return '';
    }

    $values = wp_list_pluck( $rows, 'value' );
    if ( is_numeric( $a['max'] ) && (float) $a['max'] > 0 ) {
        $max = (float) $a['max'];
    } elseif ( $a['unit'] === '%' ) {
        $max = 100.0;
    } else {
        $max = max( $values );
    }
    if ( $max <= 0 ) {
        $max = 1.0;
    }

    ob_start(); ?>
    <figure class="tr-bar-figure my-10 not-prose">
        <?php if ( $a['eyebrow'] || $a['title'] || $a['intro'] ) : ?>
            <div class="tr-bar-head">
                <?php if ( $a['eyebrow'] ) : ?><p class="tr-stat-eyebrow"><?php echo esc_html( $a['eyebrow'] ); ?></p><?php endif; ?>
                <?php if ( $a['title'] ) : ?><p class="tr-stat-title"><?php echo esc_html( $a['title'] ); ?></p><?php endif; ?>
                <?php if ( $a['intro'] ) : ?><p class="tr-stat-intro"><?php echo esc_html( $a['intro'] ); ?></p><?php endif; ?>
            </div>
        <?php endif; ?>

        <table class="tr-bar-table">
            <thead>
                <tr>
                    <th scope="col"><?php echo esc_html( $a['label_col'] ); ?></th>
                    <th scope="col"><?php echo esc_html( $a['value_col'] ); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ( $rows as $row ) :
                    $pct    = max( 0, min( 100, ( $row['value'] / $max ) * 100 ) );
                    $is_hl  = ( $a['highlight'] !== '' && $row['label'] === $a['highlight'] );
                    // Trailing zeros look like false precision on a whole number.
                    $display = rtrim( rtrim( number_format( $row['value'], 1 ), '0' ), '.' ) . $a['unit'];
                    ?>
                    <tr<?php echo $is_hl ? ' class="is-reference"' : ''; ?>>
                        <th scope="row"><?php echo esc_html( $row['label'] ); ?></th>
                        <td>
                            <span class="tr-bar-track" aria-hidden="true">
                                <span class="tr-bar-fill" style="width:<?php echo esc_attr( round( $pct, 2 ) ); ?>%"></span>
                            </span>
                            <span class="tr-bar-value"><?php echo esc_html( $display ); ?></span>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <?php if ( $a['caption'] ) : ?>
            <figcaption class="tr-bar-caption"><?php echo esc_html( $a['caption'] ); ?></figcaption>
        <?php endif; ?>
    </figure>
    <?php
    return ob_get_clean();
}
add_shortcode( 'bar_chart', 'timeless_shortcode_bar_chart' );

/* [when_cards left_title="Resurface when" left="chips;stains;sound tub" right_title="Replace when" right="cracked through;rusted base"]
   Two decision cards (green "do this when" / amber "the other option when"). Very digestible;
   semicolon-separated bullet lists. */
function timeless_shortcode_when_cards( $atts ) {
    $a = shortcode_atts( array(
        'left_title' => 'Resurface when', 'left' => '',
        'right_title' => 'Replace when', 'right' => '',
    ), $atts );
    $mk = function( $title, $items, $accent, $icon ) {
        $list = array_filter( array_map( 'trim', explode( ';', $items ) ) );
        ob_start(); ?>
        <div class="flex-1 bg-white rounded-xl p-5 border-t-4 <?php echo esc_attr( $accent ); ?> border border-surface-container">
            <h4 class="font-bold text-primary mb-3 flex items-center gap-2"><?php echo timeless_icon( $icon, '', 'width:20px;height:20px;flex-shrink:0' ); ?><?php echo esc_html( $title ); ?></h4>
            <ul class="space-y-1.5 text-sm text-secondary list-none pl-0">
                <?php foreach ( $list as $li ) : ?><li class="flex gap-2"><span aria-hidden="true">•</span><span><?php echo esc_html( $li ); ?></span></li><?php endforeach; ?>
            </ul>
        </div>
        <?php return ob_get_clean();
    };
    ob_start(); ?>
    <div class="my-8 flex flex-col sm:flex-row gap-4 not-prose">
        <?php
        echo $mk( $a['left_title'], $a['left'], 'border-t-[#2e7d52]', 'check_circle' );
        echo $mk( $a['right_title'], $a['right'], 'border-t-[#b45309]', 'swap_horiz' );
        ?>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'when_cards', 'timeless_shortcode_when_cards' );

/* [decision_flow question="Is the bath structurally sound?" yes="Resurface — about a day, a fraction of the cost" no="Replace — cracked through or rusted out"]
   A small SVG decision flowchart. Uses real <text> labels (AI-readable) + role/title/desc for a11y.
   Responsive via viewBox + max-width. Brand palette. */
function timeless_shortcode_decision_flow( $atts ) {
    $a = shortcode_atts( array(
        'question' => '', 'yes' => '', 'no' => '',
        'yes_label' => 'Yes', 'no_label' => 'No',
    ), $atts );
    if ( ! $a['question'] ) return '';
    /* Rebuilt 2026-08-20. Was a hand-drawn SVG flowchart: a navy box with two diagonal
       lines running to two rounded rectangles. Three things made it read as generic AI
       filler rather than part of this site:
         - text was wrapped by counting characters into at most two <tspan> lines, so any
           answer longer than ~34 characters simply overflowed its box;
         - the canvas was a fixed 680x300 viewBox, so on a phone the type shrank to
           roughly 7px while the diagram kept its desktop proportions;
         - the palette was #2e7d52 / #b45309, which appears nowhere else in the theme.
       It is now built from the same parts as the rest of the site: the navy header of
       compare_table, the card border of when_cards, and real HTML that wraps, reflows
       and stays legible at any width. The divider is inline CSS because sm:border-r and
       sm:border-b-0 are not in the compiled Tailwind. */
    ob_start(); ?>
    <figure class="my-8">
        <div class="rounded-xl overflow-hidden border border-surface-container bg-white">
            <div class="bg-primary text-white p-4 text-center">
                <p class="text-xs uppercase tracking-widest opacity-70 mb-1">Quick decision</p>
                <p class="font-bold text-base"><?php echo esc_html( $a['question'] ); ?></p>
            </div>
            <div class="tr-decision grid sm:grid-cols-2">
                <div class="p-5" style="border-bottom:1px solid #e4e4e7">
                    <span class="inline-block text-xs font-bold uppercase tracking-wide text-green-700 mb-2"><?php echo esc_html( $a['yes_label'] ); ?></span>
                    <p class="text-sm text-secondary leading-relaxed"><?php echo esc_html( $a['yes'] ); ?></p>
                </div>
                <div class="p-5">
                    <span class="inline-block text-xs font-bold uppercase tracking-wide text-error mb-2"><?php echo esc_html( $a['no_label'] ); ?></span>
                    <p class="text-sm text-secondary leading-relaxed"><?php echo esc_html( $a['no'] ); ?></p>
                </div>
            </div>
        </div>
    </figure>
    <?php
    return ob_get_clean();
}
add_shortcode( 'decision_flow', 'timeless_shortcode_decision_flow' );

/* [key_takeaways items="bullet one;bullet two;bullet three"]
   Navy summary box for the very top of an article: gold uppercase
   "THE SHORT ANSWER" label with a bolt icon + white bullets with gold
   markers. Semicolon-separated items (same convention as stat_grid /
   when_cards). Override the label via label="" if ever needed. */
function timeless_shortcode_key_takeaways( $atts ) {
    $a = shortcode_atts( array(
        'items' => '',
        'label' => 'The short answer',
    ), $atts );
    $items = array_filter( array_map( 'trim', explode( ';', $a['items'] ) ) );
    if ( empty( $items ) ) return '';
    ob_start(); ?>
    <div class="my-8 rounded-2xl p-6 sm:p-8 not-prose" style="background:#041534;">
        <p class="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-widest mb-4" style="color:#e7c08b;">
            <?php echo timeless_icon( 'bolt', '', 'width:16px;height:16px' ); ?>
            <?php echo esc_html( $a['label'] ); ?>
        </p>
        <ul class="space-y-2.5 list-none pl-0" style="margin:0;padding-left:0;list-style:none;">
            <?php foreach ( $items as $li ) : ?>
            <li class="flex gap-3 leading-relaxed" style="color:rgba(255,255,255,.9);">
                <span aria-hidden="true" style="color:#e7c08b;font-weight:800;">&bull;</span>
                <span><?php echo esc_html( $li ); ?></span>
            </li>
            <?php endforeach; ?>
        </ul>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'key_takeaways', 'timeless_shortcode_key_takeaways' );

/* [price_range low="" typical="" high="" note=""] — 3-cell stat strip.
   ⚠️ BUILT BUT INTENTIONALLY UNUSED: site policy is NO prices in content
   (confirmed decisions). Do not add this to posts unless that policy
   changes; it exists so a future pricing decision needs no theme change. */
function timeless_shortcode_price_range( $atts ) {
    $a = shortcode_atts( array(
        'low'     => '',
        'typical' => '',
        'high'    => '',
        'note'    => '',
    ), $atts );
    if ( '' === $a['low'] && '' === $a['typical'] && '' === $a['high'] ) return '';
    $cells = array(
        array( 'Low', $a['low'], false ),
        array( 'Typical', $a['typical'], true ),
        array( 'High', $a['high'], false ),
    );
    ob_start(); ?>
    <div class="my-8 not-prose">
        <div class="grid grid-cols-3 gap-3">
            <?php foreach ( $cells as $c ) : if ( '' === $c[1] ) continue; ?>
            <div class="bg-white rounded-xl p-4 text-center border border-surface-container" <?php echo $c[2] ? 'style="border-color:#041534;box-shadow:0 4px 12px rgba(4,21,52,.08);"' : ''; ?>>
                <p class="text-[0.65rem] font-bold uppercase tracking-widest text-secondary mb-1"><?php echo esc_html( $c[0] ); ?></p>
                <p class="text-xl sm:text-2xl font-extrabold text-primary leading-tight"><?php echo esc_html( $c[1] ); ?></p>
            </div>
            <?php endforeach; ?>
        </div>
        <?php if ( $a['note'] ) : ?>
            <p class="text-xs text-secondary italic mt-2 text-center"><?php echo esc_html( $a['note'] ); ?></p>
        <?php endif; ?>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'price_range', 'timeless_shortcode_price_range' );

/* [inline_cta text="..." button="..."] — soft mid-article CTA row.
   Light surface bg, one line of copy + navy button to /contact/. Meant to
   sit at a natural break after the 2nd or 3rd section of a post. */
function timeless_shortcode_inline_cta( $atts ) {
    $a = shortcode_atts( array(
        'text'   => 'Not sure if yours can be resurfaced? Send us 2 photos and get a fixed quote in 24 hours.',
        'button' => 'Get a free quote',
    ), $atts );
    ob_start(); ?>
    <div class="my-8 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center gap-4 not-prose" style="background:#f2f4f8;">
        <p class="flex-1 text-sm font-medium" style="color:#041534;margin:0;"><?php echo esc_html( $a['text'] ); ?></p>
        <?php // On articles the real quote form sits at the end of the page (#article-quote); elsewhere fall back to /contact/
        $cta_href = is_singular( 'article' ) ? '#article-quote' : home_url( '/contact/' ); ?>
        <a href="<?php echo esc_url( $cta_href ); ?>" class="inline-flex items-center justify-center gap-2 bg-primary text-white text-sm font-bold py-2.5 px-5 rounded-lg hover:shadow-lg transition-all shrink-0 whitespace-nowrap">
            <?php echo esc_html( $a['button'] ); ?>
            <?php echo timeless_icon( 'arrow_forward', '', 'width:16px;height:16px' ); ?>
        </a>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'inline_cta', 'timeless_shortcode_inline_cta' );

/* Reading time for an article (~200 wpm, min 1). Shared by single hero,
   related-post cards and the archive cards. */
function timeless_article_reading_time( $post_id = 0 ) {
    $post_id = $post_id ? $post_id : get_the_ID();
    $words   = str_word_count( wp_strip_all_tags( strip_shortcodes( (string) get_post_field( 'post_content', $post_id ) ) ) );
    return max( 1, (int) round( $words / 200 ) );
}

/* ─────────────────────────────────────────────────────────────────
 * [timeless_quote_form], Embeds the React quote form anywhere.
 *
 * Use on any page/post via: [timeless_quote_form]
 * Or in PHP via: <?php echo do_shortcode('[timeless_quote_form]'); ?>
 *
 * Source: quote-form/src/QuoteForm.jsx
 * Build:  cd quote-form && npm run build  →  outputs to assets/quote-form/
 * Embed:  this shortcode prints the mount div, sets the asset base URL,
 *         and enqueues the built JS + CSS bundles.
 *
 * Image base: the form references images at /images/areas/... and
 * /images/services/..., those paths only resolve correctly when
 * window.TIMELESS_FORM_BASE is set to the theme's assets/quote-form/
 * URL (so /images/areas/shower.jpg becomes
 * /wp-content/themes/.../assets/quote-form/images/areas/shower.jpg).
 * ───────────────────────────────────────────────────────────────── */


function timeless_quote_form_shortcode( $atts = array() ) {
    static $rendered_once = false;
    $atts = shortcode_atts( array(
        'id' => 'quote-form-root',
    ), $atts, 'timeless_quote_form' );

    $base_url = get_template_directory_uri() . '/assets/quote-form';
    $js_url   = $base_url . '/quote-form.js';
    $css_url  = $base_url . '/quote-form.css';

    ob_start();
    ?>
    <div id="<?php echo esc_attr( $atts['id'] ); ?>" class="timeless-quote-form-mount" style="min-height:400px;"></div>
    <?php if ( ! $rendered_once ) :
        $rendered_once = true;
        // Cache-bust on the JS file's mtime so deploys are immediately visible without manual cache-clear.
        $js_path  = get_template_directory() . '/assets/quote-form/quote-form.js';
        $css_path = get_template_directory() . '/assets/quote-form/quote-form.css';
        $js_ver   = file_exists( $js_path )  ? filemtime( $js_path )  : '1';
        $css_ver  = file_exists( $css_path ) ? filemtime( $css_path ) : '1';
        ?>
        <link rel="stylesheet" href="<?php echo esc_url( $css_url . '?v=' . $css_ver ); ?>" />
        <script>window.TIMELESS_FORM_BASE = <?php echo wp_json_encode( $base_url ); ?>;
        /* draft store (v1.5.2): lets the form swap a 1,800-char resume URL for a short code */
        window.TIMELESS_AJAX = <?php echo wp_json_encode( admin_url( 'admin-ajax.php' ) ); ?>;
        <?php
        /* Where resume links land. Both the SMS link AND the QR handoff point here, so if
         * the Finish Your Quote page has not been created yet this would 404 and take the
         * QR down with it. Fall back to the current page in that case: links stay long,
         * but nothing breaks while the page is being set up. */
        $tr_resume = get_page_by_path( 'finish-quote' );
        $tr_resume_url = $tr_resume ? get_permalink( $tr_resume ) : ( is_singular() ? get_permalink() : home_url( '/contact/' ) );
        ?>
        window.TIMELESS_RESUME_PAGE = <?php echo wp_json_encode( $tr_resume_url ); ?>;</script>
        <script type="module" defer src="<?php echo esc_url( $js_url . '?v=' . $js_ver ); ?>"></script>
    <?php endif;
    return ob_get_clean();
}
add_shortcode( 'timeless_quote_form', 'timeless_quote_form_shortcode' );

/* Flush rewrite rules when CPT is registered (one-time, on theme activation) */
function timeless_flush_blog_rewrites() {
    if ( ! get_option( 'timeless_blog_rewrites_flushed' ) ) {
        timeless_register_article_cpt();
        flush_rewrite_rules();
        update_option( 'timeless_blog_rewrites_flushed', '1' );
    }
}
add_action( 'init', 'timeless_flush_blog_rewrites', 99 );

/* ─────────────────────────────────────────────
   1f. BLOG CTA WIDGETS (sidebar quote box + end-of-article CTA)
   ─────────────────────────────────────────────
   Conversion-focused components used in blog archive sidebar AND single
   article footer. Pattern modeled on competitor analysis (Surface Care
   uses a sidebar quote-box on archives + full-width CTA section after
   article content). Both reuse the same brand language for consistency.
   ───────────────────────────────────────────── */

/* Sidebar quote box, image background + headline + button.
   Used in: archive-article.php sidebar, single-article.php TOC sidebar.
   Returns rendered HTML so callers can echo or buffer it. */
function timeless_blog_quote_cta_box() {
    $img      = get_template_directory_uri() . '/images/services/bath-resurfacing/hero.jpg';
    $contact  = esc_url( home_url( '/contact/' ) );
    $tel_disp = function_exists( 'timeless_phone' ) ? timeless_phone() : '0451 110 154';
    $tel_link = function_exists( 'timeless_phone_link' ) ? timeless_phone_link() : '+61451110154';
    ob_start(); ?>
    <aside class="bg-primary rounded-2xl overflow-hidden shadow-md relative" aria-label="Free quote call to action">
        <div class="relative h-40 sm:h-48 overflow-hidden">
            <img src="<?php echo esc_url( $img ); ?>" alt="" class="w-full h-full object-cover" loading="lazy" />
            <div class="absolute inset-0 bg-linear-to-t from-primary via-primary/70 to-transparent"></div>
        </div>
        <div class="p-6 -mt-12 relative">
            <span class="inline-block py-0.5 px-2 bg-tertiary-fixed text-on-tertiary-fixed text-[0.6rem] font-bold tracking-widest uppercase rounded-sm mb-3">Free Quote</span>
            <h3 class="text-xl font-extrabold text-white tracking-tight leading-tight mb-2">Request A Free Quote</h3>
            <p class="text-xs text-white/80 leading-relaxed mb-5">Send 3-4 photos. Fixed-price quote back within 1 business day. No obligation.</p>
            <a href="<?php echo $contact; ?>" class="block w-full text-center bg-white text-primary font-bold py-2.5 rounded-lg hover:bg-surface-container-low transition-colors text-sm mb-2">
                Get Free Quote →
            </a>
            <a href="tel:<?php echo esc_attr( $tel_link ); ?>" class="block w-full text-center border border-white/30 text-white font-bold py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm">
                <span class="material-symbols-outlined text-sm align-middle" aria-hidden="true">call</span>
                Call <?php echo esc_html( $tel_disp ); ?>
            </a>
        </div>
    </aside>
    <?php
    return ob_get_clean();
}

/* Recent posts widget, 5 most recent articles for sidebar. */
function timeless_blog_recent_posts_widget( $limit = 5 ) {
    $recent = get_posts( array(
        'post_type'      => 'article',
        'posts_per_page' => $limit,
        'post_status'    => 'publish',
        'orderby'        => 'date',
        'order'          => 'DESC',
    ) );
    if ( empty( $recent ) ) {
        return '';
    }
    ob_start(); ?>
    <aside class="bg-surface-container-low rounded-2xl p-6" aria-label="Recent posts">
        <h3 class="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-base" aria-hidden="true">schedule</span>
            Recent Posts
        </h3>
        <ul class="space-y-3">
            <?php foreach ( $recent as $post ) : setup_postdata( $post );
                $thumb = get_the_post_thumbnail_url( $post->ID, 'thumbnail' );
            ?>
                <li>
                    <a href="<?php echo esc_url( get_permalink( $post->ID ) ); ?>" class="flex items-start gap-3 group">
                        <?php if ( $thumb ) : ?>
                            <img src="<?php echo esc_url( $thumb ); ?>" alt="" class="w-14 h-14 rounded-lg object-cover shrink-0" loading="lazy" />
                        <?php else : ?>
                            <div class="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <span class="material-symbols-outlined text-lg text-primary/50" aria-hidden="true">article</span>
                            </div>
                        <?php endif; ?>
                        <div class="flex-1 min-w-0">
                            <h4 class="text-sm font-bold text-primary group-hover:text-primary-soft transition-colors leading-tight mb-1"><?php echo esc_html( get_the_title( $post->ID ) ); ?></h4>
                            <time class="text-[0.65rem] text-secondary" datetime="<?php echo esc_attr( get_the_date( 'c', $post->ID ) ); ?>"><?php echo esc_html( get_the_date( '', $post->ID ) ); ?></time>
                        </div>
                    </a>
                </li>
            <?php endforeach; wp_reset_postdata(); ?>
        </ul>
    </aside>
    <?php
    return ob_get_clean();
}

/* Search box widget for sidebar */
function timeless_blog_search_widget() {
    ob_start(); ?>
    <form role="search" method="get" class="bg-surface-container-low rounded-2xl p-6" action="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="Search articles">
        <h3 class="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-base" aria-hidden="true">search</span>
            Search
        </h3>
        <div class="relative">
            <input type="search" name="s" placeholder="Search articles..." value="<?php echo esc_attr( get_search_query() ); ?>"
                   class="w-full bg-white border border-surface-container rounded-lg px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden" />
            <input type="hidden" name="post_type" value="article" />
            <button type="submit" class="absolute right-2 top-1/2 -translate-y-1/2 text-primary p-1 hover:opacity-70" aria-label="Submit search">
                <?php echo timeless_icon( 'arrow_forward', '', 'width:16px;height:16px' ); ?>
            </button>
        </div>
    </form>
    <?php
    return ob_get_clean();
}

/* End-of-article full-width CTA section. Renders BEFORE related articles
   on single article pages. Headline + value prop + dual CTA (quote + call). */
function timeless_blog_end_of_article_cta() {
    $contact  = esc_url( home_url( '/contact/' ) );
    $tel_disp = function_exists( 'timeless_phone' ) ? timeless_phone() : '0451 110 154';
    $tel_link = function_exists( 'timeless_phone_link' ) ? timeless_phone_link() : '+61451110154';
    ob_start(); ?>
    <section id="article-quote" class="py-16 sm:py-20 bg-primary text-white relative overflow-hidden">
        <!-- Decorative gradient overlay -->
        <div class="absolute inset-0 bg-linear-to-br from-primary via-primary to-[#0a2d52] opacity-90" aria-hidden="true"></div>
        <div class="relative max-w-4xl mx-auto px-6 sm:px-8 text-center">
            <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.7rem] font-bold tracking-widest uppercase rounded-sm mb-6">Get Your Free Quote</span>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter leading-tight mb-4">
                Save Time &amp; Money with Professional Resurfacing
            </h2>
            <p class="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto mb-8">
                Cracks, chips, or stains can lead to bigger problems, repairing them quickly keeps your bathroom looking its best.
                We offer fast, cost-effective resurfacing that restores surfaces without the cost or disruption of full replacements.
            </p>
            <p class="text-sm sm:text-base text-white/70 leading-relaxed max-w-xl mx-auto mb-10">
                Send 3-4 photos of your bathroom. We'll reply with a fixed-price quote within 1 business day. No call-out fee, no obligation.
            </p>
            <!-- The real quote form, same GHL-wired React embed as the homepage -->
            <div class="max-w-xl mx-auto text-left">
                <div class="bg-white rounded-2xl overflow-hidden shadow-2xl">
                    <div class="p-2 sm:p-4"><?php echo do_shortcode( '[timeless_quote_form]' ); ?></div>
                </div>
            </div>
            <p class="mt-6 text-sm text-white/70">
                Prefer to talk?
                <a href="tel:<?php echo esc_attr( $tel_link ); ?>" class="font-bold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white transition-colors">Call <?php echo esc_html( $tel_disp ); ?></a>
            </p>
        </div>
    </section>
    <?php
    return ob_get_clean();
}

/* Author / credentials (E-E-A-T) box. Rendered at the END of each single
   article, before the full-width CTA. Real, rule-compliant trust signals
   only, no "guarantee"/"written" wording; per-material warranty spans. */
function timeless_blog_author_box() {
    $abn = function_exists( 'timeless_abn' ) ? trim( timeless_abn() ) : '';
    // Last reviewed = modified date (falls back to published if never modified)
    $reviewed = get_the_modified_date() ? get_the_modified_date() : get_the_date();
    ob_start(); ?>
    <aside class="max-w-3xl mx-auto px-6 sm:px-8 pb-14" aria-label="About the author">
        <div class="bg-surface-container-low rounded-2xl p-6 sm:p-8 border border-surface-container">
            <div class="flex items-start gap-5">
                <!-- TODO: real headshot — swap this illustrated avatar for a photo of Allan once one exists -->
                <?php if ( file_exists( get_template_directory() . '/images/about/author-avatar.png' ) ) : ?>
                <img src="<?php echo esc_url( get_template_directory_uri() . '/images/about/author-avatar.png' ); ?>" alt="" class="shrink-0 w-14 h-14 rounded-full object-cover" style="border:2px solid #e7c08b;" aria-hidden="true" />
                <?php else : ?>
                <div class="shrink-0 w-14 h-14 rounded-full flex items-center justify-center" style="background:#041534;" aria-hidden="true">
                    <span style="color:#e7c08b;font-weight:800;font-size:1.35rem;">A</span>
                </div>
                <?php endif; ?>
                <div class="min-w-0">
                    <p class="text-[0.65rem] font-bold uppercase tracking-widest text-secondary mb-1">About the author</p>
                    <h2 class="text-lg font-extrabold text-primary tracking-tight mb-1">Allan P</h2>
                    <p class="text-xs font-semibold text-secondary mb-3">Quotation and Jobs Manager &middot; Bathroom Resurfacing Specialist, Timeless Resurfacing</p>
                    <p class="text-sm text-secondary leading-relaxed mb-3">
                        Every guide comes from jobs we have actually done in Sydney homes. We resurface baths, tiles,
                        basins and vanities and re-grout showers across Greater Sydney, quoting from photos within 24 hours.
                    </p>
                    <p class="text-xs text-secondary/80">
                        Fully insured ($10M public liability)<?php echo $abn ? ' · ABN ' . esc_html( $abn ) : ''; ?> · Last reviewed <?php echo esc_html( $reviewed ); ?>
                    </p>
                </div>
            </div>
        </div>
    </aside>
    <?php
    return ob_get_clean();
}

/* ─────────────────────────────────────────────
   1e. AUTO TABLE OF CONTENTS FOR ARTICLES
   ─────────────────────────────────────────────
   When an article has 3+ H2 headings, generate a sticky "On this page"
   sidebar with jump links. Only triggers for substantive articles ,
   short posts (<3 H2s) skip the TOC to avoid visual clutter.

   Implementation: filters the_content output, injects id attributes
   into H2 tags, and stores the TOC items in a global for the template
   to render. Smooth scroll behavior comes from existing CSS scroll-smooth
   class on <html>.
   ───────────────────────────────────────────── */
function timeless_inject_heading_anchors( $content ) {
    if ( ! is_singular( 'article' ) || ! in_the_loop() ) {
        return $content;
    }

    $GLOBALS['timeless_toc_items'] = array();

    $content = preg_replace_callback(
        '/<h2([^>]*)>(.+?)<\/h2>/i',
        function ( $m ) {
            $attrs = $m[1];
            $inner = $m[2];
            // Extract plain text for slug + display
            $text  = trim( wp_strip_all_tags( $inner ) );
            if ( empty( $text ) ) {
                return $m[0];
            }
            // Generate slug from heading text
            $slug = sanitize_title( $text );
            // Avoid duplicate IDs by appending counter if needed
            static $seen = array();
            $base_slug = $slug;
            $i         = 1;
            while ( in_array( $slug, $seen, true ) ) {
                $i++;
                $slug = $base_slug . '-' . $i;
            }
            $seen[] = $slug;

            // Skip if H2 already has id attribute
            if ( strpos( $attrs, 'id=' ) === false ) {
                $attrs .= ' id="' . esc_attr( $slug ) . '"';
            } else {
                // Extract existing id for TOC linking
                if ( preg_match( '/id="([^"]+)"/', $attrs, $idm ) ) {
                    $slug = $idm[1];
                }
            }

            $GLOBALS['timeless_toc_items'][] = array(
                'slug' => $slug,
                'text' => $text,
            );

            return '<h2' . $attrs . '>' . $inner . '</h2>';
        },
        $content
    );

    return $content;
}
add_filter( 'the_content', 'timeless_inject_heading_anchors', 5 );

/* ─────────────────────────────────────────────
   1d. STARTER BLOG CATEGORIES
   ─────────────────────────────────────────────
   Pre-create 5 categories so authors don't end up with "Uncategorized" mess.
   Idempotent: skips any category that already exists. Authors can rename,
   add, or delete via wp-admin → Posts → Categories at any time.
   ───────────────────────────────────────────── */
function timeless_create_blog_categories() {
    if ( get_option( 'timeless_blog_cats_created' ) ) {
        return;
    }

    $categories = array(
        array(
            'name'        => 'Bath Resurfacing Tips',
            'slug'        => 'bath-resurfacing-tips',
            'description' => 'Practical guides for bath resurfacing: how it works, what to expect, care tips, common questions.',
        ),
        array(
            'name'        => 'Tile & Grout Care',
            'slug'        => 'tile-grout-care',
            'description' => 'How to maintain tiles and grout between professional services. Cleaning, mould prevention, when to repair vs regrout.',
        ),
        array(
            'name'        => 'Before & After',
            'slug'        => 'before-after',
            'description' => 'Real Sydney bathroom transformations. Photos, costs, timelines, and customer stories.',
        ),
        array(
            'name'        => 'DIY vs Professional',
            'slug'        => 'diy-vs-professional',
            'description' => 'When DIY makes sense and when it costs more in the long run. Honest comparisons.',
        ),
        array(
            'name'        => 'Service Spotlights',
            'slug'        => 'service-spotlights',
            'description' => 'Deep dives into specific services: epoxy grout, vanity respray, shower regrouting and more.',
        ),
    );

    foreach ( $categories as $cat ) {
        if ( ! term_exists( $cat['slug'], 'category' ) ) {
            wp_insert_term( $cat['name'], 'category', array(
                'slug'        => $cat['slug'],
                'description' => $cat['description'],
            ) );
        }
    }

    update_option( 'timeless_blog_cats_created', '1' );
}
add_action( 'init', 'timeless_create_blog_categories', 100 );
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
        array( 'title' => 'Customer Terms of Service', 'slug' => 'terms', 'template' => 'page-templates/page-terms.php' ),
        // City homepages, currently /sydney/ duplicates / for nationwide expansion staging.
        // When Melbourne launches: / becomes Australia-neutral, /sydney/ keeps the Sydney
        // content (page-sydney.php diverges from front-page.php at that point).
        array( 'title' => 'Bathroom Resurfacing Sydney', 'slug' => 'sydney', 'template' => 'page-templates/page-sydney.php' ),
        // Service pages, universal slugs (no -sydney suffix) for nationwide expansion
        array( 'title' => 'Shower Regrouting',           'slug' => 'services/shower-regrouting',           'template' => 'page-templates/page-shower-regrouting.php' ),
        array( 'title' => 'Shower Resurfacing',          'slug' => 'services/shower-resurfacing',          'template' => 'page-templates/page-shower-resurfacing.php' ),
        array( 'title' => 'Bath Resurfacing',            'slug' => 'services/bath-resurfacing',            'template' => 'page-templates/page-bath-resurfacing.php' ),
        array( 'title' => 'Tile Resurfacing',            'slug' => 'services/tile-resurfacing',            'template' => 'page-templates/page-tile-resurfacing.php' ),
        array( 'title' => 'Vanity Refinishing',          'slug' => 'services/vanity-refinishing',          'template' => 'page-templates/page-vanity-refinishing.php' ),
        array( 'title' => 'Basin Restoration',           'slug' => 'services/basin-restoration',           'template' => 'page-templates/page-basin-restoration.php' ),
        array( 'title' => 'Shower Sealing',              'slug' => 'services/shower-leak-repair',          'template' => 'page-templates/page-shower-leak-repair.php' ),
        array( 'title' => 'Epoxy Grout Upgrade',         'slug' => 'services/epoxy-grout-upgrade',         'template' => 'page-templates/page-epoxy-grout-upgrade.php' ),
        array( 'title' => 'Floor Tile Regrouting',       'slug' => 'services/floor-tile-regrouting',       'template' => 'page-templates/page-floor-tile-regrouting.php' ),
        array( 'title' => 'Chip Repair',                 'slug' => 'services/chipped-bathtub-repair',      'template' => 'page-templates/page-chipped-bathtub-repair.php' ),
        array( 'title' => 'Full Bathroom Makeover',      'slug' => 'services/full-bathroom-makeover',      'template' => 'page-templates/page-full-bathroom-makeover.php' ),
        array( 'title' => 'Property Manager Services',   'slug' => 'services/property-manager-bathroom-services', 'template' => 'page-templates/page-property-manager-bathroom-services.php' ),
        array( 'title' => 'Stained Bathtub Resurfacing', 'slug' => 'services/stained-bathtub-resurfacing', 'template' => 'page-templates/page-stained-bathtub-resurfacing.php' ),
        array( 'title' => 'Peeling Bathtub Resurfacing', 'slug' => 'services/peeling-bathtub-resurfacing', 'template' => 'page-templates/page-peeling-bathtub-resurfacing.php' ),
        array( 'title' => 'Bathroom Tile Resurfacing',   'slug' => 'services/bathroom-tile-resurfacing',   'template' => 'page-templates/page-bathroom-tile-resurfacing.php' ),
        array( 'title' => 'Mouldy Shower Grout',         'slug' => 'services/mouldy-shower-grout',         'template' => 'page-templates/page-mouldy-shower-grout.php' ),
        array( 'title' => 'Cracked Grout Repair',        'slug' => 'services/cracked-grout-repair',        'template' => 'page-templates/page-cracked-grout-repair.php' ),
        array( 'title' => 'Mouldy Silicone Replacement', 'slug' => 'services/mouldy-silicone-replacement', 'template' => 'page-templates/page-mouldy-silicone-replacement.php' ),
        array( 'title' => 'Basin Chip Repair',           'slug' => 'services/basin-chip-repair',           'template' => 'page-templates/page-basin-chip-repair.php' ),
        array( 'title' => 'Vanity Respray',              'slug' => 'services/vanity-respray',              'template' => 'page-templates/page-vanity-respray.php' ),
        // Top-level non-services pages
        array( 'title' => 'Warranty',                     'slug' => 'warranty',                             'template' => 'page-templates/page-warranty.php' ),
        array( 'title' => 'Care Instructions',            'slug' => 'care-instructions',                    'template' => 'page-templates/page-care-instructions.php' ),
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
 * One-time backfill so new entries added to timeless_create_pages() take effect WITHOUT
 * needing a full theme switch. Fires once on init then sets a flag to prevent re-runs.
 *
 * Use case: when a new service page is added (e.g. shower-resurfacing 2026-05-04), the
 * `after_switch_theme` hook only fires on actual theme switches, not on file uploads /
 * theme replacements. This backfill catches up any missing pages on the next admin or
 * front-end visit. Safe because timeless_create_pages() is idempotent (skips existing).
 *
 * Bump the version flag (`timeless_pages_backfill_v4_done` → `_v4_done` etc) whenever
 * new pages are added to the auto-create list to re-trigger the backfill once more.
 */
function timeless_pages_backfill_v4() {
    if ( get_option( 'timeless_pages_backfill_v4_done' ) ) return;
    timeless_create_pages();
    // Mark all prior versions done too, so the upgrade is idempotent
    update_option( 'timeless_pages_backfill_v3_done', '1' );
    update_option( 'timeless_pages_backfill_v4_done', '1' );
}
add_action( 'init', 'timeless_pages_backfill_v4' );

/**
 * One-time URL migration: drop "-sydney" suffix from service page slugs.
 *
 * Why: Service pages were originally `/services/bath-resurfacing-sydney/`
 * which baked geography into URLs that should be national. New scheme:
 * `/services/bath-resurfacing/`, same page, universal URL, scales to
 * Melbourne/Brisbane without fragmenting authority.
 *
 * Idempotent via `timeless_url_migration_v2_done` option flag, runs once
 * and never again. Updates BOTH post_name (URL slug) AND _wp_page_template
 * meta (so renamed template files are found).
 *
 * Suburb pages auto-migrate as side effect: WordPress builds child URLs
 * from parent slug, so `/services/bath-resurfacing-sydney/parramatta/`
 * automatically becomes `/services/bath-resurfacing/parramatta/`.
 */
function timeless_migrate_service_slugs_v2() {
    if ( get_option( 'timeless_url_migration_v2_done' ) ) {
        return;
    }

    $migrations = array(
        'shower-regrouting-sydney'                  => 'shower-regrouting',
        'bath-resurfacing-sydney'                   => 'bath-resurfacing',
        'tile-resurfacing-sydney'                   => 'tile-resurfacing',
        'vanity-refinishing-sydney'                 => 'vanity-refinishing',
        'basin-restoration-sydney'                  => 'basin-restoration',
        'shower-leak-repair-sydney'                 => 'shower-leak-repair',
        'epoxy-grout-upgrade-sydney'                => 'epoxy-grout-upgrade',
        'floor-tile-regrouting-sydney'              => 'floor-tile-regrouting',
        'chipped-bathtub-repair-sydney'             => 'chipped-bathtub-repair',
        'full-bathroom-makeover-sydney'             => 'full-bathroom-makeover',
        'property-manager-bathroom-services-sydney' => 'property-manager-bathroom-services',
        'stained-bathtub-resurfacing-sydney'        => 'stained-bathtub-resurfacing',
        'peeling-bathtub-resurfacing-sydney'        => 'peeling-bathtub-resurfacing',
        'bathroom-tile-resurfacing-sydney'          => 'bathroom-tile-resurfacing',
        'mouldy-shower-grout-sydney'                => 'mouldy-shower-grout',
        'cracked-grout-repair-sydney'               => 'cracked-grout-repair',
        'mouldy-silicone-replacement-sydney'        => 'mouldy-silicone-replacement',
        'basin-chip-repair-sydney'                  => 'basin-chip-repair',
        'vanity-respray-sydney'                     => 'vanity-respray',
    );

    foreach ( $migrations as $old_slug => $new_slug ) {
        $page = get_page_by_path( 'services/' . $old_slug );
        if ( ! $page ) {
            continue;  // Page doesn't exist yet (fresh install), let create_pages handle it
        }

        wp_update_post( array(
            'ID'        => $page->ID,
            'post_name' => $new_slug,
        ) );

        // Update template meta to point to renamed file
        update_post_meta(
            $page->ID,
            '_wp_page_template',
            'page-templates/page-' . $new_slug . '.php'
        );
    }

    update_option( 'timeless_url_migration_v2_done', '1' );
    flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'timeless_migrate_service_slugs_v2', 5 );  // Before create_pages (priority 10)
add_action( 'admin_init', 'timeless_migrate_service_slugs_v2' );
// FRONTEND TRIGGER: also fire on init for frontend requests so visitors
// don't get caught in a redirect loop if the admin hasn't logged in yet
// after deploy. Function early-exits via option flag once complete, so
// the cost is one cached get_option() call on every subsequent request.
add_action( 'init', 'timeless_migrate_service_slugs_v2', 99 );

/**
 * 301 redirect old "-sydney" URLs to new universal URLs.
 *
 * Single regex covers all 19 service URLs + all suburb children:
 *   /services/bath-resurfacing-sydney/           → /services/bath-resurfacing/
 *   /services/bath-resurfacing-sydney/parramatta/ → /services/bath-resurfacing/parramatta/
 *
 * Runs at template_redirect priority 1, BEFORE WordPress tries to render
 * a 404 for the old URL.
 */
function timeless_legacy_url_redirect() {
    if ( wp_doing_ajax() || wp_doing_cron() || is_admin() ) {
        return;
    }

    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if ( preg_match( '#^/services/([a-z0-9-]+)-sydney(/.*)?$#', $uri, $m ) ) {
        $new_path = '/services/' . $m[1] . ( $m[2] ?? '/' );

        // SAFETY: only redirect to the new URL if a page actually exists there.
        // This prevents an infinite loop when:
        //   - Old URL is requested
        //   - DB migration hasn't run yet (slugs still have -sydney suffix)
        //   - Without this check, we'd redirect to a URL that doesn't exist,
        //     WP's canonical_redirect would send back to old URL, our redirect
        //     would fire again, loop forever.
        // With this check, we just let the request fall through to WordPress
        // until migration runs.
        $check_path = trim( strtok( $new_path, '?' ), '/' );  // strip query + leading/trailing slashes
        $new_page   = get_page_by_path( $check_path );

        if ( $new_page ) {
            wp_redirect( home_url( $new_path ), 301 );
            exit;
        }
        // No page at new URL yet → skip redirect, let WP render the old URL normally
        // until timeless_migrate_service_slugs_v2 runs on next admin_init
    }
}
add_action( 'template_redirect', 'timeless_legacy_url_redirect', 1 );


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

    // Cheap pre-checks BEFORE the transient gate, these run on every admin
    // page load but exit in <1ms when pages exist (single cached get_page_by_path).
    // This pattern catches "new pages added in theme update" without waiting
    // for the 1-hour transient to expire.
    $needs_create_pages = ! get_page_by_path( 'sydney' );

    /* Suburb sentinel. This used to check Parramatta only, which meant that once the
       first batch existed, suburbs added in a later theme update were NEVER created —
       the check passed and the generator never ran. It now sentinels on the LAST suburb
       in the data file, so adding entries to inc/suburb-data.php is enough to make the
       new pages materialise on the next wp-admin load. (v1.5.2) */
    $needs_suburb_pages = false;
    $suburb_file = get_template_directory() . '/inc/suburb-data.php';
    if ( file_exists( $suburb_file ) ) {
        $all_suburbs = include $suburb_file;
        if ( is_array( $all_suburbs ) && $all_suburbs ) {
            $last_slug = array_key_last( $all_suburbs );
            $needs_suburb_pages = ! get_page_by_path( 'services/bath-resurfacing/' . $last_slug );
        }
    }

    // Rate limit the EXPENSIVE check (full FAQs + create_pages) to once per hour
    if ( ! get_transient( 'timeless_pages_checked' ) ) {
        set_transient( 'timeless_pages_checked', 1, HOUR_IN_SECONDS );

        // Quick check: does the FAQs page exist? If yes, assume baseline pages OK.
        // If no, run the full creation routine (which skips existing pages anyway).
        if ( ! get_page_by_path( 'faqs' ) ) {
            timeless_create_pages();
        }
    }

    // Run create_pages if /sydney/ is missing (bypasses transient, it's a cheap
    // recheck and we WANT new pages to materialize quickly post-deploy)
    if ( $needs_create_pages ) {
        timeless_create_pages();
    }

    // Same self-heal pattern for suburb landing pages, bypasses transient too
    if ( $needs_suburb_pages ) {
        timeless_create_suburb_pages();
    }

    // Self-heal permalinks ONLY if WordPress is using completely default (empty).
    // Never overrides custom permalink structures (e.g. live site, plugin-managed).
    if ( get_option( 'permalink_structure' ) === '' ) {
        update_option( 'permalink_structure', '/%postname%/' );
        flush_rewrite_rules();
    }
}

/**
 * Programmatic suburb landing pages, auto-create on theme activation.
 *
 * Iterates inc/service-data.php × inc/suburb-data.php and creates a page
 * for each combo at /services/{service-slug}/{suburb-slug}/.
 *
 * Idempotent: skips any (service × suburb) page that already exists.
 *
 * Priority 20 (runs AFTER timeless_create_pages at default 10) so the
 * parent service pages exist before we try to attach suburb pages to them.
 */
function timeless_create_suburb_pages() {
    $suburb_file  = get_template_directory() . '/inc/suburb-data.php';
    $service_file = get_template_directory() . '/inc/service-data.php';
    if ( ! file_exists( $suburb_file ) || ! file_exists( $service_file ) ) {
        return;
    }

    $suburbs  = include $suburb_file;
    $services = include $service_file;

    foreach ( $services as $service_slug => $service ) {
        $parent = get_page_by_path( 'services/' . $service_slug );
        if ( ! $parent ) {
            continue;  // Parent service page doesn't exist yet, skip
        }

        foreach ( $suburbs as $suburb_slug => $suburb ) {
            // Idempotent check
            $existing = get_page_by_path( 'services/' . $service_slug . '/' . $suburb_slug );
            if ( $existing ) {
                continue;
            }

            wp_insert_post( array(
                'post_title'  => $service['name'] . ' in ' . $suburb['name'],
                'post_name'   => $suburb_slug,
                'post_status' => 'publish',
                'post_type'   => 'page',
                'post_parent' => $parent->ID,
                'meta_input'  => array(
                    '_wp_page_template' => 'page-templates/page-suburb-service.php',
                ),
            ) );
        }
    }
}
add_action( 'after_switch_theme', 'timeless_create_suburb_pages', 20 );

/**
 * Aggressive permalink self-heal, runs on every `init` until permalinks are set.
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
     * COMPILED Tailwind CSS v4.2.4, replaces the previous CDN runtime.
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
     * Inter, Self-hosted variable font subset (~99 KB, all weights via wght axis).
     *
     * Replaces Google Fonts CDN. Eliminates two third-party DNS+TLS lookups
     * (fonts.googleapis.com + fonts.gstatic.com) and 6+ separate weight requests
     * (~200-300 KB over the wire) with one local request to the same origin.
     *
     * The font is the official Inter Variable from rsms/inter v4, subset to
     * Latin (Basic Latin + Latin-1 + essential punctuation/currency). wght axis
     * preserved continuous 100..900, opsz axis preserved 14..32 for optical
     * sizing. No italic variant, theme has zero italic usage.
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
                   Browser auto-detects variations from the woff2, no `format('woff2-variations')`
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
     * Material Symbols, Self-hosted subset (96 icons, ~10 KB).
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
     * Source markup stays the same (icon names), easy to maintain. Browser receives
     * codepoints, works with the tiny font.
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
            /* swap (not block) per Lighthouse, minor codepoint flash on first uncached
               load is acceptable trade for FCP improvement. Font is preloaded + tiny
               (~10KB subset) + Cloudflare-cached, so flash window is <100ms in practice. */
            font-display: swap;
            src: url(" . esc_url( $ms_font_url ) . "?v=$ms_font_ver) format('woff2');
        }
        /* CRITICAL: bind the class to the @font-face. Without this, .material-symbols-outlined
           inherits the body font (Inter), which has no glyphs at the icon codepoints, so the
           browser falls back to system fonts and renders garbage at U+F0BE etc.
           (Google Fonts CDN CSS used to do this for us, when we self-hosted we dropped it.)

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
    // If MS font is missing, no @font-face is emitted, icons will render as
    // their literal codepoint chars in fallback fonts (notdef boxes), making
    // the missing-deploy state visually obvious instead of silently broken.

    // Theme stylesheet (animations, mobile menu, FAQ accordion)
    // Cache-bust via filemtime so changes propagate without manual version bumps
    $style_path = get_stylesheet_directory() . '/style.css';
    $style_ver  = file_exists( $style_path ) ? filemtime( $style_path ) : '1.0.0';
    wp_enqueue_style( 'timeless-style', get_stylesheet_uri(), array(), $style_ver );

    // Theme JavaScript (mobile menu, FAQ toggle, scroll reveal, slider handle init)
    // Cache-bust via filemtime, REQUIRED so JS updates reach browsers on theme upload
    $main_js_path = get_template_directory() . '/js/main.js';
    $main_js_ver  = file_exists( $main_js_path ) ? filemtime( $main_js_path ) : '1.0.0';
    wp_enqueue_script( 'timeless-main', get_template_directory_uri() . '/js/main.js', array(), $main_js_ver, true );
}
add_action( 'wp_enqueue_scripts', 'timeless_scripts' );

/**
 * Material Symbols ligature → codepoint replacement (output buffer filter).
 *
 * Why: We use a ~10 KB icon font subset that contains ONLY the 96 icons we use,
 * stored at their Unicode codepoints (no GSUB ligature lookup table, dropping that
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
 * span is preserved (will render as text, visible bug, easy to spot).
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
    // (the standard `\b` word-boundary doesn't help, `-` is non-word and matches `\b`,
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
            return $matches[0]; // Icon name not in map, leave unchanged for visibility
        },
        $html
    );
}

/**
 * WebP picture-tag rewrite (output buffer filter).
 *
 * Why: images/** /*.webp companions exist alongside many JPG/PNG files
 * (generated by scripts/convert-images-to-webp.py, only when WebP beats the
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
 *     wraps the WHOLE thing in <picture>, re-running the regex on already-
 *     wrapped output won't re-match (because the inner img is now inside
 *     <picture>...</picture> which makes the surrounding context different).
 *   - Cache-busted URLs (`?v=1`) currently fall through unwrapped, the regex
 *     requires the extension to immediately precede the closing quote. If the
 *     theme ever adds query strings to image URLs, extend the regex.
 *
 * Limitation: only handles theme-bundled images (`get_template_directory_uri()`).
 * Future WP Media Library uploads (`/wp-content/uploads/`) won't get WebP
 * delivery via this filter, would need a separate pipeline that runs on
 * `add_attachment` to generate companions, plus path-resolution extension here.
 */
function timeless_webp_picture_filter( $html ) {
    static $template_dir = null, $template_url = null;
    if ( null === $template_dir ) {
        $template_dir = get_template_directory();
        $template_url = get_template_directory_uri();
    }

    // Widths generated by scripts/generate-responsive-images.py, kept in sync.
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

            // Branch 2: No responsive variants, fall back to single-source webp wrap (existing behavior)
            $webp_url = $src . '.webp';
            return '<picture><source srcset="' . esc_url( $webp_url ) . '" type="image/webp">' . $img_tag . '</picture>';
        },
        $html
    );
}

/** Combined output filter, runs all theme HTML transformations on flush. */
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
   3. CUSTOMIZER, Editable Business Settings
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

    // NSW Licence Number, leave empty until you hold a contractor licence.
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

    $wp_customize->add_setting( 'timeless_gbp_url', array(
        'default'           => '',
        'sanitize_callback' => 'esc_url_raw',
    ) );
    $wp_customize->add_control( 'timeless_gbp_url', array(
        'label'       => __( 'Google Business Profile URL', 'timeless' ),
        'section'     => 'timeless_google_reviews',
        'type'        => 'url',
        'description' => __( 'Public link to the Google Business Profile (in the profile: Share, or the maps/review link, e.g. <code>https://maps.app.goo.gl/...</code> or <code>https://g.page/...</code>).<br><br>This is what states, in the LocalBusiness schema, that this website and that listing are the same business. Without it Google and AI assistants have to infer it. Leave blank and nothing is emitted.', 'timeless' ),
    ) );

    $wp_customize->add_setting( 'timeless_google_api_key', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
        'capability'        => 'manage_options', // Sensitive, admin only
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
        'description' => __( 'Accepts Place ID, business name, or Maps URL. Service-area businesses are often NOT yet indexed in the Places API, leave this blank and use the static reviews textarea below instead. We fall back to that when the API returns no results.', 'timeless' ),
    ) );

    // Public-facing GBP link, used for the "See all reviews on Google" CTA.
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

    // Static curated reviews, most reliable path for service-area trades businesses.
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

    // GHL chat widget (SMS-chat mode). Ships DARK: nothing renders until the widget ID is pasted
    // here (activation runbook: docs/specs/ai-employees/social-agents-activation-runbook-2026-07-07.md).
    $wp_customize->add_setting( 'timeless_chat_widget_id', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
        'capability'        => 'manage_options',
    ) );
    $wp_customize->add_control( 'timeless_chat_widget_id', array(
        'label'       => __( 'GHL Chat Widget ID', 'timeless' ),
        'section'     => 'timeless_analytics',
        'type'        => 'text',
        'description' => __( 'From GHL &rarr; Sites &rarr; Chat Widget. Leave blank to disable the website chat bubble.', 'timeless' ),
    ) );
}
add_action( 'customize_register', 'timeless_customizer' );

/* ─────────────────────────────────────────────
   3b. GOOGLE REVIEWS, Self-hosted Places API integration
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
     - Render directly in PHP, no JS, no CLS, no async injection.
     - Graceful fallback: if API fails or keys not set, render a "See reviews
       on Google" link to the GBP listing instead of an empty section.
   ───────────────────────────────────────────── */

/**
 * Resolve a user-pasted business identifier to a real Google Place ID.
 *
 * Accepts:
 *   - Place ID directly (`ChIJ...`)       , passes through unchanged
 *   - Maps URL (`https://...maps/place/...`), extracts business name segment
 *   - Plain business name text            , used as-is
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

    // Cache the resolved Place ID for 30 days, businesses don't change Place IDs
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
    // is valid. The new Places API has those records, and is what Google is pushing
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
        // returns false for "not set", same as our cached failure → no backoff.
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

                // Precise days-based relative label, overrides Google's vague defaults.
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
        /* 4 and 5 stars only. Allan's call 2026-08-20. The AGGREGATE below is NOT
           filtered -- it stays Google's true rating and count, because cherry-picking the
           headline number would be a misrepresentation. Only which individual reviews we
           choose to display is filtered, which is ordinary editorial selection. */
        'reviews'      => array_slice(
            array_values( array_filter( $reviews_normalized, function ( $r ) {
                return (int) ( $r['rating'] ?? 0 ) >= 4;
            } ) ), 0, 6 ),
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
/**
 * Ties the website entity to the Google Business Profile via sameAs + hasMap.
 *
 * The LocalBusiness schema already carries name, address, geo, phone and rating, but
 * nothing in it said that this site and that Business Profile are the SAME entity.
 * Entity consolidation is what gets a local business quoted in AI answers, and the SEO
 * strategy's GEO section (research/seo-strategy-2026-07-08.md B9.2) ranks identical
 * data across site schema, GBP, Bing and citations second only to llms.txt.
 *
 * Emitted as a fragment immediately after the @type line, which is a valid position in
 * all 26 hardcoded business-schema blocks. Returns '' when nothing is configured: an
 * empty sameAs is worse than no sameAs.
 */
function timeless_gbp_jsonld( $with_map = true ) {
    $urls = array();

    $gbp = trim( (string) get_theme_mod( 'timeless_gbp_url', '' ) );
    if ( $gbp && filter_var( $gbp, FILTER_VALIDATE_URL ) ) {
        $urls[] = $gbp;
    }

    foreach ( array( 'timeless_facebook_url', 'timeless_instagram_url' ) as $mod ) {
        $u = trim( (string) get_theme_mod( $mod, '' ) );
        if ( $u && filter_var( $u, FILTER_VALIDATE_URL ) ) {
            $urls[] = $u;
        }
    }

    if ( ! $urls ) {
        return '';
    }

    $quoted = array();
    foreach ( $urls as $u ) {
        $quoted[] = '"' . esc_url( $u ) . '"';
    }

    $out = ' "sameAs": [' . implode( ', ', $quoted ) . ']';

    // hasMap belongs on a Place or LocalBusiness. Callers embedding this inside a plain
    // Organization (the BlogPosting publisher) pass false and get sameAs only.
    if ( $gbp && $with_map ) {
        $out .= ', "hasMap": "' . esc_url( $gbp ) . '"';
    }

    return $out . ',';
}

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

    // Same 4-and-5-star rule as the live API path, so both sources behave identically.
    $reviews = array_values( array_filter( $reviews, function ( $r ) {
        return (int) ( $r['rating'] ?? 0 ) >= 4;
    } ) );
    return array_slice( $reviews, 0, 6 );  // Show up to 6
}

/** Render the Google Reviews widget. Tries Places API first, falls back to static
 *  curated reviews from Customizer, then to a "see reviews on Google" link. */
function timeless_render_google_reviews() {
    $data = timeless_get_google_reviews();

    // FALLBACK 1: Places API didn't return reviews (no key, business not yet indexed,
    // API failure, etc.), try static curated reviews from Customizer textarea.
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

    // FALLBACK 2: No Places API data AND no static reviews, show "see reviews on Google" link.
    // Note: $data may be `false` (not an array), so we can't subscript it directly ,
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

    <!-- Review modal (full text popup, JS-injected per-click), single instance for all cards on this section -->
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
 *  refetch lazily, we deliberately don't refetch synchronously here because
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

/**
 * True when a page would render an empty body: no post_content, no page template
 * assigned, and not picked up by the hub router above.
 *
 * Found live 2026-08-22: /services/ and /services/shower-resurfacing/ were both in
 * sitemap.xml at 200, rendering a 1-word and a 2-word <main>. Empty indexed URLs are
 * a quality signal against the whole domain, and /services/shower-resurfacing/ was
 * advertised at priority 0.8 — the same weight as a finished money page.
 *
 * Deliberately keyed on emptiness rather than a hard-coded slug list, because a
 * hard-coded list silently rots the next time someone adds a page in wp-admin and
 * does not write it. The 19 service pages have empty post_content too, but they DO
 * carry a page template, so they never match.
 */
function timeless_page_renders_empty( $post_id = 0 ) {
    $post_id = $post_id ? (int) $post_id : (int) get_queried_object_id();
    $post    = get_post( $post_id );

    if ( ! $post || 'page' !== $post->post_type ) {
        return false;
    }
    if ( '' !== trim( wp_strip_all_tags( (string) $post->post_content ) ) ) {
        return false;
    }
    if ( '' !== (string) get_page_template_slug( $post_id ) ) {
        return false;
    }

    $routed = timeless_hub_routed_slugs();
    return ! in_array( $post->post_name, $routed, true );
}

/* ─────────────────────────────────────────────
   4b. TEMPLATE ROUTING FOR HUB PAGES
   ─────────────────────────────────────────────
   /services/ is the breadcrumb parent of all 19 service pages (each one names it
   as position 2 in its BreadcrumbList JSON-LD), but the WordPress page behind it
   had no template assigned, so it rendered an empty <main> and sat in the sitemap
   as a one-word indexed page (verified live 2026-08-22).

   Assigning the template through wp-admin would fix it too, but Customizer and
   page-meta settings are stored per theme folder and have been lost to suffixed
   theme copies before (CLAUDE.md deploy note), so routing it in code means the
   hub cannot silently revert to blank on the next upload. An explicitly assigned
   template still wins — this only fills in when none is set.
   ───────────────────────────────────────────── */
/** slug => template file, for pages served by a template without an editor assignment. */
function timeless_hub_routes() {
    return array(
        'services' => 'page-templates/page-services.php',
    );
}

/** Just the slugs, for the empty-page test. */
function timeless_hub_routed_slugs() {
    return array_keys( timeless_hub_routes() );
}

function timeless_hub_template_routing( $template ) {
    if ( ! is_page() ) {
        return $template;
    }

    $assigned = get_page_template_slug( get_queried_object_id() );
    if ( ! empty( $assigned ) ) {
        return $template; // Editor's choice always wins.
    }

    $routes = timeless_hub_routes();
    $slug   = get_post_field( 'post_name', get_queried_object_id() );
    if ( isset( $routes[ $slug ] ) ) {
        $candidate = locate_template( $routes[ $slug ] );
        if ( $candidate ) {
            return $candidate;
        }
    }

    return $template;
}
add_filter( 'template_include', 'timeless_hub_template_routing' );

/* ─────────────────────────────────────────────
   5. SEO, Remove WordPress clutter + hide server fingerprinting
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

/* Self-referencing canonical URL, fixes "Duplicate without user-selected canonical" */
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

/* Remove WordPress default robots meta, our timeless_seo_meta() outputs a more complete one */
remove_filter( 'wp_robots', 'wp_robots_max_image_preview_large' );

/* ─────────────────────────────────────────────
   5b. SEO, Meta descriptions + Open Graph tags
   ───────────────────────────────────────────── */
/**
 * Curated <title> per post, keyed by slug.
 *
 * WordPress builds the title tag from the post's H1 plus the site name, which for a
 * blog article runs long: "The Property Manager's Guide to Bathroom Resurfacing
 * Between Tenants | Timeless Resurfacing" is 91 characters and Google cuts it around
 * 60, so the brand and half the promise disappear. Each article already had a shorter,
 * search-shaped title written in its source file, but nothing carried it onto the page.
 *
 * These are complete titles: the site name is deliberately NOT appended, because every
 * one of them is already at or near the 60-character budget and the suffix is what got
 * truncated anyway. Same slug-keyed shape as $desc_map below it.
 */
function timeless_seo_title_map() {
    return array(
        'bathroom-resurfacing-rental-property'         => 'Bathroom Resurfacing for Rental Properties | Sydney PM Guide',
        'cracked-bath-basin-repair'                    => 'Cracked Bathtub or Basin Repair: How It Actually Works',
        'can-you-paint-bathroom-tiles'                 => 'Can You Paint Bathroom Tiles? What Happens After a Year',
        'bathtub-chip-repair'                          => 'Bathtub Chip Repair Sydney: Fix a Chip Without Resurfacing',
        'how-long-does-bath-resurfacing-last'          => 'How Long Does Bath Resurfacing Last? Sydney Guide',
        'leaking-shower-repair-without-removing-tiles' => 'Leaking Shower Repair Without Removing Tiles | Sydney',
        'mouldy-shower-grout-fix'                      => 'Mouldy Shower Grout: Clean, Regrout or Reseal? Sydney Guide',
        'regrout-or-retile-shower'                     => 'Regrout or Retile Shower? How to Tell What You Need',
        'resurface-or-replace-bathtub'                 => 'Resurface or Replace Bathtub? Honest Sydney Guide',
        'why-is-my-bathtub-peeling'                    => 'Why Is My Bathtub Peeling? Causes and the Right Fix',

        /* Hub pages */
        'services'                                     => 'Bathroom Resurfacing Services Sydney | Baths, Tiles, Regrouting',
    );
}

/** The curated title for whatever is being viewed, or '' when there isn't one. */
function timeless_seo_title() {
    if ( ! is_singular() ) {
        return '';
    }
    $map  = timeless_seo_title_map();
    $slug = get_post_field( 'post_name', get_post() );
    return isset( $map[ $slug ] ) ? $map[ $slug ] : '';
}

/**
 * Apply it to the real <title>. add_theme_support('title-tag') owns that element, so
 * og:title alone would leave the two disagreeing, and it is the <title> that Google
 * shows. Site name and tagline are dropped when a curated title is used: it is already
 * a whole title, and appending the suffix is what pushed these past the cut-off.
 */
function timeless_seo_document_title( $parts ) {
    $curated = timeless_seo_title();
    if ( $curated ) {
        $parts['title'] = $curated;
        unset( $parts['site'], $parts['tagline'] );
    }
    return $parts;
}
add_filter( 'document_title_parts', 'timeless_seo_document_title' );

function timeless_seo_meta() {
    $site = 'Timeless Resurfacing';
    $tpl  = get_template_directory_uri();
    $img  = $tpl . '/images/homepage/after.jpg';

    /* Per-page meta descriptions, unique for each service page */
    $desc_map = array(
        'shower-regrouting'              => 'Professional shower regrouting in Sydney. Full grout removal and waterproof epoxy replacement. Same-day service, free quotes.',
        'bath-resurfacing'               => 'Bath resurfacing Sydney. Restore chipped or stained bathtubs to factory-new condition. One-day service, 80-90% cheaper than replacement.',
        'tile-resurfacing'               => 'Tile resurfacing Sydney. Transform outdated bathroom tiles with durable high-gloss finish. No demolition, one-day turnaround.',
        'vanity-refinishing'             => 'Vanity refinishing Sydney. Benchtop resurfacing and cabinet respray with 900+ colour options. Same-day service.',
        'basin-restoration'              => 'Basin restoration Sydney. Expert chip repair and full resurface for porcelain, acrylic, and cast iron basins.',
        'shower-leak-repair'             => 'Shower sealing and leak repair Sydney. Silicone replacement and waterproof epoxy regrouting to stop leaks permanently.',
        'epoxy-grout-upgrade'            => 'Epoxy grout upgrade Sydney. Waterproof, mould-resistant grout for showers, bathrooms, and wet areas.',
        'floor-tile-regrouting'          => 'Floor tile regrouting Sydney. Bathroom and laundry floor grout removal and replacement. Anti-slip finish available.',
        'chipped-bathtub-repair'         => 'Chipped bathtub repair Sydney. Professional chip repair for baths and basins. Same-day fix, invisible results.',
        'full-bathroom-makeover'         => 'Full bathroom makeover Sydney. Complete resurface package. Bath, tiles, basin, and grout. 1-2 days, fraction of renovation cost.',
        'property-manager-bathroom-services' => 'Property manager bathroom services Sydney. Multi-unit turnarounds, rental refreshes, and strata work. Volume pricing available.',
        'stained-bathtub-resurfacing'    => 'Stained bathtub resurfacing Sydney. Remove yellow, brown, and rust stains permanently with professional recoating.',
        'peeling-bathtub-resurfacing'    => 'Peeling bathtub resurfacing Sydney. Fix failed DIY kits and peeling coatings with professional two-part acrylic system.',
        'bathroom-tile-resurfacing'      => 'Bathroom tile resurfacing Sydney. Fresh high-gloss white finish over your existing tiles. No demolition, 1-2 day service.',
        'shower-resurfacing'             => 'Shower tile resurfacing Sydney. Modernise dated shower tile colour without demolition. Walls only or walls + floor. Fixed-price quote from photos.',
        'mouldy-shower-grout'            => 'Mouldy shower grout removal Sydney. Strip black mould grout and replace with waterproof epoxy. Stops mould permanently.',
        'cracked-grout-repair'           => 'Cracked grout repair Sydney. Fix crumbling, cracked shower and bathroom grout before water damage occurs.',
        'mouldy-silicone-replacement'    => 'Mouldy silicone replacement Sydney. Remove old black silicone and reseal with premium anti-mould silicone.',
        'basin-chip-repair'              => 'Basin chip repair Sydney. Invisible repairs for chipped porcelain and ceramic basins. Same-day service.',
        'vanity-respray'                 => 'Vanity respray Sydney. Cabinet door and drawer front respray with 2-pack polyurethane. 900+ colours.',
        'about'    => 'About Timeless Resurfacing. Sydney\'s bathroom resurfacing specialists. Fully insured, experienced team, warranties up to 5 years.',
        'contact'  => 'Contact Timeless Resurfacing for a free bathroom resurfacing quote in Sydney. Send photos, get a fixed-price quote within 1 business day.',
        'gallery'  => 'Before and after bathroom resurfacing photos across Sydney. Real transformations by Timeless Resurfacing.',
        'areas'    => 'Bathroom resurfacing service areas across Greater Sydney, Wollongong, Central Coast, and Blue Mountains.',
        'faqs'     => 'Frequently asked questions about bathroom resurfacing in Sydney. Cost, timing, durability, warranty, and process explained.',
        'privacy'  => 'Privacy policy for Timeless Resurfacing. How we collect, use, and protect your personal information.',
        'warranty' => 'Timeless Resurfacing warranty terms by service. Bath resurfacing 5 years, epoxy regrouting 5 years, cement regrouting 2 years. ACL-compliant.',
        'services' => 'Every bathroom resurfacing, regrouting and repair service we offer across Sydney, and how to tell which one your bathroom actually needs.',
        'care-instructions' => 'How to care for your resurfaced bathroom. Cure times, cleaning products to use and avoid, Sydney climate-specific advice, lifespan expectations.',
        // Blog articles (CPT 'article' at /blog/{slug}/). is_singular() + post_name matching below
        // covers articles too, so plain slug keys work. Source: docs/content/blog/*.html headers.
        'resurface-or-replace-bathtub'                 => 'Resurface or replace your bathtub? An honest guide from a Sydney resurfacing business. Free quote within 24 hours. Call 0451 110 154.',
        'how-long-does-bath-resurfacing-last'          => 'How long does bath resurfacing last, and why do some baths peel in a year? Honest answers from Sydney resurfacers. Free 24-hour quote: 0451 110 154.',
        'regrout-or-retile-shower'                     => 'Regrout or retile your shower? A 3-minute self-check from Sydney regrouting specialists. Free quote within 24 hours. Call 0451 110 154.',
        'why-is-my-bathtub-peeling'                    => 'Why is my bathtub peeling? A failing coating is the usual cause. Here is the proper fix, from Sydney resurfacers. Free 24-hour quote: 0451 110 154.',
        'bathtub-chip-repair'                          => 'Most chipped baths can be spot repaired in a couple of hours. How we fix chips, match colour honestly, and when a full resurface is the smarter job.',
        'mouldy-shower-grout-fix'                      => 'Surface mould cleans off. Mould that returns in weeks lives inside the grout or silicone and needs replacing. An honest fix guide from Sydney regrouters.',
        'bathroom-resurfacing-rental-property'         => 'Tired rental bathroom? Resurfacing turns it around in days, not the weeks a renovation takes. A property manager\'s guide to scoping it by photo.',
        'cracked-bath-basin-repair'                    => 'A crack in an acrylic bath is a flexing base, not a surface fault. How the repair actually works, why DIY kits fail, and when a crack cannot be fixed.',
        'can-you-paint-bathroom-tiles'                 => 'Tile paint looks good for a season. In a wet area it lifts in sheets, and stripping it costs more than the original job. What works instead.',
        'leaking-shower-repair-without-removing-tiles' => 'Most shower leaks start at grout and silicone, not the membrane, and can be fixed without lifting a tile. How to tell the difference before a rip-out.',
    );

    if ( is_front_page() ) {
        $title = 'Bathroom Resurfacing Sydney | ' . $site;
        $desc  = 'Sydney\'s specialist bathroom resurfacing and shower regrouting service. One-day transformations, 80–90% cheaper than renovation. Free quotes.';
    } elseif ( is_singular() ) {
        $curated = timeless_seo_title();
        $title   = $curated ? $curated : get_the_title() . ' | ' . $site;
        $slug  = get_post_field( 'post_name', get_post() );
        $desc  = isset( $desc_map[ $slug ] ) ? $desc_map[ $slug ] : get_the_title() . ', professional bathroom resurfacing in Sydney. Free quotes. ' . $site;
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

    /* Blog articles (CPT 'article') get richer Open Graph: og:type=article,
       the post's own featured image when set (else the shared fallback), and
       article:* metadata. $img_is_fallback tracks whether the 1200x630 size
       hints are still accurate (they aren't for an arbitrary featured image). */
    $og_type        = 'website';
    $img_is_fallback = true;
    $img_w           = null;   // real dimensions, filled in below when a featured image exists
    $img_h           = null;
    $article_meta   = '';
    if ( is_singular( 'article' ) ) {
        $og_type = 'article';
        $pid = get_queried_object_id();

        /*
         * FULL size, not 'large'. twitter:card below is summary_large_image and
         * og wants at least 1200x630; WordPress's 'large' is 1024x576, so every
         * article was declaring a big-card format while supplying an image too
         * small to fill it, and the networks fall back to a small thumbnail.
         * Blog images ship at 1672x941 (docs/content/blog/IMAGE-PACK.md), which
         * clears the minimum. 'large' stays as the fallback for any older post
         * whose original is genuinely smaller.
         */
        $feat = get_the_post_thumbnail_url( $pid, 'full' );
        if ( ! $feat ) {
            $feat = get_the_post_thumbnail_url( $pid, 'large' );
        }

        if ( $feat ) {
            $img             = $feat;
            $img_is_fallback = false;

            // Real dimensions when we have them: the networks skip a fetch, and a
            // card cannot render at the wrong aspect while the image is still loading.
            $meta = wp_get_attachment_metadata( get_post_thumbnail_id( $pid ) );
            if ( ! empty( $meta['width'] ) && ! empty( $meta['height'] ) ) {
                $img_w = (int) $meta['width'];
                $img_h = (int) $meta['height'];
            }
        }
        $cats    = get_the_category( $pid );
        $section = ! empty( $cats ) ? $cats[0]->name : 'Bathroom Resurfacing';
        $article_meta .= '<meta property="article:published_time" content="' . esc_attr( get_the_date( 'c', $pid ) ) . '" />' . "\n";
        $article_meta .= '<meta property="article:modified_time" content="' . esc_attr( get_the_modified_date( 'c', $pid ) ) . '" />' . "\n";
        $article_meta .= '<meta property="article:author" content="Timeless Resurfacing" />' . "\n";
        $article_meta .= '<meta property="article:section" content="' . esc_attr( $section ) . '" />' . "\n";
    }

    echo '<meta name="description" content="' . esc_attr( $desc ) . '" />' . "\n";
    /* A page with nothing on it should not be in the index at all. follow is kept so
       any links the theme wraps around it still pass through. */
    $robots = ( is_page() && timeless_page_renders_empty() )
        ? 'noindex, follow'
        : 'index, follow, max-snippet:-1, max-image-preview:large';
    echo '<meta name="robots" content="' . esc_attr( $robots ) . '" />' . "\n";
    echo '<link rel="alternate" hreflang="en-au" href="' . esc_url( $url ) . '" />' . "\n";
    echo '<meta property="og:type" content="' . esc_attr( $og_type ) . '" />' . "\n";
    echo '<meta property="og:title" content="' . esc_attr( $title ) . '" />' . "\n";
    echo '<meta property="og:description" content="' . esc_attr( $desc ) . '" />' . "\n";
    echo '<meta property="og:url" content="' . esc_url( $url ) . '" />' . "\n";
    echo '<meta property="og:image" content="' . esc_url( $img ) . '" />' . "\n";
    if ( ! empty( $img_w ) && ! empty( $img_h ) ) {
        echo '<meta property="og:image:width" content="' . (int) $img_w . '" />' . "\n";
        echo '<meta property="og:image:height" content="' . (int) $img_h . '" />' . "\n";
    } elseif ( $img_is_fallback ) {
        echo '<meta property="og:image:width" content="1200" />' . "\n";
        echo '<meta property="og:image:height" content="630" />' . "\n";
    }
    echo '<meta name="twitter:card" content="summary_large_image" />' . "\n";
    echo $article_meta;  // already escaped per-attribute above; empty on non-articles
}
add_action( 'wp_head', 'timeless_seo_meta', 2 );

/* ─────────────────────────────────────────────
   5c. FAQPage schema for blog articles (template-level)
   ─────────────────────────────────────────────
   Parses the CURRENT article's content for a "Frequently asked questions"
   (or "FAQ") H2, then the H3 (question) + following P (answer) pairs beneath
   it, and emits a valid schema.org FAQPage JSON-LD block. Generating the
   schema from the rendered structure means the FAQ rich result works no
   matter how the post is stored, and it no longer depends on a body-baked
   <script> (which the importer now strips). Emits nothing when there is no
   FAQ section, so non-FAQ posts stay clean.
   ───────────────────────────────────────────── */
function timeless_article_faq_schema() {
    if ( ! is_singular( 'article' ) ) {
        return;
    }
    $post = get_post( get_queried_object_id() );
    if ( ! $post ) {
        return;
    }
    $faqs = timeless_extract_article_faqs( $post->post_content );
    if ( empty( $faqs ) ) {
        return;
    }

    $entities = array();
    foreach ( $faqs as $faq ) {
        $entities[] = array(
            '@type'          => 'Question',
            'name'           => $faq['q'],
            'acceptedAnswer' => array(
                '@type' => 'Answer',
                'text'  => $faq['a'],
            ),
        );
    }
    $schema = array(
        '@context'   => 'https://schema.org',
        '@type'      => 'FAQPage',
        'mainEntity' => $entities,
    );

    echo "\n" . '<script type="application/ld+json">'
        . wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE )
        . '</script>' . "\n";
}
add_action( 'wp_head', 'timeless_article_faq_schema', 3 );

/* Parse raw article HTML for the FAQ section's question/answer pairs.
   Returns array of [ 'q' => question, 'a' => answer ] (plain text), or an
   empty array when the post has no FAQ heading. Matches FAQ headings that
   CONTAIN the phrase (e.g. "Common questions about bathtub chip repair"), and
   bounds the section at the following H2 so a closing CTA is never absorbed. */
function timeless_extract_article_faqs( $content ) {
    if ( ! is_string( $content ) || $content === '' ) {
        return array();
    }

    // Index every H2 (with offsets) so we can bound the FAQ section by headings.
    if ( ! preg_match_all( '/<h2\b[^>]*>(.*?)<\/h2>/is', $content, $h2s, PREG_OFFSET_CAPTURE ) ) {
        return array();
    }

    // A heading opens the FAQ section if its text contains one of these phrases.
    $faq_pattern = '/\b(?:frequently\s+asked\s+questions?|faqs?|common\s+questions?)\b/i';
    $start       = null;
    $end         = strlen( $content );
    foreach ( $h2s[0] as $i => $whole ) {
        if ( $start === null ) {
            if ( preg_match( $faq_pattern, wp_strip_all_tags( $h2s[1][ $i ][0] ) ) ) {
                $start = $whole[1] + strlen( $whole[0] );  // FAQ content starts after this H2
            }
        } else {
            $end = $whole[1];  // the next H2 ends the FAQ section
            break;
        }
    }
    if ( $start === null ) {
        return array();
    }

    $section = substr( $content, $start, $end - $start );

    // Each Q/A = an H3 (question) followed by one or more paragraphs (answer).
    if ( ! preg_match_all(
        '/<h3\b[^>]*>(.+?)<\/h3>\s*((?:<p\b[^>]*>.*?<\/p>\s*)+)/is',
        $section,
        $pairs,
        PREG_SET_ORDER
    ) ) {
        return array();
    }

    $faqs = array();
    foreach ( $pairs as $pair ) {
        $q = trim( preg_replace( '/\s+/', ' ', wp_strip_all_tags( $pair[1] ) ) );
        $a = trim( preg_replace( '/\s+/', ' ', wp_strip_all_tags( $pair[2] ) ) );
        if ( $q !== '' && $a !== '' ) {
            $faqs[] = array( 'q' => $q, 'a' => $a );
        }
    }
    return $faqs;
}

/* ─────────────────────────────────────────────
   5b. ANALYTICS, GA4 + Microsoft Clarity (Customizer-driven)
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
    $clarity = trim( get_theme_mod( 'timeless_clarity_id', '' ) );

    $has_ga4 = $ga4 && preg_match( '/^G-[A-Z0-9]{8,12}$/i', $ga4 );
    $has_clarity = $clarity && preg_match( '/^[a-z0-9]{8,15}$/i', $clarity );

    if ( ! $has_ga4 && ! $has_clarity ) {
        return;
    }

    // Defer all analytics until first user interaction OR 2.5s after page load.
    // This frees the main thread during the LCP measurement window, without
    // this, GTM (172 KB) creates 200+ ms long tasks at 3-5s on slow 4G mobile,
    // which pushes Lighthouse LCP past 5s. The tracking still fires for any
    // engaged visitor (anyone who scrolls/clicks within 2.5s) so we don't
    // lose meaningful analytics data, just bot impressions.
    ?>
<!-- Analytics (deferred until interaction or 2.5s) -->
<script>
(function(){
  var loaded = false;
  var ga4 = <?php echo $has_ga4 ? '"' . esc_js( $ga4 ) . '"' : 'null'; ?>;
  var clarityId = <?php echo $has_clarity ? '"' . esc_js( $clarity ) . '"' : 'null'; ?>;

  function loadAnalytics(){
    if (loaded) return;
    loaded = true;

    if (ga4) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function(){ dataLayer.push(arguments); };
      gtag('js', new Date());
      gtag('config', ga4, { anonymize_ip: true });
      var g = document.createElement('script');
      g.async = true;
      g.src = 'https://www.googletagmanager.com/gtag/js?id=' + ga4;
      document.head.appendChild(g);
    }

    if (clarityId) {
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", clarityId);
    }
  }

  // Trigger on first user signal
  var events = ['scroll','click','keydown','touchstart','mousemove'];
  events.forEach(function(ev){
    window.addEventListener(ev, loadAnalytics, { once: true, passive: true });
  });

  // Fallback: load 500ms AFTER window.load. window.load guarantees the LCP
  // measurement window has closed (Lighthouse uses load + 250ms as the LCP
  // boundary). Loading earlier than this can race with LCP measurement and
  // cause NO_LCP errors. Loading later than this means tracking still works
  // for engaged visitors, they triggered the interaction handlers above.
  function deferredFallback(){ setTimeout(loadAnalytics, 500); }
  if (document.readyState === 'complete') {
    deferredFallback();
  } else {
    window.addEventListener('load', deferredFallback, { once: true });
  }

  // Hard ceiling: load after 10s no matter what. Protects against very
  // slow connections where window.load may take 8s+ on slow 4G.
  setTimeout(loadAnalytics, 10000);
})();
</script>
    <?php
}
add_action( 'wp_head', 'timeless_analytics_scripts', 99 );  // Priority 99 = late in head, after most other tags

/* ─────────────────────────────────────────────
   5c. XML SITEMAP, Auto-generated at /sitemap.xml
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

        /*
         * Skip pages that render nothing. /services/shower-resurfacing/ was being
         * emitted at priority 0.8 while serving a 2-word body (found live
         * 2026-08-22). Submitting an empty URL and calling it a high-priority page
         * is worse than not submitting it — the page still resolves for anyone
         * holding the link, it just stops being advertised until it has content.
         */
        if ( timeless_page_renders_empty( $page->ID ) ) continue;

        /*
         * Priority ladder.
         *
         * Service pages are detected by their URL PATH, not by a 'sydney' substring
         * in the slug. The old test was written when the templates were named
         * page-*-sydney.php; the live URLs are /services/<slug>/ with no suffix, so
         * it matched nothing and all 19 money pages were emitted at 0.5/yearly,
         * the same weight as the privacy policy.
         */
        $path       = trim( (string) wp_parse_url( $url, PHP_URL_PATH ), '/' );
        $is_service = ( strpos( $path, 'services/' ) === 0 && $path !== 'services' );

        if ( $is_service || $slug === 'sydney' ) {
            $priority = '0.8';
            $freq     = 'monthly';
        } elseif ( in_array( $slug, array( 'about', 'contact', 'gallery', 'faqs', 'areas', 'services' ), true ) ) {
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

    /*
     * Blog archive + articles.
     *
     * The loop above only walks post_type 'page', so every published article was
     * absent from the sitemap and Google had no discovery path to /blog/ at all.
     * Articles are the freshness signal for the whole domain, so the archive gets
     * weekly/0.8 and each post monthly/0.7.
     */
    $blog_url = get_post_type_archive_link( 'article' );

    if ( $blog_url ) {
        $articles = get_posts( array(
            'post_type'   => 'article',
            'post_status' => 'publish',
            'numberposts' => -1,
            'orderby'     => 'date',
            'order'       => 'DESC',
        ) );

        // lastmod for the archive = the most recently touched post on it
        $blog_modified = $articles ? get_the_modified_date( 'Y-m-d', $articles[0] ) : current_time( 'Y-m-d' );

        echo '<url>';
        echo '<loc>' . esc_url( $blog_url ) . '</loc>';
        echo '<lastmod>' . esc_html( $blog_modified ) . '</lastmod>';
        echo '<changefreq>weekly</changefreq>';
        echo '<priority>0.8</priority>';
        echo '</url>' . "\n";

        foreach ( $articles as $article ) {
            $a_url = get_permalink( $article );

            if ( empty( $a_url ) ) continue;

            echo '<url>';
            echo '<loc>' . esc_url( $a_url ) . '</loc>';
            echo '<lastmod>' . esc_html( get_the_modified_date( 'Y-m-d', $article ) ) . '</lastmod>';
            echo '<changefreq>monthly</changefreq>';
            echo '<priority>0.7</priority>';
            echo '</url>' . "\n";
        }
    }

    echo '</urlset>';
    exit;
}

/**
 * Intercept /sitemap.xml early, before WordPress tries to route it.
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

/* ─────────────────────────────────────────────
   5c-2. LLMS.TXT, serve the theme's llms.txt at /llms.txt
   ─────────────────────────────────────────────
   WordPress never serves theme files at the site root, so without this
   intercept https://timelessresurfacing.com.au/llms.txt 404s even though
   the file ships inside the theme folder (SEO-audit P0, 2026-07-07).
   Same early-intercept pattern as timeless_sitemap_early_intercept():
   'parse_request' fires BEFORE template_redirect and before 404 routing,
   and needs no rewrite-rule flush. Only the exact path /llms.txt is
   intercepted; every other request falls through untouched. */
function timeless_llms_txt_intercept() {
    $uri  = isset( $_SERVER['REQUEST_URI'] ) ? $_SERVER['REQUEST_URI'] : '';
    $path = parse_url( $uri, PHP_URL_PATH );

    if ( $path !== '/llms.txt' ) {
        return;
    }

    $file = get_template_directory() . '/llms.txt';
    if ( ! file_exists( $file ) ) {
        return; // File not deployed → fall through to normal 404 handling
    }

    // Prevent any buffered output from corrupting the plain-text response
    if ( ob_get_level() ) {
        ob_end_clean();
    }

    status_header( 200 );
    header( 'Content-Type: text/plain; charset=utf-8' );
    header( 'X-Robots-Tag: noindex' );
    readfile( $file );
    exit;
}
add_action( 'parse_request', 'timeless_llms_txt_intercept' );

/* Custom robots.txt, block crawl-budget-wasting URLs */
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
   5d. SEO, Related Services internal links (speeds up crawl discovery)
   ───────────────────────────────────────────── */
function timeless_related_services() {
    if ( ! is_singular( 'page' ) ) return;
    $slug = get_post_field( 'post_name', get_post() );

    $services = array(
        'shower-regrouting'     => array( 'label' => 'Shower Regrouting',  'icon' => 'shower' ),
        'bath-resurfacing'      => array( 'label' => 'Bath Resurfacing',   'icon' => 'bathtub' ),
        'tile-resurfacing'      => array( 'label' => 'Tile Resurfacing',   'icon' => 'grid_view' ),
        'vanity-refinishing'    => array( 'label' => 'Vanity Refinishing', 'icon' => 'countertops' ),
        'basin-restoration'     => array( 'label' => 'Basin Restoration',  'icon' => 'faucet' ),
        'shower-leak-repair'    => array( 'label' => 'Shower Sealing',     'icon' => 'water_damage' ),
    );

    // Only render on service pages, check if current slug is a service
    if ( ! isset( $services[ $slug ] ) ) return;

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
   8. QUOTE FORM HANDLER, Processes form submissions + sends email
   ───────────────────────────────────────────── */

/** Register AJAX handler for quote form */
function timeless_handle_quote_form() {
    // Verify nonce for security
    if ( ! isset( $_POST['timeless_quote_nonce'] ) ||
         ! wp_verify_nonce( $_POST['timeless_quote_nonce'], 'timeless_quote_submit' ) ) {
        wp_send_json_error( array( 'message' => 'Security check failed. Please refresh and try again.' ) );
    }

    // Rate limiting, max 3 submissions per IP per hour
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
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

    // Services (checkboxes, array of values)
    $services_raw = isset( $_POST['services'] ) ? (array) $_POST['services'] : array();
    $services = array_map( 'sanitize_text_field', $services_raw );

    // Validate required fields
    if ( empty( $name ) || empty( $phone ) ) {
        wp_send_json_error( array( 'message' => 'Please provide your name and phone number.' ) );
    }

    // Build email
    $to      = timeless_email();
    $subject = 'New Quote Request from ' . $name . ', ' . $page;
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
        wp_send_json_success( array( 'message' => 'Thanks! We\'ll have your quote ready within 1 business day.' ) );
    } else {
        wp_send_json_error( array( 'message' => 'Something went wrong. Please call us directly.' ) );
    }
}
add_action( 'wp_ajax_timeless_quote', 'timeless_handle_quote_form' );
add_action( 'wp_ajax_nopriv_timeless_quote', 'timeless_handle_quote_form' );

/* ─────────────────────────────────────────────────────────────────
 * QUOTE-FORM DRAFT STORE (added v1.5.2, 2026-08-13)
 *
 * Why this exists: the "continue where you left off" link used to carry the whole
 * draft inside the URL fragment (#qf=). That is perfect for the QR handoff — private,
 * serverless, and a QR code holds kilobytes — but a real two-bathroom draft encodes to
 * ~1,800 characters, which is 13 SMS segments and gets mangled by some handsets.
 *
 * So for SMS we store the draft here and hand out a SHORT code instead:
 *     https://timelessresurfacing.com.au/contact/?r=a1b2c3d4e5f6      (~55 chars, 1 segment)
 *
 * Design notes:
 *  - the code is 12 random hex chars from a CSPRNG, so drafts cannot be enumerated
 *  - stored as a transient with a 30-day life, so cleanup is automatic — no cron, no table
 *  - nothing is stored that the customer has not already sent us in the partial webhook
 *  - saving is rate-limited per IP, and the payload is size-capped
 * ───────────────────────────────────────────────────────────────── */

define( 'TIMELESS_DRAFT_TTL', 30 * DAY_IN_SECONDS );
define( 'TIMELESS_DRAFT_MAX_BYTES', 64000 );

function timeless_draft_client_ip() {
    // REMOTE_ADDR only — forwarded headers are spoofable and this gates a write.
    return isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
}

function timeless_handle_draft_save() {
    $raw = isset( $_POST['draft'] ) ? wp_unslash( $_POST['draft'] ) : '';
    if ( ! is_string( $raw ) || $raw === '' ) {
        wp_send_json_error( array( 'message' => 'empty draft' ), 400 );
    }
    if ( strlen( $raw ) > TIMELESS_DRAFT_MAX_BYTES ) {
        wp_send_json_error( array( 'message' => 'draft too large' ), 413 );
    }
    // Must be valid JSON, and an object — never store arbitrary text.
    $decoded = json_decode( $raw, true );
    if ( ! is_array( $decoded ) ) {
        wp_send_json_error( array( 'message' => 'draft must be JSON' ), 400 );
    }

    // Rate limit: 150 saves per IP per hour. The draft is now re-saved as they type
    // (3s debounce, skipped when unchanged), so a thorough two-bathroom customer might
    // save 30-50 times. 150 stays generous for people and tight for scripts.
    $ip       = timeless_draft_client_ip();
    $rate_key = 'tr_draft_rate_' . md5( $ip );
    $saves    = get_transient( $rate_key );
    if ( $saves !== false && (int) $saves >= 150 ) {
        wp_send_json_error( array( 'message' => 'too many saves' ), 429 );
    }
    set_transient( $rate_key, ( $saves === false ? 1 : (int) $saves + 1 ), HOUR_IN_SECONDS );

    // Reuse the code the browser already holds so the SMS link stays stable as they
    // progress; only mint a new one when there is no valid existing code.
    $id = isset( $_POST['id'] ) ? preg_replace( '/[^a-f0-9]/', '', (string) wp_unslash( $_POST['id'] ) ) : '';
    if ( strlen( $id ) !== 12 ) {
        $id = bin2hex( random_bytes( 6 ) );   // 48 bits of entropy, unguessable
    }

    // Wrapped record, not the bare draft: the abandonment sweep needs to know when this
    // was last touched, whether we've already texted about it, and whether they finished.
    $prev = get_transient( 'tr_draft_' . $id );
    $prev = $prev ? json_decode( $prev, true ) : array();
    set_transient( 'tr_draft_' . $id, wp_json_encode( array(
        'draft'    => $decoded,
        'touched'  => time(),
        'notified' => isset( $prev['notified'] ) ? (int) $prev['notified'] : 0,
        'done'     => isset( $prev['done'] ) ? (int) $prev['done'] : 0,
        'name'     => isset( $decoded['fn'] ) ? (string) $decoded['fn'] : '',
        'surname'  => isset( $decoded['ln'] ) ? (string) $decoded['ln'] : '',
        'phone'    => isset( $decoded['ph'] ) ? (string) $decoded['ph'] : '',
        'email'    => isset( $decoded['em'] ) ? (string) $decoded['em'] : '',
    ) ), TIMELESS_DRAFT_TTL );
    wp_send_json_success( array( 'id' => $id ) );
}
add_action( 'wp_ajax_timeless_draft_save', 'timeless_handle_draft_save' );
add_action( 'wp_ajax_nopriv_timeless_draft_save', 'timeless_handle_draft_save' );

function timeless_handle_draft_load() {
    $id = isset( $_GET['id'] ) ? preg_replace( '/[^a-f0-9]/', '', (string) wp_unslash( $_GET['id'] ) ) : '';
    if ( strlen( $id ) !== 12 ) {
        wp_send_json_error( array( 'message' => 'bad code' ), 400 );
    }
    $rec = get_transient( 'tr_draft_' . $id );
    if ( $rec === false ) {
        // Older than the 30-day life, or never existed. The form falls back to whatever it
        // has locally and, if that is empty too, says so rather than showing a blank page.
        wp_send_json_error( array( 'message' => 'not found', 'status' => 'expired' ), 404 );
    }
    $rec = json_decode( $rec, true );

    /* Already submitted? Don't hand the draft back. Otherwise someone who booked in and
       later taps the old link (SMS threads live forever) gets their finished quote
       refilled and can send a duplicate — or worse, is confused into thinking their new
       enquiry is about the old job. They get a clean form instead. */
    if ( is_array( $rec ) && ! empty( $rec['done'] ) ) {
        wp_send_json_success( array( 'draft' => null, 'status' => 'submitted' ) );
    }

    // Records saved before the wrapper existed are the bare draft.
    $draft = ( is_array( $rec ) && isset( $rec['draft'] ) ) ? $rec['draft'] : $rec;
    wp_send_json_success( array( 'draft' => $draft, 'status' => 'ok' ) );
}
add_action( 'wp_ajax_timeless_draft_load', 'timeless_handle_draft_load' );
add_action( 'wp_ajax_nopriv_timeless_draft_load', 'timeless_handle_draft_load' );

/* ─────────────────────────────────────────────────────────────────
 * ABANDONED-DRAFT SWEEP (added v1.5.2)
 *
 * GoHighLevel only ever hears from us twice: once when a customer enters a phone
 * number, and once if they finish. Every draft save in between goes to this server,
 * so GHL cannot tell whether someone is still filling the form or has walked away.
 * A fixed delay in GHL would therefore text people who are still typing.
 *
 * So the idle decision is made HERE, where the activity actually is:
 *   - every save stamps `touched`
 *   - this sweep runs every 10 minutes and looks for drafts gone quiet
 *   - when one crosses the threshold it fires the SAME inbound webhook the form
 *     uses, with form_status = "abandoned_confirmed", and marks it notified
 *
 * Because the clock is idle-based, a customer who comes back RESETS it — they can
 * never be texted while they are still working. Threshold = 30 minutes to call it
 * abandoned plus an hour before we say anything (Allan, 2026-08-13).
 * ───────────────────────────────────────────────────────────────── */

define( 'TIMELESS_ABANDON_IDLE', 90 * MINUTE_IN_SECONDS );  // 30 min to confirm + 60 min grace

/* The gate token W2's first action checks. This is NOT a secret in any real sense — it
 * already ships inside the public quote-form bundle, so anyone can read it from the site.
 * It exists to stop idle noise hitting the workflow, not to authenticate. Override it in
 * wp-config.php if it is ever rotated, so a rotation needs no theme deploy. */
if ( ! defined( 'TIMELESS_GHL_SECRET' ) ) {
    define( 'TIMELESS_GHL_SECRET', 'TR_secret_v2_ByJJ9B0FAy8oG95mlzclaKsZsCHYzZnqILo3z3pk4Mc' );
}

function timeless_ghl_partial_webhook() {
    return 'https://services.leadconnectorhq.com/hooks/Uz8fQwDiUxAHVtlruspD/webhook-trigger/11247014-933d-4731-ba38-8990256113ca';
}

/** Marks a draft finished so the sweep never texts someone who already submitted. */
function timeless_handle_draft_done() {
    $id = isset( $_POST['id'] ) ? preg_replace( '/[^a-f0-9]/', '', (string) wp_unslash( $_POST['id'] ) ) : '';
    if ( strlen( $id ) !== 12 ) { wp_send_json_error( array( 'message' => 'bad code' ), 400 ); }
    $rec = get_transient( 'tr_draft_' . $id );
    if ( $rec === false ) { wp_send_json_success( array( 'ok' => true ) ); }
    $rec = json_decode( $rec, true );
    if ( is_array( $rec ) ) {
        $rec['done'] = 1;
        set_transient( 'tr_draft_' . $id, wp_json_encode( $rec ), TIMELESS_DRAFT_TTL );
    }
    wp_send_json_success( array( 'ok' => true ) );
}
add_action( 'wp_ajax_timeless_draft_done', 'timeless_handle_draft_done' );
add_action( 'wp_ajax_nopriv_timeless_draft_done', 'timeless_handle_draft_done' );

function timeless_sweep_abandoned_drafts() {
    global $wpdb;
    $rows = $wpdb->get_results(
        "SELECT option_name, option_value FROM {$wpdb->options}
          WHERE option_name LIKE '_transient_tr_draft_%' LIMIT 500"
    );
    if ( ! $rows ) { return; }

    $cutoff = time() - TIMELESS_ABANDON_IDLE;
    $sent   = 0;

    foreach ( $rows as $row ) {
        $id  = substr( $row->option_name, strlen( '_transient_tr_draft_' ) );
        $rec = json_decode( $row->option_value, true );
        if ( ! is_array( $rec ) || ! isset( $rec['touched'] ) ) { continue; }
        if ( ! empty( $rec['notified'] ) || ! empty( $rec['done'] ) ) { continue; }
        if ( (int) $rec['touched'] > $cutoff ) { continue; }   // still active, clock resets on any save
        /* Plenty of people use the "I don't have a phone number" path and leave only an
           email. They were being dropped entirely — no phone meant no follow-up of any
           kind. Now we still fire, pass whichever contact details exist, and tell GHL
           which channel is available so it can text OR email. */
        $phone = preg_replace( '/[^0-9]/', '', (string) $rec['phone'] );
        $has_phone = strlen( $phone ) >= 9;
        $has_email = ! empty( $rec['email'] ) && is_email( $rec['email'] );
        if ( ! $has_phone && ! $has_email ) { continue; }       // no way to reach them at all
        $phone = $has_phone ? '+61' . ltrim( $phone, '0' ) : '';

        $resume = home_url( '/finish-quote/' ) . '?r=' . $id;
        $res = wp_remote_post( timeless_ghl_partial_webhook(), array(
            'timeout'  => 15,
            'headers'  => array( 'Content-Type' => 'application/json' ),
            'body'     => wp_json_encode( array(
                'secret_token' => defined( 'TIMELESS_GHL_SECRET' ) ? TIMELESS_GHL_SECRET : '',
                'firstName'    => $rec['name'],
                'lastName'     => $rec['surname'],
                'email'        => $rec['email'],
                'phone'        => $phone,
                'customData'   => array(
                    'form_status'     => 'abandoned_confirmed',
                    'resume_link_sms' => $resume,
                    'idle_minutes'    => (int) round( ( time() - (int) $rec['touched'] ) / 60 ),
                    // so W2 can branch: text if we have a mobile, otherwise email them
                    'reach_by'        => $has_phone ? 'sms' : 'email',
                ),
            ) ),
        ) );

        // Only mark notified on a real success, so a transient outage retries next sweep
        // instead of silently swallowing the lead.
        if ( ! is_wp_error( $res ) && (int) wp_remote_retrieve_response_code( $res ) < 300 ) {
            $rec['notified'] = 1;
            set_transient( 'tr_draft_' . $id, wp_json_encode( $rec ), TIMELESS_DRAFT_TTL );
            $sent++;
        }
    }
    if ( $sent ) { update_option( 'tr_draft_last_sweep', array( 'at' => time(), 'sent' => $sent ) ); }
}
add_action( 'timeless_draft_sweep', 'timeless_sweep_abandoned_drafts' );

function timeless_schedule_draft_sweep() {
    if ( ! wp_next_scheduled( 'timeless_draft_sweep' ) ) {
        wp_schedule_event( time() + 600, 'timeless_ten_minutes', 'timeless_draft_sweep' );
    }
}
add_action( 'init', 'timeless_schedule_draft_sweep' );

function timeless_add_ten_minute_schedule( $schedules ) {
    $schedules['timeless_ten_minutes'] = array( 'interval' => 600, 'display' => 'Every 10 minutes' );
    return $schedules;
}
add_filter( 'cron_schedules', 'timeless_add_ten_minute_schedule' );

/** Pass AJAX URL and nonce to frontend JavaScript */
function timeless_form_scripts() {
    wp_localize_script( 'timeless-main', 'timelessAjax', array(
        'url'   => admin_url( 'admin-ajax.php' ),
        'nonce' => wp_create_nonce( 'timeless_quote_submit' ),
    ) );
}
add_action( 'wp_enqueue_scripts', 'timeless_form_scripts' );

/* ─────────────────────────────────────────────
   8b. CHAT WIDGET, Floating "Have a Question?" bubble
   Separate from quote form so we can track widget leads
   distinctly in the inbox and tune each flow independently.
   ───────────────────────────────────────────── */

/** Valid customer types, validates against dropdown options */
function timeless_chat_widget_customer_types() {
    return array( 'Home Owner', 'Renter', 'Construction', 'Real Estate', 'Business' );
}

/** AJAX handler for chat widget submissions */
function timeless_handle_chat_widget() {
    // Nonce check
    if ( ! isset( $_POST['cw_nonce'] ) || ! wp_verify_nonce( $_POST['cw_nonce'], 'timeless_chat_widget' ) ) {
        wp_send_json_error( array( 'message' => 'Security check failed. Please refresh the page.' ) );
    }

    // Rate limit, max 5 submissions per IP per hour
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
    $subject = '[Chat Widget] ' . $name . ', ' . $ctype;
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
    <!-- CHAT WIDGET, Floating "Have a Question?" bubble -->
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
                        <p class="text-[0.65rem] text-white/70"><?php esc_html_e( 'We reply within 1 business day', 'timeless' ); ?></p>
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
                    <p class="text-xs text-secondary"><?php esc_html_e( "We'll reply within 1 business day during business hours.", 'timeless' ); ?></p>
                </div>
                <div id="cw-error" class="hidden p-3 mt-3 bg-red-50 border border-red-200 rounded-lg">
                    <p class="text-xs text-red-700 text-center" id="cw-error-message"></p>
                </div>
            </div>
        </div>
    </div>
    <?php
}
/* CHAT WIDGET DISABLED site-wide, Allan 2026-08-20. He never used it and does not want
   another contact channel competing with the phone number, the email and the quote form.
   The render and script functions are left intact so this is a one-line revert if that
   changes; only the wp_footer hooks are removed. */
// add_action( 'wp_footer', 'timeless_render_chat_widget', 5 );

/**
 * Inline JS for the chat widget, open/close behaviour + real AJAX submission.
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
/* CHAT WIDGET DISABLED site-wide, Allan 2026-08-20. He never used it and does not want
   another contact channel competing with the phone number, the email and the quote form.
   The render and script functions are left intact so this is a one-line revert if that
   changes; only the wp_footer hooks are removed. */
// add_action( 'wp_footer', 'timeless_chat_widget_script', 10 );

/* ─────────────────────────────────────────────
   9. SECURITY HARDENING, Anti brute-force + lockdown
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

/** Limit login attempts, basic rate limiting via failed login tracking */
function timeless_limit_login_attempts( $user, $username, $password ) {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
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
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
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
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
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
 *  Inter is the body font, without preload, the browser only discovers the
 *  @font-face URL after parsing the inline <style> tag, costing ~50-100ms.
 *  Preload tells the browser to fetch it in parallel with the HTML parse.
 *  (Google Fonts preconnects removed, Inter + Material Symbols are now local.) */
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

/** Preload hero LCP image on homepage only.
 *  Without this, Lighthouse sometimes can't detect LCP (NO_LCP error) because
 *  the hero image is discovered late in the load sequence. With preload, the
 *  browser fetches it in parallel with HTML, making LCP measurement
 *  deterministic + reducing actual LCP time by 100-300ms.
 *
 *  Mobile gets the 800w variant (responsive). Desktop gets the full image.
 *  imagesrcset/imagesizes mirrors the picture element so browser picks
 *  the right variant for the viewport.
 */
function timeless_preload_hero_lcp() {
    if ( ! is_front_page() ) {
        return;
    }
    $base_url = get_template_directory_uri() . '/images/homepage/after.jpg';
    $base_path = get_template_directory() . '/images/homepage/after.jpg';
    if ( ! file_exists( $base_path ) ) {
        return;
    }
    $w400_webp_path = get_template_directory() . '/images/homepage/after-400w.jpg.webp';
    $w800_webp_path = get_template_directory() . '/images/homepage/after-800w.jpg.webp';
    if ( ! file_exists( $w400_webp_path ) || ! file_exists( $w800_webp_path ) ) {
        return;
    }
    $ver = filemtime( $base_path );
    $w400_webp = get_template_directory_uri() . '/images/homepage/after-400w.jpg.webp';
    $w800_webp = get_template_directory_uri() . '/images/homepage/after-800w.jpg.webp';

    // Preload the WebP variants directly. type="image/webp" makes non-WebP
    // browsers skip this preload and fall back to the picture element's
    // <img> srcset (JPG). WebP browsers (95%+ of traffic) preload the
    // right size, no duplicate JPG fetch (was costing ~30 KB + 100ms LCP).
    printf(
        '<link rel="preload" as="image" type="image/webp" imagesrcset="%s?v=%d 400w, %s?v=%d 800w" imagesizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" fetchpriority="high" />' . "\n",
        esc_url( $w400_webp ), $ver,
        esc_url( $w800_webp ), $ver
    );
}
add_action( 'wp_head', 'timeless_preload_hero_lcp', 1 );

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
