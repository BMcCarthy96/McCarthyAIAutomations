import type { Client } from "@/lib/types";
import { getSupabaseServiceClient } from "@/lib/supabase";

/**
 * Admin data: read-only Supabase access for /admin.
 * Uses service client only. Returns empty/null when Supabase is unavailable.
 * Grouped by domain: clients, projects, milestones, support, billing.
 */

/** Client row from DB (snake_case). */
interface DbClient {
  id: string;
  name: string;
  email: string;
  company: string | null;
  clerk_user_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

/** Project with client name for admin list. */
export interface AdminProjectRow {
  id: string;
  name: string;
  status: string;
  progress: number;
  clientName: string;
  isArchived: boolean;
}

/** Billing record with client name for admin list. */
export interface AdminBillingRow {
  id: string;
  description: string;
  amountCents: number;
  currency: string | null;
  status: string;
  dueDate: string;
  paidAt: string | null;
  clientName: string;
}

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

export async function getAllClients(): Promise<Client[]> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("clients")
    .select("id, name, email, company, clerk_user_id, created_at, updated_at")
    .order("name");

  if (error || !data) return [];

  return (data as DbClient[]).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company ?? undefined,
    clerkUserId: row.clerk_user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function getClientById(id: string): Promise<Client | null> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("clients")
    .select("id, name, email, company, clerk_user_id, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  const row = data as DbClient;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company ?? undefined,
    clerkUserId: row.clerk_user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export async function getAllProjects(): Promise<AdminProjectRow[]> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("projects")
    .select("id, name, status, progress, is_archived, client_services!inner(client_id, clients(name))")
    .order("name");

  if (error || !data) return [];

  return data.map((row: { id: string; name: string; status: string; progress: number; is_archived?: boolean; client_services: { clients: { name: string } | null } }) => ({
    id: row.id,
    name: row.name,
    status: row.status,
    progress: row.progress,
    clientName: row.client_services?.clients?.name ?? "—",
    isArchived: Boolean(row.is_archived),
  }));
}

/** Single project for edit form. */
export async function getProjectById(
  id: string
): Promise<{ id: string; name: string; status: string; progress: number; isArchived: boolean } | null> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("projects")
    .select("id, name, status, progress, is_archived")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  const row = data as { id: string; name: string; status: string; progress: number; is_archived?: boolean };
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    progress: row.progress,
    isArchived: Boolean(row.is_archived),
  };
}

export async function getProjectMetricsForProject(
  projectId: string
): Promise<{
  callsHandled: number | null;
  leadsCaptured: number | null;
  appointmentsBooked: number | null;
  hoursSaved: number | null;
  estimatedRevenue: number | null;
} | null> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("project_metrics")
    .select(
      "calls_handled, leads_captured, appointments_booked, hours_saved, estimated_revenue"
    )
    .eq("project_id", projectId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    callsHandled: data.calls_handled,
    leadsCaptured: data.leads_captured,
    appointmentsBooked: data.appointments_booked,
    hoursSaved: data.hours_saved,
    estimatedRevenue: data.estimated_revenue,
  };
}

// ---------------------------------------------------------------------------
// Milestones
// ---------------------------------------------------------------------------

/** Milestone row for admin edit page. */
export interface AdminMilestoneRow {
  id: string;
  title: string;
  dueDate: string;
  completedAt: string | null;
}

export async function getMilestonesForProject(
  projectId: string
): Promise<AdminMilestoneRow[]> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("milestones")
    .select("id, title, due_date, completed_at")
    .eq("project_id", projectId)
    .order("due_date");

  if (error || !data) return [];

  return data.map((row: { id: string; title: string; due_date: string; completed_at: string | null }) => ({
    id: row.id,
    title: row.title,
    dueDate: row.due_date,
    completedAt: row.completed_at,
  }));
}

// ---------------------------------------------------------------------------
// Support (see lib/support/admin-data.ts)
// ---------------------------------------------------------------------------

export {
  getAllSupportRequests,
  getSupportRequestById,
  type AdminSupportRow,
  type AdminSupportDetail,
  type SupportRequestListView,
} from "@/lib/support/admin-data";

// ---------------------------------------------------------------------------
// Billing
// ---------------------------------------------------------------------------

export async function getAllBillingRecords(): Promise<AdminBillingRow[]> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("billing_records")
    .select("id, description, amount_cents, currency, status, due_date, paid_at, clients(name)")
    .order("due_date", { ascending: false });

  if (error || !data) return [];

  return data.map((row: {
    id: string;
    description: string;
    amount_cents: number;
    currency: string | null;
    status: string;
    due_date: string;
    paid_at: string | null;
    clients: { name: string } | null;
  }) => ({
    id: row.id,
    description: row.description,
    amountCents: row.amount_cents,
    currency: row.currency,
    status: row.status,
    dueDate: row.due_date,
    paidAt: row.paid_at,
    clientName: row.clients?.name ?? "—",
  }));
}
