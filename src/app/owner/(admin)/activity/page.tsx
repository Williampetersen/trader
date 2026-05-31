import { FiActivity, FiBarChart2, FiMessageSquare, FiUpload } from "react-icons/fi";
import { OwnerBadge, OwnerMuted, OwnerPanel, OwnerStat, formatDate } from "@/components/owner/OwnerUi";
import { getOwnerMetrics } from "@/lib/server/owner-metrics";

const OwnerActivityPage = async () => {
    const metrics = await getOwnerMetrics();
    const buys = metrics.analysisRows.filter((item) => item.entryType === "Buy").length;
    const sells = metrics.analysisRows.filter((item) => item.entryType === "Sell").length;
    const watches = metrics.analysisRows.filter((item) => item.entryType === "Watch").length;

    return (
        <div className="space-y-7">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <OwnerStat label="Total uploads" value={String(metrics.summary.totalUploads)} detail={`${metrics.summary.uploadsToday} uploaded today`} tone="blue" />
                <OwnerStat label="AI responses" value={String(metrics.summary.aiMessages)} detail="Assistant chat messages" tone="purple" />
                <OwnerStat label="Buy signals" value={String(buys)} detail={`${sells} sell · ${watches} watch`} tone="green" />
                <OwnerStat label="Avg confidence" value={`${average(metrics.analysisRows.map((item) => item.confidence))}%`} detail="Across saved analyses" tone="amber" />
            </div>

            <OwnerPanel>
                <h2 className="flex items-center gap-3 text-2xl font-extrabold"><FiActivity /> Recent Chart Analyses</h2>
                <OwnerMuted className="mt-1">Every uploaded chart analysis tied to the user who created it.</OwnerMuted>
                <div className="mt-7 overflow-x-auto">
                    <table className="w-full min-w-[1080px] text-left text-sm">
                        <thead className="text-[#94a3b8]">
                            <tr className="border-b border-white/10">
                                <th className="py-4">User</th>
                                <th>Symbol</th>
                                <th>Timeframe</th>
                                <th>Entry</th>
                                <th>Confidence</th>
                                <th>Outcome</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metrics.analysisRows.map((analysis) => (
                                <tr key={analysis.id} className="border-b border-white/10">
                                    <td className="py-4">
                                        <strong>{analysis.userName}</strong>
                                        <OwnerMuted className="text-xs">{analysis.userEmail}</OwnerMuted>
                                    </td>
                                    <td>{analysis.symbol}</td>
                                    <td><OwnerBadge tone="gray">{analysis.timeframe}</OwnerBadge></td>
                                    <td><OwnerBadge tone={analysis.entryType === "Buy" ? "green" : analysis.entryType === "Sell" ? "red" : "amber"}>{analysis.entryType}</OwnerBadge></td>
                                    <td>{analysis.confidence}%</td>
                                    <td>{analysis.outcome}</td>
                                    <td>{formatDate(analysis.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {metrics.analysisRows.length === 0 && <OwnerMuted className="py-10 text-center">No uploads yet.</OwnerMuted>}
                </div>
            </OwnerPanel>

            <div className="grid gap-7 xl:grid-cols-3">
                <ActivityCard icon={<FiUpload />} label="Upload funnel" value={`${metrics.summary.totalUploads} charts`} detail="Useful to compare against paid conversions and credit limits." />
                <ActivityCard icon={<FiBarChart2 />} label="AI output quality" value={`${average(metrics.analysisRows.map((item) => item.confidence))}% avg`} detail="Average confidence score from generated analysis records." />
                <ActivityCard icon={<FiMessageSquare />} label="Chat demand" value={`${metrics.summary.aiMessages} replies`} detail="Follow-up usage after users receive chart analysis." />
            </div>
        </div>
    );
};

const ActivityCard = ({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) => (
    <OwnerPanel>
        <div className="text-[#f4c430]">{icon}</div>
        <OwnerMuted className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em]">{label}</OwnerMuted>
        <strong className="mt-3 block text-3xl">{value}</strong>
        <p className="mt-3 text-sm font-semibold text-[#cbd5e1]">{detail}</p>
    </OwnerPanel>
);

function average(values: number[]) {
    if (!values.length) return 0;
    return Math.round(values.reduce((sum, item) => sum + item, 0) / values.length);
}

export default OwnerActivityPage;
