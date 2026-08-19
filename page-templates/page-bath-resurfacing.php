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
 "address": { "@type": "PostalAddress", "addressLocality": "Sydney", "addressRegion": "NSW", "addressCountry": "AU" }<?php echo timeless_aggregate_rating_jsonld(); ?>
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
 { "@type": "ListItem", "position": 3, "name": "Bath Resurfacing Sydney", "item": "https://timelessresurfacing.com.au/services/bath-resurfacing/" }
 ]
}
</script>

<script type="application/ld+json">
{
 "@context": "https://schema.org", "@type": "FAQPage",
 "mainEntity": [
 { "@type": "Question", "name": "How much does bath resurfacing cost in Sydney?", "acceptedAnswer": { "@type": "Answer", "text": "Every bathroom is different. We provide fixed-price quotes based on your photos. No hidden fees, no surprises. Send us photos for a quote within 1 business day." } },
 { "@type": "Question", "name": "How long does bath resurfacing take?", "acceptedAnswer": { "@type": "Answer", "text": "Most baths are completed in 5-8.5 hours (one day). Freestanding baths may take a full day due to extra prep for stripping old coatings. Your bath is usable 24-48 hours after completion." } },
 { "@type": "Question", "name": "How long does a resurfaced bath last?", "acceptedAnswer": { "@type": "Answer", "text": "up to 10 years with the professional-grade system. Commercial-grade acrylic urethane coating resists chipping, peeling, and yellowing." } },
 { "@type": "Question", "name": "Can you resurface any type of bath?", "acceptedAnswer": { "@type": "Answer", "text": "Yes: porcelain, enamel steel, cast iron, acrylic, fibreglass, and spa baths. We cannot resurface natural stone (marble/granite) baths. Those need specialist stone restoration." } },
 { "@type": "Question", "name": "What colour will my resurfaced bath be?", "acceptedAnswer": { "@type": "Answer", "text": "Standard finish is high-gloss white. The modern, clean look most customers want. Light custom tints (cream, off-white) available by request. We don't offer dark colours as they can't be applied consistently in a home environment." } }
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
 <li><a href="/#services" class="hover:text-primary transition-colors">Services</a></li>
 <li><span class="mx-1">/</span></li>
 <li class="text-primary font-medium">Bath Resurfacing</li>
 </ol>
 </nav>
</div>

<!-- ═══════════════════════════════════════════════════
 SECTION 1: HERO
 ═══════════════════════════════════════════════════ -->
<section class="pt-4 pb-10 sm:pb-16 bg-surface">
 <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
 <div class="relative">
 <div class="absolute inset-0 bg-linear-to-br from-surface via-transparent to-transparent rounded-3xl -z-10 -m-4"></div>
 <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.7rem] font-bold tracking-widest uppercase rounded-sm mb-4">Same-Day Service</span>
 <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tighter leading-[0.95] mb-3 underline decoration-tertiary-fixed-dim decoration-[5px] underline-offset-8 [text-decoration-skip-ink:none]">
 Bath Resurfacing
 </h1>
 <div class="h-0 mb-3"></div>
 <p class="text-base sm:text-lg text-secondary leading-relaxed max-w-xl mb-6" style="text-wrap:pretty;">
 Chipped, stained, or yellowed bathtub? We&nbsp;restore&nbsp;it to factory-new condition using a <strong>professional-grade system</strong>, a commercial-grade coating that lasts up to 10+ years. Most&nbsp;jobs&nbsp;completed in a single day, no demolition needed.
 </p>
 <!-- MOBILE: Hero image between paragraph and stats -->
 <div class="md:hidden mb-6">
 <div id="hero-slider-mobile" class="rounded-xl overflow-hidden shadow-2xl relative select-none" style="aspect-ratio:4/3;cursor:ew-resize;">
 <div class="absolute inset-0 w-full h-full">
 <img src="<?php echo get_template_directory_uri(); ?>/images/services/bath-resurfacing/hero-after.png" alt="Gleaming white resurfaced bathtub" class="w-full h-full object-cover" draggable="false" />
 </div>
 <div id="mob-clip" class="absolute inset-0" style="clip-path:inset(0 50% 0 0);">
 <img id="mob-before-img" src="<?php echo get_template_directory_uri(); ?>/images/services/bath-resurfacing/hero-before.png" alt="Damaged bathtub before resurfacing" class="absolute inset-0 w-full h-full object-cover" draggable="false" />
 </div>
 <div id="mob-line" class="absolute top-0 bottom-0 w-[2px] bg-white" style="left:50%;z-index:20;cursor:ew-resize;"></div>
 <div id="mob-handle" class="absolute top-1/2 w-11 h-11 -mt-[22px] -ml-[22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;">
 <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
 </div>
 <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">Before</span>
 <span class="absolute top-3 right-3 bg-white/80 text-primary text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">After</span>
 <div class="absolute bottom-3 left-3 right-3 p-3 bg-white/90 backdrop-blur-md rounded-lg flex justify-between items-center" style="z-index:15;">
 <span class="text-xs font-bold text-primary">Drag to Compare</span>
 <span class="text-xs font-bold text-primary-soft">Completed in 1 Day</span>
 </div>
 </div>
 </div>
 <div class="grid grid-cols-3 gap-3 sm:flex sm:items-center sm:gap-6 mb-6">
 <div class="text-center bg-surface-container-low rounded-lg px-4 py-3">
 <p class="text-base sm:text-2xl font-extrabold text-primary whitespace-nowrap">Up to 80%</p>
 <p class="text-[0.65rem] text-secondary font-medium">Cheaper than reno</p>
 </div>
 <div class="text-center bg-surface-container-low rounded-lg px-4 py-3">
 <p class="text-base sm:text-2xl font-extrabold text-primary whitespace-nowrap">1 Day</p>
 <p class="text-[0.65rem] text-secondary font-medium">Most jobs</p>
 </div>
 <div class="text-center bg-surface-container-low rounded-lg px-4 py-3">
 <p class="text-base sm:text-2xl font-extrabold text-primary whitespace-nowrap">5yr</p>
 <p class="text-[0.65rem] text-secondary font-medium">Resurface warranty</p>
 </div>
 </div>
<div class="flex flex-col sm:flex-row gap-3 mb-4">
 <a class="px-8 py-4 bg-primary text-white font-bold rounded-lg text-center hover:shadow-xl transition-all" href="#quote">Get Your Free Quote</a>
 </div>
 </div>
 <div class="hidden md:block">
 <!-- HERO BEFORE/AFTER SLIDER (DESKTOP) -->
 <div id="hero-slider" class="rounded-xl overflow-hidden shadow-2xl relative select-none" style="aspect-ratio:4/3;cursor:ew-resize;">
 <!-- AFTER image -->
 <div class="absolute inset-0 w-full h-full">
 <img src="<?php echo get_template_directory_uri(); ?>/images/services/bath-resurfacing/hero-after.png" alt="Gleaming white resurfaced bathtub" class="w-full h-full object-cover" />
 </div>
 <!-- BEFORE image -->
 <div id="ba-clip" class="absolute inset-0" style="clip-path:inset(0 50% 0 0);">
 <img id="ba-before-img" src="<?php echo get_template_directory_uri(); ?>/images/services/bath-resurfacing/hero-before.png" alt="Damaged bathtub before resurfacing" class="absolute inset-0 w-full h-full object-cover" />
 </div>
 <div id="ba-line" class="absolute top-0 bottom-0 w-[2px] bg-white" style="left:50%;z-index:20;cursor:ew-resize;"></div>
 <div id="ba-handle" class="absolute top-1/2 w-11 h-11 -mt-[22px] -ml-[22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;">
 <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
 </div>
 <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">Before</span>
 <span class="absolute top-3 right-3 bg-white/80 text-primary text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">After</span>
 <div class="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 bg-white/90 backdrop-blur-md rounded-lg flex justify-between items-center" style="z-index:15;">
 <span class="text-xs font-bold text-primary">Drag to Compare</span>
 <span class="text-xs font-bold text-primary-soft">Completed in 1 Day</span>
 </div>
 </div>
 </div>
 </div>
</section>

<!-- ═══════════════════════════════════════════════════
 SECTION 2: TRUST BAR
 ═══════════════════════════════════════════════════ -->
<section class="bg-primary text-white py-4">
 <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-2 gap-3 sm:grid-cols-none sm:flex sm:flex-wrap sm:justify-between items-center sm:gap-4">
 <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified_user</span><span class="text-xs font-bold">Experienced &amp; Insured</span></div>
 <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">security</span><span class="text-xs font-bold">Public Liability Insured</span></div>
 <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified</span><span class="text-xs font-bold">Up to 5-Year Warranty</span></div>
 <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">schedule</span><span class="text-xs font-bold">Same-Day Service</span></div>
 </div>
</section>


<?php $logo = get_template_directory_uri() . '/images/homepage/logos'; ?>
<!-- TRUST LOGO BAR -->
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

<!-- SECTION 2B: SERVICE DETAIL BLOCKS -->
<section class="py-16 sm:py-20 bg-white">
 <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
 <div class="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
 <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.65rem] font-bold tracking-widest uppercase rounded-sm mb-3">Our Services</span>
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">What We Fix</h2>
 <p class="text-secondary">Whatever's wrong with your bath, we've seen it and we've fixed it. From single chip repairs to full restoration. Here&rsquo;s what we fix, how we do it, and what the results look like.</p>
 </div>

 <!-- BLOCK 1: Chip & Crack Repairs. Text-left, image-right -->
 <div class="mb-12 lg:mb-16 reveal">
 <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
 <div class="order-2 lg:order-1">
 <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Chip &amp; Crack Repairs</h3>
 <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Dropped a shampoo bottle? Missing chunk of enamel? We repair chips, cracks, and holes in bathtubs using a two-part epoxy filler that matches your existing finish. No visible patch lines, no weak spots.</p>
 <ul class="space-y-2.5 mb-6">
 <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Single chip or multi-chip repairs available</li>
 <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Invisible colour-matched finish</li>
 <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Most repairs done in under 2 hours</li>
 </ul>
 <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
 </div>
 <div class="order-1 lg:order-2">
 <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none" style="aspect-ratio:3/2;cursor:ew-resize;">
 <div class="absolute inset-0 w-full h-full bg-linear-to-br from-emerald-50 via-white to-[#e7c08b]/20 flex items-center justify-center">
 <img src="<?php echo get_template_directory_uri(); ?>/images/services/bath-resurfacing/chips-after.png" alt="Repaired bathtub" class="w-full h-full object-cover absolute inset-0" />
 </div>
 <div class="ba-clip absolute inset-0" style="clip-path:inset(0 34% 0 0);">
 <div class="ba-before absolute inset-0 bg-linear-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center">
 <img src="<?php echo get_template_directory_uri(); ?>/images/services/bath-resurfacing/chips-before.png" alt="Chipped bathtub" class="w-full h-full object-cover absolute inset-0" />
 </div>
 </div>
 <div class="ba-line absolute top-0 bottom-0 w-[2px] bg-white" style="left:66%;z-index:20;cursor:ew-resize;"></div>
 <div class="ba-handle absolute top-1/2 w-11 h-11 -mt-[22px] -ml-[22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:66%;z-index:25;cursor:ew-resize;">
 <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
 </div>
 <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">Before</span>
 <span class="absolute top-3 right-3 bg-white/80 text-[#041534] text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">After</span>
 </div>
 </div>
 </div>
 </div>

 <!-- BLOCK 2: Stain & Yellowing Removal. Image-left, text-right (alternated) -->
 <div class="mb-12 lg:mb-16 reveal">
 <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
 <div class="order-2 lg:order-2">
 <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Stain &amp; Yellowing Removal</h3>
 <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Yellow rust stains from a dripping tap? Brown hard-water deposits? Old enamel gone dull and grey? We strip decades of stains and restore the original white finish. No abrasive cleaning, no bleach damage.</p>
 <ul class="space-y-2.5 mb-6">
 <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Removes rust, calcium, soap scum buildup</li>
 <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Restores factory-smooth surface feel</li>
 <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Cheaper than full resurface for surface-only stains</li>
 </ul>
 <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
 </div>
 <div class="order-1 lg:order-1">
 <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none" style="aspect-ratio:3/2;cursor:ew-resize;">
 <div class="absolute inset-0 w-full h-full bg-linear-to-br from-emerald-50 via-white to-[#e7c08b]/20 flex items-center justify-center">
 <img src="<?php echo get_template_directory_uri(); ?>/images/services/bath-resurfacing/stain-after.png" alt="Clean restored bathtub" class="w-full h-full object-cover absolute inset-0" />
 </div>
 <div class="ba-clip absolute inset-0" style="clip-path:inset(0 50% 0 0);">
 <div class="ba-before absolute inset-0 bg-linear-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center">
 <img src="<?php echo get_template_directory_uri(); ?>/images/services/bath-resurfacing/stain-before.png" alt="Stained bathtub" class="w-full h-full object-cover absolute inset-0" />
 </div>
 </div>
 <div class="ba-line absolute top-0 bottom-0 w-[2px] bg-white" style="left:50%;z-index:20;cursor:ew-resize;"></div>
 <div class="ba-handle absolute top-1/2 w-11 h-11 -mt-[22px] -ml-[22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;">
 <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
 </div>
 <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">Before</span>
 <span class="absolute top-3 right-3 bg-white/80 text-[#041534] text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">After</span>
 </div>
 </div>
 </div>
 </div>

 <!-- BLOCK 3: Faded or Outdated Colour. Text-left, image-right -->
 <div class="mb-12 lg:mb-16 reveal">
 <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
 <div class="order-2 lg:order-1">
 <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Faded or Outdated Colour</h3>
 <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Avocado green, baby pink, powder blue? Dated bath colours make your whole bathroom look old. We spray a clean high-gloss white finish over the existing surface for an instant modern look.</p>
 <ul class="space-y-2.5 mb-6">
 <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Clean high-gloss white finish</li>
 <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Light custom tints (cream, off-white) by request</li>
 <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Instantly modernises your bathroom</li>
 </ul>
 <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
 </div>
 <div class="order-1 lg:order-2">
 <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none" style="aspect-ratio:3/2;cursor:ew-resize;">
 <div class="absolute inset-0 w-full h-full bg-linear-to-br from-emerald-50 via-white to-[#e7c08b]/20 flex items-center justify-center">
 <img src="<?php echo get_template_directory_uri(); ?>/images/services/bath-resurfacing/colour-after.png" alt="Modern white bath" class="w-full h-full object-cover absolute inset-0" />
 </div>
 <div class="ba-clip absolute inset-0" style="clip-path:inset(0 50% 0 0);">
 <div class="ba-before absolute inset-0 bg-linear-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center">
 <img src="<?php echo get_template_directory_uri(); ?>/images/services/bath-resurfacing/colour-before.png" alt="Dated coloured bath" class="w-full h-full object-cover absolute inset-0" />
 </div>
 </div>
 <div class="ba-line absolute top-0 bottom-0 w-[2px] bg-white" style="left:50%;z-index:20;cursor:ew-resize;"></div>
 <div class="ba-handle absolute top-1/2 w-11 h-11 -mt-[22px] -ml-[22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;">
 <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
 </div>
 <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">Before</span>
 <span class="absolute top-3 right-3 bg-white/80 text-[#041534] text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">After</span>
 </div>
 </div>
 </div>
 </div>

 <!-- BLOCK 4: Worn & Rough Finish. Image-left, text-right (alternated) -->
 <div class="reveal">
 <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
 <div class="order-2 lg:order-2">
 <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Worn &amp; Rough Finish</h3>
 <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Bath feels rough when you run your hand across it? Lost its gloss years ago? The enamel wears down over time, trapping dirt and making it impossible to keep clean. We restore the surface to smooth, glossy, factory-new condition.</p>
 <ul class="space-y-2.5 mb-6">
 <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Works on porcelain, acrylic, cast iron, and fibreglass</li>
 <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Smooth, glossy finish that stays clean</li>
 <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Feels brand new to the touch</li>
 </ul>
 <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
 </div>
 <div class="order-1 lg:order-1">
 <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none" style="aspect-ratio:3/2;cursor:ew-resize;">
 <div class="absolute inset-0 w-full h-full bg-linear-to-br from-emerald-50 via-white to-[#e7c08b]/20 flex items-center justify-center">
 <img src="<?php echo get_template_directory_uri(); ?>/images/services/bath-resurfacing/worn-after.png" alt="Smooth glossy finish" class="w-full h-full object-cover absolute inset-0" />
 </div>
 <div class="ba-clip absolute inset-0" style="clip-path:inset(0 50% 0 0);">
 <div class="ba-before absolute inset-0 bg-linear-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center">
 <img src="<?php echo get_template_directory_uri(); ?>/images/services/bath-resurfacing/worn-before.png" alt="Worn rough finish" class="w-full h-full object-cover absolute inset-0" />
 </div>
 </div>
 <div class="ba-line absolute top-0 bottom-0 w-[2px] bg-white" style="left:50%;z-index:20;cursor:ew-resize;"></div>
 <div class="ba-handle absolute top-1/2 w-11 h-11 -mt-[22px] -ml-[22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;">
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


<!-- ═══════════════════════════════════════════════════
 SECTION 3: RESURFACING vs REPLACEMENT COMPARISON
 ═══════════════════════════════════════════════════ -->
<section class="py-16 sm:py-20 bg-white">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <div class="text-center mb-12 vs-head">
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">Full Replacement vs Our Resurfacing</h2>
 <p class="text-secondary max-w-2xl mx-auto">Why spend thousands replacing your bath when resurfacing costs up to 80% less?</p>
 </div>
 <style>
 .vs-hint,.vs-bar{display:none;}
 @media (max-width:767px){
 .vs-head{margin-bottom:16px;}
 .vs-track{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;gap:14px;padding:10px 3px 14px;}
 .vs-track::-webkit-scrollbar{display:none;}
 .vs-track>div{flex:0 0 86%;scroll-snap-align:center;}
 .vs-hint{display:block;text-align:center;font-size:12px;font-weight:600;color:#595e6d;margin:10px 0 6px;}
 .vs-bar{display:block;position:relative;overflow:hidden;width:72px;height:4px;border-radius:9999px;background:#dbe1e8;margin:0 auto;}
 .vs-thumb{position:absolute;left:0;top:0;height:100%;width:50%;border-radius:9999px;background:#041534;}
 }
 </style>
 <div id="vs-cmp1" class="vs-track grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
 <!-- LEFT: Full Replacement (Red / Bad) -->
 <div class="bg-red-50/50 rounded-2xl p-8 border-2 border-red-200 relative overflow-hidden reveal">
 <div class="absolute top-0 right-0 bg-red-100 text-red-700 text-[0.6rem] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">Expensive</div>
 <div class="flex items-center gap-3 mb-6">
 <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-red-600" aria-hidden="true">close</span></div>
 <h3 class="text-xl font-extrabold text-primary">Full Replacement</h3>
 </div>
 <ul class="space-y-4">
 <li class="flex items-start gap-3">
 <span class="material-symbols-outlined text-red-500 text-lg mt-0.5 shrink-0" aria-hidden="true">close</span>
 <div><p class="font-bold text-primary text-sm">Thousands more</p><p class="text-xs text-secondary">Bath + plumber + tiler + waterproofing</p></div>
 </li>
 <li class="flex items-start gap-3">
 <span class="material-symbols-outlined text-red-500 text-lg mt-0.5 shrink-0" aria-hidden="true">close</span>
 <div><p class="font-bold text-primary text-sm">3-5 days</p><p class="text-xs text-secondary">Demolition, install, tiling, drying</p></div>
 </li>
 <li class="flex items-start gap-3">
 <span class="material-symbols-outlined text-red-500 text-lg mt-0.5 shrink-0" aria-hidden="true">close</span>
 <div><p class="font-bold text-primary text-sm">Full demolition required</p><p class="text-xs text-secondary">Dust, noise, tile damage risk</p></div>
 </li>
 <li class="flex items-start gap-3">
 <span class="material-symbols-outlined text-red-500 text-lg mt-0.5 shrink-0" aria-hidden="true">close</span>
 <div><p class="font-bold text-primary text-sm">Multiple trades needed</p><p class="text-xs text-secondary">Plumber, tiler, waterproofer, painter</p></div>
 </li>
 <li class="flex items-start gap-3">
 <span class="material-symbols-outlined text-red-500 text-lg mt-0.5 shrink-0" aria-hidden="true">close</span>
 <div><p class="font-bold text-primary text-sm">Bathroom unusable for days</p><p class="text-xs text-secondary">No bath access during install</p></div>
 </li>
 </ul>
 </div>
 <!-- RIGHT: Our Resurfacing (Green / Good) -->
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
 <div><p class="font-bold text-primary text-sm">1 day (5-8 hours)</p><p class="text-xs text-secondary">Most baths done same day</p></div>
 </li>
 <li class="flex items-start gap-3">
 <span class="material-symbols-outlined text-green-600 text-lg mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span>
 <div><p class="font-bold text-primary text-sm">Zero demolition</p><p class="text-xs text-secondary">No dust, no noise, no damage</p></div>
 </li>
 <li class="flex items-start gap-3">
 <span class="material-symbols-outlined text-green-600 text-lg mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span>
 <div><p class="font-bold text-primary text-sm">Single visit</p><p class="text-xs text-secondary">One tradesperson, one day</p></div>
 </li>
 <li class="flex items-start gap-3">
 <span class="material-symbols-outlined text-green-600 text-lg mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span>
 <div><p class="font-bold text-primary text-sm">Bath usable next day</p><p class="text-xs text-secondary">24-48 hour cure, then back to normal</p></div>
 </li>
 </ul>
 </div>
 </div>
 <p class="vs-hint" aria-hidden="true">Swipe to compare &rarr;</p>
 <div class="vs-bar" data-for="#vs-cmp1" aria-hidden="true"><span class="vs-thumb"></span></div>
 </div>
</section>

<!-- COMPACT MID-PAGE CTA -->
<div class="bg-primary py-5 sm:py-6">
 <div class="max-w-5xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
 <p class="text-white font-bold text-sm sm:text-base text-center sm:text-left">Ready to get started? Send us photos for a free quote in hours.</p>
 <a href="#quote" class="shrink-0 px-6 py-3 bg-white text-primary font-bold text-sm rounded-lg hover:shadow-lg transition-all whitespace-nowrap">Get Your Free Quote &rarr;</a>
 </div>
</div>


<!-- VALUE PROPOSITION. Compact horizontal strip -->
<section class="py-10 sm:py-12 bg-surface">
 <div class="max-w-6xl mx-auto px-6 sm:px-8">
 <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter text-center mb-8">Why Choose Timeless?</h2>
 <div class="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
 <div class="flex items-start gap-3">
 <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
 <span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">bolt</span>
 </div>
 <div>
 <h3 class="font-bold text-primary text-sm">Free Quote in Hours</h3>
 <p class="text-xs text-secondary leading-relaxed">Send photos, get a fixed price back. No home visit needed.</p>
 </div>
 </div>
 <div class="flex items-start gap-3">
 <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
 <span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">schedule</span>
 </div>
 <div>
 <h3 class="font-bold text-primary text-sm">Same-Day Service</h3>
 <p class="text-xs text-secondary leading-relaxed">Most baths done in one day. Ready to use the next morning.</p>
 </div>
 </div>
 <div class="flex items-start gap-3">
 <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
 <span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">verified_user</span>
 </div>
 <div>
 <h3 class="font-bold text-primary text-sm">Up to 5-Year Warranty</h3>
 <p class="text-xs text-secondary leading-relaxed">Workmanship covered. Fully insured with public liability.</p>
 </div>
 </div>
 <div class="flex items-start gap-3">
 <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
 <span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">cleaning_services</span>
 </div>
 <div>
 <h3 class="font-bold text-primary text-sm">No Mess Promise</h3>
 <p class="text-xs text-secondary leading-relaxed">Drop sheets, dust extraction, full cleanup. Cleaner than we found it.</p>
 </div>
 </div>
 </div>
 </div>
</section>

<!-- ═══════════════════════════════════════════════════
 SECTION 4: PROCESS
 ═══════════════════════════════════════════════════ -->
<!-- OUR PROCESS -->
<section class="py-16 sm:py-20 bg-white">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <div class="max-w-3xl mx-auto text-center mb-12">
 <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.65rem] font-bold tracking-widest uppercase rounded-sm mb-3">Our Process</span>
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">How We Resurface Your Bath</h2>
 <p class="text-secondary">Every step exists for a reason. Here's exactly what we do and why.</p>
 </div>
 <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
 <div class="bg-surface-container-low rounded-2xl p-6 reveal">
 <div class="flex items-center gap-3 mb-4">
 <div class="w-10 h-10 rounded-full bg-[#e7c08b]/20 flex items-center justify-center shrink-0"><span class="text-sm font-black text-[#7a5c10]">1</span></div>
 <h3 class="font-bold text-primary">Assessment &amp; Repair</h3>
 </div>
 <p class="text-sm text-secondary leading-relaxed">Inspect for chips, cracks, and damage. Fill and sand any defects with two-part epoxy so the surface is completely smooth.</p>
 </div>
 <div class="bg-surface-container-low rounded-2xl p-6 reveal">
 <div class="flex items-center gap-3 mb-4">
 <div class="w-10 h-10 rounded-full bg-[#e7c08b]/20 flex items-center justify-center shrink-0"><span class="text-sm font-black text-[#7a5c10]">2</span></div>
 <h3 class="font-bold text-primary">Surface Preparation</h3>
 </div>
 <p class="text-sm text-secondary leading-relaxed">Chemical etching and degreasing creates microscopic grooves for the coating to bond to. This separates professional work from DIY kits.</p>
 </div>
 <div class="bg-surface-container-low rounded-2xl p-6 reveal">
 <div class="flex items-center gap-3 mb-4">
 <div class="w-10 h-10 rounded-full bg-[#e7c08b]/20 flex items-center justify-center shrink-0"><span class="text-sm font-black text-[#7a5c10]">3</span></div>
 <h3 class="font-bold text-primary">Priming</h3>
 </div>
 <p class="text-sm text-secondary leading-relaxed">Specialist adhesion primer bonds to both the original surface and the top coat, creating a bridge between old and new.</p>
 </div>
 </div>
 <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto lg:max-w-[calc(66.666%+0.75rem)]">
 <div class="bg-surface-container-low rounded-2xl p-6 reveal">
 <div class="flex items-center gap-3 mb-4">
 <div class="w-10 h-10 rounded-full bg-[#e7c08b]/20 flex items-center justify-center shrink-0"><span class="text-sm font-black text-[#7a5c10]">4</span></div>
 <h3 class="font-bold text-primary">Top Coat Application</h3>
 </div>
 <p class="text-sm text-secondary leading-relaxed">Professional spray-applied coating in multiple thin layers. Factory-smooth, glass-like finish with no brush marks.</p>
 </div>
 <div class="bg-surface-container-low rounded-2xl p-6 reveal">
 <div class="flex items-center gap-3 mb-4">
 <div class="w-10 h-10 rounded-full bg-[#e7c08b]/20 flex items-center justify-center shrink-0"><span class="text-sm font-black text-[#7a5c10]">5</span></div>
 <h3 class="font-bold text-primary">Cure &amp; Quality Check</h3>
 </div>
 <p class="text-sm text-secondary leading-relaxed">24-hour cure at room temperature. Final inspection for consistency and finish quality. Bath ready to use the next day.</p>
 </div>
 </div>
 </div>
</section>

<!-- GOOGLE REVIEWS. Auto-updating via Google Places API (self-hosted, see timeless_render_google_reviews in functions.php) -->
<section class="py-16 sm:py-20 bg-white">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <div class="text-center mb-10">
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">What Our Customers Say</h2>
 <div class="flex items-center justify-center gap-2"><div class="flex text-amber-400 text-lg" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div><span class="sr-only">5 out of 5 stars</span><span class="text-sm font-bold text-primary">4.9</span><span class="text-xs text-secondary">Google Rating</span></div>
 </div>
 <?php timeless_render_google_reviews(); ?>
 </div>
</section>


<!-- ═══════════════════════════════════════════════════
 SECTION 9: FAQ
 ═══════════════════════════════════════════════════ -->
<section class="py-14 sm:py-16 bg-surface-container-low" id="faqs">
 <div class="max-w-6xl mx-auto px-6 sm:px-8">
 <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
 <!-- Left: intro -->
 <div>
 <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter mb-3">Questions? We&rsquo;ve Got Answers</h2>
 <p class="text-sm text-secondary leading-relaxed mb-6">Not sure if resurfacing is right for your bathroom? Wondering about cost, timing, or what&rsquo;s involved? These are the questions we hear most from Sydney homeowners. If you don&rsquo;t see yours here, send us a message or call. We&rsquo;re always happy to chat. No pressure, no obligation.</p>
 <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all">Ask Us Anything <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
 </div>
 <!-- Right: accordion -->
 <div class="space-y-2">
 <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How much does bath resurfacing cost?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Every bath is different. Send us photos and we&rsquo;ll have a fixed-price quote back within 1 business day. No hidden fees, no obligation.</p></div></div>
 <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How long does it take?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Most baths are done in 5-8 hours. Your bath is ready to use again the next day.</p></div></div>
 <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How long does it last?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Instantly modernises your bathroom. Every job backed by our up to 3-year workmanship warranty.</p></div></div>
 <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Can you resurface any type of bath?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Yes. Porcelain, enamel, cast iron, acrylic, and fibreglass. The only exception is natural stone.</p></div></div>
 <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">What colour will my bath be?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Standard finish is high-gloss white. Clean and modern. Light custom tints (cream, off-white) available by request. Just mention it in your quote.</p></div></div>
 </div>
 </div>
 </div>
</section>



<!-- QUOTE FORM -->
<!-- QUOTE FORM, homepage-style section (badge + heading + clean card), unified per Allan 2026-06-11 -->
<section class="py-16 sm:py-24 bg-surface-container-low" id="quote">
 <div class="max-w-4xl mx-auto px-6 sm:px-8 text-center mb-8">
 <span class="inline-block py-1 px-3 bg-primary text-white text-xs font-bold tracking-widest uppercase rounded-sm mb-4">Request A Quote</span>
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mb-4">Get Your Free Quote Today!</h2>
 <p class="text-secondary text-base sm:text-lg leading-relaxed" style="text-wrap:pretty;">Send us a quick photo and a few details and we&rsquo;ll send you a fixed-price quote within 24 hours.<br />No&nbsp;pressure. No&nbsp;hidden&nbsp;fees. Just&nbsp;your&nbsp;bathroom, renewed.</p>
 </div>
 <div class="max-w-xl mx-auto px-6 sm:px-8">
 <div class="bg-white rounded-2xl overflow-hidden shadow-2xl">
 <div class="p-2 sm:p-4"><?php echo do_shortcode( '[timeless_quote_form]' ); ?></div>
 </div>
 </div>
</section>

</main>


<script>
/* -- FAQ Toggle -- */
window.toggleFaq = function(btn){ var item = btn.parentElement; var isOpen = item.classList.contains('open'); document.querySelectorAll('.faq-item').forEach(function(el){ el.classList.remove('open'); }); if(!isOpen) item.classList.add('open'); };

/* -- Scroll Reveal -- */
var obs = new IntersectionObserver(function(entries){ entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); } }); }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(function(el){ obs.observe(el); });
</script>

<?php get_footer(); ?>
