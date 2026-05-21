/**
 * Rate limiter for authenticated (Clerk) assistant queries.
 * Uses Upstash Redis for distributed enforcement across serverless instances.
 * Limit: 15 requests per 60 seconds per Clerk user ID.
 */

import { checkRateLimit } from "@/lib/rate-limit";

export async function checkAssistantRateLimit(userId: string): Promise<
  | { ok: true }
  | { ok: false; message: string }
> {
  const result = await checkRateLimit(userId, {
    prefix: "assistant:auth",
    max: 15,
    windowSecs: 60,
  });

  if (!result.ok) {
    return { ok: false, message: result.message ?? "Too many assistant requests. Please try again shortly." };
  }
  return { ok: true };
}
