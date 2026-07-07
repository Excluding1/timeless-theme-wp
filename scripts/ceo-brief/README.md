# Monday CEO Brief bot

Every Monday 7:00am this bot pulls the **Sales pipeline from GoHighLevel** and
posts a one-screen CEO brief to Slack: sales performance vs the prior 4-week
average, a weekly trend, top jobs by value, and numbered plain-English
insights.

**Lineage:** this is a replica of the flagship agent run by Jordan's Surface
Care — the competitor whose operating model Timeless deliberately mirrors.
Their Monday brief format (Sales Performance with WoW deltas → Weekly Trend →
Top jobs → Insights) is reproduced closely here, computed from our own GHL
Sales pipeline (`YTgWxSeFt2oyd3zBe2Xr`, location `Uz8fQwDiUxAHVtlruspD`).

## Files

| File | What |
|---|---|
| `brief.py` | The bot. Python 3 stdlib only — no pip installs, runs on system `python3`. |
| `config.json` | Committed config — ids, stage names, margin assumption, secret **paths**. No secrets. |
| `com.timeless.ceobrief.plist` | launchd agent template (Monday 07:00). |

## Run it

```bash
cd /Users/excluding/Downloads/timeless-theme-wp/scripts/ceo-brief
python3 brief.py --stdout    # print the brief to the terminal (default)
python3 brief.py --dry-run   # fetch + compute, show what WOULD post and where
python3 brief.py --slack     # post to Slack for real
```

Exit code 0 = success. Any failure prints `CEO Brief failed: <reason>` to
stderr and exits 1 — and in `--slack` mode it also posts a short
"⚠️ CEO Brief failed: …" to the webhook, so silence never looks like success.

> **Status note (2026-07-07):** `--stdout` was tested for real against the
> live pipeline and works. `--slack` is **untested** — no live post has been
> approved yet and no webhook exists in `.secrets/`. First person to enable
> Slack: do one `--dry-run`, then one supervised `--slack`.

## Secrets (never committed)

`config.json` holds only *paths*; the values live in the repo's git-ignored
`.secrets/` directory:

- **GHL PIT** — `.secrets/ghl-pit.key` (exists; a `pit-…` token on one line).
- **Slack webhook** — `.secrets/slack-webhook.key` (does **not** exist yet).
  To enable posting: create a Slack *Incoming Webhook* for the target channel
  and save its URL as that file (`chmod 600` it). Alternatively export
  `SLACK_WEBHOOK_URL`. The file wins if both are present.

## Install the Monday 7am schedule (macOS launchd)

```bash
cp com.timeless.ceobrief.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.timeless.ceobrief.plist
# test-fire now (POSTS TO SLACK for real):
launchctl start com.timeless.ceobrief
tail -20 ~/Library/Logs/ceo-brief.log
```

launchd quirks: if the Mac is **asleep** at 7:00 the job fires once on wake;
if it's **powered off** that Monday is skipped. If the repo ever moves out of
`~/Downloads/timeless-theme-wp`, update the two absolute paths in the plist.

## How the numbers are computed

All math is client-side from `GET /opportunities/search` (paginated, all
records) + `GET /opportunities/pipelines` on the LeadConnector v2 API.
Read-only — the bot never writes to GHL.

- **Week window** — the last *full* local week, Monday 00:00 → Sunday 24:00.
  Run on Monday 7am, it reports the week that just ended. "WoW" deltas
  compare against the **average of the prior 4 weeks** (`baseline_weeks`).
- **Stage semantics** — resolved **by name at runtime** from the pipeline's
  stage list, so stage renames/reorders don't silently break the mapping:
  position ≥ "Quote Sent" counts as *sent*, ≥ "Quote Accepted" as *accepted*.
  If a configured stage name vanishes, the bot fails loudly with the current
  stage list so you can fix `config.json`.
- **Quotes Requested** — opportunities *created* in the window.
- **Quotes Sent** — sent-events in the window. Sent date = the
  `opportunity.quote_sent_at` custom field when populated (accurate), else
  `lastStageChangeAt` of a card currently at/past Quote Sent (approximation —
  GHL doesn't expose per-stage history via this endpoint).
- **Quotes Accepted / Revenue** — cards at/past Quote Accepted (dated by
  `lastStageChangeAt`) or with status `won` (dated by `lastStatusChangeAt`).
  Revenue = sum of `monetaryValue` of the window's accepted quotes.
- **Net Value / Margin %** — per accepted job, in priority order:
  1. `opportunity.estimated_profit` custom field, if > 0 (true net — this
     field already exists in our GHL and is populated by the quote pipeline);
  2. `sub_cost_field_key` (see below), net = value − sub cost;
  3. `value × margin_assumption` (default 0.30) — labelled **"(est)"** with a
     footnote whenever any estimate contributed.
- **Repeat Customers** — window's new opportunities whose contact already had
  an earlier opportunity in the pipeline.
- **Top Jobs** — up to 5 *open, not-yet-accepted* opportunities by value,
  with current stage and days sitting in it.
- **Insights** — simple rules, numbered: acceptance rate moved ≥10pp vs the
  prior 4 weeks; no quotes sent in `no_sent_alert_days`; largest open
  opportunity → follow up; requests waiting `stale_quote_days`+ without a
  quote; no new requests in `no_request_alert_days`; requested ±30% or
  revenue ±20% vs baseline. Nothing triggered → "Steady week".
- **Test records** — opportunity names matching `exclude_name_regex`
  (Clifford test submissions, Faketest, Allan/Marko self-tests, …) are
  excluded and counted in the footnote. Edit the regex in `config.json` to
  change this; set it to `""` to include everything.

## Adding a true Sub Cost later (real Net instead of "(est)")

Today true net comes from the existing `Estimated Profit` custom field when
the quote pipeline populates it. To switch to actuals:

1. In GHL → Settings → Custom Fields → **Opportunity**, create a MONETARY
   field, e.g. **"Sub Cost Actual"** (fieldKey becomes
   `opportunity.sub_cost_actual`).
2. Have the dispatch/ServiceM8 flow write the agreed sub price into it.
3. In `config.json` set `"sub_cost_field_key": "opportunity.sub_cost_actual"`.

Priority is: estimated_profit → sub-cost → margin assumption; to prefer the
sub-cost field over estimated_profit, set `"net_profit_field_key": null`.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `Cloudflare blocked the request (403/1010)` | GHL sits behind Cloudflare, which bans the default `Python-urllib` user agent. `brief.py` already sends a browser UA (this was hit and fixed during the 2026-07-07 live test); if it recurs, Cloudflare rules changed — update `USER_AGENT` in `brief.py`. |
| `GHL rejected the token (HTTP 401)` | The PIT was rotated/expired. Generate a new Private Integration Token in GHL (Settings → Private Integrations, scopes: opportunities + locations read) and overwrite `.secrets/ghl-pit.key`. |
| `cannot post to Slack: no webhook found` | Create `.secrets/slack-webhook.key` with the incoming-webhook URL, or export `SLACK_WEBHOOK_URL`. |
| `stage named 'Quote Sent' not found` | Someone renamed the stage in GHL. The error prints the live stage list — update the two stage names in `config.json`. |
| Brief posts but numbers look off | Remember sent/accepted dates are approximated by `lastStageChangeAt` when the `quote_sent_at` custom field is empty; a card moved twice in one day only records the last move. |
| Nothing posted on Monday | `tail ~/Library/Logs/ceo-brief.log`; check the agent is loaded: `launchctl list \| grep ceobrief`. Mac powered off at 7:00 = that week is skipped. |
