import type { Metadata } from "next";
import Link from "next/link";
import {
  dashboardServices,
  dashboardProjectUpdates,
  dashboardQuickActions,
} from "@/lib/data";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { ArrowRight, Calendar, FileText, HelpCircle, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your active services and project status.",
};

const recentUpdates = dashboardProjectUpdates.slice(0, 3);
const overviewServices = dashboardServices.slice(0, 2);

function SectionTitle({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
        {children}
      </h2>
      {action && (
        <Link
          href={action.href}
          className="text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export default function DashboardOverviewPage() {
  const activeCount = dashboardServices.filter((s) => s.status === "active").length;
  const inProgressCount = dashboardServices.filter(
    (s) => s.status === "in_progress"
  ).length;

  return (
    <div className="space-y-10">
      <WelcomeHeader />

      <section className="grid gap-4 sm:grid-cols-3">
        <GlassCard hover={false} className="sm:col-span-2">
          <div className="flex flex-wrap items-center gap-8">
            <div>
              <p className="text-3xl font-bold tabular-nums text-white">
                {dashboardServices.length}
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
          {overviewServices.map((project) => (
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
            {dashboardServices.map((project) => (
              <li key={project.id}>
                <Link
                  href="/dashboard/services"
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-white/15 hover:bg-white/10"
                >
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                  <div className="min-w-0">
                    <p className="font-medium text-white">
                      {project.nextMilestone}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {project.name} · {project.nextMilestoneDate}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
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
                      {update.projectName} · {update.date}
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
            const icon =
              action.href === "/dashboard/support" ? HelpCircle : action.href === "/dashboard/services" ? Layers : FileText;
            const Icon = icon;
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
