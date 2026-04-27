<?php /* Template Name: Shower Sealing Sydney */ ?>
<?php get_header(); ?>

<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Shower Sealing Sydney",
    "description": "Professional shower sealing and silicone replacement in Sydney. Fix leaking showers, replace mouldy silicone, prevent water damage. Same-day service, up to 3-year warranty.",
    "provider": {
        "@type": "HomeAndConstructionBusiness",
        "name": "Timeless Resurfacing",
        "url": "https://timelessresurfacing.com.au",
        "telephone": "<?php echo timeless_phone_link(); ?>",
        "address": { "@type": "PostalAddress", "addressLocality": "Sydney", "addressRegion": "NSW", "addressCountry": "AU" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "23" }
    },
    "areaServed": { "@type": "City", "name": "Sydney" },
    "serviceType": "Shower Sealing"
}
</script>

<script type="application/ld+json">
{
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://timelessresurfacing.com.au/" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://timelessresurfacing.com.au/services/" },
        { "@type": "ListItem", "position": 3, "name": "Shower Sealing Sydney", "item": "https://timelessresurfacing.com.au/services/shower-leak-repair-sydney/" }
    ]
}
</script>

<script type="application/ld+json">
{
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "How much does shower sealing cost in Sydney?", "acceptedAnswer": { "@type": "Answer", "text": "Every shower is different. The cost depends on the number of junctions, extent of mould damage, and whether grout repair is also needed. Send us photos for a fixed-price quote within hours." } },
        { "@type": "Question", "name": "How long does shower sealing take?", "acceptedAnswer": { "@type": "Answer", "text": "Most silicone replacements are completed in 3-4 hours. The silicone needs 24 hours to cure before you can use the shower." } },
        { "@type": "Question", "name": "How long does new silicone last?", "acceptedAnswer": { "@type": "Answer", "text": "Professional anti-mould silicone lasts 15-20 years when properly applied. We use 100% silicone with fungicide built into the polymer." } },
        { "@type": "Question", "name": "Can I just do it myself?", "acceptedAnswer": { "@type": "Answer", "text": "The common DIY failure point is incomplete removal of old silicone. New silicone won't bond to residue from old silicone. Professional removal and surface prep is what makes the seal last." } },
        { "@type": "Question", "name": "Do you fix the grout too?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. If your grout is also cracked or mouldy, we can regrout and reseal in the same visit. We'll tell you what's needed after seeing your photos." } }
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
            <li class="text-primary font-medium">Shower Sealing Sydney</li>
        </ol>
    </nav>
</div>

<!-- HERO -->
<section class="pt-4 pb-10 sm:pb-16 bg-surface">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div class="relative">
            <div class="absolute inset-0 bg-linear-to-br from-surface via-transparent to-transparent rounded-3xl -z-10 -m-4"></div>
            <span class="inline-block py-1 px-3 bg-error-container text-on-error-container text-[0.7rem] font-bold tracking-widest uppercase rounded-sm mb-4">Same-Day Fix</span>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tighter leading-[0.95] mb-3 underline decoration-tertiary-fixed-dim decoration-[5px] underline-offset-8 [text-decoration-skip-ink:none]">
                Shower Sealing
            </h1>
            <div class="h-0 mb-3"></div>
            <p class="text-base sm:text-lg text-secondary leading-relaxed max-w-xl mb-6">
                Leaking shower? Mouldy silicone? Water getting behind the tiles? We strip every old seal and replace it with professional anti-mould silicone. Done in hours, not days.
            </p>
            <!-- MOBILE: Hero image between paragraph and stats -->
            <div class="md:hidden mb-6">
                <div id="hero-slider-mobile" class="rounded-xl overflow-hidden shadow-2xl relative select-none" style="aspect-ratio:4/3;cursor:ew-resize;">
                    <div class="absolute inset-0 w-full h-full">
                        <img src="<?php echo get_template_directory_uri(); ?>/images/services/shower-leak-repair/hero-after.png" alt="Sealed shower with fresh silicone" class="w-full h-full object-cover" draggable="false" />
                    </div>
                    <div id="mob-clip" class="absolute top-0 left-0 bottom-0 overflow-hidden" style="width:33%;">
                        <img id="mob-before-img" src="<?php echo get_template_directory_uri(); ?>/images/services/shower-leak-repair/hero-before.png" alt="Leaking shower" class="object-cover" style="position:absolute;top:0;left:0;height:100%;width:300%;" draggable="false" />
                    </div>
                    <div id="mob-line" class="absolute top-0 bottom-0 w-0.5 bg-white" style="left:33%;z-index:20;cursor:ew-resize;"></div>
                    <div id="mob-handle" class="absolute top-1/2 w-11 h-11 mt-[-22px] ml-[-22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:33%;z-index:25;cursor:ew-resize;">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                    <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">Before</span>
                    <span class="absolute top-3 right-3 bg-white/80 text-primary text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">After</span>
                    <div class="absolute bottom-3 left-3 right-3 p-3 bg-white/90 backdrop-blur-md rounded-lg flex justify-between items-center" style="z-index:15;">
                        <span class="text-xs font-bold text-primary">Drag to Compare</span>
                        <span class="text-xs font-bold text-on-primary-container">Completed in 3-4 Hours</span>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
                <div class="text-center bg-surface-container-low rounded-lg px-2 sm:px-3 py-3">
                    <p class="text-base sm:text-xl lg:text-2xl font-extrabold text-primary leading-tight">3-4 hrs</p>
                    <p class="text-[0.6rem] sm:text-[0.65rem] text-secondary font-medium mt-1">Most showers</p>
                </div>
                <div class="text-center bg-surface-container-low rounded-lg px-2 sm:px-3 py-3">
                    <p class="text-base sm:text-xl lg:text-2xl font-extrabold text-primary leading-tight">Same Day</p>
                    <p class="text-[0.6rem] sm:text-[0.65rem] text-secondary font-medium mt-1">Service</p>
                </div>
                <div class="text-center bg-surface-container-low rounded-lg px-2 sm:px-3 py-3">
                    <p class="text-base sm:text-xl lg:text-2xl font-extrabold text-primary leading-tight">Up to 3yr</p>
                    <p class="text-[0.6rem] sm:text-[0.65rem] text-secondary font-medium mt-1">Warranty</p>
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
            <!-- HERO BEFORE/AFTER SLIDER (DESKTOP) -->
            <div id="hero-slider" class="rounded-xl overflow-hidden shadow-2xl relative select-none" style="aspect-ratio:4/3;cursor:ew-resize;">
                <!-- AFTER image -->
                <div class="absolute inset-0 w-full h-full">
                    <img src="<?php echo get_template_directory_uri(); ?>/images/services/shower-leak-repair/hero-after.png" alt="Sealed shower with fresh silicone" class="w-full h-full object-cover" />
                </div>
                <!-- BEFORE image -->
                <div id="ba-clip" class="absolute top-0 left-0 bottom-0 overflow-hidden" style="width:50%;">
                    <div class="absolute inset-0">
                        <img id="ba-before-img" src="<?php echo get_template_directory_uri(); ?>/images/services/shower-leak-repair/hero-before.png" alt="Leaking shower" class="object-cover" style="position:absolute;top:0;left:0;height:100%;width:200%;" />
                    </div>
                </div>
                <div id="ba-line" class="absolute top-0 bottom-0 w-0.5 bg-white" style="left:50%;z-index:20;cursor:ew-resize;"></div>
                <div id="ba-handle" class="absolute top-1/2 w-11 h-11 mt-[-22px] ml-[-22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">Before</span>
                <span class="absolute top-3 right-3 bg-white/80 text-primary text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">After</span>
                <div class="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 bg-white/90 backdrop-blur-md rounded-lg flex justify-between items-center" style="z-index:15;">
                    <span class="text-xs font-bold text-primary">Drag to Compare</span>
                    <span class="text-xs font-bold text-on-primary-container">Fixed in Hours</span>
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
        <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified</span><span class="text-xs font-bold">Up to 3-Year Warranty</span></div>
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
            <p class="text-secondary">These are the shower sealing problems we fix every week across Sydney. If yours looks like any of these, we can have it sorted today.</p>
        </div>

        <!-- BLOCK 1: Leaking Shower Silicone -->
        <div class="mb-12 lg:mb-16 reveal">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div class="order-2 lg:order-1">
                    <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Leaking Shower Silicone</h3>
                    <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Water pooling at the base of your shower screen? Damp patches appearing on the wall outside the shower? Old silicone shrinks, cracks, and pulls away from the surface over time. Once the seal breaks, water gets behind the tiles with every shower. We strip the old silicone completely, clean the substrate, and apply fresh anti-mould silicone rated for wet areas.</p>
                    <ul class="space-y-2.5 mb-6">
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Full silicone removal (not applied over old)</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Professional anti-mould silicone</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Stops the leak at the source</li>
                    </ul>
                    <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
                </div>
                <div class="order-1 lg:order-2">
                    <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none mx-auto w-full max-w-md" style="aspect-ratio:3/2;cursor:ew-resize;">
                        <div class="absolute inset-0 w-full h-full"><img src="<?php echo get_template_directory_uri(); ?>/images/services/shower-leak-repair/leaking-after.png" alt="Shower after silicone replacement" class="w-full h-full object-cover absolute inset-0" /></div>
                        <div class="ba-clip absolute top-0 left-0 bottom-0 overflow-hidden" style="width:50%;"><div class="ba-before absolute inset-0 bg-linear-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center"><img src="<?php echo get_template_directory_uri(); ?>/images/services/shower-leak-repair/leaking-before.png" alt="Leaking shower silicone" class="w-full h-full object-cover absolute inset-0" /></div></div>
                        <div class="ba-line absolute top-0 bottom-0 w-0.5 bg-white" style="left:50%;z-index:20;cursor:ew-resize;"></div>
                        <div class="ba-handle absolute top-1/2 w-11 h-11 mt-[-22px] ml-[-22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                        <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">Before</span>
                        <span class="absolute top-3 right-3 bg-white/80 text-[#041534] text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">After</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- BLOCK 2: Mouldy Corners & Junctions -->
        <div class="reveal">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div class="order-2 lg:order-2">
                    <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Mouldy Corners &amp; Junctions</h3>
                    <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Black mould along the corners where tiles meet the wall, floor, or bath? These are silicone junctions, not grout. Bleach kills what you can see on the surface, but the mould regrows from inside the old silicone within weeks. We strip it all out, treat the area, and reseal with silicone that has fungicide built into the polymer.</p>
                    <ul class="space-y-2.5 mb-6">
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> All corners and junctions resealed</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Fungicide embedded in the silicone</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Clean white finish that stays clean</li>
                    </ul>
                    <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
                </div>
                <div class="order-1 lg:order-1">
                    <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none mx-auto w-full max-w-md" style="aspect-ratio:3/2;cursor:ew-resize;">
                        <div class="absolute inset-0 w-full h-full"><img src="<?php echo get_template_directory_uri(); ?>/images/services/shower-leak-repair/mouldy-after.png" alt="Clean shower corners" class="w-full h-full object-cover absolute inset-0" /></div>
                        <div class="ba-clip absolute top-0 left-0 bottom-0 overflow-hidden" style="width:33%;"><div class="ba-before absolute inset-0 bg-linear-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center"><img src="<?php echo get_template_directory_uri(); ?>/images/services/shower-leak-repair/mouldy-before.png" alt="Mouldy shower corners" class="w-full h-full object-cover absolute inset-0" /></div></div>
                        <div class="ba-line absolute top-0 bottom-0 w-0.5 bg-white" style="left:33%;z-index:20;cursor:ew-resize;"></div>
                        <div class="ba-handle absolute top-1/2 w-11 h-11 mt-[-22px] ml-[-22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:33%;z-index:25;cursor:ew-resize;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                        <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">Before</span>
                        <span class="absolute top-3 right-3 bg-white/80 text-[#041534] text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">After</span>
                    </div>
                </div>
            </div>
        </div>

    </div>
</section>

<!-- SEALING vs FULL REGROUT — helps customer decide scope -->
<section class="py-16 sm:py-20 bg-surface-container-low">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="text-center mb-12">
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">Sealing vs Full Regrout</h2>
            <p class="text-secondary max-w-2xl mx-auto">Not sure which you need? Here&rsquo;s the difference. We&rsquo;ll confirm after seeing your photos.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div class="bg-white rounded-2xl p-8 border-2 border-emerald-200 relative overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal">
                <div class="absolute top-0 right-0 bg-emerald-100 text-emerald-700 text-[0.6rem] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">Quick Fix</div>
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-emerald-600" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span></div>
                    <h3 class="text-xl font-extrabold text-primary">Silicone Reseal Only</h3>
                </div>
                <ul class="space-y-4">
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-emerald-600 text-lg mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span><div><p class="font-bold text-primary text-sm">Silicone is the problem</p><p class="text-xs text-secondary">Mouldy, cracked, or peeling silicone in corners</p></div></li>
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-emerald-600 text-lg mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span><div><p class="font-bold text-primary text-sm">Grout is still solid</p><p class="text-xs text-secondary">No cracks or crumbling between tiles</p></div></li>
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-emerald-600 text-lg mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span><div><p class="font-bold text-primary text-sm">Done in 3-4 hours</p><p class="text-xs text-secondary">Quick turnaround, minimal disruption</p></div></li>
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-emerald-600 text-lg mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span><div><p class="font-bold text-primary text-sm">Lower cost</p><p class="text-xs text-secondary">Silicone replacement is less labour than regrouting</p></div></li>
                </ul>
            </div>
            <div class="bg-white rounded-2xl p-8 border-2 border-primary relative overflow-hidden ring-2 ring-primary/10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 reveal">
                <div class="absolute top-0 right-0 bg-tertiary-fixed-dim text-on-tertiary-fixed text-[0.6rem] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">Complete Fix</div>
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-primary" style="font-variation-settings:'FILL' 1;" aria-hidden="true">construction</span></div>
                    <h3 class="text-xl font-extrabold text-primary">Full Regrout + Reseal</h3>
                </div>
                <ul class="space-y-4">
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-primary text-lg mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span><div><p class="font-bold text-primary text-sm">Grout is also failing</p><p class="text-xs text-secondary">Cracked, mouldy, or crumbling grout between tiles</p></div></li>
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-primary text-lg mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span><div><p class="font-bold text-primary text-sm">Water getting behind tiles</p><p class="text-xs text-secondary">Both grout and silicone need replacing</p></div></li>
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-primary text-lg mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span><div><p class="font-bold text-primary text-sm">Completed in one day</p><p class="text-xs text-secondary">Full regrout + silicone reseal in a single visit</p></div></li>
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-primary text-lg mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span><div><p class="font-bold text-primary text-sm">Epoxy grout option</p><p class="text-xs text-secondary">Waterproof, mould-resistant, 5-year warranty</p></div></li>
                </ul>
            </div>
        </div>
    </div>
</section>

<!-- WHY YOU CAN'T WAIT — Urgency section -->
<section class="py-16 sm:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="max-w-3xl mx-auto text-center mb-10 lg:mb-12">
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">Why You Can&rsquo;t Wait</h2>
            <p class="text-secondary">A leaking shower isn&rsquo;t a cosmetic problem. It&rsquo;s actively causing damage every time you shower.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-xl p-6 reveal border-l-4 border-error shadow-xs transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg">
                <span class="material-symbols-outlined text-3xl text-error mb-3 block" aria-hidden="true">water_damage</span>
                <h3 class="font-bold text-primary mb-2">Hidden Water Damage</h3>
                <p class="text-sm text-secondary leading-relaxed">Water seeps behind tiles for months before you see it. By the time paint bubbles or ceiling stains appear, the framing behind the wall may already be saturated.</p>
            </div>
            <div class="bg-white rounded-xl p-6 reveal border-l-4 border-error shadow-xs transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg">
                <span class="material-symbols-outlined text-3xl text-error mb-3 block" aria-hidden="true">coronavirus</span>
                <h3 class="font-bold text-primary mb-2">Mould Health Risk</h3>
                <p class="text-sm text-secondary leading-relaxed">Damp wall cavities behind tiles are ideal for mould growth. Airborne mould spores cause respiratory issues, especially for children and people with asthma.</p>
            </div>
            <div class="bg-white rounded-xl p-6 reveal border-l-4 border-error shadow-xs transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg">
                <span class="material-symbols-outlined text-3xl text-error mb-3 block" aria-hidden="true">engineering</span>
                <h3 class="font-bold text-primary mb-2">Escalating Repair Cost</h3>
                <p class="text-sm text-secondary leading-relaxed">A silicone reseal today costs a fraction of a full waterproofing job later. If water reaches the waterproofing membrane and it fails, you&rsquo;re looking at removing all tiles, re-waterproofing, and retiling.</p>
            </div>
        </div>
    </div>
</section>

<!-- PROCESS STEPS — Connected Timeline (3 steps for sealing) -->
<section class="py-16 sm:py-20 bg-surface-container-low">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">How We Seal Your Shower</h2>
            <p class="text-secondary">A 3-step process. Most showers sealed in 3-4 hours.</p>
        </div>
        <!-- DESKTOP -->
        <div class="hidden lg:block">
            <div class="grid grid-cols-3 gap-0 relative max-w-4xl mx-auto">
                <div class="absolute top-7 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-[#e7c08b]/40" aria-hidden="true"></div>
                <div class="flex flex-col items-center text-center px-6 reveal">
                    <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center relative z-10 mb-4 shadow-xs"><div class="w-12 h-12 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-2xl font-black text-[#7a5c10]">1</span></div></div>
                    <span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full mb-3">~30 min</span>
                    <h3 class="font-bold text-primary text-sm mb-2">Strip Old Silicone</h3>
                    <p class="text-xs text-secondary leading-relaxed">Every old seal removed completely. No new silicone applied over old. Surface cleaned and prepped for adhesion.</p>
                </div>
                <div class="flex flex-col items-center text-center px-6 reveal">
                    <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center relative z-10 mb-4 shadow-xs"><div class="w-12 h-12 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-2xl font-black text-[#7a5c10]">2</span></div></div>
                    <span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full mb-3">30-60 min</span>
                    <h3 class="font-bold text-primary text-sm mb-2">Clean &amp; Apply</h3>
                    <p class="text-xs text-secondary leading-relaxed">Mould treated, surfaces cleaned. Fresh anti-mould silicone applied to every junction. Tooled for a clean, professional finish.</p>
                </div>
                <div class="flex flex-col items-center text-center px-6 reveal">
                    <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center relative z-10 mb-4 shadow-xs"><div class="w-12 h-12 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-2xl font-black text-[#7a5c10]">3</span></div></div>
                    <span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full mb-3">24 hrs</span>
                    <h3 class="font-bold text-primary text-sm mb-2">Cure</h3>
                    <p class="text-xs text-secondary leading-relaxed">Silicone needs 24 hours to fully cure. Light use OK after 12 hours, full waterproof seal after 24.</p>
                </div>
            </div>
        </div>
        <!-- MOBILE -->
        <div class="lg:hidden space-y-0">
            <div class="flex gap-4 reveal"><div class="flex flex-col items-center shrink-0"><div class="w-11 h-11 rounded-full bg-white shadow-xs flex items-center justify-center"><div class="w-9 h-9 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-base font-black text-[#7a5c10]">1</span></div></div><div class="w-0.5 flex-1 bg-[#e7c08b]/30 mt-2"></div></div><div class="pb-8 pt-1"><span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full inline-block mb-2">~30 min</span><h3 class="font-bold text-primary mb-1">Strip Old Silicone</h3><p class="text-sm text-secondary leading-relaxed">Every old seal removed completely. Surface cleaned and prepped for adhesion.</p></div></div>
            <div class="flex gap-4 reveal"><div class="flex flex-col items-center shrink-0"><div class="w-11 h-11 rounded-full bg-white shadow-xs flex items-center justify-center"><div class="w-9 h-9 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-base font-black text-[#7a5c10]">2</span></div></div><div class="w-0.5 flex-1 bg-[#e7c08b]/30 mt-2"></div></div><div class="pb-8 pt-1"><span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full inline-block mb-2">30-60 min</span><h3 class="font-bold text-primary mb-1">Clean &amp; Apply</h3><p class="text-sm text-secondary leading-relaxed">Mould treated. Fresh anti-mould silicone applied to every junction. Tooled for a clean finish.</p></div></div>
            <div class="flex gap-4 reveal"><div class="flex flex-col items-center shrink-0"><div class="w-11 h-11 rounded-full bg-white shadow-xs flex items-center justify-center"><div class="w-9 h-9 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-base font-black text-[#7a5c10]">3</span></div></div></div><div class="pt-1"><span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full inline-block mb-2">24 hrs</span><h3 class="font-bold text-primary mb-1">Cure</h3><p class="text-sm text-secondary leading-relaxed">Silicone needs 24 hours to fully cure. Light use OK after 12 hours, full waterproof seal after 24.</p></div></div>
        </div>
    </div>
</section>

<!-- MID-PAGE CTA -->
<div class="bg-primary py-5 sm:py-6">
    <div class="max-w-5xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-white font-bold text-sm sm:text-base text-center sm:text-left">Shower leaking? Send us photos for a free quote in hours.</p>
        <a href="#quote" class="shrink-0 px-6 py-3 bg-white text-primary font-bold text-sm rounded-lg hover:shadow-lg transition-all whitespace-nowrap">Get Your Free Quote &rarr;</a>
    </div>
</div>

<!-- VALUE PROPOSITION -->
<section class="py-10 sm:py-12 bg-surface">
    <div class="max-w-6xl mx-auto px-6 sm:px-8">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter text-center mb-8">Why Choose Timeless?</h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
            <div class="flex items-start gap-3"><div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"><span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">bolt</span></div><div><h3 class="font-bold text-primary text-sm">Free Quote in Hours</h3><p class="text-xs text-secondary leading-relaxed">Send photos, get a fixed price back. No home visit needed.</p></div></div>
            <div class="flex items-start gap-3"><div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"><span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">schedule</span></div><div><h3 class="font-bold text-primary text-sm">Same-Day Service</h3><p class="text-xs text-secondary leading-relaxed">Most showers sealed in 3-4 hours.</p></div></div>
            <div class="flex items-start gap-3"><div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"><span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">verified_user</span></div><div><h3 class="font-bold text-primary text-sm">Up to 3-Year Warranty</h3><p class="text-xs text-secondary leading-relaxed">Workmanship guaranteed. Fully insured with public liability.</p></div></div>
            <div class="flex items-start gap-3"><div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"><span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">cleaning_services</span></div><div><h3 class="font-bold text-primary text-sm">No Mess Guarantee</h3><p class="text-xs text-secondary leading-relaxed">Drop sheets, full cleanup. Cleaner than we found it.</p></div></div>
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
                <p class="text-sm text-secondary leading-relaxed mb-6">Not sure if you need a silicone reseal or a full regrout? Wondering how long it takes? These are the questions we hear most. If yours isn&rsquo;t here, send us a message. No pressure.</p>
                <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all">Ask Us Anything <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
            </div>
            <div class="space-y-2">
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How much does shower sealing cost?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Every shower is different. The cost depends on the number of junctions, extent of mould damage, and whether grout repair is also needed. Send us photos and we&rsquo;ll have a fixed-price quote back within hours. The number you see is the number you pay.</p></div></div>
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How long does it take?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Most silicone replacements are completed in 3-4 hours. The silicone needs 24 hours to cure before you can use the shower.</p></div></div>
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How long does new silicone last?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Professional anti-mould silicone lasts 15-20 years when properly applied. We use 100% silicone with fungicide built into the polymer, not the surface-treated type from hardware stores that wears off within months.</p></div></div>
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Can I just do it myself?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">You can, but the common DIY failure point is incomplete removal of old silicone. New silicone won&rsquo;t bond to residue from old silicone. Professional removal and surface prep is what makes the seal last. A failed DIY seal can cause more water damage than the original problem.</p></div></div>
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Do you fix the grout too?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Yes. If your grout is also cracked or mouldy, we can regrout and reseal in the same visit. We&rsquo;ll tell you what&rsquo;s needed after seeing your photos.</p></div></div>
            </div>
        </div>
    </div>
</section>

<!-- QUOTE FORM -->
<section class="py-16 sm:py-20 bg-white" id="quote">
    <div class="max-w-4xl mx-auto px-6 sm:px-8">
        <div class="bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div class="p-6 sm:p-8 lg:p-12 bg-primary text-white">
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Get Your Free Shower Sealing Quote</h2>
                <p class="text-on-primary-container text-sm">5 minutes. No obligation. Fixed pricing guaranteed.</p>
            </div>
            <div class="p-6 sm:p-8 lg:p-12">
                <div class="flex items-center justify-between gap-4 mb-8 text-center">
                    <div class="flex-1"><div class="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">1</div><p class="text-[0.65rem] text-secondary font-medium"><strong class="text-primary block">Send photos</strong> of your shower</p></div>
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
                            <label class="flex items-center gap-2 px-4 py-3 border border-surface-container rounded-lg cursor-pointer hover:border-primary transition-colors bg-surface-container-low text-sm"><input type="checkbox" name="service" value="Silicone Replacement" checked class="text-primary rounded-sm" /> Silicone Replacement</label>
                            <label class="flex items-center gap-2 px-4 py-3 border border-surface-container rounded-lg cursor-pointer hover:border-primary transition-colors bg-surface-container-low text-sm"><input type="checkbox" name="service" value="Shower Regrouting" class="text-primary rounded-sm" /> Shower Regrouting</label>
                            <label class="flex items-center gap-2 px-4 py-3 border border-surface-container rounded-lg cursor-pointer hover:border-primary transition-colors bg-surface-container-low text-sm"><input type="checkbox" name="service" value="Leak Repair" class="text-primary rounded-sm" /> Leak Repair</label>
                            <label class="flex items-center gap-2 px-4 py-3 border border-surface-container rounded-lg cursor-pointer hover:border-primary transition-colors bg-surface-container-low text-sm"><input type="checkbox" name="service" value="Bath Resurfacing" class="text-primary rounded-sm" /> Bath Resurfacing</label>
                        </div>
                    </div>
                    <div><label class="text-xs font-bold text-primary uppercase tracking-wider block mb-1.5">Anything else?</label><textarea name="message" rows="3" class="w-full px-4 py-3 rounded-lg border border-surface-container bg-surface-container-low text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden resize-none" placeholder="e.g. Silicone around the shower screen is mouldy and the shower is leaking onto the floor outside."></textarea></div>
                    <button class="w-full py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2" type="submit">Get My Free Shower Sealing Quote <span class="material-symbols-outlined" aria-hidden="true">send</span></button>
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
