"use server";

/**
 * Admin support actions: status updates and threaded replies for /admin/support.
 */

import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { renderEmailTemplate } from "@/lib/email/template";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { isAdminUser } from "@/lib/admin-auth";
import type {
  UpdateSupportRequestStatusState,
  SendSupportReplyState,
} from "@/lib/admin-action-types";

const SUPPORT_REPLY_EMAIL_FOOTER =
  "You are receiving this email regarding a support or consultation request with McCarthy AI Automations. Reply to this message to continue the conversation.";

function getAppBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "")
  );
}

const SUPPORT_REQUEST_STATUSES = [
  "open",
  "in_progress",
  "resolved",
  "closed",
] as const;

export async function updateSupportRequestStatusAction(
  _prevState: UpdateSupportRequestStatusState | null,
  formData: FormData
): Promise<UpdateSupportRequestStatusState> {
  const allowed = await isAdminUser();
  if (!allowed) {
    return { success: false, error: "Unauthorized." };
  }

  const requestId = (formData.get("requestId") as string)?.trim();
  const status = (formData.get("status") as string)?.trim();

  if (!requestId) {
    return { success: false, error: "Request is required." };
  }
  if (
    !status ||
    !(SUPPORT_REQUEST_STATUSES as readonly string[]).includes(status)
  ) {
    return { success: false, error: "Invalid status." };
  }

  const statusValid = status as (typeof SUPPORT_REQUEST_STATUSES)[number];

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { success: false, error: "Database unavailable." };
  }

  const { error } = await supabase
    .from("support_requests")
    .update({ status: statusValid, updated_at: new Date().toISOString() })
    .eq("id", requestId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/support");
  revalidatePath(`/admin/support/${requestId}`);
  revalidatePath("/dashboard/support");
  return { success: true };
}

const REPLY_BODY_MAX = 10000;

export async function sendSupportReplyAction(
  _prevState: SendSupportReplyState | null,
  formData: FormData
): Promise<SendSupportReplyState> {
  const allowed = await isAdminUser();
  if (!allowed) {
    return { success: false, error: "Unauthorized." };
  }

  const requestId = (formData.get("requestId") as string)?.trim();
  const body = (formData.get("body") as string)?.trim() ?? "";

  if (!requestId) {
    return { success: false, error: "Request is required." };
  }
  if (!body) {
    return { success: false, error: "Message is required." };
  }
  if (body.length > REPLY_BODY_MAX) {
    return {
      success: false,
      error: `Message must be ${REPLY_BODY_MAX} characters or less.`,
    };
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { success: false, error: "Database unavailable." };
  }

  const { data: row, error: fetchError } = await supabase
    .from("support_requests")
    .select(
      "id, subject, client_id, requester_email, clients(email)"
    )
    .eq("id", requestId)
    .maybeSingle();

  if (fetchError || !row) {
    return {
      success: false,
      error: fetchError?.message ?? "Support request not found.",
    };
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
    return { success: false, error: insertError.message };
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
        console.warn(
          "[sendSupportReplyAction] Resend failed:",
          sendResult.error.message
        );
      }
    } catch (e) {
      console.warn(
        "[sendSupportReplyAction] Resend error:",
        e instanceof Error ? e.message : String(e)
      );
    }
  } else {
    console.warn(
      "[sendSupportReplyAction] RESEND_API_KEY missing; reply saved but email not sent"
    );
  }

  return { success: true };
}
