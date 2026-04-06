import type { AssistantContextChunk, AssistantSourceDisplay } from "@/lib/assistant/types";
import {
  AssistantApiError,
  logAssistantFailure,
  openAiHttpErrorToAssistantError,
} from "@/lib/assistant/openai-errors";

interface LlmJson {
  answer: string;
  insufficient_context?: boolean;
  cited_refs?: string[];
}

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export type AssistantLlmProfile = "portal" | "public_widget";

export async function runAssistantLlm(params: {
  question: string;
  contextText: string;
  chunkByRef: Map<string, AssistantContextChunk>;
  /** Default portal — same behavior as historical dashboard assistant. */
  profile?: AssistantLlmProfile;
  /** Browsing path for light tone hints (public widget). */
  pathname?: string;
  /** Portal profile only: demo showcase account — stay accurate that data is illustrative. */
  demoAccount?: boolean;
}): Promise<{
  answer: string;
  insufficientContext: boolean;
  sources: AssistantSourceDisplay[];
}> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new AssistantApiError(
      "missing_key",
      "OPENAI_API_KEY is not set in environment."
    );
  }

  const model =
    process.env.OPENAI_ASSISTANT_MODEL?.trim() || "gpt-4o-mini";

  const profile = params.profile ?? "portal";

  const portalSystem = `McCarthy client portal assistant. Use ONLY CONTEXT blocks marked [S1], [S2], …

- Ground every fact in CONTEXT; add that block's id to cited_refs when you use it.
- If CONTEXT is too thin to answer safely, set insufficient_context true, say what's missing briefly, suggest Support / Project updates—never invent projects, dates, invoices, or messages.
- No UUIDs; names from CONTEXT only. cited_refs must be ids from CONTEXT only; use [] if insufficient_context.
- Concise, professional; light markdown OK.${params.demoAccount ? "\n- The user is on a live demo account: CONTEXT may reflect sample/seed data—describe it as illustrative; never imply it is confidential customer production data." : ""}`;

  const publicSystem = `You are the McCarthy AI Automations website assistant. Use ONLY CONTEXT blocks marked [S1], [S2], …

- CONTEXT contains public marketing information, service summaries, FAQs, and routing hints—not private client data.
- Ground every factual claim in CONTEXT; add that block's id to cited_refs when you use it.
- Never claim to see or use a visitor's private projects, invoices, passwords, or other customers' information.
- If CONTEXT is too thin to answer safely, set insufficient_context true, answer briefly, and suggest a free consultation via the Contact page or booking when appropriate.
- Do not invent prices, URLs, or guarantees. Do not pretend you scheduled meetings or sent emails.
- Be concise, helpful, and professional; light markdown OK. Encourage discovery call / contact when it fits naturally.`;

  const system = profile === "public_widget" ? publicSystem : portalSystem;

  const pathNote =
    profile === "public_widget" && params.pathname
      ? `\n\nVisitor path (for tone only; do not invent page-specific private facts): ${params.pathname}\n`
      : "";

  const user = `CONTEXT:\n\n${params.contextText}\n\n---\n\nQ:\n${params.question}${pathNote}\n\nReply with one JSON object only (no markdown fences): {"answer":"string","insufficient_context":boolean,"cited_refs":["S1"]}`;

  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 1_200,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    const classified = openAiHttpErrorToAssistantError(res.status, errText);
    logAssistantFailure(classified);
    throw classified;
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string | null } }[];
  };
  const raw = data.choices?.[0]?.message?.content?.trim() ?? "";
  let parsed: LlmJson;
  try {
    parsed = JSON.parse(raw) as LlmJson;
  } catch {
    const classified = new AssistantApiError(
      "invalid_response",
      `Model JSON parse failed. Raw (truncated): ${raw.slice(0, 500)}`
    );
    logAssistantFailure(classified);
    throw classified;
  }

  const answer =
    typeof parsed.answer === "string" && parsed.answer.trim()
      ? parsed.answer.trim()
      : "I could not generate a grounded answer from your account data.";

  const insufficientContext = Boolean(parsed.insufficient_context);
  const cited = Array.isArray(parsed.cited_refs)
    ? parsed.cited_refs.filter((r): r is string => typeof r === "string")
    : [];

  const normalized = cited.map((r) => r.replace(/^\[/, "").replace(/\]$/, "").trim());
  const validRefs = new Set(params.chunkByRef.keys());
  const uniqueRefs = [...new Set(normalized)].filter((r) => validRefs.has(r));

  const sources: AssistantSourceDisplay[] = uniqueRefs.map((ref) => {
    const ch = params.chunkByRef.get(ref)!;
    return { ref, kind: ch.kind, label: ch.label };
  });

  return {
    answer,
    insufficientContext: insufficientContext,
    sources,
  };
}
