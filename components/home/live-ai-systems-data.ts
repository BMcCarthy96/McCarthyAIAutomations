/**
 * Homepage “Live AI Systems” cards — copy matches real product capabilities (portal assistant,
 * public widget, lead analysis, booking/follow-up, email). CTAs use routes or the assistant widget.
 */

export type LiveAiSystemIconId =
  | "knowledge"
  | "leadEngine"
  | "booking"
  | "email";

/** Sets visitor expectations: live product vs descriptive service / touchpoint. */
export type LiveAiSystemCardBadge = "live_system" | "workflow_overview";

export interface LiveAiSystemCard {
  id: string;
  title: string;
  problem: string;
  solution: string;
  /** Short capability lines — what AI / automation does in this system */
  capabilities: string[];
  ctaLabel: string;
  /** App route, or `#` when `isWidgetTrigger` opens the marketing assistant widget instead */
  ctaHref: string;
  iconId: LiveAiSystemIconId;
  /** Optional micro-label on the card (live vs overview). */
  cardBadge?: LiveAiSystemCardBadge;
  /** When true, CTA opens the floating assistant (no navigation, no Clerk). */
  isWidgetTrigger?: boolean;
}

export const LIVE_AI_SYSTEM_CARDS: LiveAiSystemCard[] = [
  {
    id: "knowledge-assistant",
    title: "AI Knowledge Assistant",
    problem:
      "Teams waste time hunting across updates, milestones, FAQs, and support threads for answers that should be instant.",
    solution:
      "Ask questions about our services, workflows, or platform — our AI assistant is available anytime. It answers in real time grounded in McCarthy AI knowledge (marketing site, public widget). Signed-in clients get richer portal context in the dashboard.",
    capabilities: [
      "Real-time answers grounded in platform knowledge",
      "Cites sources and stays within scoped context",
      "Always available via the floating assistant — no sign-in required to start on the marketing site",
    ],
    ctaLabel: "Try the assistant",
    ctaHref: "#",
    iconId: "knowledge",
    cardBadge: "live_system",
    isWidgetTrigger: true,
  },
  {
    id: "lead-engine",
    title: "AI Lead Engine",
    problem:
      "New inquiries often sit in inboxes without fast triage, clear summaries, or a consistent prioritization signal.",
    solution:
      "An AI-assisted intake path behind the scenes that helps our team classify, summarize, and prioritize—paired with the same consultation entry point prospects use on the site.",
    capabilities: [
      "Analyzes incoming consultation-style requests",
      "Surfaces fit, urgency, and suggested next steps for human review",
      "Keeps follow-up moving instead of stalling in the queue",
    ],
    ctaLabel: "See the intake touchpoint",
    ctaHref: "/contact",
    iconId: "leadEngine",
    cardBadge: "workflow_overview",
  },
  {
    id: "booking-follow-up",
    title: "Booking & follow-up automation",
    problem:
      "Momentum drops between first contact, scheduling, and the nudges that actually get calls on the calendar.",
    solution:
      "Automation that connects lead capture to booking, reminders, and pipeline-style visibility. Full flows often use your calendar stack and ops tools—not a separate public “booking demo” page.",
    capabilities: [
      "Tracks progress from request toward booked calls",
      "Updates pipeline-style state for operational visibility",
      "Reduces manual back-and-forth on scheduling and follow-up",
    ],
    ctaLabel: "Read service overview",
    ctaHref: "/services/lead-capture-appointment",
    iconId: "booking",
    cardBadge: "workflow_overview",
  },
  {
    id: "email-automation",
    title: "Email automation",
    problem:
      "Manual confirmations and follow-ups are slow, easy to forget, and hard to keep consistent at scale.",
    solution:
      "Transactional and follow-up messaging wired into delivery workflows—confirmations, internal alerts, and nurture where it fits. Behavior is configured per engagement, not a single public playground.",
    capabilities: [
      "Sends confirmations and handoff notifications",
      "Notifies the team when new leads need attention",
      "Supports structured follow-up alongside CRM and calendar tools",
    ],
    ctaLabel: "Read workflow overview",
    ctaHref: "/services/crm-workflow-automation",
    iconId: "email",
    cardBadge: "workflow_overview",
  },
];
