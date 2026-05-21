"use server";

/**
 * Admin support actions: status updates and threaded replies for /admin/support.
 */

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Resend } from "resend";
import { renderEmailTemplate } from "@/lib/email/template";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { isAdminUser } from "@/lib/admin-auth";
import type {
  UpdateSupportRequestStatusState,
  SendSupportReplyState,
  SetLeadFollowUpSuppressedState,
  RerunLeadAiAnalysisState,
} from "@/lib/admin-action-types";
import { processPublicLeadAnalysis } from "@/lib/lead-ai/analyze-public-lead";

const SUPPORT_REPLY_EMAIL_FOOTER =
  "You are receiving this email regarding a support or consultation request with McCarthy AI Automations. Reply to this message to continue the conversation.";

function getAppBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "")
  );
}

const SUPPORT_REQUEST_STATUSES = ["open", "in_progress", "resolved", "closed"] as const;

const UpdateStatusSchema = z.object({
  requestId: z.string().uuid("Invalid request ID."),
  status: z.enum(SUPPORT_REQUEST_STATUSES, { message: "Invalid status." }),
});

export async function updateSupportRequestStatusAction(
  _prevState: UpdateSupportRequestStatusState | null,
  formData: FormData
): Promise<UpdateSupportRequestStatusState> {
  const allowed = await isAdminUser();
  if (!allowed) {
    return { success: false, error: "Unauthorized." };
  }

  const parsed = UpdateStatusSchema.safeParse({
    requestId: (formData.get("requestId") as string)?.trim(),
    status: (formData.get("status") as string)?.trim(),
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { success: false, error: first?.message ?? "Invalid input." };
  }

  const { requestId, status } = parsed.data;

  const supabase = getSupabaseServiceClient();

  const { error } = await supabase
    .from("support_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", requestId);

  if (error) {
    console.error("[updateSupportRequestStatusAction] db update failed:", error.message);
    return { success: false, error: "Failed to update status. Please try again." };
  }

  revalidatePath("/admin/support");
  revalidatePath(`/admin/support/${requestId}`);
  revalidatePath("/dashboard/support");
  return { success: true };
}

const SendReplySchema = z.object({
  requestId: z.string().uuid("Invalid request ID."),
  body: z
    .string()
    .min(1, "Message is required.")
    .max(10000, "Message must be 10000 characters or less."),
});

export async function sendSupportReplyAction(
  _prevState: SendSupportReplyState | null,
  formData: FormData
): Promise<SendSupportReplyState> {
  const allowed = await isAdminUser();
  if (!allowed) {
    return { success: false, error: "Unauthorized." };
  }

  const parsed = SendReplySchema.safeParse({
    requestId: (formData.get("requestId") as string)?.trim(),
    body: (formData.get("body") as string)?.trim() ?? "",
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { success: false, error: first?.message ?? "Invalid input." };
  }

  const { requestId, body } = parsed.data;

  const supabase = getSupabaseServiceClient();

  const { data: row, error: fetchError } = await supabase
    .from("support_requests")
    .select("id, subject, client_id, requester_email, clients(email)")
    .eq("id", requestId)
    .maybeSingle();

  if (fetchError || !row) {
    console.error("[sendSupportReplyAction] fetch failed:", fetchError?.message);
    return { success: false, error: "Support request not found." };
  }

  const typed = row as {
    id: string;
    subject: string;
    client_id: string | null;
    requester_email: string | null;
    clients: { email: string } | null;
  };

  const isPublic = typed.client_id === null;
  const toEmail = isPublic
    ? typed.requester_email?.trim() || ""
    : typed.clients?.email?.trim() || "";

  if (!toEmail) {
    return {
      success: false,
      error: "No email on file for this request; cannot send a reply.",
    };
  }

  const { error: insertError } = await supabase.from("support_replies").insert({
    support_request_id: requestId,
    body,
    sender_type: "admin",
  });

  if (insertError) {
    console.error("[sendSupportReplyAction] insert failed:", insertError.message);
    return { success: false, error: "Failed to save reply. Please try again." };
  }

  await supabase
    .from("support_requests")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", requestId);

  revalidatePath("/admin/support");
  revalidatePath(`/admin/support/${requestId}`);
  revalidatePath("/dashboard/support");

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail =
    (process.env.CONTACT_FROM_EMAIL ?? "").trim() || "onboarding@resend.dev";

  if (apiKey) {
    try {
      const baseUrl = getAppBaseUrl();
      const actionUrl = baseUrl
        ? isPublic
          ? baseUrl
          : `${baseUrl}/dashboard/support`
        : "";
      const actionText = baseUrl
        ? isPublic
          ? "Visit our website"
          : "Open your support inbox"
        : undefined;

      const html = renderEmailTemplate({
        title: "Message from our team",
        content: body,
        actionText: actionText,
        actionUrl: actionUrl || undefined,
        footerText: SUPPORT_REPLY_EMAIL_FOOTER,
      });

      const resend = new Resend(apiKey);
      const sendResult = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        subject: `Re: ${typed.subject}`,
        html,
      });

      if (sendResult.error) {
        console.warn("[sendSupportReplyAction] Resend failed:", sendResult.error.message);
      }
    } catch (e) {
      console.warn(
        "[sendSupportReplyAction] Resend error:",
        e instanceof Error ? e.message : String(e)
      );
    }
  } else {
    console.warn("[sendSupportReplyAction] RESEND_API_KEY missing; reply saved but email not sent");
  }

  return { success: true };
}

const SuppressSchema = z.object({
  requestId: z.string().uuid("Invalid request ID."),
  suppressed: z.enum(["true", "false"], { message: "Invalid action." }).transform((v) => v === "true"),
});

/**
 * Per-lead opt-out for automated booking follow-up (public consultation rows only).
 */
export async function setLeadFollowUpSuppressedAction(
  _prevState: SetLeadFollowUpSuppressedState | null,
  formData: FormData
): Promise<SetLeadFollowUpSuppressedState> {
  const allowed = await isAdminUser();
  if (!allowed) {
    return { success: false, error: "Unauthorized." };
  }

  const parsed = SuppressSchema.safeParse({
    requestId: (formData.get("requestId") as string)?.trim(),
    suppressed: (formData.get("suppressed") as string)?.trim(),
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { success: false, error: first?.message ?? "Invalid input." };
  }

  const { requestId, suppressed } = parsed.data;

  const supabase = getSupabaseServiceClient();

  const { data: row, error: fetchError } = await supabase
    .from("support_requests")
    .select("id, client_id")
    .eq("id", requestId)
    .maybeSingle();

  if (fetchError || !row) {
    console.error("[setLeadFollowUpSuppressedAction] fetch failed:", fetchError?.message);
    return { success: false, error: "Support request not found." };
  }

  const typed = row as { id: string; client_id: string | null };
  if (typed.client_id !== null) {
    return {
      success: false,
      error: "Follow-up suppression applies to public consultation requests only.",
    };
  }

  const { error: updateError } = await supabase
    .from("support_requests")
    .update({
      lead_follow_up_suppressed: suppressed,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (updateError) {
    console.error("[setLeadFollowUpSuppressedAction] update failed:", updateError.message);
    return { success: false, error: "Failed to update suppression. Please try again." };
  }

  revalidatePath("/admin/support");
  revalidatePath(`/admin/support/${requestId}`);
  return { success: true };
}

const RerunSchema = z.object({
  requestId: z.string().uuid("Invalid request ID."),
});

/**
 * Admin-only: re-run structured AI classification for a public consultation lead.
 */
export async function rerunLeadAiAnalysisAction(
  _prevState: RerunLeadAiAnalysisState | null,
  formData: FormData
): Promise<RerunLeadAiAnalysisState> {
  const allowed = await isAdminUser();
  if (!allowed) {
    return { success: false, error: "Unauthorized." };
  }

  const parsed = RerunSchema.safeParse({
    requestId: (formData.get("requestId") as string)?.trim(),
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { success: false, error: first?.message ?? "Invalid input." };
  }

  const { requestId } = parsed.data;

  const supabase = getSupabaseServiceClient();

  const { data: row, error: fetchError } = await supabase
    .from("support_requests")
    .select("id, client_id, category")
    .eq("id", requestId)
    .maybeSingle();

  if (fetchError || !row) {
    console.error("[rerunLeadAiAnalysisAction] fetch failed:", fetchError?.message);
    return { success: false, error: "Support request not found." };
  }

  const typed = row as { id: string; client_id: string | null; category: string | null };
  if (typed.client_id !== null) {
    return {
      success: false,
      error: "AI lead analysis applies to public consultation requests only.",
    };
  }
  if (typed.category != null && typed.category !== "public") {
    return {
      success: false,
      error: "This request is not a public marketing lead.",
    };
  }

  try {
    await processPublicLeadAnalysis(requestId, { force: true });
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "AI analysis failed unexpectedly.",
    };
  }

  revalidatePath("/admin/support");
  revalidatePath(`/admin/support/${requestId}`);
  return { success: true };
}
