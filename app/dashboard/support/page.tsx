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
import { EmptyState } from "@/components/dashboard/EmptyState";
import { formatDisplayDate } from "@/lib/utils";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
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

function requestStatusPill(status: SupportRequest["status"]): string {
  switch (status) {
    case "open":
      return "bg-indigo-500/15 text-indigo-200 ring-1 ring-indigo-400/25";
    case "in_progress":
      return "bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/25";
    case "resolved":
      return "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/25";
    case "closed":
    default:
      return "bg-white/10 text-zinc-400 ring-1 ring-white/10";
  }
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
    <div className="space-y-10">
      <PageHeader
        eyebrow="Help"
        title="Support"
        subtitle="Open a thread for changes or questions—we respond by email and keep history here in your portal."
      />
      <section>
        <SectionTitle
          eyebrow="Create"
          description="Link a project if your request is specific to one engagement."
        >
          New request
        </SectionTitle>
        <GlassCard hover={false} variant="premium" className="mt-6 max-w-xl border-indigo-500/15">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/15 ring-1 ring-indigo-400/25">
            <Send className="h-6 w-6 text-indigo-300" />
          </span>
          <p className="mt-5 text-sm leading-relaxed text-zinc-400">
            Submit a support request. We’ll respond via email or through this portal.
          </p>
          <div className="mt-6">
            <CreateSupportRequestForm projects={projects} />
          </div>
        </GlassCard>
      </section>
      <div className="grid gap-5 sm:grid-cols-2">
        <GlassCard hover={false} variant="default">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-400/25">
            <Mail className="h-5 w-5 text-violet-300" />
          </span>
          <h3 className="mt-5 text-lg font-semibold text-white">Email support</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            For non-urgent requests, documentation, or detailed questions. We typically respond within
            one business day.
          </p>
          <Button href="/contact" variant="secondary" size="md" className="mt-5">
            Contact us
          </Button>
        </GlassCard>
        <GlassCard hover={false} variant="default">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 ring-1 ring-amber-400/25">
            <MessageCircle className="h-5 w-5 text-amber-200" />
          </span>
          <h3 className="mt-5 text-lg font-semibold text-white">Project-specific help</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Your project manager can help with scope, timelines, and deliverables. Reach out via your
            usual channel.
          </p>
          <p className="mt-4 text-sm text-zinc-500">
            Need to escalate? Use the contact form and we’ll route you to the right person.
          </p>
        </GlassCard>
      </div>
      <section>
        <SectionTitle
          eyebrow="History"
          description="Filter by status to focus on open work or review closed threads."
        >
          Your requests
        </SectionTitle>
        {requests.length > 0 ? (
          <>
            <p className="mt-2 text-sm text-zinc-500">
              {filteredRequests.length} request{filteredRequests.length !== 1 ? "s" : ""}
              {view !== "all" && ` · ${view}`}
            </p>
            <div className="mt-4 inline-flex flex-wrap gap-1 rounded-xl border border-white/10 bg-black/30 p-1 ring-1 ring-white/5">
              {VIEWS.map((v) => (
                <Link
                  key={v.value}
                  href={`/dashboard/support?view=${v.value}`}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-semibold transition-all",
                    view === v.value
                      ? "bg-indigo-500/20 text-white ring-1 ring-indigo-400/35"
                      : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                  )}
                >
                  {v.label}
                </Link>
              ))}
            </div>
            {filteredRequests.length > 0 ? (
              <ul className="mt-5 space-y-3">
                {filteredRequests.map((r) => (
                  <li key={r.id}>
                    <GlassCard hover={false} variant="default" className="py-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-white">{r.subject}</span>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            requestStatusPill(r.status)
                          )}
                        >
                          {supportRequestStatusLabels[r.status] ?? r.status}
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-medium text-zinc-600">
                        {formatDisplayDate(r.createdAt)}
                      </p>
                    </GlassCard>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-sm text-zinc-500">No requests in this view.</p>
            )}
          </>
        ) : (
          <EmptyState
            icon={MessageCircle}
            title="No requests yet"
            description="You haven’t submitted any support requests. Use the form above to get help, request changes, or ask a question—we’ll respond via email or through this portal."
            className="mt-6"
          />
        )}
      </section>
    </div>
  );
}
