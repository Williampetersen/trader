import { IPricing } from "@/types";

export const tiers: IPricing[] = [
    {
        name: 'Basic',
        price: 19,
        features: [
            '30 chart uploads per month',
            'AI trade score and summary',
            'Trend, support, and resistance read',
            'Saved analysis history',
        ],
    },
    {
        name: 'Pro Trader',
        price: 49,
        features: [
            '200 chart uploads per month',
            'Long and short scenario plans',
            'Entry, invalidation, and target zones',
            'Multi-timeframe checklist',
            'Priority analysis queue',
        ],
    },
    {
        name: 'Desk',
        price: 'Custom',
        features: [
            'Team seats and shared workspaces',
            'Custom upload limits',
            'Private strategy templates',
            'Admin billing and usage controls',
            'Dedicated onboarding',
        ],
    },
]
