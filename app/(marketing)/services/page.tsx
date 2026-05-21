import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { services } from "@/lib/data";
import { getServiceIcon } from "@/lib/serviceIcons";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore our AI automation services: website revamps, voice agents, chatbots, lead capture, CRM automation, and custom integrations.",
};

export default function ServicesPage() {
  return (
    <div>
      <PageHero
        label="What we build"
        title="AI automation for"
        titleAccent="every growth lever."
        subtitle="End-to-end systems tailored to your business. Pick one or combine several for a connected automation stack."
      />

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = getServiceIcon(service.icon);
            return (
              <GlassCard key={service.id} href={`/services/${service.slug}`} variant="premium">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {service.tagline}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-blue-400 transition-all hover:-translate-x-0.5">
                  Learn more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </GlassCard>
            );
          })}
        </div>

        <div className="mt-20 rounded-2xl border border-white/[0.07] bg-gradient-to-br from-blue-600/[0.08] to-transparent p-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            Not sure what you need?
          </p>
          <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
            Let&apos;s find your revenue gaps together.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
            Book a free 30-minute consultation. We&apos;ll map your current workflow,
            identify the biggest bottlenecks, and recommend where AI can recover
            the most revenue. No pitch, no pressure.
          </p>
          <Button href="/contact" variant="primary" size="lg" className="btn-magnetic mt-8">
            Book a free consultation
          </Button>
        </div>
      </div>
    </div>
  );
}
