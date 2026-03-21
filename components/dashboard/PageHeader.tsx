import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  className?: string;
}

export function PageHeader({ title, subtitle, eyebrow, className }: PageHeaderProps) {
  return (
    <header className={cn("border-b border-white/[0.06] pb-10", className)}>
      {eyebrow ? (
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          {eyebrow}
        </p>
      ) : null}
      <h1
        className={cn(
          "font-bold tracking-tight text-white sm:text-4xl",
          eyebrow ? "mt-2 text-3xl" : "text-3xl"
        )}
      >
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-400">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
