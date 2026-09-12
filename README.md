# JANE — Just Another Naming Engine

An agent skill that invents names for your app, product, or AI assistant —
human-sounding acronym names in the spirit of **JARVIS** ("Just A Rather Very
Intelligent System") or **EDITH** from the Iron Man movies, plus brandable
names in the spirit of Google, FedEx, or Lyft.

Two modes:

- **Generate** — describe your app, get a mixed set of name ideas: acronym
  names that spell out a phrase, plus evocative, compound-word, non-English,
  brandable, short-phrase, and alternate-spelling names. Ask for one flavor
  only (e.g. "just acronym names") to narrow it down.
- **Backronym** — give a fixed word (NOVA, EDITH, AURA…), get expansions of that
  exact word tailored to your app.

It's a single Markdown file — no runtime, no API keys, no dependencies. The
agent's own model does the work.

## Install

### Any agent, via npx

```bash
npx skills add egig/jane
```

This installs into whichever supported agents it detects on your machine
(Claude Code, Cursor, Codex, Windsurf, and 75+ others) — see
[vercel-labs/skills](https://github.com/vercel-labs/skills). Add
`--skill jane` to skip the picker, or `--list` to preview first.

### Claude Code (manual)

```bash
git clone https://github.com/egig/jane
cp -r jane/skills/jane ~/.claude/skills/jane
```

Then ask Claude to name something, or invoke it directly with `/jane`.

### Other agents (manual)

Point your agent at [`AGENTS.md`](AGENTS.md), or copy `skills/jane/SKILL.md`
into wherever your tool loads skills from. The skill is tool-agnostic — standard
frontmatter (`name`, `description`) and a Markdown body.

## Usage examples

- "Name my smart-home assistant app"
- "Give me acronym names for a personal finance coach"
- "I need a brandable name for my app"
- "Make NOVA a backronym for a coding copilot"
- "What could EDITH stand for if it's a calendar app?"

---

Made by [egig](https://github.com/egig) · [buymeacoffee.com/egig](https://buymeacoffee.com/egig)
