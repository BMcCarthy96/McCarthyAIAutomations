-- Add is_archived to projects for archiving (hide from client dashboard, keep in DB).
-- Run in Supabase SQL Editor.

ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS is_archived boolean NOT NULL DEFAULT false;
