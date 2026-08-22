#!/usr/bin/env python3
"""
audit-site.py — score EVERY page on the site against the same dimensions the article
auditor uses, so "is the whole site up to standard" is a measurement rather than an opinion.

    python3 scripts/audit-site.py                 # local 1.5.2 (what we are about to ship)
    python3 scripts/audit-site.py --live          # the current live 1.5.1
    python3 scripts/audit-site.py --verbose       # per-page detail

Reads the RENDERED page, because several defects (schema that does not parse, purged CSS,
shortcodes that fail) only exist after WordPress has rendered it.
"""
import argparse, json, re, subprocess, sys, html
from collections import defaultdict

LOCAL = "http://localhost:8881"
LIVE  = "https://timelessresurfacing.com.au"

def fetch(url):
    r = subprocess.run(["curl","-s","-m25","-w","\n%{http_code}",url],capture_output=True,text=True)
    body = r.stdout
    code = body.rsplit("\n",1)[-1].strip() if "\n" in body else "0"
    return body.rsplit("\n",1)[0], code

def main_text(h):
    m = re.search(r"<main.*?</main>", h, re.S)
    if not m: return ""
    t = re.sub(r"<script.*?</script>|<style.*?</style>", "", m.group(0), flags=re.S)
    return re.sub(r"\s+"," ", html.unescape(re.sub(r"<[^>]+>"," ",t))).strip()

def page_type(path):
    if path in ("/",""): return "homepage"
    if re.match(r"^/services/[a-z-]+/[a-z-]+/$", path): return "suburb"
    if path == "/services/": return "hub"
    if path.startswith("/services/"): return "service"
    if path.startswith("/blog/") and path != "/blog/": return "article"
    if path == "/blog/": return "blog archive"
    if path in ("/privacy/","/terms/","/warranty/","/care-instructions/"): return "legal/info"
    return "core"

def audit(base, path):
    h, code = fetch(base + path)
    r = {"path": path, "code": code, "type": page_type(path), "issues": []}
    if code != "200":
        r["issues"].append(f"HTTP {code}")
        return r
    title = re.search(r"<title>(.*?)</title>", h, re.S)
    r["title"] = html.unescape(title.group(1)).strip() if title else ""
    r["title_len"] = len(r["title"])
    desc = re.search(r'<meta name="description" content="([^"]*)"', h)
    r["desc"] = html.unescape(desc.group(1)) if desc else ""
    r["desc_len"] = len(r["desc"])
    r["h1"] = len(re.findall(r"<h1[\s>]", h))
    r["h2"] = len(re.findall(r"<h2[\s>]", h))
    txt = main_text(h)
    r["words"] = len(txt.split())
    r["canonical"] = bool(re.search(r'rel="canonical"', h))
    r["og"] = all(f'property="og:{k}"' in h for k in ("title","description","image"))
    blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', h, re.S)
    ok = 0; types = set()
    for b in blocks:
        try:
            d = json.loads(b); ok += 1
            for n in (d.get("@graph") or [d]):
                if isinstance(n, dict) and n.get("@type"): types.add(str(n["@type"]))
        except Exception:
            r["issues"].append("invalid JSON-LD")
    r["schema_ok"] = ok; r["schema_types"] = sorted(types)
    imgs = re.findall(r"<img\b[^>]*>", h)
    r["imgs"] = len(imgs)
    r["img_noalt"] = sum(1 for i in imgs if 'alt="' not in i)
    body = re.search(r"<main.*?</main>", h, re.S)
    bt = body.group(0) if body else h
    r["ilinks"] = len(set(re.findall(r'href="[^"]*?(/(?:services|blog|areas|about|contact|gallery|faqs|warranty)/[a-z0-9/-]*)"', bt)))
    r["noindex"] = "noindex" in (re.search(r'<meta name="robots" content="([^"]*)"', h) or re.match("","")).group(1) if re.search(r'<meta name="robots"', h) else False

    # ---- issues, by the same thresholds the article auditor uses ----
    if not r["title"]: r["issues"].append("no title")
    elif r["title_len"] > 60: r["issues"].append(f"title {r['title_len']} chars (>60, truncates)")
    elif r["title_len"] < 30: r["issues"].append(f"title {r['title_len']} chars (short)")
    if not r["desc"]: r["issues"].append("no meta description")
    elif not (120 <= r["desc_len"] <= 160): r["issues"].append(f"description {r['desc_len']} chars (want 120-160)")
    if r["h1"] != 1: r["issues"].append(f"{r['h1']} H1s (want exactly 1)")
    if not r["canonical"]: r["issues"].append("no canonical")
    if not r["og"]: r["issues"].append("incomplete Open Graph")
    if r["schema_ok"] == 0: r["issues"].append("no valid schema")
    if r["img_noalt"]: r["issues"].append(f"{r['img_noalt']} images missing alt")
    floor = {"service":900,"article":1200,"suburb":700,"homepage":600,"hub":500}.get(r["type"])
    if floor and r["words"] < floor and not r["noindex"]:
        r["issues"].append(f"{r['words']} words (thin for a {r['type']}, want {floor}+)")
    if r["type"] in ("service","article","suburb") and r["ilinks"] < 3:
        r["issues"].append(f"only {r['ilinks']} internal links")
    return r

ap = argparse.ArgumentParser()
ap.add_argument("--live", action="store_true")
ap.add_argument("--verbose", action="store_true")
a = ap.parse_args()
base = LIVE if a.live else LOCAL

sm, _ = fetch(base + "/sitemap.xml")
paths = [u.replace(base,"") or "/" for u in re.findall(r"<loc>([^<]+)</loc>", sm)]
if not paths:
    sys.exit("no sitemap URLs found at " + base)

print(f"SITE AUDIT — {base}   ({len(paths)} URLs)\n")
rows = [audit(base, p) for p in paths]

by_type = defaultdict(list)
for r in rows: by_type[r["type"]].append(r)

print(f"{'type':<14}{'n':>4}{'clean':>7}{'issues':>8}   {'median words':>13}")
print("-"*52)
for t, rs in sorted(by_type.items()):
    clean = sum(1 for r in rs if not r["issues"])
    ws = sorted(r.get("words",0) for r in rs)
    med = ws[len(ws)//2] if ws else 0
    print(f"{t:<14}{len(rs):>4}{clean:>7}{sum(len(r['issues']) for r in rs):>8}   {med:>13}")

print("\nPAGES WITH ISSUES\n" + "-"*52)
bad = [r for r in rows if r["issues"]]
for r in sorted(bad, key=lambda x: -len(x["issues"])):
    print(f"  {r['path']}  [{r['type']}]")
    for i in r["issues"]: print(f"      - {i}")
if not bad: print("  none")

print(f"\n{len(rows)-len(bad)}/{len(rows)} pages clean")
if a.verbose:
    print("\nDETAIL")
    for r in rows:
        print(f"  {r['path']:<46} {r.get('words',0):>5}w  h2={r.get('h2',0):<3} img={r.get('imgs',0):<3} links={r.get('ilinks',0):<3} schema={r.get('schema_types')}")
