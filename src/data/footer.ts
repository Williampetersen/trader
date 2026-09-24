import { IMenuItem } from "@/types";

export const footerDetails: {
    disclaimers: string[];
    columns: { title: string; links: IMenuItem[] }[];
    email: string;
} = {
    disclaimers: [
        "Trading stocks, forex, crypto and other financial instruments involves a high level of risk and may not be suitable for everyone. You can lose some or all of the money you invest.",
        "GPT Chart View provides AI-generated educational analysis of chart images. It is not investment, financial or trading advice, and it is not a recommendation to buy or sell any asset. Levels are estimated from the image you upload and can differ from live market prices. Example results on this site are for illustration only.",
    ],
    columns: [
        {
            title: "Product",
            links: [
                { text: "How it works", url: "/#how-it-works" },
                { text: "Features", url: "/#features" },
                { text: "Pricing", url: "/#pricing" },
                { text: "FAQ", url: "/#faq" },
            ],
        },
        {
            title: "Account",
            links: [
                { text: "Create account", url: "/signup" },
                { text: "Log in", url: "/login" },
                { text: "Upload a chart", url: "/dashboard/upload" },
                { text: "Billing", url: "/dashboard/billing" },
            ],
        },
        {
            title: "Resources",
            links: [
                { text: "AI Trading Blog", url: "/blog" },
                { text: "Sitemap", url: "/sitemap" },
                { text: "RSS feed", url: "/rss.xml" },
            ],
        },
        {
            title: "Support",
            links: [
                { text: "Contact us", url: "/contact" },
                { text: "Help for members", url: "/dashboard/support" },
            ],
        },
    ],
    email: 'support@gptchartview.com',
}
