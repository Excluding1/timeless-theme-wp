<?php /* Template Name: Vanity Refinishing Sydney */ ?>
<?php get_header(); ?>

<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Vanity Refinishing Sydney",
    "description": "Professional vanity refinishing in Sydney. Benchtop resurfacing, cabinet resprays, stone-fleck granite finishes. Done in a day, 3-year warranty, up to 80% cheaper than replacement.",
    "provider": {
        "@type": "HomeAndConstructionBusiness",
        "name": "Timeless Resurfacing",
        "url": "https://timelessresurfacing.com.au",
        "telephone": "<?php echo timeless_phone_link(); ?>",
        "address": { "@type": "PostalAddress", "addressLocality": "Sydney", "addressRegion": "NSW", "addressCountry": "AU" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "23" }
    },
    "areaServed": { "@type": "City", "name": "Sydney" },
    "serviceType": "Vanity Refinishing",
    "offers": {
        "@type": "Offer",
        "priceCurrency": "AUD",
        "price": "470",
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock"
    }
}
</script>

<script type="application/ld+json">
{
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://timelessresurfacing.com.au/" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://timelessresurfacing.com.au/services/" },
        { "@type": "ListItem", "position": 3, "name": "Vanity Refinishing Sydney", "item": "https://timelessresurfacing.com.au/services/vanity-refinishing-sydney/" }
    ]
}
</script>

<script type="application/ld+json">
{
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "How much does vanity refinishing cost in Sydney?", "acceptedAnswer": { "@type": "Answer", "text": "Vanity refinishing starts from $470 inc GST. The final price depends on the size of the vanity and what's included. Cabinet doors only, benchtop only, or the full unit. Stone-fleck finishes are a premium upgrade. We provide fixed-price quotes from photos." } },
        { "@type": "Question", "name": "What surfaces can you refinish?", "acceptedAnswer": { "@type": "Answer", "text": "We refinish timber, MDF, laminate, melamine, and previously painted vanity surfaces. This includes cabinet doors, benchtops, drawer fronts, and side panels. If it's structurally sound, we can refinish it." } },
        { "@type": "Question", "name": "What finishes are available?", "acceptedAnswer": { "@type": "Answer", "text": "We offer a range of finishes including solid colours (white, grey, navy, black, and custom colours), satin and gloss options, and our premium stone-fleck finish that mimics the look of granite or marble. We can colour-match to any sample you provide." } },
        { "@type": "Question", "name": "How long does the refinishing last?", "acceptedAnswer": { "@type": "Answer", "text": "Our vanity refinishing comes with a 3-year warranty. With normal use and care, a professional refinish will last 7-10+ years before needing attention. The key is proper prep and using professional-grade 2-pack coatings, not consumer paint." } }
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
            <li class="text-white font-medium">Vanity Refinishing Sydney</li>
        </ol>
    </nav>
</div>

<!-- HERO (Medium-dark background - Vanity Refinishing variant) -->
<section class="pt-4 pb-16 sm:pb-20 bg-[#1b2a4a] text-white" style="margin-top:-96px; padding-top:120px;">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
            <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.7rem] font-bold tracking-widest uppercase rounded mb-4">Transform in a Day</span>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-[0.95] mb-6">
                Vanity <span class="text-tertiary-fixed-dim">Refinishing</span>
            </h1>
            <p class="text-base sm:text-lg text-white/80 leading-relaxed max-w-xl mb-6">
                Tired-looking vanity dragging down your bathroom? We refinish benchtops, resurface vanity tops, and respray cabinets with professional-grade coatings. Transform your vanity in hours, no replacement needed.
            </p>
            <div class="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
                <div class="text-center bg-white/10 rounded-lg px-2 sm:px-3 py-3">
                    <p class="text-base sm:text-xl lg:text-2xl font-extrabold leading-tight">Up to 80%</p>
                    <p class="text-[0.6rem] sm:text-[0.65rem] text-white/60 font-medium mt-1">Cheaper than new</p>
                </div>
                <div class="text-center bg-white/10 rounded-lg px-2 sm:px-3 py-3">
                    <p class="text-base sm:text-xl lg:text-2xl font-extrabold leading-tight">1 Day</p>
                    <p class="text-[0.6rem] sm:text-[0.65rem] text-white/60 font-medium mt-1">Most jobs</p>
                </div>
                <div class="text-center bg-white/10 rounded-lg px-2 sm:px-3 py-3">
                    <p class="text-base sm:text-xl lg:text-2xl font-extrabold leading-tight">3yr</p>
                    <p class="text-[0.6rem] sm:text-[0.65rem] text-white/60 font-medium mt-1">Refinish warranty</p>
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
                    <img src="<?php echo get_template_directory_uri(); ?>/images/services/vanity-refinishing/hero-after.png" alt="Refinished vanity, modern white gloss finish" class="w-full h-full object-cover" />
                </div>
                <!-- BEFORE image -->
                <div id="ba-clip" class="absolute top-0 left-0 bottom-0 overflow-hidden" style="width:50%;">
                    <img id="ba-before-img" src="<?php echo get_template_directory_uri(); ?>/images/services/vanity-refinishing/hero-before.png" alt="Worn vanity before refinishing" class="object-cover" style="position:absolute;top:0;left:0;height:100%;width:200%;" />
                </div>
                <div id="ba-line" class="absolute top-0 bottom-0 w-0.5 bg-white" style="left:50%;z-index:20;cursor:ew-resize;"></div>
                <div id="ba-handle" class="absolute top-1/2 w-11 h-11 -mt-[22px] -ml-[22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">Before</span>
                <span class="absolute top-3 right-3 bg-white/80 text-primary text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">After</span>
                <div class="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 bg-white/90 backdrop-blur-md rounded-lg flex justify-between items-center" style="z-index:15;">
                    <span class="text-xs font-bold text-primary">Drag to Compare</span>
                    <span class="text-xs font-bold text-on-primary-container">Transformed in 1 Day</span>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- TRUST BAR -->
<section class="bg-primary text-white py-4">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 flex flex-wrap justify-center sm:justify-between items-center gap-4">
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified_user</span><span class="text-xs font-bold">Experienced &amp; Insured</span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">security</span><span class="text-xs font-bold">Public Liability Insured</span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified</span><span class="text-xs font-bold">3-Year Warranty</span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">schedule</span><span class="text-xs font-bold">Done in a Day</span></div>
    </div>
</section>

<!-- TRUST LOGO BAR — Draggable carousel with company logos -->
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

<!-- SECTION 2B — What We Fix (problem-focused, homeowner language) -->
<section class="py-16 sm:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <div class="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
            <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.65rem] font-bold tracking-widest uppercase rounded mb-3">Our Services</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">What We Fix</h2>
            <p class="text-secondary">Whatever&rsquo;s wrong with your vanity, we&rsquo;ve seen it and fixed it. Here&rsquo;s what we fix, how we do it, and what the results look like.</p>
        </div>

        <!-- BLOCK 1: Peeling & Lifting Laminate — text-left, image-right -->
        <div class="mb-12 lg:mb-16 reveal">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div class="order-2 lg:order-1">
                    <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Peeling &amp; Lifting Laminate</h3>
                    <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Laminate bubbling off the edges of your benchtop? Cabinet doors with peeled strips showing raw MDF underneath? Steam and humidity cause laminate to separate over time. We strip the failing edges, seal the substrate, then respray the whole vanity with a 2-pack polyurethane coating that locks everything down.</p>
                    <ul class="space-y-2.5 mb-6">
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Fixes bubbling, lifting, and peeling edges</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Seals substrate to stop future water damage</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> 2-pack polyurethane coating, durable &amp; glossy</li>
                    </ul>
                    <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
                </div>
                <div class="order-1 lg:order-2">
                    <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none" style="aspect-ratio:3/2;cursor:ew-resize;">
                        <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-50 via-white to-[#e7c08b]/20 flex items-center justify-center">
                            <img src="<?php echo get_template_directory_uri(); ?>/images/services/vanity-refinishing/peeling-after.png" alt="Refinished vanity after peeling laminate repair" class="w-full h-full object-cover absolute inset-0" />
                        </div>
                        <div class="ba-clip absolute top-0 left-0 bottom-0 overflow-hidden" style="width:50%;">
                            <div class="ba-before absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center">
                                <img src="<?php echo get_template_directory_uri(); ?>/images/services/vanity-refinishing/peeling-before.png" alt="Vanity with peeling lifting laminate" class="w-full h-full object-cover absolute inset-0" />
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

        <!-- BLOCK 2: Dated & Dull Finish — image-left, text-right (alternated) -->
        <div class="mb-12 lg:mb-16 reveal">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div class="order-2 lg:order-2">
                    <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Dated &amp; Dull Finish</h3>
                    <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Brown oak laminate from the 90s? Beige vanity everyone else replaced years ago? Gloss worn flat so the surface looks tired even when clean? We respray the whole vanity in any modern colour. Crisp white, soft grey, black, stone-fleck texture. Instant 20-year upgrade.</p>
                    <ul class="space-y-2.5 mb-6">
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> 900+ colours including stone-fleck textures</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Factory-smooth gloss or satin finish</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Matches the rest of your bathroom instantly</li>
                    </ul>
                    <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
                </div>
                <div class="order-1 lg:order-1">
                    <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none" style="aspect-ratio:3/2;cursor:ew-resize;">
                        <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-50 via-white to-[#e7c08b]/20 flex items-center justify-center">
                            <img src="<?php echo get_template_directory_uri(); ?>/images/services/vanity-refinishing/dated-after.png" alt="Modern refinished vanity after colour change" class="w-full h-full object-cover absolute inset-0" />
                        </div>
                        <div class="ba-clip absolute top-0 left-0 bottom-0 overflow-hidden" style="width:50%;">
                            <div class="ba-before absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center">
                                <img src="<?php echo get_template_directory_uri(); ?>/images/services/vanity-refinishing/dated-before.png" alt="Dated dull vanity with outdated finish" class="w-full h-full object-cover absolute inset-0" />
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

        <!-- BLOCK 3: Scratched, Stained & Water-Damaged — text-left, image-right -->
        <div class="reveal">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div class="order-2 lg:order-1">
                    <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Scratched, Stained &amp; Water-Damaged</h3>
                    <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Scratches from years of use? Dark mineral stains around the taps? Heat marks from hair straighteners or curling irons? These sit in the top layer where cleaning can&rsquo;t reach. We fill the scratches, prep the surface, then spray a fresh coat over the top. Benchtop looks showroom-new.</p>
                    <ul class="space-y-2.5 mb-6">
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Covers scratches, water marks, heat damage</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> New surface resists future staining</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Easier to clean than bare laminate</li>
                    </ul>
                    <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
                </div>
                <div class="order-1 lg:order-2">
                    <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none" style="aspect-ratio:3/2;cursor:ew-resize;">
                        <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-50 via-white to-[#e7c08b]/20 flex items-center justify-center">
                            <img src="<?php echo get_template_directory_uri(); ?>/images/services/vanity-refinishing/scratched-after.png" alt="Smooth refinished vanity after scratch and stain removal" class="w-full h-full object-cover absolute inset-0" />
                        </div>
                        <div class="ba-clip absolute top-0 left-0 bottom-0 overflow-hidden" style="width:50%;">
                            <div class="ba-before absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center">
                                <img src="<?php echo get_template_directory_uri(); ?>/images/services/vanity-refinishing/scratched-before.png" alt="Scratched stained vanity with water damage" class="w-full h-full object-cover absolute inset-0" />
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

<!-- PERFECT FOR THESE VANITIES -->
<section class="py-16 sm:py-20 bg-surface-container-low">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="max-w-3xl mx-auto text-center mb-10 lg:mb-12">
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">Perfect For These Vanities</h2>
            <p class="text-secondary">No need to rip it out. If your vanity is structurally sound but looks tired, refinishing is the answer.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white rounded-xl p-6 text-center reveal shadow-sm transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg">
                <span class="material-symbols-outlined text-3xl text-primary mb-3 block" aria-hidden="true">door_front</span>
                <h3 class="font-bold text-primary mb-2">Dated Timber or Oak</h3>
                <p class="text-sm text-secondary leading-relaxed">Those honey-oak or dark timber vanities from the &rsquo;90s and 2000s. We transform them into a modern finish. White, grey, or custom colour.</p>
            </div>
            <div class="bg-white rounded-xl p-6 text-center reveal shadow-sm transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg">
                <span class="material-symbols-outlined text-3xl text-primary mb-3 block" aria-hidden="true">wb_sunny</span>
                <h3 class="font-bold text-primary mb-2">Yellowed or Faded Laminate</h3>
                <p class="text-sm text-secondary leading-relaxed">White laminate that&rsquo;s gone yellow over time. We strip, prime, and recoat for a crisp, bright finish.</p>
            </div>
            <div class="bg-white rounded-xl p-6 text-center reveal shadow-sm transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg">
                <span class="material-symbols-outlined text-3xl text-primary mb-3 block" aria-hidden="true">texture</span>
                <h3 class="font-bold text-primary mb-2">Scratched or Worn Surfaces</h3>
                <p class="text-sm text-secondary leading-relaxed">Surface wear, water marks, and scratches from years of daily use. Sanded back and recoated to perfection.</p>
            </div>
            <div class="bg-white rounded-xl p-6 text-center reveal shadow-sm transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg">
                <span class="material-symbols-outlined text-3xl text-primary mb-3 block" aria-hidden="true">apartment</span>
                <h3 class="font-bold text-primary mb-2">Rental &amp; Landlord Refresh</h3>
                <p class="text-sm text-secondary leading-relaxed">Quick turnaround between tenants. Refresh a dated vanity in hours instead of replacing it over days.</p>
            </div>
        </div>
    </div>
</section>

<!-- NEW VANITY vs REFINISHING COMPARISON (decision point before the process) -->
<section class="py-16 sm:py-20 bg-surface-container-low">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="text-center mb-12">
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">New Vanity vs Refinishing</h2>
            <p class="text-secondary max-w-2xl mx-auto">Why spend thousands replacing your vanity when refinishing costs up to 80% less?</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <!-- LEFT: Buy New Vanity (Red / Bad) -->
            <div class="bg-red-50/50 rounded-2xl p-8 border-2 border-red-200 relative overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal">
                <div class="absolute top-0 right-0 bg-red-100 text-red-700 text-[0.6rem] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">Expensive</div>
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-red-600" aria-hidden="true">close</span></div>
                    <h3 class="text-xl font-extrabold text-primary">Buy a New Vanity</h3>
                </div>
                <ul class="space-y-4">
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-red-500 text-lg mt-0.5 flex-shrink-0" aria-hidden="true">close</span>
                        <div><p class="font-bold text-primary text-sm">$2,000 &ndash; $5,000+</p><p class="text-xs text-secondary">Vanity + plumber + installer + disposal</p></div>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-red-500 text-lg mt-0.5 flex-shrink-0" aria-hidden="true">close</span>
                        <div><p class="font-bold text-primary text-sm">Weeks of waiting</p><p class="text-xs text-secondary">Cabinet maker lead times + install day</p></div>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-red-500 text-lg mt-0.5 flex-shrink-0" aria-hidden="true">close</span>
                        <div><p class="font-bold text-primary text-sm">Plumber required</p><p class="text-xs text-secondary">Disconnect &amp; reconnect taps and waste</p></div>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-red-500 text-lg mt-0.5 flex-shrink-0" aria-hidden="true">close</span>
                        <div><p class="font-bold text-primary text-sm">Demolition and mess</p><p class="text-xs text-secondary">Rip-out, waste removal, wall patching</p></div>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-red-500 text-lg mt-0.5 flex-shrink-0" aria-hidden="true">close</span>
                        <div><p class="font-bold text-primary text-sm">May not fit</p><p class="text-xs text-secondary">New unit may clash with existing plumbing or layout</p></div>
                    </li>
                </ul>
            </div>
            <!-- RIGHT: Our Refinishing (Green / Good) -->
            <div class="bg-green-50/50 rounded-2xl p-8 border-2 border-green-300 relative overflow-hidden ring-2 ring-green-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 reveal">
                <div class="absolute top-0 right-0 bg-green-100 text-green-700 text-[0.6rem] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">Recommended</div>
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-green-600" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span></div>
                    <h3 class="text-xl font-extrabold text-primary">Our Refinishing</h3>
                </div>
                <ul class="space-y-4">
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-green-600 text-lg mt-0.5 flex-shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span>
                        <div><p class="font-bold text-primary text-sm">Fixed-Price Quote</p><p class="text-xs text-secondary">Send photos for your price</p></div>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-green-600 text-lg mt-0.5 flex-shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span>
                        <div><p class="font-bold text-primary text-sm">Done in 1 day</p><p class="text-xs text-secondary">Most vanities completed same day</p></div>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-green-600 text-lg mt-0.5 flex-shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span>
                        <div><p class="font-bold text-primary text-sm">No plumber needed</p><p class="text-xs text-secondary">Taps stay connected, no disconnection</p></div>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-green-600 text-lg mt-0.5 flex-shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span>
                        <div><p class="font-bold text-primary text-sm">Zero demolition</p><p class="text-xs text-secondary">No dust, no noise, no wall damage</p></div>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-green-600 text-lg mt-0.5 flex-shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span>
                        <div><p class="font-bold text-primary text-sm">Usable next day</p><p class="text-xs text-secondary">Light use after 24 hours, full cure in 7 days</p></div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</section>

<!-- PROCESS STEPS (Numbered Flat Cards - 4 steps) -->
<section class="py-16 sm:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="max-w-3xl mx-auto text-center mb-10 lg:mb-12">
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">How We Refinish Your Vanity</h2>
            <p class="text-secondary">A 4-step professional process for a factory-quality finish.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-surface-container-low rounded-xl p-6 reveal">
                <span class="text-4xl font-black text-primary/20 block mb-2">01</span>
                <h3 class="font-bold text-primary text-sm mb-2">Prep &amp; Clean</h3>
                <p class="text-xs text-secondary leading-relaxed">Surface sanded, degreased, and cleaned. Handles and hardware removed. Surrounding areas masked and protected.</p>
            </div>
            <div class="bg-surface-container-low rounded-xl p-6 reveal">
                <span class="text-4xl font-black text-primary/20 block mb-2">02</span>
                <h3 class="font-bold text-primary text-sm mb-2">Prime</h3>
                <p class="text-xs text-secondary leading-relaxed">Bonding primer applied for maximum adhesion. This is the key to a finish that lasts years, not months.</p>
            </div>
            <div class="bg-surface-container-low rounded-xl p-6 reveal">
                <span class="text-4xl font-black text-primary/20 block mb-2">03</span>
                <h3 class="font-bold text-primary text-sm mb-2">Coat</h3>
                <p class="text-xs text-secondary leading-relaxed">Multiple coats of professional-grade 2-pack polyurethane or enamel. Satin, semi-gloss, or gloss finish to your choice.</p>
            </div>
            <div class="bg-surface-container-low rounded-xl p-6 reveal">
                <span class="text-4xl font-black text-primary/20 block mb-2">04</span>
                <h3 class="font-bold text-primary text-sm mb-2">Cure</h3>
                <p class="text-xs text-secondary leading-relaxed">Hardware re-fitted. Light use after 24 hours, full cure in 7 days. Result: a factory-smooth finish that lasts.</p>
            </div>
        </div>
    </div>
</section>

<!-- STONE-FLECK UPGRADE CALLOUT -->
<section class="py-12 bg-primary text-white">
    <div class="max-w-4xl mx-auto px-6 sm:px-8">
        <div class="flex flex-col md:flex-row items-center gap-8">
            <div class="flex-shrink-0">
                <div class="w-24 h-24 rounded-xl bg-white/10 flex items-center justify-center">
                    <span class="material-symbols-outlined text-4xl text-tertiary-fixed-dim" style="font-variation-settings:'FILL' 1;" aria-hidden="true">diamond</span>
                </div>
            </div>
            <div>
                <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.6rem] font-bold tracking-widest uppercase rounded mb-3">Premium Upgrade</span>
                <h2 class="text-2xl font-extrabold tracking-tight mb-2">Stone-Fleck Finish</h2>
                <p class="text-white/80 text-sm leading-relaxed mb-4">Want the look of granite or marble without the price? Our premium stone-fleck finish creates a realistic stone texture on your vanity benchtop. Multiple colours available. Charcoal, sandstone, marble white, and more.</p>
                <a href="#quote" class="inline-flex items-center gap-2 bg-white text-primary font-bold py-3 px-6 rounded-lg hover:bg-surface-container-low transition-colors text-sm">Ask About Stone-Fleck <span class="material-symbols-outlined text-[18px]">arrow_forward</span></a>
            </div>
        </div>
    </div>
</section>

<!-- VALUE PROPOSITION — Compact horizontal strip (matches bath/tile) -->
<section class="py-10 sm:py-12 bg-surface">
    <div class="max-w-6xl mx-auto px-6 sm:px-8">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter text-center mb-8">Why Choose Timeless?</h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
            <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">bolt</span>
                </div>
                <div>
                    <h3 class="font-bold text-primary text-sm">Free Quote in Hours</h3>
                    <p class="text-xs text-secondary leading-relaxed">Send photos, get a fixed price back. No home visit needed.</p>
                </div>
            </div>
            <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">schedule</span>
                </div>
                <div>
                    <h3 class="font-bold text-primary text-sm">Same-Day Service</h3>
                    <p class="text-xs text-secondary leading-relaxed">Most vanities done in one day. Ready to use the next morning.</p>
                </div>
            </div>
            <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">verified_user</span>
                </div>
                <div>
                    <h3 class="font-bold text-primary text-sm">Up to 3-Year Warranty</h3>
                    <p class="text-xs text-secondary leading-relaxed">Workmanship guaranteed. Fully insured with public liability.</p>
                </div>
            </div>
            <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">cleaning_services</span>
                </div>
                <div>
                    <h3 class="font-bold text-primary text-sm">No Mess Guarantee</h3>
                    <p class="text-xs text-secondary leading-relaxed">Drop sheets, dust extraction, full cleanup. Cleaner than we found it.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- GOOGLE REVIEWS — Auto-updating via Trustindex -->
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
<section class="py-16 sm:py-20 bg-surface-container-low" id="faqs">
    <div class="max-w-3xl mx-auto px-6 sm:px-8">
        <h2 class="text-3xl font-extrabold text-primary tracking-tighter mb-4 text-center">Vanity Refinishing FAQs</h2>
        <p class="text-secondary text-center mb-10">Common questions about vanity refinishing in Sydney.</p>
        <div class="space-y-3">
            <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How much does vanity refinishing cost in Sydney?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Vanity refinishing starts from $470 inc GST. The final price depends on the size of the vanity and what&rsquo;s included. Cabinet doors only, benchtop only, or the full unit. Stone-fleck finishes are a premium upgrade. We provide fixed-price quotes from photos.</p></div></div>
            <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">What surfaces can you refinish?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">We refinish timber, MDF, laminate, melamine, and previously painted vanity surfaces. This includes cabinet doors, benchtops, drawer fronts, and side panels. If it&rsquo;s structurally sound, we can refinish it.</p></div></div>
            <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">What finishes are available?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">We offer a range of finishes including solid colours (white, grey, navy, black, and custom colours), satin and gloss options, and our premium stone-fleck finish that mimics the look of granite or marble. We can colour-match to any sample you provide.</p></div></div>
            <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How long does the refinishing last?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Our vanity refinishing comes with a 3-year warranty. With normal use and care, a professional refinish will last 7&ndash;10+ years before needing attention. The key is proper prep and using professional-grade 2-pack coatings, not consumer paint.</p></div></div>
        </div>
    </div>
</section>

<!-- QUOTE FORM -->
<section class="py-16 sm:py-20 bg-white" id="quote">
    <div class="max-w-4xl mx-auto px-6 sm:px-8">
        <div class="bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div class="p-6 sm:p-8 lg:p-12 bg-primary text-white">
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Get Your Free Vanity Refinishing Quote</h2>
                <p class="text-on-primary-container text-sm">5 minutes. No obligation. Fixed pricing guaranteed.</p>
            </div>
            <div class="px-6 sm:px-8 lg:px-12 pt-8 pb-4">
                <div class="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center text-center sm:text-left">
                    <div class="flex items-center gap-3"><span class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">1</span><span class="text-xs text-secondary"><strong class="text-primary">Send photos</strong> of your vanity</span></div>
                    <span class="hidden sm:block text-surface-container-highest">&rarr;</span>
                    <div class="flex items-center gap-3"><span class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">2</span><span class="text-xs text-secondary"><strong class="text-primary">Fixed-price quote</strong> within hours</span></div>
                    <span class="hidden sm:block text-surface-container-highest">&rarr;</span>
                    <div class="flex items-center gap-3"><span class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">3</span><span class="text-xs text-secondary"><strong class="text-primary">Book a date</strong> that suits you</span></div>
                </div>
            </div>
            <form class="timeless-quote-form p-6 sm:p-8 lg:p-12 pt-6 space-y-6" onsubmit="event.preventDefault(); alert('Quote submitted! (Preview mode)');">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label for="name" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Full Name *</label><input id="name" name="name" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="John Citizen" required /></div>
                    <div><label for="phone" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Phone *</label><input id="phone" name="phone" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="0400 000 000" type="tel" required /></div>
                </div>
                <div><label for="address" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Suburb *</label><input id="address" name="address" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. Parramatta, Bondi, Surry Hills" required /></div>
                <div>
                    <label class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">What needs refinishing?</label>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" checked /> Vanity cabinet doors</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Benchtop/countertop</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Full vanity unit</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Stone-fleck finish</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Basin too</label>
                    </div>
                </div>
                <div><label for="notes" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Anything else?</label><textarea id="notes" name="notes" rows="3" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="e.g. vanity material (timber, laminate), desired colour/finish, number of doors..."></textarea></div>
                <button class="w-full py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2" type="submit">Get My Free Refinishing Quote <span class="material-symbols-outlined" aria-hidden="true">send</span></button>
                <p class="text-center text-[0.6rem] text-secondary">We respond within hours. No spam, ever.</p>
            </form>
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
