"use client";

import { Button } from "@/components/ui/Button";
import { useShowTryLiveDemoCta } from "@/hooks/useShowTryLiveDemoCta";

export function TryLiveDemoButton({
  variant = "outline",
  size = "lg",
  className,
  gated = true,
  label = "Portal demo",
}: {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  /** When true, hide for the demo Clerk user (default). Set false only if parent already gates. */
  gated?: boolean;
  /** Signed-in Clerk demo portal; not the marketing-site assistant widget. */
  label?: string;
}) {
  const show = useShowTryLiveDemoCta();
  if (gated && !show) return null;

  return (
    <Button
      href="/demo"
      prefetch={false}
      variant={variant}
      size={size}
      className={className}
    >
      {label}
    </Button>
  );
}
