import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          AI automation that{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            scales your business
          </span>
        </h1>
        <p className="mt-6 text-lg text-zinc-400 sm:text-xl">
          Voice agents, chatbots, lead capture, and custom integrations—so you
          focus on closing deals, not repetitive tasks.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/contact" variant="primary" size="lg">
            Get a free consultation
          </Button>
          <Button href="/services" variant="secondary" size="lg">
            Explore services
          </Button>
        </div>
      </div>
    </section>
  );
}
