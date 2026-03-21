import type { Metadata } from "next";
import { getCurrentClientId, getAllMilestonesForClient } from "@/lib/portal-data";
import { ClientMilestonesList } from "@/components/dashboard/ClientMilestonesList";
import { PageHeader } from "@/components/dashboard/PageHeader";

export const metadata: Metadata = {
  title: "Milestones",
  description: "See the full roadmap of your project milestones.",
};

export default async function ClientMilestonesPage() {
  const clientId = await getCurrentClientId();
  const milestones = await getAllMilestonesForClient(clientId);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Delivery"
        title="Milestones"
        subtitle="Every checkpoint across your engagements—filter by upcoming, completed, or the full list."
      />
      <ClientMilestonesList milestones={milestones} />
    </div>
  );
}
