import type { AutomationMetric } from "@/lib/portal-metrics";
import { GlassCard } from "@/components/ui/GlassCard";

interface AutomationMetricsProps {
  metrics: AutomationMetric[];
}

export function AutomationMetrics({ metrics }: AutomationMetricsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => (
        <GlassCard
          key={metric.id}
          hover={false}
          className="flex flex-col justify-between"
        >
          <div>
            <p className="text-sm font-medium text-zinc-400">
              {metric.label}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {metric.value}
            </p>
          </div>
          {metric.helper && (
            <p className="mt-3 text-xs text-zinc-500">{metric.helper}</p>
          )}
        </GlassCard>
      ))}
    </div>
  );
}

