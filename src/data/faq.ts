import { IFAQ } from "@/types";
import { siteDetails } from "./siteDetails";

export const faqs: IFAQ[] = [
    {
        question: `What does ${siteDetails.siteName} analyze?`,
        answer: 'Users can upload chart screenshots from stocks, forex, crypto, indices, or commodities. The AI reviews visible price action, indicators, patterns, and key levels from the image.',
    },
    {
        question: 'Does the AI tell users exactly when to trade?',
        answer: 'The product is designed to provide educational analysis, trade-quality scoring, and risk context. It should not be positioned as guaranteed financial advice or a promise of profit.',
    },
    {
        question: 'How does subscription access work?',
        answer: 'Each plan can include a monthly chart upload limit, saved analysis history, and advanced outputs such as targets, invalidation zones, and multi-timeframe checklists.'
    },
    {
        question: 'Can users upload charts from TradingView or brokers?',
        answer: 'Yes. The landing page is written for screenshot uploads, so users can export or capture charts from common trading platforms and submit the image for review.',
    },
    {
        question: 'What should the trade score mean?',
        answer: 'The score should summarize setup quality based on visible trend, momentum, level clarity, reward-to-risk structure, and conflicting signals. It is a decision-support signal, not a guarantee.'
    }
];
