import { Calendar, MessageSquare } from "lucide-react";
import type { ProjectWithDetails } from "@/lib/types";
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

  return (
    <GlassCard hover={false} variant="premium" className="p-0 overflow-hidden">
      <div className="p-7 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                {project.name}
              </h2>
              <StatusBadge status={project.status} label={statusLabel[project.status]} />
            </div>
            <div className="mt-4 h-2 w-full max-w-md overflow-hidden rounded-full bg-white/[0.08]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-purple-400 shadow-[0_0_12px_rgba(99,102,241,0.45)] transition-all"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-medium text-zinc-500">{project.progress}% complete</p>
          </div>
        </div>
      </div>
      <div className="grid gap-0 border-t border-white/[0.06] bg-black/15 sm:grid-cols-2">
        <div className="flex gap-4 border-b border-white/[0.05] p-6 sm:border-b-0 sm:border-r sm:border-white/[0.06] sm:p-7">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/12">
            <Calendar className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Next milestone
            </p>
            <p className="mt-1 font-medium text-white">
              {nextMilestone?.title ?? "—"}
            </p>
            <p className="text-sm text-zinc-400">
              {nextMilestone ? formatDisplayDate(nextMilestone.dueDate) : "—"}
            </p>
          </div>
        </div>
        <div className="flex gap-4 p-6 sm:p-7">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/12">
            <MessageSquare className="h-5 w-5 text-violet-300" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Recent update
            </p>
            <p className="mt-1 text-sm leading-snug text-zinc-200">
              {recentUpdate?.title ?? "—"}
            </p>
            <p className="text-xs text-zinc-500">
              {recentUpdate ? formatDisplayDate(recentUpdate.createdAt) : "—"}
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
