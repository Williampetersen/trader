import { IFAQ } from "@/types";
import { siteDetails } from "./siteDetails";

export const faqs: IFAQ[] = [
    {
        question: 'What charts can I upload?',
        answer: 'Any clear screenshot of a price chart: crypto, forex, stocks, indices or commodities, from TradingView, MT4, MT5, Binance or your broker app. Images can be up to 7 MB. Charts with visible price labels and a readable timeframe give the best results.',
    },
    {
        question: 'What does the AI give me back?',
        answer: 'A structured read of your chart: Buy, Sell or Watch, the trend, support and resistance, a possible entry, stop-loss and two targets, a confidence score, the risk/reward and a short explanation. You can then ask follow-up questions in chat.',
    },
    {
        question: 'How accurate are the levels?',
        answer: 'The AI reads levels from your image, so they are estimates rather than live market prices. Every result is checked before you see it: a Buy, for example, must have its stop-loss below the entry and its targets above it. If the levels don\'t add up, the result is marked Watch. Risk/reward is calculated by our server from the exact levels.',
    },
    {
        question: `Is ${siteDetails.siteName} financial advice?`,
        answer: `No. ${siteDetails.siteName} gives educational analysis of what is visible on your chart. It doesn't know your finances or your risk tolerance, and no analysis can guarantee a result. Always make your own decision and only risk money you can afford to lose.`,
    },
    {
        question: 'What happens after my 3 free analyses?',
        answer: 'Your free analyses never expire and no card is needed to start. Once you have used all three, choose a weekly or monthly plan to keep uploading. Paid plans include a daily upload allowance that resets every day.',
    },
    {
        question: 'Are my charts private?',
        answer: 'Yes. Your uploads, results and chat history are linked to your account and visible only to you. Chart images are sent to our AI provider only to generate your analysis.',
    },
    {
        question: 'How do I change or cancel my plan?',
        answer: 'Email support@gptchartview.com or open a ticket from the Support page in your dashboard, and we will take care of it. We usually reply the same business day.',
    },
];
