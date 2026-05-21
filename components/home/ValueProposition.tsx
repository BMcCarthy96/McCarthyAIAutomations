"use client";

import { BarChart3, TrendingUp, Workflow } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AnimateIn, StaggerIn } from "@/components/ui/AnimateIn";

const pillars = [
  {
    icon: TrendingUp,
    iconColor: "text-blue-300",
    iconBg: "bg-blue-500/15",
    accentBorder: "hover:border-blue-500/25",
    title: "Recover Lost Revenue",
    body: "Find and fix the missed leads, slow follow-ups, stale deals, and workflow gaps quietly costing your business money. We identify the leaks and build systems to close them.",
  },
  {
    icon: Workflow,
    iconColor: "text-cyan-300",
    iconBg: "bg-cyan-500/15",
    accentBorder: "hover:border-cyan-500/25",
    title: "Built Around Your Workflow",
    body: "We map how your business operates, find where it breaks, and build around your existing tools. You keep using what works.",
  },
  {
    icon: BarChart3,
    iconColor: "text-emerald-300",
    iconBg: "bg-emerald-500/15",
    accentBorder: "hover:border-emerald-500/25",
    title: "Measurable, Ongoing Results",
    body: "Your client portal tracks response times, booked calls, and recovered deals. We build every system to show what changed.",
  },
] as const;

export function ValueProposition() {
  return (
    <section className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_70%_50%,rgba(37,99,235,0.07),transparent)]" />
      <div className="relative mx-auto max-w-7xl">
        <AnimateIn>
          <div className="text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Why McCarthy AI
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Why businesses choose McCarthy AI
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
              We don&apos;t sell AI tools. We find where revenue is slipping and build systems to recover it.
            </p>
          </div>
        </AnimateIn>

        <StaggerIn className="mt-14 grid gap-6 sm:grid-cols-3" stagger={0.14}>
          {pillars.map(({ icon: Icon, iconColor, iconBg, accentBorder, title, body }) => (
            <div
              key={title}
              className={`rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition-all duration-300 ${accentBorder} hover:bg-white/[0.05] hover:-translate-y-1`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
                <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{body}</p>
            </div>
          ))}
        </StaggerIn>

        <AnimateIn delay={0.1}>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/contact" variant="primary" size="lg" className="btn-magnetic">
              Book a Free Revenue Leak Audit
            </Button>
            <Button href="/services" variant="secondary" size="lg">
              See what revenue leaks we fix
            </Button>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
