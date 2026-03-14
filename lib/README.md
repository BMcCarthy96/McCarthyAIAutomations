# lib — data, auth, and server actions

Quick reference for where things live. No behavior depends on this file.

| File / folder | Role |
|---------------|------|
| **admin-auth.ts** | `isAdminUser()` — Clerk-based check for /admin access. |
| **supabase.ts** | `getSupabaseClient()` (anon/RLS), `getSupabaseServiceClient()` (server-only). |
| **admin-data.ts** | Read-only Supabase for /admin. Re-exports support from `support/admin-data`. |
| **admin-actions.ts** | Server actions for /admin (all require `isAdminUser()`). Re-exports support from `support/admin-actions`. |
| **support/** | Support domain: `types.ts`, `admin-data.ts` (queries), `admin-actions.ts` (status update). Portal support stays in portal-data / portal-actions. |
| **portal-data.ts** | Dashboard reads: resolve client via Clerk, then Supabase; fallback to mock. |
| **portal-actions.ts** | Server actions for client dashboard (scoped by `getCurrentClientId()`). |
| **data.ts** | Static/mock data and fallback helpers used when Supabase is unavailable. |
| **types.ts** | Shared TypeScript types. |
| **utils.ts** | Helpers (e.g. `cn`, `formatDisplayDate`). |
| **serviceIcons.tsx** | Icon mapping for services (UI). |
