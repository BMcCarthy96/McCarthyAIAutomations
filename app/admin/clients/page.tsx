import type { Metadata } from "next";
import Link from "next/link";
import { getAllClients } from "@/lib/admin-data";
import { CreateClientForm } from "@/components/admin/CreateClientForm";
import { ClientClerkLinkCell } from "@/components/admin/ClientClerkLinkCell";
import { formatDisplayDate } from "@/lib/utils";
import { CreateStripeCustomerButton } from "@/components/admin/CreateStripeCustomerButton";
import { ClientArchiveActions } from "@/components/admin/ClientArchiveActions";
import { RunMonthlyImpactReportEmailsForm } from "@/components/admin/RunMonthlyImpactReportEmailsForm";
import { Pencil } from "lucide-react";

export const metadata: Metadata = {
  title: "Clients | Admin",
  description: "View all clients.",
};

export default async function AdminClientsPage() {
  const clients = await getAllClients();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Clients
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {clients.length} client{clients.length !== 1 ? "s" : ""}
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-white">Monthly impact reports</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Manually send the rolling 30-day performance email to every client.
        </p>
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-6">
          <RunMonthlyImpactReportEmailsForm />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white">New client</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Create a client record. Optionally set Clerk user ID to link portal sign-in.
        </p>
        <div className="mt-4 max-w-xl rounded-xl border border-white/10 bg-white/5 p-6">
          <CreateClientForm />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white">All clients</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-4 py-3 font-medium text-zinc-400">Name</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Status</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Email</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Company</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Clerk linked</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Created</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-white">{c.name}</td>
                  <td className="px-4 py-3">
                    {c.isArchived ? (
                      <span className="inline-flex rounded-full bg-zinc-500/15 px-2 py-0.5 text-xs font-medium text-zinc-400 ring-1 ring-zinc-500/30">
                        Archived
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-600">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{c.email}</td>
                  <td className="px-4 py-3 text-zinc-400">{c.company ?? "—"}</td>
                  <ClientClerkLinkCell
                    clientId={c.id}
                    currentClerkUserId={c.clerkUserId}
                  />
                  <td className="px-4 py-3 text-zinc-500">
                    {c.createdAt ? formatDisplayDate(c.createdAt) : "—"}
                  </td>
                  <td className="px-4 py-3">
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
                        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
                      >
                        Link
                      </Link>
                      <Link
                        href={`/admin/clients/${c.id}/edit`}
                        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
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
      </section>
    </div>
  );
}
