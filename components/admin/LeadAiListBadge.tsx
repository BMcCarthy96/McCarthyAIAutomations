import type {
  AiLeadAnalysisStatus,
  AiLeadTemperature,
} from "@/lib/lead-ai/types";
import { cn } from "@/lib/utils";

/** Admin support list: AI lead temperature / pipeline state for public rows. */
export function LeadAiListBadge({
  source,
  status,
  temperature,
}: {
  source: "client" | "public";
  status: AiLeadAnalysisStatus | null;
  temperature: AiLeadTemperature | null;
}) {
  if (source !== "public") {
    return (
      <span className="text-xs text-zinc-600 tabular-nums" title="Client portal">
        —
      </span>
    );
  }

  if (status === "pending" || status === "processing") {
    return (
      <span
        className={cn(
          "inline-flex rounded-full border border-violet-400/25 bg-violet-500/12 px-2.5 py-0.5 text-xs font-semibold text-violet-100"
        )}
        title="AI analysis running or queued"
      >
        {status === "processing" ? "Analyzing…" : "Queued"}
      </span>
    );
  }

  if (status === "failed") {
    return (
      <span
        className="inline-flex rounded-full border border-red-400/30 bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-200/90"
        title="Open admin detail to retry or inspect"
      >
        AI failed
      </span>
    );
  }

  if (status === "skipped") {
    return (
      <span
        className="inline-flex rounded-full border border-zinc-500/30 bg-zinc-600/15 px-2.5 py-0.5 text-xs font-semibold text-zinc-400"
        title="No OPENAI_API_KEY or analysis disabled for this environment"
      >
        AI off
      </span>
    );
  }

  const temp = temperature ?? "unknown";
  const styles: Record<AiLeadTemperature, string> = {
    hot: "border-rose-400/35 bg-gradient-to-r from-rose-500/20 to-orange-500/15 text-rose-100",
    warm: "border-amber-400/30 bg-amber-500/12 text-amber-100",
    cold: "border-sky-400/25 bg-sky-500/10 text-sky-100",
    unknown: "border-white/10 bg-white/[0.05] text-zinc-400",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
        styles[temp]
      )}
    >
      {temp}
    </span>
  );
}
