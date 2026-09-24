import { FiActivity, FiBarChart2, FiMessageSquare, FiTarget, FiTrendingUp, FiUpload } from "react-icons/fi";
import { IconTile, PanelHeader, StatGrid, tableClass, type Tone } from "@/components/dashboard/DashboardUi";
import { OwnerBadge, OwnerMuted, OwnerPanel, OwnerStat, formatDate } from "@/components/owner/OwnerUi";
import { getOwnerMetrics } from "@/lib/server/owner-metrics";

const OwnerActivityPage = async () => {
    const metrics = await getOwnerMetrics();
    const buys = metrics.analysisRows.filter((item) => item.entryType === "Buy").length;
    const sells = metrics.analysisRows.filter((item) => item.entryType === "Sell").length;
    const watches = metrics.analysisRows.filter((item) => item.entryType === "Watch").length;

    return (
        <div className="space-y-8">
            <StatGrid>
                <OwnerStat label="Total uploads" value={String(metrics.summary.totalUploads)} detail={`${metrics.summary.uploadsToday} uploaded today`} icon={<FiUpload />} tone="blue" />
                <OwnerStat label="AI responses" value={String(metrics.summary.aiMessages)} detail="Assistant chat messages" icon={<FiMessageSquare />} tone="purple" />
                <OwnerStat label="Buy signals" value={String(buys)} detail={`${sells} sell · ${watches} watch`} icon={<FiTrendingUp />} tone="green" />
                <OwnerStat label="Avg confidence" value={`${average(metrics.analysisRows.map((item) => item.confidence))}%`} detail="Across saved analyses" icon={<FiTarget />} tone="amber" />
            </StatGrid>

            <OwnerPanel className="px-0 pb-2">
                <PanelHeader className="px-6" icon={<FiActivity />} title="Recent Chart Analyses" description="Every uploaded chart analysis tied to the user who created it." />
                <div className="mt-6 overflow-x-auto">
                    <table className={`${tableClass} min-w-[980px]`}>
                        <thead>
                            <tr>
                                <th>User</th>
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
                                <tr key={analysis.id}>
                                    <td>
                                        <p className="font-medium text-slate-800">{analysis.userName}</p>
                                        <OwnerMuted className="text-xs">{analysis.userEmail}</OwnerMuted>
                                    </td>
                                    <td className="font-bold text-slate-800">{analysis.symbol}</td>
                                    <td><OwnerBadge tone="gray">{analysis.timeframe}</OwnerBadge></td>
                                    <td><OwnerBadge tone={analysis.entryType === "Buy" ? "green" : analysis.entryType === "Sell" ? "red" : "amber"}>{analysis.entryType}</OwnerBadge></td>
                                    <td>{analysis.confidence}%</td>
                                    <td>{analysis.outcome}</td>
                                    <td className="whitespace-nowrap text-slate-500">{formatDate(analysis.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {metrics.analysisRows.length === 0 && <OwnerMuted className="py-10 text-center">No uploads yet.</OwnerMuted>}
                </div>
            </OwnerPanel>

            <div className="grid gap-6 xl:grid-cols-3">
                <ActivityCard icon={<FiUpload />} tone="blue" label="Upload funnel" value={`${metrics.summary.totalUploads} charts`} detail="Useful to compare against paid conversions and credit limits." />
                <ActivityCard icon={<FiBarChart2 />} tone="green" label="AI output quality" value={`${average(metrics.analysisRows.map((item) => item.confidence))}% avg`} detail="Average confidence score from generated analysis records." />
                <ActivityCard icon={<FiMessageSquare />} tone="purple" label="Chat demand" value={`${metrics.summary.aiMessages} replies`} detail="Follow-up usage after users receive chart analysis." />
            </div>
        </div>
    );
};

const ActivityCard = ({ icon, tone, label, value, detail }: { icon: React.ReactNode; tone: Tone; label: string; value: string; detail: string }) => (
    <OwnerPanel>
        <div className="flex items-center gap-4">
            <IconTile tone={tone}>{icon}</IconTile>
            <div>
                <OwnerMuted className="text-xs font-bold uppercase tracking-wider">{label}</OwnerMuted>
                <strong className="block text-2xl font-bold text-slate-800">{value}</strong>
            </div>
        </div>
        <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-500">{detail}</p>
    </OwnerPanel>
);

function average(values: number[]) {
    if (!values.length) return 0;
    return Math.round(values.reduce((sum, item) => sum + item, 0) / values.length);
}

export default OwnerActivityPage;
