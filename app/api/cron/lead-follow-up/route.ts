import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getBookingUrl } from "@/lib/booking-url";
import { processPendingLeadFollowUps } from "@/lib/lead-follow-up";

/**
 * Protected batch trigger for lead follow-up emails (Vercel Cron, external scheduler, or webhook).
 * POST with Authorization: Bearer LEAD_FOLLOW_UP_CRON_SECRET
 *
 * Same processing as admin "Send pending follow-ups" — add scheduler when ready.
 */
export async function POST(request: Request) {
  const secret = process.env.LEAD_FOLLOW_UP_CRON_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "LEAD_FOLLOW_UP_CRON_SECRET is not configured" },
      { status: 503 }
    );
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
