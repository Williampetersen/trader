import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FiArrowRight, FiMail, FiShield } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';

import { siteDetails } from '@/data/siteDetails';
import { footerDetails } from '@/data/footer';

const Footer: React.FC = () => {
    return (
        <footer className="border-t border-white/10 bg-[#05070f] py-14 text-white">
            <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[1.2fr_0.7fr_0.7fr_0.8fr]">
                <div>
                    <Link href="/" className="flex items-center">
                        <Image src="/logo.png" alt={`${siteDetails.siteName} logo`} width={180} height={52} className="h-12 w-auto object-contain" />
                    </Link>
                    <p className="mt-5 max-w-sm leading-7 text-white/58">
                        {footerDetails.subheading}
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/72">
                        <FiShield className="text-[#21e7a4]" />
                        Educational chart analysis only
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-extrabold uppercase text-white/48">Explore</h4>
                    <ul className="mt-5 grid gap-3 text-white/68">
                        {footerDetails.quickLinks.map((link) => (
                            <li key={link.text}>
                                <Link href={link.url} className="inline-flex items-center gap-2 hover:text-white">
                                    {link.text}
                                    <FiArrowRight className="h-3 w-3" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-extrabold uppercase text-white/48">Member app</h4>
                    <ul className="mt-5 grid gap-3 text-white/68">
                        <li><Link href="/signup" className="hover:text-white">Create account</Link></li>
                        <li><Link href="/login" className="hover:text-white">Login</Link></li>
                        <li><Link href="/dashboard/upload" className="hover:text-white">Upload chart</Link></li>
                        <li><Link href="/dashboard/billing" className="hover:text-white">Billing</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-extrabold uppercase text-white/48">Contact</h4>
                    <a href={`mailto:${footerDetails.email}`} className="mt-5 inline-flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 font-bold text-white/82 hover:text-white">
                        <FiMail className="text-[#16c7ff]" />
                        {footerDetails.email}
                    </a>
                    <div className="mt-6 flex items-center gap-3">
                        <a href="https://x.com" aria-label="X profile" className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-white/75 hover:text-white"><FaXTwitter /></a>
                        <a href="https://facebook.com" aria-label="Facebook page" className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-white/75 hover:text-white"><FaFacebookF /></a>
                        <a href="https://www.linkedin.com" aria-label="LinkedIn page" className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-white/75 hover:text-white"><FaLinkedinIn /></a>
                        <a href="https://www.instagram.com" aria-label="Instagram page" className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-white/75 hover:text-white"><FaInstagram /></a>
                    </div>
                </div>
            </div>
            <div className="mx-auto mt-12 flex w-full max-w-7xl flex-col gap-3 border-t border-white/10 px-6 pt-6 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
                <p>Copyright &copy; {new Date().getFullYear()} {siteDetails.siteName}. All rights reserved.</p>
                <p>AI analysis does not guarantee trading outcomes.</p>
            </div>
        </footer>
    );
};

export default Footer;
