"use client";

import clsx from "clsx";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { FiCreditCard, FiLock, FiShield } from "react-icons/fi";
import { Badge, MutedText, Notice, Panel, PanelHeader, PrimaryButton, inputClass, outlineButtonClass } from "@/components/dashboard/DashboardUi";

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
        const formElement = event.currentTarget;
        const form = new FormData(formElement);
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
        if (response.ok) formElement.reset();
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
        <div className="mx-auto max-w-[1100px]">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
                <Panel>
                    <PanelHeader icon={<FiLock />} title="Account Security" description="Manage your password and security preferences" />
                    <form onSubmit={submitPassword} className="mt-6 space-y-5">
                        <Password name="currentPassword" label="Current Password" placeholder="Enter current password" />
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Password name="newPassword" label="New Password" placeholder="Enter new password" />
                            <Password name="confirmPassword" label="Confirm New Password" placeholder="Confirm new password" />
                        </div>
                        <PrimaryButton>Update Password</PrimaryButton>
                    </form>
                    {message && <Notice className="mt-5">{message}</Notice>}

                    <div className="mt-8 border-t border-slate-100 pt-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Preferences</h4>
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

                <div className="space-y-6">
                    <Panel>
                        <PanelHeader icon={<FiCreditCard />} title="Current Plan" />
                        <div className="mt-6 text-center">
                            <p className="text-2xl font-bold text-slate-800">{me?.plan.name || "Loading..."}</p>
                            <MutedText className="mt-1 text-sm">{me ? `${me.plan.creditsLeft} / ${me.plan.dailyLimit} credits left` : " "}</MutedText>
                        </div>
                        <Link href="/dashboard/billing" className={clsx(outlineButtonClass, "mt-5 w-full")}>Manage Plan</Link>
                    </Panel>
                    <Panel>
                        <PanelHeader icon={<FiShield />} title="Security Status" />
                        <div className="mt-4 divide-y divide-slate-100 text-sm">
                            <Row label="Password Hashing"><Badge tone="green">Active</Badge></Row>
                            <Row label="Session Cookie"><Badge tone="green">HttpOnly</Badge></Row>
                            <Row label="2FA Preference"><Badge tone={settings.twoFactorEnabled ? "green" : "red"}>{settings.twoFactorEnabled ? "On" : "Off"}</Badge></Row>
                        </div>
                    </Panel>
                </div>
            </div>
        </div>
    );
};

const Password = ({ label, placeholder, name }: { label: string; placeholder: string; name: string }) => (
    <label className="block">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <input name={name} className={clsx(inputClass, "mt-1.5")} placeholder={placeholder} type="password" minLength={8} required />
    </label>
);

const Toggle = ({ title, subtitle, active, onClick }: { title: string; subtitle: string; active?: boolean; onClick: () => void }) => (
    <button type="button" role="switch" aria-checked={Boolean(active)} onClick={onClick} className="flex w-full items-center justify-between gap-4 py-3 text-left">
        <div>
            <p className="font-medium text-slate-800">{title}</p>
            <MutedText className="text-sm">{subtitle}</MutedText>
        </div>
        <span className={clsx("h-6 w-11 shrink-0 rounded-full p-1 transition-colors", active ? "bg-[#3457ff]" : "bg-slate-300")}>
            <span className={clsx("block h-4 w-4 rounded-full bg-white shadow transition-transform", active && "translate-x-5")} />
        </span>
    </button>
);

const Row = ({ label, children }: React.PropsWithChildren<{ label: string }>) => (
    <div className="flex items-center justify-between gap-4 py-3">
        <span className="text-slate-600">{label}</span>
        {children}
    </div>
);

export default SettingsPage;
