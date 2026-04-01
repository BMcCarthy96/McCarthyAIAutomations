import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type Stripe from "stripe";
import { getStripeServer } from "@/lib/stripe";
import { getSupabaseServiceClient } from "@/lib/supabase";

export async function POST(req: Request) {
  const stripe = getStripeServer();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      {
        error: "Stripe webhook is not configured.",
        details:
          "Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET in environment variables.",
      },
      { status: 503 }
    );
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  }

  const sig = (await headers()).get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // Payment Links create Checkout Sessions; this event fires when payment is complete.
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Only mark paid when Stripe indicates payment succeeded.
    if (session.payment_status && session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const metadata = session.metadata ?? {};
    const billingRecordId = metadata.billingRecordId?.trim();
    const clientId = metadata.clientId?.trim();

    if (!billingRecordId) {
      return NextResponse.json(
        { error: "Missing billingRecordId in Stripe metadata." },
        { status: 400 }
      );
    }

    // Best-effort: verify clientId matches when provided.
    if (clientId) {
      const { data: existing } = await supabase
        .from("billing_records")
        .select("client_id")
        .eq("id", billingRecordId)
        .maybeSingle();

      if (existing?.client_id && existing.client_id !== clientId) {
        return NextResponse.json(
          { error: "clientId does not match billing record." },
          { status: 400 }
        );
      }
    }

    const { data: current, error: currentError } = await supabase
      .from("billing_records")
      .select("status, paid_at")
      .eq("id", billingRecordId)
      .maybeSingle();

    if (currentError) {
      return NextResponse.json({ error: currentError.message }, { status: 500 });
    }
    if (!current) {
      return NextResponse.json({ error: "Billing record not found." }, { status: 404 });
    }
    if (current.status === "paid") {
      return NextResponse.json({ received: true });
    }

    const { error } = await supabase
      .from("billing_records")
      .update({
        status: "paid",
        paid_at: current.paid_at ?? new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", billingRecordId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/admin/billing");
    revalidatePath("/dashboard/billing");

    return NextResponse.json({ received: true });
  }

  // Ignore other Stripe event types for now.
  return NextResponse.json({ received: true });
}

