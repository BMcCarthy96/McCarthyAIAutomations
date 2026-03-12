import { Button } from "@/components/ui/Button";

export function CTABanner() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-8 text-center backdrop-blur-xl sm:p-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to automate?
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Book a free consultation. We&apos;ll map your goals to the right
            services and give you a clear path forward.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/contact" variant="primary" size="lg">
              Book a call
            </Button>
            <Button href="/pricing" variant="secondary" size="lg">
              View pricing
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
