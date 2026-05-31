import Link from "next/link";
import { FiCheckCircle, FiClock } from "react-icons/fi";
import { fulfillCheckoutSession } from "@/lib/server/billing";
import { requireUser } from "@/lib/server/auth";
import { MutedText, Panel, PrimaryButton } from "@/components/dashboard/DashboardUi";

const BillingSuccessPage = async ({ searchParams }: { searchParams: { session_id?: string } }) => {
    const user = await requireUser();
    const sessionId = searchParams.session_id;
    let title = "Payment received";
    let description = "Stripe is confirming your payment. Your plan will update when payment is complete.";
    let icon = <FiClock className="h-12 w-12 text-[#ad6b00]" />;

    if (sessionId) {
        try {
            const result = await fulfillCheckoutSession(sessionId, user.id);
            if (result.status === "fulfilled" || result.status === "already_fulfilled") {
                title = `${result.plan?.name || "Plan"} is active`;
                description = "Your paid access and daily upload credits are now active on this account.";
                icon = <FiCheckCircle className="h-12 w-12 text-[#0f9f6e]" />;
            }
        } catch {
            title = "Payment needs review";
            description = "We could not verify this Checkout Session for your account. If payment was taken, contact support with the session ID.";
        }
    }

    return (
        <Panel className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#f8fafc]">
                {icon}
            </div>
            <h2 className="mt-6 text-3xl font-extrabold">{title}</h2>
            <MutedText className="mx-auto mt-3 max-w-lg">{description}</MutedText>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/dashboard/billing"><PrimaryButton>Back to Billing</PrimaryButton></Link>
                <Link href="/dashboard/upload" className="rounded-xl border border-[#dbe3ef] bg-white px-5 py-3 text-sm font-extrabold text-[#111827] shadow-sm transition-colors hover:border-[#3457ff] hover:text-[#3457ff]">
                    Upload Chart
                </Link>
            </div>
        </Panel>
    );
};

export default BillingSuccessPage;
