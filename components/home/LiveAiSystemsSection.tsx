"use client";

import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  Mail,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { TryLiveDemoButton } from "@/components/home/TryLiveDemoButton";
import { TryLiveDemoMarketingGate } from "@/components/home/TryLiveDemoMarketingGate";
import {
  LIVE_AI_SYSTEM_CARDS,
  type LiveAiSystemCardBadge,
  type LiveAiSystemIconId,
} from "@/components/home/live-ai-systems-data";

const CARD_BADGE_STYLES: Record<
  LiveAiSystemCardBadge,
  { label: string; className: string }
> = {
  live_system: {
    label: "Live system",
    className:
      "border-emerald-400/25 bg-emerald-500/10 text-emerald-200/90 ring-1 ring-emerald-400/10",
  },
  workflow_overview: {
    label: "Workflow overview",
    className:
      "border-white/[0.08] bg-white/[0.04] text-zinc-400 ring-1 ring-white/[0.04]",
  },
};

const ICONS: Record<LiveAiSystemIconId, LucideIcon> = {
  knowledge: BookOpen,
  leadEngine: Zap,
  booking: CalendarClock,
  email: Mail,
};

export function LiveAiSystemsSection() {
  return (
    <section
      id="live-ai-systems"
      className="relative border-y border-white/10 bg-zinc-950/45 px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="live-ai-systems-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_0%,rgba(99,102,241,0.1),transparent)]" />
      <div className="relative mx-auto max-w-7xl">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-indigo-300/90">
          Production systems
        </p>
        <h2
          id="live-ai-systems-heading"
          className="mt-3 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl"
        >
          Live AI systems in action
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-lg leading-relaxed text-zinc-400">
          These aren&apos;t mockups or generic service blurbs. They&apos;re real systems built into
          our platform—using LLMs, APIs, workflows, scoped knowledge, and product UX—to automate lead
          intake, booking and follow-up, client knowledge retrieval, and communication.
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {LIVE_AI_SYSTEM_CARDS.map((card) => {
            const Icon = ICONS[card.iconId];
            const isWidgetTrigger = card.isWidgetTrigger === true;
            return (
              <GlassCard
                key={card.id}
                href={isWidgetTrigger ? undefined : card.ctaHref}
                prefetch={!isWidgetTrigger && card.id !== "knowledge-assistant"}
                onClick={
                  isWidgetTrigger
                    ? () => {
                        window.dispatchEvent(new Event("open-assistant-widget"));
                      }
                    : undefined
                }
                variant="premium"
                className="group flex h-full flex-col text-left no-underline"
              >
                {card.cardBadge ? (
                  <span
                    className={`inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${CARD_BADGE_STYLES[card.cardBadge].className}`}
                  >
                    {CARD_BADGE_STYLES[card.cardBadge].label}
                  </span>
                ) : null}
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/20 transition-colors group-hover:bg-indigo-500/20 ${card.cardBadge ? "mt-3" : ""}`}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  <span className="font-medium text-zinc-400">Challenge: </span>
                  {card.problem}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                  <span className="font-medium text-zinc-200">How we solve it: </span>
                  {card.solution}
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  What AI &amp; automation do
                </p>
                <ul className="mt-2 space-y-1.5 text-sm leading-snug text-zinc-400">
                  {card.capabilities.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-indigo-400/80" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-300 transition-colors group-hover:text-indigo-200">
                  {card.ctaLabel}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </GlassCard>
            );
          })}
        </div>

        <div className="mt-14 flex flex-col items-center justify-center gap-4 border-t border-white/10 pt-12 text-center">
          <p className="max-w-xl text-sm text-zinc-400">
            You can interact with our AI assistant anytime using the chat in the bottom right — no
            sign-in required. For a signed-in sample portal with dashboard context, use Portal demo
            below. Book a consultation or browse services to map real workflows to your tools.
          </p>
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
            <TryLiveDemoMarketingGate>
              <TryLiveDemoButton variant="secondary" size="md" className="justify-center" />
            </TryLiveDemoMarketingGate>
            <Button href="/contact" variant="secondary" size="md">
              Book a consultation
            </Button>
            <Button href="/services" variant="ghost" size="md">
              Browse all services
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
