"use client";

import { useState } from "react";
import { FiShield, FiStar, FiX, FiZap } from "react-icons/fi";
import { paidPlans, type PlanName } from "@/data/plans";
import { Notice } from "./DashboardUi";
import { PlanCard } from "./UpgradePlanButtons";

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
        <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-slate-900/40 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true">
            <div className="w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-2xl">
                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-start">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#3457ff]">Upgrade required</p>
                        <h2 className="mt-2 text-2xl font-bold text-slate-800">{title}</h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{message}</p>
                    </div>
                    <button onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800" aria-label="Close upgrade plans">
                        <FiX />
                    </button>
                </div>

                <div className="grid gap-x-5 gap-y-8 bg-slate-50/60 p-6 pt-8 md:grid-cols-3">
                    {paidPlans.map((plan) => {
                        const visual = visuals[plan.name];
                        return (
                            <PlanCard
                                key={plan.name}
                                plan={plan}
                                icon={visual.icon}
                                badge={visual.eyebrow}
                                featured={visual.featured}
                                cta="Buy plan"
                                loading={loading === plan.name}
                                disabled={Boolean(loading)}
                                onClick={() => upgrade(plan.name)}
                            />
                        );
                    })}
                </div>
                {error && <Notice tone="red" className="mx-6 mb-6">{error}</Notice>}
            </div>
        </div>
    );
};

export default PlanUpgradeModal;
