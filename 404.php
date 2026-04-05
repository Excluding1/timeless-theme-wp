<?php
/**
 * 404 Error page
 *
 * @package Timeless
 */

get_header();
?>

<section class="pt-32 pb-20 bg-surface min-h-[70vh] flex items-center">
    <div class="max-w-4xl mx-auto px-6 sm:px-8 text-center">
        <span class="material-symbols-outlined text-8xl text-primary/20 block mb-6" aria-hidden="true">search_off</span>
        <h1 class="text-5xl font-extrabold text-primary mb-4">Page Not Found</h1>
        <p class="text-secondary text-lg mb-8 max-w-lg mx-auto">Sorry, we couldn't find the page you're looking for. It may have moved or no longer exists.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a class="px-8 py-4 bg-primary text-white font-bold rounded-lg hover:shadow-xl transition-all" href="<?php echo esc_url( home_url( '/' ) ); ?>">Back to Homepage</a>
            <a class="px-8 py-4 bg-surface-container-high text-primary font-bold rounded-lg hover:bg-surface-container-highest transition-all" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact Us</a>
        </div>
        <div class="mt-12 pt-8 border-t border-surface-container">
            <p class="text-sm text-secondary mb-4">Looking for one of these?</p>
            <div class="flex flex-wrap justify-center gap-3">
                <a class="text-xs bg-surface-container-low px-4 py-2 rounded-lg text-primary font-medium hover:bg-primary hover:text-white transition-all" href="<?php echo esc_url( home_url( '/services/shower-regrouting-sydney/' ) ); ?>">Shower Regrouting</a>
                <a class="text-xs bg-surface-container-low px-4 py-2 rounded-lg text-primary font-medium hover:bg-primary hover:text-white transition-all" href="<?php echo esc_url( home_url( '/services/bath-resurfacing-sydney/' ) ); ?>">Bath Resurfacing</a>
                <a class="text-xs bg-surface-container-low px-4 py-2 rounded-lg text-primary font-medium hover:bg-primary hover:text-white transition-all" href="<?php echo esc_url( home_url( '/services/tile-resurfacing-sydney/' ) ); ?>">Tile Resurfacing</a>
                <a class="text-xs bg-surface-container-low px-4 py-2 rounded-lg text-primary font-medium hover:bg-primary hover:text-white transition-all" href="<?php echo esc_url( home_url( '/gallery/' ) ); ?>">Before &amp; After Gallery</a>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>
