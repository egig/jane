export type GeneratedName = {
  id: string
  name: string
  style: string
}

const PREFIXES = [
  "get",
  "go",
  "try",
  "hey",
  "my",
  "up",
  "on",
  "the",
  "join",
  "use",
]

const SUFFIXES = [
  "ly",
  "ify",
  "io",
  "hub",
  "lab",
  "kit",
  "flow",
  "wise",
  "base",
  "loop",
  "mate",
  "verse",
  "space",
  "zen",
]

const CONNECTORS = ["", "", "and", "with", "for", "go"]

const VOWEL_SWAPS: Record<string, string> = {
  a: "a",
  e: "e",
  i: "y",
  o: "oo",
  u: "u",
}

const capitalize = (word: string) =>
  word.length === 0 ? word : word[0].toUpperCase() + word.slice(1)

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

const cleanKeywords = (raw: string): string[] =>
  raw
    .split(/[\s,]+/)
    .map((k) => k.trim().toLowerCase().replace(/[^a-z0-9]/g, ""))
    .filter((k) => k.length > 1)

// Individual naming strategies -------------------------------------------------

function prefixStyle(word: string): string {
  return `${pick(PREFIXES)}${capitalize(word)}`
}

function suffixStyle(word: string): string {
  const base = /[aeiou]$/.test(word) ? word.slice(0, -1) : word
  return capitalize(`${base}${pick(SUFFIXES)}`)
}

function blendStyle(a: string, b: string): string {
  const half = a.slice(0, Math.ceil(a.length / 2))
  const tail = b.slice(Math.floor(b.length / 2))
  return capitalize(`${half}${tail}`)
}

function compoundStyle(a: string, b: string): string {
  const connector = pick(CONNECTORS)
  if (connector) {
    return `${capitalize(a)}${capitalize(connector)}${capitalize(b)}`
  }
  return `${capitalize(a)}${capitalize(b)}`
}

function playfulStyle(word: string): string {
  const swapped = word.replace(/[aeiou]/g, (v) => VOWEL_SWAPS[v] ?? v)
  return capitalize(swapped)
}

function doubleStyle(word: string): string {
  return capitalize(`${word}${word.slice(-2)}`)
}

// Main generator ---------------------------------------------------------------

export function generateNames(input: string, count = 12): GeneratedName[] {
  const keywords = cleanKeywords(input)
  if (keywords.length === 0) return []

  const results = new Map<string, GeneratedName>()
  const add = (name: string, style: string) => {
    const key = name.toLowerCase()
    if (name.length >= 3 && !results.has(key)) {
      results.set(key, { id: key, name, style })
    }
  }

  let guard = 0
  while (results.size < count && guard < count * 12) {
    guard++
    const a = pick(keywords)
    const b = pick(keywords)

    switch (Math.floor(Math.random() * 6)) {
      case 0:
        add(prefixStyle(a), "Prefix")
        break
      case 1:
        add(suffixStyle(a), "Suffix")
        break
      case 2:
        if (a !== b) add(blendStyle(a, b), "Blend")
        else add(suffixStyle(a), "Suffix")
        break
      case 3:
        if (a !== b) add(compoundStyle(a, b), "Compound")
        else add(prefixStyle(a), "Prefix")
        break
      case 4:
        add(playfulStyle(a), "Playful")
        break
      default:
        add(doubleStyle(a), "Echo")
        break
    }
  }

  return Array.from(results.values()).slice(0, count)
}
