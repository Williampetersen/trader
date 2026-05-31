import Link from "next/link";
import { FiActivity, FiCreditCard, FiHeadphones, FiUpload, FiUsers, FiWifi } from "react-icons/fi";
import { OwnerBadge, OwnerMuted, OwnerPanel, OwnerStat, formatDate, formatMoney } from "@/components/owner/OwnerUi";
import { getOwnerMetrics } from "@/lib/server/owner-metrics";

const OwnerHomePage = async () => {
    const metrics = await getOwnerMetrics();
    const maxSignup = Math.max(1, ...metrics.signupTrend.map((item) => item.count));
    const maxUpload = Math.max(1, ...metrics.uploadTrend.map((item) => item.count));

    return (
        <div className="space-y-7">
            <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#111318] shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
                <div className="grid gap-7 bg-[linear-gradient(135deg,rgba(52,87,255,0.24),transparent_45%),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:auto,46px_46px,46px_46px] p-7 lg:grid-cols-[1fr_390px]">
                    <div>
                        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#f4c430]">Business command center</p>
                        <h2 className="mt-3 max-w-4xl text-4xl font-extrabold text-white lg:text-5xl">Monitor users, revenue, uploads, and support from one private owner dashboard.</h2>
                        <p className="mt-4 max-w-2xl text-[#cbd5e1]">The data here comes from real signups, sessions, subscriptions, payments, chart analyses, chat messages, profiles, countries, and support tickets.</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                        <p className="text-sm font-bold text-[#94a3b8]">Live platform health</p>
                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <Health label="Online" value={String(metrics.summary.onlineUsers)} icon={<FiWifi />} />
                            <Health label="Sessions" value={String(metrics.summary.activeSessions)} icon={<FiActivity />} />
                            <Health label="Open tickets" value={String(metrics.summary.openTickets)} icon={<FiHeadphones />} />
                            <Health label="Uploads today" value={String(metrics.summary.uploadsToday)} icon={<FiUpload />} />
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <OwnerStat label="Total users" value={String(metrics.summary.totalUsers)} detail={`${metrics.summary.paidUsers} paid · ${metrics.summary.trialUsers} trial`} tone="blue" />
                <OwnerStat label="Online now" value={String(metrics.summary.onlineUsers)} detail="Active within 15 minutes" tone="green" />
                <OwnerStat label="Monthly revenue" value={formatMoney(metrics.summary.monthRevenue)} detail={`${formatMoney(metrics.summary.mrr)} estimated MRR`} tone="amber" />
                <OwnerStat label="Total uploads" value={String(metrics.summary.totalUploads)} detail={`${metrics.summary.aiMessages} AI responses`} tone="purple" />
            </div>

            <div className="grid gap-7 xl:grid-cols-[1fr_0.85fr]">
                <OwnerPanel>
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-extrabold">Signup Trend</h3>
                            <OwnerMuted className="mt-1 text-sm">New accounts created during the last 7 days</OwnerMuted>
                        </div>
                        <Link href="/owner/users" className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-extrabold text-[#cbd5e1] transition-colors hover:bg-white/[0.08]">View users</Link>
                    </div>
                    <div className="mt-8 flex h-[230px] items-end gap-4">
                        {metrics.signupTrend.map((item) => (
                            <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
                                <div className="flex h-[180px] w-full items-end rounded-2xl bg-white/[0.04] p-2">
                                    <div className="w-full rounded-xl bg-[#3457ff]" style={{ height: `${Math.max(8, (item.count / maxSignup) * 100)}%` }} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-extrabold">{item.count}</p>
                                    <OwnerMuted className="text-xs">{item.label}</OwnerMuted>
                                </div>
                            </div>
                        ))}
                    </div>
                </OwnerPanel>

                <OwnerPanel>
                    <h3 className="text-xl font-extrabold">Plan Mix</h3>
                    <OwnerMuted className="mt-1 text-sm">Current user plan distribution</OwnerMuted>
                    <div className="mt-7 space-y-4">
                        {metrics.planBreakdown.map((item) => (
                            <Breakdown key={item.label} label={item.label} value={item.count} total={metrics.summary.totalUsers} />
                        ))}
                    </div>
                </OwnerPanel>
            </div>

            <div className="grid gap-7 xl:grid-cols-2">
                <OwnerPanel>
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-extrabold">Recent Users</h3>
                            <OwnerMuted className="mt-1 text-sm">Latest signups with country, plan, and online status</OwnerMuted>
                        </div>
                        <FiUsers className="text-[#f4c430]" size={24} />
                    </div>
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead className="text-[#94a3b8]">
                                <tr className="border-b border-white/10">
                                    <th className="py-3">User</th>
                                    <th>Country</th>
                                    <th>Plan</th>
                                    <th>Uploads</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metrics.recentUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-white/10">
                                        <td className="py-4">
                                            <strong>{user.name}</strong>
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
                            <h3 className="text-xl font-extrabold">Recent Payments</h3>
                            <OwnerMuted className="mt-1 text-sm">Latest plan purchases and subscription records</OwnerMuted>
                        </div>
                        <FiCreditCard className="text-[#f4c430]" size={24} />
                    </div>
                    <div className="mt-6 space-y-3">
                        {metrics.recentPayments.length === 0 ? (
                            <OwnerMuted>No payments yet.</OwnerMuted>
                        ) : metrics.recentPayments.map((payment) => (
                            <div key={payment.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <strong>{payment.userName}</strong>
                                        <OwnerMuted className="text-sm">{payment.plan} · {formatDate(payment.date)}</OwnerMuted>
                                    </div>
                                    <OwnerBadge tone="green">{formatMoney(payment.amount)}</OwnerBadge>
                                </div>
                            </div>
                        ))}
                    </div>
                </OwnerPanel>
            </div>

            <OwnerPanel>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-extrabold">Upload Trend</h3>
                        <OwnerMuted className="mt-1 text-sm">Chart analyses created during the last 7 days</OwnerMuted>
                    </div>
                    <Link href="/owner/activity" className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-extrabold text-[#cbd5e1] transition-colors hover:bg-white/[0.08]">View activity</Link>
                </div>
                <div className="mt-7 grid gap-3 sm:grid-cols-7">
                    {metrics.uploadTrend.map((item) => (
                        <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                <div className="h-full rounded-full bg-[#f4c430]" style={{ width: `${Math.max(8, (item.count / maxUpload) * 100)}%` }} />
                            </div>
                            <strong className="mt-4 block text-2xl">{item.count}</strong>
                            <OwnerMuted className="text-xs">{item.label}</OwnerMuted>
                        </div>
                    ))}
                </div>
            </OwnerPanel>
        </div>
    );
};

const Health = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
    <div className="rounded-2xl border border-white/10 bg-[#070b12]/60 p-4">
        <div className="flex items-center gap-2 text-[#f4c430]">{icon}<span className="text-xs font-extrabold uppercase tracking-[0.12em]">{label}</span></div>
        <strong className="mt-3 block text-3xl">{value}</strong>
    </div>
);

const Breakdown = ({ label, value, total }: { label: string; value: number; total: number }) => (
    <div>
        <div className="flex justify-between gap-4 text-sm font-extrabold">
            <span>{label}</span>
            <span>{value}</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-white/10">
            <div className="h-2 rounded-full bg-[#f4c430]" style={{ width: `${total ? (value / total) * 100 : 0}%` }} />
        </div>
    </div>
);

export default OwnerHomePage;
