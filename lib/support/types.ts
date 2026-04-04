/**
 * Support domain types for admin (list/detail views and list filter).
 */

import type { AiLeadAnalysisStatus, AiLeadTemperature } from "@/lib/lead-ai/types";

/** Lead follow-up pipeline for public consultation rows (admin list). */
export type AdminLeadFollowUpListState =
  | "pending"
  | "sent"
  | "suppressed"
  | "ineligible"
  | "closed_before_send";

/** Support request with client name for admin list. */
export interface AdminSupportRow {
  id: string;
  subject: string;
  status: string;
  createdAt: string;
  /** Linked client organization name when client_id is set. */
  clientName: string | null;
  /** Public submitter display, e.g. "Jane · jane@example.com", when not a client submission. */
  publicContact: string | null;
  /** Distinct UI badge: portal client vs marketing-site submission. */
  source: "client" | "public";
  /** Public consultation lead follow-up (null for client portal requests). */
  leadFollowUp: AdminLeadFollowUpListState | null;
  /** AI Lead Engine — null for client portal rows or not yet processed. */
  aiLeadTemperature: AiLeadTemperature | null;
  aiLeadAnalysisStatus: AiLeadAnalysisStatus | null;
}

/** Stored admin reply on a support thread. */
export interface AdminSupportReply {
  id: string;
  body: string;
  senderType: string;
  createdAt: string;
}

/** Support request detail for admin view (body, client, project). */
export interface AdminSupportDetail {
  id: string;
  subject: string;
  body: string | null;
  status: string;
  createdAt: string;
  clientName: string | null;
  /** Linked client primary email (for admin replies); null for public-only rows. */
  clientEmail: string | null;
  requesterName: string | null;
  requesterEmail: string | null;
  source: "client" | "public";
  projectName: string | null;
  replies: AdminSupportReply[];
  /** Public consultation lead follow-up automation (client rows: always ineligible / N/A). */
  leadFollowUpEligible: boolean;
  followUpSentAt: string | null;
  /** When true, cron/manual batch skips this lead for follow-up (public rows only). */
  leadFollowUpSuppressed: boolean;
  /** AI Lead Engine (public leads); omitted fields are null when not analyzed. */
  aiLeadAnalysisStatus: AiLeadAnalysisStatus | null;
  aiLeadSummary: string | null;
  aiBusinessType: string | null;
  aiLikelyService: string | null;
  aiUrgency: string | null;
  aiBudgetSignal: string | null;
  aiLeadTemperature: AiLeadTemperature | null;
  aiConfidence: number | null;
  aiNextAction: string | null;
  aiFollowUpTone: string | null;
  aiSuggestedReply: string | null;
  aiClassificationNote: string | null;
  aiProcessedAt: string | null;
  /** Internal-only; shown to admins for debugging failed runs. */
  aiErrorMessage: string | null;
  aiModel: string | null;
}

export type SupportRequestListView = "active" | "resolved" | "closed" | "all";
