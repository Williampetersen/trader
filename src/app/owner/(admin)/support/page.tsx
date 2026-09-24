import { FiCheckCircle, FiHeadphones, FiInbox, FiMail, FiUser } from "react-icons/fi";
import OwnerTicketActions from "@/components/owner/OwnerTicketActions";
import { PanelHeader, StatGrid } from "@/components/dashboard/DashboardUi";
import { OwnerBadge, OwnerMuted, OwnerPanel, OwnerStat, formatDate } from "@/components/owner/OwnerUi";
import { getOwnerMetrics } from "@/lib/server/owner-metrics";

const OwnerSupportPage = async () => {
    const metrics = await getOwnerMetrics();
    const open = metrics.supportTickets.filter((ticket) => ticket.status === "Open").length;
    const answered = metrics.supportTickets.filter((ticket) => ticket.status === "Answered").length;

    return (
        <div className="space-y-8">
            <StatGrid className="xl:grid-cols-3">
                <OwnerStat label="Open tickets" value={String(open)} detail="Needs owner response" icon={<FiInbox />} tone="amber" />
                <OwnerStat label="Answered tickets" value={String(answered)} detail="Resolved or replied" icon={<FiCheckCircle />} tone="green" />
                <OwnerStat label="Total tickets" value={String(metrics.supportTickets.length)} detail="All support conversations" icon={<FiHeadphones />} tone="blue" />
            </StatGrid>

            <OwnerPanel>
                <PanelHeader icon={<FiHeadphones />} title="Support Tickets" description="Tickets submitted from the user support page. You can mark tickets answered or reopen them." />
                <div className="mt-6 grid gap-4">
                    {metrics.supportTickets.length === 0 ? (
                        <OwnerMuted className="py-8 text-center">No support tickets yet.</OwnerMuted>
                    ) : metrics.supportTickets.map((ticket) => (
                        <div key={ticket.id} className="rounded-xl border border-slate-200/80 p-5 transition-shadow hover:shadow-md">
                            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <OwnerBadge tone={ticket.status === "Open" ? "amber" : "green"}>{ticket.status}</OwnerBadge>
                                        <OwnerMuted className="text-xs">{formatDate(ticket.createdAt)}</OwnerMuted>
                                    </div>
                                    <h3 className="mt-3 text-lg font-bold text-slate-800">{ticket.subject}</h3>
                                    <p className="mt-1 max-w-4xl whitespace-pre-wrap text-slate-600">{ticket.message}</p>
                                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                                        <span className="inline-flex items-center gap-2"><FiUser /> {ticket.userName}</span>
                                        <span className="inline-flex items-center gap-2"><FiMail /> {ticket.userEmail || "No email"}</span>
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
