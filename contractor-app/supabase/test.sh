#!/usr/bin/env bash
# Local mirror of the contractor-backend CI gate. Run from anywhere:
#   bash contractor-app/supabase/test.sh
# Runs from functions/ so deno.json (the import map) is discovered, same as CI's working-directory.
set -euo pipefail
cd "$(dirname "$0")/functions"

echo "▶ deno check";                        deno check */index.ts
echo "▶ deno lint";                         deno lint
echo "▶ contact-leak CI (security gate)";   deno test _tests/contact-leak.test.ts
echo "✅ contractor backend checks passed"
