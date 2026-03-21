/**
 * Booking / scheduling URL for lead follow-up emails and future automations.
 * NEXT_PUBLIC_* is available on client; BOOKING_URL is server-only (either works on server).
 */

function normalizeBookingUrl(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  try {
    return new URL(t).href;
  } catch {
    try {
      return new URL(`https://${t}`).href;
    } catch {
      return null;
    }
  }
}

export function getBookingUrl(): string | null {
  const a = process.env.NEXT_PUBLIC_BOOKING_URL?.trim();
  const b = process.env.BOOKING_URL?.trim();
  return normalizeBookingUrl(a || b || "");
}
