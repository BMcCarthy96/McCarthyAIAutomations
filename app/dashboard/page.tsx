import type { Metadata } from "next";
import Link from "next/link";
import { dashboardQuickActions } from "@/lib/data";
import {
  getCurrentClientId,
  fetchProjectsWithDetails,
  fetchProjectUpdatesForClient,
} from "@/lib/portal-data";
import { formatDisplayDate } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { ArrowRight, Calendar, FileText, HelpCircle, Layers } from "lucide-react";

const quickActionIcons = { HelpCircle, Layers, FileText } as const;

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your active services and project status.",
};

export default async function DashboardOverviewPage() {
  const clientId = await getCurrentClientId();
  const [projects, allUpdates] = await Promise.all([
    fetchProjectsWithDetails(clientId),
    fetchProjectUpdatesForClient(clientId),
  ]);
  const recentUpdates = allUpdates.slice(0, 3);
  const overviewProjects = projects.slice(0, 2);

  const activeCount = projects.filter((p) => p.status === "active").length;
  const inProgressCount = projects.filter((p) => p.status === "in_progress").length;

  return (
    <div className="space-y-10">
      <WelcomeHeader />

      <section className="grid gap-4 sm:grid-cols-3">
        <GlassCard hover={false} className="sm:col-span-2">
          <div className="flex flex-wrap items-center gap-8">
            <div>
              <p className="text-3xl font-bold tabular-nums text-white">
                {projects.length}
              </p>
              <p className="mt-0.5 text-sm text-zinc-500">Active services</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <p className="text-3xl font-bold tabular-nums text-emerald-400">
                {activeCount}
              </p>
              <p className="mt-0.5 text-sm text-zinc-500">Live</p>
            </div>
            <div>
              <p className="text-3xl font-bold tabular-nums text-amber-400">
                {inProgressCount}
              </p>
              <p className="mt-0.5 text-sm text-zinc-500">In progress</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard href="/dashboard/support" className="flex flex-col justify-center">
          <HelpCircle className="h-5 w-5 text-indigo-400" />
          <p className="mt-3 font-medium text-white">Need help?</p>
          <p className="mt-0.5 text-sm text-zinc-400">
            Contact support or request changes.
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400">
            Go to Support
            <ArrowRight className="h-4 w-4" />
          </span>
        </GlassCard>
      </section>

      <section>
        <SectionTitle
          action={{ label: "View all", href: "/dashboard/services" }}
        >
          Your services
        </SectionTitle>
        <div className="mt-4 space-y-4">
          {overviewProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <SectionTitle action={{ label: "View all", href: "/dashboard/services" }}>
            Next milestones
          </SectionTitle>
          <ul className="mt-4 space-y-2">
            {projects.map((project) => {
              const next = project.nextMilestone;
              return (
                <li key={project.id}>
                  <Link
                    href="/dashboard/services"
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-white/15 hover:bg-white/10"
                  >
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                    <div className="min-w-0">
                      <p className="font-medium text-white">
                        {next?.title ?? "—"}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {project.name} · {next ? formatDisplayDate(next.dueDate) : "—"}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <SectionTitle
            action={{ label: "View all", href: "/dashboard/updates" }}
          >
            Recent updates
          </SectionTitle>
          <ul className="mt-4 space-y-2">
            {recentUpdates.map((update) => (
              <li key={update.id}>
                <Link
                  href="/dashboard/updates"
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-white/15 hover:bg-white/10"
                >
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                  <div className="min-w-0">
                    <p className="font-medium text-white">{update.title}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {update.projectName} · {formatDisplayDate(update.createdAt)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <SectionTitle>Quick actions</SectionTitle>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {dashboardQuickActions.map((action) => {
            const Icon = quickActionIcons[action.icon];
            return (
              <GlassCard key={action.id} href={action.href}>
                <Icon className="h-5 w-5 text-indigo-400" />
                <p className="mt-3 font-medium text-white">{action.label}</p>
                <p className="mt-0.5 text-sm text-zinc-400">
                  {action.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400">
                  Go
                  <ArrowRight className="h-4 w-4" />
                </span>
              </GlassCard>
            );
          })}
        </div>
      </section>
    </div>
  );
}
