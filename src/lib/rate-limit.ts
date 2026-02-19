const globalRequests: number[] = []
const minuteRequests: number[] = []

const GLOBAL_DAILY_LIMIT = 900
const RPM_LIMIT = 12
const DAY_MS = 86_400_000
const MINUTE_MS = 60_000

export function checkRateLimit(): { allowed: boolean } {
  const now = Date.now()

  // RPM limit
  while (minuteRequests.length > 0 && now - minuteRequests[0] > MINUTE_MS) {
    minuteRequests.shift()
  }
  if (minuteRequests.length >= RPM_LIMIT) {
    return { allowed: false }
  }

  // Global daily limit
  while (globalRequests.length > 0 && now - globalRequests[0] > DAY_MS) {
    globalRequests.shift()
  }
  if (globalRequests.length >= GLOBAL_DAILY_LIMIT) {
    return { allowed: false }
  }

  // Record this request
  minuteRequests.push(now)
  globalRequests.push(now)

  return { allowed: true }
}
