import { cn } from "@/lib/utils";
import { AD } from "./admin-ui";

/** Section heading + optional card wrapper for admin pages (matches portal hierarchy). */
export function AdminSection({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-4", className)}>
      <div>
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cn(
            "text-lg font-semibold tracking-tight text-white",
            eyebrow ? "mt-2" : ""
          )}
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-zinc-400">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function AdminCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(AD.card, className)}>{children}</div>;
}
