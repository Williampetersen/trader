"use client";

import { FormEvent, useState } from "react";
import { FiArrowRight, FiCheckCircle, FiMail, FiMessageSquare, FiUser } from "react-icons/fi";

const ContactForm = () => {
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [message, setMessage] = useState("");

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        setStatus("sending");
        setMessage("");

        const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: formData.get("name"),
                email: formData.get("email"),
                subject: formData.get("subject"),
                message: formData.get("message"),
                website: formData.get("website"),
            }),
        });
        const data = await response.json();

        if (!response.ok) {
            setStatus("error");
            setMessage(data.error || "Unable to send your message.");
            return;
        }

        form.reset();
        setStatus("sent");
        setMessage("Message sent. We also sent a confirmation email to you.");
    };

    return (
        <form onSubmit={submit} className="rounded-[28px] bg-white p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)] ring-1 ring-black/[0.06] md:p-7">
            <div className="grid gap-4 md:grid-cols-2">
                <Field icon={<FiUser />} label="Name" name="name" placeholder="Your name" autoComplete="name" />
                <Field icon={<FiMail />} label="Email" name="email" placeholder="you@example.com" type="email" autoComplete="email" />
            </div>

            <label className="mt-4 block">
                <span className="text-sm font-semibold text-ink">Subject</span>
                <input name="subject" required maxLength={160} placeholder="Billing, account, upload, or partnership" className="mt-2 w-full rounded-xl border border-black/[0.08] bg-canvas px-4 py-3 text-ink outline-none transition-colors placeholder:text-subtle focus:border-accent focus:bg-white" />
            </label>

            <label className="mt-4 block">
                <span className="text-sm font-semibold text-ink">Message</span>
                <textarea name="message" required maxLength={4000} rows={7} placeholder="Tell us what you need help with." className="mt-2 w-full resize-none rounded-xl border border-black/[0.08] bg-canvas px-4 py-3 text-ink outline-none transition-colors placeholder:text-subtle focus:border-accent focus:bg-white" />
            </label>

            <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            {message && (
                <div className={`mt-5 rounded-2xl p-4 text-sm font-semibold ${status === "sent" ? "bg-[#ecfdf3] text-[#067647]" : "bg-[#fff1ef] text-[#b42318]"}`}>
                    {message}
                </div>
            )}

            <button disabled={status === "sending"} className="mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-accent px-5 py-4 font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60">
                {status === "sending" ? "Sending..." : "Send message"}
                {status === "sent" ? <FiCheckCircle /> : <FiArrowRight />}
            </button>

            <p className="mt-4 flex items-center justify-center gap-2 text-center text-sm font-semibold text-muted">
                <FiMessageSquare />
                Replies come from support@gptchartview.com
            </p>
        </form>
    );
};

const Field = ({ label, name, placeholder, icon, type = "text", autoComplete }: { label: string; name: string; placeholder: string; icon: React.ReactNode; type?: string; autoComplete?: string }) => (
    <label className="block">
        <span className="text-sm font-semibold text-ink">{label}</span>
        <div className="mt-2 flex items-center rounded-xl border border-black/[0.08] bg-canvas px-4 transition-colors focus-within:border-accent focus-within:bg-white">
            <span className="text-muted">{icon}</span>
            <input name={name} type={type} required maxLength={name === "email" ? 160 : 100} placeholder={placeholder} autoComplete={autoComplete} className="w-full bg-transparent px-3 py-3 text-ink outline-none placeholder:text-subtle" />
        </div>
    </label>
);

export default ContactForm;
