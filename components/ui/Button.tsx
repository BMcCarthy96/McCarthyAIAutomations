import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  href?: string;
  /** Next.js Link only: set false for auth handoff routes like `/demo`. */
  prefetch?: boolean;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      href,
      prefetch = true,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background)] disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
      primary:
        "bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-indigo-500 shadow-lg shadow-indigo-500/25",
      secondary:
        "glass text-white hover:bg-white/10 focus:ring-white/30 border border-white/10",
      ghost: "text-zinc-300 hover:text-white hover:bg-white/5 focus:ring-white/20",
      outline:
        "border-2 border-white/20 text-white hover:bg-white/10 focus:ring-white/30",
      danger:
        "bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-500 border border-rose-500/50 shadow-lg shadow-rose-900/30",
    };
    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    const classes = cn(base, variants[variant], sizes[size], className);

    if (href) {
      return (
        <Link href={href} prefetch={prefetch} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type={props.type ?? "button"}
        className={classes}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
