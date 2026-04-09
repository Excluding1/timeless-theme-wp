<?php /* Template Name: FAQs */ ?>
<?php get_header(); ?>

<!-- Schema: FAQPage -->
<script type="application/ld+json">
{
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "What exactly is bathroom resurfacing?", "acceptedAnswer": { "@type": "Answer", "text": "Bathroom resurfacing is a process where we apply a durable coating over your existing surfaces. It costs up to 70% less than a full renovation and lasts up to 10 years with proper care." } },
        { "@type": "Question", "name": "How much does bathroom resurfacing cost in Sydney?", "acceptedAnswer": { "@type": "Answer", "text": "Every bathroom is different. Resurfacing is up to 70% cheaper than a full renovation ($25K-$50K). Send us photos for an accurate, fixed-price quote." } },
        { "@type": "Question", "name": "How long does bathroom resurfacing take?", "acceptedAnswer": { "@type": "Answer", "text": "Most jobs are completed in 6-8 hours — one day. Your bathroom is ready to use again the next day." } },
        { "@type": "Question", "name": "How long does a resurfaced bathroom last?", "acceptedAnswer": { "@type": "Answer", "text": "Up to 10 years with normal use and basic care. We use commercial-grade two-part epoxy and acrylic urethane coatings." } },
        { "@type": "Question", "name": "What coatings do you use?", "acceptedAnswer": { "@type": "Answer", "text": "Commercial-grade two-part epoxy and acrylic urethane coatings. We use the Hawk Glass-Tech system for bathtubs. Coatings are low-VOC and food-safe once cured." } },
        { "@type": "Question", "name": "Do you work with property managers?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. We handle multi-unit turnovers, rental refreshes, and strata work across Sydney. Volume pricing available for property managers with multiple units." } },
        { "@type": "Question", "name": "What warranty do you provide?", "acceptedAnswer": { "@type": "Answer", "text": "Up to 3-year workmanship warranty covering peeling, bubbling, and adhesion failure. We fix it free under normal use." } }
    ]
}
</script>

<main id="main-content">

<!-- BREADCRUMB -->
<div class="pt-24 pb-2 bg-surface">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <nav aria-label="Breadcrumb" class="text-xs text-secondary">
            <ol class="flex items-center gap-2">
                <li><a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="hover:text-primary transition-colors">Home</a></li>
                <li><span class="material-symbols-outlined text-xs align-middle" aria-hidden="true">chevron_right</span></li>
                <li class="font-bold text-primary">FAQs</li>
            </ol>
        </nav>
    </div>
</div>

<!-- PAGE HEADING -->
<section class="pt-6 pb-12 sm:pb-16 bg-surface">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 text-center">
        <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.7rem] font-bold tracking-widest uppercase rounded mb-6">Answers You Need</span>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tighter leading-[0.95] mb-4">Frequently Asked Questions</h1>
        <p class="text-base sm:text-lg text-secondary leading-relaxed max-w-2xl mx-auto">Everything you need to know about bathroom resurfacing, shower regrouting, pricing, process, and warranty.</p>
        <div class="h-1 w-20 bg-tertiary-fixed-dim mt-6 mx-auto"></div>
    </div>
</section>

<!-- STICKY CATEGORY FILTER -->
<div class="sticky top-16 z-30 bg-white border-b border-surface-container shadow-sm">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <nav class="flex gap-2 overflow-x-auto py-3 -mx-6 px-6 sm:mx-0 sm:px-0 no-scrollbar" aria-label="FAQ categories">
            <button onclick="showCategory('all')" class="faq-cat-btn active px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg transition-all whitespace-nowrap" data-cat="all">All Questions</button>
            <button onclick="showCategory('getting-started')" class="faq-cat-btn px-4 py-2 bg-surface-container-high text-secondary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all whitespace-nowrap" data-cat="getting-started">Getting Started</button>
            <button onclick="showCategory('cost')" class="faq-cat-btn px-4 py-2 bg-surface-container-high text-secondary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all whitespace-nowrap" data-cat="cost">Cost &amp; Pricing</button>
            <button onclick="showCategory('process')" class="faq-cat-btn px-4 py-2 bg-surface-container-high text-secondary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all whitespace-nowrap" data-cat="process">Process &amp; Timing</button>
            <button onclick="showCategory('results')" class="faq-cat-btn px-4 py-2 bg-surface-container-high text-secondary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all whitespace-nowrap" data-cat="results">Results &amp; Durability</button>
            <button onclick="showCategory('materials')" class="faq-cat-btn px-4 py-2 bg-surface-container-high text-secondary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all whitespace-nowrap" data-cat="materials">Materials &amp; Safety</button>
            <button onclick="showCategory('property')" class="faq-cat-btn px-4 py-2 bg-surface-container-high text-secondary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all whitespace-nowrap" data-cat="property">Property Managers</button>
            <button onclick="showCategory('warranty')" class="faq-cat-btn px-4 py-2 bg-surface-container-high text-secondary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all whitespace-nowrap" data-cat="warranty">Warranty &amp; Aftercare</button>
        </nav>
    </div>
</div>

<!-- FAQ SECTIONS -->
<section class="py-12 sm:py-16 bg-surface">
    <div class="max-w-3xl mx-auto px-6 sm:px-8">

        <!-- ───── GETTING STARTED ───── -->
        <div class="faq-category mb-12" data-cat="getting-started">
            <div class="flex items-center gap-3 mb-6">
                <span class="material-symbols-outlined text-2xl text-tertiary-fixed-dim" aria-hidden="true">play_circle</span>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">Getting Started</h2>
            </div>
            <div class="space-y-3">
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">What exactly is bathroom resurfacing?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Bathroom resurfacing is a process where we apply a durable, factory-grade coating over your existing surfaces &mdash; bathtubs, tiles, basins, and vanities. Instead of ripping everything out and starting again, we restore what&rsquo;s already there. It costs up to 70% less than a full renovation and lasts up to 10 years with proper care.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">What surfaces can be resurfaced?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Bathtubs, wall tiles, floor tiles, basins, vanity tops, and shower bases. We work with porcelain, ceramic, acrylic, cast iron, and fibreglass surfaces. If it&rsquo;s in your bathroom and it&rsquo;s solid, we can almost certainly resurface it.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Is resurfacing right for my bathroom?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Yes, if the structure is sound but surfaces look dated, stained, chipped, or damaged. Resurfacing is ideal for cosmetic refreshes. It&rsquo;s not the right fit if there&rsquo;s serious structural damage, water damage behind walls, or failed waterproofing membranes &mdash; we&rsquo;ll let you know during the quoting process if that&rsquo;s the case.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How do I get a quote?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Simply send us photos of your bathroom via our <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" class="text-primary font-bold underline hover:text-on-primary-container">online quote form</a>. We&rsquo;ll review the photos and provide a fixed-price quote by the next business day. No site visit needed for most quotes.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Do you offer free quotes?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Yes, 100% free and no obligation. Our quotes are fixed-price, which means the price you see is the price you pay &mdash; no surprises, no hidden extras.</p></div></div>
            </div>
        </div>

        <!-- ───── COST & PRICING ───── -->
        <div class="faq-category mb-12" data-cat="cost">
            <div class="flex items-center gap-3 mb-6">
                <span class="material-symbols-outlined text-2xl text-tertiary-fixed-dim" aria-hidden="true">payments</span>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">Cost &amp; Pricing</h2>
            </div>
            <div class="space-y-3">
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How much does bathroom resurfacing cost in Sydney?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Every bathroom is different, so we provide fixed-price quotes based on your photos. What we can say is that resurfacing is up to 70% cheaper than a full renovation (which typically runs $25,000&ndash;$50,000 in Sydney). Send us photos and we&rsquo;ll give you an accurate quote.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Why is resurfacing cheaper than renovation?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">No demolition, no plumber, no tiler, no waterproofer. One team, one day, a fraction of the cost. Renovation requires multiple trades over weeks &mdash; resurfacing is a single-step process that transforms your existing surfaces in place.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Are there hidden fees?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">No. We provide fixed-price quotes, which means the price you see is the price you pay. No call-out fees, no surprise extras on the day. Everything is included in the quote upfront.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Do you offer payment plans?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Contact us to discuss payment options for larger projects. We&rsquo;re happy to work with you to find a solution that fits your budget.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How much can I save vs renovation?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Typically 50&ndash;70% savings. A bathroom renovation costing $30,000 or more can often be resurfaced for a fraction of that price &mdash; with the same visual result and far less disruption to your home.</p></div></div>
            </div>
        </div>

        <!-- ───── PROCESS & TIMING ───── -->
        <div class="faq-category mb-12" data-cat="process">
            <div class="flex items-center gap-3 mb-6">
                <span class="material-symbols-outlined text-2xl text-tertiary-fixed-dim" aria-hidden="true">schedule</span>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">Process &amp; Timing</h2>
            </div>
            <div class="space-y-3">
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How long does bathroom resurfacing take?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Most jobs are completed in 6&ndash;8 hours &mdash; a single day. Your bathroom is ready to use again the next day. Larger or multi-surface projects may take two days.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">What is the resurfacing process?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Five steps: <strong>1.</strong> Assessment &mdash; we inspect and prepare the scope. <strong>2.</strong> Surface prep &mdash; thorough cleaning, sanding, and degreasing. <strong>3.</strong> Repair &mdash; chips, cracks, and damage are filled. <strong>4.</strong> Primer coat &mdash; bonding agent applied for adhesion. <strong>5.</strong> Top coat &mdash; professional spray application of the final finish.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Is there mess or disruption?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Minimal. We contain the work area and protect surrounding surfaces. There&rsquo;s no demolition, no dust clouds, and no piles of debris. Most homeowners are surprised by how clean the process is.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Do I need to leave my home?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">No. We ventilate the work area with professional extraction equipment. You can stay home and go about your day while we work.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">When can I use my bathroom after resurfacing?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">24 hours for baths and showers. 48 hours for a full cure. We&rsquo;ll give you specific care instructions on the day to make sure everything sets perfectly.</p></div></div>
            </div>
        </div>

        <!-- ───── RESULTS & DURABILITY ───── -->
        <div class="faq-category mb-12" data-cat="results">
            <div class="flex items-center gap-3 mb-6">
                <span class="material-symbols-outlined text-2xl text-tertiary-fixed-dim" aria-hidden="true">verified</span>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">Results &amp; Durability</h2>
            </div>
            <div class="space-y-3">
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How long does a resurfaced bathroom last?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Up to 10 years with normal use and basic care. The commercial-grade coatings we use are resistant to chipping, peeling, and yellowing. Proper maintenance makes all the difference.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">What&rsquo;s the difference between DIY kits and professional resurfacing?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">DIY kits from hardware stores typically peel within 6&ndash;12 months. They use single-part paints that can&rsquo;t withstand daily use. Professional resurfacing uses commercial-grade two-part coatings, spray-applied by trained technicians, that last up to 10 years. The difference in durability is night and day.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Can I choose colours?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Yes. We offer 900+ colour options including whites, creams, stone-fleck finishes, and satin finishes. Most clients choose a clean white or off-white, but we can match almost any colour you want.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Will it look like a new bathroom?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Yes. Professional spray application gives a factory-smooth, glossy finish that looks and feels like a brand-new surface. Check out our <a href="<?php echo esc_url( home_url( '/gallery/' ) ); ?>" class="text-primary font-bold underline hover:text-on-primary-container">before &amp; after gallery</a> to see real results.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How do I maintain my resurfaced bathroom?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Use non-abrasive cleaners only &mdash; no Ajax, Jif, steel wool, or scouring pads. Standard bathroom cleaning products like spray-and-wipe are fine. Treat it like you would a new surface and it will last for years.</p></div></div>
            </div>
        </div>

        <!-- ═══════ MID-PAGE CTA ═══════ -->
        <div class="my-12 p-8 sm:p-10 bg-primary rounded-2xl text-center">
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">Still Have Questions?</h2>
            <p class="text-on-primary-container text-sm sm:text-base mb-6 max-w-lg mx-auto">Send us photos of your bathroom and we&rsquo;ll give you a free, no-obligation quote with answers to all your questions.</p>
            <a class="inline-block px-8 py-4 bg-white text-primary font-bold rounded-lg hover:shadow-xl transition-all" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Get Your Free Quote</a>
        </div>

        <!-- ───── MATERIALS & SAFETY ───── -->
        <div class="faq-category mb-12" data-cat="materials">
            <div class="flex items-center gap-3 mb-6">
                <span class="material-symbols-outlined text-2xl text-tertiary-fixed-dim" aria-hidden="true">science</span>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">Materials &amp; Safety</h2>
            </div>
            <div class="space-y-3">
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">What coatings do you use?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Commercial-grade two-part epoxy and acrylic urethane coatings. For bathtubs, we use the Hawk Glass-Tech system &mdash; a professional-only coating designed specifically for bath and shower surfaces. These are not the same as hardware store paints.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Is the process safe?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Yes. We use professional ventilation and extraction equipment throughout the process. All coatings are low-VOC and are completely food-safe once fully cured. You don&rsquo;t need to leave your home.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Do you check for asbestos?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">If your home was built before 1990, NSW regulations may require an asbestos assessment before any surface work. We&rsquo;ll advise you during the quoting process if a check is recommended for your property.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Are the coatings waterproof?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Yes. All coatings we apply are fully waterproof and moisture-resistant. They&rsquo;re specifically designed for wet areas like bathrooms, showers, and laundries.</p></div></div>
            </div>
        </div>

        <!-- ───── PROPERTY MANAGERS & RENTALS ───── -->
        <div class="faq-category mb-12" data-cat="property">
            <div class="flex items-center gap-3 mb-6">
                <span class="material-symbols-outlined text-2xl text-tertiary-fixed-dim" aria-hidden="true">apartment</span>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">Property Managers &amp; Rentals</h2>
            </div>
            <div class="space-y-3">
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Do you work with property managers?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Yes. We handle multi-unit turnovers, rental refreshes, and strata work across Sydney. We understand the urgency of rental properties and work to minimise vacancy time.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How fast can you turn around a rental property?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Most single-bathroom jobs are completed in one day. Multi-bathroom properties typically take 2&ndash;3 days. The bathroom is usable 24 hours after we finish &mdash; perfect for fast tenant turnovers.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Can you do multiple units?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Yes. We offer volume pricing for property managers with multiple units. Whether it&rsquo;s a small block or a large strata complex, we can schedule the work to suit your timeline.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Do tenants need to vacate?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Only during the work day. Tenants can stay in the property &mdash; they just can&rsquo;t use the bathroom being resurfaced until the next day. It&rsquo;s far less disruptive than a full renovation.</p></div></div>
            </div>
        </div>

        <!-- ───── WARRANTY & AFTERCARE ───── -->
        <div class="faq-category mb-12" data-cat="warranty">
            <div class="flex items-center gap-3 mb-6">
                <span class="material-symbols-outlined text-2xl text-tertiary-fixed-dim" aria-hidden="true">shield</span>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">Warranty &amp; Aftercare</h2>
            </div>
            <div class="space-y-3">
                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">What warranty do you provide?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Up to 3-year workmanship warranty covering peeling, bubbling, and adhesion failure under normal use. Warranty terms vary by service type &mdash; we confirm the exact coverage in your quote. Fully insured with public liability.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">What does the warranty cover?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Workmanship defects under normal use. This includes peeling, bubbling, and adhesion failure. If something goes wrong because of our work, we come back and fix it free of charge. The warranty does not cover damage from misuse, abrasive cleaners, or impact.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Can a resurfaced bath be resurfaced again?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Yes. After up to 10 years, when the original coating reaches the end of its life, the surface can be resurfaced again. It&rsquo;s a repeatable process &mdash; giving your bathroom another decade of life each time.</p></div></div>

                <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">What if I notice a problem after the job?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Contact us immediately. We take every issue seriously and will inspect the work promptly. If the problem is covered under warranty, we resolve it at no cost to you. Our goal is your complete satisfaction.</p></div></div>
            </div>
        </div>

    </div>
</section>

<!-- BOTTOM CTA -->
<section class="py-16 sm:py-20 bg-primary">
    <div class="max-w-3xl mx-auto px-6 sm:px-8 text-center">
        <span class="material-symbols-outlined text-5xl text-[#e7c08b] mb-4 block" style="font-variation-settings:'FILL' 1;" aria-hidden="true">verified</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tighter mb-4">Ready to Transform Your Bathroom?</h2>
        <p class="text-on-primary-container text-base sm:text-lg mb-8 max-w-xl mx-auto">Send us a few photos and get a free, fixed-price quote. No obligation, no hidden fees, no surprises.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a class="px-8 py-4 bg-white text-primary font-bold rounded-lg hover:shadow-xl transition-all" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Get Your Free Quote</a>
            <a class="px-8 py-4 bg-white/10 text-white font-bold rounded-lg border border-white/20 hover:bg-white/20 transition-all" href="tel:<?php echo timeless_phone_link(); ?>">Call <?php echo timeless_phone(); ?></a>
        </div>
    </div>
</section>

<!-- INLINE JS: Category filter + no-scrollbar utility -->
<style>.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}</style>
<script>
function showCategory(cat) {
    /* Update buttons */
    document.querySelectorAll('.faq-cat-btn').forEach(function(btn) {
        if (btn.getAttribute('data-cat') === cat) {
            btn.classList.add('active');
            btn.classList.remove('bg-surface-container-high', 'text-secondary');
            btn.classList.add('bg-primary', 'text-white');
        } else {
            btn.classList.remove('active');
            btn.classList.remove('bg-primary', 'text-white');
            btn.classList.add('bg-surface-container-high', 'text-secondary');
        }
    });

    /* Show/hide categories */
    document.querySelectorAll('.faq-category').forEach(function(section) {
        if (cat === 'all' || section.getAttribute('data-cat') === cat) {
            section.style.display = '';
        } else {
            section.style.display = 'none';
        }
    });

    /* Close any open FAQ items */
    document.querySelectorAll('.faq-item').forEach(function(item) {
        item.classList.remove('open');
    });

    /* Scroll to first visible category */
    if (cat !== 'all') {
        var target = document.querySelector('.faq-category[data-cat="' + cat + '"]');
        if (target) {
            setTimeout(function() {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
}
</script>

<?php get_footer(); ?>
