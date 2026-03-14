"use server";

/**
 * Admin support actions: status updates for /admin/support.
 */

import { revalidatePath } from "next/cache";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { isAdminUser } from "@/lib/admin-auth";
import type { UpdateSupportRequestStatusState } from "@/lib/admin-action-types";

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

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { success: false, error: "Database unavailable." };
  }

  const { error } = await supabase
    .from("support_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", requestId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/support");
  revalidatePath(`/admin/support/${requestId}`);
  revalidatePath("/dashboard/support");
  return { success: true };
}
