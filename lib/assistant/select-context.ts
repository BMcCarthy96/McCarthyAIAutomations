import type { AssistantContextChunk, AssistantSourceKind } from "@/lib/assistant/types";

const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "is",
  "are",
  "was",
  "were",
  "what",
  "when",
  "where",
  "which",
  "who",
  "how",
  "do",
  "does",
  "did",
  "can",
  "could",
  "would",
  "should",
  "my",
  "me",
  "we",
  "our",
  "your",
  "to",
  "of",
  "in",
  "for",
  "on",
  "with",
  "and",
  "or",
  "but",
  "it",
  "this",
  "that",
  "be",
  "have",
  "has",
  "had",
  "not",
  "any",
  "there",
  "they",
  "from",
  "as",
  "about",
  "into",
  "just",
  "tell",
  "show",
  "give",
  "want",
  "need",
  "like",
  "please",
  "will",
  "been",
  "being",
  "than",
  "then",
  "some",
  "such",
  "get",
  "got",
]);

export function tokenizeQuestion(question: string): string[] {
  const tokens = question
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
  return [...new Set(tokens)];
}

function publicWidgetIntentBoost(
  questionLower: string,
  chunk: AssistantContextChunk
): number {
  const lab = chunk.label.toLowerCase();
  let b = 0;
  if (
    /\b(consultation|consult|submit|submitted|request|what\s+happens|after\s+i\s+submit)\b/.test(
      questionLower
    ) &&
    lab.includes("consultation request")
  ) {
    b += 85;
  }
  if (
    /\b(lead\s*qualif|lead\s*engine|ai\s+lead|qualification)\b/.test(questionLower) &&
    lab.includes("lead qualification")
  ) {
    b += 85;
  }
  if (
    /\b(after\s+i\s+book|booked|what\s+happens\s+after)\b.*\b(book|call)\b|\b(book|booking)\b.*\b(call|discovery)\b/.test(
      questionLower
    ) &&
    (lab.includes("after you book") || lab.includes("follow-up, booking"))
  ) {
    b += 70;
  }
  if (
    /\b(booking\s+tracker|lead\s*pipeline|pipeline)\b/.test(questionLower) &&
    lab.includes("booking tracker")
  ) {
    b += 85;
  }
  if (
    /\b(what\s+(can|does)|assistant|help\s+me\s+with|capabilities)\b/.test(
      questionLower
    ) &&
    lab.includes("what this website assistant")
  ) {
    b += 90;
  }
  return b;
}

function scoreChunk(
  chunk: AssistantContextChunk,
  keywords: string[],
  projectUpdateOrdinal: number | null,
  options?: { publicWidget?: boolean; questionLower?: string }
): number {
  const hay = `${chunk.label}\n${chunk.content}`.toLowerCase();
  let s = 0;
  for (const kw of keywords) {
    if (hay.includes(kw)) s += 5;
    if (chunk.label.toLowerCase().includes(kw)) s += 3;
  }

  if (options?.publicWidget && options.questionLower) {
    s += publicWidgetIntentBoost(options.questionLower, chunk);
  }

  switch (chunk.kind) {
    case "account":
      return s + 10_000;
    case "service_plan":
      return s + 25;
    case "project":
      return s + 20;
    case "milestone": {
      const incomplete = chunk.content.includes("Not completed");
      return s + (incomplete ? 28 : 10);
    }
    case "project_update": {
      const recency =
        projectUpdateOrdinal !== null ? Math.max(0, 12 - projectUpdateOrdinal) : 0;
      return s + 22 + recency;
    }
    case "support_thread":
      return s + 16;
    case "billing":
      return s + 8;
    case "global_faq":
      return s + (options?.publicWidget ? 10 : 6);
    case "public_info":
      return s + (options?.publicWidget ? 24 : 10);
    default:
      return s;
  }
}

/**
 * Ranks chunks by keyword overlap with the question and structural hints (recent updates,
 * incomplete milestones). Returns at most `maxChunks` after always keeping the account row.
 */
export function selectRelevantChunks(
  chunks: AssistantContextChunk[],
  question: string,
  options?: { maxChunks?: number; publicWidget?: boolean }
): AssistantContextChunk[] {
  const maxChunks = options?.maxChunks ?? 10;
  const keywords = tokenizeQuestion(question);
  const questionLower = question.toLowerCase();
  const scoreOpts =
    options?.publicWidget === true
      ? { publicWidget: true as const, questionLower }
      : undefined;

  let updateOrd = 0;
  const scored = chunks.map((c) => {
    const ord = c.kind === "project_update" ? updateOrd++ : null;
    return {
      chunk: c,
      score: scoreChunk(c, keywords, ord, scoreOpts),
    };
  });

  scored.sort((a, b) => b.score - a.score);

  const account = chunks.find((c) => c.kind === "account");
  const picked = new Set<AssistantContextChunk>();
  const out: AssistantContextChunk[] = [];

  if (account) {
    picked.add(account);
    out.push(account);
  }

  let faqCount = 0;
  for (const { chunk } of scored) {
    if (picked.has(chunk)) continue;
    if (chunk.kind === "global_faq" && faqCount >= 2) continue;
    if (out.length >= maxChunks) break;
    picked.add(chunk);
    out.push(chunk);
    if (chunk.kind === "global_faq") faqCount += 1;
  }

  // Fallback: if question matched almost nothing, include a thin slice of high-value kinds
  if (keywords.length > 0 && out.filter((c) => c.kind !== "account").length === 0) {
    if (options?.publicWidget) {
      const pubs = chunks.filter((c) => c.kind === "public_info").slice(0, 5);
      const faqs = chunks.filter((c) => c.kind === "global_faq").slice(0, 2);
      for (const c of [...pubs, ...faqs]) {
        if (!picked.has(c) && out.length < maxChunks) {
          picked.add(c);
          out.push(c);
        }
      }
    } else {
      const byKind = (k: AssistantSourceKind) =>
        chunks.filter((c) => c.kind === k).slice(0, 2);
      for (const c of [...byKind("project"), ...byKind("project_update").slice(0, 2)]) {
        if (!picked.has(c) && out.length < maxChunks) {
          picked.add(c);
          out.push(c);
        }
      }
      for (const c of byKind("global_faq")) {
        if (!picked.has(c) && out.length < maxChunks) {
          picked.add(c);
          out.push(c);
        }
      }
    }
  }

  return out;
}

/** Assign S1..Sn in stable order for the model (account first, then rest by prior score order). */
export function assignChunkRefs(chunks: AssistantContextChunk[]): AssistantContextChunk[] {
  return chunks.map((c, i) => ({
    ...c,
    ref: `S${i + 1}`,
  }));
}
