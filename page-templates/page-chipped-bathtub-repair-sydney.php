<?php /* Template Name: Chip Repair Sydney */ ?>
<?php get_header(); ?>

<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Chip Repair Sydney",
    "description": "Professional bathtub and basin chip repair in Sydney. Invisible colour-matched repairs using two-part epoxy. Most repairs done in 1-2 hours, up to 3-year warranty.",
    "provider": {
        "@type": "HomeAndConstructionBusiness",
        "name": "Timeless Resurfacing",
        "url": "https://timelessresurfacing.com.au",
        "telephone": "<?php echo timeless_phone_link(); ?>",
        "address": { "@type": "PostalAddress", "addressLocality": "Sydney", "addressRegion": "NSW", "addressCountry": "AU" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "23" }
    },
    "areaServed": { "@type": "City", "name": "Sydney" },
    "serviceType": "Chip Repair"
}
</script>

<script type="application/ld+json">
{
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://timelessresurfacing.com.au/" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://timelessresurfacing.com.au/services/" },
        { "@type": "ListItem", "position": 3, "name": "Chip Repair Sydney", "item": "https://timelessresurfacing.com.au/services/chip-repair-sydney/" }
    ]
}
</script>

<script type="application/ld+json">
{
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "How much does chip repair cost in Sydney?", "acceptedAnswer": { "@type": "Answer", "text": "Every chip is different. The cost depends on how many chips, their size, and what material the bath or basin is made from. Send us photos for a fixed-price quote within hours." } },
        { "@type": "Question", "name": "How long does a chip repair take?", "acceptedAnswer": { "@type": "Answer", "text": "Most single chip repairs are done in 1-2 hours. Multiple chips can be repaired in a single visit. The repair needs 24 hours to cure before use." } },
        { "@type": "Question", "name": "Will the repair be visible?", "acceptedAnswer": { "@type": "Answer", "text": "No. We colour-match the epoxy filler to your existing finish, sand it flush, and seal it. A professional repair is invisible to the eye." } },
        { "@type": "Question", "name": "How long does a chip repair last?", "acceptedAnswer": { "@type": "Answer", "text": "3-5+ years with normal use. The two-part epoxy is waterproof, heat-resistant, and bonds permanently to the substrate." } },
        { "@type": "Question", "name": "Can you repair chips on baths, basins, and tiles?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. We repair chips on bathtubs, basins, and wall or floor tiles. Porcelain, enamel, acrylic, cast iron, ceramic, and fibreglass. Each material requires different prep, but all can be repaired." } }
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
            <li class="text-white font-medium">Chip Repair Sydney</li>
        </ol>
    </nav>
</div>

<!-- HERO (Dark navy) -->
<section class="pt-4 pb-16 sm:pb-20 bg-[#1b2a4a] text-white" style="margin-top:-96px; padding-top:120px;">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
            <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.7rem] font-bold tracking-widest uppercase rounded mb-4">Same-Day Repair</span>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-[0.95] mb-6 underline decoration-[#c9a060] decoration-[5px] underline-offset-[8px] [text-decoration-skip-ink:none]">
                Chip <span class="text-tertiary-fixed-dim">Repair</span>
            </h1>
            <p class="text-base sm:text-lg text-white/80 leading-relaxed max-w-xl mb-6">
                Chip in your bath, basin, or tiles? Hairline crack spreading? We fill, shape, and colour-match every repair so it&rsquo;s invisible. Works on porcelain, enamel, acrylic, ceramic, and fibreglass. Done in hours, not days.
            </p>
            <!-- MOBILE: Hero image between paragraph and stats -->
            <div class="md:hidden mb-6">
                <div class="rounded-xl overflow-hidden shadow-2xl relative" style="aspect-ratio:4/3;">
                    <img src="<?php echo get_template_directory_uri(); ?>/images/services/chip-repair/hero.png" alt="Chip repair before and after" class="w-full h-full object-cover" />
                    <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">Before</span>
                    <span class="absolute top-3 right-3 bg-white/80 text-primary text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">After</span>
                    <div class="absolute bottom-3 left-3 right-3 p-3 bg-white/90 backdrop-blur-md rounded-lg flex justify-between items-center" style="z-index:15;">
                        <span class="text-xs font-bold text-primary">Before &amp; After</span>
                        <span class="text-xs font-bold text-on-primary-container">Done in Hours</span>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
                <div class="text-center bg-white/10 rounded-lg px-2 sm:px-3 py-3">
                    <p class="text-base sm:text-xl lg:text-2xl font-extrabold leading-tight">1-2 hrs</p>
                    <p class="text-[0.6rem] sm:text-[0.65rem] text-white/60 font-medium mt-1">Most repairs</p>
                </div>
                <div class="text-center bg-white/10 rounded-lg px-2 sm:px-3 py-3">
                    <p class="text-base sm:text-xl lg:text-2xl font-extrabold leading-tight">Invisible</p>
                    <p class="text-[0.6rem] sm:text-[0.65rem] text-white/60 font-medium mt-1">Colour matched</p>
                </div>
                <div class="text-center bg-white/10 rounded-lg px-2 sm:px-3 py-3">
                    <p class="text-base sm:text-xl lg:text-2xl font-extrabold leading-tight">Up to 3yr</p>
                    <p class="text-[0.6rem] sm:text-[0.65rem] text-white/60 font-medium mt-1">Warranty</p>
                </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 mb-4">
                <a class="px-8 py-4 bg-white text-primary font-bold rounded-lg text-center hover:shadow-xl transition-all" href="#quote">Get Your Free Quote</a>
            </div>
            <p class="text-xs text-white/60"><span class="material-symbols-outlined text-sm align-text-bottom text-tertiary-fixed-dim" aria-hidden="true">photo_camera</span> Send photos &rarr; quote in hours. No obligation.</p>
            <div class="mt-6 flex items-center gap-3">
                <div class="flex -space-x-2" aria-hidden="true">
                    <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/reviews/reviewer-1.png" alt="" class="w-8 h-8 rounded-full border-2 border-white object-cover" width="96" height="96" loading="lazy" />
                    <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/reviews/reviewer-2.png" alt="" class="w-8 h-8 rounded-full border-2 border-white object-cover" width="96" height="96" loading="lazy" />
                    <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/reviews/reviewer-3.png" alt="" class="w-8 h-8 rounded-full border-2 border-white object-cover" width="96" height="96" loading="lazy" />
                </div>
                <p class="text-sm font-medium text-white/80"><strong class="text-white">4.9&#9733;</strong> Google Rating from NSW Homeowners</p>
            </div>
        </div>
        <div class="hidden md:block">
            <!-- HERO IMAGE (DESKTOP — single before/after composite) -->
            <div class="rounded-xl overflow-hidden shadow-2xl relative" style="aspect-ratio:4/3;">
                <img src="<?php echo get_template_directory_uri(); ?>/images/services/chip-repair/hero.png" alt="Chip repair before and after" class="w-full h-full object-cover" />
                <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">Before</span>
                <span class="absolute top-3 right-3 bg-white/80 text-primary text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">After</span>
                <div class="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 bg-white/90 backdrop-blur-md rounded-lg flex justify-between items-center" style="z-index:15;">
                    <span class="text-xs font-bold text-primary">Before &amp; After</span>
                    <span class="text-xs font-bold text-on-primary-container">Repaired in Hours</span>
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

<!-- SECTION 2B — What We Fix (3 problem blocks) -->
<section class="py-16 sm:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <div class="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
            <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.65rem] font-bold tracking-widest uppercase rounded mb-3">Our Services</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">What We Repair</h2>
            <p class="text-secondary">From a single chip to multiple cracks across the surface. Here&rsquo;s what we fix and how we do it.</p>
            <!-- Surfaces we repair -->
            <div class="flex flex-wrap justify-center gap-3 mt-8">
                <span class="flex items-center gap-1.5 px-4 py-2 bg-surface-container-low rounded-full text-xs font-bold text-primary"><span class="material-symbols-outlined text-sm text-tertiary-fixed-dim" aria-hidden="true">bathtub</span> Bathtubs</span>
                <span class="flex items-center gap-1.5 px-4 py-2 bg-surface-container-low rounded-full text-xs font-bold text-primary"><span class="material-symbols-outlined text-sm text-tertiary-fixed-dim" aria-hidden="true">wash</span> Basins</span>
                <span class="flex items-center gap-1.5 px-4 py-2 bg-surface-container-low rounded-full text-xs font-bold text-primary"><span class="material-symbols-outlined text-sm text-tertiary-fixed-dim" aria-hidden="true">grid_view</span> Wall Tiles</span>
                <span class="flex items-center gap-1.5 px-4 py-2 bg-surface-container-low rounded-full text-xs font-bold text-primary"><span class="material-symbols-outlined text-sm text-tertiary-fixed-dim" aria-hidden="true">dashboard</span> Floor Tiles</span>
                <span class="flex items-center gap-1.5 px-4 py-2 bg-surface-container-low rounded-full text-xs font-bold text-primary"><span class="material-symbols-outlined text-sm text-tertiary-fixed-dim" aria-hidden="true">countertops</span> Vanity Tops</span>
            </div>
        </div>

        <!-- BLOCK 1: Chips & Impact Damage -->
        <div class="mb-12 lg:mb-16 reveal">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div class="order-2 lg:order-1">
                    <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Chips &amp; Impact Damage</h3>
                    <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Dropped a shampoo bottle and now there&rsquo;s a chunk missing? Sharp-edged chip exposing the raw substrate underneath? These look small but they trap dirt, collect rust stains, and get worse every time you use the bath. We fill each chip with two-part epoxy, shape it to match the original contour, and colour-match it to your existing finish. No visible patch lines.</p>
                    <ul class="space-y-2.5 mb-6">
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Single or multiple chip repairs in one visit</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Invisible colour-matched finish</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Waterproof seal prevents rust and staining</li>
                    </ul>
                    <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
                </div>
                <div class="order-1 lg:order-2">
                    <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none" style="aspect-ratio:3/2;cursor:ew-resize;">
                        <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-50 via-white to-[#e7c08b]/20 flex items-center justify-center"><img src="<?php echo get_template_directory_uri(); ?>/images/services/chip-repair/chips-after.png" alt="Bath after chip repair" class="w-full h-full object-cover absolute inset-0" /></div>
                        <div class="ba-clip absolute top-0 left-0 bottom-0 overflow-hidden" style="width:66%;"><div class="ba-before absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center"><img src="<?php echo get_template_directory_uri(); ?>/images/services/chip-repair/chips-before.png" alt="Chipped bathtub" class="w-full h-full object-cover absolute inset-0" /></div></div>
                        <div class="ba-line absolute top-0 bottom-0 w-0.5 bg-white" style="left:66%;z-index:20;cursor:ew-resize;"></div>
                        <div class="ba-handle absolute top-1/2 w-11 h-11 -mt-[22px] -ml-[22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:66%;z-index:25;cursor:ew-resize;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                        <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">Before</span>
                        <span class="absolute top-3 right-3 bg-white/80 text-[#041534] text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">After</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- BLOCK 2: Hairline Cracks -->
        <div class="mb-12 lg:mb-16 reveal">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div class="order-2 lg:order-2">
                    <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Hairline Cracks</h3>
                    <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Fine cracks spreading across the surface of your bath or basin? These are stress fractures caused by thermal expansion, building movement, or flexing in acrylic and fibreglass tubs. They look cosmetic but they let water through to the substrate. We assess whether the crack is surface-only or structural, then repair accordingly with flexible epoxy that moves with the material.</p>
                    <ul class="space-y-2.5 mb-6">
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Stops water penetration through cracks</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Flexible epoxy for acrylic and fibreglass</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Structural assessment included</li>
                    </ul>
                    <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
                </div>
                <div class="order-1 lg:order-1">
                    <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none" style="aspect-ratio:3/2;cursor:ew-resize;">
                        <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-50 via-white to-[#e7c08b]/20 flex items-center justify-center"><img src="<?php echo get_template_directory_uri(); ?>/images/services/chip-repair/cracks-after.png" alt="Bath after crack repair" class="w-full h-full object-cover absolute inset-0" /></div>
                        <div class="ba-clip absolute top-0 left-0 bottom-0 overflow-hidden" style="width:50%;"><div class="ba-before absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center"><img src="<?php echo get_template_directory_uri(); ?>/images/services/chip-repair/cracks-before.png" alt="Hairline cracks" class="w-full h-full object-cover absolute inset-0" /></div></div>
                        <div class="ba-line absolute top-0 bottom-0 w-0.5 bg-white" style="left:50%;z-index:20;cursor:ew-resize;"></div>
                        <div class="ba-handle absolute top-1/2 w-11 h-11 -mt-[22px] -ml-[22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:50%;z-index:25;cursor:ew-resize;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                        <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">Before</span>
                        <span class="absolute top-3 right-3 bg-white/80 text-[#041534] text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">After</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- BLOCK 3: Rust Staining from Old Chips -->
        <div class="reveal">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div class="order-2 lg:order-1">
                    <h3 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-3 text-center lg:text-left">Rust Staining from Old Chips</h3>
                    <p class="text-sm sm:text-base text-secondary leading-relaxed mb-5">Old chip that was never repaired and now has a brown rust stain spreading outward? On cast iron and enamel steel baths, exposed metal oxidises and the rust seeps into the surrounding enamel. The longer you leave it, the bigger it gets. We treat the rust first, then fill and reseal so it can&rsquo;t come back.</p>
                    <ul class="space-y-2.5 mb-6">
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Rust chemically treated before filling</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Prevents further oxidation and spread</li>
                        <li class="flex items-start gap-2 text-sm text-secondary"><span class="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5" aria-hidden="true">check_circle</span> Sealed with waterproof topcoat</li>
                    </ul>
                    <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all mx-auto lg:mx-0">Get a Free Quote <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
                </div>
                <div class="order-1 lg:order-2">
                    <div class="ba-slider rounded-2xl overflow-hidden shadow-md relative select-none" style="aspect-ratio:3/2;cursor:ew-resize;">
                        <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-50 via-white to-[#e7c08b]/20 flex items-center justify-center"><img src="<?php echo get_template_directory_uri(); ?>/images/services/chip-repair/rust-after.png" alt="Bath after rust repair" class="w-full h-full object-cover absolute inset-0" /></div>
                        <div class="ba-clip absolute top-0 left-0 bottom-0 overflow-hidden" style="width:66%;"><div class="ba-before absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center"><img src="<?php echo get_template_directory_uri(); ?>/images/services/chip-repair/rust-before.png" alt="Rust staining" class="w-full h-full object-cover absolute inset-0" /></div></div>
                        <div class="ba-line absolute top-0 bottom-0 w-0.5 bg-white" style="left:66%;z-index:20;cursor:ew-resize;"></div>
                        <div class="ba-handle absolute top-1/2 w-11 h-11 -mt-[22px] -ml-[22px] rounded-full bg-white shadow-xl flex items-center justify-center" style="left:66%;z-index:25;cursor:ew-resize;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5" stroke="#041534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                        <span class="absolute top-3 left-3 bg-black/60 text-white text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">Before</span>
                        <span class="absolute top-3 right-3 bg-white/80 text-[#041534] text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded" style="z-index:15;">After</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- REPAIR vs REPLACE COMPARISON -->
<section class="py-16 sm:py-20 bg-surface-container-low">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="text-center mb-12">
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">Repair vs Replace</h2>
            <p class="text-secondary max-w-2xl mx-auto">A new bath costs thousands. A chip repair costs a fraction and looks just as good.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div class="bg-red-50/50 rounded-2xl p-8 border-2 border-red-200 relative overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal">
                <div class="absolute top-0 right-0 bg-red-100 text-red-700 text-[0.6rem] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">Expensive</div>
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-red-600" aria-hidden="true">close</span></div>
                    <h3 class="text-xl font-extrabold text-primary">Replace the Bath</h3>
                </div>
                <ul class="space-y-4">
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-red-500 text-lg mt-0.5 flex-shrink-0" aria-hidden="true">close</span><div><p class="font-bold text-primary text-sm">Thousands of dollars</p><p class="text-xs text-secondary">Bath + plumber + tiler + waterproofing</p></div></li>
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-red-500 text-lg mt-0.5 flex-shrink-0" aria-hidden="true">close</span><div><p class="font-bold text-primary text-sm">3-5 days disruption</p><p class="text-xs text-secondary">Demolition, install, tiling, drying</p></div></li>
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-red-500 text-lg mt-0.5 flex-shrink-0" aria-hidden="true">close</span><div><p class="font-bold text-primary text-sm">Multiple trades</p><p class="text-xs text-secondary">Plumber, tiler, waterproofer</p></div></li>
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-red-500 text-lg mt-0.5 flex-shrink-0" aria-hidden="true">close</span><div><p class="font-bold text-primary text-sm">All for a chip?</p><p class="text-xs text-secondary">Replacing a bath because of a chip is overkill</p></div></li>
                </ul>
            </div>
            <div class="bg-green-50/50 rounded-2xl p-8 border-2 border-green-300 relative overflow-hidden ring-2 ring-green-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 reveal">
                <div class="absolute top-0 right-0 bg-green-100 text-green-700 text-[0.6rem] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">Recommended</div>
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-green-600" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span></div>
                    <h3 class="text-xl font-extrabold text-primary">Our Chip Repair</h3>
                </div>
                <ul class="space-y-4">
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-green-600 text-lg mt-0.5 flex-shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span><div><p class="font-bold text-primary text-sm">Fixed-Price Quote</p><p class="text-xs text-secondary">Send photos for your price</p></div></li>
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-green-600 text-lg mt-0.5 flex-shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span><div><p class="font-bold text-primary text-sm">Done in 1-2 hours</p><p class="text-xs text-secondary">Most repairs completed same day</p></div></li>
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-green-600 text-lg mt-0.5 flex-shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span><div><p class="font-bold text-primary text-sm">Invisible repair</p><p class="text-xs text-secondary">Colour-matched, sanded flush, sealed</p></div></li>
                    <li class="flex items-start gap-3"><span class="material-symbols-outlined text-green-600 text-lg mt-0.5 flex-shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span><div><p class="font-bold text-primary text-sm">Up to 3-year warranty</p><p class="text-xs text-secondary">Professional-grade repair, fully guaranteed</p></div></li>
                </ul>
            </div>
        </div>
    </div>
</section>

<!-- PROCESS STEPS — Connected Timeline -->
<section class="py-16 sm:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">How We Repair Your Chip</h2>
            <p class="text-secondary">A 4-step process. Most chips repaired in a single visit.</p>
        </div>
        <!-- DESKTOP -->
        <div class="hidden lg:block">
            <div class="grid grid-cols-4 gap-0 relative">
                <div class="absolute top-7 left-[12.5%] right-[12.5%] h-0.5 border-t-2 border-dashed border-[#e7c08b]/40" aria-hidden="true"></div>
                <div class="flex flex-col items-center text-center px-4 reveal">
                    <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center relative z-10 mb-4 shadow-sm"><div class="w-12 h-12 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-2xl font-black text-[#7a5c10]">1</span></div></div>
                    <span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full mb-3">~15 min</span>
                    <h3 class="font-bold text-primary text-sm mb-2">Clean &amp; Prep</h3>
                    <p class="text-xs text-secondary leading-relaxed">Chip area cleaned, loose material removed, surface roughened for adhesion. Rust treated if present.</p>
                </div>
                <div class="flex flex-col items-center text-center px-4 reveal">
                    <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center relative z-10 mb-4 shadow-sm"><div class="w-12 h-12 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-2xl font-black text-[#7a5c10]">2</span></div></div>
                    <span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full mb-3">~30 min</span>
                    <h3 class="font-bold text-primary text-sm mb-2">Fill &amp; Shape</h3>
                    <p class="text-xs text-secondary leading-relaxed">Two-part epoxy applied in thin layers. Built up to match the original surface contour.</p>
                </div>
                <div class="flex flex-col items-center text-center px-4 reveal">
                    <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center relative z-10 mb-4 shadow-sm"><div class="w-12 h-12 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-2xl font-black text-[#7a5c10]">3</span></div></div>
                    <span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full mb-3">~30 min</span>
                    <h3 class="font-bold text-primary text-sm mb-2">Sand &amp; Colour Match</h3>
                    <p class="text-xs text-secondary leading-relaxed">Sanded flush, feathered into surrounding area. Colour matched to your existing finish.</p>
                </div>
                <div class="flex flex-col items-center text-center px-4 reveal">
                    <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center relative z-10 mb-4 shadow-sm"><div class="w-12 h-12 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-2xl font-black text-[#7a5c10]">4</span></div></div>
                    <span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full mb-3">24 hrs</span>
                    <h3 class="font-bold text-primary text-sm mb-2">Seal &amp; Cure</h3>
                    <p class="text-xs text-secondary leading-relaxed">Waterproof clear coat applied. Light use after 24 hours. Full cure in 48 hours.</p>
                </div>
            </div>
        </div>
        <!-- MOBILE -->
        <div class="lg:hidden space-y-0">
            <div class="flex gap-4 reveal"><div class="flex flex-col items-center flex-shrink-0"><div class="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center"><div class="w-9 h-9 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-base font-black text-[#7a5c10]">1</span></div></div><div class="w-0.5 flex-1 bg-[#e7c08b]/30 mt-2"></div></div><div class="pb-8 pt-1"><span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full inline-block mb-2">~15 min</span><h3 class="font-bold text-primary mb-1">Clean &amp; Prep</h3><p class="text-sm text-secondary leading-relaxed">Chip area cleaned, loose material removed, surface roughened. Rust treated if present.</p></div></div>
            <div class="flex gap-4 reveal"><div class="flex flex-col items-center flex-shrink-0"><div class="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center"><div class="w-9 h-9 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-base font-black text-[#7a5c10]">2</span></div></div><div class="w-0.5 flex-1 bg-[#e7c08b]/30 mt-2"></div></div><div class="pb-8 pt-1"><span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full inline-block mb-2">~30 min</span><h3 class="font-bold text-primary mb-1">Fill &amp; Shape</h3><p class="text-sm text-secondary leading-relaxed">Two-part epoxy applied in thin layers. Built up to match original contour.</p></div></div>
            <div class="flex gap-4 reveal"><div class="flex flex-col items-center flex-shrink-0"><div class="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center"><div class="w-9 h-9 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-base font-black text-[#7a5c10]">3</span></div></div><div class="w-0.5 flex-1 bg-[#e7c08b]/30 mt-2"></div></div><div class="pb-8 pt-1"><span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full inline-block mb-2">~30 min</span><h3 class="font-bold text-primary mb-1">Sand &amp; Colour Match</h3><p class="text-sm text-secondary leading-relaxed">Sanded flush, feathered into surrounding area. Colour matched to existing finish.</p></div></div>
            <div class="flex gap-4 reveal"><div class="flex flex-col items-center flex-shrink-0"><div class="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center"><div class="w-9 h-9 rounded-full bg-[#e7c08b]/20 flex items-center justify-center"><span class="text-base font-black text-[#7a5c10]">4</span></div></div></div><div class="pt-1"><span class="text-[0.6rem] font-bold uppercase tracking-widest bg-[#e7c08b]/15 text-[#7a5c10] px-2.5 py-1 rounded-full inline-block mb-2">24 hrs</span><h3 class="font-bold text-primary mb-1">Seal &amp; Cure</h3><p class="text-sm text-secondary leading-relaxed">Waterproof clear coat. Light use after 24 hours, full cure in 48.</p></div></div>
        </div>
    </div>
</section>

<!-- ADD TO ANY JOB CTA -->
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
                <h2 class="text-2xl font-extrabold tracking-tight mb-2">Add Chip Repair to Any Job</h2>
                <p class="text-white/80 text-sm leading-relaxed mb-4">Getting your bath resurfaced or tiles done? Add chip repairs while we&rsquo;re already set up. Same visit, shared prep time, better value than booking separately.</p>
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
            <div class="flex items-start gap-3"><div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5"><span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">bolt</span></div><div><h3 class="font-bold text-primary text-sm">Free Quote in Hours</h3><p class="text-xs text-secondary leading-relaxed">Send photos, get a fixed price back. No home visit needed.</p></div></div>
            <div class="flex items-start gap-3"><div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5"><span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">schedule</span></div><div><h3 class="font-bold text-primary text-sm">Same-Day Service</h3><p class="text-xs text-secondary leading-relaxed">Most chips repaired in 1-2 hours.</p></div></div>
            <div class="flex items-start gap-3"><div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5"><span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">verified_user</span></div><div><h3 class="font-bold text-primary text-sm">Up to 3-Year Warranty</h3><p class="text-xs text-secondary leading-relaxed">Workmanship guaranteed. Fully insured with public liability.</p></div></div>
            <div class="flex items-start gap-3"><div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5"><span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">cleaning_services</span></div><div><h3 class="font-bold text-primary text-sm">No Mess Guarantee</h3><p class="text-xs text-secondary leading-relaxed">Drop sheets, full cleanup. Cleaner than we found it.</p></div></div>
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
                <p class="text-sm text-secondary leading-relaxed mb-6">Not sure if your chip needs a repair or a full resurface? Wondering about the process? These are the questions we hear most. If yours isn&rsquo;t here, send us a message. No pressure.</p>
                <a href="#quote" class="flex w-fit items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all">Ask Us Anything <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
            </div>
            <div class="space-y-2">
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How much does chip repair cost?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Every chip is different. The cost depends on how many chips, their size, and what material the bath or basin is made from. Send us photos and we&rsquo;ll have a fixed-price quote back within hours.</p></div></div>
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How long does it take?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Most single chip repairs are done in 1-2 hours. Multiple chips in the same bath or basin can be repaired in a single visit. The repair needs 24 hours to cure before use.</p></div></div>
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Will the repair be visible?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">No. We colour-match the epoxy filler to your existing finish, sand it flush, and seal it. A professional repair is invisible to the eye.</p></div></div>
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How long does a chip repair last?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">A professional chip repair lasts 3-5+ years with normal use. The two-part epoxy we use is waterproof, heat-resistant, and bonds permanently to the substrate.</p></div></div>
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Can you repair chips on baths, basins, and tiles?</h3><span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span></button><div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4">Yes. We repair chips on bathtubs, basins, and wall or floor tiles. Porcelain, enamel, acrylic, cast iron, ceramic, and fibreglass. Each material requires different prep, but all can be repaired.</p></div></div>
            </div>
        </div>
    </div>
</section>

<!-- QUOTE FORM -->
<section class="py-16 sm:py-20 bg-white" id="quote">
    <div class="max-w-4xl mx-auto px-6 sm:px-8">
        <div class="bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div class="p-6 sm:p-8 lg:p-12 bg-primary text-white">
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Get Your Free Chip Repair Quote</h2>
                <p class="text-on-primary-container text-sm">5 minutes. No obligation. Fixed pricing guaranteed.</p>
            </div>
            <div class="p-6 sm:p-8 lg:p-12">
                <div class="flex items-center justify-between gap-4 mb-8 text-center">
                    <div class="flex-1"><div class="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">1</div><p class="text-[0.65rem] text-secondary font-medium"><strong class="text-primary block">Send photos</strong> of the chip</p></div>
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
                            <label class="flex items-center gap-2 px-4 py-3 border border-surface-container rounded-lg cursor-pointer hover:border-primary transition-colors bg-surface-container-low text-sm"><input type="checkbox" name="service" value="Chip Repair" checked class="text-primary rounded" /> Chip Repair</label>
                            <label class="flex items-center gap-2 px-4 py-3 border border-surface-container rounded-lg cursor-pointer hover:border-primary transition-colors bg-surface-container-low text-sm"><input type="checkbox" name="service" value="Bath Resurfacing" class="text-primary rounded" /> Bath Resurfacing</label>
                            <label class="flex items-center gap-2 px-4 py-3 border border-surface-container rounded-lg cursor-pointer hover:border-primary transition-colors bg-surface-container-low text-sm"><input type="checkbox" name="service" value="Basin Restoration" class="text-primary rounded" /> Basin Restoration</label>
                            <label class="flex items-center gap-2 px-4 py-3 border border-surface-container rounded-lg cursor-pointer hover:border-primary transition-colors bg-surface-container-low text-sm"><input type="checkbox" name="service" value="Tile Resurfacing" class="text-primary rounded" /> Tile Resurfacing</label>
                        </div>
                    </div>
                    <div><label class="text-xs font-bold text-primary uppercase tracking-wider block mb-1.5">Anything else?</label><textarea name="message" rows="3" class="w-full px-4 py-3 rounded-lg border border-surface-container bg-surface-container-low text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none" placeholder="e.g. 2 chips on the bath rim, 1 crack near the drain. Also interested in basin chip repair."></textarea></div>
                    <button class="w-full py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2" type="submit">Get My Free Chip Repair Quote <span class="material-symbols-outlined" aria-hidden="true">send</span></button>
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
