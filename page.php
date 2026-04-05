<?php
/**
 * Default page template — used when no custom template is assigned.
 *
 * @package Timeless
 */

get_header();
?>

<section class="pt-32 pb-20 bg-surface">
    <div class="max-w-4xl mx-auto px-6 sm:px-8">
        <?php while ( have_posts() ) : the_post(); ?>
            <h1 class="text-4xl font-extrabold text-primary mb-8"><?php the_title(); ?></h1>
            <div class="prose prose-lg text-secondary leading-relaxed">
                <?php the_content(); ?>
            </div>
        <?php endwhile; ?>
    </div>
</section>

<?php get_footer(); ?>
