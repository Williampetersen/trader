"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { FiCreditCard, FiEye, FiLock, FiShield } from "react-icons/fi";
import { LightButton, MutedText, Panel, PrimaryButton } from "@/components/dashboard/DashboardUi";

interface MeResponse {
    user?: {
        plan: { name: string; creditsLeft: number; dailyLimit: number };
        settings?: { twoFactorEnabled: boolean; loginNotifications: boolean };
    };
}

const SettingsPage = () => {
    const [message, setMessage] = useState("");
    const [me, setMe] = useState<MeResponse["user"]>();

    useEffect(() => {
        fetch("/api/auth/me")
            .then((response) => response.json())
            .then((data: MeResponse) => setMe(data.user));
    }, []);

    const submitPassword = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        if (form.get("newPassword") !== form.get("confirmPassword")) {
            setMessage("New password and confirmation do not match.");
            return;
        }
        const response = await fetch("/api/settings/password", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                currentPassword: form.get("currentPassword"),
                newPassword: form.get("newPassword"),
            }),
        });
        const data = await response.json();
        setMessage(response.ok ? "Password updated." : data.error || "Unable to update password.");
        if (response.ok) event.currentTarget.reset();
    };

    const savePreferences = async (settings: { twoFactorEnabled: boolean; loginNotifications: boolean }) => {
        const response = await fetch("/api/settings/preferences", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(settings),
        });
        const data = await response.json();
        if (response.ok) setMe(data.user);
    };

    const settings = me?.settings || { twoFactorEnabled: false, loginNotifications: true };

    return (
        <div className="mx-auto max-w-[1050px]">
            <div className="mb-8 text-center">
                <h2 className="text-4xl font-extrabold">Settings</h2>
                <MutedText className="mt-3">Manage your account preferences and security settings</MutedText>
            </div>

            <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1fr_295px]">
                <Panel>
                    <h3 className="flex items-center gap-3 text-lg font-extrabold"><FiLock /> Account Security</h3>
                    <MutedText className="mt-2">Manage your password and security preferences</MutedText>
                    <form onSubmit={submitPassword} className="mt-8 space-y-6">
                        <Password name="currentPassword" label="Current Password" placeholder="Enter current password" />
                        <Password name="newPassword" label="New Password" placeholder="Enter new password" />
                        <Password name="confirmPassword" label="Confirm New Password" placeholder="Confirm new password" />
                        <PrimaryButton>Update Password</PrimaryButton>
                    </form>
                    {message && <p className="mt-5 rounded-2xl border border-[#3457ff]/25 bg-[#3457ff]/15 p-3 text-sm font-bold text-[#bfdbfe]">{message}</p>}

                    <div className="mt-8 border-t border-white/10 pt-6">
                        <Toggle
                            title="Two-Factor Preference"
                            subtitle="Saved on your account for future 2FA provider integration"
                            active={settings.twoFactorEnabled}
                            onClick={() => savePreferences({ ...settings, twoFactorEnabled: !settings.twoFactorEnabled })}
                        />
                        <Toggle
                            title="Login Notifications"
                            subtitle="Saved on your account"
                            active={settings.loginNotifications}
                            onClick={() => savePreferences({ ...settings, loginNotifications: !settings.loginNotifications })}
                        />
                    </div>
                </Panel>

                <div className="space-y-7">
                    <Panel>
                        <h3 className="flex items-center gap-3 text-lg font-extrabold"><FiCreditCard /> Current Plan</h3>
                        <div className="mt-7 text-center"><span className="rounded-full bg-[#3457ff]/20 px-5 py-3 text-xl font-extrabold text-[#bfdbfe] ring-1 ring-[#60a5fa]/20">{me?.plan.name || "Loading"}</span></div>
                        <p className="mt-5 text-center text-sm text-[#94a3b8]">{me ? `${me.plan.creditsLeft} / ${me.plan.dailyLimit} credits left` : ""}</p>
                        <Link href="/dashboard/billing" className="mt-5 block"><LightButton className="w-full">Manage Plan</LightButton></Link>
                    </Panel>
                    <Panel>
                        <h3 className="flex items-center gap-3 text-lg font-extrabold"><FiShield /> Security Status</h3>
                        <div className="mt-7 space-y-4 text-lg">
                            <Row label="Password Hashing" value="Active" green />
                            <Row label="Session Cookie" value="HttpOnly" green />
                            <Row label="2FA Preference" value={settings.twoFactorEnabled ? "On" : "Off"} green={settings.twoFactorEnabled} red={!settings.twoFactorEnabled} />
                        </div>
                    </Panel>
                </div>
            </div>
        </div>
    );
};

const Password = ({ label, placeholder, name }: { label: string; placeholder: string; name: string }) => (
    <label className="block">
        <span className="font-bold text-[#cbd5e1]">{label}</span>
        <div className="mt-3 flex items-center rounded-2xl border border-white/10 bg-[#101827] px-4 transition-colors focus-within:border-[#3457ff]">
            <input name={name} className="w-full bg-transparent py-3 text-white outline-none placeholder:text-[#64748b]" placeholder={placeholder} type="password" minLength={8} required />
            <FiEye className="text-[#94a3b8]" />
        </div>
    </label>
);

const Toggle = ({ title, subtitle, active, onClick }: { title: string; subtitle: string; active?: boolean; onClick: () => void }) => (
    <button type="button" onClick={onClick} className="flex w-full items-center justify-between py-3 text-left">
        <div><strong>{title}</strong><MutedText>{subtitle}</MutedText></div>
        <span className={`h-6 w-11 rounded-full p-1 transition-colors ${active ? "bg-[#3457ff]" : "bg-white/20"}`}><span className={`block h-4 w-4 rounded-full bg-white transition-all ${active ? "ml-5" : ""}`} /></span>
    </button>
);

const Row = ({ label, value, green, red }: { label: string; value: string; green?: boolean; red?: boolean }) => (
    <div className="flex justify-between gap-4">
        <span>{label}</span>
        <strong className={green || red ? `rounded-full px-3 py-1 text-sm ${green ? "bg-[#16a34a]/20 text-[#86efac] ring-1 ring-[#4ade80]/20" : "bg-[#dc2626]/20 text-[#fca5a5] ring-1 ring-[#f87171]/20"}` : ""}>{value}</strong>
    </div>
);

export default SettingsPage;
