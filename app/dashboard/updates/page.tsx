import type { Metadata } from "next";
import { fetchProjectUpdatesForClient } from "@/lib/portal-data";
import { formatDisplayDate } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Project Updates",
  description: "Latest updates from the McCarthy AI Automations team.",
};

export default async function DashboardUpdatesPage() {
  const updates = await fetchProjectUpdatesForClient();
  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="Communications"
        title="Project updates"
        subtitle="Everything your delivery team posts—newest first, grouped by project."
      />
      {updates.length > 0 ? (
        <ul className="space-y-6">
          {updates.map((update) => (
            <li key={update.id}>
              <GlassCard hover={false} variant="premium" className="border-white/[0.08]">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-200">
                    {update.projectName}
                  </span>
                  <span className="text-xs font-medium text-zinc-500">
                    {formatDisplayDate(update.createdAt)}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-white sm:text-xl">
                  {update.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{update.body}</p>
              </GlassCard>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={FileText}
          title="No updates yet"
          description="Project updates from your team will show up here. Check back later or reach out to your project manager if you’re expecting an update."
        />
      )}
    </div>
  );
}
