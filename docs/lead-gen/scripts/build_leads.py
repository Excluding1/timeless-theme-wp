#!/usr/bin/env python3
"""Build the leads Excel workbook (+ CSV + markdown shortlist) from the scour workflow's JSON output.

Input : docs/lead-gen/data/leads-verified.json  (produced from the workflow return value)
Output: docs/lead-gen/data/Bathroom-Resurfacing-Leads-NSW.xlsx
        docs/lead-gen/data/leads.csv
        docs/lead-gen/data/leads-shortlist.md
"""
import json, csv, sys, os
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.normpath(os.path.join(HERE, "..", "data"))
SRC = os.path.join(DATA, "leads-verified.json")
XLSX = os.path.join(DATA, "Bathroom-Resurfacing-Leads-NSW.xlsx")
CALLXLSX = os.path.join(DATA, "Bathroom-Resurfacing-CALL-LIST.xlsx")
CSV = os.path.join(DATA, "leads.csv")
MD = os.path.join(DATA, "leads-shortlist.md")

if len(sys.argv) > 1:
    SRC = sys.argv[1]

with open(SRC) as f:
    payload = json.load(f)

records = payload.get("records", [])
dropped = payload.get("dropped_out_of_scope", [])
stats = payload.get("stats", {})

def g(r, k, default=""):
    v = r.get(k, default)
    if isinstance(v, list):
        return " | ".join(str(x) for x in v if x not in (None, ""))
    if v is None:
        return ""
    return v

def is_kept(r):
    return (r.get("recommendation") not in ("reject-out-of-scope", "reject-not-nsw")
            and r.get("is_nsw") != "no"
            and r.get("is_real_resurfacing") != "out-of-scope")

# ---- consolidation: merge records that are the same business (share phone / ABN / domain / exact name) ----
import re as _re
_AGG = _re.compile(r'airtasker|hipages|oneflare|serviceseeking|yellowpages|truelocal|yelp|wordofmouth|productreview|houzz|gumtree|facebook|instagram|linkedin|localsearch|startlocal|hotfrog|cylex|dlook|reddit|whirlpool|google|bing|brownbook|aussieweb|wheree|websyte')
def _digits(s): return "".join(c for c in str(s or "") if c.isdigit())
def _nk(s): return _re.sub(r'[^a-z0-9]', '', str(s or '').lower())
def _dom(url):
    m = _re.match(r'^(?:https?://)?(?:www\.)?([a-z0-9.-]+\.[a-z]{2,})', str(url or '').lower())
    if not m: return ''
    d = m.group(1)
    return '' if _AGG.search(d) else d

def _nkloose(s):
    # drop parentheticals + platform words, keep alnum — for collapsing duplicate Airtasker/directory profiles
    s = _re.sub(r'\([^)]*\)', '', str(s or '').lower())
    s = _re.sub(r'\b(airtasker|tasker|oneflare|hipages|serviceseeking|profile|bath|resurfacer|resurfacing)\b', '', s)
    return _re.sub(r'[^a-z0-9]', '', s)

def _signals(r):
    sig = set()
    ph = _digits(r.get("phone"));  ab = _digits(r.get("abn"))
    dom = _dom(r.get("website")) or _dom(r.get("primary_link"))
    if len(ph) >= 8: sig.add("p:" + ph[-9:])
    if len(ab) >= 11: sig.add("a:" + ab)
    if dom: sig.add("d:" + dom)
    nm = _nk(r.get("business_name"))
    if len(nm) >= 6: sig.add("n:" + nm)
    # contactless (Airtasker/name-only) entries: merge duplicate profiles of the same person by loose name
    if not (len(ph) >= 8 or dom or len(ab) >= 11):
        loose = _nkloose(r.get("business_name"))
        if len(loose) >= 3: sig.add("L:" + loose)
    return sig

def consolidate(recs):
    n = len(recs)
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]; x = parent[x]
        return x
    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb: parent[rb] = ra
    sigmap = {}
    for i, r in enumerate(recs):
        for s in _signals(r):
            if s in sigmap: union(sigmap[s], i)
            else: sigmap[s] = i
    clusters = {}
    for i in range(n):
        clusters.setdefault(find(i), []).append(recs[i])

    LIST_FIELDS = ("services", "service_areas", "source_urls", "_discovery_platforms")
    merged = []
    for members in clusters.values():
        # base = the richest member: prefer active ABN, then website, then score
        def richness(r):
            return (
                1 if (r.get("abn_status") == "active" and len(_digits(r.get("abn"))) >= 11) else 0,
                1 if _dom(r.get("website")) else 0,
                r.get("recruit_score", 0),
            )
        members = sorted(members, key=richness, reverse=True)
        base = dict(members[0])
        for m in members[1:]:
            for k, v in m.items():
                if k in LIST_FIELDS:
                    cur = base.get(k) or []
                    add = v or []
                    seen = {str(x).lower() for x in cur}
                    base[k] = cur + [x for x in add if str(x).lower() not in seen]
                elif not base.get(k) and v:
                    base[k] = v
        base["recruit_score"] = max(m.get("recruit_score", 0) for m in members)
        sc = base["recruit_score"]
        base["tier"] = "A" if sc >= 75 else "B" if sc >= 60 else "C" if sc >= 40 else "D"
        if len(members) > 1:
            extra_abns = sorted({(_digits(m.get("abn"))) for m in members if len(_digits(m.get("abn"))) >= 11} - {_digits(base.get("abn"))})
            note = f" [merged {len(members)} duplicate records"
            if extra_abns: note += f"; other ABN(s) seen: {', '.join(extra_abns)}"
            note += "]"
            base["audit_notes"] = (base.get("audit_notes") or "") + note
        merged.append(base)
    return merged

_before = len(records)
records = consolidate(records)
print(f"consolidation: {_before} -> {len(records)} records (merged {_before - len(records)} duplicates)")

# ---- derived display columns the user asked for: plain entity, a clickable Link, price, last-review-year ----
_ENTITY_PLAIN = {
    "sole-trader/individual": "Sole trader",
    "company": "Pty Ltd (company)",
    "partnership": "Partnership",
    "trust": "Trust",
    "other": "Other",
    "unknown": "Unknown", "": "Unknown",
}
def _primary_link(r):
    if str(r.get("primary_link") or "").startswith("http"):
        return r["primary_link"]
    w = r.get("website") or ""
    if _dom(w):
        return w
    urls = r.get("source_urls") or []
    order = ["google.com/maps", "g.page", "maps.app", "goo.gl/maps", "business.google",
             "airtasker.com", "hipages.com", "oneflare", "productreview", "truelocal",
             "yellowpages", "wordofmouth", "houzz", "localsearch", "facebook.com", "instagram.com", "yelp", "gumtree"]
    for pat in order:
        for u in urls:
            if pat in str(u).lower():
                return u
    return w or (urls[0] if urls else "")
def _last_review_year(r):
    if r.get("last_review_year"): return str(r.get("last_review_year"))
    if r.get("last_review"): return str(r.get("last_review"))
    if r.get("has_2026_review") == "yes": return "2026"
    blob = " ".join(str(r.get(k) or "") for k in ("audit_notes", "fair_price_signal", "needs_more_jobs_reason", "review_count", "rating", "recent_review"))
    yrs = [int(y) for y in _re.findall(r'\b(202[0-9])\b', blob)]
    return str(max(yrs)) if yrs else ""
_MONTHS = {"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"}
_LOC_STOP = _MONTHS | {"GST","ABN","Active","From","Reg","The","Individual","Sole","Trader","Pty","Ltd","Company"}
def _base_suburb(r):
    for k in ("base_suburb", "base_location", "suburb", "location"):
        if r.get(k):
            return str(r.get(k))
    sa = r.get("service_areas") or []
    name = str(sa[0]).strip() if sa else ""
    blob = " ".join(str(r.get(k) or "") for k in ("audit_notes", "needs_more_jobs_reason", "price_notes"))
    # a real NSW postcode only when written as "NSW 2xxx" (avoids catching years like 2020/2019)
    pcm = _re.search(r'\bNSW\s+(2\d{3})\b', blob)
    pc = pcm.group(1) if pcm else ""
    # if the service area is broad/blank, try to pull the specific suburb sitting next to the postcode
    if pc and (not name or name.lower() in ("sydney", "nsw", "greater sydney", "sydney-wide", "sydney wide", "sydney metro")):
        m = _re.search(r'([A-Z][a-zA-Z]+(?:[ /\-][A-Z][a-zA-Z]+){0,2})[ ,(]+NSW\s+' + pc, blob)
        if m:
            cand = m.group(1).strip()
            if cand.split()[0] not in _LOC_STOP and cand not in _LOC_STOP:
                name = cand
    out = name
    if pc and pc not in out:
        out = (out + (f" {pc}" if _re.search(r'\bNSW\b', out) else f" NSW {pc}")).strip() if out else f"NSW {pc}"
    out = _re.sub(r'\bNSW(\s+NSW)+\b', 'NSW', out)
    out = _re.sub(r'\s+', ' ', out).strip()
    return out or (r.get("region") or "")

for r in records:
    r["_entity_plain"] = _ENTITY_PLAIN.get(r.get("entity_type", ""), r.get("entity_type") or "Unknown")
    r["_link"] = _primary_link(r)
    r["_last_review"] = r.get("recent_review") or _last_review_year(r)
    r["_base_suburb"] = _base_suburb(r)

# ---- outreach tracker columns (dropdowns; YOUR edits are preserved across rebuilds) ----
TRACK_DEFAULTS = {"_track_status": "Not contacted", "_track_verdict": "TBD",
                  "_track_quote": "", "_track_date": "", "_track_notes": ""}
TRACK_HEADERS = {"_track_status": "Outreach Status", "_track_verdict": "Verdict (good to use?)",
                 "_track_quote": "Their Bathtub Quote ($)", "_track_date": "Date Contacted",
                 "_track_notes": "My Notes"}
DROPDOWNS = {
    "_track_status": "Not contacted,Called - no answer,Msg/email sent,Responded,Quoted us a price,Trial job booked,Onboarded,Not interested,Ruled out",
    "_track_verdict": "TBD,Good to use,Maybe,Not good to use",
}

def load_prev_tracking(path):
    """Read tracking values the user already entered in an existing workbook, keyed by business name."""
    if not os.path.exists(path):
        return {}
    try:
        from openpyxl import load_workbook
        old = load_workbook(path, read_only=True, data_only=True)
    except Exception:
        return {}
    prev = {}
    for sheet in old.sheetnames:  # scan every sheet (All Leads, Call List, All Records, ...) so edits anywhere are kept
        ws = old[sheet]
        rows_iter = ws.iter_rows(values_only=True)
        header = None
        for row in rows_iter:
            if row and "Business / Trading Name" in row:
                header = list(row)
                break
        if not header:
            continue
        idx = {h: i for i, h in enumerate(header) if h}
        name_i = idx.get("Business / Trading Name")
        if name_i is None:
            continue
        cols_i = {k: idx.get(h) for k, h in TRACK_HEADERS.items()}
        for row in rows_iter:
            if not row or name_i >= len(row) or not row[name_i]:
                continue
            key = str(row[name_i]).strip().lower()
            slot = prev.setdefault(key, {})
            for k, i in cols_i.items():
                if i is None or i >= len(row) or row[i] is None:
                    continue
                v = str(row[i]).strip()
                if not v or v == TRACK_DEFAULTS.get(k, ""):
                    continue
                slot.setdefault(k, v)  # first non-default wins (All Leads has priority)
    old.close()
    return prev

_prev_track = load_prev_tracking(XLSX)
for _bk, _bv in load_prev_tracking(CALLXLSX).items():  # also preserve edits made in the Call List file
    slot = _prev_track.setdefault(_bk, {})
    for _k, _v in _bv.items():
        slot.setdefault(_k, _v)
for r in records:
    slot = _prev_track.get(str(r.get("business_name") or "").strip().lower(), {})
    for k, d in TRACK_DEFAULTS.items():
        r[k] = slot.get(k, d)
if _prev_track:
    print(f"preserved tracking edits for {sum(1 for v in _prev_track.values() if v)} businesses")

def is_hard_reject(r):
    # only bury the truly useless: interstate, or genuinely off-trade (concrete/pool/render/DIY-paint).
    # NSW regrouters / shower-sealers / tile-restorers are ADJACENT trades Timeless offers -> keep as potential.
    return r.get("is_nsw") == "no" or r.get("is_real_resurfacing") == "out-of-scope"

kept = [r for r in records if is_kept(r)]
_nonkept = [r for r in records if not is_kept(r)]
rejected = [r for r in _nonkept if is_hard_reject(r)]        # truly out: interstate / concrete-pool-render / DIY-paint
potential = [r for r in _nonkept if not is_hard_reject(r)]   # NSW adjacents worth a look: regrouters, shower-sealers, 'maybe'
kept.sort(key=lambda r: r.get("recruit_score", 0), reverse=True)
rejected.sort(key=lambda r: r.get("recruit_score", 0), reverse=True)
potential.sort(key=lambda r: r.get("recruit_score", 0), reverse=True)

# category label for the master "everything" tab
for r in kept:
    r["_category"] = f"VERIFIED (Tier {r.get('tier','?')})"
for r in potential:
    r["_category"] = "POTENTIAL / adjacent"
for r in rejected:
    r["_category"] = "REJECTED: not NSW" if r.get("is_nsw") == "no" else "REJECTED: out-of-scope"
all_records = kept + potential + rejected  # everything found (excl. discovery-stage drops, listed separately)

def _dig(s):
    return "".join(ch for ch in str(s or "") if ch.isdigit())

# recompute stats from the ACTUAL merged/deduped data (authoritative) — keep only the
# discovery-level counts (raw_candidates, unique_after_dedupe) from the workflow stats.
stats = dict(stats)
stats["dropped_out_of_scope_at_discovery"] = stats.get("dropped_out_of_scope_at_discovery", len(dropped))
stats["enriched"] = len(records)
stats["kept_after_audit"] = len(kept)
stats["rejected_after_audit"] = len(rejected)
stats["tiers"] = {t: sum(1 for r in kept if r.get("tier") == t) for t in ("A", "B", "C", "D")}
stats["with_phone"] = sum(1 for r in kept if len(_dig(r.get("phone"))) >= 8)
stats["with_abn"] = sum(1 for r in kept if len(_dig(r.get("abn"))) >= 11)
stats["sole_traders"] = sum(1 for r in kept if r.get("is_sole_trader") in ("yes", "likely"))

# ---- column definitions (key, header, width) ----
COLS = [
    ("tier", "Tier", 5), ("recruit_score", "Score", 6),
    ("business_name", "Business / Trading Name", 34),
    ("contact_name", "Owner / Contact", 18),
    ("phone", "Phone", 16),
    ("_track_status", "Outreach Status", 18),
    ("_track_verdict", "Verdict (good to use?)", 18),
    ("_track_quote", "Their Bathtub Quote ($)", 20),
    ("_track_date", "Date Contacted", 13),
    ("_track_notes", "My Notes", 32),
    ("phone2", "Phone 2", 14),
    ("abn", "ABN", 15),
    ("_entity_plain", "Entity Type (Sole trader / Pty Ltd / ...)", 26),
    ("_base_suburb", "Based in (suburb / town)", 24),
    ("services", "What They Do (services)", 44),
    ("_link", "Link (website / GBP / Airtasker / hipages / reviews)", 46),
    ("bathtub_price", "Bathtub price", 14),
    ("fair_price_signal", "Price / Fair-price", 26),
    ("rating", "Rating", 10), ("review_count", "Reviews", 9),
    ("_last_review", "Latest review (yr)", 12),
    ("trading_status", "Trading status", 13),
    ("is_real_resurfacing", "Real Resurfacing?", 15),
    ("is_sole_trader", "Sole Trader?", 11),
    ("is_nsw", "NSW?", 7),
    ("service_areas", "Service Areas", 30),
    ("warranty_years", "Warranty", 12),
    ("email", "Email", 26), ("website", "Website", 34),
    ("acn", "ACN", 12),
    ("entity_type", "Entity Type (raw)", 18), ("abn_status", "ABN Status", 11),
    ("gst_registered", "GST", 6),
    ("is_franchise", "Franchise?", 10), ("franchise_of", "Franchise Of", 16),
    ("method_evidence", "Method Evidence", 40),
    ("needs_more_jobs", "Needs Jobs?", 11),
    ("needs_more_jobs_reason", "Needs-Jobs Reason", 30),
    ("recommendation", "Recommendation", 18), ("confidence", "Confidence", 10),
    ("audit_notes", "Audit Notes", 50),
    ("source_urls", "All Sources", 46),
    ("_discovery_platforms", "Found On", 24),
]

# ---- styles ----
HEAD_FILL = PatternFill("solid", fgColor="041534")
HEAD_FONT = Font(color="FFFFFF", bold=True, size=10)
WRAP = Alignment(vertical="top", wrap_text=True)
TOPA = Alignment(vertical="top")
THIN = Side(style="thin", color="D9DEE6")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
TIER_FILL = {
    "A": PatternFill("solid", fgColor="C6EFCE"),
    "B": PatternFill("solid", fgColor="E7F4D8"),
    "C": PatternFill("solid", fgColor="FFF2CC"),
    "D": PatternFill("solid", fgColor="F2F2F2"),
}

def write_sheet(ws, rows, cols, title_note=None):
    r0 = 1
    if title_note:
        ws.cell(row=1, column=1, value=title_note).font = Font(bold=True, size=11, color="041534")
        r0 = 3
    # header
    for c, (key, header, width) in enumerate(cols, start=1):
        cell = ws.cell(row=r0, column=c, value=header)
        cell.fill = HEAD_FILL; cell.font = HEAD_FONT; cell.alignment = WRAP; cell.border = BORDER
        ws.column_dimensions[get_column_letter(c)].width = width
    # body
    EDIT_FILL = PatternFill("solid", fgColor="FFF7E6")  # light gold = "you edit these"
    for i, rec in enumerate(rows, start=r0 + 1):
        for c, (key, header, width) in enumerate(cols, start=1):
            val = g(rec, key)
            if key == "is_franchise":
                val = "Yes" if rec.get("is_franchise") else ""
            cell = ws.cell(row=i, column=c, value=val)
            cell.alignment = WRAP if width >= 30 else TOPA
            cell.border = BORDER
            cell.font = Font(size=10)
            if key.startswith("_track_"):
                cell.fill = EDIT_FILL
        tier = rec.get("tier")
        if tier in TIER_FILL:
            ws.cell(row=i, column=1).fill = TIER_FILL[tier]
    # dropdown validations + verdict colour-coding on the tracker columns
    if rows:
        from openpyxl.formatting.rule import CellIsRule
        GOOD = PatternFill("solid", fgColor="C6EFCE"); BAD = PatternFill("solid", fgColor="FFC7CE")
        RESP = PatternFill("solid", fgColor="D9E8FB")
        for c, (key, header, width) in enumerate(cols, start=1):
            opts = DROPDOWNS.get(key)
            col_letter = get_column_letter(c)
            rng = f"{col_letter}{r0 + 1}:{col_letter}{r0 + len(rows)}"
            if opts:
                dv = DataValidation(type="list", formula1='"%s"' % opts, allow_blank=True)
                dv.error = "Pick one of the dropdown options"
                dv.errorTitle = "Invalid option"
                ws.add_data_validation(dv)
                dv.add(rng)
            if key == "_track_verdict":
                ws.conditional_formatting.add(rng, CellIsRule(operator="equal", formula=['"Good to use"'], fill=GOOD))
                ws.conditional_formatting.add(rng, CellIsRule(operator="equal", formula=['"Not good to use"'], fill=BAD))
            if key == "_track_status":
                ws.conditional_formatting.add(rng, CellIsRule(operator="equal", formula=['"Responded"'], fill=RESP))
                ws.conditional_formatting.add(rng, CellIsRule(operator="equal", formula=['"Onboarded"'], fill=GOOD))
                ws.conditional_formatting.add(rng, CellIsRule(operator="equal", formula=['"Not interested"'], fill=BAD))
    ws.freeze_panes = ws.cell(row=r0 + 1, column=4)
    last_col = get_column_letter(len(cols))
    ws.auto_filter.ref = f"A{r0}:{last_col}{r0 + len(rows)}"

wb = Workbook()

# Sheet 1: All verified leads
ws1 = wb.active
ws1.title = "All Leads"
write_sheet(ws1, kept, COLS)

# Sheet 1b: ALL RECORDS (everything found — verified + potential + rejected)
ws_all = wb.create_sheet("All Records (everything)")
full_cols = [("_category", "Category", 22)] + [c for c in COLS if c[0] != "tier"]
write_sheet(ws_all, all_records, full_cols,
            f"EVERYTHING FOUND across 9 rounds + Google Maps census: {len(all_records)} records "
            f"({len(kept)} verified · {len(potential)} potential · {len(rejected)} rejected). "
            f"Plus {len(dropped)} dropped at discovery (bottom of the 'Rejected & Out-of-scope' tab). Filter the Category column.")

# Sheet 2: Shortlist A+B
ws2 = wb.create_sheet("Shortlist (A+B)")
short_cols = [c for c in COLS if c[0] in (
    "tier","recruit_score","business_name","contact_name","phone",
    "_track_status","_track_verdict","_track_quote","_track_date","_track_notes",
    "abn","_entity_plain","_base_suburb",
    "services","_link","bathtub_price","fair_price_signal","rating","review_count","_last_review","trading_status",
    "is_real_resurfacing","is_sole_trader","service_areas","warranty_years",
    "recommendation","audit_notes")]
write_sheet(ws2, [r for r in kept if r.get("tier") in ("A","B")], short_cols,
            "TOP RECRUIT TARGETS — Tier A (score >=75) and Tier B (60-74). Start outreach here.")

# Sheet 3: Sole traders / owner-operators
ws3 = wb.create_sheet("Sole Traders")
write_sheet(ws3, [r for r in kept if r.get("is_sole_trader") in ("yes","likely")], short_cols,
            "OWNER-OPERATORS / SOLE TRADERS (the target profile).")

# Sheet 3b: Potential / adjacent (the "even potential candidates" the boss asked for)
ws_pot = wb.create_sheet("Potential (vet these)")
write_sheet(ws_pot, potential, short_cols,
            "POTENTIAL / ADJACENT — real NSW operators who do REGROUTING / SHOWER-SEALING / TILE-RESTORATION / leak "
            "repair (adjacent trades Timeless offers) but weren't confirmed as spray bath resurfacers. Most have a "
            "phone. Great for regrouting/shower overflow — call and ask if they also resurface. Vet before recruiting.")

# Sheet 4: Rejected & out-of-scope (audit trail)
ws4 = wb.create_sheet("Rejected & Out-of-scope")
rej_cols = [c for c in COLS if c[0] in (
    "business_name","website","phone","is_real_resurfacing","is_nsw","is_franchise",
    "recommendation","confidence","audit_notes","source_urls")]
write_sheet(ws4, rejected, rej_cols, "REJECTED AT AUDIT (not NSW / not real resurfacing / other). Kept for the audit trail.")
# append discovery-stage out-of-scope drops below
start = 3 + len(rejected) + 3
ws4.cell(row=start, column=1, value="Dropped at discovery (flagged out-of-scope before enrichment):").font = Font(bold=True, color="BA1A1A")
ws4.cell(row=start+1, column=1, value="Business").font = HEAD_FONT
ws4.cell(row=start+1, column=1).fill = HEAD_FILL
ws4.cell(row=start+1, column=2, value="Why").font = HEAD_FONT
ws4.cell(row=start+1, column=2).fill = HEAD_FILL
for j, d in enumerate(dropped, start=start+2):
    ws4.cell(row=j, column=1, value=d.get("business_name",""))
    ws4.cell(row=j, column=2, value=d.get("why",""))

# Sheet 5: Summary
ws5 = wb.create_sheet("Summary")
ws5.column_dimensions["A"].width = 42
ws5.column_dimensions["B"].width = 16
ws5.cell(row=1, column=1, value="Bathroom Resurfacing Subcontractor Leads — NSW").font = Font(bold=True, size=14, color="041534")
ws5.cell(row=2, column=1, value="Generated by leadgen-full-scour workflow").font = Font(italic=True, color="595E6D")
rowi = 4
def stat(label, value):
    global rowi
    ws5.cell(row=rowi, column=1, value=label).font = Font(bold=True)
    ws5.cell(row=rowi, column=2, value=value)
    rowi += 1
stat("Raw candidates discovered", stats.get("raw_candidates"))
stat("Unique after dedupe", stats.get("unique_after_dedupe"))
stat("Out-of-scope dropped (discovery)", stats.get("dropped_out_of_scope_at_discovery"))
stat("Enriched + audited", stats.get("enriched"))
stat("KEPT after audit (real NSW leads)", stats.get("kept_after_audit"))
stat("Potential / adjacent (vet these)", len(potential))
stat("Hard-rejected (interstate / out-of-scope)", len(rejected))
tiers = stats.get("tiers", {})
stat("  Tier A (score >=75)", tiers.get("A"))
stat("  Tier B (60-74)", tiers.get("B"))
stat("  Tier C (40-59)", tiers.get("C"))
stat("  Tier D (<40)", tiers.get("D"))
stat("With phone number", stats.get("with_phone"))
stat("With ABN", stats.get("with_abn"))
stat("Sole traders / owner-operators", stats.get("sole_traders"))
if stats.get("cap_note"):
    stat("Note", stats.get("cap_note"))

# Sheet 0: How To Use (first tab)
ws_h = wb.create_sheet("How To Use", 0)
ws_h.column_dimensions["A"].width = 110
_h = [
    ("Bathroom Resurfacing Subcontractor Leads — NSW · How to use this workbook", True),
    ("", False),
    ("WHAT THIS IS: every verified NSW bathroom/bathtub resurfacer we could find (websites, Google Maps, Airtasker,", False),
    ("hipages/Oneflare via search, directories, forums/Reddit, franchise networks), audited against the ABR register.", False),
    ("", False),
    ("YOUR TRACKER (light-gold columns — these are YOURS to edit, and they SURVIVE rebuilds):", True),
    ("  • Outreach Status — dropdown: Not contacted / Called - no answer / Msg-email sent / Responded / Quoted us a price /", False),
    ("    Trial job booked / Onboarded / Not interested / Ruled out", False),
    ("  • Verdict (good to use?) — dropdown: TBD / Good to use (green) / Maybe / Not good to use (red)", False),
    ("  • Their Bathtub Quote ($) — type the price they quote YOU for a standard bathtub resurface, to compare subbies", False),
    ("  • Date Contacted + My Notes — free text", False),
    ("", False),
    ("PRICE BENCHMARK (bathtub resurface, standard tub):", True),
    ("  • Best quote we've received so far: $780. Low-end market estimate: ~$500. Target for subs: $400-550.", False),
    ("  • The 'Bathtub price' column shows any PUBLISHED price we found; 'Their Bathtub Quote ($)' is what they tell you.", False),
    ("", False),
    ("TABS: All Leads (everything, ranked) · Shortlist A+B (start calling here) · Sole Traders (the target profile) ·", False),
    ("Rejected & Out-of-scope (audit trail — who we excluded and why) · Summary (counts).", False),
    ("", False),
    ("TIERS: A (score 75+) = call first · B (60-74) · C (40-59) · D = long shots. Score rewards: verified real resurfacing,", False),
    ("sole trader, reachable phone, ABN, 4.5+ stars, 2026 reviews, cheap/fair pricing; penalises franchises & big companies.", False),
    ("", False),
    ("Sort/filter tip: use the filter arrows in the header row (e.g. filter Verdict = 'Good to use', or sort by", False),
    ("'Their Bathtub Quote ($)' to see your cheapest verified subbies).", False),
]
for ri, (txt, bold) in enumerate(_h, start=1):
    c = ws_h.cell(row=ri, column=1, value=txt)
    c.font = Font(bold=bold, size=12 if ri == 1 else 10, color="041534" if bold else "3A3F4C")
    c.alignment = Alignment(vertical="top")

wb.save(XLSX)

# ---- standalone single-sheet CALL LIST (all contactable leads: verified + potential) ----
call_leads = kept + potential  # verified first (already score-sorted), then potential
for i, r in enumerate(call_leads, 1):
    r["_rownum"] = i
wb2 = Workbook()
wsc = wb2.active
wsc.title = "Call List"
call_cols = [("_rownum", "#", 5), ("_category", "Type", 20)] + [c for c in COLS if c[0] in (
    "recruit_score", "business_name", "contact_name", "phone", "phone2", "email", "abn", "_entity_plain",
    "_base_suburb", "services", "_link", "bathtub_price", "rating", "review_count",
    "_track_status", "_track_verdict", "_track_quote", "_track_date", "_track_notes")]
write_sheet(wsc, call_leads, call_cols,
            f"CALL LIST — all {len(call_leads)} contactable NSW leads ({len(kept)} verified, then {len(potential)} potential/adjacent). "
            f"Work top-to-bottom; tick off the gold columns (Status / Verdict / their bathtub quote / notes). "
            f"Rejected interstate/out-of-scope entries are excluded here — see the main workbook for those.")
wb2.save(CALLXLSX)

# ---- CSV (flat, kept leads) ----
csv_cols = [c[0] for c in COLS]
with open(CSV, "w", newline="") as f:
    w = csv.writer(f)
    w.writerow([c[1] for c in COLS])
    for r in kept:
        w.writerow([("Yes" if (k=="is_franchise" and r.get(k)) else ("" if (k=="is_franchise") else g(r,k))) for k in csv_cols])

# ---- Markdown shortlist ----
with open(MD, "w") as f:
    f.write("# Bathroom Resurfacing Subcontractor Leads — NSW (ranked shortlist)\n\n")
    f.write(f"**{stats.get('kept_after_audit','?')} verified NSW leads** | "
            f"Tier A: {tiers.get('A','?')} · B: {tiers.get('B','?')} · C: {tiers.get('C','?')} · D: {tiers.get('D','?')} | "
            f"with phone: {stats.get('with_phone','?')} · with ABN: {stats.get('with_abn','?')}\n\n")
    f.write("Full data + audit trail: `Bathroom-Resurfacing-Leads-NSW.xlsx`\n\n---\n\n")
    for r in kept:
        if r.get("tier") not in ("A", "B"):
            continue
        f.write(f"### [{r.get('tier')}·{r.get('recruit_score')}] {g(r,'business_name')}\n")
        line = []
        if g(r,'contact_name'): line.append(f"**{g(r,'contact_name')}**")
        if g(r,'phone'): line.append(f"📞 {g(r,'phone')}")
        if g(r,'email'): line.append(f"✉ {g(r,'email')}")
        if g(r,'website'): line.append(g(r,'website'))
        f.write(" · ".join(line) + "\n\n")
        meta = []
        if g(r,'abn'): meta.append(f"ABN {g(r,'abn')} ({g(r,'entity_type')})")
        if g(r,'is_sole_trader'): meta.append(f"sole-trader: {g(r,'is_sole_trader')}")
        if g(r,'warranty_years'): meta.append(f"warranty: {g(r,'warranty_years')}")
        if g(r,'rating'): meta.append(f"rating: {g(r,'rating')}")
        if g(r,'service_areas'): meta.append(f"areas: {g(r,'service_areas')}")
        if meta:
            f.write("- " + " · ".join(meta) + "\n")
        if g(r,'services'): f.write(f"- Services: {g(r,'services')}\n")
        if g(r,'audit_notes'): f.write(f"- Audit: {g(r,'audit_notes')}\n")
        f.write("\n")

print(f"WROTE:\n  {XLSX}\n  {CSV}\n  {MD}")
print(f"kept={len(kept)} rejected={len(rejected)} dropped={len(dropped)}")
