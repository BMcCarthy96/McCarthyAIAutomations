import type { AssistantAskState } from "@/lib/assistant/types";

type SuccessState = Extract<AssistantAskState, { success: true }>;

const TTL_MS = 90_000;
const cache = new Map<string, { expires: number; value: SuccessState }>();

function normalizeQuestion(q: string): string {
  return q.toLowerCase().replace(/\s+/g, " ").trim().slice(0, 500);
}

export function assistantCacheKey(clientId: string, question: string): string {
  return `${clientId}::${normalizeQuestion(question)}`;
}

export function getAssistantCached(
  clientId: string,
  question: string
): SuccessState | null {
  const key = assistantCacheKey(clientId, question);
  const row = cache.get(key);
  if (!row) return null;
  if (Date.now() > row.expires) {
    cache.delete(key);
    return null;
  }
  return row.value;
}

export function setAssistantCached(
  clientId: string,
  question: string,
  value: SuccessState
): void {
  const key = assistantCacheKey(clientId, question);
  cache.set(key, { expires: Date.now() + TTL_MS, value });
}
