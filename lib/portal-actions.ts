"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { getCurrentClientId } from "@/lib/portal-data";

export type CreateSupportRequestState =
  | { success: false; error: string }
  | { success: true };

const SUBJECT_MAX = 500;
const BODY_MAX = 10000;

export async function createSupportRequestAction(
  _prevState: CreateSupportRequestState | null,
  formData: FormData
): Promise<CreateSupportRequestState> {
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
