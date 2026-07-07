#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Pipeline Watchdog — Timeless Resurfacing.

Agent #2 of the Surface Care fleet replication: Jordan's "Quote Integrity
Analyst" merged with their 60-second speed-to-lead ethos into one guardian.
Jordan runs his integrity check once a day at 6am; ours runs every 30 minutes
in business hours because speed-to-lead IS the business.

Unlike the CEO Brief (a report), the watchdog produces ALERTS — it is silent
when the pipeline is clean. Five checks, thresholds in config.json:

  1. Speed-to-lead breach   — new lead sitting untouched in the first stage
  2. 24-hour promise breach — quote not sent within the promised 24h
  3. Follow-up due          — Quote Sent going quiet (countdown SMS / expiry)
  4. Duplicate detection    — same phone/email/address/contact on 2+ cards
  5. Stale card hygiene     — open card with no movement for 20+ days

Modes:
    python3 watchdog.py --stdout      # print alerts to the terminal (default)
    python3 watchdog.py --json        # machine-readable (for the cockpit)
    python3 watchdog.py --slack       # post the alert batch to Slack
    python3 watchdog.py --slack --scheduled   # what launchd runs (adds the
                                              # 07:00-19:00 window check)

Stdlib only (urllib/json/datetime) — no pip installs, runs on system python3.
Secrets are NEVER in this file or config.json: the GHL PIT and the Slack
webhook URL are read from files under .secrets/ (paths in config.json), with
SLACK_WEBHOOK_URL env var as a fallback for the webhook.

Read-only against GHL: only GET requests are ever made to the API.
A run that fails prints "Watchdog failed: <reason>" loudly (and posts it to
Slack in --slack mode) — silence must never look like health.
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
API_BASE = "https://services.leadconnectorhq.com"
API_VERSION = "2021-07-28"
# GHL sits behind Cloudflare, which rejects the default "Python-urllib/3.x"
# user agent with error 1010 ("browser signature banned"). A normal browser
# UA string is required — verified live 2026-07-07 (ceo-brief agent).
USER_AGENT = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
              "AppleWebKit/537.36 (KHTML, like Gecko) "
              "Chrome/126.0.0.0 Safari/537.36")
MAX_PAGES = 50  # hard safety cap on pagination

SEVERITY_RANK = {"critical": 0, "warn": 1, "info": 2}


class WatchdogError(Exception):
    """Readable, user-facing failure (bad token, API down, config broken)."""


# ---------------------------------------------------------------- config / secrets

def load_config():
    path = os.path.join(SCRIPT_DIR, "config.json")
    try:
        with open(path, "r") as fh:
            return json.load(fh)
    except (OSError, ValueError) as exc:
        raise WatchdogError("cannot read config.json (%s): %s" % (path, exc))


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
        raise WatchdogError(
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
    return None, ("no webhook found — create %s containing the "
                  "incoming-webhook URL, or set SLACK_WEBHOOK_URL" % path)


# ---------------------------------------------------------------- HTTP

def http_json(url, headers, payload=None, attempts=3):
    """GET (or POST if payload) a URL, return parsed JSON / raw text.

    Retries transient failures (5xx, 429, network) with backoff. Raises
    WatchdogError with a readable message otherwise.
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
                raise WatchdogError(
                    "GHL rejected the token (HTTP 401) — the PIT has likely "
                    "been rotated or expired. Update .secrets/ghl-pit.key.")
            if exc.code == 403 and "cloudflare" in body.lower():
                raise WatchdogError(
                    "Cloudflare blocked the request (403/1010 browser "
                    "signature). The script already sends a browser "
                    "User-Agent; Cloudflare rules may have changed. "
                    "Body: %s" % body)
            raise WatchdogError("HTTP %s from %s — %s" % (exc.code, url, body))
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
    raise WatchdogError("network failure after %d attempts calling %s: %s"
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
    don't silently break the mapping. Position 0 is "the first stage" for the
    speed-to-lead check, whatever it is currently named.
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
        raise WatchdogError("pipeline id %s not found in location %s "
                            "(check config.json)" %
                            (cfg["pipeline_id"], cfg["location_id"]))
    stages = sorted(pipe.get("stages", []),
                    key=lambda s: s.get("position", 0))
    if not stages:
        raise WatchdogError("pipeline %r has no stages" % pipe.get("name"))
    pos_by_id = {s["id"]: i for i, s in enumerate(stages)}

    def find_stage(name):
        want = name.strip().lower()
        for i, s in enumerate(stages):
            if s.get("name", "").strip().lower() == want:
                return i
        for i, s in enumerate(stages):  # fallback: substring match
            if want in s.get("name", "").strip().lower():
                return i
        raise WatchdogError(
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

    Non-fatal: if the PIT lacks the customFields scope, quote-sent dates are
    approximated from lastStageChangeAt instead.
    """
    try:
        data = ghl_get("/locations/%s/customFields" % cfg["location_id"],
                       pit, {"model": "opportunity"})
    except WatchdogError:
        return {}
    fields = data.get("customFields", []) if isinstance(data, dict) else []
    return {f["id"]: f.get("fieldKey", "") for f in fields if f.get("id")}


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


def normalise_phone(raw):
    """Digits-only, compared on the trailing 9 digits so '+61 400 111 222'
    and '0400 111 222' collide. None when there aren't enough digits."""
    if not raw:
        return None
    digits = re.sub(r"\D", "", str(raw))
    if len(digits) < 8:
        return None
    return digits[-9:]


def normalise_email(raw):
    if not raw or "@" not in str(raw):
        return None
    return str(raw).strip().lower() or None


_ADDR_ABBREV = {
    "st": "street", "rd": "road", "ave": "avenue", "av": "avenue",
    "dr": "drive", "hwy": "highway", "pde": "parade", "cres": "crescent",
    "cr": "crescent", "ct": "court", "pl": "place", "ln": "lane",
    "blvd": "boulevard", "tce": "terrace", "cct": "circuit",
    "esp": "esplanade", "gr": "grove", "cl": "close",
}
_ADDR_STATES = {"nsw", "qld", "vic", "act", "sa", "wa", "nt", "tas",
                "australia"}


def normalise_address(opp_name):
    """Opportunity names follow 'Customer Name - Full Street Address'.

    Returns a normalised address key ('2/12 smith street bondi') or None when
    the name carries no usable address. Street-type abbreviations are
    expanded, state + postcode dropped, and the key must start with a street
    number so bare suburbs can't collide.
    """
    parts = [p.strip() for p in str(opp_name).split(" - ") if p.strip()]
    if len(parts) < 2:
        return None
    addr = " ".join(parts[1:]).lower()
    addr = re.sub(r"[^\w\s/]", " ", addr)  # keep unit slashes (2/12 ...)
    tokens = []
    for tok in addr.split():
        if tok in _ADDR_STATES:
            continue
        if tokens and re.fullmatch(r"\d{4}", tok):
            continue  # postcode (never the leading street number)
        tokens.append(_ADDR_ABBREV.get(tok, tok))
    key = " ".join(tokens)
    if len(key) < 8 or not re.match(r"\d", key):
        return None
    return key


def shape_opportunities(raw_opps, cfg, pos_by_id, field_map):
    """Normalise API records into the fields the checks need.

    Returns (shaped list, excluded_test_count). Test records (Clifford/Allan/
    Marko self-tests etc.) are dropped via exclude_name_regex.
    """
    exclude_re = None
    if cfg.get("exclude_name_regex"):
        exclude_re = re.compile(cfg["exclude_name_regex"])
    sent_at_key = cfg.get("quote_sent_at_field_key")

    shaped, excluded = [], 0
    for o in raw_opps:
        name = o.get("name") or "(unnamed)"
        if exclude_re and exclude_re.search(name):
            excluded += 1
            continue
        contact = o.get("contact") or {}
        cfv = custom_field_values(o, field_map)
        created = parse_dt(o.get("createdAt"))
        last_stage_change = parse_dt(o.get("lastStageChangeAt"))
        last_status_change = parse_dt(o.get("lastStatusChangeAt"))
        sent = None
        if sent_at_key and cfv.get(sent_at_key):
            sent = parse_dt(str(cfv[sent_at_key]))
        shaped.append({
            "id": o.get("id"),
            "name": name,
            "contact_id": o.get("contactId") or contact.get("id"),
            "phone": contact.get("phone"),
            "email": contact.get("email"),
            "value": float(o.get("monetaryValue") or 0),
            "status": (o.get("status") or "open").lower(),
            "pos": pos_by_id.get(o.get("pipelineStageId"), 0),
            "created": created,
            "last_stage_change": last_stage_change,
            "last_status_change": last_status_change,
            "sent": sent,  # explicit quote_sent_at custom field only
        })
    return shaped, excluded


# ---------------------------------------------------------------- formatting

def money(v):
    return "$%s" % format(int(round(v)), ",")


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


def fmt_phone(raw):
    """'+61400111222' -> '0400 111 222'; anything unrecognised passes through."""
    if not raw:
        return ""
    digits = re.sub(r"\D", "", str(raw))
    if digits.startswith("61") and len(digits) == 11:
        digits = "0" + digits[2:]
    if len(digits) == 10 and digits.startswith("0"):
        return "%s %s %s" % (digits[:4], digits[4:7], digits[7:])
    return str(raw)


def fmt_minutes(td):
    """Short age for the speed-to-lead headline: '23 min', then '3h'."""
    m = int(td.total_seconds() // 60)
    if m < 120:
        return "%d min" % m
    return "%dh" % (m // 60)


def fmt_hours_or_days(td):
    h = int(td.total_seconds() // 3600)
    if h < 48:
        return "%dh" % h
    return "%dd" % (h // 24)


def age_days(dt, now):
    if dt is None:
        return None
    return (now - dt).total_seconds() / 86400.0


def stage_name(stages, pos):
    if 0 <= pos < len(stages):
        return stages[pos].get("name", "?")
    return "?"


# ---------------------------------------------------------------- checks
#
# Ownership ladder — each OPEN card gets at most one age-based alert:
#   pos == first stage, 15min ≤ age < 20h            -> 1. speed-to-lead
#   pos  < Quote Sent,  20h  ≤ age < 24h             -> 2. quote due (warn)
#   pos  < Quote Sent,  24h  ≤ age, < 20d untouched  -> 2. promise BROKEN
#   Quote Sent band,    5d ≤ quiet < 8d              -> 3. countdown nudge
#   Quote Sent band,    8d ≤ quiet < 20d             -> 3. expiry / win-back
#   any open card,      untouched ≥ 20d              -> 5. stale hygiene
# Duplicates (4) are orthogonal and can stack with any of the above.


def check_speed_to_lead(cards, cfg, now, alerts):
    """New lead untouched in the first stage — the 60-second rule."""
    thr = datetime.timedelta(
        minutes=float(cfg.get("speed_to_lead_minutes", 15)))
    max_age = datetime.timedelta(
        hours=float(cfg.get("speed_to_lead_max_age_hours", 24)))
    warn_h = datetime.timedelta(
        hours=float(cfg.get("quote_promise_warn_hours", 20)))
    for c in cards:
        if c["status"] != "open" or c["pos"] != 0 or c["created"] is None:
            continue
        age = now - c["created"]
        if age < thr or age >= max_age:
            continue  # too fresh, or old enough to be check 2's problem
        if age >= warn_h:
            continue  # the 24h-promise check owns it from 20h on
        phone = fmt_phone(c["phone"])
        alerts.append({
            "check": "speed_to_lead",
            "severity": "critical",
            "opportunity_ids": [c["id"]],
            "name": short_name(c["name"]),
            "age_minutes": int(age.total_seconds() // 60),
            "message": "\U0001F6A8 NEW LEAD UNTOUCHED %s: %s%s — call NOW "
                       "(60-second rule)"
                       % (fmt_minutes(age), short_name(c["name"]),
                          (" " + phone) if phone else ""),
        })


def check_quote_promise(cards, cfg, now, sent_pos, alerts):
    """Every request is promised a quote within 24h. Warn at 20h, breach at 24h."""
    warn_h = float(cfg.get("quote_promise_warn_hours", 20))
    breach_h = float(cfg.get("quote_promise_breach_hours", 24))
    stale_d = float(cfg.get("stale_days", 20))
    for c in cards:
        if c["status"] != "open" or c["pos"] >= sent_pos \
                or c["created"] is None:
            continue
        age = now - c["created"]
        hours = age.total_seconds() / 3600.0
        if hours < warn_h:
            continue
        if hours >= breach_h:
            untouched = age_days(c["last_stage_change"] or c["created"], now)
            if untouched is not None and untouched >= stale_d:
                continue  # dead card — stale hygiene owns it now
            overdue = age - datetime.timedelta(hours=breach_h)
            alerts.append({
                "check": "quote_promise",
                "severity": "critical",
                "opportunity_ids": [c["id"]],
                "name": short_name(c["name"]),
                "age_hours": round(hours, 1),
                "message": "⏰ 24H PROMISE BROKEN: %s — requested %s "
                           "ago, quote %s overdue — send it today"
                           % (short_name(c["name"]), fmt_hours_or_days(age),
                              fmt_hours_or_days(overdue)),
            })
        else:
            remaining = int(breach_h - hours) or 1
            alerts.append({
                "check": "quote_promise",
                "severity": "warn",
                "opportunity_ids": [c["id"]],
                "name": short_name(c["name"]),
                "age_hours": round(hours, 1),
                "message": "⏰ QUOTE DUE: %s — requested %dh ago, "
                           "24h promise breaks in %dh"
                           % (short_name(c["name"]), int(hours), remaining),
            })


def check_followup_due(cards, cfg, now, sent_pos, accepted_pos, alerts):
    """Quote Sent going quiet: countdown SMS at 5d, expiry/win-back at 8d
    (7-day quote validity — Allan decision 2026-07-07)."""
    nudge_d = float(cfg.get("followup_nudge_days", 5))
    expiry_d = float(cfg.get("followup_expiry_days", 8))
    stale_d = float(cfg.get("stale_days", 20))
    validity = int(cfg.get("quote_validity_days", 7))
    for c in cards:
        if c["status"] != "open" or not (sent_pos <= c["pos"] < accepted_pos):
            continue
        moved = c["last_stage_change"] or c["created"]
        quiet = age_days(moved, now)  # days with no stage movement
        if quiet is None or quiet < nudge_d:
            continue
        sent_dt = c["sent"] or moved  # custom field wins when populated
        sent_days = age_days(sent_dt, now) or quiet
        if quiet >= stale_d:
            continue  # stale hygiene owns it now
        if quiet >= expiry_d:
            alerts.append({
                "check": "followup_due",
                "severity": "warn",
                "opportunity_ids": [c["id"]],
                "name": short_name(c["name"]),
                "age_days": round(quiet, 1),
                "message": "\U0001F4E8 QUOTE EXPIRED: %s — sent %dd ago, "
                           "%d-day validity lapsed — send the expiry / "
                           "win-back SMS"
                           % (short_name(c["name"]), int(sent_days),
                              validity),
            })
        else:
            remaining = validity - int(sent_days)
            countdown = ("expires in %dd" % remaining) if remaining > 0 \
                else "expires TODAY"
            alerts.append({
                "check": "followup_due",
                "severity": "warn",
                "opportunity_ids": [c["id"]],
                "name": short_name(c["name"]),
                "age_days": round(quiet, 1),
                "message": "\U0001F4E8 FOLLOW-UP DUE: %s — quote sent %dd "
                           "ago, no movement since — send the countdown SMS "
                           "(quote %s)"
                           % (short_name(c["name"]), int(sent_days),
                              countdown),
            })


def check_duplicates(cards, cfg, now, alerts):
    """Jordan's quote-integrity core: two non-lost cards sharing a phone,
    email, normalised street address, or contact. At least one of the group
    must still be open (won + open = repeat customer / pricing check;
    two closed cards are history, not a problem)."""
    live = [c for c in cards if c["status"] not in ("lost", "abandoned")]
    keyed = {}  # (kind, key) -> [cards]
    for c in live:
        for kind, key in (
                ("phone", normalise_phone(c["phone"])),
                ("email", normalise_email(c["email"])),
                ("address", normalise_address(c["name"])),
                ("contact", c["contact_id"])):
            if key:
                keyed.setdefault((kind, key), []).append(c)

    seen_groups = {}  # frozenset(ids) -> set of kinds (dedupe overlapping keys)
    for (kind, _key), group in sorted(keyed.items()):
        ids = frozenset(c["id"] for c in group)
        if len(ids) < 2:
            continue
        if not any(c["status"] == "open" for c in group):
            continue
        seen_groups.setdefault(ids, {"cards": group, "kinds": []})
        if kind not in seen_groups[ids]["kinds"]:
            seen_groups[ids]["kinds"].append(kind)

    for ids, info in sorted(seen_groups.items(),
                            key=lambda kv: sorted(kv[0])):
        group = {c["id"]: c for c in info["cards"]}.values()
        group = sorted(group, key=lambda c: c["created"] or now)
        names = [short_name(c["name"], 30) for c in group[:3]]
        extra = len(group) - 3
        if extra > 0:
            names.append("+%d more" % extra)
        open_n = sum(1 for c in group if c["status"] == "open")
        statuses = "%d open" % open_n
        if open_n < len(group):
            statuses += " + %d %s" % (
                len(group) - open_n,
                "/".join(sorted({c["status"] for c in group
                                 if c["status"] != "open"})))
        alerts.append({
            "check": "duplicate",
            "severity": "warn",
            "opportunity_ids": sorted(ids),
            "name": names[0],
            "shared": info["kinds"],
            "message": "\U0001F465 DUPLICATE: same %s on %d cards (%s) — "
                       "%s — check pricing consistency"
                       % ("+".join(info["kinds"]), len(group), statuses,
                          " & ".join(names)),
        })


def check_stale(cards, cfg, now, stages, alerts):
    """Any open card with no stage/status movement for 20+ days — the
    pipeline should reflect reality: complete it or close it."""
    stale_d = float(cfg.get("stale_days", 20))
    for c in cards:
        if c["status"] != "open":
            continue
        touches = [d for d in (c["created"], c["last_stage_change"],
                               c["last_status_change"]) if d]
        if not touches:
            continue
        quiet = age_days(max(touches), now)
        if quiet is None or quiet < stale_d:
            continue
        val = " %s ·" % money(c["value"]) if c["value"] else ""
        alerts.append({
            "check": "stale",
            "severity": "info",
            "opportunity_ids": [c["id"]],
            "name": short_name(c["name"]),
            "age_days": round(quiet, 1),
            "message": "\U0001F9F9 STALE %dd: %s —%s sitting in “%s” "
                       "— complete or close"
                       % (int(quiet), short_name(c["name"]), val,
                          stage_name(stages, c["pos"])),
        })


def run_checks(cards, cfg, stages, sent_pos, accepted_pos, now):
    alerts = []
    check_speed_to_lead(cards, cfg, now, alerts)
    check_quote_promise(cards, cfg, now, sent_pos, alerts)
    check_followup_due(cards, cfg, now, sent_pos, accepted_pos, alerts)
    check_duplicates(cards, cfg, now, alerts)
    check_stale(cards, cfg, now, stages, alerts)
    alerts.sort(key=lambda a: SEVERITY_RANK.get(a["severity"], 9))
    return alerts


# ---------------------------------------------------------------- output

CLEAN_LINE = "✅ Pipeline clean — no alerts"


def batch_text(alerts, now, excluded):
    counts = {}
    for a in alerts:
        counts[a["severity"]] = counts.get(a["severity"], 0) + 1
    summary = ", ".join("%d %s" % (counts[s], s)
                        for s in ("critical", "warn", "info") if s in counts)
    lines = ["\U0001F436 *Pipeline Watchdog* — %d alert%s (%s) · %s"
             % (len(alerts), "" if len(alerts) == 1 else "s", summary,
                now.strftime("%a %d %b %H:%M"))]
    for a in alerts:
        lines.append("• " + a["message"])
    if excluded:
        lines.append("_%d test record%s excluded_"
                     % (excluded, "" if excluded == 1 else "s"))
    return "\n".join(lines)


def post_to_slack(webhook_url, text):
    resp = http_json(webhook_url, {"User-Agent": USER_AGENT,
                                   "Accept": "*/*"},
                     payload={"text": text})
    if isinstance(resp, str) and resp.strip().lower() != "ok":
        raise WatchdogError("Slack webhook answered %r (expected 'ok')"
                            % resp[:120])


# ------------------------------------------------------- cockpit card

# The cockpit (localhost:4317) renders agent cards from ~/.timeless/cards/
# (a spool OUTSIDE ~/Downloads, because macOS TCC blocks launchd-run python
# from touching Downloads). Writing here makes the watchdog visible with ZERO
# extra services; Slack becomes a bonus channel the moment the webhook exists.
COCKPIT_CARD = os.path.join(os.path.expanduser("~"), ".timeless", "cards",
                            "watchdog-latest.md")


def write_cockpit_card(alerts, now, excluded, checked, error=None):
    lines = ["Last updated: %s" % now.strftime("%Y-%m-%d"), "",
             "# \U0001F436 Watchdog — %s" % now.strftime("%a %d %b %H:%M"), ""]
    if error is not None:
        lines.append("⚠️ **Watchdog FAILED:** %s" % error)
        lines.append("")
        lines.append("A failed run is never silent. Check the log: "
                     "~/Library/Logs/pipeline-watchdog.log")
    elif not alerts:
        lines.append(CLEAN_LINE + " (checked %d cards)" % checked)
    else:
        counts = {}
        for a in alerts:
            counts[a["severity"]] = counts.get(a["severity"], 0) + 1
        lines.append("**%d alert%s** (%s)"
                     % (len(alerts), "" if len(alerts) == 1 else "s",
                        ", ".join("%d %s" % (counts[s], s)
                                  for s in ("critical", "warn", "info")
                                  if s in counts)))
        lines.append("")
        for a in alerts:
            lines.append("- " + a["message"])
        if excluded:
            lines.append("")
            lines.append("_%d test record%s excluded_"
                         % (excluded, "" if excluded == 1 else "s"))
    os.makedirs(os.path.dirname(COCKPIT_CARD), exist_ok=True)
    with open(COCKPIT_CARD, "w") as fh:
        fh.write("\n".join(lines) + "\n")


# ---------------------------------------------------------------- main

def within_active_window(cfg, now):
    hours = cfg.get("active_hours", [7, 19])
    try:
        start, end = int(hours[0]), int(hours[1])
    except (TypeError, ValueError, IndexError):
        start, end = 7, 19
    return start <= now.hour < end


def run(mode, scheduled):
    cfg = load_config()
    now = datetime.datetime.now().astimezone()
    if scheduled and not within_active_window(cfg, now):
        # launchd fires every 30 min around the clock (StartInterval); the
        # code enforces the 07:00-19:00 business window. Logged so the run
        # itself is visible — a skip is never silent.
        print("Watchdog skipped — outside the %02d:00-%02d:00 active window "
              "(local time %s)"
              % (int(cfg.get("active_hours", [7, 19])[0]),
                 int(cfg.get("active_hours", [7, 19])[1]),
                 now.strftime("%H:%M")))
        return 0

    pit = load_pit(cfg)
    stages, pos_by_id, sent_pos, accepted_pos = fetch_stages(cfg, pit)
    raw = fetch_opportunities(cfg, pit)
    field_map = fetch_field_map(cfg, pit)
    cards, excluded = shape_opportunities(raw, cfg, pos_by_id, field_map)
    alerts = run_checks(cards, cfg, stages, sent_pos, accepted_pos, now)

    if mode == "json":
        counts = {}
        for a in alerts:
            counts[a["severity"]] = counts.get(a["severity"], 0) + 1
        print(json.dumps({
            "generated_at": now.isoformat(),
            "pipeline": cfg.get("pipeline_name", "Sales"),
            "clean": not alerts,
            "alert_count": len(alerts),
            "counts": counts,
            "alerts": alerts,
            "cards_checked": len(cards),
            "excluded_test_records": excluded,
        }, indent=2, ensure_ascii=False))
        return 0

    if mode == "stdout":
        if not alerts:
            print(CLEAN_LINE)
            print("(checked %d cards; %d test record%s excluded)"
                  % (len(cards), excluded, "" if excluded == 1 else "s"))
            return 0
        print(batch_text(alerts, now, excluded))
        return 0

    if mode == "cockpit":
        # ALWAYS write the card (a clean card proves the run happened), and
        # post to Slack too when a webhook exists and there is news.
        write_cockpit_card(alerts, now, excluded, len(cards))
        print(("%d alert(s) — card written to the cockpit" % len(alerts))
              if alerts else (CLEAN_LINE + " — card written to the cockpit"))
        if alerts:
            webhook, _src = find_slack_webhook(cfg)
            if webhook:
                try:
                    post_to_slack(webhook, batch_text(alerts, now, excluded))
                    print("(also posted to Slack)")
                except Exception as exc:  # noqa: BLE001 — Slack is the bonus channel
                    print("(Slack post failed: %s)" % exc, file=sys.stderr)
        return 0

    # mode == "slack"
    webhook, source = find_slack_webhook(cfg)
    if not webhook:
        # still show the alerts locally, then fail visibly: a watchdog that
        # cannot bark is a misconfiguration, not a quiet success.
        print(batch_text(alerts, now, excluded) if alerts else CLEAN_LINE)
        print("Watchdog cannot post to Slack: %s" % source, file=sys.stderr)
        return 2
    if not alerts:
        # Silence on Slack means clean — the launchd log shows the run happened.
        print(CLEAN_LINE + " (nothing posted to Slack; %d cards checked)"
              % len(cards))
        return 0
    post_to_slack(webhook, batch_text(alerts, now, excluded))
    print("Posted %d alert%s to Slack (%s)."
          % (len(alerts), "" if len(alerts) == 1 else "s", source))
    return 0


def main(argv=None):
    parser = argparse.ArgumentParser(
        description="Pipeline Watchdog — GHL Sales pipeline alerts "
                    "(speed-to-lead, 24h promise, follow-up due, duplicates, "
                    "stale cards). Surface Care quote-integrity replica.")
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--stdout", action="store_true",
                       help="print alerts to the terminal (default)")
    group.add_argument("--json", action="store_true",
                       help="machine-readable output (for the cockpit)")
    group.add_argument("--slack", action="store_true",
                       help="post the alert batch to Slack (silent if clean)")
    group.add_argument("--cockpit", action="store_true",
                       help="write the result as a cockpit card (config/"
                            "watchdog-latest.md) + Slack when available — "
                            "the fully-automatic mode launchd runs")
    parser.add_argument("--scheduled", action="store_true",
                        help="launchd mode: skip quietly outside the "
                             "07:00-19:00 active window")
    args = parser.parse_args(argv)
    mode = ("cockpit" if args.cockpit
            else "slack" if args.slack
            else "json" if args.json else "stdout")

    try:
        return run(mode, args.scheduled)
    except WatchdogError as exc:
        # An API failure must be LOUD — silence must never look like health.
        sys.stderr.write("Watchdog failed: %s\n" % exc)
        if mode == "cockpit":
            try:
                write_cockpit_card([], datetime.datetime.now().astimezone(),
                                   0, 0, error=str(exc))
            except Exception as exc2:  # noqa: BLE001
                sys.stderr.write("(could not write failure card: %s)\n" % exc2)
        if mode == "json":
            print(json.dumps({"error": str(exc)}))
        if mode == "slack":
            try:
                cfg = load_config()
                webhook, _ = find_slack_webhook(cfg)
                if webhook:
                    post_to_slack(webhook,
                                  "\U0001F436⚠️ Watchdog failed: %s"
                                  % exc)
                    sys.stderr.write("(failure note posted to Slack)\n")
            except Exception as exc2:  # noqa: BLE001 — best-effort only
                sys.stderr.write("(could not post failure note to Slack: "
                                 "%s)\n" % exc2)
        return 1


if __name__ == "__main__":
    sys.exit(main())
