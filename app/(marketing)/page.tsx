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
  title: "AI Workflow Consulting & Revenue Leak Audits | McCarthy AI",
  description:
    "Identify potential lead-handling, follow-up, and workflow gaps through a paid AI Revenue Leak Audit and Automation Roadmap, with optional implementation.",
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
