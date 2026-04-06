import { formatDisplayDate } from "@/lib/utils";
import { faqs } from "@/lib/data";
import { getSupabaseServiceClient } from "@/lib/supabase";
import type { AssistantContextChunk, AssistantSourceKind } from "@/lib/assistant/types";

const MAX_BODY_CHARS = 2_200;
const MAX_SUPPORT_THREADS = 12;
const MAX_UPDATES = 12;

function clip(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

/**
 * Loads all text the assistant may use for this client only.
 * Caller must pass clientId from getCurrentClientId() — never from user input.
 */
export async function gatherAssistantContext(
  clientId: string
): Promise<AssistantContextChunk[]> {
  const supabase = getSupabaseServiceClient();
  const chunks: AssistantContextChunk[] = [];

  if (!supabase) {
    return buildGlobalFaqChunks();
  }

  const { data: clientRow, error: clientErr } = await supabase
    .from("clients")
    .select("name, company")
    .eq("id", clientId)
    .maybeSingle();

  if (!clientErr && clientRow) {
    const name = String(clientRow.name ?? "").trim();
    const company = clientRow.company != null ? String(clientRow.company).trim() : "";
    const lines = [`Client account: ${name || "Your organization"}`];
    if (company) lines.push(`Company: ${company}`);
    chunks.push({
      ref: "",
      kind: "account",
      label: "Your account",
      content: lines.join("\n"),
    });
  }

  const { data: csRows } = await supabase
    .from("client_services")
    .select(
      "engagement_name, status, progress, services (name, tagline, description, long_description)"
    )
    .eq("client_id", clientId);

  for (const row of csRows ?? []) {
    const r = row as {
      engagement_name?: string;
      status?: string;
      progress?: number;
      services?: {
        name?: string;
        tagline?: string;
        description?: string;
        long_description?: string;
      } | null;
    };
    const svc = r.services;
    const engagement = (r.engagement_name ?? "").trim() || "Engagement";
    const parts = [
      `Engagement: ${engagement}`,
      `Status: ${r.status ?? "unknown"}`,
      `Progress: ${r.progress ?? 0}%`,
    ];
    if (svc?.name) parts.push(`Service: ${svc.name}`);
    if (svc?.tagline) parts.push(`Tagline: ${svc.tagline}`);
    if (svc?.description) parts.push(`Summary: ${svc.description}`);
    if (svc?.long_description) parts.push(`Details: ${clip(svc.long_description, MAX_BODY_CHARS)}`);
    chunks.push({
      ref: "",
      kind: "service_plan",
      label: `Service plan — ${engagement}`,
      content: parts.join("\n"),
    });
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, status, progress, client_services!inner(client_id)")
    .eq("client_services.client_id", clientId)
    .eq("is_archived", false);

  const projectList = (projects ?? []) as {
    id: string;
    name: string;
    status: string;
    progress: number;
  }[];

  for (const p of projectList) {
    chunks.push({
      ref: "",
      kind: "project",
      label: `Project — ${p.name}`,
      content: [
        `Project: ${p.name}`,
        `Status: ${p.status}`,
        `Progress: ${p.progress}%`,
      ].join("\n"),
    });
  }

  const projectIds = projectList.map((p) => p.id);
  if (projectIds.length > 0) {
    const { data: milestones } = await supabase
      .from("milestones")
      .select("id, project_id, title, due_date, completed_at, projects!inner(name)")
      .in("project_id", projectIds);

    for (const m of milestones ?? []) {
      const row = m as {
        title: string;
        due_date: string;
        completed_at: string | null;
        projects?: { name?: string };
      };
      const pn = row.projects?.name ?? "Project";
      const done = row.completed_at ? `Completed ${formatDisplayDate(row.completed_at)}` : "Not completed";
      chunks.push({
        ref: "",
        kind: "milestone",
        label: `Milestone — ${row.title}`,
        content: [
          `Project: ${pn}`,
          `Milestone: ${row.title}`,
          `Target date: ${formatDisplayDate(row.due_date)}`,
          `Status: ${done}`,
        ].join("\n"),
      });
    }

    const { data: updates } = await supabase
      .from("project_updates")
      .select("id, title, body, created_at, projects!inner(name)")
      .in("project_id", projectIds)
      .order("created_at", { ascending: false })
      .limit(MAX_UPDATES);

    for (const u of updates ?? []) {
      const row = u as {
        title: string;
        body: string;
        created_at: string;
        projects?: { name?: string };
      };
      const pn = row.projects?.name ?? "Project";
      const when = formatDisplayDate(row.created_at);
      chunks.push({
        ref: "",
        kind: "project_update",
        label: `Project update — ${row.title} (${when})`,
        content: [
          `Project: ${pn}`,
          `Date: ${when}`,
          `Title: ${row.title}`,
          `Body: ${clip(row.body, MAX_BODY_CHARS)}`,
        ].join("\n"),
      });
    }
  }

  const { data: supportRows } = await supabase
    .from("support_requests")
    .select(
      "id, subject, body, status, created_at, support_replies (body, sender_type, created_at)"
    )
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .limit(MAX_SUPPORT_THREADS);

  for (const sr of supportRows ?? []) {
    const row = sr as {
      subject: string;
      body: string | null;
      status: string;
      created_at: string;
      support_replies?: { body: string; sender_type: string; created_at: string }[] | null;
    };
    const when = formatDisplayDate(row.created_at);
    const parts = [
      `Subject: ${row.subject}`,
      `Status: ${row.status}`,
      `Opened: ${when}`,
    ];
    if (row.body) parts.push(`Your message: ${clip(row.body, MAX_BODY_CHARS)}`);
    const replies = row.support_replies ?? [];
    const sorted = [...replies].sort((a, b) =>
      a.created_at.localeCompare(b.created_at)
    );
    for (const rep of sorted) {
      const who =
        rep.sender_type === "admin" ? "Team reply" : `Message (${rep.sender_type})`;
      parts.push(`${who} (${formatDisplayDate(rep.created_at)}): ${clip(rep.body, MAX_BODY_CHARS)}`);
    }
    chunks.push({
      ref: "",
      kind: "support_thread",
      label: `Support — ${row.subject}`,
      content: parts.join("\n"),
    });
  }

  const { data: billing } = await supabase
    .from("billing_records")
    .select("description, status, due_date, paid_at, amount_cents")
    .eq("client_id", clientId)
    .order("due_date", { ascending: false })
    .limit(20);

  for (const b of billing ?? []) {
    const br = b as {
      description: string;
      status: string;
      due_date: string;
      paid_at: string | null;
      amount_cents: number;
    };
    const amt = (br.amount_cents / 100).toFixed(2);
    chunks.push({
      ref: "",
      kind: "billing",
      label: `Billing — ${br.description}`,
      content: [
        `Invoice: ${br.description}`,
        `Amount (USD): ${amt}`,
        `Status: ${br.status}`,
        `Due: ${formatDisplayDate(br.due_date)}`,
        br.paid_at ? `Paid: ${formatDisplayDate(br.paid_at)}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  }

  chunks.push(...buildGlobalFaqChunks());
  return chunks;
}

/** Shared FAQ chunks for portal assistant and public widget. */
export function buildGlobalFaqChunks(): AssistantContextChunk[] {
  return faqs.map((f) => ({
    ref: "",
    kind: "global_faq" as AssistantSourceKind,
    label: `McCarthy FAQ — ${f.question}`,
    content: `Q: ${f.question}\nA: ${f.answer}`,
  }));
}

/**
 * Serialize selected chunks for the model. Trims by character budget (selected set is already small).
 */
export function buildContextPromptText(
  chunks: AssistantContextChunk[],
  maxChars = 10_000
): string {
  const lines: string[] = [];
  let used = 0;
  for (const c of chunks) {
    const block = `[${c.ref}] ${c.label}\n${c.content}\n`;
    if (used + block.length > maxChars) break;
    lines.push(block.trimEnd());
    used += block.length;
  }
  return lines.join("\n\n---\n\n");
}
