/* Timeless Resurfacing — PDF engine.
   A faithful port of docs/templates/quote-generator/quote.py (reportlab) to pdf-lib so the
   same premium template renders in the browser with zero server. Also doubles as the
   TAX INVOICE layout (title + meta + payment wording change; GST lines follow settings).

   UMD: browser -> window.TQPDF (needs window.PDFLib + window.fontkit loaded first);
        node    -> module.exports = factory; call factory(PDFLib, fontkit).

   generate(doc, settings, assets) -> Promise<Uint8Array>
     assets = { dinBytes, scriptBytes, logoBytes, photoBytes?, photoIsPng? }               */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory; }
  else { root.TQPDF = factory(root.PDFLib, root.fontkit); }
})(typeof window !== 'undefined' ? window : globalThis, function (PDFLib, fontkit) {
  'use strict';
  var rgb = PDFLib.rgb, StandardFonts = PDFLib.StandardFonts;

  var MM = 2.834645669;
  var PW = 595.28, PH = 841.89;
  var LM = 18 * MM, RM = 18 * MM, TM = 13 * MM, BM = 11 * MM;
  var CW = PW - LM - RM;

  function hx(h) { return rgb(parseInt(h.substr(1, 2), 16) / 255, parseInt(h.substr(3, 2), 16) / 255, parseInt(h.substr(5, 2), 16) / 255); }
  var NAVY = hx('#1f3a5f'), GOLD = hx('#e7c08b'), MUTED = hx('#5f6b85'), INK = hx('#1c2333'),
      LINE = hx('#dfe5ee'), RUST = hx('#b0452e'), WHITE = rgb(1, 1, 1), SURF = hx('#f4f7fb');

  function money(x) {
    var s = Math.abs(Number(x)).toFixed(2);
    var p = s.split('.');
    p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (Number(x) < 0 ? '-' : '') + p.join('.');
  }
  function gstOf(total) { return Math.round(total / 11 * 100) / 100; }
  /* currency parser (self-contained copy of rules.parseAmount): "1.540" -> 1540, not 1.54 */
  function featPrice(str) {
    var s = String(str == null ? '' : str).replace(/[^0-9.,]/g, '').replace(/,/g, '');
    if (!s) return 0;
    var parts = s.split('.');
    if (parts.length > 2) { var last = parts.pop(); s = parts.join('') + (last.length && last.length <= 2 ? '.' + last : last); }
    else if (parts.length === 2 && parts[1].length === 3 && parts[0].length <= 3) { s = parts[0] + parts[1]; }
    var n = parseFloat(s); return isFinite(n) ? n : 0;
  }
  function optionTotal(lines) {
    var t = 0;
    /* round each line to cents BEFORE summing so the printed lines always add up to the printed total */
    (lines || []).forEach(function (l) { if (typeof l.amount === 'number' && isFinite(l.amount)) t += Math.round(l.amount * 100) / 100; });
    return Math.round(t * 100) / 100;
  }

  /* Standard Helvetica only encodes Latin-1: normalise or drop anything outside it
     so a pasted emoji or exotic character can never crash the PDF. */
  function clean(s) {
    return String(s == null ? '' : s)
      .replace(/…/g, '...').replace(/[‘’ʼ]/g, "'").replace(/[“”]/g, '"')
      .replace(/—/g, ', ').replace(/(\d)\s*–\s*(\d)/g, '$1 to $2').replace(/–/g, ', ')
      .replace(/[^\x0a\x20-\x7e\xa0-\xff]/g, '');
  }

  /* clickable link rectangle (URI annotation) */
  function addLink(pdf, page, x, y, w, h, url) {
    var ref = pdf.context.register(pdf.context.obj({
      Type: 'Annot', Subtype: 'Link', Rect: [x, y, x + w, y + h], Border: [0, 0, 0],
      A: { Type: 'Action', S: 'URI', URI: PDFLib.PDFString.of(url) }
    }));
    var key = PDFLib.PDFName.of('Annots');
    var annots = page.node.lookup(key);
    if (annots) annots.push(ref);
    else page.node.set(key, pdf.context.obj([ref]));
  }
  function siteBase(settings) {
    return 'https://' + String(settings.website || 'timelessresurfacing.com.au').replace(/^https?:\/\//, '').replace(/\/+$/, '');
  }

  /* ---- text wrapping ---- */
  function wrap(text, font, size, maxW) {
    var out = [];
    clean(text).split(/\n/).forEach(function (para) {
      var words = para.split(/\s+/).filter(Boolean);
      if (!words.length) { out.push(''); return; }
      var line = '';
      /* hard-break a single token wider than the column (long email / URL / run-on address)
         so it can't overflow the page margin */
      function breakLong(w) {
        while (font.widthOfTextAtSize(w, size) > maxW && w.length > 1) {
          var i = w.length;
          while (i > 1 && font.widthOfTextAtSize(w.slice(0, i), size) > maxW) i--;
          out.push(w.slice(0, i)); w = w.slice(i);
        }
        return w;
      }
      words.forEach(function (w) {
        if (font.widthOfTextAtSize(w, size) > maxW) { if (line) { out.push(line); line = ''; } w = breakLong(w); }
        var probe = line ? line + ' ' + w : w;
        if (font.widthOfTextAtSize(probe, size) <= maxW || !line) line = probe;
        else { out.push(line); line = w; }
      });
      out.push(line);
    });
    return out;
  }

  return {
    generate: function (doc, settings, assets) {
      var pdf, page, fonts, logoImg, photoImg;
      var y; // cursor: distance of the current block TOP from page bottom

      function addPage() { page = pdf.addPage([PW, PH]); y = PH - TM; }
      function ensure(h) { if (y - h < BM) addPage(); }

      /* draw one line of text; x may be a fn(width)->x for alignment */
      function line(txt, x, top, font, size, color, dry) {
        txt = clean(txt);
        if (!dry) {
          var xx = typeof x === 'function' ? x(font.widthOfTextAtSize(txt, size)) : x;
          page.drawText(txt, { x: xx, y: top - size * 0.88, size: size, font: font, color: color });
        }
        return size;
      }

      /* wrapped block; returns height. align: 'left'|'right'|'center' within [x, x+w] */
      function block(txt, x, w, top, font, size, leading, color, align, dry) {
        var lines = wrap(txt, font, size, w);
        lines.forEach(function (l, i) {
          if (!dry && l) {
            var tw = font.widthOfTextAtSize(l, size);
            var xx = align === 'right' ? x + w - tw : align === 'center' ? x + (w - tw) / 2 : x;
            page.drawText(l, { x: xx, y: top - i * leading - size * 0.88, size: size, font: font, color: color });
          }
        });
        return lines.length * leading;
      }

      /* rust-bullet list with hanging indent (matches reportlab BULLET style) */
      function bullets(items, x, w, top, size, leading, spaceAfter, dry) {
        var h = 0;
        (items || []).forEach(function (it) {
          if (!dry) page.drawText('•', { x: x, y: top - h - size * 0.88, size: size, font: fonts.helv, color: RUST });
          var bh = block(String(it), x + 11, w - 11, top - h, fonts.helv, size, leading, INK, 'left', dry);
          h += bh + spaceAfter;
        });
        return h;
      }

      function hr(top, thickness, color, dry) {
        if (!dry) page.drawLine({ start: { x: LM, y: top - thickness / 2 }, end: { x: LM + CW, y: top - thickness / 2 }, thickness: thickness, color: color });
        return thickness;
      }

      var gstShown = settings.gstRegistered !== false;
      var isInvoice = doc.docType === 'invoice';
      var markImg = null;   // square TR mark for the invoice header (falls back to the lockup)

      /* ================= header ================= */
      function drawHeader() {
        var logoW = 62 * MM;
        var logoH = logoW * logoImg.height / logoImg.width;
        var title = isInvoice ? (gstShown ? 'TAX INVOICE' : 'INVOICE') : 'QUOTE';
        var meta = ['No. ' + (doc.docNo || ''), 'Date: ' + (doc.date || '')];
        if (!isInvoice && doc.validUntil) meta.push('Valid until: ' + doc.validUntil);
        var metaBold = null;
        if (isInvoice && doc.dueDate) metaBold = 'Due: ' + doc.dueDate;
        else if (!isInvoice && doc.availableFrom) metaBold = 'Available from: ' + doc.availableFrom;

        var rightH = 30 + 2 + meta.length * 13 + (metaBold ? 13 : 0);
        var hH = Math.max(logoH, rightH);
        page.drawImage(logoImg, { x: LM, y: y - hH / 2 - logoH / 2, width: logoW, height: logoH });
        var ty = y;
        line(title, function (w) { return LM + CW - w; }, ty, fonts.din, 30, NAVY);
        ty -= 32;
        meta.forEach(function (m) { line(m, function (w) { return LM + CW - w; }, ty, fonts.helv, 9, MUTED); ty -= 13; });
        if (metaBold) line(metaBold, function (w) { return LM + CW - w; }, ty, fonts.helvB, 9, MUTED);
        y -= hH + 6;
        hr(y, 2.5, GOLD); y -= 2.5 + 6;
      }

      /* ================= from / to ================= */
      function drawFromTo() {
        var colW = 87 * MM;
        var h1 = line('FROM', LM, y, fonts.din, 11, NAVY) + 4;
        line('TO', LM + colW, y, fonts.din, 11, NAVY);
        var top = y - h1 - 2;
        var fy = 0;
        fy += block(settings.businessName, LM, colW - 8, top - fy, fonts.helvB, 9.5, 14, INK);
        [ 'ABN ' + settings.abn, settings.licenceNo ? 'Licence ' + settings.licenceNo : '',
          settings.cityLine, settings.phone, settings.email, settings.website ]
          .filter(Boolean).forEach(function (l) { fy += block(l, LM, colW - 8, top - fy, fonts.helv, 9.5, 14, INK); });
        var ty2 = 0;
        ty2 += block(doc.customer.name || '', LM + colW, colW - 8, top - ty2, fonts.helvB, 9.5, 14, INK);
        var attn = clean(doc.customer.attn || '');
        [attn ? 'Attn: ' + attn : '', doc.customer.address, doc.customer.access, doc.customer.phone, doc.customer.email]
          .filter(Boolean).forEach(function (l) { ty2 += block(l, LM + colW, colW - 8, top - ty2, fonts.helv, 9.5, 14, INK); });
        y = top - Math.max(fy, ty2) - 7;
      }

      /* ================= the job (+ photo) ================= */
      function drawJob() {
        if (!doc.jobIntro && !photoImg) return;
        var photoW = 0, photoH = 0, capH = 0;
        var maxW = 38 * MM, maxH = 33 * MM;
        if (photoImg) {
          var s = Math.min(maxW / photoImg.width, maxH / photoImg.height);
          photoW = photoImg.width * s; photoH = photoImg.height * s;
          if (doc.photoCaption) capH = 3 + wrap(doc.photoCaption, fonts.helv, 7.5, photoW).length * 10;
        }
        var textW = photoImg ? 116 * MM : CW;
        var th = 0;
        if (doc.jobIntro) {
          th += line('THE JOB', LM, y, fonts.din, 11, NAVY) + 4;
          th += block(doc.jobIntro, LM, textW, y - th, fonts.helv, 9.5, 14, INK);
        }
        var ph = photoH + capH;
        if (photoImg) {
          var px = LM + CW - photoW;
          page.drawImage(photoImg, { x: px, y: y - photoH, width: photoW, height: photoH });
          if (doc.photoCaption) block(doc.photoCaption, px, photoW, y - photoH - 5, fonts.helv, 7.5, 10, MUTED, 'center');
        }
        y -= Math.max(th, ph) + 8;
      }

      /* ================= option cards ================= */
      var PADX = 11, AMTW = 34 * MM;

      function cardBar(opt, top, cardW, dry) {
        /* navy title bar; feature mode puts the gold price on the right of the bar */
        var priceW = 0, priceLines = [];
        if (opt.mode === 'feature') {
          priceLines = [clean(opt.price || '')];
          priceW = 38 * MM;
        }
        var titleLines = wrap(opt.title, fonts.din, 13.5, cardW - PADX * 2 - priceW);
        var tH = titleLines.length * 15;
        var pH = opt.mode === 'feature' ? 16 + (gstShown ? 8 : 0) : 0;
        var barH = 6 + Math.max(tH, pH) + 6;
        if (!dry) {
          page.drawRectangle({ x: LM, y: top - barH, width: cardW, height: barH, color: NAVY });
          titleLines.forEach(function (l, i) {
            page.drawText(l, { x: LM + PADX, y: top - 6 - i * 15 - 13.5 * 0.88, size: 13.5, font: fonts.din, color: WHITE });
          });
          if (opt.mode === 'feature') {
            var pw = fonts.din.widthOfTextAtSize(priceLines[0], 15.5);
            page.drawText(priceLines[0], { x: LM + cardW - PADX - pw, y: top - 6 - 15.5 * 0.88, size: 15.5, font: fonts.din, color: GOLD });
            if (gstShown) {
              var iw = fonts.helv.widthOfTextAtSize('incl GST', 7);
              page.drawText('incl GST', { x: LM + cardW - PADX - iw, y: top - 6 - 16 - 7 * 0.88, size: 7, font: fonts.helv, color: GOLD });
            }
          }
        }
        return barH;
      }

      function itemisedCard(opt, dry) {
        var top = y;
        var descW = CW - PADX * 2 - AMTW;
        var h = cardBar(opt, top, CW, dry);
        (opt.lines || []).forEach(function (l) {
          var rows = wrap(l.desc, fonts.helv, 9.3, descW);
          var rh = Math.max(rows.length * 12.5, 12.5) + 4;
          if (!dry) {
            rows.forEach(function (r, i) {
              page.drawText(r, { x: LM + PADX, y: top - h - 2 - i * 12.5 - 9.3 * 0.88, size: 9.3, font: fonts.helv, color: INK });
            });
            var amtTxt = typeof l.amount === 'number' ? money(l.amount) : clean(l.amount);
            var aw = fonts.helv.widthOfTextAtSize(amtTxt, 9.3);
            page.drawText(amtTxt, { x: LM + CW - PADX - aw, y: top - h - 2 - 9.3 * 0.88, size: 9.3, font: fonts.helv, color: INK });
          }
          h += rh;
        });
        /* continuation chunks of a split card carry no total rows */
        if (opt._noTotal) {
          h += 4;
          if (!dry) page.drawRectangle({ x: LM, y: top - h, width: CW, height: h, borderColor: NAVY, borderWidth: 1 });
          return h;
        }
        /* total row: a split card totals ALL its lines, shown on the last chunk */
        var tot = optionTotal(opt._allLines || opt.lines);
        h += 5;
        if (!dry) {
          page.drawLine({ start: { x: LM + PADX, y: top - h + 2.5 }, end: { x: LM + CW - PADX, y: top - h + 2.5 }, thickness: 0.6, color: LINE });
          var lbl = clean(opt.totalLabel) || (gstShown ? 'Total (inc GST)' : 'Total');
          var lw = fonts.din.widthOfTextAtSize(lbl, 13);
          page.drawText(lbl, { x: LM + PADX + descW - lw, y: top - h - 13 * 0.88, size: 13, font: fonts.din, color: NAVY });
          var totTxt = '$' + money(tot);
          var tw = fonts.din.widthOfTextAtSize(totTxt, 14);
          page.drawText(totTxt, { x: LM + CW - PADX - tw, y: top - h - 14 * 0.88, size: 14, font: fonts.din, color: NAVY });
        }
        h += 15 + 2;
        if (gstShown) {
          if (!dry) {
            var g = 'GST included', gv = money(gstOf(tot));
            var gw = fonts.helv.widthOfTextAtSize(g, 9.3);
            page.drawText(g, { x: LM + PADX + descW - gw, y: top - h - 9.3 * 0.88, size: 9.3, font: fonts.helv, color: INK });
            var gvw = fonts.helv.widthOfTextAtSize(gv, 9.3);
            page.drawText(gv, { x: LM + CW - PADX - gvw, y: top - h - 9.3 * 0.88, size: 9.3, font: fonts.helv, color: INK });
          }
          h += 13 + 2;
        }
        /* invoice deposit / balance rows */
        if (isInvoice && Number(doc.depositPaid) > 0) {
          var rowsInv = [
            ['Deposit received', '-' + money(Number(doc.depositPaid))],
            ['Balance due', '$' + money(Math.round((tot - Number(doc.depositPaid)) * 100) / 100)]
          ];
          rowsInv.forEach(function (r, i) {
            var f = i === 1 ? fonts.din : fonts.helv, sz = i === 1 ? 13 : 9.3, lh = i === 1 ? 16 : 13;
            if (!dry) {
              var lw2 = f.widthOfTextAtSize(r[0], sz);
              page.drawText(r[0], { x: LM + PADX + descW - lw2, y: top - h - sz * 0.88, size: sz, font: f, color: i === 1 ? NAVY : INK });
              var vw = f.widthOfTextAtSize(r[1], sz);
              page.drawText(r[1], { x: LM + CW - PADX - vw, y: top - h - sz * 0.88, size: sz, font: f, color: i === 1 ? NAVY : INK });
            }
            h += lh;
          });
        }
        h += 4;
        if (!dry) page.drawRectangle({ x: LM, y: top - h, width: CW, height: h, borderColor: NAVY, borderWidth: 1 });
        return h;
      }

      function featureCard(opt, dry) {
        var top = y;
        var h = cardBar(opt, top, CW, dry);
        h += 8;
        h += bullets(opt.items, LM + PADX, CW - PADX * 2, top - h, 9.3, 13, 2.5, dry);
        h += 9 - 2.5;
        if (!dry) page.drawRectangle({ x: LM, y: top - h, width: CW, height: h, borderColor: NAVY, borderWidth: 1 });
        return h;
      }

      function measureCard(opt) {
        return opt.mode === 'feature' ? featureCard(opt, true) : itemisedCard(opt, true);
      }

      /* an option taller than a full page is split into continuation cards so no
         line can ever be drawn (and lost) below the page edge */
      function splitForPage(opt) {
        var maxH = PH - TM - BM - 6;
        if (measureCard(opt) <= maxH) return [opt];
        var isFeat = opt.mode === 'feature';
        var items = (isFeat ? opt.items : opt.lines).slice();
        var chunks = [];
        while (items.length) {
          var take = items.length, probe;
          do {
            probe = Object.assign({}, opt, { _noTotal: true, _allLines: opt.lines });
            if (chunks.length) { probe.title = opt.title + ' (continued)'; if (isFeat) probe.price = ''; }
            if (isFeat) probe.items = items.slice(0, take); else probe.lines = items.slice(0, take);
            take--;
          } while (measureCard(probe) > maxH && take > 0);
          chunks.push(probe);
          items = items.slice(take + 1);
        }
        chunks[chunks.length - 1]._noTotal = isFeat;   // totals print on the last chunk (itemised only)
        return chunks;
      }
      function drawCard(opt) {
        var h = opt.mode === 'feature' ? featureCard(opt, false) : itemisedCard(opt, false);
        y -= h + 5;
      }

      /* ================= TAX INVOICE layout =================
         Distinct from the quote per ATO QC22438 + GSTR 2013/1: "TAX INVOICE" heading,
         seller identity + ABN, issue date, buyer identity, itemised description table,
         and "Total price includes GST of $X" (GST = total / 11). A deposit shows
         BENEATH the full total with the balance due, never instead of it. */
      function drawInvoice() {
        /* header: title left, mark right, seller identity under */
        var invTitle = (gstShown ? 'TAX INVOICE' : 'INVOICE') + (doc.isDeposit ? '  ·  DEPOSIT' : '');
        line(invTitle, LM, y, fonts.din, doc.isDeposit ? 24 : 30, NAVY);
        var mk = markImg || logoImg;
        var mkW = markImg ? 18 * MM : 45 * MM;
        var mkH = mkW * mk.height / mk.width;
        page.drawImage(mk, { x: LM + CW - mkW, y: y - mkH, width: mkW, height: mkH });
        y -= Math.max(34, mkH + 4);
        y -= block(settings.businessName, LM, CW - mkW - 10, y, fonts.helvB, 10.5, 14, INK);
        y -= block('ABN ' + settings.abn + (settings.licenceNo ? '   ·   Licence ' + settings.licenceNo : ''), LM, CW - mkW - 10, y, fonts.helv, 9.5, 13, INK);
        y -= block([settings.phone, settings.email, settings.website].filter(Boolean).join('   ·   '), LM, CW - mkW - 10, y, fonts.helv, 9, 13, MUTED);
        y -= 10;

        /* BILL TO | invoice meta */
        var top = y;
        var lh = line('BILL TO', LM, top, fonts.din, 13, NAVY) + 5;
        var by = lh;
        by += block(doc.customer.name || '', LM, 95 * MM, top - by, fonts.helvB, 10, 14, INK);
        var battn = clean(doc.customer.attn || '');
        [battn ? 'Attn: ' + battn : '', doc.customer.address, doc.customer.phone, doc.customer.email].filter(Boolean).forEach(function (t) {
          by += block(t, LM, 95 * MM, top - by, fonts.helv, 9.5, 14, INK);
        });
        var metaPairs = [['INVOICE #', doc.docNo || ''], ['DATE', doc.date || '']];
        if (doc.dueDate) metaPairs.push(['DUE', doc.dueDate]);
        if (doc.quoteRef) metaPairs.push(['QUOTE REF', doc.quoteRef]);
        var my = 0;
        metaPairs.forEach(function (p) {
          line(p[0], LM + CW - 62 * MM, top - my, fonts.din, 11, NAVY);
          line(p[1], function (w) { return LM + CW - w; }, top - my, fonts.helv, 10, INK);
          my += 15;
        });
        y = top - Math.max(by, my) - 7;
        hr(y, 1.4, GOLD); y -= 1.4 + 9;

        /* items table (header repeats on every continuation page) */
        function tableHead() {
          line('DESCRIPTION', LM, y, fonts.din, 12.5, NAVY);
          line('AMOUNT', function (w) { return LM + CW - w; }, y, fonts.din, 12.5, NAVY);
          y -= 15;
          hr(y, 1, RUST); y -= 1 + 7;
        }
        function tableEnsure(h) { if (y - h < BM) { addPage(); tableHead(); } }
        tableHead();
        var amtW = 34 * MM, descW = CW - amtW - 8;
        var multi = (doc.options || []).length > 1;
        var firstTot = null;
        function drawTotalRow(label, valStr, lblSize) {
          var lw = fonts.din.widthOfTextAtSize(label, lblSize);
          page.drawText(label, { x: LM + descW - lw, y: y - lblSize * 0.88, size: lblSize, font: fonts.din, color: NAVY });
          var vw = fonts.din.widthOfTextAtSize(valStr, lblSize);
          page.drawText(valStr, { x: LM + CW - vw, y: y - lblSize * 0.88, size: lblSize, font: fonts.din, color: NAVY });
        }
        (doc.options || []).forEach(function (o, oi) {
          var oTot = o.mode === 'feature' ? featPrice(o.price) : optionTotal(o.lines);
          var oLines = o.mode === 'feature'
            ? [{ desc: o.title + (o.items && o.items.length ? ': ' + o.items.join('; ') : ''), amount: oTot }]
            : (o.lines || []);
          if (multi && o.mode !== 'feature' && o.title) {
            tableEnsure(18);
            line(o.title, LM, y, fonts.din, 12, NAVY); y -= 16;
          }
          oLines.forEach(function (l) {
            var rows = wrap(l.desc, fonts.helv, 9.5, descW);
            tableEnsure(Math.min(rows.length, 3) * 13 + 5);   // start the row where at least a few lines fit
            var first = true;
            while (rows.length) {
              var avail = Math.max(1, Math.floor((y - BM - 4) / 13));
              var chunk = rows.splice(0, avail);
              chunk.forEach(function (r, i) {
                if (r) page.drawText(r, { x: LM, y: y - i * 13 - 9.5 * 0.88, size: 9.5, font: fonts.helv, color: INK });
              });
              if (first) {
                var at = typeof l.amount === 'number' ? money(l.amount) : clean(l.amount);
                var aw = fonts.helv.widthOfTextAtSize(at, 9.5);
                page.drawText(at, { x: LM + CW - aw, y: y - 9.5 * 0.88, size: 9.5, font: fonts.helv, color: INK });
                first = false;
              }
              y -= chunk.length * 13;
              if (rows.length) { addPage(); tableHead(); } else y -= 5;
            }
          });
          /* MULTI-OPTION: print THIS option's own total right here, so each alternative shows
             what it costs (a single grand total from option A alone would understate/mislead). */
          if (multi) {
            tableEnsure(30);
            y -= 2; hr(y, 0.5, LINE); y -= 0.5 + 7;
            var oLbl = (o.title ? o.title + ' total' : 'Option ' + String.fromCharCode(65 + oi) + ' total') + ' (inc GST)';
            drawTotalRow(oLbl, '$' + money(oTot), 12);
            y -= 15;
            if (gstShown) {
              var og = 'Includes GST of $' + money(gstOf(oTot));
              var ogw = fonts.helv.widthOfTextAtSize(og, 8.8);
              page.drawText(og, { x: LM + CW - ogw, y: y - 8.8 * 0.88, size: 8.8, font: fonts.helv, color: MUTED });
              y -= 13;
            }
            y -= 6;
          }
          if (firstTot === null) firstTot = oTot;
        });

        /* single-option totals block (invoices are single-option by preflight; single-option
           quotes get the headline total + deposit here). Multi-option quotes already showed a
           per-option total above, so we only add a one-line "these are alternatives" note. */
        var tot = firstTot || 0;
        if (multi) {
          tableEnsure(20);
          var note = 'The options above are alternatives — the price shown is per option, choose one.';
          var nw = fonts.helv.widthOfTextAtSize(note, 9);
          page.drawText(note, { x: LM + CW - nw, y: y - 9 * 0.88, size: 9, font: fonts.helv, color: MUTED });
          y -= 6;
        } else {
        tableEnsure(70);
        y -= 2; hr(y, 0.8, LINE); y -= 0.8 + 8;
        drawTotalRow('Total (inc GST)', '$' + money(tot), 14);
        y -= 18;
        if (gstShown) {
          var g = 'Total price includes GST of $' + money(gstOf(tot));   // ATO wording, GST = total / 11
          var gw = fonts.helv.widthOfTextAtSize(g, 9.3);
          page.drawText(g, { x: LM + CW - gw, y: y - 9.3 * 0.88, size: 9.3, font: fonts.helv, color: INK });
          y -= 14;
        }
        if (Number(doc.depositPaid) > 0) {
          var dep = Number(doc.depositPaid);
          var bal = Math.round((tot - dep) * 100) / 100;
          /* never print a negative balance (deposit>total is blocked at download; this guards the
             live preview): show a credit instead */
          var balRow = bal < 0
            ? ['Credit (overpaid)', '$' + money(-bal), fonts.din, 13.5, NAVY, 17]
            : ['Balance due', '$' + money(bal), fonts.din, 13.5, NAVY, 17];
          var rows2 = [['Deposit received', '-' + money(dep), fonts.helv, 9.5, INK, 14], balRow];
          rows2.forEach(function (r) {
            var lw2 = r[2].widthOfTextAtSize(r[0], r[3]);
            page.drawText(r[0], { x: LM + descW - lw2, y: y - r[3] * 0.88, size: r[3], font: r[2], color: r[4] });
            var vw = r[2].widthOfTextAtSize(r[1], r[3]);
            page.drawText(r[1], { x: LM + CW - vw, y: y - r[3] * 0.88, size: r[3], font: r[2], color: r[4] });
            y -= r[5];
          });
        }
        } /* end single-option totals */
        y -= 6;
      }

      /* ================= footer block ================= */
      function footerBlock(dry, top) {
        var start = top;
        var wcolW = 92 * MM, ecolW = 82 * MM;
        var lh = line('Warranty & cover', LM, top, fonts.din, 11.5, NAVY, dry) + 5;
        var wh = lh + bullets(doc.warranty, LM, wcolW - 8, top - lh, 9.3, 13, 2.5, dry);
        var eh = 0;
        if (!isInvoice && doc.expect && doc.expect.length) {
          var ehh = line('What to expect', LM + wcolW, top, fonts.din, 11.5, NAVY, dry) + 5;
          eh = ehh + bullets(doc.expect, LM + wcolW, ecolW, top - ehh, 9.3, 13, 2.5, dry);
        }
        top -= Math.max(wh, eh) + 8;
        top -= hr(top, 0.8, LINE, dry) + 6;

        /* thank you | book/payment | account */
        var c1 = 52 * MM, c2 = 68 * MM, c3 = 54 * MM;
        var bookHead = isInvoice ? 'Payment' : 'To book';
        var bookBody = isInvoice
          ? (doc.isDeposit
             ? ('This ' + (doc.depositPct || 10) + '% deposit confirms your booking. The balance of $' +
                money(Math.round(((doc.jobTotal || 0) - optionTotal(doc.options[0].lines)) * 100) / 100) +
                ' is due within 1 business day of job completion. Please use ' + (doc.docNo || 'the invoice number') + ' as the payment reference.')
             : ((doc.dueDate ? 'Payment is due by ' + doc.dueDate + '.' :
                'Payment is due within 1 business day of job completion.') +
                ' Please use ' + (doc.docNo || 'the invoice number') + ' as the payment reference.'))
          : ('A ' + (settings.depositPct || 10) + '% deposit is required to book your job in. ' +
             (doc.validUntil ? 'Valid until ' + doc.validUntil : 'Valid for ' + (settings.validityDays || 7) + ' days') +
             (gstShown ? '; prices inc GST' : '') + '. Reply to this quote or call ' + settings.phone + ' to go ahead.');
        var payLines = [settings.bankName, 'BSB ' + settings.bsb + '   Acc ' + settings.account];

        var bH = 13 + 2 + wrap(bookBody, fonts.helv, 8.3, c2 - 20).length * 11.5;
        var pH = 13 + 2 + payLines.length * 11.5;
        var rowH = Math.max(34, bH, pH);
        if (!dry) {
          /* script thank-you, vertically centred */
          var sy = top - rowH / 2 + 10;
          page.drawText('Thank you', { x: LM, y: sy - 32 * 0.6, size: 32, font: fonts.script, color: NAVY });
          page.drawLine({ start: { x: LM + c1, y: top }, end: { x: LM + c1, y: top - rowH }, thickness: 1, color: GOLD });
          var bx = LM + c1 + 12;
          line(bookHead, bx, top, fonts.din, 10.5, NAVY);
          block(bookBody, bx, c2 - 20, top - 15, fonts.helv, 8.3, 11.5, INK);
          var px2 = LM + c1 + c2;
          line(isInvoice ? 'Pay to' : 'Deposit & payment', px2, top, fonts.din, 10.5, NAVY);
          payLines.forEach(function (l, i) { block(l, px2, c3, top - 15 - i * 11.5, fonts.helv, 8.3, 11.5, INK); });
        }
        top -= rowH + 6;
        if (settings.tagline) {
          top -= block(settings.tagline, LM, CW, top, fonts.helvO, 8, 12, MUTED, 'center', dry);
        }
        /* clickable links to the site's customer pages (like the big players do) */
        var linksRow = [['Warranty', '/warranty/'], ['Care instructions', '/care-instructions/'], ['Terms', '/terms/']];
        var sep = '   ·   ';
        var rowTxt = linksRow.map(function (l) { return l[0]; }).join(sep);
        var rowW = fonts.helv.widthOfTextAtSize(rowTxt, 8);
        if (!dry) {
          var lx = LM + (CW - rowW) / 2;
          var base = siteBase(settings);
          linksRow.forEach(function (l, i) {
            var wl = fonts.helv.widthOfTextAtSize(l[0], 8);
            page.drawText(l[0], { x: lx, y: top - 8 * 0.88, size: 8, font: fonts.helv, color: NAVY });
            addLink(pdf, page, lx - 1, top - 10, wl + 2, 11, base + l[1]);
            lx += wl;
            if (i < linksRow.length - 1) {
              page.drawText(sep, { x: lx, y: top - 8 * 0.88, size: 8, font: fonts.helv, color: MUTED });
              lx += fonts.helv.widthOfTextAtSize(sep, 8);
            }
          });
        }
        top -= 12;
        return start - top;
      }

      /* ================= main ================= */
      return (async function () {
        pdf = await PDFLib.PDFDocument.create();
        pdf.registerFontkit(fontkit);
        fonts = {
          din: await pdf.embedFont(assets.dinBytes, { subset: true }),
          script: await pdf.embedFont(assets.scriptBytes, { subset: true }),
          helv: await pdf.embedFont(StandardFonts.Helvetica),
          helvB: await pdf.embedFont(StandardFonts.HelveticaBold),
          helvO: await pdf.embedFont(StandardFonts.HelveticaOblique)
        };
        /* embed only the artwork this document type draws (keeps the PDF small) */
        if (isInvoice && assets.markBytes && assets.markBytes.length) {
          markImg = await pdf.embedPng(assets.markBytes);
          logoImg = markImg;                       // fallback slot; the invoice draws the mark
        } else {
          logoImg = await pdf.embedPng(assets.logoBytes);
        }
        photoImg = null;
        if (assets.photoBytes && assets.photoBytes.length) {
          photoImg = assets.photoIsPng ? await pdf.embedPng(assets.photoBytes) : await pdf.embedJpg(assets.photoBytes);
        }
        pdf.setTitle('Timeless Resurfacing ' + (isInvoice ? 'Tax Invoice' : 'Quote'));

        addPage();
        if (isInvoice) {
          drawInvoice();
        } else {
          drawHeader();
          drawFromTo();
          drawJob();

          (doc.options || []).forEach(function (opt) {
            splitForPage(opt).forEach(function (chunk) {
              ensure(measureCard(chunk) + 5);
              drawCard(chunk);
            });
          });
          if (doc.optionsNote) {
            var nh = block(doc.optionsNote, LM, CW, 0, fonts.helv, 8, 12, MUTED, 'left', true);
            ensure(nh + 5);
            block(doc.optionsNote, LM, CW, y, fonts.helv, 8, 12, MUTED, 'left');
            y -= nh + 6;
          }

          /* optional acceptance sign-off: with the licence number this doubles as the
             written acceptance NSW wants on $5k-$20k small jobs */
          if (doc.acceptSection) {
            function acceptance(dry) {
              var top0 = y, h = 0;
              h += line('Acceptance', LM, top0, fonts.din, 11.5, NAVY, dry) + 4;
              h += block('I accept quote ' + (doc.docNo || '') + ' and authorise ' + settings.businessName +
                ' to carry out the work' + ((doc.options || []).length > 1 ? ' for the option selected below' : '') + '.',
                LM, CW, top0 - h, fonts.helv, 9, 13, INK, 'left', dry);
              var multi2 = (doc.options || []).length > 1;
              var labels = multi2 ? ['Option', 'Full name', 'Signature', 'Date'] : ['Full name', 'Signature', 'Date'];
              var fr = multi2 ? [0.14, 0.32, 0.34, 0.20] : [0.36, 0.38, 0.26];
              var gap = 12, usable = CW - gap * (fr.length - 1);
              var yLine = top0 - h - 18;
              if (!dry) {
                var x = LM;
                fr.forEach(function (f, i) {
                  var w = usable * f;
                  page.drawLine({ start: { x: x, y: yLine }, end: { x: x + w, y: yLine }, thickness: 0.7, color: MUTED });
                  page.drawText(labels[i], { x: x, y: yLine - 10, size: 7.5, font: fonts.helv, color: MUTED });
                  x += w + gap;
                });
              }
              h += 18 + 14;
              return h;
            }
            var accH = acceptance(true);
            ensure(accH + 4);
            acceptance(false);
            y -= accH + 4;
          }
        }

        var fH = footerBlock(true, y);
        if (y - fH < BM) { addPage(); }
        if (doc.footerBottom !== false) footerBlock(false, BM + fH);
        else footerBlock(false, y);

        return pdf.save();
      })();
    },

    /* ============ LIMITED WORKMANSHIP WARRANTY (after-job, single page) ============
       Adapted from the Ultra Glaze operator card; ACL "warranty against defects"
       mandatory text + provider/claim details included (s102 ACL + reg 90). */
    generateWarranty: function (w, settings, assets) {
      return (async function () {
        var pdf = await PDFLib.PDFDocument.create();
        pdf.registerFontkit(fontkit);
        var fonts = {
          din: await pdf.embedFont(assets.dinBytes, { subset: true }),
          script: await pdf.embedFont(assets.scriptBytes, { subset: true }),
          helv: await pdf.embedFont(StandardFonts.Helvetica),
          helvB: await pdf.embedFont(StandardFonts.HelveticaBold),
          helvO: await pdf.embedFont(StandardFonts.HelveticaOblique)
        };
        var logoImg = await pdf.embedPng(assets.logoBytes);
        var sigImg = (assets.sigBytes && assets.sigBytes.length) ? await pdf.embedPng(assets.sigBytes) : null;
        pdf.setTitle('Timeless Resurfacing Warranty');
        var page = pdf.addPage([PW, PH]);
        var y = PH - TM;

        function line(txt, x, top, font, size, color) {
          txt = clean(txt);
          var xx = typeof x === 'function' ? x(font.widthOfTextAtSize(txt, size)) : x;
          page.drawText(txt, { x: xx, y: top - size * 0.88, size: size, font: font, color: color });
          return size;
        }
        function block(txt, x, wd, top, font, size, leading, color) {
          var ls = wrap(txt, font, size, wd);
          ls.forEach(function (l, i) {
            if (l) page.drawText(l, { x: x, y: top - i * leading - size * 0.88, size: size, font: font, color: color });
          });
          return ls.length * leading;
        }
        function bullets(items, x, wd, top, size, leading, gap) {
          var h = 0;
          (items || []).forEach(function (it) {
            page.drawText('•', { x: x, y: top - h - size * 0.88, size: size, font: fonts.helv, color: RUST });
            h += block(String(it), x + 8, wd - 8, top - h, fonts.helv, size, leading, INK) + gap;
          });
          return h;
        }

        /* ---- header ---- */
        var logoW = 46 * MM, logoH = logoW * logoImg.height / logoImg.width;
        page.drawImage(logoImg, { x: LM, y: y - logoH, width: logoW, height: logoH });
        line('LIMITED WORKMANSHIP WARRANTY', function (tw) { return LM + CW - tw; }, y - 2, fonts.din, 21, NAVY);
        line('Please read carefully and keep this document', function (tw) { return LM + CW - tw; }, y - 26, fonts.helvO, 8, MUTED);
        y -= Math.max(logoH, 38) + 5;
        page.drawLine({ start: { x: LM, y: y }, end: { x: LM + CW, y: y }, thickness: 2, color: GOLD });
        y -= 10;

        /* ---- issued panel ---- */
        var panelTop = y, px = LM + 10;
        var col2x = LM + CW * 0.56;
        var fields1 = [['ISSUED TO', w.customer, true], ['ADDRESS', w.address, false]];
        var fields2 = [['DATE', w.date, false], ['INVOICE NO', w.invNo, false], ['YOUR OPERATOR', w.operator, false]];
        var fy = 8;
        fields1.forEach(function (f) {
          line(f[0], px, panelTop - fy, fonts.din, 9.5, NAVY);
          fy += 11 + block(f[1] || '', px, col2x - px - 14, panelTop - fy - 11, f[2] ? fonts.helvB : fonts.helv, 9.5, 12, INK) + 3;
        });
        var fy2 = 8;
        fields2.forEach(function (f) {
          line(f[0], col2x, panelTop - fy2, fonts.din, 9.5, NAVY);
          fy2 += 11 + block(f[1] || '', col2x, LM + CW - col2x - 10, panelTop - fy2 - 11, fonts.helv, 9.5, 12, INK) + 3;
        });
        var panelH = Math.max(fy, fy2) + 4;
        page.drawRectangle({ x: LM, y: panelTop - panelH, width: CW, height: panelH, borderColor: NAVY, borderWidth: 1 });
        y = panelTop - panelH - 8;

        /* ---- periods + special conditions, side by side ---- */
        var half = (CW - 12) / 2;
        function bar(title, x, top, wd) {
          page.drawRectangle({ x: x, y: top - 18, width: wd, height: 18, color: NAVY });
          page.drawText(clean(title), { x: x + 8, y: top - 13, size: 10.5, font: fonts.din, color: WHITE });
          return 18;
        }
        var t1 = y, h1 = bar('YOUR WARRANTY PERIODS', LM, t1, half) + 6;
        (w.forWork || []).forEach(function (r) {
          var lh = Math.max(block(r.label, LM + 8, half - 90, t1 - h1, fonts.helv, 8.5, 11, INK), 11);
          line(r.period, function (tw) { return LM + half - 8 - tw; }, t1 - h1, fonts.helvB, 8.5, NAVY);
          h1 += lh + 3;
        });
        var t2 = y, h2 = bar('SPECIAL CONDITIONS', LM + half + 12, t2, half) + 6;
        h2 += bullets(w.special, LM + half + 12 + 8, half - 16, t2 - h2, 7.8, 10, 2);
        var boxH = Math.max(h1, h2) + 4;
        page.drawRectangle({ x: LM, y: y - boxH, width: half, height: boxH, borderColor: NAVY, borderWidth: 1 });
        page.drawRectangle({ x: LM + half + 12, y: y - boxH, width: half, height: boxH, borderColor: NAVY, borderWidth: 1 });
        y -= boxH + 10;

        /* ---- two columns: covers/claim/care | exclusions ---- */
        var colW = (CW - 16) / 2, cx1 = LM, cx2 = LM + colW + 16;
        var COVERS = settings.businessName + ' warrants its workmanship on the services listed above for the periods shown, starting on the completion date. If adhesion or workmanship fails under normal domestic use within the period, for example a resurfaced coating peeling or lifting, or grout or tiling failing because of defective installation, we will repair, re-coat or redo the affected area at our discretion, at no cost to you. Genuine adhesion failure shows as large sheets of coating lifting, usually within the first 3 to 6 months, not as small chips, which are impact damage. We also pass on to you in full any warranty the product manufacturers give us on the materials used on your job. For tiles laid on top of an existing floor, this warranty covers the bond of the new tile layer to the surface we prepared. This warranty is conditional on the invoice above being paid in full and applies to the property address shown.';
        var CLAIM = 'Call ' + settings.phone + ', email ' + settings.email +
          (settings.businessAddress ? ', or write to ' + settings.businessAddress : '') +
          ', with your invoice number and a photo of the issue. We assess it promptly and carry out valid warranty work at no charge: we bear the cost of a valid claim, and if you incur reasonable expenses making one, tell us and we will reimburse them. Repairs of excluded damage can usually be arranged for a reasonable fee, and accidental impact damage can often be spot-repaired without redoing the whole item.';
        var CARE = [
          'Clean with a liquid cream cleaner such as Kleen Up or Ajax Cream Cleanser; never powder or abrasive cleaners.',
          'Wipe the surface dry after use and keep the bathroom ventilated.',
          'No rubber-backed or suction mats on resurfaced surfaces.',
          'Fix dripping taps promptly and never store water in the bath.',
          'Full care guide: ' + String(settings.website || '').replace(/^https?:\/\//, '') + '/care-instructions'
        ];
        var EXCL = [
          'Dulling or damage from powder or abrasive cleaners, bleach or ammonia.',
          'Damage from objects left on the surface, or rubber and suction mats.',
          'Staining from strong dyes, hair dye, bath bombs and similar products.',
          'Chips, scratches and impact damage from dropped objects or mistreatment.',
          'Mould or mildew in poorly ventilated bathrooms.',
          'Damage from dripping taps or standing water (incl. water stored in the bath or left under mats), improper drainage, or an oversize waste flange pooling water around the fitting.',
          'Pre-existing rust, substrate or waterproofing failure beneath the surface.',
          'Plumbing, mixer or shower-screen leaks, and water entering from adjoining areas.',
          'Building or substrate movement, including hairline cracks in grout or tiles caused by movement.',
          'Efflorescence (a natural condition of cement grout, not a defect).',
          'For tiles laid over an existing floor: failure originating in the concealed original tile bed or substrate beneath the new layer.',
          'Defects in tiles or materials supplied by you; we warrant our installation workmanship.',
          'Damage caused by other trades or renovation work after completion.',
          'Use of the surface before it fully cured (24 to 48 hours after the final coat).'
        ];
        var cy1 = 0, cy2 = 0, colTop = y;
        cy1 += line('WHAT THIS WARRANTY COVERS', cx1, colTop, fonts.din, 9.5, NAVY) + 2;
        cy1 += block(COVERS, cx1, colW, colTop - cy1, fonts.helv, 6.9, 8.5, INK) + 5;
        cy1 += line('HOW TO CLAIM', cx1, colTop - cy1, fonts.din, 9.5, NAVY) + 2;
        cy1 += block(CLAIM, cx1, colW, colTop - cy1, fonts.helv, 6.9, 8.5, INK) + 5;
        cy1 += line('CARING FOR YOUR NEW SURFACE', cx1, colTop - cy1, fonts.din, 9.5, NAVY) + 2;
        cy1 += bullets(CARE, cx1, colW, colTop - cy1, 6.9, 8.5, 1.3);
        cy2 += line('WHAT IS NOT COVERED', cx2, colTop, fonts.din, 9.5, NAVY) + 2;
        EXCL.forEach(function (e, i) {
          var n = (i + 1) + '.';
          page.drawText(n, { x: cx2, y: colTop - cy2 - 6.9 * 0.88, size: 6.9, font: fonts.helvB, color: RUST });
          cy2 += block(e, cx2 + 12, colW - 12, colTop - cy2, fonts.helv, 6.9, 8.5, INK) + 1.3;
        });
        y = colTop - Math.max(cy1, cy2) - 7;

        /* ---- ACL mandatory text box ---- */
        var aclTop = y;
        var aclPad = 8;
        var aclHead = 'YOUR RIGHTS UNDER THE AUSTRALIAN CONSUMER LAW';
        var aclBody = (w.aclText || '') + ' ' +
          'This warranty is given by ' + settings.businessName + ' (ABN ' + settings.abn + '), ' +
          (settings.businessAddress || settings.cityLine || 'Sydney, NSW') + ', phone ' + settings.phone + ', email ' + settings.email +
          '. The benefits given to you by this warranty are in addition to other rights and remedies you have under law in relation to the goods and services to which this warranty relates, including the statutory warranties under the NSW Home Building Act 1989. Nothing in this document excludes or limits those rights.';
        var aclH = aclPad + 11 + wrap(aclBody, fonts.helv, 7.1, CW - aclPad * 2).length * 9 + aclPad - 2;
        page.drawRectangle({ x: LM, y: aclTop - aclH, width: CW, height: aclH, color: SURF, borderColor: LINE, borderWidth: 0.8 });
        line(aclHead, LM + aclPad, aclTop - aclPad + 2, fonts.din, 8.8, NAVY);
        block(aclBody, LM + aclPad, CW - aclPad * 2, aclTop - aclPad - 10, fonts.helv, 7.1, 9, INK);
        y = aclTop - aclH - 8;

        /* ---- signature (pinned just above the footer links, never below them) ---- */
        var sigW = 42 * MM;
        var sigH = sigImg ? Math.min(15 * MM, sigW * sigImg.height / sigImg.width) : 24;
        var sigLineY = BM + 30;
        if (sigImg) {
          page.drawImage(sigImg, { x: LM + 4, y: sigLineY + 2, width: sigH * sigImg.width / sigImg.height, height: sigH });
        }
        page.drawLine({ start: { x: LM, y: sigLineY }, end: { x: LM + sigW + 30, y: sigLineY }, thickness: 0.7, color: MUTED });
        line((w.signerName ? 'Signed by ' + w.signerName + ' for ' : 'Signed for ') + settings.businessName + '   ·   ' + w.date, LM, sigLineY - 2, fonts.helv, 7.5, MUTED);
        line('Thank you', function (tw) { return LM + CW - tw - 10; }, sigLineY + 24, fonts.script, 25, NAVY);

        /* ---- footer links ---- */
        var base = siteBase(settings);
        var parts = [['Warranty statement', '/warranty/'], ['Care instructions', '/care-instructions/'], ['Terms', '/terms/']];
        var sep = '   ·   ';
        var totalTxt = parts.map(function (p) { return p[0]; }).join(sep);
        var lx = LM + (CW - fonts.helv.widthOfTextAtSize(totalTxt, 8)) / 2;
        parts.forEach(function (p, i) {
          var wl = fonts.helv.widthOfTextAtSize(p[0], 8);
          page.drawText(p[0], { x: lx, y: BM, size: 8, font: fonts.helv, color: NAVY });
          addLink(pdf, page, lx - 1, BM - 2, wl + 2, 11, base + p[1]);
          lx += wl;
          if (i < parts.length - 1) {
            page.drawText(sep, { x: lx, y: BM, size: 8, font: fonts.helv, color: MUTED });
            lx += fonts.helv.widthOfTextAtSize(sep, 8);
          }
        });

        return pdf.save();
      })();
    }
  };
});
