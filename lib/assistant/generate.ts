import type { AssistantContextChunk, AssistantSourceDisplay } from "@/lib/assistant/types";

interface LlmJson {
  answer: string;
  insufficient_context?: boolean;
  cited_refs?: string[];
}

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export async function runAssistantLlm(params: {
  question: string;
  contextText: string;
  chunkByRef: Map<string, AssistantContextChunk>;
}): Promise<{
  answer: string;
  insufficientContext: boolean;
  sources: AssistantSourceDisplay[];
}> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const model =
    process.env.OPENAI_ASSISTANT_MODEL?.trim() || "gpt-4o-mini";

  const system = `You are the McCarthy AI Automations client portal assistant.
You answer questions using ONLY the CONTEXT blocks below. Each block starts with a reference id like [S1], [S2].

Rules:
- Ground every factual claim in the CONTEXT. When you use information from a block, include its reference id in cited_refs.
- If the CONTEXT does not contain enough information to answer confidently, set insufficient_context to true and give a brief, honest answer that tells the user what is missing and points them to Support or Project Updates in the portal. Do not invent project names, dates, milestones, invoices, or team messages.
- Do not reveal internal ids (UUIDs). Use human-friendly names from the context only.
- cited_refs must only contain ids that appear in the CONTEXT (e.g. S1, S2). Use an empty array if insufficient_context is true.
- Keep the answer concise and professional. Markdown is allowed (short bullets, bold sparingly).`;

  const user = `CONTEXT:\n\n${params.contextText}\n\n---\n\nQUESTION:\n${params.question}\n\nRespond with a single JSON object only, no markdown fence, with keys: answer (string), insufficient_context (boolean), cited_refs (array of strings like "S1").`;

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
    throw new Error(
      errText ? `OpenAI error (${res.status}): ${errText.slice(0, 200)}` : `OpenAI error (${res.status})`
    );
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string | null } }[];
  };
  const raw = data.choices?.[0]?.message?.content?.trim() ?? "";
  let parsed: LlmJson;
  try {
    parsed = JSON.parse(raw) as LlmJson;
  } catch {
    throw new Error("Assistant returned invalid JSON.");
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
