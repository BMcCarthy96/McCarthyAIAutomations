"use client";

import Link from "next/link";
import { useState } from "react";
import type { AdminProjectRow } from "@/lib/admin-data";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { AD, adminProjectStatusClass } from "@/components/admin/admin-ui";

const FILTERS = [
  { value: "all" as const, label: "All" },
  { value: "active" as const, label: "Active" },
  { value: "in_progress" as const, label: "In progress" },
  { value: "pending" as const, label: "Pending" },
  { value: "completed" as const, label: "Completed" },
  { value: "archived" as const, label: "Archived" },
];

export function AdminProjectsList({ projects }: { projects: AdminProjectRow[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("all");

  const filtered =
    filter === "archived"
      ? projects.filter((p) => p.isArchived)
      : projects.filter(
          (p) =>
            !p.isArchived && (filter === "all" || p.status === filter)
        );

  return (
    <>
      <div className={cn(AD.filterWrap, "mb-4")}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={filter === f.value ? AD.filterOn : AD.filterOff}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className={AD.tableOuter}>
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className={AD.theadRow}>
              <th className={AD.th}>Name</th>
              <th className={AD.th}>Client</th>
              <th className={AD.th}>Status</th>
              <th className={AD.th}>Progress</th>
              <th className={AD.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className={AD.tbodyTr}>
                <td className={`${AD.td} font-medium text-white`}>{p.name}</td>
                <td className={`${AD.td} text-zinc-300`}>{p.clientName}</td>
                <td className={AD.td}>
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide",
                      adminProjectStatusClass(p.status)
                    )}
                  >
                    {p.status.replace(/_/g, " ")}
                  </span>
                </td>
                <td className={`${AD.td} tabular-nums text-zinc-400`}>
                  {p.progress}%
                </td>
                <td className={AD.td}>
                  <Link
                    href={`/admin/projects/${p.id}/edit`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <p className="mt-4 text-sm text-zinc-500">
          {filter === "all"
            ? "No projects yet."
            : filter === "archived"
              ? "No archived projects."
              : `No ${filter.replace(/_/g, " ")} projects.`}
        </p>
      )}
    </>
  );
}
