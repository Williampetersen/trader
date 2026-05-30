import { FiActivity, FiBarChart2, FiCheckSquare, FiClock, FiImage, FiLayers, FiShield, FiTarget, FiTrendingUp } from "react-icons/fi";

import { IBenefit } from "@/types"

export const benefits: IBenefit[] = [
    {
        title: "Upload a chart and get a structured read",
        description: "Turn messy chart screenshots into a clear technical-analysis report with the levels and signals traders look for first.",
        bullets: [
            {
                title: "Screenshot-first workflow",
                description: "Users can submit chart images from trading platforms, broker apps, or mobile screenshots.",
                icon: <FiImage size={26} />
            },
            {
                title: "Key levels extracted",
                description: "The output highlights likely support, resistance, breakout, and invalidation areas.",
                icon: <FiLayers size={26} />
            },
            {
                title: "Trend and momentum view",
                description: "Get a concise read on market direction, momentum, and conflicting chart evidence.",
                icon: <FiTrendingUp size={26} />
            }
        ],
        imageSrc: "/images/hero-chart.webp"
    },
    {
        title: "Trade score built for fast decisions",
        description: "Give every analysis a simple score that helps users decide whether a setup deserves attention, caution, or a pass.",
        bullets: [
            {
                title: "Setup quality score",
                description: "Score potential trades using trend, level clarity, momentum, and reward-to-risk structure.",
                icon: <FiTarget size={26} />
            },
            {
                title: "Long and short scenarios",
                description: "Show bullish and bearish cases so users can compare confirmation against invalidation.",
                icon: <FiActivity size={26} />
            },
            {
                title: "Clear action labels",
                description: "Summaries can mark a chart as Watch, Wait, Avoid, or High Conviction for easier scanning.",
                icon: <FiCheckSquare size={26} />
            }
        ],
        imageSrc: "/images/mockup-1.webp"
    },
    {
        title: "Subscription access made simple",
        description: "Sell access with monthly upload limits, saved reports, priority queues, and plan-based analysis depth.",
        bullets: [
            {
                title: "Plan-based usage",
                description: "Limit uploads by subscription tier and reserve advanced analysis for higher plans.",
                icon: <FiBarChart2 size={26} />
            },
            {
                title: "Saved report library",
                description: "Users can revisit prior analysis, compare setups, and build a cleaner decision process.",
                icon: <FiClock size={26} />
            },
            {
                title: "Responsible risk framing",
                description: "Every report can include risk notes and reminders that analysis is educational, not guaranteed profit.",
                icon: <FiShield size={26} />
            }
        ],
        imageSrc: "/images/mockup-2.webp"
    },
]
