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
 { "@type": "ListItem", "position": 3, "name": "Property Manager Services", "item": "https://timelessresurfacing.com.au/services/property-manager-bathroom-services/" }
 ]
 }
 </script>

<script type="application/ld+json">
 {
 "@context": "https://schema.org", "@type": "FAQPage",
 "mainEntity": [
 { "@type": "Question", "name": "Do you work directly with property managers?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. We work with property managers, real estate agents, and landlords across Sydney. We understand the urgency of tenant turnarounds and can coordinate directly with your office, tenants, or tradespeople as needed. We provide professional documentation including before and after photos for your records." } },
 { "@type": "Question", "name": "Can you quote from photos only?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. this is ideal for remote landlords and interstate investors. Send us 3-4 clear photos of the bathroom and we'll provide a fixed-price quote within 1 business day. No call-out fee, no obligation. This saves time for property managers who manage multiple properties and need quick answers." } },
 { "@type": "Question", "name": "How fast can you complete a job?", "acceptedAnswer": { "@type": "Answer", "text": "Most individual services such as regrouting, bath resurfacing, or silicone replacement are completed in 1 day. Larger jobs combining multiple services typically take 2-3 days. We schedule around your vacancy windows and can often start within days of approval." } },
 { "@type": "Question", "name": "Do you provide before and after photos?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. We photograph every job before and after completion. These are useful for end-of-lease documentation, landlord reports, insurance records, and marketing materials for rental listings." } },
 { "@type": "Question", "name": "Can you handle multiple properties?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. We regularly work with property managers who look after multiple properties across Sydney. We can schedule jobs efficiently across your portfolio and maintain consistent quality and pricing." } },
 { "@type": "Question", "name": "Do you offer volume pricing or ongoing arrangements?", "acceptedAnswer": { "@type": "Answer", "text": "We welcome ongoing arrangements with property managers and landlords who have regular work. If you manage multiple properties or anticipate repeat jobs, get in touch and we can discuss an arrangement that works for both parties." } },
 { "@type": "Question", "name": "How do I get a quote for a rental property bathroom?", "acceptedAnswer": { "@type": "Answer", "text": "Send us 3-4 photos of the bathroom through our contact page and let us know what issues need addressing. Include any time constraints such as a lease end date or settlement date. We'll have a fixed-price quote back to you within 1 business day. No call-out fee, no obligation. You can also call us directly on <?php echo timeless_phone(); ?>." } }
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
 <p class="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl mb-6" style="text-wrap:pretty;">
 The bathroom is the #1 reason tenants complain and buyers walk away. We&nbsp;fix&nbsp;rental bathrooms fast. 1-3 days. with fixed-price quotes from photos so you can approve without site visits.
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
 <p class="text-2xl font-extrabold text-white">12mo</p>
 <p class="text-[0.65rem] text-white/60 font-medium">Rental warranty</p>
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
 <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified</span><span class="text-xs font-bold">12-Month Rental Warranty</span></div>
 <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">speed</span><span class="text-xs font-bold">Fast Turnaround</span></div>
 </div>
</section>

<!-- TRUST LOGO BAR -->
<section class="py-8 sm:py-10 bg-white/50">
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
<style>
 /* Swipe indicator for the services track. These classes are NOT in the compiled
    Tailwind, they are plain CSS that front-page.php also declares inline. js/main.js
    drives .vs-bar[data-for] on every page, so only the styling had to come across. */
 .vs-bar{display:none;}
 @media (max-width:639px){
  .vs-bar{display:block;position:relative;overflow:hidden;width:72px;height:4px;border-radius:9999px;background:#dbe1e8;margin:0 auto;}
  .vs-thumb{position:absolute;left:0;top:0;height:100%;width:50%;border-radius:9999px;background:#041534;}
  #pm-services-scroll::-webkit-scrollbar{display:none;}
 }
</style>
<section class="py-16 sm:py-20 bg-surface-container-low">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <div class="text-center mb-12">
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">Services for Property Managers</h2>
 <p class="text-secondary max-w-2xl mx-auto">Every bathroom problem you encounter. we fix it. Fast, fixed-price, no fuss.</p>
 </div>
 <div id="pm-services-scroll" class="flex gap-4 overflow-x-auto snap-x snap-mandatory pt-2 px-1 pb-4 pr-6 sm:pr-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0" style="-webkit-overflow-scrolling:touch;scrollbar-width:none;">
  <a href="<?php echo esc_url( home_url( '/services/shower-regrouting/' ) ); ?>" class="w-[72vw] max-w-[300px] sm:w-auto sm:max-w-none snap-start shrink-0 block bg-white rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all group text-center">
   <div class="w-24 h-24 rounded-full bg-emerald-50 mx-auto mb-4 relative overflow-hidden">
    <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/shower-regrouting.jpg" srcset="<?php echo get_template_directory_uri(); ?>/images/homepage/shower-regrouting-400w.jpg 400w, <?php echo get_template_directory_uri(); ?>/images/homepage/shower-regrouting.jpg 800w" sizes="96px" alt="Shower Regrouting" class="w-full h-full object-cover" width="96" height="96" loading="lazy" />
   </div>
   <h3 class="text-lg font-bold text-primary mb-2">Shower Regrouting</h3>
   <p class="text-secondary text-sm leading-relaxed mb-3">Full grout removal and replacement. Stops leaks, eliminates mould.</p>
   <span class="text-xs font-bold text-primary flex items-center justify-center gap-1 group-hover:gap-2 transition-all">Learn More <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span>
  </a>
  <a href="<?php echo esc_url( home_url( '/services/bath-resurfacing/' ) ); ?>" class="w-[72vw] max-w-[300px] sm:w-auto sm:max-w-none snap-start shrink-0 block bg-white rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all group text-center">
   <div class="w-24 h-24 rounded-full bg-emerald-50 mx-auto mb-4 relative overflow-hidden">
    <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/bath-resurfacing.png" srcset="<?php echo get_template_directory_uri(); ?>/images/homepage/bath-resurfacing-400w.png 400w, <?php echo get_template_directory_uri(); ?>/images/homepage/bath-resurfacing.png 800w" sizes="96px" alt="Bath Resurfacing" class="w-full h-full object-cover" width="96" height="96" loading="lazy" />
   </div>
   <h3 class="text-lg font-bold text-primary mb-2">Bath Resurfacing</h3>
   <p class="text-secondary text-sm leading-relaxed mb-3">Restore chipped, stained or worn bathtubs to like new condition.</p>
   <span class="text-xs font-bold text-primary flex items-center justify-center gap-1 group-hover:gap-2 transition-all">Learn More <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span>
  </a>
  <a href="<?php echo esc_url( home_url( '/services/tile-resurfacing/' ) ); ?>" class="w-[72vw] max-w-[300px] sm:w-auto sm:max-w-none snap-start shrink-0 block bg-white rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all group text-center">
   <div class="w-24 h-24 rounded-full bg-emerald-50 mx-auto mb-4 relative overflow-hidden">
    <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/tile-resurfacing.png" srcset="<?php echo get_template_directory_uri(); ?>/images/homepage/tile-resurfacing-400w.png 400w, <?php echo get_template_directory_uri(); ?>/images/homepage/tile-resurfacing.png 800w" sizes="96px" alt="Tile Resurfacing" class="w-full h-full object-cover" width="96" height="96" loading="lazy" />
   </div>
   <h3 class="text-lg font-bold text-primary mb-2">Tile Resurfacing</h3>
   <p class="text-secondary text-sm leading-relaxed mb-3">Recoat dated wall tiles in a fresh high gloss white finish.</p>
   <span class="text-xs font-bold text-primary flex items-center justify-center gap-1 group-hover:gap-2 transition-all">Learn More <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span>
  </a>
  <a href="<?php echo esc_url( home_url( '/services/vanity-refinishing/' ) ); ?>" class="w-[72vw] max-w-[300px] sm:w-auto sm:max-w-none snap-start shrink-0 block bg-white rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all group text-center">
   <div class="w-24 h-24 rounded-full bg-emerald-50 mx-auto mb-4 relative overflow-hidden">
    <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/vanity-resurfacing.png" srcset="<?php echo get_template_directory_uri(); ?>/images/homepage/vanity-resurfacing-400w.png 400w, <?php echo get_template_directory_uri(); ?>/images/homepage/vanity-resurfacing.png 800w" sizes="96px" alt="Vanity Respray" class="w-full h-full object-cover" width="96" height="96" loading="lazy" />
   </div>
   <h3 class="text-lg font-bold text-primary mb-2">Vanity Respray</h3>
   <p class="text-secondary text-sm leading-relaxed mb-3">Cabinet resprayed in a modern colour. Transforms the whole bathroom.</p>
   <span class="text-xs font-bold text-primary flex items-center justify-center gap-1 group-hover:gap-2 transition-all">Learn More <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span>
  </a>
  <a href="<?php echo esc_url( home_url( '/services/basin-restoration/' ) ); ?>" class="w-[72vw] max-w-[300px] sm:w-auto sm:max-w-none snap-start shrink-0 block bg-white rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all group text-center">
   <div class="w-24 h-24 rounded-full bg-emerald-50 mx-auto mb-4 relative overflow-hidden">
    <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/basin-resurfacing.png" srcset="<?php echo get_template_directory_uri(); ?>/images/homepage/basin-resurfacing-400w.png 400w, <?php echo get_template_directory_uri(); ?>/images/homepage/basin-resurfacing.png 800w" sizes="96px" alt="Basin Restoration" class="w-full h-full object-cover" width="96" height="96" loading="lazy" />
   </div>
   <h3 class="text-lg font-bold text-primary mb-2">Basin Restoration</h3>
   <p class="text-secondary text-sm leading-relaxed mb-3">Resurface chipped or stained basins. Cheaper than replacement.</p>
   <span class="text-xs font-bold text-primary flex items-center justify-center gap-1 group-hover:gap-2 transition-all">Learn More <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span>
  </a>
  <a href="<?php echo esc_url( home_url( '/services/shower-leak-repair/' ) ); ?>" class="w-[72vw] max-w-[300px] sm:w-auto sm:max-w-none snap-start shrink-0 block bg-white rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all group text-center">
   <div class="w-24 h-24 rounded-full bg-emerald-50 mx-auto mb-4 relative overflow-hidden">
    <img src="<?php echo get_template_directory_uri(); ?>/images/homepage/shower-sealing.png" srcset="<?php echo get_template_directory_uri(); ?>/images/homepage/shower-sealing-400w.png 400w, <?php echo get_template_directory_uri(); ?>/images/homepage/shower-sealing.png 800w" sizes="96px" alt="Silicone Replacement" class="w-full h-full object-cover" width="96" height="96" loading="lazy" />
   </div>
   <h3 class="text-lg font-bold text-primary mb-2">Silicone Replacement</h3>
   <p class="text-secondary text-sm leading-relaxed mb-3">Strip and reseal all junctions. Fixes leaks and mouldy silicone.</p>
   <span class="text-xs font-bold text-primary flex items-center justify-center gap-1 group-hover:gap-2 transition-all">Learn More <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span>
  </a>

<a href="<?php echo esc_url( home_url('/services/full-bathroom-makeover/') ); ?>" class="w-[72vw] max-w-[300px] sm:w-auto sm:max-w-none snap-start shrink-0 sm:col-span-2 lg:col-span-3 bg-primary/3 rounded-xl p-6 reveal border-2 border-primary ring-1 ring-primary/10 hover:shadow-lg transition-all group">
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
  <p class="text-center text-xs text-secondary mt-3 sm:hidden">Swipe to see more services &rarr;</p>
  <div class="vs-bar" data-for="#pm-services-scroll" aria-hidden="true" style="margin-top:8px;"><span class="vs-thumb"></span></div>

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

<!-- ══════════════════════════════════════════════════════════════════
     WHY PROPERTY MANAGERS CHOOSE US. Two-column, image left / copy right.
     Was a 4-card icon grid, which made three consecutive sections (Common
     Scenarios, this, How It Works) render as the same template three times
     in a row. Column ORDER is set by markup order, not md:order-*, because
     those utilities are not in the compiled CSS.
     ══════════════════════════════════════════════════════════════════ -->
<section class="py-16 sm:py-20 bg-white">
 <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

  <div>
   <div class="rounded-xl overflow-hidden shadow-2xl" style="aspect-ratio:4/3;">
    <img src="<?php echo esc_url( get_template_directory_uri() . '/images/services/property-manager/handover.jpg' ); ?>"
         alt="Resurfaced rental bathroom photographed at handover, ready for the next tenant"
         class="w-full h-full object-cover" width="720" height="540" loading="lazy" />
   </div>
  </div>

  <div>
   <span class="inline-block py-1 px-3 bg-primary text-white text-xs font-bold tracking-widest uppercase rounded-sm mb-4">Why Managers Choose Us</span>
   <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-4">Built For The Way You Work</h2>
   <p class="text-secondary leading-relaxed mb-6">Fast approvals, minimal involvement, reliable results. You approve a price and we handle the rest.</p>

   <div class="space-y-5">
    <div class="flex items-start gap-3">
     <span class="material-symbols-outlined text-tertiary-fixed-dim shrink-0" aria-hidden="true">speed</span>
     <div>
      <h3 class="font-bold text-primary text-sm mb-1">Fast Turnaround</h3>
      <p class="text-sm text-secondary leading-relaxed">Minimise vacancy days. Most jobs completed in 1 to 3 days with minimal disruption to adjacent tenants.</p>
     </div>
    </div>
    <div class="flex items-start gap-3">
     <span class="material-symbols-outlined text-tertiary-fixed-dim shrink-0" aria-hidden="true">photo_camera</span>
     <div>
      <h3 class="font-bold text-primary text-sm mb-1">Fixed Price From Photos</h3>
      <p class="text-sm text-secondary leading-relaxed">No call-out fee. Send photos, get a fixed price quote within 24 hours, approve without a site visit.</p>
     </div>
    </div>
    <div class="flex items-start gap-3">
     <span class="material-symbols-outlined text-tertiary-fixed-dim shrink-0" aria-hidden="true">compare</span>
     <div>
      <h3 class="font-bold text-primary text-sm mb-1">Before And After Documentation</h3>
      <p class="text-sm text-secondary leading-relaxed">Professional before and after photos for condition reports, tenant communications, and listing assets.</p>
     </div>
    </div>
    <div class="flex items-start gap-3">
     <span class="material-symbols-outlined text-tertiary-fixed-dim shrink-0" aria-hidden="true">handshake</span>
     <div>
      <h3 class="font-bold text-primary text-sm mb-1">Volume Arrangements</h3>
      <p class="text-sm text-secondary leading-relaxed">Ongoing relationships welcome. Competitive pricing for regular work across your portfolio.</p>
     </div>
    </div>
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
 <p class="text-xs text-secondary">We review and send a detailed fixed-price quote within 1 business day. No surprises, no extras.</p>
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

<!-- RENTAL WARRANTY, EXPLAINED.
     This page's entire audience is landlords and agencies, so the rental carve-out has to
     live ON the page, not only behind a link to /warranty/. "Up to 5 years" is literally
     true but no reader of THIS page can ever reach 5 years, and a qualifier they have to
     go looking for does not cure a headline they act on. Allan's call, 2026-08-20.
     Hand-built, NOT [when_cards]: seven of that shortcode's classes are absent from the
     compiled CSS because it has only ever been used in the unpublished blog posts. -->
<section class="py-16 sm:py-20 bg-white">
 <div class="max-w-3xl mx-auto px-6 sm:px-8">
  <div class="max-w-2xl mx-auto text-center mb-10">
   <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-3">How The Rental Warranty Works</h2>
   <p class="text-secondary leading-relaxed">Why tenanted bathrooms carry different cover, and why it is not a resurfacing problem.</p>
  </div>

  <p class="text-secondary leading-relaxed mb-4">Tenanted bathrooms see harder, less predictable use, and nobody inspects them between visits. So resurfacing in a rental carries <strong class="text-primary">12 months</strong> of workmanship cover rather than the 5 years we give an owner occupier.</p>

  <p class="text-secondary leading-relaxed mb-4">That is not a limitation of resurfacing. It is how bathrooms work. A brand new acrylic bath chips the same way when a bottle lands on it, dulls the same way under Gumption or steel wool, and marks the same way under a mat with suction cups. Replacing the bath removes none of those risks. It just costs several times more to find that out.</p>

  <p class="text-secondary leading-relaxed">What the warranty covers is our workmanship, and application defects surface early. Peeling, bubbling and adhesion failure show in the first 30 to 60 days, well inside the 12 months.</p>

  <div class="grid md:grid-cols-2 gap-6 items-stretch my-8">
   <div class="h-full bg-surface-container-low rounded-xl p-6 border-l-4 border-primary">
    <p class="text-xs font-semibold uppercase tracking-wide text-green-700 mb-3">Covered for 12 months</p>
    <ul class="list-disc pl-6 space-y-2 text-sm text-secondary">
     <li>Peeling or lifting under normal use</li>
     <li>Bubbling or blistering in the coating</li>
     <li>Adhesion failure, the coating separating from the surface</li>
     <li>Any defect traceable to how the job was done</li>
    </ul>
   </div>
   <div class="h-full bg-surface-container-low rounded-xl p-6 border-l-4 border-surface-container">
    <p class="text-xs font-semibold uppercase tracking-wide text-primary mb-3">Not covered</p>
    <ul class="list-disc pl-6 space-y-2 text-sm text-secondary">
     <li>Chips from dropped bottles or tools</li>
     <li>Dulling from abrasive pastes, steel wool or neat bleach</li>
     <li>Mats with suction cups, trapped water lifts any finish</li>
     <li>Tenant wilful damage</li>
    </ul>
    <p class="text-xs text-secondary mt-4 opacity-70">Every one of these damages a brand new bath the same way.</p>
   </div>
  </div>

  <p class="text-secondary leading-relaxed">Two things make claims rare. We leave an aftercare card in the bathroom on every job, so whoever moves in knows what not to use on it. And photograph the finish at handover, which settles any later argument about whether the damage predated the tenancy.</p>

  <p class="text-xs text-secondary mt-6">Owner occupied bathrooms carry up to 5 years on resurfacing. Full terms per service on our <a class="text-primary font-semibold hover:underline" href="<?php echo esc_url( home_url( '/warranty/' ) ); ?>">warranty page</a>. Your rights under the Australian Consumer Law are unaffected.</p>
 </div>
</section>

<!-- FAQ -->
<section class="py-16 sm:py-20 bg-white" id="faqs">
 <div class="max-w-3xl mx-auto px-6 sm:px-8">
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-4 text-center">Property Manager FAQs</h2>
 <p class="text-secondary text-center mb-10">Common questions from property managers and landlords.</p>
 <div class="space-y-3">
 <div class="faq-item border border-surface-container rounded-xl bg-surface-container-low"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Do you work with property managers directly?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Yes. We work with property managers, real estate agencies, landlords, and strata managers across Sydney. We understand the urgency of tenant turnovers and pre-sale timelines, and we structure our service to minimise your involvement. send photos, approve the quote, we handle the rest.</p></div></div>
 <div class="faq-item border border-surface-container rounded-xl bg-surface-container-low"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Can you quote from photos only?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Yes. most of our quotes are done from photos. Send 3-4 photos of the bathroom and we&rsquo;ll return a fixed-price quote within 1 business day. No call-out fee, no site visit needed for standard jobs. For complex or large-scope work, we may request a brief site inspection.</p></div></div>
 <div class="faq-item border border-surface-container rounded-xl bg-surface-container-low"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How quickly can you complete a job?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Most jobs are completed in 1-3 days depending on scope. A simple regrout is done in a single day. A full bathroom makeover takes 2-3 days. We prioritise fast turnaround for rental properties and can often accommodate urgent timelines.</p></div></div>
 <div class="faq-item border border-surface-container rounded-xl bg-surface-container-low"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Do you provide before and after photos?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Yes. We document every job with before and after photos, sent to you on completion. These are useful for condition reports, tenant communications, listing photos, and demonstrating value to property owners.</p></div></div>
 <div class="faq-item border border-surface-container rounded-xl bg-surface-container-low"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Can you handle multiple properties?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Absolutely. We regularly work with property managers who have multiple units needing attention. We can schedule jobs back-to-back to minimise downtime across your portfolio and provide a single point of contact for all properties.</p></div></div>
 <div class="faq-item border border-surface-container rounded-xl bg-surface-container-low"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">Do you offer volume pricing?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">We welcome ongoing relationships with property managers and offer competitive pricing for regular work. Contact us to discuss volume arrangements for your portfolio. The more bathrooms, the more we can offer.</p></div></div>
 <div class="faq-item border border-surface-container rounded-xl bg-surface-container-low"><button class="w-full flex justify-between items-center p-5 text-left" onclick="toggleFaq(this)"><h3 class="font-bold text-primary text-sm pr-4">How do I get started?</h3><span class="material-symbols-outlined faq-chevron text-primary" aria-hidden="true">expand_more</span></button><div class="faq-answer px-5"><p class="text-sm text-secondary leading-relaxed pb-5">Send photos of the bathroom via the form below, text them to 0451 110 154, or email them. Include the suburb and what needs doing. We&rsquo;ll have a fixed-price quote back to you within 1 business day. No call-out fee, no obligation.</p></div></div>
 </div>
 </div>
</section>

<!-- ═══════════════════════════════════════════════════
 QUOTE FORM. PM-specific with property type + bathrooms
 ═══════════════════════════════════════════════════ -->
<!-- QUOTE FORM, homepage-style section (badge + heading + clean card), unified per Allan 2026-06-11 -->
<section class="py-16 sm:py-24 bg-surface-container-low" id="quote">
 <div class="max-w-4xl mx-auto px-6 sm:px-8 text-center mb-8">
 <span class="inline-block py-1 px-3 bg-primary text-white text-xs font-bold tracking-widest uppercase rounded-sm mb-4">Request A Quote</span>
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mb-4">Get Your Free Quote Today!</h2>
 <p class="text-secondary text-base sm:text-lg leading-relaxed" style="text-wrap:pretty;">Send us a quick photo and a few details and we&rsquo;ll send you a fixed-price quote within 24 hours.<br />No&nbsp;pressure. No&nbsp;hidden&nbsp;fees. Just&nbsp;your&nbsp;bathroom, renewed.</p>
 </div>
 <div class="max-w-xl mx-auto px-6 sm:px-8">
 <div class="bg-white rounded-2xl overflow-hidden shadow-2xl">
 <div class="p-2 sm:p-4"><?php echo do_shortcode( '[timeless_quote_form]' ); ?></div>
 </div>
 </div>
</section>

</main>


<script>
/* -- FAQ Toggle -- */
window.toggleFaq = function(btn){ var item = btn.parentElement; var isOpen = item.classList.contains('open'); document.querySelectorAll('.faq-item').forEach(function(el){ el.classList.remove('open'); }); if(!isOpen) item.classList.add('open'); };

/* -- Scroll Reveal -- */
var obs = new IntersectionObserver(function(entries){ entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); } }); }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(function(el){ obs.observe(el); });
</script>


<?php get_footer(); ?>
