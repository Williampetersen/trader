import { IMenuItem, ISocials } from "@/types";

export const footerDetails: {
    subheading: string;
    quickLinks: IMenuItem[];
    email: string;
    telephone: string;
    socials: ISocials;
} = {
    subheading: "AI-powered chart review, trade scoring, risk notes, and private decision history for active traders.",
    quickLinks: [
        {
            text: "Product",
            url: "#product"
        },
        {
            text: "Workflow",
            url: "#workflow"
        },
        {
            text: "Pricing",
            url: "/#pricing"
        },
        {
            text: "AI Trading Blog",
            url: "/blog"
        },
        {
            text: "HTML Sitemap",
            url: "/sitemap"
        },
        {
            text: "Contact",
            url: "/contact"
        },
    ],
    email: 'support@gptchartview.com',
    telephone: '+1 (123) 456-7890',
    socials: {
        // github: 'https://github.com',
        // x: 'https://twitter.com/x',
        twitter: 'https://twitter.com/Twitter',
        facebook: 'https://facebook.com',
        // youtube: 'https://youtube.com',
        linkedin: 'https://www.linkedin.com',
        // threads: 'https://www.threads.net',
        instagram: 'https://www.instagram.com',
    }
}
