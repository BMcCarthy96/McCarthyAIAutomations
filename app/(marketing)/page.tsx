import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { StatsStrip } from "@/components/home/StatsStrip";
import { ValueProposition } from "@/components/home/ValueProposition";
import { PortalPreview } from "@/components/home/PortalPreview";
import { LiveAiSystemsSection } from "@/components/home/LiveAiSystemsSection";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PhilosophySection } from "@/components/home/PhilosophySection";
import { Testimonials } from "@/components/home/Testimonials";
import { ConsultationBand } from "@/components/home/ConsultationBand";
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
      <ValueProposition />
      <PortalPreview />
      <LiveAiSystemsSection />
      <ServicesGrid />
      <HowItWorks />
      <PhilosophySection />
      <Testimonials />
      <ConsultationBand />
      <FAQ />
      <CTABanner />
    </>
  );
}
