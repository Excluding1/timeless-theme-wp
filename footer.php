<?php
/**
 * Theme Footer — Shared across all pages
 *
 * @package Timeless
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$phone_link = timeless_phone_link();
$phone      = timeless_phone();
?>

</main>

<!-- FOOTER -->
<footer class="bg-primary pt-14 pb-8">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-12">
            <!-- Brand -->
            <div class="col-span-2 md:col-span-1">
                <span class="text-2xl font-black tracking-tighter text-white block mb-4">Timeless Resurfacing</span>
                <p class="text-sm text-white/60 leading-relaxed max-w-xs">Revive, Restore, Renew. Sydney&rsquo;s bathroom resurfacing specialists.</p>
            </div>
            <!-- Quick Links -->
            <div>
                <h3 class="font-bold text-white mb-4 text-sm">Quick Links</h3>
                <ul class="space-y-2.5 text-sm">
                    <li><a class="text-white/60 hover:text-white transition-colors" href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a></li>
                    <li><a class="text-white/60 hover:text-white transition-colors" href="<?php echo esc_url( home_url( '/gallery/' ) ); ?>">Gallery</a></li>
                    <li><a class="text-white/60 hover:text-white transition-colors" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact Us</a></li>
                    <li><a class="text-white/60 hover:text-white transition-colors" href="<?php echo esc_url( home_url( '/privacy/' ) ); ?>">Privacy Policy</a></li>
                </ul>
            </div>
            <!-- Services -->
            <div>
                <h3 class="font-bold text-white mb-4 text-sm">Services</h3>
                <ul class="space-y-2.5 text-sm">
                    <li><a class="text-white/60 hover:text-white transition-colors" href="<?php echo esc_url( home_url( '/services/bath-resurfacing-sydney/' ) ); ?>">Bath Resurfacing</a></li>
                    <li><a class="text-white/60 hover:text-white transition-colors" href="<?php echo esc_url( home_url( '/services/tile-resurfacing-sydney/' ) ); ?>">Tile Resurfacing</a></li>
                    <li><a class="text-white/60 hover:text-white transition-colors" href="<?php echo esc_url( home_url( '/services/shower-regrouting-sydney/' ) ); ?>">Shower Regrouting</a></li>
                    <li><a class="text-white/60 hover:text-white transition-colors" href="<?php echo esc_url( home_url( '/services/shower-leak-repair-sydney/' ) ); ?>">Shower Sealing</a></li>
                </ul>
            </div>
            <!-- Useful Information -->
            <div>
                <h3 class="font-bold text-white mb-4 text-sm">Useful Information</h3>
                <ul class="space-y-3">
                    <li class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-white/70 text-lg" aria-hidden="true">mail</span>
                        <a href="mailto:<?php echo timeless_email(); ?>" class="text-sm text-white/60 hover:text-white transition-colors"><?php echo timeless_email(); ?></a>
                    </li>
                    <li class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-white/70 text-lg" aria-hidden="true">call</span>
                        <a href="tel:<?php echo $phone_link; ?>" class="text-sm text-white/60 hover:text-white transition-colors"><?php echo $phone; ?></a>
                    </li>
                </ul>
                <p class="text-xs text-white/60 mt-6">&copy; <?php echo date( 'Y' ); ?> Timeless Resurfacing.<br>All Rights Reserved.</p>
            </div>
        </div>
    </div>
</footer>


<?php wp_footer(); ?>
</body>
</html>
