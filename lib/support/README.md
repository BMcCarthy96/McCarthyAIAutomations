# lib/support — support domain (admin)

Admin support logic lives here. The rest of the app still imports from `@/lib/admin-data` and `@/lib/admin-actions` (they re-export these).

| File | Role |
|------|------|
| **types.ts** | `AdminSupportRow`, `AdminSupportDetail`, `SupportRequestListView`. |
| **admin-data.ts** | `getAllSupportRequests(view)`, `getSupportRequestById(id)`. |
| **admin-actions.ts** | `updateSupportRequestStatusAction`, `sendSupportReplyAction` (reply + optional Resend email). |

**Lead follow-up** (public consultation → delayed booking email) is implemented in `lib/lead-follow-up.ts`, `lib/email/lead-follow-up-email.ts`, `lib/booking-url.ts`, and `sendPendingLeadFollowUpsAction` in `lib/admin-actions.ts` (plus `POST /api/cron/lead-follow-up` with `LEAD_FOLLOW_UP_CRON_SECRET` for schedulers).

**Portal support** (client dashboard) stays in `lib/portal-data.ts` and `lib/portal-actions.ts` (`fetchSupportRequestsForClient`, `createSupportRequestAction`, `createPublicSupportRequestAction` for the marketing contact form) to avoid circular dependency with `getCurrentClientId()`.
