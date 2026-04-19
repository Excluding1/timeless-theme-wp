<?php /* Template Name: Service Areas */ ?>
<?php get_header(); ?>

<!-- Schema: Service with areaServed -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Bathroom Resurfacing",
    "description": "Professional bathroom resurfacing, shower regrouting, bath restoration, tile resurfacing, vanity refinishing, basin restoration, and shower leak repair across Sydney and NSW.",
    "url": "<?php echo esc_url( home_url( '/areas/' ) ); ?>",
    "provider": {
        "@type": "HomeAndConstructionBusiness",
        "name": "Timeless Resurfacing",
        "url": "https://timelessresurfacing.com.au",
        "telephone": "<?php echo timeless_phone_link(); ?>",
        "address": { "@type": "PostalAddress", "addressLocality": "Sydney", "addressRegion": "NSW", "addressCountry": "AU" }
    },
    "areaServed": [
        { "@type": "City", "name": "Sydney" },
        { "@type": "Place", "name": "Eastern Suburbs, Sydney" },
        { "@type": "Place", "name": "Inner West, Sydney" },
        { "@type": "Place", "name": "North Shore, Sydney" },
        { "@type": "Place", "name": "Northern Beaches, Sydney" },
        { "@type": "Place", "name": "Sutherland Shire, Sydney" },
        { "@type": "City", "name": "Parramatta" },
        { "@type": "Place", "name": "Hills District, Sydney" },
        { "@type": "Place", "name": "Blacktown" },
        { "@type": "City", "name": "Penrith" },
        { "@type": "Place", "name": "Blue Mountains" },
        { "@type": "City", "name": "Wollongong" },
        { "@type": "Place", "name": "Illawarra" },
        { "@type": "Place", "name": "Central Coast" },
        { "@type": "City", "name": "Campbelltown" },
        { "@type": "Place", "name": "Macarthur" }
    ]
}
</script>

<main id="main-content">

<!-- BREADCRUMB -->
<div class="pt-24 sm:pt-28 bg-surface">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <nav class="text-xs text-secondary" aria-label="Breadcrumb">
            <ol class="flex items-center gap-1.5">
                <li><a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="hover:text-primary transition-colors">Home</a></li>
                <li><span class="material-symbols-outlined text-xs text-outline-variant" aria-hidden="true">chevron_right</span></li>
                <li class="text-primary font-semibold">Service Areas</li>
            </ol>
        </nav>
    </div>
</div>

<!-- HERO -->
<section class="pt-6 pb-12 sm:pb-16 bg-surface">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.7rem] font-bold tracking-widest uppercase rounded mb-6">All of Greater Sydney &amp; Beyond</span>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tighter leading-[0.95] mb-4">Bathroom Resurfacing Across Sydney &amp; NSW</h1>
        <p class="text-base sm:text-lg text-secondary leading-relaxed max-w-2xl">We service the entire Greater Sydney region and beyond. Same-day photo-based quoting available for all areas.</p>
        <div class="h-1 w-20 bg-tertiary-fixed-dim mt-6"></div>
    </div>
</section>

<!-- SERVICE AREA MAP — Leaflet.js + OpenStreetMap (free, no API key) -->
<section class="pb-12 sm:pb-16 bg-surface">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="rounded-2xl overflow-hidden shadow-lg">
            <div id="service-map" class="w-full" style="height:450px; z-index:0;"></div>
        </div>
    </div>
</section>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
(function(){
    var map = L.map('service-map', { scrollWheelZoom: false }).setView([-33.75, 150.95], 10);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 18
    }).addTo(map);

    var serviceArea = [
        [-33.20, 151.10], [-33.25, 151.45], [-33.40, 151.50], [-33.55, 151.45],
        [-33.75, 151.32], [-33.85, 151.28], [-34.00, 151.22], [-34.08, 151.15],
        [-34.25, 151.00], [-34.43, 150.90], [-34.58, 150.85], [-34.40, 150.65],
        [-34.10, 150.60], [-33.85, 150.55], [-33.70, 150.30], [-33.55, 150.25],
        [-33.45, 150.45], [-33.35, 150.65], [-33.20, 150.75], [-33.15, 150.95],
        [-33.20, 151.10]
    ];

    var polygon = L.polygon(serviceArea, {
        color: '#dc2626', weight: 3, fillColor: '#dc2626', fillOpacity: 0.06, dashArray: null
    }).addTo(map);

    var marker = L.marker([-33.86, 151.21]).addTo(map);
    marker.bindPopup('<strong>Timeless Resurfacing</strong><br>Serving all of Greater Sydney<br><span style="color:#e7c08b;">&#9733;&#9733;&#9733;&#9733;&#9733;</span> 5.0').openPopup();

    map.fitBounds(polygon.getBounds().pad(0.05));
})();
</script>

<!-- REGIONS GRID -->
<section class="py-12 sm:py-20 bg-surface-container-low">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">

        <!-- Sydney Metro -->
        <div class="mb-16 reveal">
            <div class="mb-8">
                <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter mb-2">Sydney Metro</h2>
                <p class="text-secondary text-sm">Core metropolitan area and surrounding suburbs.</p>
                <div class="h-1 w-16 bg-tertiary-fixed-dim mt-3"></div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="bg-white rounded-xl p-6 hover:shadow-lg transition-all group">
                    <div class="flex items-start gap-4">
                        <span class="material-symbols-outlined text-2xl text-primary flex-shrink-0 mt-0.5" aria-hidden="true">location_on</span>
                        <div class="flex-1">
                            <h3 class="font-bold text-primary mb-1">Sydney CBD &amp; Inner City</h3>
                            <p class="text-xs text-secondary leading-relaxed mb-3">Surry Hills, Darlinghurst, Redfern, Glebe, Ultimo, Pyrmont</p>
                            <a href="<?php echo esc_url( home_url( '/#quote' ) ); ?>" class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">Get Quote for CBD <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></a>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-6 hover:shadow-lg transition-all group">
                    <div class="flex items-start gap-4">
                        <span class="material-symbols-outlined text-2xl text-primary flex-shrink-0 mt-0.5" aria-hidden="true">location_on</span>
                        <div class="flex-1">
                            <h3 class="font-bold text-primary mb-1">Eastern Suburbs</h3>
                            <p class="text-xs text-secondary leading-relaxed mb-3">Bondi, Coogee, Randwick, Maroubra, Double Bay, Woollahra</p>
                            <a href="<?php echo esc_url( home_url( '/#quote' ) ); ?>" class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">Get Quote for Eastern Suburbs <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></a>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-6 hover:shadow-lg transition-all group">
                    <div class="flex items-start gap-4">
                        <span class="material-symbols-outlined text-2xl text-primary flex-shrink-0 mt-0.5" aria-hidden="true">location_on</span>
                        <div class="flex-1">
                            <h3 class="font-bold text-primary mb-1">Inner West</h3>
                            <p class="text-xs text-secondary leading-relaxed mb-3">Newtown, Marrickville, Leichhardt, Ashfield, Dulwich Hill, Enmore</p>
                            <a href="<?php echo esc_url( home_url( '/#quote' ) ); ?>" class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">Get Quote for Inner West <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></a>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-6 hover:shadow-lg transition-all group">
                    <div class="flex items-start gap-4">
                        <span class="material-symbols-outlined text-2xl text-primary flex-shrink-0 mt-0.5" aria-hidden="true">location_on</span>
                        <div class="flex-1">
                            <h3 class="font-bold text-primary mb-1">North Shore</h3>
                            <p class="text-xs text-secondary leading-relaxed mb-3">Chatswood, Lane Cove, Mosman, Neutral Bay, Cremorne, Willoughby</p>
                            <a href="<?php echo esc_url( home_url( '/#quote' ) ); ?>" class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">Get Quote for North Shore <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></a>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-6 hover:shadow-lg transition-all group">
                    <div class="flex items-start gap-4">
                        <span class="material-symbols-outlined text-2xl text-primary flex-shrink-0 mt-0.5" aria-hidden="true">location_on</span>
                        <div class="flex-1">
                            <h3 class="font-bold text-primary mb-1">Northern Beaches</h3>
                            <p class="text-xs text-secondary leading-relaxed mb-3">Manly, Dee Why, Brookvale, Mona Vale, Narrabeen, Freshwater</p>
                            <a href="<?php echo esc_url( home_url( '/#quote' ) ); ?>" class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">Get Quote for Northern Beaches <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></a>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-6 hover:shadow-lg transition-all group">
                    <div class="flex items-start gap-4">
                        <span class="material-symbols-outlined text-2xl text-primary flex-shrink-0 mt-0.5" aria-hidden="true">location_on</span>
                        <div class="flex-1">
                            <h3 class="font-bold text-primary mb-1">Sutherland Shire</h3>
                            <p class="text-xs text-secondary leading-relaxed mb-3">Cronulla, Miranda, Caringbah, Engadine, Sutherland, Sylvania</p>
                            <a href="<?php echo esc_url( home_url( '/#quote' ) ); ?>" class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">Get Quote for Sutherland Shire <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Western Sydney -->
        <div class="mb-16 reveal">
            <div class="mb-8">
                <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter mb-2">Western Sydney</h2>
                <p class="text-secondary text-sm">Greater Western Sydney and Blue Mountains corridor.</p>
                <div class="h-1 w-16 bg-tertiary-fixed-dim mt-3"></div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="bg-white rounded-xl p-6 hover:shadow-lg transition-all group">
                    <div class="flex items-start gap-4">
                        <span class="material-symbols-outlined text-2xl text-primary flex-shrink-0 mt-0.5" aria-hidden="true">location_on</span>
                        <div class="flex-1">
                            <h3 class="font-bold text-primary mb-1">Parramatta &amp; Greater Parramatta</h3>
                            <p class="text-xs text-secondary leading-relaxed mb-3">Parramatta, Rydalmere, Granville, Merrylands, Harris Park</p>
                            <a href="<?php echo esc_url( home_url( '/#quote' ) ); ?>" class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">Get Quote for Parramatta <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></a>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-6 hover:shadow-lg transition-all group">
                    <div class="flex items-start gap-4">
                        <span class="material-symbols-outlined text-2xl text-primary flex-shrink-0 mt-0.5" aria-hidden="true">location_on</span>
                        <div class="flex-1">
                            <h3 class="font-bold text-primary mb-1">Hills District</h3>
                            <p class="text-xs text-secondary leading-relaxed mb-3">Castle Hill, Baulkham Hills, Bella Vista, Kellyville, Rouse Hill</p>
                            <a href="<?php echo esc_url( home_url( '/#quote' ) ); ?>" class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">Get Quote for Hills District <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></a>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-6 hover:shadow-lg transition-all group">
                    <div class="flex items-start gap-4">
                        <span class="material-symbols-outlined text-2xl text-primary flex-shrink-0 mt-0.5" aria-hidden="true">location_on</span>
                        <div class="flex-1">
                            <h3 class="font-bold text-primary mb-1">Blacktown, Penrith &amp; Blue Mountains</h3>
                            <p class="text-xs text-secondary leading-relaxed mb-3">Blacktown, Mt Druitt, Penrith, Springwood, Katoomba</p>
                            <a href="<?php echo esc_url( home_url( '/#quote' ) ); ?>" class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">Get Quote for Western Sydney <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- South & Regional -->
        <div class="reveal">
            <div class="mb-8">
                <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter mb-2">South &amp; Regional</h2>
                <p class="text-secondary text-sm">Southern Sydney, Illawarra, Central Coast, and Macarthur regions.</p>
                <div class="h-1 w-16 bg-tertiary-fixed-dim mt-3"></div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="bg-white rounded-xl p-6 hover:shadow-lg transition-all group">
                    <div class="flex items-start gap-4">
                        <span class="material-symbols-outlined text-2xl text-primary flex-shrink-0 mt-0.5" aria-hidden="true">location_on</span>
                        <div class="flex-1">
                            <h3 class="font-bold text-primary mb-1">Wollongong &amp; Illawarra</h3>
                            <p class="text-xs text-secondary leading-relaxed mb-3">Wollongong, Shellharbour, Kiama, Thirroul, Corrimal</p>
                            <a href="<?php echo esc_url( home_url( '/#quote' ) ); ?>" class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">Get Quote for Wollongong <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></a>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-6 hover:shadow-lg transition-all group">
                    <div class="flex items-start gap-4">
                        <span class="material-symbols-outlined text-2xl text-primary flex-shrink-0 mt-0.5" aria-hidden="true">location_on</span>
                        <div class="flex-1">
                            <h3 class="font-bold text-primary mb-1">Central Coast</h3>
                            <p class="text-xs text-secondary leading-relaxed mb-3">Gosford, Terrigal, Erina, Tuggerah, Woy Woy, Avoca Beach</p>
                            <a href="<?php echo esc_url( home_url( '/#quote' ) ); ?>" class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">Get Quote for Central Coast <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></a>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-6 hover:shadow-lg transition-all group">
                    <div class="flex items-start gap-4">
                        <span class="material-symbols-outlined text-2xl text-primary flex-shrink-0 mt-0.5" aria-hidden="true">location_on</span>
                        <div class="flex-1">
                            <h3 class="font-bold text-primary mb-1">Campbelltown &amp; Macarthur</h3>
                            <p class="text-xs text-secondary leading-relaxed mb-3">Campbelltown, Camden, Narellan, Ingleburn, Picton</p>
                            <a href="<?php echo esc_url( home_url( '/#quote' ) ); ?>" class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">Get Quote for Macarthur <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</section>

<!-- TRAVEL INFO -->
<section class="py-10 bg-white">
    <div class="max-w-4xl mx-auto px-6 sm:px-8">
    </div>
</section>

<!-- CTA -->
<section class="py-16 sm:py-24 bg-primary text-white">
    <div class="max-w-3xl mx-auto px-6 sm:px-8 text-center">
        <span class="material-symbols-outlined text-5xl text-tertiary-fixed-dim mb-4" aria-hidden="true">pin_drop</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tighter mb-4">Not Sure If We Cover Your Area?</h2>
        <p class="text-on-primary-container text-base sm:text-lg mb-8 max-w-xl mx-auto">Contact us and we'll let you know. We're always expanding our coverage across NSW.</p>
        <a class="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary font-bold rounded-lg hover:shadow-xl transition-all text-lg" href="<?php echo esc_url( home_url( '/#quote' ) ); ?>">Get a Free Quote <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></a>
    </div>
</section>

<!-- TRUST BAR -->
<section class="bg-primary-container text-white py-5">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-2 gap-3 sm:grid-cols-none sm:flex sm:flex-wrap sm:justify-between items-center sm:gap-4 sm:gap-6">
        <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified_user</span><span class="text-xs font-bold">Experienced &amp; Insured</span></div>
        <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">security</span><span class="text-xs font-bold">Public Liability Insured</span></div>
        <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">gavel</span><span class="text-xs font-bold">NSW Fair Trading Compliant</span></div>
        <div class="flex items-start sm:items-center gap-2"><span class="material-symbols-outlined text-tertiary-fixed-dim" aria-hidden="true">verified</span><span class="text-xs font-bold">Up to 3-Year Warranty</span></div>
    </div>
</section>

</main>

<?php get_footer(); ?>
