import type { Client } from "@/lib/types";
import { getSupabaseServiceClient } from "@/lib/supabase";

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
}

/** Support request with client name for admin list. */
export interface AdminSupportRow {
  id: string;
  subject: string;
  status: string;
  createdAt: string;
  clientName: string;
}

/** Support request detail for admin view (body, client, project). */
export interface AdminSupportDetail {
  id: string;
  subject: string;
  body: string | null;
  status: string;
  createdAt: string;
  clientName: string;
  projectName: string | null;
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

export async function getAllProjects(): Promise<AdminProjectRow[]> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("projects")
    .select("id, name, status, progress, client_services!inner(client_id, clients(name))")
    .order("name");

  if (error || !data) return [];

  return data.map((row: { id: string; name: string; status: string; progress: number; client_services: { clients: { name: string } | null } }) => ({
    id: row.id,
    name: row.name,
    status: row.status,
    progress: row.progress,
    clientName: row.client_services?.clients?.name ?? "—",
  }));
}

/** Single project for edit form. */
export async function getProjectById(
  id: string
): Promise<{ id: string; name: string; status: string; progress: number } | null> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("projects")
    .select("id, name, status, progress")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return {
    id: data.id,
    name: data.name,
    status: data.status,
    progress: data.progress,
  };
}

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

export async function getAllSupportRequests(): Promise<AdminSupportRow[]> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("support_requests")
    .select("id, subject, status, created_at, clients(name)")
    .order("created_at", { ascending: false });

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
