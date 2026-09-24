import clsx from "clsx";
import { FiSearch, FiUserCheck, FiUsers, FiUserX, FiWifi } from "react-icons/fi";
import { Avatar, PanelHeader, StatGrid, inputClass, primaryButtonClass, tableClass } from "@/components/dashboard/DashboardUi";
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
        <div className="space-y-8">
            <StatGrid>
                <OwnerStat label="All users" value={String(metrics.summary.totalUsers)} detail={`${users.length} shown`} icon={<FiUsers />} tone="blue" />
                <OwnerStat label="Online users" value={String(metrics.summary.onlineUsers)} detail="Active within 15 minutes" icon={<FiWifi />} tone="green" />
                <OwnerStat label="Paid users" value={String(metrics.summary.paidUsers)} detail={`${metrics.summary.trialUsers} trial users`} icon={<FiUserCheck />} tone="amber" />
                <OwnerStat label="Expired users" value={String(metrics.summary.expiredUsers)} detail="Access ended or payment missing" icon={<FiUserX />} tone="red" />
            </StatGrid>

            <OwnerPanel className="px-0 pb-2">
                <PanelHeader
                    className="px-6 sm:!flex-col lg:!flex-row lg:!items-center"
                    icon={<FiUsers />}
                    title="Users"
                    description="Names, emails, countries, plans, credits, payments, uploads, and online status."
                    action={
                        <form className="flex min-w-0 flex-col gap-3 sm:flex-row">
                            <div className="relative sm:w-64">
                                <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input name="q" defaultValue={searchParams.q || ""} placeholder="Search users..." className={clsx(inputClass, "pl-10")} />
                            </div>
                            <select name="plan" defaultValue={plan} className={clsx(inputClass, "sm:w-40")}>
                                <option value="">All plans</option>
                                {metrics.planBreakdown.map((item) => <option key={item.label}>{item.label}</option>)}
                            </select>
                            <button className={primaryButtonClass}>Filter</button>
                        </form>
                    }
                />

                <div className="mt-6 overflow-x-auto">
                    <table className={`${tableClass} min-w-[1280px]`}>
                        <thead>
                            <tr>
                                <th>User</th>
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
                                <tr key={user.id} className="align-top">
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <span className="relative">
                                                <Avatar name={user.name} />
                                                <span className={clsx("absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white", user.online ? "bg-emerald-500" : "bg-slate-300")} />
                                            </span>
                                            <div>
                                                <p className="font-medium text-slate-800">{user.name}</p>
                                                <OwnerMuted className="text-xs">{user.email}</OwnerMuted>
                                            </div>
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
                                        <p className="font-bold text-slate-800">{user.uploads}</p>
                                        <OwnerMuted className="text-xs">Avg score {user.aiScoreAvg}%</OwnerMuted>
                                    </td>
                                    <td>
                                        <p className="font-bold text-slate-800">{formatMoney(user.revenue)}</p>
                                        <OwnerMuted className="text-xs">{user.payments} payments</OwnerMuted>
                                    </td>
                                    <td><OwnerBadge tone={user.openTickets ? "amber" : "gray"}>{user.openTickets} open</OwnerBadge></td>
                                    <td className="whitespace-nowrap text-slate-500">{formatDate(user.lastSeenAt)}</td>
                                    <td className="whitespace-nowrap text-slate-500">{formatDate(user.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && <OwnerMuted className="py-10 text-center">No users match this filter.</OwnerMuted>}
                </div>
            </OwnerPanel>

            <OwnerPanel>
                <PanelHeader title="Country Breakdown" description="Where users say they are located in profile settings" />
                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {metrics.countryBreakdown.slice(0, 12).map((item) => (
                        <div key={item.label} className="flex items-center justify-between rounded-xl border border-slate-200/80 p-4">
                            <span className="font-medium text-slate-700">{item.label}</span>
                            <OwnerBadge tone="blue">{item.count} users</OwnerBadge>
                        </div>
                    ))}
                </div>
            </OwnerPanel>
        </div>
    );
};

export default OwnerUsersPage;
