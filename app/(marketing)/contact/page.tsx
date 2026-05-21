import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Book a Free Revenue Leak Audit",
  description:
    "Tell us where leads, follow-ups, quotes, or workflows may be slipping through the cracks. We'll review your process and map the biggest recovery opportunities.",
};

export default function ContactPage() {
  return (
    <div>
      <PageHero
        label="Free Revenue Leak Audit"
        title="Tell us where revenue may be"
        titleAccent="slipping through."
        subtitle="We'll review your workflow, identify the biggest gaps, and respond personally within one business day."
      />

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <ContactForm />
      </div>
    </div>
  );
}
