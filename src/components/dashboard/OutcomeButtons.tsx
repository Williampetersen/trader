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
        <div className="flex gap-3">
            <LightButton className="text-[#0f9f6e]" onClick={() => setOutcome("Won")}>{saving === "Won" ? "Saving..." : "Won"}</LightButton>
            <LightButton className="text-[#d92d20]" onClick={() => setOutcome("Lost")}>{saving === "Lost" ? "Saving..." : "Lost"}</LightButton>
            <LightButton className="text-[#64748b]" onClick={() => setOutcome("Not Taken")}>{saving === "Not Taken" ? "Saving..." : "Not Taken"}</LightButton>
        </div>
    );
};

export default OutcomeButtons;
