"use client";

import { FormEvent, useState } from "react";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";

const NewsletterSignup = ({ source = "blog" }: { source?: string }) => {
    const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
    const [message, setMessage] = useState("");

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        setStatus("saving");
        setMessage("");

        const response = await fetch("/api/newsletter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: formData.get("email"),
                name: formData.get("name"),
                website: formData.get("website"),
                source,
            }),
        });
        const data = await response.json();

        if (!response.ok) {
            setStatus("error");
            setMessage(data.error || "Unable to save email.");
            return;
        }

        form.reset();
        setStatus("saved");
        setMessage("Saved. We will send the AI trading checklist when it is ready.");
    };

    return (
        <form onSubmit={submit} className="rounded-[2rem] border border-[#d9e2ef] bg-white p-5 shadow-sm">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#304fff]">Free guide</p>
            <h3 className="mt-2 text-2xl font-extrabold text-[#101828]">Get the AI Trading Checklist</h3>
            <p className="mt-2 text-[#667085]">Join the GPT Chart View list for practical prompts, risk checklists, and product updates.</p>
            <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1.2fr_auto]">
                <input name="name" placeholder="Name" className="rounded-2xl border border-[#d9e2ef] bg-[#f8fafc] px-4 py-3 outline-none focus:border-[#304fff]" />
                <input name="email" type="email" required placeholder="Email address" className="rounded-2xl border border-[#d9e2ef] bg-[#f8fafc] px-4 py-3 outline-none focus:border-[#304fff]" />
                <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <button disabled={status === "saving"} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#304fff] px-5 py-3 font-extrabold text-white transition-colors hover:bg-[#243cc7] disabled:opacity-60">
                    {status === "saving" ? "Saving..." : "Send it"}
                    {status === "saved" ? <FiCheckCircle /> : <FiArrowRight />}
                </button>
            </div>
            {message && <p className={`mt-3 rounded-2xl p-3 text-sm font-bold ${status === "saved" ? "bg-[#ecfdf3] text-[#067647]" : "bg-[#fff1ef] text-[#b42318]"}`}>{message}</p>}
        </form>
    );
};

export default NewsletterSignup;
