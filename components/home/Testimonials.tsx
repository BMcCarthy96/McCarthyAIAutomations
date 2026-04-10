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
          subtitle="Here's what working with us looks like — from day one through ongoing operations."
        />
        <p className="mt-4 text-center text-sm text-zinc-500">
          Ready to see it in action?{" "}
          <Link
            href="/contact"
            className="font-medium text-indigo-400 underline-offset-2 hover:text-indigo-300 hover:underline"
          >
            Book a free consultation
          </Link>{" "}
          and we&apos;ll map this to your specific stack.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <GlassCard key={t.id} hover>
              <CheckCircle className="h-8 w-8 text-indigo-400" />
              <p className="mt-4 text-lg font-semibold text-white">{t.headline}</p>
              <p className="mt-3 text-zinc-400">{t.body}</p>
              {t.metric && (
                <p className="mt-6 text-sm font-medium text-indigo-400">{t.metric}</p>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
