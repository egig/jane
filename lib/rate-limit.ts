const windows = new Map<string, number[]>()

const WINDOW_MS = 60_000
const MAX_REQUESTS = 10

function now() {
  return Date.now()
}

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const ts = now()
  let entries = windows.get(ip)

  if (!entries) {
    entries = []
    windows.set(ip, entries)
  }

  const cutoff = ts - WINDOW_MS
  entries = entries.filter((t) => t > cutoff)
  windows.set(ip, entries)

  if (entries.length >= MAX_REQUESTS) {
    const oldest = entries[0]
    const retryAfter = Math.ceil((oldest + WINDOW_MS - ts) / 1000)
    return { allowed: false, retryAfter }
  }

  entries.push(ts)
  return { allowed: true, retryAfter: 0 }
}

setInterval(() => {
  const cutoff = now() - WINDOW_MS
  for (const [ip, entries] of windows) {
    const filtered = entries.filter((t) => t > cutoff)
    if (filtered.length === 0) {
      windows.delete(ip)
    } else {
      windows.set(ip, filtered)
    }
  }
}, 120_000)
