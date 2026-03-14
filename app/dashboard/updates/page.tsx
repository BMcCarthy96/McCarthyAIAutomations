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
    <div className="space-y-8">
      <PageHeader
        title="Project Updates"
        subtitle="Recent updates and progress on your projects."
      />
      {updates.length > 0 ? (
        <ul className="space-y-4">
          {updates.map((update) => (
            <li key={update.id}>
              <GlassCard hover={false}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    {update.projectName}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {formatDisplayDate(update.createdAt)}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  {update.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {update.body}
                </p>
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
