<?php /* Template Name: Tile Resurfacing Sydney */ ?>
<?php get_header(); ?>

<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Tile Resurfacing Sydney",
    "description": "Professional bathroom tile resurfacing service in Sydney. Transform outdated tiles into a clean, modern finish using the Hawk Glass-Tech professional coating system — no demolition, completed in a single day.",
    "provider": {
        "@type": "HomeAndConstructionBusiness",
        "name": "Timeless Resurfacing",
        "url": "https://timelessresurfacing.com.au",
        "telephone": "<?php echo timeless_phone_link(); ?>",
        "address": { "@type": "PostalAddress", "addressLocality": "Sydney", "addressRegion": "NSW", "addressCountry": "AU" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "23" }
    },
    "areaServed": { "@type": "City", "name": "Sydney" },
    "serviceType": "Tile Resurfacing"
}
</script>

<script type="application/ld+json">
{
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://timelessresurfacing.com.au/" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://timelessresurfacing.com.au/services/" },
        { "@type": "ListItem", "position": 3, "name": "Tile Resurfacing Sydney", "item": "https://timelessresurfacing.com.au/services/tile-resurfacing-sydney/" }
    ]
}
</script>

<script type="application/ld+json">
{
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "How much does tile resurfacing cost in Sydney?", "acceptedAnswer": { "@type": "Answer", "text": "Every bathroom is different. We provide fixed-price quotes based on your photos — no hidden fees, no surprises. Send us photos for a quote within hours." } },
        { "@type": "Question", "name": "Can you resurface any type of tile?", "acceptedAnswer": { "@type": "Answer", "text": "Yes: ceramic, porcelain, textured, patterned, and mosaic tiles. Small mosaic tiles have a surcharge due to extra masking. We cannot resurface natural stone (marble/travertine) — those need specialist treatment." } },
        { "@type": "Question", "name": "How long does tile resurfacing last?", "acceptedAnswer": { "@type": "Answer", "text": "up to 10 years with the Hawk Glass-Tech system on wall tiles. Floor tiles last 5-7 years due to foot traffic. Anti-slip additive included on all floor surfaces." } },
        { "@type": "Question", "name": "Can you change the tile colour?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Most customers choose white or light neutral to modernise. The Hawk system offers 900+ colours including custom matches. Stone-fleck granite look also available." } },
        { "@type": "Question", "name": "Does tile resurfacing work over existing grout?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. We resurface over both tiles and grout lines, creating a seamless finish. If grout is cracked/failing, we recommend regrouting first for longevity." } }
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
            <li class="text-primary font-medium">Tile Resurfacing Sydney</li>
        </ol>
    </nav>
</div>

<!-- HERO -->
<section class="pt-4 pb-16 sm:pb-20 bg-surface">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
            <span class="inline-block py-1 px-3 bg-tertiary-fixed-dim/30 text-primary text-[0.7rem] font-bold tracking-widest uppercase rounded mb-4">Service</span>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tighter leading-[0.95] mb-6">
                Tile Resurfacing <span class="text-on-primary-container">Sydney</span>
            </h1>
            <p class="text-base sm:text-lg text-secondary leading-relaxed max-w-xl mb-6">
                Outdated pink, green, or brown tiles? We transform them into a clean, modern finish using the <strong>Hawk Glass-Tech professional coating system</strong> &mdash; no demolition, no dust, no weeks of disruption. Most jobs completed in 1-2 days.
            </p>
            <div class="grid grid-cols-3 gap-3 sm:flex sm:items-center sm:gap-6 mb-8">
                <div class="text-center">
                    <p class="text-base sm:text-3xl font-extrabold text-primary whitespace-nowrap">80–90%</p>
                    <p class="text-xs text-secondary">Cheaper than reno</p>
                </div>
                <div class="hidden sm:block h-10 w-px bg-surface-container"></div>
                <div class="text-center">
                    <p class="text-base sm:text-3xl font-extrabold text-primary whitespace-nowrap">1-2 Days</p>
                    <p class="text-xs text-secondary">Most jobs</p>
                </div>
                <div class="hidden sm:block h-10 w-px bg-surface-container"></div>
                <div class="text-center">
                    <p class="text-base sm:text-3xl font-extrabold text-primary whitespace-nowrap">3yr</p>
                    <p class="text-xs text-secondary">Coating warranty</p>
                </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-3">
                <a class="px-8 py-4 bg-primary text-white font-bold rounded-lg text-center hover:shadow-xl transition-all" href="#quote">Get Your Free Quote</a>
                <a href="tel:<?php echo timeless_phone_link(); ?>" class="px-8 py-4 bg-surface-container-high text-primary font-bold rounded-lg text-center hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2"><span class="material-symbols-outlined text-lg" aria-hidden="true">call</span> Call Now</a>
            </div>
        </div>
        <div class="aspect-[4/3] bg-surface-container-highest rounded-xl overflow-hidden shadow-xl">
            <img class="w-full h-full object-cover" alt="Professional tile resurfacing in Sydney - bathroom tiles transformed with Hawk Glass-Tech coating system" src="<?php echo get_template_directory_uri(); ?>/images/services/tile-resurfacing/hero.jpg" loading="eager" width="800" height="600" />
        </div>
    </div>
</section>

<!-- TRUST BAR -->
<section class="bg-primary text-white py-4">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 flex flex-wrap justify-center sm:justify-between items-center gap-4">
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified_user</span><span class="text-xs font-bold">Experienced &amp; Insured</span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">security</span><span class="text-xs font-bold">Public Liability Insured</span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified</span><span class="text-xs font-bold">3-Year Warranty</span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">schedule</span><span class="text-xs font-bold">Completed in 1-2 Days</span></div>
    </div>
</section>

<!-- RECENT WORK GALLERY -->
<section class="py-16 sm:py-20 bg-surface-container-low">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="max-w-3xl mb-10">
            <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.65rem] font-bold tracking-widest uppercase rounded mb-3">Real Results</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">Recent Tile Resurfacing Projects</h2>
            <p class="text-secondary">Dated tiles transformed into modern finishes &mdash; no demolition, no new tiling, just professional resurfacing.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <article class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal">
                <!-- REPLACE: images/services/tile-resurfacing/project-1.jpg — before/after split, 600x450 -->
                <div class="aspect-[4/3] bg-gradient-to-r from-rose-100 to-emerald-100 flex items-center justify-center relative overflow-hidden">
                    <div class="absolute inset-y-0 left-0 w-1/2 bg-rose-100 flex items-center justify-center">
                        <span class="text-[0.6rem] font-bold text-rose-700 uppercase tracking-widest bg-white/80 px-2 py-1 rounded">Before</span>
                    </div>
                    <div class="absolute inset-y-0 right-0 w-1/2 bg-emerald-100 flex items-center justify-center">
                        <span class="text-[0.6rem] font-bold text-emerald-700 uppercase tracking-widest bg-white/80 px-2 py-1 rounded">After</span>
                    </div>
                    <div class="absolute inset-y-0 left-1/2 w-0.5 bg-white -ml-px"></div>
                </div>
                <div class="p-5">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="font-bold text-primary text-sm">Newtown Apartment</h3>
                        <span class="text-[0.6rem] bg-surface-container px-2 py-0.5 rounded font-bold uppercase text-outline">Wall Tiles</span>
                    </div>
                    <p class="text-xs text-secondary italic">"Went from brown 80s tiles to modern white. Night and day."</p>
                    <p class="text-[0.65rem] text-outline mt-2 font-medium">&#8212; Emma K. &middot; Inner West</p>
                </div>
            </article>
            <article class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal">
                <!-- REPLACE: images/services/tile-resurfacing/project-2.jpg — before/after split, 600x450 -->
                <div class="aspect-[4/3] bg-gradient-to-r from-rose-100 to-emerald-100 flex items-center justify-center relative overflow-hidden">
                    <div class="absolute inset-y-0 left-0 w-1/2 bg-rose-100 flex items-center justify-center">
                        <span class="text-[0.6rem] font-bold text-rose-700 uppercase tracking-widest bg-white/80 px-2 py-1 rounded">Before</span>
                    </div>
                    <div class="absolute inset-y-0 right-0 w-1/2 bg-emerald-100 flex items-center justify-center">
                        <span class="text-[0.6rem] font-bold text-emerald-700 uppercase tracking-widest bg-white/80 px-2 py-1 rounded">After</span>
                    </div>
                    <div class="absolute inset-y-0 left-1/2 w-0.5 bg-white -ml-px"></div>
                </div>
                <div class="p-5">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="font-bold text-primary text-sm">Chatswood Townhouse</h3>
                        <span class="text-[0.6rem] bg-surface-container px-2 py-0.5 rounded font-bold uppercase text-outline">Floor Tiles</span>
                    </div>
                    <p class="text-xs text-secondary italic">"Feels like a new bathroom without the renovation."</p>
                    <p class="text-[0.65rem] text-outline mt-2 font-medium">&#8212; Andrew H. &middot; North Shore</p>
                </div>
            </article>
            <article class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal">
                <!-- REPLACE: images/services/tile-resurfacing/project-3.jpg — before/after split, 600x450 -->
                <div class="aspect-[4/3] bg-gradient-to-r from-rose-100 to-emerald-100 flex items-center justify-center relative overflow-hidden">
                    <div class="absolute inset-y-0 left-0 w-1/2 bg-rose-100 flex items-center justify-center">
                        <span class="text-[0.6rem] font-bold text-rose-700 uppercase tracking-widest bg-white/80 px-2 py-1 rounded">Before</span>
                    </div>
                    <div class="absolute inset-y-0 right-0 w-1/2 bg-emerald-100 flex items-center justify-center">
                        <span class="text-[0.6rem] font-bold text-emerald-700 uppercase tracking-widest bg-white/80 px-2 py-1 rounded">After</span>
                    </div>
                    <div class="absolute inset-y-0 left-1/2 w-0.5 bg-white -ml-px"></div>
                </div>
                <div class="p-5">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="font-bold text-primary text-sm">Hornsby Family Home</h3>
                        <span class="text-[0.6rem] bg-surface-container px-2 py-0.5 rounded font-bold uppercase text-outline">Full Bathroom</span>
                    </div>
                    <p class="text-xs text-secondary italic">"Saved thousands vs re-tiling."</p>
                    <p class="text-[0.65rem] text-outline mt-2 font-medium">&#8212; Linda W. &middot; Northern Suburbs</p>
                </div>
            </article>
        </div>
        <div class="mt-8 text-center">
            <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:shadow-xl transition-all text-sm">Transform Your Tiles <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
        </div>
    </div>
</section>

<!-- WHY RESURFACE TILES -->
<section class="py-16 sm:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <h2 class="text-3xl font-extrabold text-primary tracking-tighter mb-4">Why Resurface Your Tiles?</h2>
        <p class="text-secondary max-w-3xl mb-10">Tile resurfacing is the fastest and most affordable way to modernise a dated bathroom. No demolition, no retiling, no weeks of disruption &mdash; just a brand-new finish in one day.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-surface-container-low rounded-xl p-6 reveal">
                <span class="material-symbols-outlined text-3xl text-error mb-3 block" aria-hidden="true">palette</span>
                <h3 class="font-bold text-primary mb-2">Dated Colours</h3>
                <p class="text-sm text-secondary leading-relaxed">70s-90s pink, green, brown tiles make the whole bathroom feel old. Resurfacing modernises instantly.</p>
            </div>
            <div class="bg-surface-container-low rounded-xl p-6 reveal">
                <span class="material-symbols-outlined text-3xl text-error mb-3 block" aria-hidden="true">grid_view</span>
                <h3 class="font-bold text-primary mb-2">Cracked Grout Lines</h3>
                <p class="text-sm text-secondary leading-relaxed">Tile surface still good but grout failed? We can regrout first, then resurface tiles for a complete transformation.</p>
            </div>
            <div class="bg-surface-container-low rounded-xl p-6 reveal">
                <span class="material-symbols-outlined text-3xl text-error mb-3 block" aria-hidden="true">block</span>
                <h3 class="font-bold text-primary mb-2">No Demolition</h3>
                <p class="text-sm text-secondary leading-relaxed">Retiling means ripping out tiles, waterproofing, tiling, grouting &mdash; 2-4 weeks. Resurfacing takes 1-2 days.</p>
            </div>
            <div class="bg-surface-container-low rounded-xl p-6 reveal">
                <span class="material-symbols-outlined text-3xl text-error mb-3 block" aria-hidden="true">real_estate_agent</span>
                <h3 class="font-bold text-primary mb-2">Rental &amp; Pre-Sale</h3>
                <p class="text-sm text-secondary leading-relaxed">Property managers and sellers use tile resurfacing to modernise bathrooms fast and cheap before tenants or open homes.</p>
            </div>
        </div>
    </div>
</section>

<!-- OUR PROCESS -->
<section class="py-16 sm:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="max-w-3xl mb-10">
            <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.65rem] font-bold tracking-widest uppercase rounded mb-3">Our Process</span>
            <h2 class="text-3xl font-extrabold text-primary tracking-tighter mb-3">How We Resurface Your Tiles</h2>
            <p class="text-secondary">Every step exists for a reason. Here&rsquo;s exactly what we do and why &mdash; from surface prep to that factory-fresh finish.</p>
        </div>
        <div class="space-y-4 max-w-3xl">
            <div class="flex gap-4 items-start bg-surface-container-low rounded-xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 reveal">
                <div class="flex-shrink-0 w-12 h-12 rounded-full bg-[#e7c08b]/15 flex items-center justify-center"><span class="material-symbols-outlined text-xl text-[#c99a55]" aria-hidden="true">search</span></div>
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1"><span class="text-[0.6rem] font-black text-[#c99a55] uppercase tracking-widest">Step 1</span></div>
                    <h3 class="font-bold text-primary text-base mb-1">Assessment &amp; Surface Check</h3>
                    <p class="text-sm text-secondary leading-relaxed mb-2">We inspect every tile for cracks, loose edges, and adhesion. We check grout condition too &mdash; if grout needs replacing, we recommend doing both at once.</p>
                    <p class="text-xs text-[#c99a55] font-medium flex items-center gap-1"><span class="material-symbols-outlined text-sm" aria-hidden="true">priority_high</span> Why it matters: Resurfacing over cracked or loose tiles means the coating cracks too. We fix the foundation first.</p>
                </div>
            </div>
            <div class="flex gap-4 items-start bg-surface-container-low rounded-xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 reveal">
                <div class="flex-shrink-0 w-12 h-12 rounded-full bg-[#e7c08b]/15 flex items-center justify-center"><span class="material-symbols-outlined text-xl text-[#c99a55]" aria-hidden="true">cleaning_services</span></div>
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1"><span class="text-[0.6rem] font-black text-[#c99a55] uppercase tracking-widest">Step 2</span></div>
                    <h3 class="font-bold text-primary text-base mb-1">Deep Clean &amp; Etch</h3>
                    <p class="text-sm text-secondary leading-relaxed mb-2">Tiles degreased, cleaned of soap scum, mould, and mineral buildup. Then chemically etched to create a surface the coating can grip &mdash; especially important on glazed tiles.</p>
                    <p class="text-xs text-[#c99a55] font-medium flex items-center gap-1"><span class="material-symbols-outlined text-sm" aria-hidden="true">priority_high</span> Why it matters: Glazed ceramic tiles are the hardest surface to bond to. Without etching, any coating will peel. This step makes or breaks the job.</p>
                </div>
            </div>
            <div class="flex gap-4 items-start bg-surface-container-low rounded-xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 reveal">
                <div class="flex-shrink-0 w-12 h-12 rounded-full bg-[#e7c08b]/15 flex items-center justify-center"><span class="material-symbols-outlined text-xl text-[#c99a55]" aria-hidden="true">build</span></div>
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1"><span class="text-[0.6rem] font-black text-[#c99a55] uppercase tracking-widest">Step 3</span></div>
                    <h3 class="font-bold text-primary text-base mb-1">Repair &amp; Fill</h3>
                    <p class="text-sm text-secondary leading-relaxed mb-2">Cracked tiles, chipped edges, or damaged grout lines repaired with epoxy filler and sanded flush. Surface needs to be perfectly smooth before coating.</p>
                    <p class="text-xs text-[#c99a55] font-medium flex items-center gap-1"><span class="material-symbols-outlined text-sm" aria-hidden="true">priority_high</span> Why it matters: A resurfaced tile is only as good as the surface underneath. Filling imperfections now prevents them showing through.</p>
                </div>
            </div>
            <div class="flex gap-4 items-start bg-surface-container-low rounded-xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 reveal">
                <div class="flex-shrink-0 w-12 h-12 rounded-full bg-[#e7c08b]/15 flex items-center justify-center"><span class="material-symbols-outlined text-xl text-[#c99a55]" aria-hidden="true">format_paint</span></div>
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1"><span class="text-[0.6rem] font-black text-[#c99a55] uppercase tracking-widest">Step 4</span></div>
                    <h3 class="font-bold text-primary text-base mb-1">Primer &amp; Colour Coat</h3>
                    <p class="text-sm text-secondary leading-relaxed mb-2">Specialist bonding primer applied, followed by architectural-grade colour coat in your chosen finish. Spray-applied using HVLP equipment for an even, professional result.</p>
                    <p class="text-xs text-[#c99a55] font-medium flex items-center gap-1"><span class="material-symbols-outlined text-sm" aria-hidden="true">priority_high</span> Why it matters: This is where your dated brown tiles become clean, modern white. Spray technique gives a factory finish that brush or roller can&rsquo;t match.</p>
                </div>
            </div>
            <div class="flex gap-4 items-start bg-surface-container-low rounded-xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 reveal">
                <div class="flex-shrink-0 w-12 h-12 rounded-full bg-[#e7c08b]/15 flex items-center justify-center"><span class="material-symbols-outlined text-xl text-[#c99a55]" aria-hidden="true">verified</span></div>
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1"><span class="text-[0.6rem] font-black text-[#c99a55] uppercase tracking-widest">Step 5</span></div>
                    <h3 class="font-bold text-primary text-base mb-1">Clear Coat &amp; Seal</h3>
                    <p class="text-sm text-secondary leading-relaxed mb-2">Protective clear coat for extra durability and UV resistance. Grout lines sealed. 24-48 hour cure, then bathroom is ready.</p>
                    <p class="text-xs text-[#c99a55] font-medium flex items-center gap-1"><span class="material-symbols-outlined text-sm" aria-hidden="true">priority_high</span> Why it matters: The clear coat adds a protective shell that resists scratches, stains, and yellowing. Keeps the finish looking fresh for years.</p>
                </div>
            </div>
        </div>
        <div class="mt-8 max-w-3xl p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-3">
            <span class="material-symbols-outlined text-primary flex-shrink-0" aria-hidden="true">cleaning_services</span>
            <div>
                <p class="font-bold text-primary text-sm mb-1">No Mess Guarantee</p>
                <p class="text-xs text-secondary">We contain the work area with drop sheets, vacuum all dust as we go, and leave your bathroom cleaner than we found it.</p>
            </div>
        </div>
    </div>
</section>

<!-- Mid-page CTA -->
<section class="py-12 bg-primary text-white">
    <div class="max-w-3xl mx-auto px-4 text-center">
        <h2 class="text-2xl sm:text-3xl font-black mb-3">Ready to Transform Your Bathroom?</h2>
        <p class="text-white/80 mb-6">Send us a few photos and we'll have a fixed-price quote back to you within hours. No obligation.</p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#quote" class="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold py-3 px-8 rounded-lg hover:bg-surface-container-low transition-colors">
                <span class="material-symbols-outlined text-[20px]">photo_camera</span>
                Get a Free Quote
            </a>
            <a href="tel:<?php echo timeless_phone_link(); ?>" class="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors">
                <span class="material-symbols-outlined text-[20px]">call</span>
                Call Now
            </a>
        </div>
    </div>
</section>

<!-- VALUE PROPOSITION -->
<section class="py-16 sm:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <h2 class="text-3xl font-extrabold text-primary tracking-tighter mb-4">Why Choose Timeless Resurfacing?</h2>
        <p class="text-secondary max-w-3xl mb-10">Quality workmanship, transparent pricing, and a result that lasts. Get a free quote today &mdash; no obligation.</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            <div class="bg-surface-container-low rounded-xl p-8 text-center border-2 border-surface-container">
                <span class="material-symbols-outlined text-3xl text-primary mb-3 block" aria-hidden="true">schedule</span>
                <h3 class="font-bold text-primary mb-2">Completed in 1-2 Days</h3>
                <p class="text-sm text-secondary leading-relaxed">Most jobs completed in a single day. Your bathroom ready to use again next day.</p>
            </div>
            <div class="bg-primary/[0.03] rounded-xl p-8 text-center border-2 border-primary ring-2 ring-primary/10">
                <span class="material-symbols-outlined text-3xl text-primary mb-3 block" aria-hidden="true">savings</span>
                <h3 class="font-bold text-primary mb-2">Save 80–90%</h3>
                <p class="text-sm text-secondary leading-relaxed">A fraction of the cost of full renovation. No demolition, no plumber, no weeks of disruption.</p>
            </div>
            <div class="bg-surface-container-low rounded-xl p-8 text-center border-2 border-surface-container">
                <span class="material-symbols-outlined text-3xl text-primary mb-3 block" aria-hidden="true">verified_user</span>
                <h3 class="font-bold text-primary mb-2">3-Year Warranty</h3>
                <p class="text-sm text-secondary leading-relaxed">Every resurfacing job backed by our 3-year workmanship warranty. Fully insured with public liability cover.</p>
            </div>
        </div>

        <div class="text-center mt-8"><a class="px-8 py-4 bg-primary text-white font-bold rounded-lg hover:shadow-xl transition-all inline-block" href="#quote">Get a Free Quote</a></div>
    </div>
</section>

<!-- RESURFACING vs RETILING -->
<section class="py-16 sm:py-20 bg-surface-container-low">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <h2 class="text-3xl font-extrabold text-primary tracking-tighter mb-4">Resurfacing vs Retiling: Which Should You Choose?</h2>
        <p class="text-secondary max-w-3xl mb-10">If your tiles are structurally sound, resurfacing delivers a brand-new look at a fraction of the cost and time.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <div class="bg-primary/[0.03] rounded-xl p-8 border-2 border-primary ring-1 ring-primary/10">
                <h3 class="font-bold text-primary mb-4 flex items-center gap-2"><span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;" aria-hidden="true">star</span> Tile Resurfacing (Recommended)</h3>
                <ul class="space-y-3 text-sm text-secondary">
                    <li class="flex items-start gap-2"><span class="text-primary font-bold">+</span> A fraction of the cost &mdash; <a href="#quote" class="underline">get a free quote</a></li>
                    <li class="flex items-start gap-2"><span class="text-primary font-bold">+</span> Timeframe: 1-2 days</li>
                    <li class="flex items-start gap-2"><span class="text-primary font-bold">+</span> No demolition required</li>
                    <li class="flex items-start gap-2"><span class="text-primary font-bold">+</span> No waterproofing needed</li>
                    <li class="flex items-start gap-2"><span class="text-primary font-bold">+</span> Ready to use next day</li>
                </ul>
            </div>
            <div class="bg-white rounded-xl p-8 border-2 border-surface-container">
                <h3 class="font-bold text-primary mb-4 flex items-center gap-2"><span class="material-symbols-outlined" aria-hidden="true">construction</span> Retiling</h3>
                <ul class="space-y-3 text-sm text-secondary">
                    <li class="flex items-start gap-2"><span class="text-error font-bold">&minus;</span> Cost: thousands more &mdash; <a href="#quote" class="underline">get a free quote</a></li>
                    <li class="flex items-start gap-2"><span class="text-error font-bold">&minus;</span> Timeframe: 2-4 weeks</li>
                    <li class="flex items-start gap-2"><span class="text-error font-bold">&minus;</span> Demolition required</li>
                    <li class="flex items-start gap-2"><span class="text-error font-bold">&minus;</span> New waterproofing needed</li>
                    <li class="flex items-start gap-2"><span class="text-error font-bold">&minus;</span> 3+ week disruption</li>
                </ul>
            </div>
        </div>
    </div>
</section>

<!-- FAQ -->
<section class="py-16 sm:py-20 bg-white" id="faqs">
    <div class="max-w-3xl mx-auto px-6 sm:px-8">
        <h2 class="text-3xl font-extrabold text-primary tracking-tighter mb-4 text-center">Tile Resurfacing FAQs</h2>
        <p class="text-secondary text-center mb-10">Common questions about tile resurfacing in Sydney.</p>

        <div class="space-y-3">
            <div class="faq-item border border-surface-container rounded-xl"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How much does tile resurfacing cost in Sydney?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Every bathroom is different. We provide fixed-price quotes based on your photos &mdash; no hidden fees, no surprises. Send us photos for a quote within hours.</p></div></div>

            <div class="faq-item border border-surface-container rounded-xl"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Can you resurface any type of tile?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Yes: ceramic, porcelain, textured, patterned, and mosaic tiles. Small mosaic tiles have a surcharge due to extra masking. We cannot resurface natural stone (marble/travertine) &mdash; those need specialist treatment.</p></div></div>

            <div class="faq-item border border-surface-container rounded-xl"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How long does tile resurfacing last?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">up to 10 years with the Hawk Glass-Tech system on wall tiles. Floor tiles last 5-7 years due to foot traffic. Anti-slip additive included on all floor surfaces.</p></div></div>

            <div class="faq-item border border-surface-container rounded-xl"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Can you change the tile colour?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Yes. Most customers choose white or light neutral to modernise. The Hawk system offers 900+ colours including custom matches. Stone-fleck granite look also available.</p></div></div>

            <div class="faq-item border border-surface-container rounded-xl"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Does tile resurfacing work over existing grout?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Yes. We resurface over both tiles and grout lines, creating a seamless finish. If grout is cracked or failing, we recommend regrouting first for longevity.</p></div></div>
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
            <form class="timeless-quote-form p-6 sm:p-8 lg:p-12 space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label for="name" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Full Name *</label><input id="name" name="name" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="John Citizen" required /></div>
                    <div><label for="phone" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Phone *</label><input id="phone" name="phone" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="0400 000 000" type="tel" required /></div>
                </div>
                <div><label for="address" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Suburb *</label><input id="address" name="address" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. Parramatta, Bondi, Surry Hills" required /></div>
                <div>
                    <label class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">What needs resurfacing?</label>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" checked /> Shower wall tiles</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Shower floor tiles</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Bathroom wall tiles</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Bathroom floor tiles</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Full bathroom tiles</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Kitchen splashback</label>
                    </div>
                </div>
                <div><label for="notes" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Anything else?</label><textarea id="notes" name="notes" rows="3" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="e.g. tiles are pink/green, want white finish, apartment building, need anti-slip on floor..."></textarea></div>
                <button class="w-full py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2" type="submit">Get My Free Tile Resurfacing Quote <span class="material-symbols-outlined" aria-hidden="true">send</span></button>
                <p class="text-center text-[0.6rem] text-secondary">We respond within hours. No spam, ever.</p>
            </form>
        </div>
    </div>
</section>

<!-- OTHER SERVICES -->
<section class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <h2 class="text-2xl font-extrabold text-primary tracking-tighter mb-8">Other Services You Might Need</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="<?php echo esc_url( home_url( '/services/shower-regrouting-sydney/' ) ); ?>" class="bg-surface-container-low rounded-xl p-6 hover:shadow-md transition-all group">
                <span class="material-symbols-outlined text-2xl text-primary mb-2 block" aria-hidden="true">plumbing</span>
                <h3 class="font-bold text-primary text-sm group-hover:text-on-primary-container transition-colors">Shower Regrouting</h3>
                <p class="text-xs text-secondary mt-1">Stop leaks and mould</p>
            </a>
            <a href="<?php echo esc_url( home_url( '/services/bath-resurfacing-sydney/' ) ); ?>" class="bg-surface-container-low rounded-xl p-6 hover:shadow-md transition-all group">
                <span class="material-symbols-outlined text-2xl text-primary mb-2 block" aria-hidden="true">bathtub</span>
                <h3 class="font-bold text-primary text-sm group-hover:text-on-primary-container transition-colors">Bath Resurfacing</h3>
                <p class="text-xs text-secondary mt-1">Restore your bathtub like new</p>
            </a>
            <a href="<?php echo esc_url( home_url( '/services/vanity-refinishing-sydney/' ) ); ?>" class="bg-surface-container-low rounded-xl p-6 hover:shadow-md transition-all group">
                <span class="material-symbols-outlined text-2xl text-primary mb-2 block" aria-hidden="true">countertops</span>
                <h3 class="font-bold text-primary text-sm group-hover:text-on-primary-container transition-colors">Vanity Refinishing</h3>
                <p class="text-xs text-secondary mt-1">Restore your vanity top</p>
            </a>
            <a href="<?php echo esc_url( home_url( '/services/basin-restoration-sydney/' ) ); ?>" class="bg-surface-container-low rounded-xl p-6 hover:shadow-md transition-all group">
                <span class="material-symbols-outlined text-2xl text-primary mb-2 block" aria-hidden="true">faucet</span>
                <h3 class="font-bold text-primary text-sm group-hover:text-on-primary-container transition-colors">Basin Restoration</h3>
                <p class="text-xs text-secondary mt-1">Refinish chips and stains</p>
            </a>
        </div>
    </div>
</section>

</main>

<?php get_footer(); ?>
