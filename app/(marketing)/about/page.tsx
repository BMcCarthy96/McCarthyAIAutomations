import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description:
    "McCarthy AI Automations is a premium AI automation agency helping businesses scale with voice agents, chatbots, and custom integrations.",
};

export default function AboutPage() {
  return (
    <div>
      <PageHero
        label="Our story"
        title="We exist to help businesses"
        titleAccent="grow without the chaos."
      />

      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="space-y-6 text-zinc-300">
          <p className="text-lg leading-relaxed">
            McCarthy AI Automations is a premium agency focused on AI-driven automation. We help
            companies of all sizes, from startups to mid-market, implement voice agents, chatbots,
            lead capture, CRM workflows, and custom integrations so they can scale operations and
            revenue without proportionally scaling headcount.
          </p>
          <p className="leading-relaxed text-zinc-400">
            Our approach is consultative and implementation-focused: we start with your goals and tech
            stack, then design and build solutions that fit. We don&apos;t do one-size-fits-all; we scope
            each engagement clearly and deliver with a structured process and ongoing support.
          </p>
          <p className="leading-relaxed text-zinc-400">
            Whether you need a single automation (an AI phone agent, a website chatbot, or a CRM
            integration) or a full-stack build, we&apos;re built to deliver. Clients get dedicated project
            tracking, monthly impact reports, and a direct line to us through a client portal built
            for the long term.
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
              Founder &amp; Lead Engineer, McCarthy AI Automations
            </p>
            <div className="mt-6 space-y-4 leading-relaxed text-zinc-400">
              <p>
                I&apos;m a full-stack software developer and AI automation builder focused on helping
                businesses work smarter, not harder. My background is in JavaScript, Python,
                databases, and modern web development. I apply all of that to one thing: building
                real systems that solve real business problems.
              </p>
              <p>
                I specialize in designing and building custom AI-powered workflows: lead capture
                systems, automated follow-ups, client portals, and intelligent assistants that help
                businesses stay organized, respond faster, and stop missing opportunities.
              </p>
              <p>
                What makes my approach different is that I don&apos;t just build features. I build
                systems that actually work in day-to-day operations. Everything is designed to be
                simple, reliable, and tailored to how your business already runs.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Button href="/contact" variant="primary" size="lg" className="btn-magnetic">
            Get in touch
          </Button>
          <Button href="/services" variant="secondary" size="lg">
            Explore services
          </Button>
        </div>
      </div>
    </div>
  );
}
