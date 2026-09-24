"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LightButton } from "./DashboardUi";

const OutcomeButtons: React.FC<{ analysisId: string }> = ({ analysisId }) => {
    const router = useRouter();
    const [saving, setSaving] = useState("");

    const setOutcome = async (outcome: string) => {
        setSaving(outcome);
        await fetch(`/api/analyses/${analysisId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ outcome }),
        });
        setSaving("");
        router.refresh();
    };

    return (
        <div className="flex flex-wrap gap-3">
            <LightButton className="border-emerald-200 text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50" onClick={() => setOutcome("Won")}>{saving === "Won" ? "Saving..." : "Won"}</LightButton>
            <LightButton className="border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50" onClick={() => setOutcome("Lost")}>{saving === "Lost" ? "Saving..." : "Lost"}</LightButton>
            <LightButton className="text-slate-500" onClick={() => setOutcome("Not Taken")}>{saving === "Not Taken" ? "Saving..." : "Not Taken"}</LightButton>
        </div>
    );
};

export default OutcomeButtons;
