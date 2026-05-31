import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
        throw new Error("STRIPE_SECRET_KEY is not configured.");
    }

    stripe ||= new Stripe(secretKey, {
        apiVersion: "2026-05-27.dahlia",
        typescript: true,
    });
    return stripe;
}

export function stripeCurrency() {
    return (process.env.STRIPE_CURRENCY || "usd").toLowerCase();
}

export function appUrl() {
    return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001").replace(/\/$/, "");
}
