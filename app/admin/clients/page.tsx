import type { Metadata } from "next";
import Link from "next/link";
import { getAllClients } from "@/lib/admin-data";
import { CreateClientForm } from "@/components/admin/CreateClientForm";
import { ClientClerkLinkCell } from "@/components/admin/ClientClerkLinkCell";
import { formatDisplayDate } from "@/lib/utils";
import { CreateStripeCustomerButton } from "@/components/admin/CreateStripeCustomerButton";
import { ClientArchiveActions } from "@/components/admin/ClientArchiveActions";
import { RunMonthlyImpactReportEmailsForm } from "@/components/admin/RunMonthlyImpactReportEmailsForm";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AdminSection, AdminCard } from "@/components/admin/AdminSection";
import { AD } from "@/components/admin/admin-ui";
import { Pencil } from "lucide-react";

export const metadata: Metadata = {
  title: "Clients | Admin",
  description: "View all clients.",
};

export default async function AdminClientsPage() {
  const clients = await getAllClients();

  return (
    <div className={AD.pageStack}>
      <PageHeader
        eyebrow="Directory"
        title="Clients"
        subtitle={`${clients.length} client${clients.length !== 1 ? "s" : ""} — portal accounts, billing, and delivery.`}
      />

      <AdminSection
        eyebrow="Email"
        title="Monthly impact reports"
        description="Send the rolling 30-day performance email to every client with a linked account."
      >
        <AdminCard>
          <RunMonthlyImpactReportEmailsForm />
        </AdminCard>
      </AdminSection>

      <AdminSection
        eyebrow="Create"
        title="New client"
        description="Add a client record. Optionally set Clerk user ID to link portal sign-in."
      >
        <div className="max-w-xl">
          <AdminCard>
            <CreateClientForm />
          </AdminCard>
        </div>
      </AdminSection>

      <AdminSection
        eyebrow="Directory"
        title="All clients"
        description="Archive, Stripe, link, and edit—actions stay on the row for fast scanning."
      >
        <div className={AD.tableOuter}>
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className={AD.theadRow}>
                <th className={AD.th}>Name</th>
                <th className={AD.th}>Status</th>
                <th className={AD.th}>Email</th>
                <th className={AD.th}>Company</th>
                <th className={AD.th}>Clerk linked</th>
                <th className={AD.th}>Created</th>
                <th className={AD.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className={AD.tbodyTr}>
                  <td className={`${AD.td} font-medium text-white`}>{c.name}</td>
                  <td className={AD.td}>
                    {c.isArchived ? (
                      <span className="inline-flex rounded-full border border-zinc-500/30 bg-zinc-500/12 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-zinc-300">
                        Archived
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-200/90">
                        Active
                      </span>
                    )}
                  </td>
                  <td className={`${AD.td} text-zinc-300`}>{c.email}</td>
                  <td className={`${AD.td} text-zinc-400`}>{c.company ?? "—"}</td>
                  <ClientClerkLinkCell
                    clientId={c.id}
                    currentClerkUserId={c.clerkUserId}
                  />
                  <td className={`${AD.td} text-zinc-500`}>
                    {c.createdAt ? formatDisplayDate(c.createdAt) : "—"}
                  </td>
                  <td className={AD.td}>
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <ClientArchiveActions
                        clientId={c.id}
                        isArchived={c.isArchived ?? false}
                      />
                      {!c.stripeCustomerId && (
                        <CreateStripeCustomerButton clientId={c.id} />
                      )}
                      <Link
                        href={`/admin/clients/${c.id}/link`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                      >
                        Link
                      </Link>
                      <Link
                        href={`/admin/clients/${c.id}/edit`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Link>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {clients.length === 0 && (
          <p className="mt-4 text-sm text-zinc-500">No clients yet.</p>
        )}
      </AdminSection>
    </div>
  );
}
