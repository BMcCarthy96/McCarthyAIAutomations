/**
 * Rate limiter for unauthenticated public widget queries (keyed by IP).
 * Uses Upstash Redis for distributed enforcement across serverless instances.
 * Limit: 15 requests per 60 seconds per IP address.
 */

import { checkRateLimit } from "@/lib/rate-limit";

export async function checkWidgetPublicRateLimit(key: string): Promise<
  | { ok: true }
  | { ok: false; message: string }
> {
  const result = await checkRateLimit(key, {
    prefix: "assistant:widget",
    max: 15,
    windowSecs: 60,
  });

  if (!result.ok) {
    return { ok: false, message: result.message ?? "Too many requests. Please try again shortly." };
  }
  return { ok: true };
}
