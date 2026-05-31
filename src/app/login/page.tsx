"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FiArrowRight, FiLock, FiMessageSquare, FiUploadCloud } from "react-icons/fi";

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

const LoginPage = () => {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        const form = new FormData(event.currentTarget);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: form.get("email"),
                    password: form.get("password"),
                }),
            });
            const data = await readApiResponse(response);

            if (!response.ok) {
                setError(data.error || "Unable to sign in. Please try again.");
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
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(217,76,255,0.22),transparent_36%)]" />

            <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
                <header className="flex items-center justify-between py-4">
                    <Link href="/" className="flex items-center">
                        <Image src="/logo.png" alt="GPT Chart View logo" width={180} height={52} className="h-12 w-auto object-contain" priority />
                    </Link>
                    <Link href="/signup" className="rounded-lg border border-white/10 bg-white/[0.07] px-4 py-3 text-sm font-extrabold text-white/82 hover:bg-white/12">
                        Create account
                    </Link>
                </header>

                <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[0.9fr_1.1fr]">
                    <section className="rounded-lg border border-white/10 bg-[#090d18]/88 p-6 shadow-[0_0_70px_rgba(22,199,255,0.12)] backdrop-blur md:p-8">
                        <p className="text-sm font-extrabold uppercase text-[#16c7ff]">Member access</p>
                        <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">Continue your AI chart review flow.</h1>
                        <p className="mt-4 leading-8 text-white/62">
                            Sign in to access saved uploads, AI analysis, chat, billing, profile, and outcome tracking tied to your account.
                        </p>

                        <form onSubmit={submit} className="mt-8 space-y-5">
                            <label className="block">
                                <span className="font-bold text-white/86">Email</span>
                                <input name="email" type="email" required className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 py-4 text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#16c7ff] focus:bg-white/[0.09]" />
                            </label>
                            <label className="block">
                                <span className="font-bold text-white/86">Password</span>
                                <input name="password" type="password" required className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 py-4 text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#16c7ff] focus:bg-white/[0.09]" />
                            </label>
                            {error && <p className="rounded-lg border border-[#ff5c5c]/25 bg-[#ff5c5c]/12 p-3 text-sm font-bold text-[#ffb4b4]">{error}</p>}
                            <button disabled={loading} className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#16c7ff] px-5 py-4 font-extrabold text-[#03111a] transition-colors hover:bg-white disabled:opacity-60">
                                {loading ? "Signing in..." : "Enter dashboard"}
                                {!loading && <FiArrowRight />}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-white/55">
                            No account yet? <Link href="/signup" className="font-extrabold text-[#16c7ff]">Start with 3 free analyses</Link>
                        </p>
                    </section>

                    <section className="hidden lg:block">
                        <div className="rounded-lg border border-white/10 bg-white/[0.045] p-8 backdrop-blur">
                            <p className="text-sm font-extrabold uppercase text-[#d94cff]">Private trading workspace</p>
                            <h2 className="mt-4 text-5xl font-extrabold leading-tight">
                                Your market notes stay synced to your account.
                            </h2>
                            <div className="mt-10 grid gap-4">
                                <PreviewRow icon={<FiUploadCloud />} title="Upload charts" text="Run new chart screenshots through your private account credits." />
                                <PreviewRow icon={<FiMessageSquare />} title="Ask follow-up questions" text="Use chat to clarify structure, risk, and setup quality." />
                                <PreviewRow icon={<FiLock />} title="Protected records" text="Dashboard data is scoped to the signed-in user." />
                            </div>
                            <div className="mt-8 grid grid-cols-3 gap-3">
                                <Metric label="Trial" value="3" />
                                <Metric label="Score" value="AI" />
                                <Metric label="History" value="Saved" />
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

const Metric = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
        <p className="text-xs font-bold uppercase text-white/42">{label}</p>
        <p className="mt-1 text-2xl font-extrabold">{value}</p>
    </div>
);

export default LoginPage;
