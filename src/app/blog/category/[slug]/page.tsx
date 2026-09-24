import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowRight, FiFolder } from "react-icons/fi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import BlogCard from "@/components/blog/BlogCard";
import Breadcrumbs from "@/components/blog/Breadcrumbs";
import NewsletterSignup from "@/components/blog/NewsletterSignup";
import { absoluteUrl, blogCategories, getArticlesByCategory } from "@/data/blog";
import { siteDetails } from "@/data/siteDetails";

const getCategory = (slug: string) => blogCategories.find((category) => category.slug === slug);

export function generateStaticParams() {
    return blogCategories.map((category) => ({ slug: category.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
    const category = getCategory(params.slug);
    if (!category) return {};
    const title = `${category.name} Articles | GPT Chart View AI Trading Blog`;
    const description = `${category.description} Read practical GPT Chart View education articles with examples, FAQs, internal links, and risk-aware AI trading workflows.`;
    const url = absoluteUrl(`/blog/category/${category.slug}`);

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            type: "website",
            images: [{ url: "/images/hero-chart.webp", width: 1200, height: 675, alt: `${category.name} AI trading articles` }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/images/hero-chart.webp"],
        },
    };
}

const BlogCategoryPage = ({ params }: { params: { slug: string } }) => {
    const category = getCategory(params.slug);
    if (!category) notFound();
    const articles = getArticlesByCategory(category.slug);
    const url = absoluteUrl(`/blog/category/${category.slug}`);
    const schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: category.name,
        description: category.description,
        url,
        publisher: { "@type": "Organization", name: siteDetails.siteName, url: siteDetails.siteUrl },
        hasPart: articles.map((article) => ({
            "@type": "Article",
            headline: article.title,
            url: absoluteUrl(`/blog/${article.slug}`),
        })),
    };
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteDetails.siteUrl },
            { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
            { "@type": "ListItem", position: 3, name: category.name, item: url },
        ],
    };

    return (
        <>
            <Header />
            <main className="bg-canvas pt-28">
                {[schema, breadcrumbSchema].map((item, index) => (
                    <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
                ))}
                <section className="py-14">
                    <Container>
                        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: category.name }]} />
                        <div className="rounded-[28px] border border-black/[0.08] bg-white p-6 md:p-10">
                            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
                                <FiFolder />
                                Topic
                            </div>
                            <h1 className="mt-5 max-w-4xl break-words text-4xl font-semibold leading-tight text-ink sm:text-5xl md:text-6xl">{category.name}</h1>
                            <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">{category.description}</p>
                            <p className="mt-6 text-sm font-semibold text-muted">{articles.length} articles</p>
                        </div>
                    </Container>
                </section>
                <section className="pb-14">
                    <Container>
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {articles.map((article) => <BlogCard key={article.slug} article={article} />)}
                        </div>
                        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
                            <NewsletterSignup source={`category:${category.slug}`} />
                            <div className="rounded-[28px] bg-ink p-6 text-white">
                                <h2 className="text-2xl font-semibold">Build a trading workflow</h2>
                                <p className="mt-3 text-white/70">Move from education to execution by uploading a clean chart and saving the AI result inside your dashboard.</p>
                                <Link href="/signup" className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 font-semibold text-white transition-colors hover:bg-accent-hover">
                                    Start free
                                    <FiArrowRight />
                                </Link>
                            </div>
                        </div>
                    </Container>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default BlogCategoryPage;
