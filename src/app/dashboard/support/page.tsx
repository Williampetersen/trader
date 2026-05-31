"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { FiChevronDown, FiMail, FiSearch } from "react-icons/fi";
import { MutedText, Panel } from "@/components/dashboard/DashboardUi";

const questions = [
    "How do I subscribe to GPT Chart View?",
    "Subscription paid but plan not activated",
    "What payment methods do you accept?",
    "Will I get instant access after subscribing?",
    "Can I try GPT Chart View before paying?",
    "Can I change or upgrade my plan later?",
    "What happens if I cancel my subscription?",
];

interface Ticket {
    id: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
}

const SupportPage = () => {
    const [query, setQuery] = useState("");
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [message, setMessage] = useState("");
    const filteredQuestions = useMemo(
        () => questions.filter((question) => question.toLowerCase().includes(query.toLowerCase())),
        [query]
    );

    useEffect(() => {
        fetch("/api/support")
            .then((response) => response.json())
            .then((data) => setTickets(data.tickets || []));
    }, []);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const response = await fetch("/api/support", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                subject: formData.get("subject"),
                message: formData.get("message"),
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            setMessage(data.error || "Unable to create support ticket.");
            return;
        }
        setTickets((current) => [data.ticket, ...current]);
        setMessage(data.emailSent ? "Support ticket created and emailed to support@gptchartview.com." : "Support ticket created. Email delivery is not configured or failed.");
        form.reset();
    };

    return (
        <div className="mx-auto max-w-[1215px]">
            <div className="mb-8 text-center">
                <h2 className="text-4xl font-extrabold">Support Center</h2>
                <MutedText className="mt-3">Create support tickets and search common answers.</MutedText>
            </div>

            <div className="mb-10 grid gap-6 lg:grid-cols-[0.8fr_1fr]">
                <Panel>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4c430]/15 text-[#fcd34d]">
                        <FiMail size={28} />
                    </div>
                    <h3 className="mt-6 text-xl font-extrabold">Contact Support</h3>
                    <MutedText className="mt-2">Submit a ticket tied to your account.</MutedText>
                    <form onSubmit={submit} className="mt-6 space-y-4">
                        <input name="subject" required placeholder="Subject" className="w-full rounded-2xl border border-white/10 bg-[#101827] px-4 py-3 text-white outline-none transition-colors placeholder:text-[#64748b] focus:border-[#3457ff]" />
                        <textarea name="message" required placeholder="Describe the problem" rows={5} className="w-full rounded-2xl border border-white/10 bg-[#101827] px-4 py-3 text-white outline-none transition-colors placeholder:text-[#64748b] focus:border-[#3457ff]" />
                        <button className="w-full rounded-2xl bg-[#3457ff] px-5 py-3 font-extrabold text-white shadow-[0_14px_35px_rgba(52,87,255,0.28)]">Create ticket</button>
                    </form>
                    {message && <p className="mt-4 rounded-2xl border border-[#3457ff]/25 bg-[#3457ff]/15 p-3 text-sm font-bold text-[#bfdbfe]">{message}</p>}
                </Panel>

                <Panel>
                    <h3 className="text-lg font-extrabold">Your Tickets</h3>
                    <div className="mt-5 space-y-3">
                        {tickets.length === 0 ? (
                            <MutedText>No tickets yet.</MutedText>
                        ) : tickets.map((ticket) => (
                            <div key={ticket.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                                <div className="flex items-center justify-between gap-4">
                                    <strong>{ticket.subject}</strong>
                                    <span className="rounded-full bg-[#16a34a]/20 px-3 py-1 text-xs font-bold text-[#86efac] ring-1 ring-[#4ade80]/20">{ticket.status}</span>
                                </div>
                                <p className="mt-2 text-sm text-[#94a3b8]">{ticket.message}</p>
                                <p className="mt-2 text-xs text-[#94a3b8]">{new Date(ticket.createdAt).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </Panel>
            </div>

            <Panel>
                <h3 className="text-lg font-extrabold">Frequently Asked Questions</h3>
                <MutedText className="mt-1">Find answers to common questions</MutedText>
                <div className="mt-3 flex items-center rounded-2xl border border-white/10 bg-[#101827] px-4">
                    <FiSearch className="text-[#94a3b8]" />
                    <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent px-3 py-3 text-white outline-none placeholder:text-[#64748b]" placeholder="Search FAQ..." />
                </div>
                <div className="mt-7 divide-y divide-white/10">
                    {filteredQuestions.map((question) => (
                        <button key={question} className="flex w-full items-center justify-between py-5 text-left font-bold text-[#cbd5e1]">
                            {question}
                            <FiChevronDown className="text-[#94a3b8]" />
                        </button>
                    ))}
                </div>
            </Panel>
        </div>
    );
};

export default SupportPage;
