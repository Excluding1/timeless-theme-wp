/* Timeless Resurfacing — after-job WARRANTY document model.
   Adapted from the Ultra Glaze operator warranty card our subbie issues, rebuilt for our
   brand + services (incl. tiling / tile-over) and the Australian Consumer Law rules for
   "warranty against defects" documents. The PDF layout lives in pdfgen.js (generateWarranty).

   Periods follow the house matrix: resurfacing up to 5 years / tiling workmanship up to
   5 years / grout 2 years / silicone 12 months. Special conditions are composed from the
   services on the job and stay editable before download (human reviews, always). */
(function (root) {
  var TQ = root.TQ = root.TQ || {};

  /* per-service certificate rows: id -> [printed label, period] */
  var ROWS = {
    'bath-resurface': ['Bath resurfacing', 'Up to 5 years'],
    'wall-resurface': ['Wall and bathtub-side resurfacing', 'Up to 5 years'],
    'vanity': ['Vanity resurfacing', 'Up to 5 years'],
    'benchtop': ['Benchtop resurfacing', 'Up to 5 years'],
    'basin': ['Basin resurfacing', 'Up to 5 years'],
    'floor-tile-over': ['New floor tiles laid on top (workmanship)', 'Up to 5 years'],
    'wall-tiles-new': ['New wall tiles (workmanship)', 'Up to 5 years'],
    'missing-tile': ['Tile repair (workmanship)', 'Up to 5 years'],
    'shower-regrout': ['Shower regrouting', '2 years'],
    'mould-grout': ['Regrouting', '2 years'],
    'silicone': ['Silicone replacement', '12 months'],
    'shower-leak': ['Leak sealing and re-waterproofing of the treated joints', '2 years']
  };

  /* special-condition bullets contributed per service family */
  var SPECIAL = {
    resurf: [
      'Allow the surface to cure before use: we recommend a full 48 hours after the final coat to be safe (24 hours is the minimum, but 48 is best, especially in cold or winter weather as it sets slower). Using it before it has cured can mark the finish.',
      'The resurfaced item must be kept completely dry when not in use.',
      'Do not use the bath to store water.',
      'Strong coloured dyes, hair dye, bath bombs and similar products may stain the surface.'
    ],
    tiling: [
      'Hairline cracking of grout caused by building or substrate movement is normal settling, not a defect.'
    ],
    grout: [
      'Allow the grout to cure fully before using the shower (24 to 48 hours).'
    ],
    silicone: [
      'Silicone is a wear item: we recommend checking it yearly and replacing as needed.'
    ]
  };
  var FAMILY = {
    'bath-resurface': 'resurf', 'wall-resurface': 'resurf', 'vanity': 'resurf', 'benchtop': 'resurf', 'basin': 'resurf',
    'floor-tile-over': 'tiling', 'wall-tiles-new': 'tiling', 'missing-tile': 'tiling',
    'shower-regrout': 'grout', 'mould-grout': 'grout', 'shower-leak': 'grout',
    'silicone': 'silicone'
  };

  function catIds(doc) {
    var ids = [], seen = {};
    (doc.options || []).forEach(function (o) {
      (o.lines || []).forEach(function (l) {
        if (l.catId && !seen[l.catId]) { seen[l.catId] = 1; ids.push(l.catId); }
      });
    });
    return ids;
  }

  /* family -> the footer warranty bullet for a quote/invoice (grouped, not per-service, so a
     3-line resurface job shows ONE resurfacing warranty line, not three). Periods are the house
     matrix; nothing here claims 5 years for grout/silicone. */
  var FOOTER = {
    resurf: 'Up to 5-year workmanship warranty on resurfacing (with proper care)',
    tiling: 'Up to 5-year workmanship warranty on new tiling and tile repairs',
    grout: '2-year warranty on regrouting',
    silicone: '12-month warranty on silicone'
  };

  TQ.warranty = {
    /* the service/period table printed on the certificate */
    services: function (doc) {
      var out = [];
      catIds(doc).forEach(function (id) { if (ROWS[id]) out.push({ label: ROWS[id][0], period: ROWS[id][1] }); });
      /* custom job with no recognised material: never over-claim — default to the shortest
         period we offer (12 months); the operator can raise it before signing if warranted */
      if (!out.length) out.push({ label: 'Workmanship on the services carried out', period: '12 months' });
      return out;
    },

    /* the "Warranty & cover" bullets for the quote/invoice footer, derived from the actual
       services so a grout- or silicone-only job never inherits a blanket "Up to 5-year" claim.
       Always ends with the insurance line. */
    footer: function (doc) {
      var fams = {}, out = [];
      catIds(doc).forEach(function (id) { if (FAMILY[id]) fams[FAMILY[id]] = 1; });
      ['resurf', 'tiling', 'grout', 'silicone'].forEach(function (f) { if (fams[f]) out.push(FOOTER[f]); });
      if (!out.length) out.push('Workmanship warranty on the work carried out');   // custom job: neutral, no period claim
      out.push('$10M public liability insurance');
      return out;
    },

    /* drafted special conditions: composed per service family, always editable */
    composeSpecial: function (doc) {
      var fams = {}, out = [];
      catIds(doc).forEach(function (id) { if (FAMILY[id]) fams[FAMILY[id]] = 1; });
      Object.keys(SPECIAL).forEach(function (f) {
        if (fams[f]) SPECIAL[f].forEach(function (s) { if (out.indexOf(s) === -1) out.push(s); });
      });
      if (!out.length) out = SPECIAL.resurf.slice(0, 1);
      return out;
    },

    /* everything the PDF needs */
    buildModel: function (doc, settings) {
      return {
        customer: (doc.customer && doc.customer.name) || '',
        address: (doc.customer && doc.customer.address) || '',
        date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }),
        invNo: doc.docNo || '',
        forWork: TQ.warranty.services(doc),
        special: (doc.warrantySpecial && doc.warrantySpecial.length)
          ? doc.warrantySpecial
          : TQ.warranty.composeSpecial(doc),
        /* "YOUR OPERATOR" is the person standing behind the work, not a phone number:
           prefer whoever signed, then the first configured operator, then the business name */
        operator: (doc.warrantySigner || settings.lastSigner ||
          String(settings.operators || '').split(',')[0].trim() || settings.businessName || '')
      };
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
