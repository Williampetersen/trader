"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FiArrowRight, FiBarChart2, FiCheckCircle, FiLock, FiUploadCloud } from "react-icons/fi";

const LoginPage = () => {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        const form = new FormData(event.currentTarget);
        const response = await fetch("/api/auth/login", {
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
        router.push("/dashboard");
        router.refresh();
    };

    return (
        <main className="min-h-screen bg-[#f5f7fb] px-5 py-8">
            <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-[#dde4ef] bg-white shadow-2xl shadow-slate-200/70 lg:grid-cols-[1.05fr_0.95fr]">
                <section className="relative hidden bg-[#101828] p-10 text-white lg:block">
                    <Link href="/" className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-black"><FiBarChart2 /></span>
                        <span className="text-xl font-extrabold">GPT Chart View</span>
                    </Link>
                    <div className="mt-20">
                        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">Member workspace</p>
                        <h1 className="mt-4 max-w-lg text-5xl font-extrabold leading-tight">Continue your private chart review flow.</h1>
                        <p className="mt-5 max-w-lg text-[#d0d5dd]">Sign in to access saved uploads, AI analysis, chat, billing, profile, and outcome tracking tied to your account.</p>
                    </div>
                    <div className="mt-12 grid gap-4">
                        <PreviewRow icon={<FiUploadCloud />} title="Upload charts" text="Run a new chart through your private account credits." />
                        <PreviewRow icon={<FiCheckCircle />} title="Track outcomes" text="Mark analyses as won, lost, or not taken." />
                        <PreviewRow icon={<FiLock />} title="Protected records" text="Dashboard data is scoped to the signed-in user." />
                    </div>
                    <div className="absolute bottom-10 left-10 right-10 rounded-2xl bg-white/10 p-5">
                        <p className="text-sm text-[#d0d5dd]">Latest workflow</p>
                        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                            <Metric label="Score" value="82" />
                            <Metric label="Risk" value="1:2.4" />
                            <Metric label="Credits" value="2" />
                        </div>
                    </div>
                </section>

                <section className="flex items-center p-6 sm:p-10">
                    <div className="mx-auto w-full max-w-md">
                        <Link href="/" className="mb-8 flex items-center gap-3 lg:hidden">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#304fff] text-white"><FiBarChart2 /></span>
                            <span className="text-xl font-extrabold">GPT Chart View</span>
                        </Link>
                        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#304fff]">Welcome back</p>
                        <h2 className="mt-3 text-4xl font-extrabold">Log in</h2>
                        <p className="mt-3 text-[#667085]">Access your live dashboard and continue from your saved analysis history.</p>

                        <form onSubmit={submit} className="mt-8 space-y-5">
                            <label className="block">
                                <span className="font-bold">Email</span>
                                <input name="email" type="email" required className="mt-2 w-full rounded-xl border border-[#dde4ef] bg-[#f9fafb] px-4 py-3 outline-none transition-colors focus:border-[#304fff] focus:bg-white" />
                            </label>
                            <label className="block">
                                <span className="font-bold">Password</span>
                                <input name="password" type="password" required className="mt-2 w-full rounded-xl border border-[#dde4ef] bg-[#f9fafb] px-4 py-3 outline-none transition-colors focus:border-[#304fff] focus:bg-white" />
                            </label>
                            {error && <p className="rounded-xl bg-[#fef3f2] p-3 text-sm font-bold text-[#d92d20]">{error}</p>}
                            <button disabled={loading} className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#304fff] px-5 py-4 font-extrabold text-white transition-colors hover:bg-[#243cc7] disabled:opacity-60">
                                {loading ? "Signing in..." : "Enter dashboard"}
                                {!loading && <FiArrowRight />}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-[#667085]">
                            No account yet? <Link href="/signup" className="font-bold text-[#304fff]">Create one and start free</Link>
                        </p>
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
            <h2 className="font-extrabold">{title}</h2>
            <p className="text-sm text-[#d0d5dd]">{text}</p>
        </div>
    </div>
);

const Metric = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-xl bg-white p-3 text-[#101828]">
        <p className="text-xs text-[#667085]">{label}</p>
        <p className="font-extrabold">{value}</p>
    </div>
);

export default LoginPage;
