/**
 * Mode + pathname-aware suggested prompts for the floating assistant widget.
 * Safe to import from client or server (no secrets).
 */

export type WidgetAssistantMode = "public" | "demo" | "client";

function pathBucket(pathname: string): string {
  const p = pathname.split("?")[0] || "/";
  if (p === "/" || p === "") return "home";
  if (p.startsWith("/pricing")) return "pricing";
  if (p.startsWith("/services")) return "services";
  if (p.startsWith("/contact")) return "contact";
  if (p.startsWith("/demo")) return "demo";
  if (p.startsWith("/dashboard")) return "dashboard";
  if (p.startsWith("/about")) return "about";
  return "other";
}

export function getWidgetSuggestedPrompts(
  mode: WidgetAssistantMode,
  pathname: string
): string[] {
  const bucket = pathBucket(pathname);

  const publicByPath: Record<string, string[]> = {
    home: [
      "What happens after I submit a consultation request?",
      "How does your AI lead qualification system work?",
      "What can the assistant help me with?",
      "What’s the difference between voice agents and website chatbots?",
    ],
    pricing: [
      "Which service tier or package is right for me?",
      "How do you price custom AI automation projects?",
      "What’s included in a typical engagement?",
    ],
    services: [
      "Which service fits a business that misses phone leads?",
      "Can you connect AI to our existing CRM?",
      "How do lead capture automations work with our calendar?",
    ],
    contact: [
      "What happens after I submit a consultation request?",
      "How quickly do you usually respond?",
      "What happens after I book a call?",
    ],
    demo: [
      "What can I try in the live demo?",
      "Is the demo using real customer data?",
    ],
    dashboard: [
      "Where do I find project updates in the portal?",
      "How do I open a support request?",
    ],
    about: [
      "What kinds of businesses do you work with?",
    ],
    other: [
      "What happens after I submit a consultation request?",
      "What can the assistant help me with?",
      "How does your AI lead qualification system work?",
      "How do I book a discovery call?",
    ],
  };

  if (mode === "public") {
    return publicByPath[bucket] ?? publicByPath.other;
  }

  if (mode === "demo") {
    return [
      "Show me what this demo assistant can answer.",
      "What kind of business questions can I ask here?",
      "What’s on my sample project roadmap?",
    ];
  }

  // client
  const clientByPath: Record<string, string[]> = {
    dashboard: [
      "What’s the latest update on my project?",
      "What milestones are currently in progress?",
    ],
    other: [
      "What’s the status of my project?",
      "Do I have any pending support requests?",
      "What’s coming up next on my milestones?",
    ],
  };

  if (bucket === "dashboard") {
    return [...clientByPath.dashboard, ...clientByPath.other].slice(0, 4);
  }
  return clientByPath.other;
}
