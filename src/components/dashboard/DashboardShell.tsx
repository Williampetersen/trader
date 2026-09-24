"use client";

import clsx from "clsx";
import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    FiBarChart2,
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
import { countries } from "@/data/countries";
import AppFrame, { type AppNavItem } from "./AppFrame";
import { Avatar, Notice, inputClass, primaryButtonClass } from "./DashboardUi";

const navItems: AppNavItem[] = [
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
    "/dashboard/results": "Analysis Results",
    "/dashboard/profile": "My Profile",
    "/dashboard/billing": "Billing",
    "/dashboard/billing/success": "Billing",
    "/dashboard/settings": "Settings",
    "/dashboard/support": "Support",
    "/dashboard/chat": "Chat with our AI",
};

interface DashboardUser {
    name: string;
    email: string;
    profile: {
        mobile: string;
        country: string;
        gender: string;
        ageGroup: string;
    };
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
    const needsProfile = !user.name || !user.profile.mobile || !user.profile.country || !user.profile.gender || !user.profile.ageGroup;
    const creditPercent = user.plan.dailyLimit ? Math.min(100, (user.plan.creditsLeft / user.plan.dailyLimit) * 100) : 0;

    const isActive = (href: string) => pathname === href || (pathname === "/dashboard/results" && href === "/dashboard/history") || (pathname.startsWith("/dashboard/billing") && href === "/dashboard/billing");

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
        <AppFrame
            brand={{ href: "/dashboard", title: "GPT Chart View", subtitle: "AI trading workspace", icon: <FiBarChart2 className="h-5 w-5" /> }}
            nav={navItems}
            isActive={isActive}
            section="Dashboard"
            title={title}
            headerActions={
                <>
                    <form onSubmit={searchHistory} className="hidden w-64 items-center rounded-lg border border-slate-300 bg-white px-3 transition focus-within:border-[#3457ff] focus-within:ring-2 focus-within:ring-[#3457ff]/15 lg:flex">
                        <FiSearch className="shrink-0 text-slate-400" />
                        <input name="q" className="ml-2 w-full bg-transparent py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400" placeholder="Search history..." />
                    </form>
                    <Link href="/dashboard/upload" className={clsx(primaryButtonClass, "hidden md:inline-flex")}>
                        <FiUpload /> New upload
                    </Link>
                    <Link href="/dashboard/profile" className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-slate-100 sm:pr-3">
                        <Avatar name={user.name} />
                        <span className="hidden text-sm font-medium text-slate-700 sm:inline">{user.name}</span>
                    </Link>
                </>
            }
            sidebarFooter={
                <>
                    <div className="mb-3 rounded-lg bg-slate-50 p-4">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-bold uppercase tracking-wide text-slate-500">{user.plan.name || "Plan"}</span>
                            <span className="font-bold text-slate-700">{user.plan.creditsLeft} / {user.plan.dailyLimit}</span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                            <div className="h-full rounded-full bg-gradient-to-r from-[#3457ff] to-[#6b8cff]" style={{ width: `${creditPercent}%` }} />
                        </div>
                        <p className="mt-2 text-xs text-slate-500">{user.plan.name === "Trial" ? "Trial credits left" : "Credits left today"}</p>
                    </div>
                    <button onClick={handleLogout} className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600">
                        <FiLogOut className="h-5 w-5" />
                        Logout
                    </button>
                </>
            }
        >
            {children}
            {needsProfile && <ProfileCompletionModal user={user} />}
        </AppFrame>
    );
};

const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say", "Other"];
const ageGroupOptions = ["Under 18", "18-25", "26-39", "40-54", "55+"];

const ProfileCompletionModal = ({ user }: { user: DashboardUser }) => {
    const router = useRouter();
    const [form, setForm] = useState({
        name: user.name || "",
        mobile: user.profile.mobile || "",
        country: user.profile.country || "",
        gender: user.profile.gender || "",
        ageGroup: user.profile.ageGroup || "",
    });
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [open, setOpen] = useState(true);

    if (!open) return null;

    const updateField = (field: keyof typeof form, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
        setError("");
    };

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        setError("");

        try {
            const response = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Unable to save profile.");
                return;
            }

            setOpen(false);
            router.refresh();
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-900/40 px-4 py-6 backdrop-blur-sm">
            <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
                <div className="border-b border-slate-100 p-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#3457ff]">Profile required</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-800">Complete your account details</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Add these details once so your dashboard, owner analytics, support tickets, and billing records stay organized.
                    </p>
                </div>

                <form onSubmit={submit} className="p-6">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <ModalTextField label="Name" value={form.name} onChange={(value) => updateField("name", value)} required />
                        <ReadOnlyModalField label="Email" value={user.email} />
                        <ModalTextField label="Phone" value={form.mobile} onChange={(value) => updateField("mobile", value)} placeholder="+45 12 34 56 78" required />
                        <ModalSelectField label="Country" value={form.country} onChange={(value) => updateField("country", value)} options={countries} placeholder="Select country" required />
                        <ModalSelectField label="Age group" value={form.ageGroup} onChange={(value) => updateField("ageGroup", value)} options={ageGroupOptions} placeholder="Select age group" required />
                        <ModalSelectField label="Gender" value={form.gender} onChange={(value) => updateField("gender", value)} options={genderOptions} placeholder="Select gender" required />
                    </div>

                    {error && <Notice tone="red" className="mt-5">{error}</Notice>}

                    <button disabled={saving} className={clsx(primaryButtonClass, "mt-6 w-full py-3")}>
                        {saving ? "Saving profile..." : "Save and continue to dashboard"}
                    </button>
                </form>
            </div>
        </div>
    );
};

const ModalTextField = ({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean }) => (
    <label className="block">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <input className={clsx(inputClass, "mt-1.5")} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} />
    </label>
);

const ReadOnlyModalField = ({ label, value }: { label: string; value: string }) => (
    <label className="block">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <input className={clsx(inputClass, "mt-1.5")} value={value} readOnly />
    </label>
);

const ModalSelectField = ({ label, value, onChange, options, placeholder, required }: { label: string; value: string; onChange: (value: string) => void; options: string[]; placeholder: string; required?: boolean }) => (
    <label className="block">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <select className={clsx(inputClass, "mt-1.5")} value={value} onChange={(event) => onChange(event.target.value)} required={required}>
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </label>
);

export default DashboardShell;
