import { CalendarClock, LineChart, Rocket } from "lucide-react";
import { howItWorksSteps } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";

const stepIcons = [CalendarClock, Rocket, LineChart] as const;

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="How it works"
          subtitle="From first conversation to automation in production—with a measurable reporting loop your team can trust."
        />
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {howItWorksSteps.map((step, i) => {
            const Icon = stepIcons[i] ?? CalendarClock;
            return (
              <div
                key={step.step}
                className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-colors hover:border-indigo-500/25"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-bold text-zinc-400">
                    {step.step}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
