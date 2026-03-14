/**
 * Admin support data: read-only Supabase queries for /admin/support.
 */

import { getSupabaseServiceClient } from "@/lib/supabase";
import type {
  AdminSupportRow,
  AdminSupportDetail,
  SupportRequestListView,
} from "./types";

export type { AdminSupportRow, AdminSupportDetail, SupportRequestListView };

export async function getAllSupportRequests(
  view: SupportRequestListView = "active"
): Promise<AdminSupportRow[]> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  let query = supabase
    .from("support_requests")
    .select("id, subject, status, created_at, clients(name)")
    .order("created_at", { ascending: false });

  if (view === "active") {
    query = query.in("status", ["open", "in_progress"]);
  } else if (view === "resolved") {
    query = query.eq("status", "resolved");
  } else if (view === "closed") {
    query = query.eq("status", "closed");
  }

  const { data, error } = await query;

  if (error || !data) return [];

  return data.map((row: { id: string; subject: string; status: string; created_at: string; clients: { name: string } | null }) => ({
    id: row.id,
    subject: row.subject,
    status: row.status,
    createdAt: row.created_at,
    clientName: row.clients?.name ?? "—",
  }));
}

export async function getSupportRequestById(
  id: string
): Promise<AdminSupportDetail | null> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("support_requests")
    .select("id, subject, body, status, created_at, clients(name), projects(name)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as {
    id: string;
    subject: string;
    body: string | null;
    status: string;
    created_at: string;
    clients: { name: string } | null;
    projects: { name: string } | null;
  };
  return {
    id: row.id,
    subject: row.subject,
    body: row.body,
    status: row.status,
    createdAt: row.created_at,
    clientName: row.clients?.name ?? "—",
    projectName: row.projects?.name ?? null,
  };
}
