"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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

    return (
        <button onClick={updateStatus} disabled={loading} className="rounded-2xl bg-[#3457ff] px-4 py-2 text-xs font-extrabold text-white transition-colors hover:bg-[#263fd2] disabled:opacity-60">
            {loading ? "Saving..." : status === "Open" ? "Mark answered" : "Reopen"}
        </button>
    );
};

export default OwnerTicketActions;
