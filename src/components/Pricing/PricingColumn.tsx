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
            "relative flex min-h-[390px] flex-col rounded-2xl border bg-white p-6 shadow-sm transition-transform hover:-translate-y-1",
            highlight ? "border-secondary shadow-xl" : "border-gray-200"
        )}>
            {highlight && (
                <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-extrabold text-black">
                    <BsStarFill />
                    Best start
                </div>
            )}

            <div className="pb-6">
                <h3 className="text-2xl font-extrabold">{name}</h3>
                <p className="mt-2 min-h-10 text-base text-foreground-accent">{description}</p>
                <p className="mt-8 flex items-end gap-3">
                    <span className="text-5xl font-extrabold">${price}</span>
                    <span className="pb-2 text-base text-foreground-accent">{duration}</span>
                </p>
            </div>

            <ul className="space-y-4 border-t border-gray-200 pt-6">
                {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                        <BsCheckCircle className="mt-1 h-5 w-5 shrink-0 text-[#079455]" />
                        <span className="text-base text-foreground-accent">{feature}</span>
                    </li>
                ))}
            </ul>

            <Link href="/signup" className={clsx(
                "mt-auto flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-extrabold transition-colors",
                highlight ? "bg-secondary text-white hover:bg-[#243cc7]" : "bg-[#101828] text-white hover:bg-[#263346]"
            )}>
                Create account
                <BsArrowRight />
            </Link>
        </div>
    );
};

export default PricingColumn;
