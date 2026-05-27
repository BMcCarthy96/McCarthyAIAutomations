import Link from "next/link";
import { BarChart3, Check, Circle, LayoutDashboard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TryLiveDemoButton } from "@/components/home/TryLiveDemoButton";
import { TryLiveDemoMarketingGate } from "@/components/home/TryLiveDemoMarketingGate";
import { SectionHeading } from "./SectionHeading";

/** Illustrative metrics for marketing preview only (not live client data). */
const previewMetrics = [
  { label: "Hours saved (30d)", value: "142", accent: "text-emerald-400" },
  { label: "Leads captured", value: "186", accent: "text-blue-300" },
  { label: "Est. revenue influenced", value: "$48k", accent: "text-amber-300" },
];

const setupSteps = [
  { label: "Automation live", done: true },
  { label: "Milestones on track", done: true },
  { label: "Reporting enabled", done: true },
  { label: "Next optimization", done: false },
];

export function PortalPreview() {
  return (
    <section className="border-y border-white/10 bg-zinc-950/40 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Your revenue recovery command center"
          subtitle="Every client gets a portal with live workflow status, milestones, support, billing, and a rolling monthly impact view. You can see what changed, what's still running, and what the system recovered."
        />

        <div className="mt-10 lg:mt-12">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/90 to-zinc-950 shadow-2xl shadow-blue-950/40 ring-1 ring-white/5">
            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-black/40 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" aria-hidden />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" aria-hidden />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" aria-hidden />
              <div className="ml-4 flex flex-1 items-center justify-center gap-2 sm:justify-start">
                <LayoutDashboard className="h-3.5 w-3.5 text-slate-500" aria-hidden />
                <span className="text-xs font-medium text-slate-500">
                  Client portal · preview
                </span>
              </div>
              <span className="inline rounded-md bg-zinc-700/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Sample data
              </span>
            </div>

            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_220px]">
              <div className="space-y-6 p-5 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Monthly impact
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white sm:text-xl">
                      Rolling 30-day performance
                    </p>
                    <p className="mt-1 max-w-md text-sm text-slate-400">
                      Same reporting your team gets after go-live, summarized
                      for anyone who cares about outcomes over activity counts.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden />
                    Impact report ready
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {previewMetrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur-sm"
                    >
                      <p className="text-xs text-slate-500">{m.label}</p>
                      <p className={`mt-1 text-2xl font-bold tracking-tight ${m.accent}`}>
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-center text-[10px] leading-relaxed text-slate-600">
                  Illustrative sample metrics for product demonstration only. These figures do not represent verified client outcomes.
                </p>

                {/* Mini bar visualization */}
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-300">
                      <BarChart3 className="h-4 w-4 text-blue-400" aria-hidden />
                      Activity trend (illustrative)
                    </span>
                    <span className="text-xs text-slate-600">Last 30 days</span>
                  </div>
                  <div className="flex h-24 items-end justify-between gap-1.5 px-1" aria-hidden>
                    {[40, 55, 48, 72, 65, 88, 76, 92, 85, 95].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm bg-gradient-to-t from-blue-600/40 to-cyan-400/60"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Side column — onboarding strip */}
              <div className="border-t border-white/10 bg-black/25 p-5 lg:border-l lg:border-t-0 lg:p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Onboarding status
                </p>
                <ul className="mt-4 space-y-3">
                  {setupSteps.map(({ label, done }) => (
                    <li key={label} className="flex items-center gap-2.5 text-sm">
                      {done ? (
                        <Check className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 text-slate-600" aria-hidden />
                      )}
                      <span className={done ? "text-slate-300" : "text-slate-500"}>
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-xs leading-relaxed text-slate-600">
                  Plus: milestones, project updates, support requests, and
                  Stripe-backed billing, all in one place.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
            <Button href="/contact" variant="primary" size="lg">
              Book a Free Revenue Leak Audit
            </Button>
            <p className="max-w-sm text-sm text-slate-500">
              Tell us where revenue may be slipping on the{" "}
              <Link
                href="/contact"
                className="font-medium text-blue-400 underline-offset-2 hover:text-blue-300 hover:underline"
              >
                audit request form
              </Link>{" "}
              and we&apos;ll reply personally within one business day.
            </p>
          </div>
          <TryLiveDemoMarketingGate>
            <div className="mx-auto mt-8 max-w-md border-t border-white/[0.06] pt-8 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                See it live
              </p>
              <div className="mt-3 flex justify-center">
                <TryLiveDemoButton
                  gated={false}
                  variant="ghost"
                  size="md"
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-blue-200/90 ring-1 ring-white/[0.04] transition-colors hover:border-blue-400/20 hover:bg-blue-500/10 hover:text-blue-100"
                />
              </div>
            </div>
          </TryLiveDemoMarketingGate>
        </div>
      </div>
    </section>
  );
}
