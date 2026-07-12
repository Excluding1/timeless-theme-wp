#!/bin/zsh
# Double-click launcher — Timeless Quote Inbox.
# Reads new quote-form requests from GoHighLevel and shows each as one clean card
# with the customer's request + photos inline. Localhost only; GHL token stays server-side.
cd "$(dirname "$0")"
PORT=4319
if lsof -nP -i :$PORT 2>/dev/null | grep -q LISTEN; then
  open "http://localhost:$PORT"
  exit 0
fi
( sleep 1 && open "http://localhost:$PORT" ) &
exec node server.js
