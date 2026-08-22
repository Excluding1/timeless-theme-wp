#!/usr/bin/env bash
#
# audit-article.sh — score a blog article against the checks in
# docs/content/blog/PIPELINE.md and print a scorecard out of 100.
#
#   ./scripts/audit-article.sh bathroom-resurfacing-rental-property
#   ./scripts/audit-article.sh <slug> "primary keyword phrase"
#
# Every check here caught a real defect on article one. Reads the rendered page from
# wp-now, because several defects (purged CSS, shortcodes that fail to run, schema that
# does not parse) only exist after WordPress has rendered it, not in the source file.
#
set -uo pipefail

SLUG="${1:-}"
PRIMARY="${2:-}"
BASE="${AUDIT_BASE:-http://localhost:8881}"

if [ -z "$SLUG" ]; then
    echo "usage: $0 <slug> [\"primary keyword phrase\"]" >&2
    exit 2
fi

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$REPO/docs/content/blog/$SLUG.html"
URL="$BASE/blog/$SLUG/"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

[ -f "$SRC" ] || { echo "no source file: $SRC" >&2; exit 2; }

CODE=$(curl -s -o "$TMP/a.html" -w "%{http_code}" "$URL")
if [ "$CODE" != "200" ]; then
    echo "$URL returned $CODE — is wp-now running and the post published?" >&2
    exit 2
fi

# Primary keyword defaults to the slug read as words, which is usually right.
[ -n "$PRIMARY" ] || PRIMARY="$(echo "$SLUG" | tr '-' ' ')"

echo
echo "  ARTICLE AUDIT — $SLUG"
echo "  $URL"
echo "  primary keyword: \"$PRIMARY\""
echo

# ── house rules ───────────────────────────────────────────────────────────────
echo "  HOUSE RULES"
EM=$(grep -o "—" "$SRC" | wc -l | tr -d ' ')
CON=$(grep -ci "contractor" "$SRC" | tr -d ' ')
DOL=$(grep -oE '\$[0-9,]+' "$SRC" | wc -l | tr -d ' ')
GUA=$(grep -ci "guarantee" "$SRC" | tr -d ' ')
for pair in "em dashes:$EM" "contractor:$CON" "guarantee:$GUA"; do
    n="${pair##*:}"; l="${pair%%:*}"
    [ "$n" = "0" ] && printf "    ok    %-16s 0\n" "$l" || printf "    FAIL  %-16s %s\n" "$l" "$n"
done
# The locked rule bans OUR prices. A cited public statistic that happens to be a dollar
# amount (a median bond deduction, say) is not a price. So this reports rather than
# blocks, and prints each match so a human decides which kind it is.
if [ "$DOL" = "0" ]; then
    printf "    ok    %-16s 0\n" "dollar figures"
else
    printf "    CHECK %-16s %s — must be cited data, never our pricing:\n" "dollar figures" "$DOL"
    grep -oE '\$[0-9,]+' "$SRC" | sort -u | sed 's/^/            /'
fi
HOUSE_FAILS=$(( (EM>0) + (CON>0) + (GUA>0) ))
echo

# ── everything measurable off the rendered page ───────────────────────────────
PRIMARY="$PRIMARY" python3 - "$TMP/a.html" <<'PY'
import re, sys, html, json, os

t = open(sys.argv[1], encoding='utf-8').read()
primary = os.environ['PRIMARY'].lower()

def g(p, s=t):
    m = re.search(p, s, re.S)
    return m.group(1).strip() if m else ''

title = html.unescape(g(r'<title>(.*?)</title>'))
desc  = html.unescape(g(r'<meta name="description" content="(.*?)"'))
h1    = html.unescape(re.sub(r'<[^>]+>', '', g(r'<h1[^>]*>(.*?)</h1>')))
body  = g(r'<div class="entry-content.*?>(.*)</div>\s*</article>')
h2s   = [html.unescape(re.sub(r'<[^>]+>', '', x)) for x in re.findall(r'<h2[^>]*>(.*?)</h2>', body, re.S)]
clean = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ',
        re.sub(r'<(script|style|svg).*?</\1>', '', body, flags=re.S))))

# Prose only, for the readability measure. Tables and card lists carry no sentence-ending
# punctuation, so a whole table reads to the splitter as one 120-word sentence and the
# average sentence length becomes meaningless. Measure what a person actually reads as
# prose, and judge the components on their own terms.
prose_html = re.sub(r'<(table|ul|ol|figure).*?</\1>', ' ', body, flags=re.S)
prose_html = re.sub(r'<(script|style|svg).*?</\1>', '', prose_html, flags=re.S)
prose = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', prose_html)))
words = clean.split()
low   = clean.lower()

score, notes = 0, []

# ── on-page fundamentals, 25 ──────────────────────────────────────────────────
print("  ON-PAGE FUNDAMENTALS                            /25")
pts = 0
ok = len(title) <= 60 and title
pts += 4 if ok else 0
print(f"    {'ok  ' if ok else 'FAIL'}  title {len(title)} chars (<=60)")
ok = 120 <= len(desc) <= 160
pts += 4 if ok else 0
print(f"    {'ok  ' if ok else 'FAIL'}  description {len(desc)} chars (120-160)")
ok = 'rel="canonical"' in t
pts += 3 if ok else 0
print(f"    {'ok  ' if ok else 'FAIL'}  canonical present")
ok = len(re.findall(r'<h1', t)) == 1
pts += 3 if ok else 0
print(f"    {'ok  ' if ok else 'FAIL'}  exactly one H1")
ok = len(h2s) >= 6
pts += 3 if ok else 0
print(f"    {'ok  ' if ok else 'FAIL'}  {len(h2s)} H2 sections (>=6)")

first100 = ' '.join(words[:100]).lower()
# Stem the terms: "rental property" must count as present in "Rental Properties".
core = [w[:6] for w in primary.split() if len(w) > 3]
placements = {
    'title':      all(w in title.lower() for w in core[:2]),
    'H1':         any(w in h1.lower() for w in core),
    'first 100':  any(w in first100 for w in core),
    'an H2':      any(any(w in h.lower() for w in core) for h in h2s),
    'meta desc':  any(w in desc.lower() for w in core),
}
hit = sum(placements.values())
pts += 5 if hit == 5 else (3 if hit >= 4 else 0)
print(f"    {'ok  ' if hit==5 else 'WARN'}  keyword placement {hit}/5 "
      f"({', '.join(k for k,v in placements.items() if not v) or 'all'})")

imgs = re.findall(r'<img[^>]*>', body)
noalt = sum(1 for i in imgs if 'alt=""' in i or 'alt=' not in i)
ok = noalt == 0
pts += 3 if ok else 0
print(f"    {'ok  ' if ok else 'FAIL'}  {len(imgs)} body images, {noalt} missing alt")
score += pts
print(f"    -> {pts}/25\n")

# ── depth and E-E-A-T, 25 ─────────────────────────────────────────────────────
print("  DEPTH & E-E-A-T                                 /25")
pts = 0
ok = len(words) >= 1500
pts += 5 if ok else 0
print(f"    {'ok  ' if ok else 'FAIL'}  {len(words)} words (>=1500)")
ext = sorted(set(re.findall(r'href="(https?://(?!localhost)[^"]+)"', body)))
gov = [e for e in ext if '.gov.' in e or '.abs.' in e or '.edu.' in e]
pts += 8 if gov else (4 if ext else 0)
print(f"    {'ok  ' if gov else 'WARN'}  {len(ext)} external citations, {len(gov)} to primary sources")
ok = 'Allan P' in t or 'author' in t.lower()
pts += 3 if ok else 0
print(f"    {'ok  ' if ok else 'FAIL'}  author byline")
ok = 'dateModified' in t
pts += 3 if ok else 0
print(f"    {'ok  ' if ok else 'FAIL'}  dateModified in schema")
sent = [s for s in re.split(r'(?<=[.!?]) ', prose) if s.split()]
avg = sum(len(s.split()) for s in sent) / max(1, len(sent))
longs = sum(1 for s in sent if len(s.split()) > 30)
ok = avg <= 22 and longs / max(1, len(sent)) <= 0.20
pts += 3 if ok else 0
print(f"    {'ok  ' if ok else 'WARN'}  avg sentence {avg:.1f} words, {longs*100//max(1,len(sent))}% over 30")
ok = len(re.findall(r'<table', body)) >= 1 or len(re.findall(r'tr-stat', body)) >= 1
pts += 3 if ok else 0
print(f"    {'ok  ' if ok else 'WARN'}  has a table or data block")
score += pts
print(f"    -> {pts}/25\n")

# ── AI search / AEO, 25 ───────────────────────────────────────────────────────
print("  AI SEARCH / AEO                                 /25")
pts = 0
parts = re.split(r'(<h[23][^>]*>.*?</h[23]>)', body, flags=re.S)
cur, tot, inwin, misses = None, 0, 0, []
for p in parts:
    hm = re.match(r'<(h[23])[^>]*>(.*?)</\1>', p, re.S)
    if hm:
        cur = html.unescape(re.sub(r'<[^>]+>', '', hm.group(2))).strip(); continue
    if cur is None: continue
    pm = re.search(r'<p[^>]*>(.*?)</p>', p, re.S)
    if not pm: cur = None; continue
    n = len(html.unescape(re.sub(r'<[^>]+>', '', pm.group(1))).split()); tot += 1
    if 35 <= n <= 70: inwin += 1
    else: misses.append(f"{cur[:40]} ({n}w)")
    cur = None
ratio = inwin / max(1, tot)
pts += 10 if ratio == 1 else (7 if ratio >= 0.85 else 3)
print(f"    {'ok  ' if ratio==1 else 'WARN'}  {inwin}/{tot} answers in the 40-60 word window")
for m in misses[:4]: print(f"            - {m}")

types = []
for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>', t, re.S):
    try: types.append(json.loads(b).get('@type'))
    except Exception: types.append('INVALID')
need = {'BlogPosting', 'FAQPage', 'BreadcrumbList'}
have = need & set(types)
pts += 9 if have == need and 'INVALID' not in types else 4
print(f"    {'ok  ' if have==need else 'FAIL'}  schema {sorted(types)}")

ok = 'max-snippet:-1' in t and 'max-image-preview:large' in t
pts += 3 if ok else 0
print(f"    {'ok  ' if ok else 'FAIL'}  robots max-snippet / max-image-preview")
ok = 'sameAs' in t
pts += 3 if ok else 0
print(f"    {'ok  ' if ok else 'WARN'}  entity sameAs present")
score += pts
print(f"    -> {pts}/25\n")

# ── internal architecture, 15 ─────────────────────────────────────────────────
print("  INTERNAL ARCHITECTURE                           /15")
pts = 0
internal = sorted(set(re.findall(r'href="(/[a-z0-9/-]+/)"', body)))
svc = [i for i in internal if i.startswith('/services/')]
pts += 6 if len(svc) >= 2 else (3 if svc else 0)
print(f"    {'ok  ' if len(svc)>=2 else 'WARN'}  {len(internal)} internal links, {len(svc)} to service pages")
# The theme's own in-article CTA anchors at #article-quote, not #quote, so the
# original check failed a page that had a perfectly good CTA.
ok = '#article-quote' in body or '#quote' in body or '/contact/' in body
pts += 4 if ok else 0
print(f"    {'ok  ' if ok else 'FAIL'}  quote CTA present")
ok = 'BreadcrumbList' in t
pts += 2 if ok else 0
print(f"    {'ok  ' if ok else 'FAIL'}  breadcrumb")
print(f"    ....  inbound links: checked separately, see below")
score += pts
print(f"    -> {pts}/15  (+3 available for inbound)\n")

# ── media, 10 ─────────────────────────────────────────────────────────────────
print("  MEDIA                                           /10")
pts = 0
ok = 'og:image' in t
pts += 3 if ok else 0
print(f"    {'ok  ' if ok else 'FAIL'}  cover / og:image")
ok = len(imgs) >= 3
pts += 4 if ok else (2 if len(imgs) >= 2 else 0)
print(f"    {'ok  ' if ok else 'WARN'}  {len(imgs)} body images (>=3 for this length)")
ok = 'ba-slider' in body
pts += 3 if ok else 0
print(f"    {'ok  ' if ok else 'WARN'}  real before/after slider")
score += pts
print(f"    -> {pts}/10\n")

print(f"  SUBTOTAL {score}/97   (inbound-link check adds up to 3)")
open('/tmp/_audit_score', 'w').write(str(score))
PY

# ── inbound links, the one that gets missed ───────────────────────────────────
echo "  INBOUND LINKS"
INB=$(grep -rl "$SLUG" --include="*.php" "$REPO" 2>/dev/null | grep -v node_modules | grep -v functions.php | wc -l | tr -d ' ')
if [ "$INB" -gt 0 ]; then
    printf "    ok    %s template(s) link to this article:\n" "$INB"
    grep -rl "$SLUG" --include="*.php" "$REPO" 2>/dev/null | grep -v node_modules | grep -v functions.php \
        | sed "s|$REPO/|      |"
    BONUS=3
else
    echo "    FAIL  nothing links to this article except /blog/ — it is orphaned"
    BONUS=0
fi
echo

# ── every internal link resolves ──────────────────────────────────────────────
echo "  LINK TARGETS"
BROKEN=0
for u in $(grep -oE 'href="(/[a-z0-9/-]+/)"' "$SRC" | sed 's/href="//;s/"//' | sort -u); do
    c=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$u")
    [ "$c" = "200" ] && printf "    ok    %s\n" "$u" || { printf "    FAIL  %s -> %s\n" "$u" "$c"; BROKEN=$((BROKEN+1)); }
done
echo

SCORE=$(cat /tmp/_audit_score 2>/dev/null || echo 0)
TOTAL=$((SCORE + BONUS))
echo "  ─────────────────────────────────────────────"
printf "  SCORE  %s/100\n" "$TOTAL"
if [ "$HOUSE_FAILS" -gt 0 ] || [ "$BROKEN" -gt 0 ]; then
    echo "  BLOCKED — house-rule or broken-link failures must be fixed first"
elif [ "$TOTAL" -ge 85 ]; then
    echo "  Publishable, once Rule 8 and the images are done."
else
    echo "  Below 85 — fix the FAIL and WARN lines above before publishing."
fi
echo
