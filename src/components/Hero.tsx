import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiCheckCircle, FiImage, FiShield, FiUploadCloud } from 'react-icons/fi';

import { heroDetails } from '@/data/hero';

const Hero: React.FC = () => {
    return (
        <section
            id="hero"
            className="relative flex items-center justify-center pb-0 pt-32 md:pt-40 px-5"
        >
            <div className="absolute left-0 top-0 bottom-0 -z-10 w-full">
                <div className="absolute inset-0 h-full w-full bg-hero-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]">
                </div>
            </div>

            <div className="absolute left-0 right-0 bottom-0 backdrop-blur-[2px] h-40 bg-gradient-to-b from-transparent via-[rgba(233,238,255,0.5)] to-[rgba(202,208,230,0.5)]">
            </div>

            <div className="text-center max-w-6xl w-full">
                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-foreground-accent shadow-sm">
                    <FiShield className="text-secondary" />
                    Educational AI analysis for chart screenshots
                </p>
                <h1 className="text-4xl md:text-6xl md:leading-tight font-bold text-foreground max-w-lg md:max-w-3xl mx-auto">{heroDetails.heading}</h1>
                <p className="mt-4 text-foreground-accent max-w-2xl mx-auto">{heroDetails.subheading}</p>
                <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link href="#pricing" className="w-full sm:w-auto rounded-full bg-primary px-8 py-3 font-semibold text-black transition-colors hover:bg-primary-accent">
                        View subscriptions
                    </Link>
                    <Link href="#workflow" className="w-full sm:w-auto rounded-full border border-gray-300 bg-white px-8 py-3 font-semibold text-foreground transition-colors hover:border-secondary hover:text-secondary">
                        See how it works
                    </Link>
                </div>
                <div className="relative z-10 mt-12 grid items-center gap-6 rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-2xl md:grid-cols-[1.1fr_0.9fr] md:p-6">
                    <div className="overflow-hidden rounded-xl bg-[#0b1020]">
                        <Image
                            src={heroDetails.centerImageSrc}
                            width={820}
                            height={520}
                            quality={100}
                            sizes="(max-width: 768px) 100vw, 680px"
                            priority={true}
                            unoptimized={true}
                            alt="AI trading chart analysis dashboard preview"
                            className="h-full min-h-[260px] w-full object-cover opacity-95"
                        />
                    </div>
                    <div className="space-y-4">
                        <div className="rounded-xl border border-dashed border-secondary/40 bg-secondary/5 p-5">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-secondary shadow-sm">
                                <FiUploadCloud size={26} />
                            </div>
                            <h2 className="text-2xl font-bold">Upload chart image</h2>
                            <p className="mt-2 text-base text-foreground-accent">Accept screenshots from TradingView, broker platforms, mobile apps, or saved chart files.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-base">
                            <div className="rounded-lg border border-gray-200 p-4">
                                <FiImage className="mb-2 text-secondary" />
                                Pattern read
                            </div>
                            <div className="rounded-lg border border-gray-200 p-4">
                                <FiCheckCircle className="mb-2 text-green-600" />
                                Trade score
                            </div>
                        </div>
                        <div className="rounded-xl bg-[#111827] p-5 text-white">
                            <p className="text-sm uppercase tracking-wide text-gray-300">Example result</p>
                            <p className="mt-2 text-4xl font-bold text-primary">82/100</p>
                            <p className="mt-2 text-base text-gray-200">Bullish structure, clean support retest, wait for volume confirmation.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
