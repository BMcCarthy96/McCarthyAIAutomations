import { getSupabaseServiceClient } from "@/lib/supabase";
import { getClientAutomationMetrics } from "@/lib/portal-metrics";
import { sendMonthlyImpactReportEmail } from "@/lib/email/monthly-impact-report-email";

export type MonthlyImpactReportRunSummary = {
  sent: number;
  skipped_disabled: number;
  skipped_no_activity: number;
  skipped_no_email: number;
  failed: number;
};

/**
 * Shared monthly report sending loop used by both:
 * - manual admin trigger
 * - protected cron endpoint
 */
export async function runMonthlyImpactReportEmails(): Promise<MonthlyImpactReportRunSummary> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    throw new Error("Database unavailable.");
  }
  if (!process.env.RESEND_API_KEY?.trim()) {
    throw new Error("RESEND_API_KEY is not set.");
  }

  const { data: rows, error } = await supabase
    .from("clients")
    .select("id, name, email, monthly_report_enabled")
    .eq("is_archived", false)
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  let sent = 0;
  let skippedDisabled = 0;
  let skippedNoActivity = 0;
  let skippedNoEmail = 0;
  let failed = 0;

  for (const row of rows ?? []) {
    const id = typeof row.id === "string" ? row.id : "";
    const email = typeof row.email === "string" ? row.email.trim() : "";
    const name = typeof row.name === "string" ? row.name : "";
    const monthlyReportEnabled = row.monthly_report_enabled !== false;

    if (!monthlyReportEnabled) {
      skippedDisabled++;
      continue;
    }

    if (!id || !email) {
      skippedNoEmail++;
      continue;
    }

    const metrics = await getClientAutomationMetrics(id);
    const result = await sendMonthlyImpactReportEmail({ id, name, email }, metrics);

    if (result.ok) {
      sent++;
      continue;
    }
    if (result.reason === "no_reportable_metrics") {
      skippedNoActivity++;
      continue;
    }
    if (result.reason === "missing_resend") {
      throw new Error("RESEND_API_KEY is not set.");
    }

    failed++;
    console.warn("[runMonthlyImpactReportEmails] send_failed:", result.detail);
  }

  return {
    sent,
    skipped_no_activity: skippedNoActivity,
    skipped_disabled: skippedDisabled,
    skipped_no_email: skippedNoEmail,
    failed,
  };
}
