/* Timeless Resurfacing — service catalogue (the price book behind the built-in drafter).
   Prices are GST-INCLUSIVE retail. price:null = job-dependent, the drafter inserts $0 and flags it.
   Sources: real quotes issued (John / Stephanie / Neil / Mick analysis 2026-06-17). Edit freely. */
(function (root) {
  var TQ = root.TQ = root.TQ || {};

  TQ.CATALOGUE = [
    {
      id: 'bath-resurface',
      keywords: ['bath resurfac', 'bathtub resurfac', 'tub resurfac', 'resurface the bath', 'resurface bath', 'bath tub', 'bathtub', 'pressed metal', 'cast iron bath', 'enamel bath'],
      desc: 'Bath resurfaced to a smooth gloss-white finish (commercial 3-pack coating)',
      price: 1540,
      intro: 'Resurfacing of your bathtub. We bring it back to a smooth, gloss-white finish that looks and feels like new.'
    },
    {
      id: 'wall-resurface',
      keywords: ['wall resurfac', 'tile resurfac', 'wall tile resurfac', 'resurface the wall', 'resurface wall', 'resurfacing walls', 'walls resurfac'],
      desc: 'Wall and bathtub-side resurfacing (strip back, then resurface)',
      price: 1800,
      intro: 'Resurfacing of your wall tiles to bring them back to a clean, durable finish.'
    },
    {
      id: 'strip-back',
      keywords: ['strip back', 'strip-back', 'sand back'],
      desc: 'Existing surface stripped back and fully re-prepped before recoating',
      price: null
    },
    {
      id: 'chip-repair',
      keywords: ['chip', 'chipped'],
      desc: 'Chips repaired, filled and blended into the surface',
      price: null
    },
    {
      id: 'floor-tile-over',
      keywords: ['floor tile', 'tiles on top', 'tile on top', 'tiling on top', 'tile over', 'tiled over', 'upskirting', 'new floor'],
      desc: 'New floor tiles laid on top + upskirting',
      price: 2250,
      intro: 'New floor tiles laid on top of the existing floor, with upskirting for a clean finish.'
    },
    {
      id: 'wall-tiles-new',
      keywords: ['new wall tile', 'wall tiles', 'retile the wall', 'retile wall'],
      desc: 'New wall tiles, including around the bathtub',
      price: 2000
    },
    {
      id: 'strip-out',
      keywords: ['strip out', 'strip-out', 'rip out', 'demolish', 'demolition', 'remove the old tiles', 'remove old tiles'],
      desc: 'Strip out the old upskirting, wall tiles and bathtub surround',
      price: 1000
    },
    {
      id: 'tipping',
      keywords: ['tipping', 'tip run', 'dump', 'rubbish', 'waste removal'],
      desc: 'Tipping (dump) the old tiles and leftover rubbish',
      price: 700
    },
    {
      id: 'missing-tile',
      keywords: ['missing tile', 'glue the tile', 'glue tile', 'replace the tile', 'loose tile'],
      desc: 'Supply and glue the missing tile + regrout',
      price: 90
    },
    {
      id: 'shower-regrout',
      keywords: ['regrout', 're-grout', 'regrouting', 'epoxy'],
      desc: 'Shower regrouted with epoxy grout inside the shower; standard grout outside the shower area',
      price: 1000,
      intro: 'Regrouting of your shower: epoxy grout inside the shower for waterproof durability, standard grout outside the shower area.'
    },
    {
      id: 'silicone',
      keywords: ['silicone', 'reseal', 're-seal', 'recaulk', 'caulk'],
      desc: 'Old silicone cut out and replaced with new mould-resistant silicone',
      price: 250
    },
    {
      id: 'vanity',
      keywords: ['vanity resurfac', 'vanity respray', 'vanity refinish', 'vanity'],
      desc: 'Vanity resurfaced to a smooth, durable finish',
      price: 775
    },
    {
      id: 'basin',
      keywords: ['basin'],
      desc: 'Basin resurfaced and chips repaired',
      price: null
    },
    {
      id: 'drain-cover',
      keywords: ['drain', 'waste cover', 'waste'],
      desc: 'New chrome drain / waste cover supplied and fitted',
      price: null
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
      price: null
    },
    {
      id: 'painting',
      keywords: ['paint the', 'painting', 'repaint'],
      desc: 'Bathroom ceiling and walls painted',
      price: null
    },
    {
      id: 'plumber',
      keywords: ['plumber', 'plumbing'],
      desc: 'Licensed plumber on site for disconnections and reconnections',
      price: null
    },
    {
      id: 'shower-leak',
      keywords: ['leak', 'leaking', 'waterproof'],
      desc: 'Shower leak sealed and re-waterproofed at the affected joints',
      price: null
    },
    {
      id: 'mould-grout',
      keywords: ['mould', 'mold', 'mouldy'],
      desc: 'Mouldy grout removed and regrouted fresh',
      price: null
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
