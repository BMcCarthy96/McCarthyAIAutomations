import type { Metadata } from "next";
import { dashboardServices } from "@/lib/data";
import { GlassCard } from "@/components/ui/GlassCard";
import { CheckCircle2, Clock, Circle, Calendar, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your active services and project status.",
};

const statusConfig = {
  active: {
    icon: CheckCircle2,
    label: "Live",
    className: "text-emerald-400",
  },
  in_progress: {
    icon: Clock,
    label: "In progress",
    className: "text-amber-400",
  },
  pending: {
    icon: Circle,
    label: "Scheduled",
    className: "text-zinc-400",
  },
} as const;

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Your services</h1>
      <p className="mt-1 text-zinc-400">
        Overview of active projects and next milestones.
      </p>
      <div className="mt-8 space-y-6">
        {dashboardServices.map((project) => {
          const config =
            statusConfig[project.status] ?? statusConfig.pending;
          const StatusIcon = config.icon;
          return (
            <GlassCard key={project.id} hover={false}>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-white">
                      {project.name}
                    </h2>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {project.statusLabel}
                    </span>
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
                    <p className="mt-0.5 font-medium text-white">
                      {project.nextMilestone}
                    </p>
                    <p className="text-sm text-zinc-400">
                      {project.nextMilestoneDate}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MessageSquare className="h-5 w-5 shrink-0 text-indigo-400" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Recent update
                    </p>
                    <p className="mt-0.5 text-sm text-zinc-300">
                      {project.recentUpdate}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {project.recentUpdateDate}
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
