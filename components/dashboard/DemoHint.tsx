"use client";

import { useDemoPortal } from "./DemoPortalProvider";

const COPY: Record<
  "metrics" | "milestones" | "billing",
  string
> = {
  metrics:
    "Figures here aggregate your linked project metrics. In a live account they track real automation outcomes.",
  milestones:
    "Steps here reflect your rollout plan. In production, your team updates dates as each automation moves toward go-live.",
  billing:
    "Invoice lines reflect what your account team publishes. Payment links use Stripe when enabled.",
};

type DemoHintTopic = keyof typeof COPY;

export function DemoHint({
  topic,
  className = "",
}: {
  topic: DemoHintTopic;
  className?: string;
}) {
  const isDemo = useDemoPortal();
  if (!isDemo) return null;

  return (
    <p
      className={`mt-2 max-w-2xl text-xs leading-relaxed text-amber-200/75 ${className}`}
      role="note"
    >
      {COPY[topic]}
    </p>
  );
}
