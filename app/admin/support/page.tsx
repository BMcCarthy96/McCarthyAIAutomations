import type { Metadata } from "next";
import Link from "next/link";
import { getAllSupportRequests } from "@/lib/admin-data";
import { formatDisplayDate } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Support | Admin",
  description: "View all support requests.",
};

export default async function AdminSupportPage() {
  const requests = await getAllSupportRequests();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Support requests
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {requests.length} request{requests.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-3 font-medium text-zinc-400">Subject</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Client</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Status</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Created</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr
                key={r.id}
                className="border-b border-white/5 last:border-0"
              >
                <td className="px-4 py-3 font-medium text-white">
                  <Link
                    href={`/admin/support/${r.id}`}
                    className="transition-colors hover:text-indigo-400"
                  >
                    {r.subject}
                  </Link>
                </td>
                <td className="px-4 py-3 text-zinc-300">{r.clientName}</td>
                <td className="px-4 py-3 text-zinc-400">{r.status}</td>
                <td className="px-4 py-3 text-zinc-500">
                  {formatDisplayDate(r.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {requests.length === 0 && (
        <p className="text-sm text-zinc-500">No support requests yet.</p>
      )}
    </div>
  );
}
