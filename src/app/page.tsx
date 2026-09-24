import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiCpu,
  FiDatabase,
  FiLayers,
  FiLock,
  FiMessageCircle,
  FiPercent,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiUploadCloud,
  FiZap,
} from "react-icons/fi";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import Pricing from "@/components/Pricing/Pricing";
import FAQ from "@/components/FAQ";
import ProductPreview from "@/components/ProductPreview";

const brandLogos = [
  "/brand/brand1.svg",
  "/brand/brand2.svg",
  "/brand/brand3.svg",
  "/brand/brand4.svg",
  "/brand/brand5.svg",
  "/brand/brand6.svg",
  "/brand/brand7.svg",
];

const analysisModes = [
  {
    title: "Chart Pulse",
    description: "Fast AI review of trend, structure, key levels, momentum, and trade quality from a clean chart screenshot.",
    metric: "82",
    metricLabel: "sample setup score",
    icon: <FiTrendingUp />,
  },
  {
    title: "Risk Engine",
    description: "Entry, stop, targets, risk/reward, volatility notes, and invalidation are mapped before the trade is considered.",
    metric: "1:2.4",
    metricLabel: "sample risk/reward",
    icon: <FiShield />,
  },
  {
    title: "Trade Memory",
    description: "Every upload, AI answer, chat note, and outcome is saved to the member account for later review.",
    metric: "3",
    metricLabel: "free trial analyses",
    icon: <FiDatabase />,
  },
];

const uploadSteps = [
  {
    title: "Upload your chart",
    description: "Drop in a screenshot from TradingView, MT4, MT5, Binance or your broker app.",
    icon: <FiUploadCloud />,
  },
  {
    title: "AI reads the chart",
    description: "It finds the trend, key levels and a possible entry, stop-loss and targets.",
    icon: <FiCpu />,
  },
  {
    title: "You make the call",
    description: "Check the plan, ask follow-up questions, and decide if the trade is worth it.",
    icon: <FiCheckCircle />,
  },
];

const workflow = [
  ["Upload", "Add a clean chart screenshot from TradingView, MT4, MT5, Binance, or your broker platform."],
  ["Analyze", "AI reads the image and returns bias, confidence, levels, volatility, and risk notes."],
  ["Review", "Ask follow-up questions in chat before deciding whether the setup is worth taking."],
  ["Track", "Mark won, lost, or not taken so your private history becomes a learning system."],
];

const analysisContents = [
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

const stats = [
  ["20+", "AI trading guides"],
  ["3", "free trial credits"],
  ["60/day", "advanced plan uploads"],
  ["24/7", "member access"],
];

const visionPillars = [
  {
    title: "Clarity",
    description: "Every result uses the same structure: bias, levels, entry, stop and targets, explained in plain language.",
    icon: <FiZap />,
  },
  {
    title: "Discipline",
    description: "Stops and targets are checked on every result, and risk/reward is calculated, never guessed.",
    icon: <FiShield />,
  },
  {
    title: "Honesty",
    description: "Educational analysis, not promises. The AI explains; you always make the final decision.",
    icon: <FiBookOpen />,
  },
];

const eyebrow = "text-xs font-semibold uppercase tracking-[0.14em]";
const sectionTitle = "text-balance text-[36px] font-semibold leading-[1.08] md:text-[56px]";
const sectionText = "text-[17px] leading-relaxed text-white/60 md:text-[21px] md:leading-[1.45]";

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="overflow-hidden bg-[#05070f] text-white">
        <section className="relative min-h-[760px] pt-24">
          <div className="absolute inset-x-0 top-0 h-[720px] overflow-hidden">
            <video
              className="h-full w-full object-cover opacity-75"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="AI trading intelligence visual"
            >
              <source src="/video/gptchartview2.webm" type="video/webm" />
            </video>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,15,0.08)_0%,rgba(5,7,15,0.62)_56%,#05070f_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#05070f_0%,rgba(5,7,15,0.18)_34%,rgba(5,7,15,0.18)_66%,#05070f_100%)]" />
          </div>

          <Container>
            <div className="relative mx-auto flex min-h-[660px] max-w-5xl flex-col items-center justify-end pb-14 text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                <FiZap className="text-[#16c7ff]" />
                AI-powered chart analysis workspace
              </div>
              <h1 className="max-w-5xl text-balance text-[44px] font-semibold leading-[1.06] sm:text-6xl md:text-[80px]">
                Turn market charts into
                <span className="block bg-[linear-gradient(90deg,#18c8ff,#d94cff)] bg-clip-text pb-[0.08em] text-transparent">
                  trade-ready AI insights
                </span>
              </h1>
              <p className="mt-5 max-w-3xl text-balance text-[17px] leading-relaxed text-white/75 md:text-[21px] md:leading-[1.45]">
                Upload a chart, receive a structured AI trade score, review key levels, ask follow-up questions, and save every decision inside your private dashboard.
              </p>
              <div className="mt-9 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/signup" className="inline-flex items-center justify-center gap-3 rounded-lg bg-white px-8 py-4 font-semibold text-[#05070f] transition-colors hover:bg-[#dff7ff]">
                  Start free analysis
                  <FiArrowRight />
                </Link>
                <Link href="/login" className="inline-flex items-center justify-center gap-3 rounded-lg border border-white/15 bg-white/10 px-8 py-4 font-semibold text-white transition-colors hover:bg-white/15">
                  Member login
                </Link>
              </div>
            </div>
          </Container>
        </section>

        <section className="relative py-8">
          <Container>
            <p className={`text-center text-white/50 ${eyebrow}`}>Market ecosystem and infrastructure signals</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {brandLogos.map((logo, index) => (
                <div key={logo} className="flex h-20 basis-[calc(50%-6px)] items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] p-2 sm:basis-[calc(33.333%-8px)] lg:flex-1 lg:basis-0">
                  <Image src={logo} alt={`Market ecosystem badge ${index + 1}`} width={200} height={72} className="h-full w-full object-contain opacity-80" />
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section id="product" className="py-24">
          <Container>
            <div className="mx-auto max-w-4xl text-center">
              <p className={`text-[#16c7ff] ${eyebrow}`}>AI chart intelligence</p>
              <h2 className={`mt-4 ${sectionTitle}`}>
                More than a signal. A private review system for active traders.
              </h2>
              <p className={`mx-auto mt-5 max-w-3xl ${sectionText}`}>
                GPT Chart View is built for traders who want visual AI analysis, risk notes, saved history, and a clear reason to take or skip a setup.
              </p>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {analysisModes.map((mode, index) => (
                <article key={mode.title} className={`flex flex-col rounded-lg border border-white/10 p-6 lg:min-h-[430px] ${index === 0 ? "bg-[#14171b]" : index === 1 ? "bg-[#170d25]" : "bg-[#061d3b]"}`}>
                  <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-lg bg-white/10 text-3xl text-[#d94cff] lg:mb-10">
                    {mode.icon}
                  </div>
                  <h3 className="text-2xl font-semibold">{mode.title}</h3>
                  <p className="mt-3 leading-relaxed text-white/70">{mode.description}</p>
                  <div className="mt-8 border-t border-white/10 pt-6 lg:mt-auto">
                    <p className="text-5xl font-semibold tracking-[-0.03em]">{mode.metric}</p>
                    <p className="mt-2 text-sm text-white/55">{mode.metricLabel}</p>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section id="how-it-works" className="relative py-24">
          <Image src="/frontpage/lightforsection.svg" alt="" width={1800} height={1114} className="pointer-events-none absolute left-1/2 top-[360px] w-[1400px] max-w-none -translate-x-1/2 opacity-40" aria-hidden="true" />
          <Container className="relative">
            <div className="mx-auto max-w-4xl text-center">
              <p className={`text-[#16c7ff] ${eyebrow}`}>How AI helps you trade</p>
              <h2 className={`mt-4 ${sectionTitle}`}>
                Upload a chart. Get a clear plan.
              </h2>
              <p className={`mx-auto mt-5 max-w-3xl ${sectionText}`}>
                GPT Chart View reads your screenshot the way an experienced analyst would: trend, structure, key levels and risk. Then it turns that into a plan you can check before you trade.
              </p>
            </div>

            <ol className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-3">
              {uploadSteps.map((step, index) => (
                <li key={step.title} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06] text-xl text-[#16c7ff] ring-1 ring-white/10" aria-hidden="true">
                    {step.icon}
                  </div>
                  <p className="mt-4 text-sm text-white/50">Step {index + 1}</p>
                  <h3 className="mt-1 text-xl font-semibold">{step.title}</h3>
                  <p className="mx-auto mt-2 max-w-xs leading-relaxed text-white/60">{step.description}</p>
                </li>
              ))}
            </ol>

            <div className="mt-16">
              <ProductPreview />
            </div>

            <p className="mx-auto mt-10 max-w-3xl text-center text-[15px] leading-relaxed text-white/50">
              Works with crypto, forex, stocks, indices and commodities, on screenshots from <span className="text-white/80">TradingView, MetaTrader 4, MetaTrader 5, Binance</span> and most broker apps.
            </p>
          </Container>
        </section>

        <section id="workflow" className="py-20">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <p className={`text-[#16c7ff] ${eyebrow}`}>Inside the member app</p>
                <h2 className={`mt-4 max-w-2xl ${sectionTitle}`}>
                  Analyze charts, chat with AI, and keep every decision synced.
                </h2>
                <p className={`mt-5 max-w-2xl ${sectionText}`}>
                  No loose public demo. Every upload belongs to the signed-in user, every result is saved, and credits follow the plan attached to that account.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {["Private uploads", "Saved results", "AI chat history", "Plan-based credits"].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4 font-medium">
                      <FiCheckCircle className="text-[#21e7a4]" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <video
                  className="aspect-video w-full rounded-lg object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="GPT Chart View product demo"
                >
                  <source src="/video/gptchartview.webm" type="video/webm" />
                </video>
                <div className="grid gap-3 border-t border-white/10 p-4 sm:grid-cols-2">
                  {workflow.map(([title, description], index) => (
                    <div key={title} className="rounded-lg bg-[#0b1020] p-4">
                      <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-semibold text-[#05070f]">{index + 1}</div>
                      <h3 className="font-semibold">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/60">{description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section id="features" className="py-24">
          <Container>
            <div className="mx-auto max-w-4xl text-center">
              <p className={`text-[#d94cff] ${eyebrow}`}>In every analysis</p>
              <h2 className={`mt-4 ${sectionTitle}`}>
                Everything you need to judge a setup.
              </h2>
              <p className={`mx-auto mt-5 max-w-3xl ${sectionText}`}>
                Every result comes back in the same clear format, so charts are easy to compare and easy to learn from.
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {analysisContents.map((item) => (
                <div key={item.title} className="rounded-[28px] bg-[#0d111c] p-8 ring-1 ring-white/[0.06]">
                  <div className="text-[28px] text-[#16c7ff]" aria-hidden="true">{item.icon}</div>
                  <h3 className="mt-5 text-[21px] font-semibold">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-white/60">{item.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-20">
          <Container>
            <div className="rounded-lg border border-white/10 bg-[#090d18] p-6 md:p-10">
              <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr]">
                <div>
                  <p className={`text-[#d94cff] ${eyebrow}`}>Performance workspace</p>
                  <h2 className="mt-4 text-balance text-[32px] font-semibold leading-[1.1] md:text-5xl">
                    Built for education, discipline, and repeatable market review.
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {stats.map(([value, label]) => (
                    <div key={label} className="rounded-lg border border-white/10 bg-white/[0.035] p-6">
                      <p className="bg-[linear-gradient(90deg,#18c8ff,#d94cff)] bg-clip-text text-4xl font-semibold tracking-[-0.03em] text-transparent">{value}</p>
                      <p className="mt-2 text-sm text-white/60">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section id="vision" className="relative py-28">
          <Image src="/frontpage/lightforsection.svg" alt="" width={1800} height={1114} className="pointer-events-none absolute left-1/2 top-0 w-[1400px] max-w-none -translate-x-1/2 opacity-30" aria-hidden="true" />
          <Container className="relative">
            <div className="mx-auto max-w-4xl text-center">
              <p className={`text-[#16c7ff] ${eyebrow}`}>Our vision</p>
              <h2 className="mt-4 text-balance text-[40px] font-semibold leading-[1.06] md:text-[64px]">
                Every trader deserves a{" "}
                <span className="bg-[linear-gradient(90deg,#18c8ff,#d94cff)] bg-clip-text pb-[0.08em] text-transparent">second opinion.</span>
              </h2>
              <p className={`mx-auto mt-6 max-w-3xl ${sectionText}`}>
                Professional traders have analysts and tools checking their ideas. Most traders have a chart and a gut feeling. We are building GPT Chart View to close that gap: an AI that reads any chart quickly, explains its reasoning in plain language, and always puts risk first.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl gap-10 md:grid-cols-3">
              {visionPillars.map((pillar) => (
                <div key={pillar.title} className="border-t border-white/10 pt-6">
                  <div className="text-2xl text-[#16c7ff]" aria-hidden="true">{pillar.icon}</div>
                  <h3 className="mt-4 text-xl font-semibold">{pillar.title}</h3>
                  <p className="mt-2 leading-relaxed text-white/60">{pillar.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section id="pricing" className="py-20">
          <Container>
            <Pricing />
          </Container>
        </section>

        <section id="faq" className="py-20">
          <Container>
            <div className="rounded-[28px] bg-[#0d111c] p-6 ring-1 ring-white/[0.06] md:p-12">
              <FAQ />
            </div>
          </Container>
        </section>

        <section className="py-20">
          <Container>
            <div className="grid gap-6 lg:grid-cols-[1fr_0.55fr]">
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 md:p-10">
                <p className={`text-[#16c7ff] ${eyebrow}`}>Start now</p>
                <h2 className={`mt-4 ${sectionTitle}`}>Create your AI trading workspace.</h2>
                <p className={`mt-5 max-w-2xl ${sectionText}`}>
                  Get three trial chart analyses, then upgrade when your credits finish. Paid plans unlock daily limits based on the plan you choose.
                </p>
                <Link href="/signup" className="mt-8 inline-flex items-center justify-center gap-3 rounded-lg bg-white px-8 py-4 font-semibold text-[#05070f] transition-colors hover:bg-[#dff7ff]">
                  Open dashboard
                  <FiArrowRight />
                </Link>
              </div>
              <div className="rounded-lg border border-white/10 bg-[#101626] p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/10 text-3xl text-[#21e7a4]">
                  <FiLock />
                </div>
                <h3 className="mt-8 text-2xl font-semibold">Secure member access</h3>
                <p className="mt-4 leading-relaxed text-white/60">
                  API keys stay server-side. User uploads, plan credits, billing, support tickets, and chart history are tied to each signed-in account.
                </p>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
