"use server";

import { auth } from "@clerk/nextjs/server";
import { getCurrentClientId } from "@/lib/portal-data";
import {
  gatherAssistantContext,
  buildContextPromptText,
} from "@/lib/assistant/gather-context";
import {
  assignChunkRefs,
  selectRelevantChunks,
} from "@/lib/assistant/select-context";
import { runAssistantLlm } from "@/lib/assistant/generate";
import {
  AssistantApiError,
  assistantGenericUserMessage,
} from "@/lib/assistant/openai-errors";
import { checkAssistantRateLimit } from "@/lib/assistant/rate-limit";
import { getPortalDemoMode } from "@/lib/demo-portal";
import {
  getAssistantCached,
  setAssistantCached,
} from "@/lib/assistant/response-cache";
import type { AssistantAskState } from "@/lib/assistant/types";

const QUESTION_MAX = 2_000;
const CONTEXT_CHAR_CAP = 10_000;
const MAX_CONTEXT_CHUNKS = 10;

/**
 * Client-scoped Knowledge Assistant. Resolves client only via Clerk → getCurrentClientId().
 * No clientId from the browser is accepted.
 */
export async function askAssistantAction(
  _prev: AssistantAskState | null,
  formData: FormData
): Promise<AssistantAskState> {
  const { userId } = await auth();
  if (!userId) {
    return {
      success: false,
      error: "Sign in to use the Knowledge Assistant.",
    };
  }

  const rl = checkAssistantRateLimit(userId);
  if (!rl.ok) {
    return { success: false, error: rl.message };
  }

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

  const cached = getAssistantCached(clientId, question);
  if (cached) {
    return cached;
  }

  if (!process.env.OPENAI_API_KEY?.trim()) {
    return {
      success: false,
      error:
        "Configuration required: the assistant needs an API key on the server. Contact your team.",
    };
  }

  try {
    const isDemoAccount = await getPortalDemoMode();
    const rawChunks = await gatherAssistantContext(clientId);
    const selected = selectRelevantChunks(rawChunks, question, {
      maxChunks: MAX_CONTEXT_CHUNKS,
    });
    const withRefs = assignChunkRefs(selected);
    const contextText = buildContextPromptText(withRefs, CONTEXT_CHAR_CAP);
    const chunkByRef = new Map(withRefs.map((c) => [c.ref, c]));

    const result = await runAssistantLlm({
      question,
      contextText,
      chunkByRef,
      profile: "portal",
      demoAccount: isDemoAccount,
    });

    const success: AssistantAskState = {
      success: true,
      question,
      answer: result.answer,
      insufficientContext: result.insufficientContext,
      sources: result.sources,
    };

    setAssistantCached(clientId, question, success);

    return success;
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
