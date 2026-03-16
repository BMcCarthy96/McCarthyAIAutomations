import { formatDisplayDate } from "@/lib/utils";
import type { ProjectActivityItem } from "@/lib/portal-timeline";
import {
  CheckCircle,
  Clock,
  FileText,
  MessageCircle,
} from "lucide-react";

const typeIconMap: Record<
  ProjectActivityItem["type"],
  { icon: typeof FileText; color: string }
> = {
  update: { icon: FileText, color: "text-indigo-400" },
  milestone: { icon: CheckCircle, color: "text-emerald-400" },
  support: { icon: MessageCircle, color: "text-amber-300" },
};

interface ProjectTimelineProps {
  items: ProjectActivityItem[];
}

export function ProjectTimeline({ items }: ProjectTimelineProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-zinc-500" />
          <div>
            <p className="font-medium text-white">No activity yet</p>
            <p className="mt-0.5 text-sm text-zinc-400">
              Updates and milestones will appear here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ol className="relative space-y-4 border-l border-white/10 pl-4">
      {items.map((item, index) => {
        const { icon: Icon, color } = typeIconMap[item.type];
        const isLast = index === items.length - 1;
        return (
          <li key={`${item.type}-${item.createdAt}-${index}`} className="relative pl-4">
            <span className="absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--background)]">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
            </span>
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 ${color}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-white">{item.title}</p>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-zinc-400">
                    {item.projectName}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-400">{item.description}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {formatDisplayDate(item.createdAt)}
                </p>
              </div>
            </div>
            {!isLast && (
              <span className="pointer-events-none absolute left-0 top-5 h-full border-l border-white/10" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

