/* Timeless Resurfacing — Quote App UI.
   Views: list (saved quotes) / editor (form + live PDF preview) / settings.
   Local mode works instantly; connect Supabase in Settings to save online. */
(function () {
  'use strict';
  var R = TQ.rules;
  var $ = function (sel, el) { return (el || document).querySelector(sel); };
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };

  var S = {
    view: 'list',
    quotes: [],
    doc: null,
    settings: null,
    assets: null,          // {dinBytes, scriptBytes, logoBytes}
    previewTimer: null,
    previewUrl: null,
    banner: ''
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function toast(msg, bad) {
    var t = document.createElement('div');
    t.className = 'toast' + (bad ? ' bad' : '');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('show'); }, 10);
    setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 400); }, 3200);
  }
  function todayStr() {
    return new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  function plusDaysStr(days) {
    var d = new Date(); d.setDate(d.getDate() + Number(days || 0));
    return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  function parseAmount(str) {
    var s = String(str == null ? '' : str).trim();
    if (!s) return 0;
    if (/^(included|include|free|no charge)$/i.test(s)) return 'included';
    var n = parseFloat(s.replace(/[$,\s]/g, ''));
    return isFinite(n) ? n : 0;
  }
  function amountStr(a) { return typeof a === 'number' ? (a ? String(a) : '') : String(a || ''); }
  function dataUrlToBytes(dataUrl) {
    var b64 = dataUrl.split(',')[1];
    var bin = atob(b64), out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  /* ---------------- assets ---------------- */
  async function loadAssets() {
    if (S.assets) return S.assets;
    async function get(url) { var r = await fetch(url); if (!r.ok) throw new Error('Missing asset ' + url); return new Uint8Array(await r.arrayBuffer()); }
    S.assets = {
      dinBytes: await get('fonts/BarlowCondensed-Bold.ttf'),
      scriptBytes: await get('fonts/GreatVibes-Regular.ttf'),
      logoBytes: await get('assets/tr-lockup.png'),
      markBytes: await get('assets/tr-mark.png')
    };
    return S.assets;
  }

  /* ---------------- doc model ---------------- */
  function newDoc() {
    return {
      id: '', docType: 'quote', docNo: '', date: todayStr(), availableFrom: '',
      validUntil: plusDaysStr((S.settings && S.settings.validityDays) || 7),
      dueDate: '', depositPaid: 0, status: 'draft',
      customer: { name: '', address: '', access: '', phone: '', email: '' },
      jobIntro: '', photos: [], photoIndex: -1,
      options: [{ title: '', mode: 'itemised', lines: [{ desc: '', amount: 0 }], totalLabel: '' }],
      optionsNote: '',
      warranty: R.WARRANTY_5YR.slice(),
      expect: R.EXPECT_PRESETS.day.slice(),
      footerBottom: true
    };
  }

  function sanitizeDoc(doc) {
    doc.jobIntro = R.sanitize(doc.jobIntro);
    doc.optionsNote = R.sanitize(doc.optionsNote);
    (doc.options || []).forEach(function (o) {
      o.title = R.sanitize(o.title);
      (o.lines || []).forEach(function (l) { l.desc = R.sanitize(l.desc); });
      o.items = (o.items || []).map(R.sanitize);
    });
    doc.warranty = (doc.warranty || []).map(R.sanitize);
    doc.expect = (doc.expect || []).map(R.sanitize);
    return doc;
  }

  async function generatePdfBytes(doc) {
    var assets = await loadAssets();
    var a = { dinBytes: assets.dinBytes, scriptBytes: assets.scriptBytes, logoBytes: assets.logoBytes, markBytes: assets.markBytes, photoBytes: null, photoIsPng: false };
    var d = JSON.parse(JSON.stringify(doc));
    if (doc.photoIndex >= 0 && doc.photos[doc.photoIndex]) {
      var p = doc.photos[doc.photoIndex];
      a.photoBytes = dataUrlToBytes(p.dataUrl);
      a.photoIsPng = /^data:image\/png/.test(p.dataUrl);
      d.photoCaption = p.caption || '';
    }
    sanitizeDoc(d);
    return TQPDF.generate(d, S.settings, a);
  }

  /* ---------------- views ---------------- */
  function render() {
    var app = $('#app');
    if (S.view === 'list') renderList(app);
    else if (S.view === 'editor') renderEditor(app);
    else renderSettings(app);
  }

  function header(active) {
    var badge;
    if (TQ.db.mode === 'cloud') {
      badge = '<span class="badge cloud" title="Saved to your shared cloud">Synced' + (S.userEmail ? ' · ' + esc(S.userEmail) : '') + '</span>';
    } else if (TQ.db.conn) {
      badge = '<button class="badge signin" data-act="signin" title="Sign in to sync with your team">Sign in to sync</button>';
    } else {
      badge = '<span class="badge local" title="Saved on this device only">On this device</span>';
    }
    return '<header class="top">' +
      '<div class="brand"><img src="assets/tr-mark.png" alt=""><div><strong>Timeless Resurfacing</strong><span>Quotes &amp; invoices</span></div></div>' +
      '<nav>' +
      '<button data-nav="list" class="' + (active === 'list' ? 'on' : '') + '">Quotes</button>' +
      '<button data-nav="new" class="primary">+ New quote</button>' +
      '<button data-nav="settings" class="' + (active === 'settings' ? 'on' : '') + '">Settings</button>' +
      '</nav>' + badge + '</header>' +
      (S.banner ? '<div class="banner">' + esc(S.banner) + '</div>' : '');
  }

  /* inline sign-in popup (no digging in Settings). Resolves true on success. */
  function signInModal() {
    return new Promise(function (resolve) {
      var back = document.createElement('div');
      back.className = 'modalback';
      back.innerHTML =
        '<div class="modal">' +
        '<h3>Sign in</h3>' +
        '<p class="hint">Sign in to sync your quotes with your team across devices.</p>' +
        '<label>Email <input id="siEmail" type="email" autocomplete="username"></label>' +
        '<label class="mt">Password <input id="siPass" type="password" autocomplete="current-password"></label>' +
        '<div id="siErr" class="sierr"></div>' +
        '<div class="actions"><span style="flex:1"></span><button id="siCancel">Cancel</button><button id="siOk" class="primary">Sign in</button></div>' +
        '</div>';
      document.body.appendChild(back);
      var email = back.querySelector('#siEmail'), pass = back.querySelector('#siPass'), err = back.querySelector('#siErr'), ok = back.querySelector('#siOk');
      email.focus();
      function close(v) { back.remove(); resolve(v); }
      back.querySelector('#siCancel').onclick = function () { close(false); };
      back.onclick = function (e) { if (e.target === back) close(false); };
      async function go() {
        if (!email.value.trim() || !pass.value) { err.textContent = 'Enter your email and password.'; return; }
        ok.disabled = true; ok.textContent = 'Signing in…'; err.textContent = '';
        try { await TQ.db.signIn(email.value.trim(), pass.value); close(true); }
        catch (e) { ok.disabled = false; ok.textContent = 'Sign in'; err.textContent = /invalid|credential/i.test(String(e.message || e)) ? 'Wrong email or password.' : String(e.message || e); }
      }
      ok.onclick = go;
      pass.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
    });
  }

  async function doSignIn() {
    var okv = await signInModal();
    if (!okv) return;
    S.userEmail = await TQ.db.userEmail();
    S.settings = await TQ.db.getSettings();
    TQ.userCatalogue = (S.settings.priceBook && S.settings.priceBook.length) ? TQ.mergeBook(S.settings.priceBook) : null;
    await refreshList();
    toast('Signed in' + (S.userEmail ? ' as ' + S.userEmail : '') + ', your quotes are syncing');
    render();
  }

  /* subtle "AI ready" note in the editor so nobody has to hunt in Settings or fear a download */
  function setAiStatus() {
    var el = $('#llmstatus'); if (!el || el.textContent) return;
    if (S.aiSupport === 'chrome' || (S.aiSupport === 'webllm-possible' && S.settings && S.settings.webllmEnabled)) el.innerHTML = '<span class="airdy">✓ AI ready</span>';
    else if (S.aiSupport === 'webllm-possible') el.textContent = 'AI needs a one-time download, turn it on in Settings';
    else el.textContent = '';
  }

  function bindNav(app) {
    $$('[data-nav]', app).forEach(function (b) {
      b.onclick = async function () {
        var n = b.getAttribute('data-nav');
        if (n === 'new') { S.doc = newDoc(); S.view = 'editor'; render(); }
        else if (n === 'list') { S.view = 'list'; await refreshList(); render(); }
        else { S.settings = await TQ.db.getSettings(); S.view = 'settings'; render(); }
      };
    });
    var si = $('[data-act="signin"]', app);
    if (si) si.onclick = doSignIn;
  }

  /* ============ LIST ============ */
  async function refreshList() {
    try { S.quotes = await TQ.db.listQuotes(); }
    catch (e) { toast('Could not load quotes: ' + (e.message || e), true); S.quotes = []; }
  }

  function renderList(app) {
    var rows = S.quotes.map(function (q) {
      return '<tr data-id="' + esc(q.id) + '">' +
        '<td>' + esc(q.docNo || '(draft)') + '</td>' +
        '<td class="cust">' + esc(q.customerName || '') + '</td>' +
        '<td><span class="pill ' + esc(q.docType) + '">' + (q.docType === 'invoice' ? 'Invoice' : 'Quote') + '</span></td>' +
        '<td class="num">$' + R.money(q.total || 0) + '</td>' +
        '<td><select class="status" data-act="status">' +
          ['draft', 'sent', 'accepted', 'invoiced', 'paid', 'declined'].map(function (st) {
            return '<option value="' + st + '"' + (q.status === st ? ' selected' : '') + '>' + st + '</option>';
          }).join('') + '</select></td>' +
        '<td class="muted">' + (q.updatedAt ? new Date(q.updatedAt).toLocaleDateString('en-AU') : '') + '</td>' +
        '<td class="acts">' +
          '<button data-act="edit">Edit</button>' +
          '<button data-act="pdf">PDF</button>' +
          '<button data-act="dup">Copy</button>' +
          (q.docType === 'quote' ? '<button data-act="inv">→ Invoice</button>' : '') +
          '<button data-act="warr" title="Download the signed warranty PDF for this job">Warranty</button>' +
          '<button data-act="del" class="danger">✕</button>' +
        '</td></tr>';
    }).join('');
    app.innerHTML = header('list') +
      '<main><div class="listbar"><input id="search" placeholder="Search customer or number…"></div>' +
      '<div class="tablewrap"><table class="list"><thead><tr>' +
      '<th>No.</th><th>Customer</th><th>Type</th><th>Total</th><th>Status</th><th>Updated</th><th></th>' +
      '</tr></thead><tbody>' + (rows || '<tr><td colspan="7" class="empty">No quotes yet. Hit “+ New quote”, paste the job into Quick Draft, review, download. </td></tr>') +
      '</tbody></table></div></main>';
    bindNav(app);
    $('#search').oninput = function () {
      var q = this.value.toLowerCase();
      $$('tbody tr', app).forEach(function (tr) {
        tr.style.display = tr.textContent.toLowerCase().indexOf(q) !== -1 ? '' : 'none';
      });
    };
    $$('tbody tr [data-act]', app).forEach(function (b) {
      b.onclick = async function () {
        var id = b.closest('tr').getAttribute('data-id');
        var act = b.getAttribute('data-act');
        try {
          if (act === 'edit') { S.doc = await TQ.db.getQuote(id); S.view = 'editor'; render(); }
          else if (act === 'pdf') { var d = await TQ.db.getQuote(id); await downloadPdf(d); }
          else if (act === 'warr') { var dw = await TQ.db.getQuote(id); await downloadWarranty(dw); }
          else if (act === 'dup') {
            var c = await TQ.db.getQuote(id);
            c.id = ''; c.docNo = ''; c.status = 'draft'; c.date = todayStr();
            c.validUntil = plusDaysStr(S.settings.validityDays);
            S.doc = c; S.view = 'editor'; render(); toast('Duplicated, save to keep it');
          }
          else if (act === 'inv') {
            var d2 = await TQ.db.getQuote(id);
            d2.id = ''; d2.quoteRef = d2.docNo; d2.docNo = ''; d2.docType = 'invoice'; d2.status = 'draft';
            d2.date = todayStr(); d2.dueDate = plusDaysStr(S.settings.invoiceDueDays);
            d2.validUntil = '';
            S.doc = d2; S.view = 'editor'; render(); toast('Invoice drafted from the quote, review and save');
          }
          else if (act === 'del') {
            if (!confirm('Delete this document? This cannot be undone.')) return;
            await TQ.db.deleteQuote(id); await refreshList(); render();
          }
        } catch (e) { toast(String(e.message || e), true); }
      };
    });
    $$('tbody select.status', app).forEach(function (sel) {
      sel.onchange = async function () {
        var id = sel.closest('tr').getAttribute('data-id');
        try {
          var d = await TQ.db.getQuote(id);
          d.status = sel.value;
          await TQ.db.saveQuote(d);
          toast('Status: ' + sel.value);
        } catch (e) { toast(String(e.message || e), true); }
      };
    });
  }

  /* ============ EDITOR ============ */
  function optionHtml(o, oi) {
    var lines = (o.lines || []).map(function (l, li) {
      return '<div class="lrow" data-oi="' + oi + '" data-li="' + li + '">' +
        '<input class="ldesc" placeholder="Line item, e.g. New floor tiles laid on top + upskirting" value="' + esc(l.desc) + '">' +
        '<input class="lamt" placeholder="$ or “included”" value="' + esc(amountStr(l.amount)) + '">' +
        '<button class="danger" data-act="delline">✕</button></div>';
    }).join('');
    var tot = R.optionTotal(o.lines);
    var body = o.mode === 'feature'
      ? '<div class="frow"><label>Price shown on the bar <input class="fprice" data-oi="' + oi + '" value="' + esc(o.price || '') + '" placeholder="$1,540"></label></div>' +
        '<label>Bullet points (one per line)</label>' +
        '<textarea class="fitems" data-oi="' + oi + '" rows="4" placeholder="Chips repaired, filled and blended into the surface">' + esc((o.items || []).join('\n')) + '</textarea>'
      : lines +
        '<button class="ghost" data-act="addline" data-oi="' + oi + '">+ line</button>' +
        '<div class="opttotal">Total <strong>$' + R.money(tot) + '</strong>' +
        (S.settings.gstRegistered ? ' <span class="muted">(GST included ' + R.money(R.gstOf(tot)) + ')</span>' : '') + '</div>';
    return '<div class="optcard" data-oi="' + oi + '">' +
      '<div class="opthead">' +
      '<input class="otitle" data-oi="' + oi + '" placeholder="Option title, e.g. Option A: New floor tiles + wall resurfacing" value="' + esc(o.title) + '">' +
      '<select class="omode" data-oi="' + oi + '"><option value="itemised"' + (o.mode !== 'feature' ? ' selected' : '') + '>Itemised (prices per line)</option>' +
      '<option value="feature"' + (o.mode === 'feature' ? ' selected' : '') + '>Feature (one price + bullets)</option></select>' +
      '<button data-act="savetpl" data-oi="' + oi + '" title="Save this option to your library for reuse">☆ Save</button>' +
      '<button class="danger" data-act="delopt" data-oi="' + oi + '">Remove</button></div>' + body + '</div>';
  }

  function renderEditor(app) {
    var d = S.doc;
    var isInv = d.docType === 'invoice';
    var photos = (d.photos || []).map(function (p, pi) {
      /* only ever render image data URLs, escaped: an imported/tampered record must not become markup */
      var safeSrc = /^data:image\//.test(p.dataUrl || '') ? esc(p.dataUrl) : '';
      return '<div class="photo' + (d.photoIndex === pi ? ' sel' : '') + '" data-pi="' + pi + '">' +
        '<img src="' + safeSrc + '" alt="">' +
        '<div class="pmeta"><label class="pick"><input type="radio" name="photopick" ' + (d.photoIndex === pi ? 'checked' : '') + '> on PDF</label>' +
        '<input class="pcap" placeholder="Caption, e.g. Your bath (from your photos)" value="' + esc(p.caption || '') + '">' +
        '<button class="danger" data-act="delphoto">✕</button></div></div>';
    }).join('');

    app.innerHTML = header('editor') +
      '<main class="editor"><div class="form">' +

      '<section class="ai"><h3>Quick Draft <span class="tag">built-in, offline</span></h3>' +
      '<p class="hint">Paste the job in your own words (names, address, prices like “2250 tiling on top”, “option a / option b”…). It fills the form below from the price book. You always review before the PDF exists.</p>' +
      '<textarea id="aitext" rows="4" placeholder="name is Neil Prout address is 29/43 Hereford Street, Glebe, nsw 2037, 2250 for new floor tiles on top and upskirting, 1000 strip out, 700 tipping the old tiles"></textarea>' +
      '<div class="actions"><button id="draftbtn" class="primary">Draft it</button>' +
      '<button id="aidraftbtn" title="Uses the local AI to read messy notes and fill the form. Validated against your price book; it can never set a price you did not type.">✨ AI draft</button>' +
      '<button id="polishbtn" title="Rewrites the job wording and options note with the local AI. Runs entirely in your browser; prices, numbers and warranty are never touched.">✨ Polish wording</button>' +
      '<span id="llmstatus" class="muted" style="font-size:12px"></span></div>' +
      '<div id="aiwarn"></div></section>' +

      '<section><h3>Document</h3><div class="grid4">' +
      '<label>Type <select id="doctype"><option value="quote"' + (!isInv ? ' selected' : '') + '>Quote</option><option value="invoice"' + (isInv ? ' selected' : '') + '>' + (S.settings.gstRegistered ? 'Tax invoice' : 'Invoice') + '</option></select></label>' +
      '<label>Number <input id="docno" value="' + esc(d.docNo) + '" placeholder="auto on save"></label>' +
      '<label>Date <input id="docdate" value="' + esc(d.date) + '"></label>' +
      (isInv
        ? '<label>Due date <input id="duedate" value="' + esc(d.dueDate || plusDaysStr(S.settings.invoiceDueDays)) + '"></label>'
        : '<label>Valid until <input id="validuntil" value="' + esc(d.validUntil || plusDaysStr(S.settings.validityDays)) + '"></label>' +
          '<label>Available from <input id="avail" value="' + esc(d.availableFrom || '') + '" placeholder="optional"></label>') +
      '</div>' +
      (isInv ? '<div class="grid4"><label>Deposit already received ($) <input id="deposit" type="number" min="0" step="0.01" value="' + esc(d.depositPaid || 0) + '"></label>' +
        '<label>Quote ref <input id="quoteref" value="' + esc(d.quoteRef || '') + '" placeholder="e.g. TR-1022"></label></div>' : '') +
      '</section>' +

      '<section><h3>Customer</h3><div class="grid2">' +
      '<label>Name <input id="cname" value="' + esc(d.customer.name) + '"></label>' +
      '<label>Address <input id="caddr" value="' + esc(d.customer.address) + '"></label>' +
      '<label>Access note <input id="caccess" value="' + esc(d.customer.access) + '" placeholder="(first-floor unit) — optional"></label>' +
      '<label>Phone <input id="cphone" value="' + esc(d.customer.phone) + '"></label>' +
      '<label>Email <input id="cemail" value="' + esc(d.customer.email) + '"></label>' +
      '</div></section>' +

      '<section><h3>The job</h3>' +
      '<label>Intro (shown as THE JOB, leave empty to hide the section)</label>' +
      '<textarea id="jobintro" rows="3">' + esc(d.jobIntro) + '</textarea>' +
      '<label class="mt">Photos (pick one for the PDF)</label>' +
      '<input type="file" id="photofile" accept="image/*" multiple>' +
      '<div class="photos">' + photos + '</div></section>' +

      '<section><h3>Options / line items</h3><div id="opts">' +
      (d.options || []).map(optionHtml).join('') +
      '</div><div class="actions"><button class="ghost" id="addopt">+ Add option</button>' +
      ((S.settings.optionTemplates || []).length
        ? '<select id="tpllist">' + (S.settings.optionTemplates || []).map(function (t, ti) {
            return '<option value="' + ti + '">' + esc(t.name) + '</option>';
          }).join('') + '</select><button class="ghost" id="tplinsert">+ From library</button>'
        : '<span class="muted" style="font-size:12px">(“☆ Save” an option to build your library)</span>') +
      '</div>' +
      '<label class="mt">Note under the options</label>' +
      '<textarea id="optnote" rows="2" placeholder="Option B keeps your existing tiles for less; we confirm the scope on site.">' + esc(d.optionsNote) + '</textarea></section>' +

      '<section><h3>Footer</h3><div class="grid2">' +
      '<label>Warranty &amp; cover (one per line)<textarea id="warr" rows="3">' + esc((d.warranty || []).join('\n')) + '</textarea></label>' +
      '<label>What to expect (one per line)<textarea id="expect" rows="3">' + esc((d.expect || []).join('\n')) + '</textarea></label>' +
      '</div>' +
      '<div class="grid4"><label>Expect preset <select id="expreset"><option value="">choose…</option><option value="halfday">Half day</option><option value="day">1 day</option><option value="days23">2 to 3 days</option></select></label>' +
      '<label class="chk"><input type="checkbox" id="footbottom" ' + (d.footerBottom !== false ? 'checked' : '') + '> Pin footer to the page bottom</label>' +
      (!isInv ? '<label class="chk"><input type="checkbox" id="acceptsec" ' + (d.acceptSection ? 'checked' : '') + '> Print an acceptance sign-off block (name / signature / date)</label>' : '') +
      '</div></section>' +

      '<section><h3>Warranty (send after the job is done and paid)</h3>' +
      '<p class="hint">Downloads a signed single-page warranty PDF matching the services on this document, modelled on the operator card with our brand and the Australian Consumer Law text. Clicking below opens a popup to pick who is signing and sign it fresh, then it downloads. Send it WITH the final invoice at completion (the law requires the warranty be given at the time of supply, a website link alone is not enough). Special conditions below are drafted from the job, edit freely.</p>' +
      '<label>Special conditions (one per line)<textarea id="wspecial" rows="3">' + esc((d.warrantySpecial && d.warrantySpecial.length ? d.warrantySpecial : TQ.warranty.composeSpecial(d)).join('\n')) + '</textarea></label>' +
      '<div class="actions"><button id="wdownload">Download warranty PDF</button>' +
      '<button id="wpolish" title="Tidies the special conditions with the local AI. Keeps every instruction and number; never invents anything.">✨ Tidy conditions</button>' +
      (S.settings.signatureDataUrl ? '' : '<span class="muted" style="font-size:12px">(no signature saved yet: Settings → Signature)</span>') +
      '</div></section>' +

      '<div class="actions"><button id="save" class="primary big">Save</button>' +
      '<button id="download" class="big">Download PDF</button>' +
      '<button id="copymsg" title="Copies a ready-to-send email/SMS message for this document">Copy send message</button>' +
      '<button id="back">Back to list</button></div>' +
      '<div id="valwarn"></div>' +

      '</div><div class="preview"><div class="pbar"><strong>PDF preview</strong><button id="refreshpv" class="ghost">Refresh</button><a id="pvnew" target="_blank">Open in tab ↗</a></div>' +
      '<iframe id="pviframe" title="PDF preview"></iframe></div></main>';

    bindNav(app);
    bindEditor(app);
    setAiStatus();
    schedulePreview(200);
  }

  function readOptionInputs() {
    var d = S.doc;
    $$('.optcard').forEach(function (card) {
      var oi = Number(card.getAttribute('data-oi'));
      var o = d.options[oi]; if (!o) return;
      o.title = $('.otitle', card).value;
      o.mode = $('.omode', card).value;
      if (o.mode === 'feature') {
        var fp = $('.fprice', card), fi = $('.fitems', card);
        if (fp) o.price = fp.value;
        if (fi) o.items = fi.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
      } else {
        $$('.lrow', card).forEach(function (row) {
          var li = Number(row.getAttribute('data-li'));
          if (!o.lines[li]) return;
          o.lines[li].desc = $('.ldesc', row).value;
          o.lines[li].amount = parseAmount($('.lamt', row).value);
        });
      }
    });
  }

  function readForm() {
    var d = S.doc;
    d.docType = $('#doctype').value;
    d.docNo = $('#docno').value.trim();
    d.date = $('#docdate').value.trim();
    var av = $('#avail'); if (av) d.availableFrom = av.value.trim();
    var vu = $('#validuntil'); if (vu) d.validUntil = vu.value.trim();
    var du = $('#duedate'); if (du) d.dueDate = du.value.trim();
    var dep = $('#deposit'); if (dep) d.depositPaid = parseFloat(dep.value) || 0;
    var qr = $('#quoteref'); if (qr) d.quoteRef = qr.value.trim();
    d.customer.name = $('#cname').value.trim();
    d.customer.address = $('#caddr').value.trim();
    d.customer.access = $('#caccess').value.trim();
    d.customer.phone = $('#cphone').value.trim();
    d.customer.email = $('#cemail').value.trim();
    d.jobIntro = $('#jobintro').value.trim();
    readOptionInputs();
    d.optionsNote = $('#optnote').value.trim();
    d.warranty = $('#warr').value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    d.expect = $('#expect').value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    d.footerBottom = $('#footbottom').checked;
    var ac = $('#acceptsec'); if (ac) d.acceptSection = ac.checked;
    var ws = $('#wspecial'); if (ws) d.warrantySpecial = ws.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    showValidation();
  }

  function showValidation() {
    var w = R.validate(S.doc, S.settings);
    $('#valwarn').innerHTML = w.length
      ? '<div class="warnbox"><strong>Check before sending:</strong><ul>' + w.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>'
      : '';
  }

  function schedulePreview(delay) {
    clearTimeout(S.previewTimer);
    S.previewTimer = setTimeout(async function () {
      var myGen = S.pvGen = (S.pvGen || 0) + 1;
      try {
        var bytes = await generatePdfBytes(S.doc);
        if (myGen !== S.pvGen) return;   // a newer generation superseded this one mid-flight
        var blob = new Blob([bytes], { type: 'application/pdf' });
        if (S.previewUrl) URL.revokeObjectURL(S.previewUrl);
        S.previewUrl = URL.createObjectURL(blob);
        var f = $('#pviframe'); if (f) f.src = S.previewUrl;
        var a = $('#pvnew'); if (a) a.href = S.previewUrl;
      } catch (e) {
        console.error('preview failed', e);
      }
    }, delay == null ? 900 : delay);
  }

  async function downloadPdf(doc) {
    var bytes = await generatePdfBytes(doc);
    var blob = new Blob([bytes], { type: 'application/pdf' });
    var name = 'Timeless-' + (doc.docType === 'invoice' ? 'Invoice' : 'Quote') +
      (doc.docNo ? '-' + doc.docNo : '') +
      (doc.customer && doc.customer.name ? '-' + doc.customer.name.replace(/[^\w-]+/g, '-') : '') + '.pdf';
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
  }

  /* sign-warranty popup: pick who is signing + sign fresh, every time. Resolves
     { sigDataUrl, signerName } or null if cancelled. */
  function signWarrantyModal(doc) {
    return new Promise(function (resolve) {
      var ops = String(S.settings.operators || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      var back = document.createElement('div');
      back.className = 'modalback';
      back.innerHTML =
        '<div class="modal">' +
        '<h3>Sign the warranty</h3>' +
        '<p class="hint">This warranty' + (doc && doc.docNo ? ' (' + esc(doc.docNo) + ')' : '') +
        (doc && doc.customer && doc.customer.name ? ' for ' + esc(doc.customer.name) : '') +
        ' is signed fresh on issue. Pick who is signing and sign below.</p>' +
        '<label>Signed by</label>' +
        (ops.length ? '<div class="chips">' + ops.map(function (o) { return '<button type="button" class="chip" data-op="' + esc(o) + '">' + esc(o) + '</button>'; }).join('') + '</div>' : '') +
        '<input id="signerName" placeholder="Name of the person signing" value="' + esc(S.settings.lastSigner || '') + '">' +
        '<label class="mt">Signature</label>' +
        '<canvas id="wsig" width="460" height="150"></canvas>' +
        '<div class="actions"><button id="wsigclear" class="ghost">Clear</button>' +
        (S.settings.signatureDataUrl ? '<button id="wsigsaved">Use my saved signature</button>' : '') +
        '<span style="flex:1"></span>' +
        '<button id="wsigcancel">Cancel</button>' +
        '<button id="wsigok" class="primary">Sign &amp; download</button></div>' +
        '</div>';
      document.body.appendChild(back);

      var c = back.querySelector('#wsig'), ctx = c.getContext('2d');
      ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#1c2333';
      var drawing = false, drew = false;
      function pos(e) { var r = c.getBoundingClientRect(); var p = e.touches ? e.touches[0] : e; return [(p.clientX - r.left) * (c.width / r.width), (p.clientY - r.top) * (c.height / r.height)]; }
      c.addEventListener('pointerdown', function (e) { drawing = true; drew = true; var p = pos(e); ctx.beginPath(); ctx.moveTo(p[0], p[1]); e.preventDefault(); });
      c.addEventListener('pointermove', function (e) { if (!drawing) return; var p = pos(e); ctx.lineTo(p[0], p[1]); ctx.stroke(); e.preventDefault(); });
      c.addEventListener('pointerup', function () { drawing = false; });
      c.addEventListener('pointerleave', function () { drawing = false; });

      var nameInput = back.querySelector('#signerName');
      $$('.chip', back).forEach(function (b) { b.onclick = function () { nameInput.value = b.getAttribute('data-op'); }; });
      back.querySelector('#wsigclear').onclick = function () { ctx.clearRect(0, 0, c.width, c.height); drew = false; };
      var savedBtn = back.querySelector('#wsigsaved');
      if (savedBtn) savedBtn.onclick = function () {
        var im = new Image(); im.onload = function () { ctx.clearRect(0, 0, c.width, c.height); ctx.drawImage(im, 0, 0, c.width, c.height); drew = true; }; im.src = S.settings.signatureDataUrl;
      };
      function close(val) { back.remove(); resolve(val); }
      back.querySelector('#wsigcancel').onclick = function () { close(null); };
      back.onclick = function (e) { if (e.target === back) close(null); };
      back.querySelector('#wsigok').onclick = function () {
        if (!drew) { toast('Please sign first', true); return; }
        if (!nameInput.value.trim()) { toast('Enter who is signing', true); return; }
        close({ sigDataUrl: c.toDataURL('image/png'), signerName: nameInput.value.trim() });
      };
    });
  }

  /* shared by the editor button and the list-row Warranty button */
  async function downloadWarranty(doc) {
    if (!S.settings.businessAddress) toast('Tip: add your business/postal address in Settings, the warranty rules require a claims address', true);
    var signed = await signWarrantyModal(doc);
    if (!signed) return;                       // cancelled
    var assets = await loadAssets();
    var model = TQ.warranty.buildModel(doc, S.settings);
    model.aclText = R.ACL_WARRANTY_TEXT;
    model.signerName = signed.signerName;
    var a = {
      dinBytes: assets.dinBytes, scriptBytes: assets.scriptBytes, logoBytes: assets.logoBytes,
      sigBytes: dataUrlToBytes(signed.sigDataUrl)
    };
    var bytes = await TQPDF.generateWarranty(model, S.settings, a);
    var blob = new Blob([bytes], { type: 'application/pdf' });
    var el = document.createElement('a');
    el.href = URL.createObjectURL(blob);
    el.download = 'Timeless-Warranty' + (doc.docNo ? '-' + doc.docNo : '') +
      (doc.customer && doc.customer.name ? '-' + doc.customer.name.replace(/[^\w-]+/g, '-') : '') + '.pdf';
    document.body.appendChild(el); el.click(); el.remove();
    setTimeout(function () { URL.revokeObjectURL(el.href); }, 5000);
    S.settings.lastSigner = signed.signerName;
    try { await TQ.db.saveSettings(S.settings); } catch (e) { /* non-blocking */ }
    toast('Warranty signed by ' + signed.signerName + ' and downloaded');
  }

  function bindEditor(app) {
    /* every text input updates the model + preview (no re-render, keeps focus).
       #app persists across renders, so bind this exactly once. */
    if (!app._tqInputBound) {
      app._tqInputBound = true;
      app.addEventListener('input', function (e) {
        if (S.view === 'editor' && e.target.closest('.form')) { readForm(); schedulePreview(); }
      });
    }

    /* apply a draft result (from the offline parser OR the local LLM extract) to the form */
    function applyDraftResult(out, method) {
      var d = S.doc;
      if (out.customer.name) d.customer.name = out.customer.name;
      if (out.customer.address) d.customer.address = out.customer.address;
      if (out.customer.phone) d.customer.phone = out.customer.phone;
      if (out.customer.email) d.customer.email = out.customer.email;
      if (out.availableFrom) d.availableFrom = out.availableFrom;
      if (out.options && out.options.length) d.options = out.options;
      if (out.jobIntro) d.jobIntro = out.jobIntro;
      if (out.expect && out.expect.length) d.expect = out.expect;
      if (out.warranty && out.warranty.length) d.warranty = out.warranty;
      var aitxt = $('#aitext').value;
      render();
      $('#aitext').value = aitxt;
      $('#aiwarn').innerHTML = (out.warnings && out.warnings.length)
        ? '<div class="warnbox"><strong>' + esc(method) + ', review these:</strong><ul>' + out.warnings.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul></div>'
        : '<div class="okbox">' + esc(method) + ' cleanly, review the form below.</div>';
    }

    $('#draftbtn').onclick = function () {
      applyDraftResult(TQ.draft.parse($('#aitext').value), 'Drafted');
    };

    $('#aidraftbtn').onclick = async function () {
      if (S.aiBusy) return; S.aiBusy = true;
      var text = $('#aitext').value.trim();
      if (!text) { S.aiBusy = false; toast('Paste the job notes first', true); return; }
      var st = $('#llmstatus');
      try {
        st.textContent = 'Starting the local AI…';
        await TQ.minillm.ensure(S.settings.webllmEnabled, function (t) { st.textContent = t; });
        st.textContent = 'Reading your notes… (' + TQ.minillm.detail + ')';
        var out = await TQ.minillm.extract(text);
        if (out) { applyDraftResult(out, 'AI drafted'); toast('AI drafted from your notes, review it'); }
        else { applyDraftResult(TQ.draft.parse(text), 'Drafted (AI unclear, used the offline draft)'); }
      } catch (e) {
        applyDraftResult(TQ.draft.parse(text), 'Drafted (AI unavailable, used the offline draft)');
        toast(String(e.message || e), true);
      } finally { S.aiBusy = false; }
    };

    $('#polishbtn').onclick = async function () {
      if (S.aiBusy) return;
      readForm();
      if (!S.doc.jobIntro && !S.doc.optionsNote) {
        toast('Nothing to polish yet, draft or fill the job first', true); return;
      }
      S.aiBusy = true;
      var st = $('#llmstatus');
      try {
        st.textContent = 'Starting the local AI…';
        await TQ.minillm.ensure(S.settings.webllmEnabled, function (t) { st.textContent = t; });
        st.textContent = 'Polishing… (' + TQ.minillm.detail + ')';
        var res = await TQ.minillm.polishBundle(S.doc);
        var n = 0;
        if (res.jobIntro) { S.doc.jobIntro = res.jobIntro; var ji = $('#jobintro'); if (ji) ji.value = res.jobIntro; n++; }
        if (res.optionsNote) { S.doc.optionsNote = res.optionsNote; var on = $('#optnote'); if (on) on.value = res.optionsNote; n++; }
        if (n) {
          st.textContent = 'Polished ' + n + ' section' + (n > 1 ? 's' : '') + ', review it.';
          schedulePreview(0);
          toast('Wording polished, review it before sending');
        } else {
          st.textContent = 'The AI result broke the house rules, kept your wording.';
        }
      } catch (e) {
        st.textContent = String(e.message || e);
      } finally { S.aiBusy = false; }
    };

    $('#doctype').onchange = function () {
      readForm();
      if (S.doc.docType === 'invoice' && !S.doc.dueDate) S.doc.dueDate = plusDaysStr(S.settings.invoiceDueDays);
      if (S.doc.docType === 'quote') S.doc.validUntil = plusDaysStr(S.settings.validityDays);   // never resurrect a stale date
      render();
    };
    $('#expreset').onchange = function () {
      if (this.value) { S.doc.expect = R.EXPECT_PRESETS[this.value].slice(); $('#expect').value = S.doc.expect.join('\n'); schedulePreview(); }
    };

    $('#addopt').onclick = function () {
      readForm();
      var n = S.doc.options.length;
      var letter = String.fromCharCode(65 + n);
      S.doc.options.push({ title: 'Option ' + letter, mode: 'itemised', lines: [{ desc: '', amount: 0 }], totalLabel: 'Option ' + letter + ' total (inc GST)' });
      render();
    };
    $$('#opts [data-act]', app).forEach(function (b) {
      b.onclick = async function () {
        readForm();
        var oi = Number(b.getAttribute('data-oi') || b.closest('[data-oi]').getAttribute('data-oi'));
        var act = b.getAttribute('data-act');
        if (act === 'addline') S.doc.options[oi].lines.push({ desc: '', amount: 0 });
        else if (act === 'delline') {
          var li = Number(b.closest('.lrow').getAttribute('data-li'));
          S.doc.options[oi].lines.splice(li, 1);
        }
        else if (act === 'delopt') S.doc.options.splice(oi, 1);
        else if (act === 'savetpl') {
          var opt = JSON.parse(JSON.stringify(S.doc.options[oi]));
          var name = (opt.title || '').trim() || 'Untitled option';
          var tpls = (S.settings.optionTemplates || []).filter(function (t) { return t.name !== name; });
          tpls.push({ name: name, option: opt });
          S.settings.optionTemplates = tpls;
          try { await TQ.db.saveSettings(S.settings); toast('Saved "' + name + '" to your option library'); }
          catch (e) { toast(String(e.message || e), true); }
        }
        render();
      };
    });
    var tplBtn = $('#tplinsert');
    if (tplBtn) tplBtn.onclick = function () {
      readForm();
      var t = (S.settings.optionTemplates || [])[Number($('#tpllist').value)];
      if (t) {
        S.doc.options.push(JSON.parse(JSON.stringify(t.option)));
        render();
        toast('Inserted "' + t.name + '" from the library');
      }
    };
    $$('#opts .omode', app).forEach(function (sel) {
      sel.onchange = function () {
        readForm();
        var o = S.doc.options[Number(sel.getAttribute('data-oi'))];
        if (o.mode === 'feature' && !o.items) o.items = [];
        if (o.mode === 'itemised' && (!o.lines || !o.lines.length)) o.lines = [{ desc: '', amount: 0 }];
        render();
      };
    });

    $('#photofile').onchange = function () {
      var files = Array.prototype.slice.call(this.files || []);
      var remaining = files.length;
      if (!remaining) return;
      files.forEach(function (f) {
        var img = new Image();
        var fr = new FileReader();
        fr.onload = function () {
          img.onload = function () {
            var max = 1400;
            var s = Math.min(1, max / Math.max(img.width, img.height));
            var c = document.createElement('canvas');
            c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
            c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
            S.doc.photos.push({ name: f.name, dataUrl: c.toDataURL('image/jpeg', 0.82), caption: 'Your bathroom (from your photos)' });
            if (S.doc.photoIndex < 0) S.doc.photoIndex = S.doc.photos.length - 1;
            if (--remaining === 0) render();
          };
          img.src = fr.result;
        };
        fr.readAsDataURL(f);
      });
    };
    $$('.photos .photo', app).forEach(function (ph) {
      var pi = Number(ph.getAttribute('data-pi'));
      $('.pick input', ph).onchange = function () { readForm(); S.doc.photoIndex = pi; render(); };
      $('.pcap', ph).oninput = function () { S.doc.photos[pi].caption = this.value; schedulePreview(); };
      $('[data-act="delphoto"]', ph).onclick = function () {
        readForm();
        S.doc.photos.splice(pi, 1);
        if (S.doc.photoIndex === pi) S.doc.photoIndex = -1;
        else if (S.doc.photoIndex > pi) S.doc.photoIndex--;
        render();
      };
    });

    $('#wdownload').onclick = async function () {
      readForm();
      try { await downloadWarranty(S.doc); } catch (e) { toast('Warranty PDF failed: ' + (e.message || e), true); }
    };
    $('#wpolish').onclick = async function () {
      if (S.aiBusy) return; S.aiBusy = true;
      readForm();
      var cur = (S.doc.warrantySpecial && S.doc.warrantySpecial.length) ? S.doc.warrantySpecial : TQ.warranty.composeSpecial(S.doc);
      try {
        toast('Starting the local AI…');
        await TQ.minillm.ensure(S.settings.webllmEnabled, function () {});
        var tidied = await TQ.minillm.polishConditions(S.doc, cur);
        S.doc.warrantySpecial = tidied;
        var ws = $('#wspecial'); if (ws) ws.value = tidied.join('\n');
        toast(tidied.join('\n') === cur.join('\n') ? 'Kept your conditions (AI result was not cleaner)' : 'Conditions tidied, review them');
      } catch (e) { toast(String(e.message || e), true); } finally { S.aiBusy = false; }
    };

    $('#refreshpv').onclick = function () { readForm(); schedulePreview(0); };
    $('#save').onclick = async function () {
      readForm();
      sanitizeDoc(S.doc);
      try {
        if (!S.doc.docNo) {
          S.doc.docNo = await TQ.db.nextDocNo();
          S.settings = await TQ.db.getSettings();   // keep the in-memory counter in sync
          $('#docno').value = S.doc.docNo;
        }
        await TQ.db.saveQuote(S.doc);
        toast('Saved ' + (S.doc.docType === 'invoice' ? 'invoice' : 'quote') + ' ' + S.doc.docNo + (TQ.db.mode === 'cloud' ? ' (cloud)' : ' (this browser)'));
      } catch (e) { toast(String(e.message || e), true); }
    };
    $('#download').onclick = async function () {
      readForm();
      try { await downloadPdf(S.doc); } catch (e) { toast('PDF failed: ' + (e.message || e), true); }
    };
    $('#copymsg').onclick = async function () {
      readForm();
      var d = S.doc, s = S.settings;
      var first = (d.customer.name || '').split(' ')[0] || 'there';
      var total = '$' + R.money(R.docTotal(d));
      var msg;
      if (d.docType === 'invoice') {
        var bal = R.docTotal(d) - (Number(d.depositPaid) || 0);
        msg = 'Hi ' + first + ', your invoice ' + d.docNo + ' for ' + total + ' (inc GST) is attached.' +
          (Number(d.depositPaid) > 0 ? ' With your deposit received, the balance due is $' + R.money(bal) + '.' : '') +
          (d.dueDate ? ' Payment is due by ' + d.dueDate + '.' : '') +
          ' Pay to ' + s.bankName + ', BSB ' + s.bsb + ', Acc ' + s.account + ', reference ' + d.docNo + '.' +
          ' Thanks again, ' + s.businessName + ' ' + s.phone;
      } else {
        var opts = (d.options || []).map(function (o) { return o.title; }).filter(Boolean);
        msg = 'Hi ' + first + ', thanks for reaching out. Your quote ' + (d.docNo || '') + ' is attached' +
          (opts.length > 1 ? ' with ' + opts.length + ' options to choose from' : (opts[0] ? ' for the ' + opts[0].toLowerCase() : '')) + '.' +
          (d.validUntil ? ' It is valid until ' + d.validUntil + '.' : '') +
          ' A ' + (s.depositPct || 10) + '% deposit locks in your date. Any questions at all, just call ' + s.phone + '. ' + s.businessName;
      }
      msg = R.sanitize(msg);
      try { await navigator.clipboard.writeText(msg); toast('Send message copied, paste it into your email or SMS'); }
      catch (e) { prompt('Copy this message:', msg); }
    };
    $('#back').onclick = async function () { S.view = 'list'; await refreshList(); render(); };
  }

  /* ============ SETTINGS ============ */
  function effectiveBook() {
    return (S.settings.priceBook && S.settings.priceBook.length) ? S.settings.priceBook : TQ.CATALOGUE;
  }

  function priceRowHtml(e, i) {
    return '<div class="pbrow" data-i="' + i + '" data-id="' + esc(e.id || '') + '">' +
      '<input class="pbdesc" placeholder="Line wording shown on the quote" value="' + esc(e.desc || '') + '">' +
      '<input class="pbprice" placeholder="$ (blank = job-dependent)" value="' + (e.price == null ? '' : esc(e.price)) + '">' +
      '<input class="pbkw" placeholder="keywords, comma separated" value="' + esc((e.keywords || []).join(', ')) + '">' +
      '<label class="chk" title="Main jobs headline the option title"><input type="checkbox" class="pbprim" ' + (e.primary ? 'checked' : '') + '> main</label>' +
      '<button class="danger" data-act="pbdel">✕</button></div>';
  }

  /* read the rows as-is (empty rows kept, so indexes stay aligned for add/delete);
     filter the empties out only when SAVING */
  function readPriceBookInputs() {
    var book = [];
    var byId = {};
    effectiveBook().forEach(function (e) { if (e.id) byId[e.id] = e; });
    $$('.pbrow').forEach(function (row, i) {
      /* identity travels on the row itself (data-id), never derived from position */
      var old = byId[row.getAttribute('data-id')] || {};
      var desc = $('.pbdesc', row).value.trim();
      var pv = $('.pbprice', row).value.replace(/[$,\s]/g, '');
      var id = old.id || 'custom-' + (desc.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30) || 'new');
      var base = id, n = 2;
      while (book.some(function (b) { return b.id === id; })) id = base + '-' + n++;
      /* keep the composer metadata (phrase/process/expectLines/warrantyLines/cure/intro) */
      book.push(Object.assign({}, old, {
        id: id,
        desc: desc,
        price: pv === '' ? null : (parseFloat(pv) || null),
        keywords: $('.pbkw', row).value.split(',').map(function (k) { return k.trim().toLowerCase(); }).filter(Boolean),
        primary: $('.pbprim', row).checked
      }));
    });
    return book;
  }

  function renderSettings(app) {
    var s = S.settings;
    var conn = TQ.db.conn || { url: '', anonKey: '' };
    app.innerHTML = header('settings') +
      '<main class="settings">' +
      '<section><h3>Business details (printed on every PDF)</h3><div class="grid2">' +
      '<label>Business name <input id="s_name" value="' + esc(s.businessName) + '"></label>' +
      '<label>ABN <input id="s_abn" value="' + esc(s.abn) + '"></label>' +
      '<label>NSW licence no <input id="s_lic" value="' + esc(s.licenceNo || '') + '" placeholder="prints under the ABN once you have it"></label>' +
      '<label>Business/postal address <input id="s_baddr" value="' + esc(s.businessAddress || '') + '" placeholder="required on the warranty PDF (claims address)"></label>' +
      '<label>City line <input id="s_city" value="' + esc(s.cityLine) + '"></label>' +
      '<label>Phone <input id="s_phone" value="' + esc(s.phone) + '"></label>' +
      '<label>Email <input id="s_email" value="' + esc(s.email) + '"></label>' +
      '<label>Website <input id="s_web" value="' + esc(s.website) + '"></label>' +
      '<label>Tagline <input id="s_tag" value="' + esc(s.tagline) + '"></label>' +
      '</div></section>' +
      '<section><h3>Money</h3><div class="grid2">' +
      '<label>Account name <input id="s_bank" value="' + esc(s.bankName) + '"></label>' +
      '<label>BSB <input id="s_bsb" value="' + esc(s.bsb) + '"></label>' +
      '<label>Account number <input id="s_acc" value="' + esc(s.account) + '"></label>' +
      '<label>Deposit % <input id="s_dep" type="number" value="' + esc(s.depositPct) + '"></label>' +
      '<label>Quote valid (days) <input id="s_valid" type="number" value="' + esc(s.validityDays) + '"></label>' +
      '<label>Invoice due (days) <input id="s_due" type="number" value="' + esc(s.invoiceDueDays) + '"></label>' +
      '<label>Next document number <input id="s_next" type="number" value="' + esc(s.nextDocNo) + '"></label>' +
      '<label>Number prefix <input id="s_prefix" value="' + esc(s.docPrefix) + '" placeholder="e.g. TR-"></label>' +
      '</div><p class="hint">GST: registered (tax invoices print "TAX INVOICE" with the GST shown). Numbers print as prefix + counter, e.g. TR-1022.</p>' +
      '<button id="savesettings" class="primary">Save settings</button></section>' +

      '<section><h3>Price book (drives Quick Draft + your defaults)</h3>' +
      '<p class="hint">These are the services Quick Draft recognises. Edit the wording and prices to match how you sell; add your own; blank price = job-dependent (you set it per quote). "main" marks a headline job (resurfacing, tiling, regrout) so it titles the option.</p>' +
      '<div class="pbhead"><span>Line wording</span><span>Price inc GST</span><span>Keywords it listens for</span><span></span><span></span></div>' +
      '<div id="pbrows">' + effectiveBook().map(priceRowHtml).join('') + '</div>' +
      '<div class="actions"><button class="ghost" id="pbadd">+ Add service</button>' +
      '<button class="primary" id="pbsave">Save price book</button>' +
      '<button id="pbreset">Reset to built-in defaults</button></div></section>' +

      '<section><h3>Online sync</h3>' +
      (TQ.db.mode === 'cloud'
        ? '<div class="aistat ok">✓ Signed in' + (S.userEmail ? ' as ' + esc(S.userEmail) : '') + '. Your quotes save online and sync with your team.</div>' +
          '<div class="actions"><button id="sb_migrate">Copy this browser’s quotes → cloud</button><button id="sb_signout">Sign out</button></div>'
        : (window.TQ_CONN && window.TQ_CONN.url
            ? '<div class="aistat">Working on this device. Sign in to sync your quotes with your team across devices.</div>' +
              '<div class="actions"><button id="sb_signin_settings" class="primary">Sign in</button></div>'
            : '<p class="hint">Advanced: connect a Supabase project to sync across devices. Paste the Project URL and anon key, then sign in.</p>' +
              '<div class="grid2"><label>Project URL <input id="sb_url" value="' + esc(conn.url) + '"></label><label>Anon (public) key <input id="sb_key" value="' + esc(conn.anonKey) + '"></label><label>Login email <input id="sb_email"></label><label>Password <input id="sb_pass" type="password"></label></div>' +
              '<div class="actions"><button id="sb_connect" class="primary">Connect &amp; sign in</button></div>')) +
      '<div id="sb_status" class="hint"></div></section>' +

      '<section><h3>Mini AI (runs in your browser, nothing leaves this device)</h3>' +
      '<div id="llmprobe" class="aistat">Checking your device…</div>' +
      '<p class="hint">The AI helps draft and polish quotes. Prices, totals, GST, warranty periods and durations always come from your price book and the house rules, never the AI, and its wording is checked before it can replace anything.</p>' +
      '<label class="chk" id="webllm_row" style="display:none"><input type="checkbox" id="s_webllm" ' + (s.webllmEnabled ? 'checked' : '') + '> Allow a one-time ~1GB model download so the AI works on this browser too</label>' +
      '</section>' +

      '<section><h3>Warranty signing</h3>' +
      '<p class="hint">Each warranty is signed fresh in a popup when you download it. Set the people who can sign (comma separated) so they show as quick-pick buttons.</p>' +
      '<label>Who can sign <input id="s_ops" value="' + esc(s.operators || '') + '" placeholder="Allan, Marko"></label>' +
      '<p class="hint mt">Optional: draw a saved signature that the popup can load with one tap (for whoever wants to reuse theirs instead of signing every time).</p>' +
      '<canvas id="sigpad" width="440" height="130"></canvas>' +
      '<div class="actions"><button id="sigclear">Clear</button><button id="sigsave" class="primary">Save signature</button>' +
      (s.signatureDataUrl ? '<span class="okbox" style="margin:0">Saved signature ✓</span>' : '<span class="muted" style="font-size:12px">No saved signature</span>') +
      '</div></section>' +

      '<section><h3>Backup</h3><div class="actions">' +
      '<button id="exp">Export everything (JSON)</button>' +
      '<label class="filebtn">Import JSON<input type="file" id="imp" accept="application/json" hidden></label>' +
      '</div></section></main>';
    bindNav(app);

    $('#savesettings').onclick = async function () {
      s.businessName = $('#s_name').value; s.abn = $('#s_abn').value; s.licenceNo = $('#s_lic').value.trim();
      s.businessAddress = $('#s_baddr').value.trim(); s.cityLine = $('#s_city').value;
      s.phone = $('#s_phone').value; s.email = $('#s_email').value; s.website = $('#s_web').value;
      s.tagline = $('#s_tag').value; s.bankName = $('#s_bank').value; s.bsb = $('#s_bsb').value;
      var opsEl = $('#s_ops'); if (opsEl) s.operators = opsEl.value;
      s.account = $('#s_acc').value; s.depositPct = Number($('#s_dep').value) || 10;
      s.validityDays = Number($('#s_valid').value) || 30; s.invoiceDueDays = Number($('#s_due').value) || 7;
      s.nextDocNo = Number($('#s_next').value) || s.nextDocNo; s.docPrefix = $('#s_prefix').value;
      s.gstRegistered = true;   // settled: the business is GST-registered
      try { await TQ.db.saveSettings(s); toast('Settings saved'); } catch (e) { toast(String(e.message || e), true); }
    };

    /* ---- mini AI ---- */
    $('#s_webllm').onchange = async function () {
      S.settings.webllmEnabled = this.checked;
      try { await TQ.db.saveSettings(S.settings); toast(this.checked ? 'Model download allowed' : 'Model download turned off'); }
      catch (e) { toast(String(e.message || e), true); }
    };
    function paintAiSupport(p) {
      var el = $('#llmprobe'), row = $('#webllm_row'); if (!el) return;
      if (p === 'chrome') { el.className = 'aistat ok'; el.textContent = '✓ Your browser has a built-in AI model. The AI is ready to use, no download needed.'; if (row) row.style.display = 'none'; }
      else if (p === 'webllm-possible') { el.className = 'aistat'; el.textContent = S.settings.webllmEnabled ? '✓ AI ready (will load a local model on first use).' : 'Your browser has no built-in AI, but it can run one locally. Tick the box to allow the one-time download.'; if (row) row.style.display = ''; }
      else { el.className = 'aistat off'; el.textContent = 'This browser can\'t run the on-device AI (everything else works normally). Try Chrome for the built-in model.'; if (row) row.style.display = ''; }
    }
    if (S.aiSupport !== undefined) paintAiSupport(S.aiSupport);
    else TQ.minillm.probe().then(function (p) { S.aiSupport = p; paintAiSupport(p); });

    /* ---- signature pad ---- */
    (function () {
      var c = $('#sigpad'); if (!c) return;
      var ctx = c.getContext('2d');
      ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#1c2333';
      var drawing = false, drew = false;
      if (s.signatureDataUrl) {
        var im = new Image();
        im.onload = function () { ctx.drawImage(im, 0, 0, c.width, c.height); };
        im.src = s.signatureDataUrl;
        drew = true;
      }
      function pos(e) {
        var r = c.getBoundingClientRect();
        var p = e.touches ? e.touches[0] : e;
        return [(p.clientX - r.left) * (c.width / r.width), (p.clientY - r.top) * (c.height / r.height)];
      }
      function down(e) { drawing = true; drew = true; var p = pos(e); ctx.beginPath(); ctx.moveTo(p[0], p[1]); e.preventDefault(); }
      function move(e) { if (!drawing) return; var p = pos(e); ctx.lineTo(p[0], p[1]); ctx.stroke(); e.preventDefault(); }
      function up() { drawing = false; }
      c.addEventListener('pointerdown', down); c.addEventListener('pointermove', move);
      c.addEventListener('pointerup', up); c.addEventListener('pointerleave', up);
      $('#sigclear').onclick = function () { ctx.clearRect(0, 0, c.width, c.height); drew = false; };
      $('#sigsave').onclick = async function () {
        if (!drew) { toast('Draw a signature first', true); return; }
        s.signatureDataUrl = c.toDataURL('image/png');
        try { await TQ.db.saveSettings(s); toast('Signature saved'); render(); }
        catch (e) { toast(String(e.message || e), true); }
      };
    })();

    /* ---- price book ---- */
    $('#pbadd').onclick = function () {
      var book = readPriceBookInputs();
      var id = 'custom-' + (book.length + 1), n = 1;
      while (book.some(function (b) { return b.id === id; })) id = 'custom-' + (book.length + 1) + '-' + n++;
      book.push({ id: id, desc: '', price: null, keywords: [], primary: false });
      S.settings.priceBook = book;
      render();
    };
    $('#pbsave').onclick = async function () {
      var book = readPriceBookInputs().filter(function (e) { return e.desc; });
      S.settings.priceBook = book;
      TQ.userCatalogue = book.length ? TQ.mergeBook(book) : null;
      try { await TQ.db.saveSettings(S.settings); toast('Price book saved (' + book.length + ' services)'); }
      catch (e) { toast(String(e.message || e), true); }
      render();   // realign the rows with the saved book (empty rows are dropped on save)
    };
    $('#pbreset').onclick = async function () {
      if (!confirm('Replace your edited price book with the built-in defaults?')) return;
      S.settings.priceBook = null;
      TQ.userCatalogue = null;
      try { await TQ.db.saveSettings(S.settings); } catch (e) {}
      render();
      toast('Price book reset to defaults');
    };
    $$('#pbrows [data-act="pbdel"]', app).forEach(function (b) {
      b.onclick = function () {
        var book = readPriceBookInputs();
        book.splice(Number(b.closest('.pbrow').getAttribute('data-i')), 1);
        S.settings.priceBook = book;
        render();
      };
    });

    var sbSigninBtn = $('#sb_signin_settings');
    if (sbSigninBtn) sbSigninBtn.onclick = doSignIn;
    var sbConnect = $('#sb_connect');
    if (sbConnect) sbConnect.onclick = async function () {
      try {
        TQ.db.saveConn($('#sb_url').value, $('#sb_key').value);
        await TQ.db.init();
        var em = await TQ.db.signIn($('#sb_email').value.trim(), $('#sb_pass').value);
        S.userEmail = em;
        S.settings = await TQ.db.getSettings();
        TQ.userCatalogue = (S.settings.priceBook && S.settings.priceBook.length) ? TQ.mergeBook(S.settings.priceBook) : null;
        toast('Connected and signed in as ' + em);
        render();
      } catch (e) { var st = $('#sb_status'); if (st) st.textContent = 'Failed: ' + (e.message || e); toast(String(e.message || e), true); }
    };
    var sbMigrate = $('#sb_migrate');
    if (sbMigrate) sbMigrate.onclick = async function () {
      try { var n = await TQ.db.migrateLocalToCloud(); toast('Copied ' + n + ' documents to the cloud'); }
      catch (e) { toast(String(e.message || e), true); }
    };
    var sbSignout = $('#sb_signout');
    if (sbSignout) sbSignout.onclick = async function () {
      await TQ.db.signOut();
      S.userEmail = '';
      S.settings = await TQ.db.getSettings();   // back to the local settings + price book
      TQ.userCatalogue = (S.settings.priceBook && S.settings.priceBook.length) ? TQ.mergeBook(S.settings.priceBook) : null;
      toast('Signed out, back to local mode');
      render();
    };

    $('#exp').onclick = async function () {
      try {
        var data = await TQ.db.exportAll();
        var a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' }));
        a.download = 'timeless-quotes-backup.json'; a.click();
      } catch (e) { toast(String(e.message || e), true); }
    };
    $('#imp').onchange = function () {
      var f = this.files[0]; if (!f) return;
      var fr = new FileReader();
      fr.onload = async function () {
        try { var n = await TQ.db.importAll(JSON.parse(fr.result)); toast('Imported ' + n + ' documents'); }
        catch (e) { toast('Import failed: ' + (e.message || e), true); }
      };
      fr.readAsText(f);
    };
  }

  /* ---------------- boot ---------------- */
  (async function boot() {
    var st = await TQ.db.init();
    if (st.user) S.userEmail = st.user;                    // already-signed-in session
    S.settings = await TQ.db.getSettings();
    TQ.userCatalogue = (S.settings.priceBook && S.settings.priceBook.length) ? TQ.mergeBook(S.settings.priceBook) : null;
    await refreshList();
    render();
    loadAssets().catch(function (e) { toast('Could not load fonts/logo: ' + e.message, true); });
    /* check the on-device AI up front so the app can say "ready" (or "needs a one-time
       download") without the user hunting through Settings */
    TQ.minillm.probe().then(function (p) { S.aiSupport = p; if (S.view === 'editor') setAiStatus(); }).catch(function () { S.aiSupport = null; });
  })();
})();
