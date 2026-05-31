"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FiArrowRight, FiLock, FiShield } from "react-icons/fi";

const OwnerLoginPage = () => {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        const form = new FormData(event.currentTarget);
        const response = await fetch("/api/owner/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: form.get("email"),
                password: form.get("password"),
            }),
        });
        const data = await response.json();
        setLoading(false);
        if (!response.ok) {
            setError(data.error || "Unable to sign in.");
            return;
        }
        router.push("/owner");
        router.refresh();
    };

    return (
        <main className="min-h-screen bg-[#070b12] px-5 py-8 text-white">
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,87,255,0.24),transparent_34%),radial-gradient(circle_at_82%_25%,rgba(244,196,48,0.14),transparent_28%)]" />
            <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:grid-cols-[1fr_0.9fr]">
                <section className="flex items-center p-6 sm:p-10">
                    <div className="mx-auto w-full max-w-md">
                        <Link href="/" className="mb-8 flex items-center gap-3">
                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4c430] text-[#111318]"><FiShield /></span>
                            <span className="text-xl font-extrabold">GPT Chart View Owner</span>
                        </Link>
                        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#f4c430]">Private admin access</p>
                        <h1 className="mt-3 text-4xl font-extrabold">Owner dashboard login</h1>
                        <p className="mt-3 text-[#94a3b8]">View users, revenue, subscriptions, uploads, support tickets, countries, and live platform activity.</p>

                        <form onSubmit={submit} className="mt-8 space-y-5">
                            <label className="block">
                                <span className="font-bold">Owner email</span>
                                <input name="email" type="email" required className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition-colors placeholder:text-[#64748b] focus:border-[#3457ff]" placeholder="owner@gptchartview.local" />
                            </label>
                            <label className="block">
                                <span className="font-bold">Password</span>
                                <input name="password" type="password" required className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition-colors placeholder:text-[#64748b] focus:border-[#3457ff]" placeholder="Owner password" />
                            </label>
                            {error && <p className="rounded-2xl border border-[#f87171]/20 bg-[#dc2626]/15 p-3 text-sm font-bold text-[#fca5a5]">{error}</p>}
                            <button disabled={loading} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#3457ff] px-5 py-4 font-extrabold text-white shadow-[0_18px_35px_rgba(52,87,255,0.28)] transition-colors hover:bg-[#263fd2] disabled:opacity-60">
                                {loading ? "Checking access..." : "Enter owner console"}
                                {!loading && <FiArrowRight />}
                            </button>
                        </form>
                    </div>
                </section>

                <section className="hidden border-l border-white/10 bg-[#0b1018]/80 p-10 lg:block">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/[0.06] text-[#f4c430]">
                        <FiLock size={30} />
                    </div>
                    <h2 className="mt-8 max-w-md text-5xl font-extrabold leading-tight">Separate control room for the business.</h2>
                    <p className="mt-5 max-w-md text-[#94a3b8]">This is not the user app. It is a private operating dashboard for monitoring growth, payments, product usage, and support.</p>
                    <div className="mt-10 grid gap-3">
                        {["Live user status", "Revenue and MRR view", "Country and plan breakdowns", "Support ticket operations"].map((item) => (
                            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-extrabold text-[#cbd5e1]">{item}</div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default OwnerLoginPage;
