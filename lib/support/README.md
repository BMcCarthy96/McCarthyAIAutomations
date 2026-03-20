# lib/support — support domain (admin)

Admin support logic lives here. The rest of the app still imports from `@/lib/admin-data` and `@/lib/admin-actions` (they re-export these).

| File | Role |
|------|------|
| **types.ts** | `AdminSupportRow`, `AdminSupportDetail`, `SupportRequestListView`. |
| **admin-data.ts** | `getAllSupportRequests(view)`, `getSupportRequestById(id)`. |
| **admin-actions.ts** | `updateSupportRequestStatusAction`, `sendSupportReplyAction` (reply + optional Resend email). |

**Portal support** (client dashboard) stays in `lib/portal-data.ts` and `lib/portal-actions.ts` (`fetchSupportRequestsForClient`, `createSupportRequestAction`, `createPublicSupportRequestAction` for the marketing contact form) to avoid circular dependency with `getCurrentClientId()`.
