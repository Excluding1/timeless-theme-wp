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
      LINE = hx('#dfe5ee'), RUST = hx('#b0452e'), WHITE = rgb(1, 1, 1);

  function money(x) {
    var s = Math.abs(Number(x)).toFixed(2);
    var p = s.split('.');
    p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (Number(x) < 0 ? '-' : '') + p.join('.');
  }
  function gstOf(total) { return Math.round(total / 11 * 100) / 100; }
  function optionTotal(lines) {
    var t = 0;
    (lines || []).forEach(function (l) { if (typeof l.amount === 'number' && isFinite(l.amount)) t += l.amount; });
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

  /* ---- text wrapping ---- */
  function wrap(text, font, size, maxW) {
    var out = [];
    clean(text).split(/\n/).forEach(function (para) {
      var words = para.split(/\s+/).filter(Boolean);
      if (!words.length) { out.push(''); return; }
      var line = '';
      words.forEach(function (w) {
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

      /* ================= header ================= */
      function drawHeader() {
        var logoW = 62 * MM;
        var logoH = logoW * logoImg.height / logoImg.width;
        var title = isInvoice ? (gstShown ? 'TAX INVOICE' : 'INVOICE') : 'QUOTE';
        var meta = ['No. ' + (doc.docNo || ''), 'Date: ' + (doc.date || '')];
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
        [ 'ABN ' + settings.abn, settings.cityLine, settings.phone, settings.email, settings.website ]
          .filter(Boolean).forEach(function (l) { fy += block(l, LM, colW - 8, top - fy, fonts.helv, 9.5, 14, INK); });
        var ty2 = 0;
        ty2 += block(doc.customer.name || '', LM + colW, colW - 8, top - ty2, fonts.helvB, 9.5, 14, INK);
        [doc.customer.address, doc.customer.access, doc.customer.phone, doc.customer.email]
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
          if (doc.photoCaption) capH = 3 + wrap(doc.photoCaption, fonts.helv, 7.5, 58 * MM).length * 10;
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
          if (doc.photoCaption) block(doc.photoCaption, LM + CW - 58 * MM, 58 * MM, y - photoH - 5, fonts.helv, 7.5, 10, MUTED, 'center');
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

      /* ================= footer block ================= */
      function footerBlock(dry, top) {
        var start = top;
        var wcolW = 92 * MM, ecolW = 82 * MM;
        var lh = line('Warranty & cover', LM, top, fonts.din, 11.5, NAVY, dry) + 5;
        var wh = lh + bullets(doc.warranty, LM, wcolW - 8, top - lh, 9.3, 13, 2.5, dry);
        var eh = 0;
        if (doc.expect && doc.expect.length) {
          var ehh = line('What to expect', LM + wcolW, top, fonts.din, 11.5, NAVY, dry) + 5;
          eh = ehh + bullets(doc.expect, LM + wcolW, ecolW, top - ehh, 9.3, 13, 2.5, dry);
        }
        top -= Math.max(wh, eh) + 8;
        top -= hr(top, 0.8, LINE, dry) + 6;

        /* thank you | book/payment | account */
        var c1 = 52 * MM, c2 = 68 * MM, c3 = 54 * MM;
        var bookHead = isInvoice ? 'Payment' : 'To book';
        var bookBody = isInvoice
          ? ('Payment is due within ' + (settings.invoiceDueDays || 7) + ' days of the invoice date. Please use ' +
             (gstShown ? 'invoice' : 'invoice') + ' ' + (doc.docNo || '') + ' as the payment reference.' + (gstShown ? ' Total includes GST.' : ''))
          : ('A ' + (settings.depositPct || 10) + '% deposit secures your date. Valid ' + (settings.validityDays || 30) +
             ' days' + (gstShown ? '; prices inc GST' : '') + '. Reply to this quote or call ' + settings.phone + ' to go ahead.');
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
        logoImg = await pdf.embedPng(assets.logoBytes);
        photoImg = null;
        if (assets.photoBytes && assets.photoBytes.length) {
          photoImg = assets.photoIsPng ? await pdf.embedPng(assets.photoBytes) : await pdf.embedJpg(assets.photoBytes);
        }
        pdf.setTitle('Timeless Resurfacing ' + (isInvoice ? 'Invoice' : 'Quote'));

        addPage();
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

        var fH = footerBlock(true, y);
        if (y - fH < BM) { addPage(); }
        if (doc.footerBottom !== false) footerBlock(false, BM + fH);
        else footerBlock(false, y);

        return pdf.save();
      })();
    }
  };
});
