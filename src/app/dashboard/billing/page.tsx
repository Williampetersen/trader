import clsx from "clsx";
import Link from "next/link";
import { FiArrowRight, FiCheckCircle, FiClock, FiCreditCard } from "react-icons/fi";
import { requireUser } from "@/lib/server/auth";
import { isPlanExpired, readDb } from "@/lib/server/store";
import { getPlanConfig } from "@/data/plans";
import { Badge, IconTile, MutedText, Notice, Panel, PanelHeader, outlineButtonClass, tableClass } from "@/components/dashboard/DashboardUi";
import UpgradePlanButtons from "@/components/dashboard/UpgradePlanButtons";

const BillingPage = async () => {
    const user = await requireUser();
    const db = await readDb();
    const payments = db.payments.filter((item) => item.userId === user.id).reverse();
    const planConfig = getPlanConfig(user.plan.name);
    const expired = isPlanExpired(user);
    const isTrial = user.plan.name === "Trial";

    return (
        <div className="mx-auto max-w-[1215px] space-y-8">
            <Panel>
                <PanelHeader title="Current Plan" description="Your active subscription details" />

                <Notice tone={expired ? "red" : "blue"} className="mt-6">
                    <strong>{isTrial ? (expired ? "Your free trial is finished" : "Free trial, no time limit") : expired ? "This plan has expired" : user.plan.autoRenewal ? "This plan renews automatically" : "This is a prepaid plan with no auto-renewal"}</strong>
                    <p className="mt-1 font-normal">
                        {isTrial ? (expired ? "You have used all 3 free uploads. Choose a plan below to keep analyzing charts." : `${user.plan.creditsLeft} of ${user.plan.dailyLimit} free uploads left on this account.`) : expired ? "Upgrade to restore chart uploads." : `Your access is valid until ${new Date(user.plan.expiresAt).toLocaleDateString()}.`}
                    </p>
                </Notice>

                <div className="mt-6 flex items-center justify-between gap-4 border-b border-slate-100 pb-6">
                    <div className="flex items-center gap-4">
                        <IconTile tone="blue" className="h-12 w-12 text-xl"><FiCreditCard /></IconTile>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">{user.plan.name}</h3>
                            <MutedText className="text-sm">{planConfig.durationLabel} access · {planConfig.allowanceLabel}</MutedText>
                        </div>
                    </div>
                    <strong className="text-2xl font-bold text-slate-800">${planConfig.price.toFixed(2)}</strong>
                </div>

                <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-slate-400">Plan features</h3>
                <ul className="mt-3 grid gap-3 text-slate-700 sm:grid-cols-2">
                    {planConfig.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3"><FiCheckCircle className="shrink-0 text-emerald-500" />{feature}</li>
                    ))}
                    <li className="flex items-center gap-3"><FiCheckCircle className="shrink-0 text-emerald-500" />Private user history</li>
                </ul>

                <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                    <strong className="text-slate-800">Stripe Checkout:</strong> Paid upgrades open Stripe&apos;s secure subscription checkout. Access is activated after Stripe confirms payment.
                </div>

                <Link href="/#pricing" className={clsx(outlineButtonClass, "mt-5")}>View Public Pricing <FiArrowRight /></Link>
                <UpgradePlanButtons />
            </Panel>

            <Panel className="px-0 pb-2">
                <PanelHeader className="px-6" icon={<FiClock />} title="Payment History" description="Your recent subscription payments" />
                <div className="mt-6 overflow-x-auto">
                    <table className={`${tableClass} min-w-[780px]`}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Plan</th>
                                <th>Amount</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Payment ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment.id}>
                                    <td>{new Date(payment.date).toLocaleDateString()}</td>
                                    <td><Badge tone={payment.plan === "Trial" ? "gray" : "blue"}>{payment.plan}</Badge></td>
                                    <td className="font-bold text-slate-800">${payment.amount.toFixed(2)}</td>
                                    <td>{new Date(payment.start).toLocaleDateString()}</td>
                                    <td>{new Date(payment.end).toLocaleDateString()}</td>
                                    <td className="font-mono text-xs text-slate-500">{payment.id.slice(0, 10)}</td>
                                </tr>
                            ))}
                            {payments.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-slate-500">No payments yet.</td>
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
