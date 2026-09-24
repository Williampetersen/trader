"use client"
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { FiPlus } from "react-icons/fi";
import clsx from "clsx";

import { faqs } from "@/data/faq";

const FAQ: React.FC = () => {
    return (
        <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
                <h2 className="text-[40px] font-semibold leading-[1.1] md:text-[48px]">Questions? Answers.</h2>
                <p className="mt-5 text-[17px] text-muted">
                    Can&apos;t find what you need? Email{' '}
                    <a href="mailto:support@gptchartview.com" className="text-link hover:underline">support@gptchartview.com</a>.
                </p>
            </div>

            <div className="border-b border-line">
                {faqs.map((faq) => (
                    <Disclosure key={faq.question} as="div" className="border-t border-line">
                        {({ open }) => (
                            <>
                                <DisclosureButton className="flex w-full items-center justify-between gap-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                                    <span className="text-[19px] font-semibold tracking-[-0.015em]">{faq.question}</span>
                                    <FiPlus className={clsx("h-5 w-5 shrink-0 text-muted transition-transform duration-200", open && "rotate-45")} aria-hidden="true" />
                                </DisclosureButton>
                                <DisclosurePanel className="pb-6 pr-10 text-[17px] leading-[1.5] text-muted">
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
