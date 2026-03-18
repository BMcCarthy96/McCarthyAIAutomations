import type { Metadata } from "next";
import Link from "next/link";
import { dashboardQuickActions } from "@/lib/data";
import {
  getCurrentClientId,
  fetchProjectsWithDetails,
  fetchProjectUpdatesForClient,
  getUpcomingMilestonesForClient,
} from "@/lib/portal-data";
import { getClientAutomationMetrics } from "@/lib/portal-metrics";
import { getProjectActivityTimeline } from "@/lib/portal-timeline";
import { formatDisplayDate } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { AutomationMetrics } from "@/components/dashboard/AutomationMetrics";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ProjectTimeline } from "@/components/dashboard/ProjectTimeline";
import {
  ArrowRight,
  Calendar,
  Clock,
  FileText,
  HelpCircle,
  Layers,
} from "lucide-react";

const quickActionIcons = { HelpCircle, Layers, FileText } as const;

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your active services and project status.",
};

/** Ensure dashboard always reflects latest data (e.g. new projects/milestones). */
export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const clientId = await getCurrentClientId();
  const [projects, allUpdates, activity, metrics, upcomingMilestones] = await Promise.all([
    fetchProjectsWithDetails(clientId),
    fetchProjectUpdatesForClient(clientId),
    getProjectActivityTimeline(clientId),
    getClientAutomationMetrics(),
    getUpcomingMilestonesForClient(clientId, 4),
  ]);

  const recentUpdates = allUpdates.slice(0, 3);
  const overviewProjects = projects.slice(0, 2);
  const latestActivity = activity.slice(0, 5);

  const activeCount = projects.filter((p) => p.status === "active").length;
  const inProgressCount = projects.filter((p) => p.status === "in_progress").length;

  return (
    <div className="space-y-10">
      <WelcomeHeader />

      <section>
        <SectionTitle>Automation metrics</SectionTitle>
        <div className="mt-4">
          {metrics.length > 0 ? (
            <AutomationMetrics metrics={metrics} />
          ) : (
            <EmptyState
              icon={Layers}
              title="No metrics yet"
              description="When your automations start running, key metrics will appear here."
              compact
            />
          )}
        </div>
      </section>

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
          {projects.length === 0 && (
            <p className="mt-4 border-t border-white/10 pt-4 text-sm text-zinc-500">
              Your services will appear here once they’re set up. Need access? Contact your account manager.
            </p>
          )}
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
          action={projects.length > 0 ? { label: "View all", href: "/dashboard/services" } : undefined}
        >
          Your services
        </SectionTitle>
        <div className="mt-4 space-y-4">
          {overviewProjects.length > 0 ? (
            overviewProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <EmptyState
              icon={Layers}
              title="No services yet"
              description="Your active services and projects will show up here once they’re set up. If you expect to see something, contact your account manager."
            />
          )}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <SectionTitle
            action={
              upcomingMilestones.length > 0
                ? { label: "View all", href: "/dashboard/milestones" }
                : undefined
            }
          >
            Next milestones
          </SectionTitle>
          <div className="mt-4">
            {upcomingMilestones.length > 0 ? (
              <ul className="space-y-2">
                {upcomingMilestones.map((item) => (
                  <li key={item.id}>
                    <Link
                      href="/dashboard/services"
                      className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-white/15 hover:bg-white/10"
                    >
                      <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                      <div className="min-w-0">
                        <p className="font-medium text-white">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {item.projectName} · {formatDisplayDate(item.dueDate)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={Calendar}
                title="No milestones yet"
                description="Upcoming milestones will appear here once your services and projects are set up."
                compact
              />
            )}
          </div>
        </div>
        <div>
          <SectionTitle
            action={{ label: "View all", href: "/dashboard/updates" }}
          >
            Recent updates
          </SectionTitle>
          <div className="mt-4">
            {recentUpdates.length > 0 ? (
              <ul className="space-y-2">
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
            ) : (
              <EmptyState
                icon={FileText}
                title="No updates yet"
                description="Project updates from your team will show up here. Check back later or contact your project manager if you’re expecting an update."
                compact
              />
            )}
          </div>
        </div>
      </section>

      <section>
        <SectionTitle
          action={
            latestActivity.length > 0
              ? { label: "View all", href: "/dashboard/activity" }
              : undefined
          }
        >
          Project activity
        </SectionTitle>
        <div className="mt-4">
          {latestActivity.length > 0 ? (
            <ProjectTimeline items={latestActivity} />
          ) : (
            <EmptyState
              icon={Clock}
              title="No activity yet"
              description="Updates and milestones will appear here."
              compact
            />
          )}
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
