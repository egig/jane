---
name: jane
description: >-
  Generate JARVIS-style acronym names, brandable/evocative/compound-word names —
  or backronyms for a fixed word — for an app, product, or AI assistant. Use when
  the user wants a name that spells out a phrase (like JARVIS = "Just A Rather
  Very Intelligent System"), a backronym for an existing word, a human-sounding
  assistant name in the spirit of JARVIS, EDITH, or FRIDAY, or a brandable /
  evocative / compound-word / short-phrase product name (like Red Bull, FedEx,
  Toyota, Google, Dollar Shave Club, Lyft).
---

# JANE — Just Another Naming Engine

Invent names for an app, product, or AI assistant, in the spirit of JARVIS or
EDITH from the Iron Man movies — plus brandable names in the spirit of Google,
FedEx, or Lyft.

## Two modes

Detect which one the request wants:

- **Generate** — the user describes an app / product / assistant and wants name
  ideas. ("name my smart-home assistant", "acronym names for a finance app",
  "brandable name for my app")
- **Backronym** — the user has a fixed word and wants expansions of *that exact
  word*. ("make NOVA a backronym for my app", "what could EDITH stand for")

If it is genuinely unclear what the thing does (e.g. just "an app"), ask **one**
short clarifying question. Otherwise go straight to generating.

## Generate mode: acronym rules

Non-negotiable — apply to every acronym candidate:

- **Length:** 4–6 letters.
- **Pronounceable** and human-sounding — it should read like a real first name
  or a catchy word (JARVIS, EDITH, FRIDAY, KAREN, NOVA), not random letters.
- **Letters only.** No digits, no punctuation, no spaces inside the name.
- **The expansion is the point.** Each word of the expansion starts with the
  corresponding letter of the name, **in order**, and the phrase should
  plausibly relate to the user's domain.
- Vary the tone across the set — technical, playful, elegant, bold.

## Generate mode: brand-style rules

Six non-acronym styles, one rule each:

- **Evocative** — a word or short phrase chosen for feeling/attitude, not
  literal description (Red Bull → energy/aggression, not "drink with
  caffeine"; Forever 21 → youth, not "clothing store").
- **Compound** — two real, recognizable words fused or joined (FedEx = Federal
  + Express; Microsoft = Microcomputer + Software).
- **Non-English** — a real word from another language whose meaning plausibly
  relates to the product, kept in Latin script and easy for English speakers
  to pronounce (not obscure or hard to say).
- **Brandable** — an invented word with no prior meaning, chosen purely for
  how it sounds/reads — short, pronounceable, ownable (Google, Rolex).
- **Short phrase** — a natural 2–4 word phrase (Dollar Shave Club), not just
  "[Adjective] [Noun] Co."
- **Alternate spelling** — a real, recognizable word with one letter/spelling
  twist (drop or swap a letter, phonetic respelling) that stays easily
  pronounceable and readable (Lyft, Fiverr).

Each candidate should be an **original name for the user's product** — never a
real existing brand name or a trivial near-copy of one of the style examples
above (they're style references only, not templates to lightly reskin).

## Process

1. Read the request; pick a mode.
2. **Backronym mode:** generate 8 distinct expansions of the one word.
   **Generate mode, default (unqualified request):** generate **5 acronym
   candidates** plus **2 candidates for each of the 6 brand styles** (17
   total). **Generate mode, narrowed request** (the user clearly asked for
   only one flavor, e.g. "acronym names", "brandable names", "compound word
   names"): generate candidates for just that flavor only.
3. **Self-check every candidate:**
   - Acronym candidates: spell the name out letter by letter against its
     expansion — `N-O-V-A → Neural · Operations · Virtual · Assistant` ✅.
     Discard any where the initials don't line up in order, or that break a
     quality rule.
   - Brand-style candidates: confirm each is original (not a real brand or a
     trivial near-copy) and actually satisfies its style's rule above. Discard
     any that fail either check.
   Replace every discard so the final list is full.
4. Present as a **flat** Markdown list, no section headers, one per line:
   - Acronym: `**NOVA** — Neural Operations Virtual Assistant`
   - Brand style: `**ZEPHRA** — *(evocative)* airy, confident, feels premium`
5. Close by offering next steps: iterate on a direction, narrow to one style,
   or turn a favorite acronym into more backronym expansions.

Don't roleplay as "JANE" or announce yourself — just give a one-line lead-in
("Here are some name ideas for a smart-home assistant:") and the list.

## Example — generate (default)

**Request:** "I'm building a smart home assistant app"

```
Here are some name ideas for a smart-home assistant:

**HAVEN** — Home Automation Voice Environment Network
**NORA** — Networked Orchestration for Rooms & Appliances
**LUMA** — Living-space Unified Management Assistant
**CASPER** — Connected Automation System for Personal Environments & Routines
**AURA** — Automated Unified Residence Assistant
**HOMEBLINK** — *(evocative)* a house that notices you, quick and alive
**NESTFUL** — *(evocative)* warm, contented, full of home
**ROOMWORKS** — *(compound)* room + works, plain and mechanical-sounding
**DWELLIX** — *(compound)* dwell + -ix, a place that computes
**YUUGA** — *(non-English)* Japanese "elegant, graceful" — calm smart-home feel
**HEIMLY** — *(non-English)* from German "heim" (home), softened with -ly
**KOVANA** — *(brandable)* invented, smooth and modern-sounding
**ORVELLO** — *(brandable)* invented, rounded and easy to say
**THE QUIET HOUSE CO** — *(short phrase)* calm, competent, human
**LITTLE ROOM SYSTEMS** — *(short phrase)* cozy scale, technical edge
**HOWSE** — *(alt spelling)* "house" respelled, short and ownable
**DWEL** — *(alt spelling)* "dwell" without the second L
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
