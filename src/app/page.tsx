import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing/Pricing";
import FAQ from "@/components/FAQ";
import Logos from "@/components/Logos";
import Benefits from "@/components/Benefits/Benefits";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Stats from "@/components/Stats";
import CTA from "@/components/CTA";
import { FiBarChart2, FiFileText, FiUploadCloud } from "react-icons/fi";

const workflowSteps = [
  {
    title: "Upload the chart",
    description: "A subscriber drops in a screenshot from their charting platform, broker, or phone.",
    icon: <FiUploadCloud size={28} />,
  },
  {
    title: "AI reads the setup",
    description: "GPT Chart View reviews trend, levels, candles, indicators, and visible market structure.",
    icon: <FiBarChart2 size={28} />,
  },
  {
    title: "Return a trade score",
    description: "The user receives a clear score, trade bias, risk notes, and next-step checklist.",
    icon: <FiFileText size={28} />,
  },
];

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <Logos />
      <Container>
        <Benefits />

        <Section
          id="workflow"
          title="How It Works"
          description="A simple subscription flow for traders: upload a chart, get an AI read, and decide whether the setup deserves action."
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {workflowSteps.map((step, index) => (
              <div key={step.title} className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                    {step.icon}
                  </div>
                  <span className="text-sm font-bold text-foreground-accent">0{index + 1}</span>
                </div>
                <h3 className="text-2xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-foreground-accent">{step.description}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="pricing"
          title="Subscription Plans"
          description="Sell access by monthly chart uploads, analysis depth, and priority."
        >
          <Pricing />
        </Section>

        <Section
          id="testimonials"
          title="Trader Feedback"
          description="Clear analysis output for traders, analysts, and trading communities."
        >
          <Testimonials />
        </Section>

        <FAQ />

        <Stats />
        
        <CTA />
      </Container>
    </>
  );
};

export default HomePage;
