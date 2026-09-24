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
            <main className="overflow-hidden bg-canvas pt-28">
                <section className="relative py-16">
                    <Container>
                        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                            <div>
                                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-accent shadow-sm">
                                    <FiMail />
                                    Contact GPT Chart View
                                </div>
                                <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-ink md:text-6xl">
                                    Get support for billing, uploads, and account access.
                                </h1>
                                <p className="mt-5 max-w-2xl text-xl leading-8 text-muted">
                                    Send a message directly to our support mailbox. Logged-in members can also create private dashboard tickets from their support page.
                                </p>
                                <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
                                    <Info icon={<FiMail />} title="Email" text="support@gptchartview.com" className="sm:col-span-2" />
                                    <Info icon={<FiClock />} title="Response" text="Usually same business day" />
                                    <Info icon={<FiShield />} title="Direct" text="Goes straight to our support inbox" />
                                </div>
                                <div className="mt-8 rounded-[28px] bg-ink p-6 text-white">
                                    <h2 className="flex items-center gap-2 text-xl font-semibold"><FiMessageSquare /> Already a member?</h2>
                                    <p className="mt-2 text-white/70">Use the dashboard support desk so the ticket is attached to your account and visible in your ticket history.</p>
                                    <Link href="/dashboard/support" className="mt-5 inline-flex rounded-full bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-hover">
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
    <div className={`rounded-2xl border border-black/[0.08] bg-white p-4 shadow-sm ${className}`}>
        <div className="text-2xl text-accent">{icon}</div>
        <p className="mt-3 text-sm font-semibold text-muted">{title}</p>
        <p className="mt-1 font-semibold text-ink">{text}</p>
    </div>
);

export default ContactPage;
