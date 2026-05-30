"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FiCheck, FiImage, FiSearch, FiUpload } from "react-icons/fi";
import { MutedText, Panel } from "@/components/dashboard/DashboardUi";

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
    const [fileName, setFileName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const blocked = expired || plan.creditsLeft <= 0;

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (blocked) return;
        setLoading(true);
        setError("");
        const form = new FormData(event.currentTarget);
        const response = await fetch("/api/analyses", { method: "POST", body: form });
        const data = await response.json();
        setLoading(false);
        if (!response.ok) {
            setError(data.error || "Unable to analyze chart.");
            return;
        }
        router.push(`/dashboard/results?id=${data.analysis.id}`);
        router.refresh();
    };

    return (
        <div className="mx-auto grid max-w-[1480px] grid-cols-1 gap-7 xl:grid-cols-[0.9fr_1fr]">
            <Panel className="min-h-[620px]">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                        <h2 className="flex items-center gap-2 text-xl font-extrabold"><FiImage /> Upload Chart for AI Analysis</h2>
                        <MutedText className="mt-2">Upload a chart to get AI-powered trading insights. Supports PNG, JPG.</MutedText>
                    </div>
                    <div className="rounded-2xl border border-[#dbe3ef] bg-[#f8fafc] px-4 py-3 text-sm shadow-inner">
                        <strong>{plan.name}</strong>
                        <p className="mt-1 text-[#64748b]">{plan.creditsLeft} / {plan.dailyLimit} uploads left today</p>
                    </div>
                </div>

                {blocked && (
                    <div className="mt-6 rounded-2xl border border-[#f6dd96] bg-[#fff7df] p-4 text-sm font-bold text-[#ad6b00]">
                        {expired ? "Your plan access has expired. Upgrade from Billing to upload again." : "No upload credits left today. Upgrade your plan or wait for tomorrow's reset."}
                    </div>
                )}

                <form onSubmit={submit} className="mt-8 space-y-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <label>
                            <span className="font-bold">Symbol</span>
                            <input name="symbol" defaultValue="EUR/USD" disabled={blocked} className="mt-2 w-full rounded-xl border border-[#dbe3ef] bg-[#f8fafc] px-4 py-3 outline-none transition-colors focus:border-[#3457ff] focus:bg-white disabled:opacity-60" />
                        </label>
                        <label>
                            <span className="font-bold">Time frame</span>
                            <select name="timeframe" defaultValue="1h" disabled={blocked} className="mt-2 w-full rounded-xl border border-[#dbe3ef] bg-[#f8fafc] px-4 py-3 outline-none transition-colors focus:border-[#3457ff] focus:bg-white disabled:opacity-60">
                                <option>5m</option>
                                <option>15m</option>
                                <option>30m</option>
                                <option>1h</option>
                                <option>4h</option>
                                <option>1D</option>
                            </select>
                        </label>
                    </div>

                    <label className={`flex min-h-[240px] flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed border-[#b8c6d8] bg-[#f8fafc] text-center transition-colors ${blocked ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-[#3457ff] hover:bg-white"}`}>
                        <FiUpload className="text-6xl text-[#3457ff]" />
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

                    {error && <p className="rounded-xl bg-[#fff1ef] p-3 text-sm font-bold text-[#d92d20]">{error}</p>}
                    <button disabled={loading || blocked} className="w-full rounded-xl bg-[#3457ff] px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_25px_rgba(52,87,255,0.22)] transition-colors hover:bg-[#263fd2] disabled:opacity-60">
                        {loading ? "Analyzing chart..." : "Analyze Chart"}
                    </button>
                </form>

                {loading && (
                    <div className="mt-8 rounded-2xl border border-[#f6dd96] bg-[#fff7df] p-6">
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
        <div className="flex h-9 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef3ff] text-[#3457ff]">{icon}</div>
        <div>
            <h3 className="font-extrabold">{title}</h3>
            <p className="mt-1 leading-relaxed text-[#64748b]">{children}</p>
        </div>
    </div>
);

export default UploadChartForm;
