import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiLock,
  FiMessageSquare,
  FiShield,
  FiTarget,
  FiUploadCloud,
  FiUserPlus,
} from "react-icons/fi";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import Pricing from "@/components/Pricing/Pricing";

const productCards = [
  {
    title: "Private chart workspace",
    description: "Each user gets their own uploads, credits, history, results, profile, billing, and chat records.",
    icon: <FiLock />,
  },
  {
    title: "AI trade score",
    description: "Every chart result produces setup direction, confidence, key levels, risk notes, and outcome tracking.",
    icon: <FiTarget />,
  },
  {
    title: "Saved decision trail",
    description: "Members can return to previous analyses, mark outcomes, and compare what worked over time.",
    icon: <FiClock />,
  },
];

const workflow = [
  ["Create account", "Signup unlocks the member dashboard. No account means no upload access."],
  ["Upload chart", "Add a screenshot, choose symbol and timeframe, then run analysis."],
  ["Review result", "Read signal, score, stop, targets, support, resistance, and risk/reward."],
  ["Track outcome", "Mark won, lost, or not taken so the dashboard becomes useful over time."],
];

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="overflow-hidden bg-[#f5f7fb]">
        <section className="relative pt-28 md:pt-32">
          <Container>
            <div className="grid min-h-[760px] items-center gap-12 py-12 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#dde4ef] bg-white px-4 py-2 text-sm font-extrabold text-[#304fff] shadow-sm">
                  <FiShield />
                  Members-only AI chart analysis
                </div>
                <h1 className="max-w-3xl text-5xl font-extrabold leading-tight text-[#101828] md:text-7xl">
                  Turn chart screenshots into a private trade review desk.
                </h1>
                <p className="mt-6 max-w-2xl text-xl leading-8 text-[#667085]">
                  GPT Chart View is not a public demo. Users create an account, upload chart images, get AI analysis, save results, chat about setups, and track outcomes inside their own dashboard.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/signup" className="inline-flex items-center justify-center gap-3 rounded-full bg-[#304fff] px-8 py-4 text-base font-extrabold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-[#243cc7]">
                    Join and analyze a chart
                    <FiArrowRight />
                  </Link>
                  <Link href="/login" className="inline-flex items-center justify-center gap-3 rounded-full border border-[#c8d3e2] bg-white px-8 py-4 text-base font-extrabold text-[#101828] transition-colors hover:border-[#304fff] hover:text-[#304fff]">
                    I already have access
                  </Link>
                </div>
                <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
                  {["No guest uploads", "User-specific history", "Real dashboard data"].map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#344054] shadow-sm">
                      <FiCheckCircle className="text-[#079455]" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-6 -top-6 h-28 w-28 rounded-3xl bg-primary" />
                <div className="absolute -bottom-6 -right-6 h-36 w-36 rounded-full bg-[#304fff]/15" />
                <div className="relative rounded-[2rem] border border-[#dde4ef] bg-white p-4 shadow-2xl">
                  <div className="rounded-[1.5rem] bg-[#101828] p-4 text-white">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <p className="text-sm text-[#98a2b3]">Live member result</p>
                        <h2 className="text-2xl font-extrabold">EUR/USD - 1h</h2>
                      </div>
                      <span className="rounded-full bg-primary px-3 py-1 text-sm font-extrabold text-black">82 score</span>
                    </div>
                    <div className="mt-5 overflow-hidden rounded-2xl">
                      <Image
                        src="/images/hero-chart.webp"
                        alt="Trading chart preview"
                        width={820}
                        height={460}
                        className="h-[260px] w-full object-cover"
                        priority
                        unoptimized
                      />
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-3">
                      <Metric label="Bias" value="Watch" />
                      <Metric label="R/R" value="1:2.4" />
                      <Metric label="Credits" value="2 left" />
                    </div>
                    <div className="mt-5 rounded-2xl bg-white p-4 text-[#101828]">
                      <p className="font-extrabold">AI note</p>
                      <p className="mt-1 text-sm text-[#667085]">Clean retest near support. Wait for confirmation before entry. Saved to this user&apos;s history.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section id="product" className="py-16">
          <Container>
            <div className="grid gap-6 lg:grid-cols-3">
              {productCards.map((card) => (
                <div key={card.title} className="rounded-3xl border border-[#dde4ef] bg-white p-7 shadow-sm">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef2ff] text-2xl text-[#304fff]">
                    {card.icon}
                  </div>
                  <h2 className="text-2xl font-extrabold">{card.title}</h2>
                  <p className="mt-3 text-[#667085]">{card.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section id="workflow" className="py-16">
          <Container>
            <div className="rounded-[2rem] bg-[#101828] p-6 text-white md:p-10">
              <div className="grid gap-8 lg:grid-cols-[0.75fr_1fr]">
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">Locked workflow</p>
                  <h2 className="mt-3 text-4xl font-extrabold">The homepage sells. The app works after signup.</h2>
                  <p className="mt-4 text-[#d0d5dd]">This makes the product feel real: the valuable actions are inside the member dashboard, not on a loose public demo page.</p>
                  <Link href="/signup" className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 font-extrabold text-black">
                    Unlock dashboard
                    <FiUserPlus />
                  </Link>
                </div>
                <div className="grid gap-4">
                  {workflow.map(([title, description], index) => (
                    <div key={title} className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:grid-cols-[64px_1fr]">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl font-extrabold text-[#101828]">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold">{title}</h3>
                        <p className="mt-1 text-[#d0d5dd]">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-16">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
              <div className="rounded-[2rem] border border-[#dde4ef] bg-white p-7 shadow-sm">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-secondary">Inside the app</p>
                    <h2 className="mt-2 text-4xl font-extrabold">A real dashboard for every user</h2>
                  </div>
                  <Link href="/signup" className="rounded-full bg-[#101828] px-6 py-3 font-extrabold text-white">Create yours</Link>
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-4">
                  <DashboardTile icon={<FiUploadCloud />} label="Uploads" value="private" />
                  <DashboardTile icon={<FiBarChart2 />} label="Results" value="saved" />
                  <DashboardTile icon={<FiMessageSquare />} label="AI chat" value="linked" />
                  <DashboardTile icon={<FiLock />} label="Session" value="secure" />
                </div>
              </div>
              <div className="rounded-[2rem] bg-primary p-7">
                <h2 className="text-3xl font-extrabold">Make the next click obvious.</h2>
                <p className="mt-3 text-[#4a3b00]">Every major button on this page sends the visitor to signup or login. The dashboard is protected and useful only after account creation.</p>
                <Link href="/signup" className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#101828] px-6 py-4 font-extrabold text-white">
                  Start free account
                  <FiArrowRight />
                </Link>
              </div>
            </div>
          </Container>
        </section>

        <section id="pricing" className="py-16">
          <Container>
            <Pricing />
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
};

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl bg-white/10 p-4">
    <p className="text-xs text-[#98a2b3]">{label}</p>
    <p className="mt-1 font-extrabold">{value}</p>
  </div>
);

const DashboardTile = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="rounded-2xl border border-[#edf1f7] bg-[#f9fafb] p-5">
    <div className="text-2xl text-[#304fff]">{icon}</div>
    <p className="mt-4 text-sm text-[#667085]">{label}</p>
    <p className="font-extrabold">{value}</p>
  </div>
);

export default HomePage;
