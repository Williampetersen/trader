import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { fulfillCheckoutSession } from "@/lib/server/billing";
import { getStripe } from "@/lib/server/stripe";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    const stripe = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const signature = request.headers.get("stripe-signature");

    if (!webhookSecret) {
        return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET is not configured." }, { status: 500 });
    }
    if (!signature) {
        return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
        const rawBody = await request.text();
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch {
        return NextResponse.json({ error: "Invalid Stripe webhook signature." }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        await fulfillCheckoutSession(session.id);
    }

    return NextResponse.json({ received: true });
}
