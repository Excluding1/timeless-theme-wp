<?php /* Template Name: Basin Restoration Sydney */ ?>
<?php get_header(); ?>

<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Basin Restoration Sydney",
    "description": "Professional basin restoration in Sydney. Chip repair, stain removal, full resurface. 2-4 hour service, 3-year warranty, up to 80% cheaper than replacement.",
    "provider": {
        "@type": "HomeAndConstructionBusiness",
        "name": "Timeless Resurfacing",
        "url": "https://timelessresurfacing.com.au",
        "telephone": "<?php echo timeless_phone_link(); ?>",
        "address": { "@type": "PostalAddress", "addressLocality": "Sydney", "addressRegion": "NSW", "addressCountry": "AU" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "23" }
    },
    "areaServed": { "@type": "City", "name": "Sydney" },
    "serviceType": "Basin Restoration"
}
</script>

<script type="application/ld+json">
{
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://timelessresurfacing.com.au/" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://timelessresurfacing.com.au/services/" },
        { "@type": "ListItem", "position": 3, "name": "Basin Restoration Sydney", "item": "https://timelessresurfacing.com.au/services/basin-restoration-sydney/" }
    ]
}
</script>

<script type="application/ld+json">
{
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "How much does basin restoration cost in Sydney?", "acceptedAnswer": { "@type": "Answer", "text": "Every basin is different. The final price depends on the type of basin, the extent of damage, and whether it's standalone or part of a larger bathroom job. Send us photos and we'll have a fixed-price quote back within hours." } },
        { "@type": "Question", "name": "What types of basins can you restore?", "acceptedAnswer": { "@type": "Answer", "text": "We restore porcelain, ceramic, cast iron enamel, acrylic, and fibreglass basins. Drop-in, undermount, pedestal, and wall-mounted configurations." } },
        { "@type": "Question", "name": "How long does basin restoration take?", "acceptedAnswer": { "@type": "Answer", "text": "2-4 hours on-site for a standalone basin. If done alongside bath or tile resurfacing, it adds roughly 1-1.5 hours. Light use after 24 hours, full cure in 5-7 days." } },
        { "@type": "Question", "name": "How long does a restored basin last?", "acceptedAnswer": { "@type": "Answer", "text": "5-10 years with proper care. The 3-year warranty covers our workmanship. Beyond that, longevity depends on avoiding abrasive cleaners and harsh chemicals." } },
        { "@type": "Question", "name": "Can you change the basin colour?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. We have 900+ colours available. White is the most popular choice, but we can match any colour you want." } }
    ]
}
</script>

<main id="main-content">

<!-- BREADCRUMB -->
<div class="pt-24 pb-2 px-6 sm:px-8 max-w-7xl mx-auto">
    <nav class="text-xs text-white/70" aria-label="Breadcrumb">
        <ol class="flex items-center gap-1">
            <li><a href="<?php echo esc_url( home_url('/') ); ?>" class="hover:text-white transition-colors">Home</a></li>
            <li><span class="mx-1">/</span></li>
            <li><a href="<?php echo esc_url( home_url('/services/') ); ?>" class="hover:text-white transition-colors">Services</a></li>
            <li><span class="mx-1">/</span></li>
            <li class="text-white font-medium">Basin Restoration Sydney</li>
        </ol>
    </nav>
</div>

<!-- HERO (Medium-dark background) -->
<section class="pt-4 pb-16 sm:pb-20 bg-[#1b2a4a] text-white" style="margin-top:-96px; padding-top:120px;">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
            <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.7rem] font-bold tracking-widest uppercase rounded mb-4">Add to Any Job</span>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-[0.95] mb-6 underline decoration-[#c9a060] decoration-[5px] underline-offset-[8px] [text-decoration-skip-ink:none]">
                Basin <span class="text-tertiary-fixed-dim">Restoration</span>
            </h1>
            <p class="text-base sm:text-lg text-white/80 leading-relaxed max-w-xl mb-6">
                Chipped, stained, or worn basin dragging down your bathroom? We restore porcelain, ceramic, and cast iron basins to like-new condition. Done in hours, no plumber needed.
            </p>
            <div class="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
                <div class="text-center bg-white/10 rounded-lg px-2 sm:px-3 py-3">
                    <p class="text-base sm:text-xl lg:text-2xl font-extrabold leading-tight">Up to 80%</p>
                    <p class="text-[0.6rem] sm:text-[0.65rem] text-white/60 font-medium mt-1">Cheaper than new</p>
                </div>
                <div class="text-center bg-white/10 rounded-lg px-2 sm:px-3 py-3">
                    <p class="text-base sm:text-xl lg:text-2xl font-extrabold leading-tight">2-4 hrs</p>
                    <p class="text-[0.6rem] sm:text-[0.65rem] text-white/60 font-medium mt-1">Quick turnaround</p>
                </div>
                <div class="text-center bg-white/10 rounded-lg px-2 sm:px-3 py-3">
                    <p class="text-base sm:text-xl lg:text-2xl font-extrabold leading-tight">3yr</p>
                    <p class="text-[0.6rem] sm:text-[0.65rem] text-white/60 font-medium mt-1">Restoration warranty</p>
                </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 mb-4">
                <a class="px-8 py-4 bg-white text-primary font-bold rounded-lg text-center hover:shadow-xl transition-all" href="#quote">Get Your Free Quote</a>
            </div>
            <p class="text-xs text-white/60"><span class="material-symbols-outlined text-sm align-text-bottom text-tertiary-fixed-dim" aria-hidden="true">photo_camera</span> Send photos &rarr; quote in hours. No obligation.</p>
            <div class="mt-6 flex items-center gap-3">
                <div class="flex -space-x-2" aria-hidden="true">
                    <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/reviews/reviewer-1.png" alt="" class="w-8 h-8 rounded-full border-2 border-white object-cover" />
                    <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/reviews/reviewer-2.png" alt="" class="w-8 h-8 rounded-full border-2 border-white object-cover" />
                    <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/reviews/reviewer-3.png" alt="" class="w-8 h-8 rounded-full border-2 border-white object-cover" />
                </div>
                <p class="text-sm font-medium text-white/80"><strong class="text-white">4.9&#9733;</strong> Google Rating from NSW Homeowners</p>
            </div>
        </div>
        <div>
            <!-- HERO BEFORE/AFTER SLIDER -->
            <div id="hero-slider" class="rounded-xl overflow-hidden shadow-2xl relative select-none" style="aspect-ratio:4/3;cursor:ew-resize;">
                <!-- AFTER image -->
                <div class="absolute inset-0 w-full h-full">
                    <img src="<?php echo get_template_directory_uri(); ?>/images/services/basin-restoration/hero-after.png" alt="Restored basin with glossy black finish" class="w-full h-full object-cover" />
                </div>
                <!-- BEFORE image -->
                <div id="ba-clip" class="absolute top-0 left-0 bottom-0 overflow-hidden" style="width:50%;">
                    <img id="ba-before-img" src="<?php echo get_template_directory_uri(); ?>/images/services/basin-restoration/hero-before.png" alt="Worn basin before restoration" class="object-cover" style="position:absolute;top:0;left:0;height:100%;width:200%;" />
                </div>
                <div id="ba-line" class="absolute top-0 bottom-0 w-0.5 bg-white" style="left:50%;z-index:20;cursor:ew-resize;"></div>
                <div id="ba-handle" class="absolute top-1/2 w-11 h-11 -mt-[22px] -ml-[22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">Before</span>
                <span class="absolute top-3 right-3 bg-white/80 text-primary text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">After</span>
                <div class="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 bg-white/90 backdrop-blur-md rounded-lg flex justify-between items-center" style="z-index:15;">
                    <span class="text-xs font-bold text-primary">Drag to Compare</span>
                    <span class="text-xs font-bold text-on-primary-container">Restored in Hours</span>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- TRUST BAR -->
<section class="bg-primary text-white py-4">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-2 gap-3 sm:grid-cols-none sm:flex sm:flex-wrap sm:justify-between items-center sm:gap-4">
        <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified_user</span><span class="text-xs font-bold">Experienced &amp; Insured</span></div>
        <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">security</span><span class="text-xs font-bold">Public Liability Insured</span></div>
        <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified</span><span class="text-xs font-bold">3-Year Warranty</span></div>
        <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">schedule</span><span class="text-xs font-bold">Same-Day Service</span></div>
    </div>
</section>

<!-- TRUST LOGO BAR -->
<section class="py-8 sm:py-10 bg-surface-container-low/50">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <p class="text-center text-sm text-secondary mb-6">Trusted by Hundreds of Australians, from Homeowners to Major Brands</p>
    </div>
    <div class="max-w-6xl mx-auto px-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing" id="logo-scroller" style="-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none;">
        <div class="flex items-center gap-5 sm:gap-8 w-max px-8" id="logo-inner">
            <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-1.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" draggable="false" />
            <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-2.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" draggable="false" />
            <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-3.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" draggable="false" />
            <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-4.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" draggable="false" />
            <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-5.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" draggable="false" />
            <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-6.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" draggable="false" />
            <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-7.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" draggable="false" />
            <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-8.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" draggable="false" />
            <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-9.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" draggable="false" />
            <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-10.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" draggable="false" />
            <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-1.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" draggable="false" />
            <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-2.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" draggable="false" />
            <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-3.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" draggable="false" />
            <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-4.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" draggable="false" />
            <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-5.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" draggable="false" />
            <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-6.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" draggable="false" />
            <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-7.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" draggable="false" />
            <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-8.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" draggable="false" />
            <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-9.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" draggable="false" />
            <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-10.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" draggable="false" />
        </div>
    </div>
    <div id="logo-dots" class="flex justify-center gap-1.5 mt-4"></div>
</section>

<!-- SECTION 2B — What We Fix -->
<section class="py-16 sm:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <div class="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
            <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.65rem] font-bold tracking-widest uppercase rounded mb-3">Our Services</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">What We Fix</h2>
            <p class="text-secondary">Whatever&rsquo;s wrong with your basin, we&rsquo;ve seen it and fixed it. Here&rsquo;s what we restore, how we do it, and what the results look like.</p>
        </div>

        <!-- BLOCK 1: Chips & Cracks — text-left, image-right -->
        <div class="mb-12 lg:mb-16 reveal">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div class="order-2 lg:order-1">
                    <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Chips &amp; Cracks</h3>
                    <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Dropped a bottle and now there&rsquo;s a chip exposing raw ceramic? Hairline cracks spreading from the drain hole? These start small but trap dirt, grow rust stains, and get worse over time. We fill each chip with two-part epoxy, sand it flush, then resurface the entire basin for an invisible repair.</p>
                    <ul class="space-y-2.5 mb-6">
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Single chip or multi-chip repairs</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Invisible colour-matched finish</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Stops rust and staining at the source</li>
                    </ul>
                    <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
                </div>
                <div class="order-1 lg:order-2">
                    <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none" style="aspect-ratio:3/2;cursor:ew-resize;">
                        <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-50 via-white to-[#e7c08b]/20 flex items-center justify-center">
                            <img src="<?php echo get_template_directory_uri(); ?>/images/services/basin-restoration/chips-after.png" alt="Basin after chip and crack repair" class="w-full h-full object-cover absolute inset-0" />
                        </div>
                        <div class="ba-clip absolute top-0 left-0 bottom-0 overflow-hidden" style="width:66%;">
                            <div class="ba-before absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center">
                                <img src="<?php echo get_template_directory_uri(); ?>/images/services/basin-restoration/chips-before.png" alt="Chipped and cracked basin" class="w-full h-full object-cover absolute inset-0" />
                            </div>
                        </div>
                        <div class="ba-line absolute top-0 bottom-0 w-0.5 bg-white" style="left:66%;z-index:20;cursor:ew-resize;"></div>
                        <div class="ba-handle absolute top-1/2 w-11 h-11 -mt-[22px] -ml-[22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:66%;z-index:25;cursor:ew-resize;">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </div>
                        <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">Before</span>
                        <span class="absolute top-3 right-3 bg-white/80 text-[#041534] text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">After</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- BLOCK 2: Stains & Discolouration — image-left, text-right -->
        <div class="mb-12 lg:mb-16 reveal">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div class="order-2 lg:order-2">
                    <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Stains &amp; Discolouration</h3>
                    <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Yellow iron stains from a dripping tap? Brown hard-water deposits that won&rsquo;t scrub off? Calcium buildup around the tapware holes that cleaning products can&rsquo;t touch? We prep the surface, remove what we can, then seal everything under a fresh gloss coat so it stays white.</p>
                    <ul class="space-y-2.5 mb-6">
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Removes rust, calcium, and hard-water stains</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Restores original white finish</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> New coating resists future staining</li>
                    </ul>
                    <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
                </div>
                <div class="order-1 lg:order-1">
                    <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none" style="aspect-ratio:3/2;cursor:ew-resize;">
                        <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-50 via-white to-[#e7c08b]/20 flex items-center justify-center">
                            <img src="<?php echo get_template_directory_uri(); ?>/images/services/basin-restoration/stain-after.png" alt="Basin after stain and discolouration removal" class="w-full h-full object-cover absolute inset-0" />
                        </div>
                        <div class="ba-clip absolute top-0 left-0 bottom-0 overflow-hidden" style="width:50%;">
                            <div class="ba-before absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center">
                                <img src="<?php echo get_template_directory_uri(); ?>/images/services/basin-restoration/stain-before.png" alt="Stained discoloured basin" class="w-full h-full object-cover absolute inset-0" />
                            </div>
                        </div>
                        <div class="ba-line absolute top-0 bottom-0 w-0.5 bg-white" style="left:50%;z-index:20;cursor:ew-resize;"></div>
                        <div class="ba-handle absolute top-1/2 w-11 h-11 -mt-[22px] -ml-[22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </div>
                        <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">Before</span>
                        <span class="absolute top-3 right-3 bg-white/80 text-[#041534] text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">After</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- BLOCK 3: Worn & Scratched Finish — text-left, image-right -->
        <div class="reveal">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div class="order-2 lg:order-1">
                    <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Worn &amp; Scratched Finish</h3>
                    <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Years of abrasive cleaners wore the glaze off? Surface feels rough where it used to be smooth? These are surface-layer problems that cleaning can&rsquo;t fix. We sand back the damaged glaze, prime for adhesion, then spray a fresh acrylic urethane topcoat. Done right, you&rsquo;re looking at another 5-10 years of daily use.</p>
                    <ul class="space-y-2.5 mb-6">
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Restores smooth, glossy surface</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Covers crazing and micro-cracks</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Easier to clean than worn ceramic</li>
                    </ul>
                    <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
                </div>
                <div class="order-1 lg:order-2">
                    <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none" style="aspect-ratio:3/2;cursor:ew-resize;">
                        <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-50 via-white to-[#e7c08b]/20 flex items-center justify-center">
                            <img src="<?php echo get_template_directory_uri(); ?>/images/services/basin-restoration/worn-after.png" alt="Basin after worn finish restoration" class="w-full h-full object-cover absolute inset-0" />
                        </div>
                        <div class="ba-clip absolute top-0 left-0 bottom-0 overflow-hidden" style="width:50%;">
                            <div class="ba-before absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center">
                                <img src="<?php echo get_template_directory_uri(); ?>/images/services/basin-restoration/worn-before.png" alt="Worn scratched basin finish" class="w-full h-full object-cover absolute inset-0" />
                            </div>
                        </div>
                        <div class="ba-line absolute top-0 bottom-0 w-0.5 bg-white" style="left:50%;z-index:20;cursor:ew-resize;"></div>
                        <div class="ba-handle absolute top-1/2 w-11 h-11 -mt-[22px] -ml-[22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </div>
                        <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">Before</span>
                        <span class="absolute top-3 right-3 bg-white/80 text-[#041534] text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">After</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- PERFECT FOR THESE BASINS -->
<section class="py-16 sm:py-20 bg-surface-container-low">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="max-w-3xl mx-auto text-center mb-10 lg:mb-12">
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">We Restore These Basin Types</h2>
            <p class="text-secondary">If your basin is structurally sound, we can restore it. Here are the most common types we work on.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white rounded-xl p-6 text-center reveal shadow-sm transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg">
                <span class="material-symbols-outlined text-3xl text-primary mb-3 block" aria-hidden="true">wash</span>
                <h3 class="font-bold text-primary mb-2">Porcelain &amp; Ceramic</h3>
                <p class="text-sm text-secondary leading-relaxed">The most common basin type in Australian homes. Chips and staining are the usual problems. Both are straightforward to fix.</p>
            </div>
            <div class="bg-white rounded-xl p-6 text-center reveal shadow-sm transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg">
                <span class="material-symbols-outlined text-3xl text-primary mb-3 block" aria-hidden="true">iron</span>
                <h3 class="font-bold text-primary mb-2">Cast Iron Enamel</h3>
                <p class="text-sm text-secondary leading-relaxed">Heavy, durable basins found in older homes. Enamel chips and yellows over decades. We restore the gloss without removing the basin.</p>
            </div>
            <div class="bg-white rounded-xl p-6 text-center reveal shadow-sm transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg">
                <span class="material-symbols-outlined text-3xl text-primary mb-3 block" aria-hidden="true">layers</span>
                <h3 class="font-bold text-primary mb-2">Acrylic &amp; Fibreglass</h3>
                <p class="text-sm text-secondary leading-relaxed">Lightweight basins that scratch and dull over time. Different prep method but same factory-quality finish result.</p>
            </div>
            <div class="bg-white rounded-xl p-6 text-center reveal shadow-sm transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg">
                <span class="material-symbols-outlined text-3xl text-primary mb-3 block" aria-hidden="true">vertical_align_bottom</span>
                <h3 class="font-bold text-primary mb-2">Pedestal &amp; Wall-Mounted</h3>
                <p class="text-sm text-secondary leading-relaxed">Freestanding pedestal basins and wall-hung units. We work around the existing mounting. No plumber needed.</p>
            </div>
        </div>
    </div>
</section>

<!-- NEW BASIN vs RESTORATION COMPARISON -->
<section class="py-16 sm:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="text-center mb-12">
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">New Basin vs Restoration</h2>
            <p class="text-secondary max-w-2xl mx-auto">A new basin is $80 at Bunnings. But the plumber, benchtop cut, and retiling turns it into $800+.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <!-- LEFT: Buy New (Red) -->
            <div class="bg-red-50/50 rounded-2xl p-8 border-2 border-red-200 relative overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal">
                <div class="absolute top-0 right-0 bg-red-100 text-red-700 text-[0.6rem] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">Expensive</div>
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-red-600" aria-hidden="true">close</span></div>
                    <h3 class="text-xl font-extrabold text-primary">Buy a New Basin</h3>
                </div>
                <ul class="space-y-4">
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-red-500 text-lg mt-0.5 flex-shrink-0" aria-hidden="true">close</span>
                        <div><p class="font-bold text-primary text-sm">$800 &ndash; $1,500+ all-in</p><p class="text-xs text-secondary">Basin + plumber + benchtop mod + retiling</p></div>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-red-500 text-lg mt-0.5 flex-shrink-0" aria-hidden="true">close</span>
                        <div><p class="font-bold text-primary text-sm">Plumber required</p><p class="text-xs text-secondary">Disconnect waste and tapware, reconnect after</p></div>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-red-500 text-lg mt-0.5 flex-shrink-0" aria-hidden="true">close</span>
                        <div><p class="font-bold text-primary text-sm">Benchtop damage risk</p><p class="text-xs text-secondary">Undermount removal can crack stone or laminate</p></div>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-red-500 text-lg mt-0.5 flex-shrink-0" aria-hidden="true">close</span>
                        <div><p class="font-bold text-primary text-sm">Tile and grout repair</p><p class="text-xs text-secondary">Gap between old basin profile and new one</p></div>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-red-500 text-lg mt-0.5 flex-shrink-0" aria-hidden="true">close</span>
                        <div><p class="font-bold text-primary text-sm">Days of disruption</p><p class="text-xs text-secondary">Waiting for plumber, parts, and trades to align</p></div>
                    </li>
                </ul>
            </div>
            <!-- RIGHT: Restore It (Green) -->
            <div class="bg-green-50/50 rounded-2xl p-8 border-2 border-green-300 relative overflow-hidden ring-2 ring-green-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 reveal">
                <div class="absolute top-0 right-0 bg-green-100 text-green-700 text-[0.6rem] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">Recommended</div>
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-green-600" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span></div>
                    <h3 class="text-xl font-extrabold text-primary">Our Restoration</h3>
                </div>
                <ul class="space-y-4">
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-green-600 text-lg mt-0.5 flex-shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span>
                        <div><p class="font-bold text-primary text-sm">Fixed-Price Quote</p><p class="text-xs text-secondary">Send photos for your price</p></div>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-green-600 text-lg mt-0.5 flex-shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span>
                        <div><p class="font-bold text-primary text-sm">Done in 2-4 hours</p><p class="text-xs text-secondary">Basin usable the next day</p></div>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-green-600 text-lg mt-0.5 flex-shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span>
                        <div><p class="font-bold text-primary text-sm">No plumber needed</p><p class="text-xs text-secondary">Taps stay connected, basin stays in place</p></div>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-green-600 text-lg mt-0.5 flex-shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span>
                        <div><p class="font-bold text-primary text-sm">Zero benchtop risk</p><p class="text-xs text-secondary">No removal, no cutting, no damage</p></div>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-green-600 text-lg mt-0.5 flex-shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span>
                        <div><p class="font-bold text-primary text-sm">3-year warranty</p><p class="text-xs text-secondary">Professional-grade coating, fully guaranteed</p></div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</section>

<!-- PROCESS STEPS — Connected Timeline -->
<section class="py-16 sm:py-20 bg-surface-container-low">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">How We Restore Your Basin</h2>
            <p class="text-secondary">A 4-step professional process. Most basins completed in a single visit.</p>
        </div>

        <!-- DESKTOP: Horizontal connected timeline -->
        <div class="hidden lg:block">
            <div class="grid grid-cols-4 gap-0 relative">
                <div class="absolute top-7 left-[12.5%] right-[12.5%] h-0.5 border-t-2 border-dashed border-[#e7c08b]/40" aria-hidden="true"></div>
                <div class="flex flex-col items-center text-center px-4 reveal">
                    <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center relative z-10 mb-4 shadow-sm"><div class="w-12 h-12 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-2xl font-black text-[#7a5c10]">1</span></div></div>
                    <span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full mb-3">~30 min</span>
                    <h3 class="font-bold text-primary text-sm mb-2">Clean &amp; Prep</h3>
                    <p class="text-xs text-secondary leading-relaxed">Basin cleaned, degreased, and sanded. Surrounding benchtop, taps, and wall masked off.</p>
                </div>
                <div class="flex flex-col items-center text-center px-4 reveal">
                    <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center relative z-10 mb-4 shadow-sm"><div class="w-12 h-12 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-2xl font-black text-[#7a5c10]">2</span></div></div>
                    <span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full mb-3">~30 min</span>
                    <h3 class="font-bold text-primary text-sm mb-2">Fill &amp; Sand</h3>
                    <p class="text-xs text-secondary leading-relaxed">Chips and cracks filled with two-part epoxy. Feathered and sanded flush for an invisible repair.</p>
                </div>
                <div class="flex flex-col items-center text-center px-4 reveal">
                    <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center relative z-10 mb-4 shadow-sm"><div class="w-12 h-12 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-2xl font-black text-[#7a5c10]">3</span></div></div>
                    <span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full mb-3">1&ndash;2 hrs</span>
                    <h3 class="font-bold text-primary text-sm mb-2">Prime &amp; Coat</h3>
                    <p class="text-xs text-secondary leading-relaxed">Bonding primer then multiple coats of acrylic urethane topcoat. Spray-applied for a smooth, even finish.</p>
                </div>
                <div class="flex flex-col items-center text-center px-4 reveal">
                    <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center relative z-10 mb-4 shadow-sm"><div class="w-12 h-12 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-2xl font-black text-[#7a5c10]">4</span></div></div>
                    <span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full mb-3">24 hrs</span>
                    <h3 class="font-bold text-primary text-sm mb-2">Cure &amp; Handover</h3>
                    <p class="text-xs text-secondary leading-relaxed">Touch dry in hours. Light use after 24 hours, full cure in 5-7 days. Masking removed, area cleaned up.</p>
                </div>
            </div>
        </div>

        <!-- MOBILE/TABLET: Vertical flexbox timeline -->
        <div class="lg:hidden space-y-0">
            <div class="flex gap-4 reveal">
                <div class="flex flex-col items-center flex-shrink-0">
                    <div class="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center"><div class="w-9 h-9 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-base font-black text-[#7a5c10]">1</span></div></div>
                    <div class="w-0.5 flex-1 bg-[#e7c08b]/30 mt-2"></div>
                </div>
                <div class="pb-8 pt-1">
                    <span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full inline-block mb-2">~30 min</span>
                    <h3 class="font-bold text-primary mb-1">Clean &amp; Prep</h3>
                    <p class="text-sm text-secondary leading-relaxed">Basin cleaned, degreased, and sanded. Surrounding benchtop, taps, and wall masked off.</p>
                </div>
            </div>
            <div class="flex gap-4 reveal">
                <div class="flex flex-col items-center flex-shrink-0">
                    <div class="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center"><div class="w-9 h-9 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-base font-black text-[#7a5c10]">2</span></div></div>
                    <div class="w-0.5 flex-1 bg-[#e7c08b]/30 mt-2"></div>
                </div>
                <div class="pb-8 pt-1">
                    <span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full inline-block mb-2">~30 min</span>
                    <h3 class="font-bold text-primary mb-1">Fill &amp; Sand</h3>
                    <p class="text-sm text-secondary leading-relaxed">Chips and cracks filled with two-part epoxy. Feathered and sanded flush for an invisible repair.</p>
                </div>
            </div>
            <div class="flex gap-4 reveal">
                <div class="flex flex-col items-center flex-shrink-0">
                    <div class="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center"><div class="w-9 h-9 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-base font-black text-[#7a5c10]">3</span></div></div>
                    <div class="w-0.5 flex-1 bg-[#e7c08b]/30 mt-2"></div>
                </div>
                <div class="pb-8 pt-1">
                    <span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full inline-block mb-2">1&ndash;2 hrs</span>
                    <h3 class="font-bold text-primary mb-1">Prime &amp; Coat</h3>
                    <p class="text-sm text-secondary leading-relaxed">Bonding primer then multiple coats of acrylic urethane topcoat. Spray-applied for a smooth, even finish.</p>
                </div>
            </div>
            <div class="flex gap-4 reveal">
                <div class="flex flex-col items-center flex-shrink-0">
                    <div class="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center"><div class="w-9 h-9 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-base font-black text-[#7a5c10]">4</span></div></div>
                </div>
                <div class="pt-1">
                    <span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full inline-block mb-2">24 hrs</span>
                    <h3 class="font-bold text-primary mb-1">Cure &amp; Handover</h3>
                    <p class="text-sm text-secondary leading-relaxed">Touch dry in hours. Light use after 24 hours, full cure in 5-7 days. Masking removed, area cleaned up.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ADD TO ANY JOB CTA (replaces Stone-Fleck — basin-specific upsell) -->
<section class="py-12 bg-primary text-white">
    <div class="max-w-4xl mx-auto px-6 sm:px-8">
        <div class="flex flex-col md:flex-row items-center gap-8">
            <div class="flex-shrink-0">
                <div class="w-24 h-24 rounded-xl bg-white/10 flex items-center justify-center">
                    <span class="material-symbols-outlined text-4xl text-tertiary-fixed-dim" style="font-variation-settings:'FILL' 1;" aria-hidden="true">add_circle</span>
                </div>
            </div>
            <div>
                <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.6rem] font-bold tracking-widest uppercase rounded mb-3">Best Value</span>
                <h2 class="text-2xl font-extrabold tracking-tight mb-2">Add Basin Restoration to Any Job</h2>
                <p class="text-white/80 text-sm leading-relaxed mb-4">Getting your bath resurfaced or tiles done? Add basin restoration while we&rsquo;re already set up. Same visit, shared prep time, better value than booking it separately.</p>
                <a href="#quote" class="inline-flex items-center gap-2 bg-white text-primary font-bold py-3 px-6 rounded-lg hover:bg-surface-container-low transition-colors text-sm">Get a Combined Quote <span class="material-symbols-outlined text-[18px]">arrow_forward</span></a>
            </div>
        </div>
    </div>
</section>

<!-- VALUE PROPOSITION -->
<section class="py-10 sm:py-12 bg-surface">
    <div class="max-w-6xl mx-auto px-6 sm:px-8">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter text-center mb-8">Why Choose Timeless?</h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
            <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5"><span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">bolt</span></div>
                <div><h3 class="font-bold text-primary text-sm">Free Quote in Hours</h3><p class="text-xs text-secondary leading-relaxed">Send photos, get a fixed price back. No home visit needed.</p></div>
            </div>
            <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5"><span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">schedule</span></div>
                <div><h3 class="font-bold text-primary text-sm">Same-Day Service</h3><p class="text-xs text-secondary leading-relaxed">Most basins done in 2-4 hours. Ready to use the next morning.</p></div>
            </div>
            <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5"><span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">verified_user</span></div>
                <div><h3 class="font-bold text-primary text-sm">Up to 3-Year Warranty</h3><p class="text-xs text-secondary leading-relaxed">Workmanship guaranteed. Fully insured with public liability.</p></div>
            </div>
            <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5"><span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">cleaning_services</span></div>
                <div><h3 class="font-bold text-primary text-sm">No Mess Guarantee</h3><p class="text-xs text-secondary leading-relaxed">Drop sheets, dust extraction, full cleanup. Cleaner than we found it.</p></div>
            </div>
        </div>
    </div>
</section>

<!-- GOOGLE REVIEWS -->
<section class="py-16 sm:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="text-center mb-10">
            <h2 class="text-3xl font-extrabold text-primary tracking-tighter mb-3">What Our Customers Say</h2>
            <div class="flex items-center justify-center gap-2"><div class="flex text-amber-400 text-lg">&#9733;&#9733;&#9733;&#9733;&#9733;</div><span class="text-sm font-bold text-primary">4.9</span><span class="text-xs text-secondary">Google Rating</span></div>
        </div>
        <script defer async src='https://cdn.trustindex.io/loader.js?fe231eb69ba66041914656a8b64'></script>
    </div>
</section>

<!-- FAQ -->
<section class="py-14 sm:py-16 bg-surface-container-low" id="faqs">
    <div class="max-w-6xl mx-auto px-6 sm:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter mb-3">Questions? We&rsquo;ve Got Answers</h2>
                <p class="text-sm text-secondary leading-relaxed mb-6">Not sure if restoration is right for your basin? Wondering about cost, timing, or what&rsquo;s involved? These are the questions we hear most. If you don&rsquo;t see yours here, send us a message or call. No pressure, no obligation.</p>
                <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all">Ask Us Anything <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
            </div>
            <div class="space-y-2">
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How much does basin restoration cost?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Every basin is different. The final price depends on the type of basin, the extent of damage, and whether it&rsquo;s a standalone job or part of a larger bathroom project. Send us photos and we&rsquo;ll have a fixed-price quote back within hours. No hidden fees, no obligation.</p></div></div>
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">What types of basins can you restore?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Porcelain, ceramic, cast iron enamel, acrylic, and fibreglass. Drop-in, undermount, pedestal, and wall-mounted configurations. If the basin is structurally sound, we can restore it.</p></div></div>
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How long does it take?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">2-4 hours on-site for a standalone basin. If done alongside bath or tile resurfacing, it adds roughly 1-1.5 hours to the visit. Light use after 24 hours, full cure in 5-7 days.</p></div></div>
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How long does a restored basin last?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">5-10 years with proper care. The 3-year warranty covers our workmanship. Beyond that, longevity depends on avoiding abrasive cleaners and harsh chemicals.</p></div></div>
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Can you change the basin colour?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Yes. 900+ colours available. White is the most popular choice, but we can match any colour you want.</p></div></div>
            </div>
        </div>
    </div>
</section>

<!-- QUOTE FORM -->
<section class="py-16 sm:py-20 bg-white" id="quote">
    <div class="max-w-4xl mx-auto px-6 sm:px-8">
        <div class="bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div class="p-6 sm:p-8 lg:p-12 bg-primary text-white">
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Get Your Free Basin Restoration Quote</h2>
                <p class="text-on-primary-container text-sm">5 minutes. No obligation. Fixed pricing guaranteed.</p>
            </div>
            <div class="p-6 sm:p-8 lg:p-12">
                <div class="flex items-center justify-between gap-4 mb-8 text-center">
                    <div class="flex-1"><div class="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">1</div><p class="text-[0.65rem] text-secondary font-medium"><strong class="text-primary block">Send photos</strong> of your basin</p></div>
                    <div class="flex-shrink-0 w-8 h-px bg-surface-container"></div>
                    <div class="flex-1"><div class="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">2</div><p class="text-[0.65rem] text-secondary font-medium"><strong class="text-primary block">Fixed-price quote</strong> within hours</p></div>
                    <div class="flex-shrink-0 w-8 h-px bg-surface-container"></div>
                    <div class="flex-1"><div class="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">3</div><p class="text-[0.65rem] text-secondary font-medium"><strong class="text-primary block">Book a date</strong> that suits you</p></div>
                </div>
                <form class="space-y-4" id="quote-form">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label class="text-xs font-bold text-primary uppercase tracking-wider block mb-1.5">Full Name *</label><input type="text" name="name" required class="w-full px-4 py-3 rounded-lg border border-surface-container bg-surface-container-low text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="John Citizen" /></div>
                        <div><label class="text-xs font-bold text-primary uppercase tracking-wider block mb-1.5">Phone *</label><input type="tel" name="phone" required class="w-full px-4 py-3 rounded-lg border border-surface-container bg-surface-container-low text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="0400 000 000" /></div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label class="text-xs font-bold text-primary uppercase tracking-wider block mb-1.5">Suburb *</label><input type="text" name="suburb" required class="w-full px-4 py-3 rounded-lg border border-surface-container bg-surface-container-low text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="e.g. Bondi, Parramatta" /></div>
                        <div><label class="text-xs font-bold text-primary uppercase tracking-wider block mb-1.5">Email</label><input type="email" name="email" class="w-full px-4 py-3 rounded-lg border border-surface-container bg-surface-container-low text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="you@email.com" /></div>
                    </div>
                    <div><label class="text-xs font-bold text-primary uppercase tracking-wider block mb-1.5">What do you need? *</label>
                        <div class="grid grid-cols-2 gap-2">
                            <label class="flex items-center gap-2 px-4 py-3 border border-surface-container rounded-lg cursor-pointer hover:border-primary transition-colors bg-surface-container-low text-sm"><input type="checkbox" name="service" value="Basin Restoration" checked class="text-primary rounded" /> Basin Restoration</label>
                            <label class="flex items-center gap-2 px-4 py-3 border border-surface-container rounded-lg cursor-pointer hover:border-primary transition-colors bg-surface-container-low text-sm"><input type="checkbox" name="service" value="Bath Resurfacing" class="text-primary rounded" /> Bath Resurfacing</label>
                            <label class="flex items-center gap-2 px-4 py-3 border border-surface-container rounded-lg cursor-pointer hover:border-primary transition-colors bg-surface-container-low text-sm"><input type="checkbox" name="service" value="Tile Resurfacing" class="text-primary rounded" /> Tile Resurfacing</label>
                            <label class="flex items-center gap-2 px-4 py-3 border border-surface-container rounded-lg cursor-pointer hover:border-primary transition-colors bg-surface-container-low text-sm"><input type="checkbox" name="service" value="Shower Regrouting" class="text-primary rounded" /> Shower Regrouting</label>
                        </div>
                    </div>
                    <div><label class="text-xs font-bold text-primary uppercase tracking-wider block mb-1.5">Anything else?</label><textarea name="message" rows="3" class="w-full px-4 py-3 rounded-lg border border-surface-container bg-surface-container-low text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none" placeholder="e.g. Basin has 3 chips near the tap, looking to get it done alongside bath resurfacing."></textarea></div>
                    <button class="w-full py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2" type="submit">Get My Free Basin Restoration Quote <span class="material-symbols-outlined" aria-hidden="true">send</span></button>
                    <p class="text-center text-[0.6rem] text-secondary">We respond within hours. No spam, ever.</p>
                </form>
            </div>
        </div>
    </div>
</section>

</main>

<script>
/* -- Hero Before/After Slider -- */
(function(){
    var slider = document.getElementById('hero-slider');
    if(!slider) return;
    var clip = document.getElementById('ba-clip');
    var line = document.getElementById('ba-line');
    var handle = document.getElementById('ba-handle');
    var bImg = document.getElementById('ba-before-img');
    var active = false;
    function syncWidth(){ var w = slider.offsetWidth + 'px'; if(bImg){ bImg.style.width = w; bImg.style.minWidth = w; bImg.style.maxWidth = w; } }
    syncWidth(); window.addEventListener('resize', syncWidth);
    function move(x){ var r = slider.getBoundingClientRect(); var pct = ((x - r.left) / r.width) * 100; pct = Math.max(3, Math.min(97, pct)); clip.style.width = pct + '%'; line.style.left = pct + '%'; handle.style.left = pct + '%'; }
    function startDrag(x,e){ active=true; move(x); if(e) e.preventDefault(); }
    handle.addEventListener('mousedown', function(e){ startDrag(e.clientX,e); });
    line.addEventListener('mousedown', function(e){ startDrag(e.clientX,e); });
    document.addEventListener('mousemove', function(e){ if(active) move(e.clientX); });
    document.addEventListener('mouseup', function(){ active=false; });
    handle.addEventListener('touchstart', function(e){ startDrag(e.touches[0].clientX,e); }, {passive:false});
    line.addEventListener('touchstart', function(e){ startDrag(e.touches[0].clientX,e); }, {passive:false});
    document.addEventListener('touchmove', function(e){ if(active){ e.preventDefault(); move(e.touches[0].clientX); } }, {passive:false});
    document.addEventListener('touchend', function(){ active=false; });
})();
</script>

<script>
/* -- Section BA Sliders (What We Fix) -- */
document.querySelectorAll(".ba-slider").forEach(function(slider){
    var clip=slider.querySelector(".ba-clip"),line=slider.querySelector(".ba-line"),handle=slider.querySelector(".ba-handle"),active=false;
    var bImg=slider.querySelector(".ba-before img") || slider.querySelector(".ba-before");
    if(!clip||!line||!handle) return;
    function sync(){if(bImg){var w=slider.offsetWidth+"px";bImg.style.width=w;bImg.style.minWidth=w;bImg.style.maxWidth=w;}}
    sync(); window.addEventListener("resize",sync);
    function move(x){var r=slider.getBoundingClientRect();var pct=((x-r.left)/r.width)*100;pct=Math.max(3,Math.min(97,pct));clip.style.width=pct+"%";line.style.left=pct+"%";handle.style.left=pct+"%";}
    function startDrag(x,e){active=true;move(x);if(e)e.preventDefault();}
    handle.addEventListener("mousedown",function(e){startDrag(e.clientX,e);});
    line.addEventListener("mousedown",function(e){startDrag(e.clientX,e);});
    document.addEventListener("mousemove",function(e){if(active)move(e.clientX);});
    document.addEventListener("mouseup",function(){active=false;});
    handle.addEventListener("touchstart",function(e){startDrag(e.touches[0].clientX,e);},{passive:false});
    line.addEventListener("touchstart",function(e){startDrag(e.touches[0].clientX,e);},{passive:false});
    document.addEventListener("touchmove",function(e){if(active){e.preventDefault();move(e.touches[0].clientX);}},{passive:false});
    document.addEventListener("touchend",function(){active=false;});
});
</script>

<script>
/* -- Logo Scroller Momentum Carousel -- */
(function(){
    var el = document.getElementById('logo-scroller');
    if(!el) return;
    el.style.overflow = 'hidden';

    var isDrag = false, startX = 0, scrollStart = 0;
    var velocity = 0, lastX = 0, lastTime = 0, animFrame = 0;
    var halfWidth = el.scrollWidth / 2;

    // Build dots
    var dotsBox = document.getElementById('logo-dots');
    if(dotsBox && dotsBox.children.length === 0){
        for(var i=0;i<8;i++){
            var d=document.createElement('span');
            d.className='inline-block rounded-full bg-slate-300 transition-all duration-200';
            d.style.width='8px'; d.style.height='8px';
            dotsBox.appendChild(d);
        }
    }

    // Start centered
    el.scrollLeft = halfWidth * 0.3;

    function loop(){
        if(el.scrollLeft <= 0) el.scrollLeft += halfWidth;
        else if(el.scrollLeft >= halfWidth) el.scrollLeft -= halfWidth;
    }

    function updateDots(){
        var dots = document.getElementById('logo-dots');
        if(!dots) return;
        var pct = (el.scrollLeft % halfWidth) / halfWidth;
        var idx = Math.round(pct * 7) % 8;
        for(var i=0; i<dots.children.length; i++){
            dots.children[i].style.width = i===idx ? '18px' : '8px';
            dots.children[i].style.background = i===idx ? '#041534' : '#cbd5e1';
        }
    }

    // Momentum coast after release
    function coast(){
        if(Math.abs(velocity) < 0.5){ velocity = 0; return; }
        velocity *= 0.95;
        el.scrollLeft -= velocity;
        loop();
        updateDots();
        animFrame = requestAnimationFrame(coast);
    }

    el.addEventListener('mousedown', function(e){
        isDrag = true;
        startX = e.pageX;
        scrollStart = el.scrollLeft;
        lastX = e.pageX;
        lastTime = Date.now();
        velocity = 0;
        cancelAnimationFrame(animFrame);
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e){
        if(!isDrag) return;
        var now = Date.now();
        var dt = now - lastTime;
        if(dt > 0) velocity = (e.pageX - lastX) / dt * 16;
        lastX = e.pageX;
        lastTime = now;
        el.scrollLeft = scrollStart - (e.pageX - startX);
        loop();
        updateDots();
    });

    document.addEventListener('mouseup', function(){
        if(!isDrag) return;
        isDrag = false;
        coast();
    });

    el.addEventListener('touchstart', function(e){
        isDrag = true;
        startX = e.touches[0].pageX;
        scrollStart = el.scrollLeft;
        lastX = e.touches[0].pageX;
        lastTime = Date.now();
        velocity = 0;
        cancelAnimationFrame(animFrame);
    }, {passive:true});

    document.addEventListener('touchmove', function(e){
        if(!isDrag) return;
        var now = Date.now();
        var dt = now - lastTime;
        if(dt > 0) velocity = (e.touches[0].pageX - lastX) / dt * 16;
        lastX = e.touches[0].pageX;
        lastTime = now;
        el.scrollLeft = scrollStart - (e.touches[0].pageX - startX);
        loop();
        updateDots();
    }, {passive:true});

    document.addEventListener('touchend', function(){
        if(!isDrag) return;
        isDrag = false;
        coast();
    });

    updateDots();
})();
</script>

<script>
/* -- FAQ Toggle -- */
window.toggleFaq = function(btn){ var item = btn.parentElement; var isOpen = item.classList.contains('open'); document.querySelectorAll('.faq-item').forEach(function(el){ el.classList.remove('open'); }); if(!isOpen) item.classList.add('open'); };

/* -- Scroll Reveal -- */
var obs = new IntersectionObserver(function(entries){ entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); } }); }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(function(el){ obs.observe(el); });
</script>

<?php get_footer(); ?>
