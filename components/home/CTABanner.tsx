import { Button } from "@/components/ui/Button";
import { TryLiveDemoButton } from "@/components/home/TryLiveDemoButton";
import { TryLiveDemoMarketingGate } from "@/components/home/TryLiveDemoMarketingGate";

export function CTABanner() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/[0.14] via-blue-400/[0.07] to-transparent p-8 text-center backdrop-blur-xl sm:p-12">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to find out where revenue is slipping through?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            The audit is free. We&apos;ll review your lead capture, follow-up, and
            pipeline workflow, then send back a clear map of the biggest
            recovery opportunities and a recommended first step.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/contact" variant="primary" size="lg">
              Book a Free Revenue Leak Audit
            </Button>
            <Button href="/services" variant="secondary" size="lg">
              See what revenue leaks we fix
            </Button>
          </div>
          <p className="mt-6 text-sm text-slate-600">
            Prefer email?{" "}
            <a
              href="/contact"
              className="text-slate-400 underline-offset-2 hover:text-white hover:underline"
            >
              Use the contact form.
            </a>{" "}
            Same team, same response time.
          </p>
          <TryLiveDemoMarketingGate>
            <div className="mx-auto mt-8 max-w-sm border-t border-white/[0.06] pt-8">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Explore the portal
              </p>
              <div className="mt-3 flex justify-center">
                <TryLiveDemoButton
                  gated={false}
                  variant="ghost"
                  size="md"
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-blue-200/90 ring-1 ring-white/[0.04] transition-colors hover:border-blue-400/25 hover:bg-blue-500/10 hover:text-blue-100"
                />
              </div>
            </div>
          </TryLiveDemoMarketingGate>
        </div>
      </div>
    </section>
  );
}
