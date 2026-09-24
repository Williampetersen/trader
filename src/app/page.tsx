import Link from "next/link";
import {
  FiBookOpen,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiCpu,
  FiCreditCard,
  FiLayers,
  FiLock,
  FiMessageCircle,
  FiPercent,
  FiTarget,
  FiTrendingUp,
  FiUploadCloud,
} from "react-icons/fi";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import Pricing from "@/components/Pricing/Pricing";
import FAQ from "@/components/FAQ";
import ProductPreview from "@/components/ProductPreview";

const primaryButton = "inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-[17px] text-white transition-colors hover:bg-accent-hover";
const textLink = "inline-flex items-center gap-0.5 text-[17px] text-link hover:underline";

const steps = [
  {
    title: "Upload your chart",
    description: "Take a screenshot from TradingView, MT4, MT5, Binance or your broker app and drop it in. Add the symbol and timeframe if you like.",
    icon: <FiUploadCloud />,
  },
  {
    title: "Get a structured read",
    description: "The AI identifies the trend, support and resistance, and a possible entry, stop-loss and two targets, with a confidence score.",
    icon: <FiCpu />,
  },
  {
    title: "Ask, decide, track",
    description: "Ask follow-up questions in chat, then mark the trade as won, lost or not taken to build your own track record.",
    icon: <FiMessageCircle />,
  },
];

const features = [
  {
    title: "Trend and bias",
    description: "Buy, Sell or Watch, with the market structure that supports it.",
    icon: <FiTrendingUp />,
  },
  {
    title: "Key levels",
    description: "Support and resistance read directly from your chart.",
    icon: <FiLayers />,
  },
  {
    title: "Entry, stop and targets",
    description: "A defined plan with a stop-loss and two take-profit levels.",
    icon: <FiTarget />,
  },
  {
    title: "Risk/reward, calculated",
    description: "Worked out by our server from the exact levels, not guessed by the AI.",
    icon: <FiPercent />,
  },
  {
    title: "Follow-up chat",
    description: "Ask why a level matters or what would invalidate the idea.",
    icon: <FiMessageCircle />,
  },
  {
    title: "Private history",
    description: "Every chart, result and outcome is saved to your account.",
    icon: <FiClock />,
  },
];

const principles = [
  {
    title: "Checked before you see it",
    description: "Stop-loss and targets must sit on the correct side of the entry. If the levels don't add up, the result is marked Watch instead of Buy or Sell.",
    icon: <FiCheckCircle />,
  },
  {
    title: "Education, not advice",
    description: "GPT Chart View explains what your chart shows. It doesn't know your finances and never promises results. You make the decision.",
    icon: <FiBookOpen />,
  },
  {
    title: "Your charts stay private",
    description: "Uploads, results and chat history are linked to your account and visible only to you.",
    icon: <FiLock />,
  },
  {
    title: "Secure checkout with Stripe",
    description: "Payments are handled by Stripe. We never see or store your card number.",
    icon: <FiCreditCard />,
  },
];

const SectionHeading = ({ title, description }: { title: string; description: string }) => (
  <div className="mx-auto max-w-3xl text-center">
    <h2 className="text-balance text-[40px] font-semibold leading-[1.1] md:text-[56px]">{title}</h2>
    <p className="mx-auto mt-5 max-w-2xl text-balance text-[19px] leading-[1.45] text-muted md:text-[21px]">{description}</p>
  </div>
);

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="bg-white text-ink">
        <section className="pt-28 md:pt-36">
          <Container className="text-center">
            <p className="text-[17px] font-semibold text-accent md:text-[19px]">AI chart analysis</p>
            <h1 className="mx-auto mt-3 max-w-4xl text-balance text-[44px] font-semibold leading-[1.05] tracking-[-0.025em] sm:text-[56px] md:text-[76px]">
              A second opinion on every chart.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-[19px] leading-[1.45] text-muted md:text-[21px]">
              Upload a screenshot and get the trend, key levels, entry, stop&#8209;loss and targets, with the reasoning explained in plain language.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8">
              <Link href="/signup" className={primaryButton}>
                Try 3 analyses free
              </Link>
              <Link href="#how-it-works" className={textLink}>
                See how it works
                <FiChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-5 text-sm text-subtle">No card required · Educational analysis, not financial advice</p>
          </Container>

          <Container className="mt-14 md:mt-20">
            <ProductPreview />
          </Container>

          <Container className="py-14 text-center md:py-16">
            <p className="text-[15px] text-muted">
              Works with screenshots from <span className="text-ink">TradingView, MetaTrader 4, MetaTrader 5, Binance</span> and most broker apps.
            </p>
          </Container>
        </section>

        <section id="how-it-works" className="bg-canvas py-20 md:py-28">
          <Container>
            <SectionHeading title="From screenshot to a clear plan." description="Three steps, right in your browser. Nothing to install." />
            <ol className="mx-auto mt-14 grid max-w-[1100px] gap-5 md:grid-cols-3">
              {steps.map((step, index) => (
                <li key={step.title} className="rounded-[28px] bg-white p-8">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-xl text-accent" aria-hidden="true">
                    {step.icon}
                  </div>
                  <p className="mt-6 text-sm font-semibold text-muted">Step {index + 1}</p>
                  <h3 className="mt-1 text-2xl font-semibold">{step.title}</h3>
                  <p className="mt-3 leading-[1.5] text-muted">{step.description}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <section id="features" className="py-20 md:py-28">
          <Container>
            <SectionHeading title="Everything you need to judge a setup." description="Every analysis comes back in the same clear format, so charts are easy to compare." />
            <div className="mx-auto mt-14 grid max-w-[1100px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-[28px] bg-canvas p-8">
                  <div className="text-[28px] text-accent" aria-hidden="true">{feature.icon}</div>
                  <h3 className="mt-5 text-[21px] font-semibold">{feature.title}</h3>
                  <p className="mt-2 leading-[1.5] text-muted">{feature.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-canvas py-20 md:py-28">
          <Container>
            <SectionHeading title="Built to be honest about risk." description="AI can read a chart quickly. It can't predict the future. GPT Chart View is designed around that." />
            <div className="mx-auto mt-14 grid max-w-[1100px] gap-5 md:grid-cols-2">
              {principles.map((item) => (
                <div key={item.title} className="flex gap-5 rounded-[28px] bg-white p-8">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xl text-accent" aria-hidden="true">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-[21px] font-semibold">{item.title}</h3>
                    <p className="mt-2 leading-[1.5] text-muted">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section id="pricing" className="py-20 md:py-28">
          <Container>
            <Pricing />
          </Container>
        </section>

        <section id="faq" className="bg-canvas py-20 md:py-28">
          <Container>
            <FAQ />
          </Container>
        </section>

        <section className="py-24 text-center md:py-32">
          <Container>
            <h2 className="text-balance text-[40px] font-semibold leading-[1.05] tracking-[-0.025em] md:text-[64px]">Try it on your next chart.</h2>
            <p className="mt-5 text-[19px] text-muted md:text-[21px]">3 free analyses. No card required.</p>
            <div className="mt-9 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8">
              <Link href="/signup" className={primaryButton}>
                Create free account
              </Link>
              <Link href="/login" className={textLink}>
                Log in
                <FiChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
