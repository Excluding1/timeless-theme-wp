<?php /* Template Name: Gallery */ ?>
<?php get_header(); ?>

<!-- Schema: ImageGallery -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "Before & After Bathroom Resurfacing Gallery",
    "description": "Real bathroom resurfacing transformations across Greater Sydney and NSW.",
    "url": "<?php echo esc_url( home_url( '/gallery/' ) ); ?>",
    "about": {
        "@type": "Service",
        "name": "Bathroom Resurfacing",
        "provider": {
            "@type": "HomeAndConstructionBusiness",
            "name": "Timeless Resurfacing",
            "url": "https://timelessresurfacing.com.au"
        }
    }
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
                <li class="text-primary font-semibold">Gallery</li>
            </ol>
        </nav>
    </div>
</div>

<!-- HERO -->
<section class="pt-6 pb-12 sm:pb-16 bg-surface">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.7rem] font-bold tracking-widest uppercase rounded mb-6">Real Results</span>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tighter leading-[0.95] mb-4">Before &amp; After Gallery</h1>
        <p class="text-base sm:text-lg text-secondary leading-relaxed max-w-2xl">Real bathroom transformations across Greater Sydney and NSW. Every project shown was completed in one to two days with zero demolition.</p>
        <div class="h-1 w-20 bg-tertiary-fixed-dim mt-6"></div>
    </div>
</section>

<!-- FILTER BUTTONS -->
<?php $t = get_template_directory_uri(); ?>
<!-- FILTER BUTTONS — Scrollable row -->
<section class="bg-surface pb-8">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="flex gap-2 overflow-x-auto pb-2" id="gallery-filters" style="-webkit-overflow-scrolling:touch;scrollbar-width:none;">
            <button class="gallery-filter flex-shrink-0 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg transition-all whitespace-nowrap" data-filter="all">All</button>
            <button class="gallery-filter flex-shrink-0 px-4 py-2 bg-surface-container-high text-secondary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all whitespace-nowrap" data-filter="bath-resurfacing">Bath Resurfacing</button>
            <button class="gallery-filter flex-shrink-0 px-4 py-2 bg-surface-container-high text-secondary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all whitespace-nowrap" data-filter="tile-resurfacing">Tile Resurfacing</button>
            <button class="gallery-filter flex-shrink-0 px-4 py-2 bg-surface-container-high text-secondary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all whitespace-nowrap" data-filter="regrouting">Regrouting</button>
            <button class="gallery-filter flex-shrink-0 px-4 py-2 bg-surface-container-high text-secondary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all whitespace-nowrap" data-filter="shower-sealing">Shower Sealing</button>
            <button class="gallery-filter flex-shrink-0 px-4 py-2 bg-surface-container-high text-secondary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all whitespace-nowrap" data-filter="vanity">Vanity</button>
            <button class="gallery-filter flex-shrink-0 px-4 py-2 bg-surface-container-high text-secondary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all whitespace-nowrap" data-filter="basin">Basin</button>
        </div>
    </div>
</section>

<!-- GALLERY GRID — Real before/after images -->
<section class="py-8 sm:py-12 bg-surface">
    <div class="max-w-7xl mx-auto px-6 sm:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" id="gallery-grid">
            <!-- BATH RESURFACING (6 cards) -->
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="bath-resurfacing">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/bath-resurfacing/hero-before.png" alt="Bathtub before professional resurfacing" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/bath-resurfacing/hero-after.png" alt="Bathtub after professional resurfacing" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Bathtub Resurfacing</span></div>
            </article>
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="bath-resurfacing">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/bath-resurfacing/stain-before.png" alt="Stained yellowed bathtub" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/bath-resurfacing/stain-after.png" alt="Bathtub after stain removal" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Bathtub Resurfacing</span></div>
            </article>
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="bath-resurfacing">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/bath-resurfacing/chips-before.png" alt="Chipped bathtub before repair" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/bath-resurfacing/chips-after.png" alt="Bathtub after chip repair" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Bathtub Resurfacing</span></div>
            </article>
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="bath-resurfacing">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/bath-resurfacing/colour-before.png" alt="Faded outdated bath colour" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/bath-resurfacing/colour-after.png" alt="Bathtub after colour change" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Bathtub Resurfacing</span></div>
            </article>
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="bath-resurfacing">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/bath-resurfacing/worn-before.png" alt="Worn rough bathtub surface" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/bath-resurfacing/worn-after.png" alt="Bathtub after resurfacing smooth finish" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Bathtub Resurfacing</span></div>
            </article>
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="bath-resurfacing">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/bath-resurfacing/bathtub-before.png" alt="Peeling bathtub before resurfacing" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/bath-resurfacing/bathtub-after.png" alt="Bathtub after full resurfacing" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Bathtub Resurfacing</span></div>
            </article>
            <!-- TILE RESURFACING (4 cards) -->
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="tile-resurfacing">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/tile-resurfacing/hero-before.png" alt="Tiles before resurfacing" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/tile-resurfacing/hero-after.png" alt="Tiles after professional resurfacing" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Tile Resurfacing</span></div>
            </article>
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="tile-resurfacing">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/tile-resurfacing/dated-before.png" alt="Outdated pink tiles" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/tile-resurfacing/dated-after.png" alt="Modern tiles after resurfacing" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Tile Resurfacing</span></div>
            </article>
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="tile-resurfacing">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/tile-resurfacing/cracked-before.png" alt="Cracked tiles" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/tile-resurfacing/cracked-after.png" alt="Repaired tiles" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Tile Resurfacing</span></div>
            </article>
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="tile-resurfacing">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/tile-resurfacing/tile-wall-before.png" alt="Dated wall tiles" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/tile-resurfacing/tile-wall-after.png" alt="Clean wall tiles" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Tile Resurfacing</span></div>
            </article>
            <!-- REGROUTING — Shower + Floor combined (6 cards) -->
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="regrouting">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/regrouting/mouldy-before.png" alt="Mouldy shower grout" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/regrouting/mouldy-after.png" alt="Clean grout after regrouting" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Shower Regrouting</span></div>
            </article>
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="regrouting">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/regrouting/crumbling-before.png" alt="Crumbling shower grout" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/regrouting/crumbling-after.png" alt="Repaired shower grout" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Shower Regrouting</span></div>
            </article>
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="regrouting">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/regrouting/discoloured-before.png" alt="Discoloured stained grout" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/regrouting/discoloured-after.png" alt="Clean white grout" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Shower Regrouting</span></div>
            </article>
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="regrouting">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/regrouting/floor-crumbling-before.png" alt="Crumbling floor grout" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/regrouting/floor-crumbling-after.png" alt="Floor grout after repair" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Floor Regrouting</span></div>
            </article>
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="regrouting">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/regrouting/floor-discoloured-before.png" alt="Discoloured floor grout" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/regrouting/floor-discoloured-after.png" alt="Clean floor grout" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Floor Regrouting</span></div>
            </article>
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="regrouting">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/regrouting/floor-mouldy-before.png" alt="Mouldy floor grout" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/regrouting/floor-mouldy-after.png" alt="Clean floor grout" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Floor Regrouting</span></div>
            </article>
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="regrouting">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/regrouting/tile-grout-before.png" alt="Dirty stained tile grout" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/regrouting/tile-grout-after.png" alt="Clean tile grout after regrouting" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Tile Regrouting</span></div>
            </article>
            <!-- SHOWER SEALING (3 cards) -->
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="shower-sealing">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/shower-sealing/hero-before.png" alt="Shower before sealing" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/shower-sealing/hero-after.png" alt="Shower after professional sealing" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Shower Sealing</span></div>
            </article>
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="shower-sealing">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/shower-sealing/leaking-before.png" alt="Leaking shower silicone" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/shower-sealing/leaking-after.png" alt="Sealed shower silicone" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Shower Sealing</span></div>
            </article>
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="shower-sealing">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/shower-sealing/mouldy-before.png" alt="Mouldy shower corners" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/shower-sealing/mouldy-after.png" alt="Clean sealed shower corners" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Shower Sealing</span></div>
            </article>
            <!-- VANITY (3 cards) -->
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="vanity">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/vanity-refinishing/peeling-before.png" alt="Vanity with peeling laminate" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/vanity-refinishing/peeling-after.png" alt="Refinished vanity" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Vanity Refinishing</span></div>
            </article>
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="vanity">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/vanity-refinishing/dated-before.png" alt="Dated dull vanity" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/vanity-refinishing/dated-after.png" alt="Modern refinished vanity" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Vanity Refinishing</span></div>
            </article>
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="vanity">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/vanity-refinishing/scratched-before.png" alt="Scratched stained vanity" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/vanity-refinishing/scratched-after.png" alt="Smooth refinished vanity" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Vanity Refinishing</span></div>
            </article>
            <!-- BASIN (4 cards) -->
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="basin">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/basin-restoration/hero-before.png" alt="Basin before restoration" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/basin-restoration/hero-after.png" alt="Basin after professional restoration" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Basin Restoration</span></div>
            </article>
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="basin">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/basin-restoration/chips-before.png" alt="Chipped and cracked basin" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/basin-restoration/chips-after.png" alt="Basin after chip repair" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Basin Restoration</span></div>
            </article>
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="basin">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/basin-restoration/stain-before.png" alt="Stained discoloured basin" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/basin-restoration/stain-after.png" alt="Basin after stain removal" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Basin Restoration</span></div>
            </article>
            <article class="gallery-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all" data-category="basin">
                <div class="grid grid-cols-2"><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/basin-restoration/worn-before.png" alt="Worn scratched basin" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 left-2 bg-black/60 text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Before</span></div><div class="relative aspect-square overflow-hidden"><img src="<?php echo $t; ?>/images/gallery/basin-restoration/worn-after.png" alt="Basin after worn finish restoration" class="w-full h-full object-cover" loading="lazy" /><span class="absolute top-2 right-2 bg-white/80 text-primary text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">After</span></div></div>
                <div class="p-5 flex justify-center"><span class="text-[0.7rem] bg-tertiary-fixed-dim/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">Basin Restoration</span></div>
            </article>
        </div>
        <div class="text-center mt-10" id="load-more-wrap">
            <button id="load-more-btn" class="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-lg hover:shadow-xl transition-all">Load More Transformations <span class="material-symbols-outlined text-base" aria-hidden="true">expand_more</span></button>
        </div>
        <p class="text-center text-sm text-secondary mt-6">More transformations added as we complete new jobs across Sydney.</p>
    </div>
</section>

<!-- Gallery Filter + Load More JS -->
<script>
var CARDS_PER_PAGE = 9;
var visibleCount = CARDS_PER_PAGE;
var currentFilter = 'all';
function getFilteredCards(){var a=Array.from(document.querySelectorAll('.gallery-card'));if(currentFilter==='all')return a;return a.filter(function(c){return c.getAttribute('data-category')===currentFilter;});}
function updateVisibility(){var f=getFilteredCards();f.forEach(function(c,i){c.style.display=i<visibleCount?'':'none';});document.querySelectorAll('.gallery-card').forEach(function(c){if(currentFilter!=='all'&&c.getAttribute('data-category')!==currentFilter)c.style.display='none';});var b=document.getElementById('load-more-wrap');if(b)b.style.display=visibleCount>=f.length?'none':'';}
document.querySelectorAll('.gallery-filter').forEach(function(btn){btn.addEventListener('click',function(){currentFilter=this.getAttribute('data-filter');visibleCount=CARDS_PER_PAGE;document.querySelectorAll('.gallery-filter').forEach(function(b){b.className=b.className.replace('bg-primary text-white','bg-surface-container-high text-secondary');});this.className=this.className.replace('bg-surface-container-high text-secondary','bg-primary text-white');updateVisibility();});});
document.getElementById('load-more-btn').addEventListener('click',function(){visibleCount+=CARDS_PER_PAGE;updateVisibility();});
updateVisibility();
</script>

<!-- CTA -->
<section class="py-16 sm:py-24 bg-primary text-white">
    <div class="max-w-3xl mx-auto px-6 sm:px-8 text-center">
        <span class="material-symbols-outlined text-5xl text-tertiary-fixed-dim mb-4" aria-hidden="true">auto_awesome</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tighter mb-4">Ready for Your Transformation?</h2>
        <p class="text-on-primary-container text-base sm:text-lg mb-8 max-w-xl mx-auto">Send us photos of your bathroom and get a fixed-price quote within hours. No obligation, no surprises.</p>
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

<!-- LIGHTBOX POPUP -->
<div id="lightbox" class="fixed inset-0 z-[9999] hidden" style="background:rgba(0,0,0,0.92);">
    <button id="lb-close" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10" aria-label="Close"><span class="material-symbols-outlined text-white text-2xl">close</span></button>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl px-4">
        <div class="relative"><img id="lb-image" src="" alt="" class="w-full rounded-xl shadow-2xl" /><span id="lb-badge" class="absolute top-3 left-3 bg-black/60 text-white text-[0.65rem] font-bold uppercase tracking-widest px-3 py-1 rounded">Before</span></div>
        <div class="flex items-center justify-center gap-4 mt-6">
            <button id="lb-prev" class="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Previous"><span class="material-symbols-outlined text-white text-2xl">chevron_left</span></button>
            <span id="lb-label" class="text-white text-sm font-bold uppercase tracking-wider">Before</span>
            <button id="lb-next" class="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Next"><span class="material-symbols-outlined text-white text-2xl">chevron_right</span></button>
        </div>
    </div>
</div>
<script>
(function(){
    var lb=document.getElementById('lightbox'),lbImg=document.getElementById('lb-image'),lbBadge=document.getElementById('lb-badge'),lbLabel=document.getElementById('lb-label'),images=[],idx=0;
    document.querySelectorAll('.gallery-card').forEach(function(card){
        var imgs=card.querySelectorAll('img'); if(imgs.length<2) return;
        var tag=card.querySelector('span[class*="tertiary-fixed"]'); var label=tag?tag.textContent.trim():'';
        card.style.cursor='pointer';
        card.addEventListener('click',function(){
            images=[{src:imgs[0].src,state:'Before',label:label},{src:imgs[1].src,state:'After',label:label}];
            idx=0; showImage(); lb.classList.remove('hidden'); document.body.style.overflow='hidden';
        });
    });
    function showImage(){
        lbImg.src=images[idx].src; lbBadge.textContent=images[idx].state;
        lbLabel.textContent=images[idx].state+' \u2014 '+images[idx].label;
        lbBadge.className=idx===0?'absolute top-3 left-3 bg-black/60 text-white text-[0.65rem] font-bold uppercase tracking-widest px-3 py-1 rounded':'absolute top-3 right-3 bg-white/80 text-[#041534] text-[0.65rem] font-bold uppercase tracking-widest px-3 py-1 rounded';
    }
    function closeLb(){lb.classList.add('hidden');document.body.style.overflow='';}
    document.getElementById('lb-close').addEventListener('click',closeLb);
    lb.addEventListener('click',function(e){if(e.target===lb)closeLb();});
    document.addEventListener('keydown',function(e){if(lb.classList.contains('hidden'))return;if(e.key==='Escape')closeLb();if(e.key==='ArrowLeft'||e.key==='ArrowRight'){idx=idx===0?1:0;showImage();}});
    document.getElementById('lb-prev').addEventListener('click',function(){idx=idx===0?1:0;showImage();});
    document.getElementById('lb-next').addEventListener('click',function(){idx=idx===0?1:0;showImage();});
})();
</script>

<?php get_footer(); ?>
