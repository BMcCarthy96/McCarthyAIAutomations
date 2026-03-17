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
    // Prefer explicit project_metrics if present
    const { data: explicit } = await supabase
      .from("project_metrics")
      .select(
        "calls_handled, leads_captured, appointments_booked, hours_saved, estimated_revenue, projects!inner(client_services!inner(client_id))"
      )
      .eq("projects.client_services.client_id", clientId)
      .eq("projects.is_archived", false);

    if (explicit && explicit.length > 0) {
      const totals = explicit.reduce(
        (acc, row: any) => {
          acc.calls += row.calls_handled ?? 0;
          acc.leads += row.leads_captured ?? 0;
          acc.appointments += row.appointments_booked ?? 0;
          acc.hours += row.hours_saved ?? 0;
          acc.revenue += row.estimated_revenue ?? 0;
          return acc;
        },
        { calls: 0, leads: 0, appointments: 0, hours: 0, revenue: 0 }
      );

      const metrics: AutomationMetric[] = [
        {
          id: "calls",
          label: "Calls handled",
          value: totals.calls.toLocaleString(),
          helper: "Support interactions handled by automations.",
        },
        {
          id: "leads",
          label: "Leads captured",
          value: totals.leads.toLocaleString(),
          helper: "Leads attributed to your automations.",
        },
        {
          id: "appointments",
          label: "Appointments booked",
          value: totals.appointments.toLocaleString(),
          helper: "Bookings generated via automations.",
        },
        {
          id: "hours",
          label: "Hours saved",
          value: totals.hours.toLocaleString(),
          helper: "Time saved versus manual handling.",
        },
        {
          id: "revenue",
          label: "Est. revenue influenced",
          value:
            totals.revenue > 0
              ? `$${totals.revenue.toLocaleString()}`
              : "$0",
          helper: "Estimated revenue influenced by automations.",
        },
      ];

      return metrics;
    }

    // Fallback: derive from existing support and billing data
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

