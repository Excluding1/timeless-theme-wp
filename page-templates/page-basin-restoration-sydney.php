<?php /* Template Name: Basin Restoration Sydney */ ?>
<?php get_header(); ?>

<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Basin Restoration Sydney",
    "description": "Professional basin restoration service in Sydney. Chip repair, stain removal, and full resurface for porcelain, acrylic, and cast iron basins to like-new condition.",
    "provider": {
        "@type": "HomeAndConstructionBusiness",
        "name": "Timeless Resurfacing",
        "url": "https://timelessresurfacing.com.au",
        "telephone": "<?php echo timeless_phone_link(); ?>",
        "address": { "@type": "PostalAddress", "addressLocality": "Sydney", "addressRegion": "NSW", "addressCountry": "AU" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "23" }
    },
    "areaServed": { "@type": "City", "name": "Sydney" },
    "serviceType": "Basin Restoration"
}
</script>

<script type="application/ld+json">
{
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://timelessresurfacing.com.au/" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://timelessresurfacing.com.au/services/" },
        { "@type": "ListItem", "position": 3, "name": "Basin Restoration Sydney", "item": "https://timelessresurfacing.com.au/services/basin-restoration-sydney/" }
    ]
}
</script>

<script type="application/ld+json">
{
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "How much does basin restoration cost in Sydney?", "acceptedAnswer": { "@type": "Answer", "text": "Every bathroom is different. We provide fixed-price quotes based on your photos — no hidden fees, no surprises. Send us photos for a quote within hours." } },
        { "@type": "Question", "name": "How long does basin restoration take?", "acceptedAnswer": { "@type": "Answer", "text": "Chip repair takes around 30 minutes. Full basin resurface takes 1.75–3 hours. Best combined with other bathroom work for efficiency." } },
        { "@type": "Question", "name": "What basins can you restore?", "acceptedAnswer": { "@type": "Answer", "text": "We restore porcelain, acrylic, cast iron, and ceramic basins. We cannot do glass or vessel basins." } },
        { "@type": "Question", "name": "Is standalone basin restoration worth it?", "acceptedAnswer": { "@type": "Answer", "text": "We recommend booking basin as an add-on to shower or bath work for best value. Standalone is available but the sub mobilisation cost is the same either way." } }
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
            <li class="text-primary font-medium">Basin Restoration Sydney</li>
        </ol>
    </nav>
</div>

<!-- HERO -->
<section class="pt-4 pb-16 sm:pb-20 bg-surface">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
            <span class="inline-block py-1 px-3 bg-tertiary-fixed-dim/30 text-primary text-[0.7rem] font-bold tracking-widest uppercase rounded mb-4">Service</span>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tighter leading-[0.95] mb-6">
                Basin Restoration <span class="text-on-primary-container">Sydney</span>
            </h1>
            <p class="text-base sm:text-lg text-secondary leading-relaxed max-w-xl mb-6">
                Chipped, stained, or worn basin? From quick chip repairs to full resurface, we restore porcelain, acrylic, and cast iron basins to like-new condition. Best value when combined with other bathroom work.
            </p>
            <div class="grid grid-cols-3 gap-3 sm:flex sm:items-center sm:gap-6 mb-8">
                <div class="text-center">
                    <p class="text-base sm:text-3xl font-extrabold text-primary whitespace-nowrap">80–90%</p>
                    <p class="text-xs text-secondary">Cheaper than new</p>
                </div>
                <div class="hidden sm:block h-10 w-px bg-surface-container"></div>
                <div class="text-center">
                    <p class="text-base sm:text-3xl font-extrabold text-primary whitespace-nowrap">1-3h</p>
                    <p class="text-xs text-secondary">Quick turnaround</p>
                </div>
                <div class="hidden sm:block h-10 w-px bg-surface-container"></div>
                <div class="text-center">
                    <p class="text-base sm:text-3xl font-extrabold text-primary whitespace-nowrap">3yr</p>
                    <p class="text-xs text-secondary">Resurface warranty</p>
                </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-3">
                <a class="px-8 py-4 bg-primary text-white font-bold rounded-lg text-center hover:shadow-xl transition-all" href="#quote">Get Your Free Quote</a>
                <a href="tel:<?php echo timeless_phone_link(); ?>" class="px-8 py-4 bg-surface-container-high text-primary font-bold rounded-lg text-center hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2"><span class="material-symbols-outlined text-lg" aria-hidden="true">call</span> Call Now</a>
            </div>
        </div>
        <div class="aspect-[4/3] bg-surface-container-highest rounded-xl overflow-hidden shadow-xl">
            <img class="w-full h-full object-cover" alt="Professional basin restoration in Sydney - technician resurfacing a porcelain basin to like-new condition" src="<?php echo get_template_directory_uri(); ?>/images/services/basin-restoration/hero.jpg" loading="eager" width="800" height="600" />
        </div>
    </div>
</section>

<!-- TRUST BAR -->
<section class="bg-primary text-white py-4">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 flex flex-wrap justify-center sm:justify-between items-center gap-4">
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified_user</span><span class="text-xs font-bold">Experienced &amp; Insured</span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">security</span><span class="text-xs font-bold">Public Liability Insured</span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified</span><span class="text-xs font-bold">3-Year Warranty</span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">schedule</span><span class="text-xs font-bold">Same-Day Service</span></div>
    </div>
</section>

<!-- WHY RESTORE -->
<section class="py-16 sm:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <h2 class="text-3xl font-extrabold text-primary tracking-tighter mb-4">Why Restore Your Basin</h2>
        <p class="text-secondary max-w-3xl mb-10">A chipped or stained basin doesn't just look bad &mdash; it can harbour bacteria and reduce your bathroom's appeal. Restoration is faster, cheaper, and less disruptive than replacement.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-surface-container-low rounded-xl p-6 reveal">
                <span class="material-symbols-outlined text-3xl text-error mb-3 block" aria-hidden="true">coronavirus</span>
                <h3 class="font-bold text-primary mb-2">Chips Trap Bacteria</h3>
                <p class="text-sm text-secondary leading-relaxed">Chipped basins harbour bacteria and look terrible. Quick repair fixes it in under an hour.</p>
            </div>
            <div class="bg-surface-container-low rounded-xl p-6 reveal">
                <span class="material-symbols-outlined text-3xl text-error mb-3 block" aria-hidden="true">add_circle</span>
                <h3 class="font-bold text-primary mb-2">Best as Add-On</h3>
                <p class="text-sm text-secondary leading-relaxed">Basin restoration offers the best value when done alongside bath or shower work. Sub reuses open materials.</p>
            </div>
            <div class="bg-surface-container-low rounded-xl p-6 reveal">
                <span class="material-symbols-outlined text-3xl text-error mb-3 block" aria-hidden="true">water_drop</span>
                <h3 class="font-bold text-primary mb-2">Stain Removal</h3>
                <p class="text-sm text-secondary leading-relaxed">Hard water, rust, and chemical stains removed with professional polish and treatment.</p>
            </div>
            <div class="bg-surface-container-low rounded-xl p-6 reveal">
                <span class="material-symbols-outlined text-3xl text-error mb-3 block" aria-hidden="true">savings</span>
                <h3 class="font-bold text-primary mb-2">Cheaper Than Replacing</h3>
                <p class="text-sm text-secondary leading-relaxed">New basin + plumber = $500&ndash;$1,500. Restoration achieves the same result for a fraction of the cost.</p>
            </div>
        </div>
    </div>
</section>

<!-- OUR PROCESS -->
<section class="py-16 sm:py-20 bg-surface-container-low">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <h2 class="text-3xl font-extrabold text-primary tracking-tighter mb-4">How We Restore Your Basin</h2>
        <p class="text-secondary max-w-3xl mb-10">Same proven 5-step Hawk system as bath resurfacing, simplified for basins. Professional results every time.</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div class="bg-white rounded-xl p-6 text-center reveal">
                <div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold mx-auto mb-4">1</div>
                <h3 class="font-bold text-primary text-sm mb-2">Assessment</h3>
                <p class="text-xs text-secondary">Inspect basin condition, identify chips, stains, and surface damage.</p>
            </div>
            <div class="bg-white rounded-xl p-6 text-center reveal">
                <div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold mx-auto mb-4">2</div>
                <h3 class="font-bold text-primary text-sm mb-2">Clean &amp; Prep</h3>
                <p class="text-xs text-secondary">Deep clean, degrease, and sand the surface to ensure optimal coating adhesion.</p>
            </div>
            <div class="bg-white rounded-xl p-6 text-center reveal">
                <div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold mx-auto mb-4">3</div>
                <h3 class="font-bold text-primary text-sm mb-2">Chip Repair</h3>
                <p class="text-xs text-secondary">Fill and shape any chips or cracks with specialist filler compound.</p>
            </div>
            <div class="bg-white rounded-xl p-6 text-center reveal">
                <div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold mx-auto mb-4">4</div>
                <h3 class="font-bold text-primary text-sm mb-2">Resurface</h3>
                <p class="text-xs text-secondary">Apply premium Hawk coating system for a smooth, glossy, durable finish.</p>
            </div>
            <div class="bg-white rounded-xl p-6 text-center reveal">
                <div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold mx-auto mb-4">5</div>
                <h3 class="font-bold text-primary text-sm mb-2">Final Cure</h3>
                <p class="text-xs text-secondary">Quality check and cure. Basin ready to use within 24 hours.</p>
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
                <h3 class="font-bold text-primary mb-2">Same-Day Service</h3>
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

<!-- FAQ -->
<section class="py-16 sm:py-20 bg-surface-container-low" id="faqs">
    <div class="max-w-3xl mx-auto px-6 sm:px-8">
        <h2 class="text-3xl font-extrabold text-primary tracking-tighter mb-4 text-center">Basin Restoration FAQs</h2>
        <p class="text-secondary text-center mb-10">Common questions about basin restoration in Sydney.</p>

        <div class="space-y-3">
            <div class="faq-item border border-surface-container rounded-xl"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How much does basin restoration cost?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Every bathroom is different. We provide fixed-price quotes based on your photos &mdash; no hidden fees, no surprises. Send us photos for a quote within hours.</p></div></div>

            <div class="faq-item border border-surface-container rounded-xl"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How long does basin restoration take?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Chip repair takes about 30 minutes. Full resurface takes 1.75&ndash;3 hours. Best combined with other bathroom work for efficiency and value.</p></div></div>

            <div class="faq-item border border-surface-container rounded-xl"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">What basins can you restore?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">We restore porcelain, acrylic, cast iron, and ceramic basins. We cannot do glass or vessel basins.</p></div></div>

            <div class="faq-item border border-surface-container rounded-xl"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Is standalone basin restoration worth it?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">We recommend booking basin as an add-on to shower or bath work for best value. Standalone is available but the sub mobilisation cost is the same either way &mdash; so you get better value bundling it with other bathroom work.</p></div></div>
        </div>
    </div>
</section>

<!-- QUOTE FORM -->
<section class="py-16 sm:py-20 bg-white" id="quote">
    <div class="max-w-4xl mx-auto px-6 sm:px-8">
        <div class="bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div class="p-6 sm:p-8 lg:p-12 bg-primary text-white">
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Get Your Free Basin Quote</h2>
                <p class="text-on-primary-container text-sm">5 minutes. No obligation. Fixed pricing guaranteed.</p>
            </div>
            <form class="timeless-quote-form p-6 sm:p-8 lg:p-12 space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label for="name" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Full Name *</label><input id="name" name="name" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="John Citizen" required /></div>
                    <div><label for="phone" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Phone *</label><input id="phone" name="phone" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="0400 000 000" type="tel" required /></div>
                </div>
                <div><label for="address" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Suburb *</label><input id="address" name="address" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. Parramatta, Bondi, Surry Hills" required /></div>
                <div>
                    <label class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">What do you need?</label>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" checked /> Single basin</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Double basin</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Chip repair</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Stain removal</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Basin + bath combo</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Basin + shower combo</label>
                    </div>
                </div>
                <div><label for="notes" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Anything else?</label><textarea id="notes" name="notes" rows="3" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="e.g. basin has chips, rust stains, surface is rough, want to match colour..."></textarea></div>
                <button class="w-full py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2" type="submit">Get My Free Basin Quote <span class="material-symbols-outlined" aria-hidden="true">send</span></button>
                <p class="text-center text-[0.6rem] text-secondary">We respond within hours. No spam, ever.</p>
            </form>
        </div>
    </div>
</section>

<!-- OTHER SERVICES -->
<section class="py-16 bg-surface-container-low">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <h2 class="text-2xl font-extrabold text-primary tracking-tighter mb-8">Other Services You Might Need</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="<?php echo esc_url( home_url( '/services/bath-resurfacing-sydney/' ) ); ?>" class="bg-white rounded-xl p-6 hover:shadow-md transition-all group">
                <span class="material-symbols-outlined text-2xl text-primary mb-2 block" aria-hidden="true">bathtub</span>
                <h3 class="font-bold text-primary text-sm group-hover:text-on-primary-container transition-colors">Bath Resurfacing</h3>
                <p class="text-xs text-secondary mt-1">Restore your bathtub like new</p>
            </a>
            <a href="<?php echo esc_url( home_url( '/services/shower-regrouting-sydney/' ) ); ?>" class="bg-white rounded-xl p-6 hover:shadow-md transition-all group">
                <span class="material-symbols-outlined text-2xl text-primary mb-2 block" aria-hidden="true">shower</span>
                <h3 class="font-bold text-primary text-sm group-hover:text-on-primary-container transition-colors">Shower Regrouting</h3>
                <p class="text-xs text-secondary mt-1">Stop leaks and mould</p>
            </a>
            <a href="<?php echo esc_url( home_url( '/services/tile-resurfacing-sydney/' ) ); ?>" class="bg-white rounded-xl p-6 hover:shadow-md transition-all group">
                <span class="material-symbols-outlined text-2xl text-primary mb-2 block" aria-hidden="true">grid_view</span>
                <h3 class="font-bold text-primary text-sm group-hover:text-on-primary-container transition-colors">Tile Resurfacing</h3>
                <p class="text-xs text-secondary mt-1">New look without retiling</p>
            </a>
            <a href="<?php echo esc_url( home_url( '/services/shower-leak-repair-sydney/' ) ); ?>" class="bg-white rounded-xl p-6 hover:shadow-md transition-all group">
                <span class="material-symbols-outlined text-2xl text-primary mb-2 block" aria-hidden="true">water_damage</span>
                <h3 class="font-bold text-primary text-sm group-hover:text-on-primary-container transition-colors">Shower Sealing</h3>
                <p class="text-xs text-secondary mt-1">Stop leaks without demolition</p>
            </a>
        </div>
    </div>
</section>

</main>

<?php get_footer(); ?>
