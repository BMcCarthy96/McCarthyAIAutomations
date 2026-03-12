import { ArrowRight } from "lucide-react";
import { services } from "@/lib/data";
import { getServiceIcon } from "@/lib/serviceIcons";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "./SectionHeading";

export function ServicesGrid() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="What we build"
          subtitle="From websites and voice agents to CRM automation and custom AI—we deliver solutions that drive growth."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = getServiceIcon(service.icon);
            return (
              <GlassCard key={service.id} href={`/services/${service.slug}`}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm text-zinc-400">
                  {service.tagline}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-400">
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </span>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
