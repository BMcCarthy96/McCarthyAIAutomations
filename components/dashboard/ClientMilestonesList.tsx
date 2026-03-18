"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ClientMilestoneItem } from "@/lib/portal-data";
import { formatDisplayDate, getTodayDateString } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { Calendar, CheckCircle2 } from "lucide-react";

type Filter = "upcoming" | "completed" | "all";

interface Props {
  milestones: ClientMilestoneItem[];
}

export function ClientMilestonesList({ milestones }: Props) {
  const [filter, setFilter] = useState<Filter>("upcoming");

  const filtered = useMemo(() => {
    const sorted = milestones.slice().sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    const today = getTodayDateString();
    switch (filter) {
      case "upcoming":
        return sorted.filter((m) => !m.completedAt && m.dueDate >= today);
      case "completed":
        return sorted.filter((m) => !!m.completedAt);
      case "all":
      default:
        return sorted;
    }
  }, [milestones, filter]);

  const hasAny = milestones.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle>All milestones</SectionTitle>
        <div className="inline-flex items-center gap-1 rounded-full bg-white/5 p-1 text-xs text-zinc-300 ring-1 ring-white/10">
          <button
            type="button"
            onClick={() => setFilter("upcoming")}
            className={`rounded-full px-3 py-1 transition-colors ${
              filter === "upcoming"
                ? "bg-indigo-500 text-white shadow-sm"
                : "hover:bg-white/10"
            }`}
          >
            Upcoming
          </button>
          <button
            type="button"
            onClick={() => setFilter("completed")}
            className={`rounded-full px-3 py-1 transition-colors ${
              filter === "completed"
                ? "bg-indigo-500 text-white shadow-sm"
                : "hover:bg-white/10"
            }`}
          >
            Completed
          </button>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-full px-3 py-1 transition-colors ${
              filter === "all" ? "bg-indigo-500 text-white shadow-sm" : "hover:bg-white/10"
            }`}
          >
            All
          </button>
        </div>
      </div>

      {!hasAny || filtered.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No milestones to show"
          description="When your projects have milestones, they’ll appear here. Try a different filter if you’re not seeing what you expect."
        />
      ) : (
        <GlassCard className="divide-y divide-white/5">
          <ul className="divide-y divide-white/5">
            {filtered.map((m) => {
              const isCompleted = !!m.completedAt;
              return (
                <li key={m.id} className="flex items-start gap-3 px-4 py-3 sm:px-6">
                  <div className="mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Calendar className="h-4 w-4 text-indigo-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{m.title}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {m.projectName} · {formatDisplayDate(m.dueDate)}
                    </p>
                  </div>
                  <div className="ml-3 shrink-0">
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        isCompleted
                          ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30"
                          : "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/30",
                      ].join(" ")}
                    >
                      {isCompleted ? "Completed" : "Upcoming"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-white/10 px-4 py-3 text-xs text-zinc-500 sm:px-6">
            Need changes to a milestone?{" "}
            <Link href="/dashboard/support" className="font-medium text-indigo-300 hover:text-indigo-200">
              Contact support
            </Link>
            .
          </div>
        </GlassCard>
      )}
    </div>
  );
}

