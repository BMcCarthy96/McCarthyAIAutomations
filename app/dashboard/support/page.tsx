import type { Metadata } from "next";
import { supportRequestStatusLabels } from "@/lib/data";
import {
  fetchSupportRequestsForClient,
  fetchProjectsWithDetails,
} from "@/lib/portal-data";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { CreateSupportRequestForm } from "@/components/dashboard/CreateSupportRequestForm";
import { formatDisplayDate } from "@/lib/utils";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Mail, MessageCircle, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help or request changes for your projects.",
};

export default async function DashboardSupportPage() {
  const [requests, projectsWithDetails] = await Promise.all([
    fetchSupportRequestsForClient(),
    fetchProjectsWithDetails(),
  ]);
  const projects = projectsWithDetails.map((p) => ({ id: p.id, name: p.name }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Support"
        subtitle="Get help, request changes, or ask questions about your projects."
      />
      <section>
        <SectionTitle>New request</SectionTitle>
        <GlassCard hover={false} className="mt-4 max-w-xl">
          <Send className="h-10 w-10 text-indigo-400" />
          <p className="mt-4 text-sm text-zinc-400">
            Submit a support request. We’ll respond via email or through this
            portal.
          </p>
          <div className="mt-6">
            <CreateSupportRequestForm projects={projects} />
          </div>
        </GlassCard>
      </section>
      <div className="grid gap-6 sm:grid-cols-2">
        <GlassCard hover={false}>
          <Mail className="h-10 w-10 text-indigo-400" />
          <h3 className="mt-4 text-lg font-semibold text-white">Email support</h3>
          <p className="mt-2 text-sm text-zinc-400">
            For non-urgent requests, documentation, or detailed questions. We
            typically respond within one business day.
          </p>
          <Button
            href="/contact"
            variant="secondary"
            size="md"
            className="mt-4"
          >
            Contact us
          </Button>
        </GlassCard>
        <GlassCard hover={false}>
          <MessageCircle className="h-10 w-10 text-indigo-400" />
          <h3 className="mt-4 text-lg font-semibold text-white">
            Project-specific help
          </h3>
          <p className="mt-2 text-sm text-zinc-400">
            Your project manager can help with scope, timelines, and
            deliverables. Reach out via your usual channel.
          </p>
          <p className="mt-4 text-sm text-zinc-500">
            Need to escalate? Use the contact form and we’ll route you to the
            right person.
          </p>
        </GlassCard>
      </div>
      {requests.length > 0 && (
        <section>
          <SectionTitle>Recent requests</SectionTitle>
          <ul className="mt-4 space-y-2">
            {requests.map((r) => (
              <li key={r.id}>
                <GlassCard hover={false}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-white">{r.subject}</span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-zinc-400">
                      {supportRequestStatusLabels[r.status] ?? r.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    {formatDisplayDate(r.createdAt)}
                  </p>
                </GlassCard>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
