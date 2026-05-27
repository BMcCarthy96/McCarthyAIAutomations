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
    "AI workflow consulting for lead handling, follow-up, booking handoffs and operational bottlenecks. Starting with a paid AI Revenue Leak Audit and Automation Roadmap.",
};

export default function ServicesPage() {
  return (
    <div>
      <PageHero
        label="What revenue leaks we fix"
        title="Workflow consulting for"
        titleAccent="every revenue gap."
        subtitle="Each service addresses a specific workflow gap. Start with a paid AI Revenue Leak Audit to identify which ones apply to your situation."
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
            Not sure which gap to fix first?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
            New engagements begin with a brief fit conversation. If there is a worthwhile
            workflow gap to address, the paid AI Revenue Leak Audit and Automation Roadmap
            defines the right approach before any build begins.
          </p>
          <Button href="/contact" variant="primary" size="lg" className="btn-magnetic mt-8">
            Request an AI Revenue Leak Audit
          </Button>
        </div>
      </div>
    </div>
  );
}
