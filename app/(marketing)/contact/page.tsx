import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get a free consultation. Tell us your goals and we'll map you to the right AI automation services.",
};

export default function ContactPage() {
  return (
    <div>
      <PageHero
        label="Free consultation"
        title="Tell us what you want to"
        titleAccent="automate."
        subtitle="We'll confirm by email and follow up personally, usually within one business day."
      />

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <ContactForm />
      </div>
    </div>
  );
}
