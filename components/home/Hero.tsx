"use client";

import { AlertTriangle, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TryLiveDemoButton } from "@/components/home/TryLiveDemoButton";
import { TryLiveDemoMarketingGate } from "@/components/home/TryLiveDemoMarketingGate";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const workflowGaps = [
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
  const leftRef  = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(badgeRef.current,  { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 0)
      .fromTo(leftRef.current?.children  ?? [], { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.15)
      .fromTo(rightRef.current,  { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.9 }, 0.4);
  }, []);

  return (
    <section className="relative overflow-hidden px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">
      {/* Ambient background glows */}
      <div
        className="glow-pulse pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(37,99,235,0.2),transparent)]"
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
        {/* Badge */}
        <div ref={badgeRef} className="mb-10 flex justify-center lg:justify-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/[0.08] px-4 py-1.5">
            <span className="glow-pulse h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">
              AI Workflow Consulting · Audit-First Systems
            </span>
          </div>
        </div>

        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          {/* ── Left: copy ──────────────────────────────────────────────── */}
          <div ref={leftRef} className="text-center lg:text-left">
            {/* H1 */}
            <h1 className="text-[2.75rem] font-bold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-[3.75rem]">
              Find where valuable<br />
              opportunities are{" "}
              <em className="font-drama not-italic italic text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, #60a5fa 0%, #38bdf8 50%, #a5f3fc 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}>
                stalling.
              </em>
            </h1>

            {/* Subhead */}
            <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-slate-400 lg:mx-0">
              I help businesses identify where slow follow-up, disconnected
              tools, and unclear handoffs may be allowing leads or customer
              opportunities to stall. Start with an AI Revenue Leak Audit
              and Automation Roadmap. If implementation makes sense, I can
              build the approved system as a second phase.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start">
              <Button
                href="/contact"
                variant="primary"
                size="lg"
                className="btn-magnetic w-full min-w-[220px] sm:w-auto"
              >
                Request an AI Revenue Leak Audit
              </Button>
              <Button
                href="/services"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Explore our services
              </Button>
            </div>

            <p className="mt-8 text-center text-sm text-slate-600 lg:text-left">
              New engagements begin with a brief no-cost fit conversation before any paid audit starts.
            </p>
          </div>

          {/* ── Right: Revenue Gap Analysis card ─────────────────────── */}
          <div ref={rightRef} className="float-card">
            <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-b from-slate-900/95 to-slate-950 shadow-2xl shadow-blue-950/50 ring-1 ring-white/[0.05]">
              {/* Window chrome */}
              <div className="flex items-center gap-2 border-b border-white/10 bg-black/30 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" aria-hidden />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" aria-hidden />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" aria-hidden />
                <span className="ml-3 text-xs font-medium text-slate-500">
                  Workflow Gap Analysis
                </span>
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  <span className="glow-pulse h-1 w-1 rounded-full bg-emerald-400" aria-hidden />
                  System active
                </span>
              </div>

              <div className="p-5">
                {/* Gaps identified */}
                <div className="mb-4">
                  <div className="mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-400" aria-hidden />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Workflow gaps identified
                    </span>
                  </div>
                  <div className="space-y-2">
                    {workflowGaps.map((gap) => (
                      <div
                        key={gap.label}
                        className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2"
                      >
                        <span className="text-xs text-slate-400">{gap.label}</span>
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
                    <Zap className="h-3.5 w-3.5 shrink-0 text-blue-400" aria-hidden />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      AI systems deployed
                    </span>
                  </div>
                  <div className="space-y-2">
                    {deployedSystems.map((system) => (
                      <div key={system} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" aria-hidden />
                        <span className="text-xs text-slate-300">{system}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact summary */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-blue-500/15 bg-blue-500/10 p-3 text-center">
                    <p className="text-lg font-bold text-blue-300">&lt; 5 min</p>
                    <p className="mt-0.5 text-[10px] text-slate-500">avg response time</p>
                  </div>
                  <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/10 p-3 text-center">
                    <p className="text-lg font-bold text-emerald-300">24/7</p>
                    <p className="mt-0.5 text-[10px] text-slate-500">lead capture active</p>
                  </div>
                </div>

                <p className="mt-3 text-center text-[10px] text-slate-600">
                  Illustrative example · results vary by workflow
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Live demo gate ────────────────────────────────────────────── */}
        <TryLiveDemoMarketingGate>
          <div className="mx-auto mt-16 max-w-md border-t border-white/[0.06] pt-10 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Prefer to explore first?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Open the client portal with sample data. No account needed.
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
