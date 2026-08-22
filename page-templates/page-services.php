<?php
/**
 * Template Name: Services Hub
 *
 * The /services/ landing page.
 *
 * Why this file exists: every one of the 19 service pages emits a BreadcrumbList
 * whose position 2 is "Services" → https://timelessresurfacing.com.au/services/.
 * That URL was a WordPress page with no template and no content, so it rendered a
 * one-word <main> and sat in sitemap.xml as an empty indexed page (verified live
 * 2026-08-22). This turns it into a real hub: it makes the breadcrumb honest, gives
 * the 19 service pages a genuine internal-linking parent, and targets the
 * "bathroom resurfacing services sydney" intent the individual pages cannot.
 *
 * House rules observed: no prices anywhere; warranty stated per material, never
 * blanket; the words "guarantee" and "written" do not appear.
 *
 * @package Timeless_Resurfacing
 */

get_header();

/* One source of truth for the hub. Order inside each group is deliberate:
   the terms with the most search demand lead. */
$timeless_service_groups = array(
    array(
        'key'   => 'resurfacing',
        'icon'  => 'format_paint',
        'title' => 'Resurfacing',
        'intro' => 'A new surface bonded onto the one you already have. No demolition, no skip bin, no re-tiling, and the bathroom is usually back in use the next day.',
        'items' => array(
            array( 'bath-resurfacing',            'Bath Resurfacing',            'Chipped, stained or dated baths taken back to a smooth gloss finish.' ),
            array( 'tile-resurfacing',            'Tile Resurfacing',            'A colour change over sound wall tiles, without stripping them off the wall.' ),
            array( 'bathroom-tile-resurfacing',   'Bathroom Tile Resurfacing',   'The same coating system applied to a full bathroom rather than one surface.' ),
            array( 'vanity-refinishing',          'Vanity Refinishing',          'Benchtops and cabinet doors resprayed, including stone-fleck finishes.' ),
            array( 'vanity-respray',              'Vanity Respray',              'Colour change on a vanity that is structurally sound but visually tired.' ),
            array( 'basin-restoration',           'Basin Restoration',           'Porcelain, cast iron and acrylic basins repaired or fully resurfaced.' ),
            array( 'stained-bathtub-resurfacing', 'Stained Bath Resurfacing',    'For staining that has gone into the surface and no longer cleans off.' ),
            array( 'peeling-bathtub-resurfacing', 'Peeling Bath Resurfacing',    'An earlier coating that has let go, stripped back before anything new goes on.' ),
            array( 'full-bathroom-makeover',      'Full Bathroom Makeover',      'Bath, tiles, vanity and basin done together as one job.' ),
        ),
    ),
    array(
        'key'   => 'regrouting',
        'icon'  => 'grid_on',
        'title' => 'Regrouting &amp; sealing',
        'intro' => 'The joints, not the tiles. Old grout and silicone are cut out and replaced, which is what stops most shower leaks and nearly all recurring mould.',
        'items' => array(
            array( 'shower-regrouting',           'Shower Regrouting',           'Full grout removal and replacement in epoxy or cement grout.' ),
            array( 'floor-tile-regrouting',       'Floor Tile Regrouting',       'Bathroom and laundry floors, where movement cracks the joints first.' ),
            array( 'epoxy-grout-upgrade',         'Epoxy Grout Upgrade',         'Moving from cement to epoxy grout, which does not absorb water.' ),
            array( 'cracked-grout-repair',        'Cracked Grout Repair',        'Cracked joints repaired before water gets behind the tiles.' ),
            array( 'mouldy-shower-grout',         'Mouldy Shower Grout',         'Mould that keeps coming back is usually living inside the grout, not on it.' ),
            array( 'mouldy-silicone-replacement', 'Mouldy Silicone Replacement', 'Perished or blackened silicone cut out and replaced.' ),
            array( 'shower-leak-repair',          'Shower Leak Repair',          'Leaks fixed at the joints and seals, without removing the tiles.' ),
        ),
    ),
    array(
        'key'   => 'repairs',
        'icon'  => 'handyman',
        'title' => 'Repairs &amp; specialist work',
        'intro' => 'Smaller, targeted jobs, and the work we do for people managing more than one bathroom.',
        'items' => array(
            array( 'chipped-bathtub-repair',            'Chipped Bath Repair',    'A single chip filled and blended, where the rest of the bath is sound.' ),
            array( 'basin-chip-repair',                 'Basin Chip Repair',      'The same repair on a basin, most often around the tap holes or the rim.' ),
            array( 'property-manager-bathroom-services','For Property Managers',  'Rental turnarounds, multi-unit work, and reporting agents can forward.' ),
        ),
    ),
);
?>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "<?php echo esc_url( home_url( '/' ) ); ?>" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "<?php echo esc_url( home_url( '/services/' ) ); ?>" }
      ]
    },
    {
      "@type": "CollectionPage",
      "name": "Bathroom Resurfacing and Regrouting Services in Sydney",
      "url": "<?php echo esc_url( home_url( '/services/' ) ); ?>",
      "description": "Every bathroom resurfacing, regrouting and repair service Timeless Resurfacing offers across Sydney.",
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": [
<?php
$timeless_pos   = 0;
$timeless_lines = array();
foreach ( $timeless_service_groups as $timeless_group ) {
    foreach ( $timeless_group['items'] as $timeless_item ) {
        $timeless_pos++;
        $timeless_lines[] = sprintf(
            '          { "@type": "ListItem", "position": %d, "name": %s, "url": %s }',
            $timeless_pos,
            wp_json_encode( $timeless_item[1] ),
            wp_json_encode( home_url( '/services/' . $timeless_item[0] . '/' ) )
        );
    }
}
echo implode( ",\n", $timeless_lines ) . "\n";
?>
        ]
      }
    }
  ]
}
</script>

<main>

<!-- HERO -->
<section class="pt-28 sm:pt-32 pb-12 sm:pb-16 bg-primary">
 <div class="max-w-4xl mx-auto px-6 sm:px-8 text-center">
  <span class="inline-block py-1 px-3 bg-tertiary-fixed text-on-tertiary-fixed text-[0.65rem] font-bold tracking-widest uppercase rounded-sm mb-4">Sydney Wide</span>
  <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tighter leading-[1.1] mb-5">Bathroom Resurfacing &amp; Regrouting Services</h1>
  <p class="text-on-primary-container text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8">Nineteen services, one idea behind all of them: repair and recoat what is already there instead of tearing it out. Most bathrooms are back in use the next day.</p>
  <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" class="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-lg hover:shadow-xl transition-all">Get your free quote <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></a>
 </div>
</section>

<!-- WHICH ONE DO I NEED -->
<section class="py-14 sm:py-20 bg-white">
 <div class="max-w-4xl mx-auto px-6 sm:px-8">
  <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter mb-4">Not sure which one you need?</h2>
  <p class="text-secondary leading-relaxed mb-6">Most people arrive knowing what is wrong with their bathroom but not what the fix is called. It usually comes down to one question: is the problem the <strong class="text-primary">surface</strong>, or the <strong class="text-primary">joints between the surfaces</strong>?</p>
  <div class="grid sm:grid-cols-2 gap-5">
   <div class="bg-surface-container-low rounded-xl p-6">
    <h3 class="text-lg font-bold text-primary mb-2">The surface itself looks wrong</h3>
    <p class="text-secondary text-sm leading-relaxed">Chipped, stained, scratched, dated in colour, or an earlier coating that is peeling. That is <a class="text-primary font-semibold underline decoration-tertiary-fixed-dim underline-offset-4" href="<?php echo esc_url( home_url( '/services/bath-resurfacing/' ) ); ?>">resurfacing</a> work.</p>
   </div>
   <div class="bg-surface-container-low rounded-xl p-6">
    <h3 class="text-lg font-bold text-primary mb-2">The lines between the tiles look wrong</h3>
    <p class="text-secondary text-sm leading-relaxed">Black mould that returns, cracked or missing grout, perished silicone, or a shower that leaks. That is <a class="text-primary font-semibold underline decoration-tertiary-fixed-dim underline-offset-4" href="<?php echo esc_url( home_url( '/services/shower-regrouting/' ) ); ?>">regrouting and sealing</a> work.</p>
   </div>
  </div>
  <p class="text-secondary text-sm leading-relaxed mt-6">If it is both, they are done as one visit. And if you would rather not decide, send two or three photos and we will tell you which it is, along with a quote, within 24 hours.</p>
 </div>
</section>

<!-- THE SERVICES -->
<?php foreach ( $timeless_service_groups as $timeless_i => $timeless_group ) :
    $timeless_bg = ( $timeless_i % 2 === 0 ) ? 'bg-surface-container-low' : 'bg-white'; ?>
<section class="py-14 sm:py-20 <?php echo esc_attr( $timeless_bg ); ?>" id="<?php echo esc_attr( $timeless_group['key'] ); ?>">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
  <div class="mb-8 max-w-2xl">
   <span class="material-symbols-outlined text-tertiary-fixed-dim text-3xl mb-2 block" aria-hidden="true"><?php echo esc_html( $timeless_group['icon'] ); ?></span>
   <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter mb-3"><?php echo wp_kses_post( $timeless_group['title'] ); ?></h2>
   <p class="text-secondary leading-relaxed"><?php echo esc_html( $timeless_group['intro'] ); ?></p>
   <div class="h-1 w-20 bg-tertiary-fixed-dim mt-4"></div>
  </div>
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
   <?php foreach ( $timeless_group['items'] as $timeless_item ) : ?>
   <a href="<?php echo esc_url( home_url( '/services/' . $timeless_item[0] . '/' ) ); ?>" class="bg-white rounded-xl p-6 border border-outline-variant hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group block">
    <h3 class="text-lg font-bold text-primary mb-2"><?php echo esc_html( $timeless_item[1] ); ?></h3>
    <p class="text-secondary text-sm leading-relaxed mb-3"><?php echo esc_html( $timeless_item[2] ); ?></p>
    <span class="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">Learn more <span class="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span></span>
   </a>
   <?php endforeach; ?>
  </div>
 </div>
</section>
<?php endforeach; ?>

<!-- WARRANTY, PER MATERIAL -->
<section class="py-14 sm:py-20 bg-white">
 <div class="max-w-4xl mx-auto px-6 sm:px-8">
  <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter mb-4">What each type of work is covered for</h2>
  <p class="text-secondary leading-relaxed mb-6">Different materials fail in different ways, so the workmanship cover is set per material rather than as one number across everything. The cover on your job is written on your job card.</p>
  <div class="grid sm:grid-cols-2 gap-4">
   <div class="bg-surface-container-low rounded-xl p-5">
    <p class="font-bold text-primary mb-1">Resurfacing — up to 5 years</p>
    <p class="text-secondary text-sm leading-relaxed">Covers peeling, bubbling and adhesion failure on bath, basin, tile and vanity coatings.</p>
   </div>
   <div class="bg-surface-container-low rounded-xl p-5">
    <p class="font-bold text-primary mb-1">Epoxy grout — 5 years</p>
    <p class="text-secondary text-sm leading-relaxed">Covers joint integrity and waterproofing where epoxy grout was used.</p>
   </div>
   <div class="bg-surface-container-low rounded-xl p-5">
    <p class="font-bold text-primary mb-1">Cement grout — 2 years</p>
    <p class="text-secondary text-sm leading-relaxed">Cement grout is porous by nature, so it carries a shorter cover than epoxy.</p>
   </div>
   <div class="bg-surface-container-low rounded-xl p-5">
    <p class="font-bold text-primary mb-1">Silicone — 12 months</p>
    <p class="text-secondary text-sm leading-relaxed">Silicone is a wearing part in a wet area and is expected to be replaced periodically.</p>
   </div>
  </div>
  <p class="text-secondary text-sm leading-relaxed mt-6">Chip repairs carry 1 year. Full terms are on the <a class="text-primary font-semibold underline decoration-tertiary-fixed-dim underline-offset-4" href="<?php echo esc_url( home_url( '/warranty/' ) ); ?>">warranty page</a>, and how you clean a resurfaced finish makes a real difference to how long it lasts — that is covered in the <a class="text-primary font-semibold underline decoration-tertiary-fixed-dim underline-offset-4" href="<?php echo esc_url( home_url( '/care-instructions/' ) ); ?>">care instructions</a>. These sit alongside your rights under Australian Consumer Law, which nothing here limits.</p>
 </div>
</section>

<!-- AREAS -->
<section class="py-14 sm:py-20 bg-surface-container-low">
 <div class="max-w-4xl mx-auto px-6 sm:px-8 text-center">
  <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter mb-4">Where we work</h2>
  <p class="text-secondary leading-relaxed mb-6">Every service on this page is available across Sydney, from the Inner West and Eastern Suburbs through to Parramatta, the Hills and the Nepean.</p>
  <a href="<?php echo esc_url( home_url( '/areas/' ) ); ?>" class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:shadow-xl transition-all">See service areas <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
 </div>
</section>

<!-- QUOTE -->
<section class="py-14 sm:py-20 bg-white" id="quote">
 <div class="max-w-4xl mx-auto px-6 sm:px-8">
  <div class="text-center mb-8">
   <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter mb-3">Send a few photos, get an itemised quote</h2>
   <p class="text-secondary leading-relaxed max-w-2xl mx-auto">Photos of the bath, the shower joints and the vanity are usually enough. We come back within 24 hours with an itemised quote, and we will say plainly if a repair is the wrong call for your bathroom.</p>
  </div>
  <?php echo do_shortcode( '[timeless_quote_form]' ); ?>
 </div>
</section>

</main>

<?php get_footer(); ?>
