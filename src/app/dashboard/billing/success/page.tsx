import Link from "next/link";
import { FiCheckCircle, FiClock } from "react-icons/fi";
import { fulfillCheckoutSession } from "@/lib/server/billing";
import { requireUser } from "@/lib/server/auth";
import { MutedText, Panel, outlineButtonClass, primaryButtonClass } from "@/components/dashboard/DashboardUi";

const BillingSuccessPage = async ({ searchParams }: { searchParams: { session_id?: string } }) => {
    const user = await requireUser();
    const sessionId = searchParams.session_id;
    let title = "Payment received";
    let description = "Stripe is confirming your payment. Your plan will update when payment is complete.";
    let icon = <FiClock className="h-10 w-10 text-amber-500" />;

    if (sessionId) {
        try {
            const result = await fulfillCheckoutSession(sessionId, user.id);
            if (result.status === "fulfilled" || result.status === "already_fulfilled") {
                title = `${result.plan?.name || "Plan"} is active`;
                description = "Your paid access and daily upload credits are now active on this account.";
                icon = <FiCheckCircle className="h-10 w-10 text-emerald-500" />;
            }
        } catch {
            title = "Payment needs review";
            description = "We could not verify this Checkout Session for your account. If payment was taken, contact support with the session ID.";
        }
    }

    return (
        <Panel className="mx-auto max-w-2xl py-12 text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-slate-50">
                {icon}
            </div>
            <h2 className="mt-6 text-2xl font-bold text-slate-800">{title}</h2>
            <MutedText className="mx-auto mt-2 max-w-lg">{description}</MutedText>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/dashboard/billing" className={primaryButtonClass}>Back to Billing</Link>
                <Link href="/dashboard/upload" className={outlineButtonClass}>Upload Chart</Link>
            </div>
        </Panel>
    );
};

export default BillingSuccessPage;
