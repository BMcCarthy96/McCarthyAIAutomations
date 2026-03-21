import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupportRequestById } from "@/lib/admin-data";
import { SupportRequestStatusForm } from "@/components/admin/SupportRequestStatusForm";
import { SupportRequestReplyForm } from "@/components/admin/SupportRequestReplyForm";
import { LeadFollowUpSuppressionForm } from "@/components/admin/LeadFollowUpSuppressionForm";
import { LeadFollowUpListBadge } from "@/components/admin/LeadFollowUpListBadge";
import { supportRequestStatusLabels } from "@/lib/data";
import { formatDisplayDate } from "@/lib/utils";
import type { AdminSupportDetail } from "@/lib/support/types";
import type { AdminLeadFollowUpListState } from "@/lib/support/types";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Mail,
  Sparkles,
  User,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Support request | Admin",
  description: "View and update support request.",
};

function leadFollowUpStateFromDetail(
  r: AdminSupportDetail
): AdminLeadFollowUpListState | null {
  if (r.source !== "public") return null;
  if (!r.leadFollowUpEligible) return "ineligible";
  if (r.followUpSentAt) return "sent";
  if (r.leadFollowUpSuppressed) return "suppressed";
  if (r.status === "open" || r.status === "in_progress") return "pending";
  return "closed_before_send";
}

function leadFollowUpDescription(
  r: AdminSupportDetail,
  state: AdminLeadFollowUpListState | null
): string {
  if (state === null) return "";
  switch (state) {
    case "pending":
      return "Queued for the automated booking reminder (manual batch or cron).";
    case "sent":
      return `Booking reminder sent ${formatDisplayDate(r.followUpSentAt!)}.`;
    case "suppressed":
      return "Automated follow-up is turned off for this lead. Re-enable below if you want them back in the queue.";
    case "ineligible":
      return "Not in the automation pipeline (legacy or pre-automation submission).";
    case "closed_before_send":
      return "Request was resolved or closed before a follow-up was sent.";
    default:
      return "";
  }
}

export default async function AdminSupportRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = await getSupportRequestById(id);
  if (!request) notFound();

  const leadState = leadFollowUpStateFromDetail(request);
  const leadDescription = leadFollowUpDescription(request, leadState);

  return (
    <div className="space-y-8">
      <Link
        href="/admin/support"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to support
      </Link>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {request.source === "public" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-gradient-to-r from-amber-500/15 to-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-100">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Consultation lead
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-100">
              <Building2 className="h-3.5 w-3.5" aria-hidden />
              Client support
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-medium text-zinc-300">
            <Calendar className="h-3.5 w-3.5 text-zinc-500" aria-hidden />
            {formatDisplayDate(request.createdAt)}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium capitalize text-zinc-300">
            {(supportRequestStatusLabels as Record<string, string>)[
              request.status
            ] ?? request.status.replace(/_/g, " ")}
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {request.subject}
        </h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Primary column */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Contact & context
            </h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              {request.source === "client" && request.clientName && (
                <div className="sm:col-span-2">
                  <dt className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                    <Building2 className="h-3.5 w-3.5" aria-hidden />
                    Client
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-white">
                    {request.clientName}
                  </dd>
                </div>
              )}
              {request.source === "public" &&
                (request.requesterName || request.requesterEmail) && (
                  <div className="sm:col-span-2">
                    <dt className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                      <User className="h-3.5 w-3.5" aria-hidden />
                      Lead contact
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-white">
                      {[request.requesterName, request.requesterEmail]
                        .filter(Boolean)
                        .join(" · ")}
                    </dd>
                  </div>
                )}
              <div>
                <dt className="text-xs font-medium text-zinc-500">Project</dt>
                <dd className="mt-1 text-sm text-zinc-200">
                  {request.projectName ?? "—"}
                </dd>
              </div>
              {request.source === "public" && request.requesterEmail && (
                <div>
                  <dt className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                    <Mail className="h-3.5 w-3.5" aria-hidden />
                    Reply-to email
                  </dt>
                  <dd className="mt-1 font-mono text-sm text-indigo-200/90">
                    {request.requesterEmail}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {request.body && (
            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-5 sm:p-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Original message
              </h2>
              <div className="mt-3 rounded-xl border border-white/[0.06] bg-black/20 p-4 text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap">
                {request.body}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Thread
            </h2>
            {request.replies.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-500">No replies yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {request.replies.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                      <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 font-medium text-indigo-200">
                        {r.senderType === "admin" ? "Team" : r.senderType}
                      </span>
                      <span>{formatDisplayDate(r.createdAt)}</span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-300 whitespace-pre-wrap">
                      {r.body}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Sidebar: pipeline + actions */}
        <div className="space-y-6 lg:col-span-1">
          {request.source === "public" && request.leadFollowUpEligible && (
            <div className="rounded-2xl border border-amber-400/20 bg-gradient-to-b from-amber-500/[0.07] to-transparent p-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-200/80">
                Lead follow-up
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <LeadFollowUpListBadge state={leadState} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                {leadDescription}
              </p>
              {!request.followUpSentAt && (
                <div className="mt-5 border-t border-white/10 pt-5">
                  <p className="text-xs font-medium text-zinc-500">
                    Automation control
                  </p>
                  <div className="mt-2">
                    <LeadFollowUpSuppressionForm
                      requestId={request.id}
                      suppressed={request.leadFollowUpSuppressed}
                      showDisable={!request.leadFollowUpSuppressed}
                      showReEnable={request.leadFollowUpSuppressed}
                    />
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-zinc-500">
                    Disabling excludes this lead from batch and cron only.
                  </p>
                </div>
              )}
            </div>
          )}

          {request.source === "public" && !request.leadFollowUpEligible && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Lead follow-up
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Not in the automation pipeline (legacy submission).
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Send reply
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              {request.source === "public"
                ? "Email goes to the lead’s address below."
                : "Email goes to the client’s portal email."}
            </p>
            <div className="mt-4">
              <SupportRequestReplyForm
                requestId={request.id}
                replyToHint={
                  request.source === "public"
                    ? request.requesterEmail
                    : request.clientEmail
                }
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Request status
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Update when the conversation is resolved or closed.
            </p>
            <div className="mt-4">
              <SupportRequestStatusForm
                requestId={request.id}
                currentStatus={request.status}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
