<?php
/* Template Name: Suburb Service Landing */
/**
 * Dynamic template for {service} × {suburb} programmatic landing pages.
 *
 * URL pattern: /services/{service-slug}/{suburb-slug}/
 *   e.g. /services/bath-resurfacing/parramatta/
 *
 * Pulls suburb data from inc/suburb-data.php and service data from
 * inc/service-data.php based on the current page's slug + parent page's slug.
 *
 * If either lookup fails, redirects to the parent service page so the
 * visitor still lands somewhere useful.
 */

get_header();

$post_obj      = get_post();
$suburb_slug   = $post_obj->post_name;
$parent_post   = $post_obj->post_parent ? get_post( $post_obj->post_parent ) : null;
$service_slug  = $parent_post ? $parent_post->post_name : '';

$suburbs  = include get_template_directory() . '/inc/suburb-data.php';
$services = include get_template_directory() . '/inc/service-data.php';

$suburb  = $suburbs[ $suburb_slug ]  ?? null;
$service = $services[ $service_slug ] ?? null;

if ( ! $suburb || ! $service ) {
    wp_safe_redirect( home_url( '/services/' . $service_slug . '/' ) );
    exit;
}

$h1               = $service['name'] . ' in ' . $suburb['name'];
$canonical        = home_url( '/services/' . $service_slug . '/' . $suburb_slug . '/' );
$parent_url       = home_url( '/services/' . $service_slug . '/' );
$neighborhoods    = implode( ', ', $suburb['neighborhoods'] );
$last_neighborhood = array_pop( $suburb['neighborhoods'] );
$neighborhoods_natural = count( $suburb['neighborhoods'] )
    ? implode( ', ', $suburb['neighborhoods'] ) . ' and ' . $last_neighborhood
    : $last_neighborhood;
?>

<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "Service",
 "name": "<?php echo esc_js( $h1 ); ?>",
 "description": "<?php echo esc_js( 'Professional ' . $service['short_name'] . ' service for ' . $suburb['name'] . ' homes. ' . $service['description'] ); ?>",
 "provider": {
 "@type": "HomeAndConstructionBusiness",
 "name": "Timeless Resurfacing",
 "url": "https://timelessresurfacing.com.au",
 "telephone": "<?php echo timeless_phone_link(); ?>",
 "address": { "@type": "PostalAddress", "addressLocality": "<?php echo esc_js( $suburb['name'] ); ?>", "postalCode": "<?php echo esc_js( $suburb['postcode'] ); ?>", "addressRegion": "NSW", "addressCountry": "AU" }<?php echo timeless_aggregate_rating_jsonld(); ?>
 },
 "areaServed": { "@type": "Place", "name": "<?php echo esc_js( $suburb['name'] ); ?>", "geo": { "@type": "GeoCoordinates", "latitude": <?php echo floatval( $suburb['lat'] ); ?>, "longitude": <?php echo floatval( $suburb['lng'] ); ?> } },
 "serviceType": "<?php echo esc_js( $service['name'] ); ?>"
}
</script>

<script type="application/ld+json">
{
 "@context": "https://schema.org", "@type": "BreadcrumbList",
 "itemListElement": [
 { "@type": "ListItem", "position": 1, "name": "Home", "item": "<?php echo esc_url( home_url( '/' ) ); ?>" },
 { "@type": "ListItem", "position": 2, "name": "Services", "item": "<?php echo esc_url( home_url( '/services/' ) ); ?>" },
 { "@type": "ListItem", "position": 3, "name": "<?php echo esc_js( $service['name'] ); ?>", "item": "<?php echo esc_url( $parent_url ); ?>" },
 { "@type": "ListItem", "position": 4, "name": "<?php echo esc_js( $suburb['name'] ); ?>", "item": "<?php echo esc_url( $canonical ); ?>" }
 ]
}
</script>

<main id="main-content">

<!-- BREADCRUMB -->
<div class="pt-24 pb-2 px-6 sm:px-8 max-w-7xl mx-auto">
 <nav class="text-xs text-secondary" aria-label="Breadcrumb">
 <ol class="flex items-center gap-1">
 <li><a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="hover:text-primary transition-colors">Home</a></li>
 <li><span class="mx-1">/</span></li>
 <li><a href="<?php echo esc_url( home_url( '/services/' ) ); ?>" class="hover:text-primary transition-colors">Services</a></li>
 <li><span class="mx-1">/</span></li>
 <li><a href="<?php echo esc_url( $parent_url ); ?>" class="hover:text-primary transition-colors"><?php echo esc_html( $service['name'] ); ?></a></li>
 <li><span class="mx-1">/</span></li>
 <li class="text-primary font-medium"><?php echo esc_html( $suburb['name'] ); ?></li>
 </ol>
 </nav>
</div>

<!-- HERO -->
<section class="pt-4 pb-16 sm:pb-20 bg-surface">
 <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
 <div>
 <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.7rem] font-bold tracking-widest uppercase rounded-sm mb-4"><?php echo esc_html( $suburb['region'] ); ?> · <?php echo esc_html( $suburb['postcode'] ); ?></span>
 <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tighter leading-[0.95] mb-6">
 <?php echo esc_html( $service['name'] ); ?> in <span class="text-primary-soft"><?php echo esc_html( $suburb['name'] ); ?></span>
 </h1>
 <p class="text-base sm:text-lg text-secondary leading-relaxed max-w-xl mb-6">
 <?php echo esc_html( $service['description'] ); ?>
 </p>
 <p class="text-base sm:text-lg text-secondary leading-relaxed max-w-xl mb-6">
 We service <?php echo esc_html( $suburb['name'] ); ?> and surrounding suburbs including <?php echo esc_html( $neighborhoods_natural ); ?>. Most jobs completed in a single visit.
 </p>
 <div class="grid grid-cols-3 gap-3 sm:flex sm:items-center sm:gap-6 mb-8">
 <div class="text-center">
 <p class="text-base sm:text-3xl font-extrabold text-primary whitespace-nowrap"><?php echo esc_html( $service['turnaround'] ); ?></p>
 <p class="text-xs text-secondary">Most jobs</p>
 </div>
 <div class="hidden sm:block h-10 w-px bg-surface-container"></div>
 <div class="text-center">
 <p class="text-base sm:text-3xl font-extrabold text-primary whitespace-nowrap">Up to <?php echo esc_html( $service['savings_pct'] ); ?>%</p>
 <p class="text-xs text-secondary">vs replacement</p>
 </div>
 <div class="hidden sm:block h-10 w-px bg-surface-container"></div>
 <div class="text-center">
 <p class="text-base sm:text-3xl font-extrabold text-primary whitespace-nowrap"><?php echo esc_html( $service['lifespan'] ); ?></p>
 <p class="text-xs text-secondary">Lifespan</p>
 </div>
 </div>
 <div class="flex flex-col sm:flex-row gap-3">
 <a href="#quote" class="px-8 py-4 bg-primary text-white font-bold rounded-lg text-center hover:shadow-xl transition-all">Get Your Free Quote</a>
 <a href="tel:<?php echo timeless_phone_link(); ?>" class="px-8 py-4 bg-surface-container-high text-primary font-bold rounded-lg text-center hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2"><span class="material-symbols-outlined text-lg" aria-hidden="true">call</span> Call <?php echo timeless_phone(); ?></a>
 </div>
 </div>
 <div class="aspect-4/3 bg-surface-container-highest rounded-xl overflow-hidden shadow-xl">
 <img class="w-full h-full object-cover" alt="<?php echo esc_attr( $service['name'] . ' service in ' . $suburb['name'] . ' Sydney' ); ?>" src="<?php echo get_template_directory_uri(); ?>/images/services/<?php echo esc_attr( $service['hero_image'] ); ?>" loading="eager" width="800" height="600" />
 </div>
 </div>
</section>

<!-- LOCAL CONTEXT -->
<section class="py-12 sm:py-16 bg-white">
 <div class="max-w-4xl mx-auto px-6 sm:px-8">
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-4 text-center">Why <?php echo esc_html( $suburb['name'] ); ?> Bathrooms Need <?php echo esc_html( $service['name'] ); ?></h2>
 <p class="text-secondary leading-relaxed mb-4 text-center max-w-2xl mx-auto"><?php echo esc_html( $suburb['description'] ); ?></p>
 <p class="text-secondary leading-relaxed mb-4 text-center max-w-2xl mx-auto">Most homes here have <?php echo esc_html( $suburb['housing_era'] ); ?>. Original bathtubs in these properties typically show their age through chips, surface staining, dated colour, or a previous DIY paint job that's started peeling. <?php echo ucfirst( $service['short_name'] ); ?> brings them back without the cost or disruption of a full bathroom renovation.</p>
 </div>
</section>

<!-- WHY RESURFACE BENEFITS -->
<section class="py-12 sm:py-16 bg-surface-container-low">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
 <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-10 text-center">What's Included</h2>
 <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
 <?php foreach ( $service['why_resurface'] as $i => $benefit ) : ?>
 <div class="bg-white rounded-xl p-6 reveal flex items-start gap-4">
 <span class="material-symbols-outlined text-2xl text-primary mt-0.5 shrink-0" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span>
 <p class="text-sm sm:text-base text-secondary leading-relaxed"><?php echo esc_html( $benefit ); ?></p>
 </div>
 <?php endforeach; ?>
 </div>
 <div class="mt-10 text-center">
 <a href="<?php echo esc_url( $parent_url ); ?>" class="inline-flex items-center gap-2 text-primary font-bold hover:text-primary-soft transition-colors">See full <?php echo esc_html( $service['short_name'] ); ?> details <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
 </div>
 </div>
</section>

<!-- QUOTE FORM CTA -->
<section id="quote" class="py-16 sm:py-20 bg-primary text-white">
 <div class="max-w-4xl mx-auto px-6 sm:px-8 text-center">
 <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tighter mb-4">Free <?php echo esc_html( $suburb['name'] ); ?> Quote</h2>
 <p class="text-white/80 leading-relaxed max-w-2xl mx-auto mb-8">Send 3-4 photos of your bath. Fixed-price quote back within hours. No call-out fee, no obligation.</p>
 <div class="flex flex-col sm:flex-row gap-3 justify-center">
 <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" class="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold py-3 px-8 rounded-lg hover:bg-surface-container-low transition-colors">Send Photos for Quote</a>
 <a href="tel:<?php echo timeless_phone_link(); ?>" class="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors"><span class="material-symbols-outlined text-lg" aria-hidden="true">call</span> Call <?php echo timeless_phone(); ?></a>
 </div>
 </div>
</section>

<!-- OTHER SUBURBS WE SERVE -->
<section class="py-12 sm:py-16 bg-white">
 <div class="max-w-4xl mx-auto px-6 sm:px-8">
 <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-6 text-center">Other Sydney Suburbs We Service</h2>
 <div class="flex flex-wrap gap-2 justify-center">
 <?php foreach ( $suburbs as $other_slug => $other ) : ?>
 <?php if ( $other_slug === $suburb_slug ) continue; ?>
 <a href="<?php echo esc_url( home_url( '/services/' . $service_slug . '/' . $other_slug . '/' ) ); ?>" class="inline-block px-4 py-2 bg-surface-container-low text-primary text-sm font-medium rounded-lg hover:bg-primary hover:text-white transition-colors">
 <?php echo esc_html( $service['short_name'] ); ?> in <?php echo esc_html( $other['name'] ); ?>
 </a>
 <?php endforeach; ?>
 </div>
 <div class="mt-8 text-center">
 <a href="<?php echo esc_url( home_url( '/areas/' ) ); ?>" class="text-primary font-bold hover:text-primary-soft transition-colors">See all service areas →</a>
 </div>
 </div>
</section>

</main>

<?php get_footer(); ?>
