/**
 * Support domain types for admin (list/detail views and list filter).
 */

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

export type SupportRequestListView = "active" | "resolved" | "closed" | "all";
