"use client";

import clsx from "clsx";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { FiChevronDown, FiMail, FiSearch } from "react-icons/fi";
import { Badge, IconTile, MutedText, Notice, Panel, PanelHeader, PrimaryButton, inputClass } from "@/components/dashboard/DashboardUi";

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
        <div className="mx-auto max-w-[1215px] space-y-6">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1fr]">
                <Panel>
                    <div className="flex items-start gap-4">
                        <IconTile tone="yellow"><FiMail /></IconTile>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Contact Support</h3>
                            <MutedText className="text-sm">Submit a ticket tied to your account.</MutedText>
                        </div>
                    </div>
                    <form onSubmit={submit} className="mt-6 space-y-4">
                        <input name="subject" required placeholder="Subject" className={inputClass} />
                        <textarea name="message" required placeholder="Describe the problem" rows={5} className={inputClass} />
                        <PrimaryButton className="w-full py-3">Create ticket</PrimaryButton>
                    </form>
                    {message && <Notice className="mt-4">{message}</Notice>}
                </Panel>

                <Panel>
                    <PanelHeader title="Your Tickets" description={`${tickets.length} ticket${tickets.length === 1 ? "" : "s"} on your account`} />
                    <div className="mt-5 space-y-3">
                        {tickets.length === 0 ? (
                            <MutedText className="py-8 text-center">No tickets yet.</MutedText>
                        ) : tickets.map((ticket) => (
                            <div key={ticket.id} className="rounded-xl border border-slate-200/80 p-4">
                                <div className="flex items-center justify-between gap-4">
                                    <strong className="text-slate-800">{ticket.subject}</strong>
                                    <Badge tone={ticket.status === "Open" ? "amber" : "green"}>{ticket.status}</Badge>
                                </div>
                                <p className="mt-2 text-sm text-slate-600">{ticket.message}</p>
                                <p className="mt-2 text-xs text-slate-400">{new Date(ticket.createdAt).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </Panel>
            </div>

            <Panel>
                <PanelHeader title="Frequently Asked Questions" description="Find answers to common questions" />
                <div className="relative mt-4">
                    <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={query} onChange={(event) => setQuery(event.target.value)} className={clsx(inputClass, "pl-10")} placeholder="Search FAQ..." />
                </div>
                <div className="mt-4 divide-y divide-slate-100">
                    {filteredQuestions.map((question) => (
                        <button key={question} className="flex w-full items-center justify-between py-4 text-left font-medium text-slate-700 hover:text-[#3457ff]">
                            {question}
                            <FiChevronDown className="text-slate-400" />
                        </button>
                    ))}
                </div>
            </Panel>
        </div>
    );
};

export default SupportPage;
