#!/usr/bin/env python3
"""Extract the {stats, records, dropped_out_of_scope} payload from a workflow task-output file
and write it to docs/lead-gen/data/leads-verified.json (merging with any prior verified file so
successive resumes accumulate leads rather than overwrite)."""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.normpath(os.path.join(HERE, "..", "data"))
OUT = os.path.join(DATA, "leads-verified.json")

src = sys.argv[1]
with open(src) as f:
    raw = f.read()

obj = json.loads(raw)

def find_payload(o):
    """Locate the dict that has a 'records' list, wherever the harness nested it."""
    if isinstance(o, dict):
        if isinstance(o.get("records"), list):
            return o
        for v in o.values():
            r = find_payload(v)
            if r:
                return r
        # some harnesses store the return as a JSON string under 'result'/'return'/'output'
        for k in ("result", "return", "output", "value"):
            if isinstance(o.get(k), str):
                try:
                    return find_payload(json.loads(o[k]))
                except Exception:
                    pass
    if isinstance(o, list):
        for v in o:
            r = find_payload(v)
            if r:
                return r
    return None

payload = find_payload(obj)
if not payload:
    print("ERROR: could not locate a 'records' payload in", src)
    print("top-level keys:", list(obj.keys()) if isinstance(obj, dict) else type(obj))
    sys.exit(1)

new_records = payload.get("records", [])
new_dropped = payload.get("dropped_out_of_scope", [])
stats = payload.get("stats", {})

# merge with existing (accumulate across resumes; newest wins by website/name key)
existing = {"records": [], "dropped_out_of_scope": []}
if os.path.exists(OUT):
    try:
        with open(OUT) as f:
            existing = json.load(f)
    except Exception:
        pass

def key(r):
    w = (r.get("website") or "").lower().strip().replace("https://", "").replace("http://", "").replace("www.", "").rstrip("/")
    if w:
        return "w:" + w.split("/")[0]
    ph = "".join(ch for ch in (r.get("phone") or "") if ch.isdigit())
    if len(ph) >= 8:
        return "p:" + ph
    return "n:" + (r.get("business_name") or "").lower().strip()

merged = {}
for r in existing.get("records", []):
    merged[key(r)] = r
for r in new_records:  # new wins
    merged[key(r)] = r
records = list(merged.values())

dmerged = {}
for d in existing.get("dropped_out_of_scope", []) + new_dropped:
    dmerged[(d.get("business_name") or "").lower()] = d
dropped = list(dmerged.values())

with open(OUT, "w") as f:
    json.dump({"stats": stats, "records": records, "dropped_out_of_scope": dropped}, f, indent=2)

print(f"merged records: {len(records)} (new {len(new_records)}, prior {len(existing.get('records', []))})")
print(f"dropped: {len(dropped)}")
print(f"wrote {OUT}")
