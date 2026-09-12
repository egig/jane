# Agent guide

This repo is a single agent skill: **JANE — Just Another Naming Engine**.

## Skill: jane

**Location:** [`skills/jane/SKILL.md`](skills/jane/SKILL.md)

**What it does:** generates JARVIS-style acronym names (each name spells out a
phrase) for an app, product, or AI assistant, and expands a fixed word into
backronyms.

**When to use it:** the user wants a name that stands for something, a backronym
for an existing word, or a human-sounding assistant name in the spirit of
JARVIS, EDITH, or FRIDAY.

Load `skills/jane/SKILL.md` and follow it. It is self-contained — plain
instructions, no scripts, no network calls, no dependencies.

Claude Code discovers the same skill via `.claude/skills/jane` (a symlink to
`skills/jane`).

**Install anywhere:** `npx skills add egig/jane` — the `skills/jane/SKILL.md`
layout is the flat convention that tool expects, so no repo changes were
needed to support it.
