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

    /* Rewrite the job intro. Returns the polished text, or null if the model's
       output failed validation (then the caller keeps the original). */
    async polish(doc) {
      var lines = [];
      (doc.options || []).forEach(function (o) {
        (o.lines || []).forEach(function (l) { lines.push(l.desc); });
        (o.items || []).forEach(function (it) { lines.push(it); });
      });
      var system =
        'You edit customer-facing copy for an Australian bathroom resurfacing business. ' +
        'Rewrite the JOB DESCRIPTION so it reads warmly and professionally in Australian English. ' +
        'STRICT RULES: keep every fact; never add services, prices, numbers, dates or claims; ' +
        'never use the words "written", "guarantee", "certificate" or em dashes; ' +
        'maximum 3 sentences; reply with the rewritten description only, no preamble.';
      var user = 'JOB DESCRIPTION:\n' + (doc.jobIntro || '(none)') +
        '\n\nTHE WORK (do not add anything beyond this):\n- ' + lines.join('\n- ');

      var out = await M._complete(system, user);
      out = TQ.rules.sanitize(String(out || '').trim().replace(/^["'“]+|["'”]+$/g, ''));

      /* validation: reject anything that breaks the house rules or invents numbers */
      if (!out || out.length < 20 || out.length > 700) return null;
      if (TQ.rules.bannedIn(out)) return null;
      var srcDigits = ((doc.jobIntro || '') + ' ' + lines.join(' ')).match(/\d+/g) || [];
      var newDigits = out.match(/\d+/g) || [];
      var ok = newDigits.every(function (d) { return srcDigits.indexOf(d) !== -1; });
      if (!ok) return null;
      return out;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
