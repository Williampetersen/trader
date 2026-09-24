import PricingColumn from "./PricingColumn";
import { tiers } from "@/data/pricing";

const Pricing: React.FC = () => {
    return (
        <div>
            <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-[40px] font-semibold leading-[1.1] md:text-[56px]">
                    Start free. Upgrade when you&apos;re ready.
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-[19px] leading-[1.45] text-muted md:text-[21px]">
                    Every account includes 3 free analyses with the full output. No card required.
                </p>
            </div>

            <div className="mx-auto mt-14 grid max-w-[1100px] grid-cols-1 gap-5 lg:grid-cols-3">
                {tiers.map((tier, index) => (
                    <PricingColumn key={tier.name} tier={tier} highlight={index === 1} />
                ))}
            </div>

            <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-[1.5] text-muted">
                Plans renew automatically each week or month until cancelled. Payments are processed securely by Stripe.
                Need to change or cancel your plan? Email <a href="mailto:support@gptchartview.com" className="text-link hover:underline">support@gptchartview.com</a>.
            </p>
        </div>
    );
};

export default Pricing;
