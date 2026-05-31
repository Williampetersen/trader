export type PlanName = "Trial" | "Basic Access" | "Pro Trader" | "Advanced Traders";

export interface PlanConfig {
    name: PlanName;
    price: number;
    durationDays: number;
    durationLabel: string;
    dailyLimit: number;
    billingInterval?: "week" | "month";
    stripePriceEnv?: string;
    description: string;
    features: string[];
    prioritySupport: boolean;
}

export const planCatalog: Record<PlanName, PlanConfig> = {
    Trial: {
        name: "Trial",
        price: 0,
        durationDays: 1,
        durationLabel: "1 Day",
        dailyLimit: 3,
        description: "Free access for first-time members",
        features: [
            "AI analysis (full output)",
            "Up to 3 uploads per day",
            "1-day access",
        ],
        prioritySupport: false,
    },
    "Basic Access": {
        name: "Basic Access",
        price: 19,
        durationDays: 7,
        durationLabel: "Per week",
        dailyLimit: 10,
        billingInterval: "week",
        stripePriceEnv: "STRIPE_PRICE_BASIC_ACCESS",
        description: "Weekly access for focused chart reviews",
        features: [
            "AI analysis (full output)",
            "Up to 10 uploads per day",
            "Weekly subscription access",
        ],
        prioritySupport: false,
    },
    "Pro Trader": {
        name: "Pro Trader",
        price: 49,
        durationDays: 30,
        durationLabel: "Per month",
        dailyLimit: 20,
        billingInterval: "month",
        stripePriceEnv: "STRIPE_PRICE_PRO_TRADER",
        description: "Best for consistent daily usage",
        features: [
            "AI analysis (full output)",
            "Up to 20 uploads per day",
            "Monthly subscription access",
        ],
        prioritySupport: false,
    },
    "Advanced Traders": {
        name: "Advanced Traders",
        price: 99,
        durationDays: 30,
        durationLabel: "Per month",
        dailyLimit: 60,
        billingInterval: "month",
        stripePriceEnv: "STRIPE_PRICE_ADVANCED_TRADERS",
        description: "Built for power users",
        features: [
            "AI analysis (full output)",
            "Up to 60 uploads per day",
            "Monthly subscription access",
            "Priority support",
        ],
        prioritySupport: true,
    },
};

export const paidPlanNames: PlanName[] = ["Basic Access", "Pro Trader", "Advanced Traders"];
export const paidPlans = paidPlanNames.map((name) => planCatalog[name]);

export function getPlanConfig(planName: PlanName) {
    return planCatalog[planName];
}

export function planPriceLabel(planName: PlanName) {
    return `$${getPlanConfig(planName).price.toFixed(2)}`;
}
