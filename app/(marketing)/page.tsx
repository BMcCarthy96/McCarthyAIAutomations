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
  title: "AI Workflow Systems That Recover Lost Revenue",
  description:
    "McCarthy AI Solutions identifies where your business loses revenue through slow follow-up, missed leads, and fragmented workflows, then builds high-touch AI systems to recover it.",
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
