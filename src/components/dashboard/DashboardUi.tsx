import clsx from "clsx";

export type Tone = "blue" | "green" | "purple" | "yellow" | "amber" | "red" | "gray";

export const toneGradients: Record<Tone, string> = {
    blue: "from-[#3457ff] to-[#6b8cff] shadow-[#3457ff]/30",
    green: "from-emerald-600 to-emerald-400 shadow-emerald-500/30",
    purple: "from-fuchsia-600 to-pink-400 shadow-pink-500/30",
    yellow: "from-orange-500 to-amber-400 shadow-orange-500/30",
    amber: "from-orange-500 to-amber-400 shadow-orange-500/30",
    red: "from-red-600 to-rose-400 shadow-red-500/30",
    gray: "from-slate-900 to-slate-700 shadow-slate-900/30",
};

const softTones: Record<Tone, string> = {
    blue: "bg-blue-50 text-[#3457ff] ring-blue-200",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    purple: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200",
    yellow: "bg-amber-50 text-amber-700 ring-amber-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    red: "bg-red-50 text-red-700 ring-red-200",
    gray: "bg-slate-100 text-slate-600 ring-slate-200",
};

export const primaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-tr from-[#3457ff] to-[#5a7bff] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-md shadow-[#3457ff]/20 transition-all hover:shadow-lg hover:shadow-[#3457ff]/40 disabled:pointer-events-none disabled:opacity-60";

export const outlineButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-60";

export const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#3457ff] focus:ring-2 focus:ring-[#3457ff]/15 read-only:bg-slate-50 read-only:text-slate-500";

export const tableClass = "w-full text-left text-sm [&_td]:border-b [&_td]:border-slate-100 [&_td]:px-6 [&_td]:py-3.5 [&_th]:border-b [&_th]:border-slate-100 [&_th]:px-6 [&_th]:py-3 [&_th]:text-[11px] [&_th]:font-bold [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-slate-400 [&_tbody_tr:hover]:bg-slate-50/70 [&_tbody_tr:last-child_td]:border-0";

export const Panel: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
    <section className={clsx("rounded-xl border border-slate-200/80 bg-white p-6 text-slate-700 shadow-sm", className)}>
        {children}
    </section>
);

export const PanelHeader: React.FC<{ title: string; description?: string; icon?: React.ReactNode; action?: React.ReactNode; className?: string }> = ({ title, description, icon, action, className }) => (
    <div className={clsx("flex flex-col justify-between gap-4 sm:flex-row sm:items-center", className)}>
        <div className="flex items-start gap-3">
            {icon && <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600">{icon}</span>}
            <div>
                <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
            </div>
        </div>
        {action}
    </div>
);

export const MutedText: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
    <p className={clsx("text-slate-500", className)}>{children}</p>
);

export const StatGrid: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
    <div className={clsx("grid grid-cols-1 gap-x-6 gap-y-10 pt-4 md:grid-cols-2 xl:grid-cols-4", className)}>{children}</div>
);

export const StatCard: React.FC<{
    label: string;
    value: string;
    icon: React.ReactNode;
    tone?: Tone;
    description?: string;
}> = ({ label, value, icon, tone = "blue", description }) => (
    <div className="relative rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className={clsx("absolute -top-4 left-4 grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-tr text-2xl text-white shadow-lg", toneGradients[tone])}>
            {icon}
        </div>
        <div className="p-4 pl-24 text-right">
            <p className="text-sm text-slate-500">{label}</p>
            <p className={clsx("mt-1 truncate text-2xl font-bold", tone === "red" ? "text-red-600" : "text-slate-800")}>{value}</p>
        </div>
        <div className="border-t border-slate-100 px-4 py-3 text-sm text-slate-500">{description || " "}</div>
    </div>
);

export const Badge: React.FC<React.PropsWithChildren<{ tone?: Tone; className?: string }>> = ({ children, tone = "blue", className }) => (
    <span className={clsx("inline-flex items-center whitespace-nowrap rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset", softTones[tone], className)}>
        {children}
    </span>
);

export const Notice: React.FC<React.PropsWithChildren<{ tone?: "blue" | "green" | "red" | "amber"; className?: string }>> = ({ children, tone = "blue", className }) => {
    const tones = {
        blue: "border-blue-200 bg-blue-50 text-blue-800",
        green: "border-emerald-200 bg-emerald-50 text-emerald-800",
        red: "border-red-200 bg-red-50 text-red-700",
        amber: "border-amber-200 bg-amber-50 text-amber-800",
    };
    return <div role={tone === "red" ? "alert" : undefined} className={clsx("rounded-lg border p-3 text-sm font-medium", tones[tone], className)}>{children}</div>;
};

export const IconTile: React.FC<React.PropsWithChildren<{ tone?: Tone; className?: string }>> = ({ children, tone = "blue", className }) => (
    <span className={clsx("grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-gradient-to-tr text-lg text-white shadow-md", toneGradients[tone], className)}>{children}</span>
);

export const Avatar: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
    const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "U";
    return (
        <span className={clsx("grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-tr from-slate-900 to-slate-700 text-xs font-bold text-white shadow-md shadow-slate-900/20", className)}>
            {initials}
        </span>
    );
};

export const Disclaimer: React.FC = () => (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
        <strong>Disclaimer:</strong> GPT Chart View provides AI-powered chart analysis for educational purposes only. It does not offer financial advice or guarantee trading results. Trading involves risk, and users should conduct their own research or consult a licensed financial advisor before making investment decisions.
    </div>
);

export const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, ...props }) => (
    <button {...props} className={clsx(primaryButtonClass, className)} />
);

export const LightButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, type = "button", ...props }) => (
    <button type={type} {...props} className={clsx(outlineButtonClass, className)} />
);
