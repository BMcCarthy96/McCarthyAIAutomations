import type { Metadata } from "next";
import { pricingTiers } from "@/lib/data";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";

const pricingFAQ = [
  {
    q: "What's included in the AI Revenue Leak Audit & Automation Roadmap?",
    a: "This paid engagement reviews lead handling, follow-up, booking handoffs or related operational workflows to identify potential revenue-leak points and practical automation opportunities. You receive prioritized recommendations, implementation options and a phased roadmap. New engagements begin with a short no-cost fit conversation before any paid audit starts.",
  },
  {
    q: "How is the Automation Pilot Implementation scoped and priced?",
    a: "After the audit, I send a clear proposal for one targeted workflow build. Pilots start at $1,000 depending on the complexity and tools involved. You know exactly what is included before any work begins. What we quote is what you pay.",
  },
  {
    q: "What happens after the pilot?",
    a: "At the end of the pilot you receive a documented handoff and a follow-on recommendation summary. If ongoing advisory or further optimization is justified, that is available as a separately scoped engagement. There is no automatic continuation.",
  },
  {
    q: "Do you work with existing tools and workflows?",
    a: "Yes. I design workflows around your existing tools and APIs. McCarthy AI Automations currently demonstrates Zapier-connected lead intake and booking-tracking workflows, along with AI classification, database-backed records, email automation and dashboard review. For any additional integration, I will confirm feasibility and scope before work begins.",
  },
];

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Paid AI Revenue Leak Audit and Automation Roadmap starting at $495. Optional workflow implementation pilot starting at $1,000. Advisory retainer from $1,500/month.",
};

export default function PricingPage() {
  return (
    <div>
      <PageHero
        label="How we work together"
        title="Audit first."
        titleAccent="Build when ready."
        subtitle="Start with a paid workflow audit. Add implementation only when the roadmap confirms it makes sense. Advisory guidance is available after an initial engagement."
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
          New engagements begin with a brief no-cost fit conversation before any paid audit starts.
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
              Ready to identify the workflow gaps worth addressing first?
            </p>
            <Button href="/contact" variant="primary" size="lg" className="btn-magnetic">
              Request an AI Revenue Leak Audit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
