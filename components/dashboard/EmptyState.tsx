import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  /** Use compact padding when inside a card or tight layout. */
  compact?: boolean;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  compact = false,
  className,
}: EmptyStateProps) {
  return (
    <GlassCard
      hover={false}
      variant="inset"
      className={cn(
        "border-dashed border-white/15 bg-white/[0.02]",
        compact && "py-5",
        className
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center text-center",
          compact ? "py-3" : "py-8"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-center rounded-2xl bg-indigo-500/10 ring-1 ring-indigo-500/25",
            compact ? "p-3" : "p-4"
          )}
        >
          <Icon
            className={cn(
              "text-indigo-300/90",
              compact ? "h-8 w-8" : "h-10 w-10 sm:h-11 sm:w-11"
            )}
            aria-hidden
          />
        </div>
        <h3
          className={cn(
            "font-semibold text-white",
            compact ? "mt-3 text-base" : "mt-4 text-lg sm:text-xl"
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "max-w-md text-zinc-400",
            compact ? "mt-1 text-sm" : "mt-2 text-sm leading-relaxed"
          )}
        >
          {description}
        </p>
        {action && <div className="mt-5">{action}</div>}
      </div>
    </GlassCard>
  );
}
