import { type NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/rate-limit"
import { checkDailyQuota, incrementDailyCount } from "@/lib/daily-quota"
import { getCached, setCache, cacheKey } from "@/lib/cache"

export const maxDuration = 60

type GeneratedName = {
  name: string
  style: string
}

const FREE_MODEL = "openrouter/free"
const AUTO_MODEL = "openrouter/auto"

async function callModel(
  model: string,
  apiKey: string,
  systemPrompt: string,
  userMessage: string,
  timeoutMs?: number,
): Promise<{ ok: true; names: GeneratedName[] } | { ok: false; status: number }> {
  const controller = timeoutMs ? new AbortController() : undefined
  const timer = timeoutMs ? setTimeout(() => controller!.abort(), timeoutMs) : undefined

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      signal: controller?.signal,
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.9,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    })

    if (res.ok) {
      const data = await res.json()
      const content: string | undefined = data?.choices?.[0]?.message?.content
      const names = content ? parseNames(content) : []
      if (names.length > 0) return { ok: true, names }
    }

    return { ok: false, status: res.status }
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { ok: false, status: 408 }
    }
    return { ok: false, status: 0 }
  } finally {
    clearTimeout(timer)
  }
}

const SYSTEM_PROMPT = `You are JANE (Just Another Naming Engine), an expert at inventing
human-sounding AI-assistant names built from acronyms — in the spirit of JARVIS or EDITH
from the Iron Man movies.

Given the user's app description or keywords, generate 3 names. Each name must:
- Be a short, pronounceable, human-sounding acronym (like JARVIS, EDITH, FRIDAY, KAREN).
- Ideally read like a real first name or a catchy word, not random letters.
- Stand for a plausible phrase whose words relate to the user's app/keywords.
- Use 4-6 letters. No numbers, no punctuation, no spaces inside the acronym.

For each name, the "style" field holds the expansion — the phrase the acronym stands for,
with each word starting with the corresponding letter (e.g. "Just A Rather Very Intelligent System").

Respond ONLY with valid JSON in this exact shape, no markdown:
{"names":[{"name":"JARVIS","style":"Just A Rather Very Intelligent System"}]}`

const BACKRONYM_PROMPT = `You are JANE (Just Another Naming Engine), an expert at crafting
clever backronyms — turning a fixed word into an acronym where each letter starts a word,
in the spirit of JARVIS ("Just A Rather Very Intelligent System") from Iron Man.

You are given a target NAME (a fixed word) and a description of the user's app.
Produce 8 distinct, creative expansions of that exact NAME. Each expansion must:
- Use the letters of the NAME in order, one word per letter (respect the exact spelling).
- Read as a natural, meaningful phrase that relates to the app description.
- Be clever, brandable, and human-sounding — not random filler words.
- Vary in tone across the 8 options (technical, playful, elegant, bold, etc.).

Every returned "name" MUST be the exact target NAME (unchanged). The "style" field holds the
expansion phrase, with each word capitalized and starting with the matching letter in order.

Respond ONLY with valid JSON in this exact shape, no markdown:
{"names":[{"name":"JARVIS","style":"Just A Rather Very Intelligent System"}]}`

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  return "127.0.0.1"
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)

  const rateLimitCheck = checkRateLimit(ip)
  if (!rateLimitCheck.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down.", code: "rate_limit_minute" },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimitCheck.retryAfter) },
      },
    )
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY is not configured." },
      { status: 500 },
    )
  }

  let keywords = ""
  let mode = "generate"
  let targetName = ""
  try {
    const body = await req.json()
    keywords = typeof body?.keywords === "string" ? body.keywords.trim() : ""
    mode = body?.mode === "backronym" ? "backronym" : "generate"
    targetName = typeof body?.name === "string" ? body.name.trim() : ""
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (!keywords) {
    return NextResponse.json(
      { error: "Please provide a description.", code: "invalid_input" },
      { status: 400 },
    )
  }

  if (keywords.length > 200) {
    return NextResponse.json(
      { error: "Description must be 200 characters or fewer.", code: "invalid_input" },
      { status: 400 },
    )
  }

  const isBackronym = mode === "backronym"

  if (isBackronym) {
    if (!targetName) {
      return NextResponse.json(
        { error: "Please provide a name to expand.", code: "invalid_input" },
        { status: 400 },
      )
    }
    if (!/^[A-Za-z]{2,12}$/.test(targetName)) {
      return NextResponse.json(
        { error: "The name must be 2-12 letters, no spaces or numbers.", code: "invalid_input" },
        { status: 400 },
      )
    }
  }

  const ck = cacheKey(mode, keywords, targetName)
  const cached = getCached<GeneratedName[]>(ck)
  if (cached) {
    return NextResponse.json({ names: cached })
  }

  const quotaCheck = checkDailyQuota(ip)
  if (!quotaCheck.allowed) {
    return NextResponse.json(
      { error: "Daily generation limit reached. Come back tomorrow!", code: "quota_exceeded" },
      { status: 429 },
    )
  }

  const systemPrompt = isBackronym ? BACKRONYM_PROMPT : SYSTEM_PROMPT
  const userMessage = isBackronym
    ? `Target NAME: ${targetName.toUpperCase()}\nApp description: ${keywords}\n\nGenerate 3 backronym expansions of "${targetName.toUpperCase()}" now.`
    : `Keywords: ${keywords}\n\nGenerate 3 app names now.`

  try {
    const freeResult = await callModel(FREE_MODEL, apiKey, systemPrompt, userMessage, 5_000)

    if (freeResult.ok) {
      setCache(ck, freeResult.names)
      incrementDailyCount(ip)
      return NextResponse.json(
        { names: freeResult.names },
        { headers: { "X-RateLimit-Remaining": String(quotaCheck.remaining - 1) } },
      )
    }

    console.log("[jane] free model failed (status %d), trying cheap paid model:", freeResult.status, AUTO_MODEL)
    const cheapResult = await callModel(AUTO_MODEL, apiKey, systemPrompt, userMessage)

    if (cheapResult.ok) {
      setCache(ck, cheapResult.names)
      incrementDailyCount(ip)
      return NextResponse.json(
        { names: cheapResult.names },
        { headers: { "X-RateLimit-Remaining": String(quotaCheck.remaining - 1) } },
      )
    }

    console.log("[jane] all models exhausted")
    return NextResponse.json(
      { error: "The naming service is busy right now. Please try again in a moment.", code: "server_busy" },
      { status: 502 },
    )
  } catch (err) {
    console.log("[jane] generate route error:", err)
    return NextResponse.json(
      { error: "Something went wrong. Please try again.", code: "server_busy" },
      { status: 500 },
    )
  }
}

function parseNames(content: string): GeneratedName[] {
  let raw = content.trim()
  raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "")

  try {
    const parsed = JSON.parse(raw)
    const list = Array.isArray(parsed) ? parsed : parsed?.names
    if (!Array.isArray(list)) return []
    return list
      .map((item: unknown) => {
        if (typeof item === "string") return { name: item, style: "Idea" }
        const obj = item as Record<string, unknown>
        const name = typeof obj?.name === "string" ? obj.name.trim() : ""
        const style = typeof obj?.style === "string" ? obj.style.trim() : "Idea"
        return name ? { name, style: style || "Idea" } : null
      })
      .filter((n): n is GeneratedName => n !== null)
      .slice(0, 12)
  } catch {
    return []
  }
}
