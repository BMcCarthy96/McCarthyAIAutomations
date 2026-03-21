import type { Metadata } from "next";
import { getCurrentClientId, getAllMilestonesForClient } from "@/lib/portal-data";
import { ClientMilestonesList } from "@/components/dashboard/ClientMilestonesList";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DemoHint } from "@/components/dashboard/DemoHint";

export const metadata: Metadata = {
  title: "Rollout roadmap",
  description:
    "Implementation steps and delivery checkpoints across your automation engagements.",
};

export default async function ClientMilestonesPage() {
  const clientId = await getCurrentClientId();
  const milestones = await getAllMilestonesForClient(clientId);

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="Delivery"
        title="Rollout roadmap"
        subtitle="Structured implementation steps for each automation—what’s scheduled, what’s done, and what’s next."
      />
      <DemoHint topic="milestones" />
      <ClientMilestonesList milestones={milestones} />
    </div>
  );
}
