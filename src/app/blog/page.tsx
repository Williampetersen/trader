import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowRight, FiBookOpen, FiGrid } from "react-icons/fi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import BlogCard from "@/components/blog/BlogCard";
import NewsletterSignup from "@/components/blog/NewsletterSignup";
import { absoluteUrl, blogArticles, blogCategories, blogTags, slugify } from "@/data/blog";
import { siteDetails } from "@/data/siteDetails";

export const metadata: Metadata = {
    title: "AI Trading Blog | GPT Trading, Forex AI, Crypto AI, and Trading Signals",
    description: "Read expert guides on AI trading, ChatGPT trading, AI-powered signals, Forex AI tools, crypto AI trading, bots, risk management, and market analysis.",
    alternates: { canonical: absoluteUrl("/blog") },
    openGraph: {
        title: "AI Trading Blog by GPT Chart View",
        description: "Comprehensive AI trading education for GPT trading, AI signals, Forex AI, crypto AI, and automated trading systems.",
        url: absoluteUrl("/blog"),
        type: "website",
        images: [{ url: "/images/hero-chart.webp", width: 1200, height: 675, alt: "GPT Chart View AI Trading Blog" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Trading Blog by GPT Chart View",
        description: "Learn AI trading workflows, GPT chart analysis, trading signals, bots, and risk management.",
        images: ["/images/hero-chart.webp"],
    },
};

const BlogIndexPage = () => (
    <>
        <Header />
        <main className="bg-[#f5f7fb] pt-28">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        name: "AI Trading Blog",
                        url: absoluteUrl("/blog"),
                        description: metadata.description,
                        publisher: {
                            "@type": "Organization",
                            name: siteDetails.siteName,
                            url: siteDetails.siteUrl,
                        },
                    }),
                }}
            />
            <section className="py-16">
                <Container>
                    <div className="grid items-end gap-8 lg:grid-cols-[1fr_0.65fr]">
                        <div>
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d9e2ef] bg-white px-4 py-2 text-sm font-semibold text-[#304fff] shadow-sm">
                                <FiBookOpen />
                                GPT Chart View blog
                            </div>
                            <h1 className="max-w-4xl break-words text-4xl font-semibold leading-tight text-[#101828] sm:text-5xl md:text-6xl">
                                AI Trading Blog: GPT strategies, signals, bots, Forex, crypto, and risk.
                            </h1>
                            <p className="mt-5 max-w-3xl text-xl leading-8 text-[#667085]">
                                A complete education hub for traders who want practical AI workflows, not hype. Start with the pillar guides, then move into tool selection, signal design, automation, and risk management.
                            </p>
                        </div>
                        <div className="rounded-[2rem] bg-[#101828] p-6 text-white">
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">In this blog</p>
                            <div className="mt-5 grid grid-cols-2 gap-4">
                                <Metric value={String(blogArticles.length)} label="Guides" />
                                <Metric value={String(blogCategories.length)} label="Topics" />
                                <Metric value={String(blogTags.length)} label="Tags" />
                                <Metric value={String(blogArticles.reduce((total, article) => total + article.faqs.length, 0))} label="Answered questions" />
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            <section className="pb-10">
                <Container>
                    <div className="rounded-[2rem] border border-[#d9e2ef] bg-white p-5 md:p-7">
                        <div className="mb-5 flex items-center gap-2">
                            <FiGrid className="text-[#304fff]" />
                            <h2 className="text-2xl font-semibold text-[#101828]">Browse by topic</h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {blogCategories.map((category) => (
                                <Link key={category.slug} href={`/blog/category/${category.slug}`} className="rounded-2xl border border-[#d9e2ef] bg-[#f8fafc] p-4 transition-colors hover:border-[#304fff] hover:bg-white">
                                    <h3 className="font-semibold text-[#101828]">{category.name}</h3>
                                    <p className="mt-2 text-sm text-[#667085]">{category.description}</p>
                                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#304fff]">Explore <FiArrowRight /></span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            <section className="py-10">
                <Container>
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {blogArticles.map((article) => <BlogCard key={article.slug} article={article} />)}
                    </div>
                </Container>
            </section>

            <section className="py-10">
                <Container>
                    <NewsletterSignup source="blog-index" />
                    <div className="mt-8 rounded-[2rem] border border-[#d9e2ef] bg-white p-5">
                        <h2 className="text-2xl font-semibold text-[#101828]">Popular tags</h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {blogTags.map((tag) => (
                                <Link key={tag} href={`/blog/tag/${slugify(tag)}`} className="rounded-full bg-[#eef2ff] px-4 py-2 text-sm font-bold text-[#304fff] hover:bg-[#dfe5ff]">
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>
        </main>
        <Footer />
    </>
);

const Metric = ({ value, label }: { value: string; label: string }) => (
    <div className="rounded-2xl bg-white/10 p-4">
        <strong className="block text-3xl">{value}</strong>
        <span className="text-sm text-[#d0d5dd]">{label}</span>
    </div>
);

export default BlogIndexPage;
