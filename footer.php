<?php
/**
 * Theme Footer, Shared across all pages
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
                <?php // TR monogram above the name; renders only once images/brand/tr-mark.png exists (drop pending from Allan 2026-06-11)
                if ( file_exists( get_template_directory() . '/images/brand/tr-mark.png' ) ) : ?>
                <img src="<?php echo get_template_directory_uri(); ?>/images/brand/tr-mark.png" alt="Timeless Resurfacing TR logo" class="block mb-2" width="160" height="160" style="height:160px;width:auto;filter:drop-shadow(1.5px 0 0 #fff) drop-shadow(-1.5px 0 0 #fff) drop-shadow(0 1.5px 0 #fff) drop-shadow(0 -1.5px 0 #fff);" loading="lazy" />
                <?php endif; ?>
                <span class="text-2xl font-black tracking-tighter text-white block mb-4">Timeless Resurfacing</span>
                <p class="text-sm text-white/60 leading-relaxed max-w-xs">Revive, Restore, Renew. Sydney&rsquo;s bathroom resurfacing specialists.</p>
            </div>
            <!-- Quick Links -->
            <div>
                <h3 class="font-bold text-white mb-4 text-sm">Quick Links</h3>
                <ul class="space-y-2.5 text-sm">
                    <li><a class="text-white/60 hover:text-white transition-colors" href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a></li>
                    <li><a class="text-white/60 hover:text-white transition-colors" href="<?php echo esc_url( home_url( '/gallery/' ) ); ?>">Gallery</a></li>
                    <li><a class="text-white/60 hover:text-white transition-colors" href="<?php echo esc_url( home_url( '/warranty/' ) ); ?>">Warranty</a></li>
                    <li><a class="text-white/60 hover:text-white transition-colors" href="<?php echo esc_url( home_url( '/care-instructions/' ) ); ?>">Care Instructions</a></li>
                    <li><a class="text-white/60 hover:text-white transition-colors" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact Us</a></li>
                    <li><a class="text-white/60 hover:text-white transition-colors" href="<?php echo esc_url( home_url( '/privacy/' ) ); ?>">Privacy Policy</a></li>
                    <li><a class="text-white/60 hover:text-white transition-colors" href="<?php echo esc_url( home_url( '/terms/' ) ); ?>">Terms of Service</a></li>
                </ul>
            </div>
            <!-- Services -->
            <div>
                <h3 class="font-bold text-white mb-4 text-sm">Services</h3>
                <ul class="space-y-2.5 text-sm">
                    <li><a class="text-white/60 hover:text-white transition-colors" href="<?php echo esc_url( home_url( '/services/bath-resurfacing/' ) ); ?>">Bath Resurfacing</a></li>
                    <li><a class="text-white/60 hover:text-white transition-colors" href="<?php echo esc_url( home_url( '/services/tile-resurfacing/' ) ); ?>">Tile Resurfacing</a></li>
                    <li><a class="text-white/60 hover:text-white transition-colors" href="<?php echo esc_url( home_url( '/services/shower-regrouting/' ) ); ?>">Shower Regrouting</a></li>
                    <li><a class="text-white/60 hover:text-white transition-colors" href="<?php echo esc_url( home_url( '/services/shower-leak-repair/' ) ); ?>">Shower Sealing</a></li>
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
                <?php
                /* Social links. These already fed the LocalBusiness sameAs, but sameAs is
                   invisible to a human — Allan looked for them on the page and they were not
                   there. Same source of truth as the schema, so the two can never disagree. */
                $tr_socials = array(
                    'Facebook'  => get_theme_mod( 'timeless_facebook_url',  'https://www.facebook.com/profile.php?id=61591270018516' ),
                    'Instagram' => get_theme_mod( 'timeless_instagram_url', 'https://www.instagram.com/timelessresurfacing/' ),
                );
                $tr_socials = array_filter( $tr_socials );
                if ( $tr_socials ) : ?>
                <div class="flex items-center gap-3 mt-6">
                    <?php foreach ( $tr_socials as $tr_label => $tr_url ) : ?>
                    <a href="<?php echo esc_url( $tr_url ); ?>" target="_blank" rel="noopener"
                       class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                       aria-label="Timeless Resurfacing on <?php echo esc_attr( $tr_label ); ?>">
                        <?php if ( 'Facebook' === $tr_label ) : ?>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="text-white" aria-hidden="true"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94z"/></svg>
                        <?php else : ?>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="text-white" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.24a6.6 6.6 0 1 0 0 13.2 6.6 6.6 0 0 0 0-13.2zm0 10.88a4.28 4.28 0 1 1 0-8.56 4.28 4.28 0 0 1 0 8.56zm8.4-11.14a1.54 1.54 0 1 1-3.08 0 1.54 1.54 0 0 1 3.08 0z"/></svg>
                        <?php endif; ?>
                    </a>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>
                <p class="text-xs text-white/60 mt-6">&copy; <?php echo date( 'Y' ); ?> Timeless Resurfacing.<br>All Rights Reserved.</p>
            </div>
        </div>
        <!-- ACL Compliance Statement -->
        <div class="border-t border-white/10 pt-6 mt-6">
            <p class="text-[11px] text-white/50 leading-relaxed text-center max-w-3xl mx-auto">Our services come with consumer guarantees that cannot be excluded under the Australian Consumer Law. Any warranty we provide is in addition to your statutory rights, not a replacement.</p>
        </div>
    </div>
</footer>

<!-- Mobile sticky CTA bar removed 2026-05-05 per Allan: blocking content + duplicate CTA (each page already has Get Quote + phone in nav + footer + section CTAs) -->

<?php
// GHL chat widget (SMS-chat mode) — renders ONLY when a widget ID is set in the Customizer.
// Activation: docs/specs/ai-employees/social-agents-activation-runbook-2026-07-07.md (Agent B).
$timeless_chat_id = get_theme_mod( 'timeless_chat_widget_id', '' );
if ( $timeless_chat_id ) : ?>
<script src="https://widgets.leadconnectorhq.com/loader.js"
        data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
        data-widget-id="<?php echo esc_attr( $timeless_chat_id ); ?>" defer></script>
<?php endif; ?>

<?php wp_footer(); ?>
</body>
</html>
