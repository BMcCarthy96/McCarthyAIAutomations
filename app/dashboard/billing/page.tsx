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
import { Receipt } from "lucide-react";

export const metadata: Metadata = {
  title: "Billing",
  description: "Billing and invoices.",
};

function statusBadgeClasses(status: string): string {
  switch (status) {
    case "paid":
      return "border border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-100/95 shadow-[0_0_24px_-14px_rgba(52,211,153,0.35)]";
    case "overdue":
      return "border border-rose-400/20 bg-rose-500/[0.09] text-rose-100/95";
    case "pending":
    default:
      return "border border-amber-400/20 bg-amber-500/[0.09] text-amber-100/90";
  }
}

export default async function DashboardBillingPage() {
  const records = await fetchBillingRecordsForClient();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Account"
        title="Billing"
        subtitle="Invoices and payment status—aligned with your account team."
      />
      <DemoHint topic="billing" />
      {records.length > 0 ? (
        <section>
          <SectionTitle
            eyebrow="Invoices"
            description="Open balances can be paid securely via Stripe when your team enables a link."
          >
            Your records
          </SectionTitle>
          <ul className="mt-5 space-y-3">
            {records.map((r) => (
              <li key={r.id}>
                <GlassCard
                  hover={false}
                  variant="premium"
                  className="overflow-hidden p-0 ring-1 ring-white/[0.06]"
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 gap-y-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                          Invoice
                        </p>
                        <p className="mt-1 text-base font-semibold leading-snug text-white sm:text-[1.0625rem]">
                          {r.description}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${statusBadgeClasses(
                          r.status
                        )}`}
                      >
                        {billingStatusLabels[r.status] ?? r.status}
                      </span>
                    </div>

                    <div className="mt-3 border-t border-white/[0.06] pt-3">
                      <p className="text-3xl font-bold leading-none tracking-tight tabular-nums text-white sm:text-4xl">
                        <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                          ${r.amount.toLocaleString()}
                        </span>
                      </p>
                      <p className="mt-2 text-sm text-zinc-500">
                        {r.status === "paid" ? (
                          r.paidAt ? (
                            <>
                              Paid{" "}
                              <span className="font-medium text-zinc-400">
                                {formatDisplayDate(r.paidAt)}
                              </span>
                            </>
                          ) : (
                            <span className="text-zinc-400">Recorded as paid</span>
                          )
                        ) : (
                          <>
                            Due{" "}
                            <span className="font-medium text-zinc-400">
                              {formatDisplayDate(r.dueDate)}
                            </span>
                          </>
                        )}
                      </p>
                    </div>

                    {r.status === "pending" && r.stripePaymentLinkUrl ? (
                      <div className="mt-4 flex justify-end border-t border-white/[0.05] pt-3 sm:justify-start">
                        <Button
                          href={r.stripePaymentLinkUrl}
                          size="sm"
                          className="min-w-[7.5rem] shadow-md shadow-indigo-500/20"
                        >
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
          description="Invoices will appear here when they’re issued. For billing questions, contact your project manager or use the contact form."
        />
      )}
    </div>
  );
}
