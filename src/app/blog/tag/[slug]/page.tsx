import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowRight, FiTag } from "react-icons/fi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import BlogCard from "@/components/blog/BlogCard";
import Breadcrumbs from "@/components/blog/Breadcrumbs";
import NewsletterSignup from "@/components/blog/NewsletterSignup";
import { absoluteUrl, blogTags, getArticlesByTag, slugify } from "@/data/blog";
import { siteDetails } from "@/data/siteDetails";

const getTagLabel = (slug: string) => blogTags.find((tag) => slugify(tag) === slug);

export function generateStaticParams() {
    return blogTags.map((tag) => ({ slug: slugify(tag) }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
    const tag = getTagLabel(params.slug);
    if (!tag) return {};
    const title = `${tag} Articles | GPT Chart View AI Trading Blog`;
    const description = `Read GPT Chart View articles tagged ${tag}, with practical AI trading examples, FAQs, risk controls, and internal learning paths.`;
    const url = absoluteUrl(`/blog/tag/${params.slug}`);

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            type: "website",
            images: [{ url: "/images/hero-chart.webp", width: 1200, height: 675, alt: `${tag} AI trading articles` }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/images/hero-chart.webp"],
        },
    };
}

const BlogTagPage = ({ params }: { params: { slug: string } }) => {
    const tag = getTagLabel(params.slug);
    if (!tag) notFound();
    const articles = getArticlesByTag(params.slug);
    const url = absoluteUrl(`/blog/tag/${params.slug}`);
    const schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${tag} Articles`,
        description: `AI trading articles tagged ${tag}.`,
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
            { "@type": "ListItem", position: 3, name: tag, item: url },
        ],
    };

    return (
        <>
            <Header />
            <main className="bg-[#f5f7fb] pt-28">
                {[schema, breadcrumbSchema].map((item, index) => (
                    <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
                ))}
                <section className="py-14">
                    <Container>
                        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: tag }]} />
                        <div className="rounded-[2rem] border border-[#d9e2ef] bg-white p-6 md:p-10">
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#eef2ff] px-4 py-2 text-sm font-extrabold text-[#304fff]">
                                <FiTag />
                                Topic tag
                            </div>
                            <h1 className="mt-5 max-w-4xl break-words text-4xl font-extrabold leading-tight text-[#101828] sm:text-5xl md:text-6xl">{tag}</h1>
                            <p className="mt-5 max-w-3xl text-xl leading-8 text-[#667085]">
                                Articles, examples, FAQs, and practical AI trading workflows related to {tag}.
                            </p>
                            <p className="mt-6 text-sm font-bold text-[#667085]">{articles.length} articles</p>
                        </div>
                    </Container>
                </section>
                <section className="pb-14">
                    <Container>
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {articles.map((article) => <BlogCard key={article.slug} article={article} />)}
                        </div>
                        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
                            <NewsletterSignup source={`tag:${params.slug}`} />
                            <div className="rounded-[2rem] bg-[#101828] p-6 text-white">
                                <h2 className="text-2xl font-extrabold">Analyze a real chart</h2>
                                <p className="mt-3 text-[#d0d5dd]">Use the member dashboard to upload chart screenshots, save AI notes, and track outcomes.</p>
                                <Link href="/signup" className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-extrabold text-black">
                                    Create account
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

export default BlogTagPage;
