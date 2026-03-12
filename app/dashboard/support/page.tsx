import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Mail, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help or request changes for your projects.",
};

export default function DashboardSupportPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Support"
        subtitle="Get help, request changes, or ask questions about your projects."
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <GlassCard hover={false}>
          <Mail className="h-10 w-10 text-indigo-400" />
          <h3 className="mt-4 text-lg font-semibold text-white">Email support</h3>
          <p className="mt-2 text-sm text-zinc-400">
            For non-urgent requests, documentation, or detailed questions. We
            typically respond within one business day.
          </p>
          <Button
            href="/contact"
            variant="secondary"
            size="md"
            className="mt-4"
          >
            Contact us
          </Button>
        </GlassCard>
        <GlassCard hover={false}>
          <MessageCircle className="h-10 w-10 text-indigo-400" />
          <h3 className="mt-4 text-lg font-semibold text-white">
            Project-specific help
          </h3>
          <p className="mt-2 text-sm text-zinc-400">
            Your project manager can help with scope, timelines, and
            deliverables. Reach out via your usual channel.
          </p>
          <p className="mt-4 text-sm text-zinc-500">
            Need to escalate? Use the contact form and we’ll route you to the
            right person.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
