import Link from "next/link";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  hover?: boolean;
  /**
   * `default` — standard portal panels.
   * `premium` — stronger depth (hero metrics, featured blocks).
   * `inset` — nested / list rows inside another card.
   */
  variant?: "default" | "premium" | "inset";
}

export function GlassCard({
  children,
  className,
  href,
  hover = true,
  variant = "default",
}: GlassCardProps) {
  const variantStyles = {
    default:
      "border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] shadow-xl shadow-black/25 ring-1 ring-white/5",
    premium:
      "border-white/10 bg-gradient-to-b from-white/[0.09] to-white/[0.03] shadow-2xl shadow-indigo-950/30 ring-1 ring-indigo-500/10",
    inset:
      "border-white/8 bg-white/[0.03] shadow-none ring-1 ring-white/[0.04]",
  };

  const cardClasses = cn(
    "rounded-2xl border p-6 backdrop-blur-xl",
    variantStyles[variant],
    hover &&
      variant !== "inset" &&
      "transition-all duration-300 hover:border-white/15 hover:from-white/[0.09] hover:to-white/[0.04] hover:shadow-indigo-950/25",
    className
  );

  if (href) {
    return (
      <Link href={href} className={cardClasses}>
        {children}
      </Link>
    );
  }

  return <div className={cardClasses}>{children}</div>;
}
