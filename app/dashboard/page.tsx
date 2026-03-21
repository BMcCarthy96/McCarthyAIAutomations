import type { Metadata } from "next";
import Link from "next/link";
import { dashboardQuickActions } from "@/lib/data";
import {
  getCurrentClientId,
  fetchProjectsWithDetails,
  fetchProjectUpdatesForClient,
  getAllMilestonesForClient,
  getUpcomingMilestonesForClient,
} from "@/lib/portal-data";
import { getClientAutomationMetrics } from "@/lib/portal-metrics";
import { getAutomationImpactInsights } from "@/lib/portal-metrics-insights";
import { getProjectActivityTimeline } from "@/lib/portal-timeline";
import { cn, formatDisplayDate } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { AutomationMetrics } from "@/components/dashboard/AutomationMetrics";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { DemoHint } from "@/components/dashboard/DemoHint";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ProjectTimeline } from "@/components/dashboard/ProjectTimeline";
import {
  ArrowRight,
  Calendar,
  Check,
  Circle,
  Clock,
  FileText,
  HelpCircle,
  Layers,
  Sparkles,
} from "lucide-react";

const quickActionIcons = { HelpCircle, Layers, FileText } as const;

/** List row links — single border, no ring (avoids stacked chrome with section headers). */
const rowLinkClass =
  "flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-4 backdrop-blur-sm transition-colors hover:border-indigo-400/25 hover:bg-white/[0.055]";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your active services and project status.",
};

/** Ensure dashboard always reflects latest data (e.g. new projects/milestones). */
export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const clientId = await getCurrentClientId();
  const [projects, allUpdates, activity, metrics, allMilestones, upcomingMilestones] =
    await Promise.all([
      fetchProjectsWithDetails(clientId),
      fetchProjectUpdatesForClient(clientId),
      getProjectActivityTimeline(clientId),
      getClientAutomationMetrics(),
      getAllMilestonesForClient(clientId),
      getUpcomingMilestonesForClient(clientId, 4),
    ]);

  const recentUpdates = allUpdates.slice(0, 3);
  const overviewProjects = projects.slice(0, 2);
  const latestActivity = activity.slice(0, 5);

  const activeCount = projects.filter((p) => p.status === "active").length;
  const inProgressCount = projects.filter((p) => p.status === "in_progress").length;

  const hoursSaved = metrics.find((m) => m.id === "hours")?.value ?? "0";
  const estimatedRevenue = metrics.find((m) => m.id === "revenue")?.value ?? "$0";

  const projectCreated = projects.length > 0;

  const milestonesPerProject = new Map<string, number>();
  allMilestones.forEach((m) => {
    milestonesPerProject.set(m.projectId, (milestonesPerProject.get(m.projectId) ?? 0) + 1);
  });
  const milestonesScheduled = Array.from(milestonesPerProject.values()).some(
    (count) => count >= 2
  );

  const integrationInProgress = projects.some((p) => p.status === "in_progress");
  const automationLive = projects.some((p) => p.status === "active");

  const impactInsights =
    metrics.length > 0 ? getAutomationImpactInsights(metrics) : [];

  return (
    <div className="space-y-16">
      <WelcomeHeader />

      <section>
        <SectionTitle
          eyebrow="Onboarding"
          description="Track how your build is progressing from first integration to automation in production."
        >
          Your automation setup
        </SectionTitle>
        <div className="mt-8">
          <GlassCard
            hover={false}
            variant="premium"
            className="flex flex-wrap items-center gap-7 px-7 py-7 sm:gap-10 sm:px-8 sm:py-8"
          >
            {[
              { label: "Project created", done: projectCreated },
              { label: "Milestones scheduled", done: milestonesScheduled },
              { label: "Integration in progress", done: integrationInProgress },
              { label: "Automation live", done: automationLive },
            ].map(({ label, done }) => (
              <div
                key={label}
                className="flex items-center gap-3 text-sm text-zinc-400"
              >
                {done ? (
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/12">
                    <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                  </span>
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05]">
                    <Circle className="h-4 w-4 shrink-0 text-zinc-600" />
                  </span>
                )}
                <span className={cn(done && "font-medium text-zinc-200")}>{label}</span>
              </div>
            ))}
          </GlassCard>
        </div>
      </section>

      <section>
        <SectionTitle
          eyebrow="Reporting"
          description="A concise view of what your automation delivered over the last 30 days—the same signals we use in monthly impact emails."
        >
          Monthly impact report
        </SectionTitle>
        <DemoHint topic="metrics" />
        <div className="mt-8 space-y-8">
          {metrics.length > 0 ? (
            <>
              {impactInsights.length > 0 && (
                <GlassCard
                  hover={false}
                  variant="premium"
                  className="border-indigo-400/12 bg-gradient-to-br from-indigo-500/[0.1] to-purple-500/[0.04] px-7 py-7 sm:px-8 sm:py-8"
                >
                  <div className="flex items-start gap-4 sm:gap-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/18">
                      <Sparkles className="h-5 w-5 text-indigo-200" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-200/90">
                        Key insights
                      </p>
                      <ul className="mt-4 list-none space-y-4">
                        {impactInsights.map((line, idx) => (
                          <li
                            key={idx}
                            className="flex gap-3 text-sm leading-relaxed text-zinc-300"
                          >
                            <span
                              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400/90"
                              aria-hidden
                            />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </GlassCard>
              )}

              <GlassCard hover={false} variant="default" className="py-6 sm:px-8 sm:py-7">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    At a glance
                  </p>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    Impact report
                  </span>
                </div>
                <p className="mt-4 text-base leading-relaxed text-zinc-300 sm:text-lg">
                  Your automation saved you{" "}
                  <span className="font-bold tabular-nums text-emerald-300">{hoursSaved}</span>{" "}
                  hours and influenced{" "}
                  <span className="font-bold tabular-nums text-amber-200">{estimatedRevenue}</span>{" "}
                  in the last 30 days.
                </p>
              </GlassCard>

              <AutomationMetrics metrics={metrics} />
            </>
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

      <section className="grid gap-4 sm:grid-cols-3 sm:gap-5">
        <GlassCard hover={false} variant="premium" className="px-5 py-5 sm:col-span-2 sm:px-6 sm:py-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Portfolio snapshot
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-5 sm:gap-7">
            <div>
              <p className="text-3xl font-bold tabular-nums leading-none text-white sm:text-4xl">
                {projects.length}
              </p>
              <p className="mt-1.5 text-sm text-zinc-500">Active services</p>
            </div>
            <div className="hidden h-10 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent sm:block" />
            <div>
              <p className="text-3xl font-bold tabular-nums leading-none text-emerald-300 sm:text-4xl">
                {activeCount}
              </p>
              <p className="mt-1.5 text-sm text-zinc-500">Live</p>
            </div>
            <div>
              <p className="text-3xl font-bold tabular-nums leading-none text-amber-300 sm:text-4xl">
                {inProgressCount}
              </p>
              <p className="mt-1.5 text-sm text-zinc-500">In progress</p>
            </div>
          </div>
          {projects.length === 0 && (
            <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-relaxed text-zinc-500">
              Your services will appear here once they’re set up. Need access? Contact your account manager.
            </p>
          )}
        </GlassCard>
        <GlassCard
          href="/dashboard/support"
          variant="premium"
          className="flex flex-col justify-center bg-gradient-to-br from-indigo-500/[0.07] to-transparent px-5 py-5 sm:px-6 sm:py-6"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/18">
            <HelpCircle className="h-5 w-5 text-indigo-300" />
          </span>
          <p className="mt-3 font-semibold text-white">Need help?</p>
          <p className="mt-1 text-sm leading-relaxed text-zinc-400">
            Open a support thread or escalate through your project team.
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-300">
            Go to Support
            <ArrowRight className="h-4 w-4" />
          </span>
        </GlassCard>
      </section>

      <section>
        <SectionTitle
          eyebrow="Engagements"
          description="Each card is an automation in your stack—outcome, rollout, milestones, and team updates in one place."
          action={projects.length > 0 ? { label: "View all", href: "/dashboard/services" } : undefined}
        >
          Your services
        </SectionTitle>
        <div className="mt-8 space-y-5">
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

      <section className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <SectionTitle
            eyebrow="Roadmap"
            action={
              upcomingMilestones.length > 0
                ? { label: "View all", href: "/dashboard/milestones" }
                : undefined
            }
          >
            Next milestones
          </SectionTitle>
          <DemoHint topic="milestones" />
          <div className="mt-8">
            {upcomingMilestones.length > 0 ? (
              <ul className="space-y-4">
                {upcomingMilestones.map((item) => (
                  <li key={item.id}>
                    <Link href="/dashboard/milestones" className={rowLinkClass}>
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/12">
                        <Calendar className="h-4 w-4 text-indigo-300" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-white">{item.title}</p>
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
            eyebrow="From your team"
            action={{ label: "View all", href: "/dashboard/updates" }}
          >
            Recent updates
          </SectionTitle>
          <div className="mt-8">
            {recentUpdates.length > 0 ? (
              <ul className="space-y-4">
                {recentUpdates.map((update) => (
                  <li key={update.id}>
                    <Link href="/dashboard/updates" className={rowLinkClass}>
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/12">
                        <FileText className="h-4 w-4 text-violet-300" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-white">{update.title}</p>
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
          eyebrow="Timeline"
          description="A unified feed of updates, milestones, and support touchpoints."
          action={
            latestActivity.length > 0
              ? { label: "View all", href: "/dashboard/activity" }
              : undefined
          }
        >
          Project activity
        </SectionTitle>
        <div className="mt-8">
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
        <SectionTitle eyebrow="Shortcuts" description="Jump to the most-used areas of your portal.">
          Quick actions
        </SectionTitle>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {dashboardQuickActions.map((action) => {
            const Icon = quickActionIcons[action.icon];
            return (
              <GlassCard key={action.id} href={action.href} variant="default" className="px-6 py-6 sm:px-7 sm:py-7">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/12">
                  <Icon className="h-5 w-5 text-indigo-300" />
                </span>
                <p className="mt-4 font-semibold text-white">{action.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                  {action.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-300">
                  Open
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
