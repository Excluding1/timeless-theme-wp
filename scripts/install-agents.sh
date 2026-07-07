#!/bin/zsh
# Install/refresh the Timeless AI agents as ALWAYS-ON launchd jobs.
# Why a runtime home: macOS TCC blocks launchd-run python from reading
# ~/Downloads, so the agents run from ~/.timeless/ (synced from this repo by
# this script). Re-run after any change to brief.py / watchdog.py / configs.
#   ~/.timeless/agents/    runtime copies of the scripts + configs
#   ~/.timeless/secrets/   private copies of the keys (chmod 600)
#   ~/.timeless/cards/     the cockpit reads agent cards from here
#   ~/.timeless/logs/      launchd logs
set -e
REPO="$(cd "$(dirname "$0")/.." && pwd)"
T="$HOME/.timeless"
mkdir -p "$T/agents/ceo-brief" "$T/agents/pipeline-watchdog" "$T/secrets" "$T/cards" "$T/logs"

# 1. scripts + configs (secret paths rewritten to the runtime secrets dir)
cp "$REPO/scripts/ceo-brief/brief.py"              "$T/agents/ceo-brief/"
cp "$REPO/scripts/pipeline-watchdog/watchdog.py"   "$T/agents/pipeline-watchdog/"
for pair in "ceo-brief" "pipeline-watchdog"; do
  sed -e 's|"\.\./\.\./\.secrets/ghl-pit\.key"|"'"$T"'/secrets/ghl-pit.key"|' \
      -e 's|"\.\./\.\./\.secrets/slack-webhook\.key"|"'"$T"'/secrets/slack-webhook.key"|' \
      "$REPO/scripts/$pair/config.json" > "$T/agents/$pair/config.json"
done

# 2. secrets (600, user-only)
cp "$REPO/.secrets/ghl-pit.key" "$T/secrets/ghl-pit.key"
[ -f "$REPO/.secrets/slack-webhook.key" ] && cp "$REPO/.secrets/slack-webhook.key" "$T/secrets/slack-webhook.key" || true
chmod 600 "$T"/secrets/* 2>/dev/null || true

# 3. launchd plists pointed at the runtime copies
LA="$HOME/Library/LaunchAgents"
mkdir -p "$LA"
for pair in "ceo-brief brief.py com.timeless.ceobrief" "pipeline-watchdog watchdog.py com.timeless.watchdog"; do
  set -- ${=pair}
  sed -e "s|$REPO/scripts/$1/$2|$T/agents/$1/$2|" \
      -e "s|<string>$REPO/scripts/$1</string>|<string>$T/agents/$1</string>|" \
      "$REPO/scripts/$1/$3.plist" > "$LA/$3.plist"
  launchctl unload "$LA/$3.plist" 2>/dev/null || true
  launchctl load "$LA/$3.plist"
done

# 4. the cockpit itself (always on at :4317; node CAN live in Downloads)
cp "$REPO/cockpit/com.timeless.cockpit.plist" "$LA/"
launchctl unload "$LA/com.timeless.cockpit.plist" 2>/dev/null || true
launchctl load "$LA/com.timeless.cockpit.plist"

echo "Installed. Jobs:"
launchctl list | grep timeless || true
echo "Cockpit: http://localhost:4317 · cards: $T/cards · logs: $T/logs + ~/Library/Logs"
