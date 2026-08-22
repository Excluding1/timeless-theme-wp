<?php
/**
 * Single Article (Blog Post) template.
 *
 * Renders a single blog post at /blog/{slug}/. Composed of:
 *   - Hero with featured image + meta
 *   - the_content() — Gutenberg blocks + custom shortcodes (before_after,
 *     icon_callout, process_step, stat_grid)
 *   - Related articles cross-link
 *   - CTA back to quote
 *   - BlogPosting schema
 */
get_header();
the_post();

$published_iso  = get_the_date( 'c' );
$published_disp = get_the_date();
$modified_iso   = get_the_modified_date( 'c' );
$modified_disp  = get_the_modified_date();
$show_modified  = get_the_modified_date( 'Y-m-d' ) !== get_the_date( 'Y-m-d' );
$thumb_url      = get_the_post_thumbnail_url( get_the_ID(), 'large' );
$hero_img       = $thumb_url ? $thumb_url : get_template_directory_uri() . '/images/homepage/after.jpg';  // fallback so hero/OG never render bare
// Schema wants the biggest version, the visible hero does not. Google recommends
// article images at least 1200px wide; 'large' is 1024, so the two are split here
// rather than reusing $hero_img for both and shipping an undersized schema image.
$schema_img     = get_the_post_thumbnail_url( get_the_ID(), 'full' ) ?: $hero_img;
$canonical      = get_permalink();
$categories     = get_the_category();
$cat_name       = ! empty( $categories ) ? $categories[0]->name : '';
$word_count     = str_word_count( wp_strip_all_tags( strip_shortcodes( get_the_content() ) ) );
$reading_time   = max( 1, (int) round( $word_count / 200 ) );  // ~200 wpm, min 1

// Hero caption: real featured image → its Media Library caption (may be empty);
// fallback theme image → honest generic caption.
if ( $thumb_url ) {
    $thumb_id     = get_post_thumbnail_id();
    $hero_caption = $thumb_id ? (string) wp_get_attachment_caption( $thumb_id ) : '';
} else {
    // never imply a stock/illustrative image is a real job (customer-fairness rule)
    $hero_caption = 'Bathroom resurfacing in a Sydney home';
}
?>

<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "BlogPosting",
 "headline": "<?php echo esc_js( get_the_title() ); ?>",
 "description": "<?php echo esc_js( get_the_excerpt() ); ?>",
 "image": "<?php echo esc_url( $schema_img ); ?>",
 "inLanguage": "en-AU",
 <?php if ( $cat_name ) : ?>"articleSection": "<?php echo esc_js( $cat_name ); ?>",<?php endif; ?>
 "wordCount": <?php echo (int) $word_count; ?>,
 "author": { "@type": "Person", "name": "Allan P", "jobTitle": "Quotation and Jobs Manager, Bathroom Resurfacing Specialist", "worksFor": { "@type": "Organization", "name": "Timeless Resurfacing", "url": "https://timelessresurfacing.com.au" } },
 "publisher": {
 "@type": "Organization",<?php echo timeless_gbp_jsonld( false ); ?>
 "name": "Timeless Resurfacing",
 "url": "https://timelessresurfacing.com.au",
 "logo": { "@type": "ImageObject", "url": "<?php echo esc_url( get_template_directory_uri() . '/assets/favicon/favicon-96x96.png' ); ?>" }
 },
 "datePublished": "<?php echo esc_js( $published_iso ); ?>",
 "dateModified": "<?php echo esc_js( $modified_iso ); ?>",
 "mainEntityOfPage": "<?php echo esc_js( $canonical ); ?>"
}
</script>

<script type="application/ld+json">
{
 "@context": "https://schema.org", "@type": "BreadcrumbList",
 "itemListElement": [
 { "@type": "ListItem", "position": 1, "name": "Home", "item": "<?php echo esc_url( home_url( '/' ) ); ?>" },
 { "@type": "ListItem", "position": 2, "name": "Blog", "item": "<?php echo esc_url( home_url( '/blog/' ) ); ?>" },
 { "@type": "ListItem", "position": 3, "name": "<?php echo esc_js( get_the_title() ); ?>", "item": "<?php echo esc_url( $canonical ); ?>" }
 ]
}
</script>

<main id="main-content">

<!-- BREADCRUMB -->
<div class="pt-24 pb-2 px-6 sm:px-8 max-w-4xl mx-auto">
 <nav class="text-xs text-secondary" aria-label="Breadcrumb">
 <ol class="flex items-center gap-1">
 <li><a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="hover:text-primary transition-colors">Home</a></li>
 <li><span class="mx-1">/</span></li>
 <li><a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>" class="hover:text-primary transition-colors">Blog</a></li>
 <li><span class="mx-1">/</span></li>
 <li class="text-primary font-medium truncate max-w-[200px]"><?php echo esc_html( get_the_title() ); ?></li>
 </ol>
 </nav>
</div>

<!-- HERO -->
<article>
<header class="pt-4 pb-12 px-6 sm:px-8 max-w-4xl mx-auto article-header">
 <?php if ( $cat_name ) : ?>
 <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.7rem] font-bold tracking-widest uppercase rounded-sm mb-4"><?php echo esc_html( $cat_name ); ?></span>
 <?php endif; ?>

 <h1 class="text-4xl sm:text-5xl font-extrabold text-primary tracking-tighter leading-[1.05] mb-6">
 <?php the_title(); ?>
 </h1>

 <div class="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-secondary mb-8">
 <?php /* Illustrated avatar. Swap for a real photo of Allan when one exists. Kept as a PHP
    comment, not an HTML one: an HTML comment here is downloaded by every reader. */ ?>
 <?php $avatar = get_template_directory() . '/images/about/author-avatar.png'; ?>
 <?php if ( file_exists( $avatar ) ) : ?>
 <img src="<?php echo esc_url( get_template_directory_uri() . '/images/about/author-avatar.png' ); ?>" alt="" class="rounded-full shrink-0 mr-1 object-cover" style="width:40px;height:40px;border:2px solid #e7c08b;" aria-hidden="true" />
 <?php else : ?>
 <span class="inline-flex items-center justify-center rounded-full shrink-0 mr-1" style="width:40px;height:40px;background:#041534;color:#e7c08b;font-weight:800;font-size:0.95rem;" aria-hidden="true">A</span>
 <?php endif; ?>
 <span>By <b class="text-primary">Allan P</b>, Quotation and Jobs Manager &middot; Bathroom Resurfacing Specialist</span>
 <span class="text-secondary/50">·</span>
 <?php if ( $show_modified ) : ?>
 <time datetime="<?php echo esc_attr( $modified_iso ); ?>">Updated <?php echo esc_html( $modified_disp ); ?></time>
 <?php else : ?>
 <time datetime="<?php echo esc_attr( $published_iso ); ?>">Updated <?php echo esc_html( $published_disp ); ?></time>
 <?php endif; ?>
 <span class="text-secondary/50">·</span>
 <span><?php echo (int) $reading_time; ?> min read</span>
 </div>

 <figure class="mb-8">
 <div class="rounded-2xl overflow-hidden shadow-md aspect-16/9">
 <?php
 /*
  * srcset, not a lone src. This figure lives in max-w-4xl minus px-8, so it is
  * 832 CSS px at desktop; a 2x screen therefore wants ~1664 physical px. The old
  * markup hardcoded the 1024 variant, delivering 62% of that, which read as soft
  * or "480p" on any retina display. sizes tells the browser the real CSS width so
  * it pulls the 1672 original on 2x and stays on the 62KB 1024 file at 1x.
  *
  * fetchpriority=high because this is the LCP element on every article.
  */
 $hero_id = get_post_thumbnail_id();

 if ( $hero_id ) {
     echo wp_get_attachment_image( $hero_id, 'full', false, array(
         'class'         => 'w-full h-full object-cover',
         'alt'           => get_the_title(),
         'loading'       => 'eager',
         'fetchpriority' => 'high',
         'decoding'      => 'async',
         'sizes'         => '(max-width: 896px) 100vw, 832px',
     ) );
 } else {
     printf(
         '<img src="%s" alt="%s" class="w-full h-full object-cover" loading="eager" fetchpriority="high" />',
         esc_url( $hero_img ),
         esc_attr( get_the_title() )
     );
 }
 ?>
 </div>
 <?php if ( $hero_caption ) : ?>
 <figcaption class="text-xs text-secondary italic mt-2"><?php echo esc_html( $hero_caption ); ?></figcaption>
 <?php endif; ?>
 </figure>
</header>

<!-- ARTICLE BODY -->
<?php
// Pre-render content so we can inspect TOC items before deciding layout
$content_html = apply_filters( 'the_content', get_the_content() );
$toc_items    = $GLOBALS['timeless_toc_items'] ?? array();
$show_toc     = count( $toc_items ) >= 3;

// Number the TOC items ("01" gold prefix) to match the CSS chapter counter
// on the article H2s. The FAQ heading is skipped in both places so numbers
// stay in sync (same exclusion as style.css + the .faq-section JS).
$toc_n = 0;
foreach ( $toc_items as $k => $item ) {
    if ( preg_match( '/frequently asked|faq|common questions/i', $item['text'] ) ) {
        $toc_items[ $k ]['num'] = '';
    } else {
        $toc_n++;
        $toc_items[ $k ]['num'] = str_pad( (string) $toc_n, 2, '0', STR_PAD_LEFT );
    }
}
?>
<div class="px-6 sm:px-8 max-w-7xl mx-auto pb-16">
 <?php if ( $show_toc ) : ?>
 <!-- 2-column layout: TOC sidebar + article content -->
 <div class="tr-article-grid grid grid-cols-1 gap-8 lg:gap-12">
 <!-- TOC + CTA Sidebar -->
 <aside class="lg:sticky lg:top-24 lg:self-start order-2 lg:order-1 space-y-6">
 <!-- Mobile: collapsible TOC -->
 <details class="lg:hidden bg-surface-container-low rounded-xl p-5">
 <summary class="font-bold text-primary text-sm cursor-pointer flex items-center justify-between">
 <span class="flex items-center gap-2">
 <span class="material-symbols-outlined text-base" aria-hidden="true">format_list_bulleted</span>
 On this page
 </span>
 <span class="material-symbols-outlined text-base" aria-hidden="true">expand_more</span>
 </summary>
 <ul class="mt-4 space-y-2">
 <?php foreach ( $toc_items as $item ) : ?>
 <li><a href="#<?php echo esc_attr( $item['slug'] ); ?>" class="text-sm text-secondary hover:text-primary block py-1 leading-snug"><?php if ( $item['num'] ) : ?><span class="toc-num"><?php echo esc_html( $item['num'] ); ?></span><?php endif; ?><?php echo esc_html( $item['text'] ); ?></a></li>
 <?php endforeach; ?>
 </ul>
 </details>
 <!-- Desktop: always visible, sticky -->
 <nav class="hidden lg:block bg-surface-container-low rounded-xl p-6" aria-label="Table of contents">
 <h2 class="font-bold text-primary text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
 <span class="material-symbols-outlined text-base" aria-hidden="true">format_list_bulleted</span>
 On this page
 </h2>
 <ul class="space-y-2.5 border-l-2 border-surface-container">
 <?php foreach ( $toc_items as $item ) : ?>
 <li>
 <a href="#<?php echo esc_attr( $item['slug'] ); ?>" class="toc-link text-sm text-secondary hover:text-primary block pl-4 -ml-0.5 border-l-2 border-transparent hover:border-primary leading-snug py-1 transition-colors">
 <?php if ( $item['num'] ) : ?><span class="toc-num"><?php echo esc_html( $item['num'] ); ?></span><?php endif; ?><?php echo esc_html( $item['text'] ); ?>
 </a>
 </li>
 <?php endforeach; ?>
 </ul>
 </nav>
 <!-- Quote CTA box (under TOC, also sticky) -->
 <?php echo timeless_blog_quote_cta_box(); ?>
 </aside>
 <!-- Content -->
 <div class="entry-content order-1 lg:order-2 max-w-3xl">
 <?php echo $content_html; ?>
 </div>
 </div>
 <?php else : ?>
 <!-- Single-column layout: no TOC -->
 <div class="entry-content max-w-3xl mx-auto">
 <?php echo $content_html; ?>
 </div>
 <?php endif; ?>
</div>
</article>

<!-- AUTHOR / CREDENTIALS (E-E-A-T) BOX -->
<?php echo timeless_blog_author_box(); ?>

<!-- END-OF-ARTICLE CTA: full-width prominent conversion section -->
<?php echo timeless_blog_end_of_article_cta(); ?>

<!-- Back to blog (small secondary action) -->
<section class="py-8 bg-surface border-t border-surface-container">
 <div class="max-w-4xl mx-auto px-6 sm:px-8 text-center">
 <a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>" class="inline-flex items-center gap-2 text-primary font-bold hover:text-primary-soft transition-colors text-sm">
 <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_back</span>
 Back to all articles
 </a>
 </div>
</section>

<!-- RELATED ARTICLES -->
<?php
// Related = same primary category first (topical relevance), then top up with
// the most recent articles if fewer than 3 in-category are available.
$primary_cat_id = ! empty( $categories ) ? $categories[0]->term_id : 0;
$related        = array();
if ( $primary_cat_id ) {
    $related = get_posts( array(
        'post_type'      => 'article',
        'posts_per_page' => 3,
        'post__not_in'   => array( get_the_ID() ),
        'category'       => $primary_cat_id,
        'orderby'        => 'date',
        'order'          => 'DESC',
    ) );
}
if ( count( $related ) < 3 ) {
    $exclude = array_merge( array( get_the_ID() ), wp_list_pluck( $related, 'ID' ) );
    $related = array_merge( $related, get_posts( array(
        'post_type'      => 'article',
        'posts_per_page' => 3 - count( $related ),
        'post__not_in'   => $exclude,
        'orderby'        => 'date',
        'order'          => 'DESC',
    ) ) );
}
if ( ! empty( $related ) ) : ?>
<section class="py-12 sm:py-16 bg-white">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter mb-8 text-center">More from the blog</h2>
 <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 <?php foreach ( $related as $post ) : setup_postdata( $post );
 $rthumb = get_the_post_thumbnail_url( $post->ID, 'medium' );
 $rimg   = $rthumb ? $rthumb : get_template_directory_uri() . '/images/homepage/after.jpg'; ?>
 <a href="<?php echo esc_url( get_permalink( $post->ID ) ); ?>" class="bg-surface-container-low rounded-xl overflow-hidden hover:shadow-lg transition-all group">
 <div class="aspect-16/9 overflow-hidden">
 <?php
 if ( has_post_thumbnail( $post->ID ) ) {
     echo wp_get_attachment_image( get_post_thumbnail_id( $post->ID ), 'full', false, array(
         'class'    => 'w-full h-full object-cover group-hover:scale-105 transition-transform',
         'alt'      => get_the_title( $post->ID ),
         'loading'  => 'lazy',
         'decoding' => 'async',
         'sizes'    => '(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw',
     ) );
 } else { ?>
 <img src="<?php echo esc_url( $rimg ); ?>" alt="<?php echo esc_attr( get_the_title( $post->ID ) ); ?>" class="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
 <?php } ?>
 </div>
 <div class="p-5">
 <h3 class="font-bold text-primary group-hover:text-primary-soft transition-colors mb-2"><?php echo esc_html( get_the_title( $post->ID ) ); ?></h3>
 <p class="text-xs text-secondary"><?php echo esc_html( get_the_excerpt( $post->ID ) ); ?></p>
 <p class="text-xs text-secondary mt-3 flex items-center gap-1">
 <span class="material-symbols-outlined text-sm" aria-hidden="true">schedule</span>
 <?php echo (int) timeless_article_reading_time( $post->ID ); ?> min read
 </p>
 </div>
 </a>
 <?php endforeach; wp_reset_postdata(); ?>
 </div>
 </div>
</section>
<?php endif; ?>

</main>

<?php get_footer(); ?>
