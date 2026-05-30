"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FiArrowRight, FiBarChart2, FiCheckCircle, FiLock, FiUploadCloud } from "react-icons/fi";
import { getPlanConfig } from "@/data/plans";

const trialPlan = getPlanConfig("Trial");

const SignupPage = () => {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        const form = new FormData(event.currentTarget);
        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: form.get("name"),
                email: form.get("email"),
                password: form.get("password"),
            }),
        });
        const data = await response.json();
        setLoading(false);
        if (!response.ok) {
            setError(data.error || "Unable to create account.");
            return;
        }
        router.push("/dashboard");
        router.refresh();
    };

    return (
        <main className="min-h-screen bg-[#f5f7fb] px-5 py-8">
            <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-[#dde4ef] bg-white shadow-2xl shadow-slate-200/70 lg:grid-cols-[0.95fr_1.05fr]">
                <section className="flex items-center p-6 sm:p-10">
                    <div className="mx-auto w-full max-w-md">
                        <Link href="/" className="mb-8 flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#304fff] text-white"><FiBarChart2 /></span>
                            <span className="text-xl font-extrabold">GPT Chart View</span>
                        </Link>
                        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#304fff]">Start member access</p>
                        <h1 className="mt-3 text-4xl font-extrabold">Create your account</h1>
                        <p className="mt-3 text-[#667085]">Signup creates your private dashboard, {trialPlan.dailyLimit} trial credits, and saved analysis history.</p>

                        <form onSubmit={submit} className="mt-8 space-y-5">
                            <label className="block">
                                <span className="font-bold">Name</span>
                                <input name="name" required className="mt-2 w-full rounded-xl border border-[#dde4ef] bg-[#f9fafb] px-4 py-3 outline-none transition-colors focus:border-[#304fff] focus:bg-white" />
                            </label>
                            <label className="block">
                                <span className="font-bold">Email</span>
                                <input name="email" type="email" required className="mt-2 w-full rounded-xl border border-[#dde4ef] bg-[#f9fafb] px-4 py-3 outline-none transition-colors focus:border-[#304fff] focus:bg-white" />
                            </label>
                            <label className="block">
                                <span className="font-bold">Password</span>
                                <input name="password" type="password" minLength={8} required className="mt-2 w-full rounded-xl border border-[#dde4ef] bg-[#f9fafb] px-4 py-3 outline-none transition-colors focus:border-[#304fff] focus:bg-white" />
                            </label>
                            {error && <p className="rounded-xl bg-[#fef3f2] p-3 text-sm font-bold text-[#d92d20]">{error}</p>}
                            <button disabled={loading} className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#304fff] px-5 py-4 font-extrabold text-white transition-colors hover:bg-[#243cc7] disabled:opacity-60">
                                {loading ? "Creating account..." : "Create account and enter"}
                                {!loading && <FiArrowRight />}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-[#667085]">
                            Already joined? <Link href="/login" className="font-bold text-[#304fff]">Log in</Link>
                        </p>
                    </div>
                </section>

                <section className="relative hidden bg-[#101828] p-10 text-white lg:block">
                    <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">What unlocks after signup</p>
                    <h2 className="mt-4 max-w-lg text-5xl font-extrabold leading-tight">Your dashboard becomes real immediately.</h2>
                    <p className="mt-5 max-w-lg text-[#d0d5dd]">The account is not a fake demo. Your uploads, AI results, chat messages, profile, billing records, and outcomes are stored per user.</p>

                    <div className="mt-12 grid gap-4">
                        <PreviewRow icon={<FiCheckCircle />} title="Trial credits" text={`Start with ${trialPlan.dailyLimit} private chart analysis credits for ${trialPlan.durationLabel.toLowerCase()}.`} />
                        <PreviewRow icon={<FiUploadCloud />} title="Real uploads" text="Upload a chart image and generate a saved result page." />
                        <PreviewRow icon={<FiLock />} title="Protected session" text="The dashboard redirects guests to login." />
                    </div>

                    <div className="absolute bottom-10 left-10 right-10 rounded-2xl bg-primary p-6 text-[#101828]">
                        <h3 className="text-2xl font-extrabold">Required next step</h3>
                        <p className="mt-2 text-sm">Create the account, then upload your first chart from the member dashboard.</p>
                    </div>
                </section>
            </div>
        </main>
    );
};

const PreviewRow = ({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) => (
    <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-black">{icon}</div>
        <div>
            <h3 className="font-extrabold">{title}</h3>
            <p className="text-sm text-[#d0d5dd]">{text}</p>
        </div>
    </div>
);

export default SignupPage;
