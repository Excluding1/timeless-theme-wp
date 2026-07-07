#!/usr/bin/env python3
"""Apply Google-Maps (Chrome) findings to leads-verified.json:
 (1) update rating/review_count/address on matching known records,
 (2) add genuinely-new Maps operators as records.
Then re-run build_leads.py to regenerate the workbook."""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.normpath(os.path.join(HERE, "..", "data"))
VERI = os.path.join(DATA, "leads-verified.json")

payload = json.load(open(VERI))
records = payload["records"]

def dig(s): return "".join(c for c in str(s or "") if c.isdigit())
def nk(s): return re.sub(r'[^a-z0-9]', '', str(s or "").lower())

# ---- (1) rating/review enrichments from Maps (name-substr or phone match) ----
ENRICH = [
    ("AB Resurfacing", "0414257746", "4.5", "21", "Unit 168/18-34 Waverley St, Bondi Junction"),
    ("Alpha Bathroom Resurfacing", "0424807802", "5.0", "8", "97 Prince Edward Ave"),
    ("Sydney Resurfacing Services", "0400376679", "5.0", "26", "88B Mount St"),
    ("Apex Resurfacing", "1300030351", "4.9", "68", ""),
    ("Jim's Bathrooms", "131546", "4.9", "141", ""),
    ("ThermoGlaze", "0298980606", "4.9", "97", "122/126 Old Pittwater Rd, Cromer"),
    ("Smart Solution Resurfacing", "0488030919", "5.0", "4", ""),
    ("Rejuve Resurfacing", "0401735883", "5.0", "6", ""),
    ("AQ Resurfacing", "0410822424", "5.0", "72", ""),
    ("Amazing Tub", "0418293780", "1.0", "1", "15 Spinebill St / 5 Thorogood Dr, Cooranbong (1-star review flag)"),
]
enriched = 0
for name, phone, rating, reviews, addr in ENRICH:
    for r in records:
        if nk(name) in nk(r.get("business_name")) or (dig(phone) and dig(phone) == dig(r.get("phone"))):
            # only fill/upgrade rating if missing or Maps has a real number
            if not r.get("rating") or "google" not in str(r.get("rating")).lower():
                r["rating"] = rating
            r["review_count"] = reviews
            note = f" [Google Maps: {rating}★ / {reviews} reviews"
            if addr: note += f"; {addr}"
            note += "]"
            if "[Google Maps:" not in (r.get("audit_notes") or ""):
                r["audit_notes"] = (r.get("audit_notes") or "") + note
            enriched += 1
            break

# ---- (2) new Maps operators ----
def mk(**kw):
    base = {"is_franchise": False, "franchise_of": "", "abn": "", "abn_status": "unknown",
            "entity_type": "unknown", "is_sole_trader": "unknown", "gst_registered": "unknown",
            "services": [], "service_areas": [], "source_urls": [], "_discovery_platforms": ["Google Maps (Chrome)"],
            "trading_status": "active", "confidence": "medium"}
    base.update(kw)
    return base

existing_phones = {dig(r.get("phone")) for r in records if dig(r.get("phone"))}
existing_names = {nk(r.get("business_name")) for r in records}
NEW = [
    mk(business_name="GlazeMaster Kitchen & Bathroom Resurfacing (Newcastle / Central Coast)", phone="0428 221 865",
       rating="4.5", review_count="8", base_suburb="Newcastle / Central Coast NSW", is_real_resurfacing="yes",
       is_franchise=True, franchise_of="GlazeMaster", is_sole_trader="likely", needs_more_jobs="maybe",
       services=["Bath resurfacing", "Tile resurfacing", "Kitchen resurfacing"],
       recommendation="recruit", primary_link="https://www.google.com/maps/search/GlazeMaster+Newcastle",
       method_evidence="GlazeMaster resurfacing franchise; 'It looks brand new!' (Maps reviews)",
       audit_notes="Found on Google Maps (Newcastle/Central Coast). Real bath/tile/kitchen resurfacer, GlazeMaster franchisee, 4.5/8 reviews, ph 0428 221 865. NEEDS: ABN + entity confirmation on follow-up."),
    mk(business_name="Bathroom Werx Wollongong", phone="1800 644 171", rating="5.0", review_count="1",
       base_suburb="Wollongong NSW", is_real_resurfacing="yes", is_franchise=True, franchise_of="Bathroom Werx",
       is_sole_trader="likely", needs_more_jobs="maybe", services=["Bath resurfacing", "Tile resurfacing"],
       recommendation="maybe", primary_link="https://www.google.com/maps/search/Bathroom+Werx+Wollongong",
       audit_notes="Google Maps: Bathroom Werx franchisee, Wollongong, ph 1800 644 171, 5.0/1. Franchise (not free sole trader). NEEDS ABN."),
    mk(business_name="Professional Bathware Repairs", base_suburb="Sydney (Eastern Suburbs pin)",
       is_real_resurfacing="likely", needs_more_jobs="unknown", recommendation="maybe",
       primary_link="https://www.google.com/maps/search/Professional+Bathware+Repairs+Sydney",
       method_evidence="Bathware repairs (chip/resurface) - Google Maps pin, Sydney",
       audit_notes="Google Maps pin (Sydney). Bathware repair/resurfacing. NEEDS phone + ABN + method confirmation on follow-up."),
    mk(business_name="Elite Bathroom & Laundry Renovations (Shower Repair Illawarra)", phone="0405 259 124",
       rating="5.0", review_count="3", base_suburb="Wollongong / Illawarra NSW", is_real_resurfacing="no",
       is_sole_trader="likely", needs_more_jobs="maybe", services=["Shower repair", "Bathroom renovation"],
       recommendation="reject-other", primary_link="https://www.google.com/maps/search/Elite+Bathroom+Laundry+Illawarra",
       audit_notes="Google Maps (Illawarra). Shower repair + reno (adjacent, not spray resurfacing) - Potential tab. Owner Steve, ph 0405 259 124."),
]
added = 0
for c in NEW:
    if dig(c.get("phone")) and dig(c["phone"]) in existing_phones:
        continue
    if nk(c["business_name"]) in existing_names:
        continue
    records.append(c)
    added += 1

payload["records"] = records
json.dump(payload, open(VERI, "w"), indent=2)
print(f"rating-enriched {enriched} known records; added {added} new Maps operators; total {len(records)}")
