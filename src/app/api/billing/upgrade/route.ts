import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { paidPlanNames, getPlanConfig } from "@/data/plans";
import { requireApiUser } from "@/lib/server/responses";
import { PlanName } from "@/lib/server/store";
import { appUrl, getStripe, stripeCurrency } from "@/lib/server/stripe";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    const { user, response } = await requireApiUser();
    if (!user) return response;

    const body = await request.json();
    const planName = String(body.plan || "") as PlanName;
    if (!paidPlanNames.includes(planName)) {
        return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    try {
        const stripe = getStripe();
        const plan = getPlanConfig(planName);
        const baseUrl = appUrl();
        const existingPrice = plan.stripePriceEnv ? process.env[plan.stripePriceEnv] : "";
        const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = existingPrice
            ? { quantity: 1, price: existingPrice }
            : {
                quantity: 1,
                price_data: {
                    currency: stripeCurrency(),
                    unit_amount: Math.round(plan.price * 100),
                    recurring: {
                        interval: plan.billingInterval || "month",
                    },
                    product_data: {
                        name: `GPT Chart View - ${plan.name}`,
                        description: `${plan.dailyLimit} uploads per day · ${plan.durationLabel}`,
                    },
                },
            };
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            customer_email: user.email,
            line_items: [lineItem],
            metadata: {
                userId: user.id,
                planName,
            },
            subscription_data: {
                metadata: {
                    userId: user.id,
                    planName,
                },
            },
            success_url: `${baseUrl}/dashboard/billing/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/dashboard/billing?checkout=cancelled`,
        });

        return NextResponse.json({ url: session.url, sessionId: session.id });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to create Stripe Checkout session.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
