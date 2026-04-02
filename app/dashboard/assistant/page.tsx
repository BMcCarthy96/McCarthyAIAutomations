import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KnowledgeAssistantPanel } from "@/components/dashboard/KnowledgeAssistantPanel";
import { AssistantNotLinked } from "@/components/dashboard/AssistantNotLinked";
import { getCurrentClientId } from "@/lib/portal-data";

export const metadata: Metadata = {
  title: "Knowledge assistant",
  description: "Ask questions grounded in your projects, updates, and support history.",
};

export const dynamic = "force-dynamic";

export default async function DashboardAssistantPage() {
  const clientId = await getCurrentClientId();
  const openAiConfigured = Boolean(process.env.OPENAI_API_KEY?.trim());

  if (!clientId) {
    return (
      <div className="space-y-10">
        <PageHeader
          eyebrow="AI"
          title="Knowledge assistant"
          subtitle="Grounded answers from your portal data once your account is linked."
        />
        <AssistantNotLinked />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="AI"
        title="Knowledge assistant"
        subtitle="Answers are generated from your portal data and approved general FAQs only—never from other clients."
      />
      <KnowledgeAssistantPanel openAiConfigured={openAiConfigured} />
    </div>
  );
}
