import { Button } from "@/components/ui/Button";

export function ConsultationBand() {
  return (
    <section className="border-y border-blue-500/20 bg-gradient-to-r from-blue-600/10 via-cyan-500/5 to-transparent px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Not sure where your revenue is leaking?
          </h2>
          <p className="mt-2 text-sm text-zinc-400 sm:text-base">
            The audit is free. We&apos;ll review your workflow, map the gaps, and send a clear recommendation. You decide what to do from there.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Button href="/contact" variant="primary" size="lg">
            Book a Free Revenue Leak Audit
          </Button>
          <Button href="/pricing" variant="outline" size="lg">
            See pricing
          </Button>
        </div>
      </div>
    </section>
  );
}
