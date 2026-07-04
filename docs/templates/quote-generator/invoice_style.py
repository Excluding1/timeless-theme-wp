#!/usr/bin/env python3
"""
Timeless Resurfacing — QUOTE in the house INVOICE-FORM layout (matches the old invoice template).
Big title + logo · Timeless Resurfacing + ABN · BILL TO / QUOTE # · DESCRIPTION/AMOUNT table with
per-option Subtotal / GST / Total · optional job photo · Thank you + Terms & Conditions (deposit,
warranty, account details).

Amounts are entered EX GST; GST (10%) is added per option. House rules: no em-dashes, no banned words.
Edit the CFG dict + run:  python3 invoice_style.py
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, HRFlowable
from reportlab.lib.enums import TA_RIGHT, TA_LEFT

NAVY = colors.HexColor("#1f3a5f"); RUST = colors.HexColor("#b0452e")
INK = colors.HexColor("#222222"); MUTED = colors.HexColor("#555555"); LINEC = colors.HexColor("#dddddd")
LOGO = "/Users/excluding/Downloads/timeless-theme-wp/assets/brand/logo/tr-mark.png"

from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
def _reg(name, path, idx=None):
    try:
        pdfmetrics.registerFont(TTFont(name, path, subfontIndex=idx) if idx is not None else TTFont(name, path)); return name
    except Exception: return None
DIN = _reg("DINCond", "/System/Library/Fonts/Supplemental/DIN Condensed Bold.ttf") or "Helvetica-Bold"
SNELL = _reg("Snell", "/System/Library/Fonts/Supplemental/SnellRoundhand.ttc", 0) or "Times-BoldItalic"

_ss = getSampleStyleSheet()
def _st(n, **kw):
    return ParagraphStyle(n, parent=_ss["Normal"], **kw)
TITLE = _st("TITLE", fontName=DIN, fontSize=34, textColor=NAVY, leading=34)
NAME  = _st("NAME", fontName="Helvetica-Bold", fontSize=10.5, textColor=INK, leading=14)
SMALL = _st("SMALL", fontName="Helvetica", fontSize=9.5, textColor=INK, leading=13)
LBL   = _st("LBL", fontName="Helvetica-Bold", fontSize=11, textColor=NAVY, leading=15)
LBLR  = _st("LBLR", fontName=DIN, fontSize=12.5, textColor=NAVY, leading=15, alignment=TA_RIGHT)
BTLBL = _st("BTLBL", fontName=DIN, fontSize=13, textColor=NAVY, leading=15)
VALR  = _st("VALR", fontName="Helvetica", fontSize=10, textColor=INK, leading=15, alignment=TA_RIGHT)
BODY  = _st("BODY", fontName="Helvetica", fontSize=9.5, textColor=INK, leading=13)
AMT   = _st("AMT", fontName="Helvetica", fontSize=9.5, textColor=INK, leading=13, alignment=TA_RIGHT)
OPTH  = _st("OPTH", fontName=DIN, fontSize=13.5, textColor=NAVY, leading=15)
COLH  = _st("COLH", fontName=DIN, fontSize=13, textColor=NAVY, leading=14)
COLHR = _st("COLH", fontName=DIN, fontSize=13, textColor=NAVY, leading=14, alignment=TA_RIGHT)
SUBL  = _st("SUBL", fontName="Helvetica", fontSize=9.5, textColor=INK, leading=14, alignment=TA_RIGHT)
TOTL  = _st("TOTL", fontName=DIN, fontSize=15, textColor=NAVY, leading=16, alignment=TA_RIGHT)
THANKS= _st("THANKS", fontName=SNELL, fontSize=42, textColor=NAVY, leading=40)
TCH   = _st("TCH", fontName=DIN, fontSize=14, textColor=RUST, leading=15)
TC    = _st("TC", fontName="Helvetica", fontSize=9.5, textColor=INK, leading=15)
CAP   = _st("CAP", fontName="Helvetica", fontSize=8, textColor=MUTED, leading=11, spaceBefore=3)

def _money(x): return f"{x:,.2f}"

def build(cfg):
    S = []
    # ---- title + logo ----
    hdr = Table([[Paragraph("QUOTE", TITLE), Image(LOGO, width=25*mm, height=25*mm)]],
                colWidths=[133*mm, 45*mm])
    hdr.setStyle(TableStyle([("VALIGN",(0,0),(0,0),"BOTTOM"),("VALIGN",(1,0),(1,0),"TOP"),
                             ("ALIGN",(1,0),(1,0),"RIGHT"),("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),0)]))
    S += [hdr, Spacer(1,2),
          Paragraph("<b>Timeless Resurfacing</b>", NAME),
          Paragraph("ABN: 30 412 161 602", SMALL), Spacer(1,6)]

    # ---- bill to / quote no ----
    billto = [Paragraph("BILL TO", BTLBL), Paragraph(f"{cfg['customer']},<br/>{cfg['address']}", SMALL)]
    meta = Table([[Paragraph("QUOTE #", LBLR), Paragraph(cfg["quote_no"], VALR)],
                  [Paragraph("QUOTE DATE", LBLR), Paragraph(cfg["date"], VALR)]],
                 colWidths=[40*mm, 30*mm])
    meta.setStyle(TableStyle([("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),0),
                              ("TOPPADDING",(0,0),(-1,-1),1),("BOTTOMPADDING",(0,0),(-1,-1),1)]))
    bt = Table([[billto, meta]], colWidths=[108*mm, 70*mm])
    bt.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),0),
                            ("RIGHTPADDING",(0,0),(-1,-1),0),("ALIGN",(1,0),(1,0),"RIGHT")]))
    S += [bt, Spacer(1,5), HRFlowable(width="100%", thickness=1.4, color=RUST), Spacer(1,7)]

    # ---- description / amount table ----
    rows = [[Paragraph("DESCRIPTION", COLH), Paragraph("AMOUNT", COLHR)]]
    styles = [("LINEBELOW",(0,0),(-1,0),1,RUST),
              ("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),0),
              ("TOPPADDING",(0,0),(-1,-1),2),("BOTTOMPADDING",(0,0),(-1,-1),2),
              ("VALIGN",(0,0),(-1,-1),"TOP")]
    r = 1
    for opt in cfg["options"]:
        rows.append([Paragraph(opt["title"], OPTH), ""]); styles.append(("TOPPADDING",(0,r),(-1,r),9)); r += 1
        sub = 0.0
        for desc, amt in opt["items"]:
            rows.append([Paragraph(desc, BODY), Paragraph(_money(amt), AMT)]); sub += amt; r += 1
        tot = sub; gst = round(sub/11.0, 2)
        rows.append([Paragraph(opt.get("total_label","Total (inc GST)"), TOTL), Paragraph("$"+_money(tot), TOTL)])
        styles.append(("LINEABOVE",(0,r),(-1,r),0.6,LINEC)); styles.append(("TOPPADDING",(0,r),(-1,r),5)); r += 1
        rows.append([Paragraph("GST included", SUBL), Paragraph(_money(gst), SUBL)]); r += 1
    tbl = Table(rows, colWidths=[138*mm, 40*mm]); tbl.setStyle(TableStyle(styles))
    S += [tbl, Spacer(1,4)]

    # ---- job photo (optional) ----
    if cfg.get("photo"):
        from PIL import Image as PImage
        iw, ih = PImage.open(cfg["photo"]).size
        w = 36*mm; h = w*ih/iw
        ph = [Image(cfg["photo"], width=w, height=h)]
        if cfg.get("photo_caption"): ph.append(Paragraph(cfg["photo_caption"], CAP))
        pt = Table([[ph]], colWidths=[70*mm])
        pt.setStyle(TableStyle([("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),0)]))
        S += [pt, Spacer(1,5)]

    # ---- thank you + terms ----
    tc = [Paragraph("<b>TERMS &amp; CONDITIONS</b>", TCH), Spacer(1,4)]
    for line in cfg["terms"]:
        tc.append(Paragraph(line, TC))
    tt = Table([[Paragraph("Thank you", THANKS), tc]], colWidths=[95*mm, 83*mm])
    tt.setStyle(TableStyle([("VALIGN",(0,0),(0,0),"MIDDLE"),("VALIGN",(1,0),(1,0),"TOP"),
                            ("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),0),
                            ("LINEBEFORE",(1,0),(1,0),1,RUST),("LEFTPADDING",(1,0),(1,0),12)]))
    S += [tt]

    doc = SimpleDocTemplate(cfg["out"], pagesize=A4, leftMargin=16*mm, rightMargin=16*mm,
                            topMargin=13*mm, bottomMargin=11*mm, title="Timeless Resurfacing Quote")
    doc.build(S)
    print("wrote", cfg["out"])
    return cfg["out"]

NEIL = {
    "customer": "Neil Prout",
    "address": "29/43 Hereford Street, Glebe, NSW, 2037",
    "quote_no": "1042", "date": "3/07/2026",
    "options": [
        {"title": "Option A: New tiles + wall resurfacing", "items": [
            ("Wall resurfacing (walls and the sides of the bathtub): strip and sand back the old coatings, "
             "surface prep, professional 3-pack white resurfacing, regrout and new silicone", 1800.00),
            ("New tiles laid on top + upskirting", 2250.00),
            ("Strip out and dump the old tiles", 400.00)],
         "total_label": "Option A total (inc GST)"},
        {"title": "Option B: Wall resurfacing + replace the missing tile", "items": [
            ("Wall resurfacing (walls and the sides of the bathtub): strip and sand back the old coatings, "
             "surface prep, professional 3-pack white resurfacing, regrout and new silicone", 1800.00),
            ("Supply and glue the 1x missing tile + regrout", 90.00)],
         "total_label": "Option B total (inc GST)"},
    ],
    "photo": "/Users/excluding/Downloads/timeless-theme-wp/docs/templates/quote-generator/photos/neil-prout-bathtub.jpg",
    "photo_caption": "Your bathroom (from your photos)",
    "terms": [
        "10% deposit upon arrival at the jobsite",
        "Warranty period is 5 years",
        "&nbsp;",
        "Account Details:",
        "Account Name: Timeless Resurfacing",
        "BSB: 032146",
        "Account Number: 025303"],
    "out": "/Users/excluding/Downloads/Timeless-Quote-Neil-Prout.pdf",
}

if __name__ == "__main__":
    build(NEIL)
