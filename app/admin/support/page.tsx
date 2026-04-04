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
import { LeadAiListBadge } from "@/components/admin/LeadAiListBadge";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AD } from "@/components/admin/admin-ui";
import { Sparkles, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

const LEAD_TEMP_VALUES = ["hot", "warm", "cold", "unknown"] as const;
type LeadTempFilter = (typeof LEAD_TEMP_VALUES)[number];

function parseLeadTempParam(
  v: string | undefined
): LeadTempFilter | undefined {
  if (v == null || v === "") return undefined;
  if ((LEAD_TEMP_VALUES as readonly string[]).includes(v)) {
    return v as LeadTempFilter;
  }
  return undefined;
}

export default async function AdminSupportPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; leadTemp?: string }>;
}) {
  const { view: viewParam, leadTemp: leadTempRaw } = await searchParams;
  const view: SupportRequestListView = isValidView(viewParam)
    ? viewParam
    : "active";
  const leadTempFilter = parseLeadTempParam(leadTempRaw);

  const [allRequests, pendingFollowUps, hasBookingUrl] = await Promise.all([
    getAllSupportRequests(view),
    countPendingLeadFollowUps(),
    Promise.resolve(Boolean(getBookingUrl())),
  ]);

  const requests =
    leadTempFilter == null
      ? allRequests
      : allRequests.filter(
          (r) =>
            r.source === "client" || r.aiLeadTemperature === leadTempFilter
        );

  const publicLeads = allRequests.filter((r) => r.source === "public");
  const aiTempCounts = {
    hot: publicLeads.filter((r) => r.aiLeadTemperature === "hot").length,
    warm: publicLeads.filter((r) => r.aiLeadTemperature === "warm").length,
    cold: publicLeads.filter((r) => r.aiLeadTemperature === "cold").length,
    unknown: publicLeads.filter(
      (r) =>
        r.aiLeadTemperature === "unknown" || r.aiLeadTemperature === null
    ).length,
  };

  return (
    <div className={AD.pageStack}>
      <PageHeader
        eyebrow="Inbox"
        title="Support requests"
        subtitle={`${requests.length} request${requests.length !== 1 ? "s" : ""}${view !== "all" ? ` · ${view}` : ""}${leadTempFilter ? ` · ${leadTempFilter} priority` : ""} — consultation leads and client portal threads.`}
      />

      {publicLeads.length > 0 && (
        <p className="text-xs leading-relaxed text-zinc-500">
          <span className="font-medium text-zinc-400">Consultation AI (this view):</span>{" "}
          <span className="text-rose-200/90">Hot {aiTempCounts.hot}</span>
          {" · "}
          <span className="text-amber-200/90">Warm {aiTempCounts.warm}</span>
          {" · "}
          <span className="text-sky-200/80">Cold {aiTempCounts.cold}</span>
          {" · "}
          <span className="text-zinc-500">Unknown / pending {aiTempCounts.unknown}</span>
        </p>
      )}

      <section className="rounded-xl border border-indigo-400/15 bg-gradient-to-br from-indigo-500/[0.07] to-transparent p-5 ring-1 ring-white/[0.04] shadow-[0_8px_32px_-20px_rgba(0,0,0,0.35)] sm:p-6">
        <h2 className="text-sm font-semibold tracking-tight text-white">
          Consultation lead follow-up
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-zinc-400">
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

      <div className={AD.filterWrap}>
        {VIEWS.map((v) => (
          <Link
            key={v.value}
            href={`/admin/support?view=${v.value}${leadTempFilter ? `&leadTemp=${leadTempFilter}` : ""}`}
            className={view === v.value ? AD.filterOn : AD.filterOff}
          >
            {v.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-zinc-500">AI temp:</span>
        <Link
          href={`/admin/support?view=${view}`}
          className={cn(
            "text-xs",
            leadTempFilter == null ? AD.filterOn : AD.filterOff
          )}
        >
          All
        </Link>
        {LEAD_TEMP_VALUES.map((t) => (
          <Link
            key={t}
            href={`/admin/support?view=${view}&leadTemp=${t}`}
            className={cn(
              "text-xs capitalize",
              leadTempFilter === t ? AD.filterOn : AD.filterOff
            )}
          >
            {t}
          </Link>
        ))}
      </div>

      <div className={AD.tableOuter}>
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className={AD.theadRow}>
              <th className={AD.th}>Subject</th>
              <th className={AD.th}>From</th>
              <th className={AD.th}>Source</th>
              <th className={AD.th}>Lead follow-up</th>
              <th className={AD.th}>AI</th>
              <th className={AD.th}>Status</th>
              <th className={AD.th}>Created</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr
                key={r.id}
                className={cn(
                  AD.tbodyTr,
                  r.source === "public"
                    ? "bg-amber-500/[0.02] hover:bg-amber-500/[0.05]"
                    : ""
                )}
              >
                <td className={`${AD.td} align-top font-medium text-white`}>
                  <Link
                    href={`/admin/support/${r.id}`}
                    className="transition-colors hover:text-indigo-400"
                  >
                    {r.subject}
                  </Link>
                </td>
                <td className={`${AD.td} max-w-[200px] align-top text-zinc-300`}>
                  <span className="line-clamp-2 break-words">
                    {r.source === "public"
                      ? r.publicContact ?? "—"
                      : r.clientName ?? "—"}
                  </span>
                </td>
                <td className={`${AD.td} align-top`}>
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
                <td className={`${AD.td} align-top`}>
                  <LeadFollowUpListBadge state={r.leadFollowUp} />
                </td>
                <td className={`${AD.td} align-top`}>
                  <LeadAiListBadge
                    source={r.source}
                    status={r.aiLeadAnalysisStatus}
                    temperature={r.aiLeadTemperature}
                  />
                </td>
                <td className={`${AD.td} align-top capitalize text-zinc-400`}>
                  {r.status.replace(/_/g, " ")}
                </td>
                <td className={`${AD.td} whitespace-nowrap align-top text-zinc-500`}>
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
