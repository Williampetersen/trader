import Link from "next/link";
import { FiArrowRight, FiCheckCircle, FiClock } from "react-icons/fi";
import { requireUser } from "@/lib/server/auth";
import { readDb } from "@/lib/server/store";
import { getPlanConfig } from "@/data/plans";
import { MutedText, Panel, PrimaryButton } from "@/components/dashboard/DashboardUi";
import UpgradePlanButtons from "@/components/dashboard/UpgradePlanButtons";

const BillingPage = async () => {
    const user = await requireUser();
    const db = await readDb();
    const payments = db.payments.filter((item) => item.userId === user.id).reverse();
    const planConfig = getPlanConfig(user.plan.name);
    const expired = new Date(user.plan.expiresAt).getTime() <= Date.now();

    return (
        <div className="mx-auto max-w-[1215px] space-y-8">
            <Panel>
                <h2 className="text-xl font-extrabold">Current Plan</h2>
                <MutedText className="mt-1">Your active subscription details</MutedText>
                <div className="mt-7 rounded-3xl border border-[#3457ff]/30 bg-[#3457ff]/15 p-4 text-[#bfdbfe]">
                    <strong>{expired ? "This plan has expired" : user.plan.autoRenewal ? "This plan renews automatically" : "This is a prepaid plan with no auto-renewal"}</strong>
                    <p className="mt-2 text-sm text-[#cbd5e1]">
                        {expired ? "Upgrade to restore chart uploads." : `Your access is valid until ${new Date(user.plan.expiresAt).toLocaleDateString()}.`}
                    </p>
                </div>

                <div className="mt-6 flex items-start justify-between border-b border-white/10 pb-6">
                    <div>
                        <h3 className="text-2xl font-extrabold">{user.plan.name}</h3>
                        <MutedText>{planConfig.durationLabel} access | {planConfig.allowanceLabel}</MutedText>
                    </div>
                    <strong className="text-2xl">${planConfig.price.toFixed(2)}</strong>
                </div>

                <h3 className="mt-6 font-extrabold">Plan Features:</h3>
                <ul className="mt-4 space-y-3 text-lg">
                    {planConfig.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3"><FiCheckCircle className="text-[#22c55e]" />{feature}</li>
                    ))}
                    <li className="flex items-center gap-3"><FiCheckCircle className="text-[#22c55e]" />Private user history</li>
                </ul>

                <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-[#cbd5e1]">
                    <strong>Stripe Checkout:</strong> Paid upgrades open Stripe&apos;s secure subscription checkout. Access is activated after Stripe confirms payment.
                </div>

                <Link href="/#pricing" className="mt-5 inline-block"><PrimaryButton>View Public Pricing <FiArrowRight className="ml-2 inline" /></PrimaryButton></Link>
                <UpgradePlanButtons />
            </Panel>

            <Panel>
                <h2 className="flex items-center gap-2 text-xl font-extrabold"><FiClock /> Payment History</h2>
                <MutedText className="mt-1">Your recent subscription payments</MutedText>
                <div className="mt-7 overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <table className="w-full min-w-[780px] text-left">
                        <thead className="bg-white/[0.04] text-[#cbd5e1]">
                            <tr className="border-b border-white/10">
                                <th className="p-4">Date</th>
                                <th>Plan</th>
                                <th>Amount</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Payment ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment.id} className="border-b border-white/10">
                                    <td className="p-4">{new Date(payment.date).toLocaleDateString()}</td>
                                    <td>{payment.plan}</td>
                                    <td>${payment.amount.toFixed(2)}</td>
                                    <td>{new Date(payment.start).toLocaleDateString()}</td>
                                    <td>{new Date(payment.end).toLocaleDateString()}</td>
                                    <td>{payment.id.slice(0, 10)}</td>
                                </tr>
                            ))}
                            {payments.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center text-[#94a3b8]">No payments yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Panel>
        </div>
    );
};

export default BillingPage;
