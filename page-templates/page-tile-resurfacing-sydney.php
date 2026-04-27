<?php /* Template Name: Tile Resurfacing Sydney */ ?>
<?php get_header(); ?>

<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "Service",
 "name": "Tile Resurfacing Sydney",
 "description": "Professional tile resurfacing with commercial-grade coating. 1-2 day service, up to 3-year workmanship warranty.",
 "provider": {
 "@type": "HomeAndConstructionBusiness",
 "name": "Timeless Resurfacing",
 "url": "https://timelessresurfacing.com.au",
 "telephone": "<?php echo timeless_phone_link(); ?>",
 "address": { "@type": "PostalAddress", "addressLocality": "Sydney", "addressRegion": "NSW", "addressCountry": "AU" },
 "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "23" }
 },
 "areaServed": { "@type": "City", "name": "Sydney" },
 "serviceType": "Tile Resurfacing",
 "offers": {
 "@type": "Offer",
 "priceCurrency": "AUD",
 "price": "800",
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
 { "@type": "ListItem", "position": 3, "name": "Tile Resurfacing Sydney", "item": "https://timelessresurfacing.com.au/tile-resurfacing-sydney/" }
 ]
}
</script>

<script type="application/ld+json">
{
 "@context": "https://schema.org", "@type": "FAQPage",
 "mainEntity": [
 { "@type": "Question", "name": "How much does tile resurfacing cost in Sydney?", "acceptedAnswer": { "@type": "Answer", "text": "Every tile resurfacing job is priced based on size, condition, and scope. We provide fixed-price quotes based on your photos. No hidden fees, no surprises." } },
 { "@type": "Question", "name": "What tiles can you resurface?", "acceptedAnswer": { "@type": "Answer", "text": "We resurface ceramic, porcelain, textured, patterned, and mosaic tiles. Send us photos and we'll confirm suitability and pricing." } },
 { "@type": "Question", "name": "How long does tile resurfacing last?", "acceptedAnswer": { "@type": "Answer", "text": "Wall tiles last up to 10+ years with proper care. Floor tiles last 5-7 years due to foot traffic. Every job backed by our up to 3-year workmanship warranty." } },
 { "@type": "Question", "name": "What colour will my resurfaced tiles be?", "acceptedAnswer": { "@type": "Answer", "text": "Standard finish is high-gloss white. The cleanest, most modern look for bathroom walls. Light custom tints (cream, off-white) available by request." } },
 { "@type": "Question", "name": "Does tile resurfacing cover grout lines?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The coating covers tiles and grout for a seamless, easy-to-clean finish. We can mask grout lines if you prefer a traditional tile look." } }
 ]
}
</script>

<main>

<!-- BREADCRUMB -->
<div class="pt-24 pb-2 px-6 sm:px-8 max-w-7xl mx-auto">
 <nav class="text-xs text-secondary" aria-label="Breadcrumb">
 <ol class="flex items-center gap-1">
 <li><a href="<?php echo esc_url( home_url('/') ); ?>" class="hover:text-primary transition-colors">Home</a></li>
 <li><span class="mx-1">/</span></li>
 <li><a href="<?php echo esc_url( home_url('/services/') ); ?>" class="hover:text-primary transition-colors">Services</a></li>
 <li><span class="mx-1">/</span></li>
 <li class="text-primary font-medium">Tile Resurfacing</li>
 </ol>
 </nav>
</div>

<!-- HERO -->
<section class="pt-4 pb-10 sm:pb-16 bg-surface">
 <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
 <div class="relative">
 <div class="absolute inset-0 bg-linear-to-br from-surface via-transparent to-transparent rounded-3xl -z-10 -m-4"></div>
 <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.7rem] font-bold tracking-widest uppercase rounded-sm mb-4">No Demolition</span>
 <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tighter leading-[0.95] mb-3 underline decoration-tertiary-fixed-dim decoration-[5px] underline-offset-8 [text-decoration-skip-ink:none]">
 Tile Resurfacing
 </h1>
 <div class="h-0 mb-3"></div>
 <p class="text-base sm:text-lg text-secondary leading-relaxed max-w-xl mb-6">
 Dated tiles dragging down your bathroom? We spray them in a clean high-gloss white finish. <strong>No ripping them out, no tiler, no weeks of mess.</strong> Most jobs done in 1-2 days.
 </p>
 <!-- MOBILE: Hero image between paragraph and stats -->
 <div class="md:hidden mb-6">
 <div id="hero-slider-mobile" class="rounded-xl overflow-hidden shadow-2xl relative select-none" style="aspect-ratio:4/3;cursor:ew-resize;">
 <div class="absolute inset-0 w-full h-full">
 <img src="<?php echo get_template_directory_uri(); ?>/images/services/tile-resurfacing/hero-after.png" alt="Clean white resurfaced tiles" class="w-full h-full object-cover" draggable="false" />
 </div>
 <div id="mob-clip" class="absolute top-0 left-0 bottom-0 overflow-hidden" style="width:50%;">
 <img id="mob-before-img" src="<?php echo get_template_directory_uri(); ?>/images/services/tile-resurfacing/hero-before.png" alt="Dated bathroom tiles before resurfacing" class="object-cover" style="position:absolute;top:0;left:0;height:100%;width:200%;" draggable="false" />
 </div>
 <div id="mob-line" class="absolute top-0 bottom-0 w-0.5 bg-white" style="left:50%;z-index:20;cursor:ew-resize;"></div>
 <div id="mob-handle" class="absolute top-1/2 w-11 h-11 mt-[-22px] ml-[-22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;">
 <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
 </div>
 <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">Before</span>
 <span class="absolute top-3 right-3 bg-white/80 text-primary text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">After</span>
 <div class="absolute bottom-3 left-3 right-3 p-3 bg-white/90 backdrop-blur-md rounded-lg flex justify-between items-center" style="z-index:15;">
 <span class="text-xs font-bold text-primary">Drag to Compare</span>
 <span class="text-xs font-bold text-primary-soft">Completed in 1-2 Days</span>
 </div>
 </div>
 </div>
 <div class="grid grid-cols-3 gap-3 sm:flex sm:items-center sm:gap-6 mb-6">
 <div class="text-center bg-surface-container-low rounded-lg px-4 py-3">
 <p class="text-base sm:text-2xl font-extrabold text-primary whitespace-nowrap">Up to 80%</p>
 <p class="text-[0.65rem] text-secondary font-medium">Cheaper than reno</p>
 </div>
 <div class="text-center bg-surface-container-low rounded-lg px-4 py-3">
 <p class="text-base sm:text-2xl font-extrabold text-primary whitespace-nowrap">1-2 Days</p>
 <p class="text-[0.65rem] text-secondary font-medium">Most jobs</p>
 </div>
 <div class="text-center bg-surface-container-low rounded-lg px-4 py-3">
 <p class="text-base sm:text-2xl font-extrabold text-primary whitespace-nowrap">3yr</p>
 <p class="text-[0.65rem] text-secondary font-medium">Coating warranty</p>
 </div>
 </div>
<div class="flex flex-col sm:flex-row gap-3 mb-4">
 <a class="px-8 py-4 bg-primary text-white font-bold rounded-lg text-center hover:shadow-xl transition-all" href="#quote">Get Your Free Quote</a>
 </div>
 </div>
 <div class="hidden md:block">
 <!-- HERO BEFORE/AFTER SLIDER (DESKTOP) -->
 <div id="hero-slider" class="rounded-xl overflow-hidden shadow-2xl relative select-none" style="aspect-ratio:4/3;cursor:ew-resize;">
 <div class="absolute inset-0 w-full h-full">
 <img src="<?php echo get_template_directory_uri(); ?>/images/services/tile-resurfacing/hero-after.png" alt="Clean white resurfaced tiles" class="w-full h-full object-cover" />
 </div>
 <div id="ba-clip" class="absolute top-0 left-0 bottom-0 overflow-hidden" style="width:50%;">
 <img id="ba-before-img" src="<?php echo get_template_directory_uri(); ?>/images/services/tile-resurfacing/hero-before.png" alt="Dated bathroom tiles before resurfacing" class="object-cover" style="position:absolute;top:0;left:0;height:100%;width:200%;" />
 </div>
 <div id="ba-line" class="absolute top-0 bottom-0 w-0.5 bg-white" style="left:50%;z-index:20;cursor:ew-resize;"></div>
 <div id="ba-handle" class="absolute top-1/2 w-11 h-11 mt-[-22px] ml-[-22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;">
 <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
 </div>
 <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">Before</span>
 <span class="absolute top-3 right-3 bg-white/80 text-primary text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">After</span>
 <div class="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 bg-white/90 backdrop-blur-md rounded-lg flex justify-between items-center" style="z-index:15;">
 <span class="text-xs font-bold text-primary">Drag to Compare</span>
 <span class="text-xs font-bold text-primary-soft">Completed in 1-2 Days</span>
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
 <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">construction</span><span class="text-xs font-bold">No Demolition Required</span></div>
 </div>
</section>

<!-- TRUST LOGO BAR -->
<?php $logo = get_template_directory_uri() . '/images/homepage/logos'; ?>
<section class="py-8 sm:py-10 bg-surface-container-low/50">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <p class="text-center text-sm text-secondary mb-6">Trusted by Hundreds of Australians, from Homeowners to Major Brands</p>
 </div>
 <div class="max-w-6xl mx-auto px-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing" id="logo-scroller" style="-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none;">
 <div class="flex items-center gap-5 sm:gap-8 w-max px-8" id="logo-inner">
 <?php for ($i = 0; $i < 2; $i++) : ?>
 <img src="<?php echo $logo; ?>/logo-1.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" />
 <img src="<?php echo $logo; ?>/logo-2.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" />
 <img src="<?php echo $logo; ?>/logo-3.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" />
 <img src="<?php echo $logo; ?>/logo-4.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" />
 <img src="<?php echo $logo; ?>/logo-5.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" />
 <img src="<?php echo $logo; ?>/logo-6.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" />
 <img src="<?php echo $logo; ?>/logo-7.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" />
 <img src="<?php echo $logo; ?>/logo-8.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" />
 <img src="<?php echo $logo; ?>/logo-9.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" />
 <img src="<?php echo $logo; ?>/logo-10.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" />
 <?php endfor; ?>
 </div>
 </div>
 <div id="logo-dots" class="flex justify-center gap-1.5 mt-4"></div>
</section>

<!-- WHAT WE FIX -->
<section class="py-16 sm:py-20 bg-white">
 <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
 <div class="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
 <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.65rem] font-bold tracking-widest uppercase rounded-sm mb-3">Our Services</span>
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">What We Fix</h2>
 <p class="text-secondary">Whatever&rsquo;s wrong with your tiles, we&rsquo;ve seen it and fixed it. Here&rsquo;s what we fix, how we do it, and what the results look like.</p>
 <!-- Surfaces we cover -->
 <div class="flex flex-wrap justify-center gap-3 mt-8">
 <span class="flex items-center gap-1.5 px-4 py-2 bg-surface-container-low rounded-full text-xs font-bold text-primary"><span class="material-symbols-outlined text-sm text-tertiary-fixed-dim" aria-hidden="true">shower</span> Shower Walls</span>
 <span class="flex items-center gap-1.5 px-4 py-2 bg-surface-container-low rounded-full text-xs font-bold text-primary"><span class="material-symbols-outlined text-sm text-tertiary-fixed-dim" aria-hidden="true">grid_view</span> Floor Tiles</span>
 <span class="flex items-center gap-1.5 px-4 py-2 bg-surface-container-low rounded-full text-xs font-bold text-primary"><span class="material-symbols-outlined text-sm text-tertiary-fixed-dim" aria-hidden="true">dashboard</span> Splashbacks</span>
 <span class="flex items-center gap-1.5 px-4 py-2 bg-surface-container-low rounded-full text-xs font-bold text-primary"><span class="material-symbols-outlined text-sm text-tertiary-fixed-dim" aria-hidden="true">bathroom</span> Full Bathroom</span>
 <span class="flex items-center gap-1.5 px-4 py-2 bg-surface-container-low rounded-full text-xs font-bold text-primary"><span class="material-symbols-outlined text-sm text-tertiary-fixed-dim" aria-hidden="true">local_laundry_service</span> Laundry</span>
 </div>
 </div>

 <!-- BLOCK 1: Dated, Dull & Ugly -->
 <div class="mb-12 lg:mb-16 reveal">
 <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
 <div class="order-2 lg:order-1">
 <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Dated, Dull &amp; Ugly</h3>
 <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Still living with avocado green from 1985? Pink from the 90s? Or tiles that used to shine but now look flat, rough, and tired no matter how much you clean? We spray your existing tiles in a clean high-gloss white finish. Your bathroom looks brand new without ripping anything out.</p>
 <ul class="space-y-2.5 mb-6">
 <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Clean high-gloss white finish</li>
 <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Works over any existing tile colour or pattern</li>
 <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Completed in 1-2 days, lasts 10+ years</li>
 </ul>
 <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
 </div>
 <div class="order-1 lg:order-2">
 <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none mx-auto w-full max-w-md" style="aspect-ratio:3/2;cursor:ew-resize;">
 <div class="absolute inset-0 w-full h-full bg-linear-to-br from-emerald-50 via-white to-[#e7c08b]/20 flex items-center justify-center">
 <img src="<?php echo get_template_directory_uri(); ?>/images/services/tile-resurfacing/dated-after.png" alt="Modern white tiles" class="w-full h-full object-cover absolute inset-0" />
 </div>
 <div class="ba-clip absolute top-0 left-0 bottom-0 overflow-hidden" style="width:50%;">
 <div class="ba-before absolute inset-0 bg-linear-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center">
 <img src="<?php echo get_template_directory_uri(); ?>/images/services/tile-resurfacing/dated-before.png" alt="Outdated pink tiles" class="w-full h-full object-cover absolute inset-0" />
 </div>
 </div>
 <div class="ba-line absolute top-0 bottom-0 w-0.5 bg-white" style="left:50%;z-index:20;cursor:ew-resize;"></div>
 <div class="ba-handle absolute top-1/2 w-11 h-11 mt-[-22px] ml-[-22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;">
 <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
 </div>
 <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">Before</span>
 <span class="absolute top-3 right-3 bg-white/80 text-[#041534] text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">After</span>
 </div>
 </div>
 </div>
 </div>

 <!-- BLOCK 2: Stained Tiles & Dirty Grout -->
 <div class="mb-12 lg:mb-16 reveal">
 <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
 <div class="order-2 lg:order-2">
 <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Stained Tiles &amp; Dirty Grout</h3>
 <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Tiles gone yellow and the grout lines are black no matter how much you scrub? That&rsquo;s the most common call we get. We resurface the tiles AND regrout with waterproof epoxy in one visit. Both problems fixed together so the whole surface looks new.</p>
 <ul class="space-y-2.5 mb-6">
 <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Tiles resurfaced + grout replaced in one job</li>
 <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Mould-proof epoxy grout included</li>
 <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Complete transformation, not just a patch job</li>
 </ul>
 <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
 </div>
 <div class="order-1 lg:order-1">
 <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none mx-auto w-full max-w-md" style="aspect-ratio:3/2;cursor:ew-resize;">
 <div class="absolute inset-0 w-full h-full bg-linear-to-br from-emerald-50 via-white to-[#e7c08b]/20 flex items-center justify-center">
 <img src="<?php echo get_template_directory_uri(); ?>/images/services/tile-resurfacing/grout-after.png" alt="Clean tiles and grout" class="w-full h-full object-cover absolute inset-0" />
 </div>
 <div class="ba-clip absolute top-0 left-0 bottom-0 overflow-hidden" style="width:50%;">
 <div class="ba-before absolute inset-0 bg-linear-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center">
 <img src="<?php echo get_template_directory_uri(); ?>/images/services/tile-resurfacing/grout-before.png" alt="Stained tiles with dirty grout" class="w-full h-full object-cover absolute inset-0" />
 </div>
 </div>
 <div class="ba-line absolute top-0 bottom-0 w-0.5 bg-white" style="left:50%;z-index:20;cursor:ew-resize;"></div>
 <div class="ba-handle absolute top-1/2 w-11 h-11 mt-[-22px] ml-[-22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;">
 <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
 </div>
 <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">Before</span>
 <span class="absolute top-3 right-3 bg-white/80 text-[#041534] text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">After</span>
 </div>
 </div>
 </div>
 </div>

 <!-- BLOCK 3: Cracked, Chipped & Lifting -->
 <div class="reveal">
 <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
 <div class="order-2 lg:order-1">
 <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Cracked, Chipped &amp; Lifting</h3>
 <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Tiles cracking around the edges? Chips you can feel with your feet? Loose tiles that click when you step on them? These aren&rsquo;t just ugly. They let water through to the substrate, causing hidden damage underneath. We repair, seal, and resurface before it gets worse.</p>
 <ul class="space-y-2.5 mb-6">
 <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Stops water damage before it spreads</li>
 <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Chips and cracks filled and sealed</li>
 <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Smooth, safe surface restored</li>
 </ul>
 <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
 </div>
 <div class="order-1 lg:order-2">
 <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none mx-auto w-full max-w-md" style="aspect-ratio:3/2;cursor:ew-resize;">
 <div class="absolute inset-0 w-full h-full bg-linear-to-br from-emerald-50 via-white to-[#e7c08b]/20 flex items-center justify-center">
 <img src="<?php echo get_template_directory_uri(); ?>/images/services/tile-resurfacing/cracked-after.png" alt="Repaired tiles" class="w-full h-full object-cover absolute inset-0" />
 </div>
 <div class="ba-clip absolute top-0 left-0 bottom-0 overflow-hidden" style="width:50%;">
 <div class="ba-before absolute inset-0 bg-linear-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center">
 <img src="<?php echo get_template_directory_uri(); ?>/images/services/tile-resurfacing/cracked-before.png" alt="Cracked damaged tiles" class="w-full h-full object-cover absolute inset-0" />
 </div>
 </div>
 <div class="ba-line absolute top-0 bottom-0 w-0.5 bg-white" style="left:50%;z-index:20;cursor:ew-resize;"></div>
 <div class="ba-handle absolute top-1/2 w-11 h-11 mt-[-22px] ml-[-22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;">
 <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
 </div>
 <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">Before</span>
 <span class="absolute top-3 right-3 bg-white/80 text-[#041534] text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">After</span>
 </div>
 </div>
 </div>
 </div>
 </div>
</section>

<!-- RESURFACING vs RETILING COMPARISON -->
<section class="py-16 sm:py-20 bg-white">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <div class="text-center mb-12">
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">Full Retiling vs Our Resurfacing</h2>
 <p class="text-secondary max-w-2xl mx-auto">Why rip out perfectly good tiles when you can transform them in 1-2 days?</p>
 </div>
 <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
 <!-- LEFT: Full Retiling (Red) -->
 <div class="bg-red-50/50 rounded-2xl p-8 border-2 border-red-200 relative overflow-hidden reveal">
 <div class="absolute top-0 right-0 bg-red-100 text-red-700 text-[0.6rem] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">Expensive</div>
 <div class="flex items-center gap-3 mb-6">
 <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-red-600" aria-hidden="true">close</span></div>
 <h3 class="text-xl font-extrabold text-primary">Full Retiling</h3>
 </div>
 <ul class="space-y-4">
 <li class="flex items-start gap-3">
 <span class="material-symbols-outlined text-red-500 text-lg mt-0.5 shrink-0" aria-hidden="true">close</span>
 <div><p class="font-bold text-primary text-sm">Thousands more</p><p class="text-xs text-secondary">Tiles + labour + waterproofing + tiler</p></div>
 </li>
 <li class="flex items-start gap-3">
 <span class="material-symbols-outlined text-red-500 text-lg mt-0.5 shrink-0" aria-hidden="true">close</span>
 <div><p class="font-bold text-primary text-sm">2-4 weeks</p><p class="text-xs text-secondary">Demolition, waterproofing, tiling, grouting</p></div>
 </li>
 <li class="flex items-start gap-3">
 <span class="material-symbols-outlined text-red-500 text-lg mt-0.5 shrink-0" aria-hidden="true">close</span>
 <div><p class="font-bold text-primary text-sm">Full demolition + waterproofing</p><p class="text-xs text-secondary">Dust everywhere, skip bin, noise complaints</p></div>
 </li>
 <li class="flex items-start gap-3">
 <span class="material-symbols-outlined text-red-500 text-lg mt-0.5 shrink-0" aria-hidden="true">close</span>
 <div><p class="font-bold text-primary text-sm">Multiple trades</p><p class="text-xs text-secondary">Demolisher, waterproofer, tiler, plumber</p></div>
 </li>
 <li class="flex items-start gap-3">
 <span class="material-symbols-outlined text-red-500 text-lg mt-0.5 shrink-0" aria-hidden="true">close</span>
 <div><p class="font-bold text-primary text-sm">Bathroom unusable for weeks</p><p class="text-xs text-secondary">No shower, no bath for the duration</p></div>
 </li>
 </ul>
 </div>
 <!-- RIGHT: Our Resurfacing (Green) -->
 <div class="bg-green-50/50 rounded-2xl p-8 border-2 border-green-300 relative overflow-hidden reveal ring-2 ring-green-200">
 <div class="absolute top-0 right-0 bg-green-100 text-green-700 text-[0.6rem] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">Recommended</div>
 <div class="flex items-center gap-3 mb-6">
 <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-green-600" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span></div>
 <h3 class="text-xl font-extrabold text-primary">Our Resurfacing</h3>
 </div>
 <ul class="space-y-4">
 <li class="flex items-start gap-3">
 <span class="material-symbols-outlined text-green-600 text-lg mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span>
 <div><p class="font-bold text-primary text-sm">Fixed-Price Quote</p><p class="text-xs text-secondary">Send photos for your price</p></div>
 </li>
 <li class="flex items-start gap-3">
 <span class="material-symbols-outlined text-green-600 text-lg mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span>
 <div><p class="font-bold text-primary text-sm">1-2 days</p><p class="text-xs text-secondary">Most bathrooms done in a weekend</p></div>
 </li>
 <li class="flex items-start gap-3">
 <span class="material-symbols-outlined text-green-600 text-lg mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span>
 <div><p class="font-bold text-primary text-sm">Zero demolition</p><p class="text-xs text-secondary">No dust, no noise, no skip bin</p></div>
 </li>
 <li class="flex items-start gap-3">
 <span class="material-symbols-outlined text-green-600 text-lg mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span>
 <div><p class="font-bold text-primary text-sm">Single visit</p><p class="text-xs text-secondary">One tradesperson, one or two days</p></div>
 </li>
 <li class="flex items-start gap-3">
 <span class="material-symbols-outlined text-green-600 text-lg mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span>
 <div><p class="font-bold text-primary text-sm">Bath usable 48 hours</p><p class="text-xs text-secondary">Short cure time, then back to normal</p></div>
 </li>
 </ul>
 </div>
 </div>
 </div>
</section>

<!-- WHO IT'S FOR -->
<section class="py-14 sm:py-18 bg-surface">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <div class="text-center mb-10">
 <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter mb-3">Who&rsquo;s This For?</h2>
 <p class="text-secondary text-sm">Whether you own it, rent it out, or sell it, tile resurfacing saves time and money.</p>
 </div>
 <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 <div class="bg-white rounded-xl p-6 border border-surface-container hover:shadow-lg transition-all reveal">
 <span class="material-symbols-outlined text-2xl text-primary mb-3 block" aria-hidden="true">home</span>
 <h3 class="font-bold text-primary text-sm mb-2">Homeowners</h3>
 <p class="text-xs text-secondary leading-relaxed">Hate your bathroom but can&rsquo;t afford a $30K renovation? Get the same look for a fraction of the price. No demolition, no mess, done in a weekend.</p>
 </div>
 <div class="bg-white rounded-xl p-6 border border-surface-container hover:shadow-lg transition-all reveal">
 <span class="material-symbols-outlined text-2xl text-primary mb-3 block" aria-hidden="true">apartment</span>
 <h3 class="font-bold text-primary text-sm mb-2">Property Managers</h3>
 <p class="text-xs text-secondary leading-relaxed">Fast rental turnovers between tenants. Multi-unit pricing available. We work around your schedule, tenants back in 48 hours.</p>
 </div>
 <div class="bg-white rounded-xl p-6 border border-surface-container hover:shadow-lg transition-all reveal">
 <span class="material-symbols-outlined text-2xl text-primary mb-3 block" aria-hidden="true">sell</span>
 <h3 class="font-bold text-primary text-sm mb-2">Selling Your Home</h3>
 <p class="text-xs text-secondary leading-relaxed">Buyers judge bathrooms first. A fresh tile resurface before open day can add thousands to the sale price for a fraction of the cost.</p>
 </div>
 <div class="bg-white rounded-xl p-6 border border-surface-container hover:shadow-lg transition-all reveal">
 <span class="material-symbols-outlined text-2xl text-primary mb-3 block" aria-hidden="true">hotel</span>
 <h3 class="font-bold text-primary text-sm mb-2">Airbnb &amp; Short-Term</h3>
 <p class="text-xs text-secondary leading-relaxed">Guests leave reviews about bathrooms. A modern, clean-looking bathroom means better ratings and higher nightly rates.</p>
 </div>
 </div>
 </div>
</section>

<!-- COMPACT MID-PAGE CTA -->
<div class="bg-primary py-5 sm:py-6">
 <div class="max-w-5xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
 <p class="text-white font-bold text-sm sm:text-base text-center sm:text-left">Ready to get started? Send us photos for a free quote in hours.</p>
 <a href="#quote" class="shrink-0 px-6 py-3 bg-white text-primary font-bold text-sm rounded-lg hover:shadow-lg transition-all whitespace-nowrap">Get Your Free Quote &rarr;</a>
 </div>
</div>

<!-- OUR PROCESS -->
<section class="py-16 sm:py-20 bg-white">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <div class="max-w-3xl mx-auto text-center mb-12">
 <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.65rem] font-bold tracking-widest uppercase rounded-sm mb-3">Our Process</span>
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">How Does It Actually Work?</h2>
 <p class="text-secondary">No demolition, no tiler, no plumber. Just a clean spray-on transformation.</p>
 </div>
 <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
 <div class="bg-surface-container-low rounded-2xl p-6 reveal">
 <div class="flex items-center gap-3 mb-4">
 <div class="w-10 h-10 rounded-full bg-[#e7c08b]/20 flex items-center justify-center shrink-0"><span class="text-sm font-black text-[#7a5c10]">1</span></div>
 <h3 class="font-bold text-primary">Inspect &amp; Repair</h3>
 </div>
 <p class="text-sm text-secondary leading-relaxed">Check every tile for cracks and loose edges. Fix any damage and fill chips so the surface is perfectly smooth.</p>
 </div>
 <div class="bg-surface-container-low rounded-2xl p-6 reveal">
 <div class="flex items-center gap-3 mb-4">
 <div class="w-10 h-10 rounded-full bg-[#e7c08b]/20 flex items-center justify-center shrink-0"><span class="text-sm font-black text-[#7a5c10]">2</span></div>
 <h3 class="font-bold text-primary">Clean &amp; Prep</h3>
 </div>
 <p class="text-sm text-secondary leading-relaxed">Deep clean to remove soap scum, mould, and buildup. Then prep the surface so the new coating bonds permanently.</p>
 </div>
 <div class="bg-surface-container-low rounded-2xl p-6 reveal">
 <div class="flex items-center gap-3 mb-4">
 <div class="w-10 h-10 rounded-full bg-[#e7c08b]/20 flex items-center justify-center shrink-0"><span class="text-sm font-black text-[#7a5c10]">3</span></div>
 <h3 class="font-bold text-primary">Prime</h3>
 </div>
 <p class="text-sm text-secondary leading-relaxed">Bonding primer goes on first. This is what makes the colour coat stick to glazed tiles that are designed not to absorb anything.</p>
 </div>
 </div>
 <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto lg:max-w-[calc(66.666%+0.75rem)]">
 <div class="bg-surface-container-low rounded-2xl p-6 reveal">
 <div class="flex items-center gap-3 mb-4">
 <div class="w-10 h-10 rounded-full bg-[#e7c08b]/20 flex items-center justify-center shrink-0"><span class="text-sm font-black text-[#7a5c10]">4</span></div>
 <h3 class="font-bold text-primary">Spray Coat</h3>
 </div>
 <p class="text-sm text-secondary leading-relaxed">High-gloss white sprayed in smooth, even layers. No brush marks, no roller texture. Just a clean factory finish.</p>
 </div>
 <div class="bg-surface-container-low rounded-2xl p-6 reveal">
 <div class="flex items-center gap-3 mb-4">
 <div class="w-10 h-10 rounded-full bg-[#e7c08b]/20 flex items-center justify-center shrink-0"><span class="text-sm font-black text-[#7a5c10]">5</span></div>
 <h3 class="font-bold text-primary">Seal &amp; Cure</h3>
 </div>
 <p class="text-sm text-secondary leading-relaxed">Protective clear coat for durability. Grout lines sealed. 24-48 hour cure, then your bathroom is ready to use.</p>
 </div>
 </div>
 </div>
</section>

<!-- GOOGLE REVIEWS -->
<section class="py-16 sm:py-20 bg-white">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <div class="text-center mb-10">
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">What Our Customers Say</h2>
 <div class="flex items-center justify-center gap-2"><div class="flex text-amber-400 text-lg" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div><span class="sr-only">5 out of 5 stars</span><span class="text-sm font-bold text-primary">4.9</span><span class="text-xs text-secondary">Google Rating</span></div>
 </div>
 <?php timeless_render_google_reviews(); ?>
 </div>
</section>

<!-- FAQ -->
<section class="py-14 sm:py-16 bg-surface-container-low" id="faqs">
 <div class="max-w-6xl mx-auto px-6 sm:px-8">
 <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
 <!-- Left: intro -->
 <div>
 <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter mb-3">Got Questions About Tile Resurfacing?</h2>
 <p class="text-sm text-secondary leading-relaxed mb-6">Not sure if your tiles can be resurfaced? Wondering how long it lasts or what the finish looks like? These are the questions Sydney homeowners ask us most. Don&rsquo;t see yours? Just ask. No pressure, no obligation.</p>
 <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all">Ask Us Anything <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
 </div>
 <!-- Right: accordion -->
 <div class="space-y-2">
 <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How much does it cost?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Every job is different. Send us photos and we&rsquo;ll have a fixed-price quote back within hours. No hidden fees, no obligation.</p></div></div>
 <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">What tiles can you resurface?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Ceramic, porcelain, textured, patterned, and mosaic tiles. Send us photos and we&rsquo;ll confirm suitability.</p></div></div>
 <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How long does it last?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Wall tiles last up to 10+ years. Floor tiles last 5-7 years due to foot traffic. Every job backed by our up to 3-year workmanship warranty.</p></div></div>
 <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">What colour will my tiles be?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Standard finish is high-gloss white. Clean, modern, and matches every bathroom. Light custom tints (cream, off-white) available by request.</p></div></div>
 <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Does it cover grout lines?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Yes. The coating covers tiles and grout for a seamless finish. We can mask grout lines if you prefer a traditional tile look.</p></div></div>
 </div>
 </div>
 </div>
</section>

<!-- QUOTE FORM -->
<section class="py-16 sm:py-20 bg-surface-container-low" id="quote">
 <div class="max-w-4xl mx-auto px-6 sm:px-8">
 <div class="bg-white rounded-2xl overflow-hidden shadow-2xl">
 <div class="p-6 sm:p-8 lg:p-12 bg-primary text-white">
 <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Get Your Free Tile Resurfacing Quote</h2>
 <p class="text-on-primary-container text-sm">5 minutes. No obligation. Fixed pricing guaranteed.</p>
 </div>
 <!-- How quoting works -->
 <div class="px-6 sm:px-8 lg:px-12 pt-8 pb-4">
 <div class="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center text-center sm:text-left">
 <div class="flex items-center gap-3"><span class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary shrink-0">1</span><span class="text-xs text-secondary"><strong class="text-primary">Send photos</strong> of your tiles</span></div>
 <span class="hidden sm:block text-surface-container-highest">&rarr;</span>
 <div class="flex items-center gap-3"><span class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary shrink-0">2</span><span class="text-xs text-secondary"><strong class="text-primary">Fixed-price quote</strong> within hours</span></div>
 <span class="hidden sm:block text-surface-container-highest">&rarr;</span>
 <div class="flex items-center gap-3"><span class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary shrink-0">3</span><span class="text-xs text-secondary"><strong class="text-primary">Book a date</strong> that suits you</span></div>
 </div>
 </div>
 <form class="timeless-quote-form p-6 sm:p-8 lg:p-12 pt-6 space-y-6">
 <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div><label for="name" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Full Name *</label><input id="name" name="name" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="John Citizen" required /></div>
 <div><label for="phone" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Phone *</label><input id="phone" name="phone" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="0400 000 000" type="tel" required /></div>
 </div>
 <div><label for="address" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Suburb *</label><input id="address" name="address" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. Parramatta, Bondi, Surry Hills" required /></div>
 <div>
 <label class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">What needs resurfacing?</label>
 <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
 <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded-sm text-primary" checked /> Shower wall tiles</label>
 <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded-sm text-primary" /> Bathroom wall tiles</label>
 <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded-sm text-primary" /> Floor tiles</label>
 <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded-sm text-primary" /> Full bathroom</label>
 <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded-sm text-primary" /> Splashback</label>
 </div>
 </div>
 <div><label for="notes" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Anything else?</label><textarea id="notes" name="notes" rows="3" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="e.g. tiles are pink from the 80s, want to change to white, grout is cracked too..."></textarea></div>
 <button class="w-full py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2" type="submit">Get My Free Tile Resurfacing Quote <span class="material-symbols-outlined" aria-hidden="true">send</span></button>
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
