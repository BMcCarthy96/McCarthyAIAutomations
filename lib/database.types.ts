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
        Relationships: [
          {
            foreignKeyName: "project_updates_project_id_fkey",
            columns: ["project_id"],
            referencedRelation: "projects",
            referencedColumns: ["id"],
          },
        ];
      };
      projects: {
        Row: Record<string, unknown> & { id: string; client_service_id: string; name: string; status: ProjectStatus; progress: number; is_archived: boolean; started_at: string | null; completed_at: string | null; created_at: string | null; updated_at: string | null };
        Insert: Record<string, unknown> & { id?: string; client_service_id: string; name: string; status: ProjectStatus; progress: number; is_archived?: boolean; started_at?: string | null; completed_at?: string | null; created_at?: string | null; updated_at?: string | null };
        Update: Record<string, unknown> & { id?: string; client_service_id?: string; name?: string; status?: ProjectStatus; progress?: number; is_archived?: boolean; started_at?: string | null; completed_at?: string | null; created_at?: string | null; updated_at?: string | null };
        Relationships: [
          {
            foreignKeyName: "projects_client_service_id_fkey",
            columns: ["client_service_id"],
            referencedRelation: "client_services",
            referencedColumns: ["id"],
          },
        ];
      };
      milestones: {
        Row: Record<string, unknown> & { id: string; project_id: string; title: string; due_date: string; completed_at: string | null; created_at: string | null; updated_at: string | null };
        Insert: Record<string, unknown> & { id?: string; project_id: string; title: string; due_date: string; completed_at?: string | null; created_at?: string | null; updated_at?: string | null };
        Update: Record<string, unknown> & { id?: string; project_id?: string; title?: string; due_date?: string; completed_at?: string | null; created_at?: string | null; updated_at?: string | null };
        Relationships: [
          {
            foreignKeyName: "milestones_project_id_fkey",
            columns: ["project_id"],
            referencedRelation: "projects",
            referencedColumns: ["id"],
          },
        ];
      };
      clients: {
        Row: Record<string, unknown> & { id: string; name: string; email: string; company: string | null; monthly_report_enabled: boolean; is_archived: boolean; clerk_user_id: string | null; stripe_customer_id: string | null; stripe_subscription_id: string | null; created_at: string | null; updated_at: string | null };
        Insert: Record<string, unknown> & { id?: string; name: string; email: string; company?: string | null; monthly_report_enabled?: boolean; is_archived?: boolean; clerk_user_id?: string | null; stripe_customer_id?: string | null; stripe_subscription_id?: string | null; created_at?: string | null; updated_at?: string | null };
        Update: Record<string, unknown> & { id?: string; name?: string; email?: string; company?: string | null; monthly_report_enabled?: boolean; is_archived?: boolean; clerk_user_id?: string | null; stripe_customer_id?: string | null; stripe_subscription_id?: string | null; created_at?: string | null; updated_at?: string | null };
        Relationships: [];
      };
      client_services: {
        Row: Record<string, unknown> & { id: string; client_id: string; service_id: string; engagement_name: string; status: ProjectStatus; progress: number; started_at: string | null; created_at: string | null; updated_at: string | null };
        Insert: Record<string, unknown> & { id?: string; client_id: string; service_id: string; engagement_name: string; status: ProjectStatus; progress: number; started_at?: string | null; created_at?: string | null; updated_at?: string | null };
        Update: Record<string, unknown> & { id?: string; client_id?: string; service_id?: string; engagement_name?: string; status?: ProjectStatus; progress?: number; started_at?: string | null; created_at?: string | null; updated_at?: string | null };
        Relationships: [
          {
            foreignKeyName: "client_services_client_id_fkey",
            columns: ["client_id"],
            referencedRelation: "clients",
            referencedColumns: ["id"],
          },
          {
            foreignKeyName: "client_services_service_id_fkey",
            columns: ["service_id"],
            referencedRelation: "services",
            referencedColumns: ["id"],
          },
        ];
      };
      support_requests: {
        Row: Record<string, unknown> & {
          id: string;
          client_id: string | null;
          project_id: string | null;
          subject: string;
          body: string | null;
          status: SupportRequestStatus;
          category: string | null;
          requester_name: string | null;
          requester_email: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: Record<string, unknown> & {
          id?: string;
          client_id?: string | null;
          project_id?: string | null;
          subject: string;
          body?: string | null;
          status: SupportRequestStatus;
          category?: string | null;
          requester_name?: string | null;
          requester_email?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: Record<string, unknown> & {
          id?: string;
          client_id?: string | null;
          project_id?: string | null;
          subject?: string;
          body?: string | null;
          status?: SupportRequestStatus;
          category?: string | null;
          requester_name?: string | null;
          requester_email?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "support_requests_client_id_fkey",
            columns: ["client_id"],
            referencedRelation: "clients",
            referencedColumns: ["id"],
          },
          {
            foreignKeyName: "support_requests_project_id_fkey",
            columns: ["project_id"],
            referencedRelation: "projects",
            referencedColumns: ["id"],
          },
        ];
      };
      support_replies: {
        Row: Record<string, unknown> & {
          id: string;
          support_request_id: string;
          body: string;
          sender_type: string;
          created_at: string;
        };
        Insert: Record<string, unknown> & {
          id?: string;
          support_request_id: string;
          body: string;
          sender_type?: string;
          created_at?: string;
        };
        Update: Record<string, unknown> & {
          id?: string;
          support_request_id?: string;
          body?: string;
          sender_type?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "support_replies_support_request_id_fkey",
            columns: ["support_request_id"],
            referencedRelation: "support_requests",
            referencedColumns: ["id"],
          },
        ];
      };
      billing_records: {
        Row: Record<string, unknown> & { id: string; client_id: string; amount_cents: number; currency: string | null; description: string; status: BillingStatus; due_date: string; paid_at: string | null; stripe_invoice_id: string | null; stripe_payment_link_url: string | null; created_at: string | null; updated_at: string | null };
        Insert: Record<string, unknown> & { id?: string; client_id: string; amount_cents: number; currency?: string | null; description: string; status: BillingStatus; due_date: string; paid_at?: string | null; stripe_invoice_id?: string | null; stripe_payment_link_url?: string | null; created_at?: string | null; updated_at?: string | null };
        Update: Record<string, unknown> & { id?: string; client_id?: string; amount_cents?: number; currency?: string | null; description?: string; status?: BillingStatus; due_date?: string; paid_at?: string | null; stripe_invoice_id?: string | null; stripe_payment_link_url?: string | null; created_at?: string | null; updated_at?: string | null };
        Relationships: [
          {
            foreignKeyName: "billing_records_client_id_fkey",
            columns: ["client_id"],
            referencedRelation: "clients",
            referencedColumns: ["id"],
          },
        ];
      };
      services: {
        Row: Record<string, unknown> & { id: string; slug: string; name: string; tagline: string; description: string; long_description: string; features: Json; icon: string; highlights: Json | null };
        Insert: Record<string, unknown> & { id: string; slug: string; name: string; tagline: string; description: string; long_description: string; features?: Json; icon: string; highlights?: Json | null };
        Update: Record<string, unknown> & { id?: string; slug?: string; name?: string; tagline?: string; description?: string; long_description?: string; features?: Json; icon?: string; highlights?: Json | null };
        Relationships: [];
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
        Relationships: [
          {
            foreignKeyName: "project_metrics_project_id_fkey",
            columns: ["project_id"],
            referencedRelation: "projects",
            referencedColumns: ["id"],
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "automation_events_project_id_fkey",
            columns: ["project_id"],
            referencedRelation: "projects",
            referencedColumns: ["id"],
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      delete_client_cascade: {
        Args: { p_client_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      project_status: ProjectStatus;
      client_service_status: ProjectStatus;
      support_request_status: SupportRequestStatus;
      billing_status: BillingStatus;
    };
  };
}
