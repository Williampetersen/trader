"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LightButton, PrimaryButton } from "@/components/dashboard/DashboardUi";

const OwnerTicketActions = ({ ticketId, status }: { ticketId: string; status: string }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const nextStatus = status === "Open" ? "Answered" : "Open";

    const updateStatus = async () => {
        setLoading(true);
        await fetch(`/api/owner/support/${ticketId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: nextStatus }),
        });
        setLoading(false);
        router.refresh();
    };

    const Button = status === "Open" ? PrimaryButton : LightButton;

    return (
        <Button onClick={updateStatus} disabled={loading} className="shrink-0">
            {loading ? "Saving..." : status === "Open" ? "Mark answered" : "Reopen"}
        </Button>
    );
};

export default OwnerTicketActions;
