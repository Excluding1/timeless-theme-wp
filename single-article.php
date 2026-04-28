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

$author_name    = get_the_author();
$published_iso  = get_the_date( 'c' );
$published_disp = get_the_date();
$modified_iso   = get_the_modified_date( 'c' );
$thumb_url      = get_the_post_thumbnail_url( get_the_ID(), 'large' );
$canonical      = get_permalink();
$categories     = get_the_category();
$cat_name       = ! empty( $categories ) ? $categories[0]->name : '';
?>

<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "BlogPosting",
 "headline": "<?php echo esc_js( get_the_title() ); ?>",
 "description": "<?php echo esc_js( get_the_excerpt() ); ?>",
 <?php if ( $thumb_url ) : ?>"image": "<?php echo esc_url( $thumb_url ); ?>",<?php endif; ?>
 "author": { "@type": "Organization", "name": "Timeless Resurfacing" },
 "publisher": {
 "@type": "Organization",
 "name": "Timeless Resurfacing",
 "url": "https://timelessresurfacing.com.au",
 "logo": { "@type": "ImageObject", "url": "<?php echo esc_url( get_template_directory_uri() . '/assets/favicon/favicon-96x96.png' ); ?>" }
 },
 "datePublished": "<?php echo esc_js( $published_iso ); ?>",
 "dateModified": "<?php echo esc_js( $modified_iso ); ?>",
 "mainEntityOfPage": "<?php echo esc_js( $canonical ); ?>"
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
<header class="pt-4 pb-12 px-6 sm:px-8 max-w-4xl mx-auto">
 <?php if ( $cat_name ) : ?>
 <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.7rem] font-bold tracking-widest uppercase rounded-sm mb-4"><?php echo esc_html( $cat_name ); ?></span>
 <?php endif; ?>

 <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tighter leading-[1.05] mb-6">
 <?php the_title(); ?>
 </h1>

 <div class="flex items-center gap-3 text-sm text-secondary mb-8">
 <span class="material-symbols-outlined text-base" aria-hidden="true">schedule</span>
 <time datetime="<?php echo esc_attr( $published_iso ); ?>"><?php echo esc_html( $published_disp ); ?></time>
 <span class="text-secondary/50">·</span>
 <span class="material-symbols-outlined text-base" aria-hidden="true">person</span>
 <span><?php echo esc_html( $author_name ); ?></span>
 </div>

 <?php if ( $thumb_url ) : ?>
 <div class="rounded-2xl overflow-hidden shadow-md aspect-16/9 mb-8">
 <img src="<?php echo esc_url( $thumb_url ); ?>" alt="<?php echo esc_attr( get_the_title() ); ?>" class="w-full h-full object-cover" loading="eager" />
 </div>
 <?php endif; ?>
</header>

<!-- ARTICLE BODY -->
<?php
// Pre-render content so we can inspect TOC items before deciding layout
$content_html = apply_filters( 'the_content', get_the_content() );
$toc_items    = $GLOBALS['timeless_toc_items'] ?? array();
$show_toc     = count( $toc_items ) >= 3;
?>
<div class="px-6 sm:px-8 max-w-7xl mx-auto pb-16">
 <?php if ( $show_toc ) : ?>
 <!-- 2-column layout: TOC sidebar + article content -->
 <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">
 <!-- TOC Sidebar -->
 <aside class="lg:sticky lg:top-24 lg:self-start order-2 lg:order-1">
 <!-- Mobile: collapsible -->
 <details class="lg:hidden bg-surface-container-low rounded-xl p-5 mb-6">
 <summary class="font-bold text-primary text-sm cursor-pointer flex items-center justify-between">
 <span class="flex items-center gap-2">
 <span class="material-symbols-outlined text-base" aria-hidden="true">format_list_bulleted</span>
 On this page
 </span>
 <span class="material-symbols-outlined text-base" aria-hidden="true">expand_more</span>
 </summary>
 <ul class="mt-4 space-y-2">
 <?php foreach ( $toc_items as $item ) : ?>
 <li><a href="#<?php echo esc_attr( $item['slug'] ); ?>" class="text-sm text-secondary hover:text-primary block py-1 leading-snug"><?php echo esc_html( $item['text'] ); ?></a></li>
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
 <a href="#<?php echo esc_attr( $item['slug'] ); ?>" class="text-sm text-secondary hover:text-primary block pl-4 -ml-0.5 border-l-2 border-transparent hover:border-primary leading-snug py-1 transition-colors">
 <?php echo esc_html( $item['text'] ); ?>
 </a>
 </li>
 <?php endforeach; ?>
 </ul>
 </nav>
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

<!-- BACK TO BLOG + CTA -->
<section class="py-12 sm:py-16 bg-surface-container-low border-t border-surface-container">
 <div class="max-w-4xl mx-auto px-6 sm:px-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
 <a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>" class="group flex items-center gap-3 bg-white rounded-xl p-6 hover:shadow-lg transition-all">
 <span class="material-symbols-outlined text-2xl text-primary shrink-0 group-hover:-translate-x-1 transition-transform" aria-hidden="true">arrow_back</span>
 <div>
 <span class="font-bold text-primary block">All articles</span>
 <span class="text-xs text-secondary">Back to the blog</span>
 </div>
 </a>
 <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" class="group flex items-center gap-3 bg-primary text-white rounded-xl p-6 hover:shadow-lg transition-all">
 <span class="material-symbols-outlined text-2xl shrink-0" aria-hidden="true">request_quote</span>
 <div>
 <span class="font-bold block">Get a free quote</span>
 <span class="text-xs text-white/70">Photos to fixed-price in hours</span>
 </div>
 <span class="material-symbols-outlined text-xl ml-auto group-hover:translate-x-1 transition-transform" aria-hidden="true">arrow_forward</span>
 </a>
 </div>
</section>

<!-- RELATED ARTICLES -->
<?php
$related = get_posts( array(
    'post_type'      => 'article',
    'posts_per_page' => 3,
    'post__not_in'   => array( get_the_ID() ),
    'orderby'        => 'rand',
) );
if ( ! empty( $related ) ) : ?>
<section class="py-12 sm:py-16 bg-white">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter mb-8 text-center">More from the blog</h2>
 <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 <?php foreach ( $related as $post ) : setup_postdata( $post );
 $rthumb = get_the_post_thumbnail_url( $post->ID, 'medium' ); ?>
 <a href="<?php echo esc_url( get_permalink( $post->ID ) ); ?>" class="bg-surface-container-low rounded-xl overflow-hidden hover:shadow-lg transition-all group">
 <?php if ( $rthumb ) : ?>
 <div class="aspect-16/9 overflow-hidden">
 <img src="<?php echo esc_url( $rthumb ); ?>" alt="<?php echo esc_attr( get_the_title( $post->ID ) ); ?>" class="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
 </div>
 <?php endif; ?>
 <div class="p-5">
 <h3 class="font-bold text-primary group-hover:text-primary-soft transition-colors mb-2"><?php echo esc_html( get_the_title( $post->ID ) ); ?></h3>
 <p class="text-xs text-secondary"><?php echo esc_html( get_the_excerpt( $post->ID ) ); ?></p>
 </div>
 </a>
 <?php endforeach; wp_reset_postdata(); ?>
 </div>
 </div>
</section>
<?php endif; ?>

</main>

<?php get_footer(); ?>
