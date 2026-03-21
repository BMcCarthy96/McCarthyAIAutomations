import { cache } from "react";
import { getCurrentClientId } from "@/lib/portal-data";
import { getSupabaseServiceClient } from "@/lib/supabase";

/**
 * Seeded showcase client from `supabase/seeds/demo_showcase.sql`.
 * Additional IDs/emails can be set via env for staging without code changes.
 */
export const SHOWCASE_DEMO_CLIENT_ID = "72b8a4b0-9e83-4f39-a5b2-3f3589fb2c77";

function demoClientIds(): Set<string> {
  const ids = new Set<string>([SHOWCASE_DEMO_CLIENT_ID]);
  const extra = process.env.DEMO_CLIENT_IDS?.split(",") ?? [];
  for (const id of extra) {
    const t = id.trim();
    if (t) ids.add(t);
  }
  return ids;
}

function demoClientEmails(): Set<string> {
  const emails = new Set<string>(["demo@acmehome.example"]);
  const extra = process.env.DEMO_CLIENT_EMAILS?.split(",") ?? [];
  for (const e of extra) {
    const t = e.trim().toLowerCase();
    if (t) emails.add(t);
  }
  return emails;
}

export function isDemoClientId(clientId: string | null | undefined): boolean {
  if (!clientId) return false;
  return demoClientIds().has(clientId);
}

export function isDemoClientEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return demoClientEmails().has(email.trim().toLowerCase());
}

/**
 * True when the signed-in portal user is linked to a demo/showcase client.
 * Cached per request. Real clients never match unless their id/email is listed for demos.
 */
export const getPortalDemoMode = cache(async (): Promise<boolean> => {
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
