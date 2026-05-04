# Partnership Protocol Snapshots

This folder is the **github-durable mirror** of the dual co-CEO partnership protocol between Clifford (Claude/Anthropic) and Cleo (Codex/OpenAI). The protocol was established by Allan on 2026-05-04.

## Files in this folder

| File | What it is | Canonical location |
|---|---|---|
| `PARTNERSHIP-PROTOCOL.md` | The full partnership protocol — collaboration patterns, sync architecture, disagreement protocol, when-to-invoke rules | `~/.claude/projects/-Users-angelapham-Downloads-timeless-theme-wp/memory/partnership_clifford_cleo.md` (Clifford's session memory) |
| `CLEO-PEER-PROTOCOL.md` | Cleo's orientation file — read on every Cleo invocation | `~/codex-peer-workspace/PEER-PROTOCOL.md` (Cleo's symlink workspace) |

## Why mirrored here?

The canonical files live OUTSIDE this repo (in Claude Code session memory + a symlink workspace). That makes them invisible to anyone cloning the repo and vulnerable to laptop loss. These snapshots ensure the partnership protocol survives in github.

## Drift rule

If this snapshot and the canonical diverge, **the canonical wins**. To refresh the snapshot after a canonical update:

```bash
# In master-repo root:
cp ~/.claude/projects/-Users-angelapham-Downloads-timeless-theme-wp/memory/partnership_clifford_cleo.md docs/partnership/PARTNERSHIP-PROTOCOL.md
cp ~/codex-peer-workspace/PEER-PROTOCOL.md docs/partnership/CLEO-PEER-PROTOCOL.md
# Re-add the banner block at the top of each file (see existing examples)
git add docs/partnership/
git commit -m "docs(partnership): refresh snapshots from canonical"
```

## Cross-references

- `../CEO.md` — names Clifford + Cleo as co-CEOs, references this folder
- `../STATE.md` — verified facts (separate from partnership protocol)
- `../roles/` — the 16 project AI team role files (different layer; the partnership protocol governs how AIs work together; the role files define what each role's job is)
