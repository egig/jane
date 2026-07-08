type CacheEntry = {
  data: unknown
  expiry: number
}

const cache = new Map<string, CacheEntry>()

const TTL_MS = 86_400_000
const MAX_ENTRIES = 500

function now() {
  return Date.now()
}

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (now() > entry.expiry) {
    cache.delete(key)
    return null
  }
  return entry.data as T
}

export function setCache(key: string, data: unknown): void {
  if (cache.size >= MAX_ENTRIES) {
    const oldest = cache.entries().next()
    if (!oldest.done) {
      cache.delete(oldest.value[0])
    }
  }

  cache.set(key, {
    data,
    expiry: now() + TTL_MS,
  })
}

export function cacheKey(mode: string, keywords: string, targetName?: string): string {
  const kw = keywords.toLowerCase().trim().slice(0, 200)
  return targetName
    ? `${mode}:${kw}:${targetName.toUpperCase()}`
    : `${mode}:${kw}`
}
