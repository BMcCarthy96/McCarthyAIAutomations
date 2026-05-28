/**
 * Read-only marketing context for the site-wide assistant widget (public mode).
 * No Supabase client data — services copy from lib/data + FAQs + page hint.
 */

import { services } from "@/lib/data";
import { buildGlobalFaqChunks } from "@/lib/assistant/gather-context";
import { getPublicProcessKnowledgeChunks } from "@/lib/assistant/public-widget-knowledge";
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
    return "Visitor is on the homepage - emphasize the paid AI Revenue Leak Audit, brief no-cost fit conversation, and optional separately scoped implementation.";
  if (p.startsWith("/pricing")) return "Visitor is on pricing - be clear about listed starting prices and do not invent custom quotes.";
  if (p.startsWith("/services")) return "Visitor is browsing services — map questions to service catalog capabilities.";
  if (p.startsWith("/contact")) return "Visitor is on contact - encourage submitting an audit request and clarify that the brief fit conversation precedes paid work.";
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
      "McCarthy AI Automations is an AI workflow consulting practice focused on revenue leak audits and scoped implementation.",
      "Public proof includes AI-assisted lead intake, an n8n fictional-data workflow with a human-review checkpoint, Zapier-connected workflow proof where shown, knowledge-assistant functionality, API and workflow integrations, dashboard functionality, and database-backed workflow tools.",
      "Engagement starts with a brief no-cost fit conversation. The AI Revenue Leak Audit & Automation Roadmap is a paid service starting at $495; implementation is optional and separately scoped.",
    ].join("\n"),
  });

  chunks.push(...getPublicProcessKnowledgeChunks());

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
    label: "How to engage (quick reference)",
    content: [
      "Audit request: Contact page form - see CONTEXT blocks about the fit conversation and paid audit flow for what happens next.",
      "Do not describe the full audit, roadmap, implementation plan, or workflow map as free.",
      "This chat on public pages uses only public CONTEXT — never private client records unless the user is signed into their own portal (client mode).",
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
