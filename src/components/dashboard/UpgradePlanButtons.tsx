"use client";

import clsx from "clsx";
import { useState } from "react";
import { FiArrowRight, FiCheckCircle, FiShield, FiStar, FiZap } from "react-icons/fi";
import { paidPlans, type PlanName } from "@/data/plans";
import { Badge, Notice, toneGradients } from "./DashboardUi";

const planVisuals: Record<PlanName, {
    badge: string;
    cta: string;
    pitch: string;
    icon: React.ReactNode;
    featured?: boolean;
}> = {
    Trial: {
        badge: "Trial",
        cta: "Start trial",
        pitch: "Free starter access.",
        icon: <FiZap />,
    },
    "Basic Access": {
        badge: "Weekly",
        cta: "Start Basic",
        pitch: "Best for focused weekly chart reviews.",
        icon: <FiZap />,
    },
    "Pro Trader": {
        badge: "Most popular",
        cta: "Choose Pro",
        pitch: "More daily uploads for consistent traders.",
        icon: <FiStar />,
        featured: true,
    },
    "Advanced Traders": {
        badge: "Highest limit",
        cta: "Go Advanced",
        pitch: "Maximum usage with priority support.",
        icon: <FiShield />,
    },
};

type PaidPlan = (typeof paidPlans)[number];

export const PlanCard = ({ plan, icon, badge, pitch, cta, featured, loading, disabled, onClick }: {
    plan: PaidPlan;
    icon: React.ReactNode;
    badge: string;
    pitch?: string;
    cta: string;
    featured?: boolean;
    loading: boolean;
    disabled: boolean;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={clsx(
            "group relative rounded-xl border bg-white p-5 pt-10 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg disabled:translate-y-0 disabled:opacity-60",
            featured ? "border-[#3457ff]/40 ring-2 ring-[#3457ff]/10" : "border-slate-200/80"
        )}
    >
        <span className={clsx("absolute -top-4 left-5 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-tr text-xl text-white shadow-lg", toneGradients[featured ? "blue" : "gray"])}>
            {icon}
        </span>
        <Badge tone={featured ? "blue" : "gray"} className="absolute right-4 top-4">{badge}</Badge>

        <h4 className="text-lg font-bold text-slate-800">{plan.name}</h4>
        <p className="mt-1 min-h-[40px] text-sm text-slate-500">{pitch || plan.description}</p>

        <div className="mt-4 flex items-end gap-2">
            <strong className="text-3xl font-bold text-slate-800">${plan.price.toFixed(2)}</strong>
            <span className="pb-1 text-sm text-slate-500">{plan.durationLabel}</span>
        </div>

        <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
            <p className="flex items-center gap-2"><FiCheckCircle className="text-emerald-500" /> {plan.allowanceLabel}</p>
            <p className="flex items-center gap-2"><FiCheckCircle className="text-emerald-500" /> Full AI analysis output</p>
        </div>

        <span className={clsx(
            "mt-5 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wide transition-all",
            featured
                ? "bg-gradient-to-tr from-[#3457ff] to-[#5a7bff] text-white shadow-md shadow-[#3457ff]/20 group-hover:shadow-lg group-hover:shadow-[#3457ff]/40"
                : "border border-slate-300 text-slate-700 group-hover:bg-slate-50"
        )}>
            {loading ? "Opening Stripe..." : cta}
            {!loading && <FiArrowRight />}
        </span>
    </button>
);

const UpgradePlanButtons = () => {
    const [loading, setLoading] = useState("");
    const [message, setMessage] = useState("");

    const upgrade = async (plan: string) => {
        setLoading(plan);
        setMessage("");
        const response = await fetch("/api/billing/upgrade", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan }),
        });
        const data = await response.json();
        setLoading("");
        if (!response.ok) {
            setMessage(data.error || "Unable to upgrade plan.");
            return;
        }
        if (data.url) {
            setMessage("Redirecting to secure Stripe checkout...");
            window.location.href = data.url;
            return;
        }
        setMessage("Stripe checkout did not return a redirect URL.");
    };

    return (
        <div className="mt-8 border-t border-slate-100 pt-6">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Upgrade access</h3>
                    <p className="mt-0.5 text-sm text-slate-500">Secure Stripe checkout. Plan activates after payment confirmation.</p>
                </div>
                <Badge tone="green">Live subscription billing</Badge>
            </div>

            <div className="grid gap-x-5 gap-y-8 pt-2 md:grid-cols-3">
                {paidPlans.map((plan) => {
                    const visual = planVisuals[plan.name];
                    return (
                        <PlanCard
                            key={plan.name}
                            plan={plan}
                            icon={visual.icon}
                            badge={visual.badge}
                            pitch={visual.pitch}
                            cta={visual.cta}
                            featured={visual.featured}
                            loading={loading === plan.name}
                            disabled={Boolean(loading)}
                            onClick={() => upgrade(plan.name)}
                        />
                    );
                })}
            </div>
            {message && <Notice className="mt-4">{message}</Notice>}
        </div>
    );
};

export default UpgradePlanButtons;
