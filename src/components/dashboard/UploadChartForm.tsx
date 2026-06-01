"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FiCheck, FiImage, FiSearch, FiUpload } from "react-icons/fi";
import { MutedText, Panel } from "@/components/dashboard/DashboardUi";
import PlanUpgradeModal from "@/components/dashboard/PlanUpgradeModal";

interface UploadChartFormProps {
    plan: {
        name: string;
        dailyLimit: number;
        creditsLeft: number;
        expiresAt: string;
    };
    expired: boolean;
}

const UploadChartForm: React.FC<UploadChartFormProps> = ({ plan, expired }) => {
    const router = useRouter();
    const blocked = expired || plan.creditsLeft <= 0;
    const creditLabel = plan.name === "Trial" ? "trial credits left" : "uploads left today";
    const [fileName, setFileName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [upgradeOpen, setUpgradeOpen] = useState(blocked);
    const [upgradeMessage, setUpgradeMessage] = useState("");

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (blocked) {
            setUpgradeOpen(true);
            return;
        }
        setLoading(true);
        setError("");
        const form = new FormData(event.currentTarget);
        const response = await fetch("/api/analyses", { method: "POST", body: form });
        const data = await response.json().catch(() => ({ error: "Unable to analyze chart right now. Please try again." }));
        setLoading(false);
        if (!response.ok) {
            const message = data.error || "Unable to analyze chart.";
            setError(message);
            if (response.status === 402) {
                setUpgradeMessage(message);
                setUpgradeOpen(true);
            }
            return;
        }
        router.push(`/dashboard/results?id=${data.analysis.id}`);
        router.refresh();
    };

    return (
        <div className="mx-auto grid max-w-[1480px] grid-cols-1 gap-7 xl:grid-cols-[0.9fr_1fr]">
            <PlanUpgradeModal
                open={upgradeOpen}
                onClose={() => setUpgradeOpen(false)}
                message={upgradeMessage || (plan.name === "Trial"
                    ? "Your trial includes 3 total chart analyses. Choose a paid plan to continue with fresh upload credits."
                    : "Your current plan cannot accept another upload right now. Choose a plan below to continue immediately.")}
            />
            <Panel className="min-h-[620px]">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                        <h2 className="flex items-center gap-2 text-xl font-extrabold"><FiImage /> Upload Chart for AI Analysis</h2>
                        <MutedText className="mt-2">Upload a chart to get AI-powered trading insights. Supports PNG, JPG.</MutedText>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm shadow-inner">
                        <strong>{plan.name}</strong>
                        <p className="mt-1 text-[#94a3b8]">{plan.creditsLeft} / {plan.dailyLimit} {creditLabel}</p>
                    </div>
                </div>

                {blocked && (
                    <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-[#f4c430]/40 bg-[#f4c430]/10 p-4 text-sm font-bold text-[#fde68a] sm:flex-row sm:items-center">
                        <span>{plan.name === "Trial" ? "Your free trial is finished. Buy a plan to upload another chart." : expired ? "Your plan access has expired. Buy a plan to upload again." : "No upload credits left for this plan right now."}</span>
                        <button type="button" onClick={() => setUpgradeOpen(true)} className="rounded-xl bg-[#f4c430] px-4 py-2 text-sm font-extrabold text-[#111318] transition-colors hover:bg-[#ffd84d]">
                            View plans
                        </button>
                    </div>
                )}

                <form onSubmit={submit} className="mt-8 space-y-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <label>
                            <span className="font-bold">Symbol</span>
                            <input name="symbol" defaultValue="EUR/USD" disabled={blocked} className="mt-2 w-full rounded-xl border border-white/10 bg-[#101827] px-4 py-3 text-white outline-none transition-colors placeholder:text-[#64748b] focus:border-[#3457ff] disabled:opacity-60" />
                        </label>
                        <label>
                            <span className="font-bold">Time frame</span>
                            <select name="timeframe" defaultValue="1h" disabled={blocked} className="mt-2 w-full rounded-xl border border-white/10 bg-[#101827] px-4 py-3 text-white outline-none transition-colors focus:border-[#3457ff] disabled:opacity-60">
                                <option>5m</option>
                                <option>15m</option>
                                <option>30m</option>
                                <option>1h</option>
                                <option>4h</option>
                                <option>1D</option>
                            </select>
                        </label>
                    </div>

                    <label
                        onClick={() => {
                            if (blocked) setUpgradeOpen(true);
                        }}
                        className={`flex min-h-[240px] flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed border-white/15 bg-[#101827] text-center transition-colors ${blocked ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-[#3457ff] hover:bg-white/[0.04]"}`}
                    >
                        <FiUpload className="text-6xl text-[#93c5fd]" />
                        <p className="mt-5 text-lg">{fileName || "Drop an image or click to upload"}</p>
                        <span className="mt-4 rounded-xl bg-[#3457ff] px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(52,87,255,0.2)]">Choose File</span>
                        <input
                            name="file"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            required
                            disabled={blocked}
                            className="sr-only"
                            onChange={(event) => setFileName(event.target.files?.[0]?.name || "")}
                        />
                    </label>

                    {error && <p className="rounded-xl border border-[#fb7185]/30 bg-[#7f1d1d]/25 p-3 text-sm font-bold text-[#fecaca]">{error}</p>}
                    <button disabled={loading} className="w-full rounded-xl bg-[#3457ff] px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_25px_rgba(52,87,255,0.22)] transition-colors hover:bg-[#263fd2] disabled:opacity-60">
                        {loading ? "Analyzing chart..." : blocked ? "Choose a plan to continue" : "Analyze Chart"}
                    </button>
                </form>

                {loading && (
                    <div className="mt-8 rounded-2xl border border-[#f4c430]/35 bg-[#f4c430]/10 p-6">
                        <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-[#3457ff] border-t-transparent" />
                        <h3 className="text-center text-2xl font-extrabold">Analyzing Your Chart</h3>
                        <MutedText className="mt-2 text-center">Creating user-specific analysis and saving it to your history.</MutedText>
                    </div>
                )}
            </Panel>

            <Panel>
                <h2 className="text-xl font-extrabold">Chart Upload Guidelines</h2>
                <div className="mt-7 space-y-6">
                    <Guide icon={<FiCheck />} title="Allowed Chart Type:">Use clear candlestick screenshots for best analysis quality.</Guide>
                    <Guide icon={<FiUpload />} title="How to Upload:">Select a PNG, JPG, or WEBP chart image and submit it for analysis.</Guide>
                    <Guide icon={<FiImage />} title="Supported Trading Styles:">Scalping, intraday, swing trading, and higher-timeframe reviews.</Guide>
                    <Guide icon={<FiSearch />} title="Chart Requirements:">Include a visible symbol and timeframe, and avoid cluttered screenshots.</Guide>
                </div>
            </Panel>
        </div>
    );
};

const Guide: React.FC<React.PropsWithChildren<{ icon: React.ReactNode; title: string }>> = ({ icon, title, children }) => (
    <div className="flex gap-4">
        <div className="flex h-9 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3457ff]/15 text-[#93c5fd]">{icon}</div>
        <div>
            <h3 className="font-extrabold">{title}</h3>
            <p className="mt-1 leading-relaxed text-[#94a3b8]">{children}</p>
        </div>
    </div>
);

export default UploadChartForm;
