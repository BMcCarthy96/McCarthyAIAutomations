import { Button } from "@/components/ui/Button";
import { TryLiveDemoButton } from "@/components/home/TryLiveDemoButton";
import { TryLiveDemoMarketingGate } from "@/components/home/TryLiveDemoMarketingGate";

export function CTABanner() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/[0.12] via-purple-500/[0.08] to-transparent p-8 text-center backdrop-blur-xl sm:p-12">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready for automation that shows up on the P&amp;L?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">
            Book a free consultation. We&apos;ll align on goals, tools, and timelines—then send a
            clear proposal so you know exactly what ships, when, and how we&apos;ll measure success.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/contact" variant="primary" size="lg">
              Book your free consultation
            </Button>
            <Button href="/services" variant="secondary" size="lg">
              Review services first
            </Button>
          </div>
          <p className="mt-6 text-sm text-zinc-600">
            Prefer email? Use the{" "}
            <a href="/contact" className="text-zinc-400 underline-offset-2 hover:text-white hover:underline">
              contact form
            </a>{" "}
            — same team, same response time.
          </p>
          <TryLiveDemoMarketingGate>
            <div className="mx-auto mt-8 max-w-sm border-t border-white/[0.06] pt-8">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Explore the portal
              </p>
              <div className="mt-3 flex justify-center">
                <TryLiveDemoButton
                  gated={false}
                  variant="ghost"
                  size="md"
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-indigo-200/90 ring-1 ring-white/[0.04] transition-colors hover:border-indigo-400/25 hover:bg-indigo-500/10 hover:text-indigo-100"
                />
              </div>
            </div>
          </TryLiveDemoMarketingGate>
        </div>
      </div>
    </section>
  );
}
