"use client";

import { useActionState, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { askAssistantAction } from "@/lib/assistant-actions";
import type { AssistantAskState } from "@/lib/assistant/types";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Sparkles, BookOpen, AlertCircle } from "lucide-react";

const initialState: AssistantAskState = { success: false, error: "" };

export function KnowledgeAssistantPanel({
  openAiConfigured,
}: {
  openAiConfigured: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    askAssistantAction,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success === true) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="space-y-8">
      {!openAiConfigured ? (
        <div
          className="flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/[0.08] px-4 py-3 text-sm text-amber-100/95"
          role="status"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
          <div>
            <p className="font-medium text-amber-50">Assistant is in setup mode</p>
            <p className="mt-1 text-amber-100/80">
              Add <span className="font-mono text-xs">OPENAI_API_KEY</span> to your
              server environment to enable AI answers. You can still read how the
              assistant works below.
            </p>
          </div>
        </div>
      ) : null}

      <GlassCard
        hover={false}
        variant="premium"
        className="border-indigo-400/15 bg-gradient-to-br from-indigo-500/[0.07] via-transparent to-violet-500/[0.04] px-6 py-6 sm:px-8 sm:py-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/18 ring-1 ring-indigo-400/25">
              <Sparkles className="h-6 w-6 text-indigo-200" aria-hidden />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-white sm:text-xl">
                How it works
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
                Answers use{" "}
                <span className="text-zinc-300">only your account</span>—projects,
                milestones, updates, support threads, billing summaries, and your
                service plans—plus{" "}
                <span className="text-zinc-300">general McCarthy FAQs</span>. Nothing
                from other clients is ever included. If the portal does not contain
                enough detail, the assistant will say so instead of guessing.
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      <form ref={formRef} action={formAction} className="space-y-4">
        <label
          htmlFor="assistant-question"
          className="block text-sm font-medium text-zinc-300"
        >
          Your question
        </label>
        <textarea
          id="assistant-question"
          name="question"
          required
          rows={4}
          maxLength={2000}
          disabled={isPending || !openAiConfigured}
          placeholder="e.g. What is the next milestone on my lead capture project?"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isPending || !openAiConfigured}
          >
            {isPending ? "Thinking…" : "Get answer"}
          </Button>
          <Link
            href="/dashboard/support"
            className="text-sm font-semibold text-indigo-300/90 underline-offset-2 transition-colors hover:text-indigo-200 hover:underline"
          >
            Need human help? Open support
          </Link>
        </div>
      </form>

      {state.success === false && state.error ? (
        <div
          className="flex gap-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3 text-sm text-amber-100/95"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300/90" />
          <p>{state.error}</p>
        </div>
      ) : null}

      {state.success === true ? (
        <div className="space-y-6">
          {state.insufficientContext ? (
            <div className="flex gap-3 rounded-xl border border-zinc-500/25 bg-white/[0.04] px-4 py-3 text-sm text-zinc-300">
              <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" />
              <p>
                Limited grounded information was available for this question. Review
                the answer carefully and check{" "}
                <Link href="/dashboard/updates" className="text-indigo-300 underline-offset-2 hover:underline">
                  Project updates
                </Link>{" "}
                or{" "}
                <Link href="/dashboard/support" className="text-indigo-300 underline-offset-2 hover:underline">
                  Support
                </Link>{" "}
                for the full picture.
              </p>
            </div>
          ) : null}

          <GlassCard
            hover={false}
            variant="default"
            className="border-white/[0.08] px-6 py-6 sm:px-8 sm:py-7"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Answer
            </p>
            <div className="mt-4 max-w-none text-sm leading-relaxed text-zinc-300">
              <AssistantAnswerMarkdown text={state.answer} />
            </div>
          </GlassCard>

          {state.sources.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Sources used
              </p>
              <ul className="mt-3 space-y-2">
                {state.sources.map((s) => (
                  <li
                    key={`${s.ref}-${s.label}`}
                    className="flex gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-sm text-zinc-300"
                  >
                    <span className="shrink-0 font-mono text-xs text-indigo-300/90">
                      {s.ref}
                    </span>
                    <span>{s.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/** Minimal markdown: **bold**, bullets (- item), newlines. Avoid full MD parser dep. */
function AssistantAnswerMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <ul key={i} className="my-1 list-disc pl-5 text-zinc-300">
              <li>{renderInline(trimmed.slice(2))}</li>
            </ul>
          );
        }
        if (trimmed === "") {
          return <br key={i} />;
        }
        return <p key={i}>{renderInline(line)}</p>;
      })}
    </div>
  );
}

function renderInline(s: string): ReactNode {
  const parts = s.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, j) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) {
      return (
        <strong key={j} className="font-semibold text-zinc-100">
          {m[1]}
        </strong>
      );
    }
    return part;
  });
}
