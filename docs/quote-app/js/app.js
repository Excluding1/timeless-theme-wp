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
      logoBytes: await get('assets/tr-lockup.png')
    };
    return S.assets;
  }

  /* ---------------- doc model ---------------- */
  function newDoc() {
    return {
      id: '', docType: 'quote', docNo: '', date: todayStr(), availableFrom: '',
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
    var a = { dinBytes: assets.dinBytes, scriptBytes: assets.scriptBytes, logoBytes: assets.logoBytes, photoBytes: null, photoIsPng: false };
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
    var modeBadge = TQ.db.mode === 'cloud'
      ? '<span class="badge cloud">online · saved to cloud</span>'
      : '<span class="badge local">local only · this browser</span>';
    return '<header class="top">' +
      '<div class="brand"><img src="assets/tr-mark.png" alt=""><div><strong>Timeless Resurfacing</strong><span>Quotes &amp; invoices</span></div></div>' +
      '<nav>' +
      '<button data-nav="list" class="' + (active === 'list' ? 'on' : '') + '">Quotes</button>' +
      '<button data-nav="new" class="primary">+ New quote</button>' +
      '<button data-nav="settings" class="' + (active === 'settings' ? 'on' : '') + '">Settings</button>' +
      '</nav>' + modeBadge + '</header>' +
      (S.banner ? '<div class="banner">' + esc(S.banner) + '</div>' : '');
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
          else if (act === 'dup') {
            var c = await TQ.db.getQuote(id);
            c.id = ''; c.docNo = ''; c.status = 'draft'; c.date = todayStr();
            S.doc = c; S.view = 'editor'; render(); toast('Duplicated, save to keep it');
          }
          else if (act === 'inv') {
            var d2 = await TQ.db.getQuote(id);
            d2.id = ''; d2.docNo = ''; d2.docType = 'invoice'; d2.status = 'draft';
            d2.date = todayStr(); d2.dueDate = plusDaysStr(S.settings.invoiceDueDays);
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
      '<button id="draftbtn" class="primary">Draft it</button><div id="aiwarn"></div></section>' +

      '<section><h3>Document</h3><div class="grid4">' +
      '<label>Type <select id="doctype"><option value="quote"' + (!isInv ? ' selected' : '') + '>Quote</option><option value="invoice"' + (isInv ? ' selected' : '') + '>' + (S.settings.gstRegistered ? 'Tax invoice' : 'Invoice') + '</option></select></label>' +
      '<label>Number <input id="docno" value="' + esc(d.docNo) + '" placeholder="auto on save"></label>' +
      '<label>Date <input id="docdate" value="' + esc(d.date) + '"></label>' +
      (isInv
        ? '<label>Due date <input id="duedate" value="' + esc(d.dueDate || plusDaysStr(S.settings.invoiceDueDays)) + '"></label>'
        : '<label>Available from <input id="avail" value="' + esc(d.availableFrom || '') + '" placeholder="optional"></label>') +
      '</div>' +
      (isInv ? '<div class="grid4"><label>Deposit already received ($) <input id="deposit" type="number" min="0" step="0.01" value="' + esc(d.depositPaid || 0) + '"></label></div>' : '') +
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
      '</div><button class="ghost" id="addopt">+ Add option</button>' +
      '<label class="mt">Note under the options</label>' +
      '<textarea id="optnote" rows="2" placeholder="Option B keeps your existing tiles for less; we confirm the scope on site.">' + esc(d.optionsNote) + '</textarea></section>' +

      '<section><h3>Footer</h3><div class="grid2">' +
      '<label>Warranty &amp; cover (one per line)<textarea id="warr" rows="3">' + esc((d.warranty || []).join('\n')) + '</textarea></label>' +
      '<label>What to expect (one per line)<textarea id="expect" rows="3">' + esc((d.expect || []).join('\n')) + '</textarea></label>' +
      '</div>' +
      '<div class="grid4"><label>Expect preset <select id="expreset"><option value="">choose…</option><option value="halfday">Half day</option><option value="day">1 day</option><option value="days23">2 to 3 days</option></select></label>' +
      '<label class="chk"><input type="checkbox" id="footbottom" ' + (d.footerBottom !== false ? 'checked' : '') + '> Pin footer to the page bottom</label></div></section>' +

      '<div class="actions"><button id="save" class="primary big">Save</button>' +
      '<button id="download" class="big">Download PDF</button>' +
      '<button id="back">Back to list</button></div>' +
      '<div id="valwarn"></div>' +

      '</div><div class="preview"><div class="pbar"><strong>PDF preview</strong><button id="refreshpv" class="ghost">Refresh</button><a id="pvnew" target="_blank">Open in tab ↗</a></div>' +
      '<iframe id="pviframe" title="PDF preview"></iframe></div></main>';

    bindNav(app);
    bindEditor(app);
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
    var du = $('#duedate'); if (du) d.dueDate = du.value.trim();
    var dep = $('#deposit'); if (dep) d.depositPaid = parseFloat(dep.value) || 0;
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

  function bindEditor(app) {
    /* every text input updates the model + preview (no re-render, keeps focus).
       #app persists across renders, so bind this exactly once. */
    if (!app._tqInputBound) {
      app._tqInputBound = true;
      app.addEventListener('input', function (e) {
        if (S.view === 'editor' && e.target.closest('.form')) { readForm(); schedulePreview(); }
      });
    }

    $('#draftbtn').onclick = function () {
      var out = TQ.draft.parse($('#aitext').value);
      var d = S.doc;
      if (out.customer.name) d.customer.name = out.customer.name;
      if (out.customer.address) d.customer.address = out.customer.address;
      if (out.customer.phone) d.customer.phone = out.customer.phone;
      if (out.customer.email) d.customer.email = out.customer.email;
      if (out.availableFrom) d.availableFrom = out.availableFrom;
      if (out.options.length) d.options = out.options;
      if (out.jobIntro && !d.jobIntro) d.jobIntro = out.jobIntro;
      var aitxt = $('#aitext').value;
      render();
      $('#aitext').value = aitxt;
      $('#aiwarn').innerHTML = out.warnings.length
        ? '<div class="warnbox"><strong>Drafted, review these:</strong><ul>' + out.warnings.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul></div>'
        : '<div class="okbox">Drafted cleanly, review the form below.</div>';
    };

    $('#doctype').onchange = function () { readForm(); if (S.doc.docType === 'invoice' && !S.doc.dueDate) S.doc.dueDate = plusDaysStr(S.settings.invoiceDueDays); render(); };
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
      b.onclick = function () {
        readForm();
        var oi = Number(b.getAttribute('data-oi') || b.closest('[data-oi]').getAttribute('data-oi'));
        var act = b.getAttribute('data-act');
        if (act === 'addline') S.doc.options[oi].lines.push({ desc: '', amount: 0 });
        else if (act === 'delline') {
          var li = Number(b.closest('.lrow').getAttribute('data-li'));
          S.doc.options[oi].lines.splice(li, 1);
        }
        else if (act === 'delopt') S.doc.options.splice(oi, 1);
        render();
      };
    });
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
    $('#back').onclick = async function () { S.view = 'list'; await refreshList(); render(); };
  }

  /* ============ SETTINGS ============ */
  function renderSettings(app) {
    var s = S.settings;
    var conn = TQ.db.conn || { url: '', anonKey: '' };
    app.innerHTML = header('settings') +
      '<main class="settings">' +
      '<section><h3>Business details (printed on every PDF)</h3><div class="grid2">' +
      '<label>Business name <input id="s_name" value="' + esc(s.businessName) + '"></label>' +
      '<label>ABN <input id="s_abn" value="' + esc(s.abn) + '"></label>' +
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
      '<label>Number prefix <input id="s_prefix" value="' + esc(s.docPrefix) + '" placeholder="optional, e.g. TR-"></label>' +
      '<label class="chk"><input type="checkbox" id="s_gst" ' + (s.gstRegistered ? 'checked' : '') + '> Registered for GST (prints TAX INVOICE + GST lines)</label>' +
      '</div><button id="savesettings" class="primary">Save settings</button></section>' +

      '<section><h3>Online saving (Supabase)</h3>' +
      '<p class="hint">Free tier is fine. Create a project at supabase.com, run <code>supabase-schema.sql</code> (in this folder) in the SQL editor, create a user under Authentication, then connect here. Until then everything saves to this browser only.</p>' +
      '<div class="grid2">' +
      '<label>Project URL <input id="sb_url" value="' + esc(conn.url) + '" placeholder="https://xxxx.supabase.co"></label>' +
      '<label>Anon (public) key <input id="sb_key" value="' + esc(conn.anonKey) + '" placeholder="eyJ…"></label>' +
      '<label>Login email <input id="sb_email" placeholder="you@…"></label>' +
      '<label>Password <input id="sb_pass" type="password"></label>' +
      '</div>' +
      '<div class="actions">' +
      '<button id="sb_connect" class="primary">Connect &amp; sign in</button>' +
      '<button id="sb_migrate">Copy this browser’s quotes → cloud</button>' +
      '<button id="sb_signout">Sign out</button>' +
      '</div><div id="sb_status" class="hint">' + (TQ.db.mode === 'cloud' ? 'Connected and signed in.' : 'Not connected: local mode.') + '</div></section>' +

      '<section><h3>Backup</h3><div class="actions">' +
      '<button id="exp">Export everything (JSON)</button>' +
      '<label class="filebtn">Import JSON<input type="file" id="imp" accept="application/json" hidden></label>' +
      '</div></section></main>';
    bindNav(app);

    $('#savesettings').onclick = async function () {
      s.businessName = $('#s_name').value; s.abn = $('#s_abn').value; s.cityLine = $('#s_city').value;
      s.phone = $('#s_phone').value; s.email = $('#s_email').value; s.website = $('#s_web').value;
      s.tagline = $('#s_tag').value; s.bankName = $('#s_bank').value; s.bsb = $('#s_bsb').value;
      s.account = $('#s_acc').value; s.depositPct = Number($('#s_dep').value) || 10;
      s.validityDays = Number($('#s_valid').value) || 30; s.invoiceDueDays = Number($('#s_due').value) || 7;
      s.nextDocNo = Number($('#s_next').value) || s.nextDocNo; s.docPrefix = $('#s_prefix').value;
      s.gstRegistered = $('#s_gst').checked;
      try { await TQ.db.saveSettings(s); toast('Settings saved'); } catch (e) { toast(String(e.message || e), true); }
    };

    $('#sb_connect').onclick = async function () {
      try {
        TQ.db.saveConn($('#sb_url').value, $('#sb_key').value);
        await TQ.db.init();
        var em = await TQ.db.signIn($('#sb_email').value.trim(), $('#sb_pass').value);
        $('#sb_status').textContent = 'Connected as ' + em + '. Everything now saves online.';
        S.settings = await TQ.db.getSettings();
        toast('Connected to Supabase');
        render();
      } catch (e) { $('#sb_status').textContent = 'Failed: ' + (e.message || e); toast(String(e.message || e), true); }
    };
    $('#sb_migrate').onclick = async function () {
      try { var n = await TQ.db.migrateLocalToCloud(); toast('Copied ' + n + ' documents to the cloud'); }
      catch (e) { toast(String(e.message || e), true); }
    };
    $('#sb_signout').onclick = async function () { await TQ.db.signOut(); toast('Signed out, back to local mode'); render(); };

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
    if (st.needsSignIn) S.banner = 'Supabase is configured but you are signed out: open Settings to sign back in (working locally until then).';
    S.settings = await TQ.db.getSettings();
    await refreshList();
    render();
    loadAssets().catch(function (e) { toast('Could not load fonts/logo: ' + e.message, true); });
  })();
})();
