# Agent Operating Principles — Synthesis

**Source:** Synthesis of (a) Claude Code Skills Report v1 (Apr 27, 2026 — Samarth Bhamare, clskillshub.com), (b) cs-ceo-advisor.md skill package pattern (Allan-supplied 2026-05-01), (c) CLAUDE.md operating-principles template (Allan-supplied), (d) our existing CEO methodology (Rule 1-12 + Override 13).

**Purpose:** Codify how the CEO + Manager + Expert + Auditor + AI Employee stack actually operates, applying high-leverage primitives + avoiding placebo patterns.

---

## Verified high-leverage primitives (per Skills Report v1 testing)

### Reasoning-shifting prompt prefixes (use these)

| Prefix | When to use | Tested benefit |
|---|---|---|
| **`/skeptic`** | Decision questions where obvious answer might be wrong | 5.5× catch rate on wrong premises (11/14 vs baseline 2/14) |
| **`/steelman`** | Before committing to contrarian decision; test own plan | Only prefix that reliably prevents sycophantic agreement |
| **`L99`** | Binary decisions, kill "it depends" hedging | Forces commitment to one answer with reasoning |
| **`PERSONA`** with specifics | Domain expert work | Specific personas activate real domain priors; generic don't |
| **`/deepthink`** | Mid-depth debugging, root-cause analysis | Cheaper alternative to ULTRATHINK for moderate reasoning |
| **`ULTRATHINK`** | Hard reasoning when willing to pay 3× token cost | Real reasoning shift; expensive — don't daily-driver |
| **`OODA`** | Strategic questions with multiple moving parts | Forces Observe → Orient → Decide → Act discipline |

### Placebos to avoid (kill these from your prompts)

❌ `GODMODE` — adds length, no reasoning improvement
❌ `BEASTMODE` — confidence theater, same decisions
❌ `MEGAPROMPT` — verbose scaffolding, reasoning unchanged
❌ `OVERTHINK` — meta-discussion, no answer change
❌ `/jailbreak` — drops legitimate safety, no reasoning shift
❌ `CEOMODE` — persona shift without domain knowledge activation
❌ `/optimize` (bare prefix) — identical output to baseline

**The pattern:** Reasoning-shifters share **rejection logic** (what NOT to produce). Placebos are additive (more confident, more expert, more thorough). 10-second test: does the prefix tell Claude what to REJECT, or just tell Claude to try harder? Latter = placebo.

---

## Story sizing rules (adopted from Allan's CLAUDE.md template)

Every CEO/Manager-delegated task must complete in a **single agent session** (one context window):

| Guideline | Rule |
|---|---|
| **Files modified** | Max 3-5 files per task |
| **Lines of context** | If >2000 lines needed, split task |
| **Uncertainty** | Err on smaller side |
| **Split pattern** | Schema → Backend → Frontend → Integration |

**If task is too big:** create subtasks, complete sequentially in fresh sessions.

This prevents quality degradation from context compaction (matches Skills Report finding: long-context > 150K tokens degrades qualitatively on 4.6, holds on 4.7).

---

## Goal-backward verification (every task)

Before marking ANY task complete, verify the actual artifact achieves the stated goal:

### Verification checklist
1. Re-read original task acceptance criteria
2. Trace through artifact (code, doc, config) confirming each criterion met
3. Can the user flow be demonstrated end-to-end?
4. What would break this in production?
5. If ANY criterion not verifiably met → DO NOT mark complete

### Common failures to catch
- Code compiles but doesn't implement feature
- Doc exists but is missing the actionable section
- Spec written but no expert/auditor lens applied
- "Done" claimed but downstream cross-references broken

This pattern integrates with our existing CEO Rule 9 (Pause-Audit-Decide) — verify before declaring done.

---

## Primitive stack — CEO operates across 5 layers (per Skills Report)

```
1. Prompts          — Conversation-scoped instructions (per-session)
2. CLAUDE.md        — Project-level standing instructions (this repo)
3. Skills           — ~/.claude/skills/ markdown files (cross-project)
4. Sub-agents       — Specialized Claude instances (code review, photo review, fact check)
5. Agent teams      — Orchestrated multi-agent pipelines (rare; only for repeat workflows)
6. MCP servers      — External tool integration
7. Hooks            — Deterministic automation around AI lifecycle events
```

### Adoption ladder (per Skills Report — crawl-walk-run)

**Stage 1 (we're here):** Solid CLAUDE.md + a few good prompt prefixes + sub-agents for parallel work
**Stage 2:** Custom skills for our specific conventions (CEO Rules, audit lens application, sub onboarding patterns)
**Stage 3:** Hooks for deterministic gates (commit-time audits, deployment-time tests)
**Stage 4:** MCP server for Supabase + Slack + Stripe integration (custom or off-the-shelf)
**Stage 5:** Agent teams for repeat orchestrated pipelines (e.g., "spec → implement → review → docs" for new features)

**Adoption discipline:** master Stage 1-2 fully before Stage 5. Skills Report finding: most over-investment failures come from teams jumping to Stage 5 before Stage 1-2 are solid.

---

## Multi-agent parallelism — already built-in

We have native parallel agent execution via the Agent tool. Pattern:

```
In a single message, dispatch:
  - Agent A (subagent_type: code-explorer)  → research repo X
  - Agent B (subagent_type: code-architect) → design feature Y plan
  - Agent C (subagent_type: code-reviewer)  → review PR Z
All run concurrently. Results return as separate tool messages.
```

This IS the parallel agent capability Allan wanted from vibe-kanban. **No external tool needed.**

When CEO needs parallel work:
- Manager decomposes task into independent sub-tasks
- Manager dispatches multiple agents in single message
- Manager consolidates findings before returning to CEO

---

## Recommended Claude Code plugins (8 repos evaluated 2026-05-01)

Run these `/plugin install` commands inside your Claude Code session:

**✅ INSTALL — 5 picks:**

```
/plugin install gsd-build/get-shit-done                # spec-driven dev framework, "solves context rot"
/plugin install davila7/claude-code-templates          # 100+ agents/commands/MCPs/hooks library
/plugin install nextlevelbuilder/ui-ux-pro-max-skill   # 161 UI/UX reasoning rules + 67 design styles
/plugin install netresearch/agent-rules-skill          # AGENTS.md generator (cross-tool, 60K+ project standard)
/plugin install anthropics/skills                      # Official Anthropic skills — docx/pdf/pptx/xlsx + reference patterns
```

**❌ SKIPPED:**
- `BloopAI/vibe-kanban` — sunsetting (README announces shutdown)
- `AvdLee/SwiftUI-Agent-Skill` — iOS/Swift specific; we don't build iOS
- `asifkibria/claude-code-toolkit` — Claude Code maintenance tool; lower priority for our build phase (revisit if session hygiene degrades)

**Why these 5:**
- **gsd** + **claude-code-templates** — extend our agent + command system (we'll use these to build CEO morning-brief commands, etc.)
- **ui-ux-pro-max-skill** — directly applicable when we get Netlify dashboard frontend repo access for UI/UX fixes
- **agent-rules-skill** — standard format that works across Claude Code + Cursor + Copilot (future-proof + multi-tool)
- **anthropics/skills** — authoritative skill patterns from Anthropic; reference for our own custom skills

---

## CEO-advisor pattern (per cs-ceo-advisor.md inspiration)

Allan's referenced cs-ceo-advisor.md is a Claude Code agent skill package pattern. Key takeaways:

- **Strategy frameworks:** SWOT, Porter's Five Forces, scenario analysis. Apply where strategic decisions need framework rigor (e.g., adjacent-service expansion per F14).
- **Skill integration:** Python scripts for analysis (e.g., margin model). We have this via Section G of [sub-rate-schedule.md](sub-rate-schedule.md).
- **Bridge strategic ↔ operational:** "actionable guidance on vision setting, capital allocation, board dynamics, culture development." This is what our CEO + Manager pair does.
- **Stakeholder management:** investors, board, customers, subs. Our docs already separate these (CEO ↔ Allan ↔ Marko ↔ subs ↔ customers).

We don't need to install this specific agent — we ARE the CEO advisor pattern, applied to bathroom-trade business specifics.

---

## CLAUDE.md template adoption

Allan's template provides solid scaffolding. Our existing repo CLAUDE.md is project-specific (WordPress theme). We'll keep it as-is + add operating-principles cross-reference.

**Top-level CLAUDE.md sections worth adopting from Allan's template:**
- Story sizing rules (3-5 files max per task) — adopt
- Goal-backward verification — adopt (already have via Rule 9)
- Things to NEVER do — adopt as a section in CEO.md (we have implicit rules, formalise)

**What NOT to import:**
- Generic "Agent Operating Principles" (already in our CEO Rules 1-12)
- Tech-stack scaffolding (our repo has its own)

---

## Things to NEVER do (formalised)

Per CEO operating discipline + Skills Report findings + Allan template:

### Decision discipline
- ❌ Never skip 3-lens audit (Rule 2) before landing decision in CEO.md
- ❌ Never use placebo prompt prefixes (GODMODE, BEASTMODE, MEGAPROMPT, etc.)
- ❌ Never claim a task complete without goal-backward verification

### Operating discipline
- ❌ Never commit secrets (API keys, service_role tokens, passwords) to git
- ❌ Never quote a customer without checking pricing audit findings + materials cost
- ❌ Never dispatch a subcontractor without insurance + ABN verified
- ❌ Never make a marketing claim that violates ACL (no over-warranting)

### Code discipline
- ❌ Never modify customer PII tables without audit log entry
- ❌ Never push to main without local test (when frontend repo accessible)
- ❌ Never delete bulk data without inline approval (per dashboard-integration-plan.md)

### CEO discipline
- ❌ Never gather data CEO should be analysing (Override 13 — delegate to AI employees)
- ❌ Never decide quickly when Pause-Audit-Decide trigger fires (Rule 9)
- ❌ Never skip MD file reads when working in that domain (Rule 10)

---

## Adoption next steps

1. **Use `/skeptic` prefix** on Allan's next decision question to me
2. **Install 3 Claude Code plugins** when Allan can run `/plugin` slash commands (gsd, claude-code-templates, ui-ux-pro-max-skill)
3. **Build custom skill** for CEO Rule 2 lens application (auto-prompt to apply 3 lenses on any decision)
4. **Build custom skill** for "no placebo prompts" filter
5. **Spawn parallel sub-agents** for next multi-track work (e.g., dashboard audit Track 1+2+3 simultaneously when frontend repo accessible)

---

## Cross-references

- [Claude Code Skills Report v1 — Apr 27, 2026](https://clskillshub.com) — full source for primitive findings
- [docs/CEO.md § CEO Rules 1-12](../CEO.md) — existing operating discipline (now extended with this synthesis)
- [docs/roles/manager-business-orchestrator.md](../roles/manager-business-orchestrator.md) — Manager that applies these principles
- [docs/specs/dashboard-audit-and-improvement-plan-2026-05-01.md](dashboard-audit-and-improvement-plan-2026-05-01.md) — current application of these principles
- Allan's references: `/Users/angelapham/Downloads/cs-ceo-advisor.md` (pattern), `/Users/angelapham/Downloads/CLAUDE.md` (template)
