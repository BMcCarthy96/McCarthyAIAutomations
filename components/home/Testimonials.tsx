import Link from "next/link";
import { testimonials } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="What clients say"
          subtitle="Teams use us to ship automation that sticks—then keep improving with the same portal, support, and reporting experience you saw above."
        />
        <p className="mt-4 text-center text-sm text-zinc-500">
          Next step:{" "}
          <Link
            href="/contact"
            className="font-medium text-indigo-400 underline-offset-2 hover:text-indigo-300 hover:underline"
          >
            book a free consultation
          </Link>{" "}
          and we&apos;ll show how this maps to your stack.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <GlassCard key={t.id} hover>
              <Quote className="h-10 w-10 text-indigo-400/60" />
              <p className="mt-4 text-zinc-300">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6">
                <p className="font-semibold text-white">{t.author}</p>
                <p className="text-sm text-zinc-500">
                  {t.role}, {t.company}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
