import Link from "next/link";

export interface Crumb {
    label: string;
    href?: string;
}

const Breadcrumbs = ({ items }: { items: Crumb[] }) => (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm font-semibold text-muted">
        <ol className="flex flex-wrap items-center gap-2">
            {items.map((item, index) => (
                <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                    {item.href ? <Link href={item.href} className="hover:text-accent">{item.label}</Link> : <span className="text-ink">{item.label}</span>}
                    {index < items.length - 1 && <span>/</span>}
                </li>
            ))}
        </ol>
    </nav>
);

export default Breadcrumbs;
