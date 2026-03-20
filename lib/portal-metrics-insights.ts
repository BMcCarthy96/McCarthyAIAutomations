import type { AutomationMetric } from "@/lib/portal-metrics";

/**
 * Parse displayed metric values back to numbers for client-side insight copy.
 * Values come from toLocaleString() / "$1,234" formatting in portal-metrics.
 */
function metricNumberById(
  metrics: AutomationMetric[],
  id: string
): number {
  const m = metrics.find((x) => x.id === id);
  if (!m?.value) return 0;
  const raw = m.value.trim();
  if (id === "revenue") {
    const n = Number.parseFloat(raw.replace(/[$,\s]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  const n = Number.parseInt(raw.replace(/[,_\s]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * 2–3 human-readable insight lines for the dashboard impact report.
 * Returns an empty array if there is nothing meaningful to say (all zeros / invalid).
 */
export function getAutomationImpactInsights(
  metrics: AutomationMetric[]
): string[] {
  if (!metrics.length) return [];

  const hours = metricNumberById(metrics, "hours");
  const leads = metricNumberById(metrics, "leads");
  const calls = metricNumberById(metrics, "calls");
  const appointments = metricNumberById(metrics, "appointments");
  const revenue = metricNumberById(metrics, "revenue");

  const insights: string[] = [];

  if (hours > 0) {
    const workdays = round1(hours / 8);
    const workdayPhrase =
      workdays === 1
        ? "about 1 full workday"
        : `about ${workdays} full workdays`;
    insights.push(
      `You saved approximately ${hours.toLocaleString()} hours in the last 30 days (${workdayPhrase} at 8 hours each).`
    );
  }

  if (leads > 0) {
    const perWeek = round1(leads / 4.35);
    insights.push(
      `Your automation captured roughly ${leads.toLocaleString()} leads — about ${perWeek} per week on average over the month.`
    );
  } else if (calls > 0) {
    const perWeek = round1(calls / 4.35);
    insights.push(
      `Your automation handled roughly ${calls.toLocaleString()} interactions — about ${perWeek} per week — keeping volume off your team’s plate.`
    );
  }

  if (insights.length < 3 && hours >= 16) {
    const hrsPerWeek = round1(hours / 4.35);
    insights.push(
      `That’s around ${hrsPerWeek} hours each week you didn’t spend on manual work — similar to a part-time assistant on repeatable tasks.`
    );
  }

  if (insights.length < 3 && revenue > 0) {
    insights.push(
      `Estimated revenue influenced this period is about $${revenue.toLocaleString()} — a snapshot of automation impact on your business.`
    );
  }

  if (insights.length < 3 && appointments > 0 && leads === 0) {
    insights.push(
      `Roughly ${appointments.toLocaleString()} appointments were booked through your automations — fewer scheduling back-and-forths for your team.`
    );
  }

  return insights.slice(0, 3);
}
