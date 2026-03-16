import { getSupabaseServiceClient } from "@/lib/supabase";
import { getCurrentClientId } from "@/lib/portal-data";

export interface AutomationMetric {
  id: string;
  label: string;
  value: string;
  helper?: string;
}

/**
 * Lightweight, derived automation metrics for the client dashboard.
 * Uses existing tables (support_requests, billing_records) and simple heuristics.
 * No schema changes required; can be replaced or extended later.
 */
export async function getClientAutomationMetrics(): Promise<AutomationMetric[]> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  const clientId = await getCurrentClientId();
  if (!clientId) return [];

  try {
    const [{ data: support }, { data: billing }] = await Promise.all([
      supabase
        .from("support_requests")
        .select("id")
        .eq("client_id", clientId),
      supabase
        .from("billing_records")
        .select("amount_cents, status")
        .eq("client_id", clientId),
    ]);

    const callsHandled = (support ?? []).length;

    const leadsCaptured = Math.max(Math.round(callsHandled * 0.3), 0);
    const appointmentsBooked = Math.max(Math.round(callsHandled * 0.15), 0);

    const hoursSaved = Math.max(Math.round(callsHandled * 3 * 0.0167), 0);

    const totalRevenueCents = (billing ?? [])
      .filter((b) => b.status === "paid" || b.status === "pending")
      .reduce((sum, b) => sum + (b.amount_cents ?? 0), 0);
    const estimatedInfluenceCents = Math.round(totalRevenueCents * 0.4);
    const estimatedInfluence = estimatedInfluenceCents / 100;

    const metrics: AutomationMetric[] = [
      {
        id: "calls",
        label: "Calls handled",
        value: callsHandled.toLocaleString(),
        helper: "Support requests handled through automations.",
      },
      {
        id: "leads",
        label: "Leads captured",
        value: leadsCaptured.toLocaleString(),
        helper: "Estimated from support volume (placeholder).",
      },
      {
        id: "appointments",
        label: "Appointments booked",
        value: appointmentsBooked.toLocaleString(),
        helper: "Estimated from support volume (placeholder).",
      },
      {
        id: "hours",
        label: "Hours saved",
        value: hoursSaved.toLocaleString(),
        helper: "Approx. 3 minutes saved per handled request.",
      },
      {
        id: "revenue",
        label: "Est. revenue influenced",
        value:
          estimatedInfluence > 0
            ? `$${estimatedInfluence.toLocaleString()}`
            : "$0",
        helper: "40% of billed + pending as a rough starting point.",
      },
    ];

    return metrics;
  } catch {
    return [];
  }
}

