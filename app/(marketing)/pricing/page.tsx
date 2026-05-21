import type { Metadata } from "next";
import { pricingTiers } from "@/lib/data";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";

const pricingFAQ = [
  {
    q: "Are these starting prices or fixed prices?",
    a: "Starting prices. The final number depends on your existing tools, integrations, and complexity. We give you a fixed-fee proposal after a short discovery call, with no open-ended billing and no surprises.",
  },
  {
    q: "Can I start with Essentials and scale up?",
    a: "Yes, and most clients do. A common path is starting with a chatbot or lead capture system, seeing results, then expanding to voice agents or full CRM automation. Each phase is scoped and priced separately.",
  },
  {
    q: "What's included in post-launch support?",
    a: "Essentials includes 30 days of bug fixes and minor adjustments. Growth includes 90 days plus bi-weekly check-ins and optimization. Partnership is fully ongoing. All tiers include documentation and a handoff session.",
  },
  {
    q: "How long does a typical project take?",
    a: "Essentials projects (single chatbot, voice agent) typically launch in 2–4 weeks. Growth packages run 4–8 weeks depending on scope and integrations. We build with milestones so you always know what's next.",
  },
];

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent project-based pricing for AI automation. Essentials from $2,500, Growth from $5,500, and custom Partnership retainers.",
};

export default function PricingPage() {
  return (
    <div>
      <PageHero
        label="Investment"
        title="Pricing built for"
        titleAccent="real outcomes."
        subtitle="Fixed-scope, fixed-fee projects with clear timelines. No hourly billing, no scope creep. Just results you can measure."
      />

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Tier grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={
                tier.highlighted
                  ? "relative rounded-2xl border border-blue-500/40 bg-gradient-to-b from-blue-600/[0.12] to-blue-900/[0.06] p-8 backdrop-blur-xl shadow-xl shadow-blue-950/30"
                  : "relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-xl"
              }
            >
              {tier.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-blue-300">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                {tier.name}
              </div>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">{tier.price}</span>
                <span className="text-sm text-zinc-500">/ {tier.period}</span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{tier.description}</p>

              <div className="my-6 h-px bg-white/[0.06]" />

              <ul className="space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className={`mt-0.5 h-4 w-4 shrink-0 ${tier.highlighted ? "text-blue-400" : "text-emerald-400"}`} />
                    <span className="text-zinc-300">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                href="/contact"
                variant={tier.highlighted ? "primary" : "secondary"}
                size="md"
                className={`mt-8 w-full ${tier.highlighted ? "btn-magnetic" : ""}`}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-zinc-600">
          Not sure which tier fits? Start with a free discovery call and we&apos;ll recommend the right scope.
        </p>

        {/* FAQ */}
        <div className="mt-24">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Common questions
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Pricing FAQ
            </h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            {pricingFAQ.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.03] px-7 py-6"
              >
                <p className="font-semibold text-white">{item.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="mb-6 text-base text-zinc-500">
              Ready to see what a custom automation stack looks like for your business?
            </p>
            <Button href="/contact" variant="primary" size="lg" className="btn-magnetic">
              Book a free discovery call
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
