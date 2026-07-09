import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

const url = process.env.DATABASE_URL

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

function getDb() {
  if (!url) return null
  if (!_db) {
    const sql = neon(url)
    _db = drizzle(sql, { schema })
  }
  return _db
}

export type GenerationLog = {
  ip: string
  mode: string
  keywords: string
  targetName?: string
  status: string
  model?: string
  names?: unknown
  errorCode?: string
  cached?: boolean
}

export async function logGeneration(data: GenerationLog): Promise<void> {
  const db = getDb()
  if (!db) return

  try {
    await db.insert(schema.generations).values({
      ip: data.ip,
      mode: data.mode,
      keywords: data.keywords,
      targetName: data.targetName ?? null,
      status: data.status,
      model: data.model ?? null,
      names: data.names as Record<string, unknown> | null ?? null,
      errorCode: data.errorCode ?? null,
      cached: data.cached ?? false,
    })
  } catch (err) {
    console.error("[jane] db log failed:", err)
  }
}

export { schema }
