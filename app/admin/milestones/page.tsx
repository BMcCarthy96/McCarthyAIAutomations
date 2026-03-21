import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllMilestones,
  type AdminMilestoneListView,
} from "@/lib/admin-data";
import { formatDisplayDate } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AD } from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";

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

function statusLabelFor(row: {
  completedAt: string | null;
  dueDate: string;
}): "Completed" | "Overdue" | "Upcoming" {
  if (row.completedAt) return "Completed";
  const today = new Date().toISOString().slice(0, 10);
  return row.dueDate < today ? "Overdue" : "Upcoming";
}

function statusPillClass(
  status: "Completed" | "Overdue" | "Upcoming"
): string {
  switch (status) {
    case "Completed":
      return "border border-emerald-400/25 bg-emerald-500/12 text-emerald-100";
    case "Overdue":
      return "border border-rose-400/22 bg-rose-500/12 text-rose-100";
    default:
      return "border border-indigo-400/22 bg-indigo-500/12 text-indigo-100";
  }
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
    <div className={AD.pageStack}>
      <PageHeader
        eyebrow="Delivery"
        title="Milestones"
        subtitle={`${milestones.length} milestone${milestones.length !== 1 ? "s" : ""} — ${view} view. Cross-client rollout checkpoints.`}
      />

      <div className={AD.filterWrap}>
        {VIEWS.map((v) => (
          <Link
            key={v.value}
            href={`/admin/milestones?view=${v.value}`}
            className={view === v.value ? AD.filterOn : AD.filterOff}
          >
            {v.label}
          </Link>
        ))}
      </div>

      <div className={AD.tableOuter}>
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className={AD.theadRow}>
              <th className={AD.th}>Title</th>
              <th className={AD.th}>Client</th>
              <th className={AD.th}>Project</th>
              <th className={AD.th}>Due date</th>
              <th className={AD.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {milestones.map((m) => {
              const status = statusLabelFor(m);
              return (
                <tr key={m.id} className={AD.tbodyTr}>
                  <td className={`${AD.td} font-medium text-white`}>
                    {m.title}
                  </td>
                  <td className={`${AD.td} text-zinc-300`}>{m.clientName}</td>
                  <td className={`${AD.td} text-zinc-300`}>{m.projectName}</td>
                  <td className={`${AD.td} text-zinc-400`}>
                    {formatDisplayDate(m.dueDate)}
                  </td>
                  <td className={AD.td}>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide",
                        statusPillClass(status)
                      )}
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
