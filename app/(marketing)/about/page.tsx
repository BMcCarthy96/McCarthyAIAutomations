import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description:
    "AI workflow consulting for lead handling, follow-up and operational handoffs. Paid audits, optional implementation, and advisory guidance.",
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
            I focus on practical AI workflow consulting: identifying where lead handling, follow-up and operational handoffs may be limiting opportunities, then defining a clear automation roadmap before any build begins.
          </p>
          <p className="leading-relaxed text-zinc-400">
            New engagements begin with a brief no-cost fit conversation. If there is a worthwhile problem to address, the next step is a paid AI Revenue Leak Audit and Automation Roadmap. Implementation is available as a second phase after the roadmap is approved.
          </p>
          <p className="leading-relaxed text-zinc-400">
            Clients in active projects get a dedicated portal with workflow status, milestones, support, billing, and monthly impact reporting.
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
                I don&apos;t build features and call it done. I build practical workflow systems shaped around how your team actually operates, and document them clearly for handoff.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Button href="/contact" variant="primary" size="lg" className="btn-magnetic">
            Request an AI Revenue Leak Audit
          </Button>
          <Button href="/services" variant="secondary" size="lg">
            Explore our services
          </Button>
        </div>
      </div>
    </div>
  );
}
