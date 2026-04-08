/**
 * Demo client identity (UUIDs / emails) — no imports from portal-data (avoids circular deps).
 * Used by portal resolution and demo-mode detection.
 */

export const SHOWCASE_DEMO_CLIENT_ID = "72b8a4b0-9e83-4f39-a5b2-3f3589fb2c77";

const SHOWCASE_DEMO_EMAIL = "demo@acmehome.example";

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
