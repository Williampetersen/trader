export type PlanName = "Trial" | "Starter" | "Active Traders" | "Advanced Traders";

export interface PlanConfig {
    name: PlanName;
    price: number;
    durationDays: number;
    durationLabel: string;
    dailyLimit: number;
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
    Starter: {
        name: "Starter",
        price: 2.99,
        durationDays: 7,
        durationLabel: "7 Days",
        dailyLimit: 10,
        description: "Short-term access for testing",
        features: [
            "AI analysis (full output)",
            "Up to 10 uploads per day",
            "7-day access",
        ],
        prioritySupport: false,
    },
    "Active Traders": {
        name: "Active Traders",
        price: 9.99,
        durationDays: 30,
        durationLabel: "30 Days",
        dailyLimit: 20,
        description: "Best for consistent daily usage",
        features: [
            "AI analysis (full output)",
            "Up to 20 uploads per day",
            "30-day access",
        ],
        prioritySupport: false,
    },
    "Advanced Traders": {
        name: "Advanced Traders",
        price: 29.99,
        durationDays: 30,
        durationLabel: "30 Days",
        dailyLimit: 60,
        description: "Built for power users",
        features: [
            "AI analysis (full output)",
            "Up to 60 uploads per day",
            "30-day access",
            "Priority support",
        ],
        prioritySupport: true,
    },
};

export const paidPlanNames: PlanName[] = ["Starter", "Active Traders", "Advanced Traders"];
export const paidPlans = paidPlanNames.map((name) => planCatalog[name]);

export function getPlanConfig(planName: PlanName) {
    return planCatalog[planName];
}

export function planPriceLabel(planName: PlanName) {
    return `$${getPlanConfig(planName).price.toFixed(2)}`;
}
