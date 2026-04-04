"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { getCurrentClientId } from "@/lib/portal-data";
import { getPortalDemoMode } from "@/lib/demo-portal";
import { sendPublicConsultationEmails } from "@/lib/email/public-consultation-emails";
import { processPublicLeadAnalysis } from "@/lib/lead-ai/analyze-public-lead";

/**
 * Portal actions: server actions for the client dashboard.
 * Scoped to the current client via getCurrentClientId(). Use for client-initiated writes (e.g. support requests).
 */

export type CreateSupportRequestState =
  | { success: false; error: string }
  | { success: true };

const SUBJECT_MAX = 500;
const BODY_MAX = 10000;

export async function createSupportRequestAction(
  _prevState: CreateSupportRequestState | null,
  formData: FormData
): Promise<CreateSupportRequestState> {
  // Keep demo UX seamless while preventing demo users from creating real support workload.
  if (await getPortalDemoMode()) {
    return { success: true };
  }

  const clientId = await getCurrentClientId();
  if (!clientId) {
    return {
      success: false,
      error: "You must be signed in and linked to a client to submit a request.",
    };
  }

  const subject = (formData.get("subject") as string)?.trim() ?? "";
  const body = (formData.get("body") as string)?.trim() ?? "";
  const projectIdRaw = (formData.get("projectId") as string)?.trim() ?? "";
  const projectId = projectIdRaw || null;

  if (!subject) {
    return { success: false, error: "Subject is required." };
  }
  if (subject.length > SUBJECT_MAX) {
    return { success: false, error: `Subject must be ${SUBJECT_MAX} characters or less.` };
  }
  if (!body) {
    return { success: false, error: "Message is required." };
  }
  if (body.length > BODY_MAX) {
    return { success: false, error: `Message must be ${BODY_MAX} characters or less.` };
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { success: false, error: "Database unavailable." };
  }

  if (projectId) {
    const { data: allowedProjects } = await supabase
      .from("projects")
      .select("id, client_services!inner(client_id)")
      .eq("client_services.client_id", clientId);
    const allowedIds = new Set((allowedProjects ?? []).map((p: { id: string }) => p.id));
    if (!allowedIds.has(projectId)) {
      return { success: false, error: "Invalid project selection." };
    }
  }

  const { error } = await supabase.from("support_requests").insert({
    client_id: clientId,
    project_id: projectId,
    subject,
    body,
    status: "open",
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/support");
  return { success: true };
}

export type CreatePublicSupportRequestState =
  | { success: false; error: string }
  | { success: true };

const NAME_MAX = 200;
const EMAIL_MAX = 320;
const PHONE_MAX = 50;
const PUBLIC_SUBJECT_MAX = 500;
const PUBLIC_BODY_MAX = 10000;
const WEBSITE_MAX = 512;
const DEFAULT_PUBLIC_SUBJECT = "Free consultation";

function looksLikeEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/**
 * Public marketing-site submissions (no Clerk / no client record).
 * Inserts support_requests with client_id null and requester_* filled.
 */
export async function createPublicSupportRequestAction(
  _prevState: CreatePublicSupportRequestState | null,
  formData: FormData
): Promise<CreatePublicSupportRequestState> {
  const website = (formData.get("website") as string)?.trim() ?? "";
  if (website.length > WEBSITE_MAX) {
    return { success: false, error: "Invalid form input." };
  }
  if (website) {
    // Bot/honeypot submission: return success to avoid signaling defenses.
    return { success: true };
  }

  const name = (formData.get("name") as string)?.trim() ?? "";
  const email = (formData.get("email") as string)?.trim() ?? "";
  const phone = (formData.get("phone") as string)?.trim() ?? "";
  const company = (formData.get("company") as string)?.trim() ?? "";
  const message = (formData.get("message") as string)?.trim() ?? "";
  const subjectRaw = (formData.get("subject") as string)?.trim() ?? "";
  const subject = subjectRaw || DEFAULT_PUBLIC_SUBJECT;

  if (!name) {
    return { success: false, error: "Name is required." };
  }
  if (name.length > NAME_MAX) {
    return { success: false, error: `Name must be ${NAME_MAX} characters or less.` };
  }
  if (!email) {
    return { success: false, error: "Email is required." };
  }
  if (email.length > EMAIL_MAX) {
    return { success: false, error: `Email must be ${EMAIL_MAX} characters or less.` };
  }
  if (!looksLikeEmail(email)) {
    return { success: false, error: "Enter a valid email address." };
  }
  if (!message) {
    return { success: false, error: "Message is required." };
  }
  if (message.length > PUBLIC_BODY_MAX) {
    return {
      success: false,
      error: `Message must be ${PUBLIC_BODY_MAX} characters or less.`,
    };
  }
  if (subject.length > PUBLIC_SUBJECT_MAX) {
    return {
      success: false,
      error: `Subject must be ${PUBLIC_SUBJECT_MAX} characters or less.`,
    };
  }
  if (phone.length > PHONE_MAX) {
    return {
      success: false,
      error: `Phone must be ${PHONE_MAX} characters or less.`,
    };
  }

  let body = message;
  if (company) {
    body = `Company: ${company}\n\n${message}`;
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { success: false, error: "Database unavailable." };
  }

  const { data: inserted, error } = await supabase
    .from("support_requests")
    .insert({
      client_id: null,
      project_id: null,
      requester_name: name,
      requester_email: email,
      requester_phone: phone || null,
      subject,
      body,
      status: "open",
      category: "public",
      lead_follow_up_eligible: true,
      ai_lead_analysis_status: "pending",
    })
    .select("id")
    .single();

  if (error || !inserted?.id) {
    return {
      success: false,
      error: error?.message ?? "Failed to save your request.",
    };
  }

  after(() =>
    processPublicLeadAnalysis(inserted.id).catch((e) =>
      console.warn(
        "[createPublicSupportRequestAction] lead-ai:",
        e instanceof Error ? e.message : String(e)
      )
    )
  );

  try {
    await sendPublicConsultationEmails({
      requesterName: name,
      requesterEmail: email,
      requesterPhone: phone || undefined,
      company,
      subject,
      message,
    });
  } catch (e) {
    console.warn(
      "[createPublicSupportRequestAction] consultation emails:",
      e instanceof Error ? e.message : String(e)
    );
  }

  revalidatePath("/admin/support");
  return { success: true };
}
