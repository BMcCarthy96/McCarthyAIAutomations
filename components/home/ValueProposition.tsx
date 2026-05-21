import { BarChart3, TrendingUp, Workflow } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "./SectionHeading";

const pillars = [
  {
    icon: TrendingUp,
    iconColor: "text-blue-300",
    iconBg: "bg-blue-500/15",
    accentBorder: "hover:border-blue-500/25",
    title: "Recover Lost Revenue",
    body: "Find and fix the missed leads, slow follow-ups, stale deals, and workflow gaps quietly costing your business money. We identify the leaks and build systems to close them.",
  },
  {
    icon: Workflow,
    iconColor: "text-cyan-300",
    iconBg: "bg-cyan-500/15",
    accentBorder: "hover:border-cyan-500/25",
    title: "Built Around Your Workflow",
    body: "Custom AI systems designed around how your business actually operates, not generic tools forced into your process. We map your workflow, identify bottlenecks, then build and optimize.",
  },
  {
    icon: BarChart3,
    iconColor: "text-emerald-300",
    iconBg: "bg-emerald-500/15",
    accentBorder: "hover:border-emerald-500/25",
    title: "Measurable, Ongoing Results",
    body: "Track response times, follow-up rates, booked calls, recovered opportunities, and bottlenecks through clear reporting. Every system is built to show what changed.",
  },
] as const;

export function ValueProposition() {
  return (
    <section className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_70%_50%,rgba(37,99,235,0.07),transparent)]" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          title="Why businesses choose McCarthy AI"
          subtitle="We don't sell AI tools. We sell recovered revenue, found in the gaps between your current operations and the growth you're leaving on the table."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {pillars.map(
            ({ icon: Icon, iconColor, iconBg, accentBorder, title, body }) => (
              <div
                key={title}
                className={`rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition-colors ${accentBorder} hover:bg-white/[0.05]`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
                >
                  <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {body}
                </p>
              </div>
            )
          )}
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
