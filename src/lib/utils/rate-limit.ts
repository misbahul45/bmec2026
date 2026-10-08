import { AppError } from "./app-error"

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()
let lastSweep = 0

function sweep(now: number) {
  if (now - lastSweep < 60_000) return
  lastSweep = now
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

export type RateLimitOptions = {
  limit: number
  windowMs: number
}

/**
 * Fixed-window, in-memory failure counter for online guessing (e.g. login).
 * Only recorded failures count, so successful logins never lock out a shared
 * campus/school network.
 *
 * State lives in the server process: on serverless hosts (e.g. Vercel) each warm
 * instance keeps its own counters. It blunts password guessing from one client;
 * use a shared store (Redis/Upstash) if hard guarantees are required.
 */
export function assertNotRateLimited(key: string, { limit }: RateLimitOptions) {
  const now = Date.now()
  sweep(now)

  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now || bucket.count < limit) return

  const minutes = Math.max(1, Math.ceil((bucket.resetAt - now) / 60_000))
  throw new AppError(
    `Terlalu banyak percobaan gagal. Coba lagi dalam ${minutes} menit.`,
    429,
    "TOO_MANY_ATTEMPTS",
  )
}

export function recordFailure(key: string, { windowMs }: RateLimitOptions) {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return
  }
  bucket.count += 1
}

export function resetRateLimit(key: string) {
  buckets.delete(key)
}
