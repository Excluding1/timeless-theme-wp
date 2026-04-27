<?php /* Template Name: About */ ?>
<?php get_header(); ?>

<!-- Schema: AboutPage -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Timeless Resurfacing",
    "description": "Learn about Timeless Resurfacing — two Sydney locals transforming bathrooms across NSW with professional resurfacing and regrouting.",
    "url": "<?php echo esc_url( home_url( '/about/' ) ); ?>",
    "mainEntity": {
        "@type": "HomeAndConstructionBusiness",
        "name": "Timeless Resurfacing",
        "description": "Sydney's specialist bathroom resurfacing and shower regrouting service.",
        "url": "https://timelessresurfacing.com.au",
        "telephone": "<?php echo timeless_phone_link(); ?>",
        "email": "info@timelessresurfacing.com.au",
        "address": { "@type": "PostalAddress", "addressLocality": "Sydney", "addressRegion": "NSW", "addressCountry": "AU" },
        "areaServed": [
            { "@type": "City", "name": "Sydney" },
            { "@type": "City", "name": "Wollongong" },
            { "@type": "City", "name": "Central Coast" },
            { "@type": "City", "name": "Blue Mountains" }
        ],
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "23", "bestRating": "5" }
    }
}
</script>

<main id="main-content">

<!-- BREADCRUMB -->
<div class="pt-24 pb-2 bg-surface-container-low">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <nav aria-label="Breadcrumb" class="text-xs text-secondary">
            <ol class="flex items-center gap-2">
                <li><a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="hover:text-primary transition-colors">Home</a></li>
                <li><span class="material-symbols-outlined text-xs align-middle" aria-hidden="true">chevron_right</span></li>
                <li class="font-bold text-primary">About Us</li>
            </ol>
        </nav>
    </div>
</div>

<!-- HERO — Asymmetric layout -->
<section class="relative min-h-[600px] flex items-center bg-surface-container-low px-6 sm:px-8 lg:px-24 py-16 sm:py-20 overflow-hidden">
    <div class="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div class="lg:col-span-7 z-10 reveal">
            <span class="inline-block px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[0.7rem] font-bold tracking-[0.15em] uppercase mb-6 rounded-xs">About Us</span>
            <h1 class="text-4xl sm:text-5xl lg:text-[4rem] font-extrabold text-primary leading-[1.05] tracking-tighter mb-6">
                Beautiful Bathrooms <br/><span class="text-on-primary-container">Shouldn't Cost a Fortune.</span>
            </h1>
            <p class="text-lg sm:text-xl text-secondary max-w-xl leading-relaxed mb-8">
                We kept seeing Sydney homeowners quoted $25,000&ndash;$50,000 to renovate bathrooms that just needed resurfacing. So we built a better option.
            </p>
            <div class="flex flex-wrap gap-4">
                <a class="bg-primary text-white px-8 py-4 rounded-lg font-bold text-sm tracking-wide shadow-lg hover:shadow-primary/20 transition-all" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Get a Free Quote</a>
                <a class="bg-surface-container-high text-primary px-8 py-4 rounded-lg font-bold text-sm hover:bg-surface-container-highest transition-all" href="<?php echo esc_url( home_url( '/#services' ) ); ?>">View Our Services</a>
            </div>
        </div>
        <div class="lg:col-span-5 relative reveal">
            <div class="aspect-4/5 rounded-xl overflow-hidden shadow-2xl border-10 border-white">
                <img class="w-full h-full object-cover" alt="Timeless Resurfacing professional bathroom transformation in Sydney" src="<?php echo get_template_directory_uri(); ?>/images/about/bathroom.jpg" loading="eager" width="600" height="750" />
            </div>
        </div>
    </div>
</section>

<!-- OUR STORY — Two-column with stat boxes -->
<section class="py-20 sm:py-28 bg-surface">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div class="reveal">
                <h2 class="text-3xl sm:text-4xl font-extrabold text-primary mb-8 tracking-tight">Why We Started <br/>Timeless Resurfacing</h2>
                <div class="space-y-5 text-base sm:text-lg text-secondary leading-relaxed">
                    <p>We kept seeing the same story play out across Sydney. Homeowners with perfectly good bathrooms &mdash; solid structure, functional plumbing &mdash; were being quoted $25,000 to $50,000 for full gut-and-replace renovations. All because the tiles looked dated or the bathtub had a few chips.</p>
                    <p>We knew there was a better way. Resurfacing technology had come a long way, and we saw an opportunity to give Sydney homeowners a professional, affordable alternative &mdash; one that could transform a tired bathroom <span class="text-primary font-bold">in a single day</span> instead of weeks.</p>
                    <p>So we built Timeless Resurfacing around three things: the best coatings available, a network of quality tradespeople, and a customer experience that actually respects your time and money.</p>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-5 reveal">
                <div class="bg-surface-container-low p-7 rounded-xl border-l-4 border-tertiary-fixed-dim">
                    <span class="material-symbols-outlined text-3xl text-primary mb-3 block" aria-hidden="true">schedule</span>
                    <h4 class="font-bold text-primary text-lg mb-2">Done in a Day</h4>
                    <p class="text-sm text-secondary leading-relaxed">Most bathrooms completed in a single day. Ready to use again the next morning.</p>
                </div>
                <div class="bg-primary-container p-7 rounded-xl">
                    <span class="material-symbols-outlined text-3xl text-tertiary-fixed-dim mb-3 block" aria-hidden="true">savings</span>
                    <h4 class="font-bold text-white text-lg mb-2">Save up to 80%</h4>
                    <p class="text-sm text-on-primary-container leading-relaxed">A fraction of the cost of a full renovation. No demolition, no plumber, no weeks of disruption.</p>
                </div>
                <div class="bg-surface-container-low p-7 rounded-xl border-l-4 border-tertiary-fixed-dim">
                    <span class="material-symbols-outlined text-3xl text-primary mb-3 block" aria-hidden="true">workspace_premium</span>
                    <h4 class="font-bold text-primary text-lg mb-2">Premium Coatings</h4>
                    <p class="text-sm text-secondary leading-relaxed">professional-grade system &mdash; commercial-grade coatings that last 10&ndash;15 years.</p>
                </div>
                <div class="bg-primary-container p-7 rounded-xl">
                    <span class="material-symbols-outlined text-3xl text-tertiary-fixed-dim mb-3 block" aria-hidden="true">verified_user</span>
                    <h4 class="font-bold text-white text-lg mb-2">Fully Backed</h4>
                    <p class="text-sm text-on-primary-container leading-relaxed">Workmanship warranty. Public liability insured. Qualified &amp; insured.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- WHAT WE STAND FOR — Bento values grid -->
<section class="py-20 sm:py-28 bg-surface-container-low">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div class="mb-14 text-center max-w-2xl mx-auto">
            <h2 class="text-3xl sm:text-4xl font-extrabold text-primary mb-4 tracking-tight">What We Stand For</h2>
            <p class="text-secondary">The principles behind every bathroom we transform.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white p-8 sm:p-10 rounded-xl shadow-xs border-b-4 border-primary reveal">
                <h3 class="text-xl font-bold text-primary mb-4 flex items-center gap-3">
                    <span class="material-symbols-outlined text-primary" aria-hidden="true">payments</span>
                    Honest, Fixed-Price Quotes
                </h3>
                <p class="text-secondary leading-relaxed">Send us photos, get a price. That's it. No call-out fees, no hourly rates, no "we'll see when we get there." The quote you get is the price you pay.</p>
            </div>
            <div class="bg-white p-8 sm:p-10 rounded-xl shadow-xs border-b-4 border-primary reveal">
                <h3 class="text-xl font-bold text-primary mb-4 flex items-center gap-3">
                    <span class="material-symbols-outlined text-primary" aria-hidden="true">handshake</span>
                    Respect Your Time
                </h3>
                <p class="text-secondary leading-relaxed">We show up when we say we will. Most jobs are done in one day. No demolition, no construction waste, no tradies in your house for weeks on end.</p>
            </div>
            <div class="bg-white p-8 sm:p-10 rounded-xl shadow-xs border-b-4 border-primary reveal">
                <h3 class="text-xl font-bold text-primary mb-4 flex items-center gap-3">
                    <span class="material-symbols-outlined text-primary" aria-hidden="true">shield</span>
                    Stand Behind Our Work
                </h3>
                <p class="text-secondary leading-relaxed">Every job is warranty-backed and fully insured. We operate with full public liability insurance and comply with all NSW regulations.</p>
            </div>
        </div>
    </div>
</section>

<!-- HOW WE WORK — Compliance + trust -->
<section class="py-20 sm:py-28 bg-surface overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div class="flex flex-col lg:flex-row gap-16 lg:gap-20">
            <div class="lg:w-1/2 reveal">
                <h2 class="text-3xl sm:text-4xl font-extrabold text-primary mb-8 tracking-tight">How We Work</h2>
                <p class="text-lg text-secondary mb-8 leading-relaxed">
                    We coordinate a network of experienced, vetted resurfacing professionals across Sydney, the Central Coast, and Wollongong. Every job follows the same quality process &mdash; from the initial photo quote through to final inspection and warranty sign-off.
                </p>
                <div class="space-y-4 mb-10">
                    <div class="flex items-center gap-4 text-primary font-bold">
                        <span class="material-symbols-outlined text-tertiary-fixed-dim" style="font-variation-settings: 'FILL' 1;" aria-hidden="true">check_circle</span>
                        Photo-based quoting &mdash; fast, accurate, no obligation
                    </div>
                    <div class="flex items-center gap-4 text-primary font-bold">
                        <span class="material-symbols-outlined text-tertiary-fixed-dim" style="font-variation-settings: 'FILL' 1;" aria-hidden="true">check_circle</span>
                        Vetted, experienced resurfacing professionals
                    </div>
                    <div class="flex items-center gap-4 text-primary font-bold">
                        <span class="material-symbols-outlined text-tertiary-fixed-dim" style="font-variation-settings: 'FILL' 1;" aria-hidden="true">check_circle</span>
                        Sydney, Wollongong &amp; Central Coast coverage
                    </div>
                    <div class="flex items-center gap-4 text-primary font-bold">
                        <span class="material-symbols-outlined text-tertiary-fixed-dim" style="font-variation-settings: 'FILL' 1;" aria-hidden="true">check_circle</span>
                        Same communication channel from quote to completion
                    </div>
                </div>
                <div class="p-5 bg-surface-container-low rounded-lg inline-flex items-center gap-4">
                    <span class="material-symbols-outlined text-3xl text-primary" aria-hidden="true">gavel</span>
                    <div>
                        <p class="text-[0.65rem] font-bold tracking-widest text-secondary uppercase">Insured &amp; Compliant</p>
                        <p class="text-sm font-bold text-primary">Fully Insured &middot; Warranty on Every Job</p>
                    </div>
                </div>
            </div>
            <div class="lg:w-1/2 reveal">
                <div class="grid grid-cols-2 gap-4">
                    <img class="rounded-lg shadow-lg mt-12 w-full h-auto aspect-3/4 object-cover" alt="Professional bathroom resurfacing result" src="<?php echo get_template_directory_uri(); ?>/images/about/bathroom-3.jpg" loading="lazy" width="400" height="533" />
                    <img class="rounded-lg shadow-lg w-full h-auto aspect-3/4 object-cover" alt="Beautiful bathroom after professional resurfacing" src="<?php echo get_template_directory_uri(); ?>/images/about/bathroom-2.jpg" loading="lazy" width="400" height="533" />
                </div>
            </div>
        </div>
    </div>
</section>

<!-- STATS BAR -->
<section class="py-16 sm:py-20 bg-primary text-white">
    <div class="max-w-5xl mx-auto px-6 sm:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div class="reveal">
                <p class="text-4xl sm:text-5xl font-extrabold tracking-tighter mb-2">4.9<span class="text-tertiary-fixed-dim">&#9733;</span></p>
                <p class="text-xs sm:text-sm font-bold text-on-primary-container uppercase tracking-widest">Google Rating</p>
            </div>
            <div class="reveal">
                <p class="text-4xl sm:text-5xl font-extrabold tracking-tighter mb-2">3<span class="text-tertiary-fixed-dim">yr</span></p>
                <p class="text-xs sm:text-sm font-bold text-on-primary-container uppercase tracking-widest">Up to 3-Year Warranty</p>
            </div>
            <div class="reveal">
                <p class="text-4xl sm:text-5xl font-extrabold tracking-tighter mb-2">$20<span class="text-tertiary-fixed-dim">M</span></p>
                <p class="text-xs sm:text-sm font-bold text-on-primary-container uppercase tracking-widest">Public Liability Insurance</p>
            </div>
            <div class="reveal">
                <p class="text-4xl sm:text-5xl font-extrabold tracking-tighter mb-2">6<span class="text-tertiary-fixed-dim"> Days</span></p>
                <p class="text-xs sm:text-sm font-bold text-on-primary-container uppercase tracking-widest">A Week Service</p>
            </div>
        </div>
    </div>
</section>

<!-- GOOGLE REVIEWS — Auto-updating via Trustindex -->
<section class="py-16 sm:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="text-center mb-10">
            <h2 class="text-3xl font-extrabold text-primary tracking-tighter mb-3">What Our Customers Say</h2>
            <div class="flex items-center justify-center gap-2"><div class="flex text-amber-400 text-lg">&#9733;&#9733;&#9733;&#9733;&#9733;</div><span class="text-sm font-bold text-primary">4.9</span><span class="text-xs text-secondary">Google Rating</span></div>
        </div>
        <script defer async src='https://cdn.trustindex.io/loader.js?fe231eb69ba66041914656a8b64'></script>
    </div>
</section>

<!-- CTA — Full-bleed dark -->
<section class="py-20 sm:py-24 bg-primary-container">
    <div class="max-w-4xl mx-auto px-6 sm:px-8 text-center reveal">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6">Ready to Transform Your Bathroom?</h2>
        <p class="text-lg text-on-primary-container mb-10 max-w-2xl mx-auto">Send us a few photos and we'll have a fixed-price quote back to you within hours. No obligation, no pressure.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a class="bg-tertiary-fixed text-on-tertiary-fixed px-10 py-5 rounded-lg font-bold text-sm tracking-wide uppercase hover:opacity-90 transition-all" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Get a Free Quote</a>
            <a class="border border-white/20 text-white px-10 py-5 rounded-lg font-bold text-sm tracking-wide uppercase hover:bg-white/10 transition-all" href="<?php echo esc_url( home_url( '/gallery/' ) ); ?>">View Before &amp; After</a>
        </div>
    </div>
</section>

<!-- TRUST BAR -->
<section class="bg-primary text-white py-5">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-2 gap-3 sm:grid-cols-none sm:flex sm:flex-wrap sm:justify-between items-center sm:gap-4 sm:gap-6">
        <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified_user</span><span class="text-xs font-bold">Experienced &amp; Insured</span></div>
        <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">security</span><span class="text-xs font-bold">Public Liability Insured</span></div>
        <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">gavel</span><span class="text-xs font-bold">NSW Fair Trading Compliant</span></div>
        <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified</span><span class="text-xs font-bold">Up to 3-Year Warranty</span></div>
    </div>
</section>

</main>

<?php get_footer(); ?>
