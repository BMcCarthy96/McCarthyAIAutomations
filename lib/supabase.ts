import { createClient } from "@supabase/supabase-js";

type SupabaseClientType = ReturnType<typeof createClient>;

let cachedAnonClient: SupabaseClientType | null = null;
let cachedServiceClient: SupabaseClientType | null = null;

function getEnv(name: string): string | undefined {
  return process.env[name];
}

/** Anon key client (RLS applies). Use for client-side or when you rely on RLS. */
export function getSupabaseClient(): SupabaseClientType | null {
  if (cachedAnonClient) return cachedAnonClient;

  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !anonKey) return null;

  cachedAnonClient = createClient(url, anonKey, {
    auth: { persistSession: false },
  });
  return cachedAnonClient;
}

/**
 * Server-only client using the service role key. Bypasses RLS.
 * Use only in server code (e.g. API routes, server components). Never expose
 * SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export function getSupabaseServiceClient(): SupabaseClientType | null {
  if (cachedServiceClient) return cachedServiceClient;

  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceRoleKey) return null;

  cachedServiceClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
  return cachedServiceClient;
}

