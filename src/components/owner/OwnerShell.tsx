"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiActivity, FiBarChart2, FiCreditCard, FiGrid, FiHeadphones, FiLogOut, FiShield, FiUsers } from "react-icons/fi";
import AppFrame, { type AppNavItem } from "@/components/dashboard/AppFrame";
import { Avatar, outlineButtonClass } from "@/components/dashboard/DashboardUi";

const nav: AppNavItem[] = [
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
        <AppFrame
            brand={{ href: "/owner", title: "Owner Console", subtitle: "GPT Chart View", icon: <FiShield className="h-5 w-5" /> }}
            nav={nav}
            isActive={(href) => pathname === href}
            section="Owner"
            title={titles[pathname] || "Owner Dashboard"}
            headerActions={
                <Link href="/dashboard" className={clsx(outlineButtonClass, "hidden md:inline-flex")}>
                    <FiBarChart2 />
                    User app
                </Link>
            }
            sidebarFooter={
                <>
                    <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                        <Avatar name={ownerEmail} />
                        <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Signed in as</p>
                            <p className="truncate text-sm font-medium text-slate-700">{ownerEmail}</p>
                        </div>
                    </div>
                    <button onClick={logout} className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600">
                        <FiLogOut className="h-5 w-5" />
                        Owner logout
                    </button>
                </>
            }
        >
            {children}
        </AppFrame>
    );
};

export default OwnerShell;
