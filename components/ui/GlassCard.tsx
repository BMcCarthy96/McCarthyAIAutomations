import Link from "next/link";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  /** When set without `href`, renders a full-width button (e.g. open assistant widget). */
  onClick?: () => void;
  /** Set false for routes that must not be prefetched (e.g. auth handoffs like `/demo`). */
  prefetch?: boolean;
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
  onClick,
  prefetch = true,
  hover = true,
  variant = "default",
}: GlassCardProps) {
  const variantStyles = {
    default:
      "border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-lg shadow-black/20",
    premium:
      "border border-white/[0.09] bg-gradient-to-b from-white/[0.08] to-white/[0.025] shadow-xl shadow-indigo-950/20",
    inset:
      "border border-white/[0.06] bg-white/[0.025] shadow-none",
  };

  const cardClasses = cn(
    "rounded-2xl p-6 backdrop-blur-xl",
    variantStyles[variant],
    hover &&
      variant !== "inset" &&
      "transition-all duration-300 hover:border-white/15 hover:from-white/[0.09] hover:to-white/[0.04] hover:shadow-indigo-950/25",
    className
  );

  if (href) {
    return (
      <Link href={href} prefetch={prefetch} className={cardClasses}>
        {children}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(cardClasses, "w-full cursor-pointer text-left")}
      >
        {children}
      </button>
    );
  }

  return <div className={cardClasses}>{children}</div>;
}
