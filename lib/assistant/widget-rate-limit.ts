/**
 * Sliding-window rate limit for unauthenticated widget users (by client IP hint).
 * Same limits as Clerk-based assistant limiter; separate map for public traffic.
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 15;

const timestampsByKey = new Map<string, number[]>();

export function checkWidgetPublicRateLimit(key: string):
  | { ok: true }
  | { ok: false; message: string } {
  const now = Date.now();
  const prev = timestampsByKey.get(key) ?? [];
  const windowStart = now - WINDOW_MS;
  const pruned = prev.filter((t) => t > windowStart);

  if (pruned.length >= MAX_REQUESTS) {
    const oldest = pruned[0]!;
    const waitSec = Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000));
    return {
      ok: false,
      message: `Too many requests. Please wait about ${waitSec}s and try again.`,
    };
  }

  pruned.push(now);
  timestampsByKey.set(key, pruned);
  return { ok: true };
}
