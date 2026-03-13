import type { Metadata } from "next";
import Link from "next/link";
import { supportRequestStatusLabels } from "@/lib/data";
import type { SupportRequest } from "@/lib/types";
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

type RequestView = "active" | "resolved" | "closed" | "all";

const VIEWS: { value: RequestView; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
  { value: "all", label: "All" },
];

function isValidView(v: string | undefined): v is RequestView {
  return v === "active" || v === "resolved" || v === "closed" || v === "all";
}

function filterByView(requests: SupportRequest[], view: RequestView): SupportRequest[] {
  if (view === "active") {
    return requests.filter((r) => r.status === "open" || r.status === "in_progress");
  }
  if (view === "resolved") return requests.filter((r) => r.status === "resolved");
  if (view === "closed") return requests.filter((r) => r.status === "closed");
  return requests;
}

export default async function DashboardSupportPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const [requests, projectsWithDetails] = await Promise.all([
    fetchSupportRequestsForClient(),
    fetchProjectsWithDetails(),
  ]);
  const projects = projectsWithDetails.map((p) => ({ id: p.id, name: p.name }));

  const { view: viewParam } = await searchParams;
  const view: RequestView = isValidView(viewParam) ? viewParam : "active";
  const filteredRequests = filterByView(requests, view);

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
          <SectionTitle>Your requests</SectionTitle>
          <p className="mt-1 text-sm text-zinc-500">
            {filteredRequests.length} request{filteredRequests.length !== 1 ? "s" : ""}
            {view !== "all" && ` (${view})`}
          </p>
          <div className="mt-3 flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            {VIEWS.map((v) => (
              <Link
                key={v.value}
                href={`/dashboard/support?view=${v.value}`}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  view === v.value
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {v.label}
              </Link>
            ))}
          </div>
          {filteredRequests.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {filteredRequests.map((r) => (
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
          ) : (
            <p className="mt-4 text-sm text-zinc-500">
              No requests in this view.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
