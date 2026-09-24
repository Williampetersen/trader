import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { FiBarChart2, FiCheck } from "react-icons/fi";

interface AuthLayoutProps {
    topLink?: { href: string; label: string; prompt?: string };
    aside: React.ReactNode;
    asideTone?: "blue" | "dark";
}

const AuthLayout = ({ topLink, aside, asideTone = "blue", children }: React.PropsWithChildren<AuthLayoutProps>) => (
    <main className="app-theme min-h-screen bg-[#f5f7fb] text-base text-slate-700 lg:grid lg:grid-cols-[1fr_1fr]">
        <div className="flex min-h-screen flex-col px-5 py-6 sm:px-10">
            <header className="flex items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-tr from-[#3457ff] to-[#6b8cff] text-white shadow-md shadow-[#3457ff]/30">
                        <FiBarChart2 className="h-5 w-5" />
                    </span>
                    <span className="text-base font-bold text-slate-800">GPT Chart View</span>
                </Link>
                {topLink && (
                    <p className="text-sm text-slate-500">
                        <span className="hidden sm:inline">{topLink.prompt} </span>
                        <Link href={topLink.href} className="font-bold text-[#3457ff] hover:underline">{topLink.label}</Link>
                    </p>
                )}
            </header>

            <div className="flex flex-1 items-center justify-center py-10">
                <div className="w-full max-w-[440px]">{children}</div>
            </div>

            <footer className="text-center text-xs text-slate-400">
                &copy; {new Date().getFullYear()} GPT Chart View · Educational chart analysis, not financial advice.
            </footer>
        </div>

        <aside className="hidden p-4 lg:block">
            <div className={clsx(
                "relative flex h-full min-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-2xl p-10 text-white xl:p-14",
                asideTone === "blue" ? "bg-gradient-to-br from-[#3457ff] via-[#4a67ff] to-[#7b93ff]" : "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700"
            )}>
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(circle_at_70%_30%,black,transparent_75%)]" />
                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                <Image src="/logo.png" alt="GPT Chart View" width={180} height={52} className="relative h-10 w-auto self-start object-contain" priority />
                <div className="relative mt-auto">{aside}</div>
            </div>
        </aside>
    </main>
);

export const AuthCard = ({ children }: React.PropsWithChildren) => (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">{children}</div>
);

export const Steps = ({ steps, current }: { steps: string[]; current: number }) => (
    <ol className="mb-6 flex items-center gap-2">
        {steps.map((label, index) => {
            const done = index < current;
            const active = index === current;
            return (
                <li key={label} className="flex flex-1 items-center gap-2">
                    <span className={clsx(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors",
                        done && "bg-emerald-500 text-white",
                        active && "bg-gradient-to-tr from-[#3457ff] to-[#6b8cff] text-white shadow-md shadow-[#3457ff]/30",
                        !done && !active && "bg-slate-100 text-slate-400"
                    )}>
                        {done ? <FiCheck /> : index + 1}
                    </span>
                    <span className={clsx("hidden text-xs font-medium sm:inline", active ? "text-slate-800" : "text-slate-400")}>{label}</span>
                    {index < steps.length - 1 && <span className={clsx("h-px flex-1", done ? "bg-emerald-300" : "bg-slate-200")} />}
                </li>
            );
        })}
    </ol>
);

export const AnalysisPreview = () => (
    <div className="rounded-xl bg-white p-5 text-slate-700 shadow-2xl shadow-slate-900/20">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs text-slate-400">AI chart analysis</p>
                <p className="font-bold text-slate-800">BTCUSDT · 1H</p>
            </div>
            <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700 ring-1 ring-inset ring-emerald-200">Buy</span>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 text-center">
            {[
                { label: "SL", value: "63,180", tone: "bg-red-50 text-red-700" },
                { label: "Entry", value: "64,020", tone: "bg-blue-50 text-[#3457ff]" },
                { label: "TP1", value: "65,400", tone: "bg-emerald-50 text-emerald-700" },
                { label: "TP2", value: "66,850", tone: "bg-emerald-50 text-emerald-700" },
            ].map((level) => (
                <div key={level.label} className={clsx("rounded-lg px-1 py-2.5", level.tone)}>
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">{level.label}</p>
                    <p className="text-sm font-bold">{level.value}</p>
                </div>
            ))}
        </div>
        <div className="mt-4 flex items-center gap-3 text-xs">
            <span className="text-slate-500">Confidence</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
            </div>
            <span className="font-bold text-slate-700">78%</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">R:R <strong className="text-slate-700">1 : 2.4</strong></span>
        </div>
        <p className="mt-3 text-[11px] text-slate-400">Example output for illustration only.</p>
    </div>
);

export const AsideBullets = ({ items }: { items: string[] }) => (
    <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm font-medium text-white/90">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/20"><FiCheck className="h-3 w-3" /></span>
                {item}
            </li>
        ))}
    </ul>
);

export default AuthLayout;
