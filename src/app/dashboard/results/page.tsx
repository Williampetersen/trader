import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { FiClock, FiDollarSign, FiEye, FiShield, FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import { requireUser } from "@/lib/server/auth";
import { readDb } from "@/lib/server/store";
import OutcomeButtons from "@/components/dashboard/OutcomeButtons";
import { Badge, IconTile, MutedText, Panel, outlineButtonClass, primaryButtonClass, type Tone } from "@/components/dashboard/DashboardUi";

const ResultsPage = async ({ searchParams }: { searchParams: { id?: string } }) => {
    const user = await requireUser();
    const db = await readDb();
    const userAnalyses = db.analyses.filter((item) => item.userId === user.id);
    const analysis = searchParams.id
        ? userAnalyses.find((item) => item.id === searchParams.id)
        : userAnalyses[userAnalyses.length - 1];

    if (!analysis) {
        return (
            <Panel className="mx-auto max-w-3xl py-12 text-center">
                <h2 className="text-2xl font-bold text-slate-800">No analysis yet</h2>
                <MutedText className="mt-2">Upload a chart and your result page will be generated here.</MutedText>
                <Link href="/dashboard/upload" className={clsx(primaryButtonClass, "mt-6")}>Upload Chart</Link>
            </Panel>
        );
    }

    const entryTone: Tone = analysis.entryType === "Buy" ? "green" : analysis.entryType === "Sell" ? "red" : "amber";

    return (
        <div className="mx-auto max-w-[1230px] space-y-6">
            <Panel>
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div className="flex items-start gap-4">
                        <IconTile tone={entryTone} className="h-12 w-12 text-xl">
                            {analysis.entryType === "Buy" ? <FiTrendingUp /> : <FiTrendingDown />}
                        </IconTile>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">{analysis.entryType} Signal for {analysis.symbol}</h2>
                            <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                                <span>{analysis.timeframe}</span>
                                <span className="flex items-center gap-1"><FiEye /> {analysis.fileName}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge tone={entryTone}>{analysis.entryType}</Badge>
                        <Badge tone="blue">{analysis.confidence}% confidence</Badge>
                        <Link href="/dashboard/history" className={clsx(outlineButtonClass, "ml-2")}>History</Link>
                    </div>
                </div>

                <MutedText className="mt-5">{analysis.summary}</MutedText>

                <div className="mt-6 flex flex-col justify-between gap-4 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="font-bold text-slate-800">Signal Strength</p>
                        <MutedText className="text-sm">Based on confidence score</MutedText>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-200">
                            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: `${analysis.confidence}%` }} />
                        </div>
                        <strong className="text-emerald-600">{analysis.confidence}%</strong>
                    </div>
                </div>

                <h3 className="mt-8 font-bold text-slate-800">Price Levels</h3>
                {analysis.imagePath && (
                    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        <Image
                            src={`/api/analyses/${analysis.id}/image`}
                            alt={`${analysis.symbol} uploaded chart`}
                            width={1200}
                            height={520}
                            className="max-h-[420px] w-full object-contain"
                            unoptimized
                        />
                    </div>
                )}
                <div className="mt-3 grid grid-cols-2 gap-3 text-center md:grid-cols-4">
                    <Level tone="red" price={analysis.stopLoss} label="Stop loss" />
                    <Level tone="blue" price={analysis.entry} label="Entry" />
                    <Level tone="green" price={analysis.tp1} label="TP1" />
                    <Level tone="green" price={analysis.tp2} label="TP2" />
                </div>
            </Panel>

            <div className="grid grid-cols-1 gap-x-6 gap-y-10 pt-4 md:grid-cols-2 xl:grid-cols-4">
                <Mini title="Current Price" value={analysis.entry} icon={<FiDollarSign />} tone="blue" detail={`Support ${analysis.support}`} />
                <Mini title="Volatility" value={`${Math.max(0.6, analysis.riskReward / 2).toFixed(2)}%`} icon={<FiTrendingUp />} tone="purple" detail="Estimated" />
                <Mini title="Market Sentiment" value={analysis.summary.split(" with ")[0]} icon={<FiTrendingUp />} tone="green" detail="AI chart read" />
                <Mini title="Risk Alert" value={`1 : ${analysis.riskReward}`} icon={<FiShield />} tone="yellow" detail="Planned risk/reward" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Panel>
                    <h3 className="font-bold text-slate-800">Key Levels</h3>
                    <div className="mt-4 divide-y divide-slate-100 text-sm">
                        <Row label="Support" value={analysis.support} />
                        <Row label="Resistance" value={analysis.resistance} />
                    </div>
                </Panel>
                <Panel>
                    <h3 className="font-bold text-slate-800">Trade Metrics</h3>
                    <div className="mt-4 divide-y divide-slate-100 text-sm">
                        <Row label="Risk/Reward" value={`1 : ${analysis.riskReward}`} />
                        <Row label="Confidence" value={`${analysis.confidence}%`} good />
                        <Row label="Outcome" value={analysis.outcome} />
                    </div>
                </Panel>
            </div>

            <Panel>
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h3 className="font-bold text-slate-800">Trade Outcome</h3>
                        <MutedText className="text-sm">How did this analysis perform?</MutedText>
                    </div>
                    <OutcomeButtons analysisId={analysis.id} />
                </div>
                <MutedText className="mt-5 flex items-center gap-1 border-t border-slate-100 pt-4 text-xs"><FiClock /> Analysis: {new Date(analysis.createdAt).toLocaleString()}</MutedText>
            </Panel>
        </div>
    );
};

const Level = ({ tone, price, label }: { tone: "red" | "blue" | "green"; price: string; label: string }) => {
    const colors = {
        red: "border-red-100 bg-red-50 text-red-700",
        blue: "border-blue-100 bg-blue-50 text-[#3457ff]",
        green: "border-emerald-100 bg-emerald-50 text-emerald-700",
    };
    return (
        <div className={clsx("rounded-xl border px-3 py-5", colors[tone])}>
            <p className="text-[11px] font-bold uppercase tracking-wider opacity-80">{label}</p>
            <strong className="mt-1 block text-lg">{price}</strong>
        </div>
    );
};

const Mini = ({ title, value, icon, tone, detail }: { title: string; value: string; icon: React.ReactNode; tone: Tone; detail: string }) => (
    <div className="relative rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <IconTile tone={tone} className="absolute -top-4 left-4 h-12 w-12 text-xl shadow-lg">{icon}</IconTile>
        <div className="p-4 pl-20 text-right">
            <p className="text-sm text-slate-500">{title}</p>
            <p className="mt-1 truncate text-lg font-bold text-slate-800">{value}</p>
        </div>
        <p className="border-t border-slate-100 px-4 py-3 text-sm text-slate-500">{detail}</p>
    </div>
);

const Row = ({ label, value, good }: { label: string; value: string; good?: boolean }) => (
    <div className="flex justify-between gap-4 py-3">
        <span className="text-slate-500">{label}</span>
        <strong className={good ? "text-emerald-600" : "text-slate-800"}>{value}</strong>
    </div>
);

export default ResultsPage;
