import type { MetadataRoute } from "next";
import { absoluteUrl, blogArticles, blogCategories, blogTags, slugify } from "@/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes = [
        { path: "/", priority: 1 },
        { path: "/blog", priority: 0.95 },
        { path: "/contact", priority: 0.7 },
        { path: "/login", priority: 0.45 },
        { path: "/signup", priority: 0.85 },
        { path: "/sitemap", priority: 0.5 },
    ];

    const routes: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
        url: absoluteUrl(route.path),
        lastModified: new Date("2026-05-31"),
        changeFrequency: route.path === "/blog" ? "weekly" : "monthly",
        priority: route.priority,
    }));

    blogArticles.forEach((article) => {
        routes.push({
            url: absoluteUrl(`/blog/${article.slug}`),
            lastModified: new Date(article.updatedAt),
            changeFrequency: "monthly",
            priority: article.category.slug === "ai-trading-basics" || article.category.slug === "gpt-trading" ? 0.9 : 0.82,
        });
    });

    blogCategories.forEach((category) => {
        routes.push({
            url: absoluteUrl(`/blog/category/${category.slug}`),
            lastModified: new Date("2026-05-31"),
            changeFrequency: "weekly",
            priority: 0.75,
        });
    });

    blogTags.forEach((tag) => {
        routes.push({
            url: absoluteUrl(`/blog/tag/${slugify(tag)}`),
            lastModified: new Date("2026-05-31"),
            changeFrequency: "weekly",
            priority: 0.62,
        });
    });

    return routes;
}
