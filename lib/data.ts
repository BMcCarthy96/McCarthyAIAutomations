import type {
  Service,
  PricingTier,
  Testimonial,
  FAQItem,
  Stat,
  DashboardQuickAction,
  HowItWorksStep,
  Client,
  ClientService,
  Project,
  Milestone,
  ProjectUpdate,
  SupportRequest,
  BillingRecord,
  ProjectWithDetails,
} from "@/lib/types";

/**
 * Static and mock data: service catalog, marketing content, and in-memory helpers for tests/local use.
 * Client portal reads come from Supabase only (lib/portal-data); no mock fallback in production.
 */

export const services: Service[] = [
  {
    id: "1",
    slug: "revenue-leak-audit",
    name: "Revenue Leak Audit & Workflow Map",
    tagline: "Find where revenue is slipping before you build anything",
    description: "We review your lead capture, follow-up, and pipeline workflow to identify where revenue may be leaking, then map the highest-value fix.",
    longDescription: "Before investing in a system, you need to know where the real gaps are. We audit your inbound lead flow, follow-up sequences, quote or proposal handling, and pipeline visibility. You get a clear workflow map with prioritized bottlenecks and a recommended first step. The map and recommendation are yours to keep, whether or not you move forward.",
    features: [
      "Review of lead capture and follow-up workflow",
      "Identification of missed revenue opportunities",
      "Pipeline and handoff gap analysis",
      "Workflow map with prioritized bottlenecks",
      "Recommended pilot scope and next steps",
    ],
    icon: "Search",
    highlights: ["Free audit", "Workflow map", "No obligation"],
  },
  {
    id: "2",
    slug: "no-dropped-leads",
    name: "No-Dropped-Leads Follow-Up System",
    tagline: "Every inquiry captured, assigned, and followed up automatically",
    description: "Ensure every inbound lead gets captured, classified, and followed up consistently, regardless of when it comes in or who’s on duty.",
    longDescription: "Leads go cold fast. If your team is manually triaging inquiries or relying on memory to follow up, opportunities slip through. We build a system that captures every lead from your key channels, routes it to the right person, and triggers follow-up automatically, so no inquiry disappears into an inbox.",
    features: [
      "Unified lead capture across key channels",
      "Automatic lead classification and routing",
      "Triggered follow-up sequences",
      "Zapier-connected lead tracking and pipeline visibility",
      "Alert and escalation rules for high-priority leads",
    ],
    icon: "UserCheck",
    highlights: ["24/7 capture", "Auto follow-up", "Zapier lead & booking tracking"],
  },
  {
    id: "3",
    slug: "speed-to-lead",
    name: "Speed-to-Lead Recovery System",
    tagline: "Respond to new inquiries in minutes, not days",
    description: "Cut the gap between a new inquiry and a real response. Fast follow-up systems that route leads and trigger outreach before the window closes.",
    longDescription: "Response time is one of the biggest predictors of conversion. When a new inquiry comes in, every hour of delay reduces the chance of booking a call. We build systems that detect new leads in real time, trigger an immediate response or notification, and keep the next step clear, so your team responds fast before the window closes.",
    features: [
      "Real-time lead detection and routing",
      "Immediate automated response or SMS/email trigger",
      "Calendar integration for instant booking",
      "Priority alerts for time-sensitive leads",
      "Reporting on response times and conversion rates",
    ],
    icon: "Zap",
    highlights: ["Real-time routing", "Instant response", "Booking integration"],
  },
  {
    id: "4",
    slug: "quote-recovery",
    name: "Quote & Proposal Recovery System",
    tagline: "Re-engage stale quotes before they go cold for good",
    description: "Track open quotes and proposals, trigger timely follow-up, and give your team visibility into deals that are close to slipping away.",
    longDescription: "Most proposals get sent once and then forgotten. Without a system to track them, remind your team, and trigger re-engagement, good deals die quietly. We build a workflow that monitors the age of open quotes, sends timely follow-up prompts or outreach, and surfaces at-risk opportunities before they’re gone.",
    features: [
      "Quote and proposal age tracking",
      "Automated re-engagement sequences",
      "Team visibility into stale pipeline",
      "CRM update triggers based on quote status",
      "Reporting on recovered vs. lost opportunities",
    ],
    icon: "FileText",
    highlights: ["Quote tracking", "Re-engagement", "Pipeline visibility"],
  },
  {
    id: "5",
    slug: "pipeline-bottleneck",
    name: "Pipeline Bottleneck Detector",
    tagline: "Surface stuck deals and unclear next steps before they stall",
    description: "Identify deals and workflows that have gone quiet, lost ownership, or are missing clear next steps, so nothing falls through the cracks.",
    longDescription: "Pipeline problems are often invisible until a deal is already lost. Opportunities stall when next steps are unclear, ownership is fuzzy, or follow-up just doesn’t happen. We build workflow monitoring that flags stalled deals, surfaces missing actions, and lets your team act before a deal goes quiet.",
    features: [
      "Pipeline health monitoring and stall detection",
      "Next-step and ownership gap identification",
      "Automated alerts for at-risk opportunities",
      "Workflow accountability reporting",
      "Integration with your CRM and ops tools",
    ],
    icon: "Workflow",
    highlights: ["Stall detection", "Accountability", "Real-time alerts"],
  },
  {
    id: "6",
    slug: "revenue-ops-buildout",
    name: "Revenue Operations Workflow Buildout",
    tagline: "A custom AI-assisted workflow system built around how you actually work",
    description: "Full-stack revenue operations system designed around your tools, team, and process, so recovery becomes repeatable.",
    longDescription: "When you’ve identified the gaps and proven a pilot works, the next step is building something that runs reliably at scale. We design and build custom AI-assisted workflow systems around your actual tech stack, sales process, and team structure, connecting lead capture, follow-up, pipeline management, and reporting into one managed system.",
    features: [
      "Full workflow design and implementation",
      "Integration across CRM, email, calendar, and ops tools",
      "AI-assisted automation and prioritization",
      "Client portal with project status and impact reporting",
      "Ongoing optimization and dedicated support",
    ],
    icon: "Cpu",
    highlights: ["Custom build", "Full integration", "Ongoing support"],
  },
];

export const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Free Revenue Leak Audit",
    price: "$0",
    period: "no obligation",
    description: "We review your lead capture, follow-up, and pipeline workflow to find where revenue may be slipping through the cracks.",
    features: [
      "Review of lead capture and follow-up process",
      "Identification of missed revenue opportunities",
      "Pipeline and handoff gap analysis",
      "Workflow map with prioritized bottlenecks",
      "Recommended pilot scope and next steps",
    ],
    cta: "Request free audit",
    highlighted: false,
  },
  {
    id: "growth",
    name: "30-Day Revenue Recovery Pilot",
    price: "Starting at $750",
    period: "fixed scope",
    description: "We scope and build one targeted workflow fix to prove recovery before committing to a full system.",
    features: [
      "Workflow map and recovery plan",
      "One targeted AI-assisted workflow fix",
      "Follow-up or re-engagement automation",
      "Weekly check-ins during the pilot",
      "Simple ROI and impact report at close",
      "Clear next-step recommendation",
    ],
    cta: "Start a pilot",
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Managed AI Workflow System",
    price: "Custom",
    period: "ongoing monthly",
    description: "Ongoing monitoring, optimization, reporting, and expansion of your revenue recovery workflows.",
    features: [
      "Managed AI-assisted workflows",
      "Client portal with project and billing visibility",
      "Monthly impact reports",
      "Dedicated support and optimization",
      "Ongoing integrations and expansions",
      "Direct access to your team",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    headline: "Leads stop falling through the cracks",
    body: "Every inquiry gets captured, classified, and followed up automatically, whether it comes in at 2 pm or 2 am. Your team stops managing inboxes. The follow-up runs itself.",
    metric: "Designed for 24/7 lead coverage",
  },
  {
    id: "2",
    headline: "You see the impact, not just the activity",
    body: "Your client portal tracks response times, captured leads, and recovered deals. Monthly impact reports land in your inbox and show what the system changed.",
    metric: "Monthly reporting included",
  },
  {
    id: "3",
    headline: "The first fix ships in weeks, not months",
    body: "We scope, build, and deliver the first workflow improvement in a 30-day pilot. You get clear milestones and weekly check-ins, with an impact report when the pilot wraps.",
    metric: "30-day pilot delivery",
  },
];

export const faqs: FAQItem[] = [
  {
    id: "1",
    question: "What's included in the Free Revenue Leak Audit?",
    answer: "We review your current lead capture, follow-up, and pipeline workflow to identify where revenue may be slipping through. You get a workflow map with prioritized bottlenecks and a clear recommendation for where to start. No cost, no commitment.",
  },
  {
    id: "2",
    question: "What happens after the audit?",
    answer: "If there's a clear workflow gap worth fixing, we'll recommend a 30-Day Revenue Recovery Pilot. The pilot is a fixed-scope, fixed-fee engagement focused on one targeted fix. You can review the proposal and decide from there.",
  },
  {
    id: "3",
    question: "How is the 30-Day Pilot scoped and priced?",
    answer: "Pilots start at $750 depending on the workflow and tools involved. After the audit, we send a clear proposal with the specific fix, what's included, and a fixed price. What we quote is what you pay.",
  },
  {
    id: "4",
    question: "Do you work with our existing tools and CRM?",
    answer: "Yes. I can design workflows around your existing tools and APIs. McCarthy AI Automations currently demonstrates Zapier-connected lead intake and booking-tracking workflows, along with AI classification, database-backed records, email automation and dashboard review. For any additional CRM or platform integration, I will confirm feasibility and scope before work begins.",
  },
];

export const stats: Stat[] = [
  { value: "$0", label: "Cost of the initial Revenue Leak Audit" },
  { value: "30 days", label: "Pilot duration for your first targeted workflow fix" },
  { value: "Fixed", label: "Pilot scope and price. What we quote is what you pay." },
  { value: "1 portal", label: "Dashboard for all workflows, billing & impact reporting" },
];

/** Homepage "How it works" -- three phases from revenue leak audit to managed system. */
export const howItWorksSteps: HowItWorksStep[] = [
  {
    step: 1,
    title: "Free Revenue Leak Audit",
    description:
      "We review your lead capture, follow-up, and pipeline workflow to find where revenue may be slipping. You get a clear workflow map and a recommended first fix. The map and recommendation are yours to keep.",
  },
  {
    step: 2,
    title: "30-Day Recovery Pilot",
    description:
      "We scope and build one targeted workflow fix: a follow-up system, speed-to-lead automation, or quote recovery flow. The scope and price are fixed up front, and you get an impact report when the 30 days are up.",
  },
  {
    step: 3,
    title: "Managed Workflow System",
    description:
      "Once the pilot proves the approach, we build it into a managed system with ongoing optimization, monthly reporting, and a client portal where you can track everything.",
  },
];

// ---------------------------------------------------------------------------
// Client portal mock data
// All date fields use ISO 8601 (YYYY-MM-DD or full datetime). Format for display via formatDisplayDate() in lib/utils.
// ---------------------------------------------------------------------------

/** Mock current user; replace with Clerk/Supabase user or tenant id when wiring auth. */
export const CURRENT_CLIENT_ID = "client-1";

export const clients: Client[] = [
  {
    id: "client-1",
    name: "Acme Corp",
    email: "contact@acme.example.com",
    company: "Acme Corp",
  },
];

export const clientServices: ClientService[] = [
  {
    id: "cs-1",
    clientId: "client-1",
    serviceId: "4",
    engagementName: "Website AI Chatbot",
    status: "active",
    progress: 100,
  },
  {
    id: "cs-2",
    clientId: "client-1",
    serviceId: "3",
    engagementName: "Lead Capture & Scheduling",
    status: "in_progress",
    progress: 65,
  },
  {
    id: "cs-3",
    clientId: "client-1",
    serviceId: "2",
    engagementName: "AI Voice Agent",
    status: "pending",
    progress: 10,
  },
];

export const projects: Project[] = [
  { id: "proj-1", clientServiceId: "cs-1", name: "Website AI Chatbot", status: "active", progress: 100 },
  { id: "proj-2", clientServiceId: "cs-2", name: "Lead Capture & Scheduling", status: "in_progress", progress: 65 },
  { id: "proj-3", clientServiceId: "cs-3", name: "AI Voice Agent", status: "pending", progress: 10 },
];

export const milestones: Milestone[] = [
  { id: "m1", projectId: "proj-1", title: "Monthly performance review", dueDate: "2025-04-15" },
  { id: "m2", projectId: "proj-2", title: "Calendar sync and reminder automation", dueDate: "2025-03-22" },
  { id: "m3", projectId: "proj-2", title: "Go-live and training", dueDate: "2025-04-05" },
  { id: "m4", projectId: "proj-3", title: "Kickoff and script design", dueDate: "2025-04-01" },
];

export const projectUpdates: ProjectUpdate[] = [
  {
    id: "u1",
    projectId: "proj-1",
    title: "Chatbot live and connected",
    body: "Lead capture is connected to an automated intake workflow. AI-enriched lead information is routed through Zapier for follow-up and booking tracking, with activity available for review in the dashboard.",
    createdAt: "2025-03-01",
  },
  {
    id: "u2",
    projectId: "proj-2",
    title: "Calendly integration complete",
    body: "Calendly integration is complete. Reminder sequences are in development and will be ready for testing by next week.",
    createdAt: "2025-03-08",
  },
  {
    id: "u3",
    projectId: "proj-3",
    title: "Kickoff scheduled",
    body: "Contract signed. Kickoff call scheduled for Apr 1. We'll cover script design and call flows.",
    createdAt: "2025-03-10",
  },
  {
    id: "u4",
    projectId: "proj-1",
    title: "Training and handoff",
    body: "Final training session completed. Your team has access to the dashboard and documentation.",
    createdAt: "2025-02-28",
  },
];

export const supportRequests: SupportRequest[] = [
  {
    id: "sr-1",
    clientId: "client-1",
    projectId: "proj-1",
    subject: "Chatbot response tuning",
    status: "resolved",
    createdAt: "2025-03-05",
  },
];

export const billingRecords: BillingRecord[] = [
  {
    id: "inv-1",
    clientId: "client-1",
    amount: 2500,
    currency: "USD",
    description: "Website AI Chatbot – Phase 1",
    status: "paid",
    dueDate: "2025-02-15",
    paidAt: "2025-02-14",
  },
  {
    id: "inv-2",
    clientId: "client-1",
    amount: 1800,
    currency: "USD",
    description: "Lead Capture & Scheduling – Setup",
    status: "pending",
    dueDate: "2025-04-01",
  },
];

export const dashboardQuickActions: DashboardQuickAction[] = [
  { id: "1", label: "Contact support", href: "/dashboard/support", description: "Get help or request changes", icon: "HelpCircle" },
  { id: "2", label: "View all services", href: "/dashboard/services", description: "See project status and milestones", icon: "Layers" },
  { id: "3", label: "Project updates", href: "/dashboard/updates", description: "Latest updates from our team", icon: "FileText" },
  {
    id: "4",
    label: "Knowledge assistant",
    href: "/dashboard/assistant",
    description: "Ask questions grounded in your portal data",
    icon: "Sparkles",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getAllServiceSlugs(): string[] {
  return services.map((s) => s.slug);
}

export function getServiceById(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

// ---------------------------------------------------------------------------
// Client portal helpers
// ---------------------------------------------------------------------------

function getNextMilestoneForProject(projectId: string): Milestone | null {
  const projectMilestones = milestones
    .filter((m) => m.projectId === projectId && !m.completedAt)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  return projectMilestones[0] ?? null;
}

function getLatestUpdateForProject(projectId: string): ProjectUpdate | null {
  const updates = projectUpdates
    .filter((u) => u.projectId === projectId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return updates[0] ?? null;
}

export function getProjectsWithDetails(clientId: string): ProjectWithDetails[] {
  const clientProjects = projects.filter((p) => {
    const cs = clientServices.find((c) => c.id === p.clientServiceId);
    return cs?.clientId === clientId;
  });
  return clientProjects.map((p) => ({
    ...p,
    nextMilestone: getNextMilestoneForProject(p.id),
    recentUpdate: getLatestUpdateForProject(p.id),
  }));
}

export function getProjectUpdatesForClient(clientId: string): (ProjectUpdate & { projectName: string })[] {
  const clientProjectIds = new Set(
    projects
      .filter((p) => clientServices.some((cs) => cs.clientId === clientId && cs.id === p.clientServiceId))
      .map((p) => p.id)
  );
  return projectUpdates
    .filter((u) => clientProjectIds.has(u.projectId))
    .map((u) => {
      const project = projects.find((p) => p.id === u.projectId);
      return { ...u, projectName: project?.name ?? "Project" };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getSupportRequestsForClient(clientId: string): SupportRequest[] {
  return supportRequests.filter((r) => r.clientId === clientId);
}

export function getBillingRecordsForClient(clientId: string): BillingRecord[] {
  return billingRecords.filter((r) => r.clientId === clientId);
}

/** Human-readable labels for support request status (single source of truth). */
export const supportRequestStatusLabels: Record<SupportRequest["status"], string> = {
  open: "Open",
  in_progress: "In progress",
  resolved: "Resolved",
  closed: "Closed",
};

/** Human-readable labels for billing status (single source of truth). */
export const billingStatusLabels: Record<BillingRecord["status"], string> = {
  pending: "Pending",
  paid: "Paid",
  overdue: "Overdue",
};
