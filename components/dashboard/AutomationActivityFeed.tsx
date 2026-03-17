import Link from "next/link";
import { formatDisplayDate } from "@/lib/utils";
import type { AutomationEventItem } from "@/lib/portal-data";
import {
  CheckCircle,
  FileText,
  Phone,
  UserPlus,
  Zap,
  ArrowRight,
} from "lucide-react";

const EVENT_ICON_MAP: Record<string, { icon: typeof Zap; color: string }> = {
  milestone_completed: { icon: CheckCircle, color: "text-emerald-400" },
  update_posted: { icon: FileText, color: "text-indigo-400" },
  call_handled: { icon: Phone, color: "text-sky-400" },
  lead_captured: { icon: UserPlus, color: "text-amber-400" },
};

function getIconForEventType(eventType: string) {
  return (
    EVENT_ICON_MAP[eventType] ?? { icon: Zap, color: "text-indigo-400" }
  );
}

interface AutomationActivityFeedProps {
  items: AutomationEventItem[];
  showViewAll?: boolean;
}

export function AutomationActivityFeed({
  items,
  showViewAll = false,
}: AutomationActivityFeedProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <ol className="relative space-y-4 border-l border-white/10 pl-4">
        {items.map((item, index) => {
          const { icon: Icon, color } = getIconForEventType(item.eventType);
          return (
            <li key={item.id} className="relative pl-4">
              <span className="absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--background)]">
                <span className="h-2 w-2 rounded-full bg-indigo-400" />
              </span>
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 ${color}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-zinc-400">
                      {item.projectName}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-white">{item.description}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {formatDisplayDate(item.createdAt)}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      {showViewAll && (
        <Link
          href="/dashboard/activity"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300"
        >
          View all activity
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
