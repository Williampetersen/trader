"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipboardEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiMail, FiShield } from "react-icons/fi";

type Mode = "login" | "signup";
type ApiResponse = {
    ok?: boolean;
    error?: string;
    email?: string;
    resendAfterSeconds?: number;
};

const copy = {
    login: {
        topLinkHref: "/signup",
        topLink: "Create account",
        eyebrow: "Secure member access",
        title: "Sign in with your email code.",
        body: "Enter your email and we will send a 6-digit verification code. No password is required.",
        submit: "Send verification code",
        switchText: "No account yet?",
        switchLink: "Start with 3 free analyses",
        switchHref: "/signup",
    },
    signup: {
        topLinkHref: "/login",
        topLink: "Log in",
        eyebrow: "Start member access",
        title: "Create your account by email.",
        body: "Use your email to receive a secure verification code, then complete your trading profile inside the dashboard.",
        submit: "Send verification code",
        switchText: "Already joined?",
        switchLink: "Log in",
        switchHref: "/login",
    },
};

const readApiResponse = async (response: Response): Promise<ApiResponse> => {
    const text = await response.text();
    if (!text) return {};
    try {
        return JSON.parse(text) as ApiResponse;
    } catch {
        return {};
    }
};

const EmailOtpAccess = ({ mode }: { mode: Mode }) => {
    const router = useRouter();
    const text = copy[mode];
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [step, setStep] = useState<"email" | "code">("email");
    const [email, setEmail] = useState("");
    const [digits, setDigits] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendSeconds, setResendSeconds] = useState(0);

    const code = digits.join("");

    useEffect(() => {
        if (resendSeconds <= 0) return;
        const timer = window.setTimeout(() => setResendSeconds((current) => Math.max(0, current - 1)), 1000);
        return () => window.clearTimeout(timer);
    }, [resendSeconds]);

    const requestCode = async (event?: FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch("/api/auth/otp/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await readApiResponse(response);

            if (!response.ok) {
                setError(data.error || "Unable to send verification code.");
                if (data.resendAfterSeconds) setResendSeconds(data.resendAfterSeconds);
                return;
            }

            setStep("code");
            setDigits(["", "", "", "", "", ""]);
            setResendSeconds(data.resendAfterSeconds || 60);
            setMessage(`We sent a 6-digit code to ${email.trim().toLowerCase()}.`);
            window.setTimeout(() => inputRefs.current[0]?.focus(), 50);
        } catch {
            setError("Network error. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    const verifyCode = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (code.length !== 6) {
            setError("Enter the full 6-digit code.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code }),
            });
            const data = await readApiResponse(response);

            if (!response.ok) {
                setError(data.error || "Unable to verify code.");
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

    const updateDigit = (index: number, value: string) => {
        const nextValue = value.replace(/\D/g, "").slice(-1);
        setDigits((current) => {
            const next = [...current];
            next[index] = nextValue;
            return next;
        });
        setError("");
        if (nextValue && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Backspace" && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
        const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length < 2) return;
        event.preventDefault();
        const next = ["", "", "", "", "", ""];
        pasted.split("").forEach((value, index) => {
            next[index] = value;
        });
        setDigits(next);
        inputRefs.current[Math.min(pasted.length, 6) - 1]?.focus();
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#05070f] px-5 py-6 text-white">
            <video className="absolute inset-0 h-full w-full object-cover opacity-[0.14] saturate-[0.85]" autoPlay muted loop playsInline preload="metadata" aria-label="AI market background">
                <source src="/video/gptchartview2.webm" type="video/webm" />
            </video>
            <div className="absolute inset-0 bg-[#05070f]/76" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,15,0.86),rgba(5,7,15,0.96)_70%,#05070f)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(22,199,255,0.10),transparent_35%)]" />

            <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
                <header className="flex items-center justify-between py-4">
                    <Link href="/" className="flex items-center">
                        <Image src="/logo.png" alt="GPT Chart View logo" width={180} height={52} className="h-12 w-auto object-contain" priority />
                    </Link>
                    <Link href={text.topLinkHref} className="rounded-lg border border-white/10 bg-white/[0.07] px-4 py-3 text-sm font-extrabold text-white/82 hover:bg-white/12">
                        {text.topLink}
                    </Link>
                </header>

                <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[0.92fr_1.08fr]">
                    <section className="rounded-lg border border-white/10 bg-[#05070f]/94 p-6 shadow-[0_0_70px_rgba(22,199,255,0.12)] backdrop-blur md:p-8">
                        {step === "email" ? (
                            <>
                                <p className="text-sm font-extrabold uppercase text-[#16c7ff]">{text.eyebrow}</p>
                                <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">{text.title}</h1>
                                <p className="mt-4 leading-8 text-white/62">{text.body}</p>

                                <form onSubmit={requestCode} className="mt-8 space-y-5">
                                    <label className="block">
                                        <span className="font-bold text-white/86">Email</span>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(event) => setEmail(event.target.value)}
                                            className="auth-input mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 py-4 text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#16c7ff] focus:bg-white/[0.09]"
                                            placeholder="you@example.com"
                                            autoComplete="email"
                                        />
                                    </label>
                                    {error && <p role="alert" className="rounded-lg border border-[#ff5c5c]/40 bg-[#ff5c5c]/16 p-4 text-sm font-bold text-[#ffd0d0]">{error}</p>}
                                    <button disabled={loading} className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#16c7ff] px-5 py-4 font-extrabold text-[#03111a] transition-colors hover:bg-white disabled:opacity-60">
                                        {loading ? "Sending code..." : text.submit}
                                        {!loading && <FiArrowRight />}
                                    </button>
                                </form>

                                <p className="mt-6 text-center text-sm text-white/55">
                                    {text.switchText} <Link href={text.switchHref} className="font-extrabold text-[#16c7ff]">{text.switchLink}</Link>
                                </p>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setStep("email")} className="inline-flex items-center gap-2 text-sm font-extrabold text-white/58 hover:text-white">
                                    <FiArrowLeft /> Change email
                                </button>
                                <p className="mt-6 text-sm font-extrabold uppercase text-[#16c7ff]">Enter verification code</p>
                                <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">Check your email.</h1>
                                <p className="mt-4 leading-8 text-white/62">
                                    Enter the 6-digit verification code for <strong className="text-white">{email.trim().toLowerCase()}</strong>. The code is valid for 15 minutes.
                                </p>

                                <form onSubmit={verifyCode} className="mt-8 space-y-6">
                                    <div className="grid grid-cols-6 gap-2 sm:gap-3">
                                        {digits.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(element) => {
                                                    inputRefs.current[index] = element;
                                                }}
                                                value={digit}
                                                onChange={(event) => updateDigit(index, event.target.value)}
                                                onKeyDown={(event) => handleKeyDown(index, event)}
                                                onPaste={handlePaste}
                                                inputMode="numeric"
                                                autoComplete={index === 0 ? "one-time-code" : "off"}
                                                maxLength={1}
                                                className="auth-input h-14 rounded-lg border border-white/10 bg-white/[0.045] text-center text-2xl font-extrabold text-white outline-none transition-colors focus:border-[#16c7ff] focus:bg-white/[0.08] sm:h-16"
                                            />
                                        ))}
                                    </div>

                                    {message && <p className="rounded-lg border border-[#21e7a4]/25 bg-[#21e7a4]/10 p-4 text-sm font-bold text-[#b8ffe3]">{message}</p>}
                                    {error && <p role="alert" className="rounded-lg border border-[#ff5c5c]/40 bg-[#ff5c5c]/16 p-4 text-sm font-bold text-[#ffd0d0]">{error}</p>}

                                    <button disabled={loading || code.length !== 6} className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#16c7ff] px-5 py-4 font-extrabold text-[#03111a] transition-colors hover:bg-white disabled:opacity-45">
                                        {loading ? "Verifying..." : "Verify and enter dashboard"}
                                        {!loading && <FiArrowRight />}
                                    </button>
                                </form>

                                <div className="mt-6 flex flex-col items-center justify-between gap-3 text-sm sm:flex-row">
                                    <span className="text-white/52">Didn&apos;t receive a code?</span>
                                    <button
                                        disabled={loading || resendSeconds > 0}
                                        onClick={() => requestCode()}
                                        className="font-extrabold text-[#16c7ff] disabled:text-white/38"
                                    >
                                        {resendSeconds > 0 ? `Resend after ${resendSeconds}s` : "Resend code"}
                                    </button>
                                </div>
                            </>
                        )}
                    </section>

                    <section className="hidden lg:block">
                        <div className="rounded-lg border border-white/10 bg-white/[0.045] p-8 backdrop-blur">
                            <p className="text-sm font-extrabold uppercase text-[#d94cff]">Passwordless access</p>
                            <h2 className="mt-4 text-5xl font-extrabold leading-tight">
                                One code opens your private trading workspace.
                            </h2>
                            <p className="mt-5 leading-8 text-white/62">
                                The dashboard creates or finds your account by verified email, then asks for your profile details after login.
                            </p>
                            <div className="mt-10 grid gap-4">
                                <PreviewRow icon={<FiMail />} title="Email OTP" text="A 6-digit code is sent to the email address you enter." />
                                <PreviewRow icon={<FiShield />} title="Server-side security" text="Codes are hashed, expire in 15 minutes, and are never exposed to the browser." />
                                <PreviewRow icon={<FiArrowRight />} title="Dashboard profile" text="After verification, complete name, country, age group, phone, and gender." />
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

export default EmailOtpAccess;
