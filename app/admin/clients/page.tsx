import type { Metadata } from "next";
import { getAllClients } from "@/lib/admin-data";
import { formatDisplayDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Clients | Admin",
  description: "View all clients.",
};

export default async function AdminClientsPage() {
  const clients = await getAllClients();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Clients
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {clients.length} client{clients.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-3 font-medium text-zinc-400">Name</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Email</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Company</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Clerk linked</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Created</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr
                key={c.id}
                className="border-b border-white/5 last:border-0"
              >
                <td className="px-4 py-3 font-medium text-white">{c.name}</td>
                <td className="px-4 py-3 text-zinc-300">{c.email}</td>
                <td className="px-4 py-3 text-zinc-400">{c.company ?? "—"}</td>
                <td className="px-4 py-3 text-zinc-400">
                  {c.clerkUserId ? "Yes" : "—"}
                </td>
                <td className="px-4 py-3 text-zinc-500">
                  {c.createdAt ? formatDisplayDate(c.createdAt) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {clients.length === 0 && (
        <p className="text-sm text-zinc-500">No clients yet.</p>
      )}
    </div>
  );
}
