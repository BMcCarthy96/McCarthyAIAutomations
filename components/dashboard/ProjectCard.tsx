import { Calendar, MessageSquare, Zap } from "lucide-react";
import type { ProjectWithDetails } from "@/lib/types";
import {
  getProjectAutomationOutcomeLine,
  getProjectStatusHeadline,
} from "@/lib/project-card-narrative";
import { formatDisplayDate } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "./StatusBadge";

const statusLabel: Record<ProjectWithDetails["status"], string> = {
  active: "Live",
  in_progress: "In progress",
  pending: "Scheduled",
  completed: "Completed",
};

interface ProjectCardProps {
  project: ProjectWithDetails;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const nextMilestone = project.nextMilestone;
  const recentUpdate = project.recentUpdate;
  const outcomeLine = getProjectAutomationOutcomeLine(project.name);
  const statusHeadline = getProjectStatusHeadline(project.status);

  return (
    <GlassCard
      hover={false}
      variant="premium"
      className="p-0 overflow-hidden shadow-[0_24px_48px_-28px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.07]"
    >
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_0%_-20%,rgba(99,102,241,0.14),transparent_55%),radial-gradient(ellipse_70%_50%_at_100%_0%,rgba(139,92,246,0.1),transparent_50%)]"
        />
        <div className="relative border-b border-white/[0.08] px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
            <div className="min-w-0 flex-1 space-y-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Automation system
                </p>
                <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {project.name}
                </h2>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-black/25 px-4 py-3 backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-200/80">
                  What it does for you
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                  {outcomeLine}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2 lg:items-end">
              <StatusBadge
                status={project.status}
                label={statusLabel[project.status]}
                className="px-3 py-1 text-[13px] shadow-md"
              />
              <p className="max-w-[220px] text-right text-xs font-medium leading-snug text-zinc-500 lg:max-w-[200px]">
                {statusHeadline}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <Zap className="h-3.5 w-3.5 text-amber-400/80" aria-hidden />
                Rollout progress
              </span>
              <span className="text-sm font-bold tabular-nums text-zinc-200">
                {project.progress}%
              </span>
            </div>
            <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-white/[0.07] ring-1 ring-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-violet-400 shadow-[0_0_16px_rgba(99,102,241,0.45)] transition-all"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-0 border-t border-white/[0.05] bg-black/20 sm:grid-cols-2">
        <div className="flex gap-3.5 border-b border-white/[0.05] p-5 sm:border-b-0 sm:border-r sm:border-white/[0.06] sm:p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 ring-1 ring-indigo-400/20">
            <Calendar className="h-5 w-5 text-indigo-300" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Next milestone
            </p>
            <p className="mt-1 font-semibold text-white">
              {nextMilestone?.title ?? "—"}
            </p>
            <p className="mt-0.5 text-sm text-zinc-500">
              {nextMilestone ? formatDisplayDate(nextMilestone.dueDate) : "—"}
            </p>
          </div>
        </div>
        <div className="flex gap-3.5 p-5 sm:p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-400/20">
            <MessageSquare className="h-5 w-5 text-violet-300" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Latest from your team
            </p>
            <p className="mt-1 text-sm leading-snug text-zinc-200">
              {recentUpdate?.title ?? "—"}
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">
              {recentUpdate ? formatDisplayDate(recentUpdate.createdAt) : "—"}
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
