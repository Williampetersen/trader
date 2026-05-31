import Link from "next/link";
import { FiAward, FiBarChart2, FiEye, FiTarget, FiTrendingDown, FiUpload } from "react-icons/fi";
import { requireUser } from "@/lib/server/auth";
import { readDb } from "@/lib/server/store";
import { Disclaimer, MutedText, Panel, PrimaryButton, StatCard } from "@/components/dashboard/DashboardUi";

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
        <div className="mx-auto max-w-[1505px] space-y-7">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h2 className="text-3xl font-extrabold">Chart Analysis History</h2>
                    <MutedText className="mt-2">{analyses.length} matching analyses{query ? ` for "${searchParams.q}"` : ""}</MutedText>
                </div>
                <Link href="/dashboard/upload"><PrimaryButton><FiUpload className="mr-2 inline" /> Upload New Chart</PrimaryButton></Link>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total Analyses" value={String(analyses.length)} description="Chart analyses completed" icon={<FiBarChart2 />} />
                <StatCard label="Win Rate" value={`${winRate}%`} description={`${wins} won, ${Math.max(0, completed.length - wins)} lost`} icon={<FiAward />} tone={winRate > 50 ? "green" : "red"} />
                <StatCard label="Avg Risk / Reward" value={avgRisk} description="Average planned ratio" icon={<FiTarget />} tone="green" />
                <StatCard label="Entry Types" value={`Buy: ${buys} Sell: ${sells}`} icon={<FiTrendingDown />} tone="blue" />
            </div>

            <Panel>
                <h3 className="text-xl font-extrabold">Analysis History</h3>
                <div className="mt-7 overflow-x-auto">
                    <table className="w-full min-w-[980px] text-left text-sm">
                        <thead className="text-[#cbd5e1]">
                            <tr className="border-b border-white/10">
                                <th className="py-4">Symbol</th>
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
                                <tr key={row.id} className="border-b border-white/10">
                                    <td className="py-4 font-bold">{row.symbol}</td>
                                    <td><span className="rounded-lg border border-white/10 bg-white/[0.05] px-2 py-1">{row.timeframe}</span></td>
                                    <td>{row.summary}</td>
                                    <td><span className="rounded-full bg-[#3457ff]/20 px-3 py-1 font-bold text-[#bfdbfe]">{row.entryType}</span></td>
                                    <td><span className="rounded-lg border border-white/10 px-3 py-1">{row.confidence}%</span></td>
                                    <td>{row.outcome}</td>
                                    <td>{new Date(row.createdAt).toLocaleString()}</td>
                                    <td><Link href={`/dashboard/results?id=${row.id}`} className="text-[#93c5fd]"><FiEye /></Link></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {analyses.length === 0 && <MutedText className="py-10 text-center">No analyses yet. Upload your first chart to start.</MutedText>}
                </div>
            </Panel>

            <Disclaimer />
        </div>
    );
};

export default HistoryPage;
