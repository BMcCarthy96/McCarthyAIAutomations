import type { AutomationMetric } from "@/lib/portal-metrics";
import { GlassCard } from "@/components/ui/GlassCard";
import { TrendingUp } from "lucide-react";

interface AutomationMetricsProps {
  metrics: AutomationMetric[];
  /** Small caps label above the grid (default: time window hint). */
  subheading?: string;
}

const FEATURED_IDS = new Set(["revenue", "hours"]);

export function AutomationMetrics({
  metrics,
  subheading = "Last 30 days",
}: AutomationMetricsProps) {
  const featured = metrics.filter((m) => FEATURED_IDS.has(m.id));
  const rest = metrics.filter((m) => !FEATURED_IDS.has(m.id));

  return (
    <div className="space-y-5">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        {subheading}
      </p>

      {featured.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map((metric) => (
            <GlassCard
              key={metric.id}
              hover={false}
              className="relative border-emerald-500/20 bg-emerald-500/5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-zinc-400">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    {metric.value}
                  </p>
                  {metric.helper && (
                    <p className="mt-2 text-xs text-zinc-500">
                      {metric.helper}
                    </p>
                  )}
                </div>
                <span
                  className="flex shrink-0 items-center gap-0.5 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-300"
                  aria-hidden
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  ROI
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          {rest.map((metric) => (
            <GlassCard
              key={metric.id}
              hover={false}
              className="flex flex-col justify-between"
            >
              <div>
                <p className="text-sm font-medium text-zinc-400">
                  {metric.label}
                </p>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {metric.value}
                </p>
              </div>
              {metric.helper && (
                <p className="mt-3 text-xs text-zinc-500">{metric.helper}</p>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
