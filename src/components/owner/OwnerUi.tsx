import clsx from "clsx";

export const OwnerPanel: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
    <section className={clsx("rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur", className)}>
        {children}
    </section>
);

export const OwnerMuted: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
    <p className={clsx("text-[#94a3b8]", className)}>{children}</p>
);

export const OwnerStat = ({ label, value, detail, tone = "blue" }: { label: string; value: string; detail?: string; tone?: "blue" | "green" | "amber" | "red" | "purple" }) => {
    const tones = {
        blue: "from-[#38bdf8] to-[#3457ff]",
        green: "from-[#22c55e] to-[#14b8a6]",
        amber: "from-[#f4c430] to-[#f59e0b]",
        red: "from-[#fb7185] to-[#ef4444]",
        purple: "from-[#a78bfa] to-[#6366f1]",
    };

    return (
        <OwnerPanel className="relative min-h-[145px] overflow-hidden">
            <span className={clsx("absolute -right-12 -top-14 h-32 w-32 rounded-full bg-gradient-to-br opacity-25 blur-2xl", tones[tone])} />
            <OwnerMuted className="text-xs font-extrabold uppercase tracking-[0.18em]">{label}</OwnerMuted>
            <strong className="mt-4 block text-4xl font-extrabold text-white">{value}</strong>
            {detail && <p className="mt-3 text-sm font-semibold text-[#cbd5e1]">{detail}</p>}
        </OwnerPanel>
    );
};

export const OwnerBadge = ({ children, tone = "blue" }: React.PropsWithChildren<{ tone?: "blue" | "green" | "amber" | "red" | "gray" }>) => {
    const tones = {
        blue: "bg-[#1d4ed8]/20 text-[#93c5fd] ring-[#60a5fa]/20",
        green: "bg-[#16a34a]/20 text-[#86efac] ring-[#4ade80]/20",
        amber: "bg-[#d97706]/20 text-[#fcd34d] ring-[#fbbf24]/20",
        red: "bg-[#dc2626]/20 text-[#fca5a5] ring-[#f87171]/20",
        gray: "bg-white/[0.08] text-[#cbd5e1] ring-white/10",
    };

    return <span className={clsx("inline-flex rounded-full px-3 py-1 text-xs font-extrabold ring-1", tones[tone])}>{children}</span>;
};

export const formatMoney = (value: number) => `$${value.toFixed(2)}`;

export const formatDate = (value?: string) => value ? new Date(value).toLocaleString() : "Never";
