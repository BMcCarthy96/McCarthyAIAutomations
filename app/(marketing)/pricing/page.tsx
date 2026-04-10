import type { Metadata } from "next";
import { pricingTiers } from "@/lib/data";
import { SectionHeading } from "@/components/home/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";

const pricingFAQ = [
  {
    q: "What does a typical Starter project cost?",
    a: "Single-service projects (e.g., a website chatbot or AI voice agent) generally range from a few hundred to a few thousand dollars depending on complexity and integrations. We'll give you a fixed number after a 20-minute discovery call — no open-ended billing.",
  },
  {
    q: "Can I start with one automation and add more later?",
    a: "Yes, and most clients do. A common path is starting with a chatbot or lead capture system, seeing results, then expanding to voice agents or CRM integrations. Each phase is scoped and priced separately.",
  },
  {
    q: "Why custom pricing instead of a fixed price list?",
    a: "The complexity of an AI integration depends heavily on your existing tools, data, and goals. A chatbot for a simple contact page takes a day; one connected to your CRM, calendar, and product catalog takes a week. Fixed pricing would mean overcharging some clients and undercharging others.",
  },
  {
    q: "What's included in post-launch support?",
    a: "Starter includes 30 days of bug fixes and minor adjustments. Growth includes 90 days plus training sessions and optimization check-ins. Enterprise is ongoing. All tiers include documentation and a handoff call.",
  },
];

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent, custom pricing for AI automation. Starter, Growth, and Enterprise options.",
};

export default function PricingPage() {
  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Pricing"
          subtitle="We tailor every engagement to your scope. Get a custom quote after a short discovery call."
        />
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <GlassCard
              key={tier.id}
              hover
              className={
                tier.highlighted
                  ? "ring-2 ring-indigo-500/50"
                  : ""
              }
            >
              {tier.highlighted && (
                <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-400">
                  Most popular
                </p>
              )}
              <h3 className="text-xl font-semibold text-white">{tier.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">
                  {tier.price}
                </span>
                <span className="text-zinc-400">/ {tier.period}</span>
              </div>
              <p className="mt-4 text-sm text-zinc-400">{tier.description}</p>
              <ul className="mt-6 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                    <Check className="h-4 w-4 shrink-0 text-indigo-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                href="/contact"
                variant={tier.highlighted ? "primary" : "secondary"}
                size="md"
                className="mt-8 w-full"
              >
                {tier.cta}
              </Button>
            </GlassCard>
          ))}
        </div>
        <p className="mt-12 text-center text-sm text-zinc-500">
          All pricing is custom. No hidden fees. We&apos;ll send a detailed
          proposal after our discovery call.
        </p>

        <div className="mt-20">
          <h2 className="text-2xl font-semibold text-white">Common questions</h2>
          <div className="mt-8 space-y-6">
            {pricingFAQ.map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-5"
              >
                <p className="font-medium text-white">{item.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button href="/contact" variant="primary" size="lg">
              Book a free discovery call
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
