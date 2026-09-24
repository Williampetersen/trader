import Link from 'next/link';
import React from 'react';

import { siteDetails } from '@/data/siteDetails';
import { footerDetails } from '@/data/footer';

const Footer: React.FC = () => {
    return (
        <footer className="bg-canvas text-xs leading-[1.5] text-muted">
            <div className="mx-auto w-full max-w-[1100px] px-5 pb-8 pt-10">
                <div className="space-y-3 border-b border-line pb-5">
                    {footerDetails.disclaimers.map((text) => (
                        <p key={text}>{text}</p>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-8 py-8 md:grid-cols-4">
                    {footerDetails.columns.map((column) => (
                        <div key={column.title}>
                            <h2 className="font-semibold tracking-normal text-ink">{column.title}</h2>
                            <ul className="mt-3 grid gap-2.5">
                                {column.links.map((link) => (
                                    <li key={link.text}>
                                        <Link href={link.url} className="transition-colors hover:text-ink hover:underline">
                                            {link.text}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <p>
                    Questions? Email{' '}
                    <a href={`mailto:${footerDetails.email}`} className="text-link hover:underline">{footerDetails.email}</a>
                    {' '}and we&apos;ll get back to you, usually the same business day.
                </p>

                <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4 md:flex-row md:items-center md:justify-between">
                    <p>Copyright &copy; {new Date().getFullYear()} {siteDetails.siteName}. All rights reserved.</p>
                    <p>Educational chart analysis. Not financial advice.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
