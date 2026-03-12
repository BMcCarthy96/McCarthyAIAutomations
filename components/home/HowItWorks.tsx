import { howItWorksSteps } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";

export function HowItWorks() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="How it works"
          subtitle="A clear process from first call to launch—no surprises, no scope creep."
        />
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {howItWorksSteps.map((step) => (
            <div
              key={step.step}
              className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-lg font-bold text-indigo-400">
                {step.step}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
