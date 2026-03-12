import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "Billing",
  description: "Billing and invoices.",
};

export default function DashboardBillingPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Billing"
        subtitle="Invoices and payment details."
      />
      <GlassCard hover={false}>
        <CreditCard className="h-10 w-10 text-zinc-500" />
        <h3 className="mt-4 text-lg font-semibold text-white">
          Billing coming soon
        </h3>
        <p className="mt-2 text-sm text-zinc-400">
          Invoices and payment history will be available here. For now, please
          contact your project manager or use the contact form for billing
          questions.
        </p>
      </GlassCard>
    </div>
  );
}
