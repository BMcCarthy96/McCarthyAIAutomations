import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

/**
 * Supabase clients: anon (RLS) and service role (server-only, bypasses RLS).
 * Use getSupabaseServiceClient() in server code (admin + portal data/actions).
 */

let cachedAnonClient: SupabaseClient<Database> | null = null;
let cachedServiceClient: SupabaseClient<Database> | null = null;

/** Anon key client (RLS applies). Use for client-side or when you rely on RLS. */
export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (cachedAnonClient) return cachedAnonClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) return null;

  cachedAnonClient = createClient<Database>(url, anonKey, {
    auth: { persistSession: false },
  });
  return cachedAnonClient;
}

/**
 * Server-only client using the service role key. Bypasses RLS.
 * Use only in server code (API routes, server actions, server components).
 * Throws immediately if required env vars are absent so misconfiguration
 * surfaces as a loud startup error rather than a silent null-client failure.
 */
export function getSupabaseServiceClient(): SupabaseClient<Database> {
  if (cachedServiceClient) return cachedServiceClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    const missing = [
      !url && "NEXT_PUBLIC_SUPABASE_URL",
      !serviceRoleKey && "SUPABASE_SERVICE_ROLE_KEY",
    ]
      .filter(Boolean)
      .join(", ");
    throw new Error(
      `[supabase] Missing required environment variable(s): ${missing}. ` +
        "Set these in .env.local and in your Vercel project settings."
    );
  }

  cachedServiceClient = createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
  return cachedServiceClient;
}
