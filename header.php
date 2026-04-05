
<?php
/**
 * Theme Header — Shared across all pages
 *
 * @package Timeless
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$phone_link = timeless_phone_link();
$phone      = timeless_phone();
$licence    = timeless_licence();
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
    <nav class="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl shadow-sm">
        <div class="flex justify-between items-center px-6 sm:px-8 py-4 max-w-7xl mx-auto">
            <a class="text-2xl font-black tracking-tighter text-[#1B2A4A]" href="<?php echo esc_url( home_url( '/' ) ); ?>">Timeless Resurfacing</a>
            <div class="hidden md:flex items-center space-x-8 font-medium text-sm">
                <div class="relative group">
                    <button class="text-slate-500 hover:text-[#1B2A4A] transition-colors flex items-center gap-1">Services <span class="material-symbols-outlined text-sm" aria-hidden="true">expand_more</span></button>
                    <div class="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div class="bg-white rounded-xl shadow-xl border border-surface-container p-3 min-w-[220px] space-y-1">
                            <a class="block px-4 py-2.5 rounded-lg text-sm text-secondary hover:bg-surface-container-low hover:text-primary transition-colors" href="<?php echo esc_url( home_url( '/services/shower-regrouting-sydney/' ) ); ?>">Shower Regrouting</a>
                            <a class="block px-4 py-2.5 rounded-lg text-sm text-secondary hover:bg-surface-container-low hover:text-primary transition-colors" href="<?php echo esc_url( home_url( '/services/bath-resurfacing-sydney/' ) ); ?>">Bath Resurfacing</a>
                            <a class="block px-4 py-2.5 rounded-lg text-sm text-secondary hover:bg-surface-container-low hover:text-primary transition-colors" href="<?php echo esc_url( home_url( '/services/tile-resurfacing-sydney/' ) ); ?>">Tile Resurfacing</a>
                            <a class="block px-4 py-2.5 rounded-lg text-sm text-secondary hover:bg-surface-container-low hover:text-primary transition-colors" href="<?php echo esc_url( home_url( '/services/vanity-refinishing-sydney/' ) ); ?>">Vanity Refinishing</a>
                            <a class="block px-4 py-2.5 rounded-lg text-sm text-secondary hover:bg-surface-container-low hover:text-primary transition-colors" href="<?php echo esc_url( home_url( '/services/basin-restoration-sydney/' ) ); ?>">Basin Restoration</a>
                            <a class="block px-4 py-2.5 rounded-lg text-sm text-secondary hover:bg-surface-container-low hover:text-primary transition-colors" href="<?php echo esc_url( home_url( '/services/shower-leak-repair-sydney/' ) ); ?>">Shower Sealing</a>
                        </div>
                    </div>
                </div>
                <a class="text-slate-500 hover:text-[#1B2A4A] transition-colors" href="<?php echo esc_url( home_url( '/gallery/' ) ); ?>">Before &amp; After</a>
                <a class="text-slate-500 hover:text-[#1B2A4A] transition-colors" href="<?php echo esc_url( home_url( '/areas/' ) ); ?>">Service Areas</a>
                <a class="text-slate-500 hover:text-[#1B2A4A] transition-colors" href="<?php echo esc_url( home_url( '/about/' ) ); ?>">About</a>
                <a class="bg-primary text-white px-6 py-2.5 rounded-lg font-bold hover:opacity-90 transition-all" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Get a Free Quote</a>
            </div>
            <button id="menu-btn" class="md:hidden p-2" aria-label="Open menu"><span class="material-symbols-outlined text-2xl text-primary">menu</span></button>
        </div>
    </nav>
    <div id="mobile-nav" class="mobile-menu fixed inset-0 z-[60] bg-white md:hidden">
        <div class="flex justify-between items-center px-6 py-4">
            <span class="text-2xl font-black tracking-tighter text-[#1B2A4A]">Timeless Resurfacing</span>
            <button id="menu-close" class="p-2" aria-label="Close menu"><span class="material-symbols-outlined text-2xl text-primary">close</span></button>
        </div>
        <div class="flex flex-col px-6 pt-6 space-y-1">
            <p class="text-[0.65rem] font-bold text-outline uppercase tracking-widest mb-2 mt-2">Services</p>
            <a class="text-primary py-2 pl-2 text-base font-medium hover:bg-surface-container-low rounded-lg transition-colors" href="<?php echo esc_url( home_url( '/services/shower-regrouting-sydney/' ) ); ?>" onclick="closeMobile()">Shower Regrouting</a>
            <a class="text-primary py-2 pl-2 text-base font-medium hover:bg-surface-container-low rounded-lg transition-colors" href="<?php echo esc_url( home_url( '/services/bath-resurfacing-sydney/' ) ); ?>" onclick="closeMobile()">Bath Resurfacing</a>
            <a class="text-primary py-2 pl-2 text-base font-medium hover:bg-surface-container-low rounded-lg transition-colors" href="<?php echo esc_url( home_url( '/services/tile-resurfacing-sydney/' ) ); ?>" onclick="closeMobile()">Tile Resurfacing</a>
            <a class="text-primary py-2 pl-2 text-base font-medium hover:bg-surface-container-low rounded-lg transition-colors" href="<?php echo esc_url( home_url( '/services/vanity-refinishing-sydney/' ) ); ?>" onclick="closeMobile()">Vanity Refinishing</a>
            <a class="text-primary py-2 pl-2 text-base font-medium hover:bg-surface-container-low rounded-lg transition-colors" href="<?php echo esc_url( home_url( '/services/basin-restoration-sydney/' ) ); ?>" onclick="closeMobile()">Basin Restoration</a>
            <a class="text-primary py-2 pl-2 text-base font-medium hover:bg-surface-container-low rounded-lg transition-colors" href="<?php echo esc_url( home_url( '/services/shower-leak-repair-sydney/' ) ); ?>" onclick="closeMobile()">Shower Sealing</a>
            <div class="h-px bg-surface-container my-3"></div>
            <a class="text-primary py-2 text-lg font-semibold" href="<?php echo esc_url( home_url( '/gallery/' ) ); ?>" onclick="closeMobile()">Before &amp; After</a>
            <a class="text-primary py-2 text-lg font-semibold" href="<?php echo esc_url( home_url( '/areas/' ) ); ?>" onclick="closeMobile()">Service Areas</a>
            <a class="text-primary py-2 text-lg font-semibold" href="<?php echo esc_url( home_url( '/about/' ) ); ?>" onclick="closeMobile()">About</a>
            <a class="bg-primary text-white text-center py-4 rounded-lg font-bold mt-4" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" onclick="closeMobile()">Get a Free Quote</a>
            <a class="bg-surface-container-high text-primary text-center py-4 rounded-lg font-bold mt-2 flex items-center justify-center gap-2" href="tel:<?php echo $phone_link; ?>" onclick="closeMobile()"><span class="material-symbols-outlined text-base" aria-hidden="true">call</span> Call Now</a>
        </div>
    </div>
</header>

<main id="main-content">
