import { IPricing } from "@/types";
import { paidPlans } from "./plans";

export const tiers: IPricing[] = paidPlans.map((plan) => ({
    name: plan.name,
    price: plan.price,
    duration: plan.durationLabel,
    description: plan.description,
    features: plan.features,
}));
