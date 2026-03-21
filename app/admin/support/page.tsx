import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllSupportRequests,
  type SupportRequestListView,
} from "@/lib/admin-data";
import { formatDisplayDate } from "@/lib/utils";
import { countPendingLeadFollowUps } from "@/lib/lead-follow-up";
import { getBookingUrl } from "@/lib/booking-url";
import { SendLeadFollowUpsForm } from "@/components/admin/SendLeadFollowUpsForm";
import { LeadFollowUpListBadge } from "@/components/admin/LeadFollowUpListBadge";
import { Sparkles, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Support | Admin",
  description: "View all support requests.",
};

const VIEWS: { value: SupportRequestListView; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
  { value: "all", label: "All" },
];

function isValidView(v: string | undefined): v is SupportRequestListView {
  return v === "active" || v === "resolved" || v === "closed" || v === "all";
}

export default async function AdminSupportPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view: viewParam } = await searchParams;
  const view: SupportRequestListView = isValidView(viewParam)
    ? viewParam
    : "active";
  const [requests, pendingFollowUps, hasBookingUrl] = await Promise.all([
    getAllSupportRequests(view),
    countPendingLeadFollowUps(),
    Promise.resolve(Boolean(getBookingUrl())),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Support requests
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {requests.length} request{requests.length !== 1 ? "s" : ""}
          {view !== "all" && ` (${view})`}
        </p>
      </div>

      <section className="rounded-xl border border-indigo-400/15 bg-gradient-to-br from-indigo-500/[0.06] to-transparent p-4 sm:p-5">
        <h2 className="text-sm font-semibold tracking-tight text-white">
          Consultation lead follow-up
        </h2>
        <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
          Batch or cron sends the booking reminder to qualified leads (open
          consultations, not suppressed). Requires Resend + booking URL.
        </p>
        <div className="mt-4">
          <SendLeadFollowUpsForm
            pendingCount={pendingFollowUps}
            hasBookingUrl={hasBookingUrl}
          />
        </div>
      </section>

      <div className="flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
        {VIEWS.map((v) => (
          <Link
            key={v.value}
            href={`/admin/support?view=${v.value}`}
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
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.04]">
              <th className="px-4 py-3 font-medium text-zinc-400">Subject</th>
              <th className="px-4 py-3 font-medium text-zinc-400">From</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Source</th>
              <th className="px-4 py-3 font-medium text-zinc-400">
                Lead follow-up
              </th>
              <th className="px-4 py-3 font-medium text-zinc-400">Status</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Created</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr
                key={r.id}
                className={`border-b border-white/5 last:border-0 transition-colors ${
                  r.source === "public"
                    ? "bg-amber-500/[0.02] hover:bg-amber-500/[0.05]"
                    : "hover:bg-white/[0.03]"
                }`}
              >
                <td className="px-4 py-3.5 align-top font-medium text-white">
                  <Link
                    href={`/admin/support/${r.id}`}
                    className="transition-colors hover:text-indigo-400"
                  >
                    {r.subject}
                  </Link>
                </td>
                <td className="max-w-[200px] px-4 py-3.5 align-top text-zinc-300">
                  <span className="line-clamp-2 break-words">
                    {r.source === "public"
                      ? r.publicContact ?? "—"
                      : r.clientName ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3.5 align-top">
                  {r.source === "public" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-gradient-to-r from-amber-500/15 to-orange-500/10 px-2.5 py-1 text-xs font-semibold text-amber-100 shadow-sm">
                      <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-300/90" />
                      Consultation
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-100">
                      <Building2 className="h-3.5 w-3.5 shrink-0 text-indigo-300/90" />
                      Client portal
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 align-top">
                  <LeadFollowUpListBadge state={r.leadFollowUp} />
                </td>
                <td className="px-4 py-3.5 align-top text-zinc-400 capitalize">
                  {r.status.replace(/_/g, " ")}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 align-top text-zinc-500">
                  {formatDisplayDate(r.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {requests.length === 0 && (
        <p className="text-sm text-zinc-500">No support requests yet.</p>
      )}
    </div>
  );
}
