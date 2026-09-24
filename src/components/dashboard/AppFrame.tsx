"use client";

import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import { FiMenu, FiX } from "react-icons/fi";

export interface AppNavItem {
    label: string;
    href: string;
    icon: IconType;
}

interface AppFrameProps {
    brand: { href: string; title: string; subtitle: string; icon: React.ReactNode };
    nav: AppNavItem[];
    isActive: (href: string) => boolean;
    section: string;
    title: string;
    headerActions?: React.ReactNode;
    sidebarFooter?: React.ReactNode;
}

const AppFrame = ({ brand, nav, isActive, section, title, headerActions, sidebarFooter, children }: React.PropsWithChildren<AppFrameProps>) => {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    return (
        <div className="app-theme min-h-screen bg-[#f5f7fb] text-base text-slate-700">
            {menuOpen && (
                <button aria-label="Close menu" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm xl:hidden" />
            )}

            <aside className={clsx(
                "fixed inset-y-0 left-0 z-50 m-4 flex w-72 flex-col rounded-xl border border-slate-200/80 bg-white shadow-sm transition-transform duration-300 xl:translate-x-0",
                menuOpen ? "translate-x-0" : "-translate-x-80"
            )}>
                <div className="relative border-b border-slate-100 px-6 py-5">
                    <Link href={brand.href} className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-tr from-[#3457ff] to-[#6b8cff] text-white shadow-md shadow-[#3457ff]/30">
                            {brand.icon}
                        </span>
                        <span>
                            <span className="block text-base font-bold text-slate-800">{brand.title}</span>
                            <span className="block text-xs text-slate-500">{brand.subtitle}</span>
                        </span>
                    </Link>
                    <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 xl:hidden">
                        <FiX />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                    {nav.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                                    active
                                        ? "bg-gradient-to-tr from-[#3457ff] to-[#6b8cff] text-white shadow-md shadow-[#3457ff]/25"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                )}
                            >
                                <Icon className="h-5 w-5 shrink-0" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {sidebarFooter && <div className="border-t border-slate-100 p-4">{sidebarFooter}</div>}
            </aside>

            <div className="p-4 xl:ml-80">
                <header className="sticky top-4 z-30 rounded-xl border border-slate-200/80 bg-white/85 px-4 py-3 shadow-sm backdrop-blur-xl">
                    <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs">
                                <span className="text-slate-400">{section}</span>
                                <span className="text-slate-300">/</span>
                                <span className="truncate font-medium text-slate-700">{title}</span>
                            </nav>
                            <h1 className="mt-0.5 truncate text-lg font-bold text-slate-800">{title}</h1>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            {headerActions}
                            <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 xl:hidden">
                                <FiMenu className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="mx-auto mt-8 w-full max-w-[1600px]">{children}</main>

                <footer className="mx-auto mt-10 max-w-[1600px] py-4 text-sm text-slate-400">
                    &copy; {new Date().getFullYear()} GPT Chart View
                </footer>
            </div>
        </div>
    );
};

export default AppFrame;
