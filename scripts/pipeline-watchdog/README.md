# Pipeline Watchdog

Every 30 minutes, 07:00–19:00, the watchdog pulls the **Sales pipeline from
GoHighLevel** and barks — to the terminal or to Slack — about anything that
threatens a lead, a quote promise, or pipeline hygiene. It produces
**alerts, not a report**: a clean pipeline means one log line and nothing
on Slack.

**Lineage:** agent #2 of the Surface Care fleet replication. Jordan runs a
"Quote Integrity Analyst" daily at **6am**; this watchdog merges that
integrity check with his **60-second speed-to-lead ethos** into one guardian
— and runs **half-hourly** instead of daily, because speed-to-lead IS the
business. Same GHL pipeline as the CEO Brief (`YTgWxSeFt2oyd3zBe2Xr`,
location `Uz8fQwDiUxAHVtlruspD`), same read-only GET-only client.

## Files

| File | What |
|---|---|
| `watchdog.py` | The agent. Python 3 stdlib only — no pip installs, runs on system `python3`. |
| `config.json` | Committed config — ids, stage names, thresholds, secret **paths**. No secrets. |
| `com.timeless.watchdog.plist` | launchd agent template (every 30 min; business-hours window enforced in code). |

## The five checks

Thresholds live in `config.json`; the defaults below are what ships.

| # | Alert | Fires when | Example |
|---|---|---|---|
| 1 | 🚨 **NEW LEAD UNTOUCHED** (critical) | Opportunity created **> 15 min** ago, still sitting in the **first stage**, created within the last 24h. | `🚨 NEW LEAD UNTOUCHED 23 min: Rory McVeigh 0400 111 222 — call NOW (60-second rule)` |
| 2 | ⏰ **QUOTE DUE / 24H PROMISE BROKEN** (warn / critical) | Card still **before Quote Sent** for **> 20h** (warn: "promise breaks in 2h") / **> 24h** (breach). | `⏰ QUOTE DUE: Lisa V (Bondi) — requested 22h ago, 24h promise breaks in 2h` |
| 3 | 📨 **FOLLOW-UP DUE / QUOTE EXPIRED** (warn) | In the Quote Sent band with **no stage movement 5+ days** → send the countdown SMS ("expires in 2 days" on the **7-day validity** — Allan decision 2026-07-07); **8+ days** → validity lapsed, send the expiry / win-back SMS. | `📨 FOLLOW-UP DUE: Neil H (Cronulla) — quote sent 5d ago, no movement since — send the countdown SMS (quote expires in 2d)` |
| 4 | 👥 **DUPLICATE** (warn) | Two **non-lost** cards share a phone, email, **normalised street address** (from the `Name - Address` opportunity title), or contact — and at least one is still open. Jordan's quote-integrity core: same house quoted twice must not get two prices. | `👥 DUPLICATE: same address+contact on 2 cards (2 open) — Isabella M (Kellyville) & Isabella M (Kellyville) — check pricing consistency` |
| 5 | 🧹 **STALE** (info) | Any **open** card with no stage/status movement for **20+ days** — the pipeline should reflect reality. | `🧹 STALE 20d: mick connolly — $2,900 · sitting in "Job Complete" — complete or close` |

### Ownership ladder (why you get ONE alert per card, not three)

Each open card gets at most one **age-based** alert; duplicates stack on top:

```
first stage, 15min–20h old        -> 1. speed-to-lead (critical)
pre-Quote-Sent, 20–24h old        -> 2. quote due (warn)
pre-Quote-Sent, 24h+ old          -> 2. promise BROKEN (critical)
Quote Sent band, quiet 5–8d       -> 3. countdown nudge (warn)
Quote Sent band, quiet 8–20d      -> 3. expiry / win-back (warn)
any open card, untouched 20d+     -> 5. stale — complete or close (info)
```

So a dead 3-week-old card shows up **once** as stale, not also as a broken
promise; a fresh Quote Sent card (0–4 days) produces **no alert at all** —
that is the pipeline working.

## Run it

```bash
cd /Users/excluding/Downloads/timeless-theme-wp/scripts/pipeline-watchdog
python3 watchdog.py --stdout    # print alerts to the terminal (default)
python3 watchdog.py --json      # machine-readable, for the cockpit
python3 watchdog.py --slack     # post the alert batch to Slack
```

- **Clean pipeline** → prints `✅ Pipeline clean — no alerts`. In `--slack`
  mode **nothing is posted** — silence on Slack means clean; the launchd log
  line proves the run happened.
- **`--slack` without a webhook** → prints the alerts locally, then exits
  **2** with `Watchdog cannot post to Slack: …` — a watchdog that cannot
  bark is a misconfiguration, never a quiet success.
- **API failure** → `Watchdog failed: <reason>` on stderr, exit 1 — and in
  `--slack` mode the failure itself is posted to Slack. Silence never looks
  like health.

## Secrets (never committed)

`config.json` holds only *paths*; values live in the repo's git-ignored
`.secrets/`:

- **GHL PIT** — `.secrets/ghl-pit.key` (exists; shared with the CEO Brief).
- **Slack webhook** — `.secrets/slack-webhook.key` (does **not** exist yet —
  same status as the CEO Brief, 2026-07-07). Create a Slack *Incoming
  Webhook* for the alerts channel and save its URL as that file
  (`chmod 600` it), or export `SLACK_WEBHOOK_URL`. The file wins.

## Install the half-hourly schedule (macOS launchd)

```bash
cp com.timeless.watchdog.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.timeless.watchdog.plist
# test-fire now (posts to Slack for real if there are alerts):
launchctl start com.timeless.watchdog
tail -20 ~/Library/Logs/pipeline-watchdog.log
```

**Schedule design:** the plist uses `StartInterval 1800` (fire every 30 min
around the clock) and the code enforces the **07:00–19:00** window when run
with `--scheduled` (outside it: one "skipped" log line, exit 0). This was
chosen over a `StartCalendarInterval` array — that needs 25 dictionary
entries for the half-hour slots and gives no log line outside the window;
one integer plus a two-line code check is simpler and every fire is visible
in the log. Trade-off: runs are spaced 30 min from *load* time rather than
aligned to :00/:30 — irrelevant for this job. Change the window by editing
`active_hours` in `config.json` (`[7, 19]` = 07:00 ≤ run < 19:00).

launchd quirks: sleep time doesn't count toward `StartInterval` — after a
long sleep the job fires once shortly after wake, then resumes every 30 min.
Mac off = no runs. If the repo moves out of `~/Downloads/timeless-theme-wp`,
update the two absolute paths in the plist.

## How the checks read GHL (all client-side, read-only)

- `GET /opportunities/pipelines` — stage list, **resolved by name at
  runtime** ("Quote Sent" / "Quote Accepted"); renames fail loudly with the
  live stage list. "First stage" = position 0, whatever its name.
- `GET /opportunities/search` — every card (paginated), including the
  embedded contact (phone/email for checks 1 and 4).
- `GET /locations/{id}/customFields` — so `opportunity.quote_sent_at` can be
  used as the true sent date when populated; otherwise `lastStageChangeAt`
  approximates it (GHL exposes no per-stage history here). Non-fatal if the
  token lacks the scope.
- **"Untouched" / "no movement"** = latest of `createdAt`,
  `lastStageChangeAt`, `lastStatusChangeAt`. Editing a note does NOT reset
  the clock — only pipeline movement does (that is deliberate: the pipeline
  position is what customers experience).
- **Duplicate keys** — phone compared on the trailing 9 digits (`+61 400…`
  = `0400…`); email lowercased; address parsed from the opportunity title
  (`Customer Name - Full Street Address`), abbreviations expanded
  (St→Street…), state/postcode dropped, and it must start with a street
  number. Groups where nothing is open any more are ignored.
- **Test records** — names matching `exclude_name_regex` (Clifford test
  submissions, Faketest, Allan/Marko self-tests…) are excluded before any
  check runs; the count shows in the batch footer.

## `--json` shape (for the cockpit)

```json
{
  "generated_at": "2026-07-07T14:30:00+10:00",
  "pipeline": "Sales",
  "clean": false,
  "alert_count": 1,
  "counts": {"info": 1},
  "alerts": [
    {
      "check": "stale",
      "severity": "info",
      "opportunity_ids": ["…"],
      "name": "mick connolly",
      "age_days": 20.3,
      "message": "🧹 STALE 20d: …"
    }
  ],
  "cards_checked": 12,
  "excluded_test_records": 3
}
```

On failure `--json` prints `{"error": "…"}` to stdout (plus the loud stderr
line) so the cockpit can render the failure too.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `Cloudflare blocked the request (403/1010)` | GHL sits behind Cloudflare, which bans the default `Python-urllib` UA. `watchdog.py` already sends a browser UA (fix inherited from the ceo-brief live test 2026-07-07); if it recurs, update `USER_AGENT`. |
| `GHL rejected the token (HTTP 401)` | PIT rotated/expired. New Private Integration Token (scopes: opportunities + locations read) → overwrite `.secrets/ghl-pit.key`. |
| `Watchdog cannot post to Slack` (exit 2) | Create `.secrets/slack-webhook.key` with the incoming-webhook URL, or export `SLACK_WEBHOOK_URL`. |
| `stage named 'Quote Sent' not found` | Stage renamed in GHL — the error prints the live list; update `config.json`. |
| Alert storm after a holiday | Expected: the checks are stateless and re-alert every run until the pipeline is fixed. Fixing the cards IS the snooze button. |
| Nothing in the log for hours | `launchctl list \| grep watchdog`; Mac asleep pauses `StartInterval`. Outside 07:00–19:00 you should still see "skipped" lines every 30 min. |
| Same card alerted twice | Only possible as age-alert **+ duplicate** (by design). Two age alerts for one card is a bug — check the ownership ladder in `run_checks`. |
