/* Timeless Resurfacing — house rules (shared by the form, the AI drafter and the PDF).
   GST is INCLUSIVE: total = sum of line items; "GST included" = total / 11.
   No em-dashes in customer copy. No banned words (written / guarantee / certificate / in writing). */
(function (root) {
  var TQ = root.TQ = root.TQ || {};

  var R = TQ.rules = {};

  R.money = function (x) {
    var n = Number(x);
    if (!isFinite(n)) n = 0;                    // never print "NaN" on a customer document
    return n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  R.round2 = function (x) { return Math.round(x * 100) / 100; };

  /* Parse a currency string to a number. Strips thousands separators and keeps a SINGLE decimal.
     Critical: "1.540" (dot used as a thousands separator) must become 1540, NOT 1.54 — the old
     parseFloat-after-stripping printed $1.54 on a customer quote. Rules:
       "1,540"->1540 · "1,540.50"->1540.5 · "1.540"->1540 · "2250."->2250 · "1.50"->1.5 */
  R.parseAmount = function (str) {
    var s = String(str == null ? '' : str).replace(/[^0-9.,]/g, '').replace(/,/g, '');
    if (!s) return 0;
    var parts = s.split('.');
    if (parts.length > 2) {                      // several dots: all but the last are thousands seps
      var last = parts.pop();
      s = parts.join('') + (last.length && last.length <= 2 ? '.' + last : last);
    } else if (parts.length === 2 && parts[1].length === 3 && parts[0].length <= 3) {
      s = parts[0] + parts[1];                   // "1.540" -> "1540" (dot as thousands separator)
    }
    var n = parseFloat(s);
    return isFinite(n) ? n : 0;
  };

  /* GST portion inside a GST-inclusive total */
  R.gstOf = function (total) { return R.round2(total / 11); };

  R.optionTotal = function (lines) {
    var t = 0;
    (lines || []).forEach(function (l) {
      var a = l.amount;
      if (typeof a === 'number' && isFinite(a)) t += R.round2(a);   // round each line before summing (no cent drift)
    });
    return R.round2(t);
  };

  R.docTotal = function (doc) {
    /* the headline total = the first option's total (options are alternatives, not additive) */
    var o = (doc.options || [])[0];
    if (!o) return 0;
    if (o.mode === 'feature') return R.parseAmount(o.price);
    return R.optionTotal(o.lines);
  };

  /* the LARGEST option total — options are alternatives the customer chooses between, so the
     compliance threshold ($5k licence/contract) must consider the priciest one they could accept */
  R.docTotalMax = function (doc) {
    var max = 0;
    (doc.options || []).forEach(function (o) {
      var t = o.mode === 'feature' ? R.parseAmount(o.price) : R.optionTotal(o.lines);
      if (t > max) max = t;
    });
    return max;
  };

  /* Replace em-dashes (and stray en-dashes not inside number ranges) per the house style. */
  R.sanitize = function (text) {
    if (!text) return text;
    var t = String(text);
    t = t.replace(/\s*—\s*/g, ', ');                 // em-dash
    t = t.replace(/(\d)\s*–\s*(\d)/g, '$1 to $2');   // en-dash in ranges -> "to"
    t = t.replace(/\s*–\s*/g, ', ');                 // any other en-dash
    t = t.replace(/ ,/g, ',').replace(/,{2,}/g, ',');
    return t;
  };

  /* Customer-facing copy must never reveal that we may source the work out, nor read like an
     internal work order. The outsourcing nouns and hiring framing below are banned so they can
     never survive the AI guardrails or reach a PDF (the customer sees the WORK, never who does it). */
  var BANNED = new RegExp(
    '\\b(' +
      'written|guarantee[ds]?|certificate|in writing' +          // existing house rules
      '|subbie[s]?|sub-?contractor[s]?' +                        // outsourcing nouns (any context)
      '|(?:looking for|seeking|need(?:ing)?|hiring|after|find(?:ing)?)\\s+' +
        '(?:a\\s+|an\\s+|some\\s*one\\s*|the\\s+)?' +
        '(?:subbie|sub-?contractor|tradie|trades?person|operator|someone|worker)' +   // hiring framing
    ')\\b', 'i');

  R.bannedIn = function (text) {
    var m = String(text || '').match(BANNED);
    return m ? m[0] : null;
  };

  /* Walk every customer-facing string in the doc; return a list of warnings. */
  R.validate = function (doc, settings) {
    var warnings = [];
    function check(label, text) {
      if (!text) return;
      var b = R.bannedIn(text);
      if (b) warnings.push(label + ': contains the banned word "' + b + '"');
      if (/—/.test(text)) warnings.push(label + ': contains an em-dash (house style: use a comma or colon)');
    }
    check('Job intro', doc.jobIntro);
    check('Options note', doc.optionsNote);
    (doc.options || []).forEach(function (o, i) {
      check('Option ' + (i + 1) + ' title', o.title);
      (o.lines || []).forEach(function (l) { check('Option ' + (i + 1) + ' line', l.desc); });
      (o.items || []).forEach(function (it) { check('Option ' + (i + 1) + ' bullet', it); });
    });
    /* every customer-facing text path gets the SAME banned-word/em-dash gate, not just some */
    (doc.warranty || []).forEach(function (w) { check('Warranty line', w); });
    (doc.expect || []).forEach(function (e) { check('What-to-expect line', e); });
    (doc.warrantySpecial || []).forEach(function (s) { check('Warranty special condition', s); });
    if (doc.customer) { check('Access note', doc.customer.access); }
    if (doc.photoCaption) check('Photo caption', doc.photoCaption);
    if (!doc.customer || !doc.customer.name) warnings.push('No customer name set');
    if ((doc.options || []).length === 0) warnings.push('No options / line items yet');
    (doc.options || []).forEach(function (o, i) {
      if (o.mode !== 'feature') {
        (o.lines || []).forEach(function (l) {
          if (l.amount === 0) warnings.push('Option ' + (i + 1) + ': a line has a $0.00 amount, set its price');
        });
      }
    });
    if (doc.docType === 'invoice' && settings && !settings.gstRegistered) {
      warnings.push('Business is not marked GST-registered in Settings: the PDF will say "INVOICE" (not "TAX INVOICE") and hide GST lines');
    }
    if (doc.docType === 'invoice' && (doc.options || []).length > 1) {
      warnings.push('An invoice should bill ONE agreed scope: remove the extra option(s) (quotes can have options, invoices should not)');
    }
    var maxOpt = R.docTotalMax(doc);   // the priciest option they could accept, not just option 1
    if (maxOpt > 5000) {
      warnings.push(settings && settings.licenceNo
        ? 'A job option is over $5,000 inc GST: NSW requires a written small-jobs contract at this value (the quote acceptance block + licence number can serve for $5k-$20k)'
        : 'A job option is over $5,000 inc GST: NSW requires a contractor licence + a written contract for residential work at this value, check before sending');
    }
    if (settings && Number(settings.depositPct) > 10) {
      warnings.push('Deposit is set to ' + Number(settings.depositPct) + '%: NSW caps residential deposits at 10%');
    }
    if ((Number(doc.depositPaid) || 0) > R.docTotal(doc)) {
      warnings.push('Deposit received is more than the total: the balance would be negative');
    }
    return warnings;
  };

  /* BLOCKING preflight before a customer PDF is downloaded. Warnings alone were only advisory,
     so a wrong invoice could still be sent. Returns { fatal:[], warn:[] }:
       fatal = would send something wrong or non-compliant → block the download
       warn  = worth a look → proceed only on explicit confirm. */
  R.preflight = function (doc, settings) {
    var fatal = [], warn = [];
    var isInvoice = doc.docType === 'invoice';
    var nOpts = (doc.options || []).length;
    R.validate(doc, settings).forEach(function (w) {
      if (/banned word|em-dash/.test(w)) fatal.push(w);   // a banned word on paper can't be un-sent
    });
    if (isInvoice && nOpts > 1) fatal.push('This invoice has ' + nOpts + ' options. An invoice must bill ONE agreed scope, or it shows work it does not charge for. Remove the extra option(s).');
    if (!doc.customer || !doc.customer.name) fatal.push('No customer name set.');
    if (isInvoice && !doc.docNo) fatal.push('This invoice has no number. Save it first to assign one.');
    if (settings && Number(settings.depositPct) > 10) fatal.push('Deposit is ' + Number(settings.depositPct) + '% — NSW caps residential deposits at 10%. Lower it in Settings before sending.');
    var total = R.docTotal(doc), dep = Number(doc.depositPaid) || 0;
    if (dep > total) fatal.push('Deposit received ($' + R.money(dep) + ') is more than the total ($' + R.money(total) + '); the balance would be negative.');
    if (R.docTotalMax(doc) > 5000 && !(settings && settings.licenceNo)) warn.push('A job option is over $5,000 inc GST: NSW needs a contractor licence + written contract at this value. Check before sending.');
    (doc.options || []).forEach(function (o, i) {
      if (o.mode !== 'feature') (o.lines || []).forEach(function (l) {
        if (l.amount === 0) warn.push('Option ' + (i + 1) + ' has a $0.00 line — set its price or remove it.');
      });
    });
    return { fatal: fatal, warn: warn };
  };

  /* House defaults */
  R.WARRANTY_5YR = [
    'Up to 5-year workmanship warranty',
    'Coating lifespan 10+ years with proper care',
    '$10M public liability insurance'
  ];
  R.EXPECT_PRESETS = {
    halfday: ['About half a day on site', 'Bath ready to use the next morning (full cure 24 to 48h)', 'Fixed price, no hidden fees'],
    day: ['About 1 day on site', 'Bath ready to use the next morning (full cure 24 to 48h)', 'Fixed price, no hidden fees'],
    days23: ['2 to 3 days on site', '24 to 48 hours to cure before use', 'Fixed price, no hidden fees']
  };

  /* Mandatory text for a "warranty against defects" document covering goods AND services
     (reg 90(4), Competition and Consumer Regulations 2010 — verified verbatim against the
     in-force compilation). Statutory wording: print verbatim, never edit (it intentionally
     overrides our banned-word style rule). */
  R.ACL_WARRANTY_TEXT =
    'Our goods and services come with guarantees that cannot be excluded under the Australian Consumer Law. ' +
    'For major failures with the service, you are entitled: to cancel your service contract with us; and to a refund ' +
    'for the unused portion, or to compensation for its reduced value. You are also entitled to choose a refund or ' +
    'replacement for major failures with goods. If a failure with the goods or a service does not amount to a major ' +
    'failure, you are entitled to have the failure rectified in a reasonable time. If this is not done you are entitled ' +
    'to a refund for the goods and to cancel the contract for the service and obtain a refund of any unused portion. ' +
    'You are also entitled to be compensated for any other reasonably foreseeable loss or damage from a failure in the goods or service.';

  /* ---- internal job-score gate (Surface Care discipline; NEVER printed on any customer
     document). Score before accepting: profit = quote total - estimated cost to deliver
     (sub quote + materials + travel, GST inclusive); margin = profit / total.
     Verdicts: accept  = profit >= $300 AND margin >= the settings floor
               thin    = profit >= $300 but margin under the floor (renegotiate cost or lift price)
               decline = profit under $300
               none    = no cost entered yet (the gate informs, it never blocks). */
  R.MIN_PROFIT = 300;
  R.jobScore = function (total, cost, floorPct) {
    if (typeof cost !== 'number' || !isFinite(cost)) return { verdict: 'none', profit: null, marginPct: null };
    var t = (typeof total === 'number' && isFinite(total)) ? total : 0;
    var profit = R.round2(t - cost);
    var marginPct = t > 0 ? (profit / t) * 100 : 0;
    var floor = (typeof floorPct === 'number' && isFinite(floorPct)) ? floorPct : 25;
    var verdict = profit < R.MIN_PROFIT ? 'decline' : (marginPct >= floor ? 'accept' : 'thin');
    return { verdict: verdict, profit: profit, marginPct: marginPct };
  };

  R.DEFAULT_SETTINGS = {
    businessName: 'Timeless Resurfacing',
    abn: '30 412 161 602',
    licenceNo: '',           // NSW contractor licence: prints under the ABN once held
    businessAddress: '',     // street/postal address: reg 90 requires it on the warranty PDF (claims address)
    cityLine: 'Sydney, NSW',
    phone: '0451 110 154',
    email: 'quotes@timelessresurfacing.com.au',
    website: 'timelessresurfacing.com.au',
    tagline: "Beautiful bathrooms shouldn't cost a fortune.",
    bankName: 'Timeless Resurfacing',
    bsb: '032146',
    account: '025303',
    operators: 'Allan, Sam',   // the people who sign warranties (quick-pick in the sign popup)
    lastSigner: '',
    depositPct: 10,
    marginFloorPct: 25,      // job-score gate: margin under this = THIN (internal, never printed)
    validityDays: 7,
    invoiceDueDays: 7,
    gstRegistered: true,     // Timeless IS registered for GST (Allan confirmed 2026-07-05)
    nextDocNo: 1022,         // prints TR-1022, then TR-1023, ...
    docPrefix: 'TR-'
  };
})(typeof window !== 'undefined' ? window : globalThis);
