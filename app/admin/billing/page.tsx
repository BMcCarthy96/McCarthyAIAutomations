import type { Metadata } from "next";
import { getAllBillingRecords } from "@/lib/admin-data";
import { BillingRecordStatusForm } from "@/components/admin/BillingRecordStatusForm";
import { BillingPaymentLinkForm } from "@/components/admin/BillingPaymentLinkForm";
import { BillingRecordDeleteForm } from "@/components/admin/BillingRecordDeleteForm";
import { billingStatusLabels } from "@/lib/data";
import { formatDisplayDate } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AD } from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Billing | Admin",
  description: "View all billing records.",
};

function statusBadgeClasses(status: string): string {
  switch (status) {
    case "paid":
      return "border border-emerald-400/25 bg-emerald-500/12 text-emerald-100";
    case "overdue":
      return "border border-rose-400/22 bg-rose-500/12 text-rose-100";
    case "pending":
    default:
      return "border border-amber-400/22 bg-amber-500/12 text-amber-100";
  }
}

export default async function AdminBillingPage() {
  const records = await getAllBillingRecords();

  return (
    <div className={AD.pageStack}>
      <PageHeader
        eyebrow="Revenue"
        title="Billing records"
        subtitle={`${records.length} record${records.length !== 1 ? "s" : ""} — status, Stripe links, and client actions.`}
      />

      <div className={AD.tableOuter}>
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead>
            <tr className={AD.theadRow}>
              <th className={AD.th}>Description</th>
              <th className={AD.th}>Client</th>
              <th className={AD.th}>Amount</th>
              <th className={AD.th}>Status</th>
              <th className={AD.th}>Due</th>
              <th className={AD.th}>Paid</th>
              <th className={AD.th}>Payment link</th>
              <th className={AD.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className={AD.tbodyTr}>
                <td className={`${AD.td} font-medium text-white`}>
                  {r.description}
                </td>
                <td className={`${AD.td} text-zinc-300`}>{r.clientName}</td>
                <td className={`${AD.td} tabular-nums text-zinc-400`}>
                  {(r.amountCents / 100).toLocaleString()}{" "}
                  {r.currency ?? "USD"}
                </td>
                <td className={AD.td}>
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide",
                      statusBadgeClasses(r.status)
                    )}
                  >
                    {(billingStatusLabels as Record<string, string>)[r.status] ??
                      r.status}
                  </span>
                </td>
                <td className={`${AD.td} text-zinc-500`}>
                  {formatDisplayDate(r.dueDate)}
                </td>
                <td className={`${AD.td} text-zinc-500`}>
                  {r.paidAt ? formatDisplayDate(r.paidAt) : "—"}
                </td>
                <td className={AD.td}>
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide",
                      r.stripePaymentLinkUrl
                        ? "border border-emerald-400/25 bg-emerald-500/10 text-emerald-100"
                        : "border border-white/10 bg-white/[0.06] text-zinc-400"
                    )}
                  >
                    {r.stripePaymentLinkUrl ? "Ready" : "Missing"}
                  </span>
                </td>
                <td className={AD.td}>
                  <div className="flex flex-col gap-3">
                    <BillingRecordStatusForm
                      recordId={r.id}
                      currentStatus={r.status}
                    />
                    <BillingPaymentLinkForm
                      recordId={r.id}
                      currentPaymentLinkUrl={
                        (r.stripePaymentLinkUrl as string | null) ?? null
                      }
                    />
                    <BillingRecordDeleteForm
                      recordId={r.id}
                      description={r.description}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {records.length === 0 && (
        <p className="text-sm text-zinc-500">No billing records yet.</p>
      )}
    </div>
  );
}
