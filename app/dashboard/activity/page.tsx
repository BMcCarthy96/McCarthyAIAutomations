import type { Metadata } from "next";
import { getCurrentClientId } from "@/lib/portal-data";
import { getProjectActivityTimeline } from "@/lib/portal-timeline";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProjectTimeline } from "@/components/dashboard/ProjectTimeline";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Project activity",
  description: "Recent updates, milestones, and support activity for your projects.",
};

export default async function DashboardActivityPage() {
  const clientId = await getCurrentClientId();
  const items = await getProjectActivityTimeline(clientId);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Project activity"
        subtitle="A unified view of updates, milestones, and support for your projects."
      />
      {items.length > 0 ? (
        <ProjectTimeline items={items} />
      ) : (
        <EmptyState
          icon={Clock}
          title="No activity yet"
          description="Updates and milestones will appear here."
        />
      )}
    </div>
  );
}
