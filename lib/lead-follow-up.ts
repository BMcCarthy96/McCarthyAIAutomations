/**
 * Lead follow-up batch processing for public consultation rows.
 * Safe for manual admin trigger; same helpers can be called from a cron route later.
 */

import { getSupabaseServiceClient } from "@/lib/supabase";
import { getBookingUrl } from "@/lib/booking-url";
import { sendLeadFollowUpEmail } from "@/lib/email/lead-follow-up-email";

export type PendingLeadFollowUpRow = {
  id: string;
  requesterName: string | null;
  requesterEmail: string;
};

const OPEN_STATUSES = ["open", "in_progress"] as const;

/**
 * Rows eligible for a follow-up: public consultation, marked eligible, email present,
 * still active (not resolved/closed), follow-up not yet sent.
 */
export async function fetchPendingLeadFollowUps(): Promise<PendingLeadFollowUpRow[]> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("support_requests")
    .select("id, requester_name, requester_email")
    .is("client_id", null)
    .eq("category", "public")
    .eq("lead_follow_up_eligible", true)
    .eq("lead_follow_up_suppressed", false)
    .is("follow_up_sent_at", null)
    .in("status", [...OPEN_STATUSES])
    .not("requester_email", "is", null);

  if (error || !data) {
    console.warn("[lead-follow-up] fetch pending:", error?.message);
    return [];
  }

  const out: PendingLeadFollowUpRow[] = [];
  for (const row of data as {
    id: string;
    requester_name: string | null;
    requester_email: string | null;
  }[]) {
    const email = row.requester_email?.trim();
    if (!email) continue;
    out.push({
      id: row.id,
      requesterName: row.requester_name,
      requesterEmail: email,
    });
  }
  return out;
}

export async function countPendingLeadFollowUps(): Promise<number> {
  const rows = await fetchPendingLeadFollowUps();
  return rows.length;
}

export type ProcessLeadFollowUpsResult = {
  sent: number;
  failed: number;
};

/**
 * Sends follow-up for each pending row and sets follow_up_sent_at on success.
 * Skips entirely if booking URL is not configured (caller should check getBookingUrl first).
 */
export async function processPendingLeadFollowUps(
  bookingUrl: string
): Promise<ProcessLeadFollowUpsResult> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { sent: 0, failed: 0 };
  }

  const pending = await fetchPendingLeadFollowUps();
  let sent = 0;
  let failed = 0;

  for (const row of pending) {
    const now = new Date().toISOString();
    // Claim row first so concurrent runs cannot double-send.
    const { data: claimed, error: claimError } = await supabase
      .from("support_requests")
      .update({ follow_up_sent_at: now, updated_at: now })
      .eq("id", row.id)
      .is("follow_up_sent_at", null)
      .eq("lead_follow_up_suppressed", false)
      .select("id")
      .maybeSingle();

    if (claimError) {
      console.warn("[lead-follow-up] claim failed:", claimError.message);
      failed += 1;
      continue;
    }
    if (!claimed) {
      // Another worker claimed this row in parallel — skip without counting as failure.
      continue;
    }

    const ok = await sendLeadFollowUpEmail({
      requesterName: row.requesterName ?? "there",
      requesterEmail: row.requesterEmail,
      bookingUrl,
    });

    if (!ok) {
      await supabase
        .from("support_requests")
        .update({
          follow_up_sent_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id);
      failed += 1;
      continue;
    }

    sent += 1;
  }

  return { sent, failed };
}
