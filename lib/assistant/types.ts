/**
 * Client-scoped Knowledge Assistant — shared types.
 * All retrieval is keyed by server-resolved clientId only (never from client input).
 */

export type AssistantSourceKind =
  | "account"
  | "service_plan"
  | "project"
  | "milestone"
  | "project_update"
  | "support_thread"
  | "billing"
  | "global_faq";

export interface AssistantContextChunk {
  /** Stable citation id, e.g. S1, S2 (assigned when building prompt). */
  ref: string;
  kind: AssistantSourceKind;
  /** Human-readable label for UI (no raw UUIDs). */
  label: string;
  /** Text passed to the model for this chunk only. */
  content: string;
}

export interface AssistantSourceDisplay {
  ref: string;
  kind: AssistantSourceKind;
  label: string;
}

export type AssistantAskState =
  | { success: false; error: string }
  | {
      success: true;
      /** Echo of the question (form resets after submit). */
      question: string;
      answer: string;
      insufficientContext: boolean;
      sources: AssistantSourceDisplay[];
    };

/** Short category line for citations (portfolio-quality labels). */
export function assistantSourceKindTitle(kind: AssistantSourceKind): string {
  switch (kind) {
    case "account":
      return "Account";
    case "service_plan":
      return "Service plan";
    case "project":
      return "Project";
    case "milestone":
      return "Milestone";
    case "project_update":
      return "Project update";
    case "support_thread":
      return "Support";
    case "billing":
      return "Billing";
    case "global_faq":
      return "FAQ";
    default:
      return "Source";
  }
}
