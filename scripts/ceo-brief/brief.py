#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CEO Brief bot — Timeless Resurfacing.

Replica of Surface Care's flagship "Monday CEO Brief" agent: every Monday 7am
it pulls the Sales pipeline from GoHighLevel (LeadConnector API v2) and posts
a one-screen brief to Slack — sales performance vs the prior 4-week average,
a weekly trend, top jobs by value, and plain-English insights.

Modes:
    python3 brief.py --stdout    # print the brief to the terminal (default)
    python3 brief.py --dry-run   # fetch + compute, show what WOULD post where
    python3 brief.py --slack     # post to Slack (webhook file or env var)

Stdlib only (urllib/json/datetime) — no pip installs, runs on system python3.
Secrets are NEVER in this file or config.json: the GHL PIT and the Slack
webhook URL are read from files under .secrets/ (paths in config.json), with
SLACK_WEBHOOK_URL env var as a fallback for the webhook.

Read-only against GHL: only GET requests are ever made to the API.
"""

import argparse
import datetime
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# The cockpit renders agent cards from ~/.timeless/cards/ (a spool OUTSIDE
# ~/Downloads: macOS TCC blocks launchd-run python from touching Downloads).
# Writing here makes the Monday brief visible with no Slack setup required.
COCKPIT_CARD = os.path.join(os.path.expanduser("~"), ".timeless", "cards",
                            "ceo-brief-latest.md")
API_BASE = "https://services.leadconnectorhq.com"
API_VERSION = "2021-07-28"
# GHL sits behind Cloudflare, which rejects the default "Python-urllib/3.x"
# user agent with error 1010 ("browser signature banned"). A normal browser
# UA string is required — verified live 2026-07-07.
USER_AGENT = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
              "AppleWebKit/537.36 (KHTML, like Gecko) "
              "Chrome/126.0.0.0 Safari/537.36")
MAX_PAGES = 50  # hard safety cap on pagination


class BriefError(Exception):
    """Readable, user-facing failure (bad token, API down, config broken)."""


# ---------------------------------------------------------------- config / secrets

def load_config():
    path = os.path.join(SCRIPT_DIR, "config.json")
    try:
        with open(path, "r") as fh:
            return json.load(fh)
    except (OSError, ValueError) as exc:
        raise BriefError("cannot read config.json (%s): %s" % (path, exc))


def resolve_path(cfg_path):
    """Secret paths in config.json are relative to the script directory."""
    if not cfg_path:
        return None
    if os.path.isabs(cfg_path):
        return cfg_path
    return os.path.normpath(os.path.join(SCRIPT_DIR, cfg_path))


def read_secret_file(path):
    """Return stripped file contents, or None if the file doesn't exist."""
    if not path or not os.path.exists(path):
        return None
    try:
        with open(path, "r") as fh:
            value = fh.read().strip()
        return value or None
    except OSError:
        return None


def load_pit(cfg):
    path = resolve_path(cfg.get("ghl_pit_file"))
    pit = read_secret_file(path)
    if not pit:
        raise BriefError(
            "GHL Private Integration Token not found — expected it in %s "
            "(see README.md)" % path)
    return pit


def find_slack_webhook(cfg):
    """Return (url, source_description) or (None, explanation)."""
    path = resolve_path(cfg.get("slack_webhook_file"))
    url = read_secret_file(path)
    if url:
        return url, "file %s" % path
    url = os.environ.get("SLACK_WEBHOOK_URL", "").strip()
    if url:
        return url, "SLACK_WEBHOOK_URL env var"
    return None, ("no webhook found — create %s containing the incoming-webhook "
                  "URL, or set SLACK_WEBHOOK_URL" % path)


# ---------------------------------------------------------------- HTTP

def http_json(url, headers, payload=None, attempts=3):
    """GET (or POST if payload) a URL, return parsed JSON / raw text.

    Retries transient failures (5xx, 429, network) with backoff. Raises
    BriefError with a readable message otherwise.
    """
    data = None
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers = dict(headers)
        headers["Content-Type"] = "application/json"
    last_err = None
    for attempt in range(1, attempts + 1):
        req = urllib.request.Request(url, data=data, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                body = resp.read().decode("utf-8", "replace")
                try:
                    return json.loads(body)
                except ValueError:
                    return body  # Slack webhooks answer plain "ok"
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", "replace")[:300]
            if exc.code in (429, 500, 502, 503, 504) and attempt < attempts:
                last_err = "HTTP %s" % exc.code
                time.sleep(2 * attempt)
                continue
            if exc.code == 401:
                raise BriefError(
                    "GHL rejected the token (HTTP 401) — the PIT has likely "
                    "been rotated or expired. Update .secrets/ghl-pit.key.")
            if exc.code == 403 and "cloudflare" in body.lower():
                raise BriefError(
                    "Cloudflare blocked the request (403/1010 browser "
                    "signature). The script already sends a browser "
                    "User-Agent; Cloudflare rules may have changed. "
                    "Body: %s" % body)
            raise BriefError("HTTP %s from %s — %s" % (exc.code, url, body))
        except urllib.error.URLError as exc:
            last_err = str(exc.reason)
            if attempt < attempts:
                time.sleep(2 * attempt)
                continue
        except OSError as exc:
            last_err = str(exc)
            if attempt < attempts:
                time.sleep(2 * attempt)
                continue
    raise BriefError("network failure after %d attempts calling %s: %s"
                     % (attempts, url, last_err))


def ghl_get(path, pit, params=None):
    url = API_BASE + path
    if params:
        url += "?" + urllib.parse.urlencode(params)
    headers = {
        "Authorization": "Bearer " + pit,
        "Version": API_VERSION,
        "Accept": "application/json",
        "User-Agent": USER_AGENT,
    }
    return http_json(url, headers)


# ---------------------------------------------------------------- GHL fetch

def fetch_stages(cfg, pit):
    """Return (ordered stage list, {stage_id: position}, sent_pos, accepted_pos).

    Stage names are resolved at runtime by name so renames/reorders in GHL
    don't silently break the sent/accepted mapping.
    """
    data = ghl_get("/opportunities/pipelines", pit,
                   {"locationId": cfg["location_id"]})
    pipelines = data.get("pipelines", []) if isinstance(data, dict) else []
    pipe = None
    for p in pipelines:
        if p.get("id") == cfg["pipeline_id"]:
            pipe = p
            break
    if pipe is None:
        raise BriefError("pipeline id %s not found in location %s "
                         "(check config.json)" %
                         (cfg["pipeline_id"], cfg["location_id"]))
    stages = sorted(pipe.get("stages", []),
                    key=lambda s: s.get("position", 0))
    if not stages:
        raise BriefError("pipeline %r has no stages" % pipe.get("name"))
    pos_by_id = {s["id"]: i for i, s in enumerate(stages)}

    def find_stage(name):
        want = name.strip().lower()
        for i, s in enumerate(stages):
            if s.get("name", "").strip().lower() == want:
                return i
        for i, s in enumerate(stages):  # fallback: substring match
            if want in s.get("name", "").strip().lower():
                return i
        raise BriefError(
            "stage named %r not found in pipeline %r — stages are: %s. "
            "Update config.json to match the renamed stage." %
            (name, pipe.get("name"),
             ", ".join(s.get("name", "?") for s in stages)))

    sent_pos = find_stage(cfg.get("quote_sent_stage_name", "Quote Sent"))
    accepted_pos = find_stage(
        cfg.get("quote_accepted_stage_name", "Quote Accepted"))
    return stages, pos_by_id, sent_pos, accepted_pos


def fetch_opportunities(cfg, pit):
    """Paginate GET /opportunities/search until the pipeline is exhausted."""
    opps = []
    page = 1
    total = None
    while page <= MAX_PAGES:
        data = ghl_get("/opportunities/search", pit, {
            "location_id": cfg["location_id"],
            "pipeline_id": cfg["pipeline_id"],
            "limit": 100,
            "page": page,
        })
        batch = data.get("opportunities", []) if isinstance(data, dict) else []
        meta = data.get("meta", {}) if isinstance(data, dict) else {}
        total = meta.get("total", total)
        opps.extend(batch)
        if not batch:
            break
        if total is not None and len(opps) >= total:
            break
        page += 1
    return opps


def fetch_field_map(cfg, pit):
    """Map custom-field id -> fieldKey (opportunity search returns ids only).

    Non-fatal: if the PIT lacks the customFields scope we fall back to the
    margin_assumption estimate and note it in the brief.
    """
    try:
        data = ghl_get("/locations/%s/customFields" % cfg["location_id"],
                       pit, {"model": "opportunity"})
    except BriefError:
        return {}, False
    fields = data.get("customFields", []) if isinstance(data, dict) else []
    return {f["id"]: f.get("fieldKey", "") for f in fields if f.get("id")}, True


# ---------------------------------------------------------------- shaping

def parse_dt(value):
    """ISO-8601 (with Z) -> aware datetime in LOCAL time. None on failure."""
    if not value or not isinstance(value, str):
        return None
    try:
        dt = datetime.datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None
    if dt.tzinfo is None:
        dt = dt.astimezone()  # assume local
    return dt.astimezone()


def custom_field_values(opp, field_map):
    """{fieldKey: value} for one opportunity's customFields list."""
    out = {}
    for cf in opp.get("customFields") or []:
        key = field_map.get(cf.get("id"))
        if not key:
            continue
        if "fieldValueNumber" in cf:
            out[key] = cf["fieldValueNumber"]
        elif "fieldValueString" in cf:
            out[key] = cf["fieldValueString"]
        elif "fieldValue" in cf:
            out[key] = cf["fieldValue"]
    return out


def shape_opportunities(raw_opps, cfg, pos_by_id, sent_pos, accepted_pos,
                        field_map):
    """Normalise API records into the fields the brief math needs.

    Returns (shaped list, excluded_test_count).
    """
    margin = float(cfg.get("margin_assumption", 0.30))
    exclude_re = None
    if cfg.get("exclude_name_regex"):
        exclude_re = re.compile(cfg["exclude_name_regex"])
    net_key = cfg.get("net_profit_field_key")
    subcost_key = cfg.get("sub_cost_field_key")
    sent_at_key = cfg.get("quote_sent_at_field_key")

    shaped, excluded = [], 0
    for o in raw_opps:
        name = o.get("name") or "(unnamed)"
        if exclude_re and exclude_re.search(name):
            excluded += 1
            continue
        cfv = custom_field_values(o, field_map)
        value = float(o.get("monetaryValue") or 0)
        status = (o.get("status") or "open").lower()
        pos = pos_by_id.get(o.get("pipelineStageId"), 0)
        created = parse_dt(o.get("createdAt"))
        last_stage_change = parse_dt(o.get("lastStageChangeAt"))
        last_status_change = parse_dt(o.get("lastStatusChangeAt"))

        # --- when was the quote SENT? Prefer the explicit custom field,
        # else approximate: currently at/past the Quote Sent stage -> use
        # lastStageChangeAt (the best signal the API exposes).
        sent = None
        if sent_at_key and cfv.get(sent_at_key):
            sent = parse_dt(str(cfv[sent_at_key]))
        if sent is None and pos >= sent_pos:
            sent = last_stage_change
        # --- when was it ACCEPTED? At/past Quote Accepted stage, or won.
        accepted = None
        if pos >= accepted_pos:
            accepted = last_stage_change
        elif status == "won":
            accepted = last_status_change or last_stage_change
        if accepted is not None and sent is None:
            sent = accepted  # accepted implies it was sent

        # --- net value: real profit field if populated, else sub-cost field,
        # else margin_assumption estimate.
        net, net_est = None, True
        if net_key and isinstance(cfv.get(net_key), (int, float)) \
                and cfv[net_key] > 0:
            net, net_est = float(cfv[net_key]), False
        elif subcost_key and isinstance(cfv.get(subcost_key), (int, float)) \
                and cfv[subcost_key] > 0:
            net, net_est = value - float(cfv[subcost_key]), False
        if net is None:
            net = value * margin
        shaped.append({
            "id": o.get("id"),
            "name": name,
            "contact_id": o.get("contactId"),
            "value": value,
            "net": net,
            "net_est": net_est,
            "status": status,
            "pos": pos,
            "stage_id": o.get("pipelineStageId"),
            "created": created,
            "sent": sent,
            "accepted": accepted,
            "last_stage_change": last_stage_change,
        })
    return shaped, excluded


# ---------------------------------------------------------------- metrics

def in_window(dt, start, end):
    return dt is not None and start <= dt < end


def window_metrics(opps, start, end, first_created_by_contact):
    requested = [o for o in opps if in_window(o["created"], start, end)]
    sent = [o for o in opps if in_window(o["sent"], start, end)]
    accepted = [o for o in opps if in_window(o["accepted"], start, end)]
    revenue = sum(o["value"] for o in accepted)
    net = sum(o["net"] for o in accepted)
    net_estimated = any(o["net_est"] for o in accepted)
    margin_pct = (net / revenue * 100.0) if revenue > 0 else None
    repeat = 0
    for o in requested:
        first = first_created_by_contact.get(o["contact_id"])
        if first and o["created"] and first < o["created"]:
            repeat += 1
    return {
        "requested": len(requested),
        "sent": len(sent),
        "accepted": len(accepted),
        "revenue": revenue,
        "net": net,
        "net_estimated": net_estimated,
        "margin_pct": margin_pct,
        "repeat": repeat,
    }


def compute(opps, cfg):
    """All the numbers the brief needs, as one dict."""
    now = datetime.datetime.now().astimezone()
    today0 = now.replace(hour=0, minute=0, second=0, microsecond=0)
    this_monday = today0 - datetime.timedelta(days=today0.weekday())
    week_end = this_monday            # brief covers the last FULL week
    week_start = week_end - datetime.timedelta(days=7)

    # first opportunity per contact (for repeat-customer detection)
    first_created = {}
    for o in opps:
        cid, created = o["contact_id"], o["created"]
        if cid and created and (cid not in first_created
                                or created < first_created[cid]):
            first_created[cid] = created

    current = window_metrics(opps, week_start, week_end, first_created)

    baseline_weeks = int(cfg.get("baseline_weeks", 4))
    baselines = []
    for i in range(1, baseline_weeks + 1):
        s = week_start - datetime.timedelta(days=7 * i)
        baselines.append(window_metrics(
            opps, s, s + datetime.timedelta(days=7), first_created))

    def base_avg(key):
        return sum(b[key] for b in baselines) / float(len(baselines)) \
            if baselines else 0.0

    base_rev = sum(b["revenue"] for b in baselines)
    base_net = sum(b["net"] for b in baselines)
    baseline = {
        "requested": base_avg("requested"),
        "sent": base_avg("sent"),
        "accepted": base_avg("accepted"),
        "revenue": base_avg("revenue"),
        "net": base_avg("net"),
        "repeat": base_avg("repeat"),
        "margin_pct": (base_net / base_rev * 100.0) if base_rev > 0 else None,
        "sent_total": sum(b["sent"] for b in baselines),
        "accepted_total": sum(b["accepted"] for b in baselines),
    }

    trend_weeks = int(cfg.get("trend_weeks", 4))
    trend = []
    for i in range(trend_weeks - 1, -1, -1):
        s = week_start - datetime.timedelta(days=7 * i)
        e = s + datetime.timedelta(days=7)
        m = window_metrics(opps, s, e, first_created)
        trend.append((s, e, m))

    # open = not yet accepted, still winnable
    open_opps = [o for o in opps
                 if o["status"] == "open" and o["accepted"] is None]
    top_jobs = sorted(open_opps, key=lambda o: -o["value"])
    top_jobs = top_jobs[:int(cfg.get("top_jobs", 5))]

    return {
        "now": now,
        "week_start": week_start,
        "week_end": week_end,
        "current": current,
        "baseline": baseline,
        "trend": trend,
        "open_opps": open_opps,
        "top_jobs": top_jobs,
    }


# ---------------------------------------------------------------- formatting

def money(v):
    return "$%s" % format(int(round(v)), ",")


def fmt_range(start, end):
    """[Mon 00:00, next Mon 00:00) -> '29 Jun – 5 Jul 2026'."""
    last_day = end - datetime.timedelta(days=1)
    if start.month == last_day.month:
        return "%d–%d %s %d" % (start.day, last_day.day,
                                     last_day.strftime("%b"), last_day.year)
    return "%d %s – %d %s %d" % (start.day, start.strftime("%b"),
                                      last_day.day, last_day.strftime("%b"),
                                      last_day.year)


def fmt_delta(cur, base):
    """'(+25% WoW)' vs prior-4-week average; graceful when the base is 0."""
    if base > 0:
        pct = (cur - base) / base * 100.0
        arrow = "+" if pct >= 0 else "−"
        return "(%s%.0f%% WoW)" % (arrow, abs(pct))
    if cur > 0:
        return "(new — prior 4-wk avg was 0)"
    return "(—)"


def fmt_margin_delta(cur, base):
    if cur is None:
        return ""
    if base is None:
        return "(—)"
    diff = cur - base
    arrow = "+" if diff >= 0 else "−"
    return "(%s%.1fpp WoW)" % (arrow, abs(diff))


def short_name(opp_name, limit=46):
    """Opportunity names are 'Customer Name - Full Street Address'; keep the
    customer plus a hint of the suburb so the line stays scannable."""
    name = re.sub(r"\s+", " ", opp_name).strip()
    parts = [p.strip() for p in name.split(" - ") if p.strip()]
    if len(parts) >= 2:
        m = re.search(r"([A-Za-z' ]+?)\s+(NSW|QLD|VIC|ACT|SA|WA|NT|TAS)\b",
                      parts[-1])
        name = parts[0] + (" (%s)" % m.group(1).strip() if m else "")
    return name if len(name) <= limit else name[:limit - 1] + "…"


def days_ago(dt, now):
    if dt is None:
        return None
    return max(0, int((now - dt).total_seconds() // 86400))


# ---------------------------------------------------------------- insights

def build_insights(res, opps, cfg, stages, sent_pos, accepted_pos):
    now = res["now"]
    cur, base = res["current"], res["baseline"]
    insights = []

    # 1. acceptance-rate move (current week vs prior-4-week aggregate)
    if cur["sent"] > 0 and base["sent_total"] > 0:
        cur_rate = cur["accepted"] / float(cur["sent"]) * 100.0
        base_rate = (base["accepted_total"] / float(base["sent_total"])
                     * 100.0)
        if cur_rate <= base_rate - 10:
            insights.append(
                "Acceptance rate fell to %.0f%% (was %.0f%% over the prior "
                "4 weeks) — review quote pricing/follow-up." %
                (cur_rate, base_rate))
        elif cur_rate >= base_rate + 10:
            insights.append(
                "Acceptance rate rose to %.0f%% (was %.0f%%) — whatever "
                "changed, keep doing it." % (cur_rate, base_rate))

    # 2. quotes going quiet
    sent_dates = [o["sent"] for o in opps if o["sent"]]
    waiting = [o for o in res["open_opps"] if o["pos"] < sent_pos]
    no_sent_days = int(cfg.get("no_sent_alert_days", 3))
    if not sent_dates:
        if waiting:
            insights.append(
                "No quotes have ever been sent — %d open request%s "
                "waiting in the pipeline." %
                (len(waiting), "" if len(waiting) == 1 else "s"))
    else:
        gap = days_ago(max(sent_dates), now)
        if gap is not None and gap >= no_sent_days:
            insights.append("No quotes sent in %d days." % gap)

    # 3. largest open opportunity
    open_by_value = [o for o in res["open_opps"] if o["value"] > 0]
    if open_by_value:
        big = max(open_by_value, key=lambda o: o["value"])
        stage_name = stages[big["pos"]].get("name", "?") \
            if big["pos"] < len(stages) else "?"
        age = days_ago(big["last_stage_change"], now)
        insights.append(
            "%s (%s) is the largest open opportunity — follow up "
            "(%s in “%s”)." %
            (short_name(big["name"]), money(big["value"]),
             ("%dd" % age) if age is not None else "?", stage_name))

    # 4. stale pre-quote requests
    stale_days = int(cfg.get("stale_quote_days", 7))
    stale = [o for o in waiting
             if days_ago(o["created"], now) is not None
             and days_ago(o["created"], now) >= stale_days]
    if stale:
        oldest = max(days_ago(o["created"], now) for o in stale)
        insights.append(
            "%d quote request%s waited %d+ days without a quote being "
            "sent (oldest: %dd)." %
            (len(stale), " has" if len(stale) == 1 else "s have",
             stale_days, oldest))

    # 5. new-request flow
    created_dates = [o["created"] for o in opps if o["created"]]
    no_req_days = int(cfg.get("no_request_alert_days", 3))
    if created_dates:
        gap = days_ago(max(created_dates), now)
        if gap is not None and gap >= no_req_days:
            insights.append(
                "No new quote requests in %d days — check the website "
                "form and ad spend." % gap)
    if base["requested"] > 0:
        change = ((cur["requested"] - base["requested"])
                  / base["requested"] * 100.0)
        if change <= -30:
            insights.append(
                "Quote requests down %.0f%% vs the prior 4-week average." %
                abs(change))
        elif change >= 30:
            insights.append(
                "Quote requests up %.0f%% vs the prior 4-week average." %
                change)

    # 6. revenue swing
    if base["revenue"] > 0:
        change = (cur["revenue"] - base["revenue"]) / base["revenue"] * 100.0
        if change <= -20:
            insights.append("Revenue down %.0f%% vs the prior 4-week "
                            "average." % abs(change))
        elif change >= 20:
            insights.append("Revenue up %.0f%% vs the prior 4-week "
                            "average." % change)

    if not insights:
        insights.append("Steady week — nothing unusual to flag.")
    return insights


# ---------------------------------------------------------------- the brief

def build_brief(res, opps, cfg, stages, sent_pos, accepted_pos,
                excluded, field_map_ok):
    cur, base = res["current"], res["baseline"]
    now = res["now"]
    lines = []
    lines.append("\U0001F4CA *CEO Brief — %s*"
                 % fmt_range(res["week_start"], res["week_end"]))
    lines.append("Timeless Resurfacing · %s pipeline · vs prior "
                 "%d-week avg" % (cfg.get("pipeline_name", "Sales"),
                                  int(cfg.get("baseline_weeks", 4))))
    lines.append("")

    net_label = "Net Value" if not cur["net_estimated"] and cur["accepted"] \
        else "Net Value (est)"
    if cur["accepted"] == 0:
        net_label = "Net Value (est)"
    margin_str = ("%.0f%%" % cur["margin_pct"]) \
        if cur["margin_pct"] is not None else "—"
    lines.append("*Sales Performance*")
    lines.append("• Quotes Requested: %d %s"
                 % (cur["requested"], fmt_delta(cur["requested"],
                                                base["requested"])))
    lines.append("• Quotes Sent: %d %s"
                 % (cur["sent"], fmt_delta(cur["sent"], base["sent"])))
    lines.append("• Quotes Accepted: %d %s"
                 % (cur["accepted"], fmt_delta(cur["accepted"],
                                               base["accepted"])))
    lines.append("• Revenue: %s %s"
                 % (money(cur["revenue"]), fmt_delta(cur["revenue"],
                                                     base["revenue"])))
    lines.append("• %s: %s %s"
                 % (net_label, money(cur["net"]),
                    fmt_delta(cur["net"], base["net"])))
    lines.append("• Margin %%: %s %s"
                 % (margin_str,
                    fmt_margin_delta(cur["margin_pct"], base["margin_pct"])))
    lines.append("• Repeat Customers: %d %s"
                 % (cur["repeat"], fmt_delta(cur["repeat"], base["repeat"])))
    lines.append("")

    lines.append("*Weekly Trend* (last %d weeks)" % len(res["trend"]))
    for s, e, m in res["trend"]:
        marker = "  ← this brief" if s == res["week_start"] else ""
        lines.append("• %s: %s revenue · %d requested, %d sent, "
                     "%d accepted%s"
                     % (fmt_range(s, e), money(m["revenue"]), m["requested"],
                        m["sent"], m["accepted"], marker))
    lines.append("")

    lines.append("*Top Jobs* (open pipeline, by value)")
    if res["top_jobs"]:
        for i, o in enumerate(res["top_jobs"], 1):
            stage_name = stages[o["pos"]].get("name", "?") \
                if o["pos"] < len(stages) else "?"
            age = days_ago(o["last_stage_change"], now)
            lines.append("%d. %s — %s · %s (%s)"
                         % (i, short_name(o["name"]), money(o["value"]),
                            stage_name,
                            ("%dd" % age) if age is not None else "?"))
    else:
        lines.append("• No open opportunities in the pipeline.")
    lines.append("")

    lines.append("*Insights*")
    for i, text in enumerate(
            build_insights(res, opps, cfg, stages, sent_pos, accepted_pos),
            1):
        lines.append("%d. %s" % (i, text))

    footnotes = []
    if excluded:
        footnotes.append("%d test record%s excluded"
                         % (excluded, "" if excluded == 1 else "s"))
    if cur["net_estimated"] or cur["accepted"] == 0:
        footnotes.append("net est. at %.0f%% margin assumption"
                         % (float(cfg.get("margin_assumption", 0.30)) * 100))
    if not field_map_ok:
        footnotes.append("custom fields unavailable (token scope) — "
                         "sent-dates approximated from stage changes")
    if footnotes:
        lines.append("")
        lines.append("_%s_" % " · ".join(footnotes))
    return "\n".join(lines)


# ---------------------------------------------------------------- Slack

def post_to_slack(webhook_url, text):
    resp = http_json(webhook_url, {"User-Agent": USER_AGENT,
                                   "Accept": "*/*"},
                     payload={"text": text})
    if isinstance(resp, str) and resp.strip().lower() != "ok":
        raise BriefError("Slack webhook answered %r (expected 'ok')"
                         % resp[:120])


# ---------------------------------------------------------------- main

def run(mode):
    cfg = load_config()
    pit = load_pit(cfg)
    stages, pos_by_id, sent_pos, accepted_pos = fetch_stages(cfg, pit)
    raw = fetch_opportunities(cfg, pit)
    field_map, field_map_ok = fetch_field_map(cfg, pit)
    opps, excluded = shape_opportunities(raw, cfg, pos_by_id, sent_pos,
                                         accepted_pos, field_map)
    res = compute(opps, cfg)
    brief = build_brief(res, opps, cfg, stages, sent_pos, accepted_pos,
                        excluded, field_map_ok)

    if mode == "stdout":
        print(brief)
        return 0

    if mode == "cockpit":
        # Write the brief as a cockpit card (localhost:4317 renders every .md
        # in cockpit/data/config/) so Monday's numbers appear with no Slack
        # required; Slack becomes a bonus channel when the webhook exists.
        now = res["now"]
        card = ("Last updated: %s\n\n" % now.strftime("%Y-%m-%d")) + brief + "\n"
        os.makedirs(os.path.dirname(COCKPIT_CARD), exist_ok=True)
        with open(COCKPIT_CARD, "w") as fh:
            fh.write(card)
        print("CEO brief written to the cockpit card.")
        webhook, _src = find_slack_webhook(cfg)
        if webhook:
            try:
                post_to_slack(webhook, brief)
                print("(also posted to Slack)")
            except Exception as exc:  # noqa: BLE001 — Slack is the bonus channel
                print("(Slack post failed: %s)" % exc, file=sys.stderr)
        return 0

    webhook, source = find_slack_webhook(cfg)
    if mode == "dry-run":
        print(brief)
        print()
        print("-" * 60)
        if webhook:
            print("DRY RUN — would post the brief above to Slack via %s"
                  % source)
        else:
            print("DRY RUN — could NOT post: %s" % source)
        return 0

    # mode == "slack"
    if not webhook:
        raise BriefError("cannot post to Slack: %s" % source)
    post_to_slack(webhook, brief)
    print("Posted CEO Brief to Slack (%s)." % source)
    return 0


def main(argv=None):
    parser = argparse.ArgumentParser(
        description="Monday CEO Brief — GHL Sales pipeline numbers to "
                    "Slack (Surface Care flagship-agent replica).")
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--stdout", action="store_true",
                       help="print the brief to the terminal (default)")
    group.add_argument("--dry-run", action="store_true",
                       help="fetch + compute, show what WOULD post and where")
    group.add_argument("--slack", action="store_true",
                       help="post the brief to Slack")
    group.add_argument("--cockpit", action="store_true",
                       help="write the brief as a cockpit card + Slack when "
                            "available — the fully-automatic mode launchd runs")
    args = parser.parse_args(argv)
    mode = ("cockpit" if args.cockpit
            else "slack" if args.slack
            else "dry-run" if args.dry_run else "stdout")

    try:
        return run(mode)
    except BriefError as exc:
        sys.stderr.write("CEO Brief failed: %s\n" % exc)
        if mode == "slack":
            # never let silence look like success — try to tell Slack too
            try:
                cfg = load_config()
                webhook, _ = find_slack_webhook(cfg)
                if webhook:
                    post_to_slack(webhook,
                                  "⚠️ CEO Brief failed: %s" % exc)
                    sys.stderr.write("(failure note posted to Slack)\n")
            except Exception as exc2:  # noqa: BLE001 — best-effort only
                sys.stderr.write("(could not post failure note to Slack: %s)\n"
                                 % exc2)
        return 1


if __name__ == "__main__":
    sys.exit(main())
