"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FiActivity, FiArrowRight, FiCreditCard, FiHeadphones, FiLock, FiMail, FiShield, FiUsers } from "react-icons/fi";
import AuthLayout, { AuthCard } from "@/components/auth/AuthLayout";

const inputClass = "auth-input w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-3.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#3457ff] focus:ring-2 focus:ring-[#3457ff]/15";

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
        <AuthLayout asideTone="dark" aside={<OwnerAside />}>
            <AuthCard>
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-tr from-slate-900 to-slate-700 text-xl text-white shadow-md shadow-slate-900/20">
                    <FiShield />
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-500">Private admin access</p>
                <h1 className="mt-2 text-2xl font-bold text-slate-800 sm:text-3xl">Owner console login</h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">View users, revenue, subscriptions, uploads, support tickets and live platform activity.</p>

                <form onSubmit={submit} className="mt-6 space-y-4">
                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Owner email</span>
                        <div className="relative mt-1.5">
                            <FiMail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                name="email"
                                type="email"
                                required
                                autoComplete="off"
                                autoCapitalize="none"
                                spellCheck={false}
                                className={inputClass}
                                placeholder="owner@example.com"
                            />
                        </div>
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Password</span>
                        <div className="relative mt-1.5">
                            <FiLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                name="password"
                                type="password"
                                required
                                autoComplete="new-password"
                                className={inputClass}
                                placeholder="Enter owner password"
                            />
                        </div>
                    </label>
                    {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}
                    <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-tr from-slate-900 to-slate-700 px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-md shadow-slate-900/20 transition-all hover:shadow-lg hover:shadow-slate-900/30 disabled:pointer-events-none disabled:opacity-50">
                        {loading ? "Checking access..." : "Enter owner console"}
                        {!loading && <FiArrowRight />}
                    </button>
                </form>
            </AuthCard>
        </AuthLayout>
    );
};

const OwnerAside = () => (
    <>
        <p className="text-sm font-bold uppercase tracking-wider text-white/60">Owner console</p>
        <h2 className="mt-3 max-w-lg text-4xl font-bold leading-tight xl:text-5xl">The control room for your business.</h2>
        <p className="mt-4 max-w-lg text-white/70">A private dashboard for monitoring growth, payments, product usage and support. Separate from the member app.</p>
        <div className="mt-8 grid max-w-lg grid-cols-2 gap-3">
            {[
                { icon: <FiUsers />, label: "Live user status" },
                { icon: <FiCreditCard />, label: "Revenue and MRR" },
                { icon: <FiActivity />, label: "Uploads and AI usage" },
                { icon: <FiHeadphones />, label: "Support tickets" },
            ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl bg-white/10 p-4 text-sm font-medium text-white/90 ring-1 ring-inset ring-white/10">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/15">{item.icon}</span>
                    {item.label}
                </div>
            ))}
        </div>
    </>
);

export default OwnerLoginPage;
