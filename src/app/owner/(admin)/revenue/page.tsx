import { FiCreditCard, FiDollarSign, FiRepeat, FiTrendingUp } from "react-icons/fi";
import { OwnerBadge, OwnerMuted, OwnerPanel, OwnerStat, formatDate, formatMoney } from "@/components/owner/OwnerUi";
import { getOwnerMetrics } from "@/lib/server/owner-metrics";

const OwnerRevenuePage = async () => {
    const metrics = await getOwnerMetrics();
    const maxPlan = Math.max(1, ...metrics.planBreakdown.map((item) => item.count));

    return (
        <div className="space-y-7">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <OwnerStat label="Total revenue" value={formatMoney(metrics.summary.totalRevenue)} detail="All recorded payments" tone="green" />
                <OwnerStat label="This month" value={formatMoney(metrics.summary.monthRevenue)} detail="Current calendar month" tone="amber" />
                <OwnerStat label="Estimated MRR" value={formatMoney(metrics.summary.mrr)} detail="Based on active paid plans" tone="blue" />
                <OwnerStat label="Paid users" value={String(metrics.summary.paidUsers)} detail={`${metrics.summary.expiredUsers} expired accounts`} tone="purple" />
            </div>

            <div className="grid gap-7 xl:grid-cols-[0.9fr_1fr]">
                <OwnerPanel>
                    <h2 className="flex items-center gap-3 text-2xl font-extrabold"><FiTrendingUp /> Plan Revenue Mix</h2>
                    <OwnerMuted className="mt-1">Current plan distribution and recurring value signal.</OwnerMuted>
                    <div className="mt-7 space-y-5">
                        {metrics.planBreakdown.map((item) => (
                            <div key={item.label}>
                                <div className="flex justify-between gap-4 text-sm font-extrabold">
                                    <span>{item.label}</span>
                                    <span>{item.count} users</span>
                                </div>
                                <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                                    <div className="h-full rounded-full bg-[#f4c430]" style={{ width: `${(item.count / maxPlan) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </OwnerPanel>

                <OwnerPanel>
                    <h2 className="flex items-center gap-3 text-2xl font-extrabold"><FiRepeat /> Subscription Health</h2>
                    <OwnerMuted className="mt-1">Auto-renewing and prepaid/trial user mix.</OwnerMuted>
                    <div className="mt-7 grid gap-4 sm:grid-cols-3">
                        <Mini icon={<FiCreditCard />} label="Auto-renewing" value={String(metrics.userRows.filter((user) => user.autoRenewal && !user.expired).length)} />
                        <Mini icon={<FiDollarSign />} label="Paid active" value={String(metrics.summary.paidUsers)} />
                        <Mini icon={<FiRepeat />} label="Trials" value={String(metrics.summary.trialUsers)} />
                    </div>
                    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <OwnerMuted className="text-sm">Recommendation</OwnerMuted>
                        <p className="mt-2 font-bold text-[#cbd5e1]">Connect the Stripe `price_...` IDs in `.env.local` so Checkout uses your existing Stripe products instead of dynamically-created subscription prices.</p>
                    </div>
                </OwnerPanel>
            </div>

            <OwnerPanel>
                <h2 className="text-2xl font-extrabold">Payment History</h2>
                <OwnerMuted className="mt-1">All payment records stored after signup, trial creation, and paid Stripe checkout fulfillment.</OwnerMuted>
                <div className="mt-7 overflow-x-auto">
                    <table className="w-full min-w-[1000px] text-left text-sm">
                        <thead className="text-[#94a3b8]">
                            <tr className="border-b border-white/10">
                                <th className="py-4">Customer</th>
                                <th>Plan</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Access end</th>
                                <th>Payment ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metrics.paymentRows.map((payment) => (
                                <tr key={payment.id} className="border-b border-white/10">
                                    <td className="py-4">
                                        <strong>{payment.userName}</strong>
                                        <OwnerMuted className="text-xs">{payment.userEmail}</OwnerMuted>
                                    </td>
                                    <td><OwnerBadge tone={payment.plan === "Trial" ? "gray" : "blue"}>{payment.plan}</OwnerBadge></td>
                                    <td><strong>{formatMoney(payment.amount)}</strong></td>
                                    <td>{formatDate(payment.date)}</td>
                                    <td>{formatDate(payment.end)}</td>
                                    <td className="font-mono text-xs text-[#94a3b8]">{payment.id.slice(0, 18)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {metrics.paymentRows.length === 0 && <OwnerMuted className="py-10 text-center">No payments yet.</OwnerMuted>}
                </div>
            </OwnerPanel>
        </div>
    );
};

const Mini = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <div className="text-[#f4c430]">{icon}</div>
        <strong className="mt-4 block text-3xl">{value}</strong>
        <OwnerMuted className="mt-1 text-sm">{label}</OwnerMuted>
    </div>
);

export default OwnerRevenuePage;
