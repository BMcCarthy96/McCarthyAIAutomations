/**
 * Support domain types for admin (list/detail views and list filter).
 */

/** Support request with client name for admin list. */
export interface AdminSupportRow {
  id: string;
  subject: string;
  status: string;
  createdAt: string;
  /** Linked client organization name when client_id is set. */
  clientName: string | null;
  /** Public submitter display, e.g. "Jane · jane@example.com", when not a client submission. */
  publicContact: string | null;
  /** Distinct UI badge: portal client vs marketing-site submission. */
  source: "client" | "public";
}

/** Stored admin reply on a support thread. */
export interface AdminSupportReply {
  id: string;
  body: string;
  senderType: string;
  createdAt: string;
}

/** Support request detail for admin view (body, client, project). */
export interface AdminSupportDetail {
  id: string;
  subject: string;
  body: string | null;
  status: string;
  createdAt: string;
  clientName: string | null;
  /** Linked client primary email (for admin replies); null for public-only rows. */
  clientEmail: string | null;
  requesterName: string | null;
  requesterEmail: string | null;
  source: "client" | "public";
  projectName: string | null;
  replies: AdminSupportReply[];
  /** Public consultation lead follow-up automation (client rows: always ineligible / N/A). */
  leadFollowUpEligible: boolean;
  followUpSentAt: string | null;
  /** When true, cron/manual batch skips this lead for follow-up (public rows only). */
  leadFollowUpSuppressed: boolean;
}

export type SupportRequestListView = "active" | "resolved" | "closed" | "all";
