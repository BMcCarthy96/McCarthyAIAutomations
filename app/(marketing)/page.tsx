import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { StatsStrip } from "@/components/home/StatsStrip";
import { ValueProposition } from "@/components/home/ValueProposition";
import { PortalPreview } from "@/components/home/PortalPreview";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";
import { ConsultationBand } from "@/components/home/ConsultationBand";
import { FAQ } from "@/components/home/FAQ";
import { CTABanner } from "@/components/home/CTABanner";

export const metadata: Metadata = {
  title: "Reclaim time, grow pipeline, prove ROI",
  description:
    "Premium AI automation: voice agents, chatbots, lead capture, and custom workflows—with a client portal, support, Stripe billing, and monthly impact reporting. Book a free consultation.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <ValueProposition />
      <PortalPreview />
      <ServicesGrid />
      <HowItWorks />
      <Testimonials />
      <ConsultationBand />
      <FAQ />
      <CTABanner />
    </>
  );
}
