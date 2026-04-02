"use server";

import { getCurrentClientId } from "@/lib/portal-data";
import {
  gatherAssistantContext,
  buildContextPromptText,
} from "@/lib/assistant/gather-context";
import { runAssistantLlm } from "@/lib/assistant/generate";
import {
  AssistantApiError,
  assistantGenericUserMessage,
} from "@/lib/assistant/openai-errors";
import type { AssistantAskState } from "@/lib/assistant/types";

const QUESTION_MAX = 2_000;

/**
 * Client-scoped Knowledge Assistant. Resolves client only via Clerk → getCurrentClientId().
 * No clientId from the browser is accepted.
 */
export async function askAssistantAction(
  _prev: AssistantAskState | null,
  formData: FormData
): Promise<AssistantAskState> {
  const clientId = await getCurrentClientId();
  if (!clientId) {
    return {
      success: false,
      error:
        "Your account is not linked to a client record. Contact your account manager to use the assistant.",
    };
  }

  const question = (formData.get("question") as string)?.trim() ?? "";
  if (!question) {
    return { success: false, error: "Please enter a question." };
  }
  if (question.length > QUESTION_MAX) {
    return {
      success: false,
      error: `Please keep your question under ${QUESTION_MAX} characters.`,
    };
  }

  try {
    const chunks = await gatherAssistantContext(clientId);
    const chunkByRef = new Map(chunks.map((c) => [c.ref, c]));
    const contextText = buildContextPromptText(chunks);

    if (!process.env.OPENAI_API_KEY?.trim()) {
      return {
        success: false,
        error:
          "The assistant is not configured yet (missing OPENAI_API_KEY). Your team can enable it in production settings.",
      };
    }

    const result = await runAssistantLlm({
      question,
      contextText,
      chunkByRef,
    });

    return {
      success: true,
      answer: result.answer,
      insufficientContext: result.insufficientContext,
      sources: result.sources,
    };
  } catch (e) {
    if (e instanceof AssistantApiError) {
      if (process.env.NODE_ENV === "development") {
        console.error("[assistant]", e.kind, e.logDetail);
      } else {
        console.error("[assistant] failure kind:", e.kind);
      }
      return { success: false, error: e.userMessage };
    }
    if (process.env.NODE_ENV === "development") {
      console.error("[assistant] unexpected error:", e);
    }
    return { success: false, error: assistantGenericUserMessage() };
  }
}
