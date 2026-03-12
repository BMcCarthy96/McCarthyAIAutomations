import { Calendar, MessageSquare } from "lucide-react";
import type { DashboardService } from "@/lib/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "./StatusBadge";

interface ProjectCardProps {
  project: DashboardService;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <GlassCard hover={false}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-white">{project.name}</h2>
            <StatusBadge status={project.status} label={project.statusLabel} />
          </div>
          <div className="mt-2 h-2 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </div>
      <div className="mt-6 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-2">
        <div className="flex gap-3">
          <Calendar className="h-5 w-5 shrink-0 text-indigo-400" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Next milestone
            </p>
            <p className="mt-0.5 font-medium text-white">{project.nextMilestone}</p>
            <p className="text-sm text-zinc-400">{project.nextMilestoneDate}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <MessageSquare className="h-5 w-5 shrink-0 text-indigo-400" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Recent update
            </p>
            <p className="mt-0.5 text-sm text-zinc-300">{project.recentUpdate}</p>
            <p className="text-xs text-zinc-500">{project.recentUpdateDate}</p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
