import { cache } from "react";
import { getCurrentClientId } from "@/lib/portal-data";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { isAdminUser } from "@/lib/admin-auth";
import { isDemoClientEmail, isDemoClientId } from "@/lib/demo-config";

/** Re-export for callers that imported showcase id from demo-portal. */
export { SHOWCASE_DEMO_CLIENT_ID } from "@/lib/demo-config";

export { isDemoClientId, isDemoClientEmail } from "@/lib/demo-config";

/**
 * True when the signed-in portal user is linked to a demo/showcase client.
 * Cached per request. Admins never see demo portal mode (strict separation from admin identity).
 */
export const getPortalDemoMode = cache(async (): Promise<boolean> => {
  if (await isAdminUser()) return false;

  const clientId = await getCurrentClientId();
  if (!clientId) return false;

  if (isDemoClientId(clientId)) return true;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return false;

  const { data, error } = await supabase
    .from("clients")
    .select("email")
    .eq("id", clientId)
    .maybeSingle();

  if (error || !data || typeof data.email !== "string") return false;
  return isDemoClientEmail(data.email);
});
