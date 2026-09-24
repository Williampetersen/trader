import Link from "next/link";
import { FiClock, FiMail, FiMessageSquare, FiShield } from "react-icons/fi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";

const ContactPage = () => {
    return (
        <>
            <Header />
            <main className="overflow-hidden bg-[#f5f7fb] pt-28">
                <section className="relative py-16">
                    <Container>
                        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                            <div>
                                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d9e2ef] bg-white px-4 py-2 text-sm font-semibold text-[#304fff] shadow-sm">
                                    <FiMail />
                                    Contact GPT Chart View
                                </div>
                                <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-[#101828] md:text-6xl">
                                    Get support for billing, uploads, and account access.
                                </h1>
                                <p className="mt-5 max-w-2xl text-xl leading-8 text-[#667085]">
                                    Send a message directly to our support mailbox. Logged-in members can also create private dashboard tickets from their support page.
                                </p>
                                <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
                                    <Info icon={<FiMail />} title="Email" text="support@gptchartview.com" className="sm:col-span-2" />
                                    <Info icon={<FiClock />} title="Response" text="Usually same business day" />
                                    <Info icon={<FiShield />} title="Direct" text="Goes straight to our support inbox" />
                                </div>
                                <div className="mt-8 rounded-[2rem] bg-[#101828] p-6 text-white">
                                    <h2 className="flex items-center gap-2 text-xl font-semibold"><FiMessageSquare /> Already a member?</h2>
                                    <p className="mt-2 text-[#d0d5dd]">Use the dashboard support desk so the ticket is attached to your account and visible in your ticket history.</p>
                                    <Link href="/dashboard/support" className="mt-5 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-black">
                                        Open dashboard support
                                    </Link>
                                </div>
                            </div>
                            <ContactForm />
                        </div>
                    </Container>
                </section>
            </main>
            <Footer />
        </>
    );
};

const Info = ({ icon, title, text, className = "" }: { icon: React.ReactNode; title: string; text: string; className?: string }) => (
    <div className={`rounded-2xl border border-[#d9e2ef] bg-white p-4 shadow-sm ${className}`}>
        <div className="text-2xl text-[#304fff]">{icon}</div>
        <p className="mt-3 text-sm font-bold text-[#667085]">{title}</p>
        <p className="mt-1 font-semibold text-[#101828]">{text}</p>
    </div>
);

export default ContactPage;
