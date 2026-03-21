import type { AdminLeadFollowUpListState } from "@/lib/support/types";
import { cn } from "@/lib/utils";

const LABELS: Record<AdminLeadFollowUpListState, string> = {
  pending: "Pending",
  sent: "Sent",
  suppressed: "Suppressed",
  ineligible: "N/A",
  closed_before_send: "Closed",
};

/** Admin support list: compact follow-up pipeline state for public consultation rows. */
export function LeadFollowUpListBadge({
  state,
}: {
  state: AdminLeadFollowUpListState | null;
}) {
  if (state === null) {
    return (
      <span className="text-xs text-zinc-600 tabular-nums" title="Client portal">
        —
      </span>
    );
  }

  const styles: Record<AdminLeadFollowUpListState, string> = {
    pending:
      "border-amber-400/25 bg-amber-500/12 text-amber-100 shadow-[0_0_20px_-12px_rgba(245,158,11,0.5)]",
    sent: "border-emerald-400/25 bg-emerald-500/12 text-emerald-100",
    suppressed: "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
    ineligible: "border-white/10 bg-white/[0.04] text-zinc-500",
    closed_before_send:
      "border-violet-400/20 bg-violet-500/10 text-violet-200/90",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-tight",
        styles[state]
      )}
      title={
        state === "closed_before_send"
          ? "Resolved or closed before automated follow-up was sent"
          : state === "ineligible"
            ? "Legacy or not in automation pipeline"
            : undefined
      }
    >
      {LABELS[state]}
    </span>
  );
}
