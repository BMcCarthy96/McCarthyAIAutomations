import { cache } from "react";
import { getCurrentClientId } from "@/lib/portal-data";
import { getSupabaseServiceClient } from "@/lib/supabase";

/**
 * UUID of the seeded showcase client in `supabase/seeds/demo_showcase.sql`.
 * In production, demo mode does not use this unless DEMO_ALLOW_SEED_DEFAULTS=true
 * (set DEMO_CLIENT_IDS / DEMO_CLIENT_EMAILS for your real prod demo row instead).
 */
export const SHOWCASE_DEMO_CLIENT_ID = "72b8a4b0-9e83-4f39-a5b2-3f3589fb2c77";

const SHOWCASE_DEMO_EMAIL = "demo@acmehome.example";

/** Seed UUID/email defaults apply in development, or in production only when explicitly allowed. */
function allowSeedDemoDefaults(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  return process.env.DEMO_ALLOW_SEED_DEFAULTS === "true";
}

function demoClientIds(): Set<string> {
  const fromEnv =
    process.env.DEMO_CLIENT_IDS?.split(",")
      .map((id) => id.trim())
      .filter(Boolean) ?? [];
  if (fromEnv.length > 0) {
    return new Set(fromEnv);
  }
  if (allowSeedDemoDefaults()) {
    return new Set([SHOWCASE_DEMO_CLIENT_ID]);
  }
  return new Set();
}

function demoClientEmails(): Set<string> {
  const fromEnv =
    process.env.DEMO_CLIENT_EMAILS?.split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean) ?? [];
  if (fromEnv.length > 0) {
    return new Set(fromEnv);
  }
  if (allowSeedDemoDefaults()) {
    return new Set([SHOWCASE_DEMO_EMAIL]);
  }
  return new Set();
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
