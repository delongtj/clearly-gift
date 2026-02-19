const perListCooldowns = new Map<string, number>()
const globalRequests: number[] = []
const minuteRequests: number[] = []

const PER_LIST_COOLDOWN_MS = 60_000
const GLOBAL_DAILY_LIMIT = 900
const RPM_LIMIT = 12
const DAY_MS = 86_400_000
const MINUTE_MS = 60_000

export function checkRateLimit(listId: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now()

  // Per-list cooldown
  const lastRequest = perListCooldowns.get(listId)
  if (lastRequest) {
    const elapsed = now - lastRequest
    if (elapsed < PER_LIST_COOLDOWN_MS) {
      return { allowed: false, retryAfterMs: PER_LIST_COOLDOWN_MS - elapsed }
    }
  }

  // RPM limit
  while (minuteRequests.length > 0 && now - minuteRequests[0] > MINUTE_MS) {
    minuteRequests.shift()
  }
  if (minuteRequests.length >= RPM_LIMIT) {
    return { allowed: false, retryAfterMs: MINUTE_MS - (now - minuteRequests[0]) }
  }

  // Global daily limit
  while (globalRequests.length > 0 && now - globalRequests[0] > DAY_MS) {
    globalRequests.shift()
  }
  if (globalRequests.length >= GLOBAL_DAILY_LIMIT) {
    return { allowed: false, retryAfterMs: DAY_MS - (now - globalRequests[0]) }
  }

  // Record this request
  perListCooldowns.set(listId, now)
  minuteRequests.push(now)
  globalRequests.push(now)

  return { allowed: true }
}
