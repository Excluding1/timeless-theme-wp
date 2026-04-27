<?php /* Template Name: Property Manager Bathroom Services Sydney */ ?>
<?php get_header(); ?>

<script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "Service",
 "name": "Property Manager & Landlord Bathroom Services Sydney",
 "description": "Professional bathroom resurfacing, regrouting and restoration services for property managers, landlords and real estate agents in Sydney. Fast turnarounds to minimise vacancy periods. Fixed-price quotes from photos.",
 "provider": {
 "@type": "HomeAndConstructionBusiness",
 "name": "Timeless Resurfacing",
 "url": "https://timelessresurfacing.com.au",
 "telephone": "<?php echo timeless_phone_link(); ?>",
 "address": { "@type": "PostalAddress", "addressLocality": "Sydney", "addressRegion": "NSW", "addressCountry": "AU" }<?php echo timeless_aggregate_rating_jsonld(); ?>
 },
 "areaServed": { "@type": "City", "name": "Sydney" },
 "serviceType": "Property Manager Bathroom Resurfacing Services"
 }
 </script>

<script type="application/ld+json">
 {
 "@context": "https://schema.org", "@type": "BreadcrumbList",
 "itemListElement": [
 { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://timelessresurfacing.com.au/" },
 { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://timelessresurfacing.com.au/services/" },
 { "@type": "ListItem", "position": 3, "name": "Property Manager Services", "item": "https://timelessresurfacing.com.au/services/property-manager-bathroom-services-sydney/" }
 ]
 }
 </script>

<script type="application/ld+json">
 {
 "@context": "https://schema.org", "@type": "FAQPage",
 "mainEntity": [
 { "@type": "Question", "name": "Do you work directly with property managers?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. We work with property managers, real estate agents, and landlords across Sydney. We understand the urgency of tenant turnarounds and can coordinate directly with your office, tenants, or tradespeople as needed. We provide professional documentation including before and after photos for your records." } },
 { "@type": "Question", "name": "Can you quote from photos only?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. this is ideal for remote landlords and interstate investors. Send us 3-4 clear photos of the bathroom and we'll provide a fixed-price quote within hours. No call-out fee, no obligation. This saves time for property managers who manage multiple properties and need quick answers." } },
 { "@type": "Question", "name": "How fast can you complete a job?", "acceptedAnswer": { "@type": "Answer", "text": "Most individual services such as regrouting, bath resurfacing, or silicone replacement are completed in 1 day. Larger jobs combining multiple services typically take 2-3 days. We schedule around your vacancy windows and can often start within days of approval." } },
 { "@type": "Question", "name": "Do you provide before and after photos?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. We photograph every job before and after completion. These are useful for end-of-lease documentation, landlord reports, insurance records, and marketing materials for rental listings." } },
 { "@type": "Question", "name": "Can you handle multiple properties?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. We regularly work with property managers who look after multiple properties across Sydney. We can schedule jobs efficiently across your portfolio and maintain consistent quality and pricing." } },
 { "@type": "Question", "name": "Do you offer volume pricing or ongoing arrangements?", "acceptedAnswer": { "@type": "Answer", "text": "We welcome ongoing arrangements with property managers and landlords who have regular work. If you manage multiple properties or anticipate repeat jobs, get in touch and we can discuss an arrangement that works for both parties." } },
 { "@type": "Question", "name": "How do I get a quote for a rental property bathroom?", "acceptedAnswer": { "@type": "Answer", "text": "Send us 3-4 photos of the bathroom through our contact page and let us know what issues need addressing. Include any time constraints such as a lease end date or settlement date. We'll have a fixed-price quote back to you within hours. No call-out fee, no obligation. You can also call us directly on <?php echo timeless_phone(); ?>." } }
 ]
 }
 </script>


<main id="main-content">

<!-- BREADCRUMB -->
<div class="pt-24 pb-2 px-6 sm:px-8 max-w-7xl mx-auto">
 <nav class="text-xs text-secondary" aria-label="Breadcrumb">
 <ol class="flex items-center gap-1">
 <li><a href="<?php echo esc_url( home_url('/') ); ?>" class="hover:text-primary transition-colors">Home</a></li>
 <li><span class="mx-1">/</span></li>
 <li><a href="<?php echo esc_url( home_url('/services/') ); ?>" class="hover:text-primary transition-colors">Services</a></li>
 <li><span class="mx-1">/</span></li>
 <li class="text-primary font-medium">Property Manager Services</li>
 </ol>
 </nav>
</div>

<!-- ═══════════════════════════════════════════════════
 HERO. WIDE FORMAT with gradient overlay (B2B)
 ═══════════════════════════════════════════════════ -->
<section class="pt-4 pb-16 sm:pb-20 bg-surface">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <div class="relative rounded-2xl overflow-hidden bg-blue-50 min-h-[400px] sm:min-h-[460px] flex items-center">
 <div class="absolute inset-0">
 <img src="<?php echo get_template_directory_uri(); ?>/images/services/property-manager/hero.png" alt="Professional bathroom resurfacing for property managers" class="w-full h-full object-cover" />
 </div>
 <!-- Gradient overlay -->
 <div class="absolute inset-0 bg-linear-to-r from-[#041534] via-[#041534]/85 to-transparent"></div>
 <!-- Content -->
 <div class="relative z-10 px-8 sm:px-12 lg:px-16 py-12 sm:py-16 max-w-3xl">
 <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.7rem] font-bold tracking-widest uppercase rounded-sm mb-4">For Property Professionals</span>
 <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tighter leading-[0.95] mb-5">
 Property Manager &amp;<br/><span class="text-tertiary-fixed-dim">Landlord Services</span>
 </h1>
 <p class="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl mb-6">
 The bathroom is the #1 reason tenants complain and buyers walk away. We fix rental bathrooms fast. 1-3 days. with fixed-price quotes from photos so you can approve without site visits.
 </p>
 <!-- Service badge pills -->
 <div class="flex flex-wrap gap-2 mb-6">
 <span class="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20"><span class="material-symbols-outlined text-sm text-tertiary-fixed-dim" aria-hidden="true">plumbing</span> Regrout</span>
 <span class="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20"><span class="material-symbols-outlined text-sm text-tertiary-fixed-dim" aria-hidden="true">format_paint</span> Resurface</span>
 <span class="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20"><span class="material-symbols-outlined text-sm text-tertiary-fixed-dim" aria-hidden="true">water_drop</span> Seal</span>
 <span class="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20"><span class="material-symbols-outlined text-sm text-tertiary-fixed-dim" aria-hidden="true">countertops</span> Respray</span>
 <span class="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20"><span class="material-symbols-outlined text-sm text-tertiary-fixed-dim" aria-hidden="true">wash</span> Restore</span>
 </div>
 <p class="text-3xl font-extrabold text-white mb-6">Quote from photos <span class="text-sm font-normal text-white/60">No call-out fee</span></p>
 <!-- Stats row -->
 <div class="flex flex-wrap items-center gap-4 mb-8">
 <div class="text-center bg-white/10 backdrop-blur-xs rounded-lg px-5 py-3 border border-white/10">
 <p class="text-2xl font-extrabold text-white">1-3 Days</p>
 <p class="text-[0.65rem] text-white/60 font-medium">Completion</p>
 </div>
 <div class="text-center bg-white/10 backdrop-blur-xs rounded-lg px-5 py-3 border border-white/10">
 <p class="text-2xl font-extrabold text-white">Quick Quote</p>
 <p class="text-[0.65rem] text-white/60 font-medium">from photos</p>
 </div>
 <div class="text-center bg-white/10 backdrop-blur-xs rounded-lg px-5 py-3 border border-white/10">
 <p class="text-2xl font-extrabold text-white">Up to 3yr</p>
 <p class="text-[0.65rem] text-white/60 font-medium">Warranty</p>
 </div>
 </div>
 <div class="flex flex-col sm:flex-row gap-3">
 <a class="px-8 py-4 bg-tertiary-fixed-dim text-on-tertiary-fixed font-bold rounded-lg text-center hover:shadow-xl transition-all" href="#quote">Send Photos for a Quote</a></div>
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
 <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">speed</span><span class="text-xs font-bold">Fast Turnaround</span></div>
 </div>
</section>

<!-- TRUST LOGO BAR -->
<section class="py-8 sm:py-10 bg-surface-container-low/50">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <p class="text-center text-sm text-secondary mb-6">Trusted by Hundreds of Australians, from Homeowners to Major Brands</p>
 </div>
 <div class="max-w-6xl mx-auto px-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing" id="logo-scroller" style="-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none;">
 <div class="flex items-center gap-5 sm:gap-8 w-max px-8" id="logo-inner">
 <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-1.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /> <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-2.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /> <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-3.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /> <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-4.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /> <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-5.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /> <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-6.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /> <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-7.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /> <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-8.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /> <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-9.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /> <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-10.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /> <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-1.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /> <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-2.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /> <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-3.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /> <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-4.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /> <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-5.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /> <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-6.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /> <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-7.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /> <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-8.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /> <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-9.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" /> <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/logos/logo-10.png" alt="Partner" class="h-8 sm:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity select-none" width="480" height="144" loading="lazy" draggable="false" />
 </div>
 </div>
 <div id="logo-dots" class="flex justify-center gap-1.5 mt-4"></div>
</section>


<!-- ═══════════════════════════════════════════════════
 SERVICES FOR PROPERTY MANAGERS. 7 service cards
 ═══════════════════════════════════════════════════ -->
<section class="py-16 sm:py-20 bg-white">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <div class="text-center mb-12">
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">Services for Property Managers</h2>
 <p class="text-secondary max-w-2xl mx-auto">Every bathroom problem you encounter. we fix it. Fast, fixed-price, no fuss.</p>
 </div>
 <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 <!-- Service 1 -->
 <a href="<?php echo esc_url( home_url('/services/shower-regrouting-sydney/') ); ?>" class="bg-surface-container-low rounded-xl p-6 reveal border border-surface-container hover:shadow-lg hover:border-primary/20 transition-all group">
 <div class="flex items-start gap-4">
 <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
 <span class="material-symbols-outlined text-2xl text-primary" aria-hidden="true">plumbing</span>
 </div>
 <div class="flex-1">
 <h3 class="font-bold text-primary mb-1 group-hover:text-primary-soft transition-colors">Shower Regrouting</h3>
 <p class="text-sm text-secondary leading-relaxed">Full grout removal and replacement. Stops leaks, eliminates mould.</p>
 </div>
 </div>
 </a>
 <!-- Service 2 -->
 <a href="<?php echo esc_url( home_url('/services/bath-resurfacing-sydney/') ); ?>" class="bg-surface-container-low rounded-xl p-6 reveal border border-surface-container hover:shadow-lg hover:border-primary/20 transition-all group">
 <div class="flex items-start gap-4">
 <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
 <span class="material-symbols-outlined text-2xl text-primary" aria-hidden="true">bathtub</span>
 </div>
 <div class="flex-1">
 <h3 class="font-bold text-primary mb-1 group-hover:text-primary-soft transition-colors">Bath Resurfacing</h3>
 <p class="text-sm text-secondary leading-relaxed">Restore chipped, stained, or worn bathtubs to like-new condition.</p>
 </div>
 </div>
 </a>
 <!-- Service 3 -->
 <a href="<?php echo esc_url( home_url('/services/tile-resurfacing-sydney/') ); ?>" class="bg-surface-container-low rounded-xl p-6 reveal border border-surface-container hover:shadow-lg hover:border-primary/20 transition-all group">
 <div class="flex items-start gap-4">
 <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
 <span class="material-symbols-outlined text-2xl text-primary" aria-hidden="true">grid_view</span>
 </div>
 <div class="flex-1">
 <h3 class="font-bold text-primary mb-1 group-hover:text-primary-soft transition-colors">Tile Resurfacing</h3>
 <p class="text-sm text-secondary leading-relaxed">Recoat dated wall tiles in a fresh high-gloss white finish.</p>
 </div>
 </div>
 </a>
 <!-- Service 4 -->
 <a href="<?php echo esc_url( home_url('/services/vanity-refinishing-sydney/') ); ?>" class="bg-surface-container-low rounded-xl p-6 reveal border border-surface-container hover:shadow-lg hover:border-primary/20 transition-all group">
 <div class="flex items-start gap-4">
 <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
 <span class="material-symbols-outlined text-2xl text-primary" aria-hidden="true">countertops</span>
 </div>
 <div class="flex-1">
 <h3 class="font-bold text-primary mb-1 group-hover:text-primary-soft transition-colors">Vanity Respray</h3>
 <p class="text-sm text-secondary leading-relaxed">Cabinet resprayed in a modern colour. Transforms the whole bathroom aesthetic.</p>
 </div>
 </div>
 </a>
 <!-- Service 5 -->
 <a href="<?php echo esc_url( home_url('/services/basin-restoration-sydney/') ); ?>" class="bg-surface-container-low rounded-xl p-6 reveal border border-surface-container hover:shadow-lg hover:border-primary/20 transition-all group">
 <div class="flex items-start gap-4">
 <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
 <span class="material-symbols-outlined text-2xl text-primary" aria-hidden="true">wash</span>
 </div>
 <div class="flex-1">
 <h3 class="font-bold text-primary mb-1 group-hover:text-primary-soft transition-colors">Basin Restoration</h3>
 <p class="text-sm text-secondary leading-relaxed">Resurface chipped or stained basins. Cheaper than replacement.</p>
 </div>
 </div>
 </a>
 <!-- Service 6 -->
 <a href="<?php echo esc_url( home_url('/services/shower-leak-repair-sydney/') ); ?>" class="bg-surface-container-low rounded-xl p-6 reveal border border-surface-container hover:shadow-lg hover:border-primary/20 transition-all group">
 <div class="flex items-start gap-4">
 <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
 <span class="material-symbols-outlined text-2xl text-primary" aria-hidden="true">water_drop</span>
 </div>
 <div class="flex-1">
 <h3 class="font-bold text-primary mb-1 group-hover:text-primary-soft transition-colors">Silicone Replacement</h3>
 <p class="text-sm text-secondary leading-relaxed">Strip and reseal all junctions. Fixes leaks and mouldy silicone.</p>
 </div>
 </div>
 </a>
 <!-- Service 7. Full package, highlighted -->
 <a href="<?php echo esc_url( home_url('/services/full-bathroom-makeover-sydney/') ); ?>" class="sm:col-span-2 lg:col-span-3 bg-primary/3 rounded-xl p-6 reveal border-2 border-primary ring-1 ring-primary/10 hover:shadow-lg transition-all group">
 <div class="flex items-start gap-4">
 <div class="w-12 h-12 rounded-xl bg-tertiary-fixed/30 flex items-center justify-center shrink-0">
 <span class="material-symbols-outlined text-2xl text-on-tertiary-fixed" style="font-variation-settings:'FILL' 1;" aria-hidden="true">star</span>
 </div>
 <div class="flex-1">
 <div class="flex items-center gap-3 mb-1">
 <h3 class="font-bold text-primary group-hover:text-primary-soft transition-colors">Full Bathroom Makeover Package</h3>
 <span class="text-[0.6rem] bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded-sm font-bold uppercase">Best Value</span>
 </div>
 <p class="text-sm text-secondary leading-relaxed">Complete transformation. bath, tiles, grout, silicone, vanity, basin. All done in 2-3 days. The highest-impact, lowest-disruption option for rental turnarounds and pre-sale prep.</p>
 </div>
 </div>
 </a>
 </div>
 </div>
</section>

<!-- ═══════════════════════════════════════════════════
 COMMON SCENARIOS. 4 scenario cards
 ═══════════════════════════════════════════════════ -->
<section class="py-16 sm:py-20 bg-surface-container-low">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <div class="text-center mb-12">
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">Common Scenarios</h2>
 <p class="text-secondary max-w-2xl mx-auto">We see these every week. Here&rsquo;s how we solve them fast.</p>
 </div>
 <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
 <!-- Scenario 1 -->
 <div class="bg-white rounded-xl p-6 reveal border border-surface-container hover:shadow-lg transition-all">
 <div class="w-14 h-14 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
 <span class="material-symbols-outlined text-3xl text-error" aria-hidden="true">event_busy</span>
 </div>
 <h3 class="font-bold text-primary text-center mb-2">End-of-Lease Damage</h3>
 <p class="text-sm text-secondary leading-relaxed text-center">Cracked grout, chipped baths, general wear and tear. We restore bathrooms to inspection-ready condition in 1-2 days so you don&rsquo;t lose bond disputes.</p>
 </div>
 <!-- Scenario 2 -->
 <div class="bg-white rounded-xl p-6 reveal border border-surface-container hover:shadow-lg transition-all">
 <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
 <span class="material-symbols-outlined text-3xl text-primary" aria-hidden="true">sell</span>
 </div>
 <h3 class="font-bold text-primary text-center mb-2">Pre-Sale Refresh</h3>
 <p class="text-sm text-secondary leading-relaxed text-center">Make the bathroom presentable for open homes. A fresh-looking bathroom is the highest-ROI improvement you can make before listing. Done before your first inspection.</p>
 </div>
 <!-- Scenario 3 -->
 <div class="bg-white rounded-xl p-6 reveal border border-surface-container hover:shadow-lg transition-all">
 <div class="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
 <span class="material-symbols-outlined text-3xl text-amber-700" aria-hidden="true">feedback</span>
 </div>
 <h3 class="font-bold text-primary text-center mb-2">Tenant Complaints</h3>
 <p class="text-sm text-secondary leading-relaxed text-center">Mouldy grout, stained bath, dated tiles. Address complaints fast with a cost-effective fix that tenants love. without the cost or disruption of a full renovation.</p>
 </div>
 <!-- Scenario 4 -->
 <div class="bg-white rounded-xl p-6 reveal border border-surface-container hover:shadow-lg transition-all">
 <div class="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
 <span class="material-symbols-outlined text-3xl text-emerald-700" aria-hidden="true">trending_up</span>
 </div>
 <h3 class="font-bold text-primary text-center mb-2">Vacant Property Upgrade</h3>
 <p class="text-sm text-secondary leading-relaxed text-center">Maximise rental yield during vacancy. A refreshed bathroom justifies higher rent and attracts better tenants. Completed before the next lease starts.</p>
 </div>
 </div>
 </div>
</section>

<!-- ═══════════════════════════════════════════════════
 WHY PROPERTY MANAGERS CHOOSE US. 4 value props
 ═══════════════════════════════════════════════════ -->
<section class="py-16 sm:py-20 bg-white">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <div class="text-center mb-12">
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">Why Property Managers Choose Us</h2>
 <p class="text-secondary max-w-2xl mx-auto">We&rsquo;re built for the way you work. fast approvals, minimal involvement, reliable results.</p>
 </div>
 <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
 <div class="bg-surface-container-low rounded-xl p-6 text-center reveal border border-surface-container hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out">
 <span class="material-symbols-outlined text-3xl text-primary mb-3 block" aria-hidden="true">speed</span>
 <h3 class="font-bold text-primary mb-2">Fast Turnaround</h3>
 <p class="text-sm text-secondary leading-relaxed">Minimise vacancy days. Most jobs completed in 1-3 days with minimal disruption to adjacent tenants.</p>
 </div>
 <div class="bg-surface-container-low rounded-xl p-6 text-center reveal border border-surface-container hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out">
 <span class="material-symbols-outlined text-3xl text-primary mb-3 block" aria-hidden="true">photo_camera</span>
 <h3 class="font-bold text-primary mb-2">Fixed-Price from Photos</h3>
 <p class="text-sm text-secondary leading-relaxed">No call-out fee. Send photos, get a fixed-price quote within hours. Approve without a site visit.</p>
 </div>
 <div class="bg-surface-container-low rounded-xl p-6 text-center reveal border border-surface-container hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out">
 <span class="material-symbols-outlined text-3xl text-primary mb-3 block" aria-hidden="true">compare</span>
 <h3 class="font-bold text-primary mb-2">Before &amp; After Documentation</h3>
 <p class="text-sm text-secondary leading-relaxed">Professional before and after photos for condition reports, tenant communications, and listing assets.</p>
 </div>
 <div class="bg-surface-container-low rounded-xl p-6 text-center reveal border border-surface-container hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out">
 <span class="material-symbols-outlined text-3xl text-primary mb-3 block" aria-hidden="true">handshake</span>
 <h3 class="font-bold text-primary mb-2">Volume Arrangements</h3>
 <p class="text-sm text-secondary leading-relaxed">Ongoing relationships welcome. Competitive pricing for regular work across your portfolio.</p>
 </div>
 </div>
 </div>
</section>

<!-- ═══════════════════════════════════════════════════
 PROCESS. 4 horizontal steps
 ═══════════════════════════════════════════════════ -->
<section class="py-16 sm:py-20 bg-surface-container-low">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <div class="text-center mb-12">
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">How It Works</h2>
 <p class="text-secondary max-w-2xl mx-auto">Streamlined for busy property managers. Minimal back-and-forth.</p>
 </div>
 <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
 <!-- Connector line (desktop only) -->
 <div class="text-center reveal bg-white rounded-xl p-6 border border-surface-container hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out">
 <div class="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold mx-auto mb-4 text-xl border-4 border-white shadow-md relative z-10">1</div>
 <h3 class="font-bold text-primary text-sm mb-2">Send Photos</h3>
 <p class="text-xs text-secondary">Text or email 3-4 photos of the bathroom. Include the suburb and what needs doing.</p>
 </div>
 <div class="text-center reveal bg-white rounded-xl p-6 border border-surface-container hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out">
 <div class="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold mx-auto mb-4 text-xl border-4 border-white shadow-md relative z-10">2</div>
 <h3 class="font-bold text-primary text-sm mb-2">Get Fixed-Price Quote</h3>
 <p class="text-xs text-secondary">We review and send a detailed fixed-price quote within hours. No surprises, no extras.</p>
 </div>
 <div class="text-center reveal bg-white rounded-xl p-6 border border-surface-container hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out">
 <div class="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold mx-auto mb-4 text-xl border-4 border-white shadow-md relative z-10">3</div>
 <h3 class="font-bold text-primary text-sm mb-2">We Complete the Work</h3>
 <p class="text-xs text-secondary">Our team arrives on the scheduled date, completes the job in 1-3 days. Key access arranged.</p>
 </div>
 <div class="text-center reveal bg-white rounded-xl p-6 border border-surface-container hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out">
 <div class="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold mx-auto mb-4 text-xl border-4 border-white shadow-md relative z-10">4</div>
 <h3 class="font-bold text-primary text-sm mb-2">Before &amp; After Documentation</h3>
 <p class="text-xs text-secondary">Professional before/after photos sent on completion for your records and listings.</p>
 </div>
 </div>
 </div>
</section>

<!-- ═══════════════════════════════════════════════════
 THE NUMBERS MAKE SENSE. Business case comparison
 ═══════════════════════════════════════════════════ -->
<section class="py-16 sm:py-20 bg-white">
 <div class="max-w-5xl mx-auto px-6 sm:px-8">
 <div class="text-center mb-12">
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">The Numbers Make Sense</h2>
 <p class="text-secondary max-w-2xl mx-auto">Compare the cost and disruption of renovation vs our services.</p>
 </div>
 <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
 <!-- Full Renovation -->
 <div class="bg-white rounded-2xl p-8 border-2 border-error/20 relative overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300">
 <div class="absolute top-0 right-0 bg-error/10 text-error text-[0.6rem] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">High Cost</div>
 <h3 class="text-xl font-extrabold text-primary mb-6 flex items-center gap-2">
 <span class="material-symbols-outlined text-error" aria-hidden="true">construction</span> Full Renovation
 </h3>
 <div class="space-y-4">
 <div class="flex justify-between items-center py-3 border-b border-surface-container">
 <span class="text-sm text-secondary font-medium">Cost</span>
 <span class="text-lg font-extrabold text-error">$25,000 - $50,000+</span>
 </div>
 <div class="flex justify-between items-center py-3 border-b border-surface-container">
 <span class="text-sm text-secondary font-medium">Vacancy</span>
 <span class="text-sm font-bold text-error">Weeks of lost rental income</span>
 </div>
 <div class="flex justify-between items-center py-3 border-b border-surface-container">
 <span class="text-sm text-secondary font-medium">Trades</span>
 <span class="text-sm font-bold text-primary">Multiple trades to coordinate</span>
 </div>
 <div class="flex justify-between items-center py-3">
 <span class="text-sm text-secondary font-medium">Your time</span>
 <span class="text-sm font-bold text-error">Significant PM involvement</span>
 </div>
 </div>
 </div>
 <!-- Our Services -->
 <div class="bg-white rounded-2xl p-8 border-2 border-primary ring-2 ring-primary/10 relative overflow-hidden hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300">
 <div class="absolute top-0 right-0 bg-tertiary-fixed text-on-tertiary-fixed text-[0.6rem] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">Smart Choice</div>
 <h3 class="text-xl font-extrabold text-primary mb-6 flex items-center gap-2">
 <span class="material-symbols-outlined text-primary" style="font-variation-settings:'FILL' 1;" aria-hidden="true">star</span> Our Services
 </h3>
 <div class="space-y-4">
 <div class="flex justify-between items-center py-3 border-b border-primary/10">
 <span class="text-sm text-secondary font-medium">Cost</span>
 <span class="text-lg font-extrabold text-primary">Fraction of reno cost</span>
 </div>
 <div class="flex justify-between items-center py-3 border-b border-primary/10">
 <span class="text-sm text-secondary font-medium">Vacancy</span>
 <span class="text-sm font-bold text-emerald-700">1-3 days only</span>
 </div>
 <div class="flex justify-between items-center py-3 border-b border-primary/10">
 <span class="text-sm text-secondary font-medium">Trades</span>
 <span class="text-sm font-bold text-primary">Single team, one contact</span>
 </div>
 <div class="flex justify-between items-center py-3">
 <span class="text-sm text-secondary font-medium">Your time</span>
 <span class="text-sm font-bold text-emerald-700">Send photos, approve quote, done</span>
 </div>
 </div>
 </div>
 </div>
 <div class="mt-8 p-6 bg-tertiary-fixed/20 rounded-xl">
 <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
 <span class="material-symbols-outlined text-3xl text-on-tertiary-fixed shrink-0" aria-hidden="true">calculate</span>
 <div>
 <p class="text-sm text-primary font-bold mb-1">Example: Regrout + bath resurface for a rental turnover</p>
 <p class="text-xs text-secondary">Done in 1-2 days. Property listed immediately after. Compare that to weeks of vacancy for a full renovation. Send us photos for a fixed-price quote.</p>
 </div>
 </div>
 </div>
 </div>
</section>

<!-- GOOGLE REVIEWS -->
<section class="py-16 sm:py-20 bg-surface-container-low">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <div class="text-center mb-10">
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">What Our Customers Say</h2>
 <div class="flex items-center justify-center gap-2"><div class="flex text-amber-400 text-lg" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div><span class="sr-only">5 out of 5 stars</span><span class="text-sm font-bold text-primary">4.9</span><span class="text-xs text-secondary">Google Rating</span></div>
 </div>
 <?php timeless_render_google_reviews(); ?>
 </div>
</section>

<!-- FAQ -->
<section class="py-16 sm:py-20 bg-white" id="faqs">
 <div class="max-w-3xl mx-auto px-6 sm:px-8">
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-4 text-center">Property Manager FAQs</h2>
 <p class="text-secondary text-center mb-10">Common questions from property managers and landlords.</p>
 <div class="space-y-3">
 <div class="faq-item border border-surface-container rounded-xl bg-surface-container-low"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Do you work with property managers directly?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Yes. We work with property managers, real estate agencies, landlords, and strata managers across Sydney. We understand the urgency of tenant turnovers and pre-sale timelines, and we structure our service to minimise your involvement. send photos, approve the quote, we handle the rest.</p></div></div>
 <div class="faq-item border border-surface-container rounded-xl bg-surface-container-low"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Can you quote from photos only?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Yes. most of our quotes are done from photos. Send 3-4 photos of the bathroom and we&rsquo;ll return a fixed-price quote within hours. No call-out fee, no site visit needed for standard jobs. For complex or large-scope work, we may request a brief site inspection.</p></div></div>
 <div class="faq-item border border-surface-container rounded-xl bg-surface-container-low"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How quickly can you complete a job?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Most jobs are completed in 1-3 days depending on scope. A simple regrout is done in a single day. A full bathroom makeover takes 2-3 days. We prioritise fast turnaround for rental properties and can often accommodate urgent timelines.</p></div></div>
 <div class="faq-item border border-surface-container rounded-xl bg-surface-container-low"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Do you provide before and after photos?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Yes. We document every job with before and after photos, sent to you on completion. These are useful for condition reports, tenant communications, listing photos, and demonstrating value to property owners.</p></div></div>
 <div class="faq-item border border-surface-container rounded-xl bg-surface-container-low"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Can you handle multiple properties?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Absolutely. We regularly work with property managers who have multiple units needing attention. We can schedule jobs back-to-back to minimise downtime across your portfolio and provide a single point of contact for all properties.</p></div></div>
 <div class="faq-item border border-surface-container rounded-xl bg-surface-container-low"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Do you offer volume pricing?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">We welcome ongoing relationships with property managers and offer competitive pricing for regular work. Contact us to discuss volume arrangements for your portfolio. The more bathrooms, the more we can offer.</p></div></div>
 <div class="faq-item border border-surface-container rounded-xl bg-surface-container-low"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How do I get started?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Send photos of the bathroom via the form below, text them to 0451 110 154, or email them. Include the suburb and what needs doing. We&rsquo;ll have a fixed-price quote back to you within hours. No call-out fee, no obligation.</p></div></div>
 </div>
 </div>
</section>

<!-- ═══════════════════════════════════════════════════
 QUOTE FORM. PM-specific with property type + bathrooms
 ═══════════════════════════════════════════════════ -->
<section class="py-16 sm:py-20 bg-surface-container-low" id="quote">
 <div class="max-w-4xl mx-auto px-6 sm:px-8">
 <div class="bg-white rounded-2xl overflow-hidden shadow-2xl">
 <div class="p-6 sm:p-8 lg:p-12 bg-primary text-white">
 <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Get a Quote from Photos</h2>
 <p class="text-on-primary-container text-sm">Send photos of the bathroom. fixed-price quote back within hours. No call-out fee.</p>
 </div>
 <!-- How quoting works -->
 <div class="px-6 sm:px-8 lg:px-12 pt-8 pb-4">
 <div class="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center text-center sm:text-left">
 <div class="flex items-center gap-3"><span class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary shrink-0">1</span><span class="text-xs text-secondary"><strong class="text-primary">Send photos</strong> of the bathroom</span></div>
 <span class="hidden sm:block text-surface-container-highest">&rarr;</span>
 <div class="flex items-center gap-3"><span class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary shrink-0">2</span><span class="text-xs text-secondary"><strong class="text-primary">Fixed-price quote</strong> within hours</span></div>
 <span class="hidden sm:block text-surface-container-highest">&rarr;</span>
 <div class="flex items-center gap-3"><span class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary shrink-0">3</span><span class="text-xs text-secondary"><strong class="text-primary">Approve &amp; book</strong> a date</span></div>
 </div>
 </div>
 <form class="timeless-quote-form p-6 sm:p-8 lg:p-12 pt-6 space-y-6" onsubmit="event.preventDefault(); alert('Quote submitted! (Preview mode)');">
 <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div><label for="name" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Your Name *</label><input id="name" name="name" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Jane Smith" required /></div>
 <div><label for="phone" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Phone *</label><input id="phone" name="phone" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="0400 000 000" type="tel" required /></div>
 </div>
 <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div><label for="address" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Property Suburb *</label><input id="address" name="address" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. Parramatta, Bondi, Surry Hills" required /></div>
 <div><label for="company" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Company / Agency</label><input id="company" name="company" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. Ray White Parramatta (optional)" /></div>
 </div>
 <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <label for="property-type" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Property Type</label>
 <select id="property-type" name="property-type" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary">
 <option value="">Select type...</option>
 <option value="rental">Rental property</option>
 <option value="sale-prep">Sale preparation</option>
 <option value="owner-occupied">Owner-occupied</option>
 <option value="strata">Strata / Body corporate</option>
 </select>
 </div>
 <div>
 <label for="bathrooms" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Number of Bathrooms</label>
 <select id="bathrooms" name="bathrooms" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary">
 <option value="1">1 bathroom</option>
 <option value="2">2 bathrooms</option>
 <option value="3">3 bathrooms</option>
 <option value="4+">4+ bathrooms</option>
 <option value="multiple-properties">Multiple properties</option>
 </select>
 </div>
 </div>
 <div>
 <label class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Services needed (tick all that apply)</label>
 <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
 <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded-sm text-primary" /> Shower regrouting</label>
 <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded-sm text-primary" /> Bath resurfacing</label>
 <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded-sm text-primary" /> Tile resurfacing</label>
 <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded-sm text-primary" /> Vanity respray</label>
 <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded-sm text-primary" /> Basin restoration</label>
 <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30"><input type="checkbox" class="rounded-sm text-primary" /> Silicone replacement</label>
 <label class="p-3 bg-surface-container-low rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer border border-surface-container hover:border-primary/30 sm:col-span-2 md:col-span-3"><input type="checkbox" class="rounded-sm text-primary" /> Full bathroom makeover (everything above)</label>
 </div>
 </div>
 <div><label for="notes" class="text-[0.75rem] sm:text-[0.65rem] font-black uppercase text-secondary tracking-widest block mb-2">Additional details</label><textarea id="notes" name="notes" rows="3" class="w-full bg-surface-container-low border border-surface-container rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="e.g. end-of-lease turnover, need done by [date], key access details..."></textarea></div>
 <button class="w-full py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2" type="submit">Send Photos &amp; Get Quote <span class="material-symbols-outlined" aria-hidden="true">send</span></button>
 <p class="text-center text-[0.6rem] text-secondary">Fixed-price quote within hours. No call-out fee. No obligation.</p>
 </form>
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

<script>
/* -- Logo Scroller Momentum Carousel -- */
(function(){
 var el = document.getElementById('logo-scroller');
 if(!el) return;
 el.style.overflow = 'hidden';
 var isDrag = false, startX = 0, scrollStart = 0;
 var velocity = 0, lastX = 0, lastTime = 0, animFrame = 0;
 var halfWidth = el.scrollWidth / 2;
 var dotsBox = document.getElementById('logo-dots');
 if(dotsBox && dotsBox.children.length === 0){
 for(var i=0;i<8;i++){
 var d=document.createElement('span');
 d.className='inline-block rounded-full bg-slate-300 transition-all duration-200';
 d.style.width='8px'; d.style.height='8px';
 dotsBox.appendChild(d);
 }
 }
 el.scrollLeft = halfWidth * 0.3;
 function loop(){if(el.scrollLeft<=0)el.scrollLeft+=halfWidth;else if(el.scrollLeft>=halfWidth)el.scrollLeft-=halfWidth;}
 function updateDots(){var dots=document.getElementById('logo-dots');if(!dots)return;var pct=(el.scrollLeft%halfWidth)/halfWidth;var idx=Math.round(pct*7)%8;for(var i=0;i<dots.children.length;i++){dots.children[i].style.width=i===idx?'18px':'8px';dots.children[i].style.background=i===idx?'#041534':'#cbd5e1';}}
 function coast(){if(Math.abs(velocity)<0.5){velocity=0;return;}velocity*=0.95;el.scrollLeft-=velocity;loop();updateDots();animFrame=requestAnimationFrame(coast);}
 el.addEventListener('mousedown',function(e){isDrag=true;startX=e.pageX;scrollStart=el.scrollLeft;lastX=e.pageX;lastTime=Date.now();velocity=0;cancelAnimationFrame(animFrame);e.preventDefault();});
 document.addEventListener('mousemove',function(e){if(!isDrag)return;var now=Date.now();var dt=now-lastTime;if(dt>0)velocity=(e.pageX-lastX)/dt*16;lastX=e.pageX;lastTime=now;el.scrollLeft=scrollStart-(e.pageX-startX);loop();updateDots();});
 document.addEventListener('mouseup',function(){if(!isDrag)return;isDrag=false;coast();});
 el.addEventListener('touchstart',function(e){isDrag=true;startX=e.touches[0].pageX;scrollStart=el.scrollLeft;lastX=e.touches[0].pageX;lastTime=Date.now();velocity=0;cancelAnimationFrame(animFrame);},{passive:true});
 document.addEventListener('touchmove',function(e){if(!isDrag)return;var now=Date.now();var dt=now-lastTime;if(dt>0)velocity=(e.touches[0].pageX-lastX)/dt*16;lastX=e.touches[0].pageX;lastTime=now;el.scrollLeft=scrollStart-(e.touches[0].pageX-startX);loop();updateDots();},{passive:true});
 document.addEventListener('touchend',function(){if(!isDrag)return;isDrag=false;coast();});
 setInterval(function(){if(!isDrag){el.scrollLeft+=200;loop();updateDots();}},10000);
 updateDots();
})();
</script>

<?php get_footer(); ?>
