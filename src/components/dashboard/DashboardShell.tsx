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
        <div className="min-h-screen bg-[#f4f7fb] text-[#111827]">
            <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[276px] border-r border-[#20242d] bg-[#111318] text-white lg:flex lg:flex-col">
                <Link href="/dashboard" className="flex h-[82px] items-center gap-3 border-b border-white/10 px-5">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3457ff] text-white shadow-[0_12px_28px_rgba(52,87,255,0.35)]">
                        <FiBarChart2 className="h-6 w-6" />
                    </span>
                    <span>
                        <span className="block text-lg font-extrabold tracking-normal">GPT Chart View</span>
                        <span className="text-xs font-semibold text-[#a9b4c7]">AI trading workspace</span>
                    </span>
                </Link>

                <nav className="flex-1 space-y-1.5 p-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href || (pathname === "/dashboard/results" && item.href === "/dashboard/history");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors",
                                    active
                                        ? "bg-white text-[#111318] shadow-[0_12px_28px_rgba(0,0,0,0.22)] before:absolute before:-left-4 before:h-8 before:w-1 before:rounded-r-full before:bg-[#f4c430]"
                                        : "text-[#d6deea] hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <Icon size={20} className={active ? "text-[#3457ff]" : "text-[#8794a8] group-hover:text-[#f4c430]"} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <button onClick={handleLogout} className="m-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm font-bold text-[#d6deea] transition-colors hover:border-[#f4c430]/50 hover:bg-[#f4c430]/10 hover:text-white">
                    <FiLogOut size={20} />
                    Logout
                </button>
            </aside>

            <div className="lg:pl-[276px]">
                <header className="sticky top-0 z-30 border-b border-[#dbe3ef] bg-white/85 px-5 shadow-[0_10px_35px_rgba(15,23,42,0.04)] backdrop-blur-xl lg:px-8">
                    <div className="mx-auto flex h-[82px] w-full max-w-[1680px] items-center justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#64748b]">Member app</p>
                            <h1 className="truncate text-2xl font-extrabold tracking-normal">{title}</h1>
                        </div>

                        <form onSubmit={searchHistory} className="hidden max-w-md flex-1 items-center rounded-2xl border border-[#dbe3ef] bg-[#f8fafc] px-4 py-3 shadow-inner xl:flex">
                            <FiSearch className="text-[#94a3b8]" />
                            <input name="q" className="ml-3 w-full bg-transparent text-sm outline-none placeholder:text-[#64748b]" placeholder="Search history, symbols, or notes" />
                        </form>

                        <div className="flex items-center gap-3">
                            <Link href="/dashboard/upload" className="hidden rounded-xl bg-[#3457ff] px-4 py-2.5 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(52,87,255,0.22)] transition-colors hover:bg-[#263fd2] md:inline-flex">
                                New upload
                            </Link>
                            <span className="rounded-xl border border-[#dbe3ef] bg-white px-3 py-2 text-sm font-extrabold text-[#334155] shadow-sm">
                                <span className="hidden sm:inline">Credits today: </span><span className="text-[#3457ff]">{user.plan.creditsLeft} / {user.plan.dailyLimit}</span>
                            </span>
                            <Image
                                src="/images/hero-chart.webp"
                                alt="User avatar"
                                width={34}
                                height={34}
                                className="h-10 w-10 rounded-xl border border-[#dbe3ef] object-cover"
                                unoptimized
                            />
                            <span className="hidden text-sm font-bold sm:inline">{user.name}</span>
                            <FiChevronDown size={16} className="hidden text-[#64748b] sm:block" />
                        </div>
                    </div>
                    <nav className="-mx-5 flex gap-2 overflow-x-auto border-t border-[#e6edf6] px-5 py-3 lg:hidden">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = pathname === item.href || (pathname === "/dashboard/results" && item.href === "/dashboard/history");
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={clsx(
                                        "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold",
                                        active ? "bg-[#111318] text-white" : "bg-[#eef2f7] text-[#334155]"
                                    )}
                                >
                                    <Icon size={16} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </header>

                <main className="mx-auto w-full max-w-[1680px] px-5 py-8 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardShell;
