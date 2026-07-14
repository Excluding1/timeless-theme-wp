/* Timeless Resurfacing — built-in drafter ("Quick Draft").
   A deterministic parser + the price book: no external AI service, no API keys, works offline.

   How it reads a job ("run binding"): the text is chopped into small segments
   (commas, dashes, "and", newlines…). Segments accumulate into a RUN until a price
   appears; the price closes the run into ONE line item, matched against the price
   book. So "wall resurfacing including sides of bathtub and stripback - 1800"
   becomes a single resurfacing line at $1,800, and "tile stripping and dumping is 300"
   becomes one strip+dump line at $300. The biggest PRIMARY service headlines the option.

   Everything it produces lands in the form for a HUMAN to review before a PDF exists (Rule 8). */
(function (root) {
  var TQ = root.TQ = root.TQ || {};

  var STREET = '(street|st|road|rd|avenue|ave|drive|dr|lane|ln|place|pl|court|ct|crescent|cres|parade|pde|way|close|cl|boulevard|blvd|highway|hwy|terrace|tce|circuit|cct|esplanade|esp)';
  var ADDR_RE = new RegExp(
    '((?:unit\\s*\\d+[a-z]?[,\\s/]*)?\\d+[a-z]?(?:\\s*/\\s*\\d+[a-z]?)?\\s+[a-z\\\'\\u2019 ]+?\\s' + STREET +
    '\\b\\.?(?:\\s*,?\\s*[a-z \\\'\\u2019]+)?(?:\\s*,?\\s*(?:nsw|qld|vic|act|sa|wa|nt|tas))?(?:\\s*,?\\s*\\d{4})?)', 'i');
  var PHONE_RE = /(?:\+?61[\s-]?|0)[2-478](?:[\s-]?\d){8}/;
  var EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
  /* strictly "included": never matches "including" / "includes" */
  var INCLUDED_RE = /(?:^|\s)(included|free|no charge|no cost|no extra charge)(?=[\s.,;!)]|$)/i;

  function cat() { return TQ.getCatalogue ? TQ.getCatalogue() : (TQ.CATALOGUE || []); }

  function titleCase(s) {
    return s.replace(/\w\S*/g, function (t) { return t.charAt(0).toUpperCase() + t.substr(1); });
  }

  /* score every catalogue entry against a text run; return them best-first */
  function matchAll(text) {
    var lc = ' ' + String(text).toLowerCase() + ' ';
    var hits = [];
    cat().forEach(function (item) {
      var score = 0;
      (item.keywords || []).forEach(function (kw, i) {
        if (lc.indexOf(kw) !== -1) score += (item.keywords.length - i) + kw.length / 10;
      });
      if (score > 0) hits.push({ item: item, score: score });
    });
    hits.sort(function (a, b) { return b.score - a.score; });
    return hits;
  }
  function matchCatalogue(text) {
    var h = matchAll(text);
    return h.length ? h[0].item : null;
  }

  /* words that mark a bare number as a QUANTITY or measurement, never a price */
  var UNIT_AFTER = /^\s*(sqm|sq\s?m|m2|m²|mm|cm|metres?|meters?|litres?|days?|hrs?|hours?|weeks?|tiles?|coats?|rooms?|bathrooms?|walls?|x\b|%)/i;

  /* find a price in ONE segment. $-amounts always count; bare numbers need 3-5 digits
     at the END of the segment (a leading bare number reads as a quantity: "12 sqm",
     "10 wall tiles"); 2 digits allowed when the segment itself names a service
     ("missing tile 90"). */
  /* an explicit price connector ("for/is/at/costs/=/:") right before a trailing number is clear
     price intent — honour it even for a CUSTOM item not in the price book and even at 2 digits,
     so "drain cover replacement for 50" becomes a $50 line instead of being dropped. */
  var PRICE_CONNECTOR = /\b(?:for|is|are|at|cost|costs|costing|priced?|price|=|@)\s*\$?\s?(\d{2,5}(?:\.\d{1,2})?)\s*[.,;!]?\s*$/i;
  /* a REAL price in a segment: a $-amount, or a standalone 3-5 digit number (so a digit glued
     into a word like "3-pack" or "600 grit" is not mistaken for a price) */
  var HAS_PRICE = /\$\s?\d|(?:^|\s)\d{3,5}(?:\.\d{1,2})?(?=[\s.,;!]|$)/;
  function findAmount(seg, segHasService) {
    /* "included / free / no charge" makes it a $0 line — this wins unless the segment also
       carries an actual price (so "commercial 3-pack coating included" is correctly included) */
    if (INCLUDED_RE.test(seg) && !HAS_PRICE.test(seg)) return 'included';
    var m = seg.match(/\$\s?(\d{1,3}(?:,\d{3})+|\d+(?:\.\d{1,2})?)/);
    if (!m) {
      m = seg.match(/(?:^|\s|=|:)(\d{3,5}(?:\.\d{1,2})?)\s*[.,;!]?\s*$/);       // bare number at segment END only
      if (!m && segHasService) m = seg.match(/(?:^|\s|=|:)(\d{2,5})\s*[.,;!]?\s*$/);
      if (!m) m = seg.match(PRICE_CONNECTOR);                                    // "... for 50" = an explicit price
    }
    if (!m) return null;
    var raw = m[1];
    /* guard checks must inspect the MATCHED occurrence, not the first one
       ("120 sqm tiling job for 120": the price is the trailing 120) */
    var idx = m.index + m[0].indexOf(raw);
    var after = seg.slice(idx + String(raw).length);
    if (seg.indexOf('$') === -1 && UNIT_AFTER.test(after)) return null;         // "1000 tiles" = quantity
    /* a bare 4-digit number right after a state word or an "at/in <suburb>" is a postcode */
    if (seg.indexOf('$') === -1 && String(raw).replace(/\.\d+$/, '').length === 4) {
      var before = seg.slice(Math.max(0, idx - 30), idx);
      if (/\b(nsw|qld|vic|act|wa|sa|nt|tas)\b[,\s]*$/i.test(before)) return null;
      if (/\b(?:at|in)\s+[a-z][a-z'’ ]{2,25}\s$/i.test(before)) return null;
    }
    var n = parseFloat(String(raw).replace(/,/g, ''));
    return isFinite(n) ? n : null;
  }

  function tidyText(s) {
    var t = TQ.rules.sanitize(String(s)
      .replace(/\$\s?\d[\d,]*(?:\.\d{1,2})?|(?:^|\s)\d[\d,]*(?:\.\d{1,2})?(?=[\s.,;!]|$)/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/^\W+|\W+$/g, '')
      .replace(/\s+(is|for|at|costs?|=|:)$/i, '')).trim();
    return t ? t.charAt(0).toUpperCase() + t.slice(1) : t;
  }

  /* pull the trailing price / included token off a full line, leaving the description intact
     (internal digits like "3-pack" are kept — only a price at the very END is removed) */
  function stripTrailingPrice(ln) {
    return TQ.rules.sanitize(String(ln)
      .replace(/[\s,;:]*\$?\s?\d[\d,]*(?:\.\d{1,2})?\s*[.,;!]*\s*$/, '')   // "... 1050" / "...$1,050."
      .replace(INCLUDED_RE, '')                                            // "... included"
      .replace(/[\s,;:.\-]+$/, '')).trim();
  }

  /* ---- the run-binding engine: block text -> priced line items ---- */
  function parseBlockItems(block, warnings, optLabel) {
    var lines = [];
    var orphans = [];   // prices that arrived with no words attached
    /* join comma-thousands BEFORE the comma splitter can shred them: 1,540 -> 1540 */
    var normalised = String(block).replace(/(\d),(?=\d{3}(?:\D|$))/g, '$1');

    /* VERBATIM-LINE PASS: when the operator has PASTED an already-written quote, each
       newline-separated line that reads as a full sentence (6+ words) and ends in a price or
       "included" is kept EXACTLY as typed (commas, "and", "3-pack" all intact). Terse notes
       fall through to the run-binding engine below. */
    var leftover = [];
    normalised.split(/\n/).forEach(function (raw) {
      var ln = raw.trim();
      if (!ln) return;
      var amt = findAmount(ln, !!matchCatalogue(ln));
      var words = ln.replace(/[^A-Za-z]+/g, ' ').split(/\s+/).filter(Boolean).length;   // alpha words only
      /* only ONE price on the line => it's a single worded item; a line with several prices is
         a terse multi-item note and must go through the run-binder (do not collapse it) */
      var priceCount = (ln.match(/\$\s?\d[\d,]*(?:\.\d{1,2})?|(?:^|\s)\d{3,5}(?:\.\d{1,2})?(?=[\s.,;!]|$)/g) || []).length;
      var verbatimOk = (amt === 'included' && priceCount === 0) || (typeof amt === 'number' && priceCount === 1);
      if (verbatimOk && words >= 6) {
        var d = stripTrailingPrice(ln);
        d = d ? d.charAt(0).toUpperCase() + d.slice(1) : d;
        if (d) {
          var best = matchCatalogue(d);
          if (!lines.some(function (l) { return l.desc === d; }))
            lines.push({ desc: d, amount: amt, catId: best ? best.id : null, primary: !!(best && best.primary) });
          return;
        }
      }
      leftover.push(raw);
    });
    normalised = leftover.join('\n');
    var segs = normalised
      .split(/\n|(?:\s[-–—]+\s)|,|;|(?:\s\+\s)|\band\b|\balso\b|\bplus\b/i)
      .map(function (t) { return t.trim(); })
      .filter(Boolean);

    var run = '';

    function pushLine(best, desc, amount) {
      var amt, defaulted = false;
      if (amount !== null) {
        amt = amount;
      } else if (best && best.price != null) {
        amt = best.price;
        defaulted = true;
        warnings.push(optLabel + '"' + best.desc + '": no price in your text, used the price book default $' + best.price + ' (review it)');
      } else {
        amt = 0;
        defaulted = true;
        warnings.push(optLabel + '"' + desc + '": no price found, set it manually');
      }
      var dup = lines.some(function (l) { return l.desc === desc; });
      if (!dup) lines.push({ desc: desc, amount: amt, catId: best ? best.id : null, primary: !!(best && best.primary), _defaulted: defaulted });
    }

    /* distinct PRIMARY services named in the text (by non-overlapping keyword spans) */
    function primarySpans(text, hits) {
      var lc = text.toLowerCase();
      var spans = [];
      hits.forEach(function (h) {
        if (!h.item.primary) return;
        var bl = -1, pos = -1;
        (h.item.keywords || []).forEach(function (kw) {
          var p = lc.indexOf(kw);
          if (p !== -1 && kw.length > bl) { bl = kw.length; pos = p; }
        });
        if (pos !== -1) spans.push({ id: h.item.id, s: pos, e: pos + bl });
      });
      spans.sort(function (a, b) { return (b.e - b.s) - (a.e - a.s); });
      var kept = [];
      spans.forEach(function (sp) {
        if (!kept.some(function (k) { return sp.s >= k.s && sp.e <= k.e; })) kept.push(sp);
      });
      return kept;
    }

    /* an UNPRICED run naming several distinct services becomes one default-priced
       line per service ("bath resurfacing and a shower regrout" -> 2 lines).
       Longest keyword span wins; mentions inside a longer match are suppressed. */
    function emitUnpriced(text, hits) {
      var lc = text.toLowerCase();
      var spans = [];
      hits.forEach(function (h) {
        var bl = -1, pos = -1;
        (h.item.keywords || []).forEach(function (kw) {
          var p = lc.indexOf(kw);
          if (p !== -1 && kw.length > bl) { bl = kw.length; pos = p; }
        });
        if (pos !== -1) spans.push({ item: h.item, s: pos, e: pos + bl });
      });
      spans.sort(function (a, b) { return (b.e - b.s) - (a.e - a.s); });
      var kept = [];
      spans.forEach(function (sp) {
        var swallowed = kept.some(function (k) { return sp.s >= k.s && sp.e <= k.e; });
        var sameId = kept.some(function (k) { return k.item.id === sp.item.id; });
        if (!swallowed && !sameId) kept.push(sp);
      });
      kept.sort(function (a, b) { return a.s - b.s; });
      kept.slice(0, 4).forEach(function (sp) { pushLine(sp.item, sp.item.desc, null); });
      return kept.length > 0;
    }

    function closeRun(amount) {
      var text = run.trim(); run = '';
      if (!text) {
        if (typeof amount === 'number') orphans.push(amount);   // a price with no words: hold it
        return;
      }
      if (/^(name|address|phone|email|customer|client|quote for|available)\b/i.test(text) && !matchCatalogue(text)) return;

      var hits = matchAll(text);
      if (amount === null && hits.length > 1 && emitUnpriced(text, hits)) return;
      var best = hits.length ? hits[0].item : null;
      var desc;

      if (best) {
        /* keep the operator's OWN wording when they have written a full descriptive line (a
           pasted, already-worded quote), instead of swapping in the shorter price-book text.
           Terse notes ("bath resurface 1540") still get the polished book description. */
        var userText = tidyText(text);
        var richLine = userText && userText.split(/\s+/).length >= 6;
        desc = richLine ? userText : best.desc;
        /* one price covering two DIFFERENT primary services is worth a human look — but only
           auto-split TERSE runs; a full sentence stays exactly as the operator wrote it */
        if (typeof amount === 'number' && !richLine) {
          var spans = primarySpans(text, hits);
          if (spans.length > 1) {
            warnings.push(optLabel + 'one price ($' + amount + ') seems to cover several main jobs ("' + text + '"), the price was put on "' + best.desc + '" and the others added at the price-book default, check the split');
            /* don't let the OTHER named primary services silently vanish: emit each as its own
               default-priced line (was: whole run collapsed to the single best match) */
            var book = cat(), byId = {};
            book.forEach(function (c) { byId[c.id] = c; });
            spans.forEach(function (sp) {
              if (sp.id !== best.id && byId[sp.id]) pushLine(byId[sp.id], byId[sp.id].desc, null);
            });
          }
        }
      } else {
        desc = tidyText(text);
        if (!desc || amount === null) return;          // junk without a price: drop it
        warnings.push(optLabel + 'kept your wording for "' + desc + '" (not in the price book), tidy it if needed');
      }
      pushLine(best, desc, amount);
    }

    segs.forEach(function (seg) {
      var amt = findAmount(seg, !!matchCatalogue(seg));
      /* two priced-looking numbers in one segment: findAmount keeps the trailing one and the
         other would vanish silently — flag it so the human checks which applies */
      if (typeof amt === 'number') {
        var nums = String(seg).match(/\$\s?\d[\d,]*(?:\.\d{1,2})?|(?:^|\s)\d{3,5}(?:\.\d{1,2})?(?=\s|[.,;!]|$)/g) || [];
        if (nums.length > 1) warnings.push(optLabel + 'two prices found in one line ("' + seg.trim() + '"), used $' + amt + ', check which applies');
      }
      var text = seg
        .replace(/\$\s?\d[\d,]*(?:\.\d{1,2})?|(?:^|\s)\d[\d,]*(?:\.\d{1,2})?(?=[\s.,;!]|$)/g, ' ')
        .replace(INCLUDED_RE, ' ')
        .replace(/\s{2,}/g, ' ').trim()
        .replace(/\s+(is|for|at|costs?|=|:)$/i, '')
        .replace(/^(is|for|at|costs?|=|:)\s+/i, '');
      if (text) run += (run ? ' ' : '') + text;
      if (amt !== null) closeRun(amt);
    });
    closeRun(null);   // whatever is left had no price: default it or flag it

    /* a lone unattached price most likely belongs to the MAIN defaulted job
       ("$1400, bath resurface and silicone" -> the 1400 is for the bath) */
    var defaulted = lines.filter(function (l) { return l._defaulted; });
    if (orphans.length === 1 && defaulted.length >= 1) {
      var target = defaulted.filter(function (l) { return l.primary; })[0] || defaulted[0];
      target.amount = orphans[0];
      target._defaulted = false;
      warnings.push(optLabel + 'assigned your unattached $' + orphans[0] + ' to "' + target.desc + '", check it');
    } else {
      orphans.forEach(function (a) {
        warnings.push(optLabel + 'found $' + a + ' in your text not attached to any item, add it manually');
      });
    }
    lines.forEach(function (l) { delete l._defaulted; });

    return lines;
  }

  /* Strip contacts + name + address the same way parse() does, so their digits (postcode,
     unit number, phone) can never be read as a price, but a real price sitting in the same
     sentence still survives. Also removes the dangling "at/in" an address strip leaves
     behind ("...1050 at ,") so a price stays at its segment end and keeps binding. */
  function stripNonPrice(src) {
    src = String(src || '');
    var em = src.match(EMAIL_RE); if (em) src = src.replace(em[0], ' ');
    var ph = src.match(PHONE_RE); if (ph) src = src.replace(ph[0], ' ');
    var nm = src.match(/(?:name is|customer is|client is|for|quote for)\s+((?:[A-Z][a-zA-Z'’-]+)(?:\s+[A-Z][a-zA-Z'’-]+){0,2})\b/);
    if (nm) src = src.replace(nm[0], ' ');
    src = src.replace(/address is\s+.{5,90}?(?:(?:nsw|qld|vic|act|wa|sa|nt|tas)[,\s]*\d{4}|\d{4}|nsw|qld|vic|act|wa|sa|nt|tas)/i, ' ');
    /* only strip a bare street address when it is confirmed by a nearby postcode or state,
       so ordinary words that end in a street-type token ("either way", "the best st-andard")
       are never mistaken for an address and don't eat a price */
    var am = src.match(ADDR_RE);
    if (am) {
      var ctx = src.slice(am.index, am.index + am[0].length + 12);
      if (/\d{4}|\b(?:nsw|qld|vic|act|wa|sa|nt|tas)\b/i.test(ctx)) src = src.replace(am[1], ' ');
    }
    src = src.replace(/\b(?:at|in)\s+[a-z][a-z'’ ]{2,25}?\s+\d{4}\b/ig, ' ');
    src = src.replace(/\b(?:at|in)\s*(?=[,.;]|$)/gi, ' ');   // dangler left where an address was removed
    return src;
  }
  /* count each price magnitude in ONE block as a MULTISET (how many times it was typed as a
     price). One physical occurrence must count EXACTLY once: the unit-price scan runs per
     segment and skips a value findAmount already counted for that same segment, so "at 1540"
     or "$90 each" can never enter the ledger twice and fund two lines. */
  function scanBlockCounts(block) {
    var counts = {}, norm = String(block).replace(/(\d),(?=\d{3}(?:\D|$))/g, '$1');
    norm.split(/\n|(?:\s[-–—]+\s)|,|;|(?:\s\+\s)|\band\b|\balso\b|\bplus\b/i)
      .map(function (t) { return t.trim(); }).filter(Boolean)
      .forEach(function (seg) {
        var already = {};
        var amt = findAmount(seg, !!matchCatalogue(seg));
        if (typeof amt === 'number') {
          counts[amt] = (counts[amt] || 0) + 1;
          already[amt] = (already[amt] || 0) + 1;
        }
        /* unit prices phrased "at 90 each", "@90", "90 each", "90 per" (mid-segment, so
           findAmount misses them) — skipping any value findAmount took from THIS segment */
        var m, ure = /(?:\bat\s*|@\s*)\$?\s?(\d{2,5})(?:\s*(?:each|ea|per)\b)?|\b(\d{2,5})\s*(?:each|ea|per)\b/gi;
        while ((m = ure.exec(seg))) {
          var v = Number(m[1] || m[2]);
          if (!v) continue;
          if (already[v] > 0) { already[v]--; continue; }
          counts[v] = (counts[v] || 0) + 1;
        }
      });
    return counts;
  }
  /* The set of price magnitudes the user actually TYPED as prices (flattened). */
  function collectPriceTokens(text) {
    var set = {};
    stripNonPrice(text).split(/option\s*(?:a|b|c|1|2|3)\s*[:\-.]?/i).forEach(function (block) {
      var c = scanBlockCounts(block);
      Object.keys(c).forEach(function (k) { set[k] = 1; });
    });
    return set;
  }
  /* Per-block price ledger: an ORDERED array of {key, counts}. key '_head' = text before the
     first "Option X"; then 'A','B','C',... in order. counts is a multiset per block. Binding a
     model's amounts to the RIGHT block stops a price typed only in Option A from silently
     funding a fabricated Option B line (which the headline total, options[0], never shows). */
  function collectPriceTokensByBlock(text) {
    var parts = stripNonPrice(text).split(/option\s*(?:a|b|c|1|2|3)\s*[:\-.]?/i);
    var keys = ['_head', 'A', 'B', 'C', 'D', 'E'];
    return parts.map(function (block, i) { return { key: keys[i] || ('G' + i), counts: scanBlockCounts(block) }; });
  }

  TQ.draft = {
    priceTokens: function (text) { return collectPriceTokens(text); },
    priceTokensByBlock: function (text) { return collectPriceTokensByBlock(text); },

    parse: function (text) {
      var warnings = [];
      var src = String(text || '').trim();
      var out = {
        customer: { name: '', attn: '', address: '', access: '', phone: '', email: '' },
        jobIntro: '',
        options: [],
        warnings: warnings
      };
      if (!src) { warnings.push('Nothing to parse'); return out; }

      /* ---- contact details (then strip them so digits never read as prices) ---- */
      var em = src.match(EMAIL_RE);
      if (em) { out.customer.email = em[0]; src = src.replace(em[0], ' '); }
      var ph = src.match(PHONE_RE);
      if (ph) { out.customer.phone = ph[0].replace(/\s{2,}/g, ' ').trim(); src = src.replace(ph[0], ' '); }

      /* real-estate / business format: "Attn:/Attention:/C/- NAME" is the contact person, and
         "Property: ADDRESS" is the job address (the first line, e.g. "AitkenRE", is the company
         name, already captured by the name logic below). */
      var at = src.match(/(?:^|\n|\s)(?:attn|attention|c\/[\-o]|care of)\s*[:\-]?\s*([A-Za-z][a-zA-Z'’.\- ]{1,40}?)(?=[\n,;]|$)/i);
      if (at) { out.customer.attn = at[1].trim().replace(/[.,\s]+$/, ''); src = src.replace(at[0], ' '); }
      var pr = src.match(/property\s*[:\-]\s*([^\n]{5,90})/i);
      if (pr) {
        out.customer.address = titleCase(pr[1].trim().replace(/[.,\s]+$/, '')).replace(/\bNsw\b/, 'NSW');
        src = src.replace(pr[0], ' ');
      }

      var nm = src.match(/(?:name is|customer is|client is|for|quote for)\s+((?:[A-Z][a-zA-Z'’-]+)(?:\s+[A-Z][a-zA-Z'’-]+){0,2})\b/);
      if (nm) { out.customer.name = nm[1].trim(); src = src.replace(nm[0], ' '); }
      if (!out.customer.name) {
        var first = src.split(/\n/)[0].trim();
        var whole = first.match(/^[A-Z][a-zA-Z'’-]+(?:\s+[A-Z][a-zA-Z'’-]+){0,2}$/);
        var lead = first.match(/^([A-Z][a-zA-Z'’-]+(?:\s+[A-Z][a-zA-Z'’-]+){1,2})\s*,/);
        if (whole) { out.customer.name = first; src = src.replace(first, ' '); }
        else if (lead) { out.customer.name = lead[1]; src = src.replace(lead[1], ' '); }
      }
      if (!out.customer.name) warnings.push('No customer name found, add it manually');

      /* "address is …" captured lazily up to a postcode / state / separator, never the whole line */
      var ad = src.match(/address is\s+(.{5,90}?(?:(?:nsw|qld|vic|act|wa|sa|nt|tas)[,\s]*\d{4}|\d{4}|nsw|qld|vic|act|wa|sa|nt|tas))(?=[\s,.;]|$)/i)
            || src.match(/address is\s+([^\n,;]{5,60})/i);
      if (ad) {
        out.customer.address = titleCase(ad[1].trim().replace(/[.,\s]+$/, '')).replace(/\bNsw\b/, 'NSW');
        src = src.replace(ad[0], ' ');
      } else {
        var am = src.match(ADDR_RE);
        if (am) {
          out.customer.address = titleCase(am[1].replace(/\s{2,}/g, ' ').trim()).replace(/\bNsw\b/, 'NSW');
          src = src.replace(am[1], ' ');
        }
      }
      if (!out.customer.address) {
        /* "at hornsby 2077" (any case, with a postcode) is an address, never a price */
        var sp = src.match(/\b(?:at|in)\s+([a-z][a-z'’ ]{2,25}?)\s+(\d{4})\b/i);
        if (sp && !matchCatalogue(sp[1])) {
          out.customer.address = titleCase(sp[1].trim()) + ', NSW ' + sp[2];
          src = src.replace(sp[0], ' ');
        }
      }
      if (!out.customer.address) {
        /* suburb-only fallback: "in Canley Vale", "at Marsfield" */
        var sb = src.match(/\b(?:in|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\b/);
        var STOP = /^(option|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|monday|tuesday|wednesday|thursday|friday|saturday|sunday|the)\b/i;
        if (sb && !STOP.test(sb[1]) && sb[1] !== out.customer.name) {
          out.customer.address = sb[1] + ', NSW';
          src = src.replace(sb[0], ' ');
          warnings.push('Address set from the suburb only ("' + sb[1] + '"), add the street when you have it');
        } else {
          warnings.push('No address found, add it manually');
        }
      }

      /* clean the dangling "at/in" an address strip leaves behind, so a price that sat
         before the address ("...benchtop 1050 at 3 Nova Place...") stays at its segment end */
      src = src.replace(/\b(?:at|in)\s*(?=[,.;]|$)/gi, ' ');

      /* ---- date hints (before item parsing so they never read as items) ---- */
      var av = src.match(/\b(?:available|can do it|start)(?:\s+\w+){0,3}?\s+(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*(?:\s+\d{4})?)/i);
      if (av) { out.availableFrom = titleCase(av[1]); src = src.replace(av[0], ' '); }

      /* ---- option blocks ---- */
      var optSplit = src.split(/option\s*(?:a|b|c|1|2|3)\s*[:\-.]?/i);
      if (optSplit.length > 2) {
        var head = optSplit.shift();               // text before "option a" may still hold shared items
        var letters = ['A', 'B', 'C'];
        optSplit.forEach(function (block, i) {
          var lbl = 'Option ' + letters[i] + ': ';
          var lines = parseBlockItems(block, warnings, lbl);
          if (lines.length) {
            out.options.push({
              title: 'Option ' + letters[i], mode: 'itemised', lines: lines,
              totalLabel: 'Option ' + letters[i] + ' total (inc GST)'
            });
          }
        });
        var headLines = parseBlockItems(head, warnings, '');
        if (headLines.length && out.options.length) {
          out.options.forEach(function (o) { o.lines = headLines.concat(o.lines); });
        }
      } else {
        var lines = parseBlockItems(src, warnings, '');
        if (lines.length) {
          out.options.push({ title: 'The work', mode: 'itemised', lines: lines, totalLabel: 'Total (inc GST)' });
        } else {
          warnings.push('No line items recognised, add them manually');
        }
      }

      TQ.draft.compose(out);
      return out;
    },

    /* Shared composer: from out.options[].lines (each with a catId), derive the option
       titles, THE JOB intro + process, "what to expect" durations, and the EXACT
       per-material warranty. Deterministic and price-book driven, so it is identical
       whether the lines came from the offline parser or the local LLM extract.
       Every number here comes from the price book, never from free text or a model. */
    compose: function (out) {
      var book = cat();
      var byId = {};
      book.forEach(function (c) { byId[c.id] = c; });

      /* headline: the biggest PRIMARY service wins the option title */
      (out.options || []).forEach(function (o) {
        var main = null, bestKey = -1;
        (o.lines || []).forEach(function (l) {
          if (!l.catId) return;
          var a = typeof l.amount === 'number' ? l.amount : 0;
          var key = (l.primary ? 1e9 : 0) + a;
          if (key > bestKey) { bestKey = key; main = l.catId; }
        });
        if (main && (o.title || '').indexOf(':') === -1) {
          var c = byId[main];
          if (c) {
            var short = c.desc.split('(')[0].split(',')[0].split(';')[0].trim();
            o.title = (!o.title || o.title === 'The work') ? short : o.title + ': ' + short;
          }
        }
      });

      /* THE JOB + warranty + what-to-expect from EVERY detected service */
      var seen = [], seenIds = {};
      (out.options || []).forEach(function (o) {
        (o.lines || []).forEach(function (l) {
          if (l.catId && !seenIds[l.catId] && byId[l.catId]) { seenIds[l.catId] = 1; seen.push(byId[l.catId]); }
        });
      });
      var ordered = seen.filter(function (c) { return c.primary; }).concat(seen.filter(function (c) { return !c.primary; }));

      var phrases = ordered.map(function (c) { return c.phrase; }).filter(Boolean);
      if (phrases.length) {
        var opener = phrases.length === 1 ? phrases[0]
          : phrases.slice(0, -1).join(', ') + ' and ' + phrases[phrases.length - 1];
        var intro = opener.charAt(0).toUpperCase() + opener.slice(1) + '.';
        var procs = ordered.map(function (c) { return c.process; }).filter(Boolean).slice(0, 3);
        if (procs.length) intro += ' ' + procs.join(' ');
        if ((out.options || []).length > 1) intro += ' ' + (out.options.length === 2 ? 'Two options below.' : 'Options below.');
        out.jobIntro = intro;
      } else if (ordered[0] && ordered[0].intro) {
        out.jobIntro = ordered[0].intro;
      }

      var expect = [];
      ordered.forEach(function (c) {
        (c.expectLines || []).forEach(function (e) { if (expect.indexOf(e) === -1) expect.push(e); });
      });
      if (ordered.some(function (c) { return c.cure; })) expect.push('Ready to use 24 to 48 hours after the final coat');
      if (expect.length) { expect.push('Fixed price, no hidden fees'); out.expect = expect; }

      var warr = [];
      ordered.forEach(function (c) {
        (c.warrantyLines || []).forEach(function (w) { if (warr.indexOf(w) === -1) warr.push(w); });
      });
      if (warr.length) { warr.push('$10M public liability insurance'); out.warranty = warr; }

      return out;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
