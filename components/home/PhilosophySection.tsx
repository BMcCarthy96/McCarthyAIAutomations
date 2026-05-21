"use client";

import { AnimateIn } from "@/components/ui/AnimateIn";

export function PhilosophySection() {
  return (
    <section className="relative overflow-hidden bg-[#03070f] py-28 sm:py-36">
      {/* Top and bottom border lines */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"
        aria-hidden
      />

      {/* Ambient radial glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(37,99,235,0.07),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <AnimateIn delay={0}>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-600">
            Our philosophy
          </p>
        </AnimateIn>

        <AnimateIn delay={0.05}>
          <p className="mt-8 text-xl text-zinc-500 sm:text-2xl">
            Most automation agencies focus on technology.
          </p>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            We focus on{" "}
            <em
              className="font-drama italic"
              style={{
                backgroundImage: "linear-gradient(135deg, #60a5fa 0%, #38bdf8 60%, #a5f3fc 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              revenue.
            </em>
          </h2>
        </AnimateIn>

        <AnimateIn delay={0.15}>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-500">
            Every system we build is tied to a measurable business outcome, not
            vanity metrics. Real revenue recovered. Real leads captured. Real
            hours returned to your team.
          </p>
        </AnimateIn>

        {/* Divider stats */}
        <AnimateIn delay={0.2}>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-8 border-t border-white/[0.06] pt-16">
            {[
              { value: "2–4 wks", label: "First system live" },
              { value: "24/7", label: "Automated coverage" },
              { value: "100%", label: "Outcome-focused" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-white sm:text-3xl">{value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-600">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
