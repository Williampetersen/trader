import PricingColumn from "./PricingColumn";
import { tiers } from "@/data/pricing";

const Pricing: React.FC = () => {
    return (
        <div className="rounded-3xl border border-gray-200 bg-[#f8fafc] p-5 sm:p-8 lg:p-10">
            <div className="mx-auto mb-10 max-w-3xl text-center">
                <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-secondary">Membership required</p>
                <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">Pick a pass and unlock the dashboard</h2>
                <p className="mt-4 text-foreground-accent">
                    Visitors can read the pitch. Members get uploads, saved analysis history, AI chat, billing, profile, and private trade review records.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {tiers.map((tier, index) => (
                    <PricingColumn key={tier.name} tier={tier} highlight={index === 1} />
                ))}
            </div>

            <div className="mt-8 grid gap-4 rounded-2xl bg-white p-5 md:grid-cols-3">
                <p className="font-bold">No guest dashboard</p>
                <p className="text-foreground-accent">Every upload is attached to a user account.</p>
                <p className="text-foreground-accent">Trial users can start immediately after signup.</p>
            </div>
        </div>
    );
};

export default Pricing;
