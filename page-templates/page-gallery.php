<?php /* Template Name: Gallery */ ?>
<?php get_header(); ?>

<!-- Schema: ImageGallery -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "Before & After Bathroom Resurfacing Gallery",
    "description": "Real bathroom resurfacing transformations across Greater Sydney and NSW.",
    "url": "<?php echo esc_url( home_url( '/gallery/' ) ); ?>",
    "about": {
        "@type": "Service",
        "name": "Bathroom Resurfacing",
        "provider": {
            "@type": "HomeAndConstructionBusiness",
            "name": "Timeless Resurfacing",
            "url": "https://timelessresurfacing.com.au"
        }
    }
}
</script>

<main id="main-content">

<!-- BREADCRUMB -->
<div class="pt-24 sm:pt-28 bg-surface">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <nav class="text-xs text-secondary" aria-label="Breadcrumb">
            <ol class="flex items-center gap-1.5">
                <li><a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="hover:text-primary transition-colors">Home</a></li>
                <li><span class="material-symbols-outlined text-xs text-outline-variant" aria-hidden="true">chevron_right</span></li>
                <li class="text-primary font-semibold">Gallery</li>
            </ol>
        </nav>
    </div>
</div>

<!-- HERO -->
<section class="pt-6 pb-12 sm:pb-16 bg-surface">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.7rem] font-bold tracking-widest uppercase rounded mb-6">Real Results</span>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tighter leading-[0.95] mb-4">Before &amp; After Gallery</h1>
        <p class="text-base sm:text-lg text-secondary leading-relaxed max-w-2xl">Real bathroom transformations across Greater Sydney and NSW. Every project shown was completed in one to two days with zero demolition.</p>
        <div class="h-1 w-20 bg-tertiary-fixed-dim mt-6"></div>
    </div>
</section>

<!-- FILTER BUTTONS -->
<section class="bg-surface pb-8">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="flex flex-wrap gap-2">
            <button class="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg transition-all">All</button>
            <button class="px-4 py-2 bg-surface-container-high text-secondary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all">Shower Regrouting</button>
            <button class="px-4 py-2 bg-surface-container-high text-secondary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all">Bath Resurfacing</button>
            <button class="px-4 py-2 bg-surface-container-high text-secondary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all">Tile Resurfacing</button>
            <button class="px-4 py-2 bg-surface-container-high text-secondary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all">Vanity</button>
            <button class="px-4 py-2 bg-surface-container-high text-secondary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all">Leak Repair</button>
        </div>
    </div>
</section>

<!-- GALLERY GRID -->
<section class="py-8 sm:py-12 bg-surface">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <!-- Card 1: Surry Hills -->
            <article class="group overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-xl transition-all reveal">
                <div class="aspect-video overflow-hidden relative">
                    <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Bathroom resurfacing Surry Hills apartment - resurfaced white bathtub and wall tiles" src="<?php echo get_template_directory_uri(); ?>/images/gallery/surry-hills.jpg" loading="lazy" width="600" height="338" />
                    <div class="absolute top-3 left-3 flex gap-1.5">
                        <span class="text-[0.6rem] bg-primary/90 text-white px-2.5 py-1 rounded font-bold backdrop-blur-sm">Bath Resurfacing</span>
                        <span class="text-[0.6rem] bg-primary/90 text-white px-2.5 py-1 rounded font-bold backdrop-blur-sm">Tile Resurfacing</span>
                    </div>
                </div>
                <div class="p-6">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="font-bold text-primary text-lg">Surry Hills Apartment</h3>
                        <span class="text-[0.6rem] bg-surface-container px-2 py-0.5 rounded font-bold uppercase text-outline">Bath &amp; Wall Tiles</span>
                    </div>
                    <p class="text-sm text-secondary leading-relaxed mb-4">Complete bath resurfacing and wall tile refresh. Tenant was back in the bathroom within 24 hours.</p>
                    <div class="flex justify-between items-center pt-3 border-t border-surface-container">
                        <p class="text-xs text-secondary italic">"Looks brand new. Incredible turnaround."</p>
                        <span class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">View Details <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span>
                    </div>
                </div>
            </article>

            <!-- Card 2: Bondi Beach -->
            <article class="group overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-xl transition-all reveal">
                <div class="aspect-video overflow-hidden relative">
                    <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Shower regrouting Bondi Beach - restored white subway tiles and basin" src="<?php echo get_template_directory_uri(); ?>/images/gallery/bondi-beach.jpg" loading="lazy" width="600" height="338" />
                    <div class="absolute top-3 left-3 flex gap-1.5">
                        <span class="text-[0.6rem] bg-primary/90 text-white px-2.5 py-1 rounded font-bold backdrop-blur-sm">Shower Regrouting</span>
                        <span class="text-[0.6rem] bg-primary/90 text-white px-2.5 py-1 rounded font-bold backdrop-blur-sm">Basin Restoration</span>
                    </div>
                </div>
                <div class="p-6">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="font-bold text-primary text-lg">Bondi Beach House</h3>
                        <span class="text-[0.6rem] bg-surface-container px-2 py-0.5 rounded font-bold uppercase text-outline">Shower &amp; Basin</span>
                    </div>
                    <p class="text-sm text-secondary leading-relaxed mb-4">Restored the original 1920s character without the $20k renovation price tag.</p>
                    <div class="flex justify-between items-center pt-3 border-t border-surface-container">
                        <p class="text-xs text-secondary italic">"Heritage charm preserved beautifully."</p>
                        <span class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">View Details <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span>
                    </div>
                </div>
            </article>

            <!-- Card 3: Parramatta -->
            <article class="group overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-xl transition-all reveal">
                <div class="aspect-video overflow-hidden relative">
                    <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Full bathroom resurfacing Parramatta - resurfaced vanity and bath" src="<?php echo get_template_directory_uri(); ?>/images/gallery/parramatta.jpg" loading="lazy" width="600" height="338" />
                    <div class="absolute top-3 left-3 flex gap-1.5">
                        <span class="text-[0.6rem] bg-primary/90 text-white px-2.5 py-1 rounded font-bold backdrop-blur-sm">Full Bathroom Package</span>
                    </div>
                </div>
                <div class="p-6">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="font-bold text-primary text-lg">Parramatta Family Home</h3>
                        <span class="text-[0.6rem] bg-surface-container px-2 py-0.5 rounded font-bold uppercase text-outline">Full Bathroom</span>
                    </div>
                    <p class="text-sm text-secondary leading-relaxed mb-4">Complete bathroom transformation &mdash; regrout, bath resurface, and basin restoration in two days.</p>
                    <div class="flex justify-between items-center pt-3 border-t border-surface-container">
                        <p class="text-xs text-secondary italic">"Second to none in Western Sydney."</p>
                        <span class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">View Details <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span>
                    </div>
                </div>
            </article>

            <!-- Card 4: North Shore -->
            <article class="group overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-xl transition-all reveal">
                <div class="aspect-video overflow-hidden relative">
                    <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Shower regrouting North Shore unit - epoxy regrouting to stop leak" src="<?php echo get_template_directory_uri(); ?>/images/gallery/north-shore.jpg" loading="lazy" width="600" height="338" />
                    <div class="absolute top-3 left-3 flex gap-1.5">
                        <span class="text-[0.6rem] bg-primary/90 text-white px-2.5 py-1 rounded font-bold backdrop-blur-sm">Shower Regrouting</span>
                        <span class="text-[0.6rem] bg-primary/90 text-white px-2.5 py-1 rounded font-bold backdrop-blur-sm">Leak Repair</span>
                    </div>
                </div>
                <div class="p-6">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="font-bold text-primary text-lg">North Shore Unit</h3>
                        <span class="text-[0.6rem] bg-surface-container px-2 py-0.5 rounded font-bold uppercase text-outline">Shower Regrouting</span>
                    </div>
                    <p class="text-sm text-secondary leading-relaxed mb-4">Epoxy regrouting stopped a persistent shower leak that was damaging the unit below.</p>
                    <div class="flex justify-between items-center pt-3 border-t border-surface-container">
                        <p class="text-xs text-secondary italic">"Finally fixed what two plumbers couldn't."</p>
                        <span class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">View Details <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span>
                    </div>
                </div>
            </article>

            <!-- Card 5: Wollongong -->
            <article class="group overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-xl transition-all reveal">
                <div class="aspect-video overflow-hidden relative">
                    <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Bath and vanity resurfacing Wollongong rental - pre-sale cosmetic refresh" src="<?php echo get_template_directory_uri(); ?>/images/gallery/wollongong.jpg" loading="lazy" width="600" height="338" />
                    <div class="absolute top-3 left-3 flex gap-1.5">
                        <span class="text-[0.6rem] bg-primary/90 text-white px-2.5 py-1 rounded font-bold backdrop-blur-sm">Bath Resurfacing</span>
                        <span class="text-[0.6rem] bg-primary/90 text-white px-2.5 py-1 rounded font-bold backdrop-blur-sm">Vanity Refinishing</span>
                    </div>
                </div>
                <div class="p-6">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="font-bold text-primary text-lg">Wollongong Rental</h3>
                        <span class="text-[0.6rem] bg-surface-container px-2 py-0.5 rounded font-bold uppercase text-outline">Bath &amp; Vanity</span>
                    </div>
                    <p class="text-sm text-secondary leading-relaxed mb-4">Pre-sale cosmetic refresh. Bath resurfacing plus vanity cabinet respray.</p>
                    <div class="flex justify-between items-center pt-3 border-t border-surface-container">
                        <p class="text-xs text-secondary italic">"Added real value before auction day."</p>
                        <span class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">View Details <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span>
                    </div>
                </div>
            </article>

            <!-- Card 6: Hills District -->
            <article class="group overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-xl transition-all reveal">
                <div class="aspect-video overflow-hidden relative">
                    <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Tile resurfacing Hills District - outdated brown tiles transformed to white" src="<?php echo get_template_directory_uri(); ?>/images/gallery/hills-district.jpg" loading="lazy" width="600" height="338" />
                    <div class="absolute top-3 left-3 flex gap-1.5">
                        <span class="text-[0.6rem] bg-primary/90 text-white px-2.5 py-1 rounded font-bold backdrop-blur-sm">Tile Resurfacing</span>
                    </div>
                </div>
                <div class="p-6">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="font-bold text-primary text-lg">Hills District Home</h3>
                        <span class="text-[0.6rem] bg-surface-container px-2 py-0.5 rounded font-bold uppercase text-outline">Tile Resurfacing</span>
                    </div>
                    <p class="text-sm text-secondary leading-relaxed mb-4">Outdated brown tiles transformed to clean white finish. Zero demolition.</p>
                    <div class="flex justify-between items-center pt-3 border-t border-surface-container">
                        <p class="text-xs text-secondary italic">"Can't believe it's the same bathroom."</p>
                        <span class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">View Details <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span>
                    </div>
                </div>
            </article>

        </div>
    </div>
</section>

<!-- CTA -->
<section class="py-16 sm:py-24 bg-primary text-white">
    <div class="max-w-3xl mx-auto px-6 sm:px-8 text-center">
        <span class="material-symbols-outlined text-5xl text-tertiary-fixed-dim mb-4" aria-hidden="true">auto_awesome</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tighter mb-4">Ready for Your Transformation?</h2>
        <p class="text-on-primary-container text-base sm:text-lg mb-8 max-w-xl mx-auto">Send us photos of your bathroom and get a fixed-price quote within hours. No obligation, no surprises.</p>
        <a class="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary font-bold rounded-lg hover:shadow-xl transition-all text-lg" href="<?php echo esc_url( home_url( '/#quote' ) ); ?>">Get a Free Quote <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></a>
    </div>
</section>

<!-- TRUST BAR -->
<section class="bg-primary-container text-white py-5">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 flex flex-wrap justify-center sm:justify-between items-center gap-4 sm:gap-6">
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified_user</span><span class="text-xs font-bold">Qualified &amp; Insured</span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">security</span><span class="text-xs font-bold">Public Liability Insured</span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">gavel</span><span class="text-xs font-bold">NSW Fair Trading Compliant</span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified</span><span class="text-xs font-bold">Up to 3-Year Warranty</span></div>
    </div>
</section>

</main>

<?php get_footer(); ?>
