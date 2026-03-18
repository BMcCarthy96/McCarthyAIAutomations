import type { Metadata } from "next";
import { getCurrentClientId, getAllMilestonesForClient } from "@/lib/portal-data";
import { ClientMilestonesList } from "@/components/dashboard/ClientMilestonesList";

export const metadata: Metadata = {
  title: "Milestones",
  description: "See the full roadmap of your project milestones.",
};

export default async function ClientMilestonesPage() {
  const clientId = await getCurrentClientId();
  const milestones = await getAllMilestonesForClient(clientId);

  return (
    <div className="space-y-8">
      <ClientMilestonesList milestones={milestones} />
    </div>
  );
}

