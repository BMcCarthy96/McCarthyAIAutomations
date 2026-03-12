import { createClient } from "@supabase/supabase-js";

type SupabaseClientType = ReturnType<typeof createClient>;

let cachedClient: SupabaseClientType | null = null;

function getEnv(name: string): string | undefined {
  return process.env[name];
}

export function getSupabaseClient(): SupabaseClientType | null {
  if (cachedClient) return cachedClient;

  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !anonKey) {
    return null;
  }

  cachedClient = createClient(url, anonKey, {
    auth: {
      persistSession: false,
    },
  });

  return cachedClient;
}

