<?php /* Template Name: Vanity Refinishing Sydney */ ?>
<?php get_header(); ?>

<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Vanity Refinishing Sydney",
    "description": "Professional vanity refinishing service in Sydney. Benchtop resurfacing, cabinet resprays, and stone-fleck granite finishes with professional-grade coatings.",
    "provider": {
        "@type": "HomeAndConstructionBusiness",
        "name": "Timeless Resurfacing",
        "url": "https://timelessresurfacing.com.au",
        "telephone": "<?php echo timeless_phone_link(); ?>",
        "address": { "@type": "PostalAddress", "addressLocality": "Sydney", "addressRegion": "NSW", "addressCountry": "AU" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "47" }
    },
    "areaServed": { "@type": "City", "name": "Sydney" },
    "serviceType": "Vanity Refinishing"
}
</script>

<script type="application/ld+json">
{
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://timelessresurfacing.com.au/" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://timelessresurfacing.com.au/services/" },
        { "@type": "ListItem", "position": 3, "name": "Vanity Refinishing Sydney", "item": "https://timelessresurfacing.com.au/services/vanity-refinishing-sydney/" }
    ]
}
</script>

<script type="application/ld+json">
{
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "How much does vanity refinishing cost?", "acceptedAnswer": { "@type": "Answer", "text": "Every bathroom is different. We provide fixed-price quotes based on your photos — no hidden fees, no surprises. Send us photos for a quote within hours." } },
        { "@type": "Question", "name": "Can you respray any vanity cabinet?", "acceptedAnswer": { "@type": "Answer", "text": "Most solid timber, MDF, and melamine cabinets can be resprayed. We cannot respray if the laminate wrap is peeling — that indicates moisture-damaged MDF underneath." } },
        { "@type": "Question", "name": "What finishes are available?", "acceptedAnswer": { "@type": "Answer", "text": "Satin, semi-gloss, high-gloss, and stone-fleck (granite/marble look). 900+ colours available. White and grey are most popular." } },
        { "@type": "Question", "name": "How long does it last?", "acceptedAnswer": { "@type": "Answer", "text": "Benchtop resurfacing lasts 10-15 years. Cabinet respray with 2-pack polyurethane lasts 10+ years. Both are moisture and chemical resistant." } }
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
            <li class="text-primary font-medium">Vanity Refinishing Sydney</li>
        </ol>
    </nav>
</div>

<!-- HERO -->
<section class="pt-4 pb-16 sm:pb-20 bg-surface">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
            <span class="inline-block py-1 px-3 bg-tertiary-fixed-dim/30 text-primary text-[0.7rem] font-bold tracking-widest uppercase rounded mb-4">Service</span>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tighter leading-[0.95] mb-6">
                Vanity Refinishing <span class="text-on-primary-container">Sydney</span>
            </h1>
            <p class="text-base sm:text-lg text-secondary leading-relaxed max-w-xl mb-6">
                Tired-looking vanity dragging down your bathroom? We refinish benchtops, resurface vanity tops, and respray cabinets with professional-grade coatings. Transform your vanity in hours, not weeks &mdash; no replacement needed.
            </p>
            <div class="flex items-center gap-6 mb-8">
                <div class="text-center">
                    <p class="text-3xl font-extrabold text-primary">70%</p>
                    <p class="text-xs text-secondary">Save up to</p>
                </div>
                <div class="h-10 w-px bg-surface-container"></div>
                <div class="text-center">
                    <p class="text-3xl font-extrabold text-primary">3-6h</p>
                    <p class="text-xs text-secondary">Completion</p>
                </div>
                <div class="h-10 w-px bg-surface-container"></div>
                <div class="text-center">
                    <p class="text-3xl font-extrabold text-primary">2yr</p>
                    <p class="text-xs text-secondary">Warranty</p>
                </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-3">
                <a class="px-8 py-4 bg-primary text-white font-bold rounded-lg text-center hover:shadow-xl transition-all" href="#quote">Get a Free Quote</a>
                <a href="tel:<?php echo timeless_phone_link(); ?>" class="px-8 py-4 bg-surface-container-high text-primary font-bold rounded-lg text-center hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2"><span class="material-symbols-outlined text-lg" aria-hidden="true">call</span> Call Now</a>
            </div>
        </div>
        <div class="aspect-[4/3] bg-surface-container-highest rounded-xl overflow-hidden shadow-xl">
            <img class="w-full h-full object-cover" alt="Professional vanity refinishing in Sydney - modern resurfaced bathroom vanity benchtop and cabinets" src="<?php echo get_template_directory_uri(); ?>/images/services/vanity-refinishing/hero.jpg" loading="eager" width="800" height="600" />
        </div>
    </div>
</section>

<!-- TRUST BAR -->
<section class="bg-primary text-white py-4">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 flex flex-wrap justify-center sm:justify-between items-center gap-4">
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified_user</span><span class="text-xs font-bold">NSW Licence <?php echo timeless_licence(); ?></span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">security</span><span class="text-xs font-bold">$20M Insured</span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified</span><span class="text-xs font-bold">2-Year Warranty</span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">schedule</span><span class="text-xs font-bold">Same-Day Service</span></div>
    </div>
</section>

<!-- WHY REFINISH -->
<section class="py-16 sm:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <h2 class="text-3xl font-extrabold text-primary tracking-tighter mb-4">Why Refinish Your Vanity?</h2>
        <p class="text-secondary max-w-3xl mb-10">Your vanity is the centrepiece of the bathroom. When it looks dated, chipped, or worn, the whole room suffers &mdash; but replacing it is expensive and disruptive. Refinishing gives you a brand-new look at a fraction of the cost.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-surface-container-low rounded-xl p-6 reveal">
                <span class="material-symbols-outlined text-3xl text-error mb-3 block" aria-hidden="true">history</span>
                <h3 class="font-bold text-primary mb-2">Dated Look</h3>
                <p class="text-sm text-secondary leading-relaxed">90s oak, worn laminate, or yellowed surfaces make the vanity the weakest link. Refinishing modernises instantly.</p>
            </div>
            <div class="bg-surface-container-low rounded-xl p-6 reveal">
                <span class="material-symbols-outlined text-3xl text-error mb-3 block" aria-hidden="true">payments</span>
                <h3 class="font-bold text-primary mb-2">Cost of Replacement</h3>
                <p class="text-sm text-secondary leading-relaxed">New vanity + installation + plumbing = $2,000&ndash;$5,000. Refinishing achieves a like-new look for a fraction.</p>
            </div>
            <div class="bg-surface-container-low rounded-xl p-6 reveal">
                <span class="material-symbols-outlined text-3xl text-error mb-3 block" aria-hidden="true">broken_image</span>
                <h3 class="font-bold text-primary mb-2">Chip &amp; Scratch Repair</h3>
                <p class="text-sm text-secondary leading-relaxed">Dropped items, daily wear, and moisture damage vanity surfaces. We repair and refinish in one visit.</p>
            </div>
            <div class="bg-surface-container-low rounded-xl p-6 reveal">
                <span class="material-symbols-outlined text-3xl text-error mb-3 block" aria-hidden="true">diamond</span>
                <h3 class="font-bold text-primary mb-2">Stone-Fleck Upgrade</h3>
                <p class="text-sm text-secondary leading-relaxed">Want a granite or marble look? Our Hawk StoneFlecks system creates stunning multi-colour finishes on any surface.</p>
            </div>
        </div>
    </div>
</section>

<!-- OUR PROCESS -->
<section class="py-16 sm:py-20 bg-surface-container-low">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <h2 class="text-3xl font-extrabold text-primary tracking-tighter mb-4">How We Refinish Your Vanity</h2>
        <p class="text-secondary max-w-3xl mb-10">Our 4-step process delivers a durable, factory-quality finish. No mess, no fuss.</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white rounded-xl p-6 text-center reveal">
                <div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold mx-auto mb-4">1</div>
                <h3 class="font-bold text-primary text-sm mb-2">Prep &amp; Clean</h3>
                <p class="text-xs text-secondary">Degrease, sand, and prepare all surfaces. Remove hardware if needed.</p>
            </div>
            <div class="bg-white rounded-xl p-6 text-center reveal">
                <div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold mx-auto mb-4">2</div>
                <h3 class="font-bold text-primary text-sm mb-2">Prime</h3>
                <p class="text-xs text-secondary">Hawk Ultra-Grip 4000 epoxy primer for benchtops. 2-pack primer for cabinets.</p>
            </div>
            <div class="bg-white rounded-xl p-6 text-center reveal">
                <div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold mx-auto mb-4">3</div>
                <h3 class="font-bold text-primary text-sm mb-2">Coat</h3>
                <p class="text-xs text-secondary">Hawk Glass-Tech or Countercote for benchtops. 2-pack polyurethane spray for cabinets.</p>
            </div>
            <div class="bg-white rounded-xl p-6 text-center reveal">
                <div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold mx-auto mb-4">4</div>
                <h3 class="font-bold text-primary text-sm mb-2">Cure</h3>
                <p class="text-xs text-secondary">Dry to touch in 2-4 hours. Full cure 24-48 hours. Reattach hardware.</p>
            </div>
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
                <h3 class="font-bold text-primary mb-2">Save Up to 70%</h3>
                <p class="text-sm text-secondary leading-relaxed">A fraction of the cost of full renovation. No demolition, no plumber, no weeks of disruption.</p>
            </div>
            <div class="bg-surface-container-low rounded-xl p-8 text-center border-2 border-surface-container">
                <span class="material-symbols-outlined text-3xl text-primary mb-3 block" aria-hidden="true">verified_user</span>
                <h3 class="font-bold text-primary mb-2">2-Year Warranty</h3>
                <p class="text-sm text-secondary leading-relaxed">Every job backed by our workmanship warranty. $20M public liability insured. NSW licensed.</p>
            </div>
        </div>

        <div class="text-center mt-8"><a class="px-8 py-4 bg-primary text-white font-bold rounded-lg hover:shadow-xl transition-all inline-block" href="#quote">Get a Free Quote</a></div>
    </div>
</section>

<!-- FAQ -->
<section class="py-16 sm:py-20 bg-surface-container-low" id="faqs">
    <div class="max-w-3xl mx-auto px-6 sm:px-8">
        <h2 class="text-3xl font-extrabold text-primary tracking-tighter mb-4 text-center">Vanity Refinishing FAQs</h2>
        <p class="text-secondary text-center mb-10">Common questions about vanity refinishing in Sydney.</p>

        <div class="space-y-3">
            <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How much does vanity refinishing cost?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Every bathroom is different. We provide fixed-price quotes based on your photos &mdash; no hidden fees, no surprises. Send us photos for a quote within hours.</p></div></div>

            <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Can you respray any vanity cabinet?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Most solid timber, MDF, and melamine cabinets can be resprayed. We cannot respray if the laminate wrap is peeling &mdash; that indicates moisture-damaged MDF underneath.</p></div></div>

            <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">What finishes are available?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Satin, semi-gloss, high-gloss, and stone-fleck (granite/marble look). 900+ colours available. White and grey are most popular.</p></div></div>

            <div class="faq-item border border-surface-container rounded-xl bg-white"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How long does it last?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Benchtop resurfacing lasts 10-15 years. Cabinet respray with 2-pack polyurethane lasts 10+ years. Both are moisture and chemical resistant.</p></div></div>
        </div>
    </div>
</section>

<!-- QUOTE FORM -->
<section class="py-16 sm:py-20 bg-white" id="quote">
    <div class="max-w-4xl mx-auto px-6 sm:px-8">
        <div class="bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div class="p-6 sm:p-8 lg:p-12 bg-primary text-white">
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Get Your Free Vanity Refinishing Quote</h2>
                <p class="text-on-primary-container text-sm">5 minutes. No obligation. Fixed pricing guaranteed.</p>
            </div>
            <form class="timeless-quote-form p-6 sm:p-8 lg:p-12 space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label for="name" class="text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Full Name *</label><input id="name" name="name" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="John Citizen" required /></div>
                    <div><label for="phone" class="text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Phone *</label><input id="phone" name="phone" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="0400 000 000" type="tel" required /></div>
                </div>
                <div><label for="address" class="text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Suburb *</label><input id="address" name="address" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. Parramatta, Bondi, Surry Hills" required /></div>
                <div>
                    <label class="text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">What do you need?</label>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" checked /> Vanity benchtop</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Vanity cabinet (doors &amp; drawers)</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Both benchtop + cabinet</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Stone-fleck granite finish</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Chip/scratch repair only</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Laminate benchtop</label>
                    </div>
                </div>
                <div><label for="notes" class="text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Anything else?</label><textarea id="notes" name="notes" rows="3" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="e.g. colour preference, vanity material, number of cabinets..."></textarea></div>
                <button class="w-full py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2" type="submit">Get My Free Vanity Quote <span class="material-symbols-outlined" aria-hidden="true">send</span></button>
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
            <a href="<?php echo esc_url( home_url( '/services/shower-regrouting-sydney/' ) ); ?>" class="bg-white rounded-xl p-6 hover:shadow-md transition-all group">
                <span class="material-symbols-outlined text-2xl text-primary mb-2 block" aria-hidden="true">shower</span>
                <h3 class="font-bold text-primary text-sm group-hover:text-on-primary-container transition-colors">Shower Regrouting</h3>
                <p class="text-xs text-secondary mt-1">Stop leaks and mould</p>
            </a>
            <a href="<?php echo esc_url( home_url( '/services/bath-resurfacing-sydney/' ) ); ?>" class="bg-white rounded-xl p-6 hover:shadow-md transition-all group">
                <span class="material-symbols-outlined text-2xl text-primary mb-2 block" aria-hidden="true">bathtub</span>
                <h3 class="font-bold text-primary text-sm group-hover:text-on-primary-container transition-colors">Bath Resurfacing</h3>
                <p class="text-xs text-secondary mt-1">Restore your bathtub like new</p>
            </a>
            <a href="<?php echo esc_url( home_url( '/services/tile-resurfacing-sydney/' ) ); ?>" class="bg-white rounded-xl p-6 hover:shadow-md transition-all group">
                <span class="material-symbols-outlined text-2xl text-primary mb-2 block" aria-hidden="true">grid_view</span>
                <h3 class="font-bold text-primary text-sm group-hover:text-on-primary-container transition-colors">Tile Resurfacing</h3>
                <p class="text-xs text-secondary mt-1">New look without retiling</p>
            </a>
            <a href="<?php echo esc_url( home_url( '/services/basin-restoration-sydney/' ) ); ?>" class="bg-white rounded-xl p-6 hover:shadow-md transition-all group">
                <span class="material-symbols-outlined text-2xl text-primary mb-2 block" aria-hidden="true">faucet</span>
                <h3 class="font-bold text-primary text-sm group-hover:text-on-primary-container transition-colors">Basin Restoration</h3>
                <p class="text-xs text-secondary mt-1">Refinish chips and stains</p>
            </a>
        </div>
    </div>
</section>

</main>

<?php get_footer(); ?>
