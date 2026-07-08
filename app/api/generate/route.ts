import { type NextRequest, NextResponse } from "next/server"

export const maxDuration = 30

type GeneratedName = {
  name: string
  style: string
}

// Ordered list of free OpenRouter models to try. If one is rate-limited
// or unavailable, we fall through to the next.
const FREE_MODELS = [
  "openai/gpt-oss-120b:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "nousresearch/hermes-3-llama-3.1-405b:free",
  "openai/gpt-oss-20b:free",
]

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const SYSTEM_PROMPT = `You are a creative branding expert specializing in naming apps and startups.
Given a set of keywords, generate 12 unique, brandable, memorable app names.

Rules:
- Names must be short (1-2 words, ideally one coined word).
- Mix strategies: coined blends, prefixes/suffixes (-ly, -ify, -io, -hub), compounds, playful respellings.
- Avoid generic dictionary words alone. Make them feel like real brand names.
- No numbers, no punctuation inside names, no quotes.
- Each name gets a short "style" label describing the technique (e.g. "Blend", "Suffix", "Compound", "Coined", "Playful").

Respond ONLY with valid JSON in this exact shape, no markdown:
{"names":[{"name":"Example","style":"Blend"}]}`

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY is not configured." },
      { status: 500 },
    )
  }

  let keywords = ""
  try {
    const body = await req.json()
    keywords = typeof body?.keywords === "string" ? body.keywords.trim() : ""
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (!keywords) {
    return NextResponse.json({ error: "Please provide keywords." }, { status: 400 })
  }

  const userMessage = `Keywords: ${keywords}\n\nGenerate 12 app names now.`

  try {
    let lastStatus = 0

    for (const model of FREE_MODELS) {
      // Try each model up to 2 times to ride out brief upstream rate limits.
      for (let attempt = 0; attempt < 2; attempt++) {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: userMessage },
            ],
          }),
        })

        if (res.ok) {
          const data = await res.json()
          const content: string | undefined = data?.choices?.[0]?.message?.content
          const names = content ? parseNames(content) : []
          if (names.length > 0) {
            return NextResponse.json({ names })
          }
          // Parsed nothing usable — move on to the next model.
          break
        }

        lastStatus = res.status
        const detail = await res.text()
        console.log(`[v0] OpenRouter ${model} error:`, res.status, detail)

        // Only a rate limit is worth retrying the same model.
        if (res.status === 429 && attempt === 0) {
          await sleep(1200)
          continue
        }
        break
      }
    }

    console.log("[v0] all models exhausted, last status:", lastStatus)
    return NextResponse.json(
      { error: "The naming service is busy right now. Please try again in a moment." },
      { status: 502 },
    )
  } catch (err) {
    console.log("[v0] generate route error:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}

function parseNames(content: string): GeneratedName[] {
  let raw = content.trim()
  // Strip markdown code fences if the model added them.
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
