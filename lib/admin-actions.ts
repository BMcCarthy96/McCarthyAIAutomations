"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { isAdminUser } from "@/lib/admin-auth";
import type {
  CreateProjectUpdateState,
  UpdateProjectState,
  UpdateMilestoneState,
  UpdateBillingStatusState,
  UpdateSupportRequestStatusState,
  CreateClientState,
  UpdateClientState,
  CreateProjectSetupState,
  UpdateClientClerkLinkState,
} from "@/lib/admin-action-types";
import {
  updateSupportRequestStatusAction as implUpdateSupportRequestStatusAction,
} from "@/lib/support/admin-actions";

/**
 * Admin actions: server actions for /admin.
 * All mutations require isAdminUser(). Use for forms and inline updates.
 * Grouped by domain: project updates, projects, milestones, support, billing.
 */

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

// ---------------------------------------------------------------------------
// Milestones
// ---------------------------------------------------------------------------

export async function updateMilestoneAction(
  _prevState: UpdateMilestoneState | null,
  formData: FormData
): Promise<UpdateMilestoneState> {
  const allowed = await isAdminUser();
  if (!allowed) {
    return { success: false, error: "Unauthorized." };
  }

  const milestoneId = (formData.get("milestoneId") as string)?.trim();
  const dueDateRaw = (formData.get("dueDate") as string)?.trim();
  const markComplete = formData.get("markComplete") === "true";

  if (!milestoneId) {
    return { success: false, error: "Milestone is required." };
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { success: false, error: "Database unavailable." };
  }

  const updates: { due_date?: string; completed_at?: string | null } = {};

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

// ---------------------------------------------------------------------------
// Billing
// ---------------------------------------------------------------------------

const BILLING_STATUSES = ["pending", "paid", "overdue"] as const;

export async function updateBillingStatusAction(
  _prevState: UpdateBillingStatusState | null,
  formData: FormData
): Promise<UpdateBillingStatusState> {
  const allowed = await isAdminUser();
  if (!allowed) {
    return { success: false, error: "Unauthorized." };
  }

  const recordId = (formData.get("recordId") as string)?.trim();
  const status = (formData.get("status") as string)?.trim();

  if (!recordId) {
    return { success: false, error: "Record is required." };
  }
  if (!status || !(BILLING_STATUSES as readonly string[]).includes(status)) {
    return { success: false, error: "Invalid status." };
  }

  const statusValid = status as (typeof BILLING_STATUSES)[number];

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { success: false, error: "Database unavailable." };
  }

  const { error } = await supabase
    .from("billing_records")
    .update({ status: statusValid, updated_at: new Date().toISOString() })
    .eq("id", recordId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/billing");
  revalidatePath("/dashboard/billing");
  return { success: true };
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

  const { error } = await supabase.from("clients").insert({
    name,
    email,
    company,
    clerk_user_id: clerkUserId,
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

// ---------------------------------------------------------------------------
// Project setup (client_service + project)
// ---------------------------------------------------------------------------

const PROJECT_SETUP_STATUSES = ["active", "in_progress", "pending", "completed"] as const;

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

  const { error: projError } = await supabase.from("projects").insert({
    client_service_id: csRow.id,
    name: projectName,
    status: statusValid,
    progress: Math.round(progress),
  });

  if (projError) return { success: false, error: projError.message };

  revalidatePath("/admin/projects");
  revalidatePath("/admin/clients");
  return { success: true };
}

