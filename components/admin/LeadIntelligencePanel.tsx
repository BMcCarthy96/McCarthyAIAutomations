"use client";

// Added lead webhook url

import { useState } from "react";
import type { AdminSupportDetail } from "@/lib/support/types";
import { LeadAiListBadge } from "@/components/admin/LeadAiListBadge";
import { RerunLeadAiAnalysisForm } from "@/components/admin/RerunLeadAiAnalysisForm";
import { formatDisplayDate } from "@/lib/utils";
import { Brain, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

function UrgencyPill({ value }: { value: string | null }) {
  if (!value) return null;
  const v = value.toLowerCase();
  const cls =
    v === "high"
      ? "border-red-400/30 bg-red-500/12 text-red-100"
      : v === "medium"
        ? "border-amber-400/30 bg-amber-500/12 text-amber-100"
        : v === "low"
          ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-100"
          : "border-white/10 bg-white/[0.05] text-zinc-400";
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
        cls
      )}
    >
      Urgency: {value}
    </span>
  );
}

export function LeadIntelligencePanel({ request }: { request: AdminSupportDetail }) {
  const [replyOpen, setReplyOpen] = useState(false);

  if (request.source !== "public") {
    return null;
  }

  const s = request.aiLeadAnalysisStatus;
  const hasResults =
    s === "completed" &&
    (request.aiLeadSummary ||
      request.aiNextAction ||
      request.aiSuggestedReply);

  const notYetRun = s == null;

  return (
    <div className="rounded-2xl border border-violet-400/20 bg-gradient-to-b from-violet-500/[0.08] to-transparent p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-200/90">
            <Brain className="h-4 w-4" aria-hidden />
            Lead intelligence
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">
            AI classification from the submitted message only. Use alongside your
            Zapier / sheet workflow—this is the in-app system of record.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <LeadAiListBadge
            source="public"
            status={request.aiLeadAnalysisStatus}
            temperature={request.aiLeadTemperature}
          />
          <UrgencyPill value={request.aiUrgency} />
        </div>
      </div>

      {notYetRun ? (
        <p className="mt-4 text-sm text-zinc-400">
          No AI analysis on file for this lead yet. Use re-run to classify it
          (helpful for older submissions created before the Lead Engine).
        </p>
      ) : null}

      {s === "pending" || s === "processing" ? (
        <p className="mt-4 text-sm text-zinc-400">
          Analysis is queued or running. Refresh in a few seconds.
        </p>
      ) : null}

      {s === "failed" && request.aiErrorMessage ? (
        <p className="mt-4 rounded-lg border border-red-400/20 bg-red-500/5 p-3 font-mono text-xs leading-relaxed text-red-200/80">
          {request.aiErrorMessage}
        </p>
      ) : null}

      {s === "skipped" ? (
        <p className="mt-4 text-sm text-zinc-400">
          Skipped (no <code className="text-zinc-500">OPENAI_API_KEY</code> on
          the server, or environment not configured for analysis).
        </p>
      ) : null}

      {hasResults ? (
        <div className="mt-5 space-y-4 border-t border-white/10 pt-5">
          {request.aiLeadSummary ? (
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Summary
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-200">
                {request.aiLeadSummary}
              </p>
            </div>
          ) : null}

          <dl className="grid gap-3 sm:grid-cols-2">
            {request.aiBusinessType ? (
              <div>
                <dt className="text-xs text-zinc-500">Business type</dt>
                <dd className="mt-0.5 text-sm text-zinc-200">
                  {request.aiBusinessType}
                </dd>
              </div>
            ) : null}
            {request.aiLikelyService ? (
              <div>
                <dt className="text-xs text-zinc-500">Likely service fit</dt>
                <dd className="mt-0.5 text-sm text-zinc-200">
                  {request.aiLikelyService}
                </dd>
              </div>
            ) : null}
            {request.aiBudgetSignal ? (
              <div>
                <dt className="text-xs text-zinc-500">Budget signal</dt>
                <dd className="mt-0.5 text-sm capitalize text-zinc-200">
                  {request.aiBudgetSignal}
                </dd>
              </div>
            ) : null}
            {request.aiConfidence != null ? (
              <div>
                <dt className="text-xs text-zinc-500">Confidence</dt>
                <dd className="mt-0.5 text-sm tabular-nums text-zinc-200">
                  {Math.round(request.aiConfidence * 100)}%
                </dd>
              </div>
            ) : null}
          </dl>

          {request.aiNextAction ? (
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Recommended next action
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-200">
                {request.aiNextAction}
              </p>
            </div>
          ) : null}

          {request.aiFollowUpTone ? (
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Suggested tone
              </h3>
              <p className="mt-1.5 text-sm text-zinc-300">{request.aiFollowUpTone}</p>
            </div>
          ) : null}

          {request.aiClassificationNote ? (
            <div className="rounded-lg border border-white/[0.06] bg-black/20 p-3">
              <h3 className="text-xs font-medium text-zinc-500">Why this read</h3>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                {request.aiClassificationNote}
              </p>
            </div>
          ) : null}

          {request.aiSuggestedReply ? (
            <div>
              <button
                type="button"
                onClick={() => setReplyOpen((o) => !o)}
                className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-medium text-zinc-200 transition-colors hover:bg-white/[0.07]"
              >
                <span>Suggested reply draft</span>
                {replyOpen ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-zinc-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-zinc-500" />
                )}
              </button>
              {replyOpen ? (
                <div className="mt-2 rounded-xl border border-white/[0.06] bg-black/25 p-4 text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap">
                  {request.aiSuggestedReply}
                </div>
              ) : null}
            </div>
          ) : null}

          <p className="text-xs text-zinc-600">
            {request.aiProcessedAt
              ? `Processed ${formatDisplayDate(request.aiProcessedAt)}`
              : null}
            {request.aiModel ? ` · ${request.aiModel}` : null}
          </p>
        </div>
      ) : null}

      <div className="mt-6 border-t border-white/10 pt-5">
        <RerunLeadAiAnalysisForm requestId={request.id} />
      </div>
    </div>
  );
}
