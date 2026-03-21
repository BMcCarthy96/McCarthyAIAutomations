import { Clock, Headphones, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "./SectionHeading";

const pillars = [
  {
    icon: Clock,
    title: "Hours back to your team",
    body: "Stop chasing voicemails, duplicate data entry, and manual follow-ups. Automation handles the repeat work so people focus on revenue.",
  },
  {
    icon: Users,
    title: "Leads captured, not lost",
    body: "Every call, chat, and form submission is qualified, routed, and logged—so pipeline stays full even when you’re offline.",
  },
  {
    icon: TrendingUp,
    title: "Revenue you can point to",
    body: "Tie activity to outcomes: booked meetings, deals influenced, and time saved—so leadership sees the business case, not just features.",
  },
  {
    icon: Headphones,
    title: "Support that doesn’t disappear",
    body: "Dedicated help through launch plus clear paths for questions, tuning, and growth—your platform evolves with the business.",
  },
];

export function ValueProposition() {
  return (
    <section className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_70%_50%,rgba(99,102,241,0.08),transparent)]" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          title="Why businesses choose us"
          subtitle="We don’t just ship bots and integrations—we build measurable operations: time returned, pipeline protected, and reporting your CFO will actually read."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-colors hover:border-indigo-500/20 hover:bg-white/[0.05]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/contact" variant="primary" size="lg">
            Book your free consultation
          </Button>
          <Button href="/services" variant="secondary" size="lg">
            Browse services
          </Button>
        </div>
      </div>
    </section>
  );
}
