"use client";

import clsx from "clsx";
import { useState } from "react";
import { FiArrowRight, FiCheckCircle, FiShield, FiStar, FiX, FiZap } from "react-icons/fi";
import { paidPlans, type PlanName } from "@/data/plans";

const visuals: Record<PlanName, { eyebrow: string; icon: React.ReactNode; featured?: boolean }> = {
    Trial: { eyebrow: "Trial", icon: <FiZap /> },
    "Basic Access": { eyebrow: "Weekly", icon: <FiZap /> },
    "Pro Trader": { eyebrow: "Most popular", icon: <FiStar />, featured: true },
    "Advanced Traders": { eyebrow: "Highest limit", icon: <FiShield /> },
};

interface PlanUpgradeModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

const PlanUpgradeModal: React.FC<PlanUpgradeModalProps> = ({
    open,
    onClose,
    title = "Choose a plan to continue",
    message = "Your trial credits are finished. Pick a plan and Stripe will activate the new credits on this account after payment.",
}) => {
    const [loading, setLoading] = useState("");
    const [error, setError] = useState("");

    if (!open) return null;

    const upgrade = async (plan: string) => {
        setLoading(plan);
        setError("");
        const response = await fetch("/api/billing/upgrade", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan }),
        });
        const data = await response.json();
        setLoading("");

        if (!response.ok) {
            setError(data.error || "Unable to open Stripe Checkout.");
            return;
        }
        if (!data.url) {
            setError("Stripe Checkout did not return a redirect URL.");
            return;
        }
        window.location.href = data.url;
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#020617]/80 px-4 py-6 backdrop-blur-xl" role="dialog" aria-modal="true">
            <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#090f19] text-white shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
                <div className="flex flex-col justify-between gap-4 border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(52,87,255,0.28),transparent_34%),radial-gradient(circle_at_90%_20%,rgba(244,196,48,0.13),transparent_28%)] p-6 sm:flex-row sm:items-start">
                    <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#f4c430]">Upgrade required</p>
                        <h2 className="mt-2 text-3xl font-extrabold">{title}</h2>
                        <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-[#cbd5e1]">{message}</p>
                    </div>
                    <button onClick={onClose} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-[#cbd5e1] transition-colors hover:bg-white/[0.1] hover:text-white" aria-label="Close upgrade plans">
                        <FiX />
                    </button>
                </div>

                <div className="grid gap-4 p-5 md:grid-cols-3">
                    {paidPlans.map((plan) => {
                        const visual = visuals[plan.name];
                        const isLoading = loading === plan.name;
                        return (
                            <button
                                key={plan.name}
                                onClick={() => upgrade(plan.name)}
                                disabled={Boolean(loading)}
                                className={clsx(
                                    "group relative overflow-hidden rounded-3xl border p-5 text-left transition-all hover:-translate-y-1 disabled:translate-y-0 disabled:opacity-60",
                                    visual.featured
                                        ? "border-[#f4c430]/60 bg-[#101827] shadow-[0_24px_60px_rgba(52,87,255,0.18)]"
                                        : "border-white/10 bg-white/[0.04] hover:border-[#3457ff]/70"
                                )}
                            >
                                <span className={clsx("absolute inset-x-0 top-0 h-1.5", visual.featured ? "bg-[#f4c430]" : "bg-[#3457ff]")} />
                                <div className="flex items-start justify-between gap-4">
                                    <span className={clsx("flex h-12 w-12 items-center justify-center rounded-2xl text-xl", visual.featured ? "bg-[#f4c430] text-[#111318]" : "bg-[#3457ff]/15 text-[#93c5fd]")}>
                                        {visual.icon}
                                    </span>
                                    <span className={clsx("rounded-full px-3 py-1 text-xs font-extrabold", visual.featured ? "bg-[#f4c430] text-[#111318]" : "bg-white/[0.08] text-[#cbd5e1]")}>
                                        {visual.eyebrow}
                                    </span>
                                </div>
                                <h3 className="mt-5 text-xl font-extrabold">{plan.name}</h3>
                                <p className="mt-2 min-h-[42px] text-sm font-semibold leading-6 text-[#94a3b8]">{plan.description}</p>
                                <div className="mt-5 flex items-end gap-2">
                                    <strong className={clsx("text-4xl font-extrabold", visual.featured ? "text-[#f4c430]" : "text-white")}>${plan.price.toFixed(2)}</strong>
                                    <span className="pb-1 text-sm font-bold text-[#94a3b8]">{plan.durationLabel}</span>
                                </div>
                                <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm font-bold text-[#dbeafe]">
                                    <p className="flex items-center gap-2"><FiCheckCircle className="text-[#22c55e]" /> {plan.allowanceLabel}</p>
                                    <p className="flex items-center gap-2"><FiCheckCircle className="text-[#22c55e]" /> Full AI chart analysis</p>
                                </div>
                                <span className={clsx("mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold transition-colors", visual.featured ? "bg-[#f4c430] text-[#111318] group-hover:bg-[#ffd84d]" : "bg-[#3457ff] text-white group-hover:bg-[#263fd2]")}>
                                    {isLoading ? "Opening Stripe..." : "Buy plan"}
                                    {!isLoading && <FiArrowRight />}
                                </span>
                            </button>
                        );
                    })}
                </div>
                {error && <p className="mx-5 mb-5 rounded-2xl border border-[#fb7185]/30 bg-[#7f1d1d]/25 p-4 text-sm font-bold text-[#fecaca]">{error}</p>}
            </div>
        </div>
    );
};

export default PlanUpgradeModal;
