"use client";

import clsx from "clsx";
import { useState } from "react";
import { FiArrowRight, FiCheckCircle, FiShield, FiStar, FiZap } from "react-icons/fi";
import { paidPlans, type PlanName } from "@/data/plans";

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
        <div className="mt-7">
            <div className="mb-5 flex flex-col justify-between gap-3 rounded-2xl border border-[#dbe3ef] bg-[#f8fafc] p-4 sm:flex-row sm:items-center">
                <div>
                    <h3 className="text-lg font-extrabold">Upgrade access</h3>
                    <p className="mt-1 text-sm font-semibold text-[#64748b]">Secure Stripe checkout. Plan activates after payment confirmation.</p>
                </div>
                <span className="w-fit rounded-full bg-[#eafaf3] px-3 py-1 text-xs font-extrabold text-[#0f9f6e]">Live subscription billing</span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {paidPlans.map((plan) => {
                    const visual = planVisuals[plan.name];
                    const isLoading = loading === plan.name;

                    return (
                        <button
                            key={plan.name}
                            onClick={() => upgrade(plan.name)}
                            disabled={Boolean(loading)}
                            className={clsx(
                                "group relative overflow-hidden rounded-[1.35rem] border p-5 text-left shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-1 disabled:translate-y-0 disabled:opacity-60",
                                visual.featured
                                    ? "border-[#3457ff] bg-[#111318] text-white ring-4 ring-[#3457ff]/10"
                                    : "border-[#dbe3ef] bg-white text-[#111827] hover:border-[#3457ff]"
                            )}
                        >
                            <span className={clsx(
                                "absolute inset-x-0 top-0 h-1.5",
                                visual.featured ? "bg-[#f4c430]" : "bg-[#3457ff]"
                            )} />

                            <div className="flex items-start justify-between gap-4">
                                <div className={clsx(
                                    "flex h-11 w-11 items-center justify-center rounded-2xl text-xl",
                                    visual.featured ? "bg-white/10 text-[#f4c430]" : "bg-[#eef3ff] text-[#3457ff]"
                                )}>
                                    {visual.icon}
                                </div>
                                <span className={clsx(
                                    "rounded-full px-3 py-1 text-xs font-extrabold",
                                    visual.featured ? "bg-[#f4c430] text-[#111318]" : "bg-[#eef3ff] text-[#3457ff]"
                                )}>
                                    {visual.badge}
                                </span>
                            </div>

                            <h4 className="mt-5 text-xl font-extrabold">{plan.name}</h4>
                            <p className={clsx("mt-1 text-sm font-semibold", visual.featured ? "text-[#cbd5e1]" : "text-[#64748b]")}>{visual.pitch}</p>

                            <div className="mt-5 flex items-end gap-2">
                                <strong className={clsx("text-4xl font-extrabold", visual.featured ? "text-[#f4c430]" : "text-[#3457ff]")}>${plan.price.toFixed(2)}</strong>
                                <span className={clsx("pb-1 text-sm font-bold", visual.featured ? "text-[#cbd5e1]" : "text-[#64748b]")}>{plan.durationLabel}</span>
                            </div>

                            <div className={clsx("mt-5 space-y-2 border-t pt-4 text-sm font-bold", visual.featured ? "border-white/10 text-[#e2e8f0]" : "border-[#e6edf6] text-[#334155]")}>
                                <p className="flex items-center gap-2"><FiCheckCircle className={visual.featured ? "text-[#f4c430]" : "text-[#0f9f6e]"} /> {plan.dailyLimit} uploads per day</p>
                                <p className="flex items-center gap-2"><FiCheckCircle className={visual.featured ? "text-[#f4c430]" : "text-[#0f9f6e]"} /> Full AI analysis output</p>
                            </div>

                            <span className={clsx(
                                "mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold transition-colors",
                                visual.featured
                                    ? "bg-[#f4c430] text-[#111318] group-hover:bg-[#ffd84d]"
                                    : "bg-[#3457ff] text-white group-hover:bg-[#263fd2]"
                            )}>
                                {isLoading ? "Opening Stripe..." : visual.cta}
                                {!isLoading && <FiArrowRight />}
                            </span>
                        </button>
                    );
                })}
            </div>
            {message && <p className="mt-3 rounded-xl bg-[#eef3ff] p-3 text-sm font-bold text-[#3457ff]">{message}</p>}
        </div>
    );
};

export default UpgradePlanButtons;
