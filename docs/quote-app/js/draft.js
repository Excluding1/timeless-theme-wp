/* Timeless Resurfacing — built-in drafter ("Quick Draft").
   A deterministic parser + the price book: no external AI service, no API keys, works offline.
   Paste a job description in Allan-speak ("name is Neil ... 2250 tiling on top - 1000 strip out ...")
   and it extracts the customer, address, contact, options and priced line items for review.
   Everything it produces lands in the form for a HUMAN to review before a PDF exists (Rule 8). */
(function (root) {
  var TQ = root.TQ = root.TQ || {};

  var STREET = '(street|st|road|rd|avenue|ave|drive|dr|lane|ln|place|pl|court|ct|crescent|cres|parade|pde|way|close|cl|boulevard|blvd|highway|hwy|terrace|tce|circuit|cct|esplanade|esp)';
  var ADDR_RE = new RegExp(
    '((?:unit\\s*\\d+[a-z]?[,\\s/]*)?\\d+[a-z]?(?:\\s*/\\s*\\d+[a-z]?)?\\s+[a-z\\\'\\u2019 ]+?\\s' + STREET +
    '\\b\\.?(?:\\s*,?\\s*[a-z \\\'\\u2019]+)?(?:\\s*,?\\s*(?:nsw|qld|vic|act|sa|wa|nt|tas))?(?:\\s*,?\\s*\\d{4})?)', 'i');
  var PHONE_RE = /(?:\+?61[\s-]?|0)[2-478](?:[\s-]?\d){8}/;
  var EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
  var MONEY_RE = /\$\s?(\d{1,3}(?:,\d{3})+|\d+(?:\.\d{1,2})?)|(?:^|\s)(\d{3,5})(?:\s|$|,|;|\.)/;
  var INCLUDED_RE = /\b(included|include it|free of charge|no charge|no cost|free)\b/i;

  function titleCase(s) {
    return s.replace(/\w\S*/g, function (t) { return t.charAt(0).toUpperCase() + t.substr(1); });
  }

  function matchCatalogue(clause) {
    var lc = clause.toLowerCase();
    var best = null, bestScore = 0;
    (TQ.CATALOGUE || []).forEach(function (item) {
      var score = 0;
      item.keywords.forEach(function (kw, i) {
        if (lc.indexOf(kw) !== -1) score += (item.keywords.length - i) + kw.length / 10;
      });
      if (score > bestScore) { bestScore = score; best = item; }
    });
    return best;
  }

  function findAmount(clause) {
    if (INCLUDED_RE.test(clause)) return 'included';
    var m = clause.match(MONEY_RE);
    if (!m) return null;
    var raw = m[1] || m[2];
    if (!raw) return null;
    /* a bare 4-digit number right after a state word is a postcode, not a price */
    if (!m[1] && String(raw).length === 4) {
      var idx = clause.indexOf(raw);
      var before = clause.slice(Math.max(0, idx - 14), idx);
      if (/\b(nsw|qld|vic|act|wa|sa|nt|tas)\b[,\s]*$/i.test(before)) return null;
    }
    var n = parseFloat(String(raw).replace(/,/g, ''));
    return isFinite(n) ? n : null;
  }

  /* split free text into item-sized clauses */
  function clauses(text) {
    return text
      .split(/\n|(?:\s-\s)|;|(?:\s\+\s)|(?:,\s*(?=\d))|(?:\band also\b)|(?:\balso\b)/i)
      .map(function (c) { return c.trim(); })
      .filter(function (c) { return c.length > 2; });
  }

  function parseBlockItems(block, warnings, optLabel) {
    var lines = [];
    clauses(block).forEach(function (cl) {
      /* skip clauses that are clearly contact/meta, they are handled globally */
      if (EMAIL_RE.test(cl) && cl.length < 60) return;
      if (ADDR_RE.test(cl) && !matchCatalogue(cl)) return;
      if (/^(name|address|phone|customer|client|quote for)\b/i.test(cl)) return;

      var amount = findAmount(cl);
      var cat = matchCatalogue(cl);
      if (!cat && amount === null) return;           // nothing useful in this clause

      var desc, amt;
      if (cat) {
        desc = cat.desc;
        if (amount !== null) {
          amt = amount;
        } else if (cat.price != null) {
          amt = cat.price;
          warnings.push(optLabel + '"' + cat.desc + '": no price in your text, used the price book default $' + cat.price + ' (review it)');
        } else {
          amt = 0;
          warnings.push(optLabel + '"' + cat.desc + '": no price found, set it manually');
        }
      } else {
        /* priced clause we could not match: keep the cleaned text */
        desc = TQ.rules.sanitize(cl.replace(/\$?\s?\d[\d,]*(?:\.\d{1,2})?/g, '').replace(/\s{2,}/g, ' ').replace(/\s*(for|at|=|:)\s*$/i, '').trim());
        desc = desc.charAt(0).toUpperCase() + desc.slice(1);
        amt = amount;
        warnings.push(optLabel + 'kept your wording for "' + desc + '" (no catalogue match), tidy it if needed');
      }
      /* dedupe: same desc already captured in this option */
      var dup = lines.some(function (l) { return l.desc === desc; });
      if (!dup) lines.push({ desc: desc, amount: amt, catId: cat ? cat.id : null });
    });
    return lines;
  }

  TQ.draft = {
    parse: function (text) {
      var warnings = [];
      var src = String(text || '').trim();
      var out = {
        customer: { name: '', address: '', access: '', phone: '', email: '' },
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

      var nm = src.match(/(?:name is|customer is|client is|for|quote for)\s+((?:[A-Z][a-zA-Z'’-]+)(?:\s+[A-Z][a-zA-Z'’-]+){0,2})\b/);
      if (nm) out.customer.name = nm[1].trim();
      if (!out.customer.name) {
        var first = src.split(/\n/)[0].trim();
        var whole = first.match(/^[A-Z][a-zA-Z'’-]+(?:\s+[A-Z][a-zA-Z'’-]+){0,2}$/);
        var lead = first.match(/^([A-Z][a-zA-Z'’-]+(?:\s+[A-Z][a-zA-Z'’-]+){1,2})\s*,/);
        if (whole) out.customer.name = first;
        else if (lead) out.customer.name = lead[1];
      }
      if (!out.customer.name) warnings.push('No customer name found, add it manually');

      /* "address is …" captured lazily up to a postcode / state / separator, never the whole line */
      var ad = src.match(/address is\s+(.{5,90}?(?:(?:nsw|qld|vic|act|wa|sa|nt|tas)[,\s]*\d{4}|\d{4}|nsw|qld|vic|act|wa|sa|nt|tas))(?=[\s,.;]|$)/i)
            || src.match(/address is\s+([^\n,;]{5,60})/i);
      if (ad) {
        out.customer.address = titleCase(ad[1].trim().replace(/[.,\s]+$/, '')).replace(/\bNsw\b/, 'NSW');
      } else {
        var am = src.match(ADDR_RE);
        if (am) out.customer.address = titleCase(am[1].replace(/\s{2,}/g, ' ').trim()).replace(/\bNsw\b/, 'NSW');
      }
      if (!out.customer.address) {
        /* suburb-only fallback: "in Canley Vale", "at Marsfield" */
        var sb = src.match(/\b(?:in|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\b/);
        var STOP = /^(option|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|monday|tuesday|wednesday|thursday|friday|saturday|sunday|the)\b/i;
        if (sb && !STOP.test(sb[1]) && sb[1] !== out.customer.name) {
          out.customer.address = sb[1] + ', NSW';
          warnings.push('Address set from the suburb only ("' + sb[1] + '"), add the street when you have it');
        } else {
          warnings.push('No address found, add it manually');
        }
      }

      /* ---- option blocks ---- */
      var optSplit = src.split(/option\s*(?:a|b|c|1|2|3)\s*[:\-.]?/i);
      if (optSplit.length > 2) {
        var head = optSplit.shift();               // text before "option a" may still hold items
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
          /* shared items go into every option */
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

      /* ---- option titles + intro from the biggest matched item ---- */
      out.options.forEach(function (o) {
        var main = null, maxAmt = -1;
        o.lines.forEach(function (l) {
          var a = typeof l.amount === 'number' ? l.amount : 0;
          if (l.catId && a > maxAmt) { maxAmt = a; main = l.catId; }
        });
        if (main && o.title.indexOf(':') === -1) {
          var cat = TQ.CATALOGUE.filter(function (c) { return c.id === main; })[0];
          if (cat) {
            var short = cat.desc.split('(')[0].split(',')[0].trim();
            o.title = (o.title === 'The work' ? short : o.title + ': ' + short);
            if (!out.jobIntro && cat.intro) out.jobIntro = cat.intro;
          }
        }
      });

      /* ---- date hints ---- */
      var av = src.match(/\b(?:available|can do it|start)(?:\s+\w+){0,3}?\s+(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*(?:\s+\d{4})?)/i);
      if (av) out.availableFrom = titleCase(av[1]);

      return out;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
