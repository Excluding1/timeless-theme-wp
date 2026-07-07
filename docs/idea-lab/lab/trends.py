"""Google Trends interest signal (unofficial endpoint, best-effort).

Google's public Trends widgets have no official API, so this mirrors what the
browser does: bootstrap a cookie, ask /explore for the TIMESERIES widget token,
then pull its 12-month interest-over-time series. Google rate-limits and may
block a datacenter IP outright — every failure degrades to {"available": False}
rather than raising, and the caller just shows "trend unavailable". When the
Claude CLI is logged in, the analyst's live web research covers trends far more
reliably; this is the always-on lightweight signal.
"""
import http.cookiejar
import json
import re
import urllib.parse
import urllib.request

_UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
       "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")
_TRIM = re.compile(r"^\)\]\}',?\s*")   # Google prefixes responses with )]}',


def _opener():
    jar = http.cookiejar.CookieJar()
    return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar)), jar


def _get(opener, url, timeout=15):
    req = urllib.request.Request(url, headers={"User-Agent": _UA,
                                               "Accept-Language": "en-US,en;q=0.9"})
    with opener.open(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")


def keyword_from_title(title):
    """Reduce a scraped idea title to a short, trend-searchable phrase."""
    t = title or ""
    t = re.sub(r"^\s*\[[^\]]+\]\s*", "", t)              # [r/SaaS], [CN], [EU-Startups]
    t = re.sub(r"^(show hn:|ask hn:|launch hn:)\s*", "", t, flags=re.I)
    t = t.split("—")[0].split(" - ")[0].split(":")[0]    # "Name — tagline" -> "Name"
    t = re.sub(r"[^\w\s]", " ", t)
    words = [w for w in t.split() if len(w) > 1]
    return " ".join(words[:4]).strip()


def interest(keyword, geo="", timeframe="today 12-m"):
    """Return interest-over-time for a keyword.

    {available:True, keyword, current, average, peak, slope, direction, series}
    or {available:False, reason}. current/average/peak are 0-100 (Google's own
    normalization within the query); slope is the normalized 0..1 trend of the
    last ~third of the series; direction is rising|flat|falling.
    """
    kw = (keyword or "").strip()
    if not kw:
        return {"available": False, "reason": "no keyword"}
    try:
        opener, _ = _opener()
        _get(opener, "https://trends.google.com/?geo=US")   # seed the NID cookie
        req = json.dumps({"comparisonItem": [{"keyword": kw, "geo": geo, "time": timeframe}],
                          "category": 0, "property": ""})
        explore = _get(opener, "https://trends.google.com/trends/api/explore?" +
                       urllib.parse.urlencode({"hl": "en-US", "tz": "0", "req": req}))
        data = json.loads(_TRIM.sub("", explore))
        widget = next((w for w in data.get("widgets", [])
                       if w.get("id") == "TIMESERIES"), None)
        if not widget:
            return {"available": False, "reason": "no timeseries widget"}
        wreq = json.dumps(widget["request"], separators=(",", ":"))
        multiline = _get(opener, "https://trends.google.com/trends/api/widgetdata/multiline?" +
                         urllib.parse.urlencode({"hl": "en-US", "tz": "0",
                                                 "req": wreq, "token": widget["token"]}))
        timeline = json.loads(_TRIM.sub("", multiline)).get("default", {}).get("timelineData", [])
        series = [int(pt["value"][0]) for pt in timeline
                  if pt.get("value") and pt.get("hasData", [True])[0]]
        if len(series) < 4:
            return {"available": False, "reason": "not enough data"}
        current = series[-1]
        average = sum(series) / len(series)
        peak = max(series) or 1
        tail = series[-max(4, len(series) // 3):]
        head = series[:max(4, len(series) // 3)]
        head_avg = sum(head) / len(head)
        tail_avg = sum(tail) / len(tail)
        slope = round((tail_avg - head_avg) / 100.0, 3)         # -1..1
        direction = "rising" if slope > 0.05 else "falling" if slope < -0.05 else "flat"
        return {"available": True, "keyword": kw, "current": current,
                "average": round(average, 1), "peak": peak, "slope": slope,
                "direction": direction, "series": series[-52:]}
    except Exception as e:
        return {"available": False, "reason": str(e)[:80]}


def refresh_idea(idea_id):
    """Fetch trends for one idea and persist momentum + trend_json. Returns the trend dict."""
    from . import db
    idea = db.idea(idea_id)
    if not idea:
        return {"available": False, "reason": "unknown idea"}
    kw = keyword_from_title(idea["title"])
    tr = interest(kw)
    if tr.get("available"):
        # momentum blends current interest with its direction so a rising niche
        # outranks a bigger-but-fading one when traction is otherwise equal.
        momentum = round(min(100.0, tr["current"] * (1 + max(0.0, tr["slope"]))), 1)
        db.set_idea_trend(idea_id, momentum,
                          {k: tr[k] for k in ("keyword", "current", "average",
                                              "peak", "slope", "direction")})
    return tr
