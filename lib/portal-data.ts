import {
  type BillingRecord,
  type ProjectWithDetails,
  type SupportRequest,
  type ProjectUpdate,
} from "@/lib/types";
import {
  CURRENT_CLIENT_ID,
  getProjectsWithDetails,
  getProjectUpdatesForClient,
  getSupportRequestsForClient,
  getBillingRecordsForClient,
} from "@/lib/data";
import { getSupabaseClient } from "@/lib/supabase";

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

async function getCurrentClientId(): Promise<string> {
  // For now we keep the mock CURRENT_CLIENT_ID as the single tenant id.
  // When Clerk is wired to clients, this helper can be updated to look up
  // the real client row from Supabase using clerk_user_id.
  return CURRENT_CLIENT_ID;
}

export async function fetchProjectsWithDetails(): Promise<ProjectWithDetails[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return getProjectsWithDetails(CURRENT_CLIENT_ID);
  }

  try {
    const clientId = await getCurrentClientId();

    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select("id, name, status, progress, client_services!inner(client_id)")
      .eq("client_services.client_id", clientId);

    if (projectsError || !projects) {
      return getProjectsWithDetails(CURRENT_CLIENT_ID);
    }

    const projectIds = projects.map((p) => p.id);

    const [{ data: milestones }, { data: updates }] = await Promise.all([
      supabase
        .from("milestones")
        .select("id, project_id, title, due_date")
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
              completedAt: null,
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
    return getProjectsWithDetails(CURRENT_CLIENT_ID);
  }
}

export async function fetchProjectUpdatesForClient(): Promise<
  (ProjectUpdate & { projectName: string })[]
> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return getProjectUpdatesForClient(CURRENT_CLIENT_ID);
  }

  try {
    const clientId = await getCurrentClientId();

    const { data, error } = await supabase
      .from("project_updates")
      .select(
        "id, project_id, title, body, created_at, projects!inner(id, name, client_services!inner(client_id))"
      )
      .eq("projects.client_services.client_id", clientId)
      .order("created_at", { ascending: false });

    if (error || !data) {
      return getProjectUpdatesForClient(CURRENT_CLIENT_ID);
    }

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
    return getProjectUpdatesForClient(CURRENT_CLIENT_ID);
  }
}

export async function fetchSupportRequestsForClient(): Promise<SupportRequest[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return getSupportRequestsForClient(CURRENT_CLIENT_ID);
  }

  try {
    const clientId = await getCurrentClientId();

    const { data, error } = await supabase
      .from("support_requests")
      .select(
        "id, client_id, project_id, subject, body, status, category, created_at"
      )
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error || !data) {
      return getSupportRequestsForClient(CURRENT_CLIENT_ID);
    }

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
    return getSupportRequestsForClient(CURRENT_CLIENT_ID);
  }
}

export async function fetchBillingRecordsForClient(): Promise<BillingRecord[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return getBillingRecordsForClient(CURRENT_CLIENT_ID);
  }

  try {
    const clientId = await getCurrentClientId();

    const { data, error } = await supabase
      .from("billing_records")
      .select(
        "id, client_id, amount_cents, currency, description, status, due_date, paid_at"
      )
      .eq("client_id", clientId)
      .order("due_date", { ascending: false });

    if (error || !data) {
      return getBillingRecordsForClient(CURRENT_CLIENT_ID);
    }

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
    return getBillingRecordsForClient(CURRENT_CLIENT_ID);
  }
}

