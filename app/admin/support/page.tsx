import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllSupportRequests,
  type SupportRequestListView,
} from "@/lib/admin-data";
import { formatDisplayDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Support | Admin",
  description: "View all support requests.",
};

const VIEWS: { value: SupportRequestListView; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
  { value: "all", label: "All" },
];

function isValidView(v: string | undefined): v is SupportRequestListView {
  return v === "active" || v === "resolved" || v === "closed" || v === "all";
}

export default async function AdminSupportPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view: viewParam } = await searchParams;
  const view: SupportRequestListView = isValidView(viewParam)
    ? viewParam
    : "active";
  const requests = await getAllSupportRequests(view);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Support requests
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {requests.length} request{requests.length !== 1 ? "s" : ""}
          {view !== "all" && ` (${view})`}
        </p>
      </div>
      <div className="flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
        {VIEWS.map((v) => (
          <Link
            key={v.value}
            href={`/admin/support?view=${v.value}`}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              view === v.value
                ? "bg-white/10 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {v.label}
          </Link>
        ))}
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
