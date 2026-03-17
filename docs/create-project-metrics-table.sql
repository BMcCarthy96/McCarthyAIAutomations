-- Create public.project_metrics for admin automation metrics (one row per project).
-- Run this in the Supabase SQL Editor.
-- Requires: public.projects table with id (uuid).

CREATE TABLE IF NOT EXISTS public.project_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  calls_handled integer,
  leads_captured integer,
  appointments_booked integer,
  hours_saved integer,
  estimated_revenue integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT project_metrics_project_id_key UNIQUE (project_id)
);

-- Optional: keep updated_at in sync on row update
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS project_metrics_updated_at ON public.project_metrics;
CREATE TRIGGER project_metrics_updated_at
  BEFORE UPDATE ON public.project_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- RLS: allow service role (backend) full access; restrict anon/authenticated if you use them for this table.
ALTER TABLE public.project_metrics ENABLE ROW LEVEL SECURITY;

-- Policy: service role is used by your app server; adjust policies if you query from client with authenticated role.
CREATE POLICY "Service role full access on project_metrics"
  ON public.project_metrics
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
