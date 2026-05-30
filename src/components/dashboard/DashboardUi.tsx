import clsx from "clsx";

export const Panel: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
    <section className={clsx("rounded-2xl border border-[#dbe3ef] bg-white/95 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur", className)}>
        {children}
    </section>
);

export const MutedText: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
    <p className={clsx("text-[#64748b]", className)}>{children}</p>
);

export const StatCard: React.FC<{
    label: string;
    value: string;
    icon: React.ReactNode;
    tone?: "blue" | "green" | "purple" | "yellow" | "red";
    description?: string;
}> = ({ label, value, icon, tone = "blue", description }) => {
    const tones = {
        blue: "text-[#3457ff] bg-[#eef3ff] ring-[#c8d5ff]",
        green: "text-[#0f9f6e] bg-[#eafaf3] ring-[#bdebd7]",
        purple: "text-[#8b5cf6] bg-[#f3efff] ring-[#ddd2ff]",
        yellow: "text-[#ad6b00] bg-[#fff7df] ring-[#f6dd96]",
        red: "text-[#d92d20] bg-[#fff1ef] ring-[#ffd0cb]",
    };

    return (
        <Panel className="flex min-h-[120px] items-center justify-between overflow-hidden">
            <div>
                <MutedText className="text-sm font-bold uppercase tracking-[0.08em]">{label}</MutedText>
                <p className={clsx("mt-2 text-3xl font-extrabold tracking-normal", tone === "red" && "text-[#d92d20]")}>{value}</p>
                {description && <MutedText className="mt-1 text-sm">{description}</MutedText>}
            </div>
            <div className={clsx("flex h-12 w-12 items-center justify-center rounded-xl text-2xl ring-1", tones[tone])}>{icon}</div>
        </Panel>
    );
};

export const Disclaimer: React.FC = () => (
    <div className="rounded-2xl border border-[#f5d889] bg-[#fffaf0] p-4 text-sm leading-relaxed text-[#7a4a09] shadow-[0_10px_30px_rgba(122,74,9,0.06)]">
        <strong>Disclaimer:</strong> GPT Chart View provides AI-powered chart analysis for educational purposes only. It does not offer financial advice or guarantee trading results. Trading involves risk, and users should conduct their own research or consult a licensed financial advisor before making investment decisions.
    </div>
);

export const PrimaryButton: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
    <button className={clsx("rounded-xl bg-[#3457ff] px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_25px_rgba(52,87,255,0.22)] transition-colors hover:bg-[#263fd2] disabled:opacity-60", className)}>
        {children}
    </button>
);

export const LightButton: React.FC<React.PropsWithChildren<{ className?: string; onClick?: () => void }>> = ({ children, className, onClick }) => (
    <button onClick={onClick} className={clsx("rounded-xl border border-[#dbe3ef] bg-white px-5 py-3 text-sm font-extrabold text-[#111827] shadow-sm transition-colors hover:border-[#3457ff] hover:text-[#3457ff]", className)}>
        {children}
    </button>
);
