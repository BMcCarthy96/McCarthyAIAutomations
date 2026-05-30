import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { StatsStrip } from "@/components/home/StatsStrip";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { LiveAiSystemsSection } from "@/components/home/LiveAiSystemsSection";
import { PortalPreview } from "@/components/home/PortalPreview";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { CTABanner } from "@/components/home/CTABanner";

export const metadata: Metadata = {
  title: "AI Workflow Consulting & Automation Roadmaps | McCarthy AI Automations",
  description:
    "Audit-first AI workflow consulting for lead handling, follow-up, and operational handoffs. Diagnose bottlenecks, map deterministic automation and bounded AI steps, then implement only when the roadmap confirms it makes sense.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <HowItWorks />
      <ServicesGrid />
      <LiveAiSystemsSection />
      <PortalPreview />
      <Testimonials />
      <FAQ />
      <CTABanner />
    </>
  );
}
