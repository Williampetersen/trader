'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { HiBars3, HiOutlineXMark } from 'react-icons/hi2';
import { FiLogIn, FiSend } from 'react-icons/fi';
import { FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';

import Container from './Container';
import { siteDetails } from '@/data/siteDetails';
import { menuItems } from '@/data/menuItems';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="fixed left-0 right-0 top-0 z-50 w-full bg-[#05070f]/82 text-white backdrop-blur-xl">
            <Container className="!px-0">
                <nav className="mx-auto grid min-h-[76px] grid-cols-[1fr_auto] items-center gap-4 px-5 lg:grid-cols-[1fr_auto_1fr]">
                    <Link href="/" className="flex items-center">
                        <Image src="/logo.png" alt={`${siteDetails.siteName} logo`} width={170} height={48} className="h-10 w-auto object-contain" priority />
                    </Link>

                    <ul className="hidden items-center rounded-lg border border-white/10 bg-white/[0.07] p-1 lg:flex">
                        {menuItems.map((item) => (
                            <li key={item.text}>
                                <Link href={item.url} className="block rounded-lg px-5 py-3 text-sm font-extrabold text-white/82 transition-colors hover:bg-white/10 hover:text-white">
                                    {item.text}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="hidden items-center justify-end gap-3 lg:flex">
                        <a href="https://x.com" aria-label="X profile" className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.07] text-white/82 transition-colors hover:bg-white/12 hover:text-white">
                            <FaXTwitter />
                        </a>
                        <a href="https://t.me" aria-label="Telegram channel" className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.07] text-white/82 transition-colors hover:bg-white/12 hover:text-white">
                            <FiSend />
                        </a>
                        <a href="https://www.linkedin.com" aria-label="LinkedIn profile" className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.07] text-white/82 transition-colors hover:bg-white/12 hover:text-white">
                            <FaLinkedinIn />
                        </a>
                        <div className="h-8 w-px bg-white/10" />
                        <Link href="/login" className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-white/10 px-4 py-3 text-sm font-extrabold text-white/82 transition-colors hover:bg-white/10 hover:text-white">
                            <FiLogIn />
                            Login
                        </Link>
                        <Link href="/signup" className="whitespace-nowrap rounded-lg bg-[#16c7ff] px-6 py-3 text-sm font-extrabold text-[#03111a] transition-colors hover:bg-white">
                            Start Now
                        </Link>
                    </div>

                    <div className="flex items-center justify-end lg:hidden">
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#fed835] text-black focus:outline-none"
                            aria-controls="mobile-menu"
                            aria-expanded={isOpen}
                        >
                            {isOpen ? <HiOutlineXMark className="h-6 w-6" aria-hidden="true" /> : <HiBars3 className="h-6 w-6" aria-hidden="true" />}
                            <span className="sr-only">Toggle navigation</span>
                        </button>
                    </div>
                </nav>
            </Container>

            <Transition
                show={isOpen}
                enter="transition ease-out duration-200 transform"
                enterFrom="opacity-0 -translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150 transform"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-2"
            >
                <div id="mobile-menu" className="border-t border-white/10 bg-[#05070f] px-5 pb-6 pt-3 lg:hidden">
                    <ul className="grid gap-2">
                        {menuItems.map((item) => (
                            <li key={item.text}>
                                <Link href={item.url} className="block rounded-lg bg-white/[0.06] px-4 py-3 text-sm font-extrabold text-white/85" onClick={toggleMenu}>
                                    {item.text}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link href="/login" className="block rounded-lg bg-white/[0.06] px-4 py-3 text-sm font-extrabold text-white/85" onClick={toggleMenu}>
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link href="/signup" className="block rounded-lg bg-[#16c7ff] px-4 py-3 text-sm font-extrabold text-[#03111a]" onClick={toggleMenu}>
                                Start Now
                            </Link>
                        </li>
                    </ul>
                </div>
            </Transition>
        </header>
    );
};

export default Header;
