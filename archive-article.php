<?php
/**
 * Article archive — blog index at /blog/.
 *
 * Lists all published articles in a responsive card grid with category
 * filtering and pagination. Uses featured image + excerpt for each card.
 */
get_header();
?>

<main id="main-content">

<!-- BREADCRUMB -->
<div class="pt-24 pb-2 px-6 sm:px-8 max-w-7xl mx-auto">
 <nav class="text-xs text-secondary" aria-label="Breadcrumb">
 <ol class="flex items-center gap-1">
 <li><a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="hover:text-primary transition-colors">Home</a></li>
 <li><span class="mx-1">/</span></li>
 <li class="text-primary font-medium">Blog</li>
 </ol>
 </nav>
</div>

<!-- HEADER -->
<section class="pt-4 pb-12 sm:pb-16 bg-surface">
 <div class="max-w-4xl mx-auto px-6 sm:px-8 text-center">
 <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.7rem] font-bold tracking-widest uppercase rounded-sm mb-6">Tips & Guides</span>
 <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tighter leading-[1.05] mb-4">Bathroom Resurfacing Blog</h1>
 <p class="text-base sm:text-lg text-secondary leading-relaxed max-w-2xl mx-auto">Real advice from Sydney's bathroom resurfacing experts. Tips, before/after stories, and answers to questions homeowners ask us most.</p>
 </div>
</section>

<!-- ARTICLE GRID -->
<section class="py-12 sm:py-16 bg-white">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <?php if ( have_posts() ) : ?>
 <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
 <?php while ( have_posts() ) : the_post();
 $thumb = get_the_post_thumbnail_url( get_the_ID(), 'medium_large' );
 $cats  = get_the_category();
 $cat   = ! empty( $cats ) ? $cats[0]->name : '';
 ?>
 <a href="<?php the_permalink(); ?>" class="bg-surface-container-low rounded-xl overflow-hidden hover:shadow-lg transition-all group block">
 <?php if ( $thumb ) : ?>
 <div class="aspect-16/9 overflow-hidden">
 <img src="<?php echo esc_url( $thumb ); ?>" alt="<?php echo esc_attr( get_the_title() ); ?>" class="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
 </div>
 <?php else : ?>
 <div class="aspect-16/9 bg-linear-to-br from-primary/10 via-tertiary-fixed/30 to-primary/5 flex items-center justify-center">
 <span class="material-symbols-outlined text-5xl text-primary/40" aria-hidden="true">article</span>
 </div>
 <?php endif; ?>
 <div class="p-6">
 <?php if ( $cat ) : ?>
 <span class="inline-block py-0.5 px-2 bg-tertiary-fixed text-on-tertiary-fixed text-[0.6rem] font-bold tracking-widest uppercase rounded-sm mb-3"><?php echo esc_html( $cat ); ?></span>
 <?php endif; ?>
 <h2 class="text-lg font-bold text-primary group-hover:text-primary-soft transition-colors mb-2 leading-tight"><?php the_title(); ?></h2>
 <p class="text-sm text-secondary leading-relaxed mb-3"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 20 ) ); ?></p>
 <div class="flex items-center gap-2 text-xs text-secondary">
 <span class="material-symbols-outlined text-sm" aria-hidden="true">schedule</span>
 <time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
 </div>
 </div>
 </a>
 <?php endwhile; ?>
 </div>

 <?php
 // Pagination
 the_posts_pagination( array(
     'mid_size'  => 1,
     'prev_text' => '← Previous',
     'next_text' => 'Next →',
     'class'     => 'mt-12 flex justify-center gap-2 text-sm',
 ) );
 ?>
 <?php else : ?>
 <div class="text-center py-12">
 <p class="text-secondary">No articles yet. Check back soon.</p>
 <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="inline-block mt-4 text-primary font-bold hover:text-primary-soft">← Back to home</a>
 </div>
 <?php endif; ?>
 </div>
</section>

</main>

<?php get_footer(); ?>
