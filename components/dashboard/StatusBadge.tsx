import { CheckCircle2, Clock, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const config = {
  active: {
    icon: CheckCircle2,
    label: "Live",
    className: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
  in_progress: {
    icon: Clock,
    label: "In progress",
    className: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
  pending: {
    icon: Circle,
    label: "Scheduled",
    className: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
  },
} as const;

type Status = keyof typeof config;

interface StatusBadgeProps {
  status: Status;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const c = config[status] ?? config.pending;
  const Icon = c.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        c.className,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label ?? c.label}
    </span>
  );
}
