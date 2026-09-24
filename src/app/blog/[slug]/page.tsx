import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowRight, FiCheckCircle, FiDownload, FiExternalLink, FiTag } from "react-icons/fi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
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
            <main className="bg-[#f5f7fb] pt-28">
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
                                        <Link href={`/blog/category/${article.category.slug}`} className="rounded-full bg-[#eef2ff] px-4 py-2 text-sm font-extrabold text-[#304fff]">{article.category.name}</Link>
                                        <span className="rounded-full border border-[#d9e2ef] bg-white px-4 py-2 text-sm font-bold text-[#667085]">{article.readingTime}</span>
                                    </div>
                                    <h1 className="max-w-5xl break-words text-4xl font-extrabold leading-tight text-[#101828] sm:text-5xl md:text-6xl">{article.title}</h1>
                                    <p className="mt-6 max-w-4xl text-xl leading-8 text-[#667085]">{article.excerpt}</p>
                                    <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-[#667085]">
                                        <span>By {article.author}</span>
                                        <span>Updated {article.updatedAt}</span>
                                        <span>{article.wordCount.toLocaleString()} words</span>
                                    </div>
                                </div>
                                <aside className="rounded-[2rem] bg-[#101828] p-6 text-white">
                                    <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">Direct answer</p>
                                    <p className="mt-4 text-lg leading-7 text-[#f2f4f7]">{article.directAnswer}</p>
                                    <Link href="/signup" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 font-extrabold text-black">
                                        Analyze your chart
                                        <FiArrowRight />
                                    </Link>
                                </aside>
                            </div>
                            <div className="relative mt-10 overflow-hidden rounded-[2rem] bg-[#101828]">
                                <Image src="/images/hero-chart.webp" alt={article.heroAlt} width={1400} height={560} className="h-[360px] w-full object-cover opacity-85" priority unoptimized />
                            </div>
                        </Container>
                    </section>

                    <Container>
                        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
                            <div className="rounded-[2rem] border border-[#d9e2ef] bg-white p-6 text-lg leading-8 text-[#344054] md:p-10">
                                <div className="rounded-3xl border border-[#d9e2ef] bg-[#f8fafc] p-5">
                                    <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#304fff]">Search intent</p>
                                    <p className="mt-2">{article.intent}</p>
                                </div>

                                <section className="mt-10">
                                    <h2 className="text-3xl font-extrabold text-[#101828]">Introduction</h2>
                                    <p className="mt-4">{article.directAnswer}</p>
                                    <p className="mt-4">{article.excerpt} This guide is written for {article.audience}. It focuses on practical use, risk control, and repeatable review rather than prediction hype.</p>
                                </section>

                                {article.sections.map((section) => (
                                    <section key={section.h2} className="mt-12 scroll-mt-28" id={slugify(section.h2)}>
                                        <h2 className="text-3xl font-extrabold text-[#101828]">{section.h2}</h2>
                                        <p className="mt-4">{section.intro}</p>
                                        <h3 className="mt-7 text-2xl font-extrabold text-[#101828]">{section.h3}</h3>
                                        {section.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 80)} className="mt-4">{paragraph}</p>)}
                                        {section.bullets && (
                                            <ul className="mt-5 space-y-3">
                                                {section.bullets.map((bullet) => (
                                                    <li key={bullet} className="flex gap-3">
                                                        <FiCheckCircle className="mt-2 h-5 w-5 shrink-0 text-[#079455]" />
                                                        <span>{bullet}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </section>
                                ))}

                                <section className="mt-12">
                                    <h2 className="text-3xl font-extrabold text-[#101828]">Practical examples</h2>
                                    <div className="mt-6 grid gap-5">
                                        {article.examples.map((example) => (
                                            <div key={example.title} className="rounded-3xl border border-[#d9e2ef] bg-[#f8fafc] p-5">
                                                <h3 className="text-2xl font-extrabold text-[#101828]">{example.title}</h3>
                                                <p className="mt-3">{example.scenario}</p>
                                                <ul className="mt-4 space-y-2">
                                                    {example.approach.map((step) => <li key={step} className="flex gap-3"><FiCheckCircle className="mt-2 h-5 w-5 shrink-0 text-[#304fff]" />{step}</li>)}
                                                </ul>
                                                <p className="mt-4 font-bold text-[#101828]">{example.takeaway}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="mt-12">
                                    <h2 className="text-3xl font-extrabold text-[#101828]">Frequently asked questions</h2>
                                    <div className="mt-6 divide-y divide-[#d9e2ef] rounded-3xl border border-[#d9e2ef]">
                                        {article.faqs.map((faq) => (
                                            <div key={faq.question} className="p-5">
                                                <h3 className="text-xl font-extrabold text-[#101828]">{faq.question}</h3>
                                                <p className="mt-2">{faq.answer}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="mt-12">
                                    <h2 className="text-3xl font-extrabold text-[#101828]">Conclusion</h2>
                                    {article.conclusion.map((paragraph) => <p key={paragraph.slice(0, 80)} className="mt-4">{paragraph}</p>)}
                                </section>

                                <section className="mt-12 rounded-[2rem] bg-[#101828] p-6 text-white">
                                    <h2 className="text-3xl font-extrabold">Try GPT Chart View on your next chart</h2>
                                    <p className="mt-4 text-[#d0d5dd]">Upload a chart screenshot, get AI-assisted trend analysis, trade score, risk/reward map, and saved history inside your dashboard.</p>
                                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                        <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 font-extrabold text-black">
                                            Start with 3 trial analyses
                                            <FiArrowRight />
                                        </Link>
                                        <Link href="/contact" className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-5 py-3 font-extrabold text-white">
                                            Contact support
                                        </Link>
                                    </div>
                                </section>

                                <section className="mt-12">
                                    <h2 className="text-3xl font-extrabold text-[#101828]">References and further reading</h2>
                                    <ul className="mt-5 space-y-3">
                                        {article.references.map((reference) => (
                                            <li key={reference.url}>
                                                <a href={reference.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-bold text-[#304fff] hover:underline">
                                                    {reference.label}
                                                    <FiExternalLink />
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                <section className="mt-12">
                                    <h2 className="text-3xl font-extrabold text-[#101828]">Backlink and outreach ideas</h2>
                                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                                        <div className="rounded-3xl border border-[#d9e2ef] bg-[#f8fafc] p-5">
                                            <h3 className="text-xl font-extrabold text-[#101828]">Outreach targets</h3>
                                            <ul className="mt-3 space-y-2">
                                                {article.backlinkOpportunities.map((item) => <li key={item}>- {item}</li>)}
                                            </ul>
                                        </div>
                                        <div className="rounded-3xl border border-[#d9e2ef] bg-[#f8fafc] p-5">
                                            <h3 className="flex items-center gap-2 text-xl font-extrabold text-[#101828]"><FiDownload /> Linkable assets</h3>
                                            <ul className="mt-3 space-y-2">
                                                {article.linkableAssets.map((item) => <li key={item}>- {item}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <aside className="space-y-6">
                                <div className="sticky top-28 space-y-6">
                                    <div className="rounded-[2rem] border border-[#d9e2ef] bg-white p-5 shadow-sm">
                                        <h2 className="text-xl font-extrabold text-[#101828]">Internal links</h2>
                                        <div className="mt-4 space-y-3">
                                            {related.map((item) => (
                                                <Link key={item.slug} href={`/blog/${item.slug}`} className="block rounded-2xl bg-[#f8fafc] p-3 font-bold text-[#101828] hover:text-[#304fff]">
                                                    {item.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="rounded-[2rem] border border-[#d9e2ef] bg-white p-5 shadow-sm">
                                        <h2 className="flex items-center gap-2 text-xl font-extrabold text-[#101828]"><FiTag /> Tags</h2>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {article.tags.map((tag) => (
                                                <Link key={tag} href={`/blog/tag/${slugify(tag)}`} className="rounded-full bg-[#eef2ff] px-3 py-1 text-sm font-bold text-[#304fff]">
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
