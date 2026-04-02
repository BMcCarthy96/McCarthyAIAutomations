/**
 * Simple in-memory sliding window per Clerk user id.
 * Resets on cold start; not shared across serverless instances (MVP).
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 15;

const timestampsByUser = new Map<string, number[]>();

export function checkAssistantRateLimit(userId: string):
  | { ok: true }
  | { ok: false; message: string } {
  const now = Date.now();
  const prev = timestampsByUser.get(userId) ?? [];
  const windowStart = now - WINDOW_MS;
  const pruned = prev.filter((t) => t > windowStart);

  if (pruned.length >= MAX_REQUESTS) {
    const oldest = pruned[0]!;
    const waitSec = Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000));
    return {
      ok: false,
      message: `Too many assistant requests. Please wait about ${waitSec}s and try again.`,
    };
  }

  pruned.push(now);
  timestampsByUser.set(userId, pruned);
  return { ok: true };
}
