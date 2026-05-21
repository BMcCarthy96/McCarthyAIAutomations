/**
 * Shared Anthropic SDK client factory.
 * Server-only — never import from client-side code or pages/components.
 *
 * Returns null when ANTHROPIC_API_KEY is absent so callers can fail gracefully.
 */

import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return null;
  if (!_client) {
    _client = new Anthropic({ apiKey });
  }
  return _client;
}
