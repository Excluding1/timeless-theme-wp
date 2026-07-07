#!/bin/zsh
# Double-click launcher for the Timeless CEO Cockpit (board + Business Map + Customer Journey).
cd "$(dirname "$0")"
if lsof -nP -i :4317 | grep -q LISTEN; then
  open "http://localhost:4317/map"
  exit 0
fi
( sleep 1 && open "http://localhost:4317/map" ) &
exec node server.js
