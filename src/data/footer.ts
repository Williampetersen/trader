import { IMenuItem, ISocials } from "@/types";

export const footerDetails: {
    subheading: string;
    quickLinks: IMenuItem[];
    email: string;
    telephone: string;
    socials: ISocials;
} = {
    subheading: "AI-powered chart review, trade scoring, and risk notes for active traders.",
    quickLinks: [
        {
            text: "Features",
            url: "#features"
        },
        {
            text: "How it works",
            url: "#workflow"
        },
        {
            text: "Pricing",
            url: "#pricing"
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
