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
<footer class="bg-[#1B2A4A] pt-16 pb-8 text-white text-sm">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 px-6 sm:px-8 max-w-7xl mx-auto">
        <div>
            <span class="text-xl font-bold block mb-4">Timeless Resurfacing</span>
            <p class="text-slate-300 text-xs mb-6 max-w-xs leading-relaxed">Sydney's bathroom resurfacing specialists. Trade qualified, fully insured, locally owned.</p>
            <p class="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest">Fully Insured</p>
            <p class="text-sm font-bold">Sydney, NSW</p>
        </div>
        <div>
            <h4 class="font-bold text-tertiary-fixed-dim mb-4 uppercase tracking-widest text-[0.65rem]">Resurfacing</h4>
            <ul class="space-y-2 text-xs">
                <li><a class="text-slate-300 hover:text-white" href="<?php echo esc_url( home_url( '/services/bath-resurfacing-sydney/' ) ); ?>">Bath Resurfacing</a></li>
                <li><a class="text-slate-300 hover:text-white" href="<?php echo esc_url( home_url( '/services/tile-resurfacing-sydney/' ) ); ?>">Tile Resurfacing</a></li>
                <li><a class="text-slate-300 hover:text-white" href="<?php echo esc_url( home_url( '/services/vanity-refinishing-sydney/' ) ); ?>">Vanity Refinishing</a></li>
                <li><a class="text-slate-300 hover:text-white" href="<?php echo esc_url( home_url( '/services/basin-restoration-sydney/' ) ); ?>">Basin Restoration</a></li>
            </ul>
            <h4 class="font-bold text-tertiary-fixed-dim mb-3 mt-5 uppercase tracking-widest text-[0.65rem]">Regrouting</h4>
            <ul class="space-y-2 text-xs">
                <li><a class="text-slate-300 hover:text-white" href="<?php echo esc_url( home_url( '/services/shower-regrouting-sydney/' ) ); ?>">Shower Regrouting</a></li>
                <li><a class="text-slate-300 hover:text-white" href="<?php echo esc_url( home_url( '/services/shower-leak-repair-sydney/' ) ); ?>">Shower Sealing</a></li>
                <li><a class="text-slate-300 hover:text-white" href="<?php echo esc_url( home_url( '/services/epoxy-grout-upgrade-sydney/' ) ); ?>">Epoxy Grout Upgrade</a></li>
            </ul>
        </div>
        <div>
            <h4 class="font-bold text-tertiary-fixed-dim mb-4 uppercase tracking-widest text-[0.65rem]">Company</h4>
            <ul class="space-y-2 text-xs">
                <li><a class="text-slate-300 hover:text-white" href="<?php echo esc_url( home_url( '/about/' ) ); ?>">About</a></li>
                <li><a class="text-slate-300 hover:text-white" href="<?php echo esc_url( home_url( '/gallery/' ) ); ?>">Before &amp; After</a></li>
                <li><a class="text-slate-300 hover:text-white" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact</a></li>
                <li><a class="text-slate-300 hover:text-white" href="<?php echo esc_url( home_url( '/areas/' ) ); ?>">Service Areas</a></li>
                <li><a class="text-slate-300 hover:text-white" href="<?php echo esc_url( home_url( '/faqs/' ) ); ?>">FAQs</a></li>
            </ul>
        </div>
        <div>
            <h4 class="font-bold text-tertiary-fixed-dim mb-4 uppercase tracking-widest text-[0.65rem]">Legal</h4>
            <ul class="space-y-2 text-xs">
                <li><a class="text-slate-300 hover:text-white" href="<?php echo esc_url( home_url( '/privacy/' ) ); ?>">Privacy Policy</a></li>
                <li><a class="text-slate-300 hover:text-white" href="#">Terms of Service</a></li>
                <li><a class="text-slate-300 hover:text-white" href="https://www.fairtrading.nsw.gov.au" rel="noopener" target="_blank">NSW Fair Trading</a></li>
            </ul>
            <a href="tel:<?php echo $phone_link; ?>" class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-xs font-bold mt-4"><span class="material-symbols-outlined text-base" aria-hidden="true">call</span> Call Us</a>
        </div>
    </div>
    <div class="max-w-7xl mx-auto px-6 sm:px-8 mt-12 pt-8 border-t border-white/10">
        <p class="text-[0.65rem] text-slate-400 text-center">
            &copy; <?php echo date( 'Y' ); ?> Timeless Resurfacing. Sydney, NSW Australia.
            <span class="mx-2 text-slate-500">&middot;</span>
            ABN <?php echo timeless_abn(); ?>
            <?php if ( timeless_has_licence() ) : ?>
            <span class="mx-2 text-slate-500">&middot;</span>
            NSW Licence <?php echo timeless_licence(); ?>
            <?php endif; ?>
        </p>
        <p class="text-[0.6rem] text-slate-500 text-center mt-2">Our services come with guarantees that cannot be excluded under Australian Consumer Law.</p>
    </div>
</footer>

<!-- MOBILE STICKY CTA -->
<div class="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-lg border-t border-surface-container px-4 py-3 flex gap-3">
    <a href="tel:<?php echo $phone_link; ?>" class="flex-1 py-3 bg-surface-container-high text-primary font-bold rounded-lg text-center text-sm flex items-center justify-center gap-2"><span class="material-symbols-outlined text-base" aria-hidden="true">call</span> Call</a>
    <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" class="flex-1 py-3 bg-primary text-white font-bold rounded-lg text-center text-sm">Free Quote</a>
</div>

<?php wp_footer(); ?>
</body>
</html>
