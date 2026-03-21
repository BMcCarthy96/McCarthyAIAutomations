import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { getAllBillingRecords, getAllClients } from "@/lib/admin-data";
import { BillingRecordEditForm } from "@/components/admin/BillingRecordEditForm";
import { CreateBillingRecordForm } from "@/components/admin/CreateBillingRecordForm";
import { BillingPaymentLinkForm } from "@/components/admin/BillingPaymentLinkForm";
import { BillingRecordDeleteForm } from "@/components/admin/BillingRecordDeleteForm";
import { formatDisplayDate } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AdminSection, AdminCard } from "@/components/admin/AdminSection";
import { AD } from "@/components/admin/admin-ui";

export const metadata: Metadata = {
  title: "Billing | Admin",
  description: "View all billing records.",
};

/** Always read fresh rows after create/edit (avoid stale RSC cache). */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminBillingPage() {
  noStore();
  const [records, clients] = await Promise.all([getAllBillingRecords(), getAllClients()]);

  const clientOptions = clients.map((c) => ({
    id: c.id,
    name: c.name,
    isArchived: Boolean(c.isArchived),
  }));

  return (
    <div className={AD.pageStack}>
      <PageHeader
        eyebrow="Revenue"
        title="Billing records"
        subtitle={`${records.length} record${records.length !== 1 ? "s" : ""} — manual invoices, Stripe links, and client actions.`}
      />

      <AdminSection
        eyebrow="Manual"
        title="New billing record"
        description="Issue custom invoices, setup fees, or adjustments. Enter amounts in dollars; due date defaults to 30 days out."
      >
        <div className="max-w-2xl">
          <AdminCard>
            <CreateBillingRecordForm
              key={`new-billing-${records.length}`}
              clients={clientOptions}
            />
          </AdminCard>
        </div>
      </AdminSection>

      <AdminSection
        eyebrow="Ledger"
        title="All records"
        description="Editing amount or description clears any existing Stripe link so checkout always matches the invoice."
      >
      <div className={AD.tableOuter}>
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className={AD.theadRow}>
              <th className={AD.th}>Client</th>
              <th className={AD.th}>Amount, description &amp; status</th>
              <th className={AD.th}>Due</th>
              <th className={AD.th}>Paid</th>
              <th className={AD.th}>Payment link</th>
              <th className={AD.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className={AD.tbodyTr}>
                <td className={`${AD.td} text-zinc-300`}>{r.clientName}</td>
                <td className={AD.td}>
                  <BillingRecordEditForm
                    key={`edit-${r.id}-${r.updatedAt ?? ""}-${r.stripePaymentLinkUrl ? "1" : "0"}-${r.amountCents}`}
                    recordId={r.id}
                    amountCents={r.amountCents}
                    description={r.description}
                    currentStatus={r.status}
                  />
                </td>
                <td className={`${AD.td} text-zinc-500`}>
                  {formatDisplayDate(r.dueDate)}
                </td>
                <td className={`${AD.td} text-zinc-500`}>
                  {r.paidAt ? formatDisplayDate(r.paidAt) : "—"}
                </td>
                <td className={AD.td}>
                  <span
                    className={
                      r.stripePaymentLinkUrl
                        ? "inline-flex rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-100"
                        : r.status === "pending"
                          ? "inline-flex rounded-full border border-amber-400/28 bg-amber-500/12 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-100"
                          : "inline-flex rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-zinc-400"
                    }
                  >
                    {r.stripePaymentLinkUrl
                      ? "Ready"
                      : r.status === "pending"
                        ? "Needs link"
                        : "None"}
                  </span>
                </td>
                <td className={AD.td}>
                  <div className="flex flex-col gap-3">
                    <BillingPaymentLinkForm
                      key={`pay-${r.id}-${r.updatedAt ?? ""}-${r.stripePaymentLinkUrl ? "1" : "0"}`}
                      recordId={r.id}
                      billingStatus={r.status}
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
      </AdminSection>
    </div>
  );
}
