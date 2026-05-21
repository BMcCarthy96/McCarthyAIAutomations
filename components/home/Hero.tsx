import { AlertTriangle, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TryLiveDemoButton } from "@/components/home/TryLiveDemoButton";
import { TryLiveDemoMarketingGate } from "@/components/home/TryLiveDemoMarketingGate";

const revenueGaps = [
  { label: "Lead response time > 24 hrs", impact: "High" },
  { label: "Off-hours inquiries going unanswered", impact: "High" },
  { label: "Stale pipeline deals with no follow-up", impact: "Medium" },
  { label: "No automated re-engagement sequence", impact: "Medium" },
] as const;

const deployedSystems = [
  "24/7 lead capture & intelligent triage",
  "Automated follow-up sequences",
  "Pipeline re-engagement workflow",
  "Monthly impact reporting",
] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-24 lg:px-8">
      {/* Ambient background glows */}
      <div
        className="glow-pulse pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(37,99,235,0.22),transparent)]"
        aria-hidden
      />
      <div
        className="glow-pulse pointer-events-none absolute -left-56 top-1/2 h-[640px] w-[640px] -translate-y-1/2 rounded-full bg-blue-700/[0.06] blur-3xl"
        style={{ animationDelay: "2s" }}
        aria-hidden
      />
      <div
        className="glow-pulse pointer-events-none absolute -right-56 top-1/3 h-[520px] w-[520px] rounded-full bg-cyan-500/[0.05] blur-3xl"
        style={{ animationDelay: "1s" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ── Left: copy ─────────────────────────────────────────── */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="hero-badge mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-4 py-1.5">
              <span
                className="glow-pulse h-1.5 w-1.5 rounded-full bg-cyan-400"
                aria-hidden
              />
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                AI Workflow Systems · Revenue Recovery
              </span>
            </div>

            {/* H1 */}
            <h1 className="hero-h1 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
              AI Workflow Systems<br className="hidden sm:block" />{" "}
              That Recover{" "}
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300 bg-clip-text text-transparent">
                Lost Revenue
              </span>
            </h1>

            {/* Subhead */}
            <p className="hero-sub mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-400 lg:mx-0 sm:text-xl">
              We identify where your business is losing revenue through slow
              follow-up, missed leads, stale opportunities, and fragmented
              workflows, then build AI-powered systems to recover it.
            </p>

            {/* CTAs */}
            <div className="hero-ctas mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start">
              <Button
                href="/contact"
                variant="primary"
                size="lg"
                className="w-full min-w-[220px] sm:w-auto"
              >
                Book your free consultation
              </Button>
              <Button
                href="/#how-it-works"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                See how it works
              </Button>
            </div>

            <p className="hero-note mt-5 text-center text-sm text-slate-600 lg:text-left">
              No obligation. We identify your revenue gaps and map the fix.
              First call is free.
            </p>
          </div>

          {/* ── Right: Revenue Gap Analysis card ───────────────────── */}
          <div className="hero-visual float-card">
            <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-b from-slate-900/95 to-slate-950 shadow-2xl shadow-blue-950/50 ring-1 ring-white/[0.05]">
              {/* Window chrome */}
              <div className="flex items-center gap-2 border-b border-white/10 bg-black/30 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" aria-hidden />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" aria-hidden />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" aria-hidden />
                <span className="ml-3 text-xs font-medium text-slate-500">
                  Revenue Gap Analysis
                </span>
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  <span
                    className="glow-pulse h-1 w-1 rounded-full bg-emerald-400"
                    aria-hidden
                  />
                  System active
                </span>
              </div>

              <div className="p-5">
                {/* Gaps identified */}
                <div className="mb-4">
                  <div className="mb-3 flex items-center gap-2">
                    <AlertTriangle
                      className="h-3.5 w-3.5 shrink-0 text-amber-400"
                      aria-hidden
                    />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Revenue gaps identified
                    </span>
                  </div>
                  <div className="space-y-2">
                    {revenueGaps.map((gap) => (
                      <div
                        key={gap.label}
                        className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2"
                      >
                        <span className="text-xs text-slate-400">
                          {gap.label}
                        </span>
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                            gap.impact === "High"
                              ? "bg-rose-500/15 text-rose-400"
                              : "bg-amber-500/15 text-amber-400"
                          }`}
                        >
                          {gap.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="my-4 border-t border-white/[0.06]" />

                {/* Systems deployed */}
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Zap
                      className="h-3.5 w-3.5 shrink-0 text-blue-400"
                      aria-hidden
                    />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      AI systems deployed
                    </span>
                  </div>
                  <div className="space-y-2">
                    {deployedSystems.map((system) => (
                      <div key={system} className="flex items-center gap-2">
                        <CheckCircle2
                          className="h-3.5 w-3.5 shrink-0 text-emerald-400"
                          aria-hidden
                        />
                        <span className="text-xs text-slate-300">{system}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact summary */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-blue-500/15 bg-blue-500/10 p-3 text-center">
                    <p className="text-lg font-bold text-blue-300">&lt; 5 min</p>
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      avg response time
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/10 p-3 text-center">
                    <p className="text-lg font-bold text-emerald-300">24/7</p>
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      lead capture active
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-center text-[10px] text-slate-600">
                  Illustrative example · results vary by workflow
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Live demo gate (full-width below both columns) ─────────── */}
        <TryLiveDemoMarketingGate>
          <div className="hero-demo mx-auto mt-14 max-w-md border-t border-white/[0.06] pt-10 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Prefer to explore first?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Open the client portal with curated sample data. No forms, no
              pitch.
            </p>
            <div className="mt-5 flex justify-center">
              <TryLiveDemoButton
                gated={false}
                variant="ghost"
                size="md"
                className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-2.5 text-sm font-semibold text-blue-200/95 ring-1 ring-white/[0.04] transition-colors hover:border-blue-400/25 hover:bg-blue-500/10 hover:text-blue-100"
              />
            </div>
          </div>
        </TryLiveDemoMarketingGate>
      </div>
    </section>
  );
}
