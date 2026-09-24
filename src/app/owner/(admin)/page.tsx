import Link from "next/link";
import { FiActivity, FiArrowRight, FiCreditCard, FiDollarSign, FiHeadphones, FiUpload, FiUsers, FiWifi } from "react-icons/fi";
import { IconTile, StatGrid, tableClass, type Tone } from "@/components/dashboard/DashboardUi";
import { OwnerBadge, OwnerMuted, OwnerPanel, OwnerStat, formatDate, formatMoney } from "@/components/owner/OwnerUi";
import { getOwnerMetrics } from "@/lib/server/owner-metrics";

const OwnerHomePage = async () => {
    const metrics = await getOwnerMetrics();
    const maxSignup = Math.max(1, ...metrics.signupTrend.map((item) => item.count));
    const maxUpload = Math.max(1, ...metrics.uploadTrend.map((item) => item.count));

    return (
        <div className="space-y-8">
            <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
                <div className="grid gap-6 bg-[radial-gradient(circle_at_0%_0%,rgba(52,87,255,0.10),transparent_45%),radial-gradient(circle_at_100%_100%,rgba(249,115,22,0.07),transparent_40%)] p-6 lg:grid-cols-[1fr_420px] lg:p-8">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#3457ff]">Business command center</p>
                        <h2 className="mt-2 max-w-3xl text-3xl font-bold text-slate-800">Monitor users, revenue, uploads, and support from one private owner dashboard.</h2>
                        <p className="mt-3 max-w-2xl text-slate-500">The data here comes from real signups, sessions, subscriptions, payments, chart analyses, chat messages, profiles, countries, and support tickets.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Health label="Online" value={String(metrics.summary.onlineUsers)} icon={<FiWifi />} tone="green" />
                        <Health label="Sessions" value={String(metrics.summary.activeSessions)} icon={<FiActivity />} tone="blue" />
                        <Health label="Open tickets" value={String(metrics.summary.openTickets)} icon={<FiHeadphones />} tone="amber" />
                        <Health label="Uploads today" value={String(metrics.summary.uploadsToday)} icon={<FiUpload />} tone="purple" />
                    </div>
                </div>
            </section>

            <StatGrid>
                <OwnerStat label="Total users" value={String(metrics.summary.totalUsers)} detail={`${metrics.summary.paidUsers} paid · ${metrics.summary.trialUsers} trial`} icon={<FiUsers />} tone="blue" />
                <OwnerStat label="Online now" value={String(metrics.summary.onlineUsers)} detail="Active within 15 minutes" icon={<FiWifi />} tone="green" />
                <OwnerStat label="Monthly revenue" value={formatMoney(metrics.summary.monthRevenue)} detail={`${formatMoney(metrics.summary.mrr)} estimated MRR`} icon={<FiDollarSign />} tone="amber" />
                <OwnerStat label="Total uploads" value={String(metrics.summary.totalUploads)} detail={`${metrics.summary.aiMessages} AI responses`} icon={<FiUpload />} tone="purple" />
            </StatGrid>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <OwnerPanel>
                    <div className="h-[240px] rounded-xl bg-gradient-to-tr from-[#3457ff] to-[#6b8cff] p-5 shadow-lg shadow-[#3457ff]/20">
                        <div className="flex h-full items-end gap-3 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:100%_40px]">
                            {metrics.signupTrend.map((item) => (
                                <div key={item.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                                    <span className="text-xs font-bold text-white">{item.count}</span>
                                    <div className="w-full max-w-[42px] rounded-t-md bg-white/90" style={{ height: `${Math.max(4, (item.count / maxSignup) * 80)}%` }} />
                                    <span className="text-[11px] text-white/80">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Signup Trend</h3>
                            <OwnerMuted className="mt-0.5 text-sm">New accounts created during the last 7 days</OwnerMuted>
                        </div>
                        <Link href="/owner/users" className="inline-flex items-center gap-1 text-sm font-medium text-[#3457ff] hover:underline">View users <FiArrowRight /></Link>
                    </div>
                </OwnerPanel>

                <OwnerPanel>
                    <h3 className="text-lg font-bold text-slate-800">Plan Mix</h3>
                    <OwnerMuted className="mt-0.5 text-sm">Current user plan distribution</OwnerMuted>
                    <div className="mt-6 space-y-5">
                        {metrics.planBreakdown.map((item) => (
                            <Breakdown key={item.label} label={item.label} value={item.count} total={metrics.summary.totalUsers} />
                        ))}
                    </div>
                </OwnerPanel>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                <OwnerPanel className="px-0 pb-2">
                    <div className="flex items-center justify-between gap-4 px-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Recent Users</h3>
                            <OwnerMuted className="mt-0.5 text-sm">Latest signups with country, plan, and online status</OwnerMuted>
                        </div>
                        <Link href="/owner/users" className="inline-flex items-center gap-1 text-sm font-medium text-[#3457ff] hover:underline">All users <FiArrowRight /></Link>
                    </div>
                    <div className="mt-5 overflow-x-auto">
                        <table className={`${tableClass} min-w-[640px]`}>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Country</th>
                                    <th>Plan</th>
                                    <th>Uploads</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metrics.recentUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <p className="font-medium text-slate-800">{user.name}</p>
                                            <OwnerMuted className="text-xs">{user.email}</OwnerMuted>
                                        </td>
                                        <td>{user.country}</td>
                                        <td><OwnerBadge tone={user.planName === "Trial" ? "gray" : "blue"}>{user.planName}</OwnerBadge></td>
                                        <td>{user.uploads}</td>
                                        <td><OwnerBadge tone={user.online ? "green" : "gray"}>{user.online ? "Online" : "Offline"}</OwnerBadge></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </OwnerPanel>

                <OwnerPanel>
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Recent Payments</h3>
                            <OwnerMuted className="mt-0.5 text-sm">Latest plan purchases and subscription records</OwnerMuted>
                        </div>
                    </div>
                    <div className="mt-5">
                        {metrics.recentPayments.length === 0 ? (
                            <OwnerMuted className="py-8 text-center">No payments yet.</OwnerMuted>
                        ) : (
                            <ol className="relative space-y-5 before:absolute before:bottom-2 before:left-[19px] before:top-2 before:w-px before:bg-slate-200">
                                {metrics.recentPayments.map((payment) => (
                                    <li key={payment.id} className="relative flex items-start gap-4">
                                        <IconTile tone="green" className="h-10 w-10 text-base"><FiCreditCard /></IconTile>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <p className="font-medium text-slate-800">{payment.userName}</p>
                                                <strong className="text-sm text-emerald-600">{formatMoney(payment.amount)}</strong>
                                            </div>
                                            <OwnerMuted className="text-xs">{payment.plan} · {formatDate(payment.date)}</OwnerMuted>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </div>
                </OwnerPanel>
            </div>

            <OwnerPanel>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Upload Trend</h3>
                        <OwnerMuted className="mt-0.5 text-sm">Chart analyses created during the last 7 days</OwnerMuted>
                    </div>
                    <Link href="/owner/activity" className="inline-flex items-center gap-1 text-sm font-medium text-[#3457ff] hover:underline">View activity <FiArrowRight /></Link>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                    {metrics.uploadTrend.map((item) => (
                        <div key={item.label} className="rounded-xl border border-slate-200/80 p-4">
                            <OwnerMuted className="text-xs">{item.label}</OwnerMuted>
                            <strong className="mt-1 block text-2xl font-bold text-slate-800">{item.count}</strong>
                            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400" style={{ width: `${Math.max(4, (item.count / maxUpload) * 100)}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </OwnerPanel>
        </div>
    );
};

const Health = ({ label, value, icon, tone }: { label: string; value: string; icon: React.ReactNode; tone: Tone }) => (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <IconTile tone={tone} className="h-10 w-10 text-base">{icon}</IconTile>
        <div className="min-w-0">
            <p className="truncate text-xs text-slate-500">{label}</p>
            <strong className="block text-xl font-bold text-slate-800">{value}</strong>
        </div>
    </div>
);

const Breakdown = ({ label, value, total }: { label: string; value: number; total: number }) => (
    <div>
        <div className="flex justify-between gap-4 text-sm">
            <span className="font-medium text-slate-700">{label}</span>
            <span className="font-bold text-slate-800">{value}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-gradient-to-r from-[#3457ff] to-[#6b8cff]" style={{ width: `${total ? (value / total) * 100 : 0}%` }} />
        </div>
    </div>
);

export default OwnerHomePage;
