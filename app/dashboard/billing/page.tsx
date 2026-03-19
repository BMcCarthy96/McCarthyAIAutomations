import type { Metadata } from "next";
import { billingStatusLabels } from "@/lib/data";
import { fetchBillingRecordsForClient } from "@/lib/portal-data";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { formatDisplayDate } from "@/lib/utils";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Receipt } from "lucide-react";

export const metadata: Metadata = {
  title: "Billing",
  description: "Billing and invoices.",
};

export default async function DashboardBillingPage() {
  const records = await fetchBillingRecordsForClient();

  function statusBadge(status: string): string {
    switch (status) {
      case "paid":
        return "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30";
      case "overdue":
        return "bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/30";
      case "pending":
      default:
        return "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/30";
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Billing"
        subtitle="Invoices and payment details."
      />
      {records.length > 0 ? (
        <section>
          <SectionTitle>Invoices</SectionTitle>
          <ul className="mt-4 space-y-4">
            {records.map((r) => (
              <li key={r.id}>
                <GlassCard hover={false}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-zinc-500">
                        Invoice
                      </p>
                      <p className="mt-1 font-medium text-white">{r.description}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(
                        r.status
                      )}`}
                    >
                      {billingStatusLabels[r.status] ?? r.status}
                    </span>
                  </div>
                  <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
                    ${r.amount.toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Due {formatDisplayDate(r.dueDate)}
                    {r.paidAt && ` · Paid ${formatDisplayDate(r.paidAt)}`}
                  </p>
                  {r.status === "paid" ? (
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/30">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Paid
                    </div>
                  ) : r.status === "pending" && r.stripePaymentLinkUrl ? (
                    <div className="mt-4">
                      <Button href={r.stripePaymentLinkUrl} size="sm">
                        Pay Now
                      </Button>
                    </div>
                  ) : null}
                </GlassCard>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <EmptyState
          icon={Receipt}
          title="No invoices yet"
          description="Invoices will appear here when they’re issued. For billing questions or to request an invoice, contact your project manager or use the contact form."
        />
      )}
    </div>
  );
}
