import { getSupabaseServiceClient } from "@/lib/supabase";

export type ProjectActivityItemType = "update" | "milestone" | "support";

export interface ProjectActivityItem {
  type: ProjectActivityItemType;
  title: string;
  description: string;
  createdAt: string;
  projectName: string;
}

interface DbProjectRow {
  id: string;
  name: string;
}

interface DbMilestoneRow {
  id: string;
  project_id: string;
  title: string;
  completed_at: string | null;
}

interface DbProjectUpdateRow {
  id: string;
  project_id: string;
  title: string;
  body: string;
  created_at: string;
}

interface DbSupportRequestRow {
  id: string;
  client_id: string;
  project_id: string | null;
  subject: string;
  updated_at: string | null;
}

/**
 * Unified project activity timeline for a client.
 * Fetches projects, related milestones, updates, and support requests, then
 * returns a flat, date-descending list of timeline items.
 */
export async function getProjectActivityTimeline(
  clientId: string | null
): Promise<ProjectActivityItem[]> {
  if (!clientId) return [];

  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  try {
    // 1) Projects for this client (via client_services join)
    const { data: rawProjects, error: projectsError } = await supabase
      .from("projects")
      .select("id, name, client_services!inner(client_id)")
      .eq("client_services.client_id", clientId);

    if (projectsError || !rawProjects || rawProjects.length === 0) {
      return [];
    }

    const projects = rawProjects as DbProjectRow[];
    const projectIds = projects.map((p) => p.id);
    const projectNameById = new Map<string, string>(
      projects.map((p) => [p.id, p.name])
    );

    // 2) Related records
    const [{ data: milestones }, { data: updates }, { data: support }] =
      await Promise.all([
        supabase
          .from("milestones")
          .select("id, project_id, title, completed_at")
          .in("project_id", projectIds),
        supabase
          .from("project_updates")
          .select("id, project_id, title, body, created_at")
          .in("project_id", projectIds),
        supabase
          .from("support_requests")
          .select("id, client_id, project_id, subject, updated_at")
          .eq("client_id", clientId),
      ]);

    const items: ProjectActivityItem[] = [];

    // Project updates → timeline items
    (updates as DbProjectUpdateRow[] | null | undefined)?.forEach((u) => {
      if (!u.created_at) return;
      const projectName = projectNameById.get(u.project_id) ?? "Project";
      items.push({
        type: "update",
        title: u.title,
        description: u.body,
        createdAt: u.created_at,
        projectName,
      });
    });

    // Milestone completions → timeline items
    (milestones as DbMilestoneRow[] | null | undefined)?.forEach((m) => {
      if (!m.completed_at) return;
      const projectName = projectNameById.get(m.project_id) ?? "Project";
      items.push({
        type: "milestone",
        title: "Milestone completed",
        description: m.title,
        createdAt: m.completed_at,
        projectName,
      });
    });

    // Support activity → timeline items (use updated_at when present)
    (support as DbSupportRequestRow[] | null | undefined)?.forEach((r) => {
      if (!r.updated_at) return;
      const projectName =
        (r.project_id && projectNameById.get(r.project_id)) ?? "General";
      items.push({
        type: "support",
        title: "Support request updated",
        description: r.subject,
        createdAt: r.updated_at,
        projectName,
      });
    });

    // Newest first
    items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return items;
  } catch {
    return [];
  }
}

