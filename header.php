
<?php
/**
 * Theme Header — Shared across all pages
 *
 * @package Timeless
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$phone_link = timeless_phone_link();
$phone      = timeless_phone();
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="scroll-smooth">
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <meta name="geo.region" content="AU-NSW" />
    <meta name="geo.placename" content="Sydney" />
    <meta name="geo.position" content="-33.8688;151.2093" />
    <meta name="ICBM" content="-33.8688, 151.2093" />
    <meta property="og:locale" content="en_AU" />
    <meta property="og:site_name" content="Timeless Resurfacing" />
    <?php wp_head(); ?>
</head>

<body <?php body_class( 'bg-surface text-[#191c1e] font-body' ); ?>>
<?php wp_body_open(); ?>

<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">Skip to content</a>

<!-- NAV -->
<header>
    <nav class="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl shadow-sm" id="main-nav">
        <div class="flex justify-between items-center px-6 sm:px-8 py-4 max-w-7xl mx-auto">
            <a class="text-2xl font-black tracking-tighter text-[#1B2A4A]" href="<?php echo esc_url( home_url( '/' ) ); ?>">Timeless Resurfacing</a>
            <div class="hidden lg:flex items-center space-x-8 font-medium text-sm">
                <button id="services-btn" class="text-slate-500 hover:text-[#1B2A4A] transition-colors flex items-center gap-1 py-2" onmouseenter="showMega()" onclick="toggleMega()">Services <span class="material-symbols-outlined text-sm" aria-hidden="true">expand_more</span></button>
                <a class="text-slate-500 hover:text-[#1B2A4A] transition-colors" href="<?php echo esc_url( home_url( '/gallery/' ) ); ?>">Before &amp; After</a>
                <a class="text-slate-500 hover:text-[#1B2A4A] transition-colors" href="<?php echo esc_url( home_url( '/areas/' ) ); ?>">Service Areas</a>
                <a class="text-slate-500 hover:text-[#1B2A4A] transition-colors" href="<?php echo esc_url( home_url( '/about/' ) ); ?>">About</a>
                <a class="text-slate-500 hover:text-[#1B2A4A] transition-colors" href="<?php echo esc_url( home_url( '/faqs/' ) ); ?>">FAQs</a>
                <a class="bg-primary text-white px-6 py-2.5 rounded-lg font-bold hover:opacity-90 transition-all" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Get a Free Quote</a>
            </div>
            <button id="menu-btn" class="lg:hidden p-2" aria-label="Open menu"><span class="material-symbols-outlined text-2xl text-primary">menu</span></button>
        </div>

        <!-- MEGA MENU -->
        <div id="mega-menu" class="mega-dropdown bg-white border-t border-surface-container shadow-xl" onmouseenter="showMega()" onmouseleave="hideMega()">
            <div class="max-w-7xl mx-auto px-6 sm:px-8 py-6 grid grid-cols-3 gap-8">
                <!-- Resurfacing -->
                <div>
                    <h3 class="text-xs font-bold text-primary uppercase tracking-widest mb-3 pb-2 border-b-2 border-tertiary-fixed-dim flex items-center gap-2"><span class="material-symbols-outlined text-sm text-tertiary-fixed-dim" aria-hidden="true">format_paint</span> Resurfacing</h3>
                    <div class="space-y-0.5">
                        <a class="block px-3 py-2 rounded-lg text-sm hover:bg-surface-container-low transition-colors" href="<?php echo esc_url( home_url( '/services/bath-resurfacing-sydney/' ) ); ?>"><span class="font-semibold text-primary block">Bath Resurfacing</span><span class="text-xs text-secondary">Restore chipped or stained baths</span></a>
                        <a class="block px-3 py-2 rounded-lg text-sm hover:bg-surface-container-low transition-colors" href="<?php echo esc_url( home_url( '/services/tile-resurfacing-sydney/' ) ); ?>"><span class="font-semibold text-primary block">Tile Resurfacing</span><span class="text-xs text-secondary">Transform outdated wall tiles</span></a>
                        <a class="block px-3 py-2 rounded-lg text-sm hover:bg-surface-container-low transition-colors" href="<?php echo esc_url( home_url( '/services/vanity-refinishing-sydney/' ) ); ?>"><span class="font-semibold text-primary block">Vanity Refinishing</span><span class="text-xs text-secondary">Benchtop &amp; cabinet respray</span></a>
                        <a class="block px-3 py-2 rounded-lg text-sm hover:bg-surface-container-low transition-colors" href="<?php echo esc_url( home_url( '/services/basin-restoration-sydney/' ) ); ?>"><span class="font-semibold text-primary block">Basin Restoration</span><span class="text-xs text-secondary">Chip repair &amp; full resurface</span></a>
                    </div>
                </div>
                <!-- Regrouting & Sealing -->
                <div>
                    <h3 class="text-xs font-bold text-primary uppercase tracking-widest mb-3 pb-2 border-b-2 border-tertiary-fixed-dim flex items-center gap-2"><span class="material-symbols-outlined text-sm text-tertiary-fixed-dim" aria-hidden="true">plumbing</span> Regrouting &amp; Sealing</h3>
                    <div class="space-y-0.5">
                        <a class="block px-3 py-2 rounded-lg text-sm hover:bg-surface-container-low transition-colors" href="<?php echo esc_url( home_url( '/services/shower-regrouting-sydney/' ) ); ?>"><span class="font-semibold text-primary block">Shower Regrouting</span><span class="text-xs text-secondary">Full grout removal &amp; replacement</span></a>
                        <a class="block px-3 py-2 rounded-lg text-sm hover:bg-surface-container-low transition-colors" href="<?php echo esc_url( home_url( '/services/shower-leak-repair-sydney/' ) ); ?>"><span class="font-semibold text-primary block">Shower Sealing</span><span class="text-xs text-secondary">Silicone replacement &amp; leak fix</span></a>
                        <a class="block px-3 py-2 rounded-lg text-sm hover:bg-surface-container-low transition-colors" href="<?php echo esc_url( home_url( '/services/epoxy-grout-upgrade-sydney/' ) ); ?>"><span class="font-semibold text-primary block">Epoxy Grout Upgrade</span><span class="text-xs text-secondary">Waterproof, mould-resistant grout</span></a>
                        <a class="block px-3 py-2 rounded-lg text-sm hover:bg-surface-container-low transition-colors" href="<?php echo esc_url( home_url( '/services/floor-tile-regrouting-sydney/' ) ); ?>"><span class="font-semibold text-primary block">Floor Tile Regrouting</span><span class="text-xs text-secondary">Bathroom &amp; laundry floor grout</span></a>
                    </div>
                </div>
                <!-- Repairs & Packages -->
                <div>
                    <h3 class="text-xs font-bold text-primary uppercase tracking-widest mb-3 pb-2 border-b-2 border-tertiary-fixed-dim flex items-center gap-2"><span class="material-symbols-outlined text-sm text-tertiary-fixed-dim" aria-hidden="true">build</span> Repairs &amp; Packages</h3>
                    <div class="space-y-0.5">
                        <a class="block px-3 py-2 rounded-lg text-sm hover:bg-surface-container-low transition-colors" href="<?php echo esc_url( home_url( '/services/chipped-bathtub-repair-sydney/' ) ); ?>"><span class="font-semibold text-primary block">Chip Repair</span><span class="text-xs text-secondary">Bath &amp; basin chip fixes</span></a>
                        <a class="block px-3 py-2 rounded-lg text-sm hover:bg-surface-container-low transition-colors" href="<?php echo esc_url( home_url( '/services/full-bathroom-makeover-sydney/' ) ); ?>"><span class="font-semibold text-primary block">Full Bathroom Makeover</span><span class="text-xs text-secondary">Complete resurface package</span></a>
                        <a class="block px-3 py-2 rounded-lg text-sm hover:bg-surface-container-low transition-colors" href="<?php echo esc_url( home_url( '/services/property-manager-bathroom-services-sydney/' ) ); ?>"><span class="font-semibold text-primary block">Property Managers</span><span class="text-xs text-secondary">Multi-unit &amp; rental turnarounds</span></a>
                    </div>
                    <div class="mt-4 pt-4 border-t border-surface-container">
                        <a class="flex items-center gap-2 px-3 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:opacity-90 transition-all justify-center" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span> View All Services</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- MOBILE NAV -->
    <div id="mobile-nav" class="mobile-menu fixed inset-0 z-[60] bg-white lg:hidden overflow-y-auto">
        <div class="flex justify-between items-center px-6 py-4">
            <span class="text-2xl font-black tracking-tighter text-[#1B2A4A]">Timeless Resurfacing</span>
            <button id="menu-close" class="p-2" aria-label="Close menu"><span class="material-symbols-outlined text-2xl text-primary">close</span></button>
        </div>
        <div class="flex flex-col px-6 pt-2 pb-8">
            <!-- Resurfacing -->
            <button class="flex justify-between items-center py-3 text-left" onclick="toggleMobileAccordion(this)">
                <span class="text-[0.65rem] font-bold text-tertiary-fixed-dim uppercase tracking-widest flex items-center gap-2"><span class="material-symbols-outlined text-sm" aria-hidden="true">format_paint</span> Resurfacing</span>
                <span class="material-symbols-outlined text-sm text-secondary mobile-chevron transition-transform" aria-hidden="true">expand_more</span>
            </button>
            <div class="mobile-accordion open">
                <a class="text-primary py-2.5 pl-4 text-base font-medium hover:bg-surface-container-low rounded-lg block" href="<?php echo esc_url( home_url( '/services/bath-resurfacing-sydney/' ) ); ?>" onclick="closeMobile()">Bath Resurfacing</a>
                <a class="text-primary py-2.5 pl-4 text-base font-medium hover:bg-surface-container-low rounded-lg block" href="<?php echo esc_url( home_url( '/services/tile-resurfacing-sydney/' ) ); ?>" onclick="closeMobile()">Tile Resurfacing</a>
                <a class="text-primary py-2.5 pl-4 text-base font-medium hover:bg-surface-container-low rounded-lg block" href="<?php echo esc_url( home_url( '/services/vanity-refinishing-sydney/' ) ); ?>" onclick="closeMobile()">Vanity Refinishing</a>
                <a class="text-primary py-2.5 pl-4 text-base font-medium hover:bg-surface-container-low rounded-lg block" href="<?php echo esc_url( home_url( '/services/basin-restoration-sydney/' ) ); ?>" onclick="closeMobile()">Basin Restoration</a>
            </div>
            <!-- Regrouting & Sealing -->
            <button class="flex justify-between items-center py-3 text-left" onclick="toggleMobileAccordion(this)">
                <span class="text-[0.65rem] font-bold text-tertiary-fixed-dim uppercase tracking-widest flex items-center gap-2"><span class="material-symbols-outlined text-sm" aria-hidden="true">plumbing</span> Regrouting &amp; Sealing</span>
                <span class="material-symbols-outlined text-sm text-secondary mobile-chevron transition-transform" aria-hidden="true">expand_more</span>
            </button>
            <div class="mobile-accordion open">
                <a class="text-primary py-2.5 pl-4 text-base font-medium hover:bg-surface-container-low rounded-lg block" href="<?php echo esc_url( home_url( '/services/shower-regrouting-sydney/' ) ); ?>" onclick="closeMobile()">Shower Regrouting</a>
                <a class="text-primary py-2.5 pl-4 text-base font-medium hover:bg-surface-container-low rounded-lg block" href="<?php echo esc_url( home_url( '/services/shower-leak-repair-sydney/' ) ); ?>" onclick="closeMobile()">Shower Sealing</a>
                <a class="text-primary py-2.5 pl-4 text-base font-medium hover:bg-surface-container-low rounded-lg block" href="<?php echo esc_url( home_url( '/services/epoxy-grout-upgrade-sydney/' ) ); ?>" onclick="closeMobile()">Epoxy Grout Upgrade</a>
                <a class="text-primary py-2.5 pl-4 text-base font-medium hover:bg-surface-container-low rounded-lg block" href="<?php echo esc_url( home_url( '/services/floor-tile-regrouting-sydney/' ) ); ?>" onclick="closeMobile()">Floor Tile Regrouting</a>
            </div>
            <!-- Repairs & Packages -->
            <button class="flex justify-between items-center py-3 text-left" onclick="toggleMobileAccordion(this)">
                <span class="text-[0.65rem] font-bold text-tertiary-fixed-dim uppercase tracking-widest flex items-center gap-2"><span class="material-symbols-outlined text-sm" aria-hidden="true">build</span> Repairs &amp; Packages</span>
                <span class="material-symbols-outlined text-sm text-secondary mobile-chevron transition-transform" aria-hidden="true">expand_more</span>
            </button>
            <div class="mobile-accordion open">
                <a class="text-primary py-2.5 pl-4 text-base font-medium hover:bg-surface-container-low rounded-lg block" href="<?php echo esc_url( home_url( '/services/chipped-bathtub-repair-sydney/' ) ); ?>" onclick="closeMobile()">Chip Repair</a>
                <a class="text-primary py-2.5 pl-4 text-base font-medium hover:bg-surface-container-low rounded-lg block" href="<?php echo esc_url( home_url( '/services/full-bathroom-makeover-sydney/' ) ); ?>" onclick="closeMobile()">Full Bathroom Makeover</a>
                <a class="text-primary py-2.5 pl-4 text-base font-medium hover:bg-surface-container-low rounded-lg block" href="<?php echo esc_url( home_url( '/services/property-manager-bathroom-services-sydney/' ) ); ?>" onclick="closeMobile()">Property Managers</a>
            </div>
            <div class="h-px bg-surface-container my-3"></div>
            <a class="text-primary py-3 text-lg font-semibold" href="<?php echo esc_url( home_url( '/gallery/' ) ); ?>" onclick="closeMobile()">Before &amp; After</a>
            <a class="text-primary py-3 text-lg font-semibold" href="<?php echo esc_url( home_url( '/areas/' ) ); ?>" onclick="closeMobile()">Service Areas</a>
            <a class="text-primary py-3 text-lg font-semibold" href="<?php echo esc_url( home_url( '/about/' ) ); ?>" onclick="closeMobile()">About</a>
            <a class="text-primary py-3 text-lg font-semibold" href="<?php echo esc_url( home_url( '/faqs/' ) ); ?>" onclick="closeMobile()">FAQs</a>
            <a class="bg-primary text-white text-center py-4 rounded-lg font-bold mt-4" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" onclick="closeMobile()">Get a Free Quote</a>
            <a class="bg-surface-container-high text-primary text-center py-4 rounded-lg font-bold mt-2 flex items-center justify-center gap-2" href="tel:<?php echo $phone_link; ?>" onclick="closeMobile()"><span class="material-symbols-outlined text-base" aria-hidden="true">call</span> Call <?php echo $phone; ?></a>
        </div>
    </div>
</header>

<main id="main-content">
