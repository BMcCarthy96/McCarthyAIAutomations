import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

/**
 * Server-side Stripe instance. Returns null if STRIPE_SECRET_KEY is not set
 * (e.g. dev without Stripe configured). Callers must handle null.
 */
export function getStripeServer(): Stripe | null {
  if (!secretKey || secretKey.trim() === "") return null;
  return new Stripe(secretKey, { apiVersion: "2023-10-16" });
}

/**
 * Creates a Stripe customer for a client. Used when a new client is created
 * so they can be associated with subscriptions later.
 * Returns the Stripe customer id, or null if Stripe is unavailable or creation fails.
 * Does not throw; safe to call from client-creation flow.
 */
export async function createStripeCustomerForClient(
  name: string,
  email: string
): Promise<string | null> {
  const stripe = getStripeServer();
  if (!stripe) return null;

  try {
    const customer = await stripe.customers.create({
      name: name.trim() || undefined,
      email: email.trim() || undefined,
    });
    return customer.id ?? null;
  } catch {
    return null;
  }
}
