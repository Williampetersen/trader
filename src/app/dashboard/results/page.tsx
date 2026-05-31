import Link from "next/link";
import Image from "next/image";
import { FiClock, FiDollarSign, FiEye, FiShield, FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import { requireUser } from "@/lib/server/auth";
import { readDb } from "@/lib/server/store";
import OutcomeButtons from "@/components/dashboard/OutcomeButtons";
import { MutedText, Panel } from "@/components/dashboard/DashboardUi";

const ResultsPage = async ({ searchParams }: { searchParams: { id?: string } }) => {
    const user = await requireUser();
    const db = await readDb();
    const userAnalyses = db.analyses.filter((item) => item.userId === user.id);
    const analysis = searchParams.id
        ? userAnalyses.find((item) => item.id === searchParams.id)
        : userAnalyses[userAnalyses.length - 1];

    if (!analysis) {
        return (
            <Panel className="mx-auto max-w-3xl text-center">
                <h2 className="text-3xl font-extrabold">No analysis yet</h2>
                <MutedText className="mt-3">Upload a chart and your result page will be generated here.</MutedText>
                <Link href="/dashboard/upload" className="mt-6 inline-block rounded-2xl bg-[#3457ff] px-5 py-3 text-sm font-extrabold text-white shadow-[0_14px_35px_rgba(52,87,255,0.28)]">Upload Chart</Link>
            </Panel>
        );
    }

    return (
        <div className="mx-auto max-w-[1230px]">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h2 className="text-3xl font-extrabold">Analysis Results</h2>
                    <MutedText className="mt-2">{analysis.symbol} - {analysis.timeframe}</MutedText>
                </div>
                <Link href="/dashboard/history">
                    <button className="rounded-2xl bg-[#3457ff] px-5 py-3 text-sm font-extrabold text-white shadow-[0_14px_35px_rgba(52,87,255,0.28)]">View History</button>
                </Link>
            </div>

            <Panel>
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                        <h3 className="flex items-center gap-3 text-xl font-extrabold">
                            <FiTrendingDown className="text-[#d92d20]" /> {analysis.entryType} Signal for {analysis.symbol}
                            <span className="flex items-center gap-1 text-xs font-semibold text-[#93c5fd]"><FiEye /> {analysis.fileName}</span>
                        </h3>
                        <MutedText className="mt-4">{analysis.summary}</MutedText>
                    </div>
                    <div className="flex gap-2">
                        <span className="rounded-full bg-[#3457ff]/20 px-4 py-2 text-sm font-bold text-[#bfdbfe]">{analysis.entryType}</span>
                        <span className="rounded-full border border-[#4ade80]/20 bg-[#16a34a]/20 px-4 py-2 text-sm font-bold text-[#86efac]">{analysis.confidence}%</span>
                    </div>
                </div>

                <div className="mt-7 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <strong>Signal Strength</strong>
                            <MutedText className="text-sm">Based on confidence score</MutedText>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-3 w-28 rounded-full bg-white/10"><div className="h-3 rounded-full bg-[#22c55e]" style={{ width: `${analysis.confidence}%` }} /></div>
                            <strong className="text-[#86efac]">{analysis.confidence}%</strong>
                        </div>
                    </div>
                </div>

                <h4 className="mt-6 font-extrabold">Price Levels</h4>
                {analysis.imagePath && (
                    <div className="mt-3 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
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
                <div className="mt-3 grid overflow-hidden rounded-3xl border border-white/10 text-center text-sm md:grid-cols-4">
                    <Level tone="red" price={analysis.stopLoss} label="SL" />
                    <Level tone="blue" price={analysis.entry} label="Entry" />
                    <Level tone="green" price={analysis.tp1} label="TP1" />
                    <Level tone="green" price={analysis.tp2} label="TP2" />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Mini title="Current Price" value={analysis.entry} icon={<FiDollarSign />} detail={`Support ${analysis.support}`} />
                    <Mini title="Volatility" value={`${Math.max(0.6, analysis.riskReward / 2).toFixed(2)}%`} icon={<FiTrendingUp />} detail="Estimated" />
                    <Mini title="Market Sentiment" value={analysis.summary.split(" with ")[0]} icon={<FiTrendingUp />} detail="AI chart read" />
                    <Mini title="Risk Alert" value={`1 : ${analysis.riskReward}`} icon={<FiShield />} detail="Planned risk/reward" />
                </div>

                <div className="mt-8 border-b border-white/10 text-sm">
                    <span className="inline-block border-b-2 border-[#3457ff] px-4 py-3 font-bold text-[#93c5fd]">Technical Analysis</span>
                    <span className="inline-block px-4 py-3 text-[#94a3b8]">Risk Management</span>
                    <span className="inline-block px-4 py-3 text-[#94a3b8]">Overview</span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Panel className="bg-white/[0.04]">
                        <h4 className="font-extrabold">Key Levels</h4>
                        <div className="mt-4 space-y-3 text-sm">
                            <Row label="Support" value={analysis.support} />
                            <Row label="Resistance" value={analysis.resistance} />
                        </div>
                    </Panel>
                    <Panel className="bg-white/[0.04]">
                        <h4 className="font-extrabold">Trade Metrics</h4>
                        <div className="mt-4 space-y-3 text-sm">
                            <Row label="Risk/Reward" value={`1 : ${analysis.riskReward}`} />
                            <Row label="Confidence" value={`${analysis.confidence}%`} good />
                            <Row label="Outcome" value={analysis.outcome} />
                        </div>
                    </Panel>
                </div>

                <div className="mt-7 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center">
                    <div>
                        <strong>Trade Outcome</strong>
                        <MutedText className="text-sm">How did this analysis perform?</MutedText>
                    </div>
                    <OutcomeButtons analysisId={analysis.id} />
                </div>

                <MutedText className="mt-6 border-t border-white/10 pt-5 text-xs"><FiClock className="mr-1 inline" /> Analysis: {new Date(analysis.createdAt).toLocaleString()}</MutedText>
            </Panel>
        </div>
    );
};

const Level = ({ tone, price, label }: { tone: "red" | "blue" | "green"; price: string; label: string }) => {
    const colors = {
        red: "bg-[#7f1d1d]/35 text-[#fecaca]",
        blue: "bg-[#1d4ed8]/25 text-[#bfdbfe]",
        green: "bg-[#14532d]/35 text-[#86efac]",
    };
    const badge = {
        red: "bg-[#d92d20]",
        blue: "bg-[#3457ff]",
        green: "bg-[#0f9f6e]",
    };
    return (
        <div className={`${colors[tone]} py-8`}>
            <strong>{price}</strong>
            <span className={`${badge[tone]} mx-auto mt-1 block w-fit rounded-full px-7 py-1 text-xs font-bold text-white`}>{label}</span>
        </div>
    );
};

const Mini = ({ title, value, icon, detail }: { title: string; value: string; icon: React.ReactNode; detail: string }) => (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <h4 className="flex items-center gap-2 text-sm font-extrabold">{icon}{title}</h4>
        <p className="mt-3 text-xl font-extrabold">{value}</p>
        <p className="mt-2 text-xs text-[#86efac]">{detail}</p>
    </div>
);

const Row = ({ label, value, good }: { label: string; value: string; good?: boolean }) => (
    <div className="flex justify-between gap-4">
        <span className="text-[#94a3b8]">{label}</span>
        <strong className={good ? "text-[#86efac]" : "text-white"}>{value}</strong>
    </div>
);

export default ResultsPage;
