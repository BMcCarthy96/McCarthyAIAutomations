/**
 * Claude Haiku lead classification path — shadow/replace alternative to the OpenAI classifier.
 *
 * - Returns the same NormalizedLeadAnalysis shape as the OpenAI path.
 * - Server-only. Never import from client-side code.
 * - The system prompt block is marked for prompt caching (cache_control: ephemeral) so
 *   repeated classifications reuse the cached prompt and reduce input token costs.
 * - This file is only active when USE_CLAUDE_LEAD_CLASSIFIER is "shadow" or "true".
 *   Default production behaviour is unchanged (OpenAI path in analyze-public-lead.ts).
 */

import { getAnthropicClient } from "@/lib/llm/anthropic-client";
import { normalizeLeadAnalysisPayload } from "@/lib/lead-ai/analyze-public-lead";
import type { LeadAnalysisLlmPayload, NormalizedLeadAnalysis } from "@/lib/lead-ai/types";

export const CLAUDE_LEAD_CLASSIFIER_MODEL = "claude-haiku-4-5-20251001";

/**
 * Identical to the OpenAI system prompt so outputs are directly comparable in shadow mode.
 * Marked with cache_control so the Anthropic platform caches this block across requests,
 * reducing input token billing on the static portion by ~90% after the first call.
 */
const SYSTEM_PROMPT =
  "You classify B2B service leads for an AI automation consultancy. Output strictly valid JSON matching the user schema. Follow the user's temperature and urgency rules; ground every label in the message. Prefer unknown only when the text does not support a label—do not default to warm when hot signals (urgency + concrete pain/volume + intent) are present.";

/**
 * Run Claude Haiku classification on the same userContent string produced by buildUserContent().
 * Throws on missing API key, HTTP error, or JSON parse failure — callers must handle.
 */
export async function callClaudeLeadClassifier(
  userContent: string
): Promise<NormalizedLeadAnalysis> {
  const client = getAnthropicClient();
  if (!client) {
    throw new Error("ANTHROPIC_API_KEY missing — cannot run Claude lead classifier");
  }

  const response = await client.messages.create({
    model: CLAUDE_LEAD_CLASSIFIER_MODEL,
    max_tokens: 900,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        // Cache this static block so repeat classifications don't re-bill for it.
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userContent }],
  });

  const block = response.content[0];
  if (!block || block.type !== "text") {
    throw new Error("Claude classifier returned no text block");
  }

  // Strip markdown code fences if the model wraps its JSON output.
  const raw = block.text.trim();
  const jsonStr = raw.startsWith("```")
    ? raw.replace(/^```(?:json)?\r?\n?/, "").replace(/\r?\n?```$/, "").trim()
    : raw;

  let parsed: LeadAnalysisLlmPayload;
  try {
    parsed = JSON.parse(jsonStr) as LeadAnalysisLlmPayload;
  } catch {
    throw new Error(`Claude classifier JSON parse failed: ${raw.slice(0, 200)}`);
  }

  return normalizeLeadAnalysisPayload(parsed);
}
