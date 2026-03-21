import type { Metadata } from "next";
import { billingStatusLabels } from "@/lib/data";
import { fetchBillingRecordsForClient } from "@/lib/portal-data";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { formatDisplayDate } from "@/lib/utils";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { DemoHint } from "@/components/dashboard/DemoHint";
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
        return "border border-emerald-400/25 bg-emerald-500/10 text-emerald-200 shadow-[0_0_20px_-10px_rgba(52,211,153,0.35)]";
      case "overdue":
        return "border border-rose-400/25 bg-rose-500/10 text-rose-200";
      case "pending":
      default:
        return "border border-amber-400/22 bg-amber-500/10 text-amber-200";
    }
  }

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="Account"
        title="Billing"
        subtitle="Invoices, payment links, and status—aligned with what your team sees in admin."
      />
      <DemoHint topic="billing" />
      {records.length > 0 ? (
        <section>
          <SectionTitle
            eyebrow="Invoices"
            description="Pay open balances via the secure Stripe link when your team sends one."
          >
            Your records
          </SectionTitle>
          <ul className="mt-8 space-y-6">
            {records.map((r) => (
              <li key={r.id}>
                <GlassCard hover={false} variant="premium" className="p-0 overflow-hidden">
                  <div className="p-7 sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                          Invoice
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">{r.description}</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                          r.status
                        )}`}
                      >
                        {billingStatusLabels[r.status] ?? r.status}
                      </span>
                    </div>
                    <p className="mt-6 text-4xl font-bold tracking-tight tabular-nums text-white sm:text-5xl">
                      <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                        ${r.amount.toLocaleString()}
                      </span>
                    </p>
                    <p className="mt-2 text-sm text-zinc-500">
                      Due {formatDisplayDate(r.dueDate)}
                      {r.paidAt && ` · Paid ${formatDisplayDate(r.paidAt)}`}
                    </p>
                    {r.status === "paid" ? (
                      <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
                        <CheckCircle2 className="h-4 w-4" />
                        Paid in full
                      </div>
                    ) : r.status === "pending" && r.stripePaymentLinkUrl ? (
                      <div className="mt-5">
                        <Button href={r.stripePaymentLinkUrl} size="md">
                          Pay now
                        </Button>
                      </div>
                    ) : null}
                  </div>
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
