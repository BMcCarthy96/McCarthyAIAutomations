import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "AI Revenue Leak Audit & Automation Roadmap",
  description:
    "Share the lead-handling, follow-up or operational workflow you want to improve. New engagements begin with a brief no-cost fit conversation before any paid audit starts.",
};

export default function ContactPage() {
  return (
    <div>
      <PageHero
        label="AI Revenue Leak Audit"
        title="Request an AI"
        titleAccent="Revenue Leak Audit."
        subtitle="Share the lead-handling, follow-up or operational workflow you want to improve. New engagements begin with a brief no-cost fit conversation. If there is a worthwhile problem to investigate, the paid audit provides prioritized recommendations and implementation options."
      />

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="mb-6 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-xs leading-relaxed text-zinc-400">
          This is a live inquiry form. Submissions create a real consultation request and may trigger automated processing.
          For a product walkthrough without submitting a request, visit the{" "}
          <Link href="/demo" className="text-indigo-400 underline underline-offset-2 hover:text-indigo-300">
            demo portal
          </Link>{" "}
          instead.
        </p>
        <ContactForm />
      </div>
    </div>
  );
}
