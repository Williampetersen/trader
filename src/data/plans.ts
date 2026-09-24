export type PlanName = "Trial" | "Basic Access" | "Pro Trader" | "Advanced Traders";

export interface PlanConfig {
    name: PlanName;
    price: number;
    durationDays: number;
    durationLabel: string;
    dailyLimit: number;
    creditReset: "none" | "daily";
    allowanceLabel: string;
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
        durationLabel: "No time limit",
        dailyLimit: 3,
        creditReset: "none",
        allowanceLabel: "3 total trial analyses",
        description: "Free access for first-time members",
        features: [
            "AI analysis (full output)",
            "3 total trial chart uploads",
            "Upgrade required after trial credits finish",
        ],
        prioritySupport: false,
    },
    "Basic Access": {
        name: "Basic Access",
        price: 19,
        durationDays: 7,
        durationLabel: "Per week",
        dailyLimit: 10,
        creditReset: "daily",
        allowanceLabel: "10 uploads per day",
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
        creditReset: "daily",
        allowanceLabel: "20 uploads per day",
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
        creditReset: "daily",
        allowanceLabel: "60 uploads per day",
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
