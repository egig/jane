const quotas = new Map<string, { count: number; date: string }>()

const MAX_DAILY = 10

function today(): string {
  const d = new Date()
  return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`
}

export function checkDailyQuota(ip: string): { allowed: boolean; remaining: number } {
  const key = ip
  const entry = quotas.get(key)
  const t = today()

  if (!entry || entry.date !== t) {
    return { allowed: true, remaining: MAX_DAILY }
  }

  if (entry.count >= MAX_DAILY) {
    return { allowed: false, remaining: 0 }
  }

  return { allowed: true, remaining: MAX_DAILY - entry.count }
}

export function incrementDailyCount(ip: string): void {
  const key = ip
  const entry = quotas.get(key)
  const t = today()

  if (!entry || entry.date !== t) {
    quotas.set(key, { count: 1, date: t })
    return
  }

  entry.count++
}
