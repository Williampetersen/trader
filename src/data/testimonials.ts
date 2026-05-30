import { ITestimonial } from "@/types";
import { siteDetails } from "./siteDetails";

export const testimonials: ITestimonial[] = [
    {
        name: 'Marcus Lee',
        role: 'Swing trader',
        message: `${siteDetails.siteName} helps me pressure-test a setup before I add it to my watchlist. The score makes weak charts much easier to skip.`,
        avatar: '/images/testimonial-1.webp',
    },
    {
        name: 'Nadia Brooks',
        role: 'Crypto analyst',
        message: `I like that the report gives both bullish and bearish cases. It keeps the analysis balanced instead of forcing one trade idea.`,
        avatar: '/images/testimonial-2.webp',
    },
    {
        name: 'Ethan Carter',
        role: 'Trading community owner',
        message: `The subscription model is clear for members: upload charts, receive structured feedback, and keep a searchable record of every review.`,
        avatar: '/images/testimonial-3.webp',
    },
];
