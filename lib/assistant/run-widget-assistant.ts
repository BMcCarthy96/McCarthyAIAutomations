/**
 * Shared server entry for the site-wide assistant widget (API route).
 * Mode is derived server-side from auth + client link + demo flags — never from client body alone.
 */

import { headers } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { getCurrentClientId } from "@/lib/portal-data";
import { getPortalDemoMode } from "@/lib/demo-portal";
import {
  gatherAssistantContext,
  buildContextPromptText,
} from "@/lib/assistant/gather-context";
import {
  assignChunkRefs,
  selectRelevantChunks,
} from "@/lib/assistant/select-context";
import { gatherPublicWidgetChunks } from "@/lib/assistant/public-widget-context";
import {
  ensurePublicWidgetChunksSelected,
  sortPublicWidgetChunksForPrompt,
} from "@/lib/assistant/public-widget-knowledge";
import { runAssistantLlm } from "@/lib/assistant/generate";
import {
  AssistantApiError,
  assistantGenericUserMessage,
} from "@/lib/assistant/openai-errors";
import { checkAssistantRateLimit } from "@/lib/assistant/rate-limit";
import { checkWidgetPublicRateLimit } from "@/lib/assistant/widget-rate-limit";
import {
  getAssistantCached,
  setAssistantCached,
} from "@/lib/assistant/response-cache";
import type {
  AssistantAskState,
  AssistantContextChunk,
  AssistantSourceDisplay,
} from "@/lib/assistant/types";

export type WidgetAssistantMode = "public" | "demo" | "client";

export type WidgetAssistantApiResponse =
  | { success: false; error: string; openAiConfigured: boolean }
  | {
      success: true;
      mode: WidgetAssistantMode;
      question: string;
      answer: string;
      insufficientContext: boolean;
      sources: AssistantSourceDisplay[];
      openAiConfigured: true;
    };

const QUESTION_MAX = 2_000;
const CONTEXT_CHAR_CAP = 10_000;
const MAX_CONTEXT_CHUNKS = 10;
const PUBLIC_CACHE_ID = "widget-public";

function clientIpHint(h: Headers): string {
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return h.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Run a widget assistant turn. Caller supplies pathname from the browser for hints only.
 */
export async function runWidgetAssistantQuery(input: {
  question: string;
  pathname: string;
}): Promise<WidgetAssistantApiResponse> {
  const openAiConfigured = Boolean(process.env.OPENAI_API_KEY?.trim());
  const question = input.question.trim();
  const pathname =
    typeof input.pathname === "string" && input.pathname.startsWith("/")
      ? input.pathname.slice(0, 500)
      : "/";

  if (!question) {
    return { success: false, error: "Please enter a question.", openAiConfigured };
  }
  if (question.length > QUESTION_MAX) {
    return {
      success: false,
      error: `Please keep your question under ${QUESTION_MAX} characters.`,
      openAiConfigured,
    };
  }

  if (!openAiConfigured) {
    return {
      success: false,
      error:
        "The assistant is not configured yet. Please use Contact or Book a Call—we’ll respond personally.",
      openAiConfigured: false,
    };
  }

  const { userId } = await auth();
  const clientId = await getCurrentClientId();
  const isDemo = await getPortalDemoMode();

  /** Marketing routes use public CONTEXT + public_widget profile even when the user is signed in. */
  const widgetUsesPortalContext =
    Boolean(userId && clientId) && pathname.startsWith("/dashboard");

  let mode: WidgetAssistantMode = "public";
  if (widgetUsesPortalContext) {
    mode = isDemo ? "demo" : "client";
  }

  if (userId) {
    const rl = checkAssistantRateLimit(userId);
    if (!rl.ok) {
      return { success: false, error: rl.message, openAiConfigured: true };
    }
  } else {
    const h = await headers();
    const ipKey = `public:${clientIpHint(h)}`;
    const rl = checkWidgetPublicRateLimit(ipKey);
    if (!rl.ok) {
      return { success: false, error: rl.message, openAiConfigured: true };
    }
  }

  if (widgetUsesPortalContext && clientId) {
    const cached = getAssistantCached(clientId, question);
    if (cached) {
      return {
        success: true,
        mode,
        question: cached.question,
        answer: cached.answer,
        insufficientContext: cached.insufficientContext,
        sources: cached.sources,
        openAiConfigured: true,
      };
    }
  } else {
    const cached = getAssistantCached(PUBLIC_CACHE_ID, question);
    if (cached) {
      return {
        success: true,
        mode: "public",
        question: cached.question,
        answer: cached.answer,
        insufficientContext: cached.insufficientContext,
        sources: cached.sources,
        openAiConfigured: true,
      };
    }
  }

  try {
    let rawChunks: AssistantContextChunk[];
    let selected: AssistantContextChunk[];

    if (mode === "public") {
      rawChunks = gatherPublicWidgetChunks(pathname);
      selected = selectRelevantChunks(rawChunks, question, {
        maxChunks: MAX_CONTEXT_CHUNKS,
        publicWidget: true,
      });
      selected = ensurePublicWidgetChunksSelected(
        rawChunks,
        selected,
        question,
        MAX_CONTEXT_CHUNKS
      );
      selected = sortPublicWidgetChunksForPrompt(selected);
    } else {
      rawChunks = await gatherAssistantContext(clientId!);
      selected = selectRelevantChunks(rawChunks, question, {
        maxChunks: MAX_CONTEXT_CHUNKS,
      });
    }

    const withRefs = assignChunkRefs(selected);
    const contextText = buildContextPromptText(withRefs, CONTEXT_CHAR_CAP);
    const chunkByRef = new Map(withRefs.map((c) => [c.ref, c]));

    const result = await runAssistantLlm({
      question,
      contextText,
      chunkByRef,
      profile: mode === "public" ? "public_widget" : "portal",
      pathname: mode === "public" ? pathname : undefined,
      demoAccount: mode === "demo",
    });

    const success: Extract<WidgetAssistantApiResponse, { success: true }> = {
      success: true,
      mode,
      question,
      answer: result.answer,
      insufficientContext: result.insufficientContext,
      sources: result.sources,
      openAiConfigured: true,
    };

    const cacheStoreId = mode === "public" ? PUBLIC_CACHE_ID : clientId!;
    const forCache: Extract<AssistantAskState, { success: true }> = {
      success: true,
      question,
      answer: result.answer,
      insufficientContext: result.insufficientContext,
      sources: result.sources,
    };
    setAssistantCached(cacheStoreId, question, forCache);

    return success;
  } catch (e) {
    if (e instanceof AssistantApiError) {
      if (process.env.NODE_ENV === "development") {
        console.error("[assistant-widget]", e.kind, e.logDetail);
      } else {
        console.error("[assistant-widget] failure kind:", e.kind);
      }
      return { success: false, error: e.userMessage, openAiConfigured: true };
    }
    if (process.env.NODE_ENV === "development") {
      console.error("[assistant-widget] unexpected error:", e);
    }
    return {
      success: false,
      error: assistantGenericUserMessage(),
      openAiConfigured: true,
    };
  }
}
