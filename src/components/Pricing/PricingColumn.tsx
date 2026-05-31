import Link from "next/link";
import clsx from "clsx";
import { BsArrowRight, BsCheckCircle, BsStarFill } from "react-icons/bs";

import { IPricing } from "@/types";

interface Props {
    tier: IPricing;
    highlight?: boolean;
}

const PricingColumn: React.FC<Props> = ({ tier, highlight }: Props) => {
    const { name, price, duration, description, features } = tier;

    return (
        <div className={clsx(
            "relative flex min-h-[410px] flex-col rounded-lg border p-6 transition-transform hover:-translate-y-1",
            highlight ? "border-[#16c7ff] bg-[#0d1730] shadow-[0_0_40px_rgba(22,199,255,0.16)]" : "border-white/10 bg-white/[0.035]"
        )}>
            {highlight && (
                <div className="absolute right-5 top-5 flex items-center gap-2 rounded-lg bg-[#fed835] px-3 py-1 text-xs font-extrabold text-black">
                    <BsStarFill />
                    Most selected
                </div>
            )}

            <div className="pb-6">
                <h3 className="text-2xl font-extrabold text-white">{name}</h3>
                <p className="mt-2 min-h-12 text-base text-white/58">{description}</p>
                <p className="mt-8 flex items-end gap-3">
                    <span className="text-5xl font-extrabold text-white">${price}</span>
                    <span className="pb-2 text-base font-semibold text-white/50">{duration}</span>
                </p>
            </div>

            <ul className="space-y-4 border-t border-white/10 pt-6">
                {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                        <BsCheckCircle className="mt-1 h-5 w-5 shrink-0 text-[#21e7a4]" />
                        <span className="text-base text-white/68">{feature}</span>
                    </li>
                ))}
            </ul>

            <Link href="/signup" className={clsx(
                "mt-auto flex w-full items-center justify-center gap-3 rounded-lg px-4 py-3 text-sm font-extrabold transition-colors",
                highlight ? "bg-[#16c7ff] text-[#03111a] hover:bg-white" : "bg-white text-[#05070f] hover:bg-[#dff7ff]"
            )}>
                Create account
                <BsArrowRight />
            </Link>
        </div>
    );
};

export default PricingColumn;
