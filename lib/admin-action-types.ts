/**
 * Return/state types for admin server actions (useActionState).
 * Kept in a non-"use server" file so they can be imported by components.
 */

export type CreateProjectUpdateState =
  | { success: false; error: string }
  | { success: true };

export type UpdateProjectState =
  | { success: false; error: string }
  | { success: true };

export type UpdateMilestoneState =
  | { success: false; error: string }
  | { success: true };

export type UpdateSupportRequestStatusState =
  | { success: false; error: string }
  | { success: true };

export type UpdateBillingStatusState =
  | { success: false; error: string }
  | { success: true };
