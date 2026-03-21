import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getBookingUrl } from "@/lib/booking-url";
import { processPendingLeadFollowUps } from "@/lib/lead-follow-up";

/**
 * Protected batch trigger for lead follow-up emails (Vercel Cron, external scheduler, or webhook).
 * Vercel Cron invokes **GET**; manual tools may use POST.
 * Authorization: Bearer <LEAD_FOLLOW_UP_CRON_SECRET> or Bearer <CRON_SECRET> (Vercel auto-sends CRON_SECRET).
 *
 * Set LEAD_FOLLOW_UP_CRON_ENABLED=true to allow sending; otherwise returns ok + skipped (admin manual send unchanged).
 */
function isLeadFollowUpCronEnabled(): boolean {
  return process.env.LEAD_FOLLOW_UP_CRON_ENABLED?.trim() === "true";
}

function getCronBearerSecrets(): string[] {
  const a = process.env.LEAD_FOLLOW_UP_CRON_SECRET?.trim();
  const b = process.env.CRON_SECRET?.trim();
  return [a, b].filter((s): s is string => Boolean(s));
}

function isAuthorizedCron(request: Request): boolean {
  const secrets = getCronBearerSecrets();
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  const token = auth.slice("Bearer ".length).trim();
  return secrets.some((s) => s === token);
}

async function handleLeadFollowUpCron(request: Request) {
  const secrets = getCronBearerSecrets();
  if (secrets.length === 0) {
    return NextResponse.json(
      {
        error:
          "LEAD_FOLLOW_UP_CRON_SECRET or CRON_SECRET must be configured",
      },
      { status: 503 }
    );
  }

  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isLeadFollowUpCronEnabled()) {
    return NextResponse.json({ ok: true, skipped: "disabled" });
  }

  const bookingUrl = getBookingUrl();
  if (!bookingUrl) {
    return NextResponse.json(
      {
        error:
          "NEXT_PUBLIC_BOOKING_URL or BOOKING_URL is not set or invalid",
      },
      { status: 400 }
    );
  }

  try {
    const result = await processPendingLeadFollowUps(bookingUrl);
    revalidatePath("/admin/support");
    return NextResponse.json({
      ok: true,
      sent: result.sent,
      failed: result.failed,
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : "Lead follow-up batch failed",
      },
      { status: 500 }
    );
  }
}

/** Vercel Cron invokes GET. */
export async function GET(request: Request) {
  return handleLeadFollowUpCron(request);
}

export async function POST(request: Request) {
  return handleLeadFollowUpCron(request);
}
