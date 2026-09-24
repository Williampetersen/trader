"use client";

import clsx from "clsx";
import { FormEvent, useEffect, useState } from "react";
import { FiMessageSquare, FiSend } from "react-icons/fi";
import { IconTile, Panel, PrimaryButton, inputClass } from "@/components/dashboard/DashboardUi";

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
            <Panel className="flex min-h-[640px] flex-col p-0">
                <div className="flex items-center gap-4 border-b border-slate-100 p-5">
                    <IconTile tone="blue"><FiMessageSquare /></IconTile>
                    <div>
                        <h2 className="font-bold text-slate-800">GPT Chart View AI</h2>
                        <p className="text-sm text-slate-500">Ask follow-up questions about your saved chart analysis and trading plan.</p>
                    </div>
                </div>

                <div className="max-h-[480px] flex-1 space-y-4 overflow-y-auto bg-slate-50/60 p-5">
                    {messages.length === 0 && (
                        <div className="mr-auto max-w-[85%] rounded-xl rounded-tl-sm border border-slate-200/80 bg-white p-4 shadow-sm">
                            <p className="text-sm font-bold text-slate-800">GPT Chart View AI</p>
                            <p className="mt-1 text-slate-600">Upload a chart or ask about trend, support, resistance, entry quality, invalidation, and risk management.</p>
                        </div>
                    )}
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={clsx(
                                "rounded-xl p-4",
                                message.role === "user"
                                    ? "ml-auto max-w-[80%] rounded-tr-sm bg-gradient-to-tr from-[#3457ff] to-[#5a7bff] text-white shadow-md shadow-[#3457ff]/20"
                                    : "mr-auto max-w-[85%] rounded-tl-sm border border-slate-200/80 bg-white text-slate-700 shadow-sm"
                            )}
                        >
                            <p className={clsx("text-xs font-bold", message.role === "user" ? "text-white/80" : "text-slate-800")}>{message.role === "user" ? "You" : "GPT Chart View AI"}</p>
                            <p className="mt-1 whitespace-pre-wrap">{message.content}</p>
                        </div>
                    ))}
                </div>

                <form onSubmit={submit} className="flex gap-3 border-t border-slate-100 p-5">
                    <input name="content" required className={clsx(inputClass, "flex-1")} placeholder="Ask about a setup..." />
                    <PrimaryButton disabled={loading} aria-label="Send message">{loading ? "..." : <FiSend />}</PrimaryButton>
                </form>
            </Panel>
        </div>
    );
};

export default ChatPage;
