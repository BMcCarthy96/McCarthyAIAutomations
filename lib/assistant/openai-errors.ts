/**
 * Maps OpenAI HTTP/API failures to safe, user-facing copy.
 * Raw bodies and technical details stay server-side (logged in development).
 */

export type AssistantFailureKind =
  | "missing_key"
  | "auth"
  | "quota"
  | "rate_limit"
  | "invalid_response"
  | "server"
  | "unknown";

const USER_SAFE: Record<AssistantFailureKind, string> = {
  missing_key:
    "Configuration required: the assistant needs a valid API key on the server.",
  auth: "Assistant temporarily unavailable. Please try again shortly.",
  quota:
    "Assistant temporarily unavailable due to usage limits. Try again later.",
  rate_limit:
    "Too many requests to the assistant right now. Please wait a moment.",
  invalid_response:
    "Assistant couldn’t process that response. Please try again.",
  server: "Assistant temporarily unavailable. Please try again in a few minutes.",
  unknown: "Assistant temporarily unavailable. Please try again shortly.",
};

export class AssistantApiError extends Error {
  readonly kind: AssistantFailureKind;
  /** Technical detail for server logs only — never send to the client. */
  readonly logDetail: string;

  constructor(kind: AssistantFailureKind, logDetail: string) {
    super(USER_SAFE[kind]);
    this.name = "AssistantApiError";
    this.kind = kind;
    this.logDetail = logDetail;
  }

  /** Safe string for UI and server action responses. */
  get userMessage(): string {
    return USER_SAFE[this.kind];
  }
}

interface OpenAiErrorBody {
  error?: {
    message?: string;
    type?: string;
    code?: string;
  };
}

function tryParseOpenAiJson(body: string): OpenAiErrorBody | null {
  try {
    return JSON.parse(body) as OpenAiErrorBody;
  } catch {
    return null;
  }
}

/**
 * Classify OpenAI chat/completions HTTP failures. Always log `logDetail` server-side.
 */
export function openAiHttpErrorToAssistantError(
  status: number,
  bodyText: string
): AssistantApiError {
  const trimmed = bodyText.trim();
  const parsed = tryParseOpenAiJson(trimmed);
  const apiMsg = parsed?.error?.message ?? "";
  const apiCode = parsed?.error?.code ?? "";
  const apiType = parsed?.error?.type ?? "";
  const combined = `${apiMsg} ${apiCode} ${apiType}`.toLowerCase();

  const logDetail = `[OpenAI ${status}] ${trimmed.slice(0, 800)}`;

  if (status === 401) {
    return new AssistantApiError("auth", logDetail);
  }

  if (status === 429) {
    if (
      combined.includes("quota") ||
      combined.includes("billing") ||
      apiCode === "insufficient_quota"
    ) {
      return new AssistantApiError("quota", logDetail);
    }
    if (
      combined.includes("rate") ||
      apiCode === "rate_limit_exceeded" ||
      apiType === "requests"
    ) {
      return new AssistantApiError("rate_limit", logDetail);
    }
    return new AssistantApiError("quota", logDetail);
  }

  if (status >= 500 && status < 600) {
    return new AssistantApiError("server", logDetail);
  }

  if (status === 400 && combined.includes("invalid")) {
    return new AssistantApiError("invalid_response", logDetail);
  }

  return new AssistantApiError("unknown", logDetail);
}

export function logAssistantFailure(err: AssistantApiError): void {
  if (process.env.NODE_ENV !== "development") return;
  console.error("[assistant] OpenAI failure:", err.kind, err.logDetail);
}

/** Non–OpenAI failures (unexpected throws) — safe for UI. */
export function assistantGenericUserMessage(): string {
  return USER_SAFE.unknown;
}
