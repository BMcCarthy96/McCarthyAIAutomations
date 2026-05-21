"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Resend } from "resend";
import { renderEmailTemplate } from "@/lib/email/template";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { createPaymentLinkForClient, createStripeCustomerForClient } from "@/lib/stripe";
import { isAdminUser } from "@/lib/admin-auth";
import type {
  CreateProjectUpdateState,
  CreateMilestoneState,
  UpdateMilestoneState,
  DeleteMilestoneState,
  UpdateProjectState,
  ArchiveProjectState,
  CreateBillingRecordState,
  UpdateBillingRecordState,
  CreateStripePaymentLinkState,
  CreateStripeCustomerBackfillState,
  UpdateSupportRequestStatusState,
  SendSupportReplyState,
  RunMonthlyImpactReportEmailsState,
  CreateClientState,
  UpdateClientState,
  CreateProjectSetupState,
  UpdateClientClerkLinkState,
  UpdateProjectMetricsState,
  ArchiveClientState,
  DeleteClientState,
  DeleteBillingRecordState,
  SendPendingLeadFollowUpsState,
  SetLeadFollowUpSuppressedState,
  RerunLeadAiAnalysisState,
} from "@/lib/admin-action-types";
import {
  updateSupportRequestStatusAction as implUpdateSupportRequestStatusAction,
  sendSupportReplyAction as implSendSupportReplyAction,
  setLeadFollowUpSuppressedAction as implSetLeadFollowUpSuppressedAction,
  rerunLeadAiAnalysisAction as implRerunLeadAiAnalysisAction,
} from "@/lib/support/admin-actions";
import { runMonthlyImpactReportEmails } from "@/lib/email/monthly-impact-report-runner";
import { getBookingUrl } from "@/lib/booking-url";
import { processPendingLeadFollowUps } from "@/lib/lead-follow-up";

/**
 * Admin actions: server actions for /admin.
 * All mutations require isAdminUser(). Use for forms and inline updates.
 * Grouped by domain: project updates, projects, milestones, support, billing.
 */

/** Invalidate billing server components (explicit page scope for reliable RSC refresh). */
function revalidateBillingViews() {
  revalidatePath("/admin/billing", "page");
  revalidatePath("/dashboard/billing", "page");
}

function debugBilling(stage: string, payload: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "development") return;
  console.log(`[billing-debug] ${stage}`, payload);
}

function debugProjectUpdateMail(stage: string, payload: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "development") return;
  console.log(`[project-update-mail] ${stage}`, payload);
}

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------

const uuidField = (label: string) =>
  z.string().uuid(`Invalid ${label}.`);

const PROJECT_STATUSES = ["active", "in_progress", "pending", "completed"] as const;
const BILLING_STATUSES = ["pending", "paid", "overdue"] as const;
const PROJECT_SETUP_STATUSES = ["active", "in_progress", "pending", "completed"] as const;

const ProjectUpdateSchema = z.object({
  projectId: uuidField("project"),
  title: z.string().min(1, "Title is required.").max(500, "Title must be 500 characters or less."),
  body: z.string().min(1, "Body is required.").max(10000, "Body must be 10000 characters or less."),
});

const UpdateProjectSchema = z.object({
  projectId: uuidField("project"),
  progress: z.coerce.number().int().min(0, "Progress must be 0–100.").max(100, "Progress must be 0–100."),
  status: z.enum(PROJECT_STATUSES, { message: "Invalid status." }),
});

const ProjectIdSchema = z.object({
  projectId: uuidField("project"),
});

const CreateMilestoneSchema = z.object({
  projectId: uuidField("project"),
  title: z.string().min(1, "Title is required.").max(500, "Title must be 500 characters or less."),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid due date.")
    .refine((d) => !Number.isNaN(new Date(d).getTime()), "Invalid due date."),
});

const UpdateMilestoneSchema = z.object({
  milestoneId: uuidField("milestone"),
  title: z.string().min(1, "Title is required.").max(500, "Title must be 500 characters or less."),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid due date.")
    .refine((d) => !Number.isNaN(new Date(d).getTime()), "Invalid due date.")
    .optional(),
  markComplete: z
    .string()
    .optional()
    .transform((v) => v === "true"),
});

const MilestoneIdSchema = z.object({
  milestoneId: uuidField("milestone"),
});

const CreateBillingSchema = z.object({
  clientId: uuidField("client"),
  amountDollars: z.string().min(1, "Amount is required."),
  description: z
    .string()
    .min(1, "Description is required.")
    .max(1000, "Description must be 1000 characters or less."),
  status: z.enum(BILLING_STATUSES, { message: "Invalid status." }).default("pending"),
});

const UpdateBillingSchema = z.object({
  recordId: uuidField("billing record"),
  amountDollars: z.string().min(1, "Amount is required."),
  description: z
    .string()
    .min(1, "Description is required.")
    .max(1000, "Description must be 1000 characters or less."),
  status: z.enum(BILLING_STATUSES, { message: "Invalid status." }),
});

const RecordIdSchema = z.object({ recordId: uuidField("billing record") });
const ClientIdSchema = z.object({ clientId: uuidField("client") });

const CreateClientSchema = z.object({
  name: z.string().min(1, "Name is required.").max(200, "Name must be 200 characters or less."),
  email: z.string().email("Enter a valid email address.").max(320, "Email must be 320 characters or less."),
  company: z.string().max(200, "Company must be 200 characters or less.").optional(),
  clerkUserId: z.string().max(200).optional(),
});

const UpdateClientSchema = z.object({
  clientId: uuidField("client"),
  name: z.string().min(1, "Name is required.").max(200, "Name must be 200 characters or less."),
  email: z.string().email("Enter a valid email address.").max(320, "Email must be 320 characters or less."),
  company: z.string().max(200, "Company must be 200 characters or less.").optional(),
  clerkUserId: z.string().max(200).optional(),
  monthlyReportEnabled: z
    .string()
    .optional()
    .transform((v) => v === "on"),
});

const UpdateClerkLinkSchema = z.object({
  clientId: uuidField("client"),
  clerkUserId: z.string().min(1, "Clerk user ID is required.").max(200),
});

const CreateProjectSetupSchema = z.object({
  clientId: uuidField("client"),
  serviceId: z.string().min(1, "Service is required."),
  engagementName: z
    .string()
    .min(1, "Engagement name is required.")
    .max(500, "Engagement name must be 500 characters or less."),
  projectName: z
    .string()
    .min(1, "Project name is required.")
    .max(500, "Project name must be 500 characters or less."),
  status: z.enum(PROJECT_SETUP_STATUSES, { message: "Invalid status." }),
  progress: z.coerce.number().int().min(0).max(100).default(0),
});

const DeleteClientSchema = z.object({
  clientId: uuidField("client"),
  confirmEmail: z.string().min(1, "Confirmation email is required.").max(320),
});

const UpdateMetricsSchema = z.object({
  projectId: uuidField("project"),
  callsHandled: z.string().optional(),
  leadsCaptured: z.string().optional(),
  appointmentsBooked: z.string().optional(),
  hoursSaved: z.string().optional(),
  estimatedRevenue: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Helper: parse dollar amount to cents
// ---------------------------------------------------------------------------

function parseDollarsToCents(raw: string): { ok: true; cents: number } | { ok: false; error: string } {
  const trimmed = raw.trim().replace(/,/g, "");
  if (!trimmed) return { ok: false, error: "Amount is required." };
  const n = Number.parseFloat(trimmed);
  if (!Number.isFinite(n) || n <= 0) return { ok: false, error: "Enter a valid amount greater than zero." };
  const cents = Math.round(n * 100);
  if (cents < 1) return { ok: false, error: "Amount is too small." };
  if (cents > 10_000_000_000) return { ok: false, error: "Amount is too large." };
  return { ok: true, cents };
}

function defaultBillingDueDateIso(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 30);
  return d.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Project updates
// ---------------------------------------------------------------------------

export async function createProjectUpdateAction(
  _prevState: CreateProjectUpdateState | null,
  formData: FormData
): Promise<CreateProjectUpdateState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const parsed = ProjectUpdateSchema.safeParse({
    projectId: (formData.get("projectId") as string)?.trim(),
    title: (formData.get("title") as string)?.trim(),
    body: (formData.get("body") as string)?.trim(),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { projectId, title, body } = parsed.data;
  const supabase = getSupabaseServiceClient();

  const { error } = await supabase.from("project_updates").insert({ project_id: projectId, title, body });
  if (error) {
    console.error("[createProjectUpdateAction] db insert failed:", error.message);
    return { success: false, error: "Failed to create update. Please try again." };
  }

  // Notify client by email (best-effort; do not fail the action if email fails)
  try {
    const { data: projectRow, error: projectError } = await supabase
      .from("projects")
      .select("name, client_services!inner(clients(email))")
      .eq("id", projectId)
      .single();

    const projectLookupSucceeded = !projectError && projectRow != null;
    debugProjectUpdateMail("project_lookup", { ok: projectLookupSucceeded, error: projectError?.message ?? null });

    type ProjectWithClient = {
      name?: string;
      client_services?: { clients?: { email?: string } | null } | null;
    };
    const row = projectRow as unknown as ProjectWithClient | null;
    const projectName = row?.name ?? "Your project";
    const clientEmail = row?.client_services?.clients?.email?.trim?.();

    const apiKey = process.env.RESEND_API_KEY?.trim();
    const fromEmail = (process.env.CONTACT_FROM_EMAIL ?? "").trim() || "onboarding@resend.dev";
    debugProjectUpdateMail("resolved_recipients", {
      projectName, hasClientEmail: Boolean(clientEmail), hasResendApiKey: Boolean(apiKey), fromEmail,
    });

    if (apiKey && clientEmail) {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL?.trim() ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
      const updatesLink = baseUrl ? `${baseUrl}/dashboard/updates` : "/dashboard/updates";

      const emailContent = [`Project: ${projectName}`, ``, title, ``, body].join("\n");
      const html = renderEmailTemplate({
        title: "New Project Update",
        content: emailContent,
        actionText: "View updates",
        actionUrl: updatesLink,
      });

      const resend = new Resend(apiKey);
      const sendResult = await resend.emails.send({
        from: fromEmail,
        to: clientEmail,
        subject: `Project update: ${title}`,
        html,
      });

      if (sendResult.error) {
        debugProjectUpdateMail("send_result", { ok: false, error: sendResult.error.message });
      } else {
        debugProjectUpdateMail("send_result", { ok: true });
      }
    } else {
      debugProjectUpdateMail("send_result", { ok: false, skipped: true, reason: "missing_api_key_or_client_email" });
    }
  } catch (err) {
    debugProjectUpdateMail("send_result", {
      ok: false, exception: err instanceof Error ? err.message : String(err),
    });
  }

  return { success: true };
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export async function updateProjectAction(
  _prevState: UpdateProjectState | null,
  formData: FormData
): Promise<UpdateProjectState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const parsed = UpdateProjectSchema.safeParse({
    projectId: (formData.get("projectId") as string)?.trim(),
    progress: formData.get("progress"),
    status: (formData.get("status") as string)?.trim(),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { projectId, progress, status } = parsed.data;
  const supabase = getSupabaseServiceClient();

  const { error } = await supabase
    .from("projects")
    .update({ progress: Math.round(progress), status })
    .eq("id", projectId);

  if (error) {
    console.error("[updateProjectAction] db update failed:", error.message);
    return { success: false, error: "Failed to update project. Please try again." };
  }

  return { success: true };
}

export async function archiveProjectAction(
  _prevState: ArchiveProjectState | null,
  formData: FormData
): Promise<ArchiveProjectState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const parsed = ProjectIdSchema.safeParse({ projectId: (formData.get("projectId") as string)?.trim() });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const { projectId } = parsed.data;
  const supabase = getSupabaseServiceClient();

  const { error } = await supabase.from("projects").update({ is_archived: true }).eq("id", projectId);
  if (error) {
    console.error("[archiveProjectAction] db update failed:", error.message);
    return { success: false, error: "Failed to archive project. Please try again." };
  }

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}/edit`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/services");
  return { success: true };
}

export async function unarchiveProjectAction(
  _prevState: ArchiveProjectState | null,
  formData: FormData
): Promise<ArchiveProjectState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const parsed = ProjectIdSchema.safeParse({ projectId: (formData.get("projectId") as string)?.trim() });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const { projectId } = parsed.data;
  const supabase = getSupabaseServiceClient();

  const { error } = await supabase.from("projects").update({ is_archived: false }).eq("id", projectId);
  if (error) {
    console.error("[unarchiveProjectAction] db update failed:", error.message);
    return { success: false, error: "Failed to restore project. Please try again." };
  }

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}/edit`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/services");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Milestones
// ---------------------------------------------------------------------------

export async function createMilestoneAction(
  _prevState: CreateMilestoneState | null,
  formData: FormData
): Promise<CreateMilestoneState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const parsed = CreateMilestoneSchema.safeParse({
    projectId: (formData.get("projectId") as string)?.trim(),
    title: (formData.get("title") as string)?.trim(),
    dueDate: (formData.get("dueDate") as string)?.trim(),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { projectId, title, dueDate } = parsed.data;
  const supabase = getSupabaseServiceClient();

  const { error } = await supabase.from("milestones").insert({ project_id: projectId, title, due_date: dueDate });
  if (error) {
    console.error("[createMilestoneAction] db insert failed:", error.message);
    return { success: false, error: "Failed to create milestone. Please try again." };
  }

  revalidatePath(`/admin/projects/${projectId}/edit`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/services");
  return { success: true };
}

export async function updateMilestoneAction(
  _prevState: UpdateMilestoneState | null,
  formData: FormData
): Promise<UpdateMilestoneState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const parsed = UpdateMilestoneSchema.safeParse({
    milestoneId: (formData.get("milestoneId") as string)?.trim(),
    title: (formData.get("title") as string)?.trim(),
    dueDate: (formData.get("dueDate") as string)?.trim() || undefined,
    markComplete: (formData.get("markComplete") as string) ?? undefined,
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { milestoneId, title, dueDate, markComplete } = parsed.data;
  const supabase = getSupabaseServiceClient();

  const updates: { title?: string; due_date?: string; completed_at?: string | null } = { title };
  if (dueDate) updates.due_date = dueDate;
  if (markComplete) updates.completed_at = new Date().toISOString();

  const { error } = await supabase.from("milestones").update(updates).eq("id", milestoneId);
  if (error) {
    console.error("[updateMilestoneAction] db update failed:", error.message);
    return { success: false, error: "Failed to update milestone. Please try again." };
  }

  const projectId = (formData.get("projectId") as string)?.trim();
  if (projectId) revalidatePath(`/admin/projects/${projectId}/edit`);
  revalidatePath("/admin/projects");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/services");

  // Notify client by email when milestone is marked complete (best-effort)
  if (markComplete) {
    try {
      const { data: milestoneRow } = await supabase
        .from("milestones")
        .select("title, projects!inner(name, client_services!inner(clients(email)))")
        .eq("id", milestoneId)
        .single();

      type MilestoneWithProject = {
        title?: string;
        projects?: { name?: string; client_services?: { clients?: { email?: string } | null } | null } | null;
      };
      const row = milestoneRow as unknown as MilestoneWithProject | null;
      const milestoneTitle = row?.title ?? "Milestone";
      const projectName = row?.projects?.name ?? "Your project";
      const clientEmail = row?.projects?.client_services?.clients?.email?.trim?.();

      const apiKey = process.env.RESEND_API_KEY?.trim();
      const fromEmail = (process.env.CONTACT_FROM_EMAIL ?? "").trim() || "onboarding@resend.dev";

      if (apiKey && clientEmail) {
        const baseUrl =
          process.env.NEXT_PUBLIC_APP_URL?.trim() ||
          (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
        const servicesUrl = baseUrl ? `${baseUrl}/dashboard/services` : "/dashboard/services";

        const content = [
          `Project: ${projectName}`,
          ``,
          `Milestone completed:`,
          milestoneTitle,
          ``,
          `Your automation milestone has been completed successfully.`,
        ].join("\n");

        const html = renderEmailTemplate({
          title: "Milestone Completed",
          content,
          actionText: "View Project",
          actionUrl: servicesUrl,
        });

        const resend = new Resend(apiKey);
        await resend.emails.send({ from: fromEmail, to: clientEmail, subject: `Milestone completed: ${milestoneTitle}`, html });
      }
    } catch {
      // Ignore email errors; milestone was updated successfully
    }
  }

  return { success: true };
}

export async function deleteMilestoneAction(
  _prevState: DeleteMilestoneState | null,
  formData: FormData
): Promise<DeleteMilestoneState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const parsed = MilestoneIdSchema.safeParse({ milestoneId: (formData.get("milestoneId") as string)?.trim() });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const { milestoneId } = parsed.data;
  const supabase = getSupabaseServiceClient();

  const { error } = await supabase.from("milestones").delete().eq("id", milestoneId);
  if (error) {
    console.error("[deleteMilestoneAction] db delete failed:", error.message);
    return { success: false, error: "Failed to delete milestone. Please try again." };
  }

  const projectId = (formData.get("projectId") as string)?.trim();
  if (projectId) revalidatePath(`/admin/projects/${projectId}/edit`);
  revalidatePath("/admin/projects");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/services");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Support (wrapper around lib/support/admin-actions.ts)
// ---------------------------------------------------------------------------

export async function updateSupportRequestStatusAction(
  prevState: UpdateSupportRequestStatusState | null,
  formData: FormData
) {
  return implUpdateSupportRequestStatusAction(prevState, formData);
}

export async function sendSupportReplyAction(
  prevState: SendSupportReplyState | null,
  formData: FormData
) {
  return implSendSupportReplyAction(prevState, formData);
}

export async function setLeadFollowUpSuppressedAction(
  prevState: SetLeadFollowUpSuppressedState | null,
  formData: FormData
) {
  return implSetLeadFollowUpSuppressedAction(prevState, formData);
}

export async function rerunLeadAiAnalysisAction(
  prevState: RerunLeadAiAnalysisState | null,
  formData: FormData
) {
  return implRerunLeadAiAnalysisAction(prevState, formData);
}

/**
 * Send branded "monthly impact report" emails to all clients with an email on file.
 */
export async function runMonthlyImpactReportEmailsAction(
  _prevState: RunMonthlyImpactReportEmailsState | null,
  _formData: FormData
): Promise<RunMonthlyImpactReportEmailsState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  try {
    const summary = await runMonthlyImpactReportEmails();
    revalidatePath("/admin/clients");
    return {
      success: true,
      sent: summary.sent,
      skippedDisabled: summary.skipped_disabled,
      skippedNoActivity: summary.skipped_no_activity,
      skippedNoEmail: summary.skipped_no_email,
      failed: summary.failed,
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to send monthly reports.",
    };
  }
}

/**
 * Sends the delayed booking follow-up email to pending public consultation leads.
 */
export async function sendPendingLeadFollowUpsAction(
  _prevState: SendPendingLeadFollowUpsState | null,
  _formData: FormData
): Promise<SendPendingLeadFollowUpsState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const bookingUrl = getBookingUrl();
  if (!bookingUrl) {
    return {
      success: false,
      error: "Set NEXT_PUBLIC_BOOKING_URL or BOOKING_URL to a valid URL (e.g. Cal.com or Calendly).",
    };
  }

  const supabase = getSupabaseServiceClient();

  try {
    const result = await processPendingLeadFollowUps(bookingUrl);
    revalidatePath("/admin/support");
    return { success: true, sent: result.sent, failed: result.failed };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to send lead follow-up emails.",
    };
  }
}

// ---------------------------------------------------------------------------
// Billing
// ---------------------------------------------------------------------------

export async function createBillingRecordAction(
  _prevState: CreateBillingRecordState | null,
  formData: FormData
): Promise<CreateBillingRecordState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const parsed = CreateBillingSchema.safeParse({
    clientId: (formData.get("clientId") as string)?.trim(),
    amountDollars: (formData.get("amountDollars") as string) ?? "",
    description: (formData.get("description") as string)?.trim() ?? "",
    status: ((formData.get("status") as string)?.trim() || "pending"),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { clientId, amountDollars, description, status } = parsed.data;

  const amount = parseDollarsToCents(amountDollars);
  if (!amount.ok) return { success: false, error: amount.error };

  const supabase = getSupabaseServiceClient();

  const { data: clientRow, error: clientErr } = await supabase
    .from("clients")
    .select("id")
    .eq("id", clientId)
    .maybeSingle();

  if (clientErr || !clientRow) return { success: false, error: "Client not found." };

  const insertPayload = {
    client_id: clientId,
    amount_cents: amount.cents,
    currency: "USD",
    description,
    status,
    due_date: defaultBillingDueDateIso(),
    paid_at: null,
    updated_at: new Date().toISOString(),
  };

  debugBilling("create:insert_payload", { ...insertPayload });

  const { data: inserted, error } = await supabase
    .from("billing_records")
    .insert(insertPayload)
    .select("id, amount_cents, description, stripe_payment_link_url, updated_at")
    .single();

  debugBilling("create:insert_result", { error: error?.message ?? null, insertedId: inserted?.id ?? null });

  if (error) {
    console.error("[createBillingRecordAction] db insert failed:", error.message);
    return { success: false, error: "Failed to create billing record. Please try again." };
  }

  revalidateBillingViews();
  return { success: true };
}

export async function updateBillingRecordAction(
  _prevState: UpdateBillingRecordState | null,
  formData: FormData
): Promise<UpdateBillingRecordState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const parsed = UpdateBillingSchema.safeParse({
    recordId: (formData.get("recordId") as string)?.trim(),
    amountDollars: (formData.get("amountDollars") as string) ?? "",
    description: (formData.get("description") as string)?.trim() ?? "",
    status: (formData.get("status") as string)?.trim(),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { recordId, amountDollars, description, status } = parsed.data;

  const amount = parseDollarsToCents(amountDollars);
  if (!amount.ok) return { success: false, error: amount.error };

  const supabase = getSupabaseServiceClient();

  const { data: prev, error: prevError } = await supabase
    .from("billing_records")
    .select("amount_cents, description, stripe_payment_link_url")
    .eq("id", recordId)
    .maybeSingle();

  if (prevError || !prev) {
    return { success: false, error: "Billing record not found." };
  }

  const prevRow = prev as { amount_cents: number; description: string; stripe_payment_link_url: string | null };
  const amountChanged = prevRow.amount_cents !== amount.cents;
  const descriptionChanged = (prevRow.description ?? "").trim() !== description.trim();
  const checkoutFieldsChanged = amountChanged || descriptionChanged;
  const hadPaymentLink = Boolean(prevRow.stripe_payment_link_url?.trim());

  const updatePayload: Record<string, unknown> = {
    amount_cents: amount.cents,
    description,
    status,
    updated_at: new Date().toISOString(),
  };
  if (checkoutFieldsChanged) updatePayload.stripe_payment_link_url = null;

  debugBilling("update:pre_save", {
    recordId,
    amountChanged,
    descriptionChanged,
    checkoutFieldsChanged,
    hadPaymentLink,
    willClearStripeUrl: checkoutFieldsChanged,
  });

  const { data: updatedRow, error } = await supabase
    .from("billing_records")
    .update(updatePayload)
    .eq("id", recordId)
    .select("id, amount_cents, description, stripe_payment_link_url, updated_at")
    .maybeSingle();

  debugBilling("update:post_save", { error: error?.message ?? null, id: updatedRow?.id ?? null });

  if (error) {
    console.error("[updateBillingRecordAction] db update failed:", error.message);
    return { success: false, error: "Failed to update billing record. Please try again." };
  }

  revalidateBillingViews();
  const stripeLinkCleared = checkoutFieldsChanged && hadPaymentLink;
  return { success: true, ...(stripeLinkCleared ? { stripeLinkCleared: true } : {}) };
}

export async function deleteBillingRecordAction(
  _prevState: DeleteBillingRecordState | null,
  formData: FormData
): Promise<DeleteBillingRecordState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const parsed = RecordIdSchema.safeParse({ recordId: (formData.get("recordId") as string)?.trim() });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const { recordId } = parsed.data;
  const supabase = getSupabaseServiceClient();

  const { error } = await supabase.from("billing_records").delete().eq("id", recordId);
  if (error) {
    console.error("[deleteBillingRecordAction] db delete failed:", error.message);
    return { success: false, error: "Failed to delete billing record. Please try again." };
  }

  revalidateBillingViews();
  return { success: true };
}

export async function createStripePaymentLinkAction(
  _prevState: CreateStripePaymentLinkState | null,
  formData: FormData
): Promise<CreateStripePaymentLinkState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const parsed = RecordIdSchema.safeParse({ recordId: (formData.get("recordId") as string)?.trim() });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const { recordId } = parsed.data;
  const supabase = getSupabaseServiceClient();

  const { data: recordRow, error: recordError } = await supabase
    .from("billing_records")
    .select("id, client_id, amount_cents, description")
    .eq("id", recordId)
    .single();

  if (recordError || !recordRow) {
    return { success: false, error: "Billing record not found." };
  }

  const { data: clientRow, error: clientError } = await supabase
    .from("clients")
    .select("stripe_customer_id")
    .eq("id", recordRow.client_id)
    .single();

  if (clientError || !clientRow) {
    return { success: false, error: "Client not found." };
  }

  const customerId = clientRow.stripe_customer_id as string | null;
  if (!customerId) {
    return {
      success: false,
      error: "Stripe customer id is missing for this client. Create the client record first.",
    };
  }

  const amountDollars = recordRow.amount_cents / 100;
  const description = (recordRow.description ?? "").trim() || "Payment";

  let url: string | null = null;
  try {
    url = await createPaymentLinkForClient({
      customerId,
      amount: amountDollars,
      description,
      clientId: recordRow.client_id,
      billingRecordId: recordRow.id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe payment link creation failed.";
    return { success: false, error: message };
  }

  if (!url) {
    return {
      success: false,
      error: "Stripe is not configured or payment link creation failed. Check STRIPE_SECRET_KEY.",
    };
  }

  const { error: updateError } = await supabase
    .from("billing_records")
    .update({ stripe_payment_link_url: url, updated_at: new Date().toISOString() })
    .eq("id", recordId);

  if (updateError) {
    console.error("[createStripePaymentLinkAction] db update failed:", updateError.message);
    return { success: false, error: "Payment link created but failed to save. Please try again." };
  }

  revalidateBillingViews();
  return { success: true, url };
}

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

export async function createClientAction(
  _prevState: CreateClientState | null,
  formData: FormData
): Promise<CreateClientState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const parsed = CreateClientSchema.safeParse({
    name: (formData.get("name") as string)?.trim() ?? "",
    email: (formData.get("email") as string)?.trim() ?? "",
    company: (formData.get("company") as string)?.trim() || undefined,
    clerkUserId: (formData.get("clerkUserId") as string)?.trim() || undefined,
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { name, email, company, clerkUserId } = parsed.data;
  const supabase = getSupabaseServiceClient();

  const stripeCustomerId = await createStripeCustomerForClient(name, email);

  const { error } = await supabase.from("clients").insert({
    name,
    email,
    company: company ?? null,
    clerk_user_id: clerkUserId ?? null,
    stripe_customer_id: stripeCustomerId ?? null,
  });

  if (error) {
    console.error("[createClientAction] db insert failed:", error.message);
    return { success: false, error: "Failed to create client. Please try again." };
  }

  revalidatePath("/admin/clients");
  return { success: true };
}

export async function updateClientAction(
  _prevState: UpdateClientState | null,
  formData: FormData
): Promise<UpdateClientState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const parsed = UpdateClientSchema.safeParse({
    clientId: (formData.get("clientId") as string)?.trim(),
    name: (formData.get("name") as string)?.trim() ?? "",
    email: (formData.get("email") as string)?.trim() ?? "",
    company: (formData.get("company") as string)?.trim() || undefined,
    clerkUserId: (formData.get("clerkUserId") as string)?.trim() || undefined,
    monthlyReportEnabled: (formData.get("monthlyReportEnabled") as string) ?? undefined,
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { clientId, name, email, company, clerkUserId, monthlyReportEnabled } = parsed.data;
  const supabase = getSupabaseServiceClient();

  const { error } = await supabase
    .from("clients")
    .update({
      name,
      email,
      company: company ?? null,
      clerk_user_id: clerkUserId ?? null,
      monthly_report_enabled: monthlyReportEnabled,
      updated_at: new Date().toISOString(),
    })
    .eq("id", clientId);

  if (error) {
    console.error("[updateClientAction] db update failed:", error.message);
    return { success: false, error: "Failed to update client. Please try again." };
  }

  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath(`/admin/clients/${clientId}/edit`);
  return { success: true };
}

export async function updateClientClerkLinkAction(
  _prevState: UpdateClientClerkLinkState | null,
  formData: FormData
): Promise<UpdateClientClerkLinkState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const parsed = UpdateClerkLinkSchema.safeParse({
    clientId: (formData.get("clientId") as string)?.trim(),
    clerkUserId: (formData.get("clerkUserId") as string)?.trim() ?? "",
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { clientId, clerkUserId } = parsed.data;
  const supabase = getSupabaseServiceClient();

  const { error } = await supabase
    .from("clients")
    .update({ clerk_user_id: clerkUserId, updated_at: new Date().toISOString() })
    .eq("id", clientId);

  if (error) {
    console.error("[updateClientClerkLinkAction] db update failed:", error.message);
    return { success: false, error: "Failed to link Clerk account. Please try again." };
  }

  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath(`/admin/clients/${clientId}/edit`);
  revalidatePath(`/admin/clients/${clientId}/link`);
  return { success: true };
}

export async function archiveClientFormAction(formData: FormData): Promise<void> {
  await archiveClientAction(null, formData);
}

export async function unarchiveClientFormAction(formData: FormData): Promise<void> {
  await unarchiveClientAction(null, formData);
}

export async function archiveClientAction(
  _prevState: ArchiveClientState | null,
  formData: FormData
): Promise<ArchiveClientState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const parsed = ClientIdSchema.safeParse({ clientId: (formData.get("clientId") as string)?.trim() });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const { clientId } = parsed.data;
  const supabase = getSupabaseServiceClient();

  const { error } = await supabase
    .from("clients")
    .update({ is_archived: true, updated_at: new Date().toISOString() })
    .eq("id", clientId);

  if (error) {
    console.error("[archiveClientAction] db update failed:", error.message);
    return { success: false, error: "Failed to archive client. Please try again." };
  }

  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath(`/admin/clients/${clientId}/edit`);
  revalidatePath(`/admin/clients/${clientId}/link`);
  return { success: true };
}

export async function unarchiveClientAction(
  _prevState: ArchiveClientState | null,
  formData: FormData
): Promise<ArchiveClientState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const parsed = ClientIdSchema.safeParse({ clientId: (formData.get("clientId") as string)?.trim() });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const { clientId } = parsed.data;
  const supabase = getSupabaseServiceClient();

  const { error } = await supabase
    .from("clients")
    .update({ is_archived: false, updated_at: new Date().toISOString() })
    .eq("id", clientId);

  if (error) {
    console.error("[unarchiveClientAction] db update failed:", error.message);
    return { success: false, error: "Failed to restore client. Please try again." };
  }

  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath(`/admin/clients/${clientId}/edit`);
  revalidatePath(`/admin/clients/${clientId}/link`);
  return { success: true };
}

/**
 * Permanently removes the client and all related rows (see migration `delete_client_cascade`).
 * Requires typing the client email exactly.
 */
export async function deleteClientAction(
  _prevState: DeleteClientState | null,
  formData: FormData
): Promise<DeleteClientState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const parsed = DeleteClientSchema.safeParse({
    clientId: (formData.get("clientId") as string)?.trim(),
    confirmEmail: (formData.get("confirmEmail") as string)?.trim() ?? "",
  });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const { clientId, confirmEmail } = parsed.data;
  const supabase = getSupabaseServiceClient();

  const { data: row, error: fetchErr } = await supabase
    .from("clients")
    .select("email")
    .eq("id", clientId)
    .maybeSingle();

  if (fetchErr || !row) {
    return { success: false, error: "Client not found." };
  }

  const email = String(row.email ?? "").trim();
  if (!email || confirmEmail !== email) {
    return {
      success: false,
      error: "Type the client email exactly to confirm permanent deletion.",
    };
  }

  const { error: rpcErr } = await supabase.rpc("delete_client_cascade", { p_client_id: clientId });
  if (rpcErr) {
    console.error("[deleteClientAction] cascade delete failed:", rpcErr.message);
    return { success: false, error: "Failed to delete client. Please try again." };
  }

  revalidatePath("/admin/clients");
  revalidatePath("/admin/billing", "page");
  revalidatePath("/admin/projects");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/billing", "page");
  redirect("/admin/clients");
}

// ---------------------------------------------------------------------------
// Stripe backfills (clients)
// ---------------------------------------------------------------------------

export async function createStripeCustomerBackfillAction(
  _prevState: CreateStripeCustomerBackfillState | null,
  formData: FormData
): Promise<CreateStripeCustomerBackfillState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const parsed = ClientIdSchema.safeParse({ clientId: (formData.get("clientId") as string)?.trim() });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const { clientId } = parsed.data;
  const supabase = getSupabaseServiceClient();

  const { data: clientRow, error: clientError } = await supabase
    .from("clients")
    .select("id, name, email, stripe_customer_id")
    .eq("id", clientId)
    .maybeSingle();

  if (clientError || !clientRow) {
    return { success: false, error: "Client not found." };
  }

  if (clientRow.stripe_customer_id) {
    revalidatePath("/admin/clients");
    revalidatePath(`/admin/clients/${clientId}/edit`);
    revalidatePath(`/admin/clients/${clientId}/link`);
    return { success: true };
  }

  const stripeCustomerId = await createStripeCustomerForClient(clientRow.name, clientRow.email);

  if (!stripeCustomerId) {
    return {
      success: false,
      error: "Stripe is not configured or customer creation failed. Check STRIPE_SECRET_KEY.",
    };
  }

  const { error: updateError } = await supabase
    .from("clients")
    .update({ stripe_customer_id: stripeCustomerId, updated_at: new Date().toISOString() })
    .eq("id", clientId);

  if (updateError) {
    console.error("[createStripeCustomerBackfillAction] db update failed:", updateError.message);
    return { success: false, error: "Failed to save Stripe customer. Please try again." };
  }

  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${clientId}/edit`);
  revalidatePath(`/admin/clients/${clientId}/link`);
  return { success: true };
}

// ---------------------------------------------------------------------------
// Project setup (client_service + project)
// ---------------------------------------------------------------------------

/** Default milestones per service: title and days from project creation. */
const SERVICE_MILESTONE_TEMPLATES: Record<string, { title: string; daysFromStart: number }[]> = {
  "1": [
    { title: "Kickoff & discovery", daysFromStart: 0 },
    { title: "Design & content review", daysFromStart: 14 },
    { title: "Development & AI integration", daysFromStart: 35 },
    { title: "Review & QA", daysFromStart: 49 },
    { title: "Launch & handoff", daysFromStart: 56 },
  ],
  "2": [
    { title: "Kickoff & call flow design", daysFromStart: 0 },
    { title: "Script & escalation rules", daysFromStart: 7 },
    { title: "Integration & testing", daysFromStart: 21 },
    { title: "Go live & monitoring", daysFromStart: 28 },
  ],
  "3": [
    { title: "Kickoff & channel setup", daysFromStart: 0 },
    { title: "Lead forms & calendar sync", daysFromStart: 14 },
    { title: "Reminders & CRM connection", daysFromStart: 21 },
    { title: "Launch & reporting", daysFromStart: 28 },
  ],
  "4": [
    { title: "Kickoff & content gathering", daysFromStart: 0 },
    { title: "Chatbot training & flows", daysFromStart: 14 },
    { title: "Lead capture & handoff", daysFromStart: 21 },
    { title: "Launch & analytics", daysFromStart: 28 },
  ],
  "5": [
    { title: "Kickoff & workflow mapping", daysFromStart: 0 },
    { title: "Integration setup", daysFromStart: 14 },
    { title: "Workflow build & test", daysFromStart: 28 },
    { title: "Go live & documentation", daysFromStart: 42 },
  ],
  "6": [
    { title: "Kickoff & requirements", daysFromStart: 0 },
    { title: "Architecture & build", daysFromStart: 21 },
    { title: "Testing & deployment", daysFromStart: 42 },
    { title: "Handoff & support", daysFromStart: 56 },
  ],
};

export async function createProjectSetupAction(
  _prevState: CreateProjectSetupState | null,
  formData: FormData
): Promise<CreateProjectSetupState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const parsed = CreateProjectSetupSchema.safeParse({
    clientId: (formData.get("clientId") as string)?.trim(),
    serviceId: (formData.get("serviceId") as string)?.trim(),
    engagementName: (formData.get("engagementName") as string)?.trim() ?? "",
    projectName: (formData.get("projectName") as string)?.trim() ?? "",
    status: (formData.get("status") as string)?.trim(),
    progress: formData.get("progress") ?? 0,
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { clientId, serviceId, engagementName, projectName, status, progress } = parsed.data;
  const supabase = getSupabaseServiceClient();

  const { data: csRow, error: csError } = await supabase
    .from("client_services")
    .insert({
      client_id: clientId,
      service_id: serviceId,
      engagement_name: engagementName,
      status,
      progress: Math.round(progress),
    })
    .select("id")
    .single();

  if (csError || !csRow) {
    console.error("[createProjectSetupAction] client_services insert failed:", csError?.message);
    return { success: false, error: "Failed to create engagement. Please try again." };
  }

  const { data: projectRow, error: projError } = await supabase
    .from("projects")
    .insert({ client_service_id: csRow.id, name: projectName, status, progress: Math.round(progress) })
    .select("id")
    .single();

  if (projError || !projectRow) {
    console.error("[createProjectSetupAction] projects insert failed:", projError?.message);
    return { success: false, error: "Failed to create project. Please try again." };
  }

  const template = SERVICE_MILESTONE_TEMPLATES[serviceId];
  if (template && template.length > 0) {
    const today = new Date();
    const milestoneRows = template.map(({ title, daysFromStart }) => {
      const due = new Date(today);
      due.setDate(due.getDate() + daysFromStart);
      return { project_id: projectRow.id, title, due_date: due.toISOString().slice(0, 10) };
    });
    await supabase.from("milestones").insert(milestoneRows);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin/clients");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/services");
  revalidatePath("/dashboard/activity");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Project metrics
// ---------------------------------------------------------------------------

export async function updateProjectMetricsAction(
  _prevState: UpdateProjectMetricsState | null,
  formData: FormData
): Promise<UpdateProjectMetricsState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const parsed = UpdateMetricsSchema.safeParse({
    projectId: (formData.get("projectId") as string)?.trim(),
    callsHandled: (formData.get("callsHandled") as string | null)?.trim() || undefined,
    leadsCaptured: (formData.get("leadsCaptured") as string | null)?.trim() || undefined,
    appointmentsBooked: (formData.get("appointmentsBooked") as string | null)?.trim() || undefined,
    hoursSaved: (formData.get("hoursSaved") as string | null)?.trim() || undefined,
    estimatedRevenue: (formData.get("estimatedRevenue") as string | null)?.trim() || undefined,
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { projectId, callsHandled, leadsCaptured, appointmentsBooked, hoursSaved, estimatedRevenue } =
    parsed.data;

  function toNumber(raw: string | undefined): number | null | "invalid" {
    if (!raw) return null;
    const value = Number(raw);
    if (Number.isNaN(value) || value < 0) return "invalid";
    return value;
  }

  const metrics = {
    callsHandled: toNumber(callsHandled),
    leadsCaptured: toNumber(leadsCaptured),
    appointmentsBooked: toNumber(appointmentsBooked),
    hoursSaved: toNumber(hoursSaved),
    estimatedRevenue: toNumber(estimatedRevenue),
  };

  if (Object.values(metrics).includes("invalid")) {
    return { success: false, error: "Metrics must be non-negative numbers." };
  }

  const supabase = getSupabaseServiceClient();

  const { error } = await supabase
    .from("project_metrics")
    .upsert(
      {
        project_id: projectId,
        calls_handled: metrics.callsHandled === "invalid" ? null : metrics.callsHandled,
        leads_captured: metrics.leadsCaptured === "invalid" ? null : metrics.leadsCaptured,
        appointments_booked: metrics.appointmentsBooked === "invalid" ? null : metrics.appointmentsBooked,
        hours_saved: metrics.hoursSaved === "invalid" ? null : metrics.hoursSaved,
        estimated_revenue: metrics.estimatedRevenue === "invalid" ? null : metrics.estimatedRevenue,
      } as any,
      { onConflict: "project_id" }
    );

  if (error) {
    console.error("[updateProjectMetricsAction] db upsert failed:", error.message);
    return { success: false, error: "Failed to update metrics. Please try again." };
  }

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}/edit`);
  return { success: true };
}
