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
  monthly_report_enabled: boolean;
  clerk_user_id: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
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
  stripePaymentLinkUrl?: string | null;
}

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

export async function getAllClients(): Promise<Client[]> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("clients")
    .select("id, name, email, company, monthly_report_enabled, clerk_user_id, stripe_customer_id, stripe_subscription_id, created_at, updated_at")
    .order("name");

  if (error || !data) return [];

  return (data as DbClient[]).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company ?? undefined,
    monthlyReportEnabled: row.monthly_report_enabled,
    clerkUserId: row.clerk_user_id,
    stripeCustomerId: row.stripe_customer_id ?? undefined,
    stripeSubscriptionId: row.stripe_subscription_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function getClientById(id: string): Promise<Client | null> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("clients")
    .select("id, name, email, company, monthly_report_enabled, clerk_user_id, stripe_customer_id, stripe_subscription_id, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  const row = data as DbClient;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company ?? undefined,
    monthlyReportEnabled: row.monthly_report_enabled,
    clerkUserId: row.clerk_user_id,
    stripeCustomerId: row.stripe_customer_id ?? undefined,
    stripeSubscriptionId: row.stripe_subscription_id ?? undefined,
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

export type AdminMilestoneListView = "upcoming" | "overdue" | "completed";

/** Milestone row for global admin milestones page. */
export interface AdminGlobalMilestoneRow {
  id: string;
  title: string;
  dueDate: string;
  completedAt: string | null;
  projectName: string;
  clientName: string;
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

export async function getAllMilestones(
  view: AdminMilestoneListView = "upcoming"
): Promise<AdminGlobalMilestoneRow[]> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  const today = new Date().toISOString().slice(0, 10);
  let query = supabase
    .from("milestones")
    .select("id, title, due_date, completed_at, projects!inner(name, client_services!inner(clients(name)))")
    .order("due_date", { ascending: true });

  if (view === "completed") {
    query = query.not("completed_at", "is", null);
  } else if (view === "overdue") {
    query = query.is("completed_at", null).lt("due_date", today);
  } else {
    query = query.is("completed_at", null).gte("due_date", today);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((row: {
    id: string;
    title: string;
    due_date: string;
    completed_at: string | null;
    projects: {
      name: string;
      client_services: { clients: { name: string } | null } | null;
    } | null;
  }) => ({
    id: row.id,
    title: row.title,
    dueDate: row.due_date,
    completedAt: row.completed_at,
    projectName: row.projects?.name ?? "—",
    clientName: row.projects?.client_services?.clients?.name ?? "—",
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
  type AdminSupportReply,
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
    .select(
      "id, description, amount_cents, currency, status, due_date, paid_at, stripe_payment_link_url, clients(name)"
    )
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
    stripe_payment_link_url: string | null;
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
    stripePaymentLinkUrl: row.stripe_payment_link_url ?? null,
  }));
}
