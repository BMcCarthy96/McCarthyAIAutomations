"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ClientMilestoneItem } from "@/lib/portal-data";
import { formatDisplayDate, getTodayDateString } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
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
    <div className="space-y-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500">
          <span className="font-medium text-zinc-400">View:</span> focus on what’s next or review
          completed work.
        </p>
        <div className="inline-flex w-fit items-center gap-1 rounded-xl border border-white/[0.07] bg-black/25 p-1">
          {(
            [
              { key: "upcoming" as const, label: "Upcoming" },
              { key: "completed" as const, label: "Completed" },
              { key: "all" as const, label: "All" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-semibold transition-all",
                filter === key
                  ? "bg-indigo-500/20 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {!hasAny || filtered.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No milestones to show"
          description="When your projects have milestones, they’ll appear here. Try a different filter if you’re not seeing what you expect."
        />
      ) : (
        <GlassCard hover={false} variant="premium" className="overflow-hidden p-0">
          <ul className="divide-y divide-white/[0.06]">
            {filtered.map((m) => {
              const isCompleted = !!m.completedAt;
              return (
                <li
                  key={m.id}
                  className="flex items-start gap-4 px-6 py-5 transition-colors hover:bg-white/[0.03] sm:px-8 sm:py-5"
                >
                  <div className="mt-0.5">
                    {isCompleted ? (
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/12">
                        <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                      </span>
                    ) : (
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/12">
                        <Calendar className="h-4 w-4 text-indigo-300" />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white">{m.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {m.projectName} · {formatDisplayDate(m.dueDate)}
                    </p>
                  </div>
                  <div className="ml-2 shrink-0">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                        isCompleted
                          ? "border border-emerald-400/22 bg-emerald-500/10 text-emerald-200"
                          : "border border-amber-400/22 bg-amber-500/10 text-amber-200"
                      )}
                    >
                      {isCompleted ? "Completed" : "Upcoming"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-white/[0.06] bg-black/15 px-6 py-4 text-xs text-zinc-500 sm:px-8">
            Need changes to a milestone?{" "}
            <Link
              href="/dashboard/support"
              className="font-semibold text-indigo-300 hover:text-indigo-200"
            >
              Contact support
            </Link>
            .
          </div>
        </GlassCard>
      )}
    </div>
  );
}
