"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { paidPlans } from "@/data/plans";

const UpgradePlanButtons = () => {
    const router = useRouter();
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
        setMessage(`${plan} is now active.`);
        router.refresh();
    };

    return (
        <div className="mt-6">
            <div className="grid gap-3 md:grid-cols-3">
                {paidPlans.map((plan) => (
                    <button
                        key={plan.name}
                        onClick={() => upgrade(plan.name)}
                        disabled={Boolean(loading)}
                        className="rounded-2xl border border-[#dbe3ef] bg-white p-4 text-left shadow-sm transition-colors hover:border-[#3457ff] hover:bg-[#f8fafc] disabled:opacity-60"
                    >
                        <p className="font-extrabold">{plan.name}</p>
                        <p className="mt-1 text-2xl font-extrabold text-[#3457ff]">${plan.price.toFixed(2)}</p>
                        <p className="mt-1 text-sm text-[#64748b]">{loading === plan.name ? "Activating..." : `${plan.dailyLimit} uploads/day for ${plan.durationLabel}`}</p>
                    </button>
                ))}
            </div>
            {message && <p className="mt-3 rounded-xl bg-[#eef3ff] p-3 text-sm font-bold text-[#3457ff]">{message}</p>}
        </div>
    );
};

export default UpgradePlanButtons;
