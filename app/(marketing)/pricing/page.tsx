import type { Metadata } from "next";
import { pricingTiers } from "@/lib/data";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";

const pricingFAQ = [
  {
    q: "What's included in the Free Revenue Leak Audit?",
    a: "We review your lead capture, follow-up, and pipeline workflow to identify where revenue may be slipping through. You get a workflow map with prioritized bottlenecks and a clear recommendation for where to start. No cost, no commitment.",
  },
  {
    q: "How is the 30-Day Pilot scoped and priced?",
    a: "After the audit, we send a fixed-fee proposal for one targeted workflow fix. Pilots start at $750 depending on the complexity and tools involved. You know exactly what you're getting before any work begins.",
  },
  {
    q: "What happens after the pilot?",
    a: "At the end of the pilot you get a simple impact report and a clear next-step recommendation. If the results justify expanding, we scope a managed system. There's no pressure to continue if the pilot doesn't prove the value.",
  },
  {
    q: "Do you work with our existing tools and CRM?",
    a: "Yes. I can design workflows around your existing tools and APIs. McCarthy AI Automations currently demonstrates Zapier-connected lead intake and booking-tracking workflows, along with AI classification, database-backed records, email automation and dashboard review. For any additional CRM or platform integration, I will confirm feasibility and scope before work begins.",
  },
];

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start with a free Revenue Leak Audit. Then a fixed-scope 30-Day Pilot from $750. Scale to a Managed AI Workflow System with ongoing support.",
};

export default function PricingPage() {
  return (
    <div>
      <PageHero
        label="How we work together"
        title="Start free. Prove value."
        titleAccent="Then scale."
        subtitle="A free audit, a fixed-scope pilot, and a managed system if the results justify it. No long-term commitment until you've seen it work."
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
          Not sure where to start? Start with the audit. It&apos;s free, and you decide what to do from the results.
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
              Ready to find out where revenue is slipping through?
            </p>
            <Button href="/contact" variant="primary" size="lg" className="btn-magnetic">
              Book a Free Revenue Leak Audit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
