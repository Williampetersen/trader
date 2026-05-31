"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FiBarChart2, FiCreditCard, FiEdit, FiUser } from "react-icons/fi";
import { MutedText, Panel } from "./DashboardUi";
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
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1fr_340px]">
            <Panel>
                <form onSubmit={submit}>
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h3 className="text-lg font-extrabold">Profile Information</h3>
                            <MutedText className="mt-1 text-sm">Changes are saved to your user account.</MutedText>
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-extrabold text-white shadow-sm transition-colors hover:border-[#3457ff]/60 hover:bg-white/[0.08] disabled:opacity-60"
                        >
                            <FiEdit />
                            {saving ? "Saving..." : "Save Profile"}
                        </button>
                    </div>

                    <div className="mt-7 flex items-center gap-5 border-b border-white/10 pb-7">
                        <Image src="/images/hero-chart.webp" alt={currentUser.name} width={86} height={86} className="h-[86px] w-[86px] rounded-2xl border border-white/10 object-cover" unoptimized />
                        <div>
                            <strong className="text-2xl">{currentUser.name}</strong>
                            <MutedText className="text-sm">{currentUser.plan.name} member</MutedText>
                        </div>
                    </div>

                    <div className="mt-7 grid grid-cols-1 gap-7 md:grid-cols-2">
                        <TextField label="Name" value={form.name} onChange={(value) => updateField("name", value)} required />
                        <ReadOnlyField label="Email" value={currentUser.email} />
                        <TextField label="Mobile" value={form.mobile} onChange={(value) => updateField("mobile", value)} placeholder="+45 12 34 56 78" />
                        <SelectField label="Country" value={form.country} onChange={(value) => updateField("country", value)} options={countries} placeholder="Select country" />
                        <SelectField label="Gender" value={form.gender} onChange={(value) => updateField("gender", value)} options={genderOptions} placeholder="Select gender" />
                        <SelectField label="Age group" value={form.ageGroup} onChange={(value) => updateField("ageGroup", value)} options={ageGroupOptions} placeholder="Select age group" />
                    </div>

                    {message && <p className="mt-5 rounded-2xl border border-[#4ade80]/20 bg-[#16a34a]/20 p-3 text-sm font-bold text-[#86efac]">{message}</p>}
                    {error && <p className="mt-5 rounded-2xl border border-[#fb7185]/30 bg-[#7f1d1d]/25 p-3 text-sm font-bold text-[#fecaca]">{error}</p>}
                </form>
            </Panel>

            <Panel className="h-fit">
                <h3 className="text-lg font-extrabold">Account Details</h3>
                <div className="mt-7 space-y-6 text-lg">
                    <Detail icon={<FiUser />} label="Member Since" value={new Date(currentUser.createdAt).toLocaleDateString()} />
                    <Detail icon={<FiCreditCard />} label="Plan Type" value={currentUser.plan.name} badge />
                    <Detail icon={<FiBarChart2 />} label="Credits Left" value={String(currentUser.plan.creditsLeft)} badgeGreen />
                </div>
            </Panel>
        </div>
    );
};

const fieldClass = "mt-3 w-full rounded-2xl border border-white/10 bg-[#101827] px-4 py-3 text-white outline-none transition-colors placeholder:text-[#64748b] focus:border-[#3457ff]";

const TextField = ({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean }) => (
    <label className="block">
        <span className="font-bold text-[#cbd5e1]">{label}</span>
        <input className={fieldClass} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} />
    </label>
);

const ReadOnlyField = ({ label, value }: { label: string; value: string }) => (
    <label className="block">
        <span className="font-bold text-[#cbd5e1]">{label}</span>
        <input className={`${fieldClass} text-[#94a3b8]`} value={value} readOnly />
    </label>
);

const SelectField = ({ label, value, onChange, options, placeholder }: { label: string; value: string; onChange: (value: string) => void; options: string[]; placeholder: string }) => (
    <label className="block">
        <span className="font-bold text-[#cbd5e1]">{label}</span>
        <select className={fieldClass} value={value} onChange={(event) => onChange(event.target.value)}>
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </label>
);

const Detail = ({ icon, label, value, badge, badgeGreen }: { icon: React.ReactNode; label: string; value: string; badge?: boolean; badgeGreen?: boolean }) => (
    <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-3 text-[#cbd5e1]">{icon}{label}</span>
        <strong className={badge || badgeGreen ? `rounded-full px-3 py-1 text-sm ${badgeGreen ? "bg-[#16a34a]/20 text-[#86efac] ring-1 ring-[#4ade80]/20" : "bg-[#3457ff]/20 text-[#bfdbfe] ring-1 ring-[#60a5fa]/20"}` : ""}>{value}</strong>
    </div>
);

export default ProfileForm;
