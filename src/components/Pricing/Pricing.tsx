import PricingColumn from "./PricingColumn";
import { tiers } from "@/data/pricing";

const Pricing: React.FC = () => {
    return (
        <div className="rounded-lg border border-white/10 bg-[#090d18] p-5 sm:p-8 lg:p-10">
            <div className="mx-auto mb-10 max-w-3xl text-center">
                <p className="text-sm font-extrabold uppercase text-[#16c7ff]">Membership access</p>
                <h2 className="mt-4 text-4xl font-extrabold leading-tight text-white md:text-6xl">
                    Choose your chart analysis pass
                </h2>
                <p className="mt-5 text-lg leading-8 text-white/62">
                    Trial users get three total analyses. Paid plans unlock daily upload limits, saved history, AI chat, billing, profile, and support access.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {tiers.map((tier, index) => (
                    <PricingColumn key={tier.name} tier={tier} highlight={index === 1} />
                ))}
            </div>

            <div className="mt-8 grid gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5 text-white md:grid-cols-3">
                <p className="font-extrabold">Account required</p>
                <p className="text-white/62">Every upload syncs to a signed-in user.</p>
                <p className="text-white/62">Credits follow the plan attached to the account.</p>
            </div>
        </div>
    );
};

export default Pricing;
