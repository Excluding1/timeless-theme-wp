<?php /* Template Name: Suburb Area Page */ ?>
<?php
/**
 * SUBURB AREA PAGE — /areas/{suburb}/          (v1.5.2, 2026-08-13)
 *
 * Replaces the old /services/bath-resurfacing/{suburb}/ pages, which tied every
 * suburb to a single service. Allan's call, and the right one: people search
 * "bathroom resurfacing {suburb}", not "bath resurfacing {suburb}", and one page per
 * service per suburb would be 19 x 66 = 1,254 near-identical pages.
 *
 * REVERSE-ENGINEERED FROM THE MARKET LEADER. We tore down Jim's Fencing (the biggest
 * AU fencing franchise) across three suburbs before writing a line:
 *
 *   Cronulla  — their flagship: ~3,500 words, custom 113-word intro, a genuinely
 *               local "maintenance in coastal conditions" section, 5 FAQs of which
 *               2 are suburb-specific.
 *   Blacktown — templated. Intro is a pure name-swap. BUT its FAQ asks about
 *               "Blacktown City Council standards".
 *   Pymble    — same name-swapped intro as Blacktown, word for word.
 *
 * The lesson we copied: their intro is where they cut corners; their FAQ is where
 * they localise consistently and cheaply (council names, local conditions). So this
 * template does the opposite of their weak half — every suburb gets its own written
 * intro from real housing-stock data — and copies their strong half, the localised
 * FAQ, including the council reference Blacktown uses.
 *
 * What we do that neither reference does: an embedded map. The Australian tradie SEO
 * guidance lists one as a requirement for a location page and neither competitor has
 * one, so it is a free point of difference.
 *
 * Section order mirrors Cronulla:
 *   hero -> why here -> all services -> what's included -> local conditions
 *        -> map -> reviews -> FAQ -> quote -> nearby suburbs
 */

get_header();

$slug    = get_post_field( 'post_name', get_the_ID() );
$suburbs = include get_template_directory() . '/inc/suburb-data.php';
$suburb  = $suburbs[ $slug ] ?? null;

// Unknown slug: send them to the areas index rather than render an empty shell.
if ( ! $suburb ) {
    wp_safe_redirect( home_url( '/areas/' ), 301 );
    exit;
}

$nb       = isset( $suburb['neighborhoods'] ) ? (array) $suburb['neighborhoods'] : array();
$nb_list  = $nb ? timeless_comma_and( $nb ) : '';
$council  = $suburb['council'] ?? '';
$era      = strtolower( $suburb['housing_era'] );
$name     = $suburb['name'];
$coastal  = (bool) preg_match( '/beach|coastal|Northern Beaches|Illawarra|Central Coast/i', $suburb['region'] . ' ' . $suburb['description'] );
?>

<script type="application/ld+json">
{ "@context":"https://schema.org","@type":"Service",
  "serviceType":"Bathroom resurfacing and regrouting",
  "provider":{"@type":"HomeAndConstructionBusiness","name":"Timeless Resurfacing",
    "telephone":"<?php echo esc_js( timeless_phone_link() ); ?>",
    "areaServed":{"@type":"City","name":<?php echo wp_json_encode( $name . ', NSW' ); ?>}},
  "areaServed":{"@type":"Place","name":<?php echo wp_json_encode( $name . ', NSW ' . $suburb['postcode'] ); ?>,
    "geo":{"@type":"GeoCoordinates","latitude":<?php echo esc_js( $suburb['lat'] ); ?>,"longitude":<?php echo esc_js( $suburb['lng'] ); ?>}}}
</script>

<!-- HERO — structure copied from the working service-page hero (contained rounded
     image with aspect ratio, stats as bordered cards, buttons in their own row).
     My first pass invented its own markup and the image bled past the container. -->
<section class="pt-4 pb-10 sm:pb-16 bg-surface">
 <div class="max-w-7xl mx-auto px-6 sm:px-8">
  <nav class="text-xs text-secondary mb-5" aria-label="Breadcrumb">
   <a class="hover:text-primary" href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a>
   <span class="mx-1">/</span>
   <a class="hover:text-primary" href="<?php echo esc_url( home_url( '/areas/' ) ); ?>">Service Areas</a>
   <span class="mx-1">/</span>
   <span class="text-primary font-semibold"><?php echo esc_html( $name ); ?></span>
  </nav>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
   <div>
    <span class="inline-block bg-surface-container-low text-primary text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded mb-5"><?php echo esc_html( $suburb['region'] ); ?> &middot; <?php echo esc_html( $suburb['postcode'] ); ?></span>

    <h1 class="text-4xl sm:text-5xl font-extrabold text-primary tracking-tighter leading-[0.95] mb-5">Bathroom Resurfacing in <?php echo esc_html( $name ); ?></h1>

    <p class="text-secondary leading-relaxed mb-4">Tired bathroom in <?php echo esc_html( $name ); ?>? We resurface baths, tiles, vanities and basins, and replace old grout and silicone &mdash; usually in a single day, with no demolition and no plumber. You keep the bathroom you have; it just stops looking like it needs replacing.</p>

    <!-- image sits here on mobile, between the copy and the stats -->
    <div class="md:hidden mb-6">
     <div class="rounded-xl overflow-hidden shadow-2xl" style="aspect-ratio:4/3;">
      <img src="<?php echo esc_url( get_template_directory_uri() . '/images/homepage/after.jpg' ); ?>" alt="Resurfaced bathroom in a Sydney home" class="w-full h-full object-cover" width="720" height="540" />
     </div>
    </div>

    <p class="text-secondary leading-relaxed mb-6">We cover <?php echo esc_html( $name ); ?><?php echo $nb_list ? ' and nearby ' . esc_html( $nb_list ) : ''; ?>. Send a few photos and you will have a fixed price back within one business day &mdash; there is no call-out fee to find out where you stand.</p>

    <div class="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
     <div class="text-center bg-surface-container-low rounded-lg px-2 sm:px-3 py-3">
      <div class="text-xl sm:text-2xl font-extrabold text-primary">1 Day</div>
      <div class="text-xs text-secondary mt-0.5">Most jobs</div>
     </div>
     <div class="text-center bg-surface-container-low rounded-lg px-2 sm:px-3 py-3">
      <div class="text-xl sm:text-2xl font-extrabold text-primary">Up to 80%</div>
      <div class="text-xs text-secondary mt-0.5">vs replacing</div>
     </div>
     <div class="text-center bg-surface-container-low rounded-lg px-2 sm:px-3 py-3">
      <div class="text-xl sm:text-2xl font-extrabold text-primary"><?php echo esc_html( $suburb['distance_km'] ); ?> km</div>
      <div class="text-xs text-secondary mt-0.5">From the CBD</div>
     </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 mb-4">
     <a href="#quote" class="bg-primary text-white px-8 py-4 rounded-lg font-bold text-center hover:shadow-xl transition-all">Get Your Free Quote</a>
     <a href="tel:<?php echo esc_attr( timeless_phone_link() ); ?>" class="border border-surface-container bg-white px-8 py-4 rounded-lg font-bold text-primary text-center hover:shadow-lg transition-all">Call <?php echo esc_html( timeless_phone() ); ?></a>
    </div>
    <p class="text-xs text-secondary">Send photos &rarr; fixed price within one business day. No call-out fee, no obligation.</p>
   </div>

   <!-- desktop image column -->
   <div class="hidden md:block">
    <div class="rounded-xl overflow-hidden shadow-2xl" style="aspect-ratio:4/3;">
     <img src="<?php echo esc_url( get_template_directory_uri() . '/images/homepage/after.jpg' ); ?>" alt="Resurfaced bathroom in a Sydney home" class="w-full h-full object-cover" width="720" height="540" loading="eager" />
    </div>
   </div>
  </div>
 </div>
</section>

<!-- TRUST BAR — every other page has one; its absence is part of why this looked bare -->
<section class="bg-primary text-white py-4">
 <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
  <div class="text-xs sm:text-sm font-semibold">Experienced &amp; Insured</div>
  <div class="text-xs sm:text-sm font-semibold">$10M Public Liability</div>
  <div class="text-xs sm:text-sm font-semibold">Up to 5-Year Warranty</div>
  <div class="text-xs sm:text-sm font-semibold">Servicing <?php echo esc_html( $name ); ?></div>
 </div>
</section>

<!-- WHY HERE — now uses the theme's own when_cards + icon_callout components
     instead of three centred paragraphs. Those components already exist in
     functions.php and are what make the service pages look designed. -->
<section class="py-12 sm:py-16 bg-white">
 <div class="max-w-4xl mx-auto px-6 sm:px-8">
  <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-5 text-center">Why <?php echo esc_html( $name ); ?> bathrooms end up looking tired</h2>
  <p class="text-secondary leading-relaxed mb-4 max-w-2xl mx-auto text-center"><?php echo esc_html( $suburb['description'] ); ?></p>
  <p class="text-secondary leading-relaxed mb-8 max-w-2xl mx-auto text-center">The housing here is mostly <?php echo esc_html( $era ); ?>, and bathrooms of that vintage fail in the same few ways. Underneath, the bath and tiles are almost always still sound.</p>

  <?php echo do_shortcode( '[when_cards left_title="Resurfacing suits you when" left="' .
    'The bath is chipped, stained or yellowed but not cracked through;' .
    'Tiles are sound but the colour dates the room;' .
    'Grout is dark, porous and comes back mouldy after every clean;' .
    'Silicone has lifted or split at the edges;' .
    'You want it done in a day, not over three weeks' .
    '" right_title="You need a replacement when" right="' .
    'The bath is cracked right through or the base flexes underfoot;' .
    'Tiles are drummy or falling off the wall;' .
    'Water has been getting behind the tiles long enough to damage the wall;' .
    'The waterproofing membrane underneath has failed;' .
    'You are moving plumbing or changing the layout' .
    '"]' ); ?>

  <div class="mt-8">
   <?php echo do_shortcode( '[icon_callout type="fact" title="Why it works"]Resurfacing fixes the surface, not the structure. We repair, prepare and recoat what is already there &mdash; which is why it takes a day instead of three weeks and costs a fraction of a full renovation. If we look at your photos and think you need a replacement rather than a resurface, we will say so.[/icon_callout]' ); ?>
  </div>
 </div>
</section>

<!-- SERVICE SECTIONS ------------------------------------------------------
     Structure lifted from Jim's Cronulla page. They do NOT use a card grid: every
     service gets its own written section, ~200 words, with the suburb in the heading
     and its own quote CTA underneath. That is how one page covers the whole service
     range AND reaches 3,500 words without 19 separate suburb pages.
     Each section links through to the full service page, which keeps the depth there. -->
<?php
$job_lists = array(
  'bath-resurfacing' => array(
    array( "Chip repair", 'chipped-bathtub-repair' ),
    array( "Hairline crack repair", 'chipped-bathtub-repair' ),
    array( "Full bath resurface", '' ),
    array( "Rust and stain removal", 'stained-bathtub-resurfacing' ),
    array( "Peeling DIY paint stripped back", 'peeling-bathtub-resurfacing' ),
    array( "Waste and overflow covers replaced", '' ),
    array( "Colour change to gloss white", '' ),
  ),
  'tile-resurfacing' => array(
    array( "Wall tile colour change", '' ),
    array( "Floor tile resurfacing", 'floor-tile-regrouting' ),
    array( "Stained or dulled tiles", '' ),
    array( "Feature tile removal without demolition", '' ),
  ),
  'shower-regrouting' => array(
    array( "Mouldy grout removed and replaced", 'mouldy-shower-grout' ),
    array( "Cracked and crumbling grout", 'cracked-grout-repair' ),
    array( "Epoxy grout upgrade", 'epoxy-grout-upgrade' ),
    array( "Full shower regrout", '' ),
  ),
  'shower-leak-repair' => array(
    array( "Perished silicone replaced", 'mouldy-silicone-replacement' ),
    array( "Shower base to wall joints resealed", '' ),
    array( "Leak into the room below investigated", '' ),
    array( "Screen and door seals", '' ),
  ),
  'vanity-refinishing' => array(
    array( "Benchtop respray", 'vanity-respray' ),
    array( "Cabinet door respray", '' ),
    array( "Basin chip repair", 'basin-chip-repair' ),
    array( "Full basin resurface", '' ),
  ),
  'full-bathroom-makeover' => array(
    array( "Bath, tiles, vanity and grout in one booking", '' ),
    array( "Rental turnaround between tenants", '' ),
    array( "Whole-room colour change", '' ),
    array( "Pre-sale refresh", '' ),
  ),
);
$sections = array(
 array(
  'slug'  => 'bath-resurfacing',
  'callout' => array( 'tip', "Before you book", "Send a wide shot of the whole bath plus a close-up of the worst damage. Nine times out of ten that is enough for a fixed price without anyone visiting." ),
  'head'  => 'Bath Resurfacing in ' . $name,
  'body'  => array(
    'A bath is usually the first thing people notice in an older bathroom, and the first thing that dates it. Chips around the rim, a surface that has gone chalky, staining that no longer comes out however hard it is scrubbed, or the yellowing that comes with age on an enamel tub &mdash; none of it means the bath is finished.',
    'We repair the damage, prepare the surface properly, and spray on a commercial-grade coating that cures to a hard gloss white. It is the preparation that decides how long it lasts, which is why we do not cut that part short. Porcelain, enamel, cast iron, acrylic and fibreglass are all fine; natural stone is the one exception.',
    'Most baths in ' . $name . ' are done in five to eight hours, in a single visit, with no demolition and no plumber. You leave it 24 hours before using it, and a full 48 in winter while the coating cures.',
  ),
 ),
 array(
  'slug'  => 'tile-resurfacing',
  'callout' => array( 'fact', "Walls and floors age differently", "Wall tiles typically hold their finish for a decade or more. Floors take foot traffic, so we quote them separately and tell you what to realistically expect." ),
  'head'  => 'Tile Resurfacing for ' . $name . ' Bathrooms',
  'body'  => array(
    'Tiles are the other half of what makes a bathroom look old. The tiles themselves are usually perfectly sound &mdash; they are just a colour nobody has chosen on purpose since the eighties, or they have gone dull and picked up staining that cleaning will not shift.',
    'Resurfacing recolours the tile surface without removing a single tile off the wall. That matters in ' . $name . ' particularly, where ' . $era . ' often means the tiles are bedded in a way that makes removal messy, expensive and disruptive to whatever is behind them.',
    'The finish is a durable architectural coating, not paint, and it goes on walls and floors alike. Walls typically hold up for a decade or more; floors see more traffic so we quote them on that basis and tell you honestly what to expect.',
  ),
 ),
 array(
  'slug'  => 'shower-regrouting',
  'callout' => array( 'warning', "Cleaning will not fix mouldy grout", "Once grout goes porous the mould is growing inside it. Scrubbing removes what you can see and it comes back within a fortnight. The grout has to come out." ),
  'head'  => 'Shower Regrouting in ' . $name,
  'body'  => array(
    'Mouldy grout is not a cleaning problem. Once grout has gone porous, the mould is growing inside it, which is why it comes back a fortnight after every scrub. The only real fix is to take the old grout out and put new grout in.',
    'We cut out every joint, clean the tile edges back, and regrout the whole shower. You can have cement grout, which is the affordable option and wants resealing every year or two, or epoxy, which is waterproof, stain-proof, never needs sealing and carries a five-year warranty. We will tell you which one your shower actually needs rather than defaulting to the dearer one.',
    'If water has been getting behind the tiles for a while, regrouting alone may not be enough &mdash; we would rather find that at the quote stage than halfway through the job, so send photos of the corners and the base as well as the wall.',
  ),
 ),
 array(
  'slug'  => 'shower-leak-repair',
  'callout' => array( 'warning', "A stain on the ceiling below is urgent", "If water is showing on a ceiling under a bathroom, something has been leaking for a while. Worth a photo today rather than next month." ),
  'head'  => 'Shower Sealing and Leak Repair in ' . $name,
  'body'  => array(
    'Silicone has a life span, and it is shorter than most people expect. When it lifts, splits or goes black at the edges, water starts finding its way behind the tiles and into the wall or the floor below. In an apartment that becomes the neighbour\'s problem too, which is when it gets expensive.',
    'We strip out the old silicone completely, clean and dry the joint, and reseal with a mould-resistant sanitary silicone. Where the leak is coming from a failed waterproofing membrane rather than the seal, we will say so plainly &mdash; that is a different job and pretending otherwise would waste your money.',
    'It is a short job and a cheap one relative to what a slow leak costs if it is left. If you have a water stain appearing on a ceiling below a bathroom in ' . $name . ', that is worth a photo today rather than next month.',
  ),
 ),
 array(
  'slug'  => 'vanity-refinishing',
  'callout' => array( 'tip', "The cheapest visible win", "A resprayed benchtop and resurfaced basin usually costs the least of anything we do, and changes how the whole room reads." ),
  'head'  => 'Vanity and Basin Work in ' . $name,
  'body'  => array(
    'Vanity benchtops take more punishment than anything else in a bathroom &mdash; heat, cosmetics, hair products, water sitting around the basin. Laminate swells at the edges, older stone dulls, and the colour dates faster than the rest of the room.',
    'We respray benchtops and cabinet doors in a modern colour, including stone-fleck and satin finishes if you want something other than plain white. Basins get chips filled and the whole bowl resurfaced so the repair does not sit there as a visible patch.',
    'This is often the cheapest thing that makes the biggest visible difference, particularly in ' . $era . ' where the vanity is the one piece that looks most obviously of its era.',
  ),
 ),
 array(
  'slug'  => 'full-bathroom-makeover',
  'callout' => array( 'fact', "Why the package is cheaper", "Most of the cost in any single job is setup, masking and travel. Doing everything in one booking means paying for that once instead of four times." ),
  'head'  => 'Full Bathroom Makeovers in ' . $name,
  'body'  => array(
    'When the bath, the tiles, the vanity and the grout are all tired at once, doing them separately over a few years costs more than doing them together. The full package covers everything in a single booking, and because we are already set up on site the combined price is well under the sum of the parts.',
    'It is the option that most often replaces a renovation. A full bathroom renovation in Sydney runs into tens of thousands and takes weeks with trades in and out of the house. This is a fraction of that, usually one to two days, and nothing gets demolished.',
    'It suits ' . $name . ' particularly well given the ' . $era . ' here &mdash; those bathrooms are almost always structurally fine and simply look their age. If yours genuinely needs replacing, we will tell you that instead of taking the job.',
  ),
 ),
);
?>
<?php foreach ( $sections as $i => $sec ) : ?>
<section class="py-12 sm:py-16 <?php echo $i % 2 === 0 ? 'bg-white' : 'bg-surface-container-low'; ?>">
 <div class="max-w-6xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
  <!-- image alternates side each section, copying Jim's two-column pattern
       (their page runs 59 column blocks and 60 images; ours had one) -->
  <?php
   /* md:order-* is purged from the compiled Tailwind, so alternating by class did
      nothing. Swap the markup order instead — no utility classes required. On
      mobile the image always comes first, which is what you want on a phone. */
   ob_start(); ?>
   <div>
    <div class="rounded-xl overflow-hidden shadow-xl" style="aspect-ratio:4/3;">
     <img src="<?php echo esc_url( get_template_directory_uri() . '/images/services/' . $sec['slug'] . '/hero.jpg' ); ?>"
          alt="<?php echo esc_attr( $sec['head'] ); ?>" loading="lazy"
          class="w-full h-full object-cover" width="640" height="480" />
    </div>
   </div>
   <?php $img_col = ob_get_clean(); ob_start(); ?>
   <div>
  <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter mb-5"><?php echo esc_html( $sec['head'] ); ?></h2>
  <?php foreach ( $sec['body'] as $para ) : ?>
  <p class="text-secondary leading-relaxed mb-4"><?php echo esc_html( $para ); ?></p>
  <?php endforeach; ?>
  <?php if ( ! empty( $job_lists[ $sec['slug'] ] ) ) : ?>
  <div class="bg-surface-container-low rounded-xl p-5 mt-6">
   <p class="text-xs font-bold uppercase tracking-widest text-secondary mb-3"><?php echo esc_html( strtok( $sec['head'], ' ' ) ); ?> jobs we do in <?php echo esc_html( $name ); ?></p>
   <ul class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-2">
    <?php foreach ( $job_lists[ $sec['slug'] ] as $job ) : ?>
    <li class="flex items-start gap-2 text-sm text-secondary">
     <span class="material-symbols-outlined text-base text-primary shrink-0 mt-0.5" style="font-variation-settings:'FILL' 1;" aria-hidden="true">check_circle</span>
     <?php if ( $job[1] ) : ?>
      <a href="<?php echo esc_url( home_url( '/services/' . $job[1] . '/' ) ); ?>" class="hover:text-primary underline"><?php echo esc_html( $job[0] ); ?></a>
     <?php else : ?>
      <span><?php echo esc_html( $job[0] ); ?></span>
     <?php endif; ?>
    </li>
    <?php endforeach; ?>
   </ul>
  </div>
  <?php endif; ?>
  <?php if ( ! empty( $sec['callout'] ) ) : ?>
  <div class="mt-6"><?php echo do_shortcode( '[icon_callout type="' . $sec['callout'][0] . '" title="' . esc_attr( $sec['callout'][1] ) . '"]' . $sec['callout'][2] . '[/icon_callout]' ); ?></div>
  <?php endif; ?>
  <div class="flex flex-wrap items-center gap-4 mt-6">
   <a href="#quote" class="bg-primary text-white px-6 py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-all">Get a quote</a>
   <a href="<?php echo esc_url( home_url( '/services/' . $sec['slug'] . '/' ) ); ?>" class="text-primary font-bold text-sm hover:text-primary-soft transition-colors">Full <?php echo esc_html( strtolower( timeless_services()[ $sec['slug'] ][0] ) ); ?> details &rarr;</a>
  </div>
  </div>
  <?php
   $text_col = ob_get_clean();
   // even sections: text then image. odd: image then text. That is the alternation.
   echo ( $i % 2 === 0 ) ? $text_col . $img_col : $img_col . $text_col;
  ?>
 </div>
</section>
<?php endforeach; ?>

<!-- EVERYTHING ELSE WE DO — the remaining services, compact -->
<section class="py-12 sm:py-16 bg-white">
 <div class="max-w-6xl mx-auto px-6 sm:px-8">
  <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter mb-3 text-center">Everything else we do in <?php echo esc_html( $name ); ?></h2>
  <p class="text-secondary text-center max-w-2xl mx-auto mb-8">All quoted from photos, with no call-out fee.</p>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
   <?php
   $done = wp_list_pluck( $sections, 'slug' );
   foreach ( timeless_services() as $svc_slug => $svc ) :
     if ( in_array( $svc_slug, $done, true ) ) { continue; } ?>
   <a href="<?php echo esc_url( home_url( '/services/' . $svc_slug . '/' ) ); ?>" class="block bg-surface-container-low rounded-xl p-5 hover:shadow-lg transition-all">
    <h3 class="font-bold text-primary text-sm mb-1.5"><?php echo esc_html( $svc[0] ); ?></h3>
    <p class="text-xs text-secondary leading-relaxed"><?php echo esc_html( $svc[1] ); ?></p>
   </a>
   <?php endforeach; ?>
  </div>
 </div>
</section>

<!-- LOCAL CONDITIONS — modelled on Cronulla's maintenance section, their most localised -->
<section class="py-12 sm:py-16 bg-white">
 <div class="max-w-3xl mx-auto px-6 sm:px-8">
  <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter mb-5">Making it last in <?php echo esc_html( $name ); ?></h2>
  <p class="text-secondary leading-relaxed mb-4"><?php
    echo $coastal
      ? esc_html( 'Coastal air carries salt, and salt finds every gap. In ' . $name . ' the first things to go are usually the silicone seals and any exposed metal — tap bases, waste fittings, shower screen tracks. Rinsing the shower down after use and keeping the exhaust fan running for ten minutes afterwards does more for the finish than any product.' )
      : esc_html( 'Most of the wear we see in ' . $name . ' comes down to moisture that never dries. Bathrooms in ' . $era . ' often have a small window and an exhaust fan that either vents into the roof space or was never replaced. Running the fan for ten minutes after a shower is the single cheapest thing you can do for a bathroom.' );
  ?></p>
  <p class="text-secondary leading-relaxed mb-4">On a resurfaced bath or tile, avoid abrasive creams and anything with bleach as the main ingredient &mdash; they dull the finish over time. Warm water and a soft cloth is genuinely enough. Grout wants a pH-neutral cleaner rather than anything harsh.</p>
  <p class="text-secondary leading-relaxed">If something does chip later, it can almost always be repaired in place rather than redone. Send a photo and we will tell you honestly whether it needs us at all.</p>
  <p class="mt-6"><a href="<?php echo esc_url( home_url( '/care-instructions/' ) ); ?>" class="inline-flex items-center gap-2 text-primary font-bold hover:text-primary-soft transition-colors">Full care instructions <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a></p>
 </div>
</section>

<!-- MAP — the differentiator neither reference has -->
<section class="py-12 sm:py-16 bg-surface-container-low">
 <div class="max-w-4xl mx-auto px-6 sm:px-8">
  <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tighter mb-6 text-center">Where we work</h2>
  <div class="rounded-xl overflow-hidden border border-surface-container bg-white">
   <iframe title="Map of <?php echo esc_attr( $name ); ?>, NSW" loading="lazy"
     referrerpolicy="no-referrer-when-downgrade" class="w-full block" height="340" style="border:0"
     src="https://www.openstreetmap.org/export/embed.html?bbox=<?php
        echo esc_attr( ( $suburb['lng'] - 0.045 ) . ',' . ( $suburb['lat'] - 0.032 ) . ',' . ( $suburb['lng'] + 0.045 ) . ',' . ( $suburb['lat'] + 0.032 ) );
     ?>&amp;layer=mapnik&amp;marker=<?php echo esc_attr( $suburb['lat'] . ',' . $suburb['lng'] ); ?>"></iframe>
  </div>
  <p class="text-xs text-secondary text-center mt-3">We come to you &mdash; there is no shopfront. <?php echo esc_html( $name ); ?> sits about <?php echo esc_html( $suburb['distance_km'] ); ?>&nbsp;km from the Sydney CBD<?php echo $council ? ', in the ' . esc_html( $council ) . ' area' : ''; ?>.</p>
 </div>
</section>

<!-- FAQ — the half Jim's localises consistently, so we copy it and go further -->
<section class="py-12 sm:py-16 bg-white" id="faqs">
 <div class="max-w-3xl mx-auto px-6 sm:px-8">
  <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter mb-8 text-center"><?php echo esc_html( $name ); ?> questions</h2>
  <?php
  $faqs = array(
   array( 'q' => 'Do you service ' . $name . '?',
          'a' => 'Yes. We cover ' . $name . ( $nb_list ? ' and the surrounding suburbs including ' . $nb_list : '' ) . '. There is no call-out fee to quote, because we quote from your photos.' ),
   array( 'q' => 'How much does bathroom resurfacing cost in ' . $name . '?',
          'a' => 'Price depends on the size and condition of the bathroom, not on the suburb &mdash; we do not charge more for one area than another. Send three or four photos and we will send back a fixed price within one business day.' ),
   array( 'q' => 'Do I need council approval in ' . ( $council ?: $name ) . '?',
          'a' => 'No. Resurfacing and regrouting are maintenance, not building work &mdash; nothing structural changes, no plumbing is altered and nothing is removed' . ( $council ? ', so no ' . $council . ' approval is required' : '' ) . '. That is one of the reasons it takes a day rather than weeks.' ),
   array( 'q' => 'How long will my bathroom be out of action?',
          'a' => 'Most jobs are finished in a single visit. The surface needs to cure before it gets wet, so the rule of thumb is to leave it 24 hours minimum and a full 48 hours in winter before using the shower or bath.' ),
   array( 'q' => 'Is it worth resurfacing an older ' . $name . ' bathroom?',
          'a' => 'Usually. The housing here is largely ' . $era . ', and those bathrooms are nearly always sound underneath &mdash; it is the surface that has gone. If we look at your photos and think the bath is cracked through or the base flexes, we will tell you it needs replacing rather than take the job.' ),
  );
  ?>
  <div class="space-y-3">
   <?php foreach ( $faqs as $f ) : ?>
   <div class="faq-item border border-surface-container rounded-xl bg-white">
    <button class="w-full flex justify-between items-center p-4 text-left" onclick="toggleFaq(this)">
     <h3 class="font-bold text-primary text-sm pr-4"><?php echo esc_html( $f['q'] ); ?></h3>
     <span class="material-symbols-outlined faq-chevron text-primary text-xl" aria-hidden="true">expand_more</span>
    </button>
    <div class="faq-answer px-4"><p class="text-sm text-secondary leading-relaxed pb-4"><?php echo wp_kses_post( $f['a'] ); ?></p></div>
   </div>
   <?php endforeach; ?>
  </div>
 </div>
</section>
<script type="application/ld+json">
{ "@context":"https://schema.org","@type":"FAQPage","mainEntity":[
<?php
$parts = array();
foreach ( $faqs as $f ) {
    $parts[] = '{"@type":"Question","name":' . wp_json_encode( wp_strip_all_tags( html_entity_decode( $f['q'] ) ) )
             . ',"acceptedAnswer":{"@type":"Answer","text":' . wp_json_encode( wp_strip_all_tags( html_entity_decode( $f['a'] ) ) ) . '}}';
}
echo implode( ",\n", $parts );
?>
]}
</script>
<script>window.toggleFaq = window.toggleFaq || function(btn){ var i=btn.parentElement, o=i.classList.contains('open'); document.querySelectorAll('.faq-item').forEach(function(el){el.classList.remove('open');}); if(!o) i.classList.add('open'); };</script>

<!-- QUOTE -->
<section id="quote" class="py-16 sm:py-20 bg-primary text-white">
 <div class="max-w-3xl mx-auto px-6 sm:px-8 text-center">
  <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tighter mb-4">Free <?php echo esc_html( $name ); ?> quote</h2>
  <p class="opacity-90 mb-8">Send three or four photos of the bathroom. Fixed price back within one business day, no call-out fee and no obligation.</p>
  <div class="bg-white rounded-2xl p-2 sm:p-4 text-left"><?php echo do_shortcode( '[timeless_quote_form]' ); ?></div>
 </div>
</section>

<!-- NEARBY SUBURBS -->
<section class="py-12 sm:py-16 bg-white">
 <div class="max-w-6xl mx-auto px-6 sm:px-8">
  <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-6 text-center">Other suburbs we service</h2>
  <div class="flex flex-wrap gap-2 justify-center">
   <?php
   $others = array_diff_key( $suburbs, array( $slug => 1 ) );
   $others = array_slice( $others, 0, 23, true );
   foreach ( $others as $o_slug => $o ) : ?>
   <a href="<?php echo esc_url( home_url( '/areas/' . $o_slug . '/' ) ); ?>" class="text-xs bg-surface-container-low hover:bg-surface-container px-3 py-2 rounded-lg text-secondary hover:text-primary transition-colors">Bathroom resurfacing in <?php echo esc_html( $o['name'] ); ?></a>
   <?php endforeach; ?>
  </div>
  <p class="text-center mt-8"><a href="<?php echo esc_url( home_url( '/areas/' ) ); ?>" class="text-primary font-bold hover:text-primary-soft transition-colors">See all service areas &rarr;</a></p>
 </div>
</section>

<?php get_footer(); ?>
