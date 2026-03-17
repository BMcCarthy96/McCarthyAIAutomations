"use client";

import Link from "next/link";
import { useState } from "react";
import type { AdminProjectRow } from "@/lib/admin-data";
import { Pencil } from "lucide-react";

const FILTERS = [
  { value: "all" as const, label: "All" },
  { value: "active" as const, label: "Active" },
  { value: "in_progress" as const, label: "In progress" },
  { value: "pending" as const, label: "Pending" },
  { value: "completed" as const, label: "Completed" },
  { value: "archived" as const, label: "Archived" },
];

export function AdminProjectsList({ projects }: { projects: AdminProjectRow[] }) {
  const [filter, setFilter] = useState<typeof FILTERS[number]["value"]>("all");

  const filtered =
    filter === "archived"
      ? projects.filter((p) => p.isArchived)
      : projects.filter((p) => !p.isArchived && (filter === "all" || p.status === filter));

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={
              filter === f.value
                ? "rounded-lg border border-indigo-500/50 bg-indigo-500/20 px-3 py-1.5 text-sm font-medium text-white"
                : "rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
            }
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-3 font-medium text-zinc-400">Name</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Client</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Status</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Progress</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                className="border-b border-white/5 last:border-0"
              >
                <td className="px-4 py-3 font-medium text-white">{p.name}</td>
                <td className="px-4 py-3 text-zinc-300">{p.clientName}</td>
                <td className="px-4 py-3 text-zinc-400">{p.status}</td>
                <td className="px-4 py-3 text-zinc-400">{p.progress}%</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/projects/${p.id}/edit`}
                    className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
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
              : `No ${filter.replace("_", " ")} projects.`}
        </p>
      )}
    </>
  );
}
