/**
 * Shared admin UI tokens — aligns with client portal (glass, soft rings, restrained gradients).
 * Use for tables, cards, and filter bars only; keep forms/components unchanged.
 */

export const AD = {
  /** Page vertical rhythm */
  pageStack: "space-y-10",
  sectionStack: "space-y-8",
  /** Primary content card (forms, panels) */
  card: "rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-transparent p-6 ring-1 ring-white/[0.04] shadow-[0_8px_32px_-20px_rgba(0,0,0,0.4)]",
  /** Data tables */
  tableOuter:
    "overflow-x-auto rounded-xl border border-white/[0.08] bg-white/[0.03] ring-1 ring-white/[0.04] shadow-[0_12px_40px_-24px_rgba(0,0,0,0.45)]",
  theadRow: "border-b border-white/[0.08] bg-white/[0.04]",
  th: "px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500",
  tbodyTr:
    "border-b border-white/[0.05] last:border-0 transition-colors hover:bg-white/[0.02]",
  td: "px-4 py-3.5",
  /** Filter / view toggles */
  filterWrap:
    "inline-flex flex-wrap gap-1 rounded-xl border border-white/[0.08] bg-black/25 p-1 ring-1 ring-white/[0.04]",
  filterOn:
    "rounded-lg bg-indigo-500/20 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-indigo-400/25",
  filterOff:
    "rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-zinc-200",
} as const;

/** Project delivery status — compact pill for admin tables. */
export function adminProjectStatusClass(status: string): string {
  switch (status) {
    case "active":
      return "border border-emerald-400/25 bg-emerald-500/12 text-emerald-100";
    case "in_progress":
      return "border border-amber-400/25 bg-amber-500/12 text-amber-100";
    case "pending":
      return "border border-zinc-500/25 bg-white/[0.06] text-zinc-200";
    case "completed":
      return "border border-indigo-400/22 bg-indigo-500/12 text-indigo-100";
    default:
      return "border border-white/10 bg-white/[0.05] text-zinc-300";
  }
}
