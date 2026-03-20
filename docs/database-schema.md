# McCarthy AI Automations — Supabase/Postgres schema design

A single reference for the future Supabase schema. **No database is implemented yet.**

- **Types:** Table and column names map from `lib/types.ts` (camelCase → snake_case in SQL).
- **Seed data:** Row shapes and relationships follow `lib/data.ts` so seed scripts stay in sync with the app.

---

## 1. Schema design in plain English

### Entities and relationships

- **clients** — The company or contact that is the customer. One row per client.
- **services** — The product catalog (e.g. "Website AI Chatbot", "AI Voice Agents"). Read-mostly; one row per service offering.
- **client_services** — Links a client to a service type. **One-to-many** from clients: a client can have many client_services (one per service they’ve bought). Each row has an `engagement_name` and status/progress for that engagement.
- **projects** — A delivery engagement. **One-to-one** with client_services: each client_service has one project (the delivery). The project has its own status and progress and holds milestones and updates.
- **milestones** — **One-to-many** from projects: each project has many milestones (due dates, titles, completed flag).
- **project_updates** — **One-to-many** from projects: each project has many updates (title, body, created_at).
- **support_requests** — Mostly **one-to-many** from clients (portal). Rows may also have **no** `client_id` (public marketing submissions) with `requester_name` / `requester_email` instead. Optionally linked to a project via `project_id`.
- **support_replies** — **One-to-many** from support_requests: admin replies stored for threading; `sender_type` defaults to `admin` for future expansion.
- **billing_records** — **One-to-many** from clients: each client has many invoices/payments.

So: **Client → many ClientServices → each has one Project → each Project has many Milestones and many ProjectUpdates.** Client also has many SupportRequests and many BillingRecords.

### Required vs optional fields

- **Required:** All `id` and foreign keys (`client_id`, `service_id`, `project_id`, etc.), and any field that the app today always expects (e.g. `name`, `email`, `status`, `due_date`, `created_at` where it’s the main timestamp).
- **Optional (nullable):** Match TS optional/`| null`: `company`, `clerk_user_id`, `body` (support_requests), `category`, `client_id` (support_requests, when public), `requester_name` / `requester_email` (support_requests, when client-linked), `project_id` (support_requests), `currency`, `paid_at`, `stripe_invoice_id`, `started_at`, `completed_at` (projects and milestones), `updated_at` on all tables.

### Clerk → client mapping

- Store Clerk’s user id in **clients.clerk_user_id** (nullable).
- When a user signs in with Clerk, look up `client` by `clerk_user_id`. That client row is the “current client” for the portal; use its `id` everywhere you currently use `CURRENT_CLIENT_ID` in the app.
- One Clerk user = one client row for the portal. If you later need multiple users per client, you can add a separate `portal_users` table (client_id, clerk_user_id) and keep `clients.clerk_user_id` as a “primary” or legacy link.

### Enums

- Use Postgres **ENUMs** (or `text` with a check constraint) for small, fixed sets:
  - **project_status:** `active`, `in_progress`, `pending`, `completed`
  - **client_service_status:** same values for now (keeps door open to add e.g. `trial`, `churned` later)
  - **support_request_status:** `open`, `in_progress`, `resolved`, `closed`
  - **billing_status:** `pending`, `paid`, `overdue`
- **currency:** Keep as `text` (ISO 4217, e.g. `USD`). No enum needed unless you want to restrict to a short list.

### Money (billing_records)

- **Store amount in the smallest unit (cents for USD)** as an **integer** column (e.g. `amount_cents`). This avoids float rounding and matches Stripe and common practice.
- In the app: when reading from DB, divide by 100 for display; when writing (e.g. from Stripe), store in cents. Your current TS `amount` is “display”; the DB layer can do the conversion so the rest of the app can keep using dollars until you switch.

### Service catalog (services table)

- **Seed the service catalog** (e.g. via a Supabase seed script or a one-off migration). The catalog is small and stable (e.g. 6 rows). Reference data should live in the DB so `client_services.service_id` is a real FK and so you can change copy without redeploying. Keep the same ids/slugs as in `lib/data.ts` so existing references (e.g. serviceId "4") still work after migration.

### Mapping from mock data (lib/data.ts)

The current mock in `lib/data.ts` is the reference for seed/demo data:

- **services** — Seed from the `services` array (ids `"1"`–`"6"`, slug, name, tagline, description, long_description, features as jsonb, icon, highlights).
- **clients** — One row per `clients[]`; use uuid for `id` when seeding (mock `"client-1"` is in-memory only).
- **client_services** — One per `clientServices[]`; `client_id` and `service_id` reference clients and services; `engagement_name` from mock.
- **projects** — One per `projects[]`; `client_service_id` links to client_services; names/status/progress match mock.
- **milestones** — One per `milestones[]`; `due_date` already ISO in mock (e.g. `2025-04-15`).
- **project_updates** — One per `projectUpdates[]`; `created_at` already ISO date in mock.
- **support_requests** — One per `supportRequests[]`; optional `project_id` as in mock.
- **billing_records** — One per `billingRecords[]`. Mock `amount` is in **dollars**; DB column is `amount_cents` (e.g. 2500 dollars → 250000).

Use this mapping when writing seed scripts so behavior matches the current app.

---

## 2. SQL table structure

```sql
-- Enums (optional; can use text + check instead)
CREATE TYPE project_status AS ENUM ('active', 'in_progress', 'pending', 'completed');
CREATE TYPE client_service_status AS ENUM ('active', 'in_progress', 'pending', 'completed');
CREATE TYPE support_request_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE billing_status AS ENUM ('pending', 'paid', 'overdue');

-- Service catalog (seed from lib/data.ts services)
CREATE TABLE services (
  id            text PRIMARY KEY,
  slug          text NOT NULL UNIQUE,
  name          text NOT NULL,
  tagline       text NOT NULL,
  description   text NOT NULL,
  long_description text NOT NULL,
  features      jsonb NOT NULL DEFAULT '[]',
  icon          text NOT NULL,
  highlights    jsonb
);

-- Clients (Clerk user id stored here for portal lookup)
CREATE TABLE clients (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  email         text NOT NULL,
  company       text,
  clerk_user_id text UNIQUE,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

CREATE INDEX idx_clients_clerk_user_id ON clients (clerk_user_id) WHERE clerk_user_id IS NOT NULL;

-- One per client–service pairing
CREATE TABLE client_services (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       uuid NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  service_id      text NOT NULL REFERENCES services (id),
  engagement_name text NOT NULL,
  status          client_service_status NOT NULL,
  progress        smallint NOT NULL CHECK (progress >= 0 AND progress <= 100),
  started_at      timestamptz,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

CREATE INDEX idx_client_services_client_id ON client_services (client_id);

-- One project per client_service (delivery)
CREATE TABLE projects (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_service_id uuid NOT NULL UNIQUE REFERENCES client_services (id) ON DELETE CASCADE,
  name              text NOT NULL,
  status            project_status NOT NULL,
  progress          smallint NOT NULL CHECK (progress >= 0 AND progress <= 100),
  started_at        timestamptz,
  completed_at      timestamptz,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

CREATE INDEX idx_projects_client_service_id ON projects (client_service_id);

-- Milestones for a project
CREATE TABLE milestones (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  title       text NOT NULL,
  due_date    date NOT NULL,
  completed_at timestamptz,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE INDEX idx_milestones_project_id ON milestones (project_id);

-- Updates / posts for a project
CREATE TABLE project_updates (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  title      text NOT NULL,
  body       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_project_updates_project_id ON project_updates (project_id);
CREATE INDEX idx_project_updates_created_at ON project_updates (project_id, created_at DESC);

-- Support requests (client portal or public marketing form; optional project link)
CREATE TABLE support_requests (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id        uuid REFERENCES clients (id) ON DELETE CASCADE,
  project_id       uuid REFERENCES projects (id) ON DELETE SET NULL,
  subject          text NOT NULL,
  body             text,
  status           support_request_status NOT NULL,
  category         text,
  requester_name   text,
  requester_email  text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz DEFAULT now(),
  CONSTRAINT support_requests_client_or_public_contact_chk CHECK (
    client_id IS NOT NULL
    OR (
      requester_name IS NOT NULL
      AND length(btrim(requester_name)) > 0
      AND requester_email IS NOT NULL
      AND length(btrim(requester_email)) > 0
    )
  )
);

CREATE INDEX idx_support_requests_client_id ON support_requests (client_id);

-- Admin replies (and future sender types) on a support thread
CREATE TABLE support_replies (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  support_request_id  uuid NOT NULL REFERENCES support_requests (id) ON DELETE CASCADE,
  body                text NOT NULL,
  sender_type         text NOT NULL DEFAULT 'admin',
  created_at          timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT support_replies_sender_type_chk CHECK (sender_type IN ('admin'))
);

CREATE INDEX idx_support_replies_request_created
  ON support_replies (support_request_id, created_at ASC);

-- Invoices / payments (amount in cents)
CREATE TABLE billing_records (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id        uuid NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  amount_cents     integer NOT NULL,
  currency         text DEFAULT 'USD',
  description      text NOT NULL,
  status           billing_status NOT NULL,
  due_date         date NOT NULL,
  paid_at          timestamptz,
  stripe_invoice_id text,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

CREATE INDEX idx_billing_records_client_id ON billing_records (client_id);
```

- **Naming:** Column names = TS property names in snake_case (e.g. `clientId` → `client_id`). Keeps schema aligned with `lib/types.ts`.
- **Keys:** `uuid` PKs for portal tables; `services.id` = `text` to match `lib/data.ts` ids. FKs: CASCADE where child depends on parent; SET NULL for optional `support_requests.project_id`.
- **Timestamps:** `timestamptz`; default `now()` for `created_at`/`updated_at`.
- **Money:** `amount_cents` (integer); app layer converts to/from TS `amount` (dollars).

---

## 3. Implementation notes for future Supabase integration

1. **Row Level Security (RLS)**  
   Enable RLS on all portal tables. For the client portal, the rule is: a row is visible/editable only if the signed-in user’s `clerk_user_id` matches `clients.clerk_user_id` and the row belongs to that client (via `client_id` or through a join from project/client_service). Policies will typically: (a) resolve the current `client_id` from `clients` where `clerk_user_id = auth.jwt() ->> 'sub'` (or via a small helper), and (b) restrict `SELECT`/`INSERT`/`UPDATE` to rows for that client.

2. **Replacing mock data**  
   - Replace `CURRENT_CLIENT_ID` usage with “current client id from DB” by looking up `clients.id` where `clerk_user_id = <Clerk user id>`.
   - Keep `lib/data.ts` (or a thin wrapper) for the **services** catalog until it’s seeded in Supabase; then read services from the DB. Same for any other reference data you move into the DB.
   - Migrate existing mock portal data into Supabase only if you need it (e.g. one seed client + projects for dev/demo). Otherwise start with empty tables and create data via the app or Supabase UI.

3. **TypeScript types**  
   Keep `lib/types.ts` as the source of truth for the app. When you add Supabase, you can: (a) keep types as-is and map DB rows to them in your data layer (e.g. `amount_cents` → `amount` in dollars for TS, or keep `amount` in cents in TS and format in UI); (b) or generate types from Supabase (e.g. `supabase gen types`) and align them with your domain types. Prefer one place (your domain types) and map from DB to avoid drift.

4. **Clerk + Supabase**  
   On sign-in, get the Clerk user id; ensure a `clients` row exists with that `clerk_user_id` (create one if you use “sign up = new client”). Use Supabase auth only if you later move off Clerk; until then, use Clerk for auth and Supabase as the data store, with `clerk_user_id` as the link.

   **Linking a Clerk user to the seed client (one-time):** So the dashboard shows real data for a signed-in user, set `clerk_user_id` on the seed client to your Clerk user id (e.g. from Clerk Dashboard → Users → user id like `user_2abc...`). In Supabase SQL Editor:  
   `UPDATE clients SET clerk_user_id = 'user_2abc...' WHERE email = 'contact@acme.example.com';`  
   (Use the actual Clerk user id; the app uses it to resolve `getCurrentClientId()` and run dashboard queries.)

5. **Stripe**  
   When you add billing, store Stripe invoice/payment intent ids in `billing_records.stripe_invoice_id` (and similar if needed). Store amounts in cents from Stripe. Webhooks can create or update `billing_records` and set `paid_at` when payment succeeds.

6. **`updated_at`**  
   Use a trigger or Supabase `updated_at` extension to set `updated_at = now()` on row update for all tables that have it. Supabase docs describe this pattern.

7. **ProjectWithDetails**  
   This is not a table. Implement it as: (a) a Supabase view that joins `projects` with “next milestone” and “latest project_update” (e.g. lateral joins or subqueries), or (b) the same logic in your app by querying projects, then milestones and project_updates per project and assembling in code (as you do now). Option (b) is simpler for a solo founder; (a) is better if you want a single query from the client.

8. **Seeding services**  
   Insert `services` from `lib/data.ts` (same ids `"1"`–`"6"`, slug, name, tagline, description, long_description, features, icon, highlights) so `client_services.service_id` and app code stay valid.
