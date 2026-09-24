import Link from "next/link";
import { FiAward, FiBarChart2, FiEye, FiTarget, FiTrendingDown, FiUpload } from "react-icons/fi";
import { requireUser } from "@/lib/server/auth";
import { readDb } from "@/lib/server/store";
import { Badge, Disclaimer, Panel, PanelHeader, StatCard, StatGrid, primaryButtonClass, tableClass } from "@/components/dashboard/DashboardUi";

const HistoryPage = async ({ searchParams }: { searchParams: { q?: string } }) => {
    const user = await requireUser();
    const db = await readDb();
    const query = String(searchParams.q || "").toLowerCase();
    const allAnalyses = db.analyses.filter((item) => item.userId === user.id);
    const analyses = allAnalyses
        .filter((item) => !query || `${item.symbol} ${item.timeframe} ${item.summary} ${item.entryType} ${item.outcome}`.toLowerCase().includes(query))
        .reverse();
    const completed = analyses.filter((item) => item.outcome === "Won" || item.outcome === "Lost");
    const wins = completed.filter((item) => item.outcome === "Won").length;
    const winRate = completed.length ? Math.round((wins / completed.length) * 100) : 0;
    const avgRisk = analyses.length ? (analyses.reduce((sum, item) => sum + item.riskReward, 0) / analyses.length).toFixed(2) : "0.00";
    const sells = analyses.filter((item) => item.entryType === "Sell").length;
    const buys = analyses.filter((item) => item.entryType === "Buy").length;

    return (
        <div className="space-y-8">
            <StatGrid>
                <StatCard label="Total Analyses" value={String(analyses.length)} description="Chart analyses completed" icon={<FiBarChart2 />} />
                <StatCard label="Win Rate" value={`${winRate}%`} description={`${wins} won, ${Math.max(0, completed.length - wins)} lost`} icon={<FiAward />} tone={winRate > 50 ? "green" : "red"} />
                <StatCard label="Avg Risk / Reward" value={avgRisk} description="Average planned ratio" icon={<FiTarget />} tone="purple" />
                <StatCard label="Entry Types" value={`${buys} / ${sells}`} description="Buy / Sell signals" icon={<FiTrendingDown />} tone="yellow" />
            </StatGrid>

            <Panel className="px-0 pb-2">
                <PanelHeader
                    className="px-6"
                    title="Analysis History"
                    description={`${analyses.length} matching analyses${query ? ` for "${searchParams.q}"` : ""}`}
                    action={<Link href="/dashboard/upload" className={primaryButtonClass}><FiUpload /> Upload New Chart</Link>}
                />
                <div className="mt-6 overflow-x-auto">
                    <table className={`${tableClass} min-w-[980px]`}>
                        <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Time Frame</th>
                                <th>Summary</th>
                                <th>Entry Type</th>
                                <th>Confidence</th>
                                <th>Outcome</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analyses.map((row) => (
                                <tr key={row.id}>
                                    <td className="font-bold text-slate-800">{row.symbol}</td>
                                    <td><Badge tone="gray">{row.timeframe}</Badge></td>
                                    <td className="max-w-[320px] text-slate-500">{row.summary}</td>
                                    <td><Badge tone={row.entryType === "Buy" ? "green" : row.entryType === "Sell" ? "red" : "amber"}>{row.entryType}</Badge></td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                                                <div className="h-full rounded-full bg-gradient-to-r from-[#3457ff] to-[#6b8cff]" style={{ width: `${row.confidence}%` }} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-600">{row.confidence}%</span>
                                        </div>
                                    </td>
                                    <td className="text-slate-600">{row.outcome}</td>
                                    <td className="whitespace-nowrap text-slate-500">{new Date(row.createdAt).toLocaleString()}</td>
                                    <td>
                                        <Link href={`/dashboard/results?id=${row.id}`} aria-label={`View ${row.symbol} analysis`} className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#3457ff]">
                                            <FiEye />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {analyses.length === 0 && <p className="py-10 text-center text-slate-500">No analyses yet. Upload your first chart to start.</p>}
                </div>
            </Panel>

            <Disclaimer />
        </div>
    );
};

export default HistoryPage;
