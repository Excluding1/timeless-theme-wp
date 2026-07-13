/* Timeless Resurfacing — mini AI (LOCAL language model, optional).
   Polishes the WORDING of the job description. It never touches numbers: prices,
   totals, GST, warranty periods and durations all come from the rules engine and
   the price book, and the output is validated before it can replace anything.

   Two local providers, tried in order:
     1. Chrome's built-in model (Prompt API / Gemini Nano): zero download, on-device.
     2. WebLLM (vendored js/vendor/webllm.esm.js): runs Qwen2.5-1.5B in the browser
        via WebGPU. One-time ~1GB model download (cached by the browser), opt-in.
   Nothing is ever sent to a server either way. */
(function (root) {
  var TQ = root.TQ = root.TQ || {};

  var M = TQ.minillm = {
    state: 'idle',            // idle | loading | ready | unavailable
    provider: null,           // 'chrome' | 'webllm'
    detail: '',
    _chrome: null,
    _engine: null,

    /* what would be available here, without loading anything heavy */
    async probe() {
      try {
        var LM = root.LanguageModel || (root.ai && root.ai.languageModel);
        if (LM && LM.availability) {
          var a = await LM.availability();
          if (a && a !== 'unavailable' && a !== 'no') return 'chrome';
        } else if (LM && LM.capabilities) {
          var c = await LM.capabilities();
          if (c && c.available && c.available !== 'no') return 'chrome';
        }
      } catch (e) { /* fall through */ }
      if (root.navigator && navigator.gpu) return 'webllm-possible';
      return null;
    },

    async ensure(webllmEnabled, onProgress) {
      if (M.state === 'ready') return M.provider;
      M.state = 'loading';
      function prog(t) { if (onProgress) onProgress(t); }

      /* 1: Chrome built-in */
      try {
        var LM = root.LanguageModel || (root.ai && root.ai.languageModel);
        if (LM) {
          prog('Checking the browser’s built-in model…');
          var avail = LM.availability ? await LM.availability() : (LM.capabilities ? (await LM.capabilities()).available : 'no');
          if (avail && avail !== 'unavailable' && avail !== 'no') {
            M._chrome = await LM.create({
              monitor: function (m) {
                if (m && m.addEventListener) m.addEventListener('downloadprogress', function (e) {
                  prog('Browser model downloading… ' + Math.round((e.loaded || 0) * 100) + '%');
                });
              }
            });
            M.provider = 'chrome'; M.state = 'ready'; M.detail = 'Chrome built-in model (on-device)';
            return M.provider;
          }
        }
      } catch (e) { /* fall through to WebLLM */ }

      /* 2: WebLLM (opt-in: ~1GB one-time model download, needs WebGPU) */
      if (!webllmEnabled) { M.state = 'unavailable'; M.detail = 'No built-in browser model. Enable the WebLLM fallback in Settings to use the mini AI.'; throw new Error(M.detail); }
      if (!(root.navigator && navigator.gpu)) { M.state = 'unavailable'; M.detail = 'This browser has no WebGPU, the mini AI cannot run here.'; throw new Error(M.detail); }
      prog('Loading the local AI runtime…');
      var webllm = await import('./vendor/webllm.esm.js');
      M._engine = await webllm.CreateMLCEngine('Qwen2.5-1.5B-Instruct-q4f16_1-MLC', {
        initProgressCallback: function (p) { prog(p.text || ('Downloading model… ' + Math.round((p.progress || 0) * 100) + '%')); }
      });
      M.provider = 'webllm'; M.state = 'ready'; M.detail = 'Qwen2.5-1.5B running locally via WebGPU';
      return M.provider;
    },

    async _complete(system, user, opts) {
      opts = opts || {};
      if (M.provider === 'chrome') {
        var s = await (root.LanguageModel || root.ai.languageModel).create({ initialPrompts: [{ role: 'system', content: system }] });
        var out = await s.prompt(user);
        if (s.destroy) s.destroy();
        return out;
      }
      var r = await M._engine.chat.completions.create({
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
        temperature: opts.temperature || 0.3, max_tokens: opts.maxTokens || 220
      });
      return r.choices[0].message.content;
    },

    /* ---- shared guardrails (pure, unit-testable without a model) ----
       Any model output that invents a number/price, uses a banned word, or blows the
       length bound is REJECTED. The only numbers allowed in a rewrite are ones already
       present in the source. This is what makes the local model safe to run "throughout". */
    digitsOf: function (s) {
      /* normalise 1,540 -> 1540 so comma-thousands compare correctly */
      return (String(s == null ? '' : s).replace(/(\d),(?=\d{3}(?:\D|$))/g, '$1').match(/\d+(?:\.\d+)?/g) || [])
        .map(function (d) { return d.replace(/\.0+$/, ''); });
    },
    textIsSafe: function (out, allowedSource, opts) {
      opts = opts || {};
      if (!out || out.length < (opts.min || 10) || out.length > (opts.max || 800)) return false;
      if (TQ.rules.bannedIn(out)) return false;
      var allow = M.digitsOf(allowedSource);
      return M.digitsOf(out).every(function (d) { return allow.indexOf(d) !== -1; });
    },

    /* Even with every digit already in the source, a model can recombine words into a
       fabricated claim ("warranty runs for 5 years", "1540 days of cover"). So any
       period/warranty/money word in the output must also have been in the source. */
    claimWordsSafe: function (out, source) {
      var src = String(source).toLowerCase();
      var CLAIM = /\b(years?|months?|weeks?|days?|hours?|warrant\w*|guarantee\w*|lifetime|forever|percent|refund|deposit)\b|%|\$/gi;
      var m = String(out).toLowerCase().match(CLAIM) || [];
      return m.every(function (w) { return src.indexOf(w) !== -1; });
    },
    _sigWords: function (s) {
      return (String(s).toLowerCase().match(/[a-z]{4,}/g) || []).map(function (w) { return w.slice(0, 5); });
    },
    /* every original bullet must survive by content (>=50% of its significant word-stems
       reappear in some distinct output bullet) — guards against silent replace/insert */
    _bulletsPreserved: function (originals, outLines) {
      var used = outLines.map(function () { return false; });
      return originals.every(function (orig) {
        var ow = M._sigWords(orig);
        if (!ow.length) return true;
        for (var i = 0; i < outLines.length; i++) {
          if (used[i]) continue;
          var lw = M._sigWords(outLines[i]);
          var hit = ow.filter(function (w) { return lw.indexOf(w) !== -1; }).length;
          if (hit / ow.length >= 0.5) { used[i] = true; return true; }
        }
        return false;
      });
    },
    _clean: function (raw) {
      return TQ.rules.sanitize(String(raw == null ? '' : raw).trim().replace(/^["'“]+|["'”]+$/g, ''));
    },
    _safeJson: function (raw) {
      var s = String(raw == null ? '' : raw);
      var a = s.indexOf('{'), b = s.lastIndexOf('}');
      if (a === -1 || b <= a) return null;
      try { return JSON.parse(s.slice(a, b + 1)); } catch (e) { return null; }
    },

    /* factual reference block: the exact work on the doc, so a rewrite can't add scope */
    _facts: function (doc) {
      var f = [];
      (doc.options || []).forEach(function (o) {
        (o.lines || []).forEach(function (l) { f.push(l.desc); });
        (o.items || []).forEach(function (it) { f.push(it); });
      });
      return f.join('\n- ');
    },

    /* rewrite ONE prose field; returns polished text or null (caller keeps original) */
    async _polishField(kind, text, facts, maxSentences) {
      if (!text) return null;
      var system =
        'You edit customer-facing copy for an Australian bathroom resurfacing business. ' +
        'Rewrite the ' + kind + ' so it reads warmly and professionally in Australian English. ' +
        'Describe ONLY the work being done for the customer. This text is read by the CUSTOMER, ' +
        'so never mention subcontractors, subbies, hiring, sourcing, or who will carry out the work, ' +
        'and never phrase it as an internal job brief or a request for a tradesperson. ' +
        'STRICT RULES: keep every fact; never add services, prices, numbers, dates or claims; ' +
        'never use the words "written", "guarantee", "certificate", "subbie", "subcontractor" or em dashes; ' +
        'maximum ' + (maxSentences || 3) + ' sentences; reply with the rewritten text only, no preamble.';
      var user = kind.toUpperCase() + ':\n' + text +
        (facts ? '\n\nTHE WORK (do not add anything beyond this):\n- ' + facts : '');
      var out = M._clean(await M._complete(system, user));
      var allowed = text + ' ' + (facts || '');
      return (M.textIsSafe(out, allowed, { min: 15, max: 700 }) && M.claimWordsSafe(out, allowed)) ? out : null;
    },

    /* back-compat: polish just the job intro (returns a string or null) */
    async polish(doc) {
      return M._polishField('job description', doc.jobIntro || '', M._facts(doc));
    },

    /* polish ALL prose on a doc at once: job intro + options note. Returns
       { jobIntro?, optionsNote? } with only the fields that passed validation. */
    async polishBundle(doc) {
      var facts = M._facts(doc), result = {};
      if (doc.jobIntro) { var j = await M._polishField('job description', doc.jobIntro, facts); if (j) result.jobIntro = j; }
      if (doc.optionsNote) { var n = await M._polishField('note under the options', doc.optionsNote, facts, 2); if (n) result.optionsNote = n; }
      return result;
    },

    /* tidy the warranty special-condition bullets; returns an array of clean lines
       (falls back to the originals if the model output fails validation) */
    async polishConditions(doc, conditions) {
      var src = (conditions || []).join('\n');
      if (!src) return conditions || [];
      var system =
        'You tidy the care and special-condition bullet points on a bathroom warranty, in ' +
        'Australian English. STRICT RULES: keep every instruction and every number exactly; ' +
        'do not add or remove any point; do not use "guarantee", "written", "certificate" or em ' +
        'dashes; reply with one clean bullet per line, no numbering, no preamble.';
      var out = M._clean(await M._complete(system, 'BULLETS:\n' + src));
      var orig = conditions || [];
      if (!M.textIsSafe(out, src, { min: 10, max: 900 }) || !M.claimWordsSafe(out, src)) return orig;
      var lines = out.split('\n').map(function (l) { return l.replace(/^[\s\-•*\d.)]+/, '').trim(); }).filter(Boolean);
      /* accept only a strict 1:1 tidy: exactly the same count AND every original bullet
         survives by content (no silent replacement or added claim) */
      if (lines.length !== orig.length || !M._bulletsPreserved(orig, lines)) return orig;
      return lines;
    },

    /* LLM-assisted DRAFT from free text. Returns the same shape as TQ.draft.parse
       (customer, options[], jobIntro, expect, warranty, warnings) or null on failure.

       The model does ONLY routing: which service, which OPTION each line belongs to, and
       which price token in the notes to attach. Every price magnitude is bound to a PER-BLOCK
       ledger (TQ.draft.priceTokensByBlock) and consumed with multiplicity, so a price typed
       only in Option A can never fund a fabricated Option B line (options are alternatives, and
       the headline total shows options[0] only). All titles, THE JOB, warranty and expect come
       from the deterministic composer, never the model. Any structural failure returns null so
       the caller falls back to the offline parser. */
    async extract(text) {
      var src = String(text || '').trim();
      if (!src) return null;
      var book = (TQ.getCatalogue ? TQ.getCatalogue() : TQ.CATALOGUE) || [];
      var byId = {}; book.forEach(function (c) { byId[c.id] = c; });
      var menu = book.map(function (c) {
        return c.id + ' = ' + c.desc.split('(')[0].split(';')[0].trim().split(/\s+/).slice(0, 6).join(' ');
      }).join('\n');

      var system =
        'You turn an Australian bathroom-resurfacing tradesperson\'s rough notes into structured quote data.\n' +
        'Reply with STRICT JSON only. No prose, no markdown, no code fences.\n' +
        'Each "desc" names the WORK for the customer (e.g. "drain cover replacement"); never write who does it, ' +
        'and never use the words subbie, subcontractor, tradie or "looking for".\n\n' +
        'SHAPE:\n' +
        '{"customer":{"name":"","address":"","phone":"","email":"","access":""},"available_from":"",' +
        '"items":[{"service_id":"","desc":"","amount":0,"option_group":0,"source_key":"","variant_label":"","area":"","qty":null,"unit_amount":null,"included":false}]}\n\n' +
        'HOW TO GROUP (most important rule):\n' +
        '- AND, plus, +, comma, new line, "also", or two bathrooms named together (ensuite and main, bath 1 and bath 2) => the SAME option. Keep option_group the same. The customer gets ALL of these.\n' +
        '- OR, vs, instead of, rather than, "upgrade to", "optional", "if you want", "can also do" => a NEW option: increase option_group by 1. This is an ALTERNATIVE the customer chooses between. NEVER add options together.\n' +
        '- "Option A ... Option B ..." => A is option_group 1, B is option_group 2; set source_key "A" or "B". Work stated BEFORE the first Option word is shared: option_group 0, source_key "".\n' +
        '- "everything in A plus X" => copy option A\'s items into this group AND add X.\n' +
        '- Only split when BOTH sides are a real priced job. "epoxy or standard grout", "cream or white", "Thursday or Friday" are just descriptions: keep them in ONE item, do not split.\n\n' +
        'PRICES:\n' +
        '- amount MUST be a number that literally appears in the notes for that item (it may come before OR after the service words). If no price is stated, use null. NEVER invent, estimate or round a price.\n' +
        '- "3 tiles at 90 each" => qty:3, unit_amount:90, amount null.\n' +
        '- "included", "free", "no charge" => included:true, amount null.\n\n' +
        'FIELDS: service_id MUST be a MENU id, or "other" with a short plain "desc". variant_label only for same-service tiers (e.g. "Premium finish"). area = the room if named. available_from = start date if stated. customer.access = parking/entry/tenant notes if stated.\n\n' +
        'MENU (id = service):\n' + menu + '\n\n' +
        'EXAMPLE 1 (OR => two options):\n' +
        'NOTES: dave 0412 345 678, 14 rose st marrickville. bath resurface 1540, or strip it right back first and resurface for 1990.\n' +
        'JSON: {"customer":{"name":"Dave","address":"14 Rose St Marrickville","phone":"0412 345 678","email":"","access":""},"available_from":"","items":[{"service_id":"bath-resurface","amount":1540,"option_group":1,"source_key":""},{"service_id":"bath-resurface","amount":1990,"option_group":2,"source_key":""},{"service_id":"strip-back","amount":null,"option_group":2,"source_key":""}]}\n\n' +
        'EXAMPLE 2 (AND => one option):\n' +
        'NOTES: full reno at 22 hill st. strip out 1000, tipping 700, new wall tiles 2000, regrout shower 1000, new silicone included.\n' +
        'JSON: {"customer":{"name":"","address":"22 Hill St","phone":"","email":"","access":""},"available_from":"","items":[{"service_id":"strip-out","amount":1000,"option_group":0},{"service_id":"tipping","amount":700,"option_group":0},{"service_id":"wall-tiles-new","amount":2000,"option_group":0},{"service_id":"shower-regrout","amount":1000,"option_group":0},{"service_id":"silicone","amount":null,"option_group":0,"included":true}]}';

      var parsed = M._safeJson(await M._complete(system, 'NOTES:\n' + src, { maxTokens: 500, temperature: 0.2 }));
      if (!parsed || !Array.isArray(parsed.items) || !parsed.items.length || parsed.items.length > 200) return null;

      /* per-block price ledger (multiset per block) */
      var ledger = [];
      try { ledger = TQ.draft.priceTokensByBlock(src); } catch (e) { ledger = []; }
      var byKey = {}; ledger.forEach(function (l) { byKey[l.key] = l; });
      var head = byKey._head || { counts: {} };
      function consume(block, v) { if (block && block.counts[v] > 0) { block.counts[v]--; return true; } return false; }
      function tc(s) { return String(s).replace(/\w\S*/g, function (t) { return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase(); }); }
      function safeText(t, min, max) {
        var s = TQ.rules.sanitize(String(t || '')).slice(0, max);
        return (s && s.length >= (min || 2) && M.textIsSafe(s, src, { min: min || 2, max: max }) && M.claimWordsSafe(s, src) && !TQ.rules.bannedIn(s)) ? s : '';
      }
      /* short customer-facing labels (variant/area) must also be WORD-provenanced: every
         significant word stem must appear in the notes, so the model can't invent scope
         wording like "includes waterproofing upgrade" that no digit check would catch */
      function safeLabel(t, max) {
        var s = safeText(t, 2, max);
        if (!s || /^option\b/i.test(s)) return '';
        var srcStems = M._sigWords(src);
        return M._sigWords(s).every(function (w) { return srcStems.indexOf(w) !== -1; }) ? s : '';
      }
      var srcHasIncluded = /(?:^|\s)(included|free|no charge|no cost|no extra charge)(?=[\s.,;!)]|$)/i.test(src);
      var srcDigits = M.digitsOf(src);

      var warnings = [], groups = {};
      parsed.items.forEach(function (it) {
        if (!it || typeof it !== 'object') return;

        /* desc + catId (book descs are safe by construction; model 'other' text is safety-checked) */
        var cat = it.service_id && byId[it.service_id], desc, catId = null, primary = false;
        if (cat) { desc = cat.desc; catId = cat.id; primary = !!cat.primary; }
        else { desc = safeText(it.desc, 2, 90); if (!desc) return; }
        var area = it.area ? safeLabel(it.area, 40) : '';
        if (area) desc += ' (' + tc(area) + ')';

        var g = (typeof it.option_group === 'number' && it.option_group >= 0) ? Math.floor(it.option_group) : 0;
        /* which price block this line may draw from: the option-group POSITION first
           (group 1 -> block A, group 2 -> B). source_key is only a fallback when the
           positional block doesn't exist (skipped group numbers) — never an override,
           so a group-2 line can't name source_key "A" and drain Option A's typed prices. */
        var block = ledger[g] || ((/^[A-C]$/.test(String(it.source_key)) && byKey[it.source_key]) ? byKey[it.source_key] : head);

        /* amount: included sentinel / qty*unit / literal price, consumed from the ledger */
        var amt = null, priced = false;
        if (it.included === true || it.amount === 'included') {
          /* only honour "included" when the notes actually say included/free/no charge */
          if (srcHasIncluded) amt = 'included';
          else warnings.push('AI marked "' + desc + '" as included but your notes never say included or free, set its price manually');
        } else if (Number.isInteger(it.qty) && it.qty > 0 && it.unit_amount != null && isFinite(Number(it.unit_amount))) {
          /* the qty itself must be a number the tradie typed (and sane), or the model could
             multiply a real $90 unit into a total that appears nowhere in the notes */
          var u = Number(it.unit_amount);
          if (it.qty > 50 || srcDigits.indexOf(String(it.qty)) === -1) {
            warnings.push('AI used a quantity of ' + it.qty + ' for "' + desc + '" that is not in your notes, ignored it');
          } else if (consume(block, u) || (g === 0 && consume(head, u))) {
            amt = Math.round(it.qty * u * 100) / 100; priced = true;
            desc += ' (' + it.qty + ' x $' + u + ')';        // make the maths visible for review
          } else {
            warnings.push('AI read a $' + u + ' unit price for "' + desc + '" that is not in your notes, ignored it');
          }
        } else if (it.amount != null && isFinite(Number(it.amount))) {
          var a = Number(it.amount);
          /* only a SHARED (group 0) line may draw from the head/shared price pool; an option
             line drawing from head would let a fabricated Option B line steal Option A's price */
          if (consume(block, a) || (g === 0 && consume(head, a))) { amt = a; priced = true; }
          else warnings.push('AI read $' + a + ' for "' + desc + '" but that is not a price in this option, ignored it');
        }
        if (amt === null) {
          if (cat && cat.price != null) { amt = cat.price; warnings.push('"' + cat.desc + '": no price in your notes, used the price book default $' + cat.price + ' (review)'); }
          else { amt = 0; warnings.push('"' + desc + '": set the price manually'); }
        }

        (groups[g] = groups[g] || []).push({ desc: desc, amount: amt, catId: catId, primary: primary, _priced: priced, _variant: safeLabel(it.variant_label, 30) });
      });

      /* assemble options: group 0 is shared, prepended to each alternative group.
         A non-zero group with NO ledger-priced line of its own is a spurious "descriptive or"
         split, so if none of the alternatives are really priced we collapse to one option. */
      /* dedupe on desc AND amount: two same-service lines with different typed prices
         (e.g. main bath 1540 + ensuite bath 1300 with no area labels) must BOTH survive */
      function dedupe(ls) {
        var seen = {}, out = [];
        ls.forEach(function (l) {
          var k = l.desc + '|' + String(l.amount);
          if (!seen[k]) { seen[k] = 1; out.push(l); }
        });
        return out;
      }
      var shared = groups[0] || [];
      var nonZero = Object.keys(groups).map(Number).filter(function (g) { return g > 0; }).sort(function (a, b) { return a - b; });
      /* a non-zero group is a REAL alternative if it has its own priced line OR introduces a
         service no other alternative has; otherwise it is a spurious "or" split of the same
         thing (e.g. "epoxy or standard grout") and gets folded into one additive option */
      var realAlts = nonZero.filter(function (g) {
        if (groups[g].some(function (l) { return l._priced; })) return true;
        return groups[g].some(function (l) {
          return l.catId && !nonZero.some(function (h) { return h !== g && groups[h].some(function (x) { return x.catId === l.catId; }); });
        });
      });

      var options = [];
      if (realAlts.length >= 2) {
        realAlts.forEach(function (g) {
          var v = (groups[g].filter(function (l) { return l._variant; })[0] || {})._variant || '';
          options.push({ lines: dedupe(shared.concat(groups[g])), _variant: v });
          /* an alternative built entirely from book defaults (no typed price) may be a
             phantom the model spun out of a passing mention — make the human look at it */
          if (!groups[g].some(function (l) { return l._priced; })) {
            warnings.push('An option was drafted with NO typed price (book defaults only), check it is a real alternative you offered');
          }
        });
      } else {
        var all = shared.slice();
        nonZero.forEach(function (g) { all = all.concat(groups[g]); });
        if (all.length) options.push({ lines: dedupe(all), _variant: '' });
      }
      options = options.filter(function (o) { return o.lines.length; });
      if (options.length > 8) return null;
      var truncated = false;
      if (options.length > 3) { options = options.slice(0, 3); truncated = true; }
      options.forEach(function (o) { if (o.lines.length > 12) { o.lines = o.lines.slice(0, 12); truncated = true; } });
      if (truncated) warnings.push('Too many options or lines, trimmed to fit, review carefully');
      if (!options.length) return null;

      var c = parsed.customer || {};
      /* contact details must literally appear in the notes — a hallucinated email/phone is
         worse than a blank one (the quote could be sent to the wrong person) */
      var email = String(c.email || '').slice(0, 80);
      if (email && src.toLowerCase().indexOf(email.toLowerCase()) === -1) email = '';
      var phone = String(c.phone || '').replace(/[^\d +()-]/g, '').slice(0, 40);
      if (phone && src.replace(/[^\d]/g, '').indexOf(phone.replace(/[^\d]/g, '')) === -1) phone = '';
      var out = {
        customer: {
          name: TQ.rules.sanitize(String(c.name || '')).slice(0, 80),
          address: TQ.rules.sanitize(String(c.address || '')).slice(0, 120),
          access: safeText(c.access, 2, 120),
          phone: phone,
          email: email
        },
        availableFrom: parsed.available_from ? tc(TQ.rules.sanitize(String(parsed.available_from)).slice(0, 40)) : '',
        options: options.map(function (o, i) {
          var multi = options.length > 1;
          return {
            title: multi && o._variant ? tc(o._variant) : (multi ? '' : ''),
            mode: 'itemised', lines: o.lines,
            totalLabel: multi ? 'Option ' + String.fromCharCode(65 + i) + ' total (inc GST)' : 'Total (inc GST)',
            _optLetter: multi ? String.fromCharCode(65 + i) : ''
          };
        }),
        warnings: warnings
      };
      /* prefix "Option A/B:" to the composed titles for multi-option quotes */
      out.options.forEach(function (o) {
        if (o._optLetter && o.title.indexOf('Option') !== 0) o.title = o.title ? 'Option ' + o._optLetter + ': ' + o.title : '';
        delete o._optLetter;
      });
      if (TQ.draft && TQ.draft.compose) TQ.draft.compose(out);   // titles + THE JOB + warranty + expect (deterministic)
      /* ensure multi-option titles carry the Option letter even after compose set them from the book */
      if (out.options.length > 1) {
        out.options.forEach(function (o, i) {
          if (o.title.indexOf('Option') !== 0) o.title = 'Option ' + String.fromCharCode(65 + i) + ': ' + o.title;
        });
      }
      return out;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
