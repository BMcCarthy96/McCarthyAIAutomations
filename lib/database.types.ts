/**
 * Supabase database types for the public schema.
 * Matches docs/database-schema.md. Use with createClient<Database>() for typed .from(), .insert(), .update().
 * Each table includes Row, Insert, Update (extending Record<string, unknown>) and Relationships (GenericRelationship[])
 * so that public satisfies GenericSchema and Schema does not resolve to never.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ProjectStatus = "active" | "in_progress" | "pending" | "completed";
export type SupportRequestStatus = "open" | "in_progress" | "resolved" | "closed";
export type BillingStatus = "pending" | "paid" | "overdue";

/** Matches Supabase GenericRelationship; empty array satisfies GenericTable.Relationships. */
type TableRelationships = { foreignKeyName: string; columns: string[]; referencedRelation: string; referencedColumns: string[] }[];

export interface Database {
  public: {
    Tables: {
      project_updates: {
        Row: Record<string, unknown> & {
          id: string;
          project_id: string;
          title: string;
          body: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: Record<string, unknown> & {
          id?: string;
          project_id: string;
          title: string;
          body: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: Record<string, unknown> & {
          id?: string;
          project_id?: string;
          title?: string;
          body?: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: TableRelationships;
      };
      projects: {
        Row: Record<string, unknown> & { id: string; client_service_id: string; name: string; status: ProjectStatus; progress: number; started_at: string | null; completed_at: string | null; created_at: string | null; updated_at: string | null };
        Insert: Record<string, unknown> & { id?: string; client_service_id: string; name: string; status: ProjectStatus; progress: number; started_at?: string | null; completed_at?: string | null; created_at?: string | null; updated_at?: string | null };
        Update: Record<string, unknown> & { id?: string; client_service_id?: string; name?: string; status?: ProjectStatus; progress?: number; started_at?: string | null; completed_at?: string | null; created_at?: string | null; updated_at?: string | null };
        Relationships: TableRelationships;
      };
      milestones: {
        Row: Record<string, unknown> & { id: string; project_id: string; title: string; due_date: string; completed_at: string | null; created_at: string | null; updated_at: string | null };
        Insert: Record<string, unknown> & { id?: string; project_id: string; title: string; due_date: string; completed_at?: string | null; created_at?: string | null; updated_at?: string | null };
        Update: Record<string, unknown> & { id?: string; project_id?: string; title?: string; due_date?: string; completed_at?: string | null; created_at?: string | null; updated_at?: string | null };
        Relationships: TableRelationships;
      };
      clients: {
        Row: Record<string, unknown> & { id: string; name: string; email: string; company: string | null; clerk_user_id: string | null; created_at: string | null; updated_at: string | null };
        Insert: Record<string, unknown> & { id?: string; name: string; email: string; company?: string | null; clerk_user_id?: string | null; created_at?: string | null; updated_at?: string | null };
        Update: Record<string, unknown> & { id?: string; name?: string; email?: string; company?: string | null; clerk_user_id?: string | null; created_at?: string | null; updated_at?: string | null };
        Relationships: TableRelationships;
      };
      client_services: {
        Row: Record<string, unknown> & { id: string; client_id: string; service_id: string; engagement_name: string; status: ProjectStatus; progress: number; started_at: string | null; created_at: string | null; updated_at: string | null };
        Insert: Record<string, unknown> & { id?: string; client_id: string; service_id: string; engagement_name: string; status: ProjectStatus; progress: number; started_at?: string | null; created_at?: string | null; updated_at?: string | null };
        Update: Record<string, unknown> & { id?: string; client_id?: string; service_id?: string; engagement_name?: string; status?: ProjectStatus; progress?: number; started_at?: string | null; created_at?: string | null; updated_at?: string | null };
        Relationships: TableRelationships;
      };
      support_requests: {
        Row: Record<string, unknown> & { id: string; client_id: string; project_id: string | null; subject: string; body: string | null; status: SupportRequestStatus; category: string | null; created_at: string; updated_at: string | null };
        Insert: Record<string, unknown> & { id?: string; client_id: string; project_id?: string | null; subject: string; body?: string | null; status: SupportRequestStatus; category?: string | null; created_at?: string; updated_at?: string | null };
        Update: Record<string, unknown> & { id?: string; client_id?: string; project_id?: string | null; subject?: string; body?: string | null; status?: SupportRequestStatus; category?: string | null; created_at?: string; updated_at?: string | null };
        Relationships: TableRelationships;
      };
      billing_records: {
        Row: Record<string, unknown> & { id: string; client_id: string; amount_cents: number; currency: string | null; description: string; status: BillingStatus; due_date: string; paid_at: string | null; stripe_invoice_id: string | null; created_at: string | null; updated_at: string | null };
        Insert: Record<string, unknown> & { id?: string; client_id: string; amount_cents: number; currency?: string | null; description: string; status: BillingStatus; due_date: string; paid_at?: string | null; stripe_invoice_id?: string | null; created_at?: string | null; updated_at?: string | null };
        Update: Record<string, unknown> & { id?: string; client_id?: string; amount_cents?: number; currency?: string | null; description?: string; status?: BillingStatus; due_date?: string; paid_at?: string | null; stripe_invoice_id?: string | null; created_at?: string | null; updated_at?: string | null };
        Relationships: TableRelationships;
      };
      services: {
        Row: Record<string, unknown> & { id: string; slug: string; name: string; tagline: string; description: string; long_description: string; features: Json; icon: string; highlights: Json | null };
        Insert: Record<string, unknown> & { id: string; slug: string; name: string; tagline: string; description: string; long_description: string; features?: Json; icon: string; highlights?: Json | null };
        Update: Record<string, unknown> & { id?: string; slug?: string; name?: string; tagline?: string; description?: string; long_description?: string; features?: Json; icon?: string; highlights?: Json | null };
        Relationships: TableRelationships;
      };
      project_metrics: {
        Row: Record<string, unknown> & {
          id: string;
          project_id: string;
          calls_handled: number | null;
          leads_captured: number | null;
          appointments_booked: number | null;
          hours_saved: number | null;
          estimated_revenue: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: Record<string, unknown> & {
          id?: string;
          project_id: string;
          calls_handled?: number | null;
          leads_captured?: number | null;
          appointments_booked?: number | null;
          hours_saved?: number | null;
          estimated_revenue?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Record<string, unknown> & {
          id?: string;
          project_id?: string;
          calls_handled?: number | null;
          leads_captured?: number | null;
          appointments_booked?: number | null;
          hours_saved?: number | null;
          estimated_revenue?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: TableRelationships;
      };
      automation_events: {
        Row: Record<string, unknown> & {
          id: string;
          project_id: string;
          event_type: string;
          description: string;
          created_at: string;
        };
        Insert: Record<string, unknown> & {
          id?: string;
          project_id: string;
          event_type: string;
          description: string;
          created_at?: string;
        };
        Update: Record<string, unknown> & {
          id?: string;
          project_id?: string;
          event_type?: string;
          description?: string;
          created_at?: string;
        };
        Relationships: TableRelationships;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      project_status: ProjectStatus;
      client_service_status: ProjectStatus;
      support_request_status: SupportRequestStatus;
      billing_status: BillingStatus;
    };
  };
}
