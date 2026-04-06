/**
 * Read-only marketing context for the site-wide assistant widget (public mode).
 * No Supabase client data — services copy from lib/data + FAQs + page hint.
 */

import { services } from "@/lib/data";
import { buildGlobalFaqChunks } from "@/lib/assistant/gather-context";
import type { AssistantContextChunk } from "@/lib/assistant/types";

const MAX_SERVICE_BLURB = 400;

function clip(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

function pageHint(pathname: string): string {
  const p = pathname.split("?")[0] ?? "/";
  if (p === "/" || p === "")
    return "Visitor is on the homepage — emphasize breadth of AI automation services and free consultation.";
  if (p.startsWith("/pricing")) return "Visitor is on pricing — be clear we scope custom quotes after discovery; avoid inventing prices.";
  if (p.startsWith("/services")) return "Visitor is browsing services — map questions to service catalog capabilities.";
  if (p.startsWith("/contact")) return "Visitor is on contact — encourage submitting the consultation form or booking a call.";
  if (p.startsWith("/demo")) return "Visitor is on live demo — explain demo is a safe sample portal, not their real data.";
  if (p.startsWith("/about")) return "Visitor is on about — company positioning and trust.";
  if (p.startsWith("/dashboard"))
    return "Visitor path includes dashboard — if CONTEXT lacks account data, they may be signed out; stay within public CONTEXT only.";
  return `Visitor path: ${p} — tailor tone lightly; never invent private or client-specific facts.`;
}

/**
 * Chunks for public-widget LLM: company + services + CTAs + page hint + FAQs.
 */
export function gatherPublicWidgetChunks(pathname: string): AssistantContextChunk[] {
  const chunks: AssistantContextChunk[] = [];

  chunks.push({
    ref: "",
    kind: "public_info",
    label: "McCarthy AI Automations — overview",
    content: [
      "McCarthy AI Automations is a premium AI automation agency.",
      "Offerings include: website revamps with AI, AI voice agents (24/7 phone), lead capture and appointment automation, website AI chatbots, CRM and workflow automation, and custom integrations.",
      "Engagement starts with discovery / free consultation; scopes and timelines are customized.",
    ].join("\n"),
  });

  const serviceLines = services.map(
    (s) =>
      `• ${s.name} — ${s.tagline}\n  ${clip(s.description, MAX_SERVICE_BLURB)}`
  );
  chunks.push({
    ref: "",
    kind: "public_info",
    label: "Service catalog (summary)",
    content: serviceLines.join("\n\n"),
  });

  chunks.push({
    ref: "",
    kind: "public_info",
    label: "How to engage",
    content: [
      "Free consultation: visitors can use the Contact page to submit goals and questions.",
      "Booking: if a public booking/scheduling URL exists on the site, it may be linked from marketing CTAs — do not invent a URL; suggest Contact if unsure.",
      "This assistant only sees public marketing context — it cannot see private client projects, invoices, or other customers' data.",
    ].join("\n"),
  });

  chunks.push({
    ref: "",
    kind: "public_info",
    label: "Current page (routing hint)",
    content: pageHint(pathname),
  });

  chunks.push(...buildGlobalFaqChunks());

  // Dedupe: buildGlobalFaqChunks already uses faqs — we don't add faqs twice
  return chunks;
}
