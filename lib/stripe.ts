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

/**
 * Creates a one-time Stripe Payment Link for a client payment.
 * Amount is provided in dollars and converted to cents.
 *
 * Returns the payment link URL, or null if Stripe is unavailable or creation fails.
 */
export async function createPaymentLinkForClient({
  customerId,
  amount,
  description,
  clientId,
  billingRecordId,
}: {
  customerId: string;
  /** Dollar amount (e.g. 49.00). */
  amount: number;
  description: string;
  clientId?: string;
  billingRecordId?: string;
}): Promise<string | null> {
  const stripe = getStripeServer();
  if (!stripe) return null;

  function getStripeErrorMessage(err: unknown): string {
    const anyErr = err as any;
    return (
      anyErr?.message ||
      anyErr?.error?.message ||
      "Stripe payment link creation failed"
    );
  }

  try {
    const unitAmountCents = Math.max(0, Math.round(amount * 100));
    if (!customerId || unitAmountCents <= 0) return null;

    const paymentLink = await (stripe.paymentLinks.create as any)({
      // Payment Links endpoint doesn't support top-level `customer` in our SDK.
      // Use `customer_creation` so Stripe will handle customer assignment.
      customer_creation: "always",
      // Stripe supports `line_items` with `price_data`, but the SDK types for
      // this specific endpoint are stricter in our version; cast to keep runtime behavior.
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: unitAmountCents,
            product_data: {
              name: "Automation services",
              description: description?.slice(0, 300) || undefined,
            },
          },
        },
      ] as any,
      metadata: {
        ...(clientId ? { clientId } : {}),
        ...(billingRecordId ? { billingRecordId } : {}),
      },
    });

    return paymentLink.url ?? null;
  } catch (err) {
    const message = getStripeErrorMessage(err);
    console.error("Stripe payment link creation failed:", message, err);
    throw new Error(message);
  }
}
