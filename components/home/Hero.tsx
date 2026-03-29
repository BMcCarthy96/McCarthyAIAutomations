import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TryLiveDemoButton } from "@/components/home/TryLiveDemoButton";
import { TryLiveDemoMarketingGate } from "@/components/home/TryLiveDemoMarketingGate";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-20 pb-20 sm:px-6 sm:pt-28 sm:pb-28 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.18),transparent)]" />
      <div className="pointer-events-none absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-4xl text-center">
        <p className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-indigo-300">
          Premium AI operations for growing teams
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
          Reclaim your week.{" "}
          <span className="bg-gradient-to-r from-indigo-300 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Fill your pipeline.
          </span>{" "}
          Prove the ROI.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
          McCarthy AI Automations designs and runs voice agents, chatbots, lead capture, and custom
          workflows—then gives you a client portal with onboarding, support, billing, and{" "}
          <span className="text-zinc-300">monthly impact reporting</span> so leadership sees real
          numbers, not slide decks.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button href="/contact" variant="primary" size="lg" className="w-full min-w-[220px] sm:w-auto">
            Book your free consultation
          </Button>
          <Button href="/services" variant="secondary" size="lg" className="w-full sm:w-auto">
            Explore services
          </Button>
          <Link
            href="/#how-it-works"
            className={cn(
              "inline-flex w-full items-center justify-center rounded-xl border border-white/15 px-6 py-3 text-base font-semibold text-zinc-200 transition-colors",
              "hover:border-white/25 hover:bg-white/5 hover:text-white sm:w-auto"
            )}
          >
            See how it works
          </Link>
        </div>
        <p className="mt-6 text-sm text-zinc-600">
          No obligation—just a clear plan for what to automate and what it should deliver.
        </p>

        <TryLiveDemoMarketingGate>
          <div className="mx-auto mt-10 max-w-md border-t border-white/[0.06] pt-10">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Prefer to explore first?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              Open the client portal with curated sample data—no forms, no pitch.
            </p>
            <div className="mt-5 flex justify-center">
              <TryLiveDemoButton
                gated={false}
                variant="ghost"
                size="md"
                className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-2.5 text-sm font-semibold text-indigo-200/95 ring-1 ring-white/[0.04] transition-colors hover:border-indigo-400/25 hover:bg-indigo-500/10 hover:text-indigo-100"
              />
            </div>
          </div>
        </TryLiveDemoMarketingGate>
      </div>
    </section>
  );
}
