<?php /* Template Name: Contact */ ?>
<?php get_header(); ?>

<!-- Schema: LocalBusiness -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": "Timeless Resurfacing",
    "description": "Sydney's specialist bathroom resurfacing and shower regrouting service.",
    "url": "https://timelessresurfacing.com.au",
    "telephone": "<?php echo timeless_phone_link(); ?>",
    "email": "info@timelessresurfacing.com.au",
    "address": { "@type": "PostalAddress", "addressLocality": "Sydney", "addressRegion": "NSW", "addressCountry": "AU" },
    "geo": { "@type": "GeoCoordinates", "latitude": -33.8688, "longitude": 151.2093 },
    "areaServed": [
        { "@type": "City", "name": "Sydney" },
        { "@type": "City", "name": "Wollongong" },
        { "@type": "City", "name": "Central Coast" },
        { "@type": "City", "name": "Blue Mountains" }
    ],
    "openingHoursSpecification": [
        { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "07:00", "closes": "17:00" },
        { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "08:00", "closes": "15:00" }
    ],
    "priceRange": "$$",
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "23", "bestRating": "5" },
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "<?php echo timeless_phone_link(); ?>",
        "contactType": "customer service",
        "email": "info@timelessresurfacing.com.au",
        "areaServed": "AU-NSW",
        "availableLanguage": "English"
    }
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
                <li class="font-bold text-primary">Contact</li>
            </ol>
        </nav>
    </div>
</div>

<!-- HERO -->
<section class="pt-6 pb-12 sm:pb-16 bg-surface">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 text-center">
        <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.7rem] font-bold tracking-widest uppercase rounded mb-6">Sydney &amp; NSW</span>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tighter leading-[0.95] mb-4">Get In Touch</h1>
        <p class="text-base sm:text-lg text-secondary leading-relaxed max-w-xl mx-auto">Have a question or ready to get a quote? We're here to help.</p>
        <div class="h-1 w-20 bg-tertiary-fixed-dim mt-6 mx-auto"></div>
    </div>
</section>

<!-- CONTACT CARDS -->
<section class="pb-16 bg-surface">
    <div class="max-w-5xl mx-auto px-6 sm:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 reveal">
            <!-- Phone -->
            <div class="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-all border border-surface-container">
                <div class="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4">
                    <span class="material-symbols-outlined text-3xl text-primary" aria-hidden="true">call</span>
                </div>
                <h2 class="font-bold text-primary text-lg mb-2">Phone</h2>
                <a href="tel:<?php echo timeless_phone_link(); ?>" class="text-xl font-extrabold text-primary hover:text-on-primary-container transition-colors block mb-2"><?php echo timeless_phone(); ?></a>
                <p class="text-xs text-secondary">Call us Mon&ndash;Sat 7am&ndash;5pm</p>
            </div>
            <!-- Email -->
            <div class="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-all border border-surface-container">
                <div class="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4">
                    <span class="material-symbols-outlined text-3xl text-primary" aria-hidden="true">mail</span>
                </div>
                <h2 class="font-bold text-primary text-lg mb-2">Email</h2>
                <a href="mailto:<?php echo timeless_email(); ?>" class="text-sm font-bold text-primary hover:text-on-primary-container transition-colors block mb-2 break-all"><?php echo timeless_email(); ?></a>
                <p class="text-xs text-secondary">We respond within hours</p>
            </div>
            <!-- Service Area -->
            <div class="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-all border border-surface-container">
                <div class="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4">
                    <span class="material-symbols-outlined text-3xl text-primary" aria-hidden="true">location_on</span>
                </div>
                <h2 class="font-bold text-primary text-lg mb-2">Service Area</h2>
                <p class="text-sm font-bold text-primary mb-2">Greater Sydney &amp; Surrounds</p>
                <p class="text-xs text-secondary">Wollongong, Central Coast, Blue Mountains</p>
            </div>
        </div>
    </div>
</section>

<!-- BUSINESS HOURS -->
<section class="py-16 bg-white">
    <div class="max-w-3xl mx-auto px-6 sm:px-8">
        <div class="text-center mb-10">
            <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter mb-3">Business Hours</h2>
            <p class="text-secondary text-sm">When you can reach us.</p>
        </div>
        <div class="bg-surface-container-low rounded-xl p-6 sm:p-8 border border-surface-container reveal">
            <div class="space-y-4">
                <div class="flex justify-between items-center py-3 border-b border-surface-container">
                    <span class="text-sm font-bold text-primary">Monday &ndash; Friday</span>
                    <span class="text-sm font-bold text-on-primary-container">7:00am &ndash; 5:00pm</span>
                </div>
                <div class="flex justify-between items-center py-3 border-b border-surface-container">
                    <span class="text-sm font-bold text-primary">Saturday</span>
                    <span class="text-sm font-bold text-on-primary-container">8:00am &ndash; 3:00pm</span>
                </div>
                <div class="flex justify-between items-center py-3 border-b border-surface-container">
                    <span class="text-sm font-bold text-primary">Sunday</span>
                    <span class="text-sm font-bold text-error">Closed</span>
                </div>
            </div>
            <div class="mt-6 p-4 bg-tertiary-fixed/30 rounded-lg flex items-center gap-3">
                <span class="material-symbols-outlined text-on-tertiary-fixed" aria-hidden="true">sms</span>
                <p class="text-sm font-bold text-on-tertiary-fixed">Emergency? Text us anytime.</p>
            </div>
        </div>
    </div>
</section>

<!-- QUOTE FORM -->
<section class="py-16 sm:py-24 bg-surface-container-low" id="quote">
    <div class="max-w-4xl mx-auto px-6 sm:px-8">
        <div class="bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div class="p-6 sm:p-8 lg:p-12 bg-primary text-white">
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Request a Free Quote</h2>
                <p class="text-on-primary-container text-sm">Send us your details and photos. We respond within hours with a fixed-price quote.</p>
            </div>
            <form class="timeless-quote-form p-6 sm:p-8 lg:p-12 space-y-8">
                <fieldset>
                    <div class="flex items-center gap-3 mb-6"><span class="text-xs font-black bg-primary text-white w-6 h-6 flex items-center justify-center rounded">1</span><legend class="font-bold text-primary uppercase tracking-wider text-sm">Contact Info</legend></div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label for="name" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Full Name *</label><input id="name" name="name" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="John Citizen" required /></div>
                        <div><label for="phone" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Phone *</label><input id="phone" name="phone" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="0400 000 000" type="tel" required /></div>
                        <div><label for="email" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Email</label><input id="email" name="email" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="john@example.com" type="email" /></div>
                        <div><label for="suburb" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Suburb *</label><input id="suburb" name="suburb" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. Bondi, Parramatta, Wollongong" required /></div>
                    </div>
                </fieldset>
                <fieldset>
                    <div class="flex items-center gap-3 mb-6"><span class="text-xs font-black bg-primary text-white w-6 h-6 flex items-center justify-center rounded">2</span><legend class="font-bold text-primary uppercase tracking-wider text-sm">What Needs Work?</legend></div>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Bathtub</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Shower Tiles</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Wall Tiles</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Vanity Top</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Shower Base</label>
                        <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded text-primary" /> Floor Tiles</label>
                    </div>
                </fieldset>
                <fieldset>
                    <div class="flex items-center gap-3 mb-6"><span class="text-xs font-black bg-primary text-white w-6 h-6 flex items-center justify-center rounded">3</span><legend class="font-bold text-primary uppercase tracking-wider text-sm">Additional Notes</legend></div>
                    <div><label for="notes" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Tell Us More (Optional)</label><textarea id="notes" name="notes" rows="4" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Describe the condition of your bathroom, any specific issues, or questions you have..."></textarea></div>
                </fieldset>
                <button class="w-full py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2" type="submit">Request a Free Quote <span class="material-symbols-outlined" aria-hidden="true">send</span></button>
                <p class="text-center text-[0.6rem] text-secondary">By submitting you agree to our Terms &amp; Privacy Policy.</p>
            </form>
        </div>
    </div>
</section>

<!-- TRUST BAR -->
<section class="bg-primary text-white py-5">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 flex flex-wrap justify-center sm:justify-between items-center gap-4 sm:gap-6">
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified_user</span><span class="text-xs font-bold">Experienced &amp; Insured</span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">security</span><span class="text-xs font-bold">Public Liability Insured</span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">gavel</span><span class="text-xs font-bold">NSW Fair Trading Compliant</span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified</span><span class="text-xs font-bold">Up to 3-Year Warranty</span></div>
    </div>
</section>

</main>

<?php get_footer(); ?>
