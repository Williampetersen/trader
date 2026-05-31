import { FiSearch, FiUsers } from "react-icons/fi";
import { OwnerBadge, OwnerMuted, OwnerPanel, OwnerStat, formatDate, formatMoney } from "@/components/owner/OwnerUi";
import { getOwnerMetrics } from "@/lib/server/owner-metrics";

const OwnerUsersPage = async ({ searchParams }: { searchParams: { q?: string; plan?: string } }) => {
    const metrics = await getOwnerMetrics();
    const query = String(searchParams.q || "").toLowerCase();
    const plan = String(searchParams.plan || "");
    const users = metrics.userRows.filter((user) => {
        const matchesQuery = !query || `${user.name} ${user.email} ${user.country} ${user.planName} ${user.mobile}`.toLowerCase().includes(query);
        const matchesPlan = !plan || user.planName === plan;
        return matchesQuery && matchesPlan;
    });

    return (
        <div className="space-y-7">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <OwnerStat label="All users" value={String(metrics.summary.totalUsers)} detail={`${users.length} shown`} tone="blue" />
                <OwnerStat label="Online users" value={String(metrics.summary.onlineUsers)} detail="Active within 15 minutes" tone="green" />
                <OwnerStat label="Paid users" value={String(metrics.summary.paidUsers)} detail={`${metrics.summary.trialUsers} trial users`} tone="amber" />
                <OwnerStat label="Expired users" value={String(metrics.summary.expiredUsers)} detail="Access ended or payment missing" tone="red" />
            </div>

            <OwnerPanel>
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div>
                        <h2 className="flex items-center gap-3 text-2xl font-extrabold"><FiUsers /> Users</h2>
                        <OwnerMuted className="mt-1">Names, emails, countries, plans, credits, payments, uploads, and online status.</OwnerMuted>
                    </div>
                    <form className="flex min-w-0 flex-col gap-3 sm:flex-row">
                        <div className="flex min-w-[280px] items-center rounded-2xl border border-white/10 bg-white/[0.04] px-4">
                            <FiSearch className="text-[#94a3b8]" />
                            <input name="q" defaultValue={searchParams.q || ""} placeholder="Search users..." className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-[#64748b]" />
                        </div>
                        <select name="plan" defaultValue={plan} className="rounded-2xl border border-white/10 bg-[#0b1018] px-4 py-3 text-sm font-bold outline-none">
                            <option value="">All plans</option>
                            {metrics.planBreakdown.map((item) => <option key={item.label}>{item.label}</option>)}
                        </select>
                        <button className="rounded-2xl bg-[#3457ff] px-5 py-3 text-sm font-extrabold text-white">Filter</button>
                    </form>
                </div>

                <div className="mt-7 overflow-x-auto">
                    <table className="w-full min-w-[1320px] text-left text-sm">
                        <thead className="text-[#94a3b8]">
                            <tr className="border-b border-white/10">
                                <th className="py-4">User</th>
                                <th>Country</th>
                                <th>Profile</th>
                                <th>Plan</th>
                                <th>Credits</th>
                                <th>Uploads</th>
                                <th>Revenue</th>
                                <th>Support</th>
                                <th>Last seen</th>
                                <th>Signup</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-white/10 align-top">
                                    <td className="py-4">
                                        <div className="flex items-start gap-3">
                                            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#22c55e]" hidden={!user.online} />
                                            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#64748b]" hidden={user.online} />
                                            <span>
                                                <strong>{user.name}</strong>
                                                <OwnerMuted className="text-xs">{user.email}</OwnerMuted>
                                            </span>
                                        </div>
                                    </td>
                                    <td>{user.country}</td>
                                    <td>
                                        <OwnerMuted className="text-xs">{user.mobile || "No mobile"}</OwnerMuted>
                                        <OwnerMuted className="text-xs">{[user.gender, user.ageGroup].filter(Boolean).join(" · ") || "Incomplete"}</OwnerMuted>
                                    </td>
                                    <td>
                                        <OwnerBadge tone={user.planName === "Trial" ? "gray" : user.expired ? "red" : "blue"}>{user.planName}</OwnerBadge>
                                        <OwnerMuted className="mt-1 text-xs">{user.autoRenewal ? "Auto-renewing" : "Prepaid/trial"}</OwnerMuted>
                                    </td>
                                    <td>{user.creditsLeft} / {user.dailyLimit}</td>
                                    <td>
                                        <strong>{user.uploads}</strong>
                                        <OwnerMuted className="text-xs">Avg score {user.aiScoreAvg}%</OwnerMuted>
                                    </td>
                                    <td>
                                        <strong>{formatMoney(user.revenue)}</strong>
                                        <OwnerMuted className="text-xs">{user.payments} payments</OwnerMuted>
                                    </td>
                                    <td><OwnerBadge tone={user.openTickets ? "amber" : "gray"}>{user.openTickets} open</OwnerBadge></td>
                                    <td>{formatDate(user.lastSeenAt)}</td>
                                    <td>{formatDate(user.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && <OwnerMuted className="py-10 text-center">No users match this filter.</OwnerMuted>}
                </div>
            </OwnerPanel>

            <OwnerPanel>
                <h3 className="text-xl font-extrabold">Country Breakdown</h3>
                <OwnerMuted className="mt-1 text-sm">Where users say they are located in profile settings</OwnerMuted>
                <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {metrics.countryBreakdown.slice(0, 12).map((item) => (
                        <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                            <strong>{item.label}</strong>
                            <OwnerMuted className="mt-2 text-sm">{item.count} users</OwnerMuted>
                        </div>
                    ))}
                </div>
            </OwnerPanel>
        </div>
    );
};

export default OwnerUsersPage;
