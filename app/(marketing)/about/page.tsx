import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description:
    "McCarthy AI Solutions builds high-touch AI workflow systems that recover lost revenue from missed leads, slow follow-up, and operational bottlenecks.",
};

export default function AboutPage() {
  return (
    <div>
      <PageHero
        label="Our story"
        title="We focus on revenue recovery,"
        titleAccent="not generic automation."
      />

      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="space-y-6 text-zinc-300">
          <p className="text-lg leading-relaxed">
            McCarthy AI Solutions builds AI workflow systems for B2B businesses losing revenue to missed leads, slow follow-up, stale quotes, and broken handoffs.
          </p>
          <p className="leading-relaxed text-zinc-400">
            Our approach differs from a generic automation agency. We start with a free Revenue Leak Audit to find where your workflow is breaking down, before building anything. Then we run a 30-Day Pilot to prove one improvement works. If the results justify it, we recommend a managed system.
          </p>
          <p className="leading-relaxed text-zinc-400">
            Every client gets a dedicated portal with workflow status, milestones, support, billing, and monthly impact reports. You see what changed, what&apos;s still running, and what the system recovered.
          </p>
        </div>

        {/* Founder section */}
        <div className="mt-16 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8">
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Founder
            </div>
            <p className="mt-3 text-xl font-semibold text-white">Brandon McCarthy</p>
            <p className="mt-0.5 text-sm text-zinc-500">
              Founder &amp; Lead Engineer, McCarthy AI Solutions
            </p>
            <div className="mt-6 space-y-4 leading-relaxed text-zinc-400">
              <p>
                I&apos;m a full-stack software developer and AI workflow systems builder focused on
                revenue recovery for B2B businesses. My background is in JavaScript, Python,
                databases, and modern web development, all applied to building systems that find and fix workflow gaps that cost businesses real money.
              </p>
              <p>
                I specialize in designing and building custom AI-powered workflows: lead capture
                and follow-up systems, speed-to-lead automation, quote recovery, pipeline
                monitoring, and client portals that make workflow impact visible and measurable.
              </p>
              <p>
                I don&apos;t build features and call it done. I build systems that hold up in day-to-day operations and show what they recovered. I try to keep things simple, reliable, and shaped around how your team actually works.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Button href="/contact" variant="primary" size="lg" className="btn-magnetic">
            Book a Free Revenue Leak Audit
          </Button>
          <Button href="/services" variant="secondary" size="lg">
            Explore our services
          </Button>
        </div>
      </div>
    </div>
  );
}
