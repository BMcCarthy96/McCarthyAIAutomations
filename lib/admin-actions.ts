"use server";

import { getSupabaseServiceClient } from "@/lib/supabase";
import { isAdminUser } from "@/lib/admin-auth";

export type CreateProjectUpdateState =
  | { success: false; error: string }
  | { success: true };

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

const PROJECT_STATUSES = ["active", "in_progress", "pending", "completed"] as const;

export type UpdateProjectState =
  | { success: false; error: string }
  | { success: true };

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

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { success: false, error: "Database unavailable." };
  }

  const { error } = await supabase
    .from("projects")
    .update({ progress: Math.round(progress), status })
    .eq("id", projectId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
