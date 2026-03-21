import type { AutomationMetric } from "@/lib/portal-metrics";
import { GlassCard } from "@/components/ui/GlassCard";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutomationMetricsProps {
  metrics: AutomationMetric[];
  /** Small caps label above the grid (default: time window hint). */
  subheading?: string;
}

const FEATURED_IDS = new Set(["revenue", "hours"]);

const featuredStyles: Record<
  string,
  { border: string; badge: string; value: string }
> = {
  hours: {
    border: "border-emerald-500/25 bg-emerald-500/[0.06]",
    badge: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
    value: "text-emerald-300",
  },
  revenue: {
    border: "border-amber-500/25 bg-amber-500/[0.06]",
    badge: "border-amber-500/25 bg-amber-500/10 text-amber-200",
    value: "text-amber-200",
  },
};

const restValueAccent: Record<string, string> = {
  leads: "text-indigo-300",
  calls: "text-violet-300",
  appointments: "text-cyan-300",
};

export function AutomationMetrics({
  metrics,
  subheading = "Performance indicators",
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
          {featured.map((metric) => {
            const styles = featuredStyles[metric.id] ?? featuredStyles.hours;
            return (
              <GlassCard
                key={metric.id}
                hover={false}
                variant="premium"
                className={cn("relative overflow-hidden", styles.border)}
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
                <div className="relative flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-zinc-400">{metric.label}</p>
                    <p
                      className={cn(
                        "mt-2 text-3xl font-bold tracking-tight tabular-nums sm:text-4xl",
                        styles.value
                      )}
                    >
                      {metric.value}
                    </p>
                    {metric.helper ? (
                      <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                        {metric.helper}
                      </p>
                    ) : null}
                  </div>
                  <span
                    className={cn(
                      "flex shrink-0 items-center gap-0.5 rounded-lg border px-2 py-1 text-xs font-semibold",
                      styles.badge
                    )}
                    aria-hidden
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    Impact
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {rest.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          {rest.map((metric) => (
            <GlassCard key={metric.id} hover={false} variant="default" className="flex flex-col justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-400">{metric.label}</p>
                <p
                  className={cn(
                    "mt-3 text-2xl font-bold tracking-tight tabular-nums text-white sm:text-3xl",
                    restValueAccent[metric.id]
                  )}
                >
                  {metric.value}
                </p>
              </div>
              {metric.helper ? (
                <p className="mt-3 text-xs leading-relaxed text-zinc-500">{metric.helper}</p>
              ) : null}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
