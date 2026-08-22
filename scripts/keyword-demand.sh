#!/usr/bin/env bash
#
# keyword-demand.sh — rank blog ideas by real Australian search demand.
#
#   ./scripts/keyword-demand.sh "leaking shower" "mould in bathroom" "regrout shower"
#   ANCHOR="bathroom renovation" ./scripts/keyword-demand.sh "term one" "term two"
#   ./scripts/keyword-demand.sh --long-tail "leaking shower"
#
# Google Trends only compares up to 5 terms at once, and a single comparison containing
# one dominant term crushes everything else to zero. So this batches terms in groups of
# four, puts the SAME anchor in every batch, and rescales each batch onto the anchor's
# scale. That makes twenty terms comparable to each other, which a raw Trends query
# cannot do.
#
# Indices are RELATIVE, not monthly volume. For absolute numbers use Google Keyword
# Planner (free, needs an Ads account) or Search Console once the site is live. This is
# for deciding which of two ideas is bigger, which is the actual question when choosing
# what to write next.
#
set -uo pipefail

ANCHOR="${ANCHOR:-bathroom renovation}"
GEO="${GEO:-AU}"
TIMEFRAME="${TIMEFRAME:-today 5-y}"
LONGTAIL=0

if [ "${1:-}" = "--long-tail" ]; then LONGTAIL=1; shift; fi

if [ $# -eq 0 ]; then
    cat >&2 <<EOF
usage: $0 [--long-tail] "term one" "term two" ...

  ANCHOR=...     comparison anchor (default: "$ANCHOR")
  GEO=...        default AU
  TIMEFRAME=...  default "today 5-y"

  --long-tail    also pull Google autocomplete for each term, which shows what
                 people actually type and often surfaces a better title than the
                 head term itself.
EOF
    exit 2
fi

ANCHOR="$ANCHOR" GEO="$GEO" TIMEFRAME="$TIMEFRAME" LONGTAIL="$LONGTAIL" python3 - "$@" <<'PY'
import json, os, sys, time, urllib.parse, urllib.request, http.cookiejar

ANCHOR, GEO, TF = os.environ['ANCHOR'], os.environ['GEO'], os.environ['TIMEFRAME']
LONGTAIL = os.environ['LONGTAIL'] == '1'
terms = [t for t in sys.argv[1:] if t.strip() and t.strip() != ANCHOR]

cj = http.cookiejar.CookieJar()
op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
op.addheaders = [
    ('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
                   '(KHTML, like Gecko) Chrome/120.0 Safari/537.36'),
    ('Accept-Language', 'en-AU,en;q=0.9'),
]

def warm():
    # Trends 429s without a session cookie. The warm-up request itself errors; the
    # cookie it sets is the point.
    try:
        op.open(f'https://trends.google.com/trends/explore?geo={GEO}', timeout=45).read()
    except Exception:
        pass

def get(url, tries=4):
    for i in range(tries):
        try:
            return op.open(url, timeout=45).read().decode()
        except urllib.error.HTTPError as e:
            if e.code in (429, 302, 500) and i < tries - 1:
                time.sleep(6 * (i + 1)); continue
            raise
    raise RuntimeError('exhausted')

def batch(group):
    """Average interest for each term in one comparison. Strips the XSSI prefix."""
    req = {"comparisonItem": [{"keyword": k, "geo": GEO, "time": TF} for k in group],
           "category": 0, "property": ""}
    u = ("https://trends.google.com/trends/api/explore?hl=en-AU&tz=-600&req="
         + urllib.parse.quote(json.dumps(req)) + "&geo=" + GEO)
    w = json.loads((lambda s: s[s.find('{'):])(get(u)))
    tl = [x for x in w['widgets'] if x.get('id') == 'TIMESERIES'][0]
    u2 = ("https://trends.google.com/trends/api/widgetdata/multiline?hl=en-AU&tz=-600&req="
          + urllib.parse.quote(json.dumps(tl['request']))
          + "&token=" + urllib.parse.quote(tl['token']))
    d = json.loads((lambda s: s[s.find('{'):])(get(u2)))
    rows = d['default']['timelineData']
    tot = [0] * len(group)
    for r in rows:
        for i, v in enumerate(r['value']):
            tot[i] += v
    n = max(1, len(rows))
    return {k: v / n for k, v in zip(group, tot)}, len(rows)

def autocomplete(term):
    u = ("https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=au&q="
         + urllib.parse.quote(term))
    try:
        return json.loads(get(u))[1][:8]
    except Exception:
        return []

print()
print(f"  AU SEARCH DEMAND — geo={GEO}, {TF}")
print(f"  anchor: \"{ANCHOR}\"  (every batch includes it, so batches are comparable)")
print()

warm()
scaled, weeks = {}, 0
for i in range(0, len(terms), 4):
    group = [ANCHOR] + terms[i:i + 4]
    try:
        res, weeks = batch(group)
    except Exception as e:
        print(f"  batch {i//4+1} FAILED: {type(e).__name__} {str(e)[:80]}")
        continue
    base = res.get(ANCHOR, 0)
    if base <= 0:
        # Anchor itself registered nothing, so this batch cannot be rescaled.
        print(f"  batch {i//4+1}: anchor flat, reporting raw")
        for k, v in res.items():
            if k != ANCHOR: scaled[k] = v
    else:
        for k, v in res.items():
            if k != ANCHOR:
                scaled[k] = v / base       # fraction of the anchor
    if i + 4 < len(terms):
        time.sleep(10)                      # Trends rate-limits hard

if not scaled:
    print("  no data returned"); raise SystemExit(1)

print(f"  {weeks} weekly points per term\n")
print(f"  {'share of anchor':>16}   term")
print("  " + "-" * 58)
top = max(scaled.values()) or 1
for k, v in sorted(scaled.items(), key=lambda x: -x[1]):
    bar = '#' * int(round(v / top * 34))
    print(f"  {v*100:14.1f}%   {k:34s} {bar}")

print()
print("  READ IT AS: relative demand, not monthly volume. A term at 0.0% is BELOW")
print("  Trends' measurement floor, which means too small to measure rather than")
print("  nobody searching. Those terms often convert best, so judge them on intent.")

if LONGTAIL:
    print()
    print("  WHAT PEOPLE ACTUALLY TYPE (Google autocomplete, AU)")
    for t in terms:
        sugg = autocomplete(t)
        print(f"\n    {t}")
        for s in sugg:
            print(f"      - {s}")
        time.sleep(1)
    print()
    print("  Autocomplete reflects real queries. If a suggestion reads better than your")
    print("  planned title, use the suggestion: it is the phrasing people bring.")
print()
PY
