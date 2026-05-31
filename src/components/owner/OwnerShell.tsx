"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiActivity, FiBarChart2, FiCreditCard, FiGrid, FiHeadphones, FiLogOut, FiShield, FiUsers } from "react-icons/fi";

const nav = [
    { label: "Command", href: "/owner", icon: FiGrid },
    { label: "Users", href: "/owner/users", icon: FiUsers },
    { label: "Revenue", href: "/owner/revenue", icon: FiCreditCard },
    { label: "Activity", href: "/owner/activity", icon: FiActivity },
    { label: "Support", href: "/owner/support", icon: FiHeadphones },
];

const titles: Record<string, string> = {
    "/owner": "Owner Command Center",
    "/owner/users": "User Intelligence",
    "/owner/revenue": "Revenue Operations",
    "/owner/activity": "Platform Activity",
    "/owner/support": "Support Desk",
};

const OwnerShell = ({ children, ownerEmail }: React.PropsWithChildren<{ ownerEmail: string }>) => {
    const pathname = usePathname();
    const router = useRouter();

    const logout = async () => {
        await fetch("/api/owner/logout", { method: "POST" });
        router.push("/owner/login");
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-[#070b12] text-white">
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,87,255,0.22),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(244,196,48,0.13),transparent_28%)]" />
            <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[292px] border-r border-white/10 bg-[#0b1018]/95 p-5 backdrop-blur-xl xl:block">
                <Link href="/owner" className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4c430] text-[#111318]">
                        <FiShield size={24} />
                    </span>
                    <span>
                        <strong className="block text-lg">Owner Console</strong>
                        <span className="text-xs font-bold text-[#94a3b8]">GPT Chart View</span>
                    </span>
                </Link>

                <nav className="mt-7 space-y-2">
                    {nav.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition-colors",
                                    active ? "bg-[#3457ff] text-white shadow-[0_14px_35px_rgba(52,87,255,0.28)]" : "text-[#cbd5e1] hover:bg-white/[0.08] hover:text-white"
                                )}
                            >
                                <Icon size={19} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-5 left-5 right-5">
                    <div className="mb-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#94a3b8]">Signed in as</p>
                        <p className="mt-2 truncate text-sm font-bold">{ownerEmail}</p>
                    </div>
                    <button onClick={logout} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-extrabold text-[#cbd5e1] transition-colors hover:bg-white/[0.08] hover:text-white">
                        <FiLogOut />
                        Owner logout
                    </button>
                </div>
            </aside>

            <div className="relative z-10 xl:pl-[292px]">
                <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070b12]/82 px-5 backdrop-blur-xl lg:px-8">
                    <div className="mx-auto flex h-[84px] max-w-[1720px] items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#f4c430]">Private owner area</p>
                            <h1 className="mt-1 text-2xl font-extrabold">{titles[pathname] || "Owner Dashboard"}</h1>
                        </div>
                        <Link href="/dashboard" className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-extrabold text-[#cbd5e1] transition-colors hover:bg-white/[0.08] hover:text-white md:flex">
                            <FiBarChart2 />
                            User app
                        </Link>
                    </div>
                    <nav className="-mx-5 flex gap-2 overflow-x-auto border-t border-white/10 px-5 py-3 xl:hidden">
                        {nav.map((item) => {
                            const Icon = item.icon;
                            const active = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href} className={clsx("flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold", active ? "bg-[#3457ff] text-white" : "bg-white/[0.08] text-[#cbd5e1]")}>
                                    <Icon size={16} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </header>
                <main className="mx-auto max-w-[1720px] px-5 py-8 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default OwnerShell;
