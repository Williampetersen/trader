import Link from "next/link";

export interface Crumb {
    label: string;
    href?: string;
}

const Breadcrumbs = ({ items }: { items: Crumb[] }) => (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm font-semibold text-[#667085]">
        <ol className="flex flex-wrap items-center gap-2">
            {items.map((item, index) => (
                <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                    {item.href ? <Link href={item.href} className="hover:text-[#304fff]">{item.label}</Link> : <span className="text-[#101828]">{item.label}</span>}
                    {index < items.length - 1 && <span>/</span>}
                </li>
            ))}
        </ol>
    </nav>
);

export default Breadcrumbs;
