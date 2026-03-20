import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllMilestones,
  type AdminMilestoneListView,
} from "@/lib/admin-data";
import { formatDisplayDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Milestones | Admin",
  description: "View all milestones across all clients.",
};

const VIEWS: { value: AdminMilestoneListView; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "overdue", label: "Overdue" },
  { value: "completed", label: "Completed" },
];

function isValidView(v: string | undefined): v is AdminMilestoneListView {
  return v === "upcoming" || v === "overdue" || v === "completed";
}

function statusLabelFor(row: { completedAt: string | null; dueDate: string }): "Completed" | "Overdue" | "Upcoming" {
  if (row.completedAt) return "Completed";
  const today = new Date().toISOString().slice(0, 10);
  return row.dueDate < today ? "Overdue" : "Upcoming";
}

export default async function AdminMilestonesPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view: rawView } = await searchParams;
  const view: AdminMilestoneListView = isValidView(rawView)
    ? rawView
    : "upcoming";

  const milestones = await getAllMilestones(view);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Milestones
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {milestones.length} milestone{milestones.length !== 1 ? "s" : ""} ({view})
        </p>
      </div>

      <div className="flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
        {VIEWS.map((v) => (
          <Link
            key={v.value}
            href={`/admin/milestones?view=${v.value}`}
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
              <th className="px-4 py-3 font-medium text-zinc-400">Title</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Client</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Project</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Due date</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {milestones.map((m) => {
              const status = statusLabelFor(m);
              const statusClass =
                status === "Completed"
                  ? "bg-emerald-500/20 text-emerald-200"
                  : status === "Overdue"
                    ? "bg-rose-500/20 text-rose-200"
                    : "bg-indigo-500/20 text-indigo-200";
              return (
                <tr key={m.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-white">{m.title}</td>
                  <td className="px-4 py-3 text-zinc-300">{m.clientName}</td>
                  <td className="px-4 py-3 text-zinc-300">{m.projectName}</td>
                  <td className="px-4 py-3 text-zinc-400">
                    {formatDisplayDate(m.dueDate)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusClass}`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {milestones.length === 0 && (
        <p className="text-sm text-zinc-500">No milestones in this view.</p>
      )}
    </div>
  );
}

