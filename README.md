# JANE — Just Another Naming Engine

An agent skill that invents human-sounding acronym names for your app, product,
or AI assistant — in the spirit of **JARVIS** ("Just A Rather Very Intelligent
System") or **EDITH** from the Iron Man movies. Every name spells out a phrase
that relates to what you're building.

Two modes:

- **Generate** — describe your app, get ~10 acronym name ideas with expansions.
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
- "Make NOVA a backronym for a coding copilot"
- "What could EDITH stand for if it's a calendar app?"

---

Made by [egig](https://github.com/egig) · [buymeacoffee.com/egig](https://buymeacoffee.com/egig)
