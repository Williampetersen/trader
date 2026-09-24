"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FiCheck, FiImage, FiSearch, FiUpload } from "react-icons/fi";
import { Badge, IconTile, MutedText, Notice, Panel, PanelHeader, PrimaryButton, type Tone } from "@/components/dashboard/DashboardUi";
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
        <div className="mx-auto grid max-w-[1480px] grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <PlanUpgradeModal
                open={upgradeOpen}
                onClose={() => setUpgradeOpen(false)}
                message={upgradeMessage || (plan.name === "Trial"
                    ? "Your trial includes 3 total chart analyses. Choose a paid plan to continue with fresh upload credits."
                    : "Your current plan cannot accept another upload right now. Choose a plan below to continue immediately.")}
            />
            <Panel>
                <PanelHeader
                    icon={<FiImage />}
                    title="Upload Chart for AI Analysis"
                    description="Upload a chart to get AI-powered trading insights. Supports PNG, JPG, WEBP."
                    action={
                        <div className="text-right">
                            <Badge tone={blocked ? "red" : "blue"}>{plan.name}</Badge>
                            <p className="mt-1 text-xs text-slate-500">{plan.creditsLeft} / {plan.dailyLimit} {creditLabel}</p>
                        </div>
                    }
                />

                {blocked && (
                    <Notice tone="amber" className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <span>{plan.name === "Trial" ? "Your free trial is finished. Buy a plan to upload another chart." : expired ? "Your plan access has expired. Buy a plan to upload again." : "No upload credits left for this plan right now."}</span>
                        <button type="button" onClick={() => setUpgradeOpen(true)} className="shrink-0 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-400 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-md shadow-orange-500/20">
                            View plans
                        </button>
                    </Notice>
                )}

                <form onSubmit={submit} className="mt-6 space-y-5">
                    <label
                        onClick={() => {
                            if (blocked) setUpgradeOpen(true);
                        }}
                        className={clsx(
                            "flex min-h-[260px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 text-center transition-colors",
                            blocked ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-[#3457ff] hover:bg-blue-50/50"
                        )}
                    >
                        <IconTile tone="blue" className="h-16 w-16 text-2xl"><FiUpload /></IconTile>
                        <p className="mt-5 font-medium text-slate-700">{fileName || "Drop an image or click to upload"}</p>
                        <p className="mt-1 text-sm text-slate-400">PNG, JPG or WEBP</p>
                        <span className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-700">Choose File</span>
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

                    {error && <Notice tone="red">{error}</Notice>}
                    <PrimaryButton disabled={loading} className="w-full py-3">
                        {loading ? "Analyzing chart..." : blocked ? "Choose a plan to continue" : "Analyze Chart"}
                    </PrimaryButton>
                </form>

                {loading && (
                    <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 p-6 text-center">
                        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#3457ff] border-t-transparent" />
                        <h3 className="text-lg font-bold text-slate-800">Analyzing Your Chart</h3>
                        <MutedText className="mt-1 text-sm">Creating user-specific analysis and saving it to your history.</MutedText>
                    </div>
                )}
            </Panel>

            <Panel className="h-fit">
                <PanelHeader title="Chart Upload Guidelines" description="Follow these for the most accurate read" />
                <div className="mt-6 space-y-5">
                    <Guide icon={<FiCheck />} tone="green" title="Allowed Chart Type">Use clear candlestick screenshots for best analysis quality.</Guide>
                    <Guide icon={<FiUpload />} tone="blue" title="How to Upload">Select a PNG, JPG, or WEBP chart image and submit it for analysis.</Guide>
                    <Guide icon={<FiImage />} tone="purple" title="Supported Trading Styles">Scalping, intraday, swing trading, and higher-timeframe reviews.</Guide>
                    <Guide icon={<FiSearch />} tone="yellow" title="Chart Requirements">The image must contain visible candlesticks and readable price action. Non-chart images are rejected.</Guide>
                </div>
            </Panel>
        </div>
    );
};

const Guide: React.FC<React.PropsWithChildren<{ icon: React.ReactNode; tone: Tone; title: string }>> = ({ icon, tone, title, children }) => (
    <div className="flex gap-4">
        <IconTile tone={tone} className="h-10 w-10 text-base">{icon}</IconTile>
        <div>
            <h3 className="font-bold text-slate-800">{title}</h3>
            <p className="mt-0.5 text-sm leading-relaxed text-slate-500">{children}</p>
        </div>
    </div>
);

export default UploadChartForm;
