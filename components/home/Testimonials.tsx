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
          subtitle="Businesses across industries trust us to deliver and support their AI automation."
        />
        <div className="mt-16 grid gap-8 md:grid-cols-3">
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
