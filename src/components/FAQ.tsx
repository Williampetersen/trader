"use client"
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { FiPlus } from "react-icons/fi";
import clsx from "clsx";

import { faqs } from "@/data/faq";

const FAQ: React.FC = () => {
    return (
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#16c7ff]">FAQ</p>
                <h2 className="mt-4 text-balance text-[36px] font-semibold leading-[1.08] md:text-[48px]">Questions? Answers.</h2>
                <p className="mt-5 leading-relaxed text-white/60">
                    Can&apos;t find what you need? Email{' '}
                    <a href="mailto:support@gptchartview.com" className="text-[#16c7ff] hover:underline">support@gptchartview.com</a>.
                </p>
            </div>

            <div className="border-b border-white/10">
                {faqs.map((faq) => (
                    <Disclosure key={faq.question} as="div" className="border-t border-white/10">
                        {({ open }) => (
                            <>
                                <DisclosureButton className="flex w-full items-center justify-between gap-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16c7ff]">
                                    <span className="text-[19px] font-semibold tracking-[-0.015em]">{faq.question}</span>
                                    <FiPlus className={clsx("h-5 w-5 shrink-0 text-white/50 transition-transform duration-200", open && "rotate-45")} aria-hidden="true" />
                                </DisclosureButton>
                                <DisclosurePanel className="pb-6 pr-10 leading-relaxed text-white/60">
                                    {faq.answer}
                                </DisclosurePanel>
                            </>
                        )}
                    </Disclosure>
                ))}
            </div>
        </div>
    );
};

export default FAQ;
