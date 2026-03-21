"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ClientMilestoneItem } from "@/lib/portal-data";
import { formatDisplayDate, getTodayDateString } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Flag,
  Route,
} from "lucide-react";

type Filter = "upcoming" | "completed" | "all";

interface Props {
  milestones: ClientMilestoneItem[];
}

type Phase = "completed" | "overdue" | "upcoming";

function getPhase(m: ClientMilestoneItem, today: string): Phase {
  if (m.completedAt) return "completed";
  if (m.dueDate < today) return "overdue";
  return "upcoming";
}

const PHASE_META: Record<
  Phase,
  { label: string; sub: string; pill: string; iconWrap: string; Icon: typeof CheckCircle2 }
> = {
  completed: {
    label: "Delivered",
    sub: "This implementation step is complete.",
    pill: "border border-emerald-400/30 bg-emerald-500/[0.12] text-emerald-100 shadow-[0_0_20px_-10px_rgba(52,211,153,0.35)]",
    iconWrap:
      "bg-gradient-to-br from-emerald-500/25 to-emerald-600/10 ring-1 ring-emerald-400/25",
    Icon: CheckCircle2,
  },
  overdue: {
    label: "Needs attention",
    sub: "Target date has passed—your team may be rescheduling.",
    pill: "border border-rose-400/28 bg-rose-500/12 text-rose-100",
    iconWrap:
      "bg-gradient-to-br from-rose-500/20 to-rose-600/5 ring-1 ring-rose-400/25",
    Icon: Clock,
  },
  upcoming: {
    label: "Scheduled",
    sub: "On the rollout plan.",
    pill: "border border-amber-400/25 bg-amber-500/10 text-amber-100",
    iconWrap:
      "bg-gradient-to-br from-amber-500/15 to-orange-500/5 ring-1 ring-amber-400/20",
    Icon: Calendar,
  },
};

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
  const today = getTodayDateString();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            <Route className="h-3.5 w-3.5 text-indigo-400/90" aria-hidden />
            Implementation roadmap
          </div>
          <p className="text-sm leading-relaxed text-zinc-400">
            Each row is a planned step in your automation rollout—not a generic
            task list. Use filters to focus on what&apos;s next or review what
            your team has already shipped.
          </p>
        </div>
        <div className="inline-flex w-fit shrink-0 flex-col gap-2 sm:items-end">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            View
          </span>
          <div className="inline-flex items-center gap-1 rounded-xl border border-white/[0.08] bg-black/30 p-1 shadow-inner ring-1 ring-white/[0.04]">
            {(
              [
                { key: "upcoming" as const, label: "Next steps" },
                { key: "completed" as const, label: "Completed" },
                { key: "all" as const, label: "Full roadmap" },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-semibold transition-all sm:px-4",
                  filter === key
                    ? "bg-indigo-500/25 text-white shadow-sm ring-1 ring-indigo-400/20"
                    : "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!hasAny ? (
        <EmptyState
          icon={Calendar}
          title="No rollout steps yet"
          description="When your delivery team adds milestones to your automations, your full implementation roadmap will appear here."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No steps in this view"
          description="Try another filter, or ask your team if dates are being updated."
        />
      ) : (
        <GlassCard
          hover={false}
          variant="premium"
          className="overflow-hidden p-0 ring-1 ring-white/[0.07] shadow-[0_24px_48px_-28px_rgba(0,0,0,0.5)]"
        >
          <div className="border-b border-white/[0.06] bg-gradient-to-r from-indigo-500/[0.06] via-transparent to-violet-500/[0.05] px-5 py-4 sm:px-8">
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              <Flag className="h-3.5 w-3.5 text-zinc-500" aria-hidden />
              <span>
                Showing{" "}
                <span className="font-semibold text-zinc-300">{filtered.length}</span>{" "}
                of{" "}
                <span className="font-semibold text-zinc-300">
                  {milestones.length}
                </span>{" "}
                implementation step{milestones.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <ul className="divide-y divide-white/[0.06]">
            {filtered.map((m) => {
              const phase = getPhase(m, today);
              const meta = PHASE_META[phase];
              const Icon = meta.Icon;
              const isCompleted = phase === "completed";

              return (
                <li
                  key={m.id}
                  className={cn(
                    "group flex gap-4 px-5 py-5 transition-colors sm:gap-5 sm:px-8 sm:py-6",
                    isCompleted
                      ? "bg-emerald-500/[0.02] hover:bg-emerald-500/[0.04]"
                      : phase === "overdue"
                        ? "bg-rose-500/[0.02] hover:bg-rose-500/[0.04]"
                        : "hover:bg-white/[0.03]"
                  )}
                >
                  <div className="mt-0.5 shrink-0">
                    <span
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-2xl",
                        meta.iconWrap
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5",
                          isCompleted
                            ? "text-emerald-200"
                            : phase === "overdue"
                              ? "text-rose-200"
                              : "text-amber-200"
                        )}
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      {m.projectName}
                    </p>
                    <p className="mt-1 text-base font-semibold leading-snug text-white sm:text-lg">
                      {m.title}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-400">
                      {isCompleted && m.completedAt ? (
                        <span>
                          Completed{" "}
                          <span className="font-medium text-zinc-300">
                            {formatDisplayDate(m.completedAt)}
                          </span>
                        </span>
                      ) : (
                        <span>
                          Target:{" "}
                          <span className="font-medium text-zinc-300">
                            {formatDisplayDate(m.dueDate)}
                          </span>
                        </span>
                      )}
                      {!isCompleted && (
                        <span className="hidden text-zinc-600 sm:inline">·</span>
                      )}
                      {!isCompleted && (
                        <span className="text-xs text-zinc-500">{meta.sub}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1 self-start sm:ml-2">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-tight",
                        meta.pill
                      )}
                    >
                      {meta.label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-white/[0.06] bg-black/20 px-5 py-4 text-xs leading-relaxed text-zinc-500 sm:px-8">
            Questions about timing or scope?{" "}
            <Link
              href="/dashboard/support"
              className="font-semibold text-indigo-300 hover:text-indigo-200"
            >
              Open support
            </Link>{" "}
            and we&apos;ll route it to your delivery team.
          </div>
        </GlassCard>
      )}
    </div>
  );
}
