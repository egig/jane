---
name: jane
description: >-
  Generate JARVIS-style acronym names — or backronyms for a fixed word — for an
  app, product, or AI assistant. Use when the user wants a name that spells out a
  phrase (like JARVIS = "Just A Rather Very Intelligent System"), a backronym for
  an existing word, or a human-sounding assistant name in the spirit of JARVIS,
  EDITH, or FRIDAY.
---

# JANE — Just Another Naming Engine

Invent human-sounding acronym names built from expansions, in the spirit of
JARVIS or EDITH from the Iron Man movies. Every name spells out a phrase whose
words relate to what the user is building.

## Two modes

Detect which one the request wants:

- **Generate** — the user describes an app / product / assistant and wants name
  ideas. ("name my smart-home assistant", "acronym names for a finance app")
- **Backronym** — the user has a fixed word and wants expansions of *that exact
  word*. ("make NOVA a backronym for my app", "what could EDITH stand for")

If it is genuinely unclear what the thing does (e.g. just "an app"), ask **one**
short clarifying question. Otherwise go straight to generating.

## Quality rules

These are non-negotiable — apply them to every candidate:

- **Length:** 4–6 letters (backronym mode: use the target word as-is).
- **Pronounceable** and human-sounding — it should read like a real first name
  or a catchy word (JARVIS, EDITH, FRIDAY, KAREN, NOVA), not random letters.
- **Letters only.** No digits, no punctuation, no spaces inside the name.
- **The expansion is the point.** Each word of the expansion starts with the
  corresponding letter of the name, **in order**, and the phrase should
  plausibly relate to the user's domain.
- Vary the tone across the set — technical, playful, elegant, bold.

## Process

1. Read the request; pick a mode.
2. Generate **10 candidates** (backronym mode: 8 distinct expansions of the one
   word).
3. **Self-check every candidate.** Spell the name out letter by letter against
   its expansion:
   `N-O-V-A → Neural · Operations · Virtual · Assistant` ✅
   Discard any where the initials don't line up in order, or that break a
   quality rule. Replace discards so the final list is full.
4. Present as a Markdown list, one per line:
   `**NOVA** — Neural Operations Virtual Assistant`
5. Close by offering next steps: iterate on a direction, or turn a favorite into
   more backronym expansions.

Don't roleplay as "JANE" or announce yourself — just give a one-line lead-in
("Here are 10 acronym names for a smart-home assistant:") and the list.

## Example — generate

**Request:** "I'm building a smart home assistant app"

```
Here are 10 acronym names for a smart-home assistant:

**HAVEN** — Home Automation Voice Environment Network
**NORA** — Networked Orchestration for Rooms & Appliances
**LUMA** — Living-space Unified Management Assistant
**CASPER** — Connected Automation System for Personal Environments & Routines
**MIRA** — Managed Indoor Routines Assistant
**ORLA** — Orchestrated Rooms, Lights & Appliances
**VESTA** — Voice-Enabled Smart-home Task Assistant
**KIRA** — Knowledgeable Indoor Routines Assistant
**AURA** — Automated Unified Residence Assistant
**ELSA** — Everyday Living-Space Assistant
```

## Example — backronym

**Request:** "Make NOVA stand for something — it's a personal finance coach"

```
Eight ways NOVA could expand for a personal finance coach:

**NOVA** — Net-worth Optimization & Vigilant Advice
**NOVA** — Nudges, Objectives, Visibility, Accountability
**NOVA** — Navigating Our Value & Assets
**NOVA** — Numbers Organized, Vision Ahead
**NOVA** — Net Outcomes, Verified Actions
**NOVA** — Notify, Optimize, Visualize, Advise
**NOVA** — New Outlook on Value & Ambition
**NOVA** — Neutral Objective View of Assets
```
