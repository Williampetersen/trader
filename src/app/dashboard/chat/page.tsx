"use client";

import { FormEvent, useEffect, useState } from "react";
import { FiMessageSquare, FiSend } from "react-icons/fi";
import { MutedText, Panel, PrimaryButton } from "@/components/dashboard/DashboardUi";

interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: string;
}

const ChatPage = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("/api/chat")
            .then((response) => response.json())
            .then((data) => setMessages(data.messages || []));
    }, []);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const input = new FormData(form).get("content");
        setLoading(true);
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: input }),
        });
        const data = await response.json();
        setMessages((current) => [...current, ...(data.messages || [])]);
        setLoading(false);
        form.reset();
    };

    return (
        <div className="mx-auto max-w-[980px]">
            <div className="mb-8 text-center">
                <h2 className="text-4xl font-extrabold">Chat with our AI</h2>
                <MutedText className="mt-3">Ask follow-up questions about your saved chart analysis and trading plan.</MutedText>
            </div>
            <Panel className="min-h-[620px]">
                <div className="max-h-[460px] space-y-4 overflow-y-auto pr-2">
                    {messages.length === 0 && (
                        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3457ff] text-white"><FiMessageSquare /></div>
                                <div>
                                    <strong>GPT Chart View AI</strong>
                                    <p className="mt-2 text-[#94a3b8]">Upload a chart or ask about trend, support, resistance, entry quality, invalidation, and risk management.</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {messages.map((message) => (
                        <div key={message.id} className={`rounded-2xl p-4 ${message.role === "user" ? "ml-auto max-w-[80%] bg-[#3457ff] text-white shadow-[0_14px_28px_rgba(52,87,255,0.18)]" : "mr-auto max-w-[85%] border border-white/10 bg-white/[0.04]"}`}>
                            <p className="text-sm font-bold">{message.role === "user" ? "You" : "GPT Chart View AI"}</p>
                            <p className="mt-1">{message.content}</p>
                        </div>
                    ))}
                </div>
                <form onSubmit={submit} className="mt-8 flex gap-3">
                    <input name="content" required className="flex-1 rounded-2xl border border-white/10 bg-[#101827] px-4 py-3 text-white outline-none transition-colors placeholder:text-[#64748b] focus:border-[#3457ff]" placeholder="Ask about a setup..." />
                    <PrimaryButton>{loading ? "..." : <FiSend />}</PrimaryButton>
                </form>
            </Panel>
        </div>
    );
};

export default ChatPage;
