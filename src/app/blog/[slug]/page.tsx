import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowRight, FiCheckCircle, FiExternalLink, FiTag } from "react-icons/fi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import BlogCover from "@/components/blog/BlogCover";
import Breadcrumbs from "@/components/blog/Breadcrumbs";
import NewsletterSignup from "@/components/blog/NewsletterSignup";
import { absoluteUrl, blogArticles, getBlogArticle, getRelatedArticles, slugify } from "@/data/blog";
import { siteDetails } from "@/data/siteDetails";

export function generateStaticParams() {
    return blogArticles.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
    const article = getBlogArticle(params.slug);
    if (!article) return {};
    const url = absoluteUrl(`/blog/${article.slug}`);
    return {
        title: article.seoTitle,
        description: article.metaDescription,
        keywords: [article.focusKeyword, ...article.relatedKeywords],
        alternates: { canonical: url },
        openGraph: {
            title: article.seoTitle,
            description: article.metaDescription,
            url,
            type: "article",
            publishedTime: article.publishedAt,
            modifiedTime: article.updatedAt,
            authors: [article.author],
            tags: article.tags,
            images: [{ url: "/images/hero-chart.webp", width: 1200, height: 675, alt: article.heroAlt }],
        },
        twitter: {
            card: "summary_large_image",
            title: article.seoTitle,
            description: article.metaDescription,
            images: ["/images/hero-chart.webp"],
        },
    };
}

const BlogArticlePage = ({ params }: { params: { slug: string } }) => {
    const article = getBlogArticle(params.slug);
    if (!article) notFound();
    const related = getRelatedArticles(article);
    const url = absoluteUrl(`/blog/${article.slug}`);

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.metaDescription,
        image: absoluteUrl("/images/hero-chart.webp"),
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        author: { "@type": "Organization", name: article.author, url: siteDetails.siteUrl },
        publisher: {
            "@type": "Organization",
            name: siteDetails.siteName,
            url: siteDetails.siteUrl,
            logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
        },
        mainEntityOfPage: url,
        keywords: [article.focusKeyword, ...article.relatedKeywords].join(", "),
        wordCount: article.wordCount,
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: article.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteDetails.siteUrl },
            { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
            { "@type": "ListItem", position: 3, name: article.title, item: url },
        ],
    };

    return (
        <>
            <Header />
            <main className="bg-canvas pt-28">
                {[articleSchema, faqSchema, breadcrumbSchema].map((schema, index) => (
                    <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
                ))}
                <article>
                    <section className="py-12">
                        <Container>
                            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: article.category.name, href: `/blog/category/${article.category.slug}` }, { label: article.title }]} />
                            <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                                <div>
                                    <div className="mb-5 flex flex-wrap gap-2">
                                        <Link href={`/blog/category/${article.category.slug}`} className="rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">{article.category.name}</Link>
                                        <span className="rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-muted">{article.readingTime}</span>
                                    </div>
                                    <h1 className="max-w-5xl break-words text-4xl font-semibold leading-tight text-ink sm:text-5xl md:text-6xl">{article.title}</h1>
                                    <p className="mt-6 max-w-4xl text-xl leading-8 text-muted">{article.excerpt}</p>
                                    <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-muted">
                                        <span>By {article.author}</span>
                                        <span>Updated {article.updatedAt}</span>
                                        <span>{article.wordCount.toLocaleString()} words</span>
                                    </div>
                                </div>
                                <aside className="rounded-[28px] bg-ink p-6 text-white">
                                    <p className="text-sm font-semibold text-[#2997ff]">Direct answer</p>
                                    <p className="mt-4 text-lg leading-7 text-white/90">{article.directAnswer}</p>
                                    <Link href="/signup" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-semibold text-white transition-colors hover:bg-accent-hover">
                                        Analyze your chart
                                        <FiArrowRight />
                                    </Link>
                                </aside>
                            </div>
                            <div className="relative mt-10 overflow-hidden rounded-[28px] ring-1 ring-black/[0.06]">
                                <BlogCover seed={article.slug} variant="wide" className="h-[240px] w-full md:h-[340px]" />
                            </div>
                        </Container>
                    </section>

                    <Container>
                        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
                            <div className="rounded-[28px] border border-black/[0.08] bg-white p-6 text-lg leading-8 text-ink md:p-10">
                                <section>
                                    <h2 className="text-3xl font-semibold text-ink">Introduction</h2>
                                    <p className="mt-4">{article.directAnswer}</p>
                                    <p className="mt-4">{article.excerpt} This guide is written for {article.audience}. It focuses on practical use, risk control, and repeatable review rather than prediction hype.</p>
                                </section>

                                {article.sections.map((section) => (
                                    <section key={section.h2} className="mt-12 scroll-mt-28" id={slugify(section.h2)}>
                                        <h2 className="text-3xl font-semibold text-ink">{section.h2}</h2>
                                        <p className="mt-4">{section.intro}</p>
                                        <h3 className="mt-7 text-2xl font-semibold text-ink">{section.h3}</h3>
                                        {section.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 80)} className="mt-4">{paragraph}</p>)}
                                        {section.bullets && (
                                            <ul className="mt-5 space-y-3">
                                                {section.bullets.map((bullet) => (
                                                    <li key={bullet} className="flex gap-3">
                                                        <FiCheckCircle className="mt-2 h-5 w-5 shrink-0 text-[#248a3d]" />
                                                        <span>{bullet}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </section>
                                ))}

                                <section className="mt-12">
                                    <h2 className="text-3xl font-semibold text-ink">Practical examples</h2>
                                    <div className="mt-6 grid gap-5">
                                        {article.examples.map((example) => (
                                            <div key={example.title} className="rounded-3xl border border-black/[0.08] bg-canvas p-5">
                                                <h3 className="text-2xl font-semibold text-ink">{example.title}</h3>
                                                <p className="mt-3">{example.scenario}</p>
                                                <ul className="mt-4 space-y-2">
                                                    {example.approach.map((step) => <li key={step} className="flex gap-3"><FiCheckCircle className="mt-2 h-5 w-5 shrink-0 text-accent" />{step}</li>)}
                                                </ul>
                                                <p className="mt-4 font-semibold text-ink">{example.takeaway}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="mt-12">
                                    <h2 className="text-3xl font-semibold text-ink">Frequently asked questions</h2>
                                    <div className="mt-6 divide-y divide-black/[0.08] rounded-3xl border border-black/[0.08]">
                                        {article.faqs.map((faq) => (
                                            <div key={faq.question} className="p-5">
                                                <h3 className="text-xl font-semibold text-ink">{faq.question}</h3>
                                                <p className="mt-2">{faq.answer}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="mt-12">
                                    <h2 className="text-3xl font-semibold text-ink">Conclusion</h2>
                                    {article.conclusion.map((paragraph) => <p key={paragraph.slice(0, 80)} className="mt-4">{paragraph}</p>)}
                                </section>

                                <section className="mt-12 rounded-[28px] bg-ink p-6 text-white">
                                    <h2 className="text-3xl font-semibold">Try GPT Chart View on your next chart</h2>
                                    <p className="mt-4 text-white/70">Upload a chart screenshot, get AI-assisted trend analysis, trade score, risk/reward map, and saved history inside your dashboard.</p>
                                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                        <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-semibold text-white transition-colors hover:bg-accent-hover">
                                            Start with 3 trial analyses
                                            <FiArrowRight />
                                        </Link>
                                        <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-3 font-semibold text-white">
                                            Contact support
                                        </Link>
                                    </div>
                                </section>

                                <section className="mt-12">
                                    <h2 className="text-3xl font-semibold text-ink">References and further reading</h2>
                                    <ul className="mt-5 space-y-3">
                                        {article.references.map((reference) => (
                                            <li key={reference.url}>
                                                <a href={reference.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-accent hover:underline">
                                                    {reference.label}
                                                    <FiExternalLink />
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            </div>

                            <aside className="space-y-6">
                                <div className="sticky top-28 space-y-6">
                                    <div className="rounded-[28px] border border-black/[0.08] bg-white p-5 shadow-sm">
                                        <h2 className="text-xl font-semibold text-ink">Related articles</h2>
                                        <div className="mt-4 space-y-3">
                                            {related.map((item) => (
                                                <Link key={item.slug} href={`/blog/${item.slug}`} className="block rounded-2xl bg-canvas p-3 font-semibold text-ink hover:text-accent">
                                                    {item.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="rounded-[28px] border border-black/[0.08] bg-white p-5 shadow-sm">
                                        <h2 className="flex items-center gap-2 text-xl font-semibold text-ink"><FiTag /> Tags</h2>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {article.tags.map((tag) => (
                                                <Link key={tag} href={`/blog/tag/${slugify(tag)}`} className="rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
                                                    {tag}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                    <NewsletterSignup source={`article:${article.slug}`} />
                                </div>
                            </aside>
                        </div>
                    </Container>
                </article>
            </main>
            <Footer />
        </>
    );
};

export default BlogArticlePage;
