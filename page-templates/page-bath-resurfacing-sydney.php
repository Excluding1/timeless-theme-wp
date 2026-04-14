<?php /* Template Name: Bath Resurfacing Sydney */ ?>
<?php get_header(); ?>

<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Bath Resurfacing Sydney",
    "description": "Professional bath resurfacing and reglazing service in Sydney. Restore chipped, faded, or stained bathtubs to factory-new condition using a professional-grade system. Up to 10 year lifespan.",
    "provider": {
        "@type": "HomeAndConstructionBusiness",
        "name": "Timeless Resurfacing",
        "url": "https://timelessresurfacing.com.au",
        "telephone": "<?php echo timeless_phone_link(); ?>",
        "address": { "@type": "PostalAddress", "addressLocality": "Sydney", "addressRegion": "NSW", "addressCountry": "AU" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "23" }
    },
    "areaServed": { "@type": "City", "name": "Sydney" },
    "serviceType": "Bath Resurfacing"
}
</script>

<script type="application/ld+json">
{
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://timelessresurfacing.com.au/" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://timelessresurfacing.com.au/services/" },
        { "@type": "ListItem", "position": 3, "name": "Bath Resurfacing Sydney", "item": "https://timelessresurfacing.com.au/services/bath-resurfacing-sydney/" }
    ]
}
</script>

<script type="application/ld+json">
{
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "How much does bath resurfacing cost in Sydney?", "acceptedAnswer": { "@type": "Answer", "text": "Every bathroom is different. We provide fixed-price quotes based on your photos — no hidden fees, no surprises. Send us photos for a quote within hours." } },
        { "@type": "Question", "name": "How long does bath resurfacing take?", "acceptedAnswer": { "@type": "Answer", "text": "Most baths are completed in 5-8.5 hours (one day). Freestanding baths may take a full day due to extra prep for stripping old coatings. Your bath is usable 24-48 hours after completion." } },
        { "@type": "Question", "name": "How long does a resurfaced bath last?", "acceptedAnswer": { "@type": "Answer", "text": "up to 10 years with the professional-grade system. Commercial-grade acrylic urethane coating resists chipping, peeling, and yellowing." } },
        { "@type": "Question", "name": "Can you resurface any type of bath?", "acceptedAnswer": { "@type": "Answer", "text": "Yes: porcelain, enamel steel, cast iron, acrylic, fibreglass, and spa baths. We cannot resurface natural stone (marble/granite) baths — those need specialist stone restoration." } },
        { "@type": "Question", "name": "Can you change the bath colour?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Our system offers 900+ colour options. White and bone are most popular but any custom colour is available for a small surcharge." } }
    ]
}
</script>

<main>


<!-- BREADCRUMB -->
<div class="pt-24 pb-2 px-6 sm:px-8 max-w-7xl mx-auto">
    <nav class="text-xs text-secondary" aria-label="Breadcrumb">
        <ol class="flex items-center gap-1">
            <li><a href="/" class="hover:text-primary transition-colors">Home</a></li>
            <li><span class="mx-1">/</span></li>
            <li><a href="/#services" class="hover:text-primary transition-colors">Services</a></li>
            <li><span class="mx-1">/</span></li>
            <li class="text-primary font-medium">Bath Resurfacing</li>
        </ol>
    </nav>
</div>

<!-- HERO -->
<section class="pt-4 pb-16 sm:pb-20 bg-surface">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
            <span class="inline-block py-1 px-3 bg-tertiary-fixed-dim/30 text-primary text-[0.7rem] font-bold tracking-widest uppercase rounded mb-4">Service</span>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tighter leading-[0.95] mb-6 underline decoration-tertiary-fixed-dim decoration-[5px] underline-offset-[8px] [text-decoration-skip-ink:none]">
                Bath <span class="text-on-primary-container">Resurfacing</span>
            </h1>
            <p class="text-base sm:text-lg text-secondary leading-relaxed max-w-xl mb-6">
                Chipped, stained, or yellowed bathtub? We restore it to factory-new condition using a <strong>professional-grade system</strong> &mdash; a commercial-grade coating that lasts up to 10 years. Most jobs completed in a single day (freestanding baths may take 2-3 days), no demolition needed.
            </p>
            <div class="grid grid-cols-3 gap-3 sm:flex sm:items-center sm:gap-6 mb-8">
                <div class="text-center">
                    <p class="text-base sm:text-3xl font-extrabold text-primary whitespace-nowrap">Up to 80%</p>
                    <p class="text-xs text-secondary">Cheaper than reno</p>
                </div>
                <div class="hidden sm:block h-10 w-px bg-surface-container"></div>
                <div class="text-center">
                    <p class="text-base sm:text-3xl font-extrabold text-primary whitespace-nowrap">1 Day</p>
                    <p class="text-xs text-secondary">Most jobs</p>
                </div>
                <div class="hidden sm:block h-10 w-px bg-surface-container"></div>
                <div class="text-center">
                    <p class="text-base sm:text-3xl font-extrabold text-primary whitespace-nowrap">3yr</p>
                    <p class="text-xs text-secondary">Resurface warranty</p>
                </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-3">
                <a class="px-8 py-4 bg-primary text-white font-bold rounded-lg text-center hover:shadow-xl transition-all" href="#quote">Get Your Free Quote</a>
            </div>
        </div>
        <div class="aspect-[4/3] bg-surface-container-highest rounded-xl overflow-hidden shadow-xl">
            <img class="w-full h-full object-cover" alt="Professional bath resurfacing in Sydney - restored white bathtub in Surry Hills apartment" src="<?php echo get_template_directory_uri(); ?>/images/services/bath-resurfacing/hero.jpg" loading="eager" width="800" height="600" />
        </div>
    </div>
</section>

<!-- TRUST BAR -->
<section class="bg-primary text-white py-4">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 flex flex-wrap justify-center sm:justify-between items-center gap-4">
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified_user</span><span class="text-xs font-bold">Experienced &amp; Insured</span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">security</span><span class="text-xs font-bold">Public Liability Insured</span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified</span><span class="text-xs font-bold">3-Year Warranty</span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">schedule</span><span class="text-xs font-bold">One-Day Service</span></div>
    </div>
</section>

<!-- TRUST LOGO BAR -->
<section class="py-8 sm:py-10 bg-surface-container-low/50">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <p class="text-center text-sm text-secondary mb-6">Trusted by Hundreds of Australians &mdash; from Homeowners to Major Brands</p>
    </div>
    <div class="max-w-6xl mx-auto px-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing" id="logo-scroller" style="-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none;">
        <div class="flex items-center gap-8 sm:gap-12 w-max px-8" id="logo-inner">
            <span class="text-xl sm:text-2xl italic text-slate-400/70 whitespace-nowrap select-none" style="font-family:Georgia,serif;">Ray White.</span>
            <span class="text-2xl sm:text-3xl font-black tracking-tight text-slate-400/70 whitespace-nowrap select-none">McGrath</span>
            <span class="text-[0.65rem] sm:text-xs font-light tracking-[0.25em] uppercase text-slate-400/70 whitespace-nowrap select-none">The Agency</span>
            <span class="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-400/70 whitespace-nowrap select-none">LJ Hooker</span>
            <span class="text-lg sm:text-xl text-slate-400/70 whitespace-nowrap select-none" style="font-family:Georgia,serif;">Raine &amp; Horne</span>
            <span class="text-xl sm:text-2xl font-black tracking-tight text-slate-400/70 whitespace-nowrap select-none">Metricon</span>
            <span class="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-400/70 whitespace-nowrap select-none">Meriton</span>
            <span class="text-[0.7rem] sm:text-sm font-light tracking-[0.15em] uppercase text-slate-400/70 whitespace-nowrap select-none">Mirvac</span>
            <span class="text-xl sm:text-2xl italic text-slate-400/70 whitespace-nowrap select-none" style="font-family:Georgia,serif;">Ray White.</span>
            <span class="text-2xl sm:text-3xl font-black tracking-tight text-slate-400/70 whitespace-nowrap select-none">McGrath</span>
            <span class="text-[0.65rem] sm:text-xs font-light tracking-[0.25em] uppercase text-slate-400/70 whitespace-nowrap select-none">The Agency</span>
            <span class="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-400/70 whitespace-nowrap select-none">LJ Hooker</span>
            <span class="text-lg sm:text-xl text-slate-400/70 whitespace-nowrap select-none" style="font-family:Georgia,serif;">Raine &amp; Horne</span>
            <span class="text-xl sm:text-2xl font-black tracking-tight text-slate-400/70 whitespace-nowrap select-none">Metricon</span>
            <span class="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-400/70 whitespace-nowrap select-none">Meriton</span>
            <span class="text-[0.7rem] sm:text-sm font-light tracking-[0.15em] uppercase text-slate-400/70 whitespace-nowrap select-none">Mirvac</span>
        </div>
    </div>
    <div id="logo-dots" class="flex justify-center gap-1.5 mt-4"></div>
</section>

<!-- SECTION 2B: SERVICE DETAIL BLOCKS — Alternating zig-zag with branded before/after cards -->
<section class="py-16 sm:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <div class="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
            <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.65rem] font-bold tracking-widest uppercase rounded mb-3">Our Services</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">What We Fix</h2>
            <p class="text-secondary">Whatever's wrong with your bath &mdash; we've seen it and we've fixed it. From single chip repairs to full tub restoration &mdash; here&rsquo;s what we fix, how we do it, and what the results look like.</p>
        </div>

        <!-- BLOCK 1: Chip & Crack Repairs — text-left, image-right -->
        <div class="mb-12 lg:mb-16 reveal">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div class="order-2 lg:order-1">
                    <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Chip &amp; Crack Repairs</h3>
                    <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Dropped a shampoo bottle? Missing chunk of enamel? We repair chips, cracks, and holes in bathtubs using a two-part epoxy filler that matches your existing finish &mdash; no visible patch lines, no weak spots.</p>
                    <ul class="space-y-2.5 mb-6">
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Single chip or multi-chip repairs available</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Invisible colour-matched finish</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Most repairs done in under 2 hours</li>
                    </ul>
                    <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
                </div>
                <div class="order-1 lg:order-2">
                    <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none" style="aspect-ratio:3/2;cursor:ew-resize;">
                        <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-50 via-white to-[#e7c08b]/20 flex items-center justify-center">
                            <span class="material-symbols-outlined text-4xl sm:text-5xl text-emerald-500" aria-hidden="true">verified</span>
                        </div>
                        <div class="ba-clip absolute top-0 left-0 bottom-0 overflow-hidden" style="width:50%;">
                            <div class="ba-before absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center">
                                <span class="material-symbols-outlined text-4xl sm:text-5xl text-slate-400" aria-hidden="true">broken_image</span>
                            </div>
                        </div>
                        <div class="ba-line absolute top-0 bottom-0 w-0.5 bg-white" style="left:50%;z-index:20;pointer-events:none;"></div>
                        <div class="ba-handle absolute top-1/2 w-11 h-11 -mt-[22px] -ml-[22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </div>
                        <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">Before</span>
                        <span class="absolute top-3 right-3 bg-white/80 text-[#041534] text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">After</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- BLOCK 2: Stain & Yellowing Removal — image-left, text-right (alternated) -->
        <div class="mb-12 lg:mb-16 reveal">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div class="order-2 lg:order-2">
                    <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Stain &amp; Yellowing Removal</h3>
                    <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Yellow rust stains from a dripping tap? Brown hard-water deposits? Old enamel gone dull and grey? We strip decades of stains and restore the original white finish &mdash; no abrasive cleaning, no bleach damage.</p>
                    <ul class="space-y-2.5 mb-6">
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Removes rust, calcium, soap scum buildup</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Restores factory-smooth surface feel</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Cheaper than full resurface for surface-only stains</li>
                    </ul>
                    <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
                </div>
                <div class="order-1 lg:order-1">
                    <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none" style="aspect-ratio:3/2;cursor:ew-resize;">
                        <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-50 via-white to-[#e7c08b]/20 flex items-center justify-center">
                            <span class="material-symbols-outlined text-4xl sm:text-5xl text-emerald-500" aria-hidden="true">auto_awesome</span>
                        </div>
                        <div class="ba-clip absolute top-0 left-0 bottom-0 overflow-hidden" style="width:50%;">
                            <div class="ba-before absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center">
                                <span class="material-symbols-outlined text-4xl sm:text-5xl text-slate-400" aria-hidden="true">water_drop</span>
                            </div>
                        </div>
                        <div class="ba-line absolute top-0 bottom-0 w-0.5 bg-white" style="left:50%;z-index:20;pointer-events:none;"></div>
                        <div class="ba-handle absolute top-1/2 w-11 h-11 -mt-[22px] -ml-[22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </div>
                        <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">Before</span>
                        <span class="absolute top-3 right-3 bg-white/80 text-[#041534] text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">After</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- BLOCK 3: Peeling & Failed DIY Repair — text-left, image-right -->
        <div class="mb-12 lg:mb-16 reveal">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div class="order-2 lg:order-1">
                    <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Peeling &amp; Failed DIY Repair</h3>
                    <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Tried a Bunnings kit and it&rsquo;s peeling within 6 months? We strip ALL the old coating back to the original surface, properly etch and prime, then apply a professional two-part acrylic urethane. No shortcuts, no peeling.</p>
                    <ul class="space-y-2.5 mb-6">
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Full strip and restart &mdash; not coating over</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Professional commercial-grade coating</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Up to 10 year finish with proper care</li>
                    </ul>
                    <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
                </div>
                <div class="order-1 lg:order-2">
                    <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none" style="aspect-ratio:3/2;cursor:ew-resize;">
                        <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-50 via-white to-[#e7c08b]/20 flex items-center justify-center">
                            <span class="material-symbols-outlined text-4xl sm:text-5xl text-emerald-500" aria-hidden="true">restart_alt</span>
                        </div>
                        <div class="ba-clip absolute top-0 left-0 bottom-0 overflow-hidden" style="width:50%;">
                            <div class="ba-before absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center">
                                <span class="material-symbols-outlined text-4xl sm:text-5xl text-slate-400" aria-hidden="true">error</span>
                            </div>
                        </div>
                        <div class="ba-line absolute top-0 bottom-0 w-0.5 bg-white" style="left:50%;z-index:20;pointer-events:none;"></div>
                        <div class="ba-handle absolute top-1/2 w-11 h-11 -mt-[22px] -ml-[22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </div>
                        <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">Before</span>
                        <span class="absolute top-3 right-3 bg-white/80 text-[#041534] text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">After</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- BLOCK 4: Full Bath Resurface — image-left, text-right (alternated) -->
        <div class="reveal">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div class="order-2 lg:order-2">
                    <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Full Bath Resurface</h3>
                    <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Complete restoration for acrylic, porcelain, cast iron, or fibreglass baths. Even freestanding and clawfoot tubs. Full prep, chip repair, primer, and multi-layer spray coating for a factory-new finish. Done in one day.</p>
                    <ul class="space-y-2.5 mb-6">
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Works on all bath materials &amp; shapes</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Choose from white, ivory, or 900+ custom colours</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Up to 3-year workmanship warranty</li>
                    </ul>
                    <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
                </div>
                <div class="order-1 lg:order-1">
                    <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none" style="aspect-ratio:3/2;cursor:ew-resize;">
                        <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-50 via-white to-[#e7c08b]/20 flex items-center justify-center">
                            <span class="material-symbols-outlined text-4xl sm:text-5xl text-emerald-500" aria-hidden="true">verified</span>
                        </div>
                        <div class="ba-clip absolute top-0 left-0 bottom-0 overflow-hidden" style="width:50%;">
                            <div class="ba-before absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center">
                                <span class="material-symbols-outlined text-4xl sm:text-5xl text-slate-400" aria-hidden="true">bathtub</span>
                            </div>
                        </div>
                        <div class="ba-line absolute top-0 bottom-0 w-0.5 bg-white" style="left:50%;z-index:20;pointer-events:none;"></div>
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

<!-- OUR PROCESS -->
<section class="py-16 sm:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="max-w-3xl mx-auto text-center mb-12">
            <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.65rem] font-bold tracking-widest uppercase rounded mb-3">Our Process</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">How We Resurface Your Bath</h2>
            <p class="text-secondary">Every step exists for a reason. Here&rsquo;s exactly what we do and why.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div class="bg-surface-container-low rounded-2xl p-6 reveal">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-full bg-[#e7c08b]/20 flex items-center justify-center flex-shrink-0"><span class="text-sm font-black text-[#c99a55]">1</span></div>
                    <h3 class="font-bold text-primary">Assessment &amp; Repair</h3>
                </div>
                <p class="text-sm text-secondary leading-relaxed">Inspect for chips, cracks, and damage. Fill and sand any defects with two-part epoxy so the surface is completely smooth.</p>
            </div>
            <div class="bg-surface-container-low rounded-2xl p-6 reveal">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-full bg-[#e7c08b]/20 flex items-center justify-center flex-shrink-0"><span class="text-sm font-black text-[#c99a55]">2</span></div>
                    <h3 class="font-bold text-primary">Surface Preparation</h3>
                </div>
                <p class="text-sm text-secondary leading-relaxed">Chemical etching and degreasing creates microscopic grooves for the coating to bond to. This separates professional work from DIY kits.</p>
            </div>
            <div class="bg-surface-container-low rounded-2xl p-6 reveal">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-full bg-[#e7c08b]/20 flex items-center justify-center flex-shrink-0"><span class="text-sm font-black text-[#c99a55]">3</span></div>
                    <h3 class="font-bold text-primary">Priming</h3>
                </div>
                <p class="text-sm text-secondary leading-relaxed">Specialist adhesion primer bonds to both the original surface and the top coat, creating a bridge between old and new.</p>
            </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto lg:max-w-[calc(66.666%+0.75rem)]">
            <div class="bg-surface-container-low rounded-2xl p-6 reveal">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-full bg-[#e7c08b]/20 flex items-center justify-center flex-shrink-0"><span class="text-sm font-black text-[#c99a55]">4</span></div>
                    <h3 class="font-bold text-primary">Top Coat Application</h3>
                </div>
                <p class="text-sm text-secondary leading-relaxed">Professional spray-applied coating in multiple thin layers. Factory-smooth, glass-like finish with no brush marks.</p>
            </div>
            <div class="bg-surface-container-low rounded-2xl p-6 reveal">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-full bg-[#e7c08b]/20 flex items-center justify-center flex-shrink-0"><span class="text-sm font-black text-[#c99a55]">5</span></div>
                    <h3 class="font-bold text-primary">Cure &amp; Quality Check</h3>
                </div>
                <p class="text-sm text-secondary leading-relaxed">24-hour cure at room temperature. Final inspection for consistency and finish quality. Bath ready to use the next day.</p>
            </div>
        </div>
        <div class="mt-8 max-w-2xl mx-auto p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-3">
            <span class="material-symbols-outlined text-primary flex-shrink-0" aria-hidden="true">cleaning_services</span>
            <div>
                <h4 class="font-bold text-primary text-sm">No Mess Guarantee</h4>
                <p class="text-xs text-secondary">We contain the work area, vacuum all dust, and leave your bathroom cleaner than we found it.</p>
            </div>
        </div>
    </div>
</section>

<!-- VALUE PROPOSITION — Compact horizontal strip -->
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
                    <p class="text-xs text-secondary leading-relaxed">Most baths done in one day. Ready to use the next morning.</p>
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

<!-- RESURFACING vs REPLACEMENT -->
<section class="py-16 sm:py-20 bg-surface-container-low">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <h2 class="text-3xl font-extrabold text-primary tracking-tighter mb-4">Full Replacement vs Our Resurfacing</h2>
        <p class="text-secondary max-w-3xl mb-10">Why spend thousands removing and replacing your bath when resurfacing delivers a like-new result for a fraction of the cost?</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <div class="bg-primary/[0.03] rounded-xl p-8 border-2 border-primary ring-1 ring-primary/10">
                <h3 class="font-bold text-primary mb-4 flex items-center gap-2"><span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;" aria-hidden="true">star</span> Resurfacing (Recommended)</h3>
                <ul class="space-y-3 text-sm text-secondary">
                    <li class="flex items-start gap-2"><span class="text-primary font-bold">+</span> A fraction of the cost &mdash; <a href="#quote" class="underline">get a free quote</a></li>
                    <li class="flex items-start gap-2"><span class="text-primary font-bold">+</span> Most jobs completed in 1 day</li>
                    <li class="flex items-start gap-2"><span class="text-primary font-bold">+</span> No plumbing required</li>
                    <li class="flex items-start gap-2"><span class="text-primary font-bold">+</span> No demolition</li>
                    <li class="flex items-start gap-2"><span class="text-primary font-bold">+</span> Bath ready to use next day</li>
                </ul>
            </div>
            <div class="bg-white rounded-xl p-8 border-2 border-surface-container">
                <h3 class="font-bold text-primary mb-4 flex items-center gap-2"><span class="material-symbols-outlined" aria-hidden="true">cancel</span> Full Replacement</h3>
                <ul class="space-y-3 text-sm text-secondary">
                    <li class="flex items-start gap-2"><span class="text-error font-bold">&minus;</span> Cost: thousands more &mdash; <a href="#quote" class="underline">get a free quote</a></li>
                    <li class="flex items-start gap-2"><span class="text-error font-bold">&minus;</span> Takes 3-5 days</li>
                    <li class="flex items-start gap-2"><span class="text-error font-bold">&minus;</span> Plumber required</li>
                    <li class="flex items-start gap-2"><span class="text-error font-bold">&minus;</span> Demolition needed</li>
                    <li class="flex items-start gap-2"><span class="text-error font-bold">&minus;</span> 1-2 week disruption</li>
                </ul>
            </div>
        </div>
    </div>
</section>

<!-- COMPACT MID-PAGE CTA -->
<div class="bg-primary py-5 sm:py-6">
    <div class="max-w-5xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-white font-bold text-sm sm:text-base text-center sm:text-left">Ready to get started? Send us photos for a free quote in hours.</p>
        <a href="#quote" class="flex-shrink-0 px-6 py-3 bg-white text-primary font-bold text-sm rounded-lg hover:shadow-lg transition-all whitespace-nowrap">Get Your Free Quote &rarr;</a>
    </div>
</div>

<!-- TESTIMONIALS — Horizontal carousel with arrows -->
<section class="py-16 sm:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="text-center mb-10">
                <h2 class="text-3xl font-extrabold text-primary tracking-tighter mb-3">What Our Customers Say</h2>
                <div class="flex items-center justify-center gap-2"><div class="flex text-amber-400 text-lg">&#9733;&#9733;&#9733;&#9733;&#9733;</div><span class="text-sm font-bold text-primary">4.9</span><span class="text-xs text-secondary">Google Rating</span></div>
        </div>
        <div id="bath-wp-testimonial-carousel" class="overflow-hidden">
            <div id="bath-wp-testimonial-track" class="flex gap-6 transition-transform duration-300 ease-out" style="transform: translateX(0);">
                <div class="bath-wp-t-card flex-shrink-0 bg-surface-container-low rounded-xl p-6">
                    <div class="flex text-amber-400 text-sm mb-3">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                    <p class="text-sm text-secondary leading-relaxed mb-4">&ldquo;Our bath was chipped everywhere and stained yellow. They resurfaced it in one day and it looks factory new. Should have done this years ago instead of staring at those chips!&rdquo;</p>
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">K</div>
                        <div><p class="text-sm font-bold text-primary">Karen W.</p><p class="text-[0.65rem] text-outline">Surry Hills &middot; Bath Resurfacing</p></div>
                    </div>
                </div>
                <div class="bath-wp-t-card flex-shrink-0 bg-surface-container-low rounded-xl p-6">
                    <div class="flex text-amber-400 text-sm mb-3">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                    <p class="text-sm text-secondary leading-relaxed mb-4">&ldquo;Had an ugly pink bath from the 80s. They changed it to white and it looks like a brand new install. My partner couldn&rsquo;t believe it was the same bath. Amazing value for money.&rdquo;</p>
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">J</div>
                        <div><p class="text-sm font-bold text-primary">James L.</p><p class="text-[0.65rem] text-outline">Bondi Beach &middot; Colour Change</p></div>
                    </div>
                </div>
                <div class="bath-wp-t-card flex-shrink-0 bg-surface-container-low rounded-xl p-6">
                    <div class="flex text-amber-400 text-sm mb-3">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                    <p class="text-sm text-secondary leading-relaxed mb-4">&ldquo;We manage 8 rental properties and Timeless handles all our bath resurfacing. Quick turnarounds, fair pricing, and the tenants love the result. Highly recommend for property managers.&rdquo;</p>
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">D</div>
                        <div><p class="text-sm font-bold text-primary">David C.</p><p class="text-[0.65rem] text-outline">Property Manager &middot; Western Sydney</p></div>
                    </div>
                </div>
                <div class="bath-wp-t-card flex-shrink-0 bg-surface-container-low rounded-xl p-6">
                    <div class="flex text-amber-400 text-sm mb-3">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                    <p class="text-sm text-secondary leading-relaxed mb-4">&ldquo;Restored our 1920s cast iron clawfoot bath. I was told the only option was replacement for $5,000+. Timeless brought it back to life for a fraction of that. Absolutely stunning result.&rdquo;</p>
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">M</div>
                        <div><p class="text-sm font-bold text-primary">Margaret S.</p><p class="text-[0.65rem] text-outline">Paddington &middot; Cast Iron Restoration</p></div>
                    </div>
                </div>
                <div class="bath-wp-t-card flex-shrink-0 bg-surface-container-low rounded-xl p-6">
                    <div class="flex text-amber-400 text-sm mb-3">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                    <p class="text-sm text-secondary leading-relaxed mb-4">&ldquo;Peeling DIY paint mess turned into a perfect factory-smooth finish. Should have called Timeless from the start instead of wasting money on Bunnings kits that failed.&rdquo;</p>
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">T</div>
                        <div><p class="text-sm font-bold text-primary">Tom R.</p><p class="text-[0.65rem] text-outline">Marrickville &middot; DIY Strip &amp; Resurface</p></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Arrow navigation below reviews -->
        <div class="flex justify-center items-center gap-3 mt-8">
            <button type="button" onclick="moveBathWpTestimonials(-1)" aria-label="Previous testimonial" class="w-10 h-10 rounded-full border border-surface-container bg-white hover:bg-surface-container-low flex items-center justify-center transition-colors"><span class="material-symbols-outlined text-primary" aria-hidden="true">chevron_left</span></button>
            <button type="button" onclick="moveBathWpTestimonials(1)" aria-label="Next testimonial" class="w-10 h-10 rounded-full border border-surface-container bg-white hover:bg-surface-container-low flex items-center justify-center transition-colors"><span class="material-symbols-outlined text-primary" aria-hidden="true">chevron_right</span></button>
        </div>
    </div>
</section>

<!-- FAQ -->
<section class="py-14 sm:py-16 bg-surface-container-low" id="faqs">
    <div class="max-w-6xl mx-auto px-6 sm:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <!-- Left: intro -->
            <div>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter mb-3">Questions? We&rsquo;ve Got Answers</h2>
                <p class="text-sm text-secondary leading-relaxed mb-6">Not sure if resurfacing is right for your bathroom? Wondering about cost, timing, or what&rsquo;s involved? These are the questions we hear most from Sydney homeowners. If you don&rsquo;t see yours here, send us a message or call &mdash; we&rsquo;re always happy to chat through your options, no pressure.</p>
                <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all">Ask Us Anything <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
            </div>
            <!-- Right: accordion -->
            <div class="space-y-2">
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How much does bath resurfacing cost?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Every bath is different. Send us photos and we&rsquo;ll have a fixed-price quote back within hours &mdash; no hidden fees, no obligation.</p></div></div>
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How long does it take?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Most baths are done in 5&ndash;8 hours. Your bath is ready to use again the next day.</p></div></div>
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How long does it last?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">10&ndash;15 years with proper care. Every job comes with a 3-year workmanship warranty.</p></div></div>
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Can you resurface any type of bath?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Yes &mdash; porcelain, enamel, cast iron, acrylic, and fibreglass. The only exception is natural stone.</p></div></div>
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Can you change the colour?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Yes &mdash; 900+ colours available. White and ivory are most popular, but we can match anything.</p></div></div>
            </div>
        </div>
    </div>
</section>

<!-- QUOTE FORM -->
<section class="py-16 sm:py-20 bg-surface-container-low" id="quote">
    <div class="max-w-4xl mx-auto px-6 sm:px-8">
        <div class="bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div class="p-6 sm:p-8 lg:p-12 bg-primary text-white">
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Get Your Free Bath Resurfacing Quote</h2>
                <p class="text-on-primary-container text-sm">5 minutes. No obligation. Fixed pricing guaranteed.</p>
            </div>
            <form class="timeless-quote-form p-6 sm:p-8 lg:p-12 space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label for="name" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Full Name *</label><input id="name" name="name" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="John Citizen" required /></div>
                    <div><label for="phone" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Phone *</label><input id="phone" name="phone" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="0400 000 000" type="tel" required /></div>
                </div>
                <div><label for="address" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Suburb *</label><input id="address" name="address" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. Parramatta, Bondi, Surry Hills" required /></div>
                <div>
                    <label class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">What type of bath?</label>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" checked /> Standard bathtub</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Large bathtub</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Freestanding/clawfoot</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Spa bath</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Bath + basin combo</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Chip repair only</label>
                    </div>
                </div>
                <div><label for="notes" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Anything else?</label><textarea id="notes" name="notes" rows="3" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="e.g. bath is chipped, colour is outdated, stains won't come out..."></textarea></div>
                <button class="w-full py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2" type="submit">Get My Free Bath Resurfacing Quote <span class="material-symbols-outlined" aria-hidden="true">send</span></button>
                <p class="text-center text-[0.6rem] text-secondary">We respond within hours. No spam, ever.</p>
            </form>
        </div>
    </div>
</section>

</main>

<script>
/* -- Testimonial Carousel (JS-measured widths) -- */
(function(){
    var container = document.getElementById('bath-wp-testimonial-carousel');
    var track = document.getElementById('bath-wp-testimonial-track');
    if (!container || !track) return;

    var GAP = 24; // gap-6 in Tailwind
    var cards = track.querySelectorAll('.bath-wp-t-card');
    var total = cards.length;
    var index = 0;

    function perView() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 640) return 2;
        return 1;
    }

    function sizeCards() {
        var w = container.offsetWidth;
        var view = perView();
        var cardW = (w - GAP * (view - 1)) / view;
        cards.forEach(function(c) {
            c.style.width = cardW + 'px';
            c.style.minWidth = cardW + 'px';
        });
        var maxIndex = Math.max(0, total - view);
        if (index > maxIndex) index = maxIndex;
        applyTransform();
    }

    function applyTransform() {
        var w = container.offsetWidth;
        var view = perView();
        var cardW = (w - GAP * (view - 1)) / view;
        var offset = index * (cardW + GAP);
        track.style.transform = 'translateX(-' + offset + 'px)';
    }

    window.moveBathWpTestimonials = function(dir) {
        var view = perView();
        var maxIndex = Math.max(0, total - view);
        index += dir;
        if (index < 0) index = maxIndex;
        if (index > maxIndex) index = 0;
        applyTransform();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', sizeCards);
    } else {
        sizeCards();
    }
    window.addEventListener('resize', sizeCards);
})();
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

<?php get_footer(); ?>
