/**
 * Shared, public-safe operational workflow copy for the **portal** Knowledge Assistant.
 * Not client-specific; cite as Process Guide. Safe to expose to any signed-in client.
 */

import type { AssistantContextChunk } from "@/lib/assistant/types";

const processChunk = (
  label: string,
  content: string
): AssistantContextChunk => ({
  ref: "",
  kind: "shared_process",
  label,
  content,
});

export function getSharedOperationalKnowledgeChunks(): AssistantContextChunk[] {
  return [
    processChunk(
      "Consultation Flow — After you submit a consultation request",
      [
        "This describes the general flow for a **public / marketing** consultation request (Contact form on the website), not a signed-in portal support ticket.",
        "1) The request is received and stored so the team can respond.",
        "2) You typically get a confirmation email when email is configured for the site.",
        "3) The team reviews what you shared.",
        "4) Assistive steps may summarize or categorize the request internally to speed triage—this does not replace a human reply.",
        "5) Someone usually follows up by email within about one business day (often sooner in business hours); timing can vary by volume.",
        "6) Next steps are often a short discovery conversation and, when appropriate, a link to book a call.",
        "For account-specific changes or delivery questions after you are a client, use **Support** in this portal instead of the marketing consultation form.",
      ].join("\n")
    ),
    processChunk(
      "Support Workflow — How client support requests work in the portal",
      [
        "From **Dashboard → Support**, you can open a thread for questions, changes, or issues tied to your work with us.",
        "You may link a project when the request is specific to an engagement.",
        "After you submit, the team is notified. Replies may come **by email** and/or **in this portal**, and the conversation history stays on the request.",
        "Statuses (such as open, in progress, resolved) help you see where things stand—exact labels depend on how your workspace is configured.",
        "For non-urgent or detailed questions, email-style follow-up is common; typical response expectation is **about one business day**, subject to volume.",
        "This process guide does **not** list your actual tickets; use the Support page to see your real requests and replies.",
      ].join("\n")
    ),
    processChunk(
      "Booking Flow — After you schedule a discovery call",
      [
        "After booking (for example via a scheduling link the team shared), you should receive a **calendar confirmation** and may get reminders depending on settings.",
        "Use the meeting link or instructions in the confirmation to join on time.",
        "If you need to reschedule or cancel, use the same booking flow when available, or reply as directed in the confirmation email.",
        "Discovery calls focus on goals and fit; detailed scopes and proposals usually come **after** that conversation.",
      ].join("\n")
    ),
    processChunk(
      "Our lead & booking process (general)",
      [
        "Many engagements connect **lead capture** (forms, ads, chat) to **calendars** and **follow-up messages** so fewer opportunities are dropped.",
        "Internally, teams often track stages such as: submitted → followed up → booked → attended → qualified. Exact steps and tools are configured per client.",
        "AI-assisted lead handling can summarize inquiries and suggest next actions for staff review—it does not replace your policies or approvals.",
        "This is general background only; it does not reflect your private pipeline data unless that appears elsewhere in CONTEXT.",
      ].join("\n")
    ),
  ];
}

/** Substrings of Process Guide labels (after the em dash) for ensure-step matching. */
const PORTAL_PROCESS_LABEL_MARKERS = [
  "After you submit a consultation request",
  "How client support requests work in the portal",
  "After you schedule a discovery call",
  "lead & booking process (general)",
] as const;

function findSharedProcessChunkByMarker(
  chunks: AssistantContextChunk[],
  marker: (typeof PORTAL_PROCESS_LABEL_MARKERS)[number]
): AssistantContextChunk | undefined {
  return chunks.find(
    (c) => c.kind === "shared_process" && c.label.includes(marker)
  );
}

/**
 * Prepend matching Process Guide chunks so workflow answers are not dropped from the prompt budget.
 */
export function ensurePortalProcessGuideChunks(
  allChunks: AssistantContextChunk[],
  selected: AssistantContextChunk[],
  question: string,
  maxChunks: number
): AssistantContextChunk[] {
  if (!shouldAttachProcessGuidesForQuestion(question)) {
    return selected;
  }

  const q = question.toLowerCase();
  const extra: AssistantContextChunk[] = [];

  const add = (marker: (typeof PORTAL_PROCESS_LABEL_MARKERS)[number]) => {
    const c = findSharedProcessChunkByMarker(allChunks, marker);
    if (c && !extra.includes(c)) extra.push(c);
  };

  const clientSpecificSupport =
    /\b(do\s+i\s+have|have\s+i\s+got|any\s+recent|show\s+my|list\s+my|my\s+open|my\s+latest|status\s+of\s+my)\b/i.test(
      q
    ) && /\b(support|requests?|threads?|tickets?)\b/i.test(q);
  const clientSpecificMilestones =
    /\b(my|our|tell\s+me\s+about)\b/i.test(q) && /\b(milestone|milestones)\b/i.test(q);

  if (
    /\b(support\s+request|support\s+process|how\s+does\s+support|portal\s+support|open\s+a\s+support)\b/i.test(
      q
    ) &&
    !clientSpecificSupport
  ) {
    add("How client support requests work in the portal");
  }

  if (
    /\b(consultation|consult\b.*\brequest|submit.*consult|contact\s+form|free\s+consultation)\b/i.test(
      q
    ) ||
    (/\bwhat\s+happens\s+after\b/i.test(q) &&
      /\b(submit|submitted|consultation)\b/i.test(q) &&
      !/\bsupport\b/i.test(q))
  ) {
    add("After you submit a consultation request");
  }

  if (
    /\b(after\s+i\s+book|booked.*call|what\s+happens\s+after\b.*\b(book|call)\b|discovery\s+call|schedul(e|ing)\b.*\b(call|meeting)\b)\b/i.test(
      q
    )
  ) {
    add("After you schedule a discovery call");
  }

  if (
    /\b(lead|booking\s+process|pipeline|inbound|capture)\b/i.test(q) &&
    /\b(process|work|flow|how\s+does)\b/i.test(q) &&
    !clientSpecificMilestones
  ) {
    add("lead & booking process (general)");
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

export function shouldAttachProcessGuidesForQuestion(question: string): boolean {
  const q = question.toLowerCase();
  if (/\b(my|our)\b/i.test(q) && /\b(milestone|milestones|project\s+status)\b/i.test(q)) {
    return false;
  }
  if (
    /\b(do\s+i\s+have|any\s+recent|show\s+my|list\s+my)\b/i.test(q) &&
    /\b(support|requests?)\b/i.test(q)
  ) {
    return false;
  }
  return true;
}

/**
 * Retrieval boost for `shared_process` chunks in the portal assistant (keyword selection).
 */
export function scorePortalProcessGuideBoost(
  questionLower: string,
  chunk: AssistantContextChunk
): number {
  if (chunk.kind !== "shared_process") return 0;
  if (!shouldAttachProcessGuidesForQuestion(questionLower)) return 0;

  const lab = chunk.label.toLowerCase();
  let b = 0;

  if (
    /\b(support\s+request|support\s+process|how\s+does\s+support|portal\s+support|open\s+a\s+support)\b/i.test(
      questionLower
    ) &&
    lab.includes("support workflow")
  ) {
    b += 100;
  }

  if (
    (/\b(consultation|consult\b.*\brequest|submit.*consult|contact\s+form|free\s+consultation)\b/i.test(
      questionLower
    ) ||
      (/\bwhat\s+happens\s+after\b/i.test(questionLower) &&
        /\b(submit|submitted|consultation)\b/i.test(questionLower) &&
        !/\bsupport\b/i.test(questionLower))) &&
    lab.includes("consultation flow")
  ) {
    b += 100;
  }

  if (
    /\b(after\s+i\s+book|booked.*call|what\s+happens\s+after\b.*\b(book|call)\b|discovery\s+call|schedul(e|ing)\b.*\b(call|meeting)\b)\b/i.test(
      questionLower
    ) &&
    lab.includes("booking flow")
  ) {
    b += 95;
  }

  if (
    /\b(lead|booking\s+process|pipeline|inbound|capture)\b/i.test(questionLower) &&
    /\b(process|work|flow|how\s+does)\b/i.test(questionLower) &&
    (lab.includes("lead & booking") || lab.includes("lead capture"))
  ) {
    b += 90;
  }

  return b;
}

/**
 * Boost portal snapshot chunks when the user asks about presence of support / updates / milestones.
 */
export function scorePortalSnapshotBoost(
  questionLower: string,
  chunk: AssistantContextChunk
): number {
  if (chunk.kind !== "portal_snapshot") return 0;
  const lab = chunk.label.toLowerCase();
  let b = 0;
  if (
    /\b(support|requests?|threads?|ticket|recent)\b/i.test(questionLower) &&
    lab.includes("support")
  ) {
    b += 115;
  }
  if (
    /\b(project\s+update|updates?|recent)\b/i.test(questionLower) &&
    lab.includes("project update")
  ) {
    b += 115;
  }
  if (
    /\b(milestone|milestones|changes)\b/i.test(questionLower) &&
    lab.includes("milestones")
  ) {
    b += 115;
  }
  return b;
}

/**
 * Keep account first, then Process Guide blocks (so they stay inside the character cap), then the rest.
 */
export function sortPortalChunksForPrompt(
  chunks: AssistantContextChunk[]
): AssistantContextChunk[] {
  const account = chunks.filter((c) => c.kind === "account");
  const snapshots = chunks.filter((c) => c.kind === "portal_snapshot");
  const guides = chunks.filter((c) => c.kind === "shared_process");
  const rest = chunks.filter(
    (c) =>
      c.kind !== "account" &&
      c.kind !== "portal_snapshot" &&
      c.kind !== "shared_process"
  );
  return [...account, ...snapshots, ...guides, ...rest];
}
