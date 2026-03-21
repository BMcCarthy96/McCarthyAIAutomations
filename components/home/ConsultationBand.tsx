import { Button } from "@/components/ui/Button";

export function ConsultationBand() {
  return (
    <section className="border-y border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Not sure where to start?
          </h2>
          <p className="mt-2 text-sm text-zinc-400 sm:text-base">
            Book a free consultation—we&apos;ll help you prioritize what to automate first and what to measure after launch.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Button href="/contact" variant="primary" size="lg">
            Book free consultation
          </Button>
          <Button href="/pricing" variant="outline" size="lg">
            See pricing
          </Button>
        </div>
      </div>
    </section>
  );
}
