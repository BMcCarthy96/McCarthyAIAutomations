import { NextResponse } from "next/server";

/**
 * Temporary debug route: exposes whether email-related env vars are set.
 * Do not expose RESEND_API_KEY value. Remove or restrict in production when done debugging.
 */
export async function GET() {
  const hasResendApiKey = Boolean(process.env.RESEND_API_KEY?.trim());
  const hasContactEmail = Boolean(process.env.CONTACT_EMAIL?.trim());
  const hasContactFromEmail = Boolean(process.env.CONTACT_FROM_EMAIL?.trim());
  const contactEmail =
    process.env.CONTACT_EMAIL?.trim() || null;
  const contactFromEmail =
    process.env.CONTACT_FROM_EMAIL?.trim() || null;

  return NextResponse.json({
    hasResendApiKey,
    hasContactEmail,
    hasContactFromEmail,
    contactEmail,
    contactFromEmail,
  });
}
