import { FiCreditCard, FiDollarSign, FiRepeat, FiTrendingUp, FiUsers } from "react-icons/fi";
import { IconTile, PanelHeader, StatGrid, tableClass, type Tone } from "@/components/dashboard/DashboardUi";
import { OwnerBadge, OwnerMuted, OwnerPanel, OwnerStat, formatDate, formatMoney } from "@/components/owner/OwnerUi";
import { getOwnerMetrics } from "@/lib/server/owner-metrics";

const OwnerRevenuePage = async () => {
    const metrics = await getOwnerMetrics();
    const maxPlan = Math.max(1, ...metrics.planBreakdown.map((item) => item.count));

    return (
        <div className="space-y-8">
            <StatGrid>
                <OwnerStat label="Total revenue" value={formatMoney(metrics.summary.totalRevenue)} detail="All recorded payments" icon={<FiDollarSign />} tone="green" />
                <OwnerStat label="This month" value={formatMoney(metrics.summary.monthRevenue)} detail="Current calendar month" icon={<FiTrendingUp />} tone="amber" />
                <OwnerStat label="Estimated MRR" value={formatMoney(metrics.summary.mrr)} detail="Based on active paid plans" icon={<FiRepeat />} tone="blue" />
                <OwnerStat label="Paid users" value={String(metrics.summary.paidUsers)} detail={`${metrics.summary.expiredUsers} expired accounts`} icon={<FiUsers />} tone="purple" />
            </StatGrid>

            <div className="grid gap-6 xl:grid-cols-[0.9fr_1fr]">
                <OwnerPanel>
                    <PanelHeader icon={<FiTrendingUp />} title="Plan Revenue Mix" description="Current plan distribution and recurring value signal." />
                    <div className="mt-6 space-y-5">
                        {metrics.planBreakdown.map((item) => (
                            <div key={item.label}>
                                <div className="flex justify-between gap-4 text-sm">
                                    <span className="font-medium text-slate-700">{item.label}</span>
                                    <span className="font-bold text-slate-800">{item.count} users</span>
                                </div>
                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400" style={{ width: `${(item.count / maxPlan) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </OwnerPanel>

                <OwnerPanel>
                    <PanelHeader icon={<FiRepeat />} title="Subscription Health" description="Auto-renewing and prepaid/trial user mix." />
                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        <Mini icon={<FiCreditCard />} tone="blue" label="Auto-renewing" value={String(metrics.userRows.filter((user) => user.autoRenewal && !user.expired).length)} />
                        <Mini icon={<FiDollarSign />} tone="green" label="Paid active" value={String(metrics.summary.paidUsers)} />
                        <Mini icon={<FiRepeat />} tone="gray" label="Trials" value={String(metrics.summary.trialUsers)} />
                    </div>
                    <div className="mt-6 rounded-xl bg-slate-50 p-4">
                        <OwnerMuted className="text-xs font-bold uppercase tracking-wider">Recommendation</OwnerMuted>
                        <p className="mt-1 text-sm text-slate-700">Connect the Stripe <code className="rounded bg-white px-1 py-0.5 text-xs">price_...</code> IDs in <code className="rounded bg-white px-1 py-0.5 text-xs">.env.local</code> so Checkout uses your existing Stripe products instead of dynamically-created subscription prices.</p>
                    </div>
                </OwnerPanel>
            </div>

            <OwnerPanel className="px-0 pb-2">
                <PanelHeader className="px-6" title="Payment History" description="All payment records stored after signup, trial creation, and paid Stripe checkout fulfillment." />
                <div className="mt-6 overflow-x-auto">
                    <table className={`${tableClass} min-w-[960px]`}>
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Plan</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Access end</th>
                                <th>Payment ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metrics.paymentRows.map((payment) => (
                                <tr key={payment.id}>
                                    <td>
                                        <p className="font-medium text-slate-800">{payment.userName}</p>
                                        <OwnerMuted className="text-xs">{payment.userEmail}</OwnerMuted>
                                    </td>
                                    <td><OwnerBadge tone={payment.plan === "Trial" ? "gray" : "blue"}>{payment.plan}</OwnerBadge></td>
                                    <td className="font-bold text-slate-800">{formatMoney(payment.amount)}</td>
                                    <td className="whitespace-nowrap">{formatDate(payment.date)}</td>
                                    <td className="whitespace-nowrap">{formatDate(payment.end)}</td>
                                    <td className="font-mono text-xs text-slate-500">{payment.id.slice(0, 18)}</td>
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

const Mini = ({ icon, tone, label, value }: { icon: React.ReactNode; tone: Tone; label: string; value: string }) => (
    <div className="rounded-xl border border-slate-200/80 p-4">
        <IconTile tone={tone} className="h-10 w-10 text-base">{icon}</IconTile>
        <strong className="mt-4 block text-2xl font-bold text-slate-800">{value}</strong>
        <OwnerMuted className="text-sm">{label}</OwnerMuted>
    </div>
);

export default OwnerRevenuePage;
