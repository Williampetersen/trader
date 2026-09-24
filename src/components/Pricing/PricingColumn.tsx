import Link from "next/link";
import clsx from "clsx";
import { FiCheck } from "react-icons/fi";

import { IPricing } from "@/types";

interface Props {
    tier: IPricing;
    highlight?: boolean;
}

const PricingColumn: React.FC<Props> = ({ tier, highlight }: Props) => {
    const { name, price, duration, description, features } = tier;

    return (
        <div className={clsx(
            "relative flex flex-col rounded-[28px] bg-white p-8",
            highlight ? "ring-2 ring-accent" : "ring-1 ring-line"
        )}>
            {highlight && (
                <p className="absolute right-6 top-6 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                    Recommended
                </p>
            )}

            <h3 className="text-2xl font-semibold">{name}</h3>
            <p className="mt-1.5 text-[15px] text-muted">{description}</p>
            <p className="mt-8 flex items-baseline gap-2">
                <span className="text-5xl font-semibold tracking-[-0.03em]">${price}</span>
                <span className="text-[15px] text-muted">{duration?.toLowerCase()}</span>
            </p>

            <ul className="mt-8 flex-1 space-y-3 border-t border-line pt-6">
                {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-[15px]">
                        <FiCheck className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <Link href="/signup" className={clsx(
                "mt-10 block rounded-full px-5 py-3 text-center text-[15px] transition-colors",
                highlight ? "bg-accent text-white hover:bg-accent-hover" : "text-accent ring-1 ring-inset ring-accent hover:bg-accent hover:text-white"
            )}>
                Get started
            </Link>
        </div>
    );
};

export default PricingColumn;
