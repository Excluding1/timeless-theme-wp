<?php /* Template Name: Shower Regrouting Sydney */ ?>
<?php get_header(); ?>

<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Shower Regrouting Sydney",
    "description": "Professional shower regrouting in Sydney. Full grout removal and replacement with epoxy or cement grout. Same-day service. Epoxy: 5-year warranty. Cement: 2-year warranty.",
    "provider": {
        "@type": "HomeAndConstructionBusiness",
        "name": "Timeless Resurfacing",
        "url": "https://timelessresurfacing.com.au",
        "telephone": "<?php echo timeless_phone_link(); ?>",
        "address": { "@type": "PostalAddress", "addressLocality": "Sydney", "addressRegion": "NSW", "addressCountry": "AU" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "23" }
    },
    "areaServed": { "@type": "City", "name": "Sydney" },
    "serviceType": "Shower Regrouting"
}
</script>

<script type="application/ld+json">
{
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://timelessresurfacing.com.au/" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://timelessresurfacing.com.au/services/" },
        { "@type": "ListItem", "position": 3, "name": "Shower Regrouting Sydney", "item": "https://timelessresurfacing.com.au/services/shower-regrouting-sydney/" }
    ]
}
</script>

<script type="application/ld+json">
{
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "How much does shower regrouting cost in Sydney?", "acceptedAnswer": { "@type": "Answer", "text": "Every shower is different. The cost depends on shower size, tile type, grout choice (epoxy or cement), and current condition. Send us photos and we'll have a fixed-price quote back within hours. No hidden fees." } },
        { "@type": "Question", "name": "How long does shower regrouting take?", "acceptedAnswer": { "@type": "Answer", "text": "Most standard showers are completed in 4-8 hours (one day). Larger showers or full bathroom regrouts may take a second day. The shower can be used again 24-48 hours after completion." } },
        { "@type": "Question", "name": "What is the difference between epoxy and cement grout?", "acceptedAnswer": { "@type": "Answer", "text": "Epoxy grout is 100% waterproof, stain-proof, and mould-resistant. It never needs sealing and lasts 15-20 years. Cement grout is cheaper but porous, absorbs water, and needs periodic sealing. For showers, we recommend epoxy." } },
        { "@type": "Question", "name": "Can you regrout without removing the tiles?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. We remove the old grout 2-4mm deep using precision tools, then fill with fresh grout. Your tiles stay exactly where they are." } },
        { "@type": "Question", "name": "Do you replace silicone too?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. We strip and replace all silicone in corners and where tiles meet the bath, shower base, or fixtures. Silicone replacement is included in every full regrout." } },
        { "@type": "Question", "name": "Will the grout removal crack my tiles?", "acceptedAnswer": { "@type": "Answer", "text": "We use precision oscillating tools that cut grout without touching the tile face. The risk of tile damage is extremely low. If a tile is already loose or cracked, we flag it before we start." } }
    ]
}
</script>
<main id="main-content">

<!-- BREADCRUMB -->
<div class="pt-24 pb-2 px-6 sm:px-8 max-w-7xl mx-auto">
    <nav class="text-xs text-secondary" aria-label="Breadcrumb">
        <ol class="flex items-center gap-1">
            <li><a href="<?php echo esc_url( home_url('/') ); ?>" class="hover:text-primary transition-colors">Home</a></li>
            <li><span class="mx-1">/</span></li>
            <li><a href="<?php echo esc_url( home_url('/services/') ); ?>" class="hover:text-primary transition-colors">Services</a></li>
            <li><span class="mx-1">/</span></li>
            <li class="text-primary font-medium">Shower Regrouting Sydney</li>
        </ol>
    </nav>
</div>

<!-- HERO (Light background — matches tile template) -->
<section class="pt-4 pb-10 sm:pb-16 bg-surface">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div class="relative">
            <div class="absolute inset-0 bg-linear-to-br from-surface via-transparent to-transparent rounded-3xl -z-10 -m-4"></div>
            <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.7rem] font-bold tracking-widest uppercase rounded-sm mb-4">Waterproof Guarantee</span>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tighter leading-[0.95] mb-3 underline decoration-tertiary-fixed-dim decoration-[5px] underline-offset-8 [text-decoration-skip-ink:none]">
                Shower Regrouting
            </h1>
            <div class="h-0 mb-3"></div>
            <p class="text-base sm:text-lg text-secondary leading-relaxed max-w-xl mb-6">
                Mouldy, cracked, or discoloured grout letting water behind your tiles? We remove every joint and replace it with fresh grout. Epoxy or cement. Your tiles stay, the problems go.
            </p>
            <!-- MOBILE: Hero image between paragraph and stats -->
            <div class="md:hidden mb-6">
                <div class="rounded-xl overflow-hidden shadow-2xl relative" style="aspect-ratio:4/3;">
                    <img src="<?php echo get_template_directory_uri(); ?>/images/services/shower-regrouting/hero.png" alt="Shower regrouting before and after comparison" class="w-full h-full object-cover" />
                    <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">Before</span>
                    <span class="absolute top-3 right-3 bg-white/80 text-primary text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">After</span>
                    <div class="absolute bottom-3 left-3 right-3 p-3 bg-white/90 backdrop-blur-md rounded-lg flex justify-between items-center" style="z-index:15;">
                        <span class="text-xs font-bold text-primary">Before &amp; After</span>
                        <span class="text-xs font-bold text-on-primary-container">Completed in 1 Day</span>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
                <div class="text-center bg-surface-container-low rounded-lg px-2 sm:px-3 py-3">
                    <p class="text-base sm:text-xl lg:text-2xl font-extrabold text-primary leading-tight">1 Day</p>
                    <p class="text-[0.6rem] sm:text-[0.65rem] text-secondary font-medium mt-1">Most showers</p>
                </div>
                <div class="text-center bg-surface-container-low rounded-lg px-2 sm:px-3 py-3">
                    <p class="text-base sm:text-xl lg:text-2xl font-extrabold text-primary leading-tight">Epoxy</p>
                    <p class="text-[0.6rem] sm:text-[0.65rem] text-secondary font-medium mt-1">Available</p>
                </div>
                <div class="text-center bg-surface-container-low rounded-lg px-2 sm:px-3 py-3">
                    <p class="text-base sm:text-xl lg:text-2xl font-extrabold text-primary leading-tight">Up to 5yr</p>
                    <p class="text-[0.6rem] sm:text-[0.65rem] text-secondary font-medium mt-1">Epoxy warranty</p>
                </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 mb-4">
                <a class="px-8 py-4 bg-primary text-white font-bold rounded-lg text-center hover:shadow-xl transition-all" href="#quote">Get Your Free Quote</a>
            </div>
            <p class="text-xs text-secondary"><span class="material-symbols-outlined text-sm align-text-bottom text-tertiary-fixed-dim" aria-hidden="true">photo_camera</span> Send photos &rarr; quote in hours. No obligation.</p>
            <div class="mt-6 flex items-center gap-3">
                <div class="flex -space-x-2" aria-hidden="true">
                    <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/reviews/reviewer-1.png" alt="" class="w-8 h-8 rounded-full border-2 border-white object-cover" width="96" height="96" loading="lazy" />
                    <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/reviews/reviewer-2.png" alt="" class="w-8 h-8 rounded-full border-2 border-white object-cover" width="96" height="96" loading="lazy" />
                    <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/reviews/reviewer-3.png" alt="" class="w-8 h-8 rounded-full border-2 border-white object-cover" width="96" height="96" loading="lazy" />
                </div>
                <p class="text-sm font-medium text-secondary"><strong class="text-primary">4.9&#9733;</strong> Google Rating from NSW Homeowners</p>
            </div>
        </div>
        <div class="hidden md:block">
            <!-- HERO IMAGE (DESKTOP — single side-by-side before/after image) -->
            <div class="rounded-xl overflow-hidden shadow-2xl relative" style="aspect-ratio:4/3;">
                <img src="<?php echo get_template_directory_uri(); ?>/images/services/shower-regrouting/hero.png" alt="Shower regrouting before and after comparison" class="w-full h-full object-cover" />
                <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">Before</span>
                <span class="absolute top-3 right-3 bg-white/80 text-primary text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">After</span>
                <div class="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 bg-white/90 backdrop-blur-md rounded-lg flex justify-between items-center" style="z-index:15;">
                    <span class="text-xs font-bold text-primary">Before &amp; After</span>
                    <span class="text-xs font-bold text-on-primary-container">Completed in 1 Day</span>
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
        <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified</span><span class="text-xs font-bold">Up to 5-Year Warranty</span></div>
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
            <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-1.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /><img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-2.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /><img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-3.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /><img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-4.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /><img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-5.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /><img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-6.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /><img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-7.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /><img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-8.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /><img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-9.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /><img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-10.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /><img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-1.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /><img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-2.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /><img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-3.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /><img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-4.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /><img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-5.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /><img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-6.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /><img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-7.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /><img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-8.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /><img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-9.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /><img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-10.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" />
        </div>
    </div>
    <div id="logo-dots" class="flex justify-center gap-1.5 mt-4"></div>
</section>

<!-- SECTION 2B — What We Fix -->
<section class="py-16 sm:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <div class="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
            <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.65rem] font-bold tracking-widest uppercase rounded-sm mb-3">Our Services</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">What We Fix</h2>
            <p class="text-secondary">These are the grout problems we see every week in Sydney showers. If yours looks like any of these, we can fix it in a day.</p>
        </div>

        <!-- BLOCK 1: Mouldy Shower Grout -->
        <div class="mb-12 lg:mb-16 reveal">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div class="order-2 lg:order-1">
                    <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Mouldy Shower Grout</h3>
                    <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Black mould keeps coming back no matter how many times you bleach it? That&rsquo;s because the mould is <em>inside</em> the grout, not just on the surface. Cement grout is porous. Once mould roots into it, cleaning only removes what you can see. The only fix is removing the infected grout entirely and starting fresh.</p>
                    <ul class="space-y-2.5 mb-6">
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Full grout removal, not just a clean</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Epoxy option eliminates future mould growth</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> All silicone corners replaced at the same time</li>
                    </ul>
                    <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
                </div>
                <div class="order-1 lg:order-2">
                    <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none mx-auto w-full max-w-md" style="aspect-ratio:3/2;cursor:ew-resize;">
                        <div class="absolute inset-0 w-full h-full bg-linear-to-br from-emerald-50 via-white to-[#e7c08b]/20 flex items-center justify-center"><img src="<?php echo get_template_directory_uri(); ?>/images/services/shower-regrouting/mouldy-after.png" alt="Clean shower grout after mould removal and regrouting" class="w-full h-full object-cover absolute inset-0" /></div>
                        <div class="ba-clip absolute top-0 left-0 bottom-0 overflow-hidden" style="width:50%;"><div class="ba-before absolute inset-0 bg-linear-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center"><img src="<?php echo get_template_directory_uri(); ?>/images/services/shower-regrouting/mouldy-before.png" alt="Mouldy shower grout before regrouting" class="w-full h-full object-cover absolute inset-0" /></div></div>
                        <div class="ba-line absolute top-0 bottom-0 w-0.5 bg-white" style="left:50%;z-index:20;cursor:ew-resize;"></div>
                        <div class="ba-handle absolute top-1/2 w-11 h-11 mt-[-22px] ml-[-22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                        <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">Before</span>
                        <span class="absolute top-3 right-3 bg-white/80 text-[#041534] text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">After</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- BLOCK 2: Cracked & Crumbling Grout -->
        <div class="mb-12 lg:mb-16 reveal">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div class="order-2 lg:order-2">
                    <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Cracked &amp; Crumbling Grout</h3>
                    <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Hairline cracks in the grout between your tiles? Chunks falling out when you run your finger along the joint? Every crack is a pathway for water to get behind your tiles and into the wall cavity. Left alone, this leads to waterproofing failure and structural damage.</p>
                    <ul class="space-y-2.5 mb-6">
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Stops water penetration at the source</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Prevents expensive waterproofing repairs</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> No tiles removed or replaced</li>
                    </ul>
                    <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
                </div>
                <div class="order-1 lg:order-1">
                    <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none mx-auto w-full max-w-md" style="aspect-ratio:3/2;cursor:ew-resize;">
                        <div class="absolute inset-0 w-full h-full bg-linear-to-br from-emerald-50 via-white to-[#e7c08b]/20 flex items-center justify-center"><img src="<?php echo get_template_directory_uri(); ?>/images/services/shower-regrouting/crumbling-after.png" alt="Repaired shower grout after crumbling fix" class="w-full h-full object-cover absolute inset-0" /></div>
                        <div class="ba-clip absolute top-0 left-0 bottom-0 overflow-hidden" style="width:50%;"><div class="ba-before absolute inset-0 bg-linear-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center"><img src="<?php echo get_template_directory_uri(); ?>/images/services/shower-regrouting/crumbling-before.png" alt="Cracked crumbling shower grout" class="w-full h-full object-cover absolute inset-0" /></div></div>
                        <div class="ba-line absolute top-0 bottom-0 w-0.5 bg-white" style="left:50%;z-index:20;cursor:ew-resize;"></div>
                        <div class="ba-handle absolute top-1/2 w-11 h-11 mt-[-22px] ml-[-22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                        <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">Before</span>
                        <span class="absolute top-3 right-3 bg-white/80 text-[#041534] text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">After</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- BLOCK 3: Discoloured & Stained Grout -->
        <div class="reveal">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div class="order-2 lg:order-1">
                    <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Discoloured &amp; Stained Grout</h3>
                    <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Grout started white but now it&rsquo;s brown, yellow, or patchy? Years of soap scum, body oils, and Sydney hard water stain cement grout permanently. No amount of scrubbing restores the original colour. We replace it entirely so every joint is uniform, bright, and sealed.</p>
                    <ul class="space-y-2.5 mb-6">
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Every joint removed and replaced fresh</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Uniform colour across the whole shower</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Epoxy option stays stain-free for 15-20 years</li>
                    </ul>
                    <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
                </div>
                <div class="order-1 lg:order-2">
                    <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none mx-auto w-full max-w-md" style="aspect-ratio:3/2;cursor:ew-resize;">
                        <div class="absolute inset-0 w-full h-full bg-linear-to-br from-emerald-50 via-white to-[#e7c08b]/20 flex items-center justify-center"><img src="<?php echo get_template_directory_uri(); ?>/images/services/shower-regrouting/discoloured-after.png" alt="Clean white grout after discolouration removal" class="w-full h-full object-cover absolute inset-0" /></div>
                        <div class="ba-clip absolute top-0 left-0 bottom-0 overflow-hidden" style="width:50%;"><div class="ba-before absolute inset-0 bg-linear-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center"><img src="<?php echo get_template_directory_uri(); ?>/images/services/shower-regrouting/discoloured-before.png" alt="Discoloured stained shower grout" class="w-full h-full object-cover absolute inset-0" /></div></div>
                        <div class="ba-line absolute top-0 bottom-0 w-0.5 bg-white" style="left:50%;z-index:20;cursor:ew-resize;"></div>
                        <div class="ba-handle absolute top-1/2 w-11 h-11 mt-[-22px] ml-[-22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                        <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">Before</span>
                        <span class="absolute top-3 right-3 bg-white/80 text-[#041534] text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">After</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- WHY YOU CAN'T IGNORE IT — Urgency section unique to regrouting -->
<section class="py-16 sm:py-20 bg-surface-container-low">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="max-w-3xl mx-auto text-center mb-10 lg:mb-12">
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">Why You Can&rsquo;t Ignore Bad Grout</h2>
            <p class="text-secondary">Cracked grout isn&rsquo;t just ugly. It&rsquo;s actively letting water into places it shouldn&rsquo;t be.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-xl p-6 reveal border-l-4 border-error shadow-xs transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg">
                <span class="material-symbols-outlined text-3xl text-error mb-3 block" aria-hidden="true">water_damage</span>
                <h3 class="font-bold text-primary mb-2">Water Behind Tiles</h3>
                <p class="text-sm text-secondary leading-relaxed">Every crack in your grout is a pathway for water. It seeps behind tiles, saturates wall framing, and causes damage you can&rsquo;t see until it&rsquo;s expensive to fix.</p>
            </div>
            <div class="bg-white rounded-xl p-6 reveal border-l-4 border-error shadow-xs transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg">
                <span class="material-symbols-outlined text-3xl text-error mb-3 block" aria-hidden="true">coronavirus</span>
                <h3 class="font-bold text-primary mb-2">Mould Spreads Fast</h3>
                <p class="text-sm text-secondary leading-relaxed">Mould spreads through porous grout joints and embeds deeper every time the shower gets wet. Once it&rsquo;s inside the wall cavity, surface cleaning does nothing. It&rsquo;s a health risk, not just cosmetic.</p>
            </div>
            <div class="bg-white rounded-xl p-6 reveal border-l-4 border-error shadow-xs transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg">
                <span class="material-symbols-outlined text-3xl text-error mb-3 block" aria-hidden="true">engineering</span>
                <h3 class="font-bold text-primary mb-2">Waterproofing Failure</h3>
                <p class="text-sm text-secondary leading-relaxed">If water reaches the waterproofing membrane and it fails, the repair involves removing ALL tiles, re-waterproofing, and retiling. Depending on shower size and substrate damage, that&rsquo;s a $5,000-$15,000 job. Regrouting prevents it.</p>
            </div>
        </div>
    </div>
</section>

<!-- EPOXY vs CEMENT GROUT COMPARISON (red/green cards) -->
<section class="py-16 sm:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="text-center mb-12">
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">Cement vs Epoxy Grout</h2>
            <p class="text-secondary max-w-2xl mx-auto">We offer both. The right choice depends on your budget and how long you want it to last.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div class="bg-blue-50/50 rounded-2xl border-2 border-blue-200 relative overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal">
                <div class="absolute top-0 right-0 bg-blue-100 text-blue-700 text-[0.6rem] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl z-10">Budget-Friendly</div>
                <!-- Visual: cement grout appearance -->
                <div class="aspect-video bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <img src="<?php echo get_template_directory_uri(); ?>/images/services/shower-regrouting/cement-grout-example.png" alt="Close-up of cement grout between tiles" class="w-full h-full object-cover" />
                </div>
                <div class="p-8">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-blue-600" aria-hidden="true">construction</span></div>
                    <h3 class="text-xl font-extrabold text-primary">Cement Grout</h3>
                </div>
                <ul class="space-y-4">
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-green-600 text-lg mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span><div><p class="font-bold text-primary text-sm">Lower upfront cost</p><p class="text-xs text-secondary">Great option when budget is the priority</p></div></li>
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-green-600 text-lg mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span><div><p class="font-bold text-primary text-sm">Wide colour range</p><p class="text-xs text-secondary">Easy to match existing tiles and decor</p></div></li>
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-green-600 text-lg mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span><div><p class="font-bold text-primary text-sm">Easy to repair later</p><p class="text-xs text-secondary">Simple to patch or regrout individual joints</p></div></li>
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-amber-500 text-lg mt-0.5 shrink-0" aria-hidden="true">info</span><div><p class="font-bold text-primary text-sm">Needs sealing in wet areas</p><p class="text-xs text-secondary">Periodic resealing keeps it waterproof</p></div></li>
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-amber-500 text-lg mt-0.5 shrink-0" aria-hidden="true">info</span><div><p class="font-bold text-primary text-sm">Lifespan: 5-12 years</p><p class="text-xs text-secondary">With regular sealing and proper ventilation</p></div></li>
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-blue-500 text-lg mt-0.5 shrink-0" aria-hidden="true">verified</span><div><p class="font-bold text-primary text-sm">2-year workmanship warranty</p><p class="text-xs text-secondary">Covers joint integrity and waterproofing</p></div></li>
                </ul>
                </div>
            </div>
            <div class="bg-green-50/50 rounded-2xl border-2 border-green-300 relative overflow-hidden ring-2 ring-green-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 reveal">
                <div class="absolute top-0 right-0 bg-green-100 text-green-700 text-[0.6rem] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl z-10">Recommended</div>
                <!-- Visual: epoxy grout appearance -->
                <div class="aspect-video bg-linear-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
                    <img src="<?php echo get_template_directory_uri(); ?>/images/services/shower-regrouting/epoxy-grout-example.png" alt="Close-up of epoxy grout between tiles" class="w-full h-full object-cover" />
                </div>
                <div class="p-8">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-green-600" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span></div>
                    <h3 class="text-xl font-extrabold text-primary">Epoxy Grout</h3>
                </div>
                <ul class="space-y-4">
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-green-600 text-lg mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span><div><p class="font-bold text-primary text-sm">100% waterproof</p><p class="text-xs text-secondary">Zero water absorption, ever</p></div></li>
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-green-600 text-lg mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span><div><p class="font-bold text-primary text-sm">Stain-proof and mould-resistant</p><p class="text-xs text-secondary">Non-porous surface repels everything</p></div></li>
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-green-600 text-lg mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span><div><p class="font-bold text-primary text-sm">Never needs sealing</p><p class="text-xs text-secondary">Set and forget. Zero maintenance.</p></div></li>
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-green-600 text-lg mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span><div><p class="font-bold text-primary text-sm">Lifespan: 15-20 years</p><p class="text-xs text-secondary">Outlasts cement by 2-3x in wet areas</p></div></li>
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-red-500 text-lg mt-0.5 shrink-0" aria-hidden="true">close</span><div><p class="font-bold text-primary text-sm">Higher upfront cost</p><p class="text-xs text-secondary">3-5x material cost, but amortised over lifespan</p></div></li>
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-green-600 text-lg mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">verified</span><div><p class="font-bold text-primary text-sm">5-year workmanship warranty</p><p class="text-xs text-secondary">Covers joint integrity and waterproofing</p></div></li>
                </ul>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- PROCESS STEPS — Connected Timeline -->
<section class="py-16 sm:py-20 bg-surface-container-low">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">How We Regrout Your Shower</h2>
            <p class="text-secondary">A 4-step process. Most standard showers completed in one day.</p>
        </div>
        <!-- DESKTOP -->
        <div class="hidden lg:block">
            <div class="grid grid-cols-4 gap-0 relative">
                <div class="absolute top-7 left-[12.5%] right-[12.5%] h-0.5 border-t-2 border-dashed border-[#e7c08b]/40" aria-hidden="true"></div>
                <div class="flex flex-col items-center text-center px-4 reveal">
                    <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center relative z-10 mb-4 shadow-xs"><div class="w-12 h-12 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-2xl font-black text-[#7a5c10]">1</span></div></div>
                    <span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full mb-3">~30 min</span>
                    <h3 class="font-bold text-primary text-sm mb-2">Protect &amp; Mask</h3>
                    <p class="text-xs text-secondary leading-relaxed">Drop sheets down, fixtures masked, drain protected. We contain all dust and debris.</p>
                </div>
                <div class="flex flex-col items-center text-center px-4 reveal">
                    <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center relative z-10 mb-4 shadow-xs"><div class="w-12 h-12 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-2xl font-black text-[#7a5c10]">2</span></div></div>
                    <span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full mb-3">2-3 hrs</span>
                    <h3 class="font-bold text-primary text-sm mb-2">Remove Old Grout</h3>
                    <p class="text-xs text-secondary leading-relaxed">Every joint ground out 2-4mm deep with precision oscillating tools. Old silicone stripped from corners.</p>
                </div>
                <div class="flex flex-col items-center text-center px-4 reveal">
                    <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center relative z-10 mb-4 shadow-xs"><div class="w-12 h-12 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-2xl font-black text-[#7a5c10]">3</span></div></div>
                    <span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full mb-3">2-3 hrs</span>
                    <h3 class="font-bold text-primary text-sm mb-2">Apply New Grout</h3>
                    <p class="text-xs text-secondary leading-relaxed">Fresh epoxy or cement grout pressed into every joint. Excess cleaned off tiles before it sets.</p>
                </div>
                <div class="flex flex-col items-center text-center px-4 reveal">
                    <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center relative z-10 mb-4 shadow-xs"><div class="w-12 h-12 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-2xl font-black text-[#7a5c10]">4</span></div></div>
                    <span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full mb-3">24-48 hrs</span>
                    <h3 class="font-bold text-primary text-sm mb-2">Silicone &amp; Cure</h3>
                    <p class="text-xs text-secondary leading-relaxed">Fresh silicone in all corners and transitions. Area cleaned up. Shower ready in 24-48 hours.</p>
                </div>
            </div>
        </div>
        <!-- MOBILE -->
        <div class="lg:hidden space-y-0">
            <div class="flex gap-4 reveal"><div class="flex flex-col items-center shrink-0"><div class="w-11 h-11 rounded-full bg-white shadow-xs flex items-center justify-center"><div class="w-9 h-9 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-base font-black text-[#7a5c10]">1</span></div></div><div class="w-0.5 flex-1 bg-[#e7c08b]/30 mt-2"></div></div><div class="pb-8 pt-1"><span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full inline-block mb-2">~30 min</span><h3 class="font-bold text-primary mb-1">Protect &amp; Mask</h3><p class="text-sm text-secondary leading-relaxed">Drop sheets down, fixtures masked, drain protected. All dust and debris contained.</p></div></div>
            <div class="flex gap-4 reveal"><div class="flex flex-col items-center shrink-0"><div class="w-11 h-11 rounded-full bg-white shadow-xs flex items-center justify-center"><div class="w-9 h-9 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-base font-black text-[#7a5c10]">2</span></div></div><div class="w-0.5 flex-1 bg-[#e7c08b]/30 mt-2"></div></div><div class="pb-8 pt-1"><span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full inline-block mb-2">2-3 hrs</span><h3 class="font-bold text-primary mb-1">Remove Old Grout</h3><p class="text-sm text-secondary leading-relaxed">Every joint ground out 2-4mm deep with precision oscillating tools. Old silicone stripped.</p></div></div>
            <div class="flex gap-4 reveal"><div class="flex flex-col items-center shrink-0"><div class="w-11 h-11 rounded-full bg-white shadow-xs flex items-center justify-center"><div class="w-9 h-9 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-base font-black text-[#7a5c10]">3</span></div></div><div class="w-0.5 flex-1 bg-[#e7c08b]/30 mt-2"></div></div><div class="pb-8 pt-1"><span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full inline-block mb-2">2-3 hrs</span><h3 class="font-bold text-primary mb-1">Apply New Grout</h3><p class="text-sm text-secondary leading-relaxed">Fresh epoxy or cement grout pressed into every joint. Excess cleaned off before it sets.</p></div></div>
            <div class="flex gap-4 reveal"><div class="flex flex-col items-center shrink-0"><div class="w-11 h-11 rounded-full bg-white shadow-xs flex items-center justify-center"><div class="w-9 h-9 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-base font-black text-[#7a5c10]">4</span></div></div></div><div class="pt-1"><span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full inline-block mb-2">24-48 hrs</span><h3 class="font-bold text-primary mb-1">Silicone &amp; Cure</h3><p class="text-sm text-secondary leading-relaxed">Fresh silicone in all corners and transitions. Shower ready in 24-48 hours.</p></div></div>
        </div>
    </div>
</section>

<!-- MID-PAGE CTA -->
<div class="bg-primary py-5 sm:py-6">
    <div class="max-w-5xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-white font-bold text-sm sm:text-base text-center sm:text-left">Ready to fix your shower grout? Send us photos for a free quote in hours.</p>
        <a href="#quote" class="shrink-0 px-6 py-3 bg-white text-primary font-bold text-sm rounded-lg hover:shadow-lg transition-all whitespace-nowrap">Get Your Free Quote &rarr;</a>
    </div>
</div>

<!-- VALUE PROPOSITION -->
<section class="py-10 sm:py-12 bg-surface">
    <div class="max-w-6xl mx-auto px-6 sm:px-8">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter text-center mb-8">Why Choose Timeless?</h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
            <div class="flex items-start gap-3"><div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"><span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">bolt</span></div><div><h3 class="font-bold text-primary text-sm">Free Quote in Hours</h3><p class="text-xs text-secondary leading-relaxed">Send photos, get a fixed price back. No home visit needed.</p></div></div>
            <div class="flex items-start gap-3"><div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"><span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">schedule</span></div><div><h3 class="font-bold text-primary text-sm">Same-Day Service</h3><p class="text-xs text-secondary leading-relaxed">Most showers regrouted in a single day.</p></div></div>
            <div class="flex items-start gap-3"><div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"><span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">verified_user</span></div><div><h3 class="font-bold text-primary text-sm">Up to 5-Year Warranty</h3><p class="text-xs text-secondary leading-relaxed">Epoxy: 5yr. Cement: 2yr. Fully insured with public liability.</p></div></div>
            <div class="flex items-start gap-3"><div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"><span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">cleaning_services</span></div><div><h3 class="font-bold text-primary text-sm">No Mess Guarantee</h3><p class="text-xs text-secondary leading-relaxed">Drop sheets, dust extraction, full cleanup. Cleaner than we found it.</p></div></div>
        </div>
    </div>
</section>

<!-- GOOGLE REVIEWS -->
<section class="py-16 sm:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="text-center mb-10">
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">What Our Customers Say</h2>
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
                <p class="text-sm text-secondary leading-relaxed mb-6">Not sure if regrouting is the right fix? Wondering about epoxy vs cement, timing, or what&rsquo;s involved? These are the questions we hear most from Sydney homeowners. If yours isn&rsquo;t here, send us a message. No pressure.</p>
                <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all">Ask Us Anything <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
            </div>
            <div class="space-y-2">
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How much does shower regrouting cost?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Every shower is different. The cost depends on size, tile type, grout choice (epoxy or cement), and current condition. Send us 3-4 photos and we&rsquo;ll have a fixed-price quote back within hours. The number you see is the number you pay.</p></div></div>
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How long does it take?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Most standard showers are completed in 4-8 hours (one day). Larger showers or full bathroom regrouts may take a second day. The shower can be used again 24-48 hours after completion.</p></div></div>
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">What&rsquo;s the difference between epoxy and cement grout?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Epoxy is 100% waterproof, stain-proof, and mould-resistant. It never needs sealing and lasts 15-20 years. Cement is cheaper but porous, needs periodic sealing, and lasts 5-12 years. For showers, we recommend epoxy.</p></div></div>
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Can you regrout without removing the tiles?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Yes. That is the core of what we do. We remove the old grout 2-4mm deep using precision oscillating tools, then fill with fresh grout. Your tiles stay exactly where they are.</p></div></div>
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Do you replace the silicone too?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Yes. We strip and replace all silicone in corners and where tiles meet the bath, shower base, or fixtures. Silicone replacement is included in every full regrout.</p></div></div>
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Will the grout removal crack my tiles?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">We use precision oscillating tools that cut grout without touching the tile face. The risk of tile damage is extremely low with professional equipment and experienced hands. If a tile is already loose or cracked, we&rsquo;ll flag it before we start.</p></div></div>
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Do you remove all the old grout or apply new over it?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">We remove 100% of the old grout before applying new. Grouting over existing grout is a shortcut that fails within months. We grind every joint out 2-4mm deep, clean the channels, then fill with fresh grout. That&rsquo;s what gives you a result that lasts.</p></div></div>
            </div>
        </div>
    </div>
</section>

<!-- QUOTE FORM -->
<section class="py-16 sm:py-20 bg-white" id="quote">
    <div class="max-w-4xl mx-auto px-6 sm:px-8">
        <div class="bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div class="p-6 sm:p-8 lg:p-12 bg-primary text-white">
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Get Your Free Regrouting Quote</h2>
                <p class="text-on-primary-container text-sm">5 minutes. No obligation. Fixed pricing guaranteed.</p>
            </div>
            <div class="p-6 sm:p-8 lg:p-12">
                <div class="flex items-center justify-between gap-4 mb-8 text-center">
                    <div class="flex-1"><div class="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">1</div><p class="text-[0.65rem] text-secondary font-medium"><strong class="text-primary block">Send photos</strong> of your shower grout</p></div>
                    <div class="shrink-0 w-8 h-px bg-surface-container"></div>
                    <div class="flex-1"><div class="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">2</div><p class="text-[0.65rem] text-secondary font-medium"><strong class="text-primary block">Fixed-price quote</strong> within hours</p></div>
                    <div class="shrink-0 w-8 h-px bg-surface-container"></div>
                    <div class="flex-1"><div class="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">3</div><p class="text-[0.65rem] text-secondary font-medium"><strong class="text-primary block">Book a date</strong> that suits you</p></div>
                </div>
                <form class="space-y-4" id="quote-form">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label class="text-xs font-bold text-primary uppercase tracking-wider block mb-1.5">Full Name *</label><input type="text" name="name" required class="w-full px-4 py-3 rounded-lg border border-surface-container bg-surface-container-low text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden" placeholder="John Citizen" /></div>
                        <div><label class="text-xs font-bold text-primary uppercase tracking-wider block mb-1.5">Phone *</label><input type="tel" name="phone" required class="w-full px-4 py-3 rounded-lg border border-surface-container bg-surface-container-low text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden" placeholder="0400 000 000" /></div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label class="text-xs font-bold text-primary uppercase tracking-wider block mb-1.5">Suburb *</label><input type="text" name="suburb" required class="w-full px-4 py-3 rounded-lg border border-surface-container bg-surface-container-low text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden" placeholder="e.g. Bondi, Parramatta" /></div>
                        <div><label class="text-xs font-bold text-primary uppercase tracking-wider block mb-1.5">Email</label><input type="email" name="email" class="w-full px-4 py-3 rounded-lg border border-surface-container bg-surface-container-low text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden" placeholder="you@email.com" /></div>
                    </div>
                    <div><label class="text-xs font-bold text-primary uppercase tracking-wider block mb-1.5">What do you need? *</label>
                        <div class="grid grid-cols-2 gap-2">
                            <label class="flex items-center gap-2 px-4 py-3 border border-surface-container rounded-lg cursor-pointer hover:border-primary transition-colors bg-surface-container-low text-sm"><input type="checkbox" name="service" value="Shower Regrouting" checked class="text-primary rounded-sm" /> Shower Regrouting</label>
                            <label class="flex items-center gap-2 px-4 py-3 border border-surface-container rounded-lg cursor-pointer hover:border-primary transition-colors bg-surface-container-low text-sm"><input type="checkbox" name="service" value="Epoxy Grout Upgrade" class="text-primary rounded-sm" /> Epoxy Grout Upgrade</label>
                            <label class="flex items-center gap-2 px-4 py-3 border border-surface-container rounded-lg cursor-pointer hover:border-primary transition-colors bg-surface-container-low text-sm"><input type="checkbox" name="service" value="Silicone Replacement" class="text-primary rounded-sm" /> Silicone Replacement</label>
                            <label class="flex items-center gap-2 px-4 py-3 border border-surface-container rounded-lg cursor-pointer hover:border-primary transition-colors bg-surface-container-low text-sm"><input type="checkbox" name="service" value="Bath Resurfacing" class="text-primary rounded-sm" /> Bath Resurfacing</label>
                        </div>
                    </div>
                    <div><label class="text-xs font-bold text-primary uppercase tracking-wider block mb-1.5">Anything else?</label><textarea name="message" rows="3" class="w-full px-4 py-3 rounded-lg border border-surface-container bg-surface-container-low text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden resize-none" placeholder="e.g. Mould keeps coming back in the shower corners, interested in epoxy grout."></textarea></div>
                    <button class="w-full py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2" type="submit">Get My Free Regrouting Quote <span class="material-symbols-outlined" aria-hidden="true">send</span></button>
                    <p class="text-center text-[0.6rem] text-secondary">We respond within hours. No spam, ever.</p>
                </form>
            </div>
        </div>
    </div>
</section>


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
