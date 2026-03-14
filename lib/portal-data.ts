import { auth } from "@clerk/nextjs/server";
import {
  type BillingRecord,
  type ProjectWithDetails,
  type SupportRequest,
  type ProjectUpdate,
} from "@/lib/types";
import { getSupabaseServiceClient } from "@/lib/supabase";

/**
 * Portal data: dashboard reads for the client portal.
 * Resolves the current client via Clerk → clients.clerk_user_id, then queries Supabase.
 * Returns empty arrays when Supabase is unavailable or on error (no mock data in production).
 */

/**
 * Resolves the current client id for dashboard reads:
 * 1. Gets the current Clerk user (server-side).
 * 2. Looks up the clients row in Supabase where clerk_user_id = Clerk userId.
 * 3. Returns that client's id (uuid), or null if not found / no user / Supabase unavailable.
 * When this returns null, the user has no linked client (dashboard shows NoClientAccount or empty states).
 */
export async function getCurrentClientId(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("clients")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data.id;
}

interface DbProject {
  id: string;
  name: string;
  status: string;
  progress: number;
}

interface DbMilestone {
  id: string;
  project_id: string;
  title: string;
  due_date: string;
  completed_at: string | null;
}

interface DbProjectUpdate {
  id: string;
  project_id: string;
  title: string;
  body: string;
  created_at: string;
}

interface DbSupportRequest {
  id: string;
  client_id: string;
  project_id: string | null;
  subject: string;
  body: string | null;
  status: string;
  category: string | null;
  created_at: string;
}

interface DbBillingRecord {
  id: string;
  client_id: string;
  amount_cents: number;
  currency: string | null;
  description: string;
  status: string;
  due_date: string;
  paid_at: string | null;
}

// ---------------------------------------------------------------------------
// Projects (with next milestone, recent update)
// ---------------------------------------------------------------------------

/**
 * Optional: pass a pre-resolved client id (e.g. from getCurrentClientId()) to avoid resolving twice.
 * When omitted, the helper resolves the current client internally.
 */
export async function fetchProjectsWithDetails(
  clientId?: string | null
): Promise<ProjectWithDetails[]> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  try {
    const resolvedId =
      clientId !== undefined ? clientId : await getCurrentClientId();
    if (resolvedId === null) return [];

    const { data: rawProjects, error: projectsError } = await supabase
      .from("projects")
      .select("id, name, status, progress, client_services!inner(client_id)")
      .eq("client_services.client_id", resolvedId);

    if (projectsError || !rawProjects) return [];

    const projects: DbProject[] = rawProjects as DbProject[];
    const projectIds = projects.map((p) => p.id);

    const [{ data: milestones }, { data: updates }] = await Promise.all([
      supabase
        .from("milestones")
        .select("id, project_id, title, due_date, completed_at")
        .in("project_id", projectIds),
      supabase
        .from("project_updates")
        .select("id, project_id, title, body, created_at")
        .in("project_id", projectIds),
    ]);

    const milestonesByProject = new Map<string, DbMilestone[]>();
    (milestones ?? []).forEach((m) => {
      const list = milestonesByProject.get(m.project_id) ?? [];
      list.push(m);
      milestonesByProject.set(m.project_id, list);
    });

    const updatesByProject = new Map<string, DbProjectUpdate[]>();
    (updates ?? []).forEach((u) => {
      const list = updatesByProject.get(u.project_id) ?? [];
      list.push(u);
      updatesByProject.set(u.project_id, list);
    });

    return projects.map((p) => {
      const dbMilestones = milestonesByProject.get(p.id) ?? [];
      const dbUpdates = updatesByProject.get(p.id) ?? [];

      const nextMilestone =
        dbMilestones
          .filter((m) => !m.completed_at)
          .slice()
          .sort((a, b) => a.due_date.localeCompare(b.due_date))[0] ?? null;

      const recentUpdate =
        dbUpdates
          .slice()
          .sort((a, b) => b.created_at.localeCompare(a.created_at))[0] ?? null;

      return {
        id: p.id,
        clientServiceId: "", // not needed in current UI; can be filled later if needed
        name: p.name,
        status: p.status as ProjectWithDetails["status"],
        progress: p.progress,
        startedAt: null,
        completedAt: null,
        createdAt: null,
        updatedAt: null,
        nextMilestone: nextMilestone
          ? {
              id: nextMilestone.id,
              projectId: p.id,
              title: nextMilestone.title,
              dueDate: nextMilestone.due_date,
              completedAt: nextMilestone.completed_at ?? null,
              createdAt: null,
              updatedAt: null,
            }
          : null,
        recentUpdate: recentUpdate
          ? {
              id: recentUpdate.id,
              projectId: p.id,
              title: recentUpdate.title,
              body: recentUpdate.body,
              createdAt: recentUpdate.created_at,
              updatedAt: null,
            }
          : null,
      };
    });
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Project updates
// ---------------------------------------------------------------------------

/**
 * Optional: pass a pre-resolved client id to avoid resolving twice.
 */
export async function fetchProjectUpdatesForClient(
  clientId?: string | null
): Promise<(ProjectUpdate & { projectName: string })[]> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  try {
    const resolvedId =
      clientId !== undefined ? clientId : await getCurrentClientId();
    if (resolvedId === null) return [];

    const { data, error } = await supabase
      .from("project_updates")
      .select(
        "id, project_id, title, body, created_at, projects!inner(id, name, client_services!inner(client_id))"
      )
      .eq("projects.client_services.client_id", resolvedId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      projectId: row.project_id,
      title: row.title,
      body: row.body,
      createdAt: row.created_at,
      updatedAt: null,
      projectName: row.projects?.name ?? "Project",
    }));
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Support requests
// ---------------------------------------------------------------------------

export async function fetchSupportRequestsForClient(): Promise<SupportRequest[]> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  try {
    const clientId = await getCurrentClientId();
    if (clientId === null) return [];

    const { data, error } = await supabase
      .from("support_requests")
      .select(
        "id, client_id, project_id, subject, body, status, category, created_at"
      )
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((row: DbSupportRequest) => ({
      id: row.id,
      clientId: row.client_id,
      projectId: row.project_id,
      subject: row.subject,
      body: row.body,
      status: row.status as SupportRequest["status"],
      category: row.category,
      createdAt: row.created_at,
      updatedAt: null,
    }));
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Billing
// ---------------------------------------------------------------------------

export async function fetchBillingRecordsForClient(): Promise<BillingRecord[]> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  try {
    const clientId = await getCurrentClientId();
    if (clientId === null) return [];

    const { data, error } = await supabase
      .from("billing_records")
      .select(
        "id, client_id, amount_cents, currency, description, status, due_date, paid_at"
      )
      .eq("client_id", clientId)
      .order("due_date", { ascending: false });

    if (error || !data) return [];

    return data.map((row: DbBillingRecord) => ({
      id: row.id,
      clientId: row.client_id,
      amount: Math.round(row.amount_cents / 100),
      currency: row.currency,
      description: row.description,
      status: row.status as BillingRecord["status"],
      dueDate: row.due_date,
      paidAt: row.paid_at,
      stripeInvoiceId: null,
      createdAt: null,
      updatedAt: null,
    }));
  } catch {
    return [];
  }
}

