-- Enable Row Level Security on every table in the public schema.
-- All application code uses the service_role key, which bypasses RLS automatically,
-- so these policies only affect direct anon/authenticated Supabase client queries
-- (e.g. someone using the publicly-visible anon key to query the REST API directly).
--
-- Strategy: enable RLS + deny all access to anon and authenticated roles on every table.
-- The service_role key bypasses RLS and continues to work unchanged.

-- ── clients ──────────────────────────────────────────────────────────────────
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deny_anon_clients"
  ON public.clients FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_clients"
  ON public.clients FOR ALL TO authenticated USING (false);

-- ── projects ─────────────────────────────────────────────────────────────────
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deny_anon_projects"
  ON public.projects FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_projects"
  ON public.projects FOR ALL TO authenticated USING (false);

-- ── milestones ───────────────────────────────────────────────────────────────
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deny_anon_milestones"
  ON public.milestones FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_milestones"
  ON public.milestones FOR ALL TO authenticated USING (false);

-- ── project_updates ──────────────────────────────────────────────────────────
ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deny_anon_project_updates"
  ON public.project_updates FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_project_updates"
  ON public.project_updates FOR ALL TO authenticated USING (false);

-- ── billing_records ──────────────────────────────────────────────────────────
ALTER TABLE public.billing_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deny_anon_billing_records"
  ON public.billing_records FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_billing_records"
  ON public.billing_records FOR ALL TO authenticated USING (false);

-- ── support_requests ─────────────────────────────────────────────────────────
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deny_anon_support_requests"
  ON public.support_requests FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_support_requests"
  ON public.support_requests FOR ALL TO authenticated USING (false);

-- ── support_replies ──────────────────────────────────────────────────────────
ALTER TABLE public.support_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deny_anon_support_replies"
  ON public.support_replies FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_support_replies"
  ON public.support_replies FOR ALL TO authenticated USING (false);

-- ── client_services ──────────────────────────────────────────────────────────
ALTER TABLE public.client_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deny_anon_client_services"
  ON public.client_services FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_client_services"
  ON public.client_services FOR ALL TO authenticated USING (false);

-- ── project_metrics ──────────────────────────────────────────────────────────
ALTER TABLE public.project_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deny_anon_project_metrics"
  ON public.project_metrics FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_project_metrics"
  ON public.project_metrics FOR ALL TO authenticated USING (false);

-- ── automation_events ────────────────────────────────────────────────────────
ALTER TABLE public.automation_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deny_anon_automation_events"
  ON public.automation_events FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_automation_events"
  ON public.automation_events FOR ALL TO authenticated USING (false);

-- ── services (static catalog) ────────────────────────────────────────────────
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deny_anon_services"
  ON public.services FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_services"
  ON public.services FOR ALL TO authenticated USING (false);

-- Belt-and-suspenders: also revoke all direct table grants from anon and authenticated.
-- Service role is unaffected (it uses BYPASSRLS, not table grants).
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;
