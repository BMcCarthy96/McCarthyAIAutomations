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
    <GlassCard hover={false} className={cn(compact && "py-4", className)}>
      <div className={`flex flex-col items-center text-center ${compact ? "py-2" : "py-6"}`}>
        <Icon className="h-10 w-10 text-zinc-500 sm:h-12 sm:w-12" aria-hidden />
        <h3 className="mt-3 text-base font-semibold text-white sm:text-lg">{title}</h3>
        <p className="mt-1 max-w-sm text-sm text-zinc-400">{description}</p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </GlassCard>
  );
}
