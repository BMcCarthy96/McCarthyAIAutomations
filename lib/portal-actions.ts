"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { getCurrentClientId } from "@/lib/portal-data";
import { getPortalDemoMode } from "@/lib/demo-portal";
import { sendPublicConsultationEmails } from "@/lib/email/public-consultation-emails";
import { processPublicLeadAnalysis } from "@/lib/lead-ai/analyze-public-lead";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * Portal actions: server actions for the client dashboard.
 * Scoped to the current client via getCurrentClientId(). Use for client-initiated writes (e.g. support requests).
 */

export type CreateSupportRequestState =
  | { success: false; error: string }
  | { success: true };

const SupportRequestSchema = z.object({
  subject: z.string().min(1, "Subject is required.").max(500, "Subject must be 500 characters or less."),
  body: z.string().min(1, "Message is required.").max(10000, "Message must be 10000 characters or less."),
  projectId: z.string().uuid("Invalid project selection.").nullish().transform((v) => v ?? null),
});

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

  const parsed = SupportRequestSchema.safeParse({
    subject: (formData.get("subject") as string)?.trim() ?? "",
    body: (formData.get("body") as string)?.trim() ?? "",
    projectId: (formData.get("projectId") as string)?.trim() || null,
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { success: false, error: first?.message ?? "Invalid input." };
  }

  const { subject, body, projectId } = parsed.data;

  const supabase = getSupabaseServiceClient();

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
    console.error("[createSupportRequestAction] db insert failed:", error.message);
    return { success: false, error: "Failed to submit your request. Please try again." };
  }

  revalidatePath("/dashboard/support");
  return { success: true };
}

export type CreatePublicSupportRequestState =
  | { success: false; error: string }
  | { success: true };

const DEFAULT_PUBLIC_SUBJECT = "AI Revenue Leak Audit request";

const PublicSupportRequestSchema = z.object({
  website: z.string().max(512).default(""),
  name: z.string().min(1, "Name is required.").max(200, "Name must be 200 characters or less."),
  email: z
    .string()
    .min(1, "Email is required.")
    .max(320, "Email must be 320 characters or less.")
    .email("Enter a valid email address."),
  phone: z.string().max(50, "Phone must be 50 characters or less.").default(""),
  company: z.string().max(200, "Company must be 200 characters or less.").default(""),
  message: z.string().min(1, "Message is required.").max(10000, "Message must be 10000 characters or less."),
  subject: z.string().max(500, "Subject must be 500 characters or less.").default(""),
});

/**
 * Public marketing-site submissions (no Clerk / no client record).
 * Inserts support_requests with client_id null and requester_* filled.
 */
export async function createPublicSupportRequestAction(
  _prevState: CreatePublicSupportRequestState | null,
  formData: FormData
): Promise<CreatePublicSupportRequestState> {
  // Rate limit by IP: 5 submissions per 10 minutes.
  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateCheck = await checkRateLimit(ip, {
    prefix: "contact-form",
    max: 5,
    windowSecs: 600,
  });
  if (!rateCheck.ok) {
    return {
      success: false,
      error: rateCheck.message ?? "Too many submissions. Please try again later.",
    };
  }

  const parsed = PublicSupportRequestSchema.safeParse({
    website: (formData.get("website") as string)?.trim() ?? "",
    name: (formData.get("name") as string)?.trim() ?? "",
    email: (formData.get("email") as string)?.trim() ?? "",
    phone: (formData.get("phone") as string)?.trim() ?? "",
    company: (formData.get("company") as string)?.trim() ?? "",
    message: (formData.get("message") as string)?.trim() ?? "",
    subject: (formData.get("subject") as string)?.trim() ?? "",
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { success: false, error: first?.message ?? "Invalid input." };
  }

  const { website, name, email, phone, company, message } = parsed.data;
  const subject = parsed.data.subject || DEFAULT_PUBLIC_SUBJECT;

  if (website) {
    // Bot/honeypot submission: return success to avoid signaling defenses.
    return { success: true };
  }

  let body = message;
  if (company) {
    body = `Company: ${company}\n\n${message}`;
  }

  const supabase = getSupabaseServiceClient();

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
    console.error("[createPublicSupportRequestAction] db insert failed:", error?.message);
    return {
      success: false,
      error: "Failed to save your request. Please try again.",
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
