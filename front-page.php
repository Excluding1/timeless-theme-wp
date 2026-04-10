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
    "openingHoursSpecification": { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], "opens": "07:00", "closes": "17:00" },
    "priceRange": "$$",
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "23", "bestRating": "5" },
    "hasOfferCatalog": {
        "@type": "OfferCatalog", "name": "Bathroom Resurfacing Services",
        "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Shower Regrouting", "description": "Full grout removal and replacement with premium waterproof epoxy grout." } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Bath Resurfacing", "description": "Restore chipped or stained bathtubs to factory-new condition with Hawk Glass-Tech system." } },
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
        { "@type": "Question", "name": "How much does bathroom resurfacing cost in Sydney?", "acceptedAnswer": { "@type": "Answer", "text": "Every bathroom is different, so we provide fixed-price quotes based on your photos. A complete bathroom resurfacing package typically saves 80–90% compared to a full renovation. Send us photos for an accurate quote within hours." } },
        { "@type": "Question", "name": "How long does resurfacing last?", "acceptedAnswer": { "@type": "Answer", "text": "With proper care, up to 10 years. We use commercial-grade two-part epoxy coatings resistant to chipping, peeling, and yellowing. All work backed by our workmanship warranty." } },
        { "@type": "Question", "name": "Is resurfacing worth it vs full renovation?", "acceptedAnswer": { "@type": "Answer", "text": "For most homeowners, yes. 80–90% cheaper, 1 day instead of 2-4 weeks, zero demolition, no construction waste. Ideal for rentals, pre-sale upgrades, and structurally sound bathrooms." } },
        { "@type": "Question", "name": "Do you check for asbestos?", "acceptedAnswer": { "@type": "Answer", "text": "If your home was built before 1990, NSW regulations may require an asbestos assessment. We advise during quoting if a check is needed." } },
        { "@type": "Question", "name": "What areas do you service?", "acceptedAnswer": { "@type": "Answer", "text": "Entire Greater Sydney — Inner West, Eastern Suburbs, North Shore, Northern Beaches, Western Sydney, Sutherland Shire, Hills District. Plus Wollongong, Central Coast, Blue Mountains." } },
        { "@type": "Question", "name": "Can you resurface coloured tiles?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Works on all tile types including coloured, textured, patterned, and mosaic. We transform outdated tiles into clean, modern finishes." } },
        { "@type": "Question", "name": "What warranty do you provide?", "acceptedAnswer": { "@type": "Answer", "text": "Workmanship warranty on every job covering peeling, bubbling, and adhesion failure. Warranty terms vary by service type — up to 3 years for resurfacing. Fully insured with public liability." } }
    ]
}
</script>

<!-- HERO -->
<section class="relative pt-28 sm:pt-32 pb-16 sm:pb-20 bg-surface">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
        <div class="md:col-span-7">
            <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.7rem] font-bold tracking-widest uppercase rounded mb-6">Sydney&rsquo;s Bathroom Experts</span>
            <h1 class="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-primary tracking-tighter leading-[0.95] mb-6 sm:mb-8">
                Bathroom Resurfacing <br class="hidden sm:block" /><span class="text-on-primary-container">Sydney Specialists</span>
            </h1>
            <p class="text-base sm:text-lg lg:text-xl text-secondary leading-relaxed max-w-xl mb-8 sm:mb-10">
                One-day bathroom transformations across Greater Sydney. Save <strong>80–90% versus full renovation</strong> with zero demolition, zero mess, and an up to 3-year workmanship warranty.
            </p>
            <a class="inline-block px-8 py-4 bg-primary text-white font-bold rounded-lg text-center hover:shadow-xl transition-all" href="#quote">Get Your Free Quote</a>
            <div class="mt-8 flex items-center gap-3">
                <div class="flex -space-x-2" aria-hidden="true">
                    <div class="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                    <div class="w-8 h-8 rounded-full border-2 border-white bg-slate-300"></div>
                    <div class="w-8 h-8 rounded-full border-2 border-white bg-slate-400"></div>
                </div>
                <p class="text-sm font-medium text-secondary"><strong class="text-primary">4.9&#9733;</strong> Google Rating from NSW Homeowners</p>
            </div>
        </div>
        <div class="md:col-span-5">
            <!-- BEFORE / AFTER SLIDER -->
            <div id="hero-slider" class="rounded-2xl overflow-hidden shadow-2xl relative select-none" style="aspect-ratio:5/6;cursor:ew-resize;">
                <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/after.jpg" alt="After bathroom resurfacing Sydney - gleaming white bathtub and clean tiles" class="absolute inset-0 w-full h-full object-cover" draggable="false" />
                <div id="ba-clip" class="absolute top-0 left-0 bottom-0 overflow-hidden" style="width:50%;">
                    <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/before.jpg" alt="Before bathroom resurfacing Sydney - peeling stained bathtub with dirty grout" draggable="false" id="ba-before-img" style="position:absolute;top:0;left:0;height:100%;object-fit:cover;" />
                </div>
                <div id="ba-line" class="absolute top-0 bottom-0 w-0.5 bg-white" style="left:50%;z-index:20;pointer-events:none;"></div>
                <div id="ba-handle" class="absolute top-1/2 w-11 h-11 -mt-[22px] -ml-[22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">Before</span>
                <span class="absolute top-3 right-3 bg-white/80 text-primary text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">After</span>
                <div class="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 p-3 bg-white/90 backdrop-blur-md rounded-lg flex justify-between items-center" style="z-index:15;">
                    <span class="text-xs font-bold text-primary">Drag to Compare</span>
                    <span class="text-xs font-bold text-on-primary-container">Completed in 7 Hours</span>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- TRUST BAR -->
<section class="bg-primary text-white py-5">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-between items-center gap-3 sm:gap-6">
        <div class="flex items-center justify-center sm:justify-start gap-2 px-2 sm:px-3 py-2"><span class="material-symbols-outlined text-tertiary-fixed-dim text-base sm:text-xl flex-shrink-0" aria-hidden="true">verified_user</span><span class="text-[0.65rem] sm:text-xs font-bold">Experienced &amp; Insured</span></div>
        <div class="flex items-center justify-center sm:justify-start gap-2 px-2 sm:px-3 py-2"><span class="material-symbols-outlined text-tertiary-fixed-dim text-base sm:text-xl flex-shrink-0" aria-hidden="true">security</span><span class="text-[0.65rem] sm:text-xs font-bold">Public Liability Insured</span></div>
        <div class="flex items-center justify-center sm:justify-start gap-2 px-2 sm:px-3 py-2"><span class="material-symbols-outlined text-tertiary-fixed-dim text-base sm:text-xl flex-shrink-0" aria-hidden="true">schedule</span><span class="text-[0.65rem] sm:text-xs font-bold">Same-Day Service</span></div>
        <div class="flex items-center justify-center sm:justify-start gap-2 px-2 sm:px-3 py-2"><span class="material-symbols-outlined text-tertiary-fixed-dim text-base sm:text-xl flex-shrink-0" aria-hidden="true">verified</span><span class="text-[0.65rem] sm:text-xs font-bold">Up to 3-Year Warranty</span></div>
    </div>
</section>


<!-- SERVICES -->
<section class="py-16 sm:py-24 bg-surface-container-low" id="services">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="mb-12">
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-4">Bathroom Resurfacing Services in Sydney</h2>
            <p class="text-secondary max-w-2xl">Professional bathroom transformations completed in as little as one day. Free photo-based quotes within hours.</p>
            <div class="h-1 w-20 bg-tertiary-fixed-dim mt-4"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a href="<?php echo esc_url( home_url( '/services/shower-regrouting-sydney/' ) ); ?>" class="bg-white p-6 sm:p-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group reveal block">
                <span class="material-symbols-outlined text-4xl text-primary mb-4 block" aria-hidden="true">shower</span>
                <h3 class="text-xl font-bold text-primary mb-2">Shower Regrouting</h3>
                <p class="text-secondary text-sm mb-6 leading-relaxed">Full removal of old, cracked grout and replacement with premium waterproof epoxy. Prevents leaks and stops mould.</p>
                <div class="flex justify-between items-center"><span class="text-sm font-bold text-on-primary-container">Same-day service</span><span class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">Learn More <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span></div>
            </a>
            <a href="<?php echo esc_url( home_url( '/services/bath-resurfacing-sydney/' ) ); ?>" class="bg-white p-6 sm:p-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group reveal block">
                <span class="material-symbols-outlined text-4xl text-primary mb-4 block" aria-hidden="true">bathtub</span>
                <h3 class="text-xl font-bold text-primary mb-2">Bath Resurfacing</h3>
                <p class="text-secondary text-sm mb-6 leading-relaxed">Restore chipped, faded, or stained bathtubs to their original brilliant shine. Lasts up to 10 years.</p>
                <div class="flex justify-between items-center"><span class="text-sm font-bold text-on-primary-container">One-day transformation</span><span class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">Learn More <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span></div>
            </a>
            <a href="<?php echo esc_url( home_url( '/services/tile-resurfacing-sydney/' ) ); ?>" class="bg-white p-6 sm:p-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group reveal block">
                <span class="material-symbols-outlined text-4xl text-primary mb-4 block" aria-hidden="true">grid_view</span>
                <h3 class="text-xl font-bold text-primary mb-2">Tile Resurfacing</h3>
                <p class="text-secondary text-sm mb-6 leading-relaxed">Transform outdated pink, green, or brown tiles into a clean, modern finish. No demolition required.</p>
                <div class="flex justify-between items-center"><span class="text-sm font-bold text-on-primary-container">No demolition needed</span><span class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">Learn More <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span></div>
            </a>
            <a href="<?php echo esc_url( home_url( '/services/vanity-refinishing-sydney/' ) ); ?>" class="bg-white p-6 sm:p-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group reveal block">
                <span class="material-symbols-outlined text-4xl text-primary mb-4 block" aria-hidden="true">countertops</span>
                <h3 class="text-xl font-bold text-primary mb-2">Vanity Refinishing</h3>
                <p class="text-secondary text-sm mb-6 leading-relaxed">Stone-fleck or sleek satin finish without the cost of replacement. Perfect for investment properties.</p>
                <div class="flex justify-between items-center"><span class="text-sm font-bold text-on-primary-container">900+ colour options</span><span class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">Learn More <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span></div>
            </a>
            <a href="<?php echo esc_url( home_url( '/services/basin-restoration-sydney/' ) ); ?>" class="bg-white p-6 sm:p-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group reveal block">
                <span class="material-symbols-outlined text-4xl text-primary mb-4 block" aria-hidden="true">faucet</span>
                <h3 class="text-xl font-bold text-primary mb-2">Basin Restoration</h3>
                <p class="text-secondary text-sm mb-6 leading-relaxed">Expert repair and resurfacing of porcelain, cast iron, and acrylic bathroom basins.</p>
                <div class="flex justify-between items-center"><span class="text-sm font-bold text-on-primary-container">Chip repair &amp; full resurface</span><span class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">Learn More <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span></div>
            </a>
            <a href="<?php echo esc_url( home_url( '/services/shower-leak-repair-sydney/' ) ); ?>" class="bg-white p-6 sm:p-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group reveal block">
                <span class="material-symbols-outlined text-4xl text-primary mb-4 block" aria-hidden="true">water_damage</span>
                <h3 class="text-xl font-bold text-primary mb-2">Shower Sealing</h3>
                <p class="text-secondary text-sm mb-6 leading-relaxed">Leaking shower? We locate the source and seal with precision waterproof silicone and epoxy grout.</p>
                <div class="flex justify-between items-center"><span class="text-sm font-bold text-on-primary-container">Stop leaks permanently</span><span class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">Learn More <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span></div>
            </a>
        </div>
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
                    <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-red-600" aria-hidden="true">delete</span></div>
                    <h3 class="text-xl font-extrabold text-primary">Full Renovation</h3>
                </div>
                <div class="space-y-4">
                    <div class="flex justify-between items-center py-2 border-b border-red-200/60"><span class="text-sm text-secondary flex items-center gap-2"><span class="material-symbols-outlined text-red-400 text-base" aria-hidden="true">close</span> Cost</span><span class="text-lg font-bold text-error">$25,000 - $50,000</span></div>
                    <div class="flex justify-between items-center py-2 border-b border-red-200/60"><span class="text-sm text-secondary flex items-center gap-2"><span class="material-symbols-outlined text-red-400 text-base" aria-hidden="true">close</span> Timeline</span><span class="text-sm font-bold text-red-700">2 - 4 weeks</span></div>
                    <div class="flex justify-between items-center py-2 border-b border-red-200/60"><span class="text-sm text-secondary flex items-center gap-2"><span class="material-symbols-outlined text-red-400 text-base" aria-hidden="true">close</span> Demolition</span><span class="text-sm font-bold text-error">Required</span></div>
                    <div class="flex justify-between items-center py-2"><span class="text-sm text-secondary flex items-center gap-2"><span class="material-symbols-outlined text-red-400 text-base" aria-hidden="true">close</span> Usable</span><span class="text-sm font-bold text-error">After 2+ weeks</span></div>
                </div>
            </div>
            <div class="bg-primary/[0.03] rounded-2xl p-8 border-2 border-primary relative overflow-hidden ring-2 ring-primary/10 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 reveal">
                <div class="absolute top-0 right-0 bg-tertiary-fixed-dim text-on-tertiary-fixed text-[0.6rem] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">Recommended</div>
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-emerald-600" aria-hidden="true">check_circle</span></div>
                    <h3 class="text-xl font-extrabold text-primary">Resurfacing</h3>
                </div>
                <div class="space-y-4">
                    <div class="flex justify-between items-center py-2 border-b border-primary/10"><span class="text-sm text-secondary flex items-center gap-2"><span class="material-symbols-outlined text-emerald-500 text-base" aria-hidden="true">check</span> Cost</span><span class="text-lg font-bold text-primary">80–90% less</span></div>
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
                <div class="rounded-2xl overflow-hidden aspect-[4/3] max-w-md mx-auto">
                    <img class="w-full h-full object-cover" src="<?php echo get_template_directory_uri(); ?>/images/about/process.jpg" alt="Tradesperson resurfacing a bathtub in Sydney" loading="lazy" width="600" height="450" />
                </div>
            </div>
            <!-- Right: Steps -->
            <div>
                <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mb-3">How It Works</h2>
                <p class="text-secondary mb-10">From photo to perfection in four simple steps.</p>
                <div class="space-y-4">
                    <div class="flex gap-5 items-start bg-white rounded-xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default reveal min-h-[88px]">
                        <div class="flex-shrink-0 w-14 h-14 rounded-full bg-[#e7c08b]/15 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-[#c99a55]" aria-hidden="true">photo_camera</span></div>
                        <div>
                            <h3 class="font-bold text-primary text-base mb-0.5">Step 1: Send Us Photos</h3>
                            <p class="text-sm text-secondary leading-relaxed">Snap photos of your bathroom on your phone and upload via our quote form. Takes 2 minutes.</p>
                        </div>
                    </div>
                    <div class="flex gap-5 items-start bg-white rounded-xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default reveal min-h-[88px]">
                        <div class="flex-shrink-0 w-14 h-14 rounded-full bg-[#e7c08b]/15 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-[#c99a55]" aria-hidden="true">request_quote</span></div>
                        <div>
                            <h3 class="font-bold text-primary text-base mb-0.5">Step 2: Quote Next Business Day</h3>
                            <p class="text-sm text-secondary leading-relaxed">We review your photos and send a transparent fixed-price quote. No hidden fees.</p>
                        </div>
                    </div>
                    <div class="flex gap-5 items-start bg-white rounded-xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default reveal min-h-[88px]">
                        <div class="flex-shrink-0 w-14 h-14 rounded-full bg-[#e7c08b]/15 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-[#c99a55]" aria-hidden="true">calendar_month</span></div>
                        <div>
                            <h3 class="font-bold text-primary text-base mb-0.5">Step 3: Book Your Day</h3>
                            <p class="text-sm text-secondary leading-relaxed">Available Monday to Friday across Greater Sydney and NSW. We work around your schedule.</p>
                        </div>
                    </div>
                    <div class="flex gap-5 items-start bg-white rounded-xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default reveal min-h-[88px]">
                        <div class="flex-shrink-0 w-14 h-14 rounded-full bg-[#e7c08b]/15 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-[#c99a55]" aria-hidden="true">celebration</span></div>
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

<!-- PORTFOLIO -->
<section class="py-16 sm:py-24 bg-surface" id="portfolio">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
                <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-4">Recent Transformations</h2>
                <p class="text-secondary">Before and after resurfacing across Sydney and NSW.</p>
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <article class="group overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal">
                <div class="aspect-video overflow-hidden">
                    <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Bathroom resurfacing Surry Hills apartment - resurfaced white bathtub" src="<?php echo get_template_directory_uri(); ?>/images/homepage/gallery-1.jpg" loading="lazy" width="600" height="338" />
                </div>
                <div class="p-6">
                    <div class="flex justify-between items-center mb-2"><h3 class="font-bold text-primary">Surry Hills Apartment</h3><span class="text-[0.6rem] bg-surface-container px-2 py-0.5 rounded font-bold uppercase text-outline">Bath &amp; Wall</span></div>
                    <p class="text-xs text-secondary italic">"Tenant was back in 24 hours. Looks brand new."</p>
                    <p class="text-[0.65rem] text-outline mt-2 font-medium">&#8212; Property Manager, Inner Sydney</p>
                </div>
            </article>
            <article class="group overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal">
                <div class="aspect-video overflow-hidden">
                    <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Shower regrouting Bondi Beach - restored white subway tiles" src="<?php echo get_template_directory_uri(); ?>/images/homepage/gallery-2.jpg" loading="lazy" width="600" height="338" />
                </div>
                <div class="p-6">
                    <div class="flex justify-between items-center mb-2"><h3 class="font-bold text-primary">Bondi Beach House</h3><span class="text-[0.6rem] bg-surface-container px-2 py-0.5 rounded font-bold uppercase text-outline">Shower &amp; Basin</span></div>
                    <p class="text-xs text-secondary italic">"Restored our 1920s bathroom without the $20k price tag."</p>
                    <p class="text-[0.65rem] text-outline mt-2 font-medium">&#8212; Homeowner, Eastern Suburbs</p>
                </div>
            </article>
            <article class="group overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal">
                <div class="aspect-video overflow-hidden">
                    <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Full bathroom resurfacing Parramatta - resurfaced vanity and bath" src="<?php echo get_template_directory_uri(); ?>/images/homepage/gallery-3.jpg" loading="lazy" width="600" height="338" />
                </div>
                <div class="p-6">
                    <div class="flex justify-between items-center mb-2"><h3 class="font-bold text-primary">Parramatta Family Home</h3><span class="text-[0.6rem] bg-surface-container px-2 py-0.5 rounded font-bold uppercase text-outline">Full Bathroom</span></div>
                    <p class="text-xs text-secondary italic">"Workmanship is second to none in Western Sydney."</p>
                    <p class="text-[0.65rem] text-outline mt-2 font-medium">&#8212; Homeowner, Western Sydney</p>
                </div>
            </article>
        </div>
    </div>
</section>

<!-- TESTIMONIALS -->
<section class="py-16 sm:py-24 bg-surface-container-lowest">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="text-center mb-12">
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-4">What Sydney Homeowners Say</h2>
            <div class="flex items-center justify-center gap-2">
                <div class="flex text-amber-400 text-lg" aria-label="5 star rating">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <span class="text-sm font-bold text-primary">4.9</span>
                <span class="text-xs text-secondary">from verified customers</span>
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-xl p-6 border border-surface-container reveal">
                <div class="flex text-amber-400 text-sm mb-3">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p class="text-sm text-secondary leading-relaxed mb-4">&ldquo;Our shower grout was black and disgusting. They stripped it all out and regrouted in one day. Looks brand new &mdash; honestly better than when the house was built. Very clean workers too.&rdquo;</p>
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">M</div>
                    <div><p class="text-sm font-bold text-primary">Michelle T.</p><p class="text-[0.65rem] text-outline">Marrickville &middot; Shower Regrouting</p></div>
                </div>
            </div>
            <div class="bg-white rounded-xl p-6 border border-surface-container reveal">
                <div class="flex text-amber-400 text-sm mb-3">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p class="text-sm text-secondary leading-relaxed mb-4">&ldquo;Had our old yellow bathtub resurfaced instead of replacing it. Saved us thousands and you genuinely cannot tell it&rsquo;s been done &mdash; the finish is that smooth. Highly recommend.&rdquo;</p>
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">D</div>
                    <div><p class="text-sm font-bold text-primary">David &amp; Sarah K.</p><p class="text-[0.65rem] text-outline">Epping &middot; Bath Resurfacing</p></div>
                </div>
            </div>
            <div class="bg-white rounded-xl p-6 border border-surface-container reveal">
                <div class="flex text-amber-400 text-sm mb-3">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p class="text-sm text-secondary leading-relaxed mb-4">&ldquo;Manage 12 rental units across Sydney. Timeless handles all our bathroom turnovers &mdash; quick, reliable, and the tenants always comment on how fresh everything looks. Great value.&rdquo;</p>
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">R</div>
                    <div><p class="text-sm font-bold text-primary">Rachel M.</p><p class="text-[0.65rem] text-outline">Property Manager &middot; Inner West</p></div>
                </div>
            </div>
            <div class="bg-white rounded-xl p-6 border border-surface-container reveal">
                <div class="flex text-amber-400 text-sm mb-3">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p class="text-sm text-secondary leading-relaxed mb-4">&ldquo;Got our bathroom tiles resurfaced from that awful brown to a clean white. It transformed the whole room for a fraction of what a tiler quoted. Professional job, no mess.&rdquo;</p>
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">J</div>
                    <div><p class="text-sm font-bold text-primary">James W.</p><p class="text-[0.65rem] text-outline">Bondi &middot; Tile Resurfacing</p></div>
                </div>
            </div>
            <div class="bg-white rounded-xl p-6 border border-surface-container reveal">
                <div class="flex text-amber-400 text-sm mb-3">&#9733;&#9733;&#9733;&#9733;<span class="text-slate-300">&#9733;</span></div>
                <p class="text-sm text-secondary leading-relaxed mb-4">&ldquo;Needed the shower done before settlement &mdash; they fit us in within days. Regrouted with epoxy which apparently lasts much longer. Buyer was impressed at the inspection. Worth every cent.&rdquo;</p>
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">L</div>
                    <div><p class="text-sm font-bold text-primary">Linda P.</p><p class="text-[0.65rem] text-outline">Strathfield &middot; Pre-Sale Prep</p></div>
                </div>
            </div>
            <div class="bg-white rounded-xl p-6 border border-surface-container reveal">
                <div class="flex text-amber-400 text-sm mb-3">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p class="text-sm text-secondary leading-relaxed mb-4">&ldquo;Full bathroom makeover &mdash; regrout, bath resurface, and basin. Two days and it was done. Could not believe the difference. Friends thought we renovated.&rdquo;</p>
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">A</div>
                    <div><p class="text-sm font-bold text-primary">Andrew &amp; Kim H.</p><p class="text-[0.65rem] text-outline">Castle Hill &middot; Full Bathroom Package</p></div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- WARRANTY -->
<section class="py-16 sm:py-24 bg-primary" id="warranty">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tighter mb-4 sm:mb-6">Up to 3-Year Workmanship Warranty</h2>
            <p class="text-sm sm:text-base text-white/70 leading-relaxed mb-6 sm:mb-8">Every job is backed by our comprehensive warranty. With proper care, our resurfacing can last up to 10 years. If defects arise from our workmanship under normal use, we fix it free. Warranty terms vary by service &mdash; we&rsquo;ll confirm the exact coverage in your quote.</p>
            <div class="space-y-3">
                <div class="flex items-start gap-4 p-4 bg-white/10 backdrop-blur rounded-xl border border-white/10 hover:bg-white/15 transition-all duration-300"><div class="flex-shrink-0 w-10 h-10 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="material-symbols-outlined text-lg text-[#e7c08b]" aria-hidden="true">shield</span></div><div><h3 class="font-bold text-white text-sm mb-0.5">Peeling &amp; Bubbling Cover</h3><p class="text-xs text-white/60">Coating peels or bubbles? We resurface again, free.</p></div></div>
                <div class="flex items-start gap-4 p-4 bg-white/10 backdrop-blur rounded-xl border border-white/10 hover:bg-white/15 transition-all duration-300"><div class="flex-shrink-0 w-10 h-10 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="material-symbols-outlined text-lg text-[#e7c08b]" aria-hidden="true">verified_user</span></div><div><h3 class="font-bold text-white text-sm mb-0.5">Adhesion Guarantee</h3><p class="text-xs text-white/60">Multi-step prep ensures permanent bonding. Failure covered in full.</p></div></div>
                <div class="flex items-start gap-4 p-4 bg-white/10 backdrop-blur rounded-xl border border-white/10 hover:bg-white/15 transition-all duration-300"><div class="flex-shrink-0 w-10 h-10 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="material-symbols-outlined text-lg text-[#e7c08b]" aria-hidden="true">security</span></div><div><h3 class="font-bold text-white text-sm mb-0.5">Fully Insured</h3><p class="text-xs text-white/60">Public liability insured on every job for your peace of mind.</p></div></div>
                <div class="flex items-start gap-4 p-4 bg-white/10 backdrop-blur rounded-xl border border-white/10 hover:bg-white/15 transition-all duration-300"><div class="flex-shrink-0 w-10 h-10 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="material-symbols-outlined text-lg text-[#e7c08b]" aria-hidden="true">handshake</span></div><div><h3 class="font-bold text-white text-sm mb-0.5">No Obligation Quotes</h3><p class="text-xs text-white/60">Send us photos and get a fixed-price quote. No surprises, no hidden costs.</p></div></div>
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
                    <p class="text-xs text-secondary">Cost, timing, durability, warranty &mdash; we&rsquo;ve answered them all.</p>
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
                    <div class="flex items-center gap-3 mb-6"><span class="text-xs font-black bg-primary text-white w-6 h-6 flex items-center justify-center rounded">1</span><legend class="font-bold text-primary uppercase tracking-wider text-sm">Contact Info</legend></div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label for="name" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Full Name *</label><input id="name" name="name" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="John Citizen" required /></div>
                        <div><label for="phone" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Phone *</label><input id="phone" name="phone" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="<?php echo timeless_phone(); ?>" type="tel" required /></div>
                        <div class="md:col-span-2"><label for="email" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Email</label><input id="email" name="email" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="john@example.com" type="email" /></div>
                    </div>
                </fieldset>
                <fieldset>
                    <div class="flex items-center gap-3 mb-6"><span class="text-xs font-black bg-primary text-white w-6 h-6 flex items-center justify-center rounded">2</span><legend class="font-bold text-primary uppercase tracking-wider text-sm">Property</legend></div>
                    <div><label for="address" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Address *</label><input id="address" name="address" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Street, Suburb, NSW Postcode" required /></div>
                    <div class="mt-4 p-4 bg-error-container/20 rounded-lg flex items-start gap-4 border-l-4 border-error">
                        <span class="material-symbols-outlined text-error flex-shrink-0" aria-hidden="true">warning</span>
                        <div><p class="text-xs font-bold text-on-error-container mb-1">Asbestos Check (NSW)</p><p class="text-[0.7rem] text-on-error-container/80">Home built before 1990?</p>
                            <div class="mt-2 flex gap-4"><label class="flex items-center gap-2 text-xs font-bold text-primary cursor-pointer"><input name="asbestos" type="radio" value="yes" class="text-primary" /> Yes</label><label class="flex items-center gap-2 text-xs font-bold text-primary cursor-pointer"><input name="asbestos" type="radio" value="no" class="text-primary" /> No</label><label class="flex items-center gap-2 text-xs font-bold text-primary cursor-pointer"><input name="asbestos" type="radio" value="unsure" class="text-primary" /> Unsure</label></div>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <div class="flex items-center gap-3 mb-6"><span class="text-xs font-black bg-primary text-white w-6 h-6 flex items-center justify-center rounded">3</span><legend class="font-bold text-primary uppercase tracking-wider text-sm">What Needs Work?</legend></div>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Bathtub</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Shower Tiles</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Wall Tiles</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Vanity Top</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Shower Base</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Floor Tiles</label>
                    </div>
                </fieldset>
                <button class="w-full py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2" type="submit">Submit Free Quote Request <span class="material-symbols-outlined" aria-hidden="true">send</span></button>
                <p class="text-center text-[0.6rem] text-secondary">By submitting you agree to our Terms &amp; Privacy Policy.</p>
            </form>
        </div>
    </div>
</section>

<?php get_footer(); ?>