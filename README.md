This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Lockfile and root directory

Build and install must run from the directory that contains this app’s `package.json` and `package-lock.json`. If you see a lockfile or workspace-root warning:

- **Repo root is the app folder** (only one `package.json` in the repo): no change needed; deploy from the repo root.
- **App is in a subfolder** (e.g. repo root is `McCarthyAIAutomations` and the app is in `mccarthy-ai-automations/`): in Vercel go to **Project → Settings → General** and set **Root Directory** to that subfolder (e.g. `mccarthy-ai-automations`). Leave **Build Command** and **Output Directory** blank so Vercel uses the Next.js defaults from that root. This removes the lockfile/root warning and ensures the correct dependencies are installed.

### Deployment environment requirements

These variables must be set in **Vercel → Project → Settings → Environment Variables** for the deployment to work. Use **Production** (and optionally Preview) as needed.

**Required (app, admin, and client portal):**

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk auth (use production key for prod) |
| `CLERK_SECRET_KEY` | Clerk server auth |
| `ADMIN_CLERK_USER_ID` | Admin area access (Clerk user id, e.g. `user_2abc...`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only DB access; never expose to client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client |

**Optional (email):** `RESEND_API_KEY`, `CONTACT_EMAIL`, optional `CONTACT_FROM_EMAIL` (defaults to Resend onboarding). The marketing **contact / consultation** form saves to the database and sends **HTML emails** (admin notification to `CONTACT_EMAIL` + confirmation to the requester) when `RESEND_API_KEY` is set; admin notification is skipped if `CONTACT_EMAIL` is missing. The legacy `/api/contact` route returns 503 if `RESEND_API_KEY` or `CONTACT_EMAIL` is missing. Optional `NEXT_PUBLIC_APP_URL` (or `VERCEL_URL`) adds “View support” / “Visit website” buttons in those emails, and a **View dashboard** button on **monthly impact report** emails to clients.

**Manual monthly impact emails:** On **Admin → Clients**, use **Send monthly impact reports** to email each client the same summary as the portal (30-day hours + revenue line, insight bullets, metrics from `getClientAutomationMetrics`). Clients with no reportable activity are skipped. Requires `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` (verified domain in production).

Copy names and example values from `.env.example`, then replace with real production values. Redeploy after changing variables.

See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
