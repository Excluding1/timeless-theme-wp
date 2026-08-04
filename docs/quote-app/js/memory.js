/* Timeless Resurfacing — job memory (the "self-improving" part of Quick Draft).
   It learns from your OWN finished quotes: the real price you charge for each service, and
   your standard job templates (e.g. a benchtop-only resurface). Nothing customer-specific is
   ever stored here — names, addresses, phones and emails never enter memory. Only the WORK:
   service, wording, price. The memory lives inside settings, so it syncs across devices via
   Supabase. It is deterministic and can never invent a number: it only reuses prices you have
   actually charged before, and it only ever overrides a book DEFAULT, never a price you typed. */
(function (root) {
  var TQ = root.TQ = root.TQ || {};

  function shortLabel(lines) {
    var prim = lines.filter(function (l) { return l.primary; })[0] || lines[0];
    if (!prim) return 'Past job';
    return String(prim.desc).split('(')[0].split(',')[0].split(';')[0].trim();
  }
  /* the priced work on a doc — first option only (later options are alternatives, not extra work) */
  function pricedLines(doc) {
    var opt = ((doc && doc.options) || [])[0];
    if (!opt) return [];
    return (opt.lines || []).filter(function (l) {
      return l && l.catId && typeof l.amount === 'number' && l.amount > 0;
    });
  }

  var MEM = TQ.memory = {
    empty: function () { return { services: {}, templates: [], _seeded: true }; },

    /* fold ONE quote's work into the memory; returns the (mutated) memory */
    learn: function (doc, mem) {
      mem = mem || MEM.empty();
      mem.services = mem.services || {};
      mem.templates = mem.templates || [];
      var priced = pricedLines(doc);
      if (!priced.length) return mem;
      var when = doc.updatedAt || doc.createdAt || '';

      /* per-service price + wording memory */
      priced.forEach(function (l) {
        var s = mem.services[l.catId] = mem.services[l.catId] || { prices: [], n: 0 };
        s.prices.push(l.amount);
        if (s.prices.length > 12) s.prices.shift();   // keep the last dozen
        s.lastDesc = l.desc;
        s.n++;
        s.updatedAt = when;
      });

      /* one template per distinct job signature (the set of services), keeping the latest */
      var sig = priced.map(function (l) { return l.catId; }).sort().join('+');
      var lines = priced.map(function (l) {
        return { desc: l.desc, amount: l.amount, catId: l.catId, primary: !!l.primary };
      });
      var total = lines.reduce(function (a, l) { return a + l.amount; }, 0);
      var t = mem.templates.filter(function (x) { return x.sig === sig; })[0];
      if (t) {
        t.lines = lines; t.total = total; t.intro = doc.jobIntro || t.intro || '';
        t.label = shortLabel(lines); t.n++; t.updatedAt = when;
      } else {
        mem.templates.push({ sig: sig, label: shortLabel(lines), lines: lines,
          intro: doc.jobIntro || '', total: total, n: 1, updatedAt: when });
      }
      mem.templates.sort(function (a, b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); });
      if (mem.templates.length > 40) mem.templates = mem.templates.slice(0, 40);
      return mem;
    },

    /* your usual price for a service = the MOST RECENT you've charged (null if never) */
    priceFor: function (catId, mem) {
      var s = mem && mem.services && mem.services[catId];
      return (s && s.prices && s.prices.length) ? s.prices[s.prices.length - 1] : null;
    },

    /* On a fresh draft, swap the book-DEFAULT price for YOUR usual price on any line that was
       defaulted (never touches a price the operator actually typed). Also strips the transient
       _book flag so it never lands in a saved doc. Recomposes titles if anything changed. */
    applyLearnedPrices: function (out, mem) {
      var changed = false;
      ((out && out.options) || []).forEach(function (o) {
        (o.lines || []).forEach(function (l) {
          var wasBook = (l._book === true) || (l._priced === false);
          if (wasBook && l.catId && mem) {
            var p = MEM.priceFor(l.catId, mem);
            if (p != null && p !== l.amount) {
              l.amount = p; changed = true;
              out.warnings = out.warnings || [];
              var msg = 'used your usual price for "' + (l.desc || l.catId) + '" $' + p + ' (from your past jobs, not the book default), check it';
              /* replace the "used the price book default" note for this line rather than stack a second */
              var pre = '"' + (l.desc || '') + '": no price';
              var wi = -1;
              out.warnings.forEach(function (w, k) { if (wi === -1 && String(w).indexOf(pre) === 0) wi = k; });
              if (wi >= 0) out.warnings[wi] = msg; else out.warnings.push(msg);
            }
          }
          delete l._book;
        });
      });
      if (changed && TQ.draft && TQ.draft.compose) TQ.draft.compose(out);
      return out;
    },

    /* templates for the "reuse a past job" picker, most-recent first */
    templates: function (mem) { return (mem && mem.templates) || []; },

    /* build a draft-shaped result from a stored template — NO customer data, prices are the
       real ones you charged. Titles / THE JOB / warranty come from the deterministic composer. */
    fromTemplate: function (t) {
      var out = {
        customer: { name: '', attn: '', address: '', access: '', phone: '', email: '' },
        options: [{ title: 'The work', mode: 'itemised',
          lines: (t.lines || []).map(function (l) { return { desc: l.desc, amount: l.amount, catId: l.catId, primary: !!l.primary }; }),
          totalLabel: 'Total (inc GST)' }],
        jobIntro: '',
        warnings: ['Loaded from a past job, check the price and wording for this customer']
      };
      if (TQ.draft && TQ.draft.compose) TQ.draft.compose(out);
      if (t.intro) out.jobIntro = t.intro;   // keep the wording you approved last time
      return out;
    },

    /* one-time seed of the memory from all existing quotes */
    backfill: function (quotes) {
      var mem = MEM.empty();
      (quotes || []).forEach(function (q) { MEM.learn(q, mem); });
      return mem;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
