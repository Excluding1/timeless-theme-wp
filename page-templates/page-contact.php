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
 { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "07:00", "closes": "17:00" }
 ],
 "priceRange": "$$",<?php echo timeless_aggregate_rating_jsonld('middle'); ?>
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
 <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.7rem] font-bold tracking-widest uppercase rounded-sm mb-6">Sydney &amp; NSW</span>
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
 <a href="tel:<?php echo timeless_phone_link(); ?>" class="text-xl font-extrabold text-primary hover:text-primary-soft transition-colors block mb-2"><?php echo timeless_phone(); ?></a>
 <p class="text-xs text-secondary">Call us Mon-Fri 7am-5pm</p>
 </div>
 <!-- Email -->
 <div class="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-all border border-surface-container">
 <div class="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4">
 <span class="material-symbols-outlined text-3xl text-primary" aria-hidden="true">mail</span>
 </div>
 <h2 class="font-bold text-primary text-lg mb-2">Email</h2>
 <a href="mailto:<?php echo timeless_email(); ?>" class="text-sm font-bold text-primary hover:text-primary-soft transition-colors block mb-2 break-all"><?php echo timeless_email(); ?></a>
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
 <!-- Quote Form CTA with gold border -->
 <div class="mt-10 text-center">
 <a href="#quote" class="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-lg hover:shadow-xl transition-all border-2 border-tertiary-fixed-dim">Fill Out Quote Form <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_downward</span></a>
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
 <span class="text-sm font-bold text-primary">Monday - Friday</span>
 <span class="text-sm font-bold text-primary-soft">7:00am - 5:00pm</span>
 </div>
 <div class="flex justify-between items-center py-3 border-b border-surface-container">
 <span class="text-sm font-bold text-primary">Saturday</span>
 <span class="text-sm font-bold text-error">Closed</span>
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

<!-- QUOTE FORM — embeds the React form via [timeless_quote_form] shortcode -->
<section class="py-16 sm:py-24 bg-surface-container-low" id="quote">
 <div class="max-w-4xl mx-auto px-6 sm:px-8">
 <div class="bg-white rounded-2xl overflow-hidden shadow-2xl">
 <div class="p-6 sm:p-8 lg:p-12 bg-primary text-white">
 <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Request a Free Quote</h2>
 <p class="text-on-primary-container text-sm">Send us your details and photos. We respond with a fixed-price quote within 1 business day.</p>
 </div>
 <div class="p-2 sm:p-4">
 <?php echo do_shortcode( '[timeless_quote_form]' ); ?>
 </div>
 </div>
 </div>
</section>

<!-- TRUST BAR -->
<section class="bg-primary text-white py-5">
 <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-2 gap-3 sm:grid-cols-none sm:flex sm:flex-wrap sm:justify-between items-center sm:gap-4 sm:gap-6">
 <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified_user</span><span class="text-xs font-bold">Experienced &amp; Insured</span></div>
 <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">security</span><span class="text-xs font-bold">Public Liability Insured</span></div>
 <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">gavel</span><span class="text-xs font-bold">NSW Fair Trading Compliant</span></div>
 <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified</span><span class="text-xs font-bold">Up to 5-Year Warranty</span></div>
 </div>
</section>

</main>

<?php get_footer(); ?>
