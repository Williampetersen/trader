"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
    FiBarChart2,
    FiChevronDown,
    FiClock,
    FiCreditCard,
    FiGrid,
    FiHelpCircle,
    FiLogOut,
    FiMessageSquare,
    FiSearch,
    FiSettings,
    FiUpload,
    FiUser,
} from "react-icons/fi";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: FiGrid },
    { label: "Upload Chart", href: "/dashboard/upload", icon: FiUpload },
    { label: "Chart History", href: "/dashboard/history", icon: FiClock },
    { label: "Chat with our AI", href: "/dashboard/chat", icon: FiMessageSquare },
    { label: "My Profile", href: "/dashboard/profile", icon: FiUser },
    { label: "Billing", href: "/dashboard/billing", icon: FiCreditCard },
    { label: "Settings", href: "/dashboard/settings", icon: FiSettings },
    { label: "Support", href: "/dashboard/support", icon: FiHelpCircle },
];

const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/upload": "Upload Chart",
    "/dashboard/history": "Chart History",
    "/dashboard/results": "Dashboard",
    "/dashboard/profile": "My Profile",
    "/dashboard/billing": "Billing",
    "/dashboard/settings": "Settings",
    "/dashboard/support": "Support",
    "/dashboard/chat": "Chat with our AI",
};

interface DashboardUser {
    name: string;
    email: string;
    plan: {
        name?: string;
        creditsLeft: number;
        dailyLimit: number;
    };
}

const DashboardShell: React.FC<React.PropsWithChildren<{ user: DashboardUser }>> = ({ children, user }) => {
    const pathname = usePathname();
    const router = useRouter();
    const title = pageTitles[pathname] || "Dashboard";

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
    };

    const searchHistory = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const query = String(form.get("q") || "").trim();
        router.push(query ? `/dashboard/history?q=${encodeURIComponent(query)}` : "/dashboard/history");
    };

    return (
        <div className="min-h-screen bg-[#070b12] text-white">
            <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(135deg,rgba(52,87,255,0.16),transparent_34%),linear-gradient(180deg,rgba(244,196,48,0.07),transparent_30%),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:auto,auto,44px_44px,44px_44px]" />
            <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[292px] border-r border-white/10 bg-[#0b1018]/95 p-5 text-white backdrop-blur-xl lg:flex lg:flex-col">
                <Link href="/dashboard" className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3457ff] text-white shadow-[0_12px_28px_rgba(52,87,255,0.35)]">
                        <FiBarChart2 className="h-6 w-6" />
                    </span>
                    <span>
                        <span className="block text-lg font-extrabold tracking-normal">GPT Chart View</span>
                        <span className="text-xs font-semibold text-[#a9b4c7]">AI trading workspace</span>
                    </span>
                </Link>

                <nav className="mt-7 flex-1 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href || (pathname === "/dashboard/results" && item.href === "/dashboard/history");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition-colors",
                                    active
                                        ? "bg-[#3457ff] text-white shadow-[0_14px_35px_rgba(52,87,255,0.28)]"
                                        : "text-[#cbd5e1] hover:bg-white/[0.08] hover:text-white"
                                )}
                            >
                                <Icon size={20} className={active ? "text-white" : "text-[#8794a8] group-hover:text-[#f4c430]"} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <button onClick={handleLogout} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-extrabold text-[#cbd5e1] transition-colors hover:bg-white/[0.08] hover:text-white">
                    <FiLogOut size={20} />
                    Logout
                </button>
            </aside>

            <div className="relative z-10 lg:pl-[292px]">
                <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070b12]/82 px-5 backdrop-blur-xl lg:px-8">
                    <div className="mx-auto flex h-[84px] w-full max-w-[1720px] items-center justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#f4c430]">Member app</p>
                            <h1 className="truncate text-2xl font-extrabold tracking-normal">{title}</h1>
                        </div>

                        <form onSubmit={searchHistory} className="hidden max-w-md flex-1 items-center rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 shadow-inner xl:flex">
                            <FiSearch className="text-[#94a3b8]" />
                            <input name="q" className="ml-3 w-full bg-transparent text-sm text-white outline-none placeholder:text-[#64748b]" placeholder="Search history, symbols, or notes" />
                        </form>

                        <div className="flex items-center gap-3">
                            <Link href="/dashboard/upload" className="hidden rounded-2xl bg-[#3457ff] px-4 py-2.5 text-sm font-extrabold text-white shadow-[0_14px_35px_rgba(52,87,255,0.28)] transition-colors hover:bg-[#263fd2] md:inline-flex">
                                New upload
                            </Link>
                            <span className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-extrabold text-[#cbd5e1] shadow-sm">
                                <span className="hidden sm:inline">{user.plan.name === "Trial" ? "Trial credits: " : "Credits today: "}</span><span className="text-[#f4c430]">{user.plan.creditsLeft} / {user.plan.dailyLimit}</span>
                            </span>
                            <Image
                                src="/images/hero-chart.webp"
                                alt="User avatar"
                                width={34}
                                height={34}
                                className="h-10 w-10 rounded-2xl border border-white/10 object-cover"
                                unoptimized
                            />
                            <span className="hidden text-sm font-bold sm:inline">{user.name}</span>
                            <FiChevronDown size={16} className="hidden text-[#94a3b8] sm:block" />
                        </div>
                    </div>
                    <nav className="-mx-5 flex gap-2 overflow-x-auto border-t border-white/10 px-5 py-3 lg:hidden">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = pathname === item.href || (pathname === "/dashboard/results" && item.href === "/dashboard/history");
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={clsx(
                                        "flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold",
                                        active ? "bg-[#3457ff] text-white" : "bg-white/[0.08] text-[#cbd5e1]"
                                    )}
                                >
                                    <Icon size={16} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </header>

                <main className="mx-auto w-full max-w-[1720px] px-5 py-8 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardShell;
