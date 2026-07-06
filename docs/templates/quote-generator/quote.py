#!/usr/bin/env python3
"""
Timeless Resurfacing — reusable customer QUOTE PDF generator.

Run:  python3 quote.py <config_name>   (e.g. python3 quote.py TILEQ) ; no arg builds all.

Option display modes (per option dict):
  - ITEMISED (bordered navy-titled card): {"title", "lines":[(desc, amount_ex_gst), ...], "total_label"}
      -> renders line items + Subtotal (ex GST) + GST 10% + Total (inc GST).
  - FEATURE (bordered navy-titled card):  {"title", "price":"$X", "items":[str, ...]}
      -> single inc-GST price on the bar + a bullet feature list.

House rules (keep): no em-dashes in copy; no banned words (written/guarantee/certificate/in writing);
warranty "up to 5 years" + ACL line. Brand: DIN Condensed headers, Snell script "Thank you", navy #1f3a5f.
"""
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, HRFlowable
from reportlab.lib.enums import TA_RIGHT, TA_CENTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

LOGO = "/Users/excluding/Downloads/timeless-theme-wp/assets/brand/logo/tr-lockup.png"

def _reg(name, path, idx=None):
    try:
        pdfmetrics.registerFont(TTFont(name, path, subfontIndex=idx) if idx is not None else TTFont(name, path)); return name
    except Exception:
        return None
DIN = _reg("DINCond", "/System/Library/Fonts/Supplemental/DIN Condensed Bold.ttf") or "Helvetica-Bold"
SNELL = _reg("Snell", "/System/Library/Fonts/Supplemental/SnellRoundhand.ttc", 0) or "Times-BoldItalic"

NAVY = colors.HexColor("#1f3a5f"); GOLD = colors.HexColor("#e7c08b")
MUTED = colors.HexColor("#5f6b85"); INK = colors.HexColor("#1c2333")
SURF = colors.HexColor("#f4f7fb"); LINE = colors.HexColor("#dfe5ee"); WHITE = colors.white

_ss = getSampleStyleSheet()
def _st(name, **kw):
    return ParagraphStyle(name, parent=_ss["Normal"], **kw)
QTITLE = _st("QTITLE", fontName=DIN, fontSize=30, textColor=NAVY, leading=30, alignment=TA_RIGHT)
META = _st("META", fontName="Helvetica", fontSize=9, textColor=MUTED, leading=13, alignment=TA_RIGHT)
SECT = _st("SECT", fontName=DIN, fontSize=11, textColor=NAVY, leading=13, spaceAfter=2)
BODY = _st("BODY", fontName="Helvetica", fontSize=9.5, textColor=INK, leading=14)
SMALL = _st("SMALL", fontName="Helvetica", fontSize=8, textColor=MUTED, leading=12)
FBODY = _st("FBODY", fontName="Helvetica", fontSize=8.3, textColor=INK, leading=11.5)
SMALLC = _st("SMALLC", fontName="Helvetica-Oblique", fontSize=8, textColor=MUTED, leading=13, alignment=TA_CENTER)
CAP = _st("CAP", fontName="Helvetica", fontSize=7.5, textColor=MUTED, leading=10, alignment=TA_CENTER, spaceBefore=3)
HEAD = _st("HEAD", fontName=DIN, fontSize=11.5, textColor=NAVY, leading=13, spaceAfter=3)
FOOTH = _st("FOOTH", fontName=DIN, fontSize=10.5, textColor=NAVY, leading=13)
OPTT_W = _st("OPTT_W", fontName=DIN, fontSize=13.5, textColor=WHITE, leading=15)
PRICE_W = _st("PRICE_W", fontName=DIN, fontSize=15.5, textColor=GOLD, leading=16, alignment=TA_RIGHT)
DESC = _st("DESC", fontName="Helvetica", fontSize=9.3, textColor=INK, leading=12.5)
AMT = _st("AMT", fontName="Helvetica", fontSize=9.3, textColor=INK, leading=12.5, alignment=TA_RIGHT)
SUBL = _st("SUBL", fontName="Helvetica", fontSize=9.3, textColor=INK, leading=13, alignment=TA_RIGHT)
TOTL_L = _st("TOTL_L", fontName=DIN, fontSize=13, textColor=NAVY, leading=15, alignment=TA_RIGHT)
TOTL_A = _st("TOTL_A", fontName=DIN, fontSize=14, textColor=NAVY, leading=15, alignment=TA_RIGHT)
BULLET = _st("BULLET", fontName="Helvetica", fontSize=9.3, textColor=INK, leading=13,
             leftIndent=11, firstLineIndent=-11, spaceAfter=2.5)
THANKS = _st("THANKS", fontName=SNELL, fontSize=32, textColor=NAVY, leading=30)

def _bullets(items):
    return [Paragraph(f'<font color="#b0452e">&bull;</font>&nbsp;&nbsp;{it}', BULLET) for it in items]

def _fit_image(path, max_w, max_h):
    from PIL import Image as PImage
    iw, ih = PImage.open(path).size
    s = min(max_w / iw, max_h / ih)
    return Image(path, width=iw * s, height=ih * s)

def _money(x): return f"{x:,.2f}"

def _card_style(extra):
    return TableStyle([
        ("BOX", (0, 0), (-1, -1), 1, NAVY),
        ("LEFTPADDING", (0, 0), (-1, -1), 11), ("RIGHTPADDING", (0, 0), (-1, -1), 11),
        ("TOPPADDING", (0, 0), (-1, -1), 2), ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BACKGROUND", (0, 0), (1, 0), NAVY),
        ("VALIGN", (0, 0), (1, 0), "MIDDLE"),
        ("TOPPADDING", (0, 0), (1, 0), 6), ("BOTTOMPADDING", (0, 0), (1, 0), 6),
    ] + extra)

def _option_card(opt):
    """Itemised bordered card (GST-inclusive): line items -> Total (inc GST) -> GST included."""
    lines = opt["lines"]
    tot = sum(a for _, a in lines if isinstance(a, (int, float)))   # amounts already include GST
    gst = round(tot / 11.0, 2)              # GST portion within the total
    rows = [[Paragraph(opt["title"], OPTT_W), ""]]
    for desc, amt in lines:
        amt_txt = _money(amt) if isinstance(amt, (int, float)) else str(amt)
        rows.append([Paragraph(desc, DESC), Paragraph(amt_txt, AMT)])
    tot_r = len(rows)
    rows.append([Paragraph(opt.get("total_label", "Total (inc GST)"), TOTL_L), Paragraph("$" + _money(tot), TOTL_A)])
    rows.append([Paragraph("GST included", SUBL), Paragraph(_money(gst), SUBL)])
    extra = [("SPAN", (0, 0), (1, 0)),   # itemised: the title bar spans full width (no price on the bar)
             ("LINEABOVE", (0, tot_r), (-1, tot_r), 0.6, LINE), ("TOPPADDING", (0, tot_r), (-1, tot_r), 5)]
    t = Table(rows, colWidths=[140 * mm, 34 * mm]); t.setStyle(_card_style(extra))
    return t

def _option_box(title, price, items):
    """Feature bordered card: navy title bar (white title + gold inc-GST price) + bullet list."""
    rows = [[Paragraph(title, OPTT_W), Paragraph(f'{price}<br/><font size="7">incl GST</font>', PRICE_W)],
            [_bullets(items), ""]]
    t = Table(rows, colWidths=[136 * mm, 38 * mm])
    t.setStyle(_card_style([("SPAN", (0, 1), (1, 1)), ("TOPPADDING", (0, 1), (1, 1), 8),
                            ("BOTTOMPADDING", (0, 1), (1, 1), 9)]))
    return t

def build_quote(cfg):
    S = []
    # header
    logo = Image(LOGO, width=62 * mm, height=62 * mm * 627 / 2508)
    metatxt = f"No. {cfg['quote_no']}<br/>Date: {cfg['date']}"
    if cfg.get("available"):
        metatxt += f"<br/><b>Available from: {cfg['available']}</b>"
    hdr = Table([[logo, [Paragraph("QUOTE", QTITLE), Paragraph(metatxt, META)]]], colWidths=[104 * mm, 70 * mm])
    hdr.setStyle(TableStyle([("VALIGN", (0, 0), (0, 0), "MIDDLE"), ("VALIGN", (1, 0), (1, 0), "TOP"),
                             ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0)]))
    S += [hdr, Spacer(1, 6), HRFlowable(width="100%", thickness=2.5, color=GOLD), Spacer(1, 6)]

    # from / to
    frm = ("<b>Timeless Resurfacing</b><br/>ABN 30 412 161 602<br/>Sydney, NSW<br/>"
           "0451 110 154<br/>quotes@timelessresurfacing.com.au<br/>timelessresurfacing.com.au")
    to = f"<b>{cfg['customer']}</b><br/>{cfg['address']}"
    if cfg.get("access"):
        to += f"<br/>{cfg['access']}"
    ft = Table([[Paragraph("FROM", SECT), Paragraph("TO", SECT)],
                [Paragraph(frm, BODY), Paragraph(to, BODY)]], colWidths=[87 * mm, 87 * mm])
    ft.setStyle(TableStyle([("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                            ("TOPPADDING", (0, 0), (-1, -1), 1), ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
                            ("VALIGN", (0, 0), (-1, -1), "TOP")]))
    S += [ft, Spacer(1, 7)]

    # the job (+ optional photo) — only if job_intro is provided
    if cfg.get("job_intro"):
        jobcell = [Paragraph("THE JOB", SECT), Paragraph(cfg["job_intro"], BODY)]
        if cfg.get("photo"):
            img = _fit_image(cfg["photo"], 38 * mm, 33 * mm)
            photocell = [img]
            if cfg.get("photo_caption"):
                photocell.append(Paragraph(cfg["photo_caption"], CAP))
            jt = Table([[jobcell, photocell]], colWidths=[116 * mm, 58 * mm])
            jt.setStyle(TableStyle([("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                                    ("VALIGN", (0, 0), (0, 0), "TOP"), ("VALIGN", (1, 0), (1, 0), "TOP"),
                                    ("ALIGN", (1, 0), (1, 0), "RIGHT")]))
            S += [jt, Spacer(1, 6)]
        else:
            S += jobcell + [Spacer(1, 6)]

    # options
    opts = cfg["options"]
    for i, o in enumerate(opts):
        S.append(_option_card(o) if o.get("lines") else _option_box(o["title"], o["price"], o["items"]))
        S.append(Spacer(1, 4))
    if cfg.get("options_note"):
        S += [Paragraph(cfg["options_note"], SMALL), Spacer(1, 5)]

    # ---- footer block: warranty/expect + Thank you + To book + Deposit ----
    leftcell = [Paragraph("Warranty &amp; cover", HEAD)] + _bullets(cfg["warranty"])
    if cfg.get("expect"):
        rightcell = [Paragraph("What to expect", HEAD)] + _bullets(cfg["expect"])
        wt = Table([[leftcell, rightcell]], colWidths=[92 * mm, 82 * mm])
    else:
        wt = Table([[leftcell]], colWidths=[174 * mm])
    wt.setStyle(TableStyle([("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                            ("VALIGN", (0, 0), (-1, -1), "TOP")]))
    _book = [Paragraph("To book", FOOTH),
             Paragraph("A 10% deposit secures your date. Valid 7 days; prices inc GST. Reply to this quote or "
                       "call 0451 110 154 to go ahead.", FBODY)]
    _pay = [Paragraph("Deposit &amp; payment", FOOTH),
            Paragraph("Timeless Resurfacing<br/>BSB 032146&nbsp;&nbsp;&nbsp;Acc 025303", FBODY)]
    foot = Table([[Paragraph("Thank you", THANKS), _book, _pay]], colWidths=[52 * mm, 68 * mm, 54 * mm])
    foot.setStyle(TableStyle([("VALIGN", (0, 0), (0, 0), "MIDDLE"), ("VALIGN", (1, 0), (-1, 0), "TOP"),
                              ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                              ("LINEBEFORE", (1, 0), (1, 0), 1, GOLD), ("LEFTPADDING", (1, 0), (1, 0), 12),
                              ("RIGHTPADDING", (1, 0), (1, 0), 8)]))
    footer = [wt, Spacer(1, 8), HRFlowable(width="100%", thickness=0.8, color=LINE), Spacer(1, 6),
              foot, Spacer(1, 6), Paragraph("Beautiful bathrooms shouldn't cost a fortune.", SMALLC)]

    if cfg.get("footer_bottom"):
        # anchor the footer block to the bottom of the page (two-frame layout)
        from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, FrameBreak
        from reportlab.pdfgen.canvas import Canvas as _Canvas
        PW, PH = A4; LM = RM = 18 * mm; TM = 13 * mm; BM = 11 * mm; CW = PW - LM - RM
        fg = Table([[f] for f in footer], colWidths=[CW])
        fg.setStyle(TableStyle([("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                                ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
        _, fh = fg.wrapOn(_Canvas("/tmp/_m.pdf", pagesize=A4), CW, PH)
        FH = fh + 2 * mm
        top = Frame(LM, BM + FH, CW, PH - TM - (BM + FH), id="top", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
        bot = Frame(LM, BM, CW, FH, id="bot", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
        doc = BaseDocTemplate(cfg["out"], pagesize=A4, title="Timeless Resurfacing Quote")
        doc.addPageTemplates([PageTemplate(id="main", frames=[top, bot])])
        doc.build(S + [FrameBreak(), fg])
    else:
        doc = SimpleDocTemplate(cfg["out"], pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm,
                                topMargin=13 * mm, bottomMargin=11 * mm, title="Timeless Resurfacing Quote")
        doc.build(S + footer)
    print("wrote", cfg["out"])
    return cfg["out"]

# ---- reusable content blocks ----
WARRANTY_5YR = [
    "Up to 5-year workmanship warranty",
    "Coating lifespan 10+ years with proper care",
    "$10M public liability insurance"]
EXPECT_HALFDAY = ["About half a day on site", "Bath ready to use the next morning (full cure 24&ndash;48h)", "Fixed price, no hidden fees"]
EXPECT_DAY = ["About 1 day on site", "Bath ready to use the next morning (full cure 24&ndash;48h)", "Fixed price, no hidden fees"]

# ============================ EXAMPLE CONFIGS ===============================
JOHN = {
    "customer": "John Ziino", "address": "Unit 60/192 Vimiera Rd, Marsfield NSW", "access": "(first-floor unit)",
    "quote_no": "TR-2026-0623-02", "date": "23 June 2026", "available": "",
    "job_intro": ("Resurfacing of your standard pressed-metal bathtub. We repair the chips in the surface, "
                  "then bring the tub back to a smooth, gloss-white finish that looks and feels like new."),
    "options": [{"title": "Bath resurfacing: pressed-metal tub + chip repairs", "price": "$1,540", "items": [
        "Chips repaired, filled and blended into the surface",
        "Bath resurfaced to a smooth gloss-white finish (commercial 3-pack coating)",
        "Full surface prep, etch and masking", "Clean-up on completion"]}],
    "warranty": WARRANTY_5YR, "expect": EXPECT_HALFDAY,
    "photo": "/Users/excluding/Downloads/timeless-theme-wp/docs/templates/quote-generator/photos/john-ziino-bath.jpg",
    "photo_caption": "Your bath (from your photos)",
    "out": "/Users/excluding/Downloads/Timeless-Quote-John-Ziino.pdf",
}

STEPHANIE = {
    "customer": "Stephanie", "address": "Canley Vale, NSW", "access": "",
    "quote_no": "TR-2026-0623", "date": "23 June 2026", "available": "13 July 2026",
    "job_intro": ("Resurfacing of your bathtub. From your photos the bath is worn and stained with a chip to "
                  "the surface and rust staining around the waste. We bring it back to a smooth, gloss-white "
                  "finish and replace the corroded waste cover. Two options below: the difference is whether "
                  "we strip the existing surface back first."),
    "options": [
        {"title": "Option A: Resurface + new drain cover", "price": "$1,450", "items": [
            "Bath resurfaced to a smooth gloss-white finish (commercial 3-pack coating)",
            "Surface chip repaired; rust staining around the waste treated and sealed",
            "New chrome drain / waste cover supplied and fitted",
            "Full masking, surface prep and clean-up", "No strip-back of the existing surface"]},
        {"title": "Option B: Resurface + strip-back + new drain cover", "price": "$1,550", "items": [
            "Everything in Option A, plus:",
            "Existing surface stripped back and fully re-prepped before recoating",
            "Best adhesion and longest-lasting finish, recommended if the bath has an old coating or is heavily worn"]},
    ],
    "options_note": ("Not sure which? If your bath has a previous resurfacing coating or the surface is "
                     "flaking, Option B is the durable choice. We'll confirm on arrival before any work "
                     "starts. The price you pick is the price you pay."),
    "warranty": WARRANTY_5YR, "expect": EXPECT_DAY, "photo": "", "photo_caption": "",
    "out": "/Users/excluding/Downloads/Timeless-Quote-bath-resurfacing.pdf",
}

TILEQ = {
    "customer": "Neil Prout", "address": "29/43 Hereford Street, Glebe, NSW, 2037", "access": "",
    "quote_no": "TR-2026-0703", "date": "3 July 2026", "available": "",
    "job_intro": ("Your wall tiles were painted over previously and that paint is now peeling off in patches "
                  "(walls, bath surround, soap holder), and one tile is missing. Two options below to bring it "
                  "back to a clean, durable finish."),
    "options": [
        {"title": "Option A: New floor tiles + wall resurfacing", "total_label": "Option A total (inc GST)",
         "lines": [
            ("Wall and bathtub-side resurfacing (strip back, then resurface)", 1800.00),
            ("New floor tiles laid on top + upskirting", 2250.00),
            ("Strip out and dump the old tiles", 400.00)]},
        {"title": "Option B: Resurface + replace the missing tile", "total_label": "Option B total (inc GST)",
         "lines": [
            ("Wall and bathtub-side resurfacing (strip back, then resurface)", 1800.00),
            ("Supply and glue the missing tile", 90.00)]},
    ],
    "options_note": ("Option B keeps and refreshes your existing tiles for less; Option A lays new floor tiles "
                     "to change the look. Floor tiles are supplied by you, or we can supply and deliver them "
                     "free. We'll confirm the scope on site."),
    "warranty": WARRANTY_5YR,
    "expect": ["About 2 days for the wall resurfacing (Option B); a few more days for new floor tiles (Option A)",
               "Ready to use again 24 to 48 hours after the final coat",
               "Fixed price, no hidden fees"],
    "photo": "/Users/excluding/Downloads/timeless-theme-wp/docs/templates/quote-generator/photos/painted-tiles-peeling.jpg",
    "photo_caption": "Your tiles, from your photos (paint peeling)",
    "out": "/Users/excluding/Downloads/Timeless-Quote-tile-resurfacing.pdf",
}

NEIL2 = {
    "customer": "Neil Prout", "address": "29/43 Hereford Street, Glebe, NSW, 2037", "access": "",
    "quote_no": "TR-2026-0703-B", "date": "3 July 2026", "available": "",
    "job_intro": ("A full re-tile of your bathroom: new floor tiles laid on top with upskirting, new wall tiles "
                  "including around the bathtub, and the old tiles stripped out and taken away."),
    "options": [
        {"title": "Full re-tile: new floor + wall tiles", "total_label": "Total (inc GST)", "lines": [
            ("New floor tiles laid on top + upskirting", 2250.00),
            ("New wall tiles, including around the bathtub", 2000.00),
            ("Strip out the old upskirting, wall tiles and bathtub surround", 1000.00),
            ("Tipping (dump) the old tiles and leftover rubbish", 700.00),
            ("Remove and refit the shower glass; disconnect and reconnect the vanity to tile behind it", "included")]},
    ],
    "options_note": ("You supply the floor tiles; we can pick them up and deliver free (roughly $300 to $500 for "
                     "the tiles). We'll confirm the exact scope on site."),
    "warranty": WARRANTY_5YR,
    "expect": ["2 to 3 days on site", "24 to 48 hours to cure before use", "Fixed price, no hidden fees"],
    "photo": "/Users/excluding/Downloads/timeless-theme-wp/docs/templates/quote-generator/photos/painted-tiles-peeling.jpg",
    "photo_caption": "Your tiles, from your photos (paint peeling)",
    "footer_bottom": True,
    "out": "/Users/excluding/Downloads/Timeless-Quote-Neil-Prout-retile.pdf",
}

ISABELLA = {
    "customer": "Isabella Comber", "address": "3 Nova Place, South Penrith NSW 2750", "access": "",
    "quote_no": "TR-1024", "date": "6 July 2026", "available": "",
    "job_intro": ("Resurfacing of your vanity benchtop and its built-in basin. From your photo the cream "
                  "benchtop and basin are worn and discoloured. We strip and prep the surface, then bring "
                  "it back to a smooth, fresh gloss finish that looks and feels like new."),
    "options": [{"title": "Benchtop and basin resurfacing", "price": "$1,050", "items": [
        "The full vanity benchtop and the built-in basin resurfaced as one seamless finish",
        "Strip back, surface prep, etch and masking, then a commercial 3-pack coating",
        "Existing tap and fittings worked around and cleaned up on completion"]}],
    "options_note": ("This price assumes the benchtop and basin are free of cracks or chips. We confirm the "
                     "surface on arrival, and if any cracks or chips are found we will talk you through any "
                     "change before we start. The price you agree is the price you pay."),
    "warranty": WARRANTY_5YR,
    "expect": ["About 3 to 5 hours on site", "Ready to use the next morning (full cure 24 to 48h)",
               "Fixed price, no hidden fees"],
    "photo": "", "photo_caption": "", "footer_bottom": True,
    "out": "/Users/excluding/Downloads/Timeless-Quote-Isabella-Comber.pdf",
}

CONFIGS = {"JOHN": JOHN, "STEPHANIE": STEPHANIE, "TILEQ": TILEQ, "NEIL2": NEIL2, "ISABELLA": ISABELLA}

if __name__ == "__main__":
    for n in (sys.argv[1:] or list(CONFIGS)):
        build_quote(CONFIGS[n])
