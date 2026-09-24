import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { FiExternalLink, FiMap } from "react-icons/fi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/blog/Breadcrumbs";
import { absoluteUrl, blogArticles, blogCategories, blogTags, getArticlesByCategory, slugify } from "@/data/blog";

export const metadata: Metadata = {
    title: "HTML Sitemap | GPT Chart View",
    description: "Human-readable sitemap for GPT Chart View including AI trading blog articles, topic clusters, tags, and main website pages.",
    alternates: { canonical: absoluteUrl("/sitemap") },
    openGraph: {
        title: "HTML Sitemap | GPT Chart View",
        description: "Browse GPT Chart View pages, AI trading articles, categories, and tags.",
        url: absoluteUrl("/sitemap"),
        type: "website",
        images: [{ url: "/images/hero-chart.webp", width: 1200, height: 675, alt: "GPT Chart View sitemap" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "HTML Sitemap | GPT Chart View",
        description: "Browse GPT Chart View pages, AI trading articles, categories, and tags.",
        images: ["/images/hero-chart.webp"],
    },
};

const mainPages = [
    { label: "Home", href: "/" },
    { label: "AI Trading Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Signup", href: "/signup" },
    { label: "Login", href: "/login" },
    { label: "RSS Feed", href: "/rss.xml" },
    { label: "XML Sitemap", href: "/sitemap.xml" },
];

const HtmlSitemapPage = () => (
    <>
        <Header />
        <main className="bg-canvas pt-28">
            <section className="py-14">
                <Container>
                    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sitemap" }]} />
                    <div className="rounded-[28px] border border-black/[0.08] bg-white p-6 md:p-10">
                        <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
                            <FiMap />
                            Sitemap
                        </div>
                        <h1 className="mt-5 max-w-4xl break-words text-4xl font-semibold leading-tight text-ink sm:text-5xl md:text-6xl">GPT Chart View sitemap</h1>
                        <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">
                            Browse the main website pages, AI trading topics, tags, and all {blogArticles.length} blog articles.
                        </p>
                    </div>
                </Container>
            </section>

            <section className="pb-16">
                <Container>
                    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                        <SitemapPanel title="Main pages">
                            {mainPages.map((page) => <SitemapLink key={page.href} href={page.href} label={page.label} />)}
                        </SitemapPanel>

                        <SitemapPanel title="Topics">
                            {blogCategories.map((category) => (
                                <div key={category.slug} className="rounded-2xl border border-black/[0.08] bg-canvas p-4">
                                    <SitemapLink href={`/blog/category/${category.slug}`} label={category.name} />
                                    <p className="mt-2 text-sm text-muted">{category.description}</p>
                                    <p className="mt-3 text-sm font-semibold text-accent">{getArticlesByCategory(category.slug).length} articles</p>
                                </div>
                            ))}
                        </SitemapPanel>
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                        <SitemapPanel title="All AI trading articles">
                            <div className="grid gap-3 md:grid-cols-2">
                                {blogArticles.map((article) => (
                                    <Link key={article.slug} href={`/blog/${article.slug}`} className="rounded-2xl border border-black/[0.08] bg-canvas p-4 hover:border-accent hover:bg-white">
                                        <span className="block text-sm font-semibold text-accent">{article.category.name}</span>
                                        <span className="mt-1 block font-semibold text-ink">{article.title}</span>
                                    </Link>
                                ))}
                            </div>
                        </SitemapPanel>

                        <SitemapPanel title="Tags">
                            <div className="flex flex-wrap gap-2">
                                {blogTags.map((tag) => (
                                    <Link key={tag} href={`/blog/tag/${slugify(tag)}`} className="rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/15">
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                        </SitemapPanel>
                    </div>
                </Container>
            </section>
        </main>
        <Footer />
    </>
);

const SitemapPanel = ({ title, children }: { title: string; children: ReactNode }) => (
    <div className="rounded-[28px] border border-black/[0.08] bg-white p-5 shadow-sm md:p-7">
        <h2 className="text-2xl font-semibold text-ink">{title}</h2>
        <div className="mt-5 grid gap-3">{children}</div>
    </div>
);

const SitemapLink = ({ href, label }: { href: string; label: string }) => (
    <Link href={href} className="inline-flex items-center gap-2 font-semibold text-ink hover:text-accent">
        {label}
        {href.endsWith(".xml") && <FiExternalLink className="text-accent" />}
    </Link>
);

export default HtmlSitemapPage;
