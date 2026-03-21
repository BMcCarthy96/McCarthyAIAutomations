import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupportRequestById } from "@/lib/admin-data";
import { SupportRequestStatusForm } from "@/components/admin/SupportRequestStatusForm";
import { SupportRequestReplyForm } from "@/components/admin/SupportRequestReplyForm";
import { LeadFollowUpSuppressionForm } from "@/components/admin/LeadFollowUpSuppressionForm";
import { supportRequestStatusLabels } from "@/lib/data";
import { formatDisplayDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Support request | Admin",
  description: "View and update support request.",
};

export default async function AdminSupportRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = await getSupportRequestById(id);
  if (!request) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/support"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to support
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Support request
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {formatDisplayDate(request.createdAt)}
        </p>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-6">
        <div>
          <p className="text-sm font-medium text-zinc-400">Subject</p>
          <p className="mt-0.5 text-white">{request.subject}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-400">Type</p>
          <p className="mt-0.5">
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                request.source === "public"
                  ? "bg-amber-500/20 text-amber-200"
                  : "bg-indigo-500/20 text-indigo-200"
              }`}
            >
              {request.source === "public" ? "Public submission" : "Client portal"}
            </span>
          </p>
        </div>
        {request.source === "client" && request.clientName && (
          <div>
            <p className="text-sm font-medium text-zinc-400">Client</p>
            <p className="mt-0.5 text-white">{request.clientName}</p>
          </div>
        )}
        {request.source === "public" &&
          (request.requesterName || request.requesterEmail) && (
            <div>
              <p className="text-sm font-medium text-zinc-400">Contact</p>
              <p className="mt-0.5 text-white">
                {[request.requesterName, request.requesterEmail]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          )}
        {request.source === "public" && request.leadFollowUpEligible && (
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm font-medium text-zinc-400">
              Lead follow-up email
            </p>
            <p className="mt-0.5 text-sm text-zinc-300">
              {request.followUpSentAt
                ? `Sent ${formatDisplayDate(request.followUpSentAt)}`
                : request.leadFollowUpSuppressed
                  ? "Suppressed — automated follow-up will not be sent for this lead."
                  : "Eligible — pending send (still open; use Support → Send pending follow-ups or cron)."}
            </p>
            {!request.followUpSentAt && (
              <div className="mt-3">
                <LeadFollowUpSuppressionForm
                  requestId={request.id}
                  suppressed={request.leadFollowUpSuppressed}
                  showDisable={
                    !request.leadFollowUpSuppressed
                  }
                  showReEnable={request.leadFollowUpSuppressed}
                />
                <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                  Disabling stops this lead from receiving the scheduled or batch
                  booking reminder. Does not affect global cron or other leads.
                </p>
              </div>
            )}
          </div>
        )}
        {request.source === "public" && !request.leadFollowUpEligible && (
          <div>
            <p className="text-sm font-medium text-zinc-400">
              Lead follow-up email
            </p>
            <p className="mt-0.5 text-sm text-zinc-300">
              Not eligible (legacy submission or not marked for automation).
            </p>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-zinc-400">Project</p>
          <p className="mt-0.5 text-white">
            {request.projectName ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-400">Status</p>
          <p className="mt-0.5 text-zinc-300">
            {(supportRequestStatusLabels as Record<string, string>)[request.status] ?? request.status}
          </p>
        </div>
        {request.body && (
          <div>
            <p className="text-sm font-medium text-zinc-400">Original message</p>
            <div className="mt-0.5 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-zinc-300 whitespace-pre-wrap">
              {request.body}
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Submitted {formatDisplayDate(request.createdAt)}
            </p>
          </div>
        )}

        <div className="pt-2 border-t border-white/10 space-y-4">
          <p className="text-sm font-medium text-zinc-400">Thread</p>
          {request.replies.length === 0 ? (
            <p className="text-sm text-zinc-500">No replies yet.</p>
          ) : (
            <ul className="space-y-3">
              {request.replies.map((r) => (
                <li
                  key={r.id}
                  className="rounded-lg border border-white/10 bg-white/5 p-4"
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

        <div className="pt-2 border-t border-white/10">
          <p className="mb-3 text-sm font-medium text-zinc-400">Send reply</p>
          <SupportRequestReplyForm
            requestId={request.id}
            replyToHint={
              request.source === "public"
                ? request.requesterEmail
                : request.clientEmail
            }
          />
        </div>

        <div className="pt-2 border-t border-white/10">
          <p className="mb-2 text-sm font-medium text-zinc-400">
            Update status
          </p>
          <SupportRequestStatusForm
            requestId={request.id}
            currentStatus={request.status}
          />
        </div>
      </div>
    </div>
  );
}
