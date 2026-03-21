/**
 * Client-side copy for project cards: inferred outcome from project name (no extra DB fields).
 * Uses keyword heuristics; safe fallbacks when nothing matches.
 */

import type { ProjectStatus } from "@/lib/types";

type Rule = { test: RegExp; line: string };

const OUTCOME_RULES: Rule[] = [
  {
    test: /voice|phone|ivr|call|dial|inbound|reception|voicemail/i,
    line: "Automates inbound calls and routing so leads reach the right person without manual handoffs.",
  },
  {
    test: /chat|bot|widget|conversation|messenger|live chat/i,
    line: "Engages site visitors and captures intent 24/7—so you never miss a conversation.",
  },
  {
    test: /lead|capture|form|landing|pipeline|inquiry/i,
    line: "Captures and qualifies leads, then routes them into your pipeline automatically.",
  },
  {
    test: /email|sequence|nurture|drip|outreach|reply/i,
    line: "Runs follow-up and outreach sequences so prospects hear from you without manual chasing.",
  },
  {
    test: /book|calendar|schedul|appointment|slot/i,
    line: "Connects prospects to booking slots and reduces back-and-forth scheduling.",
  },
  {
    test: /crm|hubspot|salesforce|pipeline sync|sync/i,
    line: "Keeps your CRM in sync so activity and follow-ups stay visible to your team.",
  },
  {
    test: /workflow|zap|integrat|api|webhook|sync/i,
    line: "Connects your tools and runs workflows in the background—no copy-paste between systems.",
  },
  {
    test: /report|analytics|dashboard|metric|insight/i,
    line: "Surfaces the metrics that matter so you can see impact without digging through spreadsheets.",
  },
];

const DEFAULT_OUTCOME =
  "An active automation delivering for your business—track rollout, milestones, and team updates below.";

/** One-line “what this automation does” for the project card. */
export function getProjectAutomationOutcomeLine(projectName: string): string {
  const trimmed = projectName.trim();
  if (!trimmed) return DEFAULT_OUTCOME;
  for (const { test, line } of OUTCOME_RULES) {
    if (test.test(trimmed)) return line;
  }
  return DEFAULT_OUTCOME;
}

/** Short label for the status strip (premium dashboard tone). */
export function getProjectStatusHeadline(status: ProjectStatus): string {
  switch (status) {
    case "active":
      return "Running in production";
    case "in_progress":
      return "Build & integration in progress";
    case "pending":
      return "Scheduled to start";
    case "completed":
      return "Delivered";
    default:
      return "In progress";
  }
}
