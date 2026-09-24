import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { BlogArticle } from "@/data/blog";
import BlogCover from "./BlogCover";

const BlogCard = ({ article }: { article: BlogArticle }) => (
    <article className="group overflow-hidden rounded-[28px] bg-white ring-1 ring-black/[0.06] transition-shadow hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.2)]">
        <Link href={`/blog/${article.slug}`} className="block">
            <div className="relative h-48 overflow-hidden">
                <BlogCover seed={article.slug} className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]" />
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">{article.category.name}</div>
            </div>
            <div className="p-6">
                <p className="text-sm text-muted">{article.readingTime} · {article.updatedAt}</p>
                <h2 className="mt-2 text-[21px] font-semibold leading-snug text-ink group-hover:text-accent">{article.title}</h2>
                <p className="mt-3 line-clamp-3 text-[15px] leading-[1.5] text-muted">{article.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-0.5 text-[15px] text-link group-hover:underline">
                    Read article
                    <FiChevronRight className="h-4 w-4" />
                </span>
            </div>
        </Link>
    </article>
);

export default BlogCard;
