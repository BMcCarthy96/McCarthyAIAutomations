-- Add Stripe fields to clients for subscription support.
-- Run with: supabase db push (or apply via Supabase dashboard SQL editor)

ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

COMMENT ON COLUMN public.clients.stripe_customer_id IS 'Stripe customer id; set when client is created.';
COMMENT ON COLUMN public.clients.stripe_subscription_id IS 'Stripe subscription id when client has an active recurring subscription.';
