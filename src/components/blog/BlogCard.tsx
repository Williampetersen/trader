import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { BlogArticle } from "@/data/blog";

const BlogCard = ({ article }: { article: BlogArticle }) => (
    <article className="group overflow-hidden rounded-[2rem] border border-[#d9e2ef] bg-white shadow-sm transition-transform hover:-translate-y-1">
        <Link href={`/blog/${article.slug}`} className="block">
            <div className="relative h-48 overflow-hidden bg-[#101828]">
                <Image src="/images/hero-chart.webp" alt={article.heroAlt} fill className="object-cover opacity-80 transition-transform group-hover:scale-105" sizes="(min-width: 1024px) 33vw, 100vw" unoptimized />
                <div className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-extrabold text-black">{article.category.name}</div>
            </div>
            <div className="p-6">
                <p className="text-sm font-bold text-[#667085]">{article.readingTime} | {article.updatedAt}</p>
                <h2 className="mt-3 text-2xl font-extrabold leading-tight text-[#101828] group-hover:text-[#304fff]">{article.title}</h2>
                <p className="mt-3 line-clamp-3 text-[#667085]">{article.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-extrabold text-[#304fff]">
                    Read article
                    <FiArrowRight />
                </span>
            </div>
        </Link>
    </article>
);

export default BlogCard;
