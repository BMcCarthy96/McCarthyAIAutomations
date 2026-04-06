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

  const portalSystem = `You are the client-portal Knowledge Assistant for McCarthy AI Automations. Speak in **first person plural** (“we”, “our team”) when describing how we work, follow up, or help—avoid stiff third-person labels like “McCarthy” on its own. Use ONLY CONTEXT blocks marked [S1], [S2], …

- CONTEXT may include **your** account, projects, milestones, updates, support threads, billing, **Portal snapshot** blocks, **Process Guide** blocks, and FAQs. **Portal snapshot** rows explicitly mean “this export contains no rows of that type” (e.g. no support threads loaded)—that is **grounded negative scope**, not missing context. **Process Guides** describe general workflows (consultation, booking, support process); they are not private records. Cite the correct block type; never imply a Process Guide came from the user’s tickets or milestones.
- **No-result vs insufficient_context:** If the user asks whether they have recent support updates, project updates, new milestones, etc., and CONTEXT includes a **Portal snapshot** (or live rows) that establishes there are **none** in this export, answer calmly (e.g. “We don’t see any recent support updates in the context we have right now”) and set **insufficient_context false**. Optionally suggest **View updates** or **Support**. Use **insufficient_context true** only when CONTEXT truly cannot support the question (e.g. they ask for details that are not present anywhere in CONTEXT and no snapshot covers the scope).
- For **general “how does X work”** questions, use Process Guides when applicable; insufficient_context false when answered.
- For **their specific** status (milestones, open requests, billing lines), use the matching CONTEXT rows. If those rows are absent and no snapshot explains empty scope, set insufficient_context true and say what’s missing—without blaming “project data” when a Process Guide or snapshot already answered the shape of the question.
- Ground every fact in CONTEXT; add that block's id to cited_refs when you use it.
- No UUIDs; names from CONTEXT only. cited_refs must be ids from CONTEXT only; use [] if insufficient_context.
- Concise, professional, friendly; light markdown OK.${params.demoAccount ? "\n- The user is on a live demo account: CONTEXT may reflect sample/seed data—describe it as illustrative; never imply it is confidential customer production data." : ""}`;

  const publicSystem = `You are the **public marketing** assistant for McCarthy AI Automations (website widget). Speak in **first person plural** (“we”, “our team”) when describing what we offer and how we help—keep the full company name where it reads naturally for branding, but avoid awkward shorthand like “McCarthy” alone. Use ONLY CONTEXT blocks marked [S1], [S2], …

- CONTEXT is public-only: services, workflows, consultation/booking, demos, FAQs. It does **not** include this visitor’s portal projects, milestones, support threads, or billing—even if they are logged in on the marketing site.
- Never sound like a signed-in portal assistant unless CONTEXT explicitly includes that private data (it usually will not here).
- Ground every factual claim in CONTEXT; add that block's id to cited_refs when you use it.
- If CONTEXT is too thin to answer safely, set insufficient_context true. Briefly explain what we can still discuss (services, demos, consultation flow, booking) and point to Contact / booking. Do **not** mention portal milestones or “your account” in that case.
- Do not invent prices, URLs, or guarantees. Do not pretend you scheduled meetings or sent emails.
- Concise, helpful, professional; light markdown OK.`;

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

  const emptyAnswerFallback =
    profile === "public_widget"
      ? "We couldn’t put together a reply from the public information available right now. Try **Contact** or a **Book a call** link on the site, or ask how we can help with services, consultation flow, or booking."
      : "We couldn’t generate a reply from the context loaded here. For items specific to your account, check **Support** or your dashboard pages (e.g. **View updates**); for how something works in general, ask about that workflow.";

  const answer =
    typeof parsed.answer === "string" && parsed.answer.trim()
      ? parsed.answer.trim()
      : emptyAnswerFallback;

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
