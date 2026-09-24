"use client";

import { useRouter } from "next/navigation";
import { ClipboardEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiCheck, FiLock, FiMail } from "react-icons/fi";
import AuthLayout, { AnalysisPreview, AsideBullets, AuthCard, Steps } from "./AuthLayout";

type Mode = "login" | "signup";
type ApiResponse = {
    ok?: boolean;
    error?: string;
    email?: string;
    resendAfterSeconds?: number;
};

const copy = {
    login: {
        eyebrow: "Secure member access",
        title: "Sign in to your account",
        body: "Enter your email and we will send you a 6-digit sign-in code.",
        submit: "Send sign-in code",
        switchText: "No account yet?",
        switchLink: "Sign up free",
        switchHref: "/signup",
    },
    signup: {
        eyebrow: "Create free account",
        title: "Start analyzing charts for free",
        body: "Enter your email to get a verification code. Your account is ready in under a minute.",
        submit: "Create free account",
        switchText: "Already have an account?",
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

    const isSignup = mode === "signup";

    return (
        <AuthLayout
            topLink={{ href: text.switchHref, label: text.switchLink, prompt: text.switchText }}
            aside={isSignup ? <SignupAside /> : <LoginAside />}
        >
            <AuthCard>
                {isSignup && <Steps steps={["Email", "Verify", "Profile"]} current={step === "email" ? 0 : 1} />}

                {step === "email" ? (
                    <>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#3457ff]">{text.eyebrow}</p>
                        <h1 className="mt-2 text-2xl font-bold text-slate-800 sm:text-3xl">{text.title}</h1>
                        <p className="mt-2 text-sm leading-6 text-slate-500">{text.body}</p>

                        {isSignup && (
                            <div className="mt-5 flex flex-wrap gap-2">
                                {["3 free analyses", "No credit card", "No time limit"].map((item) => (
                                    <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                                        <FiCheck className="h-3 w-3" /> {item}
                                    </span>
                                ))}
                            </div>
                        )}

                        <form onSubmit={requestCode} className="mt-6 space-y-4">
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700">Email address</span>
                                <div className="relative mt-1.5">
                                    <FiMail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        className="auth-input w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-3.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#3457ff] focus:ring-2 focus:ring-[#3457ff]/15"
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        autoFocus
                                    />
                                </div>
                            </label>
                            {error && <ErrorNotice>{error}</ErrorNotice>}
                            <button disabled={loading} className={primaryButtonClass}>
                                {loading ? "Sending code..." : text.submit}
                                {!loading && <FiArrowRight />}
                            </button>
                        </form>

                        <p className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
                            <FiLock /> No password needed. We email you a secure one-time code.
                        </p>
                    </>
                ) : (
                    <>
                        <button onClick={() => setStep("email")} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800">
                            <FiArrowLeft /> Change email
                        </button>
                        <div className="mt-5 grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-xl text-[#3457ff]">
                            <FiMail />
                        </div>
                        <h1 className="mt-4 text-2xl font-bold text-slate-800 sm:text-3xl">Check your email</h1>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Enter the 6-digit code we sent to <strong className="text-slate-800">{email.trim().toLowerCase()}</strong>. It is valid for 15 minutes.
                        </p>

                        <form onSubmit={verifyCode} className="mt-6 space-y-5">
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
                                        aria-label={`Digit ${index + 1}`}
                                        className="auth-input h-14 w-full rounded-lg border border-slate-300 bg-white text-center text-2xl font-bold text-slate-800 outline-none transition focus:border-[#3457ff] focus:ring-2 focus:ring-[#3457ff]/15"
                                    />
                                ))}
                            </div>

                            {message && <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">{message}</p>}
                            {error && <ErrorNotice>{error}</ErrorNotice>}

                            <button disabled={loading || code.length !== 6} className={primaryButtonClass}>
                                {loading ? "Verifying..." : isSignup ? "Verify and create account" : "Verify and sign in"}
                                {!loading && <FiArrowRight />}
                            </button>
                        </form>

                        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm">
                            <span className="text-slate-500">Didn&apos;t get it? Check spam, or</span>
                            <button
                                disabled={loading || resendSeconds > 0}
                                onClick={() => requestCode()}
                                className="font-bold text-[#3457ff] hover:underline disabled:text-slate-400 disabled:no-underline"
                            >
                                {resendSeconds > 0 ? `resend in ${resendSeconds}s` : "resend code"}
                            </button>
                        </div>
                    </>
                )}
            </AuthCard>
        </AuthLayout>
    );
};

const primaryButtonClass = "flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-tr from-[#3457ff] to-[#5a7bff] px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-md shadow-[#3457ff]/25 transition-all hover:shadow-lg hover:shadow-[#3457ff]/40 disabled:pointer-events-none disabled:opacity-50";

const ErrorNotice = ({ children }: React.PropsWithChildren) => (
    <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{children}</p>
);

const SignupAside = () => (
    <>
        <p className="text-sm font-bold uppercase tracking-wider text-white/70">Start free today</p>
        <h2 className="mt-3 max-w-lg text-4xl font-bold leading-tight xl:text-5xl">Get 3 free AI chart analyses.</h2>
        <p className="mt-4 max-w-lg text-white/80">Upload a chart screenshot and get a structured read with entry, stop-loss and take-profit levels plus a risk/reward score in seconds.</p>
        <div className="mt-8 max-w-md"><AnalysisPreview /></div>
        <AsideBullets items={["Entry, SL, TP1 and TP2 levels", "Trend, support and resistance", "Chat with AI about your setup", "Private history of every analysis"]} />
    </>
);

const LoginAside = () => (
    <>
        <p className="text-sm font-bold uppercase tracking-wider text-white/70">Welcome back</p>
        <h2 className="mt-3 max-w-lg text-4xl font-bold leading-tight xl:text-5xl">Your trading review desk is ready.</h2>
        <p className="mt-4 max-w-lg text-white/80">Pick up where you left off: upload a new chart, review past analyses, and track which setups actually worked.</p>
        <div className="mt-8 max-w-md"><AnalysisPreview /></div>
        <AsideBullets items={["Saved analysis history", "Won / lost trade tracking", "AI follow-up chat", "Secure passwordless login"]} />
    </>
);

export default EmailOtpAccess;
