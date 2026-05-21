import { ArrowRight } from "lucide-react";
import { services } from "@/lib/data";
import { getServiceIcon } from "@/lib/serviceIcons";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "./SectionHeading";

export function ServicesGrid() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="What revenue leaks we fix"
          subtitle="Each offer targets a specific workflow gap: missed leads, slow follow-up, stale quotes, or stuck pipeline. We start with an audit to figure out which ones apply to you."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = getServiceIcon(service.icon);
            return (
              <GlassCard key={service.id} href={`/services/${service.slug}`}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm text-slate-400">{service.tagline}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-400">
                  Learn more
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </GlassCard>
            );
          })}
        </div>
        <div className="mt-14 flex flex-col items-center justify-center gap-4 border-t border-white/10 pt-12 text-center">
          <p className="max-w-lg text-sm text-slate-400">
            Not sure which gap to fix first? The audit is free. We&apos;ll review
            your workflow and tell you exactly where to start.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/contact" variant="primary" size="md">
              Book a Free Revenue Leak Audit
            </Button>
            <Button href="/pricing" variant="ghost" size="md">
              View pricing
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
