"use client";

import clsx from "clsx";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FiBarChart2, FiCalendar, FiCreditCard, FiSave } from "react-icons/fi";
import { Avatar, Badge, MutedText, Notice, Panel, PanelHeader, PrimaryButton, inputClass } from "./DashboardUi";
import { countries } from "@/data/countries";

interface ProfileFormProps {
    user: {
        name: string;
        email: string;
        createdAt: string;
        profile: { mobile: string; country: string; gender: string; ageGroup: string };
        plan: { name: string; creditsLeft: number };
    };
}

const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say", "Other"];
const ageGroupOptions = ["Under 18", "18-25", "26-39", "40-54", "55+"];

const ProfileForm: React.FC<ProfileFormProps> = ({ user }) => {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState(user);
    const [form, setForm] = useState({
        name: user.name,
        mobile: user.profile.mobile,
        country: user.profile.country,
        gender: user.profile.gender,
        ageGroup: user.profile.ageGroup,
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const updateField = (field: keyof typeof form, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
        setMessage("");
        setError("");
    };

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        setMessage("");
        setError("");

        const response = await fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        const data = await response.json();
        setSaving(false);

        if (!response.ok) {
            setError(data.error || "Unable to update profile.");
            return;
        }

        setCurrentUser(data.user);
        setForm({
            name: data.user.name,
            mobile: data.user.profile.mobile,
            country: data.user.profile.country,
            gender: data.user.profile.gender,
            ageGroup: data.user.profile.ageGroup,
        });
        setMessage("Profile saved successfully.");
        router.refresh();
    };

    return (
        <div className="space-y-6">
            <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
                <div className="h-28 bg-gradient-to-tr from-[#3457ff] via-[#5a7bff] to-[#a5b8ff]" />
                <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end">
                    <Avatar name={currentUser.name} className="-mt-10 h-20 w-20 rounded-xl border-4 border-white text-2xl" />
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{currentUser.name}</h2>
                        <MutedText className="text-sm">{currentUser.email} · {currentUser.plan.name} member</MutedText>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
                <Panel>
                    <form onSubmit={submit}>
                        <PanelHeader
                            title="Profile Information"
                            description="Changes are saved to your user account."
                            action={<PrimaryButton type="submit" disabled={saving}><FiSave />{saving ? "Saving..." : "Save Profile"}</PrimaryButton>}
                        />

                        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                            <TextField label="Name" value={form.name} onChange={(value) => updateField("name", value)} required />
                            <ReadOnlyField label="Email" value={currentUser.email} />
                            <TextField label="Mobile" value={form.mobile} onChange={(value) => updateField("mobile", value)} placeholder="+45 12 34 56 78" />
                            <SelectField label="Country" value={form.country} onChange={(value) => updateField("country", value)} options={countries} placeholder="Select country" />
                            <SelectField label="Gender" value={form.gender} onChange={(value) => updateField("gender", value)} options={genderOptions} placeholder="Select gender" />
                            <SelectField label="Age group" value={form.ageGroup} onChange={(value) => updateField("ageGroup", value)} options={ageGroupOptions} placeholder="Select age group" />
                        </div>

                        {message && <Notice tone="green" className="mt-5">{message}</Notice>}
                        {error && <Notice tone="red" className="mt-5">{error}</Notice>}
                    </form>
                </Panel>

                <Panel className="h-fit">
                    <PanelHeader title="Account Details" />
                    <div className="mt-4 divide-y divide-slate-100 text-sm">
                        <Detail icon={<FiCalendar />} label="Member Since"><strong className="text-slate-800">{new Date(currentUser.createdAt).toLocaleDateString()}</strong></Detail>
                        <Detail icon={<FiCreditCard />} label="Plan Type"><Badge tone="blue">{currentUser.plan.name}</Badge></Detail>
                        <Detail icon={<FiBarChart2 />} label="Credits Left"><Badge tone="green">{currentUser.plan.creditsLeft}</Badge></Detail>
                    </div>
                </Panel>
            </div>
        </div>
    );
};

const TextField = ({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean }) => (
    <label className="block">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <input className={clsx(inputClass, "mt-1.5")} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} />
    </label>
);

const ReadOnlyField = ({ label, value }: { label: string; value: string }) => (
    <label className="block">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <input className={clsx(inputClass, "mt-1.5")} value={value} readOnly />
    </label>
);

const SelectField = ({ label, value, onChange, options, placeholder }: { label: string; value: string; onChange: (value: string) => void; options: string[]; placeholder: string }) => (
    <label className="block">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <select className={clsx(inputClass, "mt-1.5")} value={value} onChange={(event) => onChange(event.target.value)}>
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </label>
);

const Detail = ({ icon, label, children }: React.PropsWithChildren<{ icon: React.ReactNode; label: string }>) => (
    <div className="flex items-center justify-between gap-4 py-3">
        <span className="flex items-center gap-3 text-slate-600">{icon}{label}</span>
        {children}
    </div>
);

export default ProfileForm;
