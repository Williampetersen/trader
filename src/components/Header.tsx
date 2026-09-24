'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { HiOutlineXMark } from 'react-icons/hi2';

import { siteDetails } from '@/data/siteDetails';
import { menuItems } from '@/data/menuItems';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="fixed left-0 right-0 top-0 z-50 w-full border-b border-black/[0.08] bg-white/80 text-ink backdrop-blur-xl backdrop-saturate-150">
            <nav className="mx-auto flex h-14 w-full max-w-[1100px] items-center justify-between gap-6 px-5">
                <Link href="/" className="flex items-center gap-2.5" aria-label={`${siteDetails.siteName} home`}>
                    <Image src="/favicon.png" alt="" width={26} height={26} className="h-[26px] w-[26px]" priority />
                    <span className="text-[15px] font-semibold tracking-[-0.01em]">{siteDetails.siteName}</span>
                </Link>

                <ul className="hidden items-center gap-7 lg:flex">
                    {menuItems.map((item) => (
                        <li key={item.text}>
                            <Link href={item.url} className="text-[13px] text-ink/80 transition-colors hover:text-ink">
                                {item.text}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="hidden items-center gap-5 lg:flex">
                    <Link href="/login" className="text-[13px] text-ink/80 transition-colors hover:text-ink">
                        Log in
                    </Link>
                    <Link href="/signup" className="rounded-full bg-accent px-4 py-1.5 text-[13px] text-white transition-colors hover:bg-accent-hover">
                        Get started
                    </Link>
                </div>

                <button
                    onClick={toggleMenu}
                    type="button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full text-ink/80 transition-colors hover:bg-black/5 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden"
                    aria-controls="mobile-menu"
                    aria-expanded={isOpen}
                >
                    {isOpen ? (
                        <HiOutlineXMark className="h-6 w-6" aria-hidden="true" />
                    ) : (
                        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                            <path d="M4 9h16M4 15h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    )}
                    <span className="sr-only">Toggle navigation</span>
                </button>
            </nav>

            <Transition
                show={isOpen}
                enter="transition ease-out duration-200 transform"
                enterFrom="opacity-0 -translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150 transform"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-2"
            >
                <div id="mobile-menu" className="border-t border-black/[0.06] bg-white px-8 pb-8 pt-4 lg:hidden">
                    <ul className="grid gap-1">
                        {menuItems.map((item) => (
                            <li key={item.text}>
                                <Link href={item.url} className="block py-2 text-2xl font-semibold tracking-[-0.02em] text-ink" onClick={toggleMenu}>
                                    {item.text}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-8 grid gap-3">
                        <Link href="/signup" className="rounded-full bg-accent px-5 py-3 text-center text-[17px] text-white" onClick={toggleMenu}>
                            Get started
                        </Link>
                        <Link href="/login" className="rounded-full border border-line px-5 py-3 text-center text-[17px] text-ink" onClick={toggleMenu}>
                            Log in
                        </Link>
                    </div>
                </div>
            </Transition>
        </header>
    );
};

export default Header;
