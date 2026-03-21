import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientById, getClientDeletionImpact } from "@/lib/admin-data";
import { EditClientForm } from "@/components/admin/EditClientForm";
import { ClientArchiveActions } from "@/components/admin/ClientArchiveActions";
import { ClientDeleteSection } from "@/components/admin/ClientDeleteSection";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Edit client | Admin",
  description: "Edit client information.",
};

export default async function AdminClientEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClientById(id);
  if (!client) notFound();

  const impact =
    (await getClientDeletionImpact(id)) ?? {
      clientServices: 0,
      projects: 0,
      billingRecords: 0,
      supportRequests: 0,
      supportReplies: 0,
    };

  return (
    <div className="space-y-6">
      <Link
        href="/admin/clients"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to clients
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Edit client
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {client.name}
        </p>
      </div>
      <div className="max-w-xl rounded-xl border border-white/10 bg-white/5 p-6">
        <EditClientForm client={client} />
      </div>

      <div className="max-w-xl space-y-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Archive</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Archived clients are hidden from the client portal and excluded from monthly impact report
            sends. You can unarchive anytime.
          </p>
          <div className="mt-4">
            <ClientArchiveActions
              clientId={client.id}
              isArchived={client.isArchived ?? false}
            />
          </div>
        </div>

        <ClientDeleteSection client={client} impact={impact} />
      </div>
    </div>
  );
}
