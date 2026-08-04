/* Timeless Resurfacing — service catalogue (the price book behind the built-in drafter).
   Prices are GST-INCLUSIVE retail. price:null = job-dependent, the drafter inserts $0 and flags it.
   Sources: real quotes issued (John / Stephanie / Neil / Mick analysis 2026-06-17). Edit in Settings.

   Per entry:
     keywords      what Quick Draft listens for (earlier + longer = stronger match)
     desc          the line wording printed on the quote
     primary       a MAIN job: headlines the option title
     phrase        fragment for the composed THE JOB opener ("resurfacing of your bathtub")
     process       one sentence describing how we do it (composed into THE JOB)
     expectLines   "What to expect" bullets this service contributes (durations from real jobs)
     warrantyLines exact warranty wording per material: resurfacing up to 5yr / grout 2yr / silicone 1yr
     cure          true = a coating that needs 24-48h before use (adds the shared cure bullet once) */
(function (root) {
  var TQ = root.TQ = root.TQ || {};

  /* The effective price book: the user's edited book (Settings) wins over the built-in defaults. */
  TQ.userCatalogue = null;
  TQ.getCatalogue = function () {
    return (TQ.userCatalogue && TQ.userCatalogue.length) ? TQ.userCatalogue : TQ.CATALOGUE;
  };

  /* A user-edited book carries only what the editor shows (desc/price/keywords/primary).
     Inherit the composer metadata (phrase, process, expectLines, warrantyLines, cure, intro)
     from the built-in entry with the same id so THE JOB / warranty / expect stay rich. */
  TQ.mergeBook = function (userBook) {
    var byId = {};
    (TQ.CATALOGUE || []).forEach(function (c) { byId[c.id] = c; });
    return (userBook || []).map(function (e) {
      return Object.assign({}, byId[e.id] || {}, e);
    });
  };

  var W_RESURF = ['Up to 5-year workmanship warranty on resurfacing', 'Coating lifespan 10+ years with proper care'];
  var W_TILING = ['Up to 5-year workmanship warranty on tiling'];
  var W_GROUT = ['2-year workmanship warranty on grout'];
  var W_SILICONE = ['1-year warranty on silicone'];

  TQ.CATALOGUE = [
    {
      id: 'bath-resurface',
      keywords: ['bath resurfac', 'bathtub resurfac', 'tub resurfac', 'resurface the bath', 'resurface bath', 'bath tub', 'bathtub', 'pressed metal', 'cast iron bath', 'enamel bath'],
      desc: 'Bath resurfaced to a smooth gloss-white finish (commercial 3-pack coating)',
      price: 1540,
      primary: true,
      phrase: 'resurfacing of your bathtub',
      process: 'For the bath we repair any chips, prep and mask everything off, then apply a commercial 3-pack coating in gloss white.',
      expectLines: ['About 1 day on site for the bath'],
      warrantyLines: W_RESURF,
      cure: true,
      intro: 'Resurfacing of your bathtub. We bring it back to a smooth, gloss-white finish that looks and feels like new.'
    },
    {
      id: 'wall-resurface',
      keywords: ['wall resurfac', 'tile resurfac', 'wall tile resurfac', 'resurface the wall', 'resurface wall', 'resurfacing walls', 'walls resurfac', 'sides of bathtub', 'sides of the bathtub', 'bathtub side'],
      desc: 'Wall and bathtub-side resurfacing',
      price: 1800,
      primary: true,
      phrase: 'resurfacing of your wall tiles and the sides of the bathtub',
      process: 'For the walls we prep and repair the surface, mask everything off, then apply a commercial 3-pack coating in gloss white.',
      expectLines: ['About 2 days for the wall resurfacing'],
      warrantyLines: W_RESURF,
      cure: true,
      intro: 'Resurfacing of your wall tiles to bring them back to a clean, durable finish.'
    },
    {
      id: 'strip-back',
      keywords: ['strip back', 'strip-back', 'stripback', 'sand back'],
      desc: 'Existing surface stripped back and fully re-prepped before recoating',
      price: null
    },
    {
      id: 'chip-repair',
      keywords: ['chip', 'chipped'],
      desc: 'Chips repaired, filled and blended into the surface',
      price: null,
      phrase: 'chips repaired and blended in'
    },
    {
      id: 'floor-tile-over',
      keywords: ['floor tile', 'tiles on top', 'tile on top', 'tiling on top', 'tile over', 'tiled over', 'upskirting', 'new floor'],
      desc: 'New floor tiles laid on top + upskirting',
      price: 2250,
      primary: true,
      phrase: 'new floor tiles laid on top of the existing floor with upskirting',
      process: 'For the floor we seal the existing tiles, lay the new tiles over the top with upskirting, then grout and finish.',
      expectLines: ['About 4 days for the tiling'],
      warrantyLines: W_TILING,
      intro: 'New floor tiles laid on top of the existing floor, with upskirting for a clean finish.'
    },
    {
      id: 'strip-dump',
      keywords: ['strip and dump', 'stripping and dumping', 'strip out and dump', 'tile stripping', 'strip the tiles and dump'],
      desc: 'Strip out and dump the old tiles',
      price: null,
      phrase: 'the old tiles stripped out and taken away'
    },
    {
      id: 'wall-tiles-new',
      keywords: ['new wall tile', 'wall tiles', 'retile the wall', 'retile wall'],
      desc: 'New wall tiles, including around the bathtub',
      price: 2000,
      phrase: 'new wall tiles including around the bathtub',
      expectLines: ['About 4 days for the tiling'],
      warrantyLines: W_TILING
    },
    {
      id: 'strip-out',
      keywords: ['strip out', 'strip-out', 'rip out', 'demolish', 'demolition', 'remove the old tiles', 'remove old tiles'],
      desc: 'Strip out the old upskirting, wall tiles and bathtub surround',
      price: 1000,
      phrase: 'the old tiles stripped out'
    },
    {
      id: 'tipping',
      keywords: ['tipping', 'tip run', 'dump', 'rubbish', 'waste removal'],
      desc: 'Tipping (dump) the old tiles and leftover rubbish',
      price: 700,
      phrase: 'the rubbish taken away'
    },
    {
      id: 'missing-tile',
      keywords: ['missing tile', 'glue the tile', 'glue tile', 'replace the tile', 'loose tile'],
      desc: 'Supply and glue the missing tile + regrout',
      price: 90,
      phrase: 'the missing tile supplied and glued back',
      warrantyLines: W_TILING
    },
    {
      id: 'shower-regrout',
      keywords: ['regrout', 're-grout', 'regrouting', 'epoxy'],
      desc: 'Shower regrouted with epoxy grout inside the shower; standard grout outside the shower area',
      price: 1000,
      primary: true,
      phrase: 'regrouting of your shower',
      process: 'For the shower we cut the old grout out and regrout with epoxy inside the shower for waterproof durability, and standard grout outside the shower area.',
      expectLines: ['About 2 days for the regrouting'],
      warrantyLines: W_GROUT,
      intro: 'Regrouting of your shower: epoxy grout inside the shower for waterproof durability, standard grout outside the shower area.'
    },
    {
      id: 'silicone',
      keywords: ['silicone', 'reseal', 're-seal', 'recaulk', 'caulk'],
      desc: 'Old silicone cut out and replaced with new mould-resistant silicone',
      price: 250,
      phrase: 'new mould-resistant silicone throughout',
      warrantyLines: W_SILICONE
    },
    {
      id: 'vanity',
      keywords: ['vanity resurfac', 'vanity respray', 'vanity refinish', 'vanity'],
      desc: 'Vanity resurfaced to a smooth, durable finish',
      price: 775,
      phrase: 'the vanity resurfaced',
      warrantyLines: W_RESURF,
      cure: true
    },
    {
      id: 'benchtop',
      keywords: ['benchtop', 'bench top', 'vanity top', 'countertop', 'counter top'],
      desc: 'Vanity benchtop resurfaced to a smooth gloss finish',
      price: 1050,
      primary: true,
      phrase: 'resurfacing of your vanity benchtop',
      process: 'For the benchtop we prep, etch and mask the surface, then apply a commercial 3-pack coating for a seamless gloss finish.',
      expectLines: ['About 3 to 5 hours on site for the benchtop'],
      warrantyLines: W_RESURF,
      cure: true,
      intro: 'Resurfacing of your vanity benchtop. We bring it back to a smooth gloss finish that looks and feels like new.'
    },
    {
      id: 'basin',
      keywords: ['basin'],
      desc: 'Basin resurfaced and chips repaired',
      price: null,
      phrase: 'the basin resurfaced',
      warrantyLines: W_RESURF,
      cure: true
    },
    {
      id: 'drain-cover',
      keywords: ['drain', 'waste cover', 'waste'],
      desc: 'New chrome drain / waste cover supplied and fitted',
      price: null,
      phrase: 'a new chrome drain cover fitted'
    },
    {
      id: 'glass-refit',
      keywords: ['shower glass', 'shower screen', 'glass off', 'glass removal'],
      desc: 'Remove and refit the shower glass',
      price: null
    },
    {
      id: 'vanity-refit',
      keywords: ['disconnect', 'reconnect'],
      desc: 'Disconnect and reconnect the vanity',
      price: null
    },
    {
      id: 'cornice',
      keywords: ['cornice'],
      desc: 'Cornice crack patched and painted',
      price: null,
      phrase: 'the cornice crack patched and painted'
    },
    {
      id: 'painting',
      keywords: ['paint the', 'painting', 'repaint'],
      desc: 'Bathroom ceiling and walls painted',
      price: null,
      phrase: 'the ceiling and walls painted',
      expectLines: ['About 2 days for the painting']
    },
    {
      id: 'plumber',
      keywords: ['plumber', 'plumbing'],
      desc: 'Licensed plumber on site for disconnections and reconnections',
      price: null,
      expectLines: ['A licensed plumber on site for about 1 day']
    },
    {
      id: 'shower-leak',
      keywords: ['leak', 'leaking', 'waterproof'],
      desc: 'Shower leak sealed and re-waterproofed at the affected joints',
      price: null,
      phrase: 'the shower leak sealed and re-waterproofed'
    },
    {
      id: 'mould-grout',
      keywords: ['mould', 'mold', 'mouldy'],
      desc: 'Mouldy grout removed and regrouted fresh',
      price: null,
      phrase: 'the mouldy grout cut out and regrouted fresh',
      warrantyLines: W_GROUT
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
