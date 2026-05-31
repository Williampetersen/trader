import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/data/blog";
import { siteDetails } from "@/data/siteDetails";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/dashboard/", "/owner/"],
            },
        ],
        sitemap: absoluteUrl("/sitemap.xml"),
        host: new URL(siteDetails.siteUrl).origin,
    };
}
