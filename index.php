<?php
/**
 * Default template — WordPress requires this file.
 * Redirects to homepage since this is a page-based site (no blog).
 *
 * @package Timeless
 */

get_header();
?>

<section class="pt-32 pb-20 bg-surface">
    <div class="max-w-4xl mx-auto px-6 sm:px-8 text-center">
        <h1 class="text-4xl font-extrabold text-primary mb-6">Timeless Resurfacing</h1>
        <p class="text-secondary text-lg mb-8">Sydney's bathroom resurfacing specialists.</p>
        <a class="px-8 py-4 bg-primary text-white font-bold rounded-lg hover:shadow-xl transition-all inline-block" href="<?php echo esc_url( home_url( '/' ) ); ?>">Go to Homepage</a>
    </div>
</section>

<?php get_footer(); ?>
