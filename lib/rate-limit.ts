/**
 * Distributed rate limiting via Upstash Redis.
 * Falls back with a warning when UPSTASH_REDIS_REST_URL/TOKEN are absent
 * so the app stays functional in environments without Redis configured.
 *
 * Required env vars (add to .env.local and Vercel):
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let _redis: Redis | null | undefined;
const _limiters = new Map<string, Ratelimit>();

function getRedis(): Redis | null {
  if (_redis !== undefined) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    console.warn(
      "[rate-limit] UPSTASH_REDIS_REST_URL/TOKEN not set — rate limiting disabled. " +
        "Set these env vars to enable distributed rate limiting."
    );
    _redis = null;
    return null;
  }
  _redis = new Redis({ url, token });
  return _redis;
}

function getLimiter(prefix: string, max: number, windowSecs: number): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  const cacheKey = `${prefix}:${max}:${windowSecs}`;
  if (!_limiters.has(cacheKey)) {
    _limiters.set(
      cacheKey,
      new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(max, `${windowSecs} s`),
        prefix,
      })
    );
  }
  return _limiters.get(cacheKey)!;
}

export interface RateLimitResult {
  ok: boolean;
  message?: string;
}

/**
 * Check a rate limit for the given key.
 * Returns { ok: true } when allowed or when Redis is not configured.
 */
export async function checkRateLimit(
  key: string,
  config: { prefix: string; max: number; windowSecs: number }
): Promise<RateLimitResult> {
  const limiter = getLimiter(config.prefix, config.max, config.windowSecs);
  if (!limiter) {
    return { ok: true };
  }

  const result = await limiter.limit(key);
  if (!result.success) {
    const waitSecs = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
    return {
      ok: false,
      message: `Too many requests. Please wait about ${waitSecs}s and try again.`,
    };
  }

  return { ok: true };
}
