import clsx from "clsx";

export const Panel: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
    <section className={clsx("rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-white shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur", className)}>
        {children}
    </section>
);

export const MutedText: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
    <p className={clsx("text-[#94a3b8]", className)}>{children}</p>
);

export const StatCard: React.FC<{
    label: string;
    value: string;
    icon: React.ReactNode;
    tone?: "blue" | "green" | "purple" | "yellow" | "red";
    description?: string;
}> = ({ label, value, icon, tone = "blue", description }) => {
    const tones = {
        blue: "text-[#93c5fd] bg-[#3457ff]/15 ring-[#60a5fa]/20",
        green: "text-[#86efac] bg-[#16a34a]/15 ring-[#4ade80]/20",
        purple: "text-[#c4b5fd] bg-[#7c3aed]/18 ring-[#a78bfa]/20",
        yellow: "text-[#fcd34d] bg-[#d97706]/16 ring-[#fbbf24]/20",
        red: "text-[#fca5a5] bg-[#dc2626]/16 ring-[#f87171]/20",
    };

    return (
        <Panel className="flex min-h-[120px] items-center justify-between overflow-hidden">
            <div>
                <MutedText className="text-sm font-bold uppercase tracking-[0.08em]">{label}</MutedText>
                <p className={clsx("mt-2 text-3xl font-extrabold tracking-normal", tone === "red" && "text-[#fca5a5]")}>{value}</p>
                {description && <MutedText className="mt-1 text-sm">{description}</MutedText>}
            </div>
            <div className={clsx("flex h-12 w-12 items-center justify-center rounded-xl text-2xl ring-1", tones[tone])}>{icon}</div>
        </Panel>
    );
};

export const Disclaimer: React.FC = () => (
    <div className="rounded-3xl border border-[#f4c430]/25 bg-[#f4c430]/10 p-4 text-sm leading-relaxed text-[#fde68a] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
        <strong>Disclaimer:</strong> GPT Chart View provides AI-powered chart analysis for educational purposes only. It does not offer financial advice or guarantee trading results. Trading involves risk, and users should conduct their own research or consult a licensed financial advisor before making investment decisions.
    </div>
);

export const PrimaryButton: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
    <button className={clsx("rounded-2xl bg-[#3457ff] px-5 py-3 text-sm font-extrabold text-white shadow-[0_14px_35px_rgba(52,87,255,0.28)] transition-colors hover:bg-[#263fd2] disabled:opacity-60", className)}>
        {children}
    </button>
);

export const LightButton: React.FC<React.PropsWithChildren<{ className?: string; onClick?: () => void }>> = ({ children, className, onClick }) => (
    <button onClick={onClick} className={clsx("rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-extrabold text-white shadow-sm transition-colors hover:border-[#3457ff]/60 hover:bg-white/[0.08]", className)}>
        {children}
    </button>
);
