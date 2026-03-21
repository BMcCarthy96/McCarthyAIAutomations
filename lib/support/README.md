# lib/support — support domain (admin)

Admin support logic lives here. The rest of the app still imports from `@/lib/admin-data` and `@/lib/admin-actions` (they re-export these).

| File | Role |
|------|------|
| **types.ts** | `AdminSupportRow`, `AdminSupportDetail`, `SupportRequestListView`. |
| **admin-data.ts** | `getAllSupportRequests(view)`, `getSupportRequestById(id)`. |
| **admin-actions.ts** | `updateSupportRequestStatusAction`, `sendSupportReplyAction` (reply + optional Resend email). |

**Lead follow-up** (public consultation → delayed booking email) is implemented in `lib/lead-follow-up.ts`, `lib/email/lead-follow-up-email.ts`, `lib/booking-url.ts`, and `sendPendingLeadFollowUpsAction` in `lib/admin-actions.ts`. Per-lead opt-out: `lead_follow_up_suppressed` on `support_requests`, toggled via `setLeadFollowUpSuppressedAction` on the admin request detail page. Scheduled runs use `GET`/`POST` `/api/cron/lead-follow-up` (Bearer secret); set `LEAD_FOLLOW_UP_CRON_ENABLED=true` only when automatic sends should run—otherwise the route no-ops (`skipped: "disabled"`). See **`docs/lead-follow-up-cron.md`**.

**Portal support** (client dashboard) stays in `lib/portal-data.ts` and `lib/portal-actions.ts` (`fetchSupportRequestsForClient`, `createSupportRequestAction`, `createPublicSupportRequestAction` for the marketing contact form) to avoid circular dependency with `getCurrentClientId()`.
