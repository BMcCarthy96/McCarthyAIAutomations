import { formatDisplayDate } from "@/lib/utils";
import type { ProjectActivityItem } from "@/lib/portal-timeline";
import { GlassCard } from "@/components/ui/GlassCard";
import { CheckCircle, Clock, FileText, MessageCircle } from "lucide-react";

const typeIconMap: Record<
  ProjectActivityItem["type"],
  { icon: typeof FileText; color: string; bg: string }
> = {
  update: {
    icon: FileText,
    color: "text-indigo-300",
    bg: "bg-indigo-500/12",
  },
  milestone: {
    icon: CheckCircle,
    color: "text-emerald-300",
    bg: "bg-emerald-500/12",
  },
  support: {
    icon: MessageCircle,
    color: "text-amber-200",
    bg: "bg-amber-500/12",
  },
};

interface ProjectTimelineProps {
  items: ProjectActivityItem[];
}

export function ProjectTimeline({ items }: ProjectTimelineProps) {
  if (items.length === 0) {
    return (
      <GlassCard hover={false} variant="inset" className="border-dashed border-white/12 py-6">
        <div className="flex items-center gap-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-500/10">
            <Clock className="h-5 w-5 text-zinc-400" />
          </div>
          <div>
            <p className="font-semibold text-white">No activity yet</p>
            <p className="mt-0.5 text-sm text-zinc-500">
              Updates and milestones will appear here as your projects move forward.
            </p>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard hover={false} className="p-6 sm:p-8">
      <ol className="relative space-y-0">
        {items.map((item, index) => {
          const { icon: Icon, color, bg } = typeIconMap[item.type];
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.type}-${item.createdAt}-${index}`} className="relative flex gap-5 pb-10 last:pb-0">
              {!isLast ? (
                <span
                  className="absolute left-[17px] top-10 bottom-0 w-px bg-gradient-to-b from-indigo-500/40 to-transparent"
                  aria-hidden
                />
              ) : null}
              <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                <div className={`flex h-full w-full items-center justify-center rounded-xl ${bg}`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-white">{item.title}</p>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-zinc-400">
                    {item.projectName}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400">{item.description}</p>
                <p className="mt-2 text-xs font-medium text-zinc-600">
                  {formatDisplayDate(item.createdAt)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </GlassCard>
  );
}
