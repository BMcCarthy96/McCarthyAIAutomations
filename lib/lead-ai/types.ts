/**
 * Structured output from the public-lead AI classifier (MVP).
 * Values are normalized in analyze-public-lead.ts.
 */

export type AiUrgencyLevel = "low" | "medium" | "high" | "unknown";
export type AiBudgetSignal = "low" | "medium" | "high" | "unknown";
export type AiLeadTemperature = "cold" | "warm" | "hot" | "unknown";
export type AiLeadAnalysisStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "skipped";

/** Raw JSON from the model before normalization. */
export interface LeadAnalysisLlmPayload {
  lead_summary?: unknown;
  business_type?: unknown;
  likely_service?: unknown;
  urgency_level?: unknown;
  budget_signal?: unknown;
  lead_temperature?: unknown;
  confidence_score?: unknown;
  recommended_next_action?: unknown;
  recommended_follow_up_tone?: unknown;
  suggested_reply?: unknown;
  classification_note?: unknown;
}

export interface NormalizedLeadAnalysis {
  ai_lead_summary: string | null;
  ai_business_type: string | null;
  ai_likely_service: string | null;
  ai_urgency: AiUrgencyLevel;
  ai_budget_signal: AiBudgetSignal;
  ai_lead_temperature: AiLeadTemperature;
  ai_confidence: number | null;
  ai_next_action: string | null;
  ai_follow_up_tone: string | null;
  ai_suggested_reply: string | null;
  ai_classification_note: string | null;
}
