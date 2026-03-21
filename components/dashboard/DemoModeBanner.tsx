"use client";

import { Info, Sparkles } from "lucide-react";
import { useDemoPortal } from "./DemoPortalProvider";

const tips = [
  {
    label: "Metrics",
    title:
      "Impact numbers are derived from project metrics and activity in your account. In production they reflect real automation performance.",
  },
  {
    label: "Roadmap",
    title:
      "The roadmap lists implementation steps toward go-live. Dates may shift as your team refines scope.",
  },
  {
    label: "Billing",
    title:
      "Invoices and payment links mirror what your account team sets up. Demo amounts are for illustration only.",
  },
] as const;

/** Subtle strip below the portal header when viewing a demo-linked client. */
export function DemoModeBanner() {
  const isDemo = useDemoPortal();
  if (!isDemo) return null;

  return (
    <div className="mb-8 rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/[0.08] via-amber-500/[0.04] to-transparent px-4 py-3 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-start gap-3 sm:items-center">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-200">
            <Sparkles className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-amber-100">
              You are viewing a demo account
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-amber-200/70">
              Data is for showcasing the portal—your production workspace will look like this with your real projects.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-amber-500/15 pt-3 sm:border-0 sm:pt-0">
          {tips.map(({ label, title }) => (
            <span
              key={label}
              className="inline-flex cursor-help items-center gap-1.5 text-xs font-medium text-amber-200/90"
              title={title}
            >
              <Info className="h-3.5 w-3.5 shrink-0 text-amber-300/80" aria-hidden />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
