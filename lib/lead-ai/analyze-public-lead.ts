/**
 * Server-only AI classification for public consultation leads (support_requests).
 * Uses only submitted fields; failures never throw to callers of the public form.
 */

import { revalidatePath } from "next/cache";
import { getSupabaseServiceClient } from "@/lib/supabase";
import type {
  LeadAnalysisLlmPayload,
  NormalizedLeadAnalysis,
  AiBudgetSignal,
  AiLeadTemperature,
  AiUrgencyLevel,
} from "@/lib/lead-ai/types";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

const MAX_SUMMARY = 500;
const MAX_LABEL = 200;
const MAX_ACTION = 500;
const MAX_TONE = 120;
const MAX_REPLY = 4000;
const MAX_NOTE = 220;

const URGENCY_SET = new Set<AiUrgencyLevel>(["low", "medium", "high", "unknown"]);
const BUDGET_SET = new Set<AiBudgetSignal>(["low", "medium", "high", "unknown"]);
const TEMP_SET = new Set<AiLeadTemperature>(["cold", "warm", "hot", "unknown"]);

function clampStr(s: unknown, max: number): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  if (!t) return null;
  return t.length > max ? t.slice(0, max) : t;
}

function normalizeEnum<T extends string>(
  raw: unknown,
  allowed: Set<T>,
  fallback: T
): T {
  return typeof raw === "string" && allowed.has(raw as T)
    ? (raw as T)
    : fallback;
}

function normalizeConfidence(raw: unknown): number | null {
  if (typeof raw !== "number" || !Number.isFinite(raw)) return null;
  let n = raw;
  if (n > 1 && n <= 100) n = n / 100;
  if (n < 0) n = 0;
  if (n > 1) n = 1;
  return Math.round(n * 1000) / 1000;
}

export function normalizeLeadAnalysisPayload(
  parsed: LeadAnalysisLlmPayload
): NormalizedLeadAnalysis {
  const urgency = normalizeEnum(
    parsed.urgency_level,
    URGENCY_SET,
    "unknown"
  );
  const budget = normalizeEnum(
    parsed.budget_signal,
    BUDGET_SET,
    "unknown"
  );
  const temp = normalizeEnum(
    parsed.lead_temperature,
    TEMP_SET,
    "unknown"
  );

  return {
    ai_lead_summary: clampStr(parsed.lead_summary, MAX_SUMMARY),
    ai_business_type: clampStr(parsed.business_type, MAX_LABEL),
    ai_likely_service: clampStr(parsed.likely_service, MAX_LABEL),
    ai_urgency: urgency,
    ai_budget_signal: budget,
    ai_lead_temperature: temp,
    ai_confidence: normalizeConfidence(parsed.confidence_score),
    ai_next_action: clampStr(parsed.recommended_next_action, MAX_ACTION),
    ai_follow_up_tone: clampStr(parsed.recommended_follow_up_tone, MAX_TONE),
    ai_suggested_reply: clampStr(parsed.suggested_reply, MAX_REPLY),
    ai_classification_note: clampStr(parsed.classification_note, MAX_NOTE),
  };
}

function leadModel(): string {
  return (
    process.env.OPENAI_LEAD_ANALYSIS_MODEL?.trim() ||
    process.env.OPENAI_ASSISTANT_MODEL?.trim() ||
    "gpt-4o-mini"
  );
}

function buildUserContent(input: {
  requesterName: string;
  subject: string;
  body: string;
}): string {
  return [
    "Analyze this inbound business inquiry for an AI automation consultancy (workflows, voice agents, chatbots, integrations).",
    "",
    "Rules:",
    "- Use ONLY the text below. Do not invent company facts, budgets, or timelines.",
    "- For enums, use unknown when the message is truly silent; otherwise choose the best fit from evidence. Do not under-rate clear high-intent signals.",
    "- confidence_score: 0 to 1 (how sure you are about temperature and service fit combined).",
    "- suggested_reply: short draft email the team could send (professional, helpful); do not promise specific prices or delivery dates unless the lead asked and you can mirror generically.",
    "",
    "Temperature (lead_temperature) — calibrate from the message:",
    "",
    "HOT — Strong buying / action signals. Favor HOT when multiple cues appear (not all required):",
    "- Explicit urgency: ASAP, immediately, urgent, right away, need quickly, soon, this week, implement soon, can't wait, time-sensitive.",
    "- Clear business pain: losing leads, can't keep up, overwhelmed, missing opportunities, backlogged, dropping balls, staff can't handle volume, growth outpacing capacity, revenue or customers at risk.",
    "- High volume or impact: many leads/calls/emails per week or day, scale problems, operational breakdown under load.",
    "- Clear intent to implement or solve: wants automation, booking, integration, or help now; serious about fixing the problem (not idle curiosity).",
    "",
    "WARM — Genuine interest but weaker urgency:",
    "- Exploratory language (e.g. just looking, might be interested, learning about options) without concrete pain or timeline.",
    "- Interest in services but vague problem, no volume/impact, or distant / unclear timeline.",
    "",
    "COLD — Weak intent:",
    "- Vague curiosity only, no real problem stated.",
    "- No clear intent to explore seriously or act.",
    "",
    "Cross-rule: If urgency_level is high AND the problem is clearly defined (specific pain, volume, consequence, or operational failure), bias lead_temperature toward HOT unless the message shows strong counter-signals (e.g. explicitly only browsing, no decision authority implied, or explicit long/indefinite timeline). High urgency plus concrete pain should rarely be only WARM.",
    "",
    "Keep urgency_level (urgency_level) aligned with the same evidence; HOT temperature with only low urgency should be rare unless urgency wording is truly absent but pain/volume is extreme.",
    "",
    `Name: ${input.requesterName}`,
    `Subject: ${input.subject}`,
    "",
    "Message:",
    input.body,
    "",
    'Reply with one JSON object only (no markdown): {"lead_summary":"string","business_type":"string or unknown","likely_service":"string or unknown","urgency_level":"low|medium|high|unknown","budget_signal":"low|medium|high|unknown","lead_temperature":"cold|warm|hot|unknown","confidence_score":number,"recommended_next_action":"string","recommended_follow_up_tone":"string","suggested_reply":"string","classification_note":"one short sentence citing only what the message implies"}',
  ].join("\n");
}

async function callOpenAiStructured(userContent: string): Promise<NormalizedLeadAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY missing");
  }

  const model = leadModel();
  const system =
    "You classify B2B service leads for an AI automation consultancy. Output strictly valid JSON matching the user schema. Follow the user's temperature and urgency rules; ground every label in the message. Prefer unknown only when the text does not support a label—do not default to warm when hot signals (urgency + concrete pain/volume + intent) are present.";

  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 900,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: userContent },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`OpenAI HTTP ${res.status}: ${errText.slice(0, 400)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string | null } }[];
  };
  const raw = data.choices?.[0]?.message?.content?.trim() ?? "";
  let parsed: LeadAnalysisLlmPayload;
  try {
    parsed = JSON.parse(raw) as LeadAnalysisLlmPayload;
  } catch {
    throw new Error(`Model JSON parse failed: ${raw.slice(0, 200)}`);
  }

  return normalizeLeadAnalysisPayload(parsed);
}

function safeErrorMessage(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.length > 800 ? msg.slice(0, 800) : msg;
}

/** Stable label for Zapier / Sheets “Source” columns (not read from request body). */
const ZAPIER_LEAD_SOURCE_LABEL = "McCarthy AI Automations";

function leadEnginePublicSiteUrl(): string | null {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return null;
}

/** Payload for ZAPIER_LEAD_WEBHOOK_URL (downstream only; app remains source of truth). */
interface ZapierLeadEnrichmentPayload {
  /** Product / site identity for downstream automations (e.g. Sheet “Source”). */
  source: string;
  /** Public app URL when configured (matches email link behavior). */
  site_url: string | null;
  name: string;
  email: string | null;
  message: string;
  summary: string | null;
  business_type: string | null;
  service: string | null;
  urgency: string | null;
  temperature: string | null;
  confidence: number | null;
  next_action: string | null;
  suggested_reply: string | null;
  created_at: string;
}

/**
 * POST enriched lead JSON to Zapier after AI completion. No retries; failures are logged only.
 */
async function sendZapierLeadEnrichmentWebhook(
  payload: ZapierLeadEnrichmentPayload
): Promise<void> {
  const url = process.env.ZAPIER_LEAD_WEBHOOK_URL?.trim();
  if (!url) {
    return;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn(
        "[lead-ai] Zapier webhook non-OK:",
        res.status,
        text.slice(0, 300)
      );
    }
  } catch (e) {
    console.warn(
      "[lead-ai] Zapier webhook:",
      e instanceof Error ? e.message : String(e)
    );
  }
}

/**
 * Runs classification for a single support_request id.
 * - Public rows only (client_id is null).
 * - Claim row with optimistic lock: pending → processing.
 * - Admin re-run: pass force=true (expects status reset to pending by caller, or any status for force).
 */
export async function processPublicLeadAnalysis(
  requestId: string,
  options?: { force?: boolean }
): Promise<void> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    console.warn("[lead-ai] Supabase unavailable; skip analysis", requestId);
    return;
  }

  const { data: row, error: fetchErr } = await supabase
    .from("support_requests")
    .select(
      "id, client_id, category, requester_name, requester_email, subject, body, created_at, ai_lead_analysis_status"
    )
    .eq("id", requestId)
    .maybeSingle();

  if (fetchErr || !row) {
    console.warn("[lead-ai] load row failed:", fetchErr?.message ?? "not found");
    return;
  }

  if (row.client_id !== null) {
    return;
  }

  if (row.category != null && row.category !== "public") {
    return;
  }

  const force = Boolean(options?.force);

  if (!force) {
    if (row.ai_lead_analysis_status !== "pending") {
      return;
    }
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    let skipQuery = supabase
      .from("support_requests")
      .update({
        ai_lead_analysis_status: "skipped",
        ai_error_message: null,
        ai_model: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);
    if (!force) {
      skipQuery = skipQuery.eq("ai_lead_analysis_status", "pending");
    }
    const { error: skipErr } = await skipQuery;

    if (!skipErr) {
      revalidatePath("/admin/support");
      revalidatePath(`/admin/support/${requestId}`);
    }
    return;
  }

  let claimOk = false;
  if (!force) {
    const { data: claimed, error: claimErr } = await supabase
      .from("support_requests")
      .update({
        ai_lead_analysis_status: "processing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId)
      .eq("ai_lead_analysis_status", "pending")
      .select("id")
      .maybeSingle();

    if (claimErr || !claimed) {
      return;
    }
    claimOk = true;
  } else {
    const { error: procErr } = await supabase
      .from("support_requests")
      .update({
        ai_lead_analysis_status: "processing",
        ai_error_message: null,
        ai_lead_summary: null,
        ai_business_type: null,
        ai_likely_service: null,
        ai_urgency: null,
        ai_budget_signal: null,
        ai_lead_temperature: null,
        ai_confidence: null,
        ai_next_action: null,
        ai_follow_up_tone: null,
        ai_suggested_reply: null,
        ai_classification_note: null,
        ai_processed_at: null,
        ai_model: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (procErr) {
      console.warn("[lead-ai] force processing update failed:", procErr.message);
      return;
    }
    claimOk = true;
  }

  if (!claimOk) return;

  const requesterName = (row.requester_name as string | null)?.trim() || "Unknown";
  const subject = (row.subject as string)?.trim() || "";
  const body = (row.body as string | null)?.trim() || "";

  const userContent = buildUserContent({
    requesterName,
    subject,
    body: body || "(empty)",
  });

  const model = leadModel();

  try {
    const normalized = await callOpenAiStructured(userContent);
    const now = new Date().toISOString();
    const { error: upErr } = await supabase
      .from("support_requests")
      .update({
        ai_lead_analysis_status: "completed",
        ai_lead_summary: normalized.ai_lead_summary,
        ai_business_type: normalized.ai_business_type,
        ai_likely_service: normalized.ai_likely_service,
        ai_urgency: normalized.ai_urgency,
        ai_budget_signal: normalized.ai_budget_signal,
        ai_lead_temperature: normalized.ai_lead_temperature,
        ai_confidence: normalized.ai_confidence,
        ai_next_action: normalized.ai_next_action,
        ai_follow_up_tone: normalized.ai_follow_up_tone,
        ai_suggested_reply: normalized.ai_suggested_reply,
        ai_classification_note: normalized.ai_classification_note,
        ai_processed_at: now,
        ai_error_message: null,
        ai_model: model,
        updated_at: now,
      })
      .eq("id", requestId);

    if (upErr) {
      console.error("[lead-ai] persist completed failed:", upErr.message);
    } else {
      const createdAt = row.created_at as string;
      void sendZapierLeadEnrichmentWebhook({
        source: ZAPIER_LEAD_SOURCE_LABEL,
        site_url: leadEnginePublicSiteUrl(),
        name: requesterName,
        email: (row.requester_email as string | null)?.trim() || null,
        message: body || subject || "",
        summary: normalized.ai_lead_summary,
        business_type: normalized.ai_business_type,
        service: normalized.ai_likely_service,
        urgency: normalized.ai_urgency,
        temperature: normalized.ai_lead_temperature,
        confidence: normalized.ai_confidence,
        next_action: normalized.ai_next_action,
        suggested_reply: normalized.ai_suggested_reply,
        created_at: createdAt,
      });
    }
  } catch (e) {
    const errMsg = safeErrorMessage(e);
    console.warn("[lead-ai] analysis failed:", errMsg);
    const { error: failErr } = await supabase
      .from("support_requests")
      .update({
        ai_lead_analysis_status: "failed",
        ai_error_message: errMsg,
        ai_model: model,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (failErr) {
      console.error("[lead-ai] persist failed status:", failErr.message);
    }
  }

  revalidatePath("/admin/support");
  revalidatePath(`/admin/support/${requestId}`);
}
