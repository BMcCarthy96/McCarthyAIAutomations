"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
} from "@/lib/admin-action-types";
import {
  updateSupportRequestStatusAction as implUpdateSupportRequestStatusAction,
  sendSupportReplyAction as implSendSupportReplyAction,
  setLeadFollowUpSuppressedAction as implSetLeadFollowUpSuppressedAction,
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

/** Temporary: remove or gate when billing create/edit is stable. */
function debugBilling(stage: string, payload: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "development") return;
  console.log(`[billing-debug] ${stage}`, payload);
}

// ---------------------------------------------------------------------------
// Project updates
// ---------------------------------------------------------------------------

export async function createProjectUpdateAction(
  _prevState: CreateProjectUpdateState | null,
  formData: FormData
): Promise<CreateProjectUpdateState> {
  const allowed = await isAdminUser();
  if (!allowed) {
    return { success: false, error: "Unauthorized." };
  }

  const projectId = (formData.get("projectId") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const body = (formData.get("body") as string)?.trim();

  if (!projectId) {
    return { success: false, error: "Please select a project." };
  }
  if (!title) {
    return { success: false, error: "Title is required." };
  }
  if (!body) {
    return { success: false, error: "Body is required." };
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { success: false, error: "Database unavailable." };
  }

  const { error } = await supabase.from("project_updates").insert({
    project_id: projectId,
    title,
    body,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // DEBUG: temporary logging for project update email troubleshooting
  console.log("[createProjectUpdateAction] 1. project update insert succeeded");

  // Notify client by email (best-effort; do not fail the action if email fails)
  try {
    const { data: projectRow, error: projectError } = await supabase
      .from("projects")
      .select("name, client_services!inner(clients(email))")
      .eq("id", projectId)
      .single();

    const projectLookupSucceeded = !projectError && projectRow != null;
    console.log(
      "[createProjectUpdateAction] 2. project lookup succeeded:",
      projectLookupSucceeded,
      projectError ? `(${projectError.message})` : ""
    );

    type ProjectWithClient = {
      name?: string;
      client_services?: { clients?: { email?: string } | null } | null;
    };
    const row = projectRow as unknown as ProjectWithClient | null;
    const projectName = row?.name ?? "Your project";
    const clientEmail = row?.client_services?.clients?.email?.trim?.();

    console.log("[createProjectUpdateAction] 3. resolved project name:", projectName);
    console.log("[createProjectUpdateAction] 4. resolved client email:", clientEmail ?? "(empty or missing)");

    const apiKey = process.env.RESEND_API_KEY?.trim();
    const fromEmail =
      (process.env.CONTACT_FROM_EMAIL ?? "").trim() || "onboarding@resend.dev";

    console.log("[createProjectUpdateAction] 5. RESEND_API_KEY exists:", Boolean(apiKey));
    console.log("[createProjectUpdateAction] 6. from address:", fromEmail);

    if (apiKey && clientEmail) {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL?.trim() ||
        (process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "");
      const updatesLink = baseUrl
        ? `${baseUrl}/dashboard/updates`
        : "/dashboard/updates";

      const emailContent = [
        `Project: ${projectName}`,
        ``,
        title,
        ``,
        body,
      ].join("\n");

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
        console.log("[createProjectUpdateAction] 7. Resend send: failed");
        console.log("[createProjectUpdateAction] 8. Resend error:", sendResult.error.message);
      } else {
        console.log("[createProjectUpdateAction] 7. Resend send: succeeded");
      }
    } else {
      console.log(
        "[createProjectUpdateAction] 7. Resend send: skipped (no apiKey or no clientEmail)"
      );
    }
  } catch (err) {
    // Ignore email errors; update was saved successfully
    console.log("[createProjectUpdateAction] 7. Resend send: threw exception");
    console.log(
      "[createProjectUpdateAction] 8. exception:",
      err instanceof Error ? err.message : String(err)
    );
  }

  return { success: true };
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

const PROJECT_STATUSES = ["active", "in_progress", "pending", "completed"] as const;

export async function updateProjectAction(
  _prevState: UpdateProjectState | null,
  formData: FormData
): Promise<UpdateProjectState> {
  const allowed = await isAdminUser();
  if (!allowed) {
    return { success: false, error: "Unauthorized." };
  }

  const projectId = (formData.get("projectId") as string)?.trim();
  const progressRaw = formData.get("progress");
  const status = (formData.get("status") as string)?.trim();

  if (!projectId) {
    return { success: false, error: "Project is required." };
  }

  const progress = progressRaw !== null && progressRaw !== "" ? Number(progressRaw) : NaN;
  if (Number.isNaN(progress) || progress < 0 || progress > 100) {
    return { success: false, error: "Progress must be between 0 and 100." };
  }

  if (!status || !PROJECT_STATUSES.includes(status as (typeof PROJECT_STATUSES)[number])) {
    return { success: false, error: "Invalid status." };
  }

  const statusValid = status as (typeof PROJECT_STATUSES)[number];

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { success: false, error: "Database unavailable." };
  }

  const { error } = await supabase
    .from("projects")
    .update({ progress: Math.round(progress), status: statusValid })
    .eq("id", projectId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function archiveProjectAction(
  _prevState: ArchiveProjectState | null,
  formData: FormData
): Promise<ArchiveProjectState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const projectId = (formData.get("projectId") as string)?.trim();
  if (!projectId) return { success: false, error: "Project is required." };

  const supabase = getSupabaseServiceClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  const { error } = await supabase
    .from("projects")
    .update({ is_archived: true })
    .eq("id", projectId);

  if (error) return { success: false, error: error.message };

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

  const projectId = (formData.get("projectId") as string)?.trim();
  if (!projectId) return { success: false, error: "Project is required." };

  const supabase = getSupabaseServiceClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  const { error } = await supabase
    .from("projects")
    .update({ is_archived: false })
    .eq("id", projectId);

  if (error) return { success: false, error: error.message };

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
  if (!allowed) {
    return { success: false, error: "Unauthorized." };
  }

  const projectId = (formData.get("projectId") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const dueDateRaw = (formData.get("dueDate") as string)?.trim();

  if (!projectId) {
    return { success: false, error: "Project is required." };
  }
  if (!title) {
    return { success: false, error: "Title is required." };
  }
  if (!dueDateRaw) {
    return { success: false, error: "Due date is required." };
  }

  const date = new Date(dueDateRaw);
  if (Number.isNaN(date.getTime())) {
    return { success: false, error: "Invalid due date." };
  }
  const dueDate = dueDateRaw.slice(0, 10);

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { success: false, error: "Database unavailable." };
  }

  const { error } = await supabase.from("milestones").insert({
    project_id: projectId,
    title,
    due_date: dueDate,
  });

  if (error) {
    return { success: false, error: error.message };
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
  if (!allowed) {
    return { success: false, error: "Unauthorized." };
  }

  const milestoneId = (formData.get("milestoneId") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const dueDateRaw = (formData.get("dueDate") as string)?.trim();
  const markComplete = formData.get("markComplete") === "true";

  if (!milestoneId) {
    return { success: false, error: "Milestone is required." };
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { success: false, error: "Database unavailable." };
  }

  const updates: { title?: string; due_date?: string; completed_at?: string | null } = {};

  if (!title) {
    return { success: false, error: "Title is required." };
  }
  updates.title = title;

  if (dueDateRaw) {
    const date = new Date(dueDateRaw);
    if (Number.isNaN(date.getTime())) {
      return { success: false, error: "Invalid due date." };
    }
    updates.due_date = dueDateRaw.slice(0, 10);
  }

  if (markComplete) {
    updates.completed_at = new Date().toISOString();
  }

  if (Object.keys(updates).length === 0) {
    return { success: false, error: "No change specified." };
  }

  const { error } = await supabase
    .from("milestones")
    .update(updates)
    .eq("id", milestoneId);

  if (error) {
    return { success: false, error: error.message };
  }

  const projectId = (formData.get("projectId") as string)?.trim();
  if (projectId) {
    revalidatePath(`/admin/projects/${projectId}/edit`);
  }
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
      const fromEmail =
        (process.env.CONTACT_FROM_EMAIL ?? "").trim() || "onboarding@resend.dev";

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
        await resend.emails.send({
          from: fromEmail,
          to: clientEmail,
          subject: `Milestone completed: ${milestoneTitle}`,
          html,
        });
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
  if (!allowed) {
    return { success: false, error: "Unauthorized." };
  }

  const milestoneId = (formData.get("milestoneId") as string)?.trim();
  const projectId = (formData.get("projectId") as string)?.trim();

  if (!milestoneId) {
    return { success: false, error: "Milestone is required." };
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { success: false, error: "Database unavailable." };
  }

  const { error } = await supabase
    .from("milestones")
    .delete()
    .eq("id", milestoneId);

  if (error) {
    return { success: false, error: error.message };
  }

  if (projectId) {
    revalidatePath(`/admin/projects/${projectId}/edit`);
  }
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

/**
 * Send branded “monthly impact report” emails to all clients with an email on file.
 * Manual trigger for admins (no cron). Skips clients with no reportable metrics.
 */
export async function runMonthlyImpactReportEmailsAction(
  _prevState: RunMonthlyImpactReportEmailsState | null,
  _formData: FormData
): Promise<RunMonthlyImpactReportEmailsState> {
  const allowed = await isAdminUser();
  if (!allowed) {
    return { success: false, error: "Unauthorized." };
  }

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
 * Manual admin trigger; same batch logic as POST /api/cron/lead-follow-up (with secret).
 */
export async function sendPendingLeadFollowUpsAction(
  _prevState: SendPendingLeadFollowUpsState | null,
  _formData: FormData
): Promise<SendPendingLeadFollowUpsState> {
  const allowed = await isAdminUser();
  if (!allowed) {
    return { success: false, error: "Unauthorized." };
  }

  const bookingUrl = getBookingUrl();
  if (!bookingUrl) {
    return {
      success: false,
      error:
        "Set NEXT_PUBLIC_BOOKING_URL or BOOKING_URL to a valid URL (e.g. Cal.com or Calendly).",
    };
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { success: false, error: "Database unavailable." };
  }

  try {
    const result = await processPendingLeadFollowUps(bookingUrl);
    revalidatePath("/admin/support");
    return { success: true, sent: result.sent, failed: result.failed };
  } catch (e) {
    return {
      success: false,
      error:
        e instanceof Error ? e.message : "Failed to send lead follow-up emails.",
    };
  }
}

// ---------------------------------------------------------------------------
// Billing
// ---------------------------------------------------------------------------

const BILLING_STATUSES = ["pending", "paid", "overdue"] as const;

function parseDollarsToCents(raw: string): { ok: true; cents: number } | { ok: false; error: string } {
  const trimmed = raw.trim().replace(/,/g, "");
  if (!trimmed) {
    return { ok: false, error: "Amount is required." };
  }
  const n = Number.parseFloat(trimmed);
  if (!Number.isFinite(n) || n <= 0) {
    return { ok: false, error: "Enter a valid amount greater than zero." };
  }
  const cents = Math.round(n * 100);
  if (cents < 1) {
    return { ok: false, error: "Amount is too small." };
  }
  if (cents > 10_000_000_000) {
    return { ok: false, error: "Amount is too large." };
  }
  return { ok: true, cents };
}

/** Default invoice due date: 30 days from today (UTC date). */
function defaultBillingDueDateIso(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 30);
  return d.toISOString().slice(0, 10);
}

export async function createBillingRecordAction(
  _prevState: CreateBillingRecordState | null,
  formData: FormData
): Promise<CreateBillingRecordState> {
  const allowed = await isAdminUser();
  if (!allowed) {
    return { success: false, error: "Unauthorized." };
  }

  const clientId = (formData.get("clientId") as string)?.trim();
  const amountRaw = (formData.get("amountDollars") as string) ?? "";
  const description = (formData.get("description") as string)?.trim() ?? "";
  const statusRaw = (formData.get("status") as string)?.trim() || "pending";

  if (!clientId) {
    return { success: false, error: "Select a client." };
  }
  if (!description) {
    return { success: false, error: "Description is required." };
  }
  if (!(BILLING_STATUSES as readonly string[]).includes(statusRaw)) {
    return { success: false, error: "Invalid status." };
  }

  const amount = parseDollarsToCents(amountRaw);
  if (!amount.ok) {
    return { success: false, error: amount.error };
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { success: false, error: "Database unavailable." };
  }

  const { data: clientRow, error: clientErr } = await supabase
    .from("clients")
    .select("id")
    .eq("id", clientId)
    .maybeSingle();

  if (clientErr || !clientRow) {
    return { success: false, error: "Client not found." };
  }

  const statusValid = statusRaw as (typeof BILLING_STATUSES)[number];

  const insertPayload = {
    client_id: clientId,
    amount_cents: amount.cents,
    currency: "USD",
    description,
    status: statusValid,
    due_date: defaultBillingDueDateIso(),
    paid_at: null,
    updated_at: new Date().toISOString(),
  };

  debugBilling("create:insert_payload", { ...insertPayload, due_date: insertPayload.due_date });

  const { data: inserted, error } = await supabase
    .from("billing_records")
    .insert(insertPayload)
    .select("id, amount_cents, description, stripe_payment_link_url, updated_at")
    .single();

  debugBilling("create:insert_result", {
    error: error?.message ?? null,
    insertedId: inserted?.id ?? null,
    row: inserted ?? null,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateBillingViews();
  debugBilling("create:revalidated", { paths: ["/admin/billing", "/dashboard/billing"] });
  return { success: true };
}

export async function updateBillingRecordAction(
  _prevState: UpdateBillingRecordState | null,
  formData: FormData
): Promise<UpdateBillingRecordState> {
  const allowed = await isAdminUser();
  if (!allowed) {
    return { success: false, error: "Unauthorized." };
  }

  const recordId = (formData.get("recordId") as string)?.trim();
  const amountRaw = (formData.get("amountDollars") as string) ?? "";
  const description = (formData.get("description") as string)?.trim() ?? "";
  const status = (formData.get("status") as string)?.trim();

  if (!recordId) {
    return { success: false, error: "Record is required." };
  }
  if (!description) {
    return { success: false, error: "Description is required." };
  }
  if (!status || !(BILLING_STATUSES as readonly string[]).includes(status)) {
    return { success: false, error: "Invalid status." };
  }

  const amount = parseDollarsToCents(amountRaw);
  if (!amount.ok) {
    return { success: false, error: amount.error };
  }

  const statusValid = status as (typeof BILLING_STATUSES)[number];

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { success: false, error: "Database unavailable." };
  }

  const { data: prev, error: prevError } = await supabase
    .from("billing_records")
    .select("amount_cents, description, stripe_payment_link_url")
    .eq("id", recordId)
    .maybeSingle();

  if (prevError || !prev) {
    return {
      success: false,
      error: prevError?.message ?? "Billing record not found.",
    };
  }

  const prevRow = prev as {
    amount_cents: number;
    description: string;
    stripe_payment_link_url: string | null;
  };

  const prevDesc = (prevRow.description ?? "").trim();
  const newDesc = description.trim();
  const amountChanged = prevRow.amount_cents !== amount.cents;
  const descriptionChanged = prevDesc !== newDesc;
  const checkoutFieldsChanged = amountChanged || descriptionChanged;

  const hadPaymentLink = Boolean(
    prevRow.stripe_payment_link_url && String(prevRow.stripe_payment_link_url).trim()
  );

  const updatePayload: Record<string, unknown> = {
    amount_cents: amount.cents,
    description,
    status: statusValid,
    updated_at: new Date().toISOString(),
  };

  if (checkoutFieldsChanged) {
    updatePayload.stripe_payment_link_url = null;
  }

  debugBilling("update:pre_save", {
    recordId,
    prev: {
      amount_cents: prevRow.amount_cents,
      description: prevRow.description,
      stripe_payment_link_url: prevRow.stripe_payment_link_url
        ? "[set]"
        : null,
    },
    next: {
      amount_cents: amount.cents,
      description,
      status: statusValid,
    },
    amountChanged,
    descriptionChanged,
    checkoutFieldsChanged,
    hadPaymentLink,
    willClearStripeUrl: checkoutFieldsChanged,
    updatePayload: {
      ...updatePayload,
      stripe_payment_link_url:
        updatePayload.stripe_payment_link_url === null
          ? null
          : updatePayload.stripe_payment_link_url ?? "[unchanged]",
    },
  });

  const { data: updatedRow, error } = await supabase
    .from("billing_records")
    .update(updatePayload)
    .eq("id", recordId)
    .select("id, amount_cents, description, stripe_payment_link_url, updated_at")
    .maybeSingle();

  debugBilling("update:post_save", {
    error: error?.message ?? null,
    row: updatedRow
      ? {
          id: updatedRow.id,
          amount_cents: updatedRow.amount_cents,
          description: updatedRow.description,
          stripe_payment_link_url: updatedRow.stripe_payment_link_url ? "[set]" : null,
          updated_at: updatedRow.updated_at,
        }
      : null,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateBillingViews();
  debugBilling("update:revalidated", { recordId });

  const stripeLinkCleared = checkoutFieldsChanged && hadPaymentLink;
  return { success: true, ...(stripeLinkCleared ? { stripeLinkCleared: true } : {}) };
}

export async function deleteBillingRecordAction(
  _prevState: DeleteBillingRecordState | null,
  formData: FormData
): Promise<DeleteBillingRecordState> {
  const allowed = await isAdminUser();
  if (!allowed) {
    return { success: false, error: "Unauthorized." };
  }

  const recordId = (formData.get("recordId") as string)?.trim();
  if (!recordId) {
    return { success: false, error: "Record is required." };
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { success: false, error: "Database unavailable." };
  }

  const { error } = await supabase.from("billing_records").delete().eq("id", recordId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateBillingViews();
  return { success: true };
}

export async function createStripePaymentLinkAction(
  _prevState: CreateStripePaymentLinkState | null,
  formData: FormData
): Promise<CreateStripePaymentLinkState> {
  const allowed = await isAdminUser();
  if (!allowed) {
    return { success: false, error: "Unauthorized." };
  }

  const recordId = (formData.get("recordId") as string)?.trim();
  if (!recordId) {
    return { success: false, error: "Record is required." };
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { success: false, error: "Database unavailable." };
  }

  // 1) Load billing record
  const { data: recordRow, error: recordError } = await supabase
    .from("billing_records")
    .select("id, client_id, amount_cents, description")
    .eq("id", recordId)
    .single();

  if (recordError || !recordRow) {
    return { success: false, error: recordError?.message ?? "Billing record not found." };
  }

  // 2) Load client stripe customer id
  const { data: clientRow, error: clientError } = await supabase
    .from("clients")
    .select("stripe_customer_id")
    .eq("id", recordRow.client_id)
    .single();

  if (clientError || !clientRow) {
    return { success: false, error: clientError?.message ?? "Client not found." };
  }

  const customerId = clientRow.stripe_customer_id as string | null;
  if (!customerId) {
    return {
      success: false,
      error:
        "Stripe customer id is missing for this client. Create the client record first.",
    };
  }

  const amountDollars = recordRow.amount_cents / 100;
  const description = (recordRow.description ?? "").trim() || "Payment";

  // 3) Create payment link via Stripe (fail gracefully)
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
    const message =
      err instanceof Error ? err.message : "Stripe payment link creation failed.";
    return { success: false, error: message };
  }

  if (!url) {
    return {
      success: false,
      error:
        "Stripe is not configured or payment link creation failed. Check STRIPE_SECRET_KEY.",
    };
  }

  // 4) Persist the link
  const { error: updateError } = await supabase
    .from("billing_records")
    .update({ stripe_payment_link_url: url, updated_at: new Date().toISOString() })
    .eq("id", recordId);

  if (updateError) {
    return { success: false, error: updateError.message };
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

  const name = (formData.get("name") as string)?.trim() ?? "";
  const email = (formData.get("email") as string)?.trim() ?? "";
  const company = (formData.get("company") as string)?.trim() || null;
  const clerkUserId = (formData.get("clerkUserId") as string)?.trim() || null;

  if (!name) return { success: false, error: "Name is required." };
  if (!email) return { success: false, error: "Email is required." };

  const supabase = getSupabaseServiceClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  const stripeCustomerId = await createStripeCustomerForClient(name, email);

  const { error } = await supabase.from("clients").insert({
    name,
    email,
    company,
    clerk_user_id: clerkUserId,
    stripe_customer_id: stripeCustomerId ?? null,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/clients");
  return { success: true };
}

export async function updateClientAction(
  _prevState: UpdateClientState | null,
  formData: FormData
): Promise<UpdateClientState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const clientId = (formData.get("clientId") as string)?.trim();
  const name = (formData.get("name") as string)?.trim() ?? "";
  const email = (formData.get("email") as string)?.trim() ?? "";
  const company = (formData.get("company") as string)?.trim() || null;
  const clerkUserId = (formData.get("clerkUserId") as string)?.trim() || null;
  const monthlyReportEnabled = formData.get("monthlyReportEnabled") === "on";

  if (!clientId) return { success: false, error: "Client is required." };
  if (!name) return { success: false, error: "Name is required." };
  if (!email) return { success: false, error: "Email is required." };

  const supabase = getSupabaseServiceClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  const { error } = await supabase
    .from("clients")
    .update({
      name,
      email,
      company,
      clerk_user_id: clerkUserId,
      monthly_report_enabled: monthlyReportEnabled,
      updated_at: new Date().toISOString(),
    })
    .eq("id", clientId);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath(`/admin/clients/${clientId}/edit`);
  return { success: true };
}

/** Update only clerk_user_id for linking portal sign-in. */
export async function updateClientClerkLinkAction(
  _prevState: UpdateClientClerkLinkState | null,
  formData: FormData
): Promise<UpdateClientClerkLinkState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const clientId = (formData.get("clientId") as string)?.trim();
  const clerkUserId = (formData.get("clerkUserId") as string)?.trim() ?? "";

  if (!clientId) return { success: false, error: "Client is required." };
  if (!clerkUserId) return { success: false, error: "Clerk user ID is required." };

  const supabase = getSupabaseServiceClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  const { error } = await supabase
    .from("clients")
    .update({
      clerk_user_id: clerkUserId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", clientId);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath(`/admin/clients/${clientId}/edit`);
  revalidatePath(`/admin/clients/${clientId}/link`);
  return { success: true };
}

/** Single-argument form actions for `<form action={...}>` (no useActionState). */
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

  const clientId = (formData.get("clientId") as string)?.trim();
  if (!clientId) return { success: false, error: "Client is required." };

  const supabase = getSupabaseServiceClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  const { error } = await supabase
    .from("clients")
    .update({ is_archived: true, updated_at: new Date().toISOString() })
    .eq("id", clientId);

  if (error) return { success: false, error: error.message };

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

  const clientId = (formData.get("clientId") as string)?.trim();
  if (!clientId) return { success: false, error: "Client is required." };

  const supabase = getSupabaseServiceClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  const { error } = await supabase
    .from("clients")
    .update({ is_archived: false, updated_at: new Date().toISOString() })
    .eq("id", clientId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath(`/admin/clients/${clientId}/edit`);
  revalidatePath(`/admin/clients/${clientId}/link`);
  return { success: true };
}

/**
 * Permanently removes the client and all related rows (see migration `delete_client_cascade`).
 * Requires typing the client email exactly. Does not delete the Stripe customer in Stripe.
 */
export async function deleteClientAction(
  _prevState: DeleteClientState | null,
  formData: FormData
): Promise<DeleteClientState> {
  const allowed = await isAdminUser();
  if (!allowed) return { success: false, error: "Unauthorized." };

  const clientId = (formData.get("clientId") as string)?.trim();
  const confirmEmail = (formData.get("confirmEmail") as string)?.trim() ?? "";

  if (!clientId) return { success: false, error: "Client is required." };

  const supabase = getSupabaseServiceClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  const { data: row, error: fetchErr } = await supabase
    .from("clients")
    .select("email")
    .eq("id", clientId)
    .maybeSingle();

  if (fetchErr || !row) {
    return { success: false, error: fetchErr?.message ?? "Client not found." };
  }

  const email = String(row.email ?? "").trim();
  if (!email || confirmEmail !== email) {
    return {
      success: false,
      error: "Type the client email exactly to confirm permanent deletion.",
    };
  }

  const { error: rpcErr } = await supabase.rpc("delete_client_cascade", {
    p_client_id: clientId,
  });

  if (rpcErr) {
    return { success: false, error: rpcErr.message };
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

  const clientId = (formData.get("clientId") as string)?.trim();
  if (!clientId) return { success: false, error: "Client is required." };

  const supabase = getSupabaseServiceClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  const { data: clientRow, error: clientError } = await supabase
    .from("clients")
    .select("id, name, email, stripe_customer_id")
    .eq("id", clientId)
    .maybeSingle();

  if (clientError || !clientRow) {
    return {
      success: false,
      error: clientError?.message ?? "Client not found.",
    };
  }

  if (clientRow.stripe_customer_id) {
    // Idempotent: nothing to do.
    revalidatePath("/admin/clients");
    revalidatePath(`/admin/clients/${clientId}/edit`);
    revalidatePath(`/admin/clients/${clientId}/link`);
    return { success: true };
  }

  const stripeCustomerId = await createStripeCustomerForClient(
    clientRow.name,
    clientRow.email
  );

  if (!stripeCustomerId) {
    return {
      success: false,
      error:
        "Stripe is not configured or customer creation failed. Check STRIPE_SECRET_KEY.",
    };
  }

  const { error: updateError } = await supabase
    .from("clients")
    .update({
      stripe_customer_id: stripeCustomerId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", clientId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${clientId}/edit`);
  revalidatePath(`/admin/clients/${clientId}/link`);

  return { success: true };
}

// ---------------------------------------------------------------------------
// Project setup (client_service + project)
// ---------------------------------------------------------------------------

const PROJECT_SETUP_STATUSES = ["active", "in_progress", "pending", "completed"] as const;

/** Default milestones per service: title and days from project creation. Missing serviceId = no auto-milestones. */
const SERVICE_MILESTONE_TEMPLATES: Record<
  string,
  { title: string; daysFromStart: number }[]
> = {
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

  const clientId = (formData.get("clientId") as string)?.trim();
  const serviceId = (formData.get("serviceId") as string)?.trim();
  const engagementName = (formData.get("engagementName") as string)?.trim() ?? "";
  const projectName = (formData.get("projectName") as string)?.trim() ?? "";
  const status = (formData.get("status") as string)?.trim();
  const progressRaw = formData.get("progress");

  if (!clientId) return { success: false, error: "Client is required." };
  if (!serviceId) return { success: false, error: "Service is required." };
  if (!engagementName) return { success: false, error: "Engagement name is required." };
  if (!projectName) return { success: false, error: "Project name is required." };
  if (!status || !(PROJECT_SETUP_STATUSES as readonly string[]).includes(status)) {
    return { success: false, error: "Invalid status." };
  }

  const statusValid = status as (typeof PROJECT_SETUP_STATUSES)[number];

  const progress = progressRaw !== null && progressRaw !== "" ? Number(progressRaw) : 0;
  if (Number.isNaN(progress) || progress < 0 || progress > 100) {
    return { success: false, error: "Progress must be 0–100." };
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  const { data: csRow, error: csError } = await supabase
    .from("client_services")
    .insert({
      client_id: clientId,
      service_id: serviceId,
      engagement_name: engagementName,
      status: statusValid,
      progress: Math.round(progress),
    })
    .select("id")
    .single();

  if (csError || !csRow) return { success: false, error: csError?.message ?? "Failed to create engagement." };

  const { data: projectRow, error: projError } = await supabase
    .from("projects")
    .insert({
      client_service_id: csRow.id,
      name: projectName,
      status: statusValid,
      progress: Math.round(progress),
    })
    .select("id")
    .single();

  if (projError || !projectRow) {
    return { success: false, error: projError?.message ?? "Failed to create project." };
  }

  // Auto-create default milestones from service template (best-effort; do not fail setup)
  const template = SERVICE_MILESTONE_TEMPLATES[serviceId];
  if (template && template.length > 0) {
    const today = new Date();
    const milestoneRows = template.map(({ title, daysFromStart }) => {
      const due = new Date(today);
      due.setDate(due.getDate() + daysFromStart);
      return {
        project_id: projectRow.id,
        title,
        due_date: due.toISOString().slice(0, 10),
      };
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

  const projectId = (formData.get("projectId") as string)?.trim();
  if (!projectId) return { success: false, error: "Project is required." };

  function toNumber(name: string): number | null | "invalid" {
    const raw = (formData.get(name) as string | null)?.trim();
    if (!raw) return null;
    const value = Number(raw);
    if (Number.isNaN(value) || value < 0) return "invalid";
    return value;
  }

  const callsHandled = toNumber("callsHandled");
  const leadsCaptured = toNumber("leadsCaptured");
  const appointmentsBooked = toNumber("appointmentsBooked");
  const hoursSaved = toNumber("hoursSaved");
  const estimatedRevenue = toNumber("estimatedRevenue");

  if (
    [callsHandled, leadsCaptured, appointmentsBooked, hoursSaved, estimatedRevenue].includes(
      "invalid" as any
    )
  ) {
    return { success: false, error: "Metrics must be non-negative numbers." };
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  const { error } = await supabase
    .from("project_metrics")
    .upsert(
      {
        project_id: projectId,
        calls_handled: callsHandled === "invalid" ? null : callsHandled,
        leads_captured: leadsCaptured === "invalid" ? null : leadsCaptured,
        appointments_booked:
          appointmentsBooked === "invalid" ? null : appointmentsBooked,
        hours_saved: hoursSaved === "invalid" ? null : hoursSaved,
        estimated_revenue:
          estimatedRevenue === "invalid" ? null : estimatedRevenue,
      } as any,
      { onConflict: "project_id" }
    );

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}/edit`);
  return { success: true };
}

