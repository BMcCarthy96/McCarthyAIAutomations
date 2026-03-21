import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  children: React.ReactNode;
  /** Small label above the title (e.g. “Reporting”). */
  eyebrow?: string;
  /** Muted line under the title. */
  description?: string;
  action?: { label: string; href: string };
  className?: string;
}

export function SectionTitle({
  children,
  eyebrow,
  description,
  action,
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6",
        className
      )}
    >
      <div className="min-w-0 flex-1 space-y-0">
        {eyebrow ? (
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cn(
            "font-semibold tracking-tight text-white sm:text-2xl",
            eyebrow ? "mt-2 text-xl" : "text-xl"
          )}
        >
          {children}
        </h2>
        {description ? (
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-zinc-500">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="shrink-0 text-sm font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
        >
          {action.label}
          <span aria-hidden> →</span>
        </Link>
      ) : null}
    </div>
  );
}
