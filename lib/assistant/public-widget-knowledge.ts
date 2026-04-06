/**
 * Centralized public-safe copy for the site assistant widget (marketing + process).
 * No secrets, client data, or proprietary implementation details (no stack/vendor names required).
 * Edit here when onboarding / product messaging changes.
 */

import type { AssistantContextChunk } from "@/lib/assistant/types";

const chunk = (
  label: string,
  lines: string[]
): AssistantContextChunk => ({
  ref: "",
  kind: "public_info",
  label,
  content: lines.join("\n"),
});

/** Spec order = default prompt order for process blocks (before service catalog). */
const PROCESS_CHUNKS_SPEC: ReadonlyArray<{ label: string; lines: string[] }> = [
  {
    label: "Consultation request — what happens after you submit",
    lines: [
      "When someone submits the free consultation form on the website:",
      "1) The request is received and stored so the team can act on it.",
      "2) The submitter typically receives a confirmation email acknowledging the message (when email is configured for the site).",
      "3) The McCarthy team reviews the goals and details you shared.",
      "4) Automated assistive steps may run in the background to help categorize and summarize the request so the team can respond faster—this supports triage only and does not replace a human follow-up.",
      "5) A team member usually follows up by email within about one business day (often sooner during business hours)—exact timing can vary by volume.",
      "6) Next steps often include a short discovery conversation and, when it makes sense, a link to book a call or continue over email.",
      "Users can also open Support from the client portal after they are onboarded, or use the Contact page / booking link on the marketing site anytime.",
    ],
  },
  {
    label: "AI lead qualification and Lead Engine (high-level, public)",
    lines: [
      "McCarthy builds AI-powered lead workflows for businesses that want faster, more consistent handling of inbound interest.",
      "At a high level, an “AI Lead Engine” or lead qualification layer can: summarize what the prospect asked for, estimate urgency or fit, suggest next actions for the team, and optionally draft follow-up ideas—always for human review before anything important goes out.",
      "On mccarthyaiautomations.com, public consultation submissions may be enriched automatically to help the team prioritize—visitors are not shown internal scores; this is an internal productivity aid.",
      "Nothing here replaces compliance, consent, or your own sales process; McCarthy scopes what is built per client.",
    ],
  },
  {
    label: "Follow-up, booking, and reminders (public overview)",
    lines: [
      "After a consultation request, teams may send a booking link for a discovery call when appropriate.",
      "Some engagements include automated email follow-ups or reminders (for example, a nudge to book if someone asked for a call)—wording and timing are configured per project and should match your policies.",
      "If the site advertises a public scheduling URL, visitors can book directly without waiting for email.",
    ],
  },
  {
    label: "After you book a call — what to expect (public)",
    lines: [
      "You should receive a calendar confirmation and may get reminder messages depending on how scheduling is configured.",
      "Use the meeting link or instructions in that confirmation to join on time.",
      "If plans change, reschedule or cancel through the same booking flow when available, or reply to the confirmation email if that is how your host handles changes.",
      "Discovery calls are for understanding goals and fit; detailed scopes and proposals come after that conversation.",
    ],
  },
  {
    label: "Booking tracker and pipeline (conceptual, public)",
    lines: [
      "Many clients track leads in a simple pipeline: submitted → followed up → booked → attended → qualified.",
      "McCarthy can connect automations so status updates live alongside email and your existing operational tools. Exact tools and steps are chosen during implementation.",
      "The assistant cannot see a visitor’s private pipeline unless they are signed into their own client portal.",
    ],
  },
  {
    label: "What this website assistant can and cannot do (marketing site)",
    lines: [
      "On the marketing website, this floating assistant always uses public marketing and FAQ-style CONTEXT only—even if you are logged in. It does not load your private portal projects, milestones, invoices, or support history in this widget on public pages.",
      "In the client dashboard, the dedicated Knowledge Assistant page can answer from your organization’s delivery context when you are signed in there.",
      "Here on the public site, the assistant can: explain McCarthy AI Automations services and how AI automations work at a high level; walk through consultation and booking flow; compare solution types (voice, chat, lead capture, CRM workflows); and point you to Contact or a Book-a-call link.",
      "It does not change settings, send emails, or book meetings for you; it explains options and next steps.",
    ],
  },
  {
    label: "How to contact McCarthy AI Automations or get support",
    lines: [
      "Marketing visitors: use the Contact page to send a consultation request, or use any “Book a call” / scheduling link shown on the site.",
      "Existing clients: use the client portal Support area to thread messages with the team when that has been enabled for their account.",
      "For urgent legal or security issues, use the contact channels your contract or onboarding materials describe.",
    ],
  },
  {
    label: "Knowledge Assistant (portal product — demo-safe description)",
    lines: [
      "The Knowledge Assistant is a client-portal feature that answers questions using the customer’s own delivery context when they are signed in—projects, milestones, updates, support history, and billing summaries that exist in their portal, plus general McCarthy FAQs.",
      "It is designed to cite what it used and to say when context is missing instead of guessing.",
      "Live demos may use sample data so prospects can explore the experience safely.",
    ],
  },
  {
    label: "Booking automation (product area — public description)",
    lines: [
      "Booking automation typically connects lead capture (forms, ads, chat) to calendars and reminders so fewer leads slip through.",
      "Common elements: scheduling links, confirmation messages, and optional reminder sequences—scoped and worded per client.",
    ],
  },
  {
    label: "Email automation (product area — public description)",
    lines: [
      "Email automation can include transactional messages (confirmations, handoffs) and nurture-style follow-ups where appropriate and compliant.",
      "McCarthy integrates with the email and CRM tools the customer already uses when possible.",
    ],
  },
];

export function getPublicProcessLabelOrder(): readonly string[] {
  return PROCESS_CHUNKS_SPEC.map((s) => s.label);
}

/**
 * Map questions → must-include process chunks (by label substring) so retrieval + prompt budget cannot skip them.
 */
export const PUBLIC_WIDGET_INTENT_MATCHERS: ReadonlyArray<{
  pattern: RegExp;
  labelIncludes: string;
}> = [
  {
    pattern:
      /\b(consultation|consult)\b.*\b(request|submit|submitted)\b|\b(submit|submitted)\b.*\b(request|consultation)\b|\bwhat\s+happens\s+after\b|\bafter\s+i\s+submit\b|\bconsultation\s+request\b/i,
    labelIncludes: "Consultation request",
  },
  {
    pattern: /\b(lead\s*qualif|lead\s*engine|ai\s+lead|qualification\s+system)\b/i,
    labelIncludes: "AI lead qualification",
  },
  {
    pattern:
      /\bafter\s+i\s+book\b|\bwhat\s+happens\s+after\b.*\bbook\b|\bbooked\s+(a\s+)?call\b|\bafter\s+booking\b/i,
    labelIncludes: "After you book a call",
  },
  {
    pattern:
      /\b(book(ing)?\s+(a\s+)?call|schedul(e|ing)|discovery\s+call|book\s+a\s+call)\b/i,
    labelIncludes: "Follow-up, booking",
  },
  {
    pattern: /\b(booking\s+tracker|lead\s*pipeline|pipeline\b.*\b(high-level|work)|tracker\b.*\blead)\b/i,
    labelIncludes: "Booking tracker",
  },
  {
    pattern:
      /\bwhat\s+(can|does)\b.*\bassistant\b|\bassistant\b.*\b(help|do)\b|\bhelp\s+me\s+with\b|\bcapabilities\b/i,
    labelIncludes: "What this website assistant",
  },
];

export function getPublicProcessKnowledgeChunks(): AssistantContextChunk[] {
  return PROCESS_CHUNKS_SPEC.map((s) => chunk(s.label, s.lines));
}

function findChunkByLabelIncludes(
  allChunks: AssistantContextChunk[],
  labelIncludes: string
): AssistantContextChunk | undefined {
  return allChunks.find((c) => c.label.includes(labelIncludes));
}

/**
 * Prepend intent-matched public process chunks so they are not dropped by score ordering or character cap.
 */
export function ensurePublicWidgetChunksSelected(
  allChunks: AssistantContextChunk[],
  selected: AssistantContextChunk[],
  question: string,
  maxChunks: number
): AssistantContextChunk[] {
  const extra: AssistantContextChunk[] = [];
  for (const { pattern, labelIncludes } of PUBLIC_WIDGET_INTENT_MATCHERS) {
    if (!pattern.test(question)) continue;
    const found = findChunkByLabelIncludes(allChunks, labelIncludes);
    if (found && !extra.includes(found)) extra.push(found);
  }
  const seen = new Set<string>();
  const merged: AssistantContextChunk[] = [];
  for (const c of [...extra, ...selected]) {
    if (seen.has(c.label)) continue;
    seen.add(c.label);
    merged.push(c);
    if (merged.length >= maxChunks) break;
  }
  return merged;
}

/**
 * Order chunks for buildContextPromptText: small, high-signal blocks before the large service catalog so the 10k cap keeps process knowledge.
 */
export function sortPublicWidgetChunksForPrompt(
  chunks: AssistantContextChunk[]
): AssistantContextChunk[] {
  const orderList = getPublicProcessLabelOrder();
  const processIndex = (label: string) => {
    const i = orderList.indexOf(label);
    return i >= 0 ? i : 10_000;
  };

  function sortKey(c: AssistantContextChunk): [number, number, string] {
    if (c.label.includes("McCarthy AI Automations — overview")) return [0, 0, ""];
    const pi = processIndex(c.label);
    if (pi < 10_000) return [1, pi, ""];
    if (c.label.includes("How to engage")) return [3, 0, ""];
    if (c.label.includes("Current page")) return [3, 1, ""];
    if (c.kind === "public_info") return [2, 0, c.label];
    if (c.label.includes("Service catalog")) return [5, 0, ""];
    if (c.kind === "global_faq") return [6, 0, c.label];
    return [4, 0, c.label];
  }

  return [...chunks].sort((a, b) => {
    const ka = sortKey(a);
    const kb = sortKey(b);
    if (ka[0] !== kb[0]) return ka[0] - kb[0];
    if (ka[1] !== kb[1]) return ka[1] - kb[1];
    return ka[2].localeCompare(kb[2]);
  });
}
