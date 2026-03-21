import { CheckCircle2, Clock, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const config = {
  active: {
    icon: CheckCircle2,
    label: "Live",
    className:
      "text-emerald-300 bg-emerald-500/10 border-emerald-400/22 shadow-[0_0_24px_-10px_rgba(52,211,153,0.3)]",
  },
  in_progress: {
    icon: Clock,
    label: "In progress",
    className: "text-amber-200 bg-amber-500/10 border-amber-400/22",
  },
  pending: {
    icon: Circle,
    label: "Scheduled",
    className: "text-zinc-300 bg-white/[0.06] border-white/[0.1]",
  },
  completed: {
    icon: CheckCircle2,
    label: "Completed",
    className: "text-emerald-200 bg-emerald-500/10 border-emerald-400/20",
  },
} as const;

export type ProjectStatusBadge = keyof typeof config;

interface StatusBadgeProps {
  status: ProjectStatusBadge;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const c = config[status] ?? config.pending;
  const Icon = c.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        c.className,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label ?? c.label}
    </span>
  );
}
