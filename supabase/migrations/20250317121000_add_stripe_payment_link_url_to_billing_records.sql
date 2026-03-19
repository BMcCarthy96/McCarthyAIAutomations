-- Add Stripe Payment Link URL to billing records.

ALTER TABLE public.billing_records
  ADD COLUMN IF NOT EXISTS stripe_payment_link_url text;

