"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FiArrowRight, FiCheckCircle, FiLock, FiShield, FiUploadCloud } from "react-icons/fi";
import { getPlanConfig } from "@/data/plans";

const trialPlan = getPlanConfig("Trial");

type ApiResponse = { error?: string };

const readApiResponse = async (response: Response): Promise<ApiResponse> => {
    const text = await response.text();
    if (!text) return {};
    try {
        return JSON.parse(text) as ApiResponse;
    } catch {
        return {};
    }
};

const SignupPage = () => {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        const form = new FormData(event.currentTarget);

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.get("name"),
                    email: form.get("email"),
                    password: form.get("password"),
                }),
            });
            const data = await readApiResponse(response);

            if (!response.ok) {
                setError(data.error || "Unable to create account. Please try again.");
                return;
            }

            router.push("/dashboard");
            router.refresh();
        } catch {
            setError("Network error. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#05070f] px-5 py-6 text-white">
            <video className="absolute inset-0 h-full w-full object-cover opacity-42" autoPlay muted loop playsInline preload="metadata" aria-label="AI market background">
                <source src="/video/gptchartview2.webm" type="video/webm" />
            </video>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,15,0.35),#05070f_78%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(22,199,255,0.18),transparent_35%)]" />

            <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
                <header className="flex items-center justify-between py-4">
                    <Link href="/" className="flex items-center">
                        <Image src="/logo.png" alt="GPT Chart View logo" width={180} height={52} className="h-12 w-auto object-contain" priority />
                    </Link>
                    <Link href="/login" className="rounded-lg border border-white/10 bg-white/[0.07] px-4 py-3 text-sm font-extrabold text-white/82 hover:bg-white/12">
                        Log in
                    </Link>
                </header>

                <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[0.92fr_1.08fr]">
                    <section className="rounded-lg border border-white/10 bg-[#090d18]/88 p-6 shadow-[0_0_70px_rgba(217,76,255,0.12)] backdrop-blur md:p-8">
                        <p className="text-sm font-extrabold uppercase text-[#16c7ff]">Start member access</p>
                        <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">Create your AI trading workspace.</h1>
                        <p className="mt-4 leading-8 text-white/62">
                            Signup creates your private dashboard, {trialPlan.allowanceLabel}, and saved chart analysis history.
                        </p>

                        <form onSubmit={submit} className="mt-8 space-y-5">
                            <label className="block">
                                <span className="font-bold text-white/86">Name</span>
                                <input name="name" required className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 py-4 text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#16c7ff] focus:bg-white/[0.09]" />
                            </label>
                            <label className="block">
                                <span className="font-bold text-white/86">Email</span>
                                <input name="email" type="email" required className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 py-4 text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#16c7ff] focus:bg-white/[0.09]" />
                            </label>
                            <label className="block">
                                <span className="font-bold text-white/86">Password</span>
                                <input name="password" type="password" minLength={8} required className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 py-4 text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#16c7ff] focus:bg-white/[0.09]" />
                            </label>
                            {error && <p className="rounded-lg border border-[#ff5c5c]/25 bg-[#ff5c5c]/12 p-3 text-sm font-bold text-[#ffb4b4]">{error}</p>}
                            <button disabled={loading} className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#16c7ff] px-5 py-4 font-extrabold text-[#03111a] transition-colors hover:bg-white disabled:opacity-60">
                                {loading ? "Creating account..." : "Create account and enter"}
                                {!loading && <FiArrowRight />}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-white/55">
                            Already joined? <Link href="/login" className="font-extrabold text-[#16c7ff]">Log in</Link>
                        </p>
                    </section>

                    <section className="hidden lg:block">
                        <div className="rounded-lg border border-white/10 bg-white/[0.045] p-8 backdrop-blur">
                            <p className="text-sm font-extrabold uppercase text-[#d94cff]">What unlocks after signup</p>
                            <h2 className="mt-4 text-5xl font-extrabold leading-tight">
                                Your dashboard becomes useful immediately.
                            </h2>
                            <p className="mt-5 leading-8 text-white/62">
                                Your uploads, AI results, chat messages, profile, billing records, and outcomes are tied to the signed-in user.
                            </p>

                            <div className="mt-10 grid gap-4">
                                <PreviewRow icon={<FiCheckCircle />} title="Trial credits" text={`Start with ${trialPlan.allowanceLabel}.`} />
                                <PreviewRow icon={<FiUploadCloud />} title="Real uploads" text="Upload a chart image and generate a saved result page." />
                                <PreviewRow icon={<FiLock />} title="Protected session" text="Guests are redirected to login before dashboard access." />
                            </div>

                            <div className="mt-8 rounded-lg border border-[#21e7a4]/20 bg-[#21e7a4]/10 p-5">
                                <div className="flex items-center gap-3">
                                    <FiShield className="text-[#21e7a4]" />
                                    <h3 className="font-extrabold">Server-side security</h3>
                                </div>
                                <p className="mt-2 text-sm leading-6 text-white/62">API keys stay server-side. The account only receives its own saved data and plan credits.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

const PreviewRow = ({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) => (
    <div className="flex gap-4 rounded-lg border border-white/10 bg-[#05070f]/60 p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#21e7a4]">{icon}</div>
        <div>
            <h3 className="font-extrabold">{title}</h3>
            <p className="text-sm leading-6 text-white/55">{text}</p>
        </div>
    </div>
);

export default SignupPage;
