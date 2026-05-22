"use client";

import { CalendarClock, LineChart, Rocket } from "lucide-react";
import { howItWorksSteps } from "@/lib/data";
import { AnimateIn, StaggerIn } from "@/components/ui/AnimateIn";

const stepIcons = [CalendarClock, Rocket, LineChart] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-28 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimateIn>
          <div className="text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              The process
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How it works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
              From first conversation to automation in production, with a measurable
              reporting loop your team can trust.
            </p>
          </div>
        </AnimateIn>

        <StaggerIn className="mt-10 grid gap-6 md:grid-cols-3" stagger={0.15}>
          {howItWorksSteps.map((step, i) => {
            const Icon = stepIcons[i] ?? CalendarClock;
            return (
              <div
                key={step.step}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/25 hover:bg-white/[0.05] hover:-translate-y-1"
              >
                {/* Step number — top right */}
                <span className="absolute right-5 top-5 font-mono text-xs font-bold text-zinc-700">
                  0{step.step}
                </span>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300 transition-colors group-hover:bg-blue-500/20">
                  <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.description}</p>
              </div>
            );
          })}
        </StaggerIn>
      </div>
    </section>
  );
}
