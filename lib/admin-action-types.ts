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

export type ArchiveProjectState =
  | { success: false; error: string }
  | { success: true };

export type CreateMilestoneState =
  | { success: false; error: string }
  | { success: true };

export type UpdateMilestoneState =
  | { success: false; error: string }
  | { success: true };

export type DeleteMilestoneState =
  | { success: false; error: string }
  | { success: true };

export type UpdateSupportRequestStatusState =
  | { success: false; error: string }
  | { success: true };

export type SendSupportReplyState =
  | { success: false; error: string }
  | { success: true };

/** Batch send monthly impact report emails (admin-triggered). */
export type RunMonthlyImpactReportEmailsState =
  | { success: false; error: string }
  | {
      success: true;
      sent: number;
      skippedDisabled: number;
      skippedNoActivity: number;
      skippedNoEmail: number;
      failed: number;
    };

export type UpdateBillingStatusState =
  | { success: false; error: string }
  | { success: true };

export type CreateStripePaymentLinkState =
  | { success: false; error: string }
  | { success: true; url: string };

export type CreateStripeCustomerBackfillState =
  | { success: false; error: string }
  | { success: true };

export type CreateClientState =
  | { success: false; error: string }
  | { success: true };

export type UpdateClientState =
  | { success: false; error: string }
  | { success: true };

export type CreateProjectSetupState =
  | { success: false; error: string }
  | { success: true };

export type UpdateClientClerkLinkState =
  | { success: false; error: string }
  | { success: true };

export type ArchiveClientState =
  | { success: false; error: string }
  | { success: true };

export type DeleteClientState =
  | { success: false; error: string }
  | { success: true };

export type DeleteBillingRecordState =
  | { success: false; error: string }
  | { success: true };

export type UpdateProjectMetricsState =
  | { success: false; error: string }
  | { success: true };

/** Batch send lead follow-up emails (public consultation leads; admin or cron). */
export type SendPendingLeadFollowUpsState =
  | { success: false; error: string }
  | { success: true; sent: number; failed: number };
