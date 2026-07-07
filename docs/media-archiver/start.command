#!/bin/zsh
# Double-click launcher for the Media Archiver (TikTok · YouTube · Instagram).
cd "$(dirname "$0")"
if [[ ! -x .venv/bin/python ]]; then
  echo "First-time setup: creating the Python environment (needs uv: brew install uv)…"
  uv venv --python 3.12 .venv && uv pip install --python .venv/bin/python -r requirements.txt || {
    echo "Setup failed — see README.md"; read -r; exit 1; }
fi
( sleep 2 && open "http://127.0.0.1:8318" ) &
exec .venv/bin/python server.py
