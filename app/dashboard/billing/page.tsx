import type { Metadata } from "next";
import { billingStatusLabels } from "@/lib/data";
import { fetchBillingRecordsForClient } from "@/lib/portal-data";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { formatDisplayDate } from "@/lib/utils";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { GlassCard } from "@/components/ui/GlassCard";
import { Receipt } from "lucide-react";

export const metadata: Metadata = {
  title: "Billing",
  description: "Billing and invoices.",
};

export default async function DashboardBillingPage() {
  const records = await fetchBillingRecordsForClient();
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
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-white">{r.description}</p>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-zinc-400">
                      {billingStatusLabels[r.status] ?? r.status}
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    ${r.amount.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Due {formatDisplayDate(r.dueDate)}
                    {r.paidAt && ` · Paid ${formatDisplayDate(r.paidAt)}`}
                  </p>
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
