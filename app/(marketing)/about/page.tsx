import type { Metadata } from "next";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description:
    "McCarthy AI Automations is a premium AI automation agency helping businesses scale with voice agents, chatbots, and custom integrations.",
};

export default function AboutPage() {
  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          title="About McCarthy AI Automations"
          subtitle="We exist to help businesses grow without the chaos."
        />
        <div className="mt-12 space-y-8 text-zinc-300">
          <p className="text-lg leading-relaxed">
            McCarthy AI Automations is a premium agency focused on AI-driven
            automation. We help companies—from startups to mid-market—implement
            voice agents, chatbots, lead capture, CRM workflows, and custom
            integrations so they can scale operations and revenue without
            proportionally scaling headcount.
          </p>
          <p className="leading-relaxed">
            Our approach is consultative and implementation-focused: we start
            with your goals and tech stack, then design and build solutions
            that fit. We don’t do one-size-fits-all; we scope each engagement
            clearly and deliver with a structured process and ongoing support.
          </p>
          <p className="leading-relaxed">
            Whether you need a single automation (e.g., an AI phone agent or
            website chatbot) or a full stack (revamped site + AI + CRM
            automation), we’re built to deliver. Our clients see better lead
            quality, higher conversion, and more time back for their teams.
          </p>
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <Button href="/contact" variant="primary" size="lg">
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
