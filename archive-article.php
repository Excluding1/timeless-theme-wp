<?php
/**
 * Article archive — blog index at /blog/.
 *
 * Also handles:
 *   - Category archives at /blog/category/{slug}/
 *   - Tag archives at /blog/tag/{slug}/
 *
 * Renders:
 *   - Breadcrumbs (deeper for category/tag archives)
 *   - Category filter pills (always show all 5+ starter categories)
 *   - Article card grid with featured image + excerpt + category badge
 *   - Pagination
 *   - CollectionPage schema for SEO
 */

get_header();

// Determine archive context
$current_category = get_queried_object();
$is_category      = is_category();
$is_tag           = is_tag();

if ( $is_category && $current_category ) {
    $page_title       = $current_category->name;
    $page_description = $current_category->description ?: 'Articles in ' . $current_category->name;
    $breadcrumb_label = $current_category->name;
} elseif ( $is_tag && $current_category ) {
    $page_title       = $current_category->name;
    $page_description = $current_category->description ?: 'Articles tagged with ' . $current_category->name;
    $breadcrumb_label = '#' . $current_category->name;
} else {
    $page_title       = 'Bathroom Resurfacing Blog';
    $page_description = "Real advice from Sydney's bathroom resurfacing experts. Tips, before/after stories, and answers to questions homeowners ask us most.";
    $breadcrumb_label = '';
}

// Get all categories for the filter pills (excluding default "Uncategorized")
$all_categories = get_categories( array(
    'taxonomy'   => 'category',
    'hide_empty' => false,
    'orderby'    => 'name',
    'order'      => 'ASC',
    'exclude'    => array( get_option( 'default_category' ) ),  // skip "Uncategorized"
) );
?>

<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "CollectionPage",
 "name": <?php echo wp_json_encode( $page_title ); ?>,
 "description": <?php echo wp_json_encode( $page_description ); ?>,
 "url": "<?php echo esc_url( $is_category || $is_tag ? get_term_link( $current_category ) : home_url( '/blog/' ) ); ?>",
 "publisher": {
 "@type": "Organization",
 "name": "Timeless Resurfacing",
 "url": "https://timelessresurfacing.com.au"
 }
}
</script>

<script type="application/ld+json">
{
 "@context": "https://schema.org", "@type": "BreadcrumbList",
 "itemListElement": [
 { "@type": "ListItem", "position": 1, "name": "Home", "item": "<?php echo esc_url( home_url( '/' ) ); ?>" },
 { "@type": "ListItem", "position": 2, "name": "Blog", "item": "<?php echo esc_url( home_url( '/blog/' ) ); ?>" }
 <?php if ( $is_category || $is_tag ) : ?>
 ,{ "@type": "ListItem", "position": 3, "name": <?php echo wp_json_encode( $page_title ); ?>, "item": "<?php echo esc_url( get_term_link( $current_category ) ); ?>" }
 <?php endif; ?>
 ]
}
</script>

<main id="main-content">

<!-- BREADCRUMB -->
<div class="pt-24 pb-2 px-6 sm:px-8 max-w-7xl mx-auto">
 <nav class="text-xs text-secondary" aria-label="Breadcrumb">
 <ol class="flex items-center gap-1 flex-wrap">
 <li><a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="hover:text-primary transition-colors">Home</a></li>
 <li><span class="mx-1">/</span></li>
 <?php if ( $is_category || $is_tag ) : ?>
 <li><a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>" class="hover:text-primary transition-colors">Blog</a></li>
 <li><span class="mx-1">/</span></li>
 <li class="text-primary font-medium"><?php echo esc_html( $breadcrumb_label ); ?></li>
 <?php else : ?>
 <li class="text-primary font-medium">Blog</li>
 <?php endif; ?>
 </ol>
 </nav>
</div>

<!-- HEADER -->
<section class="pt-4 pb-8 sm:pb-10 bg-surface">
 <div class="max-w-4xl mx-auto px-6 sm:px-8 text-center">
 <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.7rem] font-bold tracking-widest uppercase rounded-sm mb-6">
 <?php echo $is_category ? 'Category' : ( $is_tag ? 'Tag' : 'Tips & Guides' ); ?>
 </span>
 <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tighter leading-[1.05] mb-4"><?php echo esc_html( $page_title ); ?></h1>
 <p class="text-base sm:text-lg text-secondary leading-relaxed max-w-2xl mx-auto"><?php echo esc_html( $page_description ); ?></p>
 </div>
</section>

<!-- CATEGORY FILTER PILLS - REMOVED 2026-08-20 (Allan).
     A sticky bar of six category pills sat above the article list while most of those
     categories held zero posts, so it read as an empty filing system rather than a
     filter. It only earns its place once there are enough articles per category to be
     worth narrowing. The original markup is preserved below, commented, so it is a
     paste-back rather than a rebuild when that day comes.

<!- - CATEGORY FILTER PILLS - ->
<?php if ( ! empty( $all_categories ) ) : ?>
<section class="py-6 bg-surface border-b border-surface-container sticky top-16 z-30 backdrop-blur-sm bg-surface/95">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <nav class="flex gap-2 overflow-x-auto scrollbar-hide -mx-2 px-2" aria-label="Article categories">
 <a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>"
 class="<?php echo ( ! $is_category && ! $is_tag ) ? 'bg-primary text-white' : 'bg-surface-container-high text-secondary hover:bg-primary hover:text-white'; ?> px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0">
 All Articles
 </a>
 <?php foreach ( $all_categories as $cat ) : ?>
 <?php
 $is_active = $is_category && $current_category && $cat->term_id === $current_category->term_id;
 $cls       = $is_active ? 'bg-primary text-white' : 'bg-surface-container-high text-secondary hover:bg-primary hover:text-white';
 ?>
 <a href="<?php echo esc_url( get_category_link( $cat->term_id ) ); ?>"
 class="<?php echo $cls; ?> px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0">
 <?php echo esc_html( $cat->name ); ?>
 <?php if ( $cat->count > 0 ) : ?>
 <span class="ml-1 opacity-60"><?php echo (int) $cat->count; ?></span>
 <?php endif; ?>
 </a>
 <?php endforeach; ?>
 </nav>
 </div>
</section>
-->

<?php endif; ?>


<!-- ARTICLE GRID — single column, no sidebar. Archive is a browsing
     experience; conversion CTAs live on single article pages where
     reader intent is higher. -->
<section class="py-12 sm:py-16 bg-white">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <?php if ( have_posts() ) : ?>

 <?php
 // FEATURED LATEST POST — full-width card (image left / text right) above
 // the grid, page 1 only. Consumes the first post of the loop so the grid
 // below starts at the second.
 if ( ! is_paged() ) :
     the_post();
     $fthumb = get_the_post_thumbnail_url( get_the_ID(), 'large' );
     $fimg   = $fthumb ? $fthumb : get_template_directory_uri() . '/images/homepage/after.jpg';
     $fcats  = get_the_category();
     $fcat   = ! empty( $fcats ) ? $fcats[0] : null;
 ?>
 <a href="<?php the_permalink(); ?>" class="grid grid-cols-1 md:grid-cols-2 bg-surface-container-low rounded-2xl overflow-hidden hover:shadow-lg transition-all group mb-10">
 <div class="relative overflow-hidden" style="min-height:240px;">
 <?php
 /* srcset, not a lone src. These cards were serving one fixed size with no srcset at
    all, so a 2x screen got roughly half the pixels it asked for and the covers looked
    soft next to the article heroes. The featured card image is half the max-w-7xl
    container from md up, full width below. */
 if ( has_post_thumbnail() ) {
     echo wp_get_attachment_image( get_post_thumbnail_id(), 'full', false, array(
         'class'    => 'absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform',
         'alt'      => get_the_title(),
         'loading'  => 'eager',
         'decoding' => 'async',
         'sizes'    => '(min-width: 768px) 608px, 100vw',
     ) );
 } else { ?>
 <img src="<?php echo esc_url( $fimg ); ?>" alt="<?php echo esc_attr( get_the_title() ); ?>" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" loading="eager" />
 <?php } ?>
 </div>
 <div class="p-8 sm:p-10 flex flex-col justify-center">
 <div class="flex items-center gap-2 mb-4">
 <span class="inline-block py-0.5 px-2 text-[0.6rem] font-bold tracking-widest uppercase rounded-sm" style="background:#e7c08b;color:#041534;">Latest</span>
 <?php if ( $fcat ) : ?>
 <span class="inline-block py-0.5 px-2 bg-tertiary-fixed text-on-tertiary-fixed text-[0.6rem] font-bold tracking-widest uppercase rounded-sm"><?php echo esc_html( $fcat->name ); ?></span>
 <?php endif; ?>
 </div>
 <h2 class="text-2xl sm:text-3xl font-extrabold text-primary group-hover:text-primary-soft transition-colors tracking-tighter leading-tight mb-3"><?php the_title(); ?></h2>
 <p class="text-sm sm:text-base text-secondary leading-relaxed mb-4"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 32 ) ); ?></p>
 <div class="flex items-center gap-2 text-xs text-secondary">
 <span class="material-symbols-outlined text-sm" aria-hidden="true">schedule</span>
 <time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
 <span class="text-secondary/50">·</span>
 <span><?php echo (int) timeless_article_reading_time(); ?> min read</span>
 </div>
 </div>
 </a>
 <?php endif; ?>

 <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
 <?php while ( have_posts() ) : the_post();
 $thumb = get_the_post_thumbnail_url( get_the_ID(), 'medium_large' );
 $cats  = get_the_category();
 $cat   = ! empty( $cats ) ? $cats[0] : null;
 ?>
 <?php $card_img = $thumb ? $thumb : get_template_directory_uri() . '/images/homepage/after.jpg'; // fallback so cards never render bare ?>
 <a href="<?php the_permalink(); ?>" class="bg-surface-container-low rounded-xl overflow-hidden hover:shadow-lg transition-all group block">
 <div class="aspect-16/9 overflow-hidden">
 <?php
 if ( has_post_thumbnail() ) {
     echo wp_get_attachment_image( get_post_thumbnail_id(), 'full', false, array(
         'class'    => 'w-full h-full object-cover group-hover:scale-105 transition-transform',
         'alt'      => get_the_title(),
         'loading'  => 'lazy',
         'decoding' => 'async',
         'sizes'    => '(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw',
     ) );
 } else { ?>
 <img src="<?php echo esc_url( $card_img ); ?>" alt="<?php echo esc_attr( get_the_title() ); ?>" class="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
 <?php } ?>
 </div>
 <div class="p-6">
 <?php if ( $cat ) : ?>
 <span class="inline-block py-0.5 px-2 bg-tertiary-fixed text-on-tertiary-fixed text-[0.6rem] font-bold tracking-widest uppercase rounded-sm mb-3"><?php echo esc_html( $cat->name ); ?></span>
 <?php endif; ?>
 <h2 class="text-lg font-bold text-primary group-hover:text-primary-soft transition-colors mb-2 leading-tight"><?php the_title(); ?></h2>
 <p class="text-sm text-secondary leading-relaxed mb-3"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 20 ) ); ?></p>
 <div class="flex items-center gap-2 text-xs text-secondary">
 <span class="material-symbols-outlined text-sm" aria-hidden="true">schedule</span>
 <time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
 <span class="text-secondary/50">·</span>
 <span><?php echo (int) timeless_article_reading_time(); ?> min read</span>
 </div>
 </div>
 </a>
 <?php endwhile; ?>
 </div>

 <?php
 the_posts_pagination( array(
     'mid_size'  => 1,
     'prev_text' => '← Previous',
     'next_text' => 'Next →',
 ) );
 ?>
 <?php else : ?>
 <div class="text-center py-16 max-w-xl mx-auto">
 <span class="material-symbols-outlined text-6xl text-primary/30 mb-4 block" aria-hidden="true">article</span>
 <h2 class="text-xl font-bold text-primary mb-3">
 <?php echo $is_category ? 'No articles in this category yet' : ( $is_tag ? 'No articles with this tag yet' : 'No articles published yet' ); ?>
 </h2>
 <p class="text-sm text-secondary mb-6">Check back soon for new content. Or explore other categories above.</p>
 <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="inline-block px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all">← Back to home</a>
 </div>
 <?php endif; ?>
 </div>
</section>

</main>

<?php get_footer(); ?>
