import Stripe from "stripe";
import { paidPlanNames } from "@/data/plans";
import { PlanName, createPlan, planDetails, readDb, writeDb } from "./store";
import { getStripe } from "./stripe";

export async function fulfillCheckoutSession(sessionId: string, expectedUserId?: string) {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["subscription"] });
    const userId = session.metadata?.userId;
    const planName = session.metadata?.planName as PlanName | undefined;

    if (!userId || !planName || !paidPlanNames.includes(planName)) {
        throw new Error("Checkout session metadata is invalid.");
    }

    if (expectedUserId && expectedUserId !== userId) {
        throw new Error("Checkout session does not belong to this user.");
    }

    if (session.payment_status !== "paid") {
        return { status: "pending" as const, session };
    }

    const db = await readDb();
    const dbUser = db.users.find((item) => item.id === userId);
    if (!dbUser) throw new Error("User not found for paid checkout session.");

    const existingPayment = db.payments.find((payment) => payment.id === session.id);
    if (existingPayment) {
        return { status: "already_fulfilled" as const, session, plan: dbUser.plan };
    }

    const now = new Date();
    const details = planDetails(planName);
    const subscription = await getSubscription(session);
    const subscriptionPeriodEnd = subscription ? Number((subscription as unknown as { current_period_end?: number }).current_period_end || 0) : 0;
    const end = subscriptionPeriodEnd
        ? new Date(subscriptionPeriodEnd * 1000)
        : new Date(now.getTime() + details.days * 24 * 60 * 60 * 1000);
    dbUser.plan = createPlan(planName, now, { autoRenewal: Boolean(subscription), expiresAt: end.toISOString() });
    dbUser.stripeCustomerId = customerId(session.customer) || dbUser.stripeCustomerId;
    dbUser.stripeSubscriptionId = subscription?.id || dbUser.stripeSubscriptionId;
    db.payments.push({
        id: session.id,
        userId,
        date: now.toISOString(),
        plan: planName,
        amount: details.amount,
        start: now.toISOString(),
        end: end.toISOString(),
    });
    await writeDb(db);

    return { status: "fulfilled" as const, session, plan: dbUser.plan };
}

async function getSubscription(session: Stripe.Checkout.Session) {
    if (!session.subscription) return null;
    if (typeof session.subscription === "string") {
        return getStripe().subscriptions.retrieve(session.subscription);
    }
    return session.subscription;
}

function customerId(customer: Stripe.Checkout.Session["customer"]) {
    if (!customer) return "";
    return typeof customer === "string" ? customer : customer.id;
}
