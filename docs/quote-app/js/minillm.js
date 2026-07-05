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

    async _complete(system, user) {
      if (M.provider === 'chrome') {
        var s = await (root.LanguageModel || root.ai.languageModel).create({ initialPrompts: [{ role: 'system', content: system }] });
        var out = await s.prompt(user);
        if (s.destroy) s.destroy();
        return out;
      }
      var r = await M._engine.chat.completions.create({
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
        temperature: 0.4, max_tokens: 220
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
        'STRICT RULES: keep every fact; never add services, prices, numbers, dates or claims; ' +
        'never use the words "written", "guarantee", "certificate" or em dashes; ' +
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
       (customer, options, jobIntro, expect, warranty, warnings) or null on failure.
       Hard-validated: services must map to the price book, and every amount MUST
       appear in the source notes, or it is dropped/flagged. The model never sets a
       price the tradesperson did not type. Composition (titles/job/warranty/expect)
       is done by the deterministic composer, not the model. */
    async extract(text) {
      var src = String(text || '').trim();
      if (!src) return null;
      var book = (TQ.getCatalogue ? TQ.getCatalogue() : TQ.CATALOGUE) || [];
      var byId = {}; book.forEach(function (c) { byId[c.id] = c; });
      var menu = book.map(function (c) { return c.id + ' = ' + c.desc.split('(')[0].trim(); }).join('\n');
      var system =
        'You extract a bathroom-resurfacing quote from a tradesperson\'s rough notes. ' +
        'Reply with STRICT JSON only, no prose:\n' +
        '{"customer":{"name":"","address":"","phone":"","email":""},"items":[{"service_id":"","amount":0}]}\n' +
        'Rules: service_id MUST be one of the MENU ids below (or "other" with a short "desc"). ' +
        'amount MUST be a number that literally appears in the notes for that item; if no price is ' +
        'stated for an item, use null. NEVER invent or estimate a price. One item per distinct job.\n\nMENU:\n' + menu;
      var parsed = M._safeJson(await M._complete(system, 'NOTES:\n' + src));
      if (!parsed || !Array.isArray(parsed.items)) return null;

      /* Authoritative price tokens = the amounts the DETERMINISTIC parser recognises as
         prices in these notes. It already excludes postcodes, phone numbers and other
         non-price digits, so binding the model to this set stops it from turning a
         "2037" postcode into a $2037 line. The model's job is picking WHICH service each
         price belongs to; the price magnitudes themselves come from the safe parser. */
      var priceSet = {};
      try { priceSet = TQ.draft.priceTokens(src); } catch (e) { /* fall back to no accepted amounts */ }

      var warnings = [], lines = [];
      parsed.items.forEach(function (it) {
        if (!it || typeof it !== 'object') return;
        var cat = it.service_id && byId[it.service_id];
        var desc = cat ? cat.desc : (it.desc ? TQ.rules.sanitize(String(it.desc)).slice(0, 90) : null);
        if (!desc) return;
        var amt = null;
        if (it.amount != null && isFinite(Number(it.amount))) {
          var a = Number(it.amount);
          if (priceSet[a]) amt = a;                      // must be a price the parser saw in the notes
          else warnings.push('AI read $' + a + ' for "' + desc + '" but that is not a price in your notes, ignored it');
        }
        if (amt == null) {
          if (cat && cat.price != null) { amt = cat.price; warnings.push('"' + cat.desc + '": no price in your notes, used the price book default $' + cat.price + ' (review)'); }
          else { amt = 0; warnings.push('"' + desc + '": set the price manually'); }
        }
        if (!lines.some(function (l) { return l.desc === desc; })) {
          lines.push({ desc: desc, amount: amt, catId: cat ? cat.id : null, primary: !!(cat && cat.primary) });
        }
      });
      if (!lines.length) return null;

      var c = parsed.customer || {};
      var out = {
        customer: {
          name: TQ.rules.sanitize(String(c.name || '')).slice(0, 80),
          address: TQ.rules.sanitize(String(c.address || '')).slice(0, 120),
          access: '',
          phone: String(c.phone || '').replace(/[^\d +()-]/g, '').slice(0, 40),
          email: String(c.email || '').slice(0, 80)
        },
        options: [{ title: 'The work', mode: 'itemised', lines: lines, totalLabel: 'Total (inc GST)' }],
        warnings: warnings
      };
      if (TQ.draft && TQ.draft.compose) TQ.draft.compose(out);   // titles + job + warranty + expect (deterministic)
      return out;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
