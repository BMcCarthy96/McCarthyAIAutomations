import Link from "next/link";
import { BarChart3, Check, Circle, LayoutDashboard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "./SectionHeading";

/** Illustrative metrics for marketing preview only (not live client data). */
const previewMetrics = [
  { label: "Hours saved (30d)", value: "142", accent: "text-emerald-400" },
  { label: "Leads captured", value: "186", accent: "text-indigo-300" },
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
    <section className="border-y border-white/10 bg-zinc-950/40 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Your command center—not a black box"
          subtitle="Clients get a premium portal: live project status, onboarding checkpoints, support threads, billing, and a rolling monthly impact view. You see the same rigor we bring to delivery."
        />

        <div className="mt-14 lg:mt-16">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/90 to-zinc-950 shadow-2xl shadow-indigo-950/40 ring-1 ring-white/5">
            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-black/40 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              <div className="ml-4 flex flex-1 items-center justify-center gap-2 sm:justify-start">
                <LayoutDashboard className="h-3.5 w-3.5 text-zinc-500" />
                <span className="text-xs font-medium text-zinc-500">
                  Client portal · preview
                </span>
              </div>
              <span className="hidden rounded-md bg-indigo-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-300 sm:inline">
                Live metrics
              </span>
            </div>

            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_220px]">
              <div className="space-y-6 p-5 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Monthly impact
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white sm:text-xl">
                      Rolling 30-day performance
                    </p>
                    <p className="mt-1 max-w-md text-sm text-zinc-400">
                      Same reporting your team gets after go-live—summarized for stakeholders who care about outcomes, not ticket counts.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    Impact report ready
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {previewMetrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur-sm"
                    >
                      <p className="text-xs text-zinc-500">{m.label}</p>
                      <p className={`mt-1 text-2xl font-bold tracking-tight ${m.accent}`}>
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Mini bar visualization */}
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                      <BarChart3 className="h-4 w-4 text-indigo-400" />
                      Activity trend (illustrative)
                    </span>
                    <span className="text-xs text-zinc-600">Last 30 days</span>
                  </div>
                  <div className="flex h-24 items-end justify-between gap-1.5 px-1">
                    {[40, 55, 48, 72, 65, 88, 76, 92, 85, 95].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm bg-gradient-to-t from-indigo-600/40 to-indigo-400/70"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Side column — onboarding strip */}
              <div className="border-t border-white/10 bg-black/25 p-5 lg:border-l lg:border-t-0 lg:p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Onboarding status
                </p>
                <ul className="mt-4 space-y-3">
                  {setupSteps.map(({ label, done }) => (
                    <li key={label} className="flex items-center gap-2.5 text-sm">
                      {done ? (
                        <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 text-zinc-600" />
                      )}
                      <span className={done ? "text-zinc-300" : "text-zinc-500"}>{label}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-xs leading-relaxed text-zinc-600">
                  Plus: milestones, project updates, support requests, and Stripe-backed billing—in one place.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:text-left">
            <Button href="/contact" variant="primary" size="lg">
              Get your custom roadmap
            </Button>
            <p className="max-w-sm text-sm text-zinc-500">
              Tell us what you want to automate on the{" "}
              <Link href="/contact" className="font-medium text-indigo-400 underline-offset-2 hover:text-indigo-300 hover:underline">
                consultation form
              </Link>
              —we&apos;ll reply with next steps.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
