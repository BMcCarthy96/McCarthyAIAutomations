import Link from "next/link";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  hover?: boolean;
}

export function GlassCard({
  children,
  className,
  href,
  hover = true,
}: GlassCardProps) {
  const cardClasses = cn(
    "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl",
    hover && "transition-all duration-300 glass-hover",
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
