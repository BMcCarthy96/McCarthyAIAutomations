import Link from "next/link";
import { testimonials } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { CheckCircle } from "lucide-react";

export function Testimonials() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="What to expect"
          subtitle="Here is what working together looks like, from an initial fit conversation through a paid audit and optional workflow build."
        />
        <p className="mt-4 text-center text-sm text-slate-500">
          Ready to get started?{" "}
          <Link
            href="/contact"
            className="font-medium text-blue-400 underline-offset-2 hover:text-blue-300 hover:underline"
          >
            Request an AI Revenue Leak Audit
          </Link>
        </p>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
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
