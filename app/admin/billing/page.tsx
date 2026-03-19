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
                  {(billingStatusLabels as Record<string, string>)[r.status] ?? r.status}
                </td>
                <td className="px-4 py-3 text-zinc-500">
                  {formatDisplayDate(r.dueDate)}
                </td>
                <td className="px-4 py-3 text-zinc-500">
                  {r.paidAt ? formatDisplayDate(r.paidAt) : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-end">
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
