import Link from "next/link";
import { testimonials } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { CheckCircle } from "lucide-react";

export function Testimonials() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="What to expect"
          subtitle="Here's what working with us looks like, from the first audit through ongoing workflow management."
        />
        <p className="mt-4 text-center text-sm text-slate-500">
          Ready to find your revenue gaps?{" "}
          <Link
            href="/contact"
            className="font-medium text-blue-400 underline-offset-2 hover:text-blue-300 hover:underline"
          >
            Book a Free Revenue Leak Audit
          </Link>{" "}
          and we&apos;ll map it to your specific workflow.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <GlassCard key={t.id} hover>
              <CheckCircle className="h-8 w-8 text-blue-400" aria-hidden />
              <p className="mt-4 text-lg font-semibold text-white">
                {t.headline}
              </p>
              <p className="mt-3 text-slate-400">{t.body}</p>
              {t.metric && (
                <p className="mt-6 text-sm font-medium text-blue-400">
                  {t.metric}
                </p>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
