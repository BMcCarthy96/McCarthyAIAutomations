import type { Metadata } from "next";
import { SectionHeading } from "@/components/home/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get a free consultation. Tell us your goals and we'll map you to the right AI automation services.",
};

export default function ContactPage() {
  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <SectionHeading
          title="Get in touch"
          subtitle="Tell us what you want to automate—we’ll confirm by email and follow up personally, usually within one business day."
        />
        <ContactForm />
      </div>
    </div>
  );
}
