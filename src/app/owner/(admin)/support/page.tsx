import { FiHeadphones, FiMail, FiMessageSquare } from "react-icons/fi";
import OwnerTicketActions from "@/components/owner/OwnerTicketActions";
import { OwnerBadge, OwnerMuted, OwnerPanel, OwnerStat, formatDate } from "@/components/owner/OwnerUi";
import { getOwnerMetrics } from "@/lib/server/owner-metrics";

const OwnerSupportPage = async () => {
    const metrics = await getOwnerMetrics();
    const open = metrics.supportTickets.filter((ticket) => ticket.status === "Open").length;
    const answered = metrics.supportTickets.filter((ticket) => ticket.status === "Answered").length;

    return (
        <div className="space-y-7">
            <div className="grid gap-4 md:grid-cols-3">
                <OwnerStat label="Open tickets" value={String(open)} detail="Needs owner response" tone="amber" />
                <OwnerStat label="Answered tickets" value={String(answered)} detail="Resolved or replied" tone="green" />
                <OwnerStat label="Total tickets" value={String(metrics.supportTickets.length)} detail="All support conversations" tone="blue" />
            </div>

            <OwnerPanel>
                <h2 className="flex items-center gap-3 text-2xl font-extrabold"><FiHeadphones /> Support Tickets</h2>
                <OwnerMuted className="mt-1">Tickets submitted from the user support page. You can mark tickets answered or reopen them.</OwnerMuted>
                <div className="mt-7 grid gap-4">
                    {metrics.supportTickets.length === 0 ? (
                        <OwnerMuted>No support tickets yet.</OwnerMuted>
                    ) : metrics.supportTickets.map((ticket) => (
                        <div key={ticket.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <OwnerBadge tone={ticket.status === "Open" ? "amber" : "green"}>{ticket.status}</OwnerBadge>
                                        <OwnerMuted className="text-xs">{formatDate(ticket.createdAt)}</OwnerMuted>
                                    </div>
                                    <h3 className="mt-4 text-xl font-extrabold">{ticket.subject}</h3>
                                    <p className="mt-2 max-w-4xl whitespace-pre-wrap text-[#cbd5e1]">{ticket.message}</p>
                                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#94a3b8]">
                                        <span className="inline-flex items-center gap-2"><FiMail /> {ticket.userEmail || "No email"}</span>
                                        <span className="inline-flex items-center gap-2"><FiMessageSquare /> {ticket.userName}</span>
                                    </div>
                                </div>
                                <OwnerTicketActions ticketId={ticket.id} status={ticket.status} />
                            </div>
                        </div>
                    ))}
                </div>
            </OwnerPanel>
        </div>
    );
};

export default OwnerSupportPage;
