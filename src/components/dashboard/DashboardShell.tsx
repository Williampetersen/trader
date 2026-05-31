"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
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
import { countries } from "@/data/countries";

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
            {needsProfile && <ProfileCompletionModal user={user} />}
        </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/82 px-4 py-6 backdrop-blur">
            <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1018] text-white shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
                <div className="border-b border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(52,87,255,0.32),transparent_34%)] p-6 sm:p-7">
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#f4c430]">Profile required</p>
                    <h2 className="mt-3 text-3xl font-extrabold">Complete your account details</h2>
                    <p className="mt-3 text-sm leading-6 text-[#cbd5e1]">
                        Add these details once so your dashboard, owner analytics, support tickets, and billing records stay organized.
                    </p>
                </div>

                <form onSubmit={submit} className="p-6 sm:p-7">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <ModalTextField label="Name" value={form.name} onChange={(value) => updateField("name", value)} required />
                        <ReadOnlyModalField label="Email" value={user.email} />
                        <ModalTextField label="Phone" value={form.mobile} onChange={(value) => updateField("mobile", value)} placeholder="+45 12 34 56 78" required />
                        <ModalSelectField label="Country" value={form.country} onChange={(value) => updateField("country", value)} options={countries} placeholder="Select country" required />
                        <ModalSelectField label="Age group" value={form.ageGroup} onChange={(value) => updateField("ageGroup", value)} options={ageGroupOptions} placeholder="Select age group" required />
                        <ModalSelectField label="Gender" value={form.gender} onChange={(value) => updateField("gender", value)} options={genderOptions} placeholder="Select gender" required />
                    </div>

                    {error && <p role="alert" className="mt-5 rounded-2xl border border-[#fb7185]/30 bg-[#7f1d1d]/25 p-3 text-sm font-bold text-[#fecaca]">{error}</p>}

                    <button disabled={saving} className="mt-7 flex w-full items-center justify-center rounded-2xl bg-[#3457ff] px-5 py-4 font-extrabold text-white shadow-[0_16px_30px_rgba(52,87,255,0.28)] transition-colors hover:bg-[#263fd2] disabled:opacity-60">
                        {saving ? "Saving profile..." : "Save and continue to dashboard"}
                    </button>
                </form>
            </div>
        </div>
    );
};

const modalFieldClass = "mt-2 w-full rounded-2xl border border-white/10 bg-[#101827] px-4 py-3 text-white outline-none transition-colors placeholder:text-[#64748b] focus:border-[#3457ff]";

const ModalTextField = ({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean }) => (
    <label className="block">
        <span className="font-bold text-[#cbd5e1]">{label}</span>
        <input className={modalFieldClass} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} />
    </label>
);

const ReadOnlyModalField = ({ label, value }: { label: string; value: string }) => (
    <label className="block">
        <span className="font-bold text-[#cbd5e1]">{label}</span>
        <input className={`${modalFieldClass} text-[#94a3b8]`} value={value} readOnly />
    </label>
);

const ModalSelectField = ({ label, value, onChange, options, placeholder, required }: { label: string; value: string; onChange: (value: string) => void; options: string[]; placeholder: string; required?: boolean }) => (
    <label className="block">
        <span className="font-bold text-[#cbd5e1]">{label}</span>
        <select className={modalFieldClass} value={value} onChange={(event) => onChange(event.target.value)} required={required}>
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
