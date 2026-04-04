/**
 * Admin support data: read-only Supabase queries for /admin/support.
 */

import { getSupabaseServiceClient } from "@/lib/supabase";
import type {
  AdminSupportRow,
  AdminSupportDetail,
  AdminSupportReply,
  AdminLeadFollowUpListState,
  SupportRequestListView,
} from "./types";

export type {
  AdminSupportRow,
  AdminSupportDetail,
  AdminSupportReply,
  AdminLeadFollowUpListState,
  SupportRequestListView,
};

function computePublicLeadFollowUp(
  row: {
    client_id: string | null;
    lead_follow_up_eligible: boolean;
    follow_up_sent_at: string | null;
    lead_follow_up_suppressed: boolean;
    status: string;
  }
): AdminLeadFollowUpListState | null {
  if (row.client_id !== null) return null;
  if (!row.lead_follow_up_eligible) return "ineligible";
  if (row.follow_up_sent_at) return "sent";
  if (row.lead_follow_up_suppressed) return "suppressed";
  if (row.status === "open" || row.status === "in_progress") return "pending";
  return "closed_before_send";
}

export async function getAllSupportRequests(
  view: SupportRequestListView = "active"
): Promise<AdminSupportRow[]> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  let query = supabase
    .from("support_requests")
    .select(
      "id, subject, status, created_at, client_id, requester_name, requester_email, lead_follow_up_eligible, follow_up_sent_at, lead_follow_up_suppressed, ai_lead_temperature, ai_lead_analysis_status, clients(name)"
    )
    .order("created_at", { ascending: false });

  if (view === "active") {
    query = query.in("status", ["open", "in_progress"]);
  } else if (view === "resolved") {
    query = query.eq("status", "resolved");
  } else if (view === "closed") {
    query = query.eq("status", "closed");
  }

  const { data, error } = await query;

  if (error || !data) return [];

  type Row = {
    id: string;
    subject: string;
    status: string;
    created_at: string;
    client_id: string | null;
    requester_name: string | null;
    requester_email: string | null;
    lead_follow_up_eligible: boolean;
    follow_up_sent_at: string | null;
    lead_follow_up_suppressed: boolean;
    ai_lead_temperature: string | null;
    ai_lead_analysis_status: string | null;
    clients: { name: string } | null;
  };

  return data.map((row: Row) => {
    const isPublic = row.client_id === null;
    const clientName = row.clients?.name ?? null;
    const publicContact =
      isPublic && (row.requester_name || row.requester_email)
        ? [row.requester_name, row.requester_email].filter(Boolean).join(" · ")
        : null;
    const aiLeadTemperature =
      row.ai_lead_temperature === "cold" ||
      row.ai_lead_temperature === "warm" ||
      row.ai_lead_temperature === "hot" ||
      row.ai_lead_temperature === "unknown"
        ? row.ai_lead_temperature
        : null;
    const aiLeadAnalysisStatus =
      row.ai_lead_analysis_status === "pending" ||
      row.ai_lead_analysis_status === "processing" ||
      row.ai_lead_analysis_status === "completed" ||
      row.ai_lead_analysis_status === "failed" ||
      row.ai_lead_analysis_status === "skipped"
        ? row.ai_lead_analysis_status
        : null;
    return {
      id: row.id,
      subject: row.subject,
      status: row.status,
      createdAt: row.created_at,
      clientName,
      publicContact,
      source: isPublic ? ("public" as const) : ("client" as const),
      leadFollowUp: computePublicLeadFollowUp({
        client_id: row.client_id,
        lead_follow_up_eligible: Boolean(row.lead_follow_up_eligible),
        follow_up_sent_at: row.follow_up_sent_at,
        lead_follow_up_suppressed: Boolean(row.lead_follow_up_suppressed),
        status: row.status,
      }),
      aiLeadTemperature: isPublic ? aiLeadTemperature : null,
      aiLeadAnalysisStatus: isPublic ? aiLeadAnalysisStatus : null,
    };
  });
}

export async function getSupportRequestById(
  id: string
): Promise<AdminSupportDetail | null> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("support_requests")
    .select(
      "id, subject, body, status, created_at, client_id, requester_name, requester_email, requester_phone, lead_follow_up_eligible, follow_up_sent_at, lead_follow_up_suppressed, ai_lead_analysis_status, ai_lead_summary, ai_business_type, ai_likely_service, ai_urgency, ai_budget_signal, ai_lead_temperature, ai_confidence, ai_next_action, ai_follow_up_tone, ai_suggested_reply, ai_classification_note, ai_processed_at, ai_error_message, ai_model, clients(name, email), projects(name), support_replies(id, body, sender_type, created_at)"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as {
    id: string;
    subject: string;
    body: string | null;
    status: string;
    created_at: string;
    client_id: string | null;
    requester_name: string | null;
    requester_email: string | null;
    requester_phone: string | null;
    lead_follow_up_eligible: boolean;
    follow_up_sent_at: string | null;
    lead_follow_up_suppressed: boolean;
    ai_lead_analysis_status: string | null;
    ai_lead_summary: string | null;
    ai_business_type: string | null;
    ai_likely_service: string | null;
    ai_urgency: string | null;
    ai_budget_signal: string | null;
    ai_lead_temperature: string | null;
    ai_confidence: number | null;
    ai_next_action: string | null;
    ai_follow_up_tone: string | null;
    ai_suggested_reply: string | null;
    ai_classification_note: string | null;
    ai_processed_at: string | null;
    ai_error_message: string | null;
    ai_model: string | null;
    clients: { name: string; email: string } | null;
    projects: { name: string } | null;
    support_replies:
      | { id: string; body: string; sender_type: string; created_at: string }[]
      | null;
  };
  const isPublic = row.client_id === null;
  const aiLeadTemperature =
    row.ai_lead_temperature === "cold" ||
    row.ai_lead_temperature === "warm" ||
    row.ai_lead_temperature === "hot" ||
    row.ai_lead_temperature === "unknown"
      ? row.ai_lead_temperature
      : null;
  const aiLeadAnalysisStatus =
    row.ai_lead_analysis_status === "pending" ||
    row.ai_lead_analysis_status === "processing" ||
    row.ai_lead_analysis_status === "completed" ||
    row.ai_lead_analysis_status === "failed" ||
    row.ai_lead_analysis_status === "skipped"
      ? row.ai_lead_analysis_status
      : null;
  const rawReplies = row.support_replies ?? [];
  const replies = [...rawReplies]
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    .map((r) => ({
      id: r.id,
      body: r.body,
      senderType: r.sender_type,
      createdAt: r.created_at,
    }));
  return {
    id: row.id,
    subject: row.subject,
    body: row.body,
    status: row.status,
    createdAt: row.created_at,
    clientName: row.clients?.name ?? null,
    clientEmail: row.clients?.email?.trim() || null,
    requesterName: row.requester_name,
    requesterEmail: row.requester_email,
    requesterPhone: row.requester_phone,
    source: isPublic ? ("public" as const) : ("client" as const),
    projectName: row.projects?.name ?? null,
    replies,
    leadFollowUpEligible: Boolean(row.lead_follow_up_eligible),
    followUpSentAt: row.follow_up_sent_at,
    leadFollowUpSuppressed: Boolean(row.lead_follow_up_suppressed),
    aiLeadAnalysisStatus: isPublic ? aiLeadAnalysisStatus : null,
    aiLeadSummary: isPublic ? row.ai_lead_summary : null,
    aiBusinessType: isPublic ? row.ai_business_type : null,
    aiLikelyService: isPublic ? row.ai_likely_service : null,
    aiUrgency: isPublic ? row.ai_urgency : null,
    aiBudgetSignal: isPublic ? row.ai_budget_signal : null,
    aiLeadTemperature: isPublic ? aiLeadTemperature : null,
    aiConfidence: isPublic ? row.ai_confidence : null,
    aiNextAction: isPublic ? row.ai_next_action : null,
    aiFollowUpTone: isPublic ? row.ai_follow_up_tone : null,
    aiSuggestedReply: isPublic ? row.ai_suggested_reply : null,
    aiClassificationNote: isPublic ? row.ai_classification_note : null,
    aiProcessedAt: isPublic ? row.ai_processed_at : null,
    aiErrorMessage: isPublic ? row.ai_error_message : null,
    aiModel: isPublic ? row.ai_model : null,
  };
}
