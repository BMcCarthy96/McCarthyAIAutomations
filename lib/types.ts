export interface Service {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  features: string[];
  icon: string;
  highlights?: string[];
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export interface Testimonial {
  id: string;
  headline: string;
  body: string;
  metric?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface DashboardQuickAction {
  id: string;
  label: string;
  href: string;
  description: string;
  icon: "HelpCircle" | "Layers" | "FileText" | "Sparkles";
}

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
}

// ---------------------------------------------------------------------------
// Client portal models — DB-friendly shape
// - Primary keys: id. Foreign keys: *Id (clientId, projectId, etc.).
// - Dates: ISO 8601 (YYYY-MM-DD or full datetime). Map to timestamp with time zone in Postgres.
// - In Postgres/Supabase use snake_case columns (e.g. client_id, created_at).
// Relationships: Client 1:N ClientService; ClientService 1:1 Project; Project 1:N Milestone, 1:N ProjectUpdate.
// Client 1:N SupportRequest, 1:N BillingRecord.
// ---------------------------------------------------------------------------

export type ProjectStatus = "active" | "in_progress" | "pending" | "completed";
/** Engagement/subscription lifecycle; separate from ProjectStatus so they can diverge (e.g. trial, churned). */
export type ClientServiceStatus = "active" | "in_progress" | "pending" | "completed";
export type SupportRequestStatus = "open" | "in_progress" | "resolved" | "closed";
export type BillingStatus = "pending" | "paid" | "overdue";

export interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  /** When true, hidden from portal and monthly report batch until unarchived. */
  isArchived?: boolean;
  /** Admin-controlled toggle for monthly impact report emails. */
  monthlyReportEnabled?: boolean;
  /** Clerk user id when linking portal to auth. */
  clerkUserId?: string | null;
  /** Stripe customer id for subscriptions (set when client is created). */
  stripeCustomerId?: string | null;
  /** Stripe subscription id when client has an active recurring subscription. */
  stripeSubscriptionId?: string | null;
  /** ISO date or datetime when record was created. */
  createdAt?: string | null;
  /** ISO datetime when record was last updated. */
  updatedAt?: string | null;
}

/** Links a client to a service type (catalog). One per client–service pairing. */
export interface ClientService {
  id: string;
  clientId: string;
  serviceId: string;
  /** Client-facing name for this engagement (e.g. "Website AI Chatbot"). */
  engagementName: string;
  status: ClientServiceStatus;
  progress: number;
  /** ISO date or datetime when engagement started. */
  startedAt?: string | null;
  /** ISO date or datetime when record was created. */
  createdAt?: string | null;
  /** ISO datetime when record was last updated. */
  updatedAt?: string | null;
}

/** Delivery engagement for a client service. Has milestones and updates. */
export interface Project {
  id: string;
  clientServiceId: string;
  name: string;
  status: ProjectStatus;
  progress: number;
  /** ISO date or datetime when project started. */
  startedAt?: string | null;
  /** ISO date or datetime when project completed; null if still active. */
  completedAt?: string | null;
  /** ISO date or datetime when record was created. */
  createdAt?: string | null;
  /** ISO datetime when record was last updated. */
  updatedAt?: string | null;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  /** ISO date (YYYY-MM-DD) or datetime. */
  dueDate: string;
  /** ISO datetime when completed; null if not done. */
  completedAt?: string | null;
  /** ISO date or datetime when record was created. */
  createdAt?: string | null;
  /** ISO datetime when record was last updated. */
  updatedAt?: string | null;
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  title: string;
  body: string;
  /** ISO date or datetime. */
  createdAt: string;
  /** ISO datetime when update was last edited. */
  updatedAt?: string | null;
}

export interface SupportRequest {
  id: string;
  /** Set when the request is tied to a portal client; null for public submissions. */
  clientId: string | null;
  projectId?: string | null;
  subject: string;
  body?: string | null;
  status: SupportRequestStatus;
  /** Optional category (e.g. "billing", "technical", "general", "public"). */
  category?: string | null;
  /** Name from public form when clientId is null. */
  requesterName?: string | null;
  /** Email from public form when clientId is null. */
  requesterEmail?: string | null;
  /** ISO date or datetime. */
  createdAt: string;
  /** ISO datetime when status was last updated. */
  updatedAt?: string | null;
}

export interface BillingRecord {
  id: string;
  clientId: string;
  /** Display amount. In DB store in smallest unit (e.g. cents) as integer to avoid float. */
  amount: number;
  /** ISO 4217 currency code (e.g. "USD"). */
  currency?: string | null;
  description: string;
  status: BillingStatus;
  /** ISO date (YYYY-MM-DD). */
  dueDate: string;
  /** ISO date or datetime when paid. */
  paidAt?: string | null;
  /** Stripe invoice id when integrated. */
  stripeInvoiceId?: string | null;
  /** Stripe payment link URL (for manual payment via payment links). */
  stripePaymentLinkUrl?: string | null;
  /** ISO date or datetime when record was created. */
  createdAt?: string | null;
  /** ISO datetime when record was last updated. */
  updatedAt?: string | null;
}

/** Computed view for dashboard: Project plus next due milestone and latest update. Not a table; build in app or SQL. */
export interface ProjectWithDetails extends Project {
  nextMilestone: Milestone | null;
  recentUpdate: ProjectUpdate | null;
}
