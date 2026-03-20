/**
 * Monthly impact report email — reuses renderEmailTemplate (project update / consultation styling).
 */

import { Resend } from "resend";
import { renderEmailTemplate } from "@/lib/email/template";
import type { AutomationMetric } from "@/lib/portal-metrics";
import {
  getAutomationImpactInsights,
  metricsHaveReportableActivity,
} from "@/lib/portal-metrics-insights";

export type MonthlyImpactReportClient = {
  id: string;
  name: string;
  email: string;
};

export type SendMonthlyImpactReportResult =
  | { ok: true }
  | {
      ok: false;
      reason: "no_reportable_metrics" | "missing_resend" | "send_failed";
      detail?: string;
    };

function getAppBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "")
  );
}

const REPORT_HEADLINE = "Your Automation Performance – Last 30 Days";

/**
 * Sends a branded HTML monthly impact email. Skips when there is nothing
 * meaningful to report (empty metrics or all-zero activity).
 */
export async function sendMonthlyImpactReportEmail(
  client: MonthlyImpactReportClient,
  metrics: AutomationMetric[]
): Promise<SendMonthlyImpactReportResult> {
  if (!metrics.length || !metricsHaveReportableActivity(metrics)) {
    return { ok: false, reason: "no_reportable_metrics" };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail =
    (process.env.CONTACT_FROM_EMAIL ?? "").trim() || "onboarding@resend.dev";

  if (!apiKey) {
    return { ok: false, reason: "missing_resend" };
  }

  const hoursSaved = metrics.find((m) => m.id === "hours")?.value ?? "0";
  const estimatedRevenue = metrics.find((m) => m.id === "revenue")?.value ?? "$0";
  const insights = getAutomationImpactInsights(metrics);

  const lines: string[] = [];
  if (client.name?.trim()) {
    lines.push(`Hi ${client.name.trim()},`);
    lines.push("");
  }
  lines.push("Here's your monthly automation impact summary.");
  lines.push("");
  lines.push(
    `Your automation saved you ${hoursSaved} hours and influenced ${estimatedRevenue} in the last 30 days.`
  );
  lines.push("");
  if (insights.length > 0) {
    lines.push("Highlights:");
    for (const insight of insights) {
      lines.push(`• ${insight}`);
    }
  }

  const content = lines.join("\n");
  const baseUrl = getAppBaseUrl();
  const dashboardUrl = baseUrl ? `${baseUrl}/dashboard` : "";

  const html = renderEmailTemplate({
    title: REPORT_HEADLINE,
    content,
    actionText: dashboardUrl ? "View dashboard" : undefined,
    actionUrl: dashboardUrl || undefined,
    footerText:
      "You’re receiving this because you’re a client of McCarthy AI Automations. This summary reflects the same metrics as your client portal.",
  });

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: client.email.trim(),
      subject: "Your automation performance – last 30 days",
      html,
    });

    if (error) {
      return {
        ok: false,
        reason: "send_failed",
        detail: error.message,
      };
    }
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      reason: "send_failed",
      detail: e instanceof Error ? e.message : String(e),
    };
  }
}
