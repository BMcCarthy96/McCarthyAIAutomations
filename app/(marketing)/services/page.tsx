import type { Metadata } from "next";
import {
  Globe,
  Phone,
  Calendar,
  MessageCircle,
  Workflow,
  Cpu,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { services } from "@/lib/data";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Button } from "@/components/ui/Button";

const iconMap = {
  Globe,
  Phone,
  Calendar,
  MessageCircle,
  Workflow,
  Cpu,
};

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore our AI automation services: website revamps, voice agents, chatbots, lead capture, CRM automation, and custom integrations.",
};

export default function ServicesPage() {
  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Our services"
          subtitle="End-to-end AI automation tailored to your business. Pick one or combine several for a full growth stack."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon =
              iconMap[service.icon as keyof typeof iconMap] ?? Globe;
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
        <div className="mt-16 text-center">
          <p className="text-zinc-400">Not sure what you need?</p>
          <Button href="/contact" variant="primary" size="md" className="mt-4">
            Get a free consultation
          </Button>
        </div>
      </div>
    </div>
  );
}
