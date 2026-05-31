import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiCheckCircle,
  FiDatabase,
  FiLock,
  FiShield,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import Pricing from "@/components/Pricing/Pricing";

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

const workflow = [
  ["Upload", "Add a clean chart screenshot from TradingView, MT4, MT5, Binance, or your broker platform."],
  ["Analyze", "AI reads the image and returns bias, confidence, levels, volatility, and risk notes."],
  ["Review", "Ask follow-up questions in chat before deciding whether the setup is worth taking."],
  ["Track", "Mark won, lost, or not taken so your private history becomes a learning system."],
];

const stats = [
  ["20+", "AI trading guides"],
  ["3", "free trial credits"],
  ["60/day", "advanced plan uploads"],
  ["24/7", "member access"],
];

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
              poster="/favicon.png"
              aria-label="AI trading intelligence visual"
            >
              <source src="/video/gptchartview2.webm" type="video/webm" />
            </video>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,15,0.08)_0%,rgba(5,7,15,0.62)_56%,#05070f_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#05070f_0%,rgba(5,7,15,0.18)_34%,rgba(5,7,15,0.18)_66%,#05070f_100%)]" />
          </div>

          <Container>
            <div className="relative mx-auto flex min-h-[660px] max-w-5xl flex-col items-center justify-end pb-14 text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-extrabold text-white backdrop-blur">
                <FiZap className="text-[#16c7ff]" />
                AI-powered chart analysis workspace
              </div>
              <h1 className="max-w-5xl text-5xl font-extrabold leading-tight md:text-7xl">
                Turn market charts into
                <span className="block bg-[linear-gradient(90deg,#18c8ff,#d94cff)] bg-clip-text text-transparent">
                  trade-ready AI insights
                </span>
              </h1>
              <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-white/80 md:text-xl">
                Upload a chart, receive a structured AI trade score, review key levels, ask follow-up questions, and save every decision inside your private dashboard.
              </p>
              <div className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/signup" className="inline-flex items-center justify-center gap-3 rounded-lg bg-white px-8 py-4 font-extrabold text-[#05070f] transition-colors hover:bg-[#dff7ff]">
                  Start free analysis
                  <FiArrowRight />
                </Link>
                <Link href="/login" className="inline-flex items-center justify-center gap-3 rounded-lg border border-white/15 bg-white/10 px-8 py-4 font-extrabold text-white transition-colors hover:bg-white/15">
                  Member login
                </Link>
              </div>
            </div>
          </Container>
        </section>

        <section className="relative py-8">
          <Container>
            <p className="text-center text-sm font-extrabold uppercase text-white/60">Market ecosystem and infrastructure signals</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
              {brandLogos.map((logo, index) => (
                <div key={logo} className="flex h-20 items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] p-2">
                  <Image src={logo} alt={`Market ecosystem badge ${index + 1}`} width={200} height={72} className="h-full w-full object-contain opacity-80" />
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section id="product" className="py-24">
          <Container>
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-sm font-extrabold uppercase text-[#16c7ff]">AI chart intelligence</p>
              <h2 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
                More than a signal. A private review system for active traders.
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/62">
                GPT Chart View is built for traders who want visual AI analysis, risk notes, saved history, and a clear reason to take or skip a setup.
              </p>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {analysisModes.map((mode, index) => (
                <article key={mode.title} className={`min-h-[430px] rounded-lg border border-white/10 p-6 ${index === 0 ? "bg-[#14171b]" : index === 1 ? "bg-[#170d25]" : "bg-[#061d3b]"}`}>
                  <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-lg bg-white/10 text-3xl text-[#d94cff]">
                    {mode.icon}
                  </div>
                  <h3 className="text-2xl font-extrabold">{mode.title}</h3>
                  <p className="mt-4 leading-7 text-white/68">{mode.description}</p>
                  <div className="mt-10 border-t border-white/10 pt-6">
                    <p className="text-5xl font-extrabold">{mode.metric}</p>
                    <p className="mt-2 text-sm font-semibold text-white/55">{mode.metricLabel}</p>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section id="workflow" className="py-20">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <p className="text-sm font-extrabold uppercase text-[#16c7ff]">Inside the member app</p>
                <h2 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight md:text-6xl">
                  Analyze charts, chat with AI, and keep every decision synced.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
                  No loose public demo. Every upload belongs to the signed-in user, every result is saved, and credits follow the plan attached to that account.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {["Private uploads", "Saved results", "AI chat history", "Plan-based credits"].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4 font-bold">
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
                <div className="grid gap-3 border-t border-white/10 p-4 sm:grid-cols-4">
                  {workflow.map(([title, description], index) => (
                    <div key={title} className="rounded-lg bg-[#0b1020] p-4">
                      <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-extrabold text-[#05070f]">{index + 1}</div>
                      <h3 className="font-extrabold">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/58">{description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-20">
          <Container>
            <div className="rounded-lg border border-white/10 bg-[#090d18] p-6 md:p-10">
              <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr]">
                <div>
                  <p className="text-sm font-extrabold uppercase text-[#d94cff]">Performance workspace</p>
                  <h2 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
                    Built for education, discipline, and repeatable market review.
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {stats.map(([value, label]) => (
                    <div key={label} className="rounded-lg border border-white/10 bg-white/[0.035] p-6">
                      <p className="text-4xl font-extrabold bg-[linear-gradient(90deg,#18c8ff,#d94cff)] bg-clip-text text-transparent">{value}</p>
                      <p className="mt-2 text-sm font-semibold text-white/62">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section id="pricing" className="py-20">
          <Container>
            <Pricing />
          </Container>
        </section>

        <section className="py-20">
          <Container>
            <div className="grid gap-6 lg:grid-cols-[1fr_0.55fr]">
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 md:p-10">
                <p className="text-sm font-extrabold uppercase text-[#16c7ff]">Start now</p>
                <h2 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">Create your AI trading workspace.</h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
                  Get three trial chart analyses, then upgrade when your credits finish. Paid plans unlock daily limits based on the plan you choose.
                </p>
                <Link href="/signup" className="mt-8 inline-flex items-center justify-center gap-3 rounded-lg bg-white px-8 py-4 font-extrabold text-[#05070f] transition-colors hover:bg-[#dff7ff]">
                  Open dashboard
                  <FiArrowRight />
                </Link>
              </div>
              <div className="rounded-lg border border-white/10 bg-[#101626] p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/10 text-3xl text-[#21e7a4]">
                  <FiLock />
                </div>
                <h3 className="mt-8 text-2xl font-extrabold">Secure member access</h3>
                <p className="mt-4 leading-7 text-white/62">
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
