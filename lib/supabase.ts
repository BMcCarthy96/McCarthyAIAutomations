import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

/**
 * Supabase clients: anon (RLS) and service role (server-only, bypasses RLS).
 * Use getSupabaseServiceClient() in server code (admin + portal data/actions).
 */

let cachedAnonClient: SupabaseClient<Database> | null = null;
let cachedServiceClient: SupabaseClient<Database> | null = null;

function getEnv(name: string): string | undefined {
  return process.env[name];
}

/** Anon key client (RLS applies). Use for client-side or when you rely on RLS. */
export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (cachedAnonClient) return cachedAnonClient;

  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !anonKey) return null;

  cachedAnonClient = createClient<Database>(url, anonKey, {
    auth: { persistSession: false },
  });
  return cachedAnonClient;
}

/**
 * Server-only client using the service role key. Bypasses RLS.
 * Use only in server code (e.g. API routes, server components). Never expose
 * SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export function getSupabaseServiceClient(): SupabaseClient<Database> | null {
  if (cachedServiceClient) return cachedServiceClient;

  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceRoleKey) return null;

  cachedServiceClient = createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
  return cachedServiceClient;
}

