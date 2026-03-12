import type { Metadata } from "next";
import { pricingTiers } from "@/lib/data";
import { SectionHeading } from "@/components/home/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";

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
      </div>
    </div>
  );
}
