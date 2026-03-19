import type { Metadata } from "next";
import { getAllBillingRecords } from "@/lib/admin-data";
import { BillingRecordStatusForm } from "@/components/admin/BillingRecordStatusForm";
import { BillingPaymentLinkForm } from "@/components/admin/BillingPaymentLinkForm";
import { billingStatusLabels } from "@/lib/data";
import { formatDisplayDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Billing | Admin",
  description: "View all billing records.",
};

export default async function AdminBillingPage() {
  const records = await getAllBillingRecords();

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Billing records
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {records.length} record{records.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-3 font-medium text-zinc-400">Description</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Client</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Amount</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Status</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Due</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Paid</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Payment Link</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr
                key={r.id}
                className="border-b border-white/5 last:border-0"
              >
                <td className="px-4 py-3 font-medium text-white">
                  {r.description}
                </td>
                <td className="px-4 py-3 text-zinc-300">{r.clientName}</td>
                <td className="px-4 py-3 text-zinc-400">
                  {(r.amountCents / 100).toLocaleString()}{" "}
                  {r.currency ?? "USD"}
                </td>
                <td className="px-4 py-3 text-zinc-400">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(
                      r.status
                    )}`}
                  >
                    {(billingStatusLabels as Record<string, string>)[r.status] ??
                      r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-500">
                  {formatDisplayDate(r.dueDate)}
                </td>
                <td className="px-4 py-3 text-zinc-500">
                  {r.paidAt ? formatDisplayDate(r.paidAt) : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      r.stripePaymentLinkUrl
                        ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30"
                        : "bg-white/10 text-zinc-400 ring-1 ring-white/10"
                    }`}
                  >
                    {r.stripePaymentLinkUrl ? "Ready" : "Missing"}
                  </span>
                </td>
                <td className="px-4 py-3">
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
