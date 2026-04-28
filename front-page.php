<?php
/* Template Name: Homepage */
get_header(); ?>

<!-- Schema: LocalBusiness -->
<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "HomeAndConstructionBusiness",
 "name": "Timeless Resurfacing",
 "description": "Sydney's specialist bathroom resurfacing and shower regrouting service.",
 "url": "https://timelessresurfacing.com.au",
 "telephone": "<?php echo timeless_phone_link(); ?>",
 "address": { "@type": "PostalAddress", "addressLocality": "Sydney", "addressRegion": "NSW", "addressCountry": "AU" },
 "geo": { "@type": "GeoCoordinates", "latitude": -33.8688, "longitude": 151.2093 },
 "areaServed": [
 { "@type": "City", "name": "Sydney" },
 { "@type": "City", "name": "Wollongong" },
 { "@type": "City", "name": "Central Coast" },
 { "@type": "City", "name": "Parramatta" },
 { "@type": "City", "name": "Bondi" }
 ],
 "openingHoursSpecification": { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "07:00", "closes": "17:00" },
 "priceRange": "$$",<?php echo timeless_aggregate_rating_jsonld('middle'); ?>
 "hasOfferCatalog": {
 "@type": "OfferCatalog", "name": "Bathroom Resurfacing Services",
 "itemListElement": [
 { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Shower Regrouting", "description": "Full grout removal and replacement with premium waterproof epoxy grout." } },
 { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Bath Resurfacing", "description": "Restore chipped or stained bathtubs to factory-new condition with professional-grade system." } },
 { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Tile Resurfacing", "description": "Transform outdated bathroom tiles with durable high-gloss architectural finish." } },
 { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Vanity Refinishing", "description": "Benchtop resurfacing and cabinet respray with stone-fleck or satin finish options." } },
 { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Basin Restoration", "description": "Chip repair and full resurface for porcelain, acrylic, and cast iron basins." } },
 { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Shower Sealing", "description": "Silicone replacement and waterproof epoxy regrouting to stop shower leaks permanently." } }
 ]
 }
}
</script>

<!-- Schema: FAQPage -->
<script type="application/ld+json">
{
 "@context": "https://schema.org", "@type": "FAQPage",
 "mainEntity": [
 { "@type": "Question", "name": "How long does bathroom resurfacing take?", "acceptedAnswer": { "@type": "Answer", "text": "Most jobs are completed in a single day (6-8 hours). Your bathroom is ready to use again 24 hours after completion." } },
 { "@type": "Question", "name": "How much does bathroom resurfacing cost in Sydney?", "acceptedAnswer": { "@type": "Answer", "text": "Every bathroom is different, so we provide fixed-price quotes based on your photos. A complete bathroom resurfacing package typically saves 80-90% compared to a full renovation. Send us photos for an accurate quote within hours." } },
 { "@type": "Question", "name": "How long does resurfacing last?", "acceptedAnswer": { "@type": "Answer", "text": "With proper care, up to 10 years. We use commercial-grade two-part epoxy coatings resistant to chipping, peeling, and yellowing. All work backed by our workmanship warranty." } },
 { "@type": "Question", "name": "Is resurfacing worth it vs full renovation?", "acceptedAnswer": { "@type": "Answer", "text": "For most homeowners, yes. up to 80% cheaper, 1 day instead of 2-4 weeks, zero demolition, no construction waste. Ideal for rentals, pre-sale upgrades, and structurally sound bathrooms." } },
 { "@type": "Question", "name": "Do you check for asbestos?", "acceptedAnswer": { "@type": "Answer", "text": "If your home was built before 1990, NSW regulations may require an asbestos assessment. We advise during quoting if a check is needed." } },
 { "@type": "Question", "name": "What areas do you service?", "acceptedAnswer": { "@type": "Answer", "text": "Entire Greater Sydney. Inner West, Eastern Suburbs, North Shore, Northern Beaches, Western Sydney, Sutherland Shire, Hills District. Plus Wollongong, Central Coast, Blue Mountains." } },
 { "@type": "Question", "name": "Can you resurface coloured tiles?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Works on all tile types including coloured, textured, patterned, and mosaic. We transform outdated tiles into clean, modern finishes." } },
 { "@type": "Question", "name": "What warranty do you provide?", "acceptedAnswer": { "@type": "Answer", "text": "Workmanship warranty on every job covering peeling, bubbling, and adhesion failure. Warranty terms vary by service type. Up to 3 years for resurfacing. Fully insured with public liability." } }
 ]
}
</script>

<!-- HERO -->
<section class="relative pt-28 sm:pt-32 pb-16 sm:pb-20 bg-surface">
 <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
 <div class="md:col-span-7">
 <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.7rem] font-bold tracking-widest uppercase rounded-sm mb-6">Sydney&rsquo;s Bathroom Experts</span>
 <h1 class="text-[35px] sm:text-5xl lg:text-7xl font-extrabold text-primary tracking-tighter leading-[0.95] mb-6 sm:mb-8">
 Bathroom<br class="sm:hidden" /> Resurfacing<br /> <span class="text-primary-soft">Sydney Specialists</span>
 </h1>
 <p class="text-base sm:text-lg lg:text-xl text-secondary leading-relaxed max-w-xl mb-6">
 One-day bathroom transformations across Greater Sydney. Save <strong>up to 80% versus full renovation</strong> with zero demolition, zero mess, and an up to 3-year workmanship warranty.
 </p>
 <!-- MOBILE: Image between text and CTA -->
 <div class="md:hidden mb-6">
 <div id="hero-slider-mobile" class="rounded-2xl overflow-hidden shadow-2xl relative select-none" style="aspect-ratio:4/3;cursor:ew-resize;">
 <div class="absolute inset-0 w-full h-full">
 <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/after.jpg" alt="After bathroom resurfacing" class="w-full h-full object-cover" style="object-position:center 70%;" draggable="false" fetchpriority="high" width="800" height="600" />
 </div>
 <div id="mob-clip" class="absolute inset-0" style="clip-path:inset(0 50% 0 0);">
 <img id="mob-before-img" src="<?php echo get_template_directory_uri(); ?>/images/homepage/before.jpg" alt="Before bathroom resurfacing" draggable="false" class="absolute inset-0 w-full h-full object-cover" style="object-position:center 70%;" />
 </div>
 <div id="mob-line" class="absolute top-0 bottom-0 w-0.5 bg-white" style="left:50%;z-index:20;cursor:ew-resize;"></div>
 <div id="mob-handle" class="absolute top-1/2 w-11 h-11 mt-[-22px] ml-[-22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;">
 <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
 </div>
 <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">Before</span>
 <span class="absolute top-3 right-3 bg-white/80 text-primary text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">After</span>
 <div class="absolute bottom-3 left-3 right-3 p-3 bg-white/90 backdrop-blur-md rounded-lg flex justify-between items-center" style="z-index:15;">
 <span class="text-xs font-bold text-primary">Drag to Compare</span>
 <span class="text-xs font-bold text-primary-soft">Completed in 7 Hours</span>
 </div>
 </div>
 </div>
 <a class="inline-block w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-lg text-center hover:shadow-xl transition-all" href="#quote">Get Your Free Quote</a>
 <div class="mt-6 flex items-center gap-3">
 <div class="flex -space-x-2" aria-hidden="true">
 <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/reviews/reviewer-1.png" alt="" class="w-8 h-8 rounded-full border-2 border-white object-cover" width="96" height="96" loading="lazy" />
 <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/reviews/reviewer-2.png" alt="" class="w-8 h-8 rounded-full border-2 border-white object-cover" width="96" height="96" loading="lazy" />
 <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/reviews/reviewer-3.png" alt="" class="w-8 h-8 rounded-full border-2 border-white object-cover" width="96" height="96" loading="lazy" />
 </div>
 <p class="text-sm font-medium text-secondary"><strong class="text-primary">4.9<span aria-hidden="true">&#9733;</span></strong><span class="sr-only">, 5 stars</span> Google Rating from NSW Homeowners</p>
 </div>
 </div>
 <!-- DESKTOP: Image in right column -->
 <div class="hidden md:block md:col-span-5">
 <div id="hero-slider" class="rounded-2xl overflow-hidden shadow-2xl relative select-none" style="aspect-ratio:5/6;cursor:ew-resize;">
 <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/after.jpg" alt="After bathroom resurfacing Sydney" class="absolute inset-0 w-full h-full object-cover" draggable="false" fetchpriority="high" width="800" height="960" />
 <div id="ba-clip" class="absolute inset-0" style="clip-path:inset(0 50% 0 0);">
 <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/before.jpg" alt="Before bathroom resurfacing Sydney" draggable="false" id="ba-before-img" class="absolute inset-0 w-full h-full object-cover" />
 </div>
 <div id="ba-line" class="absolute top-0 bottom-0 w-0.5 bg-white" style="left:50%;z-index:20;cursor:ew-resize;"></div>
 <div id="ba-handle" class="absolute top-1/2 w-11 h-11 mt-[-22px] ml-[-22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;">
 <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
 </div>
 <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">Before</span>
 <span class="absolute top-3 right-3 bg-white/80 text-primary text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style="z-index:15;">After</span>
 <div class="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 p-3 bg-white/90 backdrop-blur-md rounded-lg flex justify-between items-center" style="z-index:15;">
 <span class="text-xs font-bold text-primary">Drag to Compare</span>
 <span class="text-xs font-bold text-primary-soft">Completed in 7 Hours</span>
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

<?php $logo = get_template_directory_uri() . '/images/homepage/logos'; ?>
<!-- TRUST LOGO BAR -->
<section class="py-8 sm:py-10 bg-surface-container-low/50">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <p class="text-center text-sm text-secondary mb-6">Trusted by Hundreds of Australians, from Homeowners to Major Brands</p>
 </div>
 <div class="max-w-6xl mx-auto px-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing" id="hp-logo-scroller" style="-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none;">
 <div class="flex items-center gap-5 sm:gap-8 w-max px-8" id="hp-logo-inner">
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
 <div id="hp-logo-dots" class="flex justify-center gap-1.5 mt-4"></div>
</section>

<!-- SERVICES. Circle images, horizontal scroll on mobile -->
<section class="py-16 sm:py-24 bg-surface-container-low" id="services">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <div class="mb-10">
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-4">Bathroom Resurfacing Services</h2>
 <p class="text-secondary max-w-2xl">Professional bathroom transformations completed in as little as one day.</p>
 <div class="h-1 w-20 bg-tertiary-fixed-dim mt-4"></div>
 </div>
 </div>
 <div class="max-w-7xl mx-auto pl-6 sm:px-8">
 <div class="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 pr-6 sm:pr-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0" style="-webkit-overflow-scrolling:touch;scrollbar-width:none;">
 <a href="<?php echo esc_url( home_url( '/services/shower-regrouting/' ) ); ?>" class="w-[72vw] max-w-[300px] sm:w-auto sm:max-w-none snap-start bg-white rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group reveal block shrink-0 text-center">
 <div class="w-24 h-24 rounded-full bg-emerald-50 mx-auto mb-4 flex items-center justify-center overflow-hidden">
 <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/shower-regrouting.jpg" srcset="<?php echo get_template_directory_uri(); ?>/images/homepage/shower-regrouting-400w.jpg 400w, <?php echo get_template_directory_uri(); ?>/images/homepage/shower-regrouting.jpg 800w" sizes="(max-width: 640px) 200px, 250px" alt="Shower regrouting service" class="w-full h-full object-cover rounded-full" width="400" height="400" loading="lazy" />
 </div>
 <h3 class="text-lg font-bold text-primary mb-2">Shower Regrouting</h3>
 <p class="text-secondary text-sm leading-relaxed mb-3">Full grout removal &amp; replacement with premium waterproof epoxy. Same-day service.</p>
 <span class="text-xs font-bold text-primary flex items-center justify-center gap-1 group-hover:gap-2 transition-all">Learn More <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span>
 </a>
 <a href="<?php echo esc_url( home_url( '/services/bath-resurfacing/' ) ); ?>" class="w-[72vw] max-w-[300px] sm:w-auto sm:max-w-none snap-start bg-white rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group reveal block shrink-0 text-center">
 <div class="w-24 h-24 rounded-full bg-emerald-50 mx-auto mb-4 flex items-center justify-center overflow-hidden">
 <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/bath-resurfacing.png" srcset="<?php echo get_template_directory_uri(); ?>/images/homepage/bath-resurfacing-400w.png 400w, <?php echo get_template_directory_uri(); ?>/images/homepage/bath-resurfacing.png 800w" sizes="(max-width: 640px) 200px, 250px" alt="Bath resurfacing service" class="w-full h-full object-cover rounded-full" width="400" height="400" loading="lazy" />
 </div>
 <h3 class="text-lg font-bold text-primary mb-2">Bath Resurfacing</h3>
 <p class="text-secondary text-sm leading-relaxed mb-3">Restore chipped or stained bathtubs to brilliant shine. Lasts up to 10 years.</p>
 <span class="text-xs font-bold text-primary flex items-center justify-center gap-1 group-hover:gap-2 transition-all">Learn More <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span>
 </a>
 <a href="<?php echo esc_url( home_url( '/services/tile-resurfacing/' ) ); ?>" class="w-[72vw] max-w-[300px] sm:w-auto sm:max-w-none snap-start bg-white rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group reveal block shrink-0 text-center">
 <div class="w-24 h-24 rounded-full bg-emerald-50 mx-auto mb-4 flex items-center justify-center overflow-hidden">
 <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/tile-resurfacing.png" srcset="<?php echo get_template_directory_uri(); ?>/images/homepage/tile-resurfacing-400w.png 400w, <?php echo get_template_directory_uri(); ?>/images/homepage/tile-resurfacing.png 800w" sizes="(max-width: 640px) 200px, 250px" alt="Tile resurfacing service" class="w-full h-full object-cover rounded-full" width="400" height="400" loading="lazy" />
 </div>
 <h3 class="text-lg font-bold text-primary mb-2">Tile Resurfacing</h3>
 <p class="text-secondary text-sm leading-relaxed mb-3">Transform outdated tiles into a clean, modern finish. No demolition required.</p>
 <span class="text-xs font-bold text-primary flex items-center justify-center gap-1 group-hover:gap-2 transition-all">Learn More <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span>
 </a>
 <a href="<?php echo esc_url( home_url( '/services/vanity-refinishing/' ) ); ?>" class="w-[72vw] max-w-[300px] sm:w-auto sm:max-w-none snap-start bg-white rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group reveal block shrink-0 text-center">
 <div class="w-24 h-24 rounded-full bg-emerald-50 mx-auto mb-4 flex items-center justify-center overflow-hidden">
 <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/vanity-resurfacing.png" srcset="<?php echo get_template_directory_uri(); ?>/images/homepage/vanity-resurfacing-400w.png 400w, <?php echo get_template_directory_uri(); ?>/images/homepage/vanity-resurfacing.png 800w" sizes="(max-width: 640px) 200px, 250px" alt="Vanity resurfacing service" class="w-full h-full object-cover rounded-full" width="400" height="400" loading="lazy" />
 </div>
 <h3 class="text-lg font-bold text-primary mb-2">Vanity Refinishing</h3>
 <p class="text-secondary text-sm leading-relaxed mb-3">Stone-fleck or sleek satin finish. 900+ colours available.</p>
 <span class="text-xs font-bold text-primary flex items-center justify-center gap-1 group-hover:gap-2 transition-all">Learn More <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span>
 </a>
 <a href="<?php echo esc_url( home_url( '/services/basin-restoration/' ) ); ?>" class="w-[72vw] max-w-[300px] sm:w-auto sm:max-w-none snap-start bg-white rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group reveal block shrink-0 text-center">
 <div class="w-24 h-24 rounded-full bg-emerald-50 mx-auto mb-4 flex items-center justify-center overflow-hidden">
 <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/basin-resurfacing.png" srcset="<?php echo get_template_directory_uri(); ?>/images/homepage/basin-resurfacing-400w.png 400w, <?php echo get_template_directory_uri(); ?>/images/homepage/basin-resurfacing.png 800w" sizes="(max-width: 640px) 200px, 250px" alt="Basin resurfacing service" class="w-full h-full object-cover rounded-full" width="400" height="400" loading="lazy" />
 </div>
 <h3 class="text-lg font-bold text-primary mb-2">Basin Restoration</h3>
 <p class="text-secondary text-sm leading-relaxed mb-3">Chip repair &amp; full resurface for porcelain, cast iron, and acrylic basins.</p>
 <span class="text-xs font-bold text-primary flex items-center justify-center gap-1 group-hover:gap-2 transition-all">Learn More <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span>
 </a>
 <a href="<?php echo esc_url( home_url( '/services/shower-leak-repair/' ) ); ?>" class="w-[72vw] max-w-[300px] sm:w-auto sm:max-w-none snap-start bg-white rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group reveal block shrink-0 text-center">
 <div class="w-24 h-24 rounded-full bg-emerald-50 mx-auto mb-4 flex items-center justify-center overflow-hidden">
 <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/shower-sealing.png" srcset="<?php echo get_template_directory_uri(); ?>/images/homepage/shower-sealing-400w.png 400w, <?php echo get_template_directory_uri(); ?>/images/homepage/shower-sealing.png 800w" sizes="(max-width: 640px) 200px, 250px" alt="Shower sealing service" class="w-full h-full object-cover rounded-full" width="400" height="400" loading="lazy" />
 </div>
 <h3 class="text-lg font-bold text-primary mb-2">Shower Sealing</h3>
 <p class="text-secondary text-sm leading-relaxed mb-3">Leaking shower? Precision waterproof silicone &amp; epoxy sealing.</p>
 <span class="text-xs font-bold text-primary flex items-center justify-center gap-1 group-hover:gap-2 transition-all">Learn More <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span>
 </a>
 </div>
 <p class="text-center text-[0.6rem] text-secondary mt-3 sm:hidden">Swipe to see more services &rarr;</p>
 </div>
</section>

<!-- MID-PAGE CTA -->
<section class="py-10 sm:py-14 bg-primary">
 <div class="max-w-4xl mx-auto px-6 sm:px-8 text-center">
 <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">Ready for a Quote?</h2>
 <p class="text-on-primary-container text-sm sm:text-base mb-6 max-w-xl mx-auto">Send us a few photos and get a fixed-price quote within hours. No obligation.</p>
 <a href="#quote" class="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-lg hover:shadow-xl transition-all">Get Your Free Quote <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></a>
 </div>
</section>

<!-- COST COMPARISON -->
<section class="py-16 sm:py-20 bg-white">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <div class="max-w-3xl mx-auto text-center mb-12">
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-4">Renovation vs Resurfacing</h2>
 <p class="text-secondary">Why thousands of Sydney homeowners choose resurfacing.</p>
 </div>
 <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
 <div class="bg-red-50/50 rounded-2xl p-8 border-2 border-red-200 relative overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal">
 <div class="absolute top-0 right-0 bg-red-100 text-red-700 text-[0.6rem] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">Expensive</div>
 <div class="flex items-center gap-3 mb-6">
 <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-red-600" aria-hidden="true">close</span></div>
 <h3 class="text-xl font-extrabold text-primary">Full Renovation</h3>
 </div>
 <div class="space-y-4">
 <div class="flex justify-between items-center py-2 border-b border-red-200/60"><span class="text-sm text-secondary flex items-center gap-2"><span class="material-symbols-outlined text-red-400 text-base" aria-hidden="true">close</span> Cost</span><span class="text-lg font-bold text-error">$25,000 - $50,000</span></div>
 <div class="flex justify-between items-center py-2 border-b border-red-200/60"><span class="text-sm text-secondary flex items-center gap-2"><span class="material-symbols-outlined text-red-400 text-base" aria-hidden="true">close</span> Timeline</span><span class="text-sm font-bold text-red-700">2 - 4 weeks</span></div>
 <div class="flex justify-between items-center py-2 border-b border-red-200/60"><span class="text-sm text-secondary flex items-center gap-2"><span class="material-symbols-outlined text-red-400 text-base" aria-hidden="true">close</span> Demolition</span><span class="text-sm font-bold text-error">Required</span></div>
 <div class="flex justify-between items-center py-2"><span class="text-sm text-secondary flex items-center gap-2"><span class="material-symbols-outlined text-red-400 text-base" aria-hidden="true">close</span> Usable</span><span class="text-sm font-bold text-error">After 2+ weeks</span></div>
 </div>
 </div>
 <div class="bg-primary/3 rounded-2xl p-8 border-2 border-primary relative overflow-hidden ring-2 ring-primary/10 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 reveal">
 <div class="absolute top-0 right-0 bg-tertiary-fixed-dim text-on-tertiary-fixed text-[0.6rem] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">Recommended</div>
 <div class="flex items-center gap-3 mb-6">
 <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-emerald-600" aria-hidden="true">check_circle</span></div>
 <h3 class="text-xl font-extrabold text-primary">Resurfacing</h3>
 </div>
 <div class="space-y-4">
 <div class="flex justify-between items-center py-2 border-b border-primary/10"><span class="text-sm text-secondary flex items-center gap-2"><span class="material-symbols-outlined text-emerald-500 text-base" aria-hidden="true">check</span> Cost</span><span class="text-lg font-bold text-primary">up to 80% less</span></div>
 <div class="flex justify-between items-center py-2 border-b border-primary/10"><span class="text-sm text-secondary flex items-center gap-2"><span class="material-symbols-outlined text-emerald-500 text-base" aria-hidden="true">check</span> Timeline</span><span class="text-sm font-bold text-primary">1-3 days</span></div>
 <div class="flex justify-between items-center py-2 border-b border-primary/10"><span class="text-sm text-secondary flex items-center gap-2"><span class="material-symbols-outlined text-emerald-500 text-base" aria-hidden="true">check</span> Demolition</span><span class="text-sm font-bold text-primary">None</span></div>
 <div class="flex justify-between items-center py-2"><span class="text-sm text-secondary flex items-center gap-2"><span class="material-symbols-outlined text-emerald-500 text-base" aria-hidden="true">check</span> Usable</span><span class="text-sm font-bold text-primary">Next Day</span></div>
 </div>
 </div>
 </div>
 </div>
</section>

<!-- PROCESS -->
<section class="py-16 sm:py-24 bg-surface-container-low">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
 <!-- Left: Process image placeholder -->
 <div class="hidden lg:block reveal">
 <div class="rounded-2xl overflow-hidden aspect-3/4 max-w-md mx-auto shadow-xl">
 <img class="w-full h-full object-cover" src="<?php echo get_template_directory_uri(); ?>/images/homepage/how-it-works.png" alt="Professional bathroom resurfacing process in Sydney" loading="lazy" width="600" height="800" />
 </div>
 </div>
 <!-- Right: Steps -->
 <div>
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mb-3">How It Works</h2>
 <p class="text-secondary mb-10">From photo to perfection in four simple steps.</p>
 <div class="space-y-4">
 <div class="flex gap-5 items-start bg-white rounded-xl p-5 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default reveal min-h-[88px]">
 <div class="shrink-0 w-14 h-14 rounded-full bg-[#e7c08b]/15 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-[#c99a55]" aria-hidden="true">photo_camera</span></div>
 <div>
 <h3 class="font-bold text-primary text-base mb-0.5">Step 1: Send Us Photos</h3>
 <p class="text-sm text-secondary leading-relaxed">Snap photos of your bathroom on your phone and upload via our quote form. Takes 2 minutes.</p>
 </div>
 </div>
 <div class="flex gap-5 items-start bg-white rounded-xl p-5 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default reveal min-h-[88px]">
 <div class="shrink-0 w-14 h-14 rounded-full bg-[#e7c08b]/15 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-[#c99a55]" aria-hidden="true">request_quote</span></div>
 <div>
 <h3 class="font-bold text-primary text-base mb-0.5">Step 2: Quote Next Business Day</h3>
 <p class="text-sm text-secondary leading-relaxed">We review your photos and send a transparent fixed-price quote. No hidden fees.</p>
 </div>
 </div>
 <div class="flex gap-5 items-start bg-white rounded-xl p-5 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default reveal min-h-[88px]">
 <div class="shrink-0 w-14 h-14 rounded-full bg-[#e7c08b]/15 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-[#c99a55]" aria-hidden="true">calendar_month</span></div>
 <div>
 <h3 class="font-bold text-primary text-base mb-0.5">Step 3: Book Your Day</h3>
 <p class="text-sm text-secondary leading-relaxed">Available Monday to Friday across Greater Sydney and NSW. We work around your schedule.</p>
 </div>
 </div>
 <div class="flex gap-5 items-start bg-white rounded-xl p-5 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default reveal min-h-[88px]">
 <div class="shrink-0 w-14 h-14 rounded-full bg-[#e7c08b]/15 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-[#c99a55]" aria-hidden="true">celebration</span></div>
 <div>
 <h3 class="font-bold text-primary text-base mb-0.5">Step 4: One-Day Transformation</h3>
 <p class="text-sm text-secondary leading-relaxed">Most jobs done in 6-8 hours. Your bathroom is ready to use the next day.</p>
 </div>
 </div>
 </div>
 <a href="#quote" class="inline-flex items-center gap-2 mt-10 px-8 py-4 bg-primary text-white font-bold rounded-lg hover:shadow-xl transition-all">Send Photos Now <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
 </div>
 </div>
 </div>
</section>

<!-- RECENT TRANSFORMATIONS. Desktop grid, mobile carousel -->
<section class="py-16 sm:py-24 bg-surface" id="portfolio">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <div class="text-center mb-12">
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">Recent Transformations</h2>
 <p class="text-secondary text-sm">Real before and after results from jobs across Sydney.</p>
 </div>
 <?php $t = get_template_directory_uri(); ?>
 <!-- Desktop: 3-col grid -->
 <?php $t = get_template_directory_uri(); ?>
 <div class="hidden lg:grid grid-cols-3 gap-8">
 <div class="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300">
 <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/homepage/transformations/bathtub-before.png" alt="Bathtub before" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/homepage/transformations/bathtub-after.png" alt="Bathtub after" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">After</span></div></div>
 <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Bathtub Resurfacing</span></div>
 </div>
 <div class="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300">
 <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/homepage/transformations/stain-before.png" alt="Stained bathtub" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/homepage/transformations/stain-after.png" alt="Bathtub after stain removal" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">After</span></div></div>
 <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Bathtub Resurfacing</span></div>
 </div>
 <div class="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300">
 <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/homepage/transformations/tile-wall-before.png" alt="Dated wall tiles" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/homepage/transformations/tile-wall-after.png" alt="Clean wall tiles" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">After</span></div></div>
 <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Tile Resurfacing</span></div>
 </div>
 </div>
 <!-- Mobile: single-card carousel -->
 <div class="lg:hidden">
 <div class="overflow-hidden" id="transform-carousel">
 <div class="flex transition-transform duration-300 ease-out" id="transform-track">
 <div class="w-full shrink-0 px-1"><div class="bg-white rounded-2xl overflow-hidden shadow-xs"><div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/homepage/transformations/bathtub-before.png" alt="Bathtub before" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/homepage/transformations/bathtub-after.png" alt="Bathtub after" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">After</span></div></div><div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Bathtub Resurfacing</span></div></div></div>
 <div class="w-full shrink-0 px-1"><div class="bg-white rounded-2xl overflow-hidden shadow-xs"><div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/homepage/transformations/stain-before.png" alt="Stained bathtub" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/homepage/transformations/stain-after.png" alt="Bathtub after stain removal" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">After</span></div></div><div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Bathtub Resurfacing</span></div></div></div>
 <div class="w-full shrink-0 px-1"><div class="bg-white rounded-2xl overflow-hidden shadow-xs"><div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/homepage/transformations/tile-wall-before.png" alt="Dated wall tiles" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/homepage/transformations/tile-wall-after.png" alt="Clean wall tiles" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">After</span></div></div><div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Tile Resurfacing</span></div></div></div>
 </div>
 </div>
 <div class="flex justify-center items-center gap-3 mt-6">
 <button onclick="moveTransform(-1)" class="w-10 h-10 rounded-full border border-surface-container bg-white flex items-center justify-center" aria-label="Previous"><span class="material-symbols-outlined text-primary text-xl">chevron_left</span></button>
 <span id="transform-counter" class="text-xs text-secondary font-medium">1 / 3</span>
 <button onclick="moveTransform(1)" class="w-10 h-10 rounded-full border border-surface-container bg-white flex items-center justify-center" aria-label="Next"><span class="material-symbols-outlined text-primary text-xl">chevron_right</span></button>
 </div>
 </div>
 <div class="text-center mt-10">
 <a href="<?php echo esc_url( home_url( '/gallery/' ) ); ?>" class="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all text-sm">View All Transformations <span class="material-symbols-outlined text-lg" aria-hidden="true">arrow_forward</span></a>
 </div>
 </div>
</section>
<script>
(function(){
 var track=document.getElementById('transform-track'),counter=document.getElementById('transform-counter');
 if(!track)return;var idx=0,total=track.children.length;
 window.moveTransform=function(dir){idx+=dir;if(idx<0)idx=total-1;if(idx>=total)idx=0;track.style.transform='translateX(-'+idx*100+'%)';if(counter)counter.textContent=(idx+1)+' / '+total;};
})();
</script>

<!-- GOOGLE REVIEWS. Auto-updating via Google Places API (self-hosted, see timeless_render_google_reviews in functions.php) -->
<section class="py-16 sm:py-24 bg-surface-container-lowest">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <div class="text-center mb-12">
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-4">What Sydney Homeowners Say</h2>
 <div class="flex items-center justify-center gap-2"><div class="flex text-amber-400 text-lg" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div><span class="sr-only">5 out of 5 stars</span><span class="text-sm font-bold text-primary">4.9</span><span class="text-xs text-secondary">Google Rating</span></div>
 </div>
 <?php timeless_render_google_reviews(); ?>
 </div>
</section>


<!-- WARRANTY -->
<section class="py-16 sm:py-24 bg-primary" id="warranty">
 <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
 <div>
 <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tighter mb-4 sm:mb-6">Up to 3-Year Workmanship Warranty</h2>
 <p class="text-sm sm:text-base text-white/70 leading-relaxed mb-6 sm:mb-8">Every job is backed by our comprehensive warranty. With proper care, our resurfacing can last up to 10 years. If defects arise from our workmanship under normal use, we fix it free. Warranty terms vary by service. We&rsquo;ll confirm the exact coverage in your quote.</p>
 <div class="space-y-3">
 <div class="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/15 transition-all duration-300"><div class="shrink-0 w-10 h-10 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="material-symbols-outlined text-lg text-[#e7c08b]" aria-hidden="true">shield</span></div><div><h3 class="font-bold text-white text-sm mb-0.5">Peeling &amp; Bubbling Cover</h3><p class="text-xs text-white/60">Coating peels or bubbles? We resurface again, free.</p></div></div>
 <div class="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/15 transition-all duration-300"><div class="shrink-0 w-10 h-10 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="material-symbols-outlined text-lg text-[#e7c08b]" aria-hidden="true">verified_user</span></div><div><h3 class="font-bold text-white text-sm mb-0.5">Adhesion Guarantee</h3><p class="text-xs text-white/60">Multi-step prep ensures permanent bonding. Failure covered in full.</p></div></div>
 <div class="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/15 transition-all duration-300"><div class="shrink-0 w-10 h-10 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="material-symbols-outlined text-lg text-[#e7c08b]" aria-hidden="true">security</span></div><div><h3 class="font-bold text-white text-sm mb-0.5">Fully Insured</h3><p class="text-xs text-white/60">Public liability insured on every job for your peace of mind.</p></div></div>
 <div class="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/15 transition-all duration-300"><div class="shrink-0 w-10 h-10 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="material-symbols-outlined text-lg text-[#e7c08b]" aria-hidden="true">handshake</span></div><div><h3 class="font-bold text-white text-sm mb-0.5">No Obligation Quotes</h3><p class="text-xs text-white/60">Send us photos and get a fixed-price quote. No surprises, no hidden costs.</p></div></div>
 </div>
 </div>
 <div class="hidden lg:flex items-center justify-center">
 <div class="w-72 h-72 rounded-full bg-white/5 flex items-center justify-center" style="box-shadow: 0 0 80px rgba(231,192,139,0.15);">
 <div class="w-56 h-56 rounded-full bg-white/10 flex items-center justify-center text-center border border-white/10">
 <div><span class="material-symbols-outlined text-6xl text-[#e7c08b]" style="font-variation-settings:'FILL' 1;" aria-hidden="true">verified</span><p class="text-3xl font-extrabold text-white mt-2">Up to 3 Years</p><p class="text-sm font-bold text-white/60">Warranty</p></div>
 </div>
 </div>
 </div>
 </div>
</section>


<!-- FAQ LINK -->
<section class="py-8 sm:py-10 bg-white">
 <div class="max-w-4xl mx-auto px-6 sm:px-8">
 <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-surface rounded-xl border border-surface-container">
 <div class="flex items-center gap-3">
 <span class="material-symbols-outlined text-2xl text-tertiary-fixed-dim" aria-hidden="true">help</span>
 <div>
 <p class="font-bold text-primary text-sm">Have questions about resurfacing?</p>
 <p class="text-xs text-secondary">Cost, timing, durability, warranty. We&rsquo;ve answered them all.</p>
 </div>
 </div>
 <a href="<?php echo esc_url( home_url( '/faqs/' ) ); ?>" class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:opacity-90 transition-all whitespace-nowrap">View FAQs <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
 </div>
 </div>
</section>

<!-- QUOTE FORM -->
<section class="py-16 sm:py-24 bg-surface-container-low" id="quote">
 <div class="max-w-4xl mx-auto px-6 sm:px-8">
 <div class="bg-white rounded-2xl overflow-hidden shadow-2xl">
 <div class="p-6 sm:p-8 lg:p-12 bg-primary text-white">
 <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Get Your Free Quote</h2>
 <p class="text-on-primary-container text-sm">5 minutes. No obligation. We respond within hours.</p>
 </div>
 <form class="timeless-quote-form p-6 sm:p-8 lg:p-12 space-y-8">
 <fieldset>
 <div class="flex items-center gap-3 mb-6"><span class="text-xs font-black bg-primary text-white w-6 h-6 flex items-center justify-center rounded-sm">1</span><legend class="font-bold text-primary uppercase tracking-wider text-sm">Contact Info</legend></div>
 <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div><label for="name" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Full Name *</label><input id="name" name="name" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="John Citizen" required /></div>
 <div><label for="phone" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Phone *</label><input id="phone" name="phone" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="<?php echo timeless_phone(); ?>" type="tel" required /></div>
 <div class="md:col-span-2"><label for="email" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Email</label><input id="email" name="email" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="john@example.com" type="email" /></div>
 </div>
 </fieldset>
 <fieldset>
 <div class="flex items-center gap-3 mb-6"><span class="text-xs font-black bg-primary text-white w-6 h-6 flex items-center justify-center rounded-sm">2</span><legend class="font-bold text-primary uppercase tracking-wider text-sm">Property</legend></div>
 <div><label for="address" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Address *</label><input id="address" name="address" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Street, Suburb, NSW Postcode" required /></div>
 <div class="mt-4 p-4 bg-error-container/20 rounded-lg flex items-start gap-4 border-l-4 border-error">
 <span class="material-symbols-outlined text-error shrink-0" aria-hidden="true">warning</span>
 <div><p class="text-xs font-bold text-on-error-container mb-1">Asbestos Check (NSW)</p><p class="text-[0.7rem] text-on-error-container/80">Home built before 1990?</p>
 <div class="mt-2 flex gap-4"><label class="flex items-center gap-2 text-xs font-bold text-primary cursor-pointer"><input name="asbestos" type="radio" value="yes" class="text-primary" /> Yes</label><label class="flex items-center gap-2 text-xs font-bold text-primary cursor-pointer"><input name="asbestos" type="radio" value="no" class="text-primary" /> No</label><label class="flex items-center gap-2 text-xs font-bold text-primary cursor-pointer"><input name="asbestos" type="radio" value="unsure" class="text-primary" /> Unsure</label></div>
 </div>
 </div>
 </fieldset>
 <fieldset>
 <div class="flex items-center gap-3 mb-6"><span class="text-xs font-black bg-primary text-white w-6 h-6 flex items-center justify-center rounded-sm">3</span><legend class="font-bold text-primary uppercase tracking-wider text-sm">What Needs Work?</legend></div>
 <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
 <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded-sm text-primary" /> Bathtub</label>
 <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded-sm text-primary" /> Shower Tiles</label>
 <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded-sm text-primary" /> Wall Tiles</label>
 <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded-sm text-primary" /> Vanity Top</label>
 <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded-sm text-primary" /> Shower Base</label>
 <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded-sm text-primary" /> Floor Tiles</label>
 </div>
 </fieldset>
 <button class="w-full py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2" type="submit">Submit Free Quote Request <span class="material-symbols-outlined" aria-hidden="true">send</span></button>
 <p class="text-center text-[0.6rem] text-secondary">By submitting you agree to our Terms &amp; Privacy Policy.</p>
 </form>
 </div>
 </div>
</section>

<!-- LIGHTBOX POPUP -->
<div id="lightbox" class="fixed inset-0 z-9999 hidden" style="background:rgba(0,0,0,0.92);">
 <button id="lb-close" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10" aria-label="Close"><span class="material-symbols-outlined text-white text-2xl">close</span></button>
 <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl px-4">
 <div class="relative"><img id="lb-image" src="" alt="" class="w-full rounded-xl shadow-2xl" /><span id="lb-badge" class="absolute top-3 left-3 bg-black/60 text-white text-[0.65rem] font-bold uppercase tracking-widest px-3 py-1 rounded-sm">Before</span></div>
 <div class="flex items-center justify-center gap-4 mt-6">
 <button id="lb-prev" class="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Previous"><span class="material-symbols-outlined text-white text-2xl">chevron_left</span></button>
 <span id="lb-label" class="text-white text-sm font-bold uppercase tracking-wider">Before</span>
 <button id="lb-next" class="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Next"><span class="material-symbols-outlined text-white text-2xl">chevron_right</span></button>
 </div>
 </div>
</div>
<script>
(function(){
 var lb=document.getElementById('lightbox'),lbImg=document.getElementById('lb-image'),lbBadge=document.getElementById('lb-badge'),lbLabel=document.getElementById('lb-label'),images=[],idx=0;
 document.querySelectorAll('#portfolio .bg-white.rounded-2xl').forEach(function(card){
 var imgs=card.querySelectorAll('img'); if(imgs.length<2) return;
 var tag=card.querySelector('span[class*="tertiary-fixed"]'); var label=tag?tag.textContent.trim():'';
 card.style.cursor='pointer';
 card.addEventListener('click',function(e){
 if(e.target.closest('a')) return; // don't hijack link clicks
 images=[{src:imgs[0].src,state:'Before',label:label},{src:imgs[1].src,state:'After',label:label}];
 idx=0; showImage(); lb.classList.remove('hidden'); document.body.style.overflow='hidden';
 });
 });
 function showImage(){
 lbImg.src=images[idx].src; lbBadge.textContent=images[idx].state;
 lbLabel.textContent=images[idx].state+' \u2014 '+images[idx].label;
 lbBadge.className=idx===0?'absolute top-3 left-3 bg-black/60 text-white text-[0.65rem] font-bold uppercase tracking-widest px-3 py-1 rounded-sm':'absolute top-3 right-3 bg-white/80 text-[#041534] text-[0.65rem] font-bold uppercase tracking-widest px-3 py-1 rounded-sm';
 }
 function closeLb(){lb.classList.add('hidden');document.body.style.overflow='';}
 document.getElementById('lb-close').addEventListener('click',closeLb);
 lb.addEventListener('click',function(e){if(e.target===lb)closeLb();});
 document.addEventListener('keydown',function(e){if(lb.classList.contains('hidden'))return;if(e.key==='Escape')closeLb();if(e.key==='ArrowLeft'||e.key==='ArrowRight'){idx=idx===0?1:0;showImage();}});
 document.getElementById('lb-prev').addEventListener('click',function(){idx=idx===0?1:0;showImage();});
 document.getElementById('lb-next').addEventListener('click',function(){idx=idx===0?1:0;showImage();});
})();
</script>

<script>
/* -- Homepage Logo Scroller -- */
(function(){
 var el = document.getElementById('hp-logo-scroller');
 if(!el) return;
 el.style.overflow = 'hidden';
 var isDrag=false,startX=0,scrollStart=0,velocity=0,lastX=0,lastTime=0,animFrame=0;
 var halfWidth = el.scrollWidth / 2;
 var dotsBox = document.getElementById('hp-logo-dots');
 if(dotsBox && dotsBox.children.length===0){
 for(var i=0;i<8;i++){var d=document.createElement('span');d.className='inline-block rounded-full bg-slate-300 transition-all duration-200';d.style.width='8px';d.style.height='8px';dotsBox.appendChild(d);}
 }
 el.scrollLeft = halfWidth * 0.3;
 function loop(){if(el.scrollLeft<=0)el.scrollLeft+=halfWidth;else if(el.scrollLeft>=halfWidth)el.scrollLeft-=halfWidth;}
 function updateDots(){if(!dotsBox)return;var pct=(el.scrollLeft%halfWidth)/halfWidth;var idx=Math.round(pct*7)%8;for(var i=0;i<dotsBox.children.length;i++){dotsBox.children[i].style.width=i===idx?'18px':'8px';dotsBox.children[i].style.background=i===idx?'#041534':'#cbd5e1';}}
 function coast(){if(Math.abs(velocity)<0.5){velocity=0;return;}velocity*=0.95;el.scrollLeft-=velocity;loop();updateDots();animFrame=requestAnimationFrame(coast);}
 el.addEventListener('mousedown',function(e){isDrag=true;startX=e.pageX;scrollStart=el.scrollLeft;lastX=e.pageX;lastTime=Date.now();velocity=0;cancelAnimationFrame(animFrame);e.preventDefault();});
 document.addEventListener('mousemove',function(e){if(!isDrag)return;var now=Date.now();var dt=now-lastTime;if(dt>0)velocity=(e.pageX-lastX)/dt*16;lastX=e.pageX;lastTime=now;el.scrollLeft=scrollStart-(e.pageX-startX);loop();updateDots();});
 document.addEventListener('mouseup',function(){if(!isDrag)return;isDrag=false;coast();});
 el.addEventListener('touchstart',function(e){isDrag=true;startX=e.touches[0].pageX;scrollStart=el.scrollLeft;lastX=e.touches[0].pageX;lastTime=Date.now();velocity=0;cancelAnimationFrame(animFrame);},{passive:true});
 document.addEventListener('touchmove',function(e){if(!isDrag)return;var now=Date.now();var dt=now-lastTime;if(dt>0)velocity=(e.touches[0].pageX-lastX)/dt*16;lastX=e.touches[0].pageX;lastTime=now;el.scrollLeft=scrollStart-(e.touches[0].pageX-startX);loop();updateDots();},{passive:true});
 document.addEventListener('touchend',function(){if(!isDrag)return;isDrag=false;coast();});
 updateDots();
})();
</script>

<?php get_footer(); ?>