import { absoluteUrl, blogArticles } from "@/data/blog";
import { siteDetails } from "@/data/siteDetails";

export const dynamic = "force-static";

const escapeXml = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

export function GET() {
    const items = blogArticles
        .map((article) => {
            const url = absoluteUrl(`/blog/${article.slug}`);
            return `
        <item>
            <title>${escapeXml(article.title)}</title>
            <link>${url}</link>
            <guid>${url}</guid>
            <description>${escapeXml(article.metaDescription)}</description>
            <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
            <category>${escapeXml(article.category.name)}</category>
        </item>`;
        })
        .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>${escapeXml(siteDetails.siteName)} AI Trading Blog</title>
        <link>${absoluteUrl("/blog")}</link>
        <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml" />
        <description>${escapeXml(siteDetails.metadata.description)}</description>
        <language>${siteDetails.language}</language>
        <lastBuildDate>${new Date("2026-05-31").toUTCString()}</lastBuildDate>${items}
    </channel>
</rss>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
    });
}
