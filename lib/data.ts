import type { Service, PricingTier, Testimonial, FAQItem, Stat, DashboardService, HowItWorksStep } from "@/lib/types";

export const services: Service[] = [
  {
    id: "1",
    slug: "website-revamp-ai",
    name: "Website Revamp + AI Implementation",
    tagline: "Modernize your site and embed intelligent AI features",
    description: "Transform your existing website into a modern, high-converting platform with integrated AI capabilities.",
    longDescription: "We redesign and rebuild your website with a focus on performance, conversion, and AI-powered features. From smart search and personalized content to chatbots and automation triggers, your site becomes a growth engine.",
    features: [
      "Full design and development revamp",
      "AI-powered search and recommendations",
      "Personalized user experiences",
      "Integration with your existing tools",
      "Ongoing support and optimization",
    ],
    icon: "Globe",
    highlights: ["Design", "Development", "AI Integration"],
  },
  {
    id: "2",
    slug: "ai-voice-agents",
    name: "AI Voice Agents",
    tagline: "24/7 phone answering that never misses a lead",
    description: "Deploy AI voice agents that answer calls, qualify leads, and book appointments around the clock.",
    longDescription: "Never miss a call again. Our AI voice agents handle inbound calls with natural conversation, capture lead details, schedule appointments, and escalate when needed—all without hiring extra staff.",
    features: [
      "24/7 automated phone answering",
      "Natural conversation and lead qualification",
      "Calendar integration for appointments",
      "Custom scripts and escalation rules",
      "Analytics and call summaries",
    ],
    icon: "Phone",
    highlights: ["24/7", "Lead qualification", "Appointments"],
  },
  {
    id: "3",
    slug: "lead-capture-appointment",
    name: "Lead Capture & Appointment Automation",
    tagline: "Turn visitors into booked meetings automatically",
    description: "Capture leads from every channel and automatically schedule them into your calendar.",
    longDescription: "Connect your website, ads, and social channels to a unified lead capture and scheduling system. Reduce no-shows with reminders and let your team focus on closing, not admin.",
    features: [
      "Multi-channel lead capture",
      "Smart scheduling and calendar sync",
      "Automated reminders and follow-ups",
      "CRM integration",
      "Conversion tracking and reporting",
    ],
    icon: "Calendar",
    highlights: ["Multi-channel", "Auto-scheduling", "CRM"],
  },
  {
    id: "4",
    slug: "website-ai-chatbots",
    name: "Website AI Chatbots",
    tagline: "Intelligent chat that engages and converts",
    description: "Custom AI chatbots that answer questions, book demos, and qualify leads on your site.",
    longDescription: "Deploy a chatbot trained on your business so visitors get instant, accurate answers. Hand off to humans when needed and capture every lead with structured data.",
    features: [
      "Trained on your content and FAQs",
      "Lead capture and qualification",
      "Human handoff when needed",
      "Slack/email notifications",
      "Conversation analytics",
    ],
    icon: "MessageCircle",
    highlights: ["Trained on your biz", "Lead capture", "Handoff"],
  },
  {
    id: "5",
    slug: "crm-workflow-automation",
    name: "CRM & Workflow Automation",
    tagline: "Automate repetitive tasks and keep pipelines moving",
    description: "Connect your CRM to email, calendar, and internal tools with smart workflows.",
    longDescription: "We build automated workflows that update records, send sequences, assign tasks, and trigger actions based on behavior—so your team spends time selling, not data entry.",
    features: [
      "CRM and tool integrations",
      "Trigger-based workflows",
      "Email sequences and task creation",
      "Reporting and pipeline visibility",
      "Custom logic and conditions",
    ],
    icon: "Workflow",
    highlights: ["Integrations", "Workflows", "Reporting"],
  },
  {
    id: "6",
    slug: "custom-ai-integrations",
    name: "Custom AI Integrations",
    tagline: "Bespoke AI solutions for your unique workflows",
    description: "Tailored AI integrations that connect your systems and automate complex processes.",
    longDescription: "When off-the-shelf isn’t enough, we build custom AI integrations: document processing, internal tools, APIs, and automations designed around your exact workflow.",
    features: [
      "Custom API and system integration",
      "Document and data processing",
      "Internal tooling and dashboards",
      "Scalable architecture",
      "Dedicated support",
    ],
    icon: "Cpu",
    highlights: ["Custom", "APIs", "Scalable"],
  },
];

export const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    price: "Custom",
    period: "per project",
    description: "Ideal for single automation or a small site upgrade.",
    features: [
      "1 core service or integration",
      "Up to 5 hours of setup support",
      "30-day post-launch support",
      "Documentation and handoff",
    ],
    cta: "Get a quote",
    highlighted: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: "Custom",
    period: "per project",
    description: "Multiple automations or a full website + AI stack.",
    features: [
      "2–3 services or integrations",
      "Dedicated project manager",
      "90-day post-launch support",
      "Training and optimization sessions",
      "Priority support",
    ],
    cta: "Get a quote",
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "ongoing",
    description: "Full AI transformation and ongoing partnership.",
    features: [
      "Unlimited services and integrations",
      "Dedicated success manager",
      "Ongoing support and retainer",
      "Custom SLAs and reporting",
      "Strategic roadmap planning",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote: "McCarthy AI Automations revamped our site and added an AI chatbot. Our lead quality and volume both went up within weeks.",
    author: "Sarah Chen",
    role: "Marketing Director",
    company: "TechFlow Inc",
  },
  {
    id: "2",
    quote: "The AI voice agent handles after-hours calls and books appointments we would have missed. Game changer for a small team.",
    author: "James Rivera",
    role: "Owner",
    company: "Rivera Legal",
  },
  {
    id: "3",
    quote: "They connected our CRM to our ads and calendar. We finally have one source of truth and way less manual work.",
    author: "Michelle Park",
    role: "VP Sales",
    company: "ScaleUp Solutions",
  },
];

export const faqs: FAQItem[] = [
  {
    id: "1",
    question: "How long does a typical project take?",
    answer: "Most single-service projects (e.g., chatbot, voice agent) take 2–4 weeks from kickoff to launch. Website revamps and multi-service packages typically run 6–12 weeks depending on scope.",
  },
  {
    id: "2",
    question: "Do you work with existing tools and CRMs?",
    answer: "Yes. We integrate with popular CRMs (HubSpot, Salesforce, etc.), calendar tools, and communication platforms. We can also build custom integrations for proprietary systems.",
  },
  {
    id: "3",
    question: "What kind of support do you offer after launch?",
    answer: "Every project includes a post-launch support window (30–90 days depending on tier). We provide documentation, training, and bug fixes. Ongoing retainer and support plans are available.",
  },
  {
    id: "4",
    question: "How do you scope and price projects?",
    answer: "We start with a discovery call to understand your goals and tech stack. We then provide a custom proposal with scope, timeline, and fixed or phased pricing. No surprise fees.",
  },
];

export const stats: Stat[] = [
  { value: "150+", label: "Projects delivered" },
  { value: "98%", label: "Client satisfaction" },
  { value: "24/7", label: "AI availability" },
  { value: "3x", label: "Avg. lead increase" },
];

export const howItWorksSteps: HowItWorksStep[] = [
  {
    step: 1,
    title: "Discovery & strategy",
    description: "We learn your goals, audience, and tech stack so we can recommend the right services and integrations.",
  },
  {
    step: 2,
    title: "Proposal & kickoff",
    description: "You receive a clear scope, timeline, and quote. Once approved, we kick off with a structured project plan.",
  },
  {
    step: 3,
    title: "Build & integrate",
    description: "We design, build, and integrate your solutions with regular check-ins and demos so you stay in the loop.",
  },
  {
    step: 4,
    title: "Launch & optimize",
    description: "We go live, train your team, and support you through the post-launch period—then optimize based on results.",
  },
];

export const dashboardServices: DashboardService[] = [
  {
    id: "1",
    name: "Website AI Chatbot",
    status: "active",
    statusLabel: "Live",
    progress: 100,
    nextMilestone: "Monthly performance review",
    nextMilestoneDate: "Apr 15, 2025",
    recentUpdate: "Chatbot live on homepage and contact page. Lead capture form connected to HubSpot.",
    recentUpdateDate: "Mar 1, 2025",
  },
  {
    id: "2",
    name: "Lead Capture & Scheduling",
    status: "in_progress",
    statusLabel: "In progress",
    progress: 65,
    nextMilestone: "Calendar sync and reminder automation",
    nextMilestoneDate: "Mar 22, 2025",
    recentUpdate: "Calendly integration complete. Reminder sequences in development.",
    recentUpdateDate: "Mar 8, 2025",
  },
  {
    id: "3",
    name: "AI Voice Agent",
    status: "pending",
    statusLabel: "Scheduled",
    progress: 10,
    nextMilestone: "Kickoff and script design",
    nextMilestoneDate: "Apr 1, 2025",
    recentUpdate: "Contract signed. Kickoff call scheduled for Apr 1.",
    recentUpdateDate: "Mar 10, 2025",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getAllServiceSlugs(): string[] {
  return services.map((s) => s.slug);
}
